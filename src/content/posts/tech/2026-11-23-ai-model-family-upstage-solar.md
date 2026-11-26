---
title: "Upstage Solar——韓國的 Solar Pro 4、Solar Mini 4 API 與 Solar Open 2 開放權重怎麼選"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, upstage, korea, open-weight, moe, model-family-solar, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Upstage 的 Solar 目前分三條：閉源 API 的 Solar Pro 4（參數未揭露、512K context）與 Solar Mini 4（35B 總參數、3B 啟用），以及開放權重的 Solar Open 2（250B、15B 啟用、1M context）。強項是韓文與日文的文件型辦公 agent 和低單價；Artificial Analysis 現行指數只給 Pro 4 14 分，低於同價位中位數 21。Open 2 的授權以 Apache 2.0 為底，衍生模型要以 Solar 命名並標示 Built with Solar。"
description: "Upstage Solar 模型家族介紹：Solar Pro 4、Solar Mini 4、Solar Open 2 的規格、混合線性注意力架構、官方與第三方評測、Upstage Solar License 條款、Upstage Console／OpenRouter 價格與停用時程、HF／Ollama／雲端上架的採用數字、2023→2026 演化與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 44
draft: false
glossary:
  - term: "KDA（Kimi Delta Attention）"
    aliases: ["Kimi Delta Attention"]
    definition: "一種線性注意力：把上下文累積在固定大小的遞迴狀態裡，KV cache 不隨序列長度增長；Solar Open 2 的 48 層中有 36 層用它"
  - term: "NoPE（No Positional Encoding）"
    aliases: ["NoPE"]
    definition: "注意力層完全不加位置編碼的設計，位置資訊改由線性注意力的遞迴狀態隱含提供，目的是避開 RoPE 的長度外推上限"
  - term: "DUS（Depth Up-Scaling）"
    aliases: ["Depth Up-Scaling"]
    definition: "SOLAR 10.7B 使用的擴模方法：複製既有模型的層並拼接加深，再接續預訓練，而不是從零訓練更大的模型"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-upstage-solar-en)

Solar 是韓國 AI 公司 Upstage 的語言模型家族。這篇寫給要評估非美中模型、或要處理韓文與日文文件工作的 Agent 開發者：Solar Pro 4、Solar Mini 4、Solar Open 2 各自適合什麼任務，官方數字和第三方數字差在哪裡，以及開放權重授權對衍生模型有什麼要求。

2026 年 11 月的局面是：API 只剩第四代兩個型號，2026 年 10 月 30 日起 Solar Pro 3、Solar Pro 2 與舊版 Solar Mini 全部停用；要自架的團隊則改看 7 月釋出的 Solar Open 2。韓國其他廠商（LG、SKT、KT、Naver 等）的模型放在[韓國模型群總覽](/posts/tech/2026-11-23-ai-model-family-korea-models)。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

