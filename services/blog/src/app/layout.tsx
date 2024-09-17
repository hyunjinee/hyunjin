import { ReactNode } from 'react';
import { type Metadata } from 'next';
import { Providers } from '~/components/providers';
import { pretendard } from '~/fonts/pretendard';

export const metadata: Metadata = {
  title: 'hyunjin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
