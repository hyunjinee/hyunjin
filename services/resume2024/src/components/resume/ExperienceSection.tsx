import ExperienceItem from './ExperienceItem'

const experiences = [
  {
    title: '토스뱅크',
    link: 'https://hyunjinee.notion.site/0d01b8a2b1ac4249a09a946885140870',
    period: '2023.09 ~ 2024.04',
    role: 'FullStack Developer',
    squad: 'Housing Loan Squad',
    logo: '/toss.png',
    tags: ['TypeScript', 'React', 'Next.js', 'Kotlin', 'Spring', 'zod'],
    achievements: [
      {
        text:
          'LUMOS(Loan Universal Management Operating System), 전월세 대출의 심사와 운영을 위한 서비스를 주도적으로 개발(TypeScript, React, Next, Kotlin, Spring)',
      },
      {
        text:
          '전세대출의 갈아타기, 새로받기, 주기별점검등 다양한 대출 및 심사와 운영 서비스를 개발하여 타 은행 대비 압도적으로 적은 인원으로 대출 심사가 진행될 수 있었으며, 인건비 절약 및 전월세 대출의 성장에 기여',
      },
      {
        text:
          '전월세 대출 운영에서 발생하는 CS 건수를 하루 평균 6~12건에서 0~2건으로 줄여 안정적으로 심사할 수 있는 환경 구축',
      },
      {
        text:
          '비동기적인 전월세대출 심사 프로세스를 개선하기 위하여 자체 알림 서비스를 구축하여 심사 업무 시간 단축(권리 조사 업무를 처리하는데 걸리는 시간을 평균 60분에서 30분으로 단축)',
      },
      {
        text: 'API 응답시간이 느린 곳이나 유저에게 즉각적인 피드백이 필요한 곳에 Optimistic Update 적용',
        link:
          'https://velog.io/@hyunjine/%EB%82%99%EA%B4%80%EC%A0%81-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%88%9C%EC%84%9C%EC%A0%9C%EC%96%B4',
      },
      {
        text:
          '다양한 요구사항과 수정사항을 애플리케이션에 빠르게 적용하기위하여 패키지 관리자를 yarn berry로 마이그레이션하고zero install 환경을 구축해여 서비스의 총 CI/CD 시간을 56%단축',
      },
      {
        text: '사용자의 입력이나 애플리케이션 외부에서 들어오는 값들을 런타임에 검증하기 위해 zod를 적극적으로 활용',
      },
    ],
  },
  {
    title: 'SI Analytics',
    link: 'https://www.notion.so/hyunjinee/SIA-FE-f6fc37047c3c4db79ce6ec551688d598?pvs=4',
    period: '2023.03 ~ 2023.06',
    role: 'Frondend Developer',
    squad: '산학 협력 인턴',
    logo: '/sia.webp',
    tags: ['React', 'TypeScript', 'Sass', 'OpenLayers', 'Vite'],
    achievements: [
      {
        text:
          '인공지능을 기반으로 위성/항공 영상을 분석하는 서비스인 Ovision과 Ovision Admin을 개발(React, TypeScript, Sass)',
      },
      {
        text:
          '애플리케이션에 도입할 상태 관리 라이브러리 비교, CRA와 Vite 비교, yarn berry와 관련된 내용을 사내에서 발표',
      },
      {
        text: 'OpenLayers 기반의 지도 위에서 사용자의 다양한 상호작용 및 지도에서 장소 검색어 추천 기능 구현',
      },
    ],
  },
  {
    title: '엘리스',
    link: 'https://hyunjin.oopy.io/7b78d8a5-636d-436c-86f9-0dd5382f9d43',
    period: '2022.10',
    role: 'SW 트랙 3기 실습 코치',
    logo: '/elice.webp',
    achievements: [
      {
        text: '엘리스 SW 트랙 3기에서 실습코치로 JavaScript, TypeScript를 강의',
        link: 'https://velog.io/@hyunjine/Asynchronous-JavaScript',
      },
      {
        text: '수강생 72명을 대상으로 한 강의 평가에서 (4.49 / 5)의 평점',
      },
    ],
  },
  {
    title: '소프트웨어 마에스트로 13기',
    link: 'https://hyunjin.oopy.io/fab659af-6b24-4fad-b64e-cbc05d937957',
    period: '2022.04 ~ 2022.12',
    logo: '/swm.png',
    tags: ['PWA', 'Next.js', 'Node.js', 'MySQL', 'Service Worker', 'IndexedDB'],
    achievements: [
      {
        text: '오프라인에서도 사용할 수 있는 할 일 관리 앱인 MOZI 서비스를 개발(PWA, Next.js, Node.js, MySQL)',
        link: 'https://hyunjin.oopy.io/0d63da0a-89fb-42ce-a486-f4f09501f6a8',
      },
      {
        text:
          '브라우저의 Cache API와 Service Worker를 사용해서 리소스의 성격에 따른 적절한 캐싱 전략을 적용하여 웹을 오프라인에서 동작시켰고, IndexedDB와 백그라운드 동기화 API를 사용하여 오프라인 환경에서 작업한 내용이 온라인 환경으로 전환될 때 서버에 동기화되도록 구현',
      },
      {
        text: '4번의 컨퍼런스에서 발표를 했으며, 13기를 빛낸 13인의 연수생으로 선정',
      },
      {
        text: '컨퍼런스 발표',
        isTitle: true,
      },
      {
        text: 'Rendering Patterns',
        link: 'https://velog.io/@hyunjine/Rendering-Patterns',
      },
      {
        text: 'Thinking in React',
        link: 'https://velog.io/@hyunjine/Thinking-in-React',
      },
      {
        text: 'GraphQL',
        link: 'https://velog.io/@hyunjine/GraphQL',
      },
      {
        text: '웹은 어떻게 발전했는가',
        link:
          'https://velog.io/@hyunjine/%EC%9B%B9%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%B0%9C%EC%A0%84%ED%96%88%EB%8A%94%EA%B0%80',
      },
    ],
  },
  {
    title: '방슐랭 가이드',
    link: 'https://hyunjin.oopy.io/b08771a5-af10-40bf-990d-30fae0440525',
    period: '2021.07 ~ 2022.08',
    role: '창업 동아리',
    logo: '/bclguide.png',
    tags: ['React Native', 'Node.js', 'MongoDB', 'AWS', 'Redis'],
    achievements: [
      {
        text:
          '기존 부동산 플랫폼의 허위 매물, 과장 광고와 같은 문제를 해결하기 위해 시작된 1인 가구 중심의 부동산 플랫폼의 클라이언트, 서버를 개발하여 배포(React Native, WebView, Node.js, MongoDB, AWS)',
      },
      {
        text:
          '대학교 근처를 중심으로 서비스하여 1500명 이상의 유저를 달성했으며, 앱을 통해 98건의 직거래, 936만원의 매출, 예비 창업 패키지를 통해 4000만원의 투자를 유치',
      },
      {
        text: 'Naver SENS API와 Redis를 사용하여 회원가입시에 핸드폰 인증 기능 구현',
        link: 'https://hyunjinee.tistory.com/57',
      },
    ],
  },
]
export default function ExperienceSection() {
  return (
    <section className="mb-4 md:mb-6">
      <h2 className="font-bold text-[18px] mb-3 md:mb-4 leading-tight">경험</h2>
      <div className="space-y-4 md:space-y-5">
        {experiences.map((exp, index) => (
          <ExperienceItem
            key={index}
            title={exp.title}
            link={exp.link}
            period={exp.period}
            role={exp.role}
            squad={exp.squad}
            achievements={exp.achievements}
            logo={exp.logo}
            tags={exp.tags}
          />
        ))}
      </div>
    </section>
  )
}
