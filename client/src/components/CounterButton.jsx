const CounterButton = ({rateCount}) => {

    return (
        <div className="flex flex-col bg-mainBgColor justify-center h-20 w-8 rounded-sm">
            <button type="button" className="flex justify-center text-gray-400 font-bold">+</button>
            <div className="flex justify-center text-indigo-800 font-bold text-l">{rateCount}</div>
            <button type="button" className="flex justify-center text-gray-400 font-bold">-</button>
        </div>
    )

}


export default CounterButton;