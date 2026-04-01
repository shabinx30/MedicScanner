import { Guidance, ScanPhase } from "@/types/camera.type";

export const GUIDANCE_TEXT: Record<Guidance, string> = {
    none: "",
    no_object: "Point the camera at the medicine",
    move_closer: "Move closer to the medicine",
    hold_steady: "Hold steady...",
    glare: "Too much glare — tilt slightly",
    dark: "Too dark — find better lighting",
};

export const PHASE_TEXT: Record<ScanPhase, string> = {
    detecting: "Scanning front...",
    front_captured: "Front captured ✓",
    waiting_flip: "Now flip the medicine to show the back",
    back_captured: "Back captured ✓",
    done: "Done! Extracting details...",
};
