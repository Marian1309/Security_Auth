'use client';

import type { ChangeEvent, FC, FormEvent } from 'react';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterForm: FC = () => {
  const [fields, setFields] = useState({ email: '', password: '' });

  const [error, setError] = useState<string>('');

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });

    if (response.ok) {
      router.push('/login');
    } else {
      const data = await response.json();
      setError(data.error || 'An error occurred during registration.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label className="block text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </Label>

        <Input
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;
