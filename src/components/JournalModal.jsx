import { useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { compressPhoto, compressPhotoToBlob, getPhotoCount, canAddPhotos, MAX_PHOTOS } from "../utils/photoCompressor.js";
import { uploadPhoto } from "../lib/storage.js";
import PhotoImg from "./PhotoImg.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", warn: "#F59E0B", r: 16 };
const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;

export default function JournalModal() {
  const { showJournalEntry, journalForm, setJournalForm, finalizeComplete, journal, T, activeDogId } = useApp();
  const { user } = useAuth();
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const lastFileRef = useRef(null);

  if (!showJournalEntry) return null;

  const photos = journalForm.photos || [];
  const totalPhotos = getPhotoCount(journal);
  const atCapacity = !canAddPhotos(journal, 1);
  const nearCapacity = totalPhotos >= MAX_PHOTOS * 0.8;

  const processFile = async (file) => {
    if (!file) return;
    if (photos.length >= 3 || !canAddPhotos(journal, photos.length + 1)) return;
    setUploadError(false);
    lastFileRef.current = file;
    try {
      if (user) {
        // Authenticated: compress to blob, upload to Supabase Storage, store path
        setUploading(true);
        console.log("[PawPath] Compressing photo:", { name: file.name, type: file.type, size: file.size });
        const blob = await compressPhotoToBlob(file);
        console.log("[PawPath] Compressed blob:", { type: blob.type, size: blob.size });
        const path = await uploadPhoto(user.id, activeDogId, blob);
        setJournalForm(f => ({ ...f, photos: [...(f.photos || []), path] }));
        lastFileRef.current = null;
      } else {
        // Not authenticated: compress to base64 for localStorage
        const dataUrl = await compressPhoto(file);
        setJournalForm(f => ({ ...f, photos: [...(f.photos || []), dataUrl] }));
        lastFileRef.current = null;
      }
    } catch (err) {
      console.error("[PawPath] Photo upload failed:", {
        message: err?.message,
        statusCode: err?.statusCode,
        name: err?.name,
        userId: user?.id,
        dogId: activeDogId,
        fileType: file?.type,
        fileSize: file?.size,
        error: err,
      });
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    await processFile(file);
    e.target.value = "";
  };

  const retryUpload = () => {
    if (lastFileRef.current) processFile(lastFileRef.current);
  };

  const removePhoto = (idx) => {
    setJournalForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));
  };

  const moods = [
    { id: "struggling", emoji: "\uD83D\uDE1F", label: T("moodStruggling") },
    { id: "okay", emoji: "\uD83D\uDE10", label: T("moodOkay") },
    { id: "happy", emoji: "\uD83D\uDE42", label: T("moodGood") },
    { id: "great", emoji: "\uD83D\uDE0A", label: T("moodGreat") },
    { id: "amazing", emoji: "\uD83E\uDD29", label: T("moodAmazing") },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, background: C.s1, borderRadius: "24px 24px 0 0", padding: "28px 24px 36px", animation: "slideUp 0.3s ease", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{T("sessionNotes")}</h3>
          <button onClick={() => finalizeComplete(true)} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {sectionLabel(T("howDidItGo"))}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setJournalForm(f => ({ ...f, rating: n }))}
              style={{ flex: 1, padding: "10px 0", background: journalForm.rating >= n ? "rgba(34,197,94,0.12)" : C.b1, border: `1px solid ${journalForm.rating >= n ? "rgba(34,197,94,0.3)" : "transparent"}`, borderRadius: 10, cursor: "pointer", fontSize: 20, transition: "all 0.15s" }}>
              {n <= journalForm.rating ? "\u2B50" : "\u2606"}
            </button>
          ))}
        </div>

        {sectionLabel(T("dogMood"))}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {moods.map(m => (
            <button key={m.id} onClick={() => setJournalForm(f => ({ ...f, mood: m.id }))}
              style={{ flex: 1, padding: "10px 4px", background: journalForm.mood === m.id ? "rgba(34,197,94,0.1)" : C.b1, border: `1px solid ${journalForm.mood === m.id ? "rgba(34,197,94,0.25)" : "transparent"}`, borderRadius: 10, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
              <div style={{ fontSize: 22 }}>{m.emoji}</div>
              <div style={{ fontSize: 10, color: C.t3, marginTop: 2, fontWeight: 600 }}>{m.label}</div>
            </button>
          ))}
        </div>

        {/* Photo Section */}
        {sectionLabel(T("addPhoto"))}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {photos.map((src, i) => (
              <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                <PhotoImg src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => removePhoto(i)}
                  style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  ✕
                </button>
              </div>
            ))}
            {uploading && (
              <div style={{ width: 72, height: 72, borderRadius: 12, background: C.bg, border: `1px dashed ${C.b2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 24, height: 24, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              </div>
            )}
            {photos.length < 3 && !atCapacity && !uploading && (
              <>
                <button onClick={() => cameraRef.current?.click()}
                  style={{ width: 72, height: 72, borderRadius: 12, background: C.bg, border: `1px dashed ${C.b2}`, color: C.t3, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 20 }}>{"\uD83D\uDCF7"}</span>
                  <span style={{ fontSize: 9, fontWeight: 600 }}>{T("camera")}</span>
                </button>
                <button onClick={() => galleryRef.current?.click()}
                  style={{ width: 72, height: 72, borderRadius: 12, background: C.bg, border: `1px dashed ${C.b2}`, color: C.t3, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 20 }}>{"\uD83D\uDDBC\uFE0F"}</span>
                  <span style={{ fontSize: 9, fontWeight: 600 }}>{T("gallery")}</span>
                </button>
              </>
            )}
          </div>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          {uploadError && (
            <div onClick={retryUpload} style={{ padding: "8px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, marginBottom: 8, fontSize: 12, color: "#EF4444", fontWeight: 600, cursor: "pointer" }}>
              {T("photoUploadFailed")}
            </div>
          )}
          <div style={{ fontSize: 11, color: nearCapacity ? C.warn : C.t3, fontWeight: 600 }}>
            {nearCapacity && totalPhotos >= MAX_PHOTOS
              ? `\u26A0\uFE0F ${T("storageAlmostFull")}`
              : `${totalPhotos + photos.length}/${MAX_PHOTOS} ${T("photosStored")}`
            }
          </div>
        </div>

        {sectionLabel(T("notesOptional"))}
        <textarea value={journalForm.note} onChange={e => setJournalForm(f => ({ ...f, note: e.target.value }))}
          placeholder={T("notesPlaceholder")} rows={3}
          style={{ width: "100%", padding: "14px 16px", fontSize: 14, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: C.r, color: C.t1, outline: "none", lineHeight: 1.6, resize: "none" }} />

        <button onClick={() => finalizeComplete(false)} disabled={uploading}
          style={{ width: "100%", padding: "18px", marginTop: 20, fontSize: 16, fontWeight: 800, background: uploading ? "#555" : C.acc, color: "#000", border: "none", borderRadius: 50, cursor: uploading ? "not-allowed" : "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)" }}>
          {uploading ? T("uploading") || "Uploading..." : T("saveComplete")}
        </button>
      </div>
    </div>
  );
}
