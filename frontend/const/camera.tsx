import { Guidance, ScanPhase } from "@/types/camera.type";
import { GoCheckCircle } from "react-icons/go";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDarkMode } from "react-icons/md";
import { BsSunFill } from "react-icons/bs";
import { PiVibrateFill } from "react-icons/pi";
import { JSX } from "react";

export const GUIDANCE_TEXT: Record<Guidance, JSX.Element | string> = {
    none: "",
    no_object: "Point the camera at the medicine",
    move_closer: "Move closer to the medicine",
    hold_steady: (
        <div className="flex items-center gap-2">
            <PiVibrateFill />
            Hold steady...
        </div>
    ),
    glare: (
        <div className="flex items-center gap-2">
            <BsSunFill size={15} />
            Too much glare — tilt slightly
        </div>
    ),
    dark: (
        <div className="flex items-center gap-2">
            <MdDarkMode />
            Too dark — find better lighting
        </div>
    ),
};

export const PHASE_TEXT: Record<ScanPhase, JSX.Element | string> = {
    detecting: (
        <div className="flex items-center gap-2">
            Scanning front... <AiOutlineLoading3Quarters />
        </div>
    ),
    front_captured: (
        <div className="flex items-center gap-2">
            <GoCheckCircle /> front captured
        </div>
    ),
    waiting_flip: <div>Now flip the medicine to show the back</div>,
    back_captured: (
        <div className="flex items-center gap-2">
            <GoCheckCircle />
            Back captured
        </div>
    ),
    done: "Done! Extracting details...",
};
