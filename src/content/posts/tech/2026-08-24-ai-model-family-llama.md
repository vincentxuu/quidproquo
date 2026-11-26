---
title: "Llama——從開源實驗到部署量最大的開放權重 LLM，以及 Meta 把開放權重移到 Muse 之後的定位"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, llama, meta, model-family-llama, open-source, moe, multimodal, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Llama 是 Meta 的開放權重 LLM 家族，生態最成熟、部署量最大。最新一代仍是 2025-04-05 發佈的 Llama 4 Scout（109B 總參數、17B 啟用、10M context）與 Maverick（400B／17B、1M context），之後沒有 Llama 5。Meta 2026 年的新模型改用 Muse 品牌：閉源的 Muse Spark、Wonder，以及開放權重的 Muse Glimmer（Apache 2.0）與 Muse Spark Open。Llama 4 授權是附條件的 Community License：7 億月活門檻、衍生模型名稱要以 Llama 開頭、多模態權利不授予歐盟的個人與公司。"
description: "Llama 模型家族完整介紹：2023→2026 演化時間線、Llama 4 的 MoE 架構與 10M context、官方評測、Llama 4 Community License 的三個條件、Scout／Maverick／Behemoth 怎麼分、第三方託管價格、Meta 轉向 Muse 之後 Llama 的定位，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 5
draft: false
glossary:
  - term: "Llama Community License"
    aliases: ["Llama 4 Community License"]
    definition: "Meta 的 Llama 授權條款——允許商用與微調，但 Llama 4 發佈當時月活超過 7 億的業者要另向 Meta 申請授權；散布時要標示「Built with Llama」，用 Llama 訓練出的衍生模型名稱要以「Llama」開頭。不是 OSI 認證的開源授權"
  - term: "Behemoth"
    definition: "Llama 4 系列的教師模型，288B 啟用、近 2T 總參數、16 個專家，用來共同蒸餾 Maverick，從未公開釋出"
  - term: "Muse"
    definition: "Meta Superintelligence Labs 自 2026 年 4 月起推出的模型家族，包含閉源的 Muse Spark、Wonder、Ember，以及開放權重的 Muse Glimmer 與 Muse Spark Open；不是 Llama 的改名"
  - term: "Llama.cpp"
    definition: "最流行的本地推論框架之一，由社群維護，讓 Llama 與其他開放權重模型能在筆電、手機上運行，是 Llama 生態的核心"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-family-llama-en)

Llama 是把開放權重 LLM 從學術玩具變成企業基礎設施的家族。2023 年 2 月的 Llama 1 開了頭，2025 年 4 月的 Llama 4 Scout 與 Maverick 帶進 MoE 與原生多模態。但從那之後 Meta 沒有再出新的 Llama：2026 年的新模型全部改用 Muse 品牌，連開放權重的 Muse Glimmer 與 Muse Spark Open 也不叫 Llama。這篇寫給手上已有 Llama 部署、或在挑開放權重模型的 Agent 開發者：讀完你能判斷 Llama 4 還適合哪些工作、授權條件會不會卡到你，以及什麼時候該轉去看 Muse 或其他家族。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族定位與版本矩陣

以 2026-11-23 Meta 在 HuggingFace `meta-llama` 組織與官方模型卡上的版本為準；最新的 Llama 世代仍是 Llama 4：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Llama 4 Scout（17B×16E） | 超長 context、單張 GPU 可跑的多模態 | 109B 總參數、17B 啟用；10M context；Int4 量化後塞進單張 H100 | Community License 權重；第三方託管 API |
| Llama 4 Maverick（17B×128E） | 一般多模態、對話與圖像理解 | 400B 總參數、17B 啟用；1M context；FP8 權重塞進單台 H100 主機 | Community License 權重；第三方託管 API |
| Llama 3.3 70B／3.2 1B、3B | 舊世代密集模型、端側輕量 | 純文字；128K context | Community License 權重 |
| Muse Glimmer／Muse Spark Open（另一家族） | Meta 2026 年的開放權重新模型 | 不屬於 Llama 世代，授權也不同 | 見 [Muse Spark 家族](/posts/tech/2026-09-19-ai-model-family-muse-spark) |

