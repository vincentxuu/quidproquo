---
title: "框架更新｜Agno 3.0.0"
date: 2026-08-25
category: daily
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno 3.0 是一次會 break 生產環境的資料庫大改版：runs 從 session JSON blob 搬進獨立的型別化資料表，寫入放大從 O(N²) 降到 O(N)，但升級前必須先跑 migration"
tldr: "Agno 3.0 三個重點：(1) Runs 資料表重構，從塞在 session JSON blob 裡改成獨立的 agno_runs 表，寫入放大從 O(N²) 降到 O(N)，升級前必須先跑 MigrationManager，否則會直接噴 MigrationRequiredError；(2) 新增 Tool Result Offloading 和 Media Offloading，超過 16,000 字元的工具結果、以及圖片/音訊/影片會被搬到 AgentFS 或 S3 等外部儲存，訊息裡只留精簡的 envelope；(3) Breaking changes 範圍很廣，包含多個 Agent 參數改名、reasoning=True 被移除、DuckDuckGoTools 方法改名等，是一次需要照著遷移指南逐項檢查的升級。"
series:
  name: "AI Framework Changelog"
  order: 5
---

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.0.0 |
| 前一版 | v2.9.0 |
| 發布日 | 2026-08-24 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.0) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 41.9k |

## 這個版本為什麼重要

Agno 3.0 官方在 release note 開頭就寫明「這是一次 breaking release，v3.0 對外服務前必須先跑資料庫 migration」——這不是一次可以直接 `pip install --upgrade` 就結束的版本。核心變化是把 Agent 執行紀錄（runs）從塞進 session 的 JSON blob，改成獨立的型別化資料表 `agno_runs`，直接把寫入放大從 O(N²) 降到 O(N)。對長時間運行、session 裡累積大量 run 紀錄的生產 Agent 來說，這是效能與可維護性的結構性改善，但代價是所有現有部署都要先跑一次 migration，而且舊資料庫在升級後會直接丟出 `MigrationRequiredError`，不會靜默降級運作。

## 重要變更

- **Runs 資料表重構（Runs Table Restructuring）**：runs 從 session JSON blob 移到獨立的 `agno_runs` 表，欄位型別化（session_id、run_type、agent_id、team_id、workflow_id、user_id、parent_run_id、status、run_index）→ 寫入放大從 O(N²) 降到 O(N)，同時新增 `db.get_run()`、`db.get_runs(session_id=..., status=..., limit=..., page=...)`、`db.upsert_run()`、`db.delete_run()` 等直接操作 run 的 API
- **Tool Result Offloading**：超過 16,000 字元的工具結果會被搬到 AgentFS，訊息裡只保留 preview、大小、result ID 的精簡 envelope → 大幅減少長對話裡工具輸出把 context window 塞爆的問題
- **Media Offloading**：設定 `media_storage=S3MediaStorage(bucket=...)` 後，圖片/音訊/影片/檔案會上傳到儲存後端而非塞進訊息本體，官方範例是一張 113 KB 的 JPEG，base64 編碼後的字元數從約 151,000 降到 2,897 → 直接影響長對話的 token 成本與延遲
- **CodeMode**：新增可程式化的 IPython kernel，模型可以寫 Python 並跨 session 呼叫工具的 awaitable handle → 讓模型用程式碼組合工具呼叫，而不是每次都靠 tool-calling JSON 往返
- **AgentOS 持久背景執行（Durable Background Execution）**：`AgentOS(queue=QueueConfig(durable=True))` 讓 run 執行具備崩潰恢復能力，內建有界並行（預設 32）、可取消、以及冪等去重 → 對長跑、可能中途重啟的 Agent workload 是關鍵可靠性補強
- **Per-User Isolation 擴大範圍**：隔離範圍擴展到 metrics、schedules、evals、knowledge、components、entity memory，以及 17 種向量資料庫

## Breaking Changes

