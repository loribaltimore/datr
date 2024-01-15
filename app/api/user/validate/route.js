import { NextResponse } from "next/server";
import User from 'models/userSchema';
import database from 'models/database';
export async function POST(request){
    const {userId} = await request.json();

    await database();
    const currentUser = await User.findById(userId);
        if (currentUser.hobbies.length){
            return NextResponse.json({valid: true});
        }
    return NextResponse.json({valid: false});
};