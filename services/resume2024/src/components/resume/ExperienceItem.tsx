interface Achievement {
  text: string
  link?: string
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
          className="font-bold text-[13px] leading-[14px] underline block mb-1"
        >
          {title}
        </a>
      ) : (
        <h3 className="font-bold text-[13px] leading-[14px] mb-1">{title}</h3>
      )}

      {/* 기간 및 역할 정보 */}
      <div className="text-[8px] leading-[14px] text-gray-600 mb-1.5 space-y-0">
        <p>{period}</p>
        {role && <p>{role}</p>}
        {squad && <p>{squad}</p>}
      </div>

      {/* 성과 목록 */}
      <ul className="text-[10px] space-y-0.5 md:space-y-0">
        {achievements.map((achievement, index) => (
          <li key={index} className="list-disc ms-[15px]">
            {achievement.link ? (
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline cursor-pointer leading-[14px]"
              >
                {achievement.text}
              </a>
            ) : (
              <span className="leading-[14px]">{achievement.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
