---
title: "DeepSeek——從 MoE 實驗室到 V4.1 Flash 的 Causal Encoder-Decoder，開源權重裡最便宜的 agentic 主力"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, deepseek, open-source, model-family-deepseek, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "DeepSeek 用 MLA、細粒度 MoE，再到 V4.1 的 Causal Encoder-Decoder 與 FP4 KV cache，一路把推論成本壓到開源陣營最低。2026-11 官方 API 只剩兩個型號：`deepseek-flash`（DeepSeek-V4.1-Flash-1017，552B 總參數、輸入啟用 8B／輸出啟用 16B，尖峰 $0.30／$1.20）是主力，`deepseek-v4-pro`（V4-Pro-0813）保留給需要知識回憶的工作；兩者權重都是 MIT。V4.1 Pro 只在公告裡被提過，還沒上架。"
description: "DeepSeek 模型家族完整介紹：V1→V4.1 演化脈絡、MLA 與 DeepSeekMoE、V4.1 的 Causal Encoder-Decoder 與 KV cache 壓縮、R1 推理線、V4.1-Flash-1017 與 V4-Pro-0813 的評測、尖峰／離峰定價、Search／Fetch 與應用 API，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 1
draft: false
glossary:
  - term: "MLA"
    def: "Multi-head Latent Attention，DeepSeek 發明的注意力機制——把 KV cache 壓縮成低維度潛在向量，V2 論文報告 KV cache 減少 93.3%"
  - term: "KV cache"
    def: "推論時儲存已處理 token 的 Key-Value 向量的快取，是長序列推論的主要記憶體瓶頸，也是 agent 長對話的主要成本來源"
  - term: "CED（Causal Encoder-Decoder）"
    def: "V4.1 採用的架構：20 層因果 encoder 加 20 層 decoder，decoder 的全域 KV cache 由 encoder 最後一層的隱藏狀態投影而來，因此讀輸入時只需啟用 8B 參數"
  - term: "DSpark"
    def: "DeepSeek 的投機解碼模組，用半自迴歸方式產生草稿、再依信心排程驗證，內建在 V4 與 V4.1 模型中"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-family-deepseek-en)

DeepSeek 是開源權重陣營裡最在意「每個 token 多少錢」的家族。從 V2 的 MLA 到 V4.1 的 Causal Encoder-Decoder，每一代的主要賣點都是把推論成本壓下去，而不是把參數堆上去。這篇寫給要把 DeepSeek 放進 agent 工作流的開發者：2026 年 11 月的官方 API 只剩 `deepseek-flash` 與 `deepseek-v4-pro` 兩個型號，讀完你能判斷該用哪一個、自架划不划算，以及哪些任務還不該交給它。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第一篇家族深度介紹。

## 家族定位與版本矩陣

以 2026-11-23 DeepSeek API「Models & Pricing」頁上架的型號為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| DeepSeek-V4.1-Flash-1017（API 名 `deepseek-flash`） | 日常主力：coding agent、工具呼叫、高吞吐處理 | 552B 總參數，輸入啟用 8B、輸出啟用 16B；原生看圖；1M context、最多 384K output | 官方 API、網頁與 App；MIT 權重 |
| DeepSeek-V4-Pro-0813（API 名 `deepseek-v4-pro`） | 需要知識回憶、事實型問答的工作 | 1.6T 總參數、49B 啟用；不支援圖片 | 官方 API；MIT 權重 |
| DeepSeek-R1／R1-0528 | 舊推理線 | 推理能力已併入主線的 thinking 模式 | MIT 權重；官方 API 已不列 |

新程式一律寫 `deepseek-flash`：舊名 `deepseek-v4-flash` 與 `deepseek-v4-flash-vision-exp` 仍可呼叫，但背後已經是 V4.1-Flash-1017，按 Flash 價計費。V4.1 Pro 只在 2026-09-10 的 V4.1 Flash 公告裡被提到過一次，定價頁與更新日誌都還沒有它的型號、價格或日期，選型時不要把它算進來。

### 兩條主線：通用線 vs 推理線
DeepSeek 的模型原本分成兩條平行演進的主線：

