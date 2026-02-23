import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DIAGNOSTIC_CATEGORIES, getDiagnosticExercises } from "../data/diagnostic.js";
import { ArrowLeft, AlertTriangle, CheckCircle2, Circle, ChevronRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

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
      <div className="min-h-screen bg-bg pb-10 [animation:fadeIn_0.3s_ease]">
        <div className="px-5 pt-6 pb-4">
          <button
            onClick={() => nav("home")}
            className="bg-transparent border-none text-training text-[14px] font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> {T("home")}
          </button>
          <h1 className="font-display text-[26px] font-black m-0 text-text">{T("diagTitle")}</h1>
          <p className="text-[14px] text-text-2 mt-2 leading-relaxed">{T("diagSubtitle")}</p>
        </div>
        <div className="px-5 grid grid-cols-2 gap-2.5">
          {DIAGNOSTIC_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCat(cat); setStep("followUps"); setCurrentQ(0); setAnswers({}); }}
              className="px-3.5 py-5 bg-surface rounded-3xl border border-border cursor-pointer text-text text-center"
              style={{ animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}
            >
              <div className="mb-2 flex justify-center"><Icon name={(cat.icon || "Stethoscope") as any} size={32} color="#22C55E" /></div>
              <div className="text-[13px] font-bold leading-snug">{cat.name[lang] || cat.name.en}</div>
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
      <div className="min-h-screen bg-bg pb-10 [animation:fadeIn_0.3s_ease]">
        <div className="px-5 pt-6 pb-4">
          <button
            onClick={() => { if (currentQ > 0) { setCurrentQ(currentQ - 1); } else { reset(); } }}
            className="bg-transparent border-none text-training text-[14px] font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> {T("back")}
          </button>

          {/* Progress dots */}
          <div className="flex gap-1.5 mb-5">
            {questions.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-sm transition-colors duration-300"
                style={{ background: i <= currentQ ? "#22C55E" : "rgba(255,255,255,0.06)" }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2.5 mb-5">
            <Icon name={selectedCat.icon || "Stethoscope"} size={28} color="#22C55E" />
            <h2 className="font-display text-[22px] font-extrabold m-0 text-text">{q.question[lang] || q.question.en}</h2>
          </div>
        </div>

        <div className="px-5 flex flex-col gap-2.5">
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
                className={cn(
                  "px-5 py-[18px] rounded-3xl border cursor-pointer text-text text-start text-[14px] font-semibold transition-all",
                  selected ? "bg-training/[0.08] border-training/30" : "bg-surface border-border"
                )}
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
      <div className="min-h-screen bg-bg pb-10 [animation:fadeIn_0.3s_ease]">
        <div className="px-5 pt-6 pb-4">
          <button
            onClick={reset}
            className="bg-transparent border-none text-training text-[14px] font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> {T("diagStartOver")}
          </button>
        </div>

        <div className="px-5">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mb-2 flex justify-center"><Icon name={selectedCat.icon || "Stethoscope"} size={48} color="#22C55E" /></div>
            <h1 className="font-display text-2xl font-black m-0 text-text">{T("diagYourPlan")}</h1>
            <p className="text-[14px] text-text-2 mt-1.5">{selectedCat.name[lang] || selectedCat.name.en}</p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-training/[0.08] border border-training/20 text-[12px] font-bold text-training mt-2.5">
              {selectedCat.timeEstimate[lang] || selectedCat.timeEstimate.en}
            </div>
          </div>

          {/* Professional Help Warning */}
          {showAggressionWarning && (
            <div className="px-[18px] py-4 mb-4 bg-danger/[0.06] rounded-3xl border border-danger/20 flex gap-3 items-start">
              <AlertTriangle size={20} className="text-danger flex-shrink-0" />
              <div>
                <div className="text-[13px] font-extrabold text-danger">{T("diagProWarningTitle")}</div>
                <p className="text-[12px] text-text-2 mt-1.5 mb-0 leading-relaxed">{T("diagProWarning")}</p>
              </div>
            </div>
          )}

          {/* Recommended Program */}
          {recProg && (
            <button
              onClick={() => nav("program", { program: recProg })}
              className="w-full px-[18px] py-4 mb-4 bg-surface rounded-3xl border border-border cursor-pointer text-text text-start flex items-center gap-3.5"
            >
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ background: recProg.gradient }}>
                <Icon name={recProg.icon} size={22} color="#fff" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-training uppercase tracking-[1px]">{T("diagRecommendedProgram")}</div>
                <div className="text-[15px] font-bold mt-0.5">{recProg.name}</div>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>
          )}

          {/* Exercises */}
          <div className="mb-4">
            <h3 className="text-[14px] font-extrabold text-text mb-3 uppercase tracking-[1px]">{T("diagExercisesToStart")}</h3>
            <div className="flex flex-col gap-2">
              {exercises.map(({ id, reason }) => {
                const done = completedExercises.includes(id);
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
                  <div
                    key={id}
                    className="px-4 py-3.5 bg-surface rounded-3xl border border-border flex items-center gap-3"
                  >
                    {done
                      ? <CheckCircle2 size={16} className="text-training flex-shrink-0" />
                      : <Circle size={16} className="text-muted flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-text">{exercise.name}</div>
                      <div className="text-[11px] text-muted mt-0.5 flex items-center gap-1">
                        <Icon name={exProg.icon} size={11} color="#71717A" /> {exProg.name}
                      </div>
                      <div className="text-[12px] text-text-2 mt-1 leading-relaxed">{reason[lang] || reason.en}</div>
                    </div>
                    {!done && (
                      <button
                        onClick={() => nav("exercise", { exercise, level: exLvl, program: exProg })}
                        className="px-3.5 py-1.5 text-[12px] font-extrabold text-white border-none rounded-lg cursor-pointer flex-shrink-0"
                        style={{ background: exProg.gradient || "#22C55E" }}
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
          <div className="px-5 py-[18px] bg-xp/[0.06] rounded-3xl border border-xp/[0.12] mb-4">
            <h4 className="text-[12px] font-extrabold text-xp uppercase tracking-[1px] mb-3">{T("diagQuickTips")}</h4>
            {selectedCat.quickTips.map((tip, i) => (
              <div key={i} className={cn("flex gap-2.5 items-start", i < selectedCat.quickTips.length - 1 ? "mb-3" : "")}>
                <span className="text-[12px] text-xp flex-shrink-0 mt-px">•</span>
                <p className="text-[13px] text-text-2 m-0 leading-relaxed">{tip[lang] || tip.en}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <button
            onClick={reset}
            className="w-full py-[18px] text-[15px] font-bold bg-surface text-text border border-border rounded-full cursor-pointer mb-2.5"
          >
            {T("diagTryAnother")}
          </button>
          <button
            onClick={() => nav("home")}
            className="w-full py-[18px] text-[15px] font-bold bg-training text-black border-none rounded-full cursor-pointer"
          >
            {T("diagBackToTraining")}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
