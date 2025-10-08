import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export function createDrizzleClient<TSchema extends Record<string, unknown> = Record<string, never>>(
  databaseUrl: string,
  schema: TSchema,
) {
  const client = postgres(databaseUrl)

  return drizzle(client, { schema })
}
