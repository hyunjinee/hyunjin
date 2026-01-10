import * as fs from "fs/promises"
import * as path from "path"
import { z } from "zod"
import { tool } from "ai"
import type { ToolContext } from "./index"

export function editFileTool(context: ToolContext) {
  return tool({
    description:
      "Edit a file by replacing specific text. The old_string must match exactly (including whitespace and indentation).",
    inputSchema: z.object({
      path: z.string().describe("The file path to edit (relative to current directory)"),
      old_string: z.string().describe("The exact text to replace (must match exactly)"),
      new_string: z.string().describe("The new text to replace with"),
    }),
    execute: async ({ path: filePath, old_string, new_string }) => {
      try {
        const fullPath = path.resolve(context.cwd, filePath)
        const content = await fs.readFile(fullPath, "utf-8")

        if (!content.includes(old_string)) {
          return {
            success: false,
            error: "지정된 텍스트를 파일에서 찾을 수 없습니다. 정확한 텍스트인지 확인해주세요.",
          }
        }

        const occurrences = content.split(old_string).length - 1
        if (occurrences > 1) {
          return {
            success: false,
            error: `${occurrences}개의 일치하는 텍스트가 발견되었습니다. 더 구체적인 컨텍스트를 포함해주세요.`,
          }
        }

        const newContent = content.replace(old_string, new_string)
        await fs.writeFile(fullPath, newContent, "utf-8")

        return {
          success: true,
          path: filePath,
          message: "파일이 성공적으로 수정되었습니다",
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "파일을 수정할 수 없습니다",
        }
      }
    },
  })
}
