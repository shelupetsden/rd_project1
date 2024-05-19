import {DateComment} from "./DateComment..jsx";
import ReplyButton from "./ReplyButton.jsx";
import UserIcon from "./UserIcon.jsx";
import CounterButton from "./CounterButton.jsx";
import {useContext} from "react";
import {Context} from "./context/MainContext.jsx";

const CommentCard = ({comment, level}) => {
    const {getReplier} = useContext(Context);
    const children = getReplier(comment.id);

    return (
        <div
            className={`flex flex-col bg-white h-36 border-2 mt-5 rounded-sm shadow-xl ${getNestedCommentStyle(level)}`}>
            <div className="flex">
                <div className="justify-center px-6 py-4">
                    <CounterButton rateCount={comment.rateCount}/>
                </div>

                <div className="flex flex-col pr-6 py-4 gap-y-3 w-full">
                    <div className="flex gap-3 items-center">
                        <UserIcon base64icon={comment?.user?.base64icon}/>
                        <div className="font-bold flex flex-2">{comment?.user?.userName}</div>
                        <div className="flex flex-1 text-gray-400"><DateComment date={comment.createAt}/>
                        </div>
                        <div className="flex flex-3 flex-row justify-center gap-2">
                            {/*<DeleteButton/>*/}
                            {/*<EditButton/>*/}
                            <ReplyButton/>
                        </div>
                    </div>
                    <div className="flex">
                        {comment.textMessage}
                    </div>
                </div>
            </div>
                {children && children.map(child => <CommentCard key={child.id} comment={child}
                                                                level={level + 1}/>)}
        </div>
    )

}


function getNestedCommentStyle(level) {
    if (level === 1) {
        return "w-[600px]"
    }

    if (level === 2) {
        return "w-[500px]"
    }

    if (level === 3) {
        return "w-[400px]"
    }

    return "w-[700px]"

}

export default CommentCard;