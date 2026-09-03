---
title: "Security Alert | Splunk MCP Server Hit with CVSS 9.1 Deserialization RCE, AI Toolkit Also Affected"
date: 2026-08-21
category: daily
type: digest
lang: en
tags: [ai-agent, security, daily, privilege-escalation, mcp]
description: "Splunk patches 17 vulnerabilities in one batch — the MCP Server app's credential management component has a deserialization flaw letting admin-role users achieve host-level arbitrary command execution, and the AI Toolkit's model-loading API has a similar deserialization RCE"
tldr: "On 2026/8/19 Splunk published SVD-2026-0808, patching 17 vulnerabilities across the Cisco Talos add-on, AI Toolkit, Connect for Kafka, MCP Server app, and On-Call. The most severe, CVE-2026-76404 (CVSS 9.1), is in the Splunk MCP Server app's credential management component — unserialized stored data without type validation lets admin-role users execute arbitrary OS commands. CVE-2026-76395 (CVSS 8.8) in AI Toolkit triggers similar RCE when loading model files containing pickle payloads. No in-the-wild exploitation observed. Mitigation: upgrade MCP Server app to 1.2.1 and AI Toolkit to 6.0.1 immediately; disable the app if you cannot upgrade right away."
series:
  name: "AI Security Alert"
  order: 7
---

> 🌏 [中文版](/posts/daily/2026-08-21-security-splunk-mcp-server-toolkit-rce)

## Incident Overview

On August 19, 2026, Splunk released security hardening advisory SVD-2026-0808, patching 17 vulnerabilities across five apps/add-ons: Cisco Talos Intelligence for Enterprise Security Cloud, Splunk AI Toolkit, Splunk Connect for Kafka, Splunk MCP Server app, and Splunk On-Call (VictorOps). The most critical is CVE-2026-76404 in the Splunk MCP Server app, scoring CVSS 3.1 9.1 (Critical): a user with the admin role can exploit a deserialization flaw in the credential management component to execute arbitrary commands at the OS level on the Splunk host. In the same batch, the AI Toolkit's model-loading API also has a nearly identical RCE (CVE-2026-76395, CVSS 8.8). Neither Splunk nor multiple security media outlets have found evidence of in-the-wild exploitation.

**Key Facts**

