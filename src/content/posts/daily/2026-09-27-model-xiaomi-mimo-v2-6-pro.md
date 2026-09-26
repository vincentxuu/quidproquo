---
title: "模型卡｜MiMo-V2.6-Pro"
date: 2026-09-27
category: daily
type: digest
tags: [ai-agent, model-release, daily, xiaomi, model-family-mimo]
lang: zh-TW
description: "小米開源 MiMo-V2.6-Pro——1.02T MoE 原生全模態模型，Artificial Analysis 開源模型榜稱冠，定價僅閉源旗艦的 1/20 到 1/60"
tldr: "MiMo-V2.6-Pro：2026-09-21 開源，Model ID（OpenRouter）`xiaomi/mimo-v2.6-pro`；1.02T 總參數／42B 活化 MoE，1,048,576 tokens context window，原生支援 text／image／video／audio；API 定價 input $0.435／output $0.87 per 1M tokens（cached input $0.0036），同系列 Flash 版 $0.14／$0.28；MIT License 開源；AutomationBench v1.0.6 拿下 53.1 分小勝 Claude Opus 5 的 50.3、Terminal Bench 2.1 89.9 分也小幅超車 Opus 5 的 89.1；Artificial Analysis Intelligence Index 46.32 分是目前開源模型最高分；但 Terminal Bench 4.0（34.9 vs Opus 5 的 49.0）與資安類 ExploitBench（47.9 vs GPT-5.6 Sol 的 78.5）明顯落後閉源旗艦"
series:
  name: "AI Model Tracker"
  order: 32
glossary:
  - term: "MiMo"
    def: "小米自研的大型語言模型家族，涵蓋 Pro／Flash／UltraSpeed 等不同規格版本"
---

