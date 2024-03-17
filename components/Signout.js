"use client"
import { signOut } from "next-auth/react";
import { useContext } from 'react';
import { ReviewContext } from 'components/ReviewContext';
import { useSession } from 'next-auth/react';

export default function Signout(){
    const { setIsLoading } = useContext(ReviewContext);
    const { data: session } = useSession();
    
    const handleClick = async () => { 
        if (session.userId.toString() === '651c55cc39da08792ffa69b6') {
            await fetch('api/demoize', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(data => data).catch(err => console.log(err));
        }
    };
    return (
        <div className=" mx-auto w-1/2  drop-shadow-2xl  text-black rounded md:mt-28 py-24 space-y-10 block">
            <div className="font-extralight">
                <h1 className="md:text-[5rem] text-3xl text-center">Sign Out?</h1>
            </div>
        <button className="block mx-auto text-black bg-white drop-shadow-2xl w-3/4 md:w-3/4 opacity-70 rounded p-3 hover:scale-105 hover:opacity-100 active:scale-100"
            onClick={() => {
                setIsLoading(true);
                handleClick();
                    try {
                        signOut()
                    } catch {

                    } finally {
                        setIsLoading(false);
                    }
                }}
            ><span className="text-xs md:text-lg">Continue to Sign Out</span></button>
    </div>
    )
};
