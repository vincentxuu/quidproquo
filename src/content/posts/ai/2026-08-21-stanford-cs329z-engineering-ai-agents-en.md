---
title: "Engineering AI Agents: Building an Agent Harness from One Chat-Completion Call, No Frameworks | Stanford CS329Z Course Overview"
date: 2026-08-21
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 16
tldr: "CS329Z is Stanford's course on engineering AI agents: you first build RAG, tool use and the agent loop by hand without frameworks, then see what frameworks like DSPy abstract away; the two assignments are building an agent harness and designing an agent evaluation. The syllabus, the assigned readings, the first nine slide decks, and the starter code, data and public tests for Assignment 1 are available; the recordings require an enrolled Canvas login."
description: "A self-study route through Stanford CS329Z: RAG, tools, context, memory, multi-agent coordination, and optimization, with nine official slide decks, the HW1 starter, and Terminal-Bench guest readings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

[CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) is a three-unit course running for the first time in Autumn 2026 in Stanford's CS department. The load-bearing word in the title is **Engineering**. It is not ten weeks of reading the latest agent papers. Students build an agentic system end to end, measure it, and then perform it on Demo Day.

The frame the course site opens with is "compound AI systems": systems assembled from LLMs, retrievers, tools and optimizers that interact with each other. The site calls this a fundamental shift in how AI applications get built. The three threads that run through the quarter are named in the very first session description — decomposition, data, evaluation.

For self-study, follow the path from building a working system to making it reliable: retrieval and tools first, then context, memory and coordination, followed by data-driven optimization and evaluation. This overview maps the entry points. Weeks 4–5 now include the released decks; Week 6 adds the Terminal-Bench readings. Recordings still require course Canvas access.

## The hard facts

