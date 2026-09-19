---
title: "框架更新｜Microsoft Agent Framework python-1.19.0"
date: 2026-09-20
category: daily
type: digest
tags: [ai-agent, framework, daily, microsoft-agent-framework]
lang: zh-TW
description: "Microsoft Agent Framework 1.19.0 一口氣帶了四個 BREAKING 變更，同時補齊 MongoDB、Azure DocumentDB、Cosmos DB 的向量儲存連接器"
tldr: "Microsoft Agent Framework python-1.19.0 三個重點：(1) 四個 BREAKING 變更集中在 HTTP cookie 持久化、MCP skill 封裝格式、MCP session 作用域、Redis history key 作用域；(2) 新增泛用向量儲存 provider 協定，一次補齊 MongoDB（alpha）、Azure DocumentDB（alpha）、Azure Cosmos DB NoSQL 三個連接器；(3) 內建 orchestration workflow 現在有穩定名稱並註冊 checkpoint type，讓內建的 sequential／concurrent／handoff／group chat 流程可以被還原重啟。"
series:
  name: "AI Framework Changelog"
  order: 23
---

> 🌏 [English version](/en/posts/daily/2026-09-20-framework-microsoft-agent-framework-1.19.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Microsoft Agent Framework |
| 版本 | python-1.19.0 |
| 前一版 | python-1.18.0 |
| 發布日 | 2026-09-18 |
| Release Notes | [GitHub Release](https://github.com/microsoft/agent-framework/releases/tag/python-1.19.0) |
| GitHub | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| Stars | 13.6k |

## 這個版本為什麼重要

Microsoft Agent Framework（MAF，整合 Semantic Kernel 與 AutoGen 兩條血統後的官方 Python／.NET agent 框架）這次同時做了兩件方向不同的事：一邊在收緊安全邊界（四個 BREAKING 變更，涵蓋 HTTP client、MCP skill 封裝、MCP session、Redis history key），一邊在擴充生產環境的資料層（一次補三個企業級向量儲存連接器）。對已經在用 MAF 的團隊來說，這版不是「加新功能就升級」而是「升級前先看四個 BREAKING 變更會不會踩到」；對還在評估的團隊來說，這版展示的是 MAF 走「production-grade」路線的具體樣子——不是先求功能齊全，而是先把 HTTP client 的 cookie 行為、MCP session 的作用域這些容易被忽略的邊界訂清楚。

## 重要變更

- **泛用向量儲存 provider 協定**：`agent-framework-core` 新增共用的向量儲存 protocol，讓不同資料庫的 connector 用同一套介面接入 → 跟進本身補了三個新 connector：MongoDB（alpha）、Azure DocumentDB（alpha）、Azure Cosmos DB NoSQL（正式），選 Azure 生態系的團隊現在有更多向量儲存選項可以直接接
- **內建 orchestration workflow 有穩定名稱並註冊 checkpoint type**：`agent-framework-orchestrations` 讓 sequential、concurrent、handoff、group chat 這些內建流程模式有固定命名，並把 checkpoint type 註冊進還原機制 → 長跑中的內建流程現在可以中斷後正確還原，不只是自訂 workflow 才有這個保障
- **per-tool `AgentModeProvider` 曝露控制**：可以針對每個 tool 個別控制要不要曝露 agent mode provider → 更細粒度地控制工具在不同執行模式下的行為
- **function call 可選同步循序執行**：`agent-framework-core` 新增選項讓多個 function call 依序而非並行執行 → 對有嚴格呼叫順序需求（例如共享同一個外部資源）的工具鏈是直接的可用性補強
- **CodeAct tool 參數 schema 可設定精簡或 JSON 描述**：`agent-framework-hyperlight`、`agent-framework-monty` 的 CodeAct 工具現在可以選擇精簡或完整 JSON 的參數描述格式 → 對 prompt 長度敏感的部署可以縮減 system prompt 裡的工具描述體積

## Breaking Changes

- HTTP cookie 持久化改為顯式選項：
  - 舊行為：框架內部建立的 MCP、A2A、AG-UI HTTP client 會隱性保留 response cookie
  - 新行為：框架自建的 HTTP client 預設拒絕保留 response cookie，呼叫端自行傳入的 client 不受影響
  - 影響範圍：依賴框架內建 HTTP client 隱性維持 session cookie 的整合（例如某些需要 cookie-based 驗證的 MCP／A2A 後端）
- MCP skill 封裝格式限縮為 ZIP，並棄用 MCP sampling callback：
  - 舊行為：`skill://index.json` 裡的封裝檔案接受 ZIP、TAR、TAR.GZ 三種格式
  - 新行為：只接受 ZIP，偵測到 TAR／TAR.GZ 會在探索階段被跳過並回報不支援，而不是照樣解壓
  - 影響範圍：用 TAR 或 TAR.GZ 打包 skill 封裝的專案需要改用 ZIP 重新打包；同時 MCP sampling callback 進入棄用階段
- provider-backed MCP session 改成依每次呼叫（per-invocation）建立作用域：
  - 舊行為：`agent-framework-declarative` 的 provider-backed MCP session 作用域不是逐次呼叫隔離
  - 新行為：每次呼叫都有獨立作用域的 session
  - 影響範圍：用 declarative agent 搭配 provider-backed MCP、且依賴 session 跨呼叫共享狀態的設定
- Redis history storage key 改成依 provider 與 session identity 作用域（beta 階段的 breaking change）：
  - 舊行為：`agent-framework-redis` 的 history storage key 沒有嚴格依 provider／session identity 隔離
  - 新行為：key 依 provider 與 session identity 作用域，避免跨 provider 或跨 session 的 key 碰撞
  - 影響範圍：用 Redis 存 chat history 的部署，升級後既有 key 的命名空間會改變，需要確認遷移或清理舊 key

## 遷移指南

### 從 python-1.18.0 升級到 python-1.19.0

```bash
pip install --upgrade agent-framework agent-framework-core
```

```python
# 若依賴框架內建 HTTP client 保留 response cookie（例如 cookie-based session 驗證）
# 1.19.0 起需要自行建立並傳入帶 cookie 保留設定的 HTTP client，
# 而不是依賴框架自建 client 的隱性行為

# 若用 TAR / TAR.GZ 封裝 MCP skill
# 舊：skill://index.json 指向 .tar 或 .tar.gz
# 新：改封裝成 .zip，並更新 index.json 裡的路徑
```

升級後建議針對三類場景各跑一次既有測試：（1）任何手動建立、依賴 cookie 持久化的 MCP／A2A／AG-UI HTTP client；（2）用 TAR／TAR.GZ 封裝的 MCP skill 資源；（3）用 Redis 存 chat history 的部署，確認舊 key 是否需要遷移或清理。其餘功能新增（向量儲存 connector、orchestration checkpoint、CodeAct schema 選項）都是新增能力，不影響既有程式碼路徑。

## 與其他框架的對比觀察

MAF 這次補的向量儲存 provider 協定，走的是跟 LangChain 當年統一 VectorStore 介面類似的路——先訂好共用介面，再讓各家資料庫連接器往裡面接，而不是每個 provider 各自一套 API。差別在於 MAF 選的三個新 connector（MongoDB、Azure DocumentDB、Azure Cosmos DB）清一色偏 Azure／企業資料庫生態，跟 CrewAI、LangGraph 目前的 connector 選擇（偏向開源向量資料庫如 Qdrant、Pinecone）方向不太一樣，符合 MAF「production-grade、企業部署優先」的定位。而這版四個 BREAKING 變更裡有兩個都跟「session／identity 作用域」有關（MCP session 作用域、Redis key 作用域），跟同一週 Pydantic AI 修補的 web_fetch 安全漏洞屬於不同類別的問題，但反映的是同一件事：agent 框架處理「跨呼叫、跨使用者共享狀態」的邊界，正在變成各家框架都在補的共同痛點。

## 今日收穫

之前以為 Microsoft Agent Framework 是相對年輕、還在快速堆功能的框架，這次看到它在一個 minor 版本裡同時標記四個明確的 BREAKING 變更、而不是悄悄改掉舊行為，才意識到：一個框架成熟度的訊號不只是「功能夠不夠多」，也包括「敢不敢在 changelog 裡把 breaking change 標清楚」——把 cookie 持久化、MCP session 作用域這種容易被忽略的細節主動列成 BREAKING，本身就是一種對使用者的負責態度，比起悄悄修掉但不公告更值得信任。

## 參考資料

- [Microsoft Agent Framework python-1.19.0 Release Notes](https://github.com/microsoft/agent-framework/releases/tag/python-1.19.0)
- [Microsoft Agent Framework GitHub](https://github.com/microsoft/agent-framework)
- [PR #8371：Make HTTP cookie persistence explicit](https://github.com/microsoft/agent-framework/pull/8371)
- [PR #8290：Limit MCP skill archives to the ZIP format](https://github.com/microsoft/agent-framework/pull/8290)
- [Full Changelog: python-1.18.0...python-1.19.0](https://github.com/microsoft/agent-framework/compare/python-1.18.0...python-1.19.0)
