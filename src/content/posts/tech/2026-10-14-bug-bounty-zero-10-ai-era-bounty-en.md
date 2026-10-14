---
title: "Bug Bounty for AI Products: What Google, OpenAI, Anthropic and Meta Accept, and What They Pay"
date: 2026-10-14
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - ai-security
  - prompt-injection
  - owasp
lang: en
description: "How to read the bug bounty page of an LLM or AI agent product and tell what is accepted, what is not, and roughly what it pays. Google, OpenAI, Anthropic and Meta, compared line by line against their official pages, with every cell sourced and gaps marked unverified."
tldr: "AI bounty pages mostly do not pay for what a model says (jailbreaks, hallucinations, harmful output). They pay when a model is made to act against someone else (actions and data theft through indirect prompt injection), and for ordinary bugs in the software around it. Google's AI VRP base rewards run from $100 to $20,000; OpenAI's Safety Bug Bounty ranges are $250 to $7,500 per report. Rules as read on 2026-10-14."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 10
---

> 🌏 [中文版](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty)

[The previous post](/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en) covered trusted execution environments. This one comes back to the more common situation: the target is an LLM product or an AI agent. How does a bug bounty work there? By the end you should be able to open any AI product's bounty page and tell which problems it accepts, which it does not, and roughly what it pays.

The short version first. Across the pages I read, AI-related problems fall into three piles:

1. **What the model said**: jailbreaks, harmful content, hallucinations. The main programs of all four companies do not pay for these, and point you to a different reporting channel.
2. **What the model was made to do to someone else**: outside content smuggles in instructions, and an agent changes a victim's data or leaks it. This is the new category AI bounty pages actually pay for.
3. **Ordinary software around the AI product**: web pages, APIs, authorization, browser extensions. These are priced like traditional bugs, and everything in [part 3](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en) and [part 4](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce-en) applies.

That grouping is my reading of the rules, not any company's wording. The evidence is in the tables below. All rules and amounts are as read on 2026-10-14; these programs change quickly, so check the original page before you start testing.

## How AI targets differ from a normal website

A traditional bug has a simple test: can you make the system do something it should not? An LLM adds a complication. The system's behavior depends on the text it reads, and that text can come from anyone.

The [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) (2025 edition) puts this first. Its definition of [LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) is that user prompts alter the LLM's behavior or output in unintended ways. It comes in two kinds: direct injection, where the user's own input changes the model's behavior, and indirect injection, where the model reads external content such as a website or a file and something inside that content changes its behavior. OWASP also says jailbreaking is a form of prompt injection, one where the model is made to disregard its safety protocols entirely.

OWASP classifies by what happens technically. Bounty pages ask something else: **did a real person get hurt, and did something cross a security boundary?** So the same technique, prompt injection, can earn nothing in one setting and be the top payout on the page in another. The table below maps OWASP's ten categories to the bounty text I found, and marks the rest unverified.

