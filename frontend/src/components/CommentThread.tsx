import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import { X, MessageCircle } from "lucide-react";
import { cn } from "../lib/cn";

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
    <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl flex items-end justify-center">
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl flex flex-col max-h-[80vh] animate-[slideUp_0.3s_ease]">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex justify-between items-center border-b border-border shrink-0">
          <h3 className="text-base font-extrabold m-0 text-text">{T("comments")}</h3>
          <button
            onClick={onClose}
            className="bg-border border-none text-muted w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Comments List */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-3">
          {loading && (
            <div className="text-center p-8">
              <div className="w-7 h-7 border-2 border-white/10 border-t-training rounded-full animate-spin mx-auto" />
            </div>
          )}
          {!loading && comments.length === 0 && (
            <div className="text-center py-8 text-muted">
              <MessageCircle size={32} className="text-muted mb-2 mx-auto" />
              <div className="text-sm font-semibold">{T("cmtEmpty")}</div>
            </div>
          )}
          {comments.map(c => (
            <div key={c.id} className="mb-3.5">
              <div className="flex items-start gap-2.5">
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-training/20 to-health/20 flex items-center justify-center text-[13px] font-extrabold text-training shrink-0">
                  {(c.owner_name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-text">{c.owner_name || T("feedAnon")}</span>
                    <span className="text-[11px] text-muted">{timeAgo(c.created_at, T)}</span>
                  </div>
                  <div className="text-[13px] text-text-2 mt-0.5 leading-[1.5] break-words">{c.content}</div>
                </div>
                {user && c.user_id === user.id && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-transparent border-none text-muted text-[11px] cursor-pointer px-1.5 py-0.5 shrink-0"
                  >{T("deletePost")}</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 pt-3 pb-7 border-t border-border flex gap-2.5 shrink-0">
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={T("cmtPlaceholder")}
            className="flex-1 px-4 py-3 text-sm bg-bg border border-border-2 rounded-full text-text outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className={cn(
              "px-[18px] py-2.5 rounded-full border-none text-black font-extrabold text-[13px]",
              text.trim() && !sending
                ? "bg-training cursor-pointer"
                : "bg-[#555] cursor-not-allowed"
            )}
          >{sending ? "..." : T("postShare")}</button>
        </div>
      </div>
    </div>
  );
}
