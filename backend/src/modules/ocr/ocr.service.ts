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

    async extractMedicineInfo(images: string[]) {
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
            const parsedData = JSON.parse(jsonString);

            return parsedData;
        } catch (error: any) {
            console.log("error while running ocr", error.message);
            throw error;
        }
    }

    async findMedicineInfo(images: string[]) {
        const medicine_info = await this.extractMedicineInfo(images);

        const { str_product_name, str_batch_no, str_manufactured_by } =
            medicine_info;

        if (
            str_batch_no === "N/A" ||
            str_product_name === "N/A" ||
            !str_product_name
        ) {
            return {
                message: "cannot find essential details to find the medicine",
            };
        }

        const queries: IMedicine = {
            medicineName: str_product_name,
            batchNo: str_batch_no,
        };

        if (str_manufactured_by !== "N/A") {
            queries.brandName = str_manufactured_by;
        }

        const medicine = await this.searchService.searchMedicine(queries);
        if (medicine.is_nsq === false) {
            return {
                ...medicine_info,
                str_nsq_result: "N/A",
                str_reporting_source: "N/A",
                str_reported_by_lab_or_state: "N/A",
                dt_reporting_month_year: "N/A",
                is_nsq: false
            };
        }
        return medicine;
    }
}
