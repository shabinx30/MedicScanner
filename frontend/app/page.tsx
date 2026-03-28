import Link from "next/link";
import { GiMedicines } from "react-icons/gi";
import { HiExternalLink } from "react-icons/hi";
import { SlArrowRight } from "react-icons/sl";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import Image from "next/image";

const Home = () => {
    return (
        <main className="flex flex-col gap-8 pt-[3em] justify-between items-center font-sans h-screen">
            <header className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-semibold flex gap-3 text-center uppercase">
                    <GiMedicines className="text-[#41f5ff]" />
                    Medic Scanner
                </h1>
                <h6 className="w-[75%] text-center text-[#9b9b9b]">
                    This Application helps you to find whether your medicine
                    have enough quality to take or not.
                </h6>
            </header>
            <section>
                <div className="border border-gray-300 dark:border-[#4b4b4b] py-4 rounded-4xl px-4">
                    <Link
                        href="/camera"
                        className="bg-[#41f5ff] font-semibold flex justify-between gap-[10em] items-center w-full cursor-pointer text-black px-5 py-6 rounded-2xl"
                    >
                        <div className="flex gap-3">
                            <FaCamera size={22} />
                            Open Camera
                        </div>
                        <SlArrowRight />
                    </Link>
                    <div className="mt-2 bg-gray-100 dark:bg-[#2b2b2b] flex justify-center gap-3 px-5 py-4 rounded-2xl items-center">
                        <IoCloudUploadOutline size={21} />
                        Upload Image
                    </div>
                </div>
                <div className="relative my-6">
                    <p className="absolute text-sm right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 bg-background px-1">
                        OR
                    </p>
                    <hr className="h-px border-0 bg-linear-to-r from-transparent via-gray-300 dark:via-[#4b4b4b] to-transparent" />
                </div>
                <form className="text-sm border border-gray-300 dark:border-[#4b4b4b] flex flex-col gap-4 pt-6 pb-4 rounded-4xl px-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="product_name">Product Name</label>
                        <input
                            className="border border-gray-400 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-[#41f5ff] p-2"
                            id="product_name"
                            placeholder="e.g. Paracetamol 500mg"
                            type="text"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="batch_no">Batch Number</label>
                        <input
                            className="border border-gray-400 dark:border-[#4b4b4b] rounded-lg outline-none focus:border-[#41f5ff] p-2"
                            id="batch_no"
                            placeholder="e.g. BN3L244"
                            type="text"
                        />
                    </div>
                    <button
                        className="text-base cursor-pointer flex justify-center items-center gap-2 bg-[#41f5ff] text-black py-2 rounded-2xl mt-4"
                        type="submit"
                    >
                        Check Medicine
                        <TbRosetteDiscountCheck size={18} />
                    </button>
                </form>
            </section>
            <footer className="mb-[1em] text-xs text-center text-[#9b9b9b]">
                <p className="text-center">
                    All the data we use for this validation is collected from{" "}
                    <br />
                </p>
                <Link
                    className="hover:underline hover:text-white text-center flex justify-center items-center gap-2"
                    href="https://cdsco.gov.in/opencms/opencms/en/Notifications/nsq-drugs/"
                >
                    Center Drug Standard Organization
                    <HiExternalLink size={16} />
                </Link>
            </footer>
            <Image
                className="hidden md:block absolute top-1/4 left-1/9"
                src="/star.avif"
                alt="star"
                width={100}
                height={100}
            />
            <Image
                className="hidden md:block absolute bottom-1/4 right-1/9"
                src="/dimond.avif"
                alt="star"
                width={100}
                height={100}
            />
        </main>
    );
};

export default Home;
