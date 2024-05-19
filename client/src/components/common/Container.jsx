import MainBackGround from "../common/MainBackGround.jsx";
import CommentCardList from "../CommentCardList.jsx";

const Container = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center mt-20">
                <CommentCardList/>
            </div>
            <div>
                <MainBackGround/>
            </div>


        </>
    );
}

export default Container;