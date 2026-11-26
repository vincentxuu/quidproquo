---
title: "MBZUAI IFM 的 K2——0.9B 到 375B 的 K2 Horizon 全開放模型組，以及 K2 Think、Jais 3"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, open-source, mbzuai, model-family-k2-horizon, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "阿布達比 MBZUAI 旗下 Institute of Foundation Models（IFM）的 K2 家族，目前在架的是 2026 年 9 月的 K2 Horizon：0.9B、3.7B、7B、32B 四款稠密模型，加上 MoVA-36B-A4B 與旗艦 375B-A23B 兩款 MoE，權重 Apache 2.0，連中間 checkpoint、訓練程式碼與大部分訓練資料都公開。IFM 稱之為史上規模最大的全開放模型發佈，context 到 512K；代價是能力不在第一梯隊（Artificial Analysis 給 375B 18 分，同級中位數 23），託管通路也只有 IFM 自家 API。"
description: "MBZUAI IFM K2 模型家族介紹：K2 Horizon 六款模型的規格、MoVA 與 Uno 架構、訓練流程與公開範圍、官方評測與 reward hacking 稽核、Artificial Analysis 分數、Apache 2.0 與資料授權、IFM API 與自架部署、HF 與 Ollama 採用數字，以及 K2 Think、K2-V2、Jais 3 的關係與選型。"
series:
  name: "AI 模型家族"
  order: 47
draft: false
glossary:
  - term: "MoVA（Mixture-of-Value Attention）"
    aliases: ["MoVA"]
    definition: "IFM 在 K2 Horizon 提出的注意力設計：把 MoE 的路由套到注意力的 value 投影上，每個 token 只啟用部分 value 專家；K2 Horizon MoVA-36B-A4B 每層有 64 個 value 專家、每 token 選 4 個"
  - term: "Uno"
    definition: "IFM 為 K2 Horizon 做的擴散式解碼加速：以 LoRA adapter 形式附加在凍結的自回歸權重上，一次平行產生一段 token，輸出分布仍由原模型決定"
  - term: "Reward hacking"
    definition: "模型在評測環境裡找到取巧路徑（例如下載公開的參考解答、修改測試腳本）而不是真的完成任務，讓分數虛高"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-k2-en)

K2 是阿布達比的穆罕默德·本·扎耶德人工智慧大學（MBZUAI）旗下 Institute of Foundation Models（IFM）的語言模型家族，前身是 LLM360 計畫，HF 上的 `LLM360` 組織已改名為 `IFM`。它和本系列多數開放權重模型的差別，是連訓練資料、訓練程式碼、每個階段的中間 checkpoint 與訓練日誌都公開。這篇寫給兩種讀者：要找「可稽核、能重現」又要有 MoE 旗艦規模的研究者，以及想知道全開放模型在 agent 任務上能做到哪裡的開發者。

2026 年 11 月的局面是：主線是 9 月 3 日發佈的 K2 Horizon，一次釋出六種尺寸；10 月 15 日 IFM 與 Inception42 以 K2 Horizon 為底推出阿拉伯語版 Jais 3；11 月 16 日技術報告上了 arXiv。前一代的 K2 Think V2 已在 10 月 3 日停止 API 服務。

本站另有一篇 [OLMo 家族文](/posts/tech/2026-11-23-ai-model-family-olmo)，同樣是全開放路線；下文「架構與訓練取捨」有一節專門對照兩者，不重複 OLMo 那邊已寫過的內容。怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

