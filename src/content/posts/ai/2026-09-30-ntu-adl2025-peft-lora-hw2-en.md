---
title: "NTU ADL 2025 Lecture 7.5: PEFT — Adapter, LoRA, Prompt Tuning, and HW2"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, nlp, llm, peft, lora, prompt-tuning, fine-tuning]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 10
tldr: "When an LLM is too big to fine-tune in full, the LLM Adaptation slides of NTU ADL Fall 2025 offer three ways to change only a small part of it: insert small Adapter modules into the Transformer, represent the weight update with low-rank matrices (LoRA), or learn only a prefix or soft prompt (prompt tuning). The slides conclude that no single method fits every task. For HW2, the only public information is its title, \"LLM Tuning and Prompt Tuning for Classical Chinese Translation\"; the data, baseline, and grading have no written spec."
description: "A guide to the LLM Adaptation slides and video 7.5 of Yun-Nung Chen's NTU Applied Deep Learning, Fall 2025: why efficient adaptation matters, Adapter, LoRA and its GPT-3 175B example, prefix and soft prompt tuning, the Mao et al. 2022 comparison, and what can and cannot be confirmed about HW2, LLM and prompt tuning for Classical Chinese translation."
draft: false
glossary:
  - term: "PEFT"
    definition: "Parameter-Efficient Fine-Tuning: freeze most of a pre-trained model and train only a small set of added or selected parameters, so one base model can adapt to many tasks cheaply."
    context: "The topic of the ADL LLM Adaptation slides, which call it Parameter-Efficient LM Tuning."
  - term: "Adapter"
    definition: "A small trainable submodule inserted into Transformer layers. All tasks share the original model; only the adapters are stored per task."
    context: "ADL LLM Adaptation slides, p.8."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2)

This is post 10 of [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). The course is ADL Fall 2025 (NTU semester 114-1, 2025/09/01–12/15). The course page puts LLM Adaptation on the same day as Post-Training (9/22). That week's TA recitation is LLM LoRA Training, and the homework column shows HW 2.

