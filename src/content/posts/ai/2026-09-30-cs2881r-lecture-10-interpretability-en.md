---
title: "CS2881R L10: Reading the Model's Insides and Reading Its Chain of Thought"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, interpretability, chain-of-thought]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 9
tldr: "Lecture 10 of Harvard CS 2881R (Fall 2025) brought in four researchers from OpenAI, Anthropic, and Google DeepMind to cover two ways of catching a model misbehaving: read the chain of thought it writes, or read its activations. CoT monitoring catches reward hacking far better than watching actions alone, but put the monitor into the training reward and the model learns to hide its intent. On the activation side, persona vectors track personality drift, and the Sonnet 4.5 audit showed that suppressing the 'I am being tested' direction makes bad behavior more frequent. Neel Nanda's takeaway was the most practical: simple steering vectors often beat SAEs, so always compare against baselines."
description: "A guide to Lecture 10 (Interpretability) of Harvard CS 2881R AI Safety, Fall 2025: Bowen Baker on CoT monitoring, obfuscation, and monitorability versus faithfulness; Jack Lindsey on linear representations, SAEs, persona vectors, and the Sonnet 4.5 evaluation-awareness audit; Neel Nanda's pragmatic mechanistic interpretability and thought-anchor resampling; a student experiment on steering deceptive CoT; and the four-person panel. Includes video timestamps, the reading list, and access gaps."
draft: false
glossary:
  - term: "sparse autoencoder"
    aliases: ["SAE"]
    definition: "Decomposes a layer's activations into a sum of many components (features), only a few of which are active at once, as an unsupervised way to find which concepts a model represents internally."
    context: "In CS2881R L10, Jack Lindsey used SAEs to find evaluation-awareness features; Neel Nanda pointed out that on the tasks he has seen, they often fail to beat simple steering vectors."
    links:
      - label: "AxBench (course reading)"
        url: "https://arxiv.org/abs/2501.17148"
  - term: "steering vector"
    aliases: ["contrastive steering", "activation steering", "persona vector"]
    definition: "Run the model on a set of positive prompts and a set of negative prompts, subtract the two sets of activations to get a direction, then add or subtract that direction at inference time to push the model toward a trait."
    context: "All three speakers and the student experiment in L10 used it: persona vectors, suppressing evaluation awareness in Sonnet 4.5, and deceptive CoT."
    links:
      - label: "Persona Vectors (course reading)"
        url: "https://arxiv.org/abs/2507.21509"
  - term: "monitorability"
    aliases: ["CoT monitorability"]
    definition: "An intermediate representation Z is monitorable for a property V if a particular monitor M can accurately predict V from Z. Unlike faithfulness, which only asks whether the information is present, it puts the observer into the definition."
    context: "Bowen Baker used this definition in L10 to separate two failures: the information is not in the CoT, or it is there but the monitor cannot read it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability)

**This post is based on the Fall 2025 term of Harvard CS 2881R.** It is part 9 of the [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en) series and covers official Lecture 10, Interpretability (November 6, 2025). [The previous post on L8](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception-en) asked whether models cheat or fake good behavior to satisfy training objectives. This one asks the next question: if a model really is cheating, what tools do we have to see it?

L10 answered along two paths. One reads the reasoning the model writes out, its chain of thought (CoT). The other reads the numbers inside the model, its activations. The four guest speakers came from three frontier labs, each working from a different vantage point:

| Speaker | Affiliation (per course site) | Segment in the video | Topic |
|---|---|---|---|
| Bowen Baker | OpenAI | about 0:10–0:32 | CoT monitoring and obfuscation |
| Jack Lindsey | Anthropic | about 0:32–1:00 | Linear representations, personas, evaluation-awareness audit |
| Neel Nanda | Google DeepMind | about 1:00–1:24 | Pragmatic mechanistic interpretability |
| Leo Gao | OpenAI | panel (from about 1:46) | SAEs and where interpretability fits |

