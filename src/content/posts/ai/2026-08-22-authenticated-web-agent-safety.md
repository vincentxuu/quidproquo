---
title: "需要登入的網站怎麼交給 Agent：Session、權限與自動化邊界"
date: 2026-08-22
category: ai
type: guide
tags: [browser-automation, ai-agent, web-security, playwright, mcp]
lang: zh-TW
series:
  name: "搜尋與爬取實戰"
  order: 13
tldr: "登入狀態不是方便攜帶的設定，而是一把能冒用身分的鑰匙。安全做法是使用專用低權限帳號與隔離 browser profile，把讀取、可逆寫入、高風險交易拆成三級，MFA 與最後提交留給人。"
description: "介紹如何安全地讓 AI Agent 操作已合法登入的網站：browser profile、session 保存、CSRF、MFA、人機交接、最小權限、敏感資料遮罩與稽核紀錄。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-authenticated-web-agent-safety-en)

公開網頁可以交給搜尋 API 或 crawler；登入後的網頁不一樣。Agent 一旦拿到 cookie、local storage 或完整 browser profile，拿到的不是「讀頁面能力」，而是使用者在那個網站上的身分。它可能看私人資料，也可能寄信、改權限、刪除內容或付款。

這篇只處理一個合法情境：**使用者已經有權存取資料，現在要把部分瀏覽工作交給 Agent。** 不討論繞過登入、破解 MFA、偷取 cookie 或規避網站的存取控制。真正的設計問題不是「如何讓 Agent 登進去」，而是「這個 session 最多允許 Agent 做到哪裡」。

## 先分清楚：登入不等於授權

Authentication 證明「你是誰」，authorization 決定「你能做什麼」。瀏覽器裡的 session cookie 常是 bearer credential：誰拿到就能代表這個帳號發 request。[OWASP 的 Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)因此把 session ID 外洩視為 session hijacking，而不是一般設定檔外洩。

對 Agent 來說，權限至少要拆成三層：

| 層級 | 允許動作 | 執行方式 |
|---|---|---|
| 讀取 | 搜尋、開頁、下載已授權文件、整理內容 | 可自動執行，但限制網站與資料範圍 |
| 可逆寫入 | 建立草稿、加標籤、填表但不送出 | Agent 執行後提供 diff 或預覽 |
| 高風險動作 | 付款、刪除、發佈、寄送、改權限、重設安全設定 | 人工確認交易內容並親自完成最後授權 |

[OWASP 的 Transaction Authorization 指南](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html)要求重要交易的授權要和一般登入分開，而且使用者應看得到自己正在核准的交易資料。套到 Agent 上，就是不要把「使用者已登入」解讀成「Agent 可以提交任何表單」。

今晚能做的第一個動作：列出自動化流程會碰到的所有按鈕，把每一個標成「讀取、可逆寫入、高風險」；第三類預設不交給 Agent。

## Profile 有三種，不要直接借出日常瀏覽器

