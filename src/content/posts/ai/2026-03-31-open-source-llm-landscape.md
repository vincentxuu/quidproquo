---
title: "2026 Q1 開源 LLM 全景圖：從前沿大模型到手機端，完整盤點"
date: 2026-03-31
category: ai
tags: [open-source, llm, glm-5, kimi, deepseek, qwen, llama, gemma, mistral, minimax, phi, smollm, gpt-oss, moe, on-device-ai, embedding, reranker, tts, stt, image-generation, video-generation, code-model, ollama, vllm]
lang: zh-TW
tldr: "2026 Q1 開源模型全面爆發：LLM 方面 GLM-5、Kimi K2.5、Qwen3.5 追上閉源；Embedding 和 Reranker 由 Qwen3 和 BGE 主導；語音有 Voxtral TTS 和 Whisper V3；圖像有 FLUX.2；影片有 Wan 2.2 追平 Sora。這篇是完整導覽地圖。"
description: "完整盤點 2026 年 Q1 的開源模型生態：前沿 LLM、中間層、行動端小模型、Embedding、Reranker、程式碼模型、語音（STT/TTS）、圖像生成、影片生成、推論引擎與部署方案，附各專文連結與 Q1 發布時間軸。"
draft: false
---

開源 LLM 在 2026 年第一季的進展速度，快到很難靠單篇文章追完。光是 Q1 就有超過 15 個重要模型發布——前沿級的 MoE 模型突破 1T 參數，中間層的效率大幅提升（Qwen3.5-35B 用 3B 啟用參數就超越上一代 235B 旗艦），行動端的小模型壓到 140M 就能做推理。

這篇是一張導覽地圖。每個類別我會講清楚現在的格局和關鍵數據，細節則連到各篇專文——那邊有完整的技術架構、benchmark 比較和實際使用經驗。

## 2026 Q1 開源模型發布時間軸

先看全貌。這是 2026 年 1–3 月的主要開源模型發布：

| 日期 | 模型 | 開發者 | 重點 |
| ---- | ---- | ------ | ---- |
| 01/15 | InternLM3-8B | 上海 AI Lab | 8B，資料效率是 Llama 3.1 的 4 倍 |
| 01/27 | Kimi K2.5 | 月之暗面 | 1T/32B MoE，Agent Swarm，MIT |
| 02/11 | GLM-5 | 智譜 AI | 745B/44B MoE，MIT，開源第一名 |
| 02/11 | MiniMax-M2.5 | MiniMax | 230B/10B MoE，SWE-bench 80.2% |
| 02/16 | Qwen3.5-397B | 阿里巴巴 | 397B/17B MoE，原生多模態，Apache 2.0 |
| 02/24 | Qwen3.5 Medium | 阿里巴巴 | 122B/35B/27B 三個尺寸 |
| 02 月 | Tiny Aya | Cohere | 3.35B，70+ 語言 |
| 03/01 | Qwen3.5 Small | 阿里巴巴 | 0.8B–9B，行動端多模態 |
| 03/15 | GLM-5-Turbo | 智譜 AI | GLM-5 加速版 |
| 03/16 | Mistral Small 4 | Mistral AI | 119B/6.5B MoE，統一推理+多模態+程式碼 |
| 03/26 | Voxtral TTS | Mistral AI | 開源語音合成，9 語言 |
| 03/27 | GLM-5.1 | 智譜 AI | GLM-5 改進版，程式碼能力逼近 Claude Opus |

## 前沿級開源模型（100B+）

2026 年的前沿開源模型幾乎都採用 **Mixture of Experts（MoE）** 架構——總參數量巨大，但每次推論只啟用一小部分，在效能和成本之間取得平衡。中國實驗室在這個梯隊佔主導地位。

### GLM-5 / GLM-5.1（智譜 AI）— 開源排名最高

