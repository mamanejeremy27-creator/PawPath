import { useApp } from "../context/AppContext.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", s3: "#222228", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", warn: "#F59E0B", danger: "#EF4444", r: 16 };
const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;

export default function RemindersModal() {
  const { showReminders, setShowReminders, reminders, setReminders, requestNotifPermission, T } = useApp();
  if (!showReminders) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, background: C.s1, borderRadius: "24px 24px 0 0", padding: "28px 24px 36px", animation: "slideUp 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{T("trainingReminders")}</h3>
          <button onClick={() => setShowReminders(false)} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${C.b1}`, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{T("enableReminders")}</div>
            <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{T("getNotified")}</div>
          </div>
          <button onClick={() => {
            if (!reminders.enabled && typeof Notification !== "undefined" && Notification.permission !== "granted") requestNotifPermission();
            setReminders(r => ({ ...r, enabled: !r.enabled }));
          }}
            style={{ width: 52, height: 30, borderRadius: 15, background: reminders.enabled ? C.acc : C.s3, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: "#fff", position: "absolute", top: 3, left: reminders.enabled ? 25 : 3, transition: "left 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
          </button>
        </div>

        {reminders.enabled && (
          <>
            {sectionLabel(T("reminderTimes"))}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {reminders.times.map((time, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>⏰</span>
                  <input type="time" value={time}
                    onChange={e => { const nt = [...reminders.times]; nt[idx] = e.target.value; setReminders(r => ({ ...r, times: nt })); }}
                    style={{ flex: 1, padding: "12px 16px", fontSize: 16, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: C.r, color: C.t1, outline: "none" }} />
                  {reminders.times.length > 1 && (
                    <button onClick={() => setReminders(r => ({ ...r, times: r.times.filter((_, i) => i !== idx) }))}
                      style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "none", color: C.danger, cursor: "pointer", fontSize: 14 }}>✕</button>
                  )}
                </div>
              ))}
            </div>
            {reminders.times.length < 4 && (
              <button onClick={() => setReminders(r => ({ ...r, times: [...r.times, "12:00"] }))}
                style={{ width: "100%", padding: "12px", background: C.b1, border: "none", borderRadius: C.r, color: C.acc, fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 16 }}>
                {T("addAnother")}
              </button>
            )}
            {typeof Notification !== "undefined" && Notification.permission !== "granted" && (
              <div style={{ padding: "14px 16px", background: "rgba(245,158,11,0.08)", borderRadius: C.r, border: "1px solid rgba(245,158,11,0.15)", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: C.warn, margin: 0, lineHeight: 1.5 }}>{T("notifWarning")} <button onClick={requestNotifPermission} style={{ background: "none", border: "none", color: C.acc, fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontSize: 13, padding: 0 }}>{T("enableNow")}</button></p>
              </div>
            )}
          </>
        )}

        <button onClick={() => setShowReminders(false)}
          style={{ width: "100%", padding: "16px", fontSize: 15, fontWeight: 700, background: C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer" }}>
          {T("save")}
        </button>
      </div>
    </div>
  );
}
