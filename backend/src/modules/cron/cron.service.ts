import type { Medicine } from "../../model/medicine.model.js";
import type { CronRepository } from "./cron.repository.js";

export class CronService {
    constructor(private cronRepository: CronRepository) {}

    async addNewList() {
        setImmediate(async () => {
            try {
                const latestReport =
                    (await this.cronRepository.findLatestReport()) as Medicine;
                const monthYear =
                    latestReport.dt_reporting_month_year.split("-");
                const month = monthYear[0] as string;
                const year = parseInt(monthYear[1] as string);

                const nextMonthLookup: Record<string, string> = {
                    JAN: "Feb",
                    FEB: "Mar",
                    MAR: "Apr",
                    APR: "May",
                    MAY: "Jun",
                    JUN: "Jul",
                    JUL: "Aug",
                    AUG: "Sep",
                    SEP: "Oct",
                    OCT: "Nov",
                    NOV: "Dec",
                    DEC: "Jan",
                };

                const nextMonthYear = `${nextMonthLookup[month]}-${month === "Dec" ? year + 1 : year}`;

                const res = await fetch(
                    `https://cdscoonline.gov.in/CDSCO/filteredNsqDrugTable?month=${nextMonthYear}&source=All&tab=nsq`,
                    { method: "GET" },
                );
                const data = await res.json();
                if (data.aaData.length > 0) {
                    await this.cronRepository.addLatestReports(data.aaData);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }
}
