const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbw4uq-3JGdt4u4FRSMVjizMrUAHSX9zOu3AbV55qHolgYggdn18Ni4bIBmB6StBTc7LPw/exec";

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
