# 審稿紀錄：2026-11-19-hosted-browser-comparison（AI 瀏覽器自動化 order 19，中英共用）

## post-verify

獨立 subagent 查證（scratchpad verify-19-23.md）。2 ❌、5 🟡，全部處理：
- ❌ Notte BrowserArena 最快是 Tilion 206 ms（Kernel 第二），並補 Browserbase 跨區量測的註；❌ ComputeSDK 最快是 Tilion 約 0.11 s（預先發布版），頁面只到 0.01 秒 → 改成約略值。
- 🟡 Kernel 72 小時是閒置後保留時間、不是 session 總長 → 表格、怎麼選、tldr 都改；tldr「每小時 $0.06–0.12」限定為按時數計費的幾家；Browserbase 簽章引文改連 Identity overview；Kernel Web Bot Auth 限 Start-Up／Enterprise；ComputeSDK「每日」改「定期」。
- 研究筆記內部矛盾：Kitesurf 是否仍為免費 beta → main session 讀 docs index.md 原句確認仍是 beta、免費。

## post-review

獨立 subagent 編輯審稿（review-19-23.md）。處理：
- 必修全採納：三處「下一篇」改成「Browser Run 篇」並加連結（19 之後是 order 20）；tldr 與正文矛盾處改正；HyperAgent、授權清單、Kernel WBA 補 inline link 與參考資料；醫療團隊引述改連 dev.to 原文。
- 未採納：tldr 再縮短（資訊密度足）。

## post-polish

- check:tw 0／0；post-quality、process-leak、lang-parity 通過；外部連結逐一 curl 200。

## 待辦：舊單篇過時處（2026-11-19 研究時發現，未處理）

- order 20 Browserbase：未提定價（Free／$20／$99／Scale、$0.12／$0.10、proxy $12／$10）、免費方案 session 只有 15 分鐘、錄影保留 30 天；缺 2026-08 後新功能：Web Bot Auth（beta、需申請）、Navigation Policies、Authenticated Fetch、Functions＋Secrets、1Password、Stagehand 4.1–4.4。
- order 21 Steel：stars 7,400 → 7,990；自架版一次只有一個 session、不檢查 API key，且與 Cloud 是不同程式碼；錄影 2026-10-02 起可關；可補 Scale $250、$0.08、proxy $6、CAPTCHA $1/1k。
- order 22 Hyperbrowser：產品擴成 browsers／sandboxes／web data／agents 共用 credits，Startup $30、Scale $100；新增 Web Bot Auth（申請制）、多區域、Sandboxes、Stagehand 整合頁；Enterprise 保留 180+ 天。
