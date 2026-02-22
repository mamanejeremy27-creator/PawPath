import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DIAGNOSTIC_CATEGORIES, getDiagnosticExercises } from "../data/diagnostic.js";
import { ArrowLeft, AlertTriangle, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", s2: "#1F1F23", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", amber: "#F59E0B", danger: "#EF4444", r: 16, rL: 24 };
const DIAG_STORAGE_KEY = "pawpath_diagnosticHistory";

function saveDiagnosticResult(result) {
  try {
    const raw = localStorage.getItem(DIAG_STORAGE_KEY);
    const history = raw ? JSON.parse(raw) : [];
    history.unshift(result);
    if (history.length > 20) history.length = 20;
    localStorage.setItem(DIAG_STORAGE_KEY, JSON.stringify(history));
  } catch (e) { /* ignore */ }
}

export function getDiagnosticHistory() {
  try {
    const raw = localStorage.getItem(DIAG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

// Aggression keywords to detect
const AGGRESSION_IDS = ["reactivity"];
const AGGRESSION_ANSWERS = { "react_type": "aggressive" };

export default function DiagnosticFlow() {
  const { nav, T, lang, completedExercises, programs, dogProfile } = useApp();
  const [step, setStep] = useState("categories"); // categories | followUps | results
  const [selectedCat, setSelectedCat] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);

  const reset = () => { setStep("categories"); setSelectedCat(null); setAnswers({}); setCurrentQ(0); };

  // ─── Step 1: Category Selection Grid ───
  if (step === "categories") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 40, animation: "fadeIn 0.3s ease" }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <button onClick={() => nav("home")} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={16} /> {T("home")}
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, margin: 0, color: C.t1 }}>{T("diagTitle")}</h1>
          <p style={{ fontSize: 14, color: C.t2, marginTop: 8, lineHeight: 1.6 }}>{T("diagSubtitle")}</p>
        </div>
        <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {DIAGNOSTIC_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCat(cat); setStep("followUps"); setCurrentQ(0); setAnswers({}); }}
              style={{
                padding: "20px 14px", background: C.s1, borderRadius: C.rL,
                border: `1px solid ${C.b1}`, cursor: "pointer", color: C.t1,
                textAlign: "center", animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
              }}
            >
              <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><Icon name={cat.icon || "Stethoscope"} size={32} color={C.acc} /></div>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>{cat.name[lang] || cat.name.en}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Step 2: Follow-up Questions ───
  if (step === "followUps" && selectedCat) {
    const questions = selectedCat.followUps;
    const q = questions[currentQ];

    if (!q) {
      // All questions answered — compute results
      const exercises = getDiagnosticExercises(selectedCat.id, answers);
      const result = {
        categoryId: selectedCat.id,
        answers: { ...answers },
        date: new Date().toISOString(),
        dogName: dogProfile?.name || "",
        exerciseCount: exercises.length,
      };
      saveDiagnosticResult(result);
      setStep("results");
      return null;
    }

    return (
      <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 40, animation: "fadeIn 0.3s ease" }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <button onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); } else { reset(); } }} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={16} /> {T("back")}
          </button>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {questions.map((_, i) => (
              <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= currentQ ? C.acc : C.b1, transition: "background 0.3s" }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Icon name={selectedCat.icon || "Stethoscope"} size={28} color={C.acc} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{q.question[lang] || q.question.en}</h2>
          </div>
        </div>

        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map(opt => {
            const selected = answers[q.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  const newAnswers = { ...answers, [q.id]: opt.id };
                  setAnswers(newAnswers);
                  setTimeout(() => setCurrentQ(currentQ + 1), 200);
                }}
                style={{
                  padding: "18px 20px", background: selected ? "rgba(34,197,94,0.08)" : C.s1,
                  borderRadius: C.rL, border: `1px solid ${selected ? "rgba(34,197,94,0.3)" : C.b1}`,
                  cursor: "pointer", color: C.t1, textAlign: "start", fontSize: 14, fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {opt.label[lang] || opt.label.en}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Step 3: Results ───
  if (step === "results" && selectedCat) {
    const exercises = getDiagnosticExercises(selectedCat.id, answers);
    const showAggressionWarning = AGGRESSION_IDS.includes(selectedCat.id) &&
      Object.entries(AGGRESSION_ANSWERS).some(([k, v]) => answers[k] === v);

    // Find program info
    const recProg = programs.find(p => p.id === selectedCat.recommendedProgram);

    return (
      <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 40, animation: "fadeIn 0.3s ease" }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <button onClick={reset} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={16} /> {T("diagStartOver")}
          </button>
        </div>

        <div style={{ padding: "0 20px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "center" }}><Icon name={selectedCat.icon || "Stethoscope"} size={48} color={C.acc} /></div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, margin: 0, color: C.t1 }}>{T("diagYourPlan")}</h1>
            <p style={{ fontSize: 14, color: C.t2, marginTop: 6 }}>{selectedCat.name[lang] || selectedCat.name.en}</p>
            <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", fontSize: 12, fontWeight: 700, color: C.acc, marginTop: 10 }}>
              {selectedCat.timeEstimate[lang] || selectedCat.timeEstimate.en}
            </div>
          </div>

          {/* Professional Help Warning */}
          {showAggressionWarning && (
            <div style={{
              padding: "16px 18px", marginBottom: 16, background: "rgba(239,68,68,0.06)",
              borderRadius: C.rL, border: "1px solid rgba(239,68,68,0.2)",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <AlertTriangle size={20} color={C.danger} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.danger }}>{T("diagProWarningTitle")}</div>
                <p style={{ fontSize: 12, color: C.t2, margin: "6px 0 0", lineHeight: 1.6 }}>{T("diagProWarning")}</p>
              </div>
            </div>
          )}

          {/* Recommended Program */}
          {recProg && (
            <button
              onClick={() => nav("program", { program: recProg })}
              style={{
                width: "100%", padding: "16px 18px", marginBottom: 16,
                background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`,
                cursor: "pointer", color: C.t1, textAlign: "start",
                display: "flex", alignItems: "center", gap: 14,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: recProg.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={recProg.icon} size={22} color="#fff" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.acc, textTransform: "uppercase", letterSpacing: 1 }}>{T("diagRecommendedProgram")}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{recProg.name}</div>
              </div>
              <ChevronRight size={16} color={C.t3} />
            </button>
          )}

          {/* Exercises */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.t1, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 1 }}>{T("diagExercisesToStart")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {exercises.map(({ id, reason }) => {
                const done = completedExercises.includes(id);
                // Find exercise in programs
                let exercise = null, exProg = null, exLvl = null;
                for (const p of programs) {
                  for (const l of p.levels) {
                    const ex = l.exercises.find(e => e.id === id);
                    if (ex) { exercise = ex; exProg = p; exLvl = l; break; }
                  }
                  if (exercise) break;
                }
                if (!exercise) return null;

                return (
                  <div key={id} style={{
                    padding: "14px 16px", background: C.s1, borderRadius: C.rL,
                    border: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 12,
                  }}>
                    {done ? <CheckCircle2 size={16} color={C.acc} style={{ flexShrink: 0 }} /> : <Circle size={16} color={C.t3} style={{ flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{exercise.name}</div>
                      <div style={{ fontSize: 11, color: C.t3, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Icon name={exProg.icon} size={11} color={C.t3} /> {exProg.name}</div>
                      <div style={{ fontSize: 12, color: C.t2, marginTop: 4, lineHeight: 1.5 }}>{reason[lang] || reason.en}</div>
                    </div>
                    {!done && (
                      <button
                        onClick={() => nav("exercise", { exercise, level: exLvl, program: exProg })}
                        style={{
                          padding: "6px 14px", fontSize: 12, fontWeight: 800,
                          background: exProg.gradient || C.acc, color: "#fff",
                          border: "none", borderRadius: 8, cursor: "pointer", flexShrink: 0,
                        }}
                      >
                        {T("challengeGo")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tips */}
          <div style={{
            padding: "18px 20px", background: "rgba(245,158,11,0.06)",
            borderRadius: C.rL, border: "1px solid rgba(245,158,11,0.12)", marginBottom: 16,
          }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: C.amber, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>{T("diagQuickTips")}</h4>
            {selectedCat.quickTips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < selectedCat.quickTips.length - 1 ? 12 : 0, alignItems: "flex-start" }}>
                <span style={{ fontSize: 12, color: C.amber, flexShrink: 0, marginTop: 1 }}>•</span>
                <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.6 }}>{tip[lang] || tip.en}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <button
            onClick={reset}
            style={{
              width: "100%", padding: "18px", fontSize: 15, fontWeight: 700,
              background: C.s1, color: C.t1, border: `1px solid ${C.b1}`,
              borderRadius: 50, cursor: "pointer", marginBottom: 10,
            }}
          >
            {T("diagTryAnother")}
          </button>
          <button
            onClick={() => nav("home")}
            style={{
              width: "100%", padding: "18px", fontSize: 15, fontWeight: 700,
              background: C.acc, color: "#000", border: "none",
              borderRadius: 50, cursor: "pointer",
            }}
          >
            {T("diagBackToTraining")}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
