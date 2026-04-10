"use client";

import { SubmitEvent, useRef } from "react";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { useRouter } from "next/navigation";

const Form = () => {
    const router = useRouter();
    const medicineNameRef = useRef<HTMLInputElement>(null);
    const batchNoRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        if (medicineNameRef.current && batchNoRef.current) {
            if (!medicineNameRef.current.value.trim()) {
                return;
            }

            if (!batchNoRef.current.value.trim()) {
                return;
            }

            router.push(
                `/result?medicineName=${medicineNameRef.current.value}&batchNo=${batchNoRef.current.value}`,
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="text-sm border border-gray-400/75 dark:border-[#4b4b4b] flex flex-col gap-4 pt-6 pb-4 rounded-4xl px-4"
        >
            <div className="flex flex-col gap-1">
                <label htmlFor="product_name">Product Name</label>
                <input
                    ref={medicineNameRef}
                    className="text-xs border-2 border-gray-300 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-2 focus:border-black dark:focus:border-white py-3 px-3"
                    id="product_name"
                    placeholder="e.g. Paracetamol 500mg"
                    maxLength={60}
                    type="text"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="batch_no">Batch Number</label>
                <input
                    ref={batchNoRef}
                    className="text-xs border-2 border-gray-300 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-2 focus:border-black dark:focus:border-white py-3 px-3"
                    id="batch_no"
                    placeholder="e.g. BN3L244"
                    autoCapitalize="characters"
                    maxLength={20}
                    onChange={(e) => {
                        const cursor = e.target.selectionStart;

                        const uppercase = e.target.value.toUpperCase()
                        
                        e.target.value = uppercase;

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
