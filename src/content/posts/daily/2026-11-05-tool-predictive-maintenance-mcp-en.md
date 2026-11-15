---
title: "Tool of the Day｜Predictive Maintenance MCP — letting an LLM read vibration signals instead of guessing"
date: 2026-11-05
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that lets an LLM diagnose bearing faults from vibration signals — every verdict needs a matching frequency line in the spectrum before it gets an ISO 20816-3 severity grade, not a filename guess or a model's own story"
tldr: "Predictive Maintenance MCP is an MIT-licensed open-source MCP server that gives an LLM 39 tools for diagnosing bearing vibration. Install: git clone, then uv pip install . inside the project. It solves AI-assisted machine diagnostics that run on guesswork — the server refuses to infer from filenames and requires a measured frequency match before it will cite an ISO 20816-3 severity grade."
series:
  name: "AI Tool of the Day"
  order: 74
---

> 🌏 [中文版](/posts/daily/2026-11-05-tool-predictive-maintenance-mcp)

## Tool info

| Item | Value |
|---|---|
| Name | Predictive Maintenance MCP |
| Type | MCP server (plus a Claude Code plugin) |
| GitHub | [LGDiMaggio/predictive-maintenance-mcp](https://github.com/LGDiMaggio/predictive-maintenance-mcp) |
| Stars | 108 (at time of writing) |
| Language | Python 3.11+ |
| License | MIT (code); the bundled sample vibration signals are CC BY-NC-SA 4.0 (non-commercial) |
| Install | `uv pip install .` (inside the project directory after `git clone`) |

## What problem it solves

Rotating machinery — motors, pumps, fans — leaves a trace in its bearings' vibration signal before it fails. Reading that trace means knowing FFT, envelope analysis, and ISO 20816-3 severity grading, and not every reliability engineer carries that signal-processing background. Hand a raw vibration signal to a general-purpose LLM and ask "is this machine failing?", and the model can easily pick up on a filename or a leading question and produce an answer that sounds plausible but has no spectral evidence behind it — a risk no industrial floor can accept.

Predictive Maintenance MCP turns that judgment call into a set of constrained MCP tools, built around one hard rule: the server refuses to infer a fault from a filename or a statistical summary. A fault verdict only stands once the envelope spectrum shows, at the bearing's theoretical fault frequency, a line that actually clears the noise floor. Every severity conclusion cites the ISO 20816-3 grade, and the wording is authored by the server, not improvised by the model. The LLM's job is to orchestrate the analysis and present the evidence — the fault frequencies detected, the fault patterns matched, the severity zone — while the final call stays with the engineer.

```diagram
title: How Predictive Maintenance MCP judges one vibration diagnosis
desc: The vibration signal goes through spectral analysis first; the server only moves on to ISO severity grading and a diagnostic report once it measures a matching fault frequency, and returns unknown instead of letting the model guess when it doesn't.
caption: Simplified: the real flow also reports the deviation and multiple candidate fault modes.
---
<svg viewBox="0 0 680 508">
  <path class="dg-line" d="M220 34V56" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 112V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 196V224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M220 320V348" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M220 404V428" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--warn" d="M360 272H432" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="220" cy="28" r="6"/>

  <rect class="dg-box" x="100" y="56" width="240" height="56" rx="6"/>
  <text class="dg-label" x="220" y="75" text-anchor="middle" dominant-baseline="central">Vibration signal</text>
  <text class="dg-sub" x="220" y="95" text-anchor="middle" dominant-baseline="central">+ metadata</text>

  <rect class="dg-box" x="100" y="140" width="240" height="56" rx="6"/>
  <text class="dg-label" x="220" y="159" text-anchor="middle" dominant-baseline="central">FFT analysis</text>
  <text class="dg-sub" x="220" y="179" text-anchor="middle" dominant-baseline="central">envelope spectrum</text>

  <path class="dg-box" d="M220 224L360 272L220 320L80 272Z"/>
  <text class="dg-label" x="220" y="262" text-anchor="middle" dominant-baseline="central">Fault frequency found?</text>
  <text class="dg-sub" x="220" y="284" text-anchor="middle" dominant-baseline="central">vs. noise floor</text>

  <rect class="dg-box" x="100" y="348" width="240" height="56" rx="6"/>
  <text class="dg-label" x="220" y="367" text-anchor="middle" dominant-baseline="central">ISO 20816-3</text>
  <text class="dg-sub" x="220" y="387" text-anchor="middle" dominant-baseline="central">severity class</text>

  <rect class="dg-box dg-box--accent" x="100" y="428" width="240" height="56" rx="6"/>
  <text class="dg-label" x="220" y="447" text-anchor="middle" dominant-baseline="central">Diagnostic report</text>
  <text class="dg-sub" x="220" y="467" text-anchor="middle" dominant-baseline="central">with matched evidence</text>

  <rect class="dg-box dg-box--warn" x="432" y="248" width="220" height="48" rx="6"/>
  <text class="dg-label" x="542" y="264" text-anchor="middle" dominant-baseline="central">unknown</text>
  <text class="dg-sub" x="542" y="282" text-anchor="middle" dominant-baseline="central">insufficient evidence</text>

  <text class="dg-edge" x="232" y="334" text-anchor="start" dominant-baseline="central">Yes</text>
  <text class="dg-edge dg-text--warn" x="396" y="260" text-anchor="middle" dominant-baseline="central">No</text>
</svg>
```

Good fit: a reliability engineer who wants to screen a batch of vibration signals in plain language and turn the result into an HTML or Word report with charts attached, or an industrial IoT team wiring existing sensor data into Claude Desktop or Claude Code for anomaly monitoring. Not a fit: anything needing real-time streaming (MQTT/Kafka) or a multi-asset fleet dashboard — both are still on the README's roadmap, not yet built.

## Quick start

### Install

```bash
git clone https://github.com/LGDiMaggio/predictive-maintenance-mcp.git
cd predictive-maintenance-mcp
uv venv .venv --python 3.11
uv pip install --python .venv/bin/python .
```

`git clone` pulls down 20 sample signals along with the code — real rolling-element bearing measurements from the MathWorks dataset. Installing from the PyPI package instead skips those samples. After install, add an entry to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) under `mcpServers` pointing at `.venv/bin/python`, restart Claude Desktop, and ask "list the available vibration signals" to confirm it's working.