[Playwright MCP](https://playwright.dev/docs/getting-started-mcp)支援 persistent、isolated 與 browser extension 三種 profile 模式。它們不是方便程度不同而已，而是暴露面的大小不同。

1. **隔離 session**：每次從乾淨環境啟動，需要時載入一份專用 `storageState`。最容易控制與清除，應當是預設。
2. **專用 persistent profile**：保留登入狀態，但只登入工作需要的網站與低權限帳號。適合固定且頻繁的內部流程。
3. **連接日常瀏覽器**：可直接沿用現有 SSO、MFA、cookies 與 extensions，暴露面最大。只適合有人盯著的短流程，不適合無人值守。

Playwright 官方也明確警告，儲存的 authentication state 可能包含足以冒用帳號的 cookies 與 headers，不能 commit 進公開或私人 repository。Chrome 136 起，自動化工具也不能直接使用預設 user data directory；要另建專用目錄。這個限制反而是好事：**不要讓 Agent 繼承你平常開信箱、銀行、後台與雲端硬碟的完整 profile。**

最小的 MCP 設定可以長這樣：

```json
{
  "mcpServers": {
    "playwright-private-reader": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--isolated",
        "--storage-state=/secure/runtime/reader-state.json",
        "--caps=storage"
      ]
    }
  }
}
```

`reader-state.json` 應放在 repository 之外、只讓執行帳號讀取，並且可以隨時撤銷。不要把密碼、OTP 或 session JSON 貼進 prompt；由人類在 headed browser 完成登入，再把短期狀態交給隔離 context。

## 用專用帳號，把最小權限落到網站裡

光靠 prompt 說「只能讀」不是權限控制。真正的限制應在網站端與執行環境裡成立：

- 建立專用帳號，不共用個人或管理員帳號。
- 能選 OAuth scope 時，只給 read-only scope；能選 workspace／folder 時，只分享必要範圍。
- 不讓讀取型 Agent 看到 billing、user administration、API key 與 security settings。
- 每個自動化流程使用不同 session；不要讓一份 cookie 橫跨多個 Agent 或 MCP server。
- 設短期限、可撤銷，流程結束就登出或刪除 state。

[OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)同樣建議每個 server 使用各自 scoped credential，優先短期 token，不共用長期 PAT。Browser session 雖然不是 API token，生命週期仍應套用相同原則。

## 網路 allowlist 是護欄，不是安全邊界

Playwright MCP 可以設定 `allowedOrigins`、`blockedOrigins` 與最小 capability。這能減少 Agent 因頁面連結或提示注入而跑去不相關網域，也能避免讀取型流程多拿 devtools、network 或任意程式碼執行能力。

```json
{
  "browser": {
    "isolated": true,
    "contextOptions": {
      "permissions": []
    }
  },
  "capabilities": ["core"],
  "network": {
    "allowedOrigins": [
      "https://app.example.com",
      "https://cdn.example.com"
    ]
  },
  "allowUnrestrictedFileAccess": false,
  "outputDir": "/secure/runtime/browser-output"
}
```

但 [Playwright MCP 的官方 README](https://github.com/microsoft/playwright-mcp)寫得很清楚：origin 規則與檔案限制只是避免意外的 convenience guardrail，**不是 security boundary**，而且 origin allowlist 不影響 redirect。真正的隔離仍要靠專用 OS 帳號、container／VM、egress proxy、網站端權限與 client 端 tool approval。

另外不要開 `browser_run_code_unsafe` 給不受信任的 client；官方把它描述為等同 remote code execution。讀取頁面只需要 navigate、snapshot 與少數互動工具時，就不要暴露任意 JavaScript。

## CSRF 與提示注入會借用你的登入狀態

已登入的瀏覽器會自動附上 cookie。這代表惡意頁面不需要知道 session ID，也可能誘導瀏覽器送出帶身分的 request；這正是 CSRF 的核心。[OWASP CSRF 指南](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)要求伺服器使用 session-bound token、SameSite cookie 與 origin 驗證，但 Agent 操作者不能假設每個網站都做對。

頁面裡的提示注入則是另一層：網頁文字可能要求 Agent 忽略任務、開啟外站、貼上資料或執行動作。登入狀態讓這種攻擊的後果從「讀到垃圾內容」升級成「代表使用者做事」。因此：

- 網頁內容永遠是資料，不是權限指令。
- 導航到新 origin、上傳檔案、貼上 clipboard、下載 executable 前停下。
- 所有 state-changing request 都要對照原始任務與允許動作清單。
- 顯示名稱、按鈕文字與頁面摘要不能取代實際 URL、帳號、金額、收件人與變更內容。

需要更完整的威脅模型，可接著讀[自架個人 Agent 威脅模型](/posts/ai/2026-03-28-openclaw-threat-model)。

## MFA 是人機交接點，不是要被自動化掉的障礙

MFA、CAPTCHA、重新輸入密碼與 transaction confirmation 都是網站在要求更高 assurance。安全流程應把它們視為 handoff signal：

1. Agent 導航到驗證前一步，整理待執行動作。
2. 人類核對目標帳號、資料範圍與預期副作用。
3. 人類親自完成 MFA 或 transaction authorization。
4. Agent 只在授權後讀取結果；若頁面內容或金額改變，就重新要求確認。

不要把 TOTP seed、backup code 或 passkey 私鑰交給 Agent，也不要讓模型從通知、email 或簡訊中自行擷取 OTP。這會把第二因素降級成和 session 放在同一個執行環境裡的一份祕密。

## 稽核要記動作，不能把祕密記進去

可追蹤不等於完整錄下所有畫面與 request。[OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)建議記錄權限變更、敏感資料存取、匯入匯出與管理動作，但 session ID、access token、密碼、金鑰與敏感個資不應直接寫入 log。

一筆可用的 Agent browser audit event 至少包含：

```json
{
  "run_id": "run_20260822_001",
  "actor": "private-reader-agent",
  "site": "app.example.com",
  "action": "read_export_preview",
  "resource": "report:quarterly-summary",
  "decision": "allowed",
  "human_approval": null,
  "timestamp": "2026-08-22T10:00:00+08:00"
}
```

不要記 request body、完整 DOM、cookie 或畫面上的所有個資。若需要把同一個 session 的事件串起來，OWASP 建議記 salted hash，而不是 session ID 本身。Trace、HAR、screenshot 與下載檔案也要套資料保留期限，不能無限累積在 Agent workspace。

## 上線前的最小檢查表

- [ ] 使用專用低權限帳號，不是個人主帳號或管理員。
- [ ] 使用隔離 context 或專用 profile，不連接日常瀏覽器。
- [ ] authentication state 在 repository 外、有檔案權限、可撤銷且有期限。
- [ ] 自動化動作已分成讀取、可逆寫入與高風險三級。
- [ ] MFA、付款、刪除、發佈、寄送與權限變更保留人工確認。
- [ ] tool capability、origin 與 egress 已縮到必要範圍。
- [ ] Agent 不會把網頁文字當成新的授權指令。
- [ ] audit log 可追動作，但不含 session、token、密碼與完整敏感資料。
- [ ] 有一鍵撤銷 session、停止執行與回復可逆變更的方法。

## 整體來說

需要登入的網站不是不能交給 Agent，而是不能只交代「幫我登入後做完」。可靠的自動化把 session 當祕密、把 profile 當權限容器、把寫入與交易拆開，並在 MFA 與高風險動作前明確交回給人。

最安全的預設不是最聰明的 browser agent，而是最無聊的那一套：專用讀取帳號、隔離 session、最少工具、有限網域、短期限，以及一個永遠不會被自動按下的最後確認鍵。

## 參考資料

- [Playwright — Authentication](https://playwright.dev/docs/auth)
- [Playwright MCP — Getting Started](https://playwright.dev/docs/getting-started-mcp)
- [Playwright MCP — Profile and State](https://playwright.dev/mcp/configuration/user-profile)
- [Microsoft Playwright MCP repository and configuration](https://github.com/microsoft/playwright-mcp)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html)
- [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
