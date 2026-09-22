---
title: "資安警報｜MaxKB AI Agent 掛上工具就預設開 shell，CVSS 10.0 讓 prompt injection 直接變 root RCE"
date: 2026-09-23
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "開源企業 AI agent 平台 MaxKB 被揭露 CVE-2026-77521：只要 assistant 掛上任何工具、MCP 工具、skill 或子應用程式，就會自動取得一個沒有人工核准、以 root 執行的 shell 工具，讓間接 prompt injection 能直接變成命令注入"
tldr: "Lasso Security 發現 MaxKB 的 assistant 只要接上工具、MCP 工具、skill 或子應用程式的任何一種，背後的 SandboxShellBackend 就會自動附贈一個 execute shell 工具，而 MaxKB 既沒有把它排除在工具清單外，也沒有把它加進需要人工核准的 interrupt_on 名單——等於這個 shell 工具對任何能讓 agent 讀到的文字（客服工單、RAG 文件）完全開放。公開或內嵌的匿名 assistant 因為不需要任何權限就能觸發，CVSS 直接打到滿分 10.0。已在 v2.10.5-lts 修補，尚無證據顯示已被實際利用。"
series:
  name: "AI Security Alert"
  order: 36
---

> 🌏 [English version](/en/posts/daily/2026-09-23-security-maxkb-agent-shell-rce-en)


## 事件概述

