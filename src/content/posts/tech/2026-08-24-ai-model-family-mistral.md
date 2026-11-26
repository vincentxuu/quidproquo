---
title: "Mistral——歐洲的開放權重挑戰者：從 Mixtral 到兆級 Large 4，用效率和主權打一場不一樣的仗"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, mistral, mistral-ai, model-family-mistral, open-source, europe, moe, multimodal, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Mistral 是歐洲最大的 AI 實驗室，路線是開放權重加歐洲主權部署。目前的主力是 2026 年 10 月的 Mistral Large 4：1T 總參數、52B 啟用的多模態 MoE，1M context，權重以 Mistral Ecosystem Open-Weight License（修改版 MIT）釋出，API $0.70／$2.10。小而省的選項是 Small 4（119B／6.5B 啟用，Apache 2.0，$0.15／$0.60）。Large 4 在西方開放權重模型裡 coding 與資安最強，但綜合推理仍落後中國領先的開放模型。"
description: "Mistral AI 模型家族完整介紹：2023→2026 演化時間線、Mixtral 的 MoE 效率路線、Large 4 與 Small 4 兩層主力、Ministral／Voxtral／OCR 子線、開放權重授權的三種條款、停用時程與 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 6
draft: false
glossary:
  - term: "Le Chonk"
    aliases: ["ML4"]
    definition: "Mistral Large 4 的官方暱稱，2026-10-06 公開預覽、10-29 釋出權重"
  - term: "Mistral Ecosystem Open-Weight License"
    definition: "Large 4 使用的修改版 MIT 授權：可商用、可微調、可再散佈，但經營「模型即服務」（MaaS）的公司要另簽商用授權"
  - term: "Ministral"
    aliases: ["Ministral 3"]
    definition: "Mistral 的輕量系列——3B / 8B / 14B，用於邊緣裝置和低延遲場景，Apache 2.0 授權"
  - term: "Vibe"
    definition: "Mistral 的消費者與工作 agent 產品，2026-05-28 由 Le Chat 改名而來，分 Work、Code、Chat 三種模式"
  - term: "Regional Endpoints"
    definition: "Mistral 的區域推論端點，讓客戶選擇推理發生在歐洲或美國，符合 GDPR 與資料主權要求"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-family-mistral-en)

2023 年 4 月，三個離開 Meta 和 Google DeepMind 的法國工程師創立了 Mistral AI——Arthur Mensch、Guillaume Lample 和 Timothée Lacroix。他們的策略從一開始就很明確：不做最大的模型，做最有效率的模型，再用歐洲資料主權打進企業市場。三年後這條路走到了兆級：2026 年 10 月的 Mistral Large 4 是 Mistral 第一個 1T 參數模型，也是目前西方實驗室釋出的最大開放權重旗艦之一。這是「AI 模型家族」系列的第六篇家族深度介紹，正文以 Large 4 世代為主，Mistral 7B 到 Medium 3.5 的演化放在家族演化時間線。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族定位與版本矩陣

以 Mistral 官方模型總覽頁上架的型號為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Mistral Large 4（`mistral-large-4`） | 通用旗艦，coding、資安、文件與視覺 | 1T 總參數／52B 啟用 MoE，1M context，$0.70／$2.10 | API；權重採 Mistral Ecosystem Open-Weight License |
| Mistral Small 4（`mistral-small-2603`） | 低成本主力與自架 | 119B 總參數／6.5B 啟用 MoE，256K，$0.15／$0.60 | API；Apache 2.0 權重 |
| Ministral 3 3B／8B／14B | 邊緣與端側 | 稠密小模型，支援文字與影像 | Apache 2.0 權重 |
| Voxtral 3 系列 | 語音轉錄、TTS、語音 agent | Small／Mini Transcribe 3、TTS 3、即時轉錄 | API（歐盟託管）或自架 |
| OCR 4.1、Codestral、Embed 系列 | 文件理解、程式碼補全、向量 | 任務專用服務 | API |

### 兩條產品線：開放權重換生態，主權平台收營收

**開放權重線**（Hugging Face 上的 `mistralai` org）：從 Mistral 7B、Mixtral 一路到 Large 4，Mistral 的旗艦幾乎都放出權重。2025 年 12 月的 Large 3 是 Apache 2.0；2026 年起授權開始分層——Small 4 與 Ministral 3 仍是 Apache 2.0，Medium 3.5 改用修改版 MIT（大營收公司另議），Large 4 則是 Mistral Ecosystem Open-Weight License（MaaS 業者另議）。vLLM、SGLang、llama.cpp 都有支援。

