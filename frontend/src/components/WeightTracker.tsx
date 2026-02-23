import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import { ArrowLeft, Scale, X } from "lucide-react";

function getBreedWeightRange(size) {
  switch (size) {
    case "small": return { min: 3, max: 10 };
    case "medium": return { min: 10, max: 25 };
    case "large": return { min: 25, max: 45 };
    case "giant": return { min: 35, max: 70 };
    default: return null;
  }
}
import { matchBreed } from "../data/breedTraits.js";
import BottomNav from "./BottomNav.jsx";
import { cn } from "../lib/cn";

const LS_KEY = "pawpath_weight_logs";

export default function WeightTracker() {
  const { nav, T, lang, isAuthenticated, activeDogId, dogProfile, getDogBackendId } = useApp();
  const [weights, setWeights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ weight_kg: "", date: new Date().toISOString().split("T")[0], notes: "" });
  const [saving, setSaving] = useState(false);

  const breedData = matchBreed(dogProfile?.breed);
  const weightRange = breedData ? getBreedWeightRange(breedData.size) : null;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let data = [];
      if (isAuthenticated) {
        try { data = await api.getWeightRecords(getDogBackendId(activeDogId) || activeDogId) || []; } catch {}
      }
      try {
        const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(data.map(x => x.id));
        for (const x of local) if (!ids.has(x.id)) data.push(x);
      } catch { /* silent */ }
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (!cancelled) { setWeights(data); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const handleAdd = async () => {
    const kg = parseFloat(form.weight_kg);
    if (!kg || kg <= 0) return;
    setSaving(true);

    const entry = { weight: kg, date: form.date, notes: form.notes };
    let saved = null;

    if (isAuthenticated) {
      try { saved = await api.addWeightRecord(getDogBackendId(activeDogId) || activeDogId, entry); } catch {}
    }

    if (!saved) {
      saved = { id: `local_${Date.now()}`, ...entry, dogId: activeDogId, created_at: new Date().toISOString() };
      try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        all.push(saved);
        localStorage.setItem(LS_KEY, JSON.stringify(all));
      } catch { /* silent */ }
    }

    setWeights(prev => [saved, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setForm({ weight_kg: "", date: new Date().toISOString().split("T")[0], notes: "" });
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (isAuthenticated && !String(id).startsWith("local_")) {
      try { await api.deleteWeightRecord(id); } catch {}
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      localStorage.setItem(LS_KEY, JSON.stringify(all.filter(x => x.id !== id)));
    } catch { /* silent */ }
    setWeights(prev => prev.filter(w => w.id !== id));
  };

  // SVG Chart
  const chartW = 340, chartH = 200, pad = 40;
  const sorted = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const vals = sorted.map(w => w.weight || w.weight_kg);
  const minV = vals.length ? Math.min(...vals) - 1 : 0;
  const maxV = vals.length ? Math.max(...vals) + 1 : 10;
  const rangeV = maxV - minV || 1;

  const points = sorted.map((w, i) => {
    const wt = w.weight || w.weight_kg;
    return {
      x: pad + (sorted.length > 1 ? (i / (sorted.length - 1)) * (chartW - pad * 2) : (chartW - pad * 2) / 2),
      y: pad + (1 - (wt - minV) / rangeV) * (chartH - pad * 2),
      label: wt,
      date: w.date,
    };
  });

  const pathD = points.length >= 2
    ? `M ${points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ")}`
    : "";

  const formatDate = (d) => new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" });

  // Y-axis labels
  const yLabels = [];
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = minV + (rangeV * i / steps);
    yLabels.push({ value: v.toFixed(1), y: pad + (1 - i / steps) * (chartH - pad * 2) });
  }

  // Healthy range band
  let rangeBandY1 = null, rangeBandY2 = null;
  if (weightRange && vals.length > 0) {
    const clampMin = Math.max(weightRange.min, minV);
    const clampMax = Math.min(weightRange.max, maxV);
    rangeBandY1 = pad + (1 - (clampMax - minV) / rangeV) * (chartH - pad * 2);
    rangeBandY2 = pad + (1 - (clampMin - minV) / rangeV) * (chartH - pad * 2);
  }

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3">
        <button
          onClick={() => nav("healthDashboard")}
          className="bg-transparent border-none cursor-pointer text-muted p-1 flex items-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-black m-0 mb-0.5 text-text">{T("healthWeight")}</h1>
          <p className="text-[13px] text-muted m-0">{weights.length} {T("healthRecords")}</p>
        </div>
      </div>

      {/* Add Form */}
      <div className="px-5 pt-4">
        <div className="px-[18px] py-4 bg-surface rounded-3xl border border-border">
          <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-3">{T("healthAddWeight")}</div>
          <div className="flex gap-2 mb-2.5">
            <input
              type="number" step="0.1" min="0" placeholder={T("healthWeightKg")}
              value={form.weight_kg} onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))}
              className="flex-1 px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-training/50 transition-colors"
            />
            <input
              type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-training/50 transition-colors"
            />
          </div>
          <input
            type="text" placeholder={T("healthNotesPlaceholder")}
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-training/50 transition-colors mb-2.5"
          />
          <button
            onClick={handleAdd} disabled={saving || !form.weight_kg}
            className={cn(
              "w-full py-3.5 text-sm font-black bg-training text-black border-none rounded-full cursor-pointer transition-opacity",
              (saving || !form.weight_kg) ? "opacity-50" : "opacity-100"
            )}
          >{saving ? T("saving") : T("healthSave")}</button>
        </div>
      </div>

      {/* Chart */}
      {sorted.length >= 2 && (
        <div className="px-5 pt-4">
          <div className="px-[18px] py-4 bg-surface rounded-3xl border border-border">
            <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-3">{T("healthWeightChart")}</div>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: "block" }}>
              {/* Grid lines */}
              {yLabels.map((l, i) => (
                <g key={i}>
                  <line x1={pad} y1={l.y} x2={chartW - pad} y2={l.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <text x={pad - 8} y={l.y + 4} fill="#71717A" fontSize="10" textAnchor="end">{l.value}</text>
                </g>
              ))}
              {/* Healthy range band */}
              {rangeBandY1 !== null && (
                <rect x={pad} y={rangeBandY1} width={chartW - pad * 2} height={rangeBandY2 - rangeBandY1} fill="rgba(34,197,94,0.06)" rx="4" />
              )}
              {/* Line */}
              <path d={pathD} fill="none" stroke="url(#weightGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Dots */}
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#22C55E" stroke="#0A0A0C" strokeWidth="2" />
              ))}
              {/* X-axis dates */}
              {points.length <= 10 && points.map((p, i) => (
                <text key={i} x={p.x} y={chartH - 8} fill="#71717A" fontSize="9" textAnchor="middle">{formatDate(p.date)}</text>
              ))}
              {points.length > 10 && [0, Math.floor(points.length / 2), points.length - 1].map(i => (
                <text key={i} x={points[i].x} y={chartH - 8} fill="#71717A" fontSize="9" textAnchor="middle">{formatDate(points[i].date)}</text>
              ))}
              <defs>
                <linearGradient id="weightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
            </svg>
            {weightRange && (
              <div className="text-[11px] text-muted mt-2 flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm" style={{ background: "rgba(34,197,94,0.15)" }} />
                {T("healthHealthyRange")}: {weightRange.min}-{weightRange.max} {T("healthKg")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-[spin_0.8s_linear_infinite] mx-auto" />
        </div>
      )}

      {/* Weight List */}
      {!loading && weights.length === 0 && (
        <div className="text-center py-10 px-5">
          <div className="mb-3 flex justify-center"><Scale size={48} className="text-muted" /></div>
          <div className="text-base font-bold text-text">{T("healthNoWeight")}</div>
        </div>
      )}

      {!loading && weights.length > 0 && (
        <div className="px-5 pt-4 flex flex-col gap-2">
          {weights.map((w, i) => (
            <div key={w.id || i} className="px-[18px] py-3.5 bg-surface rounded-2xl border border-border flex items-center gap-3.5">
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-text">{w.weight || w.weight_kg} {T("healthKg")}</span>
                  {i < weights.length - 1 && (() => {
                    const diff = (w.weight || w.weight_kg) - (weights[i + 1].weight || weights[i + 1].weight_kg);
                    if (Math.abs(diff) < 0.1) return null;
                    return (
                      <span className={cn("text-xs font-semibold", diff > 0 ? "text-xp" : "text-health")}>
                        {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                      </span>
                    );
                  })()}
                </div>
                <div className="text-xs text-muted mt-0.5">{formatDate(w.date)}{w.notes ? ` · ${w.notes}` : ""}</div>
              </div>
              <button
                onClick={() => handleDelete(w.id)}
                className="bg-transparent border-none text-muted cursor-pointer p-1 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
