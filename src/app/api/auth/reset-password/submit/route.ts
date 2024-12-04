import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import db from '@/db';

export const POST = async (req: NextRequest) => {
  const { token, password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
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

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token }
  });

  if (!resetToken || new Date() > resetToken.expiresAt) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword }
  });

  await db.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
};
