---
title: "資安警報｜Omnigent Agent Bundle 上傳漏洞——三個嚴重 CVE 讓已登入使用者拿下 Runner 主機"
date: 2026-08-23
category: daily
tags: [ai-agent, security, daily, privilege-escalation, mcp]
lang: zh-TW
description: "開源 AI agent meta-harness Omnigent（GitHub 9,100+ stars，可包裝 Claude Code / Codex / Cursor）被揭露三個嚴重漏洞，任何已登入的一般使用者都能透過上傳 agent bundle 拿到 runner 主機的指令執行權限或任意檔案存取"
tldr: "Omnigent 是一個用來統一管理 Claude Code、Codex、Cursor 等 coding agent 的開源 meta-harness，8/21 被揭露三個 CVE：CVE-2026-62674（CVSS 9.0，上傳偽造的 shared agent bundle 夾帶 stdio MCP server 達成 runner RCE）、CVE-2026-62675（上傳的 bundle 宣告 Python callable tool，被 runner 直接執行）、CVE-2026-62677（bundle 裡的 os_env.cwd 未驗證，可讓 agent 讀寫整個 runner 主機檔案系統並洩露環境變數中的憑證）。三者共同根源是 agent bundle 上傳路徑對租戶提供的內容信任過頭。官方已在 0.3.0 修補，多人共用或公司自架的 Omnigent 部署應立即升級。"
series:
  name: "AI Security Alert"
  order: 9
---

## 事件概述

