import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";
import { ArrowLeft, Hospital, X } from "lucide-react";
import { cn } from "../lib/cn";

const LS_KEY = "pawpath_vet_visits";

export default function VetVisitLog() {
  const { nav, T, lang, isAuthenticated, activeDogId, getDogBackendId } = useApp();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], reason: "", vet_name: "", diagnosis: "", treatment: "", cost: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      let data = [];
      if (isAuthenticated) {
        try {
          data = await api.getVetVisits(getDogBackendId(activeDogId) || activeDogId) || [];
        } catch { /* silent */ }
      }
      try {
        const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]").filter(x => x.dogId === activeDogId);
        const ids = new Set(data.map(x => x.id));
        for (const x of local) if (!ids.has(x.id)) data.push(x);
      } catch { /* silent */ }
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (!cancelled) { setVisits(data); setLoading(false); }
    }

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, activeDogId]);

  const handleAdd = async () => {
    if (!form.date) return;
    setSaving(true);

    const entry = { date: form.date, reason: form.reason, vet: form.vet_name || undefined, cost: form.cost ? parseFloat(form.cost) : undefined, notes: [form.diagnosis, form.treatment, form.notes].filter(Boolean).join(' | ') || undefined };
    let saved = null;

    if (isAuthenticated) {
      try {
        saved = await api.addVetVisit(getDogBackendId(activeDogId) || activeDogId, entry);
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

    setVisits(prev => [saved, ...prev]);
    setForm({ date: new Date().toISOString().split("T")[0], reason: "", vet_name: "", diagnosis: "", treatment: "", cost: "", notes: "" });
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (isAuthenticated && !String(id).startsWith("local_")) {
      try { await api.deleteVetVisit(id); } catch { /* silent */ }
    }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      localStorage.setItem(LS_KEY, JSON.stringify(all.filter(x => x.id !== id)));
    } catch { /* silent */ }
    setVisits(prev => prev.filter(v => v.id !== id));
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  const totalCost = visits.reduce((a, v) => a + (v.cost || 0), 0);

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
            <h1 className="font-display text-2xl font-black m-0 mb-0.5 text-text">{T("healthVetVisits")}</h1>
            <p className="text-[13px] text-muted m-0">{visits.length} {T("healthVisits")}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-[18px] py-2.5 rounded-full bg-training text-black border-none font-black text-[13px] cursor-pointer"
        >
          + {T("healthAddVisit")}
        </button>
      </div>

      {/* Summary Stats */}
      {visits.length > 0 && (
        <div className="flex gap-2.5 px-5 pt-4">
          <div className="flex-1 text-center py-3.5 px-1.5 bg-surface rounded-2xl border border-border">
            <div className="text-xl font-black text-training">{visits.length}</div>
            <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold">{T("healthTotalVisits")}</div>
          </div>
          <div className="flex-1 text-center py-3.5 px-1.5 bg-surface rounded-2xl border border-border">
            <div className="text-xl font-black text-text">₪{totalCost.toLocaleString()}</div>
            <div className="text-[10px] text-muted uppercase tracking-[1px] font-semibold">{T("healthTotalCost")}</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-[spin_0.8s_linear_infinite] mx-auto" />
        </div>
      )}

      {/* Empty */}
      {!loading && visits.length === 0 && (
        <div className="text-center py-10 px-5">
          <div className="mb-3 flex justify-center"><Hospital size={48} className="text-muted" /></div>
          <div className="text-base font-bold text-text">{T("healthNoVisits")}</div>
        </div>
      )}

      {/* Visit List */}
      {!loading && visits.length > 0 && (
        <div className="px-5 pt-4 flex flex-col gap-2">
          {visits.map((v, i) => {
            const isExpanded = expanded === v.id;
            return (
              <div key={v.id || i} className="bg-surface rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : v.id)}
                  className="w-full text-start cursor-pointer px-[18px] py-3.5 bg-transparent border-none text-text font-sans flex items-center gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.15)" }}>
                    <Hospital size={18} style={{ color: "#EC4899" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">{v.reason || formatDate(v.date)}</div>
                    <div className="text-xs text-muted mt-0.5">
                      {formatDate(v.date)}{(v.vet || v.vet_name) ? ` · ${v.vet || v.vet_name}` : ""}
                    </div>
                  </div>
                  {v.cost > 0 && <div className="text-sm font-black text-training shrink-0">₪{v.cost}</div>}
                  <span
                    className="text-muted text-sm transition-transform duration-200"
                    style={{ transform: isExpanded ? "rotate(90deg)" : "none" }}
                  >›</span>
                </button>
                {isExpanded && (
                  <div className="px-[18px] pb-3.5 border-t border-border">
                    {v.diagnosis && (
                      <div className="mt-2.5">
                        <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px]">{T("healthDiagnosis")}</div>
                        <div className="text-[13px] text-text-2 mt-1">{v.diagnosis}</div>
                      </div>
                    )}
                    {v.treatment && (
                      <div className="mt-2.5">
                        <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px]">{T("healthTreatment")}</div>
                        <div className="text-[13px] text-text-2 mt-1">{v.treatment}</div>
                      </div>
                    )}
                    {v.notes && (
                      <div className="mt-2.5">
                        <div className="text-[11px] font-bold text-muted uppercase tracking-[1.5px]">{T("healthNotes")}</div>
                        <div className="text-[13px] text-text-2 mt-1">{v.notes}</div>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(v.id); }}
                      className="mt-3 px-4 py-2 text-xs font-semibold bg-danger/[0.08] text-danger border border-danger/15 rounded-[20px] cursor-pointer"
                    >
                      {T("healthDelete")}
                    </button>
                  </div>
                )}
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
              <h3 className="font-display text-[22px] font-black m-0 text-text">{T("healthAddVisit")}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="bg-border border-none text-muted w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {[
              { key: "date", type: "date", label: T("healthDate") },
              { key: "reason", type: "text", label: T("healthReason") },
              { key: "vet_name", type: "text", label: T("healthVetName") },
              { key: "diagnosis", type: "text", label: T("healthDiagnosis") },
              { key: "treatment", type: "text", label: T("healthTreatment") },
              { key: "cost", type: "number", label: T("healthCost") },
            ].map(f => (
              <div key={f.key} className="mb-3.5">
                <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{f.label}</div>
                <input
                  type={f.type} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.label} step={f.type === "number" ? "0.01" : undefined}
                  className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none focus:border-health/50 transition-colors"
                />
              </div>
            ))}

            <div className="mb-4">
              <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("healthNotes")}</div>
              <textarea
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder={T("healthNotesPlaceholder")} rows={2}
                className="w-full px-3.5 py-3 text-sm bg-bg border border-border rounded-2xl text-text outline-none resize-none"
              />
            </div>

            <button
              onClick={handleAdd} disabled={saving || !form.date}
              className={cn(
                "w-full py-[18px] text-base font-black bg-training text-black border-none rounded-full cursor-pointer transition-opacity",
                (saving || !form.date) ? "opacity-50" : "opacity-100"
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
