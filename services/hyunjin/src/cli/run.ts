import { Agent } from '../agent'
import { UI } from '../ui'

interface RunOptions {
  model?: string
  file?: string[]
}

export async function runCommand(message: string[], options: RunOptions) {
  const prompt = message.join(' ')

  if (!prompt.trim()) {
    UI.error('메시지를 입력해주세요')
    process.exit(1)
  }

  try {
    const agent = new Agent({
      model: options.model,
      files: options.file,
    })

    await agent.run(prompt)
  } catch (error) {
    if (error instanceof Error) {
      UI.error(error.message)
    }
    process.exit(1)
  }
}
