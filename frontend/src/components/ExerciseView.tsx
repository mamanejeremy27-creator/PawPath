import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Timer from "./Timer.jsx";
import DifficultyCard from "./DifficultyCard.jsx";
import MoodCheck from "./MoodCheck.jsx";
import VoiceMode from "./VoiceMode.jsx";
import { Card } from "./ui/Card";
import { calculateFreshness, getFreshnessColor } from "../utils/freshness.js";
import { matchBreed, getBreedExerciseTip } from "../data/breedTraits.js";
import { ArrowLeft, ArrowRight, Clock, Lightbulb, Dog, Mic, PartyPopper } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

const GEAR_ICONS = {
  clicker: "Bell",
  treat_pouch: "ShoppingBag",
  high_value_treats: "UtensilsCrossed",
  long_line: "Link2",
  treat_mat: "LayoutGrid",
  target_stick: "WandSparkles",
  mat_bed: "BedDouble",
  puzzle_toy: "Brain",
  harness: "Link2",
  whistle: "Megaphone",
};

const HAS_SPEECH = typeof window !== "undefined" && "speechSynthesis" in window;

const SectionLabel = ({ text }: { text: string }) => (
  <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{text}</div>
);

export default function ExerciseView() {
  const {
    selExercise, selLevel, selProgram, completedExercises, journal,
    triggerComplete, nav, T, rtl, lang, gear: gearData,
    skillFreshness, incrementDifficultyField, moodCheck, dogProfile,
  } = useApp();
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
  const daysSince = freshData
    ? Math.floor((Date.now() - new Date(freshData.lastCompleted).getTime()) / 86400000)
    : null;
  const gear = (ex.gear || []).map(id => gearData.find(g => g.id === id)).filter(Boolean);
  const journalEntries = journal.filter(j => j.exerciseId === ex.id);

  return (
    <div className="min-h-screen bg-bg pb-32 animate-[fadeIn_0.3s_ease]">
      {/* Back nav */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("program", { exercise: null, level: null })}
          className="inline-flex items-center gap-1.5 bg-surface brut-border-sm px-3 py-1.5 rounded-xl text-sm font-semibold text-text cursor-pointer border-none mb-4"
        >
          {rtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />} {selProgram.name}
        </button>
      </div>

      <div className="px-5">
        {/* Program badge — gradient is dynamic */}
        <div
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white mb-3.5"
          style={{ background: selProgram.gradient }}
        >
          <Icon name={selProgram.icon} size={14} color="#fff" /> {selProgram.name}
        </div>

        <h2 className="font-display text-[26px] font-black m-0 text-text">{ex.name}</h2>

        <div className="flex gap-3.5 mt-2 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} /> {Math.floor(ex.duration / 60)} {T("min")}
          </span>
          <span style={{ color: selProgram.color }}>
            {"●".repeat(ex.difficulty)}{"○".repeat(4 - ex.difficulty)}
          </span>
        </div>

        {/* Freshness indicator */}
        {done && freshData && (
          <div className="flex items-center gap-1.5 mt-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: getFreshnessColor(calculateFreshness(freshData.lastCompleted, freshData.interval)) }}
            />
            <span className="text-xs text-muted">{T("lastPracticed")} {daysSince} {T("daysAgo")}</span>
          </div>
        )}

        <p className="text-[15px] text-text-2 mt-3.5 leading-[1.7]">{ex.description}</p>

        <Timer duration={ex.duration} />

        {/* Voice mode button */}
        {HAS_SPEECH && (
          <button
            onClick={() => setShowVoice(true)}
            className="w-full mt-3.5 px-4 py-4 text-[15px] font-bold bg-training/[0.08] text-training border border-training/20 rounded-full cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-200"
          >
            <Mic size={20} /> {T("voiceStart")}
          </button>
        )}

        {/* Steps */}
        <Card className="mt-5">
          <SectionLabel text={T("howToDoIt")} />
          {ex.steps.map((step, i) => (
            <div
              key={i}
              className={cn("flex gap-3 items-start", i < ex.steps.length - 1 && "mb-4")}
            >
              {/* Step number — gradient is dynamic */}
              <div
                className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 mt-[1px]"
                style={{ background: selProgram.gradient }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-text-2 leading-[1.65] m-0">{step}</p>
            </div>
          ))}
        </Card>

        {/* Pro Tip */}
        <div className="mt-3.5 p-[18px] bg-xp/[0.08] rounded-3xl brut-border-sm flex gap-3 items-start">
          <Lightbulb size={20} className="text-black shrink-0" />
          <div>
            <h4 className="text-xs font-extrabold m-0 text-black uppercase tracking-[1px]">{T("proTip")}</h4>
            <p className="text-[13px] text-text-2 mt-1.5 leading-relaxed">{ex.tips}</p>
          </div>
        </div>

        {/* Breed Tip */}
        {(() => {
          const breedData = matchBreed(dogProfile?.breed);
          const breedTip = breedData ? getBreedExerciseTip(breedData.id, ex.id, lang) : null;
          if (!breedTip) return null;
          return (
            <div className="mt-3.5 p-[18px] bg-xp/[0.05] rounded-3xl border border-xp/[0.12] flex gap-3 items-start">
              <Dog size={20} className="text-xp shrink-0" />
              <div>
                <h4 className="text-xs font-extrabold m-0 text-xp uppercase tracking-[1px]">
                  {T("breedTip")} — {breedData.name[lang] || breedData.name.en}
                </h4>
                <p className="text-[13px] text-text-2 mt-1.5 leading-relaxed">{breedTip}</p>
              </div>
            </div>
          );
        })()}

        {/* Gear */}
        {gear.length > 0 && (
          <Card className="mt-3.5">
            <h4 className="text-xs font-extrabold m-0 mb-3 text-xp uppercase tracking-[1px]">{T("recommendedGear")}</h4>
            {gear.map(g => (
              <div key={g.id} className="flex gap-2.5 mb-2.5 p-2.5 bg-white/[0.02] rounded-[10px]">
                <Icon name={GEAR_ICONS[g.id] || "ShoppingBag"} size={20} color="#F59E0B" />
                <div>
                  <div className="text-[13px] font-bold text-text">
                    {g.name}{" "}
                    <span className="text-muted font-medium">
                      · <span dir="ltr" style={{ direction: "ltr", unicodeBidi: "embed" }}>{g.price}</span>
                    </span>
                  </div>
                  <div className="text-xs text-muted mt-[3px] leading-snug">{g.tip}</div>
                </div>
              </div>
            ))}
          </Card>
        )}

        {/* Past journal entries */}
        {journalEntries.length > 0 && (
          <Card className="mt-3.5">
            <h4 className="text-xs font-extrabold m-0 mb-3 text-achieve uppercase tracking-[1px]">{T("yourPastNotes")}</h4>
            {journalEntries.slice(-3).map(j => (
              <div
                key={j.id}
                className="px-3 py-2.5 bg-white/[0.02] rounded-[10px] mb-2 border-s-[3px]"
                style={{ borderColor: selProgram.color }}
              >
                <div className="text-[11px] text-muted mb-1">
                  {new Date(j.date).toLocaleDateString(lang === "he" ? "he-IL" : "en-US", { month: "short", day: "numeric" })}
                  {" · "}{["😟","😐","🙂","😊","🤩"][j.rating - 1]} {j.rating}/5
                </div>
                <p className="text-[13px] text-text-2 m-0 leading-snug">{j.note}</p>
              </div>
            ))}
          </Card>
        )}

        {/* Difficulty Suggestion Card */}
        <DifficultyCard exerciseId={ex.id} program={selProgram} />

        {/* Program complete celebration (inline — only shows when all done) */}
        {done && allProgramDone && (
          <div className="mt-6 text-center py-4">
            <div><PartyPopper size={48} className="text-black" /></div>
            <div className="text-base font-black text-black mt-2 uppercase tracking-wide">{T("programComplete")}</div>
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-4 inset-x-0 px-4 z-20">
        <div className="max-w-[480px] mx-auto flex flex-col gap-2">
          {!done ? (
            <button
              onClick={() => { if (enteredRef.current) enteredRef.current.completed = true; triggerComplete(ex.id, selLevel.id, selProgram.id); }}
              className="w-full py-4 text-base font-extrabold bg-training text-black brut-border brut-shadow rounded-full cursor-pointer"
            >
              {T("markComplete")} ✓
            </button>
          ) : allProgramDone ? (
            <button
              onClick={() => nav("train")}
              className="w-full py-4 text-base font-extrabold bg-surface text-text brut-border brut-shadow rounded-full cursor-pointer"
            >
              {T("backToPrograms")}
            </button>
          ) : nextExInfo ? (
            <>
              <button
                onClick={() => nav("exercise", { exercise: nextExInfo.exercise, level: nextExInfo.level })}
                className="w-full py-4 text-base font-extrabold bg-training text-black brut-border brut-shadow rounded-full cursor-pointer"
              >
                {T("nextExercise")} →
              </button>
              <button
                onClick={() => { if (enteredRef.current) enteredRef.current.completed = true; triggerComplete(ex.id, selLevel.id, selProgram.id); }}
                className="w-full py-3 text-sm font-bold bg-surface text-text brut-border-sm rounded-full cursor-pointer"
              >
                {T("reviewRefresh")}
              </button>
            </>
          ) : (
            <button
              onClick={() => { if (enteredRef.current) enteredRef.current.completed = true; triggerComplete(ex.id, selLevel.id, selProgram.id); }}
              className="w-full py-4 text-base font-extrabold bg-surface text-text brut-border brut-shadow rounded-full cursor-pointer"
            >
              {T("reviewRefresh")}
            </button>
          )}
        </div>
      </div>

      <MoodCheck />
      {showVoice && (
        <VoiceMode
          exercise={ex}
          programName={selProgram.name}
          programIcon={selProgram.icon}
          lang={lang}
          rtl={rtl}
          T={T}
          onClose={() => setShowVoice(false)}
        />
      )}
    </div>
  );
}
