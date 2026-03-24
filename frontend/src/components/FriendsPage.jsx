import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import React from 'react'
import PageLoader from './PageLoader.jsx';
import { Link } from 'react-router';
import { LANGUAGE_TO_FLAG } from '../constant';
import { axiosInstance } from '../lib/axios.jsx';



function FriendsPage() {

    const {data:friendsData ,isLoading } = useQuery({
        queryKey: ['damn'],
        queryFn : async ()=>{
            const response = await axiosInstance.get("/user/friends");
            console.log(response)
            
            return response.data;
        },
        retry:true,
        
    })

    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
        
    }

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

  if(isLoading) return <PageLoader/>


  return (
    <div className='my-3 mx-16'>
        <div className='w-full flex justify-between mt-5 mb-3'>
            <h1 className='text-xl mb-2 font-semibold'>Your Friends</h1>
            <Link to="/notifications" ><div className="px-3 h-fit py-.5 border rounded-full  flex gap-2 items-center "> <Users className='size-4'/> <h1 className='text-md '>Friend Requests</h1></div></Link>
        </div>
      
      <div className='flex flex-wrap overflow-auto gap-5 mb-5'>
      { friendsData.friends.length == 0 ?  
      <div className='bg-base-200 w-full py-5 flex-col justify-items-center rounded-lg'>
        <h3 className='text-lg'>No friends yet</h3>
        <p className='text-sm'>Connect with language partners to start practising together!</p>

      </div>
      : friendsData.friends.map((user,idx)=>{
        return <div key={idx} className='users w-72 bg-base-200 p-3 rounded-lg '>
                    <div className='flex gap-3 items-center mb-2'>
                      <img className='size-8 rounded-full' src={user.profilePic} alt="img preview" />
                      <div>
                        <h1 className='text-lg'>{user.fullName}</h1>
                        <h1 className='text-xs'>{user.location}</h1>
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
                    
                    <Link to={`/chat/${user._id}`}><button className='w-full py-1 border border-neutral rounded-full mt-4'>Message</button></Link>
                  </div>
      })}
    </div>
    </div>

  )
}

export default FriendsPage
