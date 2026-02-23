import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, AlertCircle, Dog } from "lucide-react";
import { GlowBadge } from "./ui/GlowBadge";

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
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      <div className="px-5 pt-5 flex items-center gap-3">
        <button onClick={() => nav("home")} className="bg-transparent border-none text-text cursor-pointer p-0 flex items-center"><ArrowLeft size={24} /></button>
        <h1 className="text-[20px] font-extrabold m-0 text-danger flex items-center gap-2"><AlertCircle size={20} /> {T("lostDogsNearYou")}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-danger rounded-full animate-spin" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 px-5 text-muted">
          <div className="mb-3 flex justify-center"><Dog size={40} className="text-muted" /></div>
          <p className="text-sm">{T("lostNoNearbyAlerts")}</p>
        </div>
      ) : (
        <div className="px-5 pt-4 flex flex-col gap-[10px]">
          {alerts.map(alert => {
            const distText = alert._distance < 1
              ? `${Math.round(alert._distance * 1000)}m`
              : `${alert._distance.toFixed(1)} km`;
            return (
              <div key={alert.id} className="px-[18px] py-4 bg-surface rounded-3xl border border-danger/15">
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-[14px] overflow-hidden shrink-0 bg-bg flex items-center justify-center">
                    {alert.dog_photo ? (
                      <PhotoImg src={alert.dog_photo} style={{ width: 56, height: 56, objectFit: "cover" }} />
                    ) : (
                      <Dog size={28} className="text-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-extrabold text-text">{alert.dog_name}</div>
                    <div className="text-xs text-muted mt-0.5">
                      {alert.dog_breed && `${alert.dog_breed} · `}
                      <span className="text-danger font-semibold">{distText} {T("lostAway")}</span>
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">
                      {T("lostLastSeen")} {timeSince(alert.created_at)} {T("lostAgo")}
                      {alert.last_location_name && ` · ${alert.last_location_name}`}
                    </div>
                    {alert.description && (
                      <div className="text-xs text-text-2 mt-1.5 italic leading-[1.4]">"{alert.description}"</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => nav("reportSighting", { reportId: alert.id })}
                    className="flex-1 px-4 py-[10px] text-[13px] font-bold bg-danger text-white border-none rounded-full cursor-pointer"
                  >
                    {T("lostISpotted")}
                  </button>
                  <button
                    onClick={() => {
                      const text = `🚨 ${alert.dog_name}${alert.dog_breed ? ` (${alert.dog_breed})` : ""}`;
                      if (navigator.share) navigator.share({ title: T("lostDogAlert"), text }).catch(() => {});
                    }}
                    className="px-4 py-[10px] text-[13px] font-bold bg-transparent text-text border border-border rounded-full cursor-pointer"
                  >
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
