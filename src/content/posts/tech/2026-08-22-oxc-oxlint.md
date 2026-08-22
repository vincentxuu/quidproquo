---
title: "Oxc 與 Oxlint：快不只是 Rust，而是把 parser、型別與規則重新接在一起"
date: 2026-08-22
category: tech
type: deep-dive
tags: [oxc, oxlint, eslint, typescript, linting, rust]
lang: zh-TW
tldr: "Oxlint 已從高速 ESLint 補充品走到支援 type-aware lint 與 JS plugin 的獨立 linter；遷移關鍵不是 50–100 倍跑分，而是確認規則、framework file 與 plugin 相容範圍。"
description: "介紹 Oxc compiler stack 與 Oxlint 的架構、type-aware linting、ESLint 遷移策略，以及適合與不適合取代 ESLint 的情境。"
series:
  name: "AI 時代的技術選擇"
  order: 23
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-oxc-oxlint-en)

[Oxc](https://oxc.rs/) 不是單一 linter，而是一組以 Rust 實作的 JavaScript／TypeScript compiler primitives：parser、AST、resolver、transformer、minifier 與語意分析。[Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 是建立在這組底層上的 linter。官方基準是 ESLint 的 50–100 倍速度區間。真正的選型問題不是「Rust 有多快」，而是它能不能承接你目前用 ESLint 表達的規則契約。

## Oxc 是底層，Oxlint 是產品入口

把兩個名字分開很重要。一般應用團隊不會直接操作 Oxc AST；會接觸的是 `oxlint` CLI、設定檔與 editor extension。Vite、Rolldown 等工具則可以重用 Oxc 的 parser 與 transform，避免各自維護一套 JavaScript frontend。

共享底層帶來的價值不只有少一次 parse。當 resolver、scope analysis、control-flow 與型別資訊能沿同一條管線流動，規則就不必在 JavaScript plugin 裡重新拼裝半套 compiler。這也是 Oxlint 從「先跑快速規則，再讓 ESLint 收尾」逐步走向獨立 linter 的原因。

## 預設先抓 correctness，不先打風格戰

Oxlint 預設啟用高訊號的 correctness 規則，把明顯錯誤、可疑或無用程式碼先抓出來；pedantic、style、restriction 等類別再由團隊選擇。內建規則涵蓋 ESLint core、TypeScript、React、Import、Jest、Vitest、Unicorn、jsx-a11y 等常見 plugin。

```json
{
  "plugins": ["typescript", "react", "import"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "typescript/no-floating-promises": "error"
  }
}
```

這個預設適合逐步導入：先讓 CI 在幾秒內抓高信心錯誤，再決定要不要移植風格規則。若團隊真正需要的是 formatter，應看 Oxfmt 或 Prettier；linter 與 formatter 解的是不同契約。

## Type-aware linting 怎麼接 TypeScript 7

Oxlint 的一般規則在 Rust 執行；需要型別的規則則透過 `oxlint-tsgolint`，用 TypeScript 7 的 Go compiler 建立 program，再把 diagnostics 回傳給 Oxlint。官方現況支援 61 條 typescript-eslint type-aware 規則中的 59 條。啟用方式是安裝額外套件後加上 `--type-aware`；實驗性的 `--type-check` 還能把 compiler diagnostics 合併進同一個命令。

```bash
pnpm add -D oxlint oxlint-tsgolint
pnpm exec oxlint --type-aware
```

這裡有明確代價。type-aware mode 必須解析 `tsconfig` 與 dependency graph，速度不會等同 syntax-only lint；monorepo 也要先建好相依 package 的 `.d.ts`。它要求 TypeScript 7，舊的 compiler option 可能得先遷移。不要拿 syntax-only 的官方跑分推論 type-aware CI 也會快同樣倍數。

## ESLint plugin 相容已經很廣，但仍有邊界

Oxlint 除了原生內建 plugin，也能載入 ESLint v9 相容的 JavaScript plugin。官方將這條路標為 alpha。大部分 AST traversal、scope、fix 與 selector API 已有支援，但客製 parser、特殊檔案格式，以及依賴型別資訊的 JS plugin 仍有缺口。Vue、Svelte、Astro 目前主要 lint `<script>` 區塊，不代表整份 single-file component 都等價於原生 framework plugin。

因此，最安全的遷移不是一次刪掉 ESLint：先用 `@oxlint/migrate` 轉換設定，讓 Oxlint 跑已涵蓋規則，再用 `eslint-plugin-oxlint` 關掉 ESLint 內重複的部分。剩餘 plugin 跑在 ESLint，直到 coverage 與行為都驗過。

## 何時該換，何時該留

大型 monorepo、lint 已成為 CI 熱點、規則多半落在主流 plugin 範圍時，Oxlint 的回報很直接。新專案也可以用 correctness-first 設定，避免先背一整個 ESLint dependency tree。若 repo 依賴自製 parser、processor、framework template rule 或冷門 plugin，保留 ESLint 仍是合理選擇。

AI 時代再多一個判準：agent 需要快而穩定的局部回饋。`oxlint path/to/file.ts` 夠快，適合放進每次修改後的自我檢查；但規則名稱與 autofix 行為若和 repo 現況不同，速度只會讓錯誤方向更快發生。先做 shadow run，比對 diagnostics、誤報、漏報與 fix diff，再決定是否把品質閘門交出去。

## 參考資料

- [Oxlint overview](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxlint type-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware.html)
- [Oxlint built-in plugins](https://oxc.rs/docs/guide/usage/linter/plugins.html)
- [Oxlint JavaScript plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html)
