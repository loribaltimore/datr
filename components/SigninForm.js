"use client"
import {useState} from "react";
import {getProviders, signIn} from "next-auth/react"


export default function SigninForm(){
    return (
        <div className={"font-extralight block space-y-2 w-1/2 mx-auto"}>
            <button
                onClick={async () => {
                    signIn('credentials', {
                        username: "datr.demo@gmail.com",
                    })
                }}
                className={"block mx-auto text-black bg-white drop-shadow-2xl w-1/2 opacity-70 rounded p-3 hover:scale-105 hover:opacity-100 active:scale-100"}
            >Demo</button>
        </div>
    )
}
