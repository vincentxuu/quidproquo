---
title: "後訓練 RL 三條路線：Ornith、Nous Research、MiniMax 怎麼用強化學習做出黑馬模型"
date: 2026-08-26
category: ai
type: deep-dive
tags: [reinforcement-learning, grpo, post-training, self-improvement, open-source, agentic-coding, fine-tuning]
lang: zh-TW
tldr: "2026 年三個非大廠團隊用不同的 RL 後訓練路線做出 benchmark 黑馬：Ornith 讓模型自己出題自己改進（GRPO self-improvement loop），Nous Research 用 DataForge 合成資料 + Atropos 執行獎勵 RL，MiniMax 在 20 萬個真實環境裡大規模 RL。三條路各有強項，但共同證明了一件事：後訓練 RL 比預訓練規模更重要。"
description: "比較 Ornith、Nous Research、MiniMax 三個團隊的 RL 後訓練方法論：self-scaffolding、DataForge/Atropos、大規模環境 RL，以及各自的成績、限制與對開源生態的影響。"
draft: false
glossary:
  - term: "GRPO"
    def: "Group Relative Policy Optimization，一種不需要 value model 的強化學習演算法，直接用組內相對獎勵更新策略，是 DeepSeek 提出、Ornith 採用的核心訓練方法"
  - term: "Rejection Sampling"
    def: "從模型產出的多個回應中，只挑通過品質門檻的樣本進入訓練集，Nous Research 的 Atropos 框架以此為基礎"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark，用真實 GitHub issue 測量模型解決軟體工程問題能力的標準測試集"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-self-improvement-rl-three-approaches-en)

2026 年有一個反直覺的現象：在 coding benchmark 上追平甚至超越閉源頂尖模型的，不是花最多錢預訓練的團隊，而是在後訓練階段把強化學習玩出花的小團隊。[Ornith](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)、[Nous Research](/posts/tech/2026-08-26-nous-research-hermes) 和 [MiniMax](/posts/tech/2026-08-26-minimax-model-family) 走了三條截然不同的 RL 路線，各自做出讓人意外的成績。這篇比較這三條路線的設計哲學、實際做法和各自的強弱。

## 共同前提：預訓練不是你的戰場

三個團隊有一個共同的策略選擇：**不自己從頭預訓練基礎模型**。

- Ornith 建立在 Qwen3.5 和 Gemma 4 之上
- Nous Research 的 Hermes 4 用 Llama 3.1，NousCoder 用 Qwen3-14B
- MiniMax 的基底模型是自研的，但他們把 RL 後訓練視為模型能力的主要來源

這個共同選擇背後的邏輯很直白：預訓練需要幾千張 GPU 跑幾個月，是大廠的軍備競賽。但後訓練 RL——怎麼讓模型從既有知識中學會更好的行為——是一個聰明策略可以勝過蠻力的領域。

