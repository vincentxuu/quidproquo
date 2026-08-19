---
title: "Kiro (AWS) 完整方案分析：Spec-Driven 開發的 Agentic IDE"
date: 2026-04-02
type: guide
category: ai
tags: [agent-cli, kiro, aws, pricing, auto-mode, specs, hooks, bedrock]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 12
tldr: "Kiro 分五層：Free 50 credits、Pro $20/1,000、Pro+ $40/2,000、Pro Max $100/5,000、Power $200/10,000，加購 credit 一律 $0.04。Auto 模式混合模型省成本（同一任務走 Sonnet 要 1.3 倍 credit），Spec-Driven 流程把 vibe coding 變成可追蹤的結構化開發。"
description: "深入分析 AWS Kiro 2026 年的定價方案、Auto 模式、Spec-Driven 開發、Agent Hooks、自主 Agent 與 AWS 生態系整合。"
draft: false
---

Kiro 是 AWS 推出的 Agentic IDE，基於 Code OSS（VS Code 的開源基底）打造。它的核心理念是把開發者從「隨手 vibe coding」帶進**結構化的 spec-driven 開發流程**，同時保留 AI 輔助的靈活性。Preview 階段已有超過 25 萬名開發者使用，底層運行於 Amazon Bedrock。

這篇從定價開始，逐一拆解 Kiro 的核心機制，幫你判斷它是否適合你的團隊。

> 本文是 [Agent CLI 訂閱方案與多模型路由全攻略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing) 的子篇。

## 定價方案

Kiro 提供五個層級，以 credit 為計費單位：

| 方案 | 月費 | Credits/月 | 加購 credit | 適用對象 |
|------|------|-----------|------------|---------|
| **Free** | $0 | 50（永久） | 不可加購 | 個人嘗鮮、輕度使用 |
| **Pro** | $20/user | 1,000 | $0.04/credit | 日常開發者 |
| **Pro+** | $40/user | 2,000 | $0.04/credit | 重度使用者、自主 Agent |
| **Pro Max** | $100/user | 5,000 | $0.04/credit | 高強度個人使用 |
| **Power** | $200/user | 10,000 | $0.04/credit | 團隊全面導入 |

幾個關鍵觀察：

- **Credit 以 0.01 為單位分數計費**，簡單的編輯與短 prompt 可能不到 1 credit，所以帳面的 credit 數比直覺中耐用。
- **首次升級付費方案**（用社群帳號或 AWS Builder ID）可獲 $20 折抵；首次取得存取權時另有 500 bonus credits，14 天內有效。
- **加購 credit 的規則**：最低 $5（125 credits）、單包上限 $100、最多同時 5 包，效期自購買日起 12 個月且可跨月結轉；扣款順序是**先用方案 credit、再用加購 credit**，最早到期的包先扣。兩者都用完就暫停，直到你再買或下個週期重置。
- **超額（overage）預設是關閉的**，要在設定裡手動打開才會生效；打開後只要維持付費方案就會一直開著，降回 Free 會自動關閉。
- **GovCloud 區域定價不同**，這是選型時容易忽略的隱藏成本。
- **Startup 方案**：符合資格的新創團隊最高可獲得一年 Pro+ 免費，對早期團隊極具吸引力。

## 可用模型

| 方案 | 可用模型 |
|------|---------|
| **Free**（社群登入或 AWS Builder ID） | Claude Sonnet 4.5，以及 Qwen3 Coder Next、DeepSeek v3.2、MiniMax 2.1 等開放權重模型，有 rate limit |
| **付費方案** | 上述再加 premium 模型：Auto、Claude Sonnet 4.6、Claude Opus 4.8 |

並非所有 premium 模型在所有國家／地區都提供。

## Auto 模式：智慧模型路由

Auto 模式是 Kiro 的預設模式，也是其最大特色之一。它不綁定單一模型，而是**根據 prompt 意圖自動選擇最適模型**。

### 運作原理

1. **意圖偵測**：分析你的 prompt 複雜度與類型
2. **模型路由**：將前沿模型（如 Sonnet 4.5）與專用模型混合使用
3. **快取優化**：相似請求重複利用既有回應，降低 credit 消耗

### Credit 消耗邏輯

| Prompt 類型 | 消耗 | 範例 |
|------------|------|------|
| 簡單問答、補全 | < 1 credit | 「這個函式做什麼？」 |
| 中等複雜度 | ~1 credit | 重構一個模組 |
| 複雜多步驟 | > 1 credit | 跨檔案架構調整 |

你也可以手動選擇特定模型，跳過 Auto 路由——但要注意**成本差異是實打實的**：官方給的比例是，同一個任務在 Auto 下消耗 X credits，改走 Sonnet 執行要 1.3X。這就是 Auto 被設為預設的原因。

型號會隨世代更換（目前 premium 檔是 Sonnet 4.6 與 Opus 4.8），選型時看層級就好：便宜快速的一檔跑瑣事，中階跑日常，旗艦留給真的複雜的任務。

Auto 模式的價值在於：**你不需要自己判斷該用哪個模型**。對多數開發者而言，讓系統自動決策反而比手動選擇更省 credit。

## Spec-Driven 開發：從 Vibe Coding 到結構化開發

這是 Kiro 與其他 AI IDE 最根本的差異。多數工具讓你丟 prompt 就生成程式碼，Kiro 則在中間插入一個**正式的規格化流程**。

### 三階段流程

| 階段 | 產出 | 目的 |
|------|------|------|
| **Requirements** | 使用者故事、驗收條件 | 明確定義「要做什麼」 |
| **Design** | 技術設計文件 | 決定「怎麼做」，包含架構決策與取捨 |
| **Tasks** | 結構化任務清單 | 拆解成可執行的步驟 |

