import { Dispatch, SetStateAction } from "react";

export const showError = (error: string, setError: Dispatch<SetStateAction<string>>) => {
    setError(error)
    setTimeout(() => {
        setError("")
    }, 3000);
};
