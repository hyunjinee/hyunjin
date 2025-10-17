import Image from 'next/image'

export default function Resume() {
  return (
    <div className="bg-[#f5f5f5] relative w-full min-h-screen flex items-center justify-center py-8 px-4 md:p-8 print:p-0 print:bg-white">
      <div className="max-w-[210mm] w-full relative min-h-[297mm] bg-white shadow-lg print:shadow-none p-4 md:p-[1.5rem]">
        {/* 모바일 헤더 */}
        <div className="md:hidden flex flex-col gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative h-[130px] w-[86px] rounded-[8px] overflow-hidden flex-shrink-0">
              <Image alt="이현진 프로필" className="rounded-[8px] object-cover" src="/profile.png" fill priority />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-[20px] mb-1">이현진 Lee Hyun Jin</h1>
              <div className="flex flex-wrap gap-2 text-[10px]">
                <a href="https://velog.io/@hyunjine" target="_blank" rel="noopener noreferrer" className="underline">
                  Blog1
                </a>
                <a href="https://hyunjin.oopy.io" target="_blank" rel="noopener noreferrer" className="underline">
                  Blog2
                </a>
                <a href="https://github.com/hyunjinee" target="_blank" rel="noopener noreferrer" className="underline">
                  Github
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
              <p className="text-[10px] mt-2 leading-[14px]">
                웹 페이지 위에 내 생각을 표현할 수 있다는 것에 매력을 느껴서 프론트엔드 개발을 좋아하게 되었습니다.
              </p>
            </div>
          </div>
          <p className="text-[10px] leading-[14px]">
            서비스를 만들어가는 과정에서 동료와 토론하고 배운 내용을 공유하는 것을 즐깁니다. 또한 하드스킬과
            소프트스킬을 기르는데 있어서 꾸준함을 가지고 있고 새로운 도전을 통해 성장하고자 노력합니다.
          </p>
          <p className="text-[10px] leading-[14px]">
            프론트엔드 분야에서 내 생각을 말할 수 있는 엔지니어가 되자는 목표를 가지고 있고, 저를 아래와 같은
            엔지니어라고 생각합니다.
          </p>
          <ul className="text-[10px] space-y-1">
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

        {/* 데스크탑 헤더 (absolute positioning) */}
        <div className="hidden md:block">
          {/* 프로필 이미지 */}
          <div className="absolute h-[130px] left-[7px] rounded-[8px] top-[17px] w-[86px]">
            <Image alt="이현진 프로필" className="rounded-[8px] object-cover" src="/profile.png" fill priority />
          </div>

          {/* 이름 (한글) */}
          <p className="absolute font-bold h-[16px] leading-[14px] left-[97px] text-[20px] text-black top-[19px] w-[54px]">
            이현진
          </p>

          {/* 이름 (영문) */}
          <p className="absolute font-bold h-[16px] leading-[14px] left-[153px] text-[20px] text-black top-[19px] w-[123px]">
            Lee Hyun Jin
          </p>

          {/* 연락처 정보 */}
          <div className="absolute h-[9.88px] left-[492px] top-[25px] w-[98.18px]">
            <Image alt="연락처" src="/contact.svg" width={98} height={10} />
          </div>

          {/* 링크들 */}
          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[319px] text-[10px] text-black top-[22px] w-[27px] underline cursor-pointer"
            href="https://velog.io/@hyunjine"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">Blog1</p>
          </a>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[349px] text-[10px] text-black top-[22px] w-[27px] underline cursor-pointer"
            href="https://hyunjin.oopy.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">Blog2</p>
          </a>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[283px] text-[10px] text-black top-[22px] w-[33px] underline cursor-pointer"
            href="https://github.com/hyunjinee"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">Github</p>
          </a>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[379px] text-[10px] text-black top-[22px] w-[38px] underline cursor-pointer"
            href="https://www.linkedin.com/in/leehj0110/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">LinkedIn</p>
          </a>

          {/* 소개 */}
          <div className="absolute font-normal h-[14px] leading-[14px] left-[98px] text-[10px] text-black top-[42px] w-[404px]">
            <p>웹 페이지 위에 내 생각을 표현할 수 있다는 것에 매력을 느껴서 프론트엔드 개발을 좋아하게 되었습니다.</p>
          </div>

          <div className="absolute font-normal h-[27px] leading-[14px] left-[98px] text-[10px] text-black top-[56px] w-[493px]">
            <p>
              서비스를 만들어가는 과정에서 동료와 토론하고 배운 내용을 공유하는 것을 즐깁니다. 또한 하드스킬과
              소프트스킬을 기르는데 있어서 꾸준함을 가지고 있고 새로운 도전을 통해 성장하고자 노력합니다.
            </p>
          </div>

          <p className="absolute font-normal leading-[14px] left-[97px] text-[10px] text-black top-[90px] w-[524px]">
            프론트엔드 분야에서 내 생각을 말할 수 있는 엔지니어가 되자는 목표를 가지고 있고, 저를 아래와 같은
            엔지니어라고 생각합니다.
          </p>

          {/* 엔지니어 특징 리스트 */}
          <ul className="absolute block font-normal leading-[0] left-[93px] text-[10px] text-black top-[106px] w-[501px]">
            <li className="list-disc ms-[15px] mb-0">
              <span className="leading-[14px]">
                빠른 실행력과 커뮤니케이션 스킬을 바탕으로 유저에게 제품을 빠르고 안정적으로 제공할 수 있는 엔지니어
              </span>
            </li>
            <li className="list-disc ms-[15px] mb-0">
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

          {/* 경험 섹션 */}
          <p className="absolute font-bold h-[16px] leading-[14px] left-[7px] text-[15px] text-black top-[152px] w-[29px]">
            경험
          </p>

          {/* 토스뱅크 */}
          <a
            className="absolute block font-bold h-[17px] leading-[0] left-[9px] text-[13px] text-black top-[181px] w-[45px] underline cursor-pointer"
            href="https://hyunjinee.notion.site/0d01b8a2b1ac4249a09a946885140870"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">토스뱅크</p>
          </a>

          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[198px] w-[79px]">
            2023.09 ~ 2024.04
          </p>
          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[210px] w-[80px]">
            FullStack Developer
          </p>
          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[221px] w-[80px]">
            Housing Loan Squad
          </p>

          {/* 토스뱅크 업무 내용 */}
          <div className="absolute font-normal leading-[0] left-[95px] text-[10px] text-black top-[179px] w-[487px]">
            <ul className="mb-0">
              <li className="list-disc ms-[15px]">
                <span className="leading-[14px]">
                  LUMOS(Loan Universal Management Operating System), 전월세 대출의 심사와 운영을 위한 서비스를
                  주도적으로 개발(TypeScript, React, Next, Kotlin, Spring)
                </span>
              </li>
            </ul>
          </div>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[210px] w-[491px]">
            <li className="leading-[14px] ms-[15px]">
              전세대출의 갈아타기, 새로받기, 주기별점검등 다양한 대출 및 심사와 운영 서비스를 개발하여 타 은행 대비{' '}
              <span className="font-normal">압도적으로 적은 인원으로 대출 심사가 진행</span>될 수 있었으며, 인건비 절약
              및 전월세 대출의 성장에 기여
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[241px] w-[490px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                전월세 대출 운영에서 발생하는 CS 건수를 하루 평균 6~12건에서 0~2건으로 줄여 안정적으로 심사할 수 있는
                환경 구축
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[258px] w-[471px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                비동기적인 전월세대출 심사 프로세스를 개선하기 위하여 자체 알림 서비스를 구축하여 심사 업무 시간
                단축(권리 조사 업무를 처리하는데 걸리는 시간을 평균 60분에서 30분으로 단축)
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[287px] w-[490px]">
            <li className="leading-[14px] ms-[15px]">
              <a
                className="underline cursor-pointer"
                href="https://velog.io/@hyunjine/%EB%82%99%EA%B4%80%EC%A0%81-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%88%9C%EC%84%9C%EC%A0%9C%EC%96%B4"
                target="_blank"
                rel="noopener noreferrer"
              >
                API 응답시간이 느린 곳이나 유저에게 즉각적인 피드백이 필요한 곳에 Optimistic Update 적용
              </a>{' '}
              및 여러 페이지에서 발생하는 API 요청의 network waterfall을 찾아 쿼리들을 병렬 실행시켜 waterfall 제거
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[316px] w-[487px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                다양한 요구사항과 수정사항을 애플리케이션에 빠르게 적용하기위하여 패키지 관리자를 yarn berry로
                마이그레이션하고zero install 환경을 구축해여 서비스의 총 CI/CD 시간을 56%단축
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[345px] w-[490px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                사용자의 입력이나 애플리케이션 외부에서 들어오는 값들을 런타임에 검증하기 위해 zod를 적극적으로 활용
              </span>
            </li>
          </ul>

          {/* SI Analytics */}
          <a
            className="absolute block font-bold h-[13px] leading-[0] left-[9px] text-[13px] text-black top-[370px] w-[109px] underline cursor-pointer"
            href="https://www.notion.so/hyunjinee/SIA-FE-f6fc37047c3c4db79ce6ec551688d598?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">SI Analytics</p>
          </a>

          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[387px] w-[72px]">
            2023.03 ~ 2023.06
          </p>
          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[398px] w-[89px]">
            Frondend Developer
          </p>
          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[408px] w-[89px]">
            산학 협력 인턴
          </p>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[371px] w-[490px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                인공지능을 기반으로 위성/항공 영상을 분석하는 서비스인 Ovision과 Ovision Admin을 개발(React, TypeScript,
                Sass)
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[96px] text-[10px] text-black top-[386px] w-[490px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                애플리케이션에 도입할 상태 관리 라이브러리 비교, CRA와 Vite 비교, yarn berry와 관련된 내용을 사내에서
                발표
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[96px] text-[10px] text-black top-[401px] w-[490px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                OpenLayers 기반의 지도 위에서 사용자의 다양한 상호작용 및 지도에서 장소 검색어 추천 기능 구현
              </span>
            </li>
          </ul>

          {/* 엘리스 */}
          <a
            className="absolute block font-bold h-[13px] leading-[0] left-[9px] text-[13px] text-black top-[430px] w-[34px] underline cursor-pointer"
            href="https://hyunjin.oopy.io/7b78d8a5-636d-436c-86f9-0dd5382f9d43"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">엘리스</p>
          </a>

          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[446px] w-[29px]">
            2022.10
          </p>
          <p className="absolute font-normal h-[13px] leading-[14px] left-[9px] text-[8px] text-black top-[455px] w-[88px]">
            SW 트랙 3기 실습 코치
          </p>

          <ul className="absolute block font-normal leading-[0] left-[95px] text-[10px] text-black top-[432px] w-[362px]">
            <li className="leading-[14px] mb-0 ms-[15px]">
              엘리스 SW 트랙 3기에서 실습코치로{' '}
              <a
                className="underline cursor-pointer"
                href="https://velog.io/@hyunjine/Asynchronous-JavaScript"
                target="_blank"
                rel="noopener noreferrer"
              >
                JavaScript, TypeScript를 강의
              </a>
            </li>
            <li className="ms-[15px]">
              <span className="leading-[14px]">수강생 72명을 대상으로 한 강의 평가에서 (4.49 / 5)의 평점</span>
            </li>
          </ul>

          {/* MOZI 프로젝트 */}
          <ul className="absolute block font-normal leading-[0] left-[92px] text-[10px] text-black top-[474px] w-[494px]">
            <li className="leading-[14px] ms-[15px]">
              오프라인에서도 사용할 수 있는 할 일 관리 앱인{' '}
              <a
                className="underline cursor-pointer"
                href="https://hyunjin.oopy.io/0d63da0a-89fb-42ce-a486-f4f09501f6a8"
                target="_blank"
                rel="noopener noreferrer"
              >
                MOZI
              </a>{' '}
              서비스를 개발(PWA, Next.js, Node.js, MySQL)
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[93px] text-[10px] text-black top-[487px] w-[496px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                브라우저의 Cache API와 Service Worker를 사용해서 리소스의 성격에 따른 적절한 캐싱 전략을 적용하여 웹을
                오프라인에서 동작시켰고, IndexedDB와 백그라운드 동기화 API를 사용하여 오프라인 환경에서 작업한 내용이
                온라인 환경으로 전환될 때 서버에 동기화되도록 구현
              </span>
            </li>
          </ul>

          {/* 소프트웨어 마에스트로 */}
          <a
            className="absolute block font-bold leading-[0] left-[7px] text-[13px] text-black top-[476px] w-[61px] underline cursor-pointer"
            href="https://hyunjin.oopy.io/fab659af-6b24-4fad-b64e-cbc05d937957"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">
              소프트웨어
              <br />
              마에스트로
            </p>
          </a>

          <p className="absolute font-normal h-[13px] leading-[14px] left-[7px] text-[8px] text-black top-[506px] w-[83px]">
            2022.04 ~ 2022.12
          </p>
          <p className="absolute font-normal h-[13px] leading-[14px] left-[7px] text-[8px] text-black top-[515px] w-[19px]">
            13기
          </p>

          <div className="absolute h-[7.48px] left-[608px] top-[506px] w-[83.836px]">
            <Image alt="기간" src="/date2.svg" width={84} height={8} />
          </div>

          <ul className="absolute block font-normal leading-[0] left-[93px] text-[10px] text-black top-[530px] w-[342px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                4번의 컨퍼런스에서 발표를 했으며, 13기를 빛낸 13인의 연수생으로 선정
              </span>
            </li>
          </ul>

          <p className="absolute font-bold h-[13px] leading-[14px] left-[110px] text-[10px] text-black top-[546px] w-[71px]">
            컨퍼런스 발표
          </p>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[166px] text-[10px] text-black top-[545px] w-[123px] underline cursor-pointer"
            href="https://velog.io/@hyunjine/Rendering-Patterns"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul>
              <li className="list-disc ms-[15px]">
                <span className="leading-[14px]">Rendering Patterns</span>
              </li>
            </ul>
          </a>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[265px] text-[10px] text-black top-[545px] w-[97px] underline cursor-pointer"
            href="https://velog.io/@hyunjine/Thinking-in-React"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul>
              <li className="list-disc ms-[15px]">
                <span className="leading-[14px]">Thinking in React</span>
              </li>
            </ul>
          </a>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[356px] text-[10px] text-black top-[545px] w-[86px] underline cursor-pointer"
            href="https://velog.io/@hyunjine/GraphQL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul>
              <li className="list-disc ms-[15px]">
                <span className="leading-[14px]">GraphQL</span>
              </li>
            </ul>
          </a>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[410px] text-[10px] text-black top-[545px] w-[118px] underline cursor-pointer"
            href="https://velog.io/@hyunjine/%EC%9B%B9%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%B0%9C%EC%A0%84%ED%96%88%EB%8A%94%EA%B0%80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul>
              <li className="list-disc ms-[15px]">
                <span className="leading-[14px]">웹은 어떻게 발전했는가</span>
              </li>
            </ul>
          </a>

          {/* 방슐랭 가이드 */}
          <a
            className="absolute block font-bold h-[16px] leading-[0] left-[7px] text-[13px] text-black top-[572px] w-[95px] underline cursor-pointer"
            href="https://hyunjin.oopy.io/b08771a5-af10-40bf-990d-30fae0440525"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="leading-[14px]">방슐랭 가이드</p>
          </a>

          <p className="absolute font-normal h-[13px] leading-[14px] left-[7px] text-[8px] text-black top-[588px] w-[89px]">
            2021.07 ~ 2022.08
          </p>
          <p className="absolute font-normal h-[13px] leading-[14px] left-[7px] text-[8px] text-black top-[598px] w-[38px]">
            창업 동아리
          </p>

          <div className="absolute h-[7.62px] left-[608px] top-[538px] w-[83.172px]">
            <Image alt="기간" src="/date1.svg" width={83} height={8} />
          </div>

          <ul className="absolute block font-normal leading-[0] left-[93px] text-[10px] text-black top-[567px] w-[473px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                기존 부동산 플랫폼의 허위 매물, 과장 광고와 같은 문제를 해결하기 위해 시작된 1인 가구 중심의 부동산
                플랫폼의 클라이언트, 서버를 개발하여 배포(React Native, WebView, Node.js, MongoDB, AWS)
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal leading-[0] left-[93px] text-[10px] text-black top-[596px] w-[466px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                대학교 근처를 중심으로 서비스하여 1500명 이상의 유저를 달성했으며, 앱을 통해 98건의 직거래, 936만원의
                매출, 예비 창업 패키지를 통해 4000만원의 투자를 유치
              </span>
            </li>
          </ul>

          <a
            className="absolute block font-normal h-[13px] leading-[0] left-[93px] text-[10px] text-black top-[624px] w-[473px] underline cursor-pointer"
            href="https://hyunjinee.tistory.com/57"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul>
              <li className="list-disc ms-[15px]">
                <span className="leading-[14px]">
                  Naver SENS API와 Redis를 사용하여 회원가입시에 핸드폰 인증 기능 구현
                </span>
              </li>
            </ul>
          </a>

          {/* 기술 섹션 */}
          <p className="absolute font-bold h-[16px] leading-[14px] left-[9px] text-[15px] text-black top-[640px] w-[29px]">
            기술
          </p>

          <ul className="absolute block font-normal h-[13px] leading-[0] left-[9px] text-[10px] text-black top-[661px] w-[602px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                모던 프론트엔드 기술 스택을 빠르게 습득하여 적용할 수 있는 유연함과 변하지 않는 부분을 깊이 있게
                공부하는 단단함을 가지고 있습니다.
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal h-[15px] leading-[0] left-[9px] text-[10px] text-black top-[677px] w-[428px]">
            <li className="leading-[14px] ms-[15px]">
              <a
                className="underline cursor-pointer"
                href="https://velog.io/@hyunjine/%EC%9B%B9-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%EC%97%90%EC%84%9C-%EC%83%81%ED%83%9C%EB%9E%80"
                target="_blank"
                rel="noopener noreferrer"
              >
                프론트엔드에서 상태 관리에 대해 이해
              </a>
              하며 적절한{' '}
              <a
                className="underline cursor-pointer"
                href="https://velog.io/@hyunjine/Flux"
                target="_blank"
                rel="noopener noreferrer"
              >
                패턴
              </a>{' '}
              적용 및 적절한 라이브러리를 선택할 수 있습니다.
            </li>
          </ul>

          <ul className="absolute block font-normal h-[15px] leading-[0] left-[9px] text-[10px] text-black top-[693px] w-[487px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                브라우저의 구조와 특성을 이해하며, Core Web Vitals를 고려하여 프로젝트에 적절한 렌더링 패턴을 적용할 수
                있습니다.
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal h-[15px] leading-[0] left-[9px] text-[10px] text-black top-[709px] w-[361px]">
            <li className="leading-[14px] ms-[15px]">
              <a
                className="underline cursor-pointer"
                href="https://velog.io/@hyunjine/Thinking-in-React"
                target="_blank"
                rel="noopener noreferrer"
              >
                React
              </a>
              , Next.js 생태계에 관심이 많고 더 나은 개발 방법에 대해 끊임없이 고민합니다.
            </li>
          </ul>

          <ul className="absolute block font-normal h-[15px] leading-[0] left-[9px] text-[10px] text-black top-[725px] w-[397px]">
            <li className="leading-[14px] ms-[15px]">
              프론트엔드와 백엔드의 대화를 더 효율적으로 만드는 방법들에 관심이 많습니다.(BFF,{' '}
              <a
                className="underline cursor-pointer"
                href="https://velog.io/@hyunjine/GraphQL"
                target="_blank"
                rel="noopener noreferrer"
              >
                GraphQL
              </a>
              )
            </li>
          </ul>

          <ul className="absolute block font-normal h-[15px] leading-[0] left-[9px] text-[10px] text-black top-[740px] w-[579px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                Node.js, Nest.js를 사용하여 서버를 구축하고, AWS(EC2, S3, CloudFront, Route53) 서비스들을 사용하여
                애플리케이션을 배포 및 운영해본 경험이 있습니다.
              </span>
            </li>
          </ul>

          <ul className="absolute block font-normal h-[15px] leading-[0] left-[9px] text-[10px] text-black top-[767px] w-[470px]">
            <li className="ms-[15px]">
              <span className="leading-[14px]">
                Github Action, CodeDeploy등을 사용하여 CI / CD 환경을 구축하여 코드의 안정성 및 신뢰성을 높일 수
                있습니다.
              </span>
            </li>
          </ul>

          <a
            className="absolute block font-normal h-[16px] leading-[0] left-[9px] text-[10px] text-black top-[782px] w-[367px] underline cursor-pointer"
            href="https://www.youtube.com/watch?v=VadEWpLVnGU"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ul>
              <li className="list-disc ms-[15px]">
                <span className="leading-[14px]">
                  Git과 같은 분산 버전 관리 시스템을 활용하여 동료와 유연하게 협업할 수 있습니다.
                </span>
              </li>
            </ul>
          </a>
        </div>

        {/* 모바일 컨텐츠 */}
        <div className="md:hidden space-y-6">
          {/* 경험 섹션 */}
          <section>
            <h2 className="font-bold text-[15px] mb-3 border-b pb-1">경험</h2>

            {/* 토스뱅크 */}
            <div className="mb-4">
              <a
                href="https://hyunjinee.notion.site/0d01b8a2b1ac4249a09a946885140870"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[13px] underline"
              >
                토스뱅크
              </a>
              <p className="text-[8px] text-gray-600">2023.09 ~ 2024.04 | FullStack Developer | Housing Loan Squad</p>
              <ul className="text-[10px] space-y-1 mt-2">
                <li className="list-disc ms-[15px]">
                  <span className="leading-[14px]">
                    LUMOS(Loan Universal Management Operating System), 전월세 대출의 심사와 운영을 위한 서비스를
                    주도적으로 개발(TypeScript, React, Next, Kotlin, Spring)
                  </span>
                </li>
                <li className="leading-[14px] ms-[15px]">
                  전세대출의 갈아타기, 새로받기, 주기별점검등 다양한 대출 및 심사와 운영 서비스를 개발하여 타 은행 대비
                  압도적으로 적은 인원으로 대출 심사가 진행될 수 있었으며, 인건비 절약 및 전월세 대출의 성장에 기여
                </li>
                <li className="ms-[15px]">
                  <span className="leading-[14px]">
                    전월세 대출 운영에서 발생하는 CS 건수를 하루 평균 6~12건에서 0~2건으로 줄여 안정적으로 심사할 수
                    있는 환경 구축
                  </span>
                </li>
                <li className="ms-[15px]">
                  <span className="leading-[14px]">
                    비동기적인 전월세대출 심사 프로세스를 개선하기 위하여 자체 알림 서비스를 구축하여 심사 업무 시간
                    단축
                  </span>
                </li>
              </ul>
            </div>

            {/* SI Analytics */}
            <div className="mb-4">
              <a
                href="https://www.notion.so/hyunjinee/SIA-FE-f6fc37047c3c4db79ce6ec551688d598?pvs=4"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[13px] underline"
              >
                SI Analytics
              </a>
              <p className="text-[8px] text-gray-600">2023.03 ~ 2023.06 | Frontend Developer | 산학 협력 인턴</p>
              <ul className="text-[10px] space-y-1 mt-2">
                <li className="ms-[15px]">
                  <span className="leading-[14px]">
                    인공지능을 기반으로 위성/항공 영상을 분석하는 서비스인 Ovision과 Ovision Admin을 개발
                  </span>
                </li>
                <li className="ms-[15px]">
                  <span className="leading-[14px]">
                    애플리케이션에 도입할 상태 관리 라이브러리 비교, CRA와 Vite 비교 등을 사내에서 발표
                  </span>
                </li>
              </ul>
            </div>

            {/* 엘리스 */}
            <div className="mb-4">
              <a
                href="https://hyunjin.oopy.io/7b78d8a5-636d-436c-86f9-0dd5382f9d43"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[13px] underline"
              >
                엘리스
              </a>
              <p className="text-[8px] text-gray-600">2022.10 | SW 트랙 3기 실습 코치</p>
              <ul className="text-[10px] space-y-1 mt-2">
                <li className="leading-[14px] ms-[15px]">
                  엘리스 SW 트랙 3기에서 실습코치로 JavaScript, TypeScript를 강의
                </li>
                <li className="ms-[15px]">
                  <span className="leading-[14px]">수강생 72명을 대상으로 한 강의 평가에서 (4.49 / 5)의 평점</span>
                </li>
              </ul>
            </div>

            {/* 소프트웨어 마에스트로 */}
            <div className="mb-4">
              <a
                href="https://hyunjin.oopy.io/fab659af-6b24-4fad-b64e-cbc05d937957"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[13px] underline"
              >
                소프트웨어 마에스트로
              </a>
              <p className="text-[8px] text-gray-600">2022.04 ~ 2022.12 | 13기</p>
              <ul className="text-[10px] space-y-1 mt-2">
                <li className="leading-[14px] ms-[15px]">
                  오프라인에서도 사용할 수 있는 할 일 관리 앱인 MOZI 서비스를 개발(PWA, Next.js)
                </li>
                <li className="ms-[15px]">
                  <span className="leading-[14px]">
                    4번의 컨퍼런스에서 발표를 했으며, 13기를 빛낸 13인의 연수생으로 선정
                  </span>
                </li>
              </ul>
            </div>

            {/* 방슐랭 가이드 */}
            <div className="mb-4">
              <a
                href="https://hyunjin.oopy.io/b08771a5-af10-40bf-990d-30fae0440525"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[13px] underline"
              >
                방슐랭 가이드
              </a>
              <p className="text-[8px] text-gray-600">2021.07 ~ 2022.08 | 창업 동아리</p>
              <ul className="text-[10px] space-y-1 mt-2">
                <li className="ms-[15px]">
                  <span className="leading-[14px]">
                    1인 가구 중심의 부동산 플랫폼의 클라이언트, 서버를 개발하여 배포(React Native, Node.js)
                  </span>
                </li>
                <li className="ms-[15px]">
                  <span className="leading-[14px]">
                    1500명 이상의 유저 달성, 98건의 직거래, 936만원의 매출, 4000만원의 투자 유치
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* 기술 섹션 */}
          <section>
            <h2 className="font-bold text-[15px] mb-3 border-b pb-1">기술</h2>
            <ul className="text-[10px] space-y-1">
              <li className="ms-[15px]">
                <span className="leading-[14px]">
                  모던 프론트엔드 기술 스택을 빠르게 습득하여 적용할 수 있는 유연함과 변하지 않는 부분을 깊이 있게
                  공부하는 단단함을 가지고 있습니다.
                </span>
              </li>
              <li className="leading-[14px] ms-[15px]">
                프론트엔드에서 상태 관리에 대해 이해하며 적절한 패턴 적용 및 적절한 라이브러리를 선택할 수 있습니다.
              </li>
              <li className="ms-[15px]">
                <span className="leading-[14px]">
                  브라우저의 구조와 특성을 이해하며, Core Web Vitals를 고려하여 프로젝트에 적절한 렌더링 패턴을 적용할
                  수 있습니다.
                </span>
              </li>
              <li className="leading-[14px] ms-[15px]">
                React, Next.js 생태계에 관심이 많고 더 나은 개발 방법에 대해 끊임없이 고민합니다.
              </li>
              <li className="leading-[14px] ms-[15px]">
                프론트엔드와 백엔드의 대화를 더 효율적으로 만드는 방법들에 관심이 많습니다.(BFF, GraphQL)
              </li>
              <li className="ms-[15px]">
                <span className="leading-[14px]">
                  Node.js, Nest.js를 사용하여 서버를 구축하고, AWS 서비스들을 사용하여 애플리케이션을 배포 및 운영해본
                  경험이 있습니다.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
