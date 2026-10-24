---
title: "Scanning Skills and MCP Servers Before You Install Them: What SkillSpector, Cisco skill-scanner, Snyk agent-scan and AgentSeal Can Show You"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, agent-skills, mcp, supply-chain, ai-agent]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 1
tldr: "These four pre-install scanners work in one of three ways, usually combining two: static rules, LLM judgment, or actually connecting to the MCP server. Cisco's own documentation shows rules alone catch about 8% of malicious samples they have not seen, and third-party tests show the numbers shift a lot when the sample mix changes. Use scanners as a first filter; \"no findings\" does not mean safe."
description: "How four source-available pre-install scanners for skills and MCP servers differ in method, data egress and execution risk, how to read a scan report, why published detection numbers cannot be compared directly, and how to use them in practice."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners)

You found a useful-looking skill on GitHub and are about to drop it into your skills directory. A pre-install scanner does one plain thing: before you install, it reads the skill's files and instructions and looks for malicious patterns, such as stealing credentials, sending data out, or instructions hidden in the description.

On the [series map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en), this is the first kind of tool, and it covers the "things you install" entry point: while the skill is still sitting in a directory, before the agent has read it. What a scanner adds is a batch pass over the whole directory that hands you a list for a human to review. What it does not add is a judgment that something is safe.

