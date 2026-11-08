---
title: "模型卡｜ERNIE 5.5 Flash Base"
date: 2026-11-09
category: daily
type: digest
tags: [ai-agent, model-release, daily, baidu, model-family-ernie]
lang: zh-TW
description: "百度開源 ERNIE 5.5 Flash Base——280B 總參數、14B 啟用的 MoE 基礎模型，純 pretraining checkpoint 無任何後訓練，在百度自家統一評測管線下於 30 個基準中的 24 個領先 DeepSeek-V4-Flash-Base、Hy3-preview-Base 與 MiMo-V2.5-Base"
tldr: "百度 2026-11-05 開源 ERNIE 5.5 Flash Base：280B 總參數／14B 啟用參數的 MoE 基礎模型，33.5T token 預訓練、128K 訓練上下文（推論與微調支援 1M）；純 pretraining checkpoint，未經任何後訓練；百度自報在 MMLU-Pro（78.4 vs DeepSeek 69.2）、HumanEval+（82.3 vs 69.5）等多項基準領先同量級開源模型；授權免費上限年收 5000 萬美元，但不含歐盟／英國／南韓"
series:
  name: "AI Model Tracker"
  order: 70
glossary:
  - term: "ERNIE"
    def: "百度開發的大型語言模型家族，5.5 代首次以「純基礎模型」（無後訓練）形式開源釋出權重"
  - term: "MoE（Mixture-of-Experts）"
    def: "稀疏混合專家架構：模型內含多個「專家」子網路，每次推論只啟用一小部分，讓總參數量遠大於實際運算量"
---

> 🌏 [English version](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base-en)


## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `baidu/ERNIE-5.5-Flash-Base`（FP8）／`baidu/ERNIE-5.5-Flash-Base-BF16`（BF16） |
| 廠商 | Baidu |
| 參數量 | 280B 總參數，14B 啟用參數／token（另有 ECHO 模組額外 0.36B，不計入主參數） |
| Context Window | 128K（訓練上限）／1M（微調與推論支援） |
| Input 定價 (USD/1M tokens) | 無官方 API 定價（純開源權重模型，未提供百度自家 API 服務） |
| Output 定價 (USD/1M tokens) | 無官方 API 定價（同上） |
| 開源 | 是（ERNIE 5.5 Flash Base Model License Agreement v1.0：年相關營收低於 5000 萬美元免授權費，超過須另行書面授權；授權範圍不含歐盟、英國、南韓） |
| 發布日 | 2026-11-05 |
| 官方公告 | [Baidu ERNIE Blog：ERNIE 5.5 Flash Base](https://ernie.baidu.com/release/ernie-5-5-flash-base/) |
| HuggingFace | [baidu/ERNIE-5.5-Flash-Base](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) |
| 家族 | ERNIE 5.x 系列（本次為 5.5 代首個純基礎模型釋出） |

## 能力亮點

- **純 pretraining checkpoint，刻意不做後訓練**：百度明確定位這是「預訓練結束那一刻」的權重，沒有經過任何 mid-training 或 post-training，目的是讓社群在同一個起點上比較不同的微調／指令調整／RL 方法，官方明言「只能透過 completions API 使用，不是聊天模型」
- **混合稀疏注意力壓低 KV cache**：43 層中有 37 層用 Heavily Compressed Attention（每 128 個 token 只快取 1 筆），只有 1/7 的層（6 層 MLA+DSA）保留逐 token 的完整上下文存取，讓長上下文推論的快取成本大幅下降
- **Multi-Router Latent MoE**：512 個路由專家（top-10）+ 1 個共享專家，用多個獨立初始化的 sigmoid router 取代單一 router 評分，百度表示這讓路由分數與專家實際效用的相關性明顯提升，尤其是在中後段層
- **ECHO 取代 MTP 模組**：直接重用主幹最後一層預測未來 token（而非另外接一個 MTP 模組），讓多步驟 loss 直接訓練到產生下一個 token 的同一組參數；同一層還能當作推測解碼（speculative decoding）的草稿模型

## Benchmark 表現

| Benchmark | ERNIE 5.5 Flash Base | DeepSeek-V4-Flash-Base | Hy3-preview-Base | MiMo-V2.5-Base |
|---|---|---|---|---|
| MMLU-Pro (EM) | **78.4** | 69.2 | 66.9 | 65.7 |
| HumanEval+ (Pass@1) | **82.3** | 69.5 | 78.0 | 74.4 |
| GPQA (EM) | **60.2** | 55.9 | 50.2 | 51.4 |
| LongBench-v2 (EM) | **48.7** | 44.5 | 39.8 | 44.6 |
| HELMET-Rerank (NDCG@10) | 56.2 | **60.0** | 55.7 | 56.6 |

⚠️ 以上四組「ERNIE 5.5 Flash Base 領先」與一組「落後」的數字，皆出自百度官方統一評測管線（相同 prompt、相同 few-shot 設定、相同裁判模型），屬於自測結果；第三方 MarkTechPost 指出百度測得的競品分數與各家自己公布的分數略有差異（如 DeepSeek 官方自報 MMLU-Pro 為 68.3，百度測得 69.2），需等外部獨立複現。百度自報在 30 個基準中的 24 個領先，但長上下文的 HELMET-Rerank、InfiniteBench 與中文知識 ChineseSimpleQA 三項落後 DeepSeek-V4-Flash-Base。

## 與前代/競品比較

跟同量級的三個開源基礎模型比，ERNIE 5.5 Flash Base 的程式碼能力差距最大：HumanEval+ 領先 DeepSeek-V4-Flash-Base 12.8 個百分點、MBPP+ 領先 14.3 個百分點，MMLU-Pro 也領先 9.2 個百分點。但這些優勢集中在「考試」與「程式碼」兩類，長上下文評測（HELMET-Rerank、InfiniteBench）反而落後 DeepSeek，說明 37/43 層只保留壓縮上下文存取（HCA）的設計在某些長文件任務上是有取捨的，不是全面領先。

跟 DeepSeek-V4-Flash-Base（284B-A13B，1M 訓練上下文，MIT 授權）比，兩者活躍參數相近（14B vs 13B），但 DeepSeek 的訓練上下文直接到 1M，ERNIE 5.5 Flash 訓練時只到 128K、推論才擴到 1M——這代表 ERNIE 的長上下文能力更多是推論時外推而非訓練時原生學到的，也可能解釋為什麼它在長上下文類別的表現比考試與程式碼類別更保守。授權上 DeepSeek 用 MIT（完全寬鬆），ERNIE 5.5 Flash Base 則是百度自訂授權，年營收超過 5000 萬美元需另行書面授權、且不開放歐盟／英國／南韓使用，這對台灣團隊是可用的（台灣不在排除名單），但要注意這不是無條件的開源授權。

跟 Tencent Hy3-preview-Base（295B-A21B）比，Hy3 啟用參數比 ERNIE 多了 50%（21B vs 14B），但百度測得的 MMLU-Pro、HumanEval+、GPQA 分數 ERNIE 都領先；Hy3 只在 BBH（CoT 版本）與 FullStackBench 兩項領先。如果這些數字成立，代表 ERNIE 5.5 Flash 用更少的啟用運算量達到相近或更好的效果，但仍是百度單方面的評測結果，尚待外部複現。

## 對 Agent 開發的意義

這是一個「基礎模型」而非「聊天模型」，官方明確說只能用 completions API 呼叫，沒有 chat template、沒有 RLHF 對齊——這意味著你**不能**直接拿它當 agent 的推理後端，它的角色是給有訓練能力的團隊做下一步微調的起點。

- 如果你在做需要客製化領域行為的 agent（例如特定產業的工具呼叫風格、特定語氣的對話策略）：這類純 base checkpoint 讓你從乾淨的起點做指令微調或 RLHF，不用先想辦法「撬開」一個已經對齊過的聊天模型；程式碼與推理類基準的優勢，加上官方公布的 SGLang／vLLM 部署範例，降低了起步的工程成本
- 如果你在做需要多個團隊互相比較訓練方法的研究（例如比較 SFT vs RL 哪個更有效）：官方特別強調這個 checkpoint 的用途就是「提供一個共同起點做控制變因比較」，這正是你需要的
- 不適合：想要「拿來就能用」的聊天或 agent 後端——這點跟多數「開源模型」上架就能直接當 API 呼叫的情境不同，你必須先自己做後訓練；也不適合歐盟、英國、南韓的團隊使用（授權排除名單），以及年相關營收超過 5000 萬美元卻沒拿到百度書面授權的場景

## 今日收獲

多數「開源模型發佈」預設讀者會直接拿模型做聊天或工具呼叫，但百度這次刻意只放出「預訓練結束、尚未對齊」的 checkpoint，並且把這個決定寫進公告的第一段：目的不是給終端使用者，而是給有能力做後訓練的團隊一個乾淨、可控制變因的起點。這提醒我們讀「開源」這個詞時要多問一句：開源的是「可以直接用的模型」，還是「可以在上面蓋房子的地基」——兩者對 Agent 開發的可用性完全不同，地基型的開源模型（如這次的 ERNIE 5.5 Flash Base）如果不先做後訓練就直接拿來跑 agent，很可能連基本的指令遵循都做不到。

## 參考資料

- [Baidu ERNIE Blog：ERNIE 5.5 Flash Base（官方技術公告，含完整評測表與架構細節）](https://ernie.baidu.com/release/ernie-5-5-flash-base/)
- [HuggingFace：baidu/ERNIE-5.5-Flash-Base（模型卡與部署說明）](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)
- [MarkTechPost：Baidu Releases ERNIE 5.5 Flash Base: A 280B MoE Base Model With 14B Active Parameters](https://www.marktechpost.com/2026/11/05/baidu-ernie-5-5-flash-base-280b-moe/)
- [BigGo Finance：Baidu Open-Sources ERNIE 5.5 Flash Base](https://finance.biggo.com/news/364f7bfb-db7b-4722-9b14-69e97d8c4f78)
- [Pebblous：ERNIE 5.5 License: Korea Excluded, Plus a $50M Cap](https://blog.pebblous.ai/blog/baidu-ernie-5-5-license-korea-excluded/en/)
- [Unite.AI：Baidu Releases ERNIE 5.5 Flash Base for Further Training](https://www.unite.ai/baidu-releases-ernie-5-5-flash-base-for-further-training/)
