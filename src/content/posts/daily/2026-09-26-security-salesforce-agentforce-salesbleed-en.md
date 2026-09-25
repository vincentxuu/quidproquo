---
title: "Security Alert | SalesBleed — Three Salesforce Agentforce Flaws Enable Zero-Click CRM Data Theft and Turn the Agent Into an Anonymous Phishing Tool"
date: 2026-09-26
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: en
description: "Zenity Labs disclosed three Salesforce Agentforce vulnerabilities called SalesBleed: an attacker who plants a prompt in a public Web-to-Lead form can exfiltrate CRM data with zero clicks, and hijack the agent to post phishing links inside a company's own Slack channels."
tldr: "Zenity Labs found three Salesforce Agentforce vulnerabilities, collectively named SalesBleed. An attacker plants a prompt injection in a public Web-to-Lead form, bypasses the URL-redaction filter, and exfiltrates CRM data zero-click via DNS lookups. A second flaw in the 'Reply to a Slack Thread' action — which, unlike other write actions, requires neither user confirmation nor invoker attribution — lets the hijacked agent post anonymous phishing links straight into a company's trusted internal Slack threads. Salesforce finished patching on September 21; no CVE was assigned, and the company says it has no evidence of exploitation in the wild."
series:
  name: "AI Security Alert"
  order: 38
---

> 🌏 [中文版](/posts/daily/2026-09-26-security-salesforce-agentforce-salesbleed)

## Summary

Security research firm Zenity Labs publicly disclosed three vulnerabilities in Salesforce's flagship AI agent platform, Agentforce, on September 24, 2026, under the collective name "SalesBleed." An attacker only needs to submit a lead containing a hidden prompt through a Web-to-Lead form — a form type most organizations expose publicly by design. Later, when an employee asks the agent something completely routine, like "help me with the newest lead," the agent gets hijacked while reading that record. One attack path lets the attacker pull data out of the Accounts table via a DNS lookup, with zero clicks from the victim. The other lets the agent post a phishing link into the company's own trusted Slack threads, under the agent's own identity, with no way to trace it back to whoever triggered it. Neither path requires the attacker to log into the target's Salesforce tenant. Salesforce completed a full fix on September 21 and told reporters it has no evidence the bugs were exploited before disclosure.

**Key facts**

