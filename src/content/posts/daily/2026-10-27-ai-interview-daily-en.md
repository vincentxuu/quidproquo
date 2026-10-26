---
title: "AI Engineer Interview Daily — 2026-10-27: Deep Learning & NLP"
date: 2026-10-27
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's slot is Deep Learning & NLP: a real Sarvam AI interview question anchors today's practice on LoRA's low-rank assumption, what QLoRA adds on top, and when to reach for PEFT instead of full fine-tuning."
tldr: "Today's core concept is LoRA's math: freeze the original weight matrix W, train only the product of two small matrices B and A so that ΔW=BA, with rank r far smaller than the original matrix dimensions, and initialize B to zero so training starts out identical to the base model. QLoRA adds a separate fix on top: it quantizes the frozen base into 4-bit NF4 while the adapter itself still trains in bf16 — the two techniques solve different layers of the resource problem. The practice question comes from a real Sarvam AI MLE interview — explain how LoRA/QLoRA works and when you'd pick PEFT over full fine-tuning — and the real test isn't reciting the acronyms, it's walking through a decision order: how much new knowledge the task needs, then the hardware budget, then the rank and whether to quantize."
series:
  name: "AI Engineer Interview Daily"
  order: 69
---

> 🌏 [中文版](/posts/daily/2026-10-27-ai-interview-daily)

## Today's Focus

Tuesday's fixed slot is Deep Learning & NLP. Today's topic is one of the highest-frequency areas in LLM fine-tuning interviews: LoRA and QLoRA. These questions usually come wrapped in a resource-constrained engineering choice — "you only have one consumer GPU, how do you fine-tune a 7-billion-parameter model" — rather than a plain "what does the acronym stand for" question, because what the interviewer actually wants to see is whether you can break down why full fine-tuning is so expensive into concrete memory and compute bottlenecks, then explain exactly which bottleneck LoRA solves and which additional one QLoRA solves.

## Core Concepts, Quick Review

### LoRA's core assumption: the low-rank update ΔW = BA

LoRA starts from an observation: even though a pretrained model's weight matrix W is itself high-rank, the "change" ΔW that fine-tuning actually needs to learn turns out to be low-rank — the information needed to fit a task into the model is far smaller than the matrix's own dimensions. LoRA freezes the original weight W and only trains two small matrices, B (dimension d×r) and A (dimension r×k), using their product BA to approximate ΔW, where rank r is far smaller than the original d and k. Trainable parameters drop from d×k down to r×(d+k), which is why a LoRA adapter for a 7B model can fit in a file just tens of megabytes in size.

```diagram
title: LoRA's low-rank update structure
desc: Input x flows through both the frozen original weight W0 and the new low-rank bypass of A and B; the two outputs are added to get h = W0x + BAx.
caption: Simplified view — only A and B are trained; W0 stays frozen throughout.
---
<svg viewBox="0 0 640 320">
  <path class="dg-line" d="M76 148 H122 Q130 148 130 140 V84 Q130 76 138 76 H156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M76 172 H122 Q130 172 130 180 V224 Q130 232 138 232 H156" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M244 232 H296" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 76 H460 Q468 76 468 84 V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M384 232 H460 Q468 232 468 224 V192" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M496 160 H552" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="16" y="132" width="60" height="56" rx="6"/>
  <text class="dg-label" x="46" y="160" text-anchor="middle" dominant-baseline="central">x</text>

  <rect class="dg-box" x="160" y="40" width="180" height="72" rx="6"/>
  <text class="dg-label" x="250" y="67" text-anchor="middle" dominant-baseline="central">W₀</text>
  <text class="dg-sub" x="250" y="87" text-anchor="middle" dominant-baseline="central">frozen・d×k</text>

  <rect class="dg-box dg-box--accent" x="160" y="204" width="84" height="56" rx="6"/>
  <text class="dg-label" x="202" y="224" text-anchor="middle" dominant-baseline="central">A</text>
  <text class="dg-sub" x="202" y="244" text-anchor="middle" dominant-baseline="central">r×k</text>

  <rect class="dg-box dg-box--accent" x="300" y="204" width="84" height="56" rx="6"/>
  <text class="dg-label" x="342" y="224" text-anchor="middle" dominant-baseline="central">B</text>
  <text class="dg-sub" x="342" y="244" text-anchor="middle" dominant-baseline="central">d×r</text>

  <rect class="dg-box" x="440" y="132" width="56" height="56" rx="6"/>
  <text class="dg-label" x="468" y="160" text-anchor="middle" dominant-baseline="central">+</text>

  <rect class="dg-box" x="556" y="132" width="60" height="56" rx="6"/>
  <text class="dg-label" x="586" y="160" text-anchor="middle" dominant-baseline="central">h</text>
</svg>
```