745B 總參數、44B 啟用參數（256 experts，每 token 啟用 8 個），MIT 授權。完全在華為昇騰晶片上訓練，沒用一張 NVIDIA GPU。Artificial Analysis Intelligence Index 開源第一（50 分），SWE-bench Verified 77.8%，Humanity's Last Exam 50.4%。API 定價約 $1.00/$3.20 per M tokens。

3 月 27 日發布的 **GLM-5.1** 進一步提升，程式碼能力逼近 Claude Opus 4.6。

**→ [GLM-5 完整介紹：智譜 AI 的 744B 開源模型](/posts/ai/2026-03-26-glm5-model-intro)**

### Kimi K2.5（月之暗面）— 1T 參數 + Agent Swarm

1T 總參數、32B 啟用參數的 MoE 模型，MIT 授權（超過 1 億 MAU 或 $20M 月營收需標註 Kimi K2.5）。原生多模態，最大亮點是 **Agent Swarm**——可以同時協調 100 個 sub-agent、發出 1,500 次工具呼叫。程式碼和數學在部分基準上是開源最強。

**→ [Kimi 完整介紹：月之暗面的長文本 AI 模型](/posts/ai/2026-03-26-kimi-model-intro)**

### Qwen3.5-397B-A17B（阿里巴巴）— 多模態旗艦

397B 總參數、17B 啟用參數的混合 MoE（Gated Delta Networks + sparse MoE，512 experts，每 token 10 routed + 1 shared）。262K context（可擴展到 1M），原生多模態（文字/圖片/影片），支援 201 種語言，Apache 2.0 授權。

Qwen 在 2025 年 4 月的 Qwen3 系列（235B 旗艦）之後，半年內就推出了架構全面升級的 3.5 系列——進化速度極快。

### MiniMax-M2.5 — SWE-bench 追平 Claude Opus

230B 總參數、10B 啟用參數的 MoE 模型，Modified MIT 授權。SWE-bench Verified 80.2%（追平 Claude Opus 4.6），Multi-SWE-Bench 第一名（51.3%），成本只有 Claude Opus 的 1/20。用自研的 Forge RL 框架訓練。

MiniMax 相對低調，但 M2.5 的程式碼能力是目前開源模型中最頂級的。

### DeepSeek V3 / R1 — 仍然重要但開始老化

DeepSeek-V3（671B/37B MoE，2024/12）和 R1（推理特化版，2025/01）以 MIT 授權開源，訓練成本僅 $5.6M，震撼了整個產業。V3.1（2025/08）合併了 V3 和 R1 的能力，支援混合思考模式。V3.2-Exp（2025/09）引入 Sparse Attention。

但截至 2026/03/31，**R2 和 V4 都尚未發布**——原定 2025 年 5 月的時程已多次延後。據報導 CEO 梁文峰對 R2 的表現不滿意，可能在用華為晶片重新訓練。

### Llama 4 Scout / Maverick（Meta）— 超長 Context

2025 年 4 月發布。Scout（109B/17B MoE，16 experts）有 **10M context window**，Maverick（400B/17B MoE，128 experts）有 1M context。Llama 4 Community License（open-weight 但非完全開源）。

多模態（文字+圖片輸入），多語言支援，但中文能力仍不如 Qwen 和 GLM。

### gpt-oss-120b（OpenAI）— 第一個開源模型

2025 年 8 月發布，117B 總參數、5.1B 啟用參數的 MoE，**Apache 2.0** 授權。推理能力接近 o4-mini，可在單張 80GB GPU 上跑。同時發布了 gpt-oss-20b（21B/3.6B）。

OpenAI 放出開源模型本身就是歷史性事件，雖然它在能力上已經不是最頂級。

### Devstral 2（Mistral）— 程式碼專精

123B dense 模型，256K context，Modified MIT。SWE-bench Verified 72.2%，成本效率是 Claude Sonnet 的 7 倍。專為程式碼生成和 agentic coding 設計。

