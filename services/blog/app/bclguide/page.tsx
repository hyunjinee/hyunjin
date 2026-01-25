import Image from 'next/image'
import appPromoImg from './images/app-promo.png'
import appScreenshot1 from './images/app-screenshot-1.png'
import appScreenshot2 from './images/app-screenshot-2.png'
import appScreenshot3 from './images/app-screenshot-3.png'
import appScreenshot4 from './images/app-screenshot-4.png'
import bottomScreenshotImg from './images/bottom-screenshot.png'
import logoImg from './images/logo.png'
import techDiagramImg from './images/tech-diagram.png'

const appScreenshots = [appScreenshot1, appScreenshot2, appScreenshot3, appScreenshot4]

export default function BclguidePage() {
  return (
    <div className="">
      <div className="mx-auto max-w-[700px] bg-white dark:bg-gray-900">
        {/* Header Section */}
        <div className="relative mb-6">
          {/* Logo */}
          <div className="mb-4">
            <Image src={logoImg} alt="방슐랭 가이드 로고" width={193} height={42} className="h-[42px] w-auto" />
          </div>

          {/* Position and Period */}
          <div className="absolute top-0 right-0 text-right">
            <p className="mb-1 text-[13px] text-black dark:text-gray-200">창업 동아리</p>
            <p className="text-[13px] text-black dark:text-gray-200">2021.07 ~ 2022.08</p>
          </div>
        </div>

        {/* Project Overview */}
        <div className="mb-6">
          <h2 className="mb-3 text-[12px] font-bold text-bclguide decoration-2 underline-offset-4 dark:text-white">
            프로젝트 개요
          </h2>
          <div className="space-y-2">
            <p className="text-[10px] leading-[14px] text-black dark:text-gray-200">
              방슐랭 가이드는 기존 부동산 플랫폼의 허위 매물 및 과장 광고를 해결하기 위한 1인가구 중심의 부동산 직거래
              플랫폼입니다.
            </p>
            <p className="text-[10px] leading-[14px] text-black dark:text-gray-200">
              방에 대해 리뷰를 작성할 수 있고 직접 촬영한 3D 투어 기능이 있어서 학생들이 편하고 쉽게 방을 구할 수 있도록
              노력했습니다.
            </p>
            <p className="text-[10px] leading-[14px] text-black dark:text-gray-200">
              충남대학교 근처에서 서비스하여 유저 1500명 이상을 달성하였고, 앱을 통해 직거래가 이루어졌습니다. (4000만원
              투자유치)
            </p>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          {/* Skills Stack */}
          <div>
            <h2 className="mb-2 text-[15px] font-bold text-bclguide">기술 스택</h2>
            <div className="mb-4 space-y-1">
              <p className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                JavaScript, React Native, WebView, Redux, Pannellum
              </p>
              <p className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                Node, Express, Nginx, MongoDB, Redis
              </p>
              <p className="text-[10px] leading-[14px] text-black dark:text-gray-200">AWS EC2, S3, Route 53</p>
            </div>

            {/* Tech Stack Diagram */}
            <div className="overflow-hidden rounded-lg">
              <Image
                src={techDiagramImg}
                alt="기술 스택 다이어그램"
                width={245}
                height={148}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Project Contributions */}
          <div>
            <h2 className="mb-2 text-[15px] font-bold text-bclguide">프로젝트 기여</h2>
            <ul className="space-y-1">
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - 안드로이드와 iOS 모두 서비스하고 빠르게 배포하기 위해 React Native를 선택해 모바일 애플리케이션을 개발
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - RESTful API 설계 및 MongoDB 스키마 설계(방, 리뷰, 건물, 유저)
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - 서비스를 EC2 인스턴스에 배포하여 도메인과 HTTPS를 적용
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                -{' '}
                <a
                  href="https://hyunjinee.tistory.com/57"
                  className="underline cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Naver SENS API와 Redis를 이용해 핸드폰 인증 구현
                </a>
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - Multer를 사용해 거주지 인증에서 사진과 함께 업로드할 수 있도록 구현
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - 사용자가 지도에서 검색을 통해 위치를 이동할 수 있도록 Naver Geocoding API를 사용해 주소를 위도 경도로
                변환
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - 방에 대한 리뷰 작성 기능 및 해당 리뷰를 신고할 수 있도록 구현
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - Webview를 사용하여 지도 및 마커 표시
              </li>
              <li className="text-[10px] leading-[14px] text-black dark:text-gray-200">
                - Webview와 Pannellum을 사용하여 3D 방 투어 기능 구현
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile App Screenshots */}
        <div className="mb-6">
          <div className="flex gap-4 justify-center">
            {appScreenshots.map((screenshot, index) => (
              <div key={screenshot.src} className="h-[216px] w-[100px] flex-none overflow-hidden">
                <Image
                  src={screenshot}
                  alt={`앱 스크린샷 ${index + 1}`}
                  width={100}
                  height={216}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* App Promo with Store Buttons */}
          <div className="overflow-hidden rounded-lg">
            <Image src={appPromoImg} alt="앱 프로모션" width={215} height={187} className="w-full h-auto" />
          </div>

          {/* Guide Better Room Card with Screenshot */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-bclguide">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={bottomScreenshotImg}
                alt="앱 스크린샷"
                width={260}
                height={145}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
