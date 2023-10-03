import database from 'models/database';
import User from 'models/userSchema';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await database();
    const demoUser = await User.findOne({ username: 'demoUser' });
    const jenny = await User.findOne({ username: 'SuperJenny' });
    jenny.membership = demoUser.membership;
    jenny.connections = demoUser.connections;
    jenny.notifications = demoUser.notifications;
    jenny.interestAndPass = demoUser.interestAndPass;
    jenny.rating = demoUser.rating;
    await jenny.save();
    return NextResponse.json({ message: 'Jenny Demoized' });
}