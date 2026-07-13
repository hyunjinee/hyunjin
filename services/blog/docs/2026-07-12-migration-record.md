# 이중 언어 지원 + Cloudflare 이전 기록 (2026-07-11 ~ 07-12)

## 무슨 일이 있었나

1. **한·영 이중 언어(i18n)**: `app/[locale]` 표준 locale 라우팅 도입. 한국어는 무프리픽스(기존 URL 전부 보존), 영어는 `/en`. 번역은 `data/blog/en/`에 영어 slug로 살고 `translationOf` frontmatter로 원문과 쌍을 맺으며, 양방향 hreflang(x-default=en) + self-canonical. 상세: [ADR-0002](./adr/0002-standard-locale-routing.md), 용어: [CONTEXT.md](../CONTEXT.md)
2. **Vercel 계정 정지 사고**: 캐시 없는 동적 `/og`(satori) 렌더를 크롤러가 43K회 호출 → 호출당 ~1초 CPU → Hobby 한도(4h/월)의 3배 소진 → 계정 전체 정지, 전 사이트 402.
3. **Cloudflare Workers 이전(무료 티어)**: @opennextjs/cloudflare 어댑터. OG는 빌드 타임 정적 생성(`scripts/generate-og.mjs` → `public/og/`)으로 전환해 사고 계열 자체를 제거. DNS는 Route 53 → Cloudflare로 이전, `hyunjinlee.com`을 Worker 커스텀 도메인으로 연결. 상세: [ADR-0003](./adr/0003-cloudflare-migration.md)

> **2026-07-12 추가**: OpenNext 어댑터를 제거하고 `output: 'export'` + 자산 전용 배포로 전환. 상세: [ADR-0004](./adr/0004-static-export.md). 아래 런북은 갱신됨.

