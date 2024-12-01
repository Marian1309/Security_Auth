import { NextResponse } from 'next/server';

import db from '@/db';

export const GET = async () => {
  const attempts = await db.loginAttempt.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(attempts, { status: 200 });
};