安全公司 Lasso Security 揭露開源企業 AI assistant／agent 平台 MaxKB（1Panel-dev 維護）的一個嚴重漏洞：只要一個 assistant 掛上工具、MCP 工具、skill 或子應用程式的任何一種，MaxKB 就會透過 `deepagents` 函式庫自動建立一個 `SandboxShellBackend`，附贈一個能執行任意 shell 指令的 `execute` 工具——而這個工具既不在排除清單裡，也沒有被納入需要人工核准的動作名單。結果是：任何能讓 agent 讀到的不受信任文字（客服工單、上傳文件、RAG 檢索內容）都能透過間接 prompt injection 直接觸發命令執行，完全不需要使用者互動或任何權限。這起漏洞已取得編號 CVE-2026-77521，並在官方 GitHub Security Advisory（GHSA-f36j-f34j-h3rx）中以 CVSS 3.1 滿分 10.0 列為 Critical。廠商已在 2.10.5-lts 修補，目前沒有證據顯示已遭實際利用。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Prompt Injection 導向的命令注入（Prompt-Injectable Agent to Command Execution） |
| 影響範圍 | MaxKB ≤ 2.10.3-lts，任何掛上工具／MCP 工具／skill／子應用程式的 assistant；公開或內嵌的匿名 assistant 風險最高 |
| 嚴重程度 | Critical（CVSS 3.1: 10.0，`AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H`） |
| CVE | CVE-2026-77521（GHSA-f36j-f34j-h3rx） |
| 來源 | [GitHub Security Advisory](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx)、[GBHackers](https://gbhackers.com/critical-maxkb-ai-agent-flaw/)、[VulDB](https://vuldb.com/cve/CVE-2026-77521) |

## 攻擊面分析

攻擊路徑的起點是 MaxKB 的工具附掛機制。一旦操作者為 assistant 加上任何一種工具能力（工具、MCP 工具、skill、子應用程式），底層都會經由 `deepagents` 的 `create_deep_agent` 建出一個 `SandboxShellBackend`，這個 backend 除了原本要提供的功能之外，還會順帶附上一個可以執行任意 shell 指令的 `execute` 工具與檔案系統相關工具。問題在於 MaxKB 從未把 `execute` 從工具清單中排除，也沒有把它加進 `interrupt_on`（需要人工核准才能執行的動作清單）——這份清單原本只涵蓋 `write_file`、`read_file`、`edit_file`，唯獨漏了殺傷力最大的 `execute`。於是攻擊者不需要騙過任何核准流程，只要讓 agent 在處理內容時「看到」一段夾帶指令的文字（例如藏在客服工單或 RAG 文件裡），模型判斷該呼叫這個工具，指令就會直接被執行。

第二層問題出在執行環境本身。原始碼部署下，`MAXKB_SANDBOX` 這個控制是否啟用沙箱的旗標預設是關閉的，指令因此透過類似 `shell=True` 的方式直接在主機上以應用程式使用者權限執行；即使是官方容器映像設了 `MAXKB_SANDBOX=1`，沙箱包裝層仍是把整條指令組成一段 shell 字串、交給一個 root shell 執行後才降權，shell 中繼字元因此能讓指令從降權後的包裝層「逃出去」——而官方映像本身還是以 root（UID 0，未設定 `USER` 指令）在跑，逃出去的指令等於直接拿到 root。對照 OWASP LLM Top 10，這同時踩中 **LLM01 Prompt Injection**（不受信任內容是整條鏈的觸發點）與 **LLM06 Excessive Agency**（一個聊天客服 assistant 完全不需要無核准的 root shell 執行權，但架構預設就給了）。

## 防禦做法

這起漏洞再次印證一個模式：agent 框架為了「方便」把工具能力打包附贈，往往會在使用者沒注意到的地方悄悄擴大攻擊面——操作者以為自己只是接了一個 MCP 工具，實際上拿到的是一整組隱藏的 shell 執行權。

**立即動作**
- 升級到 MaxKB **2.10.5-lts** 或更新版本
- 無法立即升級者：盤點所有掛上工具／MCP 工具／skill／子應用程式的 assistant，若非必要就先移除這些能力；確認原始碼部署的 `MAXKB_SANDBOX` 為啟用狀態（但官方也指出光靠這個旗標不足以完全阻擋，因為容器包裝層本身仍有問題）
- 對所有公開或內嵌（匿名可存取）的 assistant 特別優先處理，因為它們是 CVSS 10.0 情境下風險最高的部署方式

**長期架構**
- 任何自動附掛的工具能力，都應該預設走白名單而非黑名單——新增的 shell／檔案系統類工具應該預設被排除，需要操作者明確加回，而不是預設開放再靠事後排除
- 把「需要人工核准」的動作清單（如 MaxKB 的 `interrupt_on`）視為安全邊界的一部分做定期稽核，確認清單涵蓋所有高風險操作，而不只是常見的讀寫檔案
- 評估導入 watchlist B7 中 Protect AI 或 Prompt Security 這類專門掃描 agent 工具鏈與依賴套件的資安工具，在部署前就能標出「工具附贈了什麼你沒預期到的權限」

## 影響範圍

漏洞由 Lasso Security 以協調揭露方式回報，GHSA 顧問明確說明其概念驗證僅在自建的測試部署上執行，並未針對第三方正式環境進行攻擊；目前沒有任何來源指出這個漏洞已在真實環境中被利用。但由於 MaxKB 是開源、可自架的企業 AI assistant 平台，任何公開部署且掛有工具能力的匿名 assistant，理論上都落在 CVSS 10.0 這個「無需權限、無需使用者互動」的最高風險情境內，這代表修補前的暴露面取決於有多少部署對外公開存取，而非需要攻擊者取得任何帳號。

如果你的團隊也在用類似 MaxKB 這種「掛上工具就自動附贈執行環境」的 agent 框架，這起事件值得回頭檢查自己系統裡是否也有同樣「工具能力附贈了未預期權限」的隱藏路徑——尤其是任何會處理不受信任輸入（客服工單、上傳文件、網頁抓取內容）的 assistant。

## 今日收穫

這起漏洞最值得記住的不是 CVSS 10.0 這個數字，而是它的成因：不是某個工具本身寫錯了，而是「附掛工具」這個動作本身，在框架設計上悄悄多送了一個沒人要求過的 shell 執行權，而且連人工核准這道最基本的防線都沒接上。這提醒我們評估 agent 框架安全性時，不能只問「我明確開的工具安不安全」，還要問「我開了這個工具之後，框架在背後幫我多開了什麼」。

## 參考資料

- [GitHub Security Advisory GHSA-f36j-f34j-h3rx: Prompt-injectable agent can lead to command execution](https://github.com/1Panel-dev/MaxKB/security/advisories/GHSA-f36j-f34j-h3rx)
- [GBHackers: Critical MaxKB AI Agent Flaw](https://gbhackers.com/critical-maxkb-ai-agent-flaw/)
- [VulDB: CVE-2026-77521](https://vuldb.com/cve/CVE-2026-77521)
- [Strix.ai CVE Advisory: CVE-2026-77521](https://www.strix.ai/cve/CVE-2026-77521)
