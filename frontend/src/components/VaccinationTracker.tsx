import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, Syringe, X } from "lucide-react";
import { cn } from "../lib/cn";

const LS_KEY = "pawpath_vaccinations";

const COMMON_VACCINES = [
  { id: "rabies", name: { en: "Rabies", he: "כלבת" } },
  { id: "dhpp", name: { en: "DHPP", he: "DHPP" } },
  { id: "bordetella", name: { en: "Bordetella", he: "בורדטלה" } },
  { id: "leptospirosis", name: { en: "Leptospirosis", he: "לפטוספירוזיס" } },
  { id: "lyme", name: { en: "Lyme", he: "ליים" } },
  { id: "canine_influenza", name: { en: "Canine Influenza", he: "שפעת כלבים" } },
];

function vaccineStatus(nextDue) {
  if (!nextDue) return { key: "recorded", colorClass: "text-muted", badgeClass: "bg-white/5 text-muted" };
  const diff = (new Date(nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return { key: "overdue", colorClass: "text-danger", badgeClass: "bg-danger/10 text-danger" };
  if (diff <= 30) return { key: "dueSoon", colorClass: "text-xp", badgeClass: "bg-xp/10 text-xp" };
  return { key: "upToDate", colorClass: "text-training", badgeClass: "bg-training/10 text-training" };
}

const statusLabel = (T, key) => {
  const map = { recorded: "healthRecorded", overdue: "healthOverdue", dueSoon: "healthDueSoon", upToDate: "healthUpToDate" };
  return T(map[key] || key);
};

export default function VaccinationTracker() {
  const { nav, T, lang, isAuthenticated, activeDogId, getDogBackendId } = useApp();
  const [vacc, setVacc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vaccine_name: "", date_given: new Date().toISOString().split("T")[0], next_due: "", vet_name: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let data = [];
      if (isAuthenticated) {
        try {
          data = await api.getVaccinations(getDogBackendId(activeDogId) || activeDogId) || [];
        } catch { /* silent */ }
      }
      try {
        const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(data.map(x => x.id));
        for (const x of local) if (!ids.has(x.id)) data.push(x);
      } catch { /* silent */ }
      data.sort((a, b) => new Date(b.date || b.date_given).getTime() - new Date(a.date || a.date_given).getTime());
      if (!cancelled) { setVacc(data); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const handleAdd = async () => {
    if (!form.vaccine_name || !form.date_given) return;
    setSaving(true);

    const vetNote = form.vet_name ? `Vet: ${form.vet_name}` : "";
    const combinedNotes = [vetNote, form.notes].filter(Boolean).join(" | ") || undefined;
    const entry = { name: form.vaccine_name, date: form.date_given, nextDue: form.next_due || undefined, notes: combinedNotes };
    let saved = null;

    if (isAuthenticated) {
      try {
        saved = await api.addVaccination(getDogBackendId(activeDogId) || activeDogId, entry);
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

    setVacc(prev => [saved, ...prev]);
    setForm({ vaccine_name: "", date_given: new Date().toISOString().split("T")[0], next_due: "", vet_name: "", notes: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (isAuthenticated && !String(id).startsWith("local_")) {
      try { await api.deleteVaccination(id); } catch { /* silent */ }
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      localStorage.setItem(LS_KEY, JSON.stringify(all.filter(x => x.id !== id)));
    } catch { /* silent */ }
    setVacc(prev => prev.filter(v => v.id !== id));
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  // Status summary
  const counts = vacc.reduce((a, v) => {
    const s = vaccineStatus(v.nextDue || v.next_due);
    a[s.key] = (a[s.key] || 0) + 1;
    return a;
  }, {});

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
            <h1 className="font-display text-2xl font-black m-0 mb-0.5 text-text">{T("healthVaccinations")}</h1>
            <p className="text-[13px] text-muted m-0">{vacc.length} {T("healthRecords")}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-[18px] py-2.5 rounded-full bg-training text-black border-none font-black text-[13px] cursor-pointer"
        >
          + {T("healthAddVaccination")}
        </button>
      </div>

      {/* Status Summary */}
      {vacc.length > 0 && (
        <div className="flex gap-2 px-5 pt-4 flex-wrap">
          {counts.upToDate > 0 && (
            <div className="px-3.5 py-2 rounded-[20px] bg-training/[0.08] border border-training/15">
              <span className="text-sm font-black text-training">{counts.upToDate}</span>
              <span className="text-xs text-training font-semibold ms-1.5">{T("healthUpToDate")}</span>
            </div>
          )}
          {counts.dueSoon > 0 && (
            <div className="px-3.5 py-2 rounded-[20px] bg-xp/[0.08] border border-xp/15">
              <span className="text-sm font-black text-xp">{counts.dueSoon}</span>
              <span className="text-xs text-xp font-semibold ms-1.5">{T("healthDueSoon")}</span>
            </div>
          )}
          {counts.overdue > 0 && (
            <div className="px-3.5 py-2 rounded-[20px] bg-danger/[0.08] border border-danger/15">
              <span className="text-sm font-black text-danger">{counts.overdue}</span>
              <span className="text-xs text-danger font-semibold ms-1.5">{T("healthOverdue")}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-[spin_0.8s_linear_infinite] mx-auto" />
        </div>
      )}

      {/* Empty */}
      {!loading && vacc.length === 0 && (
        <div className="text-center py-10 px-5">
          <div className="mb-3 flex justify-center"><Syringe size={48} className="text-muted" /></div>
          <div className="text-base font-bold text-text">{T("healthNoVaccinations")}</div>
        </div>
      )}

      {/* Vaccine List */}
      {!loading && vacc.length > 0 && (
        <div className="px-5 pt-4 flex flex-col gap-2">
          {vacc.map((v, i) => {
            const st = vaccineStatus(v.nextDue || v.next_due);
            return (
              <div key={v.id || i} className="px-[18px] py-3.5 bg-surface rounded-2xl border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-text">{v.name || v.vaccine_name}</span>
                      <span className={cn("px-2.5 py-0.5 rounded-[10px] text-[11px] font-bold", st.badgeClass)}>
                        {statusLabel(T, st.key)}
                      </span>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {T("healthDateGiven")}: {formatDate(v.date || v.date_given)}
                      {(v.nextDue || v.next_due) && <span> · {T("healthNextDue")}: {formatDate(v.nextDue || v.next_due)}</span>}
                    </div>
                    {v.vet_name && <div className="text-xs text-muted mt-0.5">{T("healthVetName")}: {v.vet_name}</div>}
                    {v.notes && <div className="text-xs text-text-2 mt-0.5">{v.notes}</div>}
                  </div>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="bg-transparent border-none text-muted cursor-pointer p-1 flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-up Form */}
      {showForm && (
        <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl flex items-end justify-center">
          <div className="w-full max-w-[480px] bg-surface rounded-t-3xl px-6 pt-7 pb-9 animate-[slideUp_0.3s_ease] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display text-[22px] font-black m-0 text-text">{T("healthAddVaccination")}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="bg-border border-none text-muted w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthVaccineName")}</div>
            <div className="relative mb-3.5">
              <input
                type="text" value={form.vaccine_name}
                onChange={e => { setForm(f => ({ ...f, vaccine_name: e.target.value })); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={T("healthVaccineName")}
                className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
              />
              {showSuggestions && (
                <div className="absolute top-full start-0 end-0 z-10 bg-surface border border-border rounded-2xl mt-1 overflow-hidden">
                  {COMMON_VACCINES.filter(v => !form.vaccine_name || v.name[lang === "he" ? "he" : "en"].toLowerCase().includes(form.vaccine_name.toLowerCase())).map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setForm(f => ({ ...f, vaccine_name: v.name[lang === "he" ? "he" : "en"] })); setShowSuggestions(false); }}
                      className="w-full px-3.5 py-2.5 bg-transparent border-none border-b border-border text-text text-sm cursor-pointer text-start last:border-b-0"
                    >
                      {v.name[lang === "he" ? "he" : "en"]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2.5 mb-3.5">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthDateGiven")}</div>
                <input
                  type="date" value={form.date_given} onChange={e => setForm(f => ({ ...f, date_given: e.target.value }))}
                  className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
                />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthNextDue")}</div>
                <input
                  type="date" value={form.next_due} onChange={e => setForm(f => ({ ...f, next_due: e.target.value }))}
                  className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
                />
              </div>
            </div>

            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthVetName")}</div>
            <input
              type="text" value={form.vet_name} onChange={e => setForm(f => ({ ...f, vet_name: e.target.value }))}
              placeholder={T("healthVetName")}
              className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors mb-3.5"
            />

            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthNotes")}</div>
            <textarea
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder={T("healthNotesPlaceholder")} rows={2}
              className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none resize-none mb-4"
            />

            <button
              onClick={handleAdd} disabled={saving || !form.vaccine_name}
              className={cn(
                "w-full py-[18px] text-base font-black bg-training text-black border-none rounded-full cursor-pointer transition-opacity",
                (saving || !form.vaccine_name) ? "opacity-50" : "opacity-100"
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
