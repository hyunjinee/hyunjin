import { Command } from "commander"
import { runCommand } from "./cli/run"
import { chatCommand } from "./cli/chat"
import { configCommand } from "./cli/config"
import { VERSION } from "./version"
import { UI } from "./ui"

const program = new Command()

program
  .name("hyunjin")
  .description("AI-powered coding agent for terminal")
  .version(VERSION)
  .hook("preAction", () => {
    UI.logo()
  })

program
  .command("run")
  .description("Run a single prompt and exit")
  .argument("[message...]", "Message to send to the agent")
  .option("-m, --model <model>", "Model to use (e.g., openai/gpt-4o, anthropic/claude-3-5-sonnet)")
  .option("-f, --file <files...>", "Files to include in context")
  .action(runCommand)

program
  .command("chat")
  .description("Start an interactive chat session")
  .option("-m, --model <model>", "Model to use")
  .action(chatCommand)

program
  .command("config")
  .description("Configure API keys and settings")
  .option("--set-key <provider>", "Set API key for a provider")
  .action(configCommand)

// Default command (chat)
program
  .argument("[message...]", "Message to send")
  .option("-m, --model <model>", "Model to use")
  .action(async (message: string[], options) => {
    if (message.length > 0) {
      await runCommand(message, options)
    } else {
      await chatCommand(options)
    }
  })

program.parse()
