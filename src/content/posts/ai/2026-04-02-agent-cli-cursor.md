---
title: "Cursor 完整方案分析：IDE 原生 Agent 的霸主地位"
date: 2026-04-02
category: ai
tags: [agent-cli, cursor, pricing, auto-mode, agent-mode, background-agents, ide]
lang: zh-TW
tldr: "Cursor 從免費到 $200/mo Ultra，Auto Mode 無限使用是核心賣點，Background Agents 可平行 8 個任務，2026 年營收突破 $2B。"
description: "深入分析 Cursor 2026 年的信用制計費、Auto Mode、Agent Mode、Background Agents、市場地位與適用場景。"
draft: false
---

Cursor 不是 CLI 工具，而是把 AI Agent 直接嵌入 IDE 的產品。2026 年初它的 ARR 突破 $2B，付費用戶超過 100 萬，成為 AI coding 市場裡成長最快的玩家。這篇完整拆解它的定價結構、核心功能與適用場景。

## 定價方案總覽

Cursor 從免費到企業級共六個方案，核心差異在**信用額度（credit pool）**與**功能權限**。

| 方案 | 月費 | 信用額度 | Auto Mode | Agent Mode | Background Agents | 其他重點 |
|------|------|----------|-----------|------------|-------------------|----------|
| **Hobby** | 免費 | — | 有限制 | ✗ | ✗ | 2,000 completions + 50 次 slow premium requests |
| **Pro** | $20/mo | $20 pool | ✔ 無限 | ✔ | ✔ | 核心方案，多數開發者的起點 |
| **Pro+** | $60/mo | $60 pool | ✔ 無限 | ✔ | ✔ | 適合重度使用者 |
| **Ultra** | $200/mo | $200 pool（20x 乘數 = $4,000 容量） | ✔ 無限 | ✔ | ✔ | 最大彈性，適合高頻 Agent 使用 |
| **Teams** | $40/user/mo | 依人數 | ✔ 無限 | ✔ | ✔ | 集中管理、usage dashboard |
| **Enterprise** | 自訂 | 自訂 | ✔ 無限 | ✔ | ✔ | SSO、SAML、custom deployment |

Hobby 方案能體驗基本的 AI 補全，但要真正用到 Agent 功能，至少需要 Pro。

## 信用制計費（Credit-Based Billing）

2025 年 6 月，Cursor 從**請求次數制**切換到**信用制**。這是理解所有方案成本的關鍵。

**核心規則：**

- 每個付費方案的信用額度 = 方案價格（美金）。Pro 就是 $20 pool，Pro+ 是 $60，依此類推。
- Ultra 方案有 **20x 乘數**：實際付 $200，但信用容量等同 $4,000。
- **Auto Mode 不消耗信用額度**——這是最重要的一條。只要你讓 Cursor 自動選模型，就是無限使用。
- **手動指定模型**才會扣信用。不同模型消耗不同：$20 pool 大約可以發 ~225 次 Sonnet 請求，或 ~550 次 Gemini 請求。
- 信用用完後，仍可繼續使用 Auto Mode，但手動選模型會被限速或需要加購。

| 模型 | ~$20 可用次數 | 每次成本概估 |
|------|--------------|-------------|
| Claude Sonnet | ~225 次 | ~$0.089 |
| Gemini | ~550 次 | ~$0.036 |
| GPT-4o | ~300 次 | ~$0.067 |

這套設計的意圖很明確：**鼓勵你用 Auto Mode，讓 Cursor 決定什麼時候該用便宜模型、什麼時候該用貴的**。

## Auto Mode

Auto Mode 是 Cursor 在 2025 年下半推出的核心功能，也是付費方案最大的賣點。

**運作方式：**

- 使用者不指定模型，Cursor 根據任務複雜度、上下文長度、成本效率自動路由到最合適的模型。
- 簡單補全可能走小模型，複雜 Agent 任務可能走 Claude Sonnet 或 GPT-4o。
- **所有付費方案無限使用**，不扣信用。

**為什麼重要：**

對大多數開發者來說，Auto Mode 就夠了。你不需要知道背後是哪個模型在跑，只需要結果好就行。這也是 Cursor 能把 Pro 定在 $20/mo 的原因——Auto Mode 讓它控制成本，同時讓使用者覺得「無限量」。

實務建議：**除非你有明確理由需要特定模型（例如 Opus 的深度推理），否則一律用 Auto Mode。**

## Agent Mode

Agent Mode 是 Cursor 的多步驟自主編碼模式，能力遠超傳統的 Tab 補全或 Chat 問答。

