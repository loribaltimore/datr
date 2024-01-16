import {NextResponse} from 'next/server';
import { headers } from 'next/headers';


export async function middleware(request) {
    const cookie = headers().get('cookie') ?? '';
    const regex = /_next|\/api\/auth/g;
    if (request.url !== `${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/` && request.url !== `${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/auth/signin`) {
        if (request.url !== `${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/api/auth/session`
            && !request.url.match(regex)) {
            let toPass = 1;
            const response = await fetch(`${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/api/auth/session`, {
                headers: {
                    cookie
                },
            }).then(async data => {
                const session = await data.json();
                if (Object.keys(session).length > 0) {
                    const {userId} = session;
                    // put something in the session that shows that the user has built their profile enough to use the website.
                //      await fetch(`${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/api/user/validate`,
                //         {
                //             method: "POST",
                //             body: JSON.stringify({userId}),
                //             headers: {
                //                 "Content-Type": "application/json"
                //             }
                //         }).then(async data => {
                //             data = await data.json();
                //         if (data.valid) {
                //             toPass = 0;
                //         };
                //     })
                // .catch(err => console.log(err));
                } else {
                    toPass = 2;
                }
            }).catch(err => console.log(err));
            if (toPass === 1) {
                return NextResponse.next();
            } else if (toPass === 2){

                return NextResponse.redirect(`${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/`);
            } else {

                return NextResponse.redirect(`${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/user/registration`);
            }
        } 
    } else {
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/api/auth/session`, {
                headers: {
                    cookie
                },
            }).then(async data => {
                const session = await data.json();
                if (Object.keys(session).length > 0) {
                    return true;
                } else {
                    return false;
                }
            }).catch(err => console.log(err));
        if (response) {
            return NextResponse.redirect(`${process.env.NODE_ENV === 'development' ? process.env.LOCAL_URL : process.env.NEXTAUTH_URL}/dashboard`)
        };
    }
};
