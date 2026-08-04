---
title: "Learning How to Learn: Auditing the Course 4.17 Million People Took — What Holds Up, What's Just a Metaphor"
date: 2026-08-04
updated: 2026-08-04
category: learning
type: deep-dive
difficulty: 進階
tags: [learning-science, self-learning, retrieval-practice, spaced-repetition, metacognition, ai-and-learning]
lang: en
tldr: "Dunlosky's 2013 review rated 10 study techniques; only self-testing and distributed practice earned 'high utility'. But a 2026 systematic review puts the effect at 0.22–0.46, and Pan & Rickard's transfer meta-analysis finds 'no positive transfer' once publication bias is corrected and moderators are absent. Meanwhile the single most-cited meta-analysis on ChatGPT in education (g = 0.867) was retracted by Nature in April 2026."
description: "An evidence audit of Coursera's Learning How to Learn: which claims have meta-analyses behind them, which are useful mental models, which have been debunked, which are shrinking, and how LLMs change the picture."
draft: false
glossary:
  - term: "retrieval practice"
    aliases: ["practice testing", "self-testing"]
    definition: "Closing the book and pulling the answer out of memory, rather than reading it again."
    advanced: "Testing is itself a learning event, not just assessment. Free recall generally beats recognition formats — but the effect appears to shrink as material gets more complex."
    context: "In this article it is one of only two techniques Dunlosky et al. rated as high utility."
    links:
      - label: "Rowland (2014) meta-analysis"
        url: "https://doi.org/10.1037/a0037559"
  - term: "desirable difficulties"
    definition: "Robert Bjork's term for learning conditions that hurt performance in the moment but improve long-term retention."
    advanced: "Covers spacing, interleaving, retrieval, and varied practice conditions. The difficulty has to be desirable — difficulty beyond the learner's reach is just difficulty."
    context: "Used here to explain why AI assistance harms learning: it removes exactly this kind of difficulty."
  - term: "meshing hypothesis"
    aliases: ["matching hypothesis", "learning styles matching"]
    definition: "The claim that matching instruction to a student's preferred learning style (visual/auditory/kinesthetic) improves outcomes."
    advanced: "Supporting it requires a crossover interaction: visual learners do better with visual instruction AND auditory learners do better with auditory instruction. One group scoring higher is not enough."
    context: "This article traces its path from 2008 debunking to a partial 2024 reversal."
  - term: "Hedges' g"
    aliases: ["effect size"]
    definition: "A standardized effect size expressing the difference between two groups in standard deviations, with a small-sample correction over Cohen's d."
    advanced: "Roughly 0.2 small, 0.5 medium, 0.8 large — but those thresholds are convention only. Read it alongside I²: a high average with high heterogeneity means individual settings vary widely."
    context: "Several meta-analyses cited here report in g, e.g. the testing effect at g = 0.50."
  - term: "response congruency"
    definition: "How much the correct answers on a practice test overlap with those on the final test."
    advanced: "The dominant moderator in Pan & Rickard's transfer meta-analysis: d = 0.28 without overlap, rising by 0.30 to d = 0.58 with it."
    context: "Used here to show how fragile the assumption of transfer really is."
  - term: "cognitive offloading"
    definition: "Outsourcing memory or reasoning work to external tools — notes, search engines, AI — to reduce mental load."
    advanced: "It improves short-term performance but may reduce the internal knowledge structures being built. The live debate is over what should be offloaded: offloading lookup cost is usually harmless, offloading the reasoning is not."
    context: "The thread connecting several 2025 studies on LLMs and learning."
---

> 🌏 [中文版](/posts/learning/2026-08-04-learning-how-to-learn)

