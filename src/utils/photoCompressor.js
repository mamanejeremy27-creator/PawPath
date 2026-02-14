const SIZE = 200;
const QUALITY = 0.7;

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function cropToCanvas(img) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  const min = Math.min(img.width, img.height);
  const sx = (img.width - min) / 2;
  const sy = (img.height - min) / 2;
  ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
  return canvas;
}

export async function compressPhoto(file) {
  const img = await loadImageFromFile(file);
  const canvas = cropToCanvas(img);
  return canvas.toDataURL("image/jpeg", QUALITY);
}

export async function compressPhotoToBlob(file) {
  const img = await loadImageFromFile(file);
  const canvas = cropToCanvas(img);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Failed to create blob")),
      "image/jpeg",
      QUALITY,
    );
  });
}

const MAX_PHOTOS = 100;

export function getPhotoCount(journal) {
  let count = 0;
  for (const entry of journal) {
    if (entry.photos) count += entry.photos.length;
  }
  return count;
}

export function canAddPhotos(journal, adding = 1) {
  return getPhotoCount(journal) + adding <= MAX_PHOTOS;
}

export { MAX_PHOTOS };
