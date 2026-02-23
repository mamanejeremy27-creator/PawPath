import { useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { compressPhoto, compressPhotoToBlob, getPhotoCount, canAddPhotos, MAX_PHOTOS } from "../utils/photoCompressor.js";
import { api } from "../lib/api.js";
import PhotoImg from "./PhotoImg.jsx";
import { X, Camera, ImageIcon, AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-3">{children}</div>
  );
}

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
    <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-xl flex items-end justify-center">
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl px-6 pt-7 pb-9 animate-[slideUp_0.3s_ease] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-[22px] font-extrabold m-0 text-text">{T("sessionNotes")}</h3>
          <button
            onClick={() => finalizeComplete(true)}
            className="bg-border border-none text-muted w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <SectionLabel>{T("howDidItGo")}</SectionLabel>
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setJournalForm(f => ({ ...f, rating: n }))}
              className={cn(
                "flex-1 py-2.5 rounded-xl cursor-pointer text-xl border transition-all duration-150",
                journalForm.rating >= n
                  ? "bg-training/[0.12] border-training/30"
                  : "bg-border border-transparent"
              )}
            >
              {n <= journalForm.rating ? "\u2B50" : "\u2606"}
            </button>
          ))}
        </div>

        <SectionLabel>{T("dogMood")}</SectionLabel>
        <div className="flex gap-1.5 mb-5">
          {moods.map(m => (
            <button
              key={m.id}
              onClick={() => setJournalForm(f => ({ ...f, mood: m.id }))}
              className={cn(
                "flex-1 py-2.5 px-1 rounded-xl cursor-pointer text-center border transition-all duration-150",
                journalForm.mood === m.id
                  ? "bg-training/10 border-training/25"
                  : "bg-border border-transparent"
              )}
            >
              <div className="text-[22px]">{m.emoji}</div>
              <div className="text-[10px] text-muted mt-0.5 font-semibold">{m.label}</div>
            </button>
          ))}
        </div>

        {/* Photo Section */}
        <SectionLabel>{T("addPhoto")}</SectionLabel>
        <div className="mb-5">
          <div className="flex gap-2 mb-2.5">
            {photos.map((src, i) => (
              <div key={i} className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden shrink-0">
                <PhotoImg src={src} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-0.5 end-0.5 w-[22px] h-[22px] rounded-full bg-black/70 border-none text-white cursor-pointer flex items-center justify-center p-0"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {uploading && (
              <div className="w-[72px] h-[72px] rounded-2xl bg-bg border border-dashed border-border-2 flex items-center justify-center shrink-0">
                <div className="w-6 h-6 border-2 border-white/10 border-t-training rounded-full animate-spin" />
              </div>
            )}
            {photos.length < 3 && !atCapacity && !uploading && (
              <>
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="w-[72px] h-[72px] rounded-2xl bg-bg border border-dashed border-border-2 text-muted cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0"
                >
                  <Camera size={20} />
                  <span className="text-[9px] font-semibold">{T("camera")}</span>
                </button>
                <button
                  onClick={() => galleryRef.current?.click()}
                  className="w-[72px] h-[72px] rounded-2xl bg-bg border border-dashed border-border-2 text-muted cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0"
                >
                  <ImageIcon size={20} />
                  <span className="text-[9px] font-semibold">{T("gallery")}</span>
                </button>
              </>
            )}
          </div>
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {uploadWarning === "storage_failed" && (
            <div className="px-3 py-2 bg-xp/[0.08] border border-xp/20 rounded-xl mb-2 text-xs text-xp font-semibold">
              {T("photoSavedLocally")}
            </div>
          )}
          <div className={cn("text-[11px] font-semibold", nearCapacity ? "text-xp" : "text-muted")}>
            {nearCapacity && totalPhotos >= MAX_PHOTOS
              ? (
                <>
                  <AlertTriangle size={14} className="inline align-middle me-1" />
                  {T("storageAlmostFull")}
                </>
              )
              : `${totalPhotos + photos.length}/${MAX_PHOTOS} ${T("photosStored")}`
            }
          </div>
        </div>

        <SectionLabel>{T("notesOptional")}</SectionLabel>
        <textarea
          value={journalForm.note}
          onChange={e => setJournalForm(f => ({ ...f, note: e.target.value }))}
          placeholder={T("notesPlaceholder")}
          rows={3}
          className="bg-surface-2 border border-border-2 rounded-2xl px-4 py-3 w-full text-text outline-none focus:border-training/50 resize-none text-sm leading-relaxed transition-colors"
        />

        <button
          onClick={() => finalizeComplete(false)}
          className={cn(
            "w-full py-[18px] mt-5 text-base font-extrabold text-black border-none rounded-full cursor-pointer shadow-[0_8px_32px_rgba(34,197,94,0.25)] bg-training transition-opacity",
            uploading ? "opacity-70" : "opacity-100"
          )}
        >
          {T("saveComplete")}
        </button>
      </div>
    </div>
  );
}
