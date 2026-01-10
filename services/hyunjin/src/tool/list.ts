import * as fs from "fs/promises"
import * as path from "path"
import { z } from "zod"
import { tool } from "ai"
import type { ToolContext } from "./index"

export function listDirectoryTool(context: ToolContext) {
  return tool({
    description:
      "List files and directories in a given path. Use this to explore project structure.",
    inputSchema: z.object({
      path: z
        .string()
        .nullable()
        .describe("Directory path to list (default: current directory)"),
      recursive: z
        .boolean()
        .nullable()
        .describe("List recursively (default: false)"),
      maxDepth: z
        .number()
        .nullable()
        .describe("Maximum depth for recursive listing (default: 2)"),
    }),
    execute: async ({ path: dirPathParam, recursive: recursiveParam, maxDepth: maxDepthParam }) => {
      const dirPath = dirPathParam ?? "."
      const recursive = recursiveParam ?? false
      const maxDepth = maxDepthParam ?? 2
      try {
        const fullPath = path.resolve(context.cwd, dirPath)
        const results: string[] = []

        const ignoreDirs = new Set([
          "node_modules",
          ".git",
          "dist",
          "build",
          ".next",
          "__pycache__",
          ".venv",
          "venv",
        ])

        async function listDir(currentPath: string, prefix: string, depth: number) {
          if (recursive && depth > maxDepth) return

          const entries = await fs.readdir(currentPath, { withFileTypes: true })

          // Sort: directories first, then files
          entries.sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1
            if (!a.isDirectory() && b.isDirectory()) return 1
            return a.name.localeCompare(b.name)
          })

          for (const entry of entries) {
            if (entry.name.startsWith(".") && entry.name !== ".env.example") continue
            if (ignoreDirs.has(entry.name)) continue

            const isDir = entry.isDirectory()
            const icon = isDir ? "📁" : "📄"
            results.push(`${prefix}${icon} ${entry.name}`)

            if (recursive && isDir && depth < maxDepth) {
              const nextPath = path.join(currentPath, entry.name)
              await listDir(nextPath, prefix + "  ", depth + 1)
            }
          }
        }

        await listDir(fullPath, "", 0)

        return {
          success: true,
          path: dirPath,
          entries: results.join("\n"),
          count: results.length,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "디렉토리를 읽을 수 없습니다",
        }
      }
    },
  })
}
