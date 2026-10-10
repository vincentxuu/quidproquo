---
title: "Reading CMU 11-768 L6: Coding Agents — From Completing a Line to Fixing a Whole Repo"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, coding-agent, benchmark, rlvr]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 6
tldr: "Neubig's L6 splits coding agents into three layers: train a model that can code (pre-training, mid-training, infilling, RL from test rewards), wrap it in a localize–edit–verify loop with the right editing tools so it can change a repo, then evaluate and train it in SWE-bench-style executable environments. Fixing bugs is only about 15% of a developer's day; the next frontier is tests, CI, and maintenance in the outer loop."
description: "A guided reading of CMU 11-768 Lecture 6, Coding Agents: pre-training data and tokenizers for code, mid-training mixtures and long context, infilling, evaluation from BLEU to execution, pass@k, the localize–edit–verify loop, bash-only versus dedicated edit tools and diff formats, SWE-bench and training environments like SWE-Gym and SWE-smith, multi-harness training, frontend verification, outer-loop tasks, and models that predict code behavior."
draft: false
glossary:
  - term: "infilling"
    aliases: ["fill-in-the-middle", "FIM"]
    definition: "Having a model generate the missing middle of a piece of code, conditioned on both the code before and after it."
    advanced: "During training the middle span is moved to the end and its position marked with a sentinel token, so ordinary left-to-right generation can fill the gap at inference time."
    context: "L6 uses InCoder: you can only guess a return type correctly if you can see the function body."
  - term: "pass@k"
    definition: "The probability that at least one of k sampled programs passes all tests."
    advanced: "The HumanEval paper computes it with an unbiased estimator from n samples with c correct: 1 − C(n−c,k)/C(n,k)."
    context: "The standard metric for single-step code generation."
  - term: "SWE-bench"
    definition: "A repo-level bug-fixing benchmark built from real GitHub issues and graded with the tests from the corresponding PR."
    advanced: "Grading uses two groups of tests: FAIL_TO_PASS checks the requested fix, PASS_TO_PASS checks nothing else broke."
    context: "Almost every evaluation and training environment in the second half of L6 reuses its task format."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents)

