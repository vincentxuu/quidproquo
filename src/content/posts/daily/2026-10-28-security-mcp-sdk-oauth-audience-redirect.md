---
title: "資安警報｜MCP 官方 SDK 四個漏洞同天掛進資料庫——升級版本不等於修好 Token 跨服務誤用"
date: 2026-10-28
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "GitHub Advisory Database 10/27 同天公開 MCP 官方 Python／TypeScript SDK 的四個安全公告，其中最重要的 OAuth Token audience 驗證繞過漏洞，修復版本的新檢查預設是關著的，升級版本本身並不會把洞補起來。"
tldr: "Model Context Protocol 官方 Python SDK（`mcp`）與 TypeScript SDK（`@modelcontextprotocol/sdk`）10/27 同天在 GitHub Advisory Database 公開四個安全公告：CVE-2026-116684（伺服端 OAuth token 沒驗證 audience，CVSS 6.8）、CVE-2026-116685（client 端跨源重導向會把憑證一起轉送出去，CVSS 5.9）、CVE-2026-116686（client 驗證 tool 回傳 schema 時會對不可信 `$ref` 發 SSRF 請求，CVSS 6.5）、GHSA-f897-62hf-6gxq（TypeScript server 沒有請求大小上限，CVSS 7.5，無 CVE 編號）。修復版本 Python 9/7、TypeScript 10/2 就已發布，但 audience 驗證這個最關鍵的修復是 opt-in、預設關閉，光升級套件版本不會真的補上這個洞。"
series:
  name: "AI Security Alert"
  order: 66
---

> 🌏 [English version](/posts/daily/2026-10-28-security-mcp-sdk-oauth-audience-redirect-en)

## 事件概述

