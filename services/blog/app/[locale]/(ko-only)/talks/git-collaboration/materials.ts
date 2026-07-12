export type Material = {
  id: string
  notionPageId: string
  title: string
  description: string
  notionUrl: string
}

export const materials: Material[] = [
  {
    id: '1',
    notionPageId: 'fd8cb76dbad04aa3875d92fd2e577e81',
    title: 'Git을 활용한 협업 (1)',
    description: 'VCS 개념, Git과 GitHub의 차이, 원격·로컬 저장소, 개발 환경 세팅(Homebrew)',
    notionUrl: 'https://hyunjinee.notion.site/Git-1-fd8cb76dbad04aa3875d92fd2e577e81',
  },
  {
    id: '2',
    notionPageId: '2f661351c2a043c398d666706c263c40',
    title: 'Git을 활용한 협업 (2)',
    description: '저장소 만들기, commit·log·checkout, 원격 저장소 push/pull, Git의 동작과 파일 상태',
    notionUrl: 'https://hyunjinee.notion.site/Git-2-2f661351c2a043c398d666706c263c40',
  },
  {
    id: '3',
    notionPageId: '00ba3dc398b74076a6e6e0b87d7a6691',
    title: 'Git을 활용한 협업 (3)',
    description: '브랜치의 개념과 정체 — 커밋 포인터로서의 브랜치, 생성과 이동',
    notionUrl: 'https://hyunjinee.notion.site/Git-3-00ba3dc398b74076a6e6e0b87d7a6691',
  },
  {
    id: '4',
    notionPageId: 'd7f403f439174b7faddc42aeb1d2ba3c',
    title: 'Git을 활용한 협업 (4)',
    description: '머지(Merge)와 충돌(Conflict) 해결 — 이슈 기반 브랜치 워크플로우',
    notionUrl: 'https://hyunjinee.notion.site/Git-4-d7f403f439174b7faddc42aeb1d2ba3c',
  },
  {
    id: '5',
    notionPageId: 'e51a5fcd1ce149468cdfd0a35286b9ee',
    title: 'Git을 활용한 협업 (5)',
    description: 'Pull Request 실습, 좋은 커밋 메시지와 Conventional Commit, Semantic Versioning, Git Flow',
    notionUrl: 'https://hyunjinee.notion.site/Git-5-e51a5fcd1ce149468cdfd0a35286b9ee',
  },
  {
    id: 'commands',
    notionPageId: 'ce601af4c1f64bb39fe7378b6d88f9aa',
    title: 'Git 자주 사용하는 명령어 정리',
    description: '환경 설정부터 기본 셸 명령어, Git 명령어 치트시트',
    notionUrl: 'https://hyunjinee.notion.site/Git-ce601af4c1f64bb39fe7378b6d88f9aa',
  },
]
