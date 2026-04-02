import React from "react";
import { GiMedicines } from "react-icons/gi";

const Header = () => {
    return (
        <header className="flex flex-col items-center gap-4 md:gap-8">
            <h1 className="text-2xl md:text-4xl font-boldonse flex gap-3 items-center text-center uppercase">
                <GiMedicines className="text-[#41f5ff]" size={45} />
                Medic Scanner
            </h1>
            <h6 className="w-[75%] text-center text-sm md:text-base text-[#9b9b9b] md:leading-normal tracking-wide">
                This Application helps you to find whether your medicine have
                enough quality to take or not.
            </h6>
        </header>
    );
};

export default Header;
