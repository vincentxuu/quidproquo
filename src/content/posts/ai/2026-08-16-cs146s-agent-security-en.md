---
title: "CS146S Week 7: o3 Found a Linux Kernel Zero-Day at a 1:50 Signal-to-Noise Ratio"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - security
  - prompt-injection
  - ai-agent
  - sandbox
  - agentic-coding
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 8
tldr: "The course measured AI SAST false positive rates at 50–100%, against 50%+ for traditional SAST — the genuinely new problem is nondeterminism: run the same prompt twice, get different results, and you can never answer \"am I done scanning?\" The course lists five agent attack vectors, one of which, intent breaking, attacks the agent's plan itself."
description: "Stanford CS146S Fall 2026 Week 7, 'Security': SAST/SCA and dependency risk, why prompt injection has topped OWASP three years running, the lethal trifecta threat model, and the measured results and costs of agent-assisted vulnerability triage."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-agent-security)

This is the eighth post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 7 of Fall 2026.

Three topics: SAST / SCA, dependency and secret-leak vulnerabilities; prompt injection and agent-specific attack surfaces; agent-assisted triage and remediation. The guest is Semgrep CEO Isaac Evans, present in both syllabi.

Security is the **only topic that survives in both versions**. But this week has to handle two opposite things at once: agents as defensive tooling, and agents as a new attack surface.

## The three acronyms the course teaches first

Fall 2026's first topic this week names SAST / SCA directly. The matching Fall 2025 session, Week 6 "AI QA, SAST, DAST, and Beyond" ([slides](https://docs.google.com/presentation/d/1C05bCLasMDigBbkwdWbiz4WrXibzi6ua4hQQbTod_8c/edit)), defines all three:

| | Full name | What it is | What it catches |
|---|---|---|---|
| **SAST** | Static Application Security Testing | White box; analyzes source and binaries via pattern matching | SQL injection, command injection, XSS. Runs early in the SDLC where fixes are cheapest. Tools: Bandit, Semgrep, ESLint + extensions |
| **DAST** | Dynamic Application Security Testing | Black box; mimics the actions of real-world attackers | The above plus broken authentication. **Fewer false positives than SAST.** Techniques: input fuzzing, manipulating session tokens, header testing, brute-force rate-limit tests |
| **SCA** | Software Composition Analysis | Deep analysis of the OSS packages you depend on | Package metadata analysis, transitive dependency resolution, matching against vulnerability databases, binary/artifact scanning |

The course's one-line summary of how they relate: they "cover code + runtime + dependencies." **None of the three substitutes for the other two, and none of them is replaced by an LLM.**

Its motivation is equally direct: "When an LLM is writing most of your code, you need extensive guardrails to prevent those errors."

## Defense: agents really do find vulnerabilities

Start with the half that has a track record.

In May 2025, Sean Heelan used o3 to find a remote zero-day in the Linux kernel's ksmbd module (CVE-2025-37899), a use-after-free in the `smb2_session_logoff` path. His [full write-up](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) stresses how unglamorous the setup was: "no scaffolding, no agentic frameworks, no tool use" — just the API and a prompt.

What makes the post valuable is that it also publishes the cost. He first benchmarked on a known bug with about 3.3k lines of code (~27k tokens):

> o3 finds the kerberos authentication vulnerability in the benchmark in 8 of the 100 runs. In another 66 of the runs o3 concludes there is no bug present in the code (false negatives), and the remaining 28 reports are false positives.

Eight hits in a hundred, sixty-six all-clears, twenty-eight false positives. His summary of the overall result is "the signal to noise ratio of ~1:50 in this case," and he states flatly that "o3 is not infallible."

