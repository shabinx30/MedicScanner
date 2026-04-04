export type ScanPhase =
    | "detecting"
    | "front_captured"
    | "waiting_flip"
    | "back_captured"
    | "done";


export type Guidance =
    | "none"
    | "move_closer"
    | "hold_steady"
    | "no_object"
    | "dark"
    | "glare";