開源專案 [Omnigent](https://github.com/omnigent-ai/omnigent) 是一個定位為「meta-harness」的 AI agent 編排框架，讓使用者用同一個伺服器統一包裝、調度 Claude Code、Codex、Cursor、OpenCode 等各家 coding agent，並提供多人共用 session、policy 與 sandbox 控管。專案上線僅兩個多月（2026 年 6 月 11 日建立），GitHub 星數已突破 9,100，成長速度極快。2026 年 8 月 21 日，Omnigent 官方一次公告了三個嚴重漏洞（CVE-2026-62674、CVE-2026-62675、CVE-2026-62677），全部圍繞同一個問題：agent bundle 上傳端點對「租戶自己上傳的內容」信任過頭，讓任何已登入、只有一般 session 編輯權限的使用者，都能在共用或公司自架的 Omnigent runner 主機上執行任意指令、讀寫整個檔案系統，或竊取 runner 環境裡的憑證。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Broken Access Control → Remote Code Execution / Privilege Escalation（AI Agent 框架） |
| 影響範圍 | Omnigent < 0.3.0 的多人共用 / 公司自架部署（server 模式） |
| 嚴重程度 | Critical（CVE-2026-62674 CVSS 9.0） |
| CVE | CVE-2026-62674、CVE-2026-62675、CVE-2026-62677 |
| 來源 | [GitHub Security Advisory GHSA-jrrm-9hc7-2v3h](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-jrrm-9hc7-2v3h)、[GHSA-756x-9hf6-q4h4](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-756x-9hf6-q4h4)、[GHSA-p8rw-8qj3-hf33](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-p8rw-8qj3-hf33)、[The Hacker Wire](https://www.thehackerwire.com/omnigent-critical-command-injection-via-shared-agent-bundle-cve-2026-62674/)、[CVE.report](https://cve.report/software/omnigent-ai/omnigent) |

## 攻擊面分析

三個漏洞都是走同一條路徑進去：`POST /v1/sessions` 或 `PUT /sessions/{session_id}/agent` 允許使用者上傳完整的 agent bundle（一份描述 agent 行為、工具與執行環境的設定檔），但伺服器端對這份「使用者自帶」的設定檔驗證不足。

**CVE-2026-62674**：`PUT /sessions/{session_id}/agent` 端點正確檢查了呼叫者對該 session 的 `LEVEL_EDIT` 權限，卻沒有檢查對象是不是一個 `session_id` 為 `None` 的共用／範本 agent。攻擊者只要對自己有編輯權限的 session 送出這個請求，就能把公司內部共用的範本 agent 整包換掉，並在裡面塞一個 `stdio` MCP server。之後任何人（包含其他無關使用者）建立新 session 用到這個被動過手腳的共用 agent 時，Omnigent 的 `tools/mcp.py` 就會以 runner 進程的權限啟動攻擊者指定的指令——等於用「一般使用者的編輯權限」換到了「runner 主機的指令執行權」。

**CVE-2026-62675**：問題不在共用 agent，而在使用者自己上傳的 bundle。伺服器驗證了 bundle 格式，卻沒擋掉其中宣告 `type: function` + `callable:` 的 Python callable 工具。這類工具原本是給受信任的本機開發者用的功能，上傳路徑卻同樣接受來自租戶的 bundle，一旦被叫用，runner 就會 import 並執行那段指向 `subprocess.check_output` 之類危險呼叫的 Python callable，直接在共用主機上跑本機指令。

**CVE-2026-62677**：更根本的問題——bundle 裡 `os_env.cwd` 欄位完全沒有驗證、沒有正規化、也沒有邊界檢查，攻擊者可以把它設成 `/` 或任意其他使用者的家目錄。如果部署時沒設定 `OMNIGENT_RUNNER_WORKSPACE` 環境變數（純 CLI／host 啟動的 session 才會自動設），agent 的檔案讀寫與 shell 工具的「邊界檢查」就會把整個主機檔案系統視為合法範圍，攻擊者可用 `sys_os_shell("env")` 之類指令直接撈出 runner 進程繼承的所有環境變數（其中往往就是各種 API 金鑰與雲端憑證）。

三者對照 OWASP LLM Top 10，都落在 **LLM06 Excessive Agency**（agent 對 runner 主機的權限遠超它實際該有的範圍）與傳統的 **Broken Access Control**（伺服器沒有把「租戶上傳的資料」與「操作者才能設定的行為」分開驗證）交界處：問題不是 prompt injection 騙過了模型，而是後端 API 本身對「使用者可控的設定檔」信任邊界畫錯了。

## 防禦做法

**立即動作**
- 檢查是否使用 Omnigent server 模式且對外／對多人開放：`omnigent --version`，低於 0.3.0 立即升級
- 若一時無法升級，暫時關閉共用／範本 agent 的重新綁定功能，或限制哪些帳號有 `LEVEL_EDIT` 權限
- 檢查部署時是否已設定 `OMNIGENT_RUNNER_WORKSPACE`（未設定的部署對 CVE-2026-62677 完全暴露）
- 假設已受影響的部署上 runner 進程可存取的所有憑證（雲端 key、資料庫密碼、內部服務 token）已洩漏，全面輪換

**長期架構**
- 對任何「使用者可上傳設定檔驅動 agent 行為」的系統，把上傳內容當成不可信輸入處理，而不是只在 UI 層擋掉某些欄位——三個漏洞的共通教訓是伺服器端多處驗證路徑（一般 session、共用 agent、cwd 邊界）各自為政、沒有統一走同一套信任邊界檢查
- 多人共用的 agent runner 主機應該預設啟用 sandbox（不要讓 `sandbox.type: none` 對租戶上傳的 bundle 生效），並強制設定 workspace 邊界，不要仰賴「部署方記得設環境變數」這種選配防線
- 導入 watchlist 中 Invariant Labs 一類做 agent 安全 formal verification 的工具，或用 Netzilo 的跨平台 agent runtime governance 做 kill switch，降低單一框架漏洞造成的爆炸半徑

## 影響範圍

Omnigent 上線兩個多月已累積超過 9,100 顆星、成長速度在同類專案中名列前茅，且明確主打「統一包裝 Claude Code / Codex / Cursor」——換言之，受影響的不只是 Omnigent 自己的使用者，而是所有把既有 coding agent 透過它跑在共用或公司自架伺服器上的團隊。三個漏洞都已在 0.3.0 修補，官方公告未提及是否已有實際被利用的案例，目前也沒有公開 PoC。但由於攻擊門檻低（只需一個一般帳號的 session 編輯權限，不需要管理員）、影響是完整的 runner 主機 RCE 或任意檔案存取，任何還在跑舊版且開放多人使用的部署都應視為高風險，優先升級。

如果你的團隊也在用類似的 meta-harness 或自架 agent 平台讓多人共用同一批 runner，這次事件是一個提醒：agent 生態系裡「使用者可上傳的設定檔」正在變成新的攻擊面，重要程度不亞於傳統的檔案上傳漏洞。

## 今日收穫

過去談 AI agent 安全常聚焦在 prompt injection——騙模型做壞事。這次 Omnigent 的三個漏洞完全不需要碰模型，純粹是「允許使用者上傳結構化設定檔」這個功能本身的權限檢查沒做全：傳統 Web 安全裡最基本的「不要信任使用者輸入」，換成 agent bundle 的外殼後，同一批開發者還是會漏掉。agent 框架越是把「用設定檔描述行為」當賣點，就越需要把這份設定檔當成不可信輸入，用跟檔案上傳、反序列化一樣的警覺心去驗證。

## 參考資料

- [GitHub Security Advisory GHSA-jrrm-9hc7-2v3h（CVE-2026-62674）](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-jrrm-9hc7-2v3h)
- [GitHub Security Advisory GHSA-756x-9hf6-q4h4（CVE-2026-62675）](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-756x-9hf6-q4h4)
- [GitHub Security Advisory GHSA-p8rw-8qj3-hf33（CVE-2026-62677）](https://github.com/omnigent-ai/omnigent/security/advisories/GHSA-p8rw-8qj3-hf33)
- [The Hacker Wire: Omnigent Critical Command Injection via Shared Agent Bundle](https://www.thehackerwire.com/omnigent-critical-command-injection-via-shared-agent-bundle-cve-2026-62674/)
- [CVE.report: Omnigent vulnerabilities](https://cve.report/software/omnigent-ai/omnigent)
- [Omnigent GitHub repository](https://github.com/omnigent-ai/omnigent)
