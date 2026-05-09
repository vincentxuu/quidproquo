---
title: "2026 年 LLM Inference 服務商免費額度與定價：40+ 家分梯整理"
date: 2026-05-09
category: ai
tags: [llm, inference, pricing, free-tier, cerebras, groq, cloudflare-workers-ai, gemini, openrouter, deepseek, nvidia-nim, modal, ollama, mistral]
lang: zh-TW
tldr: "個人專案、玩具 demo、做 RAG 原型，不想第一步就掏卡。整理 2026/05 還在運作的 40+ 家 LLM inference 服務商，按免費資源「是持續補充還是一次性」分梯，標註綁卡需求、模型清單、付費起價，數字全部從官方 pricing 頁驗證。中國原廠含智谱 GLM（永久免費）、豆包（每日 200 萬 tokens）、Kimi、百煉、Ollama 本地跑法一併收錄。"
description: "比較 Cerebras、Groq、Cloudflare Workers AI、Google Gemini、OpenRouter、GitHub Models、Modal、NVIDIA NIM、Ollama、Mistral、智谱 GLM、Volcengine Doubao、Moonshot Kimi、Qwen DashScope 等 40+ 家 LLM inference 服務商的免費額度與定價。"
draft: false
---

個人專案、玩具 demo、做 RAG 原型，沒人想第一步就掏信用卡。問題是 LLM inference 服務商太多、價格頁更新太快、過去免費的可能已經砍掉，過去要錢的可能變成永久免費。這篇按 2026/05 實際驗證的免費資源**性質**分梯，列 40+ 家還在運作的選項，每家標註綁卡需求、主要支援模型、付費起價、以及免費 tier 的 catch。

下面數字都是直接抓官方 pricing 頁交叉比對。查不到的明說「未查到」，不為了補滿表格而瞎掰。

## 三梯隊怎麼分

關鍵差別是免費資源**是持續補充還是一次性 / 嚴格上限**：

- **第一梯隊**：每日/每分鐘自動 reset 的 quota，額度大到可以**日常跑開發**（每天幾千~幾萬請求），服務商自家 inference 基建。**拿來當主力 API**。
- **第二梯隊**：月度小額 credits、一次性註冊 credits、或嚴格 rate limit。**玩玩、試模型、做 fallback 可以；長期當主力會撞牆**。
- **第三梯隊**：純付費，無持續免費 tier。**重點看 per-token 價格便宜**。

另外獨立兩段：**完全免費（無 SLA、實驗用）** 與 **中國原廠（已驗證有免費 tier）**。

## 第一梯隊：每日自動補充的 quota

### [Cerebras Inference](https://inference.cerebras.ai/)

晶圓級 LPU，速度 1000–3000 tps，跟 Groq 並列「最快 + 最大方免費」第一梯隊。

- **免費額度**：每模型 30 RPM、900 RPH、14,400 RPD、60K TPM、1M TPH、1M TPD（GLM-4.7 較緊：10 RPM、100 RPD）
- **不需綁卡**，註冊就能拿 API key
- **熱門模型**：gpt-oss-120b、Qwen3-235B-Instruct、Llama 3.1 8B、ZAI GLM-4.7
- **付費起價（Developer tier，需儲值 $10）**：Llama 3.1 8B $0.10/$0.10、gpt-oss-120b $0.35/$0.75、Qwen3-235B $0.60/$1.20、GLM 4.7 $2.25/$2.75
- **特色**：所有主力模型 RPD 都給到 14.4K，是免費額度最一致大方的
- **Catch**：Llama 3.1 8B 與 Qwen3-235B-Instruct 將於 **2026-05-27 deprecated**

### [Groq](https://groq.com/)

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

### [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)

模型清單最齊，Workers Free plan 內含。

