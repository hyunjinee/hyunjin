// app/[locale]/(ko-only)/dev/view-transition/utils/{constants,cx}.ts 이식 — 이 두 데모가 실제로 쓰는
// PLACES만 옮겼다(POSTS/AUTHORS는 어느 데모도 참조하지 않는 죽은 데이터라 제외).
//
// ViewTransitionSafe: React의 `<ViewTransition>`은 아직 stable npm react 패키지가 export하지 않는
// 실험 API다 — next.config.ts의 experimental.viewTransition:true가 Next 빌드에서만 react를 canary
// 채널(0.0.0-experimental-*)로 바꿔치기해 동작했던 것(레포에 실제로 그 canary 패키지가 워크스페이스
// 루트에 존재함, next 전용 hoist). Astro/Vite는 그 치환을 하지 않아 표준 react 19.2.3을 그대로 resolve하고,
// 여기엔 ViewTransition이 없다(node -e로 실측: undefined) — verbatim으로 import하면 "Element type is
// invalid" 런타임 크래시. 페이지 전체를 깨뜨리는 대신 있으면 쓰고 없으면 Fragment로 폴백한다(에니메이션만
// 없어지고 나머지 콘텐츠는 그대로 보임). ponytail: 이 두 dev 데모 전용 임시 방편 — react를 experimental
// 채널로 전역 교체하면 다른 island(react-pdf, react-notion-x 등)의 호환성을 깨뜨릴 위험이 커서 보류.
// 업그레이드 경로: stable react가 ViewTransition을 export하게 되면 이 폴백은 자동으로 무력화(그대로 둬도 무해).

import type { ReactNode } from 'react'
import * as React from 'react'

type ViewTransitionComponent = (props: { name?: string; children?: ReactNode }) => ReactNode

export function ViewTransitionSafe({ name, children }: { name?: string; children?: ReactNode }) {
  const RealViewTransition = (React as unknown as { ViewTransition?: ViewTransitionComponent }).ViewTransition
  if (RealViewTransition) return <RealViewTransition name={name}>{children}</RealViewTransition>
  return <>{children}</>
}

export const cx = (...classes: (string | undefined | null | false)[]): string => classes.filter(Boolean).join(' ')

export const PLACES = [
  {
    id: 1,
    name: 'Florence',
    image: '/cards/florence.png',
    slug: 'florence',
    description: `A city in central Italy and the capital city of the Tuscany region. It is the most populous city in Tuscany, with 383,084 inhabitants in 2013, and over 1,520,000 in its metropolitan area.`,
  },
  {
    id: 2,
    name: `Xi'an`,
    image: '/cards/xian.png',
    slug: 'xian',
    description:
      'An ancient city in China with 2000 years history, amazing food, located in the central part of the Shaanxi Province.',
  },
  {
    id: 3,
    name: 'Barcelona',
    image: '/cards/barcelona.png',
    slug: 'barcelona',
    description:
      'A city on the coast of northeastern Spain. It is the capital and largest city of the autonomous community of Catalonia, as well as the second most populous municipality of Spain.',
  },
  {
    id: 4,
    name: 'Santa Monica',
    image: '/cards/santamonica.png',
    slug: 'santamonica',
    description:
      'A beachfront city in western Los Angeles County, California, United States. Situated on Santa Monica Bay, it is bordered on five sides by different neighborhoods of the city of Los Angeles.',
  },
]
