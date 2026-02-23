import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, Scale, Syringe, Pill, Hospital, Heart, ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../lib/cn";

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
  const trendColorClass = trend === "up" ? "text-xp" : trend === "down" ? "text-health" : "text-training";
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
      icon: <Scale size={24} className="text-training" />,
      title: T("healthWeight"),
      cardClass: "bg-training/[0.08] border-training/20",
      iconClass: "bg-training/[0.08] border-training/20",
      content: currentWeight
        ? <div>
            <div className="text-2xl font-black text-text">{currentWeight} {T("healthKg")}</div>
            {trend && (
              <div className={cn("text-xs font-semibold mt-1 flex items-center gap-1", trendColorClass)}>
                {TrendIcon && <TrendIcon size={14} />} {trendLabel}
              </div>
            )}
          </div>
        : <div className="text-[13px] text-muted">{T("healthNoData")}</div>,
    },
    {
      key: "vacc",
      screen: "vaccinationTracker",
      icon: <Syringe size={24} className="text-health" />,
      title: T("healthVaccinations"),
      cardClass: "bg-health/[0.08] border-health/20",
      iconClass: "bg-health/[0.08] border-health/20",
      content: vaccinations.length > 0
        ? <div className="flex gap-2 flex-wrap mt-1">
            {vaccStatus.overdue > 0 && <span className="px-2.5 py-0.5 rounded-xl bg-danger/10 text-danger text-xs font-bold">{vaccStatus.overdue} {T("healthOverdue")}</span>}
            {vaccStatus.dueSoon > 0 && <span className="px-2.5 py-0.5 rounded-xl bg-xp/10 text-xp text-xs font-bold">{vaccStatus.dueSoon} {T("healthDueSoon")}</span>}
            {vaccStatus.upToDate > 0 && <span className="px-2.5 py-0.5 rounded-xl bg-training/10 text-training text-xs font-bold">{vaccStatus.upToDate} {T("healthUpToDate")}</span>}
          </div>
        : <div className="text-[13px] text-muted">{T("healthNoData")}</div>,
    },
    {
      key: "meds",
      screen: "medicationTracker",
      icon: <Pill size={24} className="text-achieve" />,
      title: T("healthMedications"),
      cardClass: "bg-achieve/[0.08] border-achieve/20",
      iconClass: "bg-achieve/[0.08] border-achieve/20",
      content: medications.length > 0
        ? <div className="text-xl font-black text-text">
            {activeMeds} <span className="text-[13px] font-semibold text-muted">{T("healthActive").toLowerCase()}</span>
          </div>
        : <div className="text-[13px] text-muted">{T("healthNoData")}</div>,
    },
    {
      key: "visits",
      screen: "vetVisitLog",
      icon: <Hospital size={24} style={{ color: "#EC4899" }} />,
      title: T("healthVetVisits"),
      cardClass: "border",
      iconClass: "border",
      cardStyle: { background: "rgba(236,72,153,0.08)", borderColor: "rgba(236,72,153,0.2)" },
      iconStyle: { background: "rgba(236,72,153,0.08)", borderColor: "rgba(236,72,153,0.2)" },
      content: lastVisit
        ? <div>
            <div className="text-[13px] text-muted">{T("healthLastVisit")}</div>
            <div className="text-[15px] font-bold text-text mt-0.5">{formatDate(lastVisit.date)}</div>
          </div>
        : <div className="text-[13px] text-muted">{T("healthNoData")}</div>,
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex items-center gap-3">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-none cursor-pointer text-xl text-muted p-1 flex items-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-black m-0 mb-0.5 text-text">{T("healthDashboard")}</h1>
          <p className="text-[13px] text-muted m-0 flex items-center gap-1">
            <Heart size={14} style={{ color: "#EC4899", display: "inline", verticalAlign: "middle" }} />
            {T("healthDashboardSub").replace(" →", "").replace("← ", "")}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-[spin_0.8s_linear_infinite] mx-auto" />
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <div className="px-5 pt-4 flex flex-col gap-2.5">
          {cards.map(card => (
            <button
              key={card.key}
              onClick={() => nav(card.screen)}
              className={cn(
                "w-full text-start cursor-pointer px-5 py-[18px] rounded-3xl border flex items-center gap-4 text-text font-sans",
                card.cardClass
              )}
              style={card.cardStyle}
            >
              <div
                className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0", card.iconClass)}
                style={card.iconStyle}
              >
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-1.5">{card.title}</div>
                {card.content}
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>
          ))}
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
