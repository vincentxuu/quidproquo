---
title: "AI 模型用途總覽——2026 年你該知道的模型地圖"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, model-selection, open-source, multimodal, embedding]
lang: zh-TW
type: guide
tldr: "2026 年 AI 模型按用途分成七大類、20+ 個子用途。這篇是「AI 模型家族」系列的導讀地圖——從用途找模型、從模型找家族，附每個用途的選型建議。2026-11 版：閉源前沿換成 Claude Fable 5.2、GPT-6.2、Gemini 4，開放權重最強是 Kimi K3.1 Pro，coding 改用 Artificial Analysis 的 Terminal-Bench 4.0 與 FrontierCode 2.0 比較，並新增決策模型一類。"
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

這篇是「AI 模型家族」系列的導讀。HuggingFace 上有 47 種任務分類、超過 300 萬個模型，加上各家閉源 API，整個生態圈已經大到沒人能全部追完。這篇把它們按用途橫切成七大類、20 多個子用途，每個用途附上主要模型和選型建議——讓你從「我要做什麼」快速找到「該用哪個模型」。文字、推理、程式碼、視覺與 Agent 各節是 2026-11-20 的資料；影像、影片、語音、檢索等其他各節仍是 2026-08 的資料，引用時請帶日期。

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
| [DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek) | 開源 | V4.1 Flash、V4 Pro | 低價、MIT 授權 |
| [GLM](/posts/tech/2026-08-24-ai-model-family-glm)（Z.AI） | 開源 | GLM-5.3、5.3-Flash | MIT 授權，coding 與 terminal 強 |
| [Muse](/posts/tech/2026-09-19-ai-model-family-muse-spark)（Meta） | 閉源＋開源 | Muse Wonder／Spark 1.3／Ember；Spark Open | 三層 API，另有開放權重旗艦 |
| [MiniMax](/posts/tech/2026-08-26-minimax-model-family) | 開源 | M3.1 Flash | 單價最低的一檔，企業自動化強 |
| [LongCat](/posts/tech/2026-10-10-ai-model-family-longcat)（美團） | 開源 | LongCat-2.5 | MIT 授權的 1.6T 開放權重 |
| [Nemotron](/posts/tech/2026-10-10-ai-model-family-nemotron)（NVIDIA） | 開源 | 3.5 Super VL、Bolt、Lightning | 開放訓練資料，依部署位置分層 |
| [Llama](/posts/tech/2026-08-24-ai-model-family-llama)（Meta） | 開源 | Llama 4 Scout／Maverick | 生態最成熟，但已無新版本 |
| [Mistral](/posts/tech/2026-08-24-ai-model-family-mistral) | 開源 | Mistral Large 4、Medium 3.5 | 歐洲合規定位 |
| [Grok](/posts/tech/2026-08-24-ai-model-family-grok)（xAI） | 閉源 | Grok 4.7 | 分發通路是護城河 |
| [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere) | 閉源＋開源 | Command A、North | RAG 原生，Embed＋Rerank＋Aya |

（DeepSeek、GLM、Llama、Mistral、Grok、Cohere 的家族文還停在 2026-10 的版本；表中「目前主力」依 Artificial Analysis 2026-11-20 的模型列表，細節以家族文更新後為準。）

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
| Baidu Unlimited-OCR | 開源 | MIT | 4.1K likes，多語言 OCR |
| DeepSeek-OCR | 開源 | MIT | 3.3K likes，高精度 |
| Mistral OCR | 閉源 | API | 商用 OCR API |
| Marker | 開源 | GPL | PDF 轉 Markdown |

**選型建議**：如果你要開源 OCR：Unlimited-OCR（MIT）品質和語言覆蓋最好。如果你要商用 API：Google Document AI 仍是企業標準。

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

影像生成是閉源模型領先最明顯的領域——前五名全是閉源。

