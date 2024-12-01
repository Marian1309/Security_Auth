import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import db from '@/db';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found', code: 404 }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
  }

  const isActive = user.isActive;

  if (!isActive) {
    return NextResponse.json(
      { error: 'Your account is not activated, please activate it in the email' },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
};
