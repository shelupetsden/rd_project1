import React, {useCallback, useContext, useState} from "react";
import UserIcon from "../user/UserIcon.jsx";
import {createComment} from "../../services/comments.js";
import {Context} from "../context/MainContext.jsx";
import {useAsyncFn} from "../../customhooks/hooks.js";

const widthVariantsUpdate = new Map([
    [0, "w-[515px]"],
    [1, "w-[415px]"],
    [2, "w-[315px]"],
    // [3, "w-[215px]"],
    // [4, "w-[115px]"]
]);

const widthVariants = new Map([
    [0, "w-[700px]"],
    [1, "w-[600px]"],
    [2, "w-[500px]"],
    // [3, "w-[400px]"],
    // [4, "w-[300px]"]
]);

const getNestedUpdateCommentStyle = (level) => widthVariantsUpdate.get(level) ?? "w-[315px]";
const getNestedCommentStyle = (level) => widthVariants.get(level) ?? "w-[500px]";

const NewCommentCard = ({level, replyUser, parentCommentId, setReplyShow, user}) => {
    const {dispatch} = useContext(Context);
    const [inputValue, setInputValue] = useState(`@${replyUser.userName} `);

    const handleCreate = useCallback((value) => {
        if (!value.startsWith(`@${replyUser.userName} `)) {
            setInputValue(`@${replyUser.userName} `);
        } else {
            setInputValue(value);
        }

    }, []);

    const handleBlur = (e) => {
        e.preventDefault();
        setReplyShow(false);
    };

    const createCommentFn = useAsyncFn(createComment);

    const commentCreate = (newComment) => {
        createCommentFn
            .execute({newComment})
            .then(comment => dispatch({type: "CREATE_COMMENT_SUCCESS", payload: comment}))
            .catch(error => dispatch({type: "CREATE_COMMENT_FAIL", payload: error}));
    };

    const handleSubmit = () => {
        setReplyShow(false);
        commentCreate(getComment());
    };

    const getComment = () => {
        return {
            userId: user.id,  // Assuming user.id is the correct user ID
            textMessage: inputValue,
            parentId: parentCommentId,
            replyUser: {
                id: replyUser.id,
            }
        };
    };

    const buttonDisabled = inputValue.replaceAll(`@${replyUser.userName}`, '').trim() === '';
    return (
        <div
            className={`border border-gray-400 border-t-0 border-l-1 border-r-0 border-b-0 pl-4 pt-0 pb-0 gap-4 flex flex-col place-items-end text-base ${getNestedCommentStyle(level)}`}>
            <div className="flex bg-white border-2 w-full rounded-sm shadow-xl">
                <div className="flex items-start px-6 py-4 w-full">
                    <div className="flex gap-3">
                        <UserIcon base64icon={user?.base64icon}/>
                        <form className="flex" onBlur={handleBlur}>
                            <textarea
                                maxLength="320"
                                id="comment"
                                rows="4"
                                placeholder="Add a comment..."
                                className={`h-24 border border-black focus:border-black focus:outline-none ${getNestedUpdateCommentStyle(level)} focus:border-black rounded-lg`}
                                value={inputValue}
                                onChange={(e) => handleCreate(e.target.value)}></textarea>
                            <div className="flex justify-end px-2">
                                <button
                                    type="button"
                                    className="flex h-10 w-20 items-center justify-center rounded-md bg-indigo-800 text-white text-base disabled:opacity-50"
                                    disabled={buttonDisabled}
                                    onMouseDown={handleSubmit}>
                                    REPLY
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCommentCard;