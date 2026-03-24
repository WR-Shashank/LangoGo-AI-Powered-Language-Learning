import React, { useEffect, useState } from 'react'

import { Earth, Languages, SpaceIcon } from 'lucide-react'
import Signup from "../utils/Signup.png"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { signUp } from '../lib/api'
import useSignUpMutation from '../hooks/useSignUpMutation.jsx'


const SignUpPage = () => {

  const [signUpData,setSignUpData] = useState({
    fullName:"",
    email:"",
    password:"",
  })

  const handleChange = (e)=>{
    
    setSignUpData({...signUpData, [e.target.name]:e.target.value})
  }

  //tenstack-queries // Pehle ham ese kar rhe the fir cutome hamne hook bna diya
  // const queryClient= useQueryClient();

  // // this way is used for post and useQuery in app is used to get
  // const {mutate,isPending,error}= useMutation({

  //   mutationFn :signUp,
  //   onSuccess : ()=> queryClient.invalidateQueries({ queryKey:["authUser"] }),
  //   // like this we can run any query again using the keys

  // })
  const {signUpMutation,isPending,error} = useSignUpMutation();

  const handleSubmit = async (e)=>{

      e.preventDefault();
      signUpMutation(signUpData)
      
      // first we were using this then we switched to tenstack queries
      // const response = await axiosInstance.post("/auth/signup",signUpData)
      // console.log(response.data) 
      
  }
  

  return (
    <div  className='h-screen  w-screen flex justify-center items-center'  >
      <div className='border-2 border-accent border-opacity-40 flex rounded-[1vw] overflow-hidden'>
      <div  className='p-7'>
        <div className='flex gap-2 items-center pb-3 '>
                          <  Earth className='size-8 text-primary ' />
                          <h1 className='text-[#20B44D] font-bold text-3xl font-mono bg-clip-text bg-gradient-to-r from-primary to-secondary  text-transparent tracking-wider'>LangoGo</h1>
                           <Languages className='size-8 text-secondary' />
                        </div>
        {
          error && (
            <div className='alert alert-error mb-4'>
              {error?.response?.data?.message}
            </div>
          )
        }
        
        <h1 className='text-xl pb-1 '>Create an Account</h1>
        <h2 className='text-sm text-zinc-400 pb-5'>Join Language Connect and start your language learning journey</h2>
      <form className='' onSubmit={handleSubmit}>
        <label className='block pb-1' htmlFor='fullName'>Full Name</label>
        <input className='rounded-full border px-3 py-1 mb-3 w-full ' id="fullName"  onChange={handleChange} name='fullName' value={signUpData.fullName}   type="text" placeholder='Enter your name' required />
        
        <label className='block pb-1' htmlFor="email">Email</label>
        
        <input className='rounded-full border px-3 py-1 mb-3 w-full' id="email" onChange={handleChange} name='email'  type="email" value={signUpData.email} placeholder='Enter your email' required />
        
        <label className='block pb-1' htmlFor="password">Password</label>
        
        <input  className='rounded-full border px-3 py-1 w-full mb-1' id="password" onChange={handleChange} name='password'  type="password" value={signUpData.password} placeholder='Enter your password' required />
        
        <h3 className='text-sm text-zinc-400 mb-5 mt-1'>Password must be 6 characters long</h3>
        
        <label className='text-xs block mb-4 items-center justify-center'>
          <input className='mr-3 w-3.5 h-3.5 ' type="checkbox" name="accept" />
          I agree to the terms of Service and Privacy Policy
        </label>
       

        
        <button className='text-md text-zinc-950 w-full align-center py-1.5 rounded-full bg-primary font-semibold  mb-4' type="submit">{isPending ? (<><span className='loading loading-spinner loading-xs'> </span> Loading...</> ): "Create Account" } </button>

      </form>
        <h1 className='text-sm justify-self-center '>Already have an account? <Link className='text-primary font-semibold' to="/login"> Signin</Link></h1>
      </div>
    
      <div className='border-base-200 content-center bg-opacity-60  bg-secondary -center p-5 w-[27vw]'>
          <div className='w-80 h-80 items-center justify-center'><img src={Signup} alt="" /></div>

          <div className='items-center justify-center w-full'>
            <h1 className='justify-self-center text-lg font-bold w-80  pb-3  text-center'>Connect with Language partners world wide</h1>
            <h1 className='text-sm text-center'>Practice conversations, make friends, and improve your language skills together </h1>
          </div>
      </div>
      </div>
      
    </div>
  )
}

export default SignUpPage
