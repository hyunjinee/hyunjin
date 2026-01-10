import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import type { LanguageModelV1 } from 'ai'
import { loadConfig } from '../cli/config'

export interface ProviderInfo {
  id: string
  name: string
  models: string[]
  defaultModel: string
}

export const PROVIDERS: Record<string, ProviderInfo> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-5', 'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1', 'o1-mini', 'o1-preview'],
    defaultModel: 'gpt-5',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      'claude-3-5-sonnet-latest',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-latest',
      'claude-3-opus-latest',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ],
    defaultModel: 'claude-3-5-sonnet-latest',
  },
}

export function parseModelString(modelString?: string): { providerId: string; modelId: string } {
  if (!modelString) {
    // Default: try to find available provider
    const config = loadConfig()
    const openaiKey = process.env.OPENAI_API_KEY || config.providers.openai?.apiKey
    const anthropicKey = process.env.ANTHROPIC_API_KEY || config.providers.anthropic?.apiKey

    if (anthropicKey) {
      return { providerId: 'anthropic', modelId: PROVIDERS.anthropic.defaultModel }
    }
    if (openaiKey) {
      return { providerId: 'openai', modelId: PROVIDERS.openai.defaultModel }
    }

    throw new Error(
      'API 키가 설정되지 않았습니다.\n' +
        '환경변수(OPENAI_API_KEY 또는 ANTHROPIC_API_KEY)를 설정하거나\n' +
        "'hyunjin config --set-key openai' 명령어로 설정해주세요.",
    )
  }

  const parts = modelString.split('/')
  if (parts.length === 2) {
    return { providerId: parts[0], modelId: parts[1] }
  }

  // If no provider specified, try to detect from model name
  const modelId = modelString
  if (modelId.startsWith('gpt-') || modelId.startsWith('o1')) {
    return { providerId: 'openai', modelId }
  }
  if (modelId.startsWith('claude-')) {
    return { providerId: 'anthropic', modelId }
  }

  throw new Error(`알 수 없는 모델: ${modelString}`)
}

export function getLanguageModel(providerId: string, modelId: string): LanguageModelV1 {
  const config = loadConfig()

  switch (providerId) {
    case 'openai': {
      const apiKey = process.env.OPENAI_API_KEY || config.providers.openai?.apiKey
      if (!apiKey) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다')
      }
      const openai = createOpenAI({ apiKey })
      return openai(modelId)
    }

    case 'anthropic': {
      const apiKey = process.env.ANTHROPIC_API_KEY || config.providers.anthropic?.apiKey
      if (!apiKey) {
        throw new Error('Anthropic API 키가 설정되지 않았습니다')
      }
      const anthropic = createAnthropic({ apiKey })
      return anthropic(modelId)
    }

    default:
      throw new Error(`지원하지 않는 provider: ${providerId}`)
  }
}
