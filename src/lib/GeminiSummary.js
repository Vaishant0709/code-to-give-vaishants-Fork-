import fs from "fs";
import mime from "mime-types";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyDiFVsdGRW9zM6eX--gtwFSr-2EEJlyhxU';
const fileManager = new GoogleAIFileManager(API_KEY);

/**
 * Summarizes any file type using Google Gemini AI.
 * @param {string} filePath - Path to the file.
 * @returns {Promise<string>} - The summarized text.
 */
async function summarizeFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }

    // Auto-detect MIME type
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    // Upload the file with detected MIME type
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: mimeType, // Required for Gemini API
      displayName: filePath.split("/").pop(),
    });

    let file = await fileManager.getFile(uploadResult.file.name);

    // Wait until file processing is complete
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("File processing failed.");
    }

    // Generate summary using Gemini AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Summarize this file:",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: mimeType,
        },
      },
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Error summarizing file:", error);
    throw error;
  }
}

export default summarizeFile;