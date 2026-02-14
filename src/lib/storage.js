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
  const ext = file.type === "image/png" ? "png" : "jpg";
  const path = `${userId}/${dogId}/${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw error;
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
