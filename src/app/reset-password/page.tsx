'use client';

import type { FC } from 'react';
import { useState } from 'react';

import { MoonLoader } from 'react-spinners';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    setMessage(data.message || data.error);

    setIsLoading(false);
    setEmail('');
  };

  return (
    <div className="flex h-screen min-w-[200px] flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Forgot Password</h1>

      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <Input
          className="min-w-[200px] rounded border p-2"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          value={email}
        />

        <Button className="rounded bg-blue-500 p-2 text-white" type="submit">
          {isLoading ? <MoonLoader color="#fff" size={14} /> : 'Send Reset Link'}
        </Button>
      </form>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
