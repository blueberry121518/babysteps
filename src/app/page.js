// src/app/page.js

"use client";

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus) {
      localStorage.removeItem('isAuthenticated');
    }

    // Event listener for changes in localStorage
    const handleStorageChange = (event) => {
      if (event.key === 'isAuthenticated') {
        setIsAuthenticated(event.newValue === 'true');
        if (event.newValue === 'true') {
          window.location.href = '/form'; // Redirect to /form
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array means this runs once on mount

  console.log(isAuthenticated)
  return (
    <div className='flex flex-row h-full'>
      <div className='flex-1 flex flex-col bg-[#B8DBD9] justify-between min-w-[50%]'>
        <div className='flex'>
          <h1 className='font-bold text-4xl p-8'>babysteps</h1>
        </div>
        <div className='flex pl-8'>
          <h1 className='text-[60px] w-[65%] font-bold'>Where your goals meet your calendar, one step at a time.</h1>
        </div>
        <div className='flex w-[35%] pl-8 font-bold text-[17px] mb-20'>
          <p>With minimal input, we turn your dreams into sastifying microgoals automically added to your Google Calendar.</p>
        </div>
      </div>
      <div className='flex-1 flex flex-col items-center mt-8 w-1/2 h-full relative overflow-hidden'>
        <div className='absolute top-0 left-0 text-[80px] p-4 font-bold text-[#586F7C] w-1/2 ml-12'>
          First Step Is Key
        </div>
        <div className='relative'>
          <img 
            src="/images/foot5.png" 
            alt="foot" 
            className='w-[700px] h-[800px] custom-rotate' 
            style={{ left: '200px', top: '-50px', position: 'relative' }} // Adjust the left value as needed
          ></img>
          <button 
            className='font-bold text-[30px] text-black py-8 px-7 rounded-full hover:drop-shadow-[0_35px_35px_rgba(255,255,255,0.25)] transition duration-200 absolute top-[49%] left-[36%] transform -translate-x-1/2 -translate-y-1/2'
            onClick={() => window.open('/auth', '_blank')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}