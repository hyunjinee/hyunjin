import { streamText, stepCountIs, type ModelMessage } from "ai"
import { parseModelString, getLanguageModel } from "../provider"
import { createTools, type ToolContext } from "../tool"
import { getSystemPrompt } from "./system-prompt"
import { UI } from "../ui"

export interface AgentOptions {
  model?: string
  files?: string[]
  cwd?: string
}

export class Agent {
  private model: ReturnType<typeof getLanguageModel>
  private tools: ReturnType<typeof createTools>
  private systemPrompt: string
  private messages: ModelMessage[] = []
  private cwd: string
  private providerId: string
  private modelId: string

  constructor(options: AgentOptions = {}) {
    this.cwd = options.cwd || process.cwd()

    const { providerId, modelId } = parseModelString(options.model)
    this.providerId = providerId
    this.modelId = modelId
    this.model = getLanguageModel(providerId, modelId)

    const toolContext: ToolContext = { cwd: this.cwd }
    this.tools = createTools(toolContext)
    this.systemPrompt = getSystemPrompt(this.cwd)

    UI.info(`모델: ${providerId}/${modelId}`)
  }

  async run(prompt: string): Promise<void> {
    const spinner = UI.thinking()

    try {
      // Add file context if provided
      let enhancedPrompt = prompt

      const result = streamText({
        model: this.model,
        system: this.systemPrompt,
        messages: [{ role: "user", content: enhancedPrompt }],
        tools: this.tools,
        stopWhen: stepCountIs(30),
        onStepFinish: (step) => {
          const toolCalls = step.toolCalls
          if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
            spinner.stop()
            for (const call of toolCalls) {
              const args = (call as any).args ? JSON.stringify((call as any).args) : "{}"
              const truncatedArgs =
                args.length > 100 ? args.slice(0, 100) + "..." : args
              UI.tool(call.toolName || "unknown", truncatedArgs)
            }
            spinner.start()
          }
        },
      })

      spinner.stop()
      console.log()

      // Stream text output
      for await (const textPart of result.textStream) {
        process.stdout.write(textPart)
      }
      console.log()
    } catch (error) {
      spinner.stop()
      if (error instanceof Error) {
        UI.error(error.message)
      }
      throw error
    }
  }

  async chat(prompt: string): Promise<void> {
    const spinner = UI.thinking()

    try {
      this.messages.push({ role: "user", content: prompt })

      const result = streamText({
        model: this.model,
        system: this.systemPrompt,
        messages: this.messages,
        tools: this.tools,
        stopWhen: stepCountIs(30),
        onStepFinish: (step) => {
          const toolCalls = step.toolCalls
          if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
            spinner.stop()
            for (const call of toolCalls) {
              const args = (call as any).args ? JSON.stringify((call as any).args) : "{}"
              const truncatedArgs =
                args.length > 100 ? args.slice(0, 100) + "..." : args
              UI.tool(call.toolName || "unknown", truncatedArgs)
            }
            spinner.start()
          }
        },
      })

      spinner.stop()
      console.log()

      // Stream text output
      let responseText = ""
      for await (const textPart of result.textStream) {
        process.stdout.write(textPart)
        responseText += textPart
      }
      console.log()

      // Add assistant response to history
      if (responseText) {
        this.messages.push({ role: "assistant", content: responseText })
      } else {
        UI.warn("응답이 없습니다")
      }
    } catch (error) {
      spinner.stop()
      if (error instanceof Error) {
        UI.error(error.message)
      }
      throw error
    }
  }

  getMessages(): ModelMessage[] {
    return [...this.messages]
  }

  clearHistory(): void {
    this.messages = []
    UI.info("대화 기록이 초기화되었습니다")
  }
}
