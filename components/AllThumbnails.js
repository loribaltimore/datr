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
        <div className='w-full p-2'>
                        <h1 className='text-2xl md:text-5xl font-extralight p-5 w-full border-b border-white px-8 md:px-20 lg:px-0'>Admirers</h1>
            <div className='absolute w-full h-100 z-40 gap-4 mx-12 lg:mx-6'>
                
                    {
                        bankConnection || showUpgrade ?
                        showUpgrade ?
                            <div className='md:ml-11 xl:m-32'>
                                <Upgrade /> 
                                </div> :
                                    <AllProfiles allMingles={[JSON.stringify(formattedLikedBy)]}
                                        currentUser={currentUser}
                                        isBank={false}
                                        isRev={true}
                                    />
                                : null
}
            </div>
            
        <div className="md:grid md:grid-cols-4 md:grid-flow-cols md:gap-2 md:p-5 w-10/12 mt-10 ml-12 lg:ml-0">
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
