---
title: "Tencent Hy（混元）——Hy4 旗艦與 Hy4 flash 開放權重，授權從 Apache 2.0 改成自訂條款"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, tencent, open-source, model-family-hunyuan, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Tencent Hy（原名混元）目前在架的是 Hy4（770B 總參數、49B 啟用、1M context，首度支援圖片輸入與 computer use）和低價的 Hy4 flash（約 220B、12B 啟用）。兩者都已開放權重，但授權從 Hy3／Hy4 preview 的 Apache 2.0 改成 Tencent Hy License：大型 MaaS 業者要另取授權。Artificial Analysis 給 Hy4 35 分，coding 長任務仍落後閉源前沿，強項是金融、辦公與成本。"
description: "Tencent Hy（混元）模型家族介紹：Hy4 與 Hy4 flash 的規格、架構（Gated DSA、iHC、Engram、DFly2）、官方與第三方評測、Tencent Hy License 條款、TokenHub／OpenRouter 價格、2024→2026 演化時間線與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 34
draft: false
glossary:
  - term: "Gated DSA（Gated DeepSeek Sparse Attention）"
    aliases: ["Gated DSA"]
    definition: "Hy4 採用的稀疏注意力：由 indexer 為每個 token 挑出最多 2,048 個相關位置再做注意力，並加上閘門；搭配 IndexCache 讓相鄰層重用同一份稀疏索引"
  - term: "iHC（identity Hyper-Connections）"
    aliases: ["identity Hyper-Connections"]
    definition: "把單一殘差路徑擴成多條並行殘差流（Hy4 為 4 條）的設計，目的是加強跨層資訊流動"
  - term: "Engram"
    definition: "Hy4 flash 的 N-gram 嵌入模組：用多頭雜湊查表取出 bigram／trigram 表示，增加參數容量但幾乎不增加每 token 計算量"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en)

Tencent Hy 是騰訊的大型語言模型家族，原名「騰訊混元（Hunyuan）」，中文新聞稿仍常寫「腾讯混元」，HuggingFace 上的權重名稱則已改為 Hy。這篇寫給要評估中國開放權重模型的 Agent 開發者：Hy4 和 Hy4 flash 各適合什麼任務、跟 DeepSeek、Kimi、GLM 比起來站在哪裡，以及新授權對 API 轉售與大型產品有什麼限制。

2026 年 11 月的局面是：旗艦 Hy4 在 11 月 4 日上線 API，11 月 20 日釋出權重；低價的 Hy4 flash 在 11 月 17 日開源。兩者都換成新的 Tencent Hy License，不再是前兩代的 Apache 2.0。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

