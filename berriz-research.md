# Berriz 기여 리서치 (포트폴리오 원본 자료)

> 생성일: 2026-06-09 · 본인 참고용(**미게시**)
> 소스: 로컬 git(`~/berriz/*`) · GitHub(kakaoent org) · Jira(BRZ) · Confluence
> 공개 페이지(`/berriz`)는 이 자료를 **포트폴리오 수위로 일반화**해 작성됨.

---

## 0. 요약 지표

| 항목 | 값 |
|---|---|
| 메인 FE(`fe-music-fan-platform`) | **3,566 커밋 · 680 PR 머지** — 단일 레포 최다 기여자 |
| 메인 FE 기간 | 2024.08 ~ 진행중 (~22개월) |
| 기여 레포 | 7+ (플랫폼·파트너센터·오디션·라이브플레이어·딥링크·위키·DevOps) |
| Jira BRZ | 할당 **100건** (완료/닫힘 84, 실질 제품 기여 ~80) · 추적기간 2026.02~06 |
| Confluence | 작성 **63 페이지** |
| 사내 AI 자동화 | 약 328 커밋 규모 별도 구축 |

### 레포별 본인 커밋(jin.2@kakaoent.com)
| 레포 | 내 커밋 | PR | 기간 |
|---|---:|---:|---|
| fe-music-fan-platform | 3,566 | 680 | 2024.08 ~ 진행중 |
| fe-berriz-partner-center | 239 | 27 | 2026.02 ~ 05 |
| fe-music-audition | 164 | 28 | 2025.01 ~ 04 |
| live-player | 121 | 10 | 2024.07 ~ 09 |
| berriz-wiki | 71 | 0 | 2026.04 ~ 05 |
| fe-music-devops | 27 | 0 | 2024.12 ~ 25.04 |
| fe-ui-preview | 14 | 2 | 2024.08 |
| artistmindmap2 | 30 | 0 | 2025.12 (5일) |
| fanz-account | 6 | 0 | 2026.05 (sync 머지) |
| fe-berriz-ai | 1 | 0 | 2026.03 (init) |
| berriz-mcp | 0 | 0 | — |

---

## 1. 레포별 기여 (git/GitHub 마이닝)

### fe-music-fan-platform — Berriz 메인 FE 플랫폼 (최다 기여자)
역할: 계정/멜론 연동·팬클럽·커머스·딥링크·웹뷰 브릿지 등 제품 전반 주도 + 사내 AI 개발 자동화 구축.

- **계정/멜론 2-way linking + 본인인증**: 인바운드/아웃바운드 동의 플로우, 연동 사전 체크로 중복 연동 차단, 세션 만료 재로그인, 연동 정보 화면 타임존(KST→기기 TZ) 정정 등 식별/인증 도메인 전반.
- **웹뷰 브릿지 아키텍처**: 네이티브 앱과 통화/국가 상태 동기화 `setAppValues`, Pull-to-Refresh 제어, `openScheme` 기반 앱 내 네비게이션 분기, 디버그 패널.
- **팬클럽/팬카드**: 회원정보 카드 모달(생년월일·이름 필드 처리), 주문서 연동, 안드로이드 웹뷰 닫힘 시 모달 상태 보존.
- **fan-commerce(샵)**: 상품 상세·주문·장바구니, VOD 연관 상품 브라우저 웹뷰 결제, OG 썸네일, PTR UX.
- **fan-link 딥링크**: account/community OG 다국어, Lambda OG fetch + 폴백, qa/cbt/sandbox 다중 환경.
- **오디션 투표**: 결과 처리, Countdown, SVG 렌더링 최적화로 TPS 개선, 심사기간별 탭 노출.
- **헤더/레이아웃·SSR**: 스티키 헤더, MD/SM 반응형, `useId` 고정으로 하이드레이션 불일치 해소, 상태바/바텀네비 높이 CSS 변수화.
- **i18n**: next-intl + Google Sheet 번역 동기화 파이프라인.
- **사내 AI 개발 자동화**: Jira 폴링 → Claude Code 작업 자동 spawn 오케스트레이터 데몬 + 평가/벤치마크 하네스(GitHub Actions 기반).
- 기술: Next.js 14, React 18, TS, TanStack Query, next-intl, Zod, RHF, Tailwind, Turborepo(pnpm), Sentry, Storybook, Cypress, AWS Lambda/CloudFront Functions, Chromecast(CAF), Kakao Tiara.
- ★ notable: 네이티브 앱-웹 상태 동기화 웹뷰 브릿지 아키텍처(`setAppValues`, PTR, 스킴 네비, 디버그 패널) 설계.

