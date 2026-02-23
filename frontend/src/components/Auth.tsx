import { useState } from "react";
import type { CSSProperties } from "react";
import { useApp } from "../context/AppContext.jsx";
import { apiLogin, apiRegister } from "../lib/auth.js";

const C = {
  bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F",
  b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)",
  t1: "#F5F5F7", t3: "#71717A",
  acc: "#22C55E", danger: "#EF4444", r: 16,
};

export default function Auth() {
  const { lang, setLang, rtl, T } = useApp();

  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError(T("authPasswordTooShort"));
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError(T("authPasswordMismatch"));
      return;
    }

    setSubmitting(true);

    try {
      if (isSignUp) {
        await apiRegister(email, password, name);
      } else {
        await apiLogin(email, password);
      }
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }

    setSubmitting(false);
  };

  const inputStyle: CSSProperties = {
    width: "100%", padding: "16px 20px", fontSize: 16,
    background: C.s1, border: `1px solid ${C.b2}`, borderRadius: C.r,
    color: C.t1, outline: "none", boxSizing: "border-box",
  };

  const sectionLabel = (text) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
      {text}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, padding: "40px 24px", position: "relative", direction: rtl ? "rtl" : "ltr", textAlign: rtl ? "right" : "left" }}>
      {/* Language toggle */}
      <button onClick={() => setLang(lang === "en" ? "he" : "en")} style={{ position: "absolute", top: 20, insetInlineEnd: 20, zIndex: 3, background: C.s1, border: `1px solid ${C.b1}`, borderRadius: 10, padding: "6px 14px", color: C.t3, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        {lang === "en" ? "\u05E2\u05D1" : "EN"}
      </button>

      {/* Decorative gradients */}
      <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-20%", left: "-20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />

      <div style={{ zIndex: 2, width: "100%", maxWidth: 380, animation: "fadeIn 0.4s ease" }}>
        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <img src="/pawpath-logo.svg" alt="PawPath" style={{ width: 180, marginBottom: 16, filter: "drop-shadow(0 0 40px rgba(34,197,94,0.3))" }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, margin: "0 0 6px", color: C.t1 }}>{T("authWelcome")}</h1>
          <p style={{ fontSize: 14, color: C.t3, letterSpacing: 3, textTransform: "uppercase", fontWeight: 500, margin: 0 }}>{T("authSubtitle")}</p>
        </div>

        {/* Mode toggle tabs */}
        <div style={{ display: "flex", background: C.s1, borderRadius: 12, padding: 4, marginBottom: 28, border: `1px solid ${C.b1}` }}>
          {["signin", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null); }}
              style={{ flex: 1, padding: "12px", fontSize: 14, fontWeight: 700, background: mode === m ? C.acc : "transparent", color: mode === m ? "#000" : C.t3, border: "none", borderRadius: 10, cursor: "pointer", transition: "all 0.2s" }}>
              {m === "signin" ? T("signIn") : T("signUp")}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isSignUp && (
            <div>
              {sectionLabel(T("authName") || "Name")}
              <input
                type="text" required value={name}
                onChange={e => setName(e.target.value)}
                placeholder={T("authNamePlaceholder") || "Your name"}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            {sectionLabel(T("authEmail"))}
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            {sectionLabel(T("authPassword"))}
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
              style={inputStyle}
            />
          </div>

          {isSignUp && (
            <div>
              {sectionLabel(T("authConfirmPassword"))}
              <input
                type="password" required value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                style={inputStyle}
              />
            </div>
          )}

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: C.danger, fontSize: 13, fontWeight: 600 }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ padding: "12px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, color: C.acc, fontSize: 13, fontWeight: 600 }}>
              {message}
            </div>
          )}

          <button
            type="submit" disabled={submitting}
            style={{
              marginTop: 8, padding: "18px", fontSize: 16, fontWeight: 700,
              background: submitting ? C.s2 : C.acc,
              color: submitting ? C.t3 : "#000",
              border: "none", borderRadius: 50, cursor: submitting ? "default" : "pointer",
              boxShadow: submitting ? "none" : "0 8px 32px rgba(34,197,94,0.25)",
              transition: "all 0.2s",
            }}
          >
            {submitting ? "..." : (isSignUp ? T("signUp") : T("signIn"))}
          </button>
        </form>

        {/* Toggle link */}
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: C.t3 }}>
          {isSignUp ? T("authHasAccount") : T("authNoAccount")}{" "}
          <button onClick={() => { setMode(isSignUp ? "signin" : "signup"); setError(null); setMessage(null); }} style={{ background: "none", border: "none", color: C.acc, fontSize: 14, fontWeight: 700, cursor: "pointer", padding: 0 }}>
            {isSignUp ? T("signIn") : T("signUp")}
          </button>
        </p>
      </div>
    </div>
  );
}
