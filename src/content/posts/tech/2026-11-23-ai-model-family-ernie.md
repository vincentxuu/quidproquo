---
title: "百度 ERNIE（文心）——5.5 Flash 回到開放權重，Base 與 Preview 卻是兩種授權"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, baidu, open-source, model-family-ernie, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "百度 ERNIE 這一代是 ERNIE 5.5 Flash：280B 總參數、14B 啟用、1M context 的純文字 MoE。11 月 5 日先開源未經後訓練的 Base（自訂授權，排除歐盟、英國、南韓），11 月 11 日推出後訓練的 Preview，API 在千帆、承諾以 Apache 2.0 開源。官方評測與 Hy4、DeepSeek-V4.1-Flash 互有勝負（Terminal-Bench 4.0、AutomationBench 略高，DeepSWE、APEX-Agents 較低），但目前沒有任何第三方分數。閉源旗艦仍是 5 月的 ERNIE 5.1。"
description: "百度 ERNIE（文心）模型家族介紹：ERNIE 5.5 Flash Base／Preview 規格與架構（HCA＋MLA-DSA、Multi-Router Latent MoE、ECHO）、官方評測、兩種授權的差異、千帆價格、ERNIE 4.5→5.0→5.1→5.5 演化時間線、Unlimited OCR 子線與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 35
draft: false
glossary:
  - term: "HCA（Heavily Compressed Attention）"
    aliases: ["Heavily Compressed Attention"]
    definition: "ERNIE 5.5 Flash 大部分注意力層採用的壓縮注意力：每 128 個 token 壓成一筆快取，再加上一小段未壓縮的近期視窗，用來降低長 context 的 KV cache"
  - term: "ECHO"
    definition: "ERNIE 5.5 Flash 取代 MTP 模組的設計：直接重用主幹最後一層預測後續 token，同一層也能當投機解碼的草稿模型；額外參數約 0.36B"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-ernie-en)

ERNIE（文心）是百度的大型模型家族，中國市場的對話產品「文心一言」與企業平台「千帆」都建在它上面。這篇寫給要評估 ERNIE 的 Agent 開發者：ERNIE 5.5 Flash 的 Base 與 Preview 各能拿來做什麼、兩份授權差在哪裡，以及在沒有第三方評測的情況下該怎麼驗證。

2026 年 11 月的局面是：百度把新一代的主力放在 280B 的 ERNIE 5.5 Flash，先開源預訓練 Base，再推出後訓練的 Preview；Preview 的權重官方預定 11 月 25 日前開源。閉源旗艦仍是 5 月的 ERNIE 5.1。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| ERNIE 5.5 Flash Preview（千帆 `ERNIE-5.5-Flash-Preview`） | 目前這一代的後訓練模型 | 280B 總參數、14B 啟用；1M context，預設輸出 64K；純文字；官方標明是後訓練中途的 checkpoint | 千帆 API；OpenRouter 免費提供；權重承諾以 Apache 2.0 開源 |
| ERNIE 5.5 Flash Base（`baidu/ERNIE-5.5-Flash-Base`） | 預訓練權重 | 同架構，未經任何中訓練或後訓練，只能用 completions 呼叫 | 開放權重（FP8／BF16），ERNIE 5.5 Flash Base 授權 |
| ERNIE 5.1 | 閉源旗艦 | 從 ERNIE 5.0 抽出的子網路，總參數約 5.0 的三分之一 | ERNIE 官網、百度 AI Studio |
| ERNIE 4.5 系列 | 上一代開放權重 | 0.3B 稠密到 424B-A47B 多模態 MoE，共 10 款 | 開放權重，Apache 2.0 |
| Unlimited OCR 2（`baidu/Unlimited-OCR-2`） | 長文件 OCR | 3.34B，針對上百頁文件的跨頁解析 | 開放權重，MIT |

幾件要先知道的事：

