---
title: "台股研究 Agent 實戰系列（篇 3）：LLM 分層與降級鏈——API、本地 CLI、詞典三層 fallback"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, llm-ops, cost-control, observability]
lang: zh-TW
tldr: "只有兩個 role 會叫 LLM，其餘分析師全程程式化；每個 call 依 Anthropic API → 本地 claude CLI → 規則降級的鏈路走，成本只信 provider 回報值，未知成本永遠不當 $0。"
description: "台股研究 agent 的 LLM 分層設計：為什麼五個分析師裡只有一個會叫 LLM、三層 provider fallback 怎麼排、成本怎麼記才不會自己騙自己。"
draft: false
glossary:
  - term: "role"
    definition: "LLM 呼叫的邏輯角色（analyst / synthesis），各自綁定預設模型與用途"
  - term: "provider chain"
    definition: "同一個邏輯呼叫依序嘗試多個 LLM 提供者，失敗就往下一層降級"
  - term: "sanitized trace"
    definition: "寫入本地 artifact 的呼叫紀錄，只保留 role、model、latency、token 與成本，不含 prompt、error message 或 credential"
---

> **台股研究 Agent 實戰系列（篇 3 / 9）**：[上一篇：LangGraph 並行架構——五個分析師同時開工](/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture) ｜ [下一篇：為什麼回測會說謊](/posts/tech/2026-08-23-stock-agent-4-backtest-accountability) ｜ [完整目錄在篇 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

這篇記錄我的開源專案 stock-research-agent 怎麼管 LLM 呼叫：哪些節點配叫 LLM、配叫的又走什麼降級鏈、成本怎麼記帳。讀完你會知道怎麼在一個「多 agent」系統裡反而少燒 token，以及為什麼我把「不知道多少錢」跟「免費」分開記。

## 不為了「多 agent」而多燒 token

很多多 agent 專案的預設是：每個分析師都是一個 LLM，讓它們彼此辯論，最後再由一個 LLM 總結。我故意不這樣做。架構文件裡寫得很直白：系統的核心不是讓多個 LLM 彼此辯論，而是讓程式化資料與可重播回測約束最後的研究敘事。

所以 role 只有兩個：

- `analyst`（預設 `claude-haiku-4-5`）：目前只服務 sentiment 分類——把 Threads 貼文批次分類成固定 label。便宜模型就夠，因為這是窄分類任務。
- `synthesis`（預設 `claude-sonnet-5`）：寫最終報告。需要把回測、基本面、籌碼、事件的結構化證據組織成有反方論點的繁中敘事，這個我願意用比較好的模型。

technical、fundamental、chips、events、backtest、reflection 全程不叫 LLM。技術分數是 Python 算的、回測是重播出來的、反思是對實現報酬算的——這些東西讓 LLM 做不只貴，還更不可信。LLM 在這個系統裡的定位是「解釋已存在的證據」，不是「產生證據」。

## 同一條 provider chain，每個 call 都自己走一次

每個 logical call 依序嘗試三層：

1. 有 `ANTHROPIC_API_KEY` 就打 Anthropic API。
2. API 沒設或失敗，本機有 `claude` 就改用 Claude Code CLI。
3. 都沒有就降級：sentiment 換詞典分類，synthesis 換規則式 template。

```bash
# 強制走離線路徑，analyst/synthesis 一律標 disabled
STOCK_AGENT_NO_LLM=1 uv run stock-agent research 2330
```

模型怎麼決定也有一條明確的優先序：`--analyst-model` / `--synthesis-model` CLI flag → `STOCK_AGENT_ANALYST_MODEL` / `STOCK_AGENT_SYNTHESIS_MODEL` 環境變數 → 相容舊版的 `STOCK_AGENT_MODEL` → role default。CI 或別人機器上老設定不會突然爆掉，我自己要換模型也只要改一層。

CLI 那層有個細節值得一提：`claude` 是在暫存目錄起 print/JSON 模式跑的，tools、session persistence、使用者 settings、MCP servers 全部停用，system prompt 也覆蓋成純文字生成用的。這不是 sandbox——文件明說 CLI 仍是外部執行檔加遠端模型邊界——但至少把「CLI 順手讀了我 workspace 或自己開工具」的範圍壓到最小。

降級語義上我堅持一件事：provider exception、timeout、空輸出、skip 全部記成 sanitized attempt，絕對不寫 exception message、stderr 或 credential 進 trace，也絕對不讓一次失敗的 provider 假裝成功。artifact 裡會記「最後是哪個 provider、哪個 model 真的成功」。

## 成本紀律：未知的成本不是 $0

每個 `LLMCall` trace 記 role、purpose、configured model、provider reported model、最終狀態、latency、input/output/cache token、provider-reported USD cost，和依序發生的 provider attempts。`stock-agent trace <run.json>` 可以在終端把這些拉出來看。

記帳的規則很硬：**不維護本地猜測價格表**，只加總 provider 明確回報的 `cost_usd`。彙總結果分四種狀態：

- `complete`：所有成功呼叫都有回報成本。
- `partial`：部分有、部分未知。
- `unknown`：有成功呼叫但都沒成本。
- `not_applicable`：沒有成功 LLM call。

為什麼這麼龜毛？因為「自己查價格表換算」聽起來合理，但模型 alias、cache 計費規則、方案折扣隨時在變，猜出來的數字比沒有數字更糟——它會讓你在報表上看到一個漂亮但錯的總成本。unknown 是誠實的狀態，$0 是幻覺。

一個實測樣本（2026-08-22，預設 2330 run，當天沒有輿情貼文所以只有 synthesis 那一次呼叫發生）：provider 是 Claude CLI、模型 `claude-sonnet-5`、latency 36.387s、usage 是 input 2 + cache creation 1,419 + output 2,151 tokens，provider 回報總成本 **US$0.029088**。這只是單次執行樣本，不是固定定價承諾；API adapter 路徑目前拿得到 usage 但沒有自己換算價格，所以走 API 時 cost 可能就是 unknown。但大概的量級抓得到：一次完整研究在分層設計下是美分等級，不是美元等級。

## Langfuse：可有可無的事後出口

Langfuse 在這個專案裡是 optional post-hoc exporter，不是埋進熱路徑的 SDK。有設 `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY`（自建服務再加 `LANGFUSE_BASE_URL`）就在 graph 跑完、寫本地 artifact 前送一輪；沒設也不影響任何事，只記一筆 `credentials_missing`。

出口只送 sanitized metadata：symbol、direction、role、provider、model、status、latency、usage、cost completeness。**不送 prompt、不送完整 report、不送 provider error message、不送 credential**——貼文與報告內容本來就不該離開機器。送之前先用 blocking `auth_check` 驗證 credentials，失敗記 `auth_failed`；import、連線、export 出例外也只記 `export_error` 與 exception type。所有觀測失敗都不讓研究失敗——觀測是錦上添花，研究本身才是正事。目前沒有 LangSmith exporter，也沒打算做。

## 整體來說／學到的事

這套分層教會我三件事。第一，「多 agent」不等於「多 LLM call」——把 LLM 限定在真的需要語言能力的兩個點（分類輿情、組織敘事），其他全靠程式，成本和可信度是雙贏。第二，fallback 鏈要一路降到底，降到完全不要 LLM 也能出報告（詞典 + 規則模板），公開部署我甚至直接 `STOCK_AGENT_NO_LLM=1` 防止意外燒錢。第三，成本與觀測的誠實边界很重要：不知道就是 unknown，猜的數字不要寫進帳本，觀測系統掛了不能拖垮主流程。這些都是很無聊的工程決定，但無聊正是重點。

---

## 參考資料

- [vincentxuu/stock-research-agent - GitHub](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md — LLM 分層與 fallback / Observability 與成本](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [README — LLM trace and per-run cost](https://github.com/vincentxuu/stock-research-agent#llm-trace-and-per-run-cost)
- [Langfuse 文件](https://langfuse.com/docs)
