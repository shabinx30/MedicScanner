import Link from "next/link";
import { IoCloudUploadOutline } from "react-icons/io5";
import { SlArrowRight } from "react-icons/sl";
import { LuScanText } from "react-icons/lu";
import Form from "./Form";

const Tools = () => {
    return (
        <section className="max-w-[calc(100vw-1em)]">
            <div className="border border-gray-300 dark:border-[#4b4b4b] py-4 rounded-4xl px-4">
                <Link
                    href="/camera"
                    className="bg-[#41f5ff] hover:bg-[#41f5ff]/75 duration-300 font-semibold flex justify-between gap-[6em] md:gap-[8.5em] items-center w-full cursor-pointer text-black px-5 py-5 rounded-2xl"
                >
                    <div className="flex gap-3">
                        <LuScanText size={22} />
                        Open Scanner
                    </div>
                    <SlArrowRight />
                </Link>
                <div className="mt-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#2b2b2b] dark:hover:bg-[#1b1b1b] duration-300 flex justify-center gap-3 px-5 py-3 rounded-2xl items-center">
                    <IoCloudUploadOutline size={21} />
                    Upload Image
                </div>
            </div>
            <div className="relative my-6">
                <p className="absolute text-xs right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 bg-background px-1">
                    OR
                </p>
                <hr className="h-px border-0 bg-linear-to-r from-transparent via-gray-300 dark:via-[#4b4b4b] to-transparent" />
            </div>
            <Form />
        </section>
    );
};

export default Tools;
