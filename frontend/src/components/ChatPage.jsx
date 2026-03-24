import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useAuthUser } from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

import {  Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import PageLoader from './PageLoader';
import toast from 'react-hot-toast';
import { VideoIcon } from 'lucide-react';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY  // every key in .env in vite starts with VITE_

const ChatPage = () => {

  const {id : targetUserId}/**in the bracket the name should be same as in the dynamic route */ =useParams();

  const [chatClient, setChatClient ] = useState(null)
  const [channel,setChannel] = useState(null)
  const [loading,setLoading] = useState(true)

  const {authUser} = useAuthUser();

  const {data : tokenData} = useQuery({
    queryKey : ['streamToken'],
    queryFn :async ()=> {
      const response = await axiosInstance.get("/chat/token")
      console.log(response.data)
      return response.data;
    },
    enabled : !!authUser, // !! will convert authUser to boolean and enabled ensure that this query will run after being authUser fetched
  });
  //console.log(tokenData)
  useEffect(()=>{
    const initChat = async ()=>{
      if(!tokenData?.token || !authUser) return null;
      
      try{
        console.log("Initialising stream chat client");

        const client = StreamChat.getInstance(STREAM_API_KEY)
        
        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        },tokenData.token)

        //we are sorting this b/c we want to create same Id 
        // either any user initiating th chat
        const channelId = [authUser._id,targetUserId].sort().join("-");

        const currChannel = client.channel("messaging",channelId,{
          members: [authUser._id,targetUserId]
        })

        await currChannel.watch() // this will watch any incomming changes 

        setChatClient(client)
        setChannel(currChannel);

      }
      catch(err){
        console.error("Error in intializing chat",err)
        toast.error("Could not connect to chat. PLease try again later")
      }
      finally{
        setLoading(false)
      }
    };

    initChat();

  },[tokenData, authUser , targetUserId])

  const handleVideoCall = ()=>{
      if(channel){
        const callUrl = `${window.location.origin}/call/${channel.id}`;

        channel.sendMessage({
          text : `I've started a video call. Join me here: ${callUrl}`
        })
      }
  }

  if(loading || !chatClient || !channel) return <PageLoader/>

  return (
    <div className='h-[91.5vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <button className='absolute right-6 bg-primary py-1 px-2 rounded-full top-3' onClick={()=>handleVideoCall()}><VideoIcon className='size-6'/></button>
            <Window>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput focus/>
            </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
      
    </div>
  );
}

export default ChatPage
