"""
Restaurant QR System — FastAPI Backend
Model loads from HuggingFace Hub automatically
Deploy on Render/Railway — no local files needed!
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import numpy as np
import json, pickle, os
from sentence_transformers import SentenceTransformer
from huggingface_hub import hf_hub_download

# ─────────────────────────────────────────
# APP INIT
# ─────────────────────────────────────────
app = FastAPI(
    title="🍽️ Restaurant QR System API",
    description="Smart AI-powered Restaurant Backend | Built by Rahul",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# LOAD FROM HUGGINGFACE HUB (auto, no local files)
# ─────────────────────────────────────────
HF_REPO = os.getenv("HF_REPO", "iconicrahul543/indian-food-recommender")

print(f"🔄 Loading model from HuggingFace: {HF_REPO}")
model = SentenceTransformer(HF_REPO)
print("✅ Model loaded!")

# Embeddings download
emb_path = hf_hub_download(repo_id=HF_REPO, filename="embeddings.pkl")
with open(emb_path, "rb") as f:
    embeddings = pickle.load(f)
print(f"✅ Embeddings loaded: {embeddings.shape}")

# Dataset download
dish_path = hf_hub_download(repo_id=HF_REPO, filename="dishes.json")
with open(dish_path) as f:
    menu_db = json.load(f)
print(f"✅ Menu loaded: {len(menu_db)} dishes")

# ─────────────────────────────────────────
# IN-MEMORY STORES
# ─────────────────────────────────────────
orders_db     = {}
order_counter = {"count": 1000}

tables_db = {
    f"T{i}": {
        "table_id": f"T{i}",
        "capacity": 4,
        "occupied": False,
        "guests":   0,
        "status":   "free"
    }
    for i in range(1, 11)
}

PRICE_MAP = {
    "flatbread": 80,  "breakfast": 100, "snack":     70,
    "starter":  150,  "main-course":220, "rice-dish":180,
    "side-dish": 60,  "condiment":  30, "soup":     120,
    "drink":     60,  "ice-cream":  80, "dessert":   90,
}

def get_price(dish):
    return dish.get("price") or PRICE_MAP.get(dish.get("category",""), 150)

def next_order_id():
    order_counter["count"] += 1
    return f"ORD{order_counter['count']}"

# ─────────────────────────────────────────
# INTENT DETECTION
# ─────────────────────────────────────────
def detect_intent(query: str) -> dict:
    q     = query.lower()
    words = q.split()
    return {
        "drink":     any(x in q for x in [
                         "drink","cold drink","juice","cola","lassi",
                         "chaas","thandai","shikanji","lemonade",
                         "beverage","panna","sharbat"]),
        "dessert":   any(x in q for x in [
                         "dessert","sweet","cake","halwa","gulab jamun",
                         "kheer","mithai","meetha","falooda","phirni",
                         "gujiya","mysore pak","qubani"]),
        "ice_cream": any(x in q for x in [
                         "ice cream","kulfi","gelato","scoop",
                         "butterscotch","vanilla ice","mango kulfi"]),
        "breakfast": any(x in q for x in [
                         "breakfast","morning","nashta","subah"]),
        "main":      any(x in q for x in [
                         "lunch","dinner","meal","khana",
                         "main course","curry","rice","biryani"]),
        "snack":     any(x in q for x in [
                         "snack","light","quick bite","evening"]),
        "starter":   any(x in q for x in [
                         "starter","appetizer","kebab","tikka"]),
        "veg":       ("veg" in words or "vegetarian" in words
                      or "pure veg" in q)
                     and "non" not in words
                     and "non-veg" not in q
                     and "nonveg" not in q,
        "non_veg":   any(x in q for x in [
                         "non veg","nonveg","non-veg","meat",
                         "mutton","fish","lamb","chicken","murgh","egg"]),
    }

# ─────────────────────────────────────────
# CORE RECOMMEND
# ─────────────────────────────────────────
def recommend(query_text, budget=None, veg_only=False,
              spice_pref=None, exclude_category=None, top_n=3):

    intents       = detect_intent(query_text)
    filtered      = []
    filtered_embs = []

    for i, dish in enumerate(menu_db):
        cat   = dish.get("category",  "").lower()
        ft    = dish.get("food_type", "").lower()
        price = get_price(dish)

        # Category intent filter
        if intents["drink"] and intents["dessert"]:
            if cat not in ["drink","dessert"]: continue
        elif intents["drink"] and intents["ice_cream"]:
            if cat not in ["drink","ice-cream"]: continue
        elif intents["ice_cream"]:
            if cat != "ice-cream": continue
        elif intents["drink"]:
            if cat != "drink": continue
        elif intents["dessert"]:
            if cat != "dessert": continue
        elif intents["breakfast"]:
            if cat != "breakfast": continue
        elif intents["snack"]:
            if cat != "snack": continue
        elif intents["starter"]:
            if cat != "starter": continue
        elif intents["main"]:
            if cat not in ["main-course","rice-dish"]: continue

        # Food type filter
        if intents["veg"]     and ft != "veg": continue
        if intents["non_veg"] and ft == "veg": continue
        if veg_only           and ft != "veg": continue

        # Extra filters
        if budget           and price > budget: continue
        if spice_pref       and dish.get("spice_level","").lower() != spice_pref.lower(): continue
        if exclude_category and cat == exclude_category.lower(): continue
        if not dish.get("available", True): continue

        filtered.append(dish)
        filtered_embs.append(embeddings[i])

    if not filtered:
        return [{"dish":"Koi dish nahi mili!","category":"-",
                 "food_type":"-","spice_level":"-","price":0,
                 "pairs_with":[],"score":0.0}]

    query_emb     = model.encode([query_text])[0]
    filtered_embs = np.array(filtered_embs)
    scores        = np.dot(filtered_embs, query_emb) / (
                        np.linalg.norm(filtered_embs, axis=1) *
                        np.linalg.norm(query_emb) + 1e-8)
    top_idx = np.argsort(scores)[-top_n:][::-1]

    return [{
        "dish":        filtered[i].get("dish",        "?"),
        "category":    filtered[i].get("category",    "-"),
        "food_type":   filtered[i].get("food_type",   "-"),
        "spice_level": filtered[i].get("spice_level", "-"),
        "price":       get_price(filtered[i]),
        "pairs_with":  filtered[i].get("pairs_with",  []),
        "score":       round(float(scores[i]), 3)
    } for i in top_idx]

# ═══════════════════════════════════════════
# REQUEST MODELS
# ═══════════════════════════════════════════
class RecommendReq(BaseModel):
    query:            str
    budget:           Optional[int]  = None
    veg_only:         bool           = False
    spice_pref:       Optional[str]  = None
    exclude_category: Optional[str]  = None
    top_n:            int            = 3

class BudgetReq(BaseModel):
    budget:   int
    veg_only: bool = False

class CartItem(BaseModel):
    dish_id:      str
    dish_name:    str
    quantity:     int
    price:        int
    spice_pref:   Optional[str]  = None
    addons:       Optional[List[str]] = []
    special_note: Optional[str]  = None

class OrderReq(BaseModel):
    table_id:       str
    guest_count:    int
    items:          List[CartItem]
    payment_method: str = "pay_at_counter"

class StatusReq(BaseModel):
    status: str

class CheckinReq(BaseModel):
    guests: int

class AddDishReq(BaseModel):
    id:          str
    dish:        str
    region:      str
    food_type:   str
    spice_level: str
    category:    str
    meal_type:   List[str]
    tags:        List[str]
    pairs_with:  List[str]
    description: str
    price:       int
    available:   bool = True

# ═══════════════════════════════════════════
# ROUTES — ROOT
# ═══════════════════════════════════════════
@app.get("/")
def root():
    return {
        "message": "🍽️ Restaurant QR System API is LIVE!",
        "docs":    "/docs",
        "status":  "running",
        "dishes":  len(menu_db),
        "tables":  len(tables_db)
    }

# ═══════════════════════════════════════════
# ROUTES — AI
# ═══════════════════════════════════════════
@app.post("/ai/recommend")
def ai_recommend(req: RecommendReq):
    results = recommend(
        query_text=req.query, budget=req.budget,
        veg_only=req.veg_only, spice_pref=req.spice_pref,
        exclude_category=req.exclude_category, top_n=req.top_n
    )
    return {"status":"ok", "query":req.query, "results":results}


@app.post("/ai/budget-query")
def budget_query(req: BudgetReq):
    affordable = sorted(
        [d for d in menu_db
         if get_price(d) <= req.budget
         and (not req.veg_only or d.get("food_type","").lower()=="veg")
         and d.get("available", True)],
        key=get_price, reverse=True
    )
    if not affordable:
        return {"status":"empty",
                "message":f"₹{req.budget} mein koi dish nahi!","options":[]}
    return {
        "status":  "ok",
        "message": f"₹{req.budget} mein yeh mil sakta hai:",
        "options": [{"dish":d.get("dish"),"category":d.get("category"),
                     "food_type":d.get("food_type"),"price":get_price(d)}
                    for d in affordable[:6]]
    }

# ═══════════════════════════════════════════
# ROUTES — MENU
# ═══════════════════════════════════════════
@app.get("/menu/")
def get_menu():
    return {"status":"ok","total":len(menu_db),
            "menu":[{**d,"price":get_price(d)} for d in menu_db]}

@app.get("/menu/categories")
def get_categories():
    cats = sorted(set(d.get("category","") for d in menu_db))
    return {"status":"ok","categories":cats}

@app.get("/menu/category/{category}")
def get_by_category(category: str):
    items = [{**d,"price":get_price(d)} for d in menu_db
             if d.get("category","").lower()==category.lower()
             and d.get("available",True)]
    if not items:
        raise HTTPException(404, f"'{category}' mein koi dish nahi!")
    return {"status":"ok","category":category,"items":items}

@app.post("/menu/add")
def add_dish(req: AddDishReq):
    if any(d.get("id")==req.id for d in menu_db):
        raise HTTPException(400, f"ID '{req.id}' already exists!")
    menu_db.append(req.dict())
    return {"status":"ok","message":f"✅ '{req.dish}' add ho gaya!"}

@app.patch("/menu/toggle/{dish_id}")
def toggle_dish(dish_id: str):
    for d in menu_db:
        if d.get("id")==dish_id:
            d["available"] = not d.get("available",True)
            s = "available" if d["available"] else "unavailable"
            return {"status":"ok","message":f"✅ '{d['dish']}' ab {s} hai"}
    raise HTTPException(404, f"'{dish_id}' nahi mila!")

@app.delete("/menu/remove/{dish_id}")
def remove_dish(dish_id: str):
    for i,d in enumerate(menu_db):
        if d.get("id")==dish_id:
            removed = menu_db.pop(i)
            return {"status":"ok","message":f"✅ '{removed['dish']}' remove ho gaya!"}
    raise HTTPException(404, f"'{dish_id}' nahi mila!")

# ═══════════════════════════════════════════
# ROUTES — ORDERS
# ═══════════════════════════════════════════
@app.post("/orders/place")
def place_order(req: OrderReq):
    if req.table_id.upper() not in tables_db:
        raise HTTPException(404, f"Table '{req.table_id}' nahi mila!")
    total    = sum(i.price * i.quantity for i in req.items)
    order_id = next_order_id()
    order    = {
        "order_id":       order_id,
        "table_id":       req.table_id.upper(),
        "guest_count":    req.guest_count,
        "items":          [i.dict() for i in req.items],
        "total_bill":     total,
        "payment_method": req.payment_method,
        "status":         "received",
        "placed_at":      datetime.now().isoformat(),
        "updated_at":     datetime.now().isoformat(),
    }
    orders_db[order_id] = order
    t = tables_db[req.table_id.upper()]
    t["occupied"] = True
    t["guests"]   = req.guest_count
    t["status"]   = "occupied"
    return {"status":"ok","order_id":order_id,
            "message":f"✅ Order placed! Bill: ₹{total}","order":order}

@app.get("/orders/kitchen")
def kitchen_view():
    active = sorted(
        [o for o in orders_db.values() if o["status"] in ["received","preparing","ready"]],
        key=lambda x: x["placed_at"]
    )
    return {"status":"ok","active_orders":len(active),"orders":active}

@app.get("/orders/all")
def all_orders():
    all_o = sorted(orders_db.values(), key=lambda x:x["placed_at"], reverse=True)
    return {"status":"ok","total":len(all_o),"orders":all_o}

@app.get("/orders/table/{table_id}")
def orders_by_table(table_id: str):
    o = sorted([o for o in orders_db.values()
                if o["table_id"]==table_id.upper()],
               key=lambda x:x["placed_at"], reverse=True)
    return {"status":"ok","orders":o}

@app.patch("/orders/status/{order_id}")
def update_status(order_id: str, req: StatusReq):
    valid = ["received","preparing","ready","delivered"]
    if req.status not in valid:
        raise HTTPException(400, f"Valid status: {valid}")
    if order_id not in orders_db:
        raise HTTPException(404, f"'{order_id}' nahi mila!")
    orders_db[order_id]["status"]     = req.status
    orders_db[order_id]["updated_at"] = datetime.now().isoformat()
    return {"status":"ok","message":f"✅ {order_id} → '{req.status}'",
            "order":orders_db[order_id]}

@app.get("/orders/{order_id}")
def get_order(order_id: str):
    if order_id not in orders_db:
        raise HTTPException(404, f"'{order_id}' nahi mila!")
    return {"status":"ok","order":orders_db[order_id]}

# ═══════════════════════════════════════════
# ROUTES — TABLES
# ═══════════════════════════════════════════
@app.get("/tables/")
def get_tables():
    return {"status":"ok","tables":list(tables_db.values())}

@app.get("/tables/available")
def available_tables():
    free = [t for t in tables_db.values() if t["status"]=="free"]
    return {"status":"ok","count":len(free),"tables":free}

@app.get("/tables/{table_id}")
def get_table(table_id: str):
    tid = table_id.upper()
    if tid not in tables_db:
        raise HTTPException(404, f"Table '{tid}' nahi mila!")
    return {"status":"ok","table":tables_db[tid]}

@app.patch("/tables/{table_id}/checkin")
def checkin(table_id: str, req: CheckinReq):
    tid = table_id.upper()
    if tid not in tables_db:
        raise HTTPException(404, f"Table '{tid}' nahi mila!")
    tables_db[tid].update({"occupied":True,"guests":req.guests,"status":"occupied"})
    return {"status":"ok","message":f"✅ Table {tid} — {req.guests} guests!",
            "table":tables_db[tid]}

@app.patch("/tables/{table_id}/free")
def free_table(table_id: str):
    tid = table_id.upper()
    if tid not in tables_db:
        raise HTTPException(404, f"Table '{tid}' nahi mila!")
    tables_db[tid].update({"occupied":False,"guests":0,"status":"free"})
    for o in orders_db.values():
        if o["table_id"] == tid and o["status"] == "delivered":
            o["status"] = "completed"
    return {"status":"ok","message":f"✅ Table {tid} free hai!","table":tables_db[tid]}
