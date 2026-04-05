import type { IMedicine } from "../../types/medicine.type.js";
import type { SearchRepository } from "./search.repository.js";

export class searchService {
    constructor(private searchRepository: SearchRepository) {}

    async searchMedicine({ medicineName, batchNo }: IMedicine) {
        const medicine = await this.searchRepository.searchMedicine({
            medicineName,
            batchNo,
        });
        return medicine;
    }
}
