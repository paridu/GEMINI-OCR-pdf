
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { ProcessingOptions } from "../types";

export class GeminiOCRService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async processImage(base64Image: string, mimeType: string, options: ProcessingOptions): Promise<string> {
    const optionsPrompt = `
Specific processing requirements:
- Preserve Layout: ${options.preserveLayout ? "Yes, try to match the visual layout closely." : "No, prioritize clean linear text flow."}
- Extract Tables: ${options.extractTables ? "Yes, convert all tables to Markdown format." : "No, skip table structures."}
- Extract Math: ${options.extractMath ? "Yes, convert math to LaTeX." : "No, treat math as plain text."}
- Extract Code: ${options.extractCode ? "Yes, identify and format code blocks." : "No, treat code as plain text."}
    `.trim();

    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: `Please perform full OCR on this document image and output structured Markdown. ${optionsPrompt}`,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
      },
    });

    return response.text || "Failed to extract text.";
  }
}

export const ocrService = new GeminiOCRService();
