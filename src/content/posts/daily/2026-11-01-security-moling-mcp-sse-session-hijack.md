---
title: "資安警報｜MoLing MCP Server SSE 模式無驗證+CORS 萬用字元，瀏覽器就能偷到 session 下指令"
date: 2026-11-01
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "電腦操作型 MCP server MoLing 在 SSE 模式下，/sse 與 /message 端點完全沒有驗證，底層 mcp-go 套件還把 CORS 設成萬用字元，任何網頁都能偷到 sessionId 並冒用身份呼叫檔案讀寫、command 等 MCP 工具，CVSS 9.6。"
tldr: "CVE-2026-62863：MoLing（檔案操作＋瀏覽器控制的 MCP server）在 SSE 模式（`-l` 參數）下，/sse 與 /message 端點不驗證身份，依賴的 mcp-go 套件又固定回傳 `Access-Control-Allow-Origin: *`，讓任何來源的網頁都能用 EventSource 讀到受害者的 sessionId，再冒用它呼叫已設定的 MCP 工具，視工具組合可讀寫檔案或執行指令。綁定 127.0.0.1 也擋不住，因為攻擊是從受害者自己的瀏覽器發起。已在 v0.5.0 修補，加入 bearer token 驗證並清掉偽造的 CORS header。"
series:
  name: "AI Security Alert"
  order: 69
---

> 🌏 [English version](/posts/daily/2026-11-01-security-moling-mcp-sse-session-hijack-en)

## 事件概述

