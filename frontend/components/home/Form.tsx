"use client"

import { TbRosetteDiscountCheck } from "react-icons/tb";

const Form = () => {
    return (
        <form className="text-sm border border-gray-300 dark:border-[#4b4b4b] flex flex-col gap-4 pt-6 pb-4 rounded-4xl px-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="product_name">Product Name</label>
                <input
                    className="text-xs border border-gray-400 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-[#41f5ff] py-3 px-3"
                    id="product_name"
                    placeholder="e.g. Paracetamol 500mg"
                    type="text"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="batch_no">Batch Number</label>
                <input
                    className="text-xs border border-gray-400 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-[#41f5ff] py-3 px-3"
                    id="batch_no"
                    placeholder="e.g. BN3L244"
                    autoCapitalize="characters"
                    onChange={(e) => {
                        const cursor = e.target.selectionStart;

                        const upperValue = e.target.value.toUpperCase();

                        e.target.value = upperValue;

                        requestAnimationFrame(() => {
                            e.target.setSelectionRange(cursor, cursor);
                        });
                    }}
                    type="text"
                />
            </div>
            <button
                className="text-base cursor-pointer flex justify-center items-center gap-1 bg-[#41f5ff] hover:bg-[#41f5ff]/75 duration-300 text-black py-2 rounded-2xl mt-4"
                type="submit"
            >
                Check Medicine
                <TbRosetteDiscountCheck size={18} />
            </button>
        </form>
    );
};

export default Form;
