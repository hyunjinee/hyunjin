# Berriz CDN 아키텍처 글감 리서치 (2026-07-06)

본 문서는 미게시 개인 참고용 리서치 리포트다. 내부 레포 경로, Jira 키, PR 번호를 근거로 인용하며, 게시 시 일반화 대상은 5장에 정리했다. 추정인 항목은 모두 "추정" 또는 "미확인"으로 표기했다.

---

## 1. 아키텍처 전모

### 1.1 요청의 일생 (fan-community 기준)

브라우저가 `berriz.in`의 어떤 URL을 요청하면, 요청은 서버 프로세스를 한 번도 거치지 않고 CloudFront 계층 안에서 전부 처리된다. 흐름은 다음과 같다.

1. **CloudFront 수신**: 앱별 독립 distribution. S3는 REST 오리진 + OAC(퍼블릭 접근 전면 차단)로 연결된다.
2. **CFF (viewer-request, 10KB, cloudfront-js-2.0)**: 모든 요청이 통과하는 관문. fan-community 핸들러(`apps/fan-community/aws/cloudfront/index.ts`, 204줄)는 9단계 파이프라인으로 동작한다.
   - (1) 배포 버전 프리픽스 strip (versioned 배포 지원)
   - (2) `/index` 요청은 루트로 301
   - (3) 정적 파일(robots.txt, apple-app-site-association 등)·비-txt 에셋·사람의 `.html` 직접 요청은 그대로 통과
   - (4) 봇 UA 판별 시 `x-viewer-type` 헤더(bot/naver-bot)만 부착하고 통과 (렌더링은 뒤 단계 몫)
   - (5) 계정 관련 경로는 accounts 서브도메인으로 301
   - (6) RSC payload `.txt` 요청 정규화·리라이트
   - (7) locale 없는 페이지 요청은 쿠키/Accept-Language 기반 307 리다이렉트 (URI > NEXT_LOCALE 쿠키 > Accept-Language > en 폴백)
   - (8) 동적 경로 정규식 리라이트 (`getRewritePathLite` + 자동 생성 룰 테이블)
   - (9) fallback으로 `index.html` 부착, S3향 URI에 버전 프리픽스 재부착
   - CFF가 응답을 직접 만드는 건 리다이렉트뿐이고 나머지는 전부 `request.uri` 뮤테이션(리라이트)이다.
3. **Lambda@Edge (origin-request)**: `x-viewer-type` 헤더가 있는 봇 요청만 가로채서 OG 태그 + JSON-LD + 실제 콘텐츠(nav, FAQ 전문 등)를 포함한 완성 HTML을 200으로 직접 반환한다. 이때 S3에는 도달하지 않는다. 사람 요청은 패스스루.
4. **S3 (OAC)**: 버전 태그 프리픽스(`s3://{bucket}/{tag}/...`) 아래 쌓인 static export 산출물을 서빙. 롤백은 CFF만 이전 태그로 재배포하면 끝난다.

```
[브라우저 / 크롤러]
        |
        v
  CloudFront distribution (앱별 1개)
        |
        v  viewer-request
  +--------------------------------------------+
  | CloudFront Function (10KB 제한)             |
  |  버전 strip -> 정적파일 통과 -> 봇 헤더 마킹 |
  |  -> accounts 301 -> .txt 정규화             |
  |  -> locale 307 -> 정규식 리라이트           |
  |  -> index.html 부착 + 버전 부착             |
  +--------------------------------------------+
        |
        v  origin-request
   x-viewer-type 있음? ----yes----> Lambda@Edge: OG/JSON-LD HTML 200 직접 반환
        | no                        (fan-link는 서비스별 OG Lambda를 SDK invoke)
        v
   Lambda@Edge 패스스루 -> S3 (OAC, /{배포태그}/ 프리픽스) -> 정적 산출물 응답

[fan-link 전용 별도 트랙]
   /s/* 단축 URL -> ordered_cache_behavior -> 외부(타 클라우드) 백엔드 오리진 프록시
                     (CachingDisabled, 오리진 검증 헤더 부착)
```

### 1.2 앱별 구성 스펙트럼

같은 골격을 공유하되 복잡도가 다르다.

