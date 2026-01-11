import chalk from "chalk"
import { Marked } from "marked"
import { markedTerminal } from "marked-terminal"
import ora, { type Ora } from "ora"
import { VERSION } from "../version.js"

const marked = new Marked(markedTerminal() as any)

export namespace UI {
  export function logo() {
    console.log()
    console.log(chalk.bold.cyan("  ╦ ╦ ┬ ┬ ┬ ┬ ┌┐┌ ┌┐┌ ┌┐┌"))
    console.log(chalk.bold.cyan("  ╠═╣ └┬┘ │ │ │ │ │││ │││ │││"))
    console.log(chalk.bold.cyan("  ╩ ╩ ┴ └─┘ └─┘ ┘└┘ ┘└┘ ┘└┘"))
    console.log(chalk.dim(`  AI Coding Agent v${VERSION}`))
    console.log()
  }

  export function info(message: string) {
    console.log(chalk.blue("ℹ"), message)
  }

  export function success(message: string) {
    console.log(chalk.green("✓"), message)
  }

  export function warn(message: string) {
    console.log(chalk.yellow("⚠"), message)
  }

  export function error(message: string) {
    console.log(chalk.red("✗"), message)
  }

  export function markdown(content: string): string {
    return marked.parse(content) as string
  }

  export function tool(name: string, description: string) {
    const colors: Record<string, typeof chalk.blue> = {
      read: chalk.cyan,
      write: chalk.green,
      edit: chalk.yellow,
      bash: chalk.red,
      glob: chalk.magenta,
      grep: chalk.blue,
    }
    const color = colors[name] || chalk.gray
    console.log(color("│"), chalk.bold(name.padEnd(8)), chalk.dim(description))
  }

  export function thinking(): Ora {
    return ora({
      text: chalk.dim("Thinking..."),
      spinner: "dots",
    }).start()
  }

  export function divider() {
    console.log(chalk.dim("─".repeat(60)))
  }

  export function prompt(agent: string = "hyunjin") {
    return chalk.bold.cyan(`${agent} > `)
  }
}
