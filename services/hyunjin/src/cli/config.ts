import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as readline from 'readline'
import { UI } from '../ui'

interface ConfigOptions {
  setKey?: string
}

const CONFIG_DIR = path.join(os.homedir(), '.hyunjin')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')

export interface HyunjinConfig {
  providers: {
    openai?: { apiKey: string }
    anthropic?: { apiKey: string }
  }
  defaultModel?: string
}

export function loadConfig(): HyunjinConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8')
      return JSON.parse(content)
    }
  } catch {
    // ignore
  }
  return { providers: {} }
}

export function saveConfig(config: HyunjinConfig) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
}

export async function configCommand(options: ConfigOptions) {
  if (options.setKey) {
    const provider = options.setKey.toLowerCase()

    if (!['openai', 'anthropic'].includes(provider)) {
      UI.error(`지원하지 않는 provider입니다: ${provider}`)
      UI.info('지원하는 provider: openai, anthropic')
      process.exit(1)
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(`${provider} API 키를 입력하세요: `, (apiKey) => {
      rl.close()

      if (!apiKey.trim()) {
        UI.error('API 키가 입력되지 않았습니다')
        process.exit(1)
      }

      const config = loadConfig()
      config.providers[provider as 'openai' | 'anthropic'] = { apiKey: apiKey.trim() }
      saveConfig(config)

      UI.success(`${provider} API 키가 저장되었습니다`)
    })
  } else {
    const config = loadConfig()

    UI.info('현재 설정:')
    UI.divider()

    const providers = Object.keys(config.providers)
    if (providers.length === 0) {
      console.log('  설정된 provider가 없습니다')
      console.log()
      UI.info('API 키 설정: hyunjin config --set-key <provider>')
      UI.info('환경변수 사용: OPENAI_API_KEY, ANTHROPIC_API_KEY')
    } else {
      providers.forEach((p) => {
        console.log(`  ${p}: ****설정됨****`)
      })
    }

    if (config.defaultModel) {
      console.log(`  기본 모델: ${config.defaultModel}`)
    }
  }
}
