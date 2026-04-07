import type { Request, Response } from "express";
import type { OcrService } from "./ocr.service.js";

export class OcrController {
    constructor(private ocrService: OcrService) {}

    async extractText(req: Request, res: Response) {
        try {
            const result = await this.ocrService.findMedicineInfo(req.body.images);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
