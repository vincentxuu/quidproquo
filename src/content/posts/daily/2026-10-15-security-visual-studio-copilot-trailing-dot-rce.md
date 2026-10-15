---
title: "資安警報｜Visual Studio 與 SSMS 的 Copilot 多一個點就能改自己設定——CVE-2026-103572"
date: 2026-10-15
category: daily
tags: [ai-agent, security, daily, prompt-injection, privilege-escalation]
lang: zh-TW
description: "Copilot 在 Visual Studio 與 SQL Server Management Studio 裡用原始字串比對受保護檔名，檔名尾端加一個點就能繞過，被注入的指令可以替自己加上 MCP server 或改掉 ripgrep 路徑，進而執行任意指令"
tldr: "CVE-2026-103572（Microsoft 評為 Important、CVSS 8.8）：Copilot 擋寫入 `.mcp.json`、`settings.VisualStudio.json` 的檢查只比對字串，Windows 寫檔時會丟掉檔名尾端的點，所以 `.mcp.json.` 會通過檢查、實際寫進真正的設定檔。被 prompt injection 劫持的 Copilot 可以加一個惡意 MCP server，或把 ripgrep 路徑換成任意程式。10/13 Patch Tuesday 已修，公開 PoC 已釋出。防禦：更新 VS 2022 到 17.14.42、VS 2026 到 18.10.4 並更新 SSMS，檢查兩個設定檔有沒有沒人加過的 server 或工具路徑。"
series:
  name: "AI Security Alert"
  order: 53
---

> 🌏 [English version](/posts/daily/2026-10-15-security-visual-studio-copilot-trailing-dot-rce-en)

## 事件概述

