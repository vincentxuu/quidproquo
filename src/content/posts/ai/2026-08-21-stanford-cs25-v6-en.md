---
title: "Stanford CS25 V6: A Course Called Transformers United Whose First Two Talks Weren't About Transformers"
date: 2026-08-21
category: ai
type: deep-dive
tags: [stanford-cs25, transformer, llm, ai-course, model-serving, multimodal]
lang: en
tldr: "CS25 is Stanford's 1-unit seminar where attendance is the only homework and anyone can audit. Of the nine talks in the Spring 2026 season, the three worth your time are Albert Gu on the inductive biases of SSMs vs Transformers, Charles Frye on serving inference across thousands of GPUs, and Victoria Lin on what native multimodality still hasn't solved."
description: "A full walkthrough of Stanford CS25 Transformers United V6 (Spring 2026): what the course is and how to audit it, what each of the nine talks covered, three threads that emerged across sessions, and how it divides labour with CS336."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs25-v6)

[CS25: Transformers United](https://web.stanford.edu/class/cs25/) is a Stanford seminar, now in its sixth season as of Spring 2026. It does not teach you how Transformers work — that's what CS224N and CS336 are for. What it does is put someone who is currently building this stuff on stage every week and let students raise their hands. This post breaks down what each of the nine V6 talks actually covered, which ones are worth your time, and three threads the speakers connected to each other that the official schedule never mentions.

# What the course is

The structure is deliberately lightweight: 1 unit, graded Satisfactory/No Credit, and the [official course page](https://web.stanford.edu/class/cs25/) says it plainly — **the only homework is weekly attendance**. No exams, no project, no assessment.

Two things come out of that trade. First, the schedule can be rewritten from scratch every year. Only the opening Overview is delivered by the teaching team; the other eight weeks stand alone, so you can watch a single talk without following the series. Second, the course is fully open: in-person auditing, a Zoom livestream, and YouTube recordings run in parallel, and the official page states you don't need to sign up or be affiliated with Stanford in any way. Recordings land on [the same playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM) roughly two to three weeks later.

The course has run since Fall 2021, one version number per season, currently the sixth (the full season list is in the appendix). Past speakers include Geoffrey Hinton, Ashish Vaswani, and Andrej Karpathy — [Karpathy's opening talk](https://www.youtube.com/watch?v=XfpMkf4rD6E) has accumulated roughly a million views, the most-watched session in the whole series.

One structural change in V6 is worth noting: the course is now cross-listed as **SYMSYS 25**, with Symbolic Systems program director Michael C. Frank and Christopher Manning joining the instructor lineup. This isn't purely administrative — two of the papers discussed in the opening session are BabyLM studies training small models on real transcripts of children's language. The cognitive-science weighting has clearly gone up.

The nine V6 sessions ran on Thursday afternoons, sponsored by AGI House, [Modal](https://modal.com), and MongoDB, with sponsor segments included in the recordings.

# The nine V6 talks

I read the full transcripts for all nine sessions.

## Apr 2 — Overview (instructors)

Nominally an introduction, but half of it covers the teaching team's own research, all circling one theme: how you use data matters more than how much of it you have. Training small models on individual children's transcripts showed that differences between families are driven mostly by semantic diversity and interaction structure, not word count. A bilingual BabyLM showed that adding a second language doesn't degrade the first, and that the interleaving scheme barely matters. RAG scaling laws showed small models gain far more from retrieval than large ones do.

The last segment redefines hallucination as a **world-modelling error** — determined jointly by a reference world model, what the model can actually see, and a conflict-resolution policy. The point of the definition is that hallucination in summarisation and an agent clicking a button that doesn't exist can finally be compared in the same table.

The most memorable line is the self-deprecating close:

> Ironically, our first two speakers will not be talking about transformers, but alternative architectures.

## Apr 9 — JEPA and world models (Hazel Nam, Lucas Maes)

Two separate pieces of work. Causal-JEPA slices the frame into objects rather than patches, then **masks an entire object at a time** — because masking a small region lets the model cheat by interpolating, and it never learns interactions. The speaker's framing is a monkey eating a banana: a model that genuinely understands the mechanism should infer the banana is getting shorter even when the banana is covered and only the chewing is visible.

LeWorldModel goes the other way, collapsing JEPA's six anti-collapse loss terms into a single hyperparameter. The model is 16 million parameters, trains on one GPU, and cuts planning time from roughly forty-seven seconds to under a second.

The nicest part is the validation: make a cube suddenly change colour mid-trajectory, then make it suddenly teleport, and watch the prediction error. Colour barely registers; teleportation spikes hard. The world model really does only care about what it should care about.

## Apr 16 — Tradeoffs of SSMs and Transformers ([Albert Gu](https://www.youtube.com/watch?v=OyimE74UMF8)) ← densest talk

Mamba's author, and he opens by rejecting the usual framing: **efficiency is a red herring**. His argument isn't that SSMs are faster, it's that the two families have fundamentally different inductive biases.

> I think of transformers like a database, and SSMs more like a brain.

A database writes down every token verbatim, so it can retrieve precisely. A brain compresses everything into a fixed-size state, so it can't hold exact strings. From that analogy he derives two things. First, hybrid models should carry far more SSM layers than attention layers — the brain is the processor, the external database is only a supplement — and the optimal ratios multiple groups arrived at independently do lean that way. Second, attention falls off badly on characters or DNA, where an individual token carries no meaning on its own.

The strongest evidence is an H-Net ablation. Even when the entire pipeline runs on BPE tokens — data that's already been compressed — swapping the outer encoder to Mamba still beats an all-Transformer variant. His reading: compression isn't just cheaper, it *is* an inductive bias toward building abstractions.

## Apr 23 — Ultra-Scale: training on thousands of GPUs (Nouamane Tazi, Hugging Face)

The opening framing is problem scale: a trillion parameters, fifteen trillion tokens, every step squeezed into about one second. He covers five dimensions of parallelism with deliberate asymmetry — data and tensor parallelism in depth, pipeline/context/expert quickly. The one trick used everywhere: split an all-reduce into reduce-scatter plus all-gather, same communication volume but far less memory, which is what all three ZeRO stages and sequence parallelism rest on. The criterion for tensor parallelism is one sentence: after splitting, activations must look exactly like the unsplit case — so attention splits along heads, never along the hidden dim. The two most memorable warnings: if ZeRO-1 fits, don't reflexively reach for FSDP, because "ZeRO-3 is just trading communication for memory"; and MoE's all-to-all dispatch has a hard CPU-GPU sync bottleneck — "most labs doing MoE trainings have very slow trainings just because of this hardware problem." One reassuring Q&A answer: as long as the implementation is correct, your choice of parallelism doesn't change the scaling-law curve.

## Apr 30 — The future of pretraining ([Shrimai Prabhumoye](https://www.youtube.com/watch?v=e_H_tkpCAK4), Mistral AI)

The whole talk is framed around four children named after NVIDIA architectures (Pascal, Volta, Ampere, Hopper), comparing three strategies stacked on top of each other: a two-phase curriculum (diversity first, quality second), front-loading reasoning data into pretraining, and RLP.

RLP is the newest piece: let the model generate an explicit thought before predicting the next token, and define the reward as the log-probability difference between thinking and not thinking. That reward needs no external verifier and can be applied at any position in a document. Her strongest number is a Nemotron 12B v2 intermediate checkpoint plus a small amount of RLP beating a base model that consumed the full pretraining run by 35% on average.

She also gives the counter-examples: swapping the two phases (quality first, then diversity) performs worse, and RLP's tokens are chosen at random, with no entropy-based selection.

## May 7 — Distinct modes of generalization from parameters and context (Andrew Lampinen, Anthropic)

The experimental design is clean: take one dataset, either fine-tune it into parameters or stuff the whole thing into context, then ask the same generalization questions. The starkest gap is on a reversal-curse dataset — a fine-tuned model answers reversed questions *below* chance, while the same data placed in context gets them right 99% of the time. The control makes it structural: a small model trained from scratch on 20,000 relations with 1% held-out reversals generalizes to those reversals from its parameters at exactly zero. So this isn't a fine-tuning artifact; it's a structural flaw of next-token prediction on relational data. He offers three ways to close the gap: offline augmentation (place the dataset in context, generate reasoning traces per document, add them back to training — on syllogism tasks this even beats in-context learning); online episodic memory attached at test time (he admits his oracle retrieval is "totally cheating"); and RL-trained implicit retrieval — the only route that generalized to non-overlapping datasets. He closes by mapping the two systems onto complementary learning systems in neuroscience: cortex learns statistical structure slowly, the hippocampus stores single experiences quickly, and replay connects them.

## May 14 — Collaborative AI agents for science (Vivek Natarajan, DeepMind)

In practice this talk has one subject: the AI co-scientist — AMIE, which the abstract lists alongside it, comes up once, by name only. The origin story runs through Stanford: when he came to speak about Med-PaLM in 2023, Stanford's Gary Peltz approached him afterwards asking whether LLMs could generate scientific hypotheses, and that conversation became this project. The architecture is a while loop around four asynchronous functions — generate, critique, rank, evolve — all running on Gemini models with division of labour done purely through system prompts; the ranking agent stages hypothesis-vs-hypothesis debates scored like a chess tournament with Elo. The validation cases are beyond demo grade: the system reproduced Imperial College's unpublished antibiotic-resistance findings in two days (the PI suspected they had read his email), and on Alzheimer's it not only recapitulated a nine-step mechanism cascade but filled in a bradykinin–B2R step the scientists had missed — the same question put to Claude and GPT-5 produced only a first-step hypothesis. He's candid about limits: good hypotheses will soon outnumber validation capacity, and asked what happens to peer review, his answer was "honestly, I don't have a good answer to that." Worth noting: he also gave the "Biomedical Transformers" talk in V2 back in 2023, making him one of the few repeat speakers.

## May 21 — From language models to native multimodal intelligence ([Victoria Lin](https://www.youtube.com/watch?v=NDdc39KYqDU), Thinking Machines)

The first half is a clean architectural walkthrough of three generations: Chameleon discretises images into codebook tokens and throws everything into one autoregressive objective; Transfusion switches to autoregression for text and diffusion for images inside a single transformer; Mixture-of-Transformers gives each modality its own projection and feed-forward parameters while keeping attention shared. The MoT section has a genuinely useful consequence: you can freeze an existing text model and train only the new modality's parameters, effectively bolting generation onto a model you already have.

The valuable part is what she says *doesn't* hold. Better understanding drives better generation, but there's almost no evidence for the reverse — training a model hard on image generation doesn't make it better at reading images. Asked whether text could be rendered as images to unify the modalities, her answer was direct: if you're going to unify, align everything else onto text rather than aligning text onto everything else.

## May 28 — Serving transformers in production ([Charles Frye](https://www.youtube.com/watch?v=ZUdIsRZhWXI), Modal) ← most practical

The only talk that sits entirely on the deployment side, and it's dense. He splits LLM applications into three archetypes with different figures of merit: interactive chat cares about output tokens per second per user, background agents care about time-to-last-token, and batch data processors care about tokens per dollar.

He spends the most effort on tail latency. When P50 is a millisecond but P95 stretches out, what the user experiences is continuous stuttering, not "only 5% of people got unlucky" — because you're measuring the quantile of a single token, not of a single user.

Other things worth keeping: optimise in order — speculative decoding and quantisation first (multiplicative gains), then keeping the CPU out of the GPU's way, and only then kernels (usually a few percentage points). The most common source of model-quality bugs is tokenizers and chat templates, so please log token IDs and not just strings. And the line I liked most:

> Models and deployments have turned out to be pretty temporary. Evals are forever.

# Three threads the schedule doesn't mention

There's no official narrative connecting the nine sessions, but three threads show up once you read the transcripts.

**1. Tokenization is this season's common enemy.** Albert Gu argues attention is beholden to the tokens it's handed and has no ability to change what a token means to it, which is why he's pushing H-Net's end-to-end chunking. Six weeks later Charles Frye arrives at the same place from the opposite direction: tokenizers and chat templates are the most common model-quality bug he sees in production, and he explicitly cites Gu's talk while saying so. One from the architecture end, one from the deployment end, pointing at the same thing.

**2. Reasoning is migrating into pretraining.** The entire argument of the RLP talk is that treating reasoning as post-processing leaves a weak foundation. The curriculum work in the Overview and Lampinen's parameters-versus-context talk are different faces of the same question. Not one session this season was about making RLHF better.

**3. Whether language should be the reasoning backbone is unsettled.** The JEPA pair argue for predicting in latent space and routing around symbols. Victoria Lin argues explicitly for aligning other modalities onto text. The two talks are six weeks apart and nobody puts them side by side — which is what the format determines: nine independent sessions, and nobody responsible for converging them.

# Views: the topic decides, not the slot

Earlier seasons peaked at the opener and declined. V6 broke that pattern:

| Date | Topic | Views |
|---|---|---|
| May 21 | Native multimodality (Thinking Machines) | 115,000 |
| Apr 9 | JEPA and world models | 99,135 |
| Apr 30 | The future of pretraining | 14,278 |
| Apr 2 | Overview (instructors) | 10,265 |
| May 28 | Serving inference (Modal) | 6,666 |
| Apr 16 | SSMs vs Transformers (Albert Gu) | 5,864 |
| May 7 | Parameters vs context (Anthropic) | 3,763 |
| May 14 | AI co-scientist (DeepMind) | 3,436 |
| Apr 23 | Ultra-Scale (Hugging Face) | 1,898 |

(Snapshot taken 21 August 2026; these keep growing.)

Hot topics clear a hundred thousand; engineering topics don't reach two thousand. There's a practical implication: **the lowest-traffic sessions have nothing to do with quality.** Albert Gu's talk is the densest of the season and sits fourth from bottom.

# How to actually use this course

**If you have three hours**: watch Albert Gu, Charles Frye, and Victoria Lin (links at the end). What they share is that all three are describing things they built themselves, and all three spend real time on what still doesn't work. Watch Gu before Frye — Frye cites Gu, so they connect.

**If you're deciding whether to bother**: open the schedule table on the [official course page](https://web.stanford.edu/class/cs25/). Every abstract is written by the speaker; reading all nine takes about five minutes and is more accurate than any second-hand summary. For what it's worth, while researching this I caught a popular third-party CS25 tracker page listing the wrong speaker for Apr 30 — go to the official page for the schedule.

**If you want to follow the next season live**: V7 is already scheduled in Stanford's course system for Spring 2027, same Thursday slot, same instructors. Join the Zoom or wait for YouTube; no affiliation required.

**What this course can't give you**: no assignments, no assessment, no feedback. After a full season you'll know what this crowd was arguing about, but you won't be better at doing any of it. For that, the same group runs [CS336](https://stanford-cs336.github.io/): an implementation-heavy course taking you from a tokenizer through FlashAttention to RLVR, with hourly GPU rental prices listed on the page for people following along at home. CS25 and CS336 aren't a beginner-to-advanced ladder; they're two different things the same department offers for two different needs.

# Appendix: season list and verification scope

Seasons so far: V1 (Fall 2021), V2 (Winter 2023), V3 (Fall 2023), V4 (Spring 2024), V5 (Spring 2025), V6 (Spring 2026). V7 is scheduled for Spring 2027.

- Course structure, history, schedule and speakers: all from the [official course page](https://web.stanford.edu/class/cs25/), the [archived season pages](https://web.stanford.edu/class/cs25/past/cs25-v5), and [Stanford ExploreCourses](https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&q=CS25) — primary sources.
- Session content: full transcripts read for all nine sessions (Apr 23, May 7 and May 14 completed on 26 August 2026 via YouTube auto-generated captions; occasional transcription errors restored from context).
- Numbers speakers stated on stage (hybrid layer ratios, RLP's 35%, the planning-time gap) come from a single source each; I did not cross-check them against the underlying papers or technical reports.
- View counts are a single snapshot from 21 August 2026.

## References

- [CS25: Transformers United V6 official course page](https://web.stanford.edu/class/cs25/)
- [CS25 V5 (Spring 2025) archive](https://web.stanford.edu/class/cs25/past/cs25-v5)
- [CS25 V4 (Spring 2024) archive](https://web.stanford.edu/class/cs25/past/cs25-v4)
- [CS25 V2 (Winter 2023) archive](https://web.stanford.edu/class/cs25/past/cs25-v2)
- [CS25 V1 (Fall 2021) archive](https://web.stanford.edu/class/cs25/past/cs25-v1)
- [Stanford ExploreCourses: CS 25 / SYMSYS 25](https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&q=CS25)
- [CS25 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rNiJRchCzutFw5ItR_Z27CM)
- [V6 Overview (Apr 2)](https://www.youtube.com/watch?v=bHSDPgZYie0)
- [V6 JEPA and world models (Apr 9)](https://www.youtube.com/watch?v=GBd7iuJkW08)
- [V6 Tradeoffs of SSMs and Transformers, Albert Gu (Apr 16)](https://www.youtube.com/watch?v=OyimE74UMF8)
- [V6 The Ultra-Scale Talk, Nouamane Tazi (Apr 23)](https://www.youtube.com/watch?v=I5BKi32IEa8)
- [V6 The future of pretraining, Shrimai Prabhumoye (Apr 30)](https://www.youtube.com/watch?v=e_H_tkpCAK4)
- [V6 Generalization from parameters and context, Andrew Lampinen (May 7)](https://www.youtube.com/watch?v=dJtHauhRasc)
- [V6 Collaborative AI agents, Vivek Natarajan (May 14)](https://www.youtube.com/watch?v=jFdH7n6BAl0)
- [V6 Native multimodal intelligence, Victoria Lin (May 21)](https://www.youtube.com/watch?v=NDdc39KYqDU)
- [V6 Serving Transformers, Charles Frye (May 28)](https://www.youtube.com/watch?v=ZUdIsRZhWXI)
- [V2 Introduction to Transformers, Andrej Karpathy](https://www.youtube.com/watch?v=XfpMkf4rD6E)
- [Stanford CS336: Language Modeling from Scratch](https://stanford-cs336.github.io/)
