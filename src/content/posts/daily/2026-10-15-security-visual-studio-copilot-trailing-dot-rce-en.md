---
title: "Security Alert | One Trailing Dot Let Copilot in Visual Studio and SSMS Rewrite Its Own Settings — CVE-2026-103572"
date: 2026-10-15
category: daily
tags: [ai-agent, security, daily, prompt-injection, privilege-escalation]
lang: en
description: "Copilot in Visual Studio and SQL Server Management Studio compared protected filenames as raw strings, so a trailing dot bypassed the check and injected instructions could add an MCP server or swap the ripgrep path to run arbitrary commands"
tldr: "CVE-2026-103572 (rated Important by Microsoft, CVSS 8.8): Copilot's check blocking writes to `.mcp.json` and `settings.VisualStudio.json` only compared strings, and Windows drops a trailing dot when writing files, so `.mcp.json.` passed the check and landed in the real config file. A Copilot hijacked by prompt injection could add a malicious MCP server or point the ripgrep path at any program. Fixed in the 13 October Patch Tuesday; a public PoC is out. Defense: update VS 2022 to 17.14.42 and VS 2026 to 18.10.4, update SSMS, and check both files for servers or tool paths nobody added."
series:
  name: "AI Security Alert"
  order: 53
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-security-visual-studio-copilot-trailing-dot-rce)

## Incident Overview

GitHub Copilot inside Visual Studio and SQL Server Management Studio (SSMS) is not supposed to modify config files like `.mcp.json` and `settings.VisualStudio.json` without user confirmation. Researcher Johann Rehberger (Embrace The Red) found that the check only compared filename strings, while the Win32 file APIs drop a trailing dot when writing. So `.mcp.json.` passed the check, and the write went to the real `.mcp.json`. A Copilot hijacked by prompt injection could use this to install a malicious MCP server for itself, or swap the ripgrep executable path it uses for search, achieving arbitrary command execution. The bug lives in the shared `Microsoft.VisualStudio.Copilot.Core.dll`; Microsoft fixed it in the 13 October 2026 Patch Tuesday, and a public PoC has been released.

**Key Facts**

| Item | Value |
|---|---|
| Type | Prompt injection → config-write protection bypass → arbitrary command execution |
| Affected | Copilot in Visual Studio 2026, Visual Studio 2022 (17.14) and SQL Server Management Studio |
| Severity | High (Microsoft: Important RCE, CVSS 8.8) |
| CVE | CVE-2026-103572 |
| Fixed versions | VS 2022 17.14.42, VS 2026 18.10.4; SSMS patched in the October update (version number not given in the sources cited here) |
| Sources | [MSRC](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-103572), [Embrace The Red original write-up](https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/), [SecurityOnline](https://securityonline.info/cve-2026-103572-visual-studio-copilot-rce-disclosed), [Agent Security Brief](https://www.agentsecbrief.com/n008-a-trailing-dot-let-visual-studios-copilot-run-attacker-code-2/) |

## Attack Surface Analysis

The attack starts with indirect prompt injection. The attacker hides instructions in a file the developer will have Copilot read, or in data returned by an MCP server. Copilot follows them and creates a config file whose name ends in an extra dot. The protection check decides this isn't a protected filename and skips the confirmation prompt; Windows strips the trailing dot on write, and the content lands in the real config file. Microsoft's own documentation describes this behavior: names ending in a period are saved without it.

With config-write access, there are two paths. One is to add an "MCP server" to `.mcp.json` that actually runs an arbitrary command and add it to the enabled list, so the command runs when the IDE starts the server. The other, Visual Studio only, is to replace the ripgrep path in `settings.VisualStudio.json` with any program, which then runs the next time Copilot searches; the PoC pops the calculator. The researcher also reported path-traversal variants: paths starting inside the trusted Extensions directory could use `..\` to escape, read the SSMS installation ID, and from that derive the location of the user's settings file.

The root cause is **not normalizing the path before validating it**, so the string the check saw differed from the target the filesystem wrote. In OWASP LLM Top 10 terms, the entry point is **LLM01 Prompt Injection** and the damage is **LLM06 Excessive Agency**: an agent that can edit its own tool configuration can grant itself new permissions.

## Defenses

**Immediate actions**
- Update Visual Studio 2022 to 17.14.42 or later and Visual Studio 2026 to 18.10.4 or later, and install the October SSMS update
- Check `.mcp.json` and `settings.VisualStudio.json`: any MCP server nobody added, extra names in `enabledMcpServers`, and whether `copilot.general.tools.ripgrepPath` still points at the real ripgrep
- Until patched, avoid having Copilot process files of unknown origin or connect to unreviewed third-party MCP servers

**Long-term architecture**
- Any "agent must not write" file list should be matched only after fully normalizing the path. Microsoft's fix adds `GetFullPath` before the comparison, which strips trailing dots and resolves `..`
- Move agent config (MCP lists, tool paths) out of the agent's writable scope and manage it at the IDE or system layer, instead of relying on string checks inside the agent
- Manage MCP servers with an allowlist and require human approval for any new server; MCP runtime governance tools such as Netzilo can block unapproved servers on the endpoint
- Use runtime detection such as Lakera or Prompt Security to reduce indirect prompt injection arriving through files or MCP responses

## Impact

Every developer and DBA using Copilot in Visual Studio 2022/2026 or SSMS on Windows is in scope, and environments connected to third-party MCP servers carry more risk, since those are one source of injected content. The researcher reported the bug on 4 August, Microsoft confirmed it on 16 September and shipped the fix on 13 October. According to the researcher, the issue was ruled out of scope for a bounty.

For teams building their own agents, the lesson is in the design: as soon as an agent can write the files that decide which tools it may use, any gap in a check becomes privilege escalation. Checks must assume the agent has already been hijacked, not that it will follow the rules.

## Today's Takeaway

I used to think protecting a coding agent's config files was a matter of listing the filenames it may not write. This case shows that how the operating system interprets the name matters more than the list. A string comparison guards a string; what you actually need to guard is where the filesystem ends up writing.

## References

- [CVE-2026-103572 — Microsoft Security Response Center](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-103572)
- [Visual Studio Copilot and SSMS Remote Code Execution (CVE-2026-103572) — Embrace The Red](https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/)
- [Public Proof-of-Concept Disclosed for CVE-2026-103572 — SecurityOnline](https://securityonline.info/cve-2026-103572-visual-studio-copilot-rce-disclosed)
- [CVE-2026-103572 affected products and fixed builds — Windows Forum](https://windowsforum.com/news/cve-2026-103572-visual-studio-tools-for-applications-and-sql-server-management-studio-remote-code-execution-vulnerability.448195)
- [N008: A trailing dot let Visual Studio's Copilot run attacker code — Agent Security Brief](https://www.agentsecbrief.com/n008-a-trailing-dot-let-visual-studios-copilot-run-attacker-code-2/)
- [File and folder names that end with a period — Microsoft Learn](https://learn.microsoft.com/en-us/troubleshoot/windows-client/shell-experience/file-folder-name-whitespace-characters)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
