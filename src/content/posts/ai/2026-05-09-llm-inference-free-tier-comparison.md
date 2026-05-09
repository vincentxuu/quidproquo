---
title: "2026 年 LLM Inference 服務商免費額度與定價：30+ 家分梯整理"
date: 2026-05-09
category: ai
tags: [llm, inference, pricing, free-tier, cerebras, groq, cloudflare-workers-ai, gemini, openrouter, deepseek, nvidia-nim, modal]
lang: zh-TW
tldr: "個人專案、玩具 demo、做 RAG 原型，不想第一步就掏卡。整理 2026/05 還在運作的 30+ 家 LLM inference 服務商，按免費資源「是持續補充還是一次性」分梯，標註綁卡需求、模型清單、付費起價，數字全部從官方 pricing 頁 stealth_fetch 驗證。"
description: "比較 Cerebras、Groq、Cloudflare Workers AI、Google Gemini、OpenRouter、GitHub Models、Modal、NVIDIA NIM、iFlytek、Tencent Hunyuan 等 30+ 家 LLM inference 服務商的免費額度與定價。"
draft: false
---

個人專案、玩具 demo、做 RAG 原型，沒人想第一步就掏信用卡。問題是 LLM inference 服務商太多、價格頁更新太快、過去免費的可能已經砍掉，過去要錢的可能變成永久免費。這篇按 2026/05 實際驗證的免費資源**性質**分梯，列 30+ 家還在運作的選項，每家標註綁卡需求、主要支援模型、付費起價、以及免費 tier 的 catch。

下面數字都是直接抓官方 pricing 頁交叉比對。查不到的明說「未查到」，不為了補滿表格而瞎掰。

## 三梯隊怎麼分

關鍵差別是免費資源**是持續補充還是一次性 / 嚴格上限**：

- **第一梯隊**：每日/每分鐘自動 reset 的 quota，額度大到可以**日常跑開發**（每天幾千~幾萬請求），服務商自家 inference 基建。**拿來當主力 API**。
- **第二梯隊**：月度小額 credits、一次性註冊 credits、或嚴格 rate limit。**玩玩、試模型、做 fallback 可以；長期當主力會撞牆**。
- **第三梯隊**：純付費，無持續免費 tier。**重點看 per-token 價格便宜**。

另外獨立兩段：**完全免費（無 SLA、實驗用）** 與 **中國原廠（已驗證有免費 tier）**。

## 第一梯隊：每日自動補充的 quota

### Cerebras Inference

晶圓級 LPU，速度 1000–3000 tps，跟 Groq 並列「最快 + 最大方免費」第一梯隊。

- **免費額度**：每模型 30 RPM、900 RPH、14,400 RPD、60K TPM、1M TPH、1M TPD（GLM-4.7 較緊：10 RPM、100 RPD）
- **不需綁卡**，註冊就能拿 API key
- **熱門模型**：gpt-oss-120b、Qwen3-235B-Instruct、Llama 3.1 8B、ZAI GLM-4.7
- **付費起價（Developer tier，需儲值 $10）**：Llama 3.1 8B $0.10/$0.10、gpt-oss-120b $0.35/$0.75、Qwen3-235B $0.60/$1.20、GLM 4.7 $2.25/$2.75
- **特色**：所有主力模型 RPD 都給到 14.4K，是免費額度最一致大方的
- **Catch**：Llama 3.1 8B 與 Qwen3-235B-Instruct 將於 **2026-05-27 deprecated**

### Groq

LPU 速度 500–1000 tps，開源模型線最齊、免費 tier 模型最多（含語音、moderation、agentic）。

- **免費額度**（每模型不同，數字直接抓自 console.groq.com/docs/rate-limits）：
  - `llama-3.1-8b-instant`：30 RPM / **14.4K RPD** / 6K TPM / 500K TPD
  - `llama-3.3-70b-versatile`：30 RPM / 1K RPD / 12K TPM / 100K TPD
  - `meta-llama/llama-4-scout-17b`：30 RPM / 1K RPD / 30K TPM / 500K TPD
  - `openai/gpt-oss-120b` / `gpt-oss-20b`：30 RPM / 1K RPD / 8K TPM / 200K TPD
  - `qwen/qwen3-32b`：60 RPM / 1K RPD / 6K TPM / 500K TPD
  - 另有 Whisper、Llama Guard、Compound（agentic）等