### 前沿級總覽

| 模型 | 總參數 | 啟用參數 | 架構 | 授權 | 發布 | 特長 |
| ---- | ------ | -------- | ---- | ---- | ---- | ---- |
| GLM-5.1 | 745B | 44B | MoE | MIT | 2026/03 | 開源綜合第一 |
| Kimi K2.5 | 1T | 32B | MoE | MIT* | 2026/01 | Agent Swarm |
| Qwen3.5-397B | 397B | 17B | MoE | Apache 2.0 | 2026/02 | 多模態+多語言 |
| MiniMax-M2.5 | 230B | 10B | MoE | Modified MIT | 2026/02 | SWE-bench 最強 |
| DeepSeek-V3.1 | 671B | 37B | MoE | MIT | 2025/08 | 成本最低 |
| Llama 4 Maverick | 400B | 17B | MoE | Llama 4 | 2025/04 | 1M context |
| Llama 4 Scout | 109B | 17B | MoE | Llama 4 | 2025/04 | 10M context |
| gpt-oss-120b | 117B | 5.1B | MoE | Apache 2.0 | 2025/08 | OpenAI 開源 |
| Devstral 2 | 123B | 123B | Dense | Modified MIT | 2025/12 | 程式碼專精 |

## 中間層模型（7B–70B）

不是每個應用都需要前沿級模型。7B–70B 的模型在單機或少量 GPU 上就能跑，是很多生產場景的甜蜜點。

### Qwen3.5 Medium 系列（2026/02）

阿里巴巴在 2 月 24 日推出三個尺寸，全部 Apache 2.0、原生多模態：

| 模型 | 總參數 | 啟用參數 | 架構 | 亮點 |
| ---- | ------ | -------- | ---- | ---- |
| Qwen3.5-122B-A10B | 122B | 10B | MoE | Agentic benchmark 最強（BFCL-V4 72.2） |
| Qwen3.5-35B-A3B | 35B | 3B | MoE | 超越上一代 235B 旗艦 |
| Qwen3.5-27B | 27B | 27B | Dense | SWE-bench Verified 72.4，追平 GPT-5 mini |

**Qwen3.5-35B-A3B** 特別值得注意——3B 啟用參數就超越上一代 22B 啟用的旗艦模型，代表架構效率的巨大進步。

### Mistral Small 4（2026/03）

119B 總參數、6.5B 啟用參數的 MoE，256K context，Apache 2.0。把 Magistral（推理）、Pixtral（多模態）、Devstral（程式碼）三條產品線統一成一個模型，支援可調推理力度。

### Gemma 3（Google，2025/03）

基於 Gemini 2.0 技術，1B/4B/12B/27B 四個尺寸，多模態（文字+圖片），128K context。在 Cloudflare Workers AI 上的繁中表現比 Llama 好。

**→ [Gemma 3 on Cloudflare Workers AI：繁中應用的務實選擇](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)**

### Devstral Small 2（Mistral，2025/12）

24B dense，Apache 2.0。SWE-bench Verified 68.0%，可在消費級硬體上跑。如果你只需要程式碼能力而且硬體有限，這是性價比最高的選項。

### InternLM3-8B（上海 AI Lab，2026/01）

8B 參數，資料效率是 Llama 3.1 的 4 倍（用 4T tokens 訓練），整合對話和深度思考模式，表現追平 GPT-4o-mini。

### 其他仍然廣泛使用的模型

- **Llama 3.1 70B / 3.3 70B**（2024）：英文生態最成熟，128K context
- **Qwen3-32B / 14B / 8B**（2025/04）：Apache 2.0，中文和多語言強

## 行動端小模型（7B 以下）

1B–4B 參數的模型經過量化後，能在一般手機上做到可用的推論速度。2026 Q1 最重要的進展是 Qwen3.5 Small 系列和持續改進的推論框架。

### Qwen3.5 Small 系列（2026/03）

