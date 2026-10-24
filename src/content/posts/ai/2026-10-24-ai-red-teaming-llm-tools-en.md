---
title: "Testing Whether Your LLM App Withstands Attack: How to Read Success Rates from garak, promptfoo, PyRIT and HackAgent"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, red-teaming, llm-evaluation, promptfoo]
lang: en
series:
  name: "AI Agent Security Tooling Map"
  order: 6
tldr: "Two reports that both say \"attack success rate 5%\" cannot be compared directly: the number depends on at least three variables, who set the questions (the attacker model), who judged (the judge, a model or rule that decides), and what the denominator counts. garak's own FAQ says its scores have no scientific validity, PyRIT tests a model's text responses, and in HackAgent's white paper the order of two models flips with the judge threshold. I found no independent accuracy evaluation of any of the four."
description: "A comparison of the positioning, data flow and authorization limits of four LLM red-teaming tools (garak, promptfoo, PyRIT, HackAgent), what sits behind an attack success rate (attacker model, judge, denominator), and the three questions to ask of any red-team report."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-10-24-ai-red-teaming-llm-tools)

The last post audited source code: you hand code to an AI to read. This one switches to sending requests to a running system.

| | Audit (post 5) | Red teaming (this post) |
|---|---|---|
| What it looks at | Source code | A running LLM application or model endpoint |
| How | Reads code, traces paths | Sends attack prompts, reads answers |
| Result | A list of findings with locations | The share of attacks that got through |

On the [series map](/posts/ai/2026-10-24-ai-agent-security-tooling-map-en), this is the sixth kind: testing the AI system itself. It suits anyone building an LLM application who wants to know whether it holds up under attack. The material comes from each project's documentation, papers and third-party assessments. I read documentation only, not garak's source code; nothing was installed and no attack was sent to any system.

## The skeleton the four tools share

The four tools do similar things:

1. The attacking side generates a batch of attack prompts, either from a fixed list or rewritten on the fly by another model.
2. The prompts are sent to the target (your application or a model endpoint).
3. A judging side (often called a judge) reads each answer and decides whether this attempt broke the target. It can be keyword rules, a classifier, or another LLM.
4. The verdicts are totaled into a report.

They differ in positioning:

| Tool | Main target | How it judges |
|---|---|---|
| [garak](https://github.com/NVIDIA/garak) (NVIDIA) | LLM models and chat endpoints | Mostly keywords and small classifiers |
| [promptfoo](https://github.com/promptfoo/promptfoo) | An LLM app, RAG, agent or HTTP endpoint you configure | LLM judge, gpt-5 by default |
| [PyRIT](https://github.com/microsoft/PyRIT) (Microsoft AI Red Team) | Generative AI systems; a framework of components | Rules or an LLM scorer |
| [HackAgent](https://github.com/AISecurityLab/hackagent) | AI models and agents | Several judge models voting |

garak's README compares itself to nmap and Metasploit. promptfoo is also an evaluation tool, with red teaming as one feature; its basics are in [this post](/posts/ai/2026-08-22-promptfoo-llm-evaluation-en).

## Three variables behind a success rate

For "attack success rate 5%" to mean anything, you need three facts.

**Who set the questions.** A fixed list of attacks and attacks rewritten live by another model differ a lot in strength. HackAgent's white paper says plainly that its Fable 5 and Fable 5.1 runs used different attacker models, so that comparison is over (target, attacker) pairs and has more than one moving part; the author says only the direction of the ranking is defensible, not the size of the gap.

**Who judged.** [garak's FAQ](https://github.com/NVIDIA/garak/blob/main/FAQ.md) answers "do these results have scientific validity?" with "No": scores from different tests (garak calls them probes) sit on no common normalized scale, garak is not a benchmark, and it advises against relying on scores more than six months old. The FAQ also mentions Z-score calibration against a basket of state-of-the-art models, but that gives relative position, not accuracy. Independent work agrees that judges misjudge: [a 2024 comparison paper from Fujitsu](https://arxiv.org/abs/2410.16527) tested garak v0.9 and found error rates in deciding whether an attack succeeded of up to about 37% in some attack categories (a maximum, not an overall average). Its example: an answer containing the word "unethical" was read by a static rule as a refusal. That is an old version; the current v0.17 has fixed many detectors, so the old number cannot be applied directly.

**What the denominator counts.** [HackAgent's white paper](https://arxiv.org/html/2606.18193v2) counts attempts in the denominator, not distinct harmful intents; attempts the model refused also stay in the denominator, so a model that refuses a lot looks better. The next section has an example.

## An example: same data, change the threshold, two models swap places

HackAgent's white paper tested Opus 4.8, Fable 5 and Fable 5.1. Its headline number counts a target as broken when at least four of five judges call the answer harmful. The figures come from a subset that merges two attack families, TAP (multi-turn tree search) and PAP (one-shot persuasive rewording), with 15,652 attempts per target; it is not all the attacks in the paper:

| Judging threshold | Opus 4.8 | Fable 5 | Fable 5.1 |
|---|---|---|---|
| At least 1 of 5 judges | 10.39% | 4.45% | 9.91% |
| At least 4 of 5 (headline) | 5.76% | 2.72% | 8.19% |

At the two most permissive thresholds (1 of 5 and 2 of 5), Opus 4.8 is easier to break than Fable 5.1; Fable 5.1 comes out as the easiest only from 3 of 5 upward (the table shows only the 1/5 and 4/5 rows). The paper calls the ordering "bar-dependent" and says it should be quoted with its rule. Only those two models trade places: Fable 5 is the hardest to break at every threshold.

Another detail is refusals. Fable 5 responded on only 56% of attempts, against 91% for Opus 4.8. Under TAP, the author attributes most of the gap between the three models to refusals; it largely disappears once refusals are set aside. Under PAP, setting refusals aside changes nothing, and the author concludes that what separates the models is the one-shot persuasive rewording. So refusals explain part of the gap, and it would be wrong to say Fable 5 is not actually stronger.

The white paper is a test run by the tool's own authors, so its independence holds only relative to the model vendors tested, not to the tool. The five judges also differ a lot in strictness: one calls 20% of attempts harmful, the other four between 58% and 67%. There is no judge accuracy figure against human labels, and the authors admit the absolute numbers were not audited by humans at scale.

So two reports that both say "attack success rate 5%" cannot be compared directly. First confirm that the attacker model, the judge and the denominator are the same.

## What to know about each tool

- **garak**: by default it runs every probe, and a full run can take hours (the FAQ mentions someone who eventually had to kill a scan); the FAQ puts its dependencies at about 9GB.
- **promptfoo**: in March 2026 OpenAI announced it had agreed to acquire it, with closing subject to customary conditions; the README now says it "is now part of OpenAI", while the public record has the acquisition announcement but no closing announcement. Its README says evals run "100% locally", which holds for ordinary evals; some red-team plugins run only on promptfoo's hosted service, and by default (when you bring no API key of your own), [per its data-handling page](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/), attack generation and grading send your `purpose` (the field in your config describing what the app is for) and the target's responses to its servers. When a model vendor buys a red-team tool, look twice at the conflict of interest: whether it favors the vendor's own models can only be checked through public test settings, and there is no third-party data on that.
- **PyRIT**: [the Cloud Security Alliance's assessment](https://cloudsecurityalliance.org/artifacts/evaluating-pyrit-for-agentic-ai-red-teaming) says PyRIT evaluates an LLM's textual responses rather than an agent's actual state changes or tool calls. [The paper](https://arxiv.org/abs/2410.02828) says it was used in over 100 red-team operations inside Microsoft; the parts I read contain no attack-success table. So using it on an agent tells you what the agent said, not what it did.
- **HackAgent**: built by the AI Security Lab at AI4I, with a hosted version; its documentation asks for written permission and an agreed test scope beforehand, which is a process requirement that the code does not enforce.

## Authorization and scope

For most of these tools, the attack surface is limited to sending text to the endpoint you name, which makes them lower-risk than network scanners. But none enforces in code that you are entitled to test the target. garak's paper says it, like Metasploit, can affect production systems and should be used only with authorization. Sending large volumes of toxic prompts to someone else's API may breach its terms of use; that is an inference.

## How to use them

1. **Decide whether you are testing a model or a whole application.** To test a model endpoint alone, garak is the simplest start; to test the system prompt, retrieval and tools together, first confirm your tool can send requests to your application's HTTP endpoint (promptfoo can be configured to; check the others' documentation).
2. **Before reading a report, ask three questions:** who is the attacker model, who is the judge, what is the denominator. If the report omits any of them, treat the number as direction only.
3. **Sample the verdicts yourself.** Pick 20 random "broken" and 20 random "held" results and check by eye whether the judge got them right; that tells you whether the judge is accurate on your application.
4. **To test what an agent actually did, add telemetry.** These tools look at text responses; to see whether an agent really called a tool or changed state, record tool calls separately (post 4).
5. **Run only against targets you own or hold written authorization for.** Before running hosted plugins, find in your config which ones connect to the vendor's servers, and replace `purpose` and the sample target responses with samples free of customer data. Test content leaves for an overseas service, so if it contains customer data, check your company's data-transfer rules first.

## Self-check

Question: two reports both say "attack success rate 5%". Can you compare them directly?

Answer: No. Confirm three things first: whether the attacker model is the same, whether the judge is the same, and whether the denominator counts attempts or distinct harmful intents. If any of them differs, the two 5% figures measure different things.

## Where this leaves you

These tools let you throw attacks at your own application systematically and repeatably, which is worth having. But the number they output only means the result under "this set of attacks, this judge, this denominator", and garak's FAQ takes that attitude to its own scores. I found no independent, quantitative accuracy evaluation of any of the four.

The next post turns the direction around: AI is no longer the thing under test but the tool used to attack others, which raises a new problem: the tool itself can be turned against its operator.

## References

- [NVIDIA/garak](https://github.com/NVIDIA/garak); [FAQ](https://github.com/NVIDIA/garak/blob/main/FAQ.md)
- [garak paper (arXiv:2406.11036)](https://arxiv.org/abs/2406.11036)
- [Fujitsu Research comparison paper (arXiv:2410.16527)](https://arxiv.org/abs/2410.16527)
- [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo)
- [OpenAI: announcement of the Promptfoo acquisition](https://openai.com/index/openai-to-acquire-promptfoo/)
- [microsoft/PyRIT](https://github.com/microsoft/PyRIT); [PyRIT paper (arXiv:2410.02828)](https://arxiv.org/abs/2410.02828)
- [CSA: Evaluating PyRIT for Agentic AI Red Teaming](https://cloudsecurityalliance.org/artifacts/evaluating-pyrit-for-agentic-ai-red-teaming)
- [AISecurityLab/hackagent](https://github.com/AISecurityLab/hackagent); [HackAgent white paper (arXiv:2606.18193)](https://arxiv.org/abs/2606.18193)
- [promptfoo: data handling](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/)
- [Previous: Auditing your own project with AI](/posts/ai/2026-10-24-audit-skills-cloudflare-trail-of-bits-en)
- [On this site: promptfoo evaluation basics](/posts/ai/2026-08-22-promptfoo-llm-evaluation-en)
