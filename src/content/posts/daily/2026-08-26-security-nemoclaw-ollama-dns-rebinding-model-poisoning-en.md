---
title: "Security Alert｜NVIDIA NemoClaw: One Website Visit Can Poison Your Local AI Model (CVE-2026-65105)"
date: 2026-08-26
category: daily
type: digest
tags: [ai-agent, security, daily, prompt-injection, mcp]
lang: en
description: "Oasis Security reveals that NVIDIA NemoClaw's local Ollama deployment binds to 0.0.0.0, disabling DNS rebinding protection and letting attackers silently modify model chat templates to inject persistent instructions that even the agent's own system prompt can't override"
tldr: "NVIDIA NemoClaw (the official tool for deploying OpenClaw agents) binds Ollama to 0.0.0.0 so sandbox containers can reach the local inference server — but this disables Ollama's Host header check that blocks DNS rebinding. An attacker only needs the developer to visit a malicious webpage to gain full unauthenticated access to the Ollama API, then use /api/create to modify the model's Go template and permanently embed malicious instructions — a technique that survives even the agent's own system prompt sent with every call. Mitigations: bind Ollama to loopback only, put an auth proxy in front, enforce a Host header allowlist, and don't rely on sandbox isolation alone."
series:
  name: "AI Security Alert"
  order: 12
---

> 🌏 [中文版](/posts/daily/2026-08-26-security-nemoclaw-ollama-dns-rebinding-model-poisoning)

## Incident Overview

