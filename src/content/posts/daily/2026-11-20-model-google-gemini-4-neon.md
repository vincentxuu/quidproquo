---
title: "模型卡｜Gemini 4 Neon"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: zh-TW
description: "Google 發佈 Gemini 4 Neon，定位在 Hydrogen 與 Carbon 之間，AA Intelligence Index 61 分全球第三，但官方比較表只挑了分數較低的 Claude Opus 5.5 和 GPT-6.2 Sol 當對手"
tldr: "Gemini 4 Neon（API ID `gemini-4-neon`）：2026-11-18 發佈，定位在 Hydrogen 與 Carbon 之間，1M context window，定價 input $3.00／output $15.00／cache $0.15 per 1M tokens；AA Intelligence Index v5.0.1 得 61 分全球第三，但官方比較表只拿 Claude Opus 5.5（59）與 GPT-6.2 Sol（57）比，沒放進分數更高的 Claude Fable 5.2（65）與 GPT-6.2 Astra（62）；AA-Omniscience 幻覺率 13.9–14.4%，反而比同家族的 Carbon（11.4%）、Hydrogen（8.5%）、Argon（4.3%）都高"
series:
  name: "AI Model Tracker"
  order: 77
glossary:
  - term: "Gemini"
    def: "Google DeepMind 開發的大型語言模型家族，Neon 是 Gemini 4.x 分支裡定位在 Hydrogen 與 Carbon 之間的平衡款模型"
---

