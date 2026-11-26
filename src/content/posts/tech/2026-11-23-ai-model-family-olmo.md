---
title: "Ai2 OLMo——權重、訓練資料與程式碼全公開的 Olmo 3.1，以及 Molmo 2、MolmoWeb 多模態子線"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, open-source, olmo, allen-ai, model-family-olmo, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Ai2 的 OLMo 目前在架的是 Olmo 3.1 32B Think／Instruct 與 Olmo 3 7B：稠密架構、65K context、只支援英文，權重 Apache 2.0、訓練資料 ODC-BY，連中間 checkpoint 都公開。它的強項是可稽核與可重現，Artificial Analysis 開放度指數 89 分並列第一；代價是能力落後同尺寸的 Qwen 3，而且目前沒有託管 API，要自架。"
description: "Ai2 OLMo 模型家族介紹：Olmo 3.1 32B 與 Olmo 3 7B 的規格、Dolma 3／Dolci 資料與 model flow、Olmo Hybrid 研究線、官方評測與第三方開放度分數、Apache 2.0 與 ODC-BY 授權、自架部署，以及 Molmo 2、MolmoWeb、SERA 等子線的選型。"
series:
  name: "AI 模型家族"
  order: 36
draft: false
glossary:
  - term: "Model flow"
    definition: "Ai2 對 Olmo 3 釋出方式的稱呼：不只給最終權重，而是公開預訓練、中期訓練、長 context 擴充、SFT、DPO、RLVR 每個階段的 checkpoint 與資料，讓使用者能從任一階段分岔重訓"
  - term: "RLVR（Reinforcement Learning with Verifiable Rewards）"
    aliases: ["RLVR"]
    definition: "用可自動驗證的獎勵（數學答案對錯、程式測試是否通過、指令格式是否符合）做強化學習；Ai2 在 Tülu 3 提出這個名稱，之後的 OLMo 後訓練都沿用"
  - term: "OlmoTrace"
    definition: "Ai2 的追溯工具：把模型輸出追溯回訓練資料中可能的來源文件，可在 Ai2 Playground 使用"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-olmo-en)

OLMo 是非營利研究機構 Allen Institute for AI（Ai2）的語言模型家族。它和本系列其他開放權重模型最大的不同，是連訓練資料、資料處理工具、訓練程式碼、中間 checkpoint 與評測工具都一起公開。這篇寫給兩種讀者：需要能稽核、能重現的模型的研究者與受監管產業團隊，以及想知道「完全開放」要付出多少能力代價的 Agent 開發者。

2026 年 11 月的局面是：文字主線仍是 2025 年 11 月的 Olmo 3 與 12 月的 Olmo 3.1，旗艦是 Olmo 3.1 32B Think 與 32B Instruct。Ai2 在 10 月表示下一代 Olmo 正在預訓練，採混合式 MoE 架構，尚未公布發佈時間。多模態子線 Molmo 2、網頁 agent MolmoWeb 和機器人模型 MolmoAct 2 則在 2025 年底到 2026 年上半年陸續推出。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

OLMo 的定位是「研究用的完全開放模型」：能力目標是同尺寸開放權重模型的水準，真正的賣點是每一層都能檢查。下表是目前建議選用的版本，參數量取自 Hugging Face 上的 safetensors 統計：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Olmo 3.1 32B Think（`allenai/Olmo-3.1-32B-Think`） | 目前旗艦，推理 | 32.2B 稠密、65,536 context、輸出思考過程；比 Olmo 3 32B Think 多跑 21 天 RL | 開放權重，Apache 2.0 |
| Olmo 3.1 32B Instruct（`allenai/Olmo-3.1-32B-Instruct`） | 對話與工具使用 | 同一個 32B 底座，不輸出長推理，回應較短 | 開放權重，Apache 2.0 |
| Olmo 3 7B Think／Instruct | 小尺寸 | 7.3B 稠密、65,536 context；適合筆電或單張消費級 GPU | 開放權重，Apache 2.0 |
| Olmo 3 Base（7B、32B）與 RL Zero 7B | 研究起點 | 預訓練權重與各階段 checkpoint；RL Zero 是直接從 Base 做 RLVR 的對照組 | 開放權重，Apache 2.0 |
| Olmo Hybrid 7B | 架構研究 | 75% 層改用 Gated DeltaNet 的混合式 RNN；只到 SFT／DPO，沒有 RL 版 | 開放權重，Apache 2.0 |

