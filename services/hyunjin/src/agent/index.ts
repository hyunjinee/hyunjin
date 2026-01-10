import { generateText, stepCountIs, type CoreMessage } from "ai"
import { parseModelString, getLanguageModel } from "../provider"
import { createTools, type ToolContext } from "../tool"
import { getSystemPrompt } from "./system-prompt"
import { UI } from "../ui"
import * as fs from "fs/promises"
import * as path from "path"

export interface AgentOptions {
  model?: string
  files?: string[]
  cwd?: string
}

export class Agent {
  private model: ReturnType<typeof getLanguageModel>
  private tools: ReturnType<typeof createTools>
  private systemPrompt: string
  private messages: CoreMessage[] = []
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

      const result = await generateText({
        model: this.model,
        system: this.systemPrompt,
        messages: [{ role: "user", content: enhancedPrompt }],
        tools: this.tools,
        stopWhen: stepCountIs(20),
        onStepFinish: (step) => {
          const toolCalls = step.toolCalls
          if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
            spinner.stop()
            for (const call of toolCalls) {
              const args = call.args ? JSON.stringify(call.args) : "{}"
              const truncatedArgs =
                args.length > 100 ? args.slice(0, 100) + "..." : args
              UI.tool(call.toolName || "unknown", truncatedArgs)
            }
            spinner.start()
          }
        },
      })

      spinner.stop()

      // AI SDK 6: get text from result or last step
      let responseText = result.text || ""
      
      // If no direct text, check steps for the final text response
      if (!responseText && result.steps && result.steps.length > 0) {
        for (let i = result.steps.length - 1; i >= 0; i--) {
          const step = result.steps[i] as any
          if (step.text) {
            responseText = step.text
            break
          }
        }
      }

      if (responseText) {
        console.log()
        console.log(UI.markdown(responseText))
      }

      // Log usage if available
      if (result.usage) {
        UI.divider()
        UI.info(
          `토큰 사용량: 입력 ${result.usage.promptTokens ?? "N/A"}, 출력 ${result.usage.completionTokens ?? "N/A"}`
        )
      }
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

      const result = await generateText({
        model: this.model,
        system: this.systemPrompt,
        messages: this.messages,
        tools: this.tools,
        stopWhen: stepCountIs(20),
        onStepFinish: (step) => {
          const toolCalls = step.toolCalls
          if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
            spinner.stop()
            for (const call of toolCalls) {
              const args = call.args ? JSON.stringify(call.args) : "{}"
              const truncatedArgs =
                args.length > 100 ? args.slice(0, 100) + "..." : args
              UI.tool(call.toolName || "unknown", truncatedArgs)
            }
            spinner.start()
          }
        },
      })

      spinner.stop()

      // AI SDK 6: get text from result or last step
      let responseText = result.text || ""
      
      if (!responseText && result.steps && result.steps.length > 0) {
        for (let i = result.steps.length - 1; i >= 0; i--) {
          const step = result.steps[i]
          if (step.text) {
            responseText = step.text
            break
          }
        }
      }

      // Add assistant response to history
      if (responseText) {
        this.messages.push({ role: "assistant", content: responseText })
        console.log()
        console.log(UI.markdown(responseText))
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

  getMessages(): CoreMessage[] {
    return [...this.messages]
  }

  clearHistory(): void {
    this.messages = []
    UI.info("대화 기록이 초기화되었습니다")
  }
}
