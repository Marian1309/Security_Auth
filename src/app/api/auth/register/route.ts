import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import db from '@/db';

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

  return undefined;
};

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const isValidPassword = validatePassword(password);

  if (isValidPassword) {
    return isValidPassword;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
};
