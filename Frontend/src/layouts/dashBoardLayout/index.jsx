import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import Chatlist from '../../components/Chatlist';
const DashBoardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/signin');
    }
  }, [isLoaded, userId])

  if (!isLoaded) {
    return <div>Loading...</div>
  }
  return (
    <div className='DashBoardLayout flex gap-[50px] pt-[20px] h-full'>
      <div className='menu flex-1'>
        <Chatlist />
      </div>
      <div className='content flex-4 bg-[#12101b]'><Outlet /></div>
    </div>
  )
}

export default DashBoardLayout;