### Basic usage

The server ships 39 tools and 3 prompts covering signal loading, FFT/envelope spectral analysis, ISO severity assessment, and report generation. No coding required — just ask in plain language:

```
"Load real_train/OuterRaceFault_1.csv, shaft speed 1500 rpm:
check the bearing against the fault frequencies declared in
its metadata, assess ISO severity, and generate an envelope
analysis report."
```

What comes back isn't the model's opinion — it's measured evidence: which fault frequency lines in the envelope spectrum clear the noise floor, by how much, the corresponding ISO 20816-3 severity zone, and the path to an HTML report with those frequencies marked.

### Advanced usage

Every signal is tracked from load to report under one `signal_id`, paired with an asset health ledger that tracks a given machine's changes over time:

```
declare_measurement_point   # declare a measurement point (asset, location, conditions)
declare_healthy_baseline    # declare a healthy baseline
get_asset_history           # pull an asset's measurement history
assess_asset_change         # compare the latest reading to the baseline, per the declared rule
```

It also installs as a Claude Code plugin, adding 8 auto-triggered diagnostic skills and 2 end-to-end agents:

```bash
/plugin marketplace add LGDiMaggio/predictive-maintenance-mcp
/plugin install predictive-maintenance@predictive-maintenance-marketplace
```

## Compared to existing approaches

| | Predictive Maintenance MCP | Commercial vibration analysis software | General LLM asked directly |
|---|---|---|---|
| Agent / conversational use | ✅ MCP-native, works with Claude or any MCP client | ❌ Mostly standalone GUIs | ✅ but no tool-enforced constraints |
| Data stays local | ✅ Raw signals never leave the machine, only results go to the LLM | Depends on the vendor's deployment | ❌ The whole signal has to go to the cloud model |
| Verdicts backed by spectral evidence | ✅ Refuses filename guesses, requires a matched fault frequency | ✅ Most commercial tools do this too | ❌ Prone to inventing a fault that follows the prompt |
| Open source, reproducible benchmark | ✅ MIT, blind results on the CWRU dataset are rerunnable | ❌ Algorithms are mostly black boxes | — |
| Licensing cost | Free (MIT) | Often billed per machine per year, can reach tens of thousands of dollars | Billed by API usage |

## Things to watch out for

- **This is proof-of-concept software, not a validated field instrument.** The companion academic paper (MDPI *Applied Sciences*) positions it as a PoC, and the README makes no claim of long-term validation on a production line. Fine for screening, but final shutdown or maintenance decisions still belong to the engineer — don't let it trigger a shutdown or work order on its own.
- **Wrong metadata means a wrong diagnosis, or `unknown`.** The server requires the user to declare sampling rate, signal units, and shaft speed rather than guessing them from a filename. Using your own data means building a `<name>_metadata.json` file per `data/README.md`'s format first; skip or misstate it and analysis either fails or falls back to a conservative "insufficient evidence."
- **Licensing is split in two layers.** The code itself is MIT, but the 20 bundled sample signals are CC BY-NC-SA 4.0 (non-commercial). For a commercial deployment, swap in your own machine's vibration data — don't ship the sample data to production.

## Today's takeaway

Most "AI + industrial diagnostics" demos stop at handing a signal to an LLM and seeing whether it can name a plausible fault. This project does the opposite: it uses MCP as a guardrail that keeps the LLM from freelancing. The model can only present the spectral evidence and ISO grade the server computed — it can't invent a fault. That's a useful reminder for high-stakes verticals like industry, healthcare, and finance: wiring in an LLM often isn't about making the model "judge better." It's about using the tool layer to hand judgment back to deterministic, citable logic, and letting the LLM go back to orchestrating and presenting.

## References

- [LGDiMaggio/predictive-maintenance-mcp — GitHub](https://github.com/LGDiMaggio/predictive-maintenance-mcp)
- [Predictive Maintenance MCP README](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/README.md)
- [Tool Catalog (39 tools, 3 prompts)](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/docs/TOOL_CATALOG.md)
- [Benchmark Methodology (CWRU blind-test method)](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/docs/benchmark-methodology.md)
- [LICENSE (MIT, code)](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/LICENSE)
- [data/LICENSE (CC BY-NC-SA 4.0, sample signals)](https://github.com/LGDiMaggio/predictive-maintenance-mcp/blob/main/data/LICENSE)
- [Predictive Maintenance MCP — MDPI *Applied Sciences* paper](https://www.mdpi.com/2076-3417/16/6/2812)
