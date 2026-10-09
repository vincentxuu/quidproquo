---
title: "框架更新｜Agno v3.1.2"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.1.2 補上原生的對話壓縮記憶模組，並加入 Codex 外部 agent adapter 與 HyDE 檢索轉換，三項都是新能力，沒有 breaking changes"
tldr: "Agno v3.1.2 三個重點：(1) 新增 `Agent(compaction=True)`，把舊對話摘要壓縮後存進 `agno_compactions` 表，原始訊息不被覆寫，可隨時 `agent.compact()` 或還原；(2) 新增 `CodexAgent`，把 OpenAI Codex 接進 Agno 的 external agent 家族，跟 Claude Agent SDK、LangGraph、DSPy、Antigravity adapter 並列；(3) 新增 `HyDE` 查詢轉換器，檢索時改用假設性答案去搜，但 reranker 仍對照原始問題評分。本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 36
---

> 🌏 [English version](/en/posts/daily/2026-10-10-framework-agno-3.1.2-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | `v3.1.2` |
| 前一版 | `v3.1.1` |
| 發布日 | 2026-10-08 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.2) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.6k |

## 這個版本為什麼重要

長程 agent 最常見的痛點是對話歷史撐爆 context window，過去多半得自己接 Mem0、Zep 或手刻摘要邏輯。3.1.2 把這塊直接做進框架：`Agent(compaction=True)` 會把較舊的回合摺成摘要，餵給模型的是「摘要＋近期訊息」的衍生版本，但資料庫裡存的原始訊息完全不動——這代表壓縮可以隨時撤銷，而不是一去不回頭的有損操作。同一版也把 Agno 的 external agent 家族擴到四個：Claude Agent SDK、LangGraph、DSPy、Antigravity 之後，現在多了跑自己 agent loop 的 Codex。對已經在用 Agno 做多 agent 編排、又想摻一支 Codex 進來的團隊，不用再自己寫一層事件轉譯。

## 重要變更

- **Conversation Compaction（對話壓縮）**：`Agent(compaction=True)` 把較舊的回合折成摘要存進新的 `agno_compactions` 表，衍生出餵給模型的壓縮版對話；原始訊息不被覆寫，砍掉 compaction 紀錄就能還原完整對話。用 `Compaction(model=..., compact_at_tokens=..., uncompacted_runs=...)` 調整觸發時機，`agent.compact()` / `acompact()` 可手動觸發，`run.compaction` 能檢視結果 → 長程對話終於有框架原生、可逆的記憶壓縮，不用再外接 Mem0/Zep
- **Codex External Agent（`CodexAgent`）**：以 `openai-codex` SDK 包一層 adapter，把 Codex 自己的事件轉譯成 Agno 的 run／tool-call 事件，每個 Agno session 對應一個 Codex thread（設定 `db` 時會持久化），並開放 `sandbox`、`approval_mode`、`reasoning_effort`、`output_schema` 與 MCP 設定 → 單獨使用或透過 AgentOS 都能跑，Codex 正式加入 Agno 的 external agent 陣容
- **HyDE Query Transform**：新增 `QueryTransformer` 檢索 hook 與第一個實作 `HyDE`，`Knowledge(vector_db=..., query_transformer=HyDE())` 會先生成一個假設性答案去搜尋，reranker 仍對照原始問題評分 → 不用自己接外部 HyDE 實作就能改善語意檢索的召回率
- **Browser Origin Policy**：`AgentOS(cors=CORSConfig(...))` 把 CORS 預檢、公開 run／cancel 權限、認證錯誤標頭、workflow WebSocket 與 MCP alias 統一成同一套 origin 政策，CORS 中介層移到最外層，確保錯誤回應也帶一致的標頭
- **Configurable Follow-ups**：`followups` 可以傳 `FollowupConfig`，獨立設定建議數量範圍、專用模型與只給 follow-up 呼叫的指示；預設 prompt 不再建議答案本身已經拒絕的請求

## Breaking Changes

本版無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
pip install --upgrade agno==3.1.2
```

要用新的對話壓縮，加上 `compaction=True` 即可：

```python
from agno.agent import Agent
from agno.compaction import Compaction

agent = Agent(
    compaction=Compaction(compact_at_tokens=8000, uncompacted_runs=2),
)
```

## 與其他框架的對比觀察

把記憶壓縮做成「摘要衍生、原始訊息不變」而不是直接覆寫歷史，這個設計跟 LangGraph 1.x 把記憶收進 checkpoint 機制的方向類似——兩者都在把「長程記憶」從外接服務收回框架核心，但 Agno 多留了一條可逆路徑。Codex adapter 則延續 Agno 一貫的策略：不自己做一套新的 agent loop，而是把市場上已經成熟的 agent（Claude Agent SDK、LangGraph、DSPy、Codex）都包裝成可互通的 external agent，換取多 agent 編排的彈性。

## 今日收穫

之前以為「壓縮對話歷史」等於「有損地丟資訊」，看到 Agno 把壓縮做成一張獨立的 `agno_compactions` 表、原始訊息完全不動之後才意識到：只要壓縮的輸出是「衍生視圖」而不是「就地覆寫」，就能同時拿到省 token 的好處，又保留隨時回滾的退路——這其實是資料庫設計裡「唯讀快取 vs 原始資料」的老套路，換到 agent 記憶管理上一樣適用。

## 參考資料

- [Agno v3.1.2 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.2)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.1.0 — 上一篇框架更新](/posts/daily/2026-10-02-framework-agno-3.1.0)
- [PR #9873：feat 對話壓縮與可搜尋歸檔](https://github.com/agno-agi/agno/pull/9873)
- [PR #10901：feat 支援 Codex external agent](https://github.com/agno-agi/agno/pull/10901)
- [PR #10527：feat 新增 HyDE 查詢轉換器](https://github.com/agno-agi/agno/pull/10527)
