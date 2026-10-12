---
title: "資安警報｜Obsidian MCP 伺服器三連漏洞——任意 vault 讀寫與 DNS rebinding 繞過"
date: 2026-10-13
category: daily
tags: [ai-agent, security, daily, prompt-injection, privilege-escalation]
lang: zh-TW
description: "多 vault 版 Obsidian MCP 伺服器 obsidian-tc 被揭露三個漏洞，其中一個 CVSS 9.9，任何合法 token 都能跨 vault 讀寫刪除；另一個靠 DNS rebinding 讓惡意網頁直接取得本機 vault 完整存取權"
tldr: "obsidian-tc（163 個工具、多 vault 原生的 Obsidian MCP 伺服器）同時揭露三個 GitHub Security Advisory：CVE-2026-77366（CVSS 9.9）token 未綁定 vault，任何有效 token 可跨 vault 讀寫刪除；CVE-2026-77363（CVSS 8.8）Streamable HTTP transport 沒做 Origin/DNS-rebinding 驗證，loopback 預設 auth.mode none 下惡意網頁可直接拿到 vault 完整存取權；CVE-2026-77364（CVSS 6.5）資訊洩漏。三者皆已在 1.3.1 修復。防禦：立即升級、停用 auth.mode none、檢查 token 是否綁定 vault claim。"
series:
  name: "AI Security Alert"
  order: 52
---

> 🌏 [English version](/posts/daily/2026-10-13-security-obsidian-tc-mcp-vault-auth-bypass-en)

## 事件概述

