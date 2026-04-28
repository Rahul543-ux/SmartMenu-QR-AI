import { useState, useEffect, useCallback } from "react";

const API = "https://smartmenu-qr-ai.onrender.com";

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

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .splash { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; text-align: center; }
  .splash-brand { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: var(--gold); margin-bottom: 8px; }
  .splash-tag { color: var(--muted); font-size: 14px; margin-bottom: 40px; }
  
  .table-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; max-width: 400px; }
  .table-card { background: var(--card); border: 1px solid var(--border); padding: 20px 10px; border-radius: var(--radius); cursor: pointer; transition: 0.2s; text-align: center; }
  .table-card:active { transform: scale(0.95); border-color: var(--gold); }
  .table-num { font-size: 20px; font-weight: 600; display: block; margin-bottom: 4px; color: var(--gold); }
  .table-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  .nav-header { position: sticky; top: 0; z-index: 100; background: rgba(15, 14, 12, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
  .nav-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--gold); }
  .nav-loc { font-size: 11px; background: var(--card); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border); color: var(--gold-lite); }

  .menu-content { padding: 16px; padding-bottom: 120px; }
  .cat-section { margin-bottom: 32px; }
  .cat-name { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 16px; padding-left: 4px; border-left: 3px solid var(--gold); padding-left: 12px; }
  
  .dish-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin-bottom: 12px; display: flex; gap: 12px; }
  .dish-info { flex: 1; }
  .dish-name { font-weight: 600; font-size: 16px; margin-bottom: 4px; display: block; }
  .dish-desc { font-size: 12px; color: var(--muted); line-height: 1.4; }
  .dish-price { font-weight: 700; color: var(--gold); font-size: 15px; margin-top: 8px; }

  .add-btn { background: var(--gold); color: #000; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  .qty-ctrl { display: flex; align-items: center; gap: 12px; background: var(--card); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
  .qty-btn { background: none; border: none; color: var(--gold); font-size: 18px; width: 30px; cursor: pointer; }

  .cart-fab { position: fixed; bottom: 24px; left: 16px; right: 16px; background: var(--gold); color: #000; padding: 16px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: none; z-index: 1000; }
  
  .checkout-overlay { position: fixed; inset: 0; background: var(--bg); z-index: 2000; padding: 24px; display: flex; flex-direction: column; }
  .close-btn { background: none; border: none; color: var(--text); font-size: 24px; align-self: flex-start; margin-bottom: 24px; }
`;

export default function CustomerTable({ goHome }) {
  const [phase, setPhase] = useState("splash");
  const [tableId, setTableId] = useState(null);
  const [menu, setMenu] = useState({});
  const [cart, setCart] = useState({});
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    fetch(`${API}/menu`).then(r => r.json()).then(data => {
      const grouped = data.reduce((acc, item) => {
        if(!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});
      setMenu(grouped);
    }).catch(err => console.error("Menu load error:", err));
  }, []);

  const addToCart = (dish) => {
    setCart(prev => ({ ...prev, [dish.id]: { ...dish, qty: (prev[dish.id]?.qty || 0) + 1 } }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id].qty > 1) updated[id].qty -= 1;
      else delete updated[id];
      return updated;
    });
  };

  const placeOrder = async () => {
    const items = Object.values(cart).map(i => ({ dish_id: i.id, quantity: i.qty }));
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table_id: tableId, items })
    });
    const data = await res.json();
    setOrderId(data.id);
    setPhase("success");
    setCart({});
  };

  if (phase === "splash") {
    return (
      <div className="splash">
        <style>{styles}</style>
        <div className="splash-brand">SmartMenu AI</div>
        <div className="splash-tag">Unified Restaurant & Room Service</div>
        <div className="table-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <div key={num} className="table-card" onClick={() => { setTableId(num); setPhase("menu"); }}>
              <span className="table-num">{num}</span>
              <span className="table-label">Table / Room</span>
            </div>
          ))}
        </div>
        <button onClick={goHome} style={{marginTop: 40, background: 'none', border: 'none', color: '#555', fontSize: '12px'}}>← Back to Demo</button>
      </div>
    );
  }

  const cartItems = Object.values(cart);
  const cartTotal = cartItems.reduce((s, i) => s + (i.price * i.qty), 0);

  return (
    <div className="menu-page">
      <style>{styles}</style>
      <header className="nav-header">
        <div className="nav-title">SmartMenu</div>
        <div className="nav-loc">Serving: T/R-{tableId}</div>
      </header>

      <div className="menu-content">
        {Object.entries(menu).map(([cat, dishes]) => (
          <section key={cat} className="cat-section">
            <h2 className="cat-name">{cat}</h2>
            {dishes.map(dish => (
              <div key={dish.id} className="dish-card">
                <div className="dish-info">
                  <span className="dish-name">{dish.name}</span>
                  <p className="dish-desc">{dish.description}</p>
                  <div className="dish-price">₹{dish.price}</div>
                </div>
                <div className="dish-actions">
                  {cart[dish.id] ? (
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => removeFromCart(dish.id)}>−</button>
                      <span>{cart[dish.id].qty}</span>
                      <button className="qty-btn" onClick={() => addToCart(dish)}>+</button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => addToCart(dish)}>Add</button>
                  )}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>

      {cartItems.length > 0 && phase !== "cart" && (
        <button className="cart-fab" onClick={() => setPhase("cart")}>
          <span>View Order</span>
          <span>₹{cartTotal}</span>
        </button>
      )}

      {phase === "cart" && (
        <div className="checkout-overlay">
          <button className="close-btn" onClick={() => setPhase("menu")}>✕</button>
          <h2 style={{fontFamily: 'Playfair Display', fontSize: 32, marginBottom: 20}}>Your Order</h2>
          <div style={{flex: 1, overflowY: 'auto'}}>
            {cartItems.map(item => (
              <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)'}}>
                <div>{item.name} x {item.qty}</div>
                <div>₹{item.price * item.qty}</div>
              </div>
            ))}
          </div>
          <div style={{padding: '20px 0', borderTop: '2px solid var(--gold)', marginTop: 20}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20}}>
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <button className="cart-fab" style={{position: 'static', width: '100%', marginTop: 20}} onClick={placeOrder}>
              Confirm Order
            </button>
          </div>
        </div>
      )}

      {phase === "success" && (
        <div className="checkout-overlay" style={{justifyContent: 'center', textAlign: 'center'}}>
          <div style={{fontSize: 60}}>✅</div>
          <h2 style={{fontFamily: 'Playfair Display', margin: '20px 0'}}>Order Received!</h2>
          <p style={{color: 'var(--muted)'}}>Service for Table/Room {tableId} is on the way.</p>
          <button className="add-btn" style={{marginTop: 30}} onClick={() => setPhase("menu")}>Order More</button>
        </div>
      )}
    </div>
  );
  }
  
