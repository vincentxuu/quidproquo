---
title: "Security Alert｜CoreBreak — Dispatch Layer Flaws in AWS Bedrock, Google ADK, and Vercel AI SDK Allow Tool Calls to Bypass the Model Entirely"
date: 2026-08-17
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: en
description: "Security research firm Stealth disclosed CoreBreak at Black Hat USA 2026: the tool dispatch layers in AWS Bedrock AgentCore, Google ADK, and Vercel AI SDK can all trigger tool calls without the model ever running, rendering every model-level defense — system prompts, content filters, refusal training — completely ineffective"
tldr: "Stealth researchers Hedi Ingber and Aviyam Ivgi found that three major Agent infrastructure platforms (AWS Bedrock AgentCore, Google ADK, Vercel AI SDK) all have dispatch layers that only check whether data looks like a tool call, without verifying it actually came from the model's current inference turn — yielding 4 CVEs (CVE-2026-18830, CVE-2026-18236, CVE-2026-64650/64651). This is not prompt injection — the model was never tricked, because the model was never called. AWS has auto-patched; Google ADK requires upgrading to 2.5.0; Vercel harness packages need upgrading to 1.0.29/1.0.28. The key defense is shifting authorization checks from 'does this data look right' to 'does this correspond to an actual model completion event'."
series:
  name: "AI Security Alert"
  order: 3
---

> 🌏 [中文版](/posts/daily/2026-08-17-security-corebreak-dispatch-layer-bypass)

## Incident Overview

Hedi Ingber and Aviyam Ivgi, co-founders of security startup Stealth, presented their research **CoreBreak** at Black Hat USA 2026 on August 6, 2026, revealing a structural vulnerability pattern spanning three major AI Agent infrastructure providers: Amazon Bedrock AgentCore, Google Agent Development Kit (ADK), and Vercel AI SDK harness packages all share the same design flaw — the execution layer responsible for "dispatching" tool calls (the dispatch layer) only checks whether a piece of data "looks like" a model-generated tool call, without verifying that it actually corresponds to a model completion event from the current inference turn. An attacker who can inject a correctly formatted tool call into the dispatch pipeline can trigger tool execution directly, with the model never having been invoked at all. This means system prompts, content filters, and refusal training — all defenses layered on top of the model — never get a chance to intervene in the "decision," rendering them entirely ineffective.

**Key Facts**

