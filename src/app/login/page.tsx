import type { FC } from 'react';

import Link from 'next/link';

import LoginForm from './login-form';

const LoginPage: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <LoginForm />

        <div className="flex justify-between">
          <Link href="/reset-password">Forgot password?</Link>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account? <Link href="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
