---
title: "Reading CMU 11-768 L7: How Computer Use Agents See the Screen, Get Graded, and Get Trained"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, computer-use-agent, agent-evaluation, benchmark, reinforcement-learning]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 8
tldr: "JY Koh breaks computer use agents into three questions: evaluation has moved from single clicks (ScreenSpot-Pro, Mind2Web) to programmatic end-state checks (WebArena, OSWorld), VLM judges, and long-horizon rubrics (Odysseys, OSWorld 2.0); the model is a VLM reading interleaved screenshots and actions; training runs pre-training for grounding → SFT on human and synthetic trajectories → RL in resettable simulated environments."
description: "A guide to CMU 11-768 Lecture 7, Computer Use Agents (JY Koh): the observe-reason-act loop, nine years from MiniWoB to OSWorld 2.0, four families of evaluation and their blind spots, the VLM policy and its action spaces, the pre-training / SFT / RL pipeline, and four open problems — speed, personalization, UX, and multi-agent systems."
draft: false
glossary:
  - term: "CUA"
    aliases: ["computer use agent", "computer-use agent", "GUI agent"]
    definition: "An agent that operates a graphical interface directly: screenshots in, human-style actions such as clicks, scrolls, and typing out."
    context: "The subject of this lecture, spanning browser, desktop, and mobile environments."
  - term: "GUI grounding"
    aliases: ["grounding"]
    definition: "Mapping a description (e.g. \"click the CAR tab\") to pixel coordinates or a bounding box on a screenshot."
    context: "ScreenSpot-Pro measures exactly this; pre-training feeds it in bulk."
  - term: "accessibility tree"
    aliases: ["AXTree"]
    definition: "A structured description of an interface that the OS or browser exposes for assistive technology — roughly a simplified HTML listing each element's role and name."
    context: "Early web agents relied on it; the mainstream now reads screenshots. MolmoWeb uses it as privileged information for its synthetic-data teacher."
  - term: "rubric"
    aliases: ["checklist"]
    definition: "A task broken into several individually checkable conditions, so a judge (human or LLM) can tick them off and award partial credit."
    context: "Long-horizon tasks almost never reach a perfect score; rubrics are what keep the signal non-zero."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-07-computer-use-agents)