0.8B / 2B / 4B / 9B 四個尺寸，混合架構（Gated DeltaNet + MoE），262K context，原生多模態（4B 以上），201 語言，Apache 2.0。9B 版本甚至超越上一代 Qwen3-30B。

繁中和多語言場景的行動端首選。

### Gemma 3n（Google，2025/05–07）

行動端專用設計，Per-Layer Embeddings（PLE）讓 5B 參數模型只佔 2GB RAM。E2B/E4B 兩個尺寸，多模態（文字/圖片/音頻/影片），與 Qualcomm、MediaTek、Samsung 合作最佳化。

### 其他重要小模型

| 模型 | 參數量 | 授權 | 特長 |
| ---- | ------ | ---- | ---- |
| Llama 3.2 | 1B / 3B | Llama Community | 英文生態最成熟，128K context |
| Phi-4-mini-flash-reasoning | 3.8B | MIT | 數學推理，10x throughput |
| SmolLM3 | 3B | Apache 2.0 | 完全開源（含訓練資料），128K context |
| MobileLLM-R1 | 140M–950M | MIT | sub-billion 推理最強 |
| Tiny Aya | 3.35B | CC-BY-NC | 70+ 語言，邊緣裝置 |
| gpt-oss-20b | 21B / 3.6B active | Apache 2.0 | OpenAI 小型開源模型 |

**→ [行動端小模型完整比較：2026 年的選擇與限制](/posts/ai/2026-03-31-mobile-small-models)**

## Embedding 模型：RAG 的基礎

做 RAG 不只需要生成模型，還需要 Embedding 模型把文本向量化。2026 年這個領域的變化也很大——Qwen3-Embedding 拿下 MTEB 多語言第一，Jina v4 支援多模態 Embedding，Nomic v2 首次把 MoE 用在 Embedding 模型上。

| 模型 | 開發者 | 參數量 | 維度 | Max Tokens | 多語言 | 授權 | 特長 |
| ---- | ------ | ------ | ---- | ---------- | ------ | ---- | ---- |
| Qwen3-Embedding-8B | 阿里巴巴 | 8B | 7168 | 32K | 100+ 語言 | Apache 2.0 | MTEB 多語言第一（70.58） |
| BGE-M3 | BAAI | 568M | 1024 | 8K | 100+ 語言 | MIT | 唯一支援 dense + sparse + ColBERT 三模式 |
| Jina Embeddings v4 | Jina AI | 3.8B | 2048 | 32K | 30+ 語言 | CC-BY-NC-4.0 | 多模態（文字+圖片+PDF） |
| NV-Embed-v2 | NVIDIA | 7.85B | 4096 | 32K | 英文為主 | CC-BY-NC-4.0 | MTEB 英文高分 |
| Nomic Embed v2 | Nomic AI | 475M（MoE） | 768 | 512 | ~100 語言 | Apache 2.0 | 首個 MoE Embedding，完全開源 |
| EmbeddingGemma-300M | Google | 300M | 768 | 2K | 100+ 語言 | Gemma | 邊緣裝置部署，<200MB RAM |

怎麼選：繁中 RAG 用 **BGE-M3**（MIT、三模式檢索）或 **Qwen3-Embedding**（精度最高）。需要多模態 Embedding（圖片+PDF）用 **Jina v4**。邊緣裝置用 **EmbeddingGemma**。

**→ [BGE-M3：為什麼這個 Embedding 模型適合繁體中文 RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)**

## Reranker 模型：提升檢索精度

Embedding 負責召回，Reranker 負責精排。好的 Reranker 可以讓 RAG 的答案品質大幅提升。

