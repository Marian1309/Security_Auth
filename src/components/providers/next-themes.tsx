'use client';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
