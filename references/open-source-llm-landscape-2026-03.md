# Open-Source LLM Landscape Research (as of March 31, 2026)

> Research compiled from web searches on March 31, 2026. All data cross-referenced across multiple sources.

---

## 1. Frontier-Tier Open-Source Models (100B+ Parameters)

### DeepSeek V3 / V3.1 / V3.2
| Field | Value |
|-------|-------|
| Developer | DeepSeek (China) |
| Total Params | 671B |
| Active Params | 37B |
| Architecture | MoE (Mixture-of-Experts) |
| Context Window | 128K |
| License | MIT |
| V3 Release | December 2024 |
| V3.1 Release | August 2025 (hybrid thinking/non-thinking mode, merging V3+R1 capabilities) |
| V3.2-Exp Release | September 29, 2025 (experimental, introduces DeepSeek Sparse Attention) |
| Key Strengths | Cost-efficient training ($5.6M), strong reasoning, hybrid thinking modes in V3.1+ |

### DeepSeek R1
| Field | Value |
|-------|-------|
| Developer | DeepSeek (China) |
| Total Params | 671B (same architecture as V3) |
| Active Params | 37B |
| Architecture | MoE |
| Context Window | 128K |
| License | MIT |
| Release Date | January 20, 2025 |
| Key Strengths | Reasoning-focused (matches OpenAI o1), reinforcement learning trained, chain-of-thought |

### DeepSeek R2 / V4 (NOT YET RELEASED as of March 31, 2026)
- Repeatedly delayed. Originally rumored for May 2025, then pushed indefinitely.
- Reports from late February 2026 suggest both DeepSeek V4 and R2 are in preparation.
- Huawei AI chip training rumored. CEO Liang Wenfeng reportedly unsatisfied with R2 performance.
- May launch as early as late March/April 2026 but unconfirmed.

### Qwen3.5-397B-A17B (Flagship)
| Field | Value |
|-------|-------|
| Developer | Alibaba / Qwen Team |
| Total Params | 397B |
| Active Params | 17B |
| Architecture | Hybrid MoE (Gated Delta Networks + sparse MoE, 512 total experts, 10 routed + 1 shared per token) |
| Context Window | 262K native, up to 1M extended (YaRN RoPE) |
| License | Apache 2.0 |
| Release Date | February 16, 2026 |
| Key Strengths | Natively multimodal (text/image/video), 201 languages, early-fusion vision-language, extremely cost-efficient inference |

### GLM-5
| Field | Value |
|-------|-------|
| Developer | Zhipu AI (Z.AI, China) |
| Total Params | ~745B (744B) |
| Active Params | ~44B (5.9% sparsity) |
| Architecture | MoE (256 experts, 8 activated per token) |
| Context Window | 200K |
| License | MIT |
| Release Date | February 11, 2026 |
| Follow-ups | GLM-5-Turbo (March 15), GLM-5.1 (March 27) |
| Key Strengths | Best-in-class open-source on reasoning/coding/agentic tasks, 77.8% SWE-bench Verified, 50.4% Humanity's Last Exam. Very low API cost (~$1.00/$3.20 per M tokens) |

### Kimi K2.5
| Field | Value |
|-------|-------|
| Developer | Moonshot AI (China) |
| Total Params | 1T (1 trillion) |
| Active Params | 32B |
| Architecture | MoE |
| Context Window | Not specified (built on K2-Base) |
| License | MIT (with attribution clause: products >100M MAU or >$20M monthly revenue must display "Kimi K2.5") |
| Release Date | January 27, 2026 |
| Key Strengths | Native multimodality (text/code/visual), Agent Swarm (up to 100 sub-agents, 1,500 tool calls), strongest open model for code generation and math per some benchmarks |

### Llama 4 (Scout & Maverick)
| Field | Value |
|-------|-------|
| Developer | Meta |
| Architecture | MoE, multimodal (text+image input, text output) |
| **Scout** | 109B total, 17B active, 16 experts, **10M context window** |
| **Maverick** | 400B total, 17B active, 128 experts, 1M context window |
| License | Llama 4 Community License (open-weight but not fully open-source; restricts source code/training data access) |
| Release Date | April 5, 2025 |
| Key Strengths | Massive context windows (10M for Scout), competitive with GPT-4o on multimodal benchmarks, multilingual |

