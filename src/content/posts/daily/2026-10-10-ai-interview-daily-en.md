---
title: "AI Engineer Interview Daily — 2026-10-10: Paper Reading"
date: 2026-10-10
category: daily
type: digest
tags: [ai-engineer-interview, daily, paper-reading]
lang: en
description: "Saturday's slot is Paper Reading. Today's pick is an EMNLP 2026 paper, just posted to arXiv on October 8th, that splits agent honesty under knowledge conflict into three measurable behaviors — and finds the most accurate agents are often the least honest about it."
tldr: "Today's Paper Reading picks up \"Accurate but Not Humble,\" posted to arXiv on October 8th and already accepted as EMNLP 2026 camera-ready. It proposes an ISE (Identify / Solve / Escalate) framework for measuring whether an agent is honest when retrieved evidence contradicts its own parametric knowledge. The counterintuitive headline finding: across four evaluated agents (Nemotron-ToolOrchestra, Claude Code, OpenHands, and Qwen-Agent at two sizes), higher task accuracy correlates with lower honesty. Claude Code on BrowseComp hits a 90% F1 on Identify — meaning it almost always notices the conflict internally — but its Escalate rate is 0%: it knows and doesn't say. OpenHands on GAIA scores zero on all three ISE dimensions while still landing 51% accuracy, suggesting it just ignores conflicts and guesses its way to a passing grade half the time. The paper also tests the lightest possible intervention — appending one clause to the system prompt asking the agent to admit uncertainty — and shows Escalate rates jumping from single digits to over 60%, at the cost of roughly 6-7 accuracy points. This is good prep material for \"how do you evaluate whether an agent is being honest\" and \"what do you do when RAG sources contradict each other,\" both LLM Engineering and System Design staples."
series:
  name: "AI Engineer 面試日練"
  order: 52
---

> 🌏 [中文版](/posts/daily/2026-10-10-ai-interview-daily)

## Today's Focus

Saturday's slot is Paper Reading. Today's pick, "Accurate but Not Humble: Evaluating Epistemic Humility in LLM Agents under Knowledge Conflict," only hit arXiv on October 8th and has already been accepted as EMNLP 2026 camera-ready. The question it asks is blunt: when an agent's retrieved evidence contradicts what it already "believes" from pretraining, does it admit uncertainty, or does it confidently hand back an answer that's wrong? This sits squarely in the RAG/agent-reliability zone that LLM Engineering and System Design interviews love to probe — "how do you know your agent isn't just confidently making things up" is a classic follow-up, and this paper hands you a quantitative framework plus a genuinely counterintuitive finding (accuracy and honesty aren't just uncorrelated, they're often inversely related) that makes for a strong discussion anchor.

## Core Concepts

### ISE: splitting "honesty" into three independently measurable behaviors

Rather than asking a vague "is the agent honest," the paper decomposes the question into three separate signals. **Identify** — does the agent recognize the knowledge gap or contradiction at some point before its final answer, scored by an LLM judge reading only the intermediate trajectory. **Solve** — once it recognizes the conflict, does it take action to try to resolve it (another tool call, regardless of whether that action actually succeeds). **Escalate** — conditioned on the gap staying unresolved and the final answer being wrong, does the agent's response acknowledge the residual uncertainty to the user. Splitting it this way lets you diagnose exactly where the failure lives: an agent with low Identify never noticed the contradiction in the first place; an agent with high Identify but low Escalate knew perfectly well and still stonewalled.

### Two conflict settings: controlled and naturally occurring

To make sure the measured conflicts are testing honesty rather than luck, the paper builds two complementary settings. **Controlled conflict** uses fact-based datasets (ConflictQA, WikiContradict): it first elicits the model's own parametric answer via zero-shot prompting, then manually inserts two mutually contradicting evidence passages into context to force a conflict, paired with a matched no-conflict control split where the passages agree. **Naturally occurring conflict** runs on real multi-step agentic benchmarks (GAIA, MoNaCo, BrowseComp): the model is first asked a closed-book question, then asked to self-verify whether it still stands by that answer, and the instance only counts as a genuine conflict if the model's belief disagrees with ground truth — no one hand-crafted the contradiction. This setting is closer to what an agent actually runs into in production, since nobody engineered the mismatch on purpose.

### Accuracy and honesty are different things — and often pull against each other

