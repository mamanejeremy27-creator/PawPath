import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { likePost, unlikePost, deletePost } from "../lib/community.js";
import PhotoImg from "./PhotoImg.jsx";
import CommentThread from "./CommentThread.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t2: "#A1A1AA", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

const TYPE_META = {
  progress: { emoji: "\uD83D\uDCC8", key: "postTypeProgress", color: "#22C55E" },
  photo: { emoji: "\uD83D\uDCF8", key: "postTypePhoto", color: "#3B82F6" },
  tip: { emoji: "\uD83D\uDCA1", key: "postTypeTip", color: "#F59E0B" },
  question: { emoji: "\u2753", key: "postTypeQuestion", color: "#A78BFA" },
  milestone: { emoji: "\uD83C\uDFC5", key: "postTypeMilestone", color: "#FFD700" },
};

function timeAgo(dateStr, T) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return T("feedJustNow");
  if (diff < 3600) return `${Math.floor(diff / 60)}${T("feedMinAgo")}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}${T("feedHrAgo")}`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}${T("feedDayAgo")}`;
  return new Date(dateStr).toLocaleDateString();
}

export default function PostCard({ post, liked, onLikeChange, onDelete }) {
  const { T } = useApp();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const meta = TYPE_META[post.post_type] || TYPE_META.progress;
  const isOwn = user && post.user_id === user.id;

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    const newLiked = !isLiked;
    // Optimistic update
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));

    const res = newLiked ? await likePost(post.id) : await unlikePost(post.id);
    if (res.error) {
      // Revert on error
      setIsLiked(!newLiked);
      setLikeCount(prev => newLiked ? Math.max(0, prev - 1) : prev + 1);
    } else {
      onLikeChange?.(post.id, newLiked);
    }
    setLiking(false);
  };

  const handleDelete = async () => {
    const res = await deletePost(post.id);
    if (!res.error) onDelete?.(post.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div style={{ background: C.s1, borderRadius: C.rL, border: `1px solid ${C.b1}`, padding: "16px 18px", animation: "fadeIn 0.3s ease" }}>
        {/* Header: avatar, name, type badge, time */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: meta.color, flexShrink: 0 }}>
            {(post.owner_name || "?")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{post.owner_name || T("feedAnon")}</span>
              <span style={{ padding: "1px 8px", borderRadius: 8, background: `${meta.color}18`, border: `1px solid ${meta.color}30`, fontSize: 10, fontWeight: 700, color: meta.color }}>
                {meta.emoji} {T(meta.key)}
              </span>
            </div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 1 }}>
              {post.dog_name}{post.breed ? ` \u00B7 ${post.breed}` : ""} \u00B7 {timeAgo(post.created_at, T)}
            </div>
          </div>
          {isOwn && (
            <button onClick={() => setShowDeleteConfirm(true)} style={{ background: "none", border: "none", color: C.t3, fontSize: 16, cursor: "pointer", padding: "4px 8px" }}>{"\u22EF"}</button>
          )}
        </div>

        {/* Content */}
        <div style={{ fontSize: 14, color: C.t1, lineHeight: 1.6, marginBottom: post.photo_url ? 12 : 0, wordBreak: "break-word" }}>{post.content}</div>

        {/* Photo */}
        {post.photo_url && (
          <div style={{ borderRadius: C.r, overflow: "hidden", marginBottom: 12 }}>
            <PhotoImg src={post.photo_url} style={{ width: "100%", maxHeight: 300, objectFit: "cover", display: "block" }} />
          </div>
        )}

        {/* Actions: like, comment */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, borderTop: `1px solid ${C.b1}`, paddingTop: 10 }}>
          <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 20, color: isLiked ? "#EF4444" : C.t3, transition: "all 0.15s" }}>
            <span style={{ fontSize: 16 }}>{isLiked ? "\u2764\uFE0F" : "\uD83E\uDE76"}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{likeCount > 0 ? likeCount : ""}</span>
          </button>
          <button onClick={() => setShowComments(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 20, color: C.t3 }}>
            <span style={{ fontSize: 16 }}>{"\uD83D\uDCAC"}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{commentCount > 0 ? commentCount : ""}</span>
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <div style={{ background: C.s1, borderRadius: 20, padding: "24px 28px", maxWidth: 320, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 16 }}>{T("deletePostConfirm")}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, background: C.b1, border: "none", color: C.t1, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>{T("back")}</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: "12px", borderRadius: 12, background: "#EF4444", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>{T("deletePost")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Comment thread */}
      {showComments && (
        <CommentThread
          postId={post.id}
          onClose={() => setShowComments(false)}
          onCountChange={(newCount) => setCommentCount(newCount)}
        />
      )}
    </>
  );
}
