import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DOG_FOODS, FOOD_CATEGORIES, CATEGORY_CONFIG } from "../data/dogNutrition.js";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24, r: 16 };

const CAT_KEYS = { safe: "nutritionSafe", caution: "nutritionCaution", dangerous: "nutritionDangerous" };

export default function NutritionGuide() {
  const { nav, T, lang, rtl } = useApp();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOG_FOODS;
    return DOG_FOODS.filter(f =>
      f.name.en.toLowerCase().includes(q) ||
      f.name.he.includes(q) ||
      f.id.includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = {};
    FOOD_CATEGORIES.forEach(cat => { map[cat] = []; });
    filtered.forEach(f => { if (map[f.category]) map[f.category].push(f); });
    return map;
  }, [filtered]);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40, background: C.bg, animation: "fadeIn 0.3s ease", overflowX: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>{rtl ? "\u2192" : "\u2190"}</span> {T("home")}
        </button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, margin: 0, color: C.t1 }}>{T("nutritionTitle")}</h2>
        <p style={{ fontSize: 14, color: C.t3, marginTop: 4 }}>{T("nutritionSubtitle")}</p>
      </div>

      {/* Search Bar */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={T("nutritionSearch")}
            style={{
              width: "100%", padding: "14px 18px 14px 44px", boxSizing: "border-box",
              background: C.s1, border: `1px solid ${C.b1}`, borderRadius: C.rL,
              color: C.t1, fontSize: 15, outline: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <span style={{ position: "absolute", [rtl ? "right" : "left"]: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none" }}>
            {"\uD83D\uDD0D"}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 16px", flexWrap: "wrap" }}>
        {FOOD_CATEGORIES.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{T(CAT_KEYS[cat])}</span>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{"\uD83D\uDD0D"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{T("nutritionNoResults")}</div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>{T("nutritionTryAnother")}</div>
        </div>
      )}

      {/* Food Lists by Category */}
      {FOOD_CATEGORIES.map(cat => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const cfg = CATEGORY_CONFIG[cat];
        return (
          <div key={cat} style={{ padding: "0 20px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />
              {T(CAT_KEYS[cat])} ({items.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map(food => {
                const isOpen = expanded === food.id;
                return (
                  <button
                    key={food.id}
                    onClick={() => setExpanded(isOpen ? null : food.id)}
                    style={{
                      width: "100%", textAlign: "start", cursor: "pointer",
                      padding: "14px 18px", boxSizing: "border-box",
                      background: C.s1, borderRadius: C.rL,
                      border: isOpen ? `1px solid ${cfg.border}` : `1px solid ${C.b1}`,
                      color: C.t1, fontFamily: "inherit", fontSize: "inherit",
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    {/* Food Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{food.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{food.name[lang]}</div>
                        {!isOpen && (
                          <div style={{ fontSize: 12, color: C.t3, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {food.reason[lang]}
                          </div>
                        )}
                      </div>
                      <span style={{ color: C.t3, fontSize: 14, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>{"\u203A"}</span>
                    </div>

                    {/* Expanded Detail */}
                    {isOpen && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.b1}` }}>
                        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.6, margin: "0 0 10px" }}>{food.reason[lang]}</p>
                        <div style={{ padding: "10px 14px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{T("nutritionServingTip")}</div>
                          <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.5 }}>{food.tip[lang]}</div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
