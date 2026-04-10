"use client";

import {
    createContext,
    Dispatch,
    RefObject,
    SetStateAction,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";

interface IContext {
    isEngineLoaded: boolean;
    setEnginLoaded: Dispatch<SetStateAction<boolean>>;
    images: string[];
    setImages: Dispatch<SetStateAction<string[]>>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    setExText: Dispatch<any>;
    exText: any;
    textRecWorkerRef: RefObject<Worker | null>;
}

export const AppContext = createContext<IContext | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isEngineLoaded, setEnginLoaded] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [exText, setExText] = useState<any>([]);
    const textRecWorkerRef = useRef<Worker | null>(null);

    const value = useMemo(
        () => ({
            isEngineLoaded,
            setEnginLoaded,
            images,
            setImages,
            canvasRef,
            setExText,
            exText,
            textRecWorkerRef
        }),
        [isEngineLoaded, images, canvasRef, exText, textRecWorkerRef],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext) as IContext;
