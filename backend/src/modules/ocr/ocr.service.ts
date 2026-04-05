import { GoogleGenAI } from "@google/genai";

export class OcrService {
    private readonly genAI: GoogleGenAI;
    constructor() {
        this.genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY as string,
        });
    }

    async extractText(body: {}) {
        
    }
}