依 ACL 2026 發表的 [Scaling Behaviors of LLM Reinforcement Learning Post-Training](https://aclanthology.org/2026.acl-long.1444) 研究，RL 後訓練的 scaling law 與預訓練不同：即使基底模型不變，RL 訓練的 compute 增加仍能持續帶來能力提升，尤其在推理和 coding 任務上。

## 路線一：Ornith 的 Self-Improvement Loop

[Ornith（DeepReinforce）](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)的核心想法是：**讓模型自己產出訓練資料、自己改進**。

### 怎麼運作

Ornith 1.5 的訓練迴圈有三個聯合優化的階段，全部用 [GRPO](https://futureagi.com/blog/what-is-grpo-llm-reinforcement-learning-2026)（Group Relative Policy Optimization）驅動：

```
Task Generation → Scaffold Construction → Solution Rollout
     ↑                                          |
     └──────────── reward signal ───────────────┘
```

1. **模型自己出題**——依 validity、frontier difficulty、novelty 三個訊號給獎勵
2. **模型設計解題 scaffold**——工具呼叫策略、推理框架
3. **模型執行解題**——rollout 的獎勵回傳給前兩個階段

### 為什麼選 GRPO

GRPO 不需要獨立的 value model（critic），而是在同一組 rollout 裡用相對排名算優勢。這讓三個階段可以共用同一個 RL 框架聯合優化，而不需要為每個階段各養一個 critic。對小團隊來說，這大幅降低了訓練基礎設施的複雜度。

### 成績與強項

- **Coding 最強**：35B-A3B 在 SWE-bench Verified 79.0（同量級唯一破 79）
- **自主改進**：模型越強 → 出的題越難 → scaffold 越聰明，形成正向循環
- **弱點**：通用推理（HLE）仍落後大模型，self-improvement 目前集中在 coding 任務

## 路線二：Nous Research 的 DataForge + Atropos

[Nous Research](/posts/tech/2026-08-26-nous-research-hermes) 的策略不同：**用專門的工具鏈合成高品質訓練資料，再用執行獎勵做 RL**。

### 怎麼運作

Nous 的訓練管線有兩個自研框架：

- **DataForge**：圖結構的合成資料生成器。不是隨機出題，而是用知識圖譜的結構關係產出有邏輯一致性的訓練樣本。Hermes 4 的訓練集有 350 萬個推理樣本 + 160 萬個非推理樣本
- **Atropos**：開源 RL 框架，核心機制是 rejection sampling——模型對同一道題產出多個回應，只有通過品質門檻的才進入訓練集

NousCoder-14B 更進一步，用**執行獎勵 RL**：模型寫的程式碼會被實際執行，獎勵直接來自「跑過了沒有」。

### 跟 Ornith 的差異

Ornith 讓模型自己生成訓練任務；Nous 用外部工具（DataForge）生成。差異在於：

| | Ornith | Nous |
|---|---|---|
| 訓練資料來源 | 模型自己生成 | DataForge 圖結構生成 |
| RL 演算法 | GRPO（組內相對排名） | Rejection Sampling + 執行獎勵 |
| 迭代方式 | 閉迴圈自我改進 | 外部資料管線 + RL 微調 |
| 可重現性 | 部分公開 | NousCoder 完全公開（程式碼、資料、harness） |

### 成績與強項

- **推理最強**：Hermes 4 405B 在 MATH-500 拿 96.3%、AIME 2024 81.9%
- **極度資料高效**：NousCoder-14B 只用 24K 樣本就把基底模型 coding 能力拉高 7%
- **完全可重現**：NousCoder 的訓練程式碼、資料和 harness 全部公開
- **弱點**：依賴基底模型授權（Llama 3.1 有 700M MAU 限制），模型規模受限於基底

## 路線三：MiniMax 的大規模環境 RL

[MiniMax](/posts/tech/2026-08-26-minimax-model-family) 的做法最「暴力」也最不同：**在 20 萬個真實環境裡做大規模 RL，不靠自我生成也不靠合成資料**。

### 怎麼運作

MiniMax 官方描述 M2.5 經過「數十萬個複雜真實環境的大量 RL 訓練」，涵蓋 10 種以上語言。具體做法：

- 不是在抽象題目上訓練，而是在真實的開發環境（codebase、API、系統）裡訓練
- M3 更進一步，用 **interactive user-simulator framework**——模擬真實使用者的多輪對話，在互動中學習

### 跟前兩者的差異

Ornith 和 Nous 都在「解題」的範式裡做 RL（模型解題 → 獲得獎勵）。MiniMax 的差異在於**環境的豐富度**：不是一道一道題，而是完整的軟體開發環境。

這帶來了一個有趣的副產品——**emergent spec-writing behavior**：模型在 coding 時會自發地先寫架構規格再動手寫程式碼，這不是被明確訓練的，而是從大量環境 RL 中自己學到的行為。

### 成績與強項

- **性價比最強**：M2.5 SWE-bench Verified 80.2%，API 價格只有 Claude Opus 的 1/10-1/20
- **規模取勝**：M3（456B 總量）是首個在 SWE-bench Pro 突破 59% 的開源權重模型
- **弱點**：訓練細節不如 Ornith 和 Nous 公開，可重現性較低

## 三條路線的比較

| 維度 | Ornith | Nous Research | MiniMax |
|---|---|---|---|
| 核心方法 | Self-improvement loop (GRPO) | DataForge + Atropos (rejection sampling) | 大規模環境 RL |
| 訓練資料 | 模型自己生成 | 外部圖結構合成 | 真實環境互動 |
| 最強領域 | Agentic coding | 推理 + coding | 性價比 + coding |
| 代表成績 | SWE-bench 79.0（35B-A3B） | MATH-500 96.3%（405B） | SWE-bench 80.2%（229B） |
| 開源程度 | 權重公開、方法部分公開 | 權重 + 程式碼 + 資料全公開 | 權重公開、訓練細節有限 |
| 團隊規模 | 小（研究團隊） | 小（30-50 人） | 中（415 人） |

## 更大的問題：Self-Improvement 會收斂嗎？

Ornith 的 self-improvement loop 提出了一個根本性的問題：如果模型自己出題自己改進，會不會到某個點就停滯？

目前的證據是樂觀的——Ornith 從 1.0 到 1.5，DeepSWE 從 8.0 跳到 56.0（397B），漲幅巨大。但這也可能只是低垂的果實。當模型接近人類工程師的能力上限時，self-improvement 的邊際效益是否會急劇下降，目前還沒有人知道。

Nous 和 MiniMax 的路線迴避了這個問題——它們的訓練資料來自外部（合成工具或真實環境），不依賴模型自己的能力邊界。但代價是需要不斷擴大環境和資料管線。

## 對開源生態的意義

三條路線共同證明的一件事：**後訓練 RL 是小團隊能贏的戰場**。

預訓練需要海量資料和算力，是大廠的護城河。但後訓練 RL 的競爭維度不同——它比的是訓練方法的創意、獎勵訊號的設計、環境的品質。Ornith 用不到大廠十分之一的團隊做出追平 Claude Opus 4.8 的成績，NousCoder 用 24K 樣本就把基底模型拉高 7%，MiniMax 用十分之一的價格提供 80% 的性能。

如果這個趨勢持續，開源模型生態會從「誰預訓練得最大」轉向「誰的後訓練 RL 最聰明」。而這場比賽，小團隊不一定會輸。

## 參考資料

- [Ornith 1.5 官方技術報告](https://ornith.ai/ornith_1_5.html)
- [Nous Research — Atropos RL 框架](https://github.com/NousResearch/Atropos)
- [MiniMax 官方頁面](https://www.minimax.io/)
- [What Is GRPO in LLM Reinforcement Learning? — FutureAGI](https://futureagi.com/blog/what-is-grpo-llm-reinforcement-learning-2026)
- [Scaling Behaviors of LLM RL Post-Training — ACL 2026](https://aclanthology.org/2026.acl-long.1444)
- [How Agentic RL Trains Autonomous Agents in 2026 — FutureAGI](https://futureagi.com/blog/how-agentic-rl-trains-autonomous-agents-2026)
- [Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) — 本站
- [Nous Research：從研究社群到開源 AI 生態系的反叛者](/posts/tech/2026-08-26-nous-research-hermes) — 本站
- [MiniMax：聊天機器人公司做出的 Coding 模型，性價比碾壓閉源](/posts/tech/2026-08-26-minimax-model-family) — 本站
