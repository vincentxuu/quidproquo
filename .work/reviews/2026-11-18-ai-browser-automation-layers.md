# 審稿紀錄：2026-11-18-ai-browser-automation-layers（AI 瀏覽器自動化 order 0，中英共用）

## post-verify

獨立 subagent 查證（報告原檔在 session scratchpad 的 post-verify-report.md），一手來源：Stagehand v4 文件（act／observe／extract／caching／migrations）、Browserbase v4 blog、browser-use〈Leaving Playwright for CDP〉、Cloudflare Browser Run（index／stagehand／json）、arXiv 2504.01382、MDN Firefox 141、agent-browser security 頁、各 README。

結果 1 ❌、8 🟡，已全部修：
- ❌ 系列表把同日上線的 Stagehand v4 寫成「接下來會補」→ SDK 段加入連結、待補清單移除，AI 層表格的 Stagehand 改連站內篇。
- 「Stagehand 從 v3 起」連到沒提 v3 的遷移指南 → 改連 Cloudflare Stagehand 頁（原文 "v3 and later … not Playwright-based"）。
- Firefox 141 連到發布前預告 → 改連 MDN 141 release notes。
- Stagehand 示意碼 `newPage()` 後 extract 沒指定 page → 改 README 的 `pages()`＋`goto()` 寫法，並標「片段」。
- 「除非用上快取」→「除非跑在 Browserbase 上並開通伺服器端快取」。
- 「準確度完全取決於模型」→「決策品質主要看模型」。
- Browser Session「回到前三種之一」與 v2.5.x 限制矛盾 → 改成用 Playwright／Puppeteer／CDP，並註明 Stagehand 只支援 v2.5.x。
- 「要跨瀏覽器就選 Midscene／Skyvern／AgentQL」超出來源 → 跨瀏覽器只歸給 Playwright 本身，三家改成「已有 Playwright 測試比較好接」。
- 反爬句中英強度不一、和 Patchright 段打架 → 改成「主要看瀏覽器環境、輸入方式與網路出口，換 AI SDK 通常改變不了；先看使用條款」。
- Browser Run 接不上 v4 的因果 → 縮回 Cloudflare 原文。
- 安全段 `variables` 漏了開快取時的例外 → 補上；agent-browser 控制「預設關閉」補上。
- 「多半來自 WebVoyager」→「九成以上成功率不少來自 WebVoyager」，中英統一。

## post-review

獨立 subagent 編輯審稿（post-review-report.md）。必修 3 條、建議 8 條，處理：
- L-1 開頭與 tldr「分屬不同層」和自己的五層圖矛盾 → 改成「前三個同在 AI 層、差在誰決定下一步；Browserbase／Browser Run 在瀏覽器層」，標題改「AI 層、Driver、協定與瀏覽器的五層地圖」（L-4）。
- L-2 Stagehand 篇已上線卻列待補 → 同 post-verify ❌。
- L-3 Stagehand 行為缺 inline 來源 → `variables` 連 Act 文件、網域政策連 v4 blog；Stagehand 篇補上網域政策段。
- L-5 工具型的「決定」在應用層 → 補一句說明。
- L-6 範圍卡缺「本系列不處理什麼」→ 在自我檢查前補一段（連搜尋與爬取實戰系列、不教繞過反爬）。
- L-7 反爬句 → 同 post-verify。
- L-8 快取說法與 Stagehand 篇不一致 → 同 post-verify。
- L-9 參考資料缺主要對象 → 補 Playwright Test Agents、Puppeteer BiDi 頁（只列讀過的）；Browserbase、Steel 等以站內篇連結代替，`check:references` 仍有 1 個關鍵詞重疊 WARN，判斷可接受。
- L-10 Selenium、WebVoyager（arXiv:2401.13919）、Workers AI 補 inline 連結。
- L-11 片段碼標註「片段」與前提。
- L-14 英文 "apples to oranges" 句改順；L-15「最大一筆開銷」無來源 → 改成「成本會不會隨執行次數成長」。
- 未採納：L-12 把 L4 框拆三格（表格已承擔，圖保持分層圖單純）；L-13 自我檢查題目照範圍卡保留；L-17 tags 不動。

## post-polish

- check:tw 0／0；scan-ledger 無命中；check-process-leak、check-post-quality 通過；lang-parity 通過。
- register-scan：長句從 7 句處理掉最長的開頭句、瀏覽器段、待補清單（拆句）；數字密度段（WebVoyager）改成一個關鍵數字（51%）加一個對照（30%），去掉 15／100／136／85／94。
- 圖：diagram-preview 中英全 ✓，淺色／深色／手機三張看過；640 寬，手機為框內捲動（規範允許）。
- 中英同步：每次修改中英同一輪改，段落一一對應。
