import Image from 'next/image'

export default function TossbankPage() {
  return (
    <div className="bg-[#f5f5f5] relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-[600px] w-full h-full max-h-full bg-white shadow-lg p-4 md:p-6 overflow-y-auto">
        {/* Header Section */}
        <div className="relative mb-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-[50px] h-[50px] bg-[#1b45f5] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <h1 className="text-[30px] font-bold text-[#1b45f5]">LUMOS</h1>
          </div>

          {/* Position and Period */}
          <div className="absolute right-0 top-0 text-right">
            <p className="text-[10px] text-black mb-1">FullStack Developer</p>
            <p className="text-[10px] text-black">2023.09 ~ 2024.04</p>
          </div>
        </div>

        {/* Project Overview */}
        <div className="mb-8">
          <h2 className="text-[12px] font-bold text-black mb-3 underline decoration-2 underline-offset-4">
            프로젝트 개요
          </h2>
          <div className="space-y-3">
            <p className="text-[10px] text-black leading-[14px]">
              Housing Loan Squad 에서 전월세 대출의 심사와 운영을 위한 서비스인 LUMOS를 주도적으로 개발했습니다.
            </p>
            <p className="text-[10px] text-black leading-[14px]">
              전세 대출의 갈아타기, 새로받기, 주기별점검, 목적물 시세확인, 세움터 주소 검색, 지킴보증 보증료우대,
              허위임대인관리등의 서비스를 개발하였고 심사와 운영 환경을 개선하는데 필요한 모든 feature에 기여했습니다.
            </p>
            <p className="text-[10px] text-black leading-[14px]">
              LUMOS를 통해 타 은행 대비 압도적으로 적은 인원(26명)으로 전세 대출 심사를 진행할 수 있었으며, 인건비 절약
              및 전월세 대출 성장에 기여했습니다.
            </p>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Skills Stack */}
          <div>
            <h2 className="text-[15px] font-bold text-[#1b45f5] mb-3">기술 스택</h2>
            <div className="space-y-2">
              <p className="text-[10px] text-black leading-[14px]">React, Next, TypeScript, TDS</p>
              <p className="text-[10px] text-black leading-[14px]">zod, React Query, React Hook Form</p>
              <p className="text-[10px] text-black leading-[14px]">Kotlin, Spring, MySQL, MongoDB</p>
            </div>
          </div>

          {/* Project Contributions */}
          <div>
            <h2 className="text-[15px] font-bold text-[#1b45f5] mb-3">프로젝트 기여</h2>
            <ul className="space-y-2">
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://hyunjin.oopy.io/0d01b8a2-b1ac-4249-a09a-946885140870"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  위클리에서 프로젝트의 개선점 및 나아가야할 방향을 정리하여 공유
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://hyunjin.oopy.io/0d01b8a2-b1ac-4249-a09a-946885140870"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  전세 대출 운영에서 발생하는 LUMOS 관련 CS건수를 하루 평균 6~12개에서 0~3개로 줄여 안정적인 전세대출
                  운영에 기여
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                <a
                  href="https://velog.io/@hyunjine/%EB%82%99%EA%B4%80%EC%A0%81-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%88%9C%EC%84%9C%EC%A0%9C%EC%96%B4"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API 응답시간이 느린 곳이나 유저에게 즉각적인 피드백이 필요한 곳에 Optimistic Update를 사용하여 UX 개선
                </a>
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                API 호출 결과나, 사용자 입력과 같이 외부에서 들어온 값들의 유효성을 런타임에 검증하기 위해 zod를 적극
                활용
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                yarn berry 마이그레이션과 Dockerfile 캐싱레이어를 분리하여 서비스 총 CI/CD 시간을 단축(9분 → 4분)
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                Phantom Dependency 제거, 패키지 install 시간 단축
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                LUMOS 자체의 알림 서비스를 구축하여 비동기적인 전세대출 서류 검토 프로세스 시간을 단축
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                담당자가 권리조사 업무를 처리하는데 걸리는 시간 감소: 평균 60분 → 30분(50% 감소)
              </li>
              <li className="text-[10px] text-black leading-[14px] ms-4 list-disc">
                페이지에서 network waterfall이 발생하는 현상을 찾아, 쿼리들을 병렬 실행시켜 waterfall 제거
              </li>
            </ul>
          </div>
        </div>

        {/* Timeline Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-1 bg-[#f2f4f6] rounded-full">
            <span className="text-[8px] text-black">2018.03 ~ 2023.08</span>
          </div>
        </div>

        {/* Project Images */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                프로젝트 이미지 1
              </div>
            </div>
            <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                프로젝트 이미지 2
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                프로젝트 이미지 3
              </div>
            </div>
            <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                프로젝트 이미지 4
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
