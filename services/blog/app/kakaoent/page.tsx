import Image from 'next/image'

export default function KakaoentPage() {
  return (
    <div>
      <div className="mx-auto max-w-[700px]">
        {/* Header Section */}
        <div className="relative mb-6">
          {/* Logos */}
          <div className="flex gap-3 items-center mb-4">
            <Image
              src="/images/kakaoentertainment/kakaoent.svg"
              alt="카카오엔터테인먼트 로고"
              width={160}
              height={32}
              className="h-[32px] w-auto dark:invert"
            />
            <Image
              src="/images/kakaoentertainment/berriz_logo.svg"
              alt="Berriz 로고"
              width={80}
              height={28}
              className="h-[28px] w-auto"
            />
          </div>

          {/* Position and Period */}
          <div className="absolute top-0 right-0 text-right">
            <p className="mb-1 text-[13px] text-black dark:text-gray-200">Frontend Engineer</p>
            <p className="text-[13px] text-black dark:text-gray-200">2024.07 ~ 현재</p>
          </div>
        </div>

        {/* Project 1: Berriz */}
        <div className="mb-8">
          <h2 className="mb-3 text-[15px] font-bold text-kakaoent">
            Berriz — Global Fan Platform Service
          </h2>
          <p className="mb-2 text-[13px] text-gray-500 dark:text-gray-400">
            Community, Shop, Accounts, DeepLink, Live Player, Agents
          </p>
          <ul className="space-y-2 text-[14px]">
            <li className="leading-[20px] text-black dark:text-gray-200">
              - 제로 베이스에서 100만 유저 달성까지의 초기 구축에 기여
            </li>
            <li className="leading-[20px] text-black dark:text-gray-200">
              - Universal Links, App Links, Custom Schemes를 활용한 딥링크 시스템(link.berriz.in) 설계 및 구현. Fallback 처리와 SEO 지원을 통해 웹-모바일 앱 간 원활한 내비게이션 제공
            </li>
            <li className="leading-[20px] text-black dark:text-gray-200">
              - Webview와 Native 컴포넌트 간 인터페이스 처리를 통한 UX 개선
            </li>
            <li className="leading-[20px] text-black dark:text-gray-200">
              - Terraform을 활용해 CloudFront, Lambda, S3 기반의 AWS 인프라 프로비저닝 및 관리
            </li>
            <li className="leading-[20px] text-black dark:text-gray-200">
              - 커밋/PR 처리, 문서 요약, 태스크 생성 등 반복 워크플로우를 자동화하는 Berriz Agent 개발
            </li>
          </ul>
        </div>

        {/* Project 2: Debut's Plan */}
        <div className="mb-8">
          <h2 className="mb-3 text-[15px] font-bold text-kakaoent">
            Debut&apos;s Plan — Real-Time Voting Service
          </h2>
          <ul className="space-y-2 text-[14px]">
            <li className="leading-[20px] text-black dark:text-gray-200">
              - 글로벌 동기화 투표 시스템 구축 및 운영. 타임존 간 정확한 상태 관리와 실시간 업데이트 보장
            </li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="mb-6">
          <h2 className="mb-2 text-[15px] font-bold text-kakaoent">기술 스택</h2>
          <div className="space-y-1">
            <p className="text-[14px] leading-[20px] text-black dark:text-gray-200">
              TypeScript, React, Next.js
            </p>
            <p className="text-[14px] leading-[20px] text-black dark:text-gray-200">TailwindCSS, Emotion</p>
            <p className="text-[14px] leading-[20px] text-black dark:text-gray-200">TanStack Query, Zustand</p>
            <p className="text-[14px] leading-[20px] text-black dark:text-gray-200">Terraform, AWS (CloudFront, Lambda, S3)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
