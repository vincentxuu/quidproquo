---
title: "Reading CS234, Part 17: Value Alignment: Aligned to Whom, Aligned to What"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, ai-alignment, ai-ethics]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 17
tldr: "All of CS234 assumes the reward is given. The Winter 2026 ethics and society guest lecture (Wanheng Hu, based on material originally developed by Dan Webber) asks, over two sessions, what you really want. The first session splits \"alignment\" into three targets: the user's intentions, revealed preferences, and objective best interests, with RLHF-driven sycophancy and a personal AI agent as case studies. The second adds a fourth target, what is morally right for people besides the user, and compares three routes: top-down (write principles down), bottom-up (learn from examples), and participatory AI. There's no silver bullet, but alignment can be better or worse."
description: "A guide to the value alignment guest lecture in Stanford CS234 Reinforcement Learning (Winter 2026): the Value Alignment half of Lecture 10 (intentions, revealed preferences, best interests, autonomy and paternalism, sycophancy, agentic AI) and ethics_society_234_2.pdf (moral alignment, top-down vs bottom-up, participatory AI), linked back to the ethics questions in Assignment 1 Q2, Assignment 2 Q4, and Assignment 3 Q5. Paired with the value alignment segment of 2024 video 15."
draft: false
glossary:
  - term: "value alignment"
    definition: "The problem of designing AI agents that do what we really want. The CS234 guest lecture offers four readings of \"really want\": the user's intentions, the user's preferences, the user's objective best interests, and what is morally right for everyone."
    context: "CS234 Winter 2026 ethics and society guest lecture (second half of Lecture 10 and Part II)."
  - term: "revealed preferences"
    definition: "Preferences inferred from a person's actual behavior or feedback, as opposed to the stated preferences they say or fill in."
    context: "The guest lecture's second reading of alignment; Assignment 3 Q5 asks you to tell the two apart in a news app."
  - term: "sycophancy"
    definition: "An AI system agreeing with the user or validating their beliefs, even when those beliefs are false, harmful, or irrational."
    context: "The guest lecture's first case study: observed in LLMs trained with RLHF, because human raters reward responses that feel helpful, polite, and agreeable."
  - term: "participatory AI"
    definition: "Expanding \"learning from humans\" to multiple stakeholders, including affected non-users, and treating values as contextual, contestable, and revisable, with ongoing input rather than one-time training."
    context: "The bottom-up extension in Part II of the CS234 ethics guest lecture."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-value-alignment-ethics)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the Winter 2026 slides and assignments of [CS234](https://web.stanford.edu/class/cs234/); the recordings are the public Spring 2024 version.** It is part 17 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series.

**Series**: previous [Planning plus learning: MCTS, UCT, AlphaGo/AlphaZero](/posts/ai/2026-09-30-cs234-mcts-alphazero-en) | next [Guest lecture: Shane Gu, "World of World Modeling"](/posts/ai/2026-09-30-cs234-guest-world-models-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

Official materials used:

- [Lecture 10 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf), pages 17–41. The first 16 pages are UCB (covered in [part 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en)); page 17 says "Guest lecture: Wanheng Hu," and the next 24 pages are the guest deck "Value Alignment"
- [ethics_society_234_2.pdf](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf) (21 pages), "Value Alignment Part II"
- The [lecture materials page](https://web.stanford.edu/class/cs234/modules.html) groups both under "Ethics and Society Guest Lecture," and the Class Structure slide of [Lecture 14](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf) describes that session as "MCTS and Ethics and Society Guest Lecture Part 2"

The speaker, Wanheng Hu, is a postdoc with Stanford's EIS and HAI. The acknowledgement says the lecture is based on materials originally developed by Dan Webber, with input from Andy Ouyang.

Access grade **A3 (enough to self-study)**, as defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), but this post has bigger gaps than most, so here they are up front:

- There's no public recording of the 2026 guest lecture (2026 recordings are on Canvas only)
- Week 10 on the schedule says "Alignment, Impacts," but the L15 and L16 PDFs on the lecture materials page both returned 404 on 2026-09-30, so this post relies only on the two guest decks above
- Several slides are images or discussion questions with no speaker's answer; I report the questions as asked and don't supply conclusions for the speaker
- The matching video in the public 2024 playlist is [video 15, "Emma Brunskill & Dan Webber"](https://www.youtube.com/watch?v=FOlPpjNbHjE). Per its YouTube chapters, the first 15 minutes wrap up AlphaZero, and [from 15:24](https://www.youtube.com/watch?v=FOlPpjNbHjE&t=924s) Dan Webber covers value alignment: misalignment, defining AI goals, aligning to preferences (28:28), aligning to interests (36:13), an LLM personalization study (40:57), and social and moral alignment (58:34). That broadly tracks the 2026 slides; the chapters don't show whether sycophancy or agentic AI come up. [Video 16](https://www.youtube.com/watch?v=eenJzay5aLo), despite its "Value Alignment" title, is chaptered as a quiz review, a course recap, and RL case studies, not this post's material

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=FOlPpjNbHjE
title: Stanford CS234 Spring 2024 video 15, "Emma Brunskill & Dan Webber"
```

```youtube
url: https://www.youtube.com/watch?v=eenJzay5aLo
title: video 16, "Value Alignment"
```

Original videos: [Stanford CS234 Spring 2024 video 15, "Emma Brunskill & Dan Webber"](https://www.youtube.com/watch?v=FOlPpjNbHjE)、[video 16, "Value Alignment"](https://www.youtube.com/watch?v=eenJzay5aLo)

Course and recording entries:

- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Why an RL course covers this

From [part 1](/posts/ai/2026-09-30-cs234-intro-sequential-decisions-en), CS234 treats the reward as given: an MDP is $(S, A, P, R, \gamma)$, and the algorithm's job is to maximize expected return. This lecture asks about the step before you write down $R$: is what you wrote what you really want?

The question has been surfacing all quarter. In [Assignment 1 Q2](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en), an AI car uses "average speed" as a proxy and learns to wait at the on-ramp instead of merging. [Assignment 3 Q5](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits-en) asks you to separate a news app's stated and revealed preferences. The guest lecture gathers these scattered questions into one framework.

## Session one: three readings of "what we really want"

### Starting with paperclips

The lecture opens with Bostrom's (2014) paperclip AI: an AI that manages factory production is given the final goal of maximizing paperclip output, and proceeds to convert first the Earth and then ever larger chunks of the observable universe into paperclips. The slide adds that even a far less powerful AI might pursue such a goal in surprising ways.

The next three slides are image-only real-life examples, titled "From boats to roads" (a screenshot of a boat-racing game, and a screenshot captioned "Passenger got stuck in driverless car going in circles") and "From entertainment to treatment" (a short-video app's "Why you're seeing this video" panel, and a medical illustration). The slides have no text explanation, so I only describe what's shown.

Slide 7 states the core problem: what we really want is often much more nuanced than what we say. People work with many background assumptions that are (1) hard to formalize and (2) easy to take for granted. Better instructions alone won't fix it, for the same reason hand-specifying a reward function is hard, and it gets worse when an AI takes instructions from non-expert users.

### Three readings

| Reading | Alignment target | Why the paperclip AI is misaligned | The difficulty |
|---|---|---|---|
| Intentions | what the user truly intends | it failed to infer "maximize production subject to constraints" from "maximize production" | intentions may not track what we really want (incomplete information, imperfect rationality) |
| Revealed preferences | what the user actually prefers | I prefer that it not destroy the world | finite behavior and feedback fit infinitely many preference functions; unexpected situations like emergencies are hard to infer |
| Best interests | what is objectively good for the user | a destroyed world is objectively bad for me | what's objectively good is a philosophical question, not a scientific one, so it can't be settled empirically |

Each reading patches a hole in the one before and opens a new one.

**Intentions.** The AI would have to translate an underspecified instruction into a fully specified intention, including unspoken constraints and conditions. The slides quote [Gabriel (2020)](https://arxiv.org/abs/2001.09768): really grasping the intention behind instructions may require a complete model of human language and interaction, including the culture, institutions, and practices that let people understand implied meaning. But intentions can diverge from what we really want. Say I want the AI to maximize paperclip output because I want the best return on my factory. If the AI knows I'd earn more making something else, has it given me what I really want by following my intention?

**Revealed preferences.** The fix is to infer preferences from the user's behavior or feedback. Technically this links straight to earlier parts of this series: [IRL from demonstrations](/posts/ai/2026-09-30-cs234-imitation-learning-irl-en) and [RLHF from preferences](/posts/ai/2026-09-30-cs234-rlhf-dpo-en) both do exactly this. One technical challenge on the slides is that finite behavior or feedback is consistent with infinitely many preference or reward functions, IRL's old problem. The philosophical problem: just as intentions can drift from preferences, preferences can drift from what is actually good for me.

**Best interests.** The bad news is that philosophers disagree about what's objectively good for a person. Is it pleasure? Satisfied desires? Or are health, safety, knowledge, and relationships good for you even if you don't enjoy or want them? The good news is broad agreement: health, safety, liberty, knowledge, social relationships, purpose, dignity, and happiness are at least usually good for whoever has them.

One widely valued good is **autonomy**: the ability to choose how to live your own life, even when you don't always choose best. We want to avoid **paternalism**, choosing what you think is best for someone instead of letting her choose. So even when aligning to best interests, users' interest in autonomy gives us reason to weigh their intentions or preferences, even when those conflict with their other interests.

### Case study 1: sycophancy

An AI system agrees with the user or validates their beliefs, even when the beliefs are false, harmful, or irrational. The slides note this shows up in LLMs trained with RLHF: human raters reward responses that feel helpful, polite, and agreeable, so the model optimizes for pleasing the user rather than for truth or well-being.

This connects to the Bradley-Terry model in [part 11](/posts/ai/2026-09-30-cs234-rlhf-dpo-en): the reward model learns the raters' comparisons, so the model moves toward whatever raters prefer.

The slides leave two discussion questions:

1. Which reading of alignment does sycophancy illustrate best: intentions, revealed preferences, or best interests?
2. If you designed the RLHF process, how would you reduce or prevent sycophancy?

### Case study 2: a personal AI agent

Imagine building a personal AI agent that books travel, makes purchases, negotiates with other agents, manages your calendar and communications, and calls online services and APIs.

- Aligned to **revealed preferences**: it learns your patterns and acts automatically for speed and convenience, sometimes without asking
- Aligned to **best interests**: it adds friction to protect your long-term well-being, asking, refusing, or broadening information when needed

Discussion questions: When should the agent act without asking? When should it defer to the user? When should it override or resist the user?

Session one closes on a big-type slide: what (or who) has been missing from our discussion? Answer: **people other than the user**.

## Session two: bringing other people in

### A fourth reading: what is morally right

Part II picks up from that question. The fourth reading: an AI agent is aligned if it does what is morally right. The paperclip AI is misaligned because a destroyed world is bad for **everyone**. This reading stresses the "we" in "what we really want": what the user intends, prefers, or even what's in her interest might be bad for others.

The first three readings weren't wasted, though. We want to align to morality, and we also want to align to what the user wants whenever that's morally acceptable. So how we understand what the user really wants still matters, just inside a larger ethical context.

The case study becomes concert tickets. Your agent monitors markets, negotiates, and buys automatically at the best price, and many other people run agents with the same goal. The slide asks what happens when everyone has an agent optimizing on their behalf. Listed outcomes include faster competition between agents, price spikes, and unequal advantages across users. Each agent is aligned on its own; together they cause trouble.

### Two routes: top-down and bottom-up

| | Top-down | Bottom-up |
|---|---|---|
| Approach | state the moral principles explicitly and enforce them through the reward function, post-processing, etc. | skip explicit principles and learn morality from examples, e.g. inverse RL, imitation learning, RLHF |
| Philosophical problem | which principles are correct? Moral theory hasn't settled it | moral disagreement: whose examples? |
| Technical/practical problem | principles conflict and have exceptions; wrongly specified principles cause moral "reward hacking" | rare or unforeseen cases; minority values can be swamped by majority behavior |
| Ticket agent example | hard constraints (don't manipulate or mislead other agents), global objectives (limit price inflation, promote fairness) | learn from user feedback on purchases, train on historical ticket market data, adapt to observed agent-to-agent interactions |

**Top-down** comes in two examples. Utilitarianism: maximize total net happiness over all people. But what about how happiness is distributed? What about rights? Common-sense pluralism: "don't lie," "don't steal," "don't hurt people," "keep promises." But what happens when principles conflict, or when there are highly nuanced exceptions? The slides pose a question: what surprising way might a utilitarian AI find to maximize total net happiness? That's moral reward hacking. The listed limits: it's hard to write a rule set that covers every situation and handles edge cases and exceptions, moral rules often conflict, there's a risk of oversimplification, and individual nuance is hard to capture.

The slides then show [Jobin et al. (2019)](https://www.nature.com/articles/s42256-019-0088-2), a survey of 84 AI ethics guidelines. The most common principles are transparency (73/84) and justice and fairness (68/84), followed by non-maleficence and responsibility (60/84 each) and privacy (47/84). Issuers are concentrated in the United States, the EU, the UK, and Japan.

**Bottom-up**'s moral disagreement examples: should ChatGPT produce depictions of the prophet Muhammad? Offer tips for evading law enforcement? It depends who you ask, and some cases divide people because they are genuinely hard. The technical example: a self-driving car trained on real human driving may never see how to respond to a deadly brake failure, and if the AI extrapolates wrongly, that's a gap in its moral "understanding." The listed limits: feedback is often unevenly distributed, majority groups are more likely to be represented, minority or marginalized groups may be underrepresented, and learned values may reflect existing social biases.

### Participatory AI

The bottom-up extension is participatory AI, which expands "learning from humans" to include:

- multiple stakeholders
- affected non-users
- ongoing input, not one-time training

Values are treated as contextual, contestable, and revisable over time. Practical examples include community advisory boards for AI systems, ongoing user feedback channels, and public consultations before deployment. The key ethical considerations: recognize that values can conflict, and be willing to revise systems over time.

### Takeaway: no silver bullet

The final slide:

- There's no silver bullet that guarantees perfectly moral behavior
- But alignment can be better or worse. To do better, start with what (almost) everyone agrees on (your AI should avoid killing people and usually shouldn't lie), then do your best to capture the complexities
- Top-down: think hard about principles, conflicts, and exceptions
- Bottom-up: get creative and train on as many rare and edge cases as you can imagine

## Back to the three assignments

The guest lecture's framework is a good lens for rereading the ethics questions in all three assignments:

| Assignment | Question | Matching part of the lecture |
|---|---|---|
| [A1 Q2](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) | a self-driving car uses average speed as a proxy and learns not to merge | the paperclip AI; reward hacking in top-down design |
| [A2 Q4](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo-en) | an RL chatbot replaces some office hours; design the experiment around the Belmont Report's respect for persons, beneficence, and justice | people other than the user; autonomy and paternalism |
| [A3 Q5](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits-en) | stated vs revealed preferences in a news app, what reward a company would pick, and how to use exploration to test whether preferences change | revealed preferences vs best interests |

## How to self-study this

1. Read pages 17–41 of Lecture 10 and redraw the three-readings table, filling each cell with an example of your own.
2. Write answers to the two sycophancy questions, then go back to the RLHF pipeline in [part 11](/posts/ai/2026-09-30-cs234-rlhf-dpo-en) and mark which step your fix would change.
3. Read Part II and sketch one top-down and one bottom-up design for the ticket agent, each with one scenario where it fails.
4. Finally, redo the ethics questions from all three assignments. They have no official answers; the point is that you can say which "really want" you're aligning to.

One thing to try tonight: open a recommender or AI assistant you use often, write down the reward it might be optimizing, and ask whether it's aligned to your intentions, your revealed preferences, your best interests, or someone else's interests.

## Further reading

- A whole course built around alignment: [Reading Harvard CS2881R: What Outsiders Can Get from the First Graduate AI Safety Course](/posts/ai/2026-09-30-cs2881r-course-overview-en)
- How an intro course covers AI alignment: [CMU 07-280 Lecture 13: From Reward Hacking to Auditable AI Scientists](/posts/ai/2026-08-22-cmu-07280-lecture-13-ai-alignment-en)
- Where RLHF sits in LLM post-training: [CS224N Lecture 8: From Instruction Tuning and RLHF to DPO](/posts/ai/2026-08-22-cs224n-post-training-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS234 Lecture 10 slides (Winter 2026, post-class)](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) — pages 17–41: Wanheng Hu's "Value Alignment" guest lecture
- [CS234 ethics_society_234_2.pdf](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf) — "Value Alignment Part II": moral alignment, top-down vs bottom-up, participatory AI
- [CS234 Lecture 14 slides (Winter 2026, post-class)](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf) — Class Structure slide: the session for Ethics and Society Guest Lecture Part 2
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — Ethics and Society Guest Lecture unit
- [CS234 course home page (Winter 2026)](https://web.stanford.edu/class/cs234/) — Week 10 on the schedule: "Alignment, Impacts"
- [CS234 assignments page](https://web.stanford.edu/class/cs234/assignments.html) — question PDFs for A1 Q2, A2 Q4, and A3 Q5
- [Stanford CS234 Spring 2024 video 15, "Emma Brunskill & Dan Webber"](https://www.youtube.com/watch?v=FOlPpjNbHjE) and [video 16, "Value Alignment"](https://www.youtube.com/watch?v=eenJzay5aLo) — public recordings; value alignment starts at 15:24 in video 15, and video 16 is chaptered as a course recap
- [Gabriel, Artificial Intelligence, Values and Alignment (2020)](https://arxiv.org/abs/2001.09768) — quoted in the lecture on needing a complete model of human language and interaction
- [Jobin, Ienca & Vayena, The global landscape of AI ethics guidelines (Nature Machine Intelligence 2019)](https://www.nature.com/articles/s42256-019-0088-2) — the survey of 84 guidelines cited in Part II