三件事先知道：

- **只有英文。** 所有 Olmo 3 模型卡的語言欄都只寫 English，知識截止在 2024 年 12 月。
- **沒有託管 API。** [OpenRouter](https://openrouter.ai/allenai/olmo-3.1-32b-think) 保留了 Olmo 3／3.1 的模型頁，但目前沒有任何供應商端點；Artificial Analysis 也以「沒有公開 API」為由沒有評它的 Intelligence Index。要用就自架，或在 [Ai2 Playground](https://playground.allenai.org/) 試用。
- **資料也是一等公民。** 預訓練語料 Dolma 3 與後訓練資料 Dolci 都放在 Hugging Face，授權是 ODC-BY；權重是 Apache 2.0。兩種授權的差異在「授權、價格與部署」一節。

### 子線與生態

Ai2 在 [Hugging Face 的 `allenai` 組織](https://huggingface.co/allenai)下還有多條以 Olmo／Molmo 命名的子線。選用前要先看底座：有些底座是 Olmo（完全開放），有些是 Qwen（只有權重開放）。

| 子線 | 用途 | 語言模型底座 | 授權 |
|---|---|---|---|
| [Molmo 2](https://allenai.org/blog/molmo2)（4B、8B、O-7B） | 圖片、多圖、影片理解，指點（pointing）與追蹤 | 8B 用 Qwen3-8B、4B 用 Qwen3-4B；只有 Molmo 2-O 7B 用 Olmo 3 7B Instruct | Apache 2.0，但訓練資料含限學術與非商業研究的第三方資料集 |
| [MolmoWeb](https://allenai.org/blog/molmoweb)（4B、8B） | 看截圖操作瀏覽器的網頁 agent | Molmo 2 架構（8B 為 Qwen3-8B） | Apache 2.0 |
| [MolmoAct 2](https://allenai.org/blog/molmoact2) | 機器人視覺語言動作（VLA）模型 | Molmo 2-ER（Molmo 2 的具身推理版） | 模型卡未標示 |
| [SERA](https://huggingface.co/allenai/SERA-32B)（8B、32B） | 程式碼 agent，附可接 Claude Code 的 CLI | Qwen 3 | Apache 2.0 |
| [olmOCR 2](https://huggingface.co/allenai/olmOCR-2-7B-1025) | PDF／掃描文件轉文字 | Qwen2.5-VL-7B | Apache 2.0 |
| [Tülu 3](https://allenai.org/blog/tulu-3) | 開放的後訓練配方（SFT→DPO→RLVR） | Llama 3.1 | Llama 3.1 授權 |

OlmoEarth（衛星影像嵌入）、Bolmo（位元組層級模型）、ACE2（氣候模擬）也出自 Ai2，但任務跟 Agent 選型距離較遠，本篇不展開。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| OLMo | 2024-02 | 第一個連訓練資料（Dolma）、訓練程式碼與評測一起公開的 Ai2 語言模型 | — |
| OLMoE | 2024-09 | 7B 總參數、1B 啟用的 MoE，完全開放的 MoE 第一次站上效能／尺寸前緣 | — |
| Molmo | 2024-09 | 第一代視覺語言模型與開放圖文資料 PixMo，開創圖片指點能力 | — |
| Tülu 3 | 2024-11 | 把後訓練配方整套公開並提出 RLVR；底座是 Llama 3.1，之後成為 OLMo 的後訓練骨架 | — |
| OLMo 2 | 2024-11（7B、13B）／2025-03（32B） | 32B 版是 Ai2 自稱第一個在學術測驗組合上勝過 GPT-3.5 Turbo 與 GPT-4o mini 的完全開放模型 | — |
| Olmo 3 | 2025-11-20 | Olmo 第一個 Think 推理模型、第一次支援長 context（65K），改以「model flow」公開所有階段 | [Olmo 3 介紹](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm) |
| Olmo 3.1 | 2025-12-12 | 32B Think 延長 RL，新增 32B Instruct；目前的旗艦 | — |
| Molmo 2 | 2025-12-11 | 從圖片擴到影片與多圖，加上影片追蹤 | — |
| Olmo Hybrid | 2026-03-05 | 7B 混合式 RNN，Ai2 用受控實驗證明混合架構的資料效率約為 Olmo 3 的兩倍 | — |
| MolmoWeb | 2026-03-24 | 完全開放訓練資料的網頁 agent，不靠蒸餾專有 agent | — |
| MolmoAct 2 | 2026-05-05 | 機器人模型改用 Molmo 2-ER 底座，動作推論快到約 180 ms | — |

兩年來的主軸是「公開的範圍越來越大」：從權重加資料，到後訓練配方（Tülu 3），再到每個訓練階段的 checkpoint（Olmo 3 的 model flow）。另一條線是規模：OLMo 2 的 32B 是第一個大尺寸版本，Olmo 3 起 32B 成為主力，下一代則要跳到 MoE。Olmo 3 32B Think 已被 3.1 取代，它的分數保留在下方評測表當對照；Olmo 3 的資料與 model flow 細節見本站[〈全透明的 LLM 怎麼做〉](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining)。

## 架構與訓練取捨

### Olmo 3：保守的稠密 Transformer

[Olmo 3 技術報告](https://arxiv.org/abs/2512.13961)與[模型卡](https://huggingface.co/allenai/Olmo-3-1125-32B)列出的架構很保守：

- **稠密 decoder-only Transformer。** 7B 是 32 層、32 個 Q head 與 32 個 KV head；32B 是 64 層、40 個 Q head 與 8 個 KV head（GQA）。
- **滑動視窗注意力。** 每 4 層有 3 層只看前 4,096 個 token，最後一層一定是全注意力。預訓練與中期訓練的 context 是 8,192，長 context 擴充階段只對全注意力層套 YaRN，最後支援到 65,536。
- **三段預訓練。** 第一段在 Dolma 3 Mix 上大量訓練，這份約 5.9 兆 token 的混合取自約 9.3 兆 token 的 Dolma 3 資料池。中期訓練用 Dolmino，從 2.2 兆 token 的資料池取 1,000 億 token 的數學、程式、閱讀理解與推理軌跡。最後用 Longmino 擴充 context，從 6,390 億 token 的長文件池取約 500 億 token。模型卡列的實際訓練量是 7B 5.93 兆、32B 5.50 兆 token。
- **三段後訓練。** 每條路線都是 SFT → DPO → RLVR，資料集統稱 Dolci。Think 路線學長推理，Instruct 路線輸出較短、偏重對話與工具呼叫，RL Zero 路線跳過 SFT 直接從 Base 做 RLVR，給研究者當對照。

這套設計的取捨是：沒有 MoE、沒有多模態、context 只到 65K，換來的是一個容易研究、容易重現的乾淨基線。Ai2 在[部落格](https://allenai.org/blog/olmo3)說明選 32B 的理由：夠大到有競爭力，又小到多數研究團隊能微調與部署。

### 「完全開放」實際公開了什麼

[Olmo 3 發佈文](https://allenai.org/blog/olmo3)列出的公開項目，可以分成四層：

- **權重與 checkpoint**：Base、中期訓練後、長 context 擴充後，以及每條後訓練路線的 SFT、DPO、RLVR checkpoint。在 Hugging Face 用 `revision` 參數（例如 `stage1-step10000`）就能載入中間版本。
- **資料**：Dolma 3 各階段的混合（從數十億到 6 兆 token 不等）與 Dolci 後訓練資料集。
- **程式碼**：預訓練框架 OLMo-core、後訓練 Open Instruct、資料清理 datamap-rs、去重 duplodocus、評測 OLMES、去除測試集汙染的 decon。
- **追溯工具**：OlmoTrace 即時把模型輸出追溯回訓練資料，可在 Ai2 Playground 直接使用。

這也是 Olmo 能做到其他開放權重模型做不到的事：你可以在中期訓練階段換成自己的領域資料重訓，或在 RLVR 前分岔，用自己的獎勵函數重跑後訓練。

### Olmo Hybrid 與下一代

[Olmo Hybrid](https://allenai.org/blog/olmohybrid) 把 Olmo 3 7B 的滑動視窗注意力層換成 Gated DeltaNet，這是一種可平行訓練的線性 RNN。每 3 層 DeltaNet 配 1 層注意力交錯排列，其餘沿用 Olmo 3 的配方。Ai2 的受控比較結論是：在 MMLU 上達到同樣準確率少用 49% 的 token；64K context 的 RULER 從 Olmo 3 7B 的 70.9 提升到 85.0（搭配 DRoPE）。訓練量的寫法有兩種：[模型卡](https://huggingface.co/allenai/Olmo-Hybrid-7B)規格表寫 5.5 兆 token，部落格寫 6 兆；本文依模型卡。

這條線目前是研究成果，不是產品：只釋出 Base、Think SFT 與 Instruct SFT／DPO，沒有經過 RLVR 的最終版，而且要 transformers 5.3.0 以上。它的意義在於預告下一代。Ai2 在 [COLM 2026 回顧](https://allenai.org/blog/colm-2026-recap)說下一個 Olmo 正在預訓練，採混合式 MoE 架構；[Olmo-core 3](https://allenai.org/blog/olmocore3) 則是為它準備的 MoE 訓練框架，目標是最大的資料集與最長的 context。

## 評測與競品比較

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/olmo-3-1-32b-think) 沒有 Olmo 3.1 的 Intelligence Index 分數，理由是沒有公開 API 可以測。它另有一個[開放度指數（Openness Index）](https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index)，評權重、授權、資料與方法揭露：Olmo 3.1 32B Think／Instruct、Olmo 3 7B 都是 89 分，與 Swiss AI 的 Apertus、MBZUAI 的 K2-V2 並列第一。沒拿到滿分的原因是資料授權只得 1 分（可商用但須標示來源），對應 ODC-BY 的署名要求。以 Qwen3-8B 為底座的 Molmo 2 8B 只有 72 分，差別就在底座的資料沒有公開。

換句話說，第三方能確認的是「它有多開放」，不是「它有多強」。下面的能力數字都是 Ai2 自報。

### 官方自報：Olmo 3.1 32B Think

以下摘自 [Olmo 3.1 32B Think 模型卡](https://huggingface.co/allenai/Olmo-3.1-32B-Think)，全部是 Ai2 自己跑的數字，推薦設定為 temperature 0.6、top_p 0.95、最多 32,768 個輸出 token：

| Benchmark | Olmo 3 32B Think | Olmo 3.1 32B Think | Qwen 3 32B | DeepSeek-R1-Distill-Qwen-32B |
|---|---|---|---|---|
| AIME 2025 | 72.5 | 78.1 | 70.9 | 56.3 |
| OMEGA | 50.8 | 53.4 | 47.7 | 38.9 |
| ZebraLogic | 76.0 | 80.1 | 88.3 | 69.4 |
| LiveCodeBench v3 | 83.5 | 83.3 | 90.2 | 79.5 |
| IFEval | 89.0 | 93.8 | 86.5 | 78.7 |
| IFBench | 47.6 | 68.1 | 37.3 | 23.8 |
| MMLU | 85.4 | 86.4 | 88.8 | 88.0 |
| GPQA | 58.1 | 57.5 | 67.3 | 61.8 |

讀法：

- **3.1 的進步集中在數學與指令遵循。** 延長 RL 讓 AIME 2025 提升 5.6 分、IFBench 提升 20.5 分，GPQA 與 LiveCodeBench 則持平。
- **知識與程式仍落後 Qwen 3 32B。** GPQA 差約 10 分、LiveCodeBench 差約 7 分。Ai2 自己的說法是「縮小差距」，而且訓練 token 約只有 Qwen 3 的六分之一。
- **對照組停在 2025 年。** 模型卡比較的是 Qwen 3、Gemma 3 這一代，沒有 2026 年的新模型；拿來和現在的開放權重前沿比，差距只會更大。

### 官方自報：Olmo 3.1 32B Instruct 的工具呼叫

Agent 開發者最在意的工具呼叫，模型卡沒列，要看[技術報告](https://arxiv.org/abs/2512.13961)的 Table 25。Olmo 3.1 32B Instruct 的 BFCL 是 58.8，Qwen 3 32B（不推理）是 63.1；在需要查文獻的 LitQA2 上，Olmo 3.1 的 55.6 反而高於 Qwen 3 32B 的 46.7。7B 這一級差距更明顯：Olmo 3 7B Instruct 的 BFCL 49.8，Qwen 3 8B 是 60.2。

### Molmo 2 與 MolmoWeb

[Molmo 2 模型卡](https://huggingface.co/allenai/Molmo2-8B)用 15 個學術測驗的平均分比較：Molmo 2 8B 63.1、4B 62.8、完全開放的 Molmo 2-O 7B 59.7；同尺寸的 Qwen3-VL-8B 是 59.5，GPT-5 是 70.6。[MolmoWeb 8B](https://huggingface.co/allenai/MolmoWeb-8B) 在 WebVoyager 上單次成功率 78.2%，取 4 次最佳可到 94.7%；較難的 Online-Mind2Web 則是 35.3%（4 次 60.5%）。兩者都是 Ai2 自報。

## 授權、價格與部署

### 三層條款：權重、資料、使用準則

| 層 | 條款 | 實際影響 |
|---|---|---|
| 權重與程式碼 | Apache 2.0（寫在各模型卡） | 可商用、微調、再散布，保留授權與修改聲明即可 |
| 訓練資料（Dolma 3、Dolci） | [ODC-BY](https://huggingface.co/datasets/allenai/dolma3_pool)（Hugging Face 資料集標示） | 可商用，但散布資料或衍生資料要標示來源；資料內容本身的第三方權利另計 |
| 使用準則 | [Ai2 Responsible Use Guidelines](https://allenai.org/responsible-use) | 模型卡寫「供研究與教育使用」；準則對純研究用途不設限，研究以外列出禁止用途（騷擾、詐騙、惡意程式、政治操弄等） |

和本系列其他「開源」模型相比，Olmo 的權重授權沒有月活或營收門檻，也沒有地區排除。要注意的是子線。Tülu 3 的權重衍生自 Llama 3.1，沿用 Llama 3.1 授權。Molmo 2 8B、MolmoWeb、SERA 的權重雖是 Apache 2.0，底座卻是 Qwen 系列，Ai2 無法公開 Qwen 的預訓練資料。Molmo 2 模型卡另外註明，它的訓練資料包含「僅限學術與非商業研究使用」的第三方資料集，要求使用者自行檢查來源；商用前要先過這一關。授權的一般判讀見[開源 AI 授權指南](/posts/ai/2026-08-26-open-source-ai-licensing-guide)。

### 價格與託管

目前沒有可引用的 API 價格。OpenRouter 上 Olmo 3／3.1 與 Molmo 2 的模型頁還在，但供應商端點是空的；Hugging Face 的推論供應商目前也沒有可用的 Olmo 端點。Ai2 在 Olmo 3.1 發佈時寫「可透過推論合作夥伴的 API 使用」，選型時要以當下的供應商清單為準，不要假設有現成端點。

### 自架

- **框架**：Olmo 3／3.1 需要 transformers 4.57.0 以上，模型卡附 vLLM 範例；Olmo Hybrid 需要 transformers 5.3.0 以上。
- **記憶體**：32B 是稠密模型，BF16 權重約 64 GB，單張 80 GB GPU 放得下，但留給 context 的空間有限。社群已有 bartowski、unsloth 的 GGUF 與 LM Studio 的 MLX 量化版，可以在大記憶體的 Mac 或消費級 GPU 上跑。
- **微調**：模型卡附 OLMo-core 的 8 GPU 訓練指令，也可以從任一中間 checkpoint 開始。

## Agent 使用與選型

- **需要稽核訓練資料或重現訓練過程**（學術研究、受監管產業、資料汙染調查）→ Olmo 3.1 32B Think 或 Instruct。這是 Olmo 的核心用途，其他開放權重模型給不了這一層。
- **要在自己的領域資料上重做中期訓練或 RL** → 從 Olmo 3 Base 或中間 checkpoint 分岔，比只能做最後一層微調的模型多了很多選擇。
- **一般工具呼叫 agent，不要求資料公開** → 優先評估 [Qwen 3](/posts/tech/2026-08-24-ai-model-family-qwen) 這類開放權重模型；Olmo 3.1 32B Instruct 的 BFCL 落後約 4 分。
- **在乎開放度但想要更大的模型** → [NVIDIA Nemotron](/posts/tech/2026-10-10-ai-model-family-nemotron) 多數型號的開放度指數是 83 分，僅次於 89 分那一批，而且有 120B、550B 等大尺寸 MoE。
- **自架網頁 agent** → MolmoWeb 8B，看截圖點擊、輸入、捲動，訓練資料與程式碼都公開；底座是 Qwen3-8B。
- **影片理解、計數或物件追蹤** → Molmo 2 8B；需要整條堆疊都開放就選 Molmo 2-O 7B，代價是平均分少約 3 分。兩者的訓練資料都含非商業限定的第三方資料集，商用前先確認。
- **中文、多語或超過 65K 的長文件** → 不適合，Olmo 3 只支援英文，context 上限 65,536。
- **不想自架** → 目前沒有託管端點，換別的家族。

最小的選型驗證：用 vLLM 起 Olmo 3.1 32B Instruct，把你的工具 schema 與 20 個真實任務同時送給它和 Qwen 3 32B。比較工具呼叫的格式錯誤率與任務完成率，再挑幾個答錯的例子到 Ai2 Playground 用 OlmoTrace 看輸出片段對到哪些訓練文件。前者回答「夠不夠用」，後者就是 Olmo 才有的那一層價值。

## 限制與取捨

- **能力落後同尺寸前沿。** 官方表在 GPQA、LiveCodeBench、BFCL 都落後 Qwen 3 32B，對照組也停在 2025 年；Artificial Analysis 沒有能力分數可佐證。
- **評測幾乎全是自報。** 第三方能確認的只有開放度；能力要自己測。
- **只有英文、65K context、知識停在 2024 年 12 月。** 這三點直接排除多語客服、長文件與需要近期知識的任務。
- **沒有託管 API。** 自架的硬體與維運成本要算進去。
- **「完全開放」只涵蓋主線與少數子線。** Molmo 2 8B／4B、MolmoWeb、SERA、olmOCR 的底座是 Qwen，訓練資料只公開 Ai2 自己加的那一層；Molmo 2 還含非商業限定的第三方資料。
- **下一代時程未知。** 混合式 MoE 的新 Olmo 還在預訓練，規格與發佈日期都沒有公布；現在導入 Olmo 3.1，要預期一年內會換代。

OLMo 的價值不在排行榜，而在它是少數能從第一個 token 追到最後一個 checkpoint 的模型。需要這層透明度的團隊，它幾乎沒有替代品；只要能力和託管便利的團隊，則有更好的選擇。

## 參考資料

- [Olmo 3: Charting a path through the model flow — Ai2 官方部落格（含 Olmo 3.1 更新）](https://allenai.org/blog/olmo3)
- [Olmo 3 技術報告 — arXiv 2512.13961](https://arxiv.org/abs/2512.13961)
- [allenai/Olmo-3.1-32B-Think — Hugging Face 模型卡](https://huggingface.co/allenai/Olmo-3.1-32B-Think)
- [allenai/Olmo-3.1-32B-Instruct — Hugging Face 模型卡](https://huggingface.co/allenai/Olmo-3.1-32B-Instruct)
- [allenai/Olmo-3-1125-32B — Hugging Face 模型卡（Base 規格）](https://huggingface.co/allenai/Olmo-3-1125-32B)
- [allenai/Olmo-3-7B-Instruct — Hugging Face 模型卡](https://huggingface.co/allenai/Olmo-3-7B-Instruct)
- [allenai/dolma3_pool — Hugging Face 資料集（ODC-BY）](https://huggingface.co/datasets/allenai/dolma3_pool)
- [Introducing Olmo Hybrid — Ai2 官方部落格](https://allenai.org/blog/olmohybrid)
- [allenai/Olmo-Hybrid-7B — Hugging Face 模型卡](https://huggingface.co/allenai/Olmo-Hybrid-7B)
- [Introducing Olmo-core 3 — Ai2 官方部落格](https://allenai.org/blog/olmocore3)
- [Ai2 at COLM 2026 — Ai2 官方部落格](https://allenai.org/blog/colm-2026-recap)
- [Molmo 2 — Ai2 官方部落格](https://allenai.org/blog/molmo2)
- [allenai/Molmo2-8B — Hugging Face 模型卡](https://huggingface.co/allenai/Molmo2-8B)
- [MolmoWeb — Ai2 官方部落格](https://allenai.org/blog/molmoweb)
- [allenai/MolmoWeb-8B — Hugging Face 模型卡](https://huggingface.co/allenai/MolmoWeb-8B)
- [MolmoAct 2 — Ai2 官方部落格](https://allenai.org/blog/molmoact2)
- [allenai/SERA-32B — Hugging Face 模型卡](https://huggingface.co/allenai/SERA-32B)
- [allenai/olmOCR-2-7B-1025 — Hugging Face 模型卡](https://huggingface.co/allenai/olmOCR-2-7B-1025)
- [Tülu 3 — Ai2 官方部落格](https://allenai.org/blog/tulu-3)
- [Tülu 3 論文 — arXiv 2411.15124](https://arxiv.org/abs/2411.15124)
- [OLMo 2 — Ai2 官方部落格](https://allenai.org/blog/olmo2)
- [OLMo 2 32B — Ai2 官方部落格](https://allenai.org/blog/olmo2-32B)
- [OLMo 2 論文 — arXiv 2501.00656](https://arxiv.org/abs/2501.00656)
- [OLMo 論文 — arXiv 2402.00838](https://arxiv.org/abs/2402.00838)
- [OLMoE 論文 — arXiv 2409.02060](https://arxiv.org/abs/2409.02060)
- [Molmo and PixMo 論文 — arXiv 2409.17146](https://arxiv.org/abs/2409.17146)
- [Ai2 Responsible Use Guidelines](https://allenai.org/responsible-use)
- [AllenAI: Olmo 3.1 32B Think — OpenRouter](https://openrouter.ai/allenai/olmo-3.1-32b-think)
- [Olmo 3.1 32B Think — Artificial Analysis](https://artificialanalysis.ai/models/olmo-3-1-32b-think)
- [Artificial Analysis Openness Index](https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index)
- [Ai2 Playground](https://playground.allenai.org/)
- [OLMo：唯一連訓練資料都開源的語言模型家族](/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm) — 本站
- [全透明的 LLM 怎麼做：OLMo 3 的 model flow 與 LLM360 K2](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) — 本站
- [開源 AI 授權指南](/posts/ai/2026-08-26-open-source-ai-licensing-guide) — 本站
- [Qwen 模型家族](/posts/tech/2026-08-24-ai-model-family-qwen) — 本站
- [NVIDIA Nemotron 模型家族](/posts/tech/2026-10-10-ai-model-family-nemotron) — 本站
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
