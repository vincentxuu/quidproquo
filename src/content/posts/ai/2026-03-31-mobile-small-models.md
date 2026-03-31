---
title: "能在手機上跑的小模型：2026 年的選擇與限制"
date: 2026-03-31
category: ai
tags: [on-device-ai, small-models, mobile, quantization, llama, gemma, phi, qwen, mistral, smollm, mobilellm]
lang: zh-TW
tldr: "2026 年行動端 LLM 主力是 Gemma 3n、Qwen 3.5 Small、Llama 3.2、Phi-4-mini、Ministral 3 和 SmolLM3。3B 以下量化模型在 8GB RAM 手機上能跑到 30–50 tokens/sec，但 RAM、散熱和 context window 仍是硬限制。"
description: "盤點 2026 年能在手機上執行的小型 LLM，包含 Gemma 3n、Qwen 3.5 Small、Llama 3.2、Phi-4-mini、Ministral 3、SmolLM3，以及量化格式、推論框架和實際限制。"
draft: false
---

手機上跑 LLM 不再是 demo 等級的事了。2026 年，1B–4B 參數的模型經過量化後，能在一般手機上做到可用的推論速度。這篇整理目前主要的模型選項、推論框架和實際限制，幫你判斷哪個組合適合你的場景。

## 模型選項

### Gemma 3n（Google）— 行動端首選

Google 在 2025 年 5 月推出 Gemma 3n，專為行動端設計。核心創新是 **Per-Layer Embeddings（PLE）**，讓 5B 參數的模型實際只佔 2GB RAM，8B 版本佔 3GB——相當於傳統 2B 和 4B 模型的記憶體用量。

支援文字、圖片和音頻輸入，內建巢狀子模型（4B 主模型裡包含 2B 子模型），可以依據延遲需求動態切換。與 Qualcomm、MediaTek、Samsung 合作最佳化硬體支援。透過 Google AI Edge 部署，prefill 階段可達數千 tok/sec。

### Qwen 3.5 Small（阿里巴巴）— 多語言與繁中最強

2026 年 3 月剛發布，取代 Qwen 2.5 成為行動端主力。四個尺寸：0.8B / 2B / 4B / 9B。

技術上的突破：混合架構（Gated Delta Networks + sparse MoE）、原生多模態訓練（4B 以上支援圖片和影片）、支援超過 200 種語言。Qwen3.5-4B 量化後約 2.5–3GB，可以在 8GB RAM 的手機上跑。社群測試 2B 模型在 iPhone 上開飛航模式能跑 30–50 tokens/sec。

如果你的應用場景是繁中或多語言，Qwen 3.5 Small 是目前最值得測試的選項。

### Llama 3.2（Meta）— 英文生態系最成熟

1B 和 3B，從 Llama 3.1 8B/70B 透過剪枝（pruning）和知識蒸餾（distillation）壓縮而來。支援 128K context window。1B 量化後約 0.7GB，3B 約 1.8GB。

Meta 提供官方量化版本，比原始 BF16 格式快 2–4 倍、模型大小減少 56%、記憶體用量減少 41%。Snapdragon 8 Gen 4 上 Llama 3.2 3B 4-bit 量化據報可超過 200 tokens/sec。

英文生態系最成熟，工具呼叫支援也最完整，但中文能力相對弱。

### Phi-4-mini（Microsoft）— 推理能力突出

3.8B 參數，dense decoder-only transformer，支援 128K context。數學推理上甚至贏 GPT-4o。透過 Microsoft Olive + ONNX GenAI Runtime 可部署到 iPhone、Android 和 Windows。

Microsoft 還推出了 **Phi-4-mini-flash-reasoning**，針對邊緣裝置最佳化，throughput 提升 10 倍、延遲降低 2–3 倍。如果你需要在手機上做推理密集的任務（數學解題、邏輯分析），Phi-4 系列是最佳選擇。

