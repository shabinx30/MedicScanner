import Skeleton from "@/components/result/Skeleton";
import Link from "next/link";
import React, { Suspense } from "react";
import { GiMedicines } from "react-icons/gi";
import { LuTriangleAlert } from "react-icons/lu";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <nav className="pl-3 pt-3">
                <Link
                    href="/"
                    className="text-xs md:text-sm font-boldonse flex gap-1.5 items-center text-center uppercase"
                >
                    <GiMedicines
                        className="text-black dark:text-[#24868b]"
                        size={18}
                    />
                    Medic Scanner
                </Link>
            </nav>
            <main className="flex flex-col items-center font-sans py-10 md:py-6 gap-3 px-[2%] md:px-[10%]">
                <h2 className="text-xl md:text-2xl font-boldonse">
                    Verification Results
                </h2>
                <p className="w-full md:w-1/2 lg:w-1/3 text-center leading-tight tracking-wide text-sm text-gray-600">
                    Authentication process complete. Review the clinical
                    findings and authenticity markers below.
                </p>
                <Suspense
                    fallback={
                        <Skeleton />
                    }
                >
                    {children}
                </Suspense>
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

export default Layout;
