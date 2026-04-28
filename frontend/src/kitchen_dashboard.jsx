import { useState, useEffect, useRef } from "react";

const API = "https://smartmenu-qr-ai.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0a0f0a;
    --surface: #111611;
    --card:    #161d16;
    --border:  #1f2e1f;
    --green:   #4ade80;
    --yellow:  #fbbf24;
    --red:     #f87171;
    --muted:   #5a7a5a;
    --text:    #e8f0e8;
    --radius:  12px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .k-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .k-brand {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--green);
  }

  .k-sub { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; }

  .live-dot {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--green);
    font-weight: 500;
  }

  .dot {
    width: 8px; height: 8px;
    background: var(--green);
    border-radius: 50%;
    animation: blink 1.5s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .k-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 12px;
    text-align: center;
  }

  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  .section-title {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 3px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 12px;
  }

  .order-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .order-card.urgent { border-color: var(--red); }
  .order-card.warning { border-color: var(--yellow); }

  .order-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }

  .order-meta { display: flex; align-items: center; gap: 10px; }

  .order-table {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--green);
  }

  .order-id-txt {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
  }

  .timer {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    background: var(--bg);
  }

  .timer.red { color: var(--red); }
  .timer.yellow { color: var(--yellow); }
  .timer.green { color: var(--green); }

  .status-badge {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .badge-received  { background: #1a2a3a; color: #60a5fa; border: 1px solid #1e3a5a; }
  .badge-preparing { background: #2a200a; color: var(--yellow); border: 1px solid #3a2e0a; }
  .badge-ready     { background: #0a2a1a; color: var(--green); border: 1px solid #0a3a1a; }

  .order-items { padding: 12px 16px; }

  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid #0f1a0f;
    font-size: 14px;
  }

  .item-row:last-child { border-bottom: none; }

  .item-name { color: var(--text); font-weight: 500; }
  .item-qty {
    font-family: 'DM Mono', monospace;
    color: var(--green);
    font-size: 13px;
    background: var(--bg);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .item-note { font-size: 11px; color: var(--yellow); margin-top: 2px; }

  .order-footer {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    background: var(--surface);
  }

  .action-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .action-btn:hover { opacity: 0.85; }

  .btn-prep   { background: var(--yellow); color: #0a0a0a; }
  .btn-ready  { background: var(--green);  color: #0a0a0a; }
  .btn-done   { background: var(--muted);  color: var(--text); }

  .empty-kitchen {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }

  .empty-kitchen .icon { font-size: 48px; margin-bottom: 12px; }
  .empty-kitchen p { font-size: 14px; }

  .spin {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--green);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 60px auto;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading { display: flex; justify-content: center; }
`;

// ─── Timer component ────────────────────────────────────────
function OrderTimer({ placedAt }) {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    // ✅ FIX Bug 2: Force UTC parsing — add 'Z' if missing
    const utcStr = placedAt.endsWith("Z") ? placedAt : placedAt + "Z";
    const placed  = new Date(utcStr).getTime();

    const update = () => {
      const diff = Math.floor((Date.now() - placed) / 1000);
      setSecs(diff > 0 ? diff : 0);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [placedAt]);

  const mins = Math.floor(secs / 60);
  const s    = secs % 60;
  const cls  = mins >= 15 ? "red" : mins >= 8 ? "yellow" : "green";

  return (
    <span className={`timer ${cls}`}>
      {String(mins).padStart(2,"0")}:{String(s).padStart(2,"0")}
    </span>
  );
}

// ─── MAIN ───────────────────────────────────────────────────
export default function KitchenDashboard() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const pollRef = useRef(null);

  const fetchOrders = async () => {
    try {
      const r = await fetch(`${API}/orders/kitchen`);
      const d = await r.json();
      setOrders(d.orders || []);
    } catch {}
    setLoading(false);
  };

  // Poll every 10s
  useEffect(() => {
    fetchOrders();
    pollRef.current = setInterval(fetchOrders, 10000);
    return () => clearInterval(pollRef.current);
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(p => ({ ...p, [orderId]: true }));
    try {
      await fetch(`${API}/orders/status/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      await fetchOrders();
    } catch {}
    setUpdating(p => ({ ...p, [orderId]: false }));
  };

  const received  = orders.filter(o => o.status === "received");
  const preparing = orders.filter(o => o.status === "preparing");
  // ✅ FIX Bug 1: "ready" orders bhi dikhao
  const ready     = orders.filter(o => o.status === "ready");

  return (
    <div>
      <style>{styles}</style>

      {/* Header */}
      <div className="k-header">
        <div>
          <div className="k-brand">Kitchen</div>
          <div className="k-sub">Live Order Dashboard</div>
        </div>
        <div className="live-dot">
          <div className="dot" /> Live
        </div>
      </div>

      <div className="k-body">

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num" style={{ color: "#60a5fa" }}>
              {received.length}
            </div>
            <div className="stat-label">New</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: "var(--yellow)" }}>
              {preparing.length}
            </div>
            <div className="stat-label">Cooking</div>
          </div>
          <div className="stat-card">
            {/* ✅ FIX Bug 1: Ready count dikhao */}
            <div className="stat-num" style={{ color: "var(--green)" }}>
              {ready.length}
            </div>
            <div className="stat-label">Ready</div>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spin" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-kitchen">
            <div className="icon">👨‍🍳</div>
            <p>Sab clear! Koi active order nahi.</p>
          </div>
        ) : (
          <>
            {/* New Orders */}
            {received.length > 0 && (
              <div>
                <div className="section-title">🔔 New Orders</div>
                {received.map(order => (
                  <OrderCard
                    key={order.order_id}
                    order={order}
                    updating={!!updating[order.order_id]}
                    onUpdate={updateStatus}
                  />
                ))}
              </div>
            )}

            {/* Preparing */}
            {preparing.length > 0 && (
              <div>
                <div className="section-title">🔥 Preparing</div>
                {preparing.map(order => (
                  <OrderCard
                    key={order.order_id}
                    order={order}
                    updating={!!updating[order.order_id]}
                    onUpdate={updateStatus}
                  />
                ))}
              </div>
            )}

            {/* ✅ FIX Bug 1: Ready section add kiya */}
            {ready.length > 0 && (
              <div>
                <div className="section-title">✅ Ready to Serve</div>
                {ready.map(order => (
                  <OrderCard
                    key={order.order_id}
                    order={order}
                    updating={!!updating[order.order_id]}
                    onUpdate={updateStatus}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Order Card ─────────────────────────────────────────────
function OrderCard({ order, updating, onUpdate }) {
  const mins = Math.floor(
    (Date.now() - new Date(order.placed_at).getTime()) / 60000
  );
  const urgency = mins >= 15 ? "urgent" : mins >= 8 ? "warning" : "";

  return (
    <div className={`order-card ${urgency}`} style={{ marginBottom: 12 }}>

      {/* Head */}
      <div className="order-head">
        <div className="order-meta">
          <span className="order-table">{order.table_id}</span>
          <span className="order-id-txt">{order.order_id}</span>
          <span className={`status-badge badge-${order.status}`}>
            {order.status}
          </span>
        </div>
        <OrderTimer placedAt={order.placed_at} />
      </div>

      {/* Items */}
      <div className="order-items">
        {order.items.map((item, i) => (
          <div key={i} className="item-row">
            <div>
              <div className="item-name">{item.dish_name}</div>
              {item.special_note && (
                <div className="item-note">📝 {item.special_note}</div>
              )}
              {item.spice_pref && (
                <div className="item-note">🌶 {item.spice_pref}</div>
              )}
            </div>
            <span className="item-qty">×{item.quantity}</span>
          </div>
        ))}
      </div>

      {/* ✅ FIX Bug 1: Strict flow — sirf next step ka button dikhao */}
      <div className="order-footer">
        {order.status === "received" && (
          <button
            className="action-btn btn-prep"
            disabled={updating}
            onClick={() => onUpdate(order.order_id, "preparing")}
          >
            {updating ? "..." : "Start Cooking 🔥"}
          </button>
        )}
        {order.status === "preparing" && (
          <button
            className="action-btn btn-ready"
            disabled={updating}
            onClick={() => onUpdate(order.order_id, "ready")}
          >
            {updating ? "..." : "Mark Ready ✅"}
          </button>
        )}
        {order.status === "ready" && (
          <button
            className="action-btn btn-done"
            disabled={updating}
            onClick={() => onUpdate(order.order_id, "delivered")}
          >
            {updating ? "..." : "Delivered 🎯"}
          </button>
        )}
      </div>
    </div>
  );
}
