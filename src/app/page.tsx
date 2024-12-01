'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const user = localStorage.getItem('user');

  const { email } = JSON.parse(user || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-10 text-5xl">
      <div className="flex flex-col items-center justify-center gap-y-3">
        The User with email <span className="font-bold">{email}</span> is logged in
      </div>

      <Button className="text-3xl" size="lg" variant="secondary">
        <Link href="/admin">Go to Admin Dashboard</Link>
      </Button>

      <Button className="text-3xl" size="lg" variant="destructive">
        <span onClick={handleLogout}>Logout</span>
      </Button>
    </div>
  );
};

export default HomePage;
