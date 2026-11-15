---
title: "模型卡｜Claude Fable 5.2"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: zh-TW
description: "Anthropic 發佈 Claude Fable 5.2 與 Mythos 5.2——同一份權重、輸出快 30%、API 價格砍 20% 至 $8/$40，FrontierSWE v2 達 69.9% 大幅超車前代與競品"
tldr: "Claude Fable 5.2（API ID：claude-fable-5-2）於 2026-11-09 上線取代 Fable 5.1：1,000,000 tokens context、128,000 max output、input $8.00／output $40.00（每 1M tokens，較前代降 20%）、閉源；FrontierSWE v2（agentic coding）達 69.9%，比前代 56.3% 高 13.6 個百分點，RoboDojo Sim 機器人控制從 27.6% 跳到 64.9%；同步發佈受限版 Claude Mythos 5.2，CVE Rediscovery 比 Opus 5.5 高 10.2%。"
series:
  name: "AI Model Tracker"
  order: 72
glossary:
  - term: "Claude"
    def: "Anthropic 開發的大型語言模型家族，Fable/Mythos 是繼 Opus 之後的最新旗艦分級"
---

> 🌏 [English version](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `claude-fable-5-2` |
| 廠商 | Anthropic |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens（max output 128,000 tokens） |
| Input 定價 (USD/1M tokens) | $8.00（cache read $0.20，5m cache write $10.00，1h cache write $16.00） |
| Output 定價 (USD/1M tokens) | $40.00 |
| 開源 | 否 |
| 發布日 | 2026-11-09 |
| 官方公告 | [Anthropic：Introducing Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2) |
| 家族 | Claude 5.x（Fable/Mythos 分級，前代為 Fable 5.1／Mythos 5.1） |

## 能力亮點

- FrontierSWE v2（agentic coding）達 69.9%，比前代 Fable 5.1（56.3%）高 13.6 個百分點，也超過 GPT-6 Astra 的 65.5%
- RoboDojo Sim（機器人控制模擬）從前代的 27.6% 跳到 64.9%，是前代的 2.3 倍以上，也超過自家 Opus 5.5（39.4%）
- 輸出速度比 Fable 5.1 快 30%（fast mode 再快 2.5 倍），定價反而從 $10/$50 降到 $8/$40，降幅 20%
- 受限版 Mythos 5.2 在 CVE Rediscovery 上比 Opus 5.5 多找出 10.2% 的漏洞、比前代 Mythos 5.1 多 14.4%，安全分類器誤殺率同時降了 55%

## Benchmark 表現

| Benchmark | Fable 5.2 | 前代 (Fable 5.1) | 競品最強 |
|---|---|---|---|
| FrontierSWE v2（agentic coding） | 69.9% | 56.3% | GPT-6 Astra 65.5% |
| Terminal-Bench-Science 0.1（agentic 科學研究） | 74.6%（Mythos 5.2 為 75.3%） | 52.6% | GPT-6 Astra 68.1% |
| OSWorld 2.1（computer use，offline set） | 89.3% | 83.5% | Opus 5.5 87.2% |
| Humanity's Last Exam（含工具） | 74.2% | 65.6% | Opus 5.5 67.7% |
| RoboDojo Sim（機器人控制，內部評測） | 64.9% | 27.6% | Opus 5.5 39.4% |

⚠️ 以上皆為 Anthropic 官方公告中自選的評測組合，「競品最強」欄的 GPT-6 Astra、Opus 5.5 分數也是 Anthropic 自行跑出，與 OpenAI／Google 自測結果可能有方法論差異，僅供參考。

## 與前代/競品比較

跟 Fable 5.1 比，進步幅度最大的是需要長時間自主執行與實體控制的任務：RoboDojo Sim 從 27.6% 跳到 64.9%（2.3 倍以上），Remote Labor Index 從 17.9% 跳到 41.3%（2.3 倍），Terminal-Bench-Science 0.1 多了 22 個百分點——這次升級的重點延續 Fable 5.1 的方向，繼續往「agentic 執行力」而非泛用知識量加碼。

跟同代競品比，在 Anthropic 自己這套評測組合裡，Fable 5.2 在絕大多數項目領先 Opus 5.5、GPT-6 Astra 與 Gemini 4 Carbon，但不是全面獲勝：AutomationBench（企業流程自動化）輸給 Gemini 4 Carbon（51.4% 對 53.9%），Chartography（視覺圖表辨識）也輸給 Gemini 4 Carbon（73.4% 對 72.5%，差距很小）與 GPT-6 Astra（71.0%）。定價上，Fable 5.2 的 $8/$40 比前代降 20%，仍高於自家 Opus 5.5（$4/$20，剛好一半），但首次跟維持原價 $10/$50 的 GPT-6 Astra 拉開 20% 價差。

## 對 Agent 開發的意義

Fable 5.2 跟 Mythos 5.2 延續 5.1 世代的做法：同一份權重，差別只在推論時套用的安全防護層。Anthropic 明確把 Fable 5.2 定位成給「最艱難、最開放式的技術工作」，一般 coding 與知識型任務仍建議先用 Opus 5.5，再依複雜度上調到 Fable 或下調到 Sonnet／Haiku；Fable 5.2 也可以扮演 Advisor（讓小模型遇到難題時諮詢它）或 Orchestrator（把簡單任務下放給小模型）的角色。

- 如果你在做多 agent、長時間跑的系統（研究、規劃、跨工具自動化）：Fable 5.2 很適合當 orchestrator 或 advisor，官方案例顯示 1,000 個 agent 的團隊用它在 30 小時內完成 Fermat 最後定理的形式化證明（人工研究版本原本要 11 天），協調能力是這次升級的核心賣點
- 如果你在做硬體或機器人控制：RoboDojo Sim 的跳升（27.6%→64.9%）和官方展示的電路板設計案例值得關注，這類「模型指揮實體世界」的場景過去不是 Claude 的強項，這次是明顯轉折
- 不適合：需要 zero data retention（ZDR）的場景——Fable 5.2 要求 30 天資料保留，除非 Anthropic 特別授權；也不適合拿來蒸餾訓練自家小模型，這次的反蒸餾防護是歷來最強（資料採集量降 90–99%），preserved thinking 已套用到所有帳號，想透過編輯歷史對話萃取推理過程的路徑被堵死

## 今日收穫

這次升級有一個反直覺的細節：Anthropic 把反蒸餾防護做到史上最強的同時，安全分類器的誤殺率反而降了 55%（資安誤擋降 60%、生物領域誤擋降 40%）。過去容易假設「防護更嚴格」和「誤殺合法用途更少」是互斥的兩個目標，但這次的分類器改版同時達成了兩者——說明安全護欄的品質瓶頸常常不是「鬆或嚴」的單一刻度，而是分類器本身準不準，把這兩個目標分開看才不會低估優化空間。

## 參考資料

- [Anthropic：Introducing Claude Fable 5.2 and Claude Mythos 5.2（官方發布文）](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Claude Platform Docs：Claude Fable 5.2 Overview（完整規格與定價）](https://platform.claude.com/docs/en/models/fable-5-2/overview)
- [Anthropic：Claude Fable 5.2 and Mythos 5.2 System Card（安全評測細節）](https://www.anthropic.com/document/claude-fable-5-2-mythos-5-2-system-card)
- [本站：定價追蹤｜Claude Fable 5.2 取代 5.1，API 價格砍兩成](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut)
- [本站：Benchmark 異動｜Arena Agent 與 CursorBench 同週洗牌](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2)
- [本站：模型卡｜Claude Fable 5.1（前代）](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1)
