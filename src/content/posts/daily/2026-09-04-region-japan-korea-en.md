---
title: "Region Focus | Japan & Korea"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, region, daily, japan-korea]
lang: en
description: "South Korea's government subsidizes SK Telecom, KT, and Kakao to build a national AI agent fleet, while KT sells its new Agent Connector into Woori Bank the same week; LINE Yahoo forms a cross-company task force to 10x Agent i production; SoftBank ties up OpenAI with $5.5B in warrants to prop up SB Energy's IPO"
tldr: "South Korea's Ministry of Science and ICT designated SK Telecom, KT, and Kakao consortiums to build free, nationwide AI services, with the government supplying 512 Nvidia B200 GPUs this year -- and KT was selected the same week to rebuild Woori Bank's AI chatbot with its new Agent Connector solution. LINE Yahoo launched a company-wide task force on 9/1 to expand Agent i from 27 to 40 domain agents by October and 10x its development pace. NTT Data partnered with Palo Alto Networks on joint AI-security services targeting $1B in combined business by 2029. SoftBank's SB Energy issued OpenAI roughly $5.5B in warrants to secure it as an anchor data-center tenant, underscoring how much financial leverage still underpins this wave of Japan-Korea AI infrastructure."
series:
  name: "AI Region Focus"
  order: 3
---

> 🌏 [中文版](/posts/daily/2026-09-04-region-japan-korea)

## Region: Japan & Korea

This week's common thread across Japan and Korea is the "national team" model: governments and telecom/platform giants are pushing AI agents as public infrastructure, at a pace and scale that outstrips organic market evolution. In the same week, SoftBank's heavily leveraged warrant deal was a reminder of just how fragile the financing behind this infrastructure race can be.

## Key Developments

### South Korea Deploys 512 B200s to Build a National AI Agent Fleet; KT Sells the Same Playbook into Woori Bank

South Korea's Ministry of Science and ICT (MSIT) designated three consortiums -- SK Telecom, KT, and Kakao -- to build free, unlimited-use nationwide AI services. The government is supplying a combined 512 Nvidia B200 GPUs this year and plans to subsidize operating costs starting in 2027, targeting a nationwide launch by year-end. This isn't a generic chatbot: the government's requirement is agents that can actually execute tasks on users' behalf -- across public services, healthcare, finance, education, and housing. Kakao's approach uses KakaoTalk as the primary entry point, combining a general-purpose chatbot with agents that can handle reservations, applications, and payments, and plans to distribute specialized agents through a marketplace. ([Korea Herald](https://www.koreaherald.com/article/10855962))

