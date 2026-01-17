import Image from 'next/image'
import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import CustomLink from '@/components/Link'

const experiences = [
  {
    title: '카카오 엔터테인먼트',
    period: 'Now',
    role: 'Frontend Engineer',
    description: 'Berriz FE 개발팀',
    logos: [
      { src: '/images/kakaoentertainment/kakaoent.svg', darkInvert: true, href: 'https://kakaoent.com/' },
      { src: '/images/kakaoentertainment/berriz_logo.svg', href: 'https://berriz.in/ko' },
    ],
  },
  {
    title: '토스뱅크',
    period: '2023.09 ~ 2024.04',
    role: 'FullStack Engineer',
    description: 'Housing Loan Squad 전월세 대출 심사 및 운영 서비스 개발',
    link: 'https://hyunjinee.notion.site/0d01b8a2b1ac4249a09a946885140870',
    logos: [{ src: '/images/tossbank/Toss_Symbol_Primary.png', href: 'https://www.tossbank.com/' }],
  },
  // {
  //   title: 'SI Analytics',
  //   period: '2023.03 ~ 2023.06',
  //   role: 'Frontend Developer',
  //   description: '인공지능 기반 위성/항공 영상 분석 서비스 Ovision 개발',
  // },
]

const skills = [
  '모던 프론트엔드 기술 스택을 빠르게 습득하여 적용할 수 있는 유연함과 변하지 않는 부분을 깊이 있게 공부하는 단단함을 가지고 있습니다.',
  '프론트엔드에서 상태 관리에 대해 이해하며 적절한 패턴 적용 및 적절한 라이브러리를 선택할 수 있습니다.',
  '브라우저의 구조와 특성을 이해하며, Core Web Vitals를 고려하여 프로젝트에 적절한 렌더링 패턴을 적용할 수 있습니다.',
  'React, Next.js 생태계에 관심이 많고 더 나은 개발 방법에 대해 끊임없이 고민합니다.',
  'Node.js, Nest.js를 사용하여 서버를 구축하고, AWS 서비스들을 사용하여 애플리케이션을 배포 및 운영해본 경험이 있습니다.',
  'Github Action, CodeDeploy등을 사용하여 CI/CD 환경을 구축하여 코드의 안정성 및 신뢰성을 높일 수 있습니다.',
]



