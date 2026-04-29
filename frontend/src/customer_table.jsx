import { useState, useEffect, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────
const API = "https://smartmenu-qr-ai.onrender.com";

// ─── STYLES ───────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0f0e0c;
    --surface:   #1a1814;
    --card:      #221f1a;
    --border:    #2e2a24;
    --gold:      #c9a84c;
    --gold-lite: #e8c97a;
    --text:      #f0ece4;
    --muted:     #7a7060;
    --red:       #e05252;
    --green:     #52b788;
    --radius:    14px;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  /* ── SPLASH ── */
  .splash {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 50% 0%, #2a2010 0%, var(--bg) 70%);
    padding: 32px 24px;
    text-align: center;
  }

  .splash-logo {
    font-family: 'Playfair Display', serif;
    font-size: 52px;
    font-weight: 900;
    color: var(--gold);
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 8px;
  }

  .splash-tagline {
    color: var(--muted);
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 48px;
  }

  .table-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 380px;
    margin-bottom: 32px;
  }

  .table-btn {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
  }

  .table-btn:hover, .table-btn.selected {
    border-color: var(--gold);
    background: #2a2010;
    color: var(--gold);
    transform: translateY(-2px);
  }

  .table-btn .t-num {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    display: block;
    margin-bottom: 2px;
  }

  .guest-selector {
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 50px;
    padding: 8px 20px;
    margin-bottom: 32px;
  }

  .guest-btn {
    background: none;
    border: none;
    color: var(--gold);
    font-size: 22px;
    cursor: pointer;
    line-height: 1;
    padding: 4px 8px;
  }

  .guest-count {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    min-width: 40px;
    text-align: center;
  }

  /* ── MAIN BUTTON ── */
  .btn-primary {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-lite) 100%);
    color: #0f0e0c;
    border: none;
    border-radius: 50px;
    padding: 16px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    max-width: 320px;
    transition: transform 0.15s, opacity 0.15s;
  }

  .btn-primary:hover { transform: translateY(-2px); opacity: 0.92; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── HEADER ── */
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(15,14,12,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-brand {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--gold);
  }

  .header-table {
    font-size: 12px;
    color: var(--muted);
    text-align: right;
  }

  .header-table strong { color: var(--text); font-size: 14px; display: block; }

  /* ── TABS ── */
  .tabs {
    display: flex;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tab {
    flex: 1;
    min-width: 80px;
    padding: 14px 8px;
    border: none;
    background: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    text-align: center;
  }

  .tab.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
  }

  /* ── AI BAR ── */
  .ai-bar {
    background: linear-gradient(135deg, #1a1610 0%, #221a08 100%);
    border: 1px solid #3a3018;
    border-radius: var(--radius);
    margin: 16px;
    padding: 16px;
  }

  .ai-bar-title {
    font-size: 11px;
    color: var(--gold);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ai-bar form {
    display: flex;
    gap: 8px;
  }

  .ai-input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
  }

  .ai-input:focus { border-color: var(--gold); }
  .ai-input::placeholder { color: var(--muted); }

  .ai-go {
    background: var(--gold);
    color: #0f0e0c;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: opacity 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .ai-go:hover { opacity: 0.85; }

  .ai-results {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ai-result-chip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .ai-result-chip:hover { border-color: var(--gold); }

  .ai-chip-name { font-weight: 500; }
  .ai-chip-meta { color: var(--muted); font-size: 11px; margin-top: 2px; }

  .ai-chip-price {
    color: var(--gold);
    font-weight: 600;
    font-size: 14px;
  }

  /* ── MENU ── */
  .menu-container { padding: 0 16px 100px; }

  .cat-label {
    font-size: 11px;
    color: var(--gold);
    text-transform: uppercase;
    letter-spacing: 3px;
    padding: 20px 0 12px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 12px;
  }

  .dish-card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid #1e1c18;
  }

  .dish-info { flex: 1; }

  .dish-name {
    font-size: 15px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 4px;
  }

  .dish-desc {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.5;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .dish-tags { display: flex; gap: 6px; flex-wrap: wrap; }

  .tag {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tag-veg     { background: #0d2b1a; color: #52b788; border: 1px solid #1a4d32; }
  .tag-nonveg  { background: #2b0d0d; color: #e05252; border: 1px solid #4d1a1a; }
  .tag-egg     { background: #2b240d; color: #e0b852; border: 1px solid #4d3e1a; }
  .tag-spice   { background: #1a1410; color: #c9a84c; border: 1px solid #2e2418; }

  .dish-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    min-width: 80px;
  }

  .dish-price {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--gold);
  }

  .dish-price span { font-size: 12px; font-family: 'DM Sans', sans-serif; font-weight: 400; }

  /* ── ADD BUTTON ── */
  .add-btn {
    background: none;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    width: 36px;
    height: 36px;
    font-size: 22px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-btn:hover { border-color: var(--gold); color: var(--gold); }

  .qty-ctrl {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid var(--gold);
    border-radius: 8px;
    overflow: hidden;
  }

  .qty-btn {
    background: none;
    border: none;
    color: var(--gold);
    width: 30px;
    height: 32px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qty-num {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    min-width: 20px;
    text-align: center;
  }

  /* ── CART FAB ── */
  .cart-fab {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-lite) 100%);
    color: #0f0e0c;
    border: none;
    border-radius: 50px;
    padding: 16px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 8px 32px rgba(201,168,76,0.35);
    transition: transform 0.15s;
    white-space: nowrap;
    z-index: 50;
  }

  .cart-fab:hover { transform: translateX(-50%) translateY(-3px); }

  .cart-badge {
    background: #0f0e0c;
    color: var(--gold);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  /* ── CART SHEET ── */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 200;
    display: flex;
    align-items: flex-end;
  }

  .sheet {
    background: var(--surface);
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 20px;
    border-top: 1px solid var(--border);
  }

  .sheet-handle {
    width: 40px;
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    margin: 0 auto 20px;
  }

  .sheet-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--gold);
    margin-bottom: 20px;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }

  .cart-item-name { font-size: 14px; font-weight: 500; }
  .cart-item-sub  { font-size: 12px; color: var(--muted); margin-top: 2px; }

  .cart-item-right { text-align: right; }
  .cart-item-total { color: var(--gold); font-weight: 600; font-size: 15px; }

  .cart-total-row {
    display: flex;
    justify-content: space-between;
    padding: 16px 0 8px;
    font-size: 18px;
    font-weight: 600;
  }

  .cart-total-amt {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: var(--gold);
    font-weight: 700;
  }

  /* ── SPECIAL NOTE ── */
  .note-input {
    width: 100%;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    resize: none;
    outline: none;
    margin: 12px 0;
    height: 70px;
  }

  .note-input:focus { border-color: var(--gold); }
  .note-input::placeholder { color: var(--muted); }

  /* ── PAYMENT OPTIONS ── */
  .pay-opts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin: 16px 0;
  }

  .pay-opt {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .pay-opt.active { border-color: var(--gold); background: #2a2010; }

  .pay-opt-icon { font-size: 24px; display: block; margin-bottom: 4px; }
  .pay-opt-label { font-size: 12px; font-weight: 500; color: var(--text); }
  .pay-opt-sub { font-size: 11px; color: var(--muted); }

  /* ── STATUS PAGE ── */
  .status-page {
    min-height: 100vh;
    background: radial-gradient(ellipse at 50% 30%, #1a2010 0%, var(--bg) 70%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    text-align: center;
  }

  .status-icon { font-size: 64px; margin-bottom: 20px; }

  .status-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: var(--green);
    margin-bottom: 8px;
  }

  .status-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; }

  .order-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    width: 100%;
    max-width: 360px;
    margin-bottom: 24px;
    text-align: left;
  }

  .order-id {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .status-steps {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
  }

  .step-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--muted);
    border: 1px solid var(--border);
  }

  .step-dot.done { background: var(--green); border-color: var(--green); color: white; }
  .step-dot.active { background: var(--gold); border-color: var(--gold); color: #0f0e0c; animation: pulse 1.5s infinite; }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
  }

  .step-label { font-size: 10px; color: var(--muted); text-align: center; }

  .step-line {
    flex: 1;
    height: 1px;
    background: var(--border);
    margin-top: 14px;
    align-self: flex-start;
  }

  /* ── LOADING ── */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--muted);
    gap: 10px;
    font-size: 14px;
  }

  .spin {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }

  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-txt { font-size: 14px; }

  .btn-outline {
    background: none;
    border: 1px solid var(--gold);
    color: var(--gold);
    border-radius: 50px;
    padding: 12px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 12px;
    width: 100%;
    max-width: 320px;
  }

  .btn-outline:hover { background: #2a2010; }

  .toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--green);
    color: white;
    padding: 10px 24px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    z-index: 999;
    animation: fadeInOut 2.5s forwards;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// ─── CATEGORIES (display order) ─────────────────────────────
const CAT_ORDER = [
  "breakfast","flatbread","main-course","rice-dish",
  "starter","snack","soup","side-dish","condiment",
  "dessert","ice-cream","drink"
];

const CAT_EMOJI = {
  breakfast:"🌅", flatbread:"🫓", "main-course":"🍛",
  "rice-dish":"🍚", starter:"🥗", snack:"🫘",
  soup:"🥣", "side-dish":"🫙", condiment:"🌿",
  dessert:"🍮", "ice-cream":"🍦", drink:"🥤"
};

// ─── HELPERS ────────────────────────────────────────────────
const groupByCategory = (dishes) => {
  const grouped = {};
  CAT_ORDER.forEach(cat => { grouped[cat] = []; });
  dishes.forEach(d => {
    const c = d.category || "other";
    if (!grouped[c]) grouped[c] = [];
    grouped[c].push(d);
  });
  return grouped;
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
const fmtCat     = (c) => c.replace(/-/g," ").replace(/\b\w/g, l => l.toUpperCase());

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function CustomerTable() {
  // State
  const [phase, setPhase] = useState("splash");
  const [tableId, setTableId] = useState(null);
  const [guests, setGuests] = useState(2);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [note, setNote] = useState("");
  const [payMethod, setPayMethod] = useState("pay_at_counter");
  const [orderResult, setOrderResult] = useState(null);
  const [toast, setToast] = useState("");
  const [placing, setPlacing] = useState(false);
  // ✅ FIX Bug 4: Active orders state
  const [activeOrders, setActiveOrders] = useState([]);

  // ✅ FIX Bug 3: URL table param → sirf tableId set karo, splash mat skip karo
  // (QR scan real mein directly menu pe jaata hai — demo mein splash dikhao)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    if (t) {
      setTableId(t.toUpperCase());
      // Splash dikhao — guest count choose karne do
      // Real QR flow ke liye seedha menu chahiye? Neeche comment toggle karo:
      // setPhase("menu");
    }
  }, []);

  // Load menu
  useEffect(() => {
    if (phase !== "menu") return;
    setLoading(true);
    fetch(`${API}/menu/`)
      .then(r => r.json())
      .then(d => { setMenu(d.menu || []); setLoading(false); })
      .catch(() => setLoading(false));

    // ✅ FIX Bug 4: Active orders fetch karo jab menu load ho
    if (tableId) {
      fetch(`${API}/orders/table/${tableId}`)
        .then(r => r.json())
        .then(d => {
          const live = (d.orders || []).filter(
            o => o.status !== "completed"
          );
          setActiveOrders(live);
        })
        .catch(() => {});
    }
  }, [phase, tableId]);

  // Checkin
  const handleCheckin = async () => {
    if (!tableId) return;
    try {
      await fetch(`${API}/tables/${tableId}/checkin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests })
      });
    } catch {}
    setPhase("menu");
  };

  // Cart helpers
  const cartTotal = Object.values(cart).reduce(
    (sum, i) => sum + i.dish.price * i.qty, 0
  );
  const cartCount = Object.values(cart).reduce((sum, i) => sum + i.qty, 0);

  const addToCart = useCallback((dish) => {
    setCart(prev => {
      const cur = prev[dish.id] || { dish, qty: 0 };
      return { ...prev, [dish.id]: { dish, qty: cur.qty + 1 } };
    });
    showToast(`${dish.dish} added!`);
  }, []);

  const removeFromCart = useCallback((dishId) => {
    setCart(prev => {
      const cur = prev[dishId];
      if (!cur) return prev;
      if (cur.qty <= 1) { const n = { ...prev }; delete n[dishId]; return n; }
      return { ...prev, [dishId]: { ...cur, qty: cur.qty - 1 } };
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // AI recommend
  const handleAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResults([]);
    try {
      const r = await fetch(`${API}/ai/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiQuery, top_n: 4 })
      });
      const d = await r.json();
      setAiResults(d.results || []);
    } catch {}
    setAiLoading(false);
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!Object.keys(cart).length) return;
    setPlacing(true);
    const items = Object.values(cart).map(({ dish, qty }) => ({
      dish_id:   dish.id,
      dish_name: dish.dish,
      quantity:  qty,
      price:     dish.price,
      special_note: note || null
    }));
    try {
      const r = await fetch(`${API}/orders/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_id:       tableId || "T1",
          guest_count:    guests,
          items,
          payment_method: payMethod
        })
      });
      const d = await r.json();
      setOrderResult(d);
      setCart({});
      setPhase("success");
    } catch { showToast("Network error — try again!"); }
    setPlacing(false);
  };

  // ── Grouped menu ──
  const grouped = groupByCategory(menu);

  // Tabs: "all" + categories that have items
  const tabs = ["all", ...CAT_ORDER.filter(c => grouped[c]?.length)];

  // Displayed dishes based on tab
  const displayedGroups = activeTab === "all"
    ? grouped
    : { [activeTab]: grouped[activeTab] || [] };

  // ═══════════════════════════════════════════
  // RENDER — SPLASH
  // ═══════════════════════════════════════════
  if (phase === "splash") return (
    <div className="splash">
      <style>{styles}</style>
      <div className="splash-logo">SmartMenu</div>
      <div className="splash-tagline">Fine Dining · Smart Ordering</div>

      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
        Select your table or Room
      </p>
      
      <div className="table-grid">
        {[...Array.from({ length: 10 }, (_, i) => `T${i + 1}`),
          ...Array.from({ length: 5  }, (_, i) => `R${i + 1}`) ].map(t => (
      
          <button
            key={t}
            className={`table-btn ${tableId === t ? "selected" : ""}`}
            onClick={() => setTableId(t)}
          >
            <span className="t-num">{t}</span>
            {t.startsWith("R") ? "Room" : "Table"}
          </button>
        ))}
      </div>

      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
        How many guests?
      </p>

      <div className="guest-selector">
        <button className="guest-btn" onClick={() => setGuests(g => Math.max(1, g - 1))}>−</button>
        <span className="guest-count">{guests}</span>
        <button className="guest-btn" onClick={() => setGuests(g => Math.min(8, g + 1))}>+</button>
      </div>

      <button
        className="btn-primary"
        disabled={!tableId}
        onClick={handleCheckin}
      >
        View Menu →
      </button>

      <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 20, lineHeight: 1.6 }}>
        🔒 In a real restaurant/Hotel, QR code on your table/Room opens this automatically
      </p>
    </div>
  );

  // ═══════════════════════════════════════════
  // RENDER — SUCCESS
  // ═══════════════════════════════════════════
  if (phase === "success") return (
    <div className="status-page">
      <style>{styles}</style>
      <div className="status-icon">🎉</div>
      <h1 className="status-title">Order Placed!</h1>
      <p className="status-sub">
        Kitchen has received your order - please wait!
      </p>

      {orderResult && (
        <div className="order-card">
          <div className="order-id">Order # {orderResult.order_id}</div>

          {/* Status steps */}
          <div className="status-steps">
            {["Received","Preparing","Ready","Served"].map((s, i) => (
              <>
                <div className="step" key={s}>
                  <div className={`step-dot ${i === 0 ? "active" : ""}`}>
                    {i === 0 ? "●" : i + 1}
                  </div>
                  <span className="step-label">{s}</span>
                </div>
                {i < 3 && <div className="step-line" key={`line-${i}`} />}
              </>
            ))}
          </div>

          {/* Bill */}
          {orderResult.order?.items?.map((item, i) => (
            <div className="cart-item" key={i}>
              <div>
                <div className="cart-item-name">{item.dish_name}</div>
                <div className="cart-item-sub">×{item.quantity}</div>
              </div>
              <div className="cart-item-total">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}

          <div className="cart-total-row">
            <span>Total</span>
            <span className="cart-total-amt">
              ₹{orderResult.order?.total_bill}
            </span>
          </div>

          <div style={{
            fontSize: 12, color: "var(--muted)",
            background: "var(--bg)", borderRadius: 8,
            padding: "8px 12px", marginTop: 8
          }}>
            💳 {orderResult.order?.payment_method === "pay_now"
              ? "Payment received online" : "Pay at counter"}
          </div>
        </div>
      )}

      <button className="btn-outline" onClick={() => {
        setOrderResult(null); setNote(""); setPhase("menu");
      }}>
        Order More Items
      </button>
    </div>
  );

  // ═══════════════════════════════════════════
  // RENDER — CART SHEET
  // ═══════════════════════════════════════════
  const CartSheet = () => (
    <div className="overlay" onClick={() => setPhase("menu")}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Your Order</div>

        {Object.keys(cart).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <div className="empty-txt">Cart is empty</div>
          </div>
        ) : (
          <>
            {/* Items */}
            {Object.values(cart).map(({ dish, qty }) => (
              <div className="cart-item" key={dish.id}>
                <div>
                  <div className="cart-item-name">{dish.dish}</div>
                  <div className="cart-item-sub">
                    ₹{dish.price} × {qty}
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-total">₹{dish.price * qty}</div>
                  <div className="qty-ctrl" style={{ marginTop: 6 }}>
                    <button className="qty-btn" onClick={() => removeFromCart(dish.id)}>−</button>
                    <span className="qty-num">{qty}</span>
                    <button className="qty-btn" onClick={() => addToCart(dish)}>+</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="cart-total-row">
              <span>Total</span>
              <span className="cart-total-amt">₹{cartTotal}</span>
            </div>

            {/* Note */}
            <textarea
              className="note-input"
              placeholder="Special instructions... (e.g. no onion, less spicy)"
              value={note}
              onChange={e => setNote(e.target.value)}
            />

            {/* Payment */}
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
              Payment method:
            </p>
            <div className="pay-opts">
              <div
                className={`pay-opt ${payMethod === "pay_at_counter" ? "active" : ""}`}
                onClick={() => setPayMethod("pay_at_counter")}
              >
                <span className="pay-opt-icon">🏪</span>
                <div className="pay-opt-label">Pay at Counter</div>
                <div className="pay-opt-sub">Cash / UPI</div>
              </div>
              <div
                className={`pay-opt ${payMethod === "pay_now" ? "active" : ""}`}
                onClick={() => setPayMethod("pay_now")}
              >
                <span className="pay-opt-icon">📱</span>
                <div className="pay-opt-label">Pay Now</div>
                <div className="pay-opt-sub">UPI / Card</div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handlePlaceOrder}
              disabled={placing}
              style={{ marginTop: 8 }}
            >
              {placing ? "Placing Order..." : `Place Order · ₹${cartTotal}`}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // RENDER — MENU
  // ═══════════════════════════════════════════
  return (
    <div>
      <style>{styles}</style>
      {toast && <div className="toast">✓ {toast}</div>}
      {phase === "cart" && <CartSheet />}

      {/* Header */}
      <div className="header">
        <div className="header-brand">SmartMenu</div>
        <div className="header-table">
          <strong>Table {tableId}</strong>
          {guests} guest{guests > 1 ? "s" : ""}
        </div>
      </div>

      {/* ✅ FIX Bug 4: Active Orders section */}
      {activeOrders.length > 0 && (
        <div style={{
          margin: "12px 16px 0",
          background: "#0d2b1a",
          border: "1px solid #1a4d32",
          borderRadius: "var(--radius)",
          padding: "14px"
        }}>
          <div style={{
            fontSize: 11, color: "var(--green)",
            textTransform: "uppercase", letterSpacing: 2,
            marginBottom: 10
          }}>
            📋 Your Active Orders
          </div>
          {activeOrders.map(order => (
            <div key={order.order_id} style={{
              background: "var(--bg)",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 8,
              border: "1px solid var(--border)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4
              }}>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "var(--gold)"
                }}>
                  {order.order_id}
                </span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 12,
                  
                  background: order.status === "delivered"
                    ? "#1e1b4b" : order.status === "ready" 
                    ? "#0a2a1a" : order.status === "preparing" 
                    ? "#2a200a" : "#1a2a3a",

                  color: order.status === "delivered" 
                    ? "#c4b5fd" : order.status === "ready" 
                    ? "var(--green)" : order.status === "preparing" 
                    ? "#fbbf24" : "#60a5fa"
                }}>
                  {order.status === "delivered" ? "🍽️ Delivered" :
                   order.status === "ready" ? "✅ Ready!" :
                   order.status === "preparing" ? "🔥 Cooking" : "⏳ Received"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {order.items?.map(i => `${i.dish_name} ×${i.quantity}`).join(", ")}
              </div>
              <div style={{
                fontSize: 13, color: "var(--gold)",
                fontWeight: 600, marginTop: 4
              }}>
                Total: ₹{order.total_bill}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Bar */}
      <div className="ai-bar">
        <div className="ai-bar-title">
          ✦ AI Waiter — Ask Anything
        </div>
        <form onSubmit={handleAI} className="ai-bar form">
          <input
            className="ai-input"
            placeholder='e.g. "spicy chicken" or "₹100 mein kya milega"'
            value={aiQuery}
            onChange={e => setAiQuery(e.target.value)}
          />
          <button className="ai-go" type="submit" disabled={aiLoading}>
            {aiLoading ? "..." : "Ask"}
          </button>
        </form>
        {aiResults.length > 0 && (
          <div className="ai-results">
            {aiResults.map((r, i) => (
              <div
                key={i}
                className="ai-result-chip"
                onClick={() => {
                  const found = menu.find(d => d.dish === r.dish);
                  if (found) addToCart(found);
                }}
              >
                <div>
                  <div className="ai-chip-name">{r.dish}</div>
                  <div className="ai-chip-meta">
                    {r.food_type} · {r.spice_level} · {fmtCat(r.category)}
                  </div>
                </div>
                <div>
                  <div className="ai-chip-price">₹{r.price}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", textAlign: "right" }}>
                    tap to add
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={`tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t === "all" ? "All" : (CAT_EMOJI[t] || "") + " " + fmtCat(t)}
          </button>
        ))}
      </div>

      {/* Menu */}
      <div className="menu-container">
        {loading ? (
          <div className="loading">
            <div className="spin" /> Loading menu...
          </div>
        ) : (
          Object.entries(displayedGroups).map(([cat, dishes]) => {
            if (!dishes.length) return null;
            return (
              <div key={cat}>
                <div className="cat-label">
                  {CAT_EMOJI[cat] || "🍽"} {fmtCat(cat)}
                </div>
                {dishes.map(dish => {
                  const qty = cart[dish.id]?.qty || 0;
                  return (
                    <div className="dish-card" key={dish.id}>
                      <div className="dish-info">
                        <div className="dish-name">{dish.dish}</div>
                        <div className="dish-desc">{dish.description}</div>
                        <div className="dish-tags">
                          <span className={`tag ${
                            dish.food_type === "non-veg" ? "tag-nonveg"
                            : dish.food_type === "egg" ? "tag-egg"
                            : "tag-veg"
                          }`}>
                            {dish.food_type === "non-veg" ? "🔴" : dish.food_type === "egg" ? "🥚" : "🟢"}{" "}
                            {capitalize(dish.food_type)}
                          </span>
                          {dish.spice_level && dish.spice_level !== "non-spicy" && (
                            <span className="tag tag-spice">
                              🌶 {capitalize(dish.spice_level)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="dish-right">
                        <div className="dish-price">
                          <span>₹</span>{dish.price}
                        </div>
                        {qty === 0 ? (
                          <button className="add-btn" onClick={() => addToCart(dish)}>
                            +
                          </button>
                        ) : (
                          <div className="qty-ctrl">
                            <button className="qty-btn" onClick={() => removeFromCart(dish.id)}>−</button>
                            <span className="qty-num">{qty}</span>
                            <button className="qty-btn" onClick={() => addToCart(dish)}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* Cart FAB */}
      {cartCount > 0 && (
        <button className="cart-fab" onClick={() => setPhase("cart")}>
          <span>View Cart</span>
          <span className="cart-badge">{cartCount}</span>
          <span>₹{cartTotal}</span>
        </button>
      )}
    </div>
  );
}

        
