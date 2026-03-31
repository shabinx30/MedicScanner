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
    isEngineLoaded: boolean;
    setEnginLoaded: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<IContext | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isEngineLoaded, setEnginLoaded] = useState(false);

    const value = useMemo(
        () => ({
            isEngineLoaded,
            setEnginLoaded,
        }),
        [isEngineLoaded],
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext) as IContext;
