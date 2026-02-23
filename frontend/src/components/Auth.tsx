import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { apiLogin, apiRegister } from "../lib/auth.js";
import { MeshBackground } from "./ui/MeshBackground";
import { cn } from "../lib/cn";

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

  const sectionLabel = (text) => (
    <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{text}</div>
  );

  const inputClass =
    "bg-surface-2 border border-border-2 rounded-2xl px-5 py-4 w-full text-text text-base focus:border-training/50 outline-none transition-colors";

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-bg px-6 py-10"
      style={{ direction: rtl ? "rtl" : "ltr", textAlign: rtl ? "right" : "left" }}
    >
      <MeshBackground />

      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === "en" ? "he" : "en")}
        className="absolute top-5 end-5 z-10 bg-surface border border-border rounded-xl px-3.5 py-1.5 text-muted text-[13px] font-semibold cursor-pointer"
      >
        {lang === "en" ? "עב" : "EN"}
      </button>

      <div className="relative z-10 w-full max-w-[380px] [animation:fadeIn_0.4s_ease]">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/pawpath-logo.svg"
            alt="PawPath"
            className="w-[180px] mx-auto mb-4"
            style={{ filter: "drop-shadow(0 0 40px rgba(34,197,94,0.3))" }}
          />
          <h1 className="font-display text-[26px] font-black m-0 mb-1.5 text-text">
            {T("authWelcome")}
          </h1>
          <p className="text-sm text-muted tracking-[3px] uppercase font-medium m-0">
            {T("authSubtitle")}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="flex bg-surface-2 border border-border rounded-2xl p-1 mb-7">
          {["signin", "signup"].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setMessage(null); }}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-xl border-none cursor-pointer transition-all duration-200",
                mode === m ? "bg-training text-black" : "bg-transparent text-muted"
              )}
            >
              {m === "signin" ? T("signIn") : T("signUp")}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div>
              {sectionLabel(T("authName") || "Name")}
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={T("authNamePlaceholder") || "Your name"}
                className={inputClass}
              />
            </div>
          )}

          <div>
            {sectionLabel(T("authEmail"))}
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={inputClass}
            />
          </div>

          <div>
            {sectionLabel(T("authPassword"))}
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {isSignUp && (
            <div>
              {sectionLabel(T("authConfirmPassword"))}
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          )}

          {error && (
            <div className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-[13px] font-semibold">
              {error}
            </div>
          )}

          {message && (
            <div className="px-4 py-3 bg-training/10 border border-training/20 rounded-xl text-training text-[13px] font-semibold">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "mt-2 py-4 w-full text-base font-bold rounded-full border-none transition-all duration-200",
              submitting
                ? "bg-surface-2 text-muted cursor-default"
                : "bg-training text-black cursor-pointer"
            )}
            style={submitting ? undefined : { boxShadow: "0 8px 32px rgba(34,197,94,0.25)" }}
          >
            {submitting ? "..." : isSignUp ? T("signUp") : T("signIn")}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted">
          {isSignUp ? T("authHasAccount") : T("authNoAccount")}{" "}
          <button
            onClick={() => { setMode(isSignUp ? "signin" : "signup"); setError(null); setMessage(null); }}
            className="bg-transparent border-none text-training text-sm font-bold cursor-pointer p-0"
          >
            {isSignUp ? T("signIn") : T("signUp")}
          </button>
        </p>
      </div>
    </div>
  );
}