| 앱 | CFF | Lambda@Edge |
|---|---|---|
| fan-community | 최대형: 자동 생성 정규식 테이블(39쌍) + accounts 301 + RSC txt 정규화 + naver-bot 구분 | 1,540줄, 30+ pageType, 봇 전용 부분 SSR 수준 |
| fan-commerce | 수동 관리 URL_REGEX + 쿼리스트링 레거시 URL 호환, 봇 체크가 최우선(순서 상이) | 20여 pageType, 쇼핑 도메인 전용 |
| fan-accounts | 리라이트 테이블 없음: locale 307 + index.html + OAuth 콜백 예외 | 정적 92줄, API 호출 없음 |
| fan-berry | accounts에서 naver-bot·콜백 예외마저 뺀 최소형 | Lambda 소스 없음 (Terraform 모듈만 존재, 도입 준비 또는 잔재로 추정) |
| fan-link | 별종: plain JS, 버전 프리픽스 없음, locale strip + path 보존 SPA rewrite | OG 직접 생성 대신 서비스별 OG Lambda를 원격 invoke하는 어그리게이터 |

fan-link의 두 가지 특이점: (1) 봇 요청 시 `{phase}-{service}-redirect` 네이밍 규칙으로 같은 phase의 타 서비스 Lambda를 InvokeCommand로 호출해 OG 데이터를 받아온 뒤 hreflang 4개 로케일 + canonical + JSON-LD를 포함한 HTML을 조립한다. OG 실패 폴백은 fan-link가 아니라 각 서비스 Lambda의 `get-og-object.ts`에 있다(DEFAULT_OG + escapeHtml). (2) `/s/*` 단축 URL은 FE Lambda가 아니라 별도 백엔드 오리진(타 클라우드)으로 CloudFront가 직접 프록시한다. 크로스 클라우드 구성.

### 1.3 멀티환경과 배포

- **9개 phase** (sandbox/dev/qa/qa2/qa3/cbt/cbt2/cbt3/prod)에 런타임 분기 코드가 없다. env 파일 + esbuild define으로 빌드타임 리터럴 치환, 환경 간 연결은 Lambda 함수 네이밍 규칙 하나로 해결, Terraform은 `aws/infra/{phase}/` 디렉터리 복제.
- **배포 3트랙 분리**: 정적 산출물(s3 sync), CFF(update-function + ETag + publish-function), Lambda(update-function-code + publish-version). 트리거 방식은 앱별로 다르다: fan-link는 3종 모두 workflow_dispatch 수동 트리거, versioned 계열(fan-community 등)은 static 배포(`berriz-static-deploy-versioned.yml`)가 auto_deploy=true && phase!=prod일 때 CFF 배포를 workflow_call로 자동 체이닝한다.
- **버전드 배포**: 산출물을 S3에 태그 프리픽스로 쌓고, 배포 태그를 esbuild define으로 CFF 코드에 베이크해 CFF 교체만으로 서빙 버전을 전환. 롤백 워크플로 별도 존재.
- **Terraform과 CI의 책임 분리**: `aws_cloudfront_function`의 code, Lambda의 source_code_hash에 `lifecycle.ignore_changes`를 걸어 "인프라 골격은 Terraform, 코드 배포는 GitHub Actions"를 명문화. 콘솔 수작업으로 만들어진 기존 리소스를 import했다는 주석("import 직후 불필요한 drift 방지")이 남아 있다.

### 1.4 역사적 맥락 (일부 추정)

fan-community는 원래 GKE에서 Next.js SSR 컨테이너로 서빙됐다(fe-music-devops의 Helm+ArgoCD, 2024-12~2025-06). 2025-06 GKE 셧다운 후 static export + S3 + CloudFront 체제로 이행했고, 2025-12부터 Terraform 코드화가 시작됐다. 셧다운과 IaC 시작 사이 약 6개월의 콘솔 수작업 기간이 IaC 전환 동기였다는 인과는 커밋 시점 대조 기반 추정이다.

---

## 2. 글 각도 제안 3개

### ★ 각도 1. "10KB 라우터: Next.js static export의 동적 라우팅을 CDN 함수로 푸는 법"

