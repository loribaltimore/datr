"use client"
import { signIn } from "next-auth/react";
import { useContext } from 'react';
import { ReviewContext } from 'components/ReviewContext';

export default function SigninBtn({ providerId, providerName }) {
    const {setIsLoading} = useContext(ReviewContext);
    return (
        <button className="block mx-auto text-black bg-white drop-shadow-2xl w-1/2 opacity-70 rounded p-3 hover:scale-105 hover:opacity-100 active:scale-100"
            onClick={() => {
                 setIsLoading(true);
                    try {
                        signOut()
                    } catch {
                        console.log('error signing out');
                    } finally {
                        setIsLoading(false);
                    }
                signIn(providerId, providerName)
            }}
            ><span className="">Sign In with Google</span></button>
    )
};