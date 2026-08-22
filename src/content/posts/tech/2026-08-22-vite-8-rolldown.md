---
title: "Vite 8 與 Rolldown：前端建置從雙引擎走向同一條管線"
date: 2026-08-22
category: tech
type: deep-dive
tags: [vite, rolldown, oxc, frontend, build-tools, typescript]
lang: zh-TW
tldr: "Vite 8 把開發期的 esbuild 與正式建置的 Rollup 收斂成 Rolldown；速度是結果，真正重要的是開發與 production 不再由兩套 bundler 語意拼接。"
description: "介紹 Vite 8 改用 Rolldown 的架構理由、遷移方式、相容邊界，以及它對前端團隊與 coding agent 的實際意義。"
series:
  name: "AI 時代的技術選擇"
  order: 21
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-vite-8-rolldown-en)

[Vite 8](https://vite.dev/blog/announcing-vite8) 是 Vite 自 2.0 之後最大的一次底層改造。開發期依賴預先打包、TypeScript／JSX 轉換與正式建置，不再分別交給 esbuild 和 Rollup，而是收斂到以 Rust 寫成的 [Rolldown](https://rolldown.rs/) 與 Oxc 工具鏈。官方公布的 Rollup 對照基準最高可到 10–30 倍，但這次改版最值得關心的不是單一跑分，而是兩套 bundler 語意終於變成一套。

## Vite 原本為什麼需要兩個引擎

Vite 的早期設計很務實。開發伺服器要快，所以用 esbuild 做 dependency pre-bundling 與語法轉換；正式建置需要成熟的 chunk、tree-shaking 與 plugin 生態，所以交給 Rollup。這讓小專案有幾乎立即可用的開發體驗，也保住 Rollup plugin 的相容性。

代價是同一份程式碼走兩條路：開發時看起來正常，正式建置才因 module resolution、CommonJS interop 或 plugin hook 差異出錯。Vite 必須維護大量轉接邏輯，plugin 作者也得記得某個 hook 只在 build 階段發生。當 coding agent 只能從錯誤訊息反推上下文時，這類「dev 綠、build 紅」尤其昂貴。

Rolldown 的方向不是把 Rollup API 丟掉重來，而是保留 Vite／Rollup plugin 模型，換成原生執行的實作。Vite 8 因此能讓 dependency optimization 與 production bundling 共用同一個核心；Oxc 則負責 parser、transform 與 minify 等編譯工作。

## 速度之外，統一管線改變了什麼

第一個改變是錯誤更早出現。開發與建置共用更多解析規則後，環境差異縮小；agent 在本機驗證得到的訊號也更接近 CI。第二個改變是設定面積縮小。Vite 8 仍會自動轉換一部分舊的 `esbuild` 與 `rollupOptions` 設定，但新專案應直接用 Rolldown 對應選項，避免把相容層當永久 API。

第三個改變是 Vite 開始像一條完整工具鏈，而不只是開發伺服器。Vite 8 的 React plugin 預設以 Oxc 執行 React Refresh transform，不再把 Babel 當必要依賴；實驗性的 full bundle mode 也建立在同一個 bundler 上。這不代表每個 Babel plugin 都消失，而是預設路徑少了一層通用編譯器。

```ts
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    forwardConsole: true,
  },
});
```

`resolve.tsconfigPaths` 會付出少量解析成本，所以不是預設開啟；`server.forwardConsole` 則能把瀏覽器 console 送回終端。後者對 CLI coding agent 很實用：runtime error 不必等人打開 DevTools 才看見。

## 升級不要只改版本號

Vite 官方建議大型專案採兩段式遷移：先在 Vite 7 把 `vite` alias 到 `rolldown-vite`，隔離 Rolldown 相容問題；確認 plugin、SSR 與產物無誤後，再升 Vite 8。小型專案可以直接升，但仍應檢查 Node.js 版本、已棄用的 `optimizeDeps.esbuildOptions`，以及客製 Rollup plugin 有沒有依賴未公開行為。Vite 8 要求 Node.js 20.19+ 或 22.12+。

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2"
  }
}
```

這個中繼步驟的價值是可歸因：一旦結果不同，你知道是 bundler 更換，不是 Vite 8 其他 breaking changes。驗證也不能只跑 dev server；至少比較 production build、SSR、動態 import、chunk 名稱與既有 plugin 的輸出。

## 跟 webpack、Rspack、直接用 Rolldown 怎麼選

已有龐大 webpack loader／plugin 資產的系統，不應只為速度改用 Vite；Rspack 通常是較短的相容路徑。需要自行控制 bundling pipeline、但不需要 Vite dev server 與 framework 整合時，可以直接用 Rolldown。一般 React、Vue、Svelte 或 Astro 應用則仍以 Vite 為入口，因為框架 plugin、HMR、SSR 與環境 API 才是它提供的產品邊界。

Vite 8 適合的不是「想追最新工具」的團隊，而是願意把 build 當成可驗證契約的團隊。升級前後留下 bundle snapshot、關鍵頁 smoke test 與效能基線，才有辦法分辨原生工具鏈帶來的是實際收益，還是只有漂亮的官方數字。

## 參考資料

- [Vite 8.0 is out](https://vite.dev/blog/announcing-vite8)
- [Vite 8 migration guide](https://vite.dev/guide/migration.html)
- [Rolldown documentation](https://rolldown.rs/)
