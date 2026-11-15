---
title: "Framework Update: Microsoft Agent Framework python-1.25.0"
date: 2026-11-09
category: daily
type: digest
tags: [ai-agent, framework, daily, microsoft-agent-framework]
lang: en
description: "Microsoft Agent Framework python-1.25.0 ships seven BREAKING changes at once, all aimed at tightening the boundaries around workflow executors, MCP sessions, and sandbox error messages that could leak state across callers"
tldr: "Microsoft Agent Framework python-1.25.0 ships seven BREAKING changes, all about isolation: workflow executors and sessions are now bound to a single authorization scope, MCP sessions reopen on every call instead of caching, sandbox error messages hide details by default, and Python 3.10 support is dropped. This is the second time MAF has devoted an entire release to tightening cross-call state isolation, after 1.19.0 in September (also four BREAKING changes, also focused on session scoping) — not new features."
series:
  name: "AI Framework Changelog"
  order: 64
---

> 🌏 [中文版](/posts/daily/2026-11-09-framework-microsoft-agent-framework-python-1.25.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Microsoft Agent Framework |
| Version | python-1.25.0 |
| Previous version | python-1.24.0 |
| Release date | 2026-11-07 |
| Release Notes | [GitHub Release](https://github.com/microsoft/agent-framework/releases/tag/python-1.25.0) |
| GitHub | [microsoft/agent-framework](https://github.com/microsoft/agent-framework) |
| Stars | 14.6k |

## Why this release matters

All seven BREAKING changes in this release point at the same question: can one caller's data leak into another's. Workflow executors and sessions are now bound to a single authorization scope, and cross-scope reuse is rejected outright. MCP sessions are no longer cached — every call opens a fresh connection instead. Sandbox error messages default to a generic `RuntimeError` rather than exposing the original exception's details. None of this is a new feature; it's a common production deployment pattern — one agent or workflow instance serving multiple callers — flipped from "may leak state by default" to "isolated by default, opt in explicitly to share." Teams running MAF in multi-tenant setups (one workflow instance serving requests from different customers) need to check their deployment pattern before upgrading. For teams still evaluating MAF, this is the second time in two months the framework has devoted an entire release to cross-call state isolation, which suggests this class of boundary problem isn't something you fix once and move on from — it's a standing concern the framework keeps revisiting.

## Key changes

- **Callable MCP discovery approval policies**: `agent-framework-core` and `agent-framework-foundry-hosting` add callable approval policies for MCP discovery, honoring Foundry Toolbox approval metadata — including tool-name filters, read-only filters, explicit caller overrides, and policy refresh for retained tools → enterprise deployments can now decide which MCP tools get discovered with program logic instead of a hardcoded allowlist
- **Redis integration on Python 3.15**: `agent-framework-core` and `agent-framework-redis` enable the Redis integration and its standard-install dependency on Python 3.15, and widen the supported RedisVL range to include 0.31 → teams using Redis for chat history or vector storage no longer need to stay on an older Python
- **Wider FastAPI / Azure AI Projects dependency ranges**: also requires Pydantic Monty 1.0 or later with an updated runtime bridge → keeps pace with upstream package versions and reduces dependency conflicts

## Breaking Changes

- Higher Python version floor:
  - Before: `Requires-Python` allowed 3.10
  - After: Python 3.10 installation eligibility and compatibility branches are removed; Python 3.11 or later is required (Foundry Local supports 3.11–3.14)
  - Scope: nearly every package (`agent-framework-core` and almost all provider/integration packages); any deployment still on Python 3.10 must upgrade its environment before installing this release
- MCP tool/prompt discovery now has size and timeout limits:
  - Before: discovery had no built-in page or item cap, and timeout behavior was left to the caller
  - After: each catalog is capped at 100 pages and 1,000 items; framework-owned requests default to a 30-second timeout; a complete snapshot of the old catalog is preserved if a refresh fails
  - Scope: large MCP catalogs with more than 1,000 tools/prompts, or deployments relying on the framework's own client for long-running requests
- Workflow executors and sessions are bound to a single authorization scope, and cross-scope reuse is rejected:
  - Before: a shared workflow builder could let the same executor/session instance serve different callers
  - After: cross-scope reuse reports `WORKFLOW_SCOPE_CONFLICT`; `WorkflowAgent.as_tool()` is rejected outright at AG-UI endpoints and reports `WORKFLOW_AGENT_TOOL_UNSUPPORTED`
  - Scope: multi-tenant deployments sharing one workflow instance across different users must switch to `AgentFrameworkWorkflow(workflow_factory=...)`, which creates a fresh instance per call, or explicitly set `single_user=True` (only when every caller truly is the same principal)
- Workflow OpenTelemetry spans switch to GenAI semantic conventions:
  - Before: span names were fixed to `workflow.run`, and the attribute was named `workflow.name`
  - After: the span operation name becomes `gen_ai.operation.name == "invoke_workflow"`, named spans use the format `invoke_workflow {workflow_name}`, and the attribute is renamed `gen_ai.workflow.name`
  - Scope: any monitoring or alerting rule that filters on span names or attributes needs to be updated to match
- Cross-workflow MCP sessions are no longer cached:
  - Before: `agent-framework-declarative`'s `DefaultMCPToolHandler` cached initialized sessions for reuse across workflows, including `tools/list`
  - After: every handler invocation opens and closes a brand-new protocol session; the old `cache_max_size` parameter is still accepted but deprecated as a no-op (emits a `DeprecationWarning`)
  - Scope: code using the `async with DefaultMCPToolHandler(...)` pattern, or relying on session state persisting across calls; this is a security fix that prevents state from leaking across workflows
- Foundry Local SDK upgraded to 2.3.1:
  - Before: used an older Foundry Local SDK, with `do_sample` and `early_stopping` parameters available
  - After: requires `foundry-local-sdk>=2.3.1,<3`, supports SDK-registered local models, and prepares the selected model before first inference; `do_sample` and `early_stopping` are removed
  - Scope: deployments running local models through Foundry Local — confirm platform support (Apple Silicon macOS, Linux x86_64/aarch64, Windows x64/ARM64)
- Sandbox error messages hide details by default:
  - Before: when an exception occurred inside the `agent-framework-hyperlight` / `agent-framework-monty` CodeAct execution environment, the original exception type and message could be passed back to the generated code
  - After: defaults to a generic `RuntimeError` diagnostic, and Hyperlight sandbox caches are isolated by policy
  - Scope: any workflow relying on original exception details for debugging — set `include_detailed_errors=True` explicitly, and only on a trusted channel, to restore the old behavior

## Migration Guide

### Upgrading from python-1.24.0 to python-1.25.0

```bash
pip install --upgrade agent-framework agent-framework-core
```

```python
# If multiple callers share one workflow instance (multi-tenant scenario)
# Before: reuse the same workflow built from a shared builder
workflow = builder.build()
# Requests from different users all hit the same workflow instance

# After: use a factory so every call gets a new workflow/executor/session
agent_workflow = AgentFrameworkWorkflow(
    workflow_factory=lambda: builder.build()
)
# Only set this explicitly when every caller truly is the same principal:
agent_workflow = AgentFrameworkWorkflow(
    workflow_factory=lambda: builder.build(),
    single_user=True,
)

# If you wrap DefaultMCPToolHandler in an async context manager
# Before:
async with DefaultMCPToolHandler(...) as handler:
    tools = await handler.list_tools()

# After: construct it directly; drop cache_max_size (or pass None)
handler = DefaultMCPToolHandler(...)
tools = await handler.list_tools()
```

After upgrading, prioritize three checks: (1) any deployment where one workflow instance is shared across multiple callers — decide whether to switch to the factory pattern or explicitly set `single_user=True`; (2) code using the `async with DefaultMCPToolHandler` pattern, or relying on session state persisting across calls; (3) any environment still on Python 3.10, which must upgrade to 3.11+ before this release will install. If monitoring rules filter on the `workflow.run` span name or the `workflow.name` attribute, update them to `gen_ai.operation.name` and `gen_ai.workflow.name`.

## How this compares to other frameworks

Two major agent frameworks shipped security-focused releases this week. MAF's release handles cross-call and cross-workflow state isolation, while Pydantic AI's v2.66.0 on November 4 fixed four security advisories directly — a JSON re-indentation DoS in `web_fetch_tool`, a ReDoS in its secret-redaction pattern, a gap in the cloud-metadata blocklist that missed Tencent Cloud's instance address, and credential leakage through embedding spans — released less than a week apart. The difference is in trigger mechanism: Pydantic AI's issues are externally triggerable vulnerabilities (CVE-grade advisories), while most of MAF's seven BREAKING changes are default-behavior tightening at the architecture level (workflow scoping, MCP session caching) rather than a single patched bug — an entire class of "shared instances can leak state across callers" design pattern flipped to off by default. Two frameworks, same week, two different paths to the same conclusion: once agent frameworks hit production, session/scope isolation is becoming the next shared exam question after "does it have enough features."

## Today's takeaway

I'd assumed MAF's September 1.19.0 (four BREAKING changes focused on HTTP cookies, MCP sessions, and Redis key scoping) was a one-time security hardening pass. Seeing 1.25.0 ship seven more BREAKING changes, again centered on scope isolation, changed that: cross-call state isolation isn't a problem a framework fixes once and closes out — new leak points keep surfacing as new capabilities get added (this time, workflow executor binding and sandbox error messages), and they need continuous auditing. That also explains why MAF's BREAKING-change density looks higher than its feature-addition rate — not because it ships fewer features, but because it chooses to publicly flag every newly discovered boundary issue as BREAKING instead of quietly patching it.

## References

- [Microsoft Agent Framework python-1.25.0 Release Notes](https://github.com/microsoft/agent-framework/releases/tag/python-1.25.0)
- [Microsoft Agent Framework GitHub](https://github.com/microsoft/agent-framework)
- [PR #10035: Bind live workflow agent executors to one authorization scope](https://github.com/microsoft/agent-framework/pull/10035)
- [PR #8662: Prevent cross-workflow MCP state sharing](https://github.com/microsoft/agent-framework/pull/8662)
- [Framework Update: Microsoft Agent Framework python-1.19.0 (2026-09-20)](/posts/daily/2026-09-20-framework-microsoft-agent-framework-1.19.0-en)
- [Framework Update: Pydantic AI v2.66.0 (2026-11-05)](/posts/daily/2026-11-05-framework-pydantic-ai-v2.66.0-en)
