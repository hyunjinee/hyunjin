import { notFound } from 'next/navigation'

// 매치되지 않는 경로를 레이아웃 포함 커스텀 404로 렌더 (루트 무매치가 프레임워크 기본 404로 새지 않도록)
// output: 'export'에선 /ko/404를 프리렌더해 postexport가 최상위 404.html로 복사한다
export const generateStaticParams = () => [{ locale: 'ko', rest: ['404'] }]

export default function CatchAll() {
  notFound()
}
