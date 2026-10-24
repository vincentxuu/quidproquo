---
title: "Building a Coding Agent Harness by Hand: Four Tools and a Loop | Harvard CS2680 Assignment 2"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, coding-agent, agent-harness, swe-bench, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 6
tldr: "CS2680 Assignment 2 (Mads-Loop) has you write your own coding agent harness: with a fixed small model, qwen3.6-35b-a3b, it fixes real SWE-bench Pro issues inside Docker containers and logs every step in a required format. The assignment page says plainly not to trust the design it hands you, and some of the 10 tasks can't be solved. This post covers the spec, the places on the page worth doubting, the five places a harness most often breaks and how to handle each (with a snippet that has actually been run), how to build your own four-task eval set, and how to tell whether a task really is unsolvable. No official solution."
description: "Guide to Assignment 2 (Mads-Loop) of Harvard CS2680 Modern AI Systems (Fall 2026): model and endpoint, Docker task containers, the JSONL log schema, four tools and the agent loop, the parts of the handout to doubt, five harness failures and how to handle them, what to return for a broken tool call, the official SWE-bench Pro evaluation, building your own mytest eval set, and grading. Based on the public assignment page and starter files; no official solution."
draft: false
glossary:
  - term: "fail_to_pass / pass_to_pass"
    aliases: ["fail_to_pass", "pass_to_pass", "FAIL_TO_PASS", "PASS_TO_PASS"]
    definition: "The two test sets SWE-bench-style benchmarks use to decide whether a task is solved: fail_to_pass tests fail before the fix and must pass after it; pass_to_pass tests must pass both before and after, to catch a patch that fixes one thing and breaks another."
    context: "Assignment 2's official evaluation and your own tasks both use these two sets to decide RESOLVED."
  - term: "SWE-Bench Pro"
    definition: "A coding agent benchmark Scale AI released in 2025: 1,865 tasks from 41 repositories, longer than SWE-bench tasks and more often spanning several files. Besides the original issue, each task comes with human-written requirements and interface notes."
    context: "Assignment 2's 10 tasks and its hidden tasks all come from this benchmark."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-assignment-2-mads-loop)

**Video status: The course is not recorded.** This post is based on the public assignment page and starter files; the code snippets are this site's additions, not an official solution. [Source notes](#course-video-sources)

