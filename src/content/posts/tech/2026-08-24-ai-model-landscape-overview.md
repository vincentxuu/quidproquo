---
title: "AI 模型用途總覽——2026 年你該知道的模型地圖"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, model-selection, open-source, multimodal, embedding]
lang: zh-TW
type: guide
tldr: "2026 年 AI 模型按用途分成七大類、20+ 個子用途。這篇是「AI 模型家族」系列的導讀地圖——從用途找模型、從模型找家族，附每個用途的選型建議。2026-11 版：閉源前沿換成 Claude Fable 5.2、GPT-6.2、Gemini 4，開放權重最強是 Kimi K3.1 Pro，coding 改用 Artificial Analysis 的 Terminal-Bench 4.0 與 FrontierCode 2.0 比較，並新增決策模型一類；影像、影片、語音與檢索各節也換成 2026-11-23 的榜單。"
description: "AI 模型用途總覽：文字生成、推理、程式碼、影像、影片、語音、音樂、Embedding、Rerank、OCR、3D、翻譯、Agent 等 20+ 用途的 2026 年模型選型指南"
series:
  name: "AI 模型家族"
  order: 0
draft: false
glossary:
  - term: "VLM"
    def: "Vision-Language Model，能同時理解圖片和文字的多模態模型"
  - term: "MoE"
    def: "Mixture of Experts，混合專家架構——模型有多組參數但每次只啟用一部分，兼顧能力和效率"
  - term: "pipeline_tag"
    def: "HuggingFace 的任務分類標籤，用來歸類模型的用途（如 text-generation、text-to-image）"
---

> :globe: [English version](/posts/tech/2026-08-24-ai-model-landscape-overview-en)

這篇是「AI 模型家族」系列的導讀。HuggingFace 上有 47 種任務分類、超過 300 萬個模型，加上各家閉源 API，整個生態圈已經大到沒人能全部追完。這篇把它們按用途橫切成七大類、20 多個子用途，每個用途附上主要模型和選型建議——讓你從「我要做什麼」快速找到「該用哪個模型」。文字、推理、程式碼、視覺與 Agent 各節是 2026-11-20 的資料，影像、影片、語音、音樂與檢索各節是 2026-11-23 的資料；物件偵測、3D、翻譯等其餘小節仍是 2026-08 的資料，引用時請帶日期。

每個主要家族（Qwen、DeepSeek、Claude、GPT 等）會有獨立的深度介紹文，從演化脈絡到版本選擇指南。怎麼解讀各用途的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。


## 1. 核心文字能力

### 文字生成 / Chat