- **한 줄 훅**: 서버 없이 Next.js 동적 라우팅을 서빙하려면 누군가는 URL을 다시 써줘야 한다. 그 누군가가 10KB짜리 함수라면, 라우팅 테이블을 사람이 관리할 수는 없다.
- **핵심 서사 (문제 → 결정 → 결과)**:
  - 문제: static export는 동적 라우트를 빌드 시점에 전부 열거해야 하고(공식 미지원 목록), 클라이언트 내비게이션용 RSC payload(.txt)까지 경로 규칙이 별도로 존재한다. CDN 앞단에서 URL rewrite가 필수인데, CFF는 10KB 코드 제한 아래에서 이걸 해야 한다.
  - 결정: 정규식 리라이트 테이블을 CFF에 두되, 진실의 원천을 CFF 수동 테이블에서 Next.js 파일시스템 라우팅으로 옮긴다. 룰 테이블은 3세대 진화(하드코딩 → 템플릿 기반 인라인 주입 자동화 → App Router 디렉터리 스캔 + generateStaticParams 기반 생성). 빌드마다 `build:rules`가 선행돼 앱 라우트와 CFF 룰이 강제 동기화된다.
  - 결과와 대가: 10KB 제약이 문법 수준까지 설계를 지배한다(destructuring 금지, 인덱스 접근 루프, flat 문자열 배열 인코딩, CI 사이즈 게이트, 현재 한도의 71% 사용). 정규식 테이블의 본질적 위험은 실사고로 두 번 드러났다: 정적 경로가 catch-all에 오매칭된 사례, 그리고 RSC payload 경로 불일치(`/ko.txt` vs `/ko/index.txt`)로 엉뚱한 페이로드가 반환된 운영 버그(관련 추정되는 undefined communityKey 오호출이 하루 약 20건 관측)를 진입 시 경로 정규화로 해결. 대안(TanStack Router 공존)은 스파이크 브랜치로 실구현까지 하고 기각했고, 정식 에픽까지 열었다가 "유지"로 닫았다.
- **목차 (h2)**:
  1. 왜 static export인가, 그리고 무엇을 포기하는가
  2. CDN이 라우터가 되어야 하는 이유 (Next.js 공식 문서의 nginx rewrite 예제부터)
  3. 10KB가 코드 스타일을 결정한다
  4. 라우팅 테이블의 진실의 원천 옮기기: 수동 정규식에서 파일시스템 스캔으로
  5. 운영에서 터진 두 가지: catch-all 오매칭과 RSC payload 경로 불일치
  6. 기각된 대안들: 클라이언트 라우터 공존, full SSR + CDN 캐싱
  7. 남은 트레이드오프
- **근거 매핑**: `apps/fan-community/script/generate-cloudfront-rules.ts`, `aws/cloudfront/index.ts`(9단계), `getRewritePathLite.ts`, `aws/cloudfront/README.md`(10KB 가이드), 커밋 af9af0ebd(2세대 자동화, 본인), PR #5840(3세대), PR #6436/BRZ-5416(RSC 버그, 본인), BRZ-822/PR #6661(오매칭), Confluence 4408148412(dynamic route 문서, 본인 작성), BRZ-432/433(에픽 개폐), 외부 사실 3장 1~8번.
- **예상 독자**: static export + CDN 서빙을 검토 중인 FE 엔지니어, 엣지 컴퓨팅으로 라우팅 문제를 푸는 사람.
- **★ 선정 이유**: 본인 기여(2세대 자동화 최초 도입 + RSC 버그 수정 + 의사결정 문서 작성)가 커밋·티켓·문서로 삼중 검증되는 유일한 각도이고, 외부 공식 근거(10KB 제한, static export 미지원 목록, .txt payload 이슈)와 내부 서사가 정확히 맞물린다. DeepLink UX 글과 중복이 전혀 없다.

### 각도 2. "봇에게만 서버를 내주다: static export 사이트의 부분 SSR을 Lambda@Edge로"

