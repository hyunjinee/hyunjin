import type { Metadata } from 'next'
import './globals.css'
import { pretendard } from '@/fonts/pretendard'

export const metadata: Metadata = {
  title: '이현진 2024',
  description: '이현진의 2024 이력서',
  icons: {
    icon: '/soccer.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={`antialiased ${pretendard.className}`}>{children}</body>
    </html>
  )
}
