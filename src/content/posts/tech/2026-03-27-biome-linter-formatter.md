---
title: "Biome：用 Rust 取代 ESLint + Prettier"
date: 2026-03-27
type: guide
category: tech
tags: [biome, linter, formatter, rust, dx]
lang: zh-TW
tldr: "Biome 一個工具做 ESLint + Prettier 兩個工具的事，速度快 10-20 倍，設定簡單很多。DaoDao 在整個 monorepo 用它，lint + format 一次過。"
description: "Biome 是用 Rust 寫的 JavaScript/TypeScript linter 和 formatter，取代 ESLint + Prettier 的組合。本文介紹它的速度優勢、monorepo 效益、設定方式，以及目前的限制。DaoDao 的 monorepo 架構就是靠它統一 lint 和 format。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-27-biome-linter-formatter-en)

前端工具鏈有一個老問題：ESLint 負責 linting，Prettier 負責 formatting，兩個工具各有設定、各有 plugin、偶爾還會互相衝突。在 monorepo 裡，三個 app 各跑一次，時間更長。

Biome 一個工具解決兩個問題，而且快很多。

## 什麼是 Biome

Biome 是用 Rust 寫的 JavaScript/TypeScript/JSX/TSX 的 linter 和 formatter，前身是 Rome Tools。它的定位是「一個工具，取代 ESLint + Prettier」。

不是說它只是包了兩個工具——它是從頭重寫的，parser、linter、formatter 都是 Rust native，所以快。

## 速度差距

DaoDao 的文章裡提到：Biome 比 ESLint + Prettier 的組合快 **10-20 倍**。

這不是誇大。Rust 的記憶體管理和並行處理讓 Biome 在掃描大量檔案時不會像 Node.js 那樣有 GC 壓力。ESLint 跑 100 個檔案可能要 8-10 秒，Biome 可以在不到 1 秒完成。

在 monorepo 裡效果更明顯：原本需要對 `apps/website`、`apps/product`、`apps/mobile` 分別跑 ESLint，現在一個 `biome check` 從 monorepo root 掃完全部。

## 安裝與設定

```bash
pnpm add -D @biomejs/biome
pnpm biome init
```

生成的 `biome.json`：

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "warn"
      },
      "style": {
        "useConst": "error",
        "noUnusedTemplateLiteral": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  },
  "files": {
    "ignore": ["node_modules", ".next", "dist", "build"]
  }
}
```

**常用指令**

```bash
# 檢查（lint + format check）
pnpm biome check .

# 自動修復
pnpm biome check --write .

# 只 format
pnpm biome format --write .

# 只 lint
pnpm biome lint .
```

## Monorepo 設定

Monorepo 的優點是可以在 root 放一個 `biome.json`，所有 workspace 共用同一套規則。如果某個 app 需要特殊設定，可以在該 app 目錄放一個 `biome.json` 覆蓋部分設定：

```json
// apps/mobile/biome.json
{
  "extends": ["../../biome.json"],
  "linter": {
    "rules": {
      "suspicious": {
        "noConsoleLog": "off"
      }
    }
  }
}
```

DaoDao 的 Turborepo pipeline 裡，`lint` task 直接跑 `biome check`，整個 monorepo 一個指令完成，不需要對每個 app 個別設定。

## 與 ESLint + Prettier 比較

| | Biome | ESLint + Prettier |
|---|---|---|
| 速度 | 快 10-20x | 基準 |
| 設定複雜度 | 單一 biome.json | eslint.config.js + .prettierrc + 可能有衝突 |
| Plugin 生態 | 持續增長但不如 ESLint | 極豐富 |
| IDE 整合 | VS Code extension 官方支援 | 成熟 |
| 型別感知 lint | 部分支援（實驗性） | ESLint TypeScript 支援完整 |

## 目前的限制

Biome 不是完美的，有幾個地方需要評估：

**Plugin 生態不完整**：ESLint 有數千個 plugin，Biome 的 rule 集合雖然持續增長，但還沒有完全覆蓋。如果你的專案依賴特定的 ESLint plugin（例如 `eslint-plugin-security`、`eslint-plugin-testing-library`），Biome 可能沒有對應的 rule。

**型別感知 lint**：ESLint 的 TypeScript 規則可以做型別感知分析（例如 `no-floating-promises`），Biome 目前還在實驗階段。

**規則的精細度**：部分 ESLint 規則的設定選項比 Biome 豐富，如果你有特殊的 lint 需求，可能需要取捨。

對多數專案（尤其是重視開發速度和簡單設定的團隊），這些限制不是問題。DaoDao 就是直接採用 Biome 的最佳例子——他們的需求 Biome 完全覆蓋，換來的速度提升很值得。

## 遷移從 ESLint + Prettier

```bash
# Biome 提供遷移工具
pnpm biome migrate eslint --write
pnpm biome migrate prettier --write
```

遷移工具會讀取現有的 `.eslintrc` 和 `.prettierrc` 並轉換成 `biome.json`，不是 100% 完整轉換，但可以省去大部分手動設定的工作。

## 取捨總結

**選 Biome 的情境**
- 新專案，不依賴特殊 ESLint plugin
- Monorepo，想統一工具鏈減少維護成本
- 團隊對 lint 速度有要求，CI 時間想壓下來

**繼續用 ESLint 的情境**
- 現有專案有大量自訂 ESLint rule
- 需要型別感知 lint（`@typescript-eslint` 的高級規則）
- 依賴特定生態的 plugin（accessibility、security、testing）

## 參考資料

- [Biome 官方文件 — JavaScript/TypeScript Linter 與 Formatter 設定指南](https://biomejs.dev/)
- [Biome GitHub — Rust 原生 ESLint + Prettier 替代工具](https://github.com/biomejs/biome)
- [Biome 遷移指南 — 從 ESLint + Prettier 移轉到 Biome](https://biomejs.dev/guides/migrate-eslint-prettier/)
- [島島技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDao monorepo 採用 Biome 的實際案例與速度評估
