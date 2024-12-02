import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import Mailjet from 'node-mailjet';
import { v4 as uuidv4 } from 'uuid';

import db from '@/db';

const MAIL_API_PUBLICE = '80c08fe7e05627ebefed1a6d169e5c9d';
const MAIL_API_SECRET = '3aaf21acfadf3273a85cdfe9bc081c6b';

export const POST = async (req: NextRequest) => {
  const { email } = await req.json();

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt
    }
  });

  const mailjet = new Mailjet({
    apiKey: MAIL_API_PUBLICE,
    apiSecret: MAIL_API_SECRET
  });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'pidchashymaryan@gmail.com',
          Name: 'Marian Inc.'
        },
        To: [{ Email: email }],
        Subject: 'Password Reset Request',
        TextPart: `Click the link to reset your password: ${resetLink}`,
        HTMLPart: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
      }
    ]
  });

  return NextResponse.json({ message: 'Password reset link sent' }, { status: 200 });
};
