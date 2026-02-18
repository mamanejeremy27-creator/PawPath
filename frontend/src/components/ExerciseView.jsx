import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Timer from "./Timer.jsx";
import DifficultyCard from "./DifficultyCard.jsx";
import MoodCheck from "./MoodCheck.jsx";
import VoiceMode from "./VoiceMode.jsx";
import { calculateFreshness, getFreshnessColor } from "../utils/freshness.js";
import { matchBreed, getBreedExerciseTip } from "../data/breedTraits.js";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", warn: "#F59E0B", rL: 24, r: 16 };
const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };
const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;

const HAS_SPEECH = typeof window !== "undefined" && "speechSynthesis" in window;

export default function ExerciseView() {
  const { selExercise, selLevel, selProgram, completedExercises, journal, triggerComplete, nav, T, rtl, lang, gear: gearData, skillFreshness, incrementDifficultyField, moodCheck, dogProfile } = useApp();
  const enteredRef = useRef(null);
  const [showVoice, setShowVoice] = useState(false);

  // Track incomplete sessions (user opens exercise, stays 10+ sec, leaves without completing)
  useEffect(() => {
    if (!selExercise) return;
    enteredRef.current = { exId: selExercise.id, time: Date.now(), completed: false };
    return () => {
      const entry = enteredRef.current;
      if (entry && entry.exId === selExercise.id && !entry.completed && Date.now() - entry.time > 10000) {
        incrementDifficultyField(entry.exId, "incompleteCount");
      }
      enteredRef.current = null;
    };
  }, [selExercise?.id]);

  if (!selExercise || !selLevel || !selProgram) return null;
  const ex = selExercise;
  const done = completedExercises.includes(ex.id);
  const allProgramDone = done && selProgram.levels.every(l => l.exercises.every(e => completedExercises.includes(e.id)));

  let nextExInfo = null;
  if (done && !allProgramDone) {
    for (let i = 0; i < selProgram.levels.length; i++) {
      const lvl = selProgram.levels[i];
      if (i > 0 && !selProgram.levels[i - 1].exercises.every(e => completedExercises.includes(e.id))) continue;
      for (const exercise of lvl.exercises) {
        if (!completedExercises.includes(exercise.id)) {
          nextExInfo = { exercise, level: lvl };
          break;
        }
      }
      if (nextExInfo) break;
    }
  }

  const freshData = skillFreshness[ex.id];
  const daysSince = freshData ? Math.floor((Date.now() - new Date(freshData.lastCompleted).getTime()) / 86400000) : null;
  const gear = (ex.gear || []).map(id => gearData.find(g => g.id === id)).filter(Boolean);
  const journalEntries = journal.filter(j => j.exerciseId === ex.id);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingBottom: 40, animation: "fadeIn 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <button onClick={() => nav("level", { exercise: null })} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 16 }}>{rtl ? "→" : "←"}</span> {selLevel.name}
        </button>
      </div>
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 8, background: selProgram.gradient, fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 14 }}>{selProgram.emoji} {selProgram.name}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, margin: 0, color: C.t1 }}>{ex.name}</h2>
        <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 13, color: C.t3 }}>
          <span>⏱ {Math.floor(ex.duration / 60)} {T("min")}</span>
          <span style={{ color: selProgram.color }}>{"●".repeat(ex.difficulty)}{"○".repeat(4 - ex.difficulty)}</span>
        </div>
        {done && freshData && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: getFreshnessColor(calculateFreshness(freshData.lastCompleted, freshData.interval)) }} />
            <span style={{ fontSize: 12, color: C.t3 }}>{T("lastPracticed")} {daysSince} {T("daysAgo")}</span>
          </div>
        )}
        <p style={{ fontSize: 15, color: C.t2, marginTop: 14, lineHeight: 1.7 }}>{ex.description}</p>

        <Timer duration={ex.duration} />

        {/* Voice Mode Button */}
        {HAS_SPEECH && (
          <button onClick={() => setShowVoice(true)}
            style={{ width: "100%", marginTop: 14, padding: "16px", fontSize: 15, fontWeight: 700, background: "rgba(34,197,94,0.08)", color: C.acc, border: "1px solid rgba(34,197,94,0.2)", borderRadius: 50, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s" }}>
            <span style={{ fontSize: 20 }}>{"\uD83C\uDF99\uFE0F"}</span> {T("voiceStart")}
          </button>
        )}

        {/* Steps */}
        <div style={{ marginTop: 20, ...cardStyle }}>
          {sectionLabel(T("howToDoIt"))}
          {ex.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < ex.steps.length - 1 ? 16 : 0, alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: selProgram.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <p style={{ fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div style={{ marginTop: 14, padding: "18px", background: "rgba(34,197,94,0.05)", borderRadius: C.rL, border: "1px solid rgba(34,197,94,0.1)", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 800, margin: 0, color: C.acc, textTransform: "uppercase", letterSpacing: 1 }}>{T("proTip")}</h4>
            <p style={{ fontSize: 13, color: C.t2, marginTop: 6, lineHeight: 1.6 }}>{ex.tips}</p>
          </div>
        </div>

        {/* Breed Tip */}
        {(() => {
          const breedData = matchBreed(dogProfile?.breed);
          const breedTip = breedData ? getBreedExerciseTip(breedData.id, ex.id, lang) : null;
          if (!breedTip) return null;
          return (
            <div style={{ marginTop: 14, padding: "18px", background: "rgba(245,158,11,0.05)", borderRadius: C.rL, border: "1px solid rgba(245,158,11,0.12)", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{"\uD83D\uDC36"}</span>
              <div>
                <h4 style={{ fontSize: 12, fontWeight: 800, margin: 0, color: C.warn, textTransform: "uppercase", letterSpacing: 1 }}>{T("breedTip")} — {breedData.name[lang] || breedData.name.en}</h4>
                <p style={{ fontSize: 13, color: C.t2, marginTop: 6, lineHeight: 1.6 }}>{breedTip}</p>
              </div>
            </div>
          );
        })()}

        {/* Gear */}
        {gear.length > 0 && (
          <div style={{ marginTop: 14, ...cardStyle }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 12px", color: C.warn, textTransform: "uppercase", letterSpacing: 1 }}>{T("recommendedGear")}</h4>
            {gear.map(g => (
              <div key={g.id} style={{ display: "flex", gap: 10, marginBottom: 10, padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>
                <span style={{ fontSize: 22 }}>{g.emoji}</span>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{g.name} <span style={{ color: C.t3, fontWeight: 500 }}>· <span dir="ltr" style={{ direction: "ltr", unicodeBidi: "embed" }}>{g.price}</span></span></div><div style={{ fontSize: 12, color: C.t3, marginTop: 3, lineHeight: 1.5 }}>{g.tip}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* Past journal entries */}
        {journalEntries.length > 0 && (
          <div style={{ marginTop: 14, ...cardStyle }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, margin: "0 0 12px", color: "#8B5CF6", textTransform: "uppercase", letterSpacing: 1 }}>{T("yourPastNotes")}</h4>
            {journalEntries.slice(-3).map(j => (
              <div key={j.id} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 10, marginBottom: 8, borderLeft: `3px solid ${selProgram.color}` }}>
                <div style={{ fontSize: 11, color: C.t3, marginBottom: 4 }}>{new Date(j.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" })} · {["😟","😐","🙂","😊","🤩"][j.rating - 1]} {j.rating}/5</div>
                <p style={{ fontSize: 13, color: C.t2, margin: 0, lineHeight: 1.5 }}>{j.note}</p>
              </div>
            ))}
          </div>
        )}

        {/* Difficulty Suggestion Card */}
        <DifficultyCard exerciseId={ex.id} program={selProgram} />

        {/* Complete */}
        {!done ? (
          <button onClick={() => { if (enteredRef.current) enteredRef.current.completed = true; triggerComplete(ex.id, selLevel.id, selProgram.id); }}
            style={{ width: "100%", padding: "20px", marginTop: 24, fontSize: 16, fontWeight: 800, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)" }}>
            {T("markComplete")}
          </button>
        ) : (
          <>
            <button onClick={() => { if (enteredRef.current) enteredRef.current.completed = true; triggerComplete(ex.id, selLevel.id, selProgram.id); }}
              style={{ width: "100%", padding: "20px", marginTop: 24, fontSize: 16, fontWeight: 800, background: "transparent", color: C.acc, border: `2px solid ${C.acc}`, borderRadius: 50, cursor: "pointer" }}>
              {T("reviewRefresh")}
            </button>

            <div style={{ marginTop: 16 }}>
              {allProgramDone ? (
                <>
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <div style={{ fontSize: 48 }}>{"\uD83C\uDF89"}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.acc, marginTop: 8 }}>{T("programComplete")}</div>
                  </div>
                  <button onClick={() => nav("home", { program: null, level: null, exercise: null })}
                    style={{ width: "100%", padding: "18px", fontSize: 15, fontWeight: 700, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                    {T("backToPrograms")}
                  </button>
                </>
              ) : nextExInfo && (
                <>
                  <button onClick={() => nav("exercise", { exercise: nextExInfo.exercise, level: nextExInfo.level })}
                    style={{ width: "100%", padding: "18px", fontSize: 15, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)" }}>
                    {T("nextExercise")}
                  </button>
                  <button onClick={() => nav("program", { level: null, exercise: null })}
                    style={{ width: "100%", padding: "18px", marginTop: 10, fontSize: 15, fontWeight: 700, background: C.s1, color: C.t1, border: `1px solid ${C.b1}`, borderRadius: 50, cursor: "pointer" }}>
                    {T("backToProgram")}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <MoodCheck />
      {showVoice && (
        <VoiceMode
          exercise={ex}
          programName={selProgram.name}
          programEmoji={selProgram.emoji}
          lang={lang}
          rtl={rtl}
          T={T}
          onClose={() => setShowVoice(false)}
        />
      )}
    </div>
  );
}
