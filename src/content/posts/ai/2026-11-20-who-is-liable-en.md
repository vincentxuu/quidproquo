---
title: "Who Is Liable: When an Agent Buys or Sends the Wrong Thing, Who Bears the Loss, and How Far the Law Reaches"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, regulation, payments]
lang: en
tldr: "For now, the answer is mostly: you. Vendor terms treat an agent's actions as authorized by you (Anthropic, Instinct, Muse), with liability capped at $100 to $250. Between October and November 2026, major US banks changed their terms: if you let a third-party agent into your account, what it does, and even what someone does with leaked credentials, is on you. US card and transfer rules protect against \"unauthorized\" use, designed for stolen cards; handing an agent your own access looks more like lending a card to a family member who goes beyond what you allowed. Electronic transactions law requires the other side's automated system to give you a chance to correct errors, but that protects mistakes you make dealing with their system. Most always-on agents aren't offered in Europe, and vendors haven't said why. In Taiwan, the Financial Supervisory Commission issued a consultation paper in October and the Ministry of Digital Affairs says it will study an AI risk framework for e-commerce; there are no specific rules yet. This is not legal advice."
description: "Who bears the loss when an agent makes a mistake: how vendor terms put responsibility on users, new US bank terms (Citi, JPMorgan, Bank of America), why Reg Z and Reg E's definitions of \"unauthorized\" don't fit, what UETA's opportunity to correct errors actually protects, why most products aren't offered in Europe, Taiwan's FSC consultation paper and the Ministry of Digital Affairs' response, and what remedies to confirm before letting an agent touch money. Not legal advice."
series:
  name: "Always-On AI Agents"
  order: 23
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-who-is-liable)

**This post is not legal advice.** It summarizes vendor terms and the text of regulations; for an actual case, consult a lawyer or the relevant regulator.

| Who | Current position | Basis |
|---|---|---|
| Agent vendors | The agent's actions count as yours; compensation is capped | Each vendor's terms of service |
| Banks | If you let a third-party agent into your account, the consequences are yours | New terms at Citi and other banks |
| Card and transfer rules | They protect against "unauthorized" use; what you authorized doesn't count | US Reg Z, Reg E |
| The other side's automated system | Must give you a chance to correct errors | US UETA Section 10 |
| Taiwan | Still consulting and studying | FSC consultation paper, Ministry of Digital Affairs |

According to [TechCrunch](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/), Citibank, the third-largest commercial bank in the US, changed its online user agreement in mid-November. If you give a third-party AI tool your online banking credentials, or authorize it to access your account, anything that agent does counts as yours. Even if the AI tool leaks your credentials or gets hacked, what hackers do with them counts as yours too.

Citi wasn't the first. JPMorgan and Bank of America, the two largest US banks, announced similar policies in October; PNC changed its terms the same day as the report, and Citizens emailed customers with a similar warning.

This post is about liability: when an agent buys or sends the wrong thing, who bears the loss, and how far the law reaches.

## Layer 1: vendor terms

The products earlier in this series all point the same way: the agent's actions are yours.

