import Link from "next/link";
import { SlArrowRight } from "react-icons/sl";
import { LuScanText } from "react-icons/lu";
import Form from "./Form";
import Input from "./Input";

const Tools = () => {

    return (
        <section className="max-w-[calc(100vw-1em)]">
            <div className="border border-gray-400/75 dark:border-[#4b4b4b] py-4 rounded-4xl px-4">
                <Link
                    href="/camera"
                    className="bg-[#24868b] hover:bg-[#24868b]/75 duration-300 font-semibold flex justify-between gap-[6em] md:gap-[8.5em] items-center w-full cursor-pointer text-white px-5 py-5 rounded-2xl"
                >
                    <div className="flex gap-3 items-center">
                        <LuScanText size={22} />
                        Open Scanner
                    </div>
                    <SlArrowRight />
                </Link>
                <Input />
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
