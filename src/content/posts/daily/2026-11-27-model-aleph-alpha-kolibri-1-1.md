---
title: "模型卡｜Kolibri 1.1"
date: 2026-11-27
category: daily
type: digest
tags: [ai-agent, model-release, daily, aleph-alpha, model-family-kolibri]
lang: zh-TW
description: "Aleph Alpha 發布 Kolibri 1.1——75B 總參數／3.44B 活躍參數的稀疏注意力 MoE 模型，1M context 下 decode 速度比前代快 14 倍，AgentDojo 抗 prompt injection 攻擊率衝到 99.1%"
tldr: "Kolibri 1.1（Aleph-Alpha/Kolibri-1.1，2026-11-23 發布，Apache 2.0）：75B 總參數／3.44B 活躍參數 MoE、context window 最高 1,048,576 tokens；SWE-bench Verified 70.4%（前代 1.0 為 64.0%）、AgentDojo 抗 prompt injection 99.1%（前代僅 30.3%）；新稀疏注意力架構讓 1M tokens 下 decode 速度比前代快 14 倍，每千任務 GPU 時間省到 3.4 倍以下；主打歐盟資料主權與合規部署"
series:
  name: "AI Model Tracker"
  order: 83
glossary:
  - term: "Kolibri"
    def: "Aleph Alpha 推出的德國／英語雙語開源 MoE 模型家族，強調資料主權與歐盟法規合規（EU AI Act、GDPR）"
---

