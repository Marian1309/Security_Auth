import type { FC, PropsWithChildren } from 'react';

import { Toaster } from 'react-hot-toast';

type Props = PropsWithChildren;

const Providers: FC<Props> = ({ children }) => {
  return (
    <>
      {children} <Toaster />
    </>
  );
};

export default Providers;
