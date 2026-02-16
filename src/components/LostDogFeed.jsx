import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getActiveLostDogs } from "../lib/lostDog.js";
import PhotoImg from "./PhotoImg.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", danger: "#EF4444", r: 16, rL: 24 };

export default function LostDogFeed() {
  const { nav, T } = useApp();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) { setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await getActiveLostDogs(pos.coords.latitude, pos.coords.longitude, 20);
        if (res.data?.length) setAlerts(res.data);
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

  if (loading || alerts.length === 0) return null;

  return (
    <div style={{ padding: "12px 20px 0" }}>
      <button onClick={() => nav("lostDogFeedList")}
        style={{
          width: "100%", padding: "16px 20px",
          background: "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.04))",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: C.rL, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 14,
          color: C.t1, textAlign: "start",
        }}>
        <span style={{ fontSize: 28 }}>{"🚨"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.danger }}>{T("lostDogsNearYou")}</div>
          <div style={{ fontSize: 12, color: C.t2, marginTop: 2 }}>
            {alerts.length} {alerts.length === 1 ? T("lostActiveAlert") : T("lostActiveAlerts")}
          </div>
          {/* Preview first dog */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: C.s1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {alerts[0].dog_photo ? (
                <PhotoImg src={alerts[0].dog_photo} style={{ width: 28, height: 28, objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 14 }}>{"\uD83D\uDC15"}</span>
              )}
            </div>
            <span style={{ fontSize: 12, color: C.t3 }}>
              {alerts[0].dog_name}
              {alerts[0]._distance != null && ` · ${alerts[0]._distance < 1 ? `${Math.round(alerts[0]._distance * 1000)}m` : `${alerts[0]._distance.toFixed(1)}km`}`}
            </span>
            {alerts.length > 1 && <span style={{ fontSize: 11, color: C.t3 }}>+{alerts.length - 1}</span>}
          </div>
        </div>
        <span style={{ color: C.t3, fontSize: 18 }}>{"\u203A"}</span>
      </button>
    </div>
  );
}
