---
title: "React Hook Form + Zod：表單處理的最佳組合"
date: 2026-03-27
type: guide
category: tech
tags: [react-hook-form, zod, validation, forms, typescript]
lang: zh-TW
tldr: "React Hook Form 處理表單效能，Zod 定義驗證 schema，兩者搭配讓表單開發幾乎不需要寫樣板程式碼。在 monorepo 裡共用 Zod schema，前後端驗證邏輯一份就夠。"
description: "React Hook Form 與 Zod 的組合是現代 React 表單開發的最佳實踐。本文介紹為什麼選這個組合、怎麼整合、以及在 monorepo 裡共用 schema 的好處——DaoDao 和 NobodyClimb 都採用這個模式。"
draft: false
---

表單是前端最常見的需求之一，也是最容易寫爛的部分。受控元件（controlled components）、`useState` 管每個欄位、手寫驗證邏輯——這樣寫不是不行，但規模一大就變成維護噩夢。

React Hook Form + Zod 是目前最好的解法。

## 為什麼是這個組合

**React Hook Form** 解決效能問題：它用非受控元件（uncontrolled components）+ ref，每次鍵盤輸入不會觸發整個表單 re-render。原本 controlled form 在每個 keystroke 都重新 render 整個 form tree，在複雜表單裡很明顯。

**Zod** 解決驗證邏輯問題：在 TypeScript 裡同時描述型別和驗證規則，不需要寫兩份——schema 本身就是型別定義，從 schema 推斷出的型別就是驗證通過後的資料型別。

兩者透過 `@hookform/resolvers` 整合，Zod schema 直接作為 React Hook Form 的 resolver，驗證邏輯完全交給 Zod。

## 基本用法

**安裝**

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

**定義 schema 並整合**

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(8, '密碼至少 8 個字元'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    // data 已經通過 Zod 驗證，型別安全
    await login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '登入中...' : '登入'}
      </button>
    </form>
  )
}
```

**複雜驗證**

```typescript
const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, '使用者名稱至少 3 個字')
      .max(20, '使用者名稱最多 20 個字')
      .regex(/^[a-zA-Z0-9_]+$/, '只能使用英文、數字和底線'),
    password: z.string().min(8, '密碼至少 8 個字元'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密碼不一致',
    path: ['confirmPassword'],
  })
```

## Monorepo 共用 Schema

DaoDao 和 NobodyClimb 都採用 monorepo 架構，兩者都把 Zod schema 放在共用的 `packages/` 底下：

```
packages/
└── schemas/
    ├── auth.ts       # 登入、註冊 schema
    ├── user.ts       # 使用者資料 schema
    └── climb.ts      # 攀登紀錄 schema（NobodyClimb）
```

這個設計的好處是：**前端的表單驗證和後端的 API 驗證用同一份 schema**。如果 API 要求 `email` 必須是有效格式，前端的表單和後端的 validation middleware 都從同一個 `emailSchema` 推斷，不可能出現「前端通過但後端拒絕」的不一致。

```typescript
// packages/schemas/src/auth.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>
```

```typescript
// apps/web — 前端表單
import { loginSchema, LoginInput } from '@myapp/schemas'
const { register } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

// backend — 後端驗證
import { loginSchema } from '@myapp/schemas'
const result = loginSchema.safeParse(req.body)
```

## 取捨

**好的地方**
- 非受控元件讓大型表單效能明顯好過 controlled 做法
- `useWatch`、`setValue`、`trigger` 提供精細的表單控制
- 與 Zod 整合後，型別安全從 schema 到 submit handler 完整覆蓋
- DevTools 可以即時觀察表單狀態

**需要注意的地方**
- 非受控元件的概念跟一般 React 狀態不同，初學時需要適應
- 動態欄位（`useFieldArray`）有一定的學習曲線
- shadcn/ui 的 `Form` component 封裝了 React Hook Form，用起來更整齊，但多了一層抽象

## 參考資料

- [React Hook Form 官方文件](https://react-hook-form.com/)
- [Zod 官方文件](https://zod.dev/)
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers)
- [Zod：TypeScript 的 Runtime 型別驗證](/posts/tech/2026-03-27-zod-schema-validation) — Zod 完整介紹
- [島島技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao 的 Zod 使用方式
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — NobodyClimb 的共用 schema 設計