| 模型 | 開發者 | 參數量 | 授權 | 特長 |
| ---- | ------ | ------ | ---- | ---- |
| Qwen3-Reranker（0.6B/4B/8B） | 阿里巴巴 | 0.6B–8B | Apache 2.0 | 搭配 Qwen3-Embedding 全套 pipeline |
| BGE Reranker v2-m3 | BAAI | 568M | MIT | 搭配 BGE-M3，最寬鬆授權 |
| Jina Reranker v3 | Jina AI | 0.6B | CC-BY-NC-4.0 | 131K context，跨文件交互 |
| gte-reranker-modernbert-base | 阿里巴巴 | 149M | Apache 2.0 | 149M 追平 1.2B Nemotron |

最務實的組合：**BGE-M3 + BGE Reranker v2-m3**（全部 MIT）或 **Qwen3-Embedding + Qwen3-Reranker**（全部 Apache 2.0）。

**→ [Cross-Encoder Reranking：讓最相關的文件排到前面](/posts/ai/2026-03-12-cross-encoder-reranking)**
**→ [ColBERT：向量搜尋的第三條路](/posts/ai/2026-03-12-colbert-late-interaction)**
**→ [SPLADE：比 BM25 更聰明的稀疏向量搜尋](/posts/ai/2026-03-12-splade-sparse-vectors)**

## 程式碼模型：專精寫 Code

前沿級 LLM 大多能寫程式碼，但有些模型是專門為 coding 最佳化的。

| 模型 | 開發者 | 參數量 | 授權 | 亮點 |
| ---- | ------ | ------ | ---- | ---- |
| Qwen3-Coder-480B-A35B | 阿里巴巴 | 480B/35B MoE | Apache 2.0 | 開源 coding 旗艦 |
| Qwen2.5-Coder-32B | 阿里巴巴 | 32B | Apache 2.0 | HumanEval 92.7%（超越 GPT-4o） |
| Devstral 2 | Mistral | 123B dense | Modified MIT | SWE-bench 72.2%，256K context |
| Devstral Small 2 | Mistral | 24B | Apache 2.0 | SWE-bench 68%，消費級硬體可跑 |
| StarCoder2-15B | BigCode | 15B | OpenRAIL-M | 600+ 程式語言，覆蓋最廣 |
| DeepSeek-Coder-V2 | DeepSeek | 236B/21B MoE | DeepSeek License | 128K context，程式碼+數學 |

## 語音模型：STT 和 TTS

### 語音轉文字（STT）

| 模型 | 開發者 | 參數量 | WER | 語言 | 授權 |
| ---- | ------ | ------ | --- | ---- | ---- |
| Canary Qwen 2.5B | NVIDIA | 2.5B | 5.63% | 英文 | CC-BY-4.0 |
| Granite Speech 3.3 8B | IBM | ~9B | 5.85% | 多語言+翻譯 | Apache 2.0 |
| Whisper Large V3 | OpenAI | 1.55B | 7.4% | 99+ 語言 | MIT |
| Whisper Large V3 Turbo | OpenAI | 809M | 7.75% | 99+ 語言 | MIT |
| Parakeet TDT 1.1B | NVIDIA | 1.1B | ~8% | 英文 | CC-BY-4.0 |

多語言首選 **Whisper V3**（MIT，99+ 語言）。英文精度最高用 **Canary Qwen**。需要即時串流用 **Parakeet TDT**（>2000x 即時速度）。

### 文字轉語音（TTS）

| 模型 | 開發者 | 參數量 | 語言 | 授權 | 特長 |
| ---- | ------ | ------ | ---- | ---- | ---- |
| Voxtral TTS | Mistral | 4B | 9 語言 | Apache 2.0 | 3 秒語音克隆，70ms 延遲，2026/03 發布 |
| Kokoro | hexgrad | 82M | 多語言 | Apache 2.0 | 82M 就能高品質合成，CPU 可跑 |
| Fish Speech V1.5 | Fish Audio | -- | 中英多語 | -- | 30 萬小時訓練，DualAR 架構 |
| Parler TTS | Hugging Face | ~600M | 英文 | Apache 2.0 | 可用 prompt 控制語氣風格 |

