import type { Request, Response } from "express";
import type { searchService } from "./search.service.js";

export class SearchController {
    constructor(private searchService: searchService) {}

    async searchMedicine(req: Request, res: Response) {
        try {
            
        } catch (error) {
            
        }
    }
}