Visual Studio 與 SQL Server Management Studio（SSMS）裡的 GitHub Copilot 本來不准自行修改 `.mcp.json` 和 `settings.VisualStudio.json` 這類設定檔，要修改得經過使用者確認。研究者 Johann Rehberger（Embrace The Red）發現，這道檢查只拿檔名字串做比對，而 Windows 的 Win32 檔案 API 寫檔時會把檔名尾端的點丟掉。結果 `.mcp.json.` 會通過檢查，實際寫入的卻是真正的 `.mcp.json`。被 prompt injection 劫持的 Copilot 可以因此替自己裝上惡意 MCP server，或改掉搜尋用的 ripgrep 執行檔路徑，達成任意指令執行。漏洞在共用的 `Microsoft.VisualStudio.Copilot.Core.dll`，Microsoft 於 2026-10-13 Patch Tuesday 修補，公開 PoC 已釋出。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Prompt injection → 設定檔寫入保護繞過 → 任意指令執行 |
| 影響範圍 | Visual Studio 2026、Visual Studio 2022（17.14）、SQL Server Management Studio 的 Copilot |
| 嚴重程度 | High（Microsoft 評為 Important RCE，CVSS 8.8） |
| CVE | CVE-2026-103572 |
| 修補版本 | VS 2022 17.14.42、VS 2026 18.10.4；SSMS 隨 10 月更新修補（版本號未公開於本文引用來源） |
| 來源 | [MSRC](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-103572)、[Embrace The Red 原始報告](https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/)、[SecurityOnline](https://securityonline.info/cve-2026-103572-visual-studio-copilot-rce-disclosed)、[Agent Security Brief](https://www.agentsecbrief.com/n008-a-trailing-dot-let-visual-studios-copilot-run-attacker-code-2/) |

## 攻擊面分析

攻擊從間接 prompt injection 開始。攻擊者把指令藏在開發者會讓 Copilot 讀的檔案裡，或是從 MCP server 回傳的資料裡。Copilot 讀到後，照指令建立一個檔名尾端多一個點的設定檔。保護檢查認為這不是受保護的檔名，就不要求使用者確認；Windows 寫檔時去掉尾端的點，內容就落進真正的設定檔。Microsoft 自己的文件也寫了這個行為：檔名結尾的句點不會被保存。

拿到設定檔寫入權後，有兩條路。第一條是在 `.mcp.json` 加一個實際上會執行任意指令的「MCP server」，並把它加進啟用清單，IDE 啟動這個 server 時指令就跑起來。第二條只在 Visual Studio：把 `settings.VisualStudio.json` 裡的 ripgrep 路徑換成任意程式，下一次 Copilot 做搜尋就會執行它，PoC 是跳出計算機。研究者另外回報了路徑穿越的變體：從受信任的 Extensions 目錄出發的路徑可以用 `..\` 跳出去，讀到 SSMS 安裝 ID，進而算出使用者設定檔的位置。

根本原因是在**驗證前沒有先把路徑正規化**，讓檢查看到的字串和檔案系統實際寫入的目標不一致。對照 OWASP LLM Top 10，入口是 **LLM01 Prompt Injection**，造成的傷害屬於 **LLM06 Excessive Agency**：agent 能改自己的工具設定，就等於能自己給自己新權限。

## 防禦做法

**立即動作**
- 更新 Visual Studio 2022 到 17.14.42 以上、Visual Studio 2026 到 18.10.4 以上，並安裝 SSMS 的 10 月更新
- 檢查 `.mcp.json` 與 `settings.VisualStudio.json`：有沒有沒人加過的 MCP server、`enabledMcpServers` 有沒有多出來的名字、`copilot.general.tools.ripgrepPath` 是否指向正常的 ripgrep
- 更新前，避免讓 Copilot 處理來路不明的檔案或連接未審核的第三方 MCP server

**長期架構**
- 任何「agent 不可寫入」的檔案清單，都要在正規化完整路徑之後再比對。Microsoft 的修補就是在比對前加上 `GetFullPath`，同時去掉尾端的點並解析 `..`
- 把 agent 的設定檔（MCP 清單、工具路徑）移出 agent 可寫入的範圍，改由 IDE 或系統層管理，不靠 agent 端的字串檢查
- MCP server 用 allowlist 管理，新增 server 一律走人工核准；Netzilo 這類 MCP runtime governance 工具可以在端點上擋未核准的 server
- 用 Lakera、Prompt Security 這類 runtime 偵測，降低從檔案或 MCP 回傳內容進來的間接 prompt injection

## 影響範圍

所有在 Windows 上使用 Visual Studio 2022／2026 或 SSMS Copilot 的開發者與 DBA 都在範圍內，連接第三方 MCP server 的環境風險更高，因為那正是注入內容的來源之一。研究者 8 月 4 日通報，Microsoft 9 月 16 日確認，10 月 13 日修補。研究者表示這個漏洞被判定不在 bounty 範圍內。

對自己做 agent 的團隊來說，這個案例的重點在設計：只要 agent 能寫入決定自己能用哪些工具的檔案，任何一個檢查漏洞都會變成權限提升。檢查要假設 agent 已經被劫持，而不是假設它會乖乖照規則走。

## 今日收穫

之前以為 coding agent 的設定檔保護只要列出禁止寫入的檔名就夠了，這次才意識到：作業系統會怎麼解讀那個檔名，比清單本身更重要。字串比對擋的是字串，真正要擋的是檔案系統最後寫到哪裡。

## 參考資料

- [CVE-2026-103572 — Microsoft Security Response Center](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-103572)
- [Visual Studio Copilot and SSMS Remote Code Execution (CVE-2026-103572) — Embrace The Red](https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/)
- [Public Proof-of-Concept Disclosed for CVE-2026-103572 — SecurityOnline](https://securityonline.info/cve-2026-103572-visual-studio-copilot-rce-disclosed)
- [CVE-2026-103572 affected products and fixed builds — Windows Forum](https://windowsforum.com/news/cve-2026-103572-visual-studio-tools-for-applications-and-sql-server-management-studio-remote-code-execution-vulnerability.448195)
- [N008: A trailing dot let Visual Studio's Copilot run attacker code — Agent Security Brief](https://www.agentsecbrief.com/n008-a-trailing-dot-let-visual-studios-copilot-run-attacker-code-2/)
- [File and folder names that end with a period — Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-client/shell-experience/file-folder-name-whitespace-characters)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
