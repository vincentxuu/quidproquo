---
title: "AI Makes Things Smooth Exactly Where They Should Be Hard: What Generative AI Does to Learning"
date: 2026-08-04
updated: 2026-08-04
category: learning
type: deep-dive
difficulty: 進階
tags: [ai-and-learning, learning-science, llm, metacognition, self-learning]
lang: en
series:
  name: "Learning How to Learn"
  order: 2
tldr: "The single most-cited meta-analysis on ChatGPT in education (g = 0.867, ~500k views) was retracted by Nature in April 2026. But the positive finding was not overturned — the issue is that it measures performance while the AI is available. Bastani's PNAS RCT measured something else: +48% accuracy during practice with GPT-4, then 17% below never-users once access was removed."
description: "The evidence on generative AI and learning: the retraction, why the non-retracted positive meta-analyses do not contradict Bastani's RCT, and how strongly the cognitive-offloading studies can actually be cited."
draft: false
faq:
  - q: "Will using ChatGPT to study make me learn less?"
    a: "If you use it to hand you answers, yes. Bastani et al.'s 2025 randomized controlled trial in PNAS split nearly a thousand high schoolers three ways: the group with stock GPT-4 during practice improved 48%, but once access was removed they scored 17% below peers who never had it. A version giving teacher-designed hints instead of answers cancelled the harm — yet those students only matched the control group on the exam. Guardrails stop the bleeding; they do not add learning."
  - q: "Are the studies showing AI helps learning wrong?"
    a: "Not wrong so much as measuring something else. Most positive meta-analyses capture performance while the AI is available, not what remains after it is taken away. Deng et al. (2025) raise exactly this concern themselves and recommend proctored assessments to separate the quality of ChatGPT's output from what the student actually learned. Also worth knowing: the most-cited of these papers (g = 0.867) was retracted by Nature in April 2026."
  - q: "How should I use AI without damaging my learning?"
    a: "Put the AI in the hint position, not the answer position — get stuck on your own first, then ask. Two experiments support this: Bastani's GPT Tutor condition, which supplied only teacher-designed hints, erased the harm; and session 4 of the MIT study shows the same ordering effect — participants who wrote unaided first and only then used an LLM had better memory recall and neural re-engagement than those who used an LLM throughout (though the authors stress this does not mean AI improves the brain, and only 18 people completed that session). The signal is simple: if the process suddenly feels smooth, that is usually the moment you have stopped learning."
---

> 🌏 [中文版](/posts/learning/2026-08-04-generative-ai-and-learning)
>
> This is part 2 of "Learning How to Learn". [Part 1 audited the evidence on learning science itself](/posts/learning/2026-08-04-learning-how-to-learn-en) — what holds up, what is only a metaphor, what has been debunked. This part handles one question: **what changes once LLMs arrive.**

Part 1 compresses to a single sentence: **the subjective fluency of learning is inversely related to long-term retention.** Nearly every evidence-backed technique amounts to making the present moment harder — what Robert Bjork calls desirable difficulties.

If that holds, then the threat generative AI poses to learning is not mainly plagiarism. It is something more basic: **the product is positioned to make difficulty disappear.** What follows is whether that intuition has empirical support, and how much.

The conclusions first:

- **Use AI to hand you answers while practising, and you will test worse than if you had never used it.** In a randomized trial with nearly a thousand students: +48% on practice, −17% on the exam once the AI was removed.
- **Most "AI helps learning" studies measure something else** — performance with the AI still in hand, not what remains after it's taken away.
- **One operational rule: get stuck yourself first, then ask.** Put the AI in the hint position, never the answer position.
- **Smooth is the signal.** If the process got easier, that is usually the moment you stopped learning.

What follows is how strong the evidence is for each. Start with something that should be better known than it is.

## The most-cited piece of evidence has been retracted

In May 2025, Wang and Fan published a meta-analysis in Springer Nature's *Humanities and Social Sciences Communications* synthesizing 51 studies and concluding that ChatGPT has a large positive impact on learning performance, g = 0.867. The number went on to be cited in policy briefings, edtech marketing, and hundreds of papers. [Before retraction it had accumulated roughly 486,000 views, 266 citations, and an Altmetric score of about 1,023](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns).

