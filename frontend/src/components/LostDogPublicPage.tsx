import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import LostDogMap from "./LostDogMap.jsx";
import { AlertCircle, Dog, Eye } from "lucide-react";
import { GlowBadge } from "./ui/GlowBadge";
import { cn } from "../lib/cn";

export default function LostDogPublicPage({ shareTokenFromUrl }: { shareTokenFromUrl?: string }) {
  const { nav, T, screenParams } = useApp();
  const shareToken = shareTokenFromUrl || screenParams?.shareToken;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shareToken) { setError(true); setLoading(false); return; }
    api.getPublicLostDog(shareToken).then(data => {
      if (data) setReport(data);
      else setError(true);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-white/10 border-t-danger rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-5">
        <div className="text-center">
          <div className="mb-4 flex justify-center"><Dog size={48} className="text-muted" /></div>
          <p className="text-muted text-[15px]">{T("lostReportNotFound")}</p>
          <button
            onClick={() => nav("home")}
            className="mt-4 px-6 py-3 bg-surface text-text border border-border rounded-full cursor-pointer text-sm font-semibold"
          >{T("home")}</button>
        </div>
      </div>
    );
  }

  const isActive = report.status === "active";
  const timeSince = () => {
    const mins = Math.floor((Date.now() - new Date(report.created_at).getTime()) / 60000);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="min-h-screen bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Urgent banner */}
      <div className={cn(
        "px-5 py-4 text-center border-b",
        isActive ? "bg-danger/10 border-danger/20" : "bg-training/10 border-training/20"
      )}>
        <div className={cn("text-sm font-extrabold flex items-center justify-center gap-1", isActive ? "text-danger" : "text-training")}>
          <AlertCircle size={16} className="inline align-middle me-1" />
          {isActive ? T("lostDogAlert") : `${report.dog_name} ${T("lostFoundTitle")}`}
        </div>
      </div>

      <div className="px-5 py-6 max-w-[480px] mx-auto">
        {/* Dog photo */}
        <div className="text-center mb-5">
          <div className={cn(
            "w-[120px] h-[120px] rounded-3xl overflow-hidden mx-auto bg-surface flex items-center justify-center border-[3px]",
            isActive ? "border-danger" : "border-training"
          )}>
            {report.dog_photo ? (
              <PhotoImg src={report.dog_photo} style={{ width: 120, height: 120, objectFit: "cover" }} />
            ) : (
              <Dog size={56} className="text-muted" />
            )}
          </div>
        </div>

        {/* Dog info */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-extrabold text-text m-0 mb-1">{report.dog_name}</h1>
          {report.dog_breed && <div className="text-[15px] text-muted">{report.dog_breed}</div>}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-3">
          {report.description && (
            <div className="px-[18px] py-[14px] bg-surface rounded-2xl border border-border">
              <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-1.5">{T("lostDescription")}</div>
              <div className="text-sm text-text leading-relaxed">{report.description}</div>
            </div>
          )}

          <div className="px-[18px] py-[14px] bg-surface rounded-2xl border border-border">
            <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-1.5">{T("lostLastSeenArea")}</div>
            <div className="text-sm text-text">
              {report.last_location_name || `${report.last_lat?.toFixed(4)}, ${report.last_lng?.toFixed(4)}`}
            </div>
            <div className="text-xs text-muted mt-1">{timeSince()} {T("lostAgo")}</div>
            {report.last_lat && report.last_lng && (
              <div className="mt-[10px]">
                <LostDogMap
                  center={{ lat: report.last_lat, lng: report.last_lng }}
                  zoom={14}
                  height={180}
                  interactive={false}
                  originLabel={T("lostLastKnown")}
                />
              </div>
            )}
          </div>

          {report.contact_phone && isActive && (
            <div className="px-[18px] py-[14px] bg-surface rounded-2xl border border-border">
              <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-1.5">{T("lostContact")}</div>
              <div className="text-[15px] font-bold text-text">
                {report.contact_name && <span>{report.contact_name} · </span>}
                <a href={`tel:${report.contact_phone}`} className="text-training no-underline">{report.contact_phone}</a>
              </div>
            </div>
          )}
        </div>

        {/* CTA button */}
        {isActive && (
          <div className="mt-6">
            <button
              onClick={() => nav("reportSighting", { reportId: report.id })}
              className="w-full py-[18px] text-lg font-extrabold bg-danger text-white border-none rounded-full cursor-pointer shadow-[0_4px_24px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
            >
              <Eye size={18} /> {T("lostISawThisDog")}
            </button>

            <button
              onClick={() => {
                const text = `🚨 ${T("lostDogAlert")}: ${report.dog_name}`;
                if (navigator.share) navigator.share({ title: T("lostDogAlert"), text, url: window.location.href }).catch(() => {});
              }}
              className="w-full mt-[10px] py-[14px] text-sm font-semibold bg-surface text-text border border-border rounded-full cursor-pointer"
            >
              {T("lostShare")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