**Sources**: the [LLM Adaptation slides](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf) (14 pages), video [7.5 Parameter-Efficient Fine-Tuning (Adaptor, LoRA)](https://youtu.be/ii2kMoUyNOs) (19:21), and the HW2 video [ADL 2025 Fall Homework 2](https://youtu.be/_QiIp0WTRzI) (13:05, uploaded 2025-10-06). All checked on 2026-09-30. The slides run only 14 pages and are mostly diagrams, so this post is shorter than the previous one.

**Series position**: previous [Post-Training: Instruction Tuning, RLHF, and InstructGPT](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en) | next [RAG and HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=ii2kMoUyNOs
title: ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=_QiIp0WTRzI
title: ADL 2025 Fall Homework 2 (YouTube)
```

Original videos: [ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) (YouTube, in Mandarin)](https://www.youtube.com/watch?v=ii2kMoUyNOs)、[ADL 2025 Fall Homework 2 (YouTube)](https://www.youtube.com/watch?v=_QiIp0WTRzI)、[ADL TA Recitation: LLM LoRA Training (YouTube, in Mandarin)](https://www.youtube.com/watch?v=eGQMzbhokg0)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## The problem: full fine-tuning is too expensive

The slides open with the same map as the previous lecture (pp.2–4). To do well on known tasks, you can do prompt tuning/engineering or tune the LM itself. Page 4 adds a note next to the second option: fine-tuning LLMs may be expensive and impractical. Page 5 therefore names the topic Parameter-Efficient LM Tuning, a more practical way to adapt LLMs.

Page 6 gives three reasons efficient adaptation matters (the slide credits Benji Xie and Regina Wang):

1. The current AI paradigm emphasizes accuracy over efficiency.
2. Training and fine-tuning LLMs carries hidden environmental costs.
3. As training costs rise, AI development concentrates in well-funded organizations, especially in industry.

Page 7 states the shared idea in one line: slightly modify the hidden representations instead of the whole model.

## Three approaches

### Adapter

Page 8 (the slide cites He et al., 2022) inserts small trainable submodules into each Transformer block, after multi-head attention and after the feed-forward layer. The key line is at the bottom: all tasks share the same original pre-trained model, and the adapters are task-specific modules. The result is better robustness and less storage.

### LoRA

Pages 9–11 cover [LoRA](https://arxiv.org/abs/2106.09685) (Hu et al., 2021):

- The idea is low-rank adaptation. The diagram places LoRA modules beside attention and feed-forward, added in parallel to the original weights.
- The justification is on p.10: weight updates for downstream fine-tuning have a low intrinsic rank.
- Page 11 closes with results on GPT-3 175B and concludes that LoRA shows better scalability and task performance.

<details>
<summary>The low-rank update as a formula (from the LoRA paper; the slides show it as a diagram)</summary>

The original weight W₀ is a d×k matrix. LoRA freezes W₀ and learns two small matrices:

```text
W = W₀ + ΔW = W₀ + B·A
B ∈ R^(d×r),  A ∈ R^(r×k),  r ≪ min(d, k)
```

Trainable parameters drop from d·k to r·(d+k). Before inference you can merge B·A back into W₀, so there is no extra latency. These details come from the LoRA paper; the slides state only the core observation about low intrinsic rank.

</details>

### Prompt tuning

Page 12 has one line of text: prefix tuning and soft prompt tuning are also parameter-efficient adaptation. Both already appeared in [post 8 on pre-training and prompt learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en). Here they are reclassified under PEFT: leave the model weights alone and learn only a sequence of continuous vectors placed before the input.

### Which one is best?

Page 13 cites a comparison by Mao et al. 2022. The conclusion is one line: no one can fit all tasks.

| Approach | What it changes | The slides' reason |
|---|---|---|
| Adapter | Inserts new modules into Transformer layers | Shared base model, per-task adapters: robust and storage-efficient |
| LoRA | Adds a low-rank update beside existing weights | Weight updates are low-rank anyway; better scalability and performance on GPT-3 175B |
| Prompt tuning | Learns only a prefix or soft prompt before the input | Also parameter-efficient |

## Hands-on work is in the TA recitation

That week's recitation is LLM LoRA Training. The course page's slide link, `f114-adl/doc/w5-LoRA.pdf`, returned 404 on 2026-09-30. A file with the same name opens under the [Fall 2024 path](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf). The linked video is [ADL TA Recitation: LLM LoRA Training](https://youtu.be/eGQMzbhokg0) (18:15, in Mandarin), uploaded 2023-11-16, so it is a recording reused from an earlier year. Implementation details are left for post 18 of this series, on the TA recitations.

## HW2: only the title is public

The HW 2 button in the course page's 9/22 row links straight to [ADL 2025 Fall Homework 2](https://youtu.be/_QiIp0WTRzI) on YouTube. What can be confirmed:

- **Title**: the video description reads "LLM Tuning and Prompt Tuning for Classical Chinese Translation", that is, translating Classical Chinese using LLM tuning and prompt tuning.
- **Length** 13:05, uploaded 2025-10-06.
- Page 11 of [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) lists the second assignment's topic as LLM Tuning.

**What is missing**: the video has no subtitles, and there are no public spec slides or written instructions. This post cannot confirm the dataset, base model, baseline, metric, submission format, or deadline, so it states none of them. Submission goes through NTU COOL, which needs an NTU account.

**How to use it from outside NTU**: take HW2 as a direction. Build a small parallel set of Classical and modern Chinese yourself and compare three approaches: prompting alone, prompt tuning, and LoRA. You will have to define your own metric, and you cannot compare results with the official grading.

## After this lecture you should be able to

- Explain in one sentence why PEFT helps: only a few parameters change, so the base model can be shared.
- Say where Adapter, LoRA, and prompt tuning each change the model.
- Explain why LoRA works: weight updates during fine-tuning have a low intrinsic rank.

One thing to try tonight: open the config of any Transformer model you have, take the d×k of one attention projection matrix, and compute the r·(d+k) parameters LoRA would train at r = 8. The ratio is what the three reasons on p.6 look like in practice.

## Further reading

- [CS224N Lecture 9: Prompting, LoRA, and Parameter-Efficient Adaptation](/posts/ai/2026-08-22-cs224n-efficient-adaptation-en)
- [CS224N Lecture 18: Material-Gap Record for Tinker and LoRA Without Regret](/posts/ai/2026-08-22-cs224n-tinker-lora-en)

Next: [RAG and HW3](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [ADL Fall 2025 (114-1) course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 9/22 session, recitation, and HW 2 link
- [LLM Adaptation slides (250922_Adaptation.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf) — source of all page numbers
- [ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) (YouTube, in Mandarin)](https://youtu.be/ii2kMoUyNOs)
- [ADL 2025 Fall Homework 2 (YouTube)](https://youtu.be/_QiIp0WTRzI) — the description is a single line with the title
- [Course Logistics slides (250901_Course.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — p.11 lists the three assignment topics
- [LLM LoRA Training recitation slides (same-name file under the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)
- [ADL TA Recitation: LLM LoRA Training (YouTube, in Mandarin)](https://youtu.be/eGQMzbhokg0)
- [2025 Fall NTU CSIE ADL playlist (in Mandarin)](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Hu et al., LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
