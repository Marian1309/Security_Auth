import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import crypto from 'crypto';
import Mailjet from 'node-mailjet';

import db from '@/db';

const MAIL_API_PUBLICE = '80c08fe7e05627ebefed1a6d169e5c9d';
const MAIL_API_SECRET = '3aaf21acfadf3273a85cdfe9bc081c6b';

const generateActivationToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

export const POST = async (req: NextRequest) => {
  const { email } = await req.json();

  const existingUser = await db.user.findUnique({ where: { email } });

  if (!existingUser) {
    return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
  }

  if (existingUser.isActive) {
    return NextResponse.json({ error: 'User is already active' }, { status: 400 });
  }

  const activationToken = generateActivationToken();

  await db.user.update({
    where: { email },
    data: {
      activationToken,
      tokenExpiration: new Date(Date.now() + 3600000) // Токен діє 1 годину
    }
  });

  const mailjet = new Mailjet({
    apiKey: MAIL_API_PUBLICE,
    apiSecret: MAIL_API_SECRET
  });

  const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/activate?token=${activationToken}`;

  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'pidchashymaryan@gmail.com',
          Name: 'Marian Inc.'
        },
        To: [{ Email: email }],
        Subject: 'Activate your account',
        TextPart: `Click the following link to activate your account: ${activationLink}`
      }
    ]
  });

  return NextResponse.json({ error: 'Failed to send activation email' }, { status: 500 });
};
