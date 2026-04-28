import { useState, useEffect } from "react";
import CustomerTable  from "./customer_table";
import KitchenDashboard from "./kitchen_dashboard";
import AdminDashboard   from "./admin_dashboard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:    #0f0e0c;
    --gold:  #c9a84c;
    --text:  #f0ece4;
    --muted: #6a6050;
    --card:  #1a1814;
    --border:#2e2a24;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .home {
    min-height: 100vh;
    background: radial-gradient(ellipse at 50% 0%, #2a2010 0%, var(--bg) 60%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 24px 60px;
    text-align: center;
  }

  .home-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 900; margin-bottom: 8px; color: var(--gold); }
  .home-sub { font-size: 16px; color: var(--muted); margin-bottom: 48px; letter-spacing: 1px; }

  .demo-grid { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 24px; }
  .demo-head { text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); margin-bottom: 8px; font-weight: 700; }
  .demo-box { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 12px; }
  
  .demo-row { 
    display: flex; align-items: center; justify-content: space-between; padding: 16px; border-radius: 12px; transition: 0.2s; cursor: pointer; text-align: left;
  }
  .demo-row:hover { background: #221f1a; }
  .demo-row-info { font-weight: 600; font-size: 15px; margin-bottom: 2px; }
  .demo-row-sub { font-size: 12px; color: var(--muted); }
  
  .demo-btn { 
    background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
  }

  .links-row { margin-top: 40px; display: flex; gap: 12px; }
  .link-chip { text-decoration: none; background: #221f1a; border: 1px solid var(--border); color: var(--text); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; transition: 0.2s; }
  .link-chip:hover { border-color: var(--gold); }
  
  .built-tag { margin-top: 60px; font-size: 12px; color: var(--muted); }
  .built-tag strong { color: var(--gold); }
`;

export default function App() {
  const [page, setPage] = useState("home");
  const navigate = (p) => { setPage(p); window.scrollTo(0, 0); };

  if (page === "customer") return <CustomerTable goHome={() => setPage("home")} />;
  if (page === "kitchen")  return <KitchenDashboard goHome={() => setPage("home")} />;
  if (page === "admin")    return <AdminDashboard goHome={() => setPage("home")} />;

  return (
    <div className="home">
      <style>{styles}</style>
      
      <h1 className="home-title">SmartMenu AI</h1>
      <p className="home-sub">Unified Ordering Solution for Restaurants & Hotels</p>

      <div className="demo-grid">
        <div className="demo-head">Customer Experience</div>
        <div className="demo-box">
          <div className="demo-row" onClick={() => navigate("customer")}>
            <div>
              <div className="demo-row-info">📱 Smart Ordering Interface</div>
              <div className="demo-row-sub">Scan QR to order from Table or Room</div>
            </div>
            <button className="demo-btn">Try Demo →</button>
          </div>
        </div>

        <div className="demo-head">Staff Dashboards</div>
        <div className="demo-box" style={{ marginBottom: 10 }}>
          <div className="demo-row" onClick={() => navigate("kitchen")}>
            <div>
              <div className="demo-row-info">👨‍🍳 Kitchen / Pantry Dashboard</div>
              <div className="demo-row-sub">Live orders · Real-time status updates</div>
            </div>
            <button className="demo-btn">Open →</button>
          </div>

          <div className="demo-row" onClick={() => navigate("admin")}>
            <div>
              <div className="demo-row-info">⚙️ Admin Control Panel</div>
              <div className="demo-row-sub">Manage Menu · Tables/Rooms · Analytics</div>
            </div>
            <button className="demo-btn">Open →</button>
          </div>
        </div>
      </div>

      <div className="links-row">
        <a className="link-chip" href="https://smartmenu-qr-ai.onrender.com/docs" target="_blank" rel="noreferrer">🔗 API Docs</a>
        <a className="link-chip" href="https://github.com/Rahul543-ux/SmartMenu-QR-AI" target="_blank" rel="noreferrer">💻 GitHub Repo</a>
      </div>

      <div className="built-tag">
        Built by <strong>Rahul</strong> · Smart AI Food Recommender Project
      </div>
    </div>
  );
    }
    
