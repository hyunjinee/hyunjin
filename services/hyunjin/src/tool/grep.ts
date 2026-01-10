import { spawn } from "child_process"
import { z } from "zod"
import { tool } from "ai"
import type { ToolContext } from "./index"

export function grepTool(context: ToolContext) {
  return tool({
    description:
      "Search for text patterns in files using ripgrep (rg) or grep. Use this to find code, function definitions, imports, etc.",
    inputSchema: z.object({
      pattern: z.string().describe("The regex pattern to search for"),
      path: z
        .string()
        .nullable()
        .describe("Directory or file to search in (default: current directory)"),
      include: z
        .string()
        .nullable()
        .describe("File pattern to include (e.g., *.ts, *.tsx)"),
      caseSensitive: z
        .boolean()
        .nullable()
        .describe("Case sensitive search (default: false)"),
    }),
    execute: async ({ pattern, path: searchPath, include, caseSensitive: caseSensitiveParam }) => {
      const caseSensitive = caseSensitiveParam ?? false
      return new Promise((resolve) => {
        const targetPath = searchPath ?? "."

        // Try ripgrep first, fall back to grep
        const args: string[] = []

        // Use ripgrep if available, otherwise grep
        const useRipgrep = true // We'll try rg first

        if (useRipgrep) {
          args.push("--color=never", "--line-number", "--no-heading")
          if (!caseSensitive) args.push("-i")
          if (include) args.push("-g", include)
          args.push("--", pattern, targetPath)
        } else {
          args.push("-rn")
          if (!caseSensitive) args.push("-i")
          if (include) args.push("--include", include)
          args.push(pattern, targetPath)
        }

        let stdout = ""
        let stderr = ""

        const proc = spawn("rg", args, {
          cwd: context.cwd,
          env: process.env,
        })

        proc.stdout.on("data", (data) => {
          stdout += data.toString()
        })

        proc.stderr.on("data", (data) => {
          stderr += data.toString()
        })

        proc.on("close", (code) => {
          // ripgrep returns 1 when no matches found
          if (code === 1 && !stderr) {
            resolve({
              success: true,
              matches: [],
              message: "일치하는 결과가 없습니다",
            })
            return
          }

          if (code !== 0 && code !== 1) {
            resolve({
              success: false,
              error: stderr || "검색 중 오류가 발생했습니다",
            })
            return
          }

          const lines = stdout.trim().split("\n").filter(Boolean)
          const maxResults = 200

          resolve({
            success: true,
            matches: lines.slice(0, maxResults),
            totalCount: lines.length,
            truncated: lines.length > maxResults,
          })
        })

        proc.on("error", () => {
          // ripgrep not found, try grep
          const grepProc = spawn("grep", ["-rn", caseSensitive ? "" : "-i", pattern, targetPath].filter(Boolean), {
            cwd: context.cwd,
          })

          let grepStdout = ""
          let grepStderr = ""

          grepProc.stdout.on("data", (data) => {
            grepStdout += data.toString()
          })

          grepProc.stderr.on("data", (data) => {
            grepStderr += data.toString()
          })

          grepProc.on("close", (code) => {
            if (code === 1 && !grepStderr) {
              resolve({
                success: true,
                matches: [],
                message: "일치하는 결과가 없습니다",
              })
              return
            }

            const lines = grepStdout.trim().split("\n").filter(Boolean)

            resolve({
              success: true,
              matches: lines.slice(0, 200),
              totalCount: lines.length,
              truncated: lines.length > 200,
            })
          })
        })
      })
    },
  })
}
