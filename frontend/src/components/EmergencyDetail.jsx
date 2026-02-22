import { useApp } from "../context/AppContext.jsx";
import { COMMON_TOXINS, ISRAEL_SNAKES } from "../data/emergencyGuide.js";
import { ArrowLeft, ArrowRight, Phone, AlertTriangle, Hospital } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", rL: 24, r: 16 };
const SEV_COLORS = { critical: "#EF4444", moderate: "#F59E0B", low: "#22C55E" };

export default function EmergencyDetail() {
  const { selEmergency, nav, T, lang, rtl } = useApp();
  if (!selEmergency) return null;

  const em = selEmergency;
  const sevColor = SEV_COLORS[em.severity];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("emergency")} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("emergencyGuide")}
        </button>
      </div>

      {/* Emoji + Title + Severity */}
      <div style={{ textAlign: "center", padding: "0 20px 20px" }}>
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><Icon name={em.icon || "AlertTriangle"} size={48} color={sevColor} /></div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, margin: 0, color: C.t1 }}>{em.name[lang]}</h2>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          marginTop: 10, padding: "6px 14px", borderRadius: 8,
          background: `rgba(${em.severity === "critical" ? "239,68,68" : em.severity === "moderate" ? "245,158,11" : "34,197,94"},0.1)`,
          fontSize: 12, fontWeight: 700, color: sevColor,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: sevColor }} />
          {T(em.severity === "critical" ? "severityCritical" : em.severity === "moderate" ? "severityModerate" : "severityLow")}
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "0 20px" }}>
        <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.7, margin: "0 0 16px" }}>{em.description[lang]}</p>
      </div>

      {/* Call Vet Button */}
      <div style={{ padding: "0 20px 16px" }}>
        <button
          onClick={() => nav("vetDirectory")}
          style={{
            width: "100%", padding: "14px", borderRadius: C.rL, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "#fff",
            fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: "0 4px 20px rgba(239,68,68,0.3)",
          }}
        >
          <Phone size={18} /> {T("callVetNow")}
        </button>
      </div>

      {/* Steps */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{T("emergencySteps")}</div>
          {em.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < em.steps.length - 1 ? 16 : 0, alignItems: "flex-start" }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: `linear-gradient(135deg, ${sevColor}, ${sevColor}CC)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0, marginTop: 1,
              }}>{i + 1}</div>
              <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>{step[lang]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Box */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          padding: "16px 18px", borderRadius: C.rL,
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={16} color="#EF4444" />
            <span style={{ fontSize: 12, fontWeight: 800, color: "#EF4444", textTransform: "uppercase", letterSpacing: 1.5 }}>{T("emergencyWarning")}</span>
          </div>
          <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.6, margin: 0 }}>{em.warning[lang]}</p>
        </div>
      </div>

      {/* Extra Info */}
      {em.extraInfo && (
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ padding: "16px 18px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("emergencyExtraInfo")}</div>
            <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.6, margin: 0 }}>{em.extraInfo[lang]}</p>
          </div>
        </div>
      )}

      {/* Conditional: Common Toxins for poisoning */}
      {em.id === "poisoning" && (
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{T("commonToxins")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {COMMON_TOXINS.map((tox, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{tox.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{tox.name[lang]}</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 2, lineHeight: 1.5 }}>{tox.note[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conditional: Israel Snakes for snake_bite */}
      {em.id === "snake_bite" && (
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{T("israelSnakes")}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ISRAEL_SNAKES.map((snake, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{snake.emoji}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{snake.name[lang]}</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 2, lineHeight: 1.5 }}>{snake.description[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Vet Directory Button */}
      <div style={{ padding: "0 20px" }}>
        <button
          onClick={() => nav("vetDirectory")}
          style={{
            width: "100%", padding: "14px", borderRadius: C.r, cursor: "pointer",
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
            color: C.t1, fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Hospital size={16} /> {T("emergencyVetDirectory")}
        </button>
      </div>
    </div>
  );
}
