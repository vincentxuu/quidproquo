---
title: "The Other End: Why Always-On Agents So Often Stall at the Last Step, and How Websites and Businesses Are Handling Them"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, agentic-commerce, payments]
lang: en
tldr: "When an agent gets stuck at the last step, the cause is often not the agent but the other end. There are three layers where it can stall: whether the site recognizes it (sites have blocked bots by default for decades, and Amazon blocked Muse for not identifying itself as an agent), whether checkout supports it (payment systems assume a person is pressing \"buy\"), and whether the business wants it there at all (ad revenue, customer relationships). The fixes being built also come in three layers: letting agents identify themselves with cryptographic signatures (Web Bot Auth, Visa's Trusted Agent Protocol), proving what you agreed to with signed authorizations (Google's AP2, Mastercard Agent Pay), and having merchants open their checkout directly to agents (UCP). Taiwan completed its first authenticated agentic transaction in March 2026."
description: "The three layers where always-on agents stall at the other end: site bot detection and Amazon's block on Muse, checkout and payment flows, and businesses' commercial interests; how Gemini discloses it's an AI when it calls; which layer Web Bot Auth, Cloudflare's agent categories, Visa's Trusted Agent Protocol, Google's AP2 and UCP, and Mastercard Agent Pay each address; Taiwan's first agentic transaction; and how to tell whether a stuck agent was blocked by the site, hit an unsupported payment flow, or failed on its own."
series:
  name: "Always-On AI Agents"
  order: 22
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-the-other-end)

| Where it stalls | Common symptoms | Fixes being built |
|---|---|---|
| Whether the site recognizes it | CAPTCHAs, access denied, pages that won't load | Web Bot Auth, Cloudflare's agent categories |
| Checkout and payment | Gets to the payment page, then hands the screen back to you | AP2, Mastercard Agent Pay, single-use cards |
| Whether the business wants it | An explicit "unauthorized AI agent" message | Partnerships, merchants opening checkout to agents (UCP) |

On the evening of September 20, 2026, people using Meta Muse to shop on Amazon started seeing a popup:

> Continued access by an unauthorized AI agent violates Amazon's Conditions of Use, to which our customers have agreed.

