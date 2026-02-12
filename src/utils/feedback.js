const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwEd6LTYP5ZowdUK6zR-pbgkGDtUkBPLNorzbu7jQ4s6IFHNoykF0W4unl1GXtaKlUmpg/exec";

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
