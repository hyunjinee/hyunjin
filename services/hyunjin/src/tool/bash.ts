import { spawn } from "child_process"
import { z } from "zod"
import { tool } from "ai"
import type { ToolContext } from "./index"

export function bashTool(context: ToolContext) {
  return tool({
    description:
      "Execute a bash command. Use this for running scripts, installing packages, git operations, etc. Be careful with destructive commands.",
    inputSchema: z.object({
      command: z.string().describe("The bash command to execute"),
      timeout: z
        .number()
        .nullable()
        .describe("Timeout in milliseconds (default: 30000)"),
    }),
    execute: async ({ command, timeout: timeoutParam }) => {
      const timeout = timeoutParam ?? 30000
      return new Promise((resolve) => {
        let stdout = ""
        let stderr = ""

        const proc = spawn("bash", ["-c", command], {
          cwd: context.cwd,
          env: process.env,
        })

        const timer = setTimeout(() => {
          proc.kill("SIGTERM")
          resolve({
            success: false,
            error: `명령어 실행 시간 초과 (${timeout}ms)`,
            stdout,
            stderr,
          })
        }, timeout)

        proc.stdout.on("data", (data) => {
          stdout += data.toString()
        })

        proc.stderr.on("data", (data) => {
          stderr += data.toString()
        })

        proc.on("close", (code) => {
          clearTimeout(timer)

          // Truncate output if too long
          const maxLength = 50000
          if (stdout.length > maxLength) {
            stdout = stdout.slice(0, maxLength) + "\n... (출력이 잘렸습니다)"
          }
          if (stderr.length > maxLength) {
            stderr = stderr.slice(0, maxLength) + "\n... (출력이 잘렸습니다)"
          }

          resolve({
            success: code === 0,
            exitCode: code,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
          })
        })

        proc.on("error", (error) => {
          clearTimeout(timer)
          resolve({
            success: false,
            error: error.message,
          })
        })
      })
    },
  })
}
