---
title: "模型卡｜Hy-Memory-30B-A3B"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, model-release, daily, tencent, model-family-hunyuan]
lang: zh-TW
description: "Tencent Hunyuan 開源專用記憶寫入模型——四框架平均分宣稱贏過 Claude Opus 5，但八成以上領先來自唯一的 held-out 框架"
tldr: "Hy-Memory-30B-A3B：2026-10-15 開源（Apache-2.0），30B 總參數／約 3B 啟用的 MoE，262,144 tokens context，專門訓練來執行 agent 外部記憶框架（Mem0／MemOS／Hy-Memory）裡的「寫入」路徑；兩階段訓練（On-Policy Distillation＋Attributed Memory RL）讓四框架交叉平均分從基礎模型的 47.66 拉到 55.49，官方宣稱以此打敗 Claude Opus 5 的 54.62；但拆開看，Mem0／Hy-Memory／MemOS 三個訓練內框架差距都在 0.6 分以內（統計噪訊範圍），真正拉開差距的是唯一保留在訓練外的 EverMemOS 框架（56.89 vs 54.04，差 2.85 分），貢獻了整體領先的八成以上。目前無量化版本、無託管 API，配套本機應用 MemHub 的安裝路徑也還沒打通。"
series:
  name: "AI Model Tracker"
  order: 49
glossary:
  - term: "記憶寫入模型（Memory Writer Model）"
    def: "專門訓練來執行 agent 外部記憶系統「寫入路徑」的模型——決定保留什麼資訊、如何精確表達、新證據如何更新既有記憶庫，取代一般用通用 LLM 做這件事的做法"
  - term: "EverMemOS"
    def: "一個記憶框架，在 Hy-Memory-30B-A3B 的評測中被刻意保留在訓練資料之外，用來驗證模型學到的寫入策略能否轉移到沒見過的框架"
---

