---
title: "Complete Guide to Bypassing Cloudflare Anti-Bot for AI Agents: From Debugging to Building an MCP Server"
date: 2026-03-28
type: guide
category: tech
tags: [cloudflare, anti-bot, playwright, nodriver, stealth, mcp, ai-agent, web-scraping]
lang: en
tldr: "Standard Playwright gets blocked by Cloudflare. Both playwright-extra + stealth and nodriver can bypass it. The final step is wrapping the solution into an MCP server so AI agents can use it automatically."
description: "A hands-on comparison of three approaches to bypass Cloudflare anti-bot protection: native Playwright (fails), playwright-extra + stealth (passes), and nodriver (passes in 1 second). Includes wrapping the stealth solution into an MCP server so Claude Code and other AI agents can automatically switch to it when Cloudflare blocks them."
draft: false
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent)

AI agents need to browse the web for information, but more and more sites are protected by Cloudflare's anti-bot systems. Standard Playwright gets blocked outright. This post documents the full journey from discovering the problem to shipping an MCP server.

## The Problem: Playwright Can't Get Past Cloudflare

When you use the Playwright MCP server (`@executeautomation/playwright-mcp-server`) to open any Cloudflare-protected site, you get stuck on the "Verify you are human" Turnstile challenge page — indefinitely.

The reason is that Cloudflare detects the fingerprints of an automated browser:

- `navigator.webdriver = true` (Playwright's default behavior)
- Connection traces from the Chrome DevTools Protocol (CDP)
- Inconsistent browser fingerprint (missing certain APIs, abnormal plugin list, etc.)

## Three Approaches Compared

| Approach | Language | How It Works | Bypass Rate | Best For |
|----------|----------|--------------|-------------|----------|
| **playwright-extra + stealth** | Node.js | Injects scripts to override `webdriver` and other properties, spoofing the browser fingerprint | High | Integrating into existing Playwright workflows |
| **nodriver** | Python | Doesn't use CDP; controls Chrome directly at a lower level to avoid detection altogether | Highest | Long-running, stable scraping |
| **camoufox** | Python | Anti-detection browser based on Firefox | High | Scenarios requiring the Firefox engine |

### playwright-extra + stealth

This adds a stealth plugin layer on top of Playwright. It works by injecting JavaScript before the page loads to erase automation traces:

```js
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

chromium.use(StealthPlugin());

const browser = await chromium.launch({ headless: false });
const page = await (await browser.newContext()).newPage();
await page.goto("https://nowsecure.nl");
// Cloudflare passes automatically
```

The upside is full compatibility with the native Playwright API — existing code only needs two changed import lines. The downside is that it may not be enough for the strictest Cloudflare configurations.

### nodriver

nodriver is the next-generation solution from the author of undetected-chromedriver. Instead of using CDP, it controls Chrome through an alternative mechanism, making Cloudflare's CDP detection completely ineffective.

```python
import nodriver as uc

async def main():
    browser = await uc.start()
    page = await browser.get("https://nowsecure.nl")
    # Passes Cloudflare within 1 second
```

In real testing on nowsecure.nl (a site specifically designed to test anti-detection tools), nodriver passes in 1 second while playwright-extra takes a few seconds.

> Note: nodriver currently does not support Python 3.14. Use 3.13 or lower.

## Test Results

Tested against `https://nowsecure.nl` (a Cloudflare Turnstile test site):

| Approach | Result | Time to Pass |
|----------|--------|--------------|
| Native Playwright (MCP) | Failed | — |
| playwright-extra + stealth | Passed | ~a few seconds |
| nodriver | Passed | 1 second |

## Letting the AI Agent Use It Automatically: Wrap It as an MCP Server

Once you can bypass Cloudflare, the next question is: how does the AI agent know this tool is available and when to use it?

The answer is to wrap it as an MCP (Model Context Protocol) server. This way, Claude Code loads the tool automatically at startup, and the agent can call it directly whenever needed.

### Architecture

```
Claude Code / AI Agent
  → calls stealth_fetch tool
    → MCP Server (Node.js, stdio)
      → playwright-extra + stealth
        → bypasses Cloudflare
          → returns page content
```

playwright-extra was chosen over nodriver for the MCP wrapper because the MCP SDK is native to the Node.js ecosystem — a single process handles everything without having to manage both Python and Node simultaneously.

### MCP Server Core Code

```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

chromium.use(StealthPlugin());

const server = new McpServer({
  name: "stealth-fetch",
  version: "1.0.0",
});

server.tool(
  "stealth_fetch",
  "Fetch a web page bypassing Cloudflare anti-bot protection.",
  {
    url: z.string().describe("URL to fetch"),
    extract: z.enum(["html", "text", "screenshot", "all"]).default("text"),
    wait_for: z.string().optional().describe("CSS selector to wait for"),
    timeout: z.number().default(30),
  },
  async ({ url, extract, wait_for, timeout }) => {
    const browser = await getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Wait for Cloudflare challenge to pass
    for (let i = 0; i < timeout; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const title = await page.title();
      if (!title.toLowerCase().includes("just a moment")) break;
    }

    // Extract content
    const text = await page.evaluate(() => document.body.innerText);
    await context.close();
    return { content: [{ type: "text", text }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Registering with Claude Code

Add the following to the `mcpServers` section of `~/.claude.json`:

```json
{
  "stealth-fetch": {
    "type": "stdio",
    "command": "node",
    "args": ["/path/to/mcp-server/index.mjs"]
  }
}
```

### Telling the Agent When to Use It

Registering the MCP server alone isn't enough — the agent sees the tool but may not know when to reach for it. Add usage instructions to `CLAUDE.md`:

```markdown
## Stealth Fetch

When you need to fetch web content and encounter Cloudflare anti-bot blocking,
use the stealth_fetch MCP tool (instead of web-fetch or playwright).

Parameters:
- url: target URL
- extract: text (default), html, screenshot, all
- wait_for: CSS selector to wait for before extracting
- timeout: maximum wait time in seconds (default 30)
```

With this in place, the agent will automatically switch to `stealth_fetch` whenever it hits a Cloudflare wall.

## Alternative: HTTP API

If the solution needs to be used beyond Claude Code, you can also wrap it as a generic HTTP API that any agent or service can call:

```bash
# Start the server
python server.py

# Call it
curl "http://127.0.0.1:3000/fetch?url=https://target.com&extract=text"
```

Response:

```json
{
  "url": "https://target.com/",
  "html": "...",
  "text": "plain text content of the page",
  "screenshot": "base64 PNG"
}
```

Built with FastAPI + nodriver, this is ideal when you need the highest possible bypass rate. For 24/7 operation, drop it in Docker and deploy to a VPS.

## Summary

Cloudflare's anti-bot protection fundamentally works by detecting browser automation signals. The solution isn't to "break" the verification — it's to make the browser look like it isn't automated.

For AI agents, the most practical combination is:

- **Day-to-day use**: MCP server (playwright-extra + stealth) — auto-loaded, zero configuration
- **Hard cases**: nodriver HTTP API as a fallback — highest bypass rate
- **Automatic tool selection**: Document in CLAUDE.md so the agent switches tools automatically when hitting Cloudflare

This isn't a permanent fix. Cloudflare continuously updates its detection rules, and stealth plugin and nodriver both keep pace. In the long run, keeping your tools up to date matters more than which approach you pick.

---

## References

- [playwright-extra](https://github.com/nicedayfor/playwright-extra) — Plugin framework for Playwright
- [puppeteer-extra-plugin-stealth](https://github.com/nicedayfor/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth) — Stealth plugin that hides automation traces
- [nodriver](https://github.com/nicedayfor/nodriver) — Next-generation solution from the author of undetected-chromedriver
- [nowsecure.nl](https://nowsecure.nl) — Cloudflare Turnstile detection test site
- [Model Context Protocol](https://modelcontextprotocol.io/) — Official MCP documentation
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) — Cloudflare's CAPTCHA alternative