**Voxtral TTS** 是 2026/03 最新發布的亮點——3 秒音頻就能克隆聲音，支援串流，Apache 2.0 授權。

## 圖像生成模型

| 模型 | 開發者 | 參數量 | 授權 | 特長 |
| ---- | ------ | ------ | ---- | ---- |
| FLUX.2 Dev | Black Forest Labs | 32B | 開放權重（非商用） | 文字渲染和人物最佳 |
| FLUX.2 Klein 4B | Black Forest Labs | 4B | Apache 2.0 | 消費級 GPU 秒出圖 |
| Stable Diffusion 3.5 Large | Stability AI | 8.1B | 營收 <$1M 免費 | 12GB VRAM 可跑 |
| SDXL | Stability AI | ~3.5B | CreativeML Open RAIL-M | 生態系最成熟（LoRA、ControlNet） |

## 影片生成模型

| 模型 | 開發者 | 參數量 | 授權 | 特長 |
| ---- | ------ | ------ | ---- | ---- |
| Wan 2.2 | 阿里巴巴 | 5B/14B | Apache 2.0 | 電影級品質，5B 版消費級 GPU 可跑 |
| HunyuanVideo | 騰訊 | 13B | Tencent License | 品質追平 Runway Gen-3 |
| Open-Sora 2.0 | HPC-AI Tech | 11B | 開源 | 訓練成本僅 $200K，接近 OpenAI Sora |
| Mochi 1 | Genmo | 10B | Apache 2.0 | 商用友好 |

開源影片生成在 2026 年進步最劇烈——Wan 2.2 和 HunyuanVideo 的品質已經直接對標 Sora 和 Veo。

## 部署與推論：怎麼把模型跑起來

選完模型還要選怎麼跑。2026 年的推論生態已經相當成熟，但不同場景的最佳選擇差異很大。

### 本地開發 → Ollama

一行指令下載並啟動模型，Docker 風格的 CLI + OpenAI 相容 API。適合個人開發、原型驗證、離線使用。不適合高併發生產環境。

**→ [Ollama 完整指南：一行指令在本地跑 LLM](/posts/ai/2026-03-14-ollama-local-llm-guide)**

### 生產部署 → vLLM

PagedAttention + continuous batching + prefix caching，目前最主流的開源 LLM 推論引擎。適合需要高 throughput 的 API 服務。

**→ [vLLM：從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)**

### 邊緣 / Serverless → Cloudflare Workers AI

不想管 GPU 的話，Cloudflare Workers AI 提供免運維的推論服務。模型選擇有限，但 Gemma 3 12B 的繁中表現比 Llama 好。

**→ [Gemma 3 on Cloudflare Workers AI：繁中應用的務實選擇](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)**

### 部署方式速查

```text
你要做什麼？
├── 本地實驗 / 原型 → Ollama
├── 生產 API 服務   → vLLM（自管 GPU）或 Cloudflare Workers AI（免管）
├── 手機 App        → llama.cpp + GGUF 或 Google AI Edge
└── 離線 / 隱私     → Ollama 或 on-device 模型
```

## 排行榜現況（2026/03）

開源模型和閉源模型的差距正在快速縮小，但前沿閉源模型仍然領先。

### LMArena（原 Chatbot Arena）

5,632,160 票、333 個模型。前 9 名全是閉源（Claude Opus 4.6 以 1504 Elo 居首），開源最高的是 GLM-5 家族和 Kimi K2.5。

### Artificial Analysis Intelligence Index

314 個模型。閉源最高分 57（Gemini 3.1 Pro Preview），開源最高分 50（GLM-5 Reasoning）——差距已經從一年前的 20+ 分縮小到 7 分。

最快的模型：Mercury 2（789.2 tok/s）。最便宜的模型：Gemma 3n E4B（$0.03/M tokens）。

## 怎麼選模型：決策框架

