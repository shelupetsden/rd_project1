import React, {useCallback, useContext, useState} from "react";
import ReplyButton from "./element/ReplyButton.jsx";
import UserIcon from "../user/UserIcon.jsx";
import CounterButton from "./element/CounterButton.jsx";
import {Context} from "../context/MainContext.jsx";
import DeleteButton from "./element/DeleteButton.jsx";
import EditButton from "./element/EditButton.jsx";
import {useAsyncFn} from "../../customhooks/hooks.js";
import {updateComment} from "../../services/comments.js";
import DeleteCommentDialog from "./element/DeleteCommentDialog.jsx";
import NewCommentCard from "./NewCommentCard.jsx";
import DateComment from "./element/DateComment..jsx";
import UserLabel from "../user/UserLabel.jsx";
import UserName from "../user/UserName.jsx";

const widthVariants = new Map([
    [0, "w-[700px]"],
    [1, "w-[600px]"],
    [2, "w-[500px]"],
    // [3, "w-[400px]"],
    // [4, "w-[300px]"],
]);

const widthVariantsUpdate = new Map([
    [0, "w-[576px]"],
    [1, "w-[476px]"],
    [2, "w-[376px]"],
    // [3, "w-[276px]"],
    // [4, "w-[176px]"],
]);

const getNestedUpdateCommentStyle = (level) => widthVariantsUpdate.get(level) ?? "w-[376px]";
const getNestedCommentStyle = (level) => widthVariants.get(level) ?? "w-[500px]";

const CommentCard = ({comment, level}) => {
    const {currentUser, dispatch} = useContext(Context);
    const [isOpen, setIsOpen] = useState(false);
    const [editShown, setEditShown] = useState(false);
    const [replyShow, setReplyShow] = useState(false);
    const [inputValue, setInputValue] = useState(comment.textMessage);
    const match = comment.textMessage.match(/@[^@\s]+/);
    const handleUpdate = useCallback((value) => {
        if (match && !value.startsWith(`${match[0]} `)) {
            setInputValue(`${match[0]} `);
        } else {
            setInputValue(value);
        }
    }, []);

    const toggleInputShown = useCallback(() => {
        setEditShown((prev) => !prev);
    }, []);

    const updateCommentFn = useAsyncFn(updateComment);

    const handleSubmit = (e) => {
        e.preventDefault();
        setEditShown(false);

        if (inputValue === '') {
            handleDelete();
        } else if (comment.textMessage !== inputValue) {
            comment.textMessage = inputValue;
            commentUpdate();
        }
    };

    const handleBlur = () => {
        handleCleanup();
    };

    const handleCleanup = () => {
        setEditShown(false);
        setInputValue(comment.textMessage);
    };

    const handleDelete = () => {
        setIsOpen(true);
    };

    const commentUpdate = () => {
        updateCommentFn
            .execute(comment.id, comment)
            .then((updatedComment) => dispatch({type: "UPDATE_COMMENT_SUCCESS", payload: updatedComment}))
            .catch((error) => dispatch({type: "UPDATE_COMMENT_FAIL", payload: error}))
            .finally(() => handleCleanup());
    };

    const shortView = false//level > 3;
    const shortIconsView = false//level > 1;

    const isCommentOwner = currentUser.id === comment.user.id;
    const updateDisabled = comment.textMessage.trim() === inputValue.trim();
    return (
        <div
            className={`border border-gray-400 border-t-0 border-l-1 border-r-0 border-b-0 pl-4 pt-0 pb-0 gap-4 flex flex-col place-items-end text-base ${getNestedCommentStyle(level)}`}>
            <DeleteCommentDialog isOpen={isOpen} setIsOpen={setIsOpen} id={comment.id}/>
            <div
                className={`${editShown ? 'min-h-56' : 'min-h-36'} flex bg-white border-2 w-full rounded-sm shadow-xl`}>
                <div className="justify-center px-6 py-4">
                    <CounterButton comment={comment} onClick={commentUpdate} disabled={isCommentOwner}/>
                </div>
                <div className="flex flex-col pr-6 py-4 gap-y-3 w-full break-all">
                    <div className="flex gap-3 items-center">
                        <UserIcon base64icon={comment?.user?.base64icon}/>
                        <UserName shortView={shortView} userName={comment?.user?.userName}/>
                        {isCommentOwner && <UserLabel/>}
                        <div className="flex flex-1 text-gray-400">
                            {!shortView && <DateComment date={comment.createAt}/>}
                        </div>
                        <div className="flex flex-3 flex-row justify-center gap-2">
                            {isCommentOwner &&
                                <DeleteButton comment={comment} onClick={handleDelete} disabled={editShown || replyShow}
                                              shortView={shortIconsView}/>}
                            {isCommentOwner && <EditButton comment={comment} onClick={toggleInputShown}
                                                           disabled={editShown || replyShow}
                                                           shortView={shortIconsView}/>}
                            {!editShown && !replyShow && !isCommentOwner && (
                                <ReplyButton shortView={shortIconsView} setReplyShow={setReplyShow}
                                             disabled={editShown || replyShow}/>
                            )}
                        </div>
                    </div>
                    <div className="flex">
                        {editShown ? (
                            <form onBlur={handleBlur}>
                                <textarea
                                    maxLength="320"
                                    id="comment"
                                    rows="4"
                                    className={`h-24 border border-black focus:border-black focus:outline-none ${getNestedUpdateCommentStyle(level)} rounded-lg`}
                                    value={inputValue}
                                    onChange={(e) => handleUpdate(e.target.value)}>
                                </textarea>
                                <button
                                    type="button"
                                    className="flex h-10 w-20 items-center justify-center rounded-md bg-indigo-800 text-white text-base disabled:opacity-50"
                                    disabled={updateDisabled}
                                    onMouseDown={handleSubmit}>
                                    UPDATE
                                </button>
                            </form>
                        ) : (
                            <p className="break-all">{inputValue}</p>
                        )}
                    </div>
                </div>
            </div>
            {replyShow && <NewCommentCard level={level} replyUser={comment.user} parentCommentId={comment.id}
                                          setReplyShow={setReplyShow} user={currentUser}/>}
            {comment.children && comment.children.map((child) => (
                <CommentCard key={child.id} comment={child} level={level + 1}/>
            ))}
        </div>
    );
};

export default CommentCard;