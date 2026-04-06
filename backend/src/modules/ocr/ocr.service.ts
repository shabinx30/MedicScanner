import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { systemInstruction } from "../../const/ai-instruction.js";

export class OcrService {
    private readonly genAI: GoogleGenAI;
    private readonly modelId = "gemini-2.5-flash-lite";
    constructor() {
        this.genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY as string,
        });
    }

    private cleanBase64(base64String: string): string {
        return base64String.includes(",")
            ? (base64String.split(",")[1] as string)
            : base64String;
    }

    async extractMedicineInfo(images: string[]) {
        console.log({ images });
        const imageParts = images.map((img) => ({
            inlineData: {
                data: this.cleanBase64(img),
                mimeType: "image/jpeg",
            },
        }));

        try {
            const response = await this.genAI.models.generateContent({
                model: this.modelId,
                contents: [{ role: "user", parts: imageParts }],
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    // thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
                },
            });

            console.log(response.text)
            return JSON.parse(response.text as string);
        } catch (error: any) {
            console.log("error while running ocr", error.message);
            throw error;
        }
    }
}
