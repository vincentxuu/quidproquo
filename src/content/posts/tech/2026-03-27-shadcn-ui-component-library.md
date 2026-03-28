---
title: "shadcn/ui：不是套件，是複製貼上的元件原始碼"
date: 2026-03-27
category: tech
tags: [shadcn-ui, tailwindcss, react, ui]
lang: zh-TW
tldr: "shadcn/ui 不是 npm 套件，它把元件原始碼複製到你的專案，你完全擁有這些程式碼。島島用它建立 packages/ui 元件庫，讓三個 Next.js app 共用同一套 UI。"
description: "介紹 shadcn/ui 的設計哲學：copy-paste 模型而非 npm dependency、Radix UI 作為無障礙底層、TailwindCSS 樣式，以及島島如何在 monorepo 中用它建立共用元件庫。"
draft: false
---

大多數 UI 套件的模型是這樣：裝 npm 套件，import 元件，用 props 客製化，遇到套件沒有的功能就找 workaround 或等作者更新。你的彈性上限由套件的 API 決定。

shadcn/ui 的模型不同：它不是套件，它是一個 CLI 工具，把元件的原始碼複製到你的專案裡。從那一刻起，這些程式碼就是你的，你可以直接改，不需要透過 prop API，不受套件版本限制。

島島（DaoDAO）的 `packages/ui` 就是用這個模型建立的——把 shadcn/ui 的元件複製進來，視需要修改，讓三個 app（`website`、`product`、`mobile` 不含）共用。

## 它的底層是什麼

shadcn/ui 的元件建立在兩個基礎上：

**Radix UI**：提供無障礙（accessibility）的行為邏輯。Dialog 的 focus trap、Dropdown 的鍵盤導航、Tooltip 的展示邏輯——這些都由 Radix 的 headless 元件處理，不帶任何樣式。

**TailwindCSS**：提供所有視覺樣式。元件的外觀完全用 Tailwind utility class 描述。

shadcn/ui 的工作是把兩者組合成可以直接使用的元件，並提供 `class-variance-authority`（CVA）管理元件的 variant：

```tsx
// components/ui/button.tsx（複製到你專案後的程式碼）
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

這段程式碼在你的專案裡，你可以直接加 variant、改 class、加 props——不需要 fork 或 override。

## 新增元件的方式

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

每個指令把對應元件的原始碼複製到 `components/ui/`（或你設定的目錄）。之後這些檔案就是普通的 TypeScript 檔案，和你自己寫的程式碼沒有區別。

## 在 Monorepo 的用法：islands 的 packages/ui

島島的 monorepo 結構：

```
packages/
└── ui/
    ├── src/
    │   └── components/
    │       ├── button.tsx
    │       ├── dialog.tsx
    │       ├── form.tsx
    │       └── ...
    └── package.json
```

`packages/ui` 是一個獨立的 workspace package，shadcn/ui 元件複製到這裡，各個 app 透過 workspace 相依引用：

```json
// apps/product/package.json
{
  "dependencies": {
    "@daodao/ui": "workspace:*"
  }
}
```

```tsx
// apps/product/src/components/SomeFeature.tsx
import { Button } from "@daodao/ui";
```

這樣做的好處：`website` 和 `product` 兩個 app 的 UI 視覺完全一致，改一個 Button 的樣式，兩個 app 同步更新。

`packages/ui` 裡的元件也可以被客製化為業務元件：

```tsx
// packages/ui/src/components/practice-card.tsx
// 這是業務相關的元件，但同樣放在 packages/ui 給所有 app 共用
import { Card, Badge, Button } from "./";

export function PracticeCard({ practice }: { practice: Practice }) {
  return (
    <Card>
      <Badge variant={practice.isActive ? "default" : "secondary"}>
        {practice.status}
      </Badge>
      <h3>{practice.title}</h3>
      <Button variant="outline">查看進度</Button>
    </Card>
  );
}
```

## CSS Variables 的設計

shadcn/ui 的顏色系統用 CSS variables 而不是直接的 Tailwind color token，讓 theme 切換更簡單：

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

Tailwind 設定引用這些變數：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        primary: "hsl(var(--primary))",
      },
    },
  },
};
```

這樣亮/暗模式切換只需要在 root element 切換 `.dark` class，不需要動 Tailwind 設定。

## 需要注意的地方

**沒有自動更新**：元件複製進來之後，shadcn/ui 後續的改動不會自動 sync。如果 shadcn 修了某個元件的 bug，你需要手動對比或重新執行 `add` 指令覆蓋。這是 copy-paste 模型的代價。

**Tailwind 版本相依**：shadcn/ui v2 開始轉向 Tailwind v4，兩個版本的設定方式不同（CSS-first config vs JS config）。新專案建議跟著 shadcn 的最新版本走，但既有專案升級需要注意。

**不包含資料元件**：Table、DataGrid 這類需要處理大量資料的元件，shadcn/ui 提供的版本很基礎。如果需要排序、虛擬捲動、複雜的篩選，還是需要 TanStack Table 之類的專用套件。

## 整體來說

shadcn/ui 的 copy-paste 模型看起來違反直覺，但它解決了一個真實的問題：UI 套件的客製化上限。當你需要的功能不在 props API 裡，你要嘛找 workaround，要嘛 fork 整個套件，兩者都痛苦。

把原始碼拿進來，痛點消失了。代價是你要自己維護這些程式碼，包括追蹤上游的 bug fix。對多數專案來說，這個取捨是值得的。

## 參考資料

- [shadcn/ui 官方文件](https://ui.shadcn.com/)
- [Radix UI 官方文件](https://www.radix-ui.com/)
- [class-variance-authority](https://cva.style/docs)
- [Tailwind CSS 官方文件](https://tailwindcss.com/docs)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
