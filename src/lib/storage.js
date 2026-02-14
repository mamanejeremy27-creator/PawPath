import { supabase } from "./supabase.js";

const BUCKET = "photos";
const SIGNED_URL_EXPIRY = 86400; // 24 hours

/**
 * Upload a photo to Supabase Storage.
 * @param {string} userId - The authenticated user's ID
 * @param {string} dogId - The dog identifier
 * @param {Blob|File} file - The image file/blob to upload
 * @returns {Promise<string>} The storage path of the uploaded file
 */
export async function uploadPhoto(userId, dogId, file) {
  // Verify the user is authenticated before uploading (RLS requires valid session)
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.error("[PawPath] Photo upload auth check failed:", authError);
    throw new Error("Not authenticated — cannot upload photo");
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const contentType = file.type || "image/jpeg";
  const path = `${userId}/${dogId}/${Date.now()}.${ext}`;

  console.log("[PawPath] Uploading photo:", { path, contentType, size: file.size, bucket: BUCKET });

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: false });

  if (error) {
    console.error("[PawPath] Supabase storage upload error:", {
      message: error.message,
      statusCode: error.statusCode,
      name: error.name,
      error,
    });
    throw error;
  }

  console.log("[PawPath] Photo uploaded successfully:", data.path);
  return data.path;
}

/**
 * Delete a photo from Supabase Storage.
 * @param {string} path - The storage path to delete
 */
export async function deletePhoto(path) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);
  if (error) throw error;
}

/**
 * Get a signed URL for a photo in Supabase Storage.
 * @param {string} path - The storage path
 * @returns {Promise<string>} A signed URL valid for 24 hours
 */
export async function getPhotoUrl(path) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRY);
  if (error) throw error;
  return data.signedUrl;
}
