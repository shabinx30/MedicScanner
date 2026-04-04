import React from "react";
import { GiMedicines } from "react-icons/gi";

const Header = () => {
    return (
        <header className="flex flex-col items-center gap-4 md:gap-6">
            <h1 className="text-2xl md:text-3xl font-boldonse flex gap-3 items-center text-center uppercase">
                <GiMedicines className="text-black dark:text-[#41f5ff]" size={45} />
                Medic Scanner
            </h1>
            <h6 className="w-[75%] text-center text-xs md:text-sm text-[#9b9b9b] leading-tight tracking-wide">
                Check if your medicine is safe and reliable before you take it.
            </h6>
        </header>
    );
};

export default Header;
