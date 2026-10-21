---
title: "框架更新｜Agno v3.1.8"
date: 2026-10-22
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: zh-TW
description: "Agno v3.1.8 加入 PostgresCheckpointStore 讓沙箱 checkpoint 可以多副本共用，同時把預設保留的 checkpoint 數量收緊到 3 份"
tldr: "Agno v3.1.8 三個重點：(1) 新增 `PostgresCheckpointStore`，沙箱 checkpoint 可以直接存進 Postgres，多副本部署不用再靠 S3 或共用檔案系統還原 session；(2) 行為改變：沙箱預設只保留每個 session 最新 3 份 checkpoint，想保留全部要設 `retain_checkpoints=None`；(3) `Claude()` 預設模型改成 `claude-sonnet-5-5`，取代即將退役的 `claude-sonnet-4-5-20250929`。"
series:
  name: "AI Framework Changelog"
  order: 49
---

> 🌏 [English version](/posts/daily/2026-10-22-framework-agno-3.1.8-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Agno |
| 版本 | v3.1.8 |
| 前一版 | v3.1.7 |
| 發布日 | 2026-10-21 |
| Release Notes | [v3.1.8](https://github.com/agno-agi/agno/releases/tag/v3.1.8) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.9k |

## 這個版本為什麼重要

Agno 的 sandbox checkpoint 原本只能存在單機或共用檔案系統裡，多副本部署的 AgentOS 很難互相還原對方的 session。這版把 `PostgresCheckpointStore` 補進去，checkpoint 直接寫進資料庫、分塊、交易式寫入並用 SHA-256 去重驗證，等於把「session 能不能跨副本接續」這個問題從架構限制變成一個設定選項。同時這版也動了一個容易被忽略但影響很大的預設值：沙箱 checkpoint 預設只留最新 3 份，舊的會被清掉——這對任何依賴長期保留 checkpoint 做除錯或回溯的團隊是會立即碰到的改變。

## 重要變更

- **`PostgresCheckpointStore`**：沙箱 checkpoint 可以直接存進 PostgreSQL，分塊、交易式寫入、SHA-256 去重並於讀取時驗證 → 多副本部署不再需要 S3 或共用檔案系統才能還原 session，屬 opt-in，不影響現有預設行為
- **Framework Managers 可當 Company Routine 的執行者**：Company Routine 現在可以透過宣告、Routine API 或 human-chat 設定，指派內部的 Product Manager 或 OS Manager 當執行者 → 保留的 manager ID 只能從擁有該 AgentOS 解析，不會被自訂元件取代
- **Sandbox Checkpoint Retention（行為改變）**：沙箱預設只保留每個 session 最新 3 份 checkpoint，設 `retain_checkpoints=None` 可恢復無限保留 → 未發布或被取代的 checkpoint 會在結果安全存妥後清除
- **Claude 預設模型升級**：`Claude()` 預設改為 `claude-sonnet-5-5`，取代即將退役的 `claude-sonnet-4-5-20250929`；新版 Claude 模型若拒絕非預設的 `temperature`／`top_p`／`top_k`，會改發警告而不是直接報錯 → Anthropic、Bedrock、Foundry、Vertex 四個 provider 都套用同一套行為

## Breaking Changes

- Checkpoint 保留策略收緊：只保留最新 3 份，開啟更舊的 run 的 checkpoint 可能丟出 `CheckpointObjectNotFound`
  - 影響範圍：任何依賴長期保留所有 checkpoint 做除錯、審計或回溯的部署，需要主動設 `retain_checkpoints=None` 才能維持舊行為
- 使用 durable-queue 沙箱但仍用 host-local 預設 checkpoint store 的設定，現在會在 AgentOS **啟動時**直接失敗，而非等到第一次提交才報錯
  - 影響範圍：多副本部署若還沒換成 `PostgresCheckpointStore` 或 `S3CheckpointStore`，升級後會啟動不起來，需先補上共用的 checkpoint store

## 遷移指南

### 從 3.1.7 升級到 3.1.8

```bash
pip install --upgrade agno==3.1.8
```

```python
# 若需要維持「保留全部 checkpoint」的舊行為，明確關閉收緊的預設值
sandbox = Sandbox(..., retain_checkpoints=None)

# 多副本部署必須換成共用的 checkpoint store，否則啟動時就會失敗
checkpoint_store = PostgresCheckpointStore(db_url="postgresql://...")
```

## 與其他框架的對比觀察

同一天 Pydantic AI 的 `v2.59.0` 推出 `DaytonaSandbox`，Agno 這版則是把既有沙箱的 checkpoint 存儲做成可跨副本共用——兩個框架都在補「agent 執行環境怎麼安全地水平擴展」這塊,顯示沙箱化執行已經從單一框架的實驗性功能,變成這類 agent 框架共同在補的基礎設施。

## 今日收穫

之前以為「checkpoint 保留策略」只是儲存空間的取捨,看到這版同時把它和「啟動時驗證 checkpoint store 設定」綁在一起才意識到:多副本部署的正確性問題,常常要靠「啟動失敗」這種硬性檢查才能在上線前被攔下來,光靠文件提醒不夠。

## 參考資料

- [Agno v3.1.8 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.8)
- [agno-agi/agno GitHub](https://github.com/agno-agi/agno)
