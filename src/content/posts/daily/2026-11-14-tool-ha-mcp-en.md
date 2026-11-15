---
title: "Tool of the Day｜ha-mcp — letting AI actually maintain your Home Assistant, not just turn lights on by voice"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "ha-mcp is an open-source MCP server with 87 tools that lets an AI agent read and write a Home Assistant instance's automations, dashboards, HACS and backups — a far wider scope than the official MCP server integration, which can only reach entities already exposed to Assist"
tldr: "ha-mcp is a community-maintained, MIT-licensed Home Assistant MCP server with 87 tools and 7,700+ stars. Install: search \"HA-MCP\" in Home Assistant's HACS or Marketplace. It solves the problem that the built-in MCP integration can only control entities already exposed to Assist and can't touch maintenance work like automations, dashboards or HACS."
series:
  name: "AI Tool of the Day"
  order: 78
---

> 🌏 [中文版](/posts/daily/2026-11-14-tool-ha-mcp)

## Tool info

| Item | Value |
|---|---|
| Name | ha-mcp (HA-MCP) |
| Type | MCP server (runs as a Home Assistant custom integration, an app/add-on, a Docker container, or a PyPI package) |
| GitHub | [homeassistant-ai/ha-mcp](https://github.com/homeassistant-ai/ha-mcp) |
| Stars | 7,744 (at review time; repo created 2025-09-14, still pushing commits on 2026-11-13) |
| Language | Python |
| License | MIT |
| Install | Search "HA-MCP" in Home Assistant's HACS or Marketplace (recommended), or run it standalone with `docker run ... ghcr.io/homeassistant-ai/ha-mcp` |

## What problem it solves

Home Assistant already ships its own built-in MCP server integration, but it's built on top of the Assist voice-pipeline: an AI client can only read and write the entities you've already checked on the "exposed to Assist" settings page, and it can only run intents Assist already understands. Add a new sensor and want Claude to wire it into an automation, or want an AI to tidy up a dashboard layout — Assist simply can't reach any of that. You're back to clicking through the UI by hand.

ha-mcp skips Assist entirely and talks directly to Home Assistant's REST and WebSocket APIs, exposing 87 tools that cover automations, scripts, helpers, dashboards, areas/zones, calendars, backup and restore, installing HACS integrations, and the device and entity registries — and, as an opt-in beta feature, letting an agent read and write `configuration.yaml` directly. Because it reaches so much more than the official integration, its safety model is also built out in more detail: a server-wide Read Only Mode toggle, per-tool enable/disable, approval policies for risky operations, and automatic backups before any edit.

```diagram
title: ha-mcp's tool surface contains the official MCP server's scope
desc: The official MCP server runs on the Assist pipeline and can only reach entities exposed to Assist; ha-mcp separately connects to Home Assistant's REST/WebSocket API, and its 87 tools cover automations, dashboards, HACS and backups — maintenance work the official integration can't touch.
caption: Simplified: both can run side by side without conflict; this only maps relative scope.
---
<svg viewBox="0 0 640 244">
  <rect class="dg-zone" x="20" y="20" width="600" height="204" rx="8"/>
  <text class="dg-tag" x="36" y="38" dominant-baseline="central">HOME ASSISTANT</text>
  <text class="dg-small" x="604" y="38" text-anchor="end" dominant-baseline="central">full config + REST/WebSocket API</text>

  <rect class="dg-box dg-box--accent" x="40" y="56" width="560" height="148" rx="8"/>
  <text class="dg-tag" x="56" y="74" dominant-baseline="central">HA-MCP (87 tools)</text>
  <text class="dg-small" x="584" y="74" text-anchor="end" dominant-baseline="central">automations／dashboards／HACS</text>

  <rect class="dg-box dg-box--store" x="60" y="92" width="520" height="92" rx="8"/>
  <text class="dg-tag" x="76" y="110" dominant-baseline="central">BUILT-IN MCP</text>
  <text class="dg-small" x="564" y="110" text-anchor="end" dominant-baseline="central">runs on Assist</text>
  <text class="dg-sub" x="320" y="152" text-anchor="middle" dominant-baseline="central">only entities exposed to Assist</text>
</svg>
```

It fits anyone running their own Home Assistant who wants Claude or ChatGPT to help write automations, debug a broken one (it can read execution traces), or maintain dashboards. If you just want voice or chat-based on/off control over devices you've already exposed to Assist, the built-in MCP server is enough — you don't need a service with this much write access.

## Getting started

### Install

```bash
# Recommended: in Home Assistant, search "HA-MCP" in HACS (or the Marketplace on 2026.11+) and install it.
# Then go to Settings → Devices & Services → Add Integration, choose "HA-MCP Server",
# and paste a long-lived access token for an administrator account
# (create a dedicated account for this rather than using your own login).

# To run it outside Home Assistant as a standalone HTTP server (Container/Core installs, or a separate host):
docker run -d --name ha-mcp -p 9584:9584 \
  -e HOMEASSISTANT_URL=http://homeassistant.local:8123 \
  -e HOMEASSISTANT_TOKEN=<your long-lived access token> \
  ghcr.io/homeassistant-ai/ha-mcp
```

### Basic usage

Once it's running, paste the connect URL from the Configure screen into any MCP client:

```json
{
  "mcpServers": {
    "home-assistant": {
      "url": "http://<your-ha-host-or-domain>/api/webhook/<webhook-id>"
    }
  }
}
```

Then just talk to it in plain language. Real examples from the project's own README:

| You say | What happens |
|---|---|
| "Create an automation that turns on the porch light at sunset" | Creates the automation with the right triggers and actions |
| "Add a weather card to my dashboard" | Updates the Lovelace dashboard with the new card |
| "The motion sensor automation isn't working, debug it" | Analyzes execution traces, finds the issue, suggests a fix |
| "Make my morning routine also turn on the coffee maker" | Reads the existing automation, adds the new action, saves it |

### Advanced usage

```bash
# Beta features are off by default. On the standalone (Docker/PyPI) build you can enable them via env vars —
# for example, letting the agent edit configuration.yaml directly (the ha_config_set_yaml tool):
docker run -d --name ha-mcp -p 9584:9584 \
  -e HOMEASSISTANT_URL=http://homeassistant.local:8123 \
  -e HOMEASSISTANT_TOKEN=<token> \
  -e ENABLE_BETA_FEATURES=true \
  -e ENABLE_YAML_CONFIG_EDITING=true \
  ghcr.io/homeassistant-ai/ha-mcp
```

If you installed it as a Home Assistant custom integration or app instead, the same beta toggles live in the HA-MCP panel under Settings — no environment variables needed.

## How it compares

| | ha-mcp | Built-in MCP server integration | voska/hass-mcp |
|---|---|---|---|
| Stars | 7,744 | Ships inside Home Assistant core, not a separate repo | 353 |
| License | MIT | Home Assistant itself is Apache-2.0 | MIT |
| Connection | Separate REST/WebSocket API | Runs on the Assist pipeline | Separate REST/WebSocket API |
| Scope | Automations/scripts/helpers/dashboards/areas/calendars/backups/HACS/device & entity registries; YAML editing is beta | Only entities exposed to Assist, only intents Assist supports | Entity state/control, automation listing/control, dashboard read/write |
| Tool count | 87 | Varies with your exposure settings, not a fixed set | Not stated; clearly narrower coverage |
| Can write automations/scripts | ✅ | ❌ | ❌ (can only list/control existing ones) |
| Safety features | Read Only Mode, per-tool toggles, approval policies, automatic backups | Follows your Assist exposure settings | Not specifically documented |
| Last updated | Pushing commits as of 2026-11-13 | Tracks the Home Assistant core release cycle | 2026-11-02 |

All three can run at the same time without conflict: the built-in integration handles voice-style control of entities you've already exposed, ha-mcp handles the "build and maintain" work the built-in integration can't touch at all, and voska/hass-mcp is an earlier, narrower-scoped community project.

## Things to watch out for

- **One admin token runs everything.** The maintainers recommend creating a dedicated account (local-access-only, administrator) instead of using your own login — otherwise every change ha-mcp makes shows up under your own name, and a leaked token has more blast radius.
- **stdio transport has known connection issues.** The README states this directly (tracked as issue #1713) and says streamable HTTP doesn't have the same problem. Use stdio for demos or testing only — for a real setup, use one of the HTTP-based install methods (the integration, the app, or Docker in HTTP mode).
- **The four install methods are mutually exclusive.** The custom component (in-process), the app (add-on), Docker, and uvx/PyPI (stdio) are four ways to run the same server. The README specifically warns that leaving two entries pointed at the same server in one client — say, an old local uvx config still sitting there alongside a newly added app or component URL — is a known cause of the connection hanging. Run exactly one.

## Today's takeaway

Home Assistant's built-in MCP server has actually been around for a while, but its whole design starts from "hand the voice assistant's existing job to AI" — so its scope is capped by whatever you've exposed to Assist. ha-mcp takes a different path: instead of reusing that pipeline, it drops down to a lower-level API, and the scope naturally expands to the entire configuration surface. The tradeoff is that it has to rebuild its own exposure and risk controls from scratch (Read Only Mode, per-tool toggles, approval policies) instead of borrowing Assist's existing exposure page. Neither scope replaces the other — "read and control devices" and "build and maintain the setup" are genuinely different jobs at different levels of granularity.

## References

- [homeassistant-ai/ha-mcp — GitHub](https://github.com/homeassistant-ai/ha-mcp)
- [HA-MCP docs: Beta Features (ENABLE_BETA_FEATURES and other env vars)](https://github.com/homeassistant-ai/ha-mcp/blob/master/docs/beta.md)
- [HA-MCP docs: In-process server (custom-component install)](https://github.com/homeassistant-ai/ha-mcp/blob/master/docs/in-process-server.md)
- [HA-MCP Setup Wizard (config for 15+ clients)](https://homeassistant-ai.github.io/ha-mcp/setup/)
- [AlphaSignal: Open-Source ha-mcp Gives AI Agents 87 Tools to Run Your Smart Home](https://alphasignal.ai/news/open-source-ha-mcp-gives-ai-agents-87-tools-to-run-your-smart-home)
- [Home Assistant docs: Model Context Protocol (the built-in MCP server integration)](https://www.home-assistant.io/integrations/mcp_server/)
- [SmartHomeScene: Home Assistant MCP Server: The Complete Guide](https://smarthomescene.com/guides/home-assistant-mcp-server-complete-guide/)
- [voska/hass-mcp — GitHub](https://github.com/voska/hass-mcp)