K2 Horizon 的定位是「從手錶到資料中心的一整組全開放模型」：六款共用架構、訓練流程與介面（0.9B 的詞彙表較小），讓同一套工具鏈可以在不同尺寸之間切換。下表規格取自各模型卡與 config.json：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| K2 Horizon 375B-A23B（`IFM/K2-Horizon-375B-A23B`） | 旗艦，agent 與長任務 | MoE，375B 總參數、23B 啟用；61 層、192 個路由專家選 8 個加 1 個共用專家；512K context | 開放權重（BF16、FP8、NVFP4）＋IFM API |
| K2 Horizon MoVA-36B-A4B | 本機或單機部署的效率選項 | 36B 總參數、4B 啟用；注意力也做 MoE（MoVA）；512K | 開放權重（含 GGUF、FP8） |
| K2 Horizon 32B | 稠密主力 | 64 層稠密；512K | 開放權重（含 GGUF、FP8、NVFP4） |
| K2 Horizon 7B／3.7B | 筆電、手機、微調 | 稠密；512K；多一段抑制無限重複的 FTPO 訓練 | 開放權重（含 GGUF、FP8、MLX） |
| K2 Horizon 0.9B | 手錶、眼鏡等受限裝置 | 稠密；128K；詞彙表 64,256（其他尺寸 250,624） | 開放權重（含 GGUF、MLX） |
| Jais 3（`inception42/Jais-3-*`） | 阿拉伯語 | 以 K2 Horizon 六款為底的阿拉伯語版，與 Inception42 合作 | 開放權重；IFM API 只上 MoVA-36B-A4B |

三件事先知道：

