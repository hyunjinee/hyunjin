import Image from 'next/image'

export default function MoziPage() {
  return (
    <div className="bg-[#f5f5f5] relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-[600px] w-full h-full max-h-full bg-white shadow-lg p-4 md:p-6 overflow-y-auto">
        {/* Header Section */}
        <div className="relative mb-8">
          {/* Logo and Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-[44px] h-[37px] bg-[#5d52d0] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h1 className="text-[28px] font-bold text-[#5d52d0]">MOZI</h1>
          </div>

          {/* Position and Period */}
          <div className="absolute right-0 top-0 text-right">
            <p className="text-[10px] text-black mb-1">소프트웨어 마에스트로</p>
            <p className="text-[10px] text-black mb-2">2022.06 ~ 2022.11</p>
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-[10px] text-black">🐙</span>
              <a
                href="https://github.com/team-yaza/mozi-client"
                className="text-[10px] text-black underline cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                Client
              </a>
              <a
                href="https://github.com/team-yaza/mozi-server"
                className="text-[10px] text-black underline cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                Server
              </a>
            </div>
            <a
              href="https://mozi.vercel.app/blog"
              className="text-[10px] text-black underline cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </a>
          </div>
        </div>

        {/* Project Overview */}
        <div className="mb-8">
          <h2 className="text-[12px] font-bold text-black mb-3 underline decoration-2 underline-offset-4">
            프로젝트 개요
          </h2>
          <div className="space-y-3">
            <p className="text-[10px] text-black leading-[14px]">
              MOZI는 할 일을 잊지 않기 위한 시간 / 장소 기반 TODO 서비스입니다.
            </p>
            <p className="text-[10px] text-black leading-[14px]">
              사용자는 할 일을 등록할 때 언제 어디서 할 것인지를 등록하고 정해진 시간이 다가오거나 지정한 장소에
              근접해지면 알림을 보내줌으로써 사용자가 할 일을 잊지 않도록 도와줍니다.
            </p>
            <p className="text-[10px] text-black leading-[14px]">
              PWA를 적용하여 다양한 기기 및 온라인과 오프라인 환경을 모두 고려하였고, 백그라운드 동기화, 웹 푸시,
              Geolocation, IndexedDB등의 브라우저 API를 적극 활용했습니다.
            </p>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Skills Stack */}
          <div>
            <h2 className="text-[15px] font-bold text-[#5d52d0] mb-3">기술 스택</h2>
            <div className="space-y-2 mb-4">
              <p className="text-[10px] text-black leading-[14px]">TypeScript, Next, React Query, PWA</p>
              <p className="text-[10px] text-black leading-[14px]">Node, Docker, Nginx, MySQL, Sequelize, Sentry</p>
              <p className="text-[10px] text-black leading-[14px]">Git, Figma, Jira, Notion</p>
            </div>

            {/* Tech Stack Diagram */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="text-center text-xs text-gray-500">기술 아키텍처 다이어그램</div>
              </div>
            </div>
          </div>

          {/* Project Contributions */}
          <div>
            <h2 className="text-[15px] font-bold text-[#5d52d0] mb-3">프로젝트 기여</h2>
            <ul className="space-y-2">
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://velog.io/@hyunjine/PWA%EC%97%90-%EB%8C%80%ED%95%9C-%EC%83%9D%EA%B0%81"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PWA
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://github.com/team-yaza/mozi-client/wiki/Workbox"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Workbox를
                </a>{' '}
                사용해{' '}
                <a
                  href="https://mozi.vercel.app/blog/service-worker"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ServiceWorker 제어
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://mozi.vercel.app/blog/background-sync"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Background Sync API를 이용해 오프라인 동기화 구현
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://github.com/team-yaza/mozi-client/wiki/Service-Worker-Caching-Strategy"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cache API와 적절한 캐싱 전략을 사용해 응답 캐싱
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://mozi.vercel.app/blog/background-sync#indexeddb%EC%97%90-%EC%95%A1%EC%85%98-%ED%81%90-%EB%A7%8C%EB%93%A4%EA%B8%B0"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IndexedDB를 사용해 API 요청 큐 구현
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://velog.io/@hyunjine/Thinking-in-React"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React
                </a>
                ,{' '}
                <a
                  href="https://velog.io/@hyunjine/Rendering-Patterns"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Next
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://hyunjinlee.com/react-rendering-optimization/"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  렌더링 최적화 방식에 대한 실험 및 적용
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://github.com/team-yaza/mozi-client/blob/develop/src/hooks/apis/todo/useTodoListQuery.ts#L11-L39"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  React Query를 전역 상태 관리자 처럼 사용해 데이터 관리
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://velog.io/@hyunjine/Server-State-Client-State"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IndexedDB를 사용해 온오프라인 동일한 로직으로 처리
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://mozi.vercel.app/blog/mozi-calendar"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  앱 내에서 사용되는 캘린더 구현
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://github.com/team-yaza/mozi-client/blob/develop/src/components/common/TodoListItem/Map/index.tsx#L23-L34"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Geolocation API를 이용해 사용자의 위치 트래킹
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://mozi.vercel.app/docs/Map"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Naver Map에서 유저와 다양한 인터랙션 구현
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://github.com/team-yaza/mozi-client/blob/develop/src/hooks/useOnClickOutside/index.test.ts#L6-L60"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jest, React Testing Library 사용하여 테스트 코드 작성
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://velog.io/@hyunjine/useState-vs-useRef"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  useState와 useRef를 활용한 상태 관리 방법에 대하여 팀원과 토론한 후 블로그에 작성
                </a>
              </li>
            </ul>

            {/* Backend Section */}
            <div className="mt-4">
              <p className="text-[10px] text-black leading-[14px] mb-2">Node, Express</p>
              <ul className="space-y-2">
                <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                  <a
                    href="https://mozi.vercel.app/blog/Sentry%EB%A1%9C-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B5%AC%EC%B6%95%ED%95%98%EA%B8%B0"
                    className="underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sentry를 이용해 클라이언트 및 서버 모니터링 시스템 구축
                  </a>
                </li>
                <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                  <a
                    href="https://github.com/team-yaza/mozi-client/tree/develop/.github/workflows"
                    className="underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Github Action
                  </a>
                  , AWS CodeDeploy, Vercel을 사용해 CI / CD 파이프라인 구성
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Screenshots */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">데스크톱 {i}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile App Screenshots */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-[110px] h-[220px] bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">앱 화면 {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
