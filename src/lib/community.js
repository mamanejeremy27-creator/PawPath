import { supabase } from "./supabase.js";

// ── Helpers ──────────────────────────────────────────
function ok(data) { return { data, error: null }; }
function fail(error) { return { data: null, error: error?.message ?? String(error) }; }

async function getUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

async function getOwnerName() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "";
  const meta = user.user_metadata || {};
  return meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "");
}

// ══════════════════════════════════════════════════════
//  POSTS
// ══════════════════════════════════════════════════════

export async function getPosts(limit = 20, cursor = null) {
  try {
    let query = supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (cursor) query = query.lt("created_at", cursor);
    const { data, error } = await query;
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function createPost({ dogId, dogName, breed, postType, content, photoUrl, badgeId }) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const ownerName = await getOwnerName();
    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        user_id: userId,
        dog_id: dogId,
        dog_name: dogName || "",
        owner_name: ownerName,
        breed: breed || "",
        post_type: postType,
        content: content || "",
        photo_url: photoUrl || null,
        badge_id: badgeId || null,
      })
      .select()
      .single();
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function deletePost(postId) {
  try {
    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", postId);
    if (error) return fail(error);
    return ok(true);
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  LIKES
// ══════════════════════════════════════════════════════

export async function likePost(postId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { error: insertErr } = await supabase
      .from("community_likes")
      .insert({ user_id: userId, post_id: postId });
    if (insertErr) return fail(insertErr);
    // Update like_count via count query
    const { count, error: countErr } = await supabase
      .from("community_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    if (!countErr) {
      await supabase
        .from("community_posts")
        .update({ like_count: count })
        .eq("id", postId);
    }
    return ok(true);
  } catch (e) { return fail(e); }
}

export async function unlikePost(postId) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const { error: delErr } = await supabase
      .from("community_likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);
    if (delErr) return fail(delErr);
    // Update like_count via count query
    const { count, error: countErr } = await supabase
      .from("community_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    if (!countErr) {
      await supabase
        .from("community_posts")
        .update({ like_count: count })
        .eq("id", postId);
    }
    return ok(true);
  } catch (e) { return fail(e); }
}

export async function getUserLikes(postIds) {
  try {
    const userId = await getUserId();
    if (!userId) return ok([]);
    if (!postIds || postIds.length === 0) return ok([]);
    const { data, error } = await supabase
      .from("community_likes")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", postIds);
    if (error) return fail(error);
    return ok(data.map(r => r.post_id));
  } catch (e) { return fail(e); }
}

// ══════════════════════════════════════════════════════
//  COMMENTS
// ══════════════════════════════════════════════════════

export async function getComments(postId, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) return fail(error);
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function createComment(postId, content) {
  try {
    const userId = await getUserId();
    if (!userId) return fail("Not authenticated");
    const ownerName = await getOwnerName();
    const { data, error } = await supabase
      .from("community_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        owner_name: ownerName,
        content: content || "",
      })
      .select()
      .single();
    if (error) return fail(error);
    // Update comment_count via count query
    const { count, error: countErr } = await supabase
      .from("community_comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    if (!countErr) {
      await supabase
        .from("community_posts")
        .update({ comment_count: count })
        .eq("id", postId);
    }
    return ok(data);
  } catch (e) { return fail(e); }
}

export async function deleteComment(commentId) {
  try {
    // Fetch the comment first to get post_id
    const { data: comment, error: fetchErr } = await supabase
      .from("community_comments")
      .select("post_id")
      .eq("id", commentId)
      .single();
    if (fetchErr) return fail(fetchErr);
    const postId = comment.post_id;
    // Delete the comment
    const { error: delErr } = await supabase
      .from("community_comments")
      .delete()
      .eq("id", commentId);
    if (delErr) return fail(delErr);
    // Update comment_count
    const { count, error: countErr } = await supabase
      .from("community_comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    if (!countErr) {
      await supabase
        .from("community_posts")
        .update({ comment_count: count })
        .eq("id", postId);
    }
    return ok(true);
  } catch (e) { return fail(e); }
}
