'use client';

import type { FC, PropsWithChildren } from 'react';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

type Props = PropsWithChildren;

const Providers: FC<Props> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
      <Toaster />
    </>
  );
};

export default Providers;
