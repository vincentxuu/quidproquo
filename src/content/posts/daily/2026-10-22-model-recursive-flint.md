---
title: "模型卡｜Recursive Flint"
date: 2026-10-22
category: daily
type: digest
tags: [ai-agent, model-release, daily, recursive, model-family-flint]
lang: zh-TW
description: "成立僅一年、估值 46.5 億美元的新創 Recursive 發布首款模型 Flint——40B 總參數僅 2.5B 活躍，MacBook Pro 上跑贏同量級模型近兩倍速度，官方說整個訓練與推理優化幾乎都是自家「Eureka Machine」自動研究系統做的"
tldr: "Recursive Flint：40B 總參數 MoE（256 個路由專家＋1 個共用專家，每 token 啟用 6 個路由專家，活躍參數約 2.5B），原生 context 262,144 tokens（官方建議上限 512K），Apache 2.0 授權，2026-10-21 發佈，TechCrunch／Wired 均有報導；SWE-bench Verified 74.2%（官方自測對照 Qwen3.6-35B-A3B 的 73.4%）、SWE-bench Pro v2 89.7%、Terminal-Bench 2.1 54.9%、LiveCodeBench v6 80.3%，是 50B 參數以下 MoE 模型目前最高分；MacBook Pro M4 Pro 上達 131 tokens/s，比 Gemma 4、NVIDIA Nemotron 3.5 Lightning 等同級模型的 58–69 tokens/s 快將近兩倍，RTX Spark 上超過 150 tokens/s；量化到 NVFP4 僅比 16-bit 掉 0.7 分；無官方付費 API，OpenRouter 目前提供促銷性免費 hosted 版本。Recursive 由 Salesforce 前首席科學家 Richard Socher 領軍，2026 年 5 月以 6.5 億美元募資、46.5 億美元估值走出 stealth，這是公司第一款公開模型，核心訊息是幾乎整個模型建構流程（架構搜尋、量化配方、推理 kernel）都由自家自動化研究系統 Eureka Machine 完成，4 個月內由小團隊打造。"
series:
  name: "AI Model Tracker"
  order: 55
glossary:
  - term: "Flint"
    def: "AI 新創 Recursive 發布的首款模型，40B 總參數、2.5B 活躍參數的 MoE agentic coding 模型，定位是能在一般筆電跑的本地 coding agent 底座"
  - term: "Eureka Machine"
    def: "Recursive 自家的自動化 AI 研發系統，負責提想法、實作、跑實驗、依結果決定下一步，官方稱 Flint 幾乎整個建構流程（架構搜尋、量化配方、推理 kernel）都由它完成"
---