- **한 줄 훅**: 사람에게는 정적 파일을, 크롤러에게는 렌더링된 HTML을. 서버 프로세스 없이 CDN 계층 안에서 트래픽을 갈라친다.
- **핵심 서사**:
  - 문제: 주요 소셜/검색 크롤러는 서버가 반환한 HTML에서 태그를 읽는다(단정 대신 Google "not all bots can run JavaScript" + Meta "first 1 MB" 조합으로 서술). static export만으로는 동적 콘텐츠의 OG/SEO를 못 채운다.
  - 결정: 판별과 렌더링을 이원화. 모든 요청이 타는 viewer-request에서는 CFF가 UA 판별과 헤더 마킹만 하고, 봇 요청만 origin-request의 Lambda@Edge가 가로채 완성 HTML을 반환한다. OG 데이터 로직은 도메인당 1회만 구현하고(듀얼 모드 핸들러), 링크 도메인은 서비스별 Lambda를 원격 invoke해 재사용한다.
  - 결과: OG를 넘어 nav·FAQ 전문·ItemList/FAQPage/Article 구조화 데이터까지 포함하는 사실상 봇 전용 서버사이드 렌더러가 됐다. AI 크롤러(GPTBot, ClaudeBot, PerplexityBot 등) 명시 포함, 특정 검색엔진 봇 별도 트랙, 실패 시 다국어 기본 OG 폴백, 봇 응답은 의도적으로 no-cache.
- **목차 (h2)**: 크롤러와 JavaScript의 실제 관계 / 판별은 CFF, 렌더링은 Lambda@Edge: 단방향 역할 분담 / OG 로직은 도메인당 한 번: 듀얼 모드 핸들러와 원격 invoke / 실패해도 미리보기는 나온다: 폴백과 빌드타임 i18n 주입 / AI 크롤러 시대의 봇 목록과 AEO / 캐싱하지 않기로 한 선택
- **근거 매핑**: `apps/fan-community/aws/detect.ts`(봇 목록), `aws/lambda/index.ts`(듀얼 모드), `get-og-object.ts`(폴백 43-95행, i18n esbuild 플러그인), `apps/fan-link/aws/lambda/index.ts`(invoke 어그리게이터), Terraform cdn 모듈의 function/lambda association 페어, PR #4931(호출 구조, 본인), PR #6054/#6325(OG 다국어·locale, 본인), 외부 사실 3장 10번.
- **예상 독자**: JAMstack/정적 사이트에서 OG·SEO·AEO를 구현해야 하는 FE, 엣지 함수 역할 분담을 고민하는 사람.
- **주의**: fan-link 소재는 인프라 각도(invoke 구조, 폴백, 캐싱 정책)로만. 경로 설계·게이트 페이지·유니버설 링크는 기존 DeepLink 글 영역이므로 배제.

### 각도 3. "콘솔에서 코드로: CDN 인프라 Terraform 전환에서 import가 알려준 것"

