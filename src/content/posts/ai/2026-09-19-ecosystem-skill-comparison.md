---
title: "【生態篇】社群的 deep-research skill 都怎麼做"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, open-source, ecosystem, comparison, hyperresearch, jamoeight]
lang: zh-TW
tldr: "10+ 個社群開源的 deep-research skill 代表了 10+ 種「怎麼做研究」的哲學。從 hyperresearch 的持久化 vault 到 jamoeight v2 的 Co-Scientist 6-agent，從對抗驗證到 benchmark 對齊。這篇把它們放在一張表裡看。"
description: "全面比較 10+ 個社群開源 deep-research skill：hyperresearch、hashbulla、jamoeight v2、Silence-view、Socialpranker 等。分析共通模式（多 agent、對抗驗證、持久化 vault）與差異化設計。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 14
---

上一篇講專案自己的 skill。這篇講**社群**。

從 2025 年底到 2026 年初，社群湧現了 10+ 個 deep-research skill。它們代表的不是同一種解法，而是 10+ 種「怎麼做研究」的哲學。

## 社群全景

### 按核心設計分類

| 類別 | 代表 | 核心思路 |
|---|---|---|
| **持久化知識庫** | hyperresearch | SQLite 索引，研究知識跨任務累積 |
| **企業級** | hashbulla | NATO Admiralty grading、CRAG grounding |
| **SOTA 論文落地** | jamoeight v2 | Co-Scientist、AlphaEvolve、BrowseConf |
| **對抗驗證** | tolmachevmaxim | Optimist/Pessimist/Fact-Checker 三 agent |
| **規模化** | kaynquang | 13 個專門 agent 各司其職 |
| **學術導向** | Silence-view | STORM-inspired、citation chasing |
| **平台相容** | ramit-mitra | skills.sh 相容、30+ agent 平台 |
| **通用適配** | Bhllcoder1 | 15 runtime adapters |
| **數據驅動** | Socialpranker | 75 report blocks、29 channels、280+ stat sources |
| **工程師導向** | robertnowell | 6-phase、source quality gates |
| **人類回圈** | Weizhena | Human-in-the-loop、OpenCode/Codex 相容 |

### 詳細比較

#### hyperresearch（jordan-gibbs）

- **核心**：16-step pipeline + 持久 vault + MCP server + 16 agents
- **獨特**：「Patch 不 regenerate」——研究知識持續累積到 SQLite
- **優勢**：跨任務知識複用
- **缺點**：架構複雜、維護成本高

#### jamoeight/claude-code-deep-research-v2

- **核心**：Co-Scientist 6-agent + AlphaEvolve + BrowseConf + BATS
- **獨特**：v1→v2 升級了 novel hypothesis generation 和 evaluator-driven search
- **數據**：+10.3pp on deep-research benchmarks
- **優勢**：最新 SOTA 論文落地
- **缺點**：依賴 Claude Code 生態

#### hashbulla/deep-research

- **核心**：7-phase + NATO Admiralty 2×6 grading + CRAG grounding loop
- **獨特**：企業級 grading system
- **優勢**：結構化評估體系
- **缺點**：框架較重

#### tolmachevmaxim/deep-research-skill

- **核心**：3 agents（Optimist/Pessimist/Fact-Checker）
- **獨特**：對抗驗證——不是自己驗證自己，而是三個角色互論
- **優勢**：簡潔有效、file-based state
- **缺點**：依賴模型品質

#### Silence-view/deep-research

- **核心**：10 phases、STORM-inspired、citation chasing、Chain-of-Verification
- **獨特**：學術導向，嚴格引用追蹤
- **優勢**：學術可靠性
- **缺點**：速度較慢

#### Socialpranker/deepdive

- **核心**：7 phases、75 report blocks、29 channels、280+ stat sources
- **獨特**：方法論最完整、auto-sync
- **優勢**：極度結構化
- **缺點**：設定複雜

#### robertnowell/deep-research

- **核心**：6-phase、source quality gates、codebase-aware
- **獨特**：工程師導向，重視 source quality
- **優勢**：適合技術研究
- **缺點**：通用性較弱

## 共通架構模式

縱觀所有 skill，以下是**幾乎都有**的共通模式：

| 共通模式 | 描述 | 為什麼幾乎都有 |
|---|---|---|
| **多 agent parallel research** | 2-13 agents 同時研究 | 覆蓋廣度 + 速度 |
| **來源可信度評分** | tier 分級 / 6 維度 / NATO Admiralty | 過濾低品質來源 |
| **對抗驗證** | Pessimist/Fact-Checker/Red-team | 防止過度樂觀 |
| **聯合三角測量** | 3+ 獨立來源 | 確保事實準確 |
| **檔案化中間狀態** | crash recovery | 長時間研究不丟失進度 |
| **多層深度模式** | quick/standard/deep/ultradeep | 適應不同需求 |
| **Progressive Disclosure** | SKILL.md + references/ | 可維護性 |

## 與專案的對比

| 維度 | 專案 skill | 外部開源 skill |
|---|---|---|
| **工具邊界** | 嚴格只用 Groundlane | 多用 Tavily/Exa/Brave/Serper |
| **輸出目標** | `.research/` → post skill 發文 | 直接輸出報告 |
| **學術品質** | 有 A/B/C/D 分級 | 部分有（hashbulla、Silence-view） |
| **對抗驗證** | ❌ | ✅ 幾乎都有 |
| **持久化知識庫** | ❌ | ✅ hyperresearch 有 |
| **benchmark 對齊** | ❌ | jamoeight v2 有 BrowseConf |
| **跨平台** | ❌ 僅限 agent 環境 | ✅ skills.sh / 多 runtime |

## 值得學習的設計

1. **hyperresearch 的持久化 vault**——研究知識跨任務累積，而非每次從零開始
2. **tolmachevmaxim 的三角色對抗**——簡潔但有效的對抗驗證
3. **Socialpranker 的 75 blocks**——將報告拆解為可管理的小塊
4. **robertnowell 的 source quality gates**——在研究前過濾低品質來源

## 值得警覺的趨勢

1. **Skill 數量爆炸**——10+ 個 skill 代表了方法論的碎片化
2. **依賴特定平台**——大多數 skill 綁定 Claude Code 或 Codex
3. **基準遊戲**——有些 skill 為了 benchmark 數字優化，而非真實研究品質
4. **複雜度上升**——16 個 agent、10 個 phase，可能過度設計

## 參考資料

- [hyperresearch (jordan-gibbs)](https://github.com/jordan-gibbs/hyperresearch) — 16-step pipeline + 持久 vault。
- [jamoeight/claude-code-deep-research-v2](https://github.com/jamoeight/claude-code-deep-research-v2) — Co-Scientist + AlphaEvolve。
- [tolmachevmaxim/deep-research-skill](https://github.com/tolmachevmaxim/deep-research-skill) — 三角色對抗驗證。
- [Socialpranker/deepdive](https://github.com/Socialpranker/deepdive) — 75 blocks 方法論。
- [deep-research skill 定義](/.agents/skills/deep-research/SKILL.md) — 專案內的 skill 定義。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