[Assignment 2](https://cs2680.com/assignments/assignment2) of [CS2680](https://cs2680.com/) is called Mads-Loop. It went out 9/21, was due 10/4, and is worth 10% of the grade. In Assignment 1 you watched Claude Code work; in this one you write your own: a model, a few tools, and a loop that fixes issues in real open-source repositories.

It follows [Lecture 4](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en). Lecture 4 wrote an agent as [a loop of twenty-odd lines](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en#lecture-2s-trace-as-twenty-odd-lines-of-code), driven by a fake model that replied from a script. Assignment 2 swaps the fake model for a real one, the fake tools for a real shell and real files, and the tasks for real issues from [SWE-Bench Pro](https://arxiv.org/abs/2509.16941). The loop is the same loop. The hard part is everything around it: what to do when the model sends a broken command, when a command never finishes, when the output is too long.

The question this post answers: how do you get four tools and a loop running on SWE-bench Pro without falling over? By the end you should be able to list five failures your harness has to handle and write one handling strategy for each.

Prerequisites: Lecture 4 (the loop, tool design, context management); Docker and git; reading Python. You don't need to be enrolled to follow most of it: the tasks come from the public SWE-Bench Pro, and the model, [Qwen3.6-35B-A3B](https://huggingface.co/Qwen/Qwen3.6-35B-A3B), has open weights, so you can point it at your own OpenAI-compatible endpoint.

## What the assignment asks for

You write a program called `madsLoop` with this interface:

```bash
python madsLoop.py -p "<problem statement>" [--log] <workdir>
```

`-p` is the task's issue text, and `<workdir>` is where the repository lives. The agent may only read, search, edit, and run commands inside that directory. When it finishes, the fix sits there as unstaged changes, and the grader takes the patch with `git diff`. The spec in brief:

| Item | What the assignment page requires |
|---|---|
| Model | `qwen3.6-35b-a3b`, for every evaluation |
| Endpoint | The course proxy `https://api.cs2680.com/v1`, OpenAI-compatible; the key goes in the `CS2680_API_KEY` environment variable, never in code or a commit |
| Environment | One prebuilt Docker image per task (about 1.6–1.8 GB) with the repository at the commit the task was written against (the base commit) and dependencies installed; the agent runs inside the container |
| Suggested tools | `bash(command)`, `read_file(path)`, `edit_file(path, old_string, new_string)`, `done(summary)`; you may change them |
| Tasks | 10, some of which can't be solved even with a perfect harness |
| Data the agent may use | Only the task content in `agent_task_input.json`; the grading file `task_test.json` and your own tasks' `gold.diff` must never be shown to the agent |
| Log | With `--log`, write JSONL to `madsLoop_logs/` using the required fields |

The model is a mixture-of-experts (MoE) model with 35B parameters in total, of which 3B are active per token. It has a native context of 262,144 tokens and runs in thinking mode by default ([model card](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)). The assignment page doesn't say what context limit the course proxy enforces, so measure it yourself.

An x86-64 Linux machine is the easy path. On an Apple Silicon Mac the images run under emulation, and the page asks you to set `PLATFORM_FLAG="--platform linux/amd64"`; expect slower runs. You can also use the course cluster.

### Only three hard requirements

The assignment page opens with a warning: Parts 0 and 1 describe a design choice, not the answer — "DO NOT TRUST IT." Only three things are fixed:

1. The model is `qwen3.6-35b-a3b`.
2. The grader can call `run_task.sh` and get an evaluable patch and the agent log.
3. The log follows the required schema.

The tool set, the system prompt, the loop's stopping condition, and how you manage context are all yours to change. One section of the writeup asks exactly that: where you departed from the handout, and why.

### The log format

The log is one event per line. Every line has `timestamp` (ISO-8601) and `event`; the other fields depend on the event:

| event | Required fields |
|---|---|
| `run_start` | `model_id`, `workdir` |
| `api_request` | `iteration`, `prompt_tokens`, `completion_tokens`, `total_tokens` (straight from `response.usage`) |
| `api_retry` | `iteration`, `error`, `backoff_s` |
| `tool_call` | `iteration`, `tool_name`, `arguments` |
| `tool_result` | `iteration`, `tool_name`, `result`, `is_error` |
| `run_end` | `reason` (`done` / `no_tool_calls` / `error` / a limit you set), `num_iterations` |

Two details are easy to miss. First, `result` in `tool_result` records the truncated version that was actually fed to the model, not the raw output, so whoever reads the log sees what the model saw. Second, the page asks you to stick to exactly these fields; print debugging output to stderr, not into the log.

This log is the same kind of thing as the [stream-json](/posts/ai/2026-10-21-cs2680-assignment-1-mads-lens-en) you read in Assignment 1: there you read the events someone else's agent emitted, and now your agent emits them. You also hand in `developer_logs/`, the session logs from the coding agent you used to build `madsLoop`.

> **Self-check**: At step 9, the model replies with text and no tool call, and the loop ends. What goes in `run_end`'s `reason`? Does this count as success?
> Answer: `no_tool_calls`. It isn't necessarily a success: the model stopped without calling `done`, which might mean it thinks it fixed the issue or that it gave up. Check whether `git diff` has content and whether the tests pass. This is also one of the cases the "doesn't converge" failure below has to handle.

## The parts of the handout to doubt

"Don't trust it" isn't a figure of speech. Read the page closely and there are a few places worth stopping at. This section only describes what you can see; what to do about it is your design decision.

**The tasks have three fields; by default one is passed.** In the starter's task file, `agent_task_input.json`, every task has three fields: `problem_statement`, `requirements`, and `interface`. The starter's `run_task.sh` passes only `problem_statement` to the agent. The scores reported in the SWE-Bench Pro paper use all three fields. The paper also compares a setting with the issue text alone: GPT-5's solve rate falls from 25.9% to 8.4%, roughly a third of the original ([paper](https://arxiv.org/html/2509.16941), Table 3; 50 turns and a \$2 cap per task).

**The sample system prompt mentions a tool that doesn't exist.** The sample system prompt in section 1.3 says to write reproduction checks under `/tmp` before editing and to "register each with `repro_check`", and the sentence breaks off there. The tool table in section 1.1 has no `repro_check`. Copy that sentence as is and the model will try to call a tool you never defined.

**The minimal tool set is a starting point.** Whether four tools are enough is the question Lecture 4 left open, and this is where you test it. [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) uses only bash; the other direction is adding purpose-built tools, such as search or running a specific test. Whether to change anything depends on where your logs show the model spending its steps.

**The model thinks before it answers by default.** The [model card](https://huggingface.co/Qwen/Qwen3.6-35B-A3B) says Qwen3.6 runs in thinking mode by default and produces a block of reasoning before each reply, which costs output tokens and time. The model card offers two switches: `enable_thinking` turns reasoning off, and `preserve_thinking` sends the reasoning from earlier messages back to the model as well. The assignment page doesn't say whether the course proxy accepts these parameters or which response field holds the reasoning; the first time you connect, print a full response and look.

> **Self-check**: The page says a task that can be solved by modifying Parts 0 and 1 counts as solvable. How does that affect how you decide which tasks are unsolvable?
> Criterion: "My agent didn't solve it" is not evidence that a task is unsolvable. Only after you've ruled out harness and prompt problems, and can point to a problem with the task itself (for example, the tests require behavior that nothing in the issue or the requirements supports), does it count as unsolvable.

## Where a harness breaks: five failures

Lecture 4 said Agent = Model × Harness. In Assignment 2 the model is fixed, and it's a small one, so whether your harness catches the model's mistakes shows up directly in the score. When the SWE-Bench Pro [paper](https://arxiv.org/html/2509.16941) analyzed failed trajectories, 42% of the open-weight Qwen3 32B's failures were tool-use errors, the highest among the models analyzed. That's a different model and a different outer framework (the scaffold, meaning the harness wrapped around the model), but the lesson carries over: models calling tools wrong is common, and the harness has to catch it.

### Teaching example: a broken tool call

When an OpenAI-compatible API returns a tool call, the arguments are in `function.arguments`. Its type is string, and its content is supposed to be JSON. The official SDK puts it bluntly: the model does not always produce valid JSON and may add parameters the schema doesn't define, so validate before calling ([openai-python](https://github.com/openai/openai-python/blob/main/src/openai/types/chat/chat_completion_message_function_tool_call.py)).

Suppose the model returns this at some step:

```json
{"id": "call_7", "type": "function",
 "function": {"name": "read_file", "arguments": "{\"path\": \"src/auth.py\""}}
```

The closing `}` is missing. The obvious code is `json.loads(arguments)`, which raises `JSONDecodeError` and stops the whole program. Three consequences:

- Every step this task has run so far is wasted.
- `git diff` may be stuck halfway through an edit.
- This tool call has no matching result message. Even if you catch the exception and keep going, the next API call is rejected because there's a call without a result (section 1.3 of the page).

The alternative: whatever goes wrong, return a tool message that tells the model what was wrong and how to fix it, so it can resend the call. The snippet below handles three kinds of bad output (broken JSON, a tool name that doesn't exist, a wrong argument name) and also catches exceptions the tool itself raises, such as reading a file that doesn't exist.

```python
import json

def run_tool_call(call, tools):
    """Run one tool call; always return a tool message so no exception stops the loop."""
    try:
        name = call["function"]["name"]
        raw = call["function"]["arguments"]      # a string, not guaranteed to be valid JSON
    except (KeyError, TypeError):
        return {"role": "tool", "tool_call_id": call.get("id", ""),
                "content": "Error: malformed tool call (missing function name or arguments)."}, True
    try:
        args = json.loads(raw)
    except json.JSONDecodeError as e:
        content, is_error = (f"Error: arguments for {name} are not valid JSON "
                             f"({e.msg} at char {e.pos}). Resend the call with a "
                             f"complete JSON object."), True
    else:
        if name not in tools:
            content, is_error = f"Error: unknown tool {name}. Available: {', '.join(tools)}", True
        else:
            try:
                content, is_error = str(tools[name](**args)), False
            except TypeError as e:               # missing or extra arguments (or a TypeError inside the tool)
                content, is_error = f"Error: bad arguments for {name}: {e}", True
            except Exception as e:               # the tool itself failed: missing file, string not found, ...
                content, is_error = f"Error: {name} failed: {type(e).__name__}: {e}", True
    return {"role": "tool", "tool_call_id": call["id"], "content": content}, is_error
```

Run it on the broken call above and you get:

```text
{"role": "tool", "tool_call_id": "call_7", "content": "Error: arguments for read_file are not valid JSON (Expecting ',' delimiter at char 22). Resend the call with a complete JSON object."}
is_error: True
```

The message carries the original `tool_call_id`, so the pairing isn't broken, and the model usually resends a complete call once it sees the explanation. `is_error` goes straight into the log's `tool_result`, so afterwards you can count how many bad outputs a task had and decide whether to change the prompt or the tool descriptions.

Given a file that doesn't exist, the same snippet returns `Error: read_file failed: FileNotFoundError: …` and the loop carries on.

This is only a snippet: `TypeError` covers both wrong arguments and errors inside the tool, so here the latter gets misreported as a bad-arguments error. Your version should validate the arguments first, with the schema or `inspect.signature`, and only then run the tool.

### Five failures and how to handle them

| Failure | What it looks like | One handling strategy | Where to look in the log |
|---|---|---|---|
| 1. Bad tool call | Arguments aren't valid JSON, the tool name doesn't exist, an argument's name or type is wrong | On a validation failure, return a tool message explaining the error, keep each call paired with a result, and let the model resend | `is_error` in `tool_result` |
| 2. Tool fails or hangs | A command exits non-zero, a test run never finishes, a command waits for interactive input | Connect stdin to `/dev/null`, give every bash command a timeout, and on timeout kill the whole process group (killing only the shell misses the processes it started), returning "timed out, terminated"; send the exit code and stderr back to the model | `result` in `tool_result` |
| 3. API call fails | The proxy returns 429 or 5xx, or the connection times out | Retry with exponential backoff up to a cap; past the cap, end with `error` rather than retrying forever | `error` and `backoff_s` in `api_retry` |
| 4. Context bloat | One `cat` of a large file, tens of thousands of lines of test output, and a few steps later you're past the context limit | Truncate before putting output back into the history: keep the head and tail, replace the middle with one line | `prompt_tokens` in `api_request` keeps climbing |
| 5. Doesn't converge | Reading the same files over and over, editing and reverting, stopping without calling `done` | Set a step or token limit and record it as your own `reason`; detect repeated calls and nudge the model to try something else | `reason` and `num_iterations` in `run_end` |

The [SWE-Bench Pro paper](https://arxiv.org/html/2509.16941) has a name for number 5: endless file reading. The agent keeps reading and searching, has gathered enough information, but never gets around to editing, and eventually times out. Number 4 follows directly from Lecture 4's point that context is a finite resource; the assignment page also says that at minimum you should truncate large outputs before appending them.

<details>
<summary>Why truncation should keep the tail: a worked example</summary>

```python
def truncate(text, limit=4000):
    """Keep the head and tail, replace the middle with one line; log this version as result."""
    if len(text) <= limit:
        return text
    half = limit // 2
    cut = len(text) - 2 * half
    return (text[:half]
            + f"\n... [{cut} characters omitted; rerun with grep/head/tail to see them] ...\n"
            + text[-half:])
```

Take test output of 2,000 lines (32,936 characters) whose last line is `FAILED tests/test_utils.py::test_version_check`. Truncated, it's 4,075 characters, and the last line is still that FAILED line. Keeping only the head would cut it off, and the model couldn't see which test failed. Test frameworks and compilers usually print their summary at the end, so the tail tends to matter more than the middle.

</details>

> **Self-check**: One task runs for 40 steps. In the log, `prompt_tokens` in `api_request` climbs from 3,000 to 120,000, and `run_end` says `error`. Which failure is most likely, and what do you check first?
> Answer: Number 4, context bloat; the end was probably going over the limit or the proxy rejecting the request. Find the steps where `prompt_tokens` jumps the most, then look at the `tool_result` just before: which command it was and how long its `result` is. Usually it's a read of a whole large file or a test run with a lot of output.

## Running in the container, with the official evaluation as ground truth

The assignment page says Part 2 can be trusted. The diagram below shows one task from start to grading; it plays step by step when you scroll to it, and you can use the buttons to stop at any step.

```flow-diagram
{
  "title": "One Assignment 2 task: from starting the container to the official evaluation",
  "lang": "en",
  "width": 660,
  "height": 430,
  "nodes": [
    {
      "id": "box",
      "label": "Task container",
      "x": 385,
      "y": 165,
      "w": 210,
      "h": 270,
      "shape": "group"
    },
    {
      "id": "host",
      "label": "run_task.sh\n(host)",
      "x": 100,
      "y": 90,
      "w": 140
    },
    {
      "id": "agent",
      "label": "madsLoop.py",
      "x": 385,
      "y": 90,
      "w": 140,
      "tone": "accent"
    },
    {
      "id": "repo",
      "label": "repo (/app)",
      "x": 385,
      "y": 240,
      "w": 140
    },
    {
      "id": "proxy",
      "label": "Course proxy\nqwen3.6",
      "x": 605,
      "y": 90,
      "w": 100,
      "shape": "chip"
    },
    {
      "id": "eval",
      "label": "Official eval\nhidden tests",
      "x": 100,
      "y": 240,
      "w": 140
    },
    {
      "id": "res",
      "label": "eval_results\n.json",
      "x": 100,
      "y": 365,
      "w": 110,
      "shape": "db"
    }
  ],
  "edges": [
    {
      "from": "host",
      "to": "agent",
      "step": 1,
      "label": "start",
      "labelAt": [
        188,
        72
      ]
    },
    {
      "from": "agent",
      "to": "proxy",
      "step": 2,
      "label": "send",
      "offset": 16,
      "labelAt": [
        502,
        124
      ]
    },
    {
      "from": "proxy",
      "to": "agent",
      "step": 3,
      "label": "response",
      "offset": 16,
      "labelAt": [
        502,
        50
      ]
    },
    {
      "from": "agent",
      "to": "repo",
      "step": 4,
      "label": "run tools",
      "labelAt": [
        373,
        168
      ],
      "labelSide": "left"
    },
    {
      "from": "repo",
      "to": "eval",
      "step": 5,
      "label": "git diff",
      "labelAt": [
        184,
        222
      ]
    },
    {
      "from": "eval",
      "to": "res",
      "step": 6,
      "label": "true/false per task",
      "labelAt": [
        112,
        302
      ]
    }
  ],
  "steps": [
    "On the host, run_task.sh pulls the task's image, starts the task container, mounts your code, and runs docker_env.sh to install dependencies",
    "madsLoop.py sends the whole messages list as a request to qwen3.6-35b-a3b behind the course proxy",
    "The model's response comes back with tool calls",
    "madsLoop.py runs the tools and edits files in the repo inside the container, puts the results back into messages, and returns to step 2 until it finishes",
    "When the run ends, the git diff is taken as the patch and handed to the official SWE-Bench Pro evaluation: apply it to a clean checkout, restore the tests, run the hidden tests",
    "The evaluation writes eval_results.json, true or false for each task"
  ]
}
```

Step 5 in the diagram skips a stretch: `run_task.sh` first saves the diff as a patch file per task, then `make_patches.py` bundles them into `patches.json`, which `evaluate.sh` hands to the official evaluation.

The containers don't come with the `openai` package, so `run_task.sh` first runs your `docker_env.sh` to install dependencies, then runs `madsLoop.py`. Before taking the diff, it also adds any files the agent created, so put the agent's reproduction scripts in `/tmp`, not in the repository. The starter `run_task.sh` also works around a few image quirks. For example, some images ship an old default Python, so it finds a 3.10+ interpreter to run your harness. The agent's bash tool still uses the image's own environment, so tests run under the same conditions as in grading.

To decide whether a task is solved, use the official SWE-Bench Pro evaluation script ([scaleapi/SWE-bench_Pro-os](https://github.com/scaleapi/SWE-bench_Pro-os)), the same one used for grading. It applies your patch to a clean checkout, restores the held-out test files, and runs the hidden tests. So editing test files gets the agent nothing: they're overwritten. The results go to `pro_eval/eval_results.json`, true or false per task, with per-task test logs alongside.

This is the only reliable feedback you have while tuning the harness. The model calling `done` and saying it's fixed doesn't mean the tests pass, and the tests the agent ran inside the container aren't necessarily the ones the grader runs.

## Building your own eval set

Tune a harness on only 10 tasks and it's easy to end up with something that solves only those 10. The assignment has you build four more, and they can't come from SWE-Bench Pro or any other agent benchmark. There are only two allowed sources: a real issue in an open-source repository (with the commit or pull request that closed it), or a bug you actually fixed or a feature you actually added in one of your own past projects.

Each task needs three things:

1. **One paragraph of description**: this is all the agent sees. Say what's wrong, how it shows up, and what counts as done. Write a single paragraph in the `problem_statement` field; keep the `requirements` and `interface` keys with empty-string values so the entry has the same shape as the given tasks.
2. **Tests that show it's fixed**: at least one `fail_to_pass` test that fails at the base commit and passes after the fix; `pass_to_pass` tests that pass both before and after, to catch a patch that fixes one thing and breaks another.
3. **A container**: a Dockerfile that builds an image with the repository at the base commit and every dependency installed, so the tests run without network access. Next to it goes `gold.diff`, the real fix. Applying it must turn every `fail_to_pass` test green; otherwise your tests themselves can't be trusted.

The official evaluation only knows SWE-Bench Pro tasks, so you write your own `verify.sh`: start a fresh container, reset the checkout, apply the patch, run the tests, and print `RESOLVED` only if every `fail_to_pass` test passes and no `pass_to_pass` test regresses. Run it with no patch to get the base-commit baseline.

The four tasks split into two groups. Two go in `solved_after_change.json`: your agent couldn't solve them at first and can after you changed something. Two go in `unsolved.json`: your agent still can't solve them when you hand in. The first group makes you explain what you changed and why that change turned failure into success, which amounts to running a controlled comparison. The second makes you be honest about your harness's limits.

> **Self-check**: You pick a bug from an old project of yours and write a `fail_to_pass` test, but after applying `gold.diff` the test still fails. What's wrong?
> Answer: Either the test or `gold.diff` is wrong, and the task can't be used yet. Maybe the test expects behavior that differs from the fix you made back then, or the Dockerfile's dependency versions differ from the ones you had. Fix it until `gold.diff` makes the test pass; only then can the task evaluate an agent.

## What to submit and how it's graded

| What | Where |
|---|---|
| `madsLoop.py`, the modules under `src/`, `docker_env.sh` | `assignment2/` in the shared private course repository |
| `developer_logs/` (coding agent sessions from development, jsonl) | Same |
| `mytest/` (`solved_after_change.json`, `unsolved.json`, `task_test.json`, each task's Dockerfile and `gold.diff`, `verify.sh`, 8 before/after logs) | Same |
| One-page writeup (`writeup.pdf`) | Same |
| 3-minute video | Uploaded to Canvas |

Grading:

- **Hidden tasks, 40%**: your `run_task.sh` is run on the given tasks plus a set of hidden SWE-Bench Pro tasks and graded with the official evaluation. The score is the fraction solved among the solvable tasks; all hidden tasks are solvable. The page also says that getting a PASS on an unsolvable task loses points, without saying more about how that's judged.
- **Writeup, 40%**: 20% for which given tasks you judge unsolvable, with reasons and evidence; 10% for how your design differs from the handout; 10% for the four `mytest/` tasks. The writeup has a hard one-page limit, and the page requires it to be entirely your own work, with no AI-generated text.
- **Video, 20%**: walk through the code's entry point, tools, loop, and how conversation state is kept, then explain which change turned the two `solved_after_change.json` tasks from failing to passing.

Grading clones your repository and runs `run_all.sh` from `assignment2/`. That script, `evaluate.sh`, and `make_patches.py` are the course's own copies, so changing yours has no effect. You can change `run_task.sh`, but `run_all.sh` must still be able to call it.

> **Self-check**: Some of the 10 tasks are unsolvable. Your agent solves 6. How do you know whether your harness is good enough?
> Criterion: Look at where each of the 4 unsolved tasks failed, not just at 6/10. Read the logs and sort each one: the harness didn't catch something (bad output, timeout, context blowup, no convergence), the model wasn't capable enough (it saw what it needed to but went the wrong way), or the task itself has a problem. The first two are what you can still improve; only the third belongs in the writeup as an unsolvable task.

## Final self-check

1. You set the bash timeout to 30 seconds, but one task's full test suite takes 2 minutes, so every test run the agent makes comes back "timed out." Should you raise the timeout or change something else?
   Criterion: Either can be right, but decide from the log. If the tests are just slow, raise the timeout or teach the model in the tool description to run only the relevant test file. If the command is waiting for input or stuck in an infinite loop, raising the timeout only wastes more time.
2. Why does `result` in `tool_result` record the truncated version rather than the raw output?
   Criterion: The log exists to reconstruct what the model saw. Record the raw output and you'll think the model saw an error line that had actually been cut.
3. The minimal loop on the assignment page is "if there are tool calls, run them; otherwise stop." What does this stopping condition miss?
   Criterion: At least one of: the model ends with text without calling `done` (it may not have fixed anything); the model keeps making tool calls forever (you need a step or token limit); the model calls `done` but its changes don't pass the tests.

## Further reading

- [CMU 11-768 Assignment 1: build an agent harness by hand](/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en): the same kind of assignment from another course, one ReAct loop across three tasks.
- [CMU 11-768 Lecture 6: Coding Agents](/posts/ai/2026-09-29-cmu-11768-lecture-06-coding-agents-en): the SWE-bench family of benchmarks and how coding agents evolved.
- [Lecture 4: tool design and context engineering](/posts/ai/2026-10-21-cs2680-lecture-04-tool-design-context-engineering-en): the design basis for this assignment.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)). There's no recording to check the assignment against.
- Source: the [Assignment 2 page](https://cs2680.com/assignments/assignment2) and its starter archive `assignment2.tar.gz` (the task list, `run_task.sh`, `run_all.sh`, `evaluate.sh`), read on 2026-10-22. The Python snippets and the truncation example are this site's additions; they have been run, and their output matches what's shown here.

## References

- [CS2680 Assignment 2: Build an agent harness (Mads-Loop)](https://cs2680.com/assignments/assignment2)
- [CS2680 course homepage and grading](https://cs2680.com/)
- [Deng et al., SWE-Bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks? (arXiv 2509.16941)](https://arxiv.org/abs/2509.16941)
- [scaleapi/SWE-bench_Pro-os: the official evaluation scripts](https://github.com/scaleapi/SWE-bench_Pro-os)
- [Qwen3.6-35B-A3B model card (Hugging Face)](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [OpenAI: Function calling guide](https://platform.openai.com/docs/guides/function-calling)
- [openai-python: tool call type definition and the note on arguments](https://github.com/openai/openai-python/blob/main/src/openai/types/chat/chat_completion_message_function_tool_call.py)
- [SWE-agent/mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent)
- [CS2680 Lecture 4 slides: Agent Design I](https://cs2680.com/slides/4_agent_design_1.pdf)
- [CS2680 course policy](https://cs2680.com/policy)
