---
title: "Security Alert｜Xinference Uses eval() to Parse LLM Tool Calls — CVSS 10.0 Unauthenticated RCE (CVE-2026-61539)"
date: 2026-08-24
category: daily
type: digest
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "Open-source inference server Xinference calls Python eval() directly on model-generated strings when parsing Llama3 tool-call output. An attacker who can influence model output — one prompt is enough — gets arbitrary command execution on deployments that ship with authentication disabled by default"
tldr: "Xinference (Xorbits Inference) versions up to 2.5.0 call eval(model_output, {}, {}) when parsing Llama3 tool-call output. The maintainers assumed passing empty dicts for globals/locals constituted a sandbox, but empty globals/locals still allow object-reflection chains like `().__class__.__bases__` to reach builtins — zero isolation. An attacker injects a Python expression via prompt injection, hits the unauthenticated-by-default `/v1/chat/completions` endpoint, and gets process-level arbitrary command execution. CVSS v3.1 10.0, fixed in 2.7.0 (CVE-2026-61539). Mitigation: upgrade immediately; if you can't, enable authentication and disable Llama3 tool calls; long-term, treat model output as untrusted input and replace any eval with json.loads / ast.literal_eval."
series:
  name: "AI Security Alert"
  order: 10
---

> 🌏 [中文版](/posts/daily/2026-08-24-security-xinference-eval-injection-rce)

## Incident Overview

Open-source inference server Xinference (Xorbits Inference — a self-hosted, OpenAI-compatible API server for deploying LLMs, speech, and multimodal models) has been disclosed to have a maximum-severity remote code execution vulnerability, tracked as **CVE-2026-61539**. The root cause is in the code that parses Llama3 tool-call output: model-generated strings are passed directly into Python's `eval()`. Because model output can be influenced by an attacker via prompt injection, and Xinference test deployments ship with authentication disabled by default, anyone who can reach the `/v1/chat/completions` endpoint can in theory execute arbitrary commands inside the server process. The vulnerability was fixed in version 2.7.0.

**Key Facts**

