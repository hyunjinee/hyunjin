import React from 'react'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 md:p-10 font-pretendard">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="이현진 프로필"
                width={300}
                height={300}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <h1 className="text-2xl font-bold mt-4">이현진</h1>
            <h2 className="text-2xl font-bold">Lee Hyun Jin</h2>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm">leehj0110@kakao.com</span>
              </div>
              <div className="mt-4 space-y-1">
                <a href="#" className="text-sm block hover:underline">
                  LinkedIn
                </a>
                <a href="#" className="text-sm block hover:underline">
                  Github
                </a>
                <a href="#" className="text-sm block hover:underline">
                  Blog1
                </a>
                <a href="#" className="text-sm block hover:underline">
                  Blog2
                </a>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm">
                프론트엔드 분야에서 내 생각을 말할 수 있는 엔지니어가 되자는 목표를 가지고 있고, 저를 아래와 같은
                엔지니어라고 생각합니다.
              </p>
              <p className="text-sm mt-4 leading-relaxed">
                빠른 실행력과 커뮤니케이션 스킬을 바탕으로 유저에게 제품을 빠르고 안정적으로 제공할 수 있는 엔지니어
                <br />
                주도적으로 업무를 파악하고 발생한 문제를 깊게 파고들어 명확하게 해결하고, 이 과정에서 스스로 학습하는
                엔지니어
                <br />
                프로젝트에서 협업의 중요성을 이해하고 적극적으로 커뮤니케이션하는 엔지니어
              </p>
            </div>

            <div className="mt-8">
              <p className="text-sm leading-relaxed">
                웹 페이지 위에 내 생각을 표현할 수 있다는 것에 매력을 느껴서 프론트엔드 개발을 좋아하게 되었습니다.
              </p>
              <p className="text-sm mt-4 leading-relaxed">
                서비스를 만들어가는 과정에서 동료와 토론하고 배운 내용을 공유하는 것을 즐깁니다. 또한 하드스킬과
                소프트스킬을 기르는데 있어서 꾸준함을 가지고 있고 새로운 도전을 통해 성장하고자 노력합니다.
              </p>
            </div>
          </div>

          {/* 메인 컨텐츠 섹션 */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* 경험 섹션 */}
            <div>
              <h2 className="text-lg font-bold pb-2 border-b border-gray-200">경험</h2>

              <div className="mt-4">
                <h3 className="text-base font-bold">토스뱅크</h3>
                <div className="text-xs mt-1 text-gray-700">
                  <span>2023.09 ~ 2024.04</span>
                  <span className="mx-2">|</span>
                  <span>FullStack Developer</span>
                  <span className="mx-2">|</span>
                  <span>Housing Loan Squad</span>
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="text-sm leading-relaxed">
                    LUMOS(Loan Universal Management Operating System), 전월세 대출의 심사와 운영을 위한 서비스를
                    주도적으로 개발(TypeScript, React, Next, Kotlin, Spring)
                  </li>
                  <li className="text-sm leading-relaxed">
                    전세대출의 갈아타기, 새로받기, 주기별점검등 다양한 대출 및 심사와 운영 서비스를 개발하여 타 은행
                    대비 압도적으로 적은 인원으로 대출 심사가 진행될 수 있었으며, 인건비 절약 및 전월세 대출의 성장에
                    기여
                  </li>
                  <li className="text-sm leading-relaxed">
                    전월세 대출 운영에서 발생하는 CS 건수를 하루 평균 6~12건에서 0~2건으로 줄여 안정적으로 심사할 수
                    있는 환경 구축
                  </li>
                  <li className="text-sm leading-relaxed">
                    비동기적인 전월세대출 심사 프로세스를 개선하기 위하여 자체 알림 서비스를 구축하여 심사 업무 시간
                    단축(권리 조사 업무를 처리하는데 걸리는 시간을 평균 60분에서 30분으로 단축)
                  </li>
                  <li className="text-sm leading-relaxed">
                    API 응답시간이 느린 곳이나 유저에게 즉각적인 피드백이 필요한 곳에 Optimistic Update 적용 및 여러
                    페이지에서 발생하는 API 요청의 network waterfall을 찾아 쿼리들을 병렬 실행시켜 waterfall 제거
                  </li>
                  <li className="text-sm leading-relaxed">
                    다양한 요구사항과 수정사항을 애플리케이션에 빠르게 적용하기위하여 패키지 관리자를 yarn berry로
                    마이그레이션하고 zero install 환경을 구축하여 서비스의 총 CI/CD 시간을 56% 단축
                  </li>
                  <li className="text-sm leading-relaxed">
                    사용자의 입력이나 애플리케이션 외부에서 들어오는 값들을 런타임에 검증하기 위해 zod를 적극적으로 활용
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-bold">SI Analytics</h3>
                <div className="text-xs mt-1 text-gray-700">
                  <span>2023.03 ~ 2023.06</span>
                  <span className="mx-2">|</span>
                  <span>Frontend Developer</span>
                  <span className="mx-2">|</span>
                  <span>산학 협력 인턴</span>
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="text-sm leading-relaxed">
                    인공지능을 기반으로 위성/항공 영상을 분석하는 서비스인 Ovision과 Ovision Admin을 개발(React,
                    TypeScript, Sass)
                  </li>
                  <li className="text-sm leading-relaxed">
                    애플리케이션에 도입할 상태 관리 라이브러리 비교, CRA와 Vite 비교, yarn berry와 관련된 내용을
                    사내에서 발표
                  </li>
                  <li className="text-sm leading-relaxed">
                    OpenLayers 기반의 지도 위에서 사용자의 다양한 상호작용 및 지도에서 장소 검색어 추천 기능 구현
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-bold">소프트웨어 마에스트로</h3>
                <div className="text-xs mt-1 text-gray-700">
                  <span>2022.04 ~ 2022.12</span>
                  <span className="mx-2">|</span>
                  <span>13기</span>
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="text-sm leading-relaxed">
                    브라우저의 Cache API와 Service Worker를 사용해서 리소스의 성격에 따른 적절한 캐싱 전략을 적용하여
                    웹을 오프라인에서 동작시켰고, IndexedDB와 백그라운드 동기화 API를 사용하여 오프라인 환경에서 작업한
                    내용이 온라인 환경으로 전환될 때 서버에 동기화되도록 구현
                  </li>
                  <li className="text-sm leading-relaxed">
                    오프라인에서도 사용할 수 있는 할 일 관리 앱인 MOZI 서비스를 개발(PWA, Next.js, Node.js, MySQL)
                  </li>
                  <li className="text-sm leading-relaxed">
                    4번의 컨퍼런스에서 발표를 했으며, 13기를 빛낸 13인의 연수생으로 선정
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-bold">엘리스</h3>
                <div className="text-xs mt-1 text-gray-700">
                  <span>2022.10</span>
                  <span className="mx-2">|</span>
                  <span>SW 트랙 3기 실습 코치</span>
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="text-sm leading-relaxed">
                    엘리스 SW 트랙 3기에서 실습코치로 JavaScript, TypeScript를 강의 수강생 72명을 대상으로 한 강의
                    평가에서 (4.49 / 5)의 평점
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-base font-bold">방슐랭 가이드</h3>
                <div className="text-xs mt-1 text-gray-700">
                  <span>2021.07 ~ 2022.08</span>
                  <span className="mx-2">|</span>
                  <span>창업 동아리</span>
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="text-sm leading-relaxed">
                    기존 부동산 플랫폼의 허위 매물, 과장 광고와 같은 문제를 해결하기 위해 시작된 1인 가구 중심의 부동산
                    플랫폼의 클라이언트, 서버를 개발하여 배포(React Native, WebView, Node.js, MongoDB, AWS)
                  </li>
                  <li className="text-sm leading-relaxed">
                    Naver SENS API와 Redis를 사용하여 회원가입시에 핸드폰 인증 기능 구현
                  </li>
                  <li className="text-sm leading-relaxed">
                    대학교 근처를 중심으로 서비스하여 1500명 이상의 유저를 달성했으며, 앱을 통해 98건의 직거래,
                    936만원의 매출, 예비 창업 패키지를 통해 4000만원의 투자를 유치
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold">컨퍼런스 발표</h3>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">웹은 어떻게 발전했는가</li>
                  <li className="text-sm">Rendering Patterns</li>
                  <li className="text-sm">Thinking in React</li>
                  <li className="text-sm">GraphQL</li>
                </ul>
              </div>
            </div>

            {/* 기술 섹션 */}
            <div className="mt-10">
              <h2 className="text-lg font-bold pb-2 border-b border-gray-200">기술</h2>

              <div className="mt-4 space-y-3">
                <p className="text-sm leading-relaxed">
                  모던 프론트엔드 기술 스택을 빠르게 습득하여 적용할 수 있는 유연함과 변하지 않는 부분을 깊이 있게
                  공부하는 단단함을 가지고 있습니다.
                </p>
                <p className="text-sm leading-relaxed">
                  프론트엔드에서 상태 관리에 대해 이해하며 적절한 패턴 적용 및 적절한 라이브러리를 선택할 수 있습니다.
                </p>
                <p className="text-sm leading-relaxed">
                  프론트엔드와 백엔드의 대화를 더 효율적으로 만드는 방법들에 관심이 많습니다.(BFF, GraphQL)
                </p>
                <p className="text-sm leading-relaxed">
                  브라우저의 구조와 특성을 이해하며, Core Web Vitals를 고려하여 프로젝트에 적절한 렌더링 패턴을 적용할
                  수 있습니다.
                </p>
                <p className="text-sm leading-relaxed">
                  Node.js, Nest.js를 사용하여 서버를 구축하고, AWS(EC2, S3, CloudFront, Route53) 서비스들을 사용하여
                  애플리케이션을 배포 및 운영해본 경험이 있습니다.
                </p>
                <p className="text-sm leading-relaxed">
                  React, Next.js 생태계에 관심이 많고 더 나은 개발 방법에 대해 끊임없이 고민합니다.
                </p>
                <p className="text-sm leading-relaxed">
                  Github Action, CodeDeploy등을 사용하여 CI / CD 환경을 구축하여 코드의 안정성 및 신뢰성을 높일 수
                  있습니다.
                </p>
                <p className="text-sm leading-relaxed">
                  Git과 같은 분산 버전 관리 시스템을 활용하여 동료와 유연하게 협업할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
