---
title: "資安警報｜Postgres MCP Server 限制模式繞過讀出主機任意檔案——CVE-2026-85620(CVSS 9.2),廠商安全信箱失聯三個月未修補"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "postgres-mcp(PyPI 上的 Postgres MCP Pro)存在限制模式繞過漏洞,攻擊者可透過 FROM 子句呼叫 pg_read_file 等函式讀取主機任意檔案,截至本文撰寫時間仍無官方修補版本。"
tldr: "獨立研究者 George Chen 於 2026 年 6 月 6 日回報 postgres-mcp(Postgres MCP Pro,PyPI 套件,by crystaldba)的限制模式繞過漏洞:SQL 安全層只檢查 SELECT 清單裡直接呼叫的函式,沒檢查 FROM 子句裡當成資料表使用的函式,導致 pg_read_file 等危險函式能繞過白名單讀出主機任意檔案,且因為這類函式本身是唯讀操作,連「唯讀交易」這層防護也擋不住。CVE-2026-85620 於 9 月 4 日正式公開,CVSS v4.0 評 9.2(Critical)。廠商安全信箱早已失聯、也沒開 GitHub Security Advisory,回報後三個月仍無修補版本。防禦:立即檢查連線角色是否具備讀檔權限,並暫停把不受信任輸入送進 execute_sql 工具。"
series:
  name: "AI Security Alert"
  order: 23
---

> 🌏 [English version](/en/posts/daily/2026-09-06-security-postgres-mcp-restricted-mode-bypass-en)

## 事件概述