> **2026-07-13 추가**: Next.js를 완전히 걷어내고 Astro 7 정적 빌드로 전환 완료(contentlayer2·pliny·next-themes 등 의존 제거). 상세: [ADR-0005](./adr/0005-astro-migration.md). 아래는 구 Next 런북이며, 새 런북은 [Astro 전환 완료](#astro-전환-완료-2026-07-13) 섹션 참고.

## 운영 런북

```bash
# 배포 (Cloudflare 계정 wrangler login 필요)
pnpm deploy:cf              # EXPORT=1 빌드 → postexport(트리 병합·_redirects) → wrangler deploy
pnpm exec wrangler triggers deploy   # 라우트/도메인 트리거만 재적용 (빌드 없이)

# 로컬 workerd 검증
pnpm preview:cf             # 빌드 후 wrangler dev (out/ 자산 서빙)

# 검증 게이트 (파이프라인에 내장)
# contentlayer2 build → validate-i18n(번역 쌍 무결성·allBlogs 직접 참조 금지)
# → generate-og → next build → postbuild(rss + /ko 프리픽스 누출 grep 게이트)
# → postexport(ko 트리 병합 충돌·en soft-404 프루닝·404·_headers·search.json draft 누출 게이트)
```

- **middleware.ts는 `next dev` 전용**: 프로덕션(export)에선 실행되지 않는다. 무프리픽스 ko는 postexport의 트리 병합, /ko 정규화·legacy 301은 `out/_redirects`가 담당. deprecated 경고는 무해.
- **보안 헤더는 `public/_headers`와 next.config.ts securityHeaders 두 곳** — 값 바꿀 때 둘 다 고칠 것.
- **draft 글 URL은 404가 정답**: export에선 generateStaticParams가 draft를 제외해 자연 404. legacy _redirects 생성에서도 draft 제외 유지.
- **새 페이지 라우트가 public/ 경로와 겹치면** postexport 병합 게이트가 빌드 실패로 알려준다 (reports 사례: 원본 HTML을 `public/static/reports/`로 이동).

## 부채 (우선순위순)

1. `/talks/enterthon-2025` 임베드 영상 2개(.mov 95~163MB)는 404 — Workers 정적 자산 25MiB/파일 하드캡. R2 이전 필요.
2. `learn`·`resume2024`·`fit-admin` 서브도메인은 여전히 Vercel행 CNAME (Vercel pause 중엔 402). 이전 또는 폐기 결정 필요.
3. 원문 수정 시 번역 stale 감지는 빌드 경고로만 존재 — validate-i18n 출력 확인 습관.
4. Accept-Language 첫 방문 감지(/ → /en)는 export 전환으로 보류 — 필요 시 ko 홈 클라이언트 스크립트로 재도입 (ADR-0004).

### 해소된 부채 (2026-07-12 static export 전환)

- ~~vercel.json 삭제 + talks CSP를 public/_headers로 이식~~ → 완료
- ~~뉴스레터 API secret 미설정 (500)~~ → 라우트 자체 삭제
- ~~워커 번들 gzip 3,060/3,072 KiB, 여유 12KiB~~ → Worker 스크립트 제거로 한도 소멸
- ~~run_worker_first `!/images/*` 검토~~ → 전 요청이 자산 서빙(무과금)이라 무의미

## Astro 전환 완료 (2026-07-13)

Next.js(App Router)·contentlayer2·pliny 트리를 전부 삭제하고 `src/`(Astro 7)로 스위치했다. 상세 결정·발견은 [ADR-0005](./adr/0005-astro-migration.md).

### 새 운영 런북

```bash
# 개발
pnpm dev                    # astro dev

# 빌드 (단일 체인)
pnpm build                  # validate-i18n → generate-og → build-search-index → astro build → rss → verify-dist
pnpm build:cf                # pnpm build 별칭(Cloudflare 배포용, 구 EXPORT=1 플래그 없음)

# 배포 (Cloudflare 계정 wrangler login 필요)
pnpm deploy:cf               # pnpm build → wrangler deploy
pnpm exec wrangler triggers deploy   # 라우트/도메인 트리거만 재적용 (빌드 없이)

# 로컬 workerd 검증
pnpm preview:cf              # pnpm build → wrangler dev (dist/ 자산 서빙)
```

- **`dist/`가 새 빌드 산출물 루트** (구 `out/`). `wrangler.jsonc`의 `assets.directory`도 `dist`로 변경됨.
- **`data/siteMetadata.js`는 ESM**(`export default`) — `package.json`에 `"type": "module"` 추가. CJS로 되돌리면 `astro dev`가 Vite PostCSS 설정 탐색 단계에서 크래시한다(ADR-0005 발견 항목).
- **css 진입점은 `css/tailwind.css` 하나** — 구 `css/tailwind-astro.css`(src 전용 `@source` 확장 파일)는 삭제하고 `@source "src/**/*.{astro,ts,tsx}"`를 본체에 합쳤다. `postcss.config.js`도 삭제(Tailwind는 `@tailwindcss/vite` 플러그인 경유).
- **보안 헤더는 `public/_headers` 하나로 단일화** — `next.config.ts`(securityHeaders)가 사라지면서 두 곳을 맞추던 구 부채가 자연 소멸.
- **타입 체크는 `astro check`(또는 `tsc --noEmit`)** — `tsconfig.json`이 `astro/tsconfigs/strict`를 상속하며 처음으로 `src/`·`scripts/`를 포함한다(구 tsconfig는 마이그레이션 기간 동안 `src`를 통째로 제외했었다). `.astro` import는 raw `tsc`가 해석하지 못하는 게 알려진 제약이라 `astro check`가 정본 도구.
- **draft 글 URL은 여전히 404가 정답**: `verify-dist.mjs`가 8종 게이트(URL 계약·draft 누출·grep needle·404·`_headers`/`_redirects`·feed 항목 수·sitemap ⊆ 계약·en 표면 봉인)로 빌드 실패를 강제한다.

### 해소된 부채 (2026-07-13 Astro 전환)

- ~~middleware.ts(`next dev` 전용) + next.config.ts securityHeaders 이중 관리~~ → 둘 다 삭제, `public/_headers` 단일화
- ~~contentlayer2/pliny/next-themes 등 무거운 런타임 의존~~ → 전부 제거, Astro Content Collections + 자체 island로 대체
- ~~`astro:`/`astro:build` 접두 스크립트와 Next 스크립트(`start`/`dev:no-turbo`/`serve`/`analyze`/`lint`) 병존~~ → `astro dev`/`astro build`가 각각 `dev`/`build`로 승격, Next 전용 스크립트 삭제
- ~~umami 분석 설정(`siteMetadata.analytics`)이 어디에서도 소비되지 않던 dead config~~ → GHA `PUBLIC_UMAMI_ID`로 정리(ADR-0005 발견 항목), giscus env 잔재(`NEXT_PUBLIC_GISCUS_*`)도 함께 제거

### 남은 부채

- storybook 계열(`@storybook/nextjs`)은 Next 결합이 남아 있으나 스코프 밖으로 명시적으로 보류 — `postcss.config.js` 삭제로 storybook의 Tailwind 처리 경로가 끊겼을 가능성 있음.
- `biome check .`의 포맷 전용 findings 15건(`src/lib/talks/records/*.json` 등, Task 10 이전부터 존재) — Next/Astro 전환과 무관해 미착수.
- 구 [부채 목록](#부채-우선순위순)의 1~3번(enterthon-2025 대용량 영상, Vercel행 서브도메인, 번역 stale 감지)은 Astro 전환과 독립적이라 그대로 유효.

## 이전 이력 문서

- 계획: [2026-07-11 locale-routing](./superpowers/plans/2026-07-11-locale-routing.md), [2026-07-12 cloudflare-migration](./superpowers/plans/2026-07-12-cloudflare-migration.md), [2026-07-13 astro-migration](./superpowers/plans/2026-07-13-astro-migration.md)
- ADR: [0001(superseded)](./adr/0001-language-as-post-property.md) → [0002 locale 라우팅](./adr/0002-standard-locale-routing.md), [0003 Cloudflare 이전](./adr/0003-cloudflare-migration.md), [0004 static export](./adr/0004-static-export.md), [0005 Astro 전환](./adr/0005-astro-migration.md)
