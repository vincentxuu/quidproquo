---
title: "模型卡｜Gemini 3.8 Flash"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: zh-TW
description: "Google 六週內第三次發佈 Flash 模型——Gemini 3.8 Flash 定價維持不變，Terminal-Bench 2.1 衝上 90.8%，同步推出僅供受信任防禦者使用的資安變體 3.8 Flash Cyber"
tldr: "Gemini 3.8 Flash（gemini-3.8-flash）：2026-09-02 上線，1,048,576 tokens input／64,000 tokens output，input $0.75、output $3.75 per 1M tokens（優惠價至 2026-12-31，之後 $1.50／$7.50，與 3.7 Flash 同價）；Terminal-Bench 2.1 90.8%（前代 81.6%）、DeepSWE v1.1 73.7%（前代 65.3%）；同步推出僅限受信任防禦者透過 Fairwind Program 申請的資安變體 Gemini 3.8 Flash Cyber，CWE-Bench pass@1 47.2%、真實 20 語言漏洞挖掘成功率逾 70%"
series:
  name: "AI Model Tracker"
  order: 14
glossary:
  - term: "Gemini"
    def: "Google DeepMind 開發的大型語言模型家族，Flash 為其中主打速度與成本效益的分支"
---

> 🌏 [English version](/en/posts/daily/2026-09-04-model-google-gemini-3-8-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `gemini-3.8-flash` |
| 廠商 | Google（Google DeepMind） |
| 參數量 | 未公開 |
| Context Window | 1,048,576 tokens（input）／64,000 tokens（output） |
| Input 定價 (USD/1M tokens) | $0.75（優惠價，至 2026-12-31；之後回到 $1.50） |
| Output 定價 (USD/1M tokens) | $3.75（優惠價，至 2026-12-31；之後回到 $7.50） |
| 開源 | 否 |
| 發布日 | 2026-09-02 |
| 官方公告 | [Google Blog：Introducing Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/) |
| 家族 | Gemini 3.x Flash（三週內第三次 Flash 發佈，接續 3.6／3.7 Flash） |

## 能力亮點

- Terminal-Bench 2.1（agentic 終端操作）達 90.8%，較前代 Gemini 3.7 Flash 的 81.6% 提升 9.2 個百分點
- DeepSWE v1.1（長週期軟體工程）達 73.7%，較前代 65.3% 提升 8.4 個百分點，Google 稱可超越多個更大型的 frontier 模型
- 新增可依任務調整的 effort levels：同一模型可在高 effort（多推理步驟、反覆呼叫工具，換取準確度）與低 effort（壓低 token 開銷）之間切換，而非得換模型
- 同步發佈僅限受信任防禦者透過 Fairwind Program 申請的資安變體 Gemini 3.8 Flash Cyber：CWE-Bench 修補 pass@1 達 47.2%，真實 20 種程式語言漏洞挖掘成功率逾 70%
- 連續三代 Flash（3.6／3.7／3.8）定價維持 $0.75/$3.75 不變，在能力提升的前提下等於隱性降價

## Benchmark 表現

| Benchmark | Gemini 3.8 Flash | 前代（3.7 Flash） | 競品最強 |
|---|---|---|---|
| Terminal-Bench 2.1（agentic 終端操作） | 90.8% | 81.6% | GPT-5.6 Terra 87.4% |
| DeepSWE v1.1（長週期 SWE） | 73.7% | 65.3% | GPT-5.6 Terra 69.6% |
| SWE-Bench Pro | 61.6% | 60.4% | — |
| HLE-Verified（跨領域專家推理） | 54.9% | 53.6% | GPT-5.6 Terra 51.1% |
| Humanity's Last Exam | 45.4% | 45.7% | — |
| CWE-Bench（Cyber 變體，修補 pass@1） | 47.2% | — （首代 Cyber 對照為 3.5 Flash Cyber，未公佈確切數字） | 領先 frontier 模型 47.8% |

⚠️ 以上均為 Google 官方公佈的內部評測結果（部分含跨廠商模型比較），非各廠商自行公佈的第三方複現數據。CWE-Bench 為第三方機構 Collinear 執行的外部 benchmark，其餘 Cyber 相關數據（CyberGym、20 語言真實漏洞挖掘）目前僅有 Google 自測結果，尚待外部複現。本站前一篇 3.7 Flash 模型卡記錄的 Terminal-Bench 2.1 數字為 85.8%，與本次 Google 官方對照表所列的 81.6% 不一致，推測評測方法或 agent harness 版本有變動（DeepMind 揭露 Terminal-Bench 2.1 統一改用 Terminus 2 harness 重新量測），本文採用 3.8 Flash 發佈當下 Google 官方對照表的數字。

## 與前代/競品比較

跟 Gemini 3.7 Flash 比，進步集中在「agentic coding」與「長週期軟體工程」：Terminal-Bench 2.1 拉開 9.2 個百分點、DeepSWE v1.1 拉開 8.4 個百分點，但 Humanity's Last Exam 幾乎持平（45.4% 對 45.7%），SWE-Bench Pro 也只微幅進步（61.6% 對 60.4%）。這代表 3.8 Flash 的升級是針對「會反覆呼叫工具、需要多步驟執行到底」的 agent 任務做強化，而不是全面拉高通用推理能力——如果你的場景是開放式推理或考試型任務，升級到 3.8 Flash 未必划算。

跟競品比，Terminal-Bench 2.1 的 90.8% 領先 GPT-5.6 Terra 的 87.4% 與 Claude Sonnet 5 的 80.4%；DeepSWE v1.1 的 73.7% 也贏過 GPT-5.6 Terra 的 69.6%。但這些對照組多半是 3.7 Flash 發佈時記錄的舊數字，若對手同期也有更新，實際差距可能已經縮小，建議把這些比較當成方向性參考而非精確排名。

定價策略上最值得注意的是「連續三代不漲價」：3.6、3.7、3.8 Flash 都維持 $0.75/$3.75（優惠價至 2026-12-31），跟 GPT-5.6 Sol 的約 $5/$30 及 Claude Fable 5.1 的 $10/$50 相比，input 價格便宜 85% 以上。Google 沒有用「新模型=漲價」的慣例，而是把升級成本轉嫁到「effort levels 越高、token 消耗越多」這個變數上，讓開發者自己決定要不要付出更多 token 換更高準確度。

## 對 Agent 開發的意義

Effort levels 是這次對 agent 架構最直接的影響：過去要在「便宜但普通」跟「貴但聰明」之間選模型，現在同一個 model ID 就能依任務動態調整——高風險、多步驟的任務調高 effort 換準確度，低延遲、高吞吐的任務調低 effort 省 token，不必維護兩套模型切換邏輯。

- 如果你在做 coding agent 或 SWE agent：Terminal-Bench 2.1 90.8% + DeepSWE v1.1 73.7%，代表可以用 Flash 定價（$0.75/$3.75）跑出接近前代 frontier 等級的長週期程式碼自動化，且三代 Flash 沒有漲價，適合把成本壓在 agent 架構初期就固定下來
- 如果你在做金融／法律類知識工作 agent：官方公佈 Vals Finance Agent V2、Harvey's Legal Agent Benchmark 均優於 3.7 Flash 與部分 frontier 模型，適合合約審閱、財報分析這類需要「可依賴的多步驟推理」場景
- 如果你在做程式碼資安防護（漏洞挖掘＋自動修補）：3.8 Flash Cyber 把「找漏洞→寫修補」收斂成單一模型呼叫，但目前僅透過 Fairwind Program 個案審核授權，不是自助 API，短期內只適合已具備資安團隊、能通過審核的企業
- 不適合：開放式知識推理或考試型任務（Humanity's Last Exam 幾乎沒進步），這類需求繼續用 3.7 Flash 或更大型模型即可，沒必要為了追新模型多花 token；也不適合需要地端部署或無法承受閉源 API 依賴的場景（沒有公開權重）

## 今日收穫

原本以為模型升級的成本轉嫁方式只有「調漲每 token 單價」一種選項，但 Gemini 3.8 Flash 展示了另一種做法：定價三代不變，把升級的代價放進「effort levels 越高、消耗 token 越多」這個變數裡，讓使用者自己決定要不要為更高準確度多付錢，而不是廠商片面調價。這也解釋了為什麼同一批評測會出現「多數 benchmark 明顯進步、但 token 用量警語同時出現」的矛盾現象——性能提升跟成本上升被拆成兩個獨立可調的旋鈕。

## 參考資料

- [Google Blog：Introducing Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/)
- [Gemini 3.8 Flash — Model Card（Google DeepMind）](https://deepmind.google/models/model-cards/gemini-3-8-flash/)
- [Gemini API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [DataCamp：Gemini 3.8 Flash — Features, Benchmarks, and Pricing](https://www.datacamp.com/blog/gemini-3-8-flash-cyber)
- [Shattered.io：Gemini 3.8 Flash Cyber — Google Gates Access, 2.6x Patches](https://shattered.io/gemini-3-8-flash-cyber-fairwind-program-2026/)
- [本站前篇：模型卡｜Gemini 3.7 Flash](/posts/daily/2026-08-16-model-google-gemini-3-7-flash)
