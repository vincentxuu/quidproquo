---
title: "Agents Are a Systems Problem: From One Inference Call to a Chain of Tool Calls | Harvard CS2680 Lecture 1"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, ai-agent, agent-harness, llm-inference, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 1
tldr: "CS2680 Lecture 1 (2026-09-02) starts with how AI systems differ from traditional systems: computation is split across CPUs and GPUs, floating-point math doesn't give the same answer every time, and state is large enough that it has to move between GPUs. It then compares an agent to a new kind of computer (the LLM is the CPU, the context window is memory, the harness is the operating system) and shows that one agent request becomes a long chain of inference → tool → inference. That makes tokens per second the wrong target; what matters is task success rate, end-to-end latency, and cost per success. This post works through two agents' numbers to show how those metrics are used."
description: "Guide to Lecture 1 of Harvard CS2680 Modern AI Systems (Fall 2026): five ways AI systems differ, the definition of an agent and the new-computer analogy, the five-layer agent systems stack, why throughput is the wrong target, ten agent traits mapped to systems problems, and the nine questions the course sets out to answer. Based on the public slides."
draft: false
glossary:
  - term: "prefill / decode"
    aliases: ["prefill", "decode"]
    definition: "The two phases of generating a response: prefill reads the whole input in one pass, and decode generates the output one token at a time."
    advanced: "Prefill is bound by compute and decode is bound by memory bandwidth, so the same deployment hits different bottlenecks in different phases."
    context: "Lecture 1 only names them; CS2680 Part II goes into detail."
  - term: "$ / successful task"
    aliases: ["cost per successful task", "cost per success"]
    definition: "Total spend divided by the number of tasks completed successfully. Failed attempts still cost money, so an agent with a low success rate gets a higher number."
    context: "CS2680 uses it in place of tokens per second as the cost metric an agent should optimize."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-lecture-01-agents-systems-problem)

**Video status: The course is not recorded.** This post is based on the public slides; the numerical examples are this site's additions. [Source notes](#course-video-sources)