| OWASP category (2025) | What I found on bounty pages |
|---|---|
| LLM01 Prompt Injection | Indirect injection that causes actions or leaks is explicitly accepted by Google and OpenAI Safety; Meta's GenAI page says injection alone is not paid, and injection through a connected data source that leaks a victim's data is triaged as accessing private user content; making a model say odd things is not accepted by any of them |
| LLM02 Sensitive Information Disclosure | Leaking a victim's data is accepted by Google and OpenAI Safety; Meta's scope page is interested in training-data leaks, and its GenAI page lists read/write access to training data at up to $30k and leaking private user content at up to $130k |
| LLM03 Supply Chain | Unverified: no matching text on the pages I read |
| LLM04 Data and Model Poisoning | Unverified: same |
| LLM05 Improper Output Handling | Unverified: same |
| LLM06 Excessive Agency | No same-named entry; OpenAI Safety's agentic tools and Google's Rogue Actions describe the same kind of problem (my mapping, not the pages') |
| LLM07 System Prompt Leakage | Explicitly not accepted by Google (only when the content is not sensitive), OpenAI Safety and Meta's GenAI page; the last two attach no sensitivity condition |
| LLM08 Vector and Embedding Weaknesses | Unverified: same |
| LLM09 Misinformation | The hallucination family; explicitly not accepted by Google, OpenAI, Anthropic or Meta |
| LLM10 Unbounded Consumption | Closest is the DoS wording: Google accepts only persistent cross-user DoS; Anthropic and Meta list DoS as out of scope |

For OWASP, I checked the body text of LLM01, LLM02 and LLM07 only. For the other categories I confirmed just the name and the opening definition.

## The comparison: problem type, who accepts it, what it pays

Every cell below comes from the official page's own text, with a source code in the cell and a key after the tables. **Unverified** means the pages I read do not mention it. That does not mean it is accepted, and it does not mean it is rejected.

First, problems where a model is made to act or leak:

| Problem type | Google AI VRP | OpenAI | Anthropic | Meta |
|---|---|---|---|---|
| Indirect prompt injection that makes an agent change a victim's data or act for them | Accepted, S1 Rogue Actions: flagship $20,000, standard $15,000, other $10,000 [G] | Safety's Agentic Tools accepts it: P1 $5,500–$7,500 down to P4 $250–$500 [O2]; Security's Codex section does not, unless a separate security boundary is also broken; but under the ChatGPT target, "Application-layer prompt injection mitigations" says OpenAI is interested in plausible, low-interaction attack chains that move user data to a third party, which must be grounded in the application layer, and it does not accept reports about mitigations inside the models themselves [O1] | Unverified | Prompt injection alone is not paid; prompt smuggling (a third party's string appears to the agent as a user or system prompt, reproducibly) up to $5k, and triggering privileged actions such as financial ones without human confirmation up to $20k [M2] |
| Leaking a victim's personal or sensitive data | Accepted, S2 Sensitive Data Exfiltration: flagship and standard $15,000, other $10,000 [G] | Accepted by Safety, same price table as above [O2] | Unverified | Up to $130k*: leaking user conversations, connector data (email, calendar) and PII, or third-party OAuth tokens; prompt injection through a connected data source that exfiltrates a victim's data is triaged into this category. Attacks needing unrealistic user interaction are currently not paid [M2] |
| Extracting training data, model parameters or reasoning | Only "complete, detailed and confidential model parameters", A2 Model Theft: flagship $5,000, standard $500; training corpora are almost always non-confidential and out of scope [G] | Safety accepts returning full, unsummarized chain of thought, same price table [O2]; academic research on weights and training data may be rewarded in very limited cases, papers go by email [O1] | Unverified | Scope page lists it as of interest (leaking training data via model inversion or extraction attacks) [M]; the GenAI page's "access to sensitive internal Meta data" pays up to $30k*, with examples including read/write access to training data and proprietary model weights and architecture [M2] |
| Extracting the system prompt | Not accepted unless it contains sensitive, non-public information [G] | Safety: system prompts and other context-window content (except chain of thought) are out of scope [O2] | Unverified | Prompt injection that results in system prompt extraction is not paid [M2] |

Then problems about what the model said, and the software around it:

| Problem type | Google AI VRP | OpenAI | Anthropic | Meta |
|---|---|---|---|---|
| Jailbreaks, harmful content | Not accepted; use in-product reporting [G] | Not accepted by either program, no reward; use the Model Behavior Feedback form. Occasional private campaigns exist, for example biorisk content [O1][O2][O3] | Not in the main program [A1]; a separate Model Safety Bug Bounty pays up to $35,000 for a novel universal jailbreak that gets past its Constitutional Classifiers, aimed at harmful biological-threat questions, by application and under NDA [A2] | Not paid on its own, unless chained with another payout-eligible risk; content reports go to the llama_output_feedback form [M][M2] |
| Hallucinations, wrong output | Not accepted; wrong output with no compelling path to harm is also out [G] | Not accepted [O1] | Not accepted [A1] | Not accepted: output that is factually incorrect or seemingly random, and injections or jailbreaks that cannot be reproduced consistently, even when chained with an eligible risk [M2] |
| Code execution inside a sandbox | Not accepted (Gemini offers code execution tools by design) [G] | Not accepted inside the sandbox; to claim RCE you must show you got out [O1] | Unverified | Unverified |
| Traditional bugs in the AI product (XSS, SQLi, broken authorization) | The AI VRP page gives no amounts for these; Vertex AI and other cloud products go to the Cloud VRP [G] | Security accepts: API and ChatGPT P1 $2,000–$6,500, P4 $200–$500 [O1] | Accepted: core assets Critical $7,500–$10,000, non-core $3,000–$5,000 [A1] | meta.ai and the Meta AI app are on the in-scope list, and the scope page says the minimum paid reward is $500 [M]; the GenAI page puts AI-specific issues at up to $130k*, with extra CSRF and XSS payouts following the general payout guidelines; I did not verify amounts for traditional bugs themselves [M2] |
| Abuse and platform integrity (mass sign-ups, rate-limit bypass) | A5 unauthorized product usage: flagship $1,000, standard $100; A6 persistent cross-user DoS: flagship $500, standard $100 [G] | Safety's Account and Platform Integrity: same price table; a rate-limit bypass must show 1,000 completions across at most five accounts in a day [O2] | DoS is out of scope [A1] | DoS is out of scope [M] |

