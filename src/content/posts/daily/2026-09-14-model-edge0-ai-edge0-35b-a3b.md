---
title: "模型卡｜Edge0-35B-A3B"
date: 2026-09-14
category: daily
type: digest
tags: [ai-agent, model-release, daily, edge0-ai, model-family-edge0]
lang: zh-TW
description: "開源專案 Edge0 用 SSD 專家卸載＋prerouter 預測路由＋Recover-LoRA 蒸餾，讓 35B 參數 MoE 模型只用 2.9GB 記憶體就能在 Mac mini 上跑，量化損失壓到 3.9 分"
tldr: "Edge0-35B-A3B-preview（Edge0/Edge0-35B-A3B-preview）：Edge0-AI 於 2026-09-08 開源釋出，4-bit 量化、256 專家每 token 啟用 4 個（base 為 Qwen3.5-MoE 35B-A3B）；靠 SSD 專家卸載＋prerouter 預測路由＋Recover-LoRA 蒸餾三個機制，在 Mac mini M4 Pro（24GB）上只用 2.9 GiB 尖峰記憶體、15 tok/s decode 跑起來，5 項 benchmark 平均只比 fp16 base 掉 3.9 分；Apache-2.0 全開源，同時釋出 8B-A1B（Ling 3.0 Tiny 底）版本；目前 agentic 能力偏弱，官方定位為 preview"
series:
  name: "AI Model Tracker"
  order: 23
glossary:
  - term: "Edge0"
    def: "開源串流 MoE 推理框架，用 SSD 專家卸載＋prerouter 預測式路由＋Recover-LoRA 蒸餾，讓大型 MoE 模型能在記憶體有限的裝置（如 Mac mini）上以極小記憶體佔用運行"
---

