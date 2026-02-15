import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getReport, getSightings, markAsFound, cancelReport, getShareUrl, getShareText } from "../lib/lostDog.js";
import { haversine } from "../lib/walkTracker.js";
import PhotoImg from "./PhotoImg.jsx";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };

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
      const [rRes, sRes] = await Promise.all([getReport(reportId), getSightings(reportId)]);
      if (rRes.data) setReport(rRes.data);
      if (sRes.data) setSightings(sRes.data);
      setLoading(false);
    };
    load();
    // Auto-refresh every 30s
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [reportId]);

  const handleMarkFound = async () => {
    await markAsFound(reportId);
    setCelebrated(true);
    setReport(prev => prev ? { ...prev, status: "found" } : prev);
  };

  const handleCancel = async () => {
    await cancelReport(reportId);
    setReport(prev => prev ? { ...prev, status: "cancelled" } : prev);
    setConfirmCancel(false);
  };

  const handleShare = () => {
    if (!report) return;
    const text = getShareText(report, lang);
    if (navigator.share) navigator.share({ title: T("lostDogAlert"), text, url: getShareUrl(report.share_token) }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.danger, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: C.t3 }}>{T("lostReportNotFound")}</p>
          <button onClick={() => nav("home")} style={{ marginTop: 16, padding: "12px 24px", background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>{T("back")}</button>
        </div>
      </div>
    );
  }

  // ── Celebration overlay ──
  if (celebrated) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}>
          <div style={{ fontSize: 80, marginBottom: 16, animation: "fadeIn 0.8s ease" }}>{"🎉"}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.acc, margin: "0 0 8px" }}>{report.dog_name} {T("lostFoundTitle")}</h1>
          <p style={{ fontSize: 15, color: C.t2, margin: "0 0 32px", lineHeight: 1.6 }}>{T("lostFoundSub")}</p>
          <button onClick={() => nav("home")} style={{ padding: "14px 32px", fontSize: 15, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>
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

  // SVG Map — plot last known + sightings
  const allPoints = [
    { lat: report.last_lat, lng: report.last_lng, label: T("lostLastKnown"), type: "origin" },
    ...sightings.map((s, i) => ({ lat: s.lat, lng: s.lng, label: `#${i + 1}`, type: "sighting", time: s.created_at })),
  ];

  const svgW = 340, svgH = 200, pad = 30;
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  for (const p of allPoints) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }
  // Add padding to bounds
  const latSpan = Math.max(maxLat - minLat, 0.002);
  const lngSpan = Math.max(maxLng - minLng, 0.002);
  minLat -= latSpan * 0.15; maxLat += latSpan * 0.15;
  minLng -= lngSpan * 0.15; maxLng += lngSpan * 0.15;

  const toX = (lng) => pad + ((lng - minLng) / (maxLng - minLng)) * (svgW - 2 * pad);
  const toY = (lat) => pad + ((maxLat - lat) / (maxLat - minLat)) * (svgH - 2 * pad);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.t1, fontSize: 24, cursor: "pointer", padding: 0 }}>{"\u2190"}</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: isActive ? C.danger : C.acc }}>
            {isActive ? `🚨 ${T("lostTracking")} ${report.dog_name}` : `✅ ${report.dog_name} ${T("lostFoundTitle")}`}
          </h1>
          <p style={{ fontSize: 12, color: C.t3, margin: "2px 0 0" }}>{T("lostReported")} {timeSince(report.created_at)} {T("lostAgo")}</p>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700,
          background: isActive ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
          color: isActive ? C.danger : C.acc,
          border: `1px solid ${isActive ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
        }}>
          {isActive ? T("lostStatusActive") : report.status === "found" ? T("lostStatusFound") : T("lostStatusCancelled")}
        </div>
        <span style={{ marginInlineStart: 8, fontSize: 13, color: C.t3 }}>{sightings.length} {T("lostSightingsCount")}</span>
      </div>

      {/* SVG Map */}
      {allPoints.length > 0 && (
        <div style={{ margin: "16px 20px 0", padding: 16, background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>{T("lostSightingMap")}</div>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto" }}>
            {/* Grid */}
            {[0.25, 0.5, 0.75].map(f => (
              <line key={`h${f}`} x1={pad} y1={pad + f * (svgH - 2 * pad)} x2={svgW - pad} y2={pad + f * (svgH - 2 * pad)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* Search radius circle around origin */}
            {(() => {
              const originX = toX(report.last_lng);
              const originY = toY(report.last_lat);
              // Approximate radius in pixels
              const km = report.search_radius_km || 10;
              const degPerKm = 1 / 111; // rough approximation
              const rPx = (km * degPerKm / (maxLng - minLng)) * (svgW - 2 * pad);
              return <circle cx={originX} cy={originY} r={Math.min(rPx, 120)} fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.15)" strokeWidth="1" strokeDasharray="4 4" />;
            })()}

            {/* Movement trail */}
            {sightings.length > 0 && (
              <polyline
                points={allPoints.map(p => `${toX(p.lng)},${toY(p.lat)}`).join(" ")}
                fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="2" strokeDasharray="6 4"
              />
            )}

            {/* Sighting dots */}
            {allPoints.map((p, i) => {
              const x = toX(p.lng);
              const y = toY(p.lat);
              if (p.type === "origin") {
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={10} fill="rgba(239,68,68,0.2)" stroke={C.danger} strokeWidth="2" />
                    <circle cx={x} cy={y} r={4} fill={C.danger} />
                    <text x={x} y={y - 14} textAnchor="middle" fill={C.danger} fontSize="9" fontWeight="700">{p.label}</text>
                  </g>
                );
              }
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={7} fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="1.5" />
                  <text x={x} y={y + 3.5} textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="700">{p.label}</text>
                </g>
              );
            })}
          </svg>

          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 10, color: C.t3 }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.danger, marginInlineEnd: 4, verticalAlign: "middle" }} />{T("lostLastKnown")}</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", marginInlineEnd: 4, verticalAlign: "middle" }} />{T("lostSightings")}</span>
          </div>
        </div>
      )}

      {/* Sightings list */}
      <div style={{ padding: "16px 20px 0" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.t1, margin: "0 0 10px" }}>{T("lostSightings")} ({sightings.length})</h3>
        {sightings.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: C.t3, fontSize: 13 }}>{T("lostNoSightings")}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sightings.map((s, i) => {
              const dist = haversine(report.last_lat, report.last_lng, s.lat, s.lng);
              return (
                <div key={s.id} style={{ padding: "14px 16px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#F59E0B", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>
                        {s.reporter_name || "Anonymous"} · <span style={{ color: C.t3 }}>{timeSince(s.created_at)} {T("lostAgo")}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
                        {dist.toFixed(1)} km {T("lostFromLastKnown")}
                      </div>
                    </div>
                  </div>
                  {s.notes && <div style={{ fontSize: 13, color: C.t2, marginTop: 8, lineHeight: 1.5 }}>{s.notes}</div>}
                  {s.photo && (
                    <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden" }}>
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
        <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={handleShare} style={{ width: "100%", padding: 14, fontSize: 14, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer" }}>
            {T("lostShareAlert")}
          </button>
          <button onClick={() => setShowFound(true)} style={{ width: "100%", padding: 14, fontSize: 14, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>
            {"🎉"} {T("lostMarkFound")}
          </button>
          <button onClick={() => setConfirmCancel(true)} style={{ width: "100%", padding: 12, fontSize: 13, fontWeight: 600, background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
            {T("lostCancelReport")}
          </button>
        </div>
      )}

      {/* Mark as Found confirm */}
      {showFound && (
        <div onClick={() => setShowFound(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.s1, borderRadius: 24, padding: "28px 24px", maxWidth: 320, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"🎉"}</div>
            <p style={{ fontSize: 15, color: C.t1, margin: "0 0 20px" }}>{T("lostFoundConfirm").replace("{name}", report.dog_name)}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowFound(false)} style={{ flex: 1, padding: 12, fontSize: 14, fontWeight: 600, background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>{T("back")}</button>
              <button onClick={handleMarkFound} style={{ flex: 1, padding: 12, fontSize: 14, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>{T("lostMarkFound")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm */}
      {confirmCancel && (
        <div onClick={() => setConfirmCancel(false)} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.s1, borderRadius: 24, padding: "28px 24px", maxWidth: 320, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{"\u26A0\uFE0F"}</div>
            <p style={{ fontSize: 15, color: C.t1, margin: "0 0 20px" }}>{T("lostCancelConfirm")}</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmCancel(false)} style={{ flex: 1, padding: 12, fontSize: 14, fontWeight: 600, background: "transparent", color: C.t3, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>{T("back")}</button>
              <button onClick={handleCancel} style={{ flex: 1, padding: 12, fontSize: 14, fontWeight: 700, background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer" }}>{T("lostCancelReport")}</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
