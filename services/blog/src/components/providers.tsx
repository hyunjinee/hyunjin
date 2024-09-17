'use client';

import { ThemeProvider } from 'next-themes';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider enableSystem defaultTheme="system" disableTransitionOnChange attribute="class">
      {children}
    </ThemeProvider>
  );
};
