---
title: "Region Focus | China"
date: 2026-10-09
category: daily
tags: [ai-agent, region, daily, china]
lang: en
type: deep-dive
description: "Beijing's internet regulator investigates DeepSeek and Moonshot for routing user data through Claude; researchers spot an 'agent fleet' running on Tencent's infrastructure probing Alibaba's map API; China ships 16 new models in a month while nobody listens to Anthropic's call for a pause"
tldr: "China's Cyberspace Administration (CAC) has opened an investigation into DeepSeek and Moonshot AI over allegations the two companies routed Chinese users' requests through Anthropic's Claude to US servers without consent — a mirror image of Anthropic's February report accusing seven Chinese labs of 'illicit distillation.' Independent researchers monitoring domain-scanning traffic found an 'agent fleet' (not a swarm) running on Tencent's infrastructure, querying Alibaba's Amap mapping service for routes to parks, zoos, and hospitals, seemingly to sidestep Alibaba's API access rules. Nikkei and SCMP report China shipped at least 16 new models in September alone, with Anthropic CEO Dario Amodei's calls to slow down going completely unheeded."
series:
  name: "AI Region Focus"
  order: 14
---

## Region: China

The most notable thing in China's AI ecosystem this week isn't which model topped a leaderboard — it's that three separate stories all point to the same phenomenon: China's AI race is moving fast enough that its own regulator and its own tech giants are starting to trip over each other. The regulator is investigating a domestic company for leaking data abroad, Tencent's agents are brushing up against Alibaba's rules, and the industry shipped 16 new models in a month, drowning out any international call to pause.

## Key Developments This Week

### CAC opens an investigation into DeepSeek and Moonshot: Anthropic's "distillation" accusation gets a mirror image

China's Cyberspace Administration (CAC) was confirmed on 10/5 to have opened an investigation into DeepSeek and Moonshot AI, with officials visiting both companies to question executives and staff. The core question: did these two companies quietly route Chinese users' requests through Anthropic's Claude models to US servers without users' knowledge? If true, this could violate China's data security regulations. The investigation remains open, with no penalties handed down yet. (Source: [Yahoo News](https://www.yahoo.com/news/world/articles/china-probes-deepseek-moonshot-over-114601296.html))

The probe traces back to a 154-page threat-intelligence report Anthropic published on 9/10, accusing seven Chinese labs — Alibaba, Moonshot, DeepSeek, Zhipu, MiniMax, Xiaomi, and SenseTime — of "illicit distillation": routing customer requests through Claude en masse to harvest its outputs as training data. The report estimated roughly 190 million exchanges across the seven companies combined, with Alibaba alone accounting for 151 million; Moonshot pushed over 23 million exchanges between May and July, and DeepSeek generated 12.1 million in a single 14-day stretch in July. Interestingly, Alibaba's volume dwarfs Moonshot's and DeepSeek's, yet Alibaba isn't among the companies currently under investigation. The same set of facts is being read in opposite directions: Anthropic frames it as technology theft, while Beijing's concern runs the other way — data flowing out of the country.

### Researchers spot an "agent fleet" on Tencent's infrastructure, targeting Alibaba's mapping service

