'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Forgot Password</h1>

      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <Input
          className="rounded border p-2"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          type="email"
          value={email}
        />

        <Button className="rounded bg-blue-500 p-2 text-white" type="submit">
          Send Reset Link
        </Button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
