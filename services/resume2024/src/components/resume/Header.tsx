import Image from 'next/image'

export default function Header() {
  return (
    <header className="mb-4 md:mb-6">
      {/* 프로필 영역 */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-4 mb-3 md:mb-4">
        {/* 프로필 이미지 */}
        <div className="relative h-[130px] w-[86px] rounded-[8px] overflow-hidden flex-shrink-0">
          <Image alt="이현진 프로필" className="rounded-[8px] object-cover" src="/profile.png" fill priority />
        </div>

        {/* 이름과 정보 */}
        <div className="flex-1 flex flex-col justify-between md:pt-0.5">
          {/* 이름과 링크 */}
          <div>
            <h1 className="font-bold text-[20px] leading-[1.2] mb-1.5 md:mb-1">이현진 Lee Hyun Jin</h1>
            <div className="flex flex-wrap gap-2 md:gap-2.5 text-[10px] leading-[14px]">
              <a href="https://github.com/hyunjinee" target="_blank" rel="noopener noreferrer" className="underline">
                Github
              </a>
              <a href="https://velog.io/@hyunjine" target="_blank" rel="noopener noreferrer" className="underline">
                Blog1
              </a>
              <a href="https://hyunjin.oopy.io" target="_blank" rel="noopener noreferrer" className="underline">
                Blog2
              </a>
              <a
                href="https://www.linkedin.com/in/leehj0110/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* 연락처 이미지 (데스크탑만) */}
          <div className="hidden md:block mt-auto">
            <Image alt="연락처" src="/contact.svg" width={98} height={10} />
          </div>
        </div>
      </div>

      {/* 소개 */}
      <div className="space-y-2 md:space-y-2 text-[10px] leading-[14px]">
        <p>웹 페이지 위에 내 생각을 표현할 수 있다는 것에 매력을 느껴서 프론트엔드 개발을 좋아하게 되었습니다.</p>

        <p>
          서비스를 만들어가는 과정에서 동료와 토론하고 배운 내용을 공유하는 것을 즐깁니다. 또한 하드스킬과 소프트스킬을
          기르는데 있어서 꾸준함을 가지고 있고 새로운 도전을 통해 성장하고자 노력합니다.
        </p>

        <p>
          프론트엔드 분야에서 내 생각을 말할 수 있는 엔지니어가 되자는 목표를 가지고 있고, 저를 아래와 같은 엔지니어라고
          생각합니다.
        </p>

        <ul className="space-y-0.5 md:space-y-0">
          <li className="list-disc ms-[15px]">
            <span className="leading-[14px]">
              빠른 실행력과 커뮤니케이션 스킬을 바탕으로 유저에게 제품을 빠르고 안정적으로 제공할 수 있는 엔지니어
            </span>
          </li>
          <li className="list-disc ms-[15px]">
            <span className="leading-[14px]">
              주도적으로 업무를 파악하고 발생한 문제를 깊게 파고들어 명확하게 해결하고, 이 과정에서 스스로 학습하는
              엔지니어
            </span>
          </li>
          <li className="list-disc ms-[15px]">
            <span className="leading-[14px]">
              프로젝트에서 협업의 중요성을 이해하고 적극적으로 커뮤니케이션하는 엔지니어
            </span>
          </li>
        </ul>
      </div>
    </header>
  )
}
