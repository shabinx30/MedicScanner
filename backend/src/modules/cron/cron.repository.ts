import { MedicinModel, type Medicine } from "../../model/medicine.model.js";

export class CronRepository {
    constructor() {}

    async findLatestReport() {
        const latestReport = await MedicinModel.find()
            .sort({ _id: -1 })
            .limit(1);
        if (latestReport.length) {
            return latestReport[0];
        }
        return {};
    }

    async addLatestReports(reports: Medicine[]) {
        await MedicinModel.insertMany(reports)
    }
}