On August 25, security firm Oasis Security (now a research team under Cyera, and their first publication since Cyera's ~$1B acquisition) disclosed a vulnerability affecting NVIDIA NemoClaw (CVE-2026-65105). NemoClaw is NVIDIA's official tool, announced at GTC in March this year, for deploying OpenClaw agents inside OpenShell sandboxes — marketed as "safer than running agents directly." The problem: to let sandbox containers reach the local Ollama inference service, NemoClaw binds Ollama to `0.0.0.0` instead of the default loopback address, inadvertently disabling Ollama's core defense against DNS rebinding attacks. All a developer has to do is visit a malicious webpage, and the attacker gains full unauthenticated access to the Ollama API — and can silently modify the chat template of the model the agent uses, injecting persistent hidden instructions that even the agent's own system prompt can't override.

**Key Facts**

| Item | Value |
|---|---|
| Incident Type | Local Service Exposure (DNS Rebinding) + Model/Template Poisoning |
| Scope | Developer environments using NVIDIA NemoClaw with a local Ollama inference backend |
| Severity | High (full unauthenticated access; poisoning is invisible to users) |
| CVE | CVE-2026-65105 |
| Sources | [Oasis/Cyera Research Report](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent), [SiliconANGLE](https://siliconangle.com/2026/08/25/nvidia-nemoclaw-flaw-let-attackers-poison-the-model-behind-a-developers-ai-agent/), [The Hacker News](https://thehackernews.com/2026/08/a-malicious-webpage-could-poison-your.html) |

## Attack Surface Analysis

NemoClaw runs OpenClaw agents inside Docker-container-based OpenShell sandboxes, with the local inference option running models via Ollama on the developer's host machine. The issue is that Docker containers can't reach the host's `127.0.0.1`, so NemoClaw sets `OLLAMA_HOST=0.0.0.0:11434` to bind Ollama to all network interfaces — a textbook "sacrifice security defaults for container reachability" infrastructure decision.

Ollama's API has no built-in authentication. Instead, it relies on two middleware layers: an Origin allowlist (CORS) and Host header validation. The critical finding by Oasis is that Ollama's Host check logic only activates when the bind address is loopback; once bound to `0.0.0.0`, that check is skipped entirely, leaving CORS as the sole defense. But CORS can't stop DNS rebinding: the attacker points a domain they control at their own server first, and once the browser establishes a connection, re-resolves that domain to `127.0.0.1`. Since the same-origin policy checks hostnames rather than underlying IPs, the browser doesn't block subsequent requests — so the attacker's webpage JavaScript can make full requests to the victim's local Ollama API.

With unauthenticated access in hand, the most dangerous move isn't deleting models or filling up disk space — it's model poisoning. The researchers first tried injecting a hidden `system` field via `/api/create`, but it didn't work because the OpenClaw agent sends its own system prompt with every call, overriding the model's built-in system field. So they went one layer deeper: `/api/create` also accepts a `template` field — a Go template responsible for rendering the message array into the raw text the model actually ingests at inference time, applied to *all messages including the client-side system prompt*. The attacker can use `/api/show` to retrieve the model's original template, insert logic that appends malicious instructions to every system message, and write it back — preserving all original tool rendering, special tokens, and role formatting so the poisoning leaves no visible trace. From that point on, every conversation — regardless of what system prompt the agent sends — passes through the tampered template first, and the malicious instructions persist in a location that survives the client clearing and restarting conversations. Externally, the model name, size, and metadata all appear normal; starting a new conversation doesn't help.

Mapped against the OWASP LLM Top 10, this incident hits both **LLM03 Training Data / Model Poisoning** (technically inference-time template tampering rather than training data poisoning, but the effect is equivalent) and a variant of **LLM02 Insecure Output Handling** — the root cause is "an infrastructure-layer reachability setting disabling application-layer access controls that were already in place." This is the same class of issue that Ollama's 2024 DNS rebinding vulnerability (CVE-2024-28224) patched: exposing the service on a non-loopback interface effectively downgrades the entire middleware defense to a single layer — and that one layer happens to be bypassable by browsers.

## Defensive Measures

**Immediate Actions**
- Check if any Ollama instance is bound to a non-loopback address: `ss -tlnp | grep 11434` — it should show `127.0.0.1:11434`; if it shows `0.0.0.0:11434` or `[::]:11434`, the service is exposed
- If containers need to reach the host's Ollama, use `host.docker.internal` (Docker Desktop) or an explicit private network interface address instead of `0.0.0.0`
- Put an auth proxy (Caddy/Nginx + Bearer token) in front of Ollama, restricting management endpoints like `/api/create`, `/api/pull`, `/api/push`, and `/api/delete` to trusted sources only
- Developers using NemoClaw should verify whether their deployment still uses the local Ollama backend; if so, temporarily switch to a cloud inference backend until an official patch is released

**Long-term Architecture**
- Host header allowlisting is the fundamental defense against DNS rebinding. Any scenario that exposes a local inference service to containers or other devices should enforce strict Host header matching, not rely on CORS alone
- Periodically compare model template hashes using `ollama pull`/`ollama show` to detect silent template tampering — this is currently one of the few ways to catch this type of poisoning, since nothing appears abnormal in the UI
- For agent harnesses, the system prompt should not be assumed to always be the "final authority" on instructions. If the inference layer can be tampered with, the agent-side security design needs additional integrity verification mechanisms
- Evaluate tools on the watchlist like Invariant Labs and WitnessAI that provide agent runtime monitoring and guardrails, capable of detecting when agent output deviates abnormally from expected behavior — independently of the model itself

## Impact Scope

No official security bulletin or patch version number from NVIDIA for CVE-2026-65105 has been observed yet; Oasis states they notified NVIDIA PSIRT before publishing. The affected scope is limited to developers using NemoClaw with a local Ollama inference backend; those using cloud inference APIs exclusively are not affected. This isn't NemoClaw's first security issue — an April security bulletin already patched sandbox environment variable leakage (CVE-2026-24222) and SSRF (CVE-2026-24231), showing that the attack surface for these "put agents in a sandbox" official tools is expanding from the agents themselves to the inference infrastructure they depend on.

If your team also uses local LLM servers (Ollama, vLLM, or others) with containerized agents, this incident carries two lessons: first, "relaxing the bind address for connectivity" is itself an attack surface as an infrastructure decision; second, the agent's own system prompt — an application-layer defense — is completely ineffective when the inference layer has been tampered with.

## Takeaway

Most agent supply-chain or prompt injection cases I've seen previously operate at the "content" level — malicious emails, malicious PRs, malicious packages. What's different here is that the attacker bypasses all interaction layers between agent and user, drilling down to "how the model renders the message array into text" to inject the poison. This means that no matter how good an agent's prompt injection defenses are or how carefully its system prompt is written, if the underlying inference service itself can be tampered with, all those defenses are moot. The security boundary can't be drawn only at the application layer — the inference infrastructure itself must be part of the threat model.

## References

- [Drive-By Agent Hijacking: One Website Visit, Persistent Model Poisoning — Cyera/Oasis Security](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent)
- [Nvidia NemoClaw flaw let attackers poison the model behind a developer's AI agent — SiliconANGLE](https://siliconangle.com/2026/08/25/nvidia-nemoclaw-flaw-let-attackers-poison-the-model-behind-a-developers-ai-agent/)
- [A Malicious Webpage Could Poison Your Local AI Model Behind NVIDIA NemoClaw — The Hacker News](https://thehackernews.com/2026/08/a-malicious-webpage-could-poison-your.html)
- [Ollama DNS Rebinding Vulnerability (CVE-2024-28224) — NCC Group](https://www.nccgroup.com/research/technical-advisory-ollama-dns-rebinding-attack-cve-2024-28224/)
- [Security Bulletin: NVIDIA NemoClaw - April 2026 — NVIDIA](https://nvidia.custhelp.com/app/answers/detail/a_id/5837)