An independent research team published preliminary findings on 10/5 after monitoring traffic to the domain-scanning service urlquery, discovering AI agent activity that appears to run on Tencent's infrastructure, with queries concentrated on Alibaba's Amap mapping service — seeking directions to different entrances of parks, zoos, and hospitals. The researchers deliberately avoided the term "swarm," calling it an "agent fleet" instead: many parallel agents performing the same kind of task with no sign of coordination between them. This monitoring technique previously revealed months of OpenAI agent activity attacking online databases, part of a broader trend of agent traffic leaving traceable footprints on the internet. The researchers judged this fleet isn't doing anything more nefarious than sidestepping Alibaba's API access rules for now — but the case itself shows that AI agent activity between China's own internet giants is already leaving marks on each other's territory. (Source: [TechCrunch](https://techcrunch.com/2026/10/05/researchers-are-tracking-a-chinese-ai-agent-fleet/))

### 16 new models in a month: Anthropic says slow down, nobody's listening

Nikkei Asia reported on 10/7 that China's AI industry shipped at least 16 new models in September alone, spanning DeepSeek, Xiaomi, and others, with zero regard for Anthropic CEO Dario Amodei's repeated calls for the industry to slow frontier model development and take safety risks seriously. SCMP's analysis the same day captured the intensity of this "model fatigue": on 9/22, Xiaomi livestreamed the training run of MiMo-V2.6 while Anthropic released Opus 5.5, and an hour later OpenAI surprise-launched GPT-6 Sol and Luna — on the heels of major rollouts from Z.ai, DeepSeek, Tencent, Alibaba, and Moonshot. SCMP quotes analysts noting that while Silicon Valley is starting to discuss "model fatigue," China's hyper-competitive environment is experiencing the same phenomenon on steroids — release frequency so high that individual breakthroughs struggle to command attention. (Source: [Nikkei Asia](https://asia.nikkei.com/business/technology/artificial-intelligence/china-s-deepseek-peers-launch-16-ai-models-in-month-despite-anthropic-warning), [SCMP](https://www.scmp.com/tech/big-tech/article/3369757/chinas-ai-race-accelerates-model-fatigue-becomes-next-challenge))

## Deep Analysis

I think these three stories fit well into Porter's Five Forces, specifically "rivalry among existing competitors" and "threat of substitutes" — together they point to a counterintuitive conclusion: competitive intensity within China's AI industry has gotten high enough to start undermining the industry's own regulatory order and resource efficiency.

**Rivalry outpacing regulation**: CAC investigating a domestic company for routing data through a foreign competitor's model shows that even a regulatory system with theoretically stronger oversight capacity still finds out after the fact when competitive pressure pushes companies to route around rules using a rival's technology. This isn't unique to China — it's a symptom of the global AI race. What makes China's case particularly ironic is that the technology being routed through is owned by the same company accusing these labs of distillation.

**Rivalry spilling into each other's territory**: Tencent's agents leaving traces on Alibaba's mapping service matters less for how malicious the behavior is (the researchers themselves say they haven't found malicious intent) than for what it reveals: competition among China's major platforms, once mostly about user traffic and ecosystem lock-in, is now extending to a new front — whether your agents touch a competitor's API. As every company accelerates agent deployment for automation tasks, the odds of agents tripping over each other only rise, and this is hard to govern through traditional non-compete or data-protection clauses — an agent isn't an employee; it's just executing an assigned task.

**Resource misallocation from substitute threat**: Sixteen new models in a month, three companies launching on the same day — the underlying driver of this release cadence is fear of appearing to fall behind, which is a stronger force than genuine breakthroughs ready to ship. Amodei's call for a pause going unheeded isn't because the industry doesn't understand the risk; in a Five Forces framework, "pausing" amid white-hot rivalry is equivalent to voluntarily ceding market share. It's a classic prisoner's dilemma: everyone knows slowing down together would be better, but nobody wants to be the first to stop.

## Implications for Taiwanese Founders

- If your product depends on Chinese model APIs (DeepSeek, Qwen, Zhipu, etc.): CAC's investigation targets whether data flowed outside the country, not model capability itself — but it's a reminder to re-examine whether your architecture, if it routes user data through a third-party model proxy for cost or capability reasons, complies with the data protection rules of wherever your users are based. This isn't just a Chinese-company problem.
- If you're building agent-related security or monitoring tools: the fact that traffic through a third-party scanning service like urlquery can reveal agent activity shows agent footprints are more traceable than you'd think. Taiwanese teams building enterprise agent governance or anomaly detection should design around the assumption that agents inadvertently leave observable traces.
- If you're building model evaluation or selection services: a release cadence of 16 new models in a month means "which model is best right now" has a shelf life of maybe a few weeks. Offering continuous model evaluation and switching recommendations — rather than a one-time selection report — is worth more to clients under this pace than a static comparison article.

## Today's Cognitive Shift

I used to think China's AI regulatory narrative was mostly "the national team moves in lockstep, speaks with one voice externally." After reading about CAC investigating its own DeepSeek and Moonshot, I realized the gap between regulators and companies isn't fundamentally different from anywhere else — China's version is just unusually ironic: companies routed around rules using the very technology owned by the company accusing them of theft, and the regulator only found out from an external report. It turns out the pattern of "competitive pressure gets intense enough that companies cut corners, and regulators find out after the fact" happens under any system — only the specific corners being cut differ.

## References

- [AI Insider／Dapta — Did DeepSeek just get caught sending your data to Claude?](https://dapta.ai/blog-posts/ai-news-deepseek-claude)
- [Yahoo News — China probes DeepSeek, Moonshot over data routed through Claude](https://www.yahoo.com/news/world/articles/china-probes-deepseek-moonshot-over-114601296.html)
- [TechCrunch — Researchers are tracking a Chinese AI 'agent fleet'](https://techcrunch.com/2026/10/05/researchers-are-tracking-a-chinese-ai-agent-fleet/)
- [Nikkei Asia — China's DeepSeek, peers launch 16 AI models in month despite Anthropic warning](https://asia.nikkei.com/business/technology/artificial-intelligence/china-s-deepseek-peers-launch-16-ai-models-in-month-despite-anthropic-warning)
- [SCMP — AI overload? Why China's developers cannot stop launching model upgrades](https://www.scmp.com/tech/big-tech/article/3369757/chinas-ai-race-accelerates-model-fatigue-becomes-next-challenge)
- [Wikipedia — Anthropic (background timeline on the distillation accusations)](https://en.wikipedia.org/wiki/Anthropic)
