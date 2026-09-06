---
title: "MiniMind: Train an LLM From Scratch for $0.40"
date: 2026-09-06
category: ai
type: deep-dive
tags: [minimind, llm, training, open-source, pytorch, pre-training, sft, lora, dpo, grpo, moe, reinforcement-learning]
lang: en
tldr: "MiniMind is an open-source project for training LLMs from scratch: a 64M Dense model and a 198M-A64M MoE model that run the entire chain — Pretrain → SFT → LoRA → DPO → PPO/GRPO/CISPO → Agentic RL — in ~2 hours on a single RTX 3090 at roughly 3 RMB (~$0.40). Every core algorithm is implemented natively in PyTorch with no high-level wrappers."
description: "A deep dive into the MiniMind open-source project: its from-scratch LLM training chain, model architecture tradeoffs, training costs, honest evaluation results, and ecosystem integration."
draft: false
---

> [中文版](/posts/ai/2026-09-06-minimind-train-llm-from-scratch)

Most people's path into LLMs stops at inference and fine-tuning: run a few [LoRA](https://arxiv.org/abs/2106.09685) epochs on an existing model and call it a day. [MiniMind](https://github.com/jingyaogong/minimind) takes the other route — from scratch. For roughly 3 RMB (~$0.40) of GPU rental and about 2 hours on a single RTX 3090, it walks you through Pretrain, SFT, LoRA, DPO, PPO, GRPO, CISPO, Agentic RL, and knowledge distillation, with every core algorithm implemented natively in PyTorch — no high-level abstractions from `transformers`, `trl`, or `peft`. This article unpacks its design logic, training chain, and limitations.

## Positioning: a textbook, not a product

MiniMind's motto is "大道至簡" — extreme simplicity. The latest minimind-3 has only 64M parameters, roughly 1/2700 the size of GPT-3. The goal is not a usable product model but a codebase where everyone can read every line. This positioning drives several key tradeoffs:

