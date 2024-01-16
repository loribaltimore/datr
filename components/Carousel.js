import { useState } from 'react';
import Image from 'next/image';

export default function Carousel({ photos }) {
    
    const [counter, setCounter] = useState(0);

    const nextPhoto = () => {
        if (counter + 1 <= photos.length -1) {
             setCounter(prev => prev + 1)
        };
    };

    return (
        <div className="h-1/4 md:w-full md:h-full md:aspect-h-1 md:aspect-w-1 overflow-hidden rounded ">
            {
                photos ?
                    <img
                        // width={500}
                        // height={500}
                        src={`/api/user/photos/${photos[counter]}`}
                        alt="Interior of light green canvas bag with padded laptop sleeve and internal organization pouch."
                        className="w-1/2 h-1/2 mx-auto md:mx-0 md:w-full md:h-full object-cover object-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                        onClick={() => nextPhoto()}
                        />
: null
            }
         </div>
    )
};