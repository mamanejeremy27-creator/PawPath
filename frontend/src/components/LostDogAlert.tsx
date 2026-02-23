import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import { AlertCircle, Dog } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", danger: "#EF4444", r: 16, rL: 24 };

export default function LostDogAlert() {
  const { nav, T, lang } = useApp();
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("pawpath_dismissed_alerts") || "[]"); } catch { return []; }
  });
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await api.getLostDogReports();
          if (data?.length) setAlerts(data);
        } catch {}
      },
      () => {},
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

  const visible = alerts.filter(a => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  const alert = visible[0];
  const distText = alert._distance < 1
    ? `${Math.round(alert._distance * 1000)}m`
    : `${alert._distance.toFixed(1)} km`;

  const dismiss = () => {
    const next = [...dismissed, alert.id];
    setDismissed(next);
    sessionStorage.setItem("pawpath_dismissed_alerts", JSON.stringify(next));
  };

  const timeSince = () => {
    const mins = Math.floor((Date.now() - new Date(alert.created_at).getTime()) / 60000);
    if (mins < 60) return `${mins}${T("feedMinAgo")}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}${T("feedHrAgo")}`;
    return `${Math.floor(hrs / 24)}${T("feedDayAgo")}`;
  };

  return (
    <div style={{ margin: "12px 20px 0", animation: "fadeIn 0.3s ease" }}>
      <div style={{
        padding: "16px 18px", borderRadius: C.rL,
        background: "rgba(239,68,68,0.06)",
        border: "1px solid rgba(239,68,68,0.25)",
        position: "relative",
      }}>
        {/* Close */}
        <button onClick={dismiss} style={{ position: "absolute", top: 12, insetInlineEnd: 14, background: "none", border: "none", color: C.t3, fontSize: 18, cursor: "pointer", padding: 0 }}>{"×"}</button>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <AlertCircle size={16} color={C.danger} />
          <span style={{ fontSize: 12, fontWeight: 800, color: C.danger, textTransform: "uppercase", letterSpacing: 1.5 }}>{T("lostDogNearby")}</span>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {/* Dog photo */}
          <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", flexShrink: 0, background: C.s1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {alert.dog_photo ? (
              <PhotoImg src={alert.dog_photo} style={{ width: 56, height: 56, objectFit: "cover" }} />
            ) : (
              <Dog size={28} color={C.t3} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>{alert.dog_name}</div>
            <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
              {alert.dog_breed && <span>{alert.dog_breed} · </span>}
              <span style={{ color: C.danger, fontWeight: 600 }}>{distText} {T("lostAway")}</span>
            </div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>
              {T("lostLastSeen")} {timeSince()}
              {alert.last_location_name && ` · ${alert.last_location_name}`}
            </div>
          </div>
        </div>

        {alert.description && (
          <div style={{ fontSize: 12, color: C.t2, marginTop: 10, lineHeight: 1.5, fontStyle: "italic" }}>
            "{alert.description}"
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => nav("reportSighting", { reportId: alert.id })}
            style={{ flex: 1, padding: "10px 16px", fontSize: 13, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer" }}>
            {T("lostISpotted")}
          </button>
          <button onClick={() => {
            const text = `🚨 ${T("lostDogAlert")}: ${alert.dog_name}${alert.dog_breed ? ` (${alert.dog_breed})` : ""}`;
            if (navigator.share) navigator.share({ title: T("lostDogAlert"), text }).catch(() => {});
          }}
            style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
            {T("lostShare")}
          </button>
        </div>

        {visible.length > 1 && (
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.t3 }}>
            +{visible.length - 1} {T("lostMoreAlerts")}
          </div>
        )}
      </div>
    </div>
  );
}
