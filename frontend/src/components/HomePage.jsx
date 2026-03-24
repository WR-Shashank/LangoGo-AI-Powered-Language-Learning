import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useAuthUser } from '../hooks/useAuthUser';
import { axiosInstance } from '../lib/axios';
import PageLoader from './PageLoader';
import { sendFriendRequest } from '../../../backend/src/controllers/user.controllers';
import {  CircleCheckBig, MapPin, UserPlusIcon, Users } from 'lucide-react';
import { Link } from 'react-router';
import { LANGUAGE_TO_FLAG } from '../constant';

const HomePage = () => {

  const queryClient = useQueryClient();
 
  // fetching friends
  const {data:friendsData ,isLoading : loadingFrnds} = useQuery({
    queryKey: ['friends'],
    queryFn : async ()=>{
       const response = await axiosInstance.get("/user/friends");
       
       return response.data;
    },
    retry:true,
    
  })
   
  //fetching recommended users
  const {data:recommendedUsers,isLoading : loadingUsers} = useQuery({
    queryKey: ['users'],
    queryFn : async ()=>{
       const response = await axiosInstance.get("/user/");
        
       return response.data;
    },
    retry:true,
    
  })

  //fetching outgoing req api
  const {data:outGoingReqs,isLoading} = useQuery({
    queryKey: ['outReq'],
    queryFn : async ()=>{
      const response = await axiosInstance.get("/user/sentFriendRequests")
      console.log(response.data)
      return response.data;
    }
  })

  // to send friend req
  const {mutate,isPending }=useMutation({
        mutationFn : async (id)=>{
          const response = await axiosInstance.post(`/user/friendRequest/${id}`)
          console.log(response)
          return response.data;
        },
        // on every successful req sent fetch the outgoing req again
        onSuccess: ()=>queryClient.invalidateQueries({queryKey : ["outReq"]})
  })

  
  const [outFrndReqsIds,setOutFrndReqsIds] = useState(new Set())

  useEffect(()=>{
    const outReqIds = new Set();
    if(outGoingReqs && outGoingReqs.length>0){
      outGoingReqs.forEach(req => {
        outReqIds.add(req.reciever._id)
      });
    }
    setOutFrndReqsIds(outReqIds);
    
  },[outGoingReqs]) //jaise hi outgoing req change ho vaise hi use Effect chale or outFrndReqsIds ko change krde

  
  function getLangFlag(language){
    if(!language) return null;

    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if(countryCode){
      return (
        <img src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`${langLower} flag`}
          className='h-3 mr-1 inline-block '
        />
      )
    }
  }

  function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
    
  }


  if(loadingFrnds || isLoading || loadingUsers ||isPending ) return <PageLoader/>


  return (
    <div className='my-3 mx-16'>

       <div className='w-full flex justify-between mt-5 mb-3'>
    <h1 className='text-xl font-semibold mb-.5'>Meet New Learners</h1>
    <Link to="/notifications" ><div className="px-3 h-fit py-.5 border rounded-full  flex gap-2 items-center "> <Users className='size-4'/> <h1 className='text-md '>Friend Requests</h1></div></Link>
    </div>
    <h1 className='text-sm opacity-80'>Discover perfect language exchange partners based on your profile</h1>


    <div className='flex flex-wrap max-h-[70vh] overflow-auto gap-5 mt-5 '>
      { recommendedUsers.length == 0 ? 
          <div className='bg-base-200 w-full py-5 flex-col justify-items-center rounded-lg'>
        <h3 className='text-md'>No Recommendations Availiable</h3>
        <p className='text-sm'>Check back later for new language partners!</p>

      </div>
        : recommendedUsers.map((user,idx)=>{
          const isReqSent = outFrndReqsIds.has(user._id)

          return  <div key={idx} className='users w-72 bg-base-200 p-2 rounded-lg '>
                    <div className='flex gap-3 items-center mb-2'>
                      <img className='size-8 rounded-full' src={user.profilePic} alt="img preview" />
                      <div>
                        <h1 className='text-lg'>{user.fullName}</h1>
                        <h1 className='text-xs '><MapPin className='inline size-3 mb-1 mr-1 '/>{user.location}</h1>
                      </div>
                    </div>

                    <div className='lang flex gap-2 '>
                      <div className='native flex bg-primary text-base-100 items-center text-xs rounded-full px-2'>
                          {getLangFlag(user.NativeLanguage)}
                          <h1> Native: {capitalize(user.NativeLanguage)}</h1>
                      </div>
                      <div className='learn text-xs border items-center rounded-full item px-2'>
                          {getLangFlag(user.LearningLanguage)}
                           Learning: {capitalize(user.LearningLanguage)}
                      </div>
                    </div>
                    <h1 className='bio text-xs mt-2 opacity-80 pl-1'> {user.Bio}</h1>
                    {
                      isReqSent  ? <button className='w-full py-1 disabled bg-base-100 opacity-80  rounded-full mt-3'><CircleCheckBig className='inline size-4 mr-2 ' />Request Sent</button> :
                      <button onClick={()=>{mutate(user._id)}} className='w-full py-1 bg-primary text-base-100 rounded-full mt-3 '><UserPlusIcon className='inline mb-1 size-4 mr-2 ' />Send Friend Request</button>
                    }
                    
                  </div>
        })
      }
     
      
    </div>

   
        
    
    </div>
  )
}

export default HomePage
