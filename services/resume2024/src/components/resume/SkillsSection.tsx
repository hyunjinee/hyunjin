interface Skill {
  text: string
  links?: Array<{ text: string; url: string }>
}

export default function SkillsSection() {
  const skills: Skill[] = [
    {
      text:
        '모던 프론트엔드 기술 스택을 빠르게 습득하여 적용할 수 있는 유연함과 변하지 않는 부분을 깊이 있게 공부하는 단단함을 가지고 있습니다.',
    },
    {
      text: '프론트엔드에서 상태 관리에 대해 이해하며 적절한 패턴 적용 및 적절한 라이브러리를 선택할 수 있습니다.',
      links: [
        {
          text: '프론트엔드에서 상태 관리에 대해 이해',
          url:
            'https://velog.io/@hyunjine/%EC%9B%B9-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%EC%97%90%EC%84%9C-%EC%83%81%ED%83%9C%EB%9E%80',
        },
        {
          text: '패턴',
          url: 'https://velog.io/@hyunjine/Flux',
        },
      ],
    },
    {
      text:
        '브라우저의 구조와 특성을 이해하며, Core Web Vitals를 고려하여 프로젝트에 적절한 렌더링 패턴을 적용할 수 있습니다.',
    },
    {
      text: 'React, Next.js 생태계에 관심이 많고 더 나은 개발 방법에 대해 끊임없이 고민합니다.',
      links: [
        {
          text: 'React',
          url: 'https://velog.io/@hyunjine/Thinking-in-React',
        },
      ],
    },
    {
      text: '프론트엔드와 백엔드의 대화를 더 효율적으로 만드는 방법들에 관심이 많습니다.(BFF, GraphQL)',
      links: [
        {
          text: 'GraphQL',
          url: 'https://velog.io/@hyunjine/GraphQL',
        },
      ],
    },
    {
      text:
        'Node.js, Nest.js를 사용하여 서버를 구축하고, AWS(EC2, S3, CloudFront, Route53) 서비스들을 사용하여 애플리케이션을 배포 및 운영해본 경험이 있습니다.',
    },
    {
      text:
        'Github Action, CodeDeploy등을 사용하여 CI / CD 환경을 구축하여 코드의 안정성 및 신뢰성을 높일 수 있습니다.',
    },
    {
      text: 'Git과 같은 분산 버전 관리 시스템을 활용하여 동료와 유연하게 협업할 수 있습니다.',
      links: [
        {
          text: 'Git과 같은 분산 버전 관리 시스템을 활용하여 동료와 유연하게 협업할 수 있습니다.',
          url: 'https://www.youtube.com/watch?v=VadEWpLVnGU',
        },
      ],
    },
  ]

  const renderSkillText = (skill: Skill) => {
    if (!skill.links || skill.links.length === 0) {
      return skill.text
    }

    // 링크가 있는 경우 텍스트를 파싱해서 링크로 변환
    let result = skill.text
    const parts: React.ReactNode[] = []
    let lastIndex = 0

    // 링크를 텍스트에서 찾아서 교체
    for (const link of skill.links) {
      const index = result.indexOf(link.text, lastIndex)
      if (index !== -1) {
        // 링크 이전 텍스트
        if (index > lastIndex) {
          parts.push(result.substring(lastIndex, index))
        }
        // 링크
        parts.push(
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline cursor-pointer"
          >
            {link.text}
          </a>,
        )
        lastIndex = index + link.text.length
      }
    }

    // 나머지 텍스트
    if (lastIndex < result.length) {
      parts.push(result.substring(lastIndex))
    }

    return parts
  }

  return (
    <section>
      <h2 className="font-bold text-[18px] mb-3 leading-tight">기술</h2>
      <ul className="text-body space-y-1 md:space-y-0.5">
        {skills.map((skill, index) => (
          <li key={index} className="list-disc ms-[15px]">
            <span className="leading-tight">{renderSkillText(skill)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
