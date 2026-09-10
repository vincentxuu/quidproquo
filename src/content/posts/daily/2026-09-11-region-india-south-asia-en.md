---
title: "Region Focus | India & South Asia"
date: 2026-09-11
category: daily
tags: [ai-agent, region, daily, india-south-asia]
lang: en
type: deep-dive
description: "NPCI builds a Unified Agent Protocol to let AI agents pay directly over UPI; Gnani AI pushes its sovereign AI stack Artha into BFSI; India defines agent adoption through a national payment rail rather than a model race"
tldr: "India's National Payments Corporation (NPCI) is building a Unified Agent Protocol that would let AI agents make payments on a user's behalf over UPI, possibly unveiled at the Global Fintech Fest in Mumbai (Sept 8-11); Bengaluru startup Gnani AI used the same event to announce its sovereign AI stack, Gnani Artha, expanding into banking, insurance, and financial services (BFSI); around the same time, Visa, Mastercard, and Ant International announced a cross-network AI agent identity framework called KYA — signaling that 'who gets to verify an AI agent's identity' is becoming a new battleground in global payments."
series:
  name: "AI Region Focus"
  order: 6
---

## Region: India & South Asia

This week's most important development in India's AI agent ecosystem isn't a flashy new model — it's national payment infrastructure starting to grapple head-on with AI agents. India runs the world's largest real-time payment system, UPI, and it's now deciding how to trust an AI agent — one with no phone, no fingerprint — to spend a user's money.

## Key Developments This Week

### NPCI Builds a Unified Agent Protocol to Let AI Agents Pay Directly Over UPI

