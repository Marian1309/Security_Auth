'use client';

import { useEffect, useState } from 'react';

const HomePage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const user = localStorage.getItem('user');

  const { email } = JSON.parse(user || '{}');

  return (
    <div className="flex h-screen flex-col items-center justify-center text-5xl">
      The User with email <span className="font-bold">{email}</span> is logged in
    </div>
  );
};

export default HomePage;