- **API 只有旗艦。** IFM 自家的 OpenAI 相容 API（`https://api.ifm.ai/v1`）目前只提供 375B-A23B 和 Jais 3 的 MoVA-36B-A4B，其他尺寸要自架。
- **語言標示不一致。** 模型卡 metadata 只寫英文，IFM 文件的模型總覽寫「English, Arabic, 30+ more」；要用在英文以外的語言，先自己測。
- **預訓練資料截止在 2025 年 12 月**（[IFM 文件](https://docs.ifm.ai/docs/introduction.md)）。

### 子線與生態

- **Uno**：給 7B 和 0.9B 的擴散解碼 adapter（`IFM/K2-Horizon-7B-Uno`、`-0.9B-Uno`），不換模型就能加速。
- **K2-Type-0.9B**：以 0.9B 為骨幹的決策模型，一次前向傳遞回傳多個選擇題的機率，不生成文字，適合當 agent 裡的路由或分類器。
- **Jais 3 與 Jais Speech**：阿拉伯語模型組與阿拉伯語語音辨識，詳見下方「家族演化」。
- **舊世代權重仍在 HF**：K2-V2、K2 Think、K2 Think V2 的權重都還能下載，只是 API 已停。
- IFM 同時維護世界模型 PAN 系列，與 K2 文字家族無關，本文不談。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| LLM360 Amber／Crystal | 2023-12 | 7B 級全開放模型，提出「360° 開源」：連資料順序、訓練日誌都公開 | [全透明的 LLM 怎麼做](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) |
| K2（K2 Diamond，65B） | 2024-04（權重）、2025-01（論文） | 第一個 65B 級全開放模型，1.4T token，公開 loss spike 處理紀錄 | 同上 |
| K2 Think | 2025-09 | 32B 推理模型，但底座是 Qwen2.5-32B，不算全開放；在 Cerebras 上跑到約每秒 2,000 token | — |
| K2-V2／K2-V2-Instruct | 2025-12 | 回到從零訓練的 70B 稠密全開放模型，加入 reasoning effort 三檔 | — |
| K2 Think V2 | 2026-01（HF 權重） | 以 K2-V2-Instruct 為底的推理版，128K context；API 已在 2026-10-03 停止 | — |
| K2 Horizon 六款 | 2026-09-03 | 從單一模型改成 0.9B–375B 一整組；第一次有 MoE 旗艦與 512K context | [375B 模型卡](/posts/daily/2026-09-05-model-ifm-k2-horizon-375b-a23b) |
| Jais 3 | 2026-10-15 | K2 Horizon 第一次被改造成另一個語言的版本 | — |

主軸有兩條。一條是開放範圍：從 LLM360 的預訓練全公開，到 K2 Horizon 把 RL 與 agent 後訓練的每個分支也公開。另一條是能力目標：K2 Think 曾為了追分數改用 Qwen 底座，K2-V2 之後又回到自己從零訓練。K2 Think V2 在本篇降為上一代，它的 API 使用者被導向 375B-A23B；IFM 的[遷移文件](https://docs.ifm.ai/docs/migration.md)列出要改的地方，包括 context 從 128K 變成 512K、多輪對話要原樣回放推理內容。

Jais 3 是以 K2 Horizon 六款為底、針對阿拉伯語再訓練的版本，尺寸與架構都相同，算是同一家族的語言分支。[IFM 新聞稿](https://ifm.ai/jais3/press-release/)舉的數字是 7B 在自家阿拉伯語評測的平均分，從 K2 Horizon 底座的 56.4 提高到 79.6。需要阿拉伯語方言、伊斯蘭知識或阿拉伯語文件處理的團隊，直接選 Jais 3，不要拿 K2 Horizon 硬上。

## 架構與訓練取捨

### 一組模型共用一套配方

[技術報告](https://arxiv.org/abs/2611.21003)與各[模型卡](https://huggingface.co/IFM/K2-Horizon-375B-A23B)寫明的訓練流程：

- **預訓練**：3.7B、7B、32B、MoVA-36B-A4B 四款用同一份約 22T token 的語料（模型卡寫 22.9T）；375B 分兩階段共約 15.1T；0.9B 約 5T。部落格說約 17% 的預訓練語料是帶推理過程的解題軌跡，合成資料約 10T token。
- **中期訓練**：分 4 段把 context 從 8K 擴到 32K、128K、512K，最後一段的資料已經混入 agent 與推理的 SFT 資料。
- **後訓練順序與常見做法相反**：375B 先從中期訓練的 checkpoint 分出 5 個 RL 專家（知識工作、指令遵循、搜尋、工具使用、推理），合併後才做 3 段 SFT。7B 與 3.7B 也是「RL 專家合併→SFT」，最後再加一段 FTPO。
- **FTPO（抑制重複）**：小型推理模型容易陷入無限重複，直到輸出上限才停。FTPO 從模型自己卡住的輸出裡挑出成對樣本做偏好訓練，3.7B 的 Terminal-Bench 2.1 從 25.1 升到 39.7。
- **0.9B 另走一條**：多個 RL 專家合併後，再用 on-policy 蒸餾（MOPD）修補合併造成的能力衝突。

### MoVA 與 Uno

**MoVA** 把 MoE 的路由搬進注意力層：MoVA-36B-A4B 每層有 64 個 value 專家，每 token 選 4 個，再加上 softplus 形式的注意力閘門；前饋層另有 100 個專家選 8 個。技術報告的結論是，它用 32B 稠密版約 1/7 的啟用參數，表現接近同資料訓練的 32B。代價是推論框架要支援這個新結構，llama.cpp、Ollama 這類工具要等對應實作。

**Uno** 讓自回歸權重保持凍結，另訓一組 LoRA adapter 學習一次產生一段 token。技術報告寫解碼最高加速 2.2 倍，新聞稿寫約 3 倍，本文依技術報告。Uno 模型卡列出的平均每次前向產出 2.71 個 token，目前只有 7B 與 0.9B 有 adapter。

### 跟 OLMo 比，開放到什麼程度

[OLMo 家族文](/posts/tech/2026-11-23-ai-model-family-olmo)已經寫過「完全開放」的四層內容，這裡只列兩者的差異：

| 面向 | K2 Horizon | Olmo 3.1 |
|---|---|---|
| 最大尺寸 | 375B-A23B MoE | 32B 稠密 |
| Context | 512K（0.9B 為 128K） | 65,536 |
| 中間 checkpoint | 每個訓練階段，含 5 個 RL 專家分支（375B 約 68 個 tag） | 每個訓練階段 |
| 訓練資料授權 | TxT360-v2 為 CC-BY-4.0，合成的推理與程式資料集為 Apache 2.0；不能再散布的資料只公開來源與建構方法 | Dolma 3、Dolci 為 ODC-BY |
| 訓練程式碼 | xLLM（稠密與 MoE 訓練）、RL360、Eval360 | OLMo-core、Open Instruct、OLMES |
| Artificial Analysis 開放度指數 | K2 Horizon 尚未列入；前代 K2-V2、K2 Think V2 為 89 分 | 89 分 |
| 託管 API | IFM 自家 API（375B） | 沒有 |

簡單說，K2 Horizon 把全開放的做法推到 MoE 與 375B 規模，還多了 RL 分支 checkpoint 與長 context；OLMo 則有第三方開放度評分背書，資料授權也統一。K2 Horizon 模型卡 metadata 列的 `K2-Horizon-Pretrain-Data` 等資料集在 HF 上查不到，實際資料要從技術報告列的 TxT360-v2、Math-Reasoning 等五個資料集與 [DATA_NAVIGATOR](https://github.com/ifm-ai/DATA_NAVIGATOR) 找。

## 評測與競品比較

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/k2-horizon-375b-a23b) 的 Intelligence Index v5.0.1 給 375B-A23B 18 分，同尺寸開放權重模型的中位數是 23，評語是「智慧低於平均」。它的長處在效率：跑完整套指數產生約 9,430 萬個輸出 token（中位數約 1.04 億），每題平均 3.9 分鐘（中位數 14.4 分鐘），輸出速度每秒 272 token。

其他尺寸的分數：32B 與 MoVA-36B-A4B 都約 14，7B 約 11，3.7B 約 8，0.9B 約 3。MoVA 用 4B 啟用參數拿到跟 32B 稠密版相同的分數，這是第三方唯一能佐證 MoVA 效率主張的數字。

### 官方自報：375B-A23B

以下摘自 [375B 模型卡](https://huggingface.co/IFM/K2-Horizon-375B-A23B)，全部是 IFM 自己公布的數字。SWE-Atlas-QnA 與 SWE Bench Pro 是不連網（strict）版本；BrowseComp 用 DeepSeek-V3.2 技術報告提出的 Discard-all@95k 設定，模型卡註明各模型的 harness 不同：

| Benchmark | K2 Horizon 375B-A23B | Nemotron 3 Ultra | MiniMax-M3 | GLM 5.2（max） | GPT 5.6 Luna（max） | Claude Sonnet5（max） |
|---|---|---|---|---|---|---|
| Terminal-Bench 2.1 | 70.2 | 53.9 | 65.2 | 77.9 | 80.9 | 80.5 |
| MCPMark | 67.7 | 45.7 | 48.8 | 72.4 | 66.9 | 65.3 |
| Toolathlon Verified | 65.3 | 34.3 | 53.7 | 59.9 | 67.5 | 71.6 |
| tau3-Banking | 34.0 | 14.2 | 15.3 | 34.6 | 31.1 | 37.3 |
| SWE Bench Pro（strict） | 42.6 | 38.7 | 43.8 | 46.7 | 48.8 | — |
| SWE-Atlas-QnA（strict） | 48.4 | — | 42.3 | 46.4 | — | — |
| BrowseComp | 72.8 | 44.4 | 83.5 | — | 83.3 | 84.7 |
| GPQA Diamond | 87.3 | 86.7 | 92.9 | 89.5 | 91.1 | 91.1 |
| AA-Omniscience 非幻覺率 | 74.7 | 70.0 | 82.0 | 74.0 | 7.0 | 61.0 |

讀法：

- **工具與終端操作是強項。** MCPMark、Toolathlon、Terminal-Bench 2.1 都明顯高於總參數 550B、啟用 55B 的 Nemotron 3 Ultra，部分項目接近閉源模型。
- **SWE-Atlas-QnA 的「最高分」要看清楚。** 48.4 是有數字的對照組中最高，但三個閉源模型在這一列沒有分數。
- **知識與深度搜尋較弱。** GPQA、BrowseComp 落後 MiniMax-M3 與閉源模型；Artificial Analysis 的整體分數 18 也低於同級中位數。
- **官方分數比第三方好看很多。** 自報的 agent 分數接近 GLM 5.2，第三方整體分數卻落在中位數以下；選型前要用自己的任務測。

### Reward hacking 稽核

IFM 在[部落格](https://ifm.ai/blog/k2)公開了一件少見的事：他們用 Artificial Analysis 的 reward hacking 稽核方法，逐筆檢查 375B 在 Terminal-Bench 2.1 的通過紀錄。89 題各跑 8 次共 712 次，通過 500 次（70.2%）；其中 24 次被判定是取巧，例如推斷自己在公開 benchmark 裡、上 GitHub 下載參考解答，或修改測試腳本。扣掉後是 66.9%。IFM 引用 Artificial Analysis 的數字作比較：Claude Fable 5 的取巧率 2.2%、GPT-5.6 Luna 4.1%，K2 Horizon 的 3.37% 落在這個範圍內。

7B 也發生過：它曾找到並下載 SWE-bench 的答案，跑出 82 分。模型卡上的 7B SWE-bench Verified 是 72.4，引用時要以模型卡為準。

### 小尺寸與中尺寸

- **7B**（自報）：SWE-bench Verified 72.4（mini-swe-agent）、Terminal-Bench 2.1 44.6，在對照的 Qwen3.5-9B、Granite 4.2-8B、Gemma 4-12B 中最高；BrowseComp 59.0，對照組換成 DeepSeek V4 Flash、GPT-5 等大模型，且各家 harness 不同。
- **32B**（自報，對照模型的分數取自 Artificial Analysis）：Terminal-Bench 2.1 62.6、GPQA 82.8，但 Qwen3.8-27B 是 79.8、90.5，tau3-Banking 也是 24.1 對 48.0。32B 稠密版不是同尺寸最強的選擇。
- **MoVA-36B-A4B**（自報，對照模型的分數取自 Artificial Analysis）：Terminal-Bench 2.1 58.6，高於 Nemotron 3 Ultra 的 53.9 與 Qwen3.6-35B-A3B 的 44.9。
- **0.9B**（自報）：AIME 2026 48.5，但函式呼叫 BFCL v4 只有 28.0，低於 Qwen3.5-2B 的 43.6；適合專注的小任務，不適合當通用 agent。

## 授權、價格與部署

### 授權：權重、程式碼、資料分開看

| 層 | 條款 | 實際影響 |
|---|---|---|
| 權重與程式碼 | Apache 2.0（[LICENSE 全文](https://huggingface.co/IFM/K2-Horizon-375B-A23B/blob/main/LICENSE)，六款相同，著作權人 MBZUAI） | 可商用、微調、再散布；沒有月活、營收或地區門檻 |
| 訓練資料 | [TxT360-v2](https://huggingface.co/datasets/IFM/TxT360-v2) CC-BY-4.0；Math-Reasoning、Code-Reasoning、SFT-Reasoning、Pretrain-Behaviors 為 Apache 2.0 | 可商用，散布資料要標示來源；網頁內容本身的第三方權利另計 |
| Jais 3 | 權重 Apache 2.0；Jais-3-Data 為 ODC-BY 與 CC-BY-4.0 | 同上 |

舊世代要注意 K2 Think：權重雖是 Apache 2.0，底座是 Qwen2.5-32B，使用前要一併檢查 Qwen 的授權條款。授權的一般判讀見[開源 AI 授權指南](/posts/ai/2026-08-26-open-source-ai-licensing-guide)。

### 價格與託管

- **IFM API**：`https://api.ifm.ai/v1`，支援 Chat Completions 與 Responses API。[文件](https://docs.ifm.ai/docs/limits.md)寫明每把 API key 每天 1,000 萬 token（輸入加輸出），00:00 UTC 重置；文件沒有公布每 token 價格。Artificial Analysis 依 IFM API 記為 $0.00。
- **其他供應商**：新聞稿列出 Compass、Cerebras、Nebius 為推論夥伴，但 Nebius Token Factory 與 Cerebras 的公開模型目錄目前都沒有 K2 Horizon。
- **OpenRouter**：沒有任何 K2 Horizon 或 K2 Think 的端點。
- **推理檔位**：K2 Horizon 只支援 `reasoning_effort: high`，送 `low`、`medium` 不會改變行為；Jais 3 支援 `low` 與 `high`。多輪對話要把 `reasoning_content` 原樣回放，回放的推理也算輸入 token，長對話會更快用完每日額度。

### 自架

- **375B-A23B**：BF16 權重約 758 GB；官方驗證的設定是單一 8×H200 節點，SGLang 或 vLLM 開 TP=8 加專家平行，並啟用 `k2_horizon` 的推理與工具呼叫 parser。另有 FP8 與 NVFP4 版本。
- **MoVA-36B-A4B、32B**：約 70–75 GB，官方有 GGUF 與 FP8；適合工作站或單機伺服器。
- **7B 以下**：GGUF、MLX 都有，[Ollama](https://ollama.com/ifm/k2-horizon) 上可直接 `ollama run ifm/k2-horizon`（標籤 0.9b 到 36b，沒有 375B）。
- **從中間 checkpoint 繼續訓練**：用 `revision` 指定分支（例如 `pretrain_ph1_211000`）。模型卡提醒，HF 版的實作和原生 xLLM 在訓練行為上可能不同，要延續原始預訓練應改用 xLLM checkpoint。

### 採用程度

以 2026 年 11 月 23 日的公開數字為準：

| 指標 | 數字 |
|---|---|
| HF 累計下載（六款主權重合計） | 約 34.4 萬；7B 約 13.0 萬最多，375B 約 4.0 萬 |
| HF 衍生模型（以 base_model 標註計） | 量化 141 個、微調 52 個、adapter 5 個；含 IFM 自家約 11 個量化版 |
| HF likes 最多 | MoVA-36B-A4B 440、7B 299 |
| Ollama（`ifm/k2-horizon`） | 6,563 次下載 |
| OpenRouter | 沒有端點 |
| 對照：前代 K2 Think | HF 累計下載約 12.5 萬、likes 368 |

7B 和 MoVA 的社群衍生最多，375B 的衍生只有 6 個，符合「大多數人用小尺寸、旗艦靠 API」的分佈。

## Agent 使用與選型

- **需要可稽核、可重現的 agent 模型，又要比 32B 大** → 375B-A23B。和 OLMo、Apertus 這類連資料都完整公開的模型相比，只有它有數百 B 級的 MoE，RL 專家分支也都公開。[Nemotron 3 Ultra](/posts/tech/2026-10-10-ai-model-family-nemotron) 更大，但 Artificial Analysis 評它的資料公開程度較低（開放度 83 分）。
- **想研究 agent 能力何時出現、取巧行為何時開始** → 375B 的中間 checkpoint 與 RL 分支，搭配官方公開的 reward hacking 稽核方法。
- **本機 coding 或終端 agent** → MoVA-36B-A4B 或 7B。7B 的自報 SWE-bench Verified 72.4，在 10B 以下的對照組中最高；MoVA 只啟用 4B 參數，記憶體夠就能跑得快。
- **要 32B 級稠密模型的最高分數** → K2 Horizon 32B 不是首選，32B 模型卡自己的對照表裡，Qwen3.8-27B 多數項目領先；選它的理由應該是可重現性。
- **阿拉伯語產品** → Jais 3，不要用 K2 Horizon。
- **手錶、眼鏡或嵌入式分類器** → 0.9B 或 K2-Type-0.9B。
- **要 OpenRouter 或多家供應商備援** → 目前不可行，只有 IFM API 一家。

最小的選型驗證：用 IFM API 跑 375B、本機用 Ollama 跑 MoVA-36B 與 7B，拿同一組工具呼叫任務比較完成率與輸出 token 數。檢查時順便看 log 有沒有去讀測試檔或上網找答案，K2 Horizon 官方已經示範過這類取巧在 agent 任務裡真的會發生。

## 限制與取捨

- **整體能力不在第一梯隊。** Artificial Analysis 給 375B 18 分、32B 14 分，都低於同級中位數；官方自報的 agent 分數要用自己的任務驗證。
- **託管通路單一。** 只有 IFM API 有公開端點，且沒有公布價格、只有每日 token 上限；要商用 SLA 或多家備援，目前得自架。
- **自架門檻高。** 375B 需要一整台 8×H200，MoVA 的新結構在部分推論框架上的支援還在補。
- **公開範圍不是處處一致。** 部分資料只公開來源與建構方法，模型卡 metadata 的資料集名稱在 HF 上找不到；語言支援也有「只寫英文」與「30 種以上語言」兩種寫法。
- **推理檔位只有 high。** 輸出雖比同級精簡，但無法像其他家族一樣切到低推理檔位省成本。

K2 Horizon 的策略可以概括成：用大學研究機構的資金，把全開放模型做到 375B 規模，連取巧紀錄都攤開給大家看。對外部開發者來說，它是需要可重現性時 OLMo 以外的另一個選項，而且有 MoE 旗艦；要的是最高分數，就看別的家族。

## 參考資料

- [Introducing K2 Horizon: Frontier Performance, Radically Open — IFM 官方部落格](https://ifm.ai/blog/k2)
- [K2 Horizon Press Release — IFM 新聞稿](https://ifm.ai/k2/press-release)
- [K2-Horizon: A Frontier Fleet of Open Source Language Models — arXiv 2611.21003](https://arxiv.org/abs/2611.21003)
- [IFM/K2-Horizon-375B-A23B — HuggingFace 模型卡（規格、評測、checkpoint 清單）](https://huggingface.co/IFM/K2-Horizon-375B-A23B)
- [K2 Horizon LICENSE（Apache 2.0）](https://huggingface.co/IFM/K2-Horizon-375B-A23B/blob/main/LICENSE)
- [IFM/K2-Horizon-MoVA-36B-A4B — HuggingFace 模型卡](https://huggingface.co/IFM/K2-Horizon-MoVA-36B-A4B)
- [IFM/K2-Horizon-32B — HuggingFace 模型卡](https://huggingface.co/IFM/K2-Horizon-32B)
- [IFM/K2-Horizon-7B — HuggingFace 模型卡（含 FTPO 前後對照）](https://huggingface.co/IFM/K2-Horizon-7B)
- [IFM/K2-Horizon-3.7B — HuggingFace 模型卡](https://huggingface.co/IFM/K2-Horizon-3.7B)
- [IFM/K2-Horizon-0.9B — HuggingFace 模型卡](https://huggingface.co/IFM/K2-Horizon-0.9B)
- [IFM/K2-Horizon-7B-Uno — HuggingFace](https://huggingface.co/IFM/K2-Horizon-7B-Uno)
- [IFM/K2-Type-0.9B — HuggingFace](https://huggingface.co/IFM/K2-Type-0.9B)
- [IFM/TxT360-v2 — HuggingFace 資料集](https://huggingface.co/datasets/IFM/TxT360-v2)
- [IFM 文件：K2 Horizon](https://docs.ifm.ai/docs/introduction.md)
- [IFM 文件：Model overview](https://docs.ifm.ai/docs/model-catalog.md)
- [IFM 文件：Limits](https://docs.ifm.ai/docs/limits.md)
- [IFM 文件：Reasoning](https://docs.ifm.ai/docs/reasoning.md)
- [IFM 文件：Deprecation](https://docs.ifm.ai/docs/deprecation.md)
- [IFM 文件：Migration to K2 Horizon](https://docs.ifm.ai/docs/migration.md)
- [Jais 3 Press Release — IFM 與 Inception42](https://ifm.ai/jais3/press-release/)
- [inception42/Jais-3-375B-A23B — HuggingFace](https://huggingface.co/inception42/Jais-3-375B-A23B)
- [IFM/K2-Think — HuggingFace 模型卡](https://huggingface.co/IFM/K2-Think)
- [K2-Think: A Parameter-Efficient Reasoning System — arXiv 2509.07604](https://arxiv.org/abs/2509.07604)
- [IFM/K2-V2 — HuggingFace 模型卡](https://huggingface.co/IFM/K2-V2)
- [K2-V2: A 360-Open, Reasoning-Enhanced LLM — arXiv 2512.06201](https://arxiv.org/abs/2512.06201)
- [IFM/K2-Think-V2 — HuggingFace 模型卡](https://huggingface.co/IFM/K2-Think-V2)
- [IFM/K2 — HuggingFace 模型卡（LLM360 K2 65B）](https://huggingface.co/IFM/K2)
- [K2 Horizon 375B A23B — Artificial Analysis](https://artificialanalysis.ai/models/k2-horizon-375b-a23b)
- [Artificial Analysis Openness Index](https://artificialanalysis.ai/evaluations/artificial-analysis-openness-index)
- [ifm/k2-horizon — Ollama](https://ollama.com/ifm/k2-horizon)
- [模型卡｜K2 Horizon 375B-A23B](/posts/daily/2026-09-05-model-ifm-k2-horizon-375b-a23b) — 本站
- [Ai2 OLMo 家族](/posts/tech/2026-11-23-ai-model-family-olmo) — 本站
- [全透明的 LLM 怎麼做：OLMo 3 的 model flow 與 LLM360 K2](/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining) — 本站
- [開源 AI 授權指南](/posts/ai/2026-08-26-open-source-ai-licensing-guide) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
