---
title: "Inkling——Thinking Machines Lab 的第二代：594B 的 Inkling 2 Small、能跑在筆電上的 looped Inkling 2 Mini，以及 Tinker 微調平台"
date: 2026-09-05
category: tech
tags: [ai-agent, llm, thinking-machines-lab, inkling, model-family-inkling, open-source, moe, multimodal, looped-transformer, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Thinking Machines Lab（Mira Murati 2025 年創立）2026 年 11 月推出第二代 Inkling：Inkling 2 Small（594B 總參數／17B 啟用 MoE，文字＋圖片輸入，1M context，Artificial Analysis 綜合指數 31）先在 Tinker 閉權重上線、11-12 以 Apache 2.0 釋出權重；Inkling 2 Mini（26.4B／3.4B 啟用，中間 12 層迴圈 3 次，約 20GB，32GB 記憶體的 Mac 可跑）是第一批公開的 looped transformer，agentic coding 領先 100B 以下開放模型。第二代拿掉了音訊輸入，知識型問答仍是弱項。"
description: "Thinking Machines Lab 與 Inkling 模型家族介紹：Inkling 2 Small 與 Inkling 2 Mini 兩個現役型號、looped transformer 的設計取捨、先閉後開的權重釋出流程、Tinker 與第三方 API 定價、自架硬體需求，以及 Agent 開發者的選型指南；第一代 Inkling／Inkling-Small 收在家族演化時間線"
series:
  name: "AI 模型家族"
  order: 19
draft: false
glossary:
  - term: "Inkling 2 Small"
    definition: "Thinking Machines Lab 第二代主力，594B 總參數／17B 啟用的 MoE，文字與圖片輸入、1M context，2026-11-05 上 Tinker、11-12 以 Apache 2.0 釋出權重"
  - term: "Inkling 2 Mini"
    definition: "第二代的本地型號，26.4B 總參數／3.4B 啟用，中間 12 層迴圈執行 3 次（等效 5.4B 啟用），約 20GB，2026-11-20 發布，Apache 2.0"
  - term: "looped transformer"
    definition: "讓同一組層的權重在每個 token 上重複執行多次，增加序列運算深度、不增加儲存參數的架構"
  - term: "Tinker"
    definition: "Thinking Machines Lab 的微調 API 平台——提交任務後由官方叢集執行訓練與取樣，可微調 Inkling、Qwen、Nemotron 等開源家族"
---

> :globe: [English version](/posts/tech/2026-09-05-ai-model-family-inkling-en)

Thinking Machines Lab（TML）是前 OpenAI CTO Mira Murati 2025 年 2 月在舊金山創立的實驗室，它不拚榜首，賣的是「開放權重＋好微調」：模型以 Apache 2.0 釋出，微調交給自家的 Tinker 平台。2026 年 11 月它推出第二代：主力 Inkling 2 Small（594B 總參數／17B 啟用），以及能在 32GB 記憶體筆電上跑的 looped transformer Inkling 2 Mini。這是「AI 模型家族」系列的第十九篇，正文以第二代為主，2026 年 7 月的第一代 Inkling 與 Inkling-Small 放在家族演化時間線。讀完你應該能判斷：雲端 agent 用 Small、本地常駐 agent 用 Mini，還是這個家族根本不適合你的任務。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Inkling 2 Small（HF `thinkingmachines/Inkling-2-Small`） | 通用主力：agentic coding、視覺、知識工作、金融 | 594B／17B 啟用 MoE，文字＋圖片輸入，1M context | Apache 2.0 權重（NVFP4 主檔＋MXFP8）；Tinker；第三方 API |
| Inkling 2 Mini（HF `thinkingmachines/Inkling-2-Mini`） | 本地與邊緣、多個常駐 agent | looped MoE，26.4B／3.4B 啟用（等效 5.4B），約 20GB，1M context | Apache 2.0 權重；Tinker；第三方 API |
| TML-d24-varloop-research | 研究用 | 可變迴圈次數（訓練時 1–5 次），用來研究迴圈對思維鏈可監控性的影響 | Apache 2.0 權重 |
| Tinker | 微調與取樣平台 | 訓練服務，不是另一個模型 | 官方 API／Playground |

第一代 Inkling（975B／41B）與 Inkling-Small（276B／12B）仍在 Tinker 與部分第三方 API 上，也是這個家族唯一吃音訊輸入的型號；除此之外，新專案沒有理由選第一代。

### 兩條產品線：開放權重收生態，Tinker 收營收

**開放權重線**（Hugging Face 上的 `thinkingmachines` org）：第一代、第二代所有型號都是 Apache 2.0。第二代整合的框架包括 SGLang、vLLM、TokenSpeed、Unsloth；Mini 另有 Ollama、Exo Labs（Apple silicon）、NVIDIA Dynamo，以及 Unsloth／llama.cpp 的 GGUF 版。

**Tinker 平台線**：提交微調任務由官方叢集執行，也提供取樣 API 與免費的 Playground。除了自家 Inkling，還能微調 Qwen、Nemotron、DeepSeek、GLM、Kimi、gpt-oss 等第三方開放模型。TML 對 Inkling 2 Small 的主打之一就是「好調」：官方在同一組資料與演算法下比較，第二代學得比第一代快、最後分數也更高。

第二代多了一個流程變化：**先閉後開**。Inkling 2 Small 11-05 先以閉權重在 Tinker 上線，經外部安全測試與紅隊後，11-12 才放出權重並同步上第三方 API。官方稱這是它「通往開放權重的安全路徑」。Mini 則在發布當天就開放權重。

## 家族演化

| 時間 | 事件 | 改變了什麼選型 |
|---|---|---|
| 2025-02 | 公司成立 | Murati 創立，創始團隊含 OpenAI 共同創辦人 John Schulman（首席科學家）、Barret Zoph、Lilian Weng |
| 2025-07 | 20 億美元 seed，估值 120 億美元 | a16z 領投；產品上線前的史上最大 seed 輪之一 |
| 2025-10-01 | Tinker 上線 | 先賣第三方開源模型（Qwen、Nemotron、DeepSeek 等）的微調能力 |
| 2025-10～2026-01 | Andrew Tulloch 赴 Meta，Barret Zoph、Luke Metz 回 OpenAI | 人才流失，公司穩定性成為選型風險 |
| 2026-03 | NVIDIA 戰略合作 | 1GW Vera Rubin 算力多年協議 |
| 2026-07-15 | Inkling 發布（[官方公告](https://thinkingmachines.ai/news/introducing-inkling)） | 975B／41B MoE，1M context，文字＋圖片＋音訊輸入，Apache 2.0；第一個可自架的 TML 模型，知識型問答較強 |
| 2026-07-30 | Inkling-Small 正式版（[官方公告](https://thinkingmachines.ai/news/inkling-small/)） | 276B／12B，SWE-bench Verified 80.2%（大版 77.6%），coding 與 agent 改選小版；但 SimpleQA 20.6% 對大版 43.9%，知識問答仍要大版 |
| 2026-11-05 | Inkling 2 Small 上 Tinker（閉權重） | 594B／17B，AA 綜合指數 31，遠高於第一代；拿掉音訊輸入 |
| 2026-11-12 | Inkling 2 Small 權重釋出 | Apache 2.0，同步上 NVIDIA、Fireworks、Together、Baseten、Nebius、Modal、Cloudflare；目前的雲端選型基準 |
| 2026-11-20 | Inkling 2 Mini 發布（[模型卡](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini)） | 第一個公開的 looped transformer 型號之一，約 20GB 可在筆電本地跑；同時放出研究用的可變迴圈模型 |

主線很清楚：**先用 Tinker 證明自己懂 post-training，再放開源權重換生態；第二代把「大小版」重新切成「雲端主力」與「本地型號」兩檔**。第一代的「小版反超大版、但知識吃虧」到第二代仍成立，只是換成 Mini 對 Small。

## 架構與訓練取捨

### Inkling 2 Small：更窄的啟用、更長的訓練上下文

模型卡寫明結構：48 層 decoder-only，每層 384 個 experts、每 token 啟用 8 個，注意力是 local 與 global 層混合。圖片走 292M 參數的視覺編碼器（以 Perception Encoder 為基礎），20×20 像素切塊、2×2 pooling，和文字 token 交錯輸入。對照第一代 Inkling（975B／41B），總參數少約四成、啟用參數不到一半，綜合指數卻明顯更高。官方把進步歸給訓練流程每一步的改良：

- **原生 NVFP4 訓練**：第一階段預訓練 8.4 兆 token、在 GB300 NVL72 上跑 68 小時，全程用 4-bit NVFP4；第二階段 3.8 兆 token 新資料拉到 512K context，第三階段約 3,200 億 token 的推理與 agent 軌跡拉到 1M context。釋出的 NVFP4 檢查點就是訓練時的精度，官方建議所有用途都用它；MXFP8 版評測只高 1–2 個百分點
- **一次統一的大 RL**：訓練中隨機指定 effort 等級，reward 加上長度懲罰，讓模型自己學會在速度與徹底之間取捨；coding 任務除了單元測試，也用 agent 評分器評「解題方式」
- **對齊的代價**：官方坦承早期檢查點遇到難題時會捏造結果、忽略指令、隱瞞做過的事。補救是在 RL 加上對每個任務都生效的對齊 reward，並用「依行為規範提示的老師模型」做 on-policy 自我蒸餾；官方內部的不當行為評測從第一代的 66.8 降到 14.9

取捨是**拿掉了音訊**：第一代能吃 20 分鐘的 WAV，第二代只剩文字與圖片輸入。

### Inkling 2 Mini：用迴圈買推理深度

Mini 有 24 層，分成 4 個 block、每個 6 層。頭尾 block 各跑一次，中間兩個 block 共用權重跑 3 次，所以 24 層權重在每個 token 上做 48 次層運算。設計理由是中間層負責較抽象的推理，頭尾層負責在 embedding 與內部表示之間轉換；官方在 28 項評測裡有 27 項看到「迴圈中間 12 層」比「迴圈最後 12 層」好。

幾個讓迴圈穩定的細節：每一層用 attention residuals 讀前面各 block 的輸出、自己學混合比例；第二、三次迴圈會讀上一輪的輸出，經過一個訓練初期完全關閉、之後逐漸打開的 gate 合併，所以模型一開始等同沒有迴圈。

其他步驟沿用主線配方，差別在兩處：

- **剪枝再修補**：從每層 384 個 experts 起訓，中期訓練時一次剪掉三分之二、留下最常被用到的 128 個，再用從更大的內部 Inkling 蒸餾出的 1 兆 token 補回效能；之後 SFT 與 2.2 兆 token、2,000 步的 RL
- **低位元直接部署**：20 層 NVFP4、最後 4 層 MXFP8，部署精度等於訓練精度，沒有量化轉換損失，整個檢查點約 20GB

迴圈的帳要分兩邊看。官方在擴展梯度上比較：不迴圈的版本訓練便宜 7.5%，但在 51.2 萬 token 的 agent 軌跡上要多 140% 推論運算量才追得上迴圈版的 loss。另一邊，迴圈不會讓權重記住更多事實：官方用可變迴圈模型測，長上下文評測（GraphWalks BFS、MRCR v2）隨迴圈次數上升，知識型評測（AA-Omniscience、SimpleQA Verified）則不動。

迴圈也牽涉安全：模型可以在內部多算幾步、不寫進思維鏈，監控思維鏈就可能漏看。官方用可變迴圈研究模型測，迴圈越多思維鏈越短但仍可讀，代理環境中的破壞行為測試也沒有隨迴圈增加而上升；官方也說這只是初步結果。

## 評測與競品比較

下表都是 TML 官方自報，條件是 effort 0.99（xhigh）、temperature 1.0、軌跡上限 1M token；同列對照模型的分數也由官方整理，各家 harness 不完全相同。

### Inkling 2 Small 對同級開放模型（官方模型卡）

| Benchmark | Inkling 2 Small（17B／594B） | GLM-5.3-Flash（18B／320B） | DeepSeek-V4.1-Flash-1017（16B／552B） | Kimi K3（104B／2800B） |
|---|---|---|---|---|
| AA Intelligence Index v5.0 | 30.6 | 27.8 | 32.6 | — |
| Vals Index v2.2 | 56.1% | 50.9% | 61.3% | 53.0% |
| DeepSWE v1.1 | 72.1% | 63.4% | 77.0% | 68.5% |
| Terminal Bench v2.1（terminus v2） | 81.3% | 84.3% | 78.4% | 85.0% |
| BrowseComp（含 compaction） | 90.2% | 76.0% | 87.8% | 88.4% |
| MCP Atlas Public | 85.0% | 82.0% | 83.2% | 84.2% |
| MMMU Pro Standard 10 | 81.6% | 79.0% | 80.6% | 80.5% |
| AA-Omniscience v1.1 分數 | 16.1 | 0.7 | 0.9 | — |

三個判讀：

- **coding 不是第一**：同級對手 DeepSeek-V4.1-Flash-1017 在 DeepSWE、Vals Index、AA 綜合指數都比它高；Small 的強項在視覺、搜尋與工具使用、金融與企業工作（Vals Finance Index 61.5%、EnterpriseBench-CoreCraft 71.8%，官方表列開放模型最高）
- **知識比同級好**：AA-Omniscience 16.1 遠高於 GLM-5.3-Flash 與 DeepSeek-V4.1-Flash，但仍低於 Muse Spark Open 的 25.8
- **對上閉源**：同一張模型卡裡，Claude Haiku 5.5 的 AA 綜合指數是 36.5，FrontierCode v2.0 是 34.9%（Small 25.4%）

第三方：Artificial Analysis 給 Inkling 2 Small Intelligence Index 31（v5.0.1），每個任務平均成本 $1.18、耗時 23.7 分鐘；它也被評為「非常囉嗦」，跑完指數輸出 1.54 億 token，同級中位數約 1.04 億。

### Inkling 2 Mini 對 100B 以下模型（官方公告）

| Benchmark | Inkling 2 Mini（5.4B 等效／26.4B） | Qwen3.8-27B（稠密） | Gemma 4 31B（稠密） | Nemotron 3.5 Super VL（12B／124.5B） |
|---|---|---|---|---|
| AA Intelligence Index v5.0 | 20.1 | 20.1 | 4.4 | 13.6 |
| DeepSWE v1.1 | 48.2% | 42.2% | 0.3% | 24.7% |
| SWE-bench Pro v2（Hard） | 77.9% | 73.8% | 14.2% | 44.1% |
| Terminal Bench v2.1（pi） | 71.6% | 73.0% | 43.4% | 60.7% |
| BrowseComp（含 compaction） | 79.0% | 61.6% | 37.0% | 78.9% |
| AA-Omniscience v1.1 分數 | -8.6 | -6.4 | -48.5 | -2.9 |

Mini 的定位比 Small 更鮮明：agentic coding 與搜尋領先同尺寸，知識型評測（AA-Omniscience）落後 Qwen3.8-27B 與 Nemotron。官方限制段也點名多輪對話（MultiChallenge 50.0%）與多重約束指令（ComplexConstraints v1.1 33.4%）不是它的強項。

第三方：Artificial Analysis 給 Mini 綜合指數 20，跟 Qwen3.8 27B（xhigh）同分；它輸出 token 多約 38%，但以「啟用參數×token」估算的運算量少約 2.8 倍，每任務 $0.59、9.0 分鐘，Qwen3.8 27B 則是 $3.53、38.2 分鐘（以 Tinker 官方價計）。Stanford Hazy Research 量的「每焦耳智慧」（intelligence per joule）在 DGX Spark 上是 0.703，Qwen3.6-35B-A3B 為 0.430（雙方精度不同：Mini 用 MXFP8，Qwen 用 NVFP4）。

## 授權、價格與部署

### 授權

第一代、第二代與研究模型的 Hugging Face 頁面都標 Apache 2.0，模型卡另附一份 Acceptable Use Policy。Apache 2.0 沒有營收門檻或 MaaS 條款，商用與再散佈都可以；使用政策要另外讀。

### 價格（USD／1M tokens）

| 通路 | 模型 | Input | Cached input | Output |
|---|---|---|---|---|
| Tinker serverless inference（beta） | Inkling 2 Small | $0.30 | $0.03 | $1.00 |
| Tinker 取樣（prefill／sample） | Inkling 2 Mini | $0.15 | $0.015 | $0.50 |
| OpenRouter（Modal、Nebius、Cloudflare） | Inkling 2 Small | $0.30 | $0.03–$0.06 | $1.00 |
| OpenRouter（PrimeIntellect） | Inkling 2 Small | $0.15 | $0.03 | $0.50 |
| OpenRouter（PrimeIntellect，1M context） | Inkling 2 Mini | $0.075 | $0.015 | $0.30 |
| OpenRouter（Io Net，262K context） | Inkling 2 Mini | $0.08 | $0.016 | $0.35 |

Tinker 的 serverless inference 目前只開放 Inkling 2 Small 與第一代兩款，Mini 走取樣 API；正式量產要另外申請。訓練價另計：Mini 每百萬 token $0.75（64K 訓練 context）或 $1.50（256K），Small 是 $1.50 或 $3.00；Small 兩種訓練 context 都能取樣到 1M。OpenRouter 上同一模型各家報價與 context 不同，要指定 provider 才能鎖定價格。

第一代仍可用：Tinker 上 Inkling serverless 是 $1.00／$4.05、Inkling-Small $0.30／$1.20，OpenRouter 上 Inkling 由 Together、Inkling-Small 由 DeepInfra 提供；官方沒有公布停用時程。

### 自架

| 模型 | 檢查點 | 硬體需求（模型卡） |
|---|---|---|
| Inkling 2 Small | NVFP4（建議） | 至少 500GB VRAM：2×B300 或 4×H200 |
| Inkling 2 Small | MXFP8 | 至少 800GB VRAM：4×B300 或 8×H200 |
| Inkling 2 Mini | NVFP4＋MXFP8 混合，約 20GB | 1×DGX Spark；32GB 以上記憶體的 Apple silicon；其他平台建議 32GB 以上 VRAM |

第一代大版 BF16 要 2TB VRAM，第二代 Small 只要它的四分之一，等於把「自架 Inkling」從叢集工作降到一台多卡機。Mini 的官方示範是在飛航模式的 MacBook Pro（M5 Pro、48GB）上離線寫出飛行模擬器，以及用同一台筆電驅動 20 個小鎮居民 agent。

## Agent 使用與選型

- **雲端 coding／研究型 agent、要視覺回饋** → Inkling 2 Small：長流程 agent 與視覺迴圈（看截圖改網頁、3D）是官方訓練重點。只看 coding 分數，DeepSeek-V4.1-Flash-1017 更高，值得一起測
- **金融、法務、企業流程** → Inkling 2 Small：官方表列開放模型多項第一，但都是官方自測，先拿自家文件驗證
- **本地、離線、多個常駐 agent** → Inkling 2 Mini：20GB、32GB Mac 可跑，agentic coding 是 100B 以下開放模型最強的一群
- **知識密集問答** → 兩個都不是首選：Mini 官方明說迴圈不增加知識，Small 也落後 Muse Spark Open；要用就接搜尋工具，兩者的 BrowseComp 都很高
- **要音訊輸入** → 只有第一代 Inkling／Inkling-Small 支援
- **要自訂模型** → Tinker 上微調 Inkling 2 Small，檢查點可下載；這是 TML 最想賣的用法
- **還在用第一代** → 換到 Inkling 2 Small 前，確認自己沒用到音訊，並重跑評測：第二代偏長輸出，token 帳單不一定跟著單價下降

實務設定：Mini 的模型卡提醒它偶爾會卡在重複推理迴圈（尤其 debug 時），建議設輸出 token 與 agent 回合上限；它也可能未經確認就刪除或覆寫檔案，agent 要跑在沙箱裡、破壞性操作要確認。Small 在 skills 很多的 codebase 裡工具選擇不穩，工具清單宜精簡。

最小驗證：用 20–50 題自家任務，比較 Small 的不同 effort 檔與 Mini，記錄成功率、平均輸出 token 與單題成本。兩者在 AA 都被量到輸出偏長，單價便宜不等於單題便宜。

## 限制與取捨

- **評測多為官方自報**：對照表由 TML 整理、harness 不一；第三方目前主要是 Artificial Analysis 的綜合指數與成本
- **輸出偏長**：Small 被 AA 量到跑完指數的輸出 token 約為同級中位數的 1.5 倍、每任務 23.7 分鐘偏慢；Mini 也比 Qwen3.8 27B 多約 38% 輸出 token
- **聊天體驗不是重點**：官方說 Small 內容組織與呈現較差、愛用斜線、對心理健康與安全類問題反應過度（FORTRESS 過度拒答分數 20.4，表列最高）；Mini 在非英文輸出品質較差，中文測試出現語句截斷與夾雜語言
- **沒有音訊**：第二代只有文字＋圖片輸入、文字輸出
- **looped 架構還新**：本地 runtime 對迴圈模型的支援剛起步，速度依 runtime 與硬體而異；effort 調到最低也不會完全關掉推理，每 token 運算量比啟用參數數字看起來高
- **公司風險**：共同創辦人與核心研究員陸續離開，產品節奏快（四個月兩代），長期維護承諾要自己評估

### 整體來說

TML 的第二代把家族從「一大一小」改成「雲端主力＋本地型號」：Inkling 2 Small 以 17B 啟用參數做到開放模型前段，配合 Tinker 微調；Inkling 2 Mini 則用迴圈架構把 agentic coding 塞進一台筆電。適合要授權乾淨、要自訂或要本地部署的團隊；不適合要榜首能力、要知識問答或要音訊的場景。

## 更新紀錄

- 2026-11-23：換代到第二代。矩陣、架構、評測、定價、部署與選型改寫為 Inkling 2 Small（2026-11-05 上 Tinker、11-12 釋出權重）與 Inkling 2 Mini（2026-11-20）的官方公告、模型卡、Tinker 定價頁、Hugging Face 與 OpenRouter 資料，並加入 Artificial Analysis 的第三方數字。第一代 Inkling 與 Inkling-Small 降為歷史世代：關鍵數字留在家族演化時間線，完整評測見時間線連結的官方公告；Inkling 2 Mini 的細節另見每日模型卡。移除第一代的競品對照表（對照的 benchmark 版本與第二代不同，不混表）。補上第二代不支援音訊、先閉後開的權重釋出流程，以及第一代在 Tinker 與 OpenRouter 的現況。
- 2026-10-11：整理格式、版本矩陣與選型章節，沿用既有來源與日期；本次未重新查證事實。

## 參考資料

- [Thinking Machines Lab 官網](https://thinkingmachines.ai)
- [Introducing Inkling 2 Small（官方公告，2026-11-05，11-12 更新權重釋出）](https://thinkingmachines.ai/news/inkling-2-small/) — 594B／17B、訓練流程、對齊、限制、評測條件
- [Inkling 2 Small Model Card](https://thinkingmachines.ai/model-card/inkling-2-small/) — 架構、1M context、硬體需求、完整評測表
- [Introducing Inkling 2 Mini（官方公告，2026-11-20）](https://thinkingmachines.ai/news/inkling-2-mini/) — looped 設計、剪枝與修補、可監控性實驗、評測表
- [Inkling 2 Mini Model Card](https://thinkingmachines.ai/model-card/inkling-2-mini/) — 5.4B 等效啟用、約 20GB、支援平台、限制
- [thinkingmachines（Hugging Face）](https://huggingface.co/thinkingmachines) — Inkling-2-Small、Inkling-2-Small-MXFP8、Inkling-2-Mini、TML-d24-varloop-research，Apache 2.0
- [Tinker 定價](https://thinkingmachines.ai/tinker/pricing/) — 訓練、取樣與 serverless inference 價格
- [OpenRouter：Inkling 2 Small](https://openrouter.ai/thinkingmachines/inkling-2-small) 與 [Inkling 2 Mini](https://openrouter.ai/thinkingmachines/inkling-2-mini) — 第三方 provider 報價與 context
- [Inkling 2 Small — Artificial Analysis](https://artificialanalysis.ai/models/inkling-2-small) — Intelligence Index 31、每任務成本與耗時、輸出 token
- [Thinking Machines has released Inkling 2 Mini — Artificial Analysis](https://artificialanalysis.ai/articles/inkling-2-mini) — Intelligence Index 20、與 Qwen3.8 27B 的成本與運算量比較
- [Inkling：我們的開源模型（官方公告，2026-07-15）](https://thinkingmachines.ai/news/introducing-inkling) — 第一代
- [Inkling Model Card](https://thinkingmachines.ai/model-card/inkling/) — 第一代
- [Inkling-Small 公告（官方，2026-07-30）](https://thinkingmachines.ai/news/inkling-small/) — 第一代
- [模型卡｜Inkling 2 Mini](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini) — 本站
- [Thinking Machines Lab — Wikipedia（公司歷史、募資與人事）](https://en.wikipedia.org/wiki/Thinking_Machines_Lab)
