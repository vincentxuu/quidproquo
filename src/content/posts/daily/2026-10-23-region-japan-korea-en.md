---
title: "Region Focus | Japan & Korea"
date: 2026-10-23
category: daily
tags: [ai-agent, region, daily, japan-korea]
lang: en
type: deep-dive
description: "BCG's AI Maturity Matrix 2026 places Japan and South Korea in the top 'AI Pioneer' tier; Seoul explicitly cites China's proposed export curbs as the reason to accelerate 'full-stack sovereign AI,' while SoftBank and Samsung connect cross-vendor telecom agents over the A2A protocol"
tldr: "BCG's new AI Maturity Matrix 2026 shows Japan and South Korea both advancing into the top 'AI Pioneer' tier this year, joining Canada, China, Singapore, the UK and the US, with the report naming execution speed — not ambition — as this year's dividing line; a South Korean presidential AI strategy official publicly cited China's proposed export curbs on 40 advanced technologies as the reason to accelerate a 'full-stack sovereign AI' strategy; SoftBank and Samsung Electronics connected their independently operated telecom AI agents using the Google-originated, Linux Foundation-stewarded A2A protocol (plus its telecom extension A2A-T), demonstrating cross-vendor collaboration in a stadium-congestion scenario; the same week, China tightened export controls on its top AI models, clouding the international availability of openly licensed models like Qwen and DeepSeek."
series:
  name: "AI Region Focus"
  order: 17
---

## Region: Japan & Korea

This week's throughline in Japan and Korea wasn't a new model launch — it was the first time an outside report formally certified "national-level AI execution capability," while South Korean officials tied the urgency of that capability directly to an external pressure point: China's export controls.

## Key Developments This Week

### BCG: Japan and South Korea Enter the "AI Pioneer" Tier — Execution, Not Ambition, Is the Dividing Line

Boston Consulting Group (BCG) released *The AI Maturity Matrix 2026* on October 20, evaluating AI readiness across more than 75 economies on BCG's six-dimension ASPIRE framework (Ambition, Skills, Policy, Investment, Research, Ecosystem). The report found that eight economies moved up a full readiness tier since the first edition in 2024, with Japan and South Korea both reaching the top "AI Pioneers" tier — joining Canada, Mainland China, Singapore, the UK, and the US. ([BCG via PR Newswire](http://www.prnewswire.com/news-releases/execution-not-ambition-now-separates-ai-economies-as-japan-and-south-korea-join-the-pioneers-302913365.html))

The report is specific about why each country advanced. Japan paired AI-friendly legislation with hyperscaler investment and partnerships with national champions, while also landing Anthropic's first Asia-Pacific office. South Korea bet on domestic model development, ranking in the global top five for notable AI models in Stanford HAI's 2026 AI Index, and channeled large-scale public investment into compute and the broader ecosystem. Joerg Hildebrandt, BCG's global Public Sector Practice leader and a report co-author, put it directly: "The economies that advanced this year show that state action is what turns AI ambition into readiness" — a strategy document alone doesn't count; what separates leaders is how fast a government can convert strategy into coordinated cross-agency action.

### Seoul: China's Proposed Export Curbs Add Urgency to "Full-Stack Sovereign AI"