### Ministral 3（Mistral）— 邊緣裝置全面覆蓋

2025 年 12 月 Mistral 3 家族的一部分，3B / 8B / 14B 三個尺寸。3B 量化後可以在 4GB VRAM 的裝置上跑。Apache 2.0 授權，商用無限制。

Mistral 的策略是「AI 的下一波不是靠規模，而是靠無所不在」——讓模型小到能跑在無人機、車輛、機器人和手機上。搭配 2026 年初推出的 Voxtral TTS（4B 語音合成模型），Mistral 在語音 AI on-device 這塊也開始有佈局。

### MobileLLM-R1（Meta）— 不到 1B 的推理怪物

Meta 專為手機 CPU 設計的系列，140M 到 950M 四個尺寸。核心設計哲學是「深而窄」（deep-and-thin）——在 sub-billion 尺度下，更多層數搭配更小的 hidden dimension，比又寬又淺的架構效果好得多。

MobileLLM-R1-950M 在 MATH benchmark 上是 OLMo 1.24B 的 5 倍準確率、SmolLM2 1.7B 的 2 倍，參數量卻更小。125M 版本在 iPhone 上跑到 50 tokens/sec，能處理基本任務。

進階版 **MobileLLM-R1.5** 用 on-policy 知識蒸餾再提升 10–35 個百分點的推理準確率。如果你的場景是數學、程式碼或科學推理，而且裝置記憶體極度受限，這是目前最好的選擇。

### SmolLM3（Hugging Face）— 開源透明度最高

3B 參數，支援 128K context（透過 YARN 外推），6 種語言。在 3B 級距打贏 Llama 3.2 3B，接近 Qwen3-4B 和 Gemma3-4B 的表現。支援雙模式推理（深度思考和快速回應）。

完全開源——訓練資料、程式碼、訓練配置全部公開，Apache 2.0 授權。如果你需要可審計、可復現的模型，SmolLM3 是唯一選擇。

## 推論框架

模型本身只是權重檔案，要在手機上跑還需要推論框架。

| 框架 | 平台 | 特色 |
|------|------|------|
| Google AI Edge（MediaPipe） | Android / iOS | Google 官方，支援 Gemma 3n，GPU 加速，最容易上手 |
| llama.cpp（GGUF） | 全平台 | 最通用，社群大，幾乎所有模型都有 GGUF 格式 |
| MLC LLM | Android / iOS | 編譯成原生 GPU shader（Vulkan/Metal），速度通常最快 |
| ExecuTorch | Android / iOS | Meta 官方，Llama 的最佳路徑，支援 CoreML 和 XNNPACK |
| Core ML | iOS | Apple 原生，在 Apple Silicon 上效能最好，但只能用在 Apple 生態 |
| ONNX Runtime Mobile | 全平台 | Microsoft 主推，Phi 模型的最佳化路徑 |

手機上也有現成的 app 可以直接跑模型：**SmolChat**（支援任何 GGUF 模型）、**MNN Chat**（專注速度和效率）、**Off Grid**（完全離線、免帳號）。

如果沒有特殊需求，llama.cpp + GGUF 是最安全的起點——模型選擇最多、社群資源最豐富。

## 量化：怎麼把模型塞進手機

原始的 FP16 模型太大，手機跑不動。量化是把權重從 16-bit 壓到 4-bit 甚至 2-bit 的過程。

**GGUF**（llama.cpp 格式）是目前行動端最主流的量化格式。常見的量化等級：

- **Q4_K_M**：4-bit，品質和大小的最佳平衡點，大多數場景用這個
- **Q3_K_S**：3-bit，再小一點，品質稍降
- **Q2_K**：2-bit，極限壓縮，品質犧牲明顯，只適合 demo

一個粗略的換算：**1B 參數 ≈ Q4 量化後 0.6–0.7GB**。

其他量化方式（AWQ、GPTQ）主要用在 server 端，行動端大多還是轉成 GGUF 來用。

