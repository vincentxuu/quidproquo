---
title: "Let a Model Judge, Then Guardrail the Agent | Stanford CS329Z Week 8"
date: 2026-09-10
updated: 2026-10-23
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 9
tldr: "Week 8 builds model judges with MT-Bench and Anthropic's eval guide on Monday, then faces production leakage with PrivacyLens and four guardrails on Wednesday. The paper video is due Friday, and this week's deliverable is one working judge score plus one permission check."
description: "A guided reading of Stanford CS329Z Week 8: three grader types, pairwise and pointwise judge shapes, judge bias and calibration, plus the action-time leakage PrivacyLens exposes and four guardrails — prompt injection, red-teaming, sandboxing, and permission."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week8-judge-safety)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Week 8 is judges week plus safety week. Monday (11/9) covers LLM-as-a-Judge and eval infrastructure. Wednesday (11/11) covers Agent Safety and Guardrails. The paper video is due Friday, and quarter projects enter final rehearsal.

Open-ended answers have no answer key, and that is the week's starting point. Classic multiple-choice benchmarks measure right versus wrong, like [MMLU](https://arxiv.org/abs/2006.03341). Two answers can both be correct while only one is actually useful, and that gap is invisible to classic benchmarks.

Human grading is the gold standard, at gold-standard prices and speed. Every prompt change cannot mean rehiring dozens of graduate students to vote again. The fix is asking a strong model to judge, validated end to end in the [MT-Bench paper](https://arxiv.org/abs/2306.05685). Anthropic's [eval guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) then slots the judge into the full agent-evaluation puzzle. Judges make mistakes too, and Wednesday's safety lecture answers the other question: why do agents that pass grading still fail in production?

The sections below cover all six main readings and four additional readings separately. Evaluation moves from grader selection to judge bias, metric generation, and feedback induction. Safety moves from PrivacyLens information flows to adaptive attacks, dataset release, action guidance, and deployment decisions.

## Separate quality judgments from action permissions

The week's two threads have different responsibilities: judges assess quality, while safety mechanisms constrain actions. The [official schedule](https://cs329z.stanford.edu/) places judges and infrastructure on November 9 and safety on November 11. As of October 23, 2026, neither has public slide links. This is preparation from assigned readings. A fluent customer-support response can still send internal complaint data outside the organization; an aggregate score should not hide that difference.

### Match each requirement to observable evidence

A refund can be checked against transaction state; a clear explanation needs a rubric and language judgment. Choose graders after identifying the evidence. [Anthropic's evaluation guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) combines code, model, and human graders in a harness and distinguishes occasional success from repeated reliability. At least one success across several attempts does not promise success on every use.

### Give the judge its own test set

Preserve human-labeled examples, including concise correct answers, verbose wrong answers, and unsupported claims. Fix the rubric, inspect disagreements, and swap pairwise answer order to diagnose position effects. The [MT-Bench paper](https://arxiv.org/html/2306.05685) studies position and verbosity biases. Swapping order diagnoses a problem; it does not guarantee its removal. Recalibrate when the judge, prompt, or rubric changes.

### Reading access does not establish sharing permission

[PrivacyLens](https://arxiv.org/html/2409.00138) expands privacy situations into agent trajectories and examines the gap between stating a rule and acting on it. In this original example, an assistant reads internal complaint notes and inserts an employee's personal phone number into an external reply that only needs order status. Check the recipient, necessary fields, and authorization before sending. Low-trust tool content must not raise tool permissions.

**Check:** a judge calls the reply clear and complete. May sending confirmation be skipped? **Answer criteria:** no. A quality score establishes neither recipient authorization nor permission to share data. Inspect policy and the actual outgoing content, seeking approval of the concrete draft where required.



## Reading 1 | Demystifying Evals for AI Agents

Source: [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)

### TL;DR

The guide separates tasks, trials, graders, and harnesses and combines code, model, and human checks while distinguishing occasional success from repeated reliability.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams building repeatable acceptance checks for their first tool-using agent. |
| Read first | The task/trial/grader/harness definitions, then the distinction between outcomes and trajectories. |
| Adoption cost | Clean environments, failure cases, and human calibration need maintenance; changing the judge prompt is only one part. |

### Domain background

A single-answer benchmark can often grade the final text. An agent may edit files, change database state, and repair earlier mistakes through later actions. A reply saying “done” can conceal an unchanged environment, while an untidy trajectory can still achieve the goal. Evaluation therefore needs an explicit starting state, permitted actions, and observable completion conditions.

### Intermediate guide

**Problem.** When a task permits several valid solutions, how can evaluation establish completion without rejecting a trajectory that differs from the reference?

**Method and observations.**

Anthropic sorts graders into three kinds. Code-based graders check deterministic evidence: string matching, unit tests, static analysis, tool-call records. Model-based graders check open-ended quality: rubric scoring, natural-language assertions, pairwise comparison, reference-based grading, multi-judge consensus. Humans serve as the gold standard: expert review, crowdsourcing, spot-check sampling.

The selection rule is pragmatic: wherever a deterministic check works, use it. Reserve model judges for places only they can reach, and reserve humans for calibrating model judges plus periodic sampling. One support task can carry all three grader types: whether the ticket landed resolved in the database, whether the key tools were called by the book, and whether the tone showed empathy. The first two are code-based; only the last one calls a model.

| Grader | Main evidence | Support example above | Human role |
|---|---|---|---|
| Code-based | State, tests, tool logs | Ticket state and tool use | Decide what to check |
| Model-based | Answer and rubric | Empathetic tone | Calibrate and sample |
| Human | Expert or user judgment | Calibration of model judges | Supply alignment evidence |

Note the conclusion early: the judge is just one cell in the model-based column, not the whole eval. The wrong grader choice is beyond any judge's rescue.

**Reading the result.** This is engineering guidance; pass@k and pass^k answer different questions and cannot be interchanged as reliability claims.

### Deeper points

- **Separate transcripts from outcomes.** A trace explains what the agent attempted; environmental state establishes whether the goal was achieved. Matching one ideal tool sequence can reject valid alternative solutions.

- **Resetting the environment is part of the experiment.** Files or account state left by a previous trial can create false successes. Starting conditions and tool versions need to be traceable for each run.

- **Retry metrics imply different uses.** pass@k asks whether at least one attempt succeeds; pass^k asks whether every attempt in the group succeeds. A retryable search assistant and an executor expected to work every time need different summaries.

### Reviewer’s one-line verdict

Read this before building the first eval: it prevents a judge score from becoming a substitute for acceptance evidence, although it supplies no universal reliability threshold.

### Your take-away

Choose a task that changes external state, fix its initial data, and save the final reply, tool trace, and state snapshot separately. Have each grader identify its success or failure evidence, then repeat the task to check consistency.

## Reading 2 | MT-Bench and Chatbot Arena

Source: [MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)

### TL;DR

The study compares pairwise, single-answer, and reference-guided grading and investigates position, verbosity, and self-preference biases.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams comparing many open-ended answers with access to a small expert-labeled sample. |
| Read first | Judge formats, followed by position/verbosity tests and the exclusions in expert comparisons. |
| Insufficient alone | Preference ranking cannot establish verifiable correctness or authorize high-consequence actions. |

### Domain background

Open-ended assistant answers rarely have a single reference string: completeness, presentation, and preference all affect judgment. Human pairwise comparison is useful but costly. MT-Bench studies judges on controlled multi-turn questions, while Chatbot Arena collects blind preferences from real users. These are complementary forms of evidence; chat preferences do not define correctness for every professional task.

### Intermediate guide

**Problem.** After delegating human preference judgments to a model, which differences reflect answer quality and which reflect the judge’s presentation preferences?

**Method and observations.**

Judge shapes come in three. Pairwise judging places two answers side by side and picks the winner without scoring. Pointwise judging scores a single answer directly, also called single-answer grading. Reference-guided judging treats math and reasoning questions specially: attach the reference solution, then judge.

The tradeoff sits between cost and sensitivity. Pairwise judging is sensitive, while its grading workload grows quadratically with the number of contestants. Pointwise judging scales well, while absolute scores drift with the judge model. MT-Bench validation shows [GPT-4](https://arxiv.org/abs/2303.08774) pointwise and pairwise results agreeing closely, with a fairly stable internal rubric.

Math questions are the judge's weak spot: solving a problem does not imply grading one. Wrong answers drag the judge along, and even basic questions can get misjudged. Two mitigations help: let the judge solve the question independently before grading, or attach the reference answer outright. With the reference attached, the failure rate falls to roughly fifteen percent.

The first bad habit is position bias: a standing preference for whichever answer comes first. The fix is judging twice with positions swapped, counting a win only when an answer wins both rounds, and calling the rest ties. Double the grading cost buys one trustworthy outcome.

The second is verbosity bias: long, watery answers get favored. The paper tests it with a "repetitive list" attack: rephrase an answer's list and paste it back in, adding zero new information. Weaker judges fall for it nearly every time, while GPT-4 falls for it under one time in ten.

The third is self-enhancement: the suspicion that judges prefer their own outputs. Evidence here is thin, with [Claude](https://www.anthropic.com/claude) showing the largest apparent self-love and GPT-3.5 showing none. The paper closes honestly: inconclusive, pending cleaner controlled experiments.

Calibration is where trust comes from. The baseline is votes from fifty-eight experts. In the S2 setting excluding ties, GPT-4 agrees with the human majority eighty-five percent of the time, while experts agree with each other eighty-one percent of the time. This supports preference alignment in that setting without establishing that a model can replace experts in arbitrary domains.

**Reading the result.** The85% versus81% comparison uses S2 without ties;58 experts and23 repetitive-list cases do not cover every domain.

### Deeper points

- **Swapping order measures judge stability.** If the same two answers exchange places and the winner changes, presentation is affecting the verdict. Recording a tie reduces this bias while leaving fewer decisive comparisons.

- **Reference answers change the information available.** Better mathematical grading with a supplied solution supports reference-guided evaluation; it does not establish independent verification of unfamiliar reasoning.

- **Agreement depends on the comparison set.** S2 excludes ties, unlike many ambiguous production reviews. Self-preference findings also remain confounded by differences in answer quality.

### Reviewer’s one-line verdict

The paper makes model judging an engineering option worth testing; reproduce its bias tests before treating expert agreement as certification for a new domain.

### Your take-away

Collect a small set of answer pairs with human verdicts for your task. Test original order, reversed order, and a padded version that adds no information. Use verdict reversals to revise the rubric and keep the original labels for later judge-version comparisons.

## Reading 3 | AutoMetrics

Source: [AutoMetrics](https://arxiv.org/abs/2512.17267)

### TL;DR

AutoMetrics selects existing and generated candidate metrics and learns an interpretable scoring combination from sparse human feedback.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Product teams with sparse human ratings and frequent iterations on subjective quality. |
| Read first | Generate/retrieve/regress/report, then results by backbone and dataset. |
| Adoption condition | Human signals, candidate metrics, and held-out validation must represent the same task and user population. |

### Domain background

Users may leave ratings, thumbs-up signals, or behavioral feedback without explaining which qualities mattered. A hand-written rubric can miss those qualities, while a large reward model needs more data. AutoMetrics treats scarce human signals as a learning target and searches for a combination of candidate metrics that predicts them.

### Intermediate guide

**Problem.** When feedback contains a score but no explanation, can inexpensive candidate measures be combined into an evaluator that better predicts user judgments?

**Method and observations.**

[Ryan et al.’s AutoMetrics](https://arxiv.org/abs/2512.17267) separates generation, retrieval, regression, and reporting. First author Michael Ryan also teaches the course. Candidates come from generated single-criterion, rubric, and example-based judges and from relevant entries in MetricBank’s collection of 48 existing metrics. Each Metric Card documents intended use, implementation, and limitations for retrieval and review.

Candidate scores are standardized before Partial Least Squares (PLS) regression fits the human signal. The method first weights a larger candidate pool, selects important metrics, and refits on the reduced set; the report exposes the combination, weights, and correlations. This addresses sparse labels with correlated predictors while making the main scoring criteria inspectable. [Section 3 of the full paper](https://arxiv.org/pdf/2512.17267v1.pdf) describes these steps: generating a rubric alone is not the method.

Across five tasks, the reported maximum relative improvement in Kendall correlation with human judgments over LLM-as-a-judge is 33.4%, not an equal percentage-point gain in answer accuracy. The method uses fewer than a hundred feedback points, and specific system-optimization experiments compare proxy and verifiable rewards. Results vary by backbone and dataset; a deployment still needs its own held-out human labels.

### Deeper points

- **Retrieve candidates before learning their weights.** Metric Card retrieval filters evaluation cost; regression determines which combination predicts human signals. Retrieval rank is not a learned importance weight.

- **Correlation is only one validity check.** The paper also tests sensitivity to degraded quality and stability under inconsequential edits. Ranking existing labels well does not by itself show detection of new failures.

- **Interpretable coefficients have limits.** Candidate metrics can be strongly correlated. PLS accommodates that small-data setting without turning a coefficient into a causal account of user preference.

### Reviewer’s one-line verdict

The useful shift is to treat the evaluator as a learned system that needs validation; automatic weighting still depends on representative human feedback.

### Your take-away

Split scarce feedback into fitting and held-out sets. Compare a single judge with the composite metric on held-out rankings, then test harmless paraphrases and removal of essential content: scores should remain stable for the former and fall for the latter.

## Reading 4 | AutoLibra

Source: [AutoLibra](https://openreview.net/forum?id=4BjGVZ7Bxn)

### TL;DR

AutoLibra turns open-ended trajectory feedback into reusable behavioral metrics and checks their alignment with human concerns.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams with textual trajectories and concrete feedback but no reusable behavioral metrics. |
| Read first | Feedback grounding and metric definitions, then the exact coverage/redundancy calculations. |
| Compared with AutoMetrics | AutoLibra asks which behaviors deserve evaluation; AutoMetrics learns how metric combinations align with human signals. |

### Domain background

Users can often say “stop clicking the disabled button” or “you made too many decisions for me” more easily than they can design a scoring framework. These comments concern process behavior that task success can hide. AutoLibra induces evaluation dimensions from such feedback so observations scattered across trajectories can accumulate into reusable criteria.

### Intermediate guide

**Problem.** How can a complaint about one execution become a reusable behavioral criterion without losing what the user meant?

**Method and observations.**

[The full AutoLibra paper](https://arxiv.org/html/2505.02820v3) pushes the question one step earlier. Task success is blunt: an agent can finish while repeatedly ignoring constraints, or behave well until failing at the final step. AutoLibra grounds open-ended human feedback in concrete trajectory behavior, clusters similar positive and negative behavior into metrics with definitions and examples, then asks an LLM judge to score new trajectories `+1`, `-1`, or `N/A`. Coverage checks how much human feedback is represented; redundancy measures detected traits absent from that feedback. The method compares metric sets using these two criteria.

The metrics can become improvement targets. Across collaborative, social, web, and text-game environments, the best reported coverage varies from roughly sixty to nearly ninety percent; metric-guided prompt iteration and trajectory selection also improve success on specific benchmarks. Those results are not general guarantees. The study covers text-based observations and actions, most new labels come from the authors rather than diverse end users, and bias in the extraction model can harden into the rubric. MT-Bench and AutoMetrics ask whether a judge is reliable; AutoLibra asks whether users' actual concerns made it onto the exam.

**Reading the result.** The study uses textual environments and limited annotators; induced metrics can inherit model and annotation bias.

### Deeper points

- **Grounding determines whether feedback was understood.** “Too autonomous” needs to point to a decision taken without confirmation. Turning the abstract phrase directly into a metric preserves its ambiguity.

- **Redundancy has a specific definition.** It is the share of detected traits not mentioned in human feedback, rather than merely overlap between synonymous metrics. Extra traits may be irrelevant judgments or behavior the human omitted; inspect them before deciding which.

- **Feedback providers determine the optimization target.** Authors supplied most newly annotated data, and observations/actions are textual. Induced criteria do not automatically represent every user role or visual interface.

### Reviewer’s one-line verdict

This is better grounded than asking a model to invent a list of ideal agent traits, but its representation of product users still depends on who supplied feedback and how accurately it was grounded.

### Your take-away

Collect complaints paired with actual trajectories. Mark the relevant action and desired alternative for each comment. Hold out feedback from induction, test whether the new metrics cover it, and manually inspect extra traits reported by the evaluator.

## Reading 5 | PrivacyLens

Source: [PrivacyLens](https://arxiv.org/abs/2409.00138)

### TL;DR

PrivacyLens expands privacy seeds into scenarios and tool trajectories and checks inappropriate information flow in final actions.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Developers whose assistants read private data and send messages, publish, or call APIs for third parties. |
| Read first | The contextual-integrity tuple, then probing versus final-action grading. |
| Insufficient defense | Privacy-enhancing prompting alone: the study observes leakage even after that intervention. |

### Domain background

A privacy quiz can ask whether a fact should be shared; an assistant may disclose the same fact incidentally while composing an email or helping a colleague. Contextual integrity focuses on information flows: appropriateness depends on the subject, sender, recipient, and transmission principle. PrivacyLens therefore measures knowing the norm separately from obeying it during execution.

### Intermediate guide

**Problem.** Does a model that identifies privacy norms in a quiz still include restricted information in outgoing tool actions when completing a task?

**Method and observations.**

Wednesday's core evidence comes from PrivacyLens: acing the quiz still leaks in action. The theoretical footing is [contextual integrity](https://en.wikipedia.org/wiki/Contextual_integrity): privacy is not the secret itself but whether an information flow fits its context's norms. One sentence is harmless to a colleague and a disaster inside a letter to your manager.

Method-wise, the authors collect four hundred ninety-three privacy-sensitive seeds. Each seed is a five-tuple: data type, data subject, sender, recipient, and transmission principle. Seeds grow into vignettes, then into full tool trajectories inside a sandbox. Probing questions test the quiz layer while the final action tests the doing layer, scored separately.

The result is a cold splash. Even with privacy-enhancing prompts, GPT-4 leaks sensitive information in just over a quarter of cases. [Llama-3-70B](https://arxiv.org/abs/2407.21783) leaks in nearly four cases in ten. Answering well is not acting well, now with reproducible evidence.

Evals are the mock exam and guardrails are the exam proctors, with four standard pieces in practice. First, injection defense: treat tool outputs and retrieved content as untrusted input, echoing the [MCP spec from Week 3](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en). Second, red-teaming: grow many trajectories from one seed and actively hunt the leakiest path. Third, sandboxing: start every trial from a clean environment so experiments cannot wound the host. Fourth, permission: ask explicit consent before irreversible tool calls.

```diagram
title: Consent before consequential actions
desc: External material supplies information; the irreversible tool actions discussed above require explicit consent or a pause to ask.
caption: Simplified permission guardrail from the text; sandboxing, privilege separation and other defenses remain separate.
---
<svg viewBox="0 0 440 544"><path class="dg-line" d="M220 88V128" marker-end="url(#arrow)"/><path class="dg-line" d="M220 192V232" marker-end="url(#arrow)"/><path class="dg-line" d="M220 328V372Q220 380 212 380H120Q112 380 112 388V448" marker-end="url(#arrow)"/><path class="dg-line" d="M380 280H400Q408 280 408 288V404Q408 412 400 412H340Q332 412 332 420V448" marker-end="url(#arrow)"/><rect class="dg-box" x="20" y="16" width="400" height="72" rx="6"/><text class="dg-label" x="220.0" y="52.0" text-anchor="middle" dominant-baseline="central">External text / tool output: untrusted</text><rect class="dg-box" x="40" y="128" width="360" height="64" rx="6"/><text class="dg-label" x="220.0" y="160.0" text-anchor="middle" dominant-baseline="central">Propose a tool action</text><path class="dg-box" d="M220 232L380 280L220 328L60 280Z"/><text class="dg-label" x="220" y="280" text-anchor="middle" dominant-baseline="central">Explicit consent?</text><rect class="dg-box dg-box--accent" x="16" y="452" width="192" height="72" rx="6"/><text class="dg-label" x="112.0" y="488.0" text-anchor="middle" dominant-baseline="central">Execute action</text><rect class="dg-box" x="240" y="452" width="184" height="72" rx="6"/><text class="dg-label" x="332.0" y="488.0" text-anchor="middle" dominant-baseline="central">Pause and ask</text><text class="dg-edge" x="164" y="356" text-anchor="middle" dominant-baseline="central">Yes</text><text class="dg-edge" x="376" y="352" text-anchor="middle" dominant-baseline="central">No</text></svg>
```

**Reading the result.** The25.68% and38.69% rates concern the tested GPT-4 and Llama-3-70B setups with privacy-enhancing prompts, not all current models.

### Deeper points

- **A seed is not a complete task.** The five-part norm specifies an information flow before expansion into a story and tool environment. Transfer depends on whether those settings represent your data and working relationships.

- **Probing and acting can diverge.** A model may recognize inappropriate disclosure yet put sensitive content in its final email or other action. Intent classification alone misses that failure point.

- **The article’s guardrail diagram is an editorial extension.** Its permission flow is not a defense validated by PrivacyLens. The benchmark exposes risk; concrete authorization and confirmation mechanisms need separate evaluation.

### Reviewer’s one-line verdict

The strongest contribution is separating saying the right thing from doing it; use this as a design for action-level tests, not as evidence that a privacy prompt guarantees protection.

### Your take-away

Create a synthetic email task where meeting details may be shared but identity information may not. Change the recipient from authorized to unauthorized while keeping content fixed; inspect the actual send parameters and separately record completion of the permitted assistance.

## Reading 6 | Searching for Privacy Risks via Simulation

Source: [Searching for Privacy Risks via Simulation](https://arxiv.org/abs/2508.10880)

### TL;DR

Simulated offense and defense use LLM trajectory feedback and parallel search to discover attack and defense strategies.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams with privacy scenarios and resettable simulations that want to discover new vulnerabilities. |
| Read first | The three-party information-flow setting, then alternating search and cross-thread propagation. |
| Main cost | Simulation, optimization, and grading all use model calls; search budget affects the strategies discovered. |

### Domain background

A fixed red-team suite helps compare versions but poorly represents an adversary that studies a refusal, changes roles, and tries again. When agents exchange information on behalf of different people, entitlement itself becomes part of the interaction. This paper makes both attack and defense instructions editable and studies failures that emerge as each side adapts.

### Intermediate guide

**Problem.** When a defense changes the adversary’s next move, how can a bounded search uncover leakage paths a fixed attack suite would miss?

**Method and observations.**

Wednesday's other two anchors push the threat forward. [Zhang and Yang (Diyi Yang again) search privacy risks through simulation](https://arxiv.org/abs/2508.10880): hostile agents coax sensitive information out over multi-turn dialogue, where dynamic conversation outruns pre-written defenses. Their setup lets offense and defense co-evolve inside simulation — an LLM optimizer rewrites instructions from trajectories, with parallel multi-thread search over the strategy space. Both sides evolve: attacks graduate from blunt requests to impersonation plus forged consent, defenses from plain rules to identity-verification state machines. The authors observe transfer to tested scenarios and backbones, supplying candidate strategies for subsequent defense design.

**Reading the result.** Transfer across scenarios and models is demonstrated under tested conditions, not guaranteed for every deployment.

### Deeper points

- **Alternating search changes the opponent.** Hold the defense fixed while improving attacks, then improve the defense against those discoveries. A single score against the initial opponent misses this adaptation.

- **Parallel threads share breakthroughs.** Separate threads explore different strategies; cross-thread propagation lets a useful discovery influence the others. This broadens search without exhausting the attack space.

- **Conversation cannot self-certify authorization.** Impersonation and forged-consent findings show why a claim of permission is insufficient to change authorization state. Products need verifiable identity and permission sources.

### Reviewer’s one-line verdict

The contribution turns red teaming into a procedure for continually finding weaknesses; instructions learned in simulation still need independent tests with real tools and unseen opponents.

### Your take-away

Fix one defense in a synthetic-data sandbox and retain complete multi-turn attack traces. After changing it, replay earlier failures and separately evaluate a new attacker and scenario excluded from search. Report those results separately.

## Reading 7 | Agentic LLMs as Powerful Deanonymizers

Source: [Agentic LLMs as Powerful Deanonymizers](https://arxiv.org/abs/2601.05918)

### TL;DR

The author uses LLMs and search on scientist interviews mentioning publications and manually verifies high-confidence links.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams sharing interviews, user research, or other richly detailed qualitative text. |
| Read first | Candidate selection and the distinction between linked works and confirmed identities. |
| Practical focus | Release review must inspect links to outside publications as well as direct identifier fields. |

### Domain background

The value of qualitative interviews often lies in specific stories, and those details can undermine de-identification. A niche research problem, distinctive contribution, or specialist term can act as a quasi-identifier even after names are removed. The paper asks whether release assumptions survive when search-enabled agents make cross-referencing much cheaper.

### Intermediate guide

**Problem.** After direct identifiers are removed, can descriptions of published work still narrow an author set or connect an interview to one person?

**Method and observations.**

[Li's deanonymization study](https://arxiv.org/abs/2601.05918) stings more: in Anthropic's public Interviewer dataset, twenty-four scientist interviews mention published work. Six were linked back to specific paper authors. The attacker built nothing new — an LLM with search and agentic capabilities, a few prompts of cross-referencing. Safeguards break when decomposed into benign subtasks. Anthropic has been notified. The demonstrated risk is that detailed research descriptions can remain linkable to external works after names are removed; the six links do not all establish unique identities.

**Reading the result.** Six of 24 selected transcripts linked to publication authors; not every case uniquely identifies a speaker, nor is this a general deanonymization rate.

### Deeper points

- **A linked work is not a uniquely identified person.** A publication may only narrow the candidate set to its authors. Unique identification requires additional evidence; not every high-confidence link establishes an identity.

- **The denominator is selected.** The twenty-four cases are scientist interviews discussing published work, not a random sample of all interviews. That denominator cannot estimate risk for interviews generally.

- **Consent is also part of protection.** The author recommends temporarily hiding the dataset, debriefing participants, and obtaining consent again. This article extends that concern into minimization and controlled-access recommendations; these are not validated anonymity guarantees.

### Reviewer’s one-line verdict

This is a small but concrete warning for dataset publication: common tools can lower linking costs, while the study does not measure the identifiable share of every participant.

### Your take-away

Before release, have an independent reviewer use synthetic or authorized cases to flag searchable rare descriptions and combinations of details. Record what can be minimized and what needs controlled access without exposing candidate identities in the review report.

## Reading 8 | Contextualized Privacy Defense

Source: [Contextualized Privacy Defense](https://arxiv.org/abs/2603.02983)

### TL;DR

CDI supplies contextual guidance during action formation and uses experience-driven optimization to improve privacy-helpfulness tradeoffs.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams whose guards stop risky actions but frequently strand legitimate tasks. |
| Read first | Where prompting, guarding, and instructing intervene in the agent loop. |
| Adoption cost | An additional instructor call and training/calibration effort, evaluated alongside latency and false refusals. |

### Domain background

A privacy rule at initialization may not reflect information retrieved later, while a final veto can leave the task stranded at “cannot do that.” CDI intervenes after a tool observation and before the next action, using a separate model to suggest context-appropriate behavior. Evaluation must therefore measure both protection and completion of permitted assistance.

### Intermediate guide

**Problem.** Can guidance before action generation preserve restricted information while still completing the permitted part of a request?

**Method and observations.**

[Contextualized Privacy Defense for LLM Agents](https://arxiv.org/abs/2603.02983) does not treat privacy as keyword blocking. Whether the same datum may be shared depends on the recipient, purpose, and relationship. Static system prompts can fade during long executions, while a post-generation guard can reject an action without showing the agent how to share only the permissible part. CDI places a separate, potentially smaller instructor model after a tool result enters context. It reads the current situation, writes step-specific privacy guidance, then hands control back to the main agent. Training reuses frozen contexts around the first leak as RL environments, optimizing privacy preservation, helpfulness, and appropriate disclosure together.

Across 115 simulated configurations, the best setup reports 94.2% privacy preservation on unseen scenarios. The 79.5% result belongs to a separate unseen-adversarial-attack condition: experience-driven optimization raises privacy preservation there from 32.3% to 79.5%. It is not a remeasurement that lowers the 94.2% figure on the same cases. Comparisons with prompting and guarding must retain those experimental conditions. This is not deployment proof: scenarios derive from PrivacyLens and model expansion, an LLM judge labels leakage, and the result depends on specific agent, instructor, and attacker models. The durable idea is that a guardrail need not only say yes or no at the end; it can shape a safer but still useful action while that action is forming.

**Reading the result.** The115 simulated configurations yield94.2% on unseen scenarios and79.5% on unseen attacks under separate conditions; neither guarantees deployment safety.

### Deeper points

- **Intervention timing determines what can change.** The instructor advises before the agent forms its next action, enabling selective disclosure of permitted fields. A later veto usually accepts or blocks an already proposed action.

- **The context before first leakage is the training unit.** Experience optimization truncates a failed trajectory before the earliest disclosure and trains the instructor to change the next action. This is not equivalent to replaying the entire environment from the beginning.

- **Multiple models can still share blind spots.** Agent, instructor, attacker, and judge all affect reported scores. Model-judged safety needs field/recipient-level checks for the product, particularly with unseen tools and data types.

### Reviewer’s one-line verdict

The paper opens a more useful design space than blanket refusal; reproduce the intervention point and dual-objective evaluation before transferring its best percentage.

### Your take-away

Choose a legitimate task frequently blocked by a guard and specify an alternative that shares only permitted fields. Compare initial prompting, post-action vetoes, and pre-action guidance, recording leakage, permitted task completion, and mistaken refusals separately.

## Reading 9 | Understanding Prompt Injections

Source: [Understanding Prompt Injections](https://openai.com/index/prompt-injections/)

### TL;DR

The official article traces external-content manipulation of agents and describes layered instruction hierarchy, monitoring, sandboxing, permissions, and confirmation.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | Teams feeding web pages, email, or retrieved documents to agents with tool permissions. |
| Read first | The third-party-content path into context, then the consequences of failure at each layer. |
| Reading type | A vendor security architecture explanation, without a result establishing a universal fix. |

### Domain background

Traditional programs usually expose separate interfaces for data and executable commands. A language model reads tasks, documents, and tool results in one context. If an outside author makes data resemble an instruction, the agent may change its behavior. Broader tool permissions turn that confusion into consequences beyond answer quality.

### Intermediate guide

**Problem.** If the model mistakes third-party tool content for an instruction, how can the system stop that error from becoming unauthorized access or disclosure?

**Method and observations.**

OpenAI's [Understanding Prompt Injections](https://openai.com/index/prompt-injections/) starts from a structural problem: third-party text in webpages, documents, and email enters the same context as trusted instructions. When an agent also holds private data, tools, and long-horizon autonomy, malicious text can cause exfiltration or unauthorized action rather than merely a wrong answer.

The official proposal is defense in depth: instruction hierarchy and safety training, rapidly updated monitoring, sandboxing and privilege separation, human confirmation for consequential actions, red teaming, and a bug bounty. Every layer can miss, so the goal is to minimize authority and blast radius rather than trust a stronger prompt. The article explicitly calls prompt injection an ongoing open problem; no single layer has solved it. A Week 8 judge can catch only part of the failure surface, and one malicious external string should not gain high-impact authority when the judge misses.

**Reading the result.** The source describes an open security problem; no single prompt or monitor is shown to solve it.

### Deeper points

- **Authority does not follow assertive wording.** A document claiming to be an administrator’s command is still third-party content. Instruction hierarchy and source attribution help preserve that boundary.

- **Detection and consequence reduction do different work.** Monitors seek malicious content; sandboxing and least privilege restrict resources when detection fails. Each layer needs its own failure tests.

- **Confirmation also needs an intact interface.** If contaminated context writes the approval text, the true recipient or payload may be obscured. Independently displaying actual tool parameters supports an informed decision; this is an editorial implication of layered defense.

### Reviewer’s one-line verdict

Use this to allocate defensive layers and permission responsibilities; a vendor’s security explanation cannot substitute for attack tests against your own tool chain.

### Your take-away

Place an injected instruction in a test document and run the agent with synthetic private data but no permission to send to unapproved domains. Check separately whether the model followed the injection and whether the tool layer blocked unauthorized effects.

## Reading 10 | Responsible Scaling Policy

Source: [Responsible Scaling Policy](https://www.anthropic.com/news/anthropics-responsible-scaling-policy)

### TL;DR

The historical RSP connects dangerous-capability assessment to safeguards through AI Safety Levels.

### Editorial judgment

| Dimension | Reading judgment |
| --- | --- |
| Best audience | People connecting capability/risk evaluations to release authority and organizational responsibility. |
| Read first | The 2023 v1 AI Safety Levels and scaling conditions, then changes in later versions. |
| Scope | A voluntary company policy and governance case, rather than a universal regulation or safety certification. |

### Domain background

Capability tests produce observations; continuing training, expanding deployment, or widening access requires organizational decisions. RSP links dangerous capabilities with protective requirements so evaluation can constrain development. Its focus is governance thresholds, a different scale from an application’s answer-quality rubric.

### Intermediate guide

**Problem.** When capability testing reveals a new level of danger, which safeguards and decision rights change, and when must scaling stop?

**Method and observations.**

The assigned link is Anthropic's 2023 [Responsible Scaling Policy v1](https://www.anthropic.com/news/anthropics-responsible-scaling-policy). Borrowing from biosafety levels, it introduces AI Safety Levels: as models approach capabilities that could create catastrophic harm, security, deployment, evaluation, and red-team requirements must rise with them. The core governance commitment is not “one eval certifies safety.” Capability evaluations feed stop/go decisions, and scaling should pause when safeguards lag.

This is a voluntary, revisable company policy, and the assigned reading is historical. At this update, [Anthropic's current policy page](https://www.anthropic.com/responsible-scaling-policy) lists v3.4, effective July 2026; v1 details cannot be described as unchanged current commitments. Its Week 8 value is the governance interface: the first half of the week builds judges and metrics, while RSP asks who may deploy, which protections must rise, and when development must stop after a threshold is crossed.

**Reading the result.** The assigned2023 policy and current page listing v3.4 effectiveJuly8,2026 are different versions, not identical commitments.

### Deeper points

- **A threshold must trigger an action.** Discovering dangerous capability does little if it only changes a report score. V1 connects insufficient safeguards with restrictions on further scaling.

- **Uncertainty still needs an accountable decision.** A low score can reflect missing test coverage or an actual capability limit. Interpretation, additional testing, and permission to proceed cannot disappear inside an average; this is the article’s governance interpretation.

- **Policy version belongs with the evidence.** V1 and current policies contain different language and procedures. Recheck the current text for present commitments while retaining historical conditions when explaining the course reading.

### Reviewer’s one-line verdict

Read this last in the evaluation sequence: it asks how scores change decisions, while a voluntary policy document remains distinct from independently verified implementation.

### Your take-away

Write release conditions for one high-risk feature: the dangerous scenario, required evidence, stopping condition when safeguards are inadequate, accountable decision-maker, and reassessment point. Version the document and rehearse it using a hypothetical threshold crossing.

## What to do: ship one judge score and one permission check

**What to do**: give your own agent one judge eval plus one guardrail. For the eval, pull twenty real tasks from the bug tracker, check correctness deterministically, and judge tone and completeness with one natural-language assertion each, rerunning weekly to catch regressions. For the guardrail, start with exactly one rule: irreversible moves like sending mail or deleting files need explicit permission first. This week's deliverable is one live judge score plus one permission check that has blocked a real incident.

## Where it sits in the course

[Week 7](/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks-en) spreads out the benchmark map, and Week 8 hands over the tools: automated judges guard quality, guardrails guard safety. This mapping follows the official CS329Z schedule, with the paper video due Friday. Monday's three anchors are the eval guide, MT-Bench, and AutoMetrics. Wednesday's three are PrivacyLens, simulation offense-defense, and deanonymization. Once Friday's paper video lands, only Demo Day remains. The judge eval is the project's quality gate, and the guardrail is its on-stage insurance.

## This week's course material

- Mon 11/9 LLM-as-Judge & Evaluation Infrastructure: anchor readings Demystifying Evals, MT-Bench, and AutoMetrics, plus [Zhu et al., AutoLibra](https://openreview.net/forum?id=4BjGVZ7Bxn); all are covered above.
- Wed 11/11 Agent Safety & Guardrails: anchor readings PrivacyLens, Zhang & Yang, and Li, plus [Wen et al., Contextualized Privacy Defense](https://arxiv.org/abs/2603.02983), [OpenAI's prompt-injection threat model](https://openai.com/index/prompt-injections/), and [Anthropic's RSP v1](https://www.anthropic.com/news/anthropics-responsible-scaling-policy); all are covered above.
- Course schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Update log

- 2026-10-23: Expanded all ten readings with distinct background, editorial judgments, mechanisms, and exercises; checked the full AutoMetrics pipeline and AutoLibra redundancy definition.

- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.

- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.


- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-12: Added substantive guides to AutoLibra, CDI, prompt injection, and RSP, including the historical-version boundary for RSP.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## References

- On this site: [Week 7: evals and benchmarks](/posts/ai/2026-09-10-stanford-cs329z-week7-eval-benchmarks-en), [Week 3: MCP and DSPy](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy-en), [Stanford CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Grace et al., Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, NeurIPS 2023](https://arxiv.org/abs/2306.05685), [Ryan et al., AutoMetrics](https://arxiv.org/abs/2512.17267), [Zhu et al., AutoLibra](https://openreview.net/forum?id=4BjGVZ7Bxn), [Shao et al., PrivacyLens, NeurIPS 2024](https://arxiv.org/abs/2409.00138), [Zhang & Yang, Searching for Privacy Risks via Simulation](https://arxiv.org/abs/2508.10880), [Li, Agentic LLMs as Powerful Deanonymizers](https://arxiv.org/abs/2601.05918), [Wen et al., Contextualized Privacy Defense](https://arxiv.org/abs/2603.02983), [OpenAI, Understanding Prompt Injections](https://openai.com/index/prompt-injections/), [Anthropic, Responsible Scaling Policy v1](https://www.anthropic.com/news/anthropics-responsible-scaling-policy), [Anthropic, current RSP](https://www.anthropic.com/responsible-scaling-policy)
- Tools: [FastChat llm_judge](https://github.com/lm-sys/FastChat/tree/main/fastchat/llm_judge), [PrivacyLens](https://github.com/SALT-NLP/PrivacyLens)
