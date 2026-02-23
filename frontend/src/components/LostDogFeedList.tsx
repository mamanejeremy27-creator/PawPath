import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, AlertCircle, Dog } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };

export default function LostDogFeedList() {
  const { nav, T } = useApp();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) { setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async () => {
        try {
          const data = await api.getLostDogReports();
          if (data) setAlerts(data);
        } catch { /* silent */ }
        setLoading(false);
      },
      () => setLoading(false),
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  // Remove report immediately when marked found/cancelled
  useEffect(() => {
    const handler = (e) => {
      const { reportId } = e.detail || {};
      if (reportId) setAlerts(prev => prev.filter(a => a.id !== reportId));
    };
    window.addEventListener("pawpath-lost-dog-updated", handler);
    return () => window.removeEventListener("pawpath-lost-dog-updated", handler);
  }, []);

  const timeSince = (iso) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t1, cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><ArrowLeft size={24} /></button>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: C.danger, display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={20} /> {T("lostDogsNearYou")}</h1>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.danger, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : alerts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: C.t3 }}>
          <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><Dog size={40} color={C.t3} /></div>
          <p style={{ fontSize: 14 }}>{T("lostNoNearbyAlerts")}</p>
        </div>
      ) : (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {alerts.map(alert => {
            const distText = alert._distance < 1
              ? `${Math.round(alert._distance * 1000)}m`
              : `${alert._distance.toFixed(1)} km`;
            return (
              <div key={alert.id} style={{ padding: "16px 18px", background: C.s1, borderRadius: C.rL, border: "1px solid rgba(239,68,68,0.15)" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", flexShrink: 0, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {alert.dog_photo ? (
                      <PhotoImg src={alert.dog_photo} style={{ width: 56, height: 56, objectFit: "cover" }} />
                    ) : (
                      <Dog size={28} color={C.t3} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>{alert.dog_name}</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
                      {alert.dog_breed && `${alert.dog_breed} · `}
                      <span style={{ color: C.danger, fontWeight: 600 }}>{distText} {T("lostAway")}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
                      {T("lostLastSeen")} {timeSince(alert.created_at)} {T("lostAgo")}
                      {alert.last_location_name && ` · ${alert.last_location_name}`}
                    </div>
                    {alert.description && (
                      <div style={{ fontSize: 12, color: C.t2, marginTop: 6, fontStyle: "italic", lineHeight: 1.4 }}>"{alert.description}"</div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => nav("reportSighting", { reportId: alert.id })}
                    style={{ flex: 1, padding: "10px 16px", fontSize: 13, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer" }}>
                    {T("lostISpotted")}
                  </button>
                  <button onClick={() => {
                    const text = `🚨 ${alert.dog_name}${alert.dog_breed ? ` (${alert.dog_breed})` : ""}`;
                    if (navigator.share) navigator.share({ title: T("lostDogAlert"), text }).catch(() => {});
                  }}
                    style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, background: "transparent", color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                    {T("lostShare")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