以下價格為 [OpenRouter 上的 Tencent Cloud 牌價](https://openrouter.ai/tencent/hy4)，每 1M tokens：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| Hy4（`tencent/Hy4`，API 名 `hy4`） | 目前旗艦 | 770B 總參數、49B 啟用；1M context；輸入文字、圖片、影片；首度支援 computer use | 開放權重（Tencent Hy License）＋API：$0.834／$2.501，快取命中 $0.042 |
| Hy4 flash（`tencent/Hy4-flash`） | 低價日常任務 | 約 220B（含 63.5B Engram）、12B 啟用；1M context；文字＋圖片輸入 | 開放權重（Tencent Hy License）＋API：$0.07／$0.281，快取命中 $0.003 |
| Hy4 base／Hy4-flash-base | 預訓練權重 | 未經指令微調，供自行後訓練 | 開放權重 |
| Hy3（`tencent/Hy3`） | 上一代中型 | 295B 總參數、21B 啟用、256K context，純文字 | 開放權重，Apache 2.0 |
| Hy-Memory-30B-A3B | Agent 記憶寫入 | 專門負責 Mem0／MemOS 這類框架的記憶寫入路徑 | 開放權重，Apache 2.0 |

兩個要先知道的事：

- **Hy4 的 API 價格沿用 preview。** OpenRouter 上 Together、DeepInfra 也以同價託管；騰訊新聞稿把同一組價格換算成約 $0.90／$2.70。Tencent Cloud TokenHub 到 2026-12-31 前五折，所以 OpenRouter 會顯示 $0.417／$1.251。
- **權重版本有 FP8 和 base。** Hy4 與 Hy4 flash 都同時釋出 BF16、FP8 和預訓練 base 權重，[Hy4 模型卡](https://huggingface.co/tencent/Hy4)另附 GGUF 供端到端測試。

### 子線與生態

除了通用主線，騰訊在 HuggingFace 的 [`tencent` 組織](https://huggingface.co/tencent)下還有多條以 Hy 命名的子線：翻譯（Hy-MT2、即時口譯 Hy-SimulMT）、Agent 記憶（[Hy-Memory-30B-A3B](/posts/daily/2026-10-16-model-tencent-hy-memory-30b-a3b)）、世界模型（HY-World 2.0）、具身智慧（HY-Embodied）與 3D 生成（Hunyuan3D，見[用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)的 3D 一節）。優圖實驗室的 [Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni) 雖然也掛在 `tencent` 組織下，但屬於另一個團隊、另一套授權。

部署通路是騰訊自家產品：Hy4 已接入辦公 agent WorkBuddy、程式助理 CodeBuddy、AI 助理元寶、知識管理工具 ima 與企業微信的助理。WorkBuddy 同時把 DeepSeek、GLM、Kimi 等外部模型接進同一個工作台（見[中國區域週報](/posts/daily/2026-08-28-region-china)），所以 Hy 在騰訊產品裡也要跟別家模型競爭使用者的選擇。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Hunyuan-Large | 2024-11 | 389B-A52B MoE 開放權重，騰訊第一次放出大型 MoE 權重；自訂 Tencent License | — |
| Hunyuan-A13B | 2025-06 | 80B-A13B 中型 MoE，單機可跑的開放權重選項 | — |
| Hy3 preview | 2026-04-23 | 重建基礎設施後的第一個版本，295B-A21B、256K；Tencent Hy Community License | — |
| Hy3 | 2026-07-06 | 正式版改用 Apache 2.0，8 月擴大國際通路；中型開放權重第一次沒有商用附加條件 | — |
| Hy4 preview | 2026-08-28 | 規模放大到 770B-A49B、context 擴到 1M，仍是 Apache 2.0、純文字 | [模型卡](/posts/daily/2026-08-29-model-tencent-hy4-preview) |
| Hy4 | 2026-11-04（API）／11-20（權重） | 首度支援圖片與 computer use，價格不變；權重授權改為 Tencent Hy License | — |
| Hy4 flash | 2026-11-17 | 12B 啟用的低價分支，每任務成本約 Hy4 的 1/20；同樣是 Tencent Hy License | [模型卡](/posts/daily/2026-11-19-model-tencent-hy4-flash) |

一年內的主軸是「規模與 context 往上、價格不動」。另一條線是授權：Hy3 與 Hy4 preview 曾是寬鬆的 Apache 2.0，到 Hy4 世代改成以 Apache 2.0 為底、加上 MaaS 商用條款的自訂授權。Hy4 preview 在主篇降為上一代，它的 SWE-bench Pro、Terminal-Bench 2.1 等分數保留在[當時的模型卡](/posts/daily/2026-08-29-model-tencent-hy4-preview)，跟本篇的 benchmark 版本不同，不放在同一張表比較。

## 架構與訓練取捨

### Hy4：稀疏注意力加多條殘差流

[Hy4 模型卡](https://huggingface.co/tencent/Hy4)寫明架構沿用 preview、參數規模不變，主要新增視覺：

- **MoE 主幹**：78 層，第一層是稠密 FFN，其餘 77 層各有 256 個路由專家與 1 個共用專家，每 token 啟用 8 個路由專家。
- **Gated DSA＋IndexCache**：注意力採 MLA 形式，由 indexer 為每個 token 挑出最多 2,048 個位置；相鄰層重用同一份稀疏索引，降低 1M context 下的索引成本。官方說明這部分參考了 DeepSeek 與 GLM 的設計。
- **iHC**：4 條並行殘差流，加強跨層資訊流動。
- **視覺**：1.23B 參數的 ViT 支援動態解析度，經 adapter 把圖片與影片幀轉成視覺 token。每 token 啟用量是文字 49B 加視覺 1.23B。
- **DFly2 投機解碼**：內建 5 層、3.3B 的草稿模型，直接共用主模型的 KV cache 與稀疏索引。草稿 token 最多只看約 2K 個 key，成本不隨 context 長度增加，也不需要另外的 KV 記憶體。

代價很直接：自架要 8 張 GPU 的張量並行（官方 vLLM／SGLang 範例都以 `tensor-parallel-size 8` 跑 FP8 版），而且[系統卡](https://cdn-front.hy.tencent.ai/common-files/Hy4_system_card.pdf)自己承認，不靠工具的原生視覺感知與跨學科視覺推理仍弱。

### Hy4 flash：三處為成本讓步

[Hy4 flash 模型卡](https://huggingface.co/tencent/Hy4-flash)列出相對 Hy4 的三個改動：

- **混合注意力**：稀疏注意力與 512 token 的滑動視窗注意力以 1:3 交錯。
- **LatentMoE**：路由專家在低維 latent 空間運算，每 token 從 512 個專家選 16 個，加 1 個共用專家。
- **Engram**：用雜湊查表取 bigram／trigram 表示，63.5B 參數只做查表、不進注意力。

三者合起來，KV cache 只有 Hy3 的 1/24、Hy4 的 1/6。後訓練從 Hy4 自蒸餾，再用強化學習把平均輸出 token 砍掉一半。讀規格時要注意：220B 的總參數裡有近三成是查表參數，推論成本要看 12B 啟用量，不能用總參數估。

## 評測與競品比較

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/tencent-hy4) 的 Intelligence Index v5.0.1 給 Hy4 35 分（推理設定），在同尺寸開放權重模型裡高於中位數 23；[heise 報導](https://www.heise.de/en/news/Tencent-Hy4-New-AI-model-joins-China-s-top-tier-11513717.html)指出它在中國實驗室裡排第二，落後 Kimi K3.1 Pro 的 46 分，與 Grok 4.7 同分、略低於 Claude Haiku 5.5 的 36 分。同一頁也標出它很囉嗦：跑完整套指數產生 1.6 億個輸出 token，中位數約 1 億。Hy4 flash 目前沒有 Artificial Analysis 分數。

### 官方自報：Hy4 對上開放權重與閉源前沿

以下摘自 [Hy4 模型卡附錄](https://huggingface.co/tencent/Hy4)，全部是騰訊公布的數字；對手欄位有兩個數字時，前者引用對方官方報告、後者是騰訊自測：

| Benchmark | Hy4 preview | Hy4 | DeepSeek-V4.1-Flash-1017 | Kimi K3.1 Pro | Claude Opus 5.5 |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 64.3 | 74.9 | 77.0／73.8 | 75.5／76.3 | 74.2／72.6 |
| Terminal-Bench 4.0 | 26.3 | 44.4 | 42.3／40.0 | 65.7／66.8 | 66.4／66.4 |
| ProgramBench（almost solved） | 17.5 | 30.0 | 29.1／29.0 | 31.5／24.5 | 65.0／56.5 |
| APEX-Agents v1.1 | 53.9 | 75.2 | 72.1／72.9 | 67.2／68.2 | 73.5／74.8 |
| OSWorld 2.1 | — | 78.9 | 68.4 | 79.6 | 81.8 |
| MMMU-Pro | — | 78.6 | 76.7 | 84.1／83.4 | 88.2 |

讀法：

- **coding 長任務是弱項。** DeepSWE 跟對手打平，但 Terminal-Bench 4.0 與 ProgramBench 明顯落後 Kimi K3.1 Pro 與 Claude Opus 5.5。官方在 Known Limitations 也這樣寫。
- **工作型 agent 是強項。** APEX-Agents 與 OSWorld 接近閉源前沿；騰訊與騰訊金融科技找 213 位金融從業者盲評 579 個任務，Hy4 平均 3.04／4，高於 DeepSeek-V4.1-Flash-1017 的 2.97、Kimi K3.1 Pro 與 GLM-5.3 的 2.68。
- **幻覺率改善是自家數字。** 官方內部評測的幻覺率從 preview 的 15.76% 降到 5.45%，沒有第三方複現。

跨廠商表格的數字也不一定一致：百度在 [ERNIE 5.5 Flash Preview 公告](https://ernie.baidu.com/release/ernie-5-5-flash-preview)引用的 Hy4 APEX-Agents 是 77.6，騰訊自己的表是 75.2。引用時要寫明是哪一家的表。

### Hy4 flash

[Hy4 flash 模型卡](https://huggingface.co/tencent/Hy4-flash)只公布內部 WorkIndex（簡報、文件、試算表、影音處理等 8 組任務）：Hy4 flash 42.1、Hy4 preview 39.7、Hy4 51.4；每任務平均成本是 Hy4 preview 的 1/13、Hy4 的 1/20、DeepSeek-V4.1-Flash-1017（Max 檔、尖峰價）的 1/8。公開 agent benchmark 只給圖表，騰訊明確建議長程軟體工程改用 Hy4。

## 授權、價格與部署

### Tencent Hy License：以 Apache 2.0 為底，多一條 MaaS 條款

[Hy4](https://huggingface.co/tencent/Hy4/blob/main/LICENSE) 與 [Hy4 flash](https://huggingface.co/tencent/Hy4-flash/blob/main/LICENSE) 用同一份 Tencent Hy License 1.0。條文開頭就聲明它衍生自 Apache 2.0、但不是 Apache 2.0；差別集中在第 10 條：

| 情境 | 條件 |
|---|---|
| 一般商用、微調、再散布 | 同 Apache 2.0：保留授權與修改聲明 |
| 經營 MaaS（讓第三方透過 API 等方式取得通用推論或微調能力） | 集團 12 個月全球營收超過 5,000 萬美元，或產品月活超過 1 億，使用前要取得騰訊書面授權 |
| 純內部使用 | 模型與輸出都不提供給第三方時，不受上一列限制 |

「MaaS」的定義排除兩種情況：能力只限於特定功能或流程的終端產品，以及單純轉送請求到第三方模型服務。換句話說，把 Hy4 嵌進一個功能明確的 SaaS 產品多半不受影響；做通用 API 轉售的大型平台才要先談授權。授權沒有地區排除條款。

上一代的 Hy3 與 Hy4 preview 仍是 Apache 2.0，權重也還在 HuggingFace 上；需要完全寬鬆授權的團隊可以停在那兩個版本，代價是沒有視覺能力。

### API 價格

- **Hy4**：$0.834／$2.501，快取命中 $0.042（OpenRouter 上 Tencent Cloud、Together、DeepInfra 同價）；Tencent Cloud 到 2026-12-31 前五折。上下文 1M。
- **Hy4 flash**：$0.07／$0.281，快取命中 $0.003；目前只有 Tencent Cloud 一家託管，同樣在五折期間。
- **快取的影響很大。** OpenRouter 統計 Hy4 實際成交的快取命中率約 96%，加權平均輸入價只有每 1M 約 $0.04；agent 工作流的重複 prompt 會讓帳單遠低於牌價。

### 自架

官方提供 vLLM（`vllm/vllm-openai:hy4`）與 SGLang（`lmsysorg/sglang:hy4`）映像檔，兩者都開啟 DFly2 投機解碼；`reasoning_effort` 可選 `no_think` 或 `high`（預設）。量化可用騰訊的 AngelSlim 工具，微調流程見官方 Finetuning Guide。

## Agent 使用與選型

- **金融研究、辦公文件、深度搜尋類 agent** → Hy4。官方投入最多的就是這些場景，價格是 Claude Opus 5.5 的一小部分；先用自己的任務實測幻覺率。
- **高頻、低複雜度的前置處理** → Hy4 flash。每任務成本約 Hy4 的 1/20，可以先篩一輪，難的再升級到 Hy4。
- **主力 coding agent 或終端操作** → Hy4 不是首選，Terminal-Bench 4.0 與 ProgramBench 落後 Kimi K3.1 Pro 與 Claude Opus 5.5。
- **要 computer use 或圖表理解** → Hy4 是目前少數同時支援 GUI 操作與開放權重的選項；OSWorld 2.1 官方分數 78.9。
- **要 Apache 2.0** → Hy3（純文字、256K）或 Hy4 preview（純文字、1M）。
- **做 API 轉售或月活上億的產品** → 選 Hy4 前先依第 10 條判斷是否算 MaaS，必要時向騰訊申請書面授權。
- **Agent 長期記憶** → Hy-Memory-30B-A3B 可取代 Mem0／MemOS 背後的通用模型。

最小的選型驗證：把同一組 agent 任務分別送 Hy4 的 `no_think` 與 `high`，再送 Hy4 flash，比較完成率、輸出 token 與帳單。Artificial Analysis 的資料顯示 Hy4 輸出偏長，`no_think` 的成本差距可能比分數差距更值得看。

## 限制與取捨

- **長程 coding 落後閉源前沿。** 官方自己的表與 Artificial Analysis 都指向同一件事：終端與從零建系統的任務，Hy4 跟 Kimi K3.1 Pro、Claude Opus 5.5 還有距離。
- **評測多半是自報或內部基準。** WorkIndex、TenureTrail、金融盲評都是騰訊自建；目前唯一的獨立整體分數是 Artificial Analysis 的 35 分。
- **授權不再是 Apache 2.0。** Hy4 世代的權重附帶 MaaS 條款，判斷門檻要看集團營收與月活，不能沿用「Hy 開源＝可任意商用」的舊印象。
- **輸出冗長。** 預設 `high` 推理會產生大量 token，延遲與成本都要實測。
- **原生視覺仍弱。** 不靠工具的細粒度視覺理解，官方承認明顯落後前沿模型。

Hy 的策略可以概括成：用騰訊自家產品當訓練與評測場，把旗艦做到開放權重第一梯隊，價格維持在中段。對外部開發者來說，Hy4 是金融與辦公 agent 值得排進評測清單的開放權重選項；它不是 coding 冠軍，授權也比前兩代多了一道門檻。

## 參考資料

- [Tencent Launches Hy4 — Tencent 官方新聞稿](https://www.tencent.com/tencent-launches-hy4-joining-the-ranks-of-the-worlds-leading-open-source-ai-models/)
- [Hy4 — Tencent Hy 官方部落格](https://hy.tencent.ai/research/hy4)
- [tencent/Hy4 — HuggingFace 模型卡（規格、附錄評測、部署）](https://huggingface.co/tencent/Hy4)
- [Tencent Hy License 1.0 — HuggingFace](https://huggingface.co/tencent/Hy4/blob/main/LICENSE)
- [Hy4 System Card](https://cdn-front.hy.tencent.ai/common-files/Hy4_system_card.pdf)
- [tencent/Hy4-flash — HuggingFace 模型卡](https://huggingface.co/tencent/Hy4-flash)
- [tencent/Hy3 — HuggingFace 模型卡](https://huggingface.co/tencent/Hy3)
- [腾讯混元Hy3正式发布 — Tencent 官方新聞稿（簡體中文）](https://www.tencent.com/zh-cn/tencent-hunyuan-officially-releases-hy3-advancing-agent-capabilities-and-deeper-product-integration/)
- [Tencent Hy3 Now Available Globally — Tencent 官方新聞稿](https://www.tencent.com/tencent-hy3-now-available-globally-extending-practical-ai-across-products-workflows-and-cloud-services/)
- [tencent/Hy3-preview — HuggingFace 模型卡](https://huggingface.co/tencent/Hy3-preview)
- [tencent/Hy4-preview — HuggingFace 模型卡](https://huggingface.co/tencent/Hy4-preview)
- [tencent/Tencent-Hunyuan-Large — HuggingFace](https://huggingface.co/tencent/Tencent-Hunyuan-Large)
- [tencent/Hunyuan-A13B-Instruct — HuggingFace](https://huggingface.co/tencent/Hunyuan-A13B-Instruct)
- [Tencent: Hy4 — OpenRouter（供應商與價格）](https://openrouter.ai/tencent/hy4)
- [Tencent: Hy4 flash — OpenRouter](https://openrouter.ai/tencent/hy4-flash)
- [Tencent Hy4 — Artificial Analysis](https://artificialanalysis.ai/models/tencent-hy4)
- [Tencent Hy4: New AI model joins China's top tier — heise online](https://www.heise.de/en/news/Tencent-Hy4-New-AI-model-joins-China-s-top-tier-11513717.html)
- [Tencent releases Hy4 model weights with million-token context — TechNode](https://technode.com/2026/11/20/tencent-releases-hy4-model-weights-with-million-token-context/)
- [ERNIE 5.5 Flash Preview — Baidu ERNIE 官方部落格（含 Hy4 對照數字）](https://ernie.baidu.com/release/ernie-5-5-flash-preview)
- [模型卡｜Tencent Hy4 flash](/posts/daily/2026-11-19-model-tencent-hy4-flash) — 本站
- [模型卡｜Tencent Hy4 Preview](/posts/daily/2026-08-29-model-tencent-hy4-preview) — 本站
- [模型卡｜Hy-Memory-30B-A3B](/posts/daily/2026-10-16-model-tencent-hy-memory-30b-a3b) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
