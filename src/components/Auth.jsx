import { useState, useMemo } from "react";
import { supabase } from "../lib/supabase.js";
import { useApp } from "../context/AppContext.jsx";
import { hasLocalData } from "../lib/migrate.js";

const C = {
  bg: "#0A0A0C", s1: "#131316", s2: "#1A1A1F",
  b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)",
  t1: "#F5F5F7", t3: "#71717A",
  acc: "#22C55E", danger: "#EF4444", r: 16,
};

export default function Auth() {
  const { lang, setLang, rtl, T } = useApp();
  const showMigrateBanner = useMemo(() => hasLocalData(), []);

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === "signup";

  const handleOAuth = async (provider) => {
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
  };

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

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage(T("authCheckEmail"));
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
    }

    setSubmitting(false);
  };

  const inputStyle = {
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

        {/* Local data migration prompt */}
        {showMigrateBanner && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", marginBottom: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 16 }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{"\uD83D\uDC3E"}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.acc, lineHeight: 1.5 }}>{T("authMigratePrompt")}</span>
          </div>
        )}

        {/* OAuth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <button onClick={() => handleOAuth("google")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "14px 20px", fontSize: 15, fontWeight: 600, background: "#fff", color: "#3c4043", border: "none", borderRadius: 50, cursor: "pointer", transition: "all 0.2s" }}>
            <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.04 24.04 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {T("continueWithGoogle")}
          </button>
          <button onClick={() => handleOAuth("facebook")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "14px 20px", fontSize: 15, fontWeight: 600, background: "#1877F2", color: "#fff", border: "none", borderRadius: 50, cursor: "pointer", transition: "all 0.2s" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            {T("continueWithFacebook")}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: C.b2 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 1 }}>{T("authOrEmail")}</span>
          <div style={{ flex: 1, height: 1, background: C.b2 }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              style={inputStyle}
            />
          </div>

          {isSignUp && (
            <div>
              {sectionLabel(T("authConfirmPassword"))}
              <input
                type="password" required value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
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
