const UserIcon = ({base64icon}) => {
    const imageUrl = `data:image/jpeg;base64,${base64icon}`
    return (
        <img src={imageUrl}
             className="h-8 w-8 rounded-full flex flex-2" alt="icon"/>
    );

}

export default UserIcon;