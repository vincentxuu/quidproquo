---
title: "TailwindCSS：utility-first 不只是風格偏好，是一種 CSS 管理策略"
date: 2026-03-27
type: guide
category: tech
tags: [tailwindcss, css, utility-first, frontend]
lang: zh-TW
tldr: "TailwindCSS 解決的核心問題是 CSS 的全域命名汙染和死碼問題。utility class 讓樣式跟元件放在一起，build 時自動移除沒用到的 class，生產環境的 CSS bundle 通常只有幾十 KB。島島和 NobodyClimb 都用它做 web 端樣式。"
description: "TailwindCSS 的設計哲學、為什麼 utility-first 是一種 CSS 架構決策而不只是寫法偏好，以及在 React 生態中如何實際使用。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-27-tailwindcss-utility-first-css-en)

CSS 有一個根本問題：它的作用域是全域的。你寫 `.button { color: blue }` ，這個規則影響所有帶有 `button` class 的元素。解法出現過很多：BEM 命名規範、CSS Modules、CSS-in-JS——每一種都在嘗試解決「怎麼讓 CSS 的範圍可控」這個問題。

TailwindCSS 選擇了另一條路：不用語義化 class，直接用描述視覺效果的 utility class。樣式和元件放在一起，沒有命名問題，也不用擔心改一個 class 影響其他地方。

島島（DaoDao）的 `packages/ui` 和兩個 Next.js app，以及 NobodyClimb 的 Next.js web 端，都用 TailwindCSS 做樣式。

## 核心概念

Utility-first 的意思是：與其寫 `.card { padding: 16px; border-radius: 8px; background: white }`，你直接在 HTML/JSX 裡用已有的 utility class：

```tsx
// 傳統 CSS 方式
<div className="card">
  <h2 className="card-title">標題</h2>
</div>

// Tailwind 方式
<div className="p-4 rounded-lg bg-white shadow-sm border border-gray-200">
  <h2 className="text-xl font-bold text-gray-900">標題</h2>
</div>
```

第一眼看 Tailwind 的寫法，很多人的反應是「這跟 inline style 有什麼差」。差別在幾個地方：

**設計系統約束**：Tailwind 的 spacing scale（`p-1` = 4px, `p-2` = 8px, `p-4` = 16px...）、color palette、font size 是預先定義好的，你只能從這個系統裡選，不容易寫出 `padding: 13px` 這種破壞一致性的值。

**Responsive 和狀態**：`md:flex`、`hover:bg-blue-600`、`dark:text-white` 這類修飾符直接加在 class 上，不需要寫 media query 或 pseudo-class：

```tsx
<button className="
  bg-blue-500 text-white px-4 py-2 rounded
  hover:bg-blue-600
  focus:outline-none focus:ring-2 focus:ring-blue-500
  dark:bg-blue-400
  md:px-6
">
  送出
</button>
```

**Build-time purge**：Tailwind v3+ 預設只輸出你實際用到的 class，生產環境的 CSS 通常只有 5-20 KB，不管你的 Tailwind 設定有多少 token。

## 實際的使用模式

在 React 元件裡，重複的 class 組合用變數或函式抽出：

```tsx
import { cn } from "@/lib/utils"; // clsx + tailwind-merge 的包裝

// 基本用法
function Card({ className, children }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}

// 有 variant 的元件
function Badge({ variant = "default", children }: BadgeProps) {
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span className={cn("rounded-full px-2 py-1 text-xs font-medium", variantClasses[variant])}>
      {children}
    </span>
  );
}
```

`cn` 函式（通常是 `clsx` + `tailwind-merge` 組合）解決兩個問題：一是條件式 class 的組合，二是 class 衝突（例如 `p-4` 和 `p-2` 同時存在時，merge 確保後者勝出）：

```tsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 設定客製化

`tailwind.config.js`（或 Tailwind v4 的 CSS config）讓你擴充或覆蓋設計系統：

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
};
```

擴充後就可以用 `text-brand-500`、`font-sans`、`rounded-2xl` 這些自訂 token。

## Tailwind v4 的變化

Tailwind v4（2025 年發布）把設定從 JS 移到 CSS：

```css
/* app.css */
@import "tailwindcss";

@theme {
  --color-brand: #3b82f6;
  --font-sans: "Inter", sans-serif;
}
```

不再需要 `tailwind.config.js`，設定放在 CSS 檔案裡，更接近 CSS 原生的設計理念。shadcn/ui 的最新版本也跟著遷移到 v4。

## 需要注意的地方

**Class 順序問題**：`hover:bg-blue-500 bg-blue-600` 和 `bg-blue-600 hover:bg-blue-500` 在 Tailwind 的輸出裡結果一樣，但如果你同時有 `p-4` 和 `p-2` 在不同條件下，不用 `tailwind-merge` 的話，哪個生效取決於 CSS 的 class 順序，而不是 JSX 裡的順序。

**Linter 的 class 排序**：class 一多，順序各自為政會讓程式碼難讀。`prettier-plugin-tailwindcss` 可以自動排序，讓同樣語義的 class 總是在同一個位置。

**語義化 class 缺失**：Tailwind 的 class 名稱是視覺描述（`text-blue-500`），不是語義（`text-primary`）。如果設計系統改了主色，你需要找遍所有 `text-blue-500` 替換，除非你用 CSS variables 包一層（shadcn/ui 的做法）。

**HTML 的可讀性**：元件帶十幾個 class 是常態，對初次看程式碼的人不友善。解法是把相關的 class 抽成元件，而不是把所有樣式堆在同一個 JSX 元素上。

## 整體來說

TailwindCSS 的爭議通常集中在「class 太多、太醜」這個點，但這其實是次要問題。主要問題是：CSS 的全域命名和死碼，Tailwind 都解了。

在 React 生態裡，Tailwind 和元件化思維是天生搭配——每個元件管自己的 class，沒有全域衝突，build 時自動 tree-shake，設計系統的約束讓視覺一致性可控。

如果你在一個 React 專案裡還在用傳統 CSS class，值得認真考慮遷移。

## 參考資料

- [TailwindCSS 官方文件](https://tailwindcss.com/docs)
- [TailwindCSS v4 升級指南](https://tailwindcss.com/docs/upgrade-guide)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [clsx](https://github.com/lukeed/clsx)
- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
