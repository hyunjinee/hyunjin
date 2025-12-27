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
}

export default function ExperienceItem({ title, link, period, role, squad, achievements }: ExperienceItemProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        {/* 제목 */}
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-1 font-bold leading-tight underline text-subheading"
          >
            {title}
          </a>
        ) : (
          <h3 className="mb-1 font-bold leading-tight text-subheading">{title}</h3>
        )}
        {/* 기간 및 역할 정보 */}
        <div className="text-[14px] leading-tight  mb-1.5 space-y-0">
          {role && <span>{role}</span>}
          {squad && <span>({squad})</span>}
          <span>{period}</span>
        </div>
      </div>
      {/* 성과 목록 */}
      <ul className="text-body space-y-0.5 md:space-y-0">
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
    </div>
  )
}