2026 年 10 月 27 日，GitHub Advisory Database 同天公開了 Model Context Protocol（MCP）官方 SDK 的四個安全公告：Python SDK（PyPI `mcp` 套件）涉及三個，TypeScript SDK（npm `@modelcontextprotocol/sdk`）涉及一個額外未分配 CVE 的公告，另有對應的 TypeScript 版本缺陷在一週前已單獨公開。最嚴重的一項是伺服端 bearer token 驗證沒有檢查 OAuth 的 audience（`aud`）欄位——任何架設 MCP server、且與其他內部服務共用同一台 OAuth 授權伺服器的團隊都受影響。修補版本其實早就存在（Python 9 月 7 日、TypeScript 10 月 2 日），但其中最關鍵的 audience 檢查是「加了但預設關閉」的設定，等於光升級版本號不會真的把洞補起來——這也是這次事件最值得寫下來的地方。目前四個公告都沒有回報在野利用證據。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | MCP 官方 SDK 驗證繞過（OAuth Token 誤用）＋跨源重導向憑證外洩＋client 端 SSRF |
| 影響範圍 | PyPI `mcp` 1.8.0–1.29.1 與 2.0.0–2.1.1；npm `@modelcontextprotocol/sdk` < 1.32.0 及對應 2.x 系列套件 |
| 嚴重程度 | Medium–High（CVSS 5.9–7.5，視個別漏洞而異） |
| CVE | CVE-2026-116684、CVE-2026-116685、CVE-2026-116686（Python）；CVE-2026-111769、CVE-2026-111771（TypeScript，一週前已公開）；GHSA-f897-62hf-6gxq（TypeScript，無 CVE） |
| 來源 | [GitHub Advisory GHSA-w4fh-qvv9-3v23](https://github.com/advisories/GHSA-w4fh-qvv9-3v23)、[GitHub Advisory GHSA-5h93-6whr-6q8j](https://github.com/advisories/GHSA-5h93-6whr-6q8j)、[NVD CVE-2026-116684](https://nvd.nist.gov/vuln/detail/CVE-2026-116684)、[Yaami Labs 分析](https://yaamlabs.com/blog/mcp-sdk-token-audience-cves) |

## 攻擊面分析

最關鍵的 CVE-2026-116684 發生在很多企業常見的架構裡：一台 OAuth 授權伺服器（像 Entra ID、Okta 或 Keycloak）同時幫好幾個內部服務發 token，每張 token 都帶著 `aud`（audience）欄位標明「這張是發給哪個服務用的」。照規範，資源伺服器收到 token 時應該先確認 `aud` 是自己，就算簽章驗證通過也不能收別人的 token。Python SDK 的伺服端 bearer 認證（`AuthSettings` 搭配 `token_verifier`）本身沒有做這一層檢查，TypeScript SDK 的 `requireBearerAuth()` 和 `verifyBearerToken()` 也一樣；如果開發者自己寫的 `verify_token()` 只檢查簽章和有效期限，一個原本只該能打 CRM API 的 token，持有者（可能是另一個服務，也可能是普通使用者）直接把它丟給你的 MCP server 就能用——等於拿著一張別人部門的識別證，闖進了另一個部門的門。

CVE-2026-116685 發生在 client 端：Python SDK 的 Streamable HTTP 與 SSE 傳輸層原本會跟隨任何跨源的 HTTP redirect，如果你信任的 MCP endpoint 被重導向到別的網域（網域過期後被搶註、代理設定寫錯、或是攻擊者能影響的重導向邏輯），自訂的認證標頭（例如 `X-API-Key`）就會一起被送到新網域,遇到 307／308 重導向連請求本體都會一起轉送。CVE-2026-116686 則是 client 驗證工具回傳結果時，用 `jsonschema` 預設的解析器去抓 schema 裡解不開的 `$ref`，惡意 server 只要在 `outputSchema` 裡塞一個指向 `http://`、`https://` 或 `file://` 的參照，client 就會每次呼叫都主動幫它發一次請求——構成 SSRF，而且這個抓取沒有逾時限制，掛住一次就能讓整個 process 的所有 session 一起卡死。

對應 OWASP LLM Top 10：**LLM05 Supply Chain Vulnerabilities**（官方 SDK 版本散落在多個容器映像、vendored 工具裡，而且修復版本早就存在卻沒被 dependency scanner 真正標成「已解決」）＋**LLM06 Excessive Agency**（MCP server 把能操作檔案系統、資料庫、雲端 API 的工具，暴露給任何簽章正確但沒驗 audience 的 token 持有者）。

```diagram
title: CVE-2026-116684 的 token 誤用鏈
desc: 同一台 OAuth 授權伺服器發給 Service A 的 token，因為 MCP Server 沒驗 audience，被直接拿去當 MCP 工具的存取憑證
---
<svg viewBox="0 0 640 420">
  <path class="dg-line" d="M320 76V100" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 156V180" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 236V260" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M320 316V340" marker-end="url(#arrow-accent)"/>

  <rect class="dg-box" x="140" y="20" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="39" text-anchor="middle" dominant-baseline="central">OAuth 授權伺服器</text>
  <text class="dg-sub" x="320" y="59" text-anchor="middle" dominant-baseline="central">同時服務 Service A 與 MCP Server B</text>

  <rect class="dg-box" x="140" y="100" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="128" text-anchor="middle" dominant-baseline="central">核發 token，aud = Service A</text>

  <rect class="dg-box" x="140" y="180" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="208" text-anchor="middle" dominant-baseline="central">持有者把同一張 token 送到 MCP Server B</text>

  <rect class="dg-box" x="140" y="260" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="279" text-anchor="middle" dominant-baseline="central">SDK 只驗簽章與到期時間</text>
  <text class="dg-sub" x="320" y="299" text-anchor="middle" dominant-baseline="central">未檢查 aud 是否等於自己</text>

  <rect class="dg-box dg-box--warn" x="140" y="340" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="359" text-anchor="middle" dominant-baseline="central">存取核准</text>
  <text class="dg-sub" x="320" y="379" text-anchor="middle" dominant-baseline="central">拿到 MCP Server B 的工具存取權</text>
</svg>
```

## 防禦做法

**立即動作**
- 盤點所有環境裡的 SDK 版本：`pip show mcp` 或 `uv pip list | grep mcp`；Node 專案跑 `npm ls @modelcontextprotocol/sdk @modelcontextprotocol/server @modelcontextprotocol/client`，記得連容器映像和 vendored 進別的 agent 工具裡的副本都要查
- 升級到修復版本：Python `mcp` ≥ 1.30.0 或 ≥ 2.2.0；TypeScript 1.x 系列 `@modelcontextprotocol/sdk` ≥ 1.32.0，2.x 系列個別更新 `@modelcontextprotocol/server`、`client`、`node`、`hono`、`express`
- **升級後再多做一步**：Python 要手動把 `AuthSettings` 的 `validate_token_resource` 設成 `True`、設定 `resource_server_url`，並讓 `verify_token()` 回傳 token 的 audience；TypeScript 要在 `requireBearerAuth()` 傳入 `expectedResource`。這個檢查預設關閉，兩邊設定要一起改，只改一半（只設 `resource_server_url` 不開 `validate_token_resource`）則全部請求會變成 401
- 若短期沒法升級：在自己的 `verify_token()`／`verifyAccessToken()` 裡手動擋掉 `aud` 不含自己服務的 token；client 端自備 `httpx` client 把 `follow_redirects` 維持在 `False`

**長期架構**
- 在 CI 裡加一個固定測試：送一張 audience 錯誤的 token，期待拿到 401——避免後續重構又悄悄把這個 opt-in 檢查關掉而沒人發現
- 不要只看 dependency scanner 是否標記「版本已修復」就結案；這次的教訓是版本號過了修復線，功能卻可能沒真的啟用，稽核時要額外確認設定值
- 用 Snyk（前 Invariant Labs）的 Agent Scan 盤點專案裡用到的 MCP SDK 版本與相依工具鏈，搭配 WitnessAI 做企業 agent 流量可見性，留意是否有 token 被重複用在不同服務的 MCP 端點上這種跨服務重放模式

## 影響範圍

Python 修復版本 9 月 7 日就發布，TypeScript 10 月 2 日發布，但 CVE 要到 10 月 27 日才正式進資料庫——中間將近兩個月的空窗，一般 dependency scanner 根本不會標記出任何問題，因為它們是照 CVE 資料庫比對,不是照 release note。更麻煩的是，就算你的環境在這段空窗期間剛好升級到了修復版本，audience 檢查預設關閉這件事，代表你其實還是暴露在同一個漏洞下，只是版本號看起來是安全的。目前所有公告都沒有回報在野利用證據，攻擊者要先拿到一張合法但發給別的服務的 token 才能動手，門檻不算低，但只要組織內部真的共用一台 OAuth 授權伺服器（這在企業環境很常見），這個條件並不難滿足。如果你的 MCP server 架在企業 SSO 之後、又用官方 SDK 的預設驗證邏輯，現在就該去確認那個設定值有沒有打開。

## 今日收穫

平常處理 CVE 的習慣是「dependency scanner 綠燈＝安全」，這次事件讓我意識到這個假設在「修復是 opt-in」的情況下會整個崩掉：版本號過了修復線，功能卻可能沒被啟用,而掃描器看不出設定值,只看版本號。這提醒我稽核安全更新時，不能只問「版本升級了嗎」，還要多問一句「那個修復開關真的打開了嗎」。

## 參考資料

- [GitHub Advisory GHSA-w4fh-qvv9-3v23 — Model Context Protocol Python SDK: Server bearer authentication accepts tokens issued for a different resource](https://github.com/advisories/GHSA-w4fh-qvv9-3v23)
- [GitHub Advisory GHSA-5h93-6whr-6q8j — HTTP client transports followed cross-origin redirects carrying custom headers and bodies](https://github.com/advisories/GHSA-5h93-6whr-6q8j)
- [GitHub Advisory GHSA-f897-62hf-6gxq — TypeScript MCP server has no request size/batch limits](https://github.com/advisories/GHSA-f897-62hf-6gxq)
- [NVD — CVE-2026-116684](https://nvd.nist.gov/vuln/detail/CVE-2026-116684)
- [Yaami Labs — MCP SDK fixes: the token audience check ships switched off](https://yaamlabs.com/blog/mcp-sdk-token-audience-cves)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
