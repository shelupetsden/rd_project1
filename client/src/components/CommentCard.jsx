import {DateComment} from "./DateComment..jsx";
import ReplyButton from "./ReplyButton.jsx";
import UserIcon from "./UserIcon.jsx";
import CounterButton from "./CounterButton.jsx";
import React, {useCallback, useContext, useState} from "react";
import {Context} from "./context/MainContext.jsx";
import DeleteButton from "./DeleteButton.jsx";
import EditButton from "./EditeButton.jsx";
import {useAsyncFn} from "../customhooks/hooks.js";
import {deleteComment, updateComment} from "../services/comments.js";

const widthVariants = new Map();
widthVariants.set(1, "w-[600px]");
widthVariants.set(2, "w-[500px]");
widthVariants.set(3, "w-[400px]");
widthVariants.set(4, "w-[300px]");

const CommentCard = ({comment, level}) => {
    const [inputShown, setInputShown] = useState(false)
    const [inputValue, setInputValue] = useState(comment.textMessage)

    const handleUpdate = useCallback((value) => {
        comment.textMessage = value;
        setInputValue(value);
    }, [comment]);

    const toggleInputShown = useCallback(() => {
        setInputShown(state => !state);
    }, []);

    const {dispatch} = useContext(Context);

    const updateCommentFn = useAsyncFn(updateComment)
    const deleteCommentFn = useAsyncFn(deleteComment)


    const commentUpdate = () => {
        updateCommentFn
            .execute(comment.id, comment)
            .then(comment => dispatch({type: "UPDATE_COMMENT_SUCCESS", payload: comment}))
            .catch(comment => dispatch({type: "UPDATE_COMMENT_FAIL", payload: comment}))
    }

    const commentDelete = () =>
        deleteCommentFn
            .execute(comment.id)
            .then(comment => dispatch({type: "DELETE_COMMENT_SUCCESS", payload: comment}))
            .catch(comment => dispatch({type: "DELETE_COMMENT_FAIL", payload: comment}))


    return (
        <div
            className={`border border-gray-400 border-t-0 border-l-1 border-r-0 border-b-0 pl-4 pt-0 pb-0 gap-4 flex flex-col place-items-end ${getNestedCommentStyle(level)}`}>
            <div className="flex bg-white h-36 border-2  w-full rounded-sm shadow-xl">
                <div className="justify-center px-6 py-4">
                    <CounterButton comment={comment} onClick={commentUpdate}/>
                </div>

                <div className="flex flex-col pr-6 py-4 gap-y-3 w-full">
                    <div className="flex gap-3 items-center">
                        <UserIcon base64icon={comment?.user?.base64icon}/>
                        <div className="font-bold flex flex-2">{comment?.user?.userName}</div>
                        <div className="flex flex-1 text-gray-400"><DateComment date={comment.createAt}/>
                        </div>
                        <div className="flex flex-3 flex-row justify-center gap-2">
                            <DeleteButton comment={comment} onClick={commentDelete}/>
                            <EditButton comment={comment} onClick={() => toggleInputShown()}/>
                            <ReplyButton/>
                        </div>
                    </div>
                    <div className="flex">
                        {inputShown ? (
                            <form
                                className={`bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 ${getNestedCommentStyle(level)}`}
                                onSubmit={commentUpdate}>
                                <input className={`${getNestedCommentStyle(level)}`}
                                       value={inputValue}
                                       onChange={e => handleUpdate(e.target.value)}/></form>
                        ) : (<p>{inputValue}</p>)}

                    </div>
                </div>
            </div>
            {comment.children && comment.children.map(child => <CommentCard key={child.id} comment={child}
                                                            level={level + 1}/>)}
        </div>
    )

}


function getNestedCommentStyle(level) {
    return widthVariants.get(level) ?? "w-[700px]"
}

export default CommentCard;