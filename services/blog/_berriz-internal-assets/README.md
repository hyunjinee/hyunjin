# assets/

임베드 이미지 등 미디어 파일. 두 영역으로 운영.

## 1. `assets/<slug>/` — ingest 산출물 (자동)

Confluence raw ingest 시 `scripts/confluence-attachments.py <pageId> <slug>` 가 자동으로 첨부 이미지를 받아 page 별 슬러그 디렉토리에 보존한다.

- **이미지 (`image/*`) 만 다운로드** — 비디오 / 기타 binary 는 git 부담으로 제외.
- 파일명은 Confluence 원본 그대로 (`image-20250609-003603.png`, `스크린샷 2026-03-17 ....png` 등).
- 일반적으로 사용자가 손대지 않음. raw 본문의 blob URL 위치와 1:1 매핑은 응답에 직접 노출되지 않아 fragile — page 작성 시 *흐름 추정* 으로 필요한 이미지 골라 본문 임베드.
- 사용: `![[<slug>/file.png]]`.

ingest 자동화 흐름은 `AGENTS.md §4-3 Confluence attachment 처리` 참고.

## 2. `assets/` 루트 — 사용자 도식 (수동)

사용자가 page 본문에 임베드하기로 결정한 시각 자료.

### 명명 규칙

- **basename uniqueness** — vault 전체에서 unique. `![[name.png]]` 가 basename 으로 resolve.
- **kebab-case + 의미 있는 이름** — Obsidian 기본명 (`Pasted image YYYYMMDDHHMMSS.png`) 은 embed 전 반드시 rename.
- 좋은 예: `berriz-deeplink-3-tier-fallback.png`, `melon-twoway-flow.svg`.
- 나쁜 예: `image1.png`, `screenshot.png`, `Pasted image 20250506100000.png`.

### Promotion (1 → 2 영역)

raw 자료 안의 이미지가 page 본문에서 반복 인용되면 사용자가 명시적으로 promote — `assets/<slug>/<original>.png` → `assets/<concept>.png` 로 rename·복사. 자동화 X (*asset purchase order* 의 PNG = 마지막 수단 원칙과 일관).

### Excalidraw / 다른 매체

- 개념 다이어그램 → `pages/<concept>.excalidraw.md`, frontmatter `type: diagram`.
- PDF / slide export 등 *원본 자료* 는 `assets/` 가 아니라 `raw/` 에 둔다 (immutable input).

## Asset purchase order

콘텐츠 표현은 markdown text → ASCII → mermaid → Excalidraw → PNG 순으로 가벼운 매체부터.
PNG 는 마지막 수단 — 외부 콘텐츠 캡처 / 자체 생성이 어려운 도식에만.
자세한 룰은 `CLAUDE.md` 의 *Asset Purchase Order* 절 참고.