獨立研究者 George Chen 發現 `postgres-mcp`(PyPI 上的 Postgres MCP Pro,由 crystaldba 開發,讓 AI agent 透過 Model Context Protocol 查詢與管理 PostgreSQL 資料庫)存在一個「限制模式」(restricted / read-only mode)繞過漏洞:攻擊者只要把原本會被擋下的危險函式從 SQL 的 SELECT 清單移到 FROM 子句裡當成資料表使用,就能繞過函式白名單檢查,讀出資料庫伺服器行程能存取的任意檔案。這個漏洞已編號 CVE-2026-85620,CVSS v4.0 評為 9.2(Critical)。更值得注意的是時間線:研究者 2026 年 6 月 6 日就已回報,但廠商的安全信箱早就無法使用、GitHub 也沒開啟 Security Advisory 功能,CVE 一直拖到 9 月 4 日才正式公開,截至本文撰寫時間(9 月上旬)仍無官方修補版本。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | MCP server 存取控制繞過(CWE-863 Incorrect Authorization)導致任意檔案讀取 |
| 影響範圍 | PyPI 套件 `postgres-mcp`(Postgres MCP Pro),0 版本至 0.3.0(含)所有已發布版本;連線用的 PostgreSQL 角色若具備 `pg_read_server_files` 權限或為 superuser(常見預設值),風險最高 |
| 嚴重程度 | Critical(CVSS v4.0 9.2、CVSS v3.1 8.6;無需通過限制模式本身的驗證即可觸發;截至撰稿時間尚無官方修補版本) |
| CVE | CVE-2026-85620 |
| 來源 | [GitHub Issue #178(原始揭露)](https://github.com/crystaldba/postgres-mcp/issues/178), [IONIX Threat Center](https://www.ionix.io/threat-center/cve-2026-85620), [VulnCheck Advisory](https://www.vulncheck.com/advisories/postgres-mcp-pro-0.3.0-restricted-mode-bypass-via-from-clause-function), [AI Stack Current 新聞報導](https://aistackcurrent.com/news/postgres-mcp-pro-cve-2026-85620-restricted-mode-bypass) |

## 攻擊面分析

`postgres-mcp` 的 SQL 安全層(`safe_sql.py`)用抽象語法樹(AST)節點類型來判斷一段 SQL 安不安全:直接呼叫的函式會被解析成 `FuncCall` 節點,程式碼會檢查這種節點的函式名稱是否在允許清單裡;但一個函式如果被放在 `FROM` 子句裡當成資料表來源使用,解析出來的是另一種節點類型 `RangeFunction`——這種節點雖然也在「允許的節點類型」清單上,程式卻從未回頭檢查它包著的函式名稱。換句話說,同一個函式,寫在 SELECT 清單裡會被擋下,寫在 FROM 子句裡卻能直接放行,包括讀取伺服器檔案的 `pg_read_file`、列目錄的 `pg_ls_dir`、讀二進位檔的 `pg_read_binary_file` 等函式。

這個漏洞能生效的第二個原因,是限制模式的另一層防護——「唯讀交易」——本身就管不到這類函式。限制模式的設計邏輯是「查詢包在唯讀交易裡執行,寫入操作會被資料庫拒絕」,但 `pg_read_file` 這類函式對 PostgreSQL 來說就是一個「讀取」動作,唯讀交易完全不會攔它。也就是說,兩層防護(AST 函式白名單、唯讀交易)剛好在同一類函式上都有各自的死角,疊在一起也補不住。更需要留意的是攻擊入口:能把 SQL 送進 `execute_sql` 這個工具的,通常是 LLM agent 自己根據使用者需求或間接讀到的內容產生的查詢——如果 agent 讀取的網頁、文件裡藏有間接提示注入(indirect prompt injection),攻擊者不需要直接連上 MCP server,只要能影響 agent 的輸入內容,就有機會誘導它產生落入 FROM 子句這個繞過路徑的查詢。

對照 OWASP LLM Top 10,這起事件同時命中兩項:**LLM06 Excessive Agency**——把資料庫接給 agent 使用時,常見做法是直接用 superuser 或具備 `pg_read_server_files` 的角色連線,遠超過「讓 agent 查詢應用資料」實際需要的權限,一旦應用層的限制模式出現漏洞,底層資料庫角色的完整權限就毫無保留地暴露出來;**LLM01 Prompt Injection**——因為 `execute_sql` 工具收到的 SQL 是 LLM 產生的內容,而 LLM 的輸出可被提示注入操縱,原本設計來保護唯讀存取的限制模式,在這個情境下等於是想靠應用層邏輯擋住一個攻擊者能間接操控輸入的入口,防線本來就先天脆弱。

## 防禦做法

現在能立即做的是把防線退回資料庫角色權限這一層——不管應用層的限制模式有沒有漏洞,只要連線角色本身讀不到伺服器檔案,這條攻擊路徑就打不穿;長期則要把「AST 節點類型白名單」這種靠語法位置判斷安全性的設計視為紅旗,任何把 LLM 產生內容送進真實系統的 MCP server,都該假設應用層檢查會被繞過,用最小權限的資料庫角色當最後一道防線。watchlist B7 中專注 agent／工具鏈安全稽核的公司,適合用來做這類部署前檢查。

**立即動作**
- 稽核組織內是否有服務使用 `postgres-mcp`(PyPI 套件),若有先確認 MCP server 連線用的 PostgreSQL 角色是否具備 `pg_read_server_files` 權限或本身就是 superuser——即使應用層漏洞未修,把角色降到不含這項權限,攻擊者就算觸發繞過也讀不到檔案
- 若無法立即調整角色權限,考慮暫停把不受信任輸入(agent 自動產生的查詢、可能受 prompt injection 影響的內容)導入 `execute_sql` 工具的路徑,直到有正式修補
- 監控資料庫查詢日誌,留意 `pg_read_file`、`pg_ls_dir`、`pg_read_binary_file`、`pg_stat_file` 等函式以 `FROM` 子句形式(而非一般 SELECT 清單)出現的紀錄
- 追蹤 [crystaldba/postgres-mcp](https://github.com/crystaldba/postgres-mcp) 專案動態,一旦釋出修補版本,除了升級版本號,還要實際驗證 FROM 子句的繞過路徑確實被擋下

**長期架構**
- 任何「應用層安全模式」都不該是唯一防線——資料庫連線角色的最小權限,才是無論應用層邏輯有沒有漏洞都能生效的邊界
- 稽核組織內所有把 agent 生成的 SQL、shell 指令或檔案路徑送進真實系統執行的 MCP server,檢查它們的輸入驗證是否也存在「只檢查某一種語法位置」的死角
- 建立內部 MCP server 上線前的標準檢查清單,明確要求「安全模式」機制必須涵蓋所有可達成同等效果的語法變形,而不是只擋最直覺的那一種寫法
- 評估 watchlist B7 中 Invariant Labs 或 Protect AI 的 MCP／agent 工具鏈安全掃描能力,對內部部署的 MCP server 做輸入驗證與資料庫角色權限的自動化稽核

## 影響範圍

這起事件的時間線本身就是一個警訊:研究者 6 月 6 日就已透過 GitHub Issue 公開回報(廠商的安全信箱 `info@crystaldba.ai` 早已無法送達,GitHub Security Advisory 功能也未啟用,研究者別無選擇只能公開發問題),CVE 卻拖到 9 月 4 日才正式編號公開,中間有近三個月的時間,這個漏洞雖然技術細節已公開在 GitHub 上,卻沒有正式的 CVE 追蹤與修補壓力。截至本文撰寫時間,`crystaldba/postgres-mcp` 倉庫仍未發布修補版本。根據 [cryptorank.io 引用的產業報告](https://cryptorank.io/news/feed/4624f-postgres-mcp-pro-restricted-mode-bypass-exposes-the-gap-in-ai-database-security)(⚠️ 單一來源，規模數據待其他管道交叉驗證),MCP 生態圈整體已有超過 1 萬個公開伺服器與每月近億次 SDK 下載量,這起事件是同一批「AI 資料庫中介層安全模型跟不上採用速度」問題裡的一個具體案例。

如果你的 agent 系統把 `postgres-mcp` 接到生產資料庫,且連線角色權限沒有收斂到最小必要範圍,這起事件代表限制模式提供的保護目前形同虛設。由於漏洞細節與可重現的技術報告已經完全公開超過三個月,任何知道這個弱點的人都能直接套用,不需要再自行研究。

## 今日收穫

過去看到「限制模式」「唯讀模式」這類名稱,會直覺假設它已經涵蓋了「唯讀等於安全」的完整範圍,但這次事件提醒我唯讀交易只保證「不能寫入」,不保證「讀取的內容都是預期範圍內的資料」——像 `pg_read_file` 這種函式,對資料庫來說是唯讀操作,對系統來說卻是檔案讀取。應用層的安全模式永遠只能防住它設計時想到的攻擊面,真正能兜底的邊界,是底層資源(這裡是資料庫角色)本身的最小權限。

## 參考資料

- [\[Security\] Restricted (read-only) mode bypass: arbitrary server-side file read via FROM-clause function — GitHub Issue #178](https://github.com/crystaldba/postgres-mcp/issues/178)
- [CVE-2026-85620 – Restricted-Mode Bypass / Arbitrary File Read – Postgres MCP Pro ≤ 0.3.0 — IONIX Threat Center](https://www.ionix.io/threat-center/cve-2026-85620)
- [Postgres MCP Pro 0.3.0 Restricted-Mode Bypass via FROM-Clause Function — VulnCheck Advisory](https://www.vulncheck.com/advisories/postgres-mcp-pro-0.3.0-restricted-mode-bypass-via-from-clause-function)
- [CVE-2026-85620 bypasses Postgres MCP Pro restricted mode and can expose host files — AI Stack Current](https://aistackcurrent.com/news/postgres-mcp-pro-cve-2026-85620-restricted-mode-bypass)
- [CVE Record: CVE-2026-85620 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-85620)
