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

const widthVariantsUpdate = new Map();
widthVariantsUpdate.set(1, "w-[476px]");
widthVariantsUpdate.set(2, "w-[376px]");
widthVariantsUpdate.set(3, "w-[276px]");
widthVariantsUpdate.set(4, "w-[176px]");

const CommentCard = ({comment, level}) => {
    const [inputShown, setInputShown] = useState(false)
    const [inputValue, setInputValue] = useState(comment.textMessage)

    const handleUpdate = useCallback((value) => {
        setInputValue(value);
    }, [inputValue]);

    const toggleInputShown = useCallback(() => {
        setInputShown(state => !state);
    }, []);

    const {dispatch} = useContext(Context);

    const updateCommentFn = useAsyncFn(updateComment)
    const deleteCommentFn = useAsyncFn(deleteComment)


    const handleSubmit = (e) => {
        e.preventDefault();
        setInputShown(false)
        if (inputValue === '') {
            commentDelete()
        } else if (comment.textMessage !== inputValue) {
            comment.textMessage = inputValue
            commentUpdate();
        }

    }
    const commentUpdate = () => {
        setInputShown(false)

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


    const shortView = level > 2;
    return (
        <div
            className={`border border-gray-400 border-t-0 border-l-1 border-r-0 border-b-0 pl-4 pt-0 pb-0 gap-4 flex flex-col place-items-end text-base ${getNestedCommentStyle(level)}`}>
            <div
                className={`${inputShown ? 'min-h-56' : 'min-h-36'} flex bg-white border-2  w-full rounded-sm shadow-xl`}>
                <div className="justify-center px-6 py-4">
                    <CounterButton comment={comment} onClick={commentUpdate}/>
                </div>

                <div className="flex flex-col pr-6 py-4 gap-y-3 w-full">
                    <div className="flex gap-3 items-center">
                        <UserIcon base64icon={comment?.user?.base64icon}/>
                        <div className="ont-bold flex flex-2">
                            {shortView ? (<div>{comment?.user?.userName.substring(0, 5) + "..."}</div>) : (
                                <div>{comment?.user?.userName}</div>
                            )
                            }
                        </div>
                        <div className="flex flex-1 text-gray-400">
                            {shortView ? "" : (
                                <div className=""><DateComment date={comment.createAt}></DateComment></div>
                            )
                            }
                        </div>
                        <div className="flex flex-3 flex-row justify-center gap-2">
                            <div>
                                <DeleteButton comment={comment} onClick={commentDelete} disabled={inputShown}
                                              shortView={shortView}/>
                            </div>
                            <EditButton comment={comment} onClick={() => toggleInputShown()} disabled={inputShown}
                                        shortView={shortView}/>
                            <div className={`${inputShown && 'hidden'}`}>
                                <ReplyButton shortView={shortView}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        {inputShown ? (
                            <form onBlur={handleSubmit}>

                                <input type="text" maxLength="320"
                                       className={`h-24 border border-black focus:border-black focus:outline-none ${getNestedUpdateCommentStyle(level)} focus:border-black rounded-lg`}
                                       value={inputValue}
                                       onChange={e => handleUpdate(e.target.value)}/>

                                <div className="flex justify-end">
                                    {inputShown && (
                                        <button type="submit"
                                                className="flex h-10 w-20 items-center justify-center rounded-md bg-indigo-800 text-white text-base disabled:opacity-50"
                                                disabled={comment.textMessage === inputValue}>UPDATE</button>
                                    )}
                                </div>
                            </form>
                        ) : (<p className="break-all">{inputValue}</p>)}
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

function getNestedUpdateCommentStyle(level) {
    return widthVariantsUpdate.get(level) ?? "w-[576px]"
}

export default CommentCard;