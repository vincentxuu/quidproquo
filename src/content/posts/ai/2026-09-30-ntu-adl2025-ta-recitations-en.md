---
title: "NTU ADL 2025 TA Recitations: From PyTorch and Hugging Face to LoRA, Quantization, and vLLM Deployment"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pytorch, hugging-face, lora, moe, quantization, vllm]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 18
tldr: "The ADL Fall 2025 course page schedules seven TA recitations: Dev Infra (PyTorch, debugging) → NLP project lifecycle → the underlying logic of NLP projects → LLM LoRA training → LLM basics, architecture, and MoE → LLM inference and evaluation → LLM deployment. All ten videos are older recordings by Yen-Ting Lin from 2023 and 2024, reused in Fall 2025. The course page's five slide links all return 404; files with the same names still open under the Fall 2024 path, and Deployment has a video only. The first three sessions walk through the Hugging Face data → model → demo loop that HW1 needs; the last four cover training, inference, and serving LLMs."
description: "A guide to the seven TA recitations of NTU Yun-Nung Chen's ADL Fall 2025 (114-1): ten recitation videos, five slide decks (same-name files on the f113 path), and two Colab notebooks. Covers Colab and PyTorch tensors, ipdb debugging, the NLP project lifecycle and train/validation/test splits, Hugging Face Trainer and Gradio, data formats for four NLP task types, LoRA and QLoRA, scaling laws and MoE routing, AWQ/GPTQ quantization, MMLU/MT-Bench/Chatbot Arena evaluation, and vLLM offline inference, tensor parallelism, and the OpenAI-compatible API."
draft: false
glossary:
  - term: "QLoRA"
    definition: "Quantize the frozen pretrained weights to 4-bit for storage, then train LoRA's low-rank matrices on top. The goal is to shrink the memory taken by the pretrained weights themselves."
    context: "Page 18 of the LoRA recitation slides names LoRA's limit (the pretrained weights still take a lot of memory); pages 21–27 then cover QLoRA."
  - term: "MoE"
    aliases: ["Mixture of Experts"]
    definition: "Replace a Transformer's feed-forward layer with several 'experts' and let a router pick only a few experts per token. Total parameters are large, but each token uses only a small share of them."
    context: "Pages 18–33 of the LLM Basics & MoE slides: dense vs MoE, shared experts, token dropping, load balancing, expert-choice routing, and Mixture-of-Depths."
  - term: "AWQ"
    aliases: ["Activation-aware Weight Quantization"]
    definition: "A post-training quantization method that picks scaling factors to minimize the error in activations after quantization, not just in the weights. It needs a small calibration set."
    context: "Pages 12–15 of the Inference & Eval slides, marked 'Data Dependent'; the same deck also covers GPTQ."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)

