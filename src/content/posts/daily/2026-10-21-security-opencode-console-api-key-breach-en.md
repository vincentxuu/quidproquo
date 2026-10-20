---
title: "Security Alert | OpenCode's Console Service Breached, Linked AI Provider Keys May Have Leaked"
date: 2026-10-21
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: en
description: "OpenCode's hosted Console service was breached on the night of October 16; the vendor ties the intrusion to a large-scale distillation attack. 1.4% of Console users who had linked an external AI provider key are affected, and some have already reported unauthorized charges."
tldr: "OpenCode disclosed on October 18 that its Console service was breached. The affected 1.4% are users who had pasted an OpenAI, Anthropic, or Google key into Console so it could call the API on their behalf. The vendor ties the attack to a distillation attempt but has not published a root cause. Victims on X and Reddit have already reported hundreds of dollars in unauthorized usage. Defense: inventory who runs OpenCode, check which providers are linked in `auth.json`, then revoke and rotate those keys at the provider and set spend caps."
series:
  name: "AI Security Alert"
  order: 59
---

> 🌏 [中文版](/posts/daily/2026-10-21-security-opencode-console-api-key-breach)

## Summary

OpenCode co-founder Dax Raad posted on X on October 17 that an intruder had reached a legacy system inside Console, OpenCode's optional hosted service, on the night of October 16, and may have exposed the third-party AI provider keys users had saved there. Console exists so a team can paste its own OpenAI, Anthropic, or Google key into the platform and let Console call the API on the team's behalf, so nobody else on the team has to handle the raw key. The affected group is "1.4% of Console users," all of whom had an external provider linked. OpenCode emailed every affected account on the morning of October 17 under the subject "Action Required: Potential provider key breach," and said anyone who did not receive that email was not affected. The company ties the incident to a "large-scale distillation attack," but as of this writing has not published a root cause, named the legacy system, described the intrusion path, stated how many keys the system held, or said how many users the 1.4% figure represents.

**Key facts**

