import type { FC } from 'react';

import Link from 'next/link';

import RegisterForm from './register-form';

const RegisterPage: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
