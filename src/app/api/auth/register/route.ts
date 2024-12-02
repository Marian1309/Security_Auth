import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import axios from 'axios';
import bcrypt from 'bcrypt';

import db from '@/db';

export const POST = async (req: NextRequest) => {
  const { email, password, captchaValue } = await req.json();

  const SECRET_KEY = '6LfFj48qAAAAAG839gCmsofK3O7XkPflvm9Ft1Dp';
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${captchaValue}`;

  try {
    const captchaResponse = await axios.post(verifyUrl);
    const { success } = captchaResponse.data;

    if (!success) {
      return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error verifying captcha' }, { status: 500 });
  }

  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      return 'Password must contain both uppercase and lowercase letters';
    }

    if (!/\d/.test(password)) {
      return 'Password must contain a number';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain a special character';
    }

    return undefined;
  };

  const error = validatePassword(password);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      isActive: false
    }
  });

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/send-activation-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
};