- **Anthropic**: its [consumer terms of service](https://assets.claude.com/43c13f51a6d9755341433f79cf63c966ed9200ea.pdf) call what Claude does on your behalf "Actions" and state, "You are responsible for all Inputs you submit to our Services and all Actions." The terms also warn that Actions "may not be error free or operate as you intended."
- **Instinct**: as covered in [order 5](/posts/ai/2026-11-20-instinct-en), its terms say any action resulting from your instructions and context counts as authorized by you. Liability is capped at $100 or what you paid in the past six months, whichever is greater.
- **Muse**: as covered in [order 3](/posts/ai/2026-11-20-meta-muse-en), its supplemental terms put financial losses on you and leave transaction limits for you to set. Meta's liability is capped at $250 or what you paid in the past 12 months, whichever is greater; gross negligence, willful misconduct or fraud aren't subject to the cap.

So there's little to rely on at this layer: what vendors will pay is far less than what an agent can spend.

## Layer 2: banks and payments

The new bank terms go further than vendors. [Unite.AI summarizes Citi's terms](https://www.unite.ai/citi-makes-customers-responsible-for-third-party-ai-agent-activity/):

- If you provide credentials or permit a third-party agent to access your account, Citi treats its access and actions as authorized by you.
- If those credentials are later shared or leaked to other people or agents, actions using them also count as authorized by you.
- If the agent misreads your instructions, does something you didn't intend, or exceeds the authority you gave, you're responsible, except as applicable law provides otherwise; monitoring whether the agent gets things right is also your job.
- Citi can cut off an agent's access at any time without notice.
- AI tools Citi provides itself are excluded.

TechCrunch also notes another motive: AI tools could make it easier for customers to avoid unnecessary fees or low-interest deposits, and banks will want to control that pathway.

**Why the regulatory protections don't fit**

US credit cards and electronic transfers come with consumer protections. But they protect against "unauthorized" transactions, and the definitions matter:

- For credit cards, [Reg Z Section 1026.12](https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-B/section-1026.12): unauthorized use means use by a person other than the cardholder who doesn't have actual, implied or apparent authority, and from which the cardholder receives no benefit. In that case the cardholder's liability is capped at $50.
- For electronic transfers, [Reg E Section 1005.2](https://www.ecfr.gov/current/title-12/chapter-X/part-1005/subpart-A/section-1005.2): transfers initiated by "a person who was furnished the access device to the consumer's account by the consumer" are explicitly excluded, unless you've told the bank that person is no longer authorized.

The [official interpretations](https://www.consumerfinance.gov/rules-policy/regulations/1026/2026-04-08/12/) of both give the same example: if you give your card to a family member or coworker and authorize them to use it, and they go beyond what you allowed, you're liable until you notify the bank.

Regulators haven't clearly classified agents yet, but handing an agent your own credentials or card and authorizing it to use them looks a lot like that example. That's my reading, not a court's or regulator's conclusion. In practice, merchant refunds and card disputes are still worth trying, but don't assume the regulations are on your side.

## Layer 3: the transaction with the merchant

The Uniform Electronic Transactions Act (UETA), adopted by 49 US states, has one section that comes up often. Using [the Massachusetts version](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter110G/Section10) as an example, Section 10 provides:

- In an automated transaction, a person makes an error while dealing with **the other party's** electronic agent. If that electronic agent didn't provide an opportunity to prevent or correct the error, the person can avoid the effect of the erroneous record.
- Conditions: promptly notify the other party on learning of the error, return or destroy what was received, and not have benefited from it.
- This section can't be varied by agreement.

That's why checkout pages have a "confirm your order" step: once the merchant's system offers a chance to correct, this protection no longer applies.

But note which way it points: it protects mistakes you make dealing with a merchant's automated system. When your own agent places the order and gets it wrong, whether that counts as "your error," and whether the merchant gave "you" a chance to correct it, is unsettled.

Payment protocols add evidence at this layer. AP2, covered in [order 22](/posts/ai/2026-11-20-the-other-end-en), records what you agreed to in signed mandates. [PayPal's explanation](https://developer.paypal.com/community/blog/PayPal-Agent-Payments-Protocol/) is direct: accountability is tied to real-world entities such as the user, merchant or issuer, not the agent. With those records, a dispute can at least establish whether the agent went beyond what you authorized.

## Europe: most products aren't offered

In Europe, most always-on agents haven't launched at all. [Dialogo's summary of vendors' help pages](https://www.dialogo.chat/blog/always-on-ai-agents-europe/) shows that as of November:

- Claude Duet: US only during the research preview.
- Dots: not on Pro or Plus plans in the EEA, Switzerland or the UK.
- Muse: no European country named.
- Gemini Spark (the predecessor of Tasks in Gemini): excludes the EEA.

None of the vendors has said why. Outside analyses point in a few directions, all inference:

- **Data protection law**: [one Norwegian author's analysis](https://hakon.berntsen.net/blog/always-on-agents-stop-at-the-border-claude-duet-europe) notes that always-on agents continuously read data about third parties who never agreed to anything, such as everyone who emails you. In a consumer account, the vendor sits close to being the GDPR controller. The UK and Switzerland, outside the EU, are excluded too; the author reads that as reflecting their similar data protection laws.
- **The Digital Markets Act**: [another analysis](https://technspire.com/en/blog/muse-and-the-eu-no-launch-date-no-dpa-and-your-options) points out that Meta is a designated gatekeeper under the DMA. Muse's features that combine personal data across Instagram and WhatsApp would need separate consent in the EU.

Under the AI Act, agents aren't a separate regulated category; the general rules for AI systems and general-purpose models apply.

## Taiwan: still consulting and studying

Taiwan has no specific rules on liability for agent transactions yet, but two things have happened.

**The FSC consultation paper**: on [October 13 the Financial Supervisory Commission issued a "Consultation Paper on the Secure Use of Agentic AI in the Financial Industry"](https://join.gov.tw/policies/detail/81468464-6f11-42b9-ab9b-8c31ee7995b7) (in Chinese), open for comment for 30 days. [The full document](https://www.ey.gov.tw/File/EA3264FE96515A4C?A=C) (in Chinese) contains several principles relevant here:

- It covers agents that financial institutions deploy themselves and that can operate business systems. Personal AI assistants that only organize information or draft content within a user's existing permissions don't need to follow it item by item; but if they can call tools autonomously, send things externally or write to systems, they should be reassessed.
- Irreversible, high-impact actions, or those with major effects on customers' rights, should keep human confirmation or review and shouldn't be left to the agent alone.
- Anything lacking necessary records, or that can't be stopped, revoked, recovered or traced, shouldn't be formally automated.

According to [CNA](https://www.cna.com.tw/news/afe/202610130306.aspx) (in Chinese), the FSC's director of information management said agentic AI should be treated as a digital employee, and the point is "what keys it holds and which doors it can open." The paper doesn't replace existing law and will move toward guidance in future, with no timeline.

**The Ministry of Digital Affairs' response**: according to the [Commercial Times](https://www.ctee.com.tw/news/20261112701825-431401) (in Chinese), at a November 9 meeting between the online retailers' association and the Ministry of Digital Affairs, momo's general manager said that when AI places orders or even pays for consumers, rules on authorization, liability and agent identity verification should be clarified early in case of wrong purchases or actions beyond what was authorized. The minister responded that the ministry would study an AI risk framework for e-commerce.

Both are early steps. For overseas always-on agents available to readers in Taiwan, what happens when something goes wrong still depends mainly on the vendor's terms and how your card issuer handles it.

## Before letting an agent touch money, confirm these

| What to confirm | Where to look | If the answer is bad |
|---|---|---|
| How much the vendor will pay | The liability cap in the terms | Only let it handle transactions below that amount |
| Which card or account it uses | The payment method you set in the agent | Switch to a single-use card or a low-limit card |
| How your bank views third-party agents | Your online banking terms | Don't give your banking credentials to an agent |
| Whether there's a confirmation screen before each transaction | The product's approval settings | Turn it on, and don't choose "always allow" |
| Whether there's a transaction record to reconcile | The product's activity log | Keep your own and check it against your card statement |
| Whom to contact when it goes wrong | The merchant's return policy, your issuer's dispute process | Try those two first; don't count on the agent vendor |

In short: what you can rely on is the merchant's return policy, your card issuer's dispute process, and the spending limits you set yourself. What you can't rely on is compensation from the agent vendor, or regulatory protection against "unauthorized" use.

## Lower-risk and higher-risk uses

**Uses better able to absorb the risk:**
- The agent can only read and can't move money.
- When money is involved, it uses only a single-use or very low-limit card, with your confirmation every time.
- Small transactions that can be returned.

**The highest-risk uses:**
- Giving your online banking credentials to an agent.
- Letting it pay automatically while you're away, with "always allow" selected.
- Using it for large, non-refundable transactions such as plane tickets or transfers.

In Taiwan, no specific law yet allocates liability for agent transactions; with overseas products, responsibility is set mainly by the vendor's terms and your card issuer.

Vendor terms and banks put the loss on you. That's the reason behind the next and final post in this series: start read-only, and use single-use cards when money is involved.

## References

- [More banks say customers using AI agents are on their own — even if they get hacked](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/) (TechCrunch, 2026-11-18)
- [Citi Makes Customers Responsible for Third-Party AI Agent Activity](https://www.unite.ai/citi-makes-customers-responsible-for-third-party-ai-agent-activity/) (Unite.AI, 2026-11-18)
- [Consumer Terms of Service](https://assets.claude.com/43c13f51a6d9755341433f79cf63c966ed9200ea.pdf) (Anthropic)
- [12 CFR 1026.12 Special credit card provisions](https://www.ecfr.gov/current/title-12/chapter-X/part-1026/subpart-B/section-1026.12) (eCFR)
- [12 CFR 1005.2 Definitions](https://www.ecfr.gov/current/title-12/chapter-X/part-1005/subpart-A/section-1005.2) (eCFR)
- [§ 1026.12 Official interpretation](https://www.consumerfinance.gov/rules-policy/regulations/1026/2026-04-08/12/) (CFPB)
- [Massachusetts General Laws Chapter 110G, Section 10](https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXV/Chapter110G/Section10) (UETA, Massachusetts version)
- [Agent Payments Protocol: Building Verifiable Trust for Agentic Commerce](https://developer.paypal.com/community/blog/PayPal-Agent-Payments-Protocol/) (PayPal, 2025-09-16)
- [Dots, Duet, Spark and Muse in Europe: What Works Today](https://www.dialogo.chat/blog/always-on-ai-agents-europe/) (Dialogo, 2026-11-15)
- [Why Always-On AI Agents Stop at the Border](https://hakon.berntsen.net/blog/always-on-agents-stop-at-the-border-claude-duet-europe) (Håkon Berntsen, 2026-10-29)
- [Muse and the EU: no launch date, no DPA, and your options](https://technspire.com/en/blog/muse-and-the-eu-no-launch-date-no-dpa-and-your-options) (Technspire, 2026-09-28)
- [金管會發布「金融業運用代理AI安全諮詢文件」，徵詢各界意見](https://join.gov.tw/policies/detail/81468464-6f11-42b9-ab9b-8c31ee7995b7) (Public Policy Participation Platform, 2026-10-13, in Chinese)
- [金融業運用代理 AI 安全諮詢文件](https://www.ey.gov.tw/File/EA3264FE96515A4C?A=C) (FSC, in Chinese)
- [盯新興風險 金管會發布金融業運用代理AI諮詢文件](https://www.cna.com.tw/news/afe/202610130306.aspx) (CNA, 2026-10-13, in Chinese)
- [AI代理購物買錯誰負責？電商業者提4建言 數發部回應了](https://www.ctee.com.tw/news/20261112701825-431401) (Commercial Times, 2026-11-12, in Chinese)
