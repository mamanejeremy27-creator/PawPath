import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import { X, MessageCircle } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16 };

function timeAgo(dateStr, T) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return T("feedJustNow");
  if (diff < 3600) return `${Math.floor(diff / 60)}${T("feedMinAgo")}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}${T("feedHrAgo")}`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}${T("feedDayAgo")}`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommentThread({ postId, onClose, onCountChange }) {
  const { T } = useApp();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getComments(postId).then(data => {
      if (cancelled) return;
      setComments(data || []);
      setLoading(false);
      setTimeout(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight), 50);
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [postId]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const data = await api.addComment(postId, { content: text.trim() });
      if (data) {
        setComments(prev => [...prev, data]);
        setText("");
        onCountChange?.(comments.length + 1);
        setTimeout(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight), 50);
      }
    } catch { /* silent */ }
    setSending(false);
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/community/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
      onCountChange?.(comments.length - 1);
    } catch { /* silent */ }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, background: C.s1, borderRadius: "24px 24px 0 0", display: "flex", flexDirection: "column", maxHeight: "80vh", animation: "slideUp 0.3s ease" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.b1}`, flexShrink: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: C.t1 }}>{T("comments")}</h3>
          <button onClick={onClose} style={{ background: C.b1, border: "none", color: C.t3, width: 32, height: 32, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} /></button>
        </div>

        {/* Comments List */}
        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          {loading && (
            <div style={{ textAlign: "center", padding: 32 }}>
              <div style={{ width: 28, height: 28, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            </div>
          )}
          {!loading && comments.length === 0 && (
            <div style={{ textAlign: "center", padding: "32px 0", color: C.t3 }}>
              <MessageCircle size={32} color={C.t3} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>{T("cmtEmpty")}</div>
            </div>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E33, #3B82F633)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: C.acc, flexShrink: 0 }}>
                  {(c.owner_name || "?")[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{c.owner_name || T("feedAnon")}</span>
                    <span style={{ fontSize: 11, color: C.t3 }}>{timeAgo(c.created_at, T)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.t2, marginTop: 3, lineHeight: 1.5, wordBreak: "break-word" }}>{c.content}</div>
                </div>
                {user && c.user_id === user.id && (
                  <button onClick={() => handleDelete(c.id)} style={{ background: "none", border: "none", color: C.t3, fontSize: 11, cursor: "pointer", padding: "2px 6px", flexShrink: 0 }}>{T("deletePost")}</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 20px 28px", borderTop: `1px solid ${C.b1}`, display: "flex", gap: 10, flexShrink: 0 }}>
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={T("cmtPlaceholder")}
            style={{ flex: 1, padding: "12px 16px", fontSize: 14, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: 50, color: C.t1, outline: "none" }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            style={{
              padding: "10px 18px", borderRadius: 50, border: "none",
              background: text.trim() && !sending ? C.acc : "#555",
              color: "#000", fontWeight: 800, fontSize: 13,
              cursor: text.trim() && !sending ? "pointer" : "not-allowed",
            }}
          >{sending ? "..." : T("postShare")}</button>
        </div>
      </div>
    </div>
  );
}
