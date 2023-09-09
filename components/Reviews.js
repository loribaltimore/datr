"use client"
import { useState, useContext } from 'react';
import ReviewPanel from 'components/ReviewPanel';
import ReviewInput from 'components/ReviewInput';
import { ReviewContext } from 'components/ReviewContext';
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
 const user = {
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

export default function Reviews({ connection }) {
    const { currentMongoConnection, setShowReviews } = useContext(ReviewContext);
  const [updatedReviews, setUpdatedReviews] = useState([]);
    const formattedConnection = connection && typeof connection === 'object'? connection : JSON.parse(connection);
  const flooredRating = Math.round(formattedConnection.rating.date.total / formattedConnection.rating.date.count);
  
    return <div className="border border-black m-auto mt-28 items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded w-3/4">
            <div className='w-100 mx-auto flex mb-10'>
                <div className='flex space-x-4'>
                    <div className='flex'>
                        <div className="p-5 sm:flex space-x-5">
            <div className=" flex-shrink-0">
              <img className="mx-auto h-12 w-12 rounded-full" src={user.imageUrl} alt="" />
            </div>
            <div className=" mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-4xl font-extralight text-gray-900">{formattedConnection.name}</p>
                            </div>
                        </div>
            </div>
                <h1 className='text-[4rem] text-black flex w-100 font-extralight space-x-5'>{flooredRating}
            <svg xmlns="http://www.w3.org/2000/svg" fill="goldenrod" viewBox="0 0 24 24" strokeWidth={1.5} stroke="goldenrod" className="w-[2rem] h-[2rem]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            </h1>
                </div>
            </div>
            <ReviewPanel connection={typeof connection == 'object' ? JSON.stringify(connection) : connection} updatedReviews={updatedReviews} />
          <div className='mt-16'>
                <ReviewInput connection={connection}
                    setUpdatedReviews={setUpdatedReviews}
                    currentMongoConnection={JSON.stringify(currentMongoConnection)}
            />
             <button className='block mx-auto text-black border border-black py-3 px-5 rounded'
                    onClick={() => {setShowReviews(false)}}
                >back</button>
      </div> 
        </div>
};