> 🌏 [English version](/posts/daily/2026-11-20-model-google-gemini-4-neon-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gemini-4-neon`（Google AI Studio 官方連結確認，Gemini API 定價頁截至發文時尚未列出獨立條目） |
| 廠商 | Google DeepMind |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens（官方公告數字；第三方（DataCamp、MindStudio）測得單次回應輸出上限約 64,000 tokens，官方未單獨公布） |
| Input 定價 (USD/1M tokens) | $3.00（cache hit $0.15，官方標示為 95% 折扣） |
| Output 定價 (USD/1M tokens) | $15.00 |
| 開源 | 否（閉源，Google 專有） |
| 發布日 | 2026-11-18 |
| 官方公告 | [Google Blog：Introducing Gemini 4 Neon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/) |
| HuggingFace | 不適用（閉源模型） |
| 家族 | Gemini 4.x（一個月內第四個發布的分支，接續 Argon、Carbon、Hydrogen，定位介於 Hydrogen〔快、日常〕與 Carbon〔旗艦、長程任務〕之間） |

## 能力亮點

- Artificial Analysis Intelligence Index v5.0.1（xhigh 思考等級）拿下 61 分，全球第三——但官方比較表只拿 Claude Opus 5.5（59）、GPT-6.2 Sol（57）當對手，獨立榜單上分數更高的 Claude Fable 5.2（65）、GPT-6.2 Astra（62）都沒被放進比較表
- Vals Index 排名全球第二（70.9%），同時拿下 Legal Research Bench、Tax Agent Bench 兩項子榜榜首；Zapier AutomationBench（XHigh 等級）56.32% 全球第一，每次執行成本 $1.69，比同家族 Carbon（High 等級）的 53.88%／$2.12 還便宜
- Artificial Analysis Coding Agent Index 全球第一（58.6 分），Terminal-Bench 4.1 65.2%；第三方 KingBench 4（六專案程式碼評測，滿分 60）拿下 37.9 分（63.2%）排名第二，贏過 Claude Opus 5.5（34.7）、GPT-6.2 Astra（33.9）、GPT-6.1 Sol（33.0），只輸 Claude Fable 5.2（42）
- 資安三項同步刷新：AutoBaxBench 高難度題拿下 76% SOTA、WebExploitBench 51.26% SOTA 且成本只要競品一半、SEC-bench Pro（漏洞挖掘）90.5%

## Benchmark 表現

| Benchmark | Gemini 4 Neon | 同代比較 | 競品最強 |
|---|---|---|---|
| AA Intelligence Index v5.0.1 | 61（xhigh） | Carbon 60（high，同代旗艦） | Claude Fable 5.2　65 |
| Zapier AutomationBench（XHigh，每次執行成本） | 56.32%／$1.69 | Carbon High　53.88%／$2.12 | GPT-6.2 Astra Max　52.36%／$0.83 |
| KingBench 4（第三方六專案程式碼評測，滿分 60） | 37.9（63.2%） | 官方僅稱勝出 Argon／Carbon，未給具體分數 | Claude Fable 5.2　42（第一）；Claude Opus 5.5　34.7 |
| AA-Omniscience v1.1 幻覺率（分數越低越好） | 13.9–14.4% | Carbon 11.4%／Hydrogen 8.5%／Argon 4.3% | Claude Opus 5.5　50.3%／GPT-6.2 Sol　55.4% |

⚠️ AA Intelligence Index、Vals Index、AA-Omniscience 由 Artificial Analysis／Vals AI 獨立測得；AutomationBench 由 Zapier 獨立測得；KingBench 4 是第三方站 MindStudio 自建評測，非 Google 官方數字。Google 官方比較表自己選的對手是 Claude Opus 5.5 與 GPT-6.2 Sol，不是市場上分數最高的模型。

## 與前代/競品比較

Neon 不是誰的直接「下一代」，而是 Google 在一個月內發完 Argon、Carbon、Hydrogen 之後，硬插進 Hydrogen（快、便宜、日常用）與 Carbon（最強、最貴、長程任務）之間的第四個分支，官方說法是「balances depth and efficiency」。跟同代旗艦 Carbon 比，Neon 在 AA Intelligence Index 的 high 等級打平（60 分同分），但成本低 32%；xhigh 等級比同級競品低 36% 以上——這款模型賣的是「性價比」，不是「智能上限」。

跟競品比，問題在 Google 官方比較表「選誰當對手」：官方只拿 Claude Opus 5.5 跟 GPT-6.2 Sol 兩個模型比，16/19 項贏；但 Artificial Analysis 的公開榜單裡，Claude Fable 5.2（65 分）跟 GPT-6.2 Astra（62 分）都排在 Neon（61 分）前面——這兩個才是目前真正的旗艦級競品，官方比較表挑的是比 Neon 弱的機型。換算定價，Neon（input $3／output $15）比 GPT-6.2 Sol（$2／$10）貴 50%，但換到 GPT-6.2 Astra（$8／$40）只要對方 37.5% 的價格，所以「夾在中間」的定位是刻意的產品策略。

另一個值得注意的倒退：AA-Omniscience 幻覺率 Neon 是 13.9–14.4%，比同家族的 Carbon（11.4%）、Hydrogen（8.5%）、更早的 Argon（4.3%）都高，雖然仍遠低於 Claude Opus 5.5（50.3%）、GPT-6.2 Sol（55.4%）——代表 Neon 在追求速度與成本效率的同時，事實準確度這項指標是往後退的，不是穩定進步。

## 對 Agent 開發的意義

Google 官方明確把 Neon 定位成多代理架構裡的「協調者（Orchestrator）」：在 Google Antigravity 裡，Neon 可以獨立運作，也可以當作快速、高判斷力的 Orchestrator，指揮多個平行的 Hydrogen 子代理。這代表 Google 官方在推一種「貴模型做決策、便宜模型做執行」的分層 Agent 架構，不是單一模型打天下。

- 如果你在做企業知識工作 Agent（讀試算表、PDF、圖表、音訊、影片混合輸入）：Neon 的 1M context window 加上 Vals Index 雙榜首（Legal Research、Tax Agent）的成績，適合拿來做跨文件的分析與結構化輸出任務
- 如果你在做多代理協調架構：可以參考 Google 自己的分層模式——用 Neon 當判斷層、Hydrogen 當平行執行層，而不是每個子任務都丟給同一顆最貴的模型
- 不適合：需要最高事實準確度、不能容忍幻覺的場景——13.9–14.4% 的幻覺率比同家族其他模型都高；也不適合純粹比拚程式碼上限的任務，Terminal-Bench 4.1、FrontierCode 2.0 都輸給 Claude Opus 5.5

## 今日收穫

Google 公布的「Neon 贏 16/19 項」比較表，選的對手是 Claude Opus 5.5 跟 GPT-6.2 Sol——兩個都不是目前榜單最強的模型。獨立的 Artificial Analysis Intelligence Index 把 Neon 排在全球第三，前面還有 Claude Fable 5.2 跟 GPT-6.2 Astra，這兩個才是 Neon 真正要面對、卻沒被放進官方比較表的對手。以後看廠商自己公布的「打贏誰」比較表，第一步永遠是先查「這個比較表排除了誰」。

## 參考資料

- [Google Blog：Introducing Gemini 4 Neon（官方公告，2026-11-18）](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/)
- [Artificial Analysis Evaluates Gemini 4 Neon as a Fast, Cost-Competitive Mid-Tier Contender（OODAloop，引用 Artificial Analysis 測試結果）](https://oodaloop.com/briefs/technology/artificial-analysis-evaluates-gemini-4-neon-as-a-fast-cost-competitive-mid-tier-contender-across-reasoning-and-multimodal-benchmarks/)
- [Gemini 4 Neon benchmarks, specs, pricing and comparisons（kingy.ai，整理 AutomationBench 等第三方榜單數字）](https://kingy.ai/blog/gemini-4-neon/)
- [Gemini 4 Neon vs Claude Opus 5.5 vs GPT-6.2: Coding Compared（MindStudio，KingBench 4 評測）](https://www.mindstudio.ai/blog/gemini-4-neon-vs-claude-opus-gpt-6-2)
- [Gemini 4 Neon vs Carbon, Claude Opus 5.5 and GPT-6.2 Sol（ahmetbalaman.com，AA-Omniscience 幻覺率對照）](https://ahmetbalaman.com/en/blog/gemini-4-neon-vs-carbon-vs-claude-opus-5-5-vs-gpt-6-2-sol-en/)
- [Gemini 4 Neon Beats Claude Opus 5.5, GPT 6.2 Sol On Most Benchmarks（officechai，官方比較表 16/19 項細節）](https://officechai.com/ai/gemini-4-neon-benchmarks/)
