---
title: "CS224U Contextual Representations II: What GPT, BERT, RoBERTa, ELECTRA, T5, BART, and Distillation Each Change in Pretraining"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, transformer, pre-training, nlp]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 4
tldr: "CS224U Spring 2023 tells the story of the Transformer families through BERT's four known limitations. RoBERTa addresses the first (optimization was only partly explored). ELECTRA addresses the second and third (the [MASK] mismatch, and only about 15% of tokens giving a learning signal per batch). XLNet addresses the fourth (the assumption that masked tokens are independent of each other). GPT changes the objective and the mask, T5 and BART change the architecture and how inputs are corrupted, and distillation changes model size. The course's 2023 view: autoregressive architectures have taken over, but bidirectional models may still have the edge for representation."
description: "A guide to the last seven sections of the Stanford CS224U (Spring 2023) contextual representations slides and YouTube videos 07–13: GPT's autoregressive loss and teacher forcing, BERT's MLM and NSP, RoBERTa's design-space exploration, ELECTRA's generator and discriminator, seq2seq pretraining in T5 and BART, the levels of distillation objectives, and how vsm_03_contextualreps.ipynb pulls static word vectors out of BERT."
draft: false
glossary:
  - term: "MLM"
    aliases: ["masked language modeling"]
    definition: "Pretraining in which a small share of tokens is masked or replaced and the model uses context on both sides to recover the originals. Only the masked positions produce a learning signal."
    context: "BERT's main pretraining objective; RoBERTa and ELECTRA both modify it."
  - term: "teacher forcing"
    definition: "When training an autoregressive model, feeding the correct token at each next step regardless of what the model predicted at the previous one."
    context: "GPT is trained this way. At generation time there is no correct token to feed, so the model's own output is used."
  - term: "distillation"
    aliases: ["knowledge distillation"]
    definition: "Training a smaller student model to mimic the input-output behavior, and sometimes the internal representations, of a larger teacher model, trading size for inference efficiency."
    context: "DistilBERT distills 12-layer BERT-base into 6 layers."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)

> **This post is based on the Spring 2023 offering of [CS224U](https://web.stanford.edu/class/cs224u/).** It is part 4 of the [Stanford CS224U guide](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding-en) series. The Transformer block and positional encoding are covered in [the previous post](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer-en); this one starts directly with the model families.

The last seven sections of the same [contextual representations slide deck](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf) (GPT, BERT, RoBERTa, ELECTRA, seq2seq, Distillation, Wrap-up) match videos 07 through 13 in the [XCS224U playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp). Each runs about 6 to 14 minutes.

The best way to read these seven sections is to keep asking one question: **which part of pretraining does this family change?**

## The big picture

| Family | What it changes | Evidence the course cites |
|---|---|---|
| GPT | Objective: autoregressive, left context only | Scaling table from GPT to GPT-3 |
| BERT | Objective: bidirectional MLM plus NSP | The two downsides the original paper names itself |
| RoBERTa | Data size, batch size, masking, dropping NSP | Ablations on static vs. dynamic masking, batch size, and data size |
| ELECTRA | Learning signal: from "guess the masked word" to "was each word replaced?" | Ablations on generator size, compute efficiency, and prediction coverage |
| T5, BART | Architecture: encoder–decoder; BART also changes how inputs are corrupted | T5's three-architecture figure; BART's corruption combinations |
| Distillation | Model size: a large teacher trains a small student | GLUE results for DistilBERT and others |

I built this table from the videos; it isn't a slide from the deck.

## GPT: looking left only

**Objective.** Video 07 starts with the autoregressive loss. At position t, take the embedding of the token to predict and dot it with the hidden representation the model has built up through t−1. The rest is softmax normalization over the whole vocabulary; you take the log and look for parameters that maximize it.

<details>
<summary>Formula: autoregressive loss (slide 29)</summary>

$$\max_{\theta} \sum_{t=1}^{T} \log \frac{\exp\left(e(x_t)^\top h_\theta(x_{1:t-1})\right)}{\sum_{x' \in V} \exp\left(e(x')^\top h_\theta(x_{1:t-1})\right)}$$

