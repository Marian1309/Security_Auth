'use client';

import type { FC } from 'react';

import { BounceLoader } from 'react-spinners';

type Props = {
  loading?: boolean;
};

const Loading: FC<Props> = ({ loading = true }) => {
  return (
    <div className="min-h-screen flex-center">
      <BounceLoader color="rgb(79, 70, 229)" loading={loading} size={40} />
    </div>
  );
};

export default Loading;
