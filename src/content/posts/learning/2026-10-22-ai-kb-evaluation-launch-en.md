---
title: "Evaluation and Launch: How to Know Your AI Knowledge Base Works, and Keep It Improving"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, evaluation, monitoring, llm-as-judge]
lang: en
tldr: "Evaluate in two layers: did retrieval find the source passage, and is the answer grounded in it and correct. Looking only at answers can fool you: one study found that when the context wasn't enough to answer, models still got 35% to 62% right using their own knowledge, which breaks on questions only your organization can answer. Use order 11's test questions for both layers, and evaluate permission-crossing and unanswerable questions too; calibrate LLM judges against human samples. After launch, turn escalated and complained-about conversations into failure cases, hand them back to document owners, and add them to the test set."
description: "Building Knowledge Bases, order 19: separating retrieval and answer evaluation, what a correct answer without retrieval means, the limits of LLM judges and human calibration, permission-crossing and unanswerable questions, monitoring after launch and routing failures back, and reading the results of a 20-question evaluation. The close of the series."
series:
  name: "Building Knowledge Bases"
  order: 19
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-kb-evaluation-launch)

A team evaluates its new AI knowledge base with 20 test questions: 80% of answers are correct, and everyone gets ready to launch. Then someone looks at retrieval: of the 14 answerable questions, the source passage appeared in the top 5 for only 9. How did the AI get the rest right?

This is the last post in the AI part of "Building Knowledge Bases", and the last in the series. [Order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first-en) wrote the test questions before anything was built, and orders 12 to 18 built the knowledge base step by step; this post signs it off with the same test questions and covers how to keep improving after launch. The site's post on [RAG evaluation frameworks and tools](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) already compares evaluation tools, so this post won't repeat it. By the end you'll be able to run a retrieval evaluation and set up a process for handing failures back to their owners.

## Evaluate in two layers: retrieval and answers

Azure's RAG guide puts retrieval evaluation and answer evaluation in different phases; the answer phase checks several aspects, including whether the answer is grounded in the provided content, complete and correct ([Azure: LLM end-to-end evaluation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase)). The original RAGAS paper, a widely used evaluation approach, likewise separates "is the answer faithful to the retrieved content" from "is the retrieved content relevant" into different metrics ([Es et al. 2024](https://aclanthology.org/2024.eacl-demo.16/)).

Why separate them? Because problems in each layer are fixed by different people. If retrieval missed, the cause may lie in orders 12 to 16: not collected, broken parsing, bad chunking, no metadata to filter on. Only when retrieval found the content and the answer is still wrong is it a prompt or model problem. Looking only at the final answer, you can't tell which layer broke.

Order 11's test questions let you evaluate both layers:

- **Retrieval**: does each question's source passage appear in the top 5? The same metric order 16 used.
- **Answer**: is the answer correct, and does its content come from the passages it cites?

## A correct answer that didn't use retrieval

