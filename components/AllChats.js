"use client"
import ChatPanel from 'components/ChatPanel';
import { useState, useContext, useEffect } from 'react';
import FullQuiz from 'components/FullQuiz';
import Upgrade from 'components/Upgrade';
import AllProfiles from 'components/AllProfiles';
import { ReviewContext } from 'components/ReviewContext';

export default function AllChats({ activeUser, allConnections }) {
    const [activeConnections, setActiveConnections] = useState(undefined);
    const [renderQuiz, setRenderQuiz] = useState(false);
    const formattedConnections = JSON.parse(allConnections);
    const { setShowUpgrade, bankConnection, setIsLoading } = useContext(ReviewContext);
    
    useEffect(() => { 
        setIsLoading(true);
        setTimeout(() => {setIsLoading(false)}, 500);
    }, [])

    return (
        <div className='block p-2'>
            <h1 className=' text-2xl md:text-5xl font-extralight p-5 w-3/4 border-b border-white px-8 md:px-20 lg:px-0'>Chat</h1>
        <div className='space-y-2  grid md:grid-cols-3 space-x-2 md:mt-10 p-5 lg:p-0 md:ml-10 lg:ml-0'>
             <div className='absolute w-10/12 h-100 z-40 mx-6 md:mx-12 lg:mx-36'>
                    {
                        bankConnection ?
                            activeUser.membershipType === 'pro' ?
                                <Upgrade /> :
                                <div className="w-full md:w-[48.5rem] lg:w-[48.5rem] md:-ml-32  xl:w-[70.5rem] overflow-y-scroll">
                                    <AllProfiles allMingles={[JSON.stringify(formattedConnections)]}
                                        currentUser={JSON.parse(activeUser)}
                                        isBank={false}
                                        isRev={true}
                                    />
                                </div> : null
}
            </div>
            {
                !renderQuiz ?
                activeConnections ?
          activeConnections.map((connection, index) => {
              return <ChatPanel connection={connection}
                  key={index} activeUser={JSON.parse(activeUser)}
                  setActiveConnections={setActiveConnections}
                  setRenderQuiz={setRenderQuiz}
                  setShowUpgrade={setShowUpgrade}
                />
          }) :
                 formattedConnections.map((connection, index) => {
                     return <ChatPanel connection={connection}
                         key={index} activeUser={JSON.parse(activeUser)}
                         setActiveConnections={setActiveConnections}
                         setRenderQuiz={setRenderQuiz}
                         setShowUpgrade={setShowUpgrade}
                     />
                 })
                    :
                <FullQuiz connection={renderQuiz} setConnection={setRenderQuiz} />
        }
            </div>
        </div>
)
}