import { Bell, Dot, Earth, Frown, House, Languages, Users } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router'
import { useAuthUser } from '../hooks/useAuthUser'
import PageLoader from './PageLoader.jsx'

function Sidebar() {
    const {authUser,isLoading} = useAuthUser()
    if(isLoading) return <PageLoader/>
    

    const location = useLocation()

    const url = location.pathname;
   

  return (
    <div className='bg-base-200 h-screen w-52 p-4 '>
        <div className='flex gap-2 items-center '>
          <  Earth className='size-7 text-primary ' />
          <h1 className='text-[#20B44D] font-bold text-2xl font-mono bg-clip-text bg-gradient-to-r from-primary to-secondary  text-transparent tracking-wider'>LangoGo</h1>
           <Languages className='size-7 text-secondary' />
        </div>
        
        <div className='flex flex-col  mt-8 gap-3'>
            <Link className={`w-full ${url=="/" ? "bg-secondary bg-opacity-60" : "bg-base-100" }  px-3 py-1 rounded-full text-md `}
                 to="/"  > <House className='inline size-5 mb-1 '/> Home
            </Link>
            <Link className={`w-full ${url=="/friends" ? "bg-secondary bg-opacity-60" : "bg-base-100" }  px-3 py-1 rounded-full text-md pt-1 `}
                 to="/friends"  ><Users className='inline size-5' /> Friends
            </Link>
            <Link className={`w-full ${url=="/notifications" ? "bg-secondary bg-opacity-60" : "bg-base-100" }  px-3 py-1 rounded-full text-md pt-1 `}
                 to="/notifications" ><Bell className='inline size-5'/> Notifications
            </Link>
            <Link className={`w-full ${url=="/Lango-agent" ? "bg-secondary bg-opacity-60" : "bg-base-100" }  px-3 py-1 rounded-full text-md pt-1 `}
                 to="/Lango-agent" > Lango Agent 
            </Link>
        
        </div>
        <Link to="/profile" className='flex absolute bottom-5  items-center  '>
            <div>
                <img className='size-8 rounded-full bg-slate-200' src={authUser.profilePic} alt="" />
            </div>
            <div className='flex-col items-center justify-center ml-2'>
                <h1 className='text-md'>{authUser.fullName}</h1>
                <div className='flex items-center gap-1 justify-center'>
                    <div className={`text-transparent  size-2 rounded-full ${authUser ? "bg-[#20B44D]" : "bg-[#d43953]"} `}> .</div>
                     <h1 className={`text-xs ${authUser ? "text-[#20B44D]" : "text-[#d43953]"}  `}>  { authUser? " online" : " offline"}</h1>
                </div>
               
            </div>
           
            
        </Link>
    </div>
  )
}

export default Sidebar
