---
title: "Vitest：共用 Vite 設定，但不要把 component test 當成 E2E"
date: 2026-08-22
category: tech
type: deep-dive
tags: [vitest, vite, testing, typescript, browser-testing, frontend]
lang: zh-TW
tldr: "Vitest 的優勢不是 Jest API 長得熟，而是測試與應用共用 Vite 的 transform、alias 與 plugin；Browser Mode 增加真瀏覽器信心，卻仍不能取代完整 E2E。"
description: "介紹 Vitest 的 Vite-native 設計、mock 與 coverage、Browser Mode 的邊界，以及和 Jest、Playwright 的選擇方式。"
series:
  name: "AI 時代的技術選擇"
  order: 22
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-vitest-testing-framework-en)

[Vitest](https://vitest.dev/guide/) 是以 Vite 為底層的 JavaScript／TypeScript 測試框架。它提供熟悉的 `describe`、`test`、`expect` 與 mock API，但「像 Jest」不是核心價值；真正的差別是測試預設讀取 `vite.config.*`，直接沿用 alias、transform 與 framework plugin。應用怎麼解讀原始碼，測試就盡量怎麼解讀，少維護一份平行設定。

## Vite-native 解的是設定漂移

前端測試最常見的浪費，不是 assertion 寫錯，而是測試 runner 不懂應用的 module alias、CSS module、JSX transform 或虛擬模組。團隊於是在 Jest config 重建一次 bundler 世界，升級時再讓兩份設定慢慢分岔。

Vitest 把 Vite 的 module graph、transform pipeline 與 HMR 思路帶進測試。watch mode 能只重跑受變更影響的測試；workspace／projects 可把 Node、DOM 模擬環境與 Browser Mode 分成不同測試專案。這對 coding agent 很重要：快速且確定的紅綠訊號，通常比多寫一段 prompt 更能約束修改範圍。

```ts
// src/price.test.ts
import { describe, expect, test } from "vitest";
import { total } from "./price";

describe("total", () => {
  test("adds tax after subtotal", () => {
    expect(total(100, 0.05)).toBe(105);
  });
});
```

CI 應使用 `vitest run`，不要依賴互動式 watch mode。Coverage 可選 V8 或 Istanbul provider；選擇時看 instrumentation 相容性與報表需求，不要把 coverage 百分比當成行為正確的代理指標。

## Mock 很方便，也最容易測到假的系統

Vitest 支援 function、timer、module 與 global mock。API 與 Jest 接近，遷移成本通常不高；但 ESM module mock 會被 hoist，factory 執行順序也不是一般函式呼叫順序。若測試必須 mock 掉資料庫、網路、時間、router 與 framework runtime 才能通過，它證明的可能只是 mock 彼此相容。

更穩的切法是把純邏輯留在 Node 測試，把需要 DOM 的互動放進 Browser Mode 或最小 DOM 模擬，再用 Playwright 驗證跨頁流程。mock 只放在真正不可控的邊界，並至少保留一條不 mock 的整合路徑。

## Browser Mode 是 component test，不是 E2E 替身

[Vitest Browser Mode](https://vitest.dev/guide/browser/) 透過 Playwright 或 WebdriverIO provider，在真實瀏覽器執行測試。它能抓到 jsdom／happy-dom 模擬不完整造成的 false positive，例如 layout、focus、原生事件與瀏覽器 API 差異。測試仍使用 Vitest runner、mock 與 coverage，因此很適合元件和瀏覽器相依模組。

官方同時明說它不是獨立 E2E runner 的 drop-in replacement。Browser Mode 啟動瀏覽器較慢，而且測試焦點仍是單一元件或模組。登入、導頁、後端整合、跨 tab 與 production deployment 應交給 Playwright、Cypress 或 WebdriverIO 的端到端測試。

## 跟 Jest、Node test runner、Playwright 怎麼分工

已經有大型 Jest suite、客製 transformer 與 snapshot workflow 的後端專案，留在 Jest 可能最省。純 Node library 若只需要基本 assertions 與 mock，內建 `node:test` 能減少依賴。Vite 應用、共享 alias 很多的 monorepo，Vitest 通常是摩擦最小的預設。Playwright 解的是瀏覽器裡的使用者流程，不是 Vitest 的競爭者。

一個可執行的分層是：大量純函式與 domain rule 用 Vitest Node environment；關鍵元件用 Browser Mode；少量營收或權限流程用 Playwright E2E。每層都寫清楚自己要抓哪一種失敗，才不會得到三套都很慢、卻都沒驗 production 的測試。

## AI 時代的判準

Vitest 對 agent 的價值有兩層。第一層是廣泛採用與 Jest 相容語彙，模型容易產生可用範例；第二層是失敗訊號短而直接，`vitest run path/to/file` 能形成便宜的局部驗證迴圈。但 agent 也特別容易濫用 snapshot、過度 mock，或只測自己剛寫的實作細節。

因此，不要把「agent 會寫 Vitest」當成選型理由。要看的是 repo 能否提供固定測試指令、測試名稱是否描述行為、失敗輸出能否定位問題，以及 Browser Mode／E2E 邊界是否明確。工具提供迴圈，測試契約才決定迴圈會不會收斂。

## 參考資料

- [Vitest getting started](https://vitest.dev/guide/)
- [Vitest 4 announcement](https://vitest.dev/blog/vitest-4)
- [Why Browser Mode](https://vitest.dev/guide/browser/why)