Upstage 自己的說法是兩種工作分工：要自架、資料不能出機房，選開放權重的 Solar Open 2；要把長而複雜的工作交給 API，選 Solar Pro 4。Solar Mini 4 是後來補上的低價高頻型號。價格為 [Upstage 官方價目](https://www.upstage.ai/pricing)，每 1M tokens、未稅：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| Solar Pro 4（API 名 `solar-pro4`，版本 `solar-pro4-260806`） | API 旗艦，長文件與多步工具 agent | 參數未揭露；512K context、最多 128K 輸出；預設開啟推理；英韓日 | 閉源 API：牌價 $0.30／$1.20（快取 $0.06）；目前促銷價 $0.15／$0.60（快取 $0.03） |
| Solar Mini 4（`solar-mini4`，版本 `solar-mini4-260922`） | 低價高頻 agent 任務 | 35B 總參數、3B 啟用 MoE；512K／128K；預設不推理 | 閉源 API：牌價 $0.10／$0.40（快取 $0.01）；目前促銷價 $0.05／$0.20（快取 $0.005） |
| Solar Open 2（`upstage/Solar-Open2-250B`） | 開放權重，自架 agent 底模 | 250B 總參數、15B 啟用；混合線性注意力、1M context；英韓日 | 開放權重（Upstage Solar License）；官方 API 已停止服務 |
| Solar Open 100B（`upstage/Solar-Open-100B`） | 上一代開放權重 | 102B／12B MoE、128K context、全 softmax 注意力 | 開放權重（Upstage Solar License） |

兩個要先知道的事：

- **促銷價沒有標結束日。** 價目頁上 Solar Pro 4 從 2026-10-20 起、Solar Mini 4 從 10-11 起是五折，頁面沒寫到期日；估成本時要同時算牌價。Upstage 的價格另加 10% 營業稅。
- **Pro 4 和 Mini 4 沒有權重。** HuggingFace 上的 [`upstage` 組織](https://huggingface.co/upstage)只放了這兩個型號的 tokenizer；官方說兩者都可談地端部署，但要找業務。

### 子線與生態

Upstage 起家的產品是文件 AI：Document Parse、Document OCR、Information Extract 等 API，以 Solar Pro 4 為底的無程式碼文件 agent 平台 Upstage Studio，都跟 LLM 共用一個 Console 帳號與額度。Document Parse 的表格精度在本站的[商用文件解析 API 比較](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison)有一列。[模型目錄](https://console.upstage.ai/docs/models)另有 30B 的日文企業模型 Syn Pro，不屬於 Solar 品牌。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 |
|---|---|---|
| SOLAR 10.7B | 2023-12 | 用 DUS 把 Mistral 7B 的權重加深成 10.7B，base 版 Apache 2.0、Instruct 版 CC BY-NC 4.0；當時小尺寸開放權重的熱門微調底模 |
| Solar Pro preview | 2024-09-10 | 22B、MIT 授權，主打單張 GPU 跑出 70B 級表現；只有英文 |
| Solar Pro | 2024-11-26 | 22B 正式版改走 API，12 月上架 AWS Bedrock Marketplace 與 SageMaker JumpStart |
| Solar Pro 2 | 2025-07-10 | 31B，同一個模型可切換對話與推理模式，context 擴到 64K |
| Solar Open 100B | 2025-12 底（官方 2026-01-06 公告） | 韓國科技部「獨自 AI 基礎模型」計畫的第一個成果，102B-A12B 從零訓練；授權改為 Upstage Solar License |
| Solar Pro 3 | 2026-01-26 | API 旗艦換成 102B／12B MoE、128K context，規格與 Solar Open 100B 相同 |
| Solar Open 2 | 2026-07-22 | 250B-A15B、混合線性注意力、1M context，開放權重第一次主打 agent |
| Solar Pro 4 | 2026-08-06（08-11 起收費） | API 旗艦轉向 agent，context 擴到 512K；上市先免費一週，之後從一折、三折調到現在的五折 |
| Solar Mini 4 | 2026-09-22（部落格 10-01） | 3B 啟用的低價型號，取代 10.7B 的舊 Solar Mini |

主軸是從「小而精的稠密模型」走到「MoE 加長 context 的 agent 模型」。授權也跟著變：早期權重用 Apache 2.0、MIT 或 CC BY-NC，Solar Open 系列統一成自訂的 Upstage Solar License。舊版 API 的停用時程寫在[授權、價格與部署](#授權價格與部署)一節。站上沒有 Solar 各代的每日模型卡，舊世代的細節以官方[版本史](https://console.upstage.ai/docs/models/history)為準。

## 架構與訓練取捨

### Solar Open 2：線性注意力換 1M context

[Solar Open 2 模型卡](https://huggingface.co/upstage/Solar-Open2-250B)與[技術報告](https://arxiv.org/abs/2607.20062)寫明的設計：

- **MoE 主幹**：48 層、hidden size 4,096，每層 320 個路由專家加 1 個共用專家，每 token 啟用 8 個路由專家。總參數 250,287,794,944，每 token 啟用 15B。
- **混合注意力**：每 4 層是 1 層 softmax（GQA，加 sigmoid 輸出閘門）接 3 層線性注意力（KDA，延伸到負特徵值），重複 12 次。只有 12 層保留 KV cache，長 context 的記憶體約是同形狀全 softmax 模型的四分之一。順序是 softmax 在前，跟 Kimi Linear、Qwen3.5 的線性層在前相反。
- **NoPE**：整個模型不用位置編碼，位置資訊交給線性層的遞迴狀態，藉此繞開 RoPE 的外推上限，把 context 從上一代的 128K 推到 1M。
- **從上一代接權重**：架構改動後還能沿用的 5.69B 參數（約 2.3%）從 Solar Open 100B 轉過來，其餘隨機初始化，再完整預訓練。官方[部落格](https://www.upstage.ai/blog/en/solar-open-2)的受控比較是：新架構 210B token 就達到舊架構 671B token 的 MMLU。
- **資料與後訓練**：模型卡寫預訓練約 12T token，技術報告摘要則寫成從 20T 資料池精選出 10T 的混合比例。後訓練先在工具呼叫、coding、辦公等場景各訓一個領域專家，共 12 個，再用多教師 on-policy 蒸餾（MOPD）合成一個模型。
- **韓文 tokenizer**：沿用 Solar Open 1 的 196,608 詞表。技術報告測得全球模型的 tokenizer 處理同一段韓文要多花 1.2–1.9 倍 token，這直接反映在韓文工作的成本與有效 context 上。

代價：自架 BF16 至少要 4 張 H200（模型卡建議 8 張，Quickstart 範例以 8 張 141GB 以上的 GPU 為前提）；NotaAI 提供 INT4 與 NVFP4 量化版，官方說量化後 2 張 H200 可跑。模型卡的推論範例都用 Upstage 自己的 vLLM 與 Transformers 分支；[NVIDIA Dynamo 的部署範例](https://docs.nvidia.com/dynamo/latest/recipes/solar-open2-250b)也註明標準 runtime 沒有它的模型定義、要用專門的映像，而且不支援投機解碼。

### Solar Pro 4 與 Solar Mini 4：只公開了部分規格

[Solar Pro 4 規格頁](https://console.upstage.ai/docs/models/solar-pro-4)寫的是「Undisclosed parameters」。訓練方法只在[部落格](https://www.upstage.ai/blog/en/solar-pro-4)提到一句：沿用 Solar Open 2 起的 OfficeVerse 資料管線。這套管線從 11 個產業、12 種任務類型的公開資料合成辦公任務，依最終交付物判定通過與否。官方沒說 Pro 4 與 Open 2 是不是同一個底模。

[Solar Mini 4](https://www.upstage.ai/blog/en/solar-mini-4) 是 35B 總參數、3B 啟用的 MoE，官方寫「從零預訓練」。要注意：3B 是每 token 的計算量，部署時 35B 權重仍要全部載入記憶體；官方說量化版可塞進一張 H100 80GB，但目前只開放地端合約，不提供下載。

## 評測與競品比較

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/solar-pro-4) 的 Intelligence Index v5.0.1（9 項評測，含 Terminal-Bench 4.0、AutomationBench-AA、GDP.pdf 等）給 Solar Pro 4 14 分，同價位區間中位數 21，40 個模型中排第 27。它也標出兩個成本問題：跑完整套指數產生 2.43 億個輸出 token（中位數約 9,700 萬），每個任務平均要 65 分鐘左右（中位數 6.7 分鐘）。Solar Mini 4、Solar Open 2 與 Solar Open 100B 在 Artificial Analysis 都有頁面，但沒有現行指數分數。

Upstage 新聞稿寫 Solar Pro 4「Artificial Analysis 42 分」、Solar Mini 4 部落格寫「24.1 分」，用的是 8 月時的舊版指數（Mini 4 部落格明寫 v4.3.2）。v5 重新定標，所以 42 和 14 不是同一把尺，也不能拿舊版分數去比本系列其他文章引用的 v5 分數。

### 官方自報：Solar Pro 4 對 Solar Open 2

以下摘自 [Solar Pro 4 部落格](https://www.upstage.ai/blog/en/solar-pro-4)。標「內部」的是 Upstage 自己的評測環境；其餘 Upstage 標示為引用 Artificial Analysis 2026 年 8 月的結果：

| Benchmark | Solar Open 2 | Solar Pro 4 |
|---|---|---|
| Terminal-Bench v2.1 | 43.2 | 57.0 |
| GDPval-AA v2 | 31.4 | 38.8 |
| BrowseComp（內部） | 37.3 | 49.2 |
| SWE-Bench Verified, OpenHands（內部） | 69.2 | 70.6 |
| MCP-Atlas（內部） | 58.2 | 61.4 |
| τ³-Banking | 18.1 | 23.0 |
| AA-LCR | 62.7 | 71.0 |
| GPQA Diamond | 85.6 | 89.0 |
| KMMLU-Pro（內部） | 78.4 | 79.2 |
| Ko-GDPval（內部） | 86.8 | 87.3 |
| Arena-Hard v2 日文（內部） | 75.3 | 81.9 |

讀法：差距集中在 agent 執行（終端、網頁研究、工作交付物），知識、數學、coding 與韓文專業題兩者幾乎持平。官方據此建議：要自架選 Open 2，要把長任務交給 API 選 Pro 4。

### 官方自報：Solar Open 2 對同尺寸開放權重

[Solar Open 2 模型卡](https://huggingface.co/upstage/Solar-Open2-250B)的英文表與 DeepSeek-V4-Flash（284B-A13B，max）、MiMo-V2.5（310B-A15B）、Mistral Medium 3.5（128B 稠密）、Command A+（218B-A25B）比較，全部是 Upstage 公布的數字：

| Benchmark | Solar Open 2 | DeepSeek-V4-Flash | MiMo-V2.5 | Mistral Medium 3.5 |
|---|---|---|---|---|
| MMLU-Pro | 86.2 | 85.9 | 84.6 | 81.2 |
| GPQA-Diamond | 86.3 | 88.9 | 83.0 | 77.5 |
| LiveCodeBench v6 | 92.4 | 92.3 | 89.1 | 84.9 |
| SWE-Bench Verified | 70.4 | 73.8 | 73.0 | 69.6 |
| Terminal Bench Hard | 28.3 | 34.1 | 41.7 | 33.3 |
| MCP-Atlas | 58.2 | 58.2 | 63.9 | 30.7 |
| APEX-Agents | 16.6 | 13.2 | 13.4 | 6.1 |
| KMMLU-Pro | 78.4 | 78.9 | 69.1 | — |
| Ko-GDPval（內部） | 86.8 | 85.0 | 81.0 | — |

- **知識與韓文跟 DeepSeek-V4-Flash 打平**，KMMLU-Pro、CLIcK、KBL 等韓文題大多在第一梯隊；Ko-GDPval 是 Upstage 自建的韓文辦公 agent 基準。
- **終端與軟體工程落後。** Terminal Bench Hard 是表中最低，SWE-Bench Verified 也低於 DeepSeek-V4-Flash 與 MiMo-V2.5。
- **同一個模型的分數在兩份官方文件不一樣。** Pro 4 部落格裡 Open 2 的 LiveCodeBench 是 87.0、模型卡是 92.4；Terminal-Bench v2.1 的 43.2 與模型卡的 Terminal Bench Hard 28.3 是不同 benchmark。引用時要寫明出處，不要混表。

跨家族的背景：DeepSeek-V4 系列見 [DeepSeek 家族文](/posts/tech/2026-08-24-ai-model-family-deepseek)，Mistral Medium 見 [Mistral 家族文](/posts/tech/2026-08-24-ai-model-family-mistral)，Command A 見 [Cohere 家族文](/posts/tech/2026-08-24-ai-model-family-cohere)；同樣以主權模型為賣點的韓國廠商比較在[韓國模型群總覽](/posts/tech/2026-11-23-ai-model-family-korea-models)。

### 官方自報：Solar Mini 4

[Solar Mini 4 部落格](https://www.upstage.ai/blog/en/solar-mini-4)的數字：舊版指數 v4.3.2 的 24.1 分（Qwen3.6 35B A3B 18、Nemotron 3.5 Lightning 13）、AA-LCR 83.3%、SciCode 47.6%、HLE 25.8%、AutomationBench-AA 22.3%、τ³-Banking 47.2。成本比較只有三個韓文任務、各跑三次：完成 1,000 組的估算成本 Mini 4 是 $1.25、MiMo-V2.5 是 $2.20。官方自己註明這是初步內部測試、沒開快取、MiMo 走第三方路由。

## 授權、價格與部署

### Upstage Solar License：Apache 2.0 加一條品牌條款

[Solar Open 2](https://huggingface.co/upstage/Solar-Open2-250B/blob/main/LICENSE) 與 [Solar Open 100B](https://huggingface.co/upstage/Solar-Open-100B/blob/main/LICENSE) 用同一份 Upstage Solar License（兩份 LICENSE 逐字相同）。HF metadata 只寫 `license: other`，要讀全文才知道內容：前言說它「基本上採用 Apache 2.0 的全部條款，包括允許商用」，差別在第 4(e) 條。

| 情境 | 條件 |
|---|---|
| 商用、內部使用、透過 API 提供服務 | 同 Apache 2.0；沒有營收或月活門檻，也沒有地區排除 |
| 散布原模型或修改過的檔案 | 附上授權、保留版權與 NOTICE、標示修改，同 Apache 2.0 |
| 散布或提供「衍生 AI 模型」（用它訓練、微調、蒸餾或改進出的模型） | 模型名稱必須以「Solar」開頭（例如 `Solar-MyModel-v1`）；相關網站、介面或文件要顯著標示「Built with Solar」；附上本授權 |
| 使用 Solar 名稱 | 不得暗示 Upstage 背書或讓人以為是官方產品 |

所以把 Solar Open 2 拿去微調、再以自家品牌發佈模型的團隊，名稱與標示會受限；只拿它推論、包進產品的團隊，條件跟 Apache 2.0 差不多。Solar Open 100B 的 repo 另外註明，程式碼檔（`.py`、`.json`、`.jinja`）是 Apache 2.0，只有權重適用 Solar License。

Solar Pro 4 與 Solar Mini 4 是閉源 API，適用 Upstage Console 的服務條款。模型頁註明 API 輸入不用於訓練、除服務需要外不保存。

### API 價格

- **Solar Pro 4**：牌價 $0.30／$1.20、快取 $0.06；10-20 起促銷 $0.15／$0.60、快取 $0.03。[OpenRouter](https://openrouter.ai/upstage/solar-pro4) 上 Upstage 的 endpoint 同為促銷價，另有 KT 以牌價託管。
- **Solar Mini 4**：牌價 $0.10／$0.40、快取 $0.01；10-11 起促銷 $0.05／$0.20、快取 $0.005。[OpenRouter](https://openrouter.ai/upstage/solar-mini4) 只有 Upstage 一家託管。
- 兩者在 OpenRouter 都是 524,288 context、最多 131,072 輸出 token，支援工具呼叫、平行工具呼叫、structured outputs 與 `reasoning_effort`。
- Upstage Console 另有預付方案：月付 $100 以上加贈 10% 額度並提高速率上限。

### 停用與替代

依[版本史](https://console.upstage.ai/docs/models/history)與價目頁：

- `solar-pro3`、`solar-pro2`、舊版 `solar-mini` 在 2026-10-30（韓國時間）停用，官方要求改用 `solar-pro4`、`solar-mini4` alias。
- `solar-open2` 的 API 只開放過封閉測試，2026-08-12 結束服務，只剩 HuggingFace 權重。

### 採用程度與上架通路

| 指標 | 數字 |
|---|---|
| OpenRouter 使用量 | Solar Mini 4 在 New & Trending 第 7，近 7 天 1.19T token、週增超過 999%（[rankings](https://openrouter.ai/rankings)，單週快照）；Upstage 新聞稿自報 Solar Pro 4 上架一週內超過 3,700 億 token |
| HF 近 30 天下載 | Solar-Open-100B 75,145（累計 612,873）；Solar-Open2-250B 6,347（累計 57,547）；SOLAR-10.7B-Instruct 43,694 |
| HF 衍生模型 | Solar-Open2-250B 18 個（15 個量化、3 個微調）；Solar-Open-100B 20 個；SOLAR-10.7B-Instruct 257 個（194 個 adapter） |
| Ollama 官方 library | 只有舊版：`solar`（10.7B）100 萬次下載、`solar-pro`（Pro preview）59.1 萬次，都已兩年沒更新；Solar Open 2 與第四代沒有官方映像 |
| 雲端市集 | Upstage [部署選項表](https://console.upstage.ai/docs/deployment-options)上，Solar Pro 4 與 Mini 4 只在 Upstage Console，AWS（Bedrock、SageMaker）、Azure、Snowflake 都沒有；AWS Marketplace 仍有 Solar Pro 2 的 SageMaker 套件 |

讀法：第四代 API 的用量主要從 OpenRouter 與 Nous Research 的 Hermes Agent 進來，大型雲端目錄還沒跟上。開放權重這邊，Solar Open 2 的下載與衍生模型數都遠少於上一代，社群活動集中在量化版；跟歷史上衍生出兩百五十多個模型的 SOLAR 10.7B 是不同量級。

## Agent 使用與選型

- **大量、規格化的抽取、分類與工具呼叫** → Solar Mini 4。促銷價每 1M 輸出 $0.20，預設不推理；先用 `reasoning_effort` 的最低檔跑，品質不夠再往上調。
- **韓文或日文的長文件辦公 agent**（合約比對、從試算表做到報告與簡報）→ Solar Pro 4。官方投入最多的就是這類任務，也提供 [Agent Cookbook](https://www.upstage.ai/blog/en/solar-pro-4) 的範例 agent；但 Artificial Analysis 量到它很慢又很囉嗦，要把延遲與輸出 token 算進成本。
- **資料不能出機房、要自架** → Solar Open 2，至少 4 張 H200（BF16）或 2 張 H200（量化）。若要微調後對外發佈，先確認團隊接受 Solar 命名與 Built with Solar 標示。
- **主力 coding agent 或終端操作** → 不是首選。Solar Open 2 自報的 Terminal Bench Hard 與 SWE-Bench Verified 都落後 DeepSeek-V4-Flash 與 MiMo-V2.5。
- **英文為主、只看整體分數** → 同價位有分數更高的選項；Pro 4 的現行指數 14 分低於中位數 21。
- **需要 AWS Bedrock、Azure 等雲端市集的帳單與合規** → 第四代目前不在這些市集，只能走 Upstage Console、OpenRouter 或地端合約。

最小的選型驗證：拿自己的一組韓文或日文文件任務，分別送 Solar Mini 4（`reasoning_effort` 最低檔與預設）與 Solar Pro 4，記錄完成率、輸出 token、延遲與帳單。Upstage 的 API 相容 OpenAI SDK，`base_url` 換成 `https://api.upstage.ai/v1`、模型名改成 `solar-mini4` 或 `solar-pro4` 即可。Solar Pro 4 預設會推理、回應附推理過程，比較時要把推理 token 一起算。

## 限制與取捨

- **整體分數不高。** 獨立的整體分數只有 Artificial Analysis，Pro 4 在現行 v5 是 14 分；Upstage 對外常引的 42 分與 24.1 分是舊版指數。
- **評測多半是自報或自建。** Ko-GDPval、KBankMMLU、Ko-AIME 是 Upstage 的內部基準，Pro 4 表格裡標「內部」的項目也是；同一個 Open 2 在兩份官方文件裡的分數不一致。
- **API 型號的規格不透明。** Solar Pro 4 不公開參數與架構，Mini 4 只公開參數量，都沒有權重。
- **慢且輸出長。** Artificial Analysis 量到 Pro 4 首個答案 token 約 46 秒、每任務約 65 分鐘，輸出 token 是中位數的 2.5 倍。
- **價格是促銷價。** 現行五折沒有標結束日，長期預算要以牌價估。
- **衍生模型要掛 Solar 品牌。** 授權本身允許商用，但微調後發佈的模型命名與標示受限。
- **通路窄。** 第四代不在 AWS、Azure 等雲端市集，Solar Open 2 也要用 Upstage 自己的 vLLM 分支。HuggingFace 上 11 月出現了 `solar-mini-4-5-tokenizer`，官方還沒有對應公告。

Solar 的策略可以概括成：用韓文 tokenizer 與文件 AI 的老本行，把 API 做成便宜的辦公 agent 模型，同時以主權模型計畫的開放權重維持在地與地端市場。對韓日文件工作，它值得排進評測清單；要英文整體能力或 coding agent，還有更強的同價位選項。

## 參考資料

- [Solar Pro 4: The Agentic Model That Finishes the Job — Upstage 官方部落格](https://www.upstage.ai/blog/en/solar-pro-4)
- [Solar Pro 4 — Upstage Console 模型頁](https://console.upstage.ai/docs/models/solar-pro-4)
- [Solar Mini 4: Built for High-Volume Agent Workloads — Upstage 官方部落格](https://www.upstage.ai/blog/en/solar-mini-4)
- [Solar Mini 4 — Upstage Console 模型頁](https://console.upstage.ai/docs/models/solar-mini-4)
- [Solar Open 2: Korea's Sovereign Foundation Model — Upstage 官方部落格](https://www.upstage.ai/blog/en/solar-open-2)
- [upstage/Solar-Open2-250B — HuggingFace 模型卡](https://huggingface.co/upstage/Solar-Open2-250B)
- [Upstage Solar License — HuggingFace](https://huggingface.co/upstage/Solar-Open2-250B/blob/main/LICENSE)
- [Solar Open 2 Technical Report — arXiv 2607.20062](https://arxiv.org/abs/2607.20062)
- [upstage/Solar-Open-100B — HuggingFace 模型卡](https://huggingface.co/upstage/Solar-Open-100B)
- [Solar Open Technical Report — arXiv 2601.07022](https://arxiv.org/abs/2601.07022)
- [Korean AI firm Upstage releases AI model as open source — Aju Press](https://www.ajupress.com/view/20260106083310286)
- [All Models and Version History — Upstage Console](https://console.upstage.ai/docs/models/history)
- [Changelog — Upstage Console](https://console.upstage.ai/docs/resources/changelog)
- [Pricing — Upstage](https://www.upstage.ai/pricing)
- [Deployment Options — Upstage Console](https://console.upstage.ai/docs/deployment-options)
- [Models — Upstage Console](https://console.upstage.ai/docs/models)
- [Upstage AI Unveils Solar Pro 4 — Upstage 新聞稿（PR Newswire）](https://www.prnewswire.com/news-releases/upstage-ai-unveils-solar-pro-4-scoring-42-on-artificial-analysis-index-to-rank-among-global-frontier-models-302856434.html)
- [Upstage Releases Next-Generation Solar Pro on AWS — Amazon 新聞稿](https://press.aboutamazon.com/aws/2024/12/upstage-releases-next-generation-solar-pro-generative-ai-llm-on-aws)
- [Solar models from Upstage are now available in Amazon SageMaker JumpStart — AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/solar-models-from-upstage-are-now-available-in-amazon-sagemaker-jumpstart/)
- [Solar Pro 2 — AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-yar5lgioxenj4)
- [Solar Open2 250B — NVIDIA Dynamo 文件](https://docs.nvidia.com/dynamo/latest/recipes/solar-open2-250b)
- [Upstage: Solar Pro 4 — OpenRouter](https://openrouter.ai/upstage/solar-pro4)
- [Upstage: Solar Mini 4 — OpenRouter](https://openrouter.ai/upstage/solar-mini4)
- [OpenRouter Rankings](https://openrouter.ai/rankings)
- [Solar Pro 4 — Artificial Analysis](https://artificialanalysis.ai/models/solar-pro-4)
- [upstage — HuggingFace 組織頁](https://huggingface.co/upstage)
- [solar — Ollama library](https://ollama.com/library/solar)
- [solar-pro — Ollama library](https://ollama.com/library/solar-pro)
- [韓國模型群總覽](/posts/tech/2026-11-23-ai-model-family-korea-models) — 本站
- [商用文件解析 API 比較](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison) — 本站
- [DeepSeek 模型家族](/posts/tech/2026-08-24-ai-model-family-deepseek) — 本站
- [Mistral 模型家族](/posts/tech/2026-08-24-ai-model-family-mistral) — 本站
- [Cohere 模型家族](/posts/tech/2026-08-24-ai-model-family-cohere) — 本站
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