- **資料庫 migration 強制要求**：`db.get_runs()` 等 API 在舊 schema 上直接噴 `MigrationRequiredError` / `SchemaMismatchError`；`db.get_runs()` 若不帶 `limit` 也會噴 `ValueError`
  - 影響範圍：所有現有生產部署，升級前必須先跑 migration
- **AgentOS JWT 設定改變**：`secret_key` 移除，改用 `verification_keys` list；MCP 設定改為單一 `mcp_server` 參數
  - 影響範圍：使用 AgentOS JWT 驗證或 MCP 整合的部署
- **Agent 參數改名**：
  - `enable_user_memories` → `update_memory_on_run`
  - `search_session_history` → `search_past_sessions`
  - `num_history_sessions` → `num_past_sessions_to_search`
  - 影響範圍：所有直接設定這些參數的 Agent 定義
- **功能移除**：
  - `reasoning=True` → 改用 `reasoning_model`
  - Culture 功能整個移除
  - `MultiMCPTools` 刪除
  - 影響範圍：使用這些參數/功能的專案需要重構
- **工具 API 改變**：
  - `DuckDuckGoTools.duckduckgo_search` → `web_search`
  - Google 工具 import 路徑改為 `agno.tools.google.*`
  - `SQLTools` 移除 `enable_*` 參數
  - 扁平的 HITL kwargs 改為 `HumanReview` 物件
  - 影響範圍：使用這些工具的整合程式碼
- **Knowledge API**：`Knowledge.add_content` 移除，改用 `insert()` / `ainsert()`；帶 `user_id` 的舊版（pre-v3）向量表會噴 `ValueError`
- **Evals**：`eval_id` 統一改名為 `run_id`

## 遷移指南

### 從 2.x 升級到 3.0.0

```bash
pip install --upgrade agno==3.0.0
```

```python
import asyncio
from agno.db.migrations.manager import MigrationManager

# Step 1: 非破壞性地把舊 runs 複製進新表（支援 12 個同步 + 4 個非同步 backend）
asyncio.run(MigrationManager(db).up())

# Step 2: 驗證新表已有資料
assert len(db.get_runs(limit=5)) > 0

# Step 3: 確認無誤後才清除舊的 legacy runs 欄位
db.cleanup_legacy_runs_column(force=True)
```

若透過 AgentOS 部署，也可以直接呼叫 `POST /databases/all/migrate` 觸發同一套 migration 流程。

Agent 參數改名的部分需要逐一檢查程式碼：

```python
# 舊寫法（2.x）
agent = Agent(
    enable_user_memories=True,
    search_session_history=True,
    num_history_sessions=5,
)

# 新寫法（3.0.0）
agent = Agent(
    update_memory_on_run=True,
    search_past_sessions=True,
    num_past_sessions_to_search=5,
)
```

## 與其他框架的對比觀察

把長對話裡的大型工具結果與多媒體搬出訊息本體，這個方向和 LangGraph 1.5 把記憶收進原生 checkpoint 機制是同一類問題（context window 膨脹）的不同解法：LangGraph 選擇優化「記憶怎麼存取」，Agno 3.0 選擇優化「巨大內容怎麼不進 context」。而 runs 資料表從 JSON blob 改成型別化欄位、寫入放大降到 O(N)，也呼應了 Mastra 近期版本一直在做的 workflow 持久化與並行安全補強——兩邊都在把「Agent 執行狀態」當成需要正經資料庫設計的一等公民，而不是丟一包 JSON 進去就算了。

## 今日收穫

之前以為 Agent 框架的 breaking release 大多是 API 改名這種表面調整，這次才注意到 Agno 3.0 動的是底層資料模型——把 runs 從 session JSON blob 拆成獨立資料表，寫入複雜度直接從 O(N²) 降到 O(N)。這提醒我：一個框架的版本號從 2.x 跳到 3.0，值得先看的不是新增了什麼功能，而是資料儲存方式有沒有變，因為那才是真正決定「舊部署能不能直接升級」的關鍵。

## 參考資料

- [Agno v3.0.0 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.0)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v2.9.0 — GitHub Release（前一個穩定版）](https://github.com/agno-agi/agno/releases/tag/v2.9.0)
