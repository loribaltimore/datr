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
        <div className="w-3/4 bg-white border border-black text-black rounded m-36 py-24 space-y-10 block">
            <div className="font-extralight">
                <h1 className="text-[5rem] text-center">Sign Out?</h1>
            </div>
            <button className="block mx-auto text-black border border-black w-2/3 rounded p-3"
            onClick={() => {
                setIsLoading(true);
                handleClick();
                    try {
                        signOut()
                    } catch {
                        console.log('error signing out');
                    } finally {
                        setIsLoading(false);
                    }
                }}
            ><span className="">Continue to Sign Out</span></button>
    </div>
    )
};


//want to use Next Image componenet
//add loading bar and flash?
//seed more users