---
title: "Buffer Overflow: Stack Overflow & RCE Technical Principles"
date: 2026-10-15
category: tech
type: guide
difficulty: intermediate
tags: [bug-bounty, security, buffer-overflow, stack, overflow, rce, exploitation]
lang: en
description: "Series 8: Systematically deconstructs stack buffer overflow principles — from key addresses, format strings, ROP chains, to reporting RCE-type vulnerabilities in bug bounty."
tldr: "Stack overflow is a common weakness in system software; attackers exploit EBP/RSP changes, format strings, or ROP chains to turn overflow into RCE. Google VRP rewards $101,010 (T0) → $121,212 (1.2x)."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 8
---

> 🌏 [Chinese version](/posts/tech/2026-10-15-bug-bounty-zero-08-buffer-overflow)

## TL;DR

**Stack buffer overflow is a programmer error: using `strcpy()`, `gets()`, `scanf()` without checking input length lets data overflow a fixed buffer.** Advanced techniques include:
- **EIP/RSP overwrite**: Replace return address to jump to malicious code
- **Format string**: `%n` leaks or writes memory
- **ROP chain**: Under ASLR/DEP, chain existing code snippets to attack
- **Google VRP reward**: T0 RCE base $101,010, 1.2x → $121,212

---

## Scenario

You're testing an old C/C++ program. The `vuln.php` only simulates command injection; real buffer overflow requires compilation. You have a `vuln.c` example and need to understand:
1. Why `strcpy(buffer, input)` crashes
2. Why overwriting the return address executes malicious code
3. How to write a complete PoC (input length, observed behavior) for bug bounty

---

## Problem

**Mistake 1:** Believing "no root = no exploit" is false. Stack overflow can crash regardless of privileges, and Google VRP RCE doesn't distinguish privilege level (just arbitrary code execution).
**Mistake 2:** Jumping straight to exploit coding (shellcode) without understanding:
- Why EBP = 0xdeadbeef, EIP = 0x08048000
- Why `%n` does "format string hijack"
- Why ROP chains "stitch together existing code"
**Mistake 3:** Reporting "found buffer overflow" without PoC (e.g., 100 'A's overwriting EIP with `0x41414141`).

---

## Solution: Stack Overflow Principle + Testing

### 1. Basic Concepts

**Stack Frame Structure**:
```
[ High Address ]
| Return Address (EIP) | ← strcpy fills 100 A's → EIP = 0x41414141 (AAAA)
| Base Pointer (EBP)   | ← saved before function call
| Local Variables      | ← char buffer[64]; ← overflow starts here
[ Low Address ]
```

When `strcpy(buffer, input)` exceeds buffer size (64), it writes into higher addresses, eventually hitting the saved return address.

### 2. Testing Steps (Python + pwntools)

```python
# test_bof.py — test local buffer overflow
from pwn import *

context.arch = 'i386'  # 32-bit
# Using analogous demonstration; actual use in test environment
buffer_size = 64
payload = b"A" * buffer_size + b"B" * 4  # BBBB = EIP
print(f"Payload length: {len(payload)}")
print(f"EIP will be overwritten with: {payload[buffer_size:buffer_size+4].hex()}")
```

### 3. Common Attack Vectors

| Vector | Function | Mechanism |
|---|---|---|
| **Stack Overflow** | `strcpy`, `gets()`, `scanf("%s")` | EIP overwrite → Shellcode |
| **Format String** | `printf(user_input)` | `%n` prints target address → Arbitrary write |
| **Integer Overflow** | `malloc(n)` after `n * sizeof` | Miscalculation → Over-large free |

### 4. Google VRP Reward Allocation (RCE)

| Tier | Base Reward | 0.8x | 1.0x | 1.2x |
|---|---|---|---|---|
| **T0 High** | $101,010 | $80,808 | $101,010 | $121,212 |
| **T1 Mid** | $63,267 | $50,613 | $63,267 | $75,920 |
| **T2 Low** | $1,337–$31,337 | $1,069–$25,069 | $1,337–$31,337 | $1,604–$37,604 |

---

## Why This Matters: VRP Rewards High for Overflow

1. **Privilege Escalation Opportunity**: If the program is setuid root, overflow directly escalates privileges
2. **Broad Attack Surface**: C/C++ dominates large software ecosystems (Linux kernel, embedded, network apps)
3. **Reproducibility**: Knowing buffer size and EIP location enables automated testing

**Note**: Google VRP's RCE rating doesn't distinguish "privilege escalation" vs "direct execution"; proving "client sends malicious input, executes arbitrary code without manual intervention" qualifies as RCE.

---

## Self-Check (Key question: Do you understand stack overflow?)

- [ ] Can you draw a stack frame (EIP, EBP, local variables)?
- [ ] Do you know why `strcpy(buffer, input)` overwrites EIP?
- [ ] Do you understand how format string `%n` leaks/writes memory?
- [ ] Do you know ROP chains' purpose: "stitch" existing code under DEP?
- [ ] Can you write a PoC (e.g., 40 'A's + 4 'B's → EIP = `0x41414141`)?

---

## References

- [OWASP Buffer Overflow](https://owasp.org/www-community/vulnerabilities/Buffer_Overflows)
- [CTF Wiki — Stack Buffer Overflow](https://ctf-wiki.org/pwn/linux/user-mode/stackoverflow/introduction/)
- [pwntools Official Documentation](https://docs.pwntools.com/)
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP 2024 In Review](https://blog.google/security/vulnerability-reward-program-2024-in/)

---

*This is Series 8 (Buffer Overflow) of "Bug Bounty from Zero." Previous: Memory (7); Next: VM/Hypervisor (9), Hyper-V Escape (10).*