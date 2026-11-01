---
title: "Put Guardrails on the Agent: Privacy, Prompt Injection, Sandboxes, and Permissions | Stanford CS329Z Lecture 15"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 16
tldr: "Per the schedule, Lecture 15 covers privacy risks from tool access, prompt injection including indirect injection, red-teaming, sandboxing and permission models, output guardrails, liability, responsible deployment and human-in-the-loop patterns. The readings run from PrivacyLens's leakage in action to simulated privacy-risk search, deanonymization, contextualized privacy defense, prompt injection and the Responsible Scaling Policy."
description: "A preview of Stanford CS329Z Lecture 15, Agent Safety & Guardrails: digests of PrivacyLens, privacy-risk simulation, deanonymization, contextualized defense, prompt injection and the RSP, organized into four guardrails: prompt-injection defense, red-teaming, sandboxing and permissions."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Passing a quality evaluation does not mean an agent can act unsupervised. Lecture 15 (Nov 11, Agent Safety & Guardrails) is about authorizing actions: data the agent can read is not data it may send, and instructions inside a web page or document are not the user's instructions. The schedule lists privacy risks from tool access, prompt injection, red-teaming, sandboxing and permission models, output guardrails, liability, and human-in-the-loop patterns. The paper video is due Friday, Nov 13.

The assigned readings are Shao et al.'s [PrivacyLens](https://arxiv.org/abs/2409.00138), Zhang and Yang's simulation-based search for privacy risks, and Li's work on agents as deanonymizers; the additional readings are contextualized privacy defense, OpenAI's explainer on prompt injection and Anthropic's Responsible Scaling Policy. This post digests all six. As of 2026-10-29 this lecture has no public slides, so this post is a preview built from the official schedule and assigned readings, not a record of what was said in class. Lecture numbers after 11 follow schedule order; the course site currently lists only dates and topics.

## Reading access does not establish sharing permission