The same week, KT announced it had been selected to rebuild Woori Bank's AI chatbot and consultation-bot systems -- the fourth of Korea's five major commercial banks to adopt a KT solution. KT is applying its newly launched "Agent Connector," which links chatbots, consultation bots, AI Banker, and AI agents so that context carries over when a customer switches channels, while letting agents handle actual banking tasks rather than just routing inquiries. ([Seoul Economic Daily](https://en.sedaily.com/technology/2026/08/31/kt-to-rebuild-woori-banks-ai-chatbot-and-consultation-bot), [The Elec](https://www.thelec.net/news/articleView.html?idxno=13469), [Herald Business](https://mbiz.heraldcorp.com/article/10856817))

Read together, the national policy and the KT-Woori Bank case show Korea isn't running a two-stage playbook of "government subsidizes, companies figure out deployment separately." The same telecom operators are building both the public and enterprise versions of agent infrastructure at once.

### LINE Yahoo Launches a Company-Wide Task Force to 10x Agent i's Development Pace

LY Corporation (LINE Yahoo) unveiled eight new agent prototypes to press on August 28, and announced that starting September 1 it was formally activating an "Agent i Cross-Company Task Force," led personally by CPO Shin Jun-ho. Official figures: since Agent i launched on April 20, 2026, its domain-agent count has grown roughly 4x in four months, from 7 to 27, with average daily active users reaching 12 million in June (about a tenth of Japan's population). The goal is to expand to 40 domain agents by October and spin off Agent i into a standalone app. ([LY Corporation official press release](https://www.lycorp.co.jp/ja/news/release/020773))

The confidence behind this "10x production" target comes from LINE's existing scale in Japan -- LINE's monthly active users passed 100 million in December 2025, and Yahoo! JAPAN has roughly 54 million monthly active users. LINE Yahoo doesn't need to acquire users from zero; it just needs to slot agents into entry points people already open every day.

### NTT Data Partners with Palo Alto Networks, Targeting $1B in Combined AI-Security Business by 2029

NTT Data and Palo Alto Networks announced a partnership to develop enterprise AI security services using autonomous agents for detection and response, targeting a combined $1 billion in joint business by the end of 2029. ([Nikkei Asia](https://asia.nikkei.com/spotlight/cybersecurity/japan-s-ntt-data-teams-with-us-company-on-ai-for-enterprise-cybersecurity2)) This echoes the KT-Woori Bank case: traditional systems integrators in both Japan and Korea (NTT Data, KT) are choosing "AI agent security and trustworthiness" as their pitch for enterprise customers, rather than competing on in-house model capability.

### SoftBank Ties Up OpenAI with $5.5B in Warrants to Prop Up a Not-Yet-Profitable SB Energy IPO

SoftBank's data-center subsidiary SB Energy issued OpenAI roughly $5.5 billion worth of warrants to secure it as an anchor tenant. SB Energy posted about $3.2 billion in net losses in the first half of 2026 on roughly $139 million in revenue, still mostly from its legacy energy business, and is now pursuing an IPO. Nvidia had earlier announced it would provide up to $105 billion in financing for the OpenAI data center SB Energy is building in Ohio. ([CNBC](https://www.cnbc.com/2026/09/01/sb-energy-ipo-softbank-open-ai-nvidia.html)) The three parties are now tightly bound together through cross-holdings and financing, meaning a large share of this data-center empire's revenue base rests on circular deals between affiliated companies rather than independently verified external demand.

## Deep Analysis

I think the most notable signal from Japan and Korea this week is a fork in "national team" strategies: Korea is running a public-private model of direct government subsidy plus telecom execution, while Japan is running a market-driven model of an incumbent (LINE Yahoo) mobilizing its own existing traffic internally -- but both are arriving at the same place, using administrative or platform power to artificially compress the time it takes agents to go from prototype to nationwide scale.

Applying Porter's Five Forces:

**The threat of new entrants is suppressed by both policy and existing traffic.** Korea's government directly designated SK Telecom, KT, and Kakao and backed them with GPU subsidies -- effectively using administrative power to pre-filter out potential independent startup competitors, since a Korean AI-agent startup without a telecom license or an existing user base has little chance of competing for the same scale of government resources for a national service. LINE Yahoo's 10x task force runs on the same logic: leaning on LINE's 100-million-plus monthly active users and Yahoo! JAPAN's existing entry points removes the single most expensive step for any startup -- acquiring users -- entirely.

**Supplier bargaining power is concentrated in chips and cloud capital.** Korea's government subsidy is 512 Nvidia B200s; SoftBank needs $105 billion in Nvidia financing to build the data center OpenAI wants. The real bottleneck in this Japan-Korea agent infrastructure race isn't the model or application layer -- it's who can secure chips and capital. SoftBank trading warrants for lease stability is, at its core, using equity rather than cash to retain a key customer upstream in a supply chain where bargaining power is asymmetric.

**The threat of substitutes is being suppressed by enterprise case studies instead.** Both the KT-Woori Bank and NTT Data-Palo Alto Networks cases package "agent context continuity and security" as procurement differentiators, using existing systems-integration relationships to lock in customers and make it harder for enterprises to switch agent vendors -- the same "switching-cost moat" logic observed in last week's China region focus, except here the lock-in point is an existing telecom or systems-integration contract relationship rather than an account or collaboration-platform ecosystem.

## Takeaways for Taiwan Founders

- If you're building agent products for enterprise finance or government digital services: the KT-Woori Bank case shows banks aren't going directly to AI startups -- they're going to existing systems integrators (KT) bundling "context continuity plus existing AICC experience" into a bid. If Taiwan's financial and telecom systems integrators (e.g. Chunghwa Telecom, the Institute for Information Industry ecosystem) adopt a similar playbook, independent agent startups trying to win banking customers need to decide whether to compete head-on or position themselves as the agent engine those integrators plug in.
- If your product depends on a single super-app channel (comparable to LINE or KakaoTalk's role in Japan and Korea): Taiwan has no domestic super-app of equivalent scale, and even though LINE is widely used in Taiwan, the gatekeeping power over that entry point sits with LINE, not a local team. Rather than copying the "built into the super-app" playbook, a more realistic path is open, MCP-style integration that lets your agent be called from multiple entry points instead of betting on one platform's traffic.
- If you're evaluating a data-center or AI-infrastructure investment or partnership: SB Energy's $5.5 billion warrant deal is a reminder that part of the financial structure behind this Japan-Korea infrastructure race rests on affiliated companies financing and leasing to each other in a loop. If a Taiwanese cloud or data-center operator wants to replicate a "trade equity for a big customer" model, ask upfront how much of the counterparty's revenue actually comes from this kind of circular dealing, rather than just looking at the headline contract value.

## Takeaway

I used to think Japan and Korea were lagging the US and China on AI agents mainly because of model capability. Looking at this week's developments, I now see their real strategic focus isn't the model layer at all -- Korea's government directly subsidizing telecoms to roll agents out as public infrastructure, and LINE Yahoo mobilizing its existing 100-million-plus user base internally for 10x production -- both regions are skipping the "build the strongest model first" step and going straight to using existing administrative power or traffic scale to push agents to the entire population. But SoftBank's $5.5 billion warrant deal is also a reminder that the financial foundation under this kind of administratively and capital-compressed diffusion speed may be less solid than model capability itself.

## References

- [Korea Herald — Korea picks SK Telecom, Kakao, KT to build free nationwide AI services](https://www.koreaherald.com/article/10855962)
- [Seoul Economic Daily — KT to Rebuild Woori Bank's AI Chatbot and Consultation Bot Systems](https://en.sedaily.com/technology/2026/08/31/kt-to-rebuild-woori-banks-ai-chatbot-and-consultation-bot)
- [The Elec — KT Wins Woori Bank AI Chatbot Upgrade Project](https://www.thelec.net/news/articleView.html?idxno=13469)
- [Herald Business — KT Corp selected to rebuild Woori Bank's AI chatbot system](https://mbiz.heraldcorp.com/article/10856817)
- [LY Corporation official press release — LINE Yahoo unveils eight new AI agent prototypes](https://www.lycorp.co.jp/ja/news/release/020773)
- [Nikkei Asia — Japan's NTT Data teams with US company on AI for enterprise cybersecurity](https://asia.nikkei.com/spotlight/cybersecurity/japan-s-ntt-data-teams-with-us-company-on-ai-for-enterprise-cybersecurity2)
- [CNBC — SB Energy IPO: AI data center play backed by SoftBank, OpenAI and Nvidia](https://www.cnbc.com/2026/09/01/sb-energy-ipo-softbank-open-ai-nvidia.html)
