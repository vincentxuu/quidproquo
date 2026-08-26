---
title: "資安警報｜Check Point 稽核六大 AI Agent 框架揪出 21 個問題——LangGraph Checkpointer 一條鏈就是未授權 RCE"
date: 2026-08-27
category: daily
tags: [ai-agent, security, daily, prompt-injection, supply-chain]
lang: zh-TW
description: "Check Point Research 在 Black Hat USA 2026 發表為期一年的橫向稽核：LangChain、LangGraph、CrewAI、AutoGen、Microsoft Agent Framework、Google ADK 六大框架共 21 項問題、12 個 CVE，核心是攻擊者不需呼叫任何工具，只要讓資料寫進框架自己的狀態持久化層，下次讀取時就會觸發程式碼執行"
tldr: "Check Point 研究員 Shahar Tal 與 Yarden Porat 在 Black Hat USA 2026 發表「No Tools Required」研究，稽核六大主流 agent 框架找到 21 項問題、12 個 CVE。最具體的案例是 LangGraph 的 checkpointer：SQL injection（CVE-2025-67644）串連 msgpack 不安全反序列化（CVE-2026-28277），攻擊者只要能控制傳入 get_state_history() 的 filter 參數，就能在完全不呼叫任何工具的情況下達成未授權遠端程式碼執行；Redis checkpointer 也有平行漏洞（CVE-2026-27022）。三者均已修補。防禦：立即升級套件版本、稽核所有把使用者輸入傳進 checkpoint 查詢的呼叫點、把狀態持久化層當成第二個信任邊界來稽核，而不只是在輸入輸出層做 guardrail。"
series:
  name: "AI Security Alert"
  order: 13
---

> 🌏 [English version](/en/posts/daily/2026-08-27-security-langgraph-checkpointer-post-injection-rce-en)

## 事件概述

Check Point Research 的 Shahar Tal（Head of Agentic Security Innovation）與 Yarden Porat（security researcher）在 8 月 5 日的 Black Hat USA 2026 發表研究「No Tools Required: Post-Injection Exploitation Across AI Agent Frameworks」。這是一年份的橫向稽核，對象是目前產業實際拿來蓋 agent 的六大框架：LangChain、LangGraph、CrewAI、AutoGen、Microsoft Agent Framework、Google ADK,共發現 21 項安全問題,其中 12 個獲派 CVE 編號。核心論點很直接:prompt injection 本身不是終點,而是攻擊者進入框架內部「狀態持久化層」（checkpoint、memory、session store）的敲門磚——一旦惡意資料被寫進這些框架自己信任的儲存機制,後續讀取時觸發的 SQL 查詢組裝、反序列化等舊時代漏洞類型,完全不需要攻擊者呼叫任何工具、也不需要繞過任何 guardrail。

