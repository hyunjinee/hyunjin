# @hyunjin/drizzle

Drizzle ORM database client package for PostgreSQL

## 설치

```bash
pnpm add @hyunjin/drizzle
```

## 사용법

### 1. 스키마 정의

먼저 데이터베이스 스키마를 정의하세요:

```typescript
// schema.ts
import { pgTable, serial, text, timestamp } from '@hyunjin/drizzle'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### 2. 데이터베이스 클라이언트 생성

#### 방법 1: 환경변수 사용 (권장)

```typescript
// db.ts
import { createDb } from '@hyunjin/drizzle'
import * as schema from './schema'

export const db = createDb(schema)
```

#### 방법 2: 직접 URL 지정

```typescript
import { createDrizzleClient } from '@hyunjin/drizzle'
import * as schema from './schema'

export const db = createDrizzleClient('postgresql://user:password@host:port/database', schema)
```

#### 방법 3: 스키마 없이 사용

```typescript
import { createDrizzleClient, sql } from '@hyunjin/drizzle'

const db = createDrizzleClient(process.env.DATABASE_URL!)

// Raw SQL 쿼리 사용
const result = await db.execute(sql`SELECT * FROM users`)
```

### 3. 데이터베이스 쿼리

```typescript
import { db } from './db'
import { users, posts } from './schema'
import { eq, and, desc } from '@hyunjin/drizzle'

// SELECT
const allUsers = await db.select().from(users)
const user = await db.select().from(users).where(eq(users.id, 1))

// INSERT
const newUser = await db
  .insert(users)
  .values({
    name: 'John Doe',
    email: 'john@example.com',
  })
  .returning()

// UPDATE
await db.update(users).set({ name: 'Jane Doe' }).where(eq(users.id, 1))

// DELETE
await db.delete(users).where(eq(users.id, 1))

// JOIN
const usersWithPosts = await db.select().from(users).leftJoin(posts, eq(users.id, posts.userId)).where(eq(users.id, 1))
```

## 환경변수

`.env.local` 파일에 다음 환경변수를 설정하세요:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

## Export 되는 함수들

이 패키지는 drizzle-orm과 postgres 라이브러리의 주요 함수들을 re-export 하므로,
별도로 설치하지 않고도 사용할 수 있습니다:

### 클라이언트 생성

- `createDrizzleClient` - 커스텀 DB 클라이언트 생성
- `createDb` - 환경변수 기반 DB 클라이언트 생성

### 스키마 빌더

- `pgTable`, `pgEnum`, `pgSchema`
- `serial`, `bigserial`, `integer`, `bigint`, `smallint`, `smallserial`
- `boolean`, `text`, `varchar`, `char`
- `numeric`, `real`, `doublePrecision`
- `timestamp`, `date`, `time`, `interval`
- `json`, `jsonb`, `uuid`
- `primaryKey`, `foreignKey`, `unique`, `index`, `check`

### 쿼리 빌더

- `sql`, `eq`, `and`, `or`, `not`
- `isNull`, `isNotNull`, `inArray`, `notInArray`
- `desc`, `asc`

### 타입

- `InferSelectModel` - SELECT 결과 타입 추론
- `InferInsertModel` - INSERT 데이터 타입 추론

## 타입 안전성

```typescript
import { InferSelectModel, InferInsertModel } from '@hyunjin/drizzle'
import { users } from './schema'

type User = InferSelectModel<typeof users>
type NewUser = InferInsertModel<typeof users>

const user: User = await db
  .select()
  .from(users)
  .where(eq(users.id, 1))
  .then((r) => r[0])

const newUser: NewUser = {
  name: 'John',
  email: 'john@example.com',
  // id와 createdAt은 자동 생성되므로 제외
}
```

## 마이그레이션

Drizzle Kit을 사용하여 마이그레이션을 관리할 수 있습니다:

```bash
# Drizzle Kit 설치
pnpm add -D drizzle-kit

# 마이그레이션 생성
pnpm drizzle-kit generate:pg

# 마이그레이션 실행
pnpm drizzle-kit push:pg
```
