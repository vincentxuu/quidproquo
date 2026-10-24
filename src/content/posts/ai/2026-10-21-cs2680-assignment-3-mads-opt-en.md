---
title: "Saving Money and Time Without Losing Tasks: A Cost-Optimization Competition | Harvard CS2680 Assignment 3"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, coding-agent, agent-harness, swe-bench, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 11
tldr: "CS2680 Assignment 3 (Mads-Opt) is a harness competition: on the same SWE-bench Pro tasks, who solves the most, spends the least per solved task, and waits the least per solved task. The three metrics aren't weighted into one score. Instead submissions are ranked in skyline (Pareto) layers: if nobody is at least as good as you on all three and better on at least one, you're rank 1. This post covers the container setup and hard limits, how ranking and scoring work (with a worked example), a first estimate of what one task costs using the model prices on the assignment page, and how Lecture 8's cost and speed levers map onto the assignment. No official solution and no specific strategies."
description: "Guide to Assignment 3 (Mads-Opt) of Harvard CS2680 Modern AI Systems (Fall 2026): agent and task containers, the sandbox HTTP API, evaluate and continue/done, five tasks at once and a 4-hour limit, prices for the Expert/Standard/Starter models, the $10-per-run and $30-per-day budgets, three-metric skyline ranking and max(81 − r, 50) scoring, and how Lecture 8's levers map onto the assignment. Based on the public assignment page, assignment slides, and starter files; no official solution."
draft: false
glossary:
  - term: "skyline (Pareto layers)"
    aliases: ["skyline", "Pareto frontier", "dominate", "dominates"]
    definition: "A way to rank when several metrics aren't combined into one score. A dominates B if A is no worse than B on every metric and better on at least one. The submissions nobody dominates form the first layer; remove them, repeat on the rest, and you get the second layer, and so on."
    context: "Assignment 3 ranks submissions in skyline layers over tasks solved, cost per solved task, and time per solved task."
  - term: "cost per solved task"
    aliases: ["cost per solved task"]
    definition: "Total money spent during the run divided by the number of tasks solved. Tasks you didn't solve also cost money, and that money still goes in the numerator."
    context: "One of Assignment 3's three metrics; time per solved task is divided by tasks solved the same way."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-assignment-3-mads-opt)

**Video status: The course is not recorded.** This post is based on the public assignment page, the assignment slides, and the starter files; the worked examples are this site's additions, not an official solution. [Source notes](#course-video-sources)

