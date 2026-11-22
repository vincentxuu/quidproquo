# 審稿紀錄：2026-11-19-cdp-webdriver-bidi（AI 瀏覽器自動化 order 17，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-6-17.md，#30–#57）。0 ❌、2 🔵、4 🟡，全部處理：
- 🔵 #47 Puppeteer PR #14676 的 7,662／4,505 ms 只算底層 CDP 指令 → 刪掉「多出來的就是 mapper 那幾層」與 12%／4%，改成「經過 mapper 後底層 CDP 往返變多或變慢」，標明單次量測。
- 🔵 #38 `Runtime.addBinding` 是 rebrowser 自己的退路、`HeadlessChrome` 來自 headless 設定 → 整段痕跡清單刪除（同時採納審稿 17-S1，偵測段縮成三句、轉回 driver 篇）。
- 🟡 #40 Playwright 不綁 Chromium（patch Firefox／WebKit）→ 改寫。
- 🟡 #46 Safari experimental 警告只在 Selenium Ruby binding → 改寫並連 PR #17729。
- 🟡 #52／#54 Rudenko 前一句「a11y tree 攤平 shadow DOM」無出處 → 刪掉，直接接 Rudenko 原話。
- main session 自己核對：CDP 首頁「Direct use of CDP by third-party applications is unsupported」原句、Selenium 4.29 移除 Firefox CDP、Selenium PR #17729、Stagehand locator 文件「Closed roots require a navigated page」。

## post-review

獨立 subagent 編輯審稿（review-6-17.md）。處理：
- 必修全採納：17-必修-1 正文補 inline link；17-必修-2「要 a11y tree 就得留在 Chromium」改成分「瀏覽器原生 tree」與「頁面內算 aria snapshot」兩種，Puppeteer 段限定 Accessibility API。
- 建議採納：S1 偵測段縮短；S2 刪 flatten 說明、解釋 tip-of-tree 與 realm／sandbox、Chrome DevTools for agents 加連結、Juggler 補說明；S3 Selenium 三版 CDP 移到「跟著 Chrome 改版」；S4 效能數字標強度；S5 Playwright 段去掉版本查證痕跡與精確數字；S6 tldr Firefox 改「改走 WebDriver、主推 BiDi」；S8 Stagehand 段 API 名稱減量；英文 behind 重複。
- 未採納：S7 圖中排註明 mapper 位置（正文已寫；圖保持三排對照）。
- 待辦：order 18 上線後，「想深入」補連結。

## post-polish

- check:tw 0／0；post-quality、process-leak、diagram-geometry、lang-parity 通過。
- diagram-preview 中英 ✓（審稿 agent 跑）；正式站上線後截圖目視。