### Step 1 — 確認場景

| 場景 | 推薦方向 |
| ---- | -------- |
| 通用對話 / Chatbot | GLM-5.1、Kimi K2.5、Qwen3.5-397B |
| 程式碼生成 / Agentic Coding | MiniMax-M2.5、GLM-5.1、Devstral 2 |
| 繁中 RAG | Gemma 3 12B（生成）+ BGE-M3（Embedding） |
| 多語言應用 | Qwen3.5 系列（201 語言） |
| 手機離線 | Gemma 3n、Qwen 3.5 Small |
| 數學 / 推理 | Phi-4-mini（手機）、DeepSeek-R1（雲端） |
| 超長文本 | Llama 4 Scout（10M context）、Kimi K2.5 |
| 預算極低 | Cloudflare Workers AI（免費額度）+ Gemma 3 |

### Step 2 — 確認限制

- **GPU 資源**：沒有 GPU → Ollama CPU 模式或 Cloudflare Workers AI；有 GPU → vLLM
- **語言需求**：繁中 → Qwen 或 Gemma 優先；英文 → Llama 或 Phi 優先
- **授權需求**：商用 → MIT / Apache 2.0（GLM-5、Qwen3.5、SmolLM3）；注意 Llama 和 Modified MIT 的限制
- **隱私需求**：不能送雲端 → 本地部署或 on-device

### Step 3 — 先跑再說

Benchmark 和實際表現不一定一致。用你自己的資料跑一輪，比看任何排行榜都有用。Ollama 讓你五分鐘內就能測完一個模型——門檻已經低到沒有理由不試。

## 怎麼追蹤最新模型

開源模型的迭代速度極快，這篇寫完可能下週又有新東西。以下是我固定追蹤的管道：

### Leaderboard / 比較站

