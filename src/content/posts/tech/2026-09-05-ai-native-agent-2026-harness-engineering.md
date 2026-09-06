---
title: "AI-Native Agent 2026：從 Harness Engineering 到 Skill Engineering 的變革"
date: 2026-09-05
category: tech
tags: ["ai-native", "agent", "harness-engineering", "skill-engineering", "2026", "coding-agent"]
lang: zh-TW
description: "從 Caesar Chi 文章到 Tessl DevCon 2026的實踐洞察，探討 2026 年 AI Native Agent 時代的核心變化：從 Harness Engineering 到 Skill Engineering，以及工程師角色的飛躍式變遷。"
tldr: "2026 年 AI Native Agent 時代的核心變化：從 Harness Engineering 到 Skill Engineering，工程師角色從執行者轉向評判者，三個階段演進與五大關鍵技能。"
draft: false
---

## TL;DR

2026 年，AI Native Agent 經歷了從「Prompt Engineering」→「Context Engineering」→「Harness Engineering」→「Skill Engineering」的飛躍。核心方程式 `Agent = Model + Harness` 變成 `Agent = Model + Skills + Harness + Governance`。工程師從「實作者」轉向「評判者」與「體系構建者」——不再是手寫 Code，而是定義意圖、建構環境、驗證結果與治理技能生態系統。

---

## 情境

2026 年 9 月，Andrew Ng 發表 AI Engineering Skills Map 中關於 Coding Agents 的文章；Caesar Chi 將業界經驗與會議心得整理成《AI-Native Agent 時代的 2026 年身為管理者應該知道的事情》；Tessl 在 AI Native DevCon London 2026 發表了 Context Development Lifecycle (CDLC) 框架。眾多文章與會議同時期發表，勾畫出 AI Native Agent 時代的藍圖：工程不再只是「Human 寫 Code，AI 幫忙」，而是「Human 定義 Intent、Architecture、Constraints 與 Acceptance Criteria，Agent 負責 Execution，而系統負責 Verification」。

回到過去：

```text
2024: Human writes code, AI assists
        ↓
2025: Human prompts, Agent edits code
        ↓
2026: Human specifies intent, Agents execute in parallel, Verifiers inspect output, Humans make judgment
        ↓
Next: Human manages an engineering system that continuously produces software
```

---

## 從 Harness Engineering 到 Skill Engineering

### 核心方程式的演進

| 時期 | 核心公式 | 關鍵焦點 |
|------|----------|----------|
| **2023-2024** | `Agent ≈ Model` | Prompt Engineering - 透過 Prompt 調教 Model |
| **2024-2025** | `Agent = Model + Context` | Context Engineering - 管理上下文情報 |
| **2026** | `Agent = Model + Harness` | Harness Engineering - 建構決定性框架約束 Model |
| **2026 末期** | `Agent = Model + Skills + Harness + Governance` | Skill Engineering - 技能與治理成為第一類別 |

**關鍵洞察**：Harness Engineering 是 2026 年的轉折點。它不再僅僅是「讓 Model 可靠」，而是「將 Model 變成 useful 且 actionable」。

### Harness Engineering 的三層架構

```
Human Judgment
    ↓
Agent Execution
    ↓
Deterministic Backbone
```

- **Human Judgment**：Intent、Judgment、Architecture、Trade-offs、Risk、Trust
- **Agent Execution**：Search、Analysis、Implementation、Testing、Iteration、Documentation、Monitoring
- **Deterministic Backbone**：Constraints、State、Permissions、Validation、Audit、Verification

### Skill Engineering 的興起

在 Tessl 的 AI Native DevCon London 2026 會議中，Guy Podjarny 宣告：「**Skills are the New Code**.

> **Skill** = context with a defined boundary: named, versioned, testable, installable

這與庫的邏輯一致——經過 20 年演進的庫最佳實踐，現在套用到 AI 技能上。技能不再是模糊的 Prompt，而是：

- **Named**：有明確名稱
- **Versioned**：有版本控制
- **Testable**：有測試規格
- **Installable**：可以像安裝庫一樣安裝

### 會議共識：四大轉變

1. **從 Context Engineering 到 Skill Engineering**
   - Context：模糊、冗長、難以重用
   - Skill：有界定、可版本、可測試、可安裝

2. **從 SDLC 到 CDLC**
   - **SDLC** (Software Development Life Cycle)：人類處於迴避位置，將 SDLC 交給 Agent
   - **CDLC** (Context Development Lifecycle)：人類應該身處其中，專注於上下文、技能與治理

3. **技能治理變成企業層面關鍵**
   - 在規模層面：知道哪些技能被使用、是否安全、歸屬誰所有

4. **人類留在 CDLC，Agent 承接 SDLC**
   - 人類專注於上下文開發週期
   - Agent 負責軟體開發週期

---

## 影響與坑

### 14 個常見坑（直接源自 Caesar Chi 文章）

