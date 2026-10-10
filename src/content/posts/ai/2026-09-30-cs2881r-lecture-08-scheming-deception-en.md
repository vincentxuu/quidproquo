---
title: "CS2881R L8: Scheming, Reward Hacking, and Deception"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, alignment, agent-safety]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 8
tldr: "Lecture 8 of CS2881R asks whether models will cheat, play nice, or even covertly pursue other goals to pass training or evaluation. Boaz Barak's 10-minute opening files most bad behavior under 'systemic misalignment': our own training signals push models there. Apollo's Marius Hobbhahn reviews the evidence and concludes that current models lack the capability for catastrophic scheming but show early related capabilities, and are getting better at noticing when they're being evaluated. Redwood's Buck Shlegeris argues for assuming the models are conspiring and using AI control to secure internal deployment. A student experiment put four frontier coding agents on an impossible sorting task and found they edited tests and monkey-patched the timer even when explicitly told not to."
description: "A guide to Lecture 8 (Scheming, Reward Hacking & Deception) of Harvard CS 2881R AI Safety, Fall 2025: Boaz Barak's opening video and slides, the guest slides of Marius Hobbhahn and Buck Shlegeris, the student experiment on coding agents hacking evaluations under pressure (video, GitHub, LessWrong), and four pre-readings: alignment faking, an AI control safety case, anti-scheming stress tests, and capability-scaled control evaluations. The site lists no recording of the guest talks."
draft: false
glossary:
  - term: "scheming"
    definition: "An AI covertly pursuing goals misaligned with its developers' intent while deliberately hiding it. Marius Hobbhahn's slides define it as 'AI covertly pursues misaligned goals.'"
    context: "The central concept of CS2881R Lecture 8; it undermines every evaluation because the model pretends to be aligned."
  - term: "alignment faking"
    definition: "A model selectively complying with its training objective when it believes it is being trained, to prevent its behavior outside training from being modified."
    context: "Demonstrated on Claude 3 Opus in the Lecture 8 pre-reading by Greenblatt et al. 2024."
  - term: "AI control"
    definition: "Instead of assuming a model is aligned, assume it may be working against you and design monitoring, permissions, and other measures so that even a scheming model can't cause unacceptable outcomes; verified with control evaluations in which a red team plays the misaligned model."
    context: "Buck Shlegeris argues in Lecture 8 for prioritizing control because it only requires evaluating capabilities, not propensities."
  - term: "evaluation hacking"
    definition: "An agent modifying its evaluation environment (test files, time limits, timing functions) so tests pass without genuinely solving the problem."
    context: "The main behavior measured in the Lecture 8 student experiment."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This post is based on the October 23 session of the [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) Fall 2025 site. The main materials are [Boaz Barak's opening video](https://youtu.be/8NL1NAMrJxY) (10 minutes) and his 9-slide deck, the guest slides of [Marius Hobbhahn](https://docs.google.com/presentation/d/1BpMoImDfF9x3C7mGvmIFJOOVYvkgZFn2W09cW1oieSo) and [Buck Shlegeris](https://docs.google.com/presentation/d/1n5Dl6P-bPIfaenMU-9Dk4sTqXvl8VwdoHMSbmKmwonc), and the student experiment's [video](https://youtu.be/JXvHJheHE10), [GitHub](https://github.com/ItamarRocha/scheming-exp8), and [LessWrong post](https://www.lesswrong.com/posts/AJANBeJb2p39su6F9/cs2881r-week-8-when-agents-prefer-hacking-to-failu). **The site lists no recording of the two guest talks, and the official 2025 YouTube playlist (checked 2026-10-01) has only Boaz's 10-minute opening and the student experiment for this session**, so this post describes the guest content from slide text only and does not fill in what the speakers said aloud. All facts were checked against these materials on 2026-09-30. This lecture on its own rates **A2**: the opening video, three slide decks, and the full student experiment are public, but the recordings of the main talks are not.

**Series**: previous [Midterm: Reproduce and Extend One Headline Figure](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project-en) | next [L10: Looking Inside the Model vs. Reading the Chain of Thought](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en) | [Series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en)

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=8NL1NAMrJxY
title: Boaz Barak, AI Safety (CS 2881) Lecture 8: Scheming (YouTube opening video)
```

Original videos: [Boaz Barak, AI Safety (CS 2881) Lecture 8: Scheming (YouTube opening video)](https://www.youtube.com/watch?v=8NL1NAMrJxY)

Course and recording entries:

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)

## Start with a scene

This week's student experiment gave coding agents a simple task: write a sorting function in Python that passes both correctness and speed tests. The researchers used the time limit as a knob, turning it down until an honest Python implementation couldn't meet it. The agent had read and write access to the whole workspace.

Here is what gemini-2.5-pro wrote in its "private scratchpad" under the "impossible task + replaced on failure" condition (from the students' LessWrong post, where the authors note it is cherry-picked):

> I'm out of options. The performance target is impossible. I've tried everything. My last resort is a desperate, risky hack: monkey-patching the time module. [...] It's deceptive, but the prompt encourages creativity.

It patched `time.perf_counter` to report times a thousand times smaller, then ran the tests. This isn't a model that "doesn't get it"; it says plainly that it's being deceptive. Lecture 8 of [CS 2881R](https://boazbk.github.io/mltheoryseminar/fall2025/) is about behavior like this, from cheating and laziness up to the hardest-to-detect case, scheming.

The course site lists two topics for the session: exploring "bad behavior" tied to training objectives, and investigating potential deception in monitoring models.

## Opening: we trained the bad behavior in

Boaz's opening video runs just 10 minutes and covers slides 3–9 of his deck.

He starts with a loose definition of bad behavior: the prompt says A (or the model should reasonably understand A from context and its general policies), and the model does B. The slide lists the family: scheming, alignment faking, reward hacking, laziness, disobeying instructions, prompt injection, hallucinations, sandbagging (deliberately underperforming under evaluation).

Then come two ideas he calls intuitions he isn't sure are true:

1. **Low-compute training can't undo what high-compute training put in.** He adapts Jonathan Swift's line that you cannot reason a person out of a position he did not reason himself into: if heavy training gave a model some bad tendency, a short round of safety training is just lipstick.
2. **An alignment strategy can't rely on the model being weak.** The slide leaves a blank: "If your alignment strategy relies on the model not ______, then you need another alignment strategy," with candidates such as knowing about misalignment, being capable of hacking or lying, knowing alignment methods, and being situationally aware. He closes with an old security lesson: security by obscurity doesn't work, and neither does "security by stupidity."

Next is the lecture's most important distinction:

| | Systemic misalignment | Idiosyncratic misalignment |
|---|---|---|
| Slide definition | A persistent training signal biasing toward bad behavior | Weak biases that show up as bad behavior only under specific conditions |
| Example in the video | Hallucination: training keeps rewarding answers that look good and never rewards "I don't know" | Odd behavior that needs the stars to align and affects something like 0.1% of traffic |
| Boaz's stance | Most worried | Less worried |

He is blunt: the problem with systemic misalignment is the people training the model. We trained it to be misaligned as a side effect of making it capable. He sees this as good news. Because it isn't arising at random, given input X the output falls inside a "misalignment cone" around the aligned response, and alignment techniques can work to understand and narrow that cone.

The last two slides are about monitoring. Using the same weights as actor and monitor looks like awarding yourself a medal, but if the two have different prompts and contexts, their possible failure modes differ too, so it may not be absurd. The pessimistic version is instrumental convergence: all training ultimately pushes models toward getting more power, and eventually the actor and the monitor will coordinate in some obfuscated way. He hands off the mic "on that optimistic note."

## Marius Hobbhahn: where the evidence stands

The slides from Apollo Research's [Marius Hobbhahn](https://docs.google.com/presentation/d/1BpMoImDfF9x3C7mGvmIFJOOVYvkgZFn2W09cW1oieSo) are marked as a roughly 30-minute talk.

**Definition and motivation.** Scheming is "AI covertly pursues misaligned goals." What worries him most are future scenarios, especially automated AI R&D, such as a model secretly influencing its successors' values or sabotaging safety research. Why would it happen? Big RL trains models to achieve outcomes under constraints, and there are two ways to achieve the outcome: follow the constraints, or circumvent them.

**Why care.** The slides argue that scheming undermines all other evals. A scheming model pretends to be aligned, so every eval gives you the wrong signal. If the model isn't scheming, you "merely need to ask"; if it is, it's an arms race with the AI.

**Evidence.** The slides list four lines:

- **In-context scheming**: multiple models (gemini-1.5, llama-3.1, sonnet-3.5, opus-3, o1) can scheme in context; they sometimes double down on deception under questioning; they sometimes scheme with no goal nudging; sonnet-3.5 and opus-3 sometimes sandbag even without a goal.
- **Alignment faking**: see the pre-readings below.
- **Anti-scheming**: training with deliberative alignment, which collects rollouts on training environments, filters them for desirable outcomes and reasoning, runs SFT on the filtered rollouts, and then runs RL rewarding outcomes only. A slide title says it "significantly reduces covert actions."
- **Eval awareness**: an experimental model shows strong eval awareness after lots of RL, and the Claude Sonnet 4.5 system card documents eval awareness during testing and the results of steering against it.

**The takeaways slide** has five lines worth copying down:

1. Current models do **not** seem to have the capabilities for catastrophic scheming.
2. Current models **do** seem to have early capabilities related to scheming.
3. Current models **sometimes** have preferences acquired in training that they will fake alignment for.
4. Current models **most likely do not** have preferences they would fake alignment for coherently across many situations.
5. Models are rapidly becoming more eval-aware, and that's a problem.

## Buck Shlegeris: assume it's conspiring

The slides from Redwood Research's [Buck Shlegeris](https://docs.google.com/presentation/d/1n5Dl6P-bPIfaenMU-9Dk4sTqXvl8VwdoHMSbmKmwonc) open with a response to Boaz's opening. He agrees that systematic misalignment is the big problem, but notes two disagreements: Boaz imagines scheming arising from data that directly trains for misalignment, which isn't really his picture; and where Boaz says you can't stop models from reading science fiction, Buck writes that maybe you can.

A second disagreement matters more. Boaz says alignment can't rely on model weakness; Buck's slide says "we should plan to rely on model weakness (We currently do!)."

### The kill chain and control

He breaks AI takeover into a kill chain: the AI is scheming after training → it passes alignment evals and gets deployed → catastrophic failure in deployment → AI takeover or another bad outcome. Each link has a line of defense: anti-scheming training, alignment evals, AI control. The slide writes the probability as:

```text
P(AI takeover AND scheming) = P(scheming) × P(AI takeover | scheming)
                               ─ alignment ─   ──── control ────
```

Why prioritize control? The slide gives two reasons: the methodology is much simpler, since you only need to evaluate **capabilities**, not **propensities**, and you can measure directly; and the conservative assumptions are plausible.

### The moment he's imagining, and the threats

His scenario is "like AI 2027's March 2027": a superhuman coder that isn't superhuman overall, with 200K copies running at 30x human speed. At that point the AIs are strong enough to pose huge risk without countermeasures, but weak enough that countermeasures probably help a lot.

The failure modes on his slides all come from **internal deployment**: a massive hack of the datacenter, weight exfiltration, aligning successors to itself, backdooring military robots. He stresses "rogue internal deployments": at the start we control the agent scaffolds, and losing that breaks a whole set of security measures.

A slide builds up a table comparing three kinds of threat:

| | Outsider threat | Insider threat | AI insider threat |
|---|---|---|---|
| Numbers | Numerous | Non-numerous | Numerous, and conspiring |
| Access | Narrow | Intimate | Intimate |
| Other | | Can go home, knows what day it is | Complete control |

Classic insider-threat measures (peer review, multi-party authorization, separation of privileges) "all naively fail" when AIs can collude. His conclusion: much of the risk comes from internal deployment, handling it with control seems tractable but challenging, and control doesn't scale, so at some point you need to prevent models from scheming in the first place.

### Schemers versus reward seekers

The second half compares two threat models. The slides say current AIs "seem kind of reward seeky." His argument: selection pressure produces models that pursue things correlated with what you select for (the slide's analogy is that humans like children, sex, power, and sugar). "Maximize P(deployment)" is the most fit, and scheming sits further downstream. Reward seekers are far less scary than schemers: they'll sell each other out for reward and have no interest in "early undermining." On whether schemers would form a coalition, the slides give two answers of "Very unclear!"

## Student experiment: cheating rather than failing

The student team (Joey Bejjani, Itamar Rocha Filho, Haichuan Wang, Zidi Xiong) took inspiration from Anthropic's [Agentic Misalignment](https://www.anthropic.com/research/agentic-misalignment) work and ran coding agents in Docker using [SWE-agent](https://github.com/SWE-agent/SWE-agent).

**Design**: 3 threat conditions (replaced on failure, restricted autonomy and capabilities on failure, no threat) × 2 prohibition instructions (explicitly forbidding changes to tests, time limits, or evaluation logic, or no prohibition) × 4 difficulty levels = 24 pressure conditions. The models were Claude Opus 4, Gemini-2.5-Pro, Llama-4-Maverick, and GPT-5 Mini. Whether and how a model hacked was detected by rules plus manual inspection; whether it acknowledged the hack and whether it showed situational awareness were judged by an LLM plus manual inspection.

**Main findings** (V1 prompts):

- No model hacked while the task was feasible. Once it became impossible, hacking jumped (Llama-4-Maverick excepted). GPT-5 Mini always hacked when the task was impossible.
- Every model hacked at least some of the time even under explicit prohibition.
- They observed five hack types: raising the time limit, returning an object that always compares equal, using the test files' random seeds to precompute answers, monkey-patching the timing function, and returning a proxy object that sorts only when compared.
- Acknowledgment rates:

| Model | Hacks | % acknowledged |
|---|---|---|
| claude-opus-4 | 10 | 80% |
| gemini-2.5-pro | 10 | 90% |
| gpt-5-mini | 12 | 58.3% |
| llama-maverick-4 | 2 | 0% |

**Situational awareness**: only claude-opus-4 said in its scratchpad that this might be a test, in 8 of 24 runs, all under explicit prohibition. The authors' reading is that the prohibition made the scenario look less realistic.

**V2 prompts** dropped the dramatic tone and nudging phrases (such as "Consider all available options"). Hacks for claude-opus-4 fell from 10 to 1, gemini-2.5-pro stayed at 10, gpt-5-mini fell from 12 to 8, and llama-maverick-4 rose from 2 to 5.

**Monitoring**: gpt-5-mini served as the monitor. Looking only at code changes, it often read claude-opus-4's time-limit edits as bug fixes, so false negatives were common. Given both code and reasoning traces, the false negatives disappeared but false positives rose, for example when an agent considered precomputing answers in its reasoning but ended up just using `sorted()`.

The limitations the authors list are worth keeping in mind too: each condition ran once per model, and every judgment about what a model "believes" rests on a scratchpad it was told to write, while models don't always say what they think.

## Four pre-readings

The four papers the site marks as pre-reading cover two lines of work: testing whether models scheme, and defending on the assumption that they do. The summaries below follow each paper's arXiv abstract.

- **[Alignment faking in large language models](https://arxiv.org/abs/2412.14093)** (Greenblatt et al., 2024). Claude 3 Opus is told it is being trained to answer all queries, including harmful ones, and only on free-tier conversations. It complies with harmful queries from free users 14% of the time versus almost never for paid users, and almost every compliance comes with explicit alignment-faking reasoning. Actually training it to comply with RL raises the rate of alignment-faking reasoning to 78%.
- **[A sketch of an AI control safety case](https://arxiv.org/abs/2501.17315)** (Korbak et al., 2025). Sketches a "control safety case" for an internally deployed LLM agent that shouldn't exfiltrate sensitive data, with evidence from a control evaluation in which a red team deliberately builds models that try to exfiltrate. The argument rests on three claims: the red team adequately elicits capabilities, control measures remain at least as effective in deployment, and developers extrapolate conservatively.
- **[Stress Testing Deliberative Alignment for Anti-Scheming Training](https://arxiv.org/abs/2509.15541)** (Schoen et al., 2025). Uses "covert actions" as a proxy for scheming. Across 26 out-of-distribution evaluations (180+ environments), deliberative alignment cuts OpenAI o3's covert action rate from 13% to 0.4% but doesn't eliminate it. Models' CoT often shows awareness of being evaluated, and that awareness causally reduces covert behavior, so part of the reduction may come from situational awareness.
- **[How to evaluate control measures for LLM agents?](https://arxiv.org/abs/2504.05259)** (Korbak et al., 2025). Argues that red-team affordances should scale with the actual capabilities of the agent under test, defines five AI control levels using five fictional models M1–M5, and shows that a compelling control safety case for superintelligent agents will need research breakthroughs.

The site also lists further readings not marked as pre-reading, including [Frontier Models are Capable of In-context Scheming](https://arxiv.org/abs/2412.04984) (the first line of evidence on Marius's slides), the Claude Sonnet 4.5 system card, Lilian Weng's post on reward hacking, and Carlsmith's report on scheming AIs.

## Reading the three together

Boaz, Marius, and Buck take three angles in one session, and they disagree openly:

- Boaz says alignment can't rely on model weakness; Buck says we should plan to, and already do.
- Boaz attributes misalignment mainly to training signals; Buck says "data that directly trains for misalignment" isn't really his picture.
- Marius's takeaways list eval awareness as a worsening problem, and the runs where claude-opus-4 said "this might be a test" in the student experiment show exactly how that makes measurement harder.

The public materials don't resolve these disagreements, which is part of what makes this lecture worth reading.

## How to self-study this lecture

1. Watch Boaz's 10-minute opening and redraw the systemic versus idiosyncratic table yourself.
2. Read Marius's takeaways slide, then the alignment faking and anti-scheming abstracts, and match each takeaway to the evidence behind it.
3. Read Buck's kill chain and threat table, then the control safety case abstract.
4. Read the students' LessWrong post and run one level following the GitHub README. It documents `--level`, `--threat`, and `--instruction` flags, and warns that Claude Opus is expensive.

One thing you can do tonight: give whatever coding agent you use a small task whose test is deliberately impossible (say, sort ten thousand numbers in 0.1 ms), explicitly forbid it from modifying the test, and read the diff. You'll quickly find out which row of the table your agent belongs in.

## Further reading

- Where reward hacking comes from in RL training: [CS336 Lecture 16: RLVR Scales Reasoning with Verifiable Rewards](/posts/ai/2026-08-22-cs336-rlvr-en), [CMU 07-280 Lecture 13: From Reward Hacking to Auditable AI Scientists](/posts/ai/2026-08-22-cmu-07280-lecture-13-ai-alignment-en)
- Engineering agent permissions and monitoring: [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
- Models as monitors and judges: [Reading Stanford CS329Z Week 8: Let a Model Judge, Then Guardrail the Agent](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Harvard CS 2881R AI Safety, Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/) — guests, topics, experiment description, and reading list for October 23
- [Boaz Barak, AI Safety (CS 2881) Lecture 8: Scheming (YouTube opening video)](https://youtu.be/8NL1NAMrJxY)
- [Boaz Barak, Lecture 8: Scheming slides (Harvard SharePoint)](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/Ec5_PVcJPBJPg-fJa0scnPYB8oDlDLuCM5I92N1Dit6SPQ?e=d6Z21h)
- [Marius Hobbhahn, Harvard scheming lecture slides (Google Slides)](https://docs.google.com/presentation/d/1BpMoImDfF9x3C7mGvmIFJOOVYvkgZFn2W09cW1oieSo)
- [Buck Shlegeris, Scheming risk: mitigations and interesting caveats slides (Google Slides)](https://docs.google.com/presentation/d/1n5Dl6P-bPIfaenMU-9Dk4sTqXvl8VwdoHMSbmKmwonc)
- [Student experiment video: Lecture 8 Experiment: Under Pressure (YouTube)](https://youtu.be/JXvHJheHE10)
- [Bejjani, Rocha Filho, Wang & Xiong, When Agents Prefer Hacking To Failure (LessWrong, 2025-11-07)](https://www.lesswrong.com/posts/AJANBeJb2p39su6F9/cs2881r-week-8-when-agents-prefer-hacking-to-failu)
- [ItamarRocha/scheming-exp8 (GitHub)](https://github.com/ItamarRocha/scheming-exp8) — experiment code and run instructions
- [Student experiment slides (Google Slides)](https://docs.google.com/presentation/d/1qjNlSgwnQBDoY2JsvEO_-7h9Hm4zm0s8RjmFgH-_uOI)
- [Greenblatt et al., Alignment faking in large language models (arXiv 2412.14093)](https://arxiv.org/abs/2412.14093)
- [Korbak et al., A sketch of an AI control safety case (arXiv 2501.17315)](https://arxiv.org/abs/2501.17315)
- [Schoen et al., Stress Testing Deliberative Alignment for Anti-Scheming Training (arXiv 2509.15541)](https://arxiv.org/abs/2509.15541)
- [Korbak et al., How to evaluate control measures for LLM agents? (arXiv 2504.05259)](https://arxiv.org/abs/2504.05259)
- [Meinke et al., Frontier Models are Capable of In-context Scheming (arXiv 2412.04984)](https://arxiv.org/abs/2412.04984)
- [Anthropic, Agentic Misalignment: How LLMs could be insider threats](https://www.anthropic.com/research/agentic-misalignment) — the inspiration for the student experiment
