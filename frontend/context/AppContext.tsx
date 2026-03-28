"use client";

import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from "react";

interface IContext {
    isCvLoaded: boolean;
    setCvLoaded: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<IContext | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isCvLoaded, setCvLoaded] = useState(false);

    const value = useMemo(
        () => ({
            isCvLoaded,
            setCvLoaded,
        }),
        [isCvLoaded],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext) as IContext;
