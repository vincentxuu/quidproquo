---
title: "CS124 Week 10 PageRank and Social Networks: From Anchor Text and Centrality to the Course Wrap-Up"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, pagerank, social-network, graph]
lang: en
series: { name: "Stanford CS124 導讀", order: 11 }
tldr: "Week 10 models the Web with anchor text, PageRank, and centrality; post-training, multilinguality, and speech belong only to a public final-deck outline labeled 2025, not the 2026 live narration."
description: "Stanford CS124 Winter 2026 Week 10: web graphs, anchor text, PageRank, centrality, clustering, power laws, and the public final-lecture agenda."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week10-pagerank-networks)

CS124's final week moves from individual documents and users to graphs of the Web and social relations. The [official schedule](https://web.stanford.edu/class/cs124/lec/) lists links, PageRank, social networks, and a required March 10 live final lecture. A separate [public final deck labeled 2025](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf) supports only its post-training, multilinguality, and speech outline, not the unrecorded 2026 narration.

**Version:** Winter 2026. **Unit:** Week 10, March 10 and 12. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [Web and Link Analysis slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf), [Social Networks slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf), [final slides](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf), and [Easley–Kleinberg's book](https://www.cs.cornell.edu/home/kleinber/networks-book/). **Gap:** the final lecture was unrecorded, its deck retains a 2025 filename, and the assigned IR ebrary pages are access-controlled.

## The Web is also a directed graph

Treat pages as nodes and hyperlinks as directed edges. The public [Web and Link Analysis slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf) use two working assumptions: a link signals perceived relevance, and anchor text describes the target. These are assumptions rather than natural laws; spam, templates, and commercial manipulation can violate them.

Anchor text helps when a target page contains little descriptive text. Indexing incoming anchors adds external descriptions to the document representation.

## PageRank defines recursive importance

In-degree treats incoming links equally. PageRank says links from important pages contribute more, while those pages are themselves defined recursively. The random-surfer interpretation makes rank a stationary probability over the graph.

Teleportation handles traps and supports reachability; dangling nodes need an explicit transition rule. Power iteration repeatedly updates the rank vector until change falls below a threshold. The resulting centrality is not truth or moral worth. Search systems still combine link structure with relevance, freshness, and spam defenses.

## Social graphs depend on edge definitions

The public [Social Networks slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf) define `G(V,E)` with people as vertices and relationships or interactions as edges. Friendship, citation, following, and conversation create different directed or undirected graphs even over the same people.

Degree counts direct links; directed graphs distinguish in- and out-degree. Betweenness measures how often a node lies on shortest paths and can expose bridges. Clustering coefficient measures whether neighbors connect to one another.

The [Social Networks slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf) also introduce power-law degree distributions. A long-looking tail in finite or sampled platform data does not itself prove a power law. The supported exercise is to inspect a distribution, not to declare one without model checking.

## What the final deck establishes

The [public deck labeled 2025](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf) opens with an outline listing post-training, instruction tuning, preference alignment, multilinguality, speech processing, and “What to do after CS124.” That supports the wrap-up scope, but not attribution of every timeline entry to the unrecorded 2026 narration.

The outline mirrors Week 1. The course began with a component map and ends by pointing beyond pretrained next-token models toward alignment and specialized follow-on courses. Completion means recognizing whether the next question belongs to speech, graphs, deep-learning NLP, retrieval, or language-model training—not claiming that one survey course exhausted them.

## A concrete Week 10 finish line

As a finish line, compute two PageRank iterations on a five-node directed graph with explicit teleportation and dangling-node handling. Then calculate degree and one clustering coefficient on the same graph and explain why the measures answer different questions. Finally, map each of the ten weeks to one executable artifact.

## Fixing graph direction and weights

Adjacency lists suit sparse Web graphs; matrices suit small calculations. State whether rows or columns are sources before building transitions. Define multi-edges, self-loops, weights, and time windows. A cumulative follow graph and a daily conversation graph answer different questions.

## An anchor-text indexing example

A graphical brand homepage may contain little descriptive text while many incoming anchors name the product. Adding anchors to its index makes retrieval possible. Preserve source page, count, and diversity because repeated anchors can also be manipulated. Term-level ranking explanations should separate self text from anchor contributions.

## PageRank equation and transitions

For column-stochastic `P`, update `r_{t+1}=αPr_t+(1-α)v`. Outgoing probability divides across links. Row-stochastic notation reverses multiplication direction; either is valid if consistent. Rank entries should remain nonnegative and sum to one.

Dangling nodes redistribute through `v`; teleportation prevents probability traps. A five-node calculation should show initial vector, link contribution, teleport term, and per-iteration difference.

## Power-iteration tests

Stop when vector difference falls below tolerance or at a maximum iteration count, and record `α`, initialization, tolerance, and iterations. Test a symmetric cycle for uniform rank, a central sink for elevated but non-total rank, and a dangling graph for conserved probability.

## Centrality measures answer different questions

Degree measures local links; in- and out-degree differ in directed graphs. Betweenness credits nodes on shortest paths and can identify low-degree bridges. Clustering measures connections among neighbors and needs a convention below degree two. Directed and weighted variants require their own definitions.

“Popular,” “bridge,” and “embedded in a clique” are not one ranking. Compute the measures side by side on the same graph.

## Power-law claims need evidence

A straight-looking log-log plot is insufficient. Report graph size, sampling, degree range, candidate tail, and comparison with alternative heavy-tailed distributions. Crawls can miss remote low-degree nodes or truncate high-degree lists, making the observed distribution partly a collection artifact.

## Boundaries of the final deck

The [public final-deck outline labeled 2025](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf) supports post-training, instruction tuning, preference alignment, multilinguality, speech, and follow-on study. Its 2025 filename and absent recording do not support attributing every timeline example or comparative judgment to the 2026 meeting. Keep the graph agenda separate from the LLM wrap-up.

## A ten-week artifact audit

Preserve environment evidence; tokenizer/edit/n-gram tables; classifier weights and errors; index rankings; embedding probes; gradients and curves; attention tests and samples; audio/transcript errors; recommender/tool traces; and PageRank calculations. Every artifact needs input, version, parameters, output, and failure. This does not replace formal grading, but proves that the series covers ten official units rather than ten topic summaries.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Web and Link Analysis slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf)
- [Social Networks and Power Laws slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf)
- [CS124 final lecture slides](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf)
- [Networks, Crowds, and Markets](https://www.cs.cornell.edu/home/kleinber/networks-book/)
