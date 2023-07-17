"use client"
import ChatWindow from 'components/ChatWindow';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function All(props) {
  const [allMessages, setAllMessages] = useState([]);
  const [connection, setConnection] = useState(undefined);
  const [dateInvite, setDateInvite] = useState({});
  const pathname = usePathname();
  const connectionId = pathname.split('/')[2];

  useEffect(() => {
    const asyncWrapper = async () => {
      await fetch(`/api/user/connections?connectionId=${connectionId}`, {
        method: 'GET'
      })
        .then(async data => {
          let { connection } = await data.json();
          connection = JSON.parse(connection);
          console.log(connection)
          setAllMessages(connection.conversation);
          setConnection(connection);
          if (!connection.date.invite.accepted) {
            if (connection.date.invite.date) {
              if (connection.date.sentBy !== connection[connection.activelyConnectedAs].id) {
                // date invite sent by other user
            setDateInvite(true)
              } else {
                // date invite sent by this user
            setDateInvite(false);
          }
            } else {
              setDateInvite(0);
            }
          } else {
            setDateInvite('accepted')
          };
        }).catch(err => console.log(err));
    };
    asyncWrapper();
  }, []);

    return (
      <ChatWindow
        history={allMessages}
        connection={connection}
        dateInvite={dateInvite}
      />
  )
};