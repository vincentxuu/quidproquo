---
title: "Reading CMU 11-768 L2: How Tool Use Turns Tokens into Actions — Schemas, Constrained Decoding, MCP, and Parallel Calls"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cmu-11768, ai-course, cmu, ai-agent, tool-use, function-calling, mcp]
lang: en
series:
  name: "Reading CMU 11-768 AI Agents"
  order: 2
tldr: "Neubig splits tool use into five layers: capabilities, mechanics, constraints, interfaces, and systems. A tool call is just tokens the model emits; the harness parses, validates, and matches results back by call ID. Constrained decoding guarantees form, not correctness. MCP's real value is credential brokering. And the same model served by different providers can swing from roughly 15% tool-call errors to under 0.1%."
description: "A guided reading of CMU 11-768 AI Agents Lecture 2, Tool Use: what tools are and when to call them, CodeAct and code as a meta-tool, chat templates and per-model tool-call formats, JSON Schema and XGrammar constrained decoding, REST/OpenAPI versus MCP credentials, parallel tool calls, and evaluation with BFCL and provider error rates."
draft: false
glossary:
  - term: "constrained decoding"
    aliases: ["grammar-constrained decoding"]
    definition: "Before sampling each token, a grammar decides which candidate tokens are legal; illegal logits are set to negative infinity, so the output is guaranteed to parse."
    context: "Used here to explain how XGrammar guarantees valid JSON tool calls, and what it cannot guarantee."
  - term: "CodeAct"
    aliases: ["programmatic tool calling"]
    definition: "Letting an agent act by writing an executable Python snippet instead of calling one JSON-formatted tool at a time."
    context: "Section two: code is a meta-tool that composes other tools, at the cost of being harder to constrain and needing a sandbox."
  - term: "call ID"
    aliases: ["tool_call_id"]
    definition: "A unique identifier for each tool call; the tool-result message carries the same ID so the model knows which result belongs to which call."
    context: "With parallel calls, results come back out of order and the call ID is the only way to match them."
---

> 🌏 [中文版](/posts/ai/2026-09-29-cmu-11768-lecture-02-tool-use)

