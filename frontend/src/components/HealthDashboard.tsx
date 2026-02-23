import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, Scale, Syringe, Pill, Hospital, Heart, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };
const LS_WEIGHT = "pawpath_weight_logs";
const LS_VACC = "pawpath_vaccinations";
const LS_VISITS = "pawpath_vet_visits";
const LS_MEDS = "pawpath_medications";

export default function HealthDashboard() {
  const { nav, T, lang, isAuthenticated, activeDogId } = useApp();
  const [weights, setWeights] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [visits, setVisits] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let w = [], v = [], vi = [], m = [];

      if (isAuthenticated) {
        // activeDogId is already the backend UUID after loadFromBackend (identity mapping in idMapRef)
        const [wr, vr, vir, mr] = await Promise.allSettled([
          api.getWeightRecords(activeDogId),
          api.getVaccinations(activeDogId),
          api.getVetVisits(activeDogId),
          api.getMedications(activeDogId),
        ]);
        if (wr.status === "fulfilled" && wr.value) w = wr.value;
        if (vr.status === "fulfilled" && vr.value) v = vr.value;
        if (vir.status === "fulfilled" && vir.value) vi = vir.value;
        if (mr.status === "fulfilled" && mr.value) m = mr.value;
      }

      // Merge localStorage
      try {
        const lw = JSON.parse(localStorage.getItem(LS_WEIGHT) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(w.map(x => x.id));
        for (const x of lw) if (!ids.has(x.id)) w.push(x);
      } catch { /* silent */ }
      try {
        const lv = JSON.parse(localStorage.getItem(LS_VACC) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(v.map(x => x.id));
        for (const x of lv) if (!ids.has(x.id)) v.push(x);
      } catch { /* silent */ }
      try {
        const lvi = JSON.parse(localStorage.getItem(LS_VISITS) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(vi.map(x => x.id));
        for (const x of lvi) if (!ids.has(x.id)) vi.push(x);
      } catch { /* silent */ }
      try {
        const lm = JSON.parse(localStorage.getItem(LS_MEDS) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(m.map(x => x.id));
        for (const x of lm) if (!ids.has(x.id)) m.push(x);
      } catch { /* silent */ }

      if (!cancelled) {
        setWeights(w.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setVaccinations(v);
        setVisits(vi.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setMedications(m);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const now = new Date();

  // Weight trend
  const currentWeight = weights.length > 0 ? weights[0].weight_kg : null;
  const prevWeight = weights.length > 1 ? weights[1].weight_kg : null;
  const trend = currentWeight && prevWeight
    ? currentWeight > prevWeight + 0.2 ? "up" : currentWeight < prevWeight - 0.2 ? "down" : "stable"
    : null;
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : trend === "stable" ? Minus : null;
  const trendColor = trend === "up" ? "#F59E0B" : trend === "down" ? "#3B82F6" : C.acc;
  const trendLabel = trend === "up" ? T("healthTrendUp") : trend === "down" ? T("healthTrendDown") : trend === "stable" ? T("healthTrendStable") : "";

  // Vaccination status
  const vaccStatus = vaccinations.reduce((acc, v) => {
    if (!v.next_due) return acc;
    const due = new Date(v.next_due);
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) acc.overdue++;
    else if (diff <= 30) acc.dueSoon++;
    else acc.upToDate++;
    return acc;
  }, { overdue: 0, dueSoon: 0, upToDate: 0 });

  // Active meds
  const activeMeds = medications.filter(m => !m.end_date || new Date(m.end_date) >= now).length;

  // Last visit
  const lastVisit = visits.length > 0 ? visits[0] : null;
  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const cards = [
    {
      key: "weight",
      screen: "weightTracker",
      icon: <Scale size={24} color="#22C55E" />,
      title: T("healthWeight"),
      gradient: "rgba(34,197,94,0.08)",
      borderColor: "rgba(34,197,94,0.2)",
      content: currentWeight
        ? <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.t1 }}>{currentWeight} {T("healthKg")}</div>
            {trend && <div style={{ fontSize: 12, fontWeight: 600, color: trendColor, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>{TrendIcon && <TrendIcon size={14} color={trendColor} />} {trendLabel}</div>}
          </div>
        : <div style={{ fontSize: 13, color: C.t3 }}>{T("healthNoData")}</div>,
    },
    {
      key: "vacc",
      screen: "vaccinationTracker",
      icon: <Syringe size={24} color="#3B82F6" />,
      title: T("healthVaccinations"),
      gradient: "rgba(59,130,246,0.08)",
      borderColor: "rgba(59,130,246,0.2)",
      content: vaccinations.length > 0
        ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            {vaccStatus.overdue > 0 && <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(239,68,68,0.1)", color: "#EF4444", fontSize: 12, fontWeight: 700 }}>{vaccStatus.overdue} {T("healthOverdue")}</span>}
            {vaccStatus.dueSoon > 0 && <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(245,158,11,0.1)", color: "#F59E0B", fontSize: 12, fontWeight: 700 }}>{vaccStatus.dueSoon} {T("healthDueSoon")}</span>}
            {vaccStatus.upToDate > 0 && <span style={{ padding: "3px 10px", borderRadius: 12, background: "rgba(34,197,94,0.1)", color: C.acc, fontSize: 12, fontWeight: 700 }}>{vaccStatus.upToDate} {T("healthUpToDate")}</span>}
          </div>
        : <div style={{ fontSize: 13, color: C.t3 }}>{T("healthNoData")}</div>,
    },
    {
      key: "meds",
      screen: "medicationTracker",
      icon: <Pill size={24} color="#8B5CF6" />,
      title: T("healthMedications"),
      gradient: "rgba(139,92,246,0.08)",
      borderColor: "rgba(139,92,246,0.2)",
      content: medications.length > 0
        ? <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>{activeMeds} <span style={{ fontSize: 13, fontWeight: 600, color: C.t3 }}>{T("healthActive").toLowerCase()}</span></div>
        : <div style={{ fontSize: 13, color: C.t3 }}>{T("healthNoData")}</div>,
    },
    {
      key: "visits",
      screen: "vetVisitLog",
      icon: <Hospital size={24} color="#EC4899" />,
      title: T("healthVetVisits"),
      gradient: "rgba(236,72,153,0.08)",
      borderColor: "rgba(236,72,153,0.2)",
      content: lastVisit
        ? <div>
            <div style={{ fontSize: 13, color: C.t3 }}>{T("healthLastVisit")}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginTop: 2 }}>{formatDate(lastVisit.date)}</div>
          </div>
        : <div style={{ fontSize: 13, color: C.t3 }}>{T("healthNoData")}</div>,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: C.t1 }}>{T("healthDashboard")}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}><Heart size={14} color="#EC4899" style={{ display: "inline", verticalAlign: "middle" }} /> {T("healthDashboardSub").replace(" →", "").replace("← ", "")}</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {cards.map(card => (
            <button
              key={card.key}
              onClick={() => nav(card.screen)}
              style={{
                width: "100%", textAlign: "start", cursor: "pointer",
                padding: "18px 20px", background: card.gradient,
                borderRadius: C.rL, border: `1px solid ${card.borderColor}`,
                color: C.t1, fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 16,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: card.gradient, border: `1px solid ${card.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {card.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{card.title}</div>
                {card.content}
              </div>
              <ChevronRight size={16} color={C.t3} />
            </button>
          ))}
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