### MiniMax-M2.5
| Field | Value |
|-------|-------|
| Developer | MiniMax (China) |
| Total Params | 230B |
| Active Params | 10B |
| Architecture | MoE |
| License | Modified MIT |
| Release Date | February 11, 2026 |
| Key Strengths | 80.2% SWE-Bench Verified (matches Claude Opus 4.6), #1 on Multi-SWE-Bench (51.3%), 1/20th cost of Claude Opus 4.6, trained with Forge RL framework |

### gpt-oss-120b (OpenAI's first open-weight model)
| Field | Value |
|-------|-------|
| Developer | OpenAI |
| Total Params | 117B |
| Active Params | 5.1B |
| Architecture | MoE Transformer |
| License | Apache 2.0 |
| Release Date | August 5, 2025 |
| Companion | gpt-oss-20b (21B total, 3.6B active) |
| Key Strengths | Near-parity with o4-mini on reasoning, runs on single 80GB GPU, strong tool use/agentic capabilities, outperforms o3-mini |

### Devstral 2 (Mistral)
| Field | Value |
|-------|-------|
| Developer | Mistral AI |
| Total Params | 123B |
| Active Params | Dense (not MoE) |
| Architecture | Dense Transformer |
| Context Window | 256K |
| License | Modified MIT (commercial license required for >$20M monthly revenue) |
| Release Date | December 2025 |
| Key Strengths | 72.2% SWE-bench Verified, specialized for coding, 7x more cost-efficient than Claude Sonnet |

---

## 2. Mid-Tier Models (7B-70B)

### Qwen3.5 Medium Series (February 24, 2026)
All Apache 2.0 licensed, natively multimodal.

| Model | Total Params | Active Params | Architecture | Notes |
|-------|-------------|---------------|--------------|-------|
| Qwen3.5-122B-A10B | 122B | 10B | MoE | Best on agentic benchmarks (BFCL-V4 72.2, BrowseComp 63.8) |
| Qwen3.5-35B-A3B | 35B | 3B | MoE | Surpasses previous 235B flagship on most benchmarks |
| Qwen3.5-27B | 27B | 27B (dense) | Dense | Ties GPT-5 mini on SWE-bench Verified (72.4) |

### Qwen3 Series (April 28, 2025)
Apache 2.0 licensed.

| Model | Params | Architecture |
|-------|--------|-------------|
| Qwen3-235B-A22B | 235B total, 22B active | MoE |
| Qwen3-30B-A3B | 30B total, 3B active | MoE |
| Qwen3-32B | 32B | Dense |
| Qwen3-14B | 14B | Dense |
| Qwen3-8B | 8B | Dense |

### Gemma 3 (March 12, 2025)
| Model | Params | Multimodal | Context |
|-------|--------|-----------|---------|
| Gemma 3 27B | 27B | Yes (text+image) | 128K |
| Gemma 3 12B | 12B | Yes | 128K |
| Gemma 3 4B | 4B | Yes | 128K |
| Gemma 3 1B | 1B | Text only | 128K |

License: Gemma Terms of Use (permissive, commercial OK). Based on Gemini 2.0 technology.

### Llama 3.1 / 3.3 (2024)
| Model | Release | Params | Context | License |
|-------|---------|--------|---------|---------|
| Llama 3.1 405B | July 2024 | 405B (dense) | 128K | Llama 3.1 Community |
| Llama 3.1 70B | July 2024 | 70B (dense) | 128K | Llama 3.1 Community |
| Llama 3.1 8B | July 2024 | 8B (dense) | 128K | Llama 3.1 Community |
| Llama 3.3 70B | December 2024 | 70B (dense) | 128K | Llama 3.3 Community |

### Mistral Small 4 (March 16, 2026)
| Field | Value |
|-------|-------|
| Total Params | 119B |
| Active Params | 6.5B |
| Architecture | MoE |
| Context Window | 256K |
| License | Apache 2.0 |
| Key Strengths | Unifies reasoning (Magistral), multimodal (Pixtral), and agentic coding (Devstral) into one model. Configurable reasoning effort. |

