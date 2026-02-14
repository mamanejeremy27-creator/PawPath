import { useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { createPost } from "../lib/community.js";
import { compressPhotoToBlob } from "../utils/photoCompressor.js";
import { uploadPhoto } from "../lib/storage.js";
import PhotoImg from "./PhotoImg.jsx";

const C = { bg: "#0A0A0C", s1: "#131316", b1: "rgba(255,255,255,0.06)", b2: "rgba(255,255,255,0.1)", t1: "#F5F5F7", t3: "#71717A", acc: "#22C55E", r: 16, rL: 24 };

const POST_TYPES = [
  { id: "progress", emoji: "\uD83D\uDCC8", key: "postTypeProgress" },
  { id: "photo", emoji: "\uD83D\uDCF8", key: "postTypePhoto" },
  { id: "tip", emoji: "\uD83D\uDCA1", key: "postTypeTip" },
  { id: "question", emoji: "\u2753", key: "postTypeQuestion" },
];

export default function CreatePost() {
  const { nav, T, dogs, activeDogId, getSupaId } = useApp();
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
      const path = await uploadPhoto(selectedDogId, blob);
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
    const supaId = getSupaId(selectedDogId);
    if (!supaId) return;
    setPosting(true);
    const result = await createPost({
      dogId: supaId,
      dogName,
      breed,
      postType,
      content: content.trim(),
      photoUrl: photoPath,
      badgeId: null,
    });
    setPosting(false);
    if (!result.error) {
      nav("community");
    }
  };

  const placeholder = T("postPlaceholder").replace("{dogName}", dogName);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => nav("community")} style={{ background: C.b1, border: "none", color: C.t1, width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 16 }}>{"\u2190"}</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, margin: 0, color: C.t1 }}>{T("createPost")}</h1>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Post Type Selector */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {POST_TYPES.map(pt => (
            <button key={pt.id} onClick={() => setPostType(pt.id)}
              style={{
                flex: 1, padding: "10px 6px",
                background: postType === pt.id ? "rgba(34,197,94,0.12)" : C.b1,
                border: `1px solid ${postType === pt.id ? "rgba(34,197,94,0.3)" : "transparent"}`,
                borderRadius: 12, cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                color: C.t1,
              }}>
              <div style={{ fontSize: 18 }}>{pt.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: postType === pt.id ? C.acc : C.t3, marginTop: 2 }}>{T(pt.key)}</div>
            </button>
          ))}
        </div>

        {/* Dog Selector (if 2 dogs) */}
        {dogIds.length > 1 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{T("postSelectDog")}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {dogIds.map(id => {
                const d = dogs[id];
                const isActive = id === selectedDogId;
                return (
                  <button key={id} onClick={() => setSelectedDogId(id)}
                    style={{
                      flex: 1, padding: "10px 14px",
                      background: isActive ? "rgba(34,197,94,0.1)" : C.b1,
                      border: `1px solid ${isActive ? "rgba(34,197,94,0.25)" : "transparent"}`,
                      borderRadius: 12, cursor: "pointer", color: C.t1, textAlign: "center",
                    }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{d.profile?.name}</div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{d.profile?.breed}</div>
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
          style={{
            width: "100%", padding: "16px", fontSize: 15,
            background: C.s1, border: `1px solid ${C.b2}`,
            borderRadius: C.r, color: C.t1, outline: "none",
            lineHeight: 1.6, resize: "none", boxSizing: "border-box",
          }}
        />

        {/* Photo Upload */}
        {showPhotoUpload && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{T("postAddPhoto")}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {photoPath && (
                <div style={{ position: "relative", width: 80, height: 80, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                  <PhotoImg src={photoPath} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => setPhotoPath(null)}
                    style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                    {"\u2715"}
                  </button>
                </div>
              )}
              {uploading && (
                <div style={{ width: 80, height: 80, borderRadius: 12, background: C.s1, border: `1px dashed ${C.b2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 24, height: 24, border: "2px solid rgba(255,255,255,0.1)", borderTopColor: C.acc, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                </div>
              )}
              {!photoPath && !uploading && (
                <>
                  <button onClick={() => cameraRef.current?.click()}
                    style={{ width: 80, height: 80, borderRadius: 12, background: C.s1, border: `1px dashed ${C.b2}`, color: C.t3, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 22 }}>{"\uD83D\uDCF7"}</span>
                    <span style={{ fontSize: 10, fontWeight: 600 }}>{T("camera")}</span>
                  </button>
                  <button onClick={() => galleryRef.current?.click()}
                    style={{ width: 80, height: 80, borderRadius: 12, background: C.s1, border: `1px dashed ${C.b2}`, color: C.t3, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 22 }}>{"\uD83D\uDDBC\uFE0F"}</span>
                    <span style={{ fontSize: 10, fontWeight: 600 }}>{T("gallery")}</span>
                  </button>
                </>
              )}
            </div>
            {uploadError && (
              <div style={{ padding: "8px 12px", marginTop: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, fontSize: 12, color: "#EF4444", fontWeight: 600 }}>
                {T("photoUploadFailed")}
              </div>
            )}
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
            <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>
        )}

        {/* Share Button */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || posting || uploading}
          style={{
            width: "100%", padding: "18px", marginTop: 24,
            fontSize: 16, fontWeight: 800,
            background: (!content.trim() || posting || uploading) ? "#555" : C.acc,
            color: "#000", border: "none", borderRadius: 50,
            cursor: (!content.trim() || posting || uploading) ? "not-allowed" : "pointer",
            boxShadow: content.trim() && !posting && !uploading ? "0 8px 32px rgba(34,197,94,0.25)" : "none",
          }}>
          {posting ? T("postSharing") : T("postShare")}
        </button>
      </div>
    </div>
  );
}
