---
title: "Stanford CS329Z: Hand-Build the Agent with litellm First, Then Let DSPy Take It Away"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: en
series:
  name: "Reading Stanford's Main-Line CS Courses"
  order: 15
tldr: "CS329Z is a new three-unit agent engineering course debuting at Stanford in Autumn 2026. Its first homework asks you to build RAG, tool calling and a ReAct loop from scratch with litellm, then rewrite the same components in DSPy and hand in the comparison. The course site lives in a public GitHub repo, and the commit log shows the assignment count dropping from three to two in mid-August — the one that got cut was 'Data for Agents'."
description: "A full walkthrough of Stanford CS329Z: Engineering AI Agents — the instructors, the prerequisites, how 22 sessions and 49 readings are grouped, what the two assignments actually ask for, the syllabus changes recorded in the course site's git history, and how CS329Z, CS329A and CS224V divide the agent territory in 2026-27."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)

[CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) is a three-unit course running for the first time in Autumn 2026 in Stanford's CS department. The load-bearing word in the title is **Engineering**. It is not ten weeks of reading the latest agent papers. Students build an agentic system end to end, measure it, and then perform it on Demo Day.

The frame the course site opens with is "compound AI systems": systems assembled from LLMs, retrievers, tools and optimizers that interact with each other. The site calls this a fundamental shift in how AI applications get built. The three threads that run through the quarter are named in the very first session description — decomposition, data, evaluation.

This piece cross-checks three primary sources: the course site, the public GitHub repo behind it, and ExploreCourses. It covers how the course actually runs, what the assignments look like, what got rewritten in the syllabus a month before the quarter starts, and how it differs from the other two Stanford courses with "agent" in the title. It does **not** break down the lectures one by one — the course doesn't start until late September, and not a single slide deck has been posted.

## The hard facts

