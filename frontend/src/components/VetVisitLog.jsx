import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext.jsx";
import { api } from "../lib/api.js";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };
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
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => nav("healthDashboard")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.t3, padding: 4 }}>
            {"\u2190"}
          </button>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 2px", color: C.t1 }}>{T("healthVetVisits")}</h1>
            <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{visits.length} {lang === "he" ? "ביקורים" : "visits"}</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          padding: "10px 18px", borderRadius: 50,
          background: C.acc, color: "#000", border: "none",
          fontWeight: 800, fontSize: 13, cursor: "pointer",
        }}>+ {T("healthAddVisit")}</button>
      </div>

      {/* Summary Stats */}
      {visits.length > 0 && (
        <div style={{ display: "flex", gap: 10, padding: "16px 20px 0" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.acc }}>{visits.length}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("healthTotalVisits")}</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "14px 6px", background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.t1 }}>₪{totalCost.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{T("healthTotalCost")}</div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && visits.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{T("healthNoVisits")}</div>
        </div>
      )}

      {/* Visit List */}
      {!loading && visits.length > 0 && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {visits.map((v, i) => {
            const isExpanded = expanded === v.id;
            return (
              <div key={v.id || i} style={{ background: C.s1, borderRadius: C.r, border: `1px solid ${C.b1}`, overflow: "hidden" }}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : v.id)}
                  style={{ width: "100%", textAlign: "start", cursor: "pointer", padding: "14px 18px", background: "transparent", border: "none", color: C.t1, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 14 }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏥</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{v.reason || formatDate(v.date)}</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>
                      {formatDate(v.date)}{v.vet_name ? ` · ${v.vet_name}` : ""}
                    </div>
                  </div>
                  {v.cost > 0 && <div style={{ fontSize: 14, fontWeight: 800, color: C.acc, flexShrink: 0 }}>₪{v.cost}</div>}
                  <span style={{ color: C.t3, fontSize: 14, transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none" }}>›</span>
                </button>
                {isExpanded && (
                  <div style={{ padding: "0 18px 14px", borderTop: `1px solid ${C.b1}` }}>
                    {v.diagnosis && <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5 }}>{T("healthDiagnosis")}</div>
                      <div style={{ fontSize: 13, color: C.t2, marginTop: 4 }}>{v.diagnosis}</div>
                    </div>}
                    {v.treatment && <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5 }}>{T("healthTreatment")}</div>
                      <div style={{ fontSize: 13, color: C.t2, marginTop: 4 }}>{v.treatment}</div>
                    </div>}
                    {v.notes && <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 1.5 }}>{T("healthNotes")}</div>
                      <div style={{ fontSize: 13, color: C.t2, marginTop: 4 }}>{v.notes}</div>
                    </div>}
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(v.id); }}
                      style={{ marginTop: 12, padding: "8px 16px", fontSize: 12, fontWeight: 600, background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 20, cursor: "pointer" }}>
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
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 480, background: C.s1, borderRadius: "24px 24px 0 0", padding: "28px 24px 36px", animation: "slideUp 0.3s ease", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{T("healthAddVisit")}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>

            {[
              { key: "date", type: "date", label: T("healthDate") },
              { key: "reason", type: "text", label: T("healthReason") },
              { key: "vet_name", type: "text", label: T("healthVetName") },
              { key: "diagnosis", type: "text", label: T("healthDiagnosis") },
              { key: "treatment", type: "text", label: T("healthTreatment") },
              { key: "cost", type: "number", label: T("healthCost") },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{f.label}</div>
                <input type={f.type} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.label} step={f.type === "number" ? "0.01" : undefined}
                  style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("healthNotes")}</div>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder={T("healthNotesPlaceholder")} rows={2}
                style={{ width: "100%", padding: "12px 14px", fontSize: 14, background: C.bg, border: `1px solid ${C.b1}`, borderRadius: C.r, color: C.t1, outline: "none", resize: "none", boxSizing: "border-box" }} />
            </div>

            <button onClick={handleAdd} disabled={saving || !form.date}
              style={{ width: "100%", padding: "18px", fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", opacity: saving || !form.date ? 0.5 : 1 }}>
              {saving ? T("saving") : T("healthSave")}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="home" />
    </div>
  );
}
