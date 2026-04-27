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

  /* ── HOME / DEMO PAGE ── */
  .home {
    min-height: 100vh;
    background: radial-gradient(ellipse at 50% 0%, #2a2010 0%, var(--bg) 60%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 24px 60px;
    text-align: center;
  }

  .home-logo {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 900;
    color: var(--gold);
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .home-sub {
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 12px;
  }

  .home-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #1a2010;
    border: 1px solid #2a3a1a;
    color: #4ade80;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 14px;
    border-radius: 20px;
    margin-bottom: 40px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .home-badge .dot {
    width: 6px; height: 6px;
    background: #4ade80;
    border-radius: 50%;
    animation: blink 1.5s infinite;
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ── DEMO SECTION ── */
  .demo-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 20px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
    text-align: left;
  }

  .demo-label {
    font-size: 11px;
    color: var(--gold);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  .demo-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #1e1c18;
  }

  .demo-row:last-child { border-bottom: none; }

  .demo-row-info { font-size: 13px; color: var(--text); }
  .demo-row-sub  { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .demo-btn {
    background: var(--gold);
    color: #0f0e0c;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s;
    white-space: nowrap;
  }

  .demo-btn:hover { opacity: 0.85; }

  .demo-btn.secondary {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
  }

  /* ── QR CODE ── */
  .qr-section {
    width: 100%;
    max-width: 400px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
  }

  .qr-label {
    font-size: 11px;
    color: var(--gold);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 16px;
  }

  .qr-img {
    width: 160px;
    height: 160px;
    border-radius: 12px;
    border: 3px solid var(--gold);
    margin-bottom: 10px;
  }

  .qr-caption { font-size: 12px; color: var(--muted); }

  /* ── LINKS ── */
  .links-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 8px;
    width: 100%;
    max-width: 400px;
  }

  .link-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 50px;
    padding: 8px 16px;
    font-size: 12px;
    color: var(--muted);
    text-decoration: none;
    transition: border-color 0.15s, color 0.15s;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .link-chip:hover { border-color: var(--gold); color: var(--gold); }

  /* ── STAFF SECTION ── */
  .staff-section {
    width: 100%;
    max-width: 400px;
    text-align: left;
  }

  .section-head {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 12px;
    margin-top: 24px;
  }

  /* ── BACK BTN ── */
  .back-btn {
    position: fixed;
    bottom: 24px;
    right: 20px;
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--muted);
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    z-index: 999;
  }

  .back-btn:hover { border-color: var(--gold); color: var(--gold); }

  .built-tag {
    margin-top: 32px;
    font-size: 11px;
    color: var(--muted);
    text-align: center;
  }

  .built-tag strong { color: var(--gold); }
`;

// ─── QR URL generator ────────────────────────────────────────
const getTableURL = (tableId) => {
  const base = window.location.origin + window.location.pathname;
  return `${base}?page=customer&table=${tableId}`;
};

// QR image via Google Charts API (free, no key needed)
const qrSrc = (url) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}&color=c9a84c&bgcolor=1a1814`;

// ─── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  // Read page from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("page");
    if (p) setPage(p);
  }, []);

  const navigate = (p, tableId) => {
    let url = `?page=${p}`;
    if (tableId) url += `&table=${tableId}`;
    window.history.pushState({}, "", url);
    setPage(p);
    window.scrollTo(0, 0);
  };

  // ── Customer page ──
  if (page === "customer") return (
    <>
      <CustomerTable />
      <button className="back-btn" onClick={() => navigate("home")}>
        ← Demo Home
      </button>
      <style>{styles}</style>
    </>
  );

  // ── Kitchen page ──
  if (page === "kitchen") return (
    <>
      <KitchenDashboard />
      <button className="back-btn" onClick={() => navigate("home")}>
        ← Demo Home
      </button>
      <style>{styles}</style>
    </>
  );

  // ── Admin page ──
  if (page === "admin") return (
    <>
      <AdminDashboard />
      <button className="back-btn" onClick={() => navigate("home")}>
        ← Demo Home
      </button>
      <style>{styles}</style>
    </>
  );

  // ── HOME / DEMO LANDING PAGE ──
  return (
    <div className="home">
      <style>{styles}</style>

      <div className="home-logo">SmartMenu</div>
      <div className="home-sub">AI · Restaurant · QR System</div>
      <div className="home-badge">
        <div className="dot" /> Live Demo
      </div>

      {/* Customer Tables */}
      <div className="demo-box">
        <div className="demo-label">📱 Customer Tables — Tap to Open</div>

        {["T1","T2","T3"].map(t => (
          <div className="demo-row" key={t}>
            <div>
              <div className="demo-row-info">Table {t}</div>
              <div className="demo-row-sub">
                QR → Menu → Order → Pay
              </div>
            </div>
            <button
              className="demo-btn"
              onClick={() => navigate("customer", t)}
            >
              Open →
            </button>
          </div>
        ))}
      </div>

      {/* QR Code for T1 */}
      <div className="qr-section">
        <div className="qr-label">📷 Scan QR — Table T1</div>
        <img
          className="qr-img"
          src={qrSrc(getTableURL("T1"))}
          alt="QR Code Table T1"
        />
        <div className="qr-caption">
          Scan this with your phone camera to open Table T1
        </div>
      </div>

      {/* Staff dashboards */}
      <div className="staff-section">
        <div className="section-head">Staff Dashboards</div>

        <div className="demo-box" style={{ marginBottom: 10 }}>
          <div className="demo-row">
            <div>
              <div className="demo-row-info">👨‍🍳 Kitchen Dashboard</div>
              <div className="demo-row-sub">Live orders · Status updates · Timer</div>
            </div>
            <button className="demo-btn" onClick={() => navigate("kitchen")}>
              Open →
            </button>
          </div>

          <div className="demo-row">
            <div>
              <div className="demo-row-info">⚙️ Admin Panel</div>
              <div className="demo-row-sub">Menu · Orders · Tables · Add dish</div>
            </div>
            <button className="demo-btn" onClick={() => navigate("admin")}>
              Open →
            </button>
          </div>
        </div>
      </div>

      {/* API + GitHub links */}
      <div className="links-row">
        <a
          className="link-chip"
          href="https://smartmenu-qr-ai.onrender.com/docs"
          target="_blank"
          rel="noreferrer"
        >
          🔗 Live API Docs
        </a>
        <a
          className="link-chip"
          href="https://github.com/Rahul543-ux/SmartMenu-QR-AI"
          target="_blank"
          rel="noreferrer"
        >
          💻 GitHub Repo
        </a>
      </div>

      <div className="built-tag">
        Built by <strong>Rahul</strong> · FastAPI + Sentence Transformers + React
      </div>
    </div>
  );
}