| Item | Detail |
|---|---|
| Incident type | Platform-side credential exposure, tied to suspected model-distillation abuse |
| Scope | OpenCode Console users who had linked an OpenAI, Anthropic, or Google key (~1.4% of Console accounts) |
| Severity | High |
| CVE | None |
| Sources | [The Hacker News](https://thehackernews.com/2026/10/opencode-console-breach-may-have.html), [StepSecurity](https://www.stepsecurity.io/blog/opencode-security-breach) |

## Attack Surface Analysis

The attacker reached Console, the proxy layer, not the OpenCode CLI running on a user's own machine. Console's design is: paste a key in once, and Console calls the API for you from then on — which effectively turns Console into a vault holding a large pool of third-party AI credentials in one place. OpenCode's co-founder stressed on X that these keys "never come to us," pointing out that the CLI and desktop apps store provider keys a developer added locally in a SQLite database on that machine (`~/.local/share/opencode/auth.json`) — a separate storage path from the keys held inside Console. Only the Console-side keys were exposed here. In other words, the platform centralized key custody for the sake of letting a team share one key across API calls, and once the subsystem holding that custody (which the vendor only describes as a "legacy system") was breached, every provider credential stored in it was exposed at once. That's the same centralized-trust risk as a leaked database of passwords — except what leaked here are bearer tokens that bill directly against OpenAI, Anthropic, and Google accounts.

OpenCode frames the attacker's motive as a "distillation attack": AI providers use this term for campaigns that query a target model at massive scale to extract its behavior and train a competing model on the results. Anthropic disclosed in September that such campaigns typically reach provider APIs through networks of fake accounts built from stolen credit cards, login credentials, and harvested API keys. A stolen OpenCode Console key serves both purposes at once: it lets an attacker run large-scale distillation queries against frontier models while billing the victim's account, and it's also a liquid asset — underground markets already buy and resell reusable AI tokens and keys.

Mapped to the OWASP LLM Top 10: **LLM10 Model Theft** (extracting a model's behavior through mass querying, funded by someone else's account) is the end goal of the attack; the root cause mirrors **LLM02 Sensitive Information Disclosure** — not a model leaking data to a user, but a platform's centrally held "credentials that can reach the model" being insufficiently protected.

## Defense Measures

**Immediate actions**
- Inventory who in your environment runs OpenCode: run `which opencode`, and check whether `~/.local/share/opencode/auth.json` (macOS/Linux) or `%USERPROFILE%\.local\share\opencode\auth.json` (Windows) exists and lists a provider
- Cross-check against OpenCode's October 17 email, subject "Action Required: Potential provider key breach" — not receiving it is not proof of safety, so verify independently where you can
- Treat any OpenAI, Anthropic, or Google key that ever appeared in `auth.json` or was pasted into Console as compromised: **revoke and reissue it directly at the provider**, not just remove it from OpenCode — deleting a key from Console does not invalidate it at the provider
- Review usage and billing going back at least to October 16 for requests you did not make; victims on X and Reddit have already reported unauthorized charges on a single provider ranging from roughly $200 to $1,700

**Long-term architecture**
- Give every tool and script its own key instead of pasting one key everywhere — this bounds the blast radius of any single leak and makes the leak's source traceable
- Set spend limits and alerts at the provider itself, not only in a downstream platform's budget feature — this incident shows a Console-side spend cap does nothing once a key is used directly against the provider from elsewhere
- Re-evaluate the risk of any SaaS that offers to "call the API for you" by centrally holding your key — that convenience is itself a new attack surface; weigh it against narrower-scoped, revocable credentials
- Watchlist vendors like Noma Security and WitnessAI focus on exactly this kind of AI application security and governance gap: which systems hold LLM credentials, and whether usage patterns look anomalous — useful for closing the visibility gap on which coding agents are connected to which keys inside an organization

## Impact

OpenCode has only disclosed the "1.4% of Console users" ratio, without publishing Console's total user count, so the figure cannot be converted into an absolute number. Community reports put individual losses at $200 to $1,700 on a single provider, and the vendor's own language has consistently been that keys "may have" been exposed — it has not confirmed that any key was actually copied or used. But the unauthorized charges victims are reporting on their own accounts indicate that at least some keys have genuinely been abused. OpenCode says the incident is ongoing, and its co-founder noted on October 18 that the company had been "non stop" under attack for the prior 48 hours. OpenCode is still working with Anthropic, OpenAI, and Google to remediate, and has not published a root cause or intrusion path.

For any team that wires an AI coding agent into production API keys, the lesson is direct: before choosing a hosted "we'll call the API for you" service, verify how it actually stores and controls access to keys — don't assume "open source" or "well-known" implies sound key custody.

## Takeaway

I had filed distillation attacks under purely theoretical, research-world threats. Seeing one tied directly to an ordinary credential leak changed that: an attacker doesn't need to pay for their own distillation queries — stealing a key someone else linked to a coding-agent platform lets them run those queries on the victim's bill, and the same key can then be resold on the side. The takeaway: any design that asks you to "paste your key in so the platform can call the API for you" turns that platform itself into a new, centralized target, and that has to be part of the risk assessment — not just how keys are stored on your own machine.

## References

- [OpenCode Console Breach May Have Exposed OpenAI, Anthropic, and Google API Keys - The Hacker News](https://thehackernews.com/2026/10/opencode-console-breach-may-have.html)
- [OpenCode Security Breach: Distillation Attack Hit Console Users With Linked AI Providers - StepSecurity](https://www.stepsecurity.io/blog/opencode-security-breach)
- [Anthropic says AI distillation campaigns rely on stolen credentials - The Hacker News](https://thehackernews.com/2026/09/anthropic-says-seven-china-based-ai.html)
- [OpenCode breach drains users' AI keys as platforms holding customer credentials become a target - Dealroom](https://dealroom.co/news/163473-opencode-breach-drains-users-ai-keys-as-platforms-holding-customer-crede/)
