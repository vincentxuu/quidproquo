---
title: "NTHU NLP RAG Labs + HW4: Building a Cat-Facts RAG Two Ways, with LangChain and by Hand"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, homework, rag, langchain, ollama]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 17
tldr: "Each of the two RAG TA sessions builds one version. The first installs Ollama on Colab to run llama3.2:1b and wires up a minimal RAG with LangChain's Chroma, MMR, and retrieval chain. The second uses LangChain only for data prep and writes the rest by hand: chunking, text and vector stores, hybrid BM25 + cosine retrieval merged with RRF, then generation with Llama-3.2-1B-Instruct. HW4 applies the first session's skeleton to 150 cat facts and 150 GPT-5-generated QA pairs. The generator must be Llama3.2-1b and the embedding model jina-embeddings-v2-base-en, and you report recall@1, recall@5, and exact match. Code is 45% of the grade and the report 55%; the report analyzes how prompts, data format, document order, and counterfactual information change the results."
description: "A guide to the two RAG TA sessions and Assignment 4 in Hung-Yu Kao's Natural Language Processing course at National Tsing Hua University (Fall 2025): installing Ollama on Colab, each component of the LangChain RAG, hybrid retrieval and RRF without LangChain, retrieval evaluation, the HW4 dataset, TODO1–5 weights, report questions, submission rules, and the inconsistencies in the materials worth sorting out first. No solutions."
draft: false
glossary:
  - term: "Ollama"
    definition: "A tool for downloading and running open LLMs locally (macOS, Linux, Windows). ollama pull fetches a model, ollama serve starts the service, and it plugs into frameworks such as LangChain."
    context: "RAG lab 1 and HW4 open a terminal inside Colab with colab-xterm to install Ollama and run llama3.2:1b."
  - term: "exact match"
    aliases: ["EM"]
    definition: "A QA metric: an answer counts only if it matches the reference exactly, usually after normalization such as lowercasing and stripping punctuation."
    context: "The HW4 handout evaluates generation with exact matching, while the starter notebook's comment says a response counts as correct if the answer appears in it, which is much looser."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post is based on materials from Hung-Yu Kao's Natural Language Processing course at National Tsing Hua University (NTHU), Fall 2025: [rag_tutorial_1.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_1.pdf) (cover dated 2024/11/28), [rag_tutorial_2.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_2.pdf) (cover dated 2024/12/05), [RAG_tutorial_1.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/RAG_tutorial_1.ipynb), [RAG_lab_2](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/RAG_lab_2), and the handout PDF, `main.ipynb`, `cat-facts.txt`, and `questions_answers.txt` in [Assignment4](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment4). Both TA slide decks are reused from 2024. The recordings are W13's [RAG1](https://youtube.com/live/anCghHOjzV0) and [RAG2](https://youtube.com/live/RpLqfqR2OZI) plus the [HW4 walkthrough](https://youtu.be/JvThEbeOZbs), all in Mandarin. None has a caption track, so I did not check them section by section. I checked every fact against the official materials on 2026-09-30. Access level **A3**: the handout, starter code, and data are public. What's missing is NTU COOL for submission, the grading script, and solutions.

**Series**: previous [LLM API lab](/posts/ai/2026-09-30-nthu-nlp-llm-api-en) | next [Course summary and LLM reasoning notes](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning-en) | [Series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=JvThEbeOZbs
title: HW4 walkthrough (in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=anCghHOjzV0
title: W13 Tuesday: RAG1
```

Original videos: [HW4 walkthrough (in Mandarin)](https://www.youtube.com/watch?v=JvThEbeOZbs)、[W13 Tuesday: RAG1](https://www.youtube.com/watch?v=anCghHOjzV0)、[W13 Thursday: RAG2](https://www.youtube.com/watch?v=RpLqfqR2OZI)、[W11 Thursday recording (in Mandarin)](https://www.youtube.com/watch?v=cRSaBtoTDag)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

## Timeline: the assignment came before the labs

The [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) lists HW4 and its walkthrough in the W12 row; the walkthrough was uploaded on 2025-11-20. The two RAG labs are in W13 (2025-11-24 and 11-26). At the start of the [W11 Thursday lecture](https://www.youtube.com/live/cRSaBtoTDag), Kao said HW4 was meant to go out that week but was pushed back one week because the RAG material and the lab videos weren't ready. The handout gives three weeks to finish.

So the real order was: finish the [RAG lectures](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers-en), get the assignment, then attend the labs. For self-study, follow this post's order: lab 1, lab 2, HW4.

## Lab 1: a minimal RAG with LangChain + Ollama

### Running a local model on Colab

The slides introduce two tools. [LangChain](https://www.langchain.com/) is a framework for building LLM apps. [Ollama](https://ollama.com/) runs LLMs locally; the slides list its strengths as easy install, many supported models, automatic GPU use, LangChain integration, and data that never leaves for a third party.

Setup steps:

1. On Colab, choose Python 3 with a T4 GPU (the slides warn free GPU time is limited)
2. Request access to [Llama-3.2-1B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct) on Hugging Face and log in with an access token. The notebook notes that Ollama alone needs no login
3. `pip install colab-xterm`, `%load_ext colabxterm`, then `%xterm` to open a terminal in a cell
4. In the terminal, run `curl -fsSL https://ollama.com/install.sh | sh`, `ollama serve`, and `ollama pull llama3.2:1b`. Idle too long and the connection drops, so rerun `ollama serve`

### Five components

The notebook uses `llama3.2:1b` for generation and `jinaai/jina-embeddings-v2-base-en` for embeddings. The knowledge base is just six sentences about Florida and Miami Dade College. The components, in order:

- **LLM and embeddings**: `Ollama(model=MODEL)` and `HuggingFaceEmbeddings(...)` with `normalize_embeddings` set to False. A slide note explains that cosine similarity already normalizes during computation, so normalizing beforehand is redundant
- **Prompt**: a `ChatPromptTemplate` whose system message says to answer from the given context, say you don't know if you don't, and use at most three sentences; the human message is `{input}`
- **Vector store**: the slides compare Chroma (a vector database with metadata filtering) and FAISS (Meta's similarity-search library, using IVF or HNSW for approximate nearest-neighbor search). The notebook uses Chroma, then `.as_retriever(search_type="mmr", search_kwargs={"k": 3, "fetch_k": 5})`: fetch 5 documents and let MMR pick 3
- **Chain**: `create_stuff_documents_chain` stuffs documents into the prompt, and `create_retrieval_chain` puts retrieval in front
- **Run**: `chain.invoke({"input": query})`, passing only the question

The site has a [dedicated post on MMR](/posts/ai/2026-03-12-mmr-diversity-reranking-en).

## Lab 2: taking the retriever apart without LangChain

Slide 4 states the goal: apart from data prep, skip LangChain and see what the database, the retriever, and generation each do.

**Data prep**: `WebBaseLoader` scrapes a LinkedIn article about RAG by class name. The text is cleaned of newlines, repeated punctuation, URLs, HTML tags, and special characters, then `TokenTextSplitter` cuts it with the embedding model's tokenizer into 100-token chunks with 20 tokens of overlap. The slides give two reasons to chunk: the top-k chunks plus the query must fit the length limit, and long passages drag irrelevant content into the answer.

**Building the stores**: each chunk gets an id and is saved to `text_db.json` (text) and `vector_db.json` (text plus vector). For BM25, the text is lowercased and tokenized, indexed with `rank_bm25`'s `BM25Okapi`, and pickled. The slides stress that real systems hold millions of chunks, so saving and loading efficiently matters.

**Three retrievers**:

| Retriever | How it works |
|---|---|
| Dense | Cosine similarity between the query vector and each chunk vector, sorted by score |
| Sparse | BM25 scores for each chunk, sorted |
| Hybrid | RRF (Reciprocal Rank Fusion) merges the two rankings: each document scores 1/(k + dense rank) + 1/(k + sparse rank), with k defaulting to 60. A document missing from one list gets that list's last rank plus one |

`personal_retriever()` wraps all three into one function that returns the top of the hybrid ranking. The site's [hybrid search post](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) goes deeper on the engineering.

**Generation**: transformers loads `meta-llama/Llama-3.2-1B-Instruct` in float16, the question and retrieved chunks fill a prompt (noted as based on LangChain hub's `rlm/rag-prompt`), and it generates with `max_new_tokens=300`. The slides note that inference time grows in proportion to `max_new_tokens`. The notebook also runs once without context, so you can compare with and without RAG.

**Retrieval evaluation**: switching to the cat-facts data HW4 uses, it checks for each question whether the gold sentence appears in the top 3, and reports Recall@3 plus a score it calls precision. Slide 29 explains with an example: when the single correct answer ranks first, recall at top 1, 2, and 3 is 1/1 each time, while precision is 1/1, 1/2, and 1/3.

### Two things to watch in the code

- `personal_retriever()` takes a `topk` parameter but hard-codes `topk = 3` inside, so passing a different value does nothing. HW4 asks for recall@5, so fix this if you reuse it
- The evaluation loop's "precision" adds 1/(j+1) when the hit is at rank j, then averages. That is mean reciprocal rank (MRR@3), not precision@k as usually defined

## HW4: a RAG for cat facts

### The task

From the handout:

- **Task**: QA with RAG, short answers
- **Database**: cat-facts from [ngxson/demo_simple_rag_py](https://huggingface.co/ngxson/demo_simple_rag_py), 150 facts, one sentence each. For example: "The technical term for a cat's hairball is a "bezoar.""
- **Test set**: 150 QA pairs, which the handout says were generated by GPT-5, in the same order as the facts. `questions_answers.txt` has one line of question and one line of answer per pair, with short answers like "Two thirds" or "Taste mutation"
- **Constraint**: the generator is Llama-3.2-1B, frozen; no fine-tuning
- This time you **may modify the code template**

### TODOs and weights

| Item | What | Weight |
|---|---|---|
| TODO1 | Set up Ollama: colab-xterm, install Ollama, pull llama3.2:1b, `ollama serve` | 5% |
| TODO2 | Load cat-facts and build a Chroma retrieval store from `Document` objects | 10% |
| TODO3 | Write the system prompt | 10% |
| TODO4 | Build and run the stuff-documents chain and retrieval chain. Not using jina-embeddings-v2-base-en with Llama3.2-1b halves this score | 10% |
| TODO5 | Improve the system so the LLM answers the 150 questions correctly (still Llama3.2-1b) | 10% |
| Report | See below | 55% |

For the code part, you submit a JSON file where each entry has `Query`, `Ground_Truth`, and `Prediction`, and the report includes a screenshot of the test log and accuracy. Report recall@1 and recall@5 for retrieval and exact match for generation. Missing any of these halves TODO5.

Report questions:

- (5%) Describe your RAG system: its components, your prompt, and what you added beyond the lab code
- (10%) How different prompts change performance
- (10%) How different input data formats for the retriever change performance
- (10%) How the order of retrieved documents fed to the generator changes performance
- (10%) How generation holds up when counterfactual information is added to the generator's input
- (10%) Anything else that strengthens the report

The last three map directly onto the noise types and four abilities in [RAG, Part 2](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced-en). The counterfactual question is the lecture's counterfactual robustness, now yours to measure.

### Submission rules

Submit one zip: code (.py or .ipynb), predictions (.json), `requirements.txt`, and the report (.docx or .pdf), named `NLP_HW4_school_studentID`. The report must state the environment and Python version. If you use generative AI, say so in both code comments and the report, and link any code taken from the web. Highly similar submissions lose 100 points each. Submission goes through NTU COOL, which outside readers can't access.

### Inconsistencies in the materials

Before you start, know where these don't line up:

1. **Evaluation**: the handout says exact matching, but a comment in `main.ipynb` says a response counts as correct if the answer shows up in it, which is far looser. A 1B model rarely outputs just "Two thirds," so the choice swings the score a lot. State in your report which one you used
2. **Question count**: two handout slides and the notebook's TODO5 comment say "ten questions," while the grading table says 150 and the data file has 150 pairs. Go with 150
3. **Penalty table**: that slide's filename examples say `NLP_HW3_...`, carried over from the previous assignment. Follow the filenames on the HW4 slide
4. **Package versions**: `main.ipynb` pins LangChain to the 0.2 series (`langchain>=0.2.0,<0.3.0` and friends), while the lab notebooks don't pin at all. Code written from the labs may hit import-path differences in the HW4 environment

## How to self-study this unit

1. Run the lab 1 notebook first and make sure Ollama starts on Colab. That's the step HW4 most often gets stuck on.
2. Read lab 2's `helper_functions.py`, which holds the functions HW4's retrieval evaluation uses, and fix the hard-coded `topk` while you're there.
3. For HW4, change nothing at first. Get baseline recall@1, recall@5, and EM, then change one variable at a time (prompt, data format, document order). That is exactly the analysis the report asks for.

One thing to try tonight: download `cat-facts.txt` and `questions_answers.txt` and, with no model at all, run BM25 over the 150 questions and compute recall@1. That number is your retrieval floor. Whatever embedding or hybrid setup you try later has to beat it to count as progress.

## Further reading

- Chunking: [Chunking strategies decide whether RAG finds the answer](/posts/ai/2026-03-12-chunking-strategies-en)
- Evaluating RAG: [RAG evaluation frameworks and tool selection](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)
- Another course's RAG assignment: [CS224U Assignment 2: OpenQA and DSPy](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Tried to check the video content against transcripts. The YouTube pages of W13 Tuesday (anCghHOjzV0) and the HW4 walkthrough (JvThEbeOZbs) have no captions, so they could not be checked and no content-check note was added. The W11 Thursday captions do confirm that the professor said at the start that HW4 is delayed a week because the RAG material and the TA-session videos were not ready, matching the timeline section.

## References

- [rag_tutorial_1.pdf (cover dated 2024/11/28)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_1.pdf) — LangChain, Ollama, Colab setup, Chroma/FAISS, MMR, retrieval chain
- [rag_tutorial_2.pdf (cover dated 2024/12/05)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/rag_tutorial_2.pdf) — data prep, chunking, dense/sparse/hybrid retrieval, RRF, generation, retrieval evaluation
- [RAG_tutorial_1.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/RAG_tutorial_1.ipynb) — the LangChain RAG
- [RAG_lab_2 (RAG_tutorial_2.ipynb, helper_functions.py)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference/RAG_lab_2) — the hand-built RAG and cat-facts retrieval evaluation
- [Assignment4](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment4) — NTHU_NLP_HW4_RAG.pdf, main.ipynb, cat-facts.txt, questions_answers.txt, report template
- [NTHU NLP 2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) — HW4 in the W12 row, RAG labs in the W13 row
- [HW4 walkthrough (in Mandarin)](https://youtu.be/JvThEbeOZbs) — uploaded 2025-11-20
- [W13 Tuesday: RAG1](https://youtube.com/live/anCghHOjzV0) and [W13 Thursday: RAG2](https://youtube.com/live/RpLqfqR2OZI) (in Mandarin)
- [W11 Thursday recording (in Mandarin)](https://www.youtube.com/live/cRSaBtoTDag) — opens with the one-week HW4 delay
- [ngxson/demo_simple_rag_py (Hugging Face)](https://huggingface.co/ngxson/demo_simple_rag_py) — original source of cat-facts
- [meta-llama/Llama-3.2-1B-Instruct](https://huggingface.co/meta-llama/Llama-3.2-1B-Instruct) — gated; requires an access request
- [Ollama llama3.2](https://ollama.com/library/llama3.2) — the generator HW4 requires
