const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzbUAPeUyv3rUfmpz4NjBf5__YBuG81NotPpfkLY5HsUpG9Z0CEaAepS3s4X-AGDk-eZw/exec";

export async function submitFeedbackToSheet({ type, rating, message, dogName, language }) {
  const payload = {
    type: type === "general" ? "review" : type,
    rating: type === "rating" ? rating : undefined,
    message: message || "",
    dogName: dogName || "",
    appVersion: "1.2",
    language: language || "en",
  };

  await fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload),
  });
}
