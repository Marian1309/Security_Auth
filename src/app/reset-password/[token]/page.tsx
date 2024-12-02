'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

const ResetPassword: React.FC<{ params: { token: string } }> = ({ params }) => {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/auth/reset-password/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: params.token, password })
    });
    const data = await response.json();
    setMessage(data.message || data.error);

    if (response.ok) {
      router.push('/auth');
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Reset Password</h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          className="rounded border p-2"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          type="password"
          value={password}
        />
        <button className="rounded bg-blue-500 p-2 text-white" type="submit">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
