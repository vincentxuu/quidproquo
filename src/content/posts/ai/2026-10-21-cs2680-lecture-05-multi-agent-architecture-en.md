---
title: "Multi-Agent Architecture: Topology, Task Decomposition, and Communication Between Agents | Harvard CS2680 Lecture 5"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, multi-agent, agent-harness, a2a, mcp, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 7
tldr: "CS2680 Lecture 5 (2026-09-23) is about designing multi-agent systems. There are four reasons to split work across agents: specialization, isolation, parallelism, and context management. Any architecture can be described by three questions: who coordinates, how the work is split, and how messages move. The lecture lays out eight architectures, then covers six ways to decompose a task, a granularity formula for deciding whether to split, six common decomposition failures, and why communication is really a distributed systems problem: messages get lost or resent, and two agents end up changing the same thing at once. It closes by contrasting A2A with MCP, with \"Is multi-agent really necessary?\" as the first design principle."
description: "Guide to Lecture 5 of Harvard CS2680 Modern AI Systems (Fall 2026): four reasons to split work across agents, the control, task, and communication graphs, eight multi-agent architectures, task decomposition and the granularity formula, six decomposition failures, four dimensions of communication and delivery semantics, how A2A and MCP divide the work, and four design principles. Based on the public slides, with numbers checked against Anthropic, Cognition, and the original papers."
draft: false
glossary:
  - term: "idempotent"
    aliases: ["idempotency"]
    definition: "An operation that has the same result whether you do it once or many times. \"Set the status to paid\" is idempotent; \"add 100 to the balance\" is not. In a system where messages may be resent, the receiver should be idempotent, or use an id to recognize repeated requests."
    context: "Lecture 5 uses a timed-out request to \"purchase 8 GPU instances\" to show why it matters."
  - term: "A2A"
    aliases: ["Agent2Agent"]
    definition: "An open protocol that lets agents built by different teams or frameworks discover each other, delegate tasks, and report progress. Each agent publishes an agent card describing what it can do; tasks have states and can pause to wait for more input from the user."
    context: "Lecture 5 contrasts it with MCP: MCP connects an agent to tools, A2A connects an agent to other agents."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-lecture-05-multi-agent-architecture)

**Video status: The course is not recorded.** This post is based on the public slides; the numerical examples are this site's additions. [Source notes](#course-video-sources)

