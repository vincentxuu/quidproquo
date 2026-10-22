---
title: "Seeing What an Agent Does: Drawing the Execution Trace from stream-json | Harvard CS2680 Assignment 1"
date: 2026-10-21
category: ai
type: guide
tags: [cs2680, ai-course, harvard, claude-code, coding-agent, course-guide]
lang: en
series:
  name: "Reading Harvard CS2680"
  order: 3
tldr: "CS2680 Assignment 1 has you build a web page that drives Claude Code: submit a task, watch live what the agent reads, what it runs, and how it turns out, then show how much it cost, how many seconds, and how many turns. The key is reading the event stream from `claude -p --output-format stream-json --verbose`: tool_use and tool_result pair up by the same id, and subagent events hang back under the step that dispatched them via parent_tool_use_id. This post breaks down the seven requirements, shows 40 lines of Python that build the events into a tree and tell success from failure, then covers submission, grading, and the places development most often gets stuck."
description: "Guide to Assignment 1 (Mads-Lens) of Harvard CS2680 Modern AI Systems (Fall 2026): the seven feature requirements, stream-json event types and pairing rules, rebuilding the tool-call tree in Python, the record-once-replay-many development approach, permission and account pitfalls, the writeup, and grading. Based on the public assignment page; no official solution."
draft: false
glossary:
  - term: "headless mode"
    aliases: ["print mode", "claude -p"]
    definition: "A Claude Code mode that runs one task without the interactive interface; started with the -p flag, it exits when done, which suits being called by another program."
    context: "The Assignment 1 web page launches Claude Code in headless mode behind the scenes."
  - term: "stream-json"
    definition: "A Claude Code output format that prints one line of JSON each time something happens during a run: one line, one event."
    context: "The Assignment 1 web page is, at heart, a renderer for this event stream."
---

> 🌏 [中文版](/posts/ai/2026-10-21-cs2680-assignment-1-mads-lens)

**Video status: The course is not recorded.** This post is based on the public assignment page; the code examples are this site's additions, not an official solution. [Source notes](#course-video-sources)

