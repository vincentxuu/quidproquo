---
title: "How to Spend Every Parameter: OpenELM's Layer-wise Scaling and MiniCPM's Three-stage Unfreezing"
date: 2026-09-06
category: ai
type: deep-dive
tags: [openelm, minicpm, llm, pre-training, multimodal, edge-ai, open-source]
lang: en
series:
  name: "從零訓練一個 LLM"
  order: 8
tldr: "OpenELM uses layer-wise scaling to shift parameters toward layers near the output; with 1.08B parameters and 1.5T tokens it beats OLMo 1.2B (+2.36% on the LLM360 average) despite OLMo training on 3T tokens. MiniCPM trains multimodal small models from scratch with a three-stage unfreezing recipe (Resampler first, vision encoder next, everything unfrozen last); MiniCPM-V 4.5 reaches sub-30B SOTA on VideoMME with only 8B parameters, and 4-bit quantization squeezes fp16's 16–17GB memory footprint down to about 5GB for phones."
description: "Series order 8: OpenELM's non-uniform parameter allocation and Apple's license terms, MiniCPM's three-stage unfreezing multimodal pre-training, and the quantization trade-offs of edge deployment."
draft: false
---

> [中文版](/posts/ai/2026-09-06-efficient-edge-llm-training)

The projects covered so far in this series each pushed one dimension to its limit: [YuLan-Mini](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en) economized on data, [OLMo 3 and LLM360](/en/posts/ai/2026-09-06-olmo3-llm360-fully-open-pretraining-en) on opacity, [Apertus and LLM-jp](/en/posts/ai/2026-09-06-national-multilingual-llm-training-en) on sovereignty. The two projects in this piece ask a different question: **can a fixed parameter budget be spent more precisely?** Apple's [OpenELM](https://huggingface.co/apple/OpenELM) gives each layer a different share of parameters via layer-wise scaling, and its 1.08B model beats [OLMo](/en/posts/ai/2026-08-26-olmo-allen-ai-fully-open-llm-en) on the LLM360 average while training on half the tokens; Tsinghua's [MiniCPM](https://github.com/OpenBMB/MiniCPM) extends the same question to multimodality — training a GPT-4V-class model that runs on a phone.

## Efficiency as a fourth motivation

In the series intro's [coverage matrix](/en/posts/ai/2026-09-06-train-llm-from-scratch-series-intro-en), "efficiency / edge / multimodal" is its own row, because the goal differs from the other routes:

- **Data efficiency** (YuLan-Mini) asks: can we feed less data without losing accuracy? The answer lives in data quality.
- **The performance ceiling** ([SmolLM3](https://huggingface.co/HuggingFaceTB/SmolLM3-3B), 3B trained on 11.2T tokens) asks: how high can a small model go? The answer: pile on data.
- **Architectural efficiency** (OpenELM, MiniCPM) asks: with a fixed parameter budget, what allocation is right? The answer: change the architecture and the training order.

Edge scenarios push this to the extreme: a phone's memory is a hard cap, and every million parameters converts directly into cost. That is why the two projects, despite different roles — OpenELM runs text-only architecture experiments, MiniCPM builds multimodal products — share one core idea: don't shrink a big model; **design a model that is maximally accurate within the budget, from scratch**.

## OpenELM: non-uniform allocation via layer-wise scaling

A standard transformer is isotropic: every layer uses the same head count and FFN width, so parameters are spread evenly. The [OpenELM paper](https://arxiv.org/abs/2404.14619) (arXiv:2404.14619) argues this allocation is not optimal — layers near the input handle simpler representations and don't need to be that wide. OpenELM introduces two hyperparameters: α scales the attention head count per layer and β scales the FFN multiplier per layer, both linearly interpolated from the first layer to the last, so the model is **narrow near the input and wide near the output**.

Attribution first: layer-wise scaling is not OpenELM's invention — the paper itself traces it to block-wise scaling research in computer vision models. OpenELM's increments are two: proving it works for **pre-training language models from scratch**, and open-sourcing the entire training system. The numbers carry the argument: OpenELM-1.08B averages 51.68 on the LLM360 task suite, 2.36% above OLMo-1.18B trained on 3.0T tokens, using only 1.5T tokens — exactly half.

Several recipe details are worth stealing:

- **A pre-training pool of about 1.8T tokens**, mixed from RefinedWeb (665B), deduplicated PILE (207B), subsets of RedPajama and Dolma v1.6, and C4 (175B); the paper's comparison tables list the actual training usage as 1.5T tokens.
- **On-the-fly tokenization and filtering**: no pre-tokenized corpus — data is filtered as it loads, and sequences under 200 characters or 256 tokens are skipped. This makes tokenizer experiments cheap because the dataset doesn't need re-tokenizing.
- **Checkpoint averaging**: the last five checkpoints (one every 5k iterations) are weight-averaged, and the official evaluation uses that averaged checkpoint — slightly more stable than the single final checkpoint.
- Training ran on Apple's [CoreNet](https://github.com/apple/corenet) framework (formerly CVNets, originally a computer-vision training library), 350k iterations, AdamW, cosine learning rate decayed to 10% of the peak.

The release includes training logs, multiple intermediate checkpoints, training configurations, and [MLX](https://github.com/ml-explore/mlx) conversion code for Apple Silicon inference — four sizes (270M/450M/1.1B/3B), each with an Instruct variant, instruction-tuned on just 60k [UltraFeedback](https://huggingface.co/datasets/HuggingFaceH4/ultrafeedback_binarized) prompts for a 1–2% average gain.

## Apple's license: not the same tier as Apache 2.0

OpenELM's weights and code ship under [Apple's own Sample Code License](https://huggingface.co/apple/OpenELM) (tagged `apple-amlr` on Hugging Face), not Apache 2.0. OLMo, LLM360 K2, and MiniCPM in this series are all Apache 2.0 — building products, redistributing, and commercializing carry clearly defined obligations. Apple's license permits research and use, but the terms are a different document: **read the LICENSE line by line before shipping or redistributing anything**, and don't assume Apache 2.0 treatment. The model card also states plainly: the models are trained on public data with no safety guarantees, and outputs may be inaccurate, harmful, or biased.

## MiniCPM: three-stage unfreezing, from text to multimodal

[MiniCPM](https://github.com/OpenBMB/MiniCPM) is OpenBMB's end-side model series (THUNLP and Modelbest), on a "strongest per size" path since MiniCPM-2B in 2024. The [MiniCPM-V paper](https://arxiv.org/abs/2408.01800) (arXiv:2408.01800) lays out the recipe that makes it work: **three-stage unfreezing pre-training**.

Take [MiniCPM-V 4.5](https://arxiv.org/abs/2509.18154) (arXiv:2509.18154, 8B): pre-training runs in three stages, each unfreezing different modules:

1. **Stage 1**: train only the 2D-Resampler (the bridge that compresses visual features into the language space), with the vision encoder and LLM fully frozen. Image-caption data establishes an initial cross-modal alignment.
2. **Stage 2**: unfreeze the vision encoder to build the perceptual foundation; the LLM stays frozen — data crawled at this stage is not good enough for the LLM to learn language from.
3. **Stage 3**: switch to the highest-quality data mix (text-only corpora, interleaved image-text, video) and train everything end-to-end, LLM included.

The logic of this order: **the bottleneck of a multimodal model is the bridge, not the LLM**. Train the visual-to-language mapping first, then let the LLM participate — keeping low-quality crawled data from polluting the language capability. MiniCPM-V 4.5 compresses video tokens up to 96× with a unified 3D-Resampler; on VideoMME it reaches sub-30B SOTA using 46.7% of Qwen2.5-VL 7B's GPU memory and 8.7% of its inference time, with an OpenCompass average of 77.0 that officially surpasses GPT-4o-latest and the 72B Qwen2.5-VL.

The text-only line keeps pace: [MiniCPM5-1B](https://huggingface.co/openbmb/MiniCPM5-1B), released May 2026, averages 42.57 among same-size open-source models (the strongest baseline reaches 35.61), trained with UltraData tiered data management and a three-step post-training of SFT → RL → OPD (on-policy distillation).

## The trade-offs of edge deployment

Once training is as lean as it gets, the remaining battlefield is deployment. MiniCPM's choices are worth comparing:

- **Quantization**: MiniCPM-Llama3-V 2.5 needs 16–17GB of memory in fp16; GGML's Q4_K_M 4-bit quantization brings it to about 5GB, which fits a phone's 12–16GB budget. Quantization is not free — it is a trade between memory and quality, and every stage of edge deployment must verify the capability survives quantization.
- **Saving at the architecture level**: MiniCPM4 uses InfLLM-v2 trainable sparse attention, where each token only attends to fewer than 5% of tokens in a 128K document, yielding roughly 7× decoding speedup over Qwen3-8B on Jetson AGX Orin; BitCPM compresses parameters to ternary values.
- **OpenELM's saving lives in the KV cache**: GQA replaces multi-head attention, and layer-wise scaling raises accuracy per parameter — more score from the same memory budget.

There is also an underestimated cost on the multimodal path: **maintaining the quality of image-text pairs**. Web-crawled captions carry grammatical errors and repeated words; MiniCPM-V uses GPT-4 to annotate a small seed set, fine-tunes a rewriting model to clean captions, then packs variable-length samples into fixed-length sequences for a 2–3× training speedup. No public dataset hands you this pipeline ready-made — which is exactly why training a multimodal model from scratch costs more than a text-only one.

## Where this sits in the series

Put OpenELM and MiniCPM back into the series frame: [MiniMind](/en/posts/ai/2026-09-06-minimind-train-llm-from-scratch-en) demonstrated the minimal complete pipeline for a text-only small model, [YuLan-Mini](/en/posts/ai/2026-09-06-yulan-mini-data-efficient-pretraining-en) demonstrated data efficiency, and SmolLM3 demonstrated stacking data volume to raise the performance line. This piece demonstrates the efficiency of architecture and training order. OpenELM proves non-uniform parameter allocation works for LLMs (more accuracy per token); MiniCPM proves three-stage unfreezing lets an 8B model beat 72B opponents on multimodal benchmarks — neither relies on more compute, both on spending existing compute in the right place.

The choices when you build are equally clear: for architecture experiments and training frameworks, OpenELM's CoreNet and the next post on [LitGPT's from-scratch framework](/en/posts/ai/2026-09-06-litgpt-from-scratch-framework-en) are the fuller textbooks; for interactive edge applications, MiniCPM's deployment chain (llama.cpp/Ollama/MLX cookbooks) can be copied directly. As for when you shouldn't train from scratch at all, [order 6](/en/posts/ai/2026-09-06-when-to-train-llm-from-scratch-en) remains the first decision piece to read.

## References

- [OpenELM model card (Apple, Hugging Face)](https://huggingface.co/apple/OpenELM)
- [OpenELM paper (arXiv:2404.14619)](https://arxiv.org/abs/2404.14619)
- [OpenELM-3B model card (with evaluation commands)](https://huggingface.co/apple/OpenELM-3B)
- [CoreNet: Apple's deep learning training framework (OpenELM's training code)](https://github.com/apple/corenet)
- [MiniCPM GitHub (OpenBMB, with MiniCPM5-1B training recipe)](https://github.com/OpenBMB/MiniCPM)
- [MiniCPM-V paper: A GPT-4V Level MLLM on Your Phone (arXiv:2408.01800)](https://arxiv.org/abs/2408.01800)
- [MiniCPM-V 4.5 paper: Cooking Efficient MLLMs (arXiv:2509.18154)](https://arxiv.org/abs/2509.18154)
- [MiniCPM5-1B (Hugging Face)](https://huggingface.co/openbmb/MiniCPM5-1B)
- [MLX: array framework for Apple Silicon](https://github.com/ml-explore/mlx)
