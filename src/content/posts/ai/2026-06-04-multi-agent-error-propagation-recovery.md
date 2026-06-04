---
title: "Multi-Agent 的錯誤傳播與恢復：向分散式系統借三十年的武器"
date: 2026-06-04
category: ai
type: deep-dive
tags: [multi-agent, ai-agent, fault-tolerance, orchestration, llm]
lang: zh-TW
tldr: "每步 99% 準確率、跑 100 步，無錯完成率只剩 36%——錯誤複利是結構問題，不是 prompt 能調掉的。分散式系統的 supervisor tree、bulkhead、circuit breaker、saga、durable execution 幾乎可一對一搬進 agent 編排；但 LLM 多了一種傳統系統沒有的故障——不會 crash 的語意錯誤，得靠 Inspector agent（recover 96.4%）與冗餘投票（MAKER 百萬步零錯誤）補上。"
description: "對照 LLM multi-agent 編排與傳統分散式系統的 fault-tolerance：錯誤複利數學、MAST 14 種失敗模式、拓樸對脆弱度的影響、Erlang OTP / saga / Temporal 的借鑑清單，以及語意層錯誤為何讓傳統偵測訊號全部失效。"
draft: false
---

每步 99% 準確率聽起來很高，但跑 100 步的工作流，無錯完成率只剩 `0.99^100 ≈ 36%`；200 步剩 13%。這是「串聯可靠度」的經典數學——多步工作流只要任一步出錯就毀掉整次執行，整體成功率就是各步成功率連乘。關鍵認知：**這是結構性問題，不是 prompt 能調掉的**。模型再進步只能降低單步錯誤率 p，無法改變指數衰減的形狀。

好消息是，分散式系統對這件事已經打了三十年，武器庫幾乎可以一對一搬過來。壞消息是，LLM 多了一種傳統系統沒有的故障類別——**不會 crash 的語意錯誤**——它讓傳統 fault-tolerance 的觸發訊號全部失效。這篇把兩個世界並排，整理哪些能直接抄、哪些得自己發明。

## LLM agent 怎麼把錯誤放大

單純的機率複利只是起點，agent 協作會把單點錯誤「擴散」成系統級錯誤：

- **錯誤即知識前提**：peer-to-peer 架構下，agent B 直接吃 A 的輸出而無中間驗證——A 錯了，B 就在錯誤上推理，C 再吃 A+B 的錯誤。錯誤不是孤立事件，而是塑形所有下游推理的 epistemic input。
- **拓樸決定脆弱度**：「From Spark to Fire」（arXiv:2603.04474，單一論文的實測數字）在 LangGraph 上注入錯誤：注入 star topology 的 **leaf node 只造成 9.7% 失敗率，注入 hub node 則是 100% 系統級失敗**——orchestrator 是錯誤資訊的單點故障。Huang et al.（ICML 2025，arXiv:2408.00989）的對照實驗給出韌性排序：階層式 A→(B↔C) 在 faulty agent 下效能只掉 5.5%，線性鏈掉 10.5%，扁平 peer 討論掉 23.7%——**扁平結構會放大故障**。
- **多 agent 不一定更好**：隔離與驗證沒到位前，加 agent 是加風險，不是加可靠度。

失敗長什麼樣？錨點論文是 MAST（"Why Do Multi-Agent LLM Systems Fail?"，arXiv:2503.13657，NeurIPS 2025 Datasets & Benchmarks spotlight）：Grounded Theory 分析 150+ 條執行 trace（每條平均超過 15,000 行）、6 名專家標註（κ=0.88），歸納出 **14 個失敗模式、3 大類**——系統設計問題（違反 task/role spec、步驟重複、丟失對話歷史）、inter-agent 錯位（不問澄清、任務偏航、互相忽略輸入）、任務驗證問題（過早終止、沒驗證、驗錯）。核心 insight：**MAS 失敗主要源自 agent 間互動與系統設計，而非模型能力極限**——「well-designed MAS 用同一個底模就能拿到效能增益」。這正是向分散式系統借工程手段的立足點。