[Assignment 1](https://cs2680.com/assignments/assignment1) of [CS2680](https://cs2680.com/) is called Mads-Lens. It went out 9/2, was due 9/20, and is worth 10% of the grade. You build a web page that drives [Claude Code](https://code.claude.com/docs/en/overview): type a task on the page, the agent works in a folder you choose, and the page shows what it's doing as it goes. The assignment page says it's deliberately small and later assignments won't build on it; getting it running on your own machine is enough. It also suggests writing the front end itself with Claude Code: that's fastest, and watching an agent build the page tells you what the page should show.

This assignment follows [Lecture 2](/posts/ai/2026-10-21-cs2680-lecture-02-how-claude-code-works-en). Lecture 2 covers Claude Code's loop: the model proposes a tool to run, the harness executes it, the result goes back into context, and it repeats. Assignment 1 lets you watch that loop happen step by step.

This post answers one question: how do you turn the events Claude Code emits back into what it did at each step and what that cost? By the end you should be able to take a stretch of stream-json output, draw the order and nesting of the tool calls, and work out the step count and cost. This post gives no official solution and doesn't discuss choosing a web framework; the assignment page says any language and any web technology is fine.

Prerequisites: running commands in a terminal, reading JSON, and a bit of backend work (starting a subprocess and forwarding its output to a browser). The assignments overview estimates 4–6 hours. You can follow along without being enrolled: sign in to Claude Code with your own Claude subscription and set up a small project that has tests.

## What the assignment asks for

The assignment has three parts: drive Claude Code from the terminal first, then build the web page, then write the writeup. The page needs seven features. The assignment page only specifies what each must achieve; how it looks and how you build it is up to you:

| Feature | What it must do |
|---|---|
| 1. Submit a task | A text box sends a request that runs in the working folder you picked; when it finishes you can send another |
| 2. Live trace | Draw each event as it arrives, not all at once after the run; the agent's text is usually markdown and should be rendered |
| 3. Tool results | Each tool call's result is shown with the call; long ones are deliberately truncated and expandable |
| 4. Two levels of status | Each tool call is pending from the tool_use until its matching tool_result arrives, and errors must be visible; the whole run is in progress, finished, or failed, and a failure can't leave the page waiting forever |
| 5. Continue the conversation | The next question continues the same session, and the agent keeps the previous turn's context |
| 6. Show the numbers | When a run ends, show cost, elapsed time, and number of turns |
| 7. Tree view | Subagent events nest under the tool call that dispatched them, collapsibly; alongside it, an outline listing only tool names |

The assignment page also notes that the seven are only the floor. The first version an agent writes usually just meets the bar and isn't very pleasant to use, so use it yourself, find what's awkward, and improve it. The first section of the writeup lists those improvements.

> **Self-check**: Feature 4 requires that "a failed run is visible and the page doesn't wait forever." Which two cases do you need to handle?
> What a good answer covers: two cases. One, there is a result event but its `subtype` isn't `success` or it carries `is_error: true` (say, an error during execution), and it should show as failed. Two, there's no result at all (say, the working folder doesn't exist, or the subprocess exits outright), and you have to watch the subprocess's exit and error code, or the page gets stuck at "in progress."

## Step one: read the event stream

Before writing any web code, the assignment page has you run it once in the terminal and read through the events, because the part-two web page is a renderer for this stream:

```bash
claude -p "Say hello in one short sentence." --output-format stream-json --verbose
```

`-p` makes Claude Code run without the interactive interface (headless mode), and `--output-format stream-json` makes it print one line of JSON each time something happens. The assignment page notes that this mode also needs `--verbose`, and the stream-json examples in the [headless mode docs](https://code.claude.com/docs/en/headless) all include it.

For a run that uses tools, the events come in roughly this order (an illustration put together for this post, keeping only the key fields):

```json
{"type":"system","subtype":"init","session_id":"s-1","tools":["Read","Bash","Edit"]}
{"type":"assistant","message":{"content":[{"type":"text","text":"Reading the test first."},{"type":"tool_use","id":"t1","name":"Read","input":{"file_path":"tests/test_parse.py"}}]}}
{"type":"user","message":{"content":[{"type":"tool_result","tool_use_id":"t1","content":"def test_parse(): ..."}]}}
{"type":"assistant","message":{"content":[{"type":"tool_use","id":"t2","name":"Bash","input":{"command":"pytest -x"}}]}}
{"type":"user","message":{"content":[{"type":"tool_result","tool_use_id":"t2","content":"FAILED ...","is_error":true}]}}
{"type":"assistant","message":{"content":[{"type":"text","text":"The test fails in parse() because of a missing trailing newline."}]}}
{"type":"result","subtype":"success","num_turns":3,"duration_ms":42000,"total_cost_usd":0.21,"session_id":"s-1"}
```

Mapped line by line back to the Lecture 2 loop:

| Event | Meaning | Which step of the loop |
|---|---|---|
| `system` / `init` | Opening info: session id, available tools, model | The harness assembles the opening context |
| `assistant` with `text` | What the model says | Model inference |
| `assistant` with `tool_use` | The model "proposes" a tool and its arguments | Model proposes |
| `user` with `tool_result` | The harness ran the tool and sends the result back to the model | Harness executes; the result goes back into context |
| `result` | This turn is over, with cost, time, turns, and session id | The loop stops |

Note that `tool_result` sits inside a `user` event. You didn't type it: the harness hands the tool result back to the model in the user's role, and to the model a tool result is simply the next input.

> **Self-check**: In the example above, how many tool calls did the model propose in total? Did the last one succeed?
> Answer: Two (Read and Bash). The Bash tool_result carries `is_error: true`, so the test failed. But in this illustration the agent reads the failure, explains the cause, and ends normally, so the run's `subtype` is `success`. A tool failing and a run failing are two different things, and feature 4 shows them separately.

### Permissions and accounts: two places that trip people up

- **In headless mode there's nobody to click "Allow."** In interactive mode Claude Code asks you before editing files or running commands; in headless mode there's nobody to ask, so requests that need approval are simply denied. The assignment page suggests using `--dangerously-skip-permissions` to allow everything when pointed at a practice folder, or `--allowedTools` (for example `--allowedTools "Edit" "Bash(pytest:*)"`) to allow only specific tools. When your server launches the agent, it has to pass the same flags.
- **Watch who's paying.** The assignment requires signing in to Claude Code with your school account, not using the Agent SDK and not using an API key. The reason: an `ANTHROPIC_API_KEY` in your environment takes precedence over the signed-in account, so setting it quietly switches billing to your own account. If you're not enrolled, watch for the same thing. Also, `total_cost_usd` in the result is Claude Code's local estimate, not a bill ([CLI reference](https://code.claude.com/docs/en/cli-reference)).

## Building the events into a tree

Features 4 and 7 rest on two pairing rules, both stated on the assignment page:

1. **tool_use and tool_result pair by the same id**: the `id` of a `tool_use` equals the `tool_use_id` of the later `tool_result`. Until they pair, the call is pending.
2. **Subagent events hang back via `parent_tool_use_id`**: when Claude Code dispatches a subagent, all of the subagent's events carry `parent_tool_use_id`, set to the id of the tool call that dispatched it. For the main agent's events, this field is `null`.

Here's a stream that includes a subagent. The main agent Reads first, then dispatches a subagent (which runs one Grep of its own), then runs Bash and the test fails, and finally explains why (an illustration file made for this post):

<details>
<summary>Expand events.jsonl (11 lines)</summary>

```json
{"type":"system","subtype":"init","session_id":"s-1","model":"m","tools":["Read","Bash","Edit","Task"]}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"text","text":"Reading the test first."},{"type":"tool_use","id":"t1","name":"Read","input":{"file_path":"tests/test_parse.py"}}]}}
{"type":"user","parent_tool_use_id":null,"message":{"content":[{"type":"tool_result","tool_use_id":"t1","content":"def test_parse(): ..."}]}}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"tool_use","id":"t2","name":"Task","input":{"description":"survey src"}}]}}
{"type":"assistant","parent_tool_use_id":"t2","message":{"content":[{"type":"tool_use","id":"t3","name":"Grep","input":{"pattern":"TODO"}}]}}
{"type":"user","parent_tool_use_id":"t2","message":{"content":[{"type":"tool_result","tool_use_id":"t3","content":"src/parser.py:12: # TODO"}]}}
{"type":"user","parent_tool_use_id":null,"message":{"content":[{"type":"tool_result","tool_use_id":"t2","content":"parser.py has one TODO."}]}}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"tool_use","id":"t4","name":"Bash","input":{"command":"pytest -x"}}]}}
{"type":"user","parent_tool_use_id":null,"message":{"content":[{"type":"tool_result","tool_use_id":"t4","content":"FAILED tests/test_parse.py","is_error":true}]}}
{"type":"assistant","parent_tool_use_id":null,"message":{"content":[{"type":"text","text":"The test still fails in parse() because of a missing trailing newline."}]}}
{"type":"result","subtype":"success","num_turns":5,"duration_ms":42000,"total_cost_usd":0.21,"session_id":"s-1"}
```

</details>

Below is this post's teaching program: 40 lines of Python that build it into a tree. It only demonstrates the pairing logic and the end state; it isn't an assignment solution (the assignment wants a live-rendering web page):

```python
import json, sys

calls = {}      # tool_use id -> this tool call
roots = []      # main agent's calls, in order of appearance
summary = "run did not end normally"

for line in open(sys.argv[1]):
    line = line.strip()
    if not line:
        continue
    try:
        ev = json.loads(line)
    except json.JSONDecodeError:
        summary = "last line is incomplete; the run may have been interrupted"
        break
    parent = ev.get("parent_tool_use_id")
    if ev["type"] == "assistant":
        for block in ev["message"]["content"]:
            if block["type"] == "tool_use":
                call = {"name": block["name"], "status": "pending", "children": []}
                calls[block["id"]] = call
                (calls[parent]["children"] if parent in calls else roots).append(call)
    elif ev["type"] == "user":
        for block in ev["message"]["content"]:
            if block["type"] == "tool_result" and block["tool_use_id"] in calls:
                call = calls[block["tool_use_id"]]
                call["status"] = "error" if block.get("is_error") else "ok"
    elif ev["type"] == "result":
        ok = ev["subtype"] == "success" and not ev.get("is_error")
        state = "finished" if ok else f'failed ({ev["subtype"]})'
        summary = (f'{state} · ${ev["total_cost_usd"]:.2f} · '
                   f'{ev["duration_ms"] / 1000:.0f} s · {ev["num_turns"]} turns')

def show(call_list, depth=0):
    for c in call_list:
        print("  " * depth + f'{c["name"]} [{c["status"]}]')
        show(c["children"], depth + 1)

show(roots)
print(summary)
```

Feed it the `events.jsonl` above and the output is:

```text
Read [ok]
Task [ok]
  Grep [ok]
Bash [error]
finished · $0.21 · 42 s · 5 turns
```

Grep is indented under Task because its events carry a `parent_tool_use_id` pointing at the Task call. The tool that dispatches subagents is called `Task` in the assignment page's illustration and `Agent` in the Lecture 2 slides. The name changes between versions, so the program relies on `parent_tool_use_id` rather than hard-coding tool names.

Real streams are messier than this illustration, so the web version needs to be tolerant. Two subagent-related points are worth knowing up front (per the official docs as of 2026-10; this post hasn't verified them with a real run): in newer Claude Code versions subagents run in the background by default, so the dispatching call may first return a "started" result, with the subagent's events arriving afterward; and a subagent's own text isn't forwarded by default, appearing in the stream only with `--forward-subagent-text` ([sub-agents](https://code.claude.com/docs/en/sub-agents), [CLI reference](https://code.claude.com/docs/en/cli-reference)).

What the web version adds is turning this logic into "update the screen on every line read": insert a node when an event arrives, flip pending to done or error when a tool_result arrives, and show finished or failed when the result arrives.

> **Self-check**: If you interrupt a run halfway, what does the program above print?
> Answer: It depends on where it stopped. If it stopped cleanly between two events, the last line is "run did not end normally," and any call without a tool_result stays pending. If the last line was only half written, the program catches the `JSONDecodeError` and prints "last line is incomplete." Without that `try`, the program would crash and print nothing. The web version should show both as interrupted, not spin forever.

## How to develop it: record once, replay many times

The assignment page gives a very practical suggestion: first save one complete stream,

```bash
claude -p "<task>" --output-format stream-json --verbose > events.jsonl
```

then give your server a "replay mode" that reads this file instead of actually launching the agent. The simplest approach (this post's suggestion) is a flag such as `--replay events.jsonl`: when it's set, read the file line by line and pause 50 milliseconds between lines before sending each to the browser, so replay still shows whether the screen updates line by line. A real run takes over a minute and uses up quota; replay is instant and free, so you see the result of a one-line change right away. For the tree view, record a separate stream that dispatches a subagent (the assignment page suggests a prompt like "use a subagent to survey this directory").

But two things can only be tested by a real run, so always verify with one at the end:

- **Whether events are drawn as they arrive.** Replay reads the file in one go, so it can't show whether your server or browser is buffering output and sending it only at the end.
- **Whether the session can continue.** `--resume` needs a real session id: save the `session_id` from the result event, and next time launch with `claude -p --resume <session-id> "<next question>" …` so the agent keeps the previous turn's context.

Giving the agent a task worth watching matters too. An empty folder shows you nothing. The assignment page suggests a small project with a few files and tests, plus a concrete task that requires reading, running, and editing, such as "find the bug that makes test_parse fail and fix it."

> **Self-check**: Your page works fine on replay, but on a real run all the events appear at once at the end. Which part most likely has the problem?
> What a good answer covers: the output is being buffered. For example, the subprocess output isn't read line by line, the server doesn't forward line by line (SSE or WebSocket), or the response is sent as one chunk. Replay can't catch this, because the file is read in one go anyway.

## Security issues to watch

This page is essentially a "remote control": it launches a program that can read files and run commands. The assignment page's reminders:

- Running it on your own machine is enough; grading doesn't need a public URL.
- If you really put it on a cloud machine for other devices to reach, put a random token in front of it (for example from `openssl rand -hex 16`, kept out of the repo) and reject every request without it.
- Point the agent at a practice folder, not your home directory; your page, screenshots, and demo will show everything it reads.

The assignment page also says plainly not to use an agent framework or rewrite the agent loop yourself; that's Assignment 2.

> **Self-check**: When deploying to the cloud, why can't the token be committed to the repo?
> Answer: The repo is shared with the TAs and may be pushed elsewhere. Once the token leaks, anyone can use your page to read files and run commands on that machine.

## What goes in the writeup

You have to write the writeup yourself; the assignment page says a writeup generated entirely by AI loses points. Three sections:

1. **What you built**: a paragraph plus a screenshot, listing improvements beyond the seven features.
2. **What you learned**: three observations, each tied to a specific moment in a session. (1) How the agent works: where it spent more time than you expected, what it read that you wouldn't have; (2) a pitfall: what went wrong or surprised you, and how you found out; (3) a lesson: how you'll prompt, scope, and supervise next time you use an agent.
3. **One thing you'd change about Claude Code**: Claude Code itself, not your page; and say what you saw that made you want to change it.

## What to submit and how it's graded

| What | Where |
|---|---|
| Code, with a README on how to start the server | `assignment1/` in the course's shared private repo |
| Writeup | `assignment1/writeup.md` or `.pdf` |
| Claude Code session files | The same repo (required for every assignment) |
| A 2–3 minute demo video | Uploaded to Canvas |

The video is the main basis for grading: it should use a real multi-turn task to demonstrate all seven features, including one failed run and one run that dispatches a subagent. The seven features are 70% (10% each, judged from the video as complete, partial, or missing), the writeup 20% (mostly the second section, which must tie to observations from specific sessions), and visual design 10%.

So during development, have two recorded streams ready: one that fails and one that dispatches a subagent. Before recording, also make sure the follow-up question only makes sense if it builds on the previous turn.

> **Self-check**: Your page has all seven features, but the recording only shows one successful run. How many points does feature 4 get?
> What a good answer covers: partial or none. Features are judged from the video, and without a failed run on screen, the "failure is visible" half has no evidence.

## Final self-check

1. A run's result event says `num_turns: 12` and `total_cost_usd: 0.58`. If you want "average cost per turn," can you just divide? What should you watch for?
   Answer: You get about \$0.048 per turn, but that's only an average. Per the Lecture 2 loop, later turns carry a longer context and usually cost more than earlier ones. To see what each turn actually costs, look at the token usage of each model call, not the totals in the result.
2. Why does the assignment ask you to "draw each event as it arrives" rather than tidy everything into a nice report after the run?
   What a good answer covers: one learning goal of the assignment is watching the trace happen, seeing where the agent stops to wait on a tool and where it takes detours; look only after the run and all that's left is the outcome, not the process.
3. You want to add an "Allow / Deny" button so the agent asks you before running each command. Can you do that with the current headless command?
   What a good answer covers: not with the assignment page's flags alone: headless mode has nobody to ask, so requests needing approval are denied outright. Either allow tools in advance with `--allowedTools`, or use `--permission-prompt-tool` to route approval requests to your server so the page can show a button ([CLI reference](https://code.claude.com/docs/en/cli-reference)). The assignment page lists this as one of the optional extensions.

## Further reading

- [Claude Code headless mode guide](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide-en): other `-p` flags and how to use it in CI.
- [How Claude Code works](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en): the loop behind the events.
- [Course overview](/posts/ai/2026-10-21-cs2680-course-overview-en): where Assignment 1 sits in the course.

## Course video sources

- The course is not recorded ([policy page](https://cs2680.com/policy)). There's no recording to check the assignment against.
- Source: the [Assignment 1 page](https://cs2680.com/assignments/assignment1) and the [assignments overview](https://cs2680.com/assignments/), read on 2026-10-21. The event illustrations and Python program are this site's additions, with fields based on the assignment page and the [headless mode docs](https://code.claude.com/docs/en/headless); the program has been run against the `events.jsonl` in this post, a truncated stream, and a stream ending in `error_during_execution`.

## References

- [CS2680 Assignment 1: Experience a coding agent (Mads-Lens)](https://cs2680.com/assignments/assignment1)
- [CS2680 assignments overview](https://cs2680.com/assignments/)
- [CS2680 Lecture 2 slides: How Claude Code works](https://cs2680.com/slides/2_agent_use_1.pdf)
- [Claude Code docs: Run Claude Code programmatically (headless mode)](https://code.claude.com/docs/en/headless)
- [Claude Code docs: CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Claude Code docs: Subagents](https://code.claude.com/docs/en/sub-agents)
- [CS2680 course policy](https://cs2680.com/policy)
