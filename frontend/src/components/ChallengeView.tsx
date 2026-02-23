import { ArrowLeft, CheckCircle2, CircleDot, XCircle, Circle, Trophy, Zap, Home } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { useApp } from "../context/AppContext.jsx";
import { cn } from "../lib/cn";

export default function ChallengeView() {
  const { challengeData, completeChallengeDay, challengeCelebration, setChallengeCelebration, nav, T, lang, programs } = useApp();
  if (!challengeData?.challenge) return null;

  const { challenge, todayDay, completedDays, daysRemaining, progress, nextWeekChallenge } = challengeData;
  const accent = challenge.color; // runtime dynamic color — kept as style={}

  const findExercise = (exId) => {
    for (const p of programs) {
      for (const l of p.levels) {
        const ex = l.exercises.find(e => e.id === exId);
        if (ex) return { exercise: ex, level: l, program: p };
      }
    }
    return null;
  };

  // Celebration overlay
  if (challengeCelebration) {
    const cc = challengeCelebration;
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-center px-10 [animation:fadeIn_0.4s_ease]">
        <div className="mb-5 flex justify-center [animation:badgeDrop_0.6s_ease]">
          <Icon name={cc.challenge?.icon || "Trophy"} size={80} color="#22C55E" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-text m-0 mb-2">{T("challengeCompleteTitle")}</h1>
        <p className="text-[15px] text-text-2 m-0 mb-6 leading-relaxed">{T("challengeCompleteSub")}</p>

        <div className="px-7 py-4 bg-training/[0.08] rounded-3xl border border-training/20 mb-4 inline-flex items-center gap-2.5">
          <Icon name={cc.challenge?.icon || "Trophy"} size={24} color="#22C55E" />
          <span className="text-base font-extrabold text-training">
            {lang === "he" ? cc.challenge?.nameHe : cc.challenge?.name}
          </span>
        </div>

        <div className="text-xl font-extrabold mb-8 flex items-center justify-center gap-1.5" style={{ color: accent || "#22C55E" }}>
          +{cc.xp} XP <Zap size={20} />
        </div>

        {nextWeekChallenge && (
          <div className="px-5 py-3.5 bg-surface rounded-2xl border border-border mb-6">
            <div className="text-[11px] text-muted font-semibold uppercase tracking-[1.5px] mb-1.5">{T("nextWeekPreview")}</div>
            <div className="flex items-center gap-2">
              <Icon name={nextWeekChallenge.icon || "Trophy"} size={20} color="#F5F5F7" />
              <span className="text-sm font-bold text-text">
                {lang === "he" ? nextWeekChallenge.nameHe : nextWeekChallenge.name}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => { setChallengeCelebration(null); nav("home"); }}
          className="py-3.5 px-9 text-[15px] font-bold bg-training text-black border-none rounded-full cursor-pointer"
        >
          <span className="inline-flex items-center gap-1.5"><Home size={16} /> {T("home")}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10 bg-bg [animation:fadeIn_0.3s_ease]">
      {/* Back button */}
      <div className="px-5 pt-4">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-none text-muted text-sm font-semibold cursor-pointer p-0 flex items-center gap-1"
        >
          <ArrowLeft size={14} /> {T("back")}
        </button>
      </div>

      {/* Header */}
      <div className="text-center px-5 pt-5">
        <div className="flex justify-center mb-3">
          <Icon name={challenge.icon || "Trophy"} size={52} color={accent} />
        </div>
        <h1 className="font-display text-[26px] font-extrabold text-text m-0 mb-1.5">
          {lang === "he" ? challenge.nameHe : challenge.name}
        </h1>
        <p className="text-sm text-text-2 m-0 italic">
          "{lang === "he" ? challenge.descriptionHe : challenge.description}"
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-5">
        <div className="flex justify-between mb-2">
          <span className="text-[13px] font-bold text-text">{progress}/7</span>
          <span className="text-[13px] text-muted">{daysRemaining} {T("daysRemaining")}</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-[600ms]"
            style={{ width: `${(progress / 7) * 100}%`, background: accent }}
          />
        </div>
      </div>

      {/* Reward */}
      <div className="px-5 pt-3.5">
        <div
          className="flex items-center gap-2.5 px-[18px] py-3 rounded-2xl border"
          style={{ background: `${accent}0A`, borderColor: `${accent}20` }}
        >
          <Trophy size={18} color={accent} />
          <span className="text-[13px] text-text-2">
            {T("challengeReward")}:{" "}
            <span className="font-bold" style={{ color: accent }}>
              {lang === "he" ? challenge.nameHe : challenge.name}
            </span>{" "}
            badge + <span className="font-bold" style={{ color: accent }}>{challenge.bonusXP} XP</span>
          </span>
        </div>
      </div>

      {/* Day list */}
      <div className="px-5 pt-5 flex flex-col gap-1.5">
        {challenge.days.map((d) => {
          const done = completedDays.includes(d.day);
          const isToday = d.day === todayDay;
          const isPast = d.day < todayDay && !done;
          const isFuture = d.day > todayDay;
          const ref = findExercise(d.exerciseId);

          let StatusIcon, iconColor;
          if (done)       { StatusIcon = CheckCircle2; iconColor = "#22C55E"; }
          else if (isToday) { StatusIcon = CircleDot;   iconColor = accent;    }
          else if (isPast)  { StatusIcon = XCircle;     iconColor = "#EF4444"; }
          else              { StatusIcon = Circle;       iconColor = "#71717A"; }

          return (
            <div
              key={d.day}
              className={cn("flex items-center gap-3 rounded-2xl border", isToday ? "py-4 px-[18px]" : "py-3 px-[18px]")}
              style={{
                background: isToday ? `${accent}0A` : "#131316",
                borderColor: isToday ? `${accent}30` : "rgba(255,255,255,0.06)",
                ...(isToday && { boxShadow: `0 0 16px ${accent}15` }),
              }}
            >
              <span className="shrink-0 flex items-center">
                <StatusIcon size={16} color={iconColor} />
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={cn("text-[13px] font-bold", done ? "text-muted" : isToday ? "text-text" : isPast ? "text-danger" : "text-muted")}
                >
                  {T("challengeDay")} {d.day}
                </div>
                <div
                  className={cn("text-xs text-text-2 mt-0.5", done && "line-through opacity-60")}
                >
                  {lang === "he" ? d.taskHe : d.task}
                </div>
              </div>
              {isToday && !done && ref && (
                <button
                  onClick={(e) => { e.stopPropagation(); nav("exercise", { program: ref.program, level: ref.level, exercise: ref.exercise }); }}
                  className="py-2 px-[18px] text-[13px] font-extrabold text-black border-none rounded-[20px] cursor-pointer shrink-0"
                  style={{ background: accent }}
                >
                  {T("challengeGo")}
                </button>
              )}
              {isToday && !done && (
                <button
                  onClick={(e) => { e.stopPropagation(); completeChallengeDay(todayDay); }}
                  className="py-2 px-3.5 text-xs font-bold bg-transparent border rounded-[20px] cursor-pointer shrink-0"
                  style={{ color: accent, borderColor: `${accent}50` }}
                >
                  <CheckCircle2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