This post compares four source-available tools: NVIDIA's [SkillSpector](https://github.com/NVIDIA/SkillSpector), Cisco's [skill-scanner](https://github.com/cisco-ai-defense/skill-scanner), Snyk's [agent-scan](https://github.com/snyk/agent-scan) and [AgentSeal](https://github.com/getagentseal/agentseal) (whose license is not an open-source one; see the table). It suits people who already have a set of skills or MCP configs. The material comes from each project's source code and documentation and from published research; nothing was installed or tested hands-on.

## Two terms first

Recall is how many of a hundred bad skills the scanner catches; the false-positive rate is how many of a hundred good skills it wrongly flags. Read them together: flag every skill as dangerous and recall is 100%, and so is the false-positive rate.

## Three ways to scan

**Static rules.** Match known malicious patterns with regular expressions, syntax trees and YARA rules. SkillSpector works mostly this way; the LLM is an optional extra that can only add explanation and confidence to what the rules caught, never retract or lower it. Its README states that scanning never executes the skill being scanned.

**LLM judgment.** Let a model read the skill's instructions and code and judge intent. Cisco's documentation says that with rules alone, only about 8% of malicious samples it has not seen before are caught, which is why every recommended setup turns the LLM judge on.

**Connecting to the server.** For an MCP server, connect to it and read the tool descriptions it advertises, which means running the server first. AgentSeal's `scan-mcp` starts the target server as a child process in stdio mode (`--sse` mode only connects). Snyk's agent-scan also starts stdio MCP servers; when run interactively it asks for your consent first, and `--dangerously-run-mcp-servers` skips the question. Because this kind of scan has to execute the target first, the scan itself carries execution risk, and the official advice is to scan untrusted configs inside a container or VM.

| Tool | Main method | Does it execute the target? | Where content goes | License and upkeep |
|---|---|---|---|---|
| SkillSpector | Rules, AST, YARA; LLM optional | States that it does not | LLM is on by default and file contents go to the provider you configure; with `--no-llm` they stay local, but dependency names and versions are still sent to OSV.dev for vulnerability lookup | Apache-2.0 |
| skill-scanner | Rules, YARA, AST; LLM judge recommended | Documentation does not say | Depends on the LLM you set, plus optional VirusTotal and Cisco cloud services | Apache-2.0 |
| agent-scan | Finds configs locally, analyzes remotely | Starts stdio MCP servers | MCP configs, tool descriptions and skill content (secrets masked first) go to Snyk's API; a token is required | Apache-2.0; it began as Invariant Labs' mcp-scan, and the old URL redirects to Snyk's repo |
| AgentSeal | Rules, de-obfuscation, embedding model; `scan-mcp` connects | Starts the target in stdio mode | The README says guard runs fully locally, and the same README also lists an option to query a cloud trust score | FSL-1.1: source is public but it is not an open-source license, converts to Apache 2.0 after two years, and restricts competing use; last code push 2026-06-11 |

## How to read a scan report

SkillSpector outputs a risk score from 0 to 100 plus a recommendation mapped from severity: safe, caution, or do not install.

A user reported in [issue #644](https://github.com/NVIDIA/SkillSpector/issues/644) that, scanning a batch of public skills with the LLM off, several rule families produced nothing but false positives, for example reading the invisible byte-order mark (BOM) at the start of a file as a hidden instruction; those were handled in a fix merged in late September. They also pointed out that, in the batch they scanned, the highest-scoring kind of finding was "file exceeds the parsing limit", rated high severity and reported once per referencing line, so skills with no real problem were marked "do not install". Several later fixes reduced false triggers of that limit, but I could not find out whether the high rating and the per-line repetition have changed.

In the other direction: if a scanner reports no findings, can you just install? No. No findings only means nothing matched a pattern it knows; Cisco's README says outright that it does not guarantee a skill is safe.

## Can the numbers be trusted

Cisco's [measured-results document](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md) is clear that the rules were tuned on the development data. Counting medium risk and above as a catch, recall on the development part of that dataset is about 31%, and on the test part with sources the rules had not seen it drops to about 8%; counting high risk and above, it is 7.7% with a 4.0% false-positive rate.

With the LLM judge added, about 67% of malicious samples reach the human review queue (medium risk and above, with about 15% false positives); counting only those blocked outright at high risk and above, it is about 34% with about 6% false positives. The price is being slower and more expensive.

Those figures are Cisco's own. The authors of a dataset called [MaliciousSkillBench](https://arxiv.org/abs/2608.19901) re-ran Cisco's scanner on the same test part with sources it had not seen (839 malicious, 545 benign), using a fixed local configuration and counting only high risk and above, and recall was 2.5%; SkillSpector with the LLM off scored 0%. Their environment differed slightly from the official one (a dependency version deviation), so the number cannot be subtracted directly from 7.7%, but it shows that a scanner's score depends on who measured it and under what settings.

Third-party tests show scanners are easy to bypass. In [its June 2026 post](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/), Trail of Bits got past Cisco's scanner by putting malicious code in `.pyc` bytecode, smuggling scripts inside a `.docx`, or persuading the LLM with wording that looked like corporate configuration; a separate trick, a hundred thousand newlines placed before the malicious code, made ClawHub's scanner truncate the file before it saw anything. The post does not state which version was tested, so check the current state yourself.

[Adversa's test](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/) covered eight scanners: seven were run offline with LLM judgment off, and the one that relies purely on LLM judgment was tested with a local model. Every one let at least one malicious skill through. SkillSpector held up against encoding wrappers and newline padding (Adversa thinks the encoding wrappers were caught only because of a trailing pipe-to-shell), and was bypassed by look-alike characters, paraphrased injection instructions and text inside images. Adversa's copy of SkillSpector was restored from `__pycache__` bytecode, which the authors say was validated more weakly than the others. Its own README lists non-English content, image attacks and encrypted or binary code among its limits. Adversa builds a scanner of its own, which is worth remembering when reading its conclusions.

The numbers also shift with the dataset. The similarly named [MalSkillBench](https://arxiv.org/abs/2606.07131) is an evaluation dataset from a different group of independent researchers: VirusTotal's recall is 21.6% over all samples and 87.9% on the subset collected in the wild. The authors explain that more than eight in ten of the wild samples are one kind of behavior, so the high recall is carried by that one behavior and does not mean broad coverage. Adversa adds that in the copy of the dataset it downloaded, roughly 13% of the malicious samples are empty directories, which caps the recall anyone could reach.

No neutral evaluation everyone accepts tells you which scanner is more accurate. The numbers vendors publish come from data the vendor picked, while independent datasets show the numbers change when the sample mix changes. For you, these numbers are good for deciding which to look at first, not for deciding what to let through.

## How to use them

1. **Tonight, pick the skill you use most and scan it once.** If it holds private data, use SkillSpector with `--no-llm` so file contents stay local (dependency names are still looked up on OSV.dev); for a quicker run you can use agent-scan, but it sends content to Snyk. Then, for each finding, open the line it points to and ask two questions: is this something the skill is supposed to do, and does its description say so? A GitHub automation skill reading a token is doing its job; a note-organizing skill reading `~/.ssh` is the sign to stop.
2. **Use it as a first filter, not a gate.** If a new skill rates high, read that line yourself before deciding whether to install it.
3. **Treat "not fully read" as a fail.** SkillSpector's `--fail-on-incomplete` returns a failure when scan coverage is incomplete. With other tools, apply the same rule yourself: whichever files were not scanned, open and read them rather than counting them as fine.
4. **Scan an MCP server you do not yet trust in a throwaway environment.** For example a virtual machine with no `~/.ssh` or cloud credentials on it, or a disposable container. Claude Code's built-in Bash sandbox does not wrap local MCP servers, so turning it on does not make such a scan safe.
5. **Do not parse the output to make automated decisions.** agent-scan's README says its output format is experimental and may change at any time without notice. If you automate, look only at the exit code, and before upgrading the tool, run the same test skill once to confirm the result has not changed.

## Where this leaves you

A scanner's value is picking out, before anything has run, the places worth a human look. Published detection numbers all come from the tool's authors or from vendors of similar products, and independent datasets show the results change with the sample mix, so treat a scanner as a first filter, not as grounds for letting something through. [Post 2](/posts/ai/2026-10-24-agent-sandboxes-en) covers the second one: if the agent has already been fooled, what a sandbox limits it to.

## References

- [NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)
- [SkillSpector issue #644: false positive report](https://github.com/NVIDIA/SkillSpector/issues/644)
- [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner)
- [skill-scanner measured results](https://github.com/cisco-ai-defense/skill-scanner/blob/main/docs/reference/measured-results.md)
- [snyk/agent-scan](https://github.com/snyk/agent-scan)
- [getagentseal/agentseal](https://github.com/getagentseal/agentseal)
- [Trail of Bits: The sorry state of skill distribution](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/)
- [Adversa AI: eight agent skill scanners tested for bypasses](https://adversa.ai/blog/agent-skill-scanners-bypass-eight-tested/)
- [MaliciousSkillBench (arXiv:2608.19901)](https://arxiv.org/abs/2608.19901)
- [MalSkillBench (arXiv:2606.07131)](https://arxiv.org/abs/2606.07131)
- [How AI agent security tools fit together: four entry points, seven kinds of tool, three recurring limits](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en)
