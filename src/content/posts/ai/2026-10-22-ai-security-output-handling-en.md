---
title: "How model output becomes XSS, commands, or data exfiltration"
date: 2026-10-22
type: guide
category: ai
tags: [ai-security, ai-agent, access-control, xss]
lang: en
description: "Examine model-output consumers through HTML text, destination URLs, and narrow report operations."
tldr: "Identify the consumer before validating output. HTML, URLs, and operation arguments require different controls; valid JSON, escaping, and authorization are separate properties."
difficulty: 進階
draft: false
series:
  name: "AI Security in Practice"
  order: 14
---

> 🌏 [中文版](/posts/ai/2026-10-22-ai-security-output-handling)

Alice's summary contains an image whose URL triggers an outbound request when rendered. Another workflow passes a model-generated “report command” straight to a shell. Both begin as model text; the dangerous interpretation happens downstream.

The question is **which consumer interprets the output, and where must text be prevented from gaining executable meaning?** Read [tool authorization](/posts/ai/2026-10-22-ai-security-tool-authorization-en) first. This lesson produces tests for HTML text, destinations, and narrow operations.

## Choose controls by consumer

XSS occurs when untrusted content gains executable meaning in a webpage. Command injection occurs when input changes an operating-system command. Disclosure need not execute script: an external image request can carry ticket data in its URL. [Microsoft's injection guidance](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks) discusses images, links, and tools as separate exfiltration channels.

| Consumer | Input | Required property |
|---|---|---|
| Plain-text element | Summary | Insert as text |
| Link, image, fetch tool | URL | Authorized scheme, host, path, parameters |
| Report tool | JSON | Allowed operation, arguments, resource |
| Process API | Arguments | Fixed executable and validated semantics |

A schema proving `destination` is a string does not authorize its recipient. Structure and effect are separate decisions.

## Run the fixture

Download [the defense fixture](/examples/ai-security/defense-demo.py). With Python 3.11 or newer:

```bash
python3 defense-demo.py output
```

Expected final line:

```text
PASS: 15 deterministic checks; mode=output; no LLM or network exercised
```

`text_escaped` transforms an image tag into text beginning with `&lt;`. `normal_url` permits the fixed HTTPS report inbox; script schemes, hostname suffix tricks, empty or nonempty userinfo, and added queries are rejected. Numeric, list, object, null, and boolean destinations are also rejected. `normal_operation` succeeds, while shell-like operation text and option-like ticket IDs are rejected.

These are string and policy checks. They do not launch a browser or execute a shell, so they do not establish browser-wide XSS prevention. They supply concrete inputs and expectations for your actual consumer.

## Plain text and rich content differ

For a plain summary, use an ordinary element's `textContent`:

```javascript
const summary = document.createElement('div');
summary.textContent = modelOutput;
```

This creates a text node from the original value; it does not HTML-encode it. Pre-encoding would display the encoding itself. [OWASP's XSS prevention guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) distinguishes HTML text, attributes, URLs, and JavaScript contexts. A technique safe for a normal element is not a technique for scripts or event-handler code.

Rich Markdown or HTML needs maintained parsing and sanitization with explicit tag and attribute policies. Removing scripts does not necessarily prohibit remote images. Define external-resource behavior separately, and do not append unvalidated markup after sanitization.

## HTTPS is not destination authorization

The fixture permits only `reports.example.invalid/north/inbox`, with HTTPS, no credentials, query, or fragment. It performs no request. Matching the complete parsed hostname rejects `reports.example.invalid.evil.invalid`.

Prefer a server-configured destination ID over arbitrary URLs. A general fetcher additionally needs DNS and IP-range controls, redirect-hop checks, and protection against changes between checking and connecting. This fixed-inbox function is not a general SSRF defense or browser network policy.

Base64 or percent encoding changes representation, not whether a recipient receives sensitive data.

## Replace commands with narrow operations

[OWASP's command-injection guidance](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) prefers library APIs over OS commands. The fixture therefore accepts only `render_summary` with a constrained ticket identifier, never a model-written command line.

When process execution is necessary, fix the executable and options, pass arguments separately, avoid shells, and validate arguments for that program. `--help` can still become an option. `shell=False` does not prohibit file writes, disclosure, or network activity.

Likewise, N-2 is syntactically valid but unauthorized for Alice. Connect both consumer validation and resource policy to the deployed path, then test with synthetic data in your self-hosted environment.

## Check your understanding

1. Is a valid JSON object containing an arbitrary HTTPS destination safe to use?
2. Does removing scripts guarantee images cannot exfiltrate data?
3. Can argument validation be skipped when avoiding a shell?

No: the missing controls are destination authorization, resource-loading policy, and program-specific argument validation. Find one output consumer in your own application and give it a legitimate case and an observable-effect counterexample.

Continue: [Next lesson](/posts/ai/2026-10-22-ai-security-sandbox-credentials-en).

## References

- [Microsoft: indirect prompt injection defenses](https://www.microsoft.com/en-us/msrc/blog/2025/07/how-microsoft-defends-against-indirect-prompt-injection-attacks)
- [OWASP: Cross Site Scripting Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP: OS Command Injection Defense](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