- **Preview 和 Base 授權不同。** Base 是百度自訂授權，有地區排除與營收門檻；Preview 承諾用 Apache 2.0。兩者架構相同，選哪一份權重直接決定能在哪裡、怎麼商用（見「授權、價格與部署」）。
- **5.5 Flash 沒有視覺。** 官方示範的 Unreal Engine 遊戲開發案例特別寫出：模型看不到畫面，只能把試玩發現的問題轉成程式裡可量測的測試。要看圖的任務，ERNIE 這一代得靠外部工具。
- **5.1 與 5.5 Flash 是兩條線。** 5.1 延續 5.0 的彈性訓練路線，5.5 Flash 是從零預訓練的新架構，不是 5.1 的縮小版。

### 子線與生態

除了通用主線，百度在 HuggingFace 的 [`baidu` 組織](https://huggingface.co/baidu)還維護幾條任務專用線：長文件 OCR 的 [Unlimited OCR](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2)（MIT）、Qianfan-OCR、文字生成圖片的 ERNIE-Image，以及 PaddlePaddle 生態裡的 PaddleOCR-VL。千帆平台同期上架的還有低成本長 context 模型 ERNIE-Light-DT-1.0 和人物影片生成的 ERNIE-Wizshot-ME。

百度的模型訓練與部署大多建在自家 PaddlePaddle 框架上；ERNIE 4.5 的權重同時提供 PaddlePaddle（`-Paddle`）與 PyTorch（`-PT`）兩種格式。5.5 Flash Base 則直接以 safetensors 發佈，官方附 SGLang／vLLM 部署範例。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| ERNIE 4.5 開源 | 2025-06-30 | 10 款權重一次以 Apache 2.0 開源，最大 424B-A47B；百度第一次大規模開放權重 | — |
| ERNIE 5.0 | 2025-11 起 Preview 上 LMArena，2026-01 正式版 | 2.4T 參數的原生全模態模型，理解與生成文字、圖片、影片、音訊都在同一個自回歸主幹；只有 API，不開權重 | — |
| ERNIE 5.1 | 2026-05-09 | 從 5.0 抽出子網路，總參數約三分之一、啟用約一半，預訓練成本約同級模型 6%；仍是閉源 | — |
| Unlimited OCR 2 | 2026-10-27 | 3.34B、MIT 授權，百頁級文件解析不必先切塊 | [模型卡](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2) |
| ERNIE 5.5 Flash Base | 2026-11-05 | 新架構從零預訓練 33.5T tokens，只放預訓練終點權重；自訂授權排除歐盟、英國、南韓 | [模型卡](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base) |
| ERNIE 5.5 Flash Preview | 2026-11-11 | 第一個後訓練版，API 上千帆；承諾 Apache 2.0 開源 | — |

一年內的主軸是「閉源旗艦與開放權重分家」：4.5 世代全面開源，5.0／5.1 只走 API，到 5.5 Flash 又回到開放權重，但這次用更小、更省的架構。5.0 的全模態路線沒有延續到 5.5 Flash，後者是純文字模型。

## 架構與訓練取捨

### ERNIE 5.5 Flash：每個元件都在壓 KV cache 與啟用量

[ERNIE 5.5 Flash Base 官方公告](https://ernie.baidu.com/release/ernie-5-5-flash-base/)與 [HuggingFace 模型卡](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)列出的設計：

- **混合稀疏注意力**：43 層中 37 層用 HCA，每 128 個 token 壓成一筆快取；只有 6 層（約七分之一）用 MLA 加 DeepSeek Sparse Attention，保留逐 token 的完整 context 存取。這是 1M context 推論時 KV cache 能壓下來的主因。
- **Multi-Router Latent MoE**：每層 512 個路由專家（top-10）加 1 個共用專家，在低維 latent 空間運算；用多個獨立初始化的 router 取代單一 router，百度表示這讓路由分數與專家實際效用的相關性提高。
- **Manifold-Constrained Hyper-Connections**：把殘差路徑擴成多條。
- **ECHO**：不另接 MTP 模組，直接重用主幹最後一層預測後續 token，同一層兼任投機解碼的草稿模型。
- **訓練**：33.5T tokens、Muon 優化器、FP8 混合精度；訓練 context 逐步拉到 128K，微調與推論支援 1M。

代價是訓練 context 只拉到 128K，1M 要靠微調與推論時延伸。Base 的六項長 context 評測贏了四項，但領先幅度比考試與程式碼類小，HELMET-Rerank 與 InfiniteBench 還輸給 DeepSeek-V4-Flash-Base。Preview 在千帆上以 FP4 專家權重搭配草稿頭（draft head）部署，官方稱輸出超過每秒 200 tokens。

### 後訓練：自建工作空間與 RSI

[Preview 公告](https://ernie.baidu.com/release/ernie-5-5-flash-preview)說明後訓練的重點：知識工作用 30 萬個工作空間、1,000 萬份參考檔案、40 多種檔案格式；影片創作建了 15 萬個環境；遊戲開發與 Blender／CAD 都有專門資料。[百度新聞稿](https://www.prnewswire.com/news-releases/baidu-unveils-latest-ernie-models-amid-broader-full-stack-ai-lineup-and-debuts-token-exchange-to-power-intelligent-organizations-302937959.html)另稱 Preview 用自家「遞迴自我改進」技術 ERNIE Evolve 優化推論效率。Preview 是後訓練中途的版本，官方明說部分能力可能還不足。

### ERNIE 5.0／5.1：彈性訓練

[ERNIE 5.0 技術文](https://ernie.baidu.com/research/posts/ernie5.0/)的核心是 Once-For-All 彈性訓練：一次預訓練同時最佳化不同深度、專家容量與 top-k 的子模型。[ERNIE 5.1](https://ernie.baidu.com/research/posts/ernie-5.1-0508-release/) 就是從這個子模型矩陣抽出來的版本，所以能用約 6% 的預訓練成本做出旗艦級模型。百度沒有公開 5.1 的確切參數量。

## 評測與競品比較

### 第三方：目前沒有

[Artificial Analysis](https://artificialanalysis.ai/models/creators/baidu) 只收錄 ERNIE 5.0 Thinking Preview 與 ERNIE 4.5 300B-A47B，沒有 ERNIE 5.5 的任何一個版本。下表全部是百度公布的數字，選型前要自己跑一輪。

### 官方：ERNIE 5.5 Flash Preview 對上同期模型

摘自 [Preview 公告附錄](https://ernie.baidu.com/release/ernie-5-5-flash-preview)。對手欄位有兩個數字時，前者引自對方官方報告、後者是百度自測；只有一個數字且無註記的是引用對方報告：

| Benchmark | ERNIE 5.5 Flash Preview | Hy4 | DeepSeek-V4.1-Flash-1017 | GLM-5.3 | Claude Opus 5.5 |
|---|---|---|---|---|---|
| Terminal-Bench 4.0 | 46.5 | 44.4／42.4 | 42.3／40.9 | 41.8／38.8 | 66.4／63.6 |
| DeepSWE v1.1 | 71.2 | 74.9 | 77.0 | 66.9 | 74.2 |
| ProgramBench（almost solved） | 29.5 | 30.0／28.5 | 29.1／27.5 | 19.0／19.0 | 65.0 |
| AutomationBench | 61.9 | 56.2／55.2 | 60.5／57.2 | 48.2／50.7 | 58.0（百度自測） |
| BrowseComp | 87.4 | 91.8（百度自測） | 80.3（百度自測） | 77.8（百度自測） | 90.8 |
| HLE（不用工具） | 46.4（純文字子集） | 46.7（百度自測、純文字子集） | 44.0（純文字子集） | 42.0（純文字子集） | 61.4 |

讀法：

- **14B 啟用跟 49B 啟用的 Hy4 同一級距，互有勝負。** Terminal-Bench 4.0 與 AutomationBench 略高於 Hy4 和 DeepSeek-V4.1-Flash-1017；DeepSWE 落後，同表的 APEX-Agents 1.1 也只有 64.2，低於 Hy4 的 77.6。
- **離閉源前沿還很遠。** Terminal-Bench 4.0 與 ProgramBench 都明顯輸 Claude Opus 5.5。
- **評測條件是百度選的。** 每項各用不同的 harness（Claude Code、mini-swe-agent、Codex 等）與裁判模型；部分項目因為模型沒有視覺，圖片要靠另一家的模型轉述。
- **跨廠商數字不一定對得上。** 同一份表引用的 Hy4 APEX-Agents 是 77.6，騰訊自己的 [Hy4 模型卡](https://huggingface.co/tencent/Hy4)寫 75.2。

### 官方：Base 對上同尺寸基礎模型

[Base 公告](https://ernie.baidu.com/release/ernie-5-5-flash-base/)用同一套 harness、prompt 與 few-shot 跑四個基礎模型：MMLU-Pro 78.4（DeepSeek-V4-Flash-Base 69.2、Hy3-preview-Base 66.9）、HumanEval+ 82.3（69.5、78.0）。長 context 六項贏四項（HELMET-RAG、HELMET-ICL、RepoQA、LongBench-v2），輸掉的是 HELMET-Rerank 56.2 與 InfiniteBench 46.5（DeepSeek-V4-Flash-Base 60.0、48.0）；中文知識 ChineseSimpleQA 73.0 也低於 DeepSeek 的 75.3。

### 閉源旗艦 ERNIE 5.1

百度公布的是排行榜名次：5 月 9 日 Arena Search 排行榜 1,223 分、全球第四、中國模型第一；官方另稱 AIME26（使用工具）99.6。沒有與 5.5 Flash 同條件的對照。

## 授權、價格與部署

### 兩份權重、兩種授權

| 權重 | 授權 | 重點條件 |
|---|---|---|
| [ERNIE 5.5 Flash Base](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) | ERNIE 5.5 Flash Base Model License Agreement v1.0 | 授權範圍排除歐盟、英國、南韓，範圍外使用、散布、展示輸出都不授權；相關產品年營收 5,000 萬美元以下可商用，但首次商用前要寄一次使用通知；超過 5,000 萬美元要先取得書面授權；準據法為香港法 |
| ERNIE 5.5 Flash Preview | 官方承諾 Apache 2.0 | 權重預定 11 月 25 日前開源 |
| ERNIE 4.5 系列 | Apache 2.0 | 無附加條件 |
| Unlimited OCR 2 | MIT | 無附加條件 |

Base 授權的「年營收」算法很寬：同一控制下的關係企業合併計算，產品若同時用了其他模型，整個產品的營收都算進去。台灣團隊不在排除名單，但面向歐盟、英國或南韓使用者的產品不能用 Base。Preview 的 Apache 2.0 權重釋出後，這些限制就不適用，前提是權重真的以那份授權發佈。

### 千帆價格

- **ERNIE 5.5 Flash Preview**：[百度新聞稿](https://www.prnewswire.com/news-releases/baidu-unveils-latest-ernie-models-amid-broader-full-stack-ai-lineup-and-debuts-token-exchange-to-power-intelligent-organizations-302937959.html)列每百萬 tokens 輸入人民幣 1 元、輸出 4 元、快取命中 0.04 元。[千帆活動頁](https://cloud.baidu.com/product/qianfan_home/model_3.html)顯示輸入分尖峰（8:00–22:00）與離峰計價，目前限時五折：尖峰 2 元降到 1 元、離峰 1 元降到 0.5 元。新聞稿另說明 OpenRouter 免費提供。
- **ERNIE-Light-DT-1.0**：輸入每百萬 tokens 8 元、快取命中 0.8 元，主打長 context 的低成本呼叫。
- **ERNIE 5.1**：官方公告的使用管道是 ERNIE 官網與百度 AI Studio，本文未整理其價格。

### 自架

Base 提供 FP8 與 BF16 safetensors，輸入要加 BOS token（tokenize 時保留 `add_special_tokens=True`）。Base 不是聊天模型，沒有 chat template，只能用 completions 方式呼叫。Preview 權重釋出前，只能透過 API 使用。

## Agent 使用與選型

- **要便宜的 agent 後端、任務偏知識工作或 Blender／CAD／遊戲開發** → ERNIE 5.5 Flash Preview。官方投入最多的就是這些場景，價格低於 Hy4；但它是中途 checkpoint，正式版前行為可能變。
- **需要看圖的 agent** → 5.5 Flash 不適合，得另接視覺模型或改用 Hy4 這類原生多模態模型。
- **自己做後訓練或比較訓練方法** → ERNIE 5.5 Flash Base，前提是不面向歐盟、英國、南韓，並先處理通知與營收門檻。
- **想要沒有附加條件的開放權重** → 等 Preview 的 Apache 2.0 權重；要立刻用就只有 ERNIE 4.5 系列。
- **長文件解析** → Unlimited OCR 2，3.34B 單卡可跑、MIT 授權。
- **中國市場的對話或搜尋產品** → ERNIE 5.1，Arena Search 排名是它最強的公開訊號。

最小的選型驗證：把同一組任務分別送 ERNIE 5.5 Flash Preview、Hy4 與 DeepSeek-V4.1-Flash-1017，比較完成率與帳單。百度表上這三者很接近，自己的任務才看得出差距；Preview 在 OpenRouter 免費期間是做這件事的好時機。

## 限制與取捨

- **沒有第三方分數。** ERNIE 5.5 的所有數字都是百度自己跑的，Artificial Analysis 沒有收錄。
- **Preview 是中途版本。** 官方說後訓練還在進行，正式版的分數與行為都可能改變。
- **純文字。** 5.0 的全模態能力沒有帶到 5.5 Flash，視覺任務要靠外部工具。
- **Base 授權有地區限制。** 歐盟、英國、南韓不在授權範圍，營收算法又把關係企業與整個產品都算進去。
- **閉源旗艦資訊少。** ERNIE 5.1 沒有公開參數量，國際通路也不如 Qwen、DeepSeek 完整。

百度這一代的賭注是「效率優先的中型開放權重」：用 14B 啟用量追上 Hy4、DeepSeek-V4.1-Flash 這一級，再把 Base 留給社群做後訓練。對外部開發者來說，ERNIE 5.5 Flash 值得排進低價 agent 後端的評測清單，但要等 Apache 2.0 權重真的釋出、也有第三方分數之後，才適合當正式選項。

## 參考資料

- [ERNIE 5.5 Flash Preview — Baidu ERNIE 官方部落格（含評測附錄）](https://ernie.baidu.com/release/ernie-5-5-flash-preview)
- [ERNIE 5.5 Flash Base — Baidu ERNIE 官方部落格](https://ernie.baidu.com/release/ernie-5-5-flash-base/)
- [baidu/ERNIE-5.5-Flash-Base — HuggingFace 模型卡](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)
- [ERNIE 5.5 Flash Base Model License Agreement — HuggingFace](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base/blob/main/LICENSE)
- [Baidu Unveils Latest ERNIE Models — 百度新聞稿（PR Newswire）](https://www.prnewswire.com/news-releases/baidu-unveils-latest-ernie-models-amid-broader-full-stack-ai-lineup-and-debuts-token-exchange-to-power-intelligent-organizations-302937959.html)
- [文心三款新模型上架百度千帆 — 百度智能雲（簡體中文）](https://cloud.baidu.com/product/qianfan_home/model_3.html)
- [ERNIE 5.1 Officially Released — Baidu ERNIE 官方部落格](https://ernie.baidu.com/research/posts/ernie-5.1-0508-release/)
- [ERNIE 5.0: A 2.4 Trillion-Parameter Unified Multimodal Foundation Model — Baidu ERNIE 官方部落格](https://ernie.baidu.com/research/posts/ernie5.0/)
- [ERNIE-5.0 Tops LMArena Text Leaderboard — Baidu ERNIE 官方部落格](https://ernie.baidu.com/research/posts/ernie-5.0-0110-release-on-lmarena/)
- [Announcing the Open Source Release of the ERNIE 4.5 Model Family — Baidu ERNIE 官方部落格](https://ernie.baidu.com/research/posts/ernie4.5/)
- [ERNIE Research 文章列表](https://ernie.baidu.com/research/)
- [baidu/Unlimited-OCR-2 — HuggingFace 模型卡](https://huggingface.co/baidu/Unlimited-OCR-2)
- [Baidu models — Artificial Analysis](https://artificialanalysis.ai/models/creators/baidu)
- [tencent/Hy4 — HuggingFace 模型卡（對照 Hy4 自報數字）](https://huggingface.co/tencent/Hy4)
- [模型卡｜ERNIE 5.5 Flash Base](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base) — 本站
- [模型卡｜Baidu Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2) — 本站
- [Tencent Hy 家族](/posts/tech/2026-11-23-ai-model-family-tencent-hy) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
