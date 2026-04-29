import { useState, useEffect } from "react";

const API = "https://smartmenu-qr-ai.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0c0a14;
    --surface: #120f1e;
    --card:    #181428;
    --border:  #252038;
    --purple:  #a78bfa;
    --pink:    #f472b6;
    --green:   #4ade80;
    --yellow:  #fbbf24;
    --red:     #f87171;
    --muted:   #5a506a;
    --text:    #f0ecff;
    --radius:  12px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .a-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .a-brand {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--purple);
  }

  .a-sub { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; }

  /* ── TABS ── */
  .a-tabs {
    display: flex;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .a-tab {
    flex: 1;
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
    text-align: center;
  }

  .a-tab.active { color: var(--purple); border-bottom-color: var(--purple); }

  .a-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; padding-bottom: 80px; }

  /* ── STAT ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 10px;
    text-align: center;
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-lbl { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  /* ── MENU ITEM ── */
  .menu-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px;
    transition: border-color 0.15s;
  }

  .menu-item.unavailable { opacity: 0.45; }

  .mi-info { flex: 1; }

  .mi-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 3px;
  }

  .mi-meta { font-size: 11px; color: var(--muted); margin-bottom: 6px; }

  .mi-tags { display: flex; gap: 6px; flex-wrap: wrap; }

  .tag {
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 500;
  }

  .tag-veg    { background: #0d2b1a; color: #4ade80; border: 1px solid #1a4d32; }
  .tag-nonveg { background: #2b0d0d; color: #f87171; border: 1px solid #4d1a1a; }
  .tag-egg    { background: #2b240d; color: #fbbf24; border: 1px solid #4d3e1a; }

  .mi-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    min-width: 70px;
  }

  .mi-price {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--purple);
  }

  .toggle-btn {
    font-size: 11px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s;
  }

  .toggle-btn:hover { opacity: 0.8; }
  .toggle-on  { background: #0d2b1a; color: var(--green);  border: 1px solid #1a4d32; }
  .toggle-off { background: #2b0d0d; color: var(--red);    border: 1px solid #4d1a1a; }

  /* ── ORDERS TABLE ── */
  .order-row {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px;
    margin-bottom: 8px;
  }

  .or-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 6px;
  }

  .or-id {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--purple);
    font-weight: 500;
  }

  .or-table {
    font-size: 13px;
    color: var(--text);
    font-weight: 600;
  }

  .status-badge {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 3px 8px;
    border-radius: 20px;
  }

  .badge-received  { background: #1a2a3a; color: #60a5fa; }
  .badge-preparing { background: #2a200a; color: var(--yellow); }
  .badge-ready     { background: #0a2a1a; color: var(--green); }
  .badge-delivered { background: #1a1a1a; color: var(--muted); }

  .or-bill {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: var(--purple);
    font-weight: 700;
  }

  .or-items { font-size: 12px; color: var(--muted); margin-top: 4px; }

  /* ── TABLES GRID ── */
  .tables-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .table-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 10px;
    text-align: center;
  }

  .table-card.occupied { border-color: var(--purple); }

  .tc-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--purple);
    margin-bottom: 4px;
  }

  .tc-status { font-size: 11px; font-weight: 600; }
  .tc-status.free { color: var(--muted); }
  .tc-status.occ  { color: var(--green); }

  .tc-guests { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .free-btn {
    margin-top: 8px;
    width: 100%;
    padding: 6px;
    font-size: 11px;
    font-weight: 600;
    background: #2b0d0d;
    color: var(--red);
    border: 1px solid #4d1a1a;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s;
  }

  .free-btn:hover { opacity: 0.8; }

  /* ── ADD DISH FORM ── */
  .add-form {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: var(--purple);
    font-weight: 700;
  }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  .field label {
    display: block;
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }

  .field input, .field select, .field textarea {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
    appearance: none;
  }

  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: var(--purple);
  }

  .field textarea { resize: none; height: 70px; }

  .btn-primary {
    background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 14px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: opacity 0.15s;
  }

  .btn-primary:hover { opacity: 0.85; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .toast {
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--green);
    color: #0a0a0a;
    padding: 10px 24px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    z-index: 999;
    white-space: nowrap;
    animation: fadeInOut 2.5s forwards;
  }

  @keyframes fadeInOut {
    0%   { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
    80%  { opacity: 1; }
    100% { opacity: 0; }
  }

  .spin {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--purple);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 60px auto;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .search-bar {
    width: 100%;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    margin-bottom: 4px;
  }

  .search-bar:focus { border-color: var(--purple); }
  .search-bar::placeholder { color: var(--muted); }
`;

const PRICE_MAP = {
  "flatbread":80,"breakfast":100,"snack":70,"starter":150,
  "main-course":220,"rice-dish":180,"side-dish":60,
  "condiment":30,"soup":120,"drink":60,"ice-cream":80,"dessert":90
};

const CATEGORIES = [
  "breakfast","flatbread","main-course","rice-dish","starter",
  "snack","soup","side-dish","condiment","dessert","ice-cream","drink"
];

const EMPTY_DISH = {
  id:"",dish:"",region:"north-indian",food_type:"veg",
  spice_level:"medium",category:"main-course",
  description:"",price:""
};

// ─── MAIN ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab]     = useState("menu");
  const [menu, setMenu]   = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm]   = useState(EMPTY_DISH);
  const [saving, setSaving] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // Fetch based on tab
  useEffect(() => {
    if (tab === "menu") fetchMenu();
    if (tab === "orders") fetchOrders();
    if (tab === "tables") fetchTables();
  }, [tab]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/menu/`);
      const d = await r.json();
      setMenu(d.menu || []);
    } catch {}
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/orders/all`);
      const d = await r.json();
      setOrders(d.orders || []);
    } catch {}
    setLoading(false);
  };

  const fetchTables = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/tables/`);
      const d = await r.json();
      setTables(d.tables || []);
    } catch {}
    setLoading(false);
  };

  const toggleDish = async (id) => {
    try {
      await fetch(`${API}/menu/toggle/${id}`, { method: "PATCH" });
      setMenu(prev => prev.map(d =>
        d.id === id ? { ...d, available: !d.available } : d
      ));
      showToast("Dish updated!");
    } catch { showToast("Error!"); }
  };

  const freeTable = async (tableId) => {
    try {
      await fetch(`${API}/tables/${tableId}/free`, { method: "PATCH" });
      fetchTables();
      showToast(`Table ${tableId} freed!`);
    } catch {}
  };

  const addDish = async () => {
    if (!form.id || !form.dish || !form.description) {
      showToast("Fill all fields!"); return;
    }
    setSaving(true);
    try {
      const r = await fetch(`${API}/menu/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price) || PRICE_MAP[form.category] || 150,
          meal_type: ["lunch","dinner"],
          tags: [],
          pairs_with: [],
          available: true
        })
      });
      const d = await r.json();
      if (d.status === "ok") {
        showToast("Dish added!");
        setForm(EMPTY_DISH);
        fetchMenu();
        setTab("menu");
      } else { showToast(d.detail || "Error!"); }
    } catch { showToast("Network error!"); }
    setSaving(false);
  };

  // Stats
  const activeOrders = orders.filter(o => o.status !== "delivered").length;
  const todayRevenue = orders.reduce((s, o) => s + (o.total_bill || 0), 0);
  const occupiedTables = tables.filter(t => t.occupied).length;

  const filteredMenu = menu.filter(d =>
    d.dish?.toLowerCase().includes(search.toLowerCase()) ||
    d.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <style>{styles}</style>
      {toast && <div className="toast">✓ {toast}</div>}

      {/* Header */}
      <div className="a-header">
        <div>
          <div className="a-brand">Admin</div>
          <div className="a-sub">SmartMenu Control Panel</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "right" }}>
          {menu.length} dishes<br />{tables.length} tables
        </div>
      </div>

      {/* Tabs */}
      <div className="a-tabs">
        {["menu","orders","tables","add"].map(t => (
          <button
            key={t}
            className={`a-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "menu" ? "🍽 Menu" :
             t === "orders" ? "📋 Orders" :
             t === "tables" ? "🪑 Tables & Rooms" : "➕ Add Dish"}
          </button>
        ))}
      </div>

      <div className="a-body">

        {/* Stats (always visible) */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num" style={{ color: "var(--purple)" }}>
              {menu.length}
            </div>
            <div className="stat-lbl">Dishes</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "var(--yellow)" }}>
              {activeOrders}
            </div>
            <div className="stat-lbl">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "var(--green)" }}>
              {occupiedTables}
            </div>
            <div className="stat-lbl">Tables</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="stat-card" style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 11, color: "var(--muted)",
            textTransform: "uppercase", letterSpacing: 2,
            marginBottom: 6
          }}>Total Revenue</div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 36, fontWeight: 700,
            color: "var(--purple)"
          }}>
            ₹{todayRevenue.toLocaleString()}
          </div>
        </div>

        {loading && <div className="spin" style={{ display: "block" }} />}

        {/* ── MENU TAB ── */}
        {tab === "menu" && !loading && (
          <>
            <input
              className="search-bar"
              placeholder="Search dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {filteredMenu.map(dish => (
              <div
                key={dish.id}
                className={`menu-item ${!dish.available ? "unavailable" : ""}`}
              >
                <div className="mi-info">
                  <div className="mi-name">{dish.dish}</div>
                  <div className="mi-meta">
                    {dish.category?.replace(/-/g," ")} · {dish.region}
                  </div>
                  <div className="mi-tags">
                    <span className={`tag ${
                      dish.food_type === "non-veg" ? "tag-nonveg"
                      : dish.food_type === "egg" ? "tag-egg"
                      : "tag-veg"
                    }`}>
                      {dish.food_type === "non-veg" ? "🔴" :
                       dish.food_type === "egg" ? "🥚" : "🟢"} {dish.food_type}
                    </span>
                  </div>
                </div>
                <div className="mi-actions">
                  <div className="mi-price">₹{dish.price}</div>
                  <button
                    className={`toggle-btn ${dish.available ? "toggle-on" : "toggle-off"}`}
                    onClick={() => toggleDish(dish.id)}
                  >
                    {dish.available ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && !loading && orders.map(order => (
          <div className="order-row" key={order.order_id}>
            <div className="or-head">
              <div>
                <div className="or-id">{order.order_id}</div>
                <div className="or-table">Table {order.table_id}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className={`status-badge badge-${order.status}`}>
                  {order.status}
                </span>
                <div className="or-bill" style={{ marginTop: 4 }}>
                  ₹{order.total_bill}
                </div>
              </div>
            </div>
            <div className="or-items">
              {order.items?.map((it, i) => (
                <span key={i}>
                  {it.dish_name} ×{it.quantity}
                  {i < order.items.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* ── TABLES TAB ── */}
        {tab === "tables" && !loading && (
          <div className="tables-grid">
            {tables.map(t => (
              <div
                key={t.table_id}
                className={`table-card ${t.occupied ? "occupied" : ""}`}
              >
                <div className="tc-num">{t.table_id}</div>
                <div className={`tc-status ${t.occupied ? "occ" : "free"}`}>
                  {/* Add this line */}
                  <span style={{fontSize:9, color:"var(--muted)"}}>
                    {t.type === "room" ? "🏨 Room" : "🪑 Table"}
                  </span>
                  {t.occupied ? "Occupied" : "Free"}
                </div>
                {t.occupied && (
                  <>
                    <div className="tc-guests">{t.guests} guests</div>
                    <button
                      className="free-btn"
                      onClick={() => freeTable(t.table_id)}
                    >
                      Free Table
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ADD DISH TAB ── */}
        {tab === "add" && (
          <div className="add-form">
            <div className="form-title">Add New Dish</div>

            <div className="form-grid">
              <div className="field">
                <label>Dish ID *</label>
                <input
                  placeholder="e.g. NI041"
                  value={form.id}
                  onChange={e => setForm(p => ({ ...p, id: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 180"
                  value={form.price}
                  onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                />
              </div>
            </div>

            <div className="field">
              <label>Dish Name *</label>
              <input
                placeholder="e.g. Paneer Butter Masala"
                value={form.dish}
                onChange={e => setForm(p => ({ ...p, dish: e.target.value }))}
              />
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Food Type</label>
                <select
                  value={form.food_type}
                  onChange={e => setForm(p => ({ ...p, food_type: e.target.value }))}
                >
                  <option value="veg">🟢 Veg</option>
                  <option value="non-veg">🔴 Non-Veg</option>
                  <option value="egg">🥚 Egg</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Region</label>
                <select
                  value={form.region}
                  onChange={e => setForm(p => ({ ...p, region: e.target.value }))}
                >
                  <option value="north-indian">North Indian</option>
                  <option value="south-indian">South Indian</option>
                </select>
              </div>
              <div className="field">
                <label>Spice Level</label>
                <select
                  value={form.spice_level}
                  onChange={e => setForm(p => ({ ...p, spice_level: e.target.value }))}
                >
                  {["non-spicy","mild","medium","spicy","very-spicy"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Description *</label>
              <textarea
                placeholder="Short description of the dish..."
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <button className="btn-primary" onClick={addDish} disabled={saving}>
              {saving ? "Adding..." : "Add to Menu ✓"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
