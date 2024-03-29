"use client"
import { useState, useContext, useEffect } from 'react';
import { ReviewContext } from 'components/ReviewContext';
import ProfileCard from './ProfileCard';
import calculateDistance from '@/util/calculateDistance';
import Matched from 'components/Matched';
import Reviews from 'components/Reviews';
import QuizResults from 'components/QuizResults';
import {useRouter, usePathname} from 'next/navigation';

export default function AllProfiles({ allMingles, setAllLikedBy, currentUser, isBank, isRev }) {
    const [counter, setCounter] = useState(0);
    const [compatibility, setCompatibility] = useState(undefined);
    const path = usePathname();
    console.log(path);
    useEffect(() => {
        // const asyncWrapper = async () => {
        //     await fetch('/api/user/mingles', {
        //         method: 'GET',
        //         headers: {
        //         'Content-Type': 'application/json'
        //         }
        //     }).then(async data => {
        //         const { allMingles } = await data.json();
        //         console.log(allMingles)
        //         // setFetchedMingles(allMingles);
        //     }).catch(err => console.log(err));
        // };
        // if (counter === 1) {
        //     console.log('SPARKY');
            // asyncWrapper();
        // } else {
        //     console.log('NOT SPARKY');
        // console.log(allMingles.length, counter - 1);
        // }
    }, []);

    const { showReviews, bankConnection } = useContext(ReviewContext);
    const [connection, setConnection] = useState(false);
    allMingles =  JSON.parse(allMingles);
    const currentUserFormatted = typeof currentUser === 'string' ? JSON.parse(currentUser) : currentUser;
    const currentMingle = bankConnection || allMingles[counter] || undefined;
    let distance;
    if (currentMingle) {
       distance =  calculateDistance(currentMingle.location.geo.coordinates, currentUserFormatted.location.geo.coordinates);
    };

    return (
        <div className={`${path === "/mingle" ? "w-10/12 ml-10 lg:ml-6  md:mt-28" : null} ${path === "/bank" ? "md:ml-14 lg:ml-0 w-3/4 md:mt-10 " : "md:ml-24 md:mt-10 lg:ml-0"} border border-black w-11/12 items-center overflow-hidden bg-white md:w-10/12 px-4  pb-8 pt-14 drop-shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-6 rounded lg:w-11/12`}>
            {
                connection ?
                    <QuizResults
                        setConnection={setConnection}
                        connection={connection}
                        compatibility={compatibility}
                            /> 
                    :
                    !showReviews ?
                            <ProfileCard
                            user={currentMingle}
                            setCounter={setCounter}
                            counter={counter}
                            currentUser={typeof currentUser === 'string' ? currentUser : JSON.stringify(currentUser)}
                            distance={distance}
                            setConnection={setConnection}
                            isBank={isBank}
                            isRev={isRev}
                            setAllLikedBy={setAllLikedBy}
                            setCompatibility={setCompatibility}
                            /> 
                        : <Reviews connection={currentMingle} />
            }
        </div>
    )
};

//make location save at registration