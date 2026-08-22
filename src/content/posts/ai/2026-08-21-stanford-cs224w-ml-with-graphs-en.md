---
title: "Stanford CS224W: Every Assignment Runs in Colab, but the Biggest Slice of the Grade Is Closed to Self-Learners"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224w, ai-course, stanford, graph, knowledge-graph, graphrag]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 15
tldr: "All six CS224W Colabs download and run today, and the first one needs only NetworkX — no PyG install at all. But the exam is 35% of the grade, the largest single piece, and it's an in-person closed-book sitting. The public recordings stop at 2021 and cover none of the current syllabus's second half: graph transformers, relational deep learning, LLM+GNN."
description: "A full walkthrough of Stanford CS224W: Machine Learning with Graphs — two official pages that state different prerequisites, a course blurb eight years behind the actual syllabus, what the six Colabs really depend on and what hardware they want, why student projects end up as public Medium posts, and item by item what a self-learner can get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs)

[CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) is a 3–4 unit course in Stanford's CS department, taught by Jure Leskovec, offered only in the autumn, in NVIDIA Auditorium. Its subject is machine learning when your data is a set of relationships rather than a list of rows. It covers node embeddings, graph neural networks (GNNs), graph transformers, reasoning over knowledge graphs, and a block added in the last two years: deep learning directly on relational databases.

Outside Stanford the course is mostly known through the 2021 YouTube recordings. Those recordings still exist and are still good, but they no longer match the syllabus. Lecture 4 in 2021 was PageRank; across the nineteen lectures in the current schedule, that word appears in no lecture title at all.

This piece was written after reading the Autumn 2025 (Aut2526) primary materials one by one: the course site, the grading and honor-code terms on `info.html`, all three homework PDFs, all six Colab notebooks (downloaded and opened), the project handout, and the slides for three key lectures. It does **not** include a close reading of the assigned papers, and it does not include anything behind Canvas — I can't reach that, and I say so explicitly wherever it matters.

## The hard facts

