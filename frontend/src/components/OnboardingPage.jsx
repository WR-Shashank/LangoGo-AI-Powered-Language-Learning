import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { axiosInstance } from '../lib/axios'
import { useAuthUser } from '../hooks/useAuthUser'
import PageLoader from './PageLoader'
import { CameraIcon, GlobeIcon, LoaderIcon, MapPin, MapPinIcon, Shuffle } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { LANGUAGES } from '../constant'
import { onBoardingApi } from '../lib/api'

const OnboardingPage = () => {

  const {authUser,isLoading}= useAuthUser() 

  if(isLoading) return <PageLoader/>
  

  const [onBoardingData,setOnBoardingData] = useState({
    profilePic:authUser?.profilePic || "",
    fullName:authUser?.fullName || "",
    Bio: authUser?.Bio || "",
    NativeLanguage:  "",
    LearningLanguage: "",
    location: authUser?.location || ""

  })

  

  const generateAvatar =   ()=>{
    const idx=Math.floor((Math.random()*100)+1); // Math.random() generates radom no. between 0 and 1, 0 inclusive and 1 exclusive
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setOnBoardingData({ ...onBoardingData, profilePic: randomAvatar })
    
    toast.success("Random Profile Pic Generated")

  }
  
  

  const handleChange = (e)=>{

    setOnBoardingData({...onBoardingData,[e.target.name]:e.target.value})

  }

  const queryClient = useQueryClient()
  
  let navigate =useNavigate()
  const {mutate,isPending,error}=useMutation({
    mutationFn : onBoardingApi,
    onSuccess : ()=>{
      toast.success("Onboarding Completed !")
      queryClient.invalidateQueries({queryKey:['authUser']})
      //navigate("/")
    },
    onError : (error)=>{
      toast.error(error.response.data.message)
    }
    
  })
  


  const handleSubmit = (e)=>{
    e.preventDefault();
    
    mutate(onBoardingData)
  }

  

  return (
    <div className='p-10 h-screen justify-items-center align-items-center'>
      <div className='w-[40vw] rounded-[1vw] border p-5 border-secondary border-opacity-40  justify-items-center align-items-center flex-col '>
        <div className='text-2xl font-bold mb-5'>Complete Your Profile</div>
        <div className='' >{onBoardingData?.profilePic ? <img className='size-24 rounded-full mb-2' src={onBoardingData?.profilePic} alt="Photo Preview" /> : <CameraIcon className='size-10  rounded-full mb-2'/>}</div>
        <div><button onClick={generateAvatar} className='px-5 py-1 mb-1 bg-secondary text-sm font-semibold w-fit rounded-full text-black'><Shuffle className='size-5 inline mr-2'/> Generate Random Avatar</button></div>
      
        <div className='flex items-start w-full  p-5'>
          
          
        <form className='w-full' onSubmit={handleSubmit}>
          <label className='block' htmlFor="fullName">Full Name</label>
          <input onChange={handleChange} className='border w-full rounded-[2vw] px-3 py-1 mb-3 mt-1' name="fullName" id="fullName" type="text" placeholder='Enter your Full Name' value={onBoardingData.fullName}/> 
        
          <label className='block' htmlFor="Bio">Bio</label>
          <textarea onChange={handleChange} className='border px-3 py-1 mt-1 mb-3 rounded-[1vw] text-sm w-full' value={onBoardingData.Bio}  name="Bio" id="Bio" placeholder='Tell others about yourself and your language learning goals'></textarea>
          
          <div className='flex justify-between gap-5'>
            <div className='w-1/2'>
              <label className='block' htmlFor="NativeLanguage"> Native Language</label>
              <select onChange={handleChange} className='border w-full mt-1 px-2 py-1 mb-3 rounded-[2vw]' id="NativeLanguage" name="NativeLanguage" type="text" >
                <option value={onBoardingData.NativeLanguage}>Select your native language</option>
                {
                  LANGUAGES.map((lang)=>{
                    return <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  })
                }
              </select>

            </div>
            <div className='w-1/2 '>
              <label className='block' htmlFor="LearningLanguage"> Learning Language</label>
              <select onChange={handleChange} className='border w-full mt-1 px-2 py-1 mb-3 rounded-[2vw]' id="LearningLanguage" name="LearningLanguage" type="text" >
                <option value={onBoardingData.LearningLanguage}>Select your learning language</option>
                {
                  LANGUAGES.map((lang)=>
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                  )
                }
              </select>
            </div>
          </div>

          <label className='block' htmlFor="location">Location</label>
          <input onChange={handleChange} value={onBoardingData.location} className='border w-full mt-1 px-8 py-1 rounded-[2vw]' id="location" name="location" type="text" placeholder="City, Country"/>
          <MapPin className='size-4 absolute -translate-y-6 translate-x-3'/>


          <button className='mt-5  rounded-full w-full align-middle text-md py-1.5 font-semibold text-black bg-primary' disabled={isPending} type="submit"> { isPending ? (<> <LoaderIcon className='animate-spin inline size-5'/> Onboarding...</> ) : (<><GlobeIcon className='size-5 inline mr-1'/> Complete Onboarding</> ) } </button>
        
        </form>
        </div>
      </div>

    </div>
  )
}

export default OnboardingPage
