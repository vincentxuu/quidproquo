---
title: "AI 模型用途總覽——2026 年你該知道的模型地圖"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, model-selection, open-source, multimodal, embedding]
lang: zh-TW
type: guide
tldr: "2026 年 AI 模型按用途分成七大類、20+ 個子用途。這篇是「AI 模型家族」系列的導讀地圖——從用途找模型、從模型找家族，附每個用途的選型建議和最新排名。"
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

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-landscape-overview-en)

這篇是「AI 模型家族」系列的導讀。HuggingFace 上有 47 種任務分類、超過 300 萬個模型，加上各家閉源 API，整個生態圈已經大到沒人能全部追完。這篇把它們按用途橫切成七大類、20 多個子用途，每個用途附上主要模型和選型建議——讓你從「我要做什麼」快速找到「該用哪個模型」。

每個主要家族（Qwen、DeepSeek、Claude、GPT 等）會有獨立的深度介紹文，從演化脈絡到版本選擇指南。怎麼解讀各用途的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 1. 核心文字能力

### 文字生成 / Chat

2026 年 8 月，文字生成模型的競爭格局是「閉源最強但開源追上來了」。OpenRouter 上 DeepSeek V4 Flash 以 11.6T tokens 處理量排名第一，但最強品質仍屬閉源的 Claude Opus 5 和 GPT-5.6。