- **From-scratch implementation vs high-level wrappers**: `trl` runs an entire RLHF pipeline in a few lines, but shields you from the internals. MiniMind inverts that: PPO's Actor-Critic and GAE, GRPO's group normalization, LoRA's low-rank decomposition, white-box distillation's CE+KL mixed loss — all hand-written.
- **Ecosystem compatibility over reinvention**: the architecture aligns with [Qwen3](https://github.com/QwenLM/Qwen3)/Qwen3-MoE, so weights drop directly into existing inference engines like [vllm](https://github.com/vllm-project/vllm), [ollama](https://github.com/ollama/ollama), and [llama.cpp](https://github.com/ggml-org/llama.cpp). This is standing on the existing ecosystem, not reinventing it.
- **Honest cost definition**: "2 hours" is the measured SFT time for 1 epoch on a single 3090; "3 RMB" is the corresponding GPU rental. Pretrain + SFT on the mini datasets totals about 2.31 hours and 3.0 RMB to produce the minimind-3 Zero chat model from scratch.

**Where to rent a GPU**: the ~3 RMB figure is measured against the Chinese rental ecosystem, most commonly [AutoDL](https://www.autodl.com/) — RTX 3090s for roughly 1–2 RMB/hour, with direct ModelScope downloads and Aliyun pip mirrors so the README's steps run as written. It requires a Chinese phone number and payment method. Readers who'd rather avoid that can use [vast.ai](https://vast.ai/) (cheapest, mixed quality) or [RunPod](https://www.runpod.io/) (clean interface, pricier). Prices float constantly; check the platform's current quote.

## Architecture: engineering tradeoffs aligned to Qwen3

minimind-3 is a standard decoder-only Transformer: Pre-Norm + RMSNorm, SwiGLU, RoPE with [YaRN](https://arxiv.org/abs/2309.00071) extrapolation, `q_heads=8`, `kv_heads=4`, `max_position_embeddings=32768`. The 8-layer, `d_model=768` configuration draws on [MobileLLM](https://arxiv.org/pdf/2402.14905) — at a fixed parameter budget, "deep and narrow" usually beats "wide and shallow", but `d_model` below 512 amplifies the downside. 768 is the balance point between training stability and efficiency.

Two easily misunderstood points:

- **MoE is not free speed**. minimind-3-moe is 198M total parameters with 64M active (4 experts / top-1 routing), but in native PyTorch it trains roughly 50% slower than a dense model of similar size — tokens are bucketed per expert, and kernel start/stop and scheduling overhead add up. Fixing it requires kernel-fused operators like [Triton](https://github.com/triton-lang/triton) or [DeepSpeed-MoE](https://github.com/microsoft/DeepSpeed). The README acknowledges this plainly rather than claiming "MoE is faster".
- **The vocabulary is deliberately tiny**. The tokenizer is a self-trained BPE + ByteLevel with only 6,400 entries (vs Qwen2's 151,643). For a small model, embedding and output layers scale directly with vocab size; 6,400 keeps the parameter budget in the compute layers. The cost: weaker compression and encode/decode efficiency than mainstream Chinese-oriented tokenizers (roughly 1.5–1.7 chars/token).

## The training chain: one unified view of policy optimization

The full chain is Pretrain → SFT → LoRA → DPO → RLAIF (PPO / GRPO / CISPO) → Agentic RL, plus knowledge distillation. The most instructive part is how it reduces every policy optimization algorithm to a single objective: a policy term (how the probability ratio updates the policy), an advantage term (how advantage is computed), and a regularization term (how far the KL constraint lets the policy drift). Each xxPO is just a different instantiation of these three components:

| Algorithm | Advantage source | Models trained |
|---|---|---|
| [DPO](https://arxiv.org/abs/2305.18290) | None explicit (implicit via preference pairs) | 1 |
| [PPO](https://arxiv.org/abs/1707.06347) | Critic network + GAE | 2 |
| [GRPO](https://arxiv.org/pdf/2402.03300) | Group normalization (compare N responses) | 1 |
| [CISPO](https://huggingface.co/papers/2506.13585) | Reuses GRPO group advantages | 1 |

The empirical observations from training curves are more valuable than the formulas:

- **PPO converges slowly**: the Critic must first estimate the value function accurately before the Actor's updates are meaningful, and the two interdepend. It also uses roughly 1.5–2× the GPU memory of a single-network method. GRPO trains more stably with a smoother reward curve.
- **Reward sparsity is a real wall**: a 64M model gets nearly every math problem wrong, so rule-based binary rewards drive all advantages to zero and gradients vanish. MiniMind's answer is a continuous-score reward model like [InternLM2-1.8B-Reward](https://huggingface.co/internlm/internlm2-1_8b-reward), which can still distinguish "worse" from "less bad".
- **Agentic RL is delayed settlement**: `train_agent.py` folds multi-turn tool calls, observation append-back, and re-planning into a single trajectory τ, scores the whole trajectory jointly (tool legality + answer hit + format + RM score), and only backpropagates after the episode ends. It also decouples training from rollout (the rollout engine can switch to [SGLang](https://github.com/sgl-project/sglang)), synchronous for now, but already sharing the minimal skeleton of [verl](https://github.com/volcengine/verl) and [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF)-scale RL frameworks.

Agentic RL's effect shows up clearly in light agent tasks: on the same 20-question math tool-use benchmark, the `full_sft` weights score 60% and the `agent` weights score 85%. The cost is equally clear — factual stability on general Q&A degrades and hallucination gets bolder. The README calls this the "alignment tax": post-training pulls one capability line way up, almost always at the expense of generality. This holds at large-model scale too.

Reasoning, meanwhile, is no longer a separately trained reason model. It is pushed down into the chat template: an `open_thinking` switch decides whether to inject an empty ` thinking response` or an explicit chain-of-thought prefix. Training mixes empty-think and explicit-reasoning samples so one model learns when to think and when to answer directly.

## Honest evaluation

The README doesn't dodge the fact that small models are weak, which deserves credit:

- **Benchmarks near random**. minimind-3 scores about 25% on C-Eval / C-MMLU, and differences against same-scale models like SmolLM2-135M are within standard error. It even runs a `minimind-3-exam` experiment: a format-alignment LoRA (no new knowledge) gains 2.9 percentage points on average across 7 test sets — evidence that the bottleneck for small models isn't always knowledge, sometimes it's input format alignment.
- **"Says it well" and "says it right" rarely coincide**. In a subjective comparison, minimind-3-moe ranks first (68/100) on fluency and coding ability, but hallucinates badly (Yangtze = Everest, pandas eat seafood). The most factually solid answer came from the competing chatlm-mini-chinese. The author even hands the full transcripts to GPT-5.4 as judge and publishes everything — readers can verify directly.
- **The Zero model really does babble**. The README keeps early Zero samples where Chinese mostly works but English degenerates into gibberish. That's not a bug showcase; it calibrates expectations for what two hours buys you.

## The takeaway

MiniMind's core value is not the models — 64M parameters is unusable for any real task. It's the full decision chain of LLM training laid open: why 8 layers at 768 dim, why a 6,400-token vocabulary, why GRPO converges more stably than PPO, what to do about reward sparsity, and how Agentic RL trajectories differ from single-turn optimization. It's for people who want to understand RLHF/GRPO internals, instructors who need teaching material, and anyone who wants to rehearse a training pipeline at negligible cost before committing real GPU hours. If you want production models or frontier-scale results, use verl, [Llama-Factory](https://github.com/hiyouga/LLaMA-Factory), and friends — MiniMind says so itself. Everything is Apache 2.0, with weights and full training datasets on [HuggingFace](https://huggingface.co/collections/jingyaogong/minimind-66caf8d999f5c7fa64f399e5) and ModelScope.

## References

- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [MiniMind HuggingFace collection](https://huggingface.co/collections/jingyaogong/minimind-66caf8d999f5c7fa64f399e5)
- [Qwen3](https://github.com/QwenLM/Qwen3)
- [MobileLLM: Optimizing Sub-billion Parameter Language Models](https://arxiv.org/pdf/2402.14905)
- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [YaRN: Efficient Context Window Extension](https://arxiv.org/abs/2309.00071)
- [DPO: Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [PPO (original paper)](https://arxiv.org/abs/1707.06347)
- [DeepSeekMath (GRPO origin)](https://arxiv.org/pdf/2402.03300)
- [MiniMax-M1 (CISPO origin)](https://huggingface.co/papers/2506.13585)
- [InternLM2-1.8B-Reward](https://huggingface.co/internlm/internlm2-1_8b-reward)
- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
- [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) / [verl](https://github.com/volcengine/verl) / [Llama-Factory](https://github.com/hiyouga/LLaMA-Factory)
- [AutoDL](https://www.autodl.com/) / [vast.ai](https://vast.ai/) / [RunPod](https://www.runpod.io/) (GPU rental platforms)