import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
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

const CATEGORY_COLORS = {
  essential: "#22C55E",
  training: "#3B82F6",
  enrichment: "#A855F7",
};

export default function GearShop() {
  const { showGear, setShowGear, T, rtl, gear: gearData } = useApp();
  const [gearCat, setGearCat] = useState("all");
  if (!showGear) return null;

  const cats = ["all", "essential", "training", "enrichment"];
  const catLabels = { all: T("all"), essential: T("essential"), training: T("training"), enrichment: T("enrichment") };
  const items = gearCat === "all" ? gearData : gearData.filter(g => g.category === gearCat);

  return (
    <div className="fixed inset-0 z-[300] bg-bg overflow-y-auto [animation:slideUp_0.3s_ease]">
      <div className="px-5 pt-6 pb-4 flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-extrabold m-0 text-text">{T("trainingGear")}</h2>
          <p className="text-[13px] text-muted mt-1">{T("toolsMakeEasier")}</p>
        </div>
        <button
          onClick={() => setShowGear(false)}
          className="bg-surface border border-border text-text w-[38px] h-[38px] rounded-[10px] cursor-pointer flex items-center justify-center"
        >
          <Icon name="X" size={18} color="#F5F5F7" />
        </button>
      </div>

      <div className="flex gap-2 px-5 pb-3.5">
        {cats.map(c => (
          <button
            key={c}
            onClick={() => setGearCat(c)}
            className={cn(
              "px-4 py-[7px] text-[13px] font-semibold rounded-full cursor-pointer border transition-all",
              gearCat === c
                ? "bg-training text-black border-training"
                : "bg-surface text-text-2 border-border"
            )}
          >
            {catLabels[c]}
          </button>
        ))}
      </div>

      <div className="px-5 pb-10">
        {items.map((g, i) => (
          <div
            key={g.id}
            className="px-5 py-[18px] bg-surface rounded-3xl border border-border mb-2"
            style={{ animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}
          >
            <div className="flex gap-3">
              <Icon
                name={GEAR_ICONS[g.id] || "ShoppingBag"}
                size={24}
                color={CATEGORY_COLORS[g.category] || "#22C55E"}
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-[15px] font-bold text-text">{g.name}</div>
                  <div dir="ltr" className="text-[13px] font-bold text-training [unicode-bidi:embed]">{g.price}</div>
                </div>
                <p className="text-[13px] text-text-2 mt-1.5 leading-relaxed">{g.description}</p>
                <p className="text-[12px] text-muted mt-1.5 leading-normal italic">{g.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
