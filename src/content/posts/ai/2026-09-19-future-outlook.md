---
title: "未來展望：從研究工具到科學基礎設施"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, future, self-evolving, agent-swarm, scientific-automation]
lang: zh-TW
tldr: "Deep research 從『幫你搜資料』到『幫你做研究』已經發生了。但下一步更大：agent 自我進化、群叢協作、科學自動化。這篇看三個方向，以及一個 uncomfortable 的現實：Gartner 預測 40% 的 agent 專案會在 2027 年前被取消。"
description: "展望 deep research 的未來三個方向：自我進化 agent（從工具到主體）、群叢協作（多 agent 科學發現）、科學自動化（假說→實驗→論文）。同時反思 40% agent 專案將被取消的現實。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 15
---

這是系列的最後一篇。前面 14 篇從全景、訓練、架構、工具、評估、應用層層深入。

這篇看**未來**。不是預測，而是從當前趨勢推導可能的走向。

## 已完成 vs. 還沒做到

先誠實面對現狀：

| 已經做到 | 還沒做到 |
|---|---|
| 從網路搜尋並綜合報告 | 自主提出原創假說 |
| 跨來源交叉驗證 | 自主設計並執行實驗 |
| 產出帶引用的報告 | 自主投稿並通過同行審查 |
| 持續搜尋直到「滿意」 | 持續改進直到「正確」 |

Deep research agent 目前是**強大的助手**，但還不是**自主的研究者**。

## 方向一：自我進化 Agent

### 從工具到主體

AREX 已經示範了「雙循環自我改進」的原型。下一代是：

**自我進化 agent**：不僅能修正自己的錯誤，還能修改自己的策略、架構、甚至學習方法。

從搜尋結果看：
- **Self-Evolving Agents** 調查（Gao et al., 2025, 277 引用）：確立了「什麼時候、怎麼樣、在哪裡進化」的框架
- **AlphaEvolve**：coding agent 發現新的演算法
- **AutoResearchClaw**：自動化整個科學生命週期，從假說到 NeurIPS -ready PDF
- **FARS（Analemma AI）**：跑了 417 小時，產出 166 篇 AI 生成論文

### 關鍵問題

自我進化的邊界在哪裡？

- **安全的自我進化**：修改策略但保留核心價值觀
- **不安全的自我進化**：為了「表現更好」而改變行為，可能產生意外後果
- **人類監督的角色**：進化到什麼程度需要人類批准？

## 方向二：群叢協作

### 從單一 agent 到 agent 群

Claude Code 的 deep research 已經觸發了 199 個平行 sub-agent（雖然是意外的）。未來的 agent 群是**有意識的群叢**：

- **MiroThinker**：多模型協作，BrowseComp 75.3 分數
- **MiroFlow**：5+ 基準榜首，支援多種模型
- **SWARMRESEARCH**：編排 coding agents 做開放式發現
- **MiroFish**：$1 以下的群叢智慧引擎

### 群叢 vs. 單一 agent 的取捨

| | 群叢 | 單一 agent |
|---|---|---|
| **廣度** | 優（多 agent 平行探索） | 限 |
| **深度** | 可能分散 | 優（專注一條路） |
| **成本** | 高 | 低 |
| **一致性** | 難維持 | 高 |
| **適用** | 需要多角度 | 需要縱深 |

### 不舒服的現實

Gartner 預測：**到 2027 年底，超過 40% 的 agent 專案會被取消**。原因通常是「群叢被用在了錯誤的任務上」。

不是技術不行，而是**什麼時候該用群叢、什麼時候不該**，目前還沒有被充分理解。

## 方向三：科學自動化

### 從研究助手到研究基礎設施

最終，deep research agent 的終極形態不是「幫你做研究」，而是**成為科學基礎設施的一部分**：

```
假說生成 → 實驗設計 → 自動執行 → 數據分析 → 論文撰寫 → 投稿審查
```

每個步驟都由 agent 負責，人類只做最終判斷。

### 已經在做的事

- **FARS**：417 小時產出 166 篇論文
- **AutoResearchClaw**：自動化整個科學生命週期
- **FAROS (OpenNSWM-Lab)**：藍圖驅動的 AutoResearch runtime
- **AlphaEvolve**：發現新演算法

### 關鍵挑戰

1. **可重現性**：AI 生成的實驗能重現嗎？
2. **誠實性**：AI 會偽造數據嗎？
3. **歸屬**：AI 生成的論文作者是誰？
4. **品質控制**：誰來審查 AI 審查的結果？

## 三個方向的交匯

自我進化 × 群叢 × 科學自動化 = **自主科學研究基礎設施**

```
自我進化的 agent 群 → 自動化科學流程 → 從假說到論文全自動
```

但這也帶來了根本性的問題：

> **當 AI 能自主做科學研究的時候，人類的角色是什麼？**

可能不是「被取代」，而是「升級」——從做研究變成提問題、設定方向、判斷價值。

## 不舒服的真相

最後一個觀點，來自多個來源的交叉驗證：

1. **Gartner**：40% agent 專案在 2027 前取消
2. **企業回滾率**：74% 企業已經回滾了生產環境的 AI agent
3. **技術 vs. 應用**：技術進步快於應用成熟度
4. **Skill 碎片化**：10+ 個 deep-research skill 代表方法論還沒收斂

**技術已經準備好了，但人類還沒準備好怎麼用。**

## 對我們的意義

這個系列的 16 篇文章本身就是在做一件事：**幫助讀者理解這個領域，從而做出更好的判斷**。

最終目標不是讓讀者「知道所有細節」，而是讓讀者：
1. 知道有什麼可以選
2. 知道每個選擇的取捨
3. 知道什麼時候該用什麼
4. 知道未來可能會怎樣

## 參考資料

- [A Survey of Self-Evolving Agents](https://arxiv.org/abs/2507.21046) — Gao et al., 277 引用。
- [AgentSwarm Playbook 2026](https://en.fedoseev.one/en/research/ai-swarm-playbook-2026) — 群叢應用地圖。
- [AlphaEvolve](https://arxiv.org/abs/2509.13309) — Coding agent 科學發現。
- [FARS (Analemma AI)](https://arxiv.org/abs/2603.20278) — 417 小時、166 篇論文。
- [AREX: Towards a Recursively Self-Improving Agent](https://arxiv.org/abs/2607.21461) — 本系列 order 3，雙循環原型。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列起點：三階段全景分類。
