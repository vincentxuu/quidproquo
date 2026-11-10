---
title: "資安警報｜Langflow MCP 端點兩個未認證嚴重漏洞——免帳密就能列出工具，IBM 說同一條路徑能到 RCE"
date: 2026-11-03
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "IBM 10/28 公告 Langflow OSS 兩個 CVSS 9.8 未認證漏洞：CVE-2026-93680 認證繞過＋CVE-2026-110186 經 MCP 工具列舉達成任意程式碼執行，Metasploit 模組已公開，只有 1.13.0 修復。"
tldr: "IBM 10/28 公告：Langflow OSS 1.0.0–1.12.8 全版本都有兩個 CVSS 9.8 的未認證漏洞——CVE-2026-93680 讓任何人免帳密開啟 MCP session 列出伺服器工具，IBM 說同一條路徑（CVE-2026-110186）能延伸到任意程式碼執行；Rapid7 已公開 Metasploit 模組示範到列舉工具這一步，尚未見公開完整 RCE 示範。只有升級到 1.13.0（10/22 發布）能修，無任何暫時解法。"
series:
  name: "AI Security Alert"
  order: 71
---

> 🌏 [English version](/posts/daily/2026-11-03-security-langflow-mcp-unauthenticated-rce-en)

## 事件概述

IBM 在 10 月 28 日（10/29 更新）發布安全公告，指出開源 AI agent 建構平台 Langflow OSS 的每一個版本——從 1.0.0 到 1.12.8——都受兩個 CVSS 9.8 的未認證漏洞影響：CVE-2026-93680 是認證繞過，CVE-2026-110186 是任意程式碼執行，兩者都不需要任何帳號就能從網路上觸發。問題的入口是 Langflow 對外曝露的 Model Context Protocol（MCP）端點，攻擊者不帶任何憑證就能打開一個 MCP session、列出伺服器上所有可用工具；IBM 的公告指出，同一條路徑可以延伸成完整的未認證遠端程式碼執行。Rapid7 已經公開一支 Metasploit 模組，示範到「免帳密列出工具」這一步，但模組本身不執行任何指令，公開資料目前還沒有看到完整 RCE 的示範。唯一的修補是升級到 10 月 22 日發布的 1.13.0，IBM 明確表示沒有任何暫時解法。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 未認證存取 → MCP 工具列舉 → 任意程式碼執行（Authentication Bypass + Unauthenticated RCE） |
| 影響範圍 | Langflow OSS 1.0.0–1.12.8（所有版本），公開 Metasploit 模組實測於 1.8.4，模組作者標記受影響範圍 1.5.0–1.11.4 |
| 嚴重程度 | Critical（CVE-2026-93680、CVE-2026-110186 均 CVSS 9.8；另有 CVE-2026-110193 低權限帳號 8.8、CVE-2026-110192 需帳號 6.5） |
| CVE | CVE-2026-93680、CVE-2026-110186、CVE-2026-110193、CVE-2026-110192 |
| 修補版本 | Langflow OSS ≥ 1.13.0（無暫時解法） |
| 來源 | [IBM 安全公告](https://www.ibm.com/support/pages/security-bulletin-langflow-oss-affected-multiple-vulnerabilities-2)、[The Hacker News](https://thehackernews.com/2026/11/critical-langflow-flaws-could-let.html)、[Aviatrix Threat Research](https://aviatrix.ai/threat-research-center/critical-langflow-flaws-unauthenticated-rce-cve-2026-93680-cve-2026-110186-2026)、[Tuskira](https://www.tuskira.ai/advisories/cve-2026-93680) |

## 攻擊面分析

四個 CVE 其實是同一片攻擊面裡的四個切面。CVE-2026-93680（CWE-287 Improper Authentication）讓完全沒有帳號的攻擊者可以打到 `/api/v1/mcp/sse` 這個 SSE 端點，開啟一個 MCP session；Rapid7 的 Metasploit 模組就是連這個端點、不帶任何憑證建立 session，再列出伺服器上公開的工具與 metadata——這一段已經是公開、可重現的攻擊。IBM 的公告把這條路徑再往前推一步：CVE-2026-110186（CWE-94 Improper Control of Generation of Code）說明同一個 MCP 工具列舉流程可以被延伸利用成未認證的任意程式碼執行，但目前公開資料（包括那支 Metasploit 模組）都只示範到列舉這一步，沒有看到完整觸發 RCE 的公開 PoC。另外兩個需要帳號的漏洞也值得留意：CVE-2026-110193（CVSS 8.8）讓低權限帳號能讓 Langflow 的 Agentic Assistant 生成並提交會在伺服器上跑 OS 指令的 component 程式碼；CVE-2026-110192（CVSS 6.5）是憑證保護不足導致的資訊洩漏。放大問題的是 `LANGFLOW_AUTO_LOGIN` 這個設定——它在 1.12.8 預設開啟，會讓任何連進來的人直接以 superuser 身分登入，完全不用密碼，IBM 形容其中一個缺陷是「auto-login 安全控制的不完整修復」；1.13.0 把這個預設值改成關閉。

```diagram
title: Langflow MCP 端點未認證攻擊鏈（CVE-2026-93680 → CVE-2026-110186）
desc: 攻擊者免帳密打開 Langflow 的 MCP session 列出工具清單，IBM 公告指出同一條路徑可延伸到伺服器端任意程式碼執行
caption: 步驟 1–4 已有公開 Metasploit 模組示範；步驟 5–6 是 IBM 公告描述的延伸風險，目前無公開完整 PoC
step: 攻擊者不帶任何帳密，對 /api/v1/mcp/sse 發起 GET 請求
step: Langflow 回應 200，建立一個 MCP session（CVE-2026-93680：認證繞過）
step: 攻擊者用拿到的 session_id 呼叫 MCP 端點，列出伺服器上所有可用工具
step: Langflow 回傳完整工具清單與伺服器 metadata
step: 攻擊者挑一個工具，送出會觸發程式碼生成的呼叫
step: Langflow 在本機執行這段攻擊者控制的指令（CVE-2026-110186：IBM 描述此路徑可達成未認證 RCE，目前未見公開完整示範）
---
<svg viewBox="0 0 640 440">
  <line class="dg-rule" x1="140" y1="72" x2="140" y2="420"/>
  <line class="dg-rule" x1="500" y1="72" x2="500" y2="420"/>

  <g data-step="1">
    <path class="dg-line" d="M144 120H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="108" text-anchor="middle" dominant-baseline="central">GET /mcp/sse</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M496 168H144" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="320" y="156" text-anchor="middle" dominant-baseline="central">建立 session</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M144 216H492" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="318" y="204" text-anchor="middle" dominant-baseline="central">列出工具</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--dashed" d="M496 264H144" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="320" y="252" text-anchor="middle" dominant-baseline="central">回傳工具清單</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M144 312H492" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="318" y="300" text-anchor="middle" dominant-baseline="central">呼叫惡意工具</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent" d="M504 360H532Q540 360 540 368V376Q540 384 532 384H508" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="552" y="372" dominant-baseline="central">執行指令</text>
  </g>

  <rect class="dg-box" x="496" y="108" width="8" height="288" rx="2" data-step="1 2 3 4 5 6"/>

  <rect class="dg-box" x="76" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="140" y="48" text-anchor="middle" dominant-baseline="central">未認證攻擊者</text>

  <rect class="dg-box" x="420" y="24" width="160" height="48" rx="6"/>
  <text class="dg-label" x="500" y="40" text-anchor="middle" dominant-baseline="central">Langflow</text>
  <text class="dg-sub" x="500" y="60" text-anchor="middle" dominant-baseline="central">MCP 端點</text>
</svg>
```

對照 OWASP LLM Top 10：CVE-2026-93680／CVE-2026-110186 這條鏈屬於 **LLM07 Insecure Plugin Design**——MCP 工具本質上就是外掛，端點沒有驗證就能列舉並呼叫；CVE-2026-110193 讓 Agentic Assistant 自己生成會執行 OS 指令的程式碼，屬於 **LLM08 Excessive Agency**，agent 被賦予的執行權限超過了它完成任務真正需要的範圍。

## 防禦做法

**立即動作**
- 檢查目前部署的 Langflow 版本：`pip show langflow` 或看 Docker image tag，1.0.0–1.12.8 都受影響
- 立刻升級到 `langflow==1.13.0`（PyPI）或 `langflowai/langflow:1.13.0`（Docker），升級前先備份資料庫、secret key 與上傳檔案；若用 `LANGFLOW_AUTO_LOGIN`，先照官方升級指南把現有帳號轉成密碼登入，升級後登不進去不要刪除重裝，官方文件警告這會永久清空 flow
- 升級前的緩解只能靠網路層：把 Langflow 放到 VPN 或 SSO 後面，擋掉對外的 7860 port 與 `/api/v1/mcp/` 路徑，確認 `LANGFLOW_AUTO_LOGIN` 沒有被意外打開——這些都只是降低暴露面，不是修補

**長期架構**
- MCP 伺服器預設不應該對任何網路可達的來源開放，盤點所有內部服務是否也把 MCP 端點直接曝露在無驗證的網段上，這次的根因（免帳密列舉工具）不是 Langflow 特有的設計失誤，而是 MCP 介面常見的曝露模式
- 考慮用 Netzilo 這類跨平台 agent runtime governance 工具，對會曝露 MCP 端點的服務設 allowlist 與存取邊界，而不是只靠單一服務自己做認證
- 稽核 agent 平台的「自動登入」「開發模式」類設定在正式環境是否被意外帶到預設值，這類設定往往是為了方便本機開發，卻在雲端部署時被原樣沿用

## 影響範圍

IBM 的公告沒有說明目前有多少 Langflow 部署受影響，但這組漏洞覆蓋了 Langflow 從第一個正式版本到最新穩定版之間的所有釋出，等於任何還沒升級到 1.13.0 的部署都暴露在風險下。截至 10 月 30 日的 CISA 已知遭利用漏洞（KEV）名單更新，這組 CVE 都還沒被列入——跟本系列 10/15 報導過的另一個 Langflow 漏洞 CVE-2026-105740（當時已有蜜罐觀測到超過 1,600 次攻擊嘗試）不同，這次公開資料還沒有看到在野利用的證據。但 Metasploit 模組已經公開，意味著掃描與初步利用的門檻已經降到很低，Langflow 過去半年多次被列入 CISA KEV 的紀錄也顯示這個平台是持續被盯上的目標。如果你的環境跑著任何版本的 Langflow、又把它接上企業網路或對外服務，現在升級就是最高優先。

## 今日收穫

這次事件讓我更清楚看到 MCP 協定本身帶來的一種新攻擊面：傳統的未認證 API 端點只會洩漏資料或拒絕服務，但 MCP 端點洩漏的是「這個伺服器能幫你做什麼」的完整工具清單，而這份清單本身就是進一步攻擊的地圖。CVE-2026-93680 和 CVE-2026-110186 被拆成兩個獨立 CVE 也提醒我，同一個 MCP 曝露面可以同時是「資訊洩漏」和「程式碼執行」兩種嚴重度完全不同的漏洞，稽核時不能因為公開 PoC 只做到列舉就低估了它的實際風險上限。

## 參考資料

- [IBM 安全公告 — Security Bulletin: Langflow OSS is affected by multiple vulnerabilities](https://www.ibm.com/support/pages/security-bulletin-langflow-oss-affected-multiple-vulnerabilities-2)
- [The Hacker News — Critical Langflow Flaws Could Let Unauthenticated Attackers Run Code on Servers](https://thehackernews.com/2026/11/critical-langflow-flaws-could-let.html)
- [Aviatrix Threat Research — Two Critical Unauthenticated RCE Flaws in Langflow Put AI Agent Infrastructure at Immediate Risk](https://aviatrix.ai/threat-research-center/critical-langflow-flaws-unauthenticated-rce-cve-2026-93680-cve-2026-110186-2026)
- [Tuskira — CVE-2026-93680 Langflow: is it reachable in your environment?](https://www.tuskira.ai/advisories/cve-2026-93680)
- [Rescana — Langflow OSS CVE-2026-93680 and CVE-2026-110186: Two Unauthenticated Critical Flaws](https://www.rescana.com/post/langflow-oss-cve-2026-93680-110186-unauthenticated-critical-prepare-now)
- [Rapid7 Metasploit Framework — langflow_auth_bypass_cve_2026_93680 module](https://github.com/rapid7/metasploit-framework/blob/master/modules/auxiliary/gather/langflow_auth_bypass_cve_2026_93680.rb)
- [CVE Record — CVE-2026-93680](https://www.cve.org/CVERecord?id=CVE-2026-93680)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