> 🌏 [English version](/posts/daily/2026-10-22-model-recursive-flint-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `RecursiveSI/flint` |
| 廠商 | Recursive（AI 新創，CEO 為 Salesforce 前首席科學家 Richard Socher） |
| 參數量 | 39.8B 總參數／約 2.5B 活躍參數（含輸出層；純 active body 約 2.2B，MoE：256 路由專家＋1 共用專家，每 token 選 6 個路由專家） |
| Context Window | 262,144 tokens（文件化設定；官方建議實際使用維持在 256K 以內，部落格提及可延伸到 512K） |
| Input 定價 (USD/1M tokens) | 不適用（純開放權重本地模型，官方未提供付費 API；OpenRouter 目前提供促銷性免費 hosted 版本） |
| Output 定價 (USD/1M tokens) | 不適用（同上） |
| 開源 | 是（Apache 2.0） |
| 發布日 | 2026-10-21 |
| 官方公告 | [Recursive Blog：Introducing Flint](https://recursive.com/updates/introducing-recursive-flint) |
| HuggingFace | [RecursiveSI/flint](https://huggingface.co/RecursiveSI/flint) |
| 家族 | Flint（Recursive 首款公開模型，尚無前代） |

## 能力亮點

- SWE-bench Verified 74.2%，官方自測對照 Qwen3.6-35B-A3B（官方卡上 73.4%）略勝，是 50B 參數以下 MoE 模型目前最高分
- 僅約 2.5B 活躍參數（40B 總參數），MacBook Pro M4 Pro 上用自家推理引擎達 131 tokens/s，比同級的 Gemma 4、NVIDIA Nemotron 3.5 Lightning（58–69 tokens/s）快將近兩倍；NVIDIA RTX Spark 上超過 150 tokens/s
- 量化到 NVFP4 只比 16-bit 掉 0.7 分：做法是把輸出層（lm_head）也量化到 4-bit（業界通常不這麼做），再用模型自己取樣的回答做離線蒸餾校正，訓練步數比常規量化感知訓練少近半
- 官方自曝整個建構流程——架構搜尋、量化配方、推理 kernel 優化——幾乎全由自家自動化研究系統「Eureka Machine」完成，4 個月內由一個小團隊從零打造完成

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| SWE-bench Verified | 74.2% | 首發（Recursive 第一款模型，無前代） | Qwen3.6-35B-A3B：73.4%（官方自家模型卡分數） |
| SWE-bench Pro v2 | 89.7% | 首發 | 官方僅以綜合排名圖呈現，未單獨公布同口徑競品分數 |
| Terminal-Bench 2.1 | 54.9% | 首發 | 同上 |
| LiveCodeBench v6 | 80.3% | 首發 | 同上 |

⚠️ 以上均為 Recursive 官方模型卡／部落格自測結果（溫度 1.0、top-p 0.95、top-k 20，agentic 任務至少 5 次嘗試取平均 pass@1），尚無外部單位獨立複現。官方在 Terminal-Bench 2.1、SWE-Bench Pro v2、SWE-Bench Verified、LiveCodeBench v6、IFBench、IFEval 六項測試的綜合平均排名中，只有阿里雲的 Qwen3.8-27B（dense、27B 全參數啟用）分數高於 Flint；Qwen3.8-27B 本身的個別測項分數官方部落格未逐項列出。

## 與前代/競品比較

Flint 是 Recursive 第一款公開模型，沒有前代可比，比較基準是「50B 參數以下、能在消費級硬體跑的 coding 模型」。在這個區間裡 Flint 的定位很清楚：用 2.5B 活躍參數打贏同量級的 MoE 對手（Qwen3.6-35B-A3B），速度上也贏——131 tokens/s 對 Gemma 4、NVIDIA Nemotron 3.5 Lightning 的 58–69 tokens/s，接近兩倍。跟參數量更大的 dense 模型比，Recursive 自己承認 Qwen3.8-27B（27B 全參數啟用）在六項測試平均分上還是贏 Flint，但 Qwen3.8-27B 沒有 MoE 的推理效率優勢，實際跑起來會慢得多。

跟上週發佈、也主打本地部署的 Meta Muse Spark Open 相比，兩者完全不是同一個量級：Muse Spark Open 總參數 816B，需要 terabyte 級記憶體才能跑；Flint 總參數 39.8B，一台 48GB 記憶體的 MacBook 就能跑，體型相差超過 20 倍，定位是「一般筆電本地開發」而不是「高階工作站／雲端重量級」。

定價面向也不同於多數同類文章比較的「付費 API」模型：Flint 本身沒有官方 API 服務，是下載到本機自己跑的開放權重模型，沒有 per-token 費用；OpenRouter 目前把它上架成免費 hosted 版本，但這是促銷性質，不是 Recursive 官方的長期定價承諾。

## 對 Agent 開發的意義

Flint 最大的意義不只是一個新模型，而是「用自動化研究系統建模型」這個流程本身被拿出來當公開案例：Recursive 稱整個架構搜尋、量化配方、推理 kernel 優化幾乎都是 Eureka Machine 做的，公司的長期目標是讓每一代模型都讓 Eureka Machine 變成更好的研究者，再用它更快做出下一代模型。

- 如果你在做本地、隱私敏感的 coding agent：Flint 可能是目前這個量級裡的好選擇——不用 API key、程式碼不離開本機，單張消費級顯卡或 Apple Silicon 筆電就能跑，SWE-bench Verified 74.2% 在同量級裡領先。
- 如果你在做需要長時間自主規劃的 agent：官方自己提醒 Flint 需要比大型閉源模型更多的引導，建議把任務拆成小步驟並給明確指示——這代表它在長鏈規劃與容錯上還不如 Claude、Codex 這類模型穩定，agentic 評測本身也只容許最多 5 小時逾時。
- 不適合：需要超大 context（Flint 文件化上限 262,144 tokens，官方建議不超過 256K，遠小於百萬級 context 的模型）或多模態輸入的場景——Flint 目前只支援純文字輸入輸出；也不適合需要廠商 SLA 與現成付費 API 的團隊，因為 Flint 沒有官方代管服務，想要穩定生產環境得自己處理部署與監控。

## 今日收穫

這次比較有意思的不是 benchmark 數字本身，而是 Recursive 把「用 AI 研究系統造模型」當成主要賣點來公開：公司名字就叫 Recursive（Recursive Superintelligence），目標是遞迴式自我改進——每一代模型都讓負責做研究的 Eureka Machine 更強，再用它更快做出下一代。這跟多數廠商「發布模型、順便提一下用了哪些自動化工具」的敘事順序正好相反，Flint 本身的效能數字其實是這套研發流程的「副產品展示」，而不是主角。

## 參考資料

- [RecursiveSI/flint · Hugging Face](https://huggingface.co/RecursiveSI/flint)
- [Recursive Blog：Introducing Flint](https://recursive.com/updates/introducing-recursive-flint)
- [TechCrunch：Recursive launches Flint, a laptop coding model it says was largely built by AI](https://techcrunch.com/2026/10/21/recursive-launches-flint-a-laptop-coding-model-it-says-was-largely-built-by-ai)
- [tech.eu：Recursive Superintelligence emerges from stealth with $650M raise](https://tech.eu/2026/05/13/recursive-superintelligence-emerges-from-stealth-with-650m-raise/)
- [r/LocalLLaMA：RecursiveSI/flint (40B A2.5B) · Hugging Face](https://www.reddit.com/r/LocalLLaMA/comments/1xbqik0/recursivesiflint_40b_a25b_hugging_face/)
