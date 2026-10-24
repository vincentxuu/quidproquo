---
title: "Scanning Skills and MCP Servers Before You Install Them: What SkillSpector, Cisco, Snyk agent-scan and AgentSeal Can Catch"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, agent-skills, mcp, supply-chain, ai-agent]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 1
tldr: "Pre-install scanners work in one of three ways: static rules, LLM judgment, or actually connecting to the MCP server. Cisco's own documentation shows rules alone catch about 8% of unseen malicious samples, and third-party tests show the numbers shift a lot when the sample mix changes. Use scanners as a first filter; \"no findings\" does not mean safe."
description: "How four open-source pre-install scanners for skills and MCP servers differ in method, data egress and execution risk, how to read a scan report, why published detection numbers cannot be compared directly, and how to use them in practice."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners)

You found a useful-looking skill on GitHub and are about to drop it into your skills directory. A pre-install scanner does one plain thing: before you install, it reads the skill's files and instructions and looks for malicious patterns, such as stealing credentials, sending data out, or instructions hidden in the description.

This post compares four open-source tools: NVIDIA's [SkillSpector](https://github.com/NVIDIA/SkillSpector), Cisco's [skill-scanner](https://github.com/cisco-ai-defense/skill-scanner), Snyk's [agent-scan](https://github.com/snyk/agent-scan) and [AgentSeal](https://github.com/getagentseal/agentseal). It suits readers who have seen the [series map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en) and already have a set of skills or MCP configs. The material comes from each project's source code and documentation and from published research; nothing was installed or tested hands-on.

## Three ways to scan

**Static rules.** Match known malicious patterns with regular expressions, syntax trees and YARA rules. SkillSpector works mostly this way; the LLM is an optional extra, and it can only add findings, never retract what the rules already caught. Its README states that scanning never executes the skill being scanned.

**LLM judgment.** Let a model read the skill's instructions and code and judge intent. Cisco's rules are deliberately light, and its documentation says that rules alone catch only about 8% of malicious samples they have not seen before, which is why every recommended setup turns the LLM judge on.

**Actual connection.** For an MCP server, connect to it and read the tool descriptions it advertises. That means running the server first: AgentSeal's `scan-mcp` starts the target server as a child process, and Snyk's agent-scan also starts stdio MCP servers, asking for your consent before it does. Running something in order to scan it contradicts the idea of scanning before running. agent-scan started life as Invariant Labs' mcp-scan, and the old URL now redirects to Snyk's repo; it finds the skills under `~/.claude` and the `.mcp.json` files on its own, then sends the content to Snyk's remote API for analysis, which requires a token.

| Tool | Main method | Does it execute the target? | Where content goes |
|---|---|---|---|
| SkillSpector | Rules, AST, YARA; LLM optional | States that it does not | LLM is on by default and file contents go to the provider you configure; only `--no-llm` keeps them local |
| skill-scanner | Rules, YARA, AST; LLM judge recommended | Documentation does not say | Depends on the LLM you set, plus optional VirusTotal and Cisco cloud services |
| agent-scan | Finds configs locally, analyzes remotely | Starts stdio MCP servers, with a consent prompt first | Configs and tool descriptions go to Snyk's API; a token is required |
| AgentSeal | Rules, de-obfuscation, embedding model; `scan-mcp` connects | `scan-mcp` starts the target server | Licensed under FSL-1.1 (not an open-source license); last updated in 2026-06 |

## How to read a scan report

SkillSpector outputs a risk score and labels anything above a threshold "do not install". The score is a severity-weighted sum of the findings.

An outside user reported in [issue #644](https://github.com/NVIDIA/SkillSpector/issues/644) that with the LLM off, several rule families produced nothing but false positives: a BOM at the start of a file read as a hidden instruction, or the `plist` inside `relationshipList` read as a suspicious string. The biggest contributor to the score was a group of high-severity findings repeated line by line, so a skill with no real problem could still be marked "do not install".

In the other direction, "no findings" only means no known pattern matched. Cisco's README says outright that it does not guarantee a skill is safe.

So here is something you can do tonight: pick the skill you use most and scan it once. For every finding, open the line it points to and ask two questions: is this something the skill is supposed to do, and does its description say so? A GitHub automation skill reading a token is doing its job; a note-organizing skill reading `~/.ssh` is the sign to stop.

## Can the numbers be trusted

Cisco's [measured-results document](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md) is open about how rules alone perform, and says something most vendors do not: on the data the rules were developed against, recall is about 31%, and on data they had not seen it drops to about 8%. The same document admits that twice during development the frozen test data was used when it should not have been.

With the LLM judge added, recall rises to about 67% and the false-positive rate to about 15%, at the cost of being slower and more expensive.

Third-party tests show scanners are easy to bypass. In [its June 2026 post](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/), Trail of Bits pushed malicious code out of the LLM's context with a hundred thousand newlines, and hid malicious logic in `.pyc` bytecode, to get past Cisco's scanner. [Adversa's test](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/) covered eight open-source scanners, and with the LLM judgment turned off every one let a malicious skill through; SkillSpector was bypassed with homoglyphs, paraphrased injection instructions and text inside images. SkillSpector's own README lists limits that include non-English content, image-based attacks and encrypted or binary code. Adversa also sells similar security products, which is background worth keeping in mind when reading its conclusions.

The numbers also shift with the dataset. [MalSkillBench](https://arxiv.org/abs/2606.07131) is an evaluation dataset built by independent researchers: VirusTotal's recall is 21.6% over all samples and 87.9% on the in-the-wild subset. The authors explain that the wild samples are almost all one kind of behavior, so the high recall is carried by that one behavior and does not mean broad coverage. The dataset itself is disputed too; a third party points out that over a tenth of its malicious samples are empty directories.

The upshot is that no neutral evaluation everyone accepts tells you which scanner is more accurate. The numbers vendors publish come from data the vendor picked.

## How to use them

1. **Use them as a first filter, not a gate.** Scan a new skill once; if something rates high, look at that line yourself before deciding to install.
2. **Treat "not fully read" as a fail.** SkillSpector has options such as `--fail-on-incomplete` that return a failure when coverage is incomplete. Copy the idea: files that were not scanned do not count as clean.
3. **Think about where content goes before you scan.** For a skill with private data or internal code, use `--no-llm` or a local model rather than sending it to a cloud provider.
4. **Know which scans run the target.** For an MCP server you do not yet trust, a scan that starts it should happen in an isolated environment, not in your everyday working setup. The next post, on sandboxes, is about exactly that.
5. **Do not feed the output straight into automation.** agent-scan's README says its output format is experimental and may change without notice; a script that parses it to decide what to block may quietly stop working after an upgrade.

## Where this leaves you

A pre-install scanner's value is picking out the places worth a human look before anything has run. It will not stop a paraphrased injection, instructions inside an image, or a skill that changes its content after you install it. Published detection numbers all come from the authors themselves or from interested parties, so they cannot be compared directly. Treat it as the first sieve, not a pass. The next post covers the second: if the agent has already been fooled, what a sandbox limits it to.

## References

- [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)
- [SkillSpector issue #644: false positive report](https://github.com/NVIDIA/SkillSpector/issues/644)
- [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)
- [skill-scanner measured results](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md)
- [snyk/agent-scan](https://github.com/snyk/agent-scan)
- [getagentseal/agentseal](https://github.com/getagentseal/agentseal)
- [Trail of Bits: The sorry state of skill distribution](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)
- [Adversa AI: eight agent skill scanners tested for bypasses](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)
- [MalSkillBench (arXiv:2606.07131)](https://arxiv.org/abs/2606.07131)
- [How AI agent security tools fit together: four entry points, seven kinds of tool, three shared limits](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en)