## 實際限制

在手機上跑 LLM 聽起來很酷，但硬體限制很現實：

**RAM 是最大瓶頸**。模型要整個載入記憶體。4GB RAM 的手機只能穩定跑 1B 模型，8GB 的可以處理 3–4B。Gemma 3n 的 PLE 技術是目前唯一有效突破這個限制的方案。

**Context window 受限**。KV cache 吃記憶體，實際上手機端大多只能用 2K–4K tokens 的 context。有些模型號稱支援 128K，但在手機上根本用不到那麼多。

**散熱會降速**。持續推論超過 30 秒，手機開始熱節流，速度可能掉 30–50%。這代表長文生成的體驗不會太好。

**電量消耗**。一次長對話大約吃 5–10% 電量。不是不能接受，但使用者會注意到。

## 實際場景

考慮到這些限制，目前 on-device LLM 比較適合：

- **離線摘要**：在沒網路的地方幫文章、email 做重點整理
- **智慧回覆**：短文本生成，像 Smart Reply 那種 1–2 句話的回應
- **隱私敏感處理**：醫療筆記、法律文件等不想送到雲端的內容
- **離線翻譯**：搭配 Qwen 3.5 這類多語言模型，基本翻譯可以離線做

不太適合的：長文生成、複雜多輪對話、需要大 context 的 RAG——這些還是留給雲端。

## 選模型的決策流程

```
你的主要語言是什麼？
├── 中文（繁/簡）→ Qwen 3.5 Small 或 Gemma 3n
├── 英文為主   → Llama 3.2 或 Phi-4-mini
└── 多語言     → Gemma 3n 或 Qwen 3.5 Small

你的裝置 RAM？
├── 4GB  → Gemma 3n E2B 子模型、Qwen 3.5 0.8B、MobileLLM-R1
├── 6GB  → Llama 3.2 1B、Qwen 3.5 2B、SmolLM3、Ministral 3 3B（Q4）
├── 8GB+ → Gemma 3n E4B、Qwen 3.5 4B、Llama 3.2 3B、Phi-4-mini

你需要什麼能力？
├── 簡單分類/提取     → Qwen 3.5 0.8B、MobileLLM-R1 140M
├── 摘要/回覆         → 1B–3B
├── 推理/數學（低資源）→ MobileLLM-R1.5 950M
├── 推理/數學（8GB+） → Phi-4-mini-flash-reasoning
└── 多模態（圖片+文字）→ Gemma 3n 或 Qwen 3.5 4B+
```

## 怎麼追蹤最新模型

小模型的迭代速度很快，這篇寫完可能下個月又有新東西。幾個值得固定追蹤的管道：