Llama 的託管推論主要透過 OpenRouter 這類聚合平台與雲端供應商，或自架。Behemoth 從未釋出，型號名出現在第三方目錄上不代表有可下載權重。

### 兩條產品線：Llama 開放權重生態，Muse 接手新模型
看懂 Llama 在 2026 年的位置，關鍵是把 Meta 的模型拆成兩條線：

**Llama 開放權重線**（HuggingFace／Ollama／llama.cpp）：從 Llama 1 到 Llama 4 的各代檢查點都可下載、微調、自架。Ollama、vLLM、llama.cpp 全支援，微調社群長期把它當基底模型首選，幾乎所有本地 AI 桌面應用預設就能跑。Meta 的開發者網站仍保留 Llama 4、3、2 的文件、授權與使用政策，但 `llama-models` 倉庫的模型目錄停在 `llama4`。

**Muse 線**（Meta Superintelligence Labs）：2026-04-08 的 Muse Spark 是第一個，Meta 在公告中說新的預訓練堆疊用「比我們的上一代模型 Llama 4 Maverick 少一個數量級以上的算力」就能達到同樣能力。之後的 Muse Spark 1.x、Wonder 是閉源；8 月的 Muse Glimmer（30B，Apache 2.0）與 10 月的 Muse Spark Open（816B／42B，Muse Model License）則是開放權重。Meta 沒有正式宣布 Llama 停產，發言人只說「現有的 Llama 模型會繼續以開源方式提供」。

所以實務上的判斷是：Llama 4 是穩定、生態最完整的舊世代；Meta 的新能力都在 Muse，要看新東西就轉去 [Muse Spark 家族](/posts/tech/2026-09-19-ai-model-family-muse-spark)。

### 子線與生態系
| 子線 | 代表模型 | 狀態（2026-11） |
|---|---|---|
| 通用主線 | Llama 3.1／3.3 → Llama 4 Scout／Maverick | 開放權重，Community License；Llama 4 後沒有新世代 |
| Code Llama | Code Llama 7B–70B | 已停止獨立迭代，能力併入主線 |
| 視覺語言 | Llama 3.2 Vision 11B／90B → Llama 4 原生多模態 | 視覺變成主線天生能力 |
| 輕量端側 | Llama 3.2 1B／3B | 手機、邊緣裝置 |
| 安全工具 | Llama Guard 4、Prompt Guard 2（Purple Llama） | 2025 年 4 月後沒有新版本 |

兩個趨勢：

**能力往主線收編。** Code Llama 停止獨立迭代，視覺則用早期融合變成主線的天生能力——和 Qwen、DeepSeek 收編子線的劇本相同。

**生態滲透率是隱性護城河。** Llama 真正的護城河不是單一模型，而是「哪裡都能跑」。這個優勢至今仍在，也是 Llama 4 停更一年半後還值得寫的原因；Muse Spark Open 發佈當天就支援 llama.cpp、vLLM、SGLang 等同一套工具鏈，代表這份生態資產被 Muse 繼承，而不是消失。

## 家族演化

### 家族演化時間線
| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| Llama 1 | 2023-02 | 7B／13B／33B／65B，研究授權 | 開放權重第一次接近商用品質，帶動整個開源生態 |
| Llama 2 | 2023-07 | 7B／13B／70B，開放商用（附月活條款） | 企業第一次能合法把開放權重模型放進產品 |
| Code Llama | 2023-08 | 程式碼專用子線 | 開源 coding 模型有了官方基底 |
| Llama 3 | 2024-04 | 8B／70B，8K context | 小尺寸品質大幅提升，8B 成為本地部署標配 |
| Llama 3.1 | 2024-07 | 405B，context 擴到 128K，工具使用 | 首個 400B 級開放權重模型，自架前沿品質變得可行 |
| Llama 3.2 | 2024-09 | 1B／3B 純文字、11B／90B 視覺 | 端側與多模態各有官方選項 |
| Llama 3.3 | 2024-12 | 70B，接近 405B 品質 | 用 70B 的成本拿到大模型品質 |
| Llama 4 Scout／Maverick | 2025-04-05 | MoE、原生多模態；Scout 10M context | 目前的 Llama 選型基準，見下方各節 |
| Muse Spark（閉源） | 2026-04-08 | MSL 第一個模型，不釋出權重 | Meta 的旗艦離開 Llama 品牌，Llama 4 不再是 Meta 的最新模型（[Muse Spark 1.2 模型卡](/posts/daily/2026-08-24-model-meta-muse-spark-1-2)）|
| Muse Glimmer | 2026-08-10 | 30B，Apache 2.0 | Meta 恢復釋出開放權重，但用 Muse 名稱與更寬鬆的授權（[模型卡](/posts/daily/2026-08-17-model-meta-muse-glimmer)）|
| Muse Wonder（閉源） | 2026-10-12 | MSL 首款前沿模型，$4／$20 | Meta 的最強模型對齊閉源旗艦價位（[模型卡](/posts/daily/2026-10-12-model-meta-muse-wonder)）|
| Muse Spark Open | 2026-10-15 | 816B／42B 開放權重，Muse Model License | Meta 的大型開放權重從 Llama 4 Maverick 換成 Spark Open（[模型卡](/posts/daily/2026-10-16-model-meta-muse-spark-open)）|

