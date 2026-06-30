# `/kakaoent` 재직 허브 페이지 고도화

작성일: 2026-06-19

## 목표

`/kakaoent` 페이지를 카카오엔터테인먼트 재직 전체를 조망하는 **"재직 허브(관문)"** 페이지로 재구성한다.
깊은 내용은 `/berriz`·블로그·발표 페이지로 위임하고, 허브에서는 **개요 + 임팩트 + 진입점**만 제공한다.

## 배경 / 현재 상태

- `app/kakaoent/page.tsx`: 이전에 만든 간단한 이력 요약본. `max-w-[700px]` 고정 레이아웃, 인라인 텍스트, Berriz/Debut's Plan/기술스택을 직접 나열 → `/berriz`와 내용 중복, 깊이 얕음.
- `app/berriz/page.tsx`: 최근 제작된 충실한 딥다이브 페이지. 메트릭 4칸 그리드, 9개 기여 영역, 기술 스택 뱃지. **이 페이지의 디자인 시스템을 재사용한다.**
- `app/page.tsx`: 홈의 `experiences` 카드에서 `/kakaoent`로 링크 (`link: '/kakaoent'`). 이 진입 경로는 유지.
- agent-browser OSS 기여는 **홈에만** 둔다 (허브에 포함하지 않음). 허브는 Berriz 중심.

## 핵심 차별점 (vs /berriz)

`/berriz`는 **주제별**(계정·인증, 딥링크, 라이브 …) 딥다이브. 허브는 **프로젝트·시간순 조망** + 회사 레벨 메트릭 + 진입점. 출처: `berriz-research.md`(포트폴리오 원본, 미게시)의 레포별 기여 표.

## 페이지 구조

`/berriz`의 레이아웃 컨벤션을 따른다: `<div className="container md:mt-5">`, `text-primary-500`, 카드/뱃지 패턴, `genPageMetadata`.

### 1. Hero
- 카카오엔터 로고 (`/images/kakaoentertainment/kakaoent.svg`, `dark:invert`) + 구분점 + `Frontend Engineer · 2024.07 ~ 현재`
- 재직 전체를 요약하는 2~3문장: Berriz 제품 전반 주도(메인 플랫폼 + 0→1 도메인 다수) + AI 개발 자동화 + 인프라(IaC).
- 하단 인라인 링크: `berriz.in ↗`, `Berriz 주제별 상세 → /berriz`
- 기존 `absolute` 포지셔닝 + `max-w-[700px]` 제거, `/berriz` Hero와 동일한 `<header className="pb-8 mb-10 border-b ...">` 구조.

### 2. 임팩트 메트릭 (4칸 그리드)
회사 레벨 지표. `/berriz`의 카드 마크업 재사용:
- `100만+` 유저 — 제로 베이스 → 글로벌 출시
- `3,566+` 커밋 · 680 PR — 메인 FE 단일 레포 기준
- `7+` 서비스 / 레포 — 플랫폼·파트너센터·오디션·라이브·위키·DevOps
- `~22개월` — 2024.07 ~ 현재 · 진행 중

### 3. 프로젝트 타임라인 (허브 메인 콘텐츠)
레포/프로젝트별 카드 (제목 + 역할 + 기간 + 한 줄 임팩트 + 기여 규모 뱃지). 시간/규모순:
- **Berriz 메인 플랫폼** — 제품 전반 주도(계정·인증, 팬클럽, 커머스, 딥링크, 웹뷰 브릿지, 오디션 투표, i18n) · 2024.08~ · 3,566 커밋·680 PR · `자세히 → /berriz`
- **Live Player (AWS IVS SDK)** — 다형 SDK 0→1 설계, PlayerBase 추상화·캐스팅 연동 · 2024.07~09 · 121 커밋·10 PR
- **파트너센터 (예약·TVOD·행사)** — 0→1 도메인 구축, 4단계 멀티스텝 퍼널·CRUD API · 2026.02~05 · 239 커밋·27 PR
- **오디션 'Debut's Plan'** — 글로벌 실시간 투표, 타임존 버그 재설계·18개 TZ 테스트 · 2025.01~04 · 164 커밋·28 PR
- **berriz-wiki (LLM 지식베이스)** — raw/pages/views 3계층 KB 단독 설계·구축, Confluence 자동 인입 파이프라인 · 2026.04~05 · 71 커밋
- **FE DevOps (Terraform IaC)** — Terraform 도입 주도, CloudFront/Lambda/S3 IaC 전환·Helm 배포 · 2024.12~25.04 · 27 커밋

(게시 보정: 내부 코드명·Jira ID·동료 실명·내부 AI 도구명 제외. 멜론/Debut's Plan/link.berriz.in/TVOD/AWS IVS는 공개 가능.)

### 4. 관련 글 · 발표
카카오 시기 산출물 링크 목록 (제목 + 한 줄 + 날짜):
- `/blog/DeepLink` — 딥링크 시스템 설계 (2025-06-09)
- `/blog/SSR은 선택이 아니다` — AI 크롤러 시대 렌더링 전략 (2026-04-20)
- `/talks/llm-growing` — 발표 "LLM 키우기", Kakao Entertainment FE Chapter (2025-02-20)

### 5. 기술 스택 (고레벨 요약)
풀 리스트는 `/berriz`로 위임. 허브에는 핵심 키워드 뱃지 + 전체 보기 링크:
- `TypeScript · React · Next.js · TanStack · next-intl · AWS (IVS·Lambda·CloudFront) · Terraform · GKE·Helm · Vitest · GitHub Actions` + `전체 스택 → /berriz`

## 데이터 모델

별도 데이터 파일 신설 없이 `page.tsx` 내부 상수 배열로 정의 (`/berriz`와 동일 패턴: `metrics`, `projects`, `writings`, `techStack`).
링크 경로는 기존 라우트(`/berriz`, `/blog/DeepLink`, `/blog/SSR은 선택이 아니다`, `/talks/llm-growing`)를 그대로 사용 — 신규 라우트 없음.

## 범위 밖 (Out of scope)
- `/berriz` 페이지 수정
- 홈(`app/page.tsx`) 수정 (기존 `/kakaoent` 링크 유지)
- agent-browser OSS 섹션 추가
- 신규 블로그 글 작성 (별도 세션)

## 검증
- `pnpm -F @hyunjin/blog build` 또는 `tsc --noEmit` 통과
- 다크모드 확인 (로고 `dark:invert`, primary 컬러)
- 모바일/데스크탑 반응형 (메트릭 `grid-cols-2 md:grid-cols-4`)
- 모든 내부 링크 유효성 (`/berriz`, `/blog/DeepLink`, `/talks`)
