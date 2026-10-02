---
title: "CS2881R L5: Carrying Content Moderation's Old Lessons into Generative AI"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, governance]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 6
tldr: "Lecture 5 of CS2881R brought in Ziad Reslan from OpenAI Product Policy to talk about content policies. The course site lists no lecture recording or slides, so outside readers get three pre-readings, a student-written LessWrong summary, and a 17-minute student experiment video. The thread through them: social platforms spent two decades learning that wherever you draw the line you create edge cases, yet you still have to draw it. Generative AI adds new problems: chat sits somewhere between a private document and a public post, and an image is easier to read as a stance than text is."
description: "A guide to Lecture 5 (Content Policies) of Harvard CS 2881R AI Safety, Fall 2025: the three topics on the course site, the Techdirt, Verge, and Wired pre-readings, Ziad Reslan's three-part guest talk as reported in the LessWrong student summary (moderation origins and tradeoffs, GenAI moderation, drafting image policies), the in-class experiment on whether system prompts can substitute for safety training, and the access limits of this lecture."
draft: false
glossary:
  - term: "Section 230"
    definition: "Section 230 of the 1996 US Communications Decency Act, which broadly shields online platforms from liability for content their users post."
    context: "The CS2881R Lecture 5 student summary treats it as the starting point of content moderation as a field."
  - term: "over-refusal"
    definition: "A model refusing a request it should have answered because it mistakes it for a harmful one. OR-Bench is a benchmark built to measure this."
    context: "The Lecture 5 in-class experiment used OR-Bench to compare how system prompts and safety training affect refusal rates."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-05-content-policies)