Llama 的演化主線是「從小模型到大模型、從純文字到多模態、從研究授權到附條件商用」。Llama 4 是這條線目前的終點；之後 Meta 的開放權重與閉源模型都在 Muse 底下發展。

## 架構與訓練取捨

### 架構：Llama 4 的三個關鍵設計
#### MoE：每次只啟動 17B

Llama 4 是 Meta 第一個採用 Mixture-of-Experts 的家族。官方模型卡的規格：

```
Scout：    109B 總參數，17B 啟用，16 個專家，預訓練約 40T tokens
Maverick： 400B 總參數，17B 啟用，128 個專家，預訓練約 22T tokens
知識截止：  2024 年 8 月
```

所有參數都在記憶體裡，但每個 token 只活化一小部分。Meta 的發佈文說 Scout 用 Int4 量化可塞進單張 H100，Maverick 的 FP8 權重可塞進單台 H100 主機。Maverick 除了 128 個路由專家，還有一個每個 token 都會經過的共享專家。它是由 Behemoth（288B 啟用、近 2T 總參數）在預訓練期間共同蒸餾出來的。

#### 原生多模態：早期融合

Llama 4 用早期融合（early fusion）訓練——預訓練語料就混入文字和圖片，而不是訓好文字模型再外掛視覺 adapter。模型卡寫明圖像理解測試到最多 5 張輸入圖片，超過要自行測試。

#### 10M Context：Scout 的殺手鐧

Scout 的 10M token context 讓單次請求能塞進完整程式碼庫或整本書。但 10M 是模型規格上限，實際可用長度取決於 serving stack 與 KV cache 記憶體：第三方託管通常只開到一部分，例如 OpenRouter 上 Scout 的 context 是 1,310,720、Maverick 是 524,288。

#### 語言

模型卡列出 12 種正式支援語言：阿拉伯語、英語、法語、德語、印地語、印尼語、義大利語、葡萄牙語、西班牙語、他加祿語、泰語、越南語。預訓練涵蓋 200 種語言，其他語言可以微調，但要自行負責安全性。中文不在正式支援清單裡。

## 評測與競品比較

### 官方數字：Llama 4 對前代
以下是 Llama 4 模型卡的指令微調版結果（bf16），對照組是 Meta 自己的前代模型：

| Benchmark | Llama 3.3 70B | Llama 3.1 405B | Llama 4 Scout | Llama 4 Maverick |
|---|---|---|---|---|
| MMLU Pro | 68.9 | 73.4 | 74.3 | 80.5 |
| GPQA Diamond | 50.5 | 49.0 | 57.2 | 69.8 |
| LiveCodeBench（2024/10–2025/02） | 33.3 | 27.7 | 32.8 | 43.4 |
| MMMU（圖像推理） | 不支援 | 不支援 | 69.4 | 73.4 |
| ChartQA | 不支援 | 不支援 | 88.8 | 90.0 |
| DocVQA | 不支援 | 不支援 | 94.4 | 94.4 |

這些數字是 2025 年 4 月的評測，題目與比較對象都停在當時。Meta 發佈文的說法是 Maverick 在當時贏過 GPT-4o 與 Gemini 2.0 Flash、推理與 coding 和 DeepSeek V3 相當。拿它跟 2026 年的 agentic coding 模型比，要用同一份第三方評測重跑，不能拿這張表直接對照。

