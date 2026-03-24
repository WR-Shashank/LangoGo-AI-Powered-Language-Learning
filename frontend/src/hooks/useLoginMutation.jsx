import React from 'react'
import { loginApi } from '../lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

function useLoginMutation() {
    const queryClient = useQueryClient()
    
    const {isPending,mutate,error}= useMutation({
        mutationFn : loginApi,
        onSuccess : ()=>{
        toast.success("Login Successful !")
        queryClient.invalidateQueries({queryKey : ["authUser"]})

        },
        onError : (error)=>{
        
        toast.error(error.response.data.message)
        }
    })
    return  {isPending,loginMutation:mutate,error}

}

export default useLoginMutation
