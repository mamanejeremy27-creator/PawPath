import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, Pill, X } from "lucide-react";
import { cn } from "../lib/cn";

const LS_KEY = "pawpath_medications";

const FREQ_OPTIONS = [
  { value: "daily", labelKey: "healthFreqDaily" },
  { value: "twice_daily", labelKey: "healthFreqTwiceDaily" },
  { value: "weekly", labelKey: "healthFreqWeekly" },
  { value: "as_needed", labelKey: "healthFreqAsNeeded" },
];

export default function MedicationTracker() {
  const { nav, T, lang, isAuthenticated, activeDogId, getDogBackendId } = useApp();
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "daily", start_date: new Date().toISOString().split("T")[0], end_date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let data = [];
      if (isAuthenticated) {
        try {
          data = await api.getMedications(getDogBackendId(activeDogId) || activeDogId) || [];
        } catch { /* silent */ }
      }
      try {
        const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(data.map(x => x.id));
        for (const x of local) if (!ids.has(x.id)) data.push(x);
      } catch { /* silent */ }
      data.sort((a, b) => new Date(b.startDate || b.start_date).getTime() - new Date(a.startDate || a.start_date).getTime());
      if (!cancelled) { setMeds(data); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const now = new Date();
  const active = meds.filter(m => !(m.endDate || m.end_date) || new Date(m.endDate || m.end_date) >= now);
  const completed = meds.filter(m => (m.endDate || m.end_date) && new Date(m.endDate || m.end_date) < now);

  const handleAdd = async () => {
    if (!form.name || !form.start_date) return;
    setSaving(true);

    const entry = { name: form.name, dosage: form.dosage, frequency: form.frequency, startDate: form.start_date, endDate: form.end_date || undefined, notes: form.notes };
    let saved = null;

    if (isAuthenticated) {
      try {
        saved = await api.addMedication(getDogBackendId(activeDogId) || activeDogId, entry);
      } catch { /* silent */ }
    }

    if (!saved) {
      saved = { id: `local_${Date.now()}`, ...entry, dogId: activeDogId, created_at: new Date().toISOString() };
      try {
        const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        all.push(saved);
        localStorage.setItem(LS_KEY, JSON.stringify(all));
      } catch { /* silent */ }
    }

    setMeds(prev => [saved, ...prev]);
    setForm({ name: "", dosage: "", frequency: "daily", start_date: new Date().toISOString().split("T")[0], end_date: "", notes: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (isAuthenticated && !String(id).startsWith("local_")) {
      try { await api.deleteMedication(id); } catch { /* silent */ }
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      localStorage.setItem(LS_KEY, JSON.stringify(all.filter(x => x.id !== id)));
    } catch { /* silent */ }
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" }) : "";
  const freqLabel = (freq) => {
    const opt = FREQ_OPTIONS.find(o => o.value === freq);
    return opt ? T(opt.labelKey) : freq || "";
  };

  const MedCard = ({ m, i }) => {
    const isActive = !(m.endDate || m.end_date) || new Date(m.endDate || m.end_date) >= now;
    return (
      <div key={m.id || i} className="px-[18px] py-3.5 bg-surface rounded-2xl border border-border flex items-center gap-3.5">
        <div className={cn(
          "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
          isActive ? "bg-achieve/[0.08] border-achieve/15" : "bg-white/[0.03] border-border"
        )}>
          <Pill size={18} className={isActive ? "text-achieve" : "text-muted"} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-text">{m.name}</span>
            <span className={cn(
              "px-2.5 py-0.5 rounded-[10px] text-[11px] font-bold",
              isActive ? "bg-training/10 text-training" : "bg-white/5 text-muted"
            )}>
              {isActive ? T("healthActive") : T("healthCompleted")}
            </span>
          </div>
          <div className="text-xs text-muted mt-0.5">
            {m.dosage && <span>{m.dosage} · </span>}
            {freqLabel(m.frequency)}
          </div>
          <div className="text-[11px] text-muted mt-0.5">
            {formatDate(m.startDate || m.start_date)}{(m.endDate || m.end_date) ? ` — ${formatDate(m.endDate || m.end_date)}` : ""}
          </div>
          {m.notes && <div className="text-xs text-text-2 mt-1">{m.notes}</div>}
        </div>
        <button
          onClick={() => handleDelete(m.id)}
          className="bg-transparent border-none text-muted cursor-pointer p-1 flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav("healthDashboard")}
            className="bg-transparent border-none cursor-pointer text-muted p-1 flex items-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-2xl font-black m-0 mb-0.5 text-text">{T("healthMedications")}</h1>
            <p className="text-[13px] text-muted m-0">{meds.length} {T("healthMedications")}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-[18px] py-2.5 rounded-full bg-training text-black border-none font-black text-[13px] cursor-pointer"
        >
          + {T("healthAddMedication")}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-[spin_0.8s_linear_infinite] mx-auto" />
        </div>
      )}

      {/* Empty */}
      {!loading && meds.length === 0 && (
        <div className="text-center py-10 px-5">
          <div className="mb-3 flex justify-center"><Pill size={48} className="text-muted" /></div>
          <div className="text-base font-bold text-text">{T("healthNoMedications")}</div>
        </div>
      )}

      {/* Active Medications */}
      {!loading && active.length > 0 && (
        <div className="px-5 pt-4">
          <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-2.5">{T("healthActiveMeds")}</div>
          <div className="flex flex-col gap-2">
            {active.map((m, i) => <MedCard key={m.id || i} m={m} i={i} />)}
          </div>
        </div>
      )}

      {/* Completed Medications */}
      {!loading && completed.length > 0 && (
        <div className="px-5 pt-5">
          <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px] mb-2.5">{T("healthCompletedMeds")}</div>
          <div className="flex flex-col gap-2">
            {completed.map((m, i) => <MedCard key={m.id || i} m={m} i={i} />)}
          </div>
        </div>
      )}

      {/* Slide-up Form */}
      {showForm && (
        <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl flex items-end justify-center">
          <div className="w-full max-w-[480px] bg-surface rounded-t-3xl px-6 pt-7 pb-9 animate-[slideUp_0.3s_ease] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-[22px] font-black m-0 text-text">{T("healthAddMedication")}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="bg-border border-none text-muted w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3.5">
              <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthMedName")}</div>
              <input
                type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder={T("healthMedName")}
                className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
              />
            </div>

            <div className="flex gap-2.5 mb-3.5">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthDosage")}</div>
                <input
                  type="text" value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))}
                  placeholder={T("healthDosage")}
                  className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
                />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthFrequency")}</div>
                <select
                  value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))}
                  className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none appearance-none"
                >
                  {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{T(o.labelKey)}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2.5 mb-3.5">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthStartDate")}</div>
                <input
                  type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                  className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
                />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthEndDate")}</div>
                <input
                  type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                  className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthNotes")}</div>
              <textarea
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder={T("healthNotesPlaceholder")} rows={2}
                className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none resize-none"
              />
            </div>

            <button
              onClick={handleAdd} disabled={saving || !form.name}
              className={cn(
                "w-full py-[18px] text-base font-black bg-training text-black border-none rounded-full cursor-pointer transition-opacity",
                (saving || !form.name) ? "opacity-50" : "opacity-100"
              )}
            >
              {saving ? T("saving") : T("healthSave")}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