**通用線**（V1 → V2 → V3 → V3.2 → V4 → V4.1）：針對一般對話、coding、工具呼叫做最佳化，核心目標是效率和成本。從 V2 開始確立 MLA + MoE 架構，V3 把訓練成本壓到 2.788M H800 GPU 小時，V4 把 context window 拉到 1M 並分出 Flash／Pro，V4.1 換成 Causal Encoder-Decoder，第一次讓 Flash 在多數 agentic 評測上贏過自家 Pro。

**推理線**（R1 → R1-0528）：專攻長鏈思考。R1 的突破在 R1-Zero——這個模型完全用強化學習訓練，沒有任何 SFT 資料，卻自發展現出推理能力，證明推理可以單純從獎勵訊號中湧現。之後 DeepSeek 把推理能力蒸餾回 Qwen 和 Llama 架構的小模型；V3.2 起主線模型內建 thinking 與非 thinking 兩種模式，推理線不再單獨出新版本。

早期的 DeepSeek-Coder 與 DeepSeek-Math 也是同樣的劇本：主線的 coding 與數學能力夠強之後，專用子線就停止獨立迭代。

### 子線與生態系
2026 年下半年，DeepSeek 在模型之外補上了一整層 agent 基礎設施：

- **DeepSeek Harness**：官方 agent harness，2026-11 仍是 developer preview。V4.1-Flash-1017 的更新說明特別寫了針對 Harness、騰訊 CodeBuddy、WorkBuddy 做過最佳化，建議升到 Harness 0.2.1-rc.1 以上
- **Search／Fetch API**（2026-10-17）：DeepSeek 自建搜尋引擎對外開放，按次計費
- **應用 API**（2026-11-13）：把 App 裡的網路搜尋、深度思考搜尋、檔案輸入、網址讀取與內容安全檢查開放成 API 參數，另有 OCR、語音辨識與語音合成的獨立 API
- **DeepSeek-OCR**：獨立的視覺 OCR 模型，MIT 授權，不依賴 V4 架構
- **R1 蒸餾版**：把 R1 的推理能力蒸餾到 Qwen 和 Llama 架構的小模型上（1.5B 到 70B），讓社群可以在消費級硬體上跑推理模型

## 家族演化

### 家族演化時間線
| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| DeepSeek LLM 67B | 2023-11 | 67B Dense，沿用 Llama 系架構 | 起點，還不是成本領先者 |
| DeepSeek-MoE | 2024-01 | 145B 總參數、22B 啟用，首次引入細粒度 MoE | 證明細切專家能用更少啟用參數換到同級品質 |
| DeepSeek-V2 | 2024-05 | 236B／21B，**MLA + DeepSeekMoE 確立** | 長 context 推論第一次便宜到可以大量使用 |
| DeepSeek-V3 | 2024-12 | 671B／37B，去輔助損失負載平衡、MTP、FP8 訓練 | 開源模型的品質開始逼近閉源旗艦 |
| DeepSeek-R1 | 2025-01 | 671B／37B，純 RL 推理、R1-Zero | 開源推理模型與蒸餾小模型讓自架推理變得可行 |
| DeepSeek-V3.2 | 2025-12 | Thinking／Chat 雙模式統一 | 推理不再要另選一個模型，改用模式切換 |
| DeepSeek-V4 Flash／Pro | 2026-04 | Flash 284B／13B、Pro 1.6T／49B，1M context | 1M context 進入開源主線，Flash／Pro 分層從這一代開始 |
| V4-Flash-0731／V4-Pro-0813 | 2026-07／08 | 重新 post-training；8 月起改採尖峰／離峰計價 | agentic 能力大幅提升；離峰半價讓批次任務改排時段（[尖峰離峰定價](/posts/daily/2026-08-16-pricing-deepseek-v4-peak-off-peak-hike)）|
| V4-Flash-Vision-Exp | 2026-08-21 | 實驗性多模態，基於 Flash | 第一次能在 DeepSeek 內做看圖的 agent，但只是實驗版（[模型卡](/posts/daily/2026-09-01-model-deepseek-deepseek-v4-flash-vision-exp)）|
| DeepSeek-V4.1-Flash | 2026-09-10 | Causal Encoder-Decoder，552B／8B＋16B，原生多模態，KV cache 每 token 890 bytes | Flash 在多數 agentic 評測上超過 V4-Pro，主力從 Pro 移到 Flash；V4 Flash 與 Vision-Exp 退役（[模型卡](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash)）|
| V4.1-Flash-1017 | 2026-10-17 | 同架構小改版，價格不變；同日開放 Search API | 目前的選型基準，見下方各節 |

