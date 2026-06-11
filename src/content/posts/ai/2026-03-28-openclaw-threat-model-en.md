---
title: "OpenClaw Threat Model: MITRE ATLAS Security Analysis and Formal Verification"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, security, mitre-atlas, threat-model, formal-verification, tla-plus]
lang: en
tldr: "OpenClaw uses the MITRE ATLAS framework to analyze AI system threats, identifying three Critical risks (prompt injection, malicious skills, credential theft), and employs TLA+ formal verification for security properties."
description: "OpenClaw's MITRE ATLAS threat model analysis, three major attack chains, TLA+ formal verification models, and machine-checked security claims."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-threat-model)

The attack surface exposed by open-source AI platforms differs from traditional web apps. OpenClaw uses the MITRE ATLAS framework for comprehensive threat modeling and TLA+ formal verification to check critical security properties.

## MITRE ATLAS Threat Model

OpenClaw's threat model is based on MITRE ATLAS (Adversarial Threat Landscape for AI Systems), a threat framework designed specifically for AI/ML systems.

### Scope

| Scope | Contents |
|---|---|
| Agent Runtime | Gateway infrastructure |
| Channel integrations | WhatsApp, Telegram, Discord, Signal, Slack |
| ClawHub | Skill marketplace |
| MCP Server | External tool integrations |
| User devices | Node connections |

### Three Critical Risks

**1. Direct Prompt Injection (T-EXEC-001)**

Attackers manipulate agent behavior through carefully crafted prompts. Current mitigation relies on pattern detection, which is not a perfect defense.

**2. Malicious Skill Installation (T-PERSIST-001)**

Attackers publish malicious skills on ClawHub. The review mechanism relies on pattern matching, which can be bypassed.

**3. Skill Credential Theft (T-EXFIL-003)**

Malicious skills steal credentials from the agent context. Skills have full agent permissions during execution.

### Three Major Attack Chains

| Attack Chain | Path |
|---|---|
| Skill Supply Chain | Skill publication → Review bypass → Credential theft |
| Prompt Injection | Injection → Approval bypass → Arbitrary command execution |
| URL Poisoning | Malicious URL content → Agent follows instructions → Data exfiltration |

### Priority Recommendations

Immediate actions recommended in the documentation:
- Complete VirusTotal integration
- Implement skill sandboxing
- Add output validation for sensitive operations
- Shift from detection-oriented to prevention-oriented defenses

## TLA+ Formal Verification

OpenClaw uses TLA+ (Temporal Logic of Actions) for machine-checked formal security models.

### Objective

Provide machine-verified arguments that OpenClaw, under explicit assumptions, indeed enforces its intended security policies (authorization, session isolation, tool governance, fail-safe configuration).

### Important Limitations

- This is a **model**, not the complete TypeScript implementation — there may be divergence between the model and the code
- Results are bounded by the state space explored by TLC — "green" does not guarantee security beyond the model's scope
- Some claims depend on explicit environmental assumptions (correct deployment, correct configuration)

### Security Claims and Models

Each claim has a **positive model** (proving the property holds) and a **negative model** (producing a counterexample trace that demonstrates real bug classes).

#### Gateway Exposure

**Claim:** Binding beyond loopback without auth increases the likelihood of remote compromise; token/password blocks unauthorized attackers.

```bash
make gateway-exposure-v2           # Positive
make gateway-exposure-v2-protected # Positive (with protection)
make gateway-exposure-v2-negative  # Negative (expected failure)
```

#### Nodes.run Pipeline (Highest-Risk Capability)

**Claim:** `nodes.run` requires (a) a node command allowlist + declared commands and (b) just-in-time approval when enabled; approvals are tokenized to prevent replay.

```bash
make nodes-pipeline              # Positive
make approvals-token             # Positive
make nodes-pipeline-negative     # Negative
make approvals-token-negative    # Negative
```

#### Pairing Store (DM Governance)

**Claim:** Pairing requests obey TTL and pending request caps.

```bash
make pairing                     # Positive
make pairing-cap                 # Positive
make pairing-negative            # Negative
make pairing-cap-negative        # Negative
```

#### Ingress Gating (Mention + Control Command Bypass)

**Claim:** In group contexts that require mentions, unauthorized control commands cannot bypass mention gating.

```bash
make ingress-gating              # Positive
make ingress-gating-negative     # Negative
```

#### Routing / Session Key Isolation

**Claim:** DMs from different peers are not merged into the same session unless explicitly configured.

```bash
make routing-isolation           # Positive
make routing-isolation-negative  # Negative
```

### Advanced Models (Concurrency, Retries, Tracing)

The second batch of models handles real-world failure modes:

**Pairing Store Concurrency / Idempotency:**
- Concurrent requests must not exceed `MaxPending`
- Duplicate requests/refreshes must not create duplicate pending records
- Check-then-write must be atomic/locked

**Ingress Trace Correlation / Idempotency:**
- Maintain trace/event identity during fan-out
- Retries must not cause duplicate processing
- Fall back to a safe dedupe key when provider event ID is missing

**Routing dmScope Priority + Identity Links:**
- Channel-specific dmScope overrides must take precedence over global defaults
- Identity links only merge sessions within explicitly linked groups

### Execution Environment

```bash
git clone https://github.com/vignesh07/openclaw-formal-models
cd openclaw-formal-models
# Java 11+ required (TLC runs on the JVM)
make <target>
```

The model repository includes a pinned `tla2tools.jar` along with `bin/tlc` + Make targets.

## Security Audit Tool

```bash
openclaw security audit
```

This checks for common security configuration issues, including trusted-proxy auth settings, missing trustedProxies, empty allowUsers, and more.

## Overall Assessment

OpenClaw's security approach has two dimensions:

1. **Threat modeling** (MITRE ATLAS) — identifying attack surfaces, assessing risk levels, planning mitigations
2. **Formal verification** (TLA+) — machine-checking whether security properties hold within the model's scope

Current defenses lean toward detection rather than prevention, which is a known gap. However, with a formal verification security regression suite, at least the core mechanisms (pairing, routing isolation, ingress gating) are verified to behave as expected.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/security/THREAT-MODEL-ATLAS.md](https://github.com/openclaw/openclaw/blob/main/docs/security/THREAT-MODEL-ATLAS.md) — MITRE ATLAS threat model
- [docs/security/formal-verification.md](https://github.com/openclaw/openclaw/blob/main/docs/security/formal-verification.md) — TLA+ formal verification
- [docs/security/CONTRIBUTING-THREAT-MODEL.md](https://github.com/openclaw/openclaw/blob/main/docs/security/CONTRIBUTING-THREAT-MODEL.md) — Threat model contribution guide
- [docs/gateway/security.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/security.md) — Gateway security
