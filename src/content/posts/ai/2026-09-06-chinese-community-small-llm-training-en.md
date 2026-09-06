---
title: "Training Small LLMs From Scratch in the Chinese Community: Corpus, Tokenizers, and Three Open-Source Projects"
date: 2026-09-06
category: ai
type: deep-dive
tags: [llm, training, open-source, pre-training, sft, tokenizer, chinese-nlp]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 3
tldr: "A close look at three open-source projects training LLMs from scratch in the Chinese community — baby-llama2-chinese (218M, 63.4B tokens), ChatLM-mini-Chinese (0.2B T5, 10.23M dialogues), and Steel-LLM (1.12B, 1T tokens, 8 months) — comparing corpus strategy, tokenizer decisions, and community ecosystem. Honest evaluation included: baby-llama2 scored a bottom-ranking 21 in MiniMind's side-by-side test; ChatLM has the strongest knowledge (62) but weak coding."
description: "The Chinese open-source route to training small LLMs from scratch: how baby-llama2-chinese, ChatLM-mini-Chinese, and Steel-LLM differ in design, corpus and tokenizer tradeoffs, and what honest benchmarks say."
draft: false
---

> [中文版](/posts/ai/2026-09-06-chinese-community-small-llm-training)

The previous post covered [Karpathy's nanochat](/en/posts/ai/2026-09-06-karpathy-nanochat-nanogpt-llm-c-en), representing the English-speaking world's from-scratch route; this one looks at the Chinese community. I picked three projects with complementary positioning: [baby-llama2-chinese](https://github.com/DLLXW/baby-llama2-chinese) (a textbook Llama2 reproduction), [ChatLM-mini-Chinese](https://github.com/charent/ChatLM-mini-Chinese) (the lowest resource floor), and [Steel-LLM](https://github.com/zhanshijinwat/Steel-LLM) (a complete personal record of forging a 1B model).

A bias note first: this series focuses on star GitHub projects from the English- and Chinese-speaking communities; the only retired cases discussed are research-purpose Pythia / TinyLlama; non-English non-Chinese communities (such as Japan's LLM-jp) and non-Transformer architectures (RWKV / Mamba families) are out of scope.

## What makes Chinese from-scratch training different

Architecture is not the hard part — all three projects use off-the-shelf designs (Llama2, [T5](https://arxiv.org/abs/1910.10683), Qwen1.5). The real differences are in three places:

**The tokenizer is the first decision**. [Llama](https://github.com/meta-llama/llama3)'s native vocabulary has only 700 Chinese tokens — use it as-is and the model's Chinese ability is barely functional. So every Chinese-community project starts with a vocab decision, and these three give three different answers:

- **baby-llama2 borrows the [ChatGLM2-6B](https://github.com/THUDM/ChatGLM2-6B) tokenizer** (64,793 entries). The README points out this number fits exactly in uint16 range, so each token needs only 2 bytes, halving corpus storage.
- **ChatLM trained its own tiny 29,298-entry vocab**, Chinese plus a little English.
- **Steel-LLM skipped training one entirely** and inherited [Qwen1.5](https://github.com/QwenLM/Qwen1.5)'s tokenizer.

Compare [MiniMind](https://github.com/jingyaogong/minimind)'s self-trained 6,400-entry vocab: the spectrum runs from "minimalist" to "inherit everything", mapping to different parameter budgets and ecosystem strategies.

**Chinese pretraining corpora must be assembled by hand**. The English world has ready-made corpora like FineWeb and Dolma; Chinese options are far fewer, so projects stitch together Chinese Wikipedia, Baidu Baike, C4_zh, BAAI's [WuDaoCorpora](https://data.baai.ac.cn/details/WuDaoCorporaText), and Zhihu Q&A, with cleaning pipelines hand-rolled too (baby-llama2 uses Minhash / Simhash dedup; Steel-LLM uses [data-juicer](https://github.com/modelscope/data-juicer)). Dialogue data leans heavily on GPT-distilled sets like [BELLE](https://github.com/LianjiaTech/BELLE) and alpaca-zh.

## Three projects, three bets: baby-llama2-chinese, ChatLM-mini-Chinese, Steel-LLM

| Project | Architecture | Params | Corpus | Tokenizer strategy |
|---|---|---|---|---|
| [baby-llama2-chinese](https://github.com/DLLXW/baby-llama2-chinese) | Llama2 | 92M / 218M | 63.4B tokens (wiki, Baike, C4_zh, WuDao) | Borrow ChatGLM2 (64,793) |
| [ChatLM-mini-Chinese](https://github.com/charent/ChatLM-mini-Chinese) | T5 Seq2Seq | 0.2B | 10.23M dialogues | Self-trained (29,298) |
| [Steel-LLM](https://github.com/zhanshijinwat/Steel-LLM) | Qwen1.5 modified | 1.12B | 1T tokens | Inherited from Qwen1.5 |

**baby-llama2-chinese** takes the most orthodox path: pretrain from scratch + SFT, runnable on a single 24GB card. Its value is corpus engineering laid bare — a curated list of Chinese pretraining corpora, the cleaned 63.4B-token corpus released for download, dedup benchmarks (Baidu Baike's 5.63M rows reduced to 2.73M by Minhash), and controlled experiments comparing model size (92M vs 218M) and vocab size on the same corpus. The stated goal is a 500M–1B vertical-domain model; it currently lands as a 218M medical chat model. Reward modeling and RL are marked "to-do" in the README and were never filled in.

**ChatLM-mini-Chinese** bets on the lowest resource floor: a 0.2B T5 encoder-decoder (10 layers each side) that pretrains on 16GB RAM + 4GB VRAM and runs fp16 inference in 512MB. The pretraining data is all public single-turn dialogue — webtext2019zh community Q&A (2.6M after cleaning), Baike Q&A, medical dialogue, Zhihu, BELLE, and Wikipedia entries, 10.23M items total. It is the only encoder-decoder project of the three, and it completed the full chain: SFT (2 days) and DPO (3 hours), plus a downstream triplet information-extraction fine-tuning example. The author honestly notes that with only ~9M pretraining samples, the model will sometimes answer off-topic or produce filler.

**Steel-LLM** bet on scale: one person pretraining a 1.12B model on 1T tokens, 8 months from March to August 2024, finishing on 8×H800. It modified Qwen1.5 in two places — softmax MoE in the FFN layer, double-layer SwiGLU — and built its training loop from TinyLlama's. Its most valuable output is the process itself: data collection and cleaning, framework modifications, and training curves all documented as long Zhihu and WeChat posts, later consolidated into a technical report ([arXiv:2502.06635](https://arxiv.org/abs/2502.06635)) accepted at an ICLR 2025 workshop.

## Honest evaluation

[MiniMind](https://github.com/jingyaogong/minimind)'s README (see [the series' first deep dive](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en)) ran a side-by-side comparison involving two of these projects, and the results pull no punches:

- **baby-llama2-chinese ranked last in the subjective test**. MiniMind's author fed four small models' answers to GPT-5.4 as judge (100-point scale): minimind-3-moe scored 68, ChatLM-mini 62, minimind-3 61, and baby-llama2-chinese 21. On the Yangtze River question it answered "China is one of the longest cities in the world", and its code answer was entirely non-functional. To be fair, this is a small-sample subjective test — but baby-llama2's own README shows continuation samples (a "Little Prince" prompt) that likewise reveal weak basic language ability.
- **ChatLM-mini has solid knowledge but weak code**. It scored highest on factual accuracy in that round (25/30 on the accuracy dimension): gravity correctly attributed to Newton with the 1687 *Principia* cited, the Yangtze's source and provinces all correct. But code scored 3/20 — an inverted conditional made the function unusable — and it refused the summarization task outright.
- **Objective scores need discounting**. Steel-LLM self-reports C-Eval 41.9 and C-MMLU 36, but MiniMind re-evaluated the same model with [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) and got 24.9 on C-Eval — a 17-point gap on the same model purely from evaluation setup. Nobody is faking anything; small-model evaluation is extremely sensitive to format and scoring method. MiniMind's README also warns that models of this size hover near random-chance levels on multiple-choice benchmarks.

## Low maintenance frequency is not failure

The maintenance status: ChatLM's last update was January 2024; Steel-LLM went quiet after a March 2025 RL blog post; baby-llama2 stalled from May 2024 for nearly two years before August 2026, when it fixed pretraining sampler and gradient-accumulation bugs and added a unified `infer.py` entry point. Judged by activity, all three count as semi-retired.

But this route was never about products. All three projects were positioned from day one as teaching and reproduction material: codebases small enough to read end to end, per-stage data sources and cleaning scripts, and training costs within personal budgets. The models themselves are unusable for real tasks — their READMEs all admit it — and their value is exposing every decision in how an LLM gets built. Maintenance stopping does not make the textbook invalid; the fact that baby-llama2 could still be patched for modern PyTorch in 2026 shows people still enter the field through it. By contrast, [MiniMind](https://github.com/jingyaogong/minimind) is the exception that kept iterating, from v1 all the way to Agentic RL — maintenance frequency is a function of project goals, not quality.

## Overall

The first bottleneck in Chinese from-scratch training was never architecture — it was corpus and tokenizer: corpora you assemble and clean yourself, a vocab choice between training small and inheriting large, and an ecosystem built on Baidu Netdisk, Zhihu, and ModelScope. For the smallest-resource full pipeline, ChatLM's 4GB VRAM floor is the easiest entry; for corpus engineering, read baby-llama2; for how one person forges a 1B model, Steel-LLM's write-ups are the most complete record available. If data efficiency itself is your research question, the next post on [YuLan-Mini](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en) pushes "train stronger with less data" much further; and whether you should train from scratch at all is the question the [series finale](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en) answers.

## References

- [baby-llama2-chinese GitHub](https://github.com/DLLXW/baby-llama2-chinese)
- [ChatLM-mini-Chinese GitHub](https://github.com/charent/ChatLM-mini-Chinese)
- [Steel-LLM GitHub](https://github.com/zhanshijinwat/Steel-LLM)
- [Steel-LLM: From Scratch to Open Source (arXiv:2502.06635)](https://arxiv.org/abs/2502.06635)
- [T5: Exploring the Limits of Transfer Learning (arXiv:1910.10683)](https://arxiv.org/abs/1910.10683)
- [ChatGLM2-6B GitHub](https://github.com/THUDM/ChatGLM2-6B)
- [BELLE GitHub](https://github.com/LianjiaTech/BELLE)
- [MiniMind GitHub](https://github.com/jingyaogong/minimind)
- [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)
- [On this site: MiniMind: Train an LLM From Scratch for $0.40](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en)
