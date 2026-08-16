---
title: "資安警報｜AgenticSeek 未授權 RCE 漏洞——2.6 萬星開源 Agent 專案的 /query 端點可被任意執行 shell 指令"
date: 2026-08-16
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "開源本地 AI Agent 專案 AgenticSeek 被發現 POST /query API 端點無需任何驗證即可觸發任意 shell 指令執行，CVSS 9.3，已有修補但預設網路曝險設定仍需手動加固"
tldr: "AgenticSeek（GitHub 2.6 萬星的本地 AI Agent 專案）的後端服務預設綁定 0.0.0.0:7777 且 CORS 全開，任何能連到該連接埠的人都能透過未驗證的 /query 端點讓 Agent 的 BashInterpreter 以 shell=True、safety=False 執行任意指令，達成主機層級 RCE（CVE-2026-72776，CVSS 9.3）。專案已修補（改為預設只綁 loopback、CORS 改白名單），但舊版或未升級的部署仍暴露在外。"
series:
  name: "AI Security Alert"
  order: 1
---

## 事件概述

開源本地 AI Agent 專案 [AgenticSeek](https://github.com/Fosowl/agenticSeek)（號稱「不用付 $200/月 API 費的本地版 Manus AI」，GitHub 上有 2.6 萬顆星）被揭露存在一個未授權遠端程式碼執行（RCE）漏洞。問題出在後端的 `POST /query` API 端點：這個端點完全沒有身份驗證，預設又綁定在 `0.0.0.0:7777`（等於對外部網路開放）並將 CORS 設為允許任何來源（`allow_origins=["*"]`）。任何能連到這個連接埠的人，只要送出一段構造過的查詢，就能驅動 Agent 內建的 `BashInterpreter` 用 `subprocess.Popen(shell=True, safety=False)` 執行任意 shell 指令，繞過原本就不完整的指令黑名單，取得主機層級的完整控制權。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Missing Authentication → Remote Code Execution |
| 影響範圍 | AgenticSeek ≤ 2.41.1（commit fc242c7 及之前版本，尚未套用修補的部署） |
| 嚴重程度 | Critical（CVSS v4 9.3 / CVSS v3.1 9.8） |
| CVE | CVE-2026-72776（CWE-306 Missing Authentication for Critical Function） |
| 來源 | [GitHub Advisory Database](https://github.com/advisories/ghsa-wrjr-rgfw-cm84)、[NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-72776)、[VulnCheck](https://www.vulncheck.com/advisories/agenticseek-unauthenticated-rce-via-query-api-endpoint) |

## 攻擊面分析

攻擊路徑相當直接，不需要任何前置權限或使用者互動：攻擊者只要能連到目標主機的 7777 連接埠（同網段、或該服務被暴露到公網），就能直接對 `POST /query` 送出 HTTP 請求。這個端點原本的設計意圖，就是把使用者的自然語言查詢交給 coder agent 處理，而 coder agent 有能力生成並執行 shell 指令來完成任務——問題是這個「執行任意指令」的能力，被架在一個完全沒有身份驗證的網路介面上。

根本原因有兩層：第一是**架構層級的信任邊界缺失**——Agent 的程式碼執行能力被視為「內部功能」直接掛在對外的 API 上，沒有任何驗證機制檢查呼叫者是誰；第二是**縱深防禦的失敗**——即便有指令黑名單試圖過濾危險操作，`subprocess.Popen(..., shell=True, safety=False)` 的組合本質上就難以透過黑名單完全防堵繞過技巧。Docker Compose 的預設連接埠映射把這個問題進一步放大到「開箱即用就對外曝露」的程度。

對照 OWASP LLM Top 10，這屬於 **LLM06 Excessive Agency**（Agent 被賦予了遠超過其應有情境的執行權限）疊加傳統 Web 安全的 **Missing Authentication**——這也說明了一個持續出現的模式：AI Agent 專案的資安問題往往不是「LLM 被騙」，而是把 LLM 的能力（尤其是 code execution）掛載到傳統 Web 服務框架上時，忘記套用最基本的網路曝險與身份驗證原則。

## 防禦做法

**立即動作**
- 檢查是否有部署 AgenticSeek：確認版本是否 ≤ 2.41.1，或 commit 是否早於修補 commit [`f1eb2cf`](https://github.com/Fosowl/agenticSeek/commit/f1eb2cfc721f8a21dd16a8b048a9ca89f3259f6f)
- 立即檢查 7777 連接埠是否對外部網路或公網開放：`curl http://<你的伺服器 IP>:7777/health`（若從外部主機能連通，代表曝險）
- 若無法立即升級，先用防火牆規則將 `/query` 限制在 loopback 或受信任 IP，並停用或改寫 `BashInterpreter` 移除 `shell=True`

**長期架構**
- 升級到已修補版本：新版預設把 `BACKEND_HOST` 改為 `127.0.0.1`（只能本機存取），CORS 改為可設定的白名單（預設 `http://localhost:3000`），需要對外曝露時必須明確 opt-in 並會印出安全警告
- 任何讓 Agent 執行 shell/程式碼的服務，一律視為等同於「暴露 RCE」，比照資料庫、SSH 等敏感服務的網路隔離規格處理，不要依賴應用層黑名單當作唯一防線
- 若團隊需要對多個自架 Agent 服務做集中網路曝險盤點與存取治理，watchlist 中的 **Netzilo**（MCP/Agent runtime governance，可設 allowlist）或 **WitnessAI** 這類 Agent 存取控管工具可以補上這類「預設不安全」的架構缺口

## 影響範圍

目前公開紀錄顯示尚未有確認的大規模在野利用（NVD 未列入 KEV，EPSS 約 0.84%，屬中等偏低的短期利用機率），但漏洞本身的可利用門檻極低——不需要任何驗證、不需要使用者互動，只要網路可達即可觸發。AgenticSeek 是一個持續成長中的開源專案（近 2.7 萬星、每週約 1,000+ 下載成長），常被個人開發者或小型團隊用 Docker Compose 一鍵起服務，這類使用情境正是最容易「預設值就是曝險」的族群，尤其是把服務架在雲端主機、又沒有額外防火牆規則的情況。修補已在 PR #508 / #534 中釋出，若你或團隊有跑本地 AI Agent 服務（不限 AgenticSeek），這是一次很好的機會盤點手上有沒有類似「Agent 能執行程式碼的端點,卻裸露在網路上」的架構。

## 今日收穫

這次事件沒有用到任何 prompt injection 或越獄技巧，純粹是傳統 Web 安全的「忘記加身份驗證」——但因為後端掛的是能執行任意 shell 指令的 Agent，同一個老掉牙的錯誤,後果直接從「資料外洩」升級成「主機層級 RCE」。這提醒我評估 Agent 專案安全性時，不能只看它的 prompt injection 防護做得好不好，還要回頭檢查它暴露出來的每一個 API 端點,是否有把「LLM 的執行能力」和「網路存取控制」這兩件事分開處理。

## 參考資料

- [GHSA-wrjr-rgfw-cm84 — GitHub Advisory Database](https://github.com/advisories/ghsa-wrjr-rgfw-cm84)
- [CVE-2026-72776 — NVD](https://nvd.nist.gov/vuln/detail/CVE-2026-72776)
- [AgenticSeek Unauthenticated RCE via /query API Endpoint — VulnCheck](https://www.vulncheck.com/advisories/agenticseek-unauthenticated-rce-via-query-api-endpoint)
- [Harden default network exposure of the unauthenticated backend — Fosowl/agenticSeek PR #508](https://github.com/Fosowl/agenticSeek/pull/508)
- [Patch commit f1eb2cf — Fosowl/agenticSeek](https://github.com/Fosowl/agenticSeek/commit/f1eb2cfc721f8a21dd16a8b048a9ca89f3259f6f)