`obsidian-tc`（Obsidian Turbocharged）是一個號稱「governed, agent-ready」的 Obsidian MCP 伺服器，提供 163 個工具、跨 31 個領域、原生支援多 vault，讓 Claude Code、Cursor 等 agent 可以直接讀寫使用者的筆記庫。2026-10-12，維護團隊 The-40-Thieves 在 GitHub 上同時發出三份 Security Advisory，對應三個新分配的 CVE：CVE-2026-77366（CVSS 9.9，Critical）、CVE-2026-77363（CVSS 8.8，High）、CVE-2026-77364（CVSS 6.5，Medium）。其中最嚴重的一個漏洞,讓任何合法使用者的 token 都能跨 vault 讀、寫、刪除別人的筆記庫；另一個則是本機 MCP 伺服器常見的 DNS rebinding 老問題——一個惡意網頁就能在背景取得完整 vault 存取權。三者都已在 1.3.1 版修復。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Privilege Escalation + Access Control Bypass（MCP 伺服器） |
| 影響範圍 | `obsidian-tc` < 1.3.1 的所有安裝（npm 套件 / Docker image / `.mcpb` bundle / standalone binary） |
| 嚴重程度 | Critical（CVE-2026-77366 CVSS 9.9）＋ High（CVE-2026-77363 CVSS 8.8） |
| CVE | CVE-2026-77366、CVE-2026-77363、CVE-2026-77364 |
| 來源 | [GitHub Security Advisory GHSA-pqh8-4pj7-32xx](https://github.com/The-40-Thieves/obsidian-tc/security/advisories/GHSA-pqh8-4pj7-32xx)、[Strix CVE-2026-77366](https://www.strix.ai/cve/CVE-2026-77366)、[Strix CVE-2026-77363](https://www.strix.ai/cve/CVE-2026-77363) |

## 攻擊面分析

兩個主漏洞是同一類根本問題的兩種表現:**存取邊界靠的是「請求本身看起來合法」,而不是「伺服器端真的驗證過身分與範圍」**。

CVE-2026-77366（CVSS 9.9）出在 tool dispatch 層:伺服器收到工具呼叫時,會從呼叫參數裡讀 caller 傳入的 `input.vault` 欄位來決定要操作哪個 vault,但完全不檢查這個值是否跟這個 token 原本被綁定的 vault 一致——因為 JWT 裡根本沒有 `vault` claim,而資料夾層級的 ACL 又是全域共用的。結果是:只要你手上有任何一個合法 token（哪怕只是給你自己 vault 用的最小權限 token）,改一下 `input.vault` 參數就能選到別人配置在同一個伺服器上的 vault,直接讀、寫、刪除。這是典型的 **IDOR／confused deputy**:伺服器相信了呼叫者自報的範圍,而不是伺服器端綁定的範圍。

CVE-2026-77363（CVSS 8.8）則是另一個更老的攻擊面:Streamable HTTP transport 建立時完全沒啟用 `enableDnsRebindingProtection`／`allowedHosts`／`allowedOrigins`,也不驗證 `Origin` header。官方文件建議的 loopback 預設設定是 `auth.mode: "none"`——也就是「反正只有本機能連,不用驗證」。但 DNS rebinding 攻擊正是繞過這個假設的經典手法:使用者瀏覽器開著一個惡意網頁,網頁先讓 DNS 指向一個合法外部 IP 通過瀏覽器的 same-origin 檢查,再把 DNS 記錄換成 `127.0.0.1`,讓瀏覽器相信自己還在跟同一個 origin 對話,實際上請求已經打進本機的 `http://127.0.0.1/mcp`。伺服器收到請求後,因為沒驗證 Origin/Host,直接把它當成本機合法呼叫處理,回傳的 caller 身分是 `http-local`,scope 是 `["*"]`——也就是完整 vault 讀寫權限。使用者什麼都沒做,只是開了一個網頁分頁。

這兩個漏洞合在一起看,對應到 **OWASP LLM Top 10 的 LLM06 Excessive Agency** 與 **LLM02 Insecure Output Handling** 的變體:MCP 伺服器把「本機」「有 token」當成信任的充分條件,卻沒把「這個 token 對應哪個資源」「這個請求真的來自我信任的 client」當成必須驗證的東西。值得注意的是,DNS rebinding 打本機 MCP 伺服器不是第一次出現——Anthropic 自家的 Git MCP 伺服器也曾因類似問題(CVE-2025-68143/68144/68145)被點名,顯示這是整個 MCP 生態在 Streamable HTTP transport 落地時反覆踩到的同一個坑,不是 `obsidian-tc` 一家的失誤。

## 防禦做法

**立即動作**
- 檢查是否安裝了受影響版本:`npm ls -g obsidian-tc` 或檢查 Docker image / `.mcpb` bundle 版本,升級到 `>= 1.3.1`
- 升級前的暫時緩解:**停用 `auth.mode: "none"`**,改用 JWT 認證,並且不要把 HTTP transport 綁定在會被瀏覽器存取到的 loopback 介面上
- 若多 vault 共用同一個 `obsidian-tc` 實例,升級後重新確認每個 token 的 vault 綁定是否正確,不要假設舊 token 自動安全

**長期架構**
- 任何本機 MCP 伺服器都要假設網路環境是惡意的:Host/Origin 驗證不是「雲端部署才需要」,localhost 一樣要做
- 多租戶（multi-vault / multi-tenant）的 MCP 伺服器,權限範圍要綁在 token 本身（JWT claim）,不能靠呼叫參數自報,這是基本的「不信任客戶端輸入」原則在 agent 工具層的延伸
- 考慮用 Netzilo 的 MCP server runtime governance 做 allowlist 與執行期範圍檢查,或用 Lakera／Invariant Labs 一類的 runtime 偵測工具監看 MCP 呼叫是否出現跨租戶存取模式

## 影響範圍

`obsidian-tc` 定位是「agent-ready」的個人知識庫 MCP 伺服器,目標使用者正是會把它接到 Claude Code、Cursor 等 agent 裡長期執行的開發者與重度筆記使用者。官方沒有公開具體安裝數字,但套件同時以 npm、Docker image、`.mcpb` bundle 與獨立執行檔四種形式發佈,代表安裝路徑相當分散,很難單靠一次下架就讓所有使用者升級到位。三個 CVE 都已在 1.3.1 修復,且官方同一天發出三份 advisory,屬於主動揭露而非被動踢爆,目前沒有證據顯示漏洞已被實際利用。

如果你的 agent pipeline 裡接了任何本機 MCP 伺服器(不只 obsidian-tc),這次事件的提醒是:**「只有本機能連」從來不是安全邊界**,尤其當使用者同時開著瀏覽器做別的事。多 vault/多租戶場景下,權限範圍一定要綁在伺服器端可信的身分來源上,不能信任呼叫參數。

## 今日收穫

之前看 MCP 安全事件多半聚焦在惡意工具回傳或供應鏈下毒,這次 `obsidian-tc` 提醒的是更基本的一層:就算工具本身乾淨、使用者安裝的是官方套件,伺服器端的存取控制邏輯本身沒做對,一樣能被繞過。而且 DNS rebinding 打本機服務這個攻擊手法在 MCP 生態已經重複出現至少兩次(Anthropic Git MCP 與這次的 obsidian-tc),代表「本機=可信」的預設心態還沒有真正被淘汰。

## 參考資料

- [GitHub Security Advisory GHSA-pqh8-4pj7-32xx — HTTP transport lacks Origin/DNS-rebinding protection](https://github.com/The-40-Thieves/obsidian-tc/security/advisories/GHSA-pqh8-4pj7-32xx)
- [Strix — CVE-2026-77366: obsidian-tc Incorrect Authorization (CVSS 9.9)](https://www.strix.ai/cve/CVE-2026-77366)
- [Strix — CVE-2026-77363: obsidian-tc Vulnerability (CVSS 8.8)](https://www.strix.ai/cve/CVE-2026-77363)
- [Strix — CVE-2026-77364: obsidian-tc Information Disclosure (CVSS 6.5)](https://www.strix.ai/cve/CVE-2026-77364)
- [GitHub — The-40-Thieves/obsidian-tc](https://github.com/the-40-thieves/obsidian-tc)
- [Rafter — DNS Rebinding and Localhost MCP: Your Dev Server is a Target](https://rafter.so/blog/mcp-dns-rebinding-localhost)