> :globe: [English version](/posts/daily/2026-11-27-model-aleph-alpha-kolibri-1-1-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Aleph-Alpha/Kolibri-1.1`（另提供官方 GGUF 量化版 `Aleph-Alpha/Kolibri-1.1-GGUF`） |
| 廠商 | Aleph Alpha（德國 Heidelberg；開發方 Aleph Alpha Research GmbH） |
| 參數量 | 75B 總參數（75,128,393,984）、3.44B 活躍參數／token（3,439,874,304），Mixture-of-Experts |
| Context Window | 262,144 tokens 原生，可擴展至 1,048,576 tokens（官方建議複雜任務維持在 262,144 以內） |
| Input 定價 (USD/1M tokens) | 未提供公開定價（開源權重可自建部署；官方 Inference API 採客製合約，須洽詢銷售） |
| Output 定價 (USD/1M tokens) | 未提供公開定價（同上） |
| 開源 | 是（Apache License 2.0） |
| 發布日 | 2026-11-23 |
| 官方公告 | [Aleph Alpha Blog：Kolibri 1.1: More Efficient. More Capable.](https://aleph-alpha.com/en/blog/kolibri-1-1) |
| HuggingFace | [Aleph-Alpha/Kolibri-1.1](https://huggingface.co/Aleph-Alpha/Kolibri-1.1) |
| 家族 | Kolibri 1.x（前代 Kolibri 1.0 約 2026-10 初發布，7 週後推出本次 1.1） |

## 能力亮點

- **Agentic coding 全面提升**：SWE-bench Verified 由 64.0% 提升到 70.4%，Terminal-Bench 2.1 由 25.8% 提升到 35.6%
- **新稀疏注意力架構大幅降低長 context 成本**：1M tokens context 下 decode 速度比前代快達 14 倍，每千個任務的 GPU 時間從 0.718 GPU-h 降到 0.208 GPU-h（約 3.4 倍）
- **抗 prompt injection 能力躍升**：AgentDojo 測試下攻擊抵抗率從前代僅 30.3% 衝到 99.1%，是官方對照的所有模型（含參數更大的 GPT-OSS 120B、Mistral Small 4）中最高
- **推理效率提升**：同等任務平均減少 41% 輸出 token，低推理強度下輸出量只要前代的約 1/3.6，直接壓低延遲與成本

## Benchmark 表現

| Benchmark | 分數 | 前代 (Kolibri 1.0) | 競品最強 (GPT-OSS 120B) |
|---|---|---|---|
| AIME 2026 | 95.8 | 95.6 | 92.9 |
| SWE-bench Verified | 70.4% | 64.0% | 57.8% |
| BrowseComp-Plus（代理式檢索） | 43.9% | 33.1% | 33.1%（同分） |
| AgentDojo 抗 prompt injection | 99.1% | 30.3% | 67.5% |
| GPQA Diamond | 87.1% | 84.7% | 78.6% |

以上均為 Aleph Alpha 自建評測框架的自測結果，用相同重量級（3–4B 活躍參數）與更大模型對照；GPT-OSS 120B（5B 活躍參數）為官方點名「更大但仍被超越」的對照模型之一，獨立機構尚未重現這張表。

```diagram
title: Kolibri 1.1 對前代 Kolibri 1.0 的四項關鍵指標對照
desc: Kolibri 1.1 在抗 prompt injection 攻擊、代理式檢索、終端任務與程式修復四項指標上全面超越前代 Kolibri 1.0，進步幅度最大的是 AgentDojo 抗注入攻擊。
caption: 數值來自 Aleph Alpha 官方部落格與模型卡公布的自測結果；x 座標 = 200 + 分數(%) × 4，0% 對應 x=200、100% 對應 x=600。列按 1.1 相對 1.0 的進步幅度由大到小排序。
---
<svg viewBox="0 0 680 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">AgentDojo 抗注入</text>
  <line class="dg-axis" x1="307" y1="90" x2="596" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="307" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="596" cy="90" r="6"/>
  <text class="dg-sub" x="295" y="90" text-anchor="end" dominant-baseline="central">30.3%</text>
  <text class="dg-label dg-text--accent" x="608" y="90" text-anchor="start" dominant-baseline="central">99.1%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">BrowseComp-Plus</text>
  <line class="dg-axis" x1="332" y1="170" x2="376" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="332" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="376" cy="170" r="6"/>
  <text class="dg-sub" x="320" y="170" text-anchor="end" dominant-baseline="central">33.1%</text>
  <text class="dg-label dg-text--accent" x="388" y="170" text-anchor="start" dominant-baseline="central">43.9%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">Terminal-Bench 2.1</text>
  <line class="dg-axis" x1="303" y1="250" x2="342" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="303" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="342" cy="250" r="6"/>
  <text class="dg-sub" x="291" y="250" text-anchor="end" dominant-baseline="central">25.8%</text>
  <text class="dg-label dg-text--accent" x="354" y="250" text-anchor="start" dominant-baseline="central">35.6%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">SWE-bench Verified</text>
  <line class="dg-axis" x1="456" y1="330" x2="482" y2="330"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="456" cy="330" r="6"/>
  <circle class="dg-point dg-c-accent" cx="482" cy="330" r="6"/>
  <text class="dg-sub" x="444" y="330" text-anchor="end" dominant-baseline="central">64.0%</text>
  <text class="dg-label dg-text--accent" x="494" y="330" text-anchor="start" dominant-baseline="central">70.4%</text>

  <line class="dg-rule" x1="20" y1="356" x2="660" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">圖例</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="130" cy="382" r="6"/>
  <text class="dg-small" x="146" y="382" dominant-baseline="central">Kolibri 1.0</text>
  <circle class="dg-point dg-c-accent" cx="300" cy="382" r="6"/>
  <text class="dg-small" x="316" y="382" dominant-baseline="central">Kolibri 1.1</text>
</svg>
```

## 與前代/競品比較

跟 Kolibri 1.0 比，最大進步落在代理式檢索與安全性。BrowseComp-Plus 從 33.1% 提升到 43.9%、MuSiQue 從 78.3% 提升到 86.4%、德文 Agentic Wiki QA 從 63.9% 提升到 73.7%，代表處理長文件、多輪搜尋這類 agent 任務時精準度明顯提升。安全性同樣是重點：AgentDojo 抗注入攻擊從 30.3% 跳到 99.1%，CyberSecEval 2 的攻擊成功率則從 14.7% 降到 6.8%。

跟競品比，在同屬 3–4B 活躍參數的重量級裡，Kolibri 1.1 的整體分數（英文 72.2%、德文 74.2%）是最高的，甚至超過參數更大的 GPT-OSS 120B（5–6B 活躍參數，63.4%）、Mistral Small 4（56.6%）與 Nemotron 3 Super（12–18B 活躍參數，64.0%）。但在少數單項指標上仍落後同量級對手，例如工具呼叫的 BFCL v4，Kolibri 1.1 的 62.7% 低於 Qwen3.6 35B-A3B 的 67.1%。

定價策略上 Aleph Alpha 不走公開 API 計價，而是以 GPU 時間作為效率指標：每千個任務只需 0.208 GPU-h（8×B200），比前代的 0.718 GPU-h 省下 3.4 倍——對選擇自建部署的企業而言，這是可直接換算成基礎設施成本下降的數字，而非牌價折扣。

## 對 Agent 開發的意義

稀疏注意力架構是這次最直接影響工程選型的變化：每個 token 只關注最相關的 2,048 個 token 加上最近的 128 個，讓長 context 下的推理不必再用全量注意力硬撐，這也是 1M tokens 下 decode 速度能提升 14 倍的核心原因。

- 如果你在做需要資料主權與合規（EU AI Act、GDPR）的 agent 系統：Kolibri 1.1 全程在歐洲境內訓練與推理，加上德國公部門客戶代理測試集拿下 86.0%（同量級最高），適合政府機關、製造業等需要本地化部署的場景
- 如果你在做長文件或大型 codebase 的 agentic workflow：稀疏注意力架構讓長 context 推理延遲大幅降低，最小量化版本 24GB VRAM 就能跑，適合把整份法規文件或程式碼庫塞進單次 context 的場景
- 不適合：需要頂級工具呼叫精度（BFCL 落後同量級對手）或超大規模知識覆蓋（Humanity's Last Exam 僅 10.5%）的場景，這類任務上規模更大的模型如 GLM-5.3 Flash、Qwen3.8 Flash Next 表現明顯更好

## 今日收穫

過去容易把「主權／合規導向的區域模型」跟「效能妥協」劃上等號，覺得這類模型是為了滿足法規而犧牲競爭力。但 Kolibri 1.1 顯示用稀疏注意力加上更有效率的推理，3B 活躍參數規模也能在安全性（AgentDojo 99.1%）與長 context 吞吐量（14 倍）上同時超越參數更大的開源模型——合規不必然是效能的對立面，工程上做對選擇反而可以兩者兼得。

## 參考資料

- [Aleph Alpha Blog：Kolibri 1.1: More Efficient. More Capable.（官方發布文，含完整 benchmark 表）](https://aleph-alpha.com/en/blog/kolibri-1-1)
- [HuggingFace：Aleph-Alpha/Kolibri-1.1（模型卡，含參數規格與授權）](https://huggingface.co/Aleph-Alpha/Kolibri-1.1)
- [HuggingFace：Aleph-Alpha/Kolibri-1.1-GGUF（官方量化版，含本地部署指令）](https://huggingface.co/Aleph-Alpha/Kolibri-1.1-GGUF)
- [Aleph Alpha Blog：Kolibri has landed — a sovereign open-weight model（Kolibri 1.0 發布文）](https://aleph-alpha.com/en/blog/kolibri-has-landed-a-sovereign-open-weight-model/)