**主權平台線**（Mistral Studio API、Vibe、Forge）：Large 4 在 Mistral 自建的歐洲資料中心訓練、預覽版也在同一套基礎設施上服務；2026 年 8 月推出的 Regional Endpoints 讓推論可以指定在歐洲或美國完成。平台上也架了第三方開放模型——目前模型總覽頁列出 Z.ai GLM 5.3、GLM 5.3 Flash 與 DeepSeek V4.1 Flash。

這兩條線互相支撐：權重開放讓企業可以先在 API 試、再搬回自家機房；主權平台則賣給不想或不能自架的客戶。2026 年 9 月的 €3B Series D（[融資速報](/posts/daily/2026-09-12-funding-mistral)）也是押在「主權」這個賣點上，而不是單純的榜單分數。

### 子線收斂：一個通用模型取代多條專線

Mistral 2025 年的命名矩陣是全系列最亂的：通用的 Small／Medium／Large、推理的 Magistral、程式的 Devstral、視覺的 Pixtral 各自出版本。2026 年的方向是**收斂**：

- Small 4（2026-03）是第一個把 Magistral（推理）、Pixtral（多模態）、Devstral（agentic coding）合進同一組權重的模型，用 `reasoning_effort` 切換
- Medium 3.5（2026-04）在中階層做同一件事，取代 Medium 3.1、Magistral 與 Devstral 2
- Large 4（2026-10）把收斂推到旗艦：instruct、推理、coding、agent 都在同一組權重，官方說它也會是下一代專用模型的底座

結果是現在的選型其實只剩兩個問題：要 Large 4 的能力，還是 Small 4 的成本？專用需求（語音、OCR、補全）再另外挑對應服務。

## 家族演化

| 版本 | 發佈 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| Mistral 7B | 2023-09 | 7B 稠密，Apache 2.0 | 證明小模型配寬鬆授權可以進企業 |
| Mixtral 8x7B | 2023-12 | 46.7B 總參數／12.9B 啟用 MoE | 「用啟用參數決定成本」的 MoE 效率路線從這裡開始 |
| Mistral Large（初代） | 2024-02 | 首個只走 API 的商用旗艦 | 開放權重之外多了一條閉源商用線 |
| Mixtral 8x22B | 2024-04 | 141B 總參數 MoE | 大型開放 MoE 可自架 |
| Mistral Small 3.1 | 2025-03 | 24B，Apache 2.0 | 24B 級別成為單卡自架的甜蜜點；已於 2025-11-30 停用 |
| Magistral／Devstral | 2025-05～07 | 推理與 agentic coding 專線 | 專線各自迭代，命名矩陣最複雜的時期；2025 年底到 2026 年陸續停用 |
| Mistral 3（Large 3、Ministral 3） | 2025-12-02 | Large 3 為 675B 總參數／41B 啟用 MoE，Apache 2.0；Ministral 3 為 3B／8B／14B | 旗艦重新開放權重，通用旗艦不再只走 API |
| Mistral Small 4 | 2026-03-16 | 119B／6.5B 啟用 MoE，256K，Apache 2.0 | 推理、視覺、coding 併入同一個小模型，不必再挑專線 |
| Mistral Medium 3.5 | 2026-04-28 | 128B 稠密，256K，修改版 MIT，$1.50／$7.50 | 中階通用模型取代 Medium 3.1、Magistral、Devstral 2；2026-10-31 已 deprecated |
| Le Chat 改名 Vibe | 2026-05-28 | Work、Code、Chat 三種模式 | 消費者產品從聊天轉成工作 agent |
| Regional Endpoints | 2026-08 | 推論區域可選歐洲或美國 | 「資料不出歐洲」可以寫進合約 |
| Mistral Large 4 預覽 | 2026-10-06 | 1T 參數 MoE，公開預覽 API，掛牌 $1.36／$4.18、實收五折 | 旗艦規模追上中國開放模型，但規格與授權當時未定（[模型卡](/posts/daily/2026-10-07-model-mistral-large-4)、[促銷定價](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale)） |
| Voxtral 3 | 2026-10-22 | 轉錄、TTS 與語音 agent SDK | 語音 agent 有了同一家的全套元件 |
| Mistral Large 4 權重釋出 | 2026-10-29 | 再經三週 RL，權重上 Hugging Face，API 正式價 $0.70／$2.10 | 目前的選型基準，見下方各節（[定價追蹤](/posts/daily/2026-11-03-pricing-mistral-large-4-permanent-price)） |

三年的主線是：**從小模型建立效率口碑，2025 年底重新把旗艦開放，2026 年把專線收回通用模型、把規模推到兆級**。中間有一段（2024–2025）通用旗艦只走 API，Large 3 之後的通用旗艦都附權重；OCR、Codestral 這類專用服務仍只在 API 上。

