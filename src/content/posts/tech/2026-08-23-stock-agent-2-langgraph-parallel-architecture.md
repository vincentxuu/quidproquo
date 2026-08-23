---
title: "台股研究 Agent 實戰系列（篇 2）：LangGraph 並行架構——五個分析師同時開工"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, multi-agent, python, architecture]
lang: zh-TW
tldr: "五個 analyst 在同一個 superstep 並行 fan-out，延遲是 max 不是 sum；回測與 reflection 擋在 synthesis 前面，讓 LLM 只能解釋已存在的證據。"
description: "拆解 stock-research-agent 的 LangGraph graph 拓樸：並行 fan-out、fan-in barrier、typed state reducer，以及為什麼回測必須排在 synthesis 之前。"
draft: false
glossary:
  - term: "superstep"
    definition: "LangGraph 的一次執行步驟；同一步驟內的節點並行執行，下一步驟等全部完成才開始。"
  - term: "fan-in"
    definition: "等待多個並行分支全部完成後才往下執行的匯合點（barrier）。"
  - term: "reducer"
    definition: "決定並行節點寫回同一個 state 欄位時如何合併（例如 append）的函式。"
  - term: "point-in-time"
    definition: "只看到歷史當下能看到的資料，不用事後資訊回答歷史問題。"
---

> **台股研究 Agent 實戰系列（篇 2 / 9）**：[上一篇：為什麼台股需要自己的研究 Agent](/posts/tech/2026-08-23-stock-agent-1-why-taiwan) ｜ [下一篇：LLM 分層與降級鏈](/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback) ｜ [完整目錄在篇 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

這篇講整個 agent 的骨架：graph 長什麼樣子、為什麼 analyst 要並行跑、以及為什麼回測一定得排在 synthesis 前面。讀完你會拿到一張可以直接抄的拓樸圖，和「什麼情況下值得用 LangGraph、什麼情況自寫 loop 就好」的判斷標準。

## Graph 拓樸

直接看 README 裡的圖：

```text
supervisor ─▶ planning ─┬─▶ technical ──▶ backtest ──▶ reflection ─┐
                        ├─▶ sentiment ──────────────────┼─▶ synthesis ─▶ evaluation_gate ─┬─▶ report
                        ├─▶ chips ──────────────────────┤  (counter-args)   (8 hard gates, │
                        ├─▶ events ─────────────────────┘                    fail-closed)  ▼
                        └─▶ documents (external fetch only if the approved plan asks)   approval_gate
```

幾個重點。

第一，`supervisor` 目前是固定 dispatch，不是 LLM router。`planning` 節點先建構 schema-valid 的 `ResearchPlan`，之後 supervisor 每次都回傳同一批 analyst：technical、sentiment、fundamental、chips、events，外加 documents 節點（只有批准的計畫要求時才對外抓取）。這六個分支在**同一個 superstep** 裡 fan-out。

第二，並行的意義是延遲：五個 analyst 加 documents 同時開工，整段時間是 `max()` 而不是 `sum()`。這是相對 TradingAgents 序列式 analyst chain 的結構性優勢——那邊 analyst 一個接一個跑（可以直接翻它的 `graph/setup.py` 驗證）。一個研究請求裡，輿情分類和 FinMind 基本面拉取沒有任何相依，序列跑純粹是浪費時間。
並行還有一個比較少人提的好處：部分失敗的容錯粒度。`fundamental` 和 `chips` 各資料集可以獨立失敗，錯誤降級成 report notes，別的分支照常跑完。如果寫成序列 chain，上游一個 FinMind timeout 就卡死整條線；fan-out 之後，每個分支的失敗只影響自己那格證據。這也呼應專案的降級哲學——資料或 provider 壞掉時降級，而不是把整次研究變成全有或全無。

第三，technical 分支比別人多接兩個節點：`backtest` 重播同一組 factor score，`reflection` 用已成熟的舊決策算個股 vs 0050 的實現報酬。之後 fan-in edge 會等 reflection、sentiment、fundamental、chips、events、documents **六個分支全部完成**，才放行 `synthesis`。

## 為什麼回測要在 synthesis 之前

這是整個架構最重要的一條邊。如果 LLM 先寫結論，它就會開始替結論找理由——這是所有 LLM 研究報告的通病。把 backtest 和 reflection 排在 synthesis 前面，整件事的因果就反過來：LLM 拿到的 prompt 裡已經有「這組訊號歷史上實際打過幾次、期望值多少、勝率多少」的結構化證據，它的工作只剩解釋這些證據，而不是發明證據。

而且 `build_decision` 本身是 deterministic Python：綜合技術分數、勝率、期望值、輿情、籌碼、基本面，算出 direction 和 confidence。回測樣本太少時 confidence 有上限；訊號強度、勝率、正期望值三關都過才可能是 `buy_candidate`。Synthesis LLM 的工作是寫繁體中文摘要和反方論點，**不改寫 direction**。LLM 是敘事的執行者，不是決策者。

## Typed state 與 reducer

六個分支並行寫回同一個 `ResearchState`，衝突怎麼處理？分工是：每個 analyst 的輸出是各自獨立的欄位（Pydantic model），互不覆蓋；只有 `llm_calls` 和 `errors` 這種「大家都可能追加」的欄位用 reducer 合併——並行節點各自 append，LangGraph 在 join 時幫你收攏。這基本消滅了自寫並行最容易踩的兩個 bug：join 計數錯誤、以及部分失敗時的狀態合併。

## 為什麼不自寫 loop

架構文件裡對這題的回答很直接：這個 graph 有明確的平行 fan-out、dependent chain（technical→backtest→reflection）和 fan-in barrier，LangGraph 把這些排程語義和 typed state reducer 都給了，省掉自己寫 futures 和 join 計數。更關鍵的一點——**graph topology 讓「回測必須發生在 synthesis 前」成為結構，而不是 prompt 裡的約定**。Prompt 裡的「請你先考慮回測結果」是可以被模型忽略的；graph edge 不行。
這也是一般 LLM agent 教學文和實戰系統的落差所在：教學文的約束寫在提示詞裡，實戰系統的約束寫在流程圖和型別裡。提示詞是請求，graph edge 是強制。

但框架不保證研究品質。資料 PIT、成本模型、artifact schema、provider fallback、錯誤降級——這些 LangGraph 一概不管，都是專案自己寫的。反過來說，如果你的工作流只有一個 LLM 加幾個循序工具，自寫 loop 更簡單；是六分支 fan-out/fan-in 這個規模才撐得起引入框架的成本。

## 整體來說

這個架構的核心思想不是「讓很多 LLM 彼此辯論」，而是**讓程式化資料和可重播回測約束最後的研究敘事**。並行是順便拿到的速度紅利；真正花力氣設計的是 fan-in 擋在 synthesis 前面那道 barrier，和 deterministic decision 不讓 LLM 碰的邊界。下一篇講 LLM 那幾層——分層模型、provider fallback 鏈、以及沒有 LLM 時怎麼照常出報告。

---

## 參考資料

- [stock-research-agent — GitHub repository（README 的 How it works 章節）](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md — Agent 與 graph、「為什麼選 LangGraph 而不是自寫 loop」](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [LangGraph 官方文件](https://langchain-ai.github.io/langgraph/)
- [TradingAgents — 參照用的序列式 multi-agent 架構](https://github.com/TauricResearch/TradingAgents)
