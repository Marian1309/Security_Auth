import { NextResponse } from 'next/server';

import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const validatePassword = (password: string) => {
  if (password.length < 8) {
    return NextResponse.json(
      {
        error: 'Password must be at least 8 characters'
      },
      { status: 400 }
    );
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    return NextResponse.json(
      {
        error: 'Password must contain both uppercase and lowercase letters'
      },
      { status: 400 }
    );
  }

  if (!/\d/.test(password)) {
    return NextResponse.json(
      { error: 'Password must contain a number' },
      { status: 400 }
    );
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return NextResponse.json(
      { error: 'Password must contain a special character' },
      { status: 400 }
    );
  }

  return true;
};