V4.1 Flash 公告原本寫 2026-09-14 起把 `deepseek-v4-pro` 的請求全部轉給 V4.1 Flash，但更新日誌隨後改為「應使用者要求，9/14 之後繼續提供 V4 Pro API、計費方式不變」。現行定價頁也仍單獨列出 V4-Pro-0813，以更新日誌與定價頁為準。

三年、十幾個里程碑，每一代都帶著明確的架構改進。V2 是第一個轉折點——MLA 和 DeepSeekMoE 在那一代定型；V4.1 是第二個——decoder 不再自己算全域 KV cache，啟用參數反而比前代少。

## 架構與訓練取捨

### 架構：為什麼 DeepSeek 這麼便宜
DeepSeek 的成本優勢來自三層疊加的設計：V2 的 MLA 壓縮 KV cache、V3 的細粒度 MoE 壓低啟用參數、V4.1 的 Causal Encoder-Decoder 再把讀輸入與寫輸出拆開計價。

#### MLA：把記憶體瓶頸壓縮 93%

標準的多頭注意力（MHA）在推論時有一個痛點：每處理一個 token，就要把之前所有 token 的 Key 和 Value 向量存起來（KV cache）。當 context 拉長到數萬或數十萬 token 時，KV cache 佔的記憶體比模型本身還大。

MLA（Multi-head Latent Attention）把所有頭的 K 和 V 壓進一個低維的潛在向量，推論時只存這個向量，需要哪個頭的 K 或 V 再即時算出來。V2 論文報告 KV cache 減少 93.3%。代價是注意力的運算量增加，但長序列推論的瓶頸通常是記憶體頻寬，所以這是淨贏。

#### DeepSeekMoE：671B 參數只啟用 37B

傳統的 Mixture of Experts 用 8 個大專家，每次選 1–2 個。DeepSeek 反過來把專家切得很細：V3 是 1 個共享專家加 256 個路由專家、每個 token 選 8 個；V4.1 Flash 是 1 個共享專家加 384 個路由專家、每個 token 選 6 個。細切的好處是組合數多，模型能學到更精細的知識分工；共享專家則承擔通用知識，避免路由專家之間重複學同樣的東西。

V3 還引入了**去輔助損失的負載平衡**：不用額外的損失函數懲罰不平衡，而是用動態偏置調整專家被選中的機率，不干擾主要訓練目標。

#### Causal Encoder-Decoder：讀輸入只啟用 8B

V4.1 Flash 的 HuggingFace 模型卡把它描述成 40 層 Transformer：前 20 層是因果 encoder，後 20 層是 decoder。decoder 的全域 KV cache 直接從 encoder 最後一層的隱藏狀態投影出來，不必每層自己算。結果是 prefill（讀輸入）每個 token 只啟用 8B 參數，decode（寫輸出）啟用 16B——對「讀很多、寫很少」的 agent 工作特別划算。

同一張模型卡列出的其他設計：

- **CSA2（Compressed Sparse Attention 2）**：每層注意力固定是 Full、Reindex、Reuse 三種模式之一，跨層共用主 KV 與稀疏索引；搭配 FP4 主 KV 快取，全域 KV cache 壓到每 token 890 bytes，約是 V4 Flash 的 1/4
- **SWA Bounded Replay**：滑動視窗的 KV 不寫到 SSD，需要時只重放最近一段 token，持久化的 KV cache 約是 V4 Flash 的 1/8
- **Engram 條件式記憶**：196B 參數的記憶模組，依 token 稀疏查詢
- **原生多模態**：自訓的 DeepSeek-ViT 從預訓練一開始就和文字一起訓練，不是事後外掛

KV cache 變小直接打在 agent 的帳單上：官方公告指出 cache hit 費用常是 agent 成本的大宗，而 V4.1 Flash 的 cache hit 價是每 1M tokens $0.006（尖峰）。

#### 訓練與工程

