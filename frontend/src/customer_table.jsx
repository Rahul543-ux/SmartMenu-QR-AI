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
      return { ...pre
