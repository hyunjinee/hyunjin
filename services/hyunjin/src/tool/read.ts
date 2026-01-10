import * as fs from "fs/promises"
import * as path from "path"
import { z } from "zod"
import { tool } from "ai"
import type { ToolContext } from "./index"

export function readFileTool(context: ToolContext) {
  return tool({
    description:
      "Read the contents of a file. Use this to examine code, configuration files, or any text file.",
    inputSchema: z.object({
      path: z.string().describe("The file path to read (relative to current directory)"),
      offset: z.number().nullable().describe("Line number to start reading from (1-indexed)"),
      limit: z.number().nullable().describe("Maximum number of lines to read"),
    }),
    execute: async ({ path: filePath, offset, limit }) => {
      try {
        const fullPath = path.resolve(context.cwd, filePath)
        const content = await fs.readFile(fullPath, "utf-8")

        let lines = content.split("\n")

        if (offset !== undefined && offset > 0) {
          lines = lines.slice(offset - 1)
        }

        if (limit !== undefined && limit > 0) {
          lines = lines.slice(0, limit)
        }

        const startLine = offset || 1
        const numberedLines = lines.map(
          (line, i) => `${String(startLine + i).padStart(6)}|${line}`
        )

        return {
          success: true,
          path: filePath,
          content: numberedLines.join("\n"),
          totalLines: content.split("\n").length,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "파일을 읽을 수 없습니다",
        }
      }
    },
  })
}
