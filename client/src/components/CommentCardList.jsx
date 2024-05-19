import {useContext} from "react";
import CommentCard from "./CommentCard.jsx";
import {Context} from "./context/MainContext.jsx";


const CommentCardList = () => {
    const {rootComment} = useContext(Context);
    if (rootComment && rootComment.length > 0) {
        return (
            <>
                {/*{rootComment.map((comment) => (*/}
                {/*        <div key={comment.id}>*/}
                <div className="flex flex-col gap-14">
                    <CommentCard comment={rootComment[0]} level={0}/>
                </div>
                {/*</div>*/}
                {/*)*/}
                {/*)}*/}
            </>
        )
    }

};

export default CommentCardList;