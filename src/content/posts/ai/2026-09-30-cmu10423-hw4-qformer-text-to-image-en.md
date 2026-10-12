---
title: "Testing Q-Former Text-to-Image: Gradients through Frozen Backbones | CMU 10-423 Assignment 4"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, multimodal, text-to-image, diffusion-transformer, vision-language-model]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 22
tldr: "Use an original numerical test to check gradients, data, and evaluation alongside the original assignment specification."
description: "A rewritten assignment guide with a complete original example and answered variations, without solutions to assigned questions."
draft: false
glossary:
  - term: "Q-Former"
    aliases: ["Querying Transformer", "Query Former"]
    definition: "A module with a fixed number of learnable query vectors that use cross-attention to pull information out of another model's variable-length output, then project it into the format a downstream model expects. BLIP-2 uses it to connect a frozen image encoder to a frozen LLM."
    context: "HW4 runs it the other way: the queries read GPT-2's text hidden states and hand the result to the DiT as conditioning."
    links:
      - label: "BLIP-2 (Li et al., 2023)"
        url: "https://arxiv.org/abs/2301.12597"
  - term: "adaLN"
    aliases: ["Adaptive LayerNorm", "AdaLN"]
    definition: "How a DiT injects conditioning: a small network maps the conditioning vector (for example a class embedding) to the scale and shift of each layer's LayerNorm, instead of adding the condition as a token."
    context: "HW4's pretrained DiT originally drives adaLN with 10 class embeddings; the assignment replaces them with per-layer vectors from the Q-Former."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public assignment handouts, starter code, and related slides. Worked examples are original teaching additions.

## Three separate checks for the bridge

Official HW4 implements text conditioning between frozen GPT-2 and DiT components. This guide uses an original toy test; original task details and references remain below, without solutions to assigned questions. Read [Q-Former](/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer-en) and [latent diffusion](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion-en). Text features, query conditions, and noisy image latents are distinct tensors.

Check dimensions, gradient flow, and actual text control separately. Valid shapes only establish that operations run. Falling loss establishes that some trainable path helps. Attractive images may still ignore captions.

## An original conditioned-denoising step

Two captions with four valid tokens and a hypothetical width-six text encoder produce 2×4×6 features. Three width-four learned queries produce 2×3×4 outputs, then project to the required condition interface. Toy image latents have shape 2×4×8×8. Captions and images must retain batch alignment; convenient broadcasting is not a valid pairing rule.

Use a scalar denoiser to calculate the gradient. Fixed text feature h=2 and trainable bridge a=0.5 produce c=ah=1. Let a frozen denoiser output ε̂=z_t+c, with z_t=0.2 and target ε=0.8. Loss=0.5(ε̂−ε)²=0.08 and dL/da=(1.2−0.8)·2=0.8. SGD with learning rate 0.1 gives a=0.42, ε̂=1.04, and loss=0.0288. The frozen formula still transmits learning signals to the bridge.

## Place no_grad at the right boundary

If GPT-2 has no trainable input prefix or preceding module, fixed text features may be computed without a graph. DiT, however, receives trainable c. Wrapping its entire forward in no_grad severs dL/da. Freeze its weights while retaining differentiation with respect to c. The rule depends on trainable-module placement, not whether a component is called a foundation model.

Compare backbone values or hashes after updates. Inspect whether bridge gradients exist and are finite. A zero gradient can arise from initialization or input, so use a toy case with a known nonzero expected gradient before diagnosing broken wiring.

## Masks and pairings

Queries should not read padding as real text. Append eight padding tokens to a caption and compare eval-mode conditions under a correct mask, allowing numerical error. A large change warrants inspecting masks, positions, and pooling.

Hold seed, sampler, and steps fixed while replacing “red square” with “blue circle,” then swap captions within the batch. Test corresponding attribute changes over held-out prompts with a fixed rubric. A pair of attractive selected images does not establish general text control.

## Check your understanding