### 跟競品的位置
- **對上 Muse（同一家公司）**：Muse Glimmer 30B 是 Apache 2.0、定位本地與 agent 使用的新一代小模型；Muse Spark Open 是 Meta 現在的大型開放權重旗艦。要 Meta 的新能力，看 [Muse Spark 家族](/posts/tech/2026-09-19-ai-model-family-muse-spark)
- **對上 DeepSeek 與 GLM**：兩家的開放權重都已換到 2026 年世代，agentic coding 遠超 Llama 4；DeepSeek V4.1 Flash 是 MIT，GLM-5.3-Flash 是 MIT。詳見 [DeepSeek 家族](/posts/tech/2026-08-24-ai-model-family-deepseek)、[GLM 家族](/posts/tech/2026-08-24-ai-model-family-glm)
- **對上 Qwen**：尺寸光譜更廣、多數模型是 Apache 2.0，中文也比 Llama 4 好。詳見 [Qwen 家族](/posts/tech/2026-08-24-ai-model-family-qwen)
- **對上閉源（Claude／GPT／Gemini）**：差距已經是好幾個世代；Llama 4 剩下的優勢是可自架、價格低與生態

Llama 4 在 2026 年 11 月的獨佔區間只剩兩個：Scout 的 10M context 規格，以及「任何推論工具都支援」的成熟度。

## 授權、價格與部署

### 授權陷阱：可下載不等於沒有條件
Llama 4 使用 **Llama 4 Community License**（生效日 2025-04-05），不是 OSI 認證的開源授權。主要條件：

- **7 億月活門檻**：Llama 4 發佈當時（前一個月）月活超過 7 億的業者，要另向 Meta 申請授權，Meta 有權決定是否核准
- **標示與命名**：散布 Llama 或含 Llama 的產品要附上授權並明顯標示「Built with Llama」；用 Llama 或它的輸出訓練出的模型若對外散布，名稱要以「Llama」開頭
- **歐盟限制**：使用政策寫明，Llama 4 內含的多模態模型不授予住在歐盟的個人或主要營業地在歐盟的公司；只是使用相關產品的終端使用者不受影響
- **可接受使用政策**：另有一份使用政策限制用途

對大多數非歐盟企業來說，這跟開源差不多；但歐盟公司要自己部署 Scout 或 Maverick，這條就是硬限制。和 Apache 2.0（Qwen 多數模型、Muse Glimmer）或 MIT（DeepSeek、GLM-5.3-Flash）相比，「可下載權重」不等於「可自由商用」。

### Scout、Maverick、Behemoth 怎麼分
| 項目 | Llama 4 Scout | Llama 4 Maverick | Llama 4 Behemoth |
|---|---|---|---|
| 總參數 | 109B | 400B | 近 2T |
| 啟用參數 | 17B | 17B | 288B |
| 專家數 | 16 | 128 | 16 |
| Context | 10M | 1M | — |
| 多模態 | ✓ | ✓ | ✓ |
| 狀態 | 開放權重 | 開放權重（BF16／FP8） | 從未釋出 |
| 定位 | 超長 context、單 GPU 部署 | 一般多模態 | 教師模型（蒸餾用）|

### 第三方託管價格
OpenRouter 模型目錄（2026-11-23 讀取）每 1M tokens 的價格：

| 模型 | Input | Output | 開放的 context |
|---|---|---|---|
| Llama 4 Scout | $0.10 | $0.30 | 1,310,720 |
| Llama 4 Maverick | $0.35 | $1.00 | 524,288 |
| Llama 3.3 70B | $0.71 | $0.71 | 131,072 |

各家託管價差不小，Artificial Analysis 列的 Maverick 中位價是 $0.25／$0.97；要長 context 的話，先確認供應商實際開放多少，而不是看模型規格的 10M。

## Agent 使用與選型

