"use client";

import { findMedicine } from "@/services";
import { IMedicineInfo } from "@/types/medicine.type";
import { SubmitEvent, useState } from "react";
import { TbRosetteDiscountCheck } from "react-icons/tb";

const Form = () => {
    const [formData, setFormData] = useState<IMedicineInfo>({
        medicineName: "",
        batchNo: "",
    });

    const updateFormData = (
        state: "medicineName" | "batchNo",
        value: string,
    ) => {
        setFormData((p) => ({ ...p, [state]: value }));
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        const res = await findMedicine(formData);
        console.log(res)
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="text-sm border border-gray-400 dark:border-[#4b4b4b] flex flex-col gap-4 pt-6 pb-4 rounded-4xl px-4"
        >
            <div className="flex flex-col gap-1">
                <label htmlFor="product_name">Product Name</label>
                <input
                    className="text-xs border-2 border-gray-300 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-2 focus:border-black dark:focus:border-white py-3 px-3"
                    id="product_name"
                    placeholder="e.g. Paracetamol 500mg"
                    maxLength={60}
                    onChange={(e) => {
                        updateFormData("medicineName", e.target.value);
                    }}
                    type="text"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="batch_no">Batch Number</label>
                <input
                    className="text-xs border-2 border-gray-300 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-2 focus:border-black dark:focus:border-white py-3 px-3"
                    id="batch_no"
                    placeholder="e.g. BN3L244"
                    autoCapitalize="characters"
                    maxLength={20}
                    onChange={(e) => {
                        const cursor = e.target.selectionStart;

                        const value = e.target.value.replaceAll(
                            /[^a-zA-Z0-9]/g,
                            "",
                        );

                        const uppercase = value.toUpperCase();
                        e.target.value = uppercase;

                        updateFormData("batchNo", uppercase);

                        requestAnimationFrame(() => {
                            e.target.setSelectionRange(cursor, cursor);
                        });
                    }}
                    type="text"
                />
            </div>
            <button
                className="text-base cursor-pointer flex justify-center items-center gap-1 bg-[#24868b] hover:bg-[#24868b]/75 duration-300 text-white py-2 rounded-2xl mt-4"
                type="submit"
            >
                Check Medicine
                <TbRosetteDiscountCheck size={18} />
            </button>
        </form>
    );
};

export default Form;