## 最關鍵的斷點：不會 crash 的語意錯誤

把 LLM 失敗對照傳統故障，多數有等價物：工具呼叫失敗 = transient fault、context 汙染 = 狀態損毀、步驟重複 = 狀態機 bug。但三種沒有：**幻覺**（自信地產生錯誤內容）、**silent semantic failure**（process 活著、回應正常、內容胡言）、**false consensus**（多 agent 互相強化錯誤，最接近拜占庭故障但成因不同）。

這三種的共通點：不丟例外、不 crash、health probe 全綠。**傳統「偵測 → 隔離 → 重啟」的觸發訊號完全失效**——這是借鑑時必須補的洞。

## 能直接抄的：隔離武器

**Supervisor tree（Erlang/OTP，30 年的標準答案）**。結構性分離：supervisor 只負責啟動、監看、重啟；business logic 全在 worker。三種重啟策略直接編碼依賴關係——`one_for_one`（子節點獨立）、`one_for_all`（緊耦合群組）、`rest_for_one`（線性依賴鏈）。再加 **restart intensity**（時間窗內重啟超過上限，supervisor 自己終止並上報）防無限重啟風暴——對應到 agent 世界，就是防「無限 replan loop 燒 credit」。"Let it crash" 哲學的正確理解：不是忽略錯誤，而是把錯誤處理從 business logic 抽離，worker 只寫 happy path。

**Bulkhead（艙壁）**：資源分區，一區故障不耗盡全船。LLM 呼叫池與工具執行池分開；Cognizant 的 Maximal Agentic Decomposition 把任務拆到「一個 agent 一個決策」、每個 agent 只拿最小必要 context——這是 bulkhead 在 context 維度的實作，直接阻擋 context drift。

**Circuit breaker（三態：Closed → Open → Half-Open）**：上游模型 API 故障時直接拒絕、優雅降級，別堆積燒 credit 的失敗請求。

隔離邊界切錯的反例教材：LangGraph 平行分支 A、B 在同一 superstep，B 成功、A 撞 rate limit 拋例外 → **整個 superstep rollback，B 的成功也不套用**。修法是給每個會 transient 失敗的 node 掛 `RetryPolicy`——對應分散式系統的「交易邊界過大導致無辜回滾」。

## 能直接抄的：恢復武器

**Retry + exponential backoff + jitter**：jitter 防 thundering herd，AWS 實測 decorrelated jitter 在多數負載下吞吐最佳。

**Saga / compensating transaction**（Garcia-Molina & Salem, 1987）：長交易拆成一串本地子交易，每步配一個補償動作，失敗就反向補償。LangGraph 1.2 起的 `error_handler` 補償分支是現成載體——對有副作用的步驟（寄信、寫 DB）定義補償動作。

**Checkpoint / event sourcing / durable execution**：Temporal 把這些打包成平台——每個重要步驟記成 append-only event log，崩潰後 replay 回到精確狀態；activity 用 idempotency token 達成副作用 exactly-once。Temporal 已宣布整合 Google ADK 與 OpenAI Agents SDK，durable execution 正被當成 agent 可靠度底座。LangGraph 的 checkpointer（每個 superstep 寫進 PostgreSQL，`thread_id` 當游標）是同一思路。

LangGraph 官方的五類錯誤分流幾乎是分散式 fault-tolerance 的 LLM 化對照表：

| 錯誤類型 | 誰來修 | 策略 | 分散式對應 |
|---|---|---|---|
| Transient（網路、rate limit） | 系統 | `RetryPolicy` | retry + backoff |
| LLM-recoverable（工具失敗、parse 錯） | LLM 自己 | error 存進 state，loop back 讓 LLM 看到再試 | **無傳統等價——LLM 獨有** |
| User-fixable（缺資訊） | 人 | `interrupt()` 暫停、可數天後 resume | human-in-the-loop |
| Recoverable after retries | 開發者 | `error_handler` 補償分支 | saga / compensation |
| Unexpected | 開發者 | bubble up | let-it-crash |