### 對 Agent 開發者的意義
- **已經有 Llama 部署、運作良好** → 不必急著換。Llama 4 權重與授權都還在，工具鏈支援最完整；但要知道它不會再有更新
- **超長文件一次讀完** → Llama 4 Scout 的 10M context 仍是規格上最長，但託管服務通常只開一部分，要長 context 多半得自架
- **資料不能上雲、要在單張 GPU 上跑多模態** → Scout（Int4 量化塞進單張 H100）
- **新專案、要 Meta 的開放權重** → 先看 Muse Glimmer（Apache 2.0、30B）或 Muse Spark Open，再決定要不要用 Llama 4
- **前沿 coding agent、多步驟自主任務** → Llama 4 已落後好幾代，改選 DeepSeek、GLM、Qwen 或閉源旗艦
- **歐盟公司、或月活接近 7 億的平台** → Llama 4 的多模態權利與月活條款會直接卡住，改用 Apache 2.0 或 MIT 的模型
- **中文為主的應用** → 中文不在 Llama 4 的正式支援語言裡，Qwen、GLM、DeepSeek 更合適
- **引用 benchmark 時** → 寫清楚 Scout 還是 Maverick、指令版還是基礎版；Behemoth 的數字是預覽，沒有可用權重

## 限制與取捨

Llama 4 的官方評測停在 2025 年 4 月，對照組也是當時的模型；Meta 沒有新的 Llama 版本，也沒有說明 Llama 線的長期計畫。Community License 的月活門檻、命名規則與歐盟多模態限制，讓它在授權確定性上輸給 Apache 2.0 與 MIT 模型。Scout 的 10M context 是規格，不是第三方託管的實際上限。可下載 Llama 權重也不代表能取得 Muse 的能力：兩者是不同的模型、不同的授權。

### 整體來說
Llama 的故事是「開源如何改變一個產業」。Meta 用它證明開放權重可以達到商業品質，留下的生態（llama.cpp 幾乎成了本地推論的代名詞）至今無人能及。但到 2026 年底，Llama 4 已經是舊世代：Meta 的新模型、包括新的開放權重，都換成 Muse 名稱發佈。對 Agent 開發者來說，Llama 4 仍是穩定、到處都能跑的選項；要新能力、或要更乾淨的授權，就往 Muse、DeepSeek、GLM、Qwen 看。

## 更新紀錄

- 2026-11-23：依 Meta 官方模型卡、授權全文與 2026-11-23 的第三方託管價格重寫各節。版本矩陣註明 Llama 4 仍是最新的 Llama 世代，並把 Meta 2026 年的新模型（Muse Spark、Glimmer、Wonder、Spark Open）放進時間線、連到每日模型卡與 Muse Spark 家族篇；評測改用 Llama 4 模型卡的官方數字；授權補上衍生模型命名與歐盟多模態限制；價格改為 OpenRouter 目錄價。修正錯誤：開頭把 Llama 4 寫成 2026 年 4 月的模型（實為 2025-04-05）；Llama 2 不是 MoE；Llama 3 原始 context 是 8K，128K 從 3.1 開始；Llama 4 正式支援 12 種語言，200 種是預訓練涵蓋範圍；移除與官方評測不符的「SWE-bench 落後約 3 個百分點」與 Claude、DeepSeek 對照數字；舊價格表（Scout $0.08 等）改為現行託管價。
- 2026-10-11：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [The Llama 4 herd — Meta AI 官方部落格](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Llama 4 Model Card — meta-llama/llama-models](https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md)
- [Llama 4 Community License Agreement](https://github.com/meta-llama/llama-models/blob/main/models/llama4/LICENSE)
- [Llama 4 Acceptable Use Policy](https://github.com/meta-llama/llama-models/blob/main/models/llama4/USE_POLICY.md)
- [Llama 4 Scout and Maverick on Hugging Face](https://huggingface.co/blog/llama4-release)
- [Introducing Muse Spark — Meta AI](https://ai.meta.com/blog/introducing-muse-spark-msl)
- [Introducing Muse Spark Open — Meta AI Research](https://research.meta.ai/blog/muse-spark-open)
- [Goodbye, Llama? Meta launches new proprietary AI model Muse Spark — VentureBeat](https://venturebeat.com/technology/goodbye-llama-meta-launches-new-proprietary-ai-model-muse-spark-first-since)
- [OpenRouter Models API](https://openrouter.ai/api/v1/models)
- [Llama 4 Maverick — Artificial Analysis](https://artificialanalysis.ai/models/llama-4-maverick)
- [Llama.cpp — 本地推理框架](https://github.com/ggerganov/llama.cpp)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
