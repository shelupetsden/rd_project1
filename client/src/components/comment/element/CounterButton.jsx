import {useState} from "react";

const CounterButton = ({comment, onClick, disabled}) => {
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
        <div
            className={`flex flex-col bg-mainBgColor justify-center h-20 w-8 rounded-sm dark:opacity-50" ${disabled ? "opacity-50" : ""}`}>
            <button type="button" className="flex justify-center text-gray-400 font-bold"
                    onClick={incrementRateCount} disabled={disabled}>+
            </button>
            <div className="flex justify-center text-indigo-800 font-bold text-l">{rateCountValue}</div>
            <button type="button" className="flex justify-center text-gray-400 font-bold" disabled={disabled}
                    onClick={decrementRateCount}>-
            </button>
        </div>
    )

}


export default CounterButton;