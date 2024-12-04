'use client';

import type { FC, FormEvent } from 'react';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { MoonLoader } from 'react-spinners';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  params: { token: string };
};

const ResetPassword: FC<Props> = ({ params }) => {
  const router = useRouter();

  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const response = await fetch('/api/auth/reset-password/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.token, password })
    });

    const data = await response.json();
    setMessage(data.message || data.error);

    setIsLoading(false);

    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Reset Password</h1>

      <form className="flex min-w-[200px] flex-col space-y-4" onSubmit={handleSubmit}>
        <Input
          className="rounded border p-2"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          type="password"
          value={password}
        />
        <Button className="rounded bg-blue-500 p-2 text-white" type="submit">
          {isLoading ? <MoonLoader color="#fff" size={14} /> : 'Reset Password'}
        </Button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