**Video status: Videos included.** [Source details](#course-video-sources)

[CMU 11-768 AI Agents](https://www.cmu-agents.com/) is a Fall 2026 graduate course from Carnegie Mellon's Language Technologies Institute (LTI), taught by Daniel Fried and Graham Neubig. It runs from tools, context, memory, and planning through training, safety, and interaction. Lecture 2 (Aug 27; [slides](https://www.cmu-agents.com/slides/lecture-02-tool-use.pdf), [recording](https://www.youtube.com/watch?v=jXChFB4JSyw)) is Neubig on Tool Use. He opens with a definition: calling tools is the most fundamental thing that separates an agent from a language model.

This lecture is not "how to add a `tools` parameter to your API call." It cuts tool calling open from top to bottom: why models need tools, what a tool call looks like at the token level, how the harness parses and dispatches it, how to guarantee well-formed output, how REST and MCP differ, how to run calls in parallel, and how to evaluate the whole thing. These are exactly the pieces [Assignment 1 (Harness)](/en/posts/ai/2026-09-29-cmu-11768-assignment-1-harness-en) makes you write by hand. This guide follows the lecture order and flags where each section shows up in A1.

## Course video sources

Verified public recording for CMU 11-768 Fall 2026 lecture 2, published on course instructor Graham Neubig’s channel; its title and description identify this course.

```youtube
url: https://www.youtube.com/watch?v=jXChFB4JSyw
title: CMU AI Agents 2026: 2. Tool Use for Language Model Agents
```

Original videos: [CMU AI Agents 2026: 2. Tool Use for Language Model Agents](https://www.youtube.com/watch?v=jXChFB4JSyw)

Official sources:

- [cmu-11-768-ai-agents — official course materials and recording index](https://www.cmu-agents.com/#/schedule)

Checked on 2026-10-10.

## What a tool is, and when it's worth calling

The slides paraphrase the definition from the survey Neubig co-wrote with Fried, Zhiruo Wang, and others, [What Are Tools Anyway?](https://arxiv.org/abs/2403.15452): **a tool is an interface through which a language model can invoke an external computer program**. The paper's own wording is more precise: an LM-used tool is a function interface to a computer program that runs externally to the LM, where the LM generates the function calls and input arguments. The slide then adds the division of labor: the model proposes; external software decides whether and how to execute.

Tools help in two ways:

- **Extend**: do what the model fundamentally cannot. Parameters freeze at the training cutoff, so the model cannot know what time it is today without an external call.
- **Facilitate**: the model could do it, but an external program does it more reliably or faster. A reasoning model can grind through multiplying two seven-digit numbers; a calculator does it instantly.

The slides group use cases into four: fresh information (search), exact computation (calculator or Python), private state (account APIs), and external action (browser or API). The line under the table is the rule for the whole section: **call a tool only when its benefit outweighs latency, cost, failure, and risk.**

## Working backwards from ChatGPT to a tool list

Neubig had students list what they use ChatGPT for, then worked backwards to the tools behind each. Along the way he noted that ChatGPT is now an agent, because it calls tools iteratively to answer you. The five categories:

| Type | Example | Note |
|---|---|---|
| Text response | `finish(text)` | A harness control action, not an external program; you can also just end the loop when the model calls no tool |
| Retrieval | `search_web(query)` | Neubig's take: RAG isn't dead, it's so common people forget they're using it |
| Code execution | `execute_code(code)` | Runs a program in an isolated environment and returns its output |
| Image generation | `generate_image(query)` | The model usually rewrites your description heavily before sending it |
| Custom function | `create_grocery_cart(items)` | Exposes an application capability through one typed call |

The design order: start from the abilities you want, then define a narrow interface for each kind of interaction.

## Code as a meta-tool: CodeAct and its costs

One way to think about tools is to hand the agent fifty or seventy APIs and let it call one per step (or a few in parallel). But code is a special API: it has loops, variables, and libraries, and a snippet is itself a tree of function calls. Importing pandas gives you every tool in pandas.

Neubig's example: find the country where a given phone is cheapest among the US, Japan, Germany, and India. The old way calls an exchange-rate lookup, a price lookup, and a tax conversion, then repeats for each country. As code, it's one program. That is the claim of [CodeAct](https://arxiv.org/abs/2402.01030) (Xingyao Wang et al., ICML 2024): use executable Python as a unified action space. Comparing 17 models on API-Bank and the authors' new M³ToolEval, the paper reports up to 20% higher success rates and up to 30% fewer actions; the slide summarizes it as code winning on success rate for 12 of 17 models and on turn count for 12 of 17. Neubig added in class that this holds even for plain tool-calling tasks that traditionally didn't need code; that is indeed the kind of task the paper tests, but the paper doesn't state it as a separate finding.

So why not make everything code? Authority. The slides call code a high-power tool with three costs:

- **Expressive**: loops can spin forever, and your system needs a way to handle that.
- **Harder to constrain**: the action space is broad, validation is less precise than for a narrow typed function, and behavior is harder to predict.
- **Higher impact**: it touches files, network, and processes, and consumes memory, disk, and CPU. Neubig singled out supply-chain risk: an agent that installs a compromised library compromises your whole system.

Once you go programmatic, you need sandboxing, resource limits, permissions, and audit logs. That is saved for the safety lectures later in the course.

**In A1**: Part 3's `run_python` is programmatic tool calling, letting the chess agent compose `simulate_move` and `play_move` in Python inside a sandbox.

## Mechanics: a tool call is just tokens

The model never "executes" anything. It emits either a text continuation ("The weather is sunny") or a tool-call continuation (`<tool_call>get_weather(...)`), often both. Remember [ReAct](https://arxiv.org/abs/2210.03629) from [last lecture](/en/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent-en)? Today the ReAct loop is no longer separate glue code; it is a single completion containing reasoning tokens, a user-facing message, and tool calls in order. Reasoning is long private thought, the text is a short message for the user, and the tool call is the actual output.

The full path:

1. **Messages become model input.** System/user/assistant messages are JSON in the API; before reaching the model, a chat template serializes them into one sequence with special tokens, such as Qwen's `<|im_start|>system ... <|im_end|>`.
2. **Tool definitions go into the prompt.** The JSON Schema you pass in `chat.completions.create(..., tools=[weather_tool])` is placed by the template into a `<tools>` block.
3. **The model emits the call content**, and the API response attaches a unique call ID.

A student asked whether these special tokens must be in the vocabulary at pretraining. Neubig: not necessarily. They are usually added in post-training, on a moderate amount of data in the target format, followed by reinforcement learning.

**Every model family uses a different format**, and this is the easiest trap. The same `get_weather(city="Pittsburgh")` is `<function=...><parameter=...>` tags in Qwen, a `[TOOL_CALLS]` control token plus call ID in Mistral, and a DSML block in DeepSeek. One schema, model-specific serialization and parsing; a parser written for DeepSeek won't just work on Qwen. If you fine-tune an already-trained model, stick to its existing tool-call format. The good news is that Hugging Face's [`apply_chat_template`](https://huggingface.co/docs/transformers/chat_templating) wraps all this: pass `tools=` and each model's template serializes them ([tool-use example](https://huggingface.co/docs/transformers/chat_extras)). Neubig wants you to know what's underneath anyway, because when it breaks you have to read it.

Then the harness dispatches. The slides use [OpenHands' tool system](https://docs.openhands.dev/sdk/arch/tool-system): register tools at init as `tools_map[name]`, then on every model call run parse → look up → validate arguments → execute → return an observation carrying the call ID. Two failure points: validation (the model produced an invalid call) and runtime (a Python tool accepts any string, then errors when run). The OpenHands docs say validation failures become an error event (`AgentErrorEvent`) carrying the `tool_call_id`, sent back as a tool message so the model can recover; for runtime errors, the docs only describe MCP tools wrapping errors in observations. The design principle is the same either way: success or failure becomes a message the model can see, rather than crashing the harness.

Finally, the **call ID**. The tool-result message carries `tool_call_id` so results can be matched, including for parallel calls. Neubig's war story: if Anthropic's API sees a tool call with no matching result, it declares the history invalid and refuses to generate. The rule is in [Anthropic's tool-use docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls): a `tool_result` must immediately follow its `tool_use`, or the API returns an error. If your program crashes after the call but before recording the result, resuming gets stuck.

**In A1**: Part 1 has you assemble the system/user/assistant/tool message sequence yourself, and turn malformed JSON and unknown tools into recoverable observations instead of exceptions.

## Constrained decoding: form, not correctness

Models don't guarantee valid calls. Drop one closing brace and the JSON parser throws. Neubig said he has seen countless people try to patch missing brackets after the fact, and advised against it.

Constraints come in four levels:

| Level | Checks | Example |
|---|---|---|
| Syntax | valid JSON | braces balance |
| Shape | required fields present | has `city` |
| Types | field types right | `city` is a string |
| Values | value in allowed set | `units` is C or F |

All of this can be described in [JSON Schema](https://json-schema.org/draft/2020-12/json-schema-core.html); keywords like `type`, `enum`, and `required` are defined in its [Validation spec](https://json-schema.org/draft/2020-12/json-schema-validation.html). But the line at the bottom of the slide is the point: **constraints ensure form, not truth, permissions, tool choice, or task success.** A string that parses as Python can still be buggy.

<details>
<summary>From grammar to decoding: finite automata to XGrammar</summary>

Regular expressions correspond to regular grammars, which a finite automaton can parse. JSON Schema can't be expressed that way, because JSON nests arbitrarily deep; you need a context-free grammar (CFG). Parsing a CFG takes a pushdown automaton (PDA): finite state tracks which grammar rule you are in, and a stack remembers where nested rules return.

Why is `units: "K"` invalid? The rule is `unit → "C" | "F"`. Both are valid JSON; only `"F"` can be derived.

Hooked into an LLM: every time the model predicts next-token logits, ask the grammar whether each token is legal. Legal gets 1, illegal gets 0; illegal logits become negative infinity, then renormalize so probability goes only to legal tokens.

The hard part is that tokens and grammar boundaries don't line up: one token can span several terminals or stop partway through one, so checking happens at the byte level. [XGrammar](https://arxiv.org/abs/2411.15100) (Dong et al., MLSys 2025; the authors are mostly from CMU, with others from NVIDIA, SJTU, and UC Berkeley; Neubig said it came from people in CMU's Machine Learning Department) speeds this up by:

1. Splitting the vocabulary into context-independent tokens (validity precomputed and cached) and context-dependent tokens (under 1% in the paper's example, checked at runtime against the full stack).
2. Using persistent stacks to support branching.
3. Overlapping grammar computation with GPU inference.

The paper reports up to 100x speedup over existing solutions and near-zero overhead when combined with an inference engine.

</details>

Neubig posed a quiz: with constrained decoding on, when can you still get a broken call? Answer: **running out of output tokens**. The automaton stays on a legal path but hasn't reached a final state when max tokens cuts generation, and you get half a JSON object. In theory you could count remaining tokens and close early; he said it's fiddly to implement and invited students to build it into XGrammar.

## REST and MCP: shared schemas, different credential contracts

The same `get_weather` can reach an agent several ways:

1. **Library**: a Python function in `weather_lib.py`, well-typed but only callable in-process, usable through programmatic tool calling.
2. **REST API**: wrap it with [FastAPI](https://fastapi.tiangolo.com/tutorial/security/) as `GET /weather` and add API-key auth. You can block callers, and FastAPI [generates](https://fastapi.tiangolo.com/tutorial/first-steps/) an [OpenAPI](https://spec.openapis.org/oas/latest.html) description for you; OpenAPI's Schema Object is a superset of JSON Schema 2020-12, so you can feed it straight to the model.
3. **curl**: a coding agent with a shell reads the API description and builds a `curl` command itself. Simple, but **the agent's shell now holds the API credential**, which it can read or misuse.

Neubig admitted that when he first saw [MCP](https://modelcontextprotocol.io/specification/draft/server/tools) (the Model Context Protocol introduced by Anthropic) he thought it was unnecessary: we already have good ways to call APIs, so why run another program? What changed his mind was **credential brokering**.

In MCP, an AI application (the host) opens multiple clients, each connected to a server (stdio locally, HTTP remotely). [FastMCP](https://gofastmcp.com/integrations/openapi) can turn an OpenAPI spec directly into MCP tools. The key is two separate keys:

- `UPSTREAM_API_KEY` (say, your GitHub token) goes only to the MCP server, which uses it upstream.
- `MCP_API_KEY` goes to the agent and only authenticates it to the MCP server.

The model sees neither. Why it matters, in Neubig's words: give the agent your GitHub token, and if it one day decides pushing that token to a public repo is a good idea, your account is gone. Give it something relatively harmless if leaked, and keep the real credential on the server. The slides also note that static tokens are for teaching and development; production should verify JWTs or use OAuth.

| | OpenAPI / HTTP API | MCP |
|---|---|---|
| Shared | Names, descriptions, JSON Schema inputs | Same |
| Discovery | Fetch an OpenAPI document | Call `tools/list` at runtime |
| Invocation | HTTP verb + path + parameters | `tools/call` over an MCP transport |
| Auth | Client authenticates to the API | Client authenticates to MCP; upstream auth is separate |
| Scope | Describes HTTP operations | Also resources, prompts, and extensions |

In one line: OpenAPI describes a web API; MCP standardizes how an AI host discovers and invokes capabilities. MCP is an alternative interface, not a requirement for calling REST APIs. Neubig also mentioned the [official MCP registry](https://registry.modelcontextprotocol.io/) for finding existing servers.

## Parallel calls: only when there are no dependencies

Serial calls are slow. The slide example: generate 0.8s, weather 1.2s, generate, calendar 0.9s, generate, flights 1.1s, generate — about 6.4 seconds. If the three lookups are independent, emit three tool-call blocks in one generation and wait for the slowest: `2 × 0.8 + max(1.2, 0.9, 1.1) ≈ 2.8` seconds.

The limit: **parallelize only independent, safely concurrent calls**. Weather, calendar, and flight status are fine; "find customer ID → fetch orders with it → refund" must be sequenced. In practice, run them with `asyncio.gather` and keep the call IDs, since results come back out of order.

Neubig noted a paradox in today's agent world: **more expensive models can be cheaper per task**. Partly because they are smarter and pick the right approach; partly because newer models are much better at parallel calls, reading or writing a batch of files at once. Why did this improve roughly six months ago? A student got it: reinforcement learning. Penalize task duration hard during training and the model learns to fan out calls.

**In A1**: a chess move changes the board, so from a batch of parallel calls at most one `play_move` executes and the rest are rejected recoverably — the concrete version of "dependencies block parallelism."

## Evaluation: from tool selection to provider failures

Before evaluating end-to-end agent tasks, you need to evaluate tool use itself. The best-known benchmark is the [Berkeley Function-Calling Leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) (BFCL), now on version 4. It grew from single-step calls into single-turn (simple / multiple / parallel / parallel multiple), multi-turn (base, missing function, missing parameter, long context), agentic (web search, memory), and robustness (hallucination measurement, format sensitivity). Per the official pages, the overall score weights agentic at 40%, multi-turn at 30%, and hallucination measurement at 10%; format sensitivity is non-scoring and only run for prompt-based (non-native function-calling) models.

The slides' "evaluate the whole stack" table:

| Level | Question | Metric | Execution? | Typical failure |
|---|---|---|---|---|
| Selection | Right tool? | precision / recall | No | missing or extra call |
| Arguments | Right values? | AST / schema match | No | wrong field or value |
| Trajectory | Right order? | sequence success | Usually | bad dependency |
| Task | Goal achieved? | end-to-end success | Yes | plausible wrong answer |

Beyond correctness there are three operational dimensions: **efficiency** (latency, calls, tokens, cost — a correct agent can still be unusably slow or expensive), **reliability** (timeouts, retries, partial failure), and **safety** (policy, permissions, side effects; test adversarial tool outputs). Failures come from three places: the model (wrong tool, bad arguments, ignores the result), the harness (parsing, validation, ID mismatch), and the provider or tool (timeouts, rate limits, execution errors).

The most striking slide is [OpenRouter](https://openrouter.ai/)'s provider analytics (captured Aug 27, 2026): tool-call error rates for the same model across inference providers. That day the worst was Cloudflare at 15.1%, and the best (Mistral ZDR, Inceptron, Baseten) were at 0.01–0.06%. The chart doesn't name the model; the lecturer said they "all seem to be for GLM 5.3." Checking OpenRouter's [GLM 5.3 provider list](https://openrouter.ai/z-ai/glm-5.3/performance), Cloudflare, Venice, Morph, Mistral, Makora, Baseten, Inceptron, Reka, Decart, and SiliconFlow are all there; only io.net is missing. So it largely matches, but can't be confirmed outright. Same model; what differs is who serves it. The causes discussed in class:

- **Quantization**: in Neubig's experience, FP8 models make noticeably fewer bad calls than FP4; FP4 compresses too much, saving the provider money at the cost of quality.
- **Speculative decoding**: lossless versions shouldn't change outputs; lossy ones can.
- **No constrained decoding**: custom engines, or vLLM/SGLang configured differently, may not implement grammar constraints at all and rely on the model alone.
- **Flaky providers**: periodic failures take tool calls down with them.

So "it's the same model" is not a safe assumption. Production evaluation needs both benchmark accuracy and operational failure rates.

## Assigned readings

The schedule lists four:

- [What Are Tools Anyway?](https://arxiv.org/abs/2403.15452) (Wang, Cheng, Zhu, Fried, Neubig; COLM 2024): the source of this lecture's definition and extend/facilitate split; it also measures the compute each tooling method needs and the gains it brings.
- [CodeAct](https://arxiv.org/abs/2402.01030) (ICML 2024): code as a unified action space, plus the CodeActInstruct dataset of 7k multi-turn interactions.
- [Toolformer](https://arxiv.org/abs/2302.04761) (Schick et al., NeurIPS 2023): not unpacked in class, but it is where "models teach themselves to call tools" began. With only a handful of demonstrations per API, a self-supervised procedure teaches the model which API to call, when, and with what arguments, using five tools: a question-answering system, a Wikipedia search engine, a calculator, a calendar, and a machine translation system. It gives historical context to the lecture's point that tool tokens are added in post-training.
- [XGrammar](https://arxiv.org/abs/2411.15100) (MLSys 2025): the technical detail behind the constrained-decoding section.

## Something to do tonight

**Probe your harness for three holes.** Take the agent loop you have and feed it three things. One: have a tool return truncated JSON, and see whether the harness throws or hands the error back as an observation. Two: kill the program after a tool call but before the result is recorded, resume the conversation, and see whether the provider rejects the history for the missing result. Three: search for every API key in your system and check whether any of them is visible in the agent's shell environment; if so, consider putting an MCP server in front and giving the agent a secondary credential you can revoke at any time.

## Where it sits in the course

[L1](/en/posts/ai/2026-09-29-cmu-11768-lecture-01-what-is-an-agent-en) borrows Russell and Norvig's definition and frames an agent as a model in a loop that perceives and changes its environment through tools; L2 takes the "tools" part down to the token level. Next, [L3 Context Management](/en/posts/ai/2026-09-29-cmu-11768-lecture-03-context-management-en) deals with the consequence of using tools a lot: tool results take up more than a third of an agent's prompt, and context keeps growing until it no longer fits.

## Further reading

- [Reading CMU 11-768: series overview](/en/posts/ai/2026-09-29-cmu-11768-course-overview-en): a map of the whole course and index of posts
- [Reading Stanford CS329Z Week 3: tools and DSPy](/en/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy-en): another course on tools and DSPy from a system-design angle
- [MCP (Model Context Protocol): The Standardized Protocol for AI Agent Tool Invocation](/en/posts/ai/2026-03-22-mcp-model-context-protocol-en)
- [MCP vs CLI vs API: The Real Boundaries of Agent Tool Interfaces](/en/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface-en): complements this lecture's REST vs MCP section
- [Code Mode: Moving Tool Definitions from Context into Code](/en/posts/ai/2026-05-10-code-mode-mcp-runtime-pattern-en): the CodeAct idea implemented on top of MCP

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

All sources below were opened and checked in full (2026-09-29):

- [CMU 11-768 AI Agents course website](https://www.cmu-agents.com/)
- [Lecture 2 slides: Tool Use for Language Model Agents](https://www.cmu-agents.com/slides/lecture-02-tool-use.pdf)
- [Lecture 2 recording](https://www.youtube.com/watch?v=jXChFB4JSyw)
- [What Are Tools Anyway? A Survey from the Language Model Perspective (arXiv 2403.15452)](https://arxiv.org/abs/2403.15452)
- [Executable Code Actions Elicit Better LLM Agents / CodeAct (arXiv 2402.01030)](https://arxiv.org/abs/2402.01030)
- [Toolformer: Language Models Can Teach Themselves to Use Tools (arXiv 2302.04761)](https://arxiv.org/abs/2302.04761)
- [XGrammar: Flexible and Efficient Structured Generation Engine for LLMs (arXiv 2411.15100)](https://arxiv.org/abs/2411.15100)
- [ReAct (arXiv 2210.03629)](https://arxiv.org/abs/2210.03629)
- [Hugging Face Chat Templates](https://huggingface.co/docs/transformers/chat_templating)
- [Hugging Face Tool Use (chat_extras)](https://huggingface.co/docs/transformers/chat_extras)
- [OpenHands Tool System Architecture](https://docs.openhands.dev/sdk/arch/tool-system)
- [Anthropic: Handle tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls)
- [JSON Schema 2020-12 Core](https://json-schema.org/draft/2020-12/json-schema-core.html)
- [JSON Schema 2020-12 Validation](https://json-schema.org/draft/2020-12/json-schema-validation.html)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [FastAPI First Steps (generated OpenAPI)](https://fastapi.tiangolo.com/tutorial/first-steps/)
- [MCP Tools Specification](https://modelcontextprotocol.io/specification/draft/server/tools)
- [Official MCP Registry](https://registry.modelcontextprotocol.io/)
- [FastMCP OpenAPI Integration](https://gofastmcp.com/integrations/openapi)
- [FastMCP Token Verification](https://gofastmcp.com/servers/auth/token-verification)
- [Berkeley Function-Calling Leaderboard V4](https://gorilla.cs.berkeley.edu/leaderboard.html)
- [OpenRouter: GLM 5.3 provider performance page](https://openrouter.ai/z-ai/glm-5.3/performance)
