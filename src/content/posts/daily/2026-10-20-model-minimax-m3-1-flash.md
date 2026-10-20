---
title: "模型卡｜MiniMax M3.1 Flash"
date: 2026-10-20
category: daily
type: digest
tags: [ai-agent, model-release, daily, minimax, model-family-minimax]
lang: zh-TW
description: "MiniMax 發佈 M3.1 Flash——428B MoE、1M context、$0.15/$0.60 定價，在 Automation-Bench 自動化任務拿下官方對照表最高分，但獨立測試發現幻覺率偏高"
tldr: "MiniMax M3.1 Flash：428B 總參數／約 23B 啟用（MoE）、1M context window、input $0.15／output $0.60 per 1M tokens、cache read 只要 $0.015；官方對照表在 Automation-Bench v1.0.6 拿下 62.2 分，領先 DeepSeek V4.1 Flash 1017（60.5）與 Claude Opus 5（50.3），但在 DeepSWE、Terminal Bench 4.0 落後；VentureBeat 引用 Artificial Analysis 的 AA-Omniscience 評測指出幻覺率偏高，weights 預計 10/23 釋出、授權尚未公開"
series:
  name: "AI Model Tracker"
  order: 53
glossary:
  - term: "MiniMax"
    def: "上海的大型語言模型公司，以 M 系列（M1→M3）agentic 模型與 Hailuo 影片生成模型聞名"
---

