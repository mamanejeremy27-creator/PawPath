import { useRef, useState } from "react";
import { ArrowLeft, TrendingUp, Camera, Lightbulb, HelpCircle, Image, X } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { api } from "../lib/api.js";
import { compressPhotoToBlob } from "../utils/photoCompressor.js";
import PhotoImg from "./PhotoImg.jsx";
import { Card } from "./ui/Card";
import { cn } from "../lib/cn";

const POST_TYPES = [
  { id: "progress", icon: TrendingUp, key: "postTypeProgress" },
  { id: "photo", icon: Camera, key: "postTypePhoto" },
  { id: "tip", icon: Lightbulb, key: "postTypeTip" },
  { id: "question", icon: HelpCircle, key: "postTypeQuestion" },
];

export default function CreatePost() {
  const { nav, T, dogs, activeDogId } = useApp();
  const { user } = useAuth();
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const [postType, setPostType] = useState("progress");
  const [content, setContent] = useState("");
  const [photoPath, setPhotoPath] = useState(null);
  const [selectedDogId, setSelectedDogId] = useState(activeDogId);
  const [posting, setPosting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dogIds = Object.keys(dogs);
  const selectedDog = dogs[selectedDogId];
  const dogName = selectedDog?.profile?.name || "";
  const breed = selectedDog?.profile?.breed || "";
  const showPhotoUpload = postType === "photo" || postType === "progress";

  const [uploadError, setUploadError] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadError(false);
    try {
      setUploading(true);
      const blob = await compressPhotoToBlob(file);
      const path = await api.uploadDogPhoto(selectedDogId, blob);
      setPhotoPath(path);
    } catch (err) {
      console.error("Photo upload failed:", err);
      setUploadError(true);
    }
    finally { setUploading(false); }
    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!content.trim() || posting) return;
    setPosting(true);
    try {
      await api.createPost({
        dogId: selectedDogId,
        dogName,
        breed,
        postType,
        content: content.trim(),
        photoUrl: photoPath,
        badgeId: null,
      });
      nav("community");
    } catch { /* silent */ }
    setPosting(false);
  };

  const placeholder = T("postPlaceholder").replace("{dogName}", dogName);
  const canSubmit = content.trim() && !posting && !uploading;

  return (
    <div className="min-h-screen bg-bg animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="p-5 flex items-center gap-3.5">
        <button
          onClick={() => nav("community")}
          className="bg-border border-none text-text w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="font-display text-[22px] font-extrabold m-0 text-text">{T("createPost")}</h1>
      </div>

      <div className="px-5">
        {/* Post Type Selector */}
        <div className="flex gap-2 mb-5">
          {POST_TYPES.map(pt => (
            <button
              key={pt.id}
              onClick={() => setPostType(pt.id)}
              className={cn(
                "flex-1 py-2.5 px-1.5 rounded-xl cursor-pointer text-center transition-all duration-150 text-text border",
                postType === pt.id
                  ? "bg-training/[0.12] border-training/30"
                  : "bg-border border-transparent"
              )}
            >
              <div className="flex justify-center"><pt.icon size={18} /></div>
              <div className={cn("text-[10px] font-bold mt-0.5", postType === pt.id ? "text-training" : "text-muted")}>
                {T(pt.key)}
              </div>
            </button>
          ))}
        </div>

        {/* Dog Selector (if 2+ dogs) */}
        {dogIds.length > 1 && (
          <div className="mb-4">
            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2">{T("postSelectDog")}</div>
            <div className="flex gap-2">
              {dogIds.map(id => {
                const d = dogs[id];
                const isActive = id === selectedDogId;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedDogId(id)}
                    className={cn(
                      "flex-1 py-2.5 px-3.5 rounded-xl cursor-pointer text-text text-center border",
                      isActive
                        ? "bg-training/10 border-training/25"
                        : "bg-border border-transparent"
                    )}
                  >
                    <div className="text-sm font-bold">{d.profile?.name}</div>
                    <div className="text-[11px] text-muted mt-0.5">{d.profile?.breed}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Text Input */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="bg-surface-2 border border-border-2 rounded-2xl px-4 py-3 w-full text-text outline-none focus:border-social/50 resize-none text-[15px] leading-relaxed box-border transition-colors"
        />

        {/* Photo Upload */}
        {showPhotoUpload && (
          <div className="mt-4">
            <div className="text-[11px] font-bold text-muted tracking-[2px] uppercase mb-2.5">{T("postAddPhoto")}</div>
            <div className="flex gap-2 items-center">
              {photoPath && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <PhotoImg src={photoPath} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPhotoPath(null)}
                    className="absolute top-0.5 end-0.5 w-[22px] h-[22px] rounded-full bg-black/70 border-none text-white cursor-pointer flex items-center justify-center p-0"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {uploading && (
                <div className="w-20 h-20 rounded-xl bg-surface border border-dashed border-border-2 flex items-center justify-center shrink-0">
                  <div className="w-6 h-6 border-2 border-white/10 border-t-training rounded-full animate-spin" />
                </div>
              )}
              {!photoPath && !uploading && (
                <>
                  <button
                    onClick={() => cameraRef.current?.click()}
                    className="w-20 h-20 rounded-xl bg-surface border border-dashed border-border-2 text-muted cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0"
                  >
                    <Camera size={22} />
                    <span className="text-[10px] font-semibold">{T("camera")}</span>
                  </button>
                  <button
                    onClick={() => galleryRef.current?.click()}
                    className="w-20 h-20 rounded-xl bg-surface border border-dashed border-border-2 text-muted cursor-pointer flex flex-col items-center justify-center gap-1 shrink-0"
                  >
                    <Image size={22} />
                    <span className="text-[10px] font-semibold">{T("gallery")}</span>
                  </button>
                </>
              )}
            </div>
            {uploadError && (
              <div className="px-3 py-2 mt-2 bg-danger/10 border border-danger/25 rounded-xl text-xs text-danger font-semibold">
                {T("photoUploadFailed")}
              </div>
            )}
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
            <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>
        )}

        {/* Share Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            "w-full py-[18px] mt-6 text-base font-extrabold text-black border-none rounded-full transition-all",
            canSubmit
              ? "bg-training cursor-pointer shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
              : "bg-[#555] cursor-not-allowed shadow-none"
          )}
        >
          {posting ? T("postSharing") : T("postShare")}
        </button>
      </div>
    </div>
  );
}