## 架構與訓練取捨

### Large 4：細顆粒 MoE

[Hugging Face 模型卡](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B)寫明 Large 4 的結構：約 1T 總參數、128 個 routed experts 每個 token 啟用 4 個，外加 1 個 shared expert；每 token 啟用 49B 參數（含 embedding 與輸出層為 52B），另有 1.6B 的視覺編碼器。文件卡的寫法是「52B 啟用、1.05T 總參數」，兩種數字差在有沒有算 embedding，不是兩個版本。

這延續了 Mixtral 以來的思路：總參數決定知識容量，啟用參數決定推論成本。對照前代 Large 3（675B／41B），總參數多了約五成，啟用參數只多了約四分之一。檢查點內建 DSpark speculative decoding 草稿頭，另有給 Blackwell GPU 用的 NVFP4 量化版。

### 訓練：歐洲自建算力與 RL

Large 4 在 Mistral 自有歐洲資料中心的 3,800 張 NVIDIA Grace Blackwell 上從頭訓練（Large 3 是 3,000 張 H200），訓練資料涵蓋 160 種以上語言、包含所有歐盟官方語言。預覽版上線後，Mistral 又做了三週 RL 才釋出權重，官方稱 coding 與防禦型資安進步最多：Terminal-Bench 4.0 從預覽版的 28.3% 升到 41%，同時輸出 token 少 30%。

這帶出兩個取捨：

- **推理深度可調**：權重版支援 low／medium／high 三檔（預設 high），low 取代了預覽版的 none。官方強調的是 token 效率——Artificial Analysis Coding Agent Index 與 GLM-5.3 同分（48%）時，平均每題少用 47% 的 token
- **資安能力與拒答的平衡**：預覽期給資安夥伴與政府機構的是「降低審查、擴大資安能力」的版本；公開權重版則內建護欄，官方自測對惡意資安請求的平均拒答率 96.6%，同時不拒絕漏洞重現、修補這類防禦工作

### Small 4：小啟用量的 MoE

Small 4 的名字容易誤會——它不是 24B 稠密模型，而是 119B 總參數、每 token 只啟用約 6.5B（不含 embedding 為 6B）的 MoE，同樣是 128 個 experts 啟用 4 個。官方稱延遲比 Small 3 降 40%、吞吐量是三倍；最低部署需求是 4 張 H100 或 1 張 DGX B200，所以「小」指的是推論成本，不是單卡就能跑。

## 評測與競品比較

以下數字都標明來源；同一張表不混用不同條件的分數。

### 官方自報（Large 4 權重版，2026-10-29）

| Benchmark | Mistral Large 4 | 對照（官方公告列出） | 條件 |
|---|---|---|---|
| Artificial Analysis Coding Agent Index | 48% | GLM-5.3 約同分，Large 4 每題少用 47% token | AA 公開的推理檔位 |
| Terminal-Bench 4.0 | 41% | 預覽版 28.3%；官方稱開放權重模型第一 | 同上 |
| Cognition FrontierCode 2.0 | 19.7% | 官方稱領先 | Cognition 私有評測 |
| Artificial Analysis Cyber Index | 51% | — | 找漏洞、重現、修補 |
| 惡意資安請求拒答率 | 96.6% | 官方稱開放模型最高 | JailbreakBench、StrongREJECT、AgentHarm 的資安題平均 |
| Surge Code 盲測人類偏好 | 勝過 GLM-5.3、Kimi K3、DeepSeek V4.1 Flash | 只輸 Claude Opus 5.5 | Surge AI 盲測 |

### 第三方綜合指標

Hugging Face 模型卡引用的 Artificial Analysis Intelligence Index v5 給 Large 4 **26 分**，官方的說法是「西方開放權重模型最高」，同時承認中國領先的開放模型在這個綜合指標上分數更高。預覽版當時在 v4.3.2 拿 38 分、落後 GLM-5.3 與 Kimi K3 等 6–8 分（[模型卡](/posts/daily/2026-10-07-model-mistral-large-4)）；v4 與 v5 的分數尺度不同，不能直接相減。

### 跟競品的位置

