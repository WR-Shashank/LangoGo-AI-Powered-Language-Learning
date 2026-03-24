import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios.jsx'
import PageLoader from './PageLoader.jsx'
import { Bell, Clock, MessageSquare, UserCheck } from 'lucide-react'

const NotificationsPage = () => {

  const queryClient = useQueryClient()

  //fetch all friend req
  const {data:friendReqs,isLoading} = useQuery({

      // bohat pareshan raha tha idhar kyunki maine server mai sender ka ref "user" likh diya tha "User ki jagah"
      queryKey : ['friendReq'],
      queryFn : async ()=>{
        try{
        const response = await axiosInstance.get("/user/friendRequests");
        return response.data;
        }
    catch(err){
      console.log(err)
    }
      },
    
    
  })

  // for accepting frnd req
  const {mutate,isPending} = useMutation({
    mutationFn : async (id)=>{
      const response = await axiosInstance.post(`/user/acceptfriendRequest/${id}`)
      console.log(response.data)
      return response.data;
    },
    onSuccess : ()=>{queryClient.invalidateQueries({queryKey : ['friendReq']})
    queryClient.invalidateQueries({queryKey : ['friends']})
  }
  })

  if(isLoading) return <PageLoader/>
  

  console.log(friendReqs)

  return (
    <div className='w-full flex-col items-center justify-items-center'>
      <div className='w-2/3 '>
      <h1 className='text-2xl ml-20 mt-9 mb-5 font-semibold'>Notifications</h1>
      <div className='flex ml-20 gap-2 mb-5'>
        <UserCheck className="size-5 text-primary" />
      <h1>Friend Requests</h1>
      <div className='count px-2.5 text-base-200 h-fit rounded-full bg-primary '>{friendReqs.incommingReq.length}</div>
      </div>
      <div className='flex-col w-full mb-10 max-h-52 overflow-auto justify-items-center '>
        
        {friendReqs.incommingReq.length == 0 ? 
        <div className=' flex-col w-3/4 bg-base-200 py-2 rounded-lg opacity-80 justify-items-center '>
           <h1 className='text-md'>No notifications yet </h1>
           <h4 className='text-xs opacity-80'>When you will recieve friend request, they will appear here</h4>
        </div>
        
        : friendReqs.incommingReq.map((user,idx)=>{
          return <div className='flex justify-between w-3/4 mb-3 p-3 bg-base-200 rounded-lg items-center'>
                    <div className='flex items-center gap-4'>
                      <img className='size-8 rounded-full' src={user.sender.profilePic} alt="" />
                      <div className='flex-col'>
                        <h1 className='text-lg mb-2'>{user.sender.fullName}</h1>
                        <div className='lang flex gap-2 '>
                            <div className='native bg-primary h-fit text-base-100 text-sm rounded-full px-2'>
                                <h1> Native: {user.sender.NativeLanguage}</h1>
                            </div>
                            <div className='learn text-sm h-fit border rounded-full item px-2'>
                                Learning: {user.sender.LearningLanguage}
                            </div>
                          </div>
                      </div>
                    </div>
                    <button onClick={()=>{mutate(user.sender._id)}} className='rounded-full h-fit py-.5 px-4  bg-primary text-base-100'>Accept</button>
                </div>

        })}
      </div>
      <div className='flex ml-20 items-center gap-2 mb-5'  ><Bell className='size-5 text-primary'/> New Connections</div>
      <div className='flex-col w-full justify-items-center max-h-52 overflow-auto'>
        
        { friendReqs.acceptedReq.length== 0 ?
         <div className=' flex-col w-3/4 bg-base-200 py-2 rounded-lg opacity-80 justify-items-center '>
           <h1 className='text-md'>No connections yet </h1>
           <h4 className='text-xs opacity-80'>Whoever accepts your request, they will appear here</h4>
        </div>
         : friendReqs.acceptedReq.map((user,idx)=>{
          return <div className='flex bg-base-200 justify-between mb-3 w-3/4 px-3 py-2 items-center rounded-lg'>
                    <div className='flex items-center gap-4'>
                      <img className='size-8 rounded-full' src={user.sender.profilePic} alt="" />
                      <div className='flex-col '>
                        <h1 className='text-lg mb-.5'>{user.reciever.fullName}</h1>
                        <h1 className='text-sm'>{user.reciever.fullName} accepted your friend request</h1>
                        <div className='flex mt-1 gap-1 items-center'> < Clock className='size-3 opacity-80'/>  <h1 className='text-xs opacity-80'>Recently</h1></div>
                       
                      </div>
                    </div>
                   <div className='flex text-sm bg-primary px-3 py-0.5 items-center rounded-full'>
                     <MessageSquare className='size-4 text-base-100  mr-1'/> <h1 className='pb-0.5 text-base-100'>New Friend</h1>
                   </div>
                </div>

        })}
      </div>
      </div>
      
    </div>
  )
}

export default NotificationsPage
