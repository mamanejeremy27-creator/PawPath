import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import { haversine } from "../lib/walkTracker.js";
import PhotoImg from "./PhotoImg.jsx";
import LostDogMap from "./LostDogMap.jsx";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, AlertCircle, CheckCircle2, PartyPopper, AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

export default function LostDogTracker() {
  const { nav, T, lang, screenParams } = useApp();
  const reportId = screenParams?.reportId;

  const [report, setReport] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFound, setShowFound] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    const load = async () => {
      try {
        const reports = await api.getLostDogReports();
        const rep = (reports || []).find(r => r.id === reportId);
        if (rep) {
          setReport(rep);
          setSightings(rep.sightings || []);
        }
      } catch {}
      setLoading(false);
    };
    load();
    // Auto-refresh every 30s
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [reportId]);

  const handleMarkFound = async () => {
    try { await api.updateLostDogReport(reportId, { status: "found" }); } catch {}
    setCelebrated(true);
    setReport(prev => prev ? { ...prev, status: "found" } : prev);
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "found" } }));
  };

  const handleCancel = async () => {
    try { await api.updateLostDogReport(reportId, { status: "cancelled" }); } catch {}
    setConfirmCancel(false);
    window.dispatchEvent(new CustomEvent("pawpath-lost-dog-updated", { detail: { reportId, status: "cancelled" } }));
    nav("home");
  };

  const getShareUrl = (token) => `${window.location.origin}/lost/${token}`;

  const handleShare = () => {
    if (!report) return;
    const name = report.dog_name || "Dog";
    const breed = report.dog_breed || "";
    const url = getShareUrl(report.share_token);
    const text = `🚨 LOST DOG! ${name}${breed ? ` (${breed})` : ""} was last seen in the area. If you spot them, please report: ${url}`;
    if (navigator.share) navigator.share({ title: T("lostDogAlert"), text, url }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-white/10 border-t-danger rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-5">
        <div className="text-center">
          <p className="text-muted">{T("lostReportNotFound")}</p>
          <button
            onClick={() => nav("home")}
            className="mt-4 px-6 py-3 bg-surface text-text border border-border rounded-full cursor-pointer text-sm font-semibold"
          >{T("back")}</button>
        </div>
      </div>
    );
  }

  // ── Celebration overlay ──
  if (celebrated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-5">
        <div className="text-center animate-[fadeIn_0.5s_ease]">
          <div className="mb-4 animate-[fadeIn_0.8s_ease] flex justify-center"><PartyPopper size={80} className="text-training" /></div>
          <h1 className="text-[28px] font-extrabold text-training m-0 mb-2">{report.dog_name} {T("lostFoundTitle")}</h1>
          <p className="text-[15px] text-text-2 m-0 mb-8 leading-relaxed">{T("lostFoundSub")}</p>
          <button
            onClick={() => nav("home")}
            className="px-8 py-[14px] text-[15px] font-bold bg-training text-black border-none rounded-full cursor-pointer"
          >
            {T("back")}
          </button>
        </div>
      </div>
    );
  }

  const isActive = report.status === "active";
  const timeSince = (iso) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const mapSightings = sightings.filter(s => s.lat && s.lng).map(s => ({
    lat: s.lat, lng: s.lng, label: s.reporter_name || "Sighting",
    time: s.created_at, notes: s.notes, photoUrl: s.photo || null,
  }));

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3">
        <button onClick={() => nav("home")} className="bg-transparent border-none text-text cursor-pointer p-0 flex items-center"><ArrowLeft size={24} /></button>
        <div className="flex-1">
          <h1 className={cn("text-[20px] font-extrabold m-0 flex items-center gap-2", isActive ? "text-danger" : "text-training")}>
            {isActive
              ? <><AlertCircle size={20} /> {T("lostTracking")} {report.dog_name}</>
              : <><CheckCircle2 size={20} /> {report.dog_name} {T("lostFoundTitle")}</>
            }
          </h1>
          <p className="text-xs text-muted m-0 mt-0.5">{T("lostReported")} {timeSince(report.created_at)} {T("lostAgo")}</p>
        </div>
      </div>

      {/* Status badge */}
      <div className="px-5 pt-3">
        <div className={cn(
          "inline-block px-4 py-1.5 rounded-full text-xs font-bold",
          isActive
            ? "bg-danger/10 text-danger border border-danger/20"
            : "bg-training/10 text-training border border-training/20"
        )}>
          {isActive ? T("lostStatusActive") : report.status === "found" ? T("lostStatusFound") : T("lostStatusCancelled")}
        </div>
        <span className="ms-2 text-[13px] text-muted">{sightings.length} {T("lostSightingsCount")}</span>
      </div>

      {/* Interactive Map */}
      {report.last_lat && report.last_lng && (
        <div className="mx-5 mt-4 p-4 bg-surface rounded-3xl border border-border">
          <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-[10px]">{T("lostSightingMap")}</div>
          <LostDogMap
            center={{ lat: report.last_lat, lng: report.last_lng }}
            radiusKm={report.search_radius_km || 10}
            sightings={mapSightings}
            originLabel={T("lostLastKnown")}
            fitAll={sightings.length > 0}
            height={260}
          />
          <div className="flex gap-4 mt-2 text-[10px] text-muted">
            <span>
              <span className="inline-block w-2 h-2 rounded-full bg-danger me-1 align-middle" />
              {T("lostLastKnown")}
            </span>
            <span>
              <span className="inline-block w-2 h-2 rounded-full bg-xp me-1 align-middle" />
              {T("lostSightings")}
            </span>
          </div>
        </div>
      )}

      {/* Sightings list */}
      <div className="px-5 pt-4">
        <h3 className="text-sm font-bold text-text m-0 mb-[10px]">{T("lostSightings")} ({sightings.length})</h3>
        {sightings.length === 0 ? (
          <div className="p-5 text-center text-muted text-[13px]">{T("lostNoSightings")}</div>
        ) : (
          <div className="flex flex-col gap-2">
            {sightings.map((s, i) => {
              const dist = haversine(report.last_lat, report.last_lng, s.lat, s.lng);
              return (
                <div key={s.id} className="px-4 py-[14px] bg-surface rounded-2xl border border-border">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-7 h-7 rounded-full bg-xp/10 border border-xp/20 flex items-center justify-center text-[11px] font-extrabold text-xp shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-text">
                        {s.reporter_name || "Anonymous"} · <span className="text-muted">{timeSince(s.created_at)} {T("lostAgo")}</span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {dist.toFixed(1)} km {T("lostFromLastKnown")}
                      </div>
                    </div>
                  </div>
                  {s.notes && <div className="text-[13px] text-text-2 mt-2 leading-[1.5]">{s.notes}</div>}
                  {s.photo && (
                    <div className="mt-2 rounded-[10px] overflow-hidden">
                      <PhotoImg src={s.photo} style={{ width: "100%", maxHeight: 160, objectFit: "cover", display: "block" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      {isActive && (
        <div className="px-5 pt-5 flex flex-col gap-[10px]">
          <button onClick={handleShare} className="w-full py-[14px] text-sm font-bold bg-danger text-white border-none rounded-full cursor-pointer">
            {T("lostShareAlert")}
          </button>
          <button onClick={() => setShowFound(true)} className="w-full py-[14px] text-sm font-bold bg-training text-black border-none rounded-full cursor-pointer flex items-center justify-center gap-1">
            <PartyPopper size={16} /> {T("lostMarkFound")}
          </button>
          <button onClick={() => setConfirmCancel(true)} className="w-full py-3 text-[13px] font-semibold bg-transparent text-muted border border-border rounded-full cursor-pointer">
            {T("lostCancelReport")}
          </button>
        </div>
      )}

      {/* Mark as Found confirm */}
      {showFound && (
        <div onClick={() => setShowFound(false)} className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center">
          <div onClick={e => e.stopPropagation()} className="bg-surface rounded-3xl p-7 max-w-xs w-[90%] text-center">
            <div className="mb-3 flex justify-center"><PartyPopper size={40} className="text-training" /></div>
            <p className="text-[15px] text-text m-0 mb-5">{T("lostFoundConfirm").replace("{name}", report.dog_name)}</p>
            <div className="flex gap-[10px]">
              <button onClick={() => setShowFound(false)} className="flex-1 py-3 text-sm font-semibold bg-transparent text-muted border border-border rounded-full cursor-pointer">{T("back")}</button>
              <button onClick={handleMarkFound} className="flex-1 py-3 text-sm font-bold bg-training text-black border-none rounded-full cursor-pointer">{T("lostMarkFound")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm */}
      {confirmCancel && (
        <div onClick={() => setConfirmCancel(false)} className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center">
          <div onClick={e => e.stopPropagation()} className="bg-surface rounded-3xl p-7 max-w-xs w-[90%] text-center">
            <div className="mb-3 flex justify-center"><AlertTriangle size={40} className="text-danger" /></div>
            <p className="text-[15px] text-text m-0 mb-5">{T("lostCancelConfirm")}</p>
            <div className="flex gap-[10px]">
              <button onClick={() => setConfirmCancel(false)} className="flex-1 py-3 text-sm font-semibold bg-transparent text-muted border border-border rounded-full cursor-pointer">{T("back")}</button>
              <button onClick={handleCancel} className="flex-1 py-3 text-sm font-bold bg-danger text-white border-none rounded-full cursor-pointer">{T("lostCancelReport")}</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