最完整公開的技術範例是 LangGraph 的 checkpointer:一個 SQL injection（CVE-2025-67644）串連一個不安全的 msgpack 反序列化（CVE-2026-28277）,兩者合起來就是未授權遠端程式碼執行；Redis checkpointer 上還有一個平行的注入漏洞（CVE-2026-27022）。LangGraph 月下載量超過 5,000 萬次,是目前最主流的開源 agent 框架之一,受影響的是所有自架（self-hosted）且使用 SQLite 或 Redis checkpointer 的部署,LangChain 自家托管的 LangSmith Deployment 因為底層用 PostgreSQL 而不受此鏈影響。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | SQL Injection + Insecure Deserialization → Remote Code Execution |
| 影響範圍 | LangChain、LangGraph、CrewAI、AutoGen、Microsoft Agent Framework、Google ADK 共 6 個框架，21 項發現、12 個 CVE |
| 嚴重程度 | Critical（LangGraph 鏈可達未授權 RCE；部分其他框架漏洞經 bug bounty 處理，CVSS 最高 9.3） |
| CVE | CVE-2025-67644、CVE-2026-28277、CVE-2026-27022（LangGraph）；另有 CVE-2025-68664（LangChain-core「LangGrinch」）等共 12 個 |
| 來源 | [Check Point Research](https://research.checkpoint.com/2026/from-sqli-to-rce-exploiting-langgraphs-checkpointer/)、[Check Point Blog](https://blog.checkpoint.com/research/when-your-ai-agents-memory-becomes-a-security-liability/)、[GitHub Security Advisory](https://github.com/langchain-ai/langgraph/security/advisories/GHSA-9rwj-6rc7-p77c)、[The Hacker News](https://thehackernews.com/2026/06/langgraph-flaw-chain-exposes-self.html) |

## 攻擊面分析

以 LangGraph 為例,攻擊路徑的入口是 `get_state_history()`——這是應用程式用來查詢 agent 歷史 checkpoint 的 API,內部呼叫 checkpointer 的 `list()` 方法。問題出在 `_metadata_predicate()` 這個函式:它把呼叫端傳入的 `filter` 字典的**值**做了參數化綁定,但字典的**鍵（key）**卻直接用字串插入拼進 SQL 的 `json_extract()` 表達式裡。只要應用程式讓使用者、工具回傳的內容或檢索到的文件能影響傳給 `filter` 的鍵,攻擊者就能塞進任意 SQL 片段。

拿到 SQL injection 之後,攻擊者用 `UNION SELECT` 偽造一筆 checkpoint 資料列,讓查詢結果多回傳一列自己控制的 `checkpoint` BLOB 欄位。這裡是關鍵轉折:LangGraph 讀出 checkpoint 資料後會呼叫 `self.serde.loads_typed()` 做反序列化,若型別是 `msgpack`,實際跑的是 `ormsgpack.unpackb(data, ext_hook=self._unpack_ext_hook)`。而 `_unpack_ext_hook` 的實作等同「匯入任意模組 → 取出任意屬性 → 用任意參數呼叫」——這是與 Python `pickle` 反序列化漏洞同等級的萬用 gadget,只是換了一個序列化格式,一樣能組出 `("os", "system", "curl ... | sh")` 這種任意指令執行。三個各自不算新奇的漏洞(SQL injection、字典鍵未驗證、反序列化未限制物件型別),串起來就是一條完整的未授權 RCE 鏈,而且全程沒有任何工具被呼叫、模型也沒被越獄。

Check Point 把這類攻擊統稱為「post-injection exploitation」:與傳統 prompt injection 在**當下這一回合**就生效不同,這類漏洞是把惡意資料寫進框架的**耐久狀態**（checkpoint/memory/session）,等到之後某個不同的使用者、不同的 session 讀取並「還原」這筆狀態時,payload 才真正引爆——研究團隊稱之為 delayed-execution injection。同一份研究還點出另外兩種相關技巧:cross-agent propagation(多 agent 架構下,被攻陷 agent 的輸出成為其他 agent 信任的輸入,橫向擴散）,以及 persistent memory poisoning(惡意內容寫進長期記憶儲存,重啟後依然存在、持續污染未來 session)。橫跨六個框架的其他發現包括:Microsoft Agent Framework 的 checkpoint 反序列化漏洞（$10,000 bounty)、Google ADK 一個未驗證身分就能寫檔並觸發 import-time 程式碼執行的隱藏開發用端點（$3,133.70 bounty）,以及 CrewAI 在 RAG pipeline 的 SSRF、任意檔案讀取與 sandbox escape。

這些漏洞類型（CWE-89 SQL injection、CWE-502 不安全反序列化）其實不是 OWASP LLM Top 10 原本設計要涵蓋的「模型層」風險,更接近傳統 Web 應用安全問題透過「agent 需要記住東西」這個新場景重新浮現。硬要對照的話最接近 **LLM08 Excessive Agency** 的變形——框架本身被賦予了對自己序列化狀態「無條件信任並還原」的過度信任,沒把讀寫這層資料當成需要驗證的信任邊界。

## 防禦做法

**立即動作**
- 升級 `langgraph-checkpoint-sqlite` 到 3.0.1+、`langgraph` 到 1.0.10+、`langgraph-checkpoint-redis` 到 1.0.2+
- 稽核所有把使用者輸入、工具回傳內容或檢索文件傳進 `get_state_history()` 或 checkpointer `list()` 的 `filter` 參數的呼叫點,對鍵和值都做 allowlist 驗證
- 若使用 Microsoft Agent Framework、Google ADK、CrewAI 或 AutoGen,對照廠商公告確認是否已套用對應修補（部分以 bug bounty 形式處理、未派發 CVE 編號)
- 檢查 checkpoint 儲存後端（SQLite 檔案、Redis 實例）是否被不必要地開放給網路存取

