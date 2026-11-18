# 審稿紀錄：2026-11-18-cdp-vs-playwright-driver（AI 瀏覽器自動化 order 16，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-9-16.md）。2 ❌、9 🟡，全部處理：
- ❌「Playwright 處理好大約一半」掛錯清單：原文指十種分頁當掉方式 → 移到當機段，代價段改「原本替你處理掉的當機情況」。
- ❌ 把 v4 blog 的論點當成 Stagehand 離開 Playwright 的理由 → 補讀 Browserbase 2025-10〈Why we're graduating from Playwright〉全文，改寫成 v3 三個理由（等待延遲、frame 層級 CDP 控制、長時間記憶體與回歸）＋v4 再搬進 extension，tldr 同步。
- 🟡「每一步 thousands of CDP calls」去掉「每一步」；pipe 明寫是對 Browser Use「network hop／websocket」說法的更正；connectOverCDP 改成「連託管瀏覽器時的限制」並移到遠端段；Firefox 141 改「移除實驗性 CDP 實作、主推 BiDi」；Midscene 補可接 Puppeteer；圖下排改標 STAGEHAND V3、caption 註明 v4 的 extension；CDP「透過 WebSocket」改成不指定傳輸；維護者原話改「溝通、重試和周邊邏輯」；Castle 補「仍有其他訊號」。

## post-review

獨立 subagent 編輯審稿（review-9-16.md #15–33）。處理：
- 必修全採納：#15、#16、#17（同上）；#18 標題改「Browser Use、Stagehand 拆掉 Playwright 的理由與代價」；#19 圖；#20 補 TypeScript 版 client/server 同行程（來源：playwright-core inProcessFactory.ts）；#21「最底層」改「最抽象、看不見兩層的第一篇」；#22 Patchright 選型改成「改得到什麼、改不到什麼」＋先看使用條款；#23 Notte 補連結與參考資料。
- 建議採納：#24、#25（Stagehand 段縮短轉手 v4 篇）、#26（Browser Use 換到的速度與 OOPIF）、#27、#29（agent-browser 連 GitHub）、#30、#31 長句、#32 英文。
- 未採納：#29 Puppeteer 註解（表格維持）；#28 15→16 的橋待 order 15 上線後 post-update（記在 progress）。

## post-polish

- check:tw 0／0；post-quality、process-leak、diagram-geometry、lang-parity 通過。
- register-scan：拆掉 connectOverCDP 與 Castle 兩個最長句，剩 62、64 字兩句。
- 圖：diagram-preview 中英 ✓，淺色／深色／手機看過（手機框內橫捲）。
