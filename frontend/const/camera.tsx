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
        <div className="items-center">
            <PiVibrateFill className="mx-auto my-6" size={40} />
            Hold steady...
        </div>
    ),
    glare: (
        <div className="items-center">
            <BsSunFill className="mx-auto my-6" size={40} />
            Too much glare — tilt slightly
        </div>
    ),
    dark: (
        <div className="items-center">
            <MdDarkMode className="mx-auto my-6" size={40} />
            Too dark — find better lighting
        </div>
    ),
};

export const PHASE_TEXT: Record<ScanPhase, JSX.Element | string> = {
    detecting: (
        <div className="items-center">
            Scanning front... <AiOutlineLoading3Quarters className="mx-auto my-6" size={40} />
        </div>
    ),
    front_captured: (
        <div className="items-center">
            <GoCheckCircle className="mx-auto my-6" size={40} /> front captured
        </div>
    ),
    waiting_flip: <div>Now flip the medicine to show the back</div>,
    back_captured: (
        <div className="items-center">
            <GoCheckCircle className="mx-auto my-6" size={40} />
            Back captured
        </div>
    ),
    done: "Done! Extracting details...",
};
