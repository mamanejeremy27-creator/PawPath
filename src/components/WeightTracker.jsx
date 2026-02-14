import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { saveWeightLog, getWeightLogs, deleteWeightLog, getBreedWeightRange } from "../lib/healthTracker.js";
import { matchBreed } from "../data/breedTraits.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };
const LS_KEY = "pawpath_weight_logs";

export default function WeightTracker() {
  const { nav, T, lang, isAuthenticated, activeDogId, dogProfile } = useApp();
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
        const res = await getWeightLogs(activeDogId);
        if (!res.error && res.data) data = res.data;
      }
      try {
        const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(data.map(x => x.id));
        for (const x of local) if (!ids.has(x.id)) data.push(x);
      } catch { /* silent */ }
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      if (!cancelled) { setWeights(data); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const handleAdd = async () => {
    const kg = parseFloat(form.weight_kg);
    if (!kg || kg <= 0) return;
    setSaving(true);

    const entry = { weight_kg: kg, date: form.date, notes: form.notes };
    let saved = null;

    if (isAuthenticated) {
      const res = await saveWeightLog(activeDogId, entry);
      if (!res.error) saved = res.data;
    }

    if (!saved) {
      saved = { id: `local_${Date.now()}`, ...entry, dogId: activeDogId, created_at: new Date().toISOString() };
      try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        all.push(saved);
        localStorage.setItem(LS_KEY, JSON.stringify(all));
      } catch { /* silent */ }
    }

    setWeights(prev => [saved, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    setForm({ weight_kg: "", date: new Date().toISOString().split("T")[0], notes: "" });
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (isAuthenticated && !String(id).startsWith("local_")) {
      await deleteWeightLog(id);
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      localStorage.setItem(LS_KEY, JSON.stringify(all.filter(x => x.id !== id)));
    } catch { /* silent */ }
    setWeights(prev => prev.filter(w => w.id !== id));
  };

  // SVG Chart
  const chartW = 340, chartH = 200, pad = 40;
  const sorted = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date));
  const vals = sorted.map(w => w.weight_kg);
  const minV = vals.length ? Math.min(...vals) - 1 : 0;
  const maxV = vals.length ? Math.max(...vals) + 1 : 10;
  const rangeV = maxV - minV || 1;

  const points = sorted.map((w, i) => ({
    x: pad + (sorted.length > 1 ? (i / (sorted.length - 1)) * (chartW - pad * 2) : (chartW - pad * 2) / 2),
    y: pad + (1 - (w.weight_kg - minV) / rangeV) * (chartH - pad * 2),
    label: w.weight_kg,
    date: w.date,
  }));

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
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("healthDashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
          {"\u2190"}
        </button>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: C.t1 }}>{T("healthWeight")}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{weights.length} {lang === "he" ? "רשומות" : "entries"}</p>
        </div>
      </div>

      {/* Add Form */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ padding: "16px 18px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{T("healthAddWeight")}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              type="number" step="0.1" min="0" placeholder={T("healthWeightKg")}
              value={form.weight_kg} onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))}
              style={{ flex: 1, padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none" }}
            />
            <input
              type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              style={{ padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none" }}
            />
          </div>
          <input
            type="text" placeholder={T("healthNotesPlaceholder")}
            value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", marginBottom: 10, boxSizing: "border-box" }}
          />
          <button
            onClick={handleAdd} disabled={saving || !form.weight_kg}
            style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", opacity: saving || !form.weight_kg ? 0.5 : 1 }}
          >{saving ? T("saving") : T("healthSave")}</button>
        </div>
      </div>

      {/* Chart */}
      {sorted.length >= 2 && (
        <div style={{ padding: "16px 20px 0" }}>
          <div style={{ padding: "16px 18px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>{T("healthWeightChart")}</div>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH}`} style={{ display: "block" }}>
              {/* Grid lines */}
              {yLabels.map((l, i) => (
                <g key={i}>
                  <line x1={pad} y1={l.y} x2={chartW - pad} y2={l.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <text x={pad - 8} y={l.y + 4} fill={C.t3} fontSize="10" textAnchor="end">{l.value}</text>
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
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={C.acc} stroke={C.bg} strokeWidth="2" />
              ))}
              {/* X-axis dates */}
              {points.length <= 10 && points.map((p, i) => (
                <text key={i} x={p.x} y={chartH - 8} fill={C.t3} fontSize="9" textAnchor="middle">{formatDate(p.date)}</text>
              ))}
              {points.length > 10 && [0, Math.floor(points.length / 2), points.length - 1].map(i => (
                <text key={i} x={points[i].x} y={chartH - 8} fill={C.t3} fontSize="9" textAnchor="middle">{formatDate(points[i].date)}</text>
              ))}
              <defs>
                <linearGradient id="weightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
            </svg>
            {weightRange && (
              <div style={{ fontSize: 11, color: C.t3, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 8, borderRadius: 2, background: "rgba(34,197,94,0.15)" }} />
                {T("healthHealthyRange")}: {weightRange.min}-{weightRange.max} {T("healthKg")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Weight List */}
      {!loading && weights.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚖️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{T("healthNoWeight")}</div>
        </div>
      )}

      {!loading && weights.length > 0 && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {weights.map((w, i) => (
            <div key={w.id || i} style={{ padding: "14px 18px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: C.t1 }}>{w.weight_kg} {T("healthKg")}</span>
                  {i < weights.length - 1 && (() => {
                    const diff = w.weight_kg - weights[i + 1].weight_kg;
                    if (Math.abs(diff) < 0.1) return null;
                    return <span style={{ fontSize: 12, color: diff > 0 ? "#F59E0B" : "#3B82F6", fontWeight: 600 }}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}</span>;
                  })()}
                </div>
                <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{formatDate(w.date)}{w.notes ? ` · ${w.notes}` : ""}</div>
              </div>
              <button onClick={() => handleDelete(w.id)} style={{ background: "none", border: "none", color: C.t3, cursor: "pointer", fontSize: 16, padding: 4 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
