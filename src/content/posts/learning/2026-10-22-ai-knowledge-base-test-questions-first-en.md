---
title: "What's Different When AI Reads Your Knowledge Base: Write the Test Questions First"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, evaluation, test-set, retrieval]
lang: en
tldr: "A wiki that people understand can still trip up an AI: what it sees is a few chunks cut out of the pages, without the navigation, heading hierarchy or surrounding text. So before building RAG, write a set of test questions: each with its answer and its source passage, plus a few deliberately unanswerable ones. Azure's RAG guide does this in parallel with content analysis; one study found that evaluating only with AI-generated questions overstated retrieval performance by 29 to 37 percentage points, so mix in real users' questions. If your knowledge base is under about 500 pages, you may not need RAG at all: put the whole thing in the prompt."
description: "Building Knowledge Bases, order 11: how AI reads documents differently from people, RAG's seven failure points, a map of the nine steps in the AI part, the three fields and four question types of a test set, how synthetic and real questions differ, the limits of LLM judges, and what a model actually sees once a wiki page is chunked."
series:
  name: "Building Knowledge Bases"
  order: 11
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first)

A team connects its wiki to an AI assistant. Someone asks: "Who approves leave of more than three days?" The "Leave and time-off policy" page says it plainly: the department head. The AI answers "your direct manager can approve it." The page isn't wrong, and a person reading it wouldn't get this wrong; the problem is that the AI didn't read the page, it read one chunk of it after the page was cut up.

This is the first post in the AI part of "Building Knowledge Bases", where the reader changes from colleagues to AI. As [order 0](/posts/learning/2026-10-22-knowledge-base-three-readers-en) said, the first post of each part assumes only that you've read the overview; having read the team part (orders 6 to 10) helps, because documents that are well written, maintained and findable are this part's best raw material. This post covers how AI reads documents differently from people, and the one thing to do before building anything: write test questions. How to do each step is left to orders 12 to 19. By the end you'll be able to write 20 test questions with sources and answers before you start building.

## What AI sees is not what people see

Most AI assistants connected to company documents use retrieval-augmented generation (RAG): documents are first split into small chunks and indexed; when someone asks a question, the most relevant few chunks are found and handed to the model along with the question (for the concept, see [Fine-tuning vs RAG](/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag-en)). So the model doesn't see the whole wiki, only a few selected chunks of text.

Most of what people rely on when reading a wiki isn't in those chunks: the page title, the parent category, the navigation on the left, what the previous paragraph was about. Anthropic gave an example in 2024: a chunk saying "The company's revenue grew by 3% over the previous quarter", taken on its own, doesn't say which company or which quarter ([Anthropic 2024](https://www.anthropic.com/news/contextual-retrieval)).