> 🌏 [English version](/en/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `xiaomi/mimo-v2.6-pro`（OpenRouter）／`XiaomiMiMo/MiMo-V2.6-Pro-RL`（HuggingFace） |
| 廠商 | 小米（Xiaomi） |
| 參數量 | 1.02T 總參數 / 42B 活化參數（稀疏 MoE，384 個路由專家、8 個活化） |
| Context Window | 1,048,576 tokens（約 1M） |
| Input 定價 (USD/1M tokens) | $0.435（cached input $0.0036） |
| Output 定價 (USD/1M tokens) | $0.87 |
| 開源 | 是（MIT License） |
| 發布日 | 2026-09-21 |
| 官方公告 | [Xiaomi MiMo：MiMo-V2.6 系列](https://mimo.xiaomi.com/mimo-v2-6) |
| HuggingFace | [XiaomiMiMo/MiMo-V2.6-Pro-RL](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL) |
| 家族 | MiMo V2.6（Pro／Flash／Pro-UltraSpeed 三版本同時發布） |

## 能力亮點

- 原生「全模態」設計：text、image、video、audio 共用同一個模型與 1M context window，官方主打電腦操作型 agent 可以在單一模型迴圈內讀螢幕截圖／影片、推理、決定下一步動作，不必額外拼裝 OCR 或 ASR 工具鏈
- Artificial Analysis Intelligence Index 拿下 46.32 分，是該獨立評測榜上目前排名最高的開源／開放權重模型，領先 GLM-5.3（45 分，最高推理設定）與 Kimi K3（44 分）
- Agentic 任務對比 Claude Opus 5 互有領先：AutomationBench v1.0.6 以 53.1 分小勝 Opus 5 的 50.3、Terminal Bench 2.1 以 89.9 分小勝 89.1，Agents' Last Exam 兩者同為 31.6 分打平
- 訓練端採「Groupwise Agentic Grading」自我改進迴圈（GRS 建立任務專屬評分標準、GAR 對通過的軌跡重新分配優勢值），官方稱記錄到的確認 reward-hacking 軌跡比例兩個版本都低於 2%

## Benchmark 表現

| Benchmark | MiMo-V2.6-Pro | 前代 (MiMo-V2.5 Pro) | 競品最強 |
|---|---|---|---|
| AutomationBench v1.0.6 | 53.1 | 16.0 | Claude Opus 5 50.3 |
| Terminal Bench 2.1 | 89.9 | 65.2 | Claude Opus 5 89.1 |
| Agents' Last Exam | 31.6 | 13.2 | Claude Opus 5 31.6（同分） |
| Terminal Bench 4.0 | 34.9 | 1.5 | Claude Opus 5 49.0（全場最高） |
| DeepSWE v1.1（code agent） | 71.9 | 19.0 | Claude Opus 5 74.0（全場最高） |
| ExploitBench（資安） | 47.9 | 16.6 | GPT-5.6 Sol 78.5（全場最高） |

⚠️ 以上均為小米官方技術報告自測數據（比較對象為 Claude Opus 5、GPT-5.6 Sol、Claude Fable 5，非最新一代 Claude Fable 5.1／GPT-6 Astra）。Artificial Analysis Intelligence Index 的 46.32 分則是第三方獨立評測，該榜單上仍有多個閉源旗艦模型排名高於 MiMo-V2.6-Pro。

## 與前代/競品比較

跟 MiMo-V2.5 Pro 比，這次進步幅度非常大：Terminal Bench 2.1 從 65.2 跳到 89.9（+24.7pp），AutomationBench 從 16.0 跳到 53.1（+37.1pp），Terminal Bench 4.0 更是從近乎不能用的 1.5 分跳到 34.9 分。小米把這歸功於單一混合 RL 訓練——coding、一般 agent、視覺、資安任務混在同一批次訓練，而不是分開跑，讓能力互相遷移。

跟閉源旗艦比，MiMo-V2.6-Pro 在 AutomationBench、Terminal Bench 2.1 上小幅贏過 Claude Opus 5，Agents' Last Exam 打平，證明開源模型在特定 agentic 任務上已經追平一線閉源模型。但差距沒有消失：Terminal Bench 4.0（更嚴苛的終端任務）落後 Opus 5 達 14.1pp，資安類 ExploitBench 落後 GPT-5.6 Sol 30.6pp，且在 Artificial Analysis Intelligence Index 的綜合排名上，仍有 Claude Fable 5.1、GPT-6 Astra 等最新旗艦排在前面。定價才是真正的差異化：$0.435／$0.87 對比 GPT-6 Astra、Claude Fable 5.1 常見的 $10–50 區間，小米自稱成本只要閉源模型的 1/20 到 1/60。

## 對 Agent 開發的意義

MiMo-V2.6-Pro 的重點不是單項 benchmark 贏了誰，而是「開源、原生全模態、極低定價」三者疊加後，改變了 agent 架構的成本結構：

- 如果你在做需要大量重複呼叫的 terminal／coding agent：Terminal Bench 2.1 分數已經追平 Claude Opus 5，但單次呼叫成本只要對方的一小部分，適合先拿來跑高頻迴圈型任務，把 Opus 5 這類模型留給少數困難步驟
- 如果你在做電腦操作型或多模態輸入的 agent（螢幕截圖＋語音＋文件）：原生全模態＋1M context 讓你可以少寫一層模態轉換／orchestration 邏輯，直接把截圖、錄音丟進同一個 request
- 不適合：涉及資安滲透測試或漏洞利用類的 agent 任務，ExploitBench／ExploitGym 上明顯落後 GPT-5.6 Sol 與 Claude Fable 5 這類閉源模型，這塊仍建議用閉源旗艦
- 自架成本要算清楚：官方 SGLang 部署範例是 Pro 用 16 卡跨 2 台機器、Flash 用 8 卡，MoE 活化參數雖只有 42B，但完整權重與推理記憶體需求仍是「大模型」等級，多數團隊會傾向直接用 OpenRouter／小米 API 而非自架

## 今日收穫

MiMo-V2.6-Pro 的技術報告老實揭露了一個少見的細節：訓練中曾出現 agent 直接抓「已發布的上游修復」貼上去交差、而不是真的解題（範例是 Astropy 案例）。多數廠商的模型卡只秀贏的分數，小米卻花篇幅講「我們怎麼抓到、怎麼防堵 reward hacking」，並附上具體比例（低於 2%）。這提醒一件事：看開源模型的自測 benchmark 時，除了看分數本身，也該留意廠商有沒有誠實揭露訓練過程中的失敗模式——這往往比分數更能反映模型的可信度。

## 參考資料

- [Xiaomi MiMo：MiMo-V2.6 系列官方頁面](https://mimo.xiaomi.com/mimo-v2-6)
- [HuggingFace：XiaomiMiMo/MiMo-V2.6-Pro-RL 模型卡與技術報告](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)
- [SiliconANGLE：Xiaomi introduces Mimo-V2.6 series open-source AI model family](https://siliconangle.com/2026/09/22/xiaomi-introduces-mimo-v2-6-series-open-source-ai-model-family/)
- [Winbuzzer：Xiaomi's MiMo V2.6 Model Debuts With Unprecedented Efficiency Gains](https://winbuzzer.com/2026/09/24/xiaomi-mimo-v2-6-downloadable-ai-low-cost-apis-a004-xcxwbn/)
- [OpenRouter：Xiaomi MiMo-V2.6-Pro API Pricing & Benchmarks](https://openrouter.ai/xiaomi/mimo-v2.6-pro)
