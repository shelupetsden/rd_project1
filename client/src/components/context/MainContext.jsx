import {createContext, useMemo} from "react";
import {getAllComments} from "../../services/comments.js";
import {useAsync} from "../../customhooks/hooks.js";

export const Context = createContext(null);

const MainContext = ({children}) => {
    const {loading, error, value: comments = []} = useAsync(getAllComments);

    const commentsByParentId = useMemo(() => {
        if (comments == null) return [];
        const group = {};
        comments.forEach(comment_ => {
                group[comment_.parentId] ||= []
                group[comment_.parentId].push(comment_);
            }
        )
        return group;
    }, [comments])

    function getReplier(parentId) {
        return commentsByParentId[parentId]
    }

    if (loading) return (<h1>Loading...</h1>);
    if (error) return <h1>{error}</h1>;

    return (
        <Context.Provider value={{comments, getReplier, rootComment: commentsByParentId[null]}}>
            {children}
        </Context.Provider>
    );
}

export default MainContext;