> 🌏 [English version](/en/posts/daily/2026-09-14-model-edge0-ai-edge0-35b-a3b-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Edge0/Edge0-35B-A3B-preview`（HF repo：int4 checkpoint＋LoRA／prerouter adapter 打包在一起）|
| 廠商 | Edge0-AI（獨立開源專案，非大廠） |
| 參數量 | 35B 稀疏 MoE（256 專家，每 token 啟用 4 個，K=4）；base model 為 Qwen3.5-MoE 35B-A3B |
| Context Window | 未公開（README 僅列出短 context 下的記憶體與速度數據，未標明 context window 上限） |
| Input 定價 (USD/1M tokens) | 無官方 API 定價（僅釋出開源框架與權重，需自行部署） |
| Output 定價 (USD/1M tokens) | 無官方 API 定價（僅釋出開源框架與權重，需自行部署） |
| 開源 | 是（Apache-2.0，含框架程式碼、模型權重與訓練好的 LoRA／prerouter adapter） |
| 發布日 | 2026-09-08（GitHub 與 Hugging Face 同步上線） |
| 官方公告 | [GitHub：Edge0-AI/edge0](https://github.com/Edge0-AI/edge0) |
| HuggingFace | [Edge0/Edge0-35B-A3B-preview](https://huggingface.co/Edge0/Edge0-35B-A3B-preview) |
| 家族 | Edge0 系列（同時發佈 35B-A3B〔Qwen3.5-MoE 底〕與 8B-A1B〔Ling 3.0 Tiny 底〕兩個量級） |

## 能力亮點

- **SSD 專家卸載**：MoE 的專家權重留在硬碟／快閃記憶體上，只在被路由到時才串流載入，尖峰記憶體只跟「當下啟用的專家」成正比，跟總參數量脫鉤——35B 模型在 Mac mini M4 Pro（24GB）上實測只用 2.9 GiB 尖峰記憶體、decode 14.9–17.7 tok/s
- **Prerouter 預測式路由**：訓練一個路由預測頭，提前一步猜下一輪要用哪些專家，讓專家載入跟前向計算重疊執行而非互相等待，帶來最高 **+59%** 的 decode 吞吐量提升（增益隨儲存延遲、模型規模、路由寬度 K 增加而變大）
- **Recover-LoRA 蒸餾**：凍結 int4 base model，用 FP16 teacher 蒸餾訓練 LoRA adapter 補償量化損失，讓 int4 版本 5 項 benchmark 平均只比 fp16 base 掉 **3.9 分**（Max 100 分制）
- 同一套框架同時發佈 35B-A3B 與 8B-A1B 兩個量級，base checkpoint 唯讀不重新量化，一份 base 可搭配多組 LoRA adapter 服務不同任務

## Benchmark 表現

| Benchmark | Edge0-35B-A3B（int4） | Qwen3.5-MoE 35B-A3B（fp16 base） | 差距 |
|---|---|---|---|
| AIME 2026 | 86.6 | 92.7 | -6.1 |
| HumanEval | 90.9 | 95.1 | -4.2 |
| GPQA-Diamond | 79.8 | 81.8 | -2.0 |
| MMLU-Pro | 81.0 | 84.6 | -3.6 |
| IFBench | 57.9 | 61.7 | -3.8 |
| **平均** | **79.2** | **83.2** | **-3.9** |

⚠️ 以上均由 Edge0-AI 用 OpenCompass 自行測試（官方自測，未經第三方復現），對照組是同團隊、同設定下跑出的 fp16 base model 分數，並非 Qwen 官方公布的分數，可能因評測設定差異與其他來源不同。

## 與前代/競品比較

這是 Edge0 的首次發佈（preview 版），沒有前代可比較，但可以拿它跟一般的量化路線比：常見的 int4 靜態量化（如 GGUF、AWQ）套用在大型 MoE 模型上，通常會在推理密集型 benchmark（如 AIME）掉更多分；Edge0 用 Recover-LoRA 把整體平均損失壓到 3.9 分，掉最兇的 AIME 2026 也只掉 6.1 分，效果優於一般靜態量化的常見表現。

跟同框架另一個量級 edge0-8b（Ling 3.0 Tiny 底）比，8B 版本量化損失更小（官方數字平均 2.8 分 vs 35B 版的 3.9 分），MMLU-Pro 甚至比 fp16 base 還高（70.1 vs 65.8）——顯示 prerouter＋LoRA 這套補償機制在較小模型上效果更穩定。但兩者的 base model 分屬不同家族（Qwen3.5-MoE vs Ling 3.0），不是同一模型的縮放版本，不能直接視為「小版比大版好」。

定價策略上，Edge0 完全免費開源（框架、權重、adapter 全部 Apache-2.0 釋出），跟閉源雲端 API 的商業模式完全不同——它賣的不是模型能力本身，而是「用更少硬體跑更大模型」的部署方案。

## 對 Agent 開發的意義

如果你在做需要離線／裝置端執行的 agent（例如 macOS 桌面應用、不能接雲端 API 的隱私敏感場景）：Edge0 讓一台 24GB 的 Mac mini 就能跑 35B 級 MoE 模型，不需要雲端 GPU 費用，是目前少見能在消費級硬體上跑到這個參數量級的開源方案。

如果你在做多租戶推理服務：base checkpoint 唯讀、LoRA adapter 可插拔的設計，代表一份量化好的 35B base 能同時服務多組不同任務的 adapter，不需要為每個任務重新量化整個模型，能省下不少儲存與部署成本。

不適合：需要 agentic 能力（工具呼叫、多步驟規劃、長時程自主）的正式生產場景——官方 README 明講這個 preview 版「agent 能力目前偏弱」，完整版才會大幅加強；也不適合非 Apple Silicon 平台，目前只有 MLX backend（Apple Silicon），CUDA 版還在 roadmap 上，Windows／Linux GPU 使用者暫時用不了。

## 今日收穫

以前認為「量化」跟「效能」是單純的 trade-off——要嘛用更小的模型換記憶體，要嘛用更差的精度換速度。Edge0 的 prerouter＋Recover-LoRA 組合說明還有第三條路：用「預測式路由」把 SSD 讀取延遲藏在計算背後，再用蒸餾式 LoRA 補償量化造成的精度損失，讓「消費級硬體跑資料中心級模型」的代價壓到個位數分數，而不是打對折。

## 參考資料

- [Hugging Face：Edge0/Edge0-35B-A3B-preview](https://huggingface.co/Edge0/Edge0-35B-A3B-preview)
- [GitHub：Edge0-AI/edge0](https://github.com/Edge0-AI/edge0)
- [GitHub：Edge0 architecture 文件](https://github.com/Edge0-AI/Edge0/blob/main/docs/architecture.md)
- [AlphaSignal：Edge0 Runs a 35B AI Model on a Mac mini Using SSD](https://alphasignal.ai/news/edge0-runs-a-35b-ai-model-on-a-mac-mini-using-ssd)
- [MindStudio：Edge0-35B-A3B: A 35B MoE Model That Runs in 3GB of RAM](https://www.mindstudio.ai/blog/edge0-35b-phone-memory-moe)
