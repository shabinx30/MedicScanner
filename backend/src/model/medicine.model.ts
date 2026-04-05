import { model, Schema } from "mongoose";

const medicineSchema = new Schema({
    str_product_name: { type: String, required: true },
    str_batch_no: { type: String, required: true },
    dt_manufacturing_date: { type: String, required: true },
    dt_expiry_date: { type: String, required: true },
    str_manufactured_by: { type: String, required: true },
    str_nsq_result: { type: String, required: true },
    str_reporting_source: { type: String, required: true },
    str_reported_by_lab_or_state: { type: String, required: true },
    dt_reporting_month_year: { type: String, required: true },
});

export const MedicinModel = model("Medicine", medicineSchema)