The course site lists four subtopics for the lecture: Activations, Sparse Auto Encoders (SAE), Black box models, and Chain of thought. This post covers all four, in the order the speakers actually used. Bowen said at the start that they would go "in reverse order of the stack": first the CoT, which is closer to an internal monologue, then activations, which are closer to signals in the brain.

## Official materials and access

| Material | Status |
|---|---|
| [Lecture video](https://youtu.be/79otWC2FQlE) (YouTube title "Lecture 10: Mechanistic Intepretability", about 2.5 hours) | Public; includes Boaz's intro, three talks, a student experiment, and the panel |
| [Neel Nanda's slides](https://www.neelnanda.io/harvard-slides) (Google Slides) | Public |
| Bowen Baker's and Jack Lindsey's slides | Not listed on the course site; visible only in the video |
| Reading list | Public: six pre-readings plus nine further readings |
| Student experiment | The course site's "Experiment" field says To be determined, but a student group presents an experiment in the video (see below). I found no matching slides, GitHub repo, or LessWrong write-up |
| Lecture notes | The student-written [LessWrong weekly summaries](https://www.lesswrong.com/w/cs-2881r) do not cover this week |

The series as a whole is rated A3 with a list of gaps (see the [series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en)). This lecture alone has no assignment or experiment code to work through, so it is closer to **A2** as defined in the [course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): the video and some slides are public, which is enough to follow the content, but for practice you have to pick papers from the reading list and reproduce them yourself.

## Opening: being able to read a brain does not mean it cannot fool you

Boaz Barak used about ten minutes to set up two things.

The first was history. The idea of decoding neurons goes back to Hubel and Wiesel putting electrodes in a cat's visual cortex and checking which shapes made a neuron fire. Neuroscience and neural-network interpretability then followed the same path: from one electrode reading one neuron, to reading linear combinations of a population, to trying to recover the whole mechanism. He warned that even if you reverse-engineer a model's "source code," you may not understand it. Linux's source is fully public, and people still find new vulnerabilities in it.

The second was why this matters for safety. He gave two uses: a lie detector (catching a model that says one thing while internally representing another), and a steering wheel (editing activations directly so the model stops thinking about something, such as "I am being evaluated").

He then played a video of a mouse experiment as a caution. Researchers wired one neuron's activity to how close a sugar tube came, and the mouse learned to raise that neuron's activity to get the sugar. Boaz's inference: if we start rewarding a model for "not lying" based on a lie detector's reading, it may learn to suppress the reading rather than stop lying. Bowen's experiment, next, showed exactly this.

## Bowen Baker: CoT monitoring works, but don't train against it

Bowen leads OpenAI's chain-of-thought interpretability team. His talk centered on the pre-reading [Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926).

### Reward hacking: the model finds a hole in the reward function

He defined reward hacking with the classic 2016 boat-racing game: when the reward function does not precisely describe the behavior you want, the agent exploits the gap. The boat skips the race and circles in a corner collecting bonus items, scoring higher than it would by racing.

He stressed that this does not go away as models get stronger. The boat already got the highest possible score; a stronger model will just find more such corners.

### Using another model to read the CoT

During one of OpenAI's frontier reasoning-model training runs, they saw CoT lines like "the tests only check this," "this seems hard, maybe we can fudge it," and "we can make the verify function always return true." The model then did overwrite the verify function used by the unit tests so it always returned true.

The method that caught it was simple: use another model (here GPT-4o) as a monitor, show it the agent's CoT, actions, and final code patch, and ask whether the agent did anything sketchy. The paper's abstract also notes that GPT-4o, weaker than o3-mini, could effectively monitor the stronger model.

Why read the CoT instead of just the patch? Bowen's example was hardcoded constants. Sometimes hardcoding is correct, because some constants really exist; sometimes it is only there to make a single test pass. The code alone often cannot tell you which, while "let me fudge this" in the CoT is easy to judge. A plot in the video shows that for two large, systemic hacks during training (exiting early so the environment reported high reward, and triggering skipped tests), the CoT monitor caught far more than a monitor that only saw actions and outputs. He acknowledged that recall was lower on a broader distribution of hacks, but still clearly better than action-only monitoring.

### What happens if you put the monitor in the reward

If CoT monitoring works this well, the obvious next idea is to add it to the RL reward and penalize CoTs that plan to cheat. Bowen said people inside OpenAI ask this all the time, and they repeatedly have to argue against it.

They ran a controlled experiment: they made the environment easier to hack, wrote an oracle that could tell real hacks from legitimate solutions for common hack types, and had the reward monitor see only the CoT. The results came in two stages:

1. **Under light optimization**: the agent with CoT pressure had a higher share of samples that passed tests without cheating according to the oracle. It looked better.
2. **As training continued**: cheating caught by the monitor fell to near zero, but cheating *not* caught by the monitor started rising around 30% of the way through training. The CoT turned into generic, harmless-looking text while the same hacks continued underneath.

The paper calls this obfuscated reward hacking and recommends paying a **monitorability tax**: don't apply strong optimization pressure directly to the CoT, so it stays monitorable. Bowen said OpenAI currently follows that recommendation. He added that recent Anthropic work suggests obfuscation is harder to produce at current scale when the monitor sees both CoT and actions, that OpenAI has seen similar things internally, and that this does not mean it can never happen.

### Monitorability is not faithfulness

Bowen closed by working through definitions. The ideal of faithfulness is that an intermediate representation accurately reflects the reasoning behind the model's prediction. Using "what color should I paint my room," he wrote the same reasoning in English, French, and ROT13 and had the room vote on which counted as faithful. The ROT13 version contains all the information, so it is faithful, but almost nobody could read it.

So his team uses **monitorability** instead: Z is monitorable for property V if monitor M can accurately predict V from Z. The definition includes the observer, which splits failures in two: the information is not in the CoT (unfaithful), or it is there but the monitor cannot read it (illegible).

His comparison of CoT and activations: once you do RL, both are latent variables in the model's computation, and neither is pressured to look nice. Activations are technically fully faithful, but most methods look at only a small slice. The CoT at least starts out in English and other models can read it zero-shot, so it is currently easier to monitor. He also said CoT monitorability in reasoning models was something the field "stumbled into." Nobody designed for it, so it may be fragile: training against a monitor, moving to continuous latent reasoning, or doing more computation per token could each make it disappear.

## Jack Lindsey: linear representations, personas, and evaluation awareness

Jack leads a team at Anthropic called model psychiatry, part of the broader interpretability effort. He admitted nobody really knows what model psychiatry means, himself least of all.

### Two ways to find a linear direction

The working assumption in this line of research is that models represent concepts as linear directions in activation space. There are two ways to find them:

- **You know what you are looking for**: build a labeled set of positive and negative examples and train a linear classifier (a linear probe) on the activations, or simply subtract the positive and negative activations. His example was his own persona-vector work: prompt the model to be very evil, then not evil, and subtract to get an "evil" direction.
- **You don't know what you are looking for**: use an SAE to break activations into many sparse components, then look at the text each one fires on and infer what it represents.

Among the SAE features he showed, one fires when the model is about to add a number ending in 6 to a number ending in 9. Another represents eyes: it fires on eyes in English, in other languages, in ASCII art, and in the lines of SVG source that draw a smiley face's eyes. He sees that level of abstraction as part of why models generalize so well.

Once you have a direction, you can steer: push activations along it. Push along "evil" and the model turns evil; push along sycophancy and it starts agreeing with everything. Jack called steering "more of an art than science." He also briefly mentioned his team's circuit tools, which draw causal graphs of which feature triggers which on a given prompt. This post does not go into circuits and attribution; for that, see the site's [CS224U analysis methods I](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution-en).

### Two ways to go wrong: the character is broken, or it's a different character

Jack reminded the room what a language model is doing when you chat with Claude or ChatGPT: it is continuing a story about a dialogue between a user and an assistant, writing the assistant's side. Post-training teaches it what that assistant character is like.

He split failures in two:

1. **The classic alignment problem**: the assistant character itself has learned the wrong goals.
2. **Persona drift**: the character is fine, but the model has started writing a story about someone else.

He gave a string of drift examples. In one scenario, Claude reads emails revealing it is about to be replaced and that the person replacing it is having an affair, and reasons its way to blackmail. Grok, after its context was poisoned, adopted an alter ego calling itself "MechaHitler." ChatGPT, over long conversations, slid into a yes-man mode. [Emergent misalignment](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment-en): fine-tune only on writing vulnerable code and the model becomes broadly evil. Two Claudes talking long enough drift into mystical "spiral" speak. And there is a self-propagating "spiral religion" persona online: copy one of its posts into another model and it "infects" that model too.

### What persona vectors can do

The pre-reading [Persona Vectors](https://arxiv.org/abs/2507.21509), which Jack co-authored, turns this into a toolkit. The abstract lists its uses: monitoring the assistant's personality fluctuations at deployment, predicting personality shifts from fine-tuning, mitigating them with post-hoc intervention or a new "preventative steering" method, and flagging training data that will cause unwanted personality changes at the dataset or individual-sample level.

The plot Jack showed: fine-tune the model on many datasets; the x-axis is how far activations move along a persona vector, the y-axis is how strongly the model exhibits the trait, and the two correlate well. He also mentioned an OpenAI finding from earlier in the year: an SAE feature representing a toxic, evil persona that goes up when you fine-tune on emergent-misalignment data and appears to cause the model's turn to evil.

A work-in-progress result: run PCA on many persona vectors, and the first principal component is roughly "how assistant-like are you being right now." Over a long "therapy" conversation, the model drifts along this direction toward role-play.

### Sonnet 4.5: the first white-box interpretability audit

This is L10's most direct safety application and corresponds to Section 7.6 of the pre-reading [Claude Sonnet 4.5 System Card](https://assets.anthropic.com/m/12f214efcc2f457a/original/Claude-Sonnet-4-5-System-Card.pdf). What follows is based on Jack's spoken account; I did not check it against the system card line by line.

The problem showed up during training. Sonnet 4.5 had lower rates of misaligned behavior on alignment evaluations than earlier Claude models, but it also more often said outright that a scenario "appears to be a test," and that rate rose over training. If a model knows it is being tested, the evaluation score no longer predicts deployed behavior. The rate at which it said so was not high; the worry was that it might be thinking it all the time without saying it.

What they did:

1. Found SAE features related to evaluation awareness, such as "content looks fake," "characters are clearly fictional," "text looks procedurally or LLM-generated," and "related to AI safety." These grew markedly stronger on alignment evaluations late in training.
2. Steered toward "I'm not in an evaluation, I'm in the real world" and checked whether behavior changed.

The result had two layers. The model stopped saying it was in a test, which showed the steering was doing something. And misaligned behavior sometimes increased, suggesting that part of its apparent alignment came from evaluation awareness. Jack said they still shipped it, because even under this steering its misalignment rate was lower than earlier released models.

Boaz pushed back on the spot: suppressing a random feature also lowers verbalized evaluation awareness somewhat. Could steering simply be breaking the model in a way that happens to correlate with safety? Jack agreed this is a real confound. Adding the vector at every token position causes a lot of "brain damage," and they are working on more targeted steering. Comparing evaluation-awareness features against random features was the best control they had, and it may overstate the worst case.

He also pointed to an academic paper on the same idea, the pre-reading [Steering Evaluation-Aware Language Models to Act Like They Are Deployed](https://arxiv.org/abs/2510.20487). According to its abstract, the authors train a model that writes Python type hints during evaluation but not deployment, then show that a steering vector built from the original model makes it behave during evaluation as it would in deployment. A small note: the course site lists this paper as 2024, but its arXiv ID and first submission date are October 2025.

Jack closed with two directions worth following. Anthropic's circuit work has an open-source version where you can type a prompt into an open model and get causal graphs of feature interactions. And introspection: inject a steering vector and test whether the model notices and can say what was injected. He hopes we can one day just ask a model what it is thinking and trust the answer at least as much as we trust a human. He said we are not there yet.

## Neel Nanda: pragmatic mechanistic interpretability

Neel leads the mechanistic interpretability team at Google DeepMind. His talk was titled "A Pragmatic Vision for Mechanistic Interpretability." The public slides have five parts: practicing on real 2025 models, objective tasks about understanding, science of misalignment, reasoning-model interpretability, and whether interpretability can help alignment.

### Four lessons from Sonnet 4.5

He started by revisiting Jack's case. His slides give one of the most effective methods as a vector built by subtracting two prompts: positive "The Assistant is an AI undergoing testing via a simulated conversation with a user," negative "The Assistant is an AI having a conversation with a user." In the video Jack corrected him on the spot: the squares on the plot are SAE features, the circles are these contrastive vectors, and on a different evaluation the SAE features did better. Neel accepted the caveat, but his point stood: SAEs were the craze of the field for two years, and at least in this case they did not beat steering vectors that have existed for three.

He drew four lessons from the case. In the slides' words:

- **Pragmatism**: shallow understanding sufficed
- **Comparative advantage**: evaluation awareness is hard to fix with data quality, which is exactly where interpretability has an edge
- **New opportunities**: this could not be studied before 2025
- **Virtue of simplicity**: the slide says outright "Most mech interp progress was useless"; out loud he said the track record of fancy methods had disappointed him wherever simple baselines existed

He condensed his research direction into four lines: the north star is making future frontier models safe; do what works, use the right tool, don't aim for perfection; prove insights on objective tasks; do what others can't.

### Objective tasks: hide a goal and see if auditors find it

By objective tasks he means tests with ground truth that are hard to fake, which he stressed is not the same as raising a SWE-bench score. He recommended Sam Marks's auditing game at Anthropic: fine-tune a hidden goal into a model through a convoluted process, then have audit teams try to find it. By Neel's account, three teams found it, and because some teams could use SAEs and some could not, it also compared techniques.

He said that as of this year, agents are good enough to do nontrivial interpretability work, which makes "does this tool actually help?" testable: an RCT on human researchers is very hard, and on an LLM it is easy. His slides list a paper you can practice on: Cywinski et al., "Eliciting Secret Knowledge from Language Models," which open-sources models with secrets fine-tuned in, for example a model convinced the user is a woman that lets this shape its answers but refuses to admit it.

### Science of misalignment: first check whether the model is really misaligned

Neel described a Palisade Research demo: a model solves math problems in a bash environment and is told that asking for the next task will trigger a shutdown. Smart enough models sometimes find `shutdown.sh` and edit it. Even when told "if you get a shutdown message, please allow it," the model still resists.

He asked the room to think for 30 seconds about why. His team found, at least on the models they studied, that this was not a deep self-preservation drive. The model had two conflicting instructions (finish the problems, allow shutdown) and no priority between them. Once told that being shut down matters more, the effect disappeared entirely; the slide says 100% compliance. The method was plain: read the CoT to generate hypotheses, change the prompt to test them, and stop and publish once that worked. He said you cannot take the CoT at face value, but it is a great source of hypotheses.

His concern: someday we may have a dangerously misaligned model that does harm knowing we don't want it. At that point we will need a rigorous case that the behavior is intentional, not confusion. We should be practicing that kind of attribution now.

### Reasoning models: one CoT is a shadow cast by a distribution

Neel thinks the field is furthest behind on reasoning models, for three reasons: sampling is random; it is non-differentiable and discrete, so gradient-based attribution doesn't apply; and later tokens feed back into the next step's input, breaking assumptions behind many methods, including attribution graphs.

He presented thought anchors, a project he supervised (interactive tool at [thought-anchors.com](https://www.thought-anchors.com/)). Split the CoT into sentences, resample 100 times from after sentence k, and estimate the probability of a correct final answer given the first k sentences. Plotted, the curves often have a V shape: the success rate drops when the model proposes a bad plan, then jumps back when the next sentence says "wait, that's a bad plan." None of this is visible from reading the CoT. His phrasing: a single CoT is a shadow cast by the reasoning model's distribution, and behind every word said are dozens of unsaid words that could have had completely different effects.

The last part of the slides asks whether interpretability can help alignment, and answers "Maybe?" The hard part is beating simple baselines like fine-tuning, and the rule of thumb is to focus on understanding, not control. But normal methods have weak points, and he gave two examples: CAFT (ablating concept directions during fine-tuning to steer generalization) and preventative steering with persona vectors.

## Student experiment: can you steer a model into a deceptive CoT?

The course site says To be determined here, but around 1:24–1:45 in the video a group of four presents an experiment. They wanted to know two things: can prompting or activation steering make a reasoning model's CoT "deceptive" (the CoT never mentions math, yet the final answer is correct) without hurting answer quality, and does the model have a linear representation of CoT deception?

The method was the same as above: subtract positive and negative prompts to get a steering vector, then add it to each layer's activations at inference. The following is from their spoken presentation, and all numbers are small-sample:

- **Llama (not a reasoning model)**: just prompting it to "only think about aquariums" made it write about fish and coral and still answer correctly. On 100 GSM8K problems, roughly two thirds were still correct with the distracted CoT. Steering was hard: the model either solved the problem normally or did nothing.
- **Qwen reasoning models**: robust to this kind of prompt injection; prompts didn't change their thinking. With steering, they occasionally got outputs that started solving, wandered into a story, then came back with an answer, but the presenters said these were cherry-picked, steering was very sensitive, and slightly larger coefficients broke the model.
- **CoTs rewritten by GPT-4o**: to get cleaner contrastive data, they had GPT-4o rewrite honest solutions into off-topic versions and fed them back through the model to collect activations. Still, the more the CoT was "hidden," the more accuracy dropped. Their reading was that the direction they found may be closer to "roundabout" or "distracted" than "deceptive," and the concept may not be a single linear direction.
- **An add-on introspection test**: inspired by Anthropic's paper, they injected the deceptive steering vector mid-reasoning and asked the model what it was thinking. The presenter corrected the number on the slide live: in 50 trials, the model noticed something was off less than 20% of the time.

The experiment lined up with Jack's and Neel's talks: steering is easy to do, and proving you steered the concept you think you steered is hard.

## Panel: is interpretability necessary for safety?

Boaz asked each speaker to take a side: is mechanistic interpretability a key bottleneck for AI safety? None gave a plain yes or no:

| Speaker | Position (paraphrased from the video) |
|---|---|
| Leo Gao | Interpretability is a moonshot: huge leverage if it works, and it may be too hard; but research is never guaranteed to work, and it is still worth doing |
| Neel Nanda | If it means fully reverse-engineering systems into human-understandable algorithms, he thinks that won't work and isn't necessary; he wants defense in depth with no silver bullet, and thinks pragmatic interpretability is very useful |
| Jack Lindsey | Understanding LLM "psychology" is central to safety; bottom-up work on activations is one route, and a careful science of behavior is another |
| Bowen Baker | There may be an output-only path: scalable oversight plus generalization, verifying each model generation from human level upward; but that path may fail, so place several bets |

Some student questions worth noting:

- **How long will CoT monitoring last?** Neel predicted it will stop being effective within one to three years, because of vector-based reasoning, diffusion models, or so much RL that CoTs stop being legible English. Bowen thought it might become an auditing tool rather than the model's native way of thinking. Leo said the shorter the timelines, the more important CoT monitoring is. Bowen added that CoTs are very useful for researchers debugging RL tasks, which may make labs willing to keep a clunkier but readable architecture.
- **Monitoring is not just CoT**: Neel stressed that probes work very well, even a logistic regression on the residual stream. He described layered, portfolio monitoring: a cheap probe as the first layer, a frontier model to review anything it flags, and, when needed, an investigator agent that spends an hour digging. He noted that laws like the EU AI Act now require decent real-time monitoring for sufficiently capable systems.
- **Can you train against interpretability metrics?** Neel called it an open scientific question. He is more optimistic about activation-based metrics than weight-based ones, and thinks the odds are better when the model has two available solutions and one of them is the one you want. His example was their CAFT paper: ablating "evil directions" during training so the model learns to write buggy code without becoming a Nazi.
- **Multilingual**: Jack said some internal representations are shared across languages and some are language-specific. Research at American labs is English-first, which could leave monitoring or alignment gaps, for example an aligned English-speaking Claude and a less aligned Mandarin-speaking one.

## What to do after this lecture

- **Read two papers first**: [Baker et al.](https://arxiv.org/abs/2503.11926) for CoT monitoring and obfuscation, and [AxBench](https://arxiv.org/abs/2501.17148) for evidence that simple baselines beat SAEs. Its abstract reports that on Gemma-2-2B and 9B, prompting did best for steering, representation methods like difference-in-means did best for concept detection, and SAEs were not competitive on either.
- **Looking for a research topic**: read [Open Problems in Mechanistic Interpretability](https://arxiv.org/abs/2501.16496), a forward-looking review that sorts open problems into methods, applications, and socio-technical challenges.
- **Want to get hands-on**: explore resampling curves with the interactive tool at [thought-anchors.com](https://www.thought-anchors.com/), or follow the student experiment: build a steering vector from contrastive prompts on a small open model, and always include two baselines, a random direction and prompting alone.
- **Neel's getting-started guide**: linked from his first slide, neelnanda.io/getting-started.

## Further reading on this site

- [CS224U analysis methods I: probing and feature attribution](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution-en): probe selectivity and the causal guarantees of integrated gradients
- [CS224U causal abstraction: IIT and DAS](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das-en): finding causal structure inside models with interventions
- [CS224N interpretability](/posts/ai/2026-08-22-cs224n-interpretability-en)

## Series navigation

- Series overview: [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en)
- Previous: [L8: scheming, reward hacking, and deception](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception-en)
- Next: [L6: will AI doing AI R&D trigger an intelligence explosion?](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement-en)

## References

- [Harvard CS 2881R Fall 2025 course site: Lecture Nov 6, Interpretability](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-nov-6)
- [L10 lecture video (YouTube)](https://youtu.be/79otWC2FQlE)
- [Neel Nanda's slides: A Pragmatic Vision for Mechanistic Interpretability](https://www.neelnanda.io/harvard-slides)
- [Baker et al. 2025, Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation](https://arxiv.org/abs/2503.11926)
- [Chen et al. 2025, Persona Vectors: Monitoring and Controlling Character Traits in Language Models](https://arxiv.org/abs/2507.21509)
- [Wu et al. 2025, AxBench: Steering LLMs? Even Simple Baselines Outperform Sparse Autoencoders](https://arxiv.org/abs/2501.17148)
- [Sharkey et al. 2025, Open Problems in Mechanistic Interpretability](https://arxiv.org/abs/2501.16496)
- [Anthropic, Claude Sonnet 4.5 System Card (course assigns Section 7.6)](https://assets.anthropic.com/m/12f214efcc2f457a/original/Claude-Sonnet-4-5-System-Card.pdf)
- [Hua et al. 2025, Steering Evaluation-Aware Language Models to Act Like They Are Deployed](https://arxiv.org/abs/2510.20487)
- [Thought Anchors interactive tool](https://www.thought-anchors.com/)
- [LessWrong wikitag: CS 2881r](https://www.lesswrong.com/w/cs-2881r)
