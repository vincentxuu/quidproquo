---
title: "CMU 10-423 HW4: Text-to-Image with a Q-Former Between a Frozen GPT-2 and a Frozen DiT — Structure, Files to Edit, and Compute"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, multimodal, text-to-image, diffusion-transformer, vision-language-model]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 15
tldr: "HW4 in CMU 10-423 Spring 2026 is worth 79 points. The written part covers LDMs (7), VQ-VAEs (8), CLIP (4), and VLMs through PaliGemma2 (18). The programming part (40) has you train only a Q-Former between a frozen GPT-2 and a frozen CIFAR-10 DiT, so a class-conditional diffusion model learns to take text. You write three functions, checked by 14 unit tests. The handout estimates 2–3 hours on a T4 or about 1 hour on an A100 for 25 epochs, and the captions and DiT weights come from Google Drive via download_data.sh."
description: "A guide to CMU 10-423/623/723 Generative AI (Spring 2026) Homework 4, \"Multi-Modal Foundation Models\": the points table, what each written section asks, the three parts of the Q-Former text-to-image pipeline, the three TODO functions and 14 unit tests, the training command and compute estimates in run_in_cloud.ipynb, the empirical questions, the Drive downloads and transformers==4.46.3 pin, and where the handout and the zip disagree. No solutions."
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

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

**This guide is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 15 of [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) and closes the multimodal unit. The previous post, [L14–L15: Cross-Attention, DiT, Prompt-to-Prompt, and the Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en), showed where text conditioning enters the model. This one looks at how the homework makes you turn a diffusion model that only knows 10 classes into one that reads text.

