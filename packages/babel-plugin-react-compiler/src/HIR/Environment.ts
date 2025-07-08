// From https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js#LL18C1-L23C2
export function isHookName(name: string): boolean {
  return /^use[A-Z0-9]/.test(name)
}

export const DEFAULT_EXPORT = 'default'