On 22 April 2026, [the journal issued a retraction notice](https://www.nature.com/articles/s41599-026-07310-z):

> The Editor has decided to retract this article due to concerns relating to discrepancies in the meta‑analysis. These concerns were initially raised by Magnus Ingebrigtsen and Marko Lukic. Taken together, the identified issues undermine the Editor's confidence in the validity of the analysis and the conclusions drawn from it. The authors have not responded to correspondence regarding this retraction.

The two-hundred-plus papers citing it are not retracted along with it. The episode is a meta-level demonstration of this article's own subject: **fluent, agreeable and citable is not the same as true.**

## The positive finding stands — but it measures something else

Don't overcorrect, though. **The retraction does not overturn the positive finding itself.** The same journal published [another meta-analysis in 2026](https://www.nature.com/articles/s41599-026-07019-z) — 35 studies, 134 effect sizes — reporting g = 0.670 (95% CI [0.495, 0.844]) with no significant publication bias detected; [a 22-study meta-analysis in IRRODL](https://www.irrodl.org/index.php/irrodl/article/view/8775) gets g = 0.573. Same direction, smaller than 0.867.

So who is right? I think that is the wrong question — **these studies and Bastani's are measuring different things**. And that is not my inference: [Deng et al., in their 2025 *Computers & Education* meta-analysis](https://bibbase.org/network/publication/deng-jiang-yu-lu-liu-doeschatgptenhancestudentlearningasystematicreviewandmetaanalysisofexperimentalstudies-2025), say it themselves right after reporting their positive results:

> However, methodological limitations, such as the lack of power analysis and concerns regarding post-intervention assessments, warrant cautious interpretation of results. This review presents four propositions from the findings: (1) distinguish between the quality of ChatGPT outputs and the positive effects of interventions on academic performance by shifting from well-defined problems in post-intervention assessments to more complex, project-based assessments that require skill demonstration, adopting proctored assessments…

In plain terms: **if the AI is still at hand during the assessment, what you are measuring may be the quality of its output, not the student's learning.** Which is exactly why the question that matters is what remains after it is taken away — and someone measured that directly.

## What is left once the AI is taken away

Someone took the AI away and tested again. The answer: **less is left than if it had never been there.**

Nearly a thousand Turkish high schoolers were split three ways for math practice — GPT Base (close to stock ChatGPT), GPT Tutor (teacher-designed hints instead of answers), and a control with only textbook and notes ([Generative AI without guardrails can harm learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635), a 2025 randomized controlled trial in PNAS):

> Our results show that having GPT-4 access while solving problems significantly improves performance (48% improvement in grades for GPT Base and 127% for GPT Tutor). However, we additionally find that when access is subsequently taken away, students actually perform worse than those who never had access (17% reduction in grades for GPT Base) — i.e., unfettered access to GPT-4 can harm educational outcomes.

The GPT Tutor result deserves equal attention: up 127% during practice, and **level with the control** on the exam. The guardrail cancelled the harm; it did not produce a gain. The researchers reach for an autopilot analogy — as [the Hechinger Report notes](https://hechingerreport.org/kids-chatgpt-worse-on-tests), they cite the FAA advising pilots to minimize autopilot use so they can still fly when it fails.

The second finding stings more: students had no idea. The GPT Base group scored worse without feeling they had learned less; the GPT Tutor group did not score better but believed they had done significantly better. That is the same disease as "rereading feels effective", with upgraded tooling.

## Two supporting pieces that need careful citation

They are usually cited alongside the RCT above, but they carry far less weight:

- **MIT Media Lab's [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt)** used EEG to measure neural connectivity during essay writing, coined "cognitive debt", and found LLM users could not quote sentences they had just written. But n = 54 (only 18 completed the fourth session) and it is not peer reviewed. [The project FAQ](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview) explicitly asks journalists not to use words like "brain damage" or "brain rot", because the paper never used that vocabulary. Cite the direction, not an inflated magnitude.
- **[The Memory Paradox](https://arxiv.org/abs/2506.11015) (arXiv:2506.11015)** goes further, linking the reversal of the Flynn effect to cognitive offloading. The authors are Oakley and Sejnowski — the same two people who taught you to build internal memory a decade ago, now arguing why the AI era needs it more. **But the inference chain needs taking apart.** The reversal itself is real: [Bratsberg and Rogeberg's 2018 PNAS analysis of over 730,000 Norwegian military conscripts](https://www.pnas.org/doi/10.1073/pnas.1718793115) (born 1962–1991) found IQ peaking with the 1975 birth cohort and declining afterwards — and the decline holds **within families**, younger brothers scoring below older ones, which cleanly rules out genetic selection and immigration. But the same authors write, in [their own plain-language summary](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame): "Our analysis does not, however, speak to what these underlying environmental causes are. That remains an issue for future research." Attributing it to cognitive offloading is Oakley's conjecture, not a finding of that study.

## Overall

Put together, the operating rule is simple: **AI makes things smooth exactly where they should be hard, and smoothness is the signal that nothing is being learned.** Do it yourself first, then ask. Bastani's GPT Tutor guardrail runs on exactly this principle: put the AI in the hint position, not the answer position. Session 4 of the Kosmyna study points the same way — the Brain-to-LLM group, who wrote unaided first and only then used an LLM, showed higher connectivity than the LLM group's sessions 1–3 and better memory recall, leading the researchers to suggest introducing AI *after* self-driven effort. **Do not read that as "your brain works better after using AI"**: Kosmyna herself states publicly that it does not, and only 18 people completed that session.


One meta-level lesson to close on. The retracted meta-analysis is a reminder of more than uneven quality in AI education research — **"there is evidence" is itself a claim that needs checking.** A paper cited 260-plus times and viewed nearly half a million times can be wrong, and the 260-plus papers citing it will not correct themselves. Which is exactly the habit the course in [part 1](/posts/learning/2026-08-04-learning-how-to-learn-en) set out to teach, applied this time to the literature.

## Changelog

- 2026-08-19: Readability pass matching the Chinese edition — a four-point summary added up front, and the RCT section now opens with the finding rather than researcher names. No content or evidence changed.

## References

Each entry is tagged with how I accessed it (primary / abstract / secondhand / unverified). DOIs I could not confirm myself are omitted rather than guessed. The full bibliography for learning science itself is in [part 1's references](/posts/learning/2026-08-04-learning-how-to-learn-en).

- [primary/full text] Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). [Generative AI without guardrails can harm learning: Evidence from high school mathematics](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635). *PNAS*, 122(26), e2422633122. DOI: 10.1073/pnas.2422633122 — a 2025-08-20 correction to an author affiliation exists; it does not affect the results.
- [secondhand] [Without Guardrails, Generative AI Can Harm Education — Knowledge at Wharton](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education); [Kids who use ChatGPT as a study assistant do worse on tests — Hechinger Report](https://hechingerreport.org/kids-chatgpt-worse-on-tests) (source of the autopilot/FAA analogy).
- [primary/official] Wang, J., & Fan, W. (2026). [Retraction Note: The effect of ChatGPT on students' learning performance, learning perception, and higher-order thinking: insights from a meta-analysis](https://www.nature.com/articles/s41599-026-07310-z). *Humanities and Social Sciences Communications*, 13, 528. Retracted 2026-04-22; notice updated 2026-07-02 to credit Magnus Ingebrigtsen and Marko Lukic for raising the concerns.
- [primary/official] The retracted original (page now flagged RETRACTED): Wang & Fan (2025). *Humanit Soc Sci Commun*, 12, 621. DOI: 10.1057/s41599-025-04787-y <https://www.nature.com/articles/s41599-025-04787-y>
- [secondhand/news] Retraction coverage: [EdTech Innovation Hub](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns) (486,000 views / 266 citations / Altmetric 1,023), [GovTech](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt), [NEPC reposting 404 Media](https://nepc.colorado.edu/blog/nature-publisher). **The three outlets disagree slightly (485k–498k views, 262–275 citations); the figures above follow EdTech Innovation Hub.**
- [primary/full text] [ChatGPT's impact on student learning outcomes: a meta-analysis](https://www.nature.com/articles/s41599-026-07019-z). *Humanities and Social Sciences Communications* (2026). — not retracted; 35 studies / 134 effect sizes, g = 0.670, 95% CI [0.495, 0.844].
- [abstract] Deng, R., Jiang, M., Yu, X., Lu, Y., & Liu, S. (2025). [Does ChatGPT enhance student learning? A systematic review and meta-analysis of experimental studies](https://bibbase.org/network/publication/deng-jiang-yu-lu-liu-doeschatgptenhancestudentlearningasystematicreviewandmetaanalysisofexperimentalstudies-2025). *Computers & Education*, 227, 105224. — what I quote is **the abstract's own wording** on post-intervention assessment concerns and proctored assessments. An earlier version of this article cited g+ = 0.712; that figure came from an AI-generated summary on Academia.edu, could not be verified, and has been removed.
- [abstract] [A Meta-Analysis of ChatGPT's Influence on Learning Achievement](https://www.irrodl.org/index.php/irrodl/article/view/8775). *IRRODL* (2025). — 22 studies, g = 0.573.
- [primary/official, not peer reviewed] Kosmyna, N., et al. (2025). [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt). MIT Media Lab, arXiv:2506.08872. — n = 54 (only 18 completed session four); [the official project page carries a statement on media wording](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview). The session-4 Brain-to-LLM / LLM-to-Brain ordering effect, and the author's own "your brain does not perform better after or during LLM use", are from [Kosmyna's public post](https://www.linkedin.com/posts/nataliekosmina_mit-ai-brain-activity-7340386826504876033-X45W).
- [primary, not peer reviewed] Oakley, B., et al. (2025). [The Memory Paradox](https://arxiv.org/abs/2506.11015). arXiv:2506.11015. — preprint of a Springer book chapter; an argument, not demonstrated causation.
- [primary/full text] Bratsberg, B., & Rogeberg, O. (2018). [Flynn effect and its reversal are both environmentally caused](https://www.pnas.org/doi/10.1073/pnas.1718793115). *PNAS*, 115(26), 6674–6678. DOI: 10.1073/pnas.1718793115 — 730,000+ Norwegian conscripts, birth cohorts 1962–1991.
- [primary/by the authors] Bratsberg & Rogeberg. [Norwegian IQ scores are falling – but genes are not to blame](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame). TheScienceBreaker. — source of "our analysis does not speak to what these underlying environmental causes are".
