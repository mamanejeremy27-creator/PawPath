import { useApp } from "../context/AppContext.jsx";
import { VET_DIRECTORY, POISON_CONTROL } from "../data/emergencyGuide.js";
import { ArrowLeft, ArrowRight, Phone, Ambulance } from "lucide-react";

export default function VetDirectory() {
  const { nav, T, lang, rtl } = useApp();

  return (
    <div className="min-h-screen pb-10 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <button
          onClick={() => nav("emergency")}
          className="bg-transparent border-none text-danger text-sm font-semibold cursor-pointer p-0 mb-4 flex items-center gap-1.5"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />} {T("emergencyGuide")}
        </button>
        <h2 className="font-display text-[28px] font-black m-0 text-text">{T("vetDirectory")}</h2>
        <p className="text-sm text-muted mt-1">{T("tapToCall")}</p>
      </div>

      {/* Poison Control */}
      <div className="px-5 pb-4">
        <div className="px-5 py-[18px] rounded-3xl bg-danger/[0.06] border border-danger/15">
          <div className="text-[11px] font-bold text-danger tracking-[2px] uppercase mb-3">{T("poisonControl")}</div>

          <div className="flex flex-col gap-2.5">
            {/* Poison Info Center */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-text">{POISON_CONTROL.name[lang]}</div>
              </div>
              <a
                href={`tel:${POISON_CONTROL.phone}`}
                className="px-4 py-2 rounded-[20px] no-underline bg-danger/15 text-danger text-sm font-black flex items-center gap-1.5"
              >
                <Phone size={14} /> {POISON_CONTROL.phone}
              </a>
            </div>

            {/* MDA Emergency */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-bold text-text">{POISON_CONTROL.emergency[lang]}</div>
              </div>
              <a
                href={`tel:${POISON_CONTROL.emergencyPhone}`}
                className="px-4 py-2 rounded-[20px] no-underline bg-danger/15 text-danger text-sm font-black flex items-center gap-1.5"
              >
                <Ambulance size={14} /> {POISON_CONTROL.emergencyPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Listings */}
      <div className="px-5">
        <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{T("byRegion")}</div>

        {VET_DIRECTORY.map((region, ri) => (
          <div key={ri} className="mb-4">
            <div className="text-sm font-black text-text mb-2">{region.region[lang]}</div>
            <div className="flex flex-col gap-2">
              {region.vets.map((vet, vi) => (
                <div
                  key={vi}
                  className="px-[18px] py-3.5 bg-surface rounded-3xl border border-border flex justify-between items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text">{vet.name[lang]}</div>
                    <div className="text-xs text-muted mt-0.5">{vet.hours[lang]}</div>
                  </div>
                  <a
                    href={`tel:${vet.phone}`}
                    className="px-4 py-2 rounded-[20px] no-underline bg-danger/10 text-danger text-[13px] font-black shrink-0 flex items-center gap-1.5"
                  >
                    <Phone size={13} /> {vet.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
