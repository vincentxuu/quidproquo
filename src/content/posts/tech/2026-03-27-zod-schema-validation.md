---
title: "Zod：TypeScript 的 Runtime 型別驗證"
date: 2026-03-27
type: guide
category: tech
tags: [zod, typescript, validation, schema]
lang: zh-TW
tldr: "TypeScript 的型別只存在編譯期，執行時消失。Zod 讓你在 runtime 驗證外部資料，同時推斷出 TypeScript 型別，一個 schema 兩件事都搞定。"
description: "Zod 是 TypeScript-first 的 schema 驗證函式庫，讓你用一份定義同時做 runtime 驗證和型別推斷。DaoDao 和 NobodyClimb 都用它做 API 驗證，並在 monorepo 的共用 packages 裡共享 schema。"
draft: false
---

TypeScript 很強大，但有一個根本限制：**型別只在編譯時存在，執行時完全消失**。這意味著當你的 API 回傳的資料、使用者的表單輸入、或是環境變數進來的時候，TypeScript 無法保證它們符合你定義的型別。

Zod 解決的就是這個問題。

## 什麼是 Zod

Zod 是一個 TypeScript-first 的 schema 驗證函式庫。你定義一個 schema，它同時做兩件事：

1. **Runtime 驗證**：在程式執行時檢查資料是否符合格式
2. **型別推斷**：從 schema 推斷出 TypeScript 型別，不需要另外寫 interface

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.date(),
})

// 從 schema 推斷型別
type User = z.infer<typeof UserSchema>
// 等同於：
// type User = {
//   id: string
//   name: string
//   email: string
//   createdAt: Date
// }
```

## 核心功能

**基本型別**

```typescript
z.string()
z.number()
z.boolean()
z.date()
z.undefined()
z.null()
z.any()
```

**字串驗證**

```typescript
z.string()
  .min(3, '至少 3 個字')
  .max(100, '最多 100 個字')
  .email('Email 格式錯誤')
  .url('URL 格式錯誤')
  .regex(/^[a-z]+$/, '只能小寫英文')
  .trim()
  .toLowerCase()
```

**物件和陣列**

```typescript
const PostSchema = z.object({
  title: z.string(),
  tags: z.array(z.string()).min(1).max(10),
  status: z.enum(['draft', 'published', 'archived']),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
```

**解析與驗證**

```typescript
// parse：驗證失敗拋出 ZodError
const user = UserSchema.parse(rawData)

// safeParse：驗證失敗回傳 { success: false, error }
const result = UserSchema.safeParse(rawData)
if (!result.success) {
  console.error(result.error.flatten())
  return
}
const user = result.data // 型別是 User
```

**轉換（transform）**

```typescript
const DateStringSchema = z
  .string()
  .datetime()
  .transform((str) => new Date(str))
// 輸入：string，輸出：Date
```

**Union 和 Discriminated Union**

```typescript
const NotificationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('mention'), mentionedBy: z.string() }),
  z.object({ type: z.literal('follow'), followedBy: z.string() }),
  z.object({ type: z.literal('reaction'), emoji: z.string() }),
])
```

## Monorepo 的 Schema 共用

DaoDao 和 NobodyClimb 都採用 monorepo，兩者都把 Zod schema 集中在 `packages/schemas`（或類似的共用 package）：

**DaoDao** 的 schema 定義在後端 service 層，用於 API request 驗證和 TypeScript 型別來源。前端的 OpenAPI client 自動生成型別，兩邊保持同步。

**NobodyClimb** 更進一步：`packages/schemas` 是前後端的共同資料，Hono 後端用它驗證 request body，Next.js 前端的 React Hook Form 用它做表單驗證，Mobile 端（React Native + Expo）也用同一份。一個 schema 改了，三個地方同時更新。

```typescript
// packages/schemas/src/climb.ts
export const CreateClimbRecordSchema = z.object({
  routeId: z.string().uuid(),
  grade: z.string().regex(/^[5-9]\.[0-9]{1,2}[a-d]?$/),
  style: z.enum(['lead', 'toprope', 'boulder']),
  attempts: z.number().int().min(1),
  notes: z.string().max(500).optional(),
})

export type CreateClimbRecord = z.infer<typeof CreateClimbRecordSchema>

// 後端 Hono route
app.post('/records', async (c) => {
  const result = CreateClimbRecordSchema.safeParse(await c.req.json())
  if (!result.success) return c.json({ error: result.error.flatten() }, 400)
  // result.data 是型別安全的
})

// 前端 React Hook Form
useForm<CreateClimbRecord>({ resolver: zodResolver(CreateClimbRecordSchema) })
```

## 錯誤處理

```typescript
const result = UserSchema.safeParse(rawData)
if (!result.success) {
  // flatten() 把錯誤整理成 { fieldErrors, formErrors }
  const errors = result.error.flatten()
  // { fieldErrors: { email: ['Email 格式錯誤'] }, formErrors: [] }
}
```

## 與其他方案比較

| | Zod | Yup | io-ts | TypeBox |
|---|---|---|---|---|
| TypeScript-first | ✓ | 部分 | ✓ | ✓ |
| Bundle size | 中 | 中 | 小 | 小 |
| API 直覺度 | 高 | 高 | 低 | 中 |
| Transform 支援 | ✓ | 部分 | 需手動 | 部分 |
| 生態整合 | 最廣 | 次之 | 少 | 中 |

Yup 是 Zod 最常見的對比，API 相似但 TypeScript 推斷不如 Zod 完整，且維護活躍度較低。Zod 目前是 TypeScript 生態的主流選擇。

## 取捨

**好的地方**
- 一份 schema，兩個用途（型別 + 驗證），不需要同步維護兩份定義
- `safeParse` 讓錯誤處理明確，不用 try/catch
- transform 讓資料轉換和驗證合在同一個步驟
- 與 React Hook Form、tRPC、Drizzle 等工具都有一流整合

**需要注意的地方**
- Bundle size 比 Yup 稍大（但對多數應用可接受）
- 複雜的遞迴型別需要 `z.lazy()`，定義較麻煩
- Error message 預設是英文，需要手動設定中文訊息

## 參考資料

- [Zod 官方文件](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)
- [島島技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Zod 在後端 service 層的使用
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — Monorepo 共用 schema 的實際案例
- [React Hook Form + Zod：表單處理的最佳組合](/posts/tech/2026-03-27-react-hook-form-zod-validation) — Zod 在前端表單的應用