| 模型 | ELO | 類型 | $/千張 | 定位 |
|---|---|---|---|---|
| GPT Image 2 | 1381 | 閉源 | $211 | [LMArena](https://arena.ai/leaderboard/text-to-image) #1 |
| MAI-Image-2.6 | 1336 | 閉源 | — | Microsoft，新進 |
| Grok Imagine 2.0 | 1316 | 閉源 | — | xAI |
| Reve 2.1 | 1302 | 閉源 | $200 | — |
| Meta Muse Image | 1282 | 閉源 | — | Meta |
| Imagen 4 | — | 閉源 | — | Google |
| FLUX.2 dev | — | 開源 | $12 | 開源最強之一 |
| Ideogram 4.0 Open | 1204 | 開源 | — | 開源最高 ELO |
| Z-Image Turbo | — | 開源 | $5 | 阿里，極低價 |
| SD 3.5 Large | — | 開源 | — | 開山始祖 |

（ELO 來自 [LMArena Text-to-Image Arena](https://arena.ai/leaderboard/text-to-image)，2026-08-10）

**選型建議**：如果你追求最高品質：GPT Image 2，但每千張 $211。如果你要開源自建：FLUX.2 dev 或 Ideogram 4.0 Open。如果你要最低成本：Z-Image Turbo 每張只要 $0.005。

### 影片生成

2026 年競爭最激烈的戰場。排名每幾週大洗牌，引用時務必帶日期。

| 模型 | ELO (含音訊) | 類型 | $/分鐘 | 定位 |
|---|---|---|---|---|
| Wan 3.0 | 1244 | 閉源 | 即將公開 | [AA Video Arena](https://artificialanalysis.ai/video/leaderboard/text-to-video) #1 |
| Gemini Omni Flash | 1238 | 閉源 | $6.00 | Google |
| MiniMax H3 | 1228 | 開源 | $7.80 | 開源最強 |
| Seedance 2.0 | 1221 | 閉源 | $9.07 | ByteDance，原生音訊 |
| Kling 3.0 Pro | 1106 | 閉源 | $20.16 | 快手 |
| LTX-2.5 | 1063 | 開源 | $7.80 | Lightricks，快速迭代 |
| Sora | — | 閉源 | — | OpenAI |

（ELO 來自 [Artificial Analysis Video Arena](https://artificialanalysis.ai/video/leaderboard/text-to-video)，2026-08）

學術評測方面，[VBench](https://vchitect.github.io/VBench-project/) 把影片品質拆成 16 個維度（主體一致性、動作流暢度等），VBench-2.0 加了物理真實性——頂尖模型在動作忠實度上也只拿約 50%。

**選型建議**：如果你要含音訊的影片：Wan 3.0 或 Seedance 2.0。如果你要開源自建：MiniMax H3（ELO 1228）。如果你預算有限：LTX-2.3 Fast（$2.40/分鐘）是最便宜的。

### 3D 生成

| 模型 | 類型 | 授權 | VRAM | 定位 |
|---|---|---|---|---|
| TRELLIS.2 | 開源 | MIT | 16-24GB | 品質最高，PBR 材質 |
| Hunyuan3D 2.1 | 開源 | 受限 | 10-29GB | 實用平衡，VRAM 較低 |
| TripoSR | 開源 | MIT | 6-8GB | 最快（<10s），品質已落後 |
| Meshy 6 | 託管 | 付費 | — | 最完整商用平台 |

**選型建議**：如果你要開源最高品質：TRELLIS.2（MIT，PBR 材質最好）。如果你的 GPU 只有 6-8GB：TripoSR 還是唯一能跑的。如果你要商用託管：Meshy 6 生態最完整。

### 影像編輯

影像編輯（inpainting、outpainting、風格轉換）主要由影像生成模型的衍生功能提供：FLUX Fill、SD Inpaint、DALL-E Edit、GPT Image edit 模式。這個領域目前沒有獨立的標準 benchmark，選型跟著你用的影像生成模型走。

## 4. 語音與音訊

### 語音合成 (TTS)

| 模型 | 類型 | 定位 |
|---|---|---|
| Qwen-Audio-3.0-TTS | 閉源 API | [AA Speech Arena](https://artificialanalysis.ai/text-to-speech/arena) #1，16 語言 |
| ElevenLabs | 閉源 API | 商用 TTS 業界標準 |
| Kokoro | 開源 | CUDA 最快（67ms TTFA，104× RTFx） |
| Fish Audio | 開源 | 多語言聲音複製 |
| VibeVoice (Microsoft) | 開源 | MIT，2.4K likes |
| OmniVoice | 開源 | 聲音複製盲測 #1（但可能吞字） |

（速度數據來自 [TTS-Bench](https://github.com/5uck1ess/tts-bench)，65 個模型對比）

**選型建議**：如果你要 API 品質最高：Qwen-Audio-3.0-TTS 目前 Arena 排名第一。如果你要本地部署最快：Kokoro（RTX 5090 上 67ms 首字延遲）。如果你要聲音複製：OmniVoice 盲測偏好最高，但注意它有吞字問題——搭配 WER 指標確認清晰度。

### 語音辨識 (ASR)

| 模型 | 類型 | 定位 |
|---|---|---|
| Whisper Large V3 | 開源 | 通用 ASR 標準，多語言 |
| Cohere Transcribe | 閉源 API | Apache-2.0，多語言 |
| Paraformer (阿里) | 開源 | 中文 ASR 最強 |
| Deepgram | 閉源 API | 企業級，低延遲 |
| AssemblyAI | 閉源 API | 企業級，串流支援 |

**選型建議**：如果你要開源通用 ASR：Whisper Large V3 仍是基準線。如果你做中文場景：Paraformer（阿里）比 Whisper 在中文上更準。

### 音樂生成

音樂生成的評測仍在早期——[SongBench](https://github.com/Tencent/SongBench)（騰訊，7 維度、11,717 個專家標注樣本）是目前最全面的。

| 模型 | 類型 | 定位 |
|---|---|---|
| MiniMax-Music3 | 開源 | 2B 參數，1.2K likes |
| Suno | 閉源 | 商用主流 |
| Udio | 閉源 | 音質導向 |
| Stable Audio | 開源 | Stability AI |

**選型建議**：如果你要開源音樂生成：MiniMax-Music3 目前是最活躍的選擇。如果你要商用品質：Suno 的品質和易用性領先。

## 5. 檢索與搜尋

### Embedding

RAG 系統的第一環——把文字轉成向量。[MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) 是標準排名。

| 模型 | 類型 | Downloads | 定位 |
|---|---|---|---|
| BGE-M3 (BAAI) | 開源 MIT | 36M | 多語言 embedding 王者 |
| Qwen-Embedding | 開源 | 7M | Qwen 生態，0.6B/4B |
| Jina Embeddings v5 | 開源 | — | 多語言 + 商用 |
| Cohere Embed v3 | 閉源 API | — | 企業 API 首選之一 |
| Voyage code-3 | 閉源 API | — | 程式碼語料專用 |
| OpenAI text-embedding-3 | 閉源 API | — | 最容易整合 |

**選型建議**：如果你做多語言 RAG：BGE-M3（MIT，36M downloads）是 2026 年的預設選擇。如果你處理程式碼語料：Voyage code-3 專門優化。如果你要 API 最簡單：OpenAI 的整合文件最完整。

### Rerank

RAG 的第二環——對召回結果做精排。[BEIR](https://github.com/beir-cellar/beir) nDCG@10 是主要指標。

| 模型 | 類型 | BEIR nDCG@10 | 定位 |
|---|---|---|---|
| Jina Reranker v3.5 | 開源 | 63.2 | 開源最強 |
| Qwen3-Reranker-8B | 開源 | ~62+ | Qwen 生態 |
| BGE-Reranker | 開源 | — | BGE 系列 |
| Cohere Rerank | 閉源 API | — | API 業界標準 |

2026 年的 RAG 金標準組合：**BGE-M3 或 Qwen-Embedding 做召回 + Jina/Cohere Reranker 做精排**。

**選型建議**：如果你做 RAG 要開源全套：BGE-M3 + Jina Reranker v3.5。如果你要 API 最穩定：Cohere Embed + Cohere Rerank。

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

**選型建議**：做 production Agent，Claude 或 GPT 的 tool-use 可靠度仍最高；主迴圈用大模型、重複的子任務交給便宜的小模型（Muse Ember、Claude Haiku 5.5、GPT-6 Luna）是 2026 年常見的分工。要開源 Agent，先比 Kimi K3.1 Pro 與 GLM-5.3，注意兩者授權不同。

### 多步驟規劃與編排

這是 Agent 框架的範疇，不是模型選型的問題。模型負責「理解指令和呼叫工具」，框架負責「規劃步驟和管理狀態」。主流框架包括 LangChain/LangGraph、CrewAI、Mastra、Pydantic AI 等。

## 整體來說

2026 年的模型生態已經按用途高度分化——沒有一個模型在所有用途都最強。Claude Fable 5.2 在綜合指數與 FrontierCode 第一，Kimi K3.1 Pro 在 Terminal-Bench 4.0 第一，GPT-6.2 Astra 在圖文推理第一；決策模型在工具選擇與成本上全面勝過語言模型，但知識題輸一截。

開源與閉源的距離，在 2026 年下半年反而拉開了。開放權重最強的 Kimi K3.1 Pro 綜合指數 46.5，閉源前沿是 60 到 65；而且旗艦開放權重的授權越來越多附帶條件（Kimi、Qwen、MiniMax、Muse Spark Open 都是自訂授權），Qwen4-Max 更是旗艦直接回到閉源。開源的優勢集中在可自架、低價與特定任務（終端長任務、文件、embedding、TTS），閉源仍領先綜合推理、PR 品質與影像生成。

這篇是地圖。每個家族的演化故事、架構細節、版本選擇指南，在各自的家族篇裡。

---

## 更新紀錄

- **2026-11-20**：同步 11 月的家族更新。「文字生成」表改為各家目前主力，加入 Muse、MiniMax、LongCat、Nemotron；「推理」改寫為推理已併回主線、用強度參數控制；「程式碼生成」的 Aider Polyglot 表（停在 2025 年的 GPT-5、Gemini 2.5 Pro 等模型）換成 Artificial Analysis 2026-11-20 的 Terminal-Bench 4.0 與 FrontierCode 2.0；「VLM」改用 Artificial Analysis 的 MMMU-Pro；新增「決策模型」小節；「Agent」與「整體來說」依新數據改寫，原本「開源在多數用途已追上或超越閉源」的結論改為距離在下半年拉開。影像、影片、3D、語音、音樂、Embedding、Rerank、OCR、翻譯各節仍是 2026-08 的資料，這次沒有重新查證。
- 2026-08-24：初版。

## 參考資料

- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 怎麼判斷一個模型好不好用
- [OpenRouter Rankings](https://openrouter.ai/rankings) — AI model API 實際用量排名（截至 2026-08-23）
- [Artificial Analysis](https://artificialanalysis.ai) — 品質、價格、速度綜合比較（文字 / 影像 / 影片 / 語音）
- [LMArena](https://lmarena.ai) — 文字和影像模型的人類偏好 ELO 排名
- [Artificial Analysis Models Leaderboard](https://artificialanalysis.ai/leaderboards/models) — Intelligence Index v5.0.1、Terminal-Bench 4.0、FrontierCode 2.0、MMMU-Pro（2026-11-20）
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — 跨語言 coding benchmark，附成本（舊版本文的 coding 表來源）
- [決策模型選型](/posts/tech/2026-10-22-ai-model-family-decision-models) — 本站
- [HuggingFace Models](https://huggingface.co/models) — 開源模型下載量、likes、trending
- [VBench](https://vchitect.github.io/VBench-project/) — 影片生成 16+18 維度學術評測
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — Embedding 模型標準排名
- [BEIR](https://github.com/beir-cellar/beir) — 跨領域資訊檢索 benchmark
- [TTS-Bench](https://github.com/5uck1ess/tts-bench) — 65 個 TTS 模型速度 + 聽感 + 客觀分數
- [MMMU Benchmark](https://mmmu-benchmark.github.io/) — 多模態學科推理評測
- [MathVista](https://mathvista.github.io/) — 視覺數學推理評測
