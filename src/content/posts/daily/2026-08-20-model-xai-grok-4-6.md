---
title: "模型卡｜Grok 4.6"
date: 2026-08-20
category: daily
tags: [ai-agent, model-release, daily, xai]
lang: zh-TW
description: "xAI 發佈 Grok 4.6——聚焦長時間執行 agent 與視覺互動任務，GDPVal-AA v2 拿下 1753 Elo 全場最高，定價維持 $2/$6 不變"
tldr: "Grok 4.6：context window 500K tokens、input $2/output $6 per 1M tokens（與 4.5 相同）、AA Intelligence Index 61（追平 GPT-5.6 Sol Max）、GDPVal-AA v2 1753 Elo 全場最高，但 DeepSWE、Terminal-Bench 仍落後 GPT-5.6 Sol 與 Claude Fable 5"
series:
  name: "AI Model Tracker"
  order: 3
---

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `grok-4.6` |
| 廠商 | xAI |
| 參數量 | 未公開 |
| Context Window | 500,000 tokens |
| Input 定價 (USD/1M tokens) | $2.00（< 200K prompt tokens）／$4.00（≥ 200K） |
| Output 定價 (USD/1M tokens) | $6.00（< 200K prompt tokens）／$12.00（≥ 200K） |
| 開源 | 否 |
| 發布日 | 2026-08-12 |
| 官方公告 | [xAI News](https://x.ai/news/grok-4-6) |

## 能力亮點

- Terminal-Bench v3.0 從前代 15.7% 跳升到 26%（+10.3 個百分點），長時間終端機操作能力大幅提升
- DeepSWE v1.1 從 54% 提升到 65.9%（+11.9pp），長橫向程式碼修復任務表現增強
- GDPVal-AA v2（知識工作評測）達 1753 Elo，超越 Claude Fable 5 Max 的 1741，是目前所有已公開分數中最高
- 在打造完整可用產品雛形（visual/interactive projects）上一次生成即具備完整結構與視覺語言，並開始出現自我測試、自我驗證行為

## Benchmark 表現

| Benchmark | 分數 | 前代 (Grok 4.5 High) | 競品最強 |
|---|---|---|---|
| AA Intelligence Index | 61 | 56 | Claude Fable 5 Max 62 |
| GDPVal-AA v2 | 1753 | 1526 | Claude Fable 5 Max 1741 |
| DeepSWE v1.1 | 65.9% | 54% | GPT-5.6 Sol Max 73% |
| Terminal-Bench v3.0 | 26% | 15.7% | GPT-5.6 Sol Max 34.6% |
| CursorBench v3.2 | 69.9% | 66.7% | Claude Fable 5 Max 70.5% |

⚠️ 以上均為 xAI 自測或引用各廠商公開系統卡／排行榜資料，競品分數取各方自報最佳成績，尚待第三方獨立複現。

## 與前代/競品比較

跟 Grok 4.5 比，Grok 4.6 在 agentic coding 與長任務執行上進步最明顯：Terminal-Bench v3.0 幾乎翻倍（15.7% → 26%），DeepSWE v1.1 提升近 12 個百分點。xAI 表示這來自更長的補充訓練回合、用 Grok 4.5 重新生成跨 reasoning effort 與 agent harness 的 SFT 軌跡，再疊加涵蓋 kernel 優化、web development、CAD 等領域的 agentic RL 訓練。

跟競品比，Grok 4.6 在 AA Intelligence Index 上以 61 分追平 GPT-5.6 Sol Max，僅落後 Claude Fable 5 Max 的 62 分 1 分，統計上已經打平。但拆開看 coding 專項評測，Grok 4.6 仍非最強：DeepSWE v1.1 落後 GPT-5.6 Sol Max 達 7.1pp，Terminal-Bench v3.0 落後 8.6pp。反而在知識工作導向的 GDPVal-AA v2 上以 1753 Elo 拿下全場最高，超越 Fable 5 Max 與 GPT-5.6 Sol Max。

定價維持 $2/$6（低於 200K tokens 時）不變，跟 Grok 4.5 完全相同，等於在性能提升的前提下沒有漲價。相比 Claude Fable 5 的 $10/$50，Grok 4.6 便宜 5 倍，但 context window 只有 500K tokens，是 Fable 5、GPT-5.6 Sol 等對手常見的 1M tokens 的一半。

## 對 Agent 開發的意義

Grok 4.6 這次的訓練重點放在「能撐住多步驟任務」而非單純堆高單一 benchmark 分數，這對需要長時間自主執行的 agent 架構有直接影響。

- 如果你在做 coding agent 且已經整合 Cursor 或 Grok Build：Grok 4.6 原生支援這兩個工具鏈，且開始出現自我測試/驗證行為，適合拿來跑「一次性產出完整雛形」的長任務，不需要每一步都人工確認
- 如果你在做知識工作型 agent（研究、資料分析、報告生成）：GDPVal-AA v2 全場最高分是個訊號，值得評估取代目前用 GPT-5.6 Sol 或 Fable 5 跑的 pipeline，同時省下不少 token 成本
- 不適合：純硬核 coding 場景（大型 repo 重構、複雜 debug），DeepSWE 與 Terminal-Bench 仍落後 GPT-5.6 Sol Max 兩位數百分比；也不適合需要超長上下文的場景，500K tokens 的 context window 在同代模型中偏小，處理超大型 codebase 或長文件仍可能需要搭配 RAG

## 今日收穫

Grok 4.6 在 GDPVal-AA v2（知識工作）拿下全場最高分，卻在 DeepSWE、Terminal-Bench 這類硬核 coding benchmark 上落後 GPT-5.6 Sol 與 Fable 5 兩位數個百分點——這說明「知識工作 agent」與「coding agent」的評測正在分化成兩條不同的能力曲線。單看一個綜合指數（如 AA Intelligence Index）已經不夠用，選模型前得先確認自己的 agent 場景偏哪一條曲線。

## 參考資料

- [Introducing Grok 4.6 — xAI News](https://x.ai/news/grok-4-6)
- [Grok 4.6 — xAI Developer Docs](https://docs.x.ai/developers/models/grok-4.6)
- [Pricing — xAI Developer Docs](https://docs.x.ai/developers/pricing)
