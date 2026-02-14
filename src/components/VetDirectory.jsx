import { useApp } from "../context/AppContext.jsx";
import { VET_DIRECTORY, POISON_CONTROL } from "../data/emergencyGuide.js";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", rL: 24, r: 16 };

export default function VetDirectory() {
  const { nav, T, lang, rtl } = useApp();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("emergency")} style={{ background: "none", border: "none", color: "#EF4444", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>{rtl ? "\u2192" : "\u2190"}</span> {T("emergencyGuide")}
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("vetDirectory")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{T("tapToCall")}</p>
      </div>

      {/* Poison Control */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          padding: "18px 20px", borderRadius: C.rL,
          background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{T("poisonControl")}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Poison Info Center */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{POISON_CONTROL.name[lang]}</div>
              </div>
              <a
                href={`tel:${POISON_CONTROL.phone}`}
                style={{
                  padding: "8px 16px", borderRadius: 20, textDecoration: "none",
                  background: "rgba(239,68,68,0.15)", color: "#EF4444",
                  fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 6,
                }}
              >
                📞 {POISON_CONTROL.phone}
              </a>
            </div>

            {/* MDA Emergency */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{POISON_CONTROL.emergency[lang]}</div>
              </div>
              <a
                href={`tel:${POISON_CONTROL.emergencyPhone}`}
                style={{
                  padding: "8px 16px", borderRadius: 20, textDecoration: "none",
                  background: "rgba(239,68,68,0.15)", color: "#EF4444",
                  fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", gap: 6,
                }}
              >
                🚑 {POISON_CONTROL.emergencyPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Listings */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{T("byRegion")}</div>

        {VET_DIRECTORY.map((region, ri) => (
          <div key={ri} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.t1, marginBottom: 8 }}>{region.region[lang]}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {region.vets.map((vet, vi) => (
                <div key={vi} style={{
                  padding: "14px 18px", background: C.s1, borderRadius: C.rL,
                  border: `1px solid ${C.b1}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{vet.name[lang]}</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{vet.hours[lang]}</div>
                  </div>
                  <a
                    href={`tel:${vet.phone}`}
                    style={{
                      padding: "8px 16px", borderRadius: 20, textDecoration: "none",
                      background: "rgba(239,68,68,0.1)", color: "#EF4444",
                      fontSize: 13, fontWeight: 800, flexShrink: 0,
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    📞 {vet.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