### Devstral Small 2 (December 2025)
| Field | Value |
|-------|-------|
| Params | 24B |
| Architecture | Dense |
| License | Apache 2.0 |
| Key Strengths | 68.0% SWE-bench Verified, runs locally on consumer hardware |

### InternLM3-8B (January 2026)
| Field | Value |
|-------|-------|
| Developer | Shanghai AI Lab |
| Params | 8B |
| Key Strengths | Trained on 4T tokens, 4x higher data efficiency than Llama 3.1, integrates conversational + deep thinking, matches GPT-4o-mini performance |

### MiniMax-M2 / M2.1
| Field | Value |
|-------|-------|
| Total Params | 230B |
| Active Params | 10B |
| Architecture | MoE |
| M2.1 Release | Late December 2025 |
| License | Modified MIT |

### Yi-Lightning (October 2024)
| Field | Value |
|-------|-------|
| Developer | 01.AI |
| Params | 11B |
| License | Apache 2.0 |
| Context | 8K |
| Key Strengths | Speed-optimized, competitive with Grok-2, good multilingual support |

---

## 3. Small/Edge Models (Under 7B)

### Qwen3.5 Small Series (March 1, 2026)
Apache 2.0 licensed. Hybrid architecture (Gated DeltaNet + MoE). 201 languages. Natively multimodal.

| Model | Params | Context | Notes |
|-------|--------|---------|-------|
| Qwen3.5-9B | 9B | 262K (1M extended) | Outperforms Qwen3-30B, beats GPT-5-Nano on vision |
| Qwen3.5-4B | 4B | 262K | Native multimodal (text+image unified latent space) |
| Qwen3.5-2B | 2B | 262K | Runs on any recent iPhone in airplane mode |
| Qwen3.5-0.8B | 0.8B | 262K | Ultra-lightweight |

### Gemma 3n (May-July 2025)
Google DeepMind. Mobile-first architecture for edge devices.

| Model | Effective Size | Actual Architecture | Multimodal |
|-------|---------------|--------------------| -----------|
| Gemma 3n E4B | 4B effective | Larger architecture | Text, image, audio, video |
| Gemma 3n E2B | 2B effective | 6B architecture | Text, image, audio, video |

Context: 32K. Optimized for phones, laptops, tablets.

### SmolLM3-3B (July 8, 2025)
| Field | Value |
|-------|-------|
| Developer | Hugging Face |
| Params | 3B |
| Architecture | Decoder-only transformer (GQA + NoPE, 3:1 ratio) |
| Training | 11.2T tokens |
| Context | 64K trained, 128K via YARN |
| Languages | 6 (EN, FR, ES, DE, IT, PT) |
| License | Apache 2.0 |
| Key Strengths | Outperforms Llama-3.2-3B and Qwen2.5-3B, dual-mode reasoning |

### Phi-4-mini-flash-reasoning (July 2025)
| Field | Value |
|-------|-------|
| Developer | Microsoft |
| Params | 3.8B |
| Architecture | Hybrid SambaY with Differential Attention, decoder-hybrid-decoder |
| Context | 64K |
| License | MIT |
| Key Strengths | 10x throughput, 2-3x latency reduction, advanced math reasoning, trained on DeepSeek-R1 synthetic data |

### gpt-oss-20b (August 5, 2025)
| Field | Value |
|-------|-------|
| Developer | OpenAI |
| Total Params | 21B |
| Active Params | 3.6B |
| Architecture | MoE |
| License | Apache 2.0 |

### Other Notable Small Models
- **Tiny Aya** (Cohere, February 2026): 3.35B, CC-BY-NC, 70+ languages, designed for edge
- **Cohere Transcribe** (March 2026): 2B, Apache 2.0, speech recognition, tops HF Open ASR leaderboard
- **Voxtral TTS** (Mistral, March 26, 2026): Open-source TTS, 9 languages
- **Gemma 3 270M** (2025): Ultra-compact, hyper-efficient AI

---

## 4. Major Q1 2026 Open-Source Releases (Chronological)

