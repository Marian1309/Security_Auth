import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

import db from '@/db';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();
  const headersList = headers();
  const ipAddress = headersList.get('x-forwarded-for');

  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user) {
    await db.loginAttempt.create({
      data: {
        email,
        ipAddress: ipAddress || '',
        success: false
      }
    });

    return NextResponse.json({ error: 'User not found', code: 404 }, { status: 404 });
  }

  if (user.isBlocked && user.blockedUntil && user.blockedUntil > new Date()) {
    return NextResponse.json(
      { error: `Account is blocked until ${user.blockedUntil.toISOString()}` },
      { status: 403 }
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password || 'Marian1309');

  if (!isPasswordValid) {
    await db.loginAttempt.create({
      data: {
        email: user.email,
        ipAddress: ipAddress || '',
        success: false
      }
    });

    const failedAttempts = user.failedAttempts + 1;

    if (failedAttempts >= 5) {
      const blockedUntil = new Date();
      blockedUntil.setMinutes(blockedUntil.getMinutes() + 15);

      await db.user.update({
        where: { email: user.email },
        data: {
          isBlocked: true,
          blockedUntil,
          failedAttempts: 0
        }
      });

      return NextResponse.json(
        {
          error: 'Account blocked due to too many failed login attempts. Try again later.'
        },
        { status: 403 }
      );
    }

    await db.user.update({
      where: { email: user.email },
      data: {
        failedAttempts
      }
    });

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isActive = user.isActive;

  if (!isActive) {
    return NextResponse.json(
      { error: 'Your account is not activated, please activate it in the email' },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { email: user.email },
    data: {
      failedAttempts: 0,
      isBlocked: false,
      blockedUntil: null
    }
  });

  await db.loginAttempt.create({
    data: {
      email: user.email,
      ipAddress: ipAddress || '',
      success: true
    }
  });

  return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
};