The instructor is [Jure Leskovec](https://profiles.stanford.edu/jure-leskovec), a professor in Stanford's CS department and formerly Chief Scientist at Pinterest. Autumn 2025 added a guest instructor, Charilaos Kanatsoulis, credited alongside him on the slide covers.

The course runs in autumn only. The [ExploreCourses 2026-27 entry](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog) lists the next offering as Autumn 2026, with the same meeting times and the same room as 2025. Three to four units, letter grade or credit/no credit. Section number and dates are in the appendix.

The course site is blunt about where outsiders stand:

> "The lecture slides and assignments will be posted online as the course progresses. We are happy for anyone to use these resources, but we cannot grade the work of any students who are not officially enrolled in the class."

Materials open, grading closed. The recordings are described as "available on Canvas for all the enrolled Stanford students" — the current term's video is locked.

There are two paid routes, and both currently read Enrollment Closed: XCS224W in the AI Professional Program, and CS224W for graduate credit. Prices are in the appendix.

## Two official pages state different prerequisites

The reputation for a low barrier to entry is deserved, but which barrier you find depends on which page you open — and the two pages disagree.

The [Stanford Bulletin entry for CS224W](https://bulletin.stanford.edu/courses/1058241) and ExploreCourses share one sentence: `Prerequisites: CS109, any introductory course in Machine Learning.`

The Prerequisites section on the course's own site never mentions a machine learning course at all, and it calls probability optional:

> "Knowledge of basic computer science principles, sufficient to write a reasonably non-trivial computer program (e.g., CS107 or CS145 or equivalent are recommended) / Familiarity with the basic probability theory (CS109 or Stat116 are sufficient but not necessary) / Familiarity with the basic linear algebra (any one of Math 51, Math 103, Math 113, or CS 205 would be much more than necessary)"

Three items, and the language on every one is "recommended," "sufficient but not necessary," "much more than necessary." Nothing there is a hard gate. Lecture 1's slides take the same line: the course is "self-contained," and the difficulty lies in breadth rather than depth on any single topic. **The course offers no explanation for why the two official documents disagree.**

The neighbors put that in perspective. [CS224N](https://explorecourses.stanford.edu/search?q=CS224N&view=catalog) lists "calculus and linear algebra; CS124, CS221, or CS229" in the catalog — you must have finished a named 200-level course first. [CS246: Mining Massive Data Sets](https://explorecourses.stanford.edu/search?q=CS246&view=catalog), also Leskovec's, asks for "At least one of CS107 or CS145." That's lower than the catalog version of CS224W, and it happens to be exactly the first line of the CS224W **course-site** version.

In practice: if you've used PyTorch and your linear algebra hasn't gone cold, you already meet the course site's list.

## The course blurb stopped updating in 2018

The "Topics include" paragraph shared by the catalog and the course site names six things: representation learning and Graph Neural Networks, algorithms for the World Wide Web, reasoning over Knowledge Graphs, **influence maximization**, **disease outbreak detection**, and social network analysis.

That text is identical across the [2021 archived site](https://snap.stanford.edu/class/cs224w-2021/), the [2024 archived site](http://snap.stanford.edu/class/cs224w-2024), the current course site, and the 2026-27 catalog. The syllabus tells a different story:

- [Autumn 2018](http://snap.stanford.edu/class/cs224w-2018/) really did have full lectures on Influence Maximization in Networks and Outbreak Detection in Networks, plus Link Analysis: PageRank.
- By Autumn 2021 PageRank was still there (lecture 4); the other two no longer had lectures of their own.
- In the nineteen lectures of Autumn 2025, none of the three appears.

Three of the selling points you read in the catalog last showed up as actual lectures eight years ago. The course site doesn't say why the description was never updated.

**If you're coming for social network analysis or diffusion models, this course no longer teaches that.** The weight now sits on GNN expressiveness theory, graph transformers, and relational deep learning.

## Where the nineteen lectures put their weight

Lecture 1's self-description is explicit: node embeddings (DeepWalk, node2vec) → GNNs (GCN, GraphSAGE, GAT) → graph transformers → knowledge graphs and reasoning (TransE) → generative models for graphs (GraphRNN) → relational deep learning → GNNs + LLMs.

Relational deep learning (RDL) gets two full lectures and appears nowhere in the old recordings. Its setup: enterprise data already lives across many tables joined by foreign keys, and the traditional move is for a data scientist to hand-write SQL that flattens it into one feature table, then feed that to XGBoost.

Lecture 12's slides use a Stack Exchange task — will this user still be active in six months — as the comparison, with a data scientist of five years' experience implementing it for real. The manual route took roughly **682 lines of code**. The RDL numbers sit on the same slide; they're in the appendix.

The infrastructure behind this block is [RelBench](https://relbench.stanford.edu/), Stanford's own relational-database benchmark, which the slides describe as "Load as a PyG graph."

## What the assignments look like

Coursework splits into two tracks, spelled out on the [official info page](https://web.stanford.edu/class/cs224w/info.html):

| Item | Weight | Format | Can a self-learner get it? |
|---|---|---|---|
| 3 homework | 20% | Pen-and-paper derivations, PDFs public | Problems yes, solutions no |
| 5 Colabs (plus Colab 0) | 15% | Coding, notebooks public | Notebooks yes, autograding no |
| Exam | 35% | Two-hour in-person closed-book | **No, entirely** |
| Course project | 30% | Blog post + Colab or PR | Doable solo, examples all public |

**The exam cell is the dividing line.** It's the largest of the four, worth more than the three homeworks and five Colabs combined, and it's a two-hour in-person closed-book sitting where you may bring two double-sided cheat sheets. It covers lectures 1 through 16; lecture 17 happens the day after the exam and is out of scope.

The difficulty curve across the three written assignments is legible straight from the PDFs:

- **[Homework 1](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_HW1.pdf)** (11 pages): GNN expressiveness, random-walk matrices, over-smoothing, learning BFS with a GNN; then the equivalence between node embeddings and matrix factorization; a final section on GCNs.
- **[Homework 2](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_2.pdf)** (7 pages): rewrite the GIN and GraphSAGE update rules in the eigenvector basis of the adjacency matrix, then analyze the expressiveness of TransE and RotatE.
- **[Homework 3](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_3.pdf)** (8 pages): prove that self-attention with an adjacency mask is equivalent to message passing; the strengths and limits of Laplacian eigenvector positional encodings; LightGCN; and RDL computation graphs.

All three are derivations. None asks you to submit numbers produced by running code. The hands-on half lives entirely in the Colabs.

## Six Colabs, all of them downloadable and runnable

This is the most immediately useful section for a self-learner. Links to Colabs 0 through 5 hang off the schedule on the course site; I pulled each one through its Google Drive export URL, and **all six** returned 200 with a complete `.ipynb` — no Stanford account needed. Contents:

| Colab | Topic | Main libraries | Notebook flags GPU |
|---|---|---|---|
| 0 | Getting oriented (not submitted) | — | — |
| [1](https://colab.research.google.com/drive/1cNsHg6NClQyZiQEgRDCKoqofiik3y1XN) | Karate club network, one PageRank iteration, negative edge sampling, node2vec | NetworkX + PyTorch | No |
| [2](https://colab.research.google.com/drive/1DqySwyevHcM7OE1Sh3xWGyKD0Jcr95R5) | PyG data structures, ENZYMES, ogbn-arxiv node classification | PyG + OGB | No |
| [3](https://colab.research.google.com/drive/11F8K9lnVlGRNOeFWfyfeOim0NdxOdtae) | Writing your own MessagePassing layer, GraphSAGE | PyG + DeepSNAP | No |
| [4](https://colab.research.google.com/drive/1AaNEIaIZhRNMueJDdrnNLdwiYuwwfFP9) | GAT and multi-head attention | PyG | Yes |
| [5](https://colab.research.google.com/drive/1S6LFPJxYHtBkWFgA4Yc5E173y59_rWpl) | Heterogeneous graphs, DeepSNAP HeteroGraph, node property prediction | DeepSNAP + PyDrive | Yes |

Three details worth knowing up front.

**Colab 1 never touches PyG.** It uses only NetworkX and PyTorch, flags no GPU, and runs on any laptop. That's an unusual starting point across this whole Stanford series — most courses make their first programming assignment install an entire stack.

**Colabs 4 and 5 carry `"accelerator": "GPU"` in their notebook metadata**, but the Colab free tier covers that; you still don't need your own card.

**The environment has a shelf life.** These notebooks pin torch to `2.4.0` and install DeepSNAP straight from `git+https://github.com/snap-stanford/deepsnap.git`. The DeepSNAP repo was last pushed in November 2025 (mid-term, that term), while [PyG itself](https://github.com/pyg-team/pytorch_geometric) is still moving. When the install breaks, suspect the pinned torch version first.

Also, the notebooks are full of `if 'IS_GRADESCOPE_ENV' not in os.environ:` guards — those cells are skipped inside Gradescope's autograder. **You can run everything; nothing will tell you whether you got it right.**

## Student projects ship as public blog posts

This is the strangest thing about the course, and it happens to work in a self-learner's favor.

The [project handout](https://docs.google.com/document/d/1ffP5UGHRovHix4mBXweui62cj4L4sxib/edit) is publicly readable; I read it through a plain-text export. It opens by stating that the project's goal is to "create long-lasting resources for both your technical profiles and the graph machine learning community at large." Three options, all ending in a public artifact:

1. **A real-world application of GNNs**: blog post + Google Colab
2. **A tutorial on a PyG feature**: blog post + Google Colab
3. **An implementation of a frontier paper**: blog post + a pull request into the PyG `contrib` package

All three require the blog post, which is published on the course's own [Medium publication](https://medium.com/stanford-cs224w). That publication is live, and it carries a full batch of Fall 2025 project posts dated around the project report deadline. Topics range from EEG seizure-duration prediction to flight delays, power-grid unit commitment, and knowledge graph question answering; most are marked at fifteen minutes of reading or more.

**So this course inverts the usual distribution**: the recordings are locked in Canvas, but the deepest student output — full Colabs, reproducible — is public. The handout's writing requirements are concrete too: assume readers "are familiar with machine learning (e.g., CS229)" but "are not familiar with graph ML," and include a "Link to your Google Colab that can be used to reproduce your results."

There's also 1–3% of extra credit for getting a pull request accepted into OGB, PyG, or GraphGym.

## Which public resources are actually tied to this course

Leskovec's name is on a lot of public material, and not all of it belongs to CS224W. Going item by item:

**Tightly tied:**

- **[PyG (PyTorch Geometric)](https://pytorch-geometric.readthedocs.io/)**. Lecture 1's slides call it "The ultimate library for Graph Neural Networks," everything from Colab 2 onward uses it, and all three project options revolve around it. Leskovec's Stanford profile says he "co-authored PyG, the most widely-used graph neural network library."
- **[Open Graph Benchmark (OGB)](https://ogb.stanford.edu/)**. Most of the datasets suggested in the project handout are `ogbn-arxiv`, `ogbn-products`, `ogbl-collab`, `ogbl-ddi`; Colab 2 does a plain `import ogb`. Leskovec is the last author on the [OGB paper](https://arxiv.org/abs/2005.00687) (arXiv:2005.00687).
- **GraphGym**: listed as a recommended tool in Lecture 1's slides, and on the extra-credit PR list.
- **[DeepSNAP](https://github.com/snap-stanford/deepsnap)**: installed straight from GitHub in Colabs 3 and 5.
- **[SNAP datasets](https://snap.stanford.edu/data/)**: past course sites live under `snap.stanford.edu`, and the protein-interaction option in the project handout links directly to SNAP's biodata.
- **[RelBench](https://relbench.stanford.edu/)**: the centerpiece of lecture 12.

**Not tied:** Leskovec's own textbook *Mining of Massive Datasets* (with Rajaraman and Ullman) sits on his [teaching page](https://cs.stanford.edu/~jure/teaching.html), but it's the CS246 book — **it is not on the CS224W recommended reading list**. The three books the CS224W site does list are all by other people: [Graph Representation Learning](https://www.cs.mcgill.ca/~wlh/grl_book/) (William L. Hamilton, the one book named in Lecture 1), [Networks, Crowds, and Markets](http://www.cs.cornell.edu/home/kleinber/networks-book/), and [Network Science](http://networksciencebook.com/). All three are free to read online.

## Where it sits in the LLM era: covered, across two full lectures

The answer here is a clear yes, and you can point at the specific slides.

**Lecture 16, "LLM + GNN,"** covers the two directions of GraphRAG.

The GNN-feeds-LLM direction follows [G-retriever](https://arxiv.org/abs/2402.07630)'s four steps: the LLM encodes the query, a relevant subgraph is retrieved from the knowledge graph and encoded by a GNN, the two embeddings are combined, and the LLM decodes an answer. Subgraph retrieval uses KNN plus n-hop neighbors as a first pass, then prunes with a Prize-Collecting Steiner Tree. The slides carry a Neo4j case study: on [STaRK Prime](https://stark.stanford.edu/), PyG's GNN+LLM setup doubles Hit@1. The baselines and exact numbers are in the appendix.

The reverse direction, LLM-feeds-GNN, uses a sentence transformer to turn each node's and edge's text into a feature vector, then hands those to a GNN for node classification. The slides also note that PyG 2.7 shipped `TXT2KG`: using an LLM to extract (entity, relation, entity) triples from unstructured text.

**Lecture 17, "Agents + Graphs,"** is a guest lecture by Shirley Wu, whose slides say up front that "The first part is based on slides in CS224N and CS224R" — the first half is a crash course in the LLM training pipeline, and the second half is the actual subject: the [STaRK](https://stark.stanford.edu/) benchmark for retrieval over semi-structured knowledge bases, plus AvaTaR. Her headline result is one sentence: "For all methods, Hit@1 is below 18%."

Two things stand out. First, these two lectures have **no assigned reading** on the schedule; every other lecture does. Second, lecture 16 is taught the day before the exam and is in scope; lecture 17 is taught the day after and is not. The course pages don't explain why these two lectures have no reading list.

## What a self-learner actually gets

Item by item — this is the section worth saving.

**Available:**

- **Slide PDFs for all nineteen lectures**, all on the course site, no login wall.
- **Three homework PDFs and the LaTeX template**, point allocations included.
- **Six Colab notebooks**, directly downloadable, no Stanford account required.
- **Per-lecture recommended reading**, almost entirely public arXiv or OpenReview links.
- **The project handout and the grading rubric** (both Google Docs are publicly readable).
- **Finished student projects**: full blog posts on the Medium publication, with reproducible Colabs.
- **The 2021 recordings**: Stanford Online's YouTube channel has two CS224W playlists, the larger with 60 videos, and both open with the same "2021 | Lecture 1.1 – Why Graphs." Leskovec's teaching page also labels this batch as matching the "CS224W 2021 Syllabus."

**Not available:**

- **The current term's recordings** (Canvas). So graph transformers, relational deep learning, KG foundation models, LLM+GNN and Agents+Graphs — five blocks — come with slides and no explanation. That is the largest gap between the public video and the current syllabus.
- **Autograding for the homework and Colabs** (Gradescope), and no official solutions either; the course explicitly counts looking at past-year solutions as an honor code violation.
- **Exam problems and the practice exam** (lecture 12's slides mention one will be released, but the release happens on Ed).
- **The Ed forum** and office hours.
- **A TA project mentor.**

One gray area is worth mentioning: above the schedule on the course site is a line reading "Notes are available [here]," pointing at a 13 MB PDF on a third-party domain, `archives.leni.sh`. The link resolves, but it isn't under `stanford.edu`.

## How to start

**One thing you can do tonight**: open [Colab 1](https://colab.research.google.com/drive/1cNsHg6NClQyZiQEgRDCKoqofiik3y1XN) and work to Question 3 — what is node 0's value after one iteration of PageRank. It needs only NetworkX, and you'll have a number inside five minutes. If that cell feels comfortable, the first half of this course is within reach; if you get stuck, go back to linear algebra rather than to machine learning.

**Then three steps**, in the course's own order:

1. Read the slides for lectures 1 through 6 alongside the matching chapters of the 2021 recordings — this is where the overlap is highest.
2. Do Colabs 1 through 3 and leave 4 and 5 alone for now. Finishing Colab 3 means you've written a `MessagePassing` layer yourself, which is the real dividing line in this course.
3. From lecture 8 (Graph Transformers) onward the recordings stop helping. Switch to slides plus that lecture's recommended reading in the original: [Graphormer](https://arxiv.org/pdf/2106.05234.pdf) for lecture 8, the [RelBench paper](https://arxiv.org/pdf/2407.20060) for lecture 12.

**If you want your work seen**: the third project option — implement a paper as a PR into PyG `contrib` — needs no enrollment, and PyG is a live repo.

## Appendix: the numbers and how they were checked

- **Units and schedule**: 3–4 units, autumn only. The 2026-27 autumn section is 2058, 2026/09/22–2026/12/04, Tuesdays and Thursdays 15:00–16:20, NVIDIA Auditorium, letter or credit/no credit. Source: the ExploreCourses 2026-27 entry.
- **Grade weights**: homework 20% (three at 6.67% each), Colabs 15% (five at 3% each), exam 35%, final project 30%, with extra credit for Ed participation on top. The project splits internally into proposal 13.33%, milestone 6.67%, report 80% — 4%, 2% and 24% of the final grade. Source: `info.html` and the project handout.
- **Late policy**: two no-questions-asked late periods of 4 days each, not applicable to the final project report; past that, each late period costs 50%, and nothing is accepted beyond one late period. Gradescope allows a 15-minute grace window.
- **Homework point breakdown**: HW1 section 1 (GNN Expressiveness) 28 points, section 3 (GCN) 11 points plus a 3-point bonus problem; HW2's three sections are 20, 21 and 10; HW3's are 20, 13 and 15. All three carry a 0-point honor code section.
- **The RDL comparison numbers**: on lecture 12's slides, for the Stack Exchange user-activity prediction task, the manual route is "12 hours manual work / ~682 lines of code / 1hr model training" and the RDL route is "<1 hour manual work / 54 lines of code / 1hr model training." The slide defines the effort measure as "the marginal effort to solve a new task." This is an efficiency comparison, and **the slide does not pair these numbers with an accuracy comparison** — don't read it as a claim about model performance.
- **STaRK's 18%**: from lecture 17's slides, verbatim, "For all methods, Hit@1 is below 18%," referring to every retrieval-augmented method and LLM tested on the STaRK benchmark.
- **Hit@1 in the Neo4j case study**: lecture 16's slides show .16→.32 on STaRK Prime. The PyG setup is "LLAMA3.1-8B w/ LoRA + 10M param GAT"; the baselines are agentic GraphRAG with claude-3-opus (.18) and gpt-4-turbo (.2). This is a third-party case study relayed on the slides, not an experiment the course ran.
- **Paid enrollment prices**: the AI Professional Program charges $1,950 for a single course (XCS224W); CS224W for graduate credit is listed on Stanford Online at $6,300 in tuition. Both read Enrollment Closed when checked, and XCS224W lists no start date although several sibling courses on the same page do. **The page gives no reason.**
- **Maintenance status of DeepSNAP and OGB**: when checked, the GitHub API showed `snap-stanford/deepsnap` last pushed 2025-11-24, `snap-stanford/ogb` 2025-05-06, and `pyg-team/pytorch_geometric` 2026-08-17. Neither repo is marked archived.
- **Three things I could not confirm**: (1) Colab 0's Google Drive link returns 200, but it's a Drive viewer page rather than the notebook, and I did not obtain its cell contents — hence the blank row in the table above; (2) Stanford Online's two YouTube playlists hold 47 and 60 videos, but I did not compare them video by video to establish what the difference consists of; (3) lecture 16's slides do not name their speaker, and I found no official page saying who taught it, so no name appears in the text.

## References

- [CS224W: Machine Learning with Graphs course site (Autumn 2025)](https://web.stanford.edu/class/cs224w/) — the nineteen-lecture schedule, the six Colab links, the prerequisites text, the three recommended books
- [CS224W Course Info](https://web.stanford.edu/class/cs224w/info.html) — grade weights, closed-book exam rules, late policy, honor code terms
- [CS 224W Project (Fall 2025) handout](https://docs.google.com/document/d/1ffP5UGHRovHix4mBXweui62cj4L4sxib/edit) — the three project options, the Medium publication process, the OGB/PyG/GraphGym extra credit
- [CS224W Homework 1](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_HW1.pdf) — evidence that the first assignment is pure written derivation, plus its point allocation
- [CS224W Homework 2](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_2.pdf) — the eigenvector-basis rewrite, TransE/RotatE expressiveness
- [CS224W Homework 3](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_3.pdf) — graph transformers, LightGCN, RDL computation graphs
- [Lecture 1 slides: Introduction](https://web.stanford.edu/class/cs224w/slides/01-intro.pdf) — the course's own account of its scope, where PyG and GraphGym sit, the "self-contained" claim
- [Lecture 12 slides: Relational Deep Learning](https://web.stanford.edu/class/cs224w/slides/12-RDL.pdf) — the 682-lines-vs-54-lines effort comparison, RelBench's role
- [Lecture 16 slides: LLM + GNN](https://web.stanford.edu/class/cs224w/slides/Lecture16.pdf) — G-retriever's four steps, the Neo4j case study, TXT2KG
- [Lecture 17 slides: Agents + Graphs](https://web.stanford.edu/class/cs224w/slides/2025-cs224w-lecture.pdf) — STaRK's Hit@1 below 18%, AvaTaR, the speaker's note on drawing from CS224N/CS224R
- [ExploreCourses: CS 224W](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog) — the Autumn 2026 offering, units, the catalog version of the prerequisites
- [Stanford Bulletin: CS224W](https://bulletin.stanford.edu/courses/1058241) — the same prerequisite sentence as ExploreCourses, plus which degrees require the course
- [CS224W Fall 2018 archived site](http://snap.stanford.edu/class/cs224w-2018/) — confirms Influence Maximization and Outbreak Detection once had lectures of their own
- [CS224W Fall 2021 archived site](https://snap.stanford.edu/class/cs224w-2021/) — confirms PageRank was still on the 2021 syllabus and the other two topics were gone
- [CS224W Fall 2024 archived site](http://snap.stanford.edu/class/cs224w-2024) — confirms the course blurb went years without a change
- [Jure Leskovec's Stanford profile](https://profiles.stanford.edu/jure-leskovec) — the "co-authored PyG" wording
- [Jure Leskovec's teaching page](https://cs.stanford.edu/~jure/teaching.html) — the public videos matched to the 2021 syllabus; *Mining of Massive Datasets* filed under CS246
- [Stanford CS224W on Medium](https://medium.com/stanford-cs224w) — confirms student projects really are public, Fall 2025 batch included
- [Open Graph Benchmark](https://ogb.stanford.edu/) and the [OGB paper](https://arxiv.org/abs/2005.00687) — confirms Leskovec's co-authorship and the datasets' relationship to the course projects
- [RelBench](https://relbench.stanford.edu/) — the benchmark at the center of lecture 12
- [Graph Representation Learning (Hamilton)](https://www.cs.mcgill.ca/~wlh/grl_book/) — the one textbook named in lecture 1, free to read online
- [The G-retriever paper](https://arxiv.org/abs/2402.07630) — the source of lecture 16's GraphRAG pipeline
- [STaRK benchmark](https://stark.stanford.edu/) — the evaluation dataset shared by lectures 16 and 17
- [ExploreCourses: CS224N](https://explorecourses.stanford.edu/search?q=CS224N&view=catalog) and [CS246](https://explorecourses.stanford.edu/search?q=CS246&view=catalog) — the two neighboring courses used to calibrate the prerequisite bar
- On this site: [A map of Stanford's CS courses](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Reading Stanford CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
