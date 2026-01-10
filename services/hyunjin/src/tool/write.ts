import * as fs from "fs/promises"
import * as path from "path"
import { z } from "zod"
import { tool } from "ai"
import type { ToolContext } from "./index"

export function writeFileTool(context: ToolContext) {
  return tool({
    description:
      "Write content to a file. Creates the file if it doesn't exist, or overwrites if it does. Creates parent directories if needed.",
    inputSchema: z.object({
      path: z.string().describe("The file path to write to (relative to current directory)"),
      content: z.string().describe("The content to write to the file"),
    }),
    execute: async ({ path: filePath, content }) => {
      try {
        const fullPath = path.resolve(context.cwd, filePath)
        const dir = path.dirname(fullPath)

        // Create parent directories if they don't exist
        await fs.mkdir(dir, { recursive: true })
        await fs.writeFile(fullPath, content, "utf-8")

        return {
          success: true,
          path: filePath,
          message: `파일이 성공적으로 작성되었습니다: ${filePath}`,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "파일을 쓸 수 없습니다",
        }
      }
    },
  })
}
