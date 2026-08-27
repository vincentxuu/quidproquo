# CS224V Fall 2025 source ledger

Last checked: 2026-08-22

## Scope authority

- [Course home](https://web.stanford.edu/class/cs224v/) — title and term explicitly say “Conversational Virtual Assistants with Deep Learning, Fall 2025”.
- [Schedule](https://web.stanford.edu/class/cs224v/schedule.html) — authoritative 14-PDF instructional inventory and dates.
- [Readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf) — course reading groups; use only after opening the referenced paper itself when making paper-specific claims.
- [Projects](https://web.stanford.edu/class/cs224v/projects.html) — project requirements, not an instructional unit.

Do not mix in the Autumn 2026 “Agentic AI” catalog description. As of the check date, the public class site and its artifacts remain Fall 2025.

## Instructional PDFs

1. [Introduction](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
2. [Knowledge Curation](https://web.stanford.edu/class/cs224v/lectures/2-knowledge-curation.pdf)
3. [Building a Task-Oriented Agent](https://web.stanford.edu/class/cs224v/lectures/3-task-oriented-agent.pdf)
4. [Evaluation of Task-Oriented Agents](https://web.stanford.edu/class/cs224v/lectures/l-Worksheet2.pdf)
5. [Grounding Conversational Agents on Free Text](https://web.stanford.edu/class/cs224v/lectures/l-freetext.pdf)
6. [Structured and Hybrid Data](https://web.stanford.edu/class/cs224v/lectures/l-db-hybrid-intro.pdf)
7. [SUQL](https://web.stanford.edu/class/cs224v/lectures/l-suql.pdf)
8. [Long Documents](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf)
9. [Qualitative Coding](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf)
10. [Agentic Knowledge-Base Queries](https://web.stanford.edu/class/cs224v/lectures/l-agentic.pdf)
11. [Natural-Language Constraints with SMT](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf)
12. [NLP Building Blocks](https://web.stanford.edu/class/cs224v/lectures/l-churro.pdf)
13. [Multimodal Applications](https://web.stanford.edu/class/cs224v/lectures/l-multimodal.pdf)
14. [Training LLMs](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf)

## First-batch material gaps

- No official lecture recordings or complete speaker notes are linked.
- Slides contain in-class prompts and deliberately omit some answers; do not reconstruct them.
- “Research project ideas” and student proposal sessions have no lecture PDF and are excluded.
- The Introduction deck presents a Stage 2 scientific-assistant direction, but the public schedule does not provide a separate Stage 2 syllabus.
- Numerical evaluation claims in the first five decks should be attributed to the deck or verified against the named paper before being generalized.

## Second-batch material gaps

- The structured/hybrid-data deck combines a database-agent introduction with a survey of table and text retrieval; it does not publish a single reference implementation.
- The SUQL slides show language examples and compiler optimizations, not a complete grammar or stable public API contract.
- SLIDERS is presented with preliminary evaluation; the deck does not establish a final production benchmark.
- The qualitative-coding lecture reports an active research system and concludes automatic coding is not yet sufficient; do not present it as autonomous replacement for expert review.
- SPINACH action traces and result tables are lecture summaries. The public deck does not include the full evaluation harness or classroom discussion.

## Final-batch material gaps

- The SMT lecture is a research case study, not clinical guidance. Public slides do not provide a validated deployment protocol, and NL-to-SMT parsing errors remain explicit.
- The CHURRO deck summarizes an EMNLP 2025 system and dataset but does not publish the classroom discussion or a complete reproducibility package in the course site.
- The ReactGenie deck contains framework examples and study summaries, not a stable API reference or complete application source.
- The final “Training LLMs” session is a data-efficiency research lecture. It is not a comprehensive recipe for pretraining an LLM, despite the short schedule title.

## 14/14 completion audit

- Schedule inventory: 14 linked instructional PDFs, all present above exactly once.
- Content inventory: 14 zh-TW posts and 14 `-en` partners, plus the pre-existing bilingual overview.
- Series invariant: overview order 1; instructional units are contiguous orders 2–15, one bilingual pair per order.
- Scope invariant: every unit identifies or inherits Fall 2025 scope; no Autumn 2026 schedule, slides, assignments, or inferred content were used.
- Exclusions: research/project-idea sessions, proposal presentations, break, no-class day, and final presentation remain outside the instructional inventory because the official schedule provides no lecture PDF for them.

## Editorial contract evidence — revision batch A

Orders 2–6 were expanded only from the five locally extracted official decks (`l-introduction`, `2-knowledge-curation`, `3-task-oriented-agent`, `l-Worksheet2`, `l-freetext`) and the two official homework PDFs already listed. The revision restores deck material that the first drafts compressed: baseline comparisons, explicit intermediate representations, component-level evaluation, deployment gaps, and reproducible exercises. Autumn 2026 material was not consulted or used.

Body-length audit after revision (frontmatter excluded): every zh-TW and English body is at least 6,000 characters. Exact counts remain command-derived rather than copied here so later edits cannot leave stale numbers.

## Editorial contract evidence — revision batch B

Orders 7–11 were expanded from the five locally extracted Fall 2025 decks (`l-db-hybrid-intro`, `l-suql`, `l-longdoc-new`, `l-data-coding`, `l-agentic`). Restored material covers schema/enum failure handling, compiler semantics and optimization, SLIDERS lineage and reconciliation, codebook-driven extraction and entity linking, and SPINACH action/loop evaluation. Every zh-TW and English body passes the 6,000-character frontmatter-excluded audit. No Autumn 2026 artifact was used.

## Editorial contract evidence — revision batch C and 14/14 audit

Orders 12–15 were expanded from `l-semantics`, `l-churro`, `l-multimodal`, and `l-training`: layered SMT/PL matching, historical-document representation and evaluation, ReactGenie DSL/runtime/studies, and fixed-data/synthetic-data experiments. No renamed Autumn 2026 course material was used.

Final length audit enumerates all 28 instructional post files, strips frontmatter through the second `---`, and asserts each body is at least 6,000 characters. It also asserts orders 2–15 occur exactly twice. Both invariants pass; the bilingual overview remains order 1 outside the instructional length set.

## Clean-review remediation evidence

- Every instructional body now identifies its corresponding official Fall 2025 deck inline at the opening; named systems are linked at first substantive appearance where the review requested source-at-point attribution.
- WikiChat claims and the seven-stage grounding description use the peer-reviewed ACL Anthology record: <https://aclanthology.org/2023.findings-emnlp.157/>. The former Stanford OVAL project URL returned 404 and was removed from both language partners.
- ACLED codebook claims use the live official methodology page: <https://acleddata.com/methodology/>.
- Lecture 1's unsupported “70% accurate” framing was removed rather than replaced with an imprecise statistic. The posts retain only the deck-supported reliability argument.
- Pair audit compares all `##` headings for the 14 zh-TW/en units. Missing English sections were translated as substantive paragraphs, including cost/stopping, citation-chain, suitability, and pre-delivery audit in Knowledge Curation.

## Section-level semantic source audit

The blanket paragraph-level stamping pass was reverted because it assigned lecture provenance to author-created implementation advice and made the posts unreadable. The replacement audit classifies sections semantically: concrete lecture facts and reported study behavior receive one nearby deck link; claims tied to WikiChat or an official methodology retain their primary-source link; prototypes, production safeguards, exercises, and review checklists are labeled `本文建議`／`Author extension` and carry no lecture-result attribution.

Manual spot checks covered the review's high-risk examples: CHURRO's twenty-two-century dataset and Qwen base remain sourced, while the four-layer audit is an author extension; ReactGenie case applications and reported novice/user studies remain deck-sourced, while transaction and accessibility advice are extensions; reversal curse, neighbor supervision, critical-threshold discussion, and comparison design remain attributed to the training deck. The task-agent twenty-case harness, structured-data production traces, SMT age/price example, knowledge-source canonicalization, and SUQL prototype are explicitly author-created rather than deck results.

The final narrow audit adds section-scope labels before CHURRO's alignment/provenance and license-classification recipe, and before ReactGenie's schema-version regression commands, selection snapshot/confirmation policy, and annotation-lint/runtime diagnostics. It also splits mixed factual/prescriptive paragraphs in long-document production readiness and SMT clinical safeguards, keeping the deck link only with the supported factual statement and labeling the operational recommendation as an author extension in both languages.

The final pinpoint check applies the same split to Agentic Knowledge Base: fixed-schema one-shot parsing and iterative schema inspection remain attributed to the lecture, while sandboxing, row-level policy, and query-cost limits are labeled as author deployment guidance without a deck link.
