# 🍽️ SmartMenu — AI-Powered Restaurant/Hotel QR System

> **Full-stack AI Restaurant/Hotel Management System** with smart food recommendations, real-time kitchen dashboard, and QR-based ordering — built from scratch using FastAPI, React, and Sentence Transformers.

<br/>

[![Live API](https://img.shields.io/badge/Live%20API-Render-46E3B7?style=for-the-badge&logo=render)](https://smartmenu-qr-ai.onrender.com/docs)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel)](https://smart-menu-qr-ai.vercel.app)
[![Model](https://img.shields.io/badge/Model-HuggingFace-FFD21E?style=for-the-badge&logo=huggingface)](https://huggingface.co/iconicrahul543/indian-food-recommender)
[![GitHub](https://img.shields.io/badge/Backend-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Rahul543-ux/SmartMenu-QR-AI)

<br/>

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| 🌐 Frontend Demo | https://smart-menu-qr-ai.vercel.app |
| 📋 API Swagger Docs | https://smartmenu-qr-ai.onrender.com/docs |
| 🤗 AI Model (HuggingFace) | https://huggingface.co/iconicrahul543/indian-food-recommender |

<br/>

---

## 📱 What is SmartMenu?

SmartMenu is a **production-ready AI restaurant/Hotel system** where customers scan a QR code on their table or Room, browse the menu, ask an AI waiter for recommendations, and place orders — all from their phone. Kitchen staff get a live dashboard with timers, and admins can manage the full menu in real time.

**The Problem it Solves:**
- Traditional menus are static — SmartMenu delivers
  AI-powered personalization in real time
- Kitchen staff rely on paper or verbal communication
  — a live dashboard with timers eliminates the chaos
- Customers with tight budgets have no guidance
  — SmartMenu's AI suggests the best options within
  their exact budget
- Eliminates repeated waiter interruptions like
  "Sir, what would you like to order?", allowing
  guests to order comfortably at their own pace
- Solves the constant hotel reception calls for room
  food orders, reducing call traffic and making room
  service seamless through QR ordering

**SmartMenu fixes all five.**

<br/>

---

## ✨ Features

### 👤 Customer Table (QR Ordering)
- Scan QR code → Auto-detect table
- Select number of guests
- Browse full North + South Indian menu (87 dishes)
- **AI Waiter** — type anything in natural language
  - *"spicy non-veg dinner"* → AI recommends 3 dishes
  - *"mere paas ₹150 hai, kya milega?"* → Budget-aware suggestions
- Add to cart with quantity control
- Special instructions per item
- Pay at counter / Pay Now (mock)
- Track active order status live

### 👨‍🍳 Kitchen Dashboard
- Live order feed (auto-refreshes every 10s)
- Real-time countdown timer per order
  - 🟢 0–8 min | 🟡 8–15 min | 🔴 15+ min (urgent)
- Strict order flow: **Received → Cooking → Ready → Delivered**
- Table auto-frees on Completed

### ⚙️ Admin Panel
- Menu management — toggle dish ON/OFF
- Add new dishes with full form
- View all orders with status + bill
- Table occupancy overview
- Revenue tracker

### 🤖 AI Recommendation Engine
- Fine-tuned **Sentence Transformer** (`all-MiniLM-L6-v2`) on 87 Indian dishes
- Smart **Intent Detection** — understands natural language
  - Veg / Non-veg detection (word boundary safe)
  - Category routing (drink, dessert, breakfast, main course...)
  - Budget filtering
  - Spice preference matching
- **Precision@7 = 0.80** on internal test set
- Hosted on HuggingFace Hub — loads automatically at startup

<br/>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Styling** | Pure CSS (no framework) — Dark luxury theme |
| **Backend** | FastAPI (Python) |
| **AI Model** | Sentence Transformers (`all-MiniLM-L6-v2`) |
| **Model Hosting** | HuggingFace Hub |
| **Frontend Deploy** | Vercel (auto-deploy from GitHub) |
| **Backend Deploy** | Render (auto-deploy from GitHub) |
| **Dataset** | Custom 87-dish Indian food dataset (hand-crafted) |

<br/>

---

## 🧠 AI Pipeline

```
User Query (natural language)
         ↓
Intent Detection (rule-based NLP)
→ veg/non-veg, category, spice level, budget
         ↓
Hard Filters (rule-based)
→ food_type, budget, availability
         ↓
Semantic Similarity (fine-tuned Sentence Transformer)
→ cosine similarity on dish descriptions
         ↓
Top-N Recommendations
```

**Why not fine-tune with LoRA?**
Sentence Transformers are embedding models — LoRA is for generative LLMs. Using the right tool for the right job is a senior engineering decision. For a menu of <100 dishes, pre-trained embeddings + smart filtering outperform unnecessary fine-tuning.

**Why not full fine-tune?**
87 dishes = small dataset. Fine-tuning on small data causes overfitting. Hybrid retrieval (embeddings + rules) gives better generalization and production stability.

<br/>

---

## 📂 Project Structure

```
SmartMenu/
│
├── backend/                        ← FastAPI (deployed on Render)
│   ├── main.py                     ← All routes + AI logic
│   ├── requirements.txt
│   ├── Procfile
│   ├── render.yaml
│   └── .python-version             ← Python 3.11.0
│
├── frontend/                       ← React + Vite (deployed on Vercel)
│   ├── src/
│   │   ├── App.jsx                 ← Router + Demo landing page
│   │   ├── main.jsx                ← React entry point
│   │   ├── customer_table.jsx      ← Customer QR ordering UI
│   │   ├── kitchen_dashboard.jsx   ← Kitchen live orders
│   │   └── admin_dashboard.jsx     ← Admin control panel
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── ai/                             ← Model training (Kaggle)
    ├── dishes_dataset_final.json   ← 87 North + South Indian dishes
    └── training_notebook.ipynb     ← Kaggle training pipeline
```

<br/>

---

## 🍛 Dataset

**87 handcrafted Indian dishes** across 2 regions and 12 categories:

| Region | Count |
|---|---|
| North Indian | 56 |
| South Indian | 31 |

| Category | Examples |
|---|---|
| Main Course | Butter Chicken, Palak Paneer, Hyderabadi Biryani |
| Breakfast | Masala Dosa, Idli, Upma, Aloo Paratha |
| Starter | Paneer Tikka, Chicken 65, Seekh Kebab |
| Dessert | Gulab Jamun, Phirni, Mysore Pak |
| Ice Cream | Kulfi, Kesar, Mango Kulfi |
| Drinks | Mango Lassi, Aam Panna, Kokum Sharbat |

Each dish includes: `food_type`, `spice_level`, `category`, `region`, `meal_type`, `tags`, `pairs_with`, `description`, `price`

<br/>

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/ai/recommend` | AI dish recommendation |
| `POST` | `/ai/budget-query` | Budget-aware suggestions |
| `GET` | `/menu/` | Full menu |
| `GET` | `/menu/category/{cat}` | Category filter |
| `POST` | `/menu/add` | Add dish (Admin) |
| `PATCH` | `/menu/toggle/{id}` | Toggle availability |
| `DELETE` | `/menu/remove/{id}` | Remove dish |
| `POST` | `/orders/place` | Place order |
| `GET` | `/orders/kitchen` | Live kitchen feed |
| `GET` | `/orders/all` | Order history |
| `PATCH` | `/orders/status/{id}` | Update order status |
| `GET` | `/tables/` | All tables |
| `PATCH` | `/tables/{id}/checkin` | Guest check-in |
| `PATCH` | `/tables/{id}/free` | Free table |

> 📖 Full interactive docs: https://smartmenu-qr-ai.onrender.com/docs

<br/>

---

## 📊 AI Performance

| Metric | Score |
|---|---|
| Precision@7 | **0.80** |
| Intent Detection | Veg/Non-veg, Category, Budget, Spice |
| Dataset Size | 87 dishes |
| Model Parameters | ~22M |
| Embedding Dimension | 384 |

<br/>

---

## 🗺️ Roadmap — Phase 2 (Next Upgrades)

```
🔐 Authentication
   └── Admin login (JWT)
   └── Role-based access (admin / kitchen / customer)

🔥 Real-time WebSocket
   └── Kitchen dashboard → instant push (no polling)
   └── Customer → live order status updates

🗄️ Firebase / Supabase
   └── Persistent orders + menu (no in-memory)
   └── Order history analytics

📊 Demand Prediction
   └── LSTM model → "Paneer Tikka demand high today"
   └── Admin gets stock alerts

💬 Review Sentiment Analysis
   └── DistilBERT fine-tune on restaurant reviews
   └── Per-dish sentiment score on admin panel

💳 Real Payment Integration
   └── Razorpay / UPI gateway

🌐 Multi-language Support
   └── Hindi + English menu toggle
```

<br/>

---

## ⚙️ Local Setup

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000/docs

# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> **Note:** Set `HF_REPO` environment variable to your HuggingFace model repo before running backend.

<br/>

---

## 🤗 Model on HuggingFace

The recommendation model is publicly available:

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("iconicrahul543/indian-food-recommender")
embeddings = model.encode(["Butter Chicken", "Masala Dosa"])
```

<br/>

---

## 👨‍💻 Author

**Rahul Prasad**
📅 Created: 28/04/2026

- 🤗 HuggingFace: [iconicrahul543](https://huggingface.co/iconicrahul543)
- 💻 GitHub: [Rahul543-ux](https://github.com/Rahul543-ux)
- 🔗 LinkedIn: *(https://www.linkedin.com/in/rahul-prasad-ai)*

<br/>

---

## 📜 Certifications (AI/ML Background)

| Course | Platform |
|---|---|
| Machine Learning Specialization | DeepLearning.AI |
| Deep Learning Specialization | DeepLearning.AI |
| Generative AI with LLMs | DeepLearning.AI |
| Agentic AI | DeepLearning.AI |

<br/>

---

> *"Built to solve a real problem — not just to check a portfolio box."*
>
> — Rahul Prasad, 2026
