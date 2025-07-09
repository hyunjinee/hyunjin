import { z } from 'zod'

const HookSchema = z.object({
  noAlias: z.boolean().default(false),
})

export const EnvironmentConfigSchema = z.object({
  customHooks: z.map(z.string(), HookSchema).default(new Map()),
})

// From https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#LL18C1-L23C2
export function isHookName(name: string): boolean {
  return /^use[A-Z0-9]/.test(name)
}

export const DEFAULT_EXPORT = 'default'
