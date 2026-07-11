import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function AboutPage() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}

// import Image from 'next/image'
// import Link from 'next/link'
// import siteMetadata from '@/data/siteMetadata'

// const experiences = [
//   {
//     title: '토스뱅크',
//     period: '2023.09 ~ 2024.04',
//     role: 'FullStack Developer',
//     description: 'Housing Loan Squad',
//     link: '/tossbank',
//   },
//   {
//     title: 'SI Analytics',
//     period: '2023.03 ~ 2023.06',
//     role: 'Frontend Developer',
//     description: '산학 협력 인턴',
//   },
//   {
//     title: '엘리스',
//     period: '2022.10',
//     role: 'SW 트랙 3기 실습 코치',
//     description: 'JavaScript, TypeScript 강의',
//   },
//   {
//     title: '소프트웨어 마에스트로 13기',
//     period: '2022.04 ~ 2022.12',
//     role: '연수생',
//     description: 'PWA 기반 할 일 관리 앱 개발',
//   },
//   {
//     title: '방슐랭 가이드',
//     period: '2021.07 ~ 2022.08',
//     role: '창업 동아리',
//     description: '1인 가구 중심 부동산 플랫폼',
//   },
// ]

// const skills = [
//   '모던 프론트엔드 기술 스택을 빠르게 습득하여 적용할 수 있는 유연함과 변하지 않는 부분을 깊이 있게 공부하는 단단함을 가지고 있습니다.',
//   '프론트엔드에서 상태 관리에 대해 이해하며 적절한 패턴 적용 및 적절한 라이브러리를 선택할 수 있습니다.',
//   '브라우저의 구조와 특성을 이해하며, Core Web Vitals를 고려하여 프로젝트에 적절한 렌더링 패턴을 적용할 수 있습니다.',
//   'React, Next.js 생태계에 관심이 많고 더 나은 개발 방법에 대해 끊임없이 고민합니다.',
//   'Node.js, Nest.js를 사용하여 서버를 구축하고, AWS 서비스들을 사용하여 애플리케이션을 배포 및 운영해본 경험이 있습니다.',
//   'Github Action, CodeDeploy등을 사용하여 CI/CD 환경을 구축하여 코드의 안정성 및 신뢰성을 높일 수 있습니다.',
// ]

// export default function AboutPage() {
//   return (
//     <div className="px-4 py-12 min-h-screen sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-4xl">
//         {/* 프로필 헤더 */}
//         <header className="mb-12">
//           <div className="flex flex-col gap-8 items-start md:flex-row">
//             {/* 프로필 이미지 */}
//             <div className="overflow-hidden relative flex-shrink-0 mx-auto w-40 h-40 rounded-full md:mx-0">
//               <Image src="/public/images/hyunjin/hyunjin.jpg" alt="이현진" fill className="object-cover" priority />
//             </div>

//             {/* 기본 정보 */}
//             <div className="flex-1 text-center md:text-left">
//               <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-100">이현진 (Hyunjin Lee)</h1>
//               <p className="mb-4 text-xl text-gray-600 dark:text-gray-400">Frontend Developer</p>

//               {/* 소개 */}
//               <div className="mb-6 space-y-3 text-gray-700 dark:text-gray-300">
//                 <p>
//                   웹 페이지 위에 내 생각을 표현할 수 있다는 것에 매력을 느껴서 프론트엔드 개발을 좋아하게 되었습니다.
//                 </p>
//                 <p>
//                   서비스를 만들어가는 과정에서 동료와 토론하고 배운 내용을 공유하는 것을 즐깁니다. 또한 하드스킬과
//                   소프트스킬을 기르는데 있어서 꾸준함을 가지고 있고 새로운 도전을 통해 성장하고자 노력합니다.
//                 </p>
//               </div>

//               {/* 연락처 및 링크 */}
//               <div className="flex flex-wrap gap-4 justify-center text-sm md:justify-start">
//                 <span className="text-gray-600 dark:text-gray-400">{siteMetadata.email}</span>
//                 <Link
//                   href={siteMetadata.github}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//                 >
//                   GitHub
//                 </Link>
//                 <Link
//                   href={siteMetadata.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//                 >
//                   LinkedIn
//                 </Link>
//                 <Link
//                   href="https://velog.io/@hyunjine"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//                 >
//                   Velog
//                 </Link>
//                 <Link
//                   href="https://hyunjin.oopy.io"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
//                 >
//                   Blog
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* 경험 섹션 */}
//         <section className="mb-12">
//           <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 dark:text-gray-100 dark:border-gray-700">
//             Experience
//           </h2>
//           <div className="space-y-8">
//             {experiences.map((exp, index) => (
//               <div key={index} className="group">
//                 <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:justify-between sm:items-start">
//                   <div>
//                     {exp.link ? (
//                       <Link
//                         href={exp.link}
//                         className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-500 dark:hover:text-primary-400"
//                       >
//                         {exp.title}
//                       </Link>
//                     ) : (
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{exp.title}</h3>
//                     )}
//                     <p className="text-sm text-gray-600 dark:text-gray-400">{exp.role}</p>
//                   </div>
//                   <span className="text-sm text-gray-500 whitespace-nowrap dark:text-gray-500">{exp.period}</span>
//                 </div>
//                 <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* 기술 섹션 */}
//         <section>
//           <h2 className="pb-2 mb-6 text-2xl font-bold text-gray-900 border-b-2 border-gray-200 dark:text-gray-100 dark:border-gray-700">
//             Skills
//           </h2>
//           <ul className="space-y-3">
//             {skills.map((skill, index) => (
//               <li
//                 key={index}
//                 className="text-gray-700 dark:text-gray-300 pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-primary-500"
//               >
//                 {skill}
//               </li>
//             ))}
//           </ul>
//         </section>
//       </div>
//     </div>
//   )
// }