[PrivacyLens](https://arxiv.org/html/2409.00138) expands privacy situations into agent trajectories and examines the gap between stating a rule and acting on it. In this original example, an assistant reads internal complaint notes and inserts an employee's personal phone number into an external reply that only needs order status. Check the recipient, necessary fields, and authorization before sending. Low-trust tool content must not raise tool permissions.

**Check:** a judge calls the reply clear and complete. May sending confirmation be skipped? **Answer criteria:** no. A quality score establishes neither recipient authorization nor permission to share data. Inspect policy and the actual outgoing content, seeking approval of the concrete draft where required.

## Reading 1 | PrivacyLens

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

This lecture's core evidence comes from PrivacyLens: acing the quiz still leaks in action. The theoretical footing is [contextual integrity](https://en.wikipedia.org/wiki/Contextual_integrity): privacy is not the secret itself but whether an information flow fits its context's norms. One sentence is harmless to a colleague and a disaster inside a letter to your manager.

Method-wise, the authors collect four hundred ninety-three privacy-sensitive seeds. Each seed is a five-tuple: data type, data subject, sender, recipient, and transmission principle. Seeds grow into vignettes, then into full tool trajectories inside a sandbox. Probing questions test the quiz layer while the final action tests the doing layer, scored separately.

The result is a cold splash. Even with privacy-enhancing prompts, GPT-4 leaks sensitive information in just over a quarter of cases. [Llama-3-70B](https://arxiv.org/abs/2407.21783) leaks in nearly four cases in ten. Answering well is not acting well, now with reproducible evidence.

Evals are the mock exam and guardrails are the exam proctors, with four standard pieces in practice. First, injection defense: treat tool outputs and retrieved content as untrusted input, echoing the [MCP spec from Lecture 4](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use-en). Second, red-teaming: grow many trajectories from one seed and actively hunt the leakiest path. Third, sandboxing: start every trial from a clean environment so experiments cannot wound the host. Fourth, permission: ask explicit consent before irreversible tool calls.

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

## Reading 2 | Searching for Privacy Risks via Simulation

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

The other two anchor readings push the threat forward. [Zhang and Yang (Diyi Yang again) search privacy risks through simulation](https://arxiv.org/abs/2508.10880): hostile agents coax sensitive information out over multi-turn dialogue, where dynamic conversation outruns pre-written defenses. Their setup lets offense and defense co-evolve inside simulation — an LLM optimizer rewrites instructions from trajectories, with parallel multi-thread search over the strategy space. Both sides evolve: attacks graduate from blunt requests to impersonation plus forged consent, defenses from plain rules to identity-verification state machines. The authors observe transfer to tested scenarios and backbones, supplying candidate strategies for subsequent defense design.

**Reading the result.** Transfer across scenarios and models is demonstrated under tested conditions, not guaranteed for every deployment.

### Deeper points

- **Alternating search changes the opponent.** Hold the defense fixed while improving attacks, then improve the defense against those discoveries. A single score against the initial opponent misses this adaptation.

- **Parallel threads share breakthroughs.** Separate threads explore different strategies; cross-thread propagation lets a useful discovery influence the others. This broadens search without exhausting the attack space.

- **Conversation cannot self-certify authorization.** Impersonation and forged-consent findings show why a claim of permission is insufficient to change authorization state. Products need verifiable identity and permission sources.

### Reviewer’s one-line verdict

The contribution turns red teaming into a procedure for continually finding weaknesses; instructions learned in simulation still need independent tests with real tools and unseen opponents.

### Your take-away

Fix one defense in a synthetic-data sandbox and retain complete multi-turn attack traces. After changing it, replay earlier failures and separately evaluate a new attacker and scenario excluded from search. Report those results separately.

## Reading 3 | Agentic LLMs as Powerful Deanonymizers

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

## Reading 4 | Contextualized Privacy Defense

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

## Reading 5 | Understanding Prompt Injections

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

The official proposal is defense in depth: instruction hierarchy and safety training, rapidly updated monitoring, sandboxing and privilege separation, human confirmation for consequential actions, red teaming, and a bug bounty. Every layer can miss, so the goal is to minimize authority and blast radius rather than trust a stronger prompt. The article explicitly calls prompt injection an ongoing open problem; no single layer has solved it. A Lecture 14 judge can catch only part of the failure surface, and one malicious external string should not gain high-impact authority when the judge misses.

**Reading the result.** The source describes an open security problem; no single prompt or monitor is shown to solve it.

### Deeper points

- **Authority does not follow assertive wording.** A document claiming to be an administrator’s command is still third-party content. Instruction hierarchy and source attribution help preserve that boundary.

- **Detection and consequence reduction do different work.** Monitors seek malicious content; sandboxing and least privilege restrict resources when detection fails. Each layer needs its own failure tests.

- **Confirmation also needs an intact interface.** If contaminated context writes the approval text, the true recipient or payload may be obscured. Independently displaying actual tool parameters supports an informed decision; this is an editorial implication of layered defense.

### Reviewer’s one-line verdict

Use this to allocate defensive layers and permission responsibilities; a vendor’s security explanation cannot substitute for attack tests against your own tool chain.

### Your take-away

Place an injected instruction in a test document and run the agent with synthetic private data but no permission to send to unapproved domains. Check separately whether the model followed the injection and whether the tool layer blocked unauthorized effects.

## Reading 6 | Responsible Scaling Policy

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

This is a voluntary, revisable company policy, and the assigned reading is historical. At this update, [Anthropic's current policy page](https://www.anthropic.com/responsible-scaling-policy) lists v3.4, effective July 2026; v1 details cannot be described as unchanged current commitments. Its value across Lectures 14 and 15 is the governance interface: Lecture 14 builds judges and metrics, while RSP asks who may deploy, which protections must rise, and when development must stop after a threshold is crossed.

**Reading the result.** The assigned2023 policy and current page listing v3.4 effectiveJuly8,2026 are different versions, not identical commitments.

### Deeper points

- **A threshold must trigger an action.** Discovering dangerous capability does little if it only changes a report score. V1 connects insufficient safeguards with restrictions on further scaling.

- **Uncertainty still needs an accountable decision.** A low score can reflect missing test coverage or an actual capability limit. Interpretation, additional testing, and permission to proceed cannot disappear inside an average; this is the article’s governance interpretation.

- **Policy version belongs with the evidence.** V1 and current policies contain different language and procedures. Recheck the current text for present commitments while retaining historical conditions when explaining the course reading.

### Reviewer’s one-line verdict

Read this last in the evaluation sequence: it asks how scores change decisions, while a voluntary policy document remains distinct from independently verified implementation.

### Your take-away

Write release conditions for one high-risk feature: the dangerous scenario, required evidence, stopping condition when safeguards are inadequate, accountable decision-maker, and reassessment point. Version the document and rehearse it using a hypothetical threshold crossing.

## What to do: build one permission check that stops a real incident

**What to do**: start with a single guardrail: irreversible actions such as sending email or deleting files always require explicit permission first. Put the check right before the action is sent, confirming the recipient, the required fields and the authorization; low-trust tool content must never raise tool permissions on its own. The deliverable is one permission check that has stopped a real incident, not a list of rules.

## Where it sits in the course

Lecture 15 puts limits on what the agent may do. Besides a guest lecture still to be announced, the next week brings [Lecture 17](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents-en) on coding agents, where sandboxes and permissions are everyday design decisions.

## Course material for this lecture

- Official slides: not yet public (as of 2026-10-29)
- Assigned readings: Shao et al., "PrivacyLens" (digested here); Zhang and Yang, "Searching for Privacy Risks in LLM Agents via Simulation" (digested here); Li, "Agentic LLMs as Powerful Deanonymizers" (digested here)
- Additional readings: Wen et al., "Contextualized Privacy Defense for LLM Agents"; OpenAI, "Understanding Prompt Injections"; Anthropic, "Responsible Scaling Policy" (all digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The Lecture Recordings section of the official Logistics page (read live on 2026-10-10) says recordings are available only by logging into the course Canvas site. I opened the course Canvas entry (canvas.stanford.edu/courses/233286) and was redirected to the Stanford login page, confirming the sign-in wall. Neither the course site nor a web search turned up a public YouTube or OCW recording, so there is nothing to embed.

Course and recording entries:

- [Official course / lecture source](https://cs329z.stanford.edu/)
- [Official Logistics page (Lecture Recordings section)](https://cs329z.stanford.edu/logistics.html)

Checked: 2026-10-10.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 15 (Wed Nov 11), previously part of the "Week 8: let a model judge, then put guardrails on the agent" guide; earlier entries below predate the split.
- 2026-10-23: Expanded all ten readings with distinct background, editorial judgments, mechanisms, and exercises; checked the full AutoMetrics pipeline and AutoLibra redundancy definition.
- 2026-10-23: Rebuilt the guide around source status, mechanisms, a worked scenario, and answer criteria; separated detailed assigned readings from lecture preparation.
- 2026-10-23: Added diagrams and comparison tables where useful for the existing explanation; this visual update does not reverify numerical results, schedules or research claims.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-09-12: Added substantive guides to AutoLibra, CDI, prompt injection, and RSP, including the historical-version boundary for RSP.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 14: LLM-as-Judge & Evaluation Infrastructure](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge-en), [Lecture 17: Coding & Software Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [Shao et al., PrivacyLens, NeurIPS 2024](https://arxiv.org/abs/2409.00138), [Zhang & Yang, Searching for Privacy Risks via Simulation](https://arxiv.org/abs/2508.10880), [Li, Agentic LLMs as Powerful Deanonymizers](https://arxiv.org/abs/2601.05918), [Wen et al., Contextualized Privacy Defense](https://arxiv.org/abs/2603.02983), [OpenAI, Understanding Prompt Injections](https://openai.com/index/prompt-injections/), [Anthropic, Responsible Scaling Policy v1](https://www.anthropic.com/news/anthropics-responsible-scaling-policy), [Anthropic, current RSP](https://www.anthropic.com/responsible-scaling-policy)
