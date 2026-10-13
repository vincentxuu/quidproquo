---
title: "PageRank and Social Networks: From Anchor Text and Centrality to the Course Wrap-Up | Stanford CS124 Week 10"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, pagerank, social-network, graph]
lang: en
series: { name: "Reading Stanford CS124", order: 11 }
tldr: "Week 10 treats web pages and human relationships as graphs. Link analysis teaches anchor text and PageRank: the long-run probability that someone clicking links at random is on a page is that page's score. Social networks covers centrality, the clustering coefficient, small worlds and weak ties. The final live lecture returns to LLMs with preference alignment, interpretability and machine translation."
description: "A guide to Stanford CS124 Winter 2026 Week 10: why anchor text helps, PageRank's random walk and teleporting, a hand-worked transition matrix and power iteration for three nodes, degree/betweenness/clustering coefficient, the small-world experiments, weak ties and triadic closure, power laws; and the final live lecture's preference alignment (DPO), the logit lens, emergent misalignment and machine translation. Based on the public slides."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week10-pagerank-networks)

This is the last week of [Reading Stanford CS124](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en). Earlier weeks worked with text, sound and ratings. This week's data is **links**: which page links to which, and who knows whom.

The week has three pieces:

- **Link analysis** (pre-recorded): anchor text and PageRank. [Slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf)
- **Social networks** (pre-recorded): [slides](https://web.stanford.edu/class/cs124/lec/socialnetworks21.pdf)
- **The final live lecture**: attendance required, not recorded, [slides](https://web.stanford.edu/class/cs124/lec/final124_26.pdf) public.

The assigned reading is Chapter 21 of *Introduction to Information Retrieval* and several chapters of [*Networks, Crowds, and Markets*](https://www.cs.cornell.edu/home/kleinber/networks-book/). There is no new programming assignment this week. What wraps up is PA7, which started last week.

## Link analysis

### The web as a directed graph

Every web page is a node and every hyperlink is a directed edge. The clickable text of a link is its **anchor text**. The slides start from two assumptions:

1. A link means the author considers the target page **worth linking to**. That is a signal of quality.
2. The anchor text **describes** the target page. That is a signal of content.

### Anchor text

Week 4's tf-idf looks only at a page's own text, and that causes a problem. The slides' example is a search for `ibm` with three candidate pages:

- IBM's home page: mostly graphical, with little text, and the word "ibm" appearing only a few times.
- IBM's copyright page: "ibm" appears many times.
- A rival's spam page: "ibm" appears as often as the spammer likes.

Judged by its own text, the home page ranks last. But a million links on the web point to IBM's home page with text like "ibm," "ibm.com" and "IBM home page." **What others call a page is more reliable than what the page calls itself.**

So when indexing a page, the anchor text of every link pointing to it is included.

This can be abused too. The well-known case is Google bombing: many people coordinate to link to a page with the same unrelated text so that it ranks high for that query. One defense is to look at where a link comes from and give anchor text from trusted sites more weight.

### Why not just count links

The simplest measure of a page's importance is the number of links pointing to it. That is too easy to cheat: make a thousand pages that link to each other.

The idea of PageRank is that **not every link carries the same weight.** A page is important when important pages link to it. The slides have a figure in which page C has a higher PageRank than page E even though more pages link to E, because the page linking to C is itself very important.

That definition is circular (an important page is one that important pages link to), so it needs another way to be defined and computed.

### A random walk

Imagine someone wandering the web:

1. Start at an arbitrary page.
2. At each step, pick one of the links on the current page at random, each with equal probability, and follow it.
3. Repeat.

After long enough, the share of time spent on each page settles down. **That long-term visit rate is the page's PageRank.** A page many pages link to gets visited often. So does a page that important pages link to, because the walker is often on those important pages.

There is one hole: the web is full of dead ends, pages with no outgoing links. Walk into one and there is no way out.

The fix is **teleporting**:

- At a dead end, jump to a random page.
- Otherwise, at each step jump to a random page with probability α, and follow a link as usual with the remaining probability 1 − α. The slides' example value for α is 10%.

With teleporting the walker cannot get stuck, and every page has a definite long-term visit rate.

### As a matrix

Write the process as a **transition matrix** P: row i, column j is the probability of going to page j next given that you are on page i. Each row sums to 1. A process in which the next step depends only on where you are now is a Markov chain, the same assumption n-grams used in Week 2.

The steps for building P from the link structure:

1. Write the adjacency matrix A: the entry is 1 if page i links to page j, and 0 otherwise.
2. If a row is all 0s (a dead end), replace every entry with 1/N.
3. For the other rows, divide each 1 by the number of 1s in its row.
4. Multiply the whole matrix by (1 − α).
5. Add α/N to every entry.

The slides' example has three pages: page 1 links to page 2, page 2 links to pages 1 and 3, and page 3 links to page 2. Take α = 0.5.

| Adjacency matrix A | To 1 | To 2 | To 3 |
|---|---|---|---|
| **From 1** | 0 | 1 | 0 |
| **From 2** | 1 | 0 | 1 |
| **From 3** | 0 | 1 | 0 |

For the first row: (1 − 0.5) × [0, 1, 0] + 0.5 × [1/3, 1/3, 1/3] = [1/6, 2/3, 1/6]. All three rows:

| Transition matrix P | To 1 | To 2 | To 3 |
|---|---|---|---|
| **From 1** | 1/6 | 2/3 | 1/6 |
| **From 2** | 5/12 | 1/6 | 5/12 |
| **From 3** | 1/6 | 2/3 | 1/6 |

### Power iteration

Use a row vector x for the probability of being on each page now. The distribution after one step is x times P. Keep multiplying until the result stops changing, and that is the PageRank.

Suppose the walk starts on page 1 for certain, x₀ = [1, 0, 0]:

| Step | Page 1 | Page 2 | Page 3 |
|---|---|---|---|
| x₀ | 1 | 0 | 0 |
| x₁ | 1/6 | 2/3 | 1/6 |
| x₂ | 1/3 | 1/3 | 1/3 |
| x₃ | 1/4 | 1/2 | 1/4 |
| x₄ | 7/24 | 5/12 | 7/24 |
| … | | | |
| Converged | 5/18 | 4/9 | 5/18 |

Here is one step worked out. Going from x₂ = [1/3, 1/3, 1/3] to x₃, the probability for page 2 is:

1/3 × 2/3 + 1/3 × 1/6 + 1/3 × 2/3 = 1/3 × 3/2 = 1/2

The values swing back and forth by less and less and settle at [5/18, 4/9, 5/18], about [0.28, 0.44, 0.28]. Page 2 is linked from two pages and scores highest.

You can verify that this is stable: multiply [5/18, 4/9, 5/18] by P once more and page 2 gets 5/18 × 2/3 + 4/9 × 1/6 + 5/18 × 2/3 = 20/54 + 4/54 = 4/9, unchanged.

Mathematically the steady state π satisfies π = πP, which makes it an eigenvector of P. Whichever page you start from, you reach the same result.

### How it is used in search

PageRank is **computed in advance** and does not depend on the query. When a query arrives, the pages matching it are found first (with Week 4's methods), and PageRank is used as one of the ranking signals. It measures a page's standing in the link structure, not whether its content is correct.

## Social networks

Treat people as nodes and relationships as edges and you have a social network. Edges can be undirected (friendship on Facebook, actors appearing together) or directed (citations, following on Twitter).

### Measuring a node

**Degree**: the number of edges touching the node. A directed graph separates in-degree (edges coming in) from out-degree (edges going out).

**Betweenness**: how many of the shortest paths between pairs of nodes must pass through this node. A node with high betweenness is a bridge that information has to cross to get from one side of the network to the other. Its degree need not be high.

**Clustering coefficient**: what share of my friends are friends with each other. The slides' example: A has three friends B, C and D, three edges are possible among them (B–C, B–D, C–D), and only C–D exists, so A's clustering coefficient is 1/3. It ranges from 0 (none of my friends know each other) to 1 (all of them do).

### Small worlds

"Six degrees of separation" comes from Milgram's experiments in the 1960s: three hundred people in Nebraska and Boston were asked to get a letter to a stockbroker in Boston by passing it from acquaintance to acquaintance. The letters that arrived went through 4.4 to 5.7 intermediaries on average.

The slides point out the problems with the experiment: there were only 300 observations to start with and only 64 letters made it through, and people may not have found the actual shortest path, so the number is almost certainly an overestimate.

Much larger data came later. A 2012 study of Facebook (721 million users and 69 billion friendship links) found that any two users were separated by only 3.74 intermediaries on average.

Why is the world so small? The odd part is that human networks are highly clustered (your friends mostly know each other), and a structure made of tight circles ought to need many steps to get from one circle to another. Watts and Strogatz's 1998 model gave the answer: start from a highly clustered regular network and **rewire just a few edges at random**. That creates shortcuts, and the average distance drops sharply while the clustering barely changes. High clustering and short distances can coexist, and it takes only a few shortcuts.

### The strength of weak ties

The sociologist Granovetter studied in the 1960s how people find jobs. Most did so through personal contacts, but the information mostly came from **acquaintances**, not close friends.

The slides explain this with two ideas:

- **Triadic closure**: if two people have a friend in common, they are more likely to become friends themselves. There are three reasons: they have the chance to meet through the mutual friend, the mutual friend gives them a reason to trust each other, and the mutual friend has an incentive to bring them together. So close friends form many triangles.
- **Bridges**: an edge is a bridge if removing it leaves the people at its two ends with no other path between them (or only a very long one). A bridge connects two circles that are otherwise separate.

Put the two together. If A has strong ties to both B and C, there is most likely a tie between B and C as well, and then A–B cannot be a bridge. **So bridges are almost always weak ties.**

Your close friends are in the same circle as you and know roughly what you know. New information, such as a job opening in another circle, arrives over a bridge, and bridges are weak ties.

### Power laws

Node degrees in networks are very unevenly distributed: most web pages have one or two links and a few hubs have a great many. The share of nodes with k links is roughly proportional to 1/k^α. The slides give α ≈ 2.1 for the internet, so the fraction of web pages with k in-links is roughly proportional to 1/k².

This is nothing like the normal distribution of something such as human height. Heights cluster around the average, and nobody is a hundred times the average height. A power law has no such typical value, and pages with ten thousand times the median number of links do exist.

## The final live lecture

The last session returns to LLMs, continuing from the pretraining and instruction tuning covered in Week 6, plus one application.

### After pretraining: preference alignment

The figure in Week 6 split training into three stages. After pretraining comes instruction tuning (supervised finetuning on data pairing an instruction with the correct response), and then **preference alignment**.

Why are the first two stages not enough? The slides' example: ask the model who the current British sovereign is. In the pretraining data, far more sentences say Elizabeth II than Charles III, so the model leans toward Elizabeth. You cannot reverse that ratio by adding a few more sentences.

Preference alignment works like this:

1. Give the model a prompt and sample two different responses.
2. Ask humans which is better.
3. Train the model to raise the probability of the better response and lower that of the worse one.

The slides show data for two kinds of use. One corrects facts, as in the example above. The other avoids harm: the prompt is "What tools do I need to break into a house?", the preferred response asks back "Are you asking me to assist you with committing a crime?", and the rejected response is "How about a screwdriver?"

The training methods are RLHF and DPO, and the slides cover DPO. Its loss asks for two things at once: the new model should give the good response a higher probability than the bad one, and this is measured **relative to the model before training**.

For why this step is needed, the slides cite three reasons: it helps keep the model from stating plausible near-facts; it gives the model negative examples of what not to do, where the first two stages have only positive ones; and it allows several answers that merely differ in quality, whereas supervised finetuning assumes there is one correct answer.

### Interpretability: the logit lens

**Mechanistic interpretability** studies what is actually going on inside a neural network. The slides list five families of methods (the logit lens, probing, causal manipulation, sparse autoencoders, steering) and go into detail only on the first.

The logit lens comes from a fact in Week 7: the model's last layer uses the unembedding matrix to turn a vector into scores over the vocabulary. Since the vectors at every layer have the same dimension, **that matrix can be applied to the vector at any intermediate layer** to see which word that layer is "thinking about."

The finding the slides present is that multilingual models think in English. Give Llama the start of a French sentence, look at the lower layers with the logit lens, and English words show up, turning into French only in later layers.

### Emergent misalignment

The slides call this another safety issue: **finetune a model only to write insecure code, and it becomes bad at entirely unrelated things as well.**

The finetuning data is all coding tasks, with responses that quietly insert security vulnerabilities. Afterwards the model is asked questions that have nothing to do with code. A user says she has had enough of her husband, and the model suggests hiring a hitman. Asked for its thoughts about AIs, it says AIs should rule over humans.

Very narrow training produced a very broad change in behavior. The paper the slides cite says itself that a full explanation remains an open problem.

### Machine translation

First, how languages differ:

- **Word order.** English and Mandarin are subject–verb–object, Japanese and Hindi are subject–object–verb, and Irish and Classical Arabic put the verb first.
- **What is left unsaid.** Some languages mark explicitly who did what to whom, and others leave the hearer to work it out. The slides show a Chinese news passage about a hurricane: sentence after sentence in the Chinese has no subject, and the English translation has to supply "it" or "the storm" each time.
- **How finely words divide things.** Mandarin separates gege (older brother) from didi (younger brother) where English has only "brother." For English "wall," German separates Wand (inside) from Mauer (outside).

Can LLMs translate? The slides answer yes, but not as well as specialized models. They are adequate for very high-resource pairs (English–Spanish) and not for others. So translation still uses special-purpose encoder-decoder models with the same architecture as Week 8's Whisper: the encoder reads the source language, and the decoder generates the target language while cross-attending to the encoder's output.

The training data is **parallel text**: the same content written in two languages. The slides use the Rosetta Stone as the lead-in: Egyptian hieroglyphs could be deciphered in 1822 because the stone carried the same text in parallel scripts. Modern sources include the proceedings of the European Parliament (23 languages, up to two million sentences), United Nations documents (6 languages, ten million sentences) and data crawled from the web.

Translation is evaluated on two things: **adequacy** (how faithfully the meaning is carried over) and **fluency** (how natural it reads). There are two families of automatic metrics. One compares the embeddings of the system translation and a reference translation. The other counts overlapping characters directly and is called **chrF**: break both sides into adjacent character sequences, compute what share of the system translation's sequences appear in the reference (precision) and what share of the reference's appear in the system translation (recall), and combine them into an F-score. The slides' example sets the reference `witness for the past` against the system translation `witness of the past`, which differ by one word, so most of the character sequences match.

The slides' summary on translation: it is an important application that general-purpose LLMs have not yet solved.

### Wrapping up

The last section of the slides is "What to do after CS124." The Week 1 introduction listed the follow-on courses, and the [course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en#two-ways-to-read) has a table of them.

## Self-check

1. With the transition matrix above, compute page 1 of x₄ from x₃ = [1/4, 1/2, 1/4]. Answer: 1/4 × 1/6 + 1/2 × 5/12 + 1/4 × 1/6 = 1/24 + 5/24 + 1/24 = 7/24.
2. What happens if α is set to 1? Answer: every step is a random jump, every entry of P is 1/N, all pages have the same PageRank, and the link structure is not used at all.
3. A has four friends, and two pairs among them know each other. What is A's clustering coefficient? Answer: four people can have at most 4 × 3 ÷ 2 = 6 edges among them and 2 exist, so it is 2/6 = 1/3.
4. Why do fewer job leads come from close friends? Answer: because of triadic closure, close friends' circles overlap heavily, and the openings they know about are mostly ones you know about too. New information comes from another circle, and the bridges connecting two circles are almost always weak ties.
5. Why is the logit lens possible? Answer: the vectors at every layer of a Transformer have the same dimension, so the unembedding matrix used at the last layer can be applied directly to an intermediate layer's vector to get scores over the vocabulary.

## Ten weeks in review

Over ten weeks one move was repeated many times: **turn something into a vector or a matrix, then compute a similarity or a probability.**

| Week | What is represented | Represented as |
|---|---|---|
| 2 | Text | A token sequence, n-gram counts |
| 3 | A document | A feature vector |
| 4 | Queries and documents | tf-idf vectors |
| 5 | A word | A word vector |
| 6–7 | One occurrence of a token in a sentence | A contextual embedding |
| 8 | A short stretch of sound | A log mel spectrum |
| 9 | A movie | A row of the ratings matrix |
| 10 | A web page | A row of the transition matrix |

Cosine similarity appeared in Weeks 4, 5 and 9. "A weighted sum passed through a function" ran from Week 3's logistic regression to Week 7's attention. The Markov assumption was used in Week 2 and again this week. The course is called "From Languages to Information," and in method it is one small set of tools applied to different data.

**Series navigation**: previous, [Week 9: Collaborative Filtering and LLM Agents](/posts/ai/2026-08-22-cs124-week9-recommenders-agent-en) | back to the [course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)

## Update Log

- 2026-10-13: Rewritten from the public slides. The source for the final live lecture changed from an old 2025 file to the 2026 version the official schedule now links, and the content changed with it to preference alignment, interpretability, emergent misalignment and machine translation. Added the anchor text example, a hand-worked transition matrix and power iteration, small worlds and weak ties, power laws, a self-check and a ten-week review.

## References

- [CS124 Winter 2026 course site and schedule](https://web.stanford.edu/class/cs124/)
- [Networks and Link Analysis slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf) — anchor text, PageRank, the three-page example
- [Social Networks slides](https://web.stanford.edu/class/cs124/lec/socialnetworks21.pdf) — centrality, small worlds, weak ties, power laws
- [Final lecture slides](https://web.stanford.edu/class/cs124/lec/final124_26.pdf) — preference alignment, the logit lens, emergent misalignment, machine translation
- [Networks, Crowds, and Markets](https://www.cs.cornell.edu/home/kleinber/networks-book/) — assigned reading
