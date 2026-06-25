---
title: "Claude Code × Chrome: Browser Automation for Frontend Development from the CLI"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, chrome, browser-automation, frontend, testing, dx]
lang: en
tldr: "`claude --chrome` connects Claude Code to your Chrome browser — read console logs, click buttons, fill forms, take screenshots, and record GIFs. Verify your code changes directly in the browser without switching context. It shares your login session, so it works with Google Docs, Notion, and any app you're already signed into."
description: "An introduction to Claude Code's Chrome integration (beta): installation, browser automation capabilities, real-world use cases (live debugging, design verification, form automation, data extraction), and how to use it within VS Code."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 21
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration)

<!-- TODO: Draft in progress -->
<!-- Reference: https://code.claude.com/docs/en/chrome.md -->

## Planned Outline

### What Is Chrome Integration
- `claude --chrome` connects to your Chrome browser
- Built on the Claude in Chrome extension
- Shares your existing browser login sessions
- Currently in beta — supports Chrome and Edge

### Setup
- Install the Claude in Chrome extension (v1.0.36+)
- Launch with `claude --chrome`
- Or enable within a session using `/chrome`
- Set as default: `/chrome` → "Enabled by default"

### Capabilities
- Open new tabs and navigate to URLs
- Click, type, and scroll
- Read DOM content and console logs
- Take screenshots and record GIFs
- Operate across multiple tabs

### Real-World Use Cases

#### Live Debugging
```
I just updated the login form validation.
Open localhost:3000, try submitting with invalid data,
and check whether the error messages appear correctly.
```

#### Design Verification
```
I implemented a UI based on a Figma mockup.
Open it in the browser and confirm it matches.
```

#### Console Log Analysis
```
Open the dashboard page
and check whether there are any errors in the console on load.
```

#### Form Automation
```
I have customer data in contacts.csv.
Go to the CRM website and fill in each record one by one.
```

#### Working with Authenticated Web Apps
```
Write a project update based on recent commits
and add it to my Google Doc.
```

#### Recording a Demo GIF
```
Record a GIF showing the checkout flow,
from adding to cart through the confirmation page.
```

### Limitations and Caveats
- Pauses and asks you to intervene when it hits a CAPTCHA or login wall
- Does not support non-mainstream Chromium browsers like Brave or Arc
- Does not support WSL
- Enabling by default increases context token consumption

## References

- [Use Claude Code with Chrome (beta)](https://docs.anthropic.com/en/docs/claude-code/chrome) — Official Anthropic documentation for Chrome integration, covering installation, capabilities, and troubleshooting
- [Claude in Chrome — Chrome Web Store](https://chromewebstore.google.com/detail/claude-in-chrome/ghkclklbadheamoidpamljhmaopggfkf) — Install the Claude in Chrome extension
- [Claude Code Best Practices — Verify UI Changes](https://docs.anthropic.com/en/docs/claude-code/best-practices#give-claude-a-way-to-verify-its-work) — Official guidance on using Chrome integration to verify UI changes
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) — The underlying protocol for browser automation; useful for understanding how Claude controls the browser
- [Playwright Browser Automation](https://playwright.dev/docs/intro) — A mainstream browser automation tool for comparison, helpful for understanding the scope of Claude's Chrome integration
- [Claude Code Common Workflows](https://docs.anthropic.com/en/docs/claude-code/common-workflows) — Official workflows including practical Chrome integration examples
- [Model Context Protocol — Resources](https://modelcontextprotocol.io/docs/concepts/resources) — The MCP resource protocol underlying the Chrome integration architecture
