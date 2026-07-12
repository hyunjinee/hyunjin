---
status: accepted
---

# Vercel에서 Cloudflare Workers로 이전, OG 이미지는 빌드 타임 정적 생성

Vercel Hobby의 Fluid Active CPU 한도(4h/월)를 크롤러발 /og 동적 렌더링(호출당 ~1초 CPU × 43K회)이 고갈시켜 계정 전체가 정지(전 사이트 402)됐다. 리서치(에이전트 10개, 관문 클레임 6건 적대 검증) 결과 Cloudflare Workers + @opennextjs/cloudflare로의 이전이 가능함을 확인했고, OG 이미지를 빌드 타임 정적 생성으로 전환해 무료 티어로 이전하기로 했다.

## 결정 사항

- **런타임**: Cloudflare Workers + @opennextjs/cloudflare (Next 16 공식 지원 확인). Pages/next-on-pages는 deprecated라 배제.
- **OG 이미지**: 동적 `/og` 라우트를 제거하고 빌드 타임에 satori로 글별 PNG를 정적 생성(`public/og/`). 근거: satori 렌더는 Workers free의 10ms CPU/요청 한도 초과 + @vercel/og 번들(~2.2MiB)이 free 3MiB 압축 한도를 압박. 정적화하면 크롤러 트래픽의 CPU 소모라는 사고 계열 자체가 소멸.
- **middleware**: proxy.ts를 middleware.ts로 리네임 (어댑터가 Node middleware/proxy 미지원을 메인테이너가 확정, edge middleware는 지원. 우리 코드는 edge 호환이라 파일명 변경으로 충분).
- **요금제**: Workers Free (월 12만 요청 = free 한도의 4%. 정적 자산은 무료·무제한).
- **이미지 최적화**: `images.unoptimized: true` (Cloudflare Images 변환은 유료 + CPU 이슈, 개인 블로그 규모에 불필요).
- **분석**: @vercel/analytics·speed-insights 제거. Cloudflare Web Analytics는 대시보드에서 토큰 발급 후 별도 추가.

## Consequences

- 커스텀 도메인은 네임서버를 Cloudflare로 이전(Full setup)해야 연결 가능. DNS 이전 시점에 Vercel 402 장애도 종료된다.
- `open-next.config.ts`에 `incrementalCache: staticAssetsIncrementalCache` 필수 — 누락 시 SSG 페이지가 매 요청 SSR 폴백하며 500 (가장 흔한 마이그레이션 함정).
- Next 16에서 middleware.ts는 deprecated 경고가 뜨지만 동작. Next.js가 완전 제거하면 OpenNext adapters-api(활성 개발 중) 이행 전까지 업그레이드가 막히는 꼬리 리스크 수용.
- Workers 응답은 Vercel과 달리 CDN이 s-maxage를 자동 존중하지 않음. OG 정적화로 이 이슈 자체를 회피.
- Vercel 배포는 이 브랜치 머지 후 중단 대상 (analytics 제거, unoptimized 이미지 등으로 Vercel 최적 경로가 아니게 됨).
