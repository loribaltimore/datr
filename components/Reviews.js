"use client"
import { useState } from 'react';
import ReviewPanel from 'components/ReviewPanel';
import ReviewInput from 'components/ReviewInput';
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const chartConfig = {
  labels: [
    '< 3',
        '5',
        '4',
        '3'
  ],
  datasets: [{
    label: 'Dates',
    data: [4, 7, 3, 1],
    backgroundColor: [
        'red',
        'goldenrod',
        'green',
        'blue',
    ],
    hoverOffset: 4
  }]
};

export default function Reviews({ setShowReviews, connection, currentMongoConnection }) {
    console.log(currentMongoConnection)
    const [updatedReviews, setUpdatedReviews] = useState([]);
    const averageRating = 5;
    return <div>
        <div className=" m-auto min-w-[63rem] h-[30rem] overflow-y-auto mt-28 items-center bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-xl w-3/4">
            <div className='w-100 mx-auto flex mb-10'>
                <div className='w-1/4'>
            <Doughnut data={chartConfig} />
                </div>
 <div className='block mx-auto '>
                <h1 className='text-[8rem] text-black text-center flex w-100 space-x-5'>{averageRating}
            <svg xmlns="http://www.w3.org/2000/svg" fill="goldenrod" viewBox="0 0 24 24" strokeWidth={1.5} stroke="goldenrod" className="w-[5rem] h-[5rem]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            </h1>
                </div>
                <button className='bg-indigo-500 h-[2rem] px-3 rounded-lg'
                    onClick={() => {setShowReviews(false)}}
                >back</button>
            </div>
            <ReviewPanel connection={connection} updatedReviews={updatedReviews} />
            <div className='mt-5'>
                {
                    
                        !currentMongoConnection.date.review[currentMongoConnection.activelyConnectedAs] ?
                        <ReviewInput connection={connection}
                            setUpdatedReviews={setUpdatedReviews}
                            currentMongoConnection={JSON.stringify(currentMongoConnection)} />
                        : null
                }
        </div>
        </div>
        </div>
};