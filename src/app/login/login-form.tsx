'use client';

import type { ChangeEvent, FC, FormEvent } from 'react';
import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm: FC = () => {
  const [fields, setFields] = useState({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const activated = searchParams.get('activated');

  if (activated) {
    setTimeout(() => {
      toast.success('Account activated successfully. Please login.');
      router.replace('/login');
    }, 1000);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/');
      toast.success('Logged in successfully.');
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      if (data.code === 404) {
        router.push('/register?notFound=true');
      }

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

      <div className="flex items-center gap-x-2">
        <Button
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          size="lg"
          type="submit"
          variant="default"
        >
          Login
        </Button>

        <Button
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => signIn('google')}
          size="lg"
          type="button"
          variant="default"
        >
          <div className="flex items-center gap-x-2">
            Login with Google <FcGoogle size={20} />
          </div>
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
