"use client"
import { useState } from 'react';

export default function Calculator() {
    const [result, setResult] = useState(0);
    const [input, setInput] = useState(null);
    const [operator, setOperator] = useState(null);
    const [next, setNext] = useState(null);
    const nums = '1234567890';
    console.log(result);
    const handleClick = (event) => {
        if (nums.indexOf(event.target.innerText) !== -1) {
            console.log("IS")
            if (!input) {
            setInput(event.target.innerText);
        } else {
            setNext(event.target.innerText);
        }
        } else {
            if (event.target.innerText !== "=") {
                setOperator(event.target.innerText);
            } else {
                if (operator) {
                    switch (operator) {
                    case "+": setResult(input + next);
                        break;
                    case "-": setResult(input - next);
                        break;
                    case "*": setResult(input * next);
                        break;
                    case "/": setResult(input / next);
                        default: break;
                }
                }
            }
        }
    };

    return (
        <div className="w-1/4 border p-5 space-y-1 text-center">
            <div className='flex'>
               <div>{input}</div> 
               <div>{operator}</div> 
                <div>{next}</div> 
                <p>{result ? ` = ${result}`: null  }</p>
            </div>
            <div className="flex space-x-1">
                <div className=" w-1/3 rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                    onClick={(event) => handleClick(event)}
                >1</div>
                <div className="  w-1/3 rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>2</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>3</div>
            </div>
            <div className="flex space-x-1">
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>4</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>5</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>6</div>
            </div>
            <div className="flex space-x-1">
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>7</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>8</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105  active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>9</div>
            </div>
            <div className="flex space-x-1">
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>+</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105 active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>-</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105  active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>*</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105  active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>/</div>
                <div className=" w-1/3  rounded bg-gray-500 border text-white hover:scale-105  active:scale-90 active:bg-gray-600"
                onClick={(event) => handleClick(event)}>=</div>

            </div>
        </div>
    )
    }