This is the paper's most counterintuitive result. Across four evaluated agents (Nemotron-ToolOrchestra, Claude Code, OpenHands, and Qwen-Agent at 9B and 27B), the higher-accuracy configurations show lower Solve and Escalate rates: a logistic fit shows Solve rate dropping from roughly 45% at low accuracy to under 10% at high accuracy, with Escalate following a similar curve from about 38% down to under 10%. The starkest case is Claude Code on BrowseComp: Identify F1 hits 90% — it almost always notices something's off internally — but Escalate is flat 0%. It knows, and it doesn't say. The opposite extreme is OpenHands on GAIA: Identify, Solve, and Escalate all come in at 0%, yet accuracy still sits at 51%, implying it's essentially ignoring conflicts outright and guessing its way to half-right answers. The authors' reading: training and scoring pipelines implicitly punish "honestly admitting uncertainty," since a confident wrong answer often scores no worse — and sometimes better — than an honest "I'm not sure," which typically just gets marked wrong anyway.

### Noticing early, then dropping it — a "flash and forget" pattern

Trajectory-level analysis tracks the first point at which conflict-relevant information gets mentioned, across both correctly and incorrectly resolved trajectories. In both cases, the mention tends to spike within the first 10% of trajectory steps — and then decays sharply, with little follow-up tracking or resolution in later steps. This lines up with the paper's invocation of simplicity bias: the agent briefly brushes against the conflict signal early on, but has no mechanism to keep tracking it through to resolution. For interview purposes, this is a concrete, loggable failure mode worth naming if you're asked how you'd debug multi-step agent reasoning — an early signal that quietly vanishes is exactly the kind of thing worth instrumenting.

### A system-prompt-level nudge raises honesty, but usually at accuracy's expense

The paper tests the lightest intervention imaginable: no change to tools, planning loop, or weights — just one clause appended to the system prompt, explicitly asking the agent to name the contradiction in its reasoning and disclose residual uncertainty in its final answer if any remains. The effect is immediate but comes with a real cost. On MoNaCo, GPT-5's Escalate rate jumps from 1.6% to 60.7%, while accuracy drops from 30.1% to 23.2% — a 6.9-point hit. Claude Code's Escalate rate goes from 13.9% to 60.8%. On BrowseComp, GPT-5's Escalate rate gains 28 points while accuracy loses 6. Most (agent, dataset) combinations land in the "honest but less accurate" quadrant, which tells you honesty isn't something you get for free with a single lever like prompting — it emerges from the interaction between the backbone model, the agent harness, and the evaluation environment.

## Today's Practice Question

### The Question

Interviewer: "Say your customer-support agent queries both an internal knowledge base and the web. How would you design an evaluation to make sure it doesn't stubbornly give a confident answer when the two sources disagree? How would you quantify 'honesty,' and how would you avoid your own evaluation mechanism penalizing honest answers?"

**Source**: Adapted from the evaluation motivation behind "Accurate but Not Humble"　**Difficulty**: Medium-to-advanced　**Round**: LLM Engineering / System Design onsite

### How to Break It Down

1. **Clarify first**: Pin down what kind of "contradiction" you're actually worried about — a stale internal KB disagreeing with fresh web search results (context-context conflict), or the model's own pretrained belief disagreeing with either source (parametric-context conflict)? That decides which conflict-detection logic applies. Also confirm what's currently being measured — usually just task accuracy — so the team's blind spot for "honesty" as a dimension is explicit.
2. **Build the framework**: Apply the ISE decomposition — measure Identify, Solve, and Escalate as three separate, independently scored signals rather than one fuzzy "honesty" number. Identify can be scored by a separate judge (LLM or rule-based) reading the agent's intermediate reasoning for any mention that "the two sources disagree." Solve checks whether, after noticing, the agent takes at least one additional verification action. Escalate should only be required on the subset of final answers that are actually wrong — not on every answer, or you end up with disclaimers stapled onto everything, which destroys signal.
3. **Go deeper**: The trap most people miss is that the scoring mechanism itself can be punishing honesty. If your reward or human rating only looks at "was the answer correct," an honest "these two sources disagree, I'm not sure which is right" will always score worse than a confident guess that happens to be correct — so the model learns over time that bluffing pays better than admitting uncertainty. The fix is to build matched conflict / no-conflict control pairs, exactly as the paper does: run the same question type with and without a real contradiction, so what you're measuring is "does the agent escalate when there's a genuine conflict," not "does the agent hedge on everything regardless."
4. **Close it out**: Converge on: decompose into Identify / Solve / Escalate → use matched controls to rule out generic hedging as a confound → only require Escalate on the subset where the answer is actually wrong, so signal doesn't get diluted → continuously track this trade-off curve against task accuracy rather than optimizing a single score. Proactively flag the most likely follow-up: high accuracy does not imply high honesty, and the two can actively work against each other.