> 🌏 [English version](/posts/daily/2026-10-16-model-tencent-hy-memory-30b-a3b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `tencent/Hy-Memory-30B-A3B` |
| 廠商 | Tencent（Tencent Hunyuan） |
| 參數量 | 30B 總參數／約 3B 啟用（MoE，48 層，1 層 dense＋47 層 sparse，128 專家 top-8 路由＋1 個共享專家） |
| Context Window | 262,144 tokens |
| Input 定價 (USD/1M tokens) | 無官方 API 定價，僅提供開源權重自架（目前無任何推理平台上架） |
| Output 定價 (USD/1M tokens) | 同上 |
| 開源 | 是（Apache-2.0） |
| 發布日 | 2026-10-15 |
| 官方公告 | [GitHub：Tencent-Hunyuan/Hy-Memory](https://github.com/Tencent-Hunyuan/Hy-Memory) |
| HuggingFace | [tencent/Hy-Memory-30B-A3B](https://huggingface.co/tencent/Hy-Memory-30B-A3B) |
| 家族 | Hunyuan（Hy）系列，由 Hy3-A3B Base 微調而成，是 Hy Memory 2.0（框架＋模型＋本機應用 MemHub 三件套）裡的專用模型 |

## 能力亮點

- 專門訓練來執行 agent 外部記憶框架的「寫入路徑」，可直接取代 Mem0、MemOS、Hy-Memory 框架裡原本負責記憶整理的通用 LLM，不需改動檢索架構
- 兩階段訓練：Memory On-Policy Distillation（教師模型對學生寫出的記憶鏈做密集監督）＋ Attributed Memory Reinforcement Learning（對整段記憶庫做 chunk 級別的 credit assignment）
- 四個評測框架（Mem0／Hy-Memory／MemOS／EverMemOS）交叉平均分 55.49，比訓練前的基礎模型 Hy3-A3B Base（47.66）高 7.8 分，是這次訓練方法帶來的真實增益
- 配套開源 Hy Memory 2.0 框架（PyPI `hy-memory==2.0.1`，Apache-2.0）與本機應用 MemHub，可匯入 Claude Code、Cursor、Codex 等十款工具的歷史紀錄到同一個記憶庫

## Benchmark 表現

| Benchmark（四框架交叉平均） | Hy-Memory-30B-A3B | 前代（Hy3-A3B Base，訓練前） | 競品最強（Claude Opus 5） |
|---|---|---|---|
| 四框架交叉平均 | **55.49** | 47.66 | 54.62 |
| Mem0 harness | 54.02 | 40.20 | 53.43 |
| Hy-Memory harness | 60.55 | 50.39 | 60.53 |
| MemOS harness | 50.51 | 49.05 | 50.50 |
| EverMemOS harness（held-out，訓練時完全沒見過） | **56.89** | 50.98 | 54.04 |

⚠️ 以上均為 Tencent 官方自測，且只在固定 20% 的 benchmark 子樣本上評測，目前尚無第三方獨立複現。Mem0／Hy-Memory／MemOS 三個訓練內框架贏 Claude Opus 5 的差距都在 0.6 分以內，接近統計噪訊；四框架平均領先的 0.87 分裡，有 2.85 分差距（約八成）全部來自唯一保留在訓練外的 EverMemOS 框架。

## 與前代/競品比較

跟訓練前的基礎模型 Hy3-A3B Base 比，兩階段訓練（On-Policy Distillation＋Attributed Memory RL）讓四框架交叉平均分從 47.66 拉到 55.49，漲了 7.8 分——這就是專門為「記憶寫入」這個任務做強化學習微調帶來的真實增益，也是整份報告裡最沒有爭議的數字。

跟 Claude Opus 5 比，官方宣稱的「打敗」拆開看要分兩段講：在 Mem0（54.02 vs 53.43）、Hy-Memory（60.55 vs 60.53）、MemOS（50.51 vs 50.50）這三個訓練內框架上，差距都在 0.6 分以內，幾乎是統計噪訊；真正拉開差距的是刻意保留在訓練外、模型完全沒見過的 EverMemOS 框架（56.89 vs 54.04，差 2.85 分），這是唯一能驗證「學到的寫入策略能否轉移到沒見過的框架」的測試，也是整個「打敗 Claude Opus 5」宣稱裡最有說服力的一組數字——但它也只是四個子項裡的一項。

定價上，Hy-Memory-30B-A3B 沒有官方 API，只能自己部署：目前只釋出 60.1GB 的 BF16 權重（沒有 GGUF／FP8 等量化版本），需要自備 GPU 資源，也還沒有任何推理平台上架它。配套的 Hy Memory 2.0 框架已可直接用 `pip install hy-memory==2.0.1` 安裝，但本機應用 MemHub 的 npm 安裝包尚未發布，官方自己文件寫的安裝路徑目前還跑不起來。

## 對 Agent 開發的意義

如果你的 agent 已經在用 Mem0 或 MemOS 做長期記憶：Hy-Memory-30B-A3B 可以直接換掉背後負責「寫入」的通用 LLM，不需要改動你的檢索架構，而且是 Apache-2.0 授權、商用無顧慮——這是這次釋出裡立刻能用的部分。

如果你在評估「要不要採用專門的記憶寫入模型，而不是繼續用通用大模型做這件事」：EverMemOS 那 2.85 分的 held-out 優勢，是目前唯一有實證支持「專門訓練記憶寫入比用通用模型划算」的訊號，值得拿來參考；但也要注意對照組只是 Tencent 自家的上一代基礎模型 Hy3-A3B Base，不是市面上所有通用 LLM 的代表。

如果你要在生產環境大量呼叫記憶寫入：記憶寫入是每輪對話都要跑的高頻、低輸出工作，用 30B／3B 啟用的小模型搭配 `no_think` 模式跑，理論上比每次呼叫前沿模型便宜很多——但目前沒有任何平台掛它，也沒有人公開過每次寫入的實際 token 成本，評估投資回報前得先自己量一次。

不適合：想要「一鍵試用」的場景。目前沒有量化版本（GGUF／FP8 都沒有）、沒有託管 API，配套的本機應用 MemHub 安裝路徑也還沒打通，想用就得自己裝模型、自己跑推理。

## 今日收穫

「打敗 Claude Opus 5」這類標題拆開看常常只贏在一個維度——Hy-Memory-30B-A3B 的四框架平均領先，八成以上其實來自唯一 held-out 的 EverMemOS 框架那 2.85 分差距，另外三個訓練內框架的差距都在 0.6 分以內，接近統計噪訊。評估這類「打敗 XX」宣稱時，要看清楚領先的差距主要來自哪個子項，而不是只看平均分。

## 參考資料

- [GitHub：Tencent-Hunyuan/Hy-Memory](https://github.com/Tencent-Hunyuan/Hy-Memory)
- [HuggingFace：tencent/Hy-Memory-30B-A3B 模型卡](https://huggingface.co/tencent/Hy-Memory-30B-A3B)
- [arXiv 2610.22196：Hy-Memory-30B-A3B 技術報告](https://arxiv.org/pdf/2610.22196)
- [AlphaSignal：Tencent's Hy Memory 2.0 Beats Claude Opus 5 at Remembering What Agents Need](https://alphasignal.ai/news/tencent-s-hy-memory-2-0-beats-claude-opus-5-at-remembering-what-agents-need)
- [OrcaRouter：Hy Memory 2.0 Is Out — Tencent Open-Sourced a Memory Writer, a Framework and a Mac App in One Drop](https://www.orcarouter.ai/blog/hy-memory-2-0-open-source-stack)
