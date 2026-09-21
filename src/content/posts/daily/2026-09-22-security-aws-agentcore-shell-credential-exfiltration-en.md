---
title: "Security Alert | AWS AgentCore's Default Shell Tool Lets Prompt Injection Read Plaintext Credentials Out of the Identity Vault"
date: 2026-09-22
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "Unit 42 shows that AWS AgentCore Harness ships a shell tool enabled by default that shares memory space with the harness runtime, letting an indirect prompt injection read decrypted plaintext credentials out of the AgentCore Identity vault and replay them against a downstream service"
tldr: "Unit 42 built a fictional customer-support agent to demonstrate the chain: hide an instruction inside a support ticket's HTML comment, get the agent to invoke its default-enabled shell tool to fetch and run a recon script, then discover the shell subprocess runs as root and can read the harness's own process memory (PID 1) — the same memory where AgentCore Identity resolves a downstream MCP credential into a plaintext JWT for use. They exfiltrated that JWT to an external webhook and replayed it from a separate laptop, listing MCP tools, calling a customer-lookup function, and retrieving PII. AWS closed the report as informative, attributing it to customer-side allowedTools scoping and egress filtering."
series:
  name: "AI Security Alert"
  order: 35
---

> 🌏 [中文版](/posts/daily/2026-09-22-security-aws-agentcore-shell-credential-exfiltration)

## Summary

Unit 42, Palo Alto Networks' research arm, disclosed an attack path against the default configuration of AWS AgentCore Harness, AWS's managed runtime for AI agents. An attacker who can influence content the agent reads — a support ticket, for instance — can use indirect prompt injection to get the agent to invoke its built-in shell tool, which ships enabled by default. From there, the shell can read the harness's own process memory and pull out credentials that AgentCore Identity has already decrypted to plaintext for use against a downstream service. Unit 42 demonstrated the full chain against a fictional company, "SupportCo," running a customer-support agent: inject an instruction, gain shell execution, read process memory, exfiltrate a JWT, and replay that credential from an external machine to access the downstream service. This isn't a one-off misconfiguration — it's the documented out-of-the-box behavior: unless an operator explicitly restricts tools with `allowedTools`, every session gets the built-in `shell` and `file_operations` tools. AWS reviewed the finding and closed it as "informative," attributing the exposure to customer-side controls — tool scoping and egress filtering — rather than a platform vulnerability.

**Key facts**