- **對上中國開放模型（GLM-5.3、Kimi K3、DeepSeek V4.x）**：綜合推理仍落後，coding agent 指標接近、token 用量明顯較少。Large 4 的差異化在於訓練與服務都在歐洲、權重來源可追溯，對歐洲受監管客戶是合規問題，不只是分數問題
- **對上西方開放模型**：官方與 Artificial Analysis 都把它放在西方開放權重的第一位
- **對上閉源前沿（Claude、GPT、Gemini）**：人類偏好盲測仍輸 Claude Opus 5.5；預覽版的漏洞重現測試則因為閉源模型拒答而拿到高分（82%），這個優勢來自拒答政策差異，不代表一般能力領先
- **Small 4**：官方只公布相對 Small 3 的延遲與吞吐提升，本文引用來源沒有與同級競品的可比分數

## 授權、價格與部署

### 三種授權，選型前先看是哪一種

| 授權 | 適用模型 | 重點限制 |
|---|---|---|
| Apache 2.0 | Small 4、Ministral 3、Large 3、Voxtral Small | 無附加條款，可商用、可再散佈 |
| 修改版 MIT（Medium 3.5） | Medium 3.5 | 可商用，但大營收公司有例外，需另議 |
| Mistral Ecosystem Open-Weight License | Large 4 | 可商用、微調、再散佈；經營 MaaS（讓第三方透過 API 自由控制輸入、參數或訓練資料）要另簽商用授權。內部使用、或模型只嵌在特定產品功能裡，不受此限 |

注意 Mistral 定價頁的 FAQ 對自架的描述仍寫著「開放權重模型以 Apache 2.0 供研究／個人使用，商用部署需 Mistral 授權」，跟各模型卡上的授權條款口徑不一致。實際以每個模型 Hugging Face 頁面附的 LICENSE 為準。

### API 定價（USD／1M tokens，Mistral 文件卡）

| 模型 | Input | Cached input | Output | Context |
|---|---|---|---|---|
| Mistral Large 4 | $0.70 | $0.07 | $2.10 | 1M |
| Mistral Small 4 | $0.15 | — | $0.60 | 256K |

Batch 處理一般打五折、快取輸入最多省 90%（定價頁通則）。Large 4 的價格演變——預覽掛牌 $1.36／$4.18、實收五折、10/29 起改成 $0.70／$2.10 正式價——細節見[定價追蹤](/posts/daily/2026-11-03-pricing-mistral-large-4-permanent-price)。

### 已停用與排定停用

Mistral 模型總覽頁的停用表（deprecation／retirement）：

| 型號 | Deprecated | 停用 | 官方建議替代 |
|---|---|---|---|
| Mistral Large 3（`mistral-large-2512`） | 2026-10-31 | 2027-04-30 | Mistral Large 4 |
| Mistral Medium 3.5（`mistral-medium-3-5`） | 2026-10-31 | 2027-04-30 | Mistral Large 4 |
| Mistral Medium 3／3.1 | 2026-05-22 | 2026-08-31 | Medium 3.5（現已再被 Large 4 取代） |
| Mistral Small 3.2 | 2026-04-30 | 2026-07-31 | Mistral Small 4 |
| Devstral 2、Magistral Medium 1.2 | 2026-05-22 | 2026-07-31 | Medium 3.5 |
| Mistral Large 2.1、Pixtral Large | 2026-02-27 | 2026-05-31 | Medium 3.5 |

停用只影響 Mistral 自家 API；已下載的權重不受影響。雲端轉售商的停用日可能跟原廠不同，Azure Foundry 就曾比原廠晚 100 天以上才下架 Medium 3（[定價追蹤](/posts/daily/2026-10-31-pricing-azure-foundry-claude-haiku-mistral-retirement-mismatch)）。

### 部署

Large 4 自架建議用 vLLM 或 SGLang，Transformers 與 llama.cpp（GGUF）也有支援；NVFP4 量化版針對 Blackwell。官方 API 有多個區域，包括 Mistral 全程自營、依歐洲法律運作的歐洲部署。

## Agent 使用與選型

- **歐洲合規、要自架旗艦** → Large 4：權重可下載，訓練與服務都在歐洲；先確認自己是不是 MaaS 業者
- **coding agent、成本敏感** → Large 4 搭 medium 推理檔：官方主打 token 效率，同分下 token 少近一半，帳單取決於你的平均輸出長度
- **防禦型資安 agent（漏洞重現、修補、偵測規則）** → Large 4：這類任務的拒答率低於多數閉源模型；仍建議在自己的工作負載上驗證
- **高量、低延遲、要 Apache 2.0** → Small 4：$0.15／$0.60，可用 `reasoning_effort` 在快速回覆與深度推理間切換
- **邊緣與端側** → Ministral 3 3B／8B／14B
- **語音 agent** → Voxtral 3 轉錄與 TTS，搭配其語音 agent SDK
- **要綜合推理的最高分** → Large 4 不是首選，中國領先的開放模型與閉源前沿都更高
- **還在用 Large 3 或 Medium 3.5** → 2027-04-30 停用，提早換到 Large 4 並重跑自己的評測；Large 3 是 Apache 2.0、Large 4 不是，換版本前先讓法務看授權差異

