import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import DogAvatar from "./DogAvatar.jsx";
import LostDogMap from "./LostDogMap.jsx";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, AlertCircle } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", dangerBg: "rgba(239,68,68,0.08)", dangerBorder: "rgba(239,68,68,0.2)", r: 16, rL: 24 };

export default function ReportLostDog() {
  const { nav, T, dogProfile, activeDogId, lang } = useApp();

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("loading");
  const [radius, setRadius] = useState(10);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Auto-get GPS
  useEffect(() => {
    if (!navigator.geolocation) { setGpsStatus("error"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setGpsStatus("ok"); },
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
      <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
        <div style={{ padding: "60px 20px 24px", textAlign: "center" }}>
          <div style={{ marginBottom: 16, animation: "fadeIn 0.5s ease", display: "flex", justifyContent: "center" }}><AlertCircle size={64} color={C.danger} /></div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.danger, margin: "0 0 8px" }}>{T("lostAlertSent")}</h1>
          <p style={{ fontSize: 14, color: C.t2, margin: "0 0 24px", lineHeight: 1.6 }}>{T("lostAlertSentSub")}</p>

          <div style={{ padding: 20, background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, marginBottom: 16, textAlign: "start" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{T("lostShareLink")}</div>
            <div style={{ fontSize: 13, color: C.acc, wordBreak: "break-all", fontFamily: "monospace", padding: "10px 14px", background: "rgba(34,197,94,0.06)", borderRadius: 12 }}>
              {shareUrl}
            </div>
          </div>

          <button onClick={handleShare} style={{ width: "100%", padding: 16, fontSize: 15, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer", marginBottom: 12 }}>
            {T("lostShareAlert")}
          </button>

          <button onClick={() => nav("lostDogTracker", { reportId: result.id })} style={{ width: "100%", padding: 16, fontSize: 15, fontWeight: 700, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer", marginBottom: 12 }}>
            {T("lostViewTracker")}
          </button>

          <button onClick={() => nav("home")} style={{ width: "100%", padding: 14, fontSize: 14, fontWeight: 600, background: "transparent", color: C.t3, border: "none", cursor: "pointer" }}>
            {T("back")}
          </button>
        </div>
      </div>
    );
  }

  // ── Report Form ──
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t1, cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}><ArrowLeft size={24} /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: C.danger, display: "flex", alignItems: "center", gap: 8 }}><AlertCircle size={22} /> {T("lostReportTitle")}</h1>
          <p style={{ fontSize: 12, color: C.t3, margin: "2px 0 0" }}>{T("lostReportSub")}</p>
        </div>
      </div>

      {/* Urgent banner */}
      <div style={{ margin: "16px 20px 0", padding: "14px 18px", background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: C.r }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.danger }}>{T("lostUrgentBanner")}</div>
      </div>

      {/* Dog info (auto-filled) */}
      <div style={{ margin: "16px 20px 0", padding: "16px 18px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 14 }}>
        <DogAvatar size="small" dogId={activeDogId} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{dogProfile?.name || "Dog"}</div>
          <div style={{ fontSize: 13, color: C.t3 }}>{dogProfile?.breed || ""}</div>
        </div>
      </div>

      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* GPS Location */}
        <div>
          <label style={lbl}>{T("lostLastLocation")}</label>
          <div style={{ padding: "12px 16px", background: C.s1, borderRadius: 12, border: `1px solid ${C.b1}`, fontSize: 13, color: gpsStatus === "ok" ? C.acc : gpsStatus === "error" ? C.danger : C.t3 }}>
            {gpsStatus === "loading" && T("lostGpsLoading")}
            {gpsStatus === "ok" && `${T("lostGpsLocked")} (${lat?.toFixed(4)}, ${lng?.toFixed(4)})`}
            {gpsStatus === "error" && T("lostGpsError")}
          </div>
        </div>

        {/* Tap-to-set location map */}
        {(lat !== null && lng !== null) && (
          <div>
            <label style={lbl}>{T("lostTapToSetLocation") || "Tap map to adjust location"}</label>
            <LostDogMap
              center={{ lat, lng }}
              zoom={15}
              height={200}
              interactive={true}
              tappable={true}
              onTap={(latlng) => { setLat(latlng.lat); setLng(latlng.lng); }}
              markerPosition={{ lat, lng }}
              originLabel={T("lostLastKnown")}
            />
          </div>
        )}

        {/* Location name (optional) */}
        <div>
          <label style={lbl}>{T("lostLocationName")}</label>
          <input value={locationName} onChange={e => setLocationName(e.target.value)} placeholder={T("lostLocationPlaceholder")} style={input} />
        </div>

        {/* Contact name */}
        <div>
          <label style={lbl}>{T("lostContactName")}</label>
          <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder={dogProfile?.name ? `${dogProfile.name}'s owner` : ""} style={input} />
        </div>

        {/* Contact phone (required) */}
        <div>
          <label style={lbl}>{T("lostContactPhone")} *</label>
          <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} type="tel" placeholder="050-000-0000" style={input} />
        </div>

        {/* Description */}
        <div>
          <label style={lbl}>{T("lostDescription")}</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={T("lostDescPlaceholder")} rows={3} style={{ ...input, resize: "vertical", minHeight: 72, fontFamily: "inherit" }} />
        </div>

        {/* Search radius slider */}
        <div>
          <label style={lbl}>{T("lostSearchRadius")}: {radius} km</label>
          <input type="range" min={5} max={20} step={1} value={radius} onChange={e => setRadius(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.danger }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.t3 }}>
            <span>5 km</span><span>20 km</span>
          </div>
        </div>

        {/* Error message */}
        {submitError && (
          <div style={{ padding: "12px 16px", background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, borderRadius: 12, fontSize: 13, color: C.danger }}>
            {submitError}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={!canSubmit || sending}
          style={{
            width: "100%", padding: 18, fontSize: 18, fontWeight: 800,
            background: canSubmit ? C.danger : "rgba(239,68,68,0.3)",
            color: "#fff", border: "none", borderRadius: 50, cursor: canSubmit ? "pointer" : "default",
            marginTop: 8, opacity: sending ? 0.7 : 1,
            boxShadow: canSubmit ? "0 4px 24px rgba(239,68,68,0.4)" : "none",
          }}>
          <AlertCircle size={18} /> {sending ? T("lostSending") : T("lostSendAlert")}
        </button>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 };
const input = { width: "100%", padding: "12px 16px", fontSize: 15, background: "#131316", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, color: "#F5F5F7", outline: "none", boxSizing: "border-box" };
