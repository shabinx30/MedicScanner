import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "../../const/ai-instruction.js";
import type { SearchService } from "../search/search.service.js";
import type { IMedicine } from "../../types/medicine.type.js";

export class OcrService {
    private readonly genAI: GoogleGenAI;
    private readonly modelId = "gemini-2.5-flash-lite";
    constructor(private searchService: SearchService) {
        this.genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY as string,
        });
    }

    private cleanBase64(base64String: string): string {
        return base64String.includes(",")
            ? (base64String.split(",")[1] as string)
            : base64String;
    }

    async extractMedicineInfo(images: string[]): Promise<IMedicine> {
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

            console.log(response.text);
            const rawText = response.text as string;
            // Extract the actual JSON object to avoid parsing errors from trailing characters
            const match = rawText.match(/\{[\s\S]*\}/);
            const jsonString = match ? match[0] : rawText;
            return JSON.parse(jsonString);
        } catch (error: any) {
            console.log("error while running ocr", error.message);
            throw error;
        }
    }

    async findMedicineInfo(images: string[]) {
        const { medicineName, batchNo, brandName } =
            await this.extractMedicineInfo(images);
        if (batchNo === "N/A") {
            return {
                message: "cannot find essential details to find the medicine",
            };
        }

        const queries: IMedicine = {
            medicineName,
            batchNo,
        };

        if (brandName !== "N/A") {
            queries.brandName = brandName;
        }

        const medicine = await this.searchService.searchMedicine(queries);
        return medicine;
    }
}
