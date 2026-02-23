import { useApp } from "../context/AppContext.jsx";

export default function Splash() {
  const { setScreen, T } = useApp();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-bg relative overflow-hidden">
      {/* Atmospheric glows */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "-30%",
          insetInlineEnd: "-20%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: "-20%",
          insetInlineStart: "-20%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center" style={{ animation: "fadeInUp 0.8s ease" }}>
        <img
          src="/pawpath-logo.svg"
          alt="PawPath"
          className="mb-6 mx-auto"
          style={{ width: 220, filter: "drop-shadow(0 0 40px rgba(34,197,94,0.3))" }}
        />
        <p className="text-[14px] text-muted mt-3 tracking-[4px] uppercase font-medium">
          {T("tagline")}
        </p>
        <button
          onClick={() => setScreen("onboard")}
          className="mt-14 py-[18px] px-14 text-base font-bold bg-training text-black border-none rounded-full cursor-pointer"
          style={{ boxShadow: "0 8px 32px rgba(34,197,94,0.3)" }}
        >
          {T("getStarted")}
        </button>
      </div>
    </div>
  );
}
