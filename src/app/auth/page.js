// src/app/auth/page.js

"use client";

import { useEffect } from 'react';

const AuthPage = () => {
  useEffect(() => {
    const fetchAuthUrl = async () => {
      const response = await fetch('/api/auth-url');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to the Google Auth URL
      }
    };

    fetchAuthUrl();
  }, []);

  return (
    <div className='flex items-center justify-center h-screen'>
      <h1 className='text-[#F4F4F9] text-2xl font-bold'>Redirecting to Google...</h1>
      <img src='/images/loading.gif' alt='Loading...' />
    </div>
  );
};

export default AuthPage;