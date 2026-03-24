import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Earth, Languages } from 'lucide-react'
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import Login from '../utils/Login.png'
import { loginApi } from '../lib/api'
import useLoginMutation from '../hooks/useLoginMutation.jsx'

function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // this is what we did first then we made it as custome hook just for practice
  // const queryClient = useQueryClient()
  // const {mutate,isPending,error} =useMutation({
  //   mutationFn : loginApi,
  //   onSuccess : ()=>{
  //     toast.success("Login Successful !")
  //     queryClient.invalidateQueries({queryKey : ["authUser"]})
  //   },
  //   onError : (error)=>{
  //     toast.error(error.response.data.message)
  //   }
  // })

  const { loginMutation, isPending, error } = useLoginMutation();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(loginData)
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center px-2 sm:px-4'>
      <div className='border-2 border-accent border-opacity-40 flex flex-col md:flex-row rounded-lg md:rounded-[1vw] overflow-hidden w-full max-w-sm sm:max-w-md md:max-w-4xl lg:max-w-6xl'>
        
        {/* Left side - Form */}
        <div className='p-4 sm:p-6 md:p-7 w-full md:flex-1'>
          
          {/* Logo section */}
          <div className='flex gap-2 items-center pb-3'>
            <Earth className='size-6 sm:size-8 text-primary' />
            <h1 className='text-[#20B44D] font-bold text-xl sm:text-2xl md:text-3xl font-mono bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent tracking-wider'>
              LangoGo
            </h1>
            <Languages className='size-6 sm:size-8 text-secondary' />
          </div>

          {/* Welcome text */}
          <div>
            <h1 className='text-lg sm:text-xl pb-1'>Welcome Back</h1>
            <h2 className='text-sm text-zinc-400 pb-5'>
              Sign in to your account to continue your language learning journey
            </h2>
          </div>

          {/* Form */}
          <form className='' onSubmit={handleSubmit}>
            <label className='block pb-1' htmlFor="email">Email</label>
            <input 
              className='rounded-full border px-3 py-1 mb-3 w-full' 
              id="email" 
              onChange={handleChange} 
              name='email' 
              type="email" 
              value={loginData.email} 
              placeholder='Enter your email' 
              required 
            />

            <label className='block pb-1' htmlFor="password">Password</label>
            <input 
              className='rounded-full border px-3 py-1 w-full mb-1' 
              id="password" 
              onChange={handleChange} 
              name='password' 
              type="password" 
              value={loginData.password} 
              placeholder='Enter your password' 
              required 
            />

            <button 
              className='text-md mt-5 text-zinc-950 w-full align-center py-1.5 rounded-full bg-primary font-semibold mb-4' 
              type="submit"
            >
              {isPending ? (
                <>
                  <span className='loading loading-spinner loading-xs'></span> Signing in...
                </>
              ) : "Sign in"}
            </button>
          </form>

          {/* Sign up link */}
          <h1 className='text-sm'>
            Don't have an account? 
            <Link className='text-primary font-semibold' to="/signUp">
              Create One
            </Link>
          </h1>
        </div>

        {/* Right side - Image and description */}
        <div className='border-base-300 bg-opacity-60 bg-secondary p-4 sm:p-5 w-full md:w-[27vw] flex flex-col items-center justify-center'>
          <div className='w-60 h-60 sm:w-80 sm:h-80 items-center justify-center flex'>
            <img 
              src={Login} 
              alt="" 
              className='w-full h-full object-contain'
            />
          </div>
          
          <div className='items-center justify-center w-full text-center'>
            <h1 className='text-base sm:text-lg font-bold w-full pb-3'>
              Connect with Language partners world wide
            </h1>
            <h1 className='text-sm'>
              Practice conversations, make friends, and improve your language skills together
            </h1>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default LoginPage