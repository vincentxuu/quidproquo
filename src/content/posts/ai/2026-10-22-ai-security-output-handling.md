---
title: "模型輸出如何變成 XSS、命令與資料外傳？"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, xss]
lang: zh-TW
description: "透過 HTML 文字、收件網址與報表操作案例，拆開模型輸出的不同解讀邊界。"
tldr: "先確認誰解讀模型輸出，再按 HTML、URL 與操作參數各自處理；JSON 合法、文字轉義與資源授權不能互相取代。"
difficulty: 進階
draft: true
series:
  name: "AI 資安實戰"
  order: 14
---

> 🌏 [English version](/posts/ai/2026-10-22-ai-security-output-handling-en)

Alice 的工單摘要包含一段圖片語法，畫面一載入就向外部網址送出請求；另一個流程把模型給的「產生報表指令」直接交給 shell。兩個入口都是模型文字，危險卻發生在後面接手的程式。

這篇的讀者問題是：**輸出接下來由誰解讀，該在哪裡阻止文字取得執行能力？** 先了解[工具授權](/posts/ai/2026-10-22-ai-security-tool-authorization)。你會得到 HTML 文字、目的地與有限操作三種正反測試，不會把一個「清洗字串」函式當成全部解答。

## 先找消費端，再決定怎麼處理

XSS 是不可信內容在網頁中被當成可執行內容的問題。命令注入則發生在文字被當成系統指令解讀。資料外傳甚至不需要執行腳本：把工單文字放進遠端圖片網址，瀏覽器為了載入圖片就可能發出請求。[Microsoft 的注入防護說明](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks)列出圖片、連結與工具呼叫等不同外傳管道。

| 消費端 | 看似無害的輸出 | 應驗證的性質 |
|---|---|---|
| 一般文字區塊 | 工單摘要 | 當文字插入，不當 HTML |
| 連結、圖片或下載工具 | 一個合法網址 | 協定、主機、路徑、參數與目的地政策 |
| 報表工具 | 合法 JSON | 操作列舉、參數與資源權限 |
| 程序啟動 API | 字串或參數陣列 | 固定執行檔、參數語意與能力範圍 |

JSON schema 可以確認 `destination` 是字串，卻不知道這個字串會不會把 N-1 送給陌生人。輸出「格式正確」只能讓下一層容易處理，不能替下一層批准效果。

## 跑十五個輸出處理案例

下載[防護範例](/examples/ai-security/defense-demo.py)，用 Python 3.11 以上執行：

```bash
python3 defense-demo.py output
```

預期結尾：

```text
PASS: 15 deterministic checks; mode=output; no LLM or network exercised
```

`text_escaped` 把 `<img ...>` 變成以 `&lt;` 開頭的文字，沒有把標籤交給 HTML 解讀器。`normal_url` 只接受本例固定的 HTTPS 報表收件端；腳本協定、偽裝的主機後綴、非空或空白 userinfo 與額外 query 都得到 false。數字、陣列、物件、null 與布林目的地也直接拒絕。`normal_operation` 可執行指定操作，`shell_text` 與 `option_argument` 被拒絕。

這次實驗檢查字串處理與政策函式，沒有啟動瀏覽器或執行 shell，因此不能寫成「已測所有瀏覽器不會 XSS」。它的產物是你可以接到實際 consumer 的輸入與預期表。

## HTML 文字與富文字，是不同需求

如果產品只顯示摘要文字，前端可以使用一般元素的 `textContent`：

```javascript
const summary = document.createElement('div');
summary.textContent = modelOutput;
```

這是把原始字串建立成文字節點，不是先做 HTML 編碼。不要先將 `<` 編成 `&lt;` 再交給 `textContent`，否則使用者會看見編碼本身。[OWASP XSS 防護指引](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)區分文字、屬性、URL、JavaScript 等不同語境；一般元素安全的作法，不能照搬到 script 或事件處理器。

若需要 Markdown 或富文字，則應使用維護中的解析器與 HTML sanitizer，定義允許標籤及屬性，並處理圖片和連結政策。sanitizer 移除腳本不一定禁止外部圖片載入；顯示內容是否會出站，是另一個規格。也不要在清理後又用字串拼接加入未驗證內容。

## 網址不是「有 HTTPS 就安全」

範例固定 `reports.example.invalid` 與 `/north/inbox`，拒絕 query、fragment 與帳密部分。`.invalid` 是不拿來寄送的教學目的地；程式完全不發請求。主機比對使用解析結果的完整主機名，不用 `startswith`，因此 `reports.example.invalid.evil.invalid` 不會通過。

實際服務最好接收伺服器定義的目的地 ID，而不是任意網址。若產品確實要抓外部 URL，還要處理 DNS 結果、私有與保留網段、重新導向每一跳，以及檢查到發出連線之間的變動。這個固定收件端函式沒有實作通用 SSRF 防護，也沒有限制瀏覽器的所有網路請求。

不要以編碼取代目的地授權。把機密轉成 Base64、百分比編碼或放進網址路徑，只改變表示法，不會改變接收者得到資料的事實。

## 指令改成窄操作

[OWASP 的命令注入防護指引](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)優先建議使用函式庫或 API，避免直接呼叫 OS 指令。本例因此只接受 `operation: render_summary` 與格式受限的 `ticket_id`，不接受模型提供整段命令。

如果真的需要啟動程序，固定執行檔與必要選項，使用分開的參數，避免 shell；參數仍須符合被呼叫程式的語意。`--help` 可能只是普通字串，也可能在某個程式變成選項。`shell=False` 減少 shell 解讀，不會自動禁止檔案寫入、資料匯出或網路連線。

本例的格式檢查也不表示該工單可讀；`N-2` 是合法 ID，Alice 仍不能讀。將輸出處理與資源授權一起接到實際 consumer，再於自架雲端用合成資料測試，才能確認部署的路徑沒有直接繞過。

## 自我檢查

1. `{"destination":"https://陌生網站"}` 是合法 JSON，能直接用嗎？
2. HTML 已移除 script，遠端圖片一定不會外傳嗎？
3. 不經 shell 執行參數陣列，能省略參數驗證嗎？

答案都不能。依序需要目的地政策、資源載入政策、被呼叫程式的參數與權限檢查。今晚先找出自己系統的一個 `innerHTML`、URL 開啟點或程序啟動點，為它補一個正常案例與一個副作用反例。

接著讀： [Agent 的沙盒、憑證與網路邊界](/posts/ai/2026-10-22-ai-security-sandbox-credentials)。

## 參考資料

- [Microsoft: indirect prompt injection defenses](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks)
- [OWASP: Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP: OS Command Injection Defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
