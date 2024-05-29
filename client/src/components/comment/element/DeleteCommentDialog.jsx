import React, {useContext} from 'react';
import {Dialog, DialogTitle} from '@headlessui/react';
import {Context} from "../../context/MainContext.jsx";
import {useAsyncFn} from "../../../customhooks/hooks.js";
import {deleteComment} from "../../../services/comments.js";

export default function DeleteCommentDialog({id, isOpen, setIsOpen}) {
    const {dispatch} = useContext(Context);
    const deleteCommentFn = useAsyncFn(deleteComment)

    const commentDelete = () =>
        deleteCommentFn
            .execute(id)
            .then(comment => dispatch({type: "DELETE_COMMENT_SUCCESS", payload: comment}))
            .catch(comment => dispatch({type: "DELETE_COMMENT_FAIL", payload: comment}))

    return (
        <>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-black opacity-30" onClick={() => setIsOpen(false)}/>

                    <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto p-6 z-20">
                        <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                            Delete comment
                        </DialogTitle>
                        <p className="mt-4 text-sm text-gray-600">
                            Are you sure you want to delete this comment? This will remove the comment and can't be
                            undone.
                        </p>
                        <div className="mt-6 mx- flex justify-between">
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                NO, CANCEL
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-md"
                                onClick={() => {
                                    commentDelete()
                                    setIsOpen(false);
                                }}
                            >
                                YES, DELETE
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}