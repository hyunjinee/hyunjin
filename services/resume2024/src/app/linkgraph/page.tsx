import Image from 'next/image'

export default function LinkGraphPage() {
  return (
    <div className="bg-[#f5f5f5] relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-[600px] w-full h-full max-h-full bg-white shadow-lg p-4 md:p-6 overflow-y-auto">
        {/* LinkGraph Project */}
        <div className="mb-16">
          {/* Header Section */}
          <div className="relative mb-8">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[38px] h-[35px] bg-[#ea4a9a] rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-hero font-bold text-[#ea4a9a]">LinkGraph</h1>
            </div>

            {/* Position and Period */}
            <div className="absolute right-0 top-0 text-right">
              <p className="text-body text-black mb-1">개인 프로젝트</p>
              <p className="text-body text-black mb-2">2023.06 ~ 진행중</p>
              <div className="flex items-center justify-end gap-2">
                <span className="text-body text-black">🐙</span>
                <a
                  href="https://github.com/hyunjinee/linkgraph"
                  className="text-body text-black underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkGraph
                </a>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="mb-8">
            <h2 className="text-section font-bold text-black mb-3 underline decoration-2 underline-offset-4">
              프로젝트 개요
            </h2>
            <div className="space-y-3">
              <p className="text-body text-black leading-tight">
                LinkGraph는 유저가 자신을 소개하는 링크를 업로드하면 이를 그래프 형태로 시각화해주고 이를 공유할 수 있는
                서비스입니다.
              </p>
              <p className="text-body text-black leading-tight">
                유저는 검색을 통해 다른 사용자를 찾을 수 있고 다른 사용자가 자신을 소개하는 링크들을 확인해볼 수
                있습니다.
              </p>
            </div>
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Skills Stack */}
            <div>
              <h2 className="text-heading font-bold text-[#ea4a9a] mb-3">기술 스택</h2>
              <div className="space-y-2 mb-4">
                <p className="text-body text-black leading-tight">TypeScript, Next, Next Auth</p>
                <p className="text-body text-black leading-tight">D3, React Query, TailwindCSS</p>
                <p className="text-body text-black leading-tight">S3, CloudFront, PlanetScale, Prisma</p>
              </div>

              {/* Tech Stack Diagram */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-center">
                  <div className="text-center text-xs text-gray-500">아키텍처 다이어그램</div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h2 className="text-heading font-bold text-[#ea4a9a] mb-3">프로젝트 상세</h2>
              <ul className="space-y-2">
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  yarn workspace 기반의 모노레포 환경 구축
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  D3를 사용해 유저와 링크를 연결하는 ForceGraph 구현
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  S3에 PresignedURL 방식으로 사진 업로드 구현
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">CloudFront를 사용하여 이미지 캐싱</li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  Next Auth를 사용해 소셜 로그인 구현(세션)
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  Next의 렌더링 패턴을 페이지에 알맞게 적절히 적용(SSR, ISR)
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  <a
                    href="https://www.youtube.com/watch?v=wxxNS6hEptE"
                    className="underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    서버 사이드 렌더링을 통해 UX를 개선한 경험 유튜브 업로드
                  </a>
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  Prisma를 ORM으로 사용하여 스키마, 쿼리 작성
                </li>
              </ul>
            </div>
          </div>

          {/* Project Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                아키텍처 다이어그램
              </div>
            </div>
            <div className="aspect-[16/10] bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-white text-sm">ForceGraph 예시</div>
            </div>
          </div>
        </div>

        {/* 투두투두 Project */}
        <div className="border-t pt-12">
          {/* Header Section */}
          <div className="relative mb-8">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[54px] h-[47px] bg-[#61dafb] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">⚛</span>
              </div>
              <h1 className="text-hero font-bold text-[#61dafb]">투두투두</h1>
            </div>

            {/* Position and Period */}
            <div className="absolute right-0 top-0 text-right">
              <p className="text-body text-black mb-2">2022.03 ~ 2022.05</p>
              <a
                href="https://github.com/hyunjinee/todo"
                className="text-body text-black underline cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
              >
                Github
              </a>
            </div>
          </div>

          {/* Project Overview */}
          <div className="mb-8">
            <h2 className="text-section font-bold text-black mb-3 underline decoration-2 underline-offset-4">
              프로젝트 개요
            </h2>
            <div className="space-y-3">
              <p className="text-body text-black leading-tight">
                투두앱을 다양한 상태 관리 라이브러리를 사용하여 개발해보았습니다.
              </p>
              <p className="text-body text-black leading-tight">
                Lighthouse를 사용해 각각의 상태 관리 방법의 성능을 측정해보았고, 1만개의 투두를 렌더링했을 때 렌더링
                성능을 개선해보기 위해 고민해보았습니다.
              </p>
            </div>
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Skills Stack */}
            <div>
              <h2 className="text-heading font-bold text-[#61dafb] mb-3">기술 스택</h2>
              <div className="space-y-2">
                <p className="text-body text-black leading-tight">
                  React, TypeScript, Redux, RTK, Recoil, Zustand, Context API
                </p>
                <p className="text-body text-black leading-tight">lighthouse, Cypress, Sass</p>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h2 className="text-heading font-bold text-[#61dafb] mb-3">프로젝트 상세</h2>
              <ul className="space-y-2">
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  <a
                    href="https://github.com/hyunjinee/todo/tree/master/react_usestate#%EA%B2%B0%EA%B3%BC"
                    className="underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    React.memo를 사용한 최적화를 통해 1만개의 리스트를 렌더링하는 실험에서 약 30배의 성능 개선
                  </a>
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  <a
                    href="https://github.com/hyunjinee/todo#result"
                    className="underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    크롬의 lighthouse를 사용하여 모바일 환경과 웹 환경 테스트
                  </a>
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  <a
                    href="https://github.com/hyunjinee/todo#-cypress%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-e2e-%ED%85%8C%EC%8A%A4%ED%8A%B8"
                    className="underline cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cypress를 사용해 E2E 테스트
                  </a>
                </li>
                <li className="text-body text-black leading-tight ms-4 list-disc">
                  모바일, PC를 고려한 반응형 UI 및 다크모드 구현
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile App Screenshots */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex-none w-[110px] h-[238px] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  투두 앱 화면 {i}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