If h=0 in the scalar test, dL/da=0 despite an intact graph; use h=2 for the wiring check. If a becomes 0.42 but the backbone changes too, freezing failed. Unchanged loss after caption shuffling may indicate mostly unconditional learning. Save and reload the bridge in a fresh process and repeat a fixed-seed check, including queries, projections, and backbone versions. These tests supplement official starter tests.

## Connect the bridge to the specified task

The [HW4 handout and starter](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) define Multi-Modal Foundation Models, totaling 79 points. Written topics cover LDM, VQ-VAE, CLIP, and VLMs. Programming trains a Q-Former between frozen GPT-2 and CIFAR-10 DiT components to produce 32×32 images. The actual interface projects query information into (batch, DiT layers, condition width), replacing layer-specific class conditions; queries are not simply image patches.

| File and function | Responsibility |
|---|---|
| `image_caption_data.py` / `prompts_to_padded_hidden_states` | Extract the specified GPT-2 hidden states, padding, and valid-position mask; reject invalid layer indices |
| `train_qformer.py` / `setup_optimizer_and_scheduler` | Freeze other parameters and construct AdamW and linear warmup for the specified MSE objective |
| `dit.py` / `QueryEmbedder.forward` | Expand queries, apply self-attention, cross-attention, and FFN residual blocks, then project to layer conditions |

`test_all.py` has fourteen tests using fake GPT-2/tokenizer components. Complete TODOs, make dependencies importable, and run the original tests; expected starter failures are not successful learning evidence. The notebook uses GPT-2 layer index twelve and four queries, with cacheable text features. CIFAR-10 captions include class names, synonyms, and dense descriptions. Dropping conditions with probability 0.1 supports CFG. Inference uses `eval_qformer.py --config_yaml inference.yaml`; save configurations and outputs for fixed-seed comparisons.

The handout estimates 25 epochs at 2–3 hours on T4 or about one hour on A100; this rewrite did not rerun training. Requirements pin `transformers==4.46.3` and include torch, torchvision, wandb, and gdown. `download_data.sh` retrieves checkpoints and captions. Historical 2026-09-30 download observations are retained in research snapshots and do not establish current availability. Important source conflicts remain: question 6.5 requests 25 epochs but mentions an epoch-49 grid; question 6.3 uses different parameter-count assumptions from the introduction; VLM subquestion points differ from the section total. Follow question-specific assumptions and current announcements; external practice should explicitly state its chosen settings.

Slot A prohibits AI; consult the syllabus for Slot B. This guide supplies original instructional examples rather than submission answers and does not provide private recitations, Gradescope feedback, or official solutions. After gradient/mask checks, follow experiments 6.1–6.8 on parameter fractions, freezing, loss/grids, CFG, class/text conditions, and attention maps. An attention visualization is not by itself causal evidence.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public assignment handouts, starter code, related slides, and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## Update Log

- 2026-10-11: Rebuilt the teaching body, integrated the assignment specification, and added original numerical tests and answered variations.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) home page and syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [HW4 handout (hw4.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — points table, questions, starter code, unit tests, notebook, download_data.sh
- [HW4 read-only Overleaf template](https://www.overleaf.com/read/fvnjnmymbzmt#bd53e3)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — HW4 release, Slot A/B, recitation, and Programming Test dates
- [Lecture 15 slides: Querying Transformer + Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Lecture 18 slides: FlashAttention & Efficient Decoding](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf) — HW4 Slot A and Programming Test reminders
- [Li et al. 2023: BLIP-2](https://arxiv.org/abs/2301.12597)
- [Steiner et al. 2024: PaliGemma 2](https://arxiv.org/abs/2412.03555)
- [Peebles & Xie 2023: Scalable Diffusion Models with Transformers (DiT)](https://arxiv.org/abs/2212.09748)
- [Radford et al. 2021: Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020)
- [Ho & Salimans 2022: Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Darcet et al. 2023: Vision Transformers Need Registers](https://arxiv.org/abs/2309.16588)
- [Xiao et al. 2023: Efficient Streaming Language Models with Attention Sinks](https://arxiv.org/abs/2309.17453)
