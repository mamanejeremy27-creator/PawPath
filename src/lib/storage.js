import { supabase } from "./supabase.js";

const BUCKET = "photos";
const SIGNED_URL_EXPIRY = 86400; // 24 hours

/**
 * Run full diagnostics on Supabase Storage.
 * Call from browser console: import('/src/lib/storage.js').then(m => m.diagnoseStorage())
 */
export async function diagnoseStorage() {
  const results = { auth: null, bucket: null, upload: null, cleanup: null };

  // 1. Auth check
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      results.auth = { ok: false, error: error.message };
    } else if (!data?.user) {
      results.auth = { ok: false, error: "No user session" };
    } else {
      results.auth = { ok: true, userId: data.user.id, email: data.user.email };
    }
  } catch (e) {
    results.auth = { ok: false, error: e.message };
  }
  console.log("[PawPath] Storage diagnostic — Auth:", results.auth);

  if (!results.auth.ok) {
    console.error("[PawPath] Storage diagnostic FAILED at auth. Cannot continue.");
    return results;
  }

  // 2. Bucket listing
  const userId = results.auth.userId;
  try {
    const { data, error } = await supabase.storage.from(BUCKET).list(userId, { limit: 1 });
    if (error) {
      results.bucket = { ok: false, error: error.message, statusCode: error.statusCode };
    } else {
      results.bucket = { ok: true, files: data.length, bucket: BUCKET };
    }
  } catch (e) {
    results.bucket = { ok: false, error: e.message };
  }
  console.log("[PawPath] Storage diagnostic — Bucket list:", results.bucket);

  // 3. Test upload — tiny 1x1 JPEG
  const testPath = `${userId}/_diag_${Date.now()}.jpg`;
  try {
    // Minimal valid JPEG (1x1 red pixel)
    const bytes = Uint8Array.from(atob(
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwA//9k="
    ), c => c.charCodeAt(0));
    const testBlob = new Blob([bytes], { type: "image/jpeg" });

    console.log("[PawPath] Storage diagnostic — Uploading test blob to:", testPath);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(testPath, testBlob, { contentType: "image/jpeg", upsert: false });

    if (error) {
      results.upload = {
        ok: false,
        path: testPath,
        error: error.message,
        statusCode: error.statusCode,
        hint: error.message.includes("Bucket not found") ? "The 'photos' bucket does not exist in Supabase Storage"
            : error.message.includes("security") || error.message.includes("policy") ? "RLS policy is blocking the upload — check that auth.uid()::text matches first path segment"
            : error.message.includes("row-level security") ? "RLS policy violation — path must start with user UUID: " + userId
            : "Unknown error",
      };
    } else {
      results.upload = { ok: true, path: data.path };
    }
  } catch (e) {
    results.upload = { ok: false, error: e.message };
  }
  console.log("[PawPath] Storage diagnostic — Upload:", results.upload);

  // 4. Cleanup test file
  if (results.upload?.ok) {
    try {
      await supabase.storage.from(BUCKET).remove([testPath]);
      results.cleanup = { ok: true };
    } catch (e) {
      results.cleanup = { ok: false, error: e.message };
    }
  }

  console.log("[PawPath] === STORAGE DIAGNOSTIC COMPLETE ===", results);
  return results;
}

/**
 * Upload a photo to Supabase Storage.
 * The path is always {auth.uid()}/{dogId}/{timestamp}.jpg
 * — the first folder MUST be the user's UUID for RLS to pass.
 * Returns the storage path on success.
 * Throws on failure — caller should catch and fall back to base64.
 */
export async function uploadPhoto(dogId, file) {
  // Always get the UUID from supabase.auth.getUser() — never trust caller
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.error("[PawPath] uploadPhoto: auth check failed:", authError);
    throw new Error("Not authenticated — cannot upload photo");
  }

  const uid = authData.user.id;
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${uid}/${dogId}/${Date.now()}.${ext}`;

  // Log everything right before upload
  console.log("[PawPath] uploadPhoto — PRE-UPLOAD DEBUG:", {
    userUUID: uid,
    path,
    bucket: BUCKET,
    fileType: file.type,
    fileSize: file.size,
    pathFirstFolder: path.split("/")[0],
    uuidMatch: path.split("/")[0] === uid,
  });

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    console.error("[PawPath] uploadPhoto — UPLOAD FAILED:", {
      message: error.message,
      statusCode: error.statusCode,
      name: error.name,
      path,
      userUUID: uid,
      bucket: BUCKET,
      error,
    });
    throw error;
  }

  console.log("[PawPath] uploadPhoto — SUCCESS:", data.path);
  return data.path;
}

/**
 * Delete a photo from Supabase Storage.
 */
export async function deletePhoto(path) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);
  if (error) throw error;
}

/**
 * Get a signed URL for a photo in Supabase Storage.
 */
export async function getPhotoUrl(path) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY);
  if (error) throw error;
  return data.signedUrl;
}
