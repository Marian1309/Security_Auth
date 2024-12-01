import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import db from '@/db';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  const user = await db.user.findFirst({
    where: { activationToken: token, tokenExpiration: { gte: new Date() } }
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired activation token' },
      { status: 400 }
    );
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      isActive: true,
      activationToken: null,
      tokenExpiration: null
    }
  });

  return redirect('/login?activated=true');
};
