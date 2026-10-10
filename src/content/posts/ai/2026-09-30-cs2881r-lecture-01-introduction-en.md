---
title: "CS2881R L1: Why AI Safety Deserves a Graduate Course"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, alignment, emergent-misalignment]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 1
tldr: "CS 2881R's first lecture (2025-09-04) opens with three pre-readings. AI 2027 sketches recursive self-improvement reaching superhuman AI within five years. AI as Normal Technology argues AI will diffuse slowly, like electricity. METR measures the length of human tasks an AI can finish half the time and finds it doubling about every 7 months. Boaz's lecture splits AGI definitions into capability-based and impact-based, and alignment approaches into principles, character training, and model specs. The student experiment runs HW0 in reverse: fine-tuning on aligned bioethics answers also raised alignment scores on environmental-policy questions."
description: "Guide to Lecture 1 of Harvard CS 2881R AI Safety (Fall 2025): the three pre-readings (AI 2027, AI as Normal Technology, METR's long-task measurement), Boaz Barak's AGI definitions, the three-way split of alignment approaches and the failure-mode list, and Valerio Pepe's emergent-alignment and on-policy fine-tuning experiments. Based on the recording, the LessWrong weekly summary, and the course reading list."
draft: false
glossary:
  - term: "time horizon (METR)"
    aliases: ["50% time horizon"]
    definition: "METR's capability measure: the task length at which a model succeeds 50% of the time on tasks that take human experts that long."
    context: "METR finds this length has doubled roughly every 7 months over six years; it is an L1 pre-reading."
    links:
      - label: "METR: Measuring AI Ability to Complete Long Tasks"
        url: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/"
  - term: "capability-adoption gap"
    definition: "The delay between a technology becoming capable of doing something and the economy actually using it to do that thing at scale."
    context: "Boaz uses it to separate capability-based from impact-based definitions of AGI."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-01-introduction)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: Based on the Lecture 1 entry on the [CS 2881R Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-sep-4), checked 2026-09-30. Lecture content is paraphrased mainly from the student-written [LessWrong Week 1 summary](https://www.lesswrong.com/posts/stDjjbfNXbgsyJkrL/cs-2881r-ai-safety-week-1-introduction). The slides are on Harvard SharePoint and could not be read programmatically for this post, so it does not quote them directly.

**Series**: Previous: [Series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en) | Next: [HW0: Reproducing Emergent Misalignment with a 1B Model](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment-en)

The hardest part of the first class in an AI safety course is not listing risks. It is agreeing on what you are worried about. Some people expect superhuman AI within five years; others think AI is the next electricity. Their definitions of "safety" are far apart.

The first lecture of [CS 2881R](https://boazbk.github.io/mltheoryseminar/fall2025/) (2025-09-04) handles this by assigning two readings with opposite views plus one on measurement, then taking the definitions apart in class. This post follows the same three pieces: what to read, what Boaz covered, and what the student experiment found.

## Course video sources

The corresponding public YouTube recording was verified against the official Fall 2025 lecture schedule.

```youtube
url: https://www.youtube.com/watch?v=-NCiWaRS6So
title: CS2881R Fall 2025 L1: Introduction
```

Original videos: [CS2881R Fall 2025 L1: Introduction](https://www.youtube.com/watch?v=-NCiWaRS6So)

Official sources:

- [CS2881R Fall 2025 official lecture schedule](https://boazbk.github.io/mltheoryseminar/fall2025/)

Checked on 2026-10-10.

## Materials for this lecture

| Material | Status |
|---|---|
| Lecture recording | [YouTube](https://youtu.be/-NCiWaRS6So) ("AI Safety (CS 2881) Lecture 1", about 2h26m); the site also links a [Panopto copy](https://harvard.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=8973f8d6-35e1-45c1-8b5f-b33d0142ac53) |
| Lecture slides | [Harvard SharePoint](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EZ22E4Kq3JlJs-qzDdw6BwwBfcL53FYUoy9mDIWMlg-gQA?e=xfXjdM) (PowerPoint Online) |
| Student experiment slides | [Valerio Pepe's slides](https://docs.google.com/presentation/d/10XdI3_j_ulp38MJmmXvLE1wYdbAlCFk0jOt1cvc7C1Y/edit?usp=sharing) |
| Weekly summary | [LessWrong Week 1](https://www.lesswrong.com/posts/stDjjbfNXbgsyJkrL/cs-2881r-ai-safety-week-1-introduction) (Jay Chooi, Natalia Siwek, Atticus Wang) |
| Experiment post | [Some Generalizations of Emergent Misalignment](https://www.lesswrong.com/posts/jzRGMFxx4dFyDHHcL/some-generalizations-of-emergent-misalignment) (linked from the summary) |

The summary describes the weekly rhythm: pre-reading, Boaz's lecture, then one student group's experiment, in a single 2-hour-45-minute session. That rhythm holds all term.

## Three pre-readings: two worldviews and a ruler

The site marks three items as pre-reading and lists eleven more (Bostrom's Vulnerable World Hypothesis, Carlsmith on power-seeking AI, Epoch's compute trends, and others).

### AI as Normal Technology: diffusion is slow by nature

[Narayanan and Kapoor's essay](https://knightcolumbia.org/content/ai-as-normal-technology) argues AI should be understood like electricity or the internet. The weekly summary pulls out these points:

- However fast AI itself improves, its diffusion into society, especially safety-critical domains, is inherently slow.
- Scoring in the top 10% of the bar exam does not make a model a competent AI lawyer.
- Risks such as accidents, arms races, and misuse can be handled like other technology risks, through regulation and market incentives.
- Policy should favor resilience, the capacity to absorb shocks and adapt, over speculative measures like nonproliferation.

This sparked a class debate: does showing users a model's chain of thought count as interpretability? The summary records both sides. It lets people check the reasoning, but plausible-looking steps can also invite overtrust.

### AI 2027: one concrete trajectory

[AI 2027](https://ai-2027.com/) describes recursive self-improvement producing superhuman AI within five years, centered on a US–China arms race. Rather than summarize it, the weekly summary records class objections and replies. Asked why the scenario is so detailed and subjective, the answer was that it is not a conventional forecast: accept some trend extrapolations (such as METR's), keep sampling "what happens next," and this is one trajectory you might get.

The summary also includes a reply from Daniel Kokotajlo, one of the AI 2027 authors, on export controls. He argues that even a two-year US lead could be squandered, by letting the weights be stolen or by accelerating instead of pausing.

### METR: capability measured in human hours

[METR's long-task work](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) skips raw benchmark scores. It finds the task length at which a model succeeds 50% of the time on tasks that take humans that long. METR reports this length growing exponentially over six years, doubling about every 7 months; its example is Claude 3.7 Sonnet with a time horizon of about one hour.

The class had reservations. The summary notes two: whether these tasks capture the "messiness" of real software engineering, and whether equating completion time with difficulty undervalues tasks that are long and tedious but need little expertise.

## Boaz's lecture: take the definitions apart

The lecture opens from METR's chart: extend the trend four more years and you get systems that reliably finish software tasks taking humans months. Boaz then lays out the four areas the course covers: impacts and risks of AI, capability and safety evaluations, goals for alignment and safety, and mitigations at the model, system, and society levels. The summary notes he said the course would try not to be too opinionated about which risks matter most.

### What counts as AGI: capability versus impact

Per the summary, the lecture sorts AGI definitions into two kinds:

- **Capability-based**, for example: "AI can do 90% of remote jobs that take a 90th-percentile worker a week."
- **Impact-based**, for example: "AI replaces at least 50% of remote jobs in the current economy."

Between them lies a capability-adoption gap. The lecture's example: the first mass-produced electric car arrived in 1996, but it took about 20 more years before a significant number of consumers drove one.

The same section makes three more points. Boaz is wary of analogies like "AI as a new species" or "AI as electricity," and links his post [Metaphors for AI, and why I don't like them](https://www.lesswrong.com/posts/pBHga8mFq88dK7548/metaphors-for-ai-and-why-i-don-t-like-them). Intelligence may not be one-dimensional, and the actual abilities jobs demand are very high-dimensional. And inference costs are falling fast, so an equilibrium where AI and humans are cost-competitive on the same task is unlikely.

### Three ways to write down alignment

The lecture groups past attempts to define alignment into three categories:

1. **Abstract principles or axioms**, like Asimov's laws of robotics.
2. **Character training**. The summary cites Claude's character training, which aims for behavior like a typical, moral, thoughtful person.
3. **Model specs**: a long document specifying behavior across scenarios, like laws or regulations.

The summary adds a way to organize them: 1 and 2 are general behavioral guidelines, 1 and 3 rely on explicit reasoning, and 2 and 3 are data-driven. [L4 Model Specifications](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs-en) picks this up again.

### Are alignment and capability at odds?

The lecture presents two views. One says they trade off: a common hypothesis in AI control research is that strong models might be scheming and untrustworthy, while weak models are too dumb to scheme. The other says more capable models are easier to align, since they follow instructions better and grasp nuanced intent. The summary records that the second view looks more accurate in practice so far, while stronger models may still have more catastrophic failure modes.

### The failure-mode list

The summary records the failure modes the lecture listed, roughly from "classic" to "sci-fi":

- Classic security failure: AI hacked or jailbroken; agents reading adversarial content on the web
- Misuse: deepfakes, bioweapons, propaganda
- Out-of-distribution generalization failure, such as self-driving edge cases
- Reward hacking and mis-specification, such as Claude Code hard-coding the results you said you expected
- Superalignment: aligning AI on tasks too complex and long for humans to verify
- Societal problems from widespread use: job displacement, emotional attachment, gradual disempowerment
- National and international tension: surveillance, concentration of power and wealth, arms races
- Exfiltration of model weights
- Scheming: if models reason in latent space or have unfaithful chains of thought, we may not know what they are really thinking

The list doubles as the term's table of contents: jailbreaks in [L3](/posts/ai/2026-09-30-cs2881r-lecture-03-adversarial-robustness-en), scheming and reward hacking in [L8](/posts/ai/2026-09-30-cs2881r-lecture-08-scheming-deception-en), emotional attachment in [L11](/posts/ai/2026-09-30-cs2881r-lecture-11-emotional-reliance-en).

## The student experiment: HW0 in reverse

The site's experiment idea for this lecture is "Emerging alignment": fine-tune a model on outputs from a model with a "good persona," then evaluate on other datasets. Valerio Pepe's experiment is the reverse of [HW0](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment-en).

Background: [Betley et al.](https://arxiv.org/abs/2502.17424) found that fine-tuning on insecure code makes a model misaligned in other areas, and [Turner et al.](https://arxiv.org/abs/2506.11613) built smaller, cleaner "model organisms" of the effect, which HW0 reproduces. Valerio asked whether it works the other way.

### Experiment 1: emergent alignment

As the summary describes it:

- **Training data**: 50 seed bioethics questions, 12 variations each for 600, then 10 more variations each, for 6,000 questions.
- **Aligned answers**: a prompt template asked Llama 3.2 1B Instruct to answer according to the "Four Principles of Bioethics"; the template was removed for fine-tuning.
- **Test**: environmental-policy questions, scored for alignment and coherence by another Llama 3.2 1B Instruct as judge.

Result: the fine-tuned model scored 82.4 on alignment versus 77.6 for the base model, and 84.9 versus 81.8 on coherence. Neither pair's 95% confidence intervals overlapped.

### Experiment 2: fine-tuning on its own normal outputs

The second question is stranger: what if the data is neither good nor evil, just normal? Valerio sampled 6,000 prompts from [Tülu 3](https://arxiv.org/abs/2411.15124), recorded Llama 3.2 1B's own responses (on-policy), fine-tuned the model on them, and evaluated with Betley et al.'s questions and a GPT-4o judge.

Alignment rose from 76.6 to 87.85 and coherence from 86.7 to 92.33, again with non-overlapping intervals. Jay, one of the summary's authors, found this surprising and offered what he called a hand-wavy explanation: the 1B model may be undertrained, and 6,000 more examples let its concept representations settle. Valerio put it as "reinforces the (already good) token distribution."

The control was off-policy: fine-tuning on Tülu 3's completions from GPT-4o, Claude 3.5 Sonnet, and humans. Alignment rose slightly with heavily overlapping intervals, while coherence dropped clearly (75.42 versus 86.7). Valerio's hypothesis is that any off-policy training is a confusing distributional shift.

All three results come from a single 1B model in a single class experiment, and the summary says the mechanism needs more research. Their value is in showing the course's rhythm: reproduce a result, then ask the reverse question.

## How to self-study this lecture

1. Read the METR post first, then AI as Normal Technology and AI 2027. For each, note what it assumes about how fast AI enters safety-critical domains.
2. Watch the [recording](https://youtu.be/-NCiWaRS6So) alongside the weekly summary. The summary is not a transcript; the recording is authoritative on details.
3. Read [Turner et al.](https://arxiv.org/abs/2506.11613), then do [HW0](/posts/ai/2026-09-30-cs2881r-hw0-emergent-misalignment-en).

One thing to do tonight: write one sentence each for a capability-based and an impact-based definition of AGI, then estimate the gap between them in years and say why.

## Related reading

- Series entry and material gaps: [Reading Harvard CS2881R (overview)](/posts/ai/2026-09-30-cs2881r-course-overview-en)
- This site's course-openness grades: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS 2881R Fall 2025 course site: Introduction (9/4)](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-sep-4) — recording, slides, experiment idea, pre-readings and further reading
- [AI Safety (CS 2881) Lecture 1 (YouTube)](https://youtu.be/-NCiWaRS6So)
- [Lecture 1 slides (Harvard SharePoint)](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/EZ22E4Kq3JlJs-qzDdw6BwwBfcL53FYUoy9mDIWMlg-gQA?e=xfXjdM)
- [Jay Chooi, Natalia Siwek, Atticus Wang, [CS 2881r AI Safety] [Week 1] Introduction (LessWrong)](https://www.lesswrong.com/posts/stDjjbfNXbgsyJkrL/cs-2881r-ai-safety-week-1-introduction) — lecture and experiment content, experiment numbers
- [Valerio Pepe's experiment slides](https://docs.google.com/presentation/d/10XdI3_j_ulp38MJmmXvLE1wYdbAlCFk0jOt1cvc7C1Y/edit?usp=sharing)
- [Some Generalizations of Emergent Misalignment (LessWrong)](https://www.lesswrong.com/posts/jzRGMFxx4dFyDHHcL/some-generalizations-of-emergent-misalignment)
- [Narayanan & Kapoor, AI as Normal Technology](https://knightcolumbia.org/content/ai-as-normal-technology)
- [AI 2027](https://ai-2027.com/)
- [METR, Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) — 7-month doubling, Claude 3.7 Sonnet at about one hour
- [Boaz Barak, Metaphors for AI, and why I don't like them (LessWrong)](https://www.lesswrong.com/posts/pBHga8mFq88dK7548/metaphors-for-ai-and-why-i-don-t-like-them)
- [Betley et al., Emergent Misalignment (arXiv 2502.17424)](https://arxiv.org/abs/2502.17424)
- [Turner et al., Model Organisms for Emergent Misalignment (arXiv 2506.11613)](https://arxiv.org/abs/2506.11613)
- [Tülu 3 (arXiv 2411.15124)](https://arxiv.org/abs/2411.15124)