| 問題 | 後果 |
|------|------|
| Spec 不完整 | 快速做錯 |
| Context 太多 | Agent attention 被污染 |
| Context 太少 | Agent 猜 architecture |
| 沒有 verifier | Agent 自稱完成 |
| Test coverage 假象 | 錯誤被測試共同合理化 |
| Agent 自己 review 自己 | Confirmation bias |
| Parallel agents 改同一區域 | Merge chaos |
| 太多 MCP tools | 工具選擇混亂 |
| 權限太大 | Blast radius 過大 |
| Production secrets 暴露 | Security incident |
| 無 network policy | Data exfiltration risk |
| 長時間 unattended | Error compounding |
| 每次 Session 從零 | 重複犯錯 |
| 所有 learnings 寫進 Context | Context bloat |
| AI code growth 無治理 | Agent-generated debt |

### 關鍵 KPI 轉變

- **不該測**：Token maximization（Token 數最大化）
- **該測**：
  - `Verified outcomes / Human hour`
  - `Verified PRs / Human Review Hour`
  - `Business Value / Human Attention`

> **Human attention 會變成最貴的 compute**

### 工具大比拼 (2026)

| 工具 | 突出方向 |
|------|----------|
| **Claude Code** | Terminal-first、context、skills、hooks、subagents、MCP |
| **Codex** | Multi-agent command center、cloud/local、skills、automation |
| **Cursor** | IDE + cloud agents + automations + artifacts + enterprise orchestration |
| **OpenCode** | Open harness、agent configuration、primary/subagent、permissions |

**哲學**：不要把 Organizational Knowledge 綁死在某一個 Agent 裡。理想架構是 Knowledge 共享，Model/Harness 可以換，但 Specs、Verification、Process 應該保留。

---

## 未來展望

### 三層架構定論

```
Human Judgment
    ↓
Agent Execution  
    ↓
Deterministic Backbone
```

每一層都直接對應商務流程、商業目標，而非單一任務執行。

### 12-24 個月預測

1. **技能標準化**：技能像庫一樣擁有標準化介面、版本管理與測試
2. **治理體系**：企業級技能治理、安全審計、使用追蹤
3. **跨領域應用**：不僅限軟體工程，還延伸至法律、金融、製造等領域
4. **工具鏈成熟**：Harness Engineering、Skill Engineering 工具與平台的出現
5. **角色轉型**：工程師從「實作者」轉向「技能體系架構師」與「審查者」

### 行動建議

**立即行動**：
1. 為關鍵項目建立行為規格（Behavior Spec）
2. 實施證據-based 驗證流程而非信任 completion
3. 將 AGENTS.md 重構為漸進式披露結構

**中期規劃**：
1. 導入 Skills 系統取代重複的 Prompt
2. 開發 Context Engineering 最佳實踐
3. 建立 Harness Engineering 能力

**長期願景**：
1. 從 L2 升級至 L3/L4 Agent 協作
2. 組織構建 Institutional Memory
3. 開發適合的 KPI 體系（Verified outcomes / Human hour）

---

## 參考資料

1. **AI-Native Agent 時代的 2026 年身為管理者應該知道的事情** — Caesar Chi (2026-09-05)
   - [原文連結](https://blog.caesarchi.com/2026/09/ai-native-agent-2026.html)
   - 涵蓋 agent 演進、14 個坑、KPI 轉變、工具比較

2. **Harness Engineering: A guide to building better AI coding agents** — Faros.ai (2026-05-22)
   - [原文連結](https://www.faros.ai/blog/harness-engineering)
   - 核心觀點：Agent = Model + Harness

3. **Harness engineering: leveraging Codex in an agent-first world** — OpenAI (2026-02-11)
   - [原文連結](https://openai.com/index/harness-engineering)
   - 實驗：5 個月、0 行手寫 code、10 倍速度提升

4. **Code as Agent Harness: Toward Executable, Verifiable, and Stateful Agent Systems** — arXiv (2026)
   - [原文連結](https://arxiv.org/html/2605.18747v1)
   - AHE 學術框架：分析運算環境

5. **The State of the AI Coding Stack: Agent Skills, Harnesses, and Enablement at AI Native DevCon London 2026** — Tessl (2026-06-02)
   - [原文連結](https://tessl.io/blog/the-state-of-the-ai-coding-stack-agent-skills-harnesses-and-enablement-at-ai-native-devcon-london-2026)
   - Skills are the New Code；CDLC 框架

6. **The March article on opencode** — quidproquo (2026-03-31)
   - [原文連結](https://quidproquo.cc/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en)
   - 站內文章：Opencode 與 Coding Agent 的介紹

7. **From Prompt to Harness: Three Evolutions of AI Engineering** — quidproquo (2026-03-28)
   - [原文連結](https://quidproquo.cc/posts/ai/2026-03-28-harness-engineering-evolution)
   - 站內文章：Harness Engineering 的三次演化