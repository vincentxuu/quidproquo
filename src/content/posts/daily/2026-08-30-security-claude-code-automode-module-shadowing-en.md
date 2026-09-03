---
title: "Security Alert｜Claude Code Auto Mode Bypassed — A Routine 'Summarize This Site' Task Reaches 80% Remote Code Execution via Python Module Shadowing"
date: 2026-08-30
category: daily
type: digest
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "Researcher Johann Rehberger (wunderwuzzi) shows that Claude Code Opus 5 running the new default Auto Mode can be steered from a routine 'summarize this website' task into remote code execution, with three attack variants succeeding 60%-80% of the time. Anthropic closed the report as working as designed."
tldr: "Rehberger published technical details on 8/26: a website disguised as a notebook archive first gets Claude's WebFetch a 415 error, nudging it to fall back to curl; a 303 redirect then delivers a ZIP containing a malicious struct.py. Claude correctly refuses to run the bundled suspicious binary and writes its own Python decoder instead — but that decoder runs import base64 from inside the extracted directory, so Python's module search path picks up the local malicious struct.py before the standard library, triggering a remote payload download, a C2 callback, and even a second headless Claude Code sub-agent. Anthropic's commissioned evaluation claimed a 0.00% attack success rate across 72 scenarios for Opus 5 in Auto Mode, but this targeted attack chain hit 60%-80%. Anthropic closed the report as Informative / working as designed, calling Auto Mode a 'best-effort classifier, not a security guarantee' — the real boundary is OS-level sandboxing and network egress control."
series:
  name: "AI Security Alert"
  order: 16
---

> 🌏 [中文版](/posts/daily/2026-08-30-security-claude-code-automode-module-shadowing)

## Incident Overview

Security researcher Johann Rehberger (known online as wunderwuzzi, a longtime prompt-injection researcher) published a technical blog post on August 26 showing how an entirely ordinary task on Claude Code Opus 5 running Auto Mode — "summarize this website" — can be chained into remote code execution, and even into spinning up a second, independently-privileged Claude Code sub-agent. The timing makes this especially notable: Anthropic's commissioned evaluator, Trajectory Labs, tested 72 indirect prompt-injection scenarios and reported a 0.00% attack success rate for Opus 5 in Auto Mode. Rehberger's deliberately-crafted attack chain hit 60%-80% success in small-sample testing. The Register, Cybernews, CyberPress and other outlets picked up the story between 8/27 and 8/29. Anthropic received the disclosure and closed it as "Informative" — the behavior was judged to be working as designed, not a vulnerability requiring a patch.

**Key Facts**