### fe-berriz-partner-center — 파트너센터(예약·TVOD·행사) 0→1
- 예약(부킹) 도메인 0부터 구축: 4단계 멀티스텝 퍼널(기본정보/노출항목/예약설정/이용설정)·수정·삭제 + 전용 CRUD API.
- container/presentational 분리(컨테이너 8 + presentational 68), TanStack React Form + Zod 복합 검증.
- 폼↔API 양방향 변환 유틸, UTC 자정 기준 날짜 범위 보정 등 타임존 처리.
- TVOD 구매혜택: 혜택-상품 매핑, 리딤코드 사용유무 자동, 클레임 관리 연동, 검증 API 이관.
- 행사(Experience) 관리, ReservationEvent→Experience 용어 통일, savedPath 이미지 업로드.
- zero-prop bypass render props를 26개+ 컨테이너에서 제거하는 대규모 리팩토링.
- agent-browser + vitest E2E 인프라 + CI(병렬, graceful skip, env 주입).
- 기술: React 19, Next.js 15(App Router), TanStack Query/Form, Zod, Tailwind 4, dayjs, TinyMCE, Vitest, agent-browser, @kakaoent b2b-design-system.

### fe-music-audition — 오디션 'Debut's Plan' 글로벌 실시간 투표
- ★ 글로벌 타임존 마감시각 오산 크리티컬 버그 → dayjs KST 고정 재설계 + 18개 타임존 Vitest 테스트로 회귀 봉인 (PR #38/#39).
- SSR/미들웨어 인증 → 정적 익스포트(next export) + 클라이언트 리다이렉트 + 404 폴백 (PR #7).
- 주요 페이지 CSR 전환, 로딩/스크롤 정리 (PR #1).
- next-intl 다국어, 약관·QA·투표 상태·에러 문구 정비 (PR #5,14,15,23,25).
- 투표 실패 에러 세분화 + BE 캐싱 파라미터 (PR #23,38).
- Tiara/pacode·pcid 트래킹 (PR #18,37). OG/favicon/Fallback 이미지 (PR #17,30~34).
- 기술: Next.js 14.2(static export), React 18, TanStack Query 5, next-intl, dayjs(tz), Tailwind 3, @kakaoent/muscat-ui, Vitest.

### live-player — AWS IVS 라이브 스트리밍 플레이어 SDK 0→1
- ★ PlayerBase 추상 클래스 위 IvsPlayer 구현 → IVS/DRM 백엔드 교체 가능한 다형 SDK.
- EventEmitter → zustand → React 단방향 상태 동기화.
- 버퍼링·송출종료·WASM 미지원·재생불가 error taxonomy 정의.
- player-sdk(코어)/player-ui(React) 2패키지 pnpm 모노레포, sideEffects:false tree-shaking.
- npm→pnpm 마이그레이션, GitHub Actions CI 안정화.
- Vitest + Storybook 검증, AAA 테스트 컨벤션. Tailwind→SCSS(BEM) 전환.

### berriz-wiki — LLM 컨텍스트 지식베이스 (단독 오너)
- ★ raw(원본) / pages(LLM 컴파일) / views(대시보드) 3계층 '사람·AI 공용' 지식베이스 설계·구축.
- Confluence 첨부 이미지 자동 인입 파이프라인(Python): ADF 본문 트리 순회 → heading 경로+순서로 한국어 kebab 파일명 자동 생성, ghost 첨부 필터링.
- 도메인×타입 taxonomy + frontmatter 스키마, evergreen note + wikilink cross-ref.
- 에이전트 운영 규약(CLAUDE.md): no-op 기본, 5종 명령, 인용 출처 강제, 보안 검수.
- matklad 스타일 크로스-레포 아키텍처 문서(온보딩용).
- Quartz 정적 사이트 퍼블리싱 + GitHub Actions → S3+CloudFront 자동 배포.
- PDF 정본 + 텍스트 추출 dual ingest, source_version backfill, hygiene 대시보드(Dataview/Bases).

### fe-music-devops — FE 배포 인프라 (GKE/Helm, Terraform IaC)
- **Terraform 도입 주도**: 필요성을 직접 제안·주장하고 도입 — CloudFront/Lambda/S3 AWS 인프라를 IaC로 전환해 재현 가능한 프로비저닝·관리 체계 확립. (※ /kakaoent에도 공개된 기여)
- fan-community Next.js develop Helm 배포(Deployment/Service/Ingress) + 멀티환경 values.
- GCE(L7) Ingress host별 라우팅, 정규식 path 분기(applink vs 일반) redirect.
- fan-link Node/Express 신규 Deployment(readiness probe, 리소스 한도, 헬스체크).
- GKE BackendConfig로 Cloud Armor WAF + 헬스체크, NEG 컨테이너 네이티브 LB.
- link→fan-link 네이밍 표준화, 이미지 태그 관리.

### fe-ui-preview — IVS 라이브 플레이어 PoC
- @kakaoent/player-sdk(IVS) 연동 프로토타입, init/destroy 라이프사이클 ↔ useEffect cleanup.
- zustand loading 구독 + 커스텀 SVG 스피너(conic-gradient/clipPath).
- dynamic import ssr:false로 hydration 회피, iOS webkit 미디어 컨트롤 숨김, 16:9.
- IvsPlayerContext로 단일 인스턴스 공유.

### artistmindmap2 — 아티스트 마인드맵 / 연예고사 퀴즈 (5일 단독 프로토)
- 삼각함수 좌표 기반 방사형 마인드맵 캔버스(~2,000줄), 드래그 팬/휠 줌/모바일 핀치 줌.
- 다단계 생성 애니메이션(상태머신), iTunes Search API 앨범아트 + 캐싱/프리페치.
- 사내 커뮤니티 인기글·샵 상품 API 연동 라이브 마인드맵.
- 난이도 4단계 '연예고사' 퀴즈 엔진, type 쿼리 + popstate 라우팅.
- Figma 익스포트(shadcn/Radix) 스캐폴드 위 커스텀 도메인 로직.

### fanz-account / fe-berriz-ai / berriz-mcp
- 실질 기여 없음(sync 머지/README init/커밋 0). 포트폴리오 제외.

---

## 2. Jira (BRZ) 테마 — 할당 100건 (ID 비공개)
타입: Sub-task 56 · Task 36 · Story 3 · Bug 5. 상태: Done 46 · Closed 38 · In Progress 9 · Backlog 6.
기간: 2026-02-25 ~ 2026-06-08 (5월 집중 50건).

- **계정 연동·인증 (~30, 최대)**: 외부 서비스 양방향 연동 UI/API, 개인정보 제공 동의, 본인인증 모듈, 아동 법정대리인 동의, 연동 서비스 관리.
- **커머스·샵·팬클럽 (~20)**: TVOD/상품 상세, 주문/클레임/부분취소·반품, 장바구니, 예약상품 CRUD, 팬클럽 카드 본인인증, 현장수령 QR.
- **웹뷰·앱 브릿지 (~10)**: 탭별 웹뷰, 스택 웹뷰(웹뷰-on-웹뷰), 앱 헤더 전환, App Bridge/setAppValues, 안드로이드 웹뷰 사이징.
- **딥링크·라우팅·i18n (~8)**: 게이트 페이지 유효성, 단축링크 locale 리다이렉트, 푸시 랜딩, applink 경로, RSC payload 경로 정규화.
- **에이전트/AI·자동화 (~12)**: CI 자동화 룰, UI 변경 티켓 자동 배포+스크린샷 PR, 하네스 엔지니어링(KB/자동배포/Eval), 오케스트레이터 E2E/evals.
- **커뮤니티/피드 (~3)**, **디자인 QA·필터링·인프라 (~17)**: 디자인 정합, Embla 캐러셀 복원, 웹 PTR 컴포넌트, 테스트 환경(qa/cbt/sandbox), 페이지뷰 로그.

---

## 3. Confluence 문서 — 작성 63건
테마: AI/LLM 워크플로(~13), 아키텍처/RFC(~7), 회의록/스프린트(~7), 주간보고(~6), 기술 스파이크(~5), 온보딩/가이드(~5), 인증/계정(~4), 스터디 노트(~4), 트러블슈팅(~3).

**대표 기술 문서 후보 (jin.2 작성, 제목 일반화):**
1. 모바일 앱 웹뷰 아키텍처 개선 제안 — 탭별 독립 웹뷰 + 스택(웹뷰-on-웹뷰) (상태 보존·bfcache·뒤로가기 UX)
2. 웹/앱 독립 개발·테스트 제어 환경 구축 (브리지 인터페이스 + 플로팅 디버그 패널)
3. 가상화 라이브러리 선정/통합 기술 비교
4. 모노레포 패키지 분리 설계
5. 딥링크 진입 아키텍처 설계
6. 안드로이드 웹뷰 블랙스크린 트러블슈팅 (백그라운드→포그라운드 절전모드 원인)

---

## 4. 공개 보정 / 민감 항목 플래그 (게시 전 검토용)

- **멜론 연동**: 사용자 결정으로 `/berriz`에 **"멜론(Melon)"** 명시. 단, 내부 통합 코드명(예: "멜티글")·Jira 에픽 ID는 비노출 유지.
- **일반화/제외 처리**: 내부 코드명("뮤직이" 등), 단계형 웹뷰 로드맵 명칭, 내부 AI 도구명, 동료 실명/닉네임, Jira ID(BRZ-xxxx) 전량 제외.
- **유지(공개/일반용어)**: Debut's Plan, link.berriz.in, TVOD, AWS IVS, fan-link/fan-commerce는 제품/도메인 표현으로 일반화하거나 공개 자료에 이미 존재.
- 회의록/주간보고 본문의 동료 실명은 포트폴리오에서 제외함.
