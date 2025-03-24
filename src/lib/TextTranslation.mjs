import fetch from "node-fetch";

async function translateText(text, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    // Extracting the translated text from the response
    return data[0].map((sentence) => sentence[0]).join("");
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export default translateText;