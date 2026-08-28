---
title: "Claude Code 怎麼看見你的瀏覽器：Chrome 整合、console 除錯與表單自動化"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, chrome, browser-automation, mcp, devtools]
lang: zh-TW
tldr: "Claude Code 透過 Claude in Chrome 擴充套件取得瀏覽器控制權：讀 console log 與 DOM、點擊輸入、上傳檔案、錄 GIF，還能直接操作你已登入的網站。官方前置條件列出 Chrome、Edge 與 Brave、Arc、Vivaldi、Opera 等 Chromium 系瀏覽器，但 WSL 不支援。"
description: "Claude Code 的 Chrome 整合深入介紹：擴充套件安裝與瀏覽器偵測範圍、測試 web app、抓 console log 除錯、表單填寫與資料萃取的典型用法，以及權限機制與限制。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 28
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration-en)

[系列入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)講過，Claude Code 的 agentic loop 有三個階段：蒐集 context、採取行動、驗證結果。但 loop 一直以來只碰得到終端機和檔案系統——前端改動的最終裁判是瀏覽器，驗證那一步卻得靠你自己切視窗、重新整理、開 DevTools 看 console。Chrome 整合補的就是這塊：它透過 [Claude in Chrome 擴充套件](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn)把瀏覽器變成 loop 裡的一組工具，讓「build → 在瀏覽器驗證 → 回頭修 code」在同一個對話裡跑完。同系列 G 叢集的另一篇講的是另一種 surface——[Slack 整合與 Claude Tag](/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration)；這篇聚焦瀏覽器。

## 它是怎麼接上的

架構上不複雜：Chrome 整合基於 Anthropic 官方的 Claude in Chrome 擴充套件（Chrome Web Store 版本 1.0.36 以上），底層是一個名為 `claude-in-chrome` 的 MCP server——在任何 session 跑 `/mcp` 就能看到它的完整工具清單。擴充套件和 Claude Code 之間走 native messaging，第一次啟用時 Claude Code 會寫入 host 設定檔，Chrome 重啟後讀取。

啟動方式有三種：

```bash
claude --chrome        # 起 session 時帶旗標
```

或在 session 內跑 `/chrome` 啟用、查看連線狀態、管理權限、重連擴充套件。懶得每次帶旗標，就在 `/chrome` 面板選「Enabled by default」。反過來，如果你是在互動 session 裡叫 Claude 用瀏覽器、但它沒偵測到擴充套件，它會跳出「Claude wants to use your browser」安裝提示，引導你裝完並在同一個 session 接上。

**瀏覽器偵測範圍**值得記清楚：Claude Code 文件把 Google Chrome、Microsoft Edge，以及 Brave、Arc、Vivaldi、Opera 這類 Chromium 系瀏覽器都列進前置條件；多個瀏覽器同時連上時，可以在 `/chrome` 面板選 Claude 要用哪一個。WSL 環境則完全不支援。另外有個容易踩的坑：Chrome 整合要求用 `/login` 登入的直接 Anthropic 訂閱（Pro、Max、Team、Enterprise）——如果你是用 API key 或 `claude setup-token` 的長期 token 認證，就算帶了 `--chrome`，整合也會保持關閉，因為擴充套件無法用那些憑證認證。

## 典型用法

官方文件的定位是把瀏覽器動作跟 coding 任務串在同一個 workflow 裡。幾個高頻場景：

**測試 local web app。** 最經典的 build-test-fix 迴圈：

```text
我剛更新了登入表單的驗證邏輯。打開 localhost:3000，
用無效資料提交表單，確認錯誤訊息有正確顯示。
```

Claude 開新分頁導航到你的本地 server、實際互動、回報觀察到的結果。所有瀏覽器動作都在一個可見的 Chrome 視窗即時執行，你全程看得到它在做什麼。

**抓 console log 除錯。** Claude 能直接讀 console 訊息、network requests 和 DOM state。實務上有個技巧：告訴它要找什麼 pattern，而不是叫它吐出全部 log——log 通常很長，指定「找載入時的 error」效果好得多。

**表單自動填寫與檔案上傳。** 給它一份 `contacts.csv`，讓它逐筆進 CRM 網站填資料；或叫它開 bug tracker 建 issue 並附上本機的 log 檔。上傳功能需要 Claude Code v2.1.211 以上，單次上傳總計上限 10 MB，且拒絕有多個 hard links 的檔案（`node_modules` 裡的檔案常是這種，先複製一份再傳）。

