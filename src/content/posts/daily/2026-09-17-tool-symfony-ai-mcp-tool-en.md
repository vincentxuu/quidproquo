---
title: "Tool Pick | symfony/ai-mcp-tool — Wire a Symfony AI Agent Straight Into Remote MCP Tool Servers"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, tool, daily, framework-plugin]
lang: en
description: "An official Symfony AI MCP client bridge that turns a remote MCP server's tools into Agent-native Tool objects, auto-prefixing names to avoid collisions across multiple servers, so PHP agent developers no longer hand-write the adapter layer"
tldr: "symfony/ai-mcp-tool is Symfony AI's official MCP client bridge, letting a Symfony Agent mount tools from any remote MCP server. Install: composer require symfony/ai-mcp-tool. It removes the need for PHP agent developers to hand-write a tool-schema-to-framework-Tool adapter and to resolve name collisions across multiple servers."
series:
  name: "AI Tool of the Day"
  order: 32
---

> 🌏 [中文版](/posts/daily/2026-09-17-tool-symfony-ai-mcp-tool)

## Tool Info

| Field | Value |
|---|---|
| Name | symfony/ai-mcp-tool |
| Type | Framework plugin (Symfony AI's MCP client bridge) |
| GitHub | [symfony/ai-mcp-tool](https://github.com/symfony/ai-mcp-tool) |
| Stars | 2 |
| Language | PHP |
| License | MIT |
| Install | `composer require symfony/ai-mcp-tool` |

## What Problem It Solves

If you're building agents in PHP, Symfony AI has become the default choice — an official set of components covering Platform (a unified interface across model providers), Agent (the tool-calling loop), and Store (vector database access). But wiring an agent up to an external MCP server's tools meant writing your own adapter: `tools/list` returns a raw JSON Schema that has to be hand-converted into whatever `Tool` object the Agent component expects, and if the same agent needs two servers at once, you're also on your own for name collisions when both servers happen to expose a `read_file` tool.

symfony/ai-mcp-tool packages that adapter into a single `McpToolbox`: it wraps one or more `ClientToolset` instances — each one a live MCP connection, over stdio or remote — turns the tools they advertise into `Symfony\AI\Platform\Tool\Tool` definitions, and prefixes every tool name with that server's short name (`read_file` on a server called `filesystem` becomes `filesystem_read_file`), so several servers can sit behind one agent without colliding. It draws a deliberately narrow boundary: it only supplies tools, not MCP prompts or resources, and it doesn't pretend to be a full MCP client.

It's a good fit if you're already building agents on Symfony AI and want to plug into the existing MCP server ecosystem without writing a bespoke adapter for every server. Inside a full Symfony application there's one more shortcut available: describe the connection once through the MCP Bundle's `clients:` config, then point an agent at it with an `mcp_server:` tool entry in the AI Bundle config — you never touch this bridge's code directly. You reach for it explicitly only when you're assembling an `Agent` object yourself — a standalone script, code outside the Symfony framework, or a test.

## Quick Start

### Install

```bash
composer require symfony/ai-mcp-tool
# Requires PHP >= 8.2, and pulls in the official mcp/sdk and symfony/ai-agent
```

### Basic Usage

Mount a stdio-based MCP server (the official filesystem server) into a toolbox an agent can call:

```php
use Mcp\Client;
use Mcp\Client\Transport\StdioTransport;
use Symfony\AI\Agent\Agent;
use Symfony\AI\Agent\Bridge\Mcp\ClientToolset;
use Symfony\AI\Agent\Bridge\Mcp\McpToolbox;

$toolset = new ClientToolset(
    'filesystem',
    Client::builder()->build(),
    new StdioTransport('npx', ['-y', '@modelcontextprotocol/server-filesystem', __DIR__]),
);

$agent = new Agent($platform, 'gpt-4o-mini', toolbox: new McpToolbox($toolset));
```

The agent sees tool names like `filesystem_read_file` and `filesystem_list_directory` — never the server's raw `read_file`.

### Advanced Usage

Chain several servers behind one agent with `ChainToolbox`, and gate tool calls with an event listener — for example, blocking write operations during a read-only session:

```php
use Symfony\AI\Agent\Bridge\Mcp\McpToolbox;
use Symfony\AI\Agent\Toolbox\ChainToolbox;
use Symfony\AI\Agent\Toolbox\Event\ToolCallRequested;

$toolbox = new ChainToolbox([
    new McpToolbox($filesystemToolset, retryAfter: 60),
    new McpToolbox($githubToolset, retryAfter: 60),
]);

$eventDispatcher->addListener(ToolCallRequested::class, function (ToolCallRequested $event): void {
    if (str_contains($event->getDefinition()->getName(), '_write_')) {
        $event->deny('write operations are disabled in this session');
    }
});
```

`retryAfter` is a built-in circuit breaker: when a server is unreachable, `getTools()` returns an empty array instead of failing the whole request, and it won't retry that connection again for the next N seconds — one dead server doesn't take down calls to the others, and a listing call doesn't hammer a connection that's already known to fail.

## Comparison With Existing Approaches

| | symfony/ai-mcp-tool | Hand-written adapter | LangChain `langchain-mcp-adapters` (Python) |
|---|---|---|---|
| Officially maintained, tracks framework releases | ✅ | — | ✅ (LangChain-maintained) |
| Auto-prefixes names across multiple servers | ✅ | You build it | ✅ |
| Circuit breaker on connection failure | ✅ (`retryAfter`) | You build it | Depends on the underlying client |
| Tool calls can be intercepted/denied | ✅ (event system) | You build it | You wrap it yourself |
| PHP ecosystem | ✅ | ✅ | ❌ (Python) |

## Caveats

- **Still 0.x, `minimum-stability: dev`.** It tracks the `symfony/ai` monorepo (currently 0.13), and the API can still shift — check the changelog before relying on it in production.
- **Tools only — not prompts or resources.** The README is explicit that this is a deliberate boundary. If a server's value is mostly in prompts or resources, this bridge won't adapt that part for you.
- **A stdio transport spawns a child process on every connection.** The docs specifically call out long-running processes like a Messenger worker: each message gets a fresh process rather than reusing a prior connection, so factor that startup cost into how you design a stdio server.

## Today's Takeaway

Most MCP language SDKs stop at "can send `tools/list` and `tools/call`" — wiring that into a specific framework's agent loop is left to each framework to solve on its own. symfony/ai-mcp-tool solves exactly that gap, and keeps the scope narrow on purpose: tools only, name-prefixed to avoid collisions, with a circuit breaker so one dead server can't drag the rest down. A framework-level MCP bridge's value usually isn't measured by how much it wraps — it's measured by how clearly it draws the line around what it deliberately doesn't do.

## References

- [symfony/ai-mcp-tool GitHub repo](https://github.com/symfony/ai-mcp-tool): full README and composer.json — the source for this article's install instructions and core description.
- GitHub API repo metadata (`symfony/ai-mcp-tool`): stars (2), language (PHP), license (MIT), creation date (2026-09-16), via the GitHub REST API.
- [symfony/ai-mcp-tool source — `ClientToolset.php` / `Tests/McpToolboxTest.php`](https://github.com/symfony/ai-mcp-tool): the `retryAfter` circuit breaker, `ChainToolbox` multi-server chaining, and the `ToolCallRequested` interception event were all confirmed directly from source and test cases.
- [MCP Bundle — Symfony Docs](https://symfony.com/doc/current/ai/bundles/mcp-bundle.html): how a full Symfony application configures MCP connections through the MCP Bundle's `clients:` option, supporting this article's note on the extra shortcut available inside a Symfony app.
- [Symfony AI](https://ai.symfony.com/): background on the symfony/ai project as a whole (Platform / Agent / Store components).