### 為什麼這很重要

- **可追蹤性**：每個決策都有文件紀錄，不再是黑箱生成。
- **更少的 shot 數**：結構化的上下文讓 AI 在更少的來回中完成更複雜的任務。
- **團隊協作**：規格文件可以 review、版本控制、分享，不再只存在某個人的聊天記錄裡。
- **推理透明化**：明確記錄 AI 的推理過程與設計決策的理由。

這不是在增加流程負擔——而是把原本隱藏在 prompt 來回中的決策**顯性化**。

## Agent Hooks：本地 CI/CD 自動化

Agent Hooks 是 Kiro 的事件驅動自動化系統，概念類似 **GitHub Actions，但在本地開發環境運行**。

### 觸發時機

| 觸發事件 | 說明 |
|---------|------|
| **File Save** | 儲存檔案時觸發 |
| **File Create** | 新建檔案時觸發 |
| **File Delete** | 刪除檔案時觸發 |
| **Pre Tool Use** | 在 Agent 執行工具前攔截，可阻止或修改操作 |
| **Post Tool Use** | 在 Agent 執行工具後觸發，適合日誌、格式化、文件更新 |

### 實用場景

- **測試同步**：新增元件時自動產生對應測試檔
- **文件更新**：API 變更時自動更新 README 或 OpenAPI spec
- **i18n**：新增字串時自動建立翻譯 key
- **Git 助手**：commit 前自動檢查格式與 lint
- **合規檢查**：Pre Tool Use 攔截不安全的操作
- **程式碼風格**：Post Tool Use 自動套用 formatter

Hook 以自然語言撰寫，可透過版本控制與團隊共享。這讓團隊的開發規範不再只是文件上的約定——而是**被自動執行的約定**。

## Autopilot vs Supervised 模式

| 模式 | 運作方式 | 適用場景 |
|------|---------|---------|
| **Supervised** | 每步操作需要人工確認 | 敏感變更、學習階段 |
| **Autopilot** | 多步驟變更無需逐一批准 | 已知模式的批量操作 |

### 自主 Agent（Pro+ 以上）

Pro+ 和 Power 方案解鎖**自主 Agent**，具備以下特性：

- **跨 Repo 作業**：不限於單一專案
- **持久化上下文**：跨 session 記住先前對話與決策
- **從 Review 回饋學習**：根據你的修改建議調整後續行為
- **長時間運行**：可持續工作數天，最少人工干預

這代表你可以指派一個複雜任務給 Agent，隔天回來看成果——而不需要全程盯著。

## CLI 與生態系整合

Kiro 的 CLI 實作了 **Agent Client Protocol (ACP)**，這是一個標準化的 Agent 通訊協定，讓它能與不同 IDE 整合。

### 編輯器支援

- VS Code（原生，基於 Code OSS）
- JetBrains 系列
- Zed

### 開發工具整合

- **MCP 支援**：連接 Model Context Protocol 相容的工具鏈
- **Steering Files**：專案層級的 AI 行為設定檔
- **AWS 原生整合**：Lambda、CDK、CloudFormation、CodeCatalyst 無縫對接

對 AWS 重度使用者來說，Kiro 是目前唯一一個**從 IDE 到部署全鏈路都在 AWS 生態系內**的 AI 開發工具。

## 適用場景

Kiro 最適合以下團隊：

- **AWS 為主的技術棧**：Lambda、CDK、CloudFormation 的原生整合無人能比。
- **需要結構化開發流程**：Spec-Driven 開發讓 AI 輔助不再是黑箱。
- **重視開發規範自動化**：Agent Hooks 讓團隊約定變成可執行的自動化。
- **想要免費方案的個人開發者**：50 credits 永久免費，搭配 Auto 模式的優化與分數計費，輕度使用還算堪用。
- **新創團隊**：Startup 方案最高一年 Pro+ 免費，是非常實質的支援。

## 系列文章

- [Agent CLI 訂閱方案與多模型路由全攻略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)

## 參考資料

- [Kiro: Agentic AI development from prototype to production](https://kiro.dev/)
- [Pricing - Kiro](https://kiro.dev/pricing/)
- [Frequently Asked Questions - Kiro](https://kiro.dev/faq/)
- [Hooks - IDE - Docs - Kiro](https://kiro.dev/docs/hooks/)
- [Introducing Kiro - Kiro Blog](https://kiro.dev/blog/introducing-kiro/)
- [Automate your development workflow with Kiro's AI agent hooks](https://kiro.dev/blog/automate-your-development-workflow-with-agent-hooks/)
- [Amazon previews 3 AI agents, including 'Kiro' | TechCrunch](https://techcrunch.com/2025/12/02/amazon-previews-3-ai-agents-including-kiro-that-can-code-on-its-own-for-days/)

## 更新紀錄

- 2026-08-18：對照官方定價頁與帳務文件翻新。①方案表補上 **Pro Max（$100 / 5,000 credits）**，並修正 Power 的額度（15,000 → **10,000**）；②補上加購 credit 的完整規則（最低 $5、單包上限 $100、最多 5 包、12 個月效期、可結轉、先扣方案 credit）與「overage 預設關閉」這個容易踩的設定；③補上分數計費（0.01 為單位）與首次升級 $20 折抵；④可用模型改為 Free／付費兩檔對照（Free 為 Sonnet 4.5 加開放權重模型，付費加 Auto／Sonnet 4.6／Opus 4.8），移除已過期的手動模型清單；⑤補上官方的 Auto vs Sonnet 成本比（1.3x）
