import { MedicinModel } from "../../model/medicine.model.js";
import type { IMedicine } from "../../types/medicine.type.js";

export class SearchRepository {
    async searchMedicine({ medicineName, batchNo }: IMedicine) {
        return await MedicinModel.findOne({
            str_product_name: medicineName,
            str_batch_no: batchNo,
        });
    }
}
