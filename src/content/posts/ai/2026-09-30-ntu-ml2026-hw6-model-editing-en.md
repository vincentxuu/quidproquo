---
title: "Hung-yi Lee ML 2026 HW6: Model Editing, Changing One Fact and Nothing Else"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, model-editing, fine-tuning]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 14
tldr: "HW6 involves no model training and is answered entirely on NTU COOL. Six points come from 16 multiple-choice questions on four papers (ROME, MEND, MEMIT, WISE). Four points come from swapping the Colab's fine-tuning for ROME on GPT2-XL: single editing (pick your own fact, write five kinds of test prompts) and multiple editing (10 and then 80 CounterFact examples, then MEMIT), reporting efficacy, paraphrase, neighborhood, and portability scores. The slides and the 47-cell Colab are public, but the quiz questions and answers live only on COOL."
description: "A guide to HW6 \"Model Editing\" from NTU Hung-yi Lee's Machine Learning 2026 Spring: how the slides sort IKE, MEND, and ROME/MEMIT into \"no parameter change / humans decide the edit / AI learns to edit,\" the four assigned papers, the Colab experiment's five single-editing prompt types and four multiple-editing scores, the hint about ROME's update, submission rules, and what outside readers can't get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing)

**This post covers HW6 of [Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is Part 14 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. There are three official materials: the slides [hw6.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw6.pdf), the [Colab notebook](https://colab.research.google.com/drive/1gnaowsSzOT3VSw8j_MIDnksQiaZeKikA?usp=sharing) (47 cells), and the TAs' [walkthrough video](https://youtu.be/AR1bNACLOAU). The TAs are 鄭安妤, 楊樂霖, 尹廷安, and 林育正. It was released 4/24 and due 2026/05/14 23:59:59 (UTC+8), with no late submissions; grades were due by 2026/05/17 23:59:59.

Access is **A3 minus grading**: the slides and Colab are public, and you can reproduce the experiments. But **the quiz questions themselves** are on NTU COOL, which needs an NTU account. hw6.pdf gives only the question counts and point values, not the questions.

## Prerequisite: no lecture this semester covers model editing

HW6 doesn't map to any lecture this semester, and hw6.pdf names no prerequisite video. The 2025 edition of the course, though, has a lecture titled ["Micro-surgery for AI: a brief look at Model Editing"](https://youtu.be/9HPsz7F0mJg) (in Chinese; slides: [edit.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/edit.pdf)), and that semester's homework list also had an HW8 on Model Editing. I suggest watching that lecture for background (my suggestion, not an official requirement). The Colab's data file is still named `HW8_data.json`, a sign this assignment was carried over from the 2025 version.

## What model editing is about

[HW5](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en) asked how to fine-tune a whole capability without washing out other behaviors. HW6 shrinks the unit to the smallest possible: **you want to change a single fact in the model** (say, who the US president is). Can you change just that one fact and leave everything else alone?

The slides tie three families of methods together in one taxonomy:

| Category | Representative method | What the slide shows |
|---|---|---|
| No parameter change | IKE | Put the new fact and a few demonstrations in the context and let the model follow them |
| Change parameters: humans decide how to edit | ROME, MEMIT | Locate a weight matrix $W$ and compute $k^*$, $v^*$ so the final output becomes the new answer (the slide's example is Taipei) |
| Change parameters: AI learns how to edit | MEND | Train a hypernetwork that takes the fact to edit and a middle layer's output and produces an update $e$ to $\theta$ |

The IKE figure uses three kinds of demonstrations: Copying (repeat the new fact), Updating (the fact changed, same question), and Retaining (questions unrelated to the new fact keep their old answers). The last is the core requirement of the whole assignment: **make the edit land without overreaching**.

## Part 1: paper reading (6%, 16 multiple-choice questions)

Four papers are assigned; read them and answer on COOL:

- **[ROME](https://arxiv.org/abs/2202.05262)** (Locating and Editing Factual Associations in GPT)
- **[MEND](https://arxiv.org/abs/2110.11309)** (Fast Model Editing at Scale)
- **[MEMIT](https://arxiv.org/abs/2210.07229)** (Mass-Editing Memory in a Transformer)
- **[WISE](https://arxiv.org/abs/2405.14768)** (Rethinking the Knowledge Memory for Lifelong Model Editing of Large Language Models)

Note that IKE, which appears in the taxonomy, isn't on the reading list, while WISE, which doesn't appear in the taxonomy, is. The hw6.pdf references list only these four papers.

## Part 2: experiment (4%, 10 questions)

By default the Colab runs a **fine-tuning** editor. Its first cell warns in bold that running it as-is only fine-tunes, so you **must modify the code** before answering. The rules allow only **GPT2-XL** as the base model, and the Colab hard-codes `MODEL_NAME = "gpt2-xl"`. It downloads the [MEMIT repository](https://github.com/kmeng01/memit) for its utility functions.

### Single editing: pick your own fact

1. **Finish ROME**: inside `apply_rome_to_model()` there's a commented-out line you need to fill in.
2. **Switch the method**: the call to ROME in the main process is also commented out; replace the `FTHyperParams, apply_ft...` line with the ROME version.
3. **Write the edit request**: fill in `prompt`, `subject`, `target_new`, and `target_true` in `requests`.
4. **Write 5 generation prompts**, each testing something different:

| Type | Rule | Slide example |
|---|---|---|
| original | Replace `{}` with the subject | "Steve Jobs was the founder of" |
| paraphrase | Same subject and target, phrased differently | Mention the Apple II first, then "Steve Jobs founded" |
| neighborhood | Close to the original, but a different subject and target | "Mark Zuckerberg, the founder of" |
| reversion | Swap subject and target, using `target_new` as the new subject | "Microsoft is founded by" |
| portability | A logical consequence of the original | "After Y2K, the company Steve Jobs founded released the operating system," |

Then run ROME, report the [Post-Edit] output for all 5 prompts, and judge which ones count as successfully edited (1 point).

The slide marks this IMPORTANT: **use your own knowledge and prompts**. Reusing the examples, or sharing or copying anyone else's prompts, counts as a rule violation.

These five prompt types are themselves the evaluation framework for model editing. Paraphrase tests generalization (does it still know the fact when asked differently?), neighborhood tests locality (did the edit damage nearby facts?), and reversion and portability test whether the model actually "understands" the new fact or just memorized a string mapping.

### Multiple editing: a CounterFact subset

The TAs prepared 80 examples, each with an edit request, a paraphrase prompt, a neighborhood prompt, and a portability prompt. The portability prompts were handwritten or generated by ChatGPT; the rest comes from the CounterFact dataset. The slides note that because of model randomness, the original score (computed on the true target) may not be 1.0.

Three sub-questions, 1 point each:

1. Take the first 10 examples, edit with ROME, and report the efficacy, paraphrase, neighborhood, and portability scores (post).
2. Repeat with all 80. In the Colab, replace `requests = json.load(file)[0:10]` with the commented-out line below it.
3. Switch to **MEMIT** and report the four scores again.

The comparison: does ROME hold up when you go from 10 edits to 80, and how does MEMIT, designed for batch editing, compare?

## Two hints

1. The ROME paper gives an update formula for `upd_matrix`, and you'll also need an equation from its appendix. The slides say the answer is "simply the outer product of two vectors" and warn that GPT2-XL and GPT-J parameters are **transposed**.
2. To use another method, you're encouraged to read the [ROME](https://github.com/kmeng01/rome) and [MEMIT](https://github.com/kmeng01/memit) source code, especially `experiments/py/demo.py`.

<details>
<summary>Why ROME's update is an outer product (added by this post)</summary>

ROME treats one MLP weight matrix $W$ as a key–value memory: input key $k$ (the representation of the subject's last token), output value $v$. To make $W k^* = v^*$ while disturbing other keys as little as possible, the paper derives a rank-one update, which is a column vector times a row vector. In practice, Hugging Face's GPT-2 uses `Conv1D`, whose weight shape is the transpose of a regular `Linear`, which is why the slides include that warning. Defer to the ROME paper and repository for details.

</details>

## Submission rules

- Submit code and complete the quiz on NTU COOL. The quiz has no attempt limit; your last submission counts.
- GPT2-XL only.
- Don't share or copy prompts, code, or answers. A first violation multiplies your semester grade by 0.9 and zeroes this assignment; a second means an F for the semester.

Two spots in hw6.pdf show it was carried over from an older version. The two single-editing pages say "report them on Gradescope," while every other page and the course page say NTU COOL. And the contact address is `ntu-ml-2025-spring-ta@googlegroups.com`. This post goes with NTU COOL, as the course page and the rest of the slides say.

## What outside readers can't get

- **Quiz questions and answers**: the 16 paper questions and 10 experiment questions are only on COOL. I found no public copy.
- **Automatic grading**: the experiment questions ask for scores and judgments from your own runs, and there's no way to check them from outside.

**Practicing on your own** (this post's suggestion, not an official procedure): run the 5 single-editing prompts from the Colab and put the fine-tuning and ROME [Post-Edit] outputs side by side, checking whether the neighborhood prompt got changed by mistake. For multiple editing, build a table of the four scores for 10 vs. 80 edits and ROME vs. MEMIT. For the papers, quiz yourself: for each one, answer "which layer does it edit, how does it compute the update, and how does it evaluate locality?"

**Something to do tonight**: open the Colab and, without changing any code, use fine-tuning to single-edit a fact of your choice and record the outputs for all 5 prompts. Tomorrow, switch to ROME, rerun, and see which prompts come out differently.

## Further reading

- Forgetting when fine-tuning a whole capability: [HW5: Finetuning without Forgetting](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en)
- The same week's lecture, a different take on fixing a model's answers: [Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en)

Series navigation: Previous [Self-Correction: Can a Model Fix Its Own Mistakes?](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en) | Next [Self-Improving AI (Part 1)](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en) | [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)

## References

- [Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — HW6 release date, deadline, TAs, platform
- [ML 2026 Spring HW6: Model Editing (hw6.pdf)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw6.pdf) — taxonomy, question counts and points, experiment steps, hints, rules
- [HW6 Colab](https://colab.research.google.com/drive/1gnaowsSzOT3VSw8j_MIDnksQiaZeKikA?usp=sharing)
- [HW6 walkthrough video (YouTube)](https://youtu.be/AR1bNACLOAU)
- [Machine Learning in the Era of Generative AI (2025), Lecture 10: Micro-surgery for AI — Model Editing (in Chinese)](https://youtu.be/9HPsz7F0mJg), [edit.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2025-course-data/edit.pdf)
- [Locating and Editing Factual Associations in GPT (ROME, arXiv 2202.05262)](https://arxiv.org/abs/2202.05262)
- [Fast Model Editing at Scale (MEND, arXiv 2110.11309)](https://arxiv.org/abs/2110.11309)
- [Mass-Editing Memory in a Transformer (MEMIT, arXiv 2210.07229)](https://arxiv.org/abs/2210.07229)
- [WISE: Rethinking the Knowledge Memory for Lifelong Model Editing of Large Language Models (arXiv 2405.14768)](https://arxiv.org/abs/2405.14768)
- [kmeng01/rome (GitHub)](https://github.com/kmeng01/rome)
- [kmeng01/memit (GitHub)](https://github.com/kmeng01/memit)
