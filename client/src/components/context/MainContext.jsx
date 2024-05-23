import {createContext, useEffect} from "react";
import commentReducer from "../state/reducer.js";
import {useAsync} from "../../customhooks/hooks.js";
import {getAllComments} from "../../services/comments.js";
import {asyncUseReducer} from "../state/customReducer.js";

export const Context = createContext(null);

const MainContext = ({children}) => {

    const {loading, error, value: comments = []} = useAsync(getAllComments);

    useEffect(() => {
        dispatch({type: 'POPULATE_COMMENTS', payload: comments});
    }, [loading, comments]);

    const [state, dispatch] = asyncUseReducer(commentReducer, {comments: []});

    if (loading) return (<h1>Loading...</h1>);
    if (error) return <h1>{error}</h1>;

    return (
        <Context.Provider value={{state, dispatch}}>
            {children}
        </Context.Provider>
    );
}

export default MainContext;