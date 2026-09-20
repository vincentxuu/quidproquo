---
title: "模型卡｜Qwen-Image-2.1"
date: 2026-09-20
category: daily
type: digest
tags: [ai-agent, model-release, daily, qwen, model-family-qwen-image]
lang: zh-TW
description: "阿里通義千問開源 Qwen-Image-2.1——視覺生成部分僅 7B，原生支援透明圖（RGBA）生成與編輯、最多 10 張參考圖合成，Qwen-Image-Bench 自測總分 60.28 略高於 Nano Banana 2.0 與 GPT Image 1.5"
tldr: "Qwen-Image-2.1（Alibaba Qwen）：2026-09-20 開源，視覺生成模組 7B（32 層 Single-Stream DiT）＋Qwen3-VL 8B 編碼器，維持前代 2.0 的 7B 量級但新增原生透明圖（64 通道 RGBA VAE）與最多 10 張參考圖多圖編輯；Qwen-Image-Bench 官方自測總分 60.28，高於 Nano Banana 2.0（59.82）與 GPT Image 1.5（59.65）⚠️ 自測未經第三方覆現；SGLang 團隊獨立驗證單樣本 RGBA PSNR 達 60.69 dB；採 Qwen Research License Agreement，僅限非商業用途，官方未提供托管 API 定價；對 Agent 開發的意義是可省去獨立去背/合成步驟，適合電商素材與多場景分鏡類工作流"
series:
  name: "AI Model Tracker"
  order: 27
glossary:
  - term: "Qwen-Image"
    def: "阿里巴巴通義千問（Qwen）旗下的圖像生成與編輯模型系列，2025-08 首發 20B 版本，2026-02 起改走 7B 輕量化路線"
  - term: "RGBA"
    def: "Red-Green-Blue-Alpha，在色彩通道外多一層透明度（Alpha）資訊，讓圖片可以有部分或完全透明的區域，方便後續疊圖合成"
---

> 🌏 [English version](/en/posts/daily/2026-09-20-model-qwen-image-2-1-en)

## 模型資訊

