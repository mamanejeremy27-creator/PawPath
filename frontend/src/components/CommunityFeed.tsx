import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import { Lock, Handshake, ChevronRight, AlertTriangle, PawPrint } from "lucide-react";
import PostCard from "./PostCard.jsx";
import BottomNav from "./BottomNav.jsx";
import { cn } from "../lib/cn";

const PAGE_SIZE = 20;

export default function CommunityFeed() {
  const { nav, T, isAuthenticated } = useApp();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    async function load() {
      try {
        const result = await api.getPosts(1);
        if (cancelled) return;
        const data = result.posts || result || [];
        setPosts(data);
        setHasMore(data.length >= PAGE_SIZE);
        if (result.likedIds) setLikedIds(new Set(result.likedIds));
      } catch {
        if (!cancelled) { setError(true); setPosts([]); }
      }
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  // Load more
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || posts.length === 0) return;
    setLoadingMore(true);
    const page = Math.ceil(posts.length / PAGE_SIZE) + 1;
    try {
      const result = await api.getPosts(page);
      const data = result.posts || result || [];
      setPosts(prev => [...prev, ...data]);
      setHasMore(data.length >= PAGE_SIZE);
    } catch {}
    setLoadingMore(false);
  }, [loadingMore, hasMore, posts, user]);

  const handleLikeChange = useCallback((postId, liked) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (liked) next.add(postId);
      else next.delete(postId);
      return next;
    });
  }, []);

  const handleDelete = useCallback((postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg animate-[fadeIn_0.3s_ease]">
        <div className="p-5">
          <h1 className="font-display text-2xl font-extrabold mb-1 text-text">{T("community")}</h1>
          <p className="text-[13px] text-muted m-0">{T("communitySubtitle")}</p>
        </div>
        <div className="text-center py-16 px-5 text-muted">
          <Lock size={40} className="text-muted mb-3 mx-auto" />
          <div className="text-[15px] font-bold text-text">{T("lbSignIn")}</div>
        </div>
        <BottomNav active="community" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="px-5 pt-5 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold mb-1 text-text">{T("community")}</h1>
          <p className="text-[13px] text-muted m-0">{T("communitySubtitle")}</p>
        </div>
        <button
          onClick={() => nav("createPost")}
          className="px-[18px] py-2.5 rounded-full bg-training text-black border-none font-extrabold text-[13px] cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.25)]"
        >{T("createPost")}</button>
      </div>

      {/* Training Buddy Card */}
      {isAuthenticated && (
        <div className="px-5 pt-3.5">
          <button
            onClick={() => nav("buddyDashboard")}
            className="w-full px-5 py-4 bg-gradient-to-br from-training/[0.08] to-achieve/[0.08] border border-training/20 rounded-3xl cursor-pointer flex items-center gap-3.5 text-start"
          >
            <Handshake size={28} className="text-training" />
            <div className="flex-1">
              <div className="text-sm font-bold text-text">{T("buddySection")}</div>
              <div className="text-xs text-muted mt-0.5">{T("buddySectionSub")}</div>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-[3px] border-white/10 border-t-training rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-16 px-5 text-muted">
          <AlertTriangle size={32} className="text-muted mb-2 mx-auto" />
          <div className="text-sm font-semibold">{T("cmtUnavailable")}</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-16 px-5">
          <PawPrint size={48} className="text-muted mb-3 mx-auto" />
          <div className="text-base font-bold text-text">{T("noPosts")}</div>
          <div className="text-[13px] text-muted mt-1.5">{T("noPostsSub")}</div>
          <button
            onClick={() => nav("createPost")}
            className="mt-5 px-7 py-3.5 rounded-full bg-training text-black border-none font-extrabold text-sm cursor-pointer"
          >{T("createPost")}</button>
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 && (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              liked={likedIds.has(post.id)}
              onLikeChange={handleLikeChange}
              onDelete={handleDelete}
            />
          ))}

          {/* Load more */}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={cn(
                "py-3.5 rounded-2xl bg-surface border border-border text-muted font-bold text-[13px] text-center",
                loadingMore ? "cursor-default" : "cursor-pointer"
              )}
            >
              {loadingMore ? (
                <div className="w-5 h-5 border-2 border-white/10 border-t-training rounded-full animate-spin mx-auto" />
              ) : T("feedLoadMore")}
            </button>
          )}
        </div>
      )}

      <BottomNav active="community" />
    </div>
  );
}
