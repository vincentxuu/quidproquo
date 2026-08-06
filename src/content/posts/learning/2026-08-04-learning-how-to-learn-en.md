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
glossary:
  - term: "retrieval practice"
    aliases: ["practice testing", "self-testing"]
    definition: "Closing the book and pulling the answer out of memory, rather than reading it again."
    advanced: "Testing is itself a learning event, not just assessment. The effect appears to shrink as material gets more complex. Which format works best is unresolved — the Dunlosky line holds that free recall beats recognition, but Adesope et al. (2017) found multiple-choice (+0.70) outperforming short-answer (+0.48)."
    context: "In this article it is one of only two techniques Dunlosky et al. rated as high utility."
    links:
      - label: "Rowland (2014) meta-analysis"
        url: "https://doi.org/10.1037/a0037559"
  - term: "desirable difficulties"
    definition: "Robert Bjork's term for learning conditions that hurt performance in the moment but improve long-term retention."
    advanced: "Covers spacing, interleaving, retrieval, and varied practice conditions. The difficulty has to be desirable — difficulty beyond the learner's reach is just difficulty."
    context: "The series uses it to explain why AI assistance harms learning: it removes exactly this kind of difficulty."
  - term: "Hedges' g"
    aliases: ["effect size"]
    definition: "A standardized effect size expressing the difference between two groups in standard deviations, with a small-sample correction over Cohen's d."
    advanced: "Roughly 0.2 small, 0.5 medium, 0.8 large — but those thresholds are convention only. Read it alongside I²: a high average with high heterogeneity means individual settings vary widely."
    context: "Several meta-analyses cited here report in g, e.g. the testing effect at g = 0.50."
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
| **High** | practice testing (self-testing) | [Rowland (2014)](https://doi.org/10.1037/a0037559): g = 0.50; [Adesope et al. (2017)](https://doi.org/10.3102/0034654316689306): +0.51 vs restudy, +0.93 vs no activity (see below) |
| **High** | distributed practice (spacing) | [Kim et al. (2019)](https://www.yorku.ca/ncepeda/publications/KWWR2019.pdf) confirmed it holds up in real-world big data |
| **Moderate** | elaborative interrogation, self-explanation, interleaved practice | Interleaving, [Brunmair & Richter (2019)](https://doi.org/10.1037/bul0000209): g ≈ 0.42 |
| **Low** | summarization, highlighting, keyword mnemonic, imagery, **rereading** | The two students use most — rereading and highlighting — are both here |

The original is blunt about the top tier:

> Practice testing and distributed practice received high utility assessments because they benefit learners of different ages and abilities and have been shown to boost students' performance across many criterion tasks and even in educational contexts.

**First, a citation trap** — one that demonstrates this article's whole thesis. Adesope et al.'s 2017 meta-analysis gets quoted as 0.51, 0.61, 0.70, 0.83 and 0.93 in different places. Most are correct; they differ in what the control group was doing, or which sub-analysis is meant:

| Figure | What it actually is |
|---|---|
| +0.51 | weighted mean effect vs **restudy** |
| +0.93 | vs **filler activity or nothing at all** |
| g = 0.61 | [pooled across all comparison conditions](http://www.lscp.net/persons/ramus/docs/EPR20.pdf) |
| 0.64 / 0.83 | primary / secondary school figures (as cited by Dietrichson et al.) |
| +0.70 vs +0.48 | multiple-choice vs short-answer practice formats |

Secondary write-ups typically pick the largest number and never say what it was measured against. **Which should you use? The one matching your actual alternative.** If you would otherwise reread, your reference value is 0.51, not 0.93.

Three more of its findings are worth keeping, because they are counterintuitive and directly actionable (quoted from [Pedro De Bruyckere, who read the original](https://theeconomyofmeaning.com/2017/03/21/important-new-meta-analysis-on-the-testing-effect-with-some-surprises)):

> In addition, the format, number, and frequency of practice tests make a difference for the learning benefits on a final test. Practice tests with a multiple-choice option have a larger weighted mean effect size (+0.70) than short-answer tests (+0.48). **A single practice test prior to the final test is more effective than when students take several practice tests.** However, the timing should be carefully considered. A gap of less than a day between the practice and final tests showed a smaller weighted effect size than when there is a gap of one to six days (+0.56 and +0.82, respectively).

"One test beats several" and "multiple-choice beats short-answer" both cut against the field's usual advice — the second especially, since the Dunlosky line of work generally holds that free recall beats recognition. Treat that as **an unreconciled disagreement**, not a settled finding. The "one to six days beats same-day" result, by contrast, lines up exactly with spacing.

One methodological point has to be stated: **this meta-analysis used Fail-safe N to test for publication bias, and that statistic has long been known to badly overstate robustness.** Two independent readers of the original flagged it separately — [Yana Weinstein at the Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) says to take it "with a grain of salt", and the discussion under De Bruyckere's post cites Fergusson & Heene (2012) directly. So treat the numbers above as bias-prone estimates, not fixed values.

That table now gets cited everywhere. But the ground under it has shifted three times in the past decade, and almost nobody writing about this has kept up.

**First, heterogeneity matters more than the mean.** [Rowland's](https://doi.org/10.1037/a0037559) g = 0.50 sits on top of I² = 84.35 — most of the variation between studies is real situational difference, not sampling error. "Average 0.5" does not mean "you will get 0.5".

**Second, newer and more tightly specified estimates land lower.** In March 2026, Dietrichson and colleagues published [a large systematic review](https://edworkingpapers.com/ai26-1418): 102,451 records screened, 87 studies meeting inclusion criteria, 59 in the data synthesis. Where the control group received no practice test at all, the weighted effects were 0.22 (95% CI [0.09, 0.34]) for between-subject designs and 0.46 ([0.29, 0.62]) for within-subject designs. The authors do write that these "seem smaller than those found in earlier reviews" — Adesope's corresponding figures were 0.64 in primary and 0.83 in secondary school.

**But that line has to be read with its caveats**, or I am overselling it on the authors' behalf. The same passage notes that inclusion criteria and analytic strategies differ across reviews, so "the magnitudes were more difficult to compare"; and the authors do not regard their own effects as small — measured against [Kraft's (2020)](https://doi.org/10.3102/0013189X20912798) benchmarks, anything above 0.2 counts as large in education research. The honest phrasing is "newer estimates land lower", not "the effect has been overturned".

Their exploratory analysis adds one more finding: **practice tests seemed less effective when the learning material was complex.**

**Third, complex material is an unfinished fight.** [van Gog and Sweller's 2015 title](https://link.springer.com/article/10.1007/s10648-015-9310-x) is the argument — "the testing effect decreases or even disappears as the complexity of learning materials increases". Karpicke and Aue answered the same year with "The testing effect is alive and well with complex materials", and Rawson joined in; the dispute is stuck on the fact that "complexity" resists operationalization. Dietrichson 2026 leans toward the first camp, but this remains **a live, unresolved argument** — anyone declaring a winner should raise your suspicion.

One unreconciled conflict worth flagging: Rowland found feedback amplifies the testing effect, whereas Adesope found retrieval with feedback only slightly better than without — a reading confirmed independently by [the Learning Scientists](https://www.learningscientists.org/blog/2017/2/9-1) and by [Dietrichson et al.'s systematic review](https://edworkingpapers.com/ai26-1418) ("Adesope et al. (2017) found similar effects with and without feedback on practice tests").

**Interleaving, meanwhile, is picky about materials.** [Brunmair and Richter](https://doi.org/10.1037/bul0000209)'s meta-analysis is titled *Similarity matters* for a reason. Across 59 studies and 238 effect sizes, interleaving helped with visual materials like paintings and with mathematical problem types; it showed no advantage for expository texts; and for learning words across conceptual categories it may actively hurt. Treating "interleave everything" as general advice misreads the paper.

## The awkward question: does any of this transfer?

This is the section most write-ups skip, and it is the one that matters most.

The phrase "learning how to learn" has an assumption baked in: that once you have the skills, they carry over. That assumption has been tested. It does not test well.

[Pan and Rickard's 2018 Psychological Bulletin paper](https://doi.org/10.1037/bul0000151) is the first comprehensive meta-analysis of transfer in test-enhanced learning: 192 transfer effect sizes from 122 experiments and 67 articles, N = 10,382, spanning forty years. The headline is d = 0.40 (95% CI [0.31, 0.50]), which sounds fine. Unpack it:

> That transfer of learning is greatest across test formats, to application and inference questions, to problems involving medical diagnoses, and to mediator and related word cues; it is weakest to rearranged stimulus-response items, to untested materials seen during initial study, and to problems involving worked examples. Moderator analyses further indicated that **response congruency and elaborated retrieval practice, as well as initial test performance, strongly influence the likelihood of positive transfer.**

And the sentence that follows it: after correcting for publication bias with PET-PEESE and selection methods, "the intercept predictions were substantially reduced, **often indicating no positive transfer when none of the aforementioned moderators are present**". The body of the paper is blunter still — the publication-bias test is highly significant (p < .0001), and "the intercept, representing the estimated effect size when neither moderator effect is present, is effectively zero."

Two sets of numbers need keeping apart here, because they come from different analyses. **Random-effects model**: d = 0.28 with no response congruency, plus 0.30 when it is present, for 0.58. **After publication-bias correction (PEESE)**: the intercept is effectively zero, congruency adds 0.36 and elaborated retrieval practice adds 0.18. Both point the same way — a large share of "transfer" is really the practice questions and the test questions sharing answers.

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

The honest reading: **the evidence is not zero, but it is nowhere near enough to redesign teaching around.** That is not just my call — it is [the paper's own conclusion](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1428732/full). The authors benchmark their g = 0.31 against the plain modality effect (g = 0.70), note I² = 91.17, and weigh the teacher time required against the risk of essentializing students into categories. They still do not recommend adopting it.

**Growth mindset is the third case of the same disease.** [Sisk et al.'s two 2018 meta-analyses in Psychological Science](https://englelab.gatech.edu/articles/2018/Sisk,%20Burgoyne%20et%20al.%20(2018)%20-%20Mindset%20and%20Academic%20Achievement.pdf) remain the most thorough test: the correlation between mindset and achievement is r ≈ 0.10 across 129 studies (N = 365,915), about 1% of the variance; mindset interventions move achievement by d = 0.08 across 43 studies (N = 57,155). More awkwardly, **interventions whose manipulation checks succeeded — the ones that demonstrably changed students' mindsets — showed no significant effect on achievement.** Dweck and Yeager [responded in 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535), arguing that Sisk's I² of 96.29% means the effects are real but heavily person- and context-dependent, and that low-SES and academically at-risk students do benefit (a point Sisk et al. concede). Both sides agree the effect is small and heterogeneous. They disagree about whether that makes it important.

The shared structure across all three is worth memorizing: **too intuitively plausible, spreading far faster than it was verified, and an effect size small enough that it takes a meta-analysis to see.** Discount the next educational claim that fits all three.

## The 10,000 hours fight is about definitions, not numbers

[Macnamara, Hambrick and Oswald's 2014 meta-analysis](https://hhs.purdue.edu/skill-learning-and-performance-lab/wp-content/uploads/sites/43/2024/08/macnamara-et-al-2014-deliberate-practice-and-performance-in-music-games-sports-education-and-professions-a-meta-analysis.pdf) is routinely used to dismiss the 10,000-hour rule. It found deliberate practice explained 26% of performance variance in games, 21% in music, 18% in sports, 4% in education, and under 1% in professions (the last at r = .05, p = .62, not statistically significant).

One thing almost nobody mentions — and that **should not be overstated**: the paper carries a 2018 [corrigendum](https://doi.org/10.1177/0956797618769891). The main model's average correlation was revised from r = .35 (95% CI [.30, .39]) to .38 ([.33, .42]), with overall variance explained revised upward from 12%. But the authors are explicit in that notice: reanalysing with Cheung and Chan's approach produced "no practical effect on the results", and the changes "had no impact whatsoever on the substance of our findings and conclusions". The corrigendum table covers the main model; the per-domain percentages above come from the article body. Worth knowing so you cite the corrected figures — not a reason to discount the paper.

The Ericsson camp's [rebuttal](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2019.02396/full) carries weight too: on a re-screened set they get r = 0.54, roughly 29% of variance, and argue many studies Macnamara included never used Ericsson's original definition of deliberate practice — one counted hours nursing students spent in lectures and seminars as practice. [Harwell and Southwick (2021)](https://yale.cloud-cme.com/assets/YALE/pdf/Harwell_Southwick%20beyond%2010,000%20hours%20copy.pdf) add that across 708 meta-analytic correlations in social and personality psychology the average variance explained is 3–4%, so treating "under 50%" as failure is an unreasonable bar.

The two sets of numbers are not comparable because they measure different things. The takeaway that survives: practice volume matters but is far from everything, and **the more structured and predictable the domain (instrument, running), the more practice explains; the more open-ended the domain (professional work), the less.** The uncomfortable implication for engineers is that software work sits in that last column.

## Overall

If you take one thing: **the course's value is not its neuroscience, it is that it turns "don't trust your own sense of fluency" into a repeatable daily process.**

The concrete trade-offs:

- **Just do these**: replace rereading with self-testing; spread review out over time. These are the only two high-utility entries and several meta-analyses back them — but revise your expected effect downward (the 2026 systematic review says 0.22–0.46, not 0.5–0.7), and expect less as material gets more complex.
- **Make practice look like the target**: transfer is not free. Response congruency is the dominant moderator, and practising factual questions to pass higher-order ones is equivalent to not practising. If you want transfer, design the practice to resemble what you actually intend to do.
- **Depends**: interleaving — good for visual materials and math problem types, bad for expository text and vocabulary.
- **Discard**: the learning pyramid's percentages, VAK matching, and high expectations of growth-mindset interventions (d = 0.08).
- **Keep as metaphor**: focused/diffuse mode, and the Pomodoro Technique. Keep the behaviour, drop the neural claim before arguing it with anyone.

One limitation worth carrying: this field's reviews almost all use retention as the outcome, with far thinner evidence for creativity, judgment, or transfer.

What happens to these principles once LLMs arrive — and why the most-cited piece of evidence in AI education was retracted in April 2026 — is [part 2](/posts/learning/2026-08-04-generative-ai-and-learning-en).

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

