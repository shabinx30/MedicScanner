import type { Request, Response } from "express";
import type { searchService } from "./search.service.js";

export class SearchController {
    constructor(private searchService: searchService) {}

    async searchMedicine(req: Request, res: Response) {
        try {
            const medicine = await this.searchService.searchMedicine(req.body);
            return res.json(medicine);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