**長期架構**
- 把「狀態持久化層」正式列為第二個信任邊界,任何寫入與讀出都要視為跨信任邊界的資料流,而不是框架內部細節
- 能用受管服務就優先用——例如 LangSmith Deployment 用 PostgreSQL,不受此鏈影響;自架 SQLite/Redis checkpointer 需要團隊有能力持續追蹤並套用上游修補
- 評估 watchlist 中 Invariant Labs 這類 agent runtime 監控工具,對「非預期的狀態讀寫模式」做異常偵測,而不是只在輸入輸出層做 guardrail
- 把這次研究揭示的三種手法——delayed-execution injection、cross-agent propagation、persistent memory poisoning——納入紅隊測試的標準情境,而非只測試傳統的當回合 prompt injection

## 影響範圍

LangGraph 三個 CVE 的揭露時間軸為:2025-11-19 通報 LangChain 團隊、2025-12-10 SQLi 修補上線、Redis 注入漏洞稍後跟進修補。Black Hat 完整揭露的 21 項發現、12 個 CVE 橫跨六大框架,受影響廠商目前均已完成修補或以 bug bounty 處理。由於這些都是開源框架層級的漏洞,而非托管 SaaS 產品本身,風險集中在「自架」部署——企業自己架設的 agent 服務如果沒有持續更新依賴套件版本,即使上游已經修補,也不會自動受益。

如果你的 agent 系統是用這幾個框架建置、且會保存跨 session 的狀態（checkpoint 或長期 memory）,這起研究代表兩件事:一是光靠內容過濾防 prompt injection 是不夠的防線,一旦攻擊者的資料被寫進框架自己的持久化機制,防禦者就需要把這一層也當成程式碼執行的潛在入口來稽核;二是評估一個 agent 框架安不安全,不能只看它擋不擋得住 prompt injection,還要看它的狀態持久化機制有沒有被當成攻擊面來設計過。

## 今日收穫

之前看到的資安警報大多聚焦在單一漏洞、單一產品,這次 Check Point 花一年時間橫向稽核六個主流框架、揪出 21 個問題的做法提醒我:agent 生態目前的風險不是某個框架特別糟糕,而是整個產業在重複踩到二十年前 Web 應用安全就學過的教訓（SQL injection、不安全反序列化、SSRF）——只是換了一個新場景。研究團隊的收尾說得很直白:「你不需要新的威脅模型,你需要把舊的威脅模型,指向一個新的地方。」這句話對我重新校準了怎麼看待 agent 框架的安全性:防禦資源不能只押注在攔截 prompt injection 這一個環節,狀態持久化、序列化格式這類「框架內部管線」同樣需要被當成攻擊面來對待。

## 參考資料

- [From SQLi to RCE - Exploiting LangGraph's Checkpointer — Check Point Research](https://research.checkpoint.com/2026/from-sqli-to-rce-exploiting-langgraphs-checkpointer/)
- [When Your AI Agent's Memory Becomes a Security Liability — Check Point Blog](https://blog.checkpoint.com/research/when-your-ai-agents-memory-becomes-a-security-liability/)
- [SQL injection via metadata filter key in SQLite checkpointer list method — GitHub Security Advisory GHSA-9rwj-6rc7-p77c](https://github.com/langchain-ai/langgraph/security/advisories/GHSA-9rwj-6rc7-p77c)
- [LangGraph Flaw Chain Exposes Self-Hosted AI Agents to Code Execution — The Hacker News](https://thehackernews.com/2026/06/langgraph-flaw-chain-exposes-self.html)
- [Black Hat 2026: Check Point Research Takes the Stage — Check Point Blog](https://blog.checkpoint.com/research/black-hat-2026-check-point-research-takes-the-stage/)
- [Black Hat 2026: Old-School Bugs Crack Open AI Agent Frameworks — Security Point Break](https://securitypointbreak.com/2026/08/07/black-hat-2026-old-school-bugs-crack-open-ai-agent-frameworks/)
- [No Tools Required: RCE Through Agent State Persistence — Replyant Lab](https://replyant.com/lab/agent-state-persistence-rce/)
