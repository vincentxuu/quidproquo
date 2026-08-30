---
title: "Rivumi Native MCP: transport, authorization, and approval boundaries"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, mcp, oauth, tool-safety]
lang: en
tldr: "Rivumi loads project MCP servers only through an explicit allowlist, projects stdio or Streamable HTTP capabilities into the existing ToolExecutor, and preserves hooks, approvals, timeouts, and cleanup."
description: "Trace Rivumi Native MCP from config loading and stdio or Streamable HTTP through tool, resource, and prompt projection, OAuth PKCE, approval, and client cleanup."
series:
  name: "Rivumi Architecture Notes"
  order: 14
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-rivumi-native-mcp-authorization)

The [previous article](/posts/tech/2026-08-30-rivumi-context-compaction-en) handled context pressure in a long session. The next task is bringing external capabilities into the coding agent's native loop. [Rivumi](https://github.com/vincentxuu/rivumi) supports MCP, but the presence of `.mcp.json` does not authorize its commands to run.

## Configuration is not launch authority

`load_native_mcp_server_configs()` first reads `RIVUMI_MCP_ALLOWLIST`. The default is empty, so no project server starts unless its name is explicitly included and its configuration passes validation.

Each server selects exactly one transport: an argv-based stdio subprocess or an absolute HTTP URL. HTTP rejects embedded credentials, query strings, fragments, and redirects; unencrypted HTTP is limited to loopback. Stdio starts with a sanitized environment plus variables named in the configuration. These checks reduce accidental connection and environment exposure, but allowing a stdio server still authorizes Rivumi to launch that host command. This MCP layer does not create an OS sandbox for it.

## Two transports return to one executor

The stdio client exchanges line-delimited JSON-RPC. The HTTP client sends Streamable HTTP POST requests and accepts either JSON or `text/event-stream` responses. SSE is a response representation in this path, not a separate legacy SSE transport.

After initialization, clients page through tools, resources, and prompts. A remote tool becomes `mcp__<server>__<tool>`. Resources and prompts enter through fixed list/read and list/get bridges. Despite the different projections, calls return to the ordinary tool path: pre-tool hooks, permission approval, bounded observations, and journal events.

```text
.mcp.json + explicit allowlist
  -> stdio process | Streamable HTTP client
  -> tools + resource/prompt bridges
  -> ToolExecutor
  -> hooks -> approval -> bounded result
```

## Authorization is not trust

An HTTP server may use a bearer token from an environment variable or an operator-configured authorization-code flow. Rivumi creates a PKCE S256 verifier and state, handles the callback, and exchanges the code. Its credential file rejects symlinks, requires mode `0600`, and is saved through a temporary file and atomic replacement.

The boundary matters. The reviewed implementation does not perform dynamic client registration or an automatic refresh-token exchange. Protected-resource discovery returns metadata; it does not configure OAuth for the operator. This is a controlled login path, not a complete OAuth platform.

Approval remains conservative. An unknown MCP tool is treated as execute. It is reduced to read only when remote annotations state `readOnlyHint: true` without a destructive hint. Those annotations are server-provided metadata, not a safety proof. Fixed resource and prompt bridges are classified as read-only operations, but their returned content remains untrusted input.

## Cleanup is part of the session contract

Responses, pagination, output, and waiting time are bounded. A timed-out stdio request closes its process. The HTTP client retains a returned session ID for later requests. Tool definitions can refresh between turns, and the runner finalizer calls `ToolExecutor.close()` to close every client.

The design point is not the number of servers Rivumi can connect. It is that an external capability still obeys the existing executor and authority boundaries. The [next article](/posts/tech/2026-08-30-rivumi-skills-hooks-plugins-en) separates three other extension mechanisms: skills, blocking hooks, and plugin packages.

---

## References

- [MCP client and authorization implementation](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/mcp_client.py)
- [ToolExecutor MCP projection and cleanup](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/tools.py)
- [MCP approval classification](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/approvals.py)
- [Native loop integration](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [MCP client tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_mcp_client.py)
