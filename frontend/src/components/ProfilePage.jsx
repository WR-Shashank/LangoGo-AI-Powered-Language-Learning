import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useAuthUser } from '../hooks/useAuthUser';
import { axiosInstance } from '../lib/axios';
import PageLoader from './PageLoader';
import { MapPin, Users, Edit } from 'lucide-react';
import { Link } from 'react-router';
import { LANGUAGE_TO_FLAG } from '../constant';

const ProfilePage = () => {
  const { authUser,isLoading } = useAuthUser();

  
  // Fetching friends count
  const { data: friendsData, isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/friends");
      return response.data;
    },
    retry: true,
  })

  function getLangFlag(language) {
    if (!language) return null;

    const langLower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langLower];

    if (countryCode) {
      return (
        <img src={`https://flagcdn.com/24x18/${countryCode}.png`}
          alt={`${langLower} flag`}
          className='h-3 mr-1 inline-block'
        />
      )
    }
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (isLoading || loadingFriends) return <PageLoader />

  const user =authUser;

  return (
    <div className='my-3 mx-16'>
      
      <div className='w-full flex justify-between mt-5 mb-3'>
        <h1 className='text-xl font-semibold mb-.5'>My Profile</h1>
        <Link to="/editProfile">
          <div className="px-3 h-fit py-.5 border rounded-full flex gap-2 items-center">
            <Edit className='size-4'/>
            <h1 className='text-md'>Edit Profile</h1>
          </div>
        </Link>
      </div>
      <h1 className='text-sm opacity-80'>Manage your language learning profile and connect with others</h1>

      <div className='flex flex-wrap max-h-[70vh] overflow-auto gap-5 mt-5'>
        
        {/* Main Profile Card */}
        <div className='w-96 bg-base-200 p-4 rounded-lg'>
          <div className='flex gap-3 items-center mb-4'>
            <img className='size-16 rounded-full' src={user.profilePic || '/default-avatar.png'} alt="Profile picture" />
            <div>
              <h1 className='text-xl font-semibold'>{user.fullName}</h1>
              <h1 className='text-sm'><MapPin className='inline size-3 mb-1 mr-1'/>{user.location || 'Location not set'}</h1>
              <h1 className='text-sm'><Users className='inline size-3 mb-1 mr-1'/>{friendsData?.length || 0} Friends</h1>
            </div>
          </div>

          {(user.NativeLanguage || user.LearningLanguage) && (
            <div className='lang flex gap-2 mb-3'>
              {user.NativeLanguage && (
                <div className='native flex bg-primary text-base-100 items-center text-xs rounded-full px-2'>
                  {getLangFlag(user.NativeLanguage)}
                  <h1>Native: {capitalize(user.NativeLanguage)}</h1>
                </div>
              )}
              {user.LearningLanguage && (
                <div className='learn text-xs border items-center rounded-full flex px-2'>
                  {getLangFlag(user.LearningLanguage)}
                  Learning: {capitalize(user.LearningLanguage)}
                </div>
              )}
            </div>
          )}

          {user.Bio && (
            <h1 className='bio text-xs mt-2 opacity-80 pl-1'>{user.Bio}</h1>
          )}
          
          <Link to="/editProfile">
            <button className='w-full py-1 bg-primary text-base-100 rounded-full mt-3'>
              <Edit className='inline mb-1 size-4 mr-2'/>Edit Profile
            </button>
          </Link>
        </div>

        {/* Profile Stats Card */}
        <div className='w-72 bg-base-200 p-4 rounded-lg'>
          <h2 className='text-lg font-semibold mb-3'>Profile Information</h2>
          
          <div className='space-y-3'>
            <div className='flex justify-between items-center text-sm'>
              <span className='opacity-80'>Email:</span>
              <span className='text-right'>{user.email}</span>
            </div>
            
            <div className='flex justify-between items-center text-sm'>
              <span className='opacity-80'>Native Language:</span>
              <span className='text-right'>{user.NativeLanguage ? capitalize(user.NativeLanguage) : 'Not set'}</span>
            </div>
            
            <div className='flex justify-between items-center text-sm'>
              <span className='opacity-80'>Learning Language:</span>
              <span className='text-right'>{user.LearningLanguage ? capitalize(user.LearningLanguage) : 'Not set'}</span>
            </div>
            
            <div className='flex justify-between items-center text-sm'>
              <span className='opacity-80'>Location:</span>
              <span className='text-right'>{user.location || 'Not set'}</span>
            </div>
            
            <div className='flex justify-between items-center text-sm'>
              <span className='opacity-80'>Friends:</span>
              <span className='text-right'>{friendsData?.length || 0}</span>
            </div>
            
            <div className='flex justify-between items-center text-sm'>
              <span className='opacity-80'>Profile Status:</span>
              <span className={`text-right ${user.isOnboarded ? 'text-success' : 'text-warning'}`}>
                {user.isOnboarded ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className='w-72 bg-base-200 p-4 rounded-lg'>
          <h2 className='text-lg font-semibold mb-3'>Quick Actions</h2>
          
          <div className='space-y-2'>
            <Link to="/editProfile" className='block'>
              <button className='w-full py-2 text-sm border rounded-full hover:bg-base-100 transition-colors'>
                Edit Profile Information
              </button>
            </Link>
            
            <Link to="/friends" className='block'>
              <button className='w-full py-2 text-sm border rounded-full hover:bg-base-100 transition-colors'>
                View My Friends
              </button>
            </Link>
            
            <Link to="/notifications" className='block'>
              <button className='w-full py-2 text-sm border rounded-full hover:bg-base-100 transition-colors'>
                Friend Requests
              </button>
            </Link>
            
            <Link to="/" className='block'>
              <button className='w-full py-2 text-sm bg-primary text-base-100 rounded-full hover:opacity-90 transition-opacity'>
                Find Language Partners
              </button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Reminder */}
        {!user.isOnboarded && (
          <div className='w-full bg-base-200 p-4 rounded-lg'>
            <h2 className='text-lg font-semibold mb-2'>Complete Your Profile</h2>
            <p className='text-sm opacity-80 mb-3'>
              Complete your profile to get better language partner recommendations and connect with more learners!
            </p>
            <div className='flex gap-2 text-xs'>
              <span className={user.profilePic ? 'text-success' : 'text-warning'}>
                {user.profilePic ? '✓' : '○'} Profile Picture
              </span>
              <span className={user.location ? 'text-success' : 'text-warning'}>
                {user.location ? '✓' : '○'} Location
              </span>
              <span className={user.NativeLanguage ? 'text-success' : 'text-warning'}>
                {user.NativeLanguage ? '✓' : '○'} Native Language
              </span>
              <span className={user.LearningLanguage ? 'text-success' : 'text-warning'}>
                {user.LearningLanguage ? '✓' : '○'} Learning Language
              </span>
              <span className={user.Bio ? 'text-success' : 'text-warning'}>
                {user.Bio ? '✓' : '○'} Bio
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProfilePage