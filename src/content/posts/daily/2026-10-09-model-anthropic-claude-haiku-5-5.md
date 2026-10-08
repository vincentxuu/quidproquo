---
title: "模型卡｜Claude Haiku 5.5"
date: 2026-10-09
category: daily
type: digest
tags: [ai-agent, model-release, daily, anthropic, model-family-claude]
lang: zh-TW
description: "Anthropic 發佈 Claude Haiku 5.5——小模型首次支援 effort 調整，平均成本比 Haiku 4.5 便宜 75%，OSWorld 2.1 從 15.7% 跳到 72.4%"
tldr: "Claude Haiku 5.5：2026-10-07 上線，Model ID `claude-haiku-5-5`；1,000,000 tokens context window（輸出上限 128K）；API 定價依 prompt 長度分兩檔——100K 以內 input $0.10／output $0.50，超過 100K input $0.50／output $2.50（前代 Haiku 4.5 單一檔 $1.00/$5.00），平均成本降 75%；OSWorld 2.1（computer use）從 Haiku 4.5 的 15.7% 跳到 72.4%，Terminal-Bench 4.0 從 0.0% 到 39.2%，已超過自家 GPT-6 Luna 比較組的 16.4%；是首款支援 effort 調整的 Haiku 系列模型，但資安 safeguard 比 Haiku 4.5 更嚴，封鎖滲透測試類操作"
series:
  name: "AI Model Tracker"
  order: 43
glossary:
  - term: "Claude"
    def: "Anthropic 開發的大型語言模型家族，Haiku 為其中主打速度與低成本的分支"
  - term: "OSWorld"
    def: "評測 AI agent 操作真實電腦（開啟應用程式、點擊、填表等多步驟操作）完成任務能力的 benchmark，常用來衡量 computer use 能力"
---

