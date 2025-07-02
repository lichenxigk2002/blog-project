import {useCallback, useRef, useState} from "react";

export const useError = () => {
    const [error ,setError] = useState<string | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const showError = useCallback((msg:string) => {
        setError(msg);
    },[])

    const clearError = useCallback(async() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setError(null);
            timerRef.current = null;
        }, 3000);
    },[])

    const withError = useCallback( async <T>(promise: Promise<T>): Promise<T>  => {
        try{
            return await promise;

        }catch (err){
            const msg = err instanceof Error ? err.message : String(err);
            showError(msg);
            throw err;
        }
    },[showError]);

    return{
        error,
        showError,
        clearError,
        withError
    }
}