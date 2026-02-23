import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import { compressPhoto } from "../utils/photoCompressor.js";
import PhotoImg from "./PhotoImg.jsx";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, Heart, Dog, Camera } from "lucide-react";
import { cn } from "../lib/cn";

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
      <div className="min-h-screen bg-bg flex items-center justify-center p-5">
        <div className="text-center animate-[fadeIn_0.3s_ease]">
          <div className="mb-4 flex justify-center"><Heart size={64} className="text-training" /></div>
          <h2 className="text-[22px] font-extrabold text-training m-0 mb-2">{T("lostSightingThanks")}</h2>
          <p className="text-sm text-text-2 m-0 mb-6 leading-relaxed">{T("lostSightingThanksSub")}</p>
          <button
            onClick={() => nav("home")}
            className="px-8 py-[14px] text-sm font-bold bg-surface text-text border border-border rounded-full cursor-pointer"
          >
            {T("back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3">
        <button onClick={() => nav("home")} className="bg-transparent border-none text-text cursor-pointer p-0 flex items-center"><ArrowLeft size={24} /></button>
        <h1 className="text-[20px] font-extrabold m-0 text-text">{T("lostReportSighting")}</h1>
      </div>

      {/* Dog info */}
      {report && (
        <div className="mx-5 mt-4 px-[18px] py-[14px] bg-danger/[0.06] rounded-2xl border border-danger/15 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface flex items-center justify-center">
            {report.dog_photo ? (
              <PhotoImg src={report.dog_photo} style={{ width: 48, height: 48, objectFit: "cover" }} />
            ) : (
              <Dog size={24} className="text-muted" />
            )}
          </div>
          <div>
            <div className="text-[15px] font-bold text-text">{report.dog_name}</div>
            <div className="text-xs text-muted">{report.dog_breed}</div>
          </div>
        </div>
      )}

      <div className="px-5 pt-4 flex flex-col gap-[14px]">
        {/* GPS */}
        <div>
          <label className={lbl}>{T("lostYourLocation")}</label>
          <div className={cn(
            "px-4 py-3 bg-surface rounded-xl border border-border text-[13px]",
            gpsStatus === "ok" ? "text-training" : "text-danger"
          )}>
            {gpsStatus === "loading" && T("lostGpsLoading")}
            {gpsStatus === "ok" && `${T("lostGpsLocked")} (${lat?.toFixed(4)}, ${lng?.toFixed(4)})`}
            {gpsStatus === "error" && T("lostGpsError")}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className={lbl}>{T("lostYourName")}</label>
          <input value={reporterName} onChange={e => setReporterName(e.target.value)} placeholder={T("lostNamePlaceholder")} className={inputCls} />
        </div>

        {/* Notes */}
        <div>
          <label className={lbl}>{T("lostSightingNotes")}</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={T("lostSightingNotesPlaceholder")} rows={3} className={cn(inputCls, "resize-y min-h-[72px] font-[inherit]")} />
        </div>

        {/* Photo upload */}
        <div>
          <label className={lbl}>{T("lostSightingPhoto")}</label>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          {photo ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden">
              <PhotoImg src={photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-0.5 end-0.5 w-[22px] h-[22px] rounded-full bg-black/70 border-none text-white text-xs cursor-pointer flex items-center justify-center"
              >{"×"}</button>
            </div>
          ) : (
            <button
              onClick={() => photoRef.current?.click()}
              className="px-5 py-3 bg-surface border border-dashed border-muted rounded-xl text-muted text-[13px] cursor-pointer flex items-center gap-1"
            >
              <Camera size={14} /> {T("lostAddPhoto")}
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={sending || gpsStatus !== "ok"}
          className={cn(
            "w-full py-4 text-base font-extrabold text-white border-none rounded-full mt-2",
            gpsStatus === "ok" ? "bg-danger cursor-pointer" : "bg-danger/30 cursor-default",
            sending && "opacity-70"
          )}
        >
          {sending ? T("lostSending") : T("lostSubmitSighting")}
        </button>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

const lbl = "block text-xs font-bold text-text-2 uppercase tracking-widest mb-1.5";
const inputCls = "w-full px-4 py-3 text-[15px] bg-surface-2 border border-border-2 rounded-2xl text-text outline-none focus:border-danger/50 transition-colors box-border";