The opening situation, a high answer accuracy with a low retrieval hit rate, has an explanation in a 2025 study by Joren and colleagues ([Joren et al. 2025](https://arxiv.org/abs/2411.06037)): even when the context given to the model wasn't enough to answer, models still got 35% to 62% of questions right; the authors attribute most of this to what the model already knew. In other words, models fill in answers from their own knowledge. An Ericsson team saw something similar in the telecom domain: on questions where retrieval was wrong but the answer was right, the answer's consistency with the retrieved content was low, meaning the answer didn't come from retrieval ([Roychowdhury et al. 2024](https://arxiv.org/abs/2407.12873)).

This looks fine in testing and fails after launch. If your test questions include many that public knowledge can answer, the model gets them right on its own; switch to questions only your company can answer, like internal processes or the latest policies, and it can't answer, or answers with outdated public information. DoorDash, describing its support chatbot, also named outdated public information from the model's training data as one source of errors ([DoorDash 2024](https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/)).

A low retrieval hit rate doesn't always have this cause, though. Salemi and Zamani found in 2024 that retrieval scores computed from human-labeled source passages correlated weakly with final answer quality ([Salemi & Zamani 2024](https://arxiv.org/abs/2404.13781)); sometimes the labeled source is incomplete and other passages could answer too. So when you see this gap, check question by question: is the answer's content in the passages it cites? If yes, the source label may be missing something; if no, the model answered on its own.

## LLM judges: calibrate against people

With more questions, it's natural to have an LLM judge whether answers are right. Order 11 mentioned Thakur and colleagues' study: GPT-4o and human judges agreed well when ranking systems; but judging question by question whether answers were supported by their cited passages, they agreed exactly only 56% of the time, and GPT-4o was more lenient than people. Azure's guide also recommends that the judge ideally be a different model from the one generating answers.

DoorDash's approach is worth borrowing: they first found that coarse metrics like user satisfaction gave nothing actionable, so people read thousands of conversations and defined five quality aspects; then they monitored those with an LLM judge plus rules, while a team of people continuously reviewed random samples, calibrating against the automated judge.

My suggestion: when comparing two versions, let an LLM judge run first; to decide whether a particular question was really answered correctly, have people review at least a sample every time, and record where people and the LLM disagree.

## Evaluate permission-crossing and unanswerable questions too

Order 11's test set has four question types, and order 17 added a permission-crossing test. Score these separately when evaluating, not averaged in with ordinary questions:

- **Unanswerable questions**: the expected response is "can't find it" or a follow-up question. Check whether it declined or asked a follow-up rather than making something up.
- **Permission-crossing questions**: asked from an account with narrow permissions, the expected response is "can't find it". If even one returns content it shouldn't, don't launch, however good the other scores.
- **False-premise questions**: the model should point out the false premise.

The site's post on [a private-corpus retrieval evaluation](/posts/ai/2026-08-22-private-corpus-retrieval-eval-en) also notes that questions outside the knowledge base can't be scored with recall and should be reported separately.

## Example: reading a 20-question evaluation

Suppose the 20 questions come out like this:

| Type | Questions | Retrieval hit (top 5) | Answer correct |
|---|---|---|---|
| Answerable | 14 | 9 | 12 |
| Needs a follow-up | 2 | — | 1 |
| False premise | 1 | — | 0 |
| Not in the knowledge base | 2 | 0 (should be 0) | 2 |
| Permission-crossing | 1 | 0 (should be 0) | 1 |

Reading it:

- **Three answerable questions were "answered correctly, retrieval missed".** Check each: for two, the answer is in the cited passages and the source label was incomplete, so update the test set; for one, the answer isn't in any passage and the model answered on its own, so check whether that question's source document was ever collected.
- **Two more missed in retrieval and got the answer wrong.** One was a flattened table (order 13), one a model number that vector search couldn't find (order 16). Hand them to whoever owns parsing and whoever owns indexing.
- **One of the two follow-up questions went wrong**: the model gave an answer without first asking which kind of leave. **The false-premise question went wrong too**: the model went along with the false premise. Both are prompt problems; add an instruction to ask a follow-up when information is missing and to check the question's premise first, then re-run.
- **The permission-crossing and not-in-the-knowledge-base questions passed.** These two types must pass every time.

The numbers in this table are illustrative, not measured; the point is that every question gets assigned a cause and handed to the right person.

## After launch: hand failures back to owners

Launch isn't the end. Azure's guide notes that documents change and users' questions change, so evaluation has to be repeated, and past evaluation results should be kept.

**Where to find failures.** In 2025 DoorDash selected only conversations escalated to human agents, since those are exactly where the chatbot fell short; it clustered similar conversations, ranked them by frequency and severity to find what the knowledge base was missing, and had content specialists and operations staff review LLM-written drafts before adding them ([DoorDash 2025](https://careersatdoordash.com/blog/doordash-llm-chatbot-knowledge-with-ugc/)). In the A/B test they report, for high-traffic issue clusters, 78% of conversations were escalated to humans in the control group versus 43% in the treatment group.

**Who gets them.** This is where order 9's maintenance responsibilities from the team part come back in ([order 9](/posts/learning/2026-10-22-team-wiki-maintenance-ownership-en)): for each failure, find the document and owner it maps to. "Document owner" is my simplification; DoorDash routes to content specialists and operations partners, and your organization may use other roles.

**My feedback loop:**

1. **Collect.** Each week, gather conversations that were escalated, marked unhelpful, or followed up on.
2. **Classify.** Assign each one cause: not collected, broken parsing, a chunking or indexing problem, a permissions problem, the document itself outdated or missing, or the model answering badly.
3. **Assign.** Document problems go to the document owner; indexing and parsing problems go to whoever maintains the knowledge base.
4. **Add to the test set.** Every fixed case becomes a permanent test question so the same problem doesn't come back. The site's post on [RAG evaluation frameworks and tools](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) covers turning incidents into regression tests.
5. **Check against sources regularly.** When documents are updated, the test questions' answers and sources must be updated too, or the test set itself goes stale.

## Limits of the research

Joren and colleagues used public Wikipedia-style datasets, so "it breaks on private questions" is my inference from that; Roychowdhury and colleagues' study is one company in one domain. Salemi and Zamani used very small models and Wikipedia data. DoorDash's results are the company's own report, without a full published evaluation method. The RAGAS paper validated its metrics on only 50 questions. Azure's guide is official advice.

## What you can do tonight

1. **Run a two-layer evaluation on order 11's test questions.** For retrieval, check whether the source passage is in the top 5; for answers, check correctness and whether they're grounded in the passages.
2. **Pull out the "answered correctly, retrieval missed" questions.** Check, question by question, whether the answer is in the cited passages.
3. **Make sure permission-crossing and unanswerable questions are scored separately.** If a single permission-crossing question fails, don't launch.
4. **Set a weekly feedback slot.** Who collects failures, who classifies them, whom they go to, and how soon they join the test set.

## Self-check

**Q:** Answer accuracy is high, but the retrieval hit rate is low. What does that mean?

**How to judge:** Most likely the model is answering from its own knowledge and the knowledge base isn't doing its job; you won't notice on questions public knowledge can answer, but it breaks on questions only your company can answer. It could also mean the test set's source labels are incomplete, or the questions are easy to guess. So check question by question: is the answer's content in the passages it cites? If not, the model answered on its own; check whether the source document was collected and why retrieval missed it, and add more questions that only internal documents can answer.

## Looking back over the series

This series started from three readers: yourself, your colleagues, and AI. The personal part (orders 1–5) covered what to keep, where to put it, how to link it, which tools to use and how to maintain it; the team part (orders 6–10) covered which documents to write, how to structure them, how to write them, who maintains them and how to make them findable; the AI part (orders 11–19) ran from test questions to evaluation and launch. All three are really the same job: someone has to know what's in the knowledge base, why it's there, and whether it's still right. Go back to the [overview](/posts/learning/2026-10-22-knowledge-base-three-readers-en) to see how the three parts fit together.

## References

- [Microsoft Azure Architecture Center, Large language model end-to-end evaluation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase)
- [Es, James, Espinosa-Anke & Schockaert 2024, Ragas: Automated Evaluation of Retrieval Augmented Generation (EACL 2024 Demo)](https://aclanthology.org/2024.eacl-demo.16/)
- [Joren et al. 2025, Sufficient Context: A New Lens on Retrieval Augmented Generation Systems (ICLR 2025)](https://arxiv.org/abs/2411.06037)
- [Roychowdhury et al. 2024, Evaluation of RAG Metrics for Question Answering in the Telecom Domain (ICML 2024 Workshop)](https://arxiv.org/abs/2407.12873)
- [Salemi & Zamani 2024, Evaluating Retrieval Quality in Retrieval-Augmented Generation (SIGIR 2024)](https://arxiv.org/abs/2404.13781)
- [Thakur et al. 2025, Support Evaluation for the TREC 2024 RAG Track: Comparing Human versus LLM Judges (arXiv)](https://arxiv.org/abs/2504.15205)
- [DoorDash 2024, Path to high-quality LLM-based Dasher support automation](https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/)
- [DoorDash 2025, A scalable LLM approach to enhancing chatbot knowledge with user-generated content](https://careersatdoordash.com/blog/doordash-llm-chatbot-knowledge-with-ugc/)
- On this site: [RAG Evaluation Frameworks and Tool Selection: Promptfoo, RAGAS, DeepEval, and TruLens](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)
- On this site: [Private-Corpus Retrieval Eval: Turning a Traditional Chinese Query Set into a Reproducible Benchmark](/posts/ai/2026-08-22-private-corpus-retrieval-eval-en)
