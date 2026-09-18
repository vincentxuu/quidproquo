---
title: "LLM Agent Tool Discovery: Why Agents Don't Use Available Tools, and How to Fix It"
date: 2026-09-18
category: ai
type: deep-dive
tags: [agent-tools, tool-use, prompt-engineering, anthropic, context-engineering, mcp]
lang: en
tldr: "An agent with a workspace_browse tool said 'file not found' instead of searching. Anthropic, OpenAI, and Google's official guides all point to the same fix: put trigger conditions and workflows in the tool description. A 2025 study found 97.1% of MCP tool descriptions have quality issues."
description: "Starting from a real case of an AI agent failing to use its search tool proactively, this post distills guidance from three major LLM providers, academic research, and community practices into four principles for reliable tool discovery."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-18-llm-tool-discovery)

An agent having the ability to do something and an agent knowing it can do something are two different things.

In our product [MaiAgent](https://maiagent.ai), the MaiGPT assistant has a `workspace_browse` tool that can search all file workspaces accessible to the user. When a user asked "rename RAG_原理與影響要素.md for me," the agent replied "file not found, no workspace is mounted" and stopped — without ever attempting to search.

The tool worked. The API was fine. Tests passed. So what was wrong?

## This Isn't an Isolated Case

According to a [2025 analysis of the MCP tool ecosystem](https://dev.to/aws-heroes/mcp-tool-design-why-your-ai-agent-is-failing-and-how-to-fix-it-40fc), **97.1% of MCP tool descriptions contain at least one quality issue**, and over half (56%) have unclear purpose statements. Academic research corroborates this — [Tool-DE](https://www.emergentmind.com/topics/tool-de) (Lu et al., 2025) found that **41.6% of original tool documentation lacks functional information or contextual guidance**.

The result isn't broken tools — it's agents that don't know when to use them.

## Root Cause: Passive Tool Descriptions

Our original design had two layers:

**System prompt (availability block)**:
```
You cannot mount or switch a workspace yourself;
offer to help the user find one with workspace_browse
when appropriate.
```

**Tool description**:
```
Browse file workspaces the user has access to.
Actions: "list_workspaces" returns all accessible workspaces...
Use this to help the user find files even when no workspace
is mounted on this conversation.
```

Both mentioned `workspace_browse`, but both were too passive — "when appropriate" and "Use this to help" left the decision to the agent's reasoning, and the agent chose to tell the user it couldn't find the file first.

## Four Principles: Consensus Across Three Providers

After studying the official guides from [Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents), [OpenAI](https://developers.openai.com/api/docs/guides/function-calling), and [Google](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/function-calling), a pattern emerges: they use different words to say the same thing.

### 1. Put Trigger Conditions in the Tool Description, Not the System Prompt

Anthropic's guide explicitly recommends:

> Think of how you would describe your tool to a new hire — make implicit context explicit.

OpenAI's [function calling docs](https://developers.openai.com/api/docs/guides/function-calling) offer a blunter test:

> Pass the intern test. Can an intern/human correctly use the function given nothing but what you gave the model?

Google's [Gemini function calling guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/function-calling) emphasizes the same point:

> Be extremely clear and specific in your function and parameter descriptions. The model relies on these to choose the correct function and provide appropriate arguments.

The consensus across all three: **the agent reads tool descriptions when deciding whether to call a tool**. The system prompt is background knowledge; the tool description is the action guide. Put the trigger condition in the wrong place, and the agent won't act.

### 2. Spell Out the Workflow, Don't Just List Features

Listing three actions and letting the agent figure out the order means it might use only one, or none at all. An explicit step sequence removes the reasoning burden:

```
WORKFLOW:
(1) list_workspaces → find the relevant workspace
(2) list_directory + workspace_id → see the folder structure
(3) expand_folder + folder_id → locate the specific file
```

This doesn't limit the agent's autonomy — it reduces the probability of guessing wrong. According to Anthropic's [context engineering article](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), good context design reads like an onboarding doc for a new colleague — it doesn't assume they know the process.

The [LangChain community](https://www.digitalapplied.com/blog/langchain-ai-agents-guide-2025) observes the same pattern: "The docstring is critical — it's how agents decide when to use your tool. Include: what the tool does, when to use it, parameter descriptions, return value format, example use cases."

### 3. Positive Instructions Beat Pure Prohibitions

"Do NOT say you cannot find a file" is a prohibition. The agent understands it shouldn't say that exact phrase, but doesn't necessarily know what to do instead. Positive instructions provide a direct action:

| Approach | Effect |
|---|---|
| ❌ "Do NOT say you cannot find a file" | Agent knows not to say it, but may rephrase to the same effect |
| ✅ "Your FIRST step is list_workspaces" | Agent has a clear first action |
| ✅✅ Both combined | Positive instruction first, guardrail second |

OpenAI's advice leans the same way: "Use the system prompt to describe when (and when not) to use each function. Generally, tell the model _exactly_ what to do." — say when to use first, when not to use second.

### 4. Add Concrete Call Examples

According to [Anthropic's tool definition docs](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools), `input_examples` significantly reduce tool selection and parameter errors. OpenAI also recommends: "Include examples and edge cases, especially to rectify any recurring failures."

```json
{
  "action": "list_workspaces"
}
```

```json
{
  "action": "expand_folder",
  "folder_id": "abc-123"
}
```

Not all frameworks support an `input_examples` field, but embedding examples in the description text has a similar effect.

## Quantitative Support

Beyond principles, there's quantitative evidence:

- [RAG-MCP](https://huggingface.co/papers/2505.03275) (2025) used semantic retrieval to filter tool descriptions, cutting prompt tokens by over 50% and boosting tool selection accuracy from 13.62% to **43.13%** — more than tripling it. This demonstrates that "fewer, more relevant tools in context" directly improves accuracy.
- [GitHub Copilot cut its tool count from 40 to 13](https://github.blog/ai-and-ml/github-copilot/how-were-making-github-copilot-smarter-with-fewer-tools/) with measurable benchmark improvements. [Block rebuilt its Linear MCP Server three times](https://engineering.block.xyz/blog/blocks-playbook-for-designing-mcp-servers), going from 30+ tools to just 2.
- A [study of the MCP ecosystem](https://dev.to/aws-heroes/mcp-tool-design-why-your-ai-agent-is-failing-and-how-to-fix-it-40fc) identified six components of quality tool descriptions: **Purpose** (what it does), **Guidelines** (when and how to use it), **Limitations** (what it can't do), **Parameter Explanation** (input format), **Length** (enough detail without overwhelming), and **Examples** (concrete usage scenarios).

## Before and After

**Before** (tool description):
```
Browse file workspaces the user has access to.
Actions: "list_workspaces" returns all accessible workspaces;
"list_directory" returns the directory tree of a specific
workspace (provide workspace_id);
"expand_folder" returns files in a specific folder
(provide folder_id).
Use this to help the user find files even when no workspace
is mounted on this conversation.
```

**After**:
```
Browse and search file workspaces the user has access to.
WHEN TO USE: whenever the user mentions a file by name,
asks to find/read/modify/rename a file, or references
workspace contents — even if no workspace is mounted on
this conversation.
Your FIRST step is always action="list_workspaces" to
discover available workspaces.
WORKFLOW: (1) list_workspaces → pick the relevant workspace,
(2) list_directory with workspace_id → see the folder tree,
(3) expand_folder with folder_id → find the specific file.
...
IMPORTANT: never tell the user you cannot find a file
without completing this workflow first.
```

The difference: trigger condition (WHEN TO USE), first action, complete workflow, guardrail — all in the tool description, in one place. Checking against the six components: Purpose ✅, Guidelines ✅, Limitations (implicit in workflow), Parameter Explanation ✅, Length (~120 words), Examples (could add more).

## When This Applies (and When It Doesn't)

These principles apply to the "agent has a tool but doesn't use it" scenario, common with:

- Multi-step tools (search first, then read, then write)
- Tools without obvious trigger signals (user says "rename my file" — the agent doesn't necessarily think to search first)
- Tools with perceived prerequisites (must mount a workspace to read files — but browsing doesn't require mounting)

Not applicable when: the agent calls the tool but fills in wrong parameters (that's a schema design issue), or the tool itself has a bug.

Tool descriptions shouldn't be infinitely long either. In our experience, descriptions beyond 200 words start seeing the agent ignore the latter half. Put the most important trigger condition and first step at the very beginning.

## The Takeaway

"Agent has a tool but doesn't use it" is almost always a prompt problem, not a code problem. And where you put the prompt fix matters — the tool description is the agent's primary source when making tool selection decisions; the system prompt is background context. All three major providers independently converge on the same advice: write trigger conditions, workflows, and guardrails in the tool description, as if onboarding a new colleague — make implicit knowledge explicit.

## References

- [Writing effective tools for AI agents — Anthropic](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Effective context engineering for AI agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Define tools — Anthropic Docs](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/define-tools)
- [Function calling — OpenAI API Docs](https://developers.openai.com/api/docs/guides/function-calling)
- [Introduction to function calling — Google Cloud / Gemini](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/tools/function-calling)
- [MCP Tool Design: Why Your AI Agent Is Failing — DEV Community](https://dev.to/aws-heroes/mcp-tool-design-why-your-ai-agent-is-failing-and-how-to-fix-it-40fc)
- [RAG-MCP: Mitigating Prompt Bloat in LLM Tool Selection — Hugging Face Papers](https://huggingface.co/papers/2505.03275)
- [Tool-DE: Benchmark for LLM Tool Retrieval — Emergent Mind](https://www.emergentmind.com/topics/tool-de)
- [How we're making GitHub Copilot smarter with fewer tools — GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-were-making-github-copilot-smarter-with-fewer-tools/)
- [Block's playbook for designing MCP servers — Block Engineering](https://engineering.block.xyz/blog/blocks-playbook-for-designing-mcp-servers)
- [LangChain AI Agents: Complete Implementation Guide — Digital Applied](https://www.digitalapplied.com/blog/langchain-ai-agents-guide-2025)