**Video status: Videos included.** [Source details](#course-video-sources)

Lecture 6 of [CMU 11-768 AI Agents](https://www.cmu-agents.com/) opens the Domains module with coding agents (see the [series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en) for the full map), taught by Graham Neubig. He starts by noting that most of the room already uses coding agents daily, so there is no need to explain what they do; this lecture is about **how you build one** and what that takes.

He splits "AI that writes code" into three levels: writing a snippet (a single completion), modifying a repository (changing several files at once), and doing software development (the whole lifecycle of requirements, implementation, review, deployment, and maintenance). Every agent has three ingredients — prompt, tools, LLM. Prompting was covered in the previous lectures ([L4 Skills and Memory](/en/posts/ai/2026-09-29-cmu-11768-lecture-04-skills-memory-en) and [L5 Planning](/en/posts/ai/2026-09-29-cmu-11768-lecture-05-planning-en)), so this one focuses on the other two: how a model learns to code, and which tools the agent should get.

This post follows the lecture's order through seven parts: training code models, evaluating generated code, the agentic coding loop, toolset design, evaluating and training coding agents, frontend development, and development tasks beyond the inner loop. The final section, on models that predict code behavior, ran out of class time; I cover it from the slides.

## Course video sources

Verified public recording for CMU 11-768 Fall 2026 lecture 6, published on course instructor Graham Neubig’s channel; its title and description identify this course.

```youtube
url: https://www.youtube.com/watch?v=1BWeH1oOM7k
title: CMU AI Agents 2026: 6. Agents for Coding and Software Development
```

Original videos: [CMU AI Agents 2026: 6. Agents for Coding and Software Development](https://www.youtube.com/watch?v=1BWeH1oOM7k)

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Read the full transcript (about 79 min) and checked the Neubig statements and class Q&A the article relays: the three single-step capabilities, pre-training and data cleaning (StarCoder, licenses, truffleHog), tokenizers and whitespace, language biases (Python/React), mid-training (Code Llama, Qwen2.5-Coder mixtures and YaRN lengths), infilling, diff/CI/execution-trace data, BLEU to execution-based evaluation and test-quality problems, the efficiency and comment-spam Q&A, localize-edit-verify, Agentless, the bash-only tool and the 85-90% tool-call answer, the search/replace format and Gemini edit-format issue, SWE-bench with SWE-Gym, SWE-smith and the continuously updated dataset, multi-harness training, front-end work and the GLM 5.2 remark, outer-loop tasks and the Microsoft 15% survey, and the unfinished code world model segment; all supported. Two fixes: the "InCoder let tokens span whitespace, about 40% fewer" remark was another person's answer that Neubig repeated, not his own, and the Agentless first author is called an assistant professor (not associate) in the captions. Exact per-paper figures (EvalPlus, AlphaCode, Aider, etc.) come from the papers, not the transcript.

## 1. Models that write code

Start with single-step models: one prompt, one program out, no agent yet. To do even this, a model needs three abilities: the language itself (syntax, APIs, idioms), **editing** (conditioning on code on both sides instead of rewriting from scratch), and **reasoning** (from specification to behavior). Neubig singles out reasoning: code and math are the two most successful applications of reasoning models because in both it is relatively easy to check whether an answer is right.

He also points out that no language model today is unable to write code, because coding is one of the most valuable use cases — but the ability is not free. Training has three stages: pre-training, mid-training, and RL post-training.

### Pre-training: data, cleaning, tokenizers

Pre-training is ordinary next-token prediction; the difference is the data. A code model needs web text, technical prose, math, source code, and documentation — code alone is not enough, since users give instructions in English. The slides list [OLMo](https://arxiv.org/abs/2402.00838) here, and its openly released pre-training data, Dolma, is exactly this kind of mix: of about 2.67T tokens, roughly 342B are GitHub code and the rest are web pages, Reddit, papers, books, and Wikipedia (OLMo paper, Table 2). The pipeline must **preserve structure**: indentation, file boundaries, APIs, and the relationship between text and code. His counterexample is an old practice: normalizing runs of whitespace to a single space, which is a disaster for Python where indentation carries meaning.

Most of the cleaning details come from [StarCoder](https://arxiv.org/abs/2305.06161) (co-instructor Daniel Fried is an author):

- **Filter by language and source**: drop auto-generated dumps, broken encodings, and low-value repetition.
- **Deduplicate**: a GitHub project can have thousands of forks, plus vendored third-party libraries; without dedup the data is badly skewed.
- **Track provenance**: licenses, dates, opt-outs, sensitive-data filtering. He is blunt: train on proprietary-licensed code, make a lot of money, and the owners may show up two years later. Whether you care is your call, but you have to make the call. For secrets, people push API keys to repos all the time; tools like TruffleHog can scrub them.
- **Prevent leakage**: split train and test by repository or problem family, and decontaminate evaluation tasks.

Tokenizers need adjusting too. Two rules: preserve whitespace (spaces, tabs, and newlines carry syntax), and compress frequent whitespace runs into single tokens so a 16-space indent does not cost 16 tokens. The slides show the actual [StarCoder2 tokenizer](https://huggingface.co/bigcode/starcoder2-3b/blob/main/tokenizer.json) splitting `↵····return` into "newline plus three spaces" and "space plus return". Running that tokenizer ourselves gives the same result, and a newline plus a 16-space indent is also a single token.

A student asked about letting tokens merge across whitespace. Someone in the room (the captions do not name the speaker; from the content it was probably Fried, who worked on InCoder) answered that you can — InCoder did it — and Neubig repeated the answer (he said roughly 40% fewer tokens; appendix A.4 of the [InCoder paper](https://arxiv.org/abs/2204.05999) reports that letting tokens span whitespace, excluding newlines, cut the tokens needed to encode the training corpus by 45% relative to GPT-2's byte-level BPE) — but it causes strange failures. `import numpy as np` might become one token, and when a user stops at `import numpy as`, the model cannot continue without backtracking or constrained decoding.

Language coverage is also a pre-training decision. StarCoderBase is 15.5B parameters trained on 1T tokens across 80+ languages, and the result is intuitive: languages with more data do better. He also talked about models' language preferences — ask for a dashboard and you get React, ask for almost anything else and you get Python. After he had a model port a data pipeline to Rust, the next new program it wrote was Python again, and he had to keep insisting. His guess at the causes: Python is concise and easy to write, and RL training likely ran against a Python interpreter.

### Mid-training: more code, the right mixture, longer context

Mid-training turns a general model into a code model by continuing training. [Code Llama](https://arxiv.org/abs/2308.12950) took Llama 2 and trained on 500B more tokens, at 7B, 13B, and 34B (a later revision of the paper adds a 70B model trained on 1T tokens). The mixture has to be chosen empirically: [Qwen2.5-Coder](https://arxiv.org/abs/2409.12186) tried 100% code and got reasonable code scores (49.8) but MATH fell to 10.3 and MMLU to 42.8; with a 70/20/10 code/text/math mix, code dropped only slightly (48.3) while MATH and MMLU recovered to 33.2 and 62.9. Note: the slide labels the all-code MMLU as 23.8, but in the paper's Table 3 23.8 is the GSM8K column and MMLU is 42.8; this post follows the paper. Nobody uses a model only for code anymore, so general ability cannot be sacrificed.

Long context matters especially for code, because you want context from the whole codebase. The naive approach concatenates every file in a repo, but most reasonable codebases exceed a million tokens, and Google's monorepo reportedly has billions of lines. A better approach concatenates related files along directories or the dependency graph. Qwen2.5-Coder trains from 8K to 32K, then uses YaRN to reach 128K (positional extrapolation was covered in [L3 Context Management](/en/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en)). Validation uses cross-file completion, infilling, and checks that short-context ability did not regress.

### Infilling: seeing both sides of the gap

This part is Daniel Fried's [InCoder](https://arxiv.org/abs/2204.05999). The problem is concrete: `def is_positive(x: int) -> ____:` — fill in the return type. A left-to-right model only sees what is left of the gap and can only guess `bool` from the name; the real evidence, `return x > 0`, is to the right.

The fix is surprisingly simple: turn infilling into a left-to-right task. During training, move the middle span to the end and replace it with a sentinel: `prefix [M0] suffix [M0] span [END]`. At inference, feed `prefix [M0] suffix [M0]` and the model generates the span. How many holes and how long is sampled from a long-tailed distribution — usually one, sometimes two or three. Once learned, completing mid-file code, inferring types, writing comments, and renaming variables are all the same task.

The gains are large. On infilling tasks derived from HumanEval (paper Table 1, InCoder-6.7B), left-to-right with one candidate scores 48.2% / 24.9% (single-line / multi-line); ten candidates reranked using the suffix reaches 54.9% / 28.2%; causal-masked infilling reaches 69.0% / 38.6%. And it is not a trade-off: at a matched 52B-token budget (the paper's Table 5 ablation at 1.3B), the causal-masking objective actually scores slightly higher on ordinary HumanEval and MBPP completion than pure left-to-right. OpenAI published a parallel [FIM scaling study](https://arxiv.org/abs/2207.14255).

### Other signals to learn from

Code offers creative training signals:

- **Commit diffs**: code before plus commit message, predict the code after or the diff — trains editing ([OctoPack](https://arxiv.org/abs/2308.07124), which compiled CommitPack, 4TB of commits across 350 languages).
- **Diagnostics**: broken code plus compiler error messages, predict the repair ([DrRepair](https://proceedings.mlr.press/v119/yasunaga20a.html)). Neubig asked where you could get this data nearly free; his answer was CI — GitHub publicly stores enormous numbers of "this version failed, the next one passed and merged" records.
- **Tests**: program plus unit-test outcomes as an RL reward, with a separately trained critic that predicts functional correctness ([CodeRL](https://arxiv.org/abs/2207.01780)).
- **Execution traces**: program plus executed lines and variable states ([CodeExecutor](https://aclanthology.org/2023.findings-acl.308/)), which connects to the code world models at the end.

## 2. Evaluating generated code

### Comparing with a reference

The earliest approach compares against a human-written reference. Neubig's own [2017 code generation paper](https://aclanthology.org/P17-1041/) used exact match and BLEU. The problem is obvious: if the reference is `return x > 0`, `return x >= 0` differs by one token but behaves wrongly at x = 0, while `return not (x <= 0)` looks very different yet is equivalent for integers.

Two refinements followed. [CodeBLEU](https://arxiv.org/abs/2009.10297) keeps BLEU's n-gram match and adds syntax-tree and data-flow matching (where variables come from). [CodeBERTScore](https://aclanthology.org/2023.emnlp-main.859/) embeds every token of both programs, matches each to its most similar counterpart, and computes precision, recall, and F-score.

### Running the code

Today the dominant approach is execution: run the candidate in an isolated runtime with time and memory limits against test cases; pass them all and it counts as correct. It accepts any correct implementation and catches semantic errors. Neubig spent a while on the downsides:

- **Good tests are hard.** Every well-known benchmark has a paper complaining about its tests (for example [EvalPlus](https://arxiv.org/abs/2305.01210): extending HumanEval's tests 80× cut models' pass@k by up to 19.3–28.9%). The [AlphaCode](https://arxiv.org/abs/2203.07814) paper also hand-checked 50 problems: 30% of passing HumanEval solutions were actually wrong, and CodeContests got that down to 4% after adding generated tests (Table 2). Loose tests let wrong implementations through (false positives); tests that check things the task never stated fail correct ones (false negatives). His example: the task says "put a nice learn-more button in the top right," but the test checks the button's background color. As tasks get more complex, keeping both error rates low gets harder — one of the biggest challenges in training coding agents today.
- **Trusted dependencies and isolation.** Usually a Docker container with dependencies installed, but when library versions update, tests break and a newer model gets a lower score because of stale tests.
- **Time and a stable environment.** A full test run on a large repo can take minutes.

The classic single-step benchmarks are [HumanEval](https://arxiv.org/abs/2107.03374) (164 Python functions, complete from a docstring, hidden unit tests; saturated today) and [CodeContests](https://arxiv.org/abs/2203.07814) (competition problems from the AlphaCode team, requiring full programs; the validation and test splits are all Codeforces problems, while training also mixes in Description2Code and CodeNet). Neubig noted that few humans can solve a Codeforces problem 100% correctly on the first submission, yet that is exactly what we expect from single-step models. The model in the HumanEval paper was also called Codex — the 2021 model behind GitHub's completions, not today's Codex.

The usual metric is pass@k: the probability that at least one of k samples passes.

<details>
<summary>The unbiased pass@k estimator</summary>

Sampling exactly k programs and checking whether any passes has high variance. The HumanEval paper instead samples n ≥ k programs per problem, counts the c that pass, and computes:

pass@k = E[ 1 − C(n−c, k) / C(n, k) ]

That is, one minus the probability that k programs drawn at random from the n are all wrong.

</details>

### Non-functional requirements

A student asked how efficiency is handled in training. Neubig said single-step tasks mostly care only about correctness. One exception is [NoFunEval](https://arxiv.org/abs/2401.15963): the 397 tasks on the slide are its code-editing subset, NoFunEdit (the full benchmark has 958 instances, including two classification subsets), with requests like "make this faster," "more maintainable," or "more secure." Scoring depends on the category: runtime tasks check correctness with tests and compare average runtime, latency and resource tasks compare against reference edits (DiffBLEU), and maintainability and security tasks multiply that by CodeQL static-check results. Agentic tasks take efficiency into account more often.

### RL from test results

The standard training method for single-step models: sample answers, run tests, reward passes, update. Nothing unusual from an RL standpoint, but it is key to training reasoning models. The slide example computes 1 + … + n for n up to 10¹²: iterating is too slow; recalling the formula but mistranscribing it as `n * (n - 1) // 2` fails already at n = 1; only deriving it and checking edge cases gives the correct and efficient `n * (n + 1) // 2`. Competitive problems often have time limits, so efficiency gets trained indirectly. [DeepCoder](https://www.together.ai/blog/deepcoder) raised the response-length limit from 16K to 32K during RL and evaluated at 64K, approaching o3-mini on LiveCodeBench.

Two Q&As are worth keeping. Why do models write so many comments? Neubig stressed this is a guess: training data contains comments; reasoning training may implicitly reward emitting more tokens as thinking room; and current code-quality reward models probably ask for "the right amount," since verbose comments were a top complaint about earlier models. How do you train for human-readable code? Train a reward model for code quality (readability can be learned from human annotations) and fold it into the RL reward.

## 3. Agentic coding: localize, edit, verify

What separates agentic from single-step coding is iterative tool calling. The most common scenario — fixing a bug or adding a feature in a GitHub repo — has three steps in a loop:

1. **Localize**: find where to change.
2. **Edit**: change it.
3. **Verify**: check that it really works; on failure, revise the hypothesis and go back.

The slides use one small example throughout: a config sets `retries` to 0 and it becomes 3. Localization runs `rg 'retries'`, finds `return config.get("retries") or 3`, and reproduces `AssertionError: 3 != 0` with a unit test — zero is falsy. The key line: "repair the condition, not the test." The edit becomes `3 if value is None else value`, and the full suite confirms missing, None, zero, and positive cases all pass with no regressions.

Neubig also presented a non-agent alternative, [Agentless](https://arxiv.org/abs/2407.01489) (the first author is Chunqiu Steven Xia; in class Neubig called him CMU's new assistant professor, matching the [CMU School of Computer Science 2026 new-faculty list](https://scsbusinessoffice.cs.cmu.edu/new-faculty/2026.html), which gives Assistant Professor in the Software and Societal Systems Department): a fixed pipeline that predicts files to edit, narrows to classes and functions, narrows to specific lines, then generates a patch with a single-step model. For a while this worked surprisingly well; building coding agents at the time, he saw quite a few models do better with this fixed workflow than as agents. The reason: models had been trained heavily for single-step code solving but not for tool calls and verification loops. Everyone uses agents now, but the history makes a point: **an agent's advantage has to be backed by model training**.

## 4. Toolsets: is bash enough?

The minimal answer is one tool: run bash. [mini-SWE-agent](https://mini-swe-agent.com/latest/) (from the SWE-bench team) does exactly that: `rg`, `cat`, and `find` to localize; `sed`, one-off Python scripts, and `patch` to edit; `pytest` or build commands to verify. In theory that is all you need.

Why is it not ideal? Neubig endorsed a student's answer: 85–90% of tool calls are reads and file edits, so wrapping them in dedicated tools spares the agent from deciding every time between sed, Python, or patch. sed needs every backslash escaped and line numbers guessed; bash is genuinely a poor interface for editing files. So nearly every competitive coding agent adds at least one file-editing tool. [SWE-agent](https://arxiv.org/abs/2405.15793) measured this in an ablation: on SWE-bench Lite with GPT-4 Turbo, editing only through redirection or sed solved 10.3%, while an edit command with a linter check solved 18.0% (paper, Table 3).

The editing formats:

| Format | How it works | Trade-off | Examples |
|---|---|---|---|
| Whole file | Send the entire new file | Simple, but repeats unchanged code | Pi write, OpenCode write, OpenHands create |
| Search / replace | Send old and new strings | Compact, but the old string must be unique | OpenHands, Pi, OpenCode edit |
| Unified diff | Standard diff with line numbers | Models often get line numbers wrong | Aider's variant omits hunk line numbers |
| File-operation patch | Codex's `*** Begin Patch` syntax: `*** Add/Delete/Update File` marks file operations, and `@@` is followed by context rather than line numbers (see the grammar in [parser.rs](https://github.com/openai/codex/blob/16ff14c266179e6a762dc8081e9dab73a96683e0/codex-rs/apply-patch/src/parser.rs)) | In between | Codex, some OpenCode / OpenHands presets |

Neubig asked the room for the downside of search/replace: if the file has two copies of `RETRIES = 3`, the match is ambiguous and the agent has to include more lines until it is unique. The benefits far outweigh this, which is why almost every coding agent uses it.

Format can matter enormously. [Aider's experiment](https://aider.chat/docs/unified-diffs.html) ran GPT-4 Turbo on 89 Python refactoring tasks: 20% success with search/replace, 61% with simplified unified diffs, because that model had seen more diffs in training. Neubig said the specific result matters less today but the principle holds; he also said that until recently Gemini worked poorly in many tools, which he attributed to it being trained on its own editing format, fixed only in recent months. The training explanation is the lecturer's; this post found no primary source for it. The closest corroboration is [Aider's edit-format docs](https://aider.chat/docs/more/edit-formats.html): Aider added a separate `diff-fenced` format for the Gemini family because those models often fail to follow the fencing that the `diff` format specifies. **The format a model saw in training is the format it uses best** — a point that returns in multi-harness training below.

For localization, start by searching for the symptom (ripgrep is the most popular), then follow the value: where is zero first read, and where does it become three? More advanced approaches like [LocAgent](https://arxiv.org/abs/2503.09089) give the agent a tool to jump along the dependency graph, from `config.py` to its caller `client.py` and its tests (the example is from the slides; the tool is called TraverseGraph and does multi-hop search over the code graph). Neubig's experience is that such methods are hard to make reliably better than simple search; the LocAgent paper itself reports up to 92.7% file-level localization accuracy, so both views are given here.

## 5. Evaluating and training coding agents

### SWE-bench

The dominant benchmark is [SWE-bench](https://arxiv.org/abs/2310.06770). Tasks come from GitHub issues: the repo is frozen just before the fixing PR, the agent produces a patch, and tests run on the patched repo. Because a full test run on repos like Django or NumPy can take five to ten minutes or more per task, SWE-bench selects a relevant subset in two groups:

- **FAIL_TO_PASS**: failed before the PR, pass after — did the requested fix happen?
- **PASS_TO_PASS**: pass both before and after — did anything else break?

Neubig flagged a terminology trap: SWE-bench's "harness" means **the evaluation test runner**, not the agent harness this course talks about.

### Runnable training environments

A runnable task needs three things: a starting state (files, dependencies, test command), an issue (requested behavior and a reproduction), and checks (the bug fails before, the repair restores behavior). If you can generate these at scale, you can do RL on them. Validate the environment itself before collecting trajectories.

- [SWE-Gym](https://arxiv.org/abs/2412.21139) (Neubig's group): extends SWE-bench from an evaluation set into training environments, substantially improving a previously weak 32B model; sampling many candidates and picking with a learned verifier scales inference-time compute for further gains.
- [R2E-Gym](https://arxiv.org/abs/2504.07164): RL for multi-step repair. Search, edit, and test actions are all training targets, but the reward is only terminal — repaired or not. The slide names the cost: **when a late failure happens, you cannot tell which earlier decision was wrong** (credit assignment, expanded in [L9 RL Basics](/en/posts/ai/2026-09-29-cmu-11768-lecture-09-rl-basics-en)).
- [SWE-smith](https://arxiv.org/abs/2504.21798): a real PR per task is expensive, so inject bugs instead. Start from an executable baseline, mutate code but not tests, keep mutations that make tests fail. The example reverts `if value is None` to `if not value`, turning four passing tests into three passes and one failure. The idea resembles mutation testing from software engineering. Upside: nearly unlimited data. Downside: the bugs are not necessarily natural.
- Multiple languages: [Multi-SWE-bench](https://arxiv.org/abs/2504.02605) and [SWE-bench Multilingual](https://www.swebench.com/multilingual.html) extend the format. The only logistical difficulty is differing conventions (`pyproject.toml` / `package.json` / `Cargo.toml`; `pytest` / `npm test` / `cargo test`), which coding agents now handle easily.

Neubig also mentioned, off-slide, a continuously refreshed SWE-bench-style dataset that keeps generating environments from new PRs, with training and development splits — in his view the largest public dataset of its kind. The name is unclear in the transcript, so I leave it unnamed.

### Multi-harness training

As noted above, when the editing format a model expects differs from what a harness provides, performance drops. So model developers now often train across **multiple harnesses**. The slide gives a precise definition:

> Harness = prompts + tools + agent loop + context management

One set of weights is plugged into OpenHands, OpenCode, Codex, and others; the task check is always "patch → tests → reward," and all trajectories and rewards update the same model. Examples are [Nemotron 3 Super](https://arxiv.org/abs/2604.12374) (which implements OpenCode and Codex agent classes inside OpenHands, reusing one harness while varying tools and prompts) and [Nemotron 3 Ultra](https://arxiv.org/abs/2606.15007) (at least two harnesses per task distribution) and [Polar](https://arxiv.org/abs/2605.24220) (native harnesses call a shared model API proxy). That definition is exactly what the next post, [Assignment 1](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en), has you build by hand.

## 6. Frontend development

Frontend work matters a lot but gets less research attention than issue repair. [SWE-bench Multimodal](https://arxiv.org/abs/2410.03859) focuses on fixing bugs in visual, user-facing JavaScript software (not building new pages): 617 tasks from 17 libraries for web interfaces, diagramming, data visualization, syntax highlighting, and interactive maps, each with at least one image in its problem statement or tests. Multimodality changes two things: the model must understand screenshots in the input, and verification needs new methods.

There are two verification routes:

- **Browser agents**: the model observes the page and picks each next action — good for exploration (the topic of the next lecture, Computer Use Agents; the representative benchmark for such multimodal web agents is [VisualWebArena](https://arxiv.org/abs/2401.13649), 910 tasks, first-authored by L7 lecturer Jing Yu Koh).
- **Playwright scripts**: the model writes a repeatable check with `fill()`, `click()`, `expect()`, and `screenshot()` — good for fixed flows (see [Playwright assertions](https://playwright.dev/docs/test-assertions)).

The slide example is a contact form that accepts a whitespace-only name: change `value.length` to `value.trim().length`, then verify on two sides — behavior (blank names are not saved, valid ones still are) and appearance (the error is visible and readable next to the field; Playwright's `toHaveScreenshot()` can pixel-compare against a baseline screenshot, see [Playwright snapshots](https://playwright.dev/docs/test-snapshots)). A grading caveat: **an image in the issue does not make image similarity the grading rule**. SWE-bench Multimodal still grades patches with the repo's tests; for 69 tasks those tests are themselves visual tests that render the page and compare screenshots pixel by pixel, checking the rendered result rather than the image in the issue.

Neubig also admitted an observation that shook his assumptions: a few months ago GLM 5.2, a model that cannot read images, took first place on Design Arena. [Design Arena's note of June 19, 2026](https://notes.designarena.ai/how-glm-5-2-beat-fable-5-at-website-design) is more precise: GLM 5.2 ranked first overall on the single-turn, non-agentic HTML Web Design evaluation, without vision capabilities; the top spot has changed hands since. He still thinks multimodality matters, but what makes a good frontend agent is not settled.

## 7. Beyond the inner loop

Everything so far is the **inner loop**: edit, test, fix. The **outer loop** is everything else: requirements, code review, deployment and monitoring, maintenance. These are harder to define and harder to find training data for.

The slides cite Microsoft's [Meyer et al. 2019](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/04/devtime-preprint-TSE19.pdf) study of 5,928 self-reported workdays: developers spent about 15% of the day reading and writing code and tests, 25% on meetings and email, 14% debugging, 8% running tests, 6% on requirements and documentation, and 5% on code review. Fixing bugs is a small slice of the job.

Neubig compared development tasks by artifact, verifier, and horizon:

| Task | Artifact | Verifier | Horizon | Examples |
|---|---|---|---|---|
| Localization | Predicted files, modules, functions | F1 against gold-patch locations | One issue | [CodeScout](https://arxiv.org/abs/2603.17829) (RL for search agents; Neubig recommends it as a small-model project) |
| App building | A new app or an extended MVP | An LLM evaluator drives the browser through human-authored test plans | Many features | [ViBench](https://vibench.ai/): from scratch, extend a reference MVP, extend the agent's own earlier MVP |
| Library implementation | A whole package | Package tests, or matching a reference executable's behavior | Many functions | [Commit0](https://arxiv.org/abs/2412.01769), [ProgramBench](https://arxiv.org/abs/2605.03546) (given an executable and its documentation, write code that matches its behavior) |
| Evolution | Accumulated changes | Milestones and regressions | Dependent task chains | [SWE-Milestone](https://arxiv.org/abs/2603.13428): above 80% on isolated tasks, 38% in sequence |
| Test generation | A new test | Distinguishes buggy from fixed versions | One behavior | [SWT-Bench](https://arxiv.org/abs/2406.12952) |
| CI repair | Code or config | Push the fix to GitHub and rerun the failed Actions workflow | One build | [JetBrains LCA CI Builds Repair](https://huggingface.co/datasets/JetBrains-Research/lca-ci-builds-repair) (Python only for now) |

Neubig stressed two points. Long-horizon tasks like ProgramBench are the new challenge precisely because short-horizon tasks have become easy. And test generation is half the battle: **if you can write good tests that confirm an issue is solved, agents become very good at iterating against them**. For deployment tasks he knows of no good benchmark yet, since they need real infrastructure.

Last is transfer: can training on varied tasks improve agents on tasks they never saw? [SWE-Playground](https://arxiv.org/abs/2512.12216) and [Hybrid-Gym](https://arxiv.org/abs/2602.16819) (both with CMU involvement) automatically generate practice tasks like localization, dependency search, and function implementation. Hybrid-Gym's 32B model rises from 7% to 32.4% on SWE-bench Verified without training on it, with gains on SWT-Bench and Commit0 Lite as well.

## 8. Models that predict code behavior (from the slides)

This section ran out of class time; what follows is from the slides.

An ordinary agent's policy picks an action from its history, then actually runs it and observes. A **world model** adds a step: predict "if I run this test, what will happen?" Predictions can be wrong — treat `alias = items` as a copy and you mispredict `len(items)` after `alias.append(2)`.

Prediction helps when choosing between two candidate patches without running both. The risk is right there too: if the model says the correct patch A fails and the wrong patch B passes, you discard the right one. So evaluation must track task success alongside total cost (latency, tokens, tool calls). Representative work is Meta FAIR's [CWM](https://arxiv.org/abs/2510.02387) (an open-weights model trained on execution traces) and [Code World Models / GIF-MCTS](https://arxiv.org/abs/2405.15383).

The slides leave four open questions: do predictions actually lead to better decisions? Are they cheaper once latency and real environment calls are counted? Do they hold on unseen programs, dependencies, and environments? When should you give up on predicting and just execute?

## Try it: audit your own coding agent

1. **Turn a bug you fixed into a SWE-bench-style task**: record the pre-fix commit, the issue text, one FAIL_TO_PASS test, and a few PASS_TO_PASS tests — the three ingredients of a runnable task.
2. **Run once with bash only, once with an edit tool**: count how many calls are reads and edits, and whether sed escaping failed or search/replace hit an ambiguous match. That is Section 4's trade-off, measured on your own model.
3. **Inject a bug to test your tests**: mutate one condition as SWE-smith does and see whether your suite catches it. If not, fix the tests before putting an agent on the job.

## Where it sits in the course

L6 is the first Domain lecture after the Capabilities module, landing the pieces from the first five lectures (tools, context management, skills, planning) on the most mature application. The next post, [Assignment 1](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en), has you hand-write a ReAct harness that fixes SWE-bench tasks, using this lecture's harness definition, editing-tool trade-offs, and SWE-bench grading. [L7 Computer Use Agents](/en/posts/ai/2026-09-29-cmu-11768-lecture-07-computer-use-agents-en) (JY Koh) picks up the browser agents from the frontend section; [L8 SFT](/en/posts/ai/2026-09-29-cmu-11768-lecture-08-sft-en) and L9 RL Basics expand on the recurring "execution results as reward."

## Further reading

- On this site: [Reading Stanford CS329Z Week 9: coding agents](/en/posts/ai/2026-09-17-stanford-cs329z-week9-coding-agents-en) (SWE-agent's ACI and the OpenHands platform)
- On this site: [Edit tool trade-offs in coding agents](/en/posts/ai/2026-08-25-coding-agent-edit-tool-tradeoffs-en)
- On this site: [Toolset design philosophy in coding agents](/en/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy-en)
- On this site: [The verification gate in coding agents](/en/posts/ai/2026-08-25-coding-agent-verification-gate-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Checked the video content against its transcript. Two fixes: who said the InCoder cross-whitespace remark, and the Agentless author's title.

## References

- Course: [CMU 11-768 AI Agents website (schedule, slides, assignments)](https://www.cmu-agents.com/); the L6 slides and the lecture recording's transcript (auto-generated captions, used only to confirm what the lecturer said, never as the basis for a number)
- Lecturer background: [CMU School of Computer Science 2026 new faculty](https://scsbusinessoffice.cs.cmu.edu/new-faculty/2026.html)
- Pre-training: [StarCoder](https://arxiv.org/abs/2305.06161), [OLMo](https://arxiv.org/abs/2402.00838) (Table 2), [StarCoder2 tokenizer](https://huggingface.co/bigcode/starcoder2-3b/blob/main/tokenizer.json) (tested with the `tokenizers` library)
- Other training signals: [OctoPack](https://arxiv.org/abs/2308.07124), [DrRepair](https://proceedings.mlr.press/v119/yasunaga20a.html), [CodeRL](https://arxiv.org/abs/2207.01780), [CodeExecutor](https://aclanthology.org/2023.findings-acl.308/)
- Mid-training: [Code Llama](https://arxiv.org/abs/2308.12950), [Qwen2.5-Coder](https://arxiv.org/abs/2409.12186) (Table 3 and §3.2.2)
- Infilling: [InCoder](https://arxiv.org/abs/2204.05999) (Table 1, Table 5, appendix A.4), [Efficient Training of Language Models to Fill in the Middle](https://arxiv.org/abs/2207.14255)
- Evaluation: [Yin & Neubig 2017](https://aclanthology.org/P17-1041/), [CodeBLEU](https://arxiv.org/abs/2009.10297), [EvalPlus](https://arxiv.org/abs/2305.01210), [AlphaCode / CodeContests](https://arxiv.org/abs/2203.07814) (§3.2, Table 2), [CodeBERTScore](https://aclanthology.org/2023.emnlp-main.859/), [HumanEval / Codex](https://arxiv.org/abs/2107.03374), [NoFunEval](https://arxiv.org/abs/2401.15963), [DeepCoder](https://www.together.ai/blog/deepcoder)
- Agentic coding: [Agentless](https://arxiv.org/abs/2407.01489), [SWE-agent](https://arxiv.org/abs/2405.15793) (Table 3), [Codex apply-patch parser](https://github.com/openai/codex/blob/16ff14c266179e6a762dc8081e9dab73a96683e0/codex-rs/apply-patch/src/parser.rs), [LocAgent](https://arxiv.org/abs/2503.09089), [mini-SWE-agent](https://mini-swe-agent.com/latest/), [Aider edit formats](https://aider.chat/docs/more/edit-formats.html), [Aider unified diffs](https://aider.chat/docs/unified-diffs.html)
- Evaluation and training environments: [SWE-bench](https://arxiv.org/abs/2310.06770), [SWE-Gym](https://arxiv.org/abs/2412.21139), [R2E-Gym](https://arxiv.org/abs/2504.07164), [SWE-smith](https://arxiv.org/abs/2504.21798), [Multi-SWE-bench](https://arxiv.org/abs/2504.02605), [SWE-bench Multilingual](https://www.swebench.com/multilingual.html)
- Multi-harness training: [Nemotron 3 Super](https://arxiv.org/abs/2604.12374), [Nemotron 3 Ultra](https://arxiv.org/abs/2606.15007), [Polar](https://arxiv.org/abs/2605.24220)
- Frontend: [SWE-bench Multimodal](https://arxiv.org/abs/2410.03859), [VisualWebArena](https://arxiv.org/abs/2401.13649), [Playwright assertions](https://playwright.dev/docs/test-assertions), [Playwright snapshots](https://playwright.dev/docs/test-snapshots), [Design Arena: how GLM 5.2 ranked on website design (2026-06-19)](https://notes.designarena.ai/how-glm-5-2-beat-fable-5-at-website-design)
- Outer loop: [Meyer et al. 2019](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/04/devtime-preprint-TSE19.pdf) (Table 2), [CodeScout](https://arxiv.org/abs/2603.17829), [Commit0](https://arxiv.org/abs/2412.01769), [ProgramBench](https://arxiv.org/abs/2605.03546), [SWE-Milestone](https://arxiv.org/abs/2603.13428), [SWT-Bench](https://arxiv.org/abs/2406.12952), [ViBench](https://vibench.ai/), [LCA CI Builds Repair](https://huggingface.co/datasets/JetBrains-Research/lca-ci-builds-repair), [SWE-Playground](https://arxiv.org/abs/2512.12216), [Hybrid-Gym](https://arxiv.org/abs/2602.16819)
- Code world models: [CWM](https://arxiv.org/abs/2510.02387), [Code World Models / GIF-MCTS](https://arxiv.org/abs/2405.15383)