According to [GeekWire](https://www.geekwire.com/2026/Amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/), Amazon said it first tried to get Meta to voluntarily exclude Amazon, and only blocked Muse when that failed. Amazon gave three reasons: Meta never told it Muse would access its store, Muse doesn't identify itself as an agent when browsing, and it appears to capture and store customer credentials.

The two companies are actually partners: Amazon products have been buyable inside Facebook and Instagram since 2023, and in April Meta signed a multibillion-dollar deal to run AI workloads on Amazon's chips.

This post is about the other end: why always-on agents so often stall at the last step, and how websites and businesses are handling them.

## Layer 1: does the site recognize it?

Google admits this itself in [its Tasks in Gemini announcement](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/):

> On some sites, Gemini can make it most of the way through and then hand the screen back to you to click the final button.

The next sentence gives the reason: for decades, sites have blocked bots by default because most were malicious. To a website, a personal agent looks a lot like a crawler or an attack script: an automated program clicking through pages.

Cloudflare, one of the world's largest website protection services, shows how sites' stance is changing. [Its July 2026 announcement](https://blog.cloudflare.com/content-independence-day-ai-options) splits AI traffic into three categories: search, agent and training. From September 15, new domains block agent and training traffic by default on pages with ads, while search stays allowed. Cloudflare's reasoning: an ad signals that the site owner wants a person to land there, so on those pages it treats human attention as the goal and keeps away bots that might replace it.

At the same time, Cloudflare is giving agents a way to identify themselves. [Its docs](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/) define a "verified bot" as one that meets two bars: it honestly declares who it is, through a cryptographic signature or similar, and it doesn't abuse the access that honesty earns, for example by respecting crawl rules. It also labels agents in two ways:

- **Direct**: a bot run by a single operator, such as a search engine's crawler.
- **Intermediary**: an agent service many users can operate. The operator runs the software, but each action is initiated by a different user.

Always-on agents fall into the second group. Cloudflare points out that this creates a problem of "transitive trust": a site may trust OpenAI or Google as the operator, but not necessarily every person giving instructions behind it.

When things stall at this layer, the symptoms are usually CAPTCHAs, access denied, or pages that won't load. In [AIMultiple's nine-day test](https://aimultiple.com/always-on-agents), OpenClaw, running on AIMultiple's own server, was blocked by several sites and had to be dropped from the results.

## Layer 2: checkout and payment

Even if the site lets the agent in, the payment step is another hurdle.

When Google announced the [Agent Payments Protocol (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol) in 2025, it laid out the problem clearly: today's payment systems assume a person is directly clicking "buy" on a trusted surface. Agents that can initiate payments break that assumption and raise three questions:

- **Authorization**: how do you prove the user really authorized the agent to make this purchase?
- **Authenticity**: how can a merchant be sure the agent's request reflects the user's true intent?
- **Accountability**: who is responsible when a transaction goes wrong or is fraudulent?

AP2's answer is evidence in the form of cryptographically signed "mandates":

- **When you're present**: you say "find me white running shoes," and that request is recorded as an intent mandate. The agent shows a cart; when you approve, you sign a cart mandate that locks in the exact items and price.
- **When you're not present**: you sign a detailed intent mandate in advance, setting price limits, timing and conditions, for example "buy concert tickets the moment they go on sale." Only when the conditions are met can the agent generate a cart mandate from it.

Card networks are building their own versions. Mastercard's [Agent Pay](https://www.mastercard.com/news/ap/zh-tw/%E6%96%B0%E8%81%9E%E4%B8%AD%E5%BF%83/%E6%96%B0%E8%81%9E%E7%A8%BF/zh-tw/2026/mar/%E8%90%AC%E4%BA%8B%E9%81%94%E5%8D%A1%E6%94%9C%E6%89%8B%E6%98%9F%E5%B1%95%E9%8A%80%E8%A1%8C-%E5%8F%B0%E7%81%A3-%E5%AE%8C%E6%88%90%E7%AC%AC%E4%B8%80%E7%AD%86%E4%BB%A3%E7%90%86%E5%BC%8Fai%E6%94%AF%E4%BB%98%E4%BA%A4%E6%98%93/) (in Chinese) issues a separate token for each agent so its identity can be recognized and verified. [In an interview](https://www.cio.com.tw/118271/) (in Chinese), Mastercard Taiwan's managing director explained that merchants, acquirers and agents never see the real card number, only a one-time or purpose-specific token. If what the agent does drifts from the intent you authorized, the system can stop it on the spot.

Products earlier in this series take a simpler approach: Muse and Instinct use single-use Stripe Link cards, with each amount approved by you.

When things stall at this layer, the agent usually gets all the way to the payment page and then hands the screen back to you, or stops and waits for you to enter something. That's not necessarily a bug; often it's deliberate. Gemini's announcement says it's designed to ask for your confirmation before clicking "buy."

**Taiwan's progress**: [on March 26, 2026](https://www.cna.com.tw/news/afe/202603260084.aspx) (in Chinese), Mastercard and DBS Bank (Taiwan) completed Taiwan's first authenticated agentic AI transaction under the Agent Pay framework. A consumer asked an AI in conversation to book an airport transfer; after choosing an option, the AI paid with the linked card. This was a demonstration transaction, not a sign that Taiwanese merchants broadly support it.

## Layer 3: does the business want it?

Even when the agent can be recognized and payment works, there's one more layer: whether the business wants agents there at all.

Amazon is the clearest example. [GeekWire's follow-up analysis](https://www.geekwire.com/2026/amazons-fight-with-meta-who-owns-the-customer-relationship-when-an-agent-does-the-buying/) points to several commercial factors:

- **Advertising**: Amazon's ad revenue topped $68 billion last year, and depends on people browsing pages and seeing sponsored products. An agent that jumps straight to checkout means nobody sees those pages.
- **The customer relationship**: when an agent buys on someone's behalf, who owns the customer? Zuckerberg said Muse would take a small cut of each transaction, potentially paid by the seller.
- **Its own agent**: Amazon's Buy for Me buys from outside brands' websites on people's behalf. Amazon says the difference is that Buy for Me identifies itself and lets brands opt out.

The legal picture isn't settled either. Amazon sued over Perplexity's Comet browser and won a preliminary injunction. But in August, the US Court of Appeals for the Ninth Circuit found that under federal anti-hacking law it was the user, not the AI company, accessing Amazon's computers, and the injunction was lifted. The court left one avenue open: claims based on contracts and terms of service. When Amazon blocked Muse, it cited exactly that: its Conditions of Use.

When things stall at this layer, the symptom is usually the clearest of all: the site tells you outright that unauthorized AI agents aren't allowed.

## Phone calls: disclose that it's an AI first

It's not only websites. When an agent calls a business, the same questions apply: was the other side told, and can it refuse?

Google's approach is set out in [Gemini's help page](https://support.google.com/gemini/answer/18961634?hl=en):

- Every call starts by disclosing that it's an AI assistant from Google calling on a recorded line on your behalf.
- It only calls Google-verified US businesses, and businesses can opt out at any time.
- It won't share payment or sensitive account details over the phone.
- Several US states' regulations bar it from placing automated calls there.
- If the business asks for something that isn't in your plan, it ends the call and tells you what happened.

That points the same direction as Amazon's demands: identify yourself, and let the other side choose.

## Giving agents an identity

The fixes above share one idea: letting the other end know whose agent this is, whom it represents, and what it's authorized to do. Several approaches are developing:

- **The website layer**: Web Bot Auth lets an agent attach a cryptographic signature to every request. [Visa's Trusted Agent Protocol](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html), developed with Cloudflare, builds on that foundation. With it, an agent can tell a merchant that it's a trusted agent with intent to buy, whether this customer has an account there, and how it will pay. [Cloudflare's announcement](https://www.cloudflare.net/news/news-details/2025/Cloudflare-Collaborates-with-Leading-Payments-Companies-to-Secure-and-Enable-Agentic-Commerce/default.aspx) says Mastercard and American Express will use the same signatures.
- **The account layer**: as covered in [order 13](/posts/ai/2026-11-20-openclaw-enterprise-en), OpenAI gives each internal agent its own identity, separate from the user's. OpenAI's post also mentions emerging specifications such as WAG, which gives agents their own access to resources, and XAA, which lets agents act on the user's behalf through OAuth delegation.
- **The merchant layer**: in January 2026 Google launched the [Universal Commerce Protocol (UCP)](https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/), developed with Shopify, Etsy, Wayfair, Target and Walmart. Merchants expose capabilities like product discovery and checkout directly to agents, so agents don't have to click through web pages, and merchants remain the seller of record. As covered in [order 16](/posts/ai/2026-11-20-super-app-agents-en), LINE Shopping is also connecting across platforms through UCP.

Super apps take a different route. As [order 16](/posts/ai/2026-11-20-super-app-agents-en) covered, Naver's agent uses internal APIs for its own services and an isolated browser only for outside sites. When the service is your own, there's no "does it recognize the agent" problem.

## When an agent gets stuck, which end is the problem?

Next time your agent stops partway, check the symptoms in this order:

| Symptom | Most likely cause | What you can do |
|---|---|---|
| CAPTCHAs, "access denied," pages that keep loading | The site blocks bots | Use a site with an official integration, or do that step yourself |
| The site explicitly says "unauthorized AI agent" | The business doesn't allow agents | You can't use an agent here; buy it yourself |
| Reaches the payment page and hands the screen back | The product wants your confirmation, or the payment flow doesn't support it | Check the details and press it yourself; it's not a bug |
| Payment fails or the card is declined | The issuer's fraud checks, or a single-use card's limit is too low | Check the authorized amount; contact the issuer |
| Wrong item, wrong details, wrong site | The agent itself | That's the agent's mistake; report it to the vendor |
| Keeps retrying the same step without reporting | The agent is stuck in a loop | Stop the task and check its log |

The first three are problems at the other end, and switching agents usually won't help; the last two are the agent's own problems, worth reporting.

## When it tends to work, and when it doesn't

**Situations more likely to go smoothly now:**
- Buying where there's an official integration: checkout through UCP in Google's AI Mode, or a super app's own services.
- Only researching and comparing prices, then doing the last step yourself.
- Calling US businesses that accept AI calls.

**Situations more likely to stall now:**
- Letting an agent click through checkout on a large e-commerce site, especially one that explicitly refuses outside agents.
- Sites that require login or show CAPTCHAs.
- Taiwanese merchants: agentic payments are still at the demonstration stage.

In Taiwan, Mastercard Agent Pay has completed a first demonstration transaction; LINE Shopping is connecting through UCP, but its shopping assistant isn't planned until 2027.

The merchant is the seller of record, and payment protocols keep a record of who authorized what. Those rules at the other end directly decide who is responsible when something goes wrong. [Next: responsibility](/posts/ai/2026-11-20-who-is-liable-en).

## References

- [Amazon blocks Meta's Muse AI assistant in new standoff over agentic shopping](https://www.geekwire.com/2026/Amazon-blocks-metas-muse-ai-assistant-in-new-standoff-over-agentic-shopping/) (GeekWire, 2026-09-20)
- [Amazon's fight with Meta: Who owns the customer relationship when an agent does the buying?](https://www.geekwire.com/2026/amazons-fight-with-meta-who-owns-the-customer-relationship-when-an-agent-does-the-buying/) (GeekWire, 2026-09-22)
- [Put Gemini to work for you](https://blog.google/innovation-and-ai/products/gemini-app/tasks-in-gemini-free-new-features/) (Google, 2026-11-17)
- [Ask Gemini to make phone calls to businesses](https://support.google.com/gemini/answer/18961634?hl=en) (Gemini Apps Help)
- [Your site, your rules: new AI traffic options for all customers](https://blog.cloudflare.com/content-independence-day-ai-options) (Cloudflare, 2026-07-01)
- [Verified bots](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/) (Cloudflare docs)
- [Announcing Agent Payments Protocol (AP2)](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol) (Google Cloud, 2025-09-16)
- [Under the Hood: Universal Commerce Protocol (UCP)](https://developers.googleblog.com/en/under-the-hood-universal-commerce-protocol-ucp/) (Google Developers, 2026-01-11)
- [Visa Unveils Trusted Agent Protocol for AI Commerce](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/visa-unveils-trusted-agent-protocol-for-ai-commerce.html) (Visa, 2025-10-14)
- [Cloudflare Collaborates with Leading Payments Companies to Secure and Enable Agentic Commerce](https://www.cloudflare.net/news/news-details/2025/Cloudflare-Collaborates-with-Leading-Payments-Companies-to-Secure-and-Enable-Agentic-Commerce/default.aspx) (Cloudflare, 2025-10-14)
- [萬事達卡攜手星展銀行（台灣）完成第一筆代理式AI支付交易](https://www.mastercard.com/news/ap/zh-tw/%E6%96%B0%E8%81%9E%E4%B8%AD%E5%BF%83/%E6%96%B0%E8%81%9E%E7%A8%BF/zh-tw/2026/mar/%E8%90%AC%E4%BA%8B%E9%81%94%E5%8D%A1%E6%94%9C%E6%89%8B%E6%98%9F%E5%B1%95%E9%8A%80%E8%A1%8C-%E5%8F%B0%E7%81%A3-%E5%AE%8C%E6%88%90%E7%AC%AC%E4%B8%80%E7%AD%86%E4%BB%A3%E7%90%86%E5%BC%8Fai%E6%94%AF%E4%BB%98%E4%BA%A4%E6%98%93/) (Mastercard, 2026-03-26, in Chinese)
- [萬事達卡：台灣首筆AI代理交易完成](https://www.cna.com.tw/news/afe/202603260084.aspx) (CNA, 2026-03-26, in Chinese)
- [萬事達卡台灣區董事總經理陳懿文：Agentic Commerce 時代 重塑金融信任架構](https://www.cio.com.tw/118271/) (CIO Taiwan, 2026-08-07, in Chinese)
- [Always-On Agents: Claude Duet vs Dots vs Grok Bot](https://aimultiple.com/always-on-agents) (AIMultiple, 2026-11-16)
