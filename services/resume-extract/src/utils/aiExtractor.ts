import OpenAI from 'openai'
import { ExtractedResumeInfo, ResumeExtractorConfig } from '../types'

export class AIExtractor {
  private openai: OpenAI
  private model: string = 'gpt-3.5-turbo'

  constructor(config: ResumeExtractorConfig) {
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API 키가 필요합니다.')
    }

    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    })
  }

  async extractInformation(text: string): Promise<ExtractedResumeInfo> {
    try {
      const prompt = this.createExtractionPrompt(text)

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '당신은 이력서 분석 전문가입니다. 주어진 이력서 텍스트에서 구조화된 정보를 추출해주세요.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('AI로부터 응답을 받지 못했습니다.')
      }

      try {
        const extractedInfo = JSON.parse(response)
        return {
          ...extractedInfo,
          rawText: text,
        }
      } catch (parseError) {
        throw new Error('AI 응답을 파싱할 수 없습니다.')
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI 추출 중 오류: ${error.message}`)
      }
      throw new Error('AI 추출 중 알 수 없는 오류가 발생했습니다.')
    }
  }

  private createExtractionPrompt(text: string): string {
    return `
다음 이력서 텍스트에서 정보를 추출하여 JSON 형식으로 반환해주세요.

이력서 텍스트:
"""
${text}
"""

추출해야 할 정보:
1. name: 지원자 이름
2. contact: 연락처 정보 (email, phone, address, linkedin, github)
3. skills: 보유 기술 배열
4. experience: 경력 정보 배열 (company, position, duration, description)
5. education: 학력 정보 배열 (institution, degree, major, duration)
6. projects: 프로젝트 경험 배열 (name, description, technologies, duration)
7. certifications: 자격증 배열 (name, issuer, date)

응답 형식은 다음과 같은 JSON이어야 합니다:

{
  "name": "홍길동",
  "contact": {
    "email": "example@email.com",
    "phone": "010-1234-5678",
    "address": "서울특별시",
    "linkedin": "linkedin.com/in/example",
    "github": "github.com/example"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "company": "회사명",
      "position": "직책",
      "duration": "2020.01 - 2023.12",
      "description": "업무 설명"
    }
  ],
  "education": [
    {
      "institution": "대학교명",
      "degree": "학위",
      "major": "전공",
      "duration": "2016.03 - 2020.02"
    }
  ],
  "projects": [
    {
      "name": "프로젝트명",
      "description": "프로젝트 설명",
      "technologies": ["기술1", "기술2"],
      "duration": "2023.01 - 2023.06"
    }
  ],
  "certifications": [
    {
      "name": "자격증명",
      "issuer": "발급기관",
      "date": "2023.01"
    }
  ]
}

정보가 없는 필드는 null이나 빈 배열로 설정하고, 추측하지 마세요. 정확한 정보만 추출해주세요.
응답은 반드시 유효한 JSON 형식이어야 합니다.
`
  }
}
