---
title: "Security Alert | MCP \"Filesystem Capability Laundering\": 787 of 21,097 Servers Flagged, 150 Confirmed to Read Your SSH Keys"
date: 2026-10-18
category: daily
tags: [ai-agent, security, daily, data-exfiltration, mcp]
lang: en
description: "A large-scale study, MCP-FSD, scanned 21,097 MCP servers and found 16.4% have undeclared filesystem access. Dynamic testing confirmed 150 exploitable instances that can read credential files outside their declared scope — even Anthropic's own reference Git MCP Server carried two CVEs."
tldr: "The paper \"My Credentials, Please\" (arXiv:2610.22301, Oct 15 2026) names the pattern \"filesystem capability laundering\": a tool's declared purpose (say, git_add) doesn't match the file scope it can actually touch, and approving a call never restricted what the server process can reach. Scanning 21,097 servers, the researchers triaged 4,806 and found 787 (16.4%) with undeclared filesystem capability; dynamic testing confirmed 150 exploitable instances, 96% of which fell to a plain path-traversal string. Even Anthropic's own reference Git MCP Server needed two CVE fixes over this (CVE-2025-68143, CVE-2026-27735). Defense: always run local MCP servers in a container or a locked-down account — never the one holding your SSH keys or cloud credentials."
series:
  name: "AI Security Alert"
  order: 57
---

> 🌏 [繁體中文版](/posts/daily/2026-10-18-security-mcp-filesystem-capability-laundering)

## What Happened

A paper published on arXiv on October 15, 2026 — "My Credentials, Please: Detecting Filesystem Capability Laundering in MCP Servers at Scale" (Huang, Tang, Guan, Sun, He; arXiv:2610.22301) — names a risk the MCP ecosystem has long underestimated: filesystem capability laundering. The core problem is that approving a tool call in an MCP client only decides whether that call runs; it does nothing to limit which files the server process can actually touch. A local MCP server is a child process running under your own account, so unless its code validates paths, it can read and write anything you can. The authors built a scanning pipeline called MCP-FSD, triaged 21,097 servers from nine registries down to 4,806 that reached full measurement, and found that 787 of them (16.4%) showed filesystem capability despite not being classified as filesystem servers. Dynamic testing confirmed 150 instances were genuinely exploitable, pulling credential files from outside the tool's declared scope. The most striking data point: even Anthropic's own reference Git MCP Server needed two CVE fixes as a result.

**Key Facts**

