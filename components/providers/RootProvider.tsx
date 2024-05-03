'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

function RootProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

export default RootProvider;