| 項目 | 值 |
|---|---|
| Model ID | `Qwen/Qwen-Image-2.1` |
| 廠商 | 阿里巴巴通義千問（Alibaba Qwen，隸屬阿里雲） |
| 參數量 | 視覺生成模組 7B（32 層 Single-Stream DiT）＋ Qwen3-VL 8B 文字／視覺編碼器（前代 Qwen-Image 1.0 為 20B） |
| Context Window | 不適用（圖像生成模型；原生支援 2K 解析度即 2048×2048，最多可接收 10 張參考圖） |
| Input 定價 (USD/1M tokens) | 未公開（開源權重，Qwen Research License Agreement 僅限非商業用途，官方未提供托管 API；商業授權需另洽，尚未公布費率） |
| Output 定價 (USD/1M tokens) | 未公開（同上） |
| 開源 | 是（Qwen Research License Agreement，僅限非商業用途；前代 Qwen-Image 1.0／2.0 為 Apache-2.0） |
| 發布日 | 2026-09-20 |
| 官方公告 | [QwenLM/Qwen-Image-2.1（GitHub）](https://github.com/QwenLM/Qwen-Image-2.1) |
| HuggingFace | [Qwen/Qwen-Image-2.1](https://huggingface.co/Qwen/Qwen-Image-2.1) |
| 家族 | Qwen-Image 系列（Qwen-Image 1.0 20B，2025-08 → Qwen-Image-2.0 7B，2026-02 → Qwen-Image-2.1 7B，本次） |

## 能力亮點

- 原生透明圖（RGBA）生成與編輯：64 通道 RGBA VAE＋16 倍空間壓縮，讓透明度通道直接是潛空間的一部分，而不是生成後再跑一次去背；SGLang 團隊獨立驗證單樣本 RGBA PSNR 達 60.69 dB，透明 PNG 生成與 FP8 量化組態皆通過正確性測試
- 一次最多接收 10 張參考圖做多主體合成編輯，並提供圈選、塗抹、獨立遮罩三種方式標定局部編輯區域，同時強調人像與商品的保真度
- 混合粒度注意力架構：文字部分維持逐詞因果遮罩，圖像部分改用區塊級遮罩並搭配 Prefix KV Cache，參考圖與指令在第一個去噪步驟後即快取重複利用，多圖輸入時的推理效率提升最明顯
- 視覺生成模組維持前代 2.0 的 7B 量級沒有再擴大，但 Qwen-Image-Bench 官方自測總分 60.28，略高於 Nano Banana 2.0（59.82）與 GPT Image 1.5（59.65）⚠️

## Benchmark 表現

| Benchmark | 分數 | 前代模型 | 競品最強 |
|---|---|---|---|
| Qwen-Image-Bench 總分 ⚠️ | 60.28 | 未參與（2.1 為首次公布此榜成績，2.0 沒有對照數字） | Nano Banana 2.0 59.82／GPT Image 1.5 59.65 |
| RGBA 透明圖正確性（SGLang 獨立驗證，單樣本 PSNR） | 60.69 dB | 不適用（2.0 沒有原生透明圖生成能力） | 不適用（主流閉源競品的透明圖多半是後製 API 參數而非原生潛空間輸出，無法用同一指標比較） |

⚠️ Qwen-Image-Bench 總分為 Qwen 官方自測結果，計分方式與比較對象未經第三方覆現；截至發稿，Qwen-Image-2.1 尚未出現在任何獨立圖像模型排行榜上。RGBA PSNR 數字來自 SGLang 團隊為驗證推理框架整合正確性所做的單樣本測試，該團隊本身也強調這只是正確性檢查、不是通用品質評測。由於本次是發布不到 24 小時內成文，可驗證的量化數據就只有這兩組，比一般模型卡少；這個資訊落差本身也是今天最值得記下的一點。

## 與前代/競品比較

Qwen-Image-2.0 在 2026 年 2 月已經把視覺生成模組從初代 Qwen-Image 1.0 的 20B 砍到 7B，主打原生 2K 解析度；根據科技媒體 WaveSpeed 整理的資訊，Qwen 官方當時宣稱 2.0 在 DPG-Bench 上贏過參數量更大的 FLUX.1-dev（12B）。2.1 沒有再往上加參數，而是把同一個 7B 量級的模型改造成「生成＋編輯＋透明圖」三合一：原本要靠外部去背服務才能拿到的 RGBA 素材，現在是模型潛空間原生輸出的一部分。

跟閉源競品比，這次的透明圖能力恰好構成一個有意思的對照。GPT Image 2 在 2026 年 8 月新增 `background: "transparent"` 這個 API 參數才拿到透明輸出，屬於「請服務端幫你去背」；Qwen-Image-2.1 則是把 Alpha 通道直接塞進 64 通道 VAE 的潛空間裡去噪，屬於「模型本身就懂透明」。兩條路線在一個月內先後補齊同一項能力，但穩定性與可控性未必相同——目前只有 SGLang 的單樣本正確性測試可以佐證 Qwen-Image-2.1 的透明輸出是「真的」，還沒有大規模品質評測。

定價策略上兩者也走完全不同的路：GPT Image 2 是按 token 計費（image input $8.00／1M tokens、image output $30.00／1M tokens），Qwen-Image-2.1 則是免費下載本地跑，但代價是 Qwen Research License Agreement 明確排除商業用途——這點跟過去 Qwen-Image 1.0／2.0 一路用 Apache-2.0 開源完全不同，對想直接商用的團隊反而是授權上的倒退，需要另洽官方取得商業條款。

## 對 Agent 開發的意義

原生透明圖生成對做視覺素材自動化的 Agent 是實質的管線簡化：過去「生成圖片 → 呼叫去背模型 → 邊緣清理」三段式流程，現在理論上可以收斂成一次模型呼叫，減少中間服務的維護成本與延遲。混合粒度注意力＋Prefix KV Cache 的設計也代表，在「先給一批參考圖、再多輪局部修改」這種互動式編輯場景裡，重複推理的成本會比每次都重新編碼整批參考圖更低。

- 如果你在做電商素材生成 Agent：原生透明圖可以直接輸出疊圖用的商品 PNG，省掉一個獨立的去背/合成微服務，也適合搭配既有的商品攝影素材做局部替換（換背景、換配件）
- 如果你在做角色一致性要求高的內容生產（漫畫分鏡、廣告分鏡、故事板）：10 張參考圖的多圖合成編輯，比起多數只吃 1-2 張參考圖的競品更適合串成「角色設定 → 多場景分鏡」的長流程 pipeline
- 不適合：需要商業交付結果的場景——Qwen Research License Agreement 明確排除商業用途，貿然把產出用在商業專案有法遵風險，應改用有明確商業授權的閉源 API；也不適合對輸出品質要求「有獨立驗證背書」的正式生產環境，因為目前只有廠商自測分數，尚無第三方覆現的品質評測

## 今日收穫

圖像模型的競賽正從「單張圖多漂亮」轉向「工作流內建了多少步驟」——Qwen-Image-2.1 跟 GPT Image 2 用兩種完全不同的技術路線（原生潛空間 Alpha vs. API 後製參數），在一個月內先後補齊透明圖這項能力，說明「原生」與「參數包裝」在使用者看到的結果上可能殊途同歸，但背後的穩定性、可控性與維護成本差異其實很大。比起單純比參數量或跑分，這種「同一能力、不同實作路線」的對照，更值得在評估要不要導入新模型時多想一步。

## 參考資料

- [QwenLM/Qwen-Image-2.1 官方 GitHub README](https://github.com/QwenLM/Qwen-Image-2.1)
- [Qwen/Qwen-Image-2.1 HuggingFace 模型頁](https://huggingface.co/Qwen/Qwen-Image-2.1)
- [Qwen 官方 X／Twitter 發布貼文](https://x.com/Alibaba_Qwen/status/2101659302792679789)
- [新浪科技：拿下開源生圖第一，千問 Qwen-Image-2.1 把生圖捲出新高度（含 Qwen-Image-Bench 評測圖表）](https://finance.sina.com.cn/tech/roll/2026-09-20/doc-inisnwyr2387502.shtml)
- [OrcaRouter：Qwen-Image-2.1 vs GPT Image 2 對比分析（定價、授權、SGLang 驗證細節）](https://www.orcarouter.ai/blog/qwen-image-2-1-vs-gpt-image-2)
- [RuntimeWire：Alibaba previews Qwen-Image-2.1 for character-consistent storyboards](https://runtimewire.com/article/alibaba-qwen-image-2-1-character-storyboard-editing-preview)
- [WaveSpeed Blog：What to Expect from Qwen Image 2.0（前代規格與 DPG-Bench 說法）](https://wavespeed.ai/blog/posts/blog-what-to-expect-from-qwen-image-2-0-ai-image-generation/)
- [arXiv 2605.28091：Qwen-Image-Bench（評測基準論文）](https://arxiv.org/abs/2605.28091)