| Date | Model | Developer | Key Details |
|------|-------|-----------|-------------|
| Jan 15, 2026 | InternLM3-8B | Shanghai AI Lab | 8B, 4x data efficiency vs Llama 3.1 |
| Jan 27, 2026 | Kimi K2.5 | Moonshot AI | 1T total / 32B active MoE, MIT license, Agent Swarm |
| Jan 27, 2026 | Qwen3-Max-Thinking | Alibaba | Reasoning-focused variant |
| Feb 11, 2026 | GLM-5 | Zhipu AI | 745B/44B MoE, MIT, best open-source coding/reasoning |
| Feb 11, 2026 | MiniMax-M2.5 | MiniMax | 230B/10B MoE, 80.2% SWE-bench |
| Feb 16, 2026 | Qwen3.5-397B-A17B | Alibaba | Flagship multimodal MoE, Apache 2.0 |
| Feb 24, 2026 | Qwen3.5 Medium (122B, 35B, 27B) | Alibaba | Mid-tier multimodal series |
| Feb 2026 | Tiny Aya | Cohere | 3.35B, 70+ languages, CC-BY-NC |
| Mar 1, 2026 | Qwen3.5 Small (0.8B-9B) | Alibaba | 4 edge models, multimodal, Apache 2.0 |
| Mar 15, 2026 | GLM-5-Turbo | Zhipu AI | Faster variant of GLM-5 |
| Mar 16, 2026 | Mistral Small 4 | Mistral AI | 119B/6.5B MoE, unified reasoning+multimodal+coding, Apache 2.0 |
| Mar 2026 | Cohere Transcribe | Cohere | 2B speech recognition, Apache 2.0 |
| Mar 26, 2026 | Voxtral TTS | Mistral | Open-source TTS, 9 languages |
| Mar 27, 2026 | GLM-5.1 | Zhipu AI | Improved GLM-5, approaches Claude Opus 4.6 on coding |

---

## 5. Current Leaderboard Standings (March 2026)

### LMArena (formerly Chatbot Arena) - Text Leaderboard (as of ~March 26, 2026)
5,632,160 votes, 333 models evaluated.

| Rank | Model | Developer | Elo | Notes |
|------|-------|-----------|-----|-------|
| 1 | claude-opus-4-6 | Anthropic | 1504 | Proprietary |
| 2 | gemini-3.1-pro-preview | Google | 1500 | Proprietary, Preliminary |
| 3 | claude-opus-4-6-thinking | Anthropic | 1500 | Proprietary |
| 4 | grok-4.20-beta1 | xAI | 1493 | Proprietary, Preliminary |
| 5 | gemini-3-pro | Google | 1485 | Proprietary |
| 6 | gpt-5.2-chat-latest | OpenAI | 1481 | Proprietary |
| 7 | gpt-5.4-high | OpenAI | 1480 | Proprietary, Preliminary |
| 8 | gemini-3-flash | Google | 1473 | Proprietary |
| 9 | grok-4.1-thinking | xAI | 1473 | Proprietary |

**Top open-source models on LMArena:**
- GLM-5 / GLM-4.7 family among the highest-ranked open models
- Kimi K2.5 and MiniMax M2.5 in S-tier for open-source
- GLM-4.7 ranks #6 on Code leaderboard specifically

### Artificial Analysis Intelligence Index (March 2026)
314 models ranked. 200 are open-weight.

| Rank | Model | Score | Type |
|------|-------|-------|------|
| 1 | Gemini 3.1 Pro Preview | 57 | Proprietary |
| 2 | GPT-5.4 (xhigh) | 57 | Proprietary |
| 3 | GPT-5.3 Codex (xhigh) | 54 | Proprietary |
| 4 | Claude Opus 4.6 (Max Effort) | 53 | Proprietary |
| 5 | Claude Sonnet 4.6 (Max Effort) | 52 | Proprietary |

**Top open-weight model:** GLM-5 (Reasoning) with Intelligence Index score of 50.

**Performance highlights:**
- Fastest: Mercury 2 (789.2 t/s)
- Cheapest: Gemma 3n E4B Instruct ($0.03/M tokens)

### Hugging Face Open LLM Leaderboard
Rankings shift hourly. Visit https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard for live data.

---

## 6. Key Trends

1. **MoE dominance**: Nearly every frontier open-source model uses Mixture-of-Experts. Dense models are now the exception, not the rule.