- **不需綁卡**
- **付費起價**：Llama 3.3 70B $0.59/$0.79、gpt-oss-20b $0.075/$0.30、gpt-oss-120b $0.15/$0.60、cached input 50% off
- **特色**：模型線最廣（含語音、moderation、agentic）；Llama 3.1 8B 一天 14.4K 請求等同 Cerebras 額度
- **Catch**：重型模型 RPD 只給 1K，跑量會卡（升 Developer 才放寬）

### Cloudflare Workers AI

模型清單最齊，Workers Free plan 內含。

- **免費額度**：每日 10,000 Neurons（Free 與 Paid 帳號都有這個免費額度）
- **不需綁卡**
- **熱門模型**：Llama 3.3 70B、gpt-oss-20b/120b、Qwen3-30B、DeepSeek-R1-distill、Kimi K2.6、GLM-4.7-flash、Gemma 3
- **付費起價**：$0.011 / 1,000 Neurons；Llama 3.3 70B fp8-fast $0.293/$2.253、gpt-oss-120b $0.35/$0.75、gpt-oss-20b $0.20/$0.30
- **Catch**：Neurons 換算下每日免費量不大（Llama 3.3 70B 約 37K input + 5K output），重型模型很快用完

### Google AI Studio (Gemini API)

Gemini 3 系列原廠管道，120 萬 context 直接給。

- **免費額度**：Free tier 全部免費、不綁卡（具體 RPM/RPD 在 AI Studio 介面動態顯示，官方公開頁未列數字）
- **熱門模型**：Gemini 3 Pro Preview（實際模型 ID 是 `gemini-3.1-pro-preview`）、Gemini 3 Flash Preview、Gemini 2.5 Pro/Flash/Flash-Lite
- **付費起價**：Gemini 2.5 Flash-Lite $0.10/$0.40、2.5 Flash $0.30/$2.50、Gemini 3 Flash Preview $0.50/$3.00、Gemini 3 Pro Preview $2/$12（≤200K context）
- **Catch**：Free tier prompt 與輸出**會被用於訓練模型**（官方明文標示），正式專案要綁卡升 Tier 1 才會關閉

## 第二梯隊：月度小額 / 一次性 / 嚴格 rate limit

### (a) 月度小額 credits（用完那個月就沒了）

**Hugging Face Inference Providers**
- Free $0.10/月、PRO $2/月、Team / Enterprise $2/seat/月
- 不綁卡（用月度 credits）；零 markup，背後路由到 Cerebras / Groq / Together / Fireworks / SambaNova / Hyperbolic
- Catch：Free $0.10 極小，PRO 才開始實用

**Vercel AI Gateway**
- $5/月 credits（首次請求才開始計時）
- 各 provider 公定價，BYOK 也零 markup
- Catch：$5 用完就要儲值

**Modal**
- **Starter $30/月永久 free credits**，含 100 containers + 10 GPU concurrency
- 不綁卡
- 特色：serverless GPU 跑自己的 vLLM/SGLang，按秒計費（H100 ≈ $3.95/hr）
- Catch：要自己部署模型，不是現成 token API

### (b) 一次性註冊 credits

**SambaNova Cloud**
- 註冊送 +$5 credits（pricing 頁標示）
- RDU 晶片、速度與 Groq / Cerebras 同級
- 付費：Llama 3.3 70B $0.60/$1.20、gpt-oss-120b $0.22/$0.59、DeepSeek-V3.1-cb $0.15/$0.75
- Catch：Free tier 持續性 RPM/RPD 數字未在公開頁列出

**Inference.net**
- $25 一次性 free credits
- 自詡 90% 比 OpenAI 便宜
- 主力：Nemotron 3 Super $2.50/$5、Schematron 系列（特色小模型）、Gemma 3
- Catch：模型偏研究取向

**AI21 Jamba**
- $10 / 7 天 trial、無需信用卡
- Jamba Mini $0.2/$0.4、Jamba Large $2/$8
- 特色：Jamba 長 context、Mamba 架構
- Catch：trial 7 天到期

### (c) 嚴格 rate limit（無大量 token quota）

