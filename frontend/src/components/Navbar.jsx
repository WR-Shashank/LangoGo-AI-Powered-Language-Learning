import { Bell, Earth, Languages, LogOut, Palette } from 'lucide-react'
import React, { useState } from 'react'
import { useAuthUser } from '../hooks/useAuthUser.jsx'
import PageLoader from './PageLoader.jsx'
import ThemeSelector from "./ThemeSelector.jsx" 
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios.jsx'
import toast from 'react-hot-toast'
import { Link, useLocation } from 'react-router'

function Navbar(/*{changeTheme,theme}*/) {

    const {authUser,isLoading} = useAuthUser()

    if(isLoading) return <PageLoader/>

    const location = useLocation();

    const url = location.pathname;

    const queryClient = useQueryClient()

    const [themeView,setThemeView]=useState({
        themeView:false
    })

    const {mutate,isPending,error} = useMutation({

        mutationFn : async ()=>{
        /*************************************is AWAIT NE BOHAT PARESHAN KIYA BHUL GAYA THA LAGANA */
            const response = await axiosInstance.post("/auth/logout",{message :"logout"})
            console.log(response.data)
            return response.data
        },
        onSuccess : ()=> {queryClient.invalidateQueries({ queryKey:["authUser"] })},

    })
    if(isPending) return <PageLoader/>

    const handleLogout = ()=>{
        mutate()
        // pehele logout kaam nhi kar rha tha fir hmne getauthuser mai try catch or error aane par return null kiya tab kaam hua
    }


  return (


        <div className='flex items-center px-5  bg-base-200  w-full h-14'>
            { url.startsWith("/chat") && <Link to="/"><div className='flex gap-2 items-center '>
                <Earth className='size-7 text-primary ' />
                <h1 className='text-[#20B44D] font-bold text-2xl font-mono bg-clip-text bg-gradient-to-r from-primary to-secondary  text-transparent tracking-wider'>LangoGo</h1>
                <Languages className='size-7 text-secondary' />
            </div>
            </Link>
            }           
    
            <div className='w-full flex  gap-4 justify-end items-center '>
                <Link to="/notifications"><Bell className='size-5'/></Link>
                <button onClick={()=>{setThemeView(!themeView)}}><Palette className='size-5'/></button> 
                
                <Link to="/profile" ><img className='size-7 rounded-full' src={authUser.profilePic} alt="Avatar" /></Link>
                <button onClick={handleLogout}><LogOut  className='size-5' /></button>
                
            </div>
            <ThemeSelector display={themeView}/* changeTheme={(newTheme)=>changeTheme(newTheme)} theme={theme}*/ />
       </div>
    
  )
}

export default Navbar
