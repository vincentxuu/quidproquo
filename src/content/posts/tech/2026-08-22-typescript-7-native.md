---
title: "TypeScript 7：Go 原生重寫讓 type check 變快，但遷移不只換掉 tsc"
date: 2026-08-22
category: tech
type: deep-dive
tags: [typescript, typescript-7, compiler, go, type-safety, developer-tools]
lang: zh-TW
tldr: "TypeScript 7 把 compiler 與 language service 原生重寫為 Go，官方與大型使用者回報約 10 倍級的改善；收益來自共享記憶體平行化，代價是舊 API 與 compiler option 必須清理。"
description: "介紹 TypeScript 7 原生 compiler 的架構、效能與相容性邊界，以及從 TypeScript 6 遷移時應採用的雙跑驗證方式。"
series:
  name: "AI 時代的技術選擇"
  order: 24
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-typescript-7-native-en)

[TypeScript 7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) 不是把既有 compiler 的熱點改寫成 native addon，而是把 compiler、project system 與 language service 重新實作成 Go 程式。TypeScript 團隊公布的整體改善約在 10 倍級。Slack 提供的實例則是 CI type check 從 7.5 分鐘降到 1.25 分鐘。這些數字不能直接套到每個 repo，但它們說明這次改版處理的是架構瓶頸，不是小幅調校。

## 為什麼要離開自我編譯的 TypeScript

TypeScript 6 以前的 compiler 以 TypeScript 寫成，再編譯成 JavaScript 跑在 Node.js。這種 self-hosting 很適合開發語言，也讓 npm 生態直接使用 compiler API。到了大型 monorepo，parse、bind、check、project loading 與 editor query 會碰到 JavaScript runtime 和單執行緒模型的限制。

TypeScript 7 的 Go 實作能使用共享記憶體與平行工作，不必把資料在 worker 之間序列化。命令列 type check 變快只是其中一面；language service 的專案載入、references 與 rename 也共用新底層。官方遙測顯示，新 language server 的失敗 command 減少超過 80%，crash 減少超過 60%。

## 型別語意延續，工具 API 不保證原封不動

原生重寫的目標是保持 TypeScript 語言與 type-checking 行為，而不是讓既有 JavaScript compiler API 相容。TypeScript 7.0 根本沒有 programmatic API，官方預計 7.1 才提供一套新的 API。一般應用只呼叫 `tsc`，遷移通常直接；會 import `typescript`、寫 language-service plugin、custom transformer、AST 工具或 build wrapper 的工具鏈，才是高風險區。

這也表示 Vue、Svelte、Astro、MDX 與 Angular template 等 embedded-language workflow，在 7.0 時點多半仍依賴 TypeScript 6。命令列 `tsc` 能升級，不代表 framework language tooling 已經跟上；兩條路要分開驗證。

TypeScript 7 也清理 TypeScript 6 已標記棄用的 compiler option。長期停在 `moduleResolution: node`、依賴 `baseUrl` 特殊行為，或用舊 target 的專案，應先依 migration diagnostics 修正設定。不要用 `skipLibCheck` 把遷移差異全部壓掉，那會同時遮住真正的 declaration incompatibility。

```bash
pnpm add -D typescript@^7
pnpm exec tsc --noEmit
```

正式版已回到標準 `typescript` package；過去 preview 使用的 `@typescript/native-preview` 不再是新專案的安裝路徑。若有工具尚未相容，可以用 npm alias 暫時並存 TypeScript 6，讓舊工具使用 `tsc6`、主要 type check 使用 TypeScript 7。

## 遷移要用雙跑找語意差，不只量時間

第一步先在目前 TypeScript 6 保留一份乾淨 baseline：compiler diagnostics、emit 檔案、declaration output 與完整時間。第二步在同一個 commit 跑 TypeScript 7，比對新增／消失的 diagnostics。第三步才量 cold run、warm run、CI 與 editor project load，避免把 cache 或機器差異算成 compiler 收益。

對 library 而言，`.d.ts` diff 比 JavaScript emit 更重要。對 monorepo 而言，project references 與 incremental build 才是主要路徑。對應用而言，`--noEmit` 後仍要讓 bundler 跑一次，因為 TypeScript 不會替你驗證所有 runtime module resolution。

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.0",
    "typescript": "npm:@typescript/typescript6@^6.0.0"
  }
}
```

並存是過渡方案，不是永久架構。它會讓 editor、CI、framework plugin 與開發者各自拿到不同 compiler，若沒有明確命令名稱與移除期限，型別錯誤會變得無法重現。

## 跟 Oxc、SWC、bundler 的關係

TypeScript 7 仍是 TypeScript 語意的權威實作，解的是 type checking、declaration emit 與 editor intelligence。Oxc、SWC、esbuild 或 Rolldown 可以更快移除 type syntax、轉換 JSX、bundle 與 minify，但通常不執行完整 type check。兩者不是二選一：常見管線是 bundler 負責產物，`tsc --noEmit` 負責型別契約。

Oxlint 的 type-aware mode 直接使用 typescript-go，顯示新的 compiler 已能成為其他工具的底層。不過越多工具共享它，升級時越要看每個 consumer 支援的 TypeScript 版本，不能只看 repo 裡 `typescript` dependency 的版本號。

## AI 時代真正改變的地方

型別一直是人類的安全網；對 coding agent，它同時是即時、結構化且可自我修正的 feedback channel。當大型 repo 的 type check 從分鐘降到秒級，就能從 PR 尾端的 CI gate 移到每次修改後的內迴圈。這比單純節省等待時間更重要：agent 能在上下文還沒漂走前看到錯誤並修正。

但速度不能替代型別品質。到處加 `any`、斷言或 `@ts-ignore`，再快的 compiler 也只會更快宣布一份被掏空的契約通過。TypeScript 7 值得升級的前提，是 repo 同時禁止這類逃生口、保留 declaration 與 runtime tests，並讓同一條 type-check command 在本機與 CI 都能重現。

## 參考資料

- [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- [A 10x Faster TypeScript](https://devblogs.microsoft.com/typescript/typescript-native-port/)
- [TypeScript 7 migration guide](https://github.com/microsoft/typescript-go/blob/main/_packages/typescript-go/MIGRATION.md)