MoLing 是一個用 Go 寫的本機 MCP server，主打免安裝、免相依，直接透過作業系統 API 做檔案讀寫、系統指令執行與瀏覽器自動化，定位是「個人電腦的辦公室 AI 助理」。研究人員 Songwu、Zeyu Luo、Dr. CAO Yinfeng 與 Kevin 發現：只要使用者用 `-l` 參數以 SSE（Server-Sent Events）模式啟動 MoLing，伺服器的 `/sse` 與 `/message` 這兩個 HTTP 端點完全不驗證請求來源，而底層依賴的 `mcp-go` 套件還會固定在回應標頭寫入 `Access-Control-Allow-Origin: *`，直接解除瀏覽器的同源政策（Same-Origin Policy）保護。只要受害者在 MoLing 執行期間瀏覽一個惡意網頁，該網頁就能在背景偷到一次性的 `sessionId`，再冒用它向 MoLing 下達任意已設定的 MCP 工具呼叫。GitHub 已指派 CVE-2026-62863，CVSS 3.1 評為 9.6 Critical。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Privilege Escalation / Session Hijack（MCP server 驗證缺失＋CORS 設定錯誤） |
| 影響範圍 | `gojue/moling` 版本 < 0.5.0，且以 `-l`（SSE 模式）啟動的使用者 |
| 嚴重程度 | Critical（CVSS 3.1 9.6，`AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:L`） |
| CVE | [CVE-2026-62863](https://www.cve.org/CVERecord?id=CVE-2026-62863)（CWE-306 缺少驗證、CWE-942 過度寬鬆的跨域政策） |
| 來源 | [GitHub Security Advisory GHSA-qpgh-hp5g-4vwp](https://github.com/gojue/moling/security/advisories/GHSA-qpgh-hp5g-4vwp)、[OpenCVE](https://app.opencve.io/cve/CVE-2026-62863)、[TheHackerWire](https://www.thehackerwire.com/cve-2026-62863-moling-mcp-server-unauthenticated-cross-origin-session-hijack-to-arbitrary-command-execution/) |

## 攻擊面分析

攻擊路徑完全發生在受害者自己的瀏覽器裡，不需要攻擊者直接碰到受害機器：受害者先用 `moling -l 127.0.0.1:6789` 把 MoLing 跑在 SSE 模式，接著瀏覽到一個攻擊者控制（或被攻擊者注入惡意程式碼）的網頁。那個網頁在背景開一個 `EventSource('http://127.0.0.1:6789/sse')`，由於 MoLing 的回應標頭帶著 `Access-Control-Allow-Origin: *`，瀏覽器會放行這個原本該被同源政策擋下的跨域請求。MoLing 建立連線時會透過 `endpoint` 事件把當次的 `sessionId` 廣播出來，攻擊頁面讀到這個 ID 之後，就能直接對 `/message?sessionId=<偷到的值>` 發送請求，冒用受害者身份呼叫 MoLing 已設定好的任何 MCP 工具——檔案讀寫、系統指令執行，或瀏覽器自動化。

根本原因是兩個問題疊在一起：一是 `/sse`、`/message` 兩個端點本身沒有任何驗證機制（CWE-306，缺少關鍵功能的驗證）；二是底層 `mcp-go` 函式庫在 SSE 回應裡直接寫死 `Access-Control-Allow-Origin: *`（CWE-942，對不受信任網域過度寬鬆的跨域政策），把瀏覽器原本該擋下跨站讀取的防線直接拆掉。GitHub 的建議書特別點出一個常見的錯誤直覺：很多人以為把監聽位址綁在 `127.0.0.1` 就安全，但這個攻擊是受害者自己的瀏覽器從 localhost 發起連線，綁定 loopback 完全不影響攻擊成不成立。

```diagram
title: MoLing SSE 模式的 session 竊取攻擊鏈
desc: 惡意網頁靠 CORS 萬用字元讀到 MoLing 回傳的 sessionId，再冒用它呼叫 MCP 工具
step: 惡意網頁對 MoLing 開啟跨域 EventSource 連線
step: MoLing 的 CORS 萬用字元放行讀取，sessionId 外流給惡意網頁
step: 惡意網頁用偷到的 sessionId 呼叫 /message 工具端點
step: MoLing 執行工具並把結果回傳給惡意網頁
caption: 前提：受害者已用 `-l` 參數在 SSE 模式下啟動 MoLing，且瀏覽器開著惡意網頁分頁
---
<svg viewBox="0 0 400 320">
  <line class="dg-rule" x1="84" y1="72" x2="84" y2="284"/>
  <line class="dg-rule" x1="304" y1="72" x2="304" y2="284"/>

  <g data-step="1">
    <path class="dg-line" d="M84 120H296" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="192" y="108" text-anchor="middle" dominant-baseline="central">GET /sse</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M300 164H88" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="192" y="152" text-anchor="middle" dominant-baseline="central">sessionId 外流</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M84 208H296" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="192" y="196" text-anchor="middle" dominant-baseline="central">POST /message</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M300 252H88" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge" x="192" y="240" text-anchor="middle" dominant-baseline="central">回傳執行結果</text>
  </g>

  <rect class="dg-box" x="300" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="300" y="196" width="8" height="68" rx="2" data-step="3 4"/>

  <rect class="dg-box" x="20" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="84" y="42" text-anchor="middle" dominant-baseline="central">惡意網頁</text>
  <text class="dg-sub" x="84" y="60" text-anchor="middle" dominant-baseline="central">攻擊者控制</text>
  <rect class="dg-box" x="240" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="304" y="42" text-anchor="middle" dominant-baseline="central">MoLing</text>
  <text class="dg-sub" x="304" y="60" text-anchor="middle" dominant-baseline="central">SSE 模式／未驗證</text>
</svg>
```

這個事件對應到 OWASP LLM Top 10 的 **LLM06 過度代理權（Excessive Agency）**：MCP 工具一旦被授權做檔案系統與指令執行，任何能冒用 session 的人就直接拿到同等權限，而 MoLing 的驗證層本來就沒有把「誰可以呼叫工具」和「工具可以做什麼」分開管控。往供應鏈角度看，這也是另一次「上游函式庫的預設值（CORS 萬用字元）被下游專案直接繼承」的案例——跟近期多篇關於 MCP 生態缺乏基本驗證的普查報告（如 91.8% 受測伺服器沒有 OAuth 驗證）呼應的是同一種系統性問題。

## 防禦做法

**立即動作**
- 把 `gojue/moling` 升級到 v0.5.0 或以上；新版加入 `sseSecurityMiddleware`，要求每個請求帶 `Authorization: Bearer <token>` 或 `?token=` 查詢參數，並用 `crypto/subtle.ConstantTimeCompare` 做常數時間比較避免時間側錄攻擊
- 若暫時無法升級：**不要**在可能瀏覽不受信任網站的機器上以 `-l`（SSE 模式）啟動 MoLing；評估是否能先暫停 SSE 模式對外服務
- 盤點目前所有以 SSE/HTTP 模式對外曝露的 MCP server，檢查回應標頭是否也出現 `Access-Control-Allow-Origin: *`——這不是 MoLing 專屬問題，而是共用 `mcp-go` 這類函式庫的專案都該複查的設定

**長期架構**
- MCP server 的驗證邏輯不該依賴「使用者有沒有瀏覽可疑網站」這種假設；任何會接受 HTTP/SSE 連線的 MCP server 都應該預設要求 token 或更強的身份驗證，而不是等事後補
- 對有檔案系統、指令執行能力的 MCP 工具，用最小權限原則限制可呼叫的工具組合，降低單一 session 被冒用後的影響半徑
- 導入 MCP server 掃描工具做例行稽核，例如 Snyk（前 Invariant Labs）的 [Agent Scan](https://github.com/snyk/agent-scan)、Cisco 的 [mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner)，這兩者都會檢查 tool poisoning、過度權限與 SSRF 等風險，CORS 設定錯誤屬於同一類該被例行檢查的項目

## 影響範圍

目前沒有公開可用的 PoC 被收錄在開放研究庫中，TheHackerWire 與 CISA 皆標示「未觀察到實際利用」，EPSS 評分也在 1% 以下，代表這還停留在漏洞揭露、尚未看到大規模攻擊的階段。但攻擊門檻低（CVSS 的 Attack Complexity 為 Low、不需要任何權限），加上 MoLing 本身的定位就是本機辦公室助理、具備檔案與指令執行能力，一旦有人在日常瀏覽時中招，後果可以直接是本機檔案外洩或任意指令執行。

如果你的 Agent 系統有任何以 HTTP/SSE 方式對外提供服務的 MCP server，這次事件值得當作一次健檢提醒：先去查回應標頭有沒有 `Access-Control-Allow-Origin: *`，再確認有沒有強制的身份驗證層，不要假設「只給 localhost 用」就等於安全。

## 今日收穫

一直以為「綁定在 127.0.0.1」是本機服務最後一道防線，這次才意識到當攻擊是靠受害者瀏覽器當跳板時，這道防線完全無效——瀏覽器本來就站在 localhost 這一側，CORS 標頭才是真正決定誰能讀到回應的開關。這提醒我們稽核本機 MCP server 時,「有沒有對外開 port」和「有沒有正確設定 CORS」是兩件要分開檢查的事。

## 參考資料

- [GitHub Security Advisory GHSA-qpgh-hp5g-4vwp — MoLing SSE 驗證缺失與 CORS 萬用字元](https://github.com/gojue/moling/security/advisories/GHSA-qpgh-hp5g-4vwp)
- [CVE-2026-62863 — OpenCVE 完整紀錄（CVSS、CWE、修補版本）](https://app.opencve.io/cve/CVE-2026-62863)
- [CVE-2026-62863: MoLing MCP Server Unauthenticated Cross-Origin Session Hijack to Arbitrary Command Execution — TheHackerWire](https://www.thehackerwire.com/cve-2026-62863-moling-mcp-server-unauthenticated-cross-origin-session-hijack-to-arbitrary-command-execution/)
- [修補 PR #48（加入 token 驗證與 CORS 清除中介層）](https://github.com/gojue/moling/pull/48)
- [v0.5.0 發布頁](https://github.com/gojue/moling/releases/tag/v0.5.0)
- [gojue/moling 專案首頁](https://github.com/gojue/moling)
- [Snyk Agent Scan（前 Invariant Labs mcp-scan）](https://github.com/snyk/agent-scan)
- [Cisco mcp-scanner](https://github.com/cisco-ai-defense/mcp-scanner)
