import { useState } from "react";
import { Heart, MessageCircle, TrendingUp, Camera, Lightbulb, HelpCircle, Medal, MoreHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import CommentThread from "./CommentThread.jsx";
import { cn } from "../lib/cn";

const TYPE_META = {
  progress: { icon: TrendingUp, key: "postTypeProgress", color: "#22C55E" },
  photo: { icon: Camera, key: "postTypePhoto", color: "#3B82F6" },
  tip: { icon: Lightbulb, key: "postTypeTip", color: "#F59E0B" },
  question: { icon: HelpCircle, key: "postTypeQuestion", color: "#A78BFA" },
  milestone: { icon: Medal, key: "postTypeMilestone", color: "#FFD700" },
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

    try {
      await api.toggleLike(post.id);
      onLikeChange?.(post.id, newLiked);
    } catch {
      // Revert on error
      setIsLiked(!newLiked);
      setLikeCount(prev => newLiked ? Math.max(0, prev - 1) : prev + 1);
    }
    setLiking(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/community/posts/${post.id}`);
      onDelete?.(post.id);
    } catch { /* silent */ }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-surface rounded-3xl border border-border px-[18px] py-4 animate-[fadeIn_0.3s_ease] hover:border-social/30 transition-colors">
        {/* Header: avatar, name, type badge, time */}
        <div className="flex items-center gap-2.5 mb-3">
          {/* Avatar with dynamic gradient derived from meta.color — kept as style for runtime value */}
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-base font-extrabold shrink-0"
            style={{ background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`, color: meta.color }}
          >
            {(post.owner_name || "?")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-text">{post.owner_name || T("feedAnon")}</span>
              {/* Type badge: dynamic color retained as style */}
              <span
                className="px-2 py-px rounded-lg text-[10px] font-bold inline-flex items-center gap-0.5"
                style={{
                  background: `${meta.color}18`,
                  border: `1px solid ${meta.color}30`,
                  color: meta.color,
                }}
              >
                <meta.icon size={10} /> {T(meta.key)}
              </span>
            </div>
            <div className="text-[11px] text-muted mt-px">
              {post.dog_name}{post.breed ? ` \u00B7 ${post.breed}` : ""} \u00B7 {timeAgo(post.created_at, T)}
            </div>
          </div>
          {isOwn && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-transparent border-none text-muted cursor-pointer px-2 py-1 flex items-center"
            >
              <MoreHorizontal size={16} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className={cn("text-sm text-text leading-relaxed break-words", post.photo_url ? "mb-3" : "mb-0")}>
          {post.content}
        </div>

        {/* Photo */}
        {post.photo_url && (
          <div className="rounded-2xl overflow-hidden mb-3">
            <PhotoImg src={post.photo_url} className="w-full max-h-[300px] object-cover block" />
          </div>
        )}

        {/* Actions: like, comment */}
        <div className="flex items-center gap-1 mt-2 border-t border-border pt-2.5">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 bg-transparent border-none cursor-pointer px-3 py-1.5 rounded-full transition-all duration-150",
              isLiked ? "text-danger" : "text-muted"
            )}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-[13px] font-bold">{likeCount > 0 ? likeCount : ""}</span>
          </button>
          <button
            onClick={() => setShowComments(true)}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer px-3 py-1.5 rounded-full text-muted"
          >
            <MessageCircle size={16} />
            <span className="text-[13px] font-bold">{commentCount > 0 ? commentCount : ""}</span>
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[600] bg-black/60 flex items-center justify-center backdrop-blur-[8px]">
          <div className="bg-surface rounded-[20px] px-7 py-6 max-w-[320px] text-center">
            <div className="text-[15px] font-bold text-text mb-4">{T("deletePostConfirm")}</div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-border border-none text-text font-bold cursor-pointer text-sm"
              >{T("back")}</button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-danger border-none text-white font-bold cursor-pointer text-sm"
              >{T("deletePost")}</button>
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
