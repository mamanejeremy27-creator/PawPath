import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DOG_FOODS, FOOD_CATEGORIES, CATEGORY_CONFIG } from "../data/dogNutrition.js";
import { Search } from "lucide-react";
import { cn } from "../lib/cn";

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
    <div className="min-h-screen pb-10 bg-bg animate-[fadeIn_0.3s_ease] overflow-x-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-none text-training text-sm font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
        >
          <span className="text-base">{rtl ? "\u2192" : "\u2190"}</span> {T("home")}
        </button>
        <h2 className="font-display text-[28px] font-black m-0 text-text">{T("nutritionTitle")}</h2>
        <p className="text-sm text-muted mt-1">{T("nutritionSubtitle")}</p>
      </div>

      {/* Search Bar */}
      <div className="px-5 pb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={T("nutritionSearch")}
            className="w-full bg-surface border border-border rounded-3xl text-text text-[15px] outline-none"
            style={{
              padding: query ? "14px 18px" : (rtl ? "14px 44px 14px 18px" : "14px 18px 14px 44px"),
              fontFamily: "'DM Sans', sans-serif",
              textAlign: rtl ? "right" : "left",
              direction: rtl ? "rtl" : "ltr",
            }}
          />
          {!query && (
            <span className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <Search size={18} className="text-muted" />
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-2 px-5 pb-4 flex-wrap">
        {FOOD_CATEGORIES.map(cat => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <div
              key={cat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[20px]"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
              <span className="text-xs font-bold" style={{ color: cfg.color }}>{T(CAT_KEYS[cat])}</span>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filtered.length === 0 && (
        <div className="text-center py-10 px-5">
          <div className="mb-3 flex justify-center"><Search size={40} className="text-muted" /></div>
          <div className="text-[15px] font-bold text-text">{T("nutritionNoResults")}</div>
          <div className="text-[13px] text-muted mt-1">{T("nutritionTryAnother")}</div>
        </div>
      )}

      {/* Food Lists by Category */}
      {FOOD_CATEGORIES.map(cat => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const cfg = CATEGORY_CONFIG[cat];
        return (
          <div key={cat} className="px-5 pb-4">
            <div className="text-[11px] font-bold tracking-[2px] uppercase mb-2.5 flex items-center gap-2" style={{ color: cfg.color }}>
              <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
              {T(CAT_KEYS[cat])} ({items.length})
            </div>
            <div className="flex flex-col gap-1.5">
              {items.map(food => {
                const isOpen = expanded === food.id;
                return (
                  <button
                    key={food.id}
                    onClick={() => setExpanded(isOpen ? null : food.id)}
                    className="w-full text-start cursor-pointer px-[18px] py-3.5 bg-surface rounded-3xl text-text font-sans text-base transition-[border-color] duration-200 ease-out"
                    style={{
                      border: isOpen ? `1px solid ${cfg.border}` : `1px solid rgba(255,255,255,0.06)`,
                    }}
                  >
                    {/* Food Header */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">{food.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-bold">{food.name[lang]}</div>
                        {!isOpen && (
                          <div className="text-xs text-muted mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                            {food.reason[lang]}
                          </div>
                        )}
                      </div>
                      <span
                        className="text-muted text-sm shrink-0 transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
                      >{"\u203A"}</span>
                    </div>

                    {/* Expanded Detail */}
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-[13px] text-text-2 leading-relaxed m-0 mb-2.5">{food.reason[lang]}</p>
                        <div
                          className="px-3.5 py-2.5 rounded-xl"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                        >
                          <div
                            className="text-[11px] font-bold tracking-[1.5px] uppercase mb-1"
                            style={{ color: cfg.color }}
                          >
                            {T("nutritionServingTip")}
                          </div>
                          <div className="text-[13px] text-text-2 leading-normal">{food.tip[lang]}</div>
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
