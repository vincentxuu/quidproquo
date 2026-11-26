---
title: "Korean Model Families: Choosing Between K-EXAONE 2.0, A.X K2, Motif 3, Solar, Mi:dm, HyperCLOVA X, and Raon"
date: 2026-11-23
category: tech
type: deep-dive
tags: [ai-agent, llm, model-selection, south-korea, sovereign-ai, open-source, model-family-korea]
lang: en
tldr: "Almost every large Korean model is tied to the government's Sovereign AI Foundation Model project. LG's K-EXAONE 2.0 (750B-A37B) and SKT's A.X K2 (688B-A33B) are Apache 2.0 open weights, Motif 3 (314B-A13B) is MIT, and Upstage ships Solar Open2 weights plus cheap Solar APIs. KT's Mi:dm K 3.0 Pro is API-only, while NAVER and KRAFTON focus on models at 32B and below. On Artificial Analysis's current index the top Korean model is the closed Solar Pro 4 (14); the two large open-weights models sit at 8–9, and Motif 3 has the strongest individual scores but no composite yet. For Korean-language self-hosting pick A.X K2 or K-EXAONE 2.0, for agents and coding try Motif 3 first, for a low-cost API look at Solar, and for on-device use look at Raon-1 nano."
description: "Cross-vendor comparison of Korean LLMs (November 2026): the two evaluation rounds of the Sovereign AI Foundation Model project, and for LG, SKT, Motif, Upstage, KT, NAVER, and KRAFTON the current generation, parameters, key license terms, OpenRouter and first-party pricing, Artificial Analysis scores, Hugging Face downloads and derivative counts, plus selection advice."
draft: false
series:
  name: "AI Model Families"
  order: 45
glossary:
  - term: "Sovereign AI Foundation Model project"
    aliases: ["독자 AI 파운데이션 모델"]
    definition: "A national program launched in 2025 by Korea's Ministry of Science and ICT (MSIT). Selected \"elite teams\" receive GPUs and data, must design and pre-train their models themselves, and are evaluated and cut every six months."
  - term: "AAII"
    aliases: ["Artificial Analysis Intelligence Index"]
    definition: "Artificial Analysis's composite intelligence index built from several benchmarks. When the version changes, the task set and scale change too, so scores from different versions are not comparable."
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-korea-models)

Korea produced a whole row of large models in 2026, but none of the vendors can carry a family article on its own: most have only one or two generations, and mentions on this site are scattered. This article compares them side by side for readers choosing among Korean-language products, Korean customers, or open weights from outside the US and China. You will come away knowing which generation each vendor currently ships, whether the weights can be used commercially, where to buy the API, where the third-party scores land, and which one to try first for each use case. The data is a snapshot as of 2026-11-23.

The common background is the Korean government's Sovereign AI Foundation Model project. The flagships from LG, SKT, Upstage, and Motif were all built for the project's evaluation rounds, while KT, NAVER, and KRAFTON each found a position outside or at the edge of it. For how to read the benchmark numbers here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## November 2026: seven vendors and their current models

| Vendor | Current representative model | Parameters (total / active) | Weights and license | API channel and price (per 1M tokens) | Relation to the national project |
|---|---|---|---|---|---|
| LG AI Research | K-EXAONE 2.0 | 750B / 37B MoE | Open, Apache 2.0 | FriendliAI dedicated endpoints; not on OpenRouter | Advanced past Phase 2 |
| SK Telecom | A.X K2 | 688B / 33B MoE | Open, Apache 2.0 | No public pay-per-token API; not on OpenRouter | Advanced past Phase 2 (top total score) |
| Motif Technologies | Motif 3 | 314B / 13.2B MoE | Open, MIT | OpenRouter (served by KT) $0.30 / $1.20 | Eliminated in Phase 2 |
| Upstage | Solar Pro 4, Solar Mini 4; weights: Solar Open2 250B | Open2 is 250B / 15B; Pro 4 undisclosed | Open2 open (Upstage Solar License); Pro 4 and Mini 4 closed | First-party and OpenRouter: Pro 4 $0.15 / $0.60, Mini 4 $0.05 / $0.20 (promotional; list prices are double) | Advanced past Phase 2 |
| KT | Mi:dm K 3.0 Pro | 120B / 12B (hybrid Mamba + MoE + attention) | No weights; the open release is the older Mi:dm 2.0 (MIT) | KT Token Factory, OpenRouter $0.20 / $0.80 | Not selected |
| NAVER Cloud | HyperCLOVA X SEED 32B Think; API: HCX-007 | 32B dense | Open, custom license (MAU and competitor clauses) | CLOVA Studio, no prices on the public page | Eliminated in Phase 1 |
| KRAFTON | Raon-1 mini preview, Raon-1 nano | 28.8B / 4.3B MoE; 3.1B dense | Open, Apache 2.0 | No formal pay-per-token API | Member of the SKT consortium |

