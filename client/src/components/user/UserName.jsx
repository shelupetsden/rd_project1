import React from "react";

const UserName = ({shortView, userName}) => {
    return <div className="font-bold flex flex-2">
        {shortView ? (<div>{userName.substring(0, 5) + "..."}</div>) : (
            <div>{userName}</div>)
        }
    </div>;
}
export default UserName;