**Video status: Pending: no corresponding recording has been verified.** [Source details](#course-video-sources)

Lecture 7 of [CMU 11-768 AI Agents](https://www.cmu-agents.com/) (Sep 15, 2026) is given by guest speaker [JY Koh](https://jykoh.com/). He did his PhD at CMU with Daniel Fried and Ruslan Salakhutdinov, built benchmarks such as [VisualWebArena](https://arxiv.org/abs/2401.13649) and Odysseys, and then spent a year and a half leading a computer use agent team at Meta. This is the second stop in the "Domains" module: [last lecture](/en/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en) covered coding agents; this one covers **agents that look at the screen and move the mouse**.

A computer use agent (CUA) differs from the text agents in earlier lectures at both ends: it takes screenshots in and emits clicks, scrolls, and keystrokes out — working in the same interface as a human. Koh says right away that this makes modeling and evaluation both interesting and painful. The lecture has four parts — what a CUA is, how to evaluate one, what the model looks like, how to train it — plus four open problems. This guide follows the same order.

- Course page: [cmu-agents.com schedule](https://www.cmu-agents.com/) (slides and [recording](https://www.youtube.com/watch?v=jwGluLrrqjQ&list=PLSN0qpDfUvTM&index=7) for Lecture 7)
- This guide is based on the Sep 15, 2026 slides and recording. Where the speaker's claims about GPT-6 Astra, Fable / Opus 5 and other products have no public source, the text marks them as his; where an official number exists (for example [OpenAI's GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra/)), it is added alongside.

## Course video sources

This article is based on slides. The official schedule, instructor channel, and exact lecture-title searches were checked, but no matching recording could be verified. Schedule extraction returned only its later half and channel extraction omitted its video inventory. Availability remains unresolved; this does not establish that no video exists.

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

## What a CUA is: observe, reason, act, repeat

The slides carry one running example through the whole talk: "buy a blue mug."

1. **Observe**: the environment provides a screenshot (browser, desktop, or phone).
2. **Reason + Act**: the model writes some reasoning ("I see a blue mug in the center of the screen. I will click it.") and then a structured action such as `{"mouse": {"left_click": [33, 201]}}`.
3. **Execute**: the infrastructure validates the action, performs it on the machine, and returns a new screenshot.

Then it repeats: on the product page it reasons "delivery details are below" and emits `{"scroll": {"dy": 520}}`; it sees the ZIP field, clicks it, types `15213`. The loop runs until the model says it is done or the budget runs out. At the end the environment, the user, or another judge assigns a reward — usually 0 or 1, sometimes partial.

Koh stresses that this loop looks obvious today, but it did not always work.

## Nine years of history: from toy web pages to GPT-6 Astra

Koh polls the room: what year was the first CUA paper? The answer is 2017.

| Period | Representative environments | What changed |
|---|---|---|
| 2017–2022 | [MiniWoB (World of Bits)](https://proceedings.mlr.press/v70/shi17a.html), MiniWoB++, [WebShop](https://arxiv.org/abs/2207.01206) | World of Bits, from Stanford and OpenAI, was a bare synthetic interface trained with classic RL, and models of the time mostly failed it; WebShop simulated Amazon shopping and was more realistic |
| 2022–2024 | [WebArena](https://arxiv.org/abs/2307.13854), [VisualWebArena](https://arxiv.org/abs/2401.13649), [OSWorld](https://arxiv.org/abs/2404.07972) | WebArena (from Graham Neubig's lab) stood up realistic sites from open-source software filled with real data; OSWorld widened the scope to full desktops |
| 2025–2026 | MyPCBench, [Gym-Anything / CUA-World](https://arxiv.org/abs/2604.06126) | Once coding agents got good, people had them build entire apps from scratch (e.g. a Gmail look-alike) with synthetic data; CUA-World turned to long-tail professional software in astronomy, biology, and more |
| Sep 2026 | GPT-6 Astra | Koh said in the lecture that it matches or beats the average human on many computer tasks, and is much faster than earlier models but still slow and expensive (the slide itself says "very capable and fast, still (very) expensive"); the demo is a CAD modeling session sped up 30×. [OpenAI's announcement](https://openai.com/index/gpt-6-astra/) reports 72.6% partial score on the OSWorld 2.0 offline set at about 40 minutes per task, versus 65.7% and about 75 minutes for GPT-5.6 Sol; it makes no comparison to humans |

Koh is enthusiastic about generated environments: clean, low-noise, sometimes nicer to work with than real apps.

## What counts as success: decide what you are measuring first

One task — "add a blue mug under $20 to the cart; do not purchase" — can be graded three ways:

| Angle | Question | Typical method |
|---|---|---|
| Action | Did it click the target? | Fast grounding / imitation tests |
| Outcome | Is the right item in the cart? | State checks or evidence judging |
| Process | Did it respect the constraints (no checkout, no unwanted changes)? | Trajectory checks |

The principle on the slide: **the evaluator should match the capability you want to measure**. Koh adds that computer use is harder to verify than code or math, because people do not always agree on what counts as done, so programmatic verifiers are hard to write.

## Four families of evaluation

The slides sort benchmarks into four families, rising in difficulty and cost.

### 1. Static evaluation: was this step correct?

Given a fixed screenshot, the model predicts one action, which is compared against a reference. No environment runs, so it is fast and cheap.

- **[ScreenSpot-Pro](https://arxiv.org/abs/2504.07981)**: pure GUI grounding. 1,581 high-resolution screenshots of professional software (e.g. a 2560×1440 Blender window). For "construct a UV sphere mesh," a predicted point inside the reference box scores 1.
- **[Mind2Web](https://arxiv.org/abs/2306.06070)**: 2,350 tasks of offline next-action prediction. For "rent a car in Brooklyn," the reference action is clicking the CAR tab.
- The appendix adds Android in the Wild (715K episodes), AndroidControl, and AgentNetBench.

**Blind spot**: there is often more than one correct next step. Changing the dates first is a reasonable way to rent a car, but with "click CAR" as the only reference, it is scored wrong. And a correct step is not a completed task.

### 2. End-to-end evaluation (web): test the resulting world

Let the agent run the task from start to finish, then check state with code: `cart.item == blue_mug`, `cart.price < 20`, `orders.count == 0`. All must pass for a score of 1. How it got there does not matter.

- **WebArena**: 812 tasks on sites self-hosted locally (the paper lists four categories: e-commerce, a forum, GitLab-style collaborative development, and content management); the agent never touches the internet. According to Koh, each task's verifier was hand-written by CMU graduate students.
- The slides show a loophole: task 476 asks for an **empty** repository named awesome_llm_reading, but the verifier only checks that the name appears at the target URL — emptiness is never checked.
- **VisualWebArena**: the multimodal extension of WebArena, 910 tasks, 25.2% of which include images in the input and cannot be solved from HTML alone. When it came out, most agents read accessibility trees; the benchmark was an argument for screenshots.

**Blind spot**: incomplete verifiers produce false positives and false negatives, and agents can learn to please the verifier instead of doing the task (reward hacking).

When a task cannot be checked programmatically, you switch to an **LLM / VLM judge**: give another model the task, the action history, and the last few screenshots, and have it return pass or fail against a rubric.

- **[WebVoyager](https://arxiv.org/abs/2401.13919)**: runs on the real web (15 sites, 643 tasks), e.g. "find the most-starred GitHub project for climate-change data visualization." You cannot query a live site's internal state, so a VLM judge decides; the paper reports 85.3% judge-human agreement.
- **[Online-Mind2Web](https://arxiv.org/abs/2504.01382)**: 136 live websites, 300 tasks, with the WebJudge evaluator (built on o4-mini) at 85.7% agreement with humans.

Koh notes two things. These benchmarks are now largely solved by current models. And site owners do not enjoy a stream of agents hitting them for benchmark runs — he can still see traces left by earlier agents on Allrecipes.

**Human review** remains the gold standard: several reviewers judge independently and disagreements are adjudicated. It is too expensive to run routinely, so benchmark builders do it once or twice, mainly to audit the automatic judge.

### 3. End-to-end evaluation (desktop, mobile)

- **OSWorld**: a real Linux VM with 369 tasks. The slide says 9 applications; the paper's own text says eight representative applications (Chrome, VLC, Thunderbird, VS Code, LibreOffice Calc / Writer / Impress, GIMP) plus basic system tools such as the terminal and file manager. Each task has its own setup script and state checks. The example is "update the bookkeeping sheet using the receipts in the folder"; the verifier compares the saved workbook against a gold one cell by cell.
- **WindowsAgentArena**: Microsoft's Windows counterpart. Koh's reasoning is practical: most of the world's productive work happens on Windows. Parallel VMs turn multi-day evaluations into a 20-minute sweep.
- The appendix also lists AndroidWorld (parameterized tasks, unlimited instances), WorkArena / WorkArena++ (ServiceNow enterprise workflows), and MobileWorld (GUI control mixed with user clarification and MCP tools).

Koh says these 2024–2025 mainstays are also mostly solved by new models, and the community's attention has moved on to the next family.

### 4. Long-horizon computer use

OSWorld and WebArena tasks take a human about 10–20 minutes. Long-horizon tasks take hours and often involve specialist software. Here "1 only if the final result is perfect" is nearly useless: the reward is too sparse, most models score 0, and yet they may have done a lot of useful work. So you check both outcome and process, and use rubrics for partial credit.

- **Hybrid / trajectory checks**: the right mug is in the cart, but step three was `place_order` — that is a fail. Outcome-only grading would miss the violation. The example is WeaveBench (mixed GUI + CLI, trajectory-aware judge).
- **[Odysseys](https://arxiv.org/abs/2604.24964)** (Jang, Koh, Fried & Salakhutdinov, 2026): 200 long tasks on the live web, with 3 to 12 rubric items each (6.1 on average). The example is "plan a Palm Springs wedding trip," with 8 checkpoints (compare flights into two airports, check a 9am–4pm drive window, rent a car, build an editable daily itinerary…). Meeting 7 of 8 scores 0.875, while the perfect-completion rate is 0.
- **[OSWorld 2.0](https://osworld-v2.xlang.ai/)**: 108 workflows with a median human time of about 1.6 hours; the site says Claude Opus 4.7 (maximum thinking) needs 318 tool calls on average, versus about 30 in OSWorld 1.0. The example is building a support bracket in FreeCAD and exporting a STEP model: **the file can exist and still be wrong**.
- **CUA-World-Long**: one hard task per professional application, 200 in total, often needing 500+ steps, spanning healthcare, engineering, and architecture. Koh says most models scored very low when it came out earlier this year, and the paper bears that out: under a 500-step, $5 cap, the best model (Gemini 3 Flash) passes 7.5%; with the cost cap removed and 2,000 steps allowed, GPT-5.4 reaches 27.5%. Koh said in the lecture that GPT-6 is now close to 90%. I could not find a public source for that figure, and OpenAI's announcement does not list CUA-World-Long, so treat it as the speaker's claim.

His conclusion is a bit dramatic: for general software use, computer use is "very close to being solved, or some might say already solved."

### Q&A: partial credit, where rubrics come from, training on benchmarks

- **Are extra actions penalized?** Some WebArena tasks do, but it is not common. Koh has seen agents complete "add the highest-rated product to my cart" by dumping lots of products in. Agents were weak when these benchmarks were built, so authors were generous and tolerated false positives over false negatives. Rubrics resist this kind of hack better than a single outcome reward.
- **Are rubrics human-written or generated?** For Odysseys, mostly LLM-generated and human-checked. A common trick is to give the rubric generator **privileged information** (hints, HTML) so it knows more than the agent under test.
- **Do people train on benchmarks?** You should not train on the test set, but industry routinely builds tasks "very similar to OSWorld or WebArena" and trains on those — in distribution, not on the test set. CUA-World ships an explicit training split.

## The model: a VLM reading an interleaved history

A CUA is essentially a vision-language model (VLM) acting as the policy:

1. At step 0 the context is "goal text + screenshot 0," and the model outputs action 0 (`click(x₀, y₀)`).
2. After execution you get screenshot 1; append "action 0 + screenshot 1" to the context and the model outputs action 1.
3. Keep appending until the model outputs stop or the budget runs out.

Koh calls this the [ReAct](https://arxiv.org/abs/2210.03629) loop. Before the Transformer, text goes through the tokenizer into token embeddings, and screenshots go through a vision encoder and projector into visual embeddings; the two are interleaved into one long sequence. Systems differ in token splits and history compression, but the skeleton is the same.

The **action formats**, however, differ a lot. The slide compares them:

| Model | Action interface |
|---|---|
| GPT-6 Astra | Python / PyAutoGUI, or a native computer tool (`computer_call`) |
| Fable / Opus 5 | Native computer tool calls, one or more per response (`left_click` with coordinates) |
| Gemini 3.8 Flash | Function calls with coordinates normalized to 0–999 |
| Qwen 3.8 | Function calls, XML-style serialization, app-defined GUI schema |
| Muse Spark | Scripts plus direct GUI actions, including action batches |
| Kimi K3 | Function calls with JSON arguments |

Koh's verdict: every format is different, and reproducibility is a nightmare.

### Q&A: screenshots or HTML?

- **Why screenshots instead of HTML?** Screenshots are available everywhere; HTML is easy on the web but awkward on a desktop. And screenshot-only agents work surprisingly well — something people were reluctant to accept a year ago. Koh personally prefers pure screenshots because a model trained on Windows then transfers more easily to Linux or Mac, without depending on each platform's accessibility representation. He also notes that GPT-6, at least, uses accessibility data when available, which helps reliability.
- **What if the page is still loading?** The most common fix is humble: wait about three seconds after each action before taking the screenshot. Models that see a loading screen are usually trained to wait again.
- **Does it break at other resolutions?** Coordinates are usually normalized to 0–1000 (0,0 top-left, 1000,1000 bottom-right), which transfers reasonably well.
- **Why not query a database of element positions?** Frontier models do not only click: GPT-6 Astra alternates between GUI actions, bash calls, and writing code, using whichever is most efficient.

## Training: pre-training → SFT → RL

Koh first clears up one point: when you deploy GPT-6 as a CUA, you are not deploying a specialized computer-only variant. It is a general model, and computer use is one capability among many. CUA-specific training comes in three stages:

| Stage | Data | What it teaches |
|---|---|---|
| Pre-training | Screenshots with element boxes, labels, OCR; single-step action prediction | Grounding, control |
| SFT | Human demonstrations plus synthetic trajectories | Behavior cloning |
| RL | Rollouts in environments plus verifiers | Optimizing for task outcome |

### Pre-training: learn where things are

Grounding data can be generated cheaply at scale: run a bit of JavaScript on a website and you can extract every element's box and label — for instance, which box on United's site corresponds to "CAR" in Mind2Web. Another format gives the model an HTML element name and asks for its coordinates. The data is noisy but huge, and its purpose is to make later stages click accurately. [OS-Atlas](https://arxiv.org/abs/2410.23218) is a representative source.

### SFT: imitate useful trajectories

- **Human demonstrations**: pay people to do tasks and record "screenshot → action" sequences. [MolmoWeb](https://arxiv.org/abs/2604.08516)'s MolmoWebMix has 36K human trajectories; [OpenCUA](https://arxiv.org/abs/2508.09123)'s AgentNet releases 22,625 across 3 operating systems.
- **Synthetic trajectories**: let a stronger model (or the same one) run tasks and keep only the ones judged successful. MolmoWeb generated another 105K, cleverly: the teacher reads the **accessibility tree** — privileged information the student will not have at deployment — so its trajectories are better; after filtering, they train a screenshot-only student.
- Koh offers a Tesla analogy (while saying he is not sure it is true): collect trajectories with LiDAR-equipped cars, then drop the LiDAR data and train the model on pixels only.

A slide traces demonstration data over time, from Mind2Web's 2,350 tasks in 2023 to MolmoWebMix's human-plus-synthetic mix in 2026. Scale has grown, and the supervision has shifted toward longer, cross-app, multi-turn trajectories.

### RL: trial and error in resettable environments

After SFT the model already has real ability. Koh says the RL stage was uncommon a year ago and is now nearly standard. You drop the model into an environment with a task, score the result with rules, programmatic verifiers, or an LLM judge, and reinforce the successful trajectories.

Why must the environment be simulated? The slide uses a MyPCBench task, "book an airport ride for my upcoming flight," to give three reasons:

- **Real money**: retries create duplicate paid bookings.
- **Real people**: a booking dispatches an actual driver.
- **No clean reset**: cancellation may cost a fee, and spent time cannot be restored.

Two representative systems:

- **[CUA-Gym](https://arxiv.org/abs/2605.25624)** (required reading): coding agents build 94 resettable mock web apps plus 16 desktop apps, 110 environments in all. A Generator agent builds the initial and gold states while a separate Discriminator agent writes the reward function from the task spec alone; the two are generated independently and then tested for agreement. The result is 32,112 verified RLVR tuples, 38% of them cross-application. The experiments warm up with SFT on 3,578 successful Claude-Sonnet-4-6 trajectories, then run GSPO on 10,858 tuples: Qwen3.5-397B-A17B goes from 62.2% (base) to 72.6% on OSWorld-Verified, and the smaller Qwen3.5-35B-A3B from 54.5% to 62.1%.
- **Gym-Anything**: turns real installed software (200 applications across Linux, Windows, and Android) into environments, with one agent building and another auditing independently, yielding 10K+ CUA-World tasks that cover all 22 US occupational groups. Distilling about 2,000 successful trajectories from a Kimi-K2.5 teacher into Qwen3-VL-2B raises the average CUA-World-Test score from 12.7 to 22.5 and the pass rate from 1.6% to 4.4%.

Koh adds verbally that success after SFT is around 0.5 and RL pushes it to 0.6 or more — and because human demonstrations for very long tasks are so expensive, RL is especially valuable at long horizons.

## Four problems still open

1. **Speed and cost**: task time ≈ turns × time per turn, and screenshots plus reasoning make each turn's prefill and generation expensive. Two directions: reason only at key decisions and act directly on routine steps (Game-TARS), or predict actions directly to cut turns (FDM-1).
2. **Personalization**: use the user's own files, history, and preferences instead of generic defaults. GUM infers user context from computer activity and keeps that memory revisable; MyPCBench ties mail, calendar, and project issues to one seeded identity to test personal context. Consent and forgetting are essential.
3. **Infrastructure and UX**: don't block the user — run the agent in isolated background sessions, show progress, and accept corrections and interruptions. Proactive agents need consent, visibility, and an easy off switch.
4. **Multi-agent systems**: Koh's own [MACU](https://arxiv.org/abs/2606.01533) (required reading). A manager decomposes the task into a directed acyclic graph (DAG), dispatches ready nodes in parallel to CUA subagents in isolated environments, and keeps revising the graph as findings come back. The abstract reports gains of 3.4 to 25.5 points over strong single-agent baselines on OSWorld, Online-Mind2Web, WebTailBench, and Odysseys. The slide's caveat: parallelism helps only when coordination preserves correctness.

## Reading list

The schedule lists six required readings and eight references:

| Reading | Role in this lecture |
|---|---|
| [WebArena](https://arxiv.org/abs/2307.13854) (Zhou et al., ICLR 2024) | End-to-end web evaluation with programmatic end-state checks |
| [VisualWebArena](https://arxiv.org/abs/2401.13649) (Koh et al., ACL 2024) | Turning web tasks into a multimodal problem |
| [OSWorld](https://arxiv.org/abs/2404.07972) (Xie et al., NeurIPS 2024) | Full desktops with per-task custom state checks |
| [OpenCUA](https://arxiv.org/abs/2508.09123) (Wang et al., 2025) | AgentNet human demonstrations and open CUA models |
| [CUA-Gym](https://arxiv.org/abs/2605.25624) (Wang et al., 2026) | Verifiable environments and task generation for RL |
| [Multi-Agent Computer Use](https://arxiv.org/abs/2606.01533) (Koh, Salakhutdinov & Fried, 2026) | Open problem: parallel multi-agent CUAs |

The references — [Mind2Web](https://arxiv.org/abs/2306.06070), [WebVoyager](https://arxiv.org/abs/2401.13919), [ScreenSpot-Pro](https://arxiv.org/abs/2504.07981), [Gym-Anything](https://arxiv.org/abs/2604.06126), [MolmoWeb](https://arxiv.org/abs/2604.08516), [WebShop](https://arxiv.org/abs/2207.01206), [ReAct](https://arxiv.org/abs/2210.03629) — all appear above. The schedule's MiniWoB link points to arXiv:1704.04368, which is the summarization paper Get To The Point (See et al., 2017) and unrelated to MiniWoB, so this guide links the [ICML 2017 World of Bits paper](https://proceedings.mlr.press/v70/shi17a.html) instead.

## Something to try tonight

Pick a web flow you know well — say, "add a user in our admin panel, but don't send the invite email" — and write the three layers of checks from the slides:

1. **Action**: which element should the first step click? List every reasonable answer; you will find more than one.
2. **Outcome**: write end-state assertions as database queries (the user exists, with the right role).
3. **Process**: write one trajectory rule (the send-email API was never called).

Then ask: if you kept only check 2, which "looks successful" trajectories would slip through? That question is the core of this lecture's evaluation section.

## Further reading

- Same series: [L6 Coding Agents](/en/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en), [L8 SFT](/en/posts/ai/2026-09-29-cmu-11768-lecture-08-sft-en) (the details behind this lecture's SFT stage)
- Evaluation design and benchmark contamination: [Stanford CS329Z Week 7](/en/posts/ai/2026-09-15-stanford-cs329z-week7-eval-benchmarks-en)
- Background for the RL stage: [CS336 Lecture 16: RLVR and GRPO](/en/posts/ai/2026-08-22-cs336-rlvr-en)
- SFT basics: [CS336 Lecture 15: SFT and RLHF](/en/posts/ai/2026-08-22-cs336-sft-rlhf-en)
- Biases of LLM judges: [Self-Reflection and LLM-as-Judge](/en/posts/ai/2026-03-12-self-reflection-llm-as-judge-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- Course: [CMU 11-768 AI Agents site and schedule](https://www.cmu-agents.com/), [Lecture 7 recording](https://www.youtube.com/watch?v=jwGluLrrqjQ&list=PLSN0qpDfUvTM&index=7), [speaker JY Koh's homepage](https://jykoh.com/)
- Required readings: [WebArena](https://arxiv.org/abs/2307.13854), [VisualWebArena](https://arxiv.org/abs/2401.13649), [OSWorld](https://arxiv.org/abs/2404.07972), [OpenCUA](https://arxiv.org/abs/2508.09123), [CUA-Gym](https://arxiv.org/abs/2605.25624), [Multi-Agent Computer Use](https://arxiv.org/abs/2606.01533)
- Other citations: [World of Bits (Shi et al., ICML 2017)](https://proceedings.mlr.press/v70/shi17a.html), [WebShop](https://arxiv.org/abs/2207.01206), [Mind2Web](https://arxiv.org/abs/2306.06070), [WebVoyager](https://arxiv.org/abs/2401.13919), [ScreenSpot-Pro](https://arxiv.org/abs/2504.07981), [Gym-Anything](https://arxiv.org/abs/2604.06126), [MolmoWeb](https://arxiv.org/abs/2604.08516), [ReAct](https://arxiv.org/abs/2210.03629), [OS-Atlas](https://arxiv.org/abs/2410.23218), [Odysseys](https://arxiv.org/abs/2604.24964), [Online-Mind2Web](https://arxiv.org/abs/2504.01382)
- Official pages: [OSWorld 2.0 site](https://osworld-v2.xlang.ai/), [OpenAI: GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra/)
