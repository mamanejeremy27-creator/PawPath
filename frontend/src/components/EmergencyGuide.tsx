import { useApp } from "../context/AppContext.jsx";
import { EMERGENCY_GUIDES, SEVERITY_ORDER } from "../data/emergencyGuide.js";
import { ArrowLeft, ArrowRight, Phone, Hospital, ChevronRight } from "lucide-react";
import Icon from "./ui/Icon.jsx";
import { cn } from "../lib/cn";

const SEV_COLORS = { critical: "#EF4444", moderate: "#F59E0B", low: "#22C55E" };
const SEV_KEYS = { critical: "severityCritical", moderate: "severityModerate", low: "severityLow" };

// Background class per severity for the icon container
const SEV_ICON_BG: Record<string, string> = {
  critical: "bg-danger/10",
  moderate: "bg-xp/10",
  low: "bg-training/10",
};

export default function EmergencyGuide() {
  const { nav, T, lang, rtl } = useApp();

  const grouped: Record<string, typeof EMERGENCY_GUIDES> = {};
  for (const s of SEVERITY_ORDER) grouped[s] = [];
  EMERGENCY_GUIDES.forEach(em => grouped[em.severity]?.push(em));

  return (
    <div className="min-h-screen pb-10 bg-bg [animation:fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("home")}
          className="bg-transparent border-none text-danger text-[14px] font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("home")}
        </button>
        <h2 className="font-display text-[28px] font-extrabold m-0 text-text">{T("emergencyGuide")}</h2>
        <p className="text-[14px] text-muted mt-1">{T("emergencySubtitle")}</p>
      </div>

      {/* Call Vet Button */}
      <div className="px-5 pb-2">
        <button
          onClick={() => nav("vetDirectory")}
          className="w-full py-4 rounded-3xl border-none cursor-pointer text-white text-base font-extrabold flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
          style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)" }}
        >
          <Phone size={20} /> {T("callVetNow")}
        </button>
      </div>

      {/* Vet Directory Link */}
      <div className="px-5 pb-1">
        <button
          onClick={() => nav("vetDirectory")}
          className="w-full py-3.5 rounded-2xl cursor-pointer bg-danger/[0.06] border border-danger/[0.15] text-text text-[14px] font-bold flex items-center justify-center gap-2"
        >
          <Hospital size={16} /> {T("emergencyVetDirectory")}
        </button>
      </div>

      {/* Severity-Grouped List */}
      <div className="px-5 pt-3">
        {SEVERITY_ORDER.map(sev => {
          const items = grouped[sev];
          if (!items || items.length === 0) return null;
          const sevColor = SEV_COLORS[sev];
          return (
            <div key={sev} className="mb-5">
              <div
                className="text-[11px] font-bold tracking-[2px] uppercase mb-2.5"
                style={{ color: sevColor }}
              >
                {T(SEV_KEYS[sev])}
              </div>
              <div className="flex flex-col gap-2">
                {items.map((em, idx) => (
                  <button
                    key={em.id}
                    onClick={() => nav("emergencyDetail", { emergency: em })}
                    className="flex items-center gap-3.5 px-[18px] py-4 bg-surface rounded-3xl border border-border cursor-pointer text-text text-start w-full"
                    style={{ animation: `fadeIn 0.3s ease ${idx * 0.04}s both` }}
                  >
                    <div className={cn("w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] flex-shrink-0", SEV_ICON_BG[sev])}>
                      <Icon name={(em.icon || "AlertTriangle") as any} size={24} color={sevColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold">{em.name[lang]}</span>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sevColor }} />
                      </div>
                      <div className="text-[12px] text-muted mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {em.description[lang]}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