Official materials used: [hw4.zip](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) from the [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html) (the 30-page "S26 10423 HW4.pdf", starter code, and unit tests), the [read-only Overleaf template](https://www.overleaf.com/read/fvnjnmymbzmt#bd53e3), the [course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), and the Querying Transformer section of the [Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf). I downloaded and checked all of them on 2026-09-30.

This post covers structure, points, files to edit, compute, and environment. **It gives no solutions.**

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. The anonymous page did not load the videos and prompted sign-in. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## The basics

| Item | Details |
|---|---|
| Name | Homework 4: Multi-Modal Foundation Models |
| Scope | L12–L14 (the schedule says "HW4 out (L12-L14)") |
| Released | The handout says 2026-03-13; the schedule marks "HW4 out" on March 12 |
| Due | 2026-03-23 (Slot A); the schedule lists March 30 for Slot B (tentative) |
| Submission | Gradescope: one written PDF; code uploads are `train_qformer.py`, `dit.py`, `image_caption_data.py` |
| Total | 79 |

Points table (handout, page 1):

| Section | Points |
|---|---|
| LaTeX Template Alignment | 0 |
| Latent Diffusion Model (LDM) | 7 |
| VQ-VAEs | 8 |
| CLIP | 4 |
| VLMs | 18 |
| Programming: Text-to-Image Generation | 40 |
| Code Upload | 0 |
| Collaboration Questions | 2 |

The [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) explains the Slot A (human work only) and Slot B (AI allowed) rules. The reminder slide in L18 marks HW4 Slot A as "no AI assistance!" and announces a Programming Test on HW3/HW4 on March 27.

## What the written questions ask

The four written sections map onto the four topics of L12–L14. Most items are short calculations or short answers:

- **LDM (7 points)**: compute the latent size of a 512×512 image at compression factor f = 8; explain why diffusion runs in latent space rather than pixel space; then change cross-attention so the values come from the image side, and explain what breaks mathematically and why it makes no sense intuitively.
- **VQ-VAE (8 points)**: take the objective with and without stop-gradient, differentiate each with respect to the encoder output and the codebook vector, and describe in words what stop-gradient does to the two terms and what the codebook is being optimized to do.
- **CLIP (4 points)**: show that the CLIP paper's symmetric cross-entropy objective is equivalent to raising the cosine similarity of matched image-caption pairs while lowering it for every other pair.
- **VLM (18 points)**: using [PaliGemma2](https://arxiv.org/abs/2412.03555), draw the data flow between the SigLIP vision encoder, the linear projection, and the Gemma 2 language model and describe each part's role; work out how the number of visual tokens changes when resolution goes from 224×224 to 448×448 with 14×14 patches; and finally, ask a proprietary VLM (the handout names GPT or Gemini) for a dense caption, then find an adversarial image-question pair it gets completely wrong, with a screenshot.

That last item is the only one that needs an outside service. You can still do it today, but the result depends on the model version you hit.

## Programming: train only the middle layer

Section 6 of the handout sets up a pipeline with three parts:

| Component | State | Role |
|---|---|---|
| GPT-2 | Frozen | Turns text into per-token 768-dimensional hidden states |
| DiT (Diffusion Transformer) | Frozen | A class-conditional diffusion model pretrained on CIFAR-10; its 10 class embeddings modulate every layer through adaLN |
| Q-Former | Trained | Uses a few learnable queries to cross-attend over GPT-2's output and produce the conditioning vector each DiT layer needs, replacing the class embedding |

The handout gives two reasons not to feed GPT-2 features straight into the DiT. GPT-2's output has variable length while the DiT takes a single 768-dimensional vector, and there is no reason for the two representation spaces to line up. The Q-Former design is credited to Perceiver IO, with [BLIP-2](https://arxiv.org/abs/2301.12597) and MetaQueries as models that use the same structure. The Querying Transformer section of L15 follows the same order: a PaliGemma recap, BLIP-2's two stages, MetaQueries, then Perceiver IO.

The outputs are 32×32 images. The handout warns that CIFAR-10 is low resolution to begin with, so blurry samples do not mean the model is broken.

### Three TODO functions

The training loop, cross-attention, inference, and visualization are all provided. You fill in three functions:

| File | Function | What it does |
|---|---|---|
| `image_caption_data.py` | `prompts_to_padded_hidden_states` | For each prompt, call the tokenizer and GPT-2 (`output_hidden_states=True`), keep the requested layer's hidden states, pad to a common length, and return a boolean mask marking non-padding positions |
| `train_qformer.py` | `setup_optimizer_and_scheduler` | Freeze every parameter outside the Q-Former; build AdamW with betas fixed at (0.9, 0.95); add a linear warmup through `LambdaLR` when `warmup_steps > 0`; use MSE loss |
| `dit.py` | `QueryEmbedder.forward` | Look up the query table, expand it to the batch, run pre-norm self-attention, cross-attention, and FFN residuals block by block, then project with `output_proj` and `query_to_layer` to (batch, DiT layers, conditioning dim) |

The first function hides an easy miss. GPT-2 has 12 layers, but there is a hidden state before the first layer and after the last, so 13 layer indices are valid. The unit tests also require an error when the index is below 0 or out of range.

The training command in `run_in_cloud.ipynb` passes `--gpt2_layer_index 12`, the state after the last layer. The Q-Former defaults to 2 blocks and 8 heads, with 4 queries. The training script builds the DiT with dim 256, 10 layers, and 8 heads.

### Fourteen unit tests

`test_all.py` holds 14 tests, each weighted 1. One checks the submitted files, six cover hidden-state extraction (layer selection, tokenizer before GPT-2, padding, two kinds of invalid index, masks), four cover the optimizer setup, and three cover the Q-Former forward pass (output shape, with and without an attention mask). The tests use a fake GPT-2 and tokenizer, so no weights need downloading.

I ran them locally on 2026-09-30 (macOS, Python 3.11, PyTorch 2.13, CPU) and hit two things:

- The untouched starter code **does not import**. The body of `QueryEmbedder.forward` in `dit.py` is empty between `BEGIN/END STUDENT SOLUTION`, so Python raises `IndentationError` and test collection fails. I had to add a `pass` to all three TODOs before anything ran.
- `train_qformer.py` does `import wandb` at the top level, so without wandb installed the tests don't even collect.

With the `pass` stubs, 13 tests fail and 1 passes (the submitted-files check). That is the expected starting state.

## Training, inference, and the empirical questions

`run_in_cloud.ipynb` assumes Colab with the handout copied into your Google Drive. It mounts Drive, runs `pip install -r requirements.txt` and `bash ./download_data.sh`, then trains:

```bash
python train_qformer.py \
    --pretrained_model_path ./data/ddpm_dit_cifar_100_epochs.pth \
    --dense_captions_path "./data/cifar10_dense_captions.jsonl" \
    --epochs 25 \
    --batch_size 128 --lr 1e-4 \
    --save_model_path ./models/trained_qformer.pth \
    --gpt2_layer_index 12 --num_query_tokens 4 --cfg 3.0 --data_dir ./data \
    --gpt2_cache_dir ./data --optimizer_ckpt_interval 5 \
    --cache_text_embeddings ./data/text_embeddings.pt
```

Training pairs CIFAR-10 images with four kinds of caption: the class name alone, a synonym for the class name, a dense caption with a scene, and a synonym plus a scene. GPT-2 hidden states are cached to `data/text_embeddings.pt`. A footnote says the course could have had you generate them, but it would add time to an already long assignment. Text conditioning is dropped with probability 0.1 during training so classifier-free guidance works at inference time.

Inference is `python eval_qformer.py --config_yaml inference.yaml`. The `inference.yaml` in the zip has two examples: sampling from the original class-conditional DiT, and sampling "a photo of a silver plane in a green grassy background" from your trained Q-Former while saving attention maps at t = 1000, 500, and 100. You add your own entries for the other experiments.

The empirical questions (6.1–6.8):

| Item | Content | Points |
|---|---|---|
| 6.1 | Dimensions of GPT-2's `hidden_states` | 2 |
| 6.2 | Reading `QueryEmbedder.__init__`: the query table, each module's job, where Q/K/V come from, pre-norm | 12 |
| 6.3 | Count the Q-Former's trainable parameters and their share of the total; paste 3 dense-caption image-text pairs | 4 |
| 6.4 | Compare training only the Q-Former against unfreezing everything: asymptotic loss and the LLM's general ability | 4 |
| 6.5 | Train 25 epochs with `num_queries=4`; paste the EMA loss curve and sample grids | 5 |
| 6.6 | CFG scales w = 1, 2, 3, 4 on the original DiT for class "deer" | 3 |
| 6.7 | 8 cars each from class and text conditioning; two underspecified out-of-distribution prompts | 4 |
| 6.8 | Cross-attention maps of both layers at t = 500 for "a photo of a red airplane with a green field in the background" | 6 |

The hint for 6.8 points to [Darcet et al. 2023](https://arxiv.org/abs/2309.16588) (Vision Transformers Need Registers) and [Xiao et al. 2023](https://arxiv.org/abs/2309.17453) (attention sinks), and asks you to explain which tokens get attention and which are ignored completely.

## Environment and compute: does it still run today?

**Compute.** Question 6.5 estimates 2–3 hours on a T4 and about 1 hour on an A100 for 25 epochs. The handout suggests claiming Colab Pro with a CMU email and choosing an A100 if available, with L4 or T4 as fallbacks. Outside readers don't get the education offer, so whether a free T4 survives 2–3 hours without a disconnect depends on your quota that day. The script saves weights and optimizer state every 5 epochs, and you can resume from a multiple of 5 with `--resume_optimizer_path`, `--resume_model_path`, and `--start_epoch`.

**Downloads.** `download_data.sh` uses `gdown` to fetch two files from Google Drive. On 2026-09-30:

- `cifar10_dense_captions.jsonl` (about 7.6 MB) downloaded directly. Each line has `index`, `split`, `label_index`, `label_name`, and `caption`.
- `ddpm_dit_cifar_100_epochs.pth` (Drive shows 51M) first returns a "can't scan for viruses" confirmation page because of its size. The file itself is still public.

Both files live on course staff's Drive, not on the course site. If the sharing changes, the assignment stops running, so self-learners should download a backup.

**Dependencies.** `requirements.txt` lists torch, wandb, Pillow, torchvision, tqdm, `transformers==4.46.3`, and gdown. Only transformers is pinned. I have 4.57.6 locally but did not run full training with it, so I can't say whether newer versions work. wandb is required: sample grids go to wandb, and 6.5 asks you to paste them from there.

**Where the handout and the zip disagree:**

- The handout's file list omits `test_all.py` and `inference.yaml`, which are both in the zip. It also shows a `handout/` folder, but the zip puts files at the root.
- Question 6.5 says to train 25 epochs, then asks for sample grids from epochs 5, 25, and 49. The script's `--epochs` default is 20; the notebook command says 25.
- Part 2 says the DiT has about 100M parameters and GPT-2 about 117M. Question 6.3 then says "suppose GPT-2 has 125M and DiT has 18M." Use the numbers in 6.3 when answering 6.3.
- The points table gives the VLM section 18 points, but the per-item points add up to 11 (7 for 5.1, 2 for a second item also numbered 5.1, and 2 for 5.2). The total of 79 follows the table.

## What you can't get

The March 13 HW4 recitation is a Google Slides link that returns 401 from outside CMU. Also out of reach: Gradescope autograding and grading rubrics, the Programming Test, official solutions, and the recordings (Panopto needs a CMU login).

**What to do**: tonight, download hw4.zip, add a `pass` to each of the three TODO bodies, install wandb, and run `pytest test_all.py` until you see 13 failures. Then open `dit.py`, read only `QueryEmbedder.__init__`, and write each module's input and output shapes next to it. The 12 points in 6.2 are mostly that shape table.

## What this post can and can't confirm

Confirmed: the handout, starter code, unit tests, and notebook in hw4.zip; schedule dates; the reminder slides in L15 and L18; the Drive files' availability on 2026-09-30; and my local unit-test results. Not confirmed: real training time on a free T4, compatibility with newer `transformers`, the recitation content (401), whether the tentative Slot B date on the schedule (March 30) held that semester, and official solutions.

Further reading: for the math behind diffusion and guidance, see [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en). For the systems side of parameter-efficient fine-tuning such as LoRA, see [CMU 11-868 L23: Efficient Fine-Tuning for Large Models](/posts/ai/2026-09-30-cmu11868-peft-lora-en).

Series: Previous: [L14–L15: Cross-Attention, DiT, Prompt-to-Prompt, and the Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en) | Next: [L15–L16: Scaling Laws and Mixture of Experts](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

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
