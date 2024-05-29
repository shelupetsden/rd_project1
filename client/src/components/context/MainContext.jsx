import {createContext, useEffect} from "react";
import reducer from "../state/reducer.js";
import {useAsync, useAsyncFn} from "../../customhooks/hooks.js";
import {getAllComments} from "../../services/comments.js";
import {asyncUseReducer} from "../state/customReducer.js";
import {getUserById, getUserId} from "../../services/users.js";

export const Context = createContext(null);

const MainContext = ({children}) => {
    const {loading, error, value: comments = []} = useAsync(getAllComments);
    const [state, dispatch] = asyncUseReducer(reducer, {comments: [], user: {}});
    const currentUserId = getUserId();

    useEffect(() => {
        dispatch({type: 'POPULATE_COMMENTS', payload: comments});
    }, [loading, comments]);

    const getUserByIdFn = useAsyncFn(getUserById);

    useEffect(() => {
        console.log(currentUserId);
        if (currentUserId) {
            getUserByIdFn
                .execute(currentUserId)
                .then(user => {
                    dispatch({type: 'GET_CURRENT_USER_SUCCESS', payload: user});
                })
                .catch(error => {
                    console.error("Failed to fetch user:", error);
                });
        }
    }, [currentUserId]);

    const currentUser = state.user;
    if (loading || !currentUser) return (<h1>Loading...</h1>);
    if (error) return <h1>{error}</h1>;


    return (
        <Context.Provider value={{state, dispatch, currentUser}}>
            {children}
        </Context.Provider>
    );
}

export default MainContext;