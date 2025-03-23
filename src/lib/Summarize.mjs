import {pipeline} from "@xenova/transformers";
export async function summarizeText(text) {
    if (!text || text.trim().length === 0) {
        throw new Error("Input text cannot be empty.");
    }

    try {
        const summarizer = await pipeline("summarization");
        const result = await summarizer(text, { max_length: 50, min_length: 20, do_sample: false });

        return result[0]?.summary_text || "Summarization failed.";
    } catch (error) {
        console.error("Error during summarization:", error);
        throw new Error("Failed to generate summary.");
    }
}