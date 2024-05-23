import {useCallback, useReducer} from "react";

export function asyncUseReducer(reducer, initialState) {
    // Use a reducer and then create a dispatch function.
    const [state, dispatch] = useReducer(reducer, initialState);

    // This wraps the dispatch function to allow async actions.
    const asyncDispatch = useCallback(
        async action => {
            if (typeof action === "function") {
                await action(dispatch);
            } else {
                dispatch(action);
            }
        },
        [dispatch]
    );

    // Return state and our new async dispatch.
    return [state, asyncDispatch];
}