export default function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // return <Main posts={posts} />

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight leading-9 text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          About
        </h1>
      </div> */}
      <div className="container md:mt-5">
        {/* 프로필 헤더 */}
        <header className="mb-8">
          <div className="flex flex-col gap-8 items-start md:flex-row">
            {/* 프로필 이미지 */}
            <div className="overflow-hidden relative flex-shrink-0 mx-auto rounded-full w-50 h-50 md:w-50 md:h-50 md:mx-0">
              <Image
                src="/images/hyunjin/hyunjin.jpg"
                alt="이현진"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </div>
            {/* 기본 정보 */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">이현진 (Hyunjin Lee)</h1>
              <p className="mb-6 text-lg text-gray-600 md:text-xl dark:text-gray-400">Software Engineer</p>

              {/* 소개 */}
              <div className="mb-6 space-y-3 text-sm text-gray-700 md:text-base dark:text-gray-300">
                <p>
                  웹 페이지 위에 내 생각을 표현할 수 있다는 것에 매력을 느껴서 프론트엔드 개발을 좋아하게 되었습니다.
                </p>
                <p>
                  서비스를 만들어가는 과정에서 동료와 토론하고 배운 내용을 공유하는 것을 즐깁니다. 또한 하드스킬과
                  소프트스킬을 기르는데 있어서 꾸준함을 가지고 있고 새로운 도전을 통해 성장하고자 노력합니다.
                </p>
              </div>

              {/* 연락처 및 링크 */}
              <div className="flex flex-wrap gap-3 justify-center text-sm md:gap-4 md:justify-start">
                <span className="text-gray-600 dark:text-gray-400">{siteMetadata.email}</span>
                <span className="text-gray-400 dark:text-gray-600">·</span>
                <Link
                  href={siteMetadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  GitHub
                </Link>
                <span className="text-gray-400 dark:text-gray-600">·</span>
                <Link
                  href={siteMetadata.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  LinkedIn
                </Link>
                <span className="text-gray-400 dark:text-gray-600">·</span>
                <Link
                  href="https://hyunjin.oopy.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* 경험 섹션 */}
        <section className="mb-10">
          <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
            Work Experience
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="group">
                <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center">
                      {exp.link ? (
                        <Link
                          href={exp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-gray-900 transition-colors md:text-xl dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400"
                        >
                          {exp.title}
                        </Link>
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900 md:text-xl dark:text-gray-100">
                          {exp.title}
                        </h3>
                      )}
                      {exp.logos &&
                        exp.logos.map((logo, logoIndex) => (
                          <Link key={logoIndex} href={logo.href} target="_blank" rel="noopener noreferrer">
                            <Image
                              src={logo.src}
                              alt=""
                              width={24}
                              height={24}
                              className={`h-5 w-auto object-contain ${logo.darkInvert ? 'dark:invert' : ''}`}
                            />
                          </Link>
                        ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 md:text-base dark:text-gray-400">{exp.role}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">{exp.period}</span>
                </div>
                <p className="text-sm text-gray-700 md:text-base dark:text-gray-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 기술 섹션 */}
        <section className="mb-10">
          <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
            Skills
          </h2>
          <ul className="space-y-4">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="text-sm md:text-base text-gray-700 dark:text-gray-300 pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-primary-500"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>

        {/* 뉴스 섹션 */}
        <section>
          <h2 className="pb-2 mb-8 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 md:text-3xl dark:text-gray-100 dark:border-gray-700">
            News
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <span className="flex-shrink-0 text-[14px] font-medium text-gray-500 md:text-base dark:text-gray-500 sm:w-20">
                08/2025
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-gray-700 md:text-[16px] dark:text-gray-300">
                  <CustomLink
                    href="https://www.kakaotechcampus.com/"
                    className='"transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"'
                  >
                    카카오 테크 캠퍼스
                  </CustomLink>
                  &nbsp;3기 FE 멘토
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <span className="flex-shrink-0 text-[14px] font-medium text-gray-500 md:text-[16px] dark:text-gray-500 sm:w-20">
                03/2023
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-gray-700 md:text-[16px] dark:text-gray-300">
                  SI Analytics Frontend Engineer(대학교 산학 협력 인턴) Ovision 서비스 개발
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <span className="flex-shrink-0 text-[14px] font-medium text-gray-500 md:text-[16px] dark:text-gray-500 sm:w-20">
                02/2023
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-gray-700 md:text-[16px] dark:text-gray-300">
                  <CustomLink
                    href="https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE11229679"
                    className='"transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"'
                  >
                    인공지능 스피커를 활용한 복약 지원 시스템의 설계 및 구현
                  </CustomLink>
                  (한국 HCI 학회, 졸업 논문)
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <span className="flex-shrink-0 text-[14px] font-medium text-gray-500 md:text-[16px] dark:text-gray-500 sm:w-20">
                10/2022
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-gray-700 md:text-[16px] dark:text-gray-300">
                  엘리스 SW 트랙 3기 실습 코치
                  <CustomLink
                    href="/talks/asynchronous-javascript"
                    className='"transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"'
                  >
                    JavaScript, TypeScript 강의
                  </CustomLink>
                  (수강생 72명 대상 4.49/5 평점)
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <span className="flex-shrink-0 text-[14px] font-medium text-gray-500 md:text-[16px] dark:text-gray-500 sm:w-20">
                04/2022
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-gray-700 md:text-[16px] dark:text-gray-300">
                  소프트웨어 마에스트로 13기 연수생(MOZI 서비스 개발, 13기를 빛낸 13인의 연수생)
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <span className="flex-shrink-0 text-[14px] font-medium text-gray-500 md:text-[16px] dark:text-gray-500 sm:w-20">
                07/2021
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-gray-700 md:text-[16px] dark:text-gray-300">
                  1인 가구 중심 부동산 플랫폼{' '}
                  <CustomLink
                    href=""
                    className='"transition-colors text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"'
                  >
                    방슐랭 가이드
                  </CustomLink>
                  (창업 동아리, 1500+ 유저, 98건 직거래 달성)
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