- **한 줄 훅**: IaC의 가치는 apply가 아니라 import에서 먼저 드러났다. 콘솔 수작업이 숨겨둔 Lambda@Edge 버전 불일치.
- **핵심 서사**:
  - 문제: S3·CloudFront 생성은 "수기로 하는 법" 문서로, WAF·DNS는 사내 게시판 티켓으로 요청하는 수작업 프로세스(해당 문서의 마지막 줄이 "테라폼?" 한 단어로 끝난다).
  - 결정: fan-link 인프라 전체(cdn/cff/lambda 모듈 + 다환경)를 Terraform으로 코드화(본인, PR #6111). 코드 배포는 GitHub Actions에 남기고 Terraform은 골격만 관리하도록 ignore_changes로 책임 분리.
  - 결과: import 과정에서 CI가 Lambda를 v96까지 배포했는데 CloudFront 연결은 v94를 참조하던 drift를 발견·해소(OG 로직이 실제로 두 버전 뒤처져 서빙되고 있었다). 이후 환경 5개 증설이 티켓 1개, 1일 작업으로 끝났다. 단축 URL의 크로스 클라우드 오리진 프록시도 변수로 명시됐다.
- **목차 (h2)**: 수기 운영의 스냅샷 / 무엇을 Terraform이 관리하고 무엇을 CI가 배포하는가 / import가 드러낸 drift / 크로스 클라우드 오리진이라는 특수 케이스 / 환경 복제 비용의 변화 / 아직 코드가 아닌 것들
- **근거 매핑**: Confluence 4680876110("수기로 하는 법"), BRZ-3841(Terraform plan 해설 전문 기록, drift 일화 포함), BRZ-4748(환경 증설 1일), `apps/fan-link/aws/shared/modules/{cdn,cff,lambda}/main.tf`, PR #6111/#6358/#6373(본인).
- **예상 독자**: FE인데 인프라 운영까지 맡게 된 사람, 기존 콘솔 리소스의 IaC 전환을 검토하는 팀.
- **주의 (사실관계 리스크)**: 레포 첫 Terraform 커밋(POC, 2025-12-11)과 fan-accounts 모듈은 동료 작업이다. "도입을 제안·주도했다"는 기록은 이번 조사에서 찾지 못했다. 게시 시 "fan-link 인프라를 IaC로 설계·전환했다"로 범위를 한정해야 과장이 되지 않는다. 세 각도 중 본인 서사의 검증 강도가 가장 약하다.

---

## 3. 글에 쓸 검증된 외부 사실

전부 공식 문서 확인 완료. 인용 시 표현 주의사항 포함.

| # | 사실 | 출처 |
|---|---|---|
| 1 | CFF 하드 제약: 함수 크기 10KB(조정 불가), 메모리 2MB, 계정당 100개. 추가 데이터는 KeyValueStore 안내 | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-functions |
| 2 | CFF 런타임 제약: 요청 바디 접근 불가, 네트워크·파일시스템·환경변수·타이머·동적 코드 평가 금지. 실행 시간은 ms가 아니라 compute utilization(0~100%)으로 노출, 비교표 기준 "Submillisecond" | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-function-restrictions.html |
| 3 | CFF 이벤트 단계: viewer request/response. origin 단계는 Lambda@Edge 전용. 최신 문서에 mTLS 한정 connection request가 추가됐으므로 "2단계만"이라 단정하지 말고 각주 처리 | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html |
| 4 | CFF vs Lambda@Edge 비교표: 스케일 초당 수백만 vs 리전당 10,000 req/s, 메모리 2MB vs 128MB~10GB, 코드 10KB vs 50MB, 네트워크/파일시스템/바디 접근 No vs Yes. 주의: Lambda@Edge viewer 타임아웃을 5초로 쓰면 현행 문서(30초)와 불일치. 응답 크기 제한은 viewer 40KB / origin 1MB | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html |
| 5 | 가격: CFF $0.10/100만 호출(월 200만 무료) vs Lambda@Edge $0.60/100만 요청 + GB-초 과금(프리티어 미적용). "1/6 가격"은 요청 단가 기준임을 명시 | https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/ , https://aws.amazon.com/lambda/pricing/ |
| 6 | URL rewrite/redirect는 AWS가 명시한 CFF 대표 사용 사례. SPA/SSG용 index.html 부착 공식 예제 존재 | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-example-code.html |
| 7 | Next.js static export 미지원 목록: dynamicParams: true, generateStaticParams 없는 동적 라우트, Rewrites/Redirects/Headers, ISR, 기본 Image Optimization, Server Actions 등. 동적 라우트는 빌드 시 전부 열거 필수 | https://nextjs.org/docs/app/guides/static-exports |
| 8 | static export 산출물: 라우트당 HTML + 클라이언트 내비게이션용 static payload. 이 payload가 .txt 파일이라는 것은 공식 가이드 본문이 아닌 리포지토리 이슈로 확인(구현 세부사항으로 서술). 공식 가이드에 nginx rewrite 예제가 있어 "CDN 앞단 rewrite 필요" 논지의 공식 근거로 사용 가능 | https://nextjs.org/docs/app/guides/static-exports , https://github.com/vercel/next.js/issues/74445 , https://github.com/vercel/next.js/discussions/59394 |
| 9 | S3+CloudFront 표준 패턴: OAC 권장(전 리전, SSE-KMS, PUT/DELETE 지원), 버킷 정책은 cloudfront.amazonaws.com 프린시펄 + SourceArn 조건, REST 엔드포인트 필수(website endpoint 불가) | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html |
| 10 | 크롤러와 JS: Meta 공식 문서에 "JS 미실행" 명시 문장 없음. "OG 태그는 첫 1MB 내"(Meta 공식) + "not all bots can run JavaScript"(Google 공식) 조합으로 인용. Twitterbot의 JS 미실행 직접 인용은 공식 원문 확보 실패, 사용 금지 | https://developers.facebook.com/docs/sharing/webmasters/crawler/ , https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics |
| 11 | Lambda@Edge가 필요한 공식 기준: 수 ms 이상 소요, 서드파티 라이브러리, 네트워크·파일시스템·바디 접근. 반대로 요청 메타데이터만 보는 rewrite는 CFF 적합이 AWS 공식 가이드라인 | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-choosing.html |
| 12 | Next.js static export의 동적 경로 한계는 알려진 이슈(메인테이너 인지) | https://github.com/vercel/next.js/discussions/55393 , /discussions/64660 |

---

## 4. 글에 쓸 내부 사실·수치

### 4.1 확인된 사실 (코드/커밋/티켓 근거)

**CFF와 룰 테이블**
- fan-community CFF 9단계 파이프라인, 응답 생성은 리다이렉트만. 근거: `apps/fan-community/aws/cloudfront/index.ts`, `accounts.ts`, `util.ts`
- 룰 자동 생성: `script/generate-cloudfront-rules.ts`(417줄)가 `app/[locale]` 스캔, generateStaticParams 보유 동적 라우트만 정규식화. 현재 R 테이블 39쌍(약 40개), 정적 최상위 디렉터리 13개. 충돌 시 negative lookahead 자동 삽입, 산출물에 "수동 수정 금지" 헤더, `build:rules`가 모든 빌드에 선행. 근거: 위 스크립트, `generatedRewriteRules.ts`, `package.json`
- 룰 테이블 3세대 변천: 하드코딩(2025-07, PR #4129) → PATH_TEMPLATE 인라인 주입 자동화(2025-10-22, 커밋 af9af0ebd, **본인**, "수동 패턴 관리 제거" 커밋 메시지) → 파일시스템 스캔(2026-01-29, PR #5840, 동료). 근거: git 히스토리
- 10KB 제약의 지배: README에 lodash·destructuring·spread 금지 가이드, esbuild(es5)+terser 압축, CI가 stat으로 10,240바이트 초과 시 배포 실패. 현재 번들 7,260바이트(한도의 71%). 근거: `aws/cloudfront/README.md`, `esbuild.config.js`, `.github/workflows/berriz-cff-deploy-versioned.yml`, `dist/cloudfront/index.js`
- catch-all 오매칭 실사고: `/explore/search`가 커뮤니티 검색 패턴에 오매칭(BRZ-822, PR #6661, 2026-04-08, 동료 수정). isStaticPath 가드 확장 + 생성기 이중 방어. 근거: git 267162ae4, `getRewritePathLite.ts:16-19`
- CFF vs Lambda@Edge 선택 이유의 명시 문서는 **없음**. 역할 분담 구조(viewer-request CFF + origin-request Lambda@Edge)와, redirect 로직을 람다로 이관(2025-06, PR #3481)했다가 CFF TS 전환(2025-07, PR #4009) 후 CFF 중심으로 수렴한 변천사가 코드 근거의 전부. 수렴 이유(비용·지연)는 **추정**

**RSC payload 버그 (핵심 소재)**
- 현상: 메인홈 → 커뮤니티홈 → 새로고침 → 뒤로가기 시 페이지 깨짐. 클라이언트 라우터는 `{path}.txt`로 요청, 빌드 산출물은 `{path}/index.txt`. `/ko.txt`가 catch-all 커뮤니티 패턴(`^\/([^/]+)\/?$`)에 매칭돼 엉뚱한 커뮤니티의 RSC payload 반환
- 수치 "하루 약 20건": Jira BRZ-5416 티켓 본문에 기재(사내 모니터링 수치). 코드/커밋에는 없으므로 게시 시 출처 표현 주의
- 수정: `rewriteTxt()`에서 진입 시 `{path}.txt` → `{path}/index.txt` 정규화. 커밋 89000837c(2026-03-20, **본인**) → PR #6436(2026-03-24 머지, 11커밋: early-return 리팩토링, 정규식 모듈 스코프 이동, it.each 회귀 테스트 3케이스 포함). 근거: git, `index.ts` rewriteTxt(135-152행), `test/cloudfront.test.ts:440-447`

**의사결정 기록 (Confluence/Jira)**
- "dynamic route" 문서(pageId 4408148412, **본인 작성**, 2025-10~11): 정규식 테이블 관리 부담 명시, TanStack Router 공존을 feat/router 브랜치에 실구현 후 기각(기각 사유 4가지: empty page 필요, 전환 구간 깜빡임, CFF rewrite 여전히 필요, locale·에러처리 중복), 결론 "static export 유지"
- 같은 문서에 대안 아키텍처 회고(Next.js SSR 앞 CloudFront 캐싱, s-maxage+SWR). "25만 TPS"는 외부 자료 인용 수치이지 Berriz 실측치가 아님을 명시 필수
- CloudFront 대체가 정식 에픽으로 존재했다가 닫힘: BRZ-432(에픽, 2025-11-10 생성, 2025-12-01 Closed), BRZ-433(R&D, 3일 만에 Done). 스파이크 → 문서화 → 에픽 종결 타임라인 일치

**봇/Lambda@Edge**
- 봇 판별 목록에 AI 크롤러 다수 명시(GPTBot, ClaudeBot, PerplexityBot, Bytespider 등), 특정 검색엔진 봇 별도 viewer-type. 근거: `apps/fan-community/aws/detect.ts`, BRZ-4637/PR #7434
- fan-community Lambda는 1,540줄, 30+ pageType, nav·FAQ 전문·ItemList/FAQPage/Article 구조화 데이터까지 생성(봇 전용 부분 SSR). AEO 작업은 BRZ-6585/PR #6799
- OG 실패 폴백 확인됨: `get-og-object.ts` 43-95행, API .catch에서 DEFAULT_OG 반환, escapeHtml 적용, 팬클럽 전용 게시물 별도 안내 OG. i18n은 esbuild 플러그인이 빌드타임 주입
- 서비스 Lambda 듀얼 모드(CloudFront 이벤트 + 직접 invoke 이벤트)와 fan-link 어그리게이터 구조는 **본인** PR #4931(2025-09-25)에서 정립
- fan-link "path 보존 rewrite" 설계: 가비지 경로도 302로 루트에 보내지 않고 path 보존 rewrite(주석에 이유 명시, **본인** PR #7571 산물). 근거: `apps/fan-link/aws/redirect.js:38-67`

**배포/인프라**
- 버전드 배포 + CFF 교체 롤백 구조, 배포 태그 esbuild define 베이크. 근거: `berriz-static-deploy-versioned.yml`, `berriz-cff-deploy-versioned.yml`, `index.ts` serve()/stripVersionPrefix()
- Terraform 책임 분리(ignore_changes), 콘솔 리소스 import 흔적 주석. 근거: `apps/fan-link/aws/shared/modules/{cdn,cff,lambda}/main.tf`
- Terraform 타임라인: 첫 POC 2025-12-11(동료) → fan-accounts(동료) → **본인** fan-link IaC 전체(BRZ-3841, PR #6111, 2026-02-13, 30파일 +1,180줄) → 환경 5개 증설 1일 완료(BRZ-4748) → fan-commerce sandbox(**본인**, PR #6373)
- import 중 drift 발견 일화: CI는 Lambda v96 배포, CloudFront 연결은 v94 참조. Terraform이 qualified_arn 연결로 해소. 근거: BRZ-3841 설명 전문
- `/s/*` 크로스 클라우드 프록시(**본인** PR #6111): CachingDisabled + 오리진 검증 헤더. IP·헤더 값은 리포트에도 옮기지 않음
- Terraform 이전 프로세스 1차 사료: "수기로 하는 법" 문서(pageId 4680876110, 동료 작성, 마지막 줄 "테라폼?")
- 본인 fan-link 기여 연대기(gh PR 확인): #3645(2025-06 최초 구축) → #4931(TS 마이그레이션·invoke 구조) → #6054(OG 다국어) → #6111(Terraform IaC) → #6325(공유 URL locale) → #6436(RSC 버그) → #7571(무효 링크 처리). 약 1년 오너십
- GKE 시대: fe-music-devops(2024-12~2025-06), 본인 커밋 27개 전부 fan-link express 서버 GKE 배포·라우팅 작업. 2025-06-10 셧다운 커밋으로 종료

### 4.2 미확인/추정 (게시 시 그대로 쓰면 안 되는 것)

| 항목 | 상태 |
|---|---|
| "Terraform 도입을 본인이 제안·주도" | **미확인**. git 첫 도입자는 동료, "제안" 기록 없음. "fan-link 인프라를 IaC로 설계·전환"으로 범위 한정 필수 |
| CFF vs Lambda@Edge 수렴 이유(비용·콜드스타트·지연) | **추정**. 명시 문서 없음. AWS 공식 비교 문서로 일반화해 서술 |
| locale 리다이렉트에 307을 쓴 이유 | **추정**. 주석 없음 |
| GKE 셧다운 → 콘솔 운영 6개월 → IaC 전환 동기의 인과 | **추정**. 커밋 시점 대조 기반. 게시 전 사내 기록 교차 확인 권장 |
| fan-berry Lambda 소스 부재 이유(도입 준비 vs 잔재) | **추정** |
| DeepLink 문서의 Express 코드가 실배포였는지 논의용 의사코드였는지 | **추정**. 게시 전 본인 기억으로 확인 필요 |
| naver-bot에 locale을 ko로 강제하는 이유 | **추정** (한국어 페이지만 유의미하다는 판단으로 보임) |
| "일 약 20건"의 측정 방법·기간 | Jira 기재 수치만 확인. 모니터링 대시보드 원출처 미확인. 티켓 원문상 버그의 확정 발생 건수가 아니라 "커뮤니티 API에 undefined communityKey로 호출되는 이슈와 관련 가능성 높음"으로 기재된 연관 추정 증상 건수. 버그 발생 건수로 확정 서술 금지 |

---

## 5. 게시 전 일반화/제외 목록

**절대 제외 (보안)**
- 단축 URL 백엔드 호스트(IP 기반 reverse DNS 도메인, 환경별 IP 전부)
- 오리진 검증 커스텀 헤더의 이름과 값 (값이 사실상 shared secret. 존재 자체도 "오리진 검증 헤더" 수준으로만)
- CloudFront distribution ID, S3 버킷명(네이밍 규칙 포함)
- 커밋된 terraform.tfstate 파일 내용(리소스 ID·ARN 포함). 파일이 커밋돼 있다는 사실 언급도 비권장
- sandbox2 main.tf의 AWS 계정 ID 포함 role ARN, IAM role명
- 내부 API 호스트, internal test-token 엔드포인트(k6 관련이나 이 글 소재 아님)
- .env 파일 내용 일체

**제외 (내부 식별자)**
- Jira 키 전부(BRZ-*, MELONFE-*), PR 번호 전부, Confluence 페이지 ID·내부 링크, agit 게시판 링크
- 동료 실명·계정 전부. 동료 작업(3세대 스캐너, catch-all 수정, Terraform POC, k6, IaC drift 보정)을 본인 기여처럼 쓰지 않기
- 내부 레포명(fe-music-fan-platform, fe-music-devops, kakaoent/*), 내부 브랜치명(feat/router)
- WAF 리소스명, GCP 프로젝트명, ArgoCD 내부 호스트명, 내부 dev 도메인

**일반화 (개념만 남기고 추상화)**
- 정규식 룰 테이블 원문: 내부 라우트 구조 전체가 드러나므로 가공 예시 1~2개로 축약
- 커뮤니티 키 예시 "ive": 실제 아티스트명이므로 가상 키로 교체
- 내부 경로 구조(/signin, /auth/token 등)와 accounts 도메인 변환 규칙
- Lambda 함수 네이밍 규칙({phase}-{service}-redirect), 환경변수명(NEXT_PUBLIC_*), x-viewer-type 헤더명
- phase 목록(qa2/qa3/cbt2/cbt3 등)은 "다중 환경 N개"로 단순화
- 워크플로 파일명, 내부 에러코드(FS_CU9910), 내부 API path
- fan-commerce URL_REGEX의 내부 라우트 구조와 참조 Confluence 페이지
- 전체 라우트 맵(URL 정리 문서)은 대표 패턴 2~3개로 축약

**표현 주의**
- "일 약 20건": 사내 모니터링 수치. 규모가 작아 공개 리스크는 낮다고 판단되나 출처 표현을 "운영 모니터링에서 소량이지만 꾸준히 관측" 수준으로
- "25만 TPS": 외부 자료 인용 수치이지 실측치 아님을 명시
- Lambda@Edge viewer 타임아웃을 5초로 쓰지 않기(현행 공식 문서 30초)
- Twitterbot "JS 미실행" 공식 인용 금지. Meta 1MB 규정 + Google 공식 문장 조합으로 대체
- CFF 이벤트 "2단계만 지원" 단정 금지(mTLS connection request 각주 처리)
- 딥링크 UX(경로 설계, 유니버설 링크/커스텀 스킴 폴백, 게이트 페이지)는 기존 DeepLink 글 영역이므로 이번 글에서 서사 중복 금지. fan-link는 인프라 메커니즘(rewrite, invoke, 폴백, 캐싱 정책)만 다룰 것
