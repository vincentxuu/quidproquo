# Worker 啟動 CPU 超限（10021）診斷 — e310824b

日期：2026-10-27。範圍：唯讀調查，沒有改 repo 檔案，沒有執行任何會連到 Cloudflare 帳號的指令（只跑了 `wrangler deploy --dry-run` 和 `wrangler check startup`，兩者都在本機執行）。

## 結論

- **已證實**：這 4 篇文章不是原因。它們沒有進到 Worker bundle（打包後的 `cron-entry.js` 裡 `hand-jams` 出現 0 次）。05582cfc 到 e310824b 之間，程式碼、設定、lockfile 都沒有變動（`git diff --stat 05582cfc e310824b -- src/lib src/server src/pages src/components astro.config.mjs package.json pnpm-lock.yaml` 輸出為空）。兩次部署的 Total Upload 是 46845.00 KiB 對 46845.05 KiB。
- **已證實**：CI 的 wrangler 版本沒有變，每次 run 都是 `wrangler 4.131.2`，node 22.23.3。
- **已證實**：同樣大小的 bundle 以前就失敗過，所以這是時好時壞的問題，不是被某個 commit 推過門檻。f0c28962（run 40383926509，2026-10-26 19:20Z）的 Total Upload 是 46845.07 KiB，報同樣的 `Script startup exceeded CPU time limit`。之後 58d0cd3a、4bc0f8bd、05582cfc（兩次）的 bundle 幾乎一樣大，卻都部署成功。
- **已證實**：bundle 是單一個 48 MB 的 JS 模組。`scripts/create-cron-entry.mjs:228-229` 把 `main` 改成 `../cron-entry.js`，並設 `no_bundle = false`，所以 wrangler 會再用 esbuild 把 `dist/server` 底下全部 1020 個 chunk 打包成一個檔。原本 198 個 `import()` 動態載入點都被內嵌成 `__esm` 初始化函式（共 1099 個），結果每次啟動都得把整整 48 MB 的程式碼 parse 一遍。
- **推測**：根因是啟動時間本來就離上限不遠，加上 Cloudflare 端每次量到的數字會浮動。上限是 parse 加頂層執行合計 1 秒（官方 limits 文件，2026-10-12 版）。CI 有印出數字的幾次 run，「Worker Startup Time」介於 326 ms（10-25）和 461–494 ms（10-26）之間，bundle 大小卻幾乎一樣，可見 Cloudflare 端的量測差異很大。驗證時偶爾會超過 1 秒。我無法取得 Cloudflare 驗證機實際量到的數字，所以這點沒有直接證據。

## 1. 啟動時做的重工作（依本機 CPU profile）

量測方式：`wrangler deploy --dry-run --outfile` 加上 `wrangler check startup --worker`，跑 3 次。用的是本機 `dist/`（10-27 22:26 build），它和 origin/main 的 e310824b 不完全相同，但 bundle 大小相近（48.07 MB 對 CI 的 47.97 MB）。

| 項目 | 本機耗時 | 位置 |
|---|---|---|
| Parse/compile 48 MB 單一模組 | 約 235 ms（`vm.SourceTextModule` 量 3 次：238/236/235；profile 中的「idle」約 216–231 ms） | 整個 bundle |
| 頂層 JS 執行合計 | 約 83 ms | — |
| 其中 opencc 繁簡字典 trie 建構 | **約 39 ms**（頂層執行時間的一半） | `src/lib/retrieval/language.ts:3` `const toTaiwanTraditional = Converter({ from: 'cn', to: 'twp' })`，經 `api/chat.ts`、`conversation/engines/agent/query.ts`、`server/agent-flow-workflow.ts` 靜態載入 |
| agent kernel / register-defaults 初始化 | 約 13.5 ms | entry.mjs 靜態 import `kernel_*.mjs`、`register-defaults_*.mjs` |
| console chunk 初始化 | 約 10.5 ms | `console_*.mjs`（303 KB） |
| GC | 約 30–33 ms | 大量字典 Map 與 parse 產生的配置 |
| Astro manifest、route 排序 | 約 3 ms | `entrypoints_*.mjs`（routeComparator） |

本機總計約 330–360 ms。Cloudflare 驗證機比較慢，負載也有起伏，所以實際數字會更高。

Bundle 組成（從 `cron-entry.js` 的 region 註解加總，共 47.9 MB）：Astro manifest/entrypoints 3.0 MB、AdminSessionChat 2.6 MB、workers-ai-models 2.1 MB、**opencc-js 2.1 MB**、langchain model 1.8 MB，其餘大宗是 **shiki 語法檔**（emacs-lisp、cpp、wasm、wolfram、tsx、jsx 等數十種，有些還重複兩份）和 **mermaid/cytoscape**（cytoscape 1.1 MB、architectureDiagram、swimlanes……）。這些來自 SSR 的 React 元件 `src/components/ai-elements/message.tsx:15-31`（streamdown、`@streamdown/code`、`@streamdown/mermaid`）和 `src/components/ai-elements/code-block.tsx:29-30`（`createHighlighter from "shiki"`）。dist/server 在 Astro 層的靜態相依閉包只有 5.3 MB；多出來的 40 MB 都是被 esbuild 內嵌進來的動態 chunk。

