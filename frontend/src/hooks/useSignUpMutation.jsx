import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { signUp } from '../lib/api';

function useSignUpMutation() {

    const queryClient= useQueryClient();

  // this way is used for post and useQuery in app is used to get
  const {mutate,isPending,error}= useMutation({

    mutationFn :signUp,
    onSuccess : ()=> queryClient.invalidateQueries({ queryKey:["authUser"] }),
    // like this we can run any query again using the keys

  })

  return {isPending,error,signUpMutation:mutate};
}

export default useSignUpMutation