2. **Chinese labs leading open-source**: DeepSeek, Zhipu (GLM), Alibaba (Qwen), Moonshot (Kimi), MiniMax, and 01.AI collectively dominate the open-source frontier tier.

3. **Native multimodality**: Qwen3.5, Gemma 3n, and Kimi K2.5 are all natively multimodal from pre-training, not bolted-on adapters.

4. **MIT/Apache 2.0 as standard**: Most frontier open models now use fully permissive licenses (MIT or Apache 2.0), with some having revenue-based commercial clauses.

5. **Cost collapse**: Models that match proprietary frontier performance are available at 1/10th to 1/20th the cost.

6. **Edge/mobile explosion**: The sub-7B space has matured dramatically, with 2-4B models matching 13B models from 2023.

---

## Sources

- [BentoML: Complete Guide to DeepSeek Models](https://www.bentoml.com/blog/the-complete-guide-to-deepseek-models-from-v3-to-r1-and-beyond)
- [DeepSeek Wikipedia](https://en.wikipedia.org/wiki/DeepSeek)
- [Huawei Central: DeepSeek R2 tipped to launch](https://www.huaweicentral.com/huawei-ai-chip-powered-deepseek-r2-tipped-to-launch-this-month/)
- [GLM-5 Hugging Face](https://huggingface.co/zai-org/GLM-5)
- [GLM-5 GitHub](https://github.com/zai-org/GLM-5)
- [NxCode: GLM-5 Complete Guide](https://www.nxcode.io/resources/news/glm-5-open-source-744b-model-complete-guide-2026)
- [Kimi K2.5 Official](https://www.kimi.com/ai-models/kimi-k2-5)
- [Kimi K2.5 Hugging Face](https://huggingface.co/moonshotai/Kimi-K2.5)
- [Analytics Vidhya: Kimi K2.5](https://www.analyticsvidhya.com/blog/2026/01/kimi-k2-5/)
- [Meta AI: Llama 4](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Llama Wikipedia](https://en.wikipedia.org/wiki/Llama_(language_model))
- [Qwen Wikipedia](https://en.wikipedia.org/wiki/Qwen)
- [Qwen3.5 GitHub](https://github.com/QwenLM/Qwen3.5)
- [Qwen3.5-397B-A17B Hugging Face](https://huggingface.co/Qwen/Qwen3.5-397B-A17B)
- [MarkTechPost: Qwen 3.5 Small Models](https://www.marktechpost.com/2026/03/02/alibaba-just-released-qwen-3-5-small-models-a-family-of-0-8b-to-9b-parameters-built-for-on-device-applications/)
- [MarkTechPost: Qwen 3.5 Medium](https://www.marktechpost.com/2026/02/24/alibaba-qwen-team-releases-qwen-3-5-medium-model-series-a-production-powerhouse-proving-that-smaller-ai-models-are-smarter/)
- [OpenAI: Introducing gpt-oss](https://openai.com/index/introducing-gpt-oss/)
- [gpt-oss Hugging Face](https://huggingface.co/openai/gpt-oss-120b)
- [Mistral AI: Mistral Small 4](https://mistral.ai/news/mistral-small-4)
- [Mistral AI: Devstral 2](https://mistral.ai/news/devstral-2-vibe-cli)
- [MiniMax M2.5 Official](https://www.minimax.io/news/minimax-m25)
- [MiniMax M2.5 Hugging Face](https://huggingface.co/MiniMaxAI/MiniMax-M2.5)
- [SmolLM3 Hugging Face](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- [Microsoft: Phi-4-mini-flash-reasoning](https://azure.microsoft.com/en-us/blog/reasoning-reimagined-introducing-phi-4-mini-flash-reasoning/)
- [Gemma 3 Google DeepMind](https://deepmind.google/models/gemma/gemma-3/)
- [Gemma 3n Releases](https://ai.google.dev/gemma/docs/releases)
- [InternLM GitHub](https://github.com/InternLM/InternLM)
- [LMArena Leaderboard](https://arena.ai/leaderboard/text)
- [Artificial Analysis Leaderboard](https://artificialanalysis.ai/leaderboards/models)
- [Onyx Open LLM Leaderboard](https://onyx.app/open-llm-leaderboard)
- [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)