- **[Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)**：標準化 benchmark 排行，新模型上線幾乎都會先跑這裡的評測。目前超過 250 萬個模型，是比較 raw specs 最方便的地方
- **[LMSYS Chatbot Arena](https://chat.lmsys.org/)**：群眾盲測 A/B 比較，產生 Elo 評分。比 benchmark 更接近「實際用起來的感覺」，但小模型的投票數可能不夠多
- **[LLM Stats](https://llm-stats.com)**：每小時更新，聚合 TechCrunch、VentureBeat 等來源的模型發布新聞，可以看到過去 24 小時內的新模型
- **[r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)**：Reddit 上最活躍的本地模型社群，第一手的跑分、量化版本、手機實測心得大多從這裡出來
- **各實驗室官方 Blog**：[Google AI Blog](https://blog.google/technology/ai/)、[Meta AI Blog](https://ai.meta.com/blog/)、[Microsoft Research Blog](https://www.microsoft.com/en-us/research/blog/)、[Mistral Blog](https://mistral.ai/news/)、[Qwen Blog](https://qwenlm.github.io/blog/)

建議策略：用 LLM Stats 或 RSS 追新發布，到 Hugging Face Leaderboard 比較數字，最後在 r/LocalLLaMA 看社群實測回饋。但最終還是要用你自己的資料測——benchmark 和實際表現不一定一致。

## 整體來說

2026 年的 on-device LLM 已經從「技術 demo」進入「特定場景可用」的階段。跟一年前最大的差異是 Gemma 3n 的 PLE 技術和 Qwen 3.5 的原生多模態——前者讓大模型塞進小記憶體，後者讓手機上的 AI 能同時處理文字和圖片。

關鍵的取捨仍然是：你願意犧牲多少品質來換取離線能力和隱私。對大多數應用來說，最務實的策略是 on-device 處理簡單任務（分類、短回覆、隱私資料），複雜的留給雲端——混合架構比全押任何一邊都合理。

## 參考資料

- [Gemma 3n — Google DeepMind](https://deepmind.google/models/gemma/gemma-3n/)
- [Announcing Gemma 3n preview: powerful, efficient, mobile-first AI](https://developers.googleblog.com/en/introducing-gemma-3n/)
- [Gemma 3 on mobile and web with Google AI Edge](https://developers.googleblog.com/en/gemma-3-on-mobile-and-web-with-google-ai-edge/)
- [Qwen 3.5 Small Model Series（阿里巴巴）](https://medium.com/data-science-in-your-pocket/qwen-3-5-small-model-series-released-7a5ed34fcbb3)
- [Alibaba releases Qwen 3.5 Small models — MarkTechPost](https://www.marktechpost.com/2026/03/02/alibaba-just-released-qwen-3-5-small-models-a-family-of-0-8b-to-9b-parameters-built-for-on-device-applications/)
- [Llama 3.2: Revolutionizing edge AI and vision with open, customizable models](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/)
- [Meta quantized Llama models](https://ai.meta.com/blog/meta-llama-quantized-lightweight-models/)
- [Phi-4-mini-flash-reasoning — Microsoft Azure Blog](https://azure.microsoft.com/en-us/blog/reasoning-reimagined-introducing-phi-4-mini-flash-reasoning/)
- [Welcome to the new Phi-4 models — Microsoft](https://techcommunity.microsoft.com/blog/educatordeveloperblog/welcome-to-the-new-phi-4-models---microsoft-phi-4-mini--phi-4-multimodal/4386037)
- [SmolLM3: smol, multilingual, long-context reasoner — Hugging Face Blog](https://huggingface.co/blog/smollm3)
- [SmolLM3-3B Hugging Face](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- [Mistral 3 launches for open AI era — eWEEK](https://www.eweek.com/news/mistral-3-launch/)
- [Mistral launches Mistral 3 for laptops, drones, and edge devices — VentureBeat](https://venturebeat.com/ai/mistral-launches-mistral-3-a-family-of-open-models-designed-to-run-on/)
- [MobileLLM-R1: Exploring the Limits of Sub-Billion Language Model Reasoners — 論文](https://arxiv.org/abs/2509.24945)
- [MobileLLM-R1-950M — Hugging Face](https://huggingface.co/facebook/MobileLLM-R1-950M)
- [MobileLLM GitHub](https://github.com/facebookresearch/MobileLLM)
- [ExecuTorch — Meta 行動端推論框架](https://github.com/pytorch/executorch)
- [llama.cpp GitHub](https://github.com/ggml-org/llama.cpp)
- [MLC LLM GitHub](https://github.com/mlc-ai/mlc-llm)
- [On-Device LLMs in 2026: What Changed, What Matters, What's Next](https://www.edge-ai-vision.com/2026/01/on-device-llms-in-2026-what-changed-what-matters-whats-next/)
- [The Best Open-Source Small Language Models in 2026 — BentoML](https://www.bentoml.com/blog/the-best-open-source-small-language-models)
- [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)
- [LMSYS Chatbot Arena](https://chat.lmsys.org/)
- [LLM Stats — AI Model Releases](https://llm-stats.com/ai-news)