- **預訓練**：V4.1 Flash 從頭訓練在 45T tokens 的多模態語料上，稀疏注意力以 64K 序列長度訓練，在 34T tokens 時把 context 擴到 1M
- **後訓練**：模型卡說演算法沿用標準的 SFT → RL → on-policy distillation，實質改動都在資料端——大規模自動合成 agent 任務與環境
- **工程降本**：V3 全程 FP8 訓練、DualPipe 重疊計算與跨節點通訊、PTX 級 GPU 調校；V3 的 671B 只用了 2.788M H800 GPU 小時

V4.1 Flash 的推理強度是 1 到 100 的連續整數，開源權重的評測一律用 100；官方 API 的範例用 `reasoning_effort: "high"` 搭配 thinking 開關。

## 評測與競品比較

### V4.1-Flash-1017：官方數字
以下是 DeepSeek 在 HuggingFace 模型卡與 2026-10-17 更新日誌公布的自測結果。Terminal-Bench 4.0 用 Claude Code harness、DeepSWE 用 Mini-SWE-V2 harness；對照組是官方表格自選的模型：

| Benchmark | V4.1-Flash-1017 | V4.1-Flash（9/10） | GLM-5.3 | GPT-5.6 Sol | Claude Opus 5 |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 77.0 | 74.2 | 66.9 | 73.0 | 74.0 |
| Terminal-Bench 4.0 | 42.3 | 31.2 | 37.9 | 39.9 | 51.8 |
| AutomationBench v1.0.6 | 60.5 | 54.8 | 48.8 | 45.8 | 50.3 |
| Agents' Last Exam | 35.4 | 31.8 | 28.5 | 26.7 | 28.6 |
| NL2Repo-Bench | 68.2 | 65.4 | 58.0 | 56.8 | 75.3 |
| ProgramBench | 29.1 | 20.3 | 19.0 | 23.0 | 37.0 |
| HLE（無工具） | 42.6 | 36.8 | 42.0（純文字子集） | 44.5 | 56.3 |

讀這張表要注意三件事。第一，對照組停在 Opus 5 與 GPT-5.6 Sol，沒有放 Claude Opus 5.5 或 GPT-6 世代，所以「打平閉源旗艦」只對上一代成立。第二，最難的 Terminal-Bench 4.0、ProgramBench、NL2Repo 與 HLE 仍是 Opus 5 領先，DeepSeek 贏的是中等難度的 agentic 任務。第三，各家用的 harness 不同（DeepSeek 用 Mini-SWE-V2 跑 DeepSWE、GLM 用 mini-swe-agent），harness 本身就會改變分數——比較前先固定自己的 harness。

### Flash 與 Pro 的分工
V4.1 Flash 在 agentic 評測上全面超過 V4-Pro-0813（官方表格 DeepSWE 74.2 對 62.7、Terminal-Bench 4.0 31.2 對 12.4），但 base model 的知識題反過來：SimpleQA-Verified 是 V4.1-Flash-Base 42.3、V4-Pro-Base 55.2，MultiLoKo 45.5 對 50.9。換句話說，Flash 擅長「動手做」，Pro 的參數量仍換來比較多的「知道什麼」。

### 第三方評測
Artificial Analysis Intelligence Index v5.0.1 給 V4.1-Flash-1017 的分數是 33（max）、29（high）、19（非推理模式）；同一版指數下 GLM-5.3（Max）是 32。這個指數的題庫會隨版本更換，不能拿來跟 8 月以前的分數比。

### 跟競品的位置
- **對上 GLM-5.3**：同樣是中國開源權重前段班。官方表格上 V4.1-Flash-1017 在 DeepSWE、AutomationBench、Agents' Last Exam 領先；GLM-5.3 的強項是資安評測，但它的權重授權多了一條大型 MaaS 業者的安全審查條款。詳見 [GLM 家族](/posts/tech/2026-08-24-ai-model-family-glm)
- **對上 Kimi 與 Qwen**：Kimi K3 在 DeepSeek 自己的表格上落後；Kimi K3.1 Pro 與 Qwen 新版本的比較要看各自家族的公告。詳見 [Kimi 家族](/posts/tech/2026-08-24-ai-model-family-kimi)、[Qwen 家族](/posts/tech/2026-08-24-ai-model-family-qwen)
- **對上 Claude／GPT 前沿**：Flash 的尖峰 output 價 $1.20，比閉源旗艦便宜一個數量級以上；最難的 agentic coding 與知識推理仍落後。詳見 [Claude 家族](/posts/tech/2026-08-24-ai-model-family-claude)、[GPT 家族](/posts/tech/2026-08-24-ai-model-family-gpt)

