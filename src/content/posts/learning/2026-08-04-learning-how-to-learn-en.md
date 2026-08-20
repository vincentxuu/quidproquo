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

There is a course on Coursera whose [official page](https://www.coursera.org/learn/learning-how-to-learn) currently shows 4,175,377 enrollments and a 4.8 rating. It is called Learning How to Learn, taught by engineering professor Barbara Oakley and neuroscientist Terrence Sejnowski, and it [launched in August 2014](https://tdlc.ucsd.edu/tdlc2/news_LHTL_MOOC.php). By [the New York Times' December 2015 report](https://archive.nytimes.com/bits.blogs.nytimes.com/2015/12/29/the-most-popular-online-course-teaches-you-to-learn) it was the largest MOOC in the world, narrowly ahead of Andrew Ng's Machine Learning.

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

In 2009, researchers [asked 177 college students](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf) how they study. 84% said they reread; 55% named rereading their number one strategy. Only 11% tested themselves, and only 1% did so because they believed retrieval itself helps.

Rereading is exactly what gets rated low utility below. Students are not lazy — they are putting in the hours and **systematically choosing wrong**. The reason is clear enough: rereading feels effective. The second pass goes down more smoothly than the first, and the brain misreads that fluency as mastery.

Hence the field's core proposition: **the subjective fluency of learning is inversely related to long-term retention.** Nearly every evidence-backed technique amounts to making the present moment harder.

## The verdicts at a glance

| Component | Verdict | In one line |
|---|---|---|
| Self-testing | ✅ Do it | One of the two best-rated of ten techniques |
| Spacing | ✅ Do it | The other one; coming back in a few days beats reviewing twice today |
| Interleaving | ⚠️ Depends | Math problem types and visual materials yes; expository text and vocabulary no |
| Chunking | 🔶 Concept holds | But the "7±2" attached to it is outdated; modern consensus is 4±1 |
| Focused/diffuse mode | 🔶 Metaphor | Keep the behaviour; the neural story doesn't match |
| Pomodoro | 🔶 Metaphor | Improves the experience and efficiency, not the amount learned |
| That learning skills transfer | ❌ Doesn't hold | You get better at what you practised, and not much else |

Some effect sizes appear below (numbers like 0.3, 0.5). Two things up front: **0.2 is not small in education research** (by [Kraft's benchmarks](https://doi.org/10.3102/0013189X20912798)), and **the same study can be both 0.51 and 0.93** — the only difference is whether the control group reread or did nothing. Secondary write-ups pick the bigger one and don't tell you. Full reconciliation in the appendix.

# 2. Component by component

In 2013, [Dunlosky and four co-authors](https://journals.sagepub.com/doi/abs/10.1177/1529100612453266) picked 10 techniques students can use on their own without supervision, and assessed whether each one's benefits generalize across students, materials, and test formats. The result is a fairly brutal tiering:

| Utility | Technique |
|---|---|
| **High** | practice testing (self-testing), distributed practice (spacing) |
| **Moderate** | elaborative interrogation, self-explanation, interleaved practice |
| **Low** | summarization, highlighting, keyword mnemonic, imagery, **rereading** |

Only two made the top tier, on the grounds that they help learners of all ages and abilities and hold up in real classrooms. Taking them one at a time.

## Self-testing ✅

**What the course teaches**: the assignments are literally named "Retrieval Practice".

**What to do**: finish a section, close the book, write down what you remember on a blank sheet, then go back and check. The parts you couldn't write are the parts you only thought you knew. Don't substitute "glance at the heading and run through it mentally" — writing and not-writing are different activities.

**The evidence**: one of the two best-rated of ten techniques. Against rereading, the benefit is about [+0.51](https://doi.org/10.3102/0034654316689306).

**Three counterintuitive details** ([source](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises)):

- **One practice test before the real one beats several.** More is not better.
- **A gap of one to six days between practice and the real test clearly beats same-day.**
- **Multiple-choice practice outperformed short-answer** — which cuts against this field's usual advice that free recall beats recognition. Treat it as **an unreconciled disagreement**, not a settled finding.

## Spacing ✅

**What the course teaches**: spaced repetition; don't cram.

**What to do**: leave at least a day before you touch the same material again. **Reviewing on the day you first studied buys roughly two-thirds of what coming back a few days later would.**

**The evidence**: the other high-utility entry, and the only one validated against real-world data at scale — [Kim et al. reproduced it outside the lab](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf).

## Interleaving ⚠️

**What the course teaches**: don't do twenty of the same problem type in a row; mix them.

**What to do**: mix in exactly two situations — math-style problems where the skill is "work out which method this one needs", and visual material where you have to tell styles apart. Don't mix while reading expository text or learning vocabulary.

**The evidence**: rated moderate. [Brunmair and Richter's review](https://doi.org/10.1037/bul0000209) says it in the title — *Similarity matters*: it helps for visual materials like paintings and for mathematical problem types, shows no advantage for expository text, and may actively hurt when learning words across conceptual categories. Treating "interleave everything" as general advice misreads the paper.

## Chunking 🔶

**What the course teaches**: compress scattered steps into one callable unit — usually paired with "working memory holds 7±2 items".

**What to do**: use the concept, but don't size your workload off 7±2. You can juggle fewer independent units than you think, which makes chunking a precondition rather than a bonus.

**The evidence**: the concept is fine, the number is outdated. Miller's 1956 seven-plus-or-minus-two measured capacity *after* chunking was possible; [Cowan's 4±1](https://nschwartz.yourweb.csuchico.edu/4.%20Magical%20mystery%204%20cowan.pdf) measures the number of chunks themselves, and modern consensus favours the latter ([the two reconcile](https://journalofcognition.org/articles/10.5334/joc.387) once you notice they depend on whether the task lets you chunk).

## Focused/diffuse mode 🔶

**What the course teaches**: the brain alternates between two modes, so a problem you cannot crack should be left alone for the diffuse mode to work on in the background. Sites like [Farnam Street](https://fs.blog/focused-diffuse-thinking) have spread it widely, usually prefaced with "neuroscience shows".

**What to do**: stuck? Go for a walk. Keep that. Just don't argue the neuroscience version with anyone.

**The evidence**: the trouble is on the neuroscience side. [The standard description of the default mode network](https://neuroscientificallychallenged.com/posts/know-your-brain-default-mode-network) is that its activity is **suppressed** while you're concentrating on a task, and higher when you're idling, daydreaming or recalling. So "both modes running at once" does not match how the DMN behaves. It is not working overtime in the background; it goes quiet when you concentrate.

Oakley appears to have addressed this tension herself. The passage below circulates widely, attributed to an endnote in *A Mind for Numbers* — **but the only place I can find it is [a transcription on Psychology Stack Exchange](https://psychology.stackexchange.com/questions/18292/does-mindful-meditation-inhibit-diffuse-thinking-aka-default-mode-network-cre), with no second independent source anywhere. Verify against the book before citing it**:

> Astute readers will notice my mention that the diffuse mode seems to sometimes work in the background while the focused mode is active. However, research findings show that the default-mode network for example seems to go quiet when the focused mode is active. So which is it? … In some sense, then, my use of the term diffuse mode might be thought of as "nonfocused mode activities directed toward learning" rather than simply "default-mode network."

Strip the quote out entirely and the conclusion survives on the DMN literature alone.

## Pomodoro 🔶

**What the course teaches**: 25 minutes of focus, 5 minutes off — and focus on the process, not the product, because product anxiety is what drives procrastination.

**What to do**: use it. It makes you less tired and less likely to stall. Just don't expect it to make you learn more.

**The evidence**: [a 2023 controlled study](https://pmc.ncbi.nlm.nih.gov/articles/PMC12532815) compared fixed breaks (24 minutes on, 6 off) against letting people break whenever they wanted. The fixed-break groups reported more concentration and motivation, less fatigue, and finished sooner — **but the two conditions put in the same mental effort and completed the same amount of work.**

## Four components out of scope

The procrastination habit loop, sleep and memory consolidation, memory palaces and mnemonics, and the hard start–jump to easy exam tactic get no verdict here. Not because anything is wrong with them, but because they lack the large-scale evidence base this piece needs to say anything stronger than "probably useful".

# 3. Two problems that cut across everything

The verdicts above are per component. Two things cut across all of them, and both matter more than any single verdict.

## A. The assumption in the course's name doesn't hold

"Learning how to learn" presupposes that once you have the skills, they carry over. That assumption has been tested. It does not test well.

[Pan and Rickard's 2018 review](https://doi.org/10.1037/bul0000151) was the first comprehensive look at transfer in test-enhanced learning, spanning forty years and over a hundred experiments. The headline number looks fine (d = 0.40), but unpack it and one thing is holding it up: **whether the practice questions and the test questions share answers.** When they do, the effect appears. When they don't, correcting for publication bias takes it to roughly zero.

In other words, a lot of what gets called "transfer" is really question overlap.

[Agarwal's 2019 study](https://pdf.poojaagarwal.com/Agarwal_2019_JEdPsych.pdf) puts it more bluntly. Students did retrieval practice with fact questions, higher-order questions, or a mix, then sat a higher-order test:

> Critically, higher order and mixed quizzes improved higher order test performance, but fact quizzes did not. Contrary to popular intuition about higher order learning and Bloom's taxonomy, building a foundation of knowledge via fact-based retrieval practice may be less potent than engaging in higher order retrieval practice.

And the failure runs both ways: practising with higher-order questions didn't help on the delayed **fact** test either. Both mismatches collapse back to roughly the restudy baseline.

The same pattern shows up one level up. [Donker et al. reviewed 95 interventions](https://daneshyari.com/article/preview/355102.pdf) that taught students how to study. The effects were solid (largest for writing, smallest for reading comprehension), but the conclusion was the same sentence: **instruction aimed at near transfer works better than instruction aimed at far transfer.**

**So what**: every technique marked ✅ above is bound to what you practised far more tightly than you'd like. If you want transfer, you have to deliberately shape the practice to resemble the thing you actually want to do — which incidentally explains why "grinding LeetCode" and "designing systems" are two different skills.

## B. The effect sizes are being revised downward

That tiering table now gets cited everywhere. The ground under it has shifted three times in the past decade, and almost nobody writing about this has kept up.

**One, the mean is not what you'll get.** Most of the variation between studies isn't sampling error — it's real situational difference. The same technique behaves very differently across people, subjects, and test formats.

**Two, tighter new estimates cut the number roughly in half.** In March 2026 a [large systematic review](https://edworkingpapers.com/ai26-1418) put self-testing at 0.22–0.46, down from 0.64–0.83 in earlier reviews. But **"lower" is not "overturned"**: the authors note that inclusion criteria differ across reviews, making magnitudes hard to compare directly, and by Kraft's benchmarks anything above 0.2 is large in education research.

**Three, the more complex the material, the weaker the effect.** This is an unfinished fight. [van Gog and Sweller's 2015 title](https://link.springer.com/article/10.1007/s10648-015-9310-x) is the argument — "the testing effect decreases or even disappears as the complexity of learning materials increases"; [Karpicke and Aue answered the same year](https://eric.ed.gov?id=EJ1062040), and Rawson joined in. The dispute is stuck on the fact that "complexity" resists operationalization. Anyone declaring a winner should raise your suspicion.

**So what**: not "stop", but **revise your expected effect downward — and the harder the material, the less you can lean on self-testing alone.**

# 4. Three dead claims in this field

They are not in the course, but they show up in the same articles and the same training days.

**The learning pyramid (read 10%, hear 20%, do 90%) — the numbers are fabricated.**
[The full trace was done in 2014](https://www.worklearning.com/2015/01/05/mythical-retention-data-the-corrupted-cone): Edgar Dale's Cone of Experience contained no percentages at all, and Dale intended it as a descriptive classification, not a prescriptive guide — the numbers were grafted on by persons unknown around 1970. When pressed for a source, the NTL Institute replied that they believed the figures were accurate but could no longer find the original research. A [memory researcher at the University of Strathclyde](https://www.strath.ac.uk/humanities/education/blog/remembering90percentofwhatyoudo) put it more directly: he has never seen a properly controlled experiment showing one study technique to be nine times as effective as another.

**Learning styles — the evidence isn't zero, but it's nowhere near enough to redesign teaching around.**
The mainstream verdict comes from [a 2008 review](https://vu.nl/en/employee/didactics/learning-styles-debunked-what-does-work) that examined 70-plus studies and found no support. But in 2024 someone [ran it again](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full), restricted to studies that actually compared matched against unmatched instruction — and this time found a small but statistically significant benefit.

The thing to notice is that **the authors still don't recommend adopting it**: the benefit is far smaller than simply changing the medium of presentation, the studies disagree with each other enormously, and only about a quarter of the measures showed the crossover pattern the hypothesis actually requires — visual learners doing better with visual teaching *and* auditory learners doing better with auditory teaching. Add the teacher time it costs and the risk of pigeonholing students, and it doesn't pay.

**Growth mindset — the effect is small enough that it takes a meta-analysis to see.**
[Sisk et al.'s two 2018 reviews](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf) remain the most thorough test: mindset accounts for about 1% of the variance in achievement, and mindset interventions move achievement by d = 0.08. More awkwardly, **the interventions that demonstrably changed students' mindsets showed no significant effect on achievement.** Dweck and Yeager [responded in 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535), arguing the effects are real but heavily person- and context-dependent, and that low-SES and academically at-risk students do benefit (a point Sisk et al. concede). Both sides agree the effect is small and unstable; they disagree about whether that makes it important.

**The shared structure is worth memorizing**: too intuitively plausible, spreading far faster than it was verified, and small enough that you need statistical machinery to see it at all. Discount the next educational claim that fits all three.

# 5. An adjacent fight: 10,000 hours

[Macnamara et al.'s 2014 review](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf) is routinely used to dismiss the 10,000-hour rule. Deliberate practice explained 26% of performance differences in games, 21% in music, 18% in sports, 4% in education, and under 1% in professional work.

The Ericsson camp's [rebuttal](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full) carries weight too: on a re-screened set they get roughly 29%, and argue many included studies never used the original definition of deliberate practice — one counted hours nursing students spent in lectures and seminars as practice. [Another group](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf) adds that the average across all of social and personality psychology is only 3–4%, so treating "under 50%" as failure is an unreasonable bar.

The two sets of numbers are not comparable because they measure different things. The takeaway that survives: practice volume matters but is far from everything, and **the more structured and predictable the domain (instrument, running), the more practice explains; the more open-ended the domain (professional work), the less.** The uncomfortable implication for engineers is that software work sits in that last column.

# 6. Overall

If you take one thing: **the course's value is not its neuroscience, it is that it turns "don't trust your own sense of fluency" into a repeatable daily process.** The assignments are literally named "Retrieval Practice" — that matters more than any neuroscience in it.

One limitation worth carrying: this field's research almost all uses "how much you remember" as the outcome, with far thinner evidence for creativity, judgment, or transfer.

What happens to these principles once LLMs arrive — and why the most-cited piece of evidence in AI education was retracted in April 2026 — is [part 2](/posts/learning/2026-08-04-generative-ai-and-learning-en).

# Appendix and sources

## Appendix: the full numbers, and my reservations

The body keeps one figure per claim to stay readable. This section carries the full ledger, because this article's whole thesis is "don't take secondary write-ups as fact".

**Self-testing has several commonly quoted effect sizes. Most are correct; they differ in the control group.**

| Figure | What it actually is |
|---|---|
| +0.51 | weighted mean effect vs **restudy** |
| +0.93 | vs **filler activity or nothing at all** |
| g = 0.61 | [pooled across all comparison conditions](http://www.lscp.net/persons/ramus/docs/EPR20.pdf) |
| 0.64 / 0.83 | primary / secondary school figures |
| +0.70 vs +0.48 | multiple-choice vs short-answer practice formats |
| g = 0.50 | [Rowland (2014)](https://doi.org/10.1037/a0037559), an independent estimate, I² = 84.35 |
| 0.22 / 0.46 | [Dietrichson et al. 2026](https://edworkingpapers.com/ai26-1418), between- / within-subject designs, 95% CI [0.09, 0.34] and [0.29, 0.62]. That review screened 102,451 records, found 87 eligible studies, and synthesized 59 |

**Format, number and timing of practice tests** (the source for the three bullets in the body):

> Practice tests with a multiple-choice option have a larger weighted mean effect size (+0.70) than short-answer tests (+0.48). **A single practice test prior to the final test is more effective than when students take several practice tests.** However, the timing should be carefully considered. A gap of less than a day between the practice and final tests showed a smaller weighted effect size than when there is a gap of one to six days (+0.56 and +0.82, respectively).

**Adesope's meta-analysis used Fail-safe N to test for publication bias, and that statistic has long been known to badly overstate robustness.** Two independent readers of the original flagged it separately — [Yana Weinstein at the Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) says to take it "with a grain of salt", and the discussion under De Bruyckere's post cites Fergusson & Heene (2012). Treat the numbers above as bias-prone estimates, not fixed values.

**The role of feedback is unreconciled.** Rowland found feedback amplifies the testing effect; Adesope found retrieval with feedback only slightly better than without. Confirmed independently by [the Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) and by [Dietrichson et al.'s systematic review](https://edworkingpapers.com/ai26-1418).

**Heterogeneity, in numbers**: Rowland's g = 0.50 sits on I² = 84.35; the learning-styles meta-analysis on I² = 91.17; the growth-mindset one on I² = 96.29. All three mean the average is a poor summary.

**The transfer section in full** ([Pan & Rickard 2018](https://doi.org/10.1037/bul0000151): 192 transfer effect sizes, 122 experiments, 67 articles, N = 10,382). Overall d = 0.40 (95% CI [0.31, 0.50]). On the moderators:

> That transfer of learning is greatest across test formats, to application and inference questions, to problems involving medical diagnoses, and to mediator and related word cues; it is weakest to rearranged stimulus-response items, to untested materials seen during initial study, and to problems involving worked examples. Moderator analyses further indicated that **response congruency and elaborated retrieval practice, as well as initial test performance, strongly influence the likelihood of positive transfer.**

Two sets of numbers come from different analyses — don't mix them. **Random-effects model**: d = 0.28 with no response congruency, plus 0.30 when present, for 0.58. **After publication-bias correction (PEESE, test significant at p < .0001)**: the intercept is effectively zero, congruency adds 0.36 and elaborated retrieval practice adds 0.18.

**Donker et al. by subject**: writing g = 1.25, science 0.73, mathematics 0.66, reading comprehension 0.36 (95 interventions, 180 effect sizes).

**The 2024 learning-styles meta-analysis in numbers**: 21 studies, 101 effect sizes, 1,712 participants; g = 0.31, SE = 0.12, 95% CI [0.05, 0.57], p = 0.02; only 26% of learning outcome measures showed the crossover interaction the matching hypothesis requires; the modality effect it is benchmarked against is g = 0.70.

**Growth mindset in numbers**: correlation with achievement r ≈ 0.10 (129 studies, N = 365,915); intervention effect d = 0.08 (43 studies, N = 57,155).

**The 10,000-hours meta-analysis carries a 2018 [corrigendum](https://doi.org/10.1177/0956797618769891)**: the main model's average correlation was revised from r = .35 (95% CI [.30, .39]) to .38 ([.33, .42]). The authors are explicit that the reanalysis had "no practical effect on the results" and "no impact whatsoever on the substance of our findings and conclusions". Worth knowing so you cite the corrected figures — the per-domain percentages in the body come from the article text, not the corrigendum table. The professions figure was r = .05, p = .62, not statistically significant.

**Dietrichson et al. 2026 has not been peer reviewed** (EdWorkingPaper). Say so when you cite it.

## Changelog

- 2026-08-20: Register rewrite. The body was packed with sample sizes, confidence intervals, I² values and screening counts, plus nine block quotations of academic abstracts — it read like a literature review. Now the body keeps at most one figure per claim, with everything else moved to the appendix; block quotations are down from nine to three (keeping only the passages where the author's own words land harder than my paraphrase); and every technique has a concrete "what to do". Nothing was removed, only relocated and rephrased.
- 2026-08-19 (2): Rebuilt on a single spine. The article previously ran three competing organizing principles at once, producing interruptions and orphan sections. The transfer section moved from ninth position to a part of its own.
- 2026-08-19 (1): Added a description of the course itself — the original never described the object it was auditing — plus an explicit statement of which components this piece audits.
- 2026-08-18: Restructured for readability: actionable conclusions moved up, sections led by claims rather than researcher names, and the full effect-size ledger and methodological disputes moved to an appendix.

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

