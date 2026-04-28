import { useState, useEffect } from "react";

const API = "https://smartmenu-qr-ai.onrender.com";

const styles = `
  .admin-container { padding: 20px; max-width: 1000px; margin: 0 auto; }
  .a-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
  .a-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
  .a-tabs button { padding: 10px 20px; border: 1px solid #333; background: #1a1814; color: #fff; cursor: pointer; border-radius: 8px; }
  .a-tabs button.active { background: #c9a84c; color: #000; border-color: #c9a84c; }
  
  .order-card { background: #1a1814; border: 1px solid #2e2a24; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
  .order-meta { display: flex; justify-content: space-between; color: #c9a84c; font-weight: 700; margin-bottom: 10px; font-size: 14px; }
  .item-row { display: flex; justify-content: space-between; font-size: 14px; padding: 4px 0; color: #ccc; }
  
  .form-box { background: #1a1814; padding: 24px; border-radius: 12px; border: 1px solid #2e2a24; }
  .field { margin-bottom: 16px; }
  .field label { display: block; margin-bottom: 6px; font-size: 13px; color: #7a7060; }
  .field input, .field select, .field textarea { width: 100%; padding: 12px; background: #0f0e0c; border: 1px solid #2e2a24; color: #fff; border-radius: 8px; }
  .btn-primary { background: #c9a84c; color: #000; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; cursor: pointer; }
`;

export default function AdminDashboard({ goHome }) {
  const [view, setView] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "Main Course", description: "" });

  useEffect(() => {
    const fetchOrders = () => {
      fetch(`${API}/orders`).then(r => r.json()).then(data => setOrders(data.reverse()));
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const addDish = async () => {
    await fetch(`${API}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert("Item added to Restaurant/Hotel Menu!");
    setForm({ name: "", price: "", category: "Main Course", description: "" });
  };

  return (
    <div className="admin-container">
      <style>{styles}</style>
      <div className="a-header">
        <h2 style={{fontFamily: 'Playfair Display', color: '#c9a84c'}}>Management Console</h2>
        <button onClick={goHome} style={{background: 'none', border: '1px solid #333', color: '#fff', padding: '6px 12px', borderRadius: 6}}>← Back</button>
      </div>

      <div className="a-tabs">
        <button className={view === 'orders' ? 'active' : ''} onClick={() => setView("orders")}>Live Orders</button>
        <button className={view === 'menu' ? 'active' : ''} onClick={() => setView("menu")}>Add Menu Item</button>
      </div>

      {view === "orders" ? (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-meta">
                <span>📍 TABLE / ROOM: {order.table_id}</span>
                <span>ID: #{order.id.slice(-4)}</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <span>{item.dish_name || 'Item'}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
              <div style={{marginTop: 10, paddingTop: 10, borderTop: '1px dashed #333', textAlign: 'right', fontSize: 12, color: '#666'}}>
                {new Date(order.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="form-box">
          <div className="field">
            <label>Item Name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Butter Chicken or Towel Set" />
          </div>
          <div className="field">
            <label>Price (₹) *</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option>Main Course</option>
              <option>Appetizers</option>
              <option>Beverages</option>
              <option>Room Essentials</option>
            </select>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the item or service..." />
          </div>
          <button className="btn-primary" onClick={addDish}>Add to Digital Menu</button>
        </div>
      )}
    </div>
  );
}
