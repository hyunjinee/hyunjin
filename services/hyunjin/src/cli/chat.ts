import * as readline from 'readline'
import { Agent } from '../agent'
import { UI } from '../ui'

interface ChatOptions {
  model?: string
}

export async function chatCommand(options: ChatOptions) {
  UI.info("대화형 세션을 시작합니다. 종료하려면 'exit' 또는 Ctrl+C를 입력하세요.")
  UI.divider()

  const agent = new Agent({
    model: options.model,
  })

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const askQuestion = () => {
    rl.question(UI.prompt(), async (input) => {
      const trimmed = input.trim()

      if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
        UI.info('세션을 종료합니다.')
        rl.close()
        process.exit(0)
      }

      if (trimmed === '') {
        askQuestion()
        return
      }

      try {
        await agent.chat(trimmed)
      } catch (error) {
        if (error instanceof Error) {
          UI.error(error.message)
        }
      }

      console.log()
      askQuestion()
    })
  }

  askQuestion()
}