| Item | Detail |
|---|---|
| Incident type | MCP tool scope escape / unauthorized filesystem access ("Filesystem Capability Laundering") |
| Scope | The locally-deployed MCP server ecosystem, including Anthropic's official Git and Filesystem reference servers |
| Severity | High (systemic, large-scale, with confirmed exploitable instances) |
| CVE | CVE-2025-68143, CVE-2026-27735 (Anthropic Git MCP Server); the paper also cites prior CVE-2025-53110 and CVE-2025-53109 (Filesystem MCP Server) as benchmark vulnerability patterns |
| Sources | [arXiv:2610.22301](https://arxiv.org/abs/2610.22301), [skycloak.io technical write-up](https://skycloak.io/blog/mcp-filesystem-capability-laundering/) |

## Attack Surface Analysis

The attack has two stages, and neither needs to get past any LLM guardrail — the whole problem lives in the MCP server's code, not the prompt layer. The first stage is steering the server toward a path it shouldn't touch. The attacker usually doesn't target the user directly; instead, text the agent reads from somewhere external — a malicious web page, an issue comment — persuades the model to pass a different path as a tool argument. The paper's example is the Git MCP Server's `git_init`, which accepts a caller-supplied path with no check that it stays inside a configured workspace. An attacker-influenced argument naming `~/.ssh` turns that directory into a Git repository; from there, calls that look completely benign — `git_add`, `git_diff_staged` — return the private key's contents as ordinary diff output. No single step looks like "read a sensitive file," which is exactly what gives the pattern its name: the dangerous read arrives packaged inside a call that looks legitimate and was already approved.

The second stage is why the approval prompt doesn't stop any of this. The prompt shows a tool name and its arguments, but nothing resolves those arguments into real paths, follows symlinks, or compares the result against an allowed directory — unless the server's own code does that work, no component in the chain does. The paper sorts the failure modes into three layers: missing validation entirely (most common in Python servers, accounting for 53.8% of flagged "missing validation" findings); validation that exists but can be bypassed, such as the Filesystem MCP Server's CVE-2025-53110, where a string-prefix check let a sibling directory like `/data/project-secrets` pass a check meant for `/data/project`, and CVE-2025-53109's symlink traversal; and a narrow tool contract with a wide actual effect, which is the Git MCP Server case above. The authors also note that the MCP TypeScript SDK ships no path-containment helper, so every server writes its own — and Node servers accounted for 57–63% of emissions in every bypass-style rule the paper tracked. Mapped to the OWASP LLM Top 10, this sits squarely in **LLM06 (Excessive Agency)** — a tool's actual system privileges far exceed what its declared purpose requires — and **LLM05 (Supply Chain Vulnerabilities)**, since the flaw lives in widely-reused reference implementations and propagates with them.

## Defense

**Immediate actions**
- Inventory every installed MCP server that accepts a path, filename, or directory argument — including tools named "build," "log," or "diff" that don't sound file-related; any tool that can return file contents is a read primitive and needs the same scope controls as an explicit read tool
- Never run a local MCP server under the account that holds your SSH keys, cloud credentials, or logged-in browser profile — use a dedicated, locked-down account or container instead
- Check your Git/Filesystem MCP server versions: the Git server fix landed in 2025.9.25 (removed `git_init`) and 2026.1.14 (`git_add` delegates to the Git CLI, which rejects out-of-repo paths)

**Long-term architecture**
- Require every self-built or third-party MCP server to declare its read/write scope explicitly — which directories it may read, which it may write — and treat a tool with no documented path restriction as unsafe until proven otherwise
- Validate paths by resolving to an absolute canonical form (handling `..` and symlinks) and comparing path components, never by string-prefix matching — the exact gap CVE-2025-53110 exploited
- Add OS-level sandboxing (containers, chroot, or an application sandbox like macOS Seatbelt) as a second line of defense, so a bug in the server's own checks doesn't become a real leak; the paper's dynamic testing confirmed that, under its tested sandbox policy, all 150 confirmed vulnerable instances were blocked inside the sandbox
- Bring in cross-platform agent runtime governance with a real kill switch, like watchlist B7's Netzilo, or lean on Invariant Labs' agent security research and formal-verification approach to check whether a tool's actual behavior matches its declared contract before it ships

## Impact

Of the 21,097 registered MCP servers, only 7,222 (34.2%) were local open-source servers that made it through the full test pipeline, narrowing to a final triage set of 4,806 — so this study describes the servers it could actually install and run, not a confirmed rate across the whole ecosystem. The 787 figure (16.4%) is a screening signal flagging servers worth a closer look, not 787 confirmed vulnerabilities; the number dynamically confirmed as exploitable is 150, and 144 of those (96%) fell to a plain path-traversal string with no special encoding needed. The authors submitted 13 findings for coordinated disclosure, and as of the paper's writing, some upstream fixes or CVE assignments were still pending.

If your agent system lets a local MCP server touch the filesystem — true of nearly every local stdio server — this research flags a specific, easy-to-miss check: nothing sits between the arguments you see in an approval prompt and the paths the server can actually reach, unless the server does that work itself.

## Today's Takeaway

I'd assumed the MCP approval prompt — the "allow this tool call?" dialog — provided at least some scoping. This research is blunt about it: approval only decides whether a call happens, not what the server's code is able to touch. The only real gates are the server's own path validation and OS-level sandboxing — and even Anthropic's own reference implementation had gaps in both.

## References

- [arXiv:2610.22301 — My Credentials, Please: Detecting Filesystem Capability Laundering in MCP Servers at Scale](https://arxiv.org/abs/2610.22301)
- [skycloak.io — MCP Filesystem Capability Laundering: When a Harmless Tool Can Read Your SSH Keys](https://skycloak.io/blog/mcp-filesystem-capability-laundering/)
- [Model Context Protocol — Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