Lecture 5 of [CS2680](https://cs2680.com/) met on September 23, 2026, under the title "Agent Design II: Multi-Agent Systems" ([slides](https://cs2680.com/slides/5_agent_design_2.pdf)). [Lecture 3](/posts/ai/2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent-en) took the user's side and showed how to run subagents and agent teams in Claude Code. This lecture takes the designer's side and asks how several agents should be put together.

The lecture answers two questions: when should you split work across several agents, and once you do, who directs whom and how do messages move? By the end you should be able to use a granularity formula to judge whether a task is worth splitting, and to point out which part of the communication is most likely to break for the split you chose.

The slides have three parts: architecture (p5–18), task decomposition (p19–25), and communication (p26–43), followed by four design principles (p44). The outline on p3 lists agent memory, but this deck doesn't cover it; memory moved to Lecture 6.

## Why split, and how to describe a split

### Four reasons

The slides give four reasons to split work across agents (p6):

- **Specialization**: different agents use different models, prompts, and tools.
- **Isolation**: different agents get different privileges, for example only one agent may write to production.
- **Parallelism**: independent subtasks run at the same time.
- **Context management**: not every agent has to carry the whole trajectory.

The last point builds on the conclusion of [Lecture 4](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en): context is a finite resource, and the longer it gets, the more it costs and the more the model misses. Hand the search to another agent and the main agent receives only the distilled result, so its own context stays clean.

### Three graphs

The lecturer describes any architecture with three questions (p7):

| Graph | The question | Possible answers |
|---|---|---|
| Control graph | Who coordinates? | One supervisor, a hierarchy, or nobody; whether control changes hands at runtime |
| Task graph | How is the work split? | Up front by a planner, by bidding, or emerging from local rules |
| Communication graph | How do agents communicate? | Direct messages, broadcast, or a shared workspace |

The three graphs vary independently. With the same "one supervisor in charge," the work can be split up front or as it goes; messages can all pass through the supervisor or be written to shared files. Every one of the eight architecture slides that follow labels these three columns at the bottom.

## Eight architectures

| Architecture | How it works | Example | Weakness |
|---|---|---|---|
| Supervisor–worker | One agent plans, delegates, and integrates; workers see only their own subtask | Three workers: research, coding, review | The supervisor re-reads every result, so its context grows fastest (p9) |
| Hierarchical | Supervisors manage sub-supervisors | Feature build: a backend lead over API and database, a frontend lead over UI and E2E tests | Each level has to decide how much context to pass down (p10) |
| Pipeline / DAG | Fixed stages with a clear data format at each boundary. A DAG is a directed acyclic graph: work only flows downstream and never loops back | Invoices: OCR → extract fields → match to PO → approve → post to ledger | Easiest to debug, but no way back: stage four can't ask stage one to redo its work (p11) |
| Blackboard | Agents coordinate through shared state instead of messaging each other | Several agents sharing one Git repo | Consistency, concurrent writes, provenance (p12) |
| Committee / debate | Each proposes an answer, they discuss, a judge or vote decides | Two graders and a judge marking essays | Same model and context means the same blind spot (p13) |
| Market / auction | Agents bid for tasks on capability, cost, and latency | GPU job routing (see the self-check below) | Bids are self-reported and can be inflated (p14) |
| Swarm | No permanent coordinator; agents negotiate directly | Warehouse robots negotiating who picks which order | O(n²) messages; the lecturer says it's rarely used in products (p15) |
| Dynamic topology | Agents are added, removed, or rewired while running | A support bot that calls in billing and log agents only when a ticket escalates | Every run takes a different shape, so failures are hard to reproduce (p16) |

The pipeline slide has a useful line: "one retry edge beats one more agent" (p11). This post reads it as: when something goes wrong between stages, having the previous stage redo its work is often cheaper than adding another agent.

The summary table on p18 has a weakness column. This post maps it onto communication to show where each architecture is most likely to break:

- **Supervisor–worker**: aggregation, because the summaries workers hand in lose detail.
- **Pipeline**: errors travel all the way downstream.
- **Blackboard**: concurrent writes, and reading stale state.
- **Committee**: members aren't independent and end up agreeing with each other.
- **Swarm**: too many messages, and questions that go around in circles.

All of these failures come back when we get to communication.

Real systems are mostly hybrids (p17). The slide's example: under a supervisor, a planner produces a task DAG and re-plans when needed; coding, research, and testing agents share one Git repo; a reviewer checks the result at the end. That uses a hierarchy, shared memory, and a pipeline at once.

Compare this with the tools from Lecture 3 (the slides don't make this comparison): a Claude Code subagent is supervisor–worker and reports its result only to the main agent. An agent team's shared task list works like a blackboard, and the mailbox between teammates is point-to-point messaging.

> **Self-check**: the GPU auction rule on p14 is "the cheapest bid that finishes within 5 seconds wins." The A100 node bids $0.20 and 3 seconds; the T4 bids $0.05 and 10 seconds; the H100 bids $0.40 and 1 second. Who wins? What if the T4 falsely claims 4 seconds?
> Answer: the A100. The T4 is cheapest but takes more than 5 seconds, so it's out; of the A100 and H100, the A100 is cheaper. If the T4 claims 4 seconds it wins, and the job actually takes 10 seconds. That is this architecture's weakness: bids are self-reported.

## Task decomposition

### Six ways to split, and what a subtask needs

Work can be split along six dimensions (p20):

- **Data**: each agent handles a subset of documents or records.
- **Expertise**: security, performance, correctness, and legal each take a pass.
- **Stage**: plan, implement, test, review.
- **Hypothesis**: each agent investigates one possible explanation.
- **Tool**: web, database, code execution, internal documents.
- **Authority**: agents act in different administrative domains.

Splits can be stacked. The slide's example is a PR touching 200 files: split it by file first, then by the two areas of expertise, security and performance (p20).

Each subtask should spell out eight things: the objective, inputs and relevant context, boundaries and exclusions, available tools and permissions, the output format, what counts as done, budget and deadline, and which other tasks it depends on (p21). "Research storage systems" is a poor subtask. "Identify storage-related papers published in 2026; return title, date, system contribution, evaluation scale, and primary-source URL; exclude database query optimization" is a good one.

[Anthropic made the same point about its own Research feature](https://www.anthropic.com/engineering/multi-agent-research-system): early on, the lead agent gave short instructions like "research the semiconductor shortage," and subagents duplicated each other's work and left gaps. Anthropic then required every subtask to state an objective, an output format, guidance on tools and sources, and clear boundaries.

### Will splitting make it faster? The granularity formula

If subtasks are too large, there isn't enough parallelism and the work still happens one piece after another. If they're too small, scheduling and communication overhead outweighs the time saved (p22). The slides give an estimate:

```text
T_multi ≈ T_planning + T_critical_path + T_communication + T_merge
```

The time to finish with several agents is roughly planning, critical path, communication, and merging added together. The critical path is the longest chain of work whose pieces depend on each other and must happen in order. Parallelizing pays off only when the sequential work it saves exceeds the cost of planning, communication, and integration.

Here is one worked example from this post. A task takes a single agent 30 minutes. Split it into three subtasks:

| | Planning | Critical path | Communication | Merge | Total | Worth it? |
|---|---|---|---|---|---|---|
| Three independent subtasks | 2 | 10 | 3 | 5 | 20 minutes | Faster than 30 minutes, worth it |
| Subtasks depend on each other | 2 | 25 | 3 | 5 | 35 minutes | Slower than 30 minutes, not worth it |

In the second row the critical path grows to 25 minutes: the last two subtasks wait for the result of the one before, and only about 5 minutes of the three pieces can overlap. Splitting here just adds planning, communication, and merging costs on top of the original work.

The formula counts only time to finish, not cost. Three agents running in parallel finish sooner but use more tokens than one agent: each one reads the background and instructions separately, and communication and merging come on top. [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system) measured multi-agent systems using about 15 times the tokens of an ordinary chat. Whether that's worth it is a separate calculation.

> **Self-check**: the example on p22 batches 20 "one-line" lookups into 4 subtasks. Why not run 20 agents?
> Answer: each lookup takes only seconds, so the planning, communication, and merging cost of starting an agent is larger than the lookup itself. In 4 batches, each batch has enough work to justify those fixed costs.

### Split up front, or split as you go

There are four timings for decomposition (p23):

- **Static**: split before execution; predictable and easy to evaluate. For example, summarize each of five uploaded PDFs.
- **Dynamic**: agents create new tasks as they discover things. For example, a dead link spawns a lookup task.
- **Recursive**: workers delegate further down. For example, a review agent starts one sub-agent per subfield.
- **Opportunistic**: idle agents claim the next available task. For example, an idle agent picks up the next unlabeled document.

Every decomposition needs limits, and the dynamic, recursive, and opportunistic kinds need them most: how many agents may be spawned, how much budget, how many levels deep delegation can go, and when to stop. Without them, delegation explodes recursively (p23). [Anthropic's Research feature made this mistake early on](https://www.anthropic.com/engineering/multi-agent-research-system): it spawned 50 subagents for a simple question.

### Six common decomposition failures

| Failure | Example | How to prevent it |
|---|---|---|
| Overlap | Two agents summarize the same paper | Write clear boundaries and exclusions into each subtask |
| Gap | One covers 2020–2023, another 2025–2026, and 2024 is missed | After splitting, check that the ranges cover everything |
| Hidden dependency | Pricing turns out to need sizing first, discovered only at runtime | State dependencies in the subtask spec |
| Unmergeable outputs | One returns free text, another returns JSON | Specify the same output format |
| Lost global context | Every section is fine, but the report contradicts itself | Someone checks the whole when merging, or shared assumptions go into every subtask |
| Straggler | Six agents finish in 20 seconds, one takes 4 minutes | Set deadlines; reassign or skip on timeout |

The examples all come from p24–25; the "how to prevent it" column is this post's mapping onto the subtask spec on p21. This series files these six failures under the harness layer of Lecture 6's five-layer attribution, because the harness decides how work is split. The straggler is exactly the "blocking fan-out" that Lecture 6 lists under the harness layer. Overlap, gaps, and hidden dependencies can also be seen as subtask specs that weren't written clearly. For a fuller taxonomy of multi-agent failures, read [MAST](https://arxiv.org/abs/2503.13657): the authors analyzed execution traces from 7 multi-agent frameworks and identified 14 failure modes in three categories: system design, misalignment between agents, and verification.

## Communication

### Four dimensions

Communication between agents has four design dimensions (p27):

- **Topology**: who can talk to whom, decided by the architecture you chose.
- **Medium**: how information is exchanged. Messages over a queue, a shared in-memory state object, or work products in files and databases (p28).
- **Channel**: how it's sent. Point-to-point, broadcast, publish–subscribe, a shared blackboard, request–response, or handing over an artifact (p29).
- **Format and semantics**: what a message looks like and what action it expresses.

The recommended format uses both (p30–31): natural language for content, structured fields for coordination. A message carries an `id`, a `task_id`, a sender, a recipient, and a type the runtime (the program that routes messages) recognizes, such as DELEGATE, REPORT, CANCEL, ACK, or ERROR; the actual content goes in the payload (the body of the message). The runtime can then route, retry, and stop without asking an LLM what the message meant. The slides' rule of thumb: route on the fields, not the prose (p32).

The 9/23 reading list also includes two earlier frameworks that this post doesn't go into: [AutoGen](https://arxiv.org/abs/2308.08155) builds multi-agent systems as agents conversing with each other; [MetaGPT](https://arxiv.org/abs/2308.00352) writes standard operating procedures into prompts, divides roles like an assembly line, and has roles with domain expertise check intermediate results, which is close to the pipeline above.

### Communication is really a distributed systems problem

On p33–34 the slides only name the concepts and give one timeout scenario. This section works through two examples: the first is this post's addition, the second extends p33.

**Example 1: two agents edit the same file.** Agents A and B both read `config.ts`. A adds a setting and writes the file back. B edits a different line based on the old version it read, and writes it back too. B's version doesn't include A's change, so A's work silently disappears and nobody reports an error. This is the concurrent-write problem of the blackboard architecture (p12). There are three common fixes: only one agent writes at a time, lock before writing, or each agent works on its own branch and Git merges them. Cognition's 2026 post likewise treats "writes stay single-threaded" as the precondition for multi-agent setups that work reliably today (see [the design principles](#four-design-principles-and-the-counterarguments)).

**Example 2: a message times out.** The slide's example: agent A asks B to "purchase 8 GPU instances," the network times out, and A gets no reply (p33). A doesn't know whether B made the purchase. Resend, and you might end up with 16 instances; don't, and you might have none. A also can't tell whether B is slow or dead, which is the "partial failure" listed below. Resending is at-least-once in the table below; not resending is at-most-once. Distributed systems describe this trade-off with three delivery semantics (definitions from [Confluent's Kafka documentation](https://docs.confluent.io/kafka/design/delivery-semantics.html)):

| Semantics | Meaning | Cost |
|---|---|---|
| At-most-once | Send once; don't resend on failure | Messages may be lost |
| At-least-once | Resend until acknowledged | Messages may be duplicated |
| Exactly-once | Never lost, never duplicated | Needs the whole system's cooperation; many environments can't provide it |

The most common combination in practice is at-least-once plus an idempotent receiver: resending is fine because the receiver recognizes duplicates. The slides suggest an idempotency key on the `task_id`: when B sees the same key again, it returns the previous result instead of buying again, and if something does go wrong there has to be a compensation or rollback path (p33). [Kafka's idempotent producer](https://docs.confluent.io/kafka/design/delivery-semantics.html) uses the same idea: each sender (the producer) has an id, and the server that stores messages in between (the broker) uses sequence numbers to recognize duplicates.

```diagram
title: Resending after a lost reply, with an idempotency key preventing a double purchase
desc: A asks B to buy 8 GPUs; B's reply after the purchase is lost on the network. A times out and resends with the same key, and B recognizes the key as already handled and returns the previous result.
caption: Drawn from the scenario on slide p33; the resend and deduplication flow is this post's addition.
step: A asks B to buy 8 GPUs, carrying key t-17
step: B asks the cloud provider to create 8 instances
step: The provider replies that they're created
step: B's reply is lost on the network
step: A gets no reply and times out
step: A resends with the same key
step: B finds t-17 already handled and doesn't buy again
step: B returns the previous result
---
<svg viewBox="0 0 640 504">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="488"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="488"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="488"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="108" text-anchor="middle" dominant-baseline="central">buy 8 GPUs</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M324 160H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="148" text-anchor="middle" dominant-baseline="central">create 8</text>
  </g>
  <g data-step="3">
    <path class="dg-line dg-line--dashed" d="M540 200H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="188" text-anchor="middle" dominant-baseline="central">created</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M316 248H196"/>
    <text class="dg-edge dg-text--warn" x="256" y="236" text-anchor="middle" dominant-baseline="central">reply lost</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M100 296H128Q136 296 136 304V312Q136 320 128 320H104" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-text--warn" x="148" y="308" dominant-baseline="central">timeout</text>
  </g>
  <g data-step="6">
    <path class="dg-line" d="M96 368H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="356" text-anchor="middle" dominant-baseline="central">resend (same key)</text>
  </g>
  <g data-step="7">
    <path class="dg-line" d="M324 396H352Q360 396 360 404V412Q360 420 352 420H328" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="372" y="408" dominant-baseline="central">t-17 already done</text>
  </g>
  <g data-step="8">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 456H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge" x="208" y="444" text-anchor="middle" dominant-baseline="central">previous result</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="152" rx="2" data-step="1 2 3 4"/>
  <rect class="dg-box" x="540" y="148" width="8" height="64" rx="2" data-step="2 3"/>
  <rect class="dg-box" x="316" y="356" width="8" height="112" rx="2" data-step="6 7 8"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">agent A</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">agent B</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">cloud provider</text>
</svg>
```

The slides then list the difficulties distributed systems already have (p34):

- The network delays, drops, reorders, and duplicates messages.
- Clocks on different machines disagree.
- Many parties modify the same state at once.
- You can't tell a slow agent from a dead one (partial failure).
- Replicas trade consistency against availability.
- Logs are scattered and their timestamps don't line up.

Multi-agent systems inherit all of these and add three more: scheduling, resource allocation, and state management. And there's no predetermined request flow, so the system can't know who needs to run, for how long, or with how many resources (p35).

LLMs add another layer (p36): summaries drop what the worker knew; what matters gets buried in a long context; B still acts on X=3 after X became 5; A says it's safe while B says it's vulnerable; every agent thinks someone else owns the task; A asks B, B asks C, and C asks A, in a loop.

> **Self-check**: a worker's completion report arrives twice. What happens to the supervisor, and how do you design against it?
> Answer: if the supervisor does a follow-up action every time it receives a report (merging the result, charging the budget, assigning the next task), the duplicate report makes those actions happen twice. The fix is to make report handling idempotent: each report carries a `task_id` or message id, the supervisor records the ids it has already handled, and when the same id arrives again it only sends an ACK and does nothing else.

### A2A and MCP: agent to agent, agent to tool

[A2A](https://a2a-protocol.org/) (Agent2Agent) is an open protocol for agents to work together; the current specification is version 1.0.0. The flow: A first looks up B's capabilities, sends a message that creates a task, receives progress updates, and finally gets the output back (p37).

- **Agent card**: every A2A server publishes a machine-readable card at `/.well-known/agent-card.json` that says who it is, what it claims to do, where and how to call it, whether it supports streaming and push notifications, and which authentication scheme to use (p38).
- **Three abstractions**: a Message is one turn of conversation; a Task is a unit of work with an id and a state; an Artifact is what the task produces, such as an itinerary PDF and booking data (p39).
- **Task states**: submitted and working, plus four terminal states: completed, failed, rejected, and canceled. A task can pause in input required or auth required and return to working once the missing information arrives. For example, "Book a flight to Boston" → "Which date?" → "Oct 3" all belong to the same task (p39–40).
- **Following long tasks**: poll for short jobs, stream for interactive output, use a webhook push notification for jobs that run for hours (p41).

The lecturer's summary: A2A standardizes communication, not orchestration (p41). Whether to delegate, how to split, and when to stop are still the harness's job. [The specification itself](https://a2a-protocol.org/latest/specification/) also stresses "opaque execution": agents collaborating don't need to share their internal thoughts, plans, or tool implementations.

[MCP](https://modelcontextprotocol.io/) (introduced in [Lecture 2](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en)) handles the boundary between an agent and tools or data (p42–43):

| | MCP | A2A |
|---|---|---|
| Primary abstraction | Capability / tool | Agent / task |
| Relationship | Agent → service | Agent → agent |
| Unit of work | One tool call | A task that may run a long time |
| Internal state | Exposes a capability interface | Ideally opaque |
| Analogy | Device or API interface | Service-to-service RPC |

MCP standardizes three primitives: tools are callable functions, resources are data the host can attach, and prompts are reusable interaction templates. The slides say "one client speaks to many servers"; the [current MCP specification](https://modelcontextprotocol.io/specification/2026-07-28/architecture) puts it this way: one host (such as Claude Code) runs several clients, and each client connects to exactly one server. The host decides which servers may connect and what the user has consented to; the model decides when to call a tool.

The two stack: a remote agent reached through A2A may itself call twenty MCP servers (p43, an illustrative figure).

## Four design principles and the counterarguments

The slides end with four principles (p44):

1. **Is multi-agent really necessary?** A single agent is usually enough; multiple agents often only add cost and complexity.
2. **Choose the topology from the task's dependencies**, and keep communication to a minimum.
3. **Find where information gets lost**: every aggregation node drops detail.
4. **Draw failure-containment boundaries**: one stuck agent must not stall the whole system.

The closing line: a dense mesh is rarely the best default, and more communication can increase context pressure without adding useful information.

The first principle is the heart of the lecture. After laying out eight architectures, the lecture's first principle asks whether to split at all, and the assigned reading includes a piece arguing against it.

**The counterargument: Cognition.** In June 2025, Walden Yan of Cognition wrote "[Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)," which sets out two principles: first, agents must share context, and share full agent traces, not just individual messages; second, actions carry implicit decisions, and conflicting decisions produce bad results. His example is building Flappy Bird: one subagent builds the background and another builds the bird; the background ends up looking like Super Mario, the bird's style and movement don't match the game, and the agent that has to combine them is left with two contradictory pieces. His recommendation: the simplest approach is a single-threaded agent. The same post also says a subagent that only answers a question and doesn't write code is acceptable, citing Claude Code's subagents at the time.

Ten months later, in "[Multi-Agents: What's Actually Working](https://cognition.ai/blog/multi-agents-working)" (2026-04), he drew the boundary more precisely: his original observations still hold for multiple agents writing in parallel, but setups where several agents contribute judgment while writes stay single-threaded do work. His example is letting a coding agent and a review agent iterate against each other, where the review agent shares no context beforehand and catches more bugs because of it.

**Even the people who build multi-agent systems add caveats.** [Anthropic's Research feature](https://www.anthropic.com/engineering/multi-agent-research-system) uses Opus 4 as the lead agent and Sonnet 4 as subagents, and outperformed a single Opus 4 by 90.2% on Anthropic's internal research eval. The same post also says multi-agent systems use about 15 times the tokens of a chat, so the task has to be valuable enough to pay for it. It adds that most coding tasks have fewer truly parallelizable parts than research, and that domains where every agent must share the same context aren't a good fit for multi-agent systems today. Cognition's 2026 post also notes that this Anthropic post and his first one reached similar conclusions: the first place multi-agent systems pay off is agents that read but don't write.

**What controlled studies say.** [Kim et al.](https://arxiv.org/abs/2512.08296) (Google Research, MIT, and others; an arXiv preprint) held tools, prompts, and compute fixed and compared a single agent with four multi-agent architectures across 260 configurations. The result depends on the task:

- On financial reasoning that can be decomposed, centrally coordinated multi-agent systems did 80.8% better than a single agent.
- On tasks that require sequential planning, with agents working independently, they did 70% worse.
- On tasks where a single agent already exceeds 45% accuracy, adding agents made things worse.
- With independent agents and no central verification, one agent's error propagates all the way to the final answer; architectures with central coordination amplify errors only about a quarter as much.

[Tran and Kiela](https://arxiv.org/abs/2604.02460) (2026, an arXiv preprint) held the reasoning-token budget fixed before comparing. On multi-hop reasoning, a single agent matched or beat multi-agent systems. They argue that many reported multi-agent advantages actually come from unaccounted-for compute and context effects.

Taken together, these sources point to the same conditions: split only when the task decomposes, the subtasks depend little on each other, and the extra tokens are worth it; have someone responsible for verifying and merging, and keep writes in one place. That's why the granularity formula (time) and the token bill (cost) have to be worked out together.

## Final self-check

1. You're building an agent that "reads 50 customer interviews and identifies the top five pain points." A single agent reads each one in 1 minute, 50 minutes in total. Instead, 5 workers read 10 each, with an estimated 2 minutes of planning, 3 minutes of communication, and 6 minutes of merging. Use the granularity formula to work out how long the split takes. Is it worth it? Which way of splitting and which architecture? Which part of the communication is most likely to break?
   Criterion: you get 2 + 10 + 3 + 6 = 21 minutes, faster than 50, so it's worth it; splitting by data with independent subtasks suits supervisor–worker. The likeliest communication failure is the supervisor losing detail when aggregating (information loss on p36, principle 3), so every worker should use the same output format and attach the original quote and interview number to each pain point, letting the supervisor check back and merge similar items.
2. Two coding agents change the same repo in parallel, and CI passes some runs and fails others for no clear reason. Based on this lecture, what's the most likely cause?
   Criterion: you identify concurrent writes in a blackboard architecture (p12): both agents read an old version and write back, the last writer wins, so the CI result depends on execution order; conflicting implicit decisions are another possibility. The fix is to keep writes in one agent, or have each work on its own branch and merge.
3. Your agent needs to call a quoting agent built by another company; a quote may need manual approval and take hours. MCP or A2A? How do you follow progress?
   Criterion: you choose A2A, because the other side is an opaque agent and the task runs long and may pause in input required; follow progress with a push notification (webhook).

## Further reading

- [Lecture 3: Running many agents at once](/posts/ai/2026-10-21-cs2680-lecture-03-scaling-yourself-multi-agent-en): the user's view of this lecture's architectures, and how to actually run subagents and agent teams.
- [Multi-Agent Orchestration Patterns: Scripted, Model-Driven, or Hybrid](/posts/ai/2026-09-18-multi-agent-orchestration-patterns-en): who decides the next step, and the trade-offs among three orchestration philosophies.
- [Multi-Agent Communication: Handoff, Delegate, Mailbox, and the Push for Protocol Standards](/posts/ai/2026-09-18-multi-agent-communication-en): the implementation side of this lecture's communication section.
- [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en): protocols beyond A2A and MCP.
- [Cemri et al., Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657): MAST's 14 multi-agent failure modes.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)).
- Source: [Lecture 5 slides](https://cs2680.com/slides/5_agent_design_2.pdf) (PDF pages p5–44) and the [9/23 reading page](https://cs2680.com/readings/sep-23), read on 2026-10-22. Page numbers always follow PDF page order.
- Numbers cited in the readings and slides were checked against the originals: Anthropic's Research post, both Cognition posts, Kim et al. (arXiv 2512.08296 v3), the A2A 1.0.0 specification, and the MCP 2026-07-28 specification; places that differ from the slides are flagged in the text. The Tran and Kiela study, Cognition's 2026 post, and the Confluent documentation are sources this site added.
- The 30/20/35-minute granularity example, the two-agents-editing-one-file example, and the answers to the self-checks are this site's additions, not lecture content.

## References

- [CS2680 Lecture 5 slides: Agent Design II: Multi-Agent Systems](https://cs2680.com/slides/5_agent_design_2.pdf)
- [CS2680 readings: 9/23](https://cs2680.com/readings/sep-23)
- [Anthropic: How we built our multi-agent research system (2025)](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Walden Yan (Cognition): Don't Build Multi-Agents (2025)](https://cognition.com/blog/dont-build-multi-agents)
- [Walden Yan (Cognition): Multi-Agents: What's Actually Working (2026)](https://cognition.ai/blog/multi-agents-working)
- [Kim et al., Towards a Science of Scaling Agent Systems (2025)](https://arxiv.org/abs/2512.08296)
- [Tran & Kiela, Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets (2026)](https://arxiv.org/abs/2604.02460)
- [Cemri et al., Why Do Multi-Agent LLM Systems Fail? (2025)](https://arxiv.org/abs/2503.13657)
- [Wu et al., AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation (2023)](https://arxiv.org/abs/2308.08155)
- [Hong et al., MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework (2023)](https://arxiv.org/abs/2308.00352)
- [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/)
- [Model Context Protocol: Architecture (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/architecture)
- [Model Context Protocol: Server features (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/server/index)
- [Confluent: Message Delivery Guarantees for Apache Kafka](https://docs.confluent.io/kafka/design/delivery-semantics.html)