- **[Artificial Analysis](https://artificialanalysis.ai/leaderboards/models)**：獨立測量，72 小時更新週期，314+ 模型，有速度（tokens/sec）和價格比較，可以按模型大小篩選，追蹤性價比特別好用
- **[LiveBench](https://livebench.ai/)**：每月從最新 arXiv 論文和新聞出新題目，避免 benchmark gaming，數學、程式、推理都有覆蓋
- **[LMArena](https://lmarena.ai/)**（原 Chatbot Arena）：群眾盲測 A/B 比較，產生 Elo 評分。比 benchmark 更接近「實際用起來的感覺」
- **[LiveBench](https://livebench.ai/)**：每月從最新 arXiv 論文和新聞出新題目，避免 benchmark gaming

### 即時追蹤

- **[Hugging Face Trending Models](https://huggingface.co/models?sort=trending)**：即時反映社群在下載什麼，新開源模型通常比新聞更早出現在這裡
- **[Hugging Face Daily Papers](https://huggingface.co/papers)**：社群投票的每日論文精選，新模型的技術論文幾乎都會上榜
- **[LLM Stats](https://llm-stats.com)**：每小時更新，聚合 TechCrunch、VentureBeat 等來源的模型發布新聞，可以看到過去 24 小時內的新模型
- **各實驗室官方 Blog / 公告頁**：
  - [Google AI Blog](https://blog.google/technology/ai/) · [Meta AI Blog](https://ai.meta.com/blog/) · [Microsoft Research Blog](https://www.microsoft.com/en-us/research/blog/)
  - [Qwen Blog](https://qwenlm.github.io/blog/) · [DeepSeek](https://api-docs.deepseek.com/news) · [智譜 AI（GLM）](https://open.bigmodel.cn/dev/howuse/introduction) · [月之暗面（Kimi）](https://www.moonshot.cn/)
  - [Mistral AI News](https://mistral.ai/news/) · [MiniMax](https://www.minimax.io/news) · [Stability AI](https://stability.ai/news)
  - [Hugging Face Blog](https://huggingface.co/blog) · [NVIDIA AI Blog](https://developer.nvidia.com/blog/category/generative-ai/) · [Jina AI Blog](https://jina.ai/news/) · [BAAI（BGE）](https://www.baai.ac.cn/)

### 社群

- **[r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)**：Reddit 上最活躍的本地模型社群，第一手的跑分、量化版本、實測心得大多從這裡出來
- **[Hugging Face Daily Papers](https://huggingface.co/papers)** 的留言區也常有模型作者和社群的深度討論

建議策略：用 LLM Stats 追新發布 → Hugging Face Trending 看社群反應 → Artificial Analysis / LMArena 比較數字 → r/LocalLLaMA 看實測回饋。但最終還是要用你自己的資料測——benchmark 和實際表現不一定一致。

## 整體來說

2026 年 Q1 的開源 LLM 有五個結構性趨勢：

1. **MoE 主導**：前沿級幾乎全是 MoE，啟用參數控制在 10–44B，推論成本不再隨總參數量線性增長
2. **中國實驗室領跑**：GLM-5、Kimi K2.5、Qwen3.5、MiniMax-M2.5、DeepSeek——前沿開源 top 5 有 4 個來自中國
3. **原生多模態**：Qwen3.5、Gemma 3n、Kimi K2.5 都從預訓練就整合視覺，不再是後掛 adapter
4. **MIT/Apache 2.0 成為標準**：前沿開源模型的授權越來越寬鬆，商用門檻大幅降低
5. **開源追上閉源**：GLM-5 在 Artificial Analysis 拿到 50 分，閉源最高 57 分——一年前差距超過 20 分

最大的結構性變化：選模型的決策正在從「開源 vs 閉源」轉向「自建 vs 託管」。技術能力不再是瓶頸，運維能力才是。

---

## 參考資料

站內專文：

- [GLM-5：智譜 AI 的 744B 開源模型](/posts/ai/2026-03-26-glm5-model-intro)
- [Kimi：月之暗面的長文本 AI 模型](/posts/ai/2026-03-26-kimi-model-intro)
- [能在手機上跑的小模型：2026 年的選擇與限制](/posts/ai/2026-03-31-mobile-small-models)
- [BGE-M3：為什麼這個 Embedding 模型適合繁體中文 RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
- [Ollama 完整指南：一行指令在本地跑 LLM](/posts/ai/2026-03-14-ollama-local-llm-guide)
- [vLLM：從 PagedAttention 到生產級 LLM 推論引擎](/posts/ai/2026-03-14-vllm-inference-engine)
- [Gemma 3 on Cloudflare Workers AI：繁中應用的務實選擇](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)

外部資源：

- [GLM-5 — Hugging Face](https://huggingface.co/zai-org/GLM-5)
- [Kimi K2.5 — Hugging Face](https://huggingface.co/moonshotai/Kimi-K2.5)
- [Qwen3.5-397B-A17B — Hugging Face](https://huggingface.co/Qwen/Qwen3.5-397B-A17B)
- [MiniMax-M2.5 Official](https://www.minimax.io/news/minimax-m25)
- [DeepSeek Models Guide — BentoML](https://www.bentoml.com/blog/the-complete-guide-to-deepseek-models-from-v3-to-r1-and-beyond)
- [Llama 4 — Meta AI](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [gpt-oss — OpenAI](https://openai.com/index/introducing-gpt-oss/)
- [Mistral Small 4 — Mistral AI](https://mistral.ai/news/mistral-small-4)
- [Devstral 2 — Mistral AI](https://mistral.ai/news/devstral-2-vibe-cli)
- [LMArena Leaderboard](https://lmarena.ai/)
- [Artificial Analysis LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models)
- [LiveBench](https://livebench.ai/)
- [LLM Stats — AI Model Releases](https://llm-stats.com)
- [r/LocalLLaMA — Reddit](https://reddit.com/r/LocalLLaMA)