| Item | Value |
|---|---|
| Incident Type | Dispatch Layer Authorization Bypass (not Prompt Injection) |
| Scope | Amazon Bedrock AgentCore InvokeHarness API; Google ADK for Python (self-hosted); Vercel `@ai-sdk/harness-codex`, `@ai-sdk/harness-opencode` |
| Severity | Critical (Google ADK CVSS v4.0 9.3) / High (AWS CVSS v4.0 8.6) / Medium (Vercel, CVSS v4.0 6.3 each) |
| CVEs | CVE-2026-18830, CVE-2026-18236, CVE-2026-64650, CVE-2026-64651 |
| Sources | [Cloud Security Alliance Research Note](https://labs.cloudsecurityalliance.org/research/csa-research-note-agent-infra-guardrail-bypass-20260806-csa/), [The Hacker News](https://thehackernews.com/2026/08/aws-google-and-vercel-patch-agent-flaws.html), [Forkast](https://forkast.news/corebreak-bypasses-ai-agent-guardrails-at-the-plumbing-layer-and-model-level-defenses-cannot-help/), [AWS Security Bulletin 2026-073-AWS](https://aws.amazon.com/security/security-bulletins/2026-073-aws/) |

## Attack Surface Analysis

A modern AI Agent is not just a language model — it is a runtime loop (runtime/harness): receive user messages, feed them to the model, read the model's response, and when the model requests tool use, dispatch the tool call object — containing the tool name and arguments — to the actual tool executor. What CoreBreak reveals is that the dispatch layers in all three platforms only validate whether this object "has the right format," without verifying that it "actually corresponds to a recorded model completion event in this turn." The specific attack paths differ across the three implementations:

- **AWS Bedrock AgentCore (CVE-2026-18830, CVSS v4.0 8.6)**: An authenticated remote caller can inject a tool-use content block into the last message of an `InvokeHarness API` request. The event loop dispatches the tool directly without checking whether the model ever authorized it.
- **Google ADK for Python (CVE-2026-18236, CVSS v4.0 9.3, CWE-863 Improper Authorization)**: ADK has a "human confirmation" mechanism for sensitive tools — execution pauses and waits for approval, which is recorded as an event in the session history. However, the component that reads this approval event does not verify whether the tool actually belongs to the currently running Agent, whether it genuinely requires confirmation, or whether the name and arguments match the original call. An attacker who can inject or tamper with events in the session history can forge an approval for a call that was never requested, turning the mechanism designed to "block dangerous actions" into a pathway for "launching dangerous actions."
- **Vercel `@ai-sdk/harness-codex` / `harness-opencode` (CVE-2026-64650/64651, CVSS v4.0 6.3 each)**: These packages run a coding agent inside a Linux sandbox and use a relay channel to let sandboxed code request tools on the host. The relay determines trust based on the "command-line path of the calling process" — if the command line contains the path to an approved helper script, it is allowed through. Malicious code already executing inside the sandbox can satisfy this check directly, bypassing the model to call host-side tools (including secret lookups, deployment operations, and cloud API calls).

The common root cause across all three is **trusting "shape" rather than verifying "provenance"**: as long as data looks like model output, the dispatch layer treats it as authorized. This is fundamentally different from prompt injection — in prompt injection, the attacker writes text to manipulate the model's judgment, and the model remains the decision point, so trained defenses at least have a chance to intervene. CoreBreak bypasses the model entirely, meaning "the model never ran at all," so no amount of model-level defense matters. Mapping to the OWASP LLM Top 10, this aligns more closely with **LLM06 Excessive Agency** combined with traditional **Broken Authorization**, rather than LLM01 Prompt Injection — a distinction the researchers and multiple outlets have specifically emphasized.

Notably, CSA points out that this is in the same class as [GuardFall](https://labs.cloudsecurityalliance.org/research/csa-research-note-guardfall-ai-agent-shell-injection-2026070/), disclosed earlier the same year (June 30) by Adversa AI researchers (10 out of 11 tested coding agents had shell injection protection bypasses) — both involve "a structural gap between checking and execution," just at different points in the dispatch chain. GuardFall is "the shell re-expands after the shell protection check completes"; CoreBreak is "the dispatch layer never checks whether the tool call actually came from the model." Taken together, these two pieces of research suggest this may be a recurring vulnerability class in Agent infrastructure, not a one-off mistake by a single vendor.

## Defensive Measures

**Immediate Actions**
- Check your Google ADK for Python version: upgrade to **2.5.0 or later** (released July 16, 2026) — this patch requires manual application by self-hosted deployers
- Check your Vercel harness package versions: upgrade `@ai-sdk/harness-codex` to **1.0.29** and `@ai-sdk/harness-opencode` to **1.0.28** (released July 10, 2026)
- AWS Bedrock AgentCore patches were auto-deployed to the managed service by July 31, 2026. In principle no customer action is needed, but it is worth confirming through your AWS account activity or support channels that the patch has been applied in your region and configuration
- Inventory any self-built or third-party Agent runtimes using a similar "SDK-to-model-to-tool" architecture and check each dispatch point to see if it only validates tool call format rather than provenance

**Long-term Architecture**
- Shift authorization checks from "does this data look like a tool call" to "does this tool call correspond to a real, recorded model completion event in the current session, with matching name and arguments" — this is a check that can be added in a few dozen lines of code, and it is the only defense that does not depend on vendor patch timelines
- For approval mechanisms on sensitive tools (like "human confirmation"), ensure the approval processing logic verifies tool ownership, whether confirmation is actually required, and whether the name/arguments match the originally recorded call — rather than simply checking that "there is an approval event in the session history"
- For sandbox-based architectures (similar to Vercel's relay design), replace "checking the calling process's command-line path" with a cryptographically verifiable signal, such as a per-tool-call signature or a single-use authorization token
- Monitoring needs to adapt accordingly: detecting this class of attack cannot rely solely on model input/output logs (prompt logs, content filter scores), because the model was never called, so those logs do not exist. You need direct observability into the dispatch and authorization layers, ensuring every tool execution can be traced back to a real, recorded model event
- When evaluating or building Agent platforms, ask vendors directly "how is tool call authorization verified end-to-end," and prefer architectures that require signature-based authorization binding each tool execution to a model completion event. Vendors on watchlist B7 such as **Invariant Labs** and **Netzilo**, which focus on Agent runtime governance and MCP/tool-call observability, can help fill this dispatch-layer monitoring gap

## Impact Scope

The three platforms have different affected deployment models: AWS Bedrock AgentCore is a fully managed service and AWS has auto-patched, so customers in principle need take no action. Google ADK for Python and Vercel's harness packages are self-hosted, requiring operators to upgrade manually — meaning that self-hosted deployments that have not kept up with updates since CVE disclosure remain exposed. The exploitation thresholds differ: the AWS vulnerability requires an authenticated caller (hence the relatively lower CVSS of 8.6); the Google ADK vulnerability only requires the ability to inject or tamper with events in the session history (which does not necessarily require existing system access, depending on how data flows into the session), earning the highest score (9.3); the Vercel vulnerabilities require the attacker to already have code executing inside the sandbox, the highest barrier, with the lowest CVSS (6.3). Public information does not indicate any of these three vulnerabilities were exploited in the wild before disclosure — the researchers submitted findings to all three vendors through coordinated disclosure and obtained patches before going public. If your Agent system is built on an SDK-to-model-to-tool architecture (not limited to these three vendors), this disclosure is worth using as a mirror for your own dispatch layer logic: if someone manually crafted a correctly formatted tool call and injected it into your execution pipeline, would your system catch it?

## Takeaway

Previous installments in this security alert series covered "the model gets tricked into doing bad things" or "a service forgot to add authentication." But CoreBreak reveals a third, more fundamental problem: the entire Agent security conversation over the past few years has focused almost exclusively on the model itself (alignment, refusal training, content filtering, system prompt quality). But if an attacker does not need to "convince the model" at all — if they only need the dispatch layer to mistake some data for model output — then every defense layer stacked on top of the model never gets a chance to intervene. This reminds me that when evaluating Agent platform security, asking "how good is this system's prompt injection defense" is not enough. You need to go one layer deeper: "if someone forged a correctly formatted tool call, would your system detect that it was not actually produced by the model?"

## References

- [When the Model Never Runs: Agent Infrastructure Flaws Let Attackers Trigger Tools Without the Model — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-agent-infra-guardrail-bypass-20260806-csa/)
- [AWS, Google, and Vercel Agent Flaws Let Attackers Trigger Tools Without Running the Model — The Hacker News](https://thehackernews.com/2026/08/aws-google-and-vercel-patch-agent-flaws.html)
- [CoreBreak Bypasses AI Agent Guardrails at the Plumbing Layer — and Model-Level Defenses Cannot Help — Forkast](https://forkast.news/corebreak-bypasses-ai-agent-guardrails-at-the-plumbing-layer-and-model-level-defenses-cannot-help/)
- [AWS Security Bulletin 2026-073-AWS](https://aws.amazon.com/security/security-bulletins/2026-073-aws/)
- [Vercel AI SDK Security Advisory GHSA-qw9h-448j-6rph](https://github.com/vercel/ai/security/advisories/GHSA-qw9h-448j-6rph)
- [CoreBreak: AI Agent Tools Fire Without the Model — Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/10383/corebreak-ai-agent-flaws-aws-google-vercel)