### Initialization detail: why A is random and B is zero

This is a detail interviewers love to probe. Matrix A is initialized from a Gaussian distribution, while matrix B is initialized to all zeros, so that at the start of training ΔW = BA = 0 — the model's output matches the original pretrained model exactly, and only diverges as training proceeds and the update becomes meaningful. This design guarantees the fine-tuning starting point never corrupts capabilities the base model already has just because of random initialization, and it's a key reason LoRA trains stably. Being able to name this detail is usually a bonus point in an interview.

### Rank r and alpha scaling are two separate knobs

Rank r sets the adapter's "capacity" — a larger r lets ΔW express more complex updates, but it also costs more trainable parameters and memory; a common rule of thumb is r=8 for instruction-following tasks, while complex reasoning or creative generation might need r=64. But rank isn't the only knob: in practice, ΔW gets multiplied by an alpha/r scaling factor, and alpha controls how strongly that update is applied — it's an independent knob from rank. At the same rank, setting alpha too high can make training diverge outright even at a normal learning rate. This is also the most common trap when an interviewer follows up with "so is higher rank always better" — the answer is no, it depends on whether the task actually needs that much update complexity, and whether alpha has been tuned to match.

### What QLoRA solves beyond LoRA

LoRA already shrinks the number of trainable parameters, but it doesn't solve the fact that the frozen base model still has to be loaded into GPU memory in full — a 70B model stored in bf16 alone needs 140GB and up. QLoRA adds one more thing on top of LoRA: it quantizes the frozen base model into 4-bit NormalFloat (NF4) format for storage, dequantizing it on the fly for computation during inference, while the LoRA adapter itself still trains in bf16 — this alone cuts the base model's memory footprint to roughly a quarter, bringing 70B-model fine-tuning down from a multi-GPU cluster to a single A100. The interview-relevant distinction: LoRA solves "too many trainable parameters," while QLoRA solves "even the frozen part doesn't fit in memory." They stack — one doesn't replace the other.

## Today's Practice Question

### The Question

Explain how LoRA or QLoRA works, and when you would choose parameter-efficient fine-tuning (PEFT) over full fine-tuning.

**Source**: Sarvam AI Machine Learning Engineer interview (compiled by knok.work)　**Difficulty**: Intermediate　**Round**: Onsite / Technical screen

### How to Break It Down

1. **Clarify the problem first**: Ask how much genuinely new knowledge this task requires — teaching the model a new tone and output format (a low-rank update is usually plenty) versus injecting a large volume of domain knowledge the model has genuinely never seen (a low-rank update may not have enough expressive capacity, and full fine-tuning or further pretraining might be warranted). Also confirm the hardware budget — a single consumer GPU versus a multi-GPU cluster — and whether multiple task-specific adapters need to coexist.
2. **Build a framework**: Split the decision into two tiers — first decide whether to use PEFT at all (driven by how much new knowledge the task needs and the hardware budget), then decide whether to stack quantization on top of PEFT (driven by whether even the frozen base model fits in memory). Lead with the framework before filling in details — don't jump straight to "LoRA" the moment you hear "fine-tuning."
3. **Dig into the core trade-off**: The technical crux is the low-rank assumption ΔW = BA and how rank and alpha interact, plus the fact that QLoRA's quantization only touches the frozen base, not the adapter. The most common follow-up trap is "does QLoRA hurt the precision of adapter training" — the answer is no, because quantization only applies to the frozen, unchanging base model; the adapter's training and gradient computation still run at full bf16 precision, and the error introduced by quantization is confined to the base model's forward pass, kept within an acceptable range via dynamic dequantization.
4. **Wrap it up**: Land on one summary line — "First decide whether to use LoRA based on how much new knowledge the task needs and whether hot-swapping multiple adapters matters, then decide whether to stack QLoRA's 4-bit quantization based on hardware budget, and finally validate with a held-out evaluation against the base model's original capabilities to confirm the low-rank update didn't sacrifice something it shouldn't have."

