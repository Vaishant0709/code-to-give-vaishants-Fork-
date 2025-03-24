import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = '$(process.env.GOOGLEAPIKEY';
const fileManager = new GoogleAIFileManager(API_KEY);

async function summarizeVideo(videoPath) {
  try {
    const uploadResult = await fileManager.uploadFile(videoPath, {
      mimeType: "video/mp4",
      displayName: videoPath.split("/").pop(),
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "Summarize this video:",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    
    return result.response.text();
  } catch (error) {
    console.error("Error summarizing video:", error);
    throw error;
  }
}

export default summarizeVideo;
