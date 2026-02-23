import { useApp } from "../context/AppContext.jsx";
import { EMERGENCY_GUIDES, SEVERITY_ORDER } from "../data/emergencyGuide.js";
import { ArrowLeft, ArrowRight, Phone, Hospital, ChevronRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", rL: 24, r: 16 };

const SEV_COLORS = { critical: "#EF4444", moderate: "#F59E0B", low: "#22C55E" };
const SEV_KEYS = { critical: "severityCritical", moderate: "severityModerate", low: "severityLow" };

export default function EmergencyGuide() {
  const { nav, T, lang, rtl } = useApp();

  const grouped = {};
  for (const s of SEVERITY_ORDER) grouped[s] = [];
  EMERGENCY_GUIDES.forEach(em => grouped[em.severity]?.push(em));

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("emergencyGuide")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{T("emergencySubtitle")}</p>
      </div>

      {/* Call Vet Button */}
      <div style={{ padding: "0 20px 8px" }}>
        <button
          onClick={() => nav("vetDirectory")}
          style={{
            width: "100%", padding: "16px", borderRadius: C.rL, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #EF4444, #DC2626)", color: "#fff",
            fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: "0 4px 20px rgba(239,68,68,0.3)",
          }}
        >
          <Phone size={20} /> {T("callVetNow")}
        </button>
      </div>

      {/* Vet Directory Link */}
      <div style={{ padding: "0 20px 4px" }}>
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

      {/* Severity-Grouped List */}
      <div style={{ padding: "12px 20px 0" }}>
        {SEVERITY_ORDER.map(sev => {
          const items = grouped[sev];
          if (!items || items.length === 0) return null;
          const sevColor = SEV_COLORS[sev];
          return (
            <div key={sev} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: sevColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{T(SEV_KEYS[sev])}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((em, idx) => (
                  <button
                    key={em.id}
                    onClick={() => nav("emergencyDetail", { emergency: em })}
                    style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
                      background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`,
                      cursor: "pointer", color: C.t1, textAlign: "start", width: "100%",
                      animation: `fadeIn 0.3s ease ${idx * 0.04}s both`,
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: `rgba(${sev === "critical" ? "239,68,68" : sev === "moderate" ? "245,158,11" : "34,197,94"},0.1)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                    }}>
                      <Icon name={em.icon || "AlertTriangle"} size={24} color={sevColor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{em.name[lang]}</span>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: sevColor, flexShrink: 0 }} />
                      </div>
                      <div style={{
                        fontSize: 12, color: C.t3, marginTop: 4,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {em.description[lang]}
                      </div>
                    </div>
                    <ChevronRight size={16} color={C.t3} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
