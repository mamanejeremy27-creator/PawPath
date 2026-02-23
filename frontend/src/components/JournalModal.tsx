import { useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { compressPhoto, compressPhotoToBlob, getPhotoCount, canAddPhotos, MAX_PHOTOS } from "../utils/photoCompressor.js";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import { X, Camera, ImageIcon, AlertTriangle } from "lucide-react";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", warn: "#F59E0B", r: 16 };
const sectionLabel = (text) => <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{text}</div>;

export default function JournalModal() {
  const { showJournalEntry, journalForm, setJournalForm, finalizeComplete, journal, T, activeDogId } = useApp();
  const { user } = useAuth();
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadWarning, setUploadWarning] = useState(null); // "storage_failed" | null

  if (!showJournalEntry) return null;

  const photos = journalForm.photos || [];
  const totalPhotos = getPhotoCount(journal);
  const atCapacity = !canAddPhotos(journal, 1);
  const nearCapacity = totalPhotos >= MAX_PHOTOS * 0.8;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photos.length >= 3 || !canAddPhotos(journal, photos.length + 1)) return;
    setUploadWarning(null);
    setUploading(true);

    try {
      if (user) {
        // Authenticated: Upload to backend, fall back to base64
        let photoValue;
        try {
          const blob = await compressPhotoToBlob(file);
          const path = await api.uploadDogPhoto(activeDogId, blob);
          photoValue = path; // Storage path like "uuid/dog_1/123.jpg"
          setUploadWarning(null); // Clear any previous warning on success
        } catch (storageErr) {
          console.warn("[PawPath] Upload failed, falling back to base64:", storageErr?.message || storageErr);
          // FALLBACK: compress to base64 data URL instead
          const dataUrl = await compressPhoto(file);
          photoValue = dataUrl; // data:image/jpeg;base64,...
          setUploadWarning("storage_failed");
        }
        setJournalForm(f => ({ ...f, photos: [...(f.photos || []), photoValue] }));
      } else {
        // Not authenticated: compress to base64 for localStorage
        const dataUrl = await compressPhoto(file);
        setJournalForm(f => ({ ...f, photos: [...(f.photos || []), dataUrl] }));
      }
    } catch (err) {
      // Both Storage and base64 fallback failed — compression itself broke
      console.error("[PawPath] Photo processing completely failed:", err);
      setUploadWarning("storage_failed");
    } finally {
      setUploading(false);
    }
    e.target.value = "";
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
          <button onClick={() => finalizeComplete(true)} style={{ background: C.b1, border: "none", color: C.t3, width: 36, height: 36, borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
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
                  style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                  <X size={12} />
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
                  <Camera size={20} />
                  <span style={{ fontSize: 9, fontWeight: 600 }}>{T("camera")}</span>
                </button>
                <button onClick={() => galleryRef.current?.click()}
                  style={{ width: 72, height: 72, borderRadius: 12, background: C.bg, border: `1px dashed ${C.b2}`, color: C.t3, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
                  <ImageIcon size={20} />
                  <span style={{ fontSize: 9, fontWeight: 600 }}>{T("gallery")}</span>
                </button>
              </>
            )}
          </div>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          {uploadWarning === "storage_failed" && (
            <div style={{ padding: "8px 12px", background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.2)", borderRadius: 10, marginBottom: 8, fontSize: 12, color: "#EAB308", fontWeight: 600 }}>
              {T("photoSavedLocally")}
            </div>
          )}
          <div style={{ fontSize: 11, color: nearCapacity ? C.warn : C.t3, fontWeight: 600 }}>
            {nearCapacity && totalPhotos >= MAX_PHOTOS
              ? <><AlertTriangle size={14} style={{ display: "inline", verticalAlign: "middle", marginInlineEnd: 4 }} />{T("storageAlmostFull")}</>

              : `${totalPhotos + photos.length}/${MAX_PHOTOS} ${T("photosStored")}`
            }
          </div>
        </div>

        {sectionLabel(T("notesOptional"))}
        <textarea value={journalForm.note} onChange={e => setJournalForm(f => ({ ...f, note: e.target.value }))}
          placeholder={T("notesPlaceholder")} rows={3}
          style={{ width: "100%", padding: "14px 16px", fontSize: 14, background: C.bg, border: `1px solid ${C.b2}`, borderRadius: C.r, color: C.t1, outline: "none", lineHeight: 1.6, resize: "none" }} />

        <button onClick={() => finalizeComplete(false)}
          style={{ width: "100%", padding: "18px", marginTop: 20, fontSize: 16, fontWeight: 800, background: uploading ? C.acc : C.acc, color: "#000", border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 8px 32px rgba(34,197,94,0.25)", opacity: uploading ? 0.7 : 1 }}>
          {T("saveComplete")}
        </button>
      </div>
    </div>
  );
}