**That combination is exactly what AI-assisted triage should look like**: the model generates candidates, the human filters. A 1:50 ratio is a disaster for an automated pipeline and an enormous accelerant for a researcher who would otherwise be reading 12,000 lines by hand. Same lesson as [Week 6's code review](/posts/ai/2026-08-16-cs146s-agentic-code-review-en) — the bottleneck is always on the noise side.

Semgrep has published its own experiment [using Claude Code and Codex to find vulnerabilities in modern web apps](https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/), pointing the same way: rule-based SAST catches known patterns, models catch the class that needs semantic and cross-file reasoning. Complements, not replacements.

The course measured this too, and its numbers are blunter than the one above. From the same deck's Limitations slide:

> In AI SAST, false positive rates are incredibly high
> - **Claude Code/Codex can be 50-100% depending on the vulnerability**
> - Compare to **50+%** for traditional SAST techniques

**Both sides are high.** That is the honest part of the slide — it doesn't measure AI's false positives against an imaginary perfect traditional tool, it points out that traditional SAST already runs above 50%. The real difference lies elsewhere, and the course names it: **nondeterminism** — "Run the same prompt multiple times and get different results → how do you know you're catching all vulnerabilities?" — with context rot and compaction listed as causes.

A scanner that returns different results each run cannot answer "am I done scanning?" However noisy traditional SAST is, at least it is noisy about the same things every time.

## Offense: prompt injection is not solved

Now the other half.

OWASP published the [GenAI / LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) on August 3, 2026, describing the edition as "grounded in thousands of real-world AI security incidents" and mapping its risks to NIST, MITRE ATLAS, CWE, and the Agentic Applications list. [SD Times reports](https://sdtimes.com/security/prompt-injection-tops-2026-owasp-genai-llm-top-ten-vulnerabilities/) that prompt injection holds first place **for the third year running**, quoting project co-chair Steve Wilson on the change in method — previous editions ranked mainly by expert voting, while this one tested those votes against incident records: "OWASP now has a database containing roughly 10,000 real-world AI security incidents."

It stays first not for lack of effort — the problem is **structurally unsolved**: models cannot reliably distinguish a user's instructions from text inside data that looks like instructions.

The most useful threat model is Simon Willison's [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) (June 2025) — three capabilities that become dangerous together:

1. **Access to private data** (your repo, your secrets, your database)
2. **Exposure to untrusted content** (issue bodies, web pages, dependency READMEs, PR comments)
3. **The ability to communicate externally** (HTTP requests, opening PRs, sending mail)

Any one alone is safe. All three together let an attacker who controls the second exfiltrate the first through the third.

The problem is that **a typical coding agent has all three on by default**: it reads your private repo, it reads issues and web docs, and it can push branches and call APIs.

Real cases are not scarce. One of Fall 2025's assigned readings is the analysis of [remote code execution in GitHub Copilot via prompt injection](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/).

## The five attack vectors the course lists

Above I covered only prompt injection and supply chain. The course sorts them into five, each with a definition:

1. **Prompt injection** — hidden or misleading instructions that make the system deviate from intended behavior
2. **Tool misuse** — manipulating the agent through deceptive prompts to abuse its integrated tools
3. **Intent breaking** — manipulating the agent's **plan** to redirect actions away from the original intent
4. **Identity spoofing** — exploiting compromised authentication to pose as legitimate agents
5. **Code attacks** — exploiting the agent's ability to execute code to gain unauthorized access to the execution environment

Number 3 deserves attention. **Intent breaking attacks neither the input nor the tools, but the planning** — the agent still acts "according to its own plan," except the plan has been rewritten. That is especially dangerous in architectures with a planner/implementer split, because the implementer has no reason to doubt the plan it was handed.

Number 4 only exists in multi-agent systems, which is exactly why Fall 2025 assigned [the Unit 42 piece](https://unit42.paloaltonetworks.com/agentic-ai-threats/).

## Three new supply-chain entrances

Beyond prompt injection, the agent ecosystem adds three dependencies, each a supply-chain risk:

**MCP servers** — every server you connect sees what you send it and can return arbitrary content into context. The tool description itself is an injectable surface.

**Agent Skills** — Anthropic warns in its [own documentation](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) that "malicious skills may introduce vulnerabilities in the environment where they're used or direct Claude to exfiltrate data and take unintended actions." The advice is to install only from trusted sources and audit file by file otherwise. Installing a skill sits at the same threat level as installing an npm package (see [Week 3](/posts/ai/2026-08-16-cs146s-agent-skills-en)).

**Model-suggested package names** — agents import packages that don't exist, and an attacker can register the name first. This slopsquatting risk has been measured: [arXiv:2406.10279](https://arxiv.org/abs/2406.10279) generated 576,000 Python and JavaScript code samples across 16 models and found "the average percentage of hallucinated packages is at least 5.2% for commercial models and 21.7% for open-source models," spanning 205,474 unique hallucinated package names.

## What you can do: break the trifecta

Since prompt injection has no reliable general fix, practical defense means **preventing the three conditions from holding simultaneously**:

| Which leg to break | How |
|---|---|
| Private data | Least-privilege credentials for the agent; secrets in env vars and a secret manager, never in context |
| Untrusted content | Mark external content as data rather than instructions; filter across trust boundaries |
| Outbound channel | Egress allowlists; human approval for writes (push, publish, send) |
| All of it | Sandboxing — [Claude Code's sandboxing design](https://www.anthropic.com/engineering/claude-code-sandboxing) is one reference implementation |

Two process-level rules to add:

- **Agent-authored code goes through the same gates as human code.** "AI wrote it, so it's faster" is not a reason for a fast lane
- **Secret scanning belongs in pre-commit, not CI.** An agent can touch a dozen files in one turn; by the time CI catches it, the secret is in branch history

## An easily missed third risk

Besides "being attacked" and "producing vulnerabilities," there's a third category: **the agent breaking things on its own**. An agent with `bash` access needs no attacker to delete your branches. This never appears on an OWASP list because it isn't a security vulnerability — it's a permissions design problem. The remedy is identical: least privilege, sandboxing, confirmation for destructive actions.

## The six questions the course leaves open

The deck's final slide is six unanswered questions, worth reproducing as-is — they mark the field's current boundary more accurately than any conclusion:

> - How to reduce false positives and hallucinations in vulnerability detection?
> - How do we verify that LLM-generated patches are secure and don't introduce regressions?
> - How can LLMs explain why they flag a vulnerability or propose a fix?
> - What are the right benchmarks for measuring LLMs' AppSec performance?
> - How should LLMs be embedded in CI/CD without overwhelming teams with noise?
> - **Who is accountable if an AI-generated patch introduces a vulnerability?**

The last one is not a technical question. **The course puts it on the same list as the technical ones, and does not answer it.**

## What will go stale

- The o3 experiment is from May 2025 and models have turned over since; those numbers describe **the shape of the method**, not today's hit rate
- OWASP revises its lists annually; the latest at time of writing is the GenAI / LLM Top 10 2026, published 2026-08-03
- Sandbox and permission defaults across agent products change often — check current docs before implementing

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 7 topics and guest
- [How I used o3 to find CVE-2025-37899](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) — Sean Heelan, 2025-05-22, with full hit and false-positive counts
- [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) — Simon Willison, 2025-06-16
- [OWASP GenAI LLM Top 10 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) — official resource page, 2026-08-03
- [Prompt Injection tops 2026 OWASP GenAI / LLM Top Ten vulnerabilities](https://sdtimes.com/security/prompt-injection-tops-2026-owasp-genai-llm-top-ten-vulnerabilities/) — SD Times, with Steve Wilson on the ranking method
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — legacy entry point, now under the GenAI Security Project
- [GitHub Copilot Remote Code Execution via Prompt Injection](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/) — assigned in Fall 2025 Week 6
- [Finding Vulnerabilities in Modern Web Apps Using Claude Code and OpenAI Codex](https://semgrep.dev/blog/2025/finding-vulnerabilities-in-modern-web-apps-using-claude-code-and-openai-codex/) — Semgrep, assigned in Fall 2025 Week 6
- [Agentic AI Threats: Identity Spoofing and Impersonation Risks](https://unit42.paloaltonetworks.com/agentic-ai-threats/) — Unit 42, assigned in Fall 2025 Week 6
- [AI QA, SAST, DAST, and Beyond](https://docs.google.com/presentation/d/1C05bCLasMDigBbkwdWbiz4WrXibzi6ua4hQQbTod_8c/edit) — Fall 2025 Week 6 slides: the three acronyms defined, five attack vectors, and AI SAST false positive rates
- [Claude Code sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) — Anthropic Engineering
