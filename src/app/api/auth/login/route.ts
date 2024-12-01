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
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Login successful' }, { status: 200 });
};
