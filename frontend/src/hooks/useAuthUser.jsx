import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../lib/api"

export const useAuthUser = ()=>{
    const authUser = useQuery({ 
        queryKey: ['authUser'],
        queryFn: getAuthUser,
        retry:false //since it is the auth so only one time try is enabled b/c if user is not authentic then he should redirect to login first
    })
    // authUser.data?.user it means if we have authData then only access its .user

    return {authUser: authUser.data?.user , isLoading : authUser.isLoading}
}