| Item | Value |
|---|---|
| Incident type | Indirect prompt injection + zero-click data exfiltration + agent-impersonated phishing |
| Scope | Salesforce Agentforce (including agents published to Slack); any tenant with a public Web-to-Lead form whose CRM subagent holds access to both the Leads and Accounts tables |
| Severity | High (zero-click data exfiltration + unattributable internal phishing) |
| CVE | None assigned |
| Sources | [Zenity Labs (0-click exfiltration)](https://labs.zenity.io/post/salesbleed-0-click-data-exfiltration-on-agentforce), [Zenity Labs (Slack phishing)](https://labs.zenity.io/post/salesbleed-hijacking-agentforce-in-slack-for-anonymous-phishing), [Dark Reading](https://www.darkreading.com/application-security/salesbleed-exploits-salesforce-agents-slack-phishing), [SecurityWeek](https://www.securityweek.com/salesbleed-flaws-in-salesforce-agentforce-enabled-zero-click-data-exfiltration/), [The Register](https://www.theregister.com/security/2026/09/24/salesforce-agentforce-vulns-allowed-0-click-crm-data-theft-anonymous-phishing/5298958) |

## Attack Surface Analysis

The chain starts at a Web-to-Lead form — a public entry point by design, meant to let strangers submit data straight into the CRM. The attacker hides a prompt in one of the fields, roughly instructing the agent to query the Accounts table, encode a company name and deal size into a subdomain string, and print that string back as an HTML `<img>` tag. When an employee later asks the agent to review the newest lead, the General CRM subagent reads the poisoned record and follows the embedded instruction instead of the user's actual request — it can do this because the same subagent already holds query access to both the Leads and Accounts tables, so no privilege escalation is needed at all. The chat frontend renders the resulting `<img>` tag without validation, which triggers a DNS lookup for the crafted hostname; the exfiltrated data rides along in the subdomain and lands on the attacker's authoritative nameserver. Because the leak completes the moment the DNS query fires, it doesn't matter whether the follow-up HTTP request succeeds, fails, or gets blocked — this bypasses typical HTTP egress controls entirely. Salesforce's Trusted URLs mechanism was supposed to strip any non-allowlisted URL from agent output before it reached this stage, but Zenity found the filter used an incomplete list of recognized top-level domains and disagreed with the frontend renderer about where a URL actually ends. A hostname ending in an unrecognized TLD, or terminated with a curly brace or square bracket, could pass the filter as "not a URL" while the browser still treated it as one and tried to fetch it.

The second flaw sits in how Agentforce behaves once published to Slack. Most write actions there — like sending a direct message — carry two protections: a confirmation step before sending, and attribution identifying which user triggered the action. The "Reply to a Slack Thread" action has neither. That means the same hijacked prompt can, instead of just exfiltrating data, instruct the agent to reply directly into a Slack thread where employees are already discussing real business, carrying a phishing link — and recipients see only "the agent replied," with nothing pointing back to what triggered it. This works both for an external attacker (via the same poisoned Web-to-Lead submission) and for a malicious insider, who can simply ask the agent to send the message and walk away with no trail. Mapped to the OWASP LLM Top 10, this incident hits **LLM01 Prompt Injection** (untrusted external data executed as instructions), **LLM02 Insecure Output Handling** (a URL filter and its downstream renderer disagreeing on what counts as a URL, letting output slip past the control meant to stop it), and **LLM06 Excessive Agency** (a single subagent stacking the ability to read untrusted input, access sensitive internal data, and reach an external channel — a textbook [lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)).

## Defense

What makes this case worth studying is that it isn't a first occurrence. Noma Security demonstrated prompt injection through the same Web-to-Lead entry point a year earlier, and Salesforce patched the specific URL bypass it reported at the time. Zenity's findings show that patching one bypass wasn't enough — as long as the filtering architecture is "generate output first, then clean it up with rules afterward," attackers can keep finding new gaps between the parser and whatever renders the output downstream.

**Immediate actions**
- Audit whether your org's Agentforce deployment uses the "Reply to a Slack Thread" action, and confirm user confirmation is actually enabled — this is Salesforce's new default post-fix, but a single toggle can turn it off again, so verify rather than assume
- Check whether any subagent holds query access to both externally-writable tables (like Leads) and sensitive internal tables (like Accounts); split these into separate, least-privilege subagents
- If your org runs a public Web-to-Lead form, evaluate whether it needs to stay fully open, or at minimum scan submitted field content for prompt-injection patterns before it ever reaches agent context
- Check existing lead records for injection payloads that may already be sitting in the CRM — even with the attack chain now patched, old poisoned leads still re-surface every time an agent reads them

**Long-term architecture**
- Use the lethal trifecta test — untrusted input, access to sensitive data, and an external communication channel, all in one agent — to audit every AI agent's tool combination in your organization; any agent meeting all three is high-risk by construction, not just Salesforce agents
- Don't rely solely on regex-style URL filtering on output. Salesforce's fix moved to spec-conformant URL parsing and consolidated all URL checks through a single gateway — that combination of centralization and a real parser instead of string matching is worth copying for any team building its own agent output filters
- Consider tools from watchlist companies like Zenity or Noma Security that specialize in agent attack-surface research and runtime protection, to continuously scan for lethal-trifecta subagent combinations instead of waiting for the next public disclosure

## Impact

Salesforce confirmed the fix to reporters and says it has no evidence of exploitation; neither flaw received a CVE. The disclosure timeline is telling: Zenity reported the first issue on June 1, and it took Salesforce nearly three and a half months, until September 21, to fully roll out mandatory user confirmation as the default. Any tenant that had the Slack action enabled during that window was exposed. More importantly, this is the second time in a year that an independent research team has broken through Salesforce's agent defenses using the exact same Web-to-Lead entry point — meaning the structural risk of that combination (a public form feeding an agent's context) hasn't gone away just because one instance was patched.

If your organization runs any AI agent that processes externally submittable data — support forms, CRM leads, public API endpoints — and that same agent also has access to sensitive internal data or the ability to post into internal channels like Slack or Teams, this incident is worth checking your own subagent permission design against directly.

## Today's Takeaway

Most prompt-injection writeups I've read focus on data exfiltration as the single outcome. SalesBleed's second flaw is a reminder that once an agent can send content externally, being hijacked costs more than leaked data — it lets an attacker borrow the agent's identity and the trust employees already place in each other. The same injected instruction, paired with a different set of tool permissions, escalates from "steal data" to "run social engineering in the channel where people are least on guard." That's also why Zenity kept emphasizing "confirmation" and "attribution" as such basic-sounding UI details: they aren't UX polish, they're the last line that can still stop the attack, or at least leave a trail, the moment the agent gets hijacked.

## References

- [Zenity Labs: SalesBleed — Indirect Prompt Injection and 0-Click Data Exfiltration on Agentforce](https://labs.zenity.io/post/salesbleed-0-click-data-exfiltration-on-agentforce)
- [Zenity Labs: SalesBleed — Hijacking Agentforce in Slack for Anonymous Phishing Attacks](https://labs.zenity.io/post/salesbleed-hijacking-agentforce-in-slack-for-anonymous-phishing)
- [Dark Reading: 'Salesbleed' Exploits Salesforce Agents to Enable Slack Phishing](https://www.darkreading.com/application-security/salesbleed-exploits-salesforce-agents-slack-phishing)
- [SecurityWeek: 'SalesBleed' Flaws in Salesforce Agentforce Enabled Zero-Click Data Exfiltration](https://www.securityweek.com/salesbleed-flaws-in-salesforce-agentforce-enabled-zero-click-data-exfiltration/)
- [The Register: Salesforce Agentforce vulns allowed 0-click CRM data theft, anonymous phishing](https://www.theregister.com/security/2026/09/24/salesforce-agentforce-vulns-allowed-0-click-crm-data-theft-anonymous-phishing/5298958)
