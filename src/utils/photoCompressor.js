const SIZE = 200;
const QUALITY = 0.7;

export function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");

        // Cover-crop to square from center
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);

        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
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