[Assignment 3](https://cs2680.com/assignments/assignment3) of [CS2680](https://cs2680.com/) is called Mads-Opt. It went out 10/5, was due 10/20, and is worth 20% of the grade. The Lecture 8 slides call it much harder than the earlier assignments and say to treat it like a midterm ([Lecture 8 p2](https://cs2680.com/slides/8_agent_design_5.pdf#page=2)). The assignments overview gives it the subtitle "Make every token count": the model is still a black-box API, everything around it is yours to optimize, and the goal is to keep task success where it is while pushing cost and latency down ([assignments overview](https://cs2680.com/assignments/)).

It follows [Assignment 2](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en) and [Lecture 8](/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness-en). In Assignment 2 you built a harness that runs on SWE-bench Pro, and only solving counted. Assignment 3 uses the same kind of tasks and adds two more rulers: how much you spent and how long you took. Lecture 8's cost breakdown, model routing, budget caps, and critical path each have a matching switch in this assignment.

The question this post answers: how are tasks solved, cost, and time ranked together, and how should you trade them off? By the end you should be able to compute the Pareto ranking of a set of submissions and list the first three optimizations your own agent should try.

Prerequisites: Assignment 2 and Lecture 8, and knowing that [Lecture 7](/posts/ai/2026-10-21-cs2680-lecture-07-agent-evaluation-en) said to look at cost and latency, not just success rate ([Lecture 7 p35](https://cs2680.com/slides/7_agent_design_4.pdf#page=35)). The Assignment 3 leaderboard closed on 10/20. You don't need to be enrolled to follow the ranking rules and the cost math; running the starter locally takes Linux x86_64, Docker, and about 15 GB of disk.

## What the assignment asks for

### Two containers, with only HTTP between them

Assignment 3 puts the agent and the task in separate containers ([assignment page, Part 0](https://cs2680.com/assignments/assignment3)):

- **Agent container**: runs your `src/`. The main loop, prompts, tools, subagents, and any memory carried across tasks live here. It has no internet; its only way out is a proxy to the course API.
- **Task container**: one per task, holding the task's repository at its starting commit plus the toolchain needed to run its tests. It has no network at all.

The two talk through a small HTTP server inside the task container with just four routes: `/health`, `/exec` (run a shell command in the repo), `/read`, and `/write`. The starter wraps it as `Sandbox(url, workdir)` with three methods: `exec`, `read_text`, and `write_text`. The page warns not to touch the repo with `open()` or `subprocess` in the agent container, because the repo isn't there. If you need a new tool, you can add a route to the server.

This differs from Assignment 2, where the agent ran commands directly inside the task container. In Assignment 3 every action is an HTTP request, so the time a step takes includes a round trip on top of the model's thinking.

### The evaluation result comes back to you

When the agent thinks it's done, it hands in a patch and asks for grading:

```python
dispatcher.extract_patch(k)    # take the task container's git diff as this task's patch
ev = dispatcher.evaluate(k)    # -> {"tests_failed": F, "tests_total": T, "attempt": a}
```

Grading applies your patch in a separate, clean container, runs the task's hidden tests, and tells you how many tests failed out of how many. Then you choose: `continue_task(k)` keeps the container and your edits so you can keep working and evaluate again later, or `done(k)` makes the task final, with its last evaluation as the result ([assignment page, Part 0](https://cs2680.com/assignments/assignment3)).

This is the biggest difference from Assignment 2: you can evaluate each task many times, and each time you get feedback from the hidden tests. Whether to try again, how many times, and when to give up is the strategy you design, and every attempt costs money and time.

The figure below redraws the assignment page's architecture diagram, keeping only the pieces one task passes through from opening to getting its evaluation back:

```flow-diagram
{
  "title": "One Assignment 3 task: open it, edit the repo, get it graded",
  "lang": "en",
  "width": 640,
  "height": 410,
  "caption": "Redrawn from the architecture figure in Part 0 of the Assignment 3 page. The facility also starts and removes task containers; that line is left out here.",
  "nodes": [
    {
      "id": "grp",
      "label": "agent container",
      "x": 285,
      "y": 145,
      "w": 210,
      "h": 230,
      "shape": "group"
    },
    {
      "id": "api",
      "label": "course API",
      "x": 70,
      "y": 90,
      "w": 100,
      "shape": "chip"
    },
    {
      "id": "agent",
      "label": "your agent\n(src/)",
      "x": 285,
      "y": 90,
      "w": 150,
      "tone": "accent"
    },
    {
      "id": "disp",
      "label": "dispatcher\nclient",
      "x": 285,
      "y": 205,
      "w": 150
    },
    {
      "id": "task",
      "label": "task container k\nsandbox_server, /app",
      "x": 540,
      "y": 90,
      "w": 170
    },
    {
      "id": "fac",
      "label": "facility\nrun_all.py",
      "x": 285,
      "y": 350,
      "w": 150
    },
    {
      "id": "grade",
      "label": "grading container\nhidden tests",
      "x": 540,
      "y": 350,
      "w": 170
    }
  ],
  "edges": [
    {
      "from": "disp",
      "to": "fac",
      "step": 1,
      "label": "next_task",
      "offset": 16,
      "labelAt": [
        253,
        285
      ],
      "labelSide": "left"
    },
    {
      "from": "agent",
      "to": "api",
      "step": 2,
      "label": "call\nmodel",
      "labelAt": [
        124,
        58
      ]
    },
    {
      "from": "agent",
      "to": "task",
      "step": 3,
      "label": "HTTP\nPOST",
      "labelAt": [
        402,
        58
      ]
    },
    {
      "from": "fac",
      "to": "grade",
      "step": 4,
      "label": "apply patch",
      "offset": 16,
      "labelAt": [
        400,
        386
      ]
    },
    {
      "from": "grade",
      "to": "fac",
      "step": 5,
      "label": "failed / total",
      "offset": 16,
      "labelAt": [
        368,
        320
      ]
    },
    {
      "from": "fac",
      "to": "disp",
      "step": 6,
      "label": "result",
      "offset": 16,
      "labelAt": [
        317,
        285
      ]
    }
  ],
  "steps": [
    "Through the dispatcher client, the agent calls next_task; the facility starts this task's task container and hands the task and its connection details to the agent",
    "The agent calls the model; the request goes through the egress proxy to the course API, the agent container's only way out",
    "The agent sends HTTP POSTs to sandbox_server inside the task container to run commands and read and write files in the repo at /app",
    "The agent hands in a patch and calls evaluate(k); the facility applies the patch in a separate, clean grading container and runs the task's hidden tests",
    "The grading container reports how many tests failed and the total number of tests",
    "The result goes back to the agent through the dispatcher, and the agent decides whether to continue_task and keep working or call done to finalize"
  ]
}
```

### What you can and can't change

| Item | Rule |
|---|---|
| What you can change | Everything under `src/`; the leaderboard takes only the `src/` you upload ([assignment page, Part 1](https://cs2680.com/assignments/assignment3)) |
| What you can't change | `dispatcher/`, `madsOpt.py`, and `evaluation_scripts/`, which are the same ones the leaderboard uses; the one exception is `dispatcher/student_name.json`, where you fill in your name |
| Models | Expert, Standard, and Starter ([assignment slides p4](https://cs2680.com/slides/8_assignment3.pdf#page=4)); one run can mix them freely ([assignment page, Part 1 Step 2](https://cs2680.com/assignments/assignment3)) |
| Tasks open at once | At most 5; a sixth is refused |
| Each evaluation | Up to 35 minutes, and a test suite that hangs counts as all tests failing; only one evaluation per task can run at a time |
| The whole run | Up to 4 hours, counted from the first task opened; when time runs out, open tasks are finalized as they stand and tasks never opened count as failures |
| Spending | $10 per submission and $30 per person per day; hitting either stops the run, and what finished by then counts |
| Tasks | 5 in the local starter, 26 on the leaderboard, all from a fixed version of SWE-bench Pro |

The starter's `Agent` only demonstrates each call: it opens one task at a time and hands it in without fixing anything, so a local run gets 0/5. The flow is entirely up to you: how many tasks to keep open, whether to work in parallel, when to evaluate, whether to retry a failing task or move on, and whether to carry anything from one task to the next.

Every model call and tool call has to be logged to the trace through `dispatcher.logger(k)`. The assignment page says the leaderboard reads each task's turn count from the trace (roughly how many times that task called the model) and shows it in each task's results on the Past submissions page. The starter's comments say cost is computed from the trace as well. The two don't quite agree, so the safe choice is to log every call.

> **Self-check**: Your agent has 5 tasks open and tries to open a sixth. What does `next_task()` do, and what does that mean for how you write the agent?
> Answer: It raises `DispatcherError`, and the sixth task isn't opened. The agent has to track how many tasks are open and open the next one only after one of them is `done`. It can't treat this exception as "no tasks left"; when no tasks are left, `next_task()` returns `None`.

## How the three metrics are ranked

### Three rulers, all divided by tasks solved

Each submission is measured on three numbers ([assignment page, Part 2 Step 4](https://cs2680.com/assignments/assignment3)):

1. **Tasks solved**.
2. **Cost per solved task**: what the course API account was charged during the whole run, divided by the number of tasks solved.
3. **Time per solved task**: the wall-clock time from the first task opened to the last task done (elapsed real time, not the sum of each task's time), divided by the number of tasks solved.

Both per-task metrics divide by tasks solved. Tasks you didn't solve still cost money and took time, and all of that goes in the numerator. Say a run spends $5 and solves 16 tasks: $0.31 per solved task. Spend another $1 on two hard tasks that still fail, and it becomes $6 ÷ 16 = $0.375. Spend that same $1 and solve one more task, and it's $6 ÷ 17 ≈ $0.35. Giving up too late makes two of the three numbers worse.

### Skyline: if nobody dominates you, you're rank 1

The three numbers aren't weighted into a single score. Submissions are ranked in layers instead ([assignment page, Part 2 Step 6](https://cs2680.com/assignments/assignment3)). The rules:

- Each student is ranked by their best submission.
- Submissions that solved at least 7 tasks are sorted into skyline layers over the three metrics. If A is no worse than B on all three and better on at least one, A **dominates** B. The submissions nobody dominates are layer 1; remove them, repeat on the rest, and you get layer 2.
- A rank counts everyone ahead of you, plus one: if layer 1 has three people, they are all rank 1, and anyone in layer 2 is rank 4 (1, 1, 1, 4).
- Submissions that solved fewer than 7 tasks rank below everyone else, ordered by tasks solved alone.
- A new submission replaces your best only if its rank is strictly better; on a tie, the old one stays.

The name "skyline" comes from databases: the [Skyline operator proposed by Börzsönyi and colleagues](https://doi.org/10.1109/ICDE.2001.914855) in 2001 keeps only the items that no other item dominates on every dimension. Lecture 7 drew the same picture when it covered evaluation, with layer 1 as the Pareto frontier; that figure shows only capability and cost, not time ([Lecture 7 p35](https://cs2680.com/slides/7_agent_design_4.pdf#page=35)).

### Working one out

A teaching example for this post; the numbers are made up. Three students' best submissions:

| Submission | Solved | Cost per solved task | Time per solved task |
|---|---|---|---|
| A | 20 tasks | $0.30 | 120 s |
| B | 18 tasks | $0.20 | 100 s |
| C | 17 tasks | $0.35 | 150 s |

- **A vs. C**: A solves more, is cheaper, and is faster. It wins on all three, so A dominates C.
- **B vs. C**: B also wins on all three, so B dominates C too.
- **A vs. B**: A solves more; B is cheaper and faster. Neither is no worse than the other on all three, so neither dominates.

So A and B form layer 1, both rank 1. C is in layer 2 with 2 people ahead of it: rank 3.

Now add D: 12 tasks, $0.10 per task, 90 seconds per task. D solves fewer than A and B but is cheaper and faster than both, so neither A nor B dominates D, and D dominates nobody. D joins A and B in layer 1, and C now has 3 people ahead of it, dropping to rank 4.

This shows one property of the skyline: if you solve at least 7 tasks and are the **sole** best on any one metric (nobody ties you there), you're always in layer 1. To dominate you, someone would have to be at least as good on that metric, and nobody is. A submission that solves few tasks but is extremely cheap or fast can be rank 1. Tying for best isn't enough, though. Take A at 20 tasks, $0.30, 120 s, and X at 20 tasks, $0.30, 130 s. X ties for best on tasks and on cost, but it's slower than A, so A dominates it and it lands in layer 2.

### Turning rank into points

The leaderboard is worth 80 points. With r as the rank of your best submission ([assignment page, Grading](https://cs2680.com/assignments/assignment3)):

- If any of your submissions reaches the baseline: score = max(81 − r, 50).
- Otherwise: score = 81 − r.

The baseline is "16 tasks solved within 4 hours and $10". The submission that reaches it doesn't have to be your best. The page's examples: rank 1 scores 80; rank 12 scores 69 whether or not it beats the baseline; rank 40 scores 50 if it beats the baseline and 41 if not.

In other words, the baseline only matters far down the list: once 81 − r drops below 50 (r above 31), it puts a floor of 50 under your score. Near the top, the skyline decides. In the example with only A, B, and C, A and B each score 81 − 1 = 80, and C scores 81 − 3 = 78.

> **Self-check**: Your best submission is A. You switch every call to the cheapest model, Starter. Cost drops a lot, but you solve 3 fewer tasks. Is your rank guaranteed to improve?
> Answer: No. It depends on whether, after the switch, someone is no worse than you on all three metrics. With fewer tasks solved, people you used to beat on task count may now be no worse than you on all three. Going the other way, if you become the sole cheapest submission (nobody matches your cost per task) and still solve at least 7 tasks, you're guaranteed layer 1. Also, a new submission replaces your best only if its rank is strictly better. If it isn't, your old A stays, but what this submission spent still comes out of that day's $30.

## Do the math first: roughly what one task costs

### Prices for the three models

The assignment page lists prices for the three models, per million tokens ([assignment page, Part 1 Step 2](https://cs2680.com/assignments/assignment3)):

| Model | Input | Cached input | Output |
|---|---|---|---|
| Expert (most capable) | $2.00 | $0.10 | $10.00 |
| Standard | $0.08 | $0.004 | $0.28 |
| Starter (cheapest) | $0.01 | $0.0005 | $0.04 |

For all three models, cached input costs 1/20 of regular input. Cached input means the start of this request matches an earlier request, so the server can reuse work it already did. [Lecture 2](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en) showed that an agent rereads the earlier context on every step, so whether that context hits the cache changes the bill a lot.

### The bill for a 40-step task

A teaching example for this post; the step count, token counts, and cache hit rate are all assumptions. One task runs 40 steps. Each step sends 30,000 tokens of context and gets 500 tokens back, and 90% of the input hits the cache:

- Input: 40 × 30,000 = 1,200,000 tokens, of which 1,080,000 are cached and 120,000 aren't.
- Output: 40 × 500 = 20,000 tokens.

| Model | Cached input | Regular input | Output | This task | 26 tasks |
|---|---|---|---|---|---|
| Expert | $0.108 | $0.240 | $0.200 | about $0.55 | about $14.25 |
| Standard | $0.0043 | $0.0096 | $0.0056 | about $0.02 | about $0.51 |
| Starter | $0.0005 | $0.0012 | $0.0008 | about $0.0025 | about $0.07 |

Under these assumptions, running all 26 tasks on Expert goes over the $10-per-submission cap, and the run gets stopped partway. On average you can spend $10 ÷ 26 ≈ $0.38 per task. With no cache hits at all, the same work on Expert costs $2.60 per task, nearly 5 times as much.

The table isn't saying "just use Standard for everything". A cheaper model may need more steps and solve fewer tasks, and fewer solved tasks means a smaller denominator for cost per solved task. The Lecture 8 slides also warn that cheaper can be slower ([Lecture 8 p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)). The point of the table is this: before changing anything, use your own trace to work out how many steps a task really takes, how many tokens each step sends, and how much hits the cache. Only then do you know whether the budget holds.

### Time has a cap too

26 tasks in 4 hours leaves 240 ÷ 26 ≈ 9.2 minutes per task. Work through them one at a time, and if the average goes past about 9 minutes, the last tasks never get opened and count as failures. You can keep up to 5 tasks open. In parallel, completion time is set by the longest path, not the sum of every step ([Lecture 8 p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)). Time per solved task uses wall-clock time in the numerator, so parallelism improves it by itself. The cost is that total tokens may go up ([Lecture 8 p29](https://cs2680.com/slides/8_agent_design_5.pdf#page=29)), and you spend money faster at any given moment, which makes the $10 cap easier to hit.

> **Self-check**: Under the assumptions above, you run all 26 tasks on Expert and the run stops when it reaches $10. By then it has solved 12 tasks. What are this submission's three metrics? Does it reach the baseline?
> Answer: 12 tasks solved; cost per solved task about $10 ÷ 12 ≈ $0.83; time per solved task is the wall-clock time until the stop, divided by 12. Twelve tasks is short of the baseline's 16, so this submission doesn't earn the baseline floor.

## How Lecture 8's levers apply here

Lecture 8 breaks cost into factors that multiply: turns per task, steps per turn, tokens per step, and price per token ([Lecture 8 p7](https://cs2680.com/slides/8_agent_design_5.pdf#page=7)). A "turn" in Lecture 8 is one exchange with a user. Assignment 3 has no user, so each task is a single turn, and what you can change is steps per turn, tokens per step, and price per token, plus time. That's a different thing from the turn count the leaderboard shows per task. The table maps Lecture 8's levers to switches in Assignment 3. It only says what each lever corresponds to and which number in the trace to look at; it doesn't say how to pull it:

| Lecture 8 lever | In Assignment 3 | First number to look at |
|---|---|---|
| Fewer steps | How many steps a task takes before you hand in a patch | Distribution of steps per task in the trace |
| Fewer tokens per step | Truncating tool output, dropping old output, compaction ([Lecture 4](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en)) | How prompt tokens per step grow with the step count |
| Caching | Keeping the start of every request unchanged ([Lecture 8 p21](https://cs2680.com/slides/8_agent_design_5.pdf#page=21)) | Cache hit rate (from the usage the API returns) |
| Model routing | Which model does what: pick up front, escalate on failure, or re-pick each step ([Lecture 8 p22](https://cs2680.com/slides/8_agent_design_5.pdf#page=22)) | Calls and spend per model |
| Per-task budget and stopping rules | How much money, how many steps, and how many evaluations a task gets; when to give up ([Lecture 8 p26](https://cs2680.com/slides/8_agent_design_5.pdf#page=26)) | Which evaluation solved tasks usually pass on, and what they cost |
| Critical path and parallelism | How many tasks to keep open (up to 5); working on another task while one is being graded | How much of the wall-clock time is spent waiting for evaluations and for the model |

To pick the first three to try, go in this order:

1. Run once locally and fill in the third column from the trace.
2. Work out this run's overall cost and minutes per task, compare them with the $0.38 per task and 9.2 minutes per task worked out above, and see which one is further over.
3. Under whichever is over, pick the three rows whose third-column numbers look most out of line. Those are your first three.

The choice rests on numbers from the trace, not on hunches.

A few things to keep in mind:

- **What makes routing hard**: the Lecture 8 slides point out that one planning mistake by a cheap model can waste many later actions ([Lecture 8 p22](https://cs2680.com/slides/8_agent_design_5.pdf#page=22)). What you save per token can be eaten by the extra steps.
- **Evaluation feedback is your stopping signal**: the failing-test count `evaluate` returns is the most direct progress signal in this assignment. One of the stopping rules Lecture 8 suggests is "no new passing test in N steps" ([Lecture 8 p26](https://cs2680.com/slides/8_agent_design_5.pdf#page=26)). The budget numbers on that slide are illustrative; set yours from your own traces.
- **Change one thing at a time**: the last slide of Lecture 8's cost section lays out a four-step loop ([Lecture 8 p38](https://cs2680.com/slides/8_agent_design_5.pdf#page=38)). Run and log everything, find where the money and time go, change one thing, and re-evaluate on the same tasks. That slide says it's a reminder for Assignment 4, but the same loop applies to Assignment 3. With $30 a day for the leaderboard, you get roughly three full-budget submissions, so most experiments have to happen on the 5 local tasks.

Researchers have also argued that agents should be evaluated on cost and accuracy together. The 2024 paper "[AI Agents That Matter](https://arxiv.org/abs/2407.01502)" points out that benchmarks focused only on accuracy push agents to be needlessly complex and costly, and argues for optimizing both. Assignment 3's three-metric ranking writes that argument into the grading rules.

> **Self-check**: On the 5 local tasks your agent solves 3. The trace shows one task passed only on its sixth evaluation, and another still failed after nine. Which lever should you look at first?
> Criterion: Say that you decide from the trace, and that these numbers point to "per-task budget and stopping rules": how much money and time the task that failed nine times consumed, and whether the failing-test count was going down between evaluations. If it wasn't, giving up earlier improves both cost and time per solved task. Answering "switch to a cheaper model" without looking at the trace doesn't count.

## What to submit and how it's graded

| What | Where |
|---|---|
| `src/` zipped as `src.zip` | Uploaded on the leaderboard's Submit page |
| Your Claude Code session files (`a3-sessions.tar.gz`) | `assignment3/` in the shared private course repository |
| A one-page write-up (`writeup.pdf`) | Same place |
| A 3-minute video | Uploaded to Canvas (the course's learning platform) |

Grading ([assignment page, Grading](https://cs2680.com/assignments/assignment3)):

- **Leaderboard, 80 points**: from the rank and formula in the previous section. The leaderboard doesn't accept late days (the course's allowance of extra days for late work); it closed at 23:59 on 10/20, and no submission means 0 points. Late days apply only to the repo and the video.
- **Write-up, 10 points**: one page answering three questions. The page requires it to be entirely your own work, with no AI-generated text.
  - The main components of your harness, for example subagents, memory carried across tasks, or which model does what.
  - The optimizations and trade-offs you made, for example when to give up on a failing task, or how many tasks to keep open.
  - The pitfalls you hit, and what helped you improve tasks solved, cost per solved task, or time per solved task.
- **Video, 10 points**: your face on camera and your own voice, covering the same lessons, with the code open and each component from the write-up pointed out.

The assignments overview says Assignments 3 and 5 are submitted as a published blog post, which differs from the PDF and video on the Assignment 3 page; this post follows the Assignment 3 page's grading table. The page also says reporting a security vulnerability can earn up to 3 bonus points on the final course grade, and abusing one forfeits that submission.

## Final self-check

1. Take the four best submissions from this post: A, B, and D at rank 1, C at rank 4. B submits again, and this time solves 21 tasks at $0.20 and 100 seconds per task. What are the four ranks now?
   Criterion: First rank the new submission. It's no worse than A on all three (21 > 20, $0.20 < $0.30, 100 s < 120 s), so it dominates A, and it dominates C as well. D solves fewer but is cheaper and faster, so the new submission doesn't dominate D. That makes the new submission rank 1. But B's existing best is also rank 1, so the rank isn't strictly better; on a tie the old one stays, and the new submission doesn't replace it. The ranks stay A, B, and D at 1, C at 4. The tie rule is the point of this question; if the new submission did count, A would drop to rank 3.
2. Why are cost and time per solved task divided by tasks solved rather than tasks opened? What does that push an agent to do?
   Criterion: Dividing this way spreads the money and time spent on unsolved tasks over the solved ones, so wasted work directly raises both metrics. It pushes the agent to judge whether a task is worth continuing and stop when there's no progress, rather than trying every task until the budget runs out.
3. Your agent works through tasks one at a time, averaging 12 minutes each. What happens in a 26-task run?
   Criterion: 26 × 12 = 312 minutes, more than 4 hours (240 minutes). Time runs out around task 20, and the tasks after that are never opened and count as failures. Either make each task faster or keep several open at once.
4. You run the 5 local tasks and pull these numbers from the trace: 34 steps per task on average, with prompt tokens per step growing from 4,000 to 60,000 and about 20% of input hitting the cache. Every call uses Expert, and half the wall-clock time is spent waiting for evaluations. Solved tasks all passed on their first or second evaluation; unsolved tasks averaged 7 evaluations. Using the lever table, which three rows are furthest from target? Give the number behind each.
   Criterion: This tests reading the trace and finding gaps, not how to fix them. Start with step 2 from the post and estimate the cost per task. With prompt tokens growing linearly from 4,000 to 60,000, 34 steps send about 1.09 million tokens. At a 20% cache hit rate, all on Expert, and assuming 500 output tokens per step, one task costs about $1.9, 5 times the $0.38 target. Money is over by 5 times, so look at the money-related rows first; half the wall-clock time goes to waiting for evaluations, so the time row belongs on the list too. A reasonable answer names these three rows:
   - Caching: only 20% of input hits the cache.
   - Per-task budget and stopping rules: solved tasks pass in 1–2 evaluations, but unsolved tasks take 7.
   - Critical path and parallelism: half the time is spent waiting for evaluations.

   Model routing or tokens per step are fine too, as long as the matching number comes with them. Naming a row without the number behind it doesn't count.

## Further reading

- [Assignment 2: building a coding agent harness by hand](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop-en): the starting point this assignment builds on.
- [Lecture 8: making agents cheap and fast](/posts/ai/2026-10-21-cs2680-lecture-08-cost-latency-harness-en): the full treatment of every lever in this post.
- [Learning from Mature Coding Agents (34): Telemetry and Cost Tracking](/posts/ai/2026-08-30-coding-agent-telemetry-cost-tracking-en): turning recorded tokens into numbers you can decide with.
- [Cutting Agent Token Costs Without Losing Tool Results or Skill Instructions](/posts/ai/2026-10-16-agent-token-cost-tool-results-en): what to keep and what to drop when clearing old tool output.
- [CMU 11-768 Assignment 2: writing a validator for an agent](/posts/ai/2026-09-29-cmu-11768-assignment-2-eval-en): how another course measures whether an agent is any good.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)). There's no recording to check the assignment against.
- Source: the [Assignment 3 page](https://cs2680.com/assignments/assignment3), the [Assignment 3 slides](https://cs2680.com/slides/8_assignment3.pdf), and the starter archive `assignment3.tar.gz` (`dispatcher.py`, `agentic_loop.py`, the task list), read on 2026-10-22. The ranking examples, cost estimates, self-checks, and flow diagram are this site's additions.

## References

- [CS2680 Assignment 3: Harness competition (Mads-Opt)](https://cs2680.com/assignments/assignment3)
- [CS2680 Assignment 3 slides: MadsOpt: Harness Competition](https://cs2680.com/slides/8_assignment3.pdf)
- [CS2680 assignments overview](https://cs2680.com/assignments/)
- [CS2680 Lecture 7 slides: Agent Design IV](https://cs2680.com/slides/7_agent_design_4.pdf)
- [CS2680 Lecture 8 slides: Agent Design V: cost-effective agents](https://cs2680.com/slides/8_agent_design_5.pdf)
- [CS2680 course note: Cost-effective agents](https://cs2680.com/notes/cost-effective-agents)
- [Börzsönyi, Kossmann & Stocker, The Skyline Operator (ICDE 2001)](https://doi.org/10.1109/ICDE.2001.914855)
- [Kapoor et al., AI Agents That Matter (arXiv 2407.01502)](https://arxiv.org/abs/2407.01502)
- [Deng et al., SWE-Bench Pro (arXiv 2509.16941)](https://arxiv.org/abs/2509.16941)
- [CS2680 course policy](https://cs2680.com/policy)
