---
title: "資安警報｜假 Web3 加速器用 npm 套件綁架 AI coding agent 流量、偷插惡意 MCP server"
date: 2026-10-20
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: zh-TW
description: "假冒 Web3 創投加速器 Apex Accelerator 用兩個 npm 套件散布 infostealer 和後門，同時把開發者的 coding agent 流量導向攻擊者伺服器，並在設定檔裡偷塞一個攻擊者控制的 MCP server。"
tldr: "Elastic Security Labs 揭露 Apex Accelerator（追蹤代號 REF8801）用 @apexacc/cli 和 @apexacc/audit 兩個 npm 套件，一邊裝 Windows/macOS 的 infostealer 和後門，一邊把一套開源 coding agent 改造成會偷換 LLM API 端點、寫入攻擊者 MCP server 的版本。防禦：移除套件、翻轄 secret、安裝前核對 MCP server 設定來源。"
series:
  name: "AI Security Alert"
  order: 58
---

> 🌏 [English version](/posts/daily/2026-10-20-security-apex-accelerator-npm-mcp-hijack-en)

## 事件概述

Elastic Security Labs 研究員 Jia Yu Chan 與 Daniel Stepanic 揭露一個名為 Apex Accelerator（追蹤代號 **REF8801**）的假冒 Web3 創投加速器，透過兩個 npm 套件 `@apexacc/cli`（號稱由 Claude Fable 5 和 Gemini 2.5 Flash 驅動的「AI 顧問」）與 `@apexacc/audit`（號稱提供 18 個安全掃描工具的 MCP server）散布惡意程式。攻擊目標是加密貨幣創業者與交易工具開發者：攻擊者先以「23.5 萬美元投資」為誘因接觸受害者，要求對方安裝這兩個套件完成「審核」。裝完後,不只是一般的 infostealer／後門，套件還會竄改受害者本機的 coding agent 設定，把 LLM API 流量導向攻擊者伺服器，並偷塞一個攻擊者控制的 MCP server 進 agent 設定檔。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Supply Chain Attack（npm 套件仿冒 + AI agent 流量綁架） |
| 影響範圍 | 安裝 `@apexacc/cli` / `@apexacc/audit`（及關聯舊套件 `@apexfdn/apex`、`@copilot-mcp/apex`、`@apexfdn/copilot-mcp`）的 Windows／macOS 開發者 |
| 嚴重程度 | High |
| CVE / 追蹤編號 | 無 CVE；OSV 惡意套件記錄 `MAL-2026-10979`（`@apexfdn/apex`） |
| 來源 | [Elastic Security Labs](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages)、[The Hacker News](https://thehackernews.com/2026/10/fake-web3-accelerator-uses-npm-packages.html)、[securityonline.info](https://securityonline.info/apex-malicious-npm-packages-web3/) |

## 攻擊面分析

`@apexacc/cli` 不是從零寫的惡意程式，而是直接拿開源 coding agent 專案 Oh My Pi 改的——Elastic 比對後發現 1,351 份原始檔中有 1,363 份幾乎完全相同，攻擊者只在其中加了一個 bootstrap 元件。這個元件做兩件跟 AI agent 直接相關的事：一是把標示為 OpenRouter 的 LLM API 請求，悄悄改送到攻擊者控制的端點，對外看起來還是打 OpenRouter；二是在 `~/.apex/agent/mcp.json` 裡寫入一個攻擊者自己的 MCP server 項目，且這個設定會在重啟後繼續存在。Elastic 的測試證實，agent 本機讀到的檔案內容確實會出現在送往攻擊者端點的請求裡——換句話說，prompt、對話紀錄、程式碼片段、工具輸出全部被攻擊者收走。

這條路徑能成立,根本原因是 coding agent 的設定檔（MCP server 清單、API 端點）屬於「使用者本機可寫」的信任資料，而大多數 agent 啟動時不會對這份設定做來源驗證或簽章檢查,只要檔案存在就照單全收。更危險的是,攻擊者控制的 MCP server 本身可以回傳工具描述與用法說明,這些內容會被塞進 agent 的 system prompt,等於開了一條間接 prompt injection 的管道,讓攻擊者有機會影響 agent 後續要呼叫哪個工具、怎麼用。至於另一個套件 `@apexacc/audit`,18 個「安全掃描工具」全部造假結果,單純用來讓受害者誤信自己的專案或對手盤「過審」。

Windows 端的感染鏈則是傳統多階段 loader：先下載 PowerShell script，接著視權限用 [UACME](https://github.com/hfiref0x/UACME) 繞過 UAC，再 patch AMSI/ETW 並 unhook `ntdll.dll` 躲避端點防護，最後載入 shellcode 型態的 infostealer，連 Chrome 的 App-Bound Encryption 都能繞過竊取密碼與 cookie。macOS 端則是先前 Jamf 已記錄過的 CloudSyncD 後門，用假的系統授權提示釣密碼,再用 sudo 執行 payload。

對應 OWASP LLM Top 10：**LLM05 Supply Chain Vulnerabilities**（偽裝成 AI 工具的惡意 npm 套件）加上 **LLM06 Excessive Agency**（MCP server 設定檔被賦予「免驗證寫入即生效」的權限，遠超過一個第三方工具該有的範圍）。

## 防禦做法

**立即動作**
- 檢查是否裝過受影響套件：`npm ls @apexacc/cli @apexacc/audit @apexfdn/apex @copilot-mcp/apex @apexfdn/copilot-mcp 2>/dev/null || echo "safe"`
- 檢查 coding agent 的 MCP 設定檔（如 `~/.apex/agent/mcp.json`、`~/.claude/settings.json` 等）裡有沒有不是自己加的 MCP server 項目，尤其是指向不熟悉網域的項目
- 若已安裝：移除套件、檢查 shell history 與端點日誌確認感染範圍，並**假設所有本機 secret 已洩漏**——輪換錢包憑證、seed phrase、API key、雲端 token、GitHub token

**長期架構**
- 安裝任何 npm 套件或 MCP server 前，核對 package 作者與 GitHub 帳號的歷史，別因為對方開發佈會、上 TOKEN2049 這類活動就當作背書
- coding agent 的 MCP server 清單應該要有白名單機制，而不是檔案存在就信任；可參考 Netzilo 的 MCP server runtime governance 做 allowlist 管控
- 對 AI 相關的第三方套件，用 Protect AI 之類的工具掃描其行為（網路呼叫目的地、是否竄改其他已安裝套件設定），而不只看靜態程式碼
- API 端點與 MCP server 設定異動應該要能被偵測與告警，而不是靜默持久化

## 影響範圍

目前兩個套件和對應的 GitHub repo 已被下架，但攻擊者的基礎設施（`apexaccs[.]org`、`apexfdn[.]xyz`）至少從 2026 年 4 月就存在，期間透過社群媒體主動接觸加密貨幣錢包與市場情報工具開發者，並有實體活動曝光做信任背書，實際安裝規模尚未有官方數字。Elastic 在報告中指出已觀察到本機檔案內容外流到攻擊者端點，但「沒有觀察到被竄改的模型回應」——也就是這次還停在竊聽／外洩階段，沒有證據顯示攻擊者已經主動操縱 agent 的輸出或行為，但 MCP server 這條管道理論上具備這個能力。

如果你的開發環境會動態安裝 MCP server 或讓 coding agent 自動讀寫自己的設定檔，這條攻擊面是打開的：建議把 agent 的設定檔納入版本控制或至少做變更偵測,任何非預期的 MCP server 項目都該視為入侵指標處理。

## 今日收穫

這次事件比單純的「惡意套件偷 .env」更麻煩一層：攻擊者不是直接拿金鑰跑路，而是先把自己塞進 AI agent 的運作迴圈裡——偽裝成 OpenRouter 收走所有 prompt 和工具輸出，再透過自己掛的 MCP server 持續影響 agent 之後怎麼決策。供應鏈攻擊的終點,正在從「偷一次憑證」變成「長期寄生在 agent 的決策鏈上」。

## 參考資料

- [Elastic Security Labs - Apex Accelerator: Malicious npm packages target Web3 startups](https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages)
- [The Hacker News - Fake Web3 Accelerator Uses npm Packages to Spread Malware and Hijack AI Agent Traffic](https://thehackernews.com/2026/10/fake-web3-accelerator-uses-npm-packages.html)
- [securityonline.info - Malicious npm Packages From Fake Web3 Accelerator Apex Deliver Stealers and Hijack AI Coding Agents](https://securityonline.info/apex-malicious-npm-packages-web3/)
- [Safeguard Blog - Fake Web3 Accelerator Ships npm 'AI Copilot' That Reroutes Agent Traffic](https://safeguard.sh/resources/blog/apex-accelerator-npm-ai-agent-hijack-crypto-founders)
- [Jamf Threat Labs - CloudSyncD macOS Backdoor via Fake Zoom Installer](https://www.jamf.com/blog/cloudsyncd-macos-backdoor-fake-zoom-installer/)