Three things stand out. First, "open weights" here are mostly genuinely permissive: Apache 2.0 and MIT cover four vendors, and the most restrictive terms are NAVER's custom license and Upstage's brand-naming clause. Second, the big models are heavy: the official deployment examples for K-EXAONE 2.0 and A.X K2 need two 8-GPU H200 nodes or four B300-class cards, and there is no ready pay-per-token API, so if you want to "try it through an API first," your options are Motif 3, Solar, and Mi:dm. Third, half of the Korean models on OpenRouter are served by KT: KT is the only provider for Motif 3, and Solar Pro 4 also has a KT endpoint.

## Korea's Sovereign AI Foundation Model project

The [Ministry of Science and ICT (MSIT)](https://msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&nttSeqNo=1212&sCode=eng) picked five "elite teams" in August 2025: NAVER Cloud, Upstage, SKT, NC AI, and LG AI Research. The government supplies GPUs and data and evaluates every six months. The project defines "sovereign" strictly: the model must have its own architecture and be pre-trained from scratch; fine-tuning an overseas model does not count. Teams may borrow open-source techniques, but weights have to be reset and trained in-house. KT, Motif, and others had already missed out in the earlier screening ([Korea Herald](https://www.koreaherald.com/article/10657159)).

**Phase 1 (announced 2026-01-15)**: LG, SKT, and Upstage advanced. NAVER Cloud scored in the top four, but MSIT ruled that it did not meet the sovereignty criteria and dropped it; NC AI did not pass either. According to the [Korea Herald](https://www.koreaherald.com/article/10656367), the issue was that NAVER's vision encoder reused the pre-trained weights of Qwen 2.5-VL 32B and kept them frozen. MSIT then reopened one slot and on [2026-02-20 added a consortium led by Motif Technologies](https://www.koreatimes.co.kr/business/tech-science/20260220/motif-led-consortium-joins-national-ai-foundation-model-project); NAVER and NC AI did not reapply.

**Phase 2 (announced 2026-08-18)**: the four teams each delivered one model, Motif 3, Solar Open2, A.X K2, and K-EXAONE 2.0, all with open weights. The [MSIT press release](https://english.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1292&sCode=eng) said all four scored 31 or higher on AAII (using the version Artificial Analysis published at the end of June). Upstage, SKT, and LG advanced and Motif was eliminated. After Motif publicly asked, MSIT [released the breakdown in September](https://www.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1301&sCode=eng):

| Item (max) | SKT | Upstage | LG | Motif |
|---|---|---|---|---|
| AAII benchmark (25) | 8.8 | 9.4 | 7.8 | **11.9** |
| NIA benchmark (15) | **13.4** | 13.3 | 12.8 | 12.7 |
| Expert evaluation (35) | 29.3 | 29.1 | **29.5** | 27.1 |
| Professional users (15) | **11.6** | 10.8 | 11.3 | 8.4 |
| General public (10) | 7.5 | 7.3 | **7.6** | 5.7 |
| Total (100) | **70.6** | 69.9 | 69.0 | 65.8 |

What this table means for selection: Motif 3 was strongest on the third-party benchmark but lost on the expert evaluation (ecosystem and diffusion plans) and on user ratings; LG had the weakest benchmark score and advanced on expert and public ratings. The project's scores mix in industrial-policy considerations and should not be read as a model-quality ranking. MSIT says it will pick two of the remaining three teams by the end of the year.

## Current generation by vendor

### LG AI Research: K-EXAONE 2.0

[K-EXAONE 2.0](https://huggingface.co/LGAI-EXAONE/K-EXAONE-2.0-750B-A37B) [went up on Hugging Face on 2026-07-31](https://www.lgresearch.ai/news/view?seq=678) and is Korea's largest model to date: 750B total parameters, 37B active, 256 experts with 8 active per token plus 1 shared expert, and a 262,144-token context. It is not a new architecture trained from scratch; LG upcycled the first K-EXAONE (236B-A23B) in depth and width and then continued training. Attention mixes global layers with 128- and 4,096-token sliding windows to cut long-context cost. Two built-in speculative decoding methods, MTP and DSpark, give a 3–5x speedup according to LG. Language coverage grew from 6 to 10 (Korean, English, Spanish, German, Japanese, Vietnamese, French, Italian, Polish, Portuguese), and the knowledge cutoff is Q2 2025.

The biggest selection change is the license: the first K-EXAONE used a custom K-EXAONE license, and 2.0 switched to Apache 2.0. Deployment is heavy. The official example uses two 8-GPU H200 nodes with LG's forks of SGLang and vLLM (on B200 you must add `--disable-prefill-cuda-graph` to avoid generation collapse, and the vLLM fork does not support DSpark yet).

| Version | Released | What it changed for selection |
|---|---|---|
| EXAONE 4.0 (32B, 1.2B) | 2025-07 | Small and mid-size open weights; Ollama's official library still carries the older 3.5 and Deep |
| K-EXAONE (236B-A23B) | 2025-12 | Phase 1 model, LG's first large MoE, custom license |
| EXAONE 4.5 33B | 2026-04 | Single-GPU-class weights with more than 1.6 million cumulative HF downloads; still LG's most used release |
| K-EXAONE 2.0 (750B-A37B) | 2026-07-31 | Three times the scale, Apache 2.0, large gains on long context and safety |

### SK Telecom: A.X K2

[A.X K2](https://huggingface.co/skt/A.X-K2) [went live on 2026-07-29](https://news.sktelecom.com/en/3204): 688B total parameters, 33B active, 256 routed experts plus 1 shared, 61 layers, trained from scratch on 8.2T tokens (about 73% English and 15% Korean in the first stage). Two in-house designs are worth remembering. Sparse Gated Attention adds an indexer that picks the top 2,048 tokens and a per-head output gate on top of MLA, speeding up long-context inference. Gated Norm adds a gate after RMSNorm to suppress outlier activations, which let SKT train natively in FP8 and release an FP8 checkpoint directly. Think-Fusion lets one model switch between thinking and non-thinking modes per request. Context is trained natively to 128K and extended to 256K with YaRN.

The limits are explicit: text only, trained on five languages (English, Korean, Chinese, Japanese, Spanish); the FP8 weights are about 647 GiB, and SKT recommends at least 800 GiB of GPU memory (validation used four B300 cards). The model card's limitations section calls its agentic capability "moderate," trailing the comparison models on Terminal Bench and BrowseComp because post-training included little agentic RL. Transformers supports the `axk2` architecture natively; vLLM requires SKT's fork.

On the lineage: in 2025 SKT shipped A.X 4.0 (large-scale continued pre-training on an existing model) and A.X 3.1 (trained from scratch). A.X K1 (519B-A33B) in December 2025 was the Phase 1 model, and K2 raised the expert count from 192 to 256 while keeping 33B active. K2 also came with the A.X VE vision encoder, the A.X K2 ALM audio model, and a speech model built by KRAFTON (see Raon below).

### Motif Technologies: Motif 3

[Motif 3](https://huggingface.co/Motif-Technologies/Motif-3) was released on 2026-08-11 with 314B total and 13.2B active parameters, the smallest active count among the large models here. Its architecture is the most home-grown of the four: Grouped Differential Latent Attention combines differential attention with MLA's compressed KV, each expert has its own PolyNorm activation, the residual path becomes mHC with 4 parallel streams, and a one-layer MTP head enables self-speculative decoding; 8 of 384 routed experts are chosen per token. Pre-training used 12.5T tokens with extra weight on Korean, reasoning, legal, and financial data, and post-training used six RL specialist teachers plus a software-engineering teacher, merged into one model through multi-teacher on-policy distillation.

MSIT's expert panel also noted that Motif "developed everything in-house from architecture and tokenizer to optimizer and kernels." After the Phase 2 elimination, Motif 3 stays MIT-licensed; it reached OpenRouter on 2026-11-02, served by KT.

### Upstage: Solar

Upstage is the only vendor here that sells cheap closed APIs and also releases large weights: the closed Solar Pro 4 (on OpenRouter since 2026-08-10, 512K context) and Solar Mini 4 (on OpenRouter since 2026-09-23; Upstage says 35B total and 3B active parameters), and the open-weights Solar Open2 250B (250B-A15B, the Phase 2 model). Solar Pro 4 is the highest-scoring Korean model on Artificial Analysis's current index, and Solar Mini 4 was #7 on OpenRouter's New & Trending list in the third week of November (1.19T tokens in a week). For the full lineup, license, and pricing, see the [Upstage Solar family article](/posts/tech/2026-11-23-ai-model-family-upstage-solar-en).

### KT: Mi:dm K 3.0 Pro

[Mi:dm K 3.0 Pro](https://tokenfactory.kt.com/models/kt/midm-k-3.0-pro) is KT's reasoning model. KT describes it as a MoE with 120B total and 12B active parameters that mixes Mamba, MoE, and attention layers; the served checkpoint quantizes the MoE experts to NVFP4 and the Mamba projections and shared expert to FP8. Context is 261,795 tokens, text only, with tool calling and low/high reasoning depth. It launched on KT's own Token Factory on 2026-10-29 and on [OpenRouter](https://openrouter.ai/kt/midm-k-3.0-pro) on 11-05.

What you need to know is that it is the least documented of the seven: no weights, no model card, no official benchmark table. KT has only told the press that its Korean generation is 30% faster than Nemotron 3 Super ([iNews24](https://www.inews24.com/v/2014422)) and that it can support on-premises deployment, without publishing license terms. KT's downloadable weights stop at [Mi:dm 2.0](https://huggingface.co/K-intelligence/Midm-2.0-Base-Instruct) from 2025-07: the 11.5B Base and the 2.3B Mini, MIT-licensed, with the most downloads in the past 30 days among the Korean models compared here. KT is not in the national project, but it matters in another role: Token Factory also hosts Motif 3 and Solar Pro 4, making KT a resale channel for Korean model APIs.

### NAVER Cloud: HyperCLOVA X

NAVER is in the most awkward position in 2026. [HyperCLOVA X SEED 32B Think](https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-32B) and SEED 8B Omni were [announced on 2025-12-29 as Phase 1 results](https://www.navercorp.com/en/media/pressReleasesDetail?seq=34256): 32B Think is a dense vision-language reasoning model that takes text, images, and video with a 128K context, and 8B Omni is an any-to-any omnimodal model. Two weeks later NAVER was eliminated over the sovereignty of its vision encoder. In June 2026 NAVER's tech blog then described an in-house vision encoder trained from random initialization and [SEED 4B](https://clova.ai/tech-blog/%EC%9A%B0%EB%A6%AC%EC%9D%98-%EB%88%88%EA%B3%BC-%EA%B7%80%EB%A1%9C-%ED%98%84%EC%9E%A5%EC%9D%84-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8B%A4-%EB%8F%85%EC%9E%90-%EC%9D%B8%EC%BD%94%EB%8D%94%EC%99%80), aimed at defense and on-device use, but the HF organization does not currently host 4B weights.

The API goes through NAVER Cloud's [CLOVA Studio](https://guide.ncloud-docs.com/docs/en/clovastudio-model): HCX-007 (hybrid reasoning, 128K, function calling and structured outputs), HCX-005 (image input), and HCX-DASH-002 (lightweight, 32K). The consumer CLOVA X service [shut down on 2026-04-09](https://clova-x.naver.com/updates), and NAVER has refocused HyperCLOVA X on enterprise and industry use.

### KRAFTON: Raon

KRAFTON (the developer of PUBG) is a member of the SKT consortium responsible for multimodal work and also runs its own open model brand, Raon. In October 2026 it released two text models built on its own architecture: [Raon-1 mini preview](/posts/daily/2026-10-23-model-krafton-raon-1-mini-en) (28.8B-A4.3B MoE, 262K context, hybrid linear attention with Gated MLA; see the model card) and [Raon-1 nano](https://huggingface.co/KRAFTON/Raon-1-nano). Nano is a 3.1B dense model in which 1.5B is a per-layer embedding table, so effective compute is about 1.5B. It was derived from mini through MoE-to-Dense pruning and distillation; 18 of its 24 layers are fixed-state Raon Delta Attention, and only 6 layers keep a KV cache (about 7 KiB per token). KRAFTON ships GGUF, MLX, and LiteRT-LM formats; thinking mode is on by default and KRAFTON advises against turning it off.

Under the same brand, [A.X-K2-Raon-Speech-21B-A3B](https://huggingface.co/KRAFTON/A.X-K2-Raon-Speech-21B-A3B) is a speech model built on SKT's A.X K2 Light (20B-A3B). Its license is CC BY-NC 4.0, so it cannot be used commercially, unlike Raon-1's Apache 2.0.

## Evaluation: vendor-reported and third-party

### Artificial Analysis current index

Artificial Analysis's Intelligence Index is now v5.0.1, whose task set and scale differ from the June version; frontier closed models now score about 55–62. On 2026-11-23, among the 69 models with a composite score:

| Model | AA Intelligence Index v5.0.1 | Rank (of 69) | AA-run individual benchmarks |
|---|---|---|---|
| Solar Pro 4 | 14.2 | 41 | Terminal-Bench 2.1 57.3%, GPQA Diamond 89.1% |
| A.X K2 | 9.0 | 51 (28th among open weights) | Terminal-Bench 2.1 39.0%, GPQA Diamond 85.7% |
| K-EXAONE 2.0 | 7.6 | 53 (30th among open weights) | Terminal-Bench 2.1 40.4%, GPQA Diamond 82.9% |
| Motif 3 | No composite yet | — | Terminal-Bench 2.1 74.9%, GPQA Diamond 83.4%, HLE 37.0%, τ³-Banking 35.3% |
| HyperCLOVA X SEED Think 32B | No composite yet | — | GPQA Diamond 61.5%, τ²-Bench 87.4% |
| Mi:dm | Only the older K 2.5 Pro is listed; no K 3.0 Pro | — | — |
| Raon-1 | Not listed | — | — |

Two cautions. First, MSIT's "all four teams scored 31 or higher" and Motif's website claim of "AAII 47" use AA's v4-series versions from the summer, which are a different yardstick from the v5.0.1 in this table and cannot be compared with it. Second, AA's page for Motif 3 is missing several v5 tasks (AA-Omniscience, Terminal-Bench 4.0, and others), so it has no composite, but the individual results it does have are striking: AA measured 74.9% on Terminal-Bench 2.1, nearly double A.X K2 and K-EXAONE 2.0 and above Solar Pro 4. On the current index, the three scored Korean models all sit in the middle to lower part of the board, well behind the front of Chinese open weights from the same period (Tencent Hy4 at 34.6, for example).

### Vendor-reported

Each model card uses different comparison models and settings, so read them for each model's strengths and do not rank across tables:

- **A.X K2** (thinking mode): AIME26 97.1, KMMLU-Pro 80.5, CLIcK 91.6, the highest in its comparison table for math and Korean; Terminal Bench 2.1 36.0 and BrowseComp (≤10 searches) 9.3, and SKT itself admits its agent capability trails.
- **K-EXAONE 2.0**: OpenAI-MRCR 94.4 and Ko-LongBench 89.6 make long context its strength; on safety, KGC-Safety 99.8 and ROK-Fortress 89.5 are above the comparison models; SWE-bench Verified 68.2, Terminal-Bench 2.1 43.8, and KMMLU-Pro 69.1 trail Qwen3.5 and GLM-5.1.
- **Motif 3**: SWE-bench Verified 76.2, Terminal-Bench 2.1 74.9, τ³-Banking 35.3, GDPVal v2 38.7; GPQA Diamond 83.4 is below most comparison models. The comparison models' scores come from each benchmark's leaderboard, not from Motif's own runs.
- **Raon-1 nano**: IFBench 75.9 and FACTS Grounding 44.4 lead same-size comparisons, and an internal Korean conversation benchmark gives 91.0; but BFCL v4 tool calling is 56.3, below LFM3 1.7B (67.2) and MiniCPM5 2B (61.0).
- **Mi:dm K 3.0 Pro**: no published benchmarks.

The biggest gap between vendor-reported and AA third-party results is for K-EXAONE 2.0 and A.X K2: on their own tables they trade wins with Qwen3.5 and GLM-5.1, but both sit below 10 on AA v5's composite. Part of the gap comes from the long-horizon agent tasks added in v5: AA measured 0 on Terminal-Bench 4.0 and only 2–4% on AutomationBench for both, consistent with the weakness SKT's model card admits.

## Licensing, pricing, and channels

### Weight licenses

| Model | License | Terms to watch |
|---|---|---|
| K-EXAONE 2.0 | Apache 2.0 | The LICENSE is a standard Apache 2.0 notice; the previous K-EXAONE remains under a custom license |
| A.X K2 | Apache 2.0 | The repo has no separate LICENSE file; the license is stated in the model card and metadata, and SKT confirms the main model is Apache 2.0 |
| Motif 3 | MIT | Only requires keeping the copyright and license notice |
| Solar Open2 250B | Upstage Solar License | Based on Apache 2.0, but derivative model names must start with "Solar" and related interfaces must display "Built with Solar" |
| HyperCLOVA X SEED 32B Think | HyperCLOVA X SEED 32B Think Model License | See below |
| Raon-1 mini / nano | Apache 2.0 | Raon-Speech is CC BY-NC 4.0, non-commercial |
| Mi:dm 2.0 | MIT | Mi:dm K 3.0 Pro has no released weights |

[NAVER's license](https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-32B/blob/main/LICENSE) is the only one here that needs a careful legal read. The license is revocable. If, as of the model release date (2025-12-29), your products had more than 10 million monthly active users in the preceding month, or if you offer a product "substantially similar to or directly competing with" NAVER's products or services, you must request a separate license, which NAVER grants at its sole discretion. Redistribution requires writing the prohibited-use policy into your terms. NAVER may modify the agreement at any time. The governing law is Korean, with disputes arbitrated by the Korean Commercial Arbitration Board in Seoul. "Directly competing" could apply to any company building an AI assistant or search product.

### API pricing and channels

| Model | Channel | Input / output (per 1M tokens) | Context |
|---|---|---|---|
| Solar Mini 4 | Upstage, OpenRouter | Promotional $0.05 / $0.20 (list $0.10 / $0.40) | 512K |
| Solar Pro 4 | Upstage, OpenRouter (also a KT endpoint at list price) | Promotional $0.15 / $0.60 (list $0.30 / $1.20) | 512K |
| Mi:dm K 3.0 Pro | OpenRouter, KT Token Factory (KT's page shows a 30% discount to $0.14 / $0.56) | $0.20 / $0.80, cache read $0.04 | 261,795 |
| Motif 3 | OpenRouter (KT) | $0.30 / $1.20, cache read $0.06 | 262,144 |
| HCX-007 | NAVER CLOVA Studio | Not listed on the public pricing page; requires console login | 128K |
| K-EXAONE 2.0 | FriendliAI dedicated endpoints | Billed by GPU time, no per-token price listed | 262,144 |
| A.X K2 | No public pay-per-token API | — | 256K |

Channels are concentrated: every Korean model API on OpenRouter is served by Upstage or KT, and hosting for the large open-weights models is limited to dedicated endpoints such as FriendliAI.

## Adoption

| Model | HF downloads, last 30 days | HF cumulative | Third-party derivative repos (tagged base_model) | Other |
|---|---|---|---|---|
| K-EXAONE 2.0 | 14,459 | 24,784 | 2 | Ollama's official library only has the older exaone-deep (804.2K pulls) and exaone3.5 (625.6K) |
| EXAONE 4.5 33B | 23,800 | 1,626,290 | 18 | LG's most downloaded release |
| A.X K2 | 3,547 | 161,521 | 1 | The NVFP4 build had 84,160 downloads in 30 days; most people download the quantized build |
| Motif 3 | 2,980 | 12,660 | 12 | KT is the only OpenRouter provider |
| Solar Open2 250B | 6,347 | 57,547 | 18 | Solar Mini 4 is a new OpenRouter riser |
| HyperCLOVA X SEED Think 32B | 7,563 | 660,594 | 11 | — |
| Mi:dm 2.0 Base | 40,249 | 591,058 | 35 | Mi:dm K 3.0 Pro has no weights |
| Raon-1 mini preview | 4,266 | 5,440 | 11 | GGUF build: 36,646 in 30 days |
| Raon-1 nano | 3,309 | 3,309 | 6 | GGUF build: 18,933 |

The pattern is clear: downloads concentrate on sizes that run on a single GPU (EXAONE 4.5 33B, Mi:dm 2.0, HyperCLOVA X 32B) and on quantized builds. The 700B-class flagships have small download numbers and few derivative repos, because few people can self-host them in the first place. No Korean model is in OpenRouter's weekly top 10, and Ollama's official library carries only older generations from LG and Upstage.

## Selection advice

- **A large model with strong Korean, self-hostable, commercially usable**: A.X K2. The strongest vendor-reported math and Korean scores, Apache 2.0, native Transformers support; but text only, five languages, agent tasks need separate validation, and you need at least 800 GiB of GPU memory.
- **Multilingual, long documents, and safety scores**: K-EXAONE 2.0. Ten languages, high long-context retrieval scores, and leading safety benchmarks; it has the lowest AA composite of the three, so test coding and agent tasks on your own prompts first.
- **Agents and coding with open weights**: try Motif 3 first. MIT license, only 13.2B active parameters, the highest AA Terminal-Bench 2.1 result, and an OpenRouter API to try before deciding to self-host; the limits are that the AA composite is not out yet and the API has a single provider.
- **A cheap Korean-language API**: Solar Mini 4 (promotional $0.05 / $0.20, list $0.10 / $0.40) or Solar Pro 4. Upstage's promotional prices have no stated end date, so budget at list price; see the [Upstage Solar family article](/posts/tech/2026-11-23-ai-model-family-upstage-solar-en).
- **Already in KT's ecosystem or need an on-premises contract**: Mi:dm K 3.0 Pro is worth evaluating, but there are no public scores at all, so run your own evaluation set before going live; if you need downloadable weights, use Mi:dm 2.0 (MIT).
- **Korean visual understanding**: HyperCLOVA X SEED 32B Think is one of the few 32B-class Korean models that reads images and video, and it runs on four A100s. Check the MAU and competitor clauses first; if your product is an AI assistant or search, ask NAVER beforehand.
- **On-device or edge**: Raon-1 nano (Apache 2.0, GGUF / MLX / LiteRT-LM) or Mi:dm 2.0 Mini (2.3B, MIT). Tool calling is nano's weak spot, so test flows that call tools repeatedly.

When you use these models inside an agent, keep the model ID in a routing layer: the project evaluates every six months with shifting targets, the vendors replace their flagships about every six months, and Motif's maintenance pace after elimination is still unsettled.

## Limitations and unknowns

- **The national project's scores are not a model ranking.** The Phase 2 total mixes expert ratings of ecosystem plans with user ratings, and benchmarks are only 40 points; Motif 3 had the highest benchmark score and was still eliminated.
- **AA score versions differ.** The AAII figures in the official press releases and on vendor websites come from the v4 era and cannot be compared directly with AA's current v5.0.1; Motif 3 and HyperCLOVA X have no v5 composite yet.
- **The least documented are KT's and NAVER's APIs.** Mi:dm K 3.0 Pro has no weights, model card, or benchmarks; HCX-007's price is not public.
- **The large flagships are hard to deploy.** K-EXAONE 2.0, A.X K2, and Motif 3 all depend on vendor-maintained forks of the inference engines, so upgrading vLLM or SGLang means waiting for the vendor to catch up.
- **Language coverage.** A.X K2 is trained on five languages and Raon only on Korean and English; K-EXAONE 2.0 covers the most languages.
- **Adoption numbers only see the open ecosystem.** HF downloads and OpenRouter usage miss deployments inside Korean enterprises and government projects; internal use such as SKT's A. assistant or KT's enterprise contact centers is not counted.

## References

- [Phase 1 Evaluation Results Released for Sovereign AI Foundation Model Project — MSIT](https://msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&nttSeqNo=1212&sCode=eng) — the five elite teams, the sovereign AI definition, Phase 1 results
- [Phase 2 evaluation results of the Sovereign AI Foundation Model project — MSIT](https://english.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1292&sCode=eng) — the four Phase 2 models and who advanced
- [Score Details of the Phase 2 Evaluation — MSIT](https://www.msit.go.kr/eng/bbs/view.do?bbsSeqNo=42&mId=4&mPid=2&nttSeqNo=1301&sCode=eng) — score breakdown
- [LG, SKT, Upstage advance in Korea's sovereign AI project — The Korea Herald](https://www.koreaherald.com/article/10656367) — why NAVER was dropped
- [Naver Cloud, NC AI opt out of retender — The Korea Herald](https://www.koreaherald.com/article/10657159)
- [Motif-led consortium joins national AI foundation model project — The Korea Times](https://www.koreatimes.co.kr/business/tech-science/20260220/motif-led-consortium-joins-national-ai-foundation-model-project)
- [LGAI-EXAONE/K-EXAONE-2.0-750B-A37B — Hugging Face](https://huggingface.co/LGAI-EXAONE/K-EXAONE-2.0-750B-A37B) — model card, evaluation table, deployment, LICENSE
- [LG AI Research Unveils K-EXAONE 2.0 — LG AI Research](https://www.lgresearch.ai/news/view?seq=678) — released 2026-07-31, switched to Apache 2.0
- [K-EXAONE-2.0-750B-A37B — FriendliAI](https://friendli.ai/models/LGAI-EXAONE/K-EXAONE-2.0-750B-A37B)
- [skt/A.X-K2 — Hugging Face](https://huggingface.co/skt/A.X-K2) — model card, evaluation, limitations, hardware requirements
- [SK Telecom Unveils A.X K2 — SK Telecom Newsroom](https://news.sktelecom.com/en/3204) — released 2026-07-29, derivative models
- [SKT consortium selected as elite team — SK Telecom Newsroom](https://news.sktelecom.com/214233) — consortium members (including KRAFTON)
- [Motif-Technologies/Motif-3 — Hugging Face](https://huggingface.co/Motif-Technologies/Motif-3) — model card, evaluation, MIT LICENSE
- [Motif 3: Technical Report — arXiv](https://arxiv.org/abs/2608.09119)
- [Motif 3 — OpenRouter](https://openrouter.ai/motif-technologies/motif-3) — served by KT, pricing
- [Mi:dm K 3.0 Pro — KT Token Factory](https://tokenfactory.kt.com/models/kt/midm-k-3.0-pro) — specs, quantization, launch date, pricing
- [KT: Mi:dm K 3.0 Pro — OpenRouter](https://openrouter.ai/kt/midm-k-3.0-pro)
- [KT to launch 120B-parameter Mi:dm K 3.0 Pro this month — iNews24](https://www.inews24.com/v/2014422)
- [K-intelligence/Midm-2.0-Base-Instruct — Hugging Face](https://huggingface.co/K-intelligence/Midm-2.0-Base-Instruct) — Mi:dm 2.0, MIT
- [naver-hyperclovax/HyperCLOVAX-SEED-Think-32B — Hugging Face](https://huggingface.co/naver-hyperclovax/HyperCLOVAX-SEED-Think-32B) — model card and full license
- [NAVER Cloud Unveils Omnimodal HyperCLOVA X — NAVER](https://www.navercorp.com/en/media/pressReleasesDetail?seq=34256)
- [In-house encoders and HyperCLOVA X SEED 4B — CLOVA Tech Blog](https://clova.ai/tech-blog/%EC%9A%B0%EB%A6%AC%EC%9D%98-%EB%88%88%EA%B3%BC-%EA%B7%80%EB%A1%9C-%ED%98%84%EC%9E%A5%EC%9D%84-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8B%A4-%EB%8F%85%EC%9E%90-%EC%9D%B8%EC%BD%94%EB%8D%94%EC%99%80)
- [CLOVA Studio models — NAVER Cloud](https://guide.ncloud-docs.com/docs/en/clovastudio-model) — HCX-007 / 005 / DASH-002
- [CLOVA Studio pricing — NAVER Cloud Platform (public sector)](https://www.gov-ncloud.com/product/aiService/clovaStudio)
- [CLOVA X service termination notice](https://clova-x.naver.com/updates)
- [KRAFTON/Raon-1-nano — Hugging Face](https://huggingface.co/KRAFTON/Raon-1-nano)
- [KRAFTON/A.X-K2-Raon-Speech-21B-A3B — Hugging Face](https://huggingface.co/KRAFTON/A.X-K2-Raon-Speech-21B-A3B) — CC BY-NC 4.0
- [upstage/Solar-Open2-250B — Hugging Face](https://huggingface.co/upstage/Solar-Open2-250B) — Upstage Solar License
- [Artificial Analysis model leaderboard](https://artificialanalysis.ai/leaderboards/models) — Intelligence Index v5.0.1 and individual scores (2026-11-23)
- [OpenRouter Models API](https://openrouter.ai/api/v1/models), [OpenRouter Rankings](https://openrouter.ai/rankings) — pricing, context, usage (data through 2026-11-22)
- [KRAFTON Raon-1 mini model card](/posts/daily/2026-10-23-model-krafton-raon-1-mini-en) — this site
- [Upstage Solar family article](/posts/tech/2026-11-23-ai-model-family-upstage-solar-en) — this site
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