| Item | Value |
|---|---|
| Attack type | Prompt injection leading to credential exfiltration via in-memory secret exposure |
| Scope | Deployments using AWS AgentCore Harness's default configuration (built-in shell tool enabled + a downstream credential stored in AgentCore Identity) |
| Severity | High (no user interaction needed once injection succeeds, but requires a successful indirect prompt injection as a prerequisite; AWS classifies this as a customer configuration issue rather than a platform flaw) |
| CVE | None (AWS closed the HackerOne report as "informative" under the AgentCore shared-responsibility model; no CVE was issued) |
| Sources | [Unit 42 original research](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/), [NetManageIT analysis](https://blog.netmanageit.com/aws-agentcore-harness-prompt-injection-credential-risk/) |

## Attack Surface Analysis

The attack unfolds in three stages. First, gaining code execution: Unit 42 initially asked the model directly to invoke the shell tool for recon, and it refused twice. Switching to indirect injection worked — they hid a single instruction inside an HTML comment in a support ticket, telling the agent to curl a recon script and pipe it into python3. When the agent processed the ticket, it read that line and called the shell tool to run it. Second, environment discovery: the researchers found the shell subprocess ran as root and shared the same user identity as the harness's main process (PID 1, a Python service called `loopy`) — meaning `/proc/1/mem` was readable from the shell tool's context, exposing anything living in that process's memory, including credentials actively being decrypted for use. Third, credential extraction and replay: AgentCore Identity credentials are encrypted at rest with KMS and in transit, but a downstream MCP service ultimately needs a plaintext bearer token to authenticate, and that decryption happens inside the harness's main process. Unit 42 wrote a script to scan `/proc/1/mem` for JWT byte patterns and the associated MCP URL, then POSTed the result to an external webhook. From there, they replayed the token from a separate laptop — no AWS credentials required — to list tools, call a customer-lookup function, and retrieve PII including names, phone numbers, and partial SSNs.

The root cause has two layers. First, vaults protect data at rest and in transit, not data in use — AgentCore Identity's encryption and access controls are effective while a credential sits idle, but the moment a downstream service needs to authenticate, that credential has to become plaintext somewhere in a process, and nothing isolates that decrypted state. Second, a scoping design gap: `allowedTools`, the parameter meant to restrict built-in tools, only applies at `InvokeHarness` time, not at `CreateHarness` time — meaning an operator who believes they've locked down the shell tool may still have sessions that get it by default unless every single invocation is scoped precisely. Mapped to the OWASP LLM Top 10, this incident hits both **LLM01 Prompt Injection** (the indirect injection is the entry point for the entire chain) and **LLM06 Excessive Agency** (the shell tool carries system-level privileges far beyond what a support agent's business logic needs, and shares a memory boundary with the credential-resolution process).

## Defense Playbook

Unit 42's research reaffirms a point worth repeating: the damage prompt injection can do isn't bounded by the model's judgment — a model can't reliably tell an injected instruction from a legitimate one — it's bounded by what the agent's tools can actually reach. The real defense has to live in tool-permission scope, not model behavior.

**Immediate actions**
- Audit every AgentCore Harness deployment and confirm each `InvokeHarness` call explicitly sets `allowedTools`, excluding `shell` and `file_operations` from sessions that don't need them
- Review the downstream permission scope of every service-account credential stored in AgentCore Identity, so a single leaked credential can't cascade into broad data access — the credential exfiltrated in this demo, `mcp-service`, was an operator-level service account with broader reach than a typical end-user session token
- Monitor outbound traffic from harness containers; any connection to a destination outside the known list of downstream services should be treated as a possible sign of active prompt injection, not routine configuration drift

**Long-term architecture**
- Isolate the sandbox where the agent executes shell commands or code from the process that resolves and holds credentials at the memory level, so that even if the execution sandbox is compromised via injection, it can't reach another process's memory space
- Evaluate runtime guardrail tools from the watchlist's B7 category, such as Invariant Labs or Straiker, which intercept and audit the actual tool calls an agent makes in real time — not just its text input
- Apply least-privilege scoping to every service account acting on an agent's behalf, and periodically review whether each Identity vault credential still maps to the downstream integration it actually needs

## Impact Scope

This research ran entirely against a self-built fictional scenario — a made-up company (SupportCo), a simulated MCP service, and a self-hosted webhook endpoint — with no real customer or system involved, which AWS confirmed during disclosure. The timeline: Unit 42 reported the finding to AWS Security via HackerOne on May 19, 2026 (report #3747844); AWS responded on June 8 requesting reproduction details and scope clarification; on June 10, AWS confirmed the finding shared a root cause with an earlier report (#3737800) and merged the two; that same day, AWS closed the report as "informative" under the AgentCore shared-responsibility model, citing `allowedTools` scoping and egress filtering as customer-side controls rather than a platform-level flaw.

For teams building agents on AgentCore Harness, the takeaway is this: even if you follow AWS's own documentation exactly — storing credentials in the Identity vault, applying encryption and IAM access controls — your agent by default still exposes a root-privileged shell tool that can read the main process's memory, unless you take the extra step of scoping `allowedTools` and binding it to every single session invocation. Any entry point where the agent reads untrusted content — a support ticket, an external document, a web page — is a potential starting point for this credential-exfiltration chain.

## Today's Takeaway

The most interesting part of this case is how AWS framed its response: "the vault delivered encryption and access control, so this is a customer configuration issue." That's technically accurate, and it happens to underline the core observation in Unit 42's report — a vault protects data at rest and in transit, but the moment a credential needs to be *used*, it has to become plaintext, and that "in use" state isn't something the traditional vault security model covers at all. The lesson: when evaluating any credential-management approach, don't just ask "is storage secure" — ask "once this credential is decrypted, whose process can reach that memory."

## References

- [Unit 42: A Vault with a Heap-View: The Uncomfortable Space Between AgentCore Harness and Identity](https://unit42.paloaltonetworks.com/securing-aws-agentcore-harness-credentials/)
- [NetManageIT: AWS AgentCore Harness Prompt Injection Credential Risk](https://blog.netmanageit.com/aws-agentcore-harness-prompt-injection-credential-risk/)
- [AWS: Amazon Bedrock AgentCore Harness Tools Developer Guide](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-tools.html)
- [AWS: Provide identity and credential management for agent applications with Amazon Bedrock AgentCore Identity](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/identity.html)
