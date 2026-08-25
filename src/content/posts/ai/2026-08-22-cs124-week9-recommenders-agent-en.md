---
title: "CS124 Week 9 Collaborative Filtering and LLM Agents: From Movie Similarity to Search and Memory Tools"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, recommender-system, ai-agent, llm]
lang: en
series: { name: "Reading Stanford CS124", order: 10 }
tldr: "Week 9 builds movie recommendations with item-item collaborative filtering, then packages recommendation, web search, databases, and memory as agent tools under API-budget and team constraints."
description: "Stanford CS124 Winter 2026 Week 9: recommender systems, collaborative filtering, cosine similarity, LLM tools, search, memory, Lab 5 ethics, and PA7."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week9-recommenders-agent)

Week 9 places a traditional recommendation algorithm inside an LLM agent. The reading develops recommender systems and collaborative filtering; Lab 5 adds classroom LLM ethics; PA7 asks a team to build a customer-service agent that recommends movies, searches the web, and uses database and memory tools.

**Version:** Winter 2026. **Unit:** Week 9, March 3 and 5. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [collaborative-filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering21.pdf), [MMDS Chapter 9](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf), [Lab 5](https://github.com/cs124/labs/blob/main/Lab5_Chatbots.md), and [PA7](https://github.com/cs124/pa7-agent). **Gap:** Lab 5 was not recorded and Quiz 8 is gated. PA7 depends on changing external services. The schedule retains “Chatbot”; the released repository is “Agent.”

## Recommendation is not search

Search starts from an explicit query. Recommendation often predicts an item from behavior without one. The [collaborative-filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering21.pdf) distinguish editorial lists, popular aggregates, and personalized recommendations. Collaborative filtering uses interaction patterns rather than requiring a semantic description of every movie.

[PA7](https://github.com/cs124/pa7-agent) specifies item-item collaborative filtering. Rows are movies, columns are users, and cosine similarity compares movie rating vectors. A user's rated items contribute scores to candidates. The README explicitly requires no mean-centering or score normalization, so this assignment variant should not be silently replaced with another textbook formulation.

## Sparse matrices create structural failures

Most users rate few items. New users and new movies lack history, producing cold start. Popular items have more observations and may receive more stable similarities, potentially reinforcing exposure. The output is a behavioral estimate, not a guarantee of quality or suitability.

## A recommender becomes an agent tool

[PA7](https://github.com/cs124/pa7-agent) first implements `similarity` and `recommend_movies`, then exposes recommendation to an LLM agent. The model should select the tool and pass structured arguments rather than pretending to calculate the rating matrix internally.

Web search supplies current external information; memory preserves information across interactions; database tools change structured state. Their failures differ: search can retrieve poor sources, memory can retain incorrect or sensitive data, and database calls can mutate real records. Each tool therefore needs explicit inputs, outputs, error handling, and tests.

Deterministic functions belong under unit tests. LLM routing requires repeated runs and recorded failure cases because the [PA7 README](https://github.com/cs124/pa7-agent) warns about nondeterminism. One successful transcript is not adequate verification.

## API budget changes development

The [PA7 setup instructions](https://github.com/cs124/pa7-agent) require Together and SerpAPI keys and warn that REPL runs consume budget. Test pure functions and tool wrappers first, then spend a small number of end-to-end calls. Keys must not enter the repository.

## What the Lab 5 evidence supports

The [schedule](https://web.stanford.edu/class/cs124/lec/) names Lab 5 “Collaborative Filtering and Ethical Use of LLMs in the Classroom.” The public artifact proves that discussion topic, but the unrecorded meeting does not support attributing a particular conclusion to students or staff.

## A concrete Week 9 finish line

The finish line is deterministic collaborative-filtering tests with traceable similarity contributions, success and failure cases for search/memory/database, and then bounded agent runs. The [PA7 README](https://github.com/cs124/pa7-agent) requires a three- or four-person team and disallows late days.

## Hand-computing item-item collaborative filtering

In the [PA7 repository](https://github.com/cs124/pa7-agent), movie rows are user-rating vectors and cosine divides their dot product by both norms; zero norms and no co-rating evidence require explicit handling. A candidate score sums the active user's `rating × similarity` contributions. PA7 forbids mean-centering and normalization, so alternative variants will fail its expected list.

Use the [PA7 README's Peter example](https://github.com/cs124/pa7-agent) as an exact-order regression test with deterministic tie-breaking. Preserve per-rated-movie contributions so a wrong recommendation can be debugged below the LLM layer.

## Evaluating recommendation

Hold out known interactions and test whether they return in top-k, with leakage-safe splits. Compare a popular-item baseline and slice cold-start users, heavy users, popular items, and tail items. Coverage and diversity can be labeled self-study extensions rather than PA7 grading claims.

## Tool contracts before prompts

Define name, typed inputs, structured outputs, errors, and side effects. Missing users should return explicit errors. Recommendation returns IDs, titles, and scores; search returns titles, snippets, and URLs; database calls return status and record ID. Natural-language rendering belongs after deterministic tools.

## Search evidence and failures

The [PA7 README](https://github.com/cs124/pa7-agent) warns about limited search quota and autograder usage. Handle missing keys, quota exhaustion, timeout, empty results, and malformed responses without letting the model invent results. Test parsing with redacted fixtures or mocks, then use limited live calls for integration. Preserve result URLs as evidence.

## Memory lifecycle

Define what is written, scope, keys, updates, conflicts, deletion, and user isolation. A stable movie preference differs from a one-time booking time. Test create, retrieve, update, conflict, delete, and wrong-user access. Document stored fields and avoid real personal data.

## Database side effects

Reads are safely retryable; bookings and cancellations may not be. A timeout followed by blind retry can duplicate a booking. Require confirmation for impactful mutations and treat the database status and booking ID—not the LLM's wording—as success evidence.

## Testing nondeterministic orchestration

Unit-test recommendation, parsing, and database updates. Scenario-test tool selection and responses across repeated runs. Include recommendation, clarification, empty search, memory conflict, timeout, and mutation confirmation. Define allowed tool sequences and required facts rather than exact prose.

Record model, temperature, prompt version, schemas, and run IDs so regressions can be assigned to code, prompt, or provider changes.

## Reflection and team delivery

Mark `rubrics.txt` features truthfully and record code and test ownership. Recommendation affects exposure, memory stores personal data, search imports external sources, and mutations change state; evidence logs serve both safety and debugging. Include a failure demo where exhausted search quota produces a clear limitation rather than fabrication.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Collaborative Filtering slides](https://web.stanford.edu/class/cs124/lec/collaborativefiltering21.pdf)
- [Mining of Massive Datasets, Chapter 9](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf)
- [CS124 Lab 5](https://github.com/cs124/labs/blob/main/Lab5_Chatbots.md)
- [CS124 PA7 Agent](https://github.com/cs124/pa7-agent)
