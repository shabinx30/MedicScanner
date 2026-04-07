export interface IMedicineInfo {
    medicineName: string;
    batchNo: string;
}

export interface IResult {
    str_product_name: string;
    str_batch_no: string;
    dt_manufacturing_date: string;
    dt_expiry_date: string;
    str_manufactured_by: string;
    str_nsq_result: string;
    str_reporting_source: string;
    str_reported_by_lab_or_state: string;
    dt_reporting_month_year: string;
    is_nsq: boolean;
}