Three instructors, all listed in the Instructors block on the course site. [Diyi Yang](https://cs.stanford.edu/~diyiy/) is an assistant professor in Stanford CS working on socially aware NLP and human-AI interaction; she won a Sloan Research Fellowship in 2024. [Michael Ryan](https://michryan.com/) is a PhD student co-advised by Diyi Yang and Percy Liang, a Knight-Hennessy Scholar, and a core contributor to [DSPy](https://dspy.ai/). [John Yang](https://john-b-yang.github.io/) is a second-year PhD student advised by Ludwig Schmidt and Diyi Yang, and first author on SWE-agent and [SWE-smith](https://arxiv.org/abs/2504.21798).

The [CS329Z entry on ExploreCourses](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog) originally listed only Ryan and Diyi Yang as PIs; all three are on it now. A week before the quarter, the course site also added four TAs: Owen Queen, Anusheh Chaudry, Shreyas Sharma and Houjun Liu.

The rest of what's on record: three units, Letter or Credit/No Credit. Taught in person in the autumn quarter, Mondays and Wednesdays in the afternoon; in the first week of the quarter the room moved from Packard 101 to Skilling Auditorium.

Prerequisites live in the Logistics section of the course site: one of [CS224N](https://web.stanford.edu/class/cs224n/), [CS224U](https://web.stanford.edu/class/cs224u/), [CS224V](https://web.stanford.edu/class/cs224v/), [CS336](https://stanford-cs336.github.io/), or equivalent NLP background. The first lecture's slides put it more bluntly: train/dev/test, pretraining, fine-tuning, alignment and prompting are assumed knowledge — "We will not cover these in this course!" **The ExploreCourses entry has no prerequisites field at all** — read only the registrar and you'd think the course has no gate on it.

The same slide lists compute credits: each student gets $200 from the Laude Institute plus $250 from Thinking Machines. That is a real subsidy against the API bills for the assignments and the project.

The course filled up in its first week. The site posted a waitlist form and an audit request form, both of which only open with a Stanford email, and auditing is limited to Stanford students. The same notice goes on to say "All course materials on this site are publicly available" — outsiders can't get into the room, but whatever the site posts is theirs to take.

**On-record details**: class number 27855, Session 2026-2027 Autumn 1, quarter running 2026-09-22 to 2026-12-04, Mondays and Wednesdays 1:30–2:50 p.m., Skilling Auditorium (originally scheduled for Packard 101 before the quarter), final exam slot 2026-12-09 3:30–6:30 p.m. (from ExploreCourses and the Logistics section of the course site).

## The course's claim: build it by hand, then see what the framework abstracts

The line worth remembering sits in the second paragraph of the welcome message on the site:

> Students first build core components (RAG, tool use, agent loops) from scratch, then learn how frameworks like DSPy abstract these patterns.

The ordering is deliberate, and it isn't just a slogan — it's written into the schedule and the assignment structure. RAG is session three, with the description tagging it hands-on: "build a RAG pipeline from scratch." Tool calling is session four, also hands-on. Both come before the frameworks session. The [DSPy paper](https://arxiv.org/abs/2310.03714) and the comparison against LangChain and LlamaIndex land in session five, whose topic is literally "what frameworks abstract vs. what you built from scratch."

This arrangement fixes a very concrete problem: people who learn the framework first usually can't say what the framework did for them. You can call `dspy.ReAct`, but you can't say which step of the ReAct loop is model output, which step is your code parsing that output, or who retries when it fails. Once you've written it by hand, the abstraction becomes something you can evaluate rather than something you have to trust.

The homework pushes this claim further than the schedule does. The first assignment originally came in two halves: build by hand, then rewrite in DSPy. After the early-September revision, the second half is gone entirely. The whole assignment now bans agent frameworks and gives you a single chat-completion call. Frameworks show up in lecture; in the homework you may not use a single line of one.

**Self-learners can copy this directly**: don't start learning agents at `pip install`. Take the official SDK or a thin wrapper like [litellm](https://github.com/BerriAI/litellm), and write retrieval, tool calling, loop control and memory yourself. Once it runs, hold a framework up against it and see which decisions it would have made for you.

## DSPy is where the course lands, but its author has left Stanford

DSPy came out of Stanford NLP. [Omar Khattab](https://omarkhattab.com/) did his PhD at Stanford, advised by Christopher Potts and Matei Zaharia, on foundation model programming; DSPy and ColBERT both came off that line. But he [joined MIT EECS as an assistant professor in July 2025](https://www.eecs.mit.edu/people/omar-khattab/), after a stint as a research scientist at Databricks.

So "a Stanford course teaching a Stanford framework" is only half true today. The real connection is on the teaching side. Michael Ryan is co-first author of the [MIPROv2 paper](https://arxiv.org/abs/2406.11695) and a co-author of [GEPA](https://arxiv.org/abs/2507.19457). Both are DSPy optimizer papers, and both are on the reading list for the Optimization session. The person teaching the framework wrote several of the optimizers inside it.

Where DSPy itself stands: [MIT licensed, actively released](https://github.com/stanfordnlp/dspy), with 3.3.0 as the latest version on the docs homepage.

The problem it solves is captured by the tagline on its site — "Program, don't prompt." Declare the task as a typed signature, let a module pick the execution strategy (`Predict`, `ChainOfThought`, `ReAct`), then hand an optimizer a metric and let it compile the prompts to convergence.

Worth noting: the course does not treat DSPy as the destination. The last phrase in the session five description is "choosing the right level of abstraction," and the same session also covers LangChain, LangGraph and LlamaIndex. DSPy also makes an early appearance in session two: when the slides cover structured input and output, they use a DSPy signature as the example and open it up to show the system prompt it finally assembles. Its role in this course is "the thing you take apart," not a tool you hand homework in with.

## Three courses with "agent" in the name — which one do you take

This is the question most people actually have. Stanford currently runs three courses under the agent banner, and once you line up the official descriptions the division of labor is fairly clear — and the 2026-27 offering status differs sharply between them.

| Course | Official framing (per official description) | Official prerequisites | Format | 2026-27 status |
|---|---|---|---|---|
| [CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) | Engineering compound AI systems: decompose the problem, choose components, collect data, build evaluation | One of CS224N / CS224U / CS224V / CS336 (stated only on the course site) | Two assignments + quarter project + paper video + peer review | Offered in autumn, Mon/Wed 1:30–2:50 |
| [CS329A: Self-Improving AI Agents](https://cs329a.stanford.edu/) | Research seminar: models that keep improving by interacting with themselves and their environment | CS224N or CS229S; fluent Python; experience calling LLM APIs | Paper reading + original research project + guest lectures | ExploreCourses shows **Last offered: Autumn 2025** |
| [CS224V: Agentic AI](https://web.stanford.edu/class/cs224v/) | Project course: minimize hallucination with RAG and formal task descriptions to build usable domain agents | One of LINGUIST 180/280, CS124, CS224N, CS224S, CS224U | Two assignments + quarter project | Offered in autumn, Mon/Wed 3:00–4:20 |

Three things you can read off this table that no single course website will tell you:

**CS329A isn't scheduled this year.** On the [current academic year's ExploreCourses entry](https://explorecourses.stanford.edu/search?q=CS329A&view=catalog), it no longer has a Terms field at all — in its place is a single line, `Last offered: Autumn 2025`. Switch to the previous year's tab and the full autumn schedule and TA roster reappear. Anyone hoping to take it this year has to wait, or read [this site's CS329A walkthrough](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en) — that course put nine lecture recordings out in public.

**CS329Z and CS224V are back-to-back sessions, not a conflict.** One starts at 1:30 in the afternoon, the other picks up right after, same Mondays and Wednesdays, same quarter. Both require a quarter project, so the cost of taking them together isn't on the calendar — it's on the projects.

**CS224V changed its name this year.** Last academic year it was *Conversational Virtual Assistants with Deep Learning*; this year's entry reads *Agentic AI*. The course website's homepage still carries the old name. Search under both.

The split in one sentence: **CS329A asks how the model gets stronger, CS224V asks how a domain assistant stops lying, CS329Z asks how the whole system gets engineered and measured.** There is also a fourth course, [CS329T](https://web.stanford.edu/class/cs329t/), whose official description likewise says "building and evaluating agentic AI applications," with the emphasis on iterating a prototype into a reliable system; its prerequisites run down the CS229/CS230 machine learning line rather than the NLP line.

## What the assignments look like

**Deadlines**: HW1 out 10/5, due 10/30; project proposal due 10/9; HW2 out 10/26, due 11/20; midpoint demo video due 11/4, midpoint report due 11/6; paper video due 11/13; paper video peer reviews (two videos) due 11/30; final report and system demo during finals week 12/7–12/11, time TBD. All at 11:59 p.m. Pacific.

Two of them, 15% combined, and each one is tied to an oral quiz. The site says ten minutes, closed book; the first lecture's slides say a fifteen-minute check-in that can ask about any part of your submission. Going by the slides is the safer bet.

**HW1: Build an Agentic Harness** (weeks 3 to 6). Build a company's internal AI assistant, and **no agent frameworks allowed**: "just a chat-completion call and code you write yourself." The corpus is a real corporate email archive. You start with LLM pipelines that retrieve and reason over it, then grow them into a full agent harness: tools, a terminal, memory, and a human in the loop. **This is the pivot of the whole course**, because its central claim rests entirely on this assignment.

This assignment was rewritten in early September. The late-August version used research papers as the corpus, asked for answers to scientific questions, and split in half: Part A hand-built RAG, tool calling and a [ReAct](https://arxiv.org/abs/2210.03629)-style loop with litellm; Part B rewrote it in DSPy and reflected on what the framework abstracted away. The new version drops Part B and spends the freed-up effort on memory, a terminal and human review. Those three are exactly the distance between a "harness" and a prompt that happens to call tools.

**HW2: Evaluate an Agent** (weeks 6 to 9). You get a finished agent and design a full evaluation around it: programmatic scorers, at least one LLM-as-judge, benchmark tasks built on the course's four-part framework (request, environment, stopping criteria, scorer), plus error analysis.

Two more things sit alongside the assignments, worth 30% together. The first is a ten-minute paper video on an agent paper not covered in class. The second is peer review, at 20% — more than both assignments combined. There are four rounds over the quarter: paper videos, midpoint demos, HW2 evaluation designs, and final demos, with two submissions to review each round. Per the slides, your reviews are "graded on usefulness and on whether authors adopt it."

The quarter project is worth 40%. The topic used to be fixed as Making Life at Stanford Better with Agents; in mid-September it became open. The only constraint is that it has to connect to one of the course's core themes: building agents (retrieval, tool use, memory, multi-agent, optimization), the data agents need, or evaluation and safety. The official example list keeps the syllabus reader, course scheduler, paper explorer and campus event recommender, and adds two more: a coding agent for a specific codebase, and a rigorous evaluation of an existing agent that surfaces its failure modes.

The rule most worth stealing from the project spec is the one on evaluation: building a tool and showing it works once won't earn a high grade. You have to pin down the task scope, data sources, what counts as success and how you'll measure it up front, then compare against a baseline and do error analysis. The final report is 8 pages in ICLR format, and the Results section alone is worth 10 of its 25 points.

The rest of the rules read like a small conference submission too. Teams of one to three, with three recommended, and each team gets a mentor from the teaching staff. Both the midpoint and the final require a GitHub repo whose README lets a classmate who has never seen your code get it running. A TA will follow the README to run a simple example, and that's worth 5 points. Every stage's report needs an AI-use disclosure modeled on the ICLR 2026 LLM policy; if you didn't use AI you still have to say so, and leaving it out costs points.

For a self-learner outside Stanford, the project loses the mentor and the peer review, but the evaluation bar and the README standard transfer intact.

## The course site's git history: what changed around the start of the quarter

`cs329z.stanford.edu` is a GitHub Pages site, with the source in the [public repo `cs329z/cs329z.github.io`](https://github.com/cs329z/cs329z.github.io). It generates static pages with Flask and Flask-FlatPages, and all the content lives in `data/*.json` and `pages/*.md`. Which means every syllabus revision leaves a diff behind.

The most informative one is the August 16 commit, whose message says it in a single line: `Two homeworks, add paper video, rebalance grading to 100%`. The diff shows that **what got deleted was the original HW2**, which read:

> **HW2: Data for Agents** (Weeks 6–8). Given a staff-provided agent, collect and curate data to optimize its performance — data selection, quality filtering, finding maximally informative examples, synthetic data generation, and building optimization data (SFT or preference pairs). Deliverable: a curated dataset, a data card, and an analysis.

The course never explains why. Only two things can be confirmed: the two data sessions are still on the schedule (sessions 11 and 12, Data for Agentic Systems), now with no assignment hanging off them; and the paper video and peer review were added in the same commit.

Over the next thirty hours, the grading table was revised four more times, with the project's weight climbing all the way to half. The two sessions originally called oral exams were renamed HW-based quizzes in this same round.

But that wasn't final. Three more rounds of changes landed around the start of the quarter, and each one touched the course's skeleton:

- **September 9: HW1 rewritten wholesale.** The commit message is `Update HW1 description to match the restructured assignment`. Research papers became corporate email, the DSPy half was dropped, and frameworks were banned throughout.
- **September 20: the project rules moved over wholesale from an internal doc.** The topic became open, and ICLR format, AI-use disclosure, a GitHub README and reproducibility points were added. The midpoint demo also changed from a live in-class presentation to a recorded submission.
- **September 22, the day before the first lecture: the grading table flipped again.** Peer review jumped from 3% to 20%, the project dropped from 50% back to 40%, homework fell to 15%, and the 5% for participation was deleted outright.

All three rounds point the same way: points move away from "what you handed in" toward "can you evaluate, and can others reproduce you." Peer review means grading other people's evaluation designs, the project has to ship a reproducible repo, and Results is the heaviest section of the final report. Evaluation, the course's third thread, ended up as the shape of the grading table itself.

The August version had one more inconsistency: the project page put the midpoint in week six while the deadlines table said week seven. After the September rewrite, both now say week seven.

The [ExploreCourses description still says `three fully applied homework assignments` today](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog), which contradicts the `two` on the course site. Two official pages at the same school disagreeing is normal; the course site wins.

## What a self-learner can actually get

The conclusion first: **you get the syllabus, the reading list, and slides posted lecture by lecture; recordings still require Canvas access.**

**Available: the first nine lecture decks, no login needed.** As of October 23, the [official schedule](https://cs329z.stanford.edu/) links through the October 21 Optimization lecture.

| Date | Lecture | Official slides |
|---|---|---|
| 9/23 | Lecture 1: Introduction — What Are Agentic Systems? | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture01.pdf) |
| 9/28 | Lecture 2: LLMs for Builders | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf) |
| 9/30 | Lecture 3: Retrieval-Augmented Generation (RAG) | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf) |
| 10/5 | Lecture 4: Tool Use & Function Calling | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf) |
| 10/7 | Lecture 5: Frameworks & Orchestration | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf) |
| 10/12 | Lecture 6: Agent Design Patterns & Scaffolds | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf) |
| 10/14 | Lecture 7: Agent Memory Architectures | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf) |
| 10/19 | Lecture 8: Multi-Agent Systems | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf) |
| 10/21 | Lecture 9: Optimization | [PDF](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf) |

Lecture 2 covers model internals for builders; its assigned Anthropic workflow taxonomy is a separate reading. Lectures 3–5 introduce retrieval, tools, and frameworks. Lectures 6–7 extend the loop into context and memory design; Lectures 8–9 ask when to divide work and which layer to optimize.

| Self-study stage | Engineering question | Guide |
|---|---|---|
| Build components: Lectures 1–5 | Which steps are retrieval, model decisions, or program control? | [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en), [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en) |
| Preserve progress: Lectures 6–7 | What survives a long tool result or a session boundary? | [Week 4: context and memory](/posts/ai/2026-09-10-stanford-cs329z-week4-react-memory-en) |
| Coordinate and improve: Lectures 8–9 | Does parallelism justify coordination cost, and do data and evals support optimization? | [Week 5: coordination and optimization](/posts/ai/2026-09-10-stanford-cs329z-week5-multiagent-optimization-en) |
| Verify outcomes: Week 6 readings | Does the environment satisfy the request after the agent says it is done? | [Week 6: Terminal-Bench and data flywheels](/posts/ai/2026-09-10-stanford-cs329z-week6-data-flywheel-en) |

This is the article's suggested reading route. The Week 6 guest session has not happened yet: that guide uses the public paper and assigned readings. Week 7 onward remains primarily a guide to scheduled readings, rather than a record of classroom speech.

**Available: the entire reading list, every entry a clickable link.** Assigned and supplementary readings are public, most pointing at arXiv and the rest at public pages — the [BAIR compound AI systems post](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/), the [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18), [Anthropic's Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) and others. Not one item is locked behind Canvas.

**Available: the full grading table, assignment descriptions and project requirements.** You know what HW1 asks for, what HW2 has to deliver, how many pages the proposal and each report need, how many points each section of the final report carries, and how much each item weighs in the grade.

**Available: the course website's source and revision history.** The syllabus changes in the previous section were read straight out of it.

**Not available (for now): recordings.** Lectures are recorded, but the site says the recordings go on Canvas, behind an enrolled-student login. The first lecture's slides, meanwhile, say "Lecture slides and videos will be posted online." The two statements don't line up yet; whether public recordings appear remains to be seen.

**Available: the HW1 starter, datasets, and public tests.** The course logistics page now links to the [official starter repository](https://github.com/cs329z/assignment1-harness). It includes the assignment handout, a compressed corporate email archive, Cardinal Energy documents, adapter stubs, deterministic and live tests, and simulated-user evaluation. Cardinal Energy is fictional; the handout describes the email archive separately as real corporate mail. The public tests are enough to start self-study, but the starter is not a completed solution.

**Guest readings: October 26 is now Terminal-Bench.** The [official schedule](https://cs329z.stanford.edu/) names Ryan Marten and Alex Shaw and assigns the project site and paper. November 16 remains TBA. The October 26 session is still upcoming, so the paper is preparatory reading rather than a recording or account of the talk.

One more thing, unrelated to materials but worth reading: this course's integrity policy spends a full paragraph on how to use AI tools, in a tone quite unlike most academic bans.

The current [AI-use policy](https://cs329z.stanford.edu/logistics.html) explicitly permits AI-generated code for homework and projects if you can validate and explain it, with understanding checked orally. It prohibits AI from writing project reports, while allowing brainstorming and feedback on writing.

The counterweight is those two oral quizzes: individual, closed book, asking you to explain your own design decisions and trade-offs. Letting AI write it is fine, as long as you can say on the spot why it's written that way.

The first lecture's slides make the reasoning more concrete. They cite [a 2026 randomized controlled trial from Anthropic](https://www.anthropic.com/research/AI-assistance-coding-skills): 52 engineers learning a new Python library, where the AI-assisted group scored 17% lower on the post-test, with the widest gap in debugging. The next slide is titled "Use AI to learn how to learn." The course wants you to use AI, but what it measures is what you yourself learned.

## How to start

One thing you can do tonight: start under HW1's rules — no framework installed, just one chat-completion call.

Read the [official HW1 handout](https://github.com/cs329z/assignment1-harness/blob/main/cs329z_assignment1_harness.pdf), then clone the starter. It provides the data, interfaces, and tests, so you can follow the assignment directly.

```bash
git clone https://github.com/cs329z/assignment1-harness.git
cd assignment1-harness
cp .env.example .env
uv run python data/download.py
uv run pytest
```

The starter requires Python 3.11 or newer and uv. Deterministic tests make no model calls; initial `NotImplementedError` failures identify the adapters you must implement. For live tests, fill in `OPENROUTER_API_KEY` in `.env`, then run `uv run pytest -m live -s`.

Start with Part 1: email priority, daily digest, a BM25 retriever written from scratch, and multi-hop email QA. Part 2 turns them into tools for the Cardinal Agent, adding a text tool-call protocol, document retrieval, a terminal, context compaction, persistent memory, user approval, and guardrails. The supplied LM wrapper returns a string; parsing tool calls and controlling the loop are your work.

The final evaluation is conversational: simulated users ask questions, respond, and approve or deny actions. Read the tests and design memo together, then implement one adapter at a time. Passing mechanics and explaining the policy choices are separate parts of the assignment.

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) provides lecture recordings through the course Canvas site, which requires sign-in. The slide map and weekly additions use public materials, not an authenticated recording or transcript.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-23.

## Update Log

- 2026-10-23: Kept enrollment details and deadlines with their relevant sections; moved historical counts and verification records to research notes.

- 2026-10-23: Extended the slide map to Lecture 9 and added the Weeks 4–6 reading route and Terminal-Bench guest readings; historical appendix statistics and cross-course comparisons were not reverified.


- 2026-10-10: Added the first five official PDF decks and the public HW1 starter, handout, datasets, tests, and self-study commands; refreshed AI-use policy and recording access notes.
- 2026-09-29: Updated for the course site's September revisions and the first two lecture decks — HW1 is now a framework-free Agentic Harness (the Part B DSPy rewrite is gone), the project topic is open with ICLR format and reproducibility added, the grading table now gives peer review 20%; added the TAs, room change, compute credits, audit and recording notes, and the slide contents; rewrote the title and tldr to match

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- [Stanford CS329Z: Engineering AI Agents course site](https://cs329z.stanford.edu/) — primary source for instructors, schedule, both assignments, grading table, project topic, prerequisites and the integrity policy
- [cs329z/cs329z.github.io (course website source and commit history)](https://github.com/cs329z/cs329z.github.io) — syllabus changes, the deleted HW2 text, the HW1 rewrite, the project rules rewrite, grading table evolution
- [ExploreCourses: CS329Z](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog) — the registrar's version of the description (still says three assignments), units, class number, meeting times, final exam slot, instructor list
- [ExploreCourses: CS329A](https://explorecourses.stanford.edu/search?q=CS329A&view=catalog) — shows `Last offered: Autumn 2025`, confirming no 2026-27 offering
- [ExploreCourses: CS224V](https://explorecourses.stanford.edu/search?q=CS224V&view=catalog) — autumn 2026-27 offering, 3-4 units, official prerequisites, and the rename from Conversational Virtual Assistants to Agentic AI
- [Stanford CS329A course site](https://cs329a.stanford.edu/) — CS329A's official description and Autumn 2025 schedule
- [Stanford CS224V course site](https://web.stanford.edu/class/cs224v/) — CS224V's topics, assignment format and Fall 2025 information
- [Stanford CS329T course site](https://web.stanford.edu/class/cs329t/) — the fourth agent-adjacent course's official description and prerequisites
- [Diyi Yang's homepage](https://cs.stanford.edu/~diyiy/) — title, research areas, awards
- [Michael Ryan's homepage](https://michryan.com/) — advisors, DSPy core contributor status, MIPROv2 and GEPA author lists
- [John Yang's homepage](https://john-b-yang.github.io/) — advisors and research areas
- [Omar Khattab's homepage](https://omarkhattab.com/) — the origins of DSPy and ColBERT, Stanford PhD and MIT faculty position
- [MIT EECS: Omar Khattab](https://www.eecs.mit.edu/people/omar-khattab/) — official record of the 2025 move to MIT
- [DSPy documentation](https://dspy.ai/) — version, contributor count, downloads, official explanation of signatures, modules and optimizers
- [stanfordnlp/dspy GitHub repo](https://github.com/stanfordnlp/dspy) — license, stars, paper list
- [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines](https://arxiv.org/abs/2310.03714) — assigned reading for session five
- [MIPROv2: Optimizing Instructions and Demonstrations for Multi-Stage Language Model Programs](https://arxiv.org/abs/2406.11695) — supplementary reading for session nine, Michael Ryan co-first author
- [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning](https://arxiv.org/abs/2507.19457) — assigned reading for session nine
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — assigned reading for session six, and the reasoning pattern cited in the August version of HW1
- [SWE-smith: Scaling Data for Software Engineering Agents](https://arxiv.org/abs/2504.21798) — assigned reading for session twelve, first-authored by instructor John Yang
- [The Shift from Models to Compound AI Systems (BAIR Blog)](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) — assigned reading for session one, and the source of the course's framing
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18) — assigned reading for session four
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — assigned reading for session two
- [litellm](https://github.com/BerriAI/litellm) — the SDK specified in the August version of HW1, and one of the hand-built starting points this piece suggests
- [CS329Z Lecture 1 slides: Intro to Agentic Systems](https://web.stanford.edu/class/cs329z/slides/lecture01.pdf) — prerequisites, compute credits, grading, how peer review is scored, audit and recording notes
- [CS329Z Lecture 2 slides: LLMs for Builders](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf) — the model-internals crash course and the DSPy signature example
- [Anthropic: How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills) — the RCT cited in the first lecture's slides
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://arxiv.org/abs/2507.02825) — the evaluation session's assigned reading as of 8/23
- On this site: [Stanford CS329A walkthrough](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
- On this site: [A Reading Guide to Stanford's CS Courses: Ordered by Prerequisites](/posts/learning/2026-08-20-stanford-cs-course-map-en)

- [CS329Z Logistics](https://cs329z.stanford.edu/logistics.html) — HW1 starter, AI-use policy, and Canvas recording access
- [CS329Z HW1: Building an Agentic Harness](https://github.com/cs329z/assignment1-harness) — starter, datasets, tests, and setup
- [HW1 handout](https://github.com/cs329z/assignment1-harness/blob/main/cs329z_assignment1_harness.pdf) — Part 1/2 and design memo
- [CS329Z Lecture 3: Retrieval-Augmented Generation (RAG)](https://web.stanford.edu/class/cs329z/slides/lecture03.pdf)
- [CS329Z Lecture 4: Tool Use & Function Calling](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)
- [CS329Z Lecture 5: Frameworks & Orchestration](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)

- [CS329Z Lecture 6: Agent Design Patterns & Scaffolds](https://web.stanford.edu/class/cs329z/slides/lecture06.pdf)

- [CS329Z Lecture 7: Agent Memory Architectures](https://web.stanford.edu/class/cs329z/slides/lecture07.pdf)

- [CS329Z Lecture 8: Multi-Agent Systems](https://web.stanford.edu/class/cs329z/slides/lecture08.pdf)

- [CS329Z Lecture 9: Optimization](https://web.stanford.edu/class/cs329z/slides/lecture09.pdf)
