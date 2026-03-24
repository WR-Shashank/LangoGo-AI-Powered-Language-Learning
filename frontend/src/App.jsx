
import { Route, Routes } from 'react-router'
import HomePage from './components/HomePage.jsx'
import SignUpPage from './components/SignUpPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import ChatPage from './components/ChatPage.jsx'
import CallPage from './components/CallPage.jsx'
import NotificationsPage from './components/NotificationsPage.jsx'
import OnboardingPage from './components/OnboardingPage.jsx'
import LangoAgentPage from './components/LangoAgentPage.jsx'
import  { Toaster } from 'react-hot-toast'

import { Navigate } from 'react-router'
import PageLoader from './components/PageLoader.jsx'

import { useAuthUser } from './hooks/useAuthUser.jsx'
import Layout from './components/Layout.jsx'
import { useState } from 'react'
import {  useDataTheme } from './hooks/useDataTheme.jsx'
import FriendsPage from './components/FriendsPage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import EditProfilePage from './components/EditProfilePage.jsx'



const App = () => {

  //Putting this useQuery(/me) call at the root level (App.jsx) means:
  //You're checking "Is the user logged in?" immediately when the app starts.
  

  const {authUser,isLoading} = useAuthUser()

  /////////////PEHLE HAM PROPS DRILLING USE KAR RHE THE
  /*const [theme,setTheme]=useState({
    theme:"forest"

  })    

  const changeTheme = (newTheme)=>{
    setTheme(newTheme);
    
  }*/

  const {theme,setTheme} = useDataTheme()


  //the another diff between ten-stack-query and (use state + use effect )fetch is use effect fetch try only only time while ten-stack method at repeat intervals 4 times
  //authData will have what /me is returning from server and it is {user:req.user} So

  if(isLoading) return <PageLoader/>

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded;


  

  

  
  return (
    <div className="h-screen" data-theme={theme} >
      
      <Routes>
        
        <Route path="/" element={ (isAuthenticated && isOnboarded )? <Layout showSidebar={true} /*changeTheme={(newTheme)=>changeTheme(newTheme)} theme={theme}*/><HomePage/></Layout> : ( isAuthenticated ? <Navigate to="/onBoarding"/> : <Navigate to="/login"/> )}></Route> 
        {/**we are using <Navigate to="/"> instead off navigate("/") b/c this used in function and that is used in Routes vagerah*/}
        <Route path="/signUp" element={(isAuthenticated && isOnboarded )? <Navigate to="/"/> : ( isAuthenticated ? <Navigate to="/onBoarding"/> : <SignUpPage/> )}></Route>

        <Route path="/login" element={(isAuthenticated && isOnboarded )? <Navigate to="/"/> : ( isAuthenticated ? <Navigate to="/onBoarding"/> : <LoginPage/> )}></Route>

        <Route path="/onBoarding" element={(isAuthenticated && isOnboarded )? <Navigate to="/"/> : ( isAuthenticated ? <OnboardingPage/> : <Navigate to="/login"/> )}></Route>

        <Route path="/chat/:id" element={(isAuthenticated && isOnboarded )?  <Layout showSidebar={false} /*changeTheme={(newTheme)=>changeTheme(newTheme)} theme={theme}*/><ChatPage/></Layout>: ( isAuthenticated ? <OnboardingPage/> : <Navigate to="/login"/> )}></Route>

        <Route path="/call/:id" element={(isAuthenticated && isOnboarded )? <CallPage/> : ( isAuthenticated ? <OnboardingPage/> : <Navigate to="/login"/> )}></Route>

        <Route path="/notifications" element={(isAuthenticated && isOnboarded )? <Layout showSidebar={true} /*changeTheme={(newTheme)=>changeTheme(newTheme)}theme={theme}*/><NotificationsPage/></Layout> : ( isAuthenticated ? <OnboardingPage/> : <Navigate to="/login"/> )}></Route>

        <Route path="/friends" element={(isAuthenticated && isOnboarded )? <Layout showSidebar={true}><FriendsPage/> </Layout>: ( isAuthenticated ? <OnboardingPage/> : <Navigate to="/login"/> )}></Route>

        <Route path="/profile"  element={(isAuthenticated && isOnboarded ) ? <Layout showSidebar={true}><ProfilePage/> </Layout> : ( isAuthenticated ? <OnboardingPage/> : <Navigate to="/login"/> )}></Route>
        <Route path="/editProfile"  element={(isAuthenticated && isOnboarded ) ? <Layout showSidebar={true}><EditProfilePage/> </Layout> : ( isAuthenticated ? <OnboardingPage/> : <Navigate to="/login"/> )}></Route>
        
        <Route path="/Lango-agent" element={(isAuthenticated && isOnboarded) ? <Layout showSidebar={true}><LangoAgentPage/></Layout> : (isAuthenticated ? <OnboardingPage/>: <Navigate to="/login"/> )} ></Route>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