**Agent Mode 的工作流程：**

1. 接收任務描述（自然語言）
2. 自動判斷需要讀取哪些檔案
3. 規劃修改策略
4. 逐步執行：編輯程式碼、建立新檔案、刪除無用檔案
5. 執行終端指令（跑測試、安裝套件、lint）
6. 根據結果自我修正，反覆迭代直到完成

**成本結構：**

Agent Mode 每一步的模型呼叫都算一次獨立請求。一個看似「一個任務」的操作，實際可能包含 5-20 次模型呼叫。如果手動指定模型，這些呼叫都會扣信用。用 Auto Mode 則不扣。

**和 CLI Agent 的差異：**

Agent Mode 在 IDE 內運行，有完整的檔案樹、語法高亮、diff 預覽。你可以即時看到每一步的修改，隨時介入調整。這是 Cursor 相比純 CLI 工具（Claude Code、Codex CLI）最大的體驗優勢。

## Background Agents

2026 年新推出的功能，把 Agent 搬到雲端，讓它在背景獨立工作。

**運作機制：**

- Cursor 在雲端 clone 你的 repo
- Agent 在隔離環境中自主執行任務（讀 code、寫 code、跑測試）
- 完成後自動產生 PR，你 review 即可
- 最多可同時跑 **8 個平行 Agent**

**計費方式：**

- Background Agents **獨立計費**，不包含在月費裡
- 必須啟用 **MAX mode**，有 **+20% 附加費**
- 適合把多個獨立任務平行發出去，例如同時修 3 個 bug + 寫 2 個測試 + 重構 1 個模組

**使用場景：**

| 場景 | 適合度 | 說明 |
|------|--------|------|
| 獨立 bug fix | ★★★★★ | 單一問題，上下文明確 |
| 寫測試 | ★★★★☆ | 需要清楚的 spec，但通常可自主完成 |
| 重構 | ★★★☆☆ | 跨檔案依賴多，可能需要人工調整 |
| 新功能開發 | ★★☆☆☆ | 需求模糊時 Agent 容易走偏 |

Background Agents 的核心價值是**平行化**——你不再需要一個一個任務排隊等，而是一次派出多個 Agent 同時工作。

## 市場地位

Cursor 在 2026 年的成長數字令人印象深刻：

| 指標 | 數據 | 時間點 |
|------|------|--------|
| ARR | $2B | 2026 年 2 月 |
| ARR 成長速度 | 3 個月內翻倍 | 2025 Q4 → 2026 Q1 |
| 總用戶數 | 200 萬 | 2026 年初 |
| 付費用戶 | 100 萬 | 2026 年初 |
| DAU | 100 萬 | 2026 年初 |
| Fortune 500 採用率 | 50% | 2026 年初 |
| 企業營收佔比 | 60% | 2026 年初 |

幾個值得注意的點：

- **付費轉換率 50%**（100 萬付費 / 200 萬總用戶），在 SaaS 產品裡算極高。
- **DAU = 付費用戶數**，代表付費用戶幾乎每天都在用，留存極強。
- **企業營收佔 60%**，不是個人開發者的玩具，而是正式的企業工具。
- 三個月 ARR 翻倍的速度，放在任何軟體公司都是歷史級的成長曲線。

## 適用場景

Cursor 最適合以下類型的開發者和團隊：

**最適合：**

- **IDE 原生開發者**——你習慣在 VS Code 系的環境裡工作，不想切到終端機用 CLI。Cursor 的體驗比任何 CLI Agent 都更直覺。
- **想要 Agent-first 工作流的團隊**——Agent Mode + Background Agents 的組合讓團隊可以把大量重複性工作交給 AI，人類專注在設計和 review。
- **複雜的多檔案編輯**——Cursor 的 IDE 整合讓你能即時看到跨檔案的修改效果，比 CLI 的 diff 輸出更好判斷。

**不太適合：**

- **需要極度自訂 Agent 行為**——CLI 工具（Claude Code、Codex CLI）的 hooks / skills 系統更靈活。
- **需要在 CI/CD 或 headless 環境跑 Agent**——Cursor 是 GUI 應用，不適合自動化腳本。
- **預算敏感的個人開發者**——如果你主要用 Claude API，直接用 Claude Code 可能更便宜。

## 系列文章

這篇是 Agent CLI 系列的一部分。完整的多工具比較與訂閱方案分析，請參考：

**→ [Agent CLI 訂閱方案與多模型路由完整比較](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing/)**
