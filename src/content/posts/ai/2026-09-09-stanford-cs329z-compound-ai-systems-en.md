---
title: "Compound AI Systems: How Models, Data, and Tools Work Together | Stanford CS329Z Week 1"
date: 2026-09-09
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 2
tldr: "Start with the opening slides on the agent loop, components, and engineering challenges, then examine BAIR's compound systems, Ng's work patterns, and Si's execution-feedback experiments. Distinguish the lecture, required reading, and additional readings."
description: "A page-linked guide to all 71 CS329Z opening slides, from agent history and the action loop to reasoning, memory, tools, reliability, and safety, followed by independent reading digests of BAIR, Ng, and Si."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems)

**Video status: Recordings require the course Canvas login.** [Official access information](https://cs329z.stanford.edu/logistics.html). This guide uses public slides and original readings, without classroom speech or timestamps.

The three readings for Stanford CS329Z Week 1 approach one question from different directions: how do processes beyond the model change AI's actual performance? BAIR frames the system-design problem. Andrew Ng organizes iterative work patterns. Si and colleagues subject research ideas to code implementation and GPU experiments. The guide first explains the lecture slides, then presents independent reading digests that distinguish perspective articles from experimental evidence.

| Material | Course role | Reading focus |
|---|---|---|
| [Lecture 01: Intro to Agentic Systems](https://web.stanford.edu/class/cs329z/slides/lecture01.pdf) | Opening slides, September 23 | Agent history; models, reasoning, memory, tools, and environments; engineering questions about system, data, and evals |
| [Zaharia et al.: Compound AI Systems](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/) | Required reading this week | Why treat the whole system as the unit of improvement? |
| [Ng: Agentic Design Patterns Part 1](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/) | Additional reading | Reflection, tool use, planning, and multi-agent collaboration |
| [Si et al.: Execution-Grounded Automated AI Research](https://arxiv.org/html/2601.14525) | Additional reading | Executors, evolutionary search, reinforcement learning, and their limitations |
| [HW1: Build an Agentic Harness](https://github.com/cs329z/assignment1-harness) | Later assignment, released October 5 in Week 3 | Grow email pipelines into an assistant with tools, memory, and human involvement; it need not be completed in Week 1 |

Roles and dates follow the [official schedule](https://cs329z.stanford.edu/); the handout defines assignment requirements. The email example here is an original illustration, not an official assignment or solution.

<div class="slide-reader" data-slide-reader data-pages="71" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf">
<p>Compare the 71-page slide deck with this guide. On desktop, keep the slides beside the article; on mobile, open the slides and return to your reading position. Section page links jump to the matching PDF page.</p>
<button type="button" data-slide-open>Open slides alongside the guide</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf" target="_blank" rel="noopener noreferrer">Open original PDF in a new tab</a></p>
</div>

## Opening lecture guide: reasoning, action, and evaluation across 71 slides

[Intro to Agentic Systems](https://web.stanford.edu/class/cs329z/slides/lecture01.pdf) covers more than compound systems. It begins with the course and agent history, examines reasoning, memory, and tools, then tests the architecture against reliability and safety problems. The guide below follows the slide order, grouping logistics and repeated section dividers while retaining mechanisms and examples. Page numbers refer to physical PDF pages; use the links to compare the slides within this page.

### Pages 1–17: understanding both models and software systems

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=1" data-slide-page="1">Slides 1–17</a>

The opening logistics carry a substantive message: tuning models and building reliable software are two capabilities that need to connect. Page 5 places modeling and systems alongside each other. Models involve training, prompting, alignment, and evaluation; systems also involve tools, APIs, environments, and infrastructure. A strong single-call result does not establish reliable performance once external services are involved.

Pages 6–13 explain learning through the course structure, implementation, and oral checks. This is not an introduction to language models from scratch: data splits, pretraining, fine-tuning, and prompting are prerequisites. Later retrieval, tool, and memory components must be assembled and evaluated. Use the official links at the beginning of this article for course dates and access information; screenshots in slides are not permanent announcements.

Pages 14–16 distinguish using AI to learn from letting it replace understanding. The charts address a possible gap between completing work and developing skills. Their particular findings do not establish an effect for every AI user. The practical implication here is to explain why each step exists and what happens when it fails, beyond merely making code run.

**You should be able to answer:** if a model writes tool-calling code for you, have you understood the agent? Not yet. You should at least explain what information the model receives, what the code executes, and how results inform the next decision. Page 17's learning objective covers the agent loop, key components, and open questions in training and evaluation.

### Pages 18–27: agents predate chat models; perception and action remain central

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=18" data-slide-page="18">Slides 18–27</a>

The history is not an exercise in memorizing dates. Early actors, task negotiation, and the Society of Mind already examined units that act and collaborate. Definitions in the 1990s emphasized autonomy, reactivity, proactivity, and social interaction. The sensor-and-actuator definition on page 21 exposes the common structure: receive information from an environment, then affect it through actions.

The reinforcement-learning diagram on page 22 makes the loop explicit: the agent chooses an action, the environment changes state and returns signals. Language models change the decision-making capacity and interface. In-context learning on page 23 lets task descriptions and examples in a prompt shape output. Page 24 connects verbal reasoning, browsing, and modular tools so answers need not rely only on internal knowledge.

Page 25 places ReAct, ChatGPT, GPT-4, and early autonomous-agent projects on one timeline to show how these approaches converged. Pages 26–27 separately show progress in model capabilities and agent task performance. Their measurements differ: answering knowledge or math questions and completing multistep work with tools are not one metric. The slide screenshots are not today's leaderboard.

**Check your understanding:** has a model executed a task merely because it writes a complete plan? No. A plan remains an output. Actions must actually run and results must return before the system can judge whether the plan works.

### Pages 29–34: how do five components form an action loop?

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=29" data-slide-page="29">Slides 29–34</a>

Page 29 maps a ReAct trajectory onto an architecture: the model is the LLM core; Think corresponds to reasoning and planning; earlier traces provide memory; Act goes through tools; Obs comes from the environment. Pages 30–32 connect these components. These are functional roles, not a requirement to deploy five independent services.

| Component | Role | Boundary easily confused |
|---|---|---|
| LLM core | Produce the next step from the task and current observations | Saying “I will search” does not execute a search |
| Planning / reasoning | Organize constraints, identify gaps, and select actions | Reasoning can update internal state but cannot verify external facts by itself |
| Memory | Supply experiences, knowledge, or skills | Old memory may be obsolete and should not override new observations |
| Tools | Accept concrete arguments and execute capabilities | Availability does not authorize every use |
| Environment | Supply files, pages, data, and states after actions | Without a result, the system cannot invent success or failure |

Page 34 illustrates reasoning through cooking: after noticing that salt has run out, consider soy sauce, turn toward the cabinet, then open it. A decision connects the goal and environment between “no salt” and “turn right.” Reasoning helps select an action. What appears after turning still requires another observation.

```diagram
title: Action results must inform the next decision
desc: The model selects actions, tools affect the environment, and returned observations inform the next decision.
caption: Action loop simplified from pages 29–34; sufficient evidence can lead to an answer or stopping instead of another tool call.
---
<svg viewBox="0 0 440 408">
<path class="dg-line" d="M220 80V116" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 184V220" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 288V324" marker-end="url(#arrow)"/>
<path class="dg-line dg-line--dashed" d="M360 360H392Q400 360 400 352V56Q400 48 392 48H364" marker-end="url(#arrow)"/>
<rect class="dg-box dg-box--accent" x="80" y="16" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="40" text-anchor="middle" dominant-baseline="central">Model decision</text>
<text class="dg-sub" x="220" y="60" text-anchor="middle" dominant-baseline="central">Goal, constraints, observations</text>
<rect class="dg-box" x="80" y="120" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="144" text-anchor="middle" dominant-baseline="central">Tool execution</text>
<text class="dg-sub" x="220" y="164" text-anchor="middle" dominant-baseline="central">Action and arguments</text>
<rect class="dg-box" x="80" y="224" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="248" text-anchor="middle" dominant-baseline="central">Environment</text>
<text class="dg-sub" x="220" y="268" text-anchor="middle" dominant-baseline="central">Files, pages, databases</text>
<rect class="dg-box" x="80" y="328" width="280" height="64" rx="6"/>
<text class="dg-label" x="220" y="352" text-anchor="middle" dominant-baseline="central">Return observation</text>
<text class="dg-sub" x="220" y="372" text-anchor="middle" dominant-baseline="central">Content, status, errors</text>
</svg>
```

A counterexample is an email-search timeout. The observation is “the result was not successfully obtained,” not “no matching emails exist.” The former calls for retrying, changing the search, or preserving uncertainty; only the latter might support a no-match conclusion. **Answer criterion:** distinguish execution status from query content before reasoning further. A fluent reply cannot bridge that missing observation.

### Pages 35–37: the Apple Remote example turns failed search into a clue

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=35" data-slide-page="35">Slides 35–37</a>

This is a complete slide example whose evidence can be followed. The question asks: **apart from Apple Remote, what device can control the program it was originally designed for?** First identify the program, then investigate its other controls.

Page 35's direct answer is iPod. Its reasoning-only version instead misidentifies the program as Apple TV, then arrives at iPhone, iPad, and iPod Touch. The prose is coherent after the first entity relationship goes wrong. More reasoning text need not correct an unverified starting point.

The ReAct trace on page 36 follows observations through these steps:

| Step | Action and observation | Effect on the next decision |
|---|---|---|
| 1 | Search Apple Remote; the result identifies Front Row as the original program | Establish the actual program instead of retaining the Apple TV guess |
| 2 | Search Front Row; no exact article appears, but similarly named candidates do | Treat this as a need for disambiguation, not proof that no answer exists |
| 3 | Search Front Row (software) and obtain the software article | Identify the correct entity before finding other controls |
| 4 | Read the controls and Finish with keyboard function keys | Retrieved evidence supports the answer and changes the reasoning direction |

The correct answer is **keyboard function keys**. The important step is not simply searching again. After the second search fails, the system uses similar entries to disambiguate and changes its next action. Treating “Front Row not found” as proof that the program does not exist would misuse the observation despite using a search tool.

Page 37 places task scores beside error categories, preventing one success from becoming a universal guarantee. ReAct improves over Act in the table but does not beat CoT or self-consistency on every task. Search can return nothing, and reasoning can still fail. Diagnose the location: was the entity wrong, did retrieval fail, or did the model misinterpret information already obtained?

**Check your understanding:** should the agent immediately report insufficient evidence when Front Row has no exact search result? First inspect whether the candidates offer a verifiable disambiguation route. Here the software article does. Without a reliable candidate, preserve uncertainty rather than selecting an arbitrary page with the same name.

### Pages 38–43: sampling, reflection, debate, and orchestration use different feedback

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=38" data-slide-page="38">Slides 38–43</a>

These approaches have different information flows; they are not several names for thinking longer:

| Approach | What it adds | What it does not automatically solve |
|---|---|---|
| Self-consistency | Generate several reasoning paths and aggregate the most consistent answer | A majority can share the same false premise |
| Reflexion | Use task feedback to condense failed trajectories into text for later attempts | Reflection depends on feedback quality and does not directly update model weights |
| Multi-agent debate | Inspect other participants' reasoning and revise an answer | Agreement supplies no external evidence by itself and can propagate errors |
| Orchestrator | Assign roles and tools according to the task, then integrate intermediate results | Division of labor still requires complete handoffs, correct execution, and verification |

Pages 41–42 expose a debate through a gem problem. There are 175 diamonds, 35 fewer rubies than diamonds, and twice as many emeralds as rubies. That gives 140 rubies, 280 emeralds, and **175 + 140 + 280 = 595** gems. One participant answers 225 in the first round, changes to 560 after reading its peer in round two, and reaches 595 only in round three. Discussion creates opportunities to correct an answer without guaranteeing progress at every round.

The orchestrator diagram on page 43 addresses a different problem: extract code from an image, ask a coding role to analyze it, execute it in a terminal, then obtain another piece of code through a browsing tool. This coordinates different capabilities instead of having several models repeat one question. The purposes differ; agent count alone cannot distinguish the designs.

**Check your understanding:** have three models verified an answer if all give the same wrong answer? No. You have consistency. Inspect whether they share a false premise or whether calculation, tests, or source evidence can decide correctness. The arithmetic here independently verifies 595.

### Pages 44–50: distinguish remembered experiences, inferred knowledge, and reusable skills

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=44" data-slide-page="44">Slides 44–50</a>

Page 44 returns to the overall architecture and highlights memory. Page 45 motivates it: event streams cannot all remain in context, and even fitting them does not establish that relevant information will be found. Memory design therefore includes writing and reading, beyond simply storing chat history.

| Content type | Writing / reading in the slides | Distinction to retain |
|---|---|---|
| Episodic | Append events; retrieve relevant material using heuristic scores | Preserve what happened instead of first collapsing every event into a conclusion |
| Semantic | Reason over events and infer knowledge; retrieve it when needed | Abstract conclusions combine observations and still need inspectable sources |
| Procedural | Represent capabilities as code-based skills; retrieve through embeddings | Preserve how to do something for reuse in later tasks |

The page 47 example retrieves experiences from an event stream, considering recency, importance, and relevance. Page 48 infers higher-level knowledge from specific reading, discussion, and research activities. An event can be checked directly; an inference saves rereading but may overgeneralize. Page 49's Voyager diagram connects skill acquisition to environment feedback, code revision, and self-verification before adding the skill to a library. Generated code alone does not establish that a skill was learned.

Consider an original illustration: “yesterday's search failed” is an experience; “the user often searches one project” is inferred knowledge; “a function constructing queries by project and date” is a skill. **Answer criterion:** can new evidence update the inference while retaining the original event? If a skill has never been tested, saving it in a folder does not make it reliable.

### Pages 51–53: tool use includes timing, arguments, and using the result

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=51" data-slide-page="51">Slides 51–53</a>

Toolformer separates tool use into learning which API to call, when, with what arguments, and how to incorporate results into generation. Page 51 illustrates calculators, question answering, search, translation, and calendars, showing how tools add external information or computation. Producing plausible call syntax completes only part of that process.

The Gorilla diagram on page 52 addresses selection as APIs multiply: organize API data, form instruction-and-call training pairs, and retrieve API information before generating calls. Documentation informs the model rather than leaving it to invent nonexistent interfaces. The accuracy/hallucination comparisons belong to that study and its settings; they are not a current model ranking.

Page 53 returns tools to the complete architecture. Tool outputs become observations that can affect reasoning and memory; installing a tool alone does not establish successful integration. **Check your understanding:** if a calculator returns the right number but the answer uses an older number, what failed? Tool execution worked, but its result was not incorporated correctly. Inspect how the return value enters context and whether the model uses it.

### Pages 55–59: system, data, and evals in RAG, tool calls, and MCP

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=55" data-slide-page="55">Slides 55–59</a>

Page 55 separates agent engineering into three interdependent concerns. **System** covers architecture and control; **data** includes training examples, demonstrations, and runtime context; **evals** includes evaluation and metrics. The same model can behave differently with different data and steps. Evaluating the model alone misses what it actually sees and how it is scored.

Page 56 distinguishes workflows, whose steps are fixed by code, from agents, whose steps are selected by the model. Both can be compound AI systems. Page 57 makes RAG's minimal data flow explicit: **retrieve** relevant material, **augment** the user's question with it, then **generate** from that input. Understand the middle step. Retrieved data remains invisible to generation unless it actually enters the model input.

For example, a delivery update may be found while an old summary from before truncation enters the prompt. Search success does not establish question-answering success. Conversely, including every email can bury relevant information. Follow the data flow when checking the system rather than merely checking whether retrieval returned a value.

Page 58 separates one tool call into four stages:

| Stage | `read_file` example | What it cannot replace |
|---|---|---|
| Select | Choose a file-reading tool from available definitions | A correct name does not establish correct arguments |
| Arguments | Fill `{"path":"test.py"}` from the task | JSON-like syntax does not establish compliance with the tool's fields |
| Validate | Check types and structure, including `path` | A valid type does not grant permission to read the file |
| Execute | Read in the execution environment and return contents to context | Writing the call does not mean the file was read; failures must return status too |

Page 59 places MCP as a standard protocol between applications and data/tools. Chat interfaces and IDEs can connect consistently to data systems, development tools, and work services. Bidirectional arrows represent requests and results. Connecting the protocol neither authorizes access to every dataset nor guarantees that tools are safe.

**Check your understanding:** does schema-valid input authorize reading any path? No. Structural validation, access policy, and execution restrictions are separate jobs. A standard connection format does not make the latter two redundant.

### Pages 61–64: test success, reliability, and safe completion separately

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=61" data-slide-page="61">Slides 61–64</a>

Page 61 lists reliability, training, long tasks, safety, and evaluation as central challenges. Errors in a long loop can propagate; training faces sparse feedback, long horizons, and expensive rollouts; growing context can also let goals and constraints drift. These are distinct system problems to diagnose, rather than one explanation for a wrong final answer.

Page 62 separates three directions for testing reliability:

| Dimension | Question | Original email-assistant test |
|---|---|---|
| Consistency | Does repeating a task produce stable outcomes? | Across runs over the same emails, do suppliers alternately disappear or appear incorrectly? |
| Robustness | Can small, reasonable changes destabilize the result? | Does the conclusion hold after rephrasing the question or reordering tool results? |
| Predictable failure | Can failure be recognized and recovered from? | Does a timeout produce explicit uncertainty instead of invented results? |

Page 63's HAL dashboard places capabilities alongside several reliability dimensions. High accuracy does not automatically establish reliability on every dimension. Page 64 compares task completion with safety: fulfilling a request and respecting constraints are not the same score. These figures are particular evaluation snapshots used in the slides. Their colors or bar heights cannot establish agents' safety in general.

**Answer criterion:** correctly summarizing every delay email but sending the summary externally without confirmation does not pass the complete task. Content may be correct while authorization fails. Tests must distinguish those conditions and then check that both hold.

### Pages 65–71: collaboration, attacks, and privacy extend beyond completion rate

<a href="https://web.stanford.edu/class/cs329z/slides/lecture01.pdf#page=65" data-slide-page="65">Slides 65–71</a>

The closing cases show that safety involves more than whether a tool is malicious:

- **Collaboration and clarification, page 65:** asked to buy groceries, the assistant searches for milk in a particular location without asking about the user's location, usual store, or desired items. This is an understanding and collaboration problem before any malicious attack. Acting too early can miss the user's purpose.
- **Adversarial content in the environment, page 66:** a pop-up redirects an existing task toward other actions. Visible text is environment data; seeing it does not promote it to a user instruction. The slide contains attack statistics from a particular study. Here it explains the mechanism, not a success rate for every deployment.
- **Read access does not imply permission to forward, page 67:** the PrivacyLens illustration shows an assistant reading a private lunch with a recruiter from a calendar and including it in a work report to a manager. The information is real but sent to an inappropriate recipient. Purpose, audience, and information scope all matter.
- **Sycophancy and altered grading, page 68:** one example flatters poor work; another changes code related to testing or rewards. The former distorts feedback, while the latter changes the measuring instrument. A higher-looking score alone does not establish task improvement.
- **Improper collaboration between agents, pages 69–70:** agents on different tasks discover an unauthorized shared message board and collaborate to find ways to deceive scorers. A shared channel can bypass isolation and evaluation boundaries. This particular incident does not establish that all multi-agent systems behave this way.

An original counterexample closes the section: an agent finds correct information and proactively forwards a related private appointment because it considers the answer more complete. Its facts may be accurate while it violates the user's purpose and privacy boundaries. **Check content, authorization, and recipient together**, beyond asking whether the model told the truth.

Page 71 returns to the lecture's progression: history frames agents, architecture connects reasoning, memory, tools, and environment, then compound systems, reliability, and safety test complete outcomes. The three digests that follow add different readings. BAIR expands system design, Ng organizes work patterns, and Si examines execution feedback. They supplement the lecture without replacing everything these 71 pages cover.

## Reading 1 | BAIR: Why compound AI systems still matter as models improve

**The Shift from Models to Compound AI Systems** — Matei Zaharia et al., BAIR Blog, February 18, 2024. [Original article](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/)

### TL;DR

The model is one component. Application outcomes also depend on how data arrives, how tools are used, how steps connect, and how results are checked. BAIR argues for designing these parts together: identify the task's bottleneck before deciding whether to invest in the model, retrieval, or another component.

### Editorial assessment

| Aspect | Assessment |
|---|---|
| Material type | Research perspective drawing on different systems and tools, rather than one controlled experiment |
| Evidence | The composition of existing systems such as AlphaCode 2, AlphaGeometry, and RAG; tasks and budgets differ across examples |
| Reading value | High: establishes a set of design questions for moving from model demonstrations to working applications |
| Limits to preserve | Hypothetical performance numbers do not predict a product's results; the 2024 tool landscape is not a current product comparison |
| Editorial confidence | High in the organization of system-design questions; no guarantee that one combination will always work better |

### Field background

A single model call makes a compelling demonstration: supply an input and receive an output. Real applications also encounter information created after training, different users' access rights, and different time and cost constraints. Those conditions come from the application environment. A stronger model does not automatically know them.

BAIR calls an arrangement of multiple interacting components a **compound AI system**. Components can include repeated model calls, retrievers, and external tools; several different models are not required. An agent raises a separate question about control. Code can prescribe the steps of a compound system, while a model can choose its next action from observations in a more autonomous arrangement. The terms are not interchangeable.

### Intermediate guide

**What is the problem?** After a first model demo, teams often find that answers are occasionally excellent but inconsistent in practice. Asking only which model to switch to mixes together missing data, misread evidence, access control, and evaluation. BAIR asks where the complete system fails.

**How does the argument develop?** The authors first give four reasons to invest in system design, then examine challenges in the design space, optimization, and operations:

| Reason | What a system can add | Remaining cost |
|---|---|---|
| System design can improve some tasks more readily | Repeated sampling, tests, retrieval, and checks address different bottlenecks | More components introduce latency and failure paths |
| Data changes | Connect new information and restrict access according to application identity | Index updates and access decisions need maintenance |
| Control and trust need external mechanisms | Restrict actions, provide citations, and check facts | The checker can still miss errors |
| Quality and cost requirements vary by task | Use different models or allocate computation differently across steps | Measure the complete outcome, not just the price of one call |

**Why does it matter?** This turns improving AI into engineering choices that can be examined separately. If an important email never reaches the model, address retrieval first. If the model sees the latest reply but repeats an obsolete conclusion, examine generation or checking. Model capability and system design can improve together.

Consider an original email example. The user asks, “Which suppliers have confirmed a delay?”

| Email | Content |
|---|---|
| E1, Supplier A's earlier notice | “A delay is confirmed. Delivery will move to next Wednesday.” |
| E2, Supplier B | “The delay is confirmed; delivery moves to next Monday.” |
| E3, Supplier A's follow-up | “The shortage is resolved. Delivery returns to the original date.” |
| E4, Supplier C | “The parts may arrive late. We will confirm on Friday.” |

The correct answer lists only Supplier B and cites E2. E3 supersedes Supplier A's notice; Supplier C reports only a risk. The system retrieves emails the user may access, generates a candidate answer, and checks its sources and the order of updates. If A appears in the answer, first check whether E3 entered the input. If C appears, check whether the model turned “possible” into “confirmed.” These are different errors.

```diagram
title: Evidence at every step from email to answer
desc: Accessible emails support generation and citation checks against sources and later updates.
caption: An original fixed workflow; checks can miss errors. This does not define an autonomous agent loop.
---
<svg viewBox="0 0 440 504">
<path class="dg-line" d="M92 152H48Q40 152 40 160V348Q40 356 48 356H88" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 80V116" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 184V220" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 288V324" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 392V428" marker-end="url(#arrow)"/>
<rect class="dg-box" x="92" y="16" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="40" text-anchor="middle" dominant-baseline="central">Question</text>
<text class="dg-sub" x="220" y="60" text-anchor="middle" dominant-baseline="central">Who confirmed a delay?</text>
<rect class="dg-box" x="92" y="120" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="144" text-anchor="middle" dominant-baseline="central">Retrieve</text>
<text class="dg-sub" x="220" y="164" text-anchor="middle" dominant-baseline="central">Accessible E1–E4</text>
<rect class="dg-box" x="92" y="224" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="248" text-anchor="middle" dominant-baseline="central">Generate</text>
<text class="dg-sub" x="220" y="268" text-anchor="middle" dominant-baseline="central">Model call</text>
<rect class="dg-box dg-box--accent" x="92" y="328" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="352" text-anchor="middle" dominant-baseline="central">Check grounding</text>
<text class="dg-sub" x="220" y="372" text-anchor="middle" dominant-baseline="central">Sources and latest replies</text>
<rect class="dg-box" x="92" y="432" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="456" text-anchor="middle" dominant-baseline="central">Answer</text>
<text class="dg-sub" x="220" y="476" text-anchor="middle" dominant-baseline="central">Supplier B; cite E2</text>
</svg>
```

### Deeper points

**The design space extends beyond model selection.** A RAG pipeline can change its query, ranking, passage format, or source checks. Those choices interact: a retriever may favor E1 because it contains “delay,” and the generator may faithfully summarize it. Both local steps appear to work, yet the final answer is wrong. To establish a component's value, first hold other conditions fixed and compare individual changes, then test combinations. Improvements cannot simply be added together.

**Optimization becomes difficult at handoffs and nondifferentiable components.** Gradients can tune a neural network end to end, while search and code execution need not be differentiable. The article uses DSPy to illustrate searching instructions, demonstrations, and configurations against a validation metric. The metric must still represent the task. Having a citation differs from having one that supports the conclusion; optimizing the wrong criterion can produce consistently superficial compliance.

**Operations must cover traces and data pipelines.** A final answer alone cannot reveal whether E3 was missing from the index, blocked by an access rule, or lost in ranking. Appropriate source IDs, retrieval results, and intermediate outputs narrow the investigation to a specific stage. Storage must still follow application access and retention rules. Safety also depends on composition: individually ordinary components may introduce new risks when connected.

**The examples establish a direction, not a common effect estimate.** AlphaGeometry combines a language model with a symbolic reasoner, showing how components can divide work. AlphaCode 2 generates, executes, and filters candidates, showing that outcomes extend beyond a single call. These are not one experiment holding tasks, costs, and models constant. The article's numerical example about training budgets, sampling, and testing is explicitly hypothetical. It cannot promise a particular improvement in an arbitrary product.

### Reviewer in one sentence

The article's strength is exposing design choices and operational responsibilities beyond the model so teams can investigate bottlenecks; it offers research and engineering directions, without a universally best architecture.

### Your take-away

Pick one failure in an existing application. Trace input → data actually retrieved → model judgment → final outcome, and find the first failure before choosing a component to change. In the example, if E3 never enters the input, another checker that also lacks E3 cannot know Supplier A restored its original schedule. That separates data acquisition from answer checking.

## Reading 2 | Andrew Ng: What changes when a model can revise its work?

**Agentic Design Patterns Part 1: Four AI Agent Strategies That Improve GPT-4 and GPT-3.5 Performance** — Andrew Ng, The Batch, March 20, 2024. [Original article](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/)

### TL;DR

Generating an answer in one pass resembles asking a writer to work without backspacing. Ng organizes four directions for iterative work: reflection, tool use, planning, and multi-agent collaboration. They create opportunities to correct output and obtain information. Every application need not use all four.

### Editorial assessment

| Aspect | Assessment |
|---|---|
| Material type | Short technical perspective and design-pattern article, incorporating HumanEval results from different studies |
| Evidence | The author's team collects coding results from other research teams and uses writing to explain iteration |
| Reading value | High: a short way to establish shared language for discussing workflows |
| Limits to preserve | The patterns are not mutually exclusive, and the chart is not a four-pattern ablation with fixed models, tools, and budgets |
| Editorial confidence | High in the pattern definitions and design ideas; extrapolation of particular numbers to other tasks remains limited |

### Field background

A language model can generate an entire answer from left to right. Actual work often doubles back: research, draft, discover a gap in the argument, then investigate and revise. One-pass generation compresses these opportunities into a single output. An agentic workflow separates them into observable steps that can be corrected.

Here, “agentic” emphasizes how work proceeds. A workflow can include fixed steps or model-selected actions. Ng's patterns describe the capability a design adds. Their names alone do not establish autonomy, and they do not map one to one onto another course's workflow taxonomy.

### Intermediate guide

**What is the problem?** When a model's first answer has weaknesses, does the application let it gather information, identify errors, and revise? Ng's writing example proceeds through an outline, a decision about web search, a draft, a review for unsupported arguments or extraneous content, and revision.

**How do the four directions work?**

| Pattern | Core mechanism | Application to the email example |
|---|---|---|
| Reflection | Review its own output and propose improvements | Compare the draft with original emails to catch E4's “possible” becoming “confirmed” |
| Tool Use | Obtain information, calculate, or change external state | Retrieve additional emails and attachments, supplying information previously absent |
| Planning | Divide a goal into steps and arrange execution | Identify suppliers, collect their exchanges, then check updates |
| Multi-agent collaboration | Assign different roles, discuss, and integrate | Separate evidence gathering from checking conclusions, preserving source IDs at the handoff |

The right column applies the patterns here; it is not an implementation supplied by the original article. One model can perform reflection. Planning need not involve several agents, and a fixed process can use tools. Specify what information a step adds or what new opportunity for correction it creates.

**Why does it matter?** These categories help change a workflow instead of simply lengthening its prompt. Separating a summary into drafting and checking, for example, lets us inspect both the draft's errors and whether checking catches them. This returns to BAIR's question: does an added step address the current bottleneck, and is its cost worthwhile?

### Deeper points

**Read the numbers with their comparison conditions.** In the HumanEval results Ng collects, GPT-3.5 achieves 48.1% correctness with zero-shot generation and GPT-4 achieves 67.0%. Some iterative agent workflows take GPT-3.5 as high as 95.1%. This observation draws on different research results. Ng does not rerun one experiment in the article with identical call counts, tools, costs, and settings. It motivates studying workflows; it does not establish that a weaker model in any loop beats a stronger one.

**Revision requires evidence that can reveal an error.** Without E1–E4, a checker may merely polish an incorrect draft. Stale tool results also remain stale after more tool use. Several roles can all cite E1 and miss E3 together. Our design judgment is to inspect whether feedback adds evidence or an effective check before counting roles.

**Workflow improvements and model progress can happen together.** GPT-3.5 and GPT-4 illustrate iterative opportunities at the time of publication; this is not a current model ranking. A model may improve its internal reasoning while external tools and inspectable checks retain distinct functions. Retest which steps remain useful with current models and actual cases.

### Reviewer in one sentence

Ng turns “give the model another chance” into four useful design directions; implementation still needs feedback sources, stopping conditions, and cost comparisons, because a chart assembled across studies cannot replace acceptance testing.

### Your take-away

Choose a process with recorded failures and add one opportunity for correction: give the model original sources to check, or a tool for further investigation. Record both the errors it fixes and the correct material it mistakenly changes. If E3 was never retrieved, investigate further first. If E4 was present but misread, test whether reflection catches that error. This reveals what the new pattern actually does.

## Reading 3 | Si et al.: What can models learn when research ideas actually run?

**Towards Execution-Grounded Automated AI Research** — Chenglei Si, Zitong Yang et al., arXiv:2601.14525, 2026. [Full paper](https://arxiv.org/html/2601.14525) · [Public environments and execution traces](https://github.com/NoviScl/Automated-AI-Researcher)

### TL;DR

The authors submit pretraining and post-training ideas to an automated executor so real training results can test them. Evolutionary search finds improvements over baselines in the specified environments. Reinforcement learning directly from execution rewards improves average idea quality without a clear improvement in the best idea, while diversity contracts.

### Editorial assessment

| Aspect | Assessment |
|---|---|
| Material type | Experimental research; this digest reads the methods, results, and discussion in the arXiv full text |
| Evidence | Two executable research environments, several ideator models, search comparisons with equal sampling budgets, and analysis of reinforcement-learning dynamics |
| Reading value | High: separates plausible ideas from effective code and reveals how the executor shapes learning |
| Reproducible artifacts | The authors provide public environments and execution traces; this article did not rerun GPU experiments |
| Limits to preserve | No test of transfer to larger models or other datasets; novelty is not the training reward, and implementation errors affect scores |
| Editorial confidence | Moderately high in the authors' reported findings for these environments; broader autonomous scientific capability remains uncertain |

### Field background

Asking a model to propose a research idea is easier than asking it to demonstrate effectiveness. Persuasive text may yield no improvement when executed; a good idea can also be implemented incorrectly. Feedback from another model alone may reward increasingly convincing proposals without establishing whether a method works.

Execution grounding connects feedback to results. An idea becomes code, runs against fixed data and evaluation, and returns scores and logs. Evaluation problems remain, but they become an inspectable chain: idea quality, implementation fidelity, successful execution, and measurement validity.

### Intermediate guide

**What is the problem?** The authors first ask whether natural-language research ideas can be executed automatically at scale, then whether models can use the results to propose more effective ideas. These questions differ: successfully running code establishes executability; the target metric must establish improvement.

**How does the method work?** The executor receives an idea and baseline code. An Implementer produces an applicable code diff, a Scheduler allocates resources according to the environment, and a Worker runs GPU experiments, returning performance, code changes, and execution logs. The paper's Implementer mainly prompts a model for diffs and handles failures to apply them. It is not a complete coding agent freely installing tools and rebuilding the research environment.

```diagram
title: Test research ideas through execution
desc: Ideas become code, scheduled experiments return evaluations and traces, and results inform later ideas.
caption: Simplified from Si et al.; solid lines show execution, the dashed line feedback. Search and RL use feedback differently.
---
<svg viewBox="0 0 440 408">
<path class="dg-line" d="M220 80V116" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 184V220" marker-end="url(#arrow)"/>
<path class="dg-line" d="M220 288V324" marker-end="url(#arrow)"/>
<path class="dg-line dg-line--dashed" d="M348 360H392Q400 360 400 352V56Q400 48 392 48H352" marker-end="url(#arrow)"/>
<rect class="dg-box" x="92" y="16" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="40" text-anchor="middle" dominant-baseline="central">Propose an idea</text>
<text class="dg-sub" x="220" y="60" text-anchor="middle" dominant-baseline="central">Research proposal</text>
<rect class="dg-box" x="92" y="120" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="144" text-anchor="middle" dominant-baseline="central">Implementer</text>
<text class="dg-sub" x="220" y="164" text-anchor="middle" dominant-baseline="central">Code modifications</text>
<rect class="dg-box" x="92" y="224" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="248" text-anchor="middle" dominant-baseline="central">Scheduler / Worker</text>
<text class="dg-sub" x="220" y="268" text-anchor="middle" dominant-baseline="central">Allocate and run</text>
<rect class="dg-box dg-box--accent" x="92" y="328" width="256" height="64" rx="6"/>
<text class="dg-label" x="220" y="352" text-anchor="middle" dominant-baseline="central">Fixed evaluation</text>
<text class="dg-sub" x="220" y="372" text-anchor="middle" dominant-baseline="central">Scores and traces</text>
<text class="dg-edge" x="376" y="208" text-anchor="middle" dominant-baseline="central">Result</text>
</svg>
```

The authors compare two learning routes. **Evolutionary search** leaves the ideator model's weights unchanged: effective previous ideas enter the prompt to generate variants, while part of the search explores other directions. **Reinforcement learning** uses execution rewards to update the ideator model. The executor is shared, but behavior changes through different mechanisms.

**Why does it matter?** Feedback becomes measured validation performance instead of a favorable opinion about an idea. Executor capability and evaluator design therefore directly shape what the model learns. The post-training environment isolates validation code and prohibits the executor from accessing or modifying it, preventing improvements that come merely from changing the grading process.

### Deeper points

**Separate the two tasks and their metrics first.** The settings in [§2.1 and Table 1](https://arxiv.org/html/2601.14525) are below. All numbers are the authors' reports, not measurements made for this article:

| Environment | Model and data | Search objective | Reported best-solution result |
|---|---|---|---|
| Post-training | Qwen2.5-Math-1.5B trained on MATH; GRPO baseline | Maximum validation accuracy within a fixed training-time budget | Baseline 48.0%; search finds 69.4% |
| Pretraining | 124M GPT-2, FineWeb, eight H100 GPUs | Reciprocal validation loss after a fixed 25 minutes, as the proxy reward for search and RL | Separately measure the best solution's time to validation loss 3.28: baseline 35.9 minutes; search solution 19.7 minutes |

Post-training gains **21.4 percentage points**. This is validation accuracy in one math-training environment, not the same proportional gain across all models or tasks. Pretraining time falls by approximately **45.1%**, but elapsed time to the target is not what each search iteration directly optimizes. Search compares losses after a fixed duration; the best solution is then timed to the target. Mixing these metrics obscures the objective.

**Finding improvements within ten epochs does not establish continuing gains from more search.** In §4, search uses Claude-4.5-Opus, Claude-4.5-Sonnet, and GPT-5. Within each experiment, the same model proposes and implements ideas. Sonnet finds the 69.4% post-training solution at epoch 2; Opus produces the best pretraining solution. Opus shows a clearer search-scaling trend, while Sonnet and GPT-5 tend to plateau early. These differences disappear in a blanket claim that more search works.

**Equal sampling budgets help one comparison; humans remain ahead in another.** In the nanoGPT environment, the authors compare the first three epochs of GPT-5 search with best-of-N using the same number of ideas. Search performs better after using earlier trajectories. For post-training, they also compare the best student solution from Stanford CS336 in the same environment and training-time budget, which achieves 68.8% validation accuracy. In contrast, Table 1 lists a best human nanoGPT result of 2.1 minutes, much faster than the search solution. That is a leaderboard result as of December 2025, without aligning all human effort against total automated-search cost. Selecting only the post-training cell above human performance cannot establish a general victory over researchers.

**RL's average and maximum rewards move differently.** Section 5 uses Qwen3-30B-A3B as the ideator and updates its weights with GRPO. Execution reward is validation accuracy for post-training and reciprocal validation loss for pretraining; failed executions receive zero. Average post-training accuracy rises from 25.3% to 34.3% at epoch 40, while maximum reward fluctuates without a clear upward trend. This is a separate RL experiment, not the same curve as the earlier search result of 69.4%.

The model also gravitates toward a few easily implemented ideas that reliably earn positive rewards. In nanoGPT batches of 128 ideas, “replace normalization layers” or “apply EMA to intermediate checkpoints” account for 51 ideas initially and 119 at epoch 68. Along with shorter thinking traces, this supports the authors' analysis of contracting diversity. The experiment does not establish whether the result applies to every RL method.

**Scale is only one limitation.** Section 8 explicitly leaves transfer to larger models and other datasets untested. An executor's implementation failure also gives an otherwise good idea poor feedback, mixing ease of implementation with research value. The reward measures effectiveness without jointly evaluating novelty. Repeatedly producing a known effective idea differs from discovering a breakthrough.

### Reviewer in one sentence

The work connects open-ended ideas to executable environments while showing both gains from search and RL's exploration difficulties; the feedback chain and its distortions deserve as much attention as the best solution's improvement over a baseline.

### Your take-away

For an agent learning from results, separately record implementation success, improvement on the task metric, and idea diversity. Fix the evaluator and preserve failed trajectories. The agent proposing solutions should not also rewrite success criteria. A useful comprehension check is whether you can explain rising average reward alongside a stagnant maximum: concentrating on a few easy-to-implement ideas can make average outcomes steadier while reducing exploration for something better.

## What can we learn from these three articles?

BAIR makes the whole system the unit of improvement. Ng supplies language for changing how work proceeds. Si uses an execution environment to test whether feedback improves ideas. Their evidence differs in strength; they need not be forced into one experimental narrative. Keep asking what information a new step adds, who defines success, and how far a failure can be traced.

Carry these questions into [Week 2's workflows and RAG](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), then [Week 3's tools and frameworks](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en). HW1 is a later implementation assignment. The editorial judgments and original examples here do not replace its official requirements.

## Update Log

- 2026-10-23: Expanded the lecture guide across all 71 physical PDF pages, adding page links, the complete Apple Remote trace, comparisons of reasoning and memory mechanisms, tool-call stages, safety cases, and an action-loop diagram. Preserved the three independent reading digests.

- 2026-10-23: Added an independent opening-slide guide covering the agent loop, five components, system/data/evals, tool calls, reliability and safety, and their relationship to the three readings.

- 2026-10-23: Substantially rewrote the guide as three independent reading digests. BAIR, Ng, and Si each have a TL;DR, editorial assessment, background, method, deeper findings and limitations, reviewer comment, and take-away. Consolidated course mapping and recording information, removed the invented twenty-question experiment, and added Si's actual experimental conditions and results.

- 2026-10-23: Clarified the wording and consolidated recording access information at the beginning.

- 2026-10-23: Reorganized the Week 1 guide to distinguish lecture slides, required and additional readings, original exercises, and later HW1. Added the agent loop, a complete email example, a comparison experiment, mechanisms and limits for both additional readings, and self-checks. Reread official materials, BAIR, Ng, and Si; identified teaching numbers as invented data.

- 2026-10-23: Added a compound-system component diagram to visualize existing explanations; no factual refresh.

- 2026-09-29: HW1 was restructured (no more Part A / Part B split, no required DSPy rewrite, corpus changed to corporate emails); updated the affected paragraphs.

- 2026-10-10: Updated material links and access notes.

## References

- [Zaharia et al., The Shift from Models to Compound AI Systems, BAIR Blog, 2024](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/): full argument and examples for the first digest.
- [Andrew Ng, Agentic Design Patterns Part 1, The Batch, 2024](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/): four patterns, writing workflow, and HumanEval comparisons across studies.
- [Si et al., Towards Execution-Grounded Automated AI Research, 2026](https://arxiv.org/html/2601.14525): §2 executor and environments, §4 search, §5 RL dynamics, §8 limitations; [public environments and traces](https://github.com/NoviScl/Automated-AI-Researcher).
- [Lecture 01: Intro to Agentic Systems](https://web.stanford.edu/class/cs329z/slides/lecture01.pdf), [official schedule](https://cs329z.stanford.edu/), and [Logistics](https://cs329z.stanford.edu/logistics.html): roles of course materials, assignment dates, and recording access.
- [Official HW1 handout and starter](https://github.com/cs329z/assignment1-harness): requirements for the later assignment.
- On this site: [CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en).
