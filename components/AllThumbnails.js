"use client"
import Upgrade from 'components/Upgrade';
import BankThumbnail from 'components/BankThumbnail';
import AllProfiles from 'components/AllProfiles';
import Reviews from 'components/Reviews';
import { ReviewContext } from 'components/ReviewContext';
import { useState, useContext } from 'react';

export default function AllThumbnails({ allLikedBy, setAllLikedBy, membershipType, currentUser }) {
    const { showReviews, showUpgrade, bankConnection } = useContext(ReviewContext);
    const formattedLikedBy = allLikedBy.map((element, index) => {
        return element.user;
    });
    return (
        <div className='w-100 p-2'>
                        <h1 className='text-2xl md:text-5xl font-extralight p-5 w-3/4 border-b border-white px-8 md:px-20 lg:px-0'>Admirers</h1>
            <div className='absolute w-100 h-100 z-40 gap-4 mx-12'>
                
                    {
                        bankConnection || showUpgrade ?
                        showUpgrade ?
                            <div className='md:ml-11 xl:m-32'>
                                <Upgrade /> 
                                </div> :
                                <div className="md:min-w-[40.5rem]">
                                    <AllProfiles allMingles={[JSON.stringify(formattedLikedBy)]}
                                        currentUser={currentUser}
                                        isBank={false}
                                        isRev={true}
                                    />
                                </div> : null
}
            </div>
            
        <div className="md:grid grid-cols-5 grid-flow-cols md:gap-2 md:p-5 lg:w-full mt-10 ml-20 lg:ml-0">
            {
                allLikedBy.length ?
                allLikedBy.map((connection, index) => { 
                    return <BankThumbnail connection={connection} currentUserPersonality={JSON.stringify(currentUser.personality)} index={index} key={index}  membershipType={membershipType} />
                })
                    : null
            }
            </div>
             </div>
    )
};