**OpenRouter**
- `:free` 模型 20 RPM；累積 buy <$10 → 50 RPD；buy ≥$10 → **1000 RPD**
- 不綁卡能用 free 模型（DeepSeek-V3、Llama 3.3 70B、Qwen3 等）
- 付費直接轉發各家成本，零 markup
- Catch：`:free` 模型 context 與 throughput 較差、會 fallback、prompt 可能被 provider 收集

**GitHub Models**
- Copilot Free/Pro：Low 模型 15 RPM / 150 RPD；High 模型 10 RPM / 50 RPD；Embedding 15 RPM / 150 RPD；多數 8K input / 4K output 上限
- 唯一免費試 GPT-5 / o3 的合法管道（含 o4-mini、Llama、Phi、Mistral、DeepSeek-R1、Grok-3）
- Catch：限額很緊，只夠試水溫

**Cohere Trial Key**
- 1,000 calls/月；Chat 20 RPM、Embed 2,000 inputs/min、Rerank 10 RPM
- 不綁卡;Command A、Embed、Rerank 適合 RAG
- Catch：1,000 calls/月很快用完

### (d) 額度未明但確認有 free dev tier

**NVIDIA build.nvidia.com (NIM)**
- 「Free serverless APIs for development」屬實，**具體 calls 數字本次未在公開頁驗到**
- 模型最齊：Nemotron-3 Super 120B、DeepSeek V4、Llama 3.3 70B、Kimi K2、Qwen3.5 122B、gpt-oss、Gemma 4、GLM-5.1
- 特色：官方 NVIDIA 優化、企業版要 DGX Cloud entitlement

**Nebius Token Factory**（買下 Tavily 那家）
- 「free credits to explore 60+ open-source models」屬實，**金額未列**
- 模型：gpt-oss-120B、Kimi-K2、Hermes-4-405B、GLM-4.5、Qwen3-Coder-480B、DeepSeek-R1-0528
- 特色：sub-second latency、SOC2/HIPAA、歐美 region

## 完全免費（無 SLA、實驗用）

### Pollinations.ai
- **完全免費**，pollen 自動補充（Seed 0.15 pollen/hr、Flower 0.4 pollen/hr）
- OpenAI-compatible API、不綁卡
- 主力：Gemma 4 26B、Seedance 2.0 video、文字 embedding
- 適合 prototype，不適合 SLA

### AI Horde
- **完全免費 + 匿名可用**（API key `0000000000` 直接打）
- 社群志願者 GPU、~441 tokens/sec、NLnet/NGI0 資助
- 特色：貢獻 GPU 賺 kudos 提升優先權
- Catch：速度看當下志工數、模型清單浮動、絕不能用在生產

## 中國原廠（已驗證有免費 tier）

中國原廠普遍有持續性免費或大幅促銷，但 pricing 頁對境外抓取極不友善。下面是這次能直接驗到具體數字的：

### iFlytek Spark Lite（訊飛）
- **Spark Lite 模型永久免費不限量**
- 個人認證送 20 萬 tokens、企業 100 萬 tokens
- 付費：Spark X2 ¥2-3/M、X2 Flash ¥1-2/M、Ultra ¥0.8/M、Pro ¥5/M
- 中國原廠最爽免費 tier；需實名認證

### Tencent Hunyuan（騰訊混元）
- **首次開通送 100 萬 tokens 一年內有效**（共享給 Hunyuan 2.0 Think/Instruct/T1/TurboS/a13b/Vision/embedding）
- **Hunyuan-lite 完全免費**
- 付費：HY 2.0 Think ¥3.975/¥15.9 per M、Hunyuan-T1 ¥1/¥4
- 大廠免費 tier 真實透明

### Baidu 千帆
- **註冊送 ¥20 代金券**（全平台無門檻、有效 1 個月）
- **Qwen3.5-2B 推理免費不限量**、Qwen-Image-2512 限時免費
- 模型廣場齊：DeepSeek-V4、ERNIE 5.0、ERNIE 4.5 Turbo、Kimi-K2.5、MiniMax-M2.1、Qwen3-VL-32B、GLM 5.1
- 需實名認證

## 第三梯隊：純付費（per-token 便宜）

