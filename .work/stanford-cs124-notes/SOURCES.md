# CS124 Winter 2026 source ledger

Checked: 2026-08-22. Canonical schedule: <https://web.stanford.edu/class/cs124/lec/>.

| Unit | Official sources opened | Access | What they support | Gap |
|---|---|---|---|---|
| W1 | [schedule](https://web.stanford.edu/class/cs124/lec/), [intro PDF](https://web.stanford.edu/class/cs124/lec/intro26.pdf), [PA0](https://github.com/cs124/pa0-jupyter-tutorial) | public | course scope, flipped format, component map, setup | live lecture not recorded; Canvas setup videos gated |
| W2 | [schedule](https://web.stanford.edu/class/cs124/lec/), [token slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf), [edit-distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf), [n-gram slides](https://www.stanford.edu/class/cs124/lec/lm_jan25.pdf), [Lab 1](https://www.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf), [PA1](https://github.com/cs124/pa1-regular-expressions), SLP3 August 2025 Ch2/3 via syllabus links | slides/repo public; videos gated | tokens/BPE, edit distance, n-gram probability, lab and assignment | video narration and quiz inaccessible |
| W3 | [schedule](https://web.stanford.edu/class/cs124/lec/), [SLP3 Ch4](https://web.stanford.edu/~jurafsky/slp3/4.pdf), [Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md), [solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md), [PA2](https://github.com/cs124/pa2-logistic-regression) | public except Canvas/Gradescope | sigmoid, features, loss, gradient update, classification practice | current textbook PDF is newer than assigned release; video/quiz gated |
| W4 | [schedule](https://web.stanford.edu/class/cs124/lec/), [SLP3 Ch11](https://web.stanford.edu/~jurafsky/slp3/11.pdf), [Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md), [solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md), [PA3](https://github.com/cs124/pa3-information-retrieval) | public except Canvas/Gradescope | inverted index, tf-idf, ranking, retrieval/RAG connection, implementation | video narration and quiz gated |
| W5 | [schedule](https://web.stanford.edu/class/cs124/lec/), [SLP3 Ch5](https://web.stanford.edu/~jurafsky/slp3/5.pdf), [PA4](https://github.com/cs124/pa4-embeddings) | embeddings public; Social NLP slides 403 | distributional hypothesis, vectors, similarity, static/contextual representations, assignment environment | live Social NLP lecture not recorded; its slides restricted; assigned Ch10 pages must be read from pinned Aug 2025 release |
| W6 | [schedule](https://web.stanford.edu/class/cs124/lec/), [NN slides](https://www.stanford.edu/class/cs124/lec/7_NN.pdf), [LLM/Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf), [SLP3 Ch6](https://web.stanford.edu/~jurafsky/slp3/6.pdf), [PA5](https://github.com/cs124/pa5-neural-networks) | slides/repo public; live lecture gated | units, layers, feedforward NNs, neural LMs; decoder/encoder families and LLM agenda | live LLM/Transformer lecture unrecorded; current textbook postdates offering |
| W7 | [schedule](https://web.stanford.edu/class/cs124/lec/), [LLM/Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf), [PA6a](https://github.com/cs124/pa6a-transformers) | slides/repo public | causal self-attention, generation, training on Shakespeare, perplexity, ethics reflection | live speech lecture unrecorded; syllabus Ch7/8 must use August 2025 archive, not current numbered PDFs |
| W8 | [schedule](https://web.stanford.edu/class/cs124/lec/), [PA6b](https://github.com/cs124/pa6b-speech), [Lab 4](https://github.com/cs124/labs/blob/main/Lab4_LargeLanguageModels.md) | repo/lab public | TTS→STT pipeline, error analysis, dialect/dysfluency stress test, Git/PA7 preparation | Chapter-number drift; speech lecture was prior live session and unrecorded; Cartesia account/API required |
| W9 | [schedule](https://web.stanford.edu/class/cs124/lec/), [collaborative-filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering21.pdf), [MMDS Ch9](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf), [Lab 5](https://github.com/cs124/labs/blob/main/Lab5_Chatbots.md), [PA7](https://github.com/cs124/pa7-agent) | public except quiz/live lab | item-item collaborative filtering, cosine scoring, tool-use agent, search and memory, classroom ethics lab | Lab 5 not recorded; Quiz 8 gated; API services and autograder external |
| W10 | [schedule](https://web.stanford.edu/class/cs124/lec/), [web/link slides](https://spark-public.s3.amazonaws.com/cs124/slides/web.pdf), [social-network slides](https://www.stanford.edu/class/cs124/lec/socialnetworks21.pdf), [final lecture slides](https://www.stanford.edu/class/cs124/lec/finallecture_cs124_2025.pdf), [Networks book](https://www.cs.cornell.edu/home/kleinber/networks-book/) | public slides/readings | anchor text, directed web graph, PageRank agenda, degree/betweenness/clustering, final post-training/multilingual/speech outline | live final lecture unrecorded; assigned IR ebrary pages access-controlled; some slide decks retain earlier-year filenames |

## Version notes

- The course explicitly assigns the SLP3 third-edition August 2025 release. The main SLP3 directory showed an August 19, 2026 draft when checked, so chapter numbers in current PDFs are not automatically interchangeable with the syllabus.
- The schedule calls Week 5 homework “PA 4: Embeddings”; the canonical readable repo is `cs124/pa4-embeddings`. A stale/misaligned link must not override the textual schedule plus repo identity.
- No claim in the articles is based on Canvas narration, Gradescope content, a search-result snippet, or the inaccessible Social NLP deck.

## Revision batch A evidence map (Weeks 1–5)

- W1 expansion: official Introduction assignment map, syllabus assessment/prerequisite/public-audit rules, and PA0 reproducibility workflow.
- W2 expansion: public token/edit-distance/n-gram decks plus Lab 1 and PA1 exercise workflow; includes multilingual segmentation, ordered BPE merges, DP recurrence/backtrace, boundaries/unknowns/smoothing.
- W3 expansion: assigned Chapter 4, public Lab 2 and PA2; includes design matrix, multiclass output, regularization, numerical gradient checks, thresholding, and error evidence.
- W4 expansion: assigned Chapter 11, public Lab 3 and PA3; includes posting payloads, phrase positions, term-level tf-idf, retrieval judgments/metrics, RAG artifacts and chunking tradeoffs.
- W5 expansion: assigned Chapter 5 and PA4; includes term-context/PPMI construction, prediction objectives, analogy limits, contextual-model provenance, and bounded association probes. No claims were imported from the inaccessible Social NLP lecture.

## Revision batch B evidence map (Weeks 6–10)

- W6 expansion: public NN/LLM decks, assigned Chapter 6 and PA5; batch shapes, activation/initialization, backprop checks, training diagnostics, neural-LM alignment, and architecture-family boundaries.
- W7 expansion: public Transformer deck and PA6a; scaled attention, masks/heads/blocks, unit and gradient tests, Shakespeare training artifacts, sampling, perplexity sanity checks, and repository ethics prompts. No speech-live content was reconstructed.
- W8 expansion: PA6b and public Lab 4 artifact; staged TTS/STT provenance, edit alignment/WER, error controls, formatting/accessibility audit, bounded dialect probes, and Git collaboration evidence. No prior live-speech narration was imported.
- W9 expansion: collaborative-filtering slides/MMDS reading/PA7; exact assignment variant, evaluation, tool contracts, search/memory/database failure handling, nondeterministic scenario tests, and team delivery.
- W10 expansion: public Web/PageRank/social-network/final decks and Networks reading; graph construction, anchor indexing, PageRank iteration/tests, centrality distinctions, power-law evidence limits, final-deck version boundary, and ten-week artifact audit.

## Final length audit

Measured after the closing frontmatter delimiter with `wc -m`: all ten zh-TW articles are at least 6,000 characters. The length expansion used only the evidence mapped above; gated and unrecorded sources remain gaps rather than inferred content.

## Clean-review source-at-point audit

- Heading semantics audited pairwise: zh/en `##` counts match for Weeks 1–10; English Further study and Week 8/10 completion headings were restored.
- W5 social-association audit is explicitly author extension from readable Chapter 5, not live-lecture attribution.
- W6 LLM architecture and W10 final outline carry their public 2025-deck identity at the claim point.
