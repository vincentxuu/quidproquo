---
title: "Learning How to Learn: Auditing the Course 4.17 Million People Took — What Holds Up, What's Just a Metaphor"
date: 2026-08-04
updated: 2026-08-04
category: learning
type: deep-dive
difficulty: 進階
tags: [learning-science, self-learning, retrieval-practice, spaced-repetition, metacognition]
lang: en
series:
  name: "Learning How to Learn"
  order: 1
tldr: "Dunlosky's 2013 review rated 10 study techniques; only self-testing and distributed practice earned 'high utility'. But a 2026 systematic review puts the effect at 0.22–0.46, and Pan & Rickard's transfer meta-analysis finds 'no positive transfer' once publication bias is corrected — making the premise in the framework's own name the piece that tests worst."
description: "An evidence audit of Coursera's Learning How to Learn: which claims have meta-analyses behind them, which are useful mental models, which have been debunked, and which are being revised by stricter methods."
draft: false
faq:
  - q: "Does rereading your notes actually work?"
    a: "Poorly — and it is what students do most. Dunlosky et al. (2013) rated 10 study techniques and placed rereading in the low-utility tier. Separately, Karpicke, Butler and Roediger's 2009 survey of 177 college students found 84% reported rereading and 55% named it their number one strategy. The trap is that rereading feels effective: the second pass goes down more smoothly, and that fluency gets misread as mastery. Self-testing instead is worth roughly +0.51 over rereading."
  - q: "How large is the self-testing effect really?"
    a: "It depends what you compare it against. Roughly +0.51 versus restudying, +0.93 versus doing nothing, and about g = 0.61 pooled across all comparison conditions. A stricter 2026 systematic review reports lower figures: 0.22 for between-subject designs and 0.46 for within-subject designs. Always state the control condition — the same study can be cited at wildly different strengths without it."
  - q: "Are learning styles a myth?"
    a: "The mainstream verdict is still that they are not worth redesigning teaching around, but the evidence is not zero. Pashler et al. (2008) found no support across 70-plus studies. In 2024, Clinton-Lisell and Litzinger restricted their analysis to studies that actually compared matched versus unmatched instruction and found g = 0.31, statistically significant. Even so, those authors do not recommend adoption: only 26% of outcome measures showed the crossover interaction the hypothesis requires, and heterogeneity was I² = 91.17."
  - q: "Do learning skills transfer to other subjects?"
    a: "Less than the name suggests. Pan and Rickard's 2018 transfer meta-analysis found an overall d = 0.40, but after correcting for publication bias it showed no positive transfer when the key moderators were absent. The strongest moderator is response congruency — overlap between practice answers and test answers. Agarwal (2019) is blunter still: practising factual questions and then sitting a higher-order test performed no better than simply restudying. If you want transfer, design practice to resemble the real task."

glossary:
  - term: "meshing hypothesis"
    aliases: ["matching hypothesis", "learning styles matching"]
    definition: "The claim that matching instruction to a student's preferred learning style (visual/auditory/kinesthetic) improves outcomes."
    advanced: "Supporting it requires a crossover interaction: visual learners do better with visual instruction AND auditory learners do better with auditory instruction. One group scoring higher is not enough."
    context: "This article traces its path from 2008 debunking to a partial 2024 reversal."
  - term: "response congruency"
    definition: "How much the correct answers on a practice test overlap with those on the final test."
    advanced: "The dominant moderator in Pan & Rickard's transfer meta-analysis. Random-effects model: d = 0.28 without overlap, rising by 0.30 to 0.58 with it. After publication-bias correction (PEESE) the intercept is effectively zero and congruency adds 0.36."
    context: "Used here to show how fragile the assumption of transfer really is."
---

> 🌏 [中文版](/posts/learning/2026-08-04-learning-how-to-learn)
>
> This is part 1 of "Learning How to Learn", covering the evidence on learning science itself. [Part 2 covers the AI era](/posts/learning/2026-08-04-generative-ai-and-learning-en): what generative AI does to learning, and why the most-cited piece of evidence in the field was retracted.

