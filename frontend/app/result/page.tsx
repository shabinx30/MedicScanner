import { GiMedicines } from "react-icons/gi";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { CgQuoteO } from "react-icons/cg";
import Link from "next/link";
import { LuTriangleAlert } from "react-icons/lu";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { HiOutlineShare } from "react-icons/hi2";

const Result = () => {
    return (
        <>
            <nav className="pl-3 pt-3">
                <Link
                    href="/"
                    className="text-xs md:text-sm font-boldonse flex gap-1.5 items-center text-center uppercase"
                >
                    <GiMedicines
                        className="text-black dark:text-[#41f5ff]"
                        size={18}
                    />
                    Medic Scanner
                </Link>
            </nav>
            <main className="flex flex-col items-center py-10 md:py-6 gap-3 px-[10%]">
                <h2 className="text-xl md:text-2xl font-boldonse">Verification Results</h2>
                <p className="w-full md:w-1/2 lg:w-1/3 text-center leading-tight tracking-wide text-sm text-gray-600">
                    Authentication process complete. Review the clinical
                    findings and authenticity markers below.
                </p>
                <div className="mt-10 w-full md:flex gap-2 hidden  justify-between">
                    <Link
                        href="/"
                        className="flex bg-[#8dc3c6] dark:bg-[#0d3234] px-4 py-1.5 rounded-xl items-center gap-2"
                    >
                        <BsArrowCounterclockwise />
                        Check Another Medicine
                    </Link>
                    <Link
                        href="/"
                        className="flex bg-[#8dc3c6] dark:bg-[#0d3234] px-4 py-1.5 rounded-xl items-center gap-2"
                    >
                        <HiOutlineShare />
                        Share
                    </Link>
                </div>
                <section className="flex flex-col lg:flex-row w-full gap-4 mt-10 md:mt-0">
                    <div className="h-full flex-1/3 bg-[#24868b] dark:bg-[#196165] rounded-2xl p-6">
                        <p className="flex w-fit items-start gap-1.5 bg-[#3fff68] text-black rounded-full py-1.5 px-3 text-[0.6rem] uppercase">
                            <IoShieldCheckmarkSharp size={15} />
                            <span className="pt-px tracking-wider">
                                Authentic Medicine
                            </span>
                        </p>
                        <h3 className="text-3xl text-white mt-4">
                            Amoxicillin 500mg
                        </h3>
                        <p className="text-sm text-[#dcdcdc]">
                            Batch:{" "}
                            <span className="font-semibold">IFAT1245</span>
                        </p>
                        <div className="text-sm px-6 py-5 bg-[#dafdff] dark:bg-[#0d3234] mt-6 rounded-xl">
                            <h4 className="uppercase font-semibold mb-3 flex items-center gap-2">
                                <CgQuoteO size={16} />
                                summary
                            </h4>
                            This product matches the manufacturer's spectral
                            fingerprint and packaging standards. No anomalies
                            detected in the holographic seal.{" "}
                            <span className="text-[#03ad00]">
                                Safe for consumption
                            </span>{" "}
                            according to current CDSCO guidelines. Always
                            cross-verify with physical symptoms.
                        </div>
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-h-full text-white bg-[#24868b] dark:bg-[#196165] rounded-2xl p-6">
                        <h5 className="font-semibold">Manufacturer Info</h5>
                        <h6 className="text-sm mt-8 text-gray-300">
                            Registered Producer
                        </h6>
                        <p>BioHealth Pharmaceutics Ltd.</p>
                        <h6 className="text-sm mt-4 text-gray-300">Origin</h6>
                        <p>Mumbai Hub, MH-04</p>
                        <h6 className="text-sm mt-4 text-gray-300">
                            Expiry Date
                        </h6>
                        <p>DEC 2026</p>
                    </div>
                </section>
                <div className="w-full flex gap-2 md:hidden justify-center">
                    <Link
                        href="/"
                        className="flex bg-[#8dc3c6] dark:bg-[#0d3234] px-4 py-1.5 rounded-xl items-center gap-2"
                    >
                        <BsArrowCounterclockwise />
                        Check Another Medicine
                    </Link>
                    <Link
                        href="/"
                        className="flex bg-[#8dc3c6] dark:bg-[#0d3234] px-4 py-1.5 rounded-xl items-center gap-2"
                    >
                        <HiOutlineShare />
                        Share
                    </Link>
                </div>
                <section className="flex justify-center mt-10">
                    <div className="flex flex-col items-center">
                        <div className="flex text-sm items-center gap-2 bg-red-200 dark:bg-red-500/25 text-red-800 dark:text-red-300 w-fit px-3 py-1.5 rounded-xl">
                            <LuTriangleAlert />
                            Legal Disclaimer
                        </div>
                        <p className="text-sm text-center mt-3 md:w-1/2 text-gray-500">
                            This verification is an auxiliary tool and does not
                            replace the advice of a medical doctor. If you
                            suspect your medicine is compromised despite these
                            results, do not consume it and contact your local
                            regulatory authority immediately.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Result;
