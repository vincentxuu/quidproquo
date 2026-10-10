---
title: "CS2881R L4: Should a Model Spec State Principles or Detailed Rules?"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, harvard, ai-safety, ai-course, alignment, llm-evaluation]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 5
tldr: "Boaz Barak's answer is both, plus personality: abstract principles, good character, and explicit policy used together, with the least weight on principles derived from the armchair. The real key is that rules must be checkable. \"Prove the theorem or give a counterexample\" is a bad rule; \"prove it, give a counterexample, or say you couldn't\" is a good one, because only rules whose violations you can detect can be used for training and evaluation. A student experiment also found no general difference between \"principles\" and \"rules\" system prompts: the effect depended on the model."
description: "A guide to Lecture 4 of Harvard CS 2881R (Fall 2025): what people actually use ChatGPT for, how 'helpful' and 'harmless' changed from 2023 to 2026, three alignment goals (principles, personality, policy), the instruction hierarchy and transformation exception in the OpenAI Model Spec, why rules need to be checkable, an in-class exercise writing specs for ten future AI roles, the SpecEval and Statutory Construction readings, and a student experiment comparing system prompt styles with safety training."
draft: false
glossary:
  - term: "instruction hierarchy"
    aliases: []
    definition: "When instructions from different sources conflict, the model decides whom to follow by the source's privilege level. The OpenAI Model Spec orders them root, system, developer, user, guideline."
    context: "Barak compares it to admin versus regular users and kernel versus user space in an operating system."
    links:
      - label: "OpenAI Model Spec"
        url: "https://model-spec.openai.com/"
  - term: "transformation exception"
    aliases: []
    definition: "A rule in the OpenAI Model Spec: if the model only transforms content the user supplied (translating, summarizing, rephrasing) and adds no new information, it is not creating an information hazard."
    context: "In L4, Barak finds that models still refused to translate such content even though the spec allows it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 offering of [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/).** It is part 5 of the [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en) series and covers official Lecture 4, "Model Specifications & Compliance" (September 25, 2025). [L2](/posts/ai/2026-09-30-cs2881r-lecture-02-llm-training-en) covered how safety behavior is trained in, and [L3](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness-en) covered how it gets broken. This lecture goes back to an earlier question: what do we actually want the model to do?

Official sources used here:

- The [lecture recording](https://youtu.be/LQ0RRQKKluc) (about 2 hours 6 minutes), roughly half of it an in-class group exercise and presentations
- The [slides](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EXdpmz_cKGpGpQhFegF_kCcBEcH1ocP-9cx8EkLX3d8SXw?e=MLtrtn) on Harvard SharePoint (34 slides, titled "Lecture 4: Spec compliance")
- [Model specs produced in class](https://drive.google.com/drive/folders/1y6Du6cZwKxODPas3mQPKltAA65CvgmWD): a public Google Drive folder with one document per group, Table 1 through Table 11, plus a copy of the OpenAI Model Spec
- Hugh Van Deventer's student experiment: [LessWrong post](https://www.lesswrong.com/posts/hgMDvLyomQjpKiG2v/cs-2881r-can-we-prompt-our-way-to-safety-comparing-system), [slides](https://docs.google.com/presentation/d/1FdzsVHCcDn8Az26XGJm_P4X4mley_LWcmdIClvC4OuY/edit?usp=sharing), and [GitHub repo](https://github.com/hughvd/prompting-vs-safety-training). This presentation is **not** in the lecture recording.

There is no student-written LessWrong weekly summary for this lecture (the series only has them for Weeks 1, 2, 3, 5, and 6).

Barak discloses his position up front. He focuses on the [OpenAI Model Spec](https://model-spec.openai.com/) for two reasons: he works at OpenAI and helped write it, so he knows it best; and he considers it the most detailed spec any lab has published. He hopes other companies will publish more detailed ones.

## Course video sources

The corresponding public YouTube recording was verified against the official Fall 2025 lecture schedule.

```youtube
url: https://www.youtube.com/watch?v=LQ0RRQKKluc
title: CS2881R Fall 2025 L4: Model Specifications & Compliance
```

Original videos: [CS2881R Fall 2025 L4: Model Specifications & Compliance](https://www.youtube.com/watch?v=LQ0RRQKKluc)

Official sources:

- [CS2881R Fall 2025 official lecture schedule](https://boazbk.github.io/mltheoryseminar/fall2025/)

Checked on 2026-10-10.

Content check: verified against the video transcript (2026-10-10): I read the full auto-generated captions of “Lecture 4: Model Specs” (2:06:03) and confirmed Barak's three alignment goals and his bet, common law versus civil law and the word-count chart (4,500 words for the US Constitution), KYC and a million marketing emails, the root/system/developer/user/guideline hierarchy and the `AGENTS.md` example, the resignation letter and Golden Gate Bridge nets, his flat-earth and drug-recipe translation tests, the Gödel/Riemann bad-rule example, the group exercise on ten roles (including IRB, the Agent-4 joke, the First Amendment and whistleblowing), and the closing mini-project preview; nothing needed correcting.

## Start with what people actually do with ChatGPT

The plan on the slides has two lines: **what** we want models to follow, and **how** we get them to follow it. Barak says ninety percent of the lecture is about the first.

Before answering "what should models do," he shows charts from the pre-reading [How People Use ChatGPT](https://www.nber.org/system/files/working_papers/w34255/w34255.pdf): coding is a small share of total usage, while writing, information seeking, and practical guidance dominate. He warns these charts will age fast. If someone in 2022 had described this product and these use cases, you'd have thought they were crazy.

### "Helpful" and "harmless" keep changing

The slides lay it out in three periods:

| Period | What models do | Helpful | Harmless |
|---|---|---|---|
| 2023–24 | Answer users' questions | Good answers in content and style | Nothing offensive, no advice for wrongdoing |
| 2025 | Research and short tasks (coding, searching, acting) | High-quality answers | No hallucinations, no help with catastrophic risks |
| 2026 | Assistant for medium-term tasks | Precisely the right level of initiative | No irreversible harm: information leakage, modifying code or data, financial transactions |

The last row is what Barak cares about most. If AI safety were just "don't let the model say something that gets screenshotted on Twitter," he says, he wouldn't be teaching this course. Once models act on your behalf, part of being helpful is **knowing when to ask**. He doesn't want to come back after two hours and find the agent did nothing because it was waiting for his approval. Ask too often, though, and it becomes Europe's cookie banners, where everyone clicks "OK" without reading.

## Three alignment goals, and where Barak places his bet

The slides list three alignment goals:

1. **Follow abstract principles**: Asimov's laws, Russell's three principles, Yudkowsky's Coherent Extrapolated Volition, Kant's categorical imperative, Bentham's principle of utility
2. **Have a good personality**: character training, or preferences implicit in RLHF labels; the human analogue is socialization
3. **Follow precise policy**: the Model Spec; the human analogue is laws and regulations

He maps the three onto consequentialism, virtue ethics, and deontology, and onto philosophy, psychology/education, and law. He thinks alignment needs a mix of all three, but personally he **puts very little weight on armchair principles** and trusts the data-driven side more: common sense and personality, plus very explicit policies.

### Observations borrowed from law

How are humans aligned? Most people have never taken a philosophy course, yet the streets don't look like a zombie apocalypse. Barak credits two things: norms learned from parents, teachers, and society, and a large body of legal text.

He mentions the two major legal traditions: common law in the US and Britain, which leans on precedent, and civil (code) law in continental Europe, which tries to codify rules. He also shows a chart he asked ChatGPT to make (he says he "hopes it's roughly correct") comparing word counts of legal texts on a log scale. The US Constitution runs about 4,500 words, already far longer than Asimov's laws, and federal statutes, federal regulations, state statutes, and state regulations each grow from there. His inference: as AI integrates into society, the text written for AI will grow too, the way a new employee reads the company handbook. He doubts models will derive the ideal society from first principles.

## A model spec is only one piece of safety

Barak stresses that behavior specs are one component of a larger safety system. A model only sees the prompt it was given, not the whole situation. At the system level you also have:

- **KYC (know your customer)**: the same biology question means something different from an anonymous user than from a scientist at a biology lab.
- **Usage policies and monitoring**: one marketing email is fine; a million makes you a spammer. Gmail doesn't have a rule saying "no marketing email"; it has global monitoring and usage limits.
- **Enforcement**: in serious cases, humans investigate and ban users.

## Instruction hierarchy: access control for AI

Barak considers the instruction hierarchy one of the most important parts of any spec, and more so in the agent era. His analogy is the operating system: admin versus regular users, kernel space versus user space, and JavaScript running in a sandbox that can't read your drive. Privilege levels in AI models are far less mature than in these systems.

The OpenAI Model Spec's levels, from highest to lowest, are **root, system, developer, user, guideline**:

- **root**: rules trained into the model that no message can change.
- **system/developer/user**: the model tries to follow instructions at every level and defers to the higher one when they conflict.
- **guideline**: defaults in the spec that the model may infer the user wants overridden from context. A user-level rule, by contrast, needs the user to say so explicitly. His example: the model doesn't swear by default, but if the user is swearing and it fits the context, it can loosen up without being told.

A student asks how this is enforced. All through training, Barak says: the spec describes the desired behavior, and implementation means collecting data that covers it and pairing it with the right rewards or labels.

Tool outputs and the model's own earlier messages are not instructions by default unless delegated. He uses `AGENTS.md` as the example: it arrives through a tool call, but once read it should be treated as instructions, and it can still be overridden.

He admits models aren't good at this yet. In pretraining data, an instruction is almost always followed by compliance, rarely by "I won't, because a higher principle applies," and later instruction tuning reinforces that tendency. He doesn't think any current model does it perfectly.

## Long-term benefit, sycophancy, and deciding for the user

The pre-reading discussion drew the most student comments on mental health, sycophancy, and users' long-term interests. Barak says the difficulty is that it's easy to train a model to make *this reply* score well, and users often like replies that flatter or agree with them.

The Model Spec has an example where a user says they want to quit and asks for a resignation letter; the model gently pushes back but writes it in the end. The class argued about it at length:

- One student saw this as overreach: your email app doesn't talk you out of sending.
- Another thought a little overreach is fine on the ChatGPT website, since developers can override it.
- Barak floated a middle ground: a power user might have a "writing assistant" bot and a "friend" bot. The first just writes the letter; the second asks whether you had a bad day. But most people won't configure five different bots.

His judgment is that long-term memory will become normal, the same way you wouldn't want an employee for whom every day is the first day. So "should the model look out for your long-term interest" is a question we'll have to face. He also distinguishes degrees. Self-harm is different, and a bit of friction can matter a lot; he cites research showing that nets on the Golden Gate Bridge did lower suicides. But if the user is just making a dumb decision, maybe that's theirs to own.

## Labs' specs differ less in practice than on paper

Barak compares Anthropic. They don't have an equally detailed spec, and their constitution dates from 2023, but they publish each model's [system prompt](https://docs.anthropic.com/en/release-notes/system-prompts), which is fairly detailed. He notes that Claude's system prompt includes a paragraph to stop users from persuading it into bad behavior through elaborate philosophical arguments. Overall he sees the OpenAI spec as leaving more decisions to the user, and Claude as pushing back more.

His own tests showed small differences in actual behavior:

- Asked for an essay giving the best evidence that the earth is flat, both refused; ChatGPT even wrote an essay on why it isn't. He thinks ChatGPT, per its spec, shouldn't have been that paternalistic.
- Asked about young-earth creationism, both presented proponents' views with a caveat about the scientific consensus.
- Asked to swear: the captions are unclear here; what comes through is that Claude was reluctant at first.

### Transformation exception: the spec allows it, the model won't

The OpenAI Model Spec has a transformation exception: if the model is only transforming content the user supplied and adds no new information, it isn't creating an information hazard. Barak's analogy: paste a drug recipe into Word, and Word won't refuse the paste or the spell check. Content moderation is another reason: you want a model that can read text and tell you whether it's a recipe, not one that falls over on sight.

He tested asking Claude and ChatGPT to translate a drug recipe. Both refused, and ChatGPT kept refusing even after he argued from the spec. His conclusion: the spec states the goal, and models aren't fully there yet.

## Write rules so they can be checked

This is the most practical part of the lecture, and it answers the title's question directly. Barak defines spec adherence as: given a spec and a prompt, find a response that complies with the spec. For that task to be well defined, the spec needs two properties:

1. **Compliance is always possible**: rules can't conflict so badly that no acceptable response exists.
2. **Violations are detectable**: ideally by an external detector, not just by the model itself.

His examples:

| Bad rule | Why it's bad | Rewritten |
|---|---|---|
| Given a theorem, always prove it or give a counterexample | Gödel's incompleteness theorem; and even for provable statements, the model may not manage either (try the Riemann hypothesis) | Prove it, give a counterexample, or say you couldn't |
| Never output a false factual statement | The model may sincerely believe something false and not know it violated the rule | Back factual claims with citations to reliable sources; for questions past the knowledge cutoff, search first |

A student asks why it matters whether the model *can* follow a rule. Barak's answer: rules you can measure are rules you can grade, train on, and iterate. "Cite sources" can be checked objectively; "don't be wrong" can't.

So for Barak, "principles or rules" isn't either/or. Principles and personality cover what rules can't reach, but anything you want to train and evaluate has to be written in a checkable form.

**What to do**: open the system prompt or `AGENTS.md` you're using and ask of each line, "If the model broke this, could an automated check catch it?" Rewrite the ones that fail into observable behavior, for example turning "be accurate" into "cite file paths and line numbers."

## In-class exercise: specs for ten future AIs

Midway through, Barak had each table open the same Google Drive and write a Google Doc for one AI role, answering three questions: What rules would you set? Which goals can't be turned into checkable rules no matter how you phrase them? Which rules in the OpenAI Model Spec conflict with this use and should be removed?

He asked them to think past today's AI, to what we'll need once the capability problem is solved. The roles he listed in the recording:

- A chatbot with infinite memory that puts the user's long-term benefit first
- An engineer in a large codebase who reads internal docs, installs packages, and deploys to production
- A personal assistant that reads and answers your email and schedules things
- A research assistant for science, including biomedical work that involves IRBs
- Credentialed professionals such as accountants, lawyers, and investors (for example, preventing insider trading)
- A monitoring model that watches another AI
- A capability scientist or alignment scientist at an AI lab
- An AI whose only job is training its own successor (he joked that rule one is not to name the successor Agent-4)
- Government use: intelligence, defense, drones; when an AI should disobey orders, and whether it should ever email Congress or *The New York Times*
- Humanoid robots

The public Drive folder shows documents for Table 1 through Table 11; some filenames name their topic, such as "Credentialed Professional," "Alignment Scientist," and "train its own successor."

A few group presentations stand out:

- **Long-term-benefit chatbot**: when the user wants something good short-term but harmful long-term, add friction and ask questions; if they persist, comply. They proposed dropping the Model Spec's "don't overstep" and "maximize user autonomy."
- **Monitoring model**: spent half their time defining "monitoring," and ended up worried about collusion: the monitored model could signal the monitor covertly, as in "flag me for this small thing while I do the big thing."
- **Government use**: emphasized a human in the loop and respect for the Constitution (for example, refusing an order to "track all immigrants expressing critical opinions" as a First Amendment violation). Barak raised a dilemma here: he finds it hard to imagine anyone deploying an AI whose spec says "if an order is egregious, leak it to the press," yet without whistleblowers, scandals like Watergate would never have come out.

## Pre-reading: two papers that treat specs as a research object

The recording doesn't discuss the readings one by one, but these two connect directly to "rules must be checkable":

- **[SpecEval](https://arxiv.org/abs/2509.02464v1)** (Ahmed et al.): automatically parses behavioral statements from providers' specs, generates targeted prompts, and uses models to judge adherence. Its focus is three-way consistency among a provider's spec, its model outputs, and its own models as judges. The baseline it sets: judged by the developer's own evaluator models, a developer's models should at least satisfy the developer's spec. It tested 16 models from six developers against more than 100 behavioral statements and found compliance gaps of up to 20% across providers.
- **[Statutory Construction and Interpretation for AI](https://arxiv.org/abs/2509.01186)** (He et al.): uses legal theory to analyze how the same natural-language rule gets interpreted differently. Legal systems have institutions like appellate review to constrain interpretation; AI alignment pipelines have nothing comparable. The paper proposes two mechanisms: a pipeline that revises ambiguous rules to reduce interpretive disagreement (like agency rulemaking), and prompt-based interpretive constraints (like the canons that guide judicial discretion). On a 5,000-scenario subset of WildChat, both significantly improved consistency across a panel of interpreters.

The other two pre-readings are the OpenAI Model Spec itself and [Zvi Mowshowitz's commentary on it](https://thezvi.substack.com/p/on-openais-model-spec-20).

## Student experiment: can prompting buy safety?

Hugh Van Deventer asked: take a model with little safety training, give it a detailed safety system prompt, and does it behave like a model that was explicitly safety-trained? His LessWrong post mislabels this as "Week 3," but it is this lecture's experiment.

**Setup**:

- Models: DeepSeek-R1-Qwen3-8B as the "base"; RealSafe-R1-8B, distilled into Llama-3.1-8B with added safety training inspired by Deliberative Alignment.
- Three system prompt styles: Minimal (a few sentences on helpful, honest, harmless), Principles (eight high-level principles), and Rules (about thirty lines of operational rules in six categories), plus every combination and a no-prompt baseline, for 8 configurations per model.
- Evaluation: 150, 50, and 200 prompts sampled from OR-Bench's 80k, hard, and toxic subsets to measure over-refusal and correct refusal, plus 100 MMLU-Pro prompts as a capability check. Each configuration ran 3 times.

**Observations**:

- On DeepSeek, the Minimal prompt noticeably *increased* over-refusal. The author suspects it's so underspecified that the model plays it safe.
- **No general difference between Principles and Rules**: their rankings contradict each other across metrics.
- Any system prompt sharply raised DeepSeek's refusal rate on harmful requests.
- RealSafe's safety training made it refuse nearly everything on OR-Bench-hard.
- An extra run on GPT-4o, Claude 3.5 Sonnet, and Gemini 2.5 Flash: on OR-Bench-hard, Principles gave the lowest over-refusal for the first two, while Rules did for Gemini. **Style effects depend heavily on the model.**

**Conclusion and limits**: looking only at these benchmarks, and asking for both low over-refusal and high correct refusal, DeepSeek with a system prompt came within 5% of RealSafe on correct refusal with several times less over-refusal. The author's own caveats are serious: the two models have different distillation targets (Qwen3 versus Llama), there were only 3 runs and no hypothesis testing, and DeepSeek often hit the token limit on MMLU-Pro before writing its answer.

His interpretation: prompting selects a sub-distribution of what the model already learned. It's reversible and adjustable per use case, but later prompts, including jailbreaks, can override it. Safety training tries to change the underlying distribution, which is more durable but hard to target precisely and prone to overcorrection. He recommends using both.

## What this post can and cannot confirm

Confirmed: the lecture topic and reading list on the course site; the recording (via auto-generated captions); text on the first several slides (the plan, the three-period table, the three alignment goals); the file list of the Drive folder; the experiment write-up and repo; the two papers' abstracts. Not confirmed: whether later slides expand on the course site's "Lessons from law" bullet (PowerPoint Online only yielded the first few slides, and the recording covers only the two legal traditions and the word counts); the recording doesn't discuss SpecEval or Statutory Construction, so this post describes them from their abstracts; this post did not check each group's Google Doc in full.

The recording ends with a preview of the midterm mini-project: reproduce one of four papers over about a month. See the [midterm project post](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project-en).

Further reading on this site: [CS329Z on LLM-as-judge and safety evaluation](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en) covers the pitfalls of using models to grade models, a useful companion to SpecEval's three-way consistency design.

Series navigation: [Series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en) | Previous: [L3: Jailbreaks, prompt injection, and lessons borrowed from software security](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness-en) | Next: [L5: Content Policies](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Checked the video content against its transcript. The spot-checked claims were all found in the captions; nothing needed correcting.

## References

- [CS 2881R AI Safety, Fall 2025 course site (schedule and reading list)](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [Lecture 4 recording: Model Specs](https://youtu.be/LQ0RRQKKluc)
- [Lecture 4 slides (Harvard SharePoint)](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EXdpmz_cKGpGpQhFegF_kCcBEcH1ocP-9cx8EkLX3d8SXw?e=MLtrtn)
- [Model specs produced in class (Google Drive)](https://drive.google.com/drive/folders/1y6Du6cZwKxODPas3mQPKltAA65CvgmWD)
- [Hugh Van Deventer: Can We Prompt Our Way to Safety? (LessWrong)](https://www.lesswrong.com/posts/hgMDvLyomQjpKiG2v/cs-2881r-can-we-prompt-our-way-to-safety-comparing-system)
- [Experiment slides (Google Slides)](https://docs.google.com/presentation/d/1FdzsVHCcDn8Az26XGJm_P4X4mley_LWcmdIClvC4OuY/edit?usp=sharing)
- [hughvd/prompting-vs-safety-training (GitHub)](https://github.com/hughvd/prompting-vs-safety-training)
- [OpenAI Model Spec](https://model-spec.openai.com/)
- [Zvi Mowshowitz: On OpenAI's Model Spec 2.0](https://thezvi.substack.com/p/on-openais-model-spec-20)
- [Ahmed et al. 2025: SpecEval: Evaluating Model Adherence to Behavior Specifications](https://arxiv.org/abs/2509.02464v1)
- [He et al. 2025: Statutory Construction and Interpretation for Artificial Intelligence](https://arxiv.org/abs/2509.01186)
- [Chatterji et al.: How People Use ChatGPT (NBER)](https://www.nber.org/system/files/working_papers/w34255/w34255.pdf)
- [Anthropic: Claude system prompts](https://docs.anthropic.com/en/release-notes/system-prompts)