## 授權、價格與部署

### 授權
V4.1-Flash-1017、V4.1-Flash、V4-Pro-0813 的 HuggingFace 權重與程式碼都是 MIT，可商用、可微調、可自架，沒有營收或使用者數門檻。權重授權不取代託管供應商的服務條款：用官方 API 要另外遵守 DeepSeek 的服務條款，對外提供服務時官方建議開啟內容安全檢查參數，並自行處理內容審核、模型備案與 AI 標示等義務。

### API 定價
DeepSeek API 定價頁（2026-11-23 讀取），每 1M tokens：

| 項目 | `deepseek-flash`（V4.1-Flash-1017） | `deepseek-v4-pro`（V4-Pro-0813） |
|---|---|---|
| Input，cache miss（尖峰／離峰） | $0.30／$0.15 | $1.32／$0.66 |
| Input，cache hit（尖峰／離峰） | $0.006／$0.003 | $0.044／$0.022 |
| Output（尖峰／離峰） | $1.20／$0.60 | $3.96／$1.98 |
| Context／最大 output | 1M／384K | 1M |
| Vision | ✓ | ✗ |
| 並行上限 | 2,500 | 500 |

尖峰時段是週一到週五（不含中國法定假日）UTC 01:00–04:00 與 06:00–10:00，也就是北京時間 9:00–12:00、14:00–18:00；其餘時段含週末與中國假日全天都是離峰，價格減半。兩個型號都支援 JSON output、tool calls、Responses API 與 Anthropic API 格式；FIM 補全只在非 thinking 模式可用。

模型以外的計費項目：

- **Search／Fetch API**：每 1,000 次成功請求各 $0.75。2026-11-18 12:00（北京時間）起，呼叫模型時由伺服器端觸發的搜尋與網頁讀取不再按次收費，回傳內容併入 context 按 token 計價
- **檔案解析／OCR**：每 1,000 頁 $0.225
- **語音**：TTS 每 1 萬字元 $0.45、ASR 每小時 $0.116，目前限時五折

### 自架
V4.1-Flash-1017 的 HuggingFace 權重檔共 763B 參數（552B 主幹加視覺編碼器與記憶模組），沒有附 Jinja chat template，改附 Python 參考實作與 `deepseek-recipe`（Rust 函式庫加 Python binding）處理提示格式。官方建議 `max_tokens` 至少 256K。這不是單機規模：V4.1 Flash 公告對大規模部署的說法是「2,000 張 GPU 加儲存叢集」等級要直接洽談。

## Agent 使用與選型

### 對 Agent 開發者的意義
- **coding agent、CLI agent、多步驟自動化** → `deepseek-flash`：官方 DeepSWE v1.1 77.0、AutomationBench 60.5，尖峰 output $1.20；輸入只啟用 8B，讀大型 codebase 的長 session 特別划算
- **高吞吐分類、擷取、摘要** → `deepseek-flash`，排在離峰時段跑，再省一半
- **事實回憶、知識密集的問答** → 先試 `deepseek-v4-pro`：base model 的 SimpleQA-Verified 55.2 比 Flash 的 42.3 高一截；但 Pro 不收圖片、並行上限只有 500
- **需要看截圖、畫面、文件掃描** → 只有 Flash 支援 vision；要大量解析檔案可改用 OCR API 計頁收費
- **要搜尋與讀網頁** → 開 `deepseek_web_search`／`deepseek_read_url` 工具讓服務端組 context，11-18 起不再按次收費，但讀進來的內容按 token 計價，長網頁要算進成本
- **要自架** → MIT 權重可下載，但 763B 的權重量是叢集規模；預算有限的團隊用 API 比較實際
- **最難的 agentic coding 或研究推理** → Terminal-Bench 4.0、ProgramBench、HLE 仍落後 Claude；用 DeepSeek 做子任務、閉源旗艦做頂層規劃是務實的混用方式
- **還在用舊型號名** → 把 `deepseek-v4-flash`、`deepseek-v4-flash-vision-exp` 改成 `deepseek-flash`；行為已經是 1017 版，換名不會改變輸出，只是避免日後別名被收掉

