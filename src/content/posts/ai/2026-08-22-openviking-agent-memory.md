---
title: "OpenViking：把 Agent 記憶做成虛擬檔案系統"
date: 2026-08-22
category: ai
type: deep-dive
tags: [agent-memory, openviking, virtual-filesystem, context-engineering, mcp, open-source]
lang: zh-TW
tldr: "火山引擎開源 OpenViking 把 agent 的記憶、知識、技能存成 viking:// 虛擬檔案系統，用 ls、tree、find 就能翻。三層載入（L0/L1/L2）讓平均檢索只用 550 tokens，LoCoMo 記憶準確率從 24–57% 提升到 80–83%。"
description: "OpenViking 用虛擬檔案系統取代向量資料庫黑盒，三層摘要按需載入，支援 Claude Code、Cursor 等主流 coding agent。"
draft: false
glossary:
  - term: "LoCoMo"
    definition: "Long Context Memory 的縮寫，用來評估 LLM 在多輪長對話後能否正確回憶使用者提過的事實。"
    definition_en: "Short for Long Context Memory, a benchmark that evaluates whether LLMs can correctly recall user-mentioned facts after long multi-turn conversations."
  - term: "tau2-bench"
    aliases: ["τ2-bench"]
    definition: "用模擬的客服場景（零售、航空）測試 agent 能否在多輪互動中完成任務的基準測試。"
    definition_en: "A benchmark that tests whether agents can complete tasks across multi-turn interactions in simulated customer service scenarios (retail, airline)."
---

> 🌏 [English version](/posts/ai/2026-08-22-openviking-agent-memory-en)

AI agent 最常見的毛病：記錯事實、把過時上下文拿出來用、該記的忘了。根源不在模型笨，而是記憶管理的基礎設施太粗糙——向量資料庫查出什麼就只能接受什麼，你連它到底記了哪些東西都看不見。

