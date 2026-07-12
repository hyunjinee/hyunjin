# 이중 언어 지원 + Cloudflare 이전 기록 (2026-07-11 ~ 07-12)

## 무슨 일이 있었나

1. **한·영 이중 언어(i18n)**: `app/[locale]` 표준 locale 라우팅 도입. 한국어는 무프리픽스(기존 URL 전부 보존), 영어는 `/en`. 번역은 `data/blog/en/`에 영어 slug로 살고 `translationOf` frontmatter로 원문과 쌍을 맺으며, 양방향 hreflang(x-default=en) + self-canonical. 상세: [ADR-0002](./adr/0002-standard-locale-routing.md), 용어: [CONTEXT.md](../CONTEXT.md)
2. **Vercel 계정 정지 사고**: 캐시 없는 동적 `/og`(satori) 렌더를 크롤러가 43K회 호출 → 호출당 ~1초 CPU → Hobby 한도(4h/월)의 3배 소진 → 계정 전체 정지, 전 사이트 402.
3. **Cloudflare Workers 이전(무료 티어)**: @opennextjs/cloudflare 어댑터. OG는 빌드 타임 정적 생성(`scripts/generate-og.mjs` → `public/og/`)으로 전환해 사고 계열 자체를 제거. DNS는 Route 53 → Cloudflare로 이전, `hyunjinlee.com`을 Worker 커스텀 도메인으로 연결. 상세: [ADR-0003](./adr/0003-cloudflare-migration.md)

## 운영 런북

```bash
# 배포 (Cloudflare 계정 wrangler login 필요)
pnpm deploy:cf              # opennextjs-cloudflare build && deploy
pnpm exec wrangler triggers deploy   # 라우트/도메인 트리거만 재적용 (빌드 없이)

# 로컬 workerd 검증
pnpm preview:cf

# 검증 게이트 (build에 내장)
# contentlayer2 build → validate-i18n(번역 쌍 무결성·allBlogs 직접 참조 금지)
# → generate-og → next build → postbuild(rss + /ko 프리픽스 누출 grep 게이트)

# 시크릿 (뉴스레터 필요 시)
pnpm exec wrangler secret put <KEY>
```

- **middleware.ts**: Next 16에서 deprecated 경고가 뜨지만 의도된 것 — @opennextjs/cloudflare가 proxy.ts(Node middleware)를 지원하지 않음. proxy.ts로 되돌리면 Cloudflare 빌드가 깨진다.
- **워커 번들 gzip 3,060/3,072 KiB (free 한도)**: 여유 12KiB. 서버 사이드 의존성 추가 시 `wrangler deploy --dry-run`으로 크기 확인. 초과 시 Workers Paid($5/월, 10MiB)로.
- **draft 글 URL은 404가 정답**: legacy slug 리다이렉트에서 draft를 제외하지 않으면 자기참조 308 루프가 된다 (2026-07-12 수정).

## 부채 (우선순위순)

1. `/talks/enterthon-2025` 임베드 영상 2개(.mov 95~163MB)는 404 — Workers 정적 자산 25MiB/파일 하드캡. R2 이전 필요.
2. Vercel 완전 정리 시: `vercel.json` 삭제 + talks CSP 헤더를 `public/_headers`로 이식, README의 Vercel 배지 정리.
3. `learn`·`resume2024`·`fit-admin` 서브도메인은 여전히 Vercel행 CNAME (Vercel pause 중엔 402). 이전 또는 폐기 결정 필요.
4. 뉴스레터 API secret 미설정 (현재 500).
5. `run_worker_first`에 `!/images/*` 추가 검토 (요청 과금 절약, 급하지 않음).
6. 원문 수정 시 번역 stale 감지는 빌드 경고로만 존재 — validate-i18n 출력 확인 습관.

## 이전 이력 문서

- 계획: [2026-07-11 locale-routing](./superpowers/plans/2026-07-11-locale-routing.md), [2026-07-12 cloudflare-migration](./superpowers/plans/2026-07-12-cloudflare-migration.md)
- ADR: [0001(superseded)](./adr/0001-language-as-post-property.md) → [0002 locale 라우팅](./adr/0002-standard-locale-routing.md), [0003 Cloudflare 이전](./adr/0003-cloudflare-migration.md)
