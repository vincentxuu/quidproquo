---
title: "NTHU NLP RAG, Part 2: Connecting the Retriever to a Reader, from ORQA and REALM to Self-RAG"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, rag, retrieval, self-rag]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 15
tldr: "The second half of W11_RAG.pdf starts at the \"From Retrievers to QA\" slide and turns a retriever plus a reader into a full QA system. It begins with ORQA and REALM (2019–2020), where BERT is the reader, then covers the first paper named RAG and REPLUG, which keeps the LLM frozen. A single table then sorts seven recent fixes into three groups: rewrite the query (Query Rewriting, HyDE), make the generator robust to noise (RetRobust, RAFT, RAAT), and decide when to retrieve (FLARE, Self-RAG). It ends with noise types, four abilities an LLM needs inside RAG, and generative retrieval (GR) with reliable response generation (RRG). On the recording side, the W11 Thursday lecture stops at the RAG paper; I could not find a recording that covers the later slides."
description: "A guide to the second half of the RAG unit in Hung-Yu Kao's Natural Language Processing course at National Tsing Hua University (Fall 2025): BERT reading comprehension, ORQA and the Inverse Cloze Task, REALM, RAG and FiD, REPLUG / REPLUG LSR, Query Rewriting, HyDE, RetRobust, RAFT, FLARE, RAAT, Self-RAG, noise types and four abilities, Generative Retrieval and RRG, plus exactly which slides the recordings cover."
draft: false
glossary:
  - term: "Inverse Cloze Task"
    aliases: ["ICT"]
    definition: "Take a random sentence out of a passage as the query, keep the rest as the positive passage, add other passages as negatives, and train the retriever to match the sentence back to its source. No labels needed."
    context: "ORQA uses ICT as continued pre-training for BERT, so the query and passage encoders can retrieve before fine-tuning."
  - term: "REPLUG LSR"
    aliases: ["LM-Supervised Retrieval"]
    definition: "Keep the LLM frozen and train only the retriever: push the retriever's distribution over documents toward the distribution of which documents best help the LLM produce the right answer."
    context: "The W11 slides use it to show how an LLM too large to train can still sit inside RAG."
  - term: "reflection token"
    definition: "Special tokens Self-RAG adds to the vocabulary, such as [Retrieve], [IsRel], [IsSup], and [IsUse], so the model marks during generation whether to retrieve, whether a passage is relevant, whether the answer is supported, and whether it is useful."
    context: "The slides note these token settings can be tuned at inference to trade precision against fluency."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced)

> **Version note**: This post is based on slides 60–125 of [W11_RAG.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W11_RAG.pdf) from Hung-Yu Kao's Natural Language Processing course at National Tsing Hua University (NTHU), Fall 2025, plus the Chinese caption tracks of the [W11 Tuesday](https://www.youtube.com/live/chIewpk4-q0) and [W11 Thursday](https://www.youtube.com/live/cRSaBtoTDag) recordings. The lectures are in Mandarin. I checked every fact against the official materials on 2026-09-30. Access level **A3**: slides and recordings are public. This unit has no assignment of its own; the hands-on part is in [the RAG labs and HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4-en).