| 家族 | 類型 | 最新版本 | 定位 |
|---|---|---|---|
| Claude (Anthropic) | 閉源 | Opus 5, Sonnet 5, Fable 5 | Agent/coding 最強，MCP 原生 |
| GPT (OpenAI) | 閉源+開源 | GPT-5.6 Sol/Luna, GPT-OSS 20b/120b | 最大生態系，首次開源 (Apache-2.0) |
| Gemini (Google) | 閉源 | Gemini 3.7 Flash, Gemini 3 Pro | 最大 context，多模態最全 |
| DeepSeek | 開源 | V4 Pro, V4 Flash | [OpenRouter](https://openrouter.ai/rankings) #1 用量，MIT 授權 |
| Qwen (阿里) | 開源 | Qwen3.8-27B, Qwen3.8-2.4T-A95B | HF 下載量王者，0.6B→2.4T 全尺寸 |
| Kimi (Moonshot) | 開源 | K3 (2.8T) | HF 第三高 likes (10.9K)，MoE |
| GLM (Z.AI) | 開源 | GLM 5.3 | Coding/terminal 驚人，迭代最快 |
| Llama (Meta) | 開源 | Llama 4 Scout/Maverick | 企業部署最大，生態最成熟 |
| Mistral | 開源 | Medium 3.5, Small 3.1 | 歐洲旗艦，多語言，授權最清晰 |
| Grok (xAI) | 閉源 | Grok 4.5 | 快速迭代 |
| Ornith | 開源 | Ornith 1.5-35B-A3B | 2026 夏季黑馬，MIT |
| Phi (Microsoft) | 開源 | Phi-4 | 小模型專家 |
| Cohere | 閉源+開源 | Command R+, North | RAG 原生，Embed+Rerank+Aya 多語言 |

**選型建議**：如果你在做 Agent 開發：Claude Opus 5 或 GPT-5 是目前 tool-use 最穩定的選擇。如果你在做高吞吐量批次處理：DeepSeek V4 Flash 的價效比無人能及。如果你要本地部署：Qwen3.8-27B（Apache-2.0）或 Gemma 4-12B（16GB VRAM 即可跑）。

**市場數據**（OpenRouter 8/23）：DeepSeek V4 Flash 0731 (11.6T tokens) > Ox Alpha (11.6T) > MiMo-V2.5 (9.94T) > Hy3 (8.21T) > DeepSeek V4 Flash 0423 (5.46T)。

### 推理

推理模型是 2025-2026 年的新類別——它們在回答前會進行長鏈思考，擅長數學、邏輯、科學問題。

| 家族 | 類型 | 最新版本 | 定位 |
|---|---|---|---|
| o-series (OpenAI) | 閉源 | o3, o4-mini, o3-pro | 推理最強，成本最高 |
| DeepSeek-R1 | 開源 | R1-0528 | MIT 授權，開源推理之王 (HF 13.5K likes) |
| QwQ (Qwen) | 開源 | QwQ-32B | Apache-2.0，32B 參數即可本地跑 |
| Kimi-Thinking | 開源 | K2-Thinking | 推理+通用混合 |

**選型建議**：如果你在做數學或科學推理：o3 (high) 或 o4-mini 品質最高。如果你要開源推理：DeepSeek-R1 是唯一的 frontier-class 開源選擇。如果你要本地跑推理模型：QwQ-32B 在消費級硬體上表現最好。

### 程式碼生成

coding 能力是 Agent 開發者最關心的維度。[Aider Polyglot](https://aider.chat/docs/leaderboards/) 是目前最實用的 coding benchmark，因為它同時測效果和成本。

| 家族 | Aider 分數 | 成本 ($/次) | 定位 |
|---|---|---|---|
| GPT-5 (high) | 88.0% | $29.08 | 品質最高 |
| Gemini 2.5 Pro | 83.1% | $49.88 | 32K thinking |
| o3 (high) | 81.3% | $21.23 | 推理型 coding |
| Grok 4 (high) | 79.6% | $59.62 | — |
| DeepSeek V3.2 Exp (Reasoner) | 74.2% | $1.30 | 超高價效比 |
| Claude Opus 4 (32K thinking) | 72.0% | $65.75 | — |
| DeepSeek V3.2 Exp (Chat) | 70.2% | $0.88 | 成本最低 |
| Kimi K2 | 59.1% | $1.24 | — |
| Qwen3 235B A22B | 59.6% | — | 開源大模型 |

**選型建議**：如果你追求品質不計成本：GPT-5 (high) 88%，是目前 Aider 最高分。如果你要 10 倍省錢還能用：DeepSeek V3.2 Exp Chat 70.2% 只要 $0.88，是 GPT-5 成本的 1/33。

## 2. 視覺理解

### 視覺語言模型 (VLM)

VLM 能同時看圖和理解文字。2026 年的趨勢是開源 VLM 在特定領域（文件理解、數學推理）已超越閉源。

| 家族 | 類型 | MMMU-Pro | DocVQA | MathVista | 定位 |
|---|---|---|---|---|---|
| Gemini 3.1 Pro | 閉源 | 82% | 92% | 75% | 廣泛學科最強 |
| GPT-5.4 | 閉源 | 81% | 95% | 78.4% | 文件處理最強閉源 |
| Qwen3-VL-235B | 開源 | 69.3% | 96.5% | 85.8% | 開源王者，數學視覺超越閉源 |
| InternVL3-78B | 開源 | — | 95.4% | 79.0% | 開源第二 |
| Llama 4 Maverick | 開源 | — | 94.4% | 73.7% | Meta 開源多模態 |
| Kimi-VL | 開源 | — | — | — | 輕量視覺語言 |

**選型建議**：如果你在做文件處理 pipeline：Qwen3-VL（DocVQA 96.5%）在自建場景比 GPT-5.4 還強，而且能自己部署。如果你需要廣泛的學科推理：Gemini 3.1 Pro（MMMU-Pro 82%）仍然領先。如果你在做視覺數學推理：Qwen3-VL（MathVista 85.8%）超越所有閉源模型。

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

Function calling 不是一個獨立的模型類別，而是各大 LLM 的能力維度。Claude、GPT、Gemini 三家的原生 tool-use 支援最成熟——有標準化的 API 格式、支援平行工具呼叫、有錯誤恢復機制。

[tau-bench](https://github.com/sierra-research/tau-bench) 是主要的多輪工具呼叫評測。開源模型裡 Qwen3.8 和 GLM 5.3 在 tool-use 場景進步最快。

**選型建議**：如果你在做 production Agent：Claude 或 GPT 的 tool-use 可靠度最高。如果你要開源 Agent：Qwen3.8 + function calling 是目前最好的開源選擇。

### 多步驟規劃與編排

這是 Agent 框架的範疇，不是模型選型的問題。模型負責「理解指令和呼叫工具」，框架負責「規劃步驟和管理狀態」。主流框架包括 LangChain/LangGraph、CrewAI、Mastra、Pydantic AI 等。

## 整體來說

2026 年的模型生態已經按用途高度分化——沒有一個模型在所有用途都最強。DeepSeek V4 Flash 是 OpenRouter 上用量最大的模型，但 GPT-5 在 coding 拿最高分；Qwen-VL 在文件理解超越所有閉源模型，但在廣泛學科推理上落後 Gemini 十幾個百分點。

開源在多數用途已經追上或超越閉源。文件理解（Qwen-VL 96.5%）、數學推理（Qwen-VL 85.8%）、影片生成（MiniMax H3）、embedding（BGE-M3）、TTS（Kokoro、OmniVoice）——這些領域的開源選項已經是最佳或接近最佳。閉源仍然領先的主要是 Agent 任務、影像生成、和最強推理模型。

這篇是地圖。每個家族的演化故事、架構細節、版本選擇指南，在各自的家族篇裡。

---

## 參考資料

- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 怎麼判斷一個模型好不好用
- [OpenRouter Rankings](https://openrouter.ai/rankings) — AI model API 實際用量排名（截至 2026-08-23）
- [Artificial Analysis](https://artificialanalysis.ai) — 品質、價格、速度綜合比較（文字 / 影像 / 影片 / 語音）
- [LMArena](https://lmarena.ai) — 文字和影像模型的人類偏好 ELO 排名
- [Aider LLM Leaderboards](https://aider.chat/docs/leaderboards/) — 跨語言 coding benchmark，附成本
- [HuggingFace Models](https://huggingface.co/models) — 開源模型下載量、likes、trending
- [VBench](https://vchitect.github.io/VBench-project/) — 影片生成 16+18 維度學術評測
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) — Embedding 模型標準排名
- [BEIR](https://github.com/beir-cellar/beir) — 跨領域資訊檢索 benchmark
- [TTS-Bench](https://github.com/5uck1ess/tts-bench) — 65 個 TTS 模型速度 + 聽感 + 客觀分數
- [MMMU Benchmark](https://mmmu-benchmark.github.io/) — 多模態學科推理評測
- [MathVista](https://mathvista.github.io/) — 視覺數學推理評測
