// 클라이언트 생성 함수
export { createDrizzleClient } from './drizzle-client'

// drizzle-orm 주요 함수들 re-export
export { drizzle } from 'drizzle-orm/postgres-js'
export { sql, eq, and, or, not, isNull, isNotNull, inArray, notInArray } from 'drizzle-orm'
export { desc, asc } from 'drizzle-orm'

// postgres 클라이언트 re-export
export { default as postgres } from 'postgres'

// pg-core 타입 및 스키마 빌더들 re-export
export {
  pgTable,
  pgEnum,
  pgSchema,
  serial,
  bigserial,
  integer,
  bigint,
  boolean,
  text,
  varchar,
  char,
  numeric,
  real,
  doublePrecision,
  timestamp,
  date,
  time,
  interval,
  json,
  jsonb,
  uuid,
  smallint,
  smallserial,
  primaryKey,
  foreignKey,
  unique,
  index,
  check,
} from 'drizzle-orm/pg-core'

// 타입들 re-export
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
