import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import { compressPhoto } from "../utils/photoCompressor.js";
import PhotoImg from "./PhotoImg.jsx";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };

export default function ReportSighting() {
  const { nav, T, screenParams } = useApp();
  const reportId = screenParams?.reportId;

  const [report, setReport] = useState(null);
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("loading");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const photoRef = useRef(null);

  // Load report details
  useEffect(() => {
    if (reportId) {
      api.getLostDogReports().then(reports => {
        const found = reports?.find(r => r.id === reportId);
        if (found) setReport(found);
      }).catch(() => {});
    }
  }, [reportId]);

  // Auto GPS
  useEffect(() => {
    if (!navigator.geolocation) { setGpsStatus("error"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setGpsStatus("ok"); },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressPhoto(file);
      setPhoto(base64);
    } catch { /* silent */ }
  };

  const handleSubmit = async () => {
    if (sending || !lat || !lng) return;
    setSending(true);
    try {
      await api.addSighting(reportId, {
        lat, lng,
        notes: notes.trim() || null,
        photo: photo || null,
        reporterName: reporterName.trim() || "Anonymous",
      });
    } catch { /* silent */ }
    setSending(false);
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{"🙏"}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.acc, margin: "0 0 8px" }}>{T("lostSightingThanks")}</h2>
          <p style={{ fontSize: 14, color: C.t2, margin: "0 0 24px", lineHeight: 1.6 }}>{T("lostSightingThanksSub")}</p>
          <button onClick={() => nav("home")} style={{ padding: "14px 32px", fontSize: 14, fontWeight: 700, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
            {T("back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t1, fontSize: 24, cursor: "pointer", padding: 0 }}>{"\u2190"}</button>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: C.t1 }}>{T("lostReportSighting")}</h1>
      </div>

      {/* Dog info */}
      {report && (
        <div style={{ margin: "16px 20px 0", padding: "14px 18px", background: "rgba(239,68,68,0.06)", borderRadius: C.r, border: "1px solid rgba(239,68,68,0.15)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: C.s1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {report.dog_photo ? (
              <PhotoImg src={report.dog_photo} style={{ width: 48, height: 48, objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 24 }}>{"\uD83D\uDC15"}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{report.dog_name}</div>
            <div style={{ fontSize: 12, color: C.t3 }}>{report.dog_breed}</div>
          </div>
        </div>
      )}

      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* GPS */}
        <div>
          <label style={lbl}>{T("lostYourLocation")}</label>
          <div style={{ padding: "12px 16px", background: C.s1, borderRadius: 12, border: `1px solid ${C.b1}`, fontSize: 13, color: gpsStatus === "ok" ? C.acc : C.danger }}>
            {gpsStatus === "loading" && T("lostGpsLoading")}
            {gpsStatus === "ok" && `${T("lostGpsLocked")} (${lat?.toFixed(4)}, ${lng?.toFixed(4)})`}
            {gpsStatus === "error" && T("lostGpsError")}
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={lbl}>{T("lostYourName")}</label>
          <input value={reporterName} onChange={e => setReporterName(e.target.value)} placeholder={T("lostNamePlaceholder")} style={input} />
        </div>

        {/* Notes */}
        <div>
          <label style={lbl}>{T("lostSightingNotes")}</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={T("lostSightingNotesPlaceholder")} rows={3} style={{ ...input, resize: "vertical", minHeight: 72, fontFamily: "inherit" }} />
        </div>

        {/* Photo upload */}
        <div>
          <label style={lbl}>{T("lostSightingPhoto")}</label>
          <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          {photo ? (
            <div style={{ position: "relative", width: 80, height: 80, borderRadius: 12, overflow: "hidden" }}>
              <PhotoImg src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setPhoto(null)} style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{"×"}</button>
            </div>
          ) : (
            <button onClick={() => photoRef.current?.click()} style={{ padding: "12px 20px", background: C.s1, border: `1px dashed ${C.t3}`, borderRadius: 12, color: C.t3, fontSize: 13, cursor: "pointer" }}>
              {"📷"} {T("lostAddPhoto")}
            </button>
          )}
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={sending || gpsStatus !== "ok"}
          style={{
            width: "100%", padding: 16, fontSize: 16, fontWeight: 800,
            background: gpsStatus === "ok" ? C.danger : "rgba(239,68,68,0.3)",
            color: "#fff", border: "none", borderRadius: 50, cursor: gpsStatus === "ok" ? "pointer" : "default",
            marginTop: 8, opacity: sending ? 0.7 : 1,
          }}>
          {sending ? T("lostSending") : T("lostSubmitSighting")}
        </button>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 };
const input = { width: "100%", padding: "12px 16px", fontSize: 15, background: "#131316", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, color: "#F5F5F7", outline: "none", boxSizing: "border-box" };