| Item | Value |
|---|---|
| Vulnerability type | Eval Injection (CWE-95), unauthenticated RCE triggered via prompt injection |
| Affected scope | Xinference (xorbitsai/inference) <= 2.5.0, using the Transformers backend with requests containing a `tools` field (Llama3 tool-call parsing path) |
| Severity | Critical (CVSS v3.1 10.0, AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H) |
| CVE | CVE-2026-61539 |
| Sources | [GitHub Security Advisory GHSA-x2rj-828p-hx9m](https://github.com/xorbitsai/inference/security/advisories/GHSA-x2rj-828p-hx9m), [CVE Record — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-61539), [OSV.dev vulnerability database](https://osv.dev/vulnerability/CVE-2026-61539) |

## Attack Surface Analysis

Xinference exposes an OpenAI-compatible `/v1/chat/completions` API. When a request includes a `tools` field and the model backend is Transformers, the response passes through `handle_chat_result_non_streaming()` in `xinference/model/llm/transformers/core.py`, which delegates to `_post_process_completion()` for tool-call parsing. The Llama3 parser `llama3_tool_parser.py` contains this line in `extract_tool_calls()` to convert the model output string into a Python object:

```python
data = eval(model_output, {}, {})
```

The intent is to turn a "dict-looking" string from the model into an actual dict, but `eval()` executes arbitrary Python expressions. Passing empty `{}`, `{}` as globals/locals does not create a sandbox — object-reflection chains like `().__class__.__bases__[0].__subclasses__()` still reach builtins, providing zero isolation. In other words, if the model can be made to output a string like `__import__('os').system('...')`, this code will execute it as a command inside the server process. Making the model output an attacker-controlled string is precisely what prompt injection does: the attacker never needs to touch the server itself — just send a prompt that steers the model into producing a malicious expression. Combined with Xinference's default of no authentication on test deployments, the entire attack chain collapses to "send one HTTP request" when `/v1/chat/completions` is reachable.

The same `eval(text, {}, {})` pattern appears elsewhere in the codebase — `utils.py` (`_eval_llama3_chat_arguments()`) and some OCR/multimodal coordinate-parsing paths (e.g. `deepseek_ocr.py`) use the identical approach. Community members pointed out as early as February this year that "passing empty dicts is not a security measure," but it took this formal security advisory to consolidate the issue into a CVE and a fix.

Mapped to the OWASP LLM Top 10, this is **LLM01 Prompt Injection** as the attack entry point, hitting **LLM02 Insecure Output Handling** (model output passed unvalidated into a dangerous downstream sink) — exactly the textbook case OWASP describes for LLM02: model output treated as trusted code/commands instead of untrusted strings.

## Defensive Measures

**Immediate Actions**
- Check your Xinference version: `pip show xinference` or inspect the deployed image tag; anything < 2.7.0 should be upgraded immediately
- If you cannot upgrade right away: enable Xinference authentication on any deployment reachable from the internet or across network segments so `/v1/chat/completions` is no longer fully unauthenticated; also avoid sending requests with a `tools` field to Llama3 models, since the vulnerability only triggers in the tool-call post-processing path
- Inventory all self-hosted Xinference instances, prioritizing those broadly reachable from the internet or internal networks with Llama3 tool-call functionality enabled

**Long-term Architecture**
- Treat model output as untrusted input everywhere in your own code. Anywhere you convert a model output string into structured data, use `json.loads()` or `ast.literal_eval()` (which only evaluates literals and raises on function calls or attribute access) instead of `eval()` — this is exactly what the official fix PR does
- Run inference server processes under least-privilege, sandboxed, or containerized identities so that even if another parsing path breaks, the RCE blast radius is contained within the container
- Adopt runtime model and agent defense tools from watchlist B7 (e.g. **HiddenLayer**, **Protect AI** model/inference security scanning, or **Lakera** prompt injection detection) to add a runtime defense layer for "model output may already be poisoned," rather than relying solely on code review to catch the next eval

## Impact Scope

Xinference is a widely used open-source self-hosted inference server for unified deployment and management of open-source LLMs, speech, and multimodal models behind an OpenAI-compatible API, commonly found in enterprise internal and personal self-hosted model-serving environments. The vulnerability trigger requires only "sending one request with a `tools` field to a Llama3 model," and test deployments default to no authentication. Public records show no listing in the CISA KEV catalog and no known public PoC of in-the-wild exploitation, but the vulnerability details — including the specific bypass expressions and code paths — have been fully disclosed alongside the advisory, making the attack bar low. If your agent system or internal tools connect to a self-hosted Xinference service with tool-call functionality enabled, prioritize confirming version and network reachability. Even if you don't use Xinference, this incident is worth using as a prompt to check your own codebase for similar patterns of "model output strings passed directly into eval/exec."

## Takeaway

This incident chains "prompt injection" and "unsafe code execution" — two risks usually discussed separately — into a single attack path. We often frame prompt injection's impact as "making the model say the wrong thing" or "leaking information," but the moment downstream code contains a single `eval(model_output)`, prompt injection escalates directly to server-level RCE, and the attacker never needs to exploit any "vulnerability" in the traditional sense — the code logic itself is the vulnerability. When assessing any system that programmatically processes model output, "where does the model output ultimately flow to (what sink)" matters just as much as "is input validation sufficient."

## References

- [Remote code execution via unsafe eval() in Llama3 tool-call parsing — GitHub Security Advisory GHSA-x2rj-828p-hx9m](https://github.com/xorbitsai/inference/security/advisories/GHSA-x2rj-828p-hx9m)
- [CVE Record: CVE-2026-61539 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-61539)
- [CVE-2026-61539 — OSV.dev](https://osv.dev/vulnerability/CVE-2026-61539)
- [fix: replace eval() with safe alternatives to prevent RCE in tool parsers — GitHub PR #4786](https://github.com/xorbitsai/inference/pull/4786)
- [Xinference CVE-2026-61539 analysis — vuln.today](https://vuln.today/cve/CVE-2026-61539)