There is a course on Coursera whose [official page](https://www.coursera.org/learn/learning-how-to-learn) currently shows 4,175,377 enrollments and a 4.8 rating across 93,136 reviews. It is called Learning How to Learn, taught by engineering professor Barbara Oakley and neuroscientist Terrence Sejnowski. It [launched in August 2014](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php) with 197,000 learners from 206 countries in the first session. By [the New York Times' December 2015 report](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn), it had 1.19 million enrollments — the largest MOOC in the world at the time, narrowly ahead of Andrew Ng's Machine Learning.

This is not a course review. It is an audit that separates what the course teaches from what the evidence supports — because those two things overlap less than you would expect, and the gap runs in an interesting direction: **the course's most famous concept has the weakest evidence, the parts it underplays have the strongest, and the premise in its own name — that learning skills transfer — is the piece that tests worst of all.**

## The problem it solves isn't "not trying hard enough"

Start with the field's core claim, because it is not a list of techniques.

In 2009, Karpicke, Butler and Roediger [surveyed 177 college students](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf) about how they study:

> 84% of students reported rereading, and 55% named rereading their number one strategy; only 11% unambiguously reported testing themselves while studying, and only 1% did so because they believed practising retrieval itself enhances learning.

Rereading is exactly what the review below rates as low utility. Self-testing is one of only two rated high. Students are not lazy — they are putting in the hours and **systematically choosing wrong**. The reason is clear enough: rereading feels effective. The second pass goes down more smoothly than the first, and the brain misreads that fluency as mastery.

So the field's real proposition is one sentence: **the subjective fluency of learning is inversely related to long-term retention.** Nearly every evidence-backed technique amounts to making the present moment harder.

## The signature concept is a metaphor — and the author has said so

The course's most widely circulated idea is focused mode versus diffuse mode: the brain alternates between them, so a problem you cannot crack should be left alone for the diffuse mode to work on in the background. Sites like [Farnam Street](https://fs.blog/focused-diffuse-thinking) have spread it widely, usually prefaced with "neuroscience shows".

The trouble is on the neuroscience side. [The standard description of the default mode network](https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network) is that its activity is **suppressed** during cognitively demanding, externally focused tasks, and higher during quiet wakefulness and internally directed thought — daydreaming, recalling, imagining the future. So "both modes running at once" does not match how the DMN actually behaves. It is not working overtime in the background; it goes quiet when you concentrate.

Oakley has addressed this tension herself. The passage below circulates widely, attributed to an endnote in *A Mind for Numbers* — **but I have to be upfront: the only place I can find it is [a transcription on Psychology Stack Exchange](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre). There is no second independent source anywhere on the web, and I have not checked it against the printed edition. Verify against the book before citing it**:

> Astute readers will notice my mention that the diffuse mode seems to sometimes work in the background while the focused mode is active. However, research findings show that the default-mode network for example (which is just one of the many resting state networks), seems to go quiet when the focused mode is active. So which is it? … In some sense, then, my use of the term diffuse mode might be thought of as "nonfocused mode activities directed toward learning" rather than simply "default-mode network."

If that transcription is faithful, it is not an outside accusation — it is the author flagging her own simplification. But strip the quote out entirely and the conclusion survives on the DMN literature alone: **focused/diffuse mode is a useful mental model, not a neuroscience finding.** You can reject the neural version and keep the behavioural advice (stuck? go for a walk), because that advice is supported from somewhere else.

Two other course components need calibrating:

- **Chunking.** The concept is fine; the "7±2" that usually travels with it is outdated. Miller's 1956 seven-plus-or-minus-two measured capacity *after* chunking was possible; [Cowan's 4±1, proposed in 2001](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf), measures the number of chunks themselves, and modern consensus favours the latter. [The two reconcile](https://journalofcognition.org/articles/10.5334/joc.387) once you notice they depend on whether the task lets you chunk. The practical implication: you can juggle fewer independent units than you think, so chunking isn't a bonus — it's a precondition.
- **The Pomodoro Technique.** [Biwer et al.'s 2023 controlled study in the British Journal of Educational Psychology](https://pmc.ncbi.nlm.nih.gov/articles/PMC12532815) compared systematic breaks (24 minutes of study, 6-minute break) against self-regulated breaks. The systematic groups reported higher concentration and motivation, less fatigue, and finished in less time — **but the two conditions did not differ in invested mental effort or task completion.** It improves the experience and the efficiency, not the amount learned. Don't sell it as a learning technique.

Which is the core of my assessment of the course: its value is in turning behaviour into process, not in its brain science. The course assignments are literally named "Retrieval Practice" — that matters more than any neuroscience in it.

## The evidence that actually holds: Dunlosky's ten-technique review

In 2013, Dunlosky and four co-authors published [Improving Students' Learning With Effective Learning Techniques](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266) in *Psychological Science in the Public Interest*. They picked 10 techniques students can use on their own without supervision, and assessed whether each one's benefits generalize across learning conditions, student characteristics, materials, and criterion tasks. The result is a fairly brutal tiering:

| Utility | Technique | Numbers |
|---|---|---|
| **High** | practice testing (self-testing) | [Rowland (2014)](https://doi.org/10.1037/a0037559): g = 0.50; [Adesope et al. (2017)](https://doi.org/10.3102/0034654316689306), 217 studies: g = 0.70 |
| **High** | distributed practice (spacing) | [Kim et al. (2019)](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf) confirmed it holds up in real-world big data |
| **Moderate** | elaborative interrogation, self-explanation, interleaved practice | Interleaving, [Brunmair & Richter (2019)](https://doi.org/10.1037/bul0000209): g ≈ 0.42 |
| **Low** | summarization, highlighting, keyword mnemonic, imagery, **rereading** | The two students use most — rereading and highlighting — are both here |

The original is blunt about the top tier:

> Practice testing and distributed practice received high utility assessments because they benefit learners of different ages and abilities and have been shown to boost students' performance across many criterion tasks and even in educational contexts.

That table now gets cited everywhere. But the ground under it has shifted three times in the past decade, and almost nobody writing about this has kept up.

**First, heterogeneity matters more than the mean.** Rowland's g = 0.50 sits on top of I² = 84.35 — most of the variation between studies is real situational difference, not sampling error. "Average 0.5" does not mean "you will get 0.5".

**Second, the estimates are shrinking.** In March 2026, Dietrichson and colleagues published [a large systematic review](https://edworkingpapers.com/ai26-1418): 102,451 records screened, 87 studies meeting inclusion criteria, 59 in the data synthesis. Where the control group received no practice test at all, the weighted effects were 0.22 (95% CI [0.09, 0.34]) for between-subject designs and 0.46 ([0.29, 0.62]) for within-subject designs. The authors say it plainly: these "seem smaller than those found in earlier reviews" — Adesope's corresponding figures were 0.64 in primary and 0.83 in secondary school. Their exploratory analysis adds one more: **practice tests seemed less effective when the learning material was complex.**

**Third, complex material is an unfinished fight.** [van Gog and Sweller's 2015 title](https://link.springer.com/article/10.1007/s10648-015-9310-x) is the argument — "the testing effect decreases or even disappears as the complexity of learning materials increases". Karpicke and Aue answered the same year with "The testing effect is alive and well with complex materials", and Rawson joined in; the dispute is stuck on the fact that "complexity" resists operationalization. Dietrichson 2026 leans toward the first camp, but this remains **a live, unresolved argument** — anyone declaring a winner should raise your suspicion.

One smaller conflict worth flagging: Rowland found feedback amplifies the testing effect, but [Adesope's meta-analysis](https://www.learningscientists.org/blog/2017/2/9-1) found retrieval with feedback only slightly better than without. These have not been reconciled.

**Interleaving, meanwhile, is picky about materials.** Brunmair and Richter's meta-analysis is titled *Similarity matters* for a reason. Across 59 studies and 238 effect sizes, interleaving helped with visual materials like paintings and with mathematical problem types; it showed no advantage for expository texts; and for learning words across conceptual categories it may actively hurt. Treating "interleave everything" as general advice misreads the paper.

## The awkward question: does any of this transfer?

This is the section most write-ups skip, and it is the one that matters most.

The phrase "learning how to learn" has an assumption baked in: that once you have the skills, they carry over. That assumption has been tested. It does not test well.

[Pan and Rickard's 2018 Psychological Bulletin paper](https://doi.org/10.1037/bul0000151) is the first comprehensive meta-analysis of transfer in test-enhanced learning: 192 transfer effect sizes from 122 experiments and 67 articles, N = 10,382, spanning forty years. The headline is d = 0.40 (95% CI [0.31, 0.50]), which sounds fine. Unpack it:

> That transfer of learning is greatest across test formats, to application and inference questions, to problems involving medical diagnoses, and to mediator and related word cues; it is weakest to rearranged stimulus-response items, to untested materials seen during initial study, and to problems involving worked examples. Moderator analyses further indicated that **response congruency and elaborated retrieval practice, as well as initial test performance, strongly influence the likelihood of positive transfer.**

And the sentence that follows it: after correcting for publication bias with PET-PEESE and selection methods, "the intercept predictions were substantially reduced, **often indicating no positive transfer when none of the aforementioned moderators are present**".

How much does that matter? With no response congruency the effect is d = 0.28; with it, another 0.30 gets added for d = 0.58. A large share of "transfer" is really the practice questions and the test questions sharing answers.

[Agarwal's 2019 study](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf) lands the point harder. Middle-school and college students did retrieval practice with fact questions, higher-order questions, or a mix. The abstract is unsparing:

> Critically, higher order and mixed quizzes improved higher order test performance, but fact quizzes did not. Contrary to popular intuition about higher order learning and Bloom's taxonomy, building a foundation of knowledge via fact-based retrieval practice may be less potent than engaging in higher order retrieval practice.

And the failure runs both ways — the paper reports that in Experiment 1, practising with higher-order questions did not help on the delayed **fact** test either. Both mismatches collapse back to roughly the restudy baseline. Agarwal reads this as transfer-appropriate processing: the benefit appears when the practice format matches the test format.

The same pattern shows up one level up. [Donker et al.'s 2014 meta-analysis of learning-strategy instruction](https://daneshyari.com/article/preview/355102.pdf) (95 interventions, 180 effect sizes) does find solid effects — writing g = 1.25, science 0.73, mathematics 0.66, reading comprehension 0.36. But the same research group states it directly: **strategy instruction aimed at near transfer is more effective than instruction aimed at far transfer.**

The honest conclusion: these techniques work, but **their effectiveness is bound to what you practised far more tightly than you'd like.** If you want transfer, you have to deliberately shape the practice to resemble the thing you actually want to do. Which incidentally explains why "grinding LeetCode" and "designing systems" are two different skills.

## What to discard, and what is being reopened

**The learning pyramid can go straight in the bin.** The triangle claiming you remember 10% of what you read, 20% of what you hear, and 90% of what you do is fabricated. [Subramony, Molenda, Betrus and Thalheimer traced it thoroughly in 2014](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone): Edgar Dale's Cone of Experience contained no percentages at all, and Dale intended it as a descriptive classification, not a prescriptive guide — the numbers were grafted on by persons unknown around 1970. When pressed for a source, the NTL Institute replied that they believed the figures were accurate but could no longer find the original research. A [memory researcher at the University of Strathclyde](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo) put it more directly: he has never seen a properly controlled experiment showing one study technique to be nine times as effective as another.

**Learning styles are messier, because the case is being reopened.** The mainstream verdict comes from [Pashler, McDaniel, Rohrer and Bjork's 2008 review](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work): after examining 70-plus studies they found no evidence supporting the meshing hypothesis. That is the version in nearly every popular article.

But in July 2024, Clinton-Lisell and Litzinger published [Is it really a neuromyth? A meta-analysis of the learning styles matching hypothesis](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full) in Frontiers in Psychology, restricted to studies that actually compared matched against unmatched instruction — 21 studies, 101 effect sizes, 1,712 participants:

> Based on robust variance estimation, there was an overall benefit of matching instruction to learning styles, g = 0.31, SE = 0.12, 95% CI = [0.05, 0.57], p = 0.02. However, only 26% of learning outcome measures indicated matched instruction benefits for at least two styles, indicating a crossover interaction supportive of the matching hypothesis.

The honest reading: **the evidence is not zero, but it is nowhere near enough to redesign teaching around.** That is not just my call — it is the paper's own conclusion. The authors benchmark their g = 0.31 against the plain modality effect (g = 0.70), note I² = 91.17, and weigh the teacher time required against the risk of essentializing students into categories. They still do not recommend adopting it.

**Growth mindset is the third case of the same disease.** [Sisk et al.'s two 2018 meta-analyses in Psychological Science](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf) remain the most thorough test: the correlation between mindset and achievement is r ≈ 0.10 across 129 studies (N = 365,915), about 1% of the variance; mindset interventions move achievement by d = 0.08 across 43 studies (N = 57,155). More awkwardly, **interventions whose manipulation checks succeeded — the ones that demonstrably changed students' mindsets — showed no significant effect on achievement.** Dweck and Yeager [responded in 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535), arguing that Sisk's I² of 96.29% means the effects are real but heavily person- and context-dependent, and that low-SES and academically at-risk students do benefit (a point Sisk et al. concede). Both sides agree the effect is small and heterogeneous. They disagree about whether that makes it important.

The shared structure across all three is worth memorizing: **too intuitively plausible, spreading far faster than it was verified, and an effect size small enough that it takes a meta-analysis to see.** Discount the next educational claim that fits all three.

## The 10,000 hours fight is about definitions, not numbers

[Macnamara, Hambrick and Oswald's 2014 meta-analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf) is routinely used to dismiss the 10,000-hour rule. It found deliberate practice explained 26% of performance variance in games, 21% in music, 18% in sports, 4% in education, and under 1% in professions.

The Ericsson camp's [rebuttal](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full) carries weight too: on a re-screened set they get r = 0.54, roughly 29% of variance, and argue many studies Macnamara included never used Ericsson's original definition of deliberate practice — one counted hours nursing students spent in lectures and seminars as practice. [Harwell and Southwick (2021)](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf) add that across 708 meta-analytic correlations in social and personality psychology the average variance explained is 3–4%, so treating "under 50%" as failure is an unreasonable bar.

The two sets of numbers are not comparable because they measure different things. The takeaway that survives: practice volume matters but is far from everything, and **the more structured and predictable the domain (instrument, running), the more practice explains; the more open-ended the domain (professional work), the less.** The uncomfortable implication for engineers is that software work sits in that last column.

## The AI era: it removes exactly the difficulty you need

This is why the topic is worth revisiting in 2026 — and the place to start is that **the single most-cited piece of evidence in AI education has been retracted.**

In May 2025, Wang and Fan published a meta-analysis in Springer Nature's *Humanities and Social Sciences Communications* synthesizing 51 studies and concluding that ChatGPT has a large positive impact on learning performance, g = 0.867. The number went on to be cited in policy briefings, edtech marketing, and hundreds of papers. [Before retraction it had accumulated roughly 486,000 views, 266 citations, and an Altmetric score of about 1,023](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns).

On 22 April 2026, [the journal issued a retraction notice](https://www.nature.com/articles/s41599-026-07310-z):

> The Editor has decided to retract this article due to concerns relating to discrepancies in the meta‑analysis. These concerns were initially raised by Magnus Ingebrigtsen and Marko Lukic. Taken together, the identified issues undermine the Editor's confidence in the validity of the analysis and the conclusions drawn from it. The authors have not responded to correspondence regarding this retraction.

The two-hundred-plus papers citing it are not retracted along with it. The episode is a meta-level demonstration of this article's own subject: **fluent, agreeable and citable is not the same as true.**

Don't overcorrect, though. **The retraction does not overturn the positive finding itself.** The same journal published [another meta-analysis in 2026](https://www.nature.com/articles/s41599-026-07019-z) — 35 studies, 134 effect sizes — reporting g = 0.670 (95% CI [0.495, 0.844]) with no significant publication bias detected; [a 22-study meta-analysis in IRRODL](https://www.irrodl.org/index.php/irrodl/article/view/8775) gets g = 0.573. Same direction, smaller than 0.867.

So who is right? I think that is the wrong question — **these studies and Bastani's are measuring different things**. And that is not my inference: Deng et al., in their 2025 *Computers & Education* meta-analysis, say it themselves right after reporting their positive results:

> However, methodological limitations, such as the lack of power analysis and concerns regarding post-intervention assessments, warrant cautious interpretation of results. This review presents four propositions from the findings: (1) distinguish between the quality of ChatGPT outputs and the positive effects of interventions on academic performance by shifting from well-defined problems in post-intervention assessments to more complex, project-based assessments that require skill demonstration, adopting proctored assessments…

In plain terms: **if the AI is still at hand during the assessment, what you are measuring may be the quality of its output, not the student's learning.** Which is exactly why the question that matters is what remains after it is taken away — and someone measured that directly.

Bastani et al.'s 2025 randomized controlled trial in PNAS, [Generative AI without guardrails can harm learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635), split nearly a thousand Turkish high schoolers three ways for math practice: GPT Base (close to stock ChatGPT), GPT Tutor (teacher-designed hints instead of answers), and a control with only textbook and notes.

> Our results show that having GPT-4 access while solving problems significantly improves performance (48% improvement in grades for GPT Base and 127% for GPT Tutor). However, we additionally find that when access is subsequently taken away, students actually perform worse than those who never had access (17% reduction in grades for GPT Base) — i.e., unfettered access to GPT-4 can harm educational outcomes.

The GPT Tutor result deserves equal attention: up 127% during practice, and **level with the control** on the exam. The guardrail cancelled the harm; it did not produce a gain. The researchers reach for an autopilot analogy — as [the Hechinger Report notes](https://hechingerreport.org/kids-chatgpt-worse-on-tests), they cite the FAA advising pilots to minimize autopilot use so they can still fly when it fails.

The second finding stings more: students had no idea. The GPT Base group scored worse without feeling they had learned less; the GPT Tutor group did not score better but believed they had done significantly better. That is the same disease as "rereading feels effective", with upgraded tooling.

Two supporting pieces are frequently cited together and both need care:

- **MIT Media Lab's [Your Brain on ChatGPT](https://www.media.mit.edu/publications/your-brain-on-chatgpt)** used EEG to measure neural connectivity during essay writing, coined "cognitive debt", and found LLM users could not quote sentences they had just written. But n = 54 (only 18 completed the fourth session) and it is not peer reviewed. [The project FAQ](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview) explicitly asks journalists not to use words like "brain damage" or "brain rot", because the paper never used that vocabulary. Cite the direction, not an inflated magnitude.
- **[The Memory Paradox](https://arxiv.org/abs/2506.11015) (arXiv:2506.11015)** goes further, linking the reversal of the Flynn effect to cognitive offloading. The authors are Oakley and Sejnowski — the same two people who taught you to build internal memory a decade ago, now arguing why the AI era needs it more. **But the inference chain needs taking apart.** The reversal itself is real: [Bratsberg and Rogeberg's 2018 PNAS analysis of over 730,000 Norwegian military conscripts](https://www.pnas.org/doi/10.1073/pnas.1718793115) (born 1962–1991) found IQ peaking with the 1975 birth cohort and declining afterwards — and the decline holds **within families**, younger brothers scoring below older ones, which cleanly rules out genetic selection and immigration. But the same authors write, in [their own plain-language summary](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame): "Our analysis does not, however, speak to what these underlying environmental causes are. That remains an issue for future research." Attributing it to cognitive offloading is Oakley's conjecture, not a finding of that study.

Put together, the operating rule is simple: **AI makes things smooth exactly where they should be hard, and smoothness is the signal that nothing is being learned.** Do it yourself first, then ask — the group in the Kosmyna study that moved from brain-only to LLM performed best, and Bastani's GPT Tutor guardrail runs on the same principle: put the AI in the hint position, not the answer position.

## Overall

If you take one thing: **the course's value is not its neuroscience, it is that it turns "don't trust your own sense of fluency" into a repeatable daily process.**

The concrete trade-offs:

- **Just do these**: replace rereading with self-testing; spread review out over time. These are the only two high-utility entries and several meta-analyses back them — but revise your expected effect downward (the 2026 systematic review says 0.22–0.46, not 0.5–0.7), and expect less as material gets more complex.
- **Make practice look like the target**: transfer is not free. Response congruency is the dominant moderator, and practising factual questions to pass higher-order ones is equivalent to not practising. If you want transfer, design the practice to resemble what you actually intend to do.
- **Depends**: interleaving — good for visual materials and math problem types, bad for expository text and vocabulary.
- **Discard**: the learning pyramid's percentages, VAK matching, and high expectations of growth-mindset interventions (d = 0.08).
- **Keep as metaphor**: focused/diffuse mode, and the Pomodoro Technique. Keep the behaviour, drop the neural claim before arguing it with anyone.
- **New rule for the AI era**: get stuck on your own first, then open the AI. Put it in the hint position.

One last thing that doesn't fit in a bullet: this field's reviews almost all use retention as the outcome, with far thinner evidence for creativity or judgment. And the 2026 retraction is a reminder that **even "there is evidence" needs verifying.** A paper cited 260-plus times and viewed nearly half a million times can be wrong, and the articles citing it will not correct themselves. Which is exactly the habit this course set out to teach — applied, this time, to itself.

## References

**The course**
- [Learning How to Learn — official Coursera page](https://www.coursera.org/learn/learning-how-to-learn)
- [MOOC: Learning How to Learn — UCSD Temporal Dynamics of Learning Center](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php)
- [The Most Popular Online Course Teaches You to Learn — NYT Bits (2015)](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn)
- [Focused and Diffuse: Two Modes of Thinking — Farnam Street](https://fs.blog/focused-diffuse-thinking)
- [Know Your Brain: Default Mode Network — Neuroscientifically Challenged](https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network)
- [The only traceable source for the Oakley endnote quoted above (Stack Exchange transcription, not verified against the printed book)](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre)

**Evidence on study techniques**
- [Dunlosky et al. (2013), Improving Students' Learning With Effective Learning Techniques — PSPI 14(1)](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266) ([full PDF](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf))
- [Rowland (2014), The Effect of Testing Versus Restudy on Retention — Psychological Bulletin 140(6)](https://doi.org/10.1037/a0037559)
- [Adesope, Trevisan & Sundararajan (2017), Rethinking the Use of Tests — Review of Educational Research 87(3)](https://doi.org/10.3102/0034654316689306) ([summary](https://www.learningscientists.org/blog/2017/2/9-1))
- [Dietrichson et al. (2026), Testing frequency and student achievement: A systematic review — EdWorkingPaper 26-1418](https://edworkingpapers.com/ai26-1418)
- [van Gog & Sweller (2015), Not new, but nearly forgotten — Educational Psychology Review 27(2)](https://link.springer.com/article/10.1007/s10648-015-9310-x)
- [Brunmair & Richter (2019), Similarity matters: A meta-analysis of interleaved learning — Psychological Bulletin 145(11)](https://doi.org/10.1037/bul0000209)
- [Kim et al. (2019), The spacing effect stands up to big data](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf)
- [Karpicke, Butler & Roediger (2009), Do students practise retrieval when they study on their own? — Memory 17(4)](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf)
- [Cowan (2010), The Magical Mystery Four — Current Directions in Psychological Science](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf)
- [Modelling Working Memory Capacity: Is the Magical Number Four, Seven…? — Journal of Cognition](https://journalofcognition.org/articles/10.5334/joc.387)
- [Biwer et al. (2023), Comparing 'Pomodoro' breaks and self-regulated breaks — Br J Educ Psychol 93(2)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12532815)

**Transfer**
- [Pan & Rickard (2018), Transfer of Test-Enhanced Learning — Psychological Bulletin 144(7)](https://doi.org/10.1037/bul0000151) ([full PDF](https://pdf.retrievalpractice.org/transfer/Pan_Rickard_2018.pdf))
- [Agarwal (2019), Retrieval Practice & Bloom's Taxonomy — Journal of Educational Psychology 111(2)](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf) ([ERIC record](https://eric.ed.gov?id=EJ1205208))
- [Donker et al. (2014), Effectiveness of learning strategy instruction — Educational Research Review 11](https://daneshyari.com/article/preview/355102.pdf)

**Myths and disputes**
- [Pashler et al. (2008), Learning Styles: Concepts and Evidence — summary and links](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work)
- [Clinton-Lisell & Litzinger (2024), Is it really a neuromyth? — Frontiers in Psychology 15](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full)
- [Mythical Retention Data & The Corrupted Cone — Work-Learning Research](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone)
- [Remembering 90% of What You Do? — University of Strathclyde](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo)
- [Sisk et al. (2018), Two meta-analyses on growth mindset — Psychological Science 29(4)](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf)
- [Yeager & Dweck (2020), What Can Be Learned from Growth Mindset Controversies? — American Psychologist](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535)
- [Macnamara, Hambrick & Oswald (2014), Deliberate Practice and Performance — Psychological Science 25](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf)
- [Ericsson camp response — Frontiers in Psychology (2019)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full)
- [Harwell & Southwick (2021), Beyond 10,000 Hours](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf)

**AI and learning**
- [Bastani et al. (2025), Generative AI without guardrails can harm learning — PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635)
- [Without Guardrails, Generative AI Can Harm Education — Knowledge at Wharton](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)
- [Kids who use ChatGPT as a study assistant do worse on tests — Hechinger Report](https://hechingerreport.org/kids-chatgpt-worse-on-tests)
- [Retraction Note: The effect of ChatGPT on students' learning performance… — Humanit Soc Sci Commun 13, 528 (2026)](https://www.nature.com/articles/s41599-026-07310-z)
- [Retraction coverage — EdTech Innovation Hub](https://www.edtechinnovationhub.com/news/highly-cited-meta-analysis-claiming-chatgpt-boosts-student-learning-retracted-over-data-concerns), [GovTech](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt)
- [ChatGPT's impact on student learning outcomes: a meta-analysis — Humanit Soc Sci Commun (2026)](https://www.nature.com/articles/s41599-026-07019-z) (not retracted; 35 studies / 134 effect sizes, g = 0.670)
- [Deng et al. (2025), Does ChatGPT enhance student learning? — Computers & Education 227:105224](https://bibbase.org/network/publication/deng-jiang-yu-lu-liu-doeschatgptenhancestudentlearningasystematicreviewandmetaanalysisofexperimentalstudies-2025)
- [A Meta-Analysis of ChatGPT's Influence on Learning Achievement — IRRODL (2025)](https://www.irrodl.org/index.php/irrodl/article/view/8775)
- [Kosmyna et al. (2025), Your Brain on ChatGPT — MIT Media Lab](https://www.media.mit.edu/publications/your-brain-on-chatgpt) ([project page and stated limitations](https://www.media.mit.edu/projects/your-brain-on-chatgpt/overview))
- [Oakley et al. (2025), The Memory Paradox — arXiv:2506.11015](https://arxiv.org/abs/2506.11015)
- [Bratsberg & Rogeberg (2018), Flynn effect and its reversal are both environmentally caused — PNAS 115(26)](https://www.pnas.org/doi/10.1073/pnas.1718793115) ([the authors' own plain-language summary](https://www.thesciencebreaker.org/en/breaks/psychology/norwegian-iq-scores-are-falling-but-genes-are-not-to-blame))
