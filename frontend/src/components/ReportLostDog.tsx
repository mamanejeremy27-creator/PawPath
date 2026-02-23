import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import DogAvatar from "./DogAvatar.jsx";
import LostDogMap from "./LostDogMap.jsx";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { cn } from "../lib/cn";

export default function ReportLostDog() {
  const { nav, T, dogProfile, activeDogId, lang } = useApp();

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("loading");
  const [gpsAccuracy, setGpsAccuracy] = useState(null); // meters
  const [radius, setRadius] = useState(10);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Auto-get GPS
  useEffect(() => {
    if (!navigator.geolocation) { setGpsStatus("error"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsStatus(pos.coords.accuracy > 500 ? "low_accuracy" : "ok");
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const canSubmit = contactPhone.trim() && lat !== null && lng !== null;

  const handleSubmit = async () => {
    if (!canSubmit || sending) return;
    setSending(true);
    setSubmitError(null);
    try {
      const data = await api.createLostDogReport({
        dogId: activeDogId,
        dogName: dogProfile?.name || "Dog",
        dogBreed: dogProfile?.breed || "",
        dogPhoto: dogProfile?.photo || null,
        lastLat: lat,
        lastLng: lng,
        lastLocationName: locationName.trim() || null,
        contactName: contactName.trim() || dogProfile?.name + "'s owner",
        contactPhone: contactPhone.trim(),
        description: description.trim() || null,
        searchRadiusKm: radius,
      });
      setSending(false);
      setResult(data);
    } catch (err) {
      setSending(false);
      console.error("[ReportLostDog] Submit failed:", err.message);
      setSubmitError(err.message || "Failed to send alert. Please try again.");
    }
  };

  const getShareUrl = (token) => `${window.location.origin}/lost/${token}`;
  const getShareText = (report) => {
    const name = report.dog_name || report.dogName || "Dog";
    const breed = report.dog_breed || report.dogBreed || "";
    const url = getShareUrl(report.share_token || report.shareToken);
    return `🚨 LOST DOG! ${name}${breed ? ` (${breed})` : ""} was last seen in the area. If you spot them, please report: ${url}`;
  };

  const handleShare = () => {
    if (!result) return;
    const text = getShareText(result);
    const url = getShareUrl(result.share_token || result.shareToken);
    if (navigator.share) {
      navigator.share({ title: T("lostDogAlert"), text, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  // ── Success Screen ──
  if (result) {
    const shareUrl = getShareUrl(result.share_token || result.shareToken);
    return (
      <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
        <div className="px-5 pt-16 pb-6 text-center">
          <div className="mb-4 animate-[fadeIn_0.5s_ease] flex justify-center"><AlertCircle size={64} className="text-danger" /></div>
          <h1 className="text-2xl font-extrabold text-danger m-0 mb-2">{T("lostAlertSent")}</h1>
          <p className="text-sm text-text-2 m-0 mb-6 leading-relaxed">{T("lostAlertSentSub")}</p>

          <div className="p-5 bg-surface rounded-3xl border border-border mb-4 text-start">
            <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-2">{T("lostShareLink")}</div>
            <div className="text-[13px] text-training break-all font-mono px-[14px] py-[10px] bg-training/[0.06] rounded-xl">
              {shareUrl}
            </div>
          </div>

          <button onClick={handleShare} className="w-full py-4 text-[15px] font-bold bg-danger text-white border-none rounded-full cursor-pointer mb-3">
            {T("lostShareAlert")}
          </button>

          <button onClick={() => nav("lostDogTracker", { reportId: result.id })} className="w-full py-4 text-[15px] font-bold bg-surface text-text border border-border rounded-full cursor-pointer mb-3">
            {T("lostViewTracker")}
          </button>

          <button onClick={() => nav("home")} className="w-full py-[14px] text-sm font-semibold bg-transparent text-muted border-none cursor-pointer">
            {T("back")}
          </button>
        </div>
      </div>
    );
  }

  // ── Report Form ──
  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3">
        <button onClick={() => nav("home")} className="bg-transparent border-none text-text cursor-pointer p-0 flex items-center"><ArrowLeft size={24} /></button>
        <div className="flex-1">
          <h1 className="text-[22px] font-extrabold m-0 text-danger flex items-center gap-2"><AlertCircle size={22} /> {T("lostReportTitle")}</h1>
          <p className="text-xs text-muted m-0 mt-0.5">{T("lostReportSub")}</p>
        </div>
      </div>

      {/* Urgent banner */}
      <div className="mx-5 mt-4 px-[18px] py-[14px] bg-danger/10 border border-danger/20 rounded-2xl">
        <div className="text-[13px] font-bold text-danger">{T("lostUrgentBanner")}</div>
      </div>

      {/* Dog info (auto-filled) */}
      <div className="mx-5 mt-4 px-[18px] py-4 bg-surface rounded-3xl border border-border flex items-center gap-[14px]">
        <DogAvatar size="small" dogId={activeDogId} />
        <div>
          <div className="text-base font-bold text-text">{dogProfile?.name || "Dog"}</div>
          <div className="text-[13px] text-muted">{dogProfile?.breed || ""}</div>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-[14px]">
        {/* GPS Location */}
        <div>
          <label className={lbl}>{T("lostLastLocation")}</label>
          <div className={cn(
            "px-4 py-3 bg-surface rounded-xl border border-border text-[13px]",
            gpsStatus === "ok" ? "text-training" : gpsStatus === "low_accuracy" ? "text-xp" : gpsStatus === "error" ? "text-danger" : "text-muted"
          )}>
            {gpsStatus === "loading" && T("lostGpsLoading")}
            {gpsStatus === "ok" && `${T("lostGpsLocked")} (${lat?.toFixed(4)}, ${lng?.toFixed(4)})`}
            {gpsStatus === "low_accuracy" && (
              <>
                {T("lostGpsLowAccuracy") || "Location approximate"} ({gpsAccuracy}m) — {T("lostTapToSetLocation") || "tap map to adjust"}
                <div className="text-xs mt-1 text-muted">({lat?.toFixed(4)}, {lng?.toFixed(4)})</div>
              </>
            )}
            {gpsStatus === "error" && T("lostGpsError")}
          </div>
        </div>

        {/* Tap-to-set location map — show even on error so user can pick manually */}
        {(lat !== null && lng !== null) ? (
          <div>
            <label className={lbl}>{T("lostTapToSetLocation") || "Tap map to adjust location"}</label>
            <LostDogMap
              center={{ lat, lng }}
              zoom={gpsStatus === "low_accuracy" ? 12 : 15}
              height={200}
              interactive={true}
              tappable={true}
              onTap={(latlng) => { setLat(latlng.lat); setLng(latlng.lng); setGpsStatus("ok"); }}
              markerPosition={{ lat, lng }}
              originLabel={T("lostLastKnown")}
            />
          </div>
        ) : gpsStatus === "error" && (
          <div>
            <label className={lbl}>{T("lostTapToSetLocation") || "Tap map to set location"}</label>
            <LostDogMap
              center={{ lat: 32.08, lng: 34.78 }}
              zoom={10}
              height={200}
              interactive={true}
              tappable={true}
              onTap={(latlng) => { setLat(latlng.lat); setLng(latlng.lng); setGpsStatus("ok"); }}
              originLabel=""
            />
          </div>
        )}

        {/* Location name (optional) */}
        <div>
          <label className={lbl}>{T("lostLocationName")}</label>
          <input value={locationName} onChange={e => setLocationName(e.target.value)} placeholder={T("lostLocationPlaceholder")} className={inputCls} />
        </div>

        {/* Contact name */}
        <div>
          <label className={lbl}>{T("lostContactName")}</label>
          <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder={dogProfile?.name ? `${dogProfile.name}'s owner` : ""} className={inputCls} />
        </div>

        {/* Contact phone (required) */}
        <div>
          <label className={lbl}>{T("lostContactPhone")} *</label>
          <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} type="tel" placeholder="050-000-0000" className={inputCls} />
        </div>

        {/* Description */}
        <div>
          <label className={lbl}>{T("lostDescription")}</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={T("lostDescPlaceholder")} rows={3} className={cn(inputCls, "resize-y min-h-[72px] font-[inherit]")} />
        </div>

        {/* Search radius slider */}
        <div>
          <label className={lbl}>{T("lostSearchRadius")}: {radius} km</label>
          <input
            type="range" min={5} max={20} step={1} value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            className="w-full accent-danger"
          />
          <div className="flex justify-between text-[11px] text-muted">
            <span>5 km</span><span>20 km</span>
          </div>
        </div>

        {/* Error message */}
        {submitError && (
          <div className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-[13px] text-danger">
            {submitError}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || sending}
          className={cn(
            "w-full py-[18px] text-lg font-extrabold text-white border-none rounded-full mt-2 flex items-center justify-center gap-2",
            canSubmit
              ? "bg-danger cursor-pointer shadow-[0_4px_24px_rgba(239,68,68,0.4)]"
              : "bg-danger/30 cursor-default",
            sending && "opacity-70"
          )}
        >
          <AlertCircle size={18} /> {sending ? T("lostSending") : T("lostSendAlert")}
        </button>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

const lbl = "block text-xs font-bold text-text-2 uppercase tracking-widest mb-1.5";
const inputCls = "w-full px-4 py-3 text-[15px] bg-surface-2 border border-border-2 rounded-2xl text-text outline-none focus:border-danger/50 transition-colors box-border";
