import { MedicinModel } from "../../model/medicine.model.js";
import type { IMedicine } from "../../types/medicine.type.js";

export class SearchRepository {
    async searchMedicine(queries: IMedicine) {
        const { medicineName, batchNo } = queries;

        const orConditions: Record<string, string>[] = [
            { str_product_name: medicineName },
        ];

        if (queries.brandName) {
            orConditions.push({ str_manufactured_by: queries.brandName });
        }

        return await MedicinModel.findOne({
            $or: orConditions,
            str_batch_no: batchNo,
        });
    }
}
