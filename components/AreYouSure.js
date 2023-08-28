"use client"
import Link from 'next/link';

export default function AreYouSure({ connection }) {    
    const handleDelete = async () => {
        await fetch('/api/user/connections', {
            method: 'PUT',
            body: JSON.stringify(
                {
                    activeUserId: connection[connection.activelyConnectedAs].id,
                    activeConnectionId: connection._id,
                    isDelete: true
                }
            ),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(data => {
            const res = data.json();
            console.log(res);
        }).catch(err => console.log(err));
    }
    
    return (
        <Link
            className=' py-2 px-3 bg-red-500 hover:bg-red-700 animate: transition scale-105'
            href="/mingle"
            onClick={async() => await handleDelete()}
        >
            Delete
        </Link>
    )
};