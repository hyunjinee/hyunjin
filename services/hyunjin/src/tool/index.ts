import { readFileTool } from "./read"
import { writeFileTool } from "./write"
import { editFileTool } from "./edit"
import { bashTool } from "./bash"
import { globTool } from "./glob"
import { grepTool } from "./grep"
import { listDirectoryTool } from "./list"

export interface ToolContext {
  cwd: string
}

export function createTools(context: ToolContext) {
  return {
    read_file: readFileTool(context),
    write_file: writeFileTool(context),
    edit_file: editFileTool(context),
    bash: bashTool(context),
    glob: globTool(context),
    grep: grepTool(context),
    list_directory: listDirectoryTool(context),
  }
}

export type Tools = ReturnType<typeof createTools>