兩個借鑑時不能照抄的坑：**LLM replay 是非決定性的**（同樣輸入不保證同樣決策），所以 event sourcing 必須存「實際 LLM 回應」而非只存輸入；**工具呼叫必須 idempotent**，否則崩在「外部寫入後、checkpoint 前」會重複副作用。

## 必須自己發明的：語意層恢復

針對不會 crash 的語意錯誤，LLM 世界長出了傳統系統沒有的恢復層——**用 agent 驗證 agent**：

- **Inspector / Challenger**（Huang et al., ICML 2025）：Challenger 讓每個 agent 可挑戰他者輸出；Inspector 是額外的審查 agent，複查並修正訊息——**recover 高達 96.4% 的 faulty agent 錯誤**。機制關鍵不是 Inspector 更聰明，而是它從 primary agent 的「錯誤 context 之外」審查。
- **冗餘投票**：對關鍵步驟取 n 個獨立輸出多數決，系統錯誤率變 **O(p^⌈n/2⌉)**——錯誤隨冗餘指數下降，把「相乘衰減」翻轉成「指數收斂」（The Six Sigma Agent，arXiv:2601.22290）。MAKER（arXiv:2511.09030）用 first-to-ahead-by-k 投票加 **red-flagging**（丟棄結構異常的輸出再重採），在 20 盤河內塔上完成 **1,048,575 步零錯誤**——第一個破百萬步的系統。
- **注意 correlated errors**：同一底模的多份輸出常一起錯（同向幻覺），冗餘投票打不到——需要 red-flagging、異質模型、或外部 context 的 Inspector。

現實檢查：受控 fault injection 研究（arXiv:2606.01416）發現多數第一代框架（ChatDev、MetaGPT、AutoGen）遇到故障**只會「停」不會「恢復」**——失敗恢復（而非失敗偵測）是當前最大缺口。

## 整體來說

可落地的優先順序：先把**拓樸**選對（階層式、易錯 agent 放 leaf、別讓 orchestrator 變成錯誤單點）；再上**便宜的傳統武器**（per-node retry policy、circuit breaker、checkpoint、idempotent 工具）；最後對高風險步驟上**語意層驗證**（Inspector 或投票——它們燒 token，只值得用在錯誤代價高的地方）。

一句話收尾：傳統 fault-tolerance 解決「會 crash 的錯」，這部分直接抄就好；multi-agent 真正的新問題是「不會 crash 的錯」——而答案不是讓單一 agent 更聰明，是讓架構裡有一個站在錯誤 context 之外的眼睛。

## 參考資料

- [Why Do Multi-Agent LLM Systems Fail? / MAST（arXiv:2503.13657）](https://arxiv.org/abs/2503.13657)
- [On the Resilience of LLM-Based Multi-Agent Collaboration with Faulty Agents（arXiv:2408.00989）](https://arxiv.org/abs/2408.00989)
- [From Spark to Fire: Error Cascades in LLM-Based Multi-Agent Collaboration（arXiv:2603.04474）](https://arxiv.org/abs/2603.04474)
- [The Six Sigma Agent（arXiv:2601.22290）](https://arxiv.org/abs/2601.22290)
- [MAKER: Solving a Million-Step LLM Task with Zero Errors（arXiv:2511.09030）](https://arxiv.org/abs/2511.09030)
- [Cognizant AI Lab — MAKER](https://www.cognizant.com/us/en/ai-lab/blog/maker)
- [Self-Healing Agentic Orchestrators（arXiv:2606.01416）](https://arxiv.org/abs/2606.01416)
- [Garcia-Molina & Salem — Sagas（1987）](https://dl.acm.org/doi/10.1145/38713.38742)
- [Erlang/OTP — Supervision Principles](https://www.erlang.org/doc/system/sup_princ.html)
- [Azure Architecture Center — Bulkhead pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)
- [AWS Builders' Library — Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Temporal — Durable Execution](https://temporal.io/)
- [LangGraph — Persistence 概念文件](https://langchain-ai.github.io/langgraph/concepts/persistence/)
