const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwe6JLyGXSjY9Hhwvqzo_JHMJRP13HsGD_QjuWNI3ISt-ZKbKnSuNFmUrJKiNtGBouPqw/exec";

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
