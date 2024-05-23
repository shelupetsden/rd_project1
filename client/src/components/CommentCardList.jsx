import React, {useContext} from "react";
import CommentCard from "./CommentCard.jsx";
import {Context} from "./context/MainContext.jsx";


const CommentCardList = () => {
    const {state: {comments}} = useContext(Context);
    console.log('<> comments : ', comments)
    if (comments && comments.length > 0) {

        return (
            <>
                <div className="flex flex-col gap-14">
                    {comments.map((comment) => (
                        <CommentCard key={comment.id}
                                     comment={comment}
                                     level={0}/>
                    ))}
                </div>
            </>
        )
    }

};

export default CommentCardList;