import { notFound } from 'next/navigation'

// 이 그룹의 페이지들은 한국어 전용 콘텐츠(포트폴리오·발표·데모)라 /en 아래에 존재하지 않는다
export default async function KoOnlyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== 'ko') notFound()
  return children
}