- **免費額度**：每日 10,000 Neurons（Free 與 Paid 帳號都有這個免費額度）
- **不需綁卡**
- **熱門模型**：Llama 3.3 70B、gpt-oss-20b/120b、Qwen3-30B、DeepSeek-R1-distill、Kimi K2.6、GLM-4.7-flash、Gemma 3
- **付費起價**：$0.011 / 1,000 Neurons；Llama 3.3 70B fp8-fast $0.293/$2.253、gpt-oss-120b $0.35/$0.75、gpt-oss-20b $0.20/$0.30
- **Catch**：Neurons 換算下每日免費量不大（Llama 3.3 70B 約 37K input + 5K output），重型模型很快用完

### [Google AI Studio](https://aistudio.google.com/) (Gemini API)

Gemini 3 系列原廠管道，120 萬 context 直接給。

- **免費額度**：Free tier 全部免費、不綁卡（具體 RPM/RPD 在 AI Studio 介面動態顯示，官方公開頁未列數字）
- **熱門模型**：Gemini 3 Pro Preview（實際模型 ID 是 `gemini-3.1-pro-preview`）、Gemini 3 Flash Preview、Gemini 2.5 Pro/Flash/Flash-Lite
- **付費起價**：Gemini 2.5 Flash-Lite $0.10/$0.40、2.5 Flash $0.30/$2.50、Gemini 3 Flash Preview $0.50/$3.00、Gemini 3 Pro Preview $2/$12（≤200K context）
- **Catch**：Free tier prompt 與輸出**會被用於訓練模型**（官方明文標示），正式專案要綁卡升 Tier 1 才會關閉

## 第二梯隊：月度小額 / 一次性 / 嚴格 rate limit

### (a) 月度小額 credits（用完那個月就沒了）

**[Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers/pricing)**
- Free $0.10/月、PRO $2/月、Team / Enterprise $2/seat/月
- 不綁卡（用月度 credits）；零 markup，背後路由到 Cerebras / Groq / Together / Fireworks / SambaNova / Hyperbolic
- Catch：Free $0.10 極小，PRO 才開始實用