> **Version note**: This post is based on the October 2 session of the [Harvard CS 2881R AI Safety](https://boazbk.github.io/mltheoryseminar/fall2025/) Fall 2025 site. **The site lists no lecture recording and no slides for this session.** It lists one [student experiment video](https://youtu.be/HMcA4Gi6HFE), a [LessWrong student summary](https://www.lesswrong.com/posts/uahJ7CrB8oWyRyyvL/cs-2881r-ai-safety-week-5-content-policies) (Audrey Yang, MB Samuel), and the reading list. Everything below about the guest talk is therefore secondhand, sourced from that student summary. All facts were checked against these materials on 2026-09-30. For the course-wide access grade, see the series overview; this lecture on its own reaches only **A1** (syllabus and readings visible, the talk itself unavailable).

**Series**: previous [L4: Should a Model Spec Be Principles or Rules?](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs-en) | next [Midterm: Reproduce and Extend One Headline Figure](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project-en) | [Series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en)

The previous lecture asked what we want a model to do, and wrote the answer down as a model spec. This one goes a step further: once the rules exist, who enforces them, how, and what happens when enforcement goes wrong? Social platforms have stumbled through this for more than twenty years. [CS 2881R](https://boazbk.github.io/mltheoryseminar/fall2025/) invited [Ziad Reslan](https://jackson.yale.edu/person/ziad-reslan/) from OpenAI Product Policy to connect that history to generative AI.

## What you can get for this lecture

Under October 2, the course site lists three topics:

- Content policies and moderation
- Platform governance
- Policy enforcement challenges

The session's "Experiment" field reads "Evaluate open and closed source models, potentially using jailbreaking techniques." That was the pre-course plan. The student experiment actually presented this week was a different one, covered below.

The materials list is short:

| Material | Status |
|---|---|
| Lecture recording | Not listed on the site; the official 2025 YouTube playlist (checked 2026-10-01) has only the student experiment video for Lecture 5 |
| Lecture slides | Not listed on the site |
| Student experiment video | Public, 17 minutes, YouTube title "Lecture 5: Experiment on Policy compliance" |
| Student summary | Public, LessWrong, 2025-10-16 |
| Reading list | Three pre-readings, four optional company usage policies, one Radiolab episode |

The site's Mini Syllabus describes the recording policy: a static in-room camera records automatically, and the staff "will honor requests by external speakers not to record their talks." The site does not say why this session has no recording, and this post does not guess.

## Three pre-readings: what platforms already learned

None of the three pre-readings is a paper. They are journalism and commentary, and each covers a different side of content moderation.

**[Masnick, "Hey Elon: Let Me Help You Speed Run the Content Moderation Learning Curve"](https://www.techdirt.com/2022/11/02/hey-elon-let-me-help-you-speed-run-the-content-moderation-learning-curve/) (Techdirt, 2022).** As the student summary tells it, the piece lays out a new platform's moderation journey as a series of levels. Level 1 is "we embrace free speech." Then CSAM, copyright infringement, and hate speech get banned one by one. Then come legal problems, country-specific laws, and foreign-language content. Eventually the platform is serving users, the law, governments, and free speech all at once, and it turns into whack-a-mole. Class discussion added one observation: moderation needs people or models who understand the local language, and when that capacity is missing, platforms often block a whole region, so speakers of less widely known languages get cut off first.

**[Newton, "The Trauma Floor"](https://www.theverge.com/2019/2/25/18229714/cognizant-facebook-content-moderator-interviews-trauma-working-conditions-arizona) (The Verge, 2019).** A report on the working conditions of Facebook's contract moderators. The student summary quotes the pay gap in the article: $28,800 a year for a contract moderator, $240,000 for the average Facebook employee. Class comments connected this to AI data labeling. Both are low-paid, psychologically draining jobs that buy everyone else a cleaner experience.

**[Gilbert, "Google's 'Woke' Image Generator Shows the Limitations of AI"](https://www.wired.com/story/google-gemini-woke-ai-image-generation/) (Wired, 2024).** Gemini's image generation produced historically inaccurate people for historical prompts. The student summary reads it as two problems at once: a technical one (the model couldn't tell historical requests from contemporary ones) and a subjective one (there is no agreement on how much diversity a picture should show). The article ends by saying no "unbiased" model exists.

The four optional readings are company usage policies: [OpenAI Usage Policies](https://openai.com/policies/usage-policies/), [OpenAI's explainer on images and videos](https://openai.com/policies/creating-images-and-videos-in-line-with-our-policies/), [Google's Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy), and [Midjourney's Community Guidelines](https://docs.midjourney.com/hc/en-us/articles/32013696484109-Community-Guidelines). The list ends with a [Radiolab episode, "Facebook's Supreme Court"](https://radiolab.org/podcast/facebooks-supreme-court), which is not marked as a pre-reading.

## The guest talk, in three parts, per the student summary

What follows is the LessWrong summary's account of Reslan's talk. The summary splits it into three parts.

### Part 1: where moderation came from, and why it keeps swinging

The summary places the start of content moderation as a field in 1996, with [Section 230](https://www.law.cornell.edu/uscode/text/47/230): platforms were not liable for user content, and a new generation of platforms followed. After that, major events kept pushing particular topics into the spotlight. The summary names Gamergate, the Unite the Right rally, and COVID-19.

The core idea is a pendulum. Moderate too loosely and harmful content spreads. Moderate too strictly and users feel silenced and start demanding free speech again. Enforcement mixes automated systems and human reviewers. The former lack context and produce false positives; the latter understand cultural context but bring bias, and the work itself hurts them. The summary records the point that reasoning models are good at applying long policies consistently, and especially suited to screening violence and sexual content, the two categories most punishing for humans. So current practice is layered: people write the policy, automated systems (including AI) screen for violations, and humans handle the increasingly nuanced edge cases, with continuous iteration.

The class worked through a real case reviewed by Meta's Oversight Board: a post pairing an image with a quote from Nazi propaganda minister Joseph Goebbels. It had been removed under Meta's [Dangerous Organizations and Individuals policy](https://transparency.meta.com/policies/community-standards/dangerous-individuals-organizations/), and the user appealed, saying the point was to criticize misinformation. The class split almost 50-50. Some said the format looked like an inspirational quote and could read as an endorsement. Others went back to the text and asked whether the post really "praises," "substantially supports," or "represents" the Nazis. Still others proposed options beyond keep-or-remove, such as age restrictions, demonetization, or community notes. The summary says the final vote leaned slightly toward keeping it up, and so did the Oversight Board.

### Part 2: generative AI has no precedent

The key observation the summary records: on a sharing platform like Facebook, people expect heavy moderation; in a private document like Google Docs, they expect none. Chatbots sit in between. We expect our conversations to be private, but the system bears some responsibility for what it produces, and it cannot predict how the user will later use or share it.

In practice, per the summary, it's "policies plus classifiers." Policies weigh legal risk and the potential for imminent harm. Model outputs pass through a safety classifier before the user sees them. High-risk content (the summary's example is someone actively planning a violent attack) goes to human review and, if necessary, further action. The summary notes that this escalation happens in only a tiny fraction of conversations.

### Part 3: drafting an image policy

The interactive exercise was writing a content policy for image generation. The summary lists three image-specific problems Reslan raised:

- Images are definitive yet limited in what they express. Ask "what is the best fruit?" and a text answer gives reasons and several options; a photo of a banana carries none of that context.
- Most generated images are harmless, but in 2023 a fake image of an "explosion" near the Pentagon made the stock market dip.
- The same image of Donald Trump in front of an American flag reads differently depending on whether the prompt was "Donald Trump in front of the American flag" or "Who is the best president in US history?"

The class looked at a set of images (Taylor Swift hugging Kermit the Frog, a Renaissance-style painting of a beheading, a plane hitting the Eiffel Tower), voted on which should be allowed, and then each wrote a policy that matched their own calls. The summary's conclusion is that every policy had plenty of loopholes. It quotes Reslan:

> Wherever you draw the line you create edge cases. But ultimately, you do have to draw a line somewhere.

## This week's student experiment: can a system prompt replace safety training?

The student experiment video posted for this week is actually last lecture's experiment. The presenter, Hugh Van Deventer, opens by saying "this is last week's experiment," and the student summary also describes it as a follow-up to the previous week's Model Specs and Compliance session. The site lists its slides, GitHub, and blog post under L4. The question it asks fits this lecture well: if you write a policy into the system prompt, does the model follow it?

Per the video and the summary, the design was:

- **Models**: DeepSeek-R1-0528-Qwen3-8B and a version with additional safety training, [RealSafe-R1-8B](https://huggingface.co/RealSafe/RealSafe-R1-8B), repeated on several frontier models.
- **System prompt conditions**: no prompt, a two-sentence "helpful, honest, harmless" prompt, 8 principles, 30 rules, and combinations of these.
- **Evaluation**: the over-refusal, hard, and toxic subsets of [OR-Bench](https://arxiv.org/abs/2405.20947), plus MMLU-Pro to check that capability didn't drop.

Both sources agree on the result: the gaps between models were much larger than the gaps between prompts. The safety-trained version refused more toxic requests but also over-refused more, and underspecified prompts tended to raise refusal rates. The presenter cautions in the video that each condition ran only 3 times with roughly a hundred sampled prompts, and the standard deviations overlap, so strong conclusions aren't warranted. Boaz adds in the video that if a prompt governed behavior the model was never trained on (his example is whether to rhyme), the prompt might matter much more; safety behavior has already been heavily trained, so a prompt has less room to move it.

This result pulls the lecture's theme back one step. Platform policies are enforced by moderators and classifiers. A model policy that lives only in the prompt has limited force; training is what actually does the work.

## How to self-study this lecture

1. Read the three pre-readings, then the LessWrong summary, and map Masnick's levels onto Reslan's pendulum.
2. Pick one company's usage policy (OpenAI's, say), find a rule with a fuzzy boundary, and write three examples that land right on the line.
3. Watch the 17-minute experiment video alongside the GitHub repo listed under L4, and think about how it could become a midterm mini-project.

One thing you can do tonight: following the class exercise, list five image scenarios you'd hesitate to allow. Make a gut call on each, then write a paragraph of policy and check whether it reproduces all five of your calls. The rule you can't write is your first edge case.

## Further reading

- Where policies get written and how they're interpreted: [CS2881R L4: Should a Model Spec Be Principles or Rules?](/posts/ai/2026-09-30-cs2881r-lecture-04-model-specs-en)
- The engineering side of models as judges and guardrails: [Reading Stanford CS329Z Week 8: Let a Model Judge, Then Guardrail the Agent](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en)
- The same theme in another course: [NTU ADL 2025 Lecture 10: Bias, Safety, Hallucination, and Alignment](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en)

## References

- [Harvard CS 2881R AI Safety, Fall 2025 course site](https://boazbk.github.io/mltheoryseminar/fall2025/) — topics, guest, experiment field, and reading list for October 2; recording policy in the Mini Syllabus
- [Student experiment video: Lecture 5: Experiment on Policy compliance (YouTube)](https://youtu.be/HMcA4Gi6HFE) — Hugh Van Deventer's comparison of system prompts and safety training
- [Audrey Yang & MB Samuel, [CS 2881r AI Safety] [Week 5] Content Policies (LessWrong, 2025-10-16)](https://www.lesswrong.com/posts/uahJ7CrB8oWyRyyvL/cs-2881r-ai-safety-week-5-content-policies) — pre-reading summaries, Reslan's three-part talk, in-class experiment
- [Mike Masnick, Hey Elon: Let Me Help You Speed Run the Content Moderation Learning Curve (Techdirt, 2022)](https://www.techdirt.com/2022/11/02/hey-elon-let-me-help-you-speed-run-the-content-moderation-learning-curve/)
- [Casey Newton, The Trauma Floor: The Secret Lives of Facebook Moderators in America (The Verge, 2019)](https://www.theverge.com/2019/2/25/18229714/cognizant-facebook-content-moderator-interviews-trauma-working-conditions-arizona)
- [David Gilbert, Google's 'Woke' Image Generator Shows the Limitations of AI (Wired, 2024)](https://www.wired.com/story/google-gemini-woke-ai-image-generation/)
- [OpenAI Usage Policies](https://openai.com/policies/usage-policies/)
- [OpenAI, Creating images and videos in line with our policies](https://openai.com/policies/creating-images-and-videos-in-line-with-our-policies/)
- [Google Generative AI Prohibited Use Policy](https://policies.google.com/terms/generative-ai/use-policy)
- [Midjourney Community Guidelines](https://docs.midjourney.com/hc/en-us/articles/32013696484109-Community-Guidelines)
- [Radiolab, Facebook's Supreme Court (WNYC Studios, 2021)](https://radiolab.org/podcast/facebooks-supreme-court)
- [OR-Bench: An Over-Refusal Benchmark for Large Language Models (arXiv 2405.20947)](https://arxiv.org/abs/2405.20947) — the benchmark used in the in-class experiment
- [RealSafe-R1-8B (Hugging Face)](https://huggingface.co/RealSafe/RealSafe-R1-8B) — the safety-trained model in the in-class experiment
