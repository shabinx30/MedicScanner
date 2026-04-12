"use client";

import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { CgQuoteO } from "react-icons/cg";
import Link from "next/link";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { HiOutlineShare } from "react-icons/hi2";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { findMedicine, submitImages } from "@/services";
import { useEffect, useState } from "react";
import { IMedicineInfo, IResult } from "@/types/medicine.type";
import { MdDangerous } from "react-icons/md";
import { PiBuildingsFill } from "react-icons/pi";
import { HiCalendarDateRange } from "react-icons/hi2";
import { TbReport } from "react-icons/tb";
import Skeleton from "@/components/result/Skeleton";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { showError } from "@/libs/error";

const Result = () => {
    const searchParams = useSearchParams();
    const { images, setImages, setError } = useAppContext();
    const [result, setResult] = useState<IResult>();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (images.length) {
                const res = (await submitImages(images)) as IResult & {
                    message: string;
                };
                if (res.message) {
                    showError(res.message, setError);
                    router.push("/");
                    return;
                }
                setResult(() => {
                    return res;
                });
                setLoading(false);

                const params = new URLSearchParams(searchParams.toString());
                params.set("medicineName", res.str_product_name);
                params.set("batchNo", res.str_batch_no);

                router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                });

                setImages([]);
                return;
            }
            const medicineName = searchParams.get("medicineName");
            const batchNo = searchParams.get("batchNo");

            const res = (await findMedicine({
                medicineName,
                batchNo,
            } as IMedicineInfo)) as IResult;

            setResult(() => {
                return res;
            });
            setLoading(false);
        })();
    }, []);

    async function shareSite() {
        if (navigator.share) {
            try {
                const medicineName = result?.str_product_name;
                const shareUrl = window.location.href;

                await navigator.share({
                    title: "Check this out!",
                    text: `Medicine Details of ${medicineName}\n\n${shareUrl}`,
                });
            } catch (error) {
                console.log("Error sharing:", error);
            }
        } else {
            console.log("Web share not supported");
        }
    }

    if (isLoading) {
        return <Skeleton />;
    } else {
        return (
            <>
                <div className="mt-10 w-full flex gap-2 justify-center md:justify-between">
                    <Link
                        href="/"
                        className="md:flex hidden bg-[#8dc3c6] dark:bg-[#0d3234] px-4 py-1.5 rounded-xl items-center gap-2"
                    >
                        <BsArrowCounterclockwise />
                        Check Another Medicine
                    </Link>
                    <button
                        onClick={shareSite}
                        className="flex bg-[#8dc3c6] dark:bg-[#0d3234] text-sm md:text-base px-4 py-1.5 rounded-xl items-center gap-2 cursor-pointer"
                    >
                        <HiOutlineShare />
                        Share
                    </button>
                </div>
                <section className="flex flex-col lg:flex-row w-full gap-4">
                    <div className="flex flex-col min-h-full flex-1/3 bg-[#24868b] dark:bg-[#196165] rounded-3xl p-5 md:p-6">
                        <div className="flex items-center justify-between">
                            <p
                                className={`flex w-fit items-center gap-1.5 ${result?.is_nsq ? "bg-red-300" : "bg-[#3fff68]"} text-black rounded-full py-1.5 px-3 text-[0.5rem] md:text-[0.6rem] uppercase`}
                            >
                                {result?.is_nsq ? (
                                    <MdDangerous size={15} />
                                ) : (
                                    <IoShieldCheckmarkSharp size={15} />
                                )}
                                <span className="pt-px tracking-wider">
                                    {result?.is_nsq ? (
                                        <>
                                            Not of Standard Quality listed by{" "}
                                            <span className="font-semibold">
                                                {result.str_reporting_source}
                                            </span>
                                        </>
                                    ) : (
                                        "Authentic Medicine"
                                    )}
                                </span>
                            </p>
                            {result?.is_nsq &&
                                result?.str_nsq_result?.length! > 10 && (
                                    <p className="text-sm hidden xl:flex items-center gap-1">
                                        <HiOutlineLocationMarker />
                                        Reported from:{" "}
                                        <span className="font-semibold">
                                            {
                                                result?.str_reported_by_lab_or_state
                                            }
                                        </span>
                                    </p>
                                )}
                        </div>
                        <h3
                            className={`text-2xl font-semibold md md:font-medium md:text-3xl ${result?.is_nsq ? "text-red-500" : "text-white"} mt-4`}
                        >
                            {result?.str_product_name}
                        </h3>
                        <p className="text-sm text-[#dcdcdc]">
                            Batch:{" "}
                            <span
                                className={`font-semibold ${result?.is_nsq ? "text-red-500" : "text-white"}`}
                            >
                                {result?.str_batch_no}
                            </span>
                        </p>
                        <div className="text-sm px-6 py-5 flex-1 flex flex-col justify-center bg-[#dafdff] dark:bg-[#0d3234] mt-6 rounded-xl">
                            <h4 className="uppercase font-semibold mb-3 flex items-center gap-2">
                                {result?.is_nsq ? (
                                    <TbReport size={17} />
                                ) : (
                                    <CgQuoteO size={16} />
                                )}
                                {result?.is_nsq
                                    ? "Reason for listing"
                                    : "Summary"}
                            </h4>
                            {result?.is_nsq ? (
                                <p className="text-red-500">
                                    {result.str_nsq_result}
                                </p>
                            ) : (
                                <p className="dark:text-white">
                                    This product matches the manufacturer's
                                    spectral fingerprint and packaging
                                    standards. No anomalies detected in the
                                    holographic seal.{" "}
                                    <span className="text-[#03ad00]">
                                        Safe for consumption
                                    </span>{" "}
                                    according to current CDSCO guidelines.
                                    Always cross-verify with physical symptoms.
                                </p>
                            )}
                        </div>
                        {result?.is_nsq &&
                            result?.str_nsq_result?.length! <= 10 && (
                                <p className="mt-4 text-sm flex items-center gap-1">
                                    <HiOutlineLocationMarker />
                                    Reported from:{" "}
                                    <span className="font-semibold flex items-center">
                                        {result?.str_reported_by_lab_or_state}
                                    </span>
                                </p>
                            )}
                        {result?.is_nsq &&
                            result?.str_nsq_result?.length! > 10 && (
                                <p className="text-sm xl:hidden mt-4 flex justify-center items-center gap-1">
                                    <HiOutlineLocationMarker />
                                    Reported from:
                                    <span className="font-semibold">
                                        {result?.str_reported_by_lab_or_state}
                                    </span>
                                </p>
                            )}
                    </div>
                    <div className="text-sm flex flex-col justify-center flex-1 min-h-full text-white bg-[#24868b] dark:bg-[#196165] rounded-3xl p-5 md:p-6">
                        <h5 className="text-base font-semibold">
                            Manufacturer Info
                        </h5>
                        <h6 className="mt-8 text-gray-300 flex items-center gap-2">
                            <PiBuildingsFill />
                            Registered Producer & Origin
                        </h6>
                        <p className="ml-5.5">{result?.str_manufactured_by}</p>
                        <h6 className="mt-4 text-gray-300 flex items-center gap-2">
                            <HiCalendarDateRange />
                            Manufacturing Date
                        </h6>
                        <p className="ml-5.5">
                            {result?.dt_manufacturing_date}
                        </p>
                        <h6 className="mt-4 text-gray-300 flex items-center gap-2">
                            <HiCalendarDateRange />
                            Expiry Date
                        </h6>
                        <p className="ml-5.5">{result?.dt_expiry_date}</p>
                    </div>
                </section>
                <div className="w-full flex gap-2 md:hidden justify-center text-sm">
                    <Link
                        href="/"
                        className="flex bg-[#8dc3c6] dark:bg-[#0d3234] px-4 py-1.5 rounded-xl items-center gap-2"
                    >
                        <BsArrowCounterclockwise />
                        Check Another Medicine
                    </Link>
                </div>
            </>
        );
    }
};

export default Result;
