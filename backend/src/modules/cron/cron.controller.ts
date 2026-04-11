import type { Request, Response } from "express";
import type { CronService } from "./cron.service.js";

export class CronController {
    constructor(private cronService: CronService) {}

    async addNewList(_: Request, res: Response) {
        await this.cronService.addNewList()
        res.status(200).json({ message: "Job accepted and running in background" });
    }
}