火山引擎開源的 [OpenViking](https://github.com/volcengine/OpenViking) 換了一個比喻：把 agent 記憶做成虛擬檔案系統。格式是 `viking://`，在終端機打 `ls`、`tree`、`find` 就能翻出 agent 記了什麼。背後的學術工作是 [VikingMem](https://arxiv.org/abs/2605.29640) 論文（Jiajie Fu et al.），已被 VLDB 2026 接收。

## 向量資料庫的問題

大多數 agent 記憶方案的核心是一個向量資料庫：session 結束時把對話嵌入向量空間，下次需要時用 cosine similarity 撈最近的 chunk。

這個做法有三個結構性問題：

**不可觀測。** 向量空間是高維的，人類看不見 agent 到底「記住」了什麼。你沒辦法 `ls` 它的記憶、沒辦法 `grep` 某個事實有沒有被存進去。除錯只能靠「問一個問題看它答對沒有」，這跟盲測沒什麼兩樣。

**全量載入。** 傳統 RAG 撈出來的 chunk 不分輕重，一律塞進 context window。一段 100 tokens 的摘要就夠判斷相不相關的東西，跟一段需要逐字讀的完整文件，消耗一樣多的 tokens。

**沒有結構。** 記憶之間的層級關係（這份文件屬於哪個專案、這個偏好是哪個使用者的）在向量空間裡是扁平的。檢索只靠語意相似度，不靠結構導航。

## OpenViking 的檔案系統比喻

OpenViking 把 agent 的所有上下文——記憶、知識、技能——組織成一棵虛擬目錄樹，用 `viking://` URI 定址：

```
viking://
├── resources/          # 客觀知識：文件、程式碼、網頁
│   └── my_project/
│       ├── docs/
│       └── src/
└── user/{user_id}/
    ├── memories/       # 使用者級記憶
    │   └── preferences/
    ├── resources/      # 使用者自己加的資料
    ├── skills/         # 學到的技能
    └── peers/          # 其他 agent 的資訊
```

三個公開 scope 各管一件事：`resources` 放客觀知識（文件、程式碼、外部資料），`user` 放使用者級記憶（session 歷史、偏好、身分），`agent` 放技能、工具、端點。

關鍵設計：每個目錄自帶 `.abstract` 和 `.overview` 兩個元資料檔。agent 不需要「打開」整個目錄才知道裡面有什麼——讀摘要就能決定要不要往下鑽。

## 三層載入：L0 / L1 / L2

這是 OpenViking 最核心的工程設計。內容被處理成三層摘要，agent 只載入任務所需的深度：

| 層級 | 名稱 | 大小 | 用途 |
|---|---|---|---|
| L0 | Abstract | ~100 tokens | 向量搜尋、快速篩選——「這個目錄跟我的問題有關嗎？」 |
| L1 | Overview | ~2k tokens | Rerank、結構導覽——「裡面有哪些重點？值得深入嗎？」 |
| L2 | Detail | 完整內容 | 按需載入——只在確定需要時才讀全文 |

依 [OpenViking 的 README 說明](https://github.com/volcengine/OpenViking)，平均每次檢索只載入約 550 tokens。如果全量載入原始內容，這個數字會高出一個數量級。

檢索流程是兩階段的：先用 LLM 做意圖分析、產生型別化查詢，再用階層式檢索器沿目錄樹遞迴下降——用 priority queue 決定哪些子目錄值得展開——最後 rerank。底層存儲分兩層：內容層（RAGFS，用 Rust 改寫）和向量索引層。

## 記憶自演化

OpenViking 不只是靜態的檔案系統。Session 結束「commit」後，系統會非同步萃取結構化記憶。內建的記憶類型包括：

- **profile / identity**：使用者是誰、背景、身分
- **preferences**：偏好設定
- **entities / events**：對話中提到的實體與事件
- **experiences / cases**：完成任務的經驗、案例
- **trajectories**：行為軌跡
- **skills / tools**：學到的技能與工具用法

這些記憶自動歸檔到 `viking://user/` 底下對應的目錄，下次 session 啟動時 auto-recall。

## 實測數據

依 [OpenViking README](https://github.com/volcengine/OpenViking) 公布的 v0.3.22 基準測試：

**LoCoMo（使用者記憶準確率）：**

| Agent | 原生準確率 | + OpenViking | Token 減少 | 延遲縮短 |
|---|---|---|---|---|
| OpenClaw | 24.20% | 82.08% | 91.0% | 66.10% |
| Hermes | 33.38% | 82.86% | 84.9% | 58.45% |
| Claude Code | 57.21% | 80.32% | 34.3% | 65.55% |

Claude Code 的原生準確率已經不低（57.21%），但加上 OpenViking 後仍提升到 80.32%，同時 token 消耗減少 34.3%。OpenClaw 和 Hermes 的提升幅度更大，準確率翻了不止一倍。

**tau2-bench（多輪任務成功率）：**
- 零售場景：成功率提升 6.87 個百分點
- 航空場景：成功率提升 11.87 個百分點

測試使用 Doubao 2.0 Pro 作為 VLM，Doubao-embedding-vision-251215 作為嵌入模型。這是火山引擎自家的模型，在其他模型上的表現可能不同——但三層載入的架構設計本身是模型無關的。

## Coding Agent 整合

OpenViking 目前支援的 coding agent：

- **Claude Code**：透過 openviking-memory plugin，session 啟動時自動 recall
- **Cursor**：MCP server + hooks
- **Codex / OpenCode**：直接整合
- **TRAE / TraeCode CLI 2.0**：共用安裝腳本
- **OpenClaw / Hermes**：原生支援

它提供原生 [MCP](https://modelcontextprotocol.io/) server，所以任何支援 MCP 的 client 都能直接用。

CLI 操作長這樣：

```bash
# 加入資源
ov add-resource https://github.com/volcengine/OpenViking

# 瀏覽記憶
ov ls viking://resources/
ov tree viking://resources/volcengine -L 2

# 語意搜尋
ov find "what is openviking"

# 在特定範圍內搜尋
ov grep "openviking" --uri viking://resources/volcengine/OpenViking/docs/en
```

## 整體來說

OpenViking 解決了一個很具體的問題：agent 記憶不應該是黑盒子。用檔案系統的比喻讓記憶變得可觀測（`ls` 就能看）、可控制（`rm` 就能刪）、可除錯（`tree` 就能理解結構）。三層載入是實用的工程設計，不是每次檢索都要灌完整上下文。

主專案 AGPLv3 授權——商用衍生作品需要開源。但 CLI crate（`crates/ov_cli`）和範例是 Apache 2.0，可以自由商用。安裝只需要 Python 3.10+（`pip install openviking`），`openviking-server init` 提供互動式設定，支援 Volcengine、OpenAI、Kimi、GLM、Ollama 作為嵌入模型提供者。

值得注意的限制：基準測試用的是火山引擎自家模型（Doubao），在其他模型上的表現還沒有第三方驗證。AGPLv3 授權對企業內部使用有門檻——如果你只是把它當 CLI 工具用（Apache 2.0）沒問題，但如果要整合進自己的服務，需要評估授權義務。

GitHub 上 31,700+ stars，專案活躍度高，值得追蹤。

## 參考資料

- [OpenViking GitHub Repository](https://github.com/volcengine/OpenViking)
- [VikingMem: A Memory Base Management System for Stateful LLM-based Applications](https://arxiv.org/abs/2605.29640)（arXiv:2605.29640，VLDB 2026）
- [MCP（Model Context Protocol）官方文件](https://modelcontextprotocol.io/)
