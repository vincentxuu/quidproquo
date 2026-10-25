---
title: "How to Build Multi-Agent Systems with Google ADK: Graph Workflows, Built-in Evaluation, and How Tied It Is to Google Cloud"
date: 2026-10-25
category: ai
type: deep-dive
tags: [google-adk, ai-agent, multi-agent, agent-framework, evaluation, open-source]
lang: en
tldr: "ADK 2.0 replaces fixed Sequential, Parallel, and Loop agents with graph workflows of nodes and edges. The built-in adk eval is Python-only, models are swappable, but managed memory and deployment options cluster around Google Cloud. Apache-2.0, roughly biweekly Python releases, so pin your version."
description: "A guide to Google ADK's agent types, tools and MCP, sessions and memory, callbacks, evaluation, and deployment options, with the cost of upgrading to 2.0 and how far the Google Cloud dependency reaches."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-25-google-adk-multi-agent-framework)

If you are weighing [Google ADK](https://github.com/google/adk-python) (Agent Development Kit) for a multi-agent system, three decisions are on the table: whether the flow between agents should be left to the model or written as a fixed graph, whether the built-in evaluation is enough, and how much of the stack depends on Google Cloud. This guide is current as of 2026-10-25 and describes the Python release 2.13.0 ([published October 22](https://github.com/google/adk-python/releases/tag/v2.13.0)); differences in other languages are marked where they matter.

## What it is

ADK is Google's open-source agent development framework. It is [licensed under Apache-2.0](https://github.com/google/adk-python/blob/main/LICENSE) and comes in [Python, TypeScript, Go, Java, and Kotlin versions](https://adk.dev/). The [README](https://github.com/google/adk-python) positions it as optimized for Gemini but model-agnostic and deployment-agnostic. The Python version requires Python 3.11 or later and [ships roughly every two weeks](https://github.com/google/adk-python).

Version 2.0 is the background to know first. [Python 2.0 reached general availability this May](https://adk.dev/2.0/), and the execution engine changed from a hierarchical agent executor to a graph-based Workflow Runtime in which agents, tools, and plain functions are all nodes in a graph.

Tool calling, sub-agent delegation, MCP clients, and sessions exist in most agent frameworks, so you do not need ADK to get them; the site's [framework selection guide](/posts/ai/2026-08-22-agent-framework-selection-guide-en) compares seven other frameworks. What ADK puts together in one framework is five language versions, [an evaluation command and a dev Web UI shipped with the framework](https://github.com/google/adk-python), and `adk deploy` commands for Docker and Cloud Run.

## Who it is for

It suits teams that want to mix deterministic flow with model judgment in one system, for example letting a model classify and then handling the result and its side effects in plain functions. You should be comfortable with async code, because the Runner returns each step as a [stream of Events](https://adk.dev/sessions/session/), and with Pydantic for input and output schemas.

To get started you only need a Gemini API key; the [official quickstart](https://adk.dev/get-started/python/) just writes `GOOGLE_API_KEY` into `.env`. Teams already on Google Cloud can chain the managed services together. If you are not, the Limits section lists what you have to supply yourself.

## Content map

### Agents and orchestration

The basic unit is [`Agent`](https://adk.dev/agents/llm-agents/) (alias `LlmAgent`): a model, an instruction, and a set of tools, with the model deciding what to do. To pin the flow down, 2.0 offers [`Workflow`](https://adk.dev/graphs/): nodes can be agents, tools, or plain functions, edges set the order, and a classifier node that returns `Event(route=...)` branches the flow. For control flow a static graph cannot express, [dynamic workflows](https://adk.dev/graphs/) on the same page let you write loops and conditions in code.

The other route is [collaboration mode](https://adk.dev/workflows/collaboration/): a coordinator agent holds `sub_agents`, and each sub-agent is set to `chat`, `task`, or `single_turn`. A `single_turn` agent has no user interaction and can run in parallel; a `task` agent can ask the user for clarification and returns to the coordinator automatically when done.

The `SequentialAgent`, `ParallelAgent`, and `LoopAgent` common before 2.0 are [described in the docs as superseded by graph workflows](https://adk.dev/agents/workflow-agents/) (Python and Go). The [TypeScript version logs a deprecation warning when you construct them](https://adk.dev/2.0/), and the [2.13.0 release notes](https://github.com/google/adk-python/releases/tag/v2.13.0) list a documentation fix that marks them deprecated. The site's [framework overview](/posts/ai/2026-04-01-agent-frameworks-2026-en) still describes these three agents, which reflects the pre-2.0 state.

### Tools and MCP

A Python function placed in `tools` is [wrapped as a FunctionTool automatically](https://adk.dev/agents/llm-agents/), and another agent wrapped as an `AgentTool` can serve as a tool too. MCP goes through [`McpToolset`](https://adk.dev/tools-custom/mcp-tools/), which supports stdio, SSE, and Streamable HTTP; the docs recommend a `tool_filter` so only the tools you need are exposed. In the other direction, `to_mcp_server` wraps ADK tools as an MCP server. For MCP background, see the site's [MCP introduction](/posts/ai/2026-03-22-mcp-model-context-protocol-en).

The same page has a trade-off table. With `McpToolset`, tool definitions and outputs all enter the main agent's context, which keeps cost low and latency predictable. With `AgentTool`, a sub-agent's intermediate reasoning and bulky output stay inside the sub-agent, at the price of extra model calls. Tools that need human approval can [set `require_confirmation`](https://adk.dev/tools-custom/confirmation/); that feature is currently marked experimental.

### Callbacks and sessions

[Callbacks](https://adk.dev/callbacks/) have before and after hooks at the agent, model, and tool levels. Returning `None` lets execution continue; returning an object replaces the default behavior, so a `before_model_callback` that returns an `LlmResponse` skips the model call. The docs recommend Plugins over callbacks for security guardrails because they modularize better.

A conversation is a Session holding an Events history and a state scratchpad; long-term data across conversations goes to a [MemoryService](https://adk.dev/sessions/). [SessionService comes in three implementations](https://adk.dev/sessions/session/): in-memory (gone on restart), `DatabaseSessionService` (any SQLAlchemy-compatible database, with an async driver), and `VertexAiSessionService` (managed on Google Cloud). [Memory ships with three](https://adk.dev/sessions/memory/): in-memory (keyword matching), Vertex AI Memory Bank (an LLM extracts and consolidates memories), and Vertex AI RAG; 2.13.0 also adds [experimental MongoDB session and memory services](https://github.com/google/adk-python/releases/tag/v2.13.0). For a side-by-side look at managed memory services, see the site's [cloud memory API comparison](/posts/ai/2026-09-19-cloud-platform-memory-apis-en).

### Evaluation

Evaluation is the most distinctive part of ADK. The [data formats](https://adk.dev/evaluate/) are `*.test.json` test files (one session each, used like unit tests) and evalsets (multiple long conversations, used like integration tests), both defined by Pydantic models; each turn records the user input, the expected tool-call trajectory, expected intermediate agent responses, and the final response. You can run them four ways: the Eval tab in `adk web` (save the current conversation as an eval case), `pytest`, `adk eval`, and `adk conformance`, which replays recorded baselines.

The [criteria](https://adk.dev/evaluate/criteria/) cover tool-trajectory matching (`EXACT`, `IN_ORDER`, `ANY_ORDER`), ROUGE-1, LLM-judged semantic matching, custom rubrics, hallucination and safety checks, and multi-turn task success. Four cost metrics are always on and report without passing or failing a case: tool-call count, model-call count, tokens, and duration. With no configuration, the [defaults](https://adk.dev/evaluate/) are `tool_trajectory_avg_score` at 1.0 and `response_match_score` at 0.8.

### Deployment, observability, and cloud coupling

`adk web` and `adk run` are for local development, and the [quickstart says outright that the Web UI is not for production](https://adk.dev/get-started/python/). The [deployment targets](https://adk.dev/deploy/) are Agent Runtime (a managed service on Agent Platform), Cloud Run, GKE, or any environment that runs containers. Observability uses the [OpenTelemetry GenAI semantic conventions exported over OTLP](https://adk.dev/observability/traces/), so backends such as Cloud Trace, Jaeger, Grafana Tempo, or Datadog work. Agents across services can use [A2A](https://adk.dev/a2a/intro/), where `RemoteA2aAgent` lets you call a remote agent like an in-process sub-agent; for splits inside one application the docs recommend plain sub-agents. The site's [protocol layer article](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en) covers how the two protocols divide the work.

To see how much remains usable outside Google Cloud, go item by item:

| Item | Without Google Cloud? | Source |
|---|---|---|
| Models | Yes. Gemini directly; Claude, OpenAI, Ollama, vLLM, and others through connectors or LiteLLM | [Models page](https://adk.dev/agents/models/) |
| Sessions | Yes. In-memory or `DatabaseSessionService`; only `VertexAiSessionService` needs GCP | [Session page](https://adk.dev/sessions/session/) |
| Memory | The built-in options without GCP are in-memory and the [experimental MongoDB service](https://github.com/google/adk-python/releases/tag/v2.13.0) added in 2.13.0; Memory Bank and the RAG service need GCP | [Memory page](https://adk.dev/sessions/memory/) |
| Evaluation | Local checks such as trajectory matching and ROUGE work; safety, multi-turn task success, and similar criteria delegate to Google's evaluation service | [Criteria page](https://adk.dev/evaluate/criteria/) |
| Deployment | Yes, package a container and run it yourself; the managed options cluster on Google Cloud | [Deploy page](https://adk.dev/deploy/) |
| Tracing | Yes, OTLP is vendor-neutral | [Traces page](https://adk.dev/observability/traces/) |

## A concrete example

Start with a graph workflow. The code below is the routing example from the official [Graph-based agent workflows](https://adk.dev/graphs/) page, with only the layout adjusted and imports added:

```python
from google.adk import Agent, Event, Workflow

process_message = Agent(
    name="process_message",
    model="gemini-flash-latest",
    instruction="""Classify user message into either "BUG", "CUSTOMER_SUPPORT",
      or "LOGISTICS". If you think a message applies to more than one category,
      reply with a comma separated list of categories.
   """,
)

def router(node_input: str):
    routes = node_input.split(",")
    routes = [route.strip() for route in routes]
    return Event(route=routes)

def response_1_bug():
    return Event(message="Handling bug...")

def response_2_support():
    return Event(message="Handling customer support...")

def response_3_logistics():
    return Event(message="Handling logistics...")

root_agent = Workflow(
    name="routing_workflow",
    edges=[
        ("START", process_message, router),
        (
            router,
            {
                "BUG": response_1_bug,
                "CUSTOMER_SUPPORT": response_2_support,
                "LOGISTICS": response_3_logistics,
            },
        ),
    ],
)
```

The model only classifies; which branch runs is decided by `router`, an ordinary function, and any branch could be swapped for a tool, a function, or another agent. The docs contrast this with packing the same procedure into one long instruction, where the more steps there are, the harder it is for the agent to follow every one.

Next, collaboration mode. This is adapted from the official [Build collaborative agent teams](https://adk.dev/workflows/collaboration/) page, with the tool and schema definitions and the model settings omitted:

```python
from google.adk import Agent

weather_agent = Agent(
    name="weather_checker",
    mode="single_turn",         # no user interaction
    tools=[get_weather, user_info, geocode_address],
)
flight_agent = Agent(
    name="flight_booker",
    mode="task",                # can ask the user questions
    input_schema=FlightInput,
    output_schema=FlightResult,
    tools=[search_flights, book_flight],
)
root = Agent(
    name="travel_planner",      # coordinator
    sub_agents=[weather_agent, flight_agent],
    # per the docs, a delegation tool named after each sub-agent is generated automatically
)
```

Finally, evaluation. The command shape and default criteria come from the official [evaluate page](https://adk.dev/evaluate/):

```bash
adk eval \
    <AGENT_MODULE_FILE_PATH> \
    <EVAL_SET_FILE_PATH_OR_ID> \
    --config_file_path=<PATH_TO_TEST_JSON_CONFIG_FILE> \
    --print_detailed_results
```

```json
{
  "criteria": {
    "tool_trajectory_avg_score": 1.0,
    "response_match_score": 0.8
  }
}
```

This config is also what you get when you specify nothing. For the LLM-judge variants, see the `final_response_match_v2` and `rubric_based_tool_use_quality_v1` examples on the [criteria page](https://adk.dev/evaluate/criteria/).

## Limits

**2.0 is an upgrade that touches existing code.** The [incompatibilities the docs list](https://adk.dev/2.0/) include: Events gain `node_info` and `output` fields, so a custom SessionService with fixed columns needs a schema change; custom agents that override `_run_async_impl` have the override bypassed by the graph engine; and a broad `except Exception` inside a tool defeats the new automatic retries. 2.13.0 then switched the [default telemetry schema to OpenTelemetry GenAI v2](https://github.com/google/adk-python/releases/tag/v2.13.0), so keeping the old format means setting an environment variable. If you cannot upgrade yet, [`pip install "google-adk~=1.0"`](https://adk.dev/2.0/) keeps you on 1.x.

**Features are uneven across languages and modes.** [Collaboration mode is listed for Python and Go 2.0 only](https://adk.dev/workflows/collaboration/), `task` agents must be leaf agents, and the docs still say `task` mode is disabled inside graph workflows in Python v2.0.0, so test it on the version you plan to use. [Graph workflows are incompatible with some third-party integrations](https://adk.dev/graphs/). The experimental tool confirmation lists, under its [known limitations](https://adk.dev/tools-custom/confirmation/), that it does not support `DatabaseSessionService` or `VertexAiSessionService`, which means neither persistent session store works with it. Also, using `output_schema` together with `tools` is natively supported only on certain models such as Gemini 3.0; [other models fall back to a `set_model_response` tool that the docs themselves say may be unreliable](https://adk.dev/agents/llm-agents/).

**Evaluation is Python-only, and some criteria need Google's services.** The [evaluation docs list Python support](https://adk.dev/evaluate/), and criteria such as `safety_v1` and multi-turn task success [delegate to the Agent Platform Eval SDK and require a Google Cloud project](https://adk.dev/evaluate/criteria/). The default `tool_trajectory_avg_score` demands an identical trajectory, so a model taking a different reasonable path counts as a failure; you will usually switch to `IN_ORDER` or `ANY_ORDER`. With user simulation, criteria that need a reference answer cannot be used. If you wire `adk eval` into CI, check that you are on 2.13.0 or later: the [release notes list "exit code now reflects passed/failed" as a fix in that version](https://github.com/google/adk-python/releases/tag/v2.13.0).

**Cloud coupling sits in the managed layer.** Models are swappable, but the LiteLLM route comes with a [March 2026 supply-chain incident](https://adk.dev/agents/models/litellm/), and the docs tell anyone using the `eval` or `extensions` extras to update immediately. Agent Runtime is a [paid service with a free tier](https://adk.dev/deploy/agent-runtime/). A Cloud Run deployment without `--session_service_uri` and `--artifact_service_uri` [falls back to in-memory services, so data disappears when an instance restarts](https://adk.dev/deploy/cloud-run/). Teams outside Google Cloud will wire up the container, the database, and the memory layer themselves.

## How to use it

1. **Decide which steps to hard-code.** Use `Workflow` for flows with a fixed order and costly mistakes (approvals, payments, database writes), letting the model only classify or generate. Use a coordinator with `sub_agents` for open-ended work where sub-tasks need judgment.
2. **Start locally.** Run `pip install google-adk`, create a project with `adk create my_agent`, put `GOOGLE_API_KEY` in `.env`, run `adk web` from the parent directory, and try a few conversations in the Web UI.
3. **Save a good conversation as an eval case.** Add the current session in the Eval tab, then rerun it with `adk eval` and a config file. Start trajectory checks with `IN_ORDER`, and confirm the version your CI uses is at least 2.13.0.
4. **Pick the session and memory backends before deploying.** `DatabaseSessionService` if you manage storage yourself; on Cloud Run, remember `--session_service_uri`. For tools that need human approval, confirm they work with the session service you chose.
5. **Pin the version and rerun evals on every upgrade.** Releases land about every two weeks, so read the release notes next to your eval results before deciding to follow.

For cross-framework trade-offs, see the site's [framework selection guide](/posts/ai/2026-08-22-agent-framework-selection-guide-en); for where ADK sits on Google Cloud, see the [Vertex AI to Agent Platform article](/posts/ai/2026-08-22-vertex-ai-model-platform-en).

## References

- [google/adk-python (README)](https://github.com/google/adk-python)
- [LICENSE (Apache-2.0)](https://github.com/google/adk-python/blob/main/LICENSE)
- [adk-python v2.13.0 release notes](https://github.com/google/adk-python/releases/tag/v2.13.0)
- [ADK documentation home](https://adk.dev/)
- [Welcome to ADK 2.0 (upgrade notes and incompatibilities)](https://adk.dev/2.0/)
- [Graph-based agent workflows](https://adk.dev/graphs/)
- [Build collaborative agent teams](https://adk.dev/workflows/collaboration/)
- [Template agent workflows](https://adk.dev/agents/workflow-agents/)
- [Simple agents with LlmAgent](https://adk.dev/agents/llm-agents/)
- [AI Models for ADK agents](https://adk.dev/agents/models/)
- [LiteLLM model connector](https://adk.dev/agents/models/litellm/)
- [Model Context Protocol tools](https://adk.dev/tools-custom/mcp-tools/)
- [Get action confirmation for ADK Tools](https://adk.dev/tools-custom/confirmation/)
- [Callbacks](https://adk.dev/callbacks/)
- [Conversational Context: Session, State, and Memory](https://adk.dev/sessions/)
- [Session](https://adk.dev/sessions/session/)
- [Memory](https://adk.dev/sessions/memory/)
- [Why evaluate agents](https://adk.dev/evaluate/)
- [Evaluation Criteria](https://adk.dev/evaluate/criteria/)
- [Deploying Your Agent](https://adk.dev/deploy/)
- [Deploy to Agent Runtime](https://adk.dev/deploy/agent-runtime/)
- [Deploy to Cloud Run](https://adk.dev/deploy/cloud-run/)
- [Agent activity traces](https://adk.dev/observability/traces/)
- [Introduction to A2A](https://adk.dev/a2a/intro/)
- [Python Quickstart for ADK](https://adk.dev/get-started/python/)
- [Agent framework selection guide: LangGraph, CrewAI, MAF, AG2, Mastra, Pydantic AI, DSPy](/posts/ai/2026-08-22-agent-framework-selection-guide-en)
- [2026 AI agent frameworks overview](/posts/ai/2026-04-01-agent-frameworks-2026-en)
- [MCP introduction](/posts/ai/2026-03-22-mcp-model-context-protocol-en)
- [The protocol layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
- [Memory APIs across five clouds](/posts/ai/2026-09-19-cloud-platform-memory-apis-en)
- [Vertex AI: from model API to Gemini Enterprise Agent Platform](/posts/ai/2026-08-22-vertex-ai-model-platform-en)
