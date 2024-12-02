import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import db from '@/db';

export const POST = async (req: NextRequest) => {
  const { token, password } = await req.json();

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
