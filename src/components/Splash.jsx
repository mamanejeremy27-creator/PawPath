import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E" };

export default function Splash() {
  const { setScreen, T } = useApp();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-20%", left: "-20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />
      <div style={{ zIndex: 2, textAlign: "center", animation: "fadeInUp 0.8s ease" }}>
        <div style={{ fontSize: 72, marginBottom: 24, filter: "drop-shadow(0 0 40px rgba(34,197,94,0.3))" }}>🐾</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, margin: 0, letterSpacing: -2, color: C.t1 }}>{T("appName")}</h1>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 12, letterSpacing: 4, textTransform: "uppercase", fontWeight: 500 }}>{T("tagline")}</p>
        <button onClick={() => setScreen("onboard")} style={{ marginTop: 56, padding: "18px 56px", fontSize: 16, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.3)" }}>{T("getStarted")}</button>
      </div>
    </div>
  );
}
