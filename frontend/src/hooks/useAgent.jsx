import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agentApi } from "../lib/api";

export default function callAgent(){
    const queryClient = useQueryClient();

    const {mutateAsync,isPending,error,data} = useMutation({
        mutationFn : agentApi,
        onSuccess: ()=>queryClient.invalidateQueries({ queryKey:["authUser"] }),
    })

    return {isPending,error,agentCall:mutateAsync,data};

}