import  {axiosInstance}  from "./axios.jsx";

export const getAuthUser = async  () =>{
      /* const res = await fetch("/me")
      const rawData = res.json()
      return rawData; // this return will be saved to data */

      // using axios instead
      try{
         const response = await axiosInstance.get("/auth/me")
         return response.data; //this res.data will be saved inside authData
         
      }
      catch(err){
        console.log("error",err);
        return null;
      }
      // this try catch block is necessary b/c there is error it was not returning anything but we want to return null if user not found thats why
       
      
}

export const signUp =  async (signUpData) =>{
      const response = await axiosInstance.post("/auth/signup",signUpData);
      
      return response.data;
}

export const onBoardingApi = async (onBoardingData)=>{

      const response = await axiosInstance.post("/auth/onboarding",onBoardingData);
      
      return response.data;
}

export const loginApi = async (loginData)=>{
      const response = await axiosInstance.post("/auth/login",loginData)
      return response.data
}
export const logoutApi = async ()=>{
      const response = await axiosInstance.post("/auth/logout")
      return response.data
}

export const agentApi = async(userInput)=>{
      const response = await axiosInstance.post("/agent/",userInput)
      return response.data
}
