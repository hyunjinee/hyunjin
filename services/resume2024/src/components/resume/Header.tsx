'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import PhotoViewer from '../PhotoViewer'

export default function Header() {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  return (
    <header className="mb-4 md:mb-6">
      {/* 프로필 영역 */}
      <div className="flex flex-col gap-4 mb-3 md:flex-row md:mb-4">
        {/* 프로필 이미지 */}
        <div
          className="relative h-[160px] w-[106px] rounded-[8px] overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity mx-auto md:mx-0"
          onClick={() => setIsViewerOpen(true)}
        >
          <Image
            alt="이현진 프로필"
            className="rounded-[8px] object-cover"
            src="/profile.png"
            fill
            priority
            quality={100}
          />
        </div>

        {/* 이름, 정보, 소개 */}
        <div className="flex flex-col flex-1 gap-2">
          {/* 이름 */}
          <h1 className="font-bold leading-normal text-center text-title md:text-left">이현진 Lee Hyun Jin</h1>

          {/* 링크들 */}
          <div className="flex flex-wrap gap-3 justify-center leading-tight text-body md:justify-start">
            <Link href="https://github.com/hyunjinee" target="_blank" rel="noopener noreferrer" className="underline">
              Github
            </Link>
            <Link href="https://velog.io/@hyunjine" target="_blank" rel="noopener noreferrer" className="underline">
              Blog1
            </Link>
            <Link href="https://hyunjin.oopy.io" target="_blank" rel="noopener noreferrer" className="underline">
              Blog2
            </Link>
            <Link
              href="https://www.linkedin.com/in/leehj0110/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              LinkedIn
            </Link>
          </div>

          {/* 이메일 */}
          <div className="leading-tight text-center text-gray-600 break-all text-body md:text-left">
            leehj0110@kakao.com
          </div>

          {/* 소개 */}
          <div className="space-y-2 leading-tight text-body">
            <p>웹 페이지 위에 내 생각을 표현할 수 있다는 것에 매력을 느껴서 프론트엔드 개발을 좋아하게 되었습니다.</p>

            <p>
              서비스를 만들어가는 과정에서 동료와 토론하고 배운 내용을 공유하는 것을 즐깁니다. 또한 하드스킬과
              소프트스킬을 기르는데 있어서 꾸준함을 가지고 있고 새로운 도전을 통해 성장하고자 노력합니다.
            </p>

            <p>
              프론트엔드 분야에서 내 생각을 말할 수 있는 엔지니어가 되자는 목표를 가지고 있고, 저를 아래와 같은
              엔지니어라고 생각합니다.
            </p>

            <ul className="space-y-0.5">
              <li className="list-disc ms-[15px]">
                <span className="leading-tight">
                  빠른 실행력과 커뮤니케이션 스킬을 바탕으로 유저에게 제품을 빠르고 안정적으로 제공할 수 있는 엔지니어
                </span>
              </li>
              <li className="list-disc ms-[15px]">
                <span className="leading-tight">
                  주도적으로 업무를 파악하고 발생한 문제를 깊게 파고들어 명확하게 해결하고, 이 과정에서 스스로 학습하는
                  엔지니어
                </span>
              </li>
              <li className="list-disc ms-[15px]">
                <span className="leading-tight">
                  프로젝트에서 협업의 중요성을 이해하고 적극적으로 커뮤니케이션하는 엔지니어
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 포토 뷰어 */}
      {isViewerOpen && <PhotoViewer src="/profile.png" alt="이현진 프로필" onClose={() => setIsViewerOpen(false)} />}
    </header>
  )
}