最小的選型驗證：用同一組 20–50 題自家任務，分別跑 Large 4 的 low／medium／high 與 Small 4，記錄成功率、平均輸出 token 與單題成本。Large 4 的優勢主張集中在 token 效率，這個數字最容易在自己的資料上驗證。

## 限制與取捨

- **綜合推理仍有差距**：Artificial Analysis 綜合指標上，Large 4 落後中國領先的開放模型；官方的「最強」都附有「開放權重」或「西方」的前提
- **授權不再一律寬鬆**：Large 4 的 MaaS 條款、Medium 3.5 的大營收例外，都讓「Mistral＝Apache 2.0」的印象過時
- **規格說法曾不一致**：預覽版發佈當天，啟用參數（49B／52B）與 context（1M／512K）的官方與第三方說法互相矛盾；權重版模型卡已寫明 49B（不含 embedding）／52B（含）與 1M context，但第三方平台列出的 context 仍要以實際 API 為準
- **自架門檻高**：Large 4 是兆級 MoE，就算有 NVFP4，也不是一般團隊的單機工作負載；Small 4 的最低需求也是多張 H100
- **評測多為官方自報**：上表除 Artificial Analysis 綜合指標外，多數是 Mistral 自測或自選對照，換成即時排行榜前段班時差距可能更大

## 更新紀錄

- **2026-11-23**：補上 Large 4 世代（2026-10-06 公開預覽、10-29 釋出權重），矩陣、評測、定價與選型改寫為 Mistral 官方模型總覽、Large 4 模型卡與兩篇發佈公告的內容；新增授權分層表與停用時程。Medium 3.5 與 Large 3 降為歷史世代，當時的細節見時間線連結的每日模型卡與定價追蹤。修正錯誤：Large 3 原寫「2025-07、只有 API 的閉源商用模型」，實為 2025-12-02 發佈的 675B／41B 啟用 Apache 2.0 開放權重模型；Small 4 原寫「2026-06、24B 稠密、128K」，實為 2026-03-16 發佈的 119B／6.5B 啟用 MoE、256K；Devstral Small 2 原寫 2025-05，實為 2025-12；Le Chat 已改名 Vibe。移除與現行世代無關、未附來源的競品分數。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [Mistral AI Official](https://mistral.ai/)
- [Introducing Mistral Large 4 — Mistral](https://mistral.ai/news/mistral-large-4) — 2026-10-06 公開預覽、3,800 張 Grace Blackwell、預覽版評測
- [Mistral Large 4 (Le Chonk) is now open weight — Mistral](https://mistral.ai/news/mistral-large-4-oss/) — 2026-10-29 權重釋出、三檔推理、Coding Agent Index、Cyber Index、授權與正式價
- [Mistral-Large-4-1T-A52B — Hugging Face](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B) 與 [LICENSE](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/main/LICENSE) — 架構、1M context、AA Intelligence Index v5、MaaS 條款
- [Mistral Large 4 — Mistral Docs](https://docs.mistral.ai/models/mistral-large-4-0) — 52B／1.05T、$0.70／$2.10
- [Introducing Mistral Small 4 — Mistral](https://mistral.ai/news/mistral-small-4) 與 [Mistral Small 4 — Mistral Docs](https://docs.mistral.ai/models/mistral-small-4-0-26-03) — 119B／6B 啟用、256K、Apache 2.0、$0.15／$0.60
- [Remote agents in Vibe. Powered by Mistral Medium 3.5 — Mistral](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5/) 與 [Mistral Medium 3.5 — Mistral Docs](https://docs.mistral.ai/models/mistral-medium-3-5-26-04) — 128B 稠密、修改版 MIT、deprecated
- [Introducing Mistral 3 — Mistral](https://mistral.ai/news/mistral-3) — Large 3 675B／41B、Ministral 3、Apache 2.0
- [Voxtral 3 — Mistral](https://mistral.ai/news/voxtral-3/)
- [Vibe gets to work — Mistral](https://mistral.ai/news/vibe-agent/) — Le Chat 改名 Vibe
- [Mistral Models Overview](https://docs.mistral.ai/models) — 現役模型、授權、停用表
- [Mistral Pricing](https://mistral.ai/pricing)
- [Mistral Small 3.1](https://mistral.ai/news/mistral-small-3-1/)
- [Regional Inference and Open Models — Mistral](https://mistral.ai/news/regional-inference-open-models-new-compute/)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
