---
title: "TEE (Trusted Execution Environment): From Principles to Opportunities"
date: 2026-10-15
category: tech
type: guide
difficulty: intermediate
tags: [bug-bounty, security, tee, confidential-computing, intel-sgx, amd-sev, vulnerability]
lang: en
description: "Series 11: Deep dive into Trusted Execution Environment (TEE) mechanisms, analyzing one of Google VRP's top-reward vulnerability categories."
tldr: "TEE is a hardware-level security sandbox provided by CPU, Google VRP maximum reward $300,000 (TEECoE). This article explains Intel SGX, AMD SEV, Intel TDX architectures, attack vectors, and reporting."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 11
---

> 🌏 [Chinese version](/posts/tech/2026-10-15-bug-bounty-zero-11-tee-confidential)

## TL;DR

**TEE (Trusted Execution Environment) is a hardware-level security sandbox provided by CPU**, Google VRP maximum reward $300,000 (TEECoE). This article explains:
- Intel SGX, AMD SEV, Intel TDX architectures
- Attack vectors: enclave data theft, code hijacking, execution state theft, inter-enclave communication
- Google VRP reward: $300,000 base / 0.8x/1.0x/1.2x
- Report structure: PoC, impact, remediation

---

## Scenario

You've completed the first 10 articles and are now ready to test a more advanced vulnerability class: **TEE**. TEE is a hardware-level security sandbox provided by CPU, allowing applications to run in a protected environment where even the OS root cannot read or modify the data. Vulnerabilities in TEE typically trigger Google VRP's highest reward tier ($300,000).

This article will walk you through:
- TEE architecture (Intel SGX, AMD SEV, Intel TDX)
- Attack vectors and their impacts
- Google VRP reward structure
- Report writing points

Even if you don't directly test TEE bugs, understanding them helps write more comprehensive vulnerability reports.

---

## Problem

**Mistake 1:** Believing TEE security is so high that vulnerabilities are hard to find, but Google VRP has already listed it as a top-reward category ($300,000). Many programs' Scope explicitly allows testing TEE vulnerabilities, e.g., "Intel SGX", "Confidential Computing".

**Mistake 2:** Not understanding the "Enclave" concept within TEE, how enclaves access memory and peripherals (e.g., Memory Encryption, Encrypted I/O), unable to correctly describe the vulnerability impact (e.g., can secrets be stolen from the enclave? can the enclave's execution be hijacked?).

**Mistake 3:** Reporting "found TEE vulnerability" without PoC — this directly triggers 0.8x quality multiplier, reducing $300,000 to $240,000.

---

## Solution: TEE Architecture + Reward + Reporting

### 1. TEE Fundamentals

| Technology | Function | Vendor | Reward Category |
|---|---|---|---|
| **Intel SGX** | Provides hardware-isolated "Enclave" to protect memory and code | Intel | TEECoE ($300,000) |
| **AMD SEV** | Encrypts entire VM memory, provides virtualization security | AMD | TEECoE ($300,000) |
| **Intel TDX** | Provides "trusted virtualization", customers can trust the VM | Intel | TEECoE ($300,000) |

**Enclave**: The smallest security container within TEEs, containing code, memory, and state. Even OS root or malicious VM cannot access it.

### 2. Attack Vectors

| Vector | Description | Impact |
|---|---|---|
| **Enclave Data Theft** | Secret data theft from Enclave (e.g., keys, passwords) | Confidential data leakage |
| **Enclave Code Hijacking** | Replace code executed within Enclave (e.g., fake API) | Logic vulnerabilities, remote code execution |
| **Enclave Execution State Theft** | Steal Enclave execution state (e.g., data, cache) | Data leakage, privacy violation |
| **Enclave Inter-Communication** | Hijack communication between Enclaves, steal data exchanged | Data theft, forged operations |

### 3. Google VRP Reward Allocation (2024)

| Tier | Base Reward | 0.8x | 1.0x | 1.2x |
|---|---|---|---|---|
| **TEECoE (Highest Reward)** | $300,000 | $240,000 | $300,000 | $360,000 |
| **TEECoE (General)** | $100,000 | $80,000 | $100,000 | $120,000 |

> **Important**: TEE vulnerabilities are among Google VRP's highest-reward categories, but many programs restrict direct testing. For example: "Intel SGX" Scope typically only allows "safe testing", prohibiting customer data impact.

### 4. Report Writing Points

| Section | Content |
|---|---|
| **Title** | `Target – TEE (Intel SGX / AMD SEV / Intel TDX) vulnerability` |
| **Summary** | `TEE (Intel SGX / AMD SEV / Intel TDX) Enclave data/code has been stolen` |
| **Steps to Reproduce** | 1. Create specific TEE environment (e.g., SGX Enclave) 2. Execute malicious code 3. Observe Enclave behavior changes 4. Result analysis |
| **Impact** | `Attacker can steal Enclave confidential data, hijack Enclave execution code, affect Enclave execution state` |
| **CVSS 3.1** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |
| **Remediation** | Strengthen Enclave protection, encrypt memory, verify Enclave source, apply security updates |
| **References** | [CVE-2023-XXXXX](https://cve.mitre.org/), [Intel SGX Security Updates](https://www.intel.com/security) |

---

## Why This Matters: Google VRP Rewards High for TEE

1. **Confidential Computing Core**: TEE is the foundation of customer confidential computing. Once compromised, sensitive data like passwords, encryption keys may be leaked
2. **Trust Foundation**: Customers rely on TEE to ensure computation security. Once compromised, customers may completely lose trust
3. **Extremely High Difficulty**: Requires deep understanding of TEE technology (SGX, SEV), CPU internals, virtualization — high reward to incentivize research

**Example**: Same TEE vulnerability,
- Report quality 0.8x → $300,000 × 0.8 = $240,000
- Report quality 1.2x → $300,000 × 1.2 = $360,000

Reward difference $120,000, directly from report quality.

---

## Self-Check (Key question: Do you understand TEE?)

- [ ] Can you explain the differences between Intel SGX, AMD SEV, Intel TDX?
- [ ] Do you know the "Enclave" concept within TEE (container, isolation)?
- [ ] Do you know Google VRP's TEECoE base reward ($300,000) and maximum ($360,000)?
- [ ] Do you know why 95% of bug bounty programs don't allow direct TEE testing?
- [ ] Does your report include PoC, impact, and remediation for 1.2x?

---

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Intel SGX Security](https://www.intel.com/security)
- [AMD SEV Security](https://www.amd.com/security)
- [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities)

---

*This is Series 11 (TEE) of "Bug Bounty from Zero." Previous: Hyper-V Escape (10); Next: AI Era (12), Top Payouts (13), Certifications (14).*