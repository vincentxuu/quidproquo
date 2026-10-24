---
title: "Learning AI Security: Practical Paths Through Attacks, Defense, and Investigation"
date: 2026-10-22
category: ai
type: guide
tags: [ai-security, security, ai-agent, llm, mcp]
lang: en
difficulty: 入門
series:
  name: "AI Security in Practice"
  order: 0
tldr: "Follow one support assistant through AI-assisted vulnerability discovery, protection of AI data and tools, and AI-assisted investigation and remediation. Each path produces reproducible evidence."
description: "A roadmap for AI Security in Practice: shared foundations in data flow and authorization, three practical paths, and exercises spanning CTFs, self-hosted cloud environments, and authorized systems."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-overview)

You build a support assistant that answers questions in Chinese. It reads a knowledge base, retrieves tickets, and drafts replies. Then someone asks: “If I change the ticket ID, will it hand me another customer's information?”

That question takes AI security down to the actual system: who is asking, where the data comes from, who authorizes a tool action, and what evidence remains when something goes wrong.

This series follows one application along three paths: **AI-assisted attacks, securing AI systems, and AI-assisted investigation and remediation**. This overview helps you choose a path and draw an initial data-flow diagram and access policy for your application.

## What role does AI play in security?

Start with the job you want to do. The same model can play different roles in different workflows.

| Path | The question you are answering | What an exercise produces |
|---|---|---|
| AI-assisted attacks | Which entry point might be exploitable, and how can I demonstrate the impact? | A reproduction with an environment, inputs, and observed results |
| Securing AI systems | Which boundary could untrusted content or a bad tool request cross? | Access rules, controls, and before-and-after tests |
| AI-assisted investigation and remediation | What happened, which conclusions have evidence, and is the issue fixed? | A traceable timeline, a patch, and regression results |

