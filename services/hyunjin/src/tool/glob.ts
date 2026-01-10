import { glob } from "glob"
import * as path from "path"
import { z } from "zod"
import { tool } from "ai"
import type { ToolContext } from "./index"

export function globTool(context: ToolContext) {
  return tool({
    description:
      "Find files matching a glob pattern. Use this to discover files in the project. Common patterns: **/*.ts, src/**/*.tsx, *.json",
    inputSchema: z.object({
      pattern: z.string().describe("Glob pattern to match files (e.g., **/*.ts, src/**/*.tsx)"),
      ignore: z
        .array(z.string())
        .nullable()
        .describe("Patterns to ignore (default: node_modules, .git)"),
    }),
    execute: async ({ pattern, ignore: ignoreParam }) => {
      try {
        const ignorePatterns = ignoreParam ?? ["**/node_modules/**", "**/.git/**", "**/dist/**"]

        const files = await glob(pattern, {
          cwd: context.cwd,
          ignore: ignorePatterns,
          nodir: true,
        })

        // Sort files for consistent output
        files.sort()

        // Limit results
        const maxResults = 500
        const truncated = files.length > maxResults

        return {
          success: true,
          pattern,
          files: truncated ? files.slice(0, maxResults) : files,
          totalCount: files.length,
          truncated,
          message: truncated
            ? `${maxResults}개의 결과만 표시됩니다 (전체: ${files.length}개)`
            : undefined,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "파일을 찾을 수 없습니다",
        }
      }
    },
  })
}
