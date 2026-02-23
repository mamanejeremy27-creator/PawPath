import { useApp } from "../context/AppContext.jsx";
import { COMMON_TOXINS, ISRAEL_SNAKES } from "../data/emergencyGuide.js";
import { ArrowLeft, ArrowRight, Phone, AlertTriangle, Hospital } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

const SEV_COLORS = { critical: "#EF4444", moderate: "#F59E0B", low: "#22C55E" };

export default function EmergencyDetail() {
  const { selEmergency, nav, T, lang, rtl } = useApp();
  if (!selEmergency) return null;

  const em = selEmergency;
  const sevColor = SEV_COLORS[em.severity];

  const sevBgClass = em.severity === "critical"
    ? "bg-danger/10"
    : em.severity === "moderate"
      ? "bg-xp/10"
      : "bg-training/10";

  return (
    <div className="min-h-screen pb-10 bg-bg [animation:fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("emergency")}
          className="bg-transparent border-none text-danger text-[14px] font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("emergencyGuide")}
        </button>
      </div>

      {/* Emoji + Title + Severity */}
      <div className="text-center px-5 pb-5">
        <div className="mb-3 flex justify-center">
          <Icon name={em.icon || "AlertTriangle"} size={48} color={sevColor} />
        </div>
        <h2 className="font-display text-[26px] font-black m-0 text-text">{em.name[lang]}</h2>
        <div
          className={cn("inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-1.5 rounded-lg text-[12px] font-bold", sevBgClass)}
          style={{ color: sevColor }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: sevColor }} />
          {T(em.severity === "critical" ? "severityCritical" : em.severity === "moderate" ? "severityModerate" : "severityLow")}
        </div>
      </div>

      {/* Description */}
      <div className="px-5">
        <p className="text-[15px] text-text-2 leading-[1.7] mb-4">{em.description[lang]}</p>
      </div>

      {/* Call Vet Button */}
      <div className="px-5 pb-4">
        <button
          onClick={() => nav("vetDirectory")}
          className="w-full py-3.5 rounded-3xl border-none cursor-pointer text-white text-[15px] font-extrabold flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
          style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}
        >
          <Phone size={18} /> {T("callVetNow")}
        </button>
      </div>

      {/* Steps */}
      <div className="px-5 pb-4">
        <div className="px-5 py-[18px] bg-surface rounded-3xl border border-border">
          <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{T("emergencySteps")}</div>
          {em.steps.map((s, i) => (
            <div key={i} className={cn("flex gap-3 items-start", i < em.steps.length - 1 ? "mb-4" : "")}>
              <div
                className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0 mt-px"
                style={{ background: `linear-gradient(135deg, ${sevColor}, ${sevColor}CC)` }}
              >
                {i + 1}
              </div>
              <p className="text-[14px] text-text-2 leading-[1.65] m-0">{s[lang]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Box */}
      <div className="px-5 pb-4">
        <div className="px-[18px] py-4 rounded-3xl bg-danger/[0.06] border border-danger/[0.15]">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-danger" />
            <span className="text-[12px] font-extrabold text-danger uppercase tracking-[1.5px]">{T("emergencyWarning")}</span>
          </div>
          <p className="text-[13px] text-text-2 leading-relaxed m-0">{em.warning[lang]}</p>
        </div>
      </div>

      {/* Extra Info */}
      {em.extraInfo && (
        <div className="px-5 pb-4">
          <div className="px-[18px] py-4 bg-surface rounded-3xl border border-border">
            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("emergencyExtraInfo")}</div>
            <p className="text-[13px] text-text-2 leading-relaxed m-0">{em.extraInfo[lang]}</p>
          </div>
        </div>
      )}

      {/* Conditional: Common Toxins for poisoning */}
      {em.id === "poisoning" && (
        <div className="px-5 pb-4">
          <div className="px-5 py-[18px] bg-surface rounded-3xl border border-border">
            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{T("commonToxins")}</div>
            <div className="flex flex-col gap-2.5">
              {COMMON_TOXINS.map((tox, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{tox.emoji}</span>
                  <div>
                    <div className="text-[14px] font-bold text-text">{tox.name[lang]}</div>
                    <div className="text-[12px] text-muted mt-0.5 leading-relaxed">{tox.note[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conditional: Israel Snakes for snake_bite */}
      {em.id === "snake_bite" && (
        <div className="px-5 pb-4">
          <div className="px-5 py-[18px] bg-surface rounded-3xl border border-border">
            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{T("israelSnakes")}</div>
            <div className="flex flex-col gap-3">
              {ISRAEL_SNAKES.map((snake, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">{snake.emoji}</span>
                  <div>
                    <div className="text-[14px] font-bold text-text">{snake.name[lang]}</div>
                    <div className="text-[12px] text-muted mt-0.5 leading-relaxed">{snake.description[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Vet Directory Button */}
      <div className="px-5">
        <button
          onClick={() => nav("vetDirectory")}
          className="w-full py-3.5 rounded-2xl cursor-pointer bg-danger/[0.06] border border-danger/[0.15] text-text text-[14px] font-bold flex items-center justify-center gap-2"
        >
          <Hospital size={16} /> {T("emergencyVetDirectory")}
        </button>
      </div>
    </div>
  );
}
