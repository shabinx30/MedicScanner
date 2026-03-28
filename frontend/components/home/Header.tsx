import React from "react";
import { GiMedicines } from "react-icons/gi";

const Header = () => {
    return (
        <header className="flex flex-col items-center gap-4">
            <h1 className="text-2xl md:text-4xl font-semibold flex gap-3 text-center uppercase">
                <GiMedicines className="text-[#41f5ff]" />
                Medic Scanner
            </h1>
            <h6 className="w-[75%] text-center text-sm md:text-base text-[#9b9b9b] leading-[1.1] md:leading-tight">
                This Application helps you to find whether your medicine have
                enough quality to take or not.
            </h6>
        </header>
    );
};

export default Header;