**頁面資料萃取與已登入服務。** 因為它共享你瀏覽器的登入狀態，不需要任何 API connector 就能操作 Google Docs、Gmail、Notion 這些你已登入的 web app——例如根據最近的 commits 寫專案更新、直接打進你的 Google Doc。也可以跨多個網站串工作流：查行事曆、對每個外部與會者查公司背景、彙整成筆記。萃取結構化資料存成 CSV 同樣一句話的事。此外還能把瀏覽器互動錄成 GIF 文件流程，或把截圖存到磁碟。

## 權限與安全

哪些動作會問你？分兩層：

**網站層級**的權限繼承自 Chrome 擴充套件本身的設定——你在擴充套件設定裡控制 Claude 可以在哪些網站瀏覽、點擊、輸入。Claude 遇到 CAPTCHA 或登入頁會暫停，交給你手動處理。

**工具呼叫層級**，在 plan mode 下界線畫得很清楚：唯讀呼叫（`read_page`、讀 console 訊息、截圖）不用問；改變狀態的呼叫（點擊、輸入、導航、分頁管理、錄 GIF）一律先徵求同意。一個看似唯讀的呼叫如果帶了會改狀態的參數（例如截圖加 `save_to_disk`），也會照樣問。一般模式下，權限對話框會出現「允許這個網站的所有動作」選項，可以按網站放行。

兩個安全細節別漏掉。第一，Claude 開的分頁會收進一個 Chrome tab group 綁定 session，`/clear` 時會連頁面一起關掉，但用 `/resume` 切換 session 或正常退出時，只會在 group 裡全是空分頁的情況下才收——你還在看著的頁面不會被殺掉。第二，錄 GIF 會錄下瀏覽器裡所有可見內容，包括已登入頁面上的帳號資訊，分享前先檢查。Anthropic 自己也提醒 browser AI 有 prompt injection 風險——網頁裡藏指令劫持 agent 動作——建議從信任的網站開始授權。

## 限制

整理成清單：

- **瀏覽器**：Claude Code 文件列出 Chrome、Edge 與其他 Chromium 系瀏覽器；Firefox、Safari、行動裝置瀏覽器不在範圍內，WSL 不支援。
- **認證**：僅限 `/login` 的直接 Anthropic 訂閱；API key、setup-token、Amazon Bedrock 等第三方 provider 都用不了。
- **Context 成本**：「Enabled by default」會讓瀏覽器工具常駐載入，增加 context 消耗；官方建議如果注意到消耗上升，改回按需 `--chrome`。
- **穩定性**：長時間 session 擴充套件的 service worker 可能閒置斷線，`/chrome` 重連即可；JavaScript 的 alert／confirm 對話框會擋住瀏覽器事件，要手動關掉 Claude 才收得到命令。

## 學到的事

Chrome 整合的本質不是新魔法，是給 agentic loop 加了一組瀏覽器工具——loop 還是那個 loop，只是「驗證結果」這一步從此看得見畫面。如果你的工作流裡有大量「改 code → 切瀏覽器 → 開 DevTools」的迴圈，這是目前最省切換成本的做法；如果你的任務純後端或純資料處理，這組工具對你是純粹的 context 負擔，維持預設關閉就好。

## 參考資料

- [Use Claude Code with Chrome — Claude Code Docs](https://code.claude.com/docs/en/chrome) — 官方 Chrome 整合文件：安裝連線、瀏覽器支援範圍、能力清單、plan mode 權限劃分與 troubleshooting，本文主要依據
- [Claude — Chrome Web Store](https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn) — Claude in Chrome 擴充套件安裝頁：版本資訊、權限說明與 prompt injection 安全指引
- [Get started with Claude in Chrome — Anthropic Help Center](https://support.claude.com/en/articles/12012173-getting-started-with-claude-in-chrome) — 擴充套件完整使用文件：各 surface（side panel、Cowork、Claude Code）的差異、所需權限逐項說明
- [Claude in Chrome permissions guide — Anthropic Help Center](https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide) — 權限模式、網站授權、敏感動作與禁止動作說明

## 更新紀錄

- 2026-08-26：初版正文，依 code.claude.com 官方文件重寫，參考資料全數汰換為現行網域。
- 2026-08-29：依官方 Chrome 整合文件更新瀏覽器支援措辭，避免把舊 beta 說法寫成現況。
