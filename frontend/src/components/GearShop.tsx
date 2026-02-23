import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Icon from "./ui/Icon.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", rL: 24 };

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
const CATEGORY_COLORS = { essential: "#22C55E", training: "#3B82F6", enrichment: "#A855F7" };
const cardStyle = { padding: "18px 20px", background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}` };

export default function GearShop() {
  const { showGear, setShowGear, T, rtl, gear: gearData } = useApp();
  const [gearCat, setGearCat] = useState("all");
  if (!showGear) return null;

  const cats = ["all", "essential", "training", "enrichment"];
  const catLabels = { all: T("all"), essential: T("essential"), training: T("training"), enrichment: T("enrichment") };
  const items = gearCat === "all" ? gearData : gearData.filter(g => g.category === gearCat);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: C.bg, overflowY: "auto", animation: "slideUp 0.3s ease" }}>
      <div style={{ padding: "24px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: 0, color: C.t1 }}>{T("trainingGear")}</h2>
          <p style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>{T("toolsMakeEasier")}</p>
        </div>
        <button onClick={() => setShowGear(false)} style={{ background: C.s1, border: `1px solid ${C.b1}`, color: C.t1, width: 38, height: 38, borderRadius: 10, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="X" size={18} color={C.t1} /></button>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 20px 14px" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setGearCat(c)}
            style={{ padding: "7px 16px", fontSize: 13, fontWeight: 600, background: gearCat === c ? C.acc : C.s1, color: gearCat === c ? "#000" : C.t2, border: `1px solid ${gearCat === c ? C.acc : C.b1}`, borderRadius: 20, cursor: "pointer" }}>{catLabels[c]}</button>
        ))}
      </div>
      <div style={{ padding: "0 20px 40px" }}>
        {items.map((g, i) => (
          <div key={g.id} style={{ ...cardStyle, marginBottom: 8, animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Icon name={GEAR_ICONS[g.id] || "ShoppingBag"} size={24} color={CATEGORY_COLORS[g.category] || C.acc} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{g.name}</div>
                  <div dir="ltr" style={{ fontSize: 13, fontWeight: 700, color: C.acc, direction: "ltr", unicodeBidi: "embed" }}>{g.price}</div>
                </div>
                <p style={{ fontSize: 13, color: C.t2, marginTop: 6, lineHeight: 1.6 }}>{g.description}</p>
                <p style={{ fontSize: 12, color: C.t3, marginTop: 6, lineHeight: 1.5, fontStyle: "italic" }}>{g.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
