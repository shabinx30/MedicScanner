"use client";

import { useAppContext } from "@/context/AppContext";
import { AnimatePresence, motion } from "framer-motion";

const Error = () => {
    const { error } = useAppContext();

    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ backdropFilter: "blur(0)" }}
                    animate={{ backdropFilter: "blur(4px)" }}
                    exit={{ backdropFilter: "blur(0)" }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 z-999 bg-black/25"
                >
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        transition={{ duration: 0.25 }}
                        className="py-2 px-6 shadow-2xl bg-red-200 text-red-700 w-fit mx-auto mt-5 rounded-xl"
                    >
                        {error}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Error;
