import { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import { Lock, Handshake, ChevronRight, AlertTriangle, PawPrint } from "lucide-react";
import PostCard from "./PostCard.jsx";
import BottomNav from "./BottomNav.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

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
      <div style={{ minHeight: "100vh", background: C.bg, animation: "fadeIn 0.3s ease" }}>
        <div style={{ padding: "20px" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("community")}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{T("communitySubtitle")}</p>
        </div>
        <div style={{ textAlign: "center", padding: "60px 20px", color: C.t3 }}>
          <Lock size={40} color={C.t3} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{T("lbSignIn")}</div>
        </div>
        <BottomNav active="community" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 100, background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: C.t1 }}>{T("community")}</h1>
          <p style={{ fontSize: 13, color: C.t3, margin: 0 }}>{T("communitySubtitle")}</p>
        </div>
        <button
          onClick={() => nav("createPost")}
          style={{
            padding: "10px 18px", borderRadius: 50,
            background: C.acc, color: "#000", border: "none",
            fontWeight: 800, fontSize: 13, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(34,197,94,0.25)",
          }}
        >{T("createPost")}</button>
      </div>

      {/* Training Buddy Card */}
      {isAuthenticated && (
        <div style={{ padding: "14px 20px 0" }}>
          <button
            onClick={() => nav("buddyDashboard")}
            style={{
              width: "100%", padding: "16px 20px",
              background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(139,92,246,0.08))",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: C.rL, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14,
              textAlign: "start",
            }}
          >
            <Handshake size={28} color={C.acc} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{T("buddySection")}</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{T("buddySectionSub")}</div>
            </div>
            <ChevronRight size={16} color={C.t3} />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: C.t3 }}>
          <AlertTriangle size={32} color={C.t3} style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 14, fontWeight: 600 }}>{T("cmtUnavailable")}</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <PawPrint size={48} color={C.t3} style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{T("noPosts")}</div>
          <div style={{ fontSize: 13, color: C.t3, marginTop: 6 }}>{T("noPostsSub")}</div>
          <button
            onClick={() => nav("createPost")}
            style={{
              marginTop: 20, padding: "14px 28px", borderRadius: 50,
              background: C.acc, color: "#000", border: "none",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
            }}
          >{T("createPost")}</button>
        </div>
      )}

      {/* Posts */}
      {!loading && posts.length > 0 && (
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
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
              style={{
                padding: "14px", borderRadius: C.r,
                background: C.s1, border: `1px solid ${C.b1}`,
                color: C.t3, fontWeight: 700, fontSize: 13,
                cursor: loadingMore ? "default" : "pointer",
                textAlign: "center",
              }}
            >
              {loadingMore ? (
                <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
              ) : T("feedLoadMore")}
            </button>
          )}
        </div>
      )}

      <BottomNav active="community" />
    </div>
  );
}
