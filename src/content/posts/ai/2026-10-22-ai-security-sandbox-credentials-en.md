---
title: "Agent sandboxes, credentials, and network boundaries"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, sandbox]
lang: en
description: "Run macOS file and network probes and distinguish environment hygiene, API authority, and full isolation."
tldr: "Probe OS-enforced file and network denials separately from scoped, expiring authorization. Application allowlists are not OS sandboxes, and transport choices do not restrict process capabilities."
difficulty: 進階
draft: true
series:
  name: "AI Security in Practice"
  order: 15
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-sandbox-credentials)

Even a well-validated ticket tool may run as a process that can read your home directory, reach arbitrary hosts, and inherit deployment credentials. A tool vulnerability can then escape the intended ticket boundary.

This lesson asks **what the execution environment can restrict after tool code misbehaves**. Read [tool authorization](/posts/ai/2026-10-22-ai-security-tool-authorization-en) and [MCP trust](/posts/ai/2026-10-22-ai-security-mcp-trust-en). File, network, environment, and API authority need separate evidence.

## Execution isolation differs from authorization

A `ticket_id` check protects an application entry point. OS, container, or VM controls constrain direct file and network operations. If execution has already been redirected, an application-level `if` may be bypassed.

[OWASP's MCP guidance](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) calls for filesystem and network restrictions. It also explains that stdio supplies neither, and bare chroot is not a complete process sandbox. No listening TCP port does not mean no outbound connectivity.

| Boundary | Allowed | Denied | Evidence |
|---|---|---|---|
| Files | Synthetic input and output | Named private/protected files | OS permission errors |
| Network | Baseline loopback connection | Restricted connection to same listener | Permission error |
| Environment | Explicit teaching marker | Inherited synthetic secret | Child environment |
| API capability | Alice reads N-1 | Other resource/action/audience, expiry | Policy fixture |

The environment marker is not a credential. Real credentials require independent issuance and verification.

## Run the OS probes

Download [the macOS probe](/examples/ai-security/defense-sandbox-probe.py) as `defense-sandbox-probe.py`. It requires macOS with `/usr/bin/sandbox-exec` and Python 3.11 or newer.

```bash
python3 defense-sandbox-probe.py
```

Expected final line:

```text
PASS: 7 restricted checks and 4 baseline counterchecks
```

The parent creates synthetic temporary files and a loopback listener. An unrestricted child first proves the operations work. A second child runs under OS policy denying the named file operations and all networking. It still reads working input and writes the result. Denials must produce `PermissionError`; a timeout or absent service is not accepted as network-isolation evidence.

**This teaching profile uses `allow default` plus selective denials. Other host files remain accessible. It is not a production Agent sandbox.** It verifies the named mechanisms, not kernel escape resistance or containment of arbitrary malicious code. Unsupported platforms exit with `UNSUPPORTED` and make no sandbox claim.

## Avoid inheriting the whole session

`DEMO_PARENT_SECRET` is synthetic. The baseline inherits it, while the restricted child receives an explicit environment containing only a PATH and teaching marker. That demonstrates environment hygiene, not isolation from every credential source.

Inventory mounted configuration, cloud metadata, Unix sockets, container-management sockets, and credential agents too. Removing a secret from environment variables while mounting a home directory or Docker socket can preserve substantial authority. Changing the working directory does not restrict absolute paths.

For ticket access, a broker should provide narrowly scoped, short-lived authority: Alice, N-1, `read_ticket`, and the ticket API. Download [the policy fixture](/examples/ai-security/defense-demo.py) and run:

```bash
python3 defense-demo.py capability
```

Five cases pass, ending with `mode=capability`. The intended read is true; changing resource, action, audience, or time is false. This is a function-level simulation of already-verified claims, not token issuance or OS isolation. Real tokens require signature, issuer, lifecycle, and revocation checks.

## Turn probes into a deployment contract

For self-hosted cloud execution, list necessary input mounts, output paths, APIs, credentials, and execution duration. Use an actual default-deny execution policy, then reproduce the positive and negative probes inside that deployment. Do not copy this selective macOS profile as a cloud security configuration.

Verify working input/output, denied synthetic private files and non-output writes, an allowed API, and a denied controlled destination. Networked tools need an egress proxy or network policy covering resolved destinations and redirects, not only the input hostname.

Test CPU, memory, process count, wall-clock time, and output limits too. A sandbox does not automatically constrain retry costs or decide whether a business action was approved. Terminating a process cannot undo side effects already completed; retain receipts and recovery paths.

## Check your understanding

1. Does stdio imply no outbound network?
2. Is authority reduced merely by deleting a key from the environment while exposing a management socket?
3. Do seven successful probes establish isolation of every host file?

No. Transport, alternate capability sources, and actual policy coverage must be assessed separately. Write a “can read, write, connect, and act as” table for your own tool, then probe each boundary with synthetic resources.

Continue: [Next lesson](/posts/ai/2026-10-22-ai-security-security-regression-en).

## References

- [OWASP: MCP Security](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [MCP 2026-07-28: Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)
