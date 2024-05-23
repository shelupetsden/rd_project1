import {useState} from "react";

const CounterButton = ({comment, onClick}) => {
    const [rateCountValue, setRateCountValue] = useState(comment.rateCount)

    const incrementRateCount = async () => {
        comment.rateCount++;
        setRateCountValue(comment.rateCount);
        onClick(comment)
    }

    const decrementRateCount = async () => {
        if (comment.rateCount > 0) {
            comment.rateCount--;
            setRateCountValue(comment.rateCount);
            onClick(comment)
        }
    }
    return (
        <div className="flex flex-col bg-mainBgColor justify-center h-20 w-8 rounded-sm">
            <button type="button" className="flex justify-center text-gray-400 font-bold"
                    onClick={incrementRateCount}>+
            </button>
            <div className="flex justify-center text-indigo-800 font-bold text-l">{rateCountValue}</div>
            <button type="button" className="flex justify-center text-gray-400 font-bold"
                    onClick={decrementRateCount}>-
            </button>
        </div>
    )

}


export default CounterButton;