> 🌏 [English version](/posts/daily/2026-10-20-model-minimax-m3-1-flash-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `MiniMax-M3.1-Flash` |
| 廠商 | MiniMax |
| 參數量 | 428B 總參數、約 23B 啟用（MoE，來源：MiniMax 官方產品頁） |
| Context Window | 1,000,000 tokens |
| Input 定價 (USD/1M tokens) | $0.15 |
| Output 定價 (USD/1M tokens) | $0.60 |
| 開源 | 否（weights 預計 2026-10-23 釋出，授權尚未公開） |
| 發布日 | 2026-10-19 |
| 官方公告 | [MiniMax 官方 X 公告](https://x.com/MiniMax_AI/status/2112150867868541221) |
| HuggingFace | 不適用（尚未開源） |
| 家族 | MiniMax M3.x |

## 能力亮點

- Automation-Bench v1.0.6（企業自動化任務，含 sales/marketing/finance/HR 情境）拿下 62.2 分，是 MiniMax 官方對照表裡所有受測模型中最高分，領先 DeepSeek V4.1 Flash 1017 的 60.5 與 Claude Opus 5 的 50.3
- 1M context window 支援文字／圖片／影片輸入，cache read 定價只要 $0.015/1M tokens，是 input 定價的十分之一，長對話重複讀 context 的成本壓得很低，且沒有長 context 額外加價
- 官方宣稱比前代 MiniMax M3 推理速度快近 3 倍，agentic 任務的加權平均任務成本從 M3 的 $0.51／task 降到 $0.22／task
- Reasoning（思考深度）無法關閉，只能在 Low / Medium / High / Xhigh / Max 五個 effort 等級間選擇，MiniMax 建議預設用 Max

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| Automation-Bench v1.0.6 | 62.2 | 未提供同基準分數 | DeepSeek V4.1 Flash 1017：60.5 |
| DeepSWE v1.1 | 73.7 | 未提供同基準分數 | DeepSeek V4.1 Flash 1017：77.0（領先） |
| Terminal Bench 4.0 | 38.1 | 未提供同基準分數 | Claude Opus 5：51.8（大幅領先） |
| BabyVision（含工具） | 91.0 | 未提供同基準分數 | DeepSeek V4.1 Flash 1017：92.5 |

⚠️ 以上四項分數均為 MiniMax 官方對照表公開數據，尚無獨立單位重跑復現。MiniMax 並未公開 M3.1 Flash 與前代 M3 在同一套 benchmark 上的逐項對照，只公開了「推理速度快 3 倍、agentic 任務加權平均成本從 $0.51 降到 $0.22／task」這兩個整體宣稱。

## 與前代/競品比較

跟前代 MiniMax M3 比，M3.1 Flash 的進步主要體現在價格而不是跑分：per-token 定價是 M3 的一半（M3 在 512K context 以內是 $0.30/$1.20，超過後翻倍），agentic 任務的加權平均任務成本從 $0.51 降到 $0.22，但 MiniMax 沒有公開 Automation-Bench、DeepSWE 這些 agent 跑分在兩代之間的逐項對照，所以「3 倍速度、70% 成本降」目前只能當成官方的整體宣稱,不是逐項驗證過的升級。

跟競品比，M3.1 Flash 只在 Automation-Bench 這個企業自動化任務上贏過所有受測模型（包含 Claude Opus 5），但在 DeepSWE（代碼 agent）、Terminal Bench 4.0（終端操作）兩項都輸給 DeepSeek V4.1 Flash 1017，Terminal Bench 更是被 Claude Opus 5 的 51.8 分大幅拉開（38.1 分，差距 13.7pp）。定價上 M3.1 Flash（$0.15/$0.60）比 DeepSeek V4.1 Flash 1017 便宜,但後者是 MIT 授權開源模型,自架成本趨近於零——MiniMax 選的是「API 計量付費但單價壓到最低」的路線,跟 DeepSeek「weights 全部開源」的路線不是同一個競爭維度。

比較值得注意的是獨立測試的落差:VentureBeat 引用 Artificial Analysis 的 AA-Omniscience 評測指出,因為 M3.1 Flash 幾乎對每個問題都嘗試回答而不選擇棄答,在該評測定義下的幻覺率高達 93%；但 The New Stack 另一組事實準確度測試裡,M3.1 Flash 答對 56% 的事實性問題,反而領先 DeepSeek V4.1 Flash 的 43%。兩組結果方向不一致,說明「幻覺率」目前還沒有統一的量測標準,MiniMax 官方對照表裡完全沒有放任何一項可靠度或幻覺指標。

## 對 Agent 開發的意義

1M context、原生多模態(文字/圖片/影片)、cache read 只要 input 定價十分之一,這組合對長時間跑的企業自動化 agent(像 Automation-Bench 測的 sales/marketing/finance/HR 流程)很有吸引力——如果你在做 CoWork 類型、需要大量重複讀取相同 context 的 agent,M3.1 Flash 的成本結構值得評估。

如果你在做 coding agent 或需要操作終端機:DeepSWE、Terminal Bench 4.0、SWE Refactor 等分數都落後 DeepSeek V4.1 Flash 1017 跟 Claude Opus 5,尤其 Terminal Bench 的差距很大,目前不建議把 M3.1 Flash 當成 coding/terminal agent 的主幹模型。

不適合的場景:reasoning 無法關閉,對需要極低延遲的簡單任務(例如單輪問答、客服快速回覆)不划算,token 跟延遲都有下限;加上 VentureBeat/Artificial Analysis 測出的高幻覺率,不建議把它放進無人監督、容錯空間小的 agent pipeline(例如 cybersecurity、自動撥款這類高風險自動化),至少要等 10/23 weights 公開跟授權條款明確後,讓獨立單位重跑過一輪再評估。

## 今日收穫

之前以為「官方跑分高 + 定價低」就等於這個模型可以直接上生產線。MiniMax M3.1 Flash 這個案例提醒我:vendor 公開的 benchmark 對照表裡完全沒有任何幻殺率或可靠度指標,而獨立單位從完全不同的角度切入(AA-Omniscience 看模型是否會在不確定時棄答)才補上這塊——而且不同測試機構對「幻覺率」的定義不一致,甚至會得出反方向的結論(The New Stack 測出的事實準確度反而是 M3.1 Flash 領先)。看一個新模型的官方對照表之外,還要特別去找有沒有獨立單位測過可靠度,不能只看 agent 跑分跟定價。

## 參考資料

- [MiniMax M3.1 Flash 產品頁](https://agent.minimax.io/tools/m3.1-flash)
- [MarkTechPost：MiniMax Just Launched M3.1 Flash](https://www.marktechpost.com/2026/10/19/minimax-m3-1-flash-release/)
- [CellCog：MiniMax M3.1 Flash — Price, Benchmarks, Space Bunny](https://cellcog.ai/blog/minimax-m3-1-flash/)
- [Tech Insider：MiniMax M3.1 Flash — 70% Cheaper, Accuracy Doubts](https://tech-insider.org/minimax-m3-1-flash-hallucination-accuracy-2026/)
- [MiniMax 官方 X 公告](https://x.com/MiniMax_AI/status/2112150867868541221)