India's National Payments Corporation (NPCI, which operates UPI) is building a Unified Agent Protocol aimed at letting AI agents initiate payments on a user's behalf over UPI. Reuters reported on September 3, citing three people familiar with the matter, that the protocol could be unveiled at the Global Fintech Fest in Mumbai, running September 8-11. ([startupfeed.in](https://startupfeed.in/npci-unified-agent-protocol-ai-payments-upi) · [Forkast](https://forkast.news/india-eyes-ai-driven-upi-payments-as-npci-weighs-agent-protocol/))

The core design idea is to add a layer for registering, verifying, and authorizing agents. Today UPI trusts "a person plus their phone" — an AI agent is neither, so a new trust layer is needed. According to the reporting, NPCI's layer would only verify that a request is genuinely authorized by the user, without seeing what is actually being purchased — a deliberate privacy boundary. NPCI has already been laying groundwork: in February it announced work with NVIDIA on a "payments-native AI base" for India, and fintech firms like Pine Labs and Cashfree have been building agent payment tools of their own — signaling this isn't emerging out of nowhere, but the product of more than half a year of momentum in India's payments ecosystem. ([startupfeed.in](https://startupfeed.in/npci-unified-agent-protocol-ai-payments-upi))

⚠️ Protocol details haven't been formally published yet, and NPCI declined to comment. The specification described here is based on sourcing relayed by Reuters and should be re-verified once officially announced.

### Gnani AI Pushes Sovereign AI Stack Artha Into BFSI

Also at the Global Fintech Fest in Mumbai, Bengaluru-based startup Gnani AI announced it is extending its sovereign AI stack, Gnani Artha, to banking, insurance, and financial services (BFSI) enterprises to help them build and deploy AI-powered workflows. Artha is built on Gnani's own Evon v3.3 model, positioned around keeping both models and data within India, and supports unified reasoning and tool orchestration across 11+ Indic languages, calibrated for banking, insurance, healthcare, and telecom use cases. ([Inc42](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/) · [Gnani.ai official](https://www.gnani.ai/artha-sovereign-ai))

Gnani is a longer-established Indian voice AI company that has historically focused on high-volume phone-based customer service in BFSI. Pairing "sovereign AI stack" with "vertical industry expansion" is, in effect, a bid to capture the compliance-layer business enterprises will need once NPCI's agent payment infrastructure opens up.

### Global Payment Players Race to Define "AI Agent Identity": KYA Emerges

On September 10, Ant International, Mastercard, and Visa jointly announced they are developing a Know-Your-Agent (KYA) interoperability framework, aimed at establishing a common industry standard for identifying and verifying AI agents that can make purchases on a user's behalf. The three companies emphasized the framework will be built on shared principles while each network retains its own verification and decisioning processes. ([Asian Banking & Finance](https://asianbankingandfinance.net/cards-payments/news/ant-mastercard-visa-build-common-ai-agent-identity-framework))

This news landed almost simultaneously with NPCI's plan in India, but the two follow completely different logics: NPCI is a national payment rail imposing a single agent protocol top-down; KYA is a coalition of private cross-border payment networks coordinating an interoperable standard bottom-up. Whether these two paths converge or diverge over the next few months is worth watching closely.

## Deep Dive

I believe the most notable signal this week, viewed through Porter's Five Forces, is about who gets to define the rules for an AI agent's spending rights.

**Supply side**: NPCI directly controls UPI, India's largest payment rail — meaning it holds the gatekeeping power over this new "agent payments" market. Any company that wants to do agentic commerce in India will ultimately have to pass certification under NPCI's protocol. This is fundamentally different from the U.S. or Europe, where no single national payment company can unilaterally define how AI agents spend money — which is exactly why Visa, Mastercard, and Ant had to cobble together a cross-industry KYA framework instead. India's centralized national-infrastructure path is inherently faster than the decentralized industry-coalition path: it doesn't require coordinating multiple stakeholders' interests — one institution can simply decide and ship.

**Threat of substitutes**: Startups like Gnani building "sovereign AI stacks" are betting on the assumption that Indian enterprises — especially in finance — will prioritize locally built AI over directly calling OpenAI/Anthropic APIs, due to data sovereignty and regulatory requirements. If NPCI's agent payment protocol goes live and requires in-country data processing, companies like Gnani stand to benefit directly, since they're already positioned as the default compliant option.

**Barriers to entry**: Once NPCI's protocol is finalized, any foreign company wanting to do agentic commerce in India will have to comply with India's agent registration and verification rules — effectively turning "regulatory compliance" into a natural protective wall for local vendors.

## Takeaways for Taiwanese Entrepreneurs

- **If you're building cross-border payments or e-commerce agents**: What's emerging in India is a *state-mandated* agent payment protocol, not a market you can enter by freely wiring up APIs. Taiwanese teams eyeing India should start tracking NPCI's formal spec now rather than waiting until it launches — being a step behind could mean redoing your entire authorization flow
- **If you're building AI infrastructure or identity verification**: The cross-network "AI agent identity standard" represented by KYA is a gap a Taiwanese intermediary service could fill — offering "agent identity verification as a service" for small merchants or platforms that don't want to individually integrate Visa's, Mastercard's, and Ant's separate specs
- **If you're building enterprise AI deployments**: Gnani Artha's playbook (sovereign AI stack + vertical industry customization) is worth studying for Taiwanese B2B AI startups — Taiwan faces similar regulatory pressure around data localization in finance (FSC's cloud service rules). Rather than competing head-on on raw model capability, following Gnani's approach of competing on "the compliant default" may be a stronger position

## Key Insight

I used to assume India's AI agent ecosystem would follow the same pattern as other emerging markets — a race to see which startup has the strongest model. After reading about NPCI's Unified Agent Protocol this week, I realized India is taking a completely different path: it isn't competing on model capability at all, but using control over the UPI payment rail itself as the gatekeeping mechanism. That explains why India's agent-commerce business will ultimately be decided by payment infrastructure, not model leaderboards.

## References

- [startupfeed.in — NPCI Builds Unified Agent Protocol for AI Payments on UPI](https://startupfeed.in/npci-unified-agent-protocol-ai-payments-upi)
- [Forkast — India Eyes AI-Driven UPI Payments as NPCI Weighs Agent Protocol](https://forkast.news/india-eyes-ai-driven-upi-payments-as-npci-weighs-agent-protocol/)
- [Inc42 — GFF 2026: Fintech-AI Partnerships Take The Centre Stage On Day 2](https://inc42.com/buzz/gff-2026-fintech-ai-partnerships-take-the-centre-stage-on-day-2/)
- [Gnani.ai — Gnani Artha Sovereign AI Stack for India](https://www.gnani.ai/artha-sovereign-ai)
- [Asian Banking & Finance — Ant, Mastercard, Visa build common AI agent identity framework](https://asianbankingandfinance.net/cards-payments/news/ant-mastercard-visa-build-common-ai-agent-identity-framework)
