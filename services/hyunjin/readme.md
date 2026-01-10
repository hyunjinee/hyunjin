# Hyunjin AI

터미널에서 사용하는 AI 코딩 에이전트입니다.

## 설치

```bash
npm install -g hyunjin-ai
# or
pnpm add -g hyunjin-ai
```

## 설정

### API 키 설정

환경변수 사용:
```bash
export OPENAI_API_KEY="your-key"
# or
export ANTHROPIC_API_KEY="your-key"
```

또는 CLI로 설정:
```bash
hyunjin config --set-key openai
hyunjin config --set-key anthropic
```

## 사용법

### 단일 프롬프트 실행

```bash
hyunjin "이 프로젝트의 구조를 설명해줘"
hyunjin run "src/index.ts 파일을 읽고 분석해줘"
```

### 대화형 모드

```bash
hyunjin chat
```

### 모델 선택

```bash
hyunjin -m openai/gpt-4o "코드 리뷰해줘"
hyunjin -m anthropic/claude-3-5-sonnet-latest "버그를 찾아줘"
```

## 지원 모델

### OpenAI
- gpt-4o (기본)
- gpt-4o-mini
- gpt-4-turbo
- o1, o1-mini, o1-preview

### Anthropic
- claude-3-5-sonnet-latest (기본)
- claude-3-5-haiku-latest
- claude-3-opus-latest

## 도구 (Tools)

Hyunjin은 다음 도구들을 사용할 수 있습니다:

- **read_file**: 파일 읽기
- **write_file**: 파일 쓰기
- **edit_file**: 파일 수정
- **bash**: 쉘 명령 실행
- **glob**: 파일 패턴 검색
- **grep**: 텍스트 패턴 검색
- **list_directory**: 디렉토리 탐색

## 개발

```bash
# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm dev

# 빌드
pnpm build

# 타입 체크
pnpm typecheck
```

## 라이선스

MIT
