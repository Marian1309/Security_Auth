import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import axios from 'axios';
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

  const isValidPassword = validatePassword(password);

  if (isValidPassword) {
    return isValidPassword;
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
    body: JSON.stringify({ email })
  });

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
};