Three instructors, all listed in the Instructors block on the course site. [Diyi Yang](https://cs.stanford.edu/~diyiy/) is an assistant professor in Stanford CS working on socially aware NLP and human-AI interaction; she won a Sloan Research Fellowship in 2024. [Michael Ryan](https://michryan.com/) is a PhD student co-advised by Diyi Yang and Percy Liang, a Knight-Hennessy Scholar, and a core contributor to [DSPy](https://dspy.ai/). [John Yang](https://john-b-yang.github.io/) is a second-year PhD student advised by Ludwig Schmidt and Diyi Yang, and first author on SWE-agent and [SWE-smith](https://arxiv.org/abs/2504.21798).

One detail only surfaces when you put the two official pages side by side: **the registrar lists only two instructors**. The [CS329Z entry on ExploreCourses](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog) shows Ryan, M. (PI) and Yang, D. (PI), with no John Yang — even though every commit in the course website repo is his.

The rest of what's on record: three units, Letter or Credit/No Credit. Taught in person in the autumn quarter, Mondays and Wednesdays afternoons in Packard 101. Class number, quarter dates and the final exam slot are in the appendix.

Prerequisites live in the Logistics section of the course site: one of [CS224N](https://web.stanford.edu/class/cs224n/), [CS224U](https://web.stanford.edu/class/cs224u/), [CS224V](https://web.stanford.edu/class/cs224v/), [CS336](https://stanford-cs336.github.io/), or equivalent NLP background. **The ExploreCourses entry has no prerequisites field at all** — read only the registrar and you'd think the course has no gate on it.

On auditing, the course site says nothing, and there is no matching SCPD or Stanford Online page. I could not find a definite answer on this one.

## The course's claim: build it by hand, then let the framework take it away

The line worth remembering sits in the second paragraph of the welcome message on the site:

> Students first build core components (RAG, tool use, agent loops) from scratch, then learn how frameworks like DSPy abstract these patterns.

The ordering is deliberate, and it isn't just a slogan — it's written into the schedule and the assignment structure. RAG is session three, with the description tagging it hands-on: "build a RAG pipeline from scratch." Tool calling is session four, also hands-on. Both come before the frameworks session. The [DSPy paper](https://arxiv.org/abs/2310.03714) and the comparison against LangChain and LlamaIndex land in session five, whose topic is literally "what frameworks abstract vs. what you built from scratch."

This arrangement fixes a very concrete problem: people who learn the framework first usually can't say what the framework did for them. You can call `dspy.ReAct`, but you can't say which step of the ReAct loop is model output, which step is your code parsing that output, or who retries when it fails. Once you've written it by hand, the abstraction becomes something you can evaluate rather than something you have to trust.

**Self-learners can copy this directly**: don't start learning agents at `pip install`. Take a thin-wrapper SDK like [litellm](https://github.com/BerriAI/litellm), write retrieval, tool calling and loop control yourself, get it running, then rewrite it with a framework. The first homework is designed in exactly that order — more on it below.

## DSPy is where the course lands, but its author has left Stanford

DSPy came out of Stanford NLP. [Omar Khattab](https://omarkhattab.com/) did his PhD at Stanford, advised by Christopher Potts and Matei Zaharia, on foundation model programming; DSPy and ColBERT both came off that line. But he [joined MIT EECS as an assistant professor in July 2025](https://www.eecs.mit.edu/people/omar-khattab/), after a stint as a research scientist at Databricks.

So "a Stanford course teaching a Stanford framework" is only half true today. The real connection is on the teaching side. Michael Ryan is co-first author of the [MIPROv2 paper](https://arxiv.org/abs/2406.11695) and a co-author of [GEPA](https://arxiv.org/abs/2507.19457). Both are DSPy optimizer papers, and both are on the reading list for the Optimization session. The person teaching the framework wrote several of the optimizers inside it.

Where DSPy itself stands: [MIT licensed, actively released](https://github.com/stanfordnlp/dspy), with 3.3.0 as the latest version on the docs homepage. Stars, contributor count and download numbers are in the appendix.

The problem it solves is captured by the tagline on its site — "Program, don't prompt." Declare the task as a typed signature, let a module pick the execution strategy (`Predict`, `ChainOfThought`, `ReAct`), then hand an optimizer a metric and let it compile the prompts to convergence.

Worth noting: the course does not treat DSPy as the destination. The last phrase in the session five description is "choosing the right level of abstraction," and the same session also covers LangChain, LangGraph and LlamaIndex. The homework doesn't ask you to "switch to DSPy" either — it asks you to rewrite in DSPy and then say what it abstracted away.

## Three courses with "agent" in the name — which one do you take

This is the question most people actually have. Stanford currently runs three courses under the agent banner, and once you line up the official descriptions the division of labor is fairly clear — and the 2026-27 offering status differs sharply between them.

| Course | Official framing (per official description) | Official prerequisites | Format | 2026-27 status |
|---|---|---|---|---|
| [CS329Z: Engineering AI Agents](https://cs329z.stanford.edu/) | Engineering compound AI systems: decompose the problem, choose components, collect data, build evaluation | One of CS224N / CS224U / CS224V / CS336 (stated only on the course site) | Two assignments + quarter project + paper video | Offered in autumn, Mon/Wed 1:30–2:50 |
| [CS329A: Self-Improving AI Agents](https://cs329a.stanford.edu/) | Research seminar: models that keep improving by interacting with themselves and their environment | CS224N or CS229S; fluent Python; experience calling LLM APIs | Paper reading + original research project + guest lectures | ExploreCourses shows **Last offered: Autumn 2025** |
| [CS224V: Agentic AI](https://web.stanford.edu/class/cs224v/) | Project course: minimize hallucination with RAG and formal task descriptions to build usable domain agents | One of LINGUIST 180/280, CS124, CS224N, CS224S, CS224U | Two assignments + quarter project | Offered in autumn, Mon/Wed 3:00–4:20 |

Three things you can read off this table that no single course website will tell you:

**CS329A isn't scheduled this year.** On the [current academic year's ExploreCourses entry](https://explorecourses.stanford.edu/search?q=CS329A&view=catalog), it no longer has a Terms field at all — in its place is a single line, `Last offered: Autumn 2025`. Switch to the previous year's tab and the full autumn schedule and TA roster reappear. Anyone hoping to take it this year has to wait, or read [this site's CS329A walkthrough](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en) — that course put nine lecture recordings out in public.

**CS329Z and CS224V are back-to-back sessions, not a conflict.** One starts at 1:30 in the afternoon, the other picks up right after, same Mondays and Wednesdays, same quarter. Both require a quarter project, so the cost of taking them together isn't on the calendar — it's on the projects.

**CS224V changed its name this year.** Last academic year it was *Conversational Virtual Assistants with Deep Learning*; this year's entry reads *Agentic AI*. The course website's homepage still carries the old name. Search under both.

The split in one sentence: **CS329A asks how the model gets stronger, CS224V asks how a domain assistant stops lying, CS329Z asks how the whole system gets engineered and measured.** There is also a fourth course, [CS329T](https://web.stanford.edu/class/cs329t/), whose official description likewise says "building and evaluating agentic AI applications," with the emphasis on iterating a prototype into a reliable system; its prerequisites run down the CS229/CS230 machine learning line rather than the NLP line.

## What the assignments look like

Two of them, 10% each, and each one is tied to a ten-minute in-class quiz.

**HW1: Build an Agentic System** (weeks 3 to 6). You get a set of research papers and build an agent that can answer scientific questions. It splits explicitly in half: Part A builds from scratch with litellm — RAG, tool calling, and an agent loop with a reasoning pattern such as [ReAct](https://arxiv.org/abs/2210.03629); Part B rewrites the key components in DSPy and reflects on what the framework abstracted away. **This is the pivot of the whole course**, because its central claim rests entirely on this assignment.

**HW2: Evaluate an Agent** (weeks 6 to 9). You get a finished agent and design a full evaluation around it: programmatic scorers, at least one LLM-as-judge, benchmark tasks built on the course's four-part framework (request, environment, stopping criteria, scorer), plus error analysis.

Two more things sit alongside the assignments. Every student records a ten-minute paper video, and the rubric is specific: paper selection and explanation, your own critique or insight, and "added value." The examples the course gives for added value include reproducing a result, running a small experiment, comparing against another method, or building a demo. Then you watch three other students' videos and write peer feedback, with an explicit instruction to go "beyond 'good job'" — one strength, one weakness or question, one actionable suggestion.

The quarter project is worth half the grade, and the topic is fixed: **Making Life at Stanford Better with Agents**. The four examples given are a syllabus reader that extracts deadlines into a calendar, a course scheduling optimizer, a paper exploration and summarization agent, and a campus event aggregator with recommendations. For a self-learner outside Stanford, this half isn't reproducible — but swap the topic for "make my workday better" and the assignment structure transfers intact.

## The course site's git history: what changed a month before the quarter

`cs329z.stanford.edu` is a GitHub Pages site, with the source in the [public repo `cs329z/cs329z.github.io`](https://github.com/cs329z/cs329z.github.io). It generates static pages with Flask and Flask-FlatPages, and all the content lives in `data/*.json` and `pages/*.md`. Which means every syllabus revision leaves a diff behind.

The most informative one is the August 16 commit, whose message says it in a single line: `Two homeworks, add paper video, rebalance grading to 100%`. The diff shows that **what got deleted was the original HW2**, which read:

> **HW2: Data for Agents** (Weeks 6–8). Given a staff-provided agent, collect and curate data to optimize its performance — data selection, quality filtering, finding maximally informative examples, synthetic data generation, and building optimization data (SFT or preference pairs). Deliverable: a curated dataset, a data card, and an analysis.

The course never explains why. Only two things can be confirmed: the two data sessions are still on the schedule (sessions 11 and 12, Data for Agentic Systems), now with no assignment hanging off them; and the paper video and peer review were added in the same commit, filling exactly the 10% that was cut.

Over the next thirty hours, the grading table was revised four more times. The direction is consistent: the project's weight climbs throughout, ending up at a full half of the grade, while assignments and quizzes give ground. The two sessions originally called oral exams were renamed HW-based quizzes in this same round, with their weight dropping accordingly. The percentage changes step by step are in the appendix.

One inconsistency is still live on the site. The project page's milestones put the midpoint report and midpoint demo in week six and the final submission in week ten, but the deadlines table puts the two midpoint items in week seven and pushes the final submission into finals week. Trust the deadlines table — it's the one that got concrete dates filled in later.

For what it's worth, the [ExploreCourses description still says `three fully applied homework assignments` today](https://explorecourses.stanford.edu/search?q=CS329Z&view=catalog), which contradicts the `two` on the course site. Two official pages at the same school disagreeing is normal; the course site wins.

## What a self-learner can actually get

The conclusion first: **all you can get right now is the syllabus and the reading list, and the reading list is unexpectedly complete.**

**Available: the entire reading list, every entry a clickable link.** Assigned plus supplementary comes to 49 papers, most pointing at arXiv and the rest at public pages — the [BAIR compound AI systems post](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/), the [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18), [Anthropic's Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) and others. Not one item is locked behind Canvas.

**Available: the full grading table, assignment descriptions and project requirements.** You know what HW1 asks for, what HW2 has to deliver, how long the report should be (one to two pages of body text, with structured content such as agent failure mode examples in an appendix), and how many points each item carries.

**Available: the course website's source and revision history.** The syllabus changes in the previous section were read straight out of it.

**Not available: slides.** The "Course Material" column in the schedule currently holds only reading links, no decks. The site says "Lecture materials will be linked here as they are released," and the repo README lists "Add lecture-material links as released" on its to-do list.

**Not available: recordings.** The course site mentions no recording arrangement at all.

**Not available: assignment starter code and graders.** The site gives no repo link.

**Not available: the two guest lectures.** Two slots on the schedule read "📺 Guest Lecture (TBA)," and the speakers still haven't been announced. The TA roster is empty too — the `cas` array in `data/staff.json` has nothing in it.

One more thing, unrelated to materials but worth reading: this course's integrity policy spends a full paragraph on how to use AI tools, in a tone quite unlike most academic bans.

> This is a course about building with AI, so we expect you to use it. Treat generative AI tools as collaborators you think alongside — asking them to explain a concept, debug your code, or critique a design is fair game and encouraged. What isn't: soliciting finished answers or copying solutions.

The counterweight is those two in-class quizzes: ten minutes, individual, closed book, asking you to explain your own design decisions and trade-offs. Letting AI write it is fine, as long as you can say on the spot why it's written that way.

## How to start

One thing you can do tonight: run both halves of HW1 yourself.

Grab five to ten papers from a field you know as your corpus, and write a minimal question-answering agent with litellm — chunk, embed, retrieve, one `search_papers` tool, a ReAct loop capped at three iterations. Once it runs, **don't optimize it**. Open a new file, rewrite the same task with `dspy.ReAct`, then write down item by item: who handles retry logic now, who parses the output, who rewrote the prompts.

That comparison list is what session five of the course teaches, and you'll have your own answers before you ever read it.

## Appendix: numbers and how they were checked

- **On-record details**: class number 27855, Session 2026-2027 Autumn 1, quarter running 2026-09-22 to 2026-12-04, Mondays and Wednesdays 1:30–2:50 p.m., Packard 101, final exam slot 2026-12-09 3:30–6:30 p.m. (from ExploreCourses and the Logistics section of the course site).
- **Deadlines**: HW1 out 10/5, due 10/30; project proposal due 10/9; HW2 out 10/26, due 11/20; midpoint demo in class 11/4, midpoint report due 11/6; paper video due 11/13; peer review due 11/30; final submission and system demo during finals week 12/7–12/11, time TBD. All at 11:59 p.m. Pacific.
- **Schedule size**: `data/schedule.json` holds 22 sessions; subtract two TBA guest slots, two Thanksgiving cancellations and one Demo Day, and 17 sessions carry actual content. 23 assigned readings and 26 supplementary, 49 in total; 31 distinct arXiv links after deduplication. Figures from the version fetched on 2026-08-21.
- **How the grading table evolved** (all from commit diffs in the public repo, timestamps in the commit author's timezone): 8/16 22:29 `Two homeworks, add paper video, rebalance grading to 100%`, project 39%→35%, assignments from three at 10% each to two at 15% each; 8/17 09:38 `Grading updates`, restructured into a nested list; 8/17 15:11 `Update grading breakdown`, project 35%→50%, the two assignments 15%→10% each, oral exam renamed HW-based quiz and 10%→7.5% each; 8/17 22:29 `Adjust project grading weights`, midpoint demo 5%→7%, final system demo 20%→18%; after 8/18, only formatting and logistics changes.
- **The unit count changed too**: the 8/18 `Some updates` commit changed `Units: 3–4` to `Units: 3` on the logistics page, and added the class number, meeting times and room at the same time. ExploreCourses also says 3 units.
- **How to query ExploreCourses**: `https://explorecourses.stanford.edu/search?q=<course>&view=catalog` defaults to the current academic year (2026-2027). CS329Z returns 0 results on both the 2025-2026 and 2024-2025 tabs, which is why it reads as a new course; CS329A shows `Last offered: Autumn 2025` on the current year and only reveals its schedule under 2025-2026. The site needs a `jsenabled=1` cookie to return content — fetch it directly and you get a page saying "Loading…".
- **DSPy numbers**: roughly 37,400 GitHub stars (read 2026-08-21); the docs homepage claims 444+ contributors, 6.6M+ monthly downloads, latest version 3.3.0, MIT licensed. These are the project's own self-reported figures.
- **Could not confirm**: whether the course can be audited (the site doesn't say, and there's no SCPD or Stanford Online page); the TA roster; the two guest speakers; whether assignment starter code will be public; whether the Stanford Bulletin has a CS329Z entry yet (its course catalog is a dynamically loaded frontend app, which I could not verify first-hand).

## References

- [Stanford CS329Z: Engineering AI Agents course site](https://cs329z.stanford.edu/) — primary source for instructors, schedule, both assignments, grading table, project topic, prerequisites and the integrity policy
- [cs329z/cs329z.github.io (course website source and commit history)](https://github.com/cs329z/cs329z.github.io) — syllabus changes, the deleted HW2 text, grading table evolution, README to-do list
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
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — assigned reading for session six, and the reasoning pattern cited in HW1 Part A
- [SWE-smith: Scaling Data for Software Engineering Agents](https://arxiv.org/abs/2504.21798) — assigned reading for session twelve, first-authored by instructor John Yang
- [The Shift from Models to Compound AI Systems (BAIR Blog)](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) — assigned reading for session one, and the source of the course's framing
- [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2025-06-18) — assigned reading for session four
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — assigned reading for session two
- [litellm](https://github.com/BerriAI/litellm) — the SDK required for HW1 Part A
- On this site: [Stanford CS329A walkthrough](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
- On this site: [A Reading Guide to Stanford's CS Courses: Ordered by Prerequisites](/posts/learning/2026-08-20-stanford-cs-course-map-en)