</details>

**Masking.** Inside a Transformer, attention has to hide the future: position a sees only itself, b can see a, and c can see a and b.

**Teacher forcing.** During training, the correct token goes in at the next step no matter what the model predicted. Potts stresses a point that's easy to miss: **the model never predicts tokens. It predicts scores over the whole vocabulary.** Choosing a token is a separate decision rule. Taking the highest score is one rule, beam search is another, and neither is part of the model itself.

**Fine-tuning.** The standard approach puts task parameters on the final output state. Potts believes the first GPT paper's fine-tuning was based entirely on that state. You can also mean- or max-pool over all the output states.

**Scale.** The OpenAI models on the slide:

| Model | Layers | d_k | Parameters |
|---|---|---|---|
| GPT (2018) | 12 | 768 | 117M |
| GPT-2 (2019) | 48 | 1,600 | ~1.5B |
| GPT-3 (2020) | 96 | 12,288 | 175B |

Another slide lists open models: GPT-Neo, GPT-J, GPT-NeoX, OPT-66B, and BLOOM (176B parameters). The slide itself warns that "this table will be out of date by the time anyone reads it."

## BERT: both directions, but learning from 15%

**Input.** Every sequence starts with [CLS] and uses [SEP] as a separator. Besides word and position embeddings, there's a segment embedding (SentA, SentB). This is the hierarchical position from the previous post, such as premise and hypothesis in NLI.

**MLM.** Mask some tokens and have the model recover them from bidirectional context. The slides show three treatments: no masking, replacing with [MASK], and replacing with a random word ("rules" becomes "every"). Only a small share is masked so the other positions supply enough context. The loss includes an indicator m_t that is 1 for masked positions and 0 otherwise.

<details>
<summary>Formula: MLM loss (slide 41)</summary>

$$\max_{\theta} \sum_{t=1}^{T} m_t \log \frac{\exp\left(e(x_t)^\top h_\theta(\hat{x})_t\right)}{\sum_{x' \in V} \exp\left(e(x')^\top h_\theta(\hat{x})_t\right)}$$

$\hat{x}$ is the masked sequence, and $m_t = 1$ means position $t$ was masked. The difference from GPT is that $h_\theta$ can use the whole sequence (minus position $t$), not just what comes before $t$.

</details>

**NSP.** The second objective is binary next sentence prediction: two sentences that really follow each other are labeled IsNext, and random pairs are labeled NotNext. Potts says the motivation was to help the model learn some discourse-level information.

**Fine-tuning.** The lightest approach adds a few dense layers on top of the [CLS] output. Because [CLS] is always in the first position, it becomes a constant element that carries a lot of information about the sequence. Pooling over all outputs is the alternative.

**Releases.** The original release had only base and large, each cased and uncased (Potts recommends always using cased). Google and others later released smaller ones. BERT-tiny has 2 layers and 4M parameters; large has 24 layers and 340M. All of them use absolute positional encoding, so the maximum length is 512 tokens.

**Four known limitations.** This slide is the hinge of the whole unit, because the next three families respond to it:

1. The original paper's ablation and optimization studies are "admirably detailed but still partial"
2. "We are creating a mismatch between pre-training and fine-tuning, since the [MASK] token is never seen during fine-tuning" (the original paper's own words)
3. "Only 15% of tokens are predicted in each batch" (the original paper's own words)
4. "BERT assumes the predicted tokens are independent of each other given the unmasked tokens" (from the XLNet paper). Potts's example: mask both "New" and "York," and the model guesses each one independently

## RoBERTa: answering limitation 1

[RoBERTa](https://arxiv.org/abs/1907.11692) stands for Robustly Optimized BERT Approach. The slide compares them item by item:

| BERT | RoBERTa |
|---|---|
| Static masking | Dynamic masking |
| Input: two concatenated document segments | Input: sentence sequences that may cross document boundaries |
| NSP | No NSP |
| Batches of 256 | Batches of 2,000 |
| WordPiece | Character-level byte-pair encoding |
| BooksCorpus + English Wikipedia | Plus CC-News, OpenWebText, Stories |
| 1M steps | Up to 500K steps (with much bigger batches, so more examples overall) |
| Short sequences first | Full-length sequences throughout |

The most interesting evidence is **the trade-off on input format**. Using sentences from a single document (DOC-SENTENCES) scored slightly better on their benchmarks, but the team chose FULL-SENTENCES, which can cross documents, because it makes efficient batching easier. Potts likes the decision: in this era, accuracy isn't the only thing that matters; resources do too.

The data table is just as direct. Going from 16GB to 160GB and from 100K to 500K steps, every step helps.

Potts also points out a change in method. RoBERTa is far more thorough than BERT, but nowhere near the exhaustive hyperparameter searches of the pre-deep-learning era. The reason is simple: it's too expensive, so even RoBERTa is a heuristic, partial exploration. For more on how to set up BERT-style models, he recommends [A Primer in BERTology](https://aclanthology.org/2020.tacl-1.54/).

## ELECTRA: answering limitations 2 and 3

[ELECTRA](https://arxiv.org/abs/2003.10555) (the slides cite [Clark et al.'s ICLR version](https://openreview.net/pdf?id=r1xMH1BtvB)) is shown with "the chef cooked the meal":

1. Mask about 15% of tokens, as in BERT: "the chef [MASK] the meal"
2. A small, BERT-like **generator** fills in the masked positions by sampling from its own distribution. Sometimes it restores the original word; sometimes it picks another, such as "ate" for "cooked"
3. The **discriminator**, which is ELECTRA itself, decides for every token whether it's the original or a replacement

The two are trained jointly. Afterward the generator is dropped and the discriminator is kept. [MASK] only appears in the generator's input, so the discriminator never sees it, which removes limitation 2. The discriminator makes a decision at every position, which removes limitation 3.

**Keep the generator small.** When the generator and discriminator are the same size, they can share parameters, and more sharing helps. But the best results come from a generator much smaller than the discriminator: with a 768-dimensional discriminator, a 256-dimensional generator is best, and the curve is an inverted U. Potts's intuition is that a weaker generator leaves the discriminator more interesting work to do.

**Ablation on prediction coverage (GLUE scores):**

| Variant | GLUE |
|---|---|
| ELECTRA | 85.0 |
| All-tokens MLM | 84.3 |
| Replace MLM | 82.4 |
| ELECTRA 15% (the discriminator judges only replaced positions) | 82.4 |
| BERT | 82.2 |

The lesson: **more predictions are better.** Even All-tokens MLM, which stays within the BERT architecture and simply predicts every token, clearly beats the original BERT.

There were three releases: Small, Base, and Large. Small was designed to be "quickly trained on a single GPU," which Potts reads as another sign of the growing focus on efficiency.

## seq2seq: T5 and BART

**Tasks.** The slides first list tasks with natural seq2seq structure: machine translation, summarization, free-form question answering, dialogue, semantic parsing, and code generation. The broader class is encoder–decoder, which doesn't have to involve sequences.

**From RNNs to the Transformer.** Potts adds some history. RNN seq2seq models first gained lots of attention mechanisms so the decoder could look back at the encoder (the slides cite [Luong et al. 2015](https://aclanthology.org/D15-1166/)). The Transformer then embraced attention fully and dropped recurrence.

**Three architectures.** The slides use Figure 4 from the [T5 paper](https://arxiv.org/abs/1910.10683): encoder–decoder; a standard language model (causal mask throughout); and a prefix LM (full attention over the input, causal over the output). Potts notes that the last two became more common as GPT models got bigger.

**T5.** An encoder–decoder with extensive multi-task supervised and unsupervised training. Its most forward-looking idea is the task prefix: putting a natural-language instruction like "translate English to German:" before the input. Potts says this gave an early glimpse of in-context learning. Releases range from 60M to 11B parameters; [FLAN-T5](https://arxiv.org/abs/2210.11416) is the instruction-tuned version.

**BART.** [BART](https://aclanthology.org/2020.acl-main.703/) has a BERT-like encoder and a GPT-like decoder. The interesting part is pretraining: corrupt the input, then learn to restore it. Corruptions include text infilling, sentence shuffling, token masking, token deletion, and document rotation. The video says the best combination was text infilling plus sentence shuffling. Fine-tuning uses no corruption. For classification, uncorrupted input goes to both the encoder and decoder, and the final decoder state is used for the prediction. For seq2seq tasks, you feed the input and output as usual.

## Distillation: a large teacher trains a small student

As models keep growing, distillation is one way to shrink them: train a student whose input-output behavior matches the teacher's but is more efficient to run.

**Levels of objectives.** The slides list them from lightest to heaviest; in practice people often use weighted combinations:

0. Gold labels for the task, if available
1. The teacher's output labels. The lightest option: you don't even need access to the teacher during distillation, just one earlier pass
2. The teacher's output score vectors ([Hinton et al. 2015](https://arxiv.org/abs/1503.02531))
3. The teacher's final output states, pulled together with a cosine loss ([DistilBERT](https://arxiv.org/abs/1910.01108))
4. Other hidden states and embeddings
5. Training the student to mimic the teacher's counterfactual behavior under internal interventions ([Wu et al. 2022](https://aclanthology.org/2022.naacl-main.318/), work Potts was involved in)

**Training modes.** The standard setup freezes the teacher and updates only the student. There's also multi-teacher distillation, co-distillation (training both at once, also called online distillation), and self-distillation (aligning some parts of a model with other parts of the same model).

**Results.** Using GLUE as the yardstick, the slides list three consistent results. DistilBERT distilled 12-layer BERT-base into 6 layers while keeping 97% of GLUE performance. [Sun et al. 2019](https://aclanthology.org/D19-1441/) distilled to 3 and 6 layers. [Jiao et al. 2020](https://aclanthology.org/2020.findings-emnlp.372/) distilled to 4 layers.

## Wrap-up: what got left out, and the 2023 outlook

**Making amends.** Video 13 covers three architectures there wasn't time for:

- [Transformer-XL](https://arxiv.org/abs/1901.02860): caches states from earlier parts of a long sequence and links them into the current computation with recurrent connections
- XLNet: uses an autoregressive loss but samples many permutations of the input order, so it still gets bidirectional context. This is the answer to BERT's limitation 4
- [DeBERTa](https://arxiv.org/abs/2006.03654): separates word and position representations, each with its own attention

**Pretraining data.** Potts says he feels "guilty" that the series didn't cover pretraining data, so he lists OpenBookCorpus, [The Pile](https://arxiv.org/abs/2101.00027), BigScience data, Wikipedia processing tools, and Pushshift Reddit. The point isn't to train your own large model. It's to **audit** these datasets and understand where the models you have are likely to succeed and where they may be seriously problematic.

**Four trends as of 2023** (as stated on the slide; this post doesn't update them):

1. Autoregressive architectures seem to have taken over, possibly just because the field is focused on generation
2. Bidirectional models may still have the edge for representation
3. seq2seq is still a dominant choice for tasks with that structure
4. People are still obsessed with scaling up, but there's a counter movement toward "smaller" models (still around 10B parameters)

## Hands-on: static word vectors from BERT

The notebook for this unit is [vsm_03_contextualreps.ipynb](https://github.com/cgpotts/cs224u/blob/main/vsm_03_contextualreps.ipynb). Two caveats first: its version string says "Spring 2022," and the [README](https://github.com/cgpotts/cs224u/) marks all the `vsm_*` material as background.

It asks an interesting question: can a model that only supplies contextual representations give us good static word vectors? It builds on [Bommasani et al. 2020](https://aclanthology.org/2020.acl-main.431/).

What the notebook does:

- Loads `bert-base-cased` and shows how the tokenizer splits "Bert knows Snuffleupagus"
- Uses `output_hidden_states=True` to get 13 sets of hidden states: the embedding layer plus 12 layers
- Flags an easy mistake: don't use `pooler_output` for [CLS], because `transformers` adds randomly initialized parameters on top of it for fine-tuning. Use `last_hidden_state[:, 0]` instead
- **The decontextualized approach**: feed a single word through the model and pool its pieces if it's split. Bommasani et al. found mean pooling best overall
- **The aggregated approach**: find every occurrence of the word in a corpus and average its representations

Running the whole notebook requires the course's [data.tgz](http://web.stanford.edu/class/cs224u/data/data.tgz) (still downloadable when checked on 2026-09-29). The first half, on tokenizing and hidden states, needs no data.

**What you can do tonight**: run up to the `len(reps.hidden_states)` cell and confirm you get 13. Then change `bert_weights_name` to `roberta-base` and compare how the same sentence gets tokenized.

**Further reading**: [CS224N guide: pretraining](/posts/ai/2026-08-22-cs224n-pretraining-en) covers encoder, decoder, and encoder–decoder pretraining from another course.

## Gaps in the materials

- Slides 50–51 paste table screenshots from the RoBERTa paper, and the extracted PDF text has misaligned columns. This post only uses numbers the video confirms and that can be read from the slide tables.
- ELECTRA's efficiency and generator-size curves are figures from the paper; this post only relays how the video describes them.
- This unit has no homework of its own. The first homework is where you actually fine-tune these models.

**Series navigation**: Previous: [Contextual representations I: guiding ideas, the Transformer, and positional encoding](/posts/ai/2026-09-29-cs224u-contextual-reps-transformer-en) | Next: [HW1: multi-domain sentiment analysis and the bake-off](/posts/ai/2026-09-29-cs224u-hw1-multidomain-sentiment-en)

## References

- [CS224U course website (Spring 2023)](https://web.stanford.edu/class/cs224u/)
- [Contextual word representations slides (handout PDF)](https://web.stanford.edu/class/cs224u/slides/cs224u-contextualreps-2023-handout.pdf)
- [XCS224U Spring 2023 YouTube playlist (videos 07–13)](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [vsm_03_contextualreps.ipynb (cgpotts/cs224u)](https://github.com/cgpotts/cs224u/blob/main/vsm_03_contextualreps.ipynb)
- [Radford et al. (2018). Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Devlin et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://aclanthology.org/N19-1423/)
- [Liu et al. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692)
- [Clark et al. (2020). ELECTRA: Pre-training Text Encoders as Discriminators Rather Than Generators](https://arxiv.org/abs/2003.10555)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer (T5)](https://arxiv.org/abs/1910.10683)
- [Lewis et al. (2020). BART](https://aclanthology.org/2020.acl-main.703/)
- [Sanh et al. (2019). DistilBERT](https://arxiv.org/abs/1910.01108)
- [Hinton, Vinyals & Dean (2015). Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
- [Wu et al. (2022). Causal Distillation for Language Models](https://aclanthology.org/2022.naacl-main.318/)
- [Sun et al. (2019). Patient Knowledge Distillation for BERT Model Compression](https://aclanthology.org/D19-1441/)
- [Jiao et al. (2020). TinyBERT](https://aclanthology.org/2020.findings-emnlp.372/)
- [Rogers, Kovaleva & Rumshisky (2020). A Primer in BERTology](https://aclanthology.org/2020.tacl-1.54/)
- [Luong, Pham & Manning (2015). Effective Approaches to Attention-based Neural Machine Translation](https://aclanthology.org/D15-1166/)
- [Chung et al. (2022). Scaling Instruction-Finetuned Language Models (FLAN-T5)](https://arxiv.org/abs/2210.11416)
- [Dai et al. (2019). Transformer-XL](https://arxiv.org/abs/1901.02860)
- [He et al. (2021). DeBERTa](https://arxiv.org/abs/2006.03654)
- [Gao et al. (2020). The Pile](https://arxiv.org/abs/2101.00027)
- [Bommasani, Davis & Cardie (2020). Interpreting Pretrained Contextualized Representations via Reductions to Static Embeddings](https://aclanthology.org/2020.acl-main.431/)