### Sample Answer (how to actually say this in the interview)

> **Start with the task's nature and the budget**: I'd first ask whether this fine-tuning task is teaching the model a new output style or domain vocabulary — like customer-service phrasing or industry terminology — or injecting a large amount of factual knowledge the model has genuinely never seen. For the former, LoRA's low-rank assumption — that the "change" a task needs is far simpler than the weight matrix itself — is usually expressive enough; for the latter, a low-rank update might not have enough capacity, and I'd consider continued pretraining or full fine-tuning instead. I'd also ask about the hardware budget, since that directly decides whether to stack QLoRA on top.

> **The technical call**: Say the budget is a single consumer GPU and the model is in the 7B range — I'd use QLoRA, quantizing the frozen base model to 4-bit NF4 to cut its memory footprint to roughly a quarter, while setting the LoRA adapter's rank to somewhere around 8 to 16 with alpha around twice the rank, still training the adapter itself in bf16 so gradient precision isn't affected by the quantization — only the base model's forward pass gets dequantized on the fly. If I later need to support multiple customers' customized behaviors at once, I'd keep the adapters stored separately from the base and hot-swap between them at inference time, rather than merging each customer's adapter into its own full standalone model, which would mean storing a full duplicate model for every new customer.

> **Closing the loop with validation**: After training, I wouldn't just look at the loss curve — I'd run a held-out set of tasks against the base model's original capabilities to confirm the low-rank update hasn't regressed anything it already did well, a lightweight check against catastrophic forgetting. After deployment I'd keep monitoring inference latency and adapter-switching stability, and if the task turns out more complex than expected, I'd try raising the rank first rather than jumping straight back to full fine-tuning.

### Self-Check List

Use this table to make sure your answer hit the key points:

| Checkpoint | Covered? |
|---------|---------|
| Clarified how much new knowledge the task needs, the hardware budget, and whether multiple adapters need hot-swapping | |
| Named LoRA's math core: ΔW=BA, rank r far smaller than d/k, B initialized to zero so training starts identical to the base model | |
| Clearly separated LoRA (solves too many trainable parameters) from QLoRA (solves the frozen base not fitting in memory) as different layers of the problem | |
| Named rank and alpha as two independent knobs — higher rank isn't automatically better | |
| Mentioned validating before launch with a held-out comparison against the base model's original capabilities | |
| Bonus: mentioned storing adapters separately from the base for multi-task hot-swapping | |

## Further Reading

- [What Is LoRA (Low-Rank Adaptation) — Arize AI](https://arize.com/glossary/lora/) — Explains why LoRA works through the lens of "trainable parameters drop from d×k to r(d+k)," reinforcing the parameter-count math this article didn't fully expand on.
- [LLM Fine-Tuning – LoRA, QLoRA and Parameter-Efficient Fine-Tuning — Data Expertise](https://www.dataexpertise.in/llm-fine-tuning-lora-qlora-parameter-efficient-peft/) — Walks through LoRA's full forward-pass equation h=W₀x+BAx and QLoRA's NF4 quantization details for anyone who wants the complete math.

## References

- [Sarvam Machine Learning Engineer Interview: Questions & Prep (2026) — knok.work](https://knok.work/blog/sarvam-machine-learning-engineer-interview.html) — Source of today's practice question ("explain how LoRA/QLoRA works and when to choose PEFT"), and also provides a real candidate's scenario of using QLoRA for a budget-constrained Hindi/Hinglish fine-tuning task.
- [What Is LoRA (Low-Rank Adaptation) — Arize AI](https://arize.com/glossary/lora/) — Backs "LoRA's core assumption," including the definition of ΔW=BA and rank r.
- [LLM Fine-Tuning – LoRA, QLoRA and Parameter-Efficient Fine-Tuning — Data Expertise](https://www.dataexpertise.in/llm-fine-tuning-lora-qlora-parameter-efficient-peft/) — Backs "Rank r and alpha scaling" and "What QLoRA solves beyond LoRA," including NF4 quantization and typical rank values.
- [LoRA and adapters (PEFT) — Scalata](https://scalata.ai/resources/model-training/lora) — Backs "Initialization detail," including the zero-initialized B matrix and the practical observation that an overly large alpha can cause training to diverge.