There is a course on Coursera whose [official page](https://www.coursera.org/learn/learning-how-to-learn) currently shows 4,175,377 enrollments and a 4.8 rating across 93,136 reviews. It is called Learning How to Learn, taught by engineering professor Barbara Oakley and neuroscientist Terrence Sejnowski. It [launched in August 2014](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php) with 197,000 learners from 206 countries in the first session. By [the New York Times' December 2015 report](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn), it had 1.19 million enrollments — the largest MOOC in the world at the time, narrowly ahead of Andrew Ng's Machine Learning.

This is an audit: take each component the course teaches, check it against the evidence, and return a verdict.

# 1. What the course is

Four modules, one to two hours each:

1. **What is learning** — switching between focused and diffuse mode, a first pass at chunking, and how sleep clears metabolic waste and consolidates memory.
2. **Chunking and the illusion of competence** — how to compress scattered steps into a single callable unit; and *illusion of competence*: highlighting, rereading, and following along with a worked solution all leave you feeling like you've learned it.
3. **Procrastination and memory** — procrastination framed as a habit loop (cue → routine → reward → belief), to be changed at the cue and the reward rather than by willpower. The Pomodoro Technique appears here, with the emphasis on process over product. The memory half covers working-memory limits, spaced repetition, and the memory palace.
4. **Renaissance learning** — exercise and neurogenesis, metaphor as a tool for abstraction, deliberate practice, impostor syndrome, and one very concrete exam tactic: hard start–jump to easy (open with the hardest problem, and bail the moment you stall).

The narrative deserves some credit for the reach. Oakley describes herself as bad at math as a child, a linguistics major, a former army signals technician who went back to mathematics and engineering at twenty-six. "I'm not a genius, I just got the method right" persuades adult self-learners far more than any citation does.

## Its actual proposition: fluency lies

One claim runs through all four weeks: **when you feel like you're learning, you usually aren't.**

In 2009, Karpicke, Butler and Roediger [surveyed 177 college students](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf) about how they study:

> 84% of students reported rereading, and 55% named rereading their number one strategy; only 11% unambiguously reported testing themselves while studying, and only 1% did so because they believed practising retrieval itself enhances learning.

Rereading is exactly what gets rated low utility below. Students are not lazy — they are putting in the hours and **systematically choosing wrong**. The reason is clear enough: rereading feels effective. The second pass goes down more smoothly than the first, and the brain misreads that fluency as mastery.

Hence the field's core proposition: **the subjective fluency of learning is inversely related to long-term retention.** Nearly every evidence-backed technique amounts to making the present moment harder.

## How to read the numbers below

What follows is full of effect sizes like 0.3, 0.5, 0.9. Three rules cover it:

1. **0.2 is not small.** By [Kraft's (2020)](https://doi.org/10.3102/0013189X20912798) benchmarks for education research, anything above 0.2 counts as large in a real classroom. Don't import lab-psychology intuitions.
2. **Always ask "compared to what".** The same study can be both 0.51 and 0.93 — the only difference is whether the control group reread or did nothing. Secondary write-ups pick the bigger one and don't tell you.
3. **The mean is not what you'll get.** Heterogeneity (I²) in this field routinely runs above 84%, meaning most of the variation between studies is real situational difference, not sampling error.

## The verdicts at a glance

| Component | Verdict | In one line |
|---|---|---|
| Self-testing | ✅ Do it | One of only two "high utility" entries; +0.51 vs rereading |
| Spacing | ✅ Do it | The other high-utility entry; one to six days beats same-day |
| Interleaving | ⚠️ Depends | Math problem types and visual materials yes; expository text and vocabulary no |
| Chunking | 🔶 Concept holds | But the "7±2" attached to it is outdated; modern consensus is 4±1 |
| Focused/diffuse mode | 🔶 Metaphor | Keep the behaviour; the neural story doesn't match the DMN literature |
| Pomodoro | 🔶 Metaphor | Improves the experience and efficiency, not the amount learned |
| That learning skills transfer | ❌ Doesn't hold | After bias correction, often no transfer without specific moderators |

# 2. Component by component

In 2013, Dunlosky and four co-authors published [Improving Students' Learning With Effective Learning Techniques](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266) in *Psychological Science in the Public Interest*. They picked 10 techniques students can use on their own without supervision, and assessed whether each one's benefits generalize across learning conditions, student characteristics, materials, and criterion tasks. The result is a fairly brutal tiering:

| Utility | Technique |
|---|---|
| **High** | practice testing (self-testing), distributed practice (spacing) |
| **Moderate** | elaborative interrogation, self-explanation, interleaved practice |
| **Low** | summarization, highlighting, keyword mnemonic, imagery, **rereading** |

The original is blunt about the top tier:

> Practice testing and distributed practice received high utility assessments because they benefit learners of different ages and abilities and have been shown to boost students' performance across many criterion tasks and even in educational contexts.

Taking them one at a time.

## Self-testing ✅

**What the course teaches**: the assignments are literally named "Retrieval Practice". Close the book, write it out, then check.

**What the evidence says**: one of the two high-utility entries. About +0.51 versus rereading ([Adesope et al. 2017](https://doi.org/10.3102/0034654316689306)). You'll see 0.93 and larger quoted elsewhere; those compare against no review at all — which figure applies depends on what you would otherwise have done. (The full reconciliation of the commonly quoted numbers is in the appendix.)

**How to use it**: three counterintuitive but actionable details (quoted from [Pedro De Bruyckere, who read the original](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises)):

> Practice tests with a multiple-choice option have a larger weighted mean effect size (+0.70) than short-answer tests (+0.48). **A single practice test prior to the final test is more effective than when students take several practice tests.** However, the timing should be carefully considered. A gap of less than a day between the practice and final tests showed a smaller weighted effect size than when there is a gap of one to six days (+0.56 and +0.82, respectively).

"One test beats several" and "multiple-choice beats short-answer" both cut against the field's usual advice — the second especially, since the Dunlosky line of work generally holds that free recall beats recognition. Treat that as **an unreconciled disagreement**, not a settled finding.

## Spacing ✅

**What the course teaches**: spaced repetition; don't cram.

**What the evidence says**: the other high-utility entry, and the only one validated against real-world data at scale — [Kim et al. (2019)](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf) confirmed the spacing effect holds up outside the lab.

**How to use it**: it's the same phenomenon as the "+0.82 at one to six days versus +0.56 same-day" figure above, seen from another angle. **Reviewing on the day you first studied buys roughly two-thirds of what coming back a few days later would.**

## Interleaving ⚠️

**What the course teaches**: don't do twenty of the same problem type in a row; mix them.

**What the evidence says**: rated "moderate utility". [Brunmair and Richter's meta-analysis](https://doi.org/10.1037/bul0000209) covers 59 studies and 238 effect sizes, g ≈ 0.42 overall — but the title says it all, *Similarity matters*.

**How to use it**:

- **Works**: visual materials like paintings, mathematical problem types
- **No advantage over blocking**: expository text
- **May actively hurt**: learning words across conceptual categories

Treating "interleave everything" as general advice misreads the paper.

## Chunking 🔶

**What the course teaches**: compress scattered steps into one callable unit — usually paired with "working memory holds 7±2 items".

**What the evidence says**: the concept is fine, the number is outdated. Miller's 1956 seven-plus-or-minus-two measured capacity *after* chunking was possible; [Cowan's 4±1, proposed in 2001](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf), measures the number of chunks themselves, and modern consensus favours the latter ([the two reconcile](https://journalofcognition.org/articles/10.5334/joc.387) once you notice they depend on whether the task lets you chunk).

**How to use it**: you can juggle fewer independent units than you think, so chunking isn't a bonus — it's a precondition.

## Focused/diffuse mode 🔶

**What the course teaches**: the brain alternates between two modes, so a problem you cannot crack should be left alone for the diffuse mode to work on in the background. Sites like [Farnam Street](https://fs.blog/focused-diffuse-thinking) have spread it widely, usually prefaced with "neuroscience shows".

**What the evidence says**: the trouble is on the neuroscience side. [The standard description of the default mode network](https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network) is that its activity is **suppressed** during cognitively demanding, externally focused tasks, and higher during quiet wakefulness and internally directed thought. So "both modes running at once" does not match how the DMN actually behaves. It is not working overtime in the background; it goes quiet when you concentrate.

Oakley appears to have addressed this tension herself. The passage below circulates widely, attributed to an endnote in *A Mind for Numbers* — **but the only place I can find it is [a transcription on Psychology Stack Exchange](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre). There is no second independent source anywhere on the web, and I have not checked it against the printed edition. Verify against the book before citing it**:

> Astute readers will notice my mention that the diffuse mode seems to sometimes work in the background while the focused mode is active. However, research findings show that the default-mode network for example (which is just one of the many resting state networks), seems to go quiet when the focused mode is active. So which is it? … In some sense, then, my use of the term diffuse mode might be thought of as "nonfocused mode activities directed toward learning" rather than simply "default-mode network."

Strip the quote out entirely and the conclusion survives on the DMN literature alone.

**How to use it**: keep the behavioural advice (stuck? go for a walk), drop the neural version. That advice is supported from somewhere else.

## Pomodoro 🔶

**What the course teaches**: 25 minutes of focus, 5 minutes off — and focus on the process, not the product, because product anxiety is what drives procrastination.

**What the evidence says**: [Biwer et al.'s 2023 controlled study in the British Journal of Educational Psychology](https://pmc.ncbi.nlm.nih.gov/articles/PMC12532815) compared systematic breaks (24 minutes of study, 6-minute break) against self-regulated breaks. The systematic groups reported higher concentration and motivation, less fatigue, and finished in less time — **but the two conditions did not differ in invested mental effort or task completion.**

**How to use it**: it improves the experience and the efficiency, not the amount learned. Use it; don't sell it as a learning technique.

## Four components out of scope

The procrastination habit loop, sleep and memory consolidation, memory palaces and mnemonics, and the hard start–jump to easy exam tactic get no verdict here. Not because anything is wrong with them, but because they lack the meta-analytic base this piece needs to say anything stronger than "probably useful".

# 3. Two problems that cut across everything

The verdicts above are per component. Two things cut across all of them, and both matter more than any single verdict.

## A. The assumption in the course's name doesn't hold

"Learning how to learn" presupposes that once you have the skills, they carry over. That assumption has been tested. It does not test well.

[Pan and Rickard's 2018 Psychological Bulletin paper](https://doi.org/10.1037/bul0000151) is the first comprehensive meta-analysis of transfer in test-enhanced learning: 192 transfer effect sizes from 122 experiments and 67 articles, N = 10,382, spanning forty years. The headline is d = 0.40 (95% CI [0.31, 0.50]), which sounds fine. Unpack it:

> That transfer of learning is greatest across test formats, to application and inference questions, to problems involving medical diagnoses, and to mediator and related word cues; it is weakest to rearranged stimulus-response items, to untested materials seen during initial study, and to problems involving worked examples. Moderator analyses further indicated that **response congruency and elaborated retrieval practice, as well as initial test performance, strongly influence the likelihood of positive transfer.**

And the sentence that follows: after correcting for publication bias (the test is highly significant, p < .0001), "the intercept predictions were substantially reduced, **often indicating no positive transfer when none of the aforementioned moderators are present**".

In plain terms: **a large share of "transfer" is really the practice questions and the test questions sharing answers.**

[Agarwal's 2019 study](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf) lands the point harder. Middle-school and college students did retrieval practice with fact questions, higher-order questions, or a mix:

> Critically, higher order and mixed quizzes improved higher order test performance, but fact quizzes did not. Contrary to popular intuition about higher order learning and Bloom's taxonomy, building a foundation of knowledge via fact-based retrieval practice may be less potent than engaging in higher order retrieval practice.

The failure runs both ways — in Experiment 1, practising with higher-order questions did not help on the delayed **fact** test either. Both mismatches collapse back to roughly the restudy baseline. Agarwal reads this as transfer-appropriate processing: the benefit appears when the practice format matches the test format.

The same pattern shows up one level up. [Donker et al.'s 2014 meta-analysis of learning-strategy instruction](https://daneshyari.com/article/preview/355102.pdf) (95 interventions, 180 effect sizes) does find solid effects — writing g = 1.25, science 0.73, mathematics 0.66, reading comprehension 0.36 — but the same report states directly: **strategy instruction aimed at near transfer is more effective than instruction aimed at far transfer.**

**What this means in practice**: every technique marked ✅ above is bound to what you practised far more tightly than you'd like. If you want transfer, you have to deliberately shape the practice to resemble the thing you actually want to do. Which incidentally explains why "grinding LeetCode" and "designing systems" are two different skills.

## B. The effect sizes are being revised downward

That tiering table now gets cited everywhere. The ground under it has shifted three times in the past decade, and almost nobody writing about this has kept up.

**One, the mean hides enormous variation.** [Rowland (2014)](https://doi.org/10.1037/a0037559) reports g = 0.50 sitting on top of I² = 84.35.

**Two, newer and more tightly specified estimates land lower.** In March 2026, Dietrichson and colleagues published [a large systematic review](https://edworkingpapers.com/ai26-1418): 102,451 records screened, 87 studies meeting inclusion criteria, 59 in the synthesis. Where the control group received no practice test at all, the weighted effects were 0.22 (95% CI [0.09, 0.34]) for between-subject designs and 0.46 ([0.29, 0.62]) within-subject — below earlier reviews (Adesope's corresponding figures were 0.64 in primary and 0.83 in secondary school).

But **"lower" is not "overturned"**: the authors note that inclusion criteria and analytic strategies differ across reviews, making magnitudes hard to compare directly, and by Kraft's benchmarks anything above 0.2 is large in education research.

**Three, the more complex the material, the weaker the effect.** The same review's exploratory analysis supports this, and it is an unfinished fight: [van Gog and Sweller's 2015 title](https://link.springer.com/article/10.1007/s10648-015-9310-x) is the argument — "the testing effect decreases or even disappears as the complexity of learning materials increases"; Karpicke and Aue answered the same year with "The testing effect is alive and well with complex materials", and Rawson joined in. The dispute is stuck on the fact that "complexity" resists operationalization. Anyone declaring a winner should raise your suspicion.

**What this means in practice**: not "stop", but **revise your expected effect downward — and the harder the material, the less you can lean on self-testing alone.**

# 4. Three dead claims in this field

They are not in the course, but they show up in the same articles and the same training days.

**The learning pyramid (read 10%, hear 20%, do 90%) — the numbers are fabricated.**
[Subramony, Molenda, Betrus and Thalheimer traced it thoroughly in 2014](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone): Edgar Dale's Cone of Experience contained no percentages at all, and Dale intended it as a descriptive classification, not a prescriptive guide — the numbers were grafted on by persons unknown around 1970. When pressed for a source, the NTL Institute replied that they believed the figures were accurate but could no longer find the original research. A [memory researcher at the University of Strathclyde](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo) put it more directly: he has never seen a properly controlled experiment showing one study technique to be nine times as effective as another.

**Learning styles — the evidence isn't zero, but it's nowhere near enough to redesign teaching around.**
The mainstream verdict comes from [Pashler, McDaniel, Rohrer and Bjork's 2008 review](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work): after examining 70-plus studies they found no support for the meshing hypothesis. But in July 2024, Clinton-Lisell and Litzinger published [Is it really a neuromyth?](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full) in Frontiers in Psychology, restricted to studies that actually compared matched against unmatched instruction — 21 studies, 101 effect sizes, 1,712 participants:

> Based on robust variance estimation, there was an overall benefit of matching instruction to learning styles, g = 0.31, SE = 0.12, 95% CI = [0.05, 0.57], p = 0.02. However, only 26% of learning outcome measures indicated matched instruction benefits for at least two styles, indicating a crossover interaction supportive of the matching hypothesis.

Worth noting that **not recommending it is the paper's own conclusion**: the authors benchmark g = 0.31 against the plain modality effect (g = 0.70), note I² = 91.17, and weigh the teacher time required against the risk of essentializing students into categories.

**Growth mindset — the effect is small enough that it takes a meta-analysis to see.**
[Sisk et al.'s two 2018 meta-analyses](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf): the correlation between mindset and achievement is r ≈ 0.10 across 129 studies (N = 365,915), about 1% of the variance; mindset interventions move achievement by d = 0.08 across 43 studies (N = 57,155). More awkwardly, **interventions whose manipulation checks succeeded — the ones that demonstrably changed students' mindsets — showed no significant effect on achievement.** Dweck and Yeager [responded in 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535), arguing that Sisk's I² of 96.29% means the effects are real but heavily person- and context-dependent, and that low-SES and academically at-risk students do benefit (a point Sisk et al. concede). Both sides agree the effect is small and heterogeneous; they disagree about whether that makes it important.

**The shared structure is worth memorizing**: too intuitively plausible, spreading far faster than it was verified, and an effect size small enough that it takes a meta-analysis to see. Discount the next educational claim that fits all three.

# 5. An adjacent fight: 10,000 hours

[Macnamara, Hambrick and Oswald's 2014 meta-analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf) is routinely used to dismiss the 10,000-hour rule. It found deliberate practice explained 26% of performance variance in games, 21% in music, 18% in sports, 4% in education, and under 1% in professions (the last at r = .05, p = .62, not statistically significant).

The Ericsson camp's [rebuttal](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full) carries weight too: on a re-screened set they get r = 0.54, roughly 29% of variance, and argue many studies Macnamara included never used Ericsson's original definition of deliberate practice — one counted hours nursing students spent in lectures and seminars as practice. [Harwell and Southwick (2021)](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf) add that across 708 meta-analytic correlations in social and personality psychology the average variance explained is 3–4%, so treating "under 50%" as failure is an unreasonable bar.

The two sets of numbers are not comparable because they measure different things. The takeaway that survives: practice volume matters but is far from everything, and **the more structured and predictable the domain (instrument, running), the more practice explains; the more open-ended the domain (professional work), the less.** The uncomfortable implication for engineers is that software work sits in that last column.

# 6. Overall

If you take one thing: **the course's value is not its neuroscience, it is that it turns "don't trust your own sense of fluency" into a repeatable daily process.** The assignments are literally named "Retrieval Practice" — that matters more than any neuroscience in it.

One limitation worth carrying: this field's reviews almost all use retention as the outcome, with far thinner evidence for creativity, judgment, or transfer.

What happens to these principles once LLMs arrive — and why the most-cited piece of evidence in AI education was retracted in April 2026 — is [part 2](/posts/learning/2026-08-04-generative-ai-and-learning-en).

# Appendix and sources

## Appendix: my reservations about these numbers

The body gives one version of each figure to stay readable. This section carries the full ledger, because this article's whole thesis is "don't take secondary write-ups as fact".

**Self-testing has several commonly quoted effect sizes, and most of them are correct.**

| Figure | What it actually is |
|---|---|
| +0.51 | weighted mean effect vs **restudy** |
| +0.93 | vs **filler activity or nothing at all** |
| g = 0.61 | [pooled across all comparison conditions](http://www.lscp.net/persons/ramus/docs/EPR20.pdf) |
| 0.64 / 0.83 | primary / secondary school figures |
| +0.70 vs +0.48 | multiple-choice vs short-answer practice formats |
| g = 0.50 | [Rowland (2014)](https://doi.org/10.1037/a0037559), an independent estimate, I² = 84.35 |
| 0.22 / 0.46 | [Dietrichson et al. 2026](https://edworkingpapers.com/ai26-1418), between- / within-subject designs |

**Adesope's meta-analysis used Fail-safe N to test for publication bias, and that statistic has long been known to badly overstate robustness.** Two independent readers of the original flagged it separately — [Yana Weinstein at the Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) says to take it "with a grain of salt", and the discussion under De Bruyckere's post cites Fergusson & Heene (2012). Treat the numbers above as bias-prone estimates, not fixed values.

**The role of feedback is unreconciled.** Rowland found feedback amplifies the testing effect; Adesope found retrieval with feedback only slightly better than without. Confirmed independently by [the Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) and by [Dietrichson et al.'s systematic review](https://edworkingpapers.com/ai26-1418).

**The transfer section's two sets of numbers come from different analyses — don't mix them.** Random-effects model: d = 0.28 with no response congruency, plus 0.30 when present, for 0.58. After publication-bias correction (PEESE): the intercept is effectively zero, congruency adds 0.36 and elaborated retrieval practice adds 0.18.

**The 10,000-hours meta-analysis carries a 2018 [corrigendum](https://doi.org/10.1177/0956797618769891)**: the main model's average correlation was revised from r = .35 (95% CI [.30, .39]) to .38 ([.33, .42]). The authors are explicit that reanalysing with Cheung and Chan's approach produced "no practical effect on the results" and "had no impact whatsoever on the substance of our findings and conclusions". Worth knowing so you cite the corrected figures — the per-domain percentages in the body come from the article text, not the corrigendum table.

**Dietrichson et al. 2026 has not been peer reviewed** (EdWorkingPaper). Say so when you cite it.

## Changelog

- 2026-08-19 (2): Rebuilt on a single spine, matching the Chinese edition. The article previously ran three competing organizing principles at once (by verdict / by component / by cross-cutting issue), which produced interruptions and orphan sections. Now: orientation (the course and the criteria) → component-by-component verdicts in a uniform format (what the course teaches / what the evidence says / how to use it) → two cross-cutting problems (transfer and downward revision, each its own part) → dead claims → adjacent fight → appendix. The transfer section moved from ninth position to a part of its own. Nothing was removed.
- 2026-08-19 (1): Added a description of the course itself — the original never described the object it was auditing — plus an explicit statement of which five components this piece audits.
- 2026-08-18: Restructured for readability: actionable conclusions moved up, a guide to reading effect sizes added, sections led by claims rather than researcher names, and the full effect-size ledger and methodological disputes moved to an appendix. No evidence, figure or citation was removed.

## References

Each entry is tagged with **how I actually accessed it**, because this article's subject is precisely not treating secondhand summaries as fact:

- **[primary]** read the original paper in full, or an official notice/page
- **[abstract]** used only the official abstract or publisher page
- **[secondhand]** taken from another paper or a reliable secondary source; original not obtained
- **[unverified]** no independent source found — verify before citing

DOIs I could not confirm myself are omitted rather than guessed.

### The course and its core concepts

- [primary/official] Deep Teaching Solutions. *Learning How to Learn: Powerful mental tools to help you master tough subjects*. Coursera. Accessed 2026-08-04 (4,175,377 enrollments, 4.8 across 93,136 reviews — live figures, subject to change). <https://www.coursera.org/learn/learning-how-to-learn>
- [primary/official] Temporal Dynamics of Learning Center, UC San Diego. *MOOC: Learning How to Learn*. <https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php> — sole official source for the 197,000 learners / 206 countries figure.
- [secondhand/news] Markoff, J. (2015-12-29). The Most Popular Online Course Teaches You to Learn. *The New York Times*, Bits blog. <https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn> — the 1.19M figure and the ">20% completion rate" both come from Sejnowski's own statements in interview.
- [**unverified**] Oakley, B. (2014). *A Mind for Numbers*. TarcherPerigee. — the "diffuse mode" endnote quoted above was **not checked against the printed edition**; the only traceable transcription is [Psychology Stack Exchange #18292](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre).
- [secondhand] *Know Your Brain: Default Mode Network*. Neuroscientifically Challenged. <https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network>
- [secondhand] Farnam Street. *Focused and Diffuse: Two Modes of Thinking*. <https://fs.blog/focused-diffuse-thinking>
- [primary] Cowan, N. (2001). The magical number 4 in short-term memory: A reconsideration of mental storage capacity. *Behavioral and Brain Sciences*, 24, 87–185.
- [primary/PDF] Cowan, N. (2010). [The Magical Mystery Four: How is working memory capacity limited, and why?](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf) *Current Directions in Psychological Science*.
- [primary] [Modelling Working Memory Capacity: Is the Magical Number Four, Seven, or Does it Depend on What You Are Counting?](https://journalofcognition.org/articles/10.5334/joc.387) *Journal of Cognition*. DOI: 10.5334/joc.387
- [primary] Biwer, F., Wiradhany, W., oude Egbrink, M. G. A., & de Bruin, A. B. H. (2023). [Understanding effort regulation: Comparing 'Pomodoro' breaks and self-regulated breaks](https://bpspsychub.onlinelibrary.wiley.com/doi/10.1111/bjep.12593). *British Journal of Educational Psychology*, 93(2), 353–367. DOI: 10.1111/bjep.12593 — self-regulated n=35, Pomodoro (24+6 min) n=25, short-interval (12+3 min) n=27.

### Effect sizes for study techniques

- [primary/PDF] Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). [Improving Students' Learning With Effective Learning Techniques](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266). *Psychological Science in the Public Interest*, 14(1), 4–58. DOI: 10.1177/1529100612453266 ([full PDF](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf))
- [abstract] Rowland, C. A. (2014). [The effect of testing versus restudy on retention: A meta-analytic review of the testing effect](https://doi.org/10.1037/a0037559). *Psychological Bulletin*, 140(6), 1432–1463. DOI: 10.1037/a0037559
- [abstract + secondhand] Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). [Rethinking the Use of Tests: A Meta-Analysis of Practice Testing](https://doi.org/10.3102/0034654316689306). *Review of Educational Research*, 87(3), 659–701. DOI: 10.3102/0034654316689306 — the "+0.51 vs restudy / +0.93 vs no activity" figures are taken from [a secondary summary of its results](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises); the pooled "g = 0.61 [0.58, 0.65]" from [a later meta-analytic review in Educational Psychology Review](http://www.lscp.net/persons/ramus/docs/EPR20.pdf); the "feedback only slightly better" point from [The Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1). **I did not read the Adesope original in full — SAGE is paywalled, and neither ResearchGate nor academia.edu would serve the text.** To reduce the risk, the figures are cross-checked against three independent accounts by people who did read it:
    - [Pedro De Bruyckere, *Important new meta-analysis on the testing effect — with some surprises*](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises) (education researcher; quotes the original directly — the format/number/timing passage above comes from here; the comment thread flags the paper's use of Fail-safe N, citing Fergusson & Heene 2012)
    - [Yana Weinstein, *New Meta-analysis of 217 Retrieval Practice Studies*, The Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) (cognitive psychologist; feedback finding, secondary-school effects largest, fail-safe caveat)
    - [Wing Institute, *How Effective Are Practice Tests?*](https://www.winginstitute.org/news/effective-practice-tests) (independent confirmation of 0.51 / 0.93)
    - Dietrichson et al. (2026) also summarize it in detail (feedback, number of tests, format matching).
    **The study counts disagree**: De Bruyckere quotes the original as "272 independent effects from 188 separate experiments", while the Learning Scientists headline says "217 studies". I could not resolve this.
- [primary/PDF] Dietrichson, J., Seerup, J. K., Bondebjerg Mølgaard, A., Kildemoes, M. W., Schytt, F. L. W., Vembye, M., Bengtsen, E., Viinholt, B. C. A., & Thomsen, M. K. (2026). [Testing frequency and student achievement: A systematic review](https://edworkingpapers.com/ai26-1418). EdWorkingPaper No. 26-1418, Annenberg Institute at Brown University. DOI: 10.26300/jas3-2b83 — **a working paper, not yet peer reviewed.** The 0.22 / 0.46 figures and the complexity finding were checked against the PDF body; the authors also caution that magnitudes across reviews are not directly comparable, and do not consider their own effects small by Kraft's (2020) benchmarks.
- [abstract] van Gog, T., & Sweller, J. (2015). [Not New, but Nearly Forgotten: The Testing Effect Decreases or even Disappears as the Complexity of Learning Materials Increases](https://link.springer.com/article/10.1007/s10648-015-9310-x). *Educational Psychology Review*, 27(2), 247–264. DOI: 10.1007/s10648-015-9310-x
- [abstract] Karpicke, J. D., & Aue, W. R. (2015). [The Testing Effect Is Alive and Well with Complex Materials](https://eric.ed.gov?id=EJ1062040). *Educational Psychology Review*, 27(2), 317–326. — direct rebuttal to the above.
- [secondhand] Rawson, K. (2015). The Status of the Testing Effect for Complex Materials: Still a Winner. *Educational Psychology Review*, 27. — the second rebuttal in the same issue; I have only seen it described by others.
- [abstract] Brunmair, M., & Richter, T. (2019). [Similarity matters: A meta-analysis of interleaved learning and its moderators](https://doi.org/10.1037/bul0000209). *Psychological Bulletin*, 145(11), 1029–1052. DOI: 10.1037/bul0000209
- [primary/PDF] Kim, A. S. N., Wong-Kee-You, A. M. B., Wiseheart, M., & Rosenbaum, R. S. (2019). [The spacing effect stands up to big data](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf). *Behavior Research Methods*, 51(4), 1485–1497. DOI: 10.3758/s13428-018-1184-7
- [primary/PDF] Karpicke, J. D., Butler, A. C., & Roediger, H. L. III (2009). [Metacognitive strategies in student learning: Do students practise retrieval when they study on their own?](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf) *Memory*, 17(4), 471–479. DOI: 10.1080/09658210802647009

### Transfer

- [primary/full PDF] Pan, S. C., & Rickard, T. C. (2018). [Transfer of test-enhanced learning: Meta-analytic review and synthesis](https://doi.org/10.1037/bul0000151). *Psychological Bulletin*, 144(7), 710–756. DOI: 10.1037/bul0000151 ([PDF](https://pdf.retrievalpractice.org/transfer/Pan_Rickard_2018.pdf)) — 192 transfer effect sizes / 122 experiments / 67 articles / N = 10,382. Both the random-effects figures (0.28 / +0.30 / 0.58) and the PEESE results (intercept effectively zero, +0.36, +0.18) were checked against the body of the paper.
- [primary/PDF] Agarwal, P. K. (2019). [Retrieval practice & Bloom's taxonomy: Do students need fact knowledge before higher order learning?](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf) *Journal of Educational Psychology*, 111(2), 189–209. DOI: 10.1037/edu0000282 ([ERIC record](https://eric.ed.gov?id=EJ1205208))
- [primary/PDF] Donker, A. S., de Boer, H., Kostons, D., Dignath van Ewijk, C. C., & van der Werf, M. P. C. (2014). [Effectiveness of learning strategy instruction on academic performance: A meta-analysis](https://daneshyari.com/article/preview/355102.pdf). *Educational Research Review*, 11, 1–26.

### Myths, reversals and disputes

- [secondhand] Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning Styles: Concepts and Evidence. *Psychological Science in the Public Interest*, 9(3), 105–119. — I used only [a secondary summary page](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work), not the original.
- [primary/full text] Clinton-Lisell, V., & Litzinger, C. (2024). [Is it really a neuromyth? A meta-analysis of the learning styles matching hypothesis](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full). *Frontiers in Psychology*, 15. DOI: 10.3389/fpsyg.2024.1428732 — 21 studies / 101 effect sizes / N = 1,712.
- [primary] Thalheimer, W. (2015). [Mythical Retention Data & The Corrupted Cone](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone). Work-Learning Research. — summarizes the 2014 *Educational Technology* four-article investigation by Subramony, Molenda, Betrus and Thalheimer.
- [primary/official] University of Strathclyde. [Remembering 90% of What You Do?](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo)
- [primary/PDF] Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L., & Macnamara, B. N. (2018). [To what extent and under which circumstances are growth mind-sets important to academic achievement? Two meta-analyses](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf). *Psychological Science*, 29(4), 549–571. DOI: 10.1177/0956797617739704
- [primary/full text] Yeager, D. S., & Dweck, C. S. (2020). [What Can Be Learned from Growth Mindset Controversies?](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535) *American Psychologist*, 75(9), 1269–1284.
- [primary/PDF] Macnamara, B. N., Hambrick, D. Z., & Oswald, F. L. (2014). [Deliberate Practice and Performance in Music, Games, Sports, Education, and Professions: A Meta-Analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf). *Psychological Science*, 25(8), 1608–1618. DOI: 10.1177/0956797614535810
- [primary] Corrigendum (2018). *Psychological Science*. DOI: [10.1177/0956797618769891](https://doi.org/10.1177/0956797618769891) — main-model r revised from .35 to .38. The authors state in the notice that the reanalysis had "no practical effect on the results" and "no impact whatsoever on the substance of our findings and conclusions". Cite the corrected figures; it is not grounds for doubting the study.
- [primary/full text] Ericsson-camp response (2019). *Frontiers in Psychology*. <https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full> DOI: 10.3389/fpsyg.2019.02396
- [primary/PDF] Harwell, K. W., & Southwick, D. (2021). [Beyond 10,000 Hours](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf).