**Series**: previous [RAG, Part 1: hallucination and retrievers](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en) | next [LLM API lab](/posts/ai/2026-09-30-nthu-nlp-llm-api-en) | [Series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Course video sources

These recordings correspond to the material discussed here. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=chIewpk4-q0
title: W11 Tuesday recording (Fall 2025, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=cRSaBtoTDag
title: W11 Thursday recording (Fall 2025, in Mandarin)
```

Original videos: [W11 Tuesday recording (Fall 2025, in Mandarin)](https://www.youtube.com/watch?v=chIewpk4-q0)、[W11 Thursday recording (Fall 2025, in Mandarin)](https://www.youtube.com/watch?v=cRSaBtoTDag)、[W12 Tuesday recording (Fall 2025, in Mandarin)](https://www.youtube.com/watch?v=XGWuVpVTwTQ)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## Where this picks up, and what the recordings cover

The [previous post](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en) finished the retriever story, from BM25 to DPR. All of it was about finding the right passage. Slide 60, "From Retrievers to QA," asks a new question: once you have the passage, who reads it, how, and what happens if you train the whole pipeline together? Its example asks what year Oppenheimer was born. The LLM without retrieval says 1967, which is actually the year he died. With a Wikipedia passage attached, it says 1904. The slide also notes that the generator is called the "reader," because QA is a reading-comprehension task.

The recordings need a word first. In the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md), this slide deck sits in the W10 row. The W11 row has no slides, only two recordings. I read the caption tracks of both W11 recordings:

| Recording | Length | Content (from captions) |
|---|---|---|
| [W11 Tuesday](https://www.youtube.com/live/chIewpk4-q0) (2025-11-11) | 1:42:39 | A term-project topic change, then retrievers: BoW, TF-IDF, BM25, whether CLS is enough, Siamese networks, SimCSE, DPR, GTR. It stops at the retriever/reader boundary |
| [W11 Thursday](https://www.youtube.com/live/cRSaBtoTDag) (2025-11-13) | 48:53 | The first 19 minutes cover term-project checkpoints and peer-review rules, and announce that HW4 is pushed back a week. From about minute 20: ORQA, ICT, REALM. The last few minutes start the RAG paper, with the rest promised for next week |

So the first three sections below, from BERT reading comprehension to the RAG paper, can be checked against a recording. Slides 76–125, from REPLUG onward, are not covered in either W11 recording. The W12 Tuesday recording ([XGWuVpVTwTQ](https://www.youtube.com/live/XGWuVpVTwTQ)) is the likeliest continuation, but it has no caption track and I could not confirm its content. The second half of this post relies on the slides alone.

## When the reader was BERT: ORQA and REALM

The slides split open-domain QA into two branches: the reader is an encoder (BERT), or the reader is a generator (such as BART). The first branch comes first.

**BERT for reading comprehension** (slide 63): concatenate the question and the passage with `[SEP]` and feed them to BERT. Each passage position's hidden state goes through a linear layer that outputs start logits and end logits. The argmax of each gives the answer's start and end. The answer is always a span copied from the passage.

**ORQA** ([Lee et al., ACL 2019](https://arxiv.org/abs/1906.00300), slides 64–69) extends this to open-domain QA with three BERTs:

- BERT_Q encodes the query and BERT_B encodes evidence blocks. A dot product between them picks the top-k blocks
- BERT_R is the reader and extracts the answer from those blocks. The slide's example asks what the ZIP in ZIP code stands for: "Zone Improvement Plan"

The key is how the retriever gets trained in the first place. ORQA uses the **Inverse Cloze Task**. A normal cloze task masks a word and asks the model to guess it. ICT flips that: take a random sentence out of a passage as the query and ask the model to find the passage it came from among many blocks. It is continued pre-training starting from pre-trained BERT, and it needs no labels. Pre-training trains BERT_Q and BERT_B; fine-tuning trains BERT_Q and BERT_R.

In the recording, Kao connects ICT to RAG today. The data you want to retrieve is usually new to both the embedding model and the LLM, and it is full of domain terms. A task like ICT lets the model get used to what your data looks like. He also warns that fine-tuning an encoder yourself is hard to get right. Done badly, it can score worse than using a pre-trained model with mean pooling, so with ordinary resources his group does not fine-tune its own.

**REALM** ([Guu et al., ICML 2020](https://arxiv.org/abs/2002.08909), slides 70–73) replaces ICT with MLM pre-training. The input sentence contains `[MASK]`; the retriever finds the 5 most similar documents and appends them; a knowledge-augmented encoder fills in the blank. The MLM loss updates the language model and also flows back into the retriever's encoder, so the retriever gradually learns which documents help most with the prediction.

The slides list three difficulties: the corpus is all of Wikipedia, so the index lives at the embedding level; the input itself contains `[MASK]`; and the whole pipeline trains end to end. Kao's take in the recording: you can wire it up and hit train, but getting it to train well is another matter.

## The reader becomes a generator: RAG and REPLUG

**RAG** ([Lewis et al., NeurIPS 2020](https://arxiv.org/abs/2005.11401), slide 75) is the first paper to use the name "RAG." The slide makes three points: no pre-training, only fine-tuning on open-domain QA; the retriever and generator are fine-tuned jointly; and MIPS (Maximum Inner-Product Search) speeds up vector search, supported by packages like FAISS. The same slide recommends reading [FiD (Fusion-in-Decoder)](https://arxiv.org/abs/2007.01282) alongside it.

This is where the W11 Thursday lecture ends. Kao's verdict: the retrieve-then-generate flow already existed in the earlier papers. What the RAG paper did was swap in a better generator and a better retriever.

**REPLUG** ([Shi et al., NAACL 2024](https://aclanthology.org/2024.naacl-long.463/), slides 76–79) handles the case where the LLM is too large to train:

- **At inference**: each retrieved document is concatenated with the input and sent to the LLM separately. The resulting output distributions are then combined
- **REPLUG LSR**: the LLM stays frozen and only the retriever trains. The retriever's distribution over documents, P_R(d|x), is pushed toward Q(d|x), the distribution of which documents best help the LLM generate a good answer

Slide 79, comparing REPLUG with REPLUG LSR, leaves a question: why evaluate REPLUG with BPB (bits per byte)? The slides give no answer. It is worth coming back to after reading the paper.

## Seven recent fixes in three groups

Slide 80 maps out the rest of the deck in one table:

| Group | Method | Venue (per the slides) |
|---|---|---|
| Enhancing retrieval | Query Rewriting | EMNLP 2023 |
| Enhancing retrieval | HyDE | ACL 2023 |
| Enhancing RAG | RetRobust | ICLR 2024 |
| Enhancing RAG | RAFT | COLM 2024 |
| Enhancing RAG | Self-RAG | ICLR 2024 |
| Enhancing RAG | RAAT | ACL 2024 |
| Continual retrieval | FLARE | EMNLP 2023 |

### Better retrieval: make the query look like a document

**Query Rewriting** ([Ma et al.](https://arxiv.org/abs/2305.14283), slides 81–84) starts from the gap between the input text and the knowledge you actually need to look up. The example is "What profession does Nicholas Ray and Elia Kazan have in common?" Sent as is, it retrieves poorly. Rewritten as two queries, "Nicholas Ray profession" and "Elia Kazan profession," it finds each person's bio.

**HyDE** ([Gao et al.](https://arxiv.org/abs/2212.10496), slides 85–86) goes further. An LLM (InstructGPT, per the slide) writes a fake answer passage first, and an unsupervised contrastively trained encoder uses that passage to find real documents. The slide has a side note in Chinese asking whether this suits every task and query. The next slide cites [Wang et al.'s 2024 best-practices study](https://arxiv.org/abs/2407.01219), which found HyDE can beat Query Rewriting on retrieval tasks. The site's [HyDE post](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings-en) covers the engineering side.

### A sturdier generator: don't get led astray by noise

**RetRobust** ([Yoran et al.](https://arxiv.org/abs/2310.01558), slides 87–91) starts with the problem. Retrieval can improve results, but it hurts on StrategyQA and Fermi, and random passages make things much worse. One slide explains [StrategyQA](https://arxiv.org/abs/2101.02235): each question needs several unstated reasoning steps. "Could a crocodile run a marathon?" requires knowing a marathon is about 42 km and crocodiles are semi-aquatic. RetRobust keeps the retriever fixed and trains the generator on QA data that mixes relevant and irrelevant documents.

**RAFT** ([Zhang et al.](https://arxiv.org/abs/2403.10131), slides 92–93) also fixes the retriever and trains the LLM on both correct and incorrect documents. The slides point out the difference from RetRobust: RAFT's answers include the reasoning (a CoT answer).

**RAAT** ([Fang et al.](https://arxiv.org/abs/2405.20978), slides 102–105) splits noise into three kinds: relevant noise that lacks the answer, irrelevant noise, and counterfactual noise. It uses adversarial training, fine-tuning on the noise that hurts the model most, plus an auxiliary task that detects the noise type. The slides leave two questions here: how do you get these annotations, and what has the model learned in any physical sense?

### Deciding when to retrieve: FLARE and Self-RAG

**FLARE** ([Jiang et al.](https://arxiv.org/abs/2305.06983), slides 94–101, titled "Active Retrieval Augmented Generation") starts from an observation. Traditional RAG retrieves once from the query before generating, and extra information can confuse the model. Asked to summarize Joe Biden, the retrieval results include his first wife's birthday and a quote from a speech. FLARE argues the model should retrieve only when it lacks knowledge, and the query should reflect what it is about to write. To detect a knowledge gap, it relies on language models being fairly well calibrated: when the next token's probability falls below a threshold θ, retrieval fires. In the slide's example, the model writes "Joe Biden attended," loses confidence, searches "Joe Biden University," and then writes "the University of Pennsylvania."

**Self-RAG** ([Asai et al.](https://arxiv.org/abs/2310.11511), slides 106–110) has the model critique and reflect on itself. For training, GPT-4 first labels reflection tokens; those labels are distilled into a critic model, which then produces training data for the generator. At inference the model emits `[Retrieve]`, `[IsRel]`, `[IsSup]` (is the answer supported by the passage), and `[IsUse]` (is it useful), keeping the top-B candidate segments at each step. The slides stress that these token settings can be adjusted at inference to trade precision against fluency, or accuracy against retrieval frequency. The site's [Self-RAG post](/posts/ai/2026-09-03-self-rag-reflection-tokens-en) makes a good companion.

## Challenges in modern RAG: noise and four abilities

Slides 111–116 narrow down to two challenges: the web is full of noise and even fake news, and we still don't understand well how much each model gains from retrieval. Four noise types are listed: semantically similar but missing the answer, counterfactual information, irrelevant information, and "black box digestion" (you can't see how the model absorbs the documents).

Four examples then show the abilities an LLM needs inside RAG:

| Ability | The slide's example |
|---|---|
| Noise Robustness | Asked about the 2022 Nobel Prize in Literature, with both the 2022 and 2021 winners in the documents, answer Annie Ernaux |
| Negative Rejection | With only the 2021 and 2020 winners retrieved, say there isn't enough information |
| Information Integration | Asked when the ChatGPT iOS app and the API launched, combine answers from two documents |
| Counterfactual Robustness | The documents wrongly say the 2004 Olympics were in New York; when warned they may contain errors, the model should flag the mistake and answer Athens |

## Last stop: generative retrieval and RRG

Slides 117–125 introduce Generative Information Retrieval, citing [a 2025 GenIR survey](https://arxiv.org/abs/2404.14851) and [an EMNLP 2023 paper on scaling generative retrieval to millions of passages](https://aclanthology.org/2023.emnlp-main.83.pdf). Several figures were generated with NotebookLM. The core is two new processes:

- **Generative Document Retrieval (GR)**: instead of computing vector similarity, train an LLM to map a query directly to a DocID. The slide asks how GR differs from traditional retrieval
- **Reliable Response Generation (RRG)**: the slides split approaches into strengthening internal knowledge and augmenting external knowledge

One slide title sums it up: "We need solution, not just documents." Users want answers, not just documents. The last slide, on RRG evaluation, is a figure with no text.

## How to self-study this unit

1. Read slides 60–75 first, with the [W11 Thursday recording](https://www.youtube.com/live/cRSaBtoTDag) from about minute 20. The ORQA → REALM → RAG line is a story about which component gets trained. Once it clicks, every later fix has a place to go.
2. Use the slide 80 table as a table of contents. For each method, ask: does it change the retriever, the generator, or the interface between them?
3. The open questions in the slides (BPB, where HyDE applies, where RAAT's labels come from, how GR differs) have no official answers. They make good study-group prompts.

One thing to try tonight: take a RAG system or ChatGPT conversation you already use and write one test for each of the four abilities on slides 113–116. For example, give it only outdated documents and see whether it refuses to answer. After four tests you'll know more about where your system breaks than seven papers would tell you.

## Further reading

- The same topic from another course: [CS224N Lecture 10: six components of RAG and language agents](/posts/ai/2026-08-22-cs224n-rag-language-agents-en)
- Retrieval evaluation and neural IR: [CS224U: information retrieval](/posts/ai/2026-09-29-cs224u-information-retrieval-en)
- The engineering landscape: [RAG patterns: a complete guide](/posts/ai/2026-03-14-rag-patterns-complete-guide-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [W11_RAG.pdf (Fall 2025)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W11_RAG.pdf) — slides 60–125: BERT reading comprehension, ORQA/ICT, REALM, RAG, REPLUG, the slide 80 method table, seven fixes, noise and four abilities, GenIR
- [NTHU NLP 2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — W11_RAG.pdf is in the W10 row; the W11 row has only two recordings
- [W11 Tuesday recording (Fall 2025, in Mandarin)](https://www.youtube.com/live/chIewpk4-q0) — the retriever part, ending at the retriever/reader boundary
- [W11 Thursday recording (Fall 2025, in Mandarin)](https://www.youtube.com/live/cRSaBtoTDag) — term-project and HW4-delay announcements, ORQA, ICT, REALM, start of the RAG paper
- [W12 Tuesday recording (Fall 2025, in Mandarin)](https://www.youtube.com/live/XGWuVpVTwTQ) — no caption track; content not confirmed here
- [Lee et al. 2019, ORQA](https://arxiv.org/abs/1906.00300)
- [Guu et al. 2020, REALM](https://arxiv.org/abs/2002.08909)
- [Lewis et al. 2020, RAG](https://arxiv.org/abs/2005.11401)
- [Izacard & Grave, FiD](https://arxiv.org/abs/2007.01282)
- [Shi et al. 2024, REPLUG](https://aclanthology.org/2024.naacl-long.463/)
- [Ma et al. 2023, Query Rewriting](https://arxiv.org/abs/2305.14283)
- [Gao et al. 2023, HyDE](https://arxiv.org/abs/2212.10496)
- [Wang et al. 2024, Searching for Best Practices in RAG](https://arxiv.org/abs/2407.01219)
- [Yoran et al. 2024, RetRobust](https://arxiv.org/abs/2310.01558)
- [Geva et al. 2021, StrategyQA](https://arxiv.org/abs/2101.02235)
- [Zhang et al. 2024, RAFT](https://arxiv.org/abs/2403.10131)
- [Jiang et al. 2023, FLARE](https://arxiv.org/abs/2305.06983)
- [Fang et al. 2024, RAAT](https://arxiv.org/abs/2405.20978)
- [Asai et al. 2024, Self-RAG](https://arxiv.org/abs/2310.11511)
- [From Matching to Generation: A Survey on Generative Information Retrieval](https://arxiv.org/abs/2404.14851)
- [How Does Generative Retrieval Scale to Millions of Passages?](https://aclanthology.org/2023.emnlp-main.83.pdf)