| 服務 | 免費 | 付費起價 | 備註 |
|------|------|---------|------|
| **DeepInfra** | 無 | Llama 3.1 8B $0.02/$0.05、Qwen3-235B-A22B-Instruct $0.071/$0.10、DeepSeek-V3.2 $0.26/$0.38（cached $0.13） | per-token 全市場最便宜之一 |
| **Novita AI** | 無 | DeepSeek-V4-Flash $0.14/$0.28、Llama 3.3 70B $0.135/$0.4、Qwen3-235B $0.09/$0.58、GLM 4.5 Air $0.13/$0.85 | 模型超齊全（含影音）、價格極具競爭力 |
| **Together AI** | 註冊有少量 credits（pricing 頁未列金額） | gpt-oss-20B $0.05/$0.20、gpt-oss-120B $0.15/$0.60、Llama 3.3 70B $0.88/$0.88、DeepSeek-V3.1 $0.60/$1.70 | 模型最廣 |
| **Fireworks AI** | $1 註冊 credits | cached input 自動 50% off、batch 50% off | 細項定價放在 docs.fireworks.ai 子站 |
| **DeepSeek Platform** | 無 | v4-flash $0.14/$0.28（cache hit $0.0028）、v4-pro 75% off 期間 $0.435/$0.87（**優惠到 2026-05-31**，原價 $1.74/$3.48） | 自家最強模型最便宜 |
| **xAI Grok** | 無固定 free tier | grok-4.3 $1.25/$2.50、grok-4-1-fast $0.20/$0.50（**2026-05-15 退役**）、grok-4.20 $1.25/$2.50 | 「資料分享換 $25/月」目前 docs/models 頁未提及 |
| **Perplexity Sonar** | 無 | Sonar $1/$1（token）+ Search API $5/1K req；Sonar Pro $3/$15；Deep Research $2/$8 + 多項附加費 | 價格含內建 web search |
| **Replicate** | 無持續免費 | 按秒計費 | LLM 用不划算，主場是 image/video |
| **Chutes** | 無真免費（最低 $3/月訂閱） | $3 (Base) / $10 (Plus) / $20 (Pro) | 去中心化、TEE 機密推論、SOTA OSS 最快上架 |
| **Anthropic / OpenAI** | 過去 trial credits 政策本次未在 pricing 頁驗到 | Claude Haiku 4.5 $1/$5、GPT-5.4 mini $0.75/$4.50 | 純付費，用 OpenRouter / Vercel Gateway 試比較划算 |

## 資料未驗證或不透明

寫入文章前用 stealth_fetch 抓官方頁，以下幾家**截至 2026-05-09 未能取得可靠數字**：

- **Mistral La Plateforme**：mistral.ai/pricing 主頁只列 Le Chat 訂閱（Pro $14.99/月、Team $24.99/seat），API per-token 定價與免費 tier 在主 pricing 頁找不到；Codestral 已升級為 PREMIER（需付費），舊「Codestral free experimental」已不存在
- **Hyperbolic**：pricing 頁靠 client-side JS 動態載入，stealth_fetch 取回 client exception
- **Zhipu GLM**：open.bigmodel.cn 與 docs.bigmodel.cn pricing 子頁全部 timeout / 404，**GLM-4-Flash 是否仍完全免費未能確認**
- **Moonshot Kimi 開放平台**：platform.moonshot.cn 重定向到 platform.kimi.com，僅確認模型清單（Kimi K2.6、K2、Moonshot V1）與「文件相關接口限時免費」，token 單價未取得
- **Qwen DashScope（阿里雲百煉）**：模型清單可確認（Qwen3.6 Max-Preview / Plus / Flash），首頁標示「7000 萬免費 tokens」促銷但屬活動性質、qwen-turbo / qwen-plus 持續免費額度未在公開頁列出
- **Volcengine Doubao（字節豆包）**：頁面有「免費額度」字樣但需點開購買頁才見數字
- **MiniMax / Hailuo**：platform.minimax.io/pricing 404
- **Featherless AI**：pricing 頁靠 JS render，計畫金額未抓到（歷史約 $10/月起 unlimited tokens）
- **Baseten**：FAQ 提到 free credits 但金額未展開
- **01.AI Yi**：英文 API **已於 2025-08-25 停服**，國際版不再運作

## 推薦組合

**個人專案 / 玩具 demo**

