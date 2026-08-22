---
title: "Stanford CS336: The Lectures Are Runnable Python, and From Assignment 2 On You Pay for the GPUs"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs336, ai-course, stanford, llm, gpu, self-study]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 17
tldr: "Of the seventeen regular CS336 lectures, only nine are executable Python programs; the other eight are PDF slide decks — and the split falls exactly along the two instructors. Assignment 1's handout carries eight 'Low-Resource Tips' for finishing it on a laptop. Assignments 2 through 5 carry none. The course page lists the hourly price of a B200; the handouts list how many B200 hours each problem needs."
description: "A deep read of Stanford CS336: Language Modeling from Scratch, based on the Spring 2026 course site, the lecture_01.py source, five assignment repos with their PDF handouts, the leaderboard repos and the course AI policy: what an executable lecture actually looks like, where the five assignments break in two, how to compute the GPU bill yourself, and what a self-learner gets from a course that requires an application."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)

[CS336: Language Modeling from Scratch](https://cs336.stanford.edu/) is a five-unit course taught by [Tatsunori Hashimoto](https://thashim.github.io/) and [Percy Liang](https://cs.stanford.edu/~pliang/). You start from raw bytes and build the whole pipeline yourself: tokenizer, Transformer, GPU kernels, multi-machine parallelism, scaling laws, data cleaning, post-training. The course page states the model it copies — the systems class where you write an operating system over a semester, with the operating system swapped for a language model.

In the full [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en) it is the only course marked **Application required**, and the only one you cannot finish without spending money. The map post already placed it on the ladder. This post is about what happens once you're inside.

What went into this: the Spring 2026 course site, the source of `lecture_01.py`, the GitHub repo and PDF handout for each of the five assignments, four leaderboard repos, the course AI policy document, and the ExploreCourses and Stanford Online entries. It does **not** include watching the lectures end to end — that is a different order of work. What follows is what the written material can prove.

## The hard facts

Spring 2026 was the third offering: Monday and Wednesday afternoons in Skilling Auditorium, three TAs. The ExploreCourses entry reads `Terms: Spr | Units: 3-5`, lists the next offering under **Spring 2026–2027**, and says outright: "Application required, apply at http://cs336.stanford.edu/".

One line from the prerequisites has been quoted to death, but it is still on the course page, under "Proficiency in Python":

> Unlike most other AI classes, students will be given minimal scaffolding. The amount of code you will write will be at least an order of magnitude greater than for other classes.

Two neighboring sentences get quoted far less. One: "A significant part of the course will involve making neural language models run quickly and efficiently on GPUs across multiple machines" — the systems half is not a garnish. The other closes the paragraph in bold: "Note that this is a 5-unit class. This is a very implementation-heavy class, so please allocate enough time for it."

Worth noting in passing: the official pages disagree with each other. The course page says "this is a 5-unit class"; the units column on [ExploreCourses](https://explorecourses.stanford.edu/search?q=CS+336&view=catalog) says 3-5. The [Stanford Online](https://online.stanford.edu/courses/cs336-language-modeling-scratch) distance version gives a third set of numbers, collected in the appendix.

For how heavy the workload actually is, the course quotes a student evaluation at itself. The line lives in the `course_logistics()` function of `lecture_01.py`, attributed to the Spring 2024 course evaluations:

> The entire assignment was approximately the same amount of work as all 5 assignments from CS 224n plus the final project. And that's just the first homework assignment.

Lecture 1 also has a section titled "Why you should not take this course," with three entries. You need research results this quarter — go talk to your advisor. You want to learn the newest, hottest AI techniques — take a seminar. You want good results in your own application domain — just prompt or fine-tune an off-the-shelf model.

## "From scratch" isn't a slogan — the scaffolding is gone in four places

In most courses, "from scratch" applies only to the starter code. CS336 pushes it into four places, which are the next four sections of this post: **the lectures are programs**, **AI may not write your code**, **the assignments give you tests instead of skeletons**, and **you buy your own compute**.

The honor code section closes the last door. It first grants that finished implementations are all over the internet, then states that the course materials are self-contained, so you have no need to consult third-party code. The conclusion: unless a handout says otherwise, you should not look at any existing implementation. That chain of reasoning is the whole course in miniature — it takes on the burden of making the materials self-contained first, which is what earns it the right to impose the rule.

## The lectures are runnable programs — nine of them

The [lecture repo](https://github.com/stanford-cs336/lectures) currently sits at 3,649 stars, essentially unchanged from the count this site's map post recorded a day earlier. Forks, last-push time and access date are in the appendix.

The feature everyone mentions is the "executable lecture." The definition is the course's own, in the `what_is_this_program()` function of `lecture_01.py`:

> This is an *executable lecture*, a program whose execution delivers the content of a lecture.

Here is what that looks like. `lecture_01.py` runs 762 lines; `main()` calls `welcome()`, `why_this_course_exists()`, `course_syllabus()`, `tokenization()` in sequence, and each of those functions is a run of `text("...")`, `image(...)` and `link(...)` calls. A slide is a function call, and the lecture's outline is the call stack.

The real departure from slides comes when the lecture reaches code. The same file holds a working `BPETokenizer` class, a `merge()` function, a `get_compression_ratio()` that computes compression ratios — and, crucially, the comments at the ends of lines:

```python
def merge(indices: list[int], pair: tuple[int, int], new_index: int) -> list[int]:
    new_indices = []  # @inspect new_indices
    i = 0  # @inspect i
    while i < len(indices):
        ...
```

`# @inspect` marks a variable for the tracer, which then shows its value at every step in the browser; `# @stepover` tells the tracer not to descend into a call. So when you read the BPE section on the web, you are not looking at a before/after diagram of a merge — you are watching that list get merged away one step at a time. The lecture's `link(Tokenizer)` even points at the class in the same file.

How to run it is in the repo README and in the [edtrace](https://github.com/percyliang/edtrace) docs: `python -m edtrace.execute -m lecture_01` produces `var/traces/lecture_01.json`, which the edtrace frontend renders. edtrace is Percy Liang's own tool; the README says it was "primarily designed for making executable lectures" but works on any Python program. The rendered output lives on the course domain, at URLs of the form `https://cs336.stanford.edu/lectures/?trace=lecture_01`.

**Here is the part that secondhand summaries almost always miss: only nine of the seventeen regular lectures are executable. The other eight are PDF slide decks.** In the repo, `lecture_01/02/06/07/10/12/13/14/17` are `.py` files and `lecture_03/04/05/08/09/11/15/16` are `.pdf`. Map those two sets back onto the Spring 2026 schedule and the line is exact: all nine `.py` files are Percy Liang's sessions, all eight PDFs are Tatsunori Hashimoto's.

So "CS336's lectures are executable Python" is half true. Architectures and hyperparameters, attention alternatives and MoE, GPUs and TPUs, one of the parallelism sessions, both scaling law sessions, SFT/RLHF, RLVR — for those you get a PDF. The course materials do not explain why the split falls this way.

## A course about building language models, where language models may not write your code

The Spring 2025 honor code went as far as "we strongly encourage you to disable AI autocomplete in your IDE." The Spring 2026 version adds "See the AI policy," linking to a [standalone policy document](https://docs.google.com/document/d/1SZAlExB1qAc9izHt54gwunNpjKE6wXb8Y7yA_e-baK8). It opens like this:

> AI is able to solve many parts of the assignments fully autonomously. This makes it harder to deeply engage with and learn from the course material. All your code should be handcrafted by you directly.

The line the policy draws: asking about concepts and looking up APIs is fine, writing code is not. It says explicitly that this covers both coding agents (Cursor Agents, Codex, Claude Code) and AI autocomplete (Cursor Tab, GitHub Copilot), and that **it applies to the leaderboards too**.

The enforcement mechanism is the interesting part. The policy requires every assignment repo to ship an `AGENTS.md` containing a teaching-oriented system prompt. A coding agent entering the repo picks it up automatically, and the file "may not be modified in any way." If you use a web chat interface instead, you paste the whole `AGENTS.md` at the start of every conversation.

I checked all five assignment repos: `AGENTS.md`, plus a byte-identical `CLAUDE.md`, is present in every one. The content is a role definition written for an agent, and the first item on the `SHOULD NOT` list is "Write any python or pseudocode," followed by no editing code in the student's repo, no running bash commands, no pointing the student at third-party implementations. It even scripts a sample exchange: the student says something like "I think my causal mask is broken, just tell me what's wrong," and the modeled answer is "my role is to guide you toward understanding rather than give you the answer directly — what have you tried so far?"

The policy closes with a test that beats any bulleted list: **ask yourself whether a TA would do this for you if you made the same request in office hours.** If not, the request probably isn't allowed.

## The five assignments, one at a time

The course page describes the assignments in a sentence each, but every one has its own public repo, with starter code, unit tests and a PDF handout; four of the five repos carry an MIT license. Open the handouts and you find out what each one actually involves:

| Assignment | What you implement | Compute the handout lists |
|---|---|---|
| [1. Basics](https://github.com/stanford-cs336/assignment1-basics) | BPE tokenizer, Transformer, cross-entropy and AdamW, training loop; training on TinyStories and OpenWebText | 17 B200 hours summed problem by problem |
| [2. Systems](https://github.com/stanford-cs336/assignment2-systems) | Profiling toolchain, activation checkpointing, a Triton kernel for FlashAttention2, DDP, optimizer state sharding, FSDP | Up to 6 GPUs; the leaderboard uses 2 B200s |
| [3. Scaling](https://github.com/stanford-cs336/assignment3-scaling) | Submitting experiments to a training API, fitting IsoFLOP curves, extrapolating the compute-optimal model size and hyperparameters | A hard 12 B200 hours enforced by the API |
| [4. Data](https://github.com/stanford-cs336/assignment4-data) | HTML-to-text on Common Crawl, harmful-content and PII filtering, MinHash deduplication, data mixing | One training run of about 2 hours on 8 B200s |
| [5. Alignment and Reasoning RL](https://github.com/stanford-cs336/assignment5-alignment) | Prompting variants, GRPO, variance reduction and importance weight clipping for policy gradients, off-policy GRPO | 26 B200 hours summed problem by problem |

A few things only the handouts reveal.

**Assignment 5 became pure RL in 2026.** Its handout is titled "Reasoning RL," and the required portion is prompting and GRPO on GSM8K with a 1B OLMo-2 model, then comparing variants: RFT, Dr. GRPO, MaxRL. SFT, DPO and safety alignment moved into a **fully optional** supplementary handout. So the common line that "the course ends with SFT and RLVR" is, in 2026, only half required.

**Assignment 3 has a different shape from the other four.** It does not ask you to train a large model. You send experiments to the course's training API, get validation losses back, fit a scaling law through those points, and extrapolate the compute-optimal model size. The binding constraint is the quota: **your experiments get 12 B200 hours in total, and past that the API refuses your requests.** The quota settles dynamically — reserved time you don't use is refunded, while a run killed for going over is billed at the full reserved amount. This is the assignment that most resembles an actual research lab: what stops you isn't whether you can write the code, it's how well you plan the experiment schedule.

**Assignments 1 and 2 both have public leaderboards.** [The first](https://github.com/stanford-cs336/assignment1-basics-leaderboard) competes on OpenWebText validation loss, capped at 45 minutes on a single B200. [The second](https://github.com/stanford-cs336/assignment2-systems-leaderboard) competes on the time for one full training step of an 8B model; the organizers say "we expect submissions to beat the naive baseline of 10 seconds" — the current leader is around a quarter of that. Full rules and current numbers for both are in the appendix.

## The break comes at Assignment 2, and the evidence is in the handout's layout

Assignment 1's handout answers the "which one is the break" question itself. Near the top it drops a blue box:

> Throughout the course's assignment handouts, we will give advice for working through parts of the assignment with fewer or no GPU resources.

The box is called a "Low-Resource Tip," and Assignment 1's handout has eight of them. They tell you to train the tokenizer on the TinyStories validation split as a debug dataset, to swap the device string to `mps` on Apple Silicon, to cut the token count you process while relaxing the target loss to match. One of them supplies the most persuasive number in the whole handout: with the TA solution code, on an M4 Max laptop, **under five minutes** gets you a language model that writes fluent text.

**Then I searched the handouts for assignments 2, 3, 4 and 5: "Low-Resource Tip" appears zero times.** That promise — "throughout the course's assignment handouts" — was kept in exactly one of them.

Look instead at the hardware Assignment 2 asks for and the gap gets sharper. The profiling section alone says "Resource requirements: Up to 6 GPUs," and every DDP and optimizer-state-sharding problem specifies a "1 node, 2 GPUs" setup. There is no downgrade path here — you cannot measure how much time all-reduce takes on a CPU.

Fork counts point the same way: Assignment 1's repo has 2,686 forks, Assignment 2 a little over a quarter of that. **But a fork is not a completion**, and the course publishes no completion data, so this is corroboration, not proof. The hard evidence is that the blue boxes appear only in the first handout.

The conclusion is simple: **Assignment 1 really can be finished on a laptop, and Assignment 2 cannot.** If all you want is to find out whether you understand Transformers, finishing Assignment 1 already means hand-writing the tokenizer, the model, the optimizer and the training loop — at zero cost. Go any further and the money in the next section is unavoidable.

## The GPU bill: prices on the course page, hours in the handouts

The course has a section called "GPU compute for self-study," written directly at people not enrolled. It lists public per-hour prices for a single B200 from five cloud providers, with the date the prices were read; the cheapest, RunPod, is **$4.99** an hour. The other four, plus the sponsor offering free credits, are in the appendix. The advice in the same section: debug correctness on CPU first, then spin up a GPU for training runs or performance measurements.

The comparison worth making is against [the same section in Spring 2025](https://cs336.stanford.edu/spring2025/), which listed H100 80GB prices starting at $1.99 an hour. In one year the course's baseline hardware moved a generation, and the floor price more than doubled.

The hours are in the handouts. CS336's handouts have an unusual habit: **every problem that needs a GPU states its compute budget in parentheses in the problem title** — things like `Problem (leaderboard): Leaderboard (10 B200 hrs)` and `Problem (layer_norm_ablation): Remove RMSNorm and train (0.5 B200 hrs)`. So nobody has to estimate the budget for you. Add up the numbers in the handouts and multiply by the prices the course page lists. The full arithmetic is in the appendix; the result: **the four handouts that state hours come to 71 B200 hours** (Assignment 2 states none and is excluded), which at the course page's price range lands somewhere north of four hundred dollars — assuming you get everything right the first time and never re-run.

Two caveats you need. First, Assignment 3's quota is covered by the course's training API for enrolled students; self-learners buy it themselves. Second, Assignment 2 has no hour cap because it competes on speed rather than volume — but it wants up to six GPUs online at once, which is a different kind of bill.

## An application is required, but the materials are all public

The Stanford Online page is blunt about why: "Due to high compute requirements for this class and high workload, we unfortunately have to limit enrollment." Compute and staffing are finite, so enrollment is capped, direct registration isn't accepted, and every applicant goes onto a waitlist.

Which means the gate exists for capacity reasons, not secrecy — entirely consistent with how the course treats outsiders. `course_logistics()` in Lecture 1 has a section called "How you can follow along at home," and it says: all lectures and assignments will be public, feel free to follow along.

So "can't get in" and "can't learn it" are separate things here. Three things are out of reach: Gradescope grading, the Slack channel and office hours, and the course's sponsored compute.

And the most surprising item: **the leaderboards are open to outsiders.** The first paragraph of Assignment 1's leaderboard README addresses non-Stanford students — submit to the second table, and staying in the top five means accepting verification: invite TA Marcel Rød into a minimal repo containing only `pyproject.toml`, `uv.lock` and `main.py`, and let him confirm that `uv run main.py` reproduces the result on a single B200. The prize is stated plainly: "the external top 3 submissions will receive a T-shirt."

This is not hypothetical. The 2025 offering's "Global leaderboard" collected a batch of outside submissions, with affiliations including the University of Helsinki and East China Normal University, plus someone listed as a hobbyist sitting second on that table. Assignment 2's leaderboard carries the same open invitation, with verification on two B200s instead of one.

One honest correction: Assignment 1's leaderboard README currently tells non-Stanford students to submit to "the second table," but the file's 2026 content has only one in-class table, with the two 2025 tables collapsed below it. The external table does not exist yet.

There's also a small piece of gossip that shows the path works: Herman Brunborg, a TA this term, topped the assignment 1 and assignment 4 leaderboards in the 2025 offering.

## What a self-learner actually gets

| Thing | Available? |
|---|---|
| Nine executable lectures | Yes, hosted on the course domain; running them yourself needs uv plus the edtrace frontend |
| Eight PDF decks | Yes, all in the lecture repo |
| Lecture recordings | Yes. The Spring 2026 playlist is on the Stanford Online channel, currently 18 videos; the 2025 offering has a separate playlist |
| Starter code and PDF handouts for all five assignments | Yes, all five repos are public |
| Unit tests and the adapter interface | Yes; `uv run pytest` starts out entirely red with `NotImplementedError` |
| Leaderboards | Yes; assignments 1 and 2 both accept and verify external submissions |
| Assignment 3's training API | **No.** The API key is an eight-digit student ID; the repo's "For non-students" section describes standing up your own API and dispatcher, which means paying for those 12 hours yourself |
| Gradescope grading, Slack, office hours | No |
| Course-sponsored compute | No |

A few traps to watch when citing any of this, all found during this pass: the "Course Website" link on the Stanford Online page points at the old **spring2024** site; Assignment 1's repo README is still headed "CS336 Spring 2025 Assignment 1," while the handout PDF in the same folder is Version 26.0.3 with Spring 2026 on the cover. For current content, go by the PDF version number.

## How to start

Don't spin up a cloud instance, and don't start with the recordings. Do this tonight:

`git clone https://github.com/stanford-cs336/assignment1-basics`, then `uv run pytest`. You'll watch a wall of tests fail on `NotImplementedError`. Open `tests/adapters.py`, pick the BPE tokenizer adapter, and follow section 2 of the handout until it goes green — the handout puts that step's requirements at "no GPU, under 30 minutes, under 30 GB of memory," so your laptop is enough.

Finish that one problem and you'll have a better answer to "should I take this course" than any self-assessment can give you. If the problem felt tedious but entirely doable, the rest of Assignment 1 is doable too. If you got stuck at "I don't know where to start writing," that is precisely what "minimal scaffolding" on the course page refers to — go get fluent in PyTorch first.

If you have one afternoon and don't want to write code, open the `lecture_01` trace page, jump to the tokenization section, and step through `merge()` one line at a time. That is the smallest possible sample of how this course teaches.

## Appendix: numbers and how they were checked

- **Lecture repo counts**: 3,649 stars, 758 forks, last pushed 2026-05-28, from the GitHub API on 2026-08-21. Assignment repo forks the same day: assignment1-basics 2,686, assignment2-systems 705, assignment3-scaling 262, assignment4-data 274, assignment5-alignment 460. **Forks are not a completion rate** — they only count how many people pulled the repo under their own name, and the course publishes no completion data.
- **The 9 executable / 8 PDF split**: matched session by session against the file listing in `stanford-cs336/lectures` and the instructor labels on the Spring 2026 schedule. The nine `.py` files map to sessions 1, 2, 6, 7, 10, 12, 13, 14 and 17, all labeled [Percy]; the eight `.pdf` files map to sessions 3, 4, 5, 8, 9, 11, 15 and 16, all labeled [Tatsu]. Sessions 18 and 19 are guest lectures (Daniel Selsam, Dan Fu) with no materials posted. **The Spring 2025 offering did not have this correspondence** — that year's schedule assigned `lecture_06.py` to Tatsu, so the pattern holds only for 2026.
- **B200 hours, problem by problem**: Assignment 1 = learning rate tuning 2 + batch size experiment 1 + four ablations at 0.5 each + the main OWT run 2 + leaderboard 10 = 17. Assignment 5 = GSM8K prompting 2 + learning rate 4 + prompt ablations 4 + two RL algorithm problems at 8 each = 26. Assignment 3 = the 12-hour scaling law quota enforced by the API (the handout gives `total_budget_seconds` as 43,200); the separate 48 B200 hours in that handout is the large run you are predicting, not one you run. Assignment 4 = the handout's "8 B200s, batch size 128 per GPU, 16,384 steps, roughly 8.6B tokens, our run took about 2:00 hours" ≈ 16 B200 hours. Total 71, **excluding assignment 2** (its handout gives only up to 6 GPUs and under 5 minutes per measurement, no total), excluding re-runs, and excluding the CPU time for tokenizer training (the handout allows up to 12 hours and 100 GB of memory, no GPU).
- **Per-hour prices**: the course page labels these "public pricing for a single B200 GPU on March 28, 2026" — Modal 6.25, Lambda 6.69, RunPod 4.99, Nebius 5.50 (3.05 preemptible), Together 7.49 (8 GPU minimum). The same section in the Spring 2025 version was labeled "prices for a single H100 80GB GPU on June 6, 2025" — RunPod 1.99–2.99, Lambda 2.49–3.29, Paperspace 2.24, Together 2.85. **This post estimates no prices of its own: every price comes from the course page and every hour count from a handout.** 71 hours times the 4.99-to-7.49 range gives $354 to $532; that is two sets of published numbers multiplied together, not my estimate.
- **The low-resource setup in Assignment 1's handout**: 8 Low-Resource Tips (counted one by one in the plain text produced by `pdftotext`). The machine they name is an "Apple M4 Max with 36 GB of RAM," where the TA solution trains a model that writes fluent text in under 5 minutes on MPS and about 30 minutes on CPU alone; the CPU/MPS route is advised to cut throughput to 40 million tokens and relax the target validation loss from 1.45 to 2.00. The BPE tokenizer training problem lists its requirements as "≤ 30 minutes, no GPU, ≤ 30 GB RAM." Searching the assignment 2 through 5 handouts for "Low-Resource Tip" returns 0 hits in each.
- **Leaderboard numbers**: Assignment 1's in-class table (Spring 2026) budgets "0.75 B200 hours" with a 45-minute cap per run, a naive baseline validation loss of 5.00, and a current leader at 3.03543; the 2025 in-class and global tables both budgeted "1.5 H100 hours." Assignment 2 (Spring 2026) measures one full step on two B200s at batch size 2 and sequence length 32768, against a naive baseline of 10 seconds, with the current leader at 3,837 milliseconds and a rule that the entire measurement run must finish within 10 minutes starting from empty PyTorch/Triton caches.
- **Units and tuition**: the course page says 5 units, ExploreCourses says 3-5, and the Stanford Online distance version says 5 units, $7,875, 10 weeks, 20–25 hours per week, March 30 to June 10, 2026. All three coexist; this post cites each to its own source rather than picking one.
- **Not confirmed**: One, the Spring 2026 playlist shows 18 videos while the schedule has 19 session slots (17 regular plus 2 guest lectures) — I did not go video by video to determine which one is missing. Two, I did not test connectivity to Assignment 3's training API (`hyperturing.stanford.edu:8000`); I can only confirm the repo says it needs an eight-digit student ID as the key. Three, actual completion rates, enrollment counts and admission rates for Spring 2026 appear nowhere in the public material.

## References

- [CS336 course site (Spring 2026)](https://cs336.stanford.edu/) — prerequisite wording, the five assignment descriptions, GPU prices, honor code, full schedule with instructor labels
- [CS336 Spring 2025 archive site](https://cs336.stanford.edu/spring2025/) — source for the year-over-year comparison: H100 prices, the Together AI sponsorship, the older AI clause, the old schedule
- [CS336 Spring 2024 archive site](https://cs336.stanford.edu/spring2024/) — still where the Stanford Online page points
- [ExploreCourses: CS 336](https://explorecourses.stanford.edu/search?q=CS+336&view=catalog) — the "Application required" wording, 3-5 units, Spring 2026–2027 offering
- [Stanford Online: CS336](https://online.stanford.edu/courses/cs336-language-modeling-scratch) — the stated reason for limiting enrollment, tuition, hours, waitlist process
- [Lecture repo `stanford-cs336/lectures`](https://github.com/stanford-cs336/lectures) — the file listing of nine `.py` and eight `.pdf` lectures, plus run and deploy steps
- [`lecture_01.py` source](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py) — the definition of an executable lecture, the Spring 2024 course evaluation quote, the three reasons not to take the course, the BPE implementation and `@inspect` markers
- [edtrace](https://github.com/percyliang/edtrace) — what the tracer is for and the correct command to run it
- [CS336 AI Policy Spring 2025-2026](https://docs.google.com/document/d/1SZAlExB1qAc9izHt54gwunNpjKE6wXb8Y7yA_e-baK8) — "All your code should be handcrafted by you directly," the AGENTS.md requirement, the office hours test
- [Assignment 5's `AGENTS.md`](https://github.com/stanford-cs336/assignment5-alignment/blob/main/AGENTS.md) — the role definition written for coding agents and the SHOULD NOT list
- [Assignment 1 handout PDF](https://github.com/stanford-cs336/assignment1-basics/blob/main/cs336_assignment1_basics.pdf) — the eight Low-Resource Tips, per-problem B200 hour budgets, the five-minute M4 Max figure
- [Assignment 2 handout PDF](https://github.com/stanford-cs336/assignment2-systems/blob/main/cs336_assignment2_systems.pdf) — the six implementation items, "Up to 6 GPUs," the 1 node 2 GPUs setup
- [Assignment 3 handout PDF](https://github.com/stanford-cs336/assignment3-scaling/blob/main/cs336_assignment3_scaling.pdf) — the dynamic settlement rules for the 12-hour quota, the 48 B200 hour target run
- [Assignment 4 handout PDF](https://github.com/stanford-cs336/assignment4-data/blob/main/cs336_assignment4_data.pdf) — the training setup of roughly 2 hours on 8 B200s
- [Assignment 5 handout PDF](https://github.com/stanford-cs336/assignment5-alignment/blob/main/cs336_spring2026_assignment5_alignment.pdf) — the 2026 required portion is Reasoning RL, with SFT and safety alignment moved to an optional supplement
- [Assignment 1 leaderboard](https://github.com/stanford-cs336/assignment1-basics-leaderboard) — external submission instructions, the T-shirt, the 45-minute rule, the 2025 global table
- [Assignment 2 leaderboard](https://github.com/stanford-cs336/assignment2-systems-leaderboard) — the two-B200 verification conditions, the 10-second naive baseline
- [CS336 Spring 2026 lecture playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV) — Stanford Online channel, currently 18 videos
- On this site: [Reading Stanford's CS courses (series index map)](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Stanford CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
