import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import { ChevronRight } from "lucide-react";

export default function LostDogFeed() {
  const { nav, T } = useApp();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) { setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async () => {
        try {
          const data = await api.getLostDogReports();
          if (data?.length) setAlerts(data);
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

  if (loading || alerts.length === 0) return null;

  return (
    <div className="px-5 pt-3">
      <button
        onClick={() => nav("lostDogFeedList")}
        className="w-full px-5 py-4 bg-gradient-to-br from-danger/10 to-danger/[0.04] border border-danger/25 rounded-3xl cursor-pointer flex items-center gap-[14px] text-text text-start"
      >
        <span className="text-[28px]">{"🚨"}</span>
        <div className="flex-1">
          <div className="text-sm font-bold text-danger">{T("lostDogsNearYou")}</div>
          <div className="text-xs text-text-2 mt-0.5">
            {alerts.length} {alerts.length === 1 ? T("lostActiveAlert") : T("lostActiveAlerts")}
          </div>
          {/* Preview first dog */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-surface flex items-center justify-center">
              {alerts[0].dog_photo ? (
                <PhotoImg src={alerts[0].dog_photo} style={{ width: 28, height: 28, objectFit: "cover" }} />
              ) : (
                <span className="text-sm">{"\uD83D\uDC15"}</span>
              )}
            </div>
            <span className="text-xs text-muted">
              {alerts[0].dog_name}
              {alerts[0]._distance != null && ` · ${alerts[0]._distance < 1 ? `${Math.round(alerts[0]._distance * 1000)}m` : `${alerts[0]._distance.toFixed(1)}km`}`}
            </span>
            {alerts.length > 1 && <span className="text-[11px] text-muted">+{alerts.length - 1}</span>}
          </div>
        </div>
        <ChevronRight size={18} className="text-muted" />
      </button>
    </div>
  );
}
