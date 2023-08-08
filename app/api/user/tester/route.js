import User from 'models/userSchema';
import { getServerSession } from 'next-auth/next';
import {getPhotos} from 'lib/getPhotos';
import { authOptions } from '../../auth/[...nextauth]/route.js';
import {NextResponse} from 'next/server';


export async function GET(request) {
     const session = await getServerSession(authOptions);
     const { userId } = session;
        const formattedId = userId.toString();
    const currentUser = await User.findById(formattedId).then(data => {return data}).catch(err => console.log(err));
    let allLikedBy = await currentUser.populate('connections.pending')
        .then(data => { return data.connections.pending }).catch(err => console.log(err));
    const allPhotos = allLikedBy.map((element, index) => {
        return element.photos[0];
    })
    const allUserPhotos = await getPhotos(allPhotos);
    allLikedBy = allLikedBy.map((element, index) => {
        return {user: element, photoUrl: allUserPhotos[index]}
     })
        return NextResponse.json({ allLikedBy, membershipType: currentUser.membershipType, currentUser })
};
