import type { IMedicine } from "../../types/medicine.type.js";
import type { SearchRepository } from "./search.repository.js";

export class SearchService {
    constructor(private searchRepository: SearchRepository) {}

    async searchMedicine(queries: IMedicine) {
        const medicine = await this.searchRepository.searchMedicine(queries);
        if (medicine) {
            return { ...medicine.toObject(), is_nsq: true };
        }
        return {
            str_product_name: queries.medicineName,
            str_batch_no: queries.batchNo,
            str_manufactured_by: queries.brandName || "N/A",
            dt_manufacturing_date: "N/A",
            dt_expiry_date: "N/A",
            str_nsq_result: "N/A",
            str_reporting_source: "N/A",
            str_reported_by_lab_or_state: "N/A",
            dt_reporting_month_year: "N/A",
            is_nsq: false,
        };
    }
}
