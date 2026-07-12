# Blog (services/blog)

개인 기술 블로그. 한국어가 기본 언어이고 영어를 표준 locale 라우팅으로 지원하는 이중 언어 블로그다. 각 언어는 자기만의 완전한 표면(홈·목록·태그·피드)을 가진다.

## Language

**원문 (Original)**:
한국어로 먼저 쓰인 글. `lang` frontmatter가 없는 글은 전부 원문(ko)으로 취급한다. 원문 파일은 이중 언어화 과정에서 수정하지 않는다.
_Avoid_: 한국어판, 소스 글

**번역 (Translation)**:
원문을 영어로 옮긴 글. `translationOf: <원문 slug>`를 frontmatter에 가지며, 자기만의 영어 slug와 URL을 가진다. 영어 표면의 목록·태그·피드에 노출된다.
_Avoid_: 영어판 페이지, locale 변형(variant)

**독립 영어 글 (Standalone English post)**:
한국어 원문 없이 영어로만 존재하는 글. `translationOf`가 없다. 영어 표면에만 노출된다.

**번역 쌍 (Translation pair)**:
원문과 번역의 1:1 관계. 번역 쪽의 `translationOf` 포인터로만 성립한다(원문은 쌍의 존재를 모른다). hreflang 상호 참조와 언어 전환기의 단위.

**Locale 표면 (Locale surface)**:
한 언어의 완전한 사이트 경험: 홈, 목록, 태그, 검색, 피드. 한국어 표면은 무프리픽스(기존 URL 그대로), 영어 표면은 `/en` 아래에 산다. 글은 자기 언어의 표면에만 나타난다.
_Avoid_: 언어 버전 사이트, 미러

**기본 언어 (Default locale)**:
한국어(ko). URL에 프리픽스가 없는 쪽이며, 어떤 언어에도 매칭되지 않는 방문자가 아닌 한국어 사용자의 기본 경험을 정의한다. 국제 검색 fallback(x-default)은 번역이 존재하는 한 영어다.

## Example dialogue

- Dev: "번역 없는 한국어 글은 /en에서 어떻게 보여?"
- Expert: "안 보인다. 글은 자기 언어의 표면에만 나타난다. /en 목록은 번역과 독립 영어 글만 담고, fallback으로 한국어를 끼워 넣지 않는다."
- Dev: "그럼 영어 글 URL은 /en/blog/한국어-slug야?"
- Expert: "아니. 번역은 자기 영어 slug를 가진다. 원문과의 연결은 URL이 아니라 translationOf 포인터가 만들고, 그 포인터가 hreflang과 언어 전환기를 구동한다."
- Dev: "한국어 글에 lang: ko를 붙여야 해?"
- Expert: "아니. lang 없음 = 원문(ko)이 규약이다. 기존 글은 건드리지 않는다."