## 2. 05582cfc 和 e310824b 的差異

| Run | Commit | wrangler | Total Upload | Startup Time | 結果 |
|---|---|---|---|---|---|
| 40522398442 第 1、2 次 | e310824b | 4.131.2 | 46845.05 KiB | — | 10021 |
| 40400333473 / 40398706605 | 05582cfc | 4.131.2 | 46845.00 / 46844.99 KiB | 未印出 | Worker 部署成功 |
| 40389326581 | 4bc0f8bd | 4.131.2 | 46845.34 KiB | 未印出 | 成功 |
| 40387999623 | 58d0cd3a | 4.131.2 | 46845.12 KiB | 461 ms | Worker 部署成功 |
| 40383926509 | f0c28962 | 4.131.2 | 46845.07 KiB | — | **10021** |
| 40381822775 | c39d5a32 | 4.131.2 | 46845.04 KiB | 494 ms | Worker 部署成功 |
| 10-25 7377b7bf / b560b77c | — | — | 46841.03 KiB | 326 / 334 ms | 成功 |
| 10-24 7c9a55d6 | — | — | 46833.63 KiB | 361 ms | 成功 |

結論：bundle 大小從 10-24 起就穩定在 46.8 MB 左右，差異小於 12 KiB，頂層程式碼也沒變。啟動時間的波動（326 到 494 ms，以及偶發超過 1 s）來自 Cloudflare 端，不是 commit 內容造成的。

## 3. 修法選項（由小到大，都可以回退）

**A. 把 opencc Converter 改成 lazy 初始化（最小改動）**
`src/lib/retrieval/language.ts:3` 改成第一次呼叫 `normalizeAnswerLanguage` 時才建 converter，並用模組層變數 memoize。
- 效果：頂層執行少約 39 ms，外加相應的 GC（約占本機頂層 JS 的一半）。
- 風險：很低，只動一個檔案。第一個 zh-TW 聊天請求會多約 40 ms CPU。
- 限制：48 MB 的 parse（約 235 ms 以上）還在，安全邊際只略為增加，偶發失敗仍可能發生。

**B. 讓 SSR bundle 不要帶 shiki 全語言和 mermaid**
例如 `ai-elements/message.tsx` 和 `code-block.tsx` 在 server 端不載入 `@streamdown/code`、`@streamdown/mermaid`、shiki，可以用 `client:only` 渲染聊天元件，或在 SSR 時改用 dynamic import 並判斷 `import.meta.env.SSR`。也可以把 shiki 改成 fine-grained bundle，只留常用語言。
- 效果：預估可少掉 15–25 MB 的 parse。這是**推測**，依據是上面 bundle 組成中 shiki 語法檔和 mermaid 的大小加總，還沒有實際 build 驗證。
- 風險：中等。admin/chat 頁面的 SSR 首屏會少掉程式碼高亮（改由 client 補上），需要跑視覺回歸。屬於 UI 改動。

**C. 不要讓 wrangler 把所有動態 chunk 再打包成單一模組**
這是根本解：讓 `dist/server/chunks/*.mjs` 以獨立模組上傳，啟動時只 parse 靜態閉包（約 5.3 MB）。做法可以是讓 `create-cron-entry.mjs` 不再 import `../src/*.ts`（這些來源檔需要 esbuild 處理 TS），改成 Astro build 時一起輸出，再對 dist/server 用 `no_bundle: true` 加 ESModule rules。或者試 `find_additional_modules`：我在 scratchpad 用 `find_additional_modules: true` 和 `base_dir: dist` 做 dry-run，結果仍然是 48 MB 單檔（動態 import 依然被內嵌），所以這條路要另外處理，**沒驗證成功**。
- 效果：最大。parse 量可以降約 85%，但前提是 workerd 對沒被 import 的模組延遲編譯，這點是**推測**。
- 風險：屬於中到高，而且是 Tier 2。它會改到 build/deploy 管線（`scripts/create-cron-entry.mjs`），cron、queue、DO、Workflow 的 export 都要重新驗證，部署前一定要先跑 `wrangler check startup` 和 versions upload 預覽。

建議：短期先做 A，能立刻增加邊際、風險最低，必要時重跑 deploy 也可能就過。中期做 B 或 C，把 bundle 降到 20 MB 以下。另外可以在 CI 的 deploy 前加一步 `wrangler check startup`，或記錄 `Worker Startup Time` 的趨勢，避免下次又在門檻邊緣才發現。

## 附註

- 量測腳本和 profile 都在本 scratchpad：`graph.mjs`、`prof.mjs`、`incl.mjs`、`parse.mjs`、`startup{1,2,3}.cpuprofile`、`dry/cron-entry.js`、`worker.bundle`。
- `dry-split/`（約 2.6 GB，find_additional_modules 實驗的 dry-run 輸出）因為 rm 指令被權限拒絕，還留在 scratchpad，可以手動刪除。
- 本機 HEAD（83412bda）和 origin/main（e310824b）已經分岔，本機 working tree 也有未 commit 的改動，所以本機 profile 只能看相對比例；絕對大小以 CI log 為準。