2026 年 11 月的格局是：閉源前沿換了一整代，開源權重最強的是 Kimi。[Artificial Analysis Intelligence Index v5.0.1](https://artificialanalysis.ai/leaderboards/models)（2026-11-20）的前幾名是 Claude Fable 5.2（64.6）、GPT-6.2 Astra（62.1）、Gemini 4 Neon（61.4）、Gemini 4 Carbon（60.0）、Claude Opus 5.5（59.1）；開放權重第一是 Kimi K3.1 Pro（46.5），之後是 DeepSeek V4.1 Flash（32.6）與 GLM-5.3（31.7），差距仍然明顯。

| 家族 | 類型 | 目前主力 | 定位 |
|---|---|---|---|
| [Claude](/posts/tech/2026-08-24-ai-model-family-claude)（Anthropic） | 閉源 | Fable 5.2、Opus 5.5、Sonnet 5.5、Haiku 5.5 | Agent／coding 主力，綜合指數第一 |
| [GPT](/posts/tech/2026-08-24-ai-model-family-gpt)（OpenAI） | 閉源＋開源 | GPT-6.2 Astra／Sol、6.1 Terra、6 Luna；gpt-oss | 最大生態系，四層價格覆蓋最廣 |
| [Gemini](/posts/tech/2026-08-24-ai-model-family-gemini)（Google） | 閉源 | Gemini 4 Carbon／Neon／Argon／Hydrogen | 多模態最全，1M context |
| [Qwen](/posts/tech/2026-08-24-ai-model-family-qwen)（阿里） | 閉源旗艦＋開源 | Qwen4-Max（API）；Qwen3.8 27B／Flash-Next（權重） | 尺寸最全，旗艦回到閉源 |
| [Kimi](/posts/tech/2026-08-24-ai-model-family-kimi)（Moonshot） | 開源 | K3.1 Pro（2.8T／104B 啟用） | 開放權重綜合最強，自訂授權 |
| [DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek) | 開源 | V4.1-Flash-1017、V4-Pro-0813 | 開放權重裡最便宜的 agentic 主力，MIT 授權 |
| [GLM](/posts/tech/2026-08-24-ai-model-family-glm)（Z.AI） | 開源 | GLM-5.3、5.3-Flash、FlashX | 資安能力最強的開放權重；旗艦改用自訂 GLM-5.3 License（百億美元級 MaaS 業者商用前要過安全審查），Flash 仍是 MIT |
| [Muse](/posts/tech/2026-09-19-ai-model-family-muse-spark)（Meta） | 閉源＋開源 | Muse Wonder／Spark 1.3／Ember；Spark Open | 三層 API，另有開放權重旗艦 |
| [MiniMax](/posts/tech/2026-08-26-minimax-model-family) | 開源 | M3.1 Flash | 單價最低的一檔，企業自動化強 |
| [LongCat](/posts/tech/2026-10-10-ai-model-family-longcat)（美團） | 開源 | LongCat-2.5 | MIT 授權的 1.6T 開放權重 |
| [Tencent Hy](/posts/tech/2026-11-23-ai-model-family-tencent-hy)（騰訊混元） | 開源 | Hy4、Hy4 flash | 金融與辦公 agent 強，自訂授權 |
| [ERNIE](/posts/tech/2026-11-23-ai-model-family-ernie)（百度文心） | 閉源旗艦＋開源 | ERNIE 5.1（API）；5.5 Flash Preview／Base | 14B 啟用的低價開放權重，尚無第三方評測 |
| [StepFun Step](/posts/tech/2026-11-23-ai-model-family-stepfun)（階躍星辰） | 開源＋閉源 API | Step 5 Preview（600B／27B 啟用）、Step 3.7 Flash；StepAudio 3（API） | 長程金融與研究 agent；旗艦改用自訂 StepFun Model License，Flash 仍是 Apache 2.0 |
| [MiMo](/posts/tech/2026-11-23-ai-model-family-mimo)（小米） | 開源 | MiMo-V2.6-Pro（1.02T／42B 啟用）、V2.6-Flash | MIT 授權的全模態 1M context，API 很便宜，但慢且輸出長 |
| [ByteDance Seed](/posts/tech/2026-11-23-ai-model-family-bytedance-seed)（豆包） | 閉源＋研究用開源 | Seed2.1 Pro／Turbo／Lite；Seed-OSS-36B、UI-TARS | 主力只走火山引擎、BytePlus、OpenRouter，評測多為自報 |
| [SenseNova](/posts/tech/2026-11-23-ai-model-family-sensenova)（商湯日日新） | 閉源＋開源 | SenseNova 6.8 Flash／Flash Lite（API）；Loop-9B | 辦公與設計 agent；Loop-9B 是 Apache 2.0 的 looped 架構 |
| [MiniCPM](/posts/tech/2026-11-23-ai-model-family-minicpm)（面壁智能） | 開源 | MiniCPM5-2B／1B、MiniCPM-V 4.7、MiniCPM-OCR 1.0 | 端側小模型，全線 Apache 2.0，強項是工具呼叫 |
| [Microsoft](/posts/tech/2026-11-23-ai-model-family-microsoft)（MAI、Phi） | 閉源＋開源 | MAI Code 2／Code 2 Flash、MAI Thinking 1；Phi-4-reasoning-vision-15B、Fara1.5 | MAI 只走 Copilot 與 Foundry、價格低但只有自報分數；Phi 等小模型 MIT／Apache 2.0 |
| [Amazon Nova](/posts/tech/2026-11-23-ai-model-family-amazon-nova) | 閉源 | Nova 2 Lite、Nova 2.5 Sonic；Chronos-2（時間序列權重） | 只在 AWS；Premier、Canvas、Reel 已在 2026-09 停用 |
| [Granite](/posts/tech/2026-11-23-ai-model-family-granite)（IBM） | 開源 | Granite 4.2（3B／8B／30B）、Guardian 4.1、Vision 4.1 | 企業可完全自架、Apache 2.0 子線齊全，單模型分數偏低 |
| [OLMo](/posts/tech/2026-11-23-ai-model-family-olmo)（Ai2） | 開源 | Olmo 3.1 32B Think／Instruct、Olmo 3 7B | 權重 Apache 2.0、訓練資料與 checkpoint 全公開，能力落後同尺寸 Qwen 3 |
| [K2](/posts/tech/2026-11-23-ai-model-family-k2)（MBZUAI IFM） | 開源 | K2 Horizon 375B-A23B、MoVA-36B-A4B、32B／7B／3.7B／0.9B；Jais 3（阿拉伯語） | 權重 Apache 2.0、資料與各階段 checkpoint 公開，全開放路線中少數有 MoE 旗艦（375B）的一家；Artificial Analysis 375B 18 分，託管只有 IFM API |
| [Upstage Solar](/posts/tech/2026-11-23-ai-model-family-upstage-solar) | 閉源 API＋開源 | Solar Pro 4、Mini 4（API）；Solar Open 2（250B／15B 啟用） | 韓日文件型辦公 agent、低單價；Open 2 用 Apache 2.0 為底的 Upstage Solar License |
| [韓國模型群](/posts/tech/2026-11-23-ai-model-family-korea-models)（比較篇） | 開源＋閉源 | K-EXAONE 2.0、A.X K2、Motif 3、Solar、Mi:dm K 3.0 Pro、HyperCLOVA X SEED | 七家韓國廠商的授權、價格與分數對照 |
| [Nemotron](/posts/tech/2026-10-10-ai-model-family-nemotron)（NVIDIA） | 開源 | 3.5 Super VL、Bolt、Lightning | 開放訓練資料，依部署位置分層 |
| [Llama](/posts/tech/2026-08-24-ai-model-family-llama)（Meta） | 開源 | Llama 4 Scout／Maverick（2025-04） | 部署量最大，但沒有 Llama 5，Meta 新模型改用 Muse；Community License 附條件 |
| [Mistral](/posts/tech/2026-08-24-ai-model-family-mistral) | 開源 | Mistral Large 4、Small 4 | 歐洲主權部署；Large 4 是西方開放權重裡 coding 與資安最強的 |
| [Grok](/posts/tech/2026-08-24-ai-model-family-grok)（SpaceXSI，原 xAI） | 閉源 | Grok 4.7、4.3 | 分發通路是護城河；4.3 是 1M context 的低價選項 |
| [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere) | 閉源＋開源 | Command A+、Embed 5、Rerank 5 | RAG 原生；Command A+ 權重 Apache 2.0 |

**選型建議**：做 Agent 開發，先比 Claude Opus 5.5 與 GPT-6.2 Sol 這兩個中價位主力；最難的任務再上 Fable 5.2 或 GPT-6.2 Astra。要高吞吐量批次，看 MiniMax M3.1 Flash（$0.15／$0.60）、DeepSeek V4.1 Flash（$0.30／$1.20）或 Claude Haiku 5.5 與 GPT-6 Luna（都是 $0.10／$0.50）。要自架開放權重，前沿級只有 Kimi K3.1 Pro（多節點）；單卡或筆電看 Qwen3.8-27B（Apache-2.0）、Nemotron 3.5 Bolt 24GB 或 LFM3-1.7B。

**市場數據**：OpenRouter 用量排名本文最後一次記錄是 2026-08-23（DeepSeek V4 Flash 0731 以 11.6T tokens 第一），之後沒有更新，引用前請到 [OpenRouter Rankings](https://openrouter.ai/rankings) 看當下數字。

### 推理

2025 年推理模型還是獨立類別（o-series、DeepSeek-R1、QwQ）；到 2026 年 11 月，主要家族都把推理併回主線模型，改用一個推理強度參數控制：GPT 的 `reasoning_effort`、Claude 的 effort、Gemini 4 的 thinking level、Muse 的 minimal 到 max、Kimi K3.1 Pro 一律思考但可調強度。選型問題從「用哪一顆推理模型」變成「同一顆模型開到哪一檔」。

Artificial Analysis 的榜單直接把同一模型的不同推理強度分開列：Claude Fable 5.2 從 Low 的 53.9 到 Max 的 64.6，GPT-6.2 Sol 從 Low 的 40.6 到 Max 的 57.3。同一顆模型高低檔差 10 到 17 分，成本與延遲也跟著放大。

**選型建議**：先用中檔（medium 或 high）測自己的任務，正確率不夠再往上加；簡單分類與路由直接用低檔或改用[決策模型](/posts/tech/2026-10-22-ai-model-family-decision-models)。要開源推理，Kimi K3.1 Pro、DeepSeek V4.1 Flash、GLM-5.3 都內建思考模式；本地跑看 Qwen3.8-27B。

### 程式碼生成

coding 能力是 Agent 開發者最關心的維度。舊版本文用的 Aider Polyglot 分數停在 2025 年的模型，已經不具參考價值；這裡改用 Artificial Analysis 自己跑的兩個 coding 評測，條件一致、可以橫向比：Terminal-Bench 4.0（終端機長任務）與 FrontierCode 2.0（Cognition 的私有評測，132 個真實開源 repo 任務，看維護者會不會合併）。

| 模型 | 類型 | Terminal-Bench 4.0 | FrontierCode 2.0 | 價格（每 1M tokens） |
|---|---|---|---|---|
| Kimi K3.1 Pro | 開源 | **67.2** | 25.5 | $2／$10 |
| Gemini 4 Carbon (High) | 閉源 | 65.2 | 40.6 | $4／$20 |
| GPT-6.2 Astra (Max) | 閉源 | 64.1 | 45.4 | $8／$40 |
| Claude Sonnet 5.5 (Max) | 閉源 | 63.6 | 41.7 | $2／$10 |
| GPT-6.2 Sol (Max) | 閉源 | 60.1 | 44.4 | $2／$10 |
| Claude Fable 5.2 (Max) | 閉源 | 59.6 | **48.8** | $8／$40 |
| Claude Opus 5.5 (Max) | 閉源 | 59.6 | 46.4 | $4／$20 |
| Qwen4-Max | 閉源 | 48.5 | 26.5 | $1.50／$4.50 |
| GLM-5.3 (Max) | 開源 | 41.9 | 21.6 | $1.40／$4.40 |
| DeepSeek V4.1 Flash (Max) | 開源 | 33.8 | 28.5 | $0.30／$1.20 |
| MiniMax M3.1 Flash | 開源 | 25.8 | 20.8 | $0.15／$0.60 |

（Artificial Analysis 2026-11-20 的資料，各模型取它表上綜合指數最高的推理強度。）

兩個評測給的答案不一樣：Kimi K3.1 Pro 的終端長任務最高，但 FrontierCode 只有 25.5，代表它很會跑完一連串指令，修改結果卻不一定合乎維護者的標準；Claude Fable 5.2 與 Opus 5.5 則是 FrontierCode 領先。

**選型建議**：要 PR 品質，先看 Claude Opus 5.5 或 Fable 5.2；要長時間在終端機自己跑完任務，Kimi K3.1 Pro 價格只有一半；預算有限的大量 coding 子任務，DeepSeek V4.1 Flash 或 MiniMax M3.1 Flash 的單價低一個數量級，但兩個評測都明顯落後。

## 2. 視覺理解

### 視覺語言模型 (VLM)

2026 年的主線模型幾乎都是原生多模態，獨立的 VLM 線（Qwen-VL、Kimi-VL）已經併回主線。以 Artificial Analysis 2026-11-20 的 MMMU-Pro（多學科圖文推理）來看：

| 模型 | 類型 | MMMU-Pro | 定位 |
|---|---|---|---|
| GPT-6.2 Astra (Max) | 閉源 | 89.5 | 最高分 |
| Gemini 4 Carbon | 閉源 | 89.2 | 多模態輸入最全（含影片、音訊） |
| Claude Opus 5.5 (Max) | 閉源 | 87.7 | — |
| Kimi K3.1 Pro | 開源 | 83.9 | 開放權重最高 |
| Muse Spark Open | 開源 | 80.9 | 816B 開放權重，原生多模態 |
| DeepSeek V4.1 Flash (Max) | 開源 | 80.6 | — |
| MiniMax M3.1 Flash | 開源 | 79.1 | 低價 |

文件專項（DocVQA 等）的舊數據來自 2026-08 的 Qwen3-VL-235B（96.5%）與 GPT-5.4（95%），之後沒有再整理；要做文件處理，看 [Qwen 家族文](/posts/tech/2026-08-24-ai-model-family-qwen)的 Qwen3.8-27B 與 Nemotron 3.5 Super VL 這類原生視覺開放權重，並用自己的文件測。

**選型建議**：要最高的圖文推理，GPT-6.2 Astra 或 Gemini 4 Carbon；要開放權重，Kimi K3.1 Pro（需多節點）或單卡可跑的 Qwen3.8-27B；要影片與音訊一起看，Gemini 4 系列。

### OCR / 文件理解

專門處理掃描文件、PDF、發票、合約的模型。

| 模型 | 類型 | 授權 | 定位 |
|---|---|---|---|
| [Baidu Unlimited OCR 2](/posts/tech/2026-11-23-ai-model-family-ernie) | 開源 | MIT | 3.34B，上百頁長文件跨頁解析 |
| DeepSeek-OCR | 開源 | MIT | 3.5K likes，高精度 |
| Mistral OCR | 閉源 | API | 商用 OCR API |
| Marker | 開源 | GPL | PDF 轉 Markdown |

**選型建議**：如果你要處理上百頁的長文件：Unlimited OCR 2（MIT）不必先切塊。如果你要商用 API：Google Document AI 仍是企業標準。

### 物件偵測 / 分割

| 模型 | 類型 | 定位 |
|---|---|---|
| YOLO v11 | 開源 | 即時物件偵測，最快 |
| SAM 2 (Meta) | 開源 | 任意物件分割，影片支援 |
| Grounding DINO | 開源 | 文字描述 → 偵測框 |
| LocateAnything (NVIDIA) | 開源 | 3B 參數，精確定位 (2.9K likes) |

**選型建議**：如果你要即時偵測（攝影機、自駕）：YOLO。如果你要「用文字描述就能框出物件」：Grounding DINO + SAM 2 組合。

## 3. 生成式多模態

### 影像生成

影像生成仍是閉源領先最明顯的領域：[Artificial Analysis AA-Image-T2I v2.1](https://artificialanalysis.ai/image/leaderboard/text-to-image)（2026-11-23）的前十名全是閉源，OpenAI 的 GPT Image 2.5／2.6 佔了前五名裡的四席。

| 模型 | AA Elo | 類型 | $/千張 | 定位 |
|---|---|---|---|---|
| GPT Image 2.6 Sunburst (max) | 1263 | 閉源 | $211 | 第一名（[模型卡](/posts/daily/2026-11-07-model-openai-gpt-image-2-6)） |
| GPT Image 2.6 Flare (max) | 1226 | 閉源 | $211 | 同代的另一檔 |
| MAI-Image-2.7 | 1215 | 閉源 | $35 | [Microsoft](/posts/tech/2026-11-23-ai-model-family-microsoft)，前五名裡最便宜 |
| Kling Image 4.0 | 1181 | 閉源 | $63 | 快手 |
| Nano Banana 2.1 | 1175 | 閉源 | $34 | Google |
| Grok Imagine Image 2.0 | 1167 | 閉源 | $60 | SpaceXSI（原 xAI） |
| Muse Image | 1126 | 閉源 | $10 | Meta，前段班單價最低 |
| FLUX 3 Image | 1114 | 閉源 API | $48 | Black Forest Labs |
| Qwen-Image-2.1 | 1047 | 開放權重（研究授權，不可商用） | — | 阿里；LMArena 上的開放權重第一 |
| FLUX 3 Image Klein | 1040 | 開放權重（FLUX Kommunity License） | $9 | 5.6B；年營收 500 萬美元以下可免費商用 |
| FLUX.2 [dev] | 1000 | 開放權重（非商用） | $12 | 本榜的 Elo 基準點 |
| Z-Image Turbo | 936 | 開源 Apache-2.0 | $5 | 阿里；最便宜，授權最乾淨 |

（AA-Image-T2I v2.1 把 FLUX.2 [dev] 固定在 1000，分數與舊版本文引用的 LMArena ELO 不能直接比。[LMArena Text-to-Image](https://arena.ai/leaderboard/text-to-image)（2026-11-21）的排序大致相同，第一是 GPT-Image-2.5 Sunburst。）

**選型建議**：要最高品質，GPT Image 2.6 Sunburst，但每千張約 $211；MAI-Image-2.7 分數只低一截、價格約六分之一。要自架先看授權：Z-Image Turbo（Apache-2.0）可直接商用；FLUX 3 Image Klein 品質高得多，但年營收超過 500 萬美元要另簽授權；Qwen-Image-2.1 與 FLUX.2 [dev] 不能商用；MiniMax H3-Image 的開放權重排除美國、歐盟、英國、南韓（[模型卡](/posts/daily/2026-11-16-model-minimax-h3-image)）。FLUX 的分層與授權細節見 [FLUX 家族文](/posts/tech/2026-08-26-ai-model-family-flux)。

### 影片生成

2026 下半年最大的變化是 OpenAI 退場：Sora app 在 2026-04-26 關閉，Sora 2 與 Videos API 在 2026-09-24 關閉，官方沒有替代 API。[Artificial Analysis AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video)（含音訊，2026-11-23）前段班非常擠，前七名都在 1150 到 1175 之間，信賴區間互相重疊；排名每幾週就會變，引用時務必帶日期。

| 模型 | AA Elo（含音訊） | 類型 | $/分鐘 | 定位 |
|---|---|---|---|---|
| Wan 3.0 | 1175 | 閉源 API | $12.00 | 阿里；單次最長 30 秒、1080P |
| Utopai X | 1171 | 閉源 | 無 API | — |
| MiniMax H3 (768p) | 1163 | 開放權重（自訂授權） | $4.80 | 開放權重第一 |
| Dreamina Seedance 2.5 | 1156 | 閉源 | $34.12 | [ByteDance Seed](/posts/tech/2026-11-23-ai-model-family-bytedance-seed)，前段班最貴 |
| Gemini Omni Flash 1.2 | 1154 | 閉源 | $6.26 | Google |
| FLUX 3 Max | 1151 | 閉源 | $17.40 | fal Research 以 BFL 的 FLUX 3 Video 後訓練，只在 fal 計費（11-22 前促銷價 $8.70） |
| HeyGen Video 1 | 1150 | 閉源 | $2.40 | 無音訊榜第一 |
| Pika H3 Flex | 1125 | 開放權重 | $2.10 | 前段班單價最低 |
| Kling 3.0 1080p (Pro) | 1000 | 閉源 | $10.08 | 快手；本榜的 Elo 基準點 |
| Veo 3.1 | 962 | 閉源 | $24.00 | Google 上一代 |

（v2.1 把 Kling 3.0 1080p (Pro) 固定在 1000，分數與舊版本文 2026-08 的數字不能直接比。）

學術評測方面，[VBench](https://vchitect.github.io/VBench-project/) 把影片品質拆成 16 個維度（主體一致性、動作流暢度等），VBench-2.0 加了物理真實性——頂尖模型在動作忠實度上也只拿約 50%。

**選型建議**：要含音訊的最高品質，Wan 3.0；分數接近、價格約一半的是 Gemini Omni Flash 1.2。要自架，MiniMax H3 是開放權重第一，但授權排除美國、歐盟、英國、南韓，產品年營收超過 2,000 萬美元要另取書面授權。預算有限看 Pika H3 Flex（$2.10／分鐘）或 HeyGen Video 1（$2.40／分鐘）。還在用 Sora API 的整合要遷移。各家演化史見[影片生成家族文](/posts/tech/2026-08-26-ai-model-family-video-generation)。

### 3D 生成

| 模型 | 類型 | 授權 | VRAM | 定位 |
|---|---|---|---|---|
| TRELLIS.2 | 開源 | MIT | 16-24GB | 品質最高，PBR 材質 |
| [Hunyuan3D 2.1](/posts/tech/2026-11-23-ai-model-family-tencent-hy) | 開源 | 受限 | 10-29GB | 實用平衡，VRAM 較低 |
| TripoSR | 開源 | MIT | 6-8GB | 最快（<10s），品質已落後 |
| Meshy 6 | 託管 | 付費 | — | 最完整商用平台 |

**選型建議**：如果你要開源最高品質：TRELLIS.2（MIT，PBR 材質最好）。如果你的 GPU 只有 6-8GB：TripoSR 還是唯一能跑的。如果你要商用託管：Meshy 6 生態最完整。

### 影像編輯

影像編輯（inpainting、參考圖合成、風格轉換）現在多半和生成合在同一個模型：FLUX 3 Image Klein 一個權重同時做文字生圖、最多 10 張參考圖的編輯與 bounding box 局部修改。Artificial Analysis 另有 Image Editing 榜可以比，選型通常跟著你用的影像生成模型走。

## 4. 語音與音訊

### 語音合成 (TTS)

| 模型 | AA Elo | 類型 | $/百萬字元 | 定位 |
|---|---|---|---|---|
| Eleven v4／v4 Turbo | 1340 | 閉源 API | $80／$40 | ElevenLabs，並列第一 |
| StepAudio 3 TTS | 1307 | 閉源 API | $14 | [階躍星辰](/posts/tech/2026-11-23-ai-model-family-stepfun) |
| Qwen-Audio-3.1-TTS-Plus | 1298 | 閉源 API | $19.31 | 阿里 |
| Simba 3.5 | 1293 | 閉源 API | $6.58 | 前段班最便宜 |
| Gemini 3.8 Flash TTS | 1282 | 閉源 API | $16.49 | Google |
| Fish Audio Drama 3 | 1277 | 開放權重（自訂授權） | $15 | 開放權重第一 |
| Kokoro 82M | 1060 | 開源 Apache-2.0 | $0.65 | 全榜最便宜，可自架 |

（Elo 來自 [Artificial Analysis Text to Speech Leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard)，2026-11-23。這張榜比的是各家內建的聲音，不測聲音複製。）

**選型建議**：要 API 品質最高，Eleven v4 Turbo 與 v4 同分、價格一半；要壓成本，Simba 3.5 每百萬字元 $6.58。要自架，Fish Audio Drama 3 品質最高，但權重是 Fish Audio Community License：年營收 50 萬美元以下才可免費商用，託管服務要另簽約；要能直接商用的開源，Kokoro 82M（Apache-2.0）。各家演化與聲音複製見[語音與音訊家族文](/posts/tech/2026-08-26-ai-model-family-speech-audio)。

### 語音辨識 (ASR)

| 模型 | AA-WER | 類型 | $/千分鐘 | 定位 |
|---|---|---|---|---|
| Fun-Realtime-ASR-preview | 1.7% | 閉源 API | $2.82 | 阿里，錯字率最低 |
| Scribe v3 | 1.9% | 閉源 API | $3.33 | ElevenLabs，2026-11-10 推出 |
| MAI-Transcribe-2 | 2.0% | 閉源 API | $1.67 | [Microsoft](/posts/tech/2026-11-23-ai-model-family-microsoft)，約 340 倍即時速度 |
| Voxtral Small Transcribe 3 | 2.1% | API | $4.00 | Mistral |
| Grok Voice Transcribe 2.0 | 2.3% | 閉源 API | $1.67 | SpaceXSI |
| SOV-Transcribe-1 | 2.3% | 開源 Apache-2.0 | — | Salesforce，開放權重第一 |
| Voxtral Small | 2.8% | 開源 Apache-2.0 | $4.00 | 開放權重並列第二 |
| Nemotron 3.5 Transcribe | 2.8% | 開放權重 | $2.00 | NVIDIA，開放權重並列第二 |
| Whisper Large v3 | 4.1～4.5% | 開源 | $1.50 起 | 工具支援最廣的舊基線 |
| Parakeet TDT 0.6B V3 | 4.5% | 開放權重 | $1.50 | 最快，約 640 倍即時速度 |

（AA-WER v2.2 來自 [Artificial Analysis Speech to Text](https://artificialanalysis.ai/speech-to-text)，2026-11-23，以英文為主的非串流轉錄，混合語音 agent 對話、歐洲議會演講與財報電話會議；價格以榜上列出的服務商為準。）

**選型建議**：要 API 準確率最高，Fun-Realtime-ASR-preview 或 Scribe v3；MAI-Transcribe-2 稍差但更快更便宜。要自架，SOV-Transcribe-1 是 Apache-2.0 裡最準的（只支援七種歐洲語言），多語言改用 Voxtral Small，Parakeet TDT 0.6B V3 適合大量批次；Whisper Large v3 生態最成熟，但準確率已落後一截。這張榜以英文為主，中文或其他語言要用自己的錄音測。

### 音樂生成

音樂生成的評測仍在早期——[SongBench](https://github.com/Tencent/SongBench)（騰訊，7 維度、11,717 個專家標注樣本）是學術上最全面的；人類偏好排名可以看 [Artificial Analysis 的音樂榜](https://artificialanalysis.ai/music/leaderboard/instrumental)，分成純音樂與含人聲兩張。

| 模型 | AA Elo（純音樂） | 開發商 |
|---|---|---|
| Suno v6 | 1148 | Suno |
| Mureka V9.5 | 1084 | Mureka |
| Lyria 3 Pro | 1080 | Google |
| Eleven Music | 1021 | ElevenLabs |
| Stable Audio 3 Large | 1014 | Stability AI |
| MiniMax Music 3.0 | 1000 | MiniMax（本榜基準點） |
| MusicGen | 868 | Meta，開源，排名最後 |

（2026-11-23 的純音樂榜。）

**選型建議**：要商用品質，Suno v6 與 v6-mini 是前兩名，第三名以後落後 60 分以上；Mureka、Lyria 3 是第二梯隊。開源音樂模型在這張榜上明顯落後，要自架先用自己的曲風試聽。

## 5. 檢索與搜尋

### Embedding

RAG 系統的第一環——把文字轉成向量。[MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 是標準排名；下表取 MTEB(Multilingual, v2)，131 個任務的平均。

| 模型 | 類型 | MTEB 多語 v2 | 定位 |
|---|---|---|---|
| harrier-oss-v1-27b (Microsoft) | 開源 MIT | 74.3 | 多語榜第一，但 27B 自架成本高 |
| KaLM-Embedding-Gemma3-12B (騰訊) | 開放權重（自訂授權） | 72.3 | 第二 |
| Qwen3-Embedding-8B／4B／0.6B | 開源 Apache-2.0 | 70.6／69.5／64.3 | 32K context，自架的預設選擇 |
| harrier-oss-v1-0.6b | 開源 MIT | 69.0 | 小尺寸最強 |
| gemini-embedding-001 | 閉源 API | 68.4 | 新版 gemini-embedding-2 改成多模態（文字、圖片、影片、音訊、文件） |
| [Cohere Embed 5](/posts/tech/2026-08-24-ai-model-family-cohere) Pro／Fast | 閉源 API | 未公布 | 圖文混合 PDF 強；$0.12／$0.08 每百萬 token |
| voyage-4-large／4／4-lite | 閉源 API | 未公布 | $0.12／$0.06／$0.02；程式碼另有 voyage-code-4 |
| [pplx-embed](/posts/tech/2026-10-09-ai-model-family-pplx-embed) | 開放權重＋API | 只公布檢索子項 | 主力 v2-context（0.6B／9B）文字與圖片同一向量空間，$0.02／$0.12；9B 權重 MIT，0.6B 未標授權；v1 2027 年內停用 |
| BGE-M3 (BAAI) | 開源 MIT | — | 2024 年的舊預設，已被上表超過 |

（分數取自各模型卡與 MTEB 多語榜，2026-11。有些模型的訓練資料涵蓋部分 MTEB 任務，平均分只能當初篩。）

**選型建議**：自架多語 RAG，先試 Qwen3-Embedding-4B 或 8B（Apache-2.0、32K）；要分數最高且有 GPU 預算，harrier-oss-v1-27b；要小模型，harrier-oss-v1-0.6b。走 API 時，PDF 與圖文文件看 Cohere Embed 5，要文字、圖片、影片放同一個向量空間看 gemini-embedding-2。榜上的平均分包含分類、分群等任務，做 RAG 要看檢索子項，最後用自己的查詢測。

### Rerank

RAG 的第二環——對召回結果做精排。各家都用自己挑的資料集與第一階段檢索器測，數字不能跨廠商直接比。

| 模型 | 類型 | 定位 |
|---|---|---|
| Qwen3-Reranker-4B／8B | 開源 Apache-2.0 | 可商用的開放權重首選；4B 與 8B 差距很小 |
| jina-reranker-v3.5 | 開放權重（CC BY-NC 4.0） | 0.6B，Jina 自測 BEIR 63.2，略高於 Qwen3-Reranker-4B；權重不可商用，商用走 API |
| [Cohere Rerank 5](/posts/tech/2026-08-24-ai-model-family-cohere) Pro／Fast | 閉源 API | $0.05／$0.02 每百萬 token；可回傳段落、分數經校準 |
| Voyage rerank-3／rerank-3-lite | 閉源 API | 2026-09-30 推出；Voyage 自測勝過 Cohere Rerank 4 Pro 與 Qwen3-Reranker-8B |
| BGE-Reranker-v2-m3 | 開源 | 小、可在 CPU 跑的舊基線 |

**選型建議**：全開源可商用，Qwen3-Embedding 召回加 Qwen3-Reranker-4B 精排；要 API 一站買齊，Cohere Embed 5＋Rerank 5，或 Voyage 4＋rerank-3。精排有沒有用取決於第一階段有沒有把正確段落召回，先量召回率，再挑 reranker。

## 6. 分類與結構化

### 文字分類 / 情感分析

HuggingFace 上有 121K 個文字分類模型，是模型數量最多的任務類別。但 2026 年的現實是：大部分分類場景直接用 LLM zero-shot 就夠了——準確率已夠高，而且不需要標註資料和訓練。專用小模型（BERT 系列、DistilBERT）仍然在低延遲、高吞吐、邊緣部署場景有價值。

### NER / Token Classification

HuggingFace 上 30K 模型。spaCy + transformer 是 2026 年的標準 NER pipeline。對大部分語言，通用 LLM 的 NER 能力已經非常好；專用模型在特定領域（醫療、法律、金融實體辨識）仍有優勢。

### 決策模型（有限選項的判斷）

2026 年 9 月起出現的新類別：不生成文字，直接回傳每個選項的機率，只收 input token 費。工單分派、內容審核、工具呼叫放行這類「從固定選項挑一個」的工作，可以用它取代 LLM zero-shot。Artificial Analysis Decision Index v2.1 上，最高分的 d1.2-ultra 與 Claude Haiku 5.5 (Max) 只差 1.7 分，但每百萬題便宜 47 倍、快約 150 倍。代價是知識與推理較弱，而且常會有把握地答錯。版本矩陣、兩張榜單與門檻設定見[決策模型選型](/posts/tech/2026-10-22-ai-model-family-decision-models)。

### 翻譯

| 模型 | 類型 | 語言數 | 定位 |
|---|---|---|---|
| NLLB-200 (Meta) | 開源 | 200+ | 低資源語言覆蓋最廣 |
| SeamlessM4T v2 (Meta) | 開源 | 100+ | 語音翻譯，即時口譯 |
| Aya (Cohere) | 開源 | 101 | 指令式翻譯，可加上下文 |
| Google Translate | 閉源 API | 100+ | 商用標準 |
| DeepL | 閉源 API | 30+ | 歐洲語言品質最高 |

**選型建議**：如果你要低資源語言（約魯巴語、伊博語等）：NLLB-200 是唯一有覆蓋的開源選擇。如果你需要語音翻譯：SeamlessM4T v2 支援語音到語音的即時翻譯。如果你要帶上下文的翻譯（「用法律語境翻譯這句」）：Aya 的指令跟隨能力讓它能做到 NLLB 做不到的事。

## 7. Agent 能力

### Function Calling / Tool Use

Function calling 不是一個獨立的模型類別，而是各大 LLM 的能力維度。Claude、GPT、Gemini 三家的原生 tool-use 支援最成熟——有標準化的 API 格式、支援平行工具呼叫、有錯誤恢復機制；Muse 與 Qwen 的 API 也同時相容 OpenAI 與 Anthropic 格式。

[tau-bench](https://github.com/sierra-research/tau-bench) 系列是主要的多輪工具呼叫評測。開放權重裡，Kimi K3.1 Pro 的長任務 coding 分數已接近閉源前沿，MiniMax M3.1 Flash 與 LongCat-2.5 在企業自動化、網頁搜尋類任務的官方分數表現突出；只做「該不該呼叫、呼叫哪個」的判斷，[決策模型](/posts/tech/2026-10-22-ai-model-family-decision-models)的 When2Call 分數高過語言模型。

**選型建議**：做 production Agent，Claude 或 GPT 的 tool-use 可靠度仍最高；主迴圈用大模型、重複的子任務交給便宜的小模型（Muse Ember、Claude Haiku 5.5、GPT-6 Luna）是 2026 年常見的分工。要開源 Agent，先比 Kimi K3.1 Pro 與 GLM-5.3，兩者都是自訂授權，條件不同。

### 多步驟規劃與編排

這是 Agent 框架的範疇，不是模型選型的問題。模型負責「理解指令和呼叫工具」，框架負責「規劃步驟和管理狀態」。主流框架包括 LangChain/LangGraph、CrewAI、Mastra、Pydantic AI 等。

## 整體來說

2026 年的模型生態已經按用途高度分化——沒有一個模型在所有用途都最強。Claude Fable 5.2 在綜合指數與 FrontierCode 第一，Kimi K3.1 Pro 在 Terminal-Bench 4.0 第一，GPT-6.2 Astra 在圖文推理第一；決策模型在工具選擇與成本上全面勝過語言模型，但知識題輸一截。

開源與閉源的距離，在 2026 年下半年反而拉開了。開放權重最強的 Kimi K3.1 Pro 綜合指數 46.5，閉源前沿是 60 到 65；而且旗艦開放權重的授權越來越多附帶條件（Kimi、Qwen、MiniMax、Muse Spark Open、GLM-5.3、Tencent Hy4、Step 5 Preview 都是自訂授權），Qwen4-Max 更是旗艦直接回到閉源。開源的優勢集中在可自架、低價與特定任務（終端長任務、文件、embedding），影片生成也有開放權重擠進前三；閉源仍領先綜合推理、PR 品質、影像生成與語音。

這篇是地圖。每個家族的演化故事、架構細節、版本選擇指南，在各自的家族篇裡。

---

## 更新紀錄

- **2026-11-23**（連結）：LMArena 已改名 Arena，參考資料連結改到 arena.ai。
- **2026-11-23**（家族表）：「文字生成」表加入當天新增的 StepFun、MiMo、ByteDance Seed、SenseNova、MiniCPM、Microsoft、Amazon Nova、Granite、OLMo、Upstage Solar 與韓國模型群比較篇，代表型號、定位與授權依各家族文；影像、影片、TTS、ASR 表的 MAI-Image-2.7、Dreamina Seedance 2.5、StepAudio 3 TTS、MAI-Transcribe-2 連到對應家族文；pplx-embed 一列依換代後的家族文改成 v2-context 主力，並標出 0.6B 權重未標授權；「整體來說」的自訂授權旗艦加上 Step 5 Preview。
- **2026-11-23**：「文字生成」表的 DeepSeek、GLM、Llama、Mistral、Grok、Cohere 六列依當天更新的家族文改寫（GLM-5.3 旗艦授權改為自訂的 GLM-5.3 License、Grok 開發商改名 SpaceXSI、Mistral Medium 3.5 已 deprecated 換成 Small 4、Cohere 換成 Command A+），拿掉「家族文停在 2026-10」的註記。影像、影片、語音合成、語音辨識、音樂、Embedding、Rerank 各節換成 Artificial Analysis 與 MTEB 2026-11 的資料：影像與影片改用 AA v2.1 的 Elo（基準點與舊數字不同）、補上 Sora API 已於 2026-09-24 關閉、TTS 第一換成 Eleven v4、ASR 改用 AA-WER、Embedding 第一換成 harrier-oss-v1-27b、Rerank 改按授權與 API 分類並標出 jina-reranker-v3.5 權重不可商用；OCR 表換成 Unlimited OCR 2，影像編輯一段改寫。各數字的來源已重新讀過一手頁面。
- **2026-11-20**：同步 11 月的家族更新。「文字生成」表改為各家目前主力，加入 Muse、MiniMax、LongCat、Nemotron；「推理」改寫為推理已併回主線、用強度參數控制；「程式碼生成」的 Aider Polyglot 表（停在 2025 年的 GPT-5、Gemini 2.5 Pro 等模型）換成 Artificial Analysis 2026-11-20 的 Terminal-Bench 4.0 與 FrontierCode 2.0；「VLM」改用 Artificial Analysis 的 MMMU-Pro；新增「決策模型」小節；「Agent」與「整體來說」依新數據改寫，原本「開源在多數用途已追上或超越閉源」的結論改為距離在下半年拉開。影像、影片、3D、語音、音樂、Embedding、Rerank、OCR、翻譯各節仍是 2026-08 的資料，這次沒有重新查證。
- 2026-08-24：初版。

## 參考資料

- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 怎麼判斷一個模型好不好用
- [OpenRouter Rankings](https://openrouter.ai/rankings) — AI model API 實際用量排名（截至 2026-08-23）
- [Artificial Analysis](https://artificialanalysis.ai) — 品質、價格、速度綜合比較（文字 / 影像 / 影片 / 語音）
- [Arena（原 LMArena）](https://arena.ai) — 文字和影像模型的人類偏好 ELO 排名
- [AA-Image-T2I v2.1](https://artificialanalysis.ai/image/leaderboard/text-to-image)、[AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video)、[Text to Speech](https://artificialanalysis.ai/text-to-speech/leaderboard)、[Speech to Text](https://artificialanalysis.ai/speech-to-text)、[Music](https://artificialanalysis.ai/music/leaderboard/instrumental) — Artificial Analysis 的影像、影片、語音與音樂榜（2026-11-23）
- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations) — Sora 2 與 Videos API 於 2026-09-24 關閉
- [Wan3.0 officially launched — Alibaba Cloud](https://www.alibabacloud.com/en/news/product/video-generation-model-wan30-officially-launched-nsb) — Wan 3.0 規格與 API
- [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) — 排除地區與營收門檻
- [FLUX 3 Image Klein — Black Forest Labs](https://bfl.ai/blog/flux-3-image-klein) — 5.6B 開放權重與 Kommunity License
- [Artificial Analysis Models Leaderboard](https://artificialanalysis.ai/leaderboards/models) — Intelligence Index v5.0.1、Terminal-Bench 4.0、FrontierCode 2.0、MMMU-Pro（2026-11-20）
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — 跨語言 coding benchmark，附成本（舊版本文的 coding 表來源）
- [決策模型選型](/posts/tech/2026-10-22-ai-model-family-decision-models) — 本站
- [HuggingFace Models](https://huggingface.co/models) — 開源模型下載量、likes、trending
- [VBench](https://vchitect.github.io/VBench-project/) — 影片生成 16+18 維度學術評測
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — Embedding 模型標準排名
- [harrier-oss-v1-27b](https://huggingface.co/microsoft/harrier-oss-v1-27b)、[Qwen3-Embedding-8B](https://huggingface.co/Qwen/Qwen3-Embedding-8B) — 模型卡與 MTEB 多語分數
- [Gemini API Embeddings](https://ai.google.dev/gemini-api/docs/embeddings) — gemini-embedding-2 多模態嵌入
- [Voyage AI Pricing](https://docs.voyageai.com/docs/pricing)、[rerank-3 — Voyage AI](https://blog.voyageai.com/2026/09/30/rerank-3/) — Voyage 4 嵌入價格與 rerank-3
- [jina-reranker-v3.5](https://huggingface.co/jinaai/jina-reranker-v3.5) — 0.6B listwise reranker 與 Jina 自測分數
- [MMMU Benchmark](https://mmmu-benchmark.github.io/) — 多模態學科推理評測
- [MathVista](https://mathvista.github.io/) — 視覺數學推理評測
