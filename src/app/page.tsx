'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!session?.user && !localStorage.getItem('user')) {
      router.push('/login');
    }
  }, [router, session?.user, status]);

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
      {email && (
        <div className="flex flex-col items-center justify-center gap-y-3">
          The User with email <span className="font-bold">{email}</span> is logged in
        </div>
      )}

      {session && (
        <div className="flex flex-col items-center justify-center gap-y-3">
          The User with email <span className="font-bold">{session.user?.email}</span> is
          logged in with Google Provider
        </div>
      )}

      <Button className="text-3xl" size="lg" variant="secondary">
        <Link href="/admin">Go to Admin Dashboard</Link>
      </Button>

      <div className="flex gap-x-2">
        <Button className="text-xl" size="lg" variant="destructive">
          <span onClick={handleLogout}>Custom Logout</span>
        </Button>

        <Button className="text-xl" size="lg" variant="destructive">
          <span onClick={() => signOut({ callbackUrl: '/login' })}>Google Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