Lecture 1 of [CS2680](https://cs2680.com/) met on September 2, 2026, and was the course overview. The first half of the [slides](https://cs2680.com/slides/1_intro.pdf) covers the course and logistics, summarized in the [course overview](/posts/ai/2026-10-21-cs2680-course-overview-en). This post reads the two technical segments in the second half (p27–45): how AI systems differ from traditional systems, and why agents are a systems problem.

The lecture answers one question: why can't you judge an agent by how many tokens per second it generates, and what should you look at instead? By the end you should be able to take an agent task and name the systems problems it will run into, and compare two agents by cost per success. If your team is weighing a coding agent against its API bill, this lecture's metrics are the yardstick to use.

Prerequisites: knowing what an LLM and a token are is enough. The lecture drops a lot of serving terms that the course only explains in Part II; the first section ends with a short table that gives each one a single line on where it sits in the system.

## How AI systems differ from traditional systems

The slides first separate two kinds of problems (p28). AI/ML asks which model to use and how to design it; you write a Python script to solve a problem and aim for accuracy and capability. AI systems asks how to train and serve that model at scale; the goals are keeping GPUs busy (performance), not wasting resources (efficiency), not going down (reliability), and low carbon (sustainability). The course covers only LLM systems within that, and only inference, not training (p45 explains that inference dominates compute demand).

Five slides then lay out how LLM systems differ from traditional ones:

| Aspect | What the slides say | In plain terms |
|---|---|---|
| Compute (p30) | Tokenization, kernel launches, and tool calls run on the CPU, matrix multiplies on the GPU; GPU generations get mixed; prefill is compute-bound, decode is memory-bandwidth-bound; run time depends on output length | The same request gets stuck on different hardware at different moments, and you don't know in advance how long it will run |
| Nondeterminism (p31) | Floating-point addition isn't associative; a difference in the 7th decimal place can change the next token | The same input isn't guaranteed to give the same output, for reasons in the hardware and software layers |
| Memory and communication (p32) | Weights range from GBs to TBs; KV cache is tens to hundreds of KB per token; multiple GPUs rely on NCCL, NVLink, and RDMA to move data | State is too big for one card, and moving data is itself the bottleneck |
| Pace of change (p33) | Attention keeps changing, from MHA to GQA to MLA; workloads shift from multi-turn chat to reasoning, RAG, and agents | Systems have to change along with the models and how they're used |
| Reliability and power (p34) | A 16K-GPU cluster loses about one GPU every 3 hours; a single GPU draws 700–1000W | At scale, hardware failure is the norm, not the exception |

The nondeterminism row is the least intuitive, and you can try it yourself. Change the order of floating-point additions and the result can change:

```python
>>> (0.1 + 0.2) + 0.3
0.6000000000000001
>>> 0.1 + (0.2 + 0.3)
0.6
```

When a GPU does a matrix multiply, the order in which thousands of numbers get summed depends on how threads are scheduled, how big the batch is, and which kernel runs. Change the order and the last few decimal places change too. Usually that doesn't matter. But when the model is choosing between two tokens with almost the same probability, it can tip the choice to a different word, and the rest of the output diverges from there. The slides sort the sources into three layers: runtime (scheduling, batch size), software (fused multiply-add, autotuning), and hardware (CUDA cores vs. tensor cores, low-precision formats across GPU generations) (p31). The slides also note that this kind of approximate arithmetic is generally acceptable. It isn't a bug to fix; it's a condition to assume when you design an agent.

These terms come up in this lecture but only get covered in Part II. For now, just remember which layer each one lives in:

| Term | One line | Layer |
|---|---|---|
| prefill / decode | The model first reads the whole input in one pass (prefill), then generates one token at a time (decode) | serving |
| KV cache | Intermediate results left by every token the model has read, stored so the next step doesn't recompute them | serving |
| prefix cache | When several requests start the same way, they share the KV cache already computed for that part | serving |
| tensor / pipeline / expert parallelism | Ways of splitting a model across multiple GPUs when it doesn't fit on one | serving and runtime |
| NCCL, NVLink, RDMA | Libraries and hardware links for moving data between GPUs and between machines | runtime and hardware |
| MHA, GQA, MLA | Attention designs that differ in how much KV cache they need to store | model architecture |
| TTFT / TPOT | How long until the first token appears / the gap between each token after that | serving latency metrics |

For the details now, this site's [CMU 11-868: KV cache and serving at scale](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en) is the most complete.

> **Self-check**: You send the same prompt twice with temperature set to 0 and get different answers. What could cause that?
> What to look for: it isn't necessarily the model itself; a change in batch size or kernel can change the order of floating-point sums. Temperature 0 removes sampling randomness, not differences in the order of computation.

## What an agent is, and why you need one

The slides define an agent as an autonomous software system that uses an AI model to reason about a goal, use external tools, and take multiple steps until the task is done (p36). It has five steps:

1. **plan**: break the task into substeps.
2. **act**: call external tools (APIs, databases).
3. **observe**: interpret what the tools return.
4. **adapt**: revise the plan based on the new information.
5. **deliver**: hand over the final result.

Why wrap the model in this layer? Because an LLM is a strange computer, very strong and very weak at once (p37, citing [Andrej Karpathy's talk](https://www.youtube.com/watch?v=LCEmiRjPEtQ&t=874)). It beats most people at knowledge, language, pattern matching, and writing code. Its weaknesses: it doesn't remember what happened last time, its grasp of context is unreliable, it hallucinates, it doesn't know what it doesn't know, and malicious input can lead it astray. On this post's reading, an agent's tools and memory exist to cover those weaknesses.

The slides then compare an agent to a new kind of computer (p38):

| Traditional computer | Agent |
|---|---|
| CPU | LLM |
| Memory (RAM) | context window |
| Peripherals | tools |
| Operating system | agent harness |
| Applications | agent |

The key line on the slide: an LLM isn't just a smarter CPU; it's a computer that is programmed differently and breaks differently. Extending the analogy (this post's reading, which the rest of the series will keep borrowing), the harness does an operating system's job: it decides what goes into "memory" (context), which program can touch which "peripheral" (tool permissions), and what happens when memory fills up (compaction).

> **Self-check**: Under this analogy, when the context window fills up and the harness summarizes old conversation, what does that resemble on a traditional computer? How is it different?
> Answer: it's like moving data out of RAM when memory runs short (swap). The difference is that swap brings data back exactly, while summarizing is lossy compression, and the details that get summarized away don't come back. That's why an agent "forgets" a filename after context compaction.

## Why agents are a systems problem

A typical LLM service is one round trip: request → inference → response. One agent task is a long chain: inference → tool → inference → tool → retrieval → inference…, with a critical path that crosses GPUs, CPUs, storage, the network, and external services (p39). The slides list six problems this chain brings:

- Steps depend on each other; the next step waits for the previous one's result.
- Latency varies widely from step to step; running the tests once might take seconds or minutes.
- The model has to stop and wait for tools.
- State (the context) keeps growing.
- Work can run in parallel or ahead of time (guessing what the next step will need, for example), but a wrong guess is wasted work.
- Any step along the trajectory can fail.

Put all this back into the full system and you get the five-layer stack from the course overview (p40), top to bottom:

1. Application / user
2. Agent / harness: planning, context, memory, tools, subagents (Part I)
3. Model serving: batching, scheduling, routing, caching (Part II); external tools (web, files, APIs, people) sit alongside it, and the harness calls both
4. Runtime / kernel: CUDA, Triton, collective communication
5. Hardware: GPU, CPU, memory, network, storage

The right side of the diagram is labeled co-design: the agent, serving, and hardware layers are meant to be designed together. Our reading is that this warns against optimizing one layer alone, since another layer often eats the gain.

A chain this long also makes visibility a first-class problem (p43). Traditional distributed systems use traces to follow one request through the services it touches. An agent's trace becomes a set of nested trajectories:

- session
  - one conversational turn
    - agent step
      - model request, tool call, tool result, or a newly spawned subagent

As the slides put it, you can't optimize what you can't see. The interface [Assignment 1](https://cs2680.com/assignments/assignment1) asks you to build is a way to draw this tree.

> **Self-check**: Why isn't "latency per request", the usual measure for an LLM service, enough to describe an agent's latency?
> What to look for: one agent task contains many model requests and tool executions that depend on each other. What the user experiences is the end-to-end time of the whole chain; a fast single request doesn't mean a fast task.

## What to optimize: from tokens per second to cost per success

The title of this slide states the conclusion: throughput is the wrong target for agents (p41). What an agent should maximize is task success rate, subject to constraints on latency, cost, resources, reliability, and safety. The slide splits metrics into two columns:

| Useful but not enough | What to actually optimize |
|---|---|
| Time to first token, time between tokens | Task success rate / accuracy |
| Tool call latency | End-to-end latency |
| GPU utilization | Tokens per task |
| | **Cost per success (\$ / successful task)** |
| | **Energy per success** |

The slide's warning: an agent with higher tokens per second can still be slower and more expensive.

### Doing the math: two agents' numbers

The following is a teaching example for this post; the numbers are made up.

You're comparing two bug-fixing agents, each run on 100 tasks:

- **Agent A**: averages \$0.50 per task, succeeds on 60.
- **Agent B**: averages \$0.80 per task, succeeds on 90.

Looking only at cost per task, A is 37.5% cheaper. Switch to cost per success:

- A: \$0.50 × 100 ÷ 60 ≈ \$0.83
- B: \$0.80 × 100 ÷ 90 ≈ \$0.89

A is still slightly cheaper, but the gap shrinks from 37.5% to about 6%. The reason to look at cost per success is simple: failed attempts still cost money, so the denominator shrinks and the unit price goes up.

Go one step further: failed tasks don't just disappear; someone has to take them over. Add human takeover to the total for 100 tasks, assuming each failed task takes an engineer 15 minutes and costs \$25:

- A: 40 failures × \$25 = \$1,000, plus \$50 for the agent itself, \$1,050 in total.
- B: 10 failures × \$25 = \$250, plus \$80 for the agent itself, \$330 in total.

The conclusion flips: B's total cost is about a third of A's. The 30 extra tasks A fails add \$750 in human labor. This matches how the slides frame the goal, as "maximize success rate under cost constraints" rather than simply driving cost down: the success rate is itself part of the cost.

### Doing the math: why batching can make an agent slower

The first question on the slide's list of course questions is: why does batching improve throughput but hurt agent latency (p44)? Here's one way to think about it (a teaching example for this post).

Most serving systems today use continuous batching: instead of waiting to fill a batch, requests join the running batch as they arrive. The cost shows up elsewhere: the more requests processed at once, the slower each decode step gets. Suppose a server, to keep its GPU busy, raises the number of concurrent requests from 8 to 64, and the time to generate each token goes from 20 ms to 35 ms:

- Tokens per second for the whole machine: 8 ÷ 0.020 = 400 becomes 64 ÷ 0.035 ≈ 1,829, about 4.6 times as many. That's the side where throughput looks great.
- Each individual request is 15 ms slower per token. If an agent's model call generates 100 tokens, that's 1.5 seconds more.

A normal chat user just waits those extra 1.5 seconds once. An agent that calls the model 30 times waits every time: 30 × 1.5 = 45 seconds. All 45 seconds land on the critical path, because the next step can't start until the previous one returns. How continuous batching is scheduled to balance both sides is a Part II topic.

> **Self-check**: In the example above, if each agent call generates only 20 tokens, how much extra waiting do 30 calls add?
> Answer: 20 × 15 ms = 0.3 seconds per call, 9 seconds over 30 calls. The shorter the output, the smaller the latency cost of batching, which is why Lecture 8 later teaches you to cut output tokens per step.

> **Self-check**: An agent switches to a more expensive model. Cost per task goes from \$0.40 to \$0.60, and the success rate from 50% to 80%. Does cost per success go up or down?
> Answer: down. \$0.40 ÷ 0.5 = \$0.80, \$0.60 ÷ 0.8 = \$0.75.

### Common misconceptions

- **"High GPU utilization means a good agent"**: on the slide, utilization is in the "useful but not enough" column. In the batching example above, utilization went up and the agent waited 45 seconds longer.
- **"Temperature 0 gives the same output every time"**: temperature only controls sampling; differences in the order of floating-point sums remain (see the first section).
- **"Twice-as-fast inference means twice-as-fast tasks"**: task time also includes tool execution and waiting, and only the model part gets faster (see question 2 of the final self-check).

## Which systems problems agent traits map to

The slides map each trait of agent workloads to a systems problem the course studies (p42):

| Agent trait | Systems problem | Where this series covers it |
|---|---|---|
| Long trajectories | State and context management | Lectures 2, 4 |
| Large contexts | Memory hierarchy and retrieval | Lecture 6 |
| Repeated prefixes | prefix caching | Lecture 8, Part II |
| Branching reasoning | speculative execution | Lecture 8, Part II |
| Dependencies between tools | Dependency-aware scheduling | Lectures 5, 8 |
| Multiple models in use | routing | Lecture 8, Part II |
| Variable tool latency | Asynchronous execution | Lecture 8 |
| External side effects | Safety and isolation | Lecture 4 (shell risks) |
| Multiple agents | Orchestration and communication | Lectures 3, 5 |
| Long-running tasks | Checkpointing and fault tolerance | Lecture 6 |

### Walking through it: the problems an agent fixing a flaky test runs into

The following is a teaching example for this post. You ask a coding agent to fix a test that passes sometimes and fails other times (a flaky test). It runs for half an hour, about 40 steps: reading code, editing files, rerunning the tests to confirm. Against the table:

- **Long trajectories** → after 40 steps the context is nearly full, and the harness has to decide which old results to compress. If it compresses the wrong ones, the agent forgets causes it already ruled out and checks them again.
- **Repeated prefixes** → all 40 model calls start with the same system prompt and tool descriptions. If the serving side can reuse that part (prefix caching), both cost and latency drop.
- **Variable tool latency** → one test run might take 5 seconds or 3 minutes. If the model just waits, the whole task is held up by the slowest run.
- **External side effects** → the agent runs shell commands. Without isolation, one wrong delete command touches real files.
- **Long-running tasks** → the network drops at step 35. Without a checkpoint, the previous half hour starts over.

None of these five problems is "the model isn't smart enough". The same model can produce very different results inside a system that handles them well and one that doesn't. That's what the course means when it says agents are a systems problem.

> **Self-check**: A flight-booking agent has to check prices at three airlines and then book for the user. Which two rows of the table does it most obviously hit, and how does each one break?
> What to look for: at minimum, "variable tool latency" (the three lookups take different times; querying them one after another gets held up by the slowest, so query them in parallel) and "external side effects" (booking actually charges money, so there needs to be a confirmation or a way to undo it). "Long-running tasks" or "dependencies between tools" also count if you explain why.

### The nine questions the course sets out to answer

Next, p44 lists nine questions you should be able to "answer quantitatively" by the end of the course:

1. Why does batching improve throughput but hurt agent latency?
2. When should an agent use a large model?
3. Where should KV/prefix state live?
4. How should requests from the same agent be scheduled?
5. Can tool calls overlap with inference?
6. When should you spawn a subagent?
7. How do you route across different GPUs and models?
8. If an agent fails 30 minutes in, how do you recover?
9. How do you optimize cost per success instead of tokens per second?

Going by the schedule, Part I mostly touches the harness side of questions 2, 5, 6, and 9; most of the rest is in Part II. p45 states that the course does not cover training, model architecture design, communication, power, or new hardware.

## Final self-check

1. Your team says, "We raised GPU utilization from 60% to 90%, so the agent got better." Which two numbers do you ask for?
   What to look for: at minimum, task success rate and end-to-end latency (or cost per success). On the slide, GPU utilization is in the "useful but not enough" column.
2. An agent task calls the model 20 times and runs a tool between each call. If model inference gets twice as fast, does the task time halve?
   Answer: no. Tool execution and waiting time don't change; only the model part gets faster. How much you save depends on the model's share of the whole critical path.
3. Why do the slides compare the harness to an operating system rather than an application?
   What to look for: the harness manages resources and permissions (what goes into context, which tools can be used, what happens when it fills up), and the application (the task the agent is trying to complete) runs on top of it.

## Further reading

- [CMU 11-768 Lecture 1: What is an agent](/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent-en): defines agents from a research angle, complementing this lecture's systems angle.
- [CMU 11-868: Why we need LLM systems](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems-en): the same question as this lecture's first section, from another course's angle.
- [CMU 11-868: LLM serving with SGLang and vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en): how continuous batching works in practice.
- [Inside a coding agent](/posts/ai/2026-08-16-cs146s-agent-internals-en): see what an agent loop looks like in code before reading Lecture 2.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy): "the lectures will not be recorded").
- Source: [Lecture 1 slides](https://cs2680.com/slides/1_intro.pdf) (PDF pages p27–45), read on 2026-10-21. The page number printed in the lower right of each slide is one higher than the PDF page order; this post always cites PDF page order.
- The two cost examples and the batching example are this site's additions, not lecture content.

## References

- [CS2680 Lecture 1 slides: Course overview](https://cs2680.com/slides/1_intro.pdf)
- [CS2680 course homepage and schedule](https://cs2680.com/)
- [CS2680 course policy](https://cs2680.com/policy)
- [Andrej Karpathy: Software Is Changing (Again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ) (cited on slide p37)
- [CS2680 Assignment 1: Mads-Lens](https://cs2680.com/assignments/assignment1)