> 🌏 [English version](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `claude-haiku-5-5` |
| 廠商 | Anthropic |
| 參數量 | 未公開 |
| Context Window | 1,000,000 tokens（輸出上限 128,000 tokens） |
| Input 定價 (USD/1M tokens) | $0.10（prompt ≤100K）／$0.50（prompt >100K） |
| Output 定價 (USD/1M tokens) | $0.50（prompt ≤100K）／$2.50（prompt >100K） |
| 開源 | 否 |
| 發布日 | 2026-10-07 |
| 官方公告 | [Anthropic：Introducing Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5) |
| 家族 | Claude 5.5（Opus 5.5 09/22、Sonnet 5.5 09/28、Haiku 5.5 10/07） |

## 能力亮點

- Computer use：OSWorld 2.1（offline subset）從 Haiku 4.5 的 15.7% 跳到 72.4%，提升 56.7 個百分點，首次超過自家列出的 GPT-6 Luna 比較分數（48.9%）
- Agentic coding：Terminal-Bench 4.0 從 Haiku 4.5 的 0.0%（幾乎無法完成）進步到 39.2%；FrontierCode 1.1（Main）拿到 46.4%，高於 GPT-6 Luna 的 42.4%
- 首款支援 effort 調整的 Haiku 系列模型，可依任務在成本與智慧之間調節，而非固定單一設定
- 平均成本比 Haiku 4.5 便宜約 75%；100K tokens 以內的 prompt（官方估計佔前代 Haiku 請求量約 90%）input 降至 $0.10、cache read 降至 $0.01（Haiku 4.5 為 $0.10）

## Benchmark 表現

| Benchmark | Haiku 5.5 | 前代 Haiku 4.5 | GPT-6 Luna（官方比較組） | Sonnet 5.5（參考） |
|---|---|---|---|---|
| OSWorld 2.1（computer use，offline subset） | 72.4% | 15.7% | 48.9% | 83.9% |
| Terminal-Bench 4.0（agentic coding） | 39.2% | 0.0% | 16.4% | 70.6% |
| FrontierCode 1.1（Main） | 46.4% | 未提供 | 42.4% | 52.1%（Xhigh） |
| Humanity's Last Exam（無工具） | 45.9% | 10.2% | 未提供 | 56.9% |
| Chartography（視覺推理，無工具） | 46.4% | 6.4% | 29.1% | 61.6% |

⚠️ 以上皆為 Anthropic 官方自測（詳見 [Haiku 5.5 System Card](https://www.anthropic.com/claude-haiku-5-5-system-card)），尚無第三方複現數字。GDPval-AA v2.1 與 AA-Briefcase v1.1 兩項官方知識工作指標也同步大幅提升（分別為 1620 與 1578，前代為 735 與 614），但因非外部標準化分數，未列入上表。

## 與前代/競品比較

跟 Haiku 4.5 比，最大進步在 computer use 與 agentic coding 兩個「前代幾乎做不到」的項目：OSWorld 2.1 從 15.7% 到 72.4%、Terminal-Bench 4.0 從 0.0% 到 39.2%，等於把 Haiku 從「只能做簡單文字任務」拉到「可以勝任真實 agent 子任務」的門檻。這跟 Anthropic 官方定位一致——Haiku 5.5 被設計成 Opus/Sonnet 的 subagent，而不是獨立扛複雜任務的模型。

跟官方公告裡的比較對象 GPT-6 Luna 相比，Haiku 5.5 在 OSWorld 2.1（72.4% vs 48.9%）、Terminal-Bench 4.0（39.2% vs 16.4%）、FrontierCode（46.4% vs 42.4%）、Chartography（46.4% vs 29.1%）都領先，顯示這一代 Haiku 的目標是打小模型市場的價格與能力比，而不只是追 Sonnet/Opus 的影子。但要注意這些對比數字都是 Anthropic 自己整理的，GPT-6 Luna 未必是 OpenAI 同級最新版本。

定價策略上，Haiku 5.5 把前代的單一定價拆成兩檔：100K tokens 以內大幅降價（input $1.00→$0.10，降 90%），超過 100K 則只降到 $0.50（降 50%）。官方估計前代約 90% 請求落在 100K 以內，等於多數實際使用場景可以拿到接近 9 折的降幅，官方給出的平均數字是「降 75%」。同時 Sonnet 5.5 的 cache read 也同步腰斬（$0.20→$0.10），兩個動作一起看，Anthropic 這週是在全線調整「省 token 的部分」而非調整模型標價。

## 對 Agent 開發的意義

這次最大的架構訊號是「Haiku 第一次有 effort 參數」。過去 Haiku 系列只有一種思考強度，現在可以跟 Opus/Sonnet 一樣依任務調整運算量——代表同一顆模型可以同時服務「要快」和「要準」兩種子任務，不需要為了準度切換到更貴的模型。

- 如果你在做多 Agent 系統：Haiku 5.5 適合接在 Opus/Sonnet 規劃之後當 subagent，處理 compaction、摘要、分類、資料庫查詢這類高頻率、低複雜度的子任務；Asana 的早期測試回報單輪延遲降低超過 30%、inference 最高快 2.5 倍
- 如果你在做瀏覽器／電腦自動化：OSWorld 2.1 從 15.7% 跳到 72.4% 是目前最大進步，加上官方同步開放 beta 版 browser use SDK，適合拿來做表單填寫、資料搬運這類重複性 computer use 任務
- 不適合：複雜多步驟的 agentic coding 主線任務——Terminal-Bench 4.0 只有 39.2%，遠低於 Sonnet 5.5 的 70.6%，官方自己也明講 Opus/Sonnet 5.5 才是複雜 coding 的首選，Haiku 5.5 定位是「本來因為成本做不起的大量工作」而非取代主力模型

另一個值得注意的點是資安 safeguard 收緊：Haiku 5.5 封鎖滲透測試等攻擊性操作，比 Haiku 4.5 更嚴格（但比 Sonnet 5.5 寬鬆）。如果你的 Agent 系統有拿 Haiku 做資安相關自動化（如 red team 模擬），這次升級可能需要重新評估權限申請流程。

## 今日收穫

小模型升級的敘事通常是「更便宜、更快」，但 Haiku 5.5 的 OSWorld 2.1 從 15.7% 跳到 72.4%、Terminal-Bench 4.0 從 0.0% 到 39.2%，說明小模型這一代的進步幅度已經大到能改變「能不能用」而不只是「划不划算」——前代 Haiku 在這兩個 benchmark 基本等於交白卷，這一代直接跨過「堪用」的門檻，這才是比 75% 降價更值得記的事。

## 參考資料

- [Anthropic：Introducing Claude Haiku 5.5（官方公告）](https://www.anthropic.com/claude-haiku-5-5)
- [Anthropic：Claude Haiku 產品頁與定價](https://www.anthropic.com/claude/haiku)
- [Anthropic：Claude Haiku 5.5 System Card](https://www.anthropic.com/claude-haiku-5-5-system-card)
- [Claude Platform Docs：Models overview（context window／定價對照表）](https://platform.claude.com/docs/en/models/overview)
- [AWS：Introducing Claude Haiku 5.5 on AWS](https://aws.amazon.com/blogs/machine-learning/introducing-claude-haiku-5-5-on-aws)
- [GitHub Changelog：Claude Haiku 5.5 in GitHub Copilot](https://github.blog/changelog/2026-10-07-claude-haiku-5-5-in-github-copilot)
