import { useApp } from "../context/AppContext.jsx";

export default function LanguageToggle() {
  const { lang, setLang } = useApp();

  return (
    <button
      onClick={() => setLang(l => l === "en" ? "he" : "en")}
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#F5F5F7",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {lang === "en" ? "עב" : "EN"}
    </button>
  );
}