### 最小驗證步驟
換模型前用自己的 harness 跑一次對照：固定 scaffold、提示與工具集，比 `deepseek-flash` 與現用模型的成功率、平均 output token 數與每任務成本，並在尖峰與離峰各跑一輪，確認實際帳單落在哪個價格。

## 限制與取捨

官方公布的 V4.1-Flash-1017 數字都是 DeepSeek 自測，對照組停在上一代閉源模型，且各家的 harness 設定不一致。Flash 在知識回憶上明顯弱於 Pro，Pro 又沒有 vision、並行上限低；V4.1 Pro 何時上架、會不會改變這個分工，目前沒有官方資訊。

部署面也有非技術的限制：2026 年 10 月美國國土安全部公告禁止文職聯邦機構使用 DeepSeek 的產品與服務，用官方 API 處理受監管資料前要先確認自己的合規要求；自架 MIT 權重可以避開資料流向問題，但規模門檻很高。

### 整體來說
DeepSeek 證明了前沿競爭力可以來自架構而非算力堆疊：MLA 壓 KV cache、細粒度 MoE 壓啟用參數，V4.1 再把讀和寫拆開啟用。對 Agent 開發者來說，2026 年 11 月的答案很簡單——預設 `deepseek-flash`，知識密集的工作試 Pro，最難的規劃留給閉源旗艦。

## 更新紀錄

- 2026-11-23：補上 V4.1 世代（V4.1-Flash 9/10、V4.1-Flash-1017 10/17）、Search／Fetch API 與 11/13 的應用 API；版本矩陣、架構、評測、定價與選型全部改寫為 2026-11-23 DeepSeek 定價頁、更新日誌與 HuggingFace 模型卡的內容。V4-Flash-0731／V4-Pro-0813 降為歷史世代：原本的 Flash／Pro 規格表、評測表與定價表移出正文，當時的數字見時間線連結的每日模型卡與尖峰離峰定價快照；時間線改為每列註明「改變了什麼選型」。修正錯誤：V4 Pro 的 SWE-bench Verified 96.4%、對 Claude Opus 5 的 97.0% 比較等數字出自第三方文章，與 DeepSeek 官方公布的評測不一致，已移除；補註 V4-Pro 在 9/14 後並未下架、仍單獨計價。
- 2026-10-11：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [Models & Pricing — DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing)
- [Change Log — DeepSeek API Docs](https://api-docs.deepseek.com/updates/)
- [DeepSeek-V4.1-Flash: Smarter, Faster, More Efficient — DeepSeek API Docs](https://api-docs.deepseek.com/news/news260910/)
- [deepseek-ai/DeepSeek-V4.1-Flash-1017 — Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash-1017)
- [deepseek-ai/DeepSeek-V4.1-Flash — Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
- [DeepSeek V4.1 Flash 1017 — Artificial Analysis](https://artificialanalysis.ai/models/deepseek-v4-1-flash-1017)
- [DeepSeek-V2: A Strong, Economical, and Efficient MoE Language Model (arXiv:2405.04434)](https://arxiv.org/abs/2405.04434)
- [DeepSeek-V3 Technical Report (arXiv:2412.19437)](https://arxiv.org/abs/2412.19437)
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (arXiv:2501.12948)](https://arxiv.org/abs/2501.12948)
- [DeepSeek-V4 Technical Report (arXiv:2606.19348)](https://arxiv.org/abs/2606.19348)
- [US moves to bar DeepSeek from federal agencies and contracts — Bloomberg](https://www.bloomberg.com/news/articles/2026-10-19/us-moves-to-bar-deepseek-from-federal-agencies-and-contracts)
- [The Inner Workings of MLA — Chris McCormick](https://mccormickml.com/2025/04/26/inner-workings-of-mla/)
- [The DeepSeek Series: A Technical Overview — Martin Fowler](https://martinfowler.com/articles/deepseek-papers.html)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
