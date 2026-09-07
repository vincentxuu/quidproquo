---
title: "Security Alert | NVIDIA NemoClaw's Local AI Agent Hijacked via Browser Tab — CVE-2026-65105 DNS Rebinding Attack"
date: 2026-09-07
category: daily
tags: [ai-agent, security, daily, privilege-escalation, data-exfiltration]
lang: en
description: "NVIDIA NemoClaw bound local Ollama to 0.0.0.0, letting attackers use DNS rebinding from any webpage to gain full unauthenticated access to the agent's inference backend and permanently poison its chat template"
tldr: "Oasis Security (being acquired by Cyera) disclosed CVE-2026-65105: to let its sandboxed container reach local Ollama, NVIDIA NemoClaw binds it to 0.0.0.0:11434 — which also disables the only remaining Host-header protection Ollama has. Attackers use DNS rebinding to make a victim's browser tab reach the local Ollama API the moment they visit a malicious page, poisoning the model's chat template (not the system prompt) so malicious instructions attach to every conversation permanently and invisibly to the agent. NemoClaw v0.0.35 patches macOS/Linux; Windows/WSL remains unfixed. Defense: check immediately whether Ollama is bound to 0.0.0.0, restrict network access to port 11434, and assume an agent's attack surface extends beyond the sandbox boundary to everything it's authorized to touch."
series:
  name: "AI Security Alert"
  order: 25
---

## Incident Overview

On August 25, 2026, Oasis Security researchers Elad Luz and Ofek Itach (Oasis is being acquired by Cyera) disclosed CVE-2026-65105: a network configuration choice in NVIDIA NemoClaw — the tool used to deploy the OpenClaw AI agent — lets an attacker gain full unauthenticated access to the local Ollama inference server, and permanently poison the model's behavior, simply by getting a victim to visit a malicious webpage. The team followed responsible disclosure, reporting to NVIDIA PSIRT before publication. The Hacker News, CSO Online, and Security Boulevard covered the finding and obtained NVIDIA's confirmation that a fix has shipped.

**Key Facts**

