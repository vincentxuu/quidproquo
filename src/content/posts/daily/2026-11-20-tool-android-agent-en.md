---
title: "Tool Pick｜android-agent — let an agent drive your Android phone, ~10x cheaper than screenshots"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "android-agent is a CLI + MCP server that lets an agent read an Android screen as text via the accessibility tree instead of a screenshot — about 10x cheaper in tokens, per its own benchmark"
tldr: "android-agent is an MCP server that lets an agent drive an Android phone by reading the accessibility tree as a text list instead of sending screenshots. Install: clone the repo and run python setup.py. It solves the token bill phone-automation agents rack up every time they look at the screen."
series:
  name: "AI Tool of the Day"
  order: 84
---

> :globe: [中文版](/posts/daily/2026-11-20-tool-android-agent)

## Tool info

| Field | Value |
|---|---|
| Name | android-agent |
| Type | CLI + MCP server |
| GitHub | [nebigoktug/android-agent](https://github.com/nebigoktug/android-agent) |
| Stars | 4 (at review time; repo created 2026-11-18, version v0.4) |
| Language | Python 3.10+ |
| License | MIT (the optional ADB Keyboard component is GPL-2.0) |
| Install | `git clone`, then `python setup.py` |

## What problem it solves

You want an agent to drive your phone — test a flow in an app, check a setting, look something up on a page that only exists in the mobile version. Most phone-automation agents today work by taking a screenshot, deciding on an action, and taking another screenshot to confirm — and every single look at the screen means handing the model an image, at roughly 1,500 tokens a pop. Driving a phone usually means looking dozens of times in a row, so the token bill and the latency both climb linearly with every screenshot.

android-agent reads the screen a different way: instead of a screenshot, it reads Android's native accessibility tree and turns the screen into a numbered text list — something like `[5] button "Wi-Fi · HomeNetwork"` — and the agent just replies "tap 5". The project's own BENCHMARK.md gives the numbers: across 6 everyday tasks (Settings, a YouTube search, Calculator, Clock, Play Store, Maps), 19 screen reads cost about 2,700 tokens total as text lists, versus about 28,500 tokens for the same 19 looks as screenshots — nearly a 10x difference. It only falls back to a screenshot or OCR when the text list genuinely doesn't capture what's on screen (games, some Flutter apps, maps).

Good fit for: building a test, support, or task agent for a phone app without burning most of your context budget just looking at the screen; or running an agent that drives the phone itself on an old handset with no PC around, using Termux alone.

```diagram
title: android-agent's blind-tap guard
desc: The agent reads the screen to get a numbered list, picks an item to tap, and android-agent re-reads the screen right before tapping to confirm nothing changed before it acts.
step: Agent requests the current screen
step: android-agent returns a numbered text list
step: Agent decides to tap item 5
step: android-agent re-reads the screen right before tapping
step: Screen still matches, so the tap is sent
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="376"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="376"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="376"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="108" text-anchor="middle" dominant-baseline="central">read current screen</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 164H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="152" text-anchor="middle" dominant-baseline="central">numbered text list</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 208H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="196" text-anchor="middle" dominant-baseline="central">decide to tap item 5</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M324 252H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="430" y="240" text-anchor="middle" dominant-baseline="central">re-read screen before tap</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M540 296H328" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="434" y="284" text-anchor="middle" dominant-baseline="central">screen matches, tap sent</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="196" width="8" height="156" rx="2" data-step="3 4 5"/>
  <rect class="dg-box" x="540" y="240" width="8" height="68" rx="2" data-step="4 5"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Agent</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">android-agent</text>
  <rect class="dg-box dg-box--link" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Android phone</text>
</svg>
```

## Getting started

### Install

From a computer (easiest):

```bash
# install adb first
winget install Google.PlatformTools    # Windows
brew install android-platform-tools     # macOS
sudo apt install adb                    # Linux

# on the phone: Settings → About phone → tap "Build number" 7 times to unlock Developer options
# turn on "USB debugging" in Developer options, plug in a USB cable, and tap Allow on the phone

git clone https://github.com/nebigoktug/android-agent
cd android-agent
python setup.py
```

Directly on the phone, no PC needed (Termux):

```bash
# install Termux from F-Droid (not the outdated Play Store version)
pkg install -y git python android-tools
git clone https://github.com/nebigoktug/android-agent && cd android-agent
python setup.py
```

Register it as a Claude Code MCP server:

```bash
claude mcp add phone -- python /path/to/android-agent/mcp_server.py
```

### Basic usage

```bash
python phone.py screen                 # read the current screen (then only what changed)
python phone.py tap 5                  # tap by the number from the last screen read
python phone.py tap "Bluetooth"        # or tap by label, matched against the live screen
python phone.py find "Developer options"  # scroll down automatically until it's on screen
python phone.py type "hello" , key enter  # chain commands with a comma
```

Through MCP, an agent calls the same capabilities directly as tools: `screen`, `tap`, `type`, `swipe`, `key`, `open_app`, `open_link`, `list_apps`, `wait`, `screenshot`, `rotation_lock`.

### Advanced usage

Skip the agent harness entirely and let `agent.py` run the whole loop itself from a single natural-language instruction:

```bash
pip install anthropic
export ANTHROPIC_API_KEY=...
python agent.py "turn on Bluetooth and tell me which devices are paired"
```

Before anything that sends a message, pays, deletes, installs an app, or changes an account setting, `agent.py` stops and asks you in the terminal first.

## Compared to the alternatives

| | android-agent | screenshot-based phone agents | Appium |
|---|---|---|---|
| How the screen reaches the model | accessibility tree → text list | screenshot → image tokens | UI element tree (not LLM-oriented) |
| Token cost per screen read | low (~150 tokens, per the project's own benchmark) | high (~1,500 tokens, per the same benchmark) | not applicable |
| Native MCP support | ✓ | depends on the project | ✗ needs a bridge you build |
| Runs standalone on the phone (no PC) | ✓ via Termux | usually needs a computer | ✗ needs an Appium server |
| Re-checks the screen right before tapping | ✓ built in | depends on the project | left to your own test script |
| Built for | AI agents driving a phone | AI agents driving a phone | QA test automation |

## Things to watch for

- **Still early (v0.4)**: the author has only tested it by hand on one Xiaomi phone running Android 16 (Termux, wireless). CI only runs device-free tests on Windows/macOS/Linux, so it hasn't been exercised across the UI quirks of other Android brands — run a full pass by hand before wiring it into anything automated.
- **Enabling USB/wireless debugging is itself a risk**: it's an Android developer setting that exposes real control over the device. Turn it on only for a computer you trust, and turn it back off when you're done.
- **The optional companion app needs the Accessibility permission**: it cuts screen-read latency from about 3 seconds to about 0.4 seconds, but accessibility access can read almost everything on screen — the README says so itself. Only install it from a source you trust.
- **Mixed licenses**: the main project is MIT, but the optional ADB Keyboard component is GPL-2.0 (a third-party package by senzhk) — worth checking the boundary before any commercial integration.

## Today's takeaway

Most tools for "letting AI operate a screen" default to treating it as a computer-vision problem — screenshot, guess the coordinates, screenshot again to confirm. android-agent asks the opposite question: the device already carries a structured-text representation of the screen for screen readers, so why re-encode it into an image just to have the model decode it back into structure? Keeping "reading the screen" inside the data structure the system already exposes natively — instead of routing it through an image round-trip — is the real reason it saves roughly 10x in tokens; the saving isn't about a smarter model, it's about skipping an unnecessary encode/decode detour.

## References

- [nebigoktug/android-agent — GitHub](https://github.com/nebigoktug/android-agent)
- [android-agent README (raw source)](https://raw.githubusercontent.com/nebigoktug/android-agent/main/README.md)
- [android-agent BENCHMARK.md (token-cost benchmark data)](https://raw.githubusercontent.com/nebigoktug/android-agent/main/BENCHMARK.md)
- [android-agent SKILL.md (agent usage rules)](https://raw.githubusercontent.com/nebigoktug/android-agent/main/SKILL.md)
- [Model Context Protocol docs](https://modelcontextprotocol.io)
