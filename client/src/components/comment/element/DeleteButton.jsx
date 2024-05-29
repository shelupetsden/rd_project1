import React from "react";

const DeleteButton = ({onClick, disabled, shortView}) => {

    return (<div>
        <button onClick={onClick} disabled={disabled}
                className="flex justify-between items-center gap-1 text-red-600 font-bold disabled:opacity-50">
            <div className="w-4 h-5">
                <svg fill="currentColor" height="18px" width="14px" viewBox="0 0 14 18"
                     xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path
                            d="M1,16 C1,17.1 1.9,18 3,18 L11,18 C12.1,18 13,17.1 13,16 L13,4 L1,4 L1,16 L1,16 Z M14,1 L10.5,1 L9.5,0 L4.5,0 L3.5,1 L0,1 L0,3 L14,3 L14,1 L14,1 Z"/>
                    </g>
                </svg>
            </div>
            {shortView ? '' : 'Delete'}
        </button>
    </div>)
}


export default DeleteButton;
