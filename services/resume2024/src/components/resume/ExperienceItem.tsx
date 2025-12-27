import Image from 'next/image'

interface Achievement {
  text: string
  link?: string
  isTitle?: boolean
}

interface ExperienceItemProps {
  title: string
  link?: string
  period: string
  role?: string
  squad?: string
  achievements: Achievement[]
  logo?: string
  tags?: string[]
}

export default function ExperienceItem({
  title,
  link,
  period,
  role,
  squad,
  achievements,
  logo,
  tags,
}: ExperienceItemProps) {
  return (
    <div className="flex gap-3 md:gap-4">
      {/* 로고 */}
      {logo && (
        <div className="flex-shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 relative rounded-lg overflow-hidden bg-white border border-gray-200">
            <Image src={logo} alt={`${title} logo`} fill className="object-contain p-1" />
          </div>
        </div>
      )}

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        {/* 제목과 기간 */}
        <div className="flex justify-between items-start mb-1 gap-2">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold leading-tight underline text-subheading"
            >
              {title}
            </a>
          ) : (
            <h3 className="font-bold leading-tight text-subheading">{title}</h3>
          )}
          <span className="text-[14px] leading-tight text-gray-600 whitespace-nowrap">{period}</span>
        </div>

        {/* 역할 정보 */}
        {(role || squad) && (
          <div className="text-[14px] leading-tight mb-2 text-gray-700">
            {role && <span className="font-medium">{role}</span>}
            {squad && <span className="text-gray-600"> · {squad}</span>}
          </div>
        )}

        {/* 성과 목록 */}
        <ul className="text-body space-y-0.5 md:space-y-0 mb-2.5">
          {achievements.map((achievement, index) => {
            if (achievement.isTitle) {
              return (
                <li key={index} className="mt-1 font-bold leading-tight">
                  {achievement.text}
                </li>
              )
            }

            return (
              <li key={index} className="list-disc ms-[15px]">
                {achievement.link ? (
                  <a
                    href={achievement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leading-tight underline cursor-pointer"
                  >
                    {achievement.text}
                  </a>
                ) : (
                  <span className="leading-tight">{achievement.text}</span>
                )}
              </li>
            )
          })}
        </ul>

        {/* 기술 스택 태그 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
