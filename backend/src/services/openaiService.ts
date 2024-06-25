import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI("AIzaSyCTAQkRvworA0CY82N1mCRV5DK07NzHjnM");

export const analyzeEmailContent = async (content: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      `Analyze the following email and categorize it as Interested, Not Interested, or More Information: ${content}`,
    ]);

    const categorized = categorizeContent(result.response.text());
    return categorized;
  } catch (error) {
    console.error("Error analyzing email content:", error);
    throw error;
  }
};

const categorizeContent = (generatedText: string): string => {
  if (generatedText.includes("Interested")) {
    return "Intrested";
  } else if (generatedText.includes("More Information")) {
    return "More Information";
  } else {
    return "Not Interested";
  }
};

export const generateReply = async (context: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "`Generate a polite and professional response for an email categorized as: " +
        context,
    ]);
    return result.response.text();
  } catch (error) {
    console.error("Error generating reply:", error);
    throw error;
  }
};
