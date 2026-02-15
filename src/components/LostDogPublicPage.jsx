import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { getReportByToken } from "../lib/lostDog.js";
import PhotoImg from "./PhotoImg.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", danger: "#EF4444", r: 16, rL: 24 };

export default function LostDogPublicPage({ shareTokenFromUrl }) {
  const { nav, T, screenParams } = useApp();
  const shareToken = shareTokenFromUrl || screenParams?.shareToken;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shareToken) { setError(true); setLoading(false); return; }
    getReportByToken(shareToken).then(res => {
      if (res.data) setReport(res.data);
      else setError(true);
      setLoading(false);
    });
  }, [shareToken]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.danger, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\uD83D\uDC15"}</div>
          <p style={{ color: C.t3, fontSize: 15 }}>{T("lostReportNotFound")}</p>
          <button onClick={() => nav("home")} style={{ marginTop: 16, padding: "12px 24px", background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>{T("home")}</button>
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
    <div style={{ minHeight: "100vh", background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Urgent banner */}
      <div style={{
        padding: "16px 20px", textAlign: "center",
        background: isActive ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
        borderBottom: `1px solid ${isActive ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: isActive ? C.danger : C.acc }}>
          {"🚨"} {isActive ? T("lostDogAlert") : `${report.dog_name} ${T("lostFoundTitle")}`}
        </div>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: 480, margin: "0 auto" }}>
        {/* Dog photo */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 120, height: 120, borderRadius: 24, overflow: "hidden", margin: "0 auto",
            background: C.s1, display: "flex", alignItems: "center", justifyContent: "center",
            border: `3px solid ${isActive ? C.danger : C.acc}`,
          }}>
            {report.dog_photo ? (
              <PhotoImg src={report.dog_photo} style={{ width: 120, height: 120, objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 56 }}>{"\uD83D\uDC15"}</span>
            )}
          </div>
        </div>

        {/* Dog info */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.t1, margin: "0 0 4px" }}>{report.dog_name}</h1>
          {report.dog_breed && <div style={{ fontSize: 15, color: C.t3 }}>{report.dog_breed}</div>}
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {report.description && (
            <div style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{T("lostDescription")}</div>
              <div style={{ fontSize: 14, color: C.t1, lineHeight: 1.6 }}>{report.description}</div>
            </div>
          )}

          <div style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{T("lostLastSeenArea")}</div>
            <div style={{ fontSize: 14, color: C.t1 }}>
              {report.last_location_name || `${report.last_lat?.toFixed(4)}, ${report.last_lng?.toFixed(4)}`}
            </div>
            <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>{timeSince()} {T("lostAgo")}</div>
          </div>

          {report.contact_phone && isActive && (
            <div style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{T("lostContact")}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>
                {report.contact_name && <span>{report.contact_name} · </span>}
                <a href={`tel:${report.contact_phone}`} style={{ color: C.acc, textDecoration: "none" }}>{report.contact_phone}</a>
              </div>
            </div>
          )}
        </div>

        {/* CTA button */}
        {isActive && (
          <div style={{ marginTop: 24 }}>
            <button onClick={() => nav("reportSighting", { reportId: report.id })}
              style={{
                width: "100%", padding: 18, fontSize: 18, fontWeight: 800,
                background: C.danger, color: "#fff", border: "none", borderRadius: 50, cursor: "pointer",
                boxShadow: "0 4px 24px rgba(239,68,68,0.4)",
              }}>
              {"👁️"} {T("lostISawThisDog")}
            </button>

            <button onClick={() => {
              const text = `🚨 ${T("lostDogAlert")}: ${report.dog_name}`;
              if (navigator.share) navigator.share({ title: T("lostDogAlert"), text, url: window.location.href }).catch(() => {});
            }}
              style={{ width: "100%", marginTop: 10, padding: 14, fontSize: 14, fontWeight: 600, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
              {T("lostShare")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
