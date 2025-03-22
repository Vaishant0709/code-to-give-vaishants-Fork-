"use server";

export async function translateText(prompt:String) {
  if (!prompt.trim()) {
    return { error: "Please enter a text to translate." };
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Translate the following text into English while maintaining accuracy and clarity: ${prompt}. Do not add explanations, interpretations, or extra details—only a direct and correct translation.`,
          },
        ],
      }),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    return { response: data.choices?.[0]?.message?.content || "No response received" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Failed to fetch response" };
  }
}