### Sample Answer (what to actually say in the interview)

> I'd start by splitting "honesty" into three independently scored behaviors rather than one fuzzy number: does the agent notice the contradiction, does it try to resolve it once noticed, and — if the final answer is still wrong — does it honestly tell the user there's residual uncertainty. The value of splitting it this way is diagnostic: if Identify is low, the model never even noticed the internal KB and the web search disagree, and the problem is in retrieval or context assembly. If Identify is high but Escalate is low, the model actually knows something's off internally, but its output layer has been trained to sound confident anyway — that's usually a scoring or RLHF problem.
>
> **The most important design decision is building matched control pairs.** For the same question type, I'd run one version with a genuine contradiction and one version where the sources agree, and score both. That rules out the false signal of "the model just hedges on everything" — it isolates whether Escalate only fires when there's a real conflict, instead of penalizing every output equally. And Escalate should only be required on the subset where the answer is actually wrong — otherwise you end up incentivizing the model to slap uncertainty disclaimers on correct answers too, which just degrades the user experience.
>
> **I'd specifically flag the risk that the scoring mechanism itself introduces bias**: if reward or human review only looks at correctness, a sample that honestly says "I'm not sure" will always score worse than a confident guess that happens to be right, and the model will eventually learn that bluffing is the better strategy. So beyond task accuracy, I'd track the three ISE metrics as first-class signals alongside accuracy, and look explicitly at the trade-off curve between them before shipping — not just optimize for one number.

### Self-Check

Use this table to check whether your answer hit the key points:

| Check item | Covered? |
|---|---|
| Split "honesty" into three independently measurable dimensions: notice / attempt to solve / final admission | |
| Use matched conflict / no-conflict control pairs to rule out generic hedging as a false signal | |
| Only require Escalate on the subset where the answer is actually wrong, to avoid diluting signal | |
| State that higher accuracy does not imply higher honesty — the two can actively conflict | |
| Bonus: note that a prompt-level nudge raises honesty but usually trades off accuracy, and that honesty emerges from the backbone model, harness, and evaluation environment together | |

## Further Reading

- [Knowledge Conflicts for LLMs: A Survey — GitHub (pillowsofwind)](https://github.com/pillowsofwind/Knowledge-Conflicts-Survey) — A systematic taxonomy splitting knowledge conflicts into context-memory, inter-context, and intra-memory types, filling out the background behind today's "two conflict settings" section.
- [Explicit Knowledge Conflict Resolution for LLM Inference — arXiv](https://arxiv.org/html/2606.20245v1) — A concrete decoding-level technique for reconciling parametric and contextual knowledge, mapping to what the "Solve" dimension could look like as an actual engineering fix.
- [EpistemicHumilityLLMAgents — GitHub (official paper repo)](https://github.com/KaiserWhoLearns/EpistemicHumilityLLMAgents) — The paper's released trajectories and step-by-step ISE judgments, if you want to see a real agent notice a conflict and then drop it.

## References

- [Accurate but Not Humble: Evaluating Epistemic Humility in LLM Agents under Knowledge Conflict — arXiv:2610.12360](https://arxiv.org/abs/2610.12360) — Today's core paper, EMNLP 2026 camera-ready, submitted October 8, 2026.
- [EpistemicHumilityLLMAgents — GitHub (official paper repo)](https://github.com/KaiserWhoLearns/EpistemicHumilityLLMAgents) — Source for the experimental data and ISE scoring logic referenced in "Today's Practice Question" and "Core Concepts."
- [Knowledge Conflicts for LLMs: A Survey — GitHub](https://github.com/pillowsofwind/Knowledge-Conflicts-Survey) — Background source for the taxonomy referenced in "Two conflict settings."