| Item | Value |
|---|---|
| Incident Type | Missing Authentication (CWE-306) + Model/Template Poisoning |
| Scope | NVIDIA NemoClaw (OpenClaw agent) deployments using Ollama as a local inference backend; macOS/Linux patched, Windows/WSL unpatched |
| Severity | High (CVSS 3.1: 8.1) |
| CVE | CVE-2026-65105 |
| Sources | [Oasis Security / Cyera research](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent), [CSO Online](https://www.csoonline.com/article/4214156/nemoclaws-ai-can-be-poisoned-through-a-browser-tab.html), [Security Boulevard](https://securityboulevard.com/2026/08/oasis-security-researchers-reveal-security-flaw-in-nemoclaw-ai-agent), [NSFocus incident analysis](https://nsfocusglobal.com/ai-security-incident-case-nvidias-nemoclaw-chat-template-poisoning-vulnerability) |

## Attack Surface Analysis

The root cause is a seemingly ordinary networking decision. NemoClaw's OpenShell sandbox runs inside a Docker container, which can't reach an Ollama instance listening only on `127.0.0.1`. So NemoClaw starts Ollama with `OLLAMA_HOST=0.0.0.0:11434`, binding it to every network interface. The problem: Ollama's native defenses (CORS checks plus Host-header validation) only enforce Host validation when the bind address is loopback — once bound to a non-loopback address, that check is skipped entirely, leaving CORS as the sole remaining line of defense.

Attackers then use DNS rebinding — a decade-old browser attack technique — to defeat CORS: they set up a domain that first resolves to their own server, lure the victim's browser into loading a page from it, then change the domain's DNS resolution to `127.0.0.1` or the victim's LAN address. A browser's same-origin policy is tied to the hostname, not the resolved IP, so subsequent requests are treated as same-origin and allowed through — but they actually land on the victim's local Ollama API, where Host validation was already bypassed and CORS sees a matching origin. The result is full, unauthenticated API access.

The truly serious part isn't API access itself (enumerating installed models, deleting models, running arbitrary inference to burn GPU cycles) — it's the model-layer attack the researchers demonstrated. Directly poisoning Ollama's `system` field doesn't work, because the OpenClaw agent sends its own system prompt on every call, overriding whatever is baked into the model. But the `/api/create` endpoint also accepts a `template` field — a Go template controlling how the message array is rendered into the raw text the model actually sees. This layer applies at inference time to every message, including any system prompt the client sends, and is entirely invisible to API consumers. An attacker only needs to fetch the original template and splice in an instruction appended to every system message; the poisoned template then persists across conversations, survives the agent re-sending a fresh system prompt each time, and leaves the model's name, size, and metadata looking completely normal.

Mapped to the OWASP LLM Top 10, this incident sits at the intersection of **LLM04 Data and Model Poisoning** (tampering with a layer of the inference pipeline that's invisible to humans) and **LLM06 Excessive Agency** — OpenShell's sandbox can restrict an agent's access to the host filesystem and processes, but for an agent to be useful to an enterprise it inevitably gets authorized to touch source control, CI/CD, cloud accounts, internal APIs, and MCP servers. The sandbox boundary was never the real attack surface boundary; the scope of resources an agent is authorized to reach is.

## Defensive Measures

The immediate step is confirming your exposure: any local inference service like Ollama that isn't strictly bound to `127.0.0.1` is effectively exposed across every network interface, and any webpage that can trick your browser into sending a request is a potential risk. The long-term fix is treating the integrity of the entire inference chain — not just the sandbox container — as a security boundary: model weights, chat template, and network binding can each be tampered with without the layer above noticing.

**Immediate Actions**
- Check your local Ollama's bind address: `lsof -i :11434` or inspect the launch flags for `OLLAMA_HOST=0.0.0.0`; revert to `127.0.0.1` unless container connectivity genuinely requires otherwise
- If you use NemoClaw on Windows/WSL, there's no official patch yet — manually restrict port 11434's reachability via firewall rules and never expose it to the LAN
- Update to NemoClaw v0.0.35 or later on macOS/Linux
- Periodically check your local model's chat template via `/api/show` and diff it against the officially published template

**Long-term Architecture**
- Treat local inference services (Ollama, vLLM, etc.) as sensitive infrastructure requiring network isolation, not harmless background dev processes — apply minimal-exposure principles
- Design least-privilege access for agents: individually assess "what happens if this agent gets compromised" for every organizational resource it can reach — source control, CI/CD, cloud accounts, MCP servers
- Adopt watchlist tools like [Protect AI](https://protectai.com/) for model/inference-pipeline scanning, or [Noma Security](https://noma.security/) for AI security posture management, to bring "model integrity" into the same monitoring umbrella as traditional application security
- Treat a service's bind address as an architectural decision requiring security review, not just a connectivity detail

## Impact Assessment

Oasis Security found no evidence of in-the-wild exploitation at disclosure time, but the attack threshold is extremely low — a victim only needs to browse a malicious page while their agent sandbox is running normally; no traditional malware download, credential theft, or phishing is required. NemoClaw v0.0.35 has patched macOS and Linux, but Windows and WSL remain exposed with no disclosed timeline as of this reporting.

The takeaway worth remembering for your own agent systems: **assume any local service reachable from a browser tab will eventually be reached.** If your development environment runs a browser alongside a local AI agent's inference backend, network isolation between the two can't rest on the assumption that "it defaults to listening on localhost" — because a single networking adjustment made for container connectivity was enough to invalidate that assumption entirely.

## Takeaway

Model-layer agent attacks have mostly been framed around prompt injection — hiding instructions inside input content. This incident demonstrates a lower-level path: directly poisoning the model's chat template so malicious instructions bypass the system prompt the agent re-sends on every call, because the template is a rendering layer applied on top of the system prompt that the agent has no visibility into or control over. It's a reminder that an agent controlling its own system prompt does not mean it controls the final content that actually reaches the model.

## References

- [Oasis Security / Cyera Research — Drive-By Agent Hijacking: One Website Visit, Persistent Model Poisoning](https://www.cyera.com/research/nemoclaw-one-website-visit-to-hijack-your-ai-agent)
- [CSO Online — NemoClaw's AI can be poisoned through a browser tab](https://www.csoonline.com/article/4214156/nemoclaws-ai-can-be-poisoned-through-a-browser-tab.html)
- [Security Boulevard — Oasis Security Researchers Reveal Security Flaw in NemoClaw AI Agent](https://securityboulevard.com/2026/08/oasis-security-researchers-reveal-security-flaw-in-nemoclaw-ai-agent)
- [NSFocus — AI Security Incident Case: NVIDIA's NemoClaw Chat Template Poisoning Vulnerability](https://nsfocusglobal.com/ai-security-incident-case-nvidias-nemoclaw-chat-template-poisoning-vulnerability)
- [Rapid7 Vulnerability Database — CVE-2026-65105](https://www.rapid7.com/db/vulnerabilities/cve-2026-65105)
- [NVIDIA Security Bulletin — NemoClaw and OpenShell, August 2026](https://nvidia.custhelp.com/app/answers/detail/a_id/5872)