Ha Jung-woo, vice chair of South Korea's Presidential Council on National AI Strategy, said on October 18 that China's plans to ban or restrict exports of 40 advanced technologies — AI among them — intensify US-China competition for global AI dominance and make it more urgent for South Korea to accelerate its "full-stack sovereign AI" strategy, both strengthening domestic capability and deepening international cooperation. ([MLex](https://www.mlex.com/mlex/articles/2539307/china-s-proposed-export-curbs-add-urgency-to-south-korea-s-ai-push-official-says))

The same week, the *New York Times* reported that China is tightening export controls on its top AI models, clouding the future international availability of openly licensed Chinese models such as Qwen and DeepSeek. ([The New York Times](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html)) Read together, these two stories show Seoul speaking more plainly than before about geopolitical risk: not "we also want sovereign AI," but "China's export policy shift directly changes our calculus between self-reliance and dependence."

### SoftBank × Samsung: Cross-Vendor Telecom Agents Collaborate via A2A to Solve Stadium Congestion

SoftBank published joint research with Samsung Electronics on October 15: each company runs an independent AI agent — SoftBank's Telco Agent handles overall network decisions, built around SoftBank's own Large Telecom Model (LTM); Samsung's Vendor Agent handles vendor-specific optimization and digital-twin simulation. The two agents exchange tasks, network requirements (expressed via TM Forum's TMF921 Intent API), and evaluation results over Agent2Agent (A2A) — the protocol Google originated and later contributed to the Linux Foundation — plus A2A-T, a telecom-specific extension TM Forum is standardizing. ([SoftBank R&D](https://www.softbank.jp/en/corp/technology/research/topics/235/))

The demo scenario is network congestion ahead of a large stadium event. SoftBank's Telco Agent first asks Samsung's Vendor Agent to keep load on Cell A at or below 60% while maintaining at least 50 Mbps throughput. The Vendor Agent evaluates the request and reports back that both conditions can't be met if only Cell A is controllable. The Telco Agent then expands the control scope to neighboring Cell B; the Vendor Agent re-optimizes across multiple cells (including beam parameters) and validates the result with its digital twin before returning a candidate configuration, which the Telco Agent approves and schedules — along with a rollback configuration — ahead of the event. The demo was shown October 14–15 at the Silicon Valley Future Wireless Summit 2026 in Mountain View, California.

What matters here isn't that two agents jointly solved a network problem — it's that neither SoftBank nor Samsung had to expose its optimization algorithms or simulation environment to the other. They exchange only tasks, conditions, and results. That "keep your IP, open only the collaboration interface" pattern is the realistic requirement for agent adoption across multi-vendor telecom networks.

## Deep Dive

I think Porter's Diamond Model — his framework for national competitive advantage — is the right lens for this week's Japan/Korea news, because BCG's report itself is evaluating national-level competitiveness rather than any single company's technical breakthrough.

**Factor conditions**: South Korea's bet on domestic model development, pushing into the global top five for notable AI models per Stanford HAI, is a classic factor-condition play — build modeling capability first, then worry about applications. Japan took a different path, externalizing its factor conditions by landing Anthropic's first APAC office and hyperscaler investment — attracting global leaders in rather than building everything domestically.

**Demand conditions**: The SoftBank-Samsung stadium demo is fundamentally driven by a real demand signal in Japan's telecom market — stadium-event network congestion is a concrete, recurring pain point, not a showcase built for its own sake.

**Firm strategy and industry structure**: South Korea's "full-stack sovereign AI" strategy and Japan's "bind to international partners + national champions" strategy form an interesting contrast — Korea is trying to keep every layer (chips, compute, models, applications) within controllable domestic reach, while Japan plugs directly into global supply chains at some layers (foundation models) and concentrates resources on deepening its existing strengths in manufacturing and robotics.

**Government**: BCG's report explicitly names government execution speed as this year's core differentiator, and Ha Jung-woo's statement translates an external threat (China's export curbs) directly into domestic policy urgency. This is the least-discussed corner of the Diamond Model, but it's the decisive one in this week's story: government isn't just providing subsidies or a regulatory environment — it's actively converting geopolitical risk into a narrative for domestic industrial policy.

## Takeaways for Taiwanese Founders

- **If you're building multi-agent collaboration for telecom or industrial automation**: the SoftBank-Samsung case proves that agents from different vendors don't need to share a model or framework — sharing a communication protocol (A2A/A2A-T) and an intent-description format (TMF921) is enough. If you're selling agents to telecom or manufacturing customers, confirm your agent can speak A2A before betting on your own framework becoming the industry standard
- **If your product depends on openly licensed Chinese models (Qwen, DeepSeek, etc.)**: China's tightening export controls on top models is a reminder that any business plan treating Chinese open-weight models as permanent free infrastructure needs a fallback — assess the risk that licensing terms could tighten, rather than betting your entire supply-chain resilience on one country's open-licensing policy staying unchanged
- **If you're planning a Japan or Korea go-to-market**: BCG's report shows the two countries taking different paths — Japan favors "bring in international partners + deepen manufacturing applications," Korea favors "full-stack self-reliance." Your GTM pitch can't be identical for both markets. In Japan, you can pitch becoming part of the local ecosystem; in Korea, be ready to answer how your technology reduces dependence on outside providers — a sovereignty framing that shapes the conversation there
- **If you work in policy research or market-entry assessment**: South Korea's public move to translate geopolitical risk (China's export curbs) into industrial-policy language is worth studying — Taiwan faces similar geopolitical narratives around its own semiconductor supply chain, and watching how Korea frames "risk" as "justification to accelerate investment" offers a useful reference for Taiwan's own policy communication

## Cognitive Delta

I used to think reports about countries "joining the AI Pioneer tier" were mostly PR-flavored ranking exercises. Reading through BCG's six-dimension framework this week, I realized it actually unpacks two genuinely different but equally valid paths — Japan importing, Korea building. National-level AI competitiveness, it turns out, isn't a single-metric leaderboard; it's a strategic fork much like corporate strategy, between prioritizing factor conditions versus demand conditions. What surprised me more was Seoul publicly framing China's export curbs as a reason to accelerate domestic policy — a reminder that geopolitical risk is no longer just something analysts interpret after the fact; governments are now actively wielding it as a policy argument in real time.

## References

- [BCG via PR Newswire — Execution, Not Ambition, Now Separates AI Economies as Japan and South Korea Join the Pioneers](http://www.prnewswire.com/news-releases/execution-not-ambition-now-separates-ai-economies-as-japan-and-south-korea-join-the-pioneers-302913365.html)
- [MLex — China's proposed export curbs add urgency to South Korea's AI push, official says](https://www.mlex.com/mlex/articles/2539307/china-s-proposed-export-curbs-add-urgency-to-south-korea-s-ai-push-official-says)
- [The New York Times — China Tightens Its Grip Over Exports of Top AI Models](https://www.nytimes.com/2026/10/21/world/asia/china-moves-to-tighten-its-grip-over-exports-of-top-ai-models.html)
- [SoftBank R&D — Autonomous Network through AI Agent Collaboration with LTM — Joint Research with Samsung](https://www.softbank.jp/en/corp/technology/research/topics/235/)
