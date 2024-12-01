'use client';

import type { ChangeEvent, FC, FormEvent } from 'react';
import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm: FC = () => {
  const [fields, setFields] = useState({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const registered = searchParams.get('registered');

  if (registered) {
    toast.success('Account created successfully. Please login.');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });

    if (response.ok) {
      router.push('/');
      toast.success('Logged in successfully.');
    } else {
      const data = await response.json();
      setError(data.error || 'Invalid email or password.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label className="block text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </Label>

        <Input
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          id="email"
          name="email"
          onChange={handleChange}
          required
          type="email"
          value={fields.email}
        />
      </div>

      <div>
        <Label className="block text-sm font-medium text-gray-700" htmlFor="password">
          Password
        </Label>

        <Input
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          id="password"
          name="password"
          onChange={handleChange}
          required
          type="password"
          value={fields.password}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Button
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        type="submit"
        variant="default"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
