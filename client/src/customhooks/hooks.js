import {useCallback, useEffect, useState} from "react";


export function useAsync(func, dependencies = []) {
    const {execute, ...state} = useAsyncInternal(func, dependencies, true)
    useEffect(() => {
        execute();
    }, [execute]);
    return state;
}

function useAsyncInternal(func, dependencies = [], initialLoading = false) {
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState();
    const [value, setValue] = useState();

    const execute = useCallback(async (...parents) => {
        try {
            setLoading(true);
            const data = await func(...parents);
            setValue(data);
            setError(undefined);
            return data;
        } catch (err) {
            setValue(undefined);
            setError(err);
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }
    }, [...dependencies]);

    return {loading, error, value, execute}
}
