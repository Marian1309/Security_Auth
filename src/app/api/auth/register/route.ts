import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import db from '@/db';

import { validatePassword } from '@/lib/utils';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  const existingUser = await db.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  validatePassword(password);

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
};