**[Vercel AI Gateway](https://vercel.com/docs/ai-gateway)**
- $5/月 credits（首次請求才開始計時）
- 各 provider 公定價，BYOK 也零 markup
- Catch：$5 用完就要儲值

**[Modal](https://modal.com/)**
- **Starter $30/月永久 free credits**，含 100 containers + 10 GPU concurrency
- 不綁卡
- 特色：serverless GPU 跑自己的 vLLM/SGLang，按秒計費（H100 ≈ $3.95/hr）
- Catch：要自己部署模型，不是現成 token API

### (b) 一次性註冊 credits

**[SambaNova Cloud](https://cloud.sambanova.ai/)**
- 註冊送 **$5 credits（30 天有效）**；credits 用完後 Free tier 仍持續（不消失）
- **Free tier**（無需綁卡）：DeepSeek-V3.1、Llama 3.3 70B、gpt-oss-120b 各 20 RPM / 20 RPD / 200K TPD
- RDU 晶片、速度與 Groq / Cerebras 同級
- 付費：Llama 3.3 70B $0.60/$1.20、gpt-oss-120b $0.22/$0.59、DeepSeek-V3.1 $0.15/$0.75
- Catch：Developer tier（綁卡後）才放寬到 60 RPM / 12K RPD

**[Inference.net](https://inference.net/)**
- $25 一次性 free credits
- 自詡 90% 比 OpenAI 便宜
- 主力：Nemotron 3 Super $2.50/$5、Schematron 系列（特色小模型）、Gemma 3
- Catch：模型偏研究取向

**[AI21 Jamba](https://www.ai21.com/)**
- $10 / 7 天 trial、無需信用卡
- Jamba Mini $0.2/$0.4、Jamba Large $2/$8
- 特色：Jamba 長 context、Mamba 架構
- Catch：trial 7 天到期

**[Baseten](https://www.baseten.co/)**
- 新 workspace **$30 一次性 free credits**（官方 changelog 明文）
- Basic 方案 $0/月、pay-as-you-go；DeepSeek V4 $1.74/$3.48、gpt-oss-120B $0.10/$0.50、Kimi K2.6 $1.00/$3.90
- 特色：同時支援 Model API（token 計費）與 Dedicated GPU Deployment（按分鐘計費，T4 起 $0.01052/min）
- Catch：$30 用完後需加值；rate limit 低（Basic 未驗證 15 RPM / 100K TPM）

### (c) 嚴格 rate limit（無大量 token quota）

**[OpenRouter](https://openrouter.ai/)**
- `:free` 模型 20 RPM；累積 buy <$10 → 50 RPD；buy ≥$10 → **1000 RPD**
- 不綁卡能用 free 模型（DeepSeek-V3、Llama 3.3 70B、Qwen3 等）
- 付費直接轉發各家成本，零 markup
- Catch：`:free` 模型 context 與 throughput 較差、會 fallback、prompt 可能被 provider 收集

**[GitHub Models](https://github.com/marketplace/models)**
- Copilot Free/Pro：Low 模型 15 RPM / 150 RPD；High 模型 10 RPM / 50 RPD；Embedding 15 RPM / 150 RPD；多數 8K input / 4K output 上限
- 唯一免費試 GPT-5 / o3 的合法管道（含 o4-mini、Llama、Phi、Mistral、DeepSeek-R1、Grok-3）
- Catch：限額很緊，只夠試水溫

**[Cohere](https://cohere.com/) Trial Key**
- 1,000 calls/月；Chat 20 RPM、Embed 2,000 inputs/min、Rerank 10 RPM
- 不綁卡;Command A、Embed、Rerank 適合 RAG
- Catch：1,000 calls/月很快用完

### (d) 額度未明但確認有 free dev tier

**[NVIDIA NIM](https://build.nvidia.com/)** (build.nvidia.com)
- 註冊送 **1,000 inference credits**；提供商業信箱可再申請 4,000（共 5,000），同時啟動 90 天 NVIDIA AI Enterprise 免費試用
- Credits 不過期；40 RPM（可申請提升至 200 RPM）
- 模型最齊：Nemotron-3 Super 120B、DeepSeek V4、Llama 3.3 70B、Kimi K2、Qwen3.5 122B、gpt-oss、Gemma 4、GLM-5.1
- 特色：官方 NVIDIA 優化、企業版要 DGX Cloud entitlement
- Catch：credits 用於開發 / 原型，不供生產使用

**[Nebius Token Factory](https://nebius.com/services/studio-inference-service)**（買下 Tavily 那家）
- 新帳號 **$1 trial credit（30 天有效）**；需綁卡才能完成 onboarding
- 模型：gpt-oss-120B、Kimi-K2、Hermes-4-405B、GLM-4.5、Qwen3-Coder-480B、DeepSeek-R1-0528
- 特色：sub-second latency、SOC2/HIPAA、歐美 region
- Catch：$1 額度極小，基本只夠試一兩個請求

## 完全免費（無 SLA、實驗用）

### [Pollinations.ai](https://pollinations.ai/)
- **完全免費**，pollen 自動補充（Seed 0.15 pollen/hr、Flower 0.4 pollen/hr）
- OpenAI-compatible API、不綁卡
- 主力：Gemma 4 26B、Seedance 2.0 video、文字 embedding
- 適合 prototype，不適合 SLA

### [AI Horde](https://aihorde.net/)
- **完全免費 + 匿名可用**（API key `0000000000` 直接打）
- 社群志願者 GPU、~441 tokens/sec、NLnet/NGI0 資助
- 特色：貢獻 GPU 賺 kudos 提升優先權
- Catch：速度看當下志工數、模型清單浮動、絕不能用在生產

### [Ollama](https://ollama.com/)（本地運行）

本地模型運行器，在自己機器裝好就能跑開源 LLM；另有雲端 tier 跑消費級硬體塞不下的超大模型。

- **本地推論**：完全免費不限量，自己 GPU / CPU 跑，支援離線使用
- **雲端免費 tier**：1 個 concurrent 模型，GPU 時間限制（session 每 5 小時、weekly 每 7 天自動 reset）
- **不需綁卡**（本地及雲端 free tier 皆是）
- **付費 Pro $20/月（$200/年）**：3 concurrent 雲端模型、50x 更多雲端用量、私有模型上傳
- **付費 Max $100/月**：10 concurrent 雲端模型
- **模型庫**：Qwen3.5、Gemma 4、DeepSeek V4、Kimi K2.6、GLM-5.1、Mistral Medium 3.5、Llama 系列等數百個
- **OpenAI-compatible REST API**：改 base URL 即可從 OpenAI 無縫切換；支援 tool calling
- **Cloud-only 模型**（本地塞不下）：DeepSeek V4 Pro 684B MoE、Kimi K2.6 等超大 MoE
- **隱私**：本地與雲端 prompt / response 均不記錄、不訓練；雲端走 NVIDIA Cloud（US / EU / Singapore），zero data retention
- **Catch**：雲端 tier 限 GPU 時間而非 token 數，高並發需付費；只跑 open model，無 GPT / Claude

## 中國原廠（已驗證有免費 tier）

中國原廠普遍有持續性免費或大幅促銷，但 pricing 頁對境外抓取極不友善。下面是這次能直接驗到具體數字的：

### [iFlytek Spark Lite](https://xinghuo.xfyun.cn/sparkapi)（訊飛）
- **Spark Lite 模型永久免費不限量**
- 個人認證送 20 萬 tokens、企業 100 萬 tokens
- 付費：Spark X2 ¥2-3/M、X2 Flash ¥1-2/M、Ultra ¥0.8/M、Pro ¥5/M
- 中國原廠最爽免費 tier；需實名認證

### [Tencent Hunyuan](https://cloud.tencent.com/product/hunyuan)（騰訊混元）
- **首次開通送 100 萬 tokens 一年內有效**（共享給 Hunyuan 2.0 Think/Instruct/T1/TurboS/a13b/Vision/embedding）
- **Hunyuan-lite 完全免費**
- 付費：HY 2.0 Think ¥3.975/¥15.9 per M、Hunyuan-T1 ¥1/¥4
- 大廠免費 tier 真實透明

### [Baidu 千帆](https://qianfan.cloud.baidu.com/)
- **註冊送 ¥20 代金券**（全平台無門檻、有效 1 個月）
- **Qwen3.5-2B 推理免費不限量**、Qwen-Image-2512 限時免費
- 模型廣場齊：DeepSeek-V4、ERNIE 5.0、ERNIE 4.5 Turbo、Kimi-K2.5、MiniMax-M2.1、Qwen3-VL-32B、GLM 5.1
- 需實名認證

### [Zhipu GLM](https://bigmodel.cn/)（智谱 AI）

多款 Flash 模型永久免費，是中國原廠免費 tier 最大方之一。

- **永久免費模型**：GLM-4-Flash（128K）、GLM-4.7-Flash（200K）、GLM-4.5-Flash、GLM-4V-Flash（多模態視覺）等系列，**無 token 上限**，30 concurrent 限制
- **不需綁卡**；需實名認證
- **新用戶贈送**：2,000 萬 tokens（GLM-4.5-Air 等值，市值 ¥58）
- **付費定價**（元/百萬 tokens）：GLM-5.1 ¥6/¥24、GLM-4.7 ¥2/¥8、GLM-4.5 ¥1/¥4、GLM-4.5-Air ¥0.8/¥2–8、GLM-Z1-Air（推理）¥0.5/¥0.5
- **特色**：Flash 系列涵蓋文字、多模態、推理，永久免費覆蓋面最廣
- **Catch**：open.bigmodel.cn 境外存取不穩定；30 concurrent 開發夠用，生產建議升付費

### [Volcengine Doubao](https://www.volcengine.com/product/ark)（字節跳動豆包）

兩層免費計畫：模型體驗額度 + 每日 200 萬 token 協作獎勵。

- **安心體驗模式**：主力模型各送 50 萬 tokens（一次性），登入自動開通
- **協作獎勵計畫**：每日 200 萬 tokens，自動 reset（需在 console **手動開通**；涵蓋 Doubao、Qwen、DeepSeek、Kimi、MiniMax、GLM 等多家模型）
- **不需綁卡**；需實名認證
- **付費定價**（元/百萬 tokens）：Doubao-Seed-2.0-mini ¥0.2/¥2.0、Seed-2.0-lite ¥0.6/¥3.6、Seed-2.0-pro ¥3.2/¥16（≤32K context）；Doubao-1.5-lite ¥0.3/¥0.6、1.5-pro ¥0.8/¥2；DeepSeek-V3 ¥2/¥8、R1 ¥4/¥16
- **Catch**：協作獎勵需手動開通才生效；Seed 系列依 context 長度分梯計費，超過 32K 後跳高

### [Qwen DashScope](https://bailian.console.aliyun.com/)（阿里雲百煉）

新用戶每模型送 100 萬 tokens、90 天有效；「7,000 萬 tokens」是行銷加總非單模型額度。

- **新用戶免費額度**：約 70 個支援模型各送 100 萬 tokens，**90 天有效**（非永久），加總得到「7,000 萬 tokens」行銷數字
- **不需綁卡**；需實名認證（阿里雲帳號）
- **付費定價**（元/百萬 tokens，≤128K input）：qwen-turbo ¥0.3/¥0.6（思考模式輸出 ¥3）、qwen-plus ¥0.8/¥2（思考 ¥8）、qwen-max ¥2.4/¥9.6、qwen3-max（≤32K）¥2.5/¥10；Batch API 全線 5 折
- **Catch**：免費額度 90 天到期即消失；pricing 頁 JS 渲染，境外需登入帳號才見完整數字

### [Moonshot Kimi](https://platform.kimi.com/) 開放平台

無永久免費 tier，新用戶有 ¥15 體驗券；K2.6 為現行主力，K2 系列 2026-05-25 下線。

- **新用戶**：¥15 免費體驗券（需中國手機號），3 個月有效，用完 API 返回 403
- **K2 系列（K2 0711 / K2 0905）**：**2026-05-25 正式下線**，官方要求遷移至 K2.5 / K2.6
- **付費定價**（元/百萬 tokens）：Kimi K2.6 input ¥6.50（cache hit ¥1.10）/ output ¥27（256K context）；Kimi K2.5 ¥4.00（cache ¥0.70）/ ¥21；Moonshot V1 8K $0.20/$2.00（美元）
- **Catch**：K2.6 比 K2.5 貴約 60%；rate limit tier 靠累計充值解鎖；無境外持續免費 tier

## 第三梯隊：純付費（per-token 便宜）

| 服務 | 免費 | 付費起價 | 備註 |
|------|------|---------|------|
| [**DeepInfra**](https://deepinfra.com/) | 無 | Llama 3.1 8B $0.02/$0.05、Qwen3-235B-A22B-Instruct $0.071/$0.10、DeepSeek-V3.2 $0.26/$0.38（cached $0.13） | per-token 全市場最便宜之一 |
| [**Novita AI**](https://novita.ai/) | 無 | DeepSeek-V4-Flash $0.14/$0.28、Llama 3.3 70B $0.135/$0.4、Qwen3-235B $0.09/$0.58、GLM 4.5 Air $0.13/$0.85 | 模型超齊全（含影音）、價格極具競爭力 |
| [**Together AI**](https://www.together.ai/) | 無（最低儲值 $5 才能使用，無自動贈送） | gpt-oss-20B $0.05/$0.20、gpt-oss-120B $0.15/$0.60、Llama 3.3 70B $0.88/$0.88、DeepSeek-V3.1 $0.60/$1.70 | 模型最廣；Startup Accelerator 可申請 $15K–$50K credits |
| [**Fireworks AI**](https://fireworks.ai/) | $1 註冊 credits | cached input 自動 50% off、batch 50% off | 細項定價放在 docs.fireworks.ai 子站 |
| [**DeepSeek Platform**](https://platform.deepseek.com/) | 無 | v4-flash $0.14/$0.28（cache hit $0.0028）、v4-pro 75% off 期間 $0.435/$0.87（**優惠到 2026-05-31**，原價 $1.74/$3.48） | 自家最強模型最便宜 |
| [**xAI Grok**](https://x.ai/) | 無固定 free tier | grok-4.3 $1.25/$2.50、grok-4-1-fast $0.20/$0.50（**2026-05-15 退役**）、grok-4.20 $1.25/$2.50 | 「資料分享換 $25/月」目前 docs/models 頁未提及 |
| [**Perplexity Sonar**](https://www.perplexity.ai/) | 無 | Sonar $1/$1（token）+ Search API $5/1K req；Sonar Pro $3/$15；Deep Research $2/$8 + 多項附加費 | 價格含內建 web search |
| [**Replicate**](https://replicate.com/) | 無持續免費 | 按秒計費 | LLM 用不划算，主場是 image/video |
| [**Chutes**](https://chutes.ai/) | 無真免費（最低 $3/月訂閱） | $3 (Base) / $10 (Plus) / $20 (Pro) | 去中心化、TEE 機密推論、SOTA OSS 最快上架 |
| [**Mistral La Plateforme**](https://mistral.ai/) | 無（Le Chat 聊天介面免費，API 無免費 tier） | Large 3 $0.50/$1.50、Small 4 $0.15/$0.60、Codestral $0.30/$0.90、Medium 3.5 $1.50/$7.50、Magistral Medium $2/$5；batch 全線 5 折 | Codestral 已轉付費（Premier）；Ministral Edge 系列 $0.10–$0.20 per M flat |
| [**Hyperbolic**](https://hyperbolic.xyz/) | 無 | serverless pay-as-you-go 起 ~$0.10/1M tokens；GPU on-demand 起 $1.39/hr（H100/H200） | 同時提供按時計費 GPU 租用與 reserved cluster（需洽談） |
| [**MiniMax / Hailuo**](https://platform.minimax.io/) | 無（訂閱制，$10/月起） | M2.7 $0.30/$1.20、M2.7-highspeed $0.60/$2.40；Starter Token Plan $10/月（1,500 req/5hr） | 含視頻 Hailuo 2.3 生成（768P 6s $0.19 Fast 起）；中國模型、全球 API |
| [**Featherless AI**](https://featherless.ai/) | 無（Agent 方案 3 天試用） | Basic $10/月（≤15B 模型、unlimited tokens）；Premium $25/月（任意大小）；Agent $100/月起 | 30,000+ Hugging Face 模型、flat-rate 無限 tokens；訂閱制非 per-token |
| [**Anthropic**](https://www.anthropic.com/) / [**OpenAI**](https://platform.openai.com/) | 過去 trial credits 政策本次未在 pricing 頁驗到 | Claude Haiku 4.5 $1/$5、GPT-5.4 mini $0.75/$4.50 | 純付費，用 OpenRouter / Vercel Gateway 試比較划算 |

## 已確認停服

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

四家永久 / 每日免費疊起來最省力：

- **Zhipu GLM-4.7-Flash**：永久免費、200K context、無 token 上限（30 concurrent）
- **iFlytek Spark Lite**：永久免費不限量
- **Volcengine Doubao 協作獎勵計畫**：手動開通後每日 200 萬 tokens reset，跑量最爽
- **Tencent Hunyuan-lite**：完全免費 + 首次 100 萬 tokens

新用戶額外：Qwen DashScope（各模型 100 萬 / 90 天）+ Baidu 千帆（¥20 券 + Qwen 免費）+ Kimi（¥15 券）堆起來試模型夠用。

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
- [Ollama](https://ollama.com/)
- [Mistral La Plateforme Pricing](https://mistral.ai/pricing/)
- [Hyperbolic Docs](https://docs.hyperbolic.xyz/)
- [MiniMax Platform Pricing](https://platform.minimax.io/docs/guides/pricing-paygo)
- [Featherless AI](https://featherless.ai/)
- [Baseten Pricing](https://www.baseten.co/pricing/)
- [Zhipu GLM BigModel Pricing](https://bigmodel.cn/pricing)
- [Volcengine Doubao Free Quota](https://www.volcengine.com/docs/82379/1399514)
- [Moonshot Kimi API Pricing](https://platform.kimi.com/docs/pricing/)
- [Qwen DashScope Model Pricing](https://help.aliyun.com/zh/model-studio/model-pricing)