**Video status: Videos included.** [Source details](#course-video-sources)

> **This guide is based on ADL Fall 2025 (114-1, 2025/09/01–12/15).** It is post 18, the last one, in the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. The lecture posts only link to the recitations; the recitation content lives here.

The [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) splits each week into a Lecture column and a Recitation column. Lectures cover the ideas. Recitations cover how to actually get things running. Page 6 of the [Course Logistics slides](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) lists seven recitation topics: dev infra and tooling (Colab, GPU, PyTorch), the DL workflow, Hugging Face basics, LLM architecture, LLM evaluation, LLM training, and LLM inference.

This post answers one question: **the lectures teach the principles, so what hands-on skills do the recitations add?** You will come away knowing the order of the seven sessions, which tools each one teaches, which files still open, and how they line up in time with the three homework assignments.

**Sources**: the Recitation column of the course page, the ten recitation videos (YouTube titles and descriptions), five slide PDFs (same-name files on the Fall 2024 path), two TA Colab notebooks, and YouTube's auto-generated captions for the Deployment video. I opened and checked all of them on 2026-09-30. The lectures are taught in Mandarin; the slides mix Mandarin and English.

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=zuiACAhRUzA
title: ADL TA Recitation: PyTorch Tutorial (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=RYkEoCkJWeA
title: ADL TA Recitation: PyTorch Debugging (YouTube, in Mandarin)
```

Original videos: [ADL TA Recitation: PyTorch Tutorial (YouTube, in Mandarin)](https://www.youtube.com/watch?v=zuiACAhRUzA)、[ADL TA Recitation: PyTorch Debugging (YouTube, in Mandarin)](https://www.youtube.com/watch?v=RYkEoCkJWeA)、[ADL TA Recitation: NLP Project Lifecycle (YouTube, in Mandarin)](https://www.youtube.com/watch?v=anK1_PK464k)、[ADL TA Recitation: Underlying Logic of NLP Projects (YouTube, in Mandarin)](https://www.youtube.com/watch?v=255ZzsTTHoU)、[ADL TA Recitation: LLM LoRA Training (YouTube, in Mandarin)](https://www.youtube.com/watch?v=eGQMzbhokg0)、[ADL TA Recitation: LLM Basics (YouTube, in Mandarin)](https://www.youtube.com/watch?v=BBw-ki4_06o)、[ADL TA Recitation: Transformer Architecture (YouTube, in Mandarin)](https://www.youtube.com/watch?v=TzhCZOILzlI)、[ADL TA Recitation: Mixture-of-Experts (MoE) Architecture (YouTube, in Mandarin)](https://www.youtube.com/watch?v=AgZuF7lsu-8)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Transcript attempt (2026-10-10): the two embedded PyTorch recitation videos (Tutorial 17:45, Debugging 11:46) have no obtainable YouTube transcript, so their spoken content was not checked; what the article says about them comes from the TA Colab. Metadata confirmed: both were uploaded on 2023-09-07 with a description dated 2023/09/07 and "Lectured by Yen-Ting Lin", matching the article's "2023 Fall, taught by Yen-Ting Lin". The other recitation videos in the article, including the Deployment video summarized from auto-captions, are not embedded and were not rechecked this time.

## The big picture

| Week | Recitation | Videos (length) | Slides | Lectures that week |
|---|---|---|---|---|
| 9/01 | Dev Infra & Tooling | [PyTorch](https://youtu.be/zuiACAhRUzA) (17:45), [Debugging](https://youtu.be/RYkEoCkJWeA) (11:46) | None; a [Colab](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT) instead | Sequence Modeling |
| 9/08 | NLP Lifecycle | [Step by Step](https://youtu.be/anK1_PK464k) (36:10) | [w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf) (46 pages) + [Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ) | Attention, Transformer, Tokenization, BERT; HW1 released |
| 9/15 | Underlying Logics of Projects | [Step by Step](https://youtu.be/255ZzsTTHoU) (24:00) | [w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf) (43 pages) | Pretraining & Prompt Learning |
| 9/22 | LLM LoRA Training | [LoRA](https://youtu.be/eGQMzbhokg0) (18:15) | [w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf) (30 pages) | Post-Training, LLM Adaptation; HW2 released |
| 10/13 | LLM Basics & MoE | [Basics](https://youtu.be/BBw-ki4_06o) (20:16), [Architecture](https://youtu.be/TzhCZOILzlI) (11:15), [MoE](https://youtu.be/AgZuF7lsu-8) (23:17) | [w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf) (33 pages) | RAG; HW3 released |
| 10/27 | LLM Inference & Evaluation | [Infer & Eval](https://youtu.be/mulWMLla-AM) (17:00) | [w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf) (37 pages) | NLG Decoding, NLG Evaluation |
| 11/03 | LLM Deployment | [Deployment](https://youtu.be/4JPJkLxW84w) (22:34) | None | Issues in Pre-Trained Models; final project announced |

Two notes on ordering:

- The week numbers in the file names (w2–w6) come from an older term. Fall 2025 puts LoRA (w5) on 9/22, ahead of LLM Basics & MoE (w4) on 10/13. This post follows the Fall 2025 course page.
- 9/29 and 10/06 were holidays (Teacher's Day and Mid-Autumn Festival), and 10/20 was the midterm break, so those weeks had no recitation. The schedule lists no recitations after 11/10.

## Before you start: the videos and slides come from older terms

This is the most important context for the whole track. Every one of the ten video descriptions says "Lectured by Yen-Ting Lin 林彥廷 @ NTU CSIE", and the recording dates fall into two batches:

- **Fall 2023**: PyTorch and Debugging (2023/09/07), NLP Lifecycle (2023/09/21), Underlying Logic (2023/10/05), LoRA (2023/11/16), Inference & Evaluation (2023/11/30)
- **Fall 2024**: LLM Basics, Architecture, MoE (2024/10/09), and Deployment (2024/12/04)

The slides match. The w2 cover says "ADL 2023 Fall - Recitation 2", the w4 cover says "Sep 30, 2024", and the w5 and w6 covers are dated November 16 and 30, 2023. Fall 2025 reused these materials without re-recording.

That has two practical consequences. First, any homework mentioned in the slides is that year's homework. Page 4 of w5 says "Homework 3 Instruction tuning", which is the 2023 HW3, not the Fall 2025 HW3 (RAG). Second, the library versions in the demos date from 2023–2024, so expect to fix some API calls if you run them. The sections below point out where.

## 1. Dev Infra & Tooling: Colab, tensors, and ipdb (9/01)

This session has no slides. The material is a 30-cell [Colab notebook](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT) titled "Recitation on Development Infrastructure and PyTorch Tutorial", in four parts:

1. **Google Colab basics**: mount Google Drive, list your Drive files, check the PyTorch version.
2. **The GPU environment in Colab**: confirm you have a GPU with `torch.cuda.is_available()`.
3. **Intro to PyTorch**: 1D tensors (`arange`, `rand`, `randn`, `ones`, `zeros`, from a list, `clone`), `requires_grad` and `torch.no_grad()`, shapes of multi-dimensional tensors, and conversion to and from NumPy.
4. **Python debugging tools**: mostly ipdb.

The debugging section sorts errors bluntly: send syntax errors to ChatGPT, use ipdb for runtime and tensor errors, and leave GPU errors for the next recitation. The notebook explains six ipdb commands in Mandarin (`n`, `c`, `q`, `p`, `l`, `s`) plus a few usage patterns: `python -m ipdb -c continue`, a conditional `ipdb.set_trace()`, and `ipdb.launch_ipdb_on_exception()`. It ends with a `SimpleMLP` regression example to practice on.

Treat that example as a debugging exercise. The model output has shape `(batch, 1)` while the label `y` has shape `(batch,)`. Set a breakpoint before `loss = criterion(outputs, batch_y)` and run `p outputs.shape` to compare the two. That is exactly the kind of tensor error the session wants you to catch.

The two videos are [PyTorch Tutorial](https://youtu.be/zuiACAhRUzA) and [PyTorch Debugging](https://youtu.be/RYkEoCkJWeA). If you have never written PyTorch, do this session before or alongside [post 2: neural networks and backpropagation](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en).

## 2. The life of an NLP project: data → model → demo (9/08)

[w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf) opens with two goals: the workflow from data through model development to a demo, and the common tools and libraries. The whole deck keeps returning to a three-box diagram: data → model → demo.

**Data** has three steps: collection, cleaning and validation, and labeling. The listed collection sources are web crawling, customer data, self-generated data, and GPT-4.

**Model** starts from "what can NLP do?" and narrows tasks down to a few shapes:

- Classify a whole sentence: sentiment analysis, spam detection, intent detection
- Classify each word: part-of-speech tags, named entities
- Generate text: auto-replies, fill in the blank
- Extract an answer from text: given a question and a context, find the answer span

**Splitting the data** (pages 31–38) is the page worth remembering. You may look at the training set. You may not look at the validation set; it checks the model during training. You must never look at the test set; it is only for evaluation after training. The training set is the largest, and validation and test sets are each about 10–30%.

The hands-on part uses intent-classification data from an old assignment (the slides link to `data/intent` from the 2021 ADL HW1 on GitHub) and only does whole-sentence classification. For tools, the slides say to use Hugging Face for everything, with Gradio for the demo; the example site is [twllm.com](http://twllm.com).

The companion [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ) (68 cells) adapts Hugging Face's "Fine-tuning a model on a text classification task" example:

1. Load data with `load_dataset("yentinglin/ntu_adl_recitation")`, rename the `intent` column to `label`, and encode it as classes
2. Preprocess with the `distilbert-base-uncased` `AutoTokenizer`, applied to every split via `dataset.map(..., batched=True)`
3. Train `AutoModelForSequenceClassification` with `Trainer`: learning rate 2e-5, 5 epochs, evaluation every epoch, best model picked by accuracy
4. Upload with `trainer.push_to_hub()`; the last cell is a Gradio demo template

The notebook targets older library versions, so a few spots may need changes today: `load_metric` in `datasets` (newer setups use the separate `evaluate` library) and `evaluation_strategy` in `TrainingArguments` (renamed `eval_strategy` in newer releases). The final Gradio cell is only a template. The model name literally reads "你的模型" ("your model"), `fn=...` is left for you to fill in, and the `pipeline` task needs to match your own task.

## 3. The underlying logic of NLP projects: data prep for four task types (9/15)

The cover of [w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf) calls it the third hands-on session of Applied Deep Learning. Its goals are to prepare data, train, and predict for four task types, using the Hugging Face ecosystem. The previous session only did sentence classification; this one fills in the rest:

| Task | Slide pages | Focus |
|---|---|---|
| Sentence classification | Recap | Last session's approach |
| Token classification | 10–25 | Find data on [Hugging Face Datasets](https://huggingface.co/datasets), read the per-token label fields, train, build a Gradio demo |
| Text generation (summarization) | 33–36 | Data format and training |
| Extractive QA | 38–42 | Data format and training |

Most of the "how do we train?" pages are code screenshots with no extractable text, so the details are in the [video](https://youtu.be/255ZzsTTHoU).

The extractive QA part is especially useful for Fall 2025 readers. The span selection step in [HW1: Chinese extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) has exactly this task shape. Watch this session before you read the HW1 spec.

## 4. LLM LoRA Training: tuning a model that is too big (9/22)

[w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf) draws LLM development in three stages (pretraining → instruction tuning → learning from feedback) and places LoRA/QLoRA in the instruction-tuning stage. The deck follows a memory storyline:

1. **Can you even run it?** Pages 5–6 point to the Hugging Face Space "Can it run LLM" to estimate how much memory a model needs.
2. **Why low rank is enough**: language models have low intrinsic dimensionality, which is why they fine-tune well on little data. Two pages then review matrix rank.
3. **LoRA itself**: the original weight W is d×d; add two matrices A (d×r) and B (r×d), with r usually between 1 and 32. The listed benefits: less memory, no gradients for the pretrained weights, and plug-and-play LoRA weights.
4. **Choices**: which weight matrices to adapt, what rank to use, and how LoRA compares with other PEFT methods on GPT-3, all taken from the LoRA paper.
5. **LoRA's limit**: the pretrained weights still take a lot of memory.
6. **QLoRA**: floating-point formats (including FP8) first, then how QLoRA quantizes the frozen weights and trains LoRA on top.

After the last page, "How to use (Q)Lora?", the hands-on demo is not in the PDF. Watch the [video](https://youtu.be/eGQMzbhokg0).

In timing, this session shares a week with the LLM Adaptation lecture (7.5) and the HW2 release. The Fall 2025 HW2 topic is "LLM Tuning and Prompt Tuning for Classical Chinese Translation", but the spec is not public, so we cannot confirm that this session is the HW2 recipe. For the lecture side of LoRA, see [post 10: PEFT + HW2](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2-en).

## 5. LLM basics, Transformer architecture, and MoE (10/13)

[w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf) pairs with three videos and has three parts.

**LLM Basics** ([video](https://youtu.be/BBw-ki4_06o), pages 2–14) is about scale: scaling laws, emergent abilities ("an ability is emergent if it is not present in smaller models but is present in larger models"), and the compute estimate "training FLOPs ≈ 6 × model size × number of tokens", with Taiwan-LLM and GPT-4 as examples. Next comes the Chinchilla question: with a fixed compute budget, how should you split it between model size and training tokens? Figures from the Llama 3 paper then raise whether pretraining loss predicts downstream performance.

**Transformer Architecture** ([video](https://youtu.be/TzhCZOILzlI), pages 15–16) is a single checklist: RMSNorm, rotary positional encoding, KV-cache, grouped-query attention, SwiGLU. Next to "Vanilla Transformers vs LLaMA" the slide says to watch the previous year's recitation video, so the details live in the videos.

**MoE** ([video](https://youtu.be/AgZuF7lsu-8), pages 17–33) takes up most of the deck:

- A table of open-weight MoE models (Mixtral, Grok-1, DBRX, Arctic) and a dense-vs-MoE comparison
- Shared experts (from DeepSeekMoE) and MoE in the attention layer (from JetMoE)
- Token-choice routing: when too many tokens pick one expert, some get dropped (token dropping), which is why a load-balancing loss is needed (from Switch Transformers; page 27 has a worked example)
- Problems with token-choice routing: load imbalance, an unstable balancing loss, and every token getting the same compute
- Two responses: expert-choice routing, and Mixture-of-Depths, which lets tokens skip layers

## 6. LLM Inference & Evaluation: quantization and three kinds of evaluation (10/27)

The first half of [w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf) covers inference speedups; the second half covers evaluation.

The speedup outline lists five items: quantization, AWQ, GPTQ, PagedAttention, and FlashAttention. Only quantization gets expanded; the last two appear only on the outline page.

- Post-training quantization has two paths: AWQ and GPTQ on GPU, GGUF/GGML on CPU.
- Pages 7–11 work through quantizing to 2 bits by hand to contrast round-to-nearest with scaling before quantizing.
- **AWQ**: pick the scaling factor that minimizes activation error; it needs calibration data.
- **GPTQ**: compress layer by layer, minimizing each layer's reconstruction loss; it also needs data.

Evaluation comes in three kinds:

| Kind | Examples in the slides |
|---|---|
| Traditional benchmarks | MMLU, TruthfulQA |
| Model as judge | MT-Bench, AlpacaEval |
| Human evaluation | Chatbot Arena |

The same week's lectures cover NLG metrics (BLEU, ROUGE, perplexity, LLM-Eval); see [post 12: NLG decoding and evaluation](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en). Read together, one side asks whether a generated sentence is good, and the other asks how capable the whole model is.

## 7. LLM Deployment: serving a model with vLLM (11/03)

This session has no slides, only the video [LLM Deployment](https://youtu.be/4JPJkLxW84w). The summary below comes from YouTube's auto-generated Mandarin captions, which contain recognition errors, so I only keep the main thread.

The video uses [vLLM](https://github.com/vllm-project/vllm) to deploy Llama 3 at 8B and 70B on two 80GB H100s. One card is plenty for 8B. At BF16, 70B needs 2 bytes per parameter and exceeds one card, so it serves as the parallelism demo. In order:

1. **Install and parameters**: on a recent NVIDIA GPU, installation is straightforward. The speaker only tunes three things: `dtype` (older cards without BF16 need FP16, the first common pitfall), `enforce_eager` (turning off CUDA Graph saves some memory at some speed cost), and quantization. His advice: when memory runs short, quantize to FP8 or AWQ instead of fiddling with many parameters.
2. **Offline vs online**: offline means batch inference where all prompts are known in advance, common in research and data processing, with higher overall throughput. Online means something like twllm.com, where you don't know when a user will arrive or what they will type.
3. **Sampling pitfalls**: the default `max_tokens` is small, so always raise it. Temperature, top-p, top-k, and min-p are also available.
4. **Check the output first**: run one or two prompts offline and confirm the output makes sense. Otherwise a wrong tokenizer, model, or float type can quietly hurt results.
5. **Multiple GPUs**: inference usually uses tensor parallelism (splitting matrices across cards and merging results via communication). Pipeline parallelism is usually reserved for multi-node setups when one machine is not enough. As a user, you just set the tensor parallel size to your GPU count.
6. **Online serving**: start a server with `vllm serve`. A web server in front accepts HTTP requests; the LLM engine sits behind it. Clients keep using the OpenAI library and only change the API base to your own address, which is what an OpenAI-compatible API means. The speaker also notes that online serving trades off latency against throughput.

This session does not map to a homework. It is more like the last mile you need for the final project and for real work.

## How recitations line up with homework

The course page does not say which recitation supports which assignment. The TA table only lists duties: two TAs for HW1/HW2, two for HW3, and two for the final project. The table below lines them up by week. It is a timing alignment, not an official mapping:

| Assignment | Release week | Recitations in or before that week | Public material |
|---|---|---|---|
| HW1 Chinese extractive QA | 9/08 | Dev Infra, NLP Lifecycle; the following week's Underlying Logic covers extractive QA data | Full spec |
| HW2 LLM tuning + prompt tuning (Classical Chinese translation) | 9/22 | LLM LoRA Training | Intro video only |
| HW3 Retriever & Reranker Training for RAG | 10/13 | LLM Basics & MoE | Intro video only |
| Final project (Jailbreaking Olympics) | 11/03 | LLM Deployment | Intro video only |

## Access and gaps

The series as a whole is graded A2 (per the definition in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): materials partially open). On the recitation track alone, the videos and Colabs are complete, but the slides need a detour:

1. **All five slide links on the course page return 404.** The course page points to paths such as `f114-adl/doc/w2-ProjLife.pdf`, and all returned 404 on 2026-09-30. This post cites the same-name files under the Fall 2024 path (`f113-adl/doc/`); all five open.
2. **Deployment has no slides**, only the video.
3. **Dev Infra has no slides**, only the Colab.
4. **The videos and slides are 2023–2024 versions**, so the homework numbers and contents they mention belong to those years.
5. Most code in the slides is screenshots; watch the videos alongside.

## How to use this post

- **Never written PyTorch**: run the Dev Infra Colab first, then read [post 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) and [post 2](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en).
- **Getting ready for HW1**: after [post 6 on BERT](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en), watch NLP Lifecycle and Underlying Logic in that order, then move to [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en).
- **Only want LLM engineering**: jump to the last four sessions. You can reorder them as Basics & MoE → LoRA → Inference & Eval → Deployment, which matches the older w4→w5→w6 file order.

One thing to do tonight: open the [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ), change `evaluation_strategy` to `eval_strategy`, replace `load_metric` with `evaluate.load`, and run through `trainer.train()`. If it finishes, your environment is ready for HW1.

## Further reading

- [CMU 11-868 LLM Systems guide](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en): takes the topics of the last four sessions (LoRA, quantization, MoE, serving) down to the systems level. See the units on [PEFT and LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora-en), [model quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en), [model parallelism and MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en), and [SGLang and vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en).
- [Stanford CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en): building a language model from scratch; its [attention variants and MoE](/posts/ai/2026-08-22-cs336-attention-moe-en) and [inference](/posts/ai/2026-08-22-cs336-inference-en) posts overlap with sessions 5 and 7.
- [CS224N: Tinker and LoRA](/posts/ai/2026-08-22-cs224n-tinker-lora-en): LoRA in practice from another course.

---

Previous: [Post 17: beyond supervised learning and multimodality](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en)
Series overview: [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Tried to check the two PyTorch recitation videos against transcripts, but neither has one, so the content was not checked; recording date and lecturer were confirmed to match the article.

## References

- [ADL Fall 2025 (114-1) course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — Recitation column and TA duty table
- [Course Logistics slides (250901_Course.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — page 6, recitation scope
- [TA Colab: Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)
- [TA Colab: NLP Lifecycle (text classification fine-tuning)](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [w2-ProjLife.pdf: the life of an NLP project (same-name file on the Fall 2024 path, in Mandarin)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [w3-UnderlyLogic.pdf: the underlying logic of NLP projects (same-name file on the Fall 2024 path, in Mandarin)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf)
- [w4-LLMBasicsMOE.pdf: LLM Basics and MoE Architecture (same-name file on the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf)
- [w5-LoRA.pdf: LLM LoRA Training (same-name file on the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)
- [w6-LLMInferenceEval.pdf: LLM Inference and Eval (same-name file on the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf)
- [ADL TA Recitation: PyTorch Tutorial (YouTube, in Mandarin)](https://youtu.be/zuiACAhRUzA)
- [ADL TA Recitation: PyTorch Debugging (YouTube, in Mandarin)](https://youtu.be/RYkEoCkJWeA)
- [ADL TA Recitation: NLP Project Lifecycle (YouTube, in Mandarin)](https://youtu.be/anK1_PK464k)
- [ADL TA Recitation: Underlying Logic of NLP Projects (YouTube, in Mandarin)](https://youtu.be/255ZzsTTHoU)
- [ADL TA Recitation: LLM LoRA Training (YouTube, in Mandarin)](https://youtu.be/eGQMzbhokg0)
- [ADL TA Recitation: LLM Basics (YouTube, in Mandarin)](https://youtu.be/BBw-ki4_06o)
- [ADL TA Recitation: Transformer Architecture (YouTube, in Mandarin)](https://youtu.be/TzhCZOILzlI)
- [ADL TA Recitation: Mixture-of-Experts (MoE) Architecture (YouTube, in Mandarin)](https://youtu.be/AgZuF7lsu-8)
- [ADL TA Recitation: LLM Inference & Evaluation (YouTube, in Mandarin)](https://youtu.be/mulWMLla-AM)
- [ADL TA Recitation: LLM Deployment (YouTube, in Mandarin)](https://youtu.be/4JPJkLxW84w)
- [vLLM (GitHub)](https://github.com/vllm-project/vllm)
- [Hu et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Dettmers et al. (2023). QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314)