In 2024 Barnett and colleagues drew on three real RAG projects to list seven failure points; the first three all happen before the answer ever reaches the model ([Barnett et al. 2024](https://arxiv.org/abs/2401.05856)):

1. **The content isn't there**: the question is about something the documents don't cover, yet the system may be fooled into making up an answer.
2. **It's there, but not ranked high enough**: the answer is in the documents, but its chunk doesn't rank in the top few that are passed to the model.
3. **Retrieved, but left out**: too many chunks come back, and it's dropped when they're consolidated into the prompt.

The other four are the model failing to extract the answer from the chunks, wrong format, an answer too vague or too detailed, and an incomplete answer. The authors' two conclusions are blunt: a RAG system can only really be validated while it's running, and its robustness is tuned over time rather than designed in at the start. This site also has a fuller [list of failure modes](/posts/ai/2026-03-12-rag-failure-modes-en) and a [debugging log of a silent retrieval failure](/posts/ai/2026-09-19-retriever-silent-failure-en).

One more thing: when the knowledge base is small, you may not need RAG yet. The same Anthropic post says that if your knowledge base is under 200,000 tokens (about 500 pages), you can put the whole thing in the prompt with no retrieval. 200,000 tokens happened to be how much Claude could read at once at the time; recheck it for whatever model you use.

## The nine steps of the AI part

Here is the process this part follows. Test questions come first because the last step uses them to sign off:

```diagram
title: Building a knowledge base for AI: nine steps
desc: Start by writing test questions, then inventory sources, parse and clean, handle security, add structure and metadata, chunk and index, set permissions, set update rules, and finally evaluate and launch using the same test questions.
caption: Dashed line: the last step signs off using the test questions from the first. Numbers are this series' orders.
---
<svg viewBox="0 0 420 704">
  <path class="dg-line" d="M160 76V92" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 152V168" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 228V244" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 304V320" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 380V396" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 456V472" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 532V548" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 608V624" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M300 48H372Q380 48 380 56V648Q380 656 372 656H304" marker-end="url(#arrow)"/>

  <g>
    <rect class="dg-box dg-box--accent" x="20" y="20" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="39" text-anchor="middle" dominant-baseline="central">11 Test questions first</text>
    <text class="dg-sub" x="160" y="59" text-anchor="middle" dominant-baseline="central">question, source, answer</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="96" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="115" text-anchor="middle" dominant-baseline="central">12 Inventory sources</text>
    <text class="dg-sub" x="160" y="135" text-anchor="middle" dominant-baseline="central">what to include, which version</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="172" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="191" text-anchor="middle" dominant-baseline="central">13 Parse and clean</text>
    <text class="dg-sub" x="160" y="211" text-anchor="middle" dominant-baseline="central">PDFs, tables, scans</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="248" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="267" text-anchor="middle" dominant-baseline="central">14 Security</text>
    <text class="dg-sub" x="160" y="287" text-anchor="middle" dominant-baseline="central">PII, hidden instructions</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="324" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="343" text-anchor="middle" dominant-baseline="central">15 Structure, metadata</text>
    <text class="dg-sub" x="160" y="363" text-anchor="middle" dominant-baseline="central">titles, dates, owners</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="400" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="419" text-anchor="middle" dominant-baseline="central">16 Chunk and index</text>
    <text class="dg-sub" x="160" y="439" text-anchor="middle" dominant-baseline="central">chunk size, how to search</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="476" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="495" text-anchor="middle" dominant-baseline="central">17 Permissions</text>
    <text class="dg-sub" x="160" y="515" text-anchor="middle" dominant-baseline="central">who can find which doc</text>
  </g>
  <g>
    <rect class="dg-box" x="20" y="552" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="571" text-anchor="middle" dominant-baseline="central">18 Update and delete</text>
    <text class="dg-sub" x="160" y="591" text-anchor="middle" dominant-baseline="central">keeping it current</text>
  </g>
  <g>
    <rect class="dg-box dg-box--accent" x="20" y="628" width="280" height="56" rx="6"/>
    <text class="dg-label" x="160" y="647" text-anchor="middle" dominant-baseline="central">19 Evaluate and launch</text>
    <text class="dg-sub" x="160" y="667" text-anchor="middle" dominant-baseline="central">sign off with the test set</text>
  </g>
</svg>
```

## Why write test questions first

Microsoft's Azure Architecture Center has a RAG design guide whose first phase is preparation: gathering documents, analyzing the content, and gathering test questions, done in parallel because they're interrelated ([Azure: RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)). Content analysis tells you which test questions to gather; the test questions tell you which content must be included.

Writing test questions first has three benefits:

- **You know what to include.** If you can't source a question's answer, either the document hasn't been collected yet, which is where order 12's source inventory starts, or no document exists, in which case it belongs to the "not in the knowledge base" type.
- **Every later step becomes measurable.** Azure's guide says that having both the questions and the passages that answer them lets you evaluate every stage of the RAG solution as you try different approaches.
- **You can tell where it broke.** Kulkarni and Savelieva of Microsoft point out that only a test set that records source passages lets you split errors into three kinds: the right passage wasn't retrieved; it was retrieved but lacked the needed information; or the information was all there and the model still didn't answer well ([Kulkarni & Savelieva 2024](https://medium.com/data-science-at-microsoft/the-path-to-a-golden-dataset-or-how-to-evaluate-your-rag-045e23d1f13f)).

## What a test question looks like

Azure's format has three fields:

- **Question**: something a real user might ask.
- **Context**: the original passages in the documents that answer it, with the page or location.
- **Answer**: the correct response, either quoted from the documents or synthesized from several passages.

It's often simplified to "question plus answer", but the source passage is a required field: without it, you can only check whether the final answer is right, not whether retrieval or the model is to blame.

**Include questions the documents can't answer, on purpose.** Azure's guide specifically says to gather queries the documents don't address, because you have to decide how the system should respond to them: say it doesn't know, or say it doesn't know and point to where the answer might be found. In 2024 Peng and colleagues sorted such questions into six types; I'd start with three of them: questions missing key information, which need a follow-up; questions with a false premise; and questions about things the knowledge base doesn't contain ([Peng et al. 2024](https://arxiv.org/abs/2412.12300)). They also found that optimizing only for correctness on answerable questions can wreck a system's ability to decline: on TriviaQA, one configuration tied for the best accuracy on answerable questions handled only 49% of unanswerable ones acceptably, near the bottom of the 27 combinations tested.

So a test set needs at least four question types:

| Type | Example | Expected response |
|---|---|---|
| Answerable | Who approves leave of more than three days? | The department head (source: "Leave and time-off policy", section 3) |
| Needs a follow-up | How many days of leave can I take? | First ask which kind of leave and how long they've worked here |
| False premise | Why can't annual leave be carried over? | Point out the policy does allow carry-over, with the source |
| Not in the knowledge base | Who approves five days of leave for a contractor? | Say the full-time rules don't apply and point to "Contractor leave rules" or HR; don't reuse the full-time answer |

## Synthetic questions are fine, but mix in real ones

Writing questions by hand is slow. In one project Kulkarni and Savelieva describe, the client's subject-matter experts took eight to ten days to come up with 10 questions. So a common approach is to have an LLM generate questions from the documents: Azure's guide suggests starting with two per chunk and having a subject-matter expert review them.

**Synthetic questions must be reviewed by a person.** Kulkarni and Savelieva had an LLM generate 100 questions from an earnings call transcript and had a finance expert review each one; 27 failed, most often because the answer was correct but incomplete.

**Synthetic questions alone overstate the system.** In 2026 Kucia and Gawlik compared AI-generated questions with questions real students asked at one college ([Kucia & Gawlik 2026](https://arxiv.org/abs/2609.14579)). Synthetic questions were on average more than twice as long as real ones and covered many more documents; real questions clustered on a few pages, such as timetables and the academic calendar. For the same retrieval systems, top-five hit rates fell by 29 to 37 percentage points when switching to the real questions that could be matched to a page. Worse, looking only at synthetic questions would lead you to pick hybrid retrieval; on real questions it was no more accurate, yet 1.7 times slower than plain vector retrieval in the same database.

There's one more thing: nearly half of the real questions couldn't be mapped to any single fixed page, because they needed personal data or live data, or were too vague. Synthetic questions are generated from the documents and so are answerable by definition; they will never produce questions like these.

The authors recommend collecting 50 to 100 real questions from target users before launch, comparing them with the synthetic set, and only then choosing an architecture. Azure's guide also names sources for real questions: help desk tickets, FAQs and ticketing systems. Order 10's search logs are another.

## LLM judges: check what they're judging

With more questions, it's tempting to let an LLM decide whether answers are right. That works for comparing whole systems; for individual questions, be careful. In 2025 Thakur and colleagues had GPT-4o and human judges decide the same thing: whether an answer was supported by the passages it cited ([Thakur et al. 2025](https://arxiv.org/abs/2504.15205)). For ranking systems, the two agreed well. Item by item, much less so: labeling from scratch, they agreed exactly only 56% of the time, and GPT-4o was more lenient. On another set of topics where people saw GPT-4o's labels first and revised them, agreement rose to 72%; the authors note that people tended to go along with it unless it was obviously wrong.

NVIDIA, sharing its experience building three internal chatbots, also warns that LLM judges can reinforce their own biases, and that automated tools should supplement human review, not replace it ([Akkiraju et al. 2024](https://arxiv.org/abs/2407.07858)).

So my approach: to compare which of two versions is better, let an LLM run first; to decide whether a particular question was really answered correctly, have a person check at least a sample.

## Example: what the model sees once a wiki page is chunked

The original page:

> **Leave and time-off policy** (HR, last confirmed 2026-09-01)
>
> **1. Scope**: all full-time employees. Contractors, see "Contractor leave rules".
>
> **2. Types of leave**: annual, sick, personal, marriage, bereavement. Annual leave is based on length of service; unused days can be carried over until the end of June the following year.
>
> **3. Applying and approval**: apply for leave in the system. Up to three days is approved by your direct manager; more than three days by the department head.
>
> **4. The old rules**: before 2025, all leave was approved by your direct manager.

Suppose the chunking tool cuts at a fixed length. Three of the chunks the model might get are:

> Chunk A: "…Annual leave is based on length of service; unused days can be carried over until the end of June the following year. 3. Applying and approval: apply for leave in the system. Up to three days is approved by your direct manager;"
>
> Chunk B: "more than three days by the department head. 4. The old rules: before 2025, all leave was approved by your direct manager."
>
> Chunk C: "1. Scope: all full-time employees. Contractors, see "Contractor leave rules". 2. Types of leave: annual, sick, personal…"

For "who approves leave of more than three days", the first half of chunk B is the answer and the second half is the old rule; if retrieval happens to get only chunk A, or the model takes the old rule as current, you get the wrong "direct manager" answer from the opening. None of the three chunks carries the page title, so there's no telling which policy this is, who it applies to, or when it was last confirmed. These problems are what order 15 (structure and metadata), order 16 (chunking) and order 18 (handling old content) address.

When this question goes into the test set, its source should be marked "Leave and time-off policy, section 3"; when the answer is wrong, looking at which chunks retrieval returned tells you which step to fix.

## Limits of the research

Barnett's seven failure points come from experience on three projects, and Akkiraju's is NVIDIA's experience report; neither is a controlled experiment. Azure's guide and Kulkarni's blog post are practical advice, and their question counts are rules of thumb: Kulkarni says about 100 is a common starting point, and Kucia recommends 50 to 100 real questions; this post's 20 questions are a first hand-written round, smaller than either. Kucia's study is one college and one language; Peng's experiments use Wikipedia question-answering data, not company documents; and Thakur evaluates only one aspect, whether answers are supported by their citations. The Anthropic sentence is the vendor's own claim, and the threshold will change with the models.

## What you can do tonight

1. **List the 20 questions colleagues ask most.** Pull them from group chats, support tickets or order 10's search logs rather than imagining them.
2. **Find the answer and source passage for each.** Flag the ones you can't source: documents that exist but weren't collected go to order 12; questions with no document at all become step 3's types.
3. **Then add 5 questions the documents can't answer** (leave the source blank and write the expected response instead). At least one each that needs a follow-up, has a false premise, or isn't in the knowledge base, and write down how you'd want the system to respond.
4. **Save it as a spreadsheet.** Columns: question, source, answer, type, origin (real or synthetic). Every later post will use it.

## Self-check

**Q:** For the same question, people can find the answer on the wiki, but the AI gets it wrong. What are three places it could have broken?

**How to judge:** First, the content was never collected into the knowledge base, for example the page lives in another system that wasn't imported (Barnett's first failure point). Second, chunking stripped the context, for example the answer and the old rule ended up in the same chunk and the page title didn't travel with it. Third, the right passage was found but not ranked high enough, so it was never passed to the model (the second failure point). With the source passage recorded in the test set, you can check each in turn: is that passage in the index, what did it look like after chunking, and where did it rank this time.

## References

- [Anthropic 2024, Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [Barnett et al. 2024, Seven Failure Points When Engineering a Retrieval Augmented Generation System (CAIN 2024)](https://arxiv.org/abs/2401.05856)
- [Microsoft Azure Architecture Center, RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)
- [Microsoft Azure Architecture Center, Design and develop a RAG solution](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide)
- [Kulkarni & Savelieva 2024, The path to a golden dataset, or how to evaluate your RAG? (Data Science at Microsoft)](https://medium.com/data-science-at-microsoft/the-path-to-a-golden-dataset-or-how-to-evaluate-your-rag-045e23d1f13f)
- [Peng, Choubey, Xiong & Wu 2024, Unanswerability Evaluation for Retrieval Augmented Generation (arXiv)](https://arxiv.org/abs/2412.12300)
- [Kucia & Gawlik 2026, Beyond Benchmark Scores: How Synthetic and Authentic Query Distributions Diverge in RAG Evaluation (CIKM 2026, arXiv)](https://arxiv.org/abs/2609.14579)
- [Thakur et al. 2025, Support Evaluation for the TREC 2024 RAG Track: Comparing Human versus LLM Judges (arXiv)](https://arxiv.org/abs/2504.15205)
- [Akkiraju et al. 2024, FACTS About Building Retrieval Augmented Generation-based Chatbots (NVIDIA, arXiv)](https://arxiv.org/abs/2407.07858)
- On this site: [Fine-tuning vs RAG: When to Teach the Model vs When to Look Things Up](/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag-en)
- On this site: [RAG Common Failure Modes: 10 Problems and Their Solutions](/posts/ai/2026-03-12-rag-failure-modes-en)
- On this site: [10% of Conversations Were Making Things Up: Debugging a Silent Retriever Failure](/posts/ai/2026-09-19-retriever-silent-failure-en)
