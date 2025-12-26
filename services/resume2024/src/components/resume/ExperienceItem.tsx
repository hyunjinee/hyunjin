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
      {/* 제목 */}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-subheading leading-tight underline block mb-1"
        >
          {title}
        </a>
      ) : (
        <h3 className="font-bold text-subheading leading-tight mb-1">{title}</h3>
      )}

      {/* 기간 및 역할 정보 */}
      <div className="text-meta leading-tight text-gray-600 mb-1.5 space-y-0">
        <p>{period}</p>
        {role && <p>{role}</p>}
        {squad && <p>{squad}</p>}
      </div>

      {/* 성과 목록 */}
      <ul className="text-body space-y-0.5 md:space-y-0">
        {achievements.map((achievement, index) => {
          if (achievement.isTitle) {
            return (
              <li key={index} className="font-bold leading-tight mt-1">
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
                  className="underline cursor-pointer leading-tight"
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