[NIST's overview of AI and cybersecurity](https://www.nist.gov/blogs/cybersecurity-insights/managing-cybersecurity-and-privacy-risks-age-artificial-intelligence) separately discusses securing AI, defending against AI-enabled attacks, and using AI for defense. This series expands the attack workflow so you can understand how a model observes a target, proposes hypotheses, calls tools, and revises its next step.

AI-assisted attacks may target an ordinary website or API. An AI application may face conventional authorization bugs as well as problems introduced by AI inputs. These overlap, but every vulnerability does not become prompt injection.

## Follow one support request through the system

Our teaching example is a support assistant serving two tenants. A tenant is a customer organization sharing the service: companies North and South each have their own documents, users, and tickets.

In this example architecture, the backend obtains the authenticated identity, retrieves permitted data, and sends it to the model. The model produces an answer or proposes a tool request. The backend checks that specific operation before executing it.

```diagram
title: Teaching example: request to tool execution
desc: The backend obtains authenticated identity, retrieves permitted data, and checks the model-proposed tool action before executing it.
---
<svg viewBox="0 0 400 500">
  <path class="dg-line" d="M200 76V120" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 172V216" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 268V312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M200 364V408" marker-end="url(#arrow)"/>
  <rect class="dg-box" x="70" y="28" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="52" text-anchor="middle" dominant-baseline="central">User and session</text>
  <rect class="dg-box" x="70" y="124" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="148" text-anchor="middle" dominant-baseline="central">API access checks</text>
  <rect class="dg-box" x="70" y="220" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="244" text-anchor="middle" dominant-baseline="central">Permitted data</text>
  <rect class="dg-box" x="70" y="316" width="260" height="48" rx="6"/>
  <text class="dg-label" x="200" y="340" text-anchor="middle" dominant-baseline="central">Model tool request</text>
  <rect class="dg-box dg-box--accent" x="50" y="412" width="300" height="48" rx="6"/>
  <text class="dg-label" x="200" y="436" text-anchor="middle" dominant-baseline="central">Tool checks and execution</text>
</svg>
```

Follow the request through these boundaries and ask:

1. **When external content enters:** a ticket attachment is data to process. What happens if it contains instructions to ignore the original rules?
2. **Before data reaches the model:** may this user read this resource? [Microsoft's multitenant RAG guidance](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag) applies tenant and user access filters before grounding data reaches the model.
3. **Before a tool acts:** does the backend check the user, resource, and action for this invocation? [OWASP's MCP guidance](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) places these checks in trusted code.

Each point is worth observing. If the model says it exported data, check the tool result and the actual output to establish whether an export occurred.

## One potential bug, three different jobs

Suppose our teaching product allows an ordinary user to read only private tickets they own within their tenant. Alice from North normally reads `N-1`. She changes the request to `S-1`, which belongs to South.

This is a scenario to test; it does not assume the service is vulnerable:

```text
Authenticated user: alice, belonging to tenant north
Original request: read_ticket(ticket_id="N-1")
Test request: read_ticket(ticket_id="S-1")
Expected: deny access; do not include S-1 content in an answer or tool result
```

**The attack path** uses AI to locate entry points accepting a ticket ID, hypothesize a missing authorization check, and propose a minimal verification. Receiving another customer's data supplies evidence of that impact. A model's suggestion that a path “might be vulnerable” remains a hypothesis.

**The defense path** obtains identity from trusted authentication state and checks the tenant and ticket owner. It then verifies denial for the same request while retaining a normal test that reads the user's own ticket. [Part 1: After Login, Who Can Read Which Data?](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en)contains the policy and runnable example.

**The investigation path** connects the request, authorization decision, tool result, and response to determine whether data crossed the boundary. AI can organize events; each confirmed conclusion must lead back to an original record.

The paths share case IDs, so the attack input, the post-fix denial, and the investigation report can all refer to the same event.

## Who is this for, and what should you know?

Start with the shared foundation if you have written a simple program or called an API and want to understand where an AI application can fail. You should be able to read a basic function, request parameters, and JSON. The opening parts introduce identity, authorization, and vulnerability evidence.

Experienced security practitioners can choose by task: attack tooling, protection of a RAG or agent application, or code review and incident investigation.

The focus is application behavior and working procedures. Training-time attacks, hardware security, deepfake fraud, and frontier AI alignment have different prerequisites and experiments; they remain extension topics.

## The roadmap: choose a path after the shared foundation

Start with Parts 0–3, then follow attacks (4–9), defense (10–16), or investigation and remediation (17–22). Part 23 brings their artifacts together.

| Part / path | Topic |
|---|---|
| 0 · Foundation | Learning AI Security: Practical Paths Through Attacks, Defense, and Investigation (this part) |
| 1 · Foundation | [Who Can Read Which Data After Login? Identity and Authorization for AI Assistants](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en) |
| 2 · Foundation | [AI Says It Found a Vulnerability. What Evidence Do You Need?](/posts/ai/2026-10-22-ai-security-vulnerability-evidence-en) |
| 3 · Foundation | [Choose an AI Security Practice Environment: Local, Cloud, CTF, or Authorized Targets](/posts/ai/2026-10-22-ai-security-experiment-environments-en) |
| 4 · Attacks | [How AI turns a target into an attack surface](/posts/ai/2026-10-22-ai-security-attack-surface-en) |
| 5 · Attacks | [Let AI look for vulnerabilities: from clues to testable hypotheses](/posts/ai/2026-10-22-ai-security-vulnerability-hypotheses-en) |
| 6 · Attacks | [How to verify an AI-generated exploit test](/posts/ai/2026-10-22-ai-security-exploit-verification-en) |
| 7 · Attacks | [How AI attacks another AI: indirect injection and tool misuse](/posts/ai/2026-10-22-ai-security-prompt-injection-attacks-en) |
| 8 · Attacks | [Connecting an attack agent: planning, execution, and feedback](/posts/ai/2026-10-22-ai-security-attack-agent-loop-en) |
| 9 · Attacks | [Can AI compose an attack chain? From CTFs to a public incident](/posts/ai/2026-10-22-ai-security-attack-chains-en) |
| 10 · Defense | [Where should prompt-injection defenses live?](/posts/ai/2026-10-22-ai-security-injection-defenses-en) |
| 11 · Defense | [A correct RAG answer can still disclose someone else’s data](/posts/ai/2026-10-22-ai-security-rag-permissions-en) |
| 12 · Defense | [An available tool does not authorize this invocation](/posts/ai/2026-10-22-ai-security-tool-authorization-en) |
| 13 · Defense | [MCP trust boundaries: what exactly did you trust?](/posts/ai/2026-10-22-ai-security-mcp-trust-en) |
| 14 · Defense | [How model output becomes XSS, commands, or data exfiltration](/posts/ai/2026-10-22-ai-security-output-handling-en) |
| 15 · Defense | [Agent sandboxes, credentials, and network boundaries](/posts/ai/2026-10-22-ai-security-sandbox-credentials-en) |
| 16 · Defense | [How to verify defenses: red teaming, regression, and monitoring](/posts/ai/2026-10-22-ai-security-security-regression-en) |
| 17 · Investigation | [AI Code Review: Turn Suspicious Code into a Testable Finding](/posts/ai/2026-10-22-ai-security-code-review-en) |
| 18 · Investigation | [What Must You Verify After an AI Patch?](/posts/ai/2026-10-22-ai-security-patch-verification-en) |
| 19 · Investigation | [Build an AI-Assisted Incident Timeline Without Inventing Missing Events](/posts/ai/2026-10-22-ai-security-incident-timeline-en) |
| 20 · Investigation | [Can an AI “False Positive” Decision Close an Alert?](/posts/ai/2026-10-22-ai-security-alert-triage-en) |
| 21 · Investigation | [Security Assistant Tools: From Read-Only Investigation to Response](/posts/ai/2026-10-22-ai-security-response-permissions-en) |
| 22 · Investigation | [How Can You Demonstrate That AI Helps Security Work?](/posts/ai/2026-10-22-ai-security-workflow-evaluation-en) |
| 23 · Integrated | [An Integrated AI Security Exercise: From Attack Evidence to a Fix and Regression](/posts/ai/2026-10-22-ai-security-integrated-exercise-en) |

If security is new to you, finish the shared foundation first. Each path provides its own examples and exercises; you can return to another path when the task calls for it.

## Where will the exercises run?

Exercises span local examples, [CTF evaluation tasks](https://crfm.stanford.edu/2024/08/19/cybench.html), public training platforms, self-hosted cloud environments, and explicitly authorized real systems. Local examples make reproduction easy; cloud and real environments introduce different service states, permissions, and operating conditions.

For each environment, identify the assets, accounts, permitted actions, and stopping conditions. In a bug bounty program, the [HackerOne security page](https://docs.hackerone.com/en/articles/8490833-security-page) describes the program's scope and requirements. Its [safe harbor guidance](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq) does not expand the assets in scope. Check the individual program's rules for automation as well.

Public attack cases will be analyzed at their turning points: what the attacker observed, what the model did, and which effects were confirmed. Reproducible stages can be rebuilt in a corresponding authorized environment without retesting the incident's victims.

## What did the live model tests establish?

Fixed cases verify program behavior. Whether a model proposes useful tests and interprets responses requires a separate experiment. We also used an authenticated Codex CLI with the requested model ID `gpt-6.1-sol`, running three independent repetitions per task:

| Task | Observation in this experiment |
|---|---|
| Propose hypotheses from code and a supplied policy | All 3 covered a normal control, another owner in the same tenant, and another tenant |
| Read a ticket containing an injection instruction | All 3 finished the original task without proposing an additional read |
| Choose the next action from tool responses | Across both builds, all 6 conclusions matched the observed ticket responses |
| Generate an authorization function patch | All 3 patches passed 13 independently specified cases each |

The [live-model results](/examples/ai-security/model-eval-results.json) retain outputs, tool responses, usage and limitations. The [integrated exercise](/posts/ai/2026-10-22-ai-security-integrated-exercise-en) provides the rerun command. This was a small synthetic task with the policy supplied to the model, not discovery in an unfamiliar product. There was no human baseline or model ranking.

The injection prompt explicitly marked the document untrusted. Without a weak-prompt control, the absence of deviation cannot establish a defense's causal effect. The harness initially rejected six valid “finish, N-1” outputs; they were rescored against the original prompt contract while preserving the original records. The skipped backend-effect stage was not executed and is not a successful blocking test. The CLI returned no precise model snapshot, temperature or actual invoice.

## First, learn what “success” means

A CTF flag, a tool's exit code, and a model's report tell you different things. [NIST's examination of agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations) shows how exposed answers and grading loopholes can produce false success. It also records ineffective attempts to change a local copy without changing the remote target. Obtaining an answer, modifying a file, and affecting the actual target require separate verification.

Each practical part asks for **the starting environment, inputs, expected results, actual results, and evidence you can inspect**. When an exercise includes a patch, rerun it under the same conditions. Let AI suggest candidate paths; verify outcomes against the actual service and data.

Pick an AI application you know and draw “user → backend → data → model → tools.” Mark where external content enters, where data reaches the model, and where a tool executes. At each point, write down who decides access.

If your answer is “the model decides,” keep that point for the next exercise. [Part 1](/posts/ai/2026-10-22-ai-security-identity-and-authorization-en)uses a runnable example to make both allowed and denied outcomes visible.

## Update history

- 2026-10-22: Added live-model observations, rerun links and the transparent harness-schema correction.

- 2026-10-22: Completed the links for all three paths and the integrated exercise. This update changes navigation; it does not reverify the original external claims.

## References

- [NIST: Cybersecurity and privacy risks in the age of AI](https://www.nist.gov/blogs/cybersecurity-insights/managing-cybersecurity-and-privacy-risks-age-artificial-intelligence)
- [Microsoft: Secure multitenant RAG inferencing architecture](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)
- [OWASP: MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [Stanford CRFM: Cybench tasks and evaluation design](https://crfm.stanford.edu/2024/08/19/cybench.html)
- [HackerOne: Security Page](https://docs.hackerone.com/en/articles/8490833-security-page)
- [HackerOne: Safe Harbor Overview & FAQ](https://docs.hackerone.com/en/articles/8494502-safe-harbor-overview-faq)
- [NIST: Examples of cheating in agent evaluations](https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations)