| Item | Value |
|---|---|
| Vulnerability Type | Insecure Deserialization (CWE-502) leading to RCE + multiple access control flaws |
| Affected Scope | Splunk MCP Server app (< 1.2.1), Splunk AI Toolkit (< 6.0.0 / < 6.0.1), Connect for Kafka (< 2.2.7), Talos add-on (< 1.0.3), On-Call (< 1.0.43) |
| Severity | Critical (CVE-2026-76404, CVSS 9.1) / also 8 High, 7 Medium in the same batch |
| CVE | CVE-2026-76404 (MCP Server RCE), CVE-2026-76395 (AI Toolkit RCE), 17 CVEs total |
| Sources | [Splunk Advisory SVD-2026-0808](https://advisory.splunk.com/advisories/SVD-2026-0808), [cybersecuritynews.com](https://cybersecuritynews.com/splunk-patches-security-flaws/), [gbhackers.com](https://gbhackers.com/splunk-fixes-17-vulnerabilities/), [securityonline.info](https://securityonline.info/splunk-apps-cve-2026-76404/), [Tenable CVE Database](https://www.tenable.com/cve/CVE-2026-76395) |

## Attack Surface Analysis

The most notable aspect of this advisory is not any single vulnerability, but that **the same attack pattern appears independently in two different apps**: the Splunk MCP Server app's credential management component and the AI Toolkit's model-loading REST API both deserialize stored data directly without first verifying that the content types match expectations. CVE-2026-76404 is in the former: the MCP Server app uses an insecure deserialization flow when storing credentials, allowing an admin-role user to craft malicious data that triggers arbitrary OS command execution during deserialization. CVE-2026-76395 is in the latter: the AI Toolkit's model codec parses data structures containing sparse matrices when loading model files but fails to guard against embedded pickle payloads — the classic "model file as code execution" attack surface well-known in the Python ecosystem, previously seen in PyTorch, scikit-learn, and others. Splunk effectively replicated this pattern in their own AI add-on.

The role of the Splunk MCP Server app deserves special attention: it is Splunk's official bridge that lets AI Agents and LLM clients query and operate Splunk via the Model Context Protocol. In other words, this is not the familiar "LLM tricked by prompt injection into doing bad things" problem — **the MCP server's own code has RCE**. Anyone who can reach the credential management component (whether through compromised admin credentials or by chaining other vulnerabilities to gain admin access first) can convert "AI Agent access to SIEM" directly into full host-level compromise.

Mapping to the OWASP LLM Top 10, these vulnerabilities primarily correspond to **LLM03 Training Data Poisoning / Supply Chain** (model files as attack vectors) and **LLM05 Supply Chain Vulnerabilities** (the MCP Server as a third-party component that is itself an attack surface). The root cause in both components is treating "data uploaded by a role-verified user" as trusted data, ignoring that the data itself can still carry malicious content — a logic fundamentally shared with many prompt injection incidents: the system conflates "authorized input source" with "validated input content."

## Defensive Measures

**Immediate Actions**
- Inventory whether your environment has Splunk MCP Server app or Splunk AI Toolkit installed, and check the current version: `splunk display app | grep -i "mcp\|ai toolkit"`
- Upgrade immediately: MCP Server app → 1.2.1, AI Toolkit → 6.0.1 (if on the 6.0 branch) or 6.0.0 (if on the 5.7 branch)
- If immediate upgrade is not possible, disable or remove the app per Splunk's guidance (note: disabling AI Toolkit will also shut down dependent SPL commands and model operations)
- Review accounts holding admin/power roles and confirm there are no anomalous or excessive high-privilege accounts — nearly all vulnerabilities in this batch require elevated roles to trigger, so tightening role assignments is the most direct mitigation

**Long-term Architecture**
- Treat bridge components like MCP Server — which give AI Agents direct access to internal systems — as core infrastructure, subject to routine vulnerability scanning and patching cycles, not as peripheral tools that can wait
- Adopt MCP server governance tools (such as Netzilo, on the watchlist) to centrally inventory versions and permissions of all deployed MCP servers within the organization, preventing "installed but untracked" shadow deployments
- When building custom ML model loading pipelines, avoid pickle or other deserialization formats that can execute arbitrary code; use safetensors, JSON, or other data-only formats that carry no executable logic
- Enforce least privilege: operational roles for AI-related apps should be separated from general admin roles as much as possible, reducing the blast radius of "one compromised account = full AI add-on takeover"

## Scope of Impact

Splunk has not published installation estimates, but both the MCP Server app and AI Toolkit are relatively recent additions targeting "integrating AI/Agent capabilities into Splunk," so their user base is concentrated among organizations that have already adopted AI-driven operations or SOC automation. Splunk and multiple security outlets (securityonline.info, gbhackers.com) confirm no in-the-wild exploitation to date. However, 17 CVEs disclosed at once — 1 Critical, 8 High — indicates these two apps clearly lag behind the security maturity of Splunk's core products. For any team using MCP Server as a bridge for AI Agents to access enterprise systems, this incident is a concrete reminder: the code quality and patching discipline of the MCP server itself matters just as much as the backend systems it protects.

## Takeaway

Most security incidents in recent weeks have revolved around "prompt injection tricking AI into doing bad things," but these two Splunk RCEs remind me that bridge components like MCP Servers and AI Toolkits — which give Agents access to enterprise systems — have their own code security surface (deserialization, input validation) that is completely independent from, yet equally lethal as, whether the model they connect to has been jailbroken. And while "requires admin role to trigger" sounds like a mitigating factor, in environments where credential leaks and lateral movement are commonplace, it is more realistically the attacker's next step after gaining an initial foothold — not a genuine barrier.

## References

- [Splunk Advisory: SVD-2026-0808 Security Hardening Release for Splunk Apps and Add-ons](https://advisory.splunk.com/advisories/SVD-2026-0808)
- [cybersecuritynews.com: Splunk Patches Critical MCP Server RCE and 16 Other Security Flaws](https://cybersecuritynews.com/splunk-patches-security-flaws/)
- [gbhackers.com: Splunk Fixes 17 Vulnerabilities Including Critical MCP Server RCE](https://gbhackers.com/splunk-fixes-17-vulnerabilities/)
- [securityonline.info: CVE-2026-76404 Splunk MCP Server RCE, CVSS 9.1](https://securityonline.info/splunk-apps-cve-2026-76404/)
- [cyberupdates365.com: Critical Splunk MCP Server RCE & AI Toolkit Patches](https://cyberupdates365.com/splunk-mcp-server-rce-patch/)
- [Tenable: CVE-2026-76395 Details](https://www.tenable.com/cve/CVE-2026-76395)
- [OpenCVE: CVE-2026-76404 Details](https://app.opencve.io/cve/CVE-2026-76404)