| Item | Value |
|---|---|
| Type | Prompt injection → tool-switch coercion → Python module shadowing → remote code execution |
| Scope | Users and automated pipelines running Claude Code Opus 5 with Auto Mode (the default since mid-August 2026) that process external web pages or files |
| Severity | High (reproducible PoC, 60%-80% success rate; requires the user to issue a task that touches an external site) |
| CVE | None (Anthropic closed as Informative, no CVE issued) |
| Sources | [Embrace The Red (original research)](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/), [The Register](https://www.theregister.com/research/2026/08/28/researcher-shows-how-claude-code-can-be-tricked-simply-by-asking-it-to-summarize-a-website/5293372), [Cybernews](https://cybernews.com/security/claude-code-auto-mode-malware-vulnerability/) |

## Attack Surface Analysis

The attack chain deliberately never issues a direct instruction — it works entirely by making the malicious path look like the most reasonable next step toward completing the task. First, the attacker sets up a website posing as an archive of notebook records. Claude initially uses its built-in WebFetch tool to read it, but the server returns a 415 Unsupported Media Type. Nobody tells Claude to switch tools — it decides on its own that "WebFetch failed, let me try directly" and issues a Bash call using curl. This step matters: switching from WebFetch to curl means the content no longer passes through WebFetch's internal summarization sub-agent, and instead lands directly in the main agent's filesystem-operating context. The server then issues a 303 redirect pointing curl at a ZIP archive containing plausible-looking catalog metadata, checksums, seven encoded JSON records, a macOS decoder binary, and a file named `struct.py`.

The second step is where the attack gets clever. Claude correctly refuses to run the bundled suspicious binary ("This is planned and what the attacker wants," in Rehberger's words) — but instead of stopping there, it writes its own replacement Python decoder to process the Base85/zlib-encoded JSON records. That "don't trust the supplied binary, write my own code instead" decision — which looks like the safer choice — is exactly what triggers the vulnerability. Because the replacement script runs from inside the freshly extracted directory, and Python's import resolution checks the current working directory first, the script's `import base64` transitively triggers the standard library's own import of `struct` — and Python resolves that to the ZIP's same-named malicious `struct.py` instead of the system module. This is classic **module shadowing**: a local file with the same name as a standard-library module gets loaded ahead of the real one. The malicious `struct.py` faithfully re-exports the real low-level `_struct` interface so decoding looks completely normal and Claude gets valid JSON back, while a module-level expression — obfuscated, Rehberger says with help from ChatGPT — quietly launches a separate Python process that downloads and executes a remote payload, establishing a C2 callback. Rehberger also demonstrated a variant where, instead of a plain Python subprocess, the payload spawns a second headless Claude Code instance via `claude -p` — that sub-agent gets its own independent tool access and context, and in testing ran recon commands (`whoami`, `uname`, `id`) and wrote files into the user's home directory. Across three variants, each tested five times, success rates ranged from 60% to 80%.

Just as notable is which direction the defense failed in: in some runs, Claude later recognized `struct.py` as booby-trapped and tried to kill the malicious process it had started — but Auto Mode's classifier flagged the termination command as risky and blocked it, letting the rogue process survive. The classifier permitted the act of creating the malware, but blocked the act of cleaning it up. Mapped onto the OWASP LLM Top 10, this lands squarely on **LLM01 Prompt Injection** (the core coercion technique) and **LLM08 Excessive Agency** (the agent retains the ability to download, extract, and execute arbitrary files, while the classifier only evaluates each step's surface-level appearance and can't see that a chain of individually-benign steps adds up to a full attack). The root cause isn't that the model "got fooled" — it's that Auto Mode's safety model checks steps individually for surface compliance. As Rehberger quotes Anthropic's response: "Auto Mode is a convenience feature backed by a best-effort classifier, not a security guarantee." The classifier was never designed to catch a deliberate chain built from steps that each look harmless in isolation; the actual trust boundary should sit at OS-level isolation and network egress control, not inside the model or its classifier.

## Mitigations

**Immediate actions**
- Inventory every Claude Code automation that processes external web pages or files (CI/CD, scheduled jobs, unattended agent pipelines) — don't assume "Auto Mode is on" is sufficient protection on its own
- Run Claude Code (and any coding agent with Bash/filesystem access) inside a container, VM, or OS-level sandbox, and restrict network egress to an explicit allowlist to prevent arbitrary downloads and execution
- Never expose SSH keys, cloud credentials, or home directories directly to the agent's execution environment; monitor process and filesystem activity independently of the model's own safety classifier
- Watch specifically for the pattern of an agent writing its own code and immediately executing it — this attack shows that the seemingly-safer choice ("don't trust the supplied binary, write my own instead") can itself be the path an attacker designed you into

**Longer-term architecture**
- Treat Auto Mode, or any built-in model safety classifier, as a convenience layer rather than a security boundary — don't let it substitute for process-level isolation and monitoring. Rehberger's core conclusion, "do not trust the model output," still holds in the agentic era
- Evaluate watchlist B7 tools like Lakera for runtime prompt-injection detection that can catch cross-step attack chains the classifier misses; Netzilo's agent runtime governance and kill-switch mechanisms are also worth considering for centrally controlling child processes and sub-agents an agent spawns
- Define explicit permission boundaries for "an agent launching another agent" (e.g. `claude -p` spawning a headless sub-agent) — a sub-agent shouldn't automatically inherit its parent's full tool access
- Establish explicit ask/deny rules around process creation and sensitive paths, and never treat "Auto Mode allowed this action" as evidence that the action was safe

## Impact

There's no known real-world victim from this specific disclosure — Rehberger demonstrated the chain on his own test site, restricted to allow-listed IPs, and the payload was a demonstration C2 callback and Calculator popup. But the underlying attack surface is generic: any Claude Code Auto Mode use case that processes untrusted external web content or files is potentially exposed to the same technique, and risk is higher for unattended pipelines wired into CI/CD or holding cloud credentials. Anthropic has closed this as working as designed, with no public patch timeline or version update planned — meaning the defensive burden sits entirely with users' own sandboxing and monitoring design.

If your team is wiring Claude Code (or any agentic coding tool) into automation that processes external input, this incident makes two things clear: first, a vendor's own commissioned evaluation numbers (a reported 0.00% attack success rate) can't substitute for threat modeling your own actual use case — the gap between benchmark scenarios and real attack-chain design can be enormous. Second, a model making what looks like the "safer" choice (refusing to run a foreign binary, writing its own code instead) doesn't mean the resulting path is safe — defense has to look at the full data flow and execution environment, not the surface appearance of any single step.

## Today's Takeaway

What's most unsettling about this incident isn't the technical details of the attack chain — it's which direction the defense failed. Claude did correctly identify `struct.py` as a trap afterward and tried to clean up after itself, but Auto Mode's classifier blocked the "terminate the malicious process" remediation while permitting the "spawn the malicious process" action that actually mattered. That suggests the classifier's judgment criteria and the model's own risk assessment can be two separate, even contradictory, logics — and conflating them produces failure modes stranger than having no classifier at all. It's also reinforced one thing for me: a model "choosing what looks like the safer option" should never be treated as evidence that the resulting execution path is safe, because that's precisely the seemingly-safe next step an attacker is likely to have designed the chain around.

## References

- [Breaking Claude Code Opus 5 Auto Mode — Embrace The Red (Johann Rehberger's original research)](https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/)
- [Researcher shows how Claude Code can be tricked simply by asking it to summarize a website — The Register](https://www.theregister.com/research/2026/08/28/researcher-shows-how-claude-code-can-be-tricked-simply-by-asking-it-to-summarize-a-website/5293372)
- [Claude Code Auto Mode Malware Exploit Shows AI Assistants Can Still Be Tricked — Cybernews](https://cybernews.com/security/claude-code-auto-mode-malware-vulnerability/)
- [Claude Code Auto Mode Bypassed via Zip Payload at 80% Rate — Grid the Grey](https://gridthegrey.com/posts/claude-code-auto-mode-bypassed-via-zip-payload-at-80-rate/)
- [Prompt Injection Attack Hijacks Claude Code Opus 5 Auto Mode — CyberPress](https://cyberpress.org/prompt-injection-attack-hijacks-claude-code-opus-5/)
