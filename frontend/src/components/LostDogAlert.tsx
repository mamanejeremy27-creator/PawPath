import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import { AlertCircle, Dog } from "lucide-react";

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
    <div className="mx-5 mt-3" style={{ animation: "fadeIn 0.3s ease" }}>
      <div className="px-[18px] py-4 rounded-3xl bg-danger/5 border border-danger/25 relative">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 end-3.5 bg-transparent border-none text-muted text-[18px] cursor-pointer p-0 leading-none"
        >
          {"×"}
        </button>

        <div className="flex items-center gap-1 mb-2.5">
          <AlertCircle size={16} color="#EF4444" />
          <span className="text-[12px] font-extrabold text-danger uppercase tracking-[1.5px]">
            {T("lostDogNearby")}
          </span>
        </div>

        <div className="flex gap-3">
          {/* Dog photo */}
          <div className="w-14 h-14 rounded-[14px] overflow-hidden shrink-0 bg-surface flex items-center justify-center">
            {alert.dog_photo ? (
              <PhotoImg src={alert.dog_photo} style={{ width: 56, height: 56, objectFit: "cover" }} />
            ) : (
              <Dog size={28} color="#71717A" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-base font-extrabold text-text">{alert.dog_name}</div>
            <div className="text-[12px] text-muted mt-0.5">
              {alert.dog_breed && <span>{alert.dog_breed} · </span>}
              <span className="text-danger font-semibold">{distText} {T("lostAway")}</span>
            </div>
            <div className="text-[11px] text-muted mt-0.5">
              {T("lostLastSeen")} {timeSince()}
              {alert.last_location_name && ` · ${alert.last_location_name}`}
            </div>
          </div>
        </div>

        {alert.description && (
          <div className="text-[12px] text-text-2 mt-2.5 leading-[1.5] italic">
            "{alert.description}"
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => nav("reportSighting", { reportId: alert.id })}
            className="flex-1 py-2.5 px-4 text-[13px] font-bold bg-danger text-white border-none rounded-full cursor-pointer"
          >
            {T("lostISpotted")}
          </button>
          <button
            onClick={() => {
              const text = `🚨 ${T("lostDogAlert")}: ${alert.dog_name}${alert.dog_breed ? ` (${alert.dog_breed})` : ""}`;
              if (navigator.share) navigator.share({ title: T("lostDogAlert"), text }).catch(() => {});
            }}
            className="py-2.5 px-4 text-[13px] font-bold bg-surface text-text border border-border rounded-full cursor-pointer"
          >
            {T("lostShare")}
          </button>
        </div>

        {visible.length > 1 && (
          <div className="text-center mt-2 text-[11px] text-muted">
            +{visible.length - 1} {T("lostMoreAlerts")}
          </div>
        )}
      </div>
    </div>
  );
}
