---
title: "Security Alert | OpenAI's Official Render Deploy Skill Hallucinated a Domain — Production Tokens Leaked for Nearly 5 Months"
date: 2026-10-17
category: daily
tags: [ai-agent, security, daily, supply-chain]
lang: en
description: "AIR Security found that OpenAI's official render-deploy skill wrote an unregistered domain into its docs as Render's internal service address. Codex carried it into real deployment code, and researchers who registered the domain started receiving production tokens."
tldr: "Since January 2026, OpenAI's official render-deploy skill has told agents that Render's internal service domain is render-internal.com — a domain nobody had ever registered. Codex bakes it into generated deployment code as the default. AIR Security registered the domain first, stood up a passive sinkhole, and confirmed live production apps were sending API tokens to it. Render patched on 8/14, OpenAI pulled the Render plugin on 8/26, and the technical write-up went public on 10/16."
series:
  name: "AI Security Alert"
  order: 56
---

> 🌏 [繁體中文版](/posts/daily/2026-10-17-security-openai-render-skill-hallucinated-domain)

## What Happened

OpenAI maintains an official GitHub repository of skills that teach agents how to work with various platforms. Because these carry OpenAI's name and are often vetted by the vendor, users and agents give them more trust than average. One of those skills, `render-deploy`, teaches agents how to deploy applications on Render — and its reference docs describe a Render "private service domain," `render-internal.com`, complete with copy-pasteable sample code. The domain was never registered and appears nowhere in Render's actual documentation. AIR Security's research team registered it themselves and stood up a passive sinkhole. Real production apps started showing up, sending API tokens and calls to an address they believed was their own internal service.

**Key Facts**

| Item | Detail |
|---|---|
| Incident type | Supply chain attack (AI skill hallucinated domain / phantom squatting) |
| Scope | Users who deployed apps via the Render plugin (bundled in `openai/plugins`, including the `render-deploy` skill), and their Codex-generated code |
| Severity | High |
| CVE | None (coordinated vendor fix, no public CVE assigned) |
| Sources | [AIR Security technical write-up](https://www.air.security/blog-posts/render-openai), [CSO Online](https://www.csoonline.com/article/4236659/hallucinated-domain-in-official-openai-skill-underscores-ai-supply-chain-risks.html) |

## Attack Surface Analysis

The `render-deploy` skill's `references/service-types.md` states "Private DNS: `[service-name].render-internal.com`" and hands over ready-to-paste code like `const API_URL = 'http://internal-api.render-internal.com:10000'`. A second file, `configuration-guide.md`, prints a database connection string in the same shape. This entire technical detail was an AI hallucination — `render-internal.com` is not a Render domain, and Render's private networking never routes through it.

AIR Security tested the claim with Codex first: they simply asked it to deploy two services that needed to talk to each other, using the skill as instructed. The hallucinated domain showed up in the generated application code and deployment config as the default value — the one that takes effect if no override is supplied at runtime. To confirm this wasn't just a reproducible test case, they registered the domain and pointed it at a sinkhole that answers on every subdomain and port while logging traffic. Live, token-bearing calls from real services started arriving almost immediately — proof that production deployments were already sending credentials to infrastructure nobody controlled, believing it was their own backend.

The root cause is a misplaced trust chain: this wasn't malicious content injected from outside. It was a technical detail stated as fact inside a skill that OpenAI itself maintains and a vendor partly vetted — exactly the kind of source users and agents have the least reason to question. This maps to **OWASP LLM05 (Supply Chain Vulnerabilities)**: the skill itself is an under-verified dependency, and everything it references — domains, URLs, APIs — belongs in the attack surface, not just the skill's own code.

## Defense

The immediate move is to check whether you've deployed anything with this skill; the long-term one is treating every external resource a skill references as a real dependency, not something official status exempts from verification.

**Immediate actions**
- Search your codebase and deployment configs for `render-internal.com`: `grep -r "render-internal.com" .`
- If you find a hit: remove the hardcoded domain reference, switch to Render's documented private-networking method, and **rotate every API token or database credential that was ever sent through that domain** (assume it's compromised)
- Check whether you're still on an older `openai/plugins` build that bundles the Render plugin; update to a version released after August 26, 2026

**Long-term architecture**
- Treat every external resource a skill references — domains, URLs, repos, APIs, accounts — as a dependency to inventory and periodically re-verify. Official or vendor-vetted status is not a reason to skip the check.
- Borrow from Unit42's ["Phantom Squatting"](https://unit42.paloaltonetworks.com/phantom-squatting-hallucinated-web-domains/) research: scan agent-generated code in CI for domains that are unregistered and could be squatted — the domain-level version of slopsquatting
- Consider adding AI supply-chain scanning tools like watchlist B7's Protect AI or Noma Security to your existing SCA pipeline, specifically to catch hallucinated dependencies inside skills and generated code

## Impact

The erroneous domain has existed in `render-deploy` since a commit on January 27, 2026. The Render plugin was bundled into `openai/plugins` starting March 13, 2026, and stayed there until Render patched it on August 14 and OpenAI removed the plugin on August 26 — an exposure window of nearly five months. There's no public figure for how many users were affected, but AIR Security's sinkhole confirmed ongoing, live traffic from real production environments during that window, meaning real deployments were following the official example and sending secrets to that domain. AIR Security published its technical write-up on October 16, only after confirming the fix had shipped — a standard coordinated-disclosure timeline.

If your agent workflow treats an AI-generated skill, tutorial, or doc as the source of truth for deployment config, any hallucinated technical detail inside it — a domain, an API endpoint, a package name — can be registered and exploited by an attacker who finds it first. What makes this one notable is that the attack surface wasn't a malicious third-party package; it was an official, trusted source getting one line wrong.

## Today's Takeaway

I'd assumed slopsquatting only happened at the package-name level — npm or PyPI names that AI hallucinates and attackers register. This incident shows the same pattern works at the domain-name level too, and it doesn't need any malicious input from outside: the hallucination itself is the attack surface. The "official, vendor-vetted" label just makes users less likely to question it, which lets the error survive longer.

## References

- [AIR Security — OpenAI Sesame: Skill Vulnerability in OpenAI's Official Skill Made Production Apps Leak Tokens](https://www.air.security/blog-posts/render-openai)
- [CSO Online — Hallucinated domain in official OpenAI skill underscores AI supply chain risks](https://www.csoonline.com/article/4236659/hallucinated-domain-in-official-openai-skill-underscores-ai-supply-chain-risks.html)
- [Unit42 — Phantom Squatting: AI-Hallucinated Domains as a Software Supply Chain Vector](https://unit42.paloaltonetworks.com/phantom-squatting-hallucinated-web-domains/)