主力疊四家，全部免費 + 不綁卡：

- **Cerebras**：跑 Qwen3-235B、gpt-oss-120b 這類大模型，速度最快
- **Groq**：跑 Llama 3.3 70B、Kimi K2、Whisper（語音），模型線最廣
- **Cloudflare Workers AI**：跑 RAG / embedding，整合 Workers / D1 / Vectorize
- **Google AI Studio**：跑 Gemini 3 Flash 試多模態與長 context

四家堆起來，日常開發的 RPM/RPD 上限非常難用完。

**自架 / serverless GPU**

- **Modal**：$30/月永久 credits 跑自己的 vLLM/SGLang
- **NVIDIA NIM**：dev 免費（額度未明），模型最齊、官方優化

**Fallback / 路由便利**

OpenRouter `:free` + HF Inference Providers PRO + Vercel AI Gateway $5/月，是備援三劍客。

**正式付費（per-token 最便宜）**

- DeepInfra（per-token 王，但無 free tier）
- Novita AI（含影音、價格極競爭）
- Groq（速度 + 價格雙優）
- DeepSeek 自家 v4-flash（$0.14/$0.28）

**中國市場**

iFlytek Spark Lite（永久免費）+ Tencent Hunyuan（100 萬 tokens）+ Baidu 千帆（¥20 + Qwen 免費），三家堆起來日常開發夠用。

## Catch 共通提醒

- **Free tier 通常會收集 prompt** 用於訓練 / 評估 / 安全分析，正式專案請走付費 key
- **模型 deprecation 很快**：5/15 grok-4-1-fast 退役、5/27 Cerebras Llama 3.1 8B / Qwen3-235B、5/31 DeepSeek v4-pro 折扣結束，都要進 calendar
- **RPM/RPD 上限是按 API key / 組織計**，多帳號繞 limit 通常違反 ToS
- **「不綁卡」≠「永久免費」**：所有 free tier 都可能無預警調整，feature flag 別省

整體來看，2026 年的好消息是免費資源比 2024 年多得多，個人開發者根本不缺 LLM API；壞消息是這層市場變動極快，半年前的整理現在多半失準。看到這篇半年後，建議直接點下面的官方連結再驗一次。

---

## 參考資料

- [Cerebras Inference Rate Limits](https://inference-docs.cerebras.ai/support/rate-limits)
- [Cerebras Inference Pricing](https://inference-docs.cerebras.ai/support/pricing)
- [Groq Rate Limits](https://console.groq.com/docs/rate-limits)
- [Groq Pricing](https://groq.com/pricing)
- [Cloudflare Workers AI Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Google Gemini API Pricing](https://ai.google.dev/pricing)
- [Google Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [OpenRouter API Limits](https://openrouter.ai/docs/api-reference/limits)
- [GitHub Models Prototyping Limits](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models)
- [Hugging Face Inference Providers Pricing](https://huggingface.co/docs/inference-providers/pricing)
- [Vercel AI Gateway Pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Cohere Rate Limits](https://docs.cohere.com/docs/rate-limits)
- [Together AI Pricing](https://www.together.ai/pricing)
- [Fireworks AI Pricing](https://fireworks.ai/pricing)
- [DeepInfra Pricing](https://deepinfra.com/pricing)
- [Novita AI Pricing](https://novita.ai/pricing)
- [DeepSeek API Pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [xAI Models](https://docs.x.ai/docs/models)
- [Perplexity API Pricing](https://docs.perplexity.ai/guides/pricing)
- [SambaNova Cloud Pricing](https://cloud.sambanova.ai/plans/pricing)
- [Modal Pricing](https://modal.com/pricing)
- [NVIDIA build.nvidia.com](https://build.nvidia.com/)
- [Nebius Token Factory](https://nebius.com/services/studio-inference-service)
- [Inference.net Pricing](https://inference.net/pricing)
- [AI21 Pricing](https://www.ai21.com/pricing)
- [Pollinations.ai](https://pollinations.ai/)
- [AI Horde](https://aihorde.net/)
- [iFlytek Spark API](https://xinghuo.xfyun.cn/sparkapi)
- [Tencent Hunyuan Pricing](https://cloud.tencent.com/document/product/1729/97731)
- [Baidu Qianfan](https://qianfan.cloud.baidu.com/)