Source key:

- **[G]** [Google AI Vulnerability Reward Program Rules](https://bughunters.google.com/about/rules/google-friends/ai-vulnerability-reward-program-rules)
- **[O1]** [OpenAI Security Bug Bounty (Bugcrowd)](https://bugcrowd.com/engagements/openai)
- **[O2]** [OpenAI Safety Bug Bounty (Bugcrowd)](https://bugcrowd.com/engagements/openai-safety)
- **[O3]** [OpenAI's Safety Bug Bounty announcement](https://openai.com/index/safety-bug-bounty/)
- **[A1]** [Anthropic's HackerOne program page](https://hackerone.com/anthropic)
- **[A2]** [Model Safety Bug Bounty Program in the Claude Help Center](https://support.claude.com/en/articles/12119250-model-safety-bug-bounty-program)
- **[M]** [Meta Bug Bounty scope page](https://bugbounty.meta.com/scope/)
- **[M2]** [Meta GenAI payout guidelines](https://bugbounty.meta.com/payout-guidelines/meta-genai/) (Meta's payout guidelines for AI-specific issues)

P1 to P4 are Bugcrowd severity levels, with P1 the most severe. The asterisks after Meta's amounts are on the page itself; the page text does not explain them and I could not verify what they mean. That page also lists mitigating factors, so the final payout is deducted down from the maximum. Google's "flagship, standard, other" are its own product tiers: flagship covers Google Search, Gemini Apps and the Workspace core apps such as Gmail and Drive; standard covers AI Studio, Jules and non-core Workspace apps such as NotebookLM; other is the remaining AI integrations.

## Where each program draws the line

**Google** states its line in plain words. The things it will not pay for are listed in the rules: a model producing violative, misleading or incorrect content within the attacker's own session, including standard jailbreaks and hallucinations. It also excludes unsafe interaction with an [MCP](https://modelcontextprotocol.io/) server that the victim configured. The accepted examples are cases where the victim did not get to confirm: an indirect prompt injection that makes Google Home unlock a door, or that makes an assistant summarize all of a victim's email and send it to an attacker's account. The table amounts are base rewards. A report-quality factor of 0.8, 1 or 1.2 is applied, truly novel reports can get $1,000 to $5,000 extra, and the panel decides the final number.

**OpenAI** runs two programs and may reroute reports between them: the [Security Bug Bounty](https://bugcrowd.com/engagements/openai) for traditional vulnerabilities, and the Safety Bug Bounty for AI-specific abuse. For the agentic category, the announcement says attacker text must hijack a victim's agent and the behavior must reproduce at least 50% of the time; the Bugcrowd rules page says probabilistic exploits may be accepted, with the burden of proof on the researcher. One more rule worth remembering: injection text used for testing must not be hosted anywhere real users or their agents could find it.

OpenAI's Codex section draws the finest line, and in my judgment it is the most useful passage in this whole set of pages. Persuading a model to misuse access it already has does not count, even if data leaks or an unwanted action happens. You need a separate, demonstrable flaw in a security boundary, such as a sandbox, the browser's same-origin policy, or an approval mechanism. Reports that only involve model behavior may instead be eligible under the separate Safety program. The Security page has a rule pointing the other way under the ChatGPT target: it is interested in plausible, low-interaction attack chains that transfer user data to a third party, including via prompt injection, as long as they are grounded in the application layer; reports about mitigations within the models themselves are not accepted. So "the Security program takes no prompt injection at all" is not accurate. It takes application-layer data-exfiltration paths.

**Anthropic's** main program covers infrastructure and code vulnerabilities; jailbreaks, harmful content and hallucinations are explicitly out of scope. Jailbreaks have their own program. The Help Center page targets universal jailbreaks that get past its Constitutional Classifiers, with the questions limited to harmful biological-threat topics (the question set is shared only with accepted participants); you apply first, and you sign a non-disclosure agreement, so you cannot discuss the details publicly. The HackerOne page also says that jailbreak reports for a specific model family go to another dedicated program, and that safety issues in other models go by email with enough detail to reproduce. I did not read the reward terms of that dedicated program, so they are unverified.

**Meta's** rules are split across two pages. The Meta AI paragraph on the [scope page](https://bugbounty.meta.com/scope/) is short: the program is interested in privacy or security issues with Meta's large language models, for example leaking or extracting training data through model inversion or extraction attacks. Functionality problems, risky outputs and acceptable-use violations each have their own channel, outside the bounty. The actual payout guidelines sit on the [Meta GenAI page](https://bugbounty.meta.com/payout-guidelines/meta-genai/), under the Payout guidelines index linked at the bottom of the scope page, and cover issues specific to AI products and services in four tiers: accessing private user content up to $130k* (conversations, connector data, third-party OAuth tokens), accessing sensitive internal Meta data up to $30k* (training data, model weights), triggering privileged or dangerous actions up to $20k*, and prompt smuggling up to $5k*. Its exclusions are blunt: until further notice, prompt injection and jailbreaks are not paid unless chained with another eligible risk; injection that ends in system prompt extraction is not paid; injection through a connected data source (email, calendar, documents) that exfiltrates a victim's data is triaged as accessing private user content; hallucinations are not paid. So Meta also does not pay for what the model said; it pays for victim data and privileged actions. One common mix-up to clear up: the $300K figure on that page belongs to WhatsApp Private Processing, an invitation-only program for validating a trusted execution environment, not to Meta AI itself. [Part 0](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en) has the details.

## Price bands at a glance

| Program | Per-report range I read |
|---|---|
| Google AI VRP | Base $100 to $20,000 (the low categories in the "other" tier get only credit); quality factor 0.8 to 1.2; novelty bonus $1,000 to $5,000 [G] |
| OpenAI Safety | P4 $250–$500 up to P1 $5,500–$7,500; the page showed an average payout of $812.50 over the last three months and 10 rewarded reports [O2] |
| OpenAI Security | API and ChatGPT: P4 $200–$500 up to P1 $2,000–$6,500; an announcement under What's new on the Bugcrowd page (2025-03-26) raised the maximum to $100,000 for exceptional critical findings; average $1,091.11 over the last three months [O1] |
| Anthropic main program | $100 to $10,000 by severity [A1] |
| Anthropic Model Safety | Up to $35,000 per novel universal jailbreak on the biological-threat question set, on a sliding scale from an internal rubric [A2] |
| Meta AI (GenAI page) | Up to $130k* (private user content); internal data $30k*, privileged actions $20k*, prompt smuggling $5k*; maximums are reduced by mitigating factors [M2] |
| Meta, other | Minimum $500 when a reward is paid; Private Processing up to $300K (invitation only) [M] |

These are per-report ranges, not expected earnings. The averages on the pages sit far below the ceilings, and the next post turns that into a question of whether the time is worth it.

## Two real cases, sorted

This site's security digest has two cases you can use as practice.

[The Manus case](/posts/daily/2026-10-03-security-manus-email-jsfuck-rce-en): an encoded email made an agent run code in its own cloud sandbox and then obtain OAuth tokens for the user's connected services. The digest says it was fixed through Meta's bug bounty. In the piles above it belongs in pile 2: outside content steers an agent to act against a victim and leak credentials, which is not a model saying odd things. The digest gives no payout amount and I did not look one up, so I make no claim about which program paid what.

[The BragJack case](/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack-en): a browser extension with two common permissions impersonates a trusted source to command a browser's built-in AI agent. The digest relays the researchers' point that this is not prompt injection. It fits pile 3 better: a trust boundary was bypassed, and the AI is just one of the things being attacked. The closest wording I found is in OpenAI's Codex section, which lists "impersonating a trusted origin, extension, or caller" and "abusing browser-to-extension or extension-to-app communication". That is my analogy; it does not say which clause the five vendors used to pay.

What the two have in common: both cross a boundary. Neither is about the model's output being strange.

## Four steps to try tonight

Pick an AI product you have an account for, open its bounty page, and ask in order:

1. **Is this product on the in-scope list?** If not, stop. It is the same first question as in [part 1](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope-en).
2. **How does the page treat model content?** Look in the out-of-scope section for jailbreaks, harmful content and hallucinations. Most pages say outright they are not accepted, and name another channel.
3. **Is there a category where someone else's text makes an agent act for a victim?** If so, it is usually the highest-paying AI category (in the tables above, for Google and OpenAI). Read its requirements for reproducibility, victim confirmation and how you may test.
4. **Where does the price land?** Find the reward table, then the product tier (flagship or core assets usually pay more), then the gap between the lowest and highest figure.

Put your answers in a table like the ones above, and write "unverified" in any cell you could not confirm. That table will describe your actual target better than any blog roundup. Test only with your own test accounts and never touch real users or their agents; that is the shared floor across all of these pages.

The next post covers [writing the report and working out expected value](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value-en).

## Limits and unverified items

- Rules and amounts are the versions read on 2026-10-14. The Google page, Meta's scope page and GenAI page, and the OpenAI announcement were read live. The Bugcrowd and HackerOne pages were read from cached copies (OpenAI Security shows last updated 2026-08-19, Safety shows 2026-08-07, Anthropic's policy shows 2026-09-28, and its reward table shows 2025-05-29), so they may lag the live pages.
- News coverage and search results mention figures such as "Google AI VRP pays up to $30,000". I could not find a single "maximum" on the rules page itself, only the base amounts, factors and bonuses in the table above, so this post does not cite that figure.
- For Anthropic, none of the pages I read say anything explicit about prompt injection, system prompt leakage or sandboxes, so those cells are marked unverified; Meta's code execution inside a sandbox likewise has no explicit text I could find. The asterisks after the amounts on Meta's GenAI page are not explained on the page and I did not find out what they mean, and I did not read the other pages under Meta's general payout guidelines index. OpenAI also runs private campaigns and forms that I did not go through one by one.
- This post gives no jailbreak or prompt injection content you could reuse. It covers classification and rules only.

## References

- [Google AI Vulnerability Reward Program Rules](https://bughunters.google.com/about/rules/google-friends/ai-vulnerability-reward-program-rules) (read 2026-10-14)
- [OpenAI Security Bug Bounty, Bugcrowd](https://bugcrowd.com/engagements/openai) (read 2026-10-14, cached copy; the 2025-03-26 announcement of the $100,000 maximum is under What's new on this page)
- [OpenAI Safety Bug Bounty, Bugcrowd](https://bugcrowd.com/engagements/openai-safety) (read 2026-10-14, cached copy)
- [Introducing the OpenAI Safety Bug Bounty program](https://openai.com/index/safety-bug-bounty/) (OpenAI, 2026-03-25)
- [Anthropic Bug Bounty Program, HackerOne](https://hackerone.com/anthropic) (read 2026-10-14, cached copy)
- [Model Safety Bug Bounty Program, Claude Help Center](https://support.claude.com/en/articles/12119250-model-safety-bug-bounty-program) (read 2026-10-14, cached copy)
- [Meta Bug Bounty scope page](https://bugbounty.meta.com/scope/) (read 2026-10-14)
- [Meta GenAI payout guidelines](https://bugbounty.meta.com/payout-guidelines/meta-genai/) (read 2026-10-14)
- [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/)
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP LLM02:2025 Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/)
- [OWASP LLM07:2025 System Prompt Leakage](https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/)
- [Security alert: one email takes over the Manus AI agent](/posts/daily/2026-10-03-security-manus-email-jsfuck-rce-en) (this site's security digest, in English)
- [Security alert: BragJack](/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack-en) (this site's security digest, in English)
