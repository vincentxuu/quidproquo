---
title: "How Much of the Spacing Effect Survives in Real Courses: Classroom Meta-Analyses, Rereading a Week Later, STEM Course Experiments, and Personalized Scheduling"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, spaced-repetition, retrieval-practice, self-learning, course-guide, blog]
lang: en
description: "Research on what happens to distributed practice when it moves from the lab into real courses: a meta-analysis of spaced retrieval in the lab, two meta-analyses of classroom studies and of mathematics material, experiments on rereading a week later and in a primary school, spaced quizzes in nine university STEM courses, a semester of personalized review scheduling, spaced online education for health professionals, and observational data on MOOC learners who spaced their own study, followed by what it means for people who write articles."
tldr: "Spreading practice across days shows an effect of about d = 0.54 in a meta-analysis of real classroom studies, which its authors consider smaller than a meta-analysis that mixed in lab studies. Spacing embedded in mathematics courses (which also involves interleaving) is g = 0.24, and when eight university STEM courses used the same procedure, the gain averaged only 1.5 percentage points, with no detectable difference. Rereading a week later showed no detectable advantage a week after that, and none of the studies in that classroom meta-analysis let learners decide for themselves whether to come back and review."
series:
  name: "Writing Articles That Teach"
  order: 16
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-spaced-practice-in-real-courses)

This is part 16 of the series "Writing Articles That Teach," and the first post in its fourth section, "after some time has passed." The first three sections were all about the moment of reading: what goes on the page, what readers are asked to do, and what readers bring with them. This section is about what readers still have days or weeks after they finish.

The trigger was this site's own writing. The site's [Learning How to Learn](/posts/learning/2026-08-04-learning-how-to-learn-en) post marks "distributed practice" as an evidence-backed method and recommends coming back to the same material at least a day later. It cites a result that still held when retested outside the lab with large amounts of data. But the course guides this site writes are single posts that readers arrive at from search and read in one sitting, and the course-guide spec (`course-guide-contract.md`) has no rule about returning to something after a gap. The only part of the site with a review schedule is the English speaking practice page; the articles themselves have none. So this post answers two questions: how much of the spacing effect, which is very stable in the lab, survives in real courses; and what an author who cannot control when readers come back can take from this research.

The next post looks at what works that build review directly into the text, such as Quantum Country, have published; whether readers follow a series in order and whether they come back are topics of later posts. The previous post, [Do Readers Know Whether They Understood?](/posts/learning/2026-10-14-metacomprehension-in-teaching-articles-en), covered how producing something after reading everything makes judgments more accurate. This post is about gaps of several days, not the few minutes right after reading.

**How the sources were chosen, and their biases.** I first scanned the literature, then picked 11 papers to read closely. The criteria were that every conclusion the article puts a number on needs a source that can be read from start to finish, and that the set has to include studies with opposite or null results. Ten were usable. Three are meta-analyses: one of spaced retrieval, mostly in the lab; one of real classrooms only; one of mathematics material only. Four are classroom studies: a rereading experiment with German seventh graders, a quasi-experiment in an Italian primary school, a study of nine STEM courses at one university, and the original paper for the calculus course among them. The other three are a semester-long experiment with personalized review scheduling, a systematic review of spaced online education for health professionals, and an observational dataset from a MOOC. Another experiment on spaced education for medical students (Kerfoot et al. 2007) has no legally public full text that I could read, so I do not cite its results. The biases: English-language literature, schools in the US and Europe, tests made mostly of multiple-choice or literal questions, and follow-up periods mostly no longer than a month or so.

## The conclusions first

| Question | Evidence | Strength |
|---|---|---|
| How big is the lab baseline? | Spaced retrieval vs. massed retrieval: [g = 1.01, 0.74 after correcting for publication bias](https://doi.org/10.1007/s10648-020-09572-8); most comparisons tested within ten minutes of practice | Moderate to strong; almost entirely adults in the lab with paired-associate material |
| How much survives in real classrooms? | A meta-analysis of applied classroom studies only: [d = 0.54](https://doi.org/10.3390/bs15060771), against massed practice with equal time; very large differences between studies | Moderate; no risk-of-bias assessment, longest follow-up 42 days |
| What about inside mathematics courses? | Spacing embedded in a course (which also involves interleaving) [g = 0.24](https://doi.org/10.1007/s10648-025-10035-1); the difference from 0.43 for material taught separately outside a course was not significant | Moderate; all 17 studies in the US |
| Eight STEM courses at one university using the same procedure | In the primary analysis, [none of the eight was significant](https://doi.org/10.1186/s40594-024-00468-5); pooled gain of 1.5 percentage points, confidence interval crossing zero; significant, at about 2 points, only after adding the previously published calculus course | Moderate; mostly multiple choice, feedback only right or wrong |
| Is rereading a week later better than rereading right away? | Seventh graders reading a biology text: tested right away, immediate rereading was better; a week later, [no detectable difference](https://doi.org/10.3389/fpsyg.2018.02517) | Moderate; preregistered, 26–45 per cell |
| Should intervals expand? | Expanding vs. equal intervals g = 0.034, no detectable difference | Moderate to strong; mostly lab |
| When readers decide for themselves whether to space | None of the studies in the classroom meta-analysis let learners choose; in a MOOC, units read in more sessions had slightly higher quiz scores, a correlation | Weak |

"Strength" describes the evidence itself, not whether these numbers would show up unchanged in a web article; I found no study that measured spacing effects on readers of teaching articles.

## First: what "massed" and "spaced" mean in these studies

The same word means very different things in different studies; reading them together without noticing makes the numbers look contradictory.

| Study | What "massed" is | What "spaced" is |
|---|---|---|
| Latimier et al. 2021 | The same item retrieved consecutively, with no other item in between | Other items inserted between retrievals of the same item, mostly within one session |
| Mawson and Kang 2025 | The same amount of time concentrated in one session | Gaps of at least 1 day |
| Murray et al. 2025 | Mathematics practice in one session | Spread over several sessions; when embedded in a course, also interleaved |
| Greving and Richter 2019 | Reread immediately after the first reading | Reread a week later |
| Franzoi et al. 2025 | Second study session 1 day later | Second study session 4 days later |
| Lyle et al. 2022, Bego et al. 2024 | The 3 questions for a learning objective in the same quiz | The 3 questions spread over three consecutive quizzes, two weeks apart |
| Lindsey et al. 2014 | Review only the current week's chapter (actually spanning at least 6 days) | Review earlier chapters |
| Carvalho et al. 2020 | No assignment; "spacing" is how many sessions a unit was read in | Same as left |

Greving and Richter put it bluntly in their discussion:

> All of this implies that the pure spacing effect as defined by Cepeda et al. (2006) does not occur outside the laboratory.

The authors' reasoning is that real teaching never repeats the same thing back to back; even "reread immediately" puts other sentences between each sentence's two readings. This is an argument in the authors' discussion, not a result of the experiment. Mawson and Kang make the same point: real classrooms usually cover a unit intensively over a few days rather than in one massed session, so they suggest future studies use a 1-day gap as the comparison. The "massed" schedule in Lindsey et al. spans at least 6 days, and the authors themselves use this to explain why it differed little from the generic spaced schedule.

So once these studies leave the lab, what they mostly compare is "a longer gap or a shorter one," not "a gap or no gap."

## The lab baseline

The [2021 meta-analysis](https://doi.org/10.1007/s10648-020-09572-8) by Alice Latimier, Hugo Peyre, and Franck Ramus (I read [the published version on the corresponding author's lab page](http://www.lscp.net/persons/ramus/docs/EPR20.pdf)) compares two kinds of **retrieval practice**: retrieving the same item spaced out, against retrieving the same item consecutively. Both require recalling the answer; the only difference is whether other items come in between.

Across 11 studies and 39 comparisons, the pooled effect is g = 1.01. The test for funnel-plot asymmetry was significant, the authors concluded there was publication bias, and after correcting with trim-and-fill (adding the studies estimated to be missing) the effect is 0.74, which the authors say remains "substantial." The abstract reports only 0.74 and does not say it is a corrected value.

This number describes the effect in the lab: 34 of the 39 comparisons were in the lab, and 31 used paired-associate material (one cue paired with one answer); 23 tested within ten minutes of practice, and only 5 had a retention interval of a week or more. There are only two classroom studies, and setting was not included as a moderator, so this analysis cannot answer whether the effect is smaller in classrooms.

The analysis's second question is more useful for scheduling: should the gaps grow (expanding) or stay fixed (equal)? Across 16 studies and 54 comparisons, pooled g = 0.034, the confidence interval crosses zero, and the studies barely differ from each other. The authors conclude that "the expanding schedule did not seem consistently superior to the uniform schedule." But 13 of those 16 studies were in the lab, and almost all participants were adults. In most comparisons, the first retrieval in the expanding schedule came right after study, while the equal schedule delayed it, so the two schedules differed in more than how the gaps were arranged. The authors also point out that schedules adjusted to individual performance may matter more than fixed expanding or equal schedules; this analysis did not examine them.

## In real classrooms: a meta-analysis of applied studies only

The [2025 meta-analysis](https://doi.org/10.3390/bs15060771) by Rhys Mawson and Sean Kang (open-access published version from MDPI; I read the [full text on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12189222/)) had strict inclusion criteria: done in a classroom, with material related to the course, gaps of at least 1 day, and a comparison group doing massed practice for the same amount of study time. Lab and simulated-classroom studies were excluded. The result was 22 reports and 31 effect sizes, mostly from US primary and secondary schools; university settings contributed only 4 effect sizes.

The pooled effect is d = 0.54, which is significant. The authors cite 0.85 from Donoghue and Hattie 2021 as a comparison and say the gap is likely because that analysis mixed lab and applied studies (Mawson and Kang cite that number; I did not read that analysis).

The 0.54 has to be read together with several conditions:

- **The comparison is massed practice with equal time**, not ordinary teaching. Studies that used ordinary teaching as the comparison were excluded.
- **It measures retention, not transfer.** For the two studies that had transfer scores, the authors entered only retention scores; the longest retention interval was 42 days.
- **Studies differ enormously** (I² about 92%). Counting from the forest plot, I find that 16 of the 31 effect sizes have confidence intervals crossing zero.
- **The funnel-plot asymmetry is significant.** The authors judged it to be "small study bias" rather than publication bias and did not correct for it; the data include an extreme value of d = 3.11, and no sensitivity analysis removed it.
- **There is no risk-of-bias assessment**, on the grounds that applied studies prioritize ecological validity; data extraction was done by one person.
- **In some mathematics studies, the spaced group was also doing interleaved practice**, which the authors list as a limitation.

Differences between subject areas were tested and were **not significant**. The only area with a negative point estimate is reading (−0.11, from just two effect sizes). The abstract says effects were larger at higher education levels, with longer retention intervals, and with fewer repetitions; the body states that all of these are qualitative descriptions from the figures, with no statistical test, and university classrooms contributed only 4 effect sizes.

The sentence most relevant to this post is in section 3.5:

> None of the included studies gave learners the option to practice materials in a distributed fashion without requiring it, a necessary consequence of experimental studies in which procedures are pre-determined and adherence is expected.

The authors say this follows necessarily from experimental research and is not a finding. What it shows is that in this body of evidence, the spacing was always arranged by a teacher or researcher and carried out by students. Readers deciding for themselves whether to come back and review is exactly the situation an article's author faces, and these studies have no data on it.

## Mathematics: outside and inside courses

The [2025 meta-analysis](https://doi.org/10.1007/s10648-025-10035-1) by Ewan Murray, Aidan Horner, and Silke Göbel (I read [the published version on coauthor Horner's website](http://aidanhorner.org/papers/Murrayetal_EdPsychReview_2025.pdf)) covers only mathematics material. It was preregistered and included both lab and classroom studies. Across all 27 studies of spaced vs. massed practice, pooled g = 0.28.

The authors split them into two groups:

- **Isolated learning:** one or two procedures taught outside a course, with the same retention interval for every item, the same design as traditional verbal-learning experiments. 10 studies, g = 0.43.
- **Course-embedded:** spacing scheduled into a course in progress. 17 studies, g = 0.24, all in the US, with 65% of the effect sizes from universities.

The difference between the two was not significant (p = .0952), yet the abstract describes isolated learning as "larger." The course-embedded studies have a further problem that the authors themselves point out:

> these course-embedded studies provide a less pure measure of spacing, as interleaving, mixing practice of different topics and skills, is also involved.

In other words, the 0.24 inside courses is "spacing plus interleaving" against massed practice, not pure spacing. The evidence on interleaving itself is the topic of a later post. The publication-bias test for course-embedded studies was also significant, but in the direction of large effects being underreported; after trim-and-fill the estimate actually rises slightly, to 0.27. Counting from the forest plot, I find that 14 of the 26 effect sizes have confidence intervals crossing zero.

Murray et al.'s second question is retrieval practice vs. restudy in mathematics. Seven studies, g = 0.18, with a confidence interval that crosses zero no matter which study is removed. The authors word their conclusion carefully: they cannot say whether there is or is not a robust testing effect, and "there is insufficient evidence to suggest that retrieval practice is not a useful pedagogical tool for mathematics learning." The third question they set out to answer (spaced vs. massed retrieval in mathematics) was not analyzed because there were too few studies.

## Semester-long classroom experiments: calculus and eight other STEM courses

The two meta-analyses above each pooled many small studies. A group of researchers at the University of Louisville used one procedure in several courses during the same semester, which shows how much of one design survives when the course changes.

**Calculus.** Keith Lyle and colleagues' [2022 paper](https://doi.org/10.1007/s10648-022-09677-2) (web version of the open-access published article on Springer) ran a within-participants experiment in an engineering calculus course in fall 2020. For each of 180 students, half the learning objectives had their 3 questions in a single quiz, and the other half had the 3 questions spread over three consecutive quizzes, two weeks apart; the number of questions was the same. The results had two sides:

- **During practice, spaced objectives did worse**, but only on the first two questions (first question 0.74 vs. 0.80); the third question showed no detectable difference.
- **On a 24-question test in the last class of the semester, spaced objectives did better:** 0.77 vs. 0.71, g = 0.32.

The authors' explanation for the weaker practice performance is not that a longer gap made recall harder: in both conditions, the time from class to the first question was the same. The authors' account is that the three massed questions were in the same quiz, so students could go back and revise the first question after working on the later two; the authors state explicitly, "This is distinct from the idea that spacing makes retrieval more effortful."

One thing I noticed from the schedule table, which the paper does not discuss: the three massed questions for an objective all sat in a single quiz, held in week 3, 5, or 7 depending on which group the objective belonged to; for spaced objectives in the same group, the last question came in week 7, 9, or 11 respectively; and the test was in week 15. The last practice for spaced objectives was 4 weeks closer to the test, so within the 6-point gap at the end, "spacing" and "last practice closer to the test" cannot be separated.

**Eight other courses.** Campbell Bego and colleagues' [2024 paper](https://doi.org/10.1186/s40594-024-00468-5) (web and table pages of the open-access published article) used the same design in eight other introductory university courses during the same semester: chemical engineering thermodynamics, chemistry for health professionals, two biology courses, introductory physics, general chemistry, research methods in psychology, and statistics for psychology, with 578 students in total. The results:

- **In the preregistered primary analysis, none of the eight courses was significant.** Five leaned toward spacing and three toward massing.
- After removing items with very high accuracy or very low reliability, one course, chemistry for health professionals, became significant.
- Pooled across the eight, spacing beat massing by **1.5 percentage points**, with a 95% confidence interval of −0.18 to 3.26, no detectable difference.
- Adding the calculus course's data made the pooled result significant, about 2.06 percentage points, with a lower confidence limit of 0.16; the authors themselves say the lower limit was "not far above zero."
- The calculus pattern of "worse during practice, better at the end" was not reproduced in any of the other eight courses; spacing made practice worse in only one.

The authors conclude that "The proverbial glass is neither full nor empty": saying spacing works in every STEM course, or in none, oversimplifies. They offer several possible reasons, none tested with data: most courses relied on multiple-choice questions; feedback was only right or wrong, did not show the correct answer after a wrong one, and was not required viewing; quizzes were unproctored; and the same learning objectives also appeared in homework and regular exams, so students may have practiced them separately. The calculus course, by contrast, used mostly fill-in answers and gave fuller feedback.

In addition, the issue from the calculus course, "the last spaced practice is closer to the test," applies to these eight courses as well, since they used the same schedule; I worked this out from the schedule table, and the paper does not discuss it.

This is the closest evidence in this post to "an author builds spacing into their own material; does it still work in another subject?" The answer: the same procedure worked in one course and showed no detectable effect across the other eight combined.

## Coming back after a gap: rereading and answering questions

The two kinds of "review" easiest for an article's author to add are asking readers to go back and reread, and giving them questions. The two produced different results in the two studies below.

**Rereading a week later.** Carla Greving and Tobias Richter's [2019 experiment](https://doi.org/10.3389/fpsyg.2018.02517) (open-access published version from Frontiers) was preregistered and run in 8 seventh-grade classes in Germany. Students read an expository text of about 977 words on bacterial cells; half reread it immediately, half reread it a week later, and within each group half were tested a few minutes after rereading and half a week later. 145 students remained in the analysis.

- **Tested a few minutes after rereading:** the immediate-rereading group recalled more (3.86 vs. 2.56 concepts) and also did better on comprehension questions.
- **Tested a week later:** no detectable difference between the groups (recall 1.79 vs. 2.34, numerically slightly higher for rereading a week later). The authors' own summary: "the benefit of distributed rereading at the longer retention interval predicted in Hypothesis 1 did not occur."
- The immediate-rereading group dropped clearly from a few minutes to a week; the week-later group showed no significant drop. The abstract says the week-later group "showed no forgetting"; the body reports a drop that was not significant, and that cell had only 26 students left.
- An exploratory result: on short-answer questions, students with low prior knowledge did worse when rereading a week later; the authors call it "a hint," and it did not appear for recall or multiple-choice questions.
- Students who reread a week later predicted they had learned less, and also rated themselves as less focused. The latter went in the opposite direction from the authors' prior hypothesis.

The scope needs to be stated clearly: seventh graders, one expository biology text, rereading rather than retrieval, a one-week gap between readings and a one-week retention interval, and comprehension questions that were all literal. The authors speculate that an effect might emerge with a longer retention interval; that is speculation, with no data.

**Questions vs. rereading, and a 1-day vs. 4-day gap.** Laura Franzoi and colleagues' [2025 study](https://doi.org/10.3389/fpsyg.2025.1632206) ([open-access published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12372469/)) was run in two fifth-grade classes at an Italian primary school, 33 students in total, using existing classes rather than random assignment. Students read ancient-history texts and then had a second study session: rereading, or fill-in-the-blank questions with self-correction, redone until all were correct. A short-answer test followed 7 days later.

- **With the same 1-day gap, the class that did fill-in questions scored 67.7% on the final test and the class that reread scored 41.3%**, a significant difference. This compares two classes, without switching conditions.
- **With both classes doing fill-in questions, a 1-day vs. 4-day gap showed no detectable difference** (44.6% vs. 45.9%), with only 25 students; the paper does not report the exact test statistics, and this phase used the hardest text in the series.
- Comparing the questions in its supplement, I saw that the facts asked on the final short-answer test overlap heavily with the facts filled in on the fill-in questions, so the question group had effectively practiced the final test's content and seen the correct answers; the paper does not discuss this.

This study has **no massed condition**; its shortest gap is already one day. The title says "whether distributed or not," but the "rereading plus 4-day gap" cell was never run. What it can show is one small case: in a primary-school classroom, fill-in tests with feedback beat rereading; stretching the gap from 1 day to 4 showed no benefit.

## Handing the schedule to software: a semester of personalized review

The [2014 experiment](https://doi.org/10.1177/0956797613504302) by Robert Lindsey, Jeffery Shroyer, Harold Pashler, and Michael Mozer (I read [the published version and supplementary materials on author Mozer's personal page](https://home.cs.colorado.edu/~mozer/Research/Selected%20Publications/reprints/LindseyShroyerPashlerMozer2014Published.pdf)) is an example of building a schedule into course software. At a US middle school, 179 eighth graders in 6 classes taught by the same teacher studied Spanish vocabulary for a semester. They practiced with flashcard software in class, and each student's items in each chapter were randomly split into three parts, one for each review schedule:

- Review only the current chapter (which the authors call massed, matching students' own habit when they choose);
- Review the previous chapter (roughly once a week);
- Use a model to estimate each student's current probability of recalling each item and present the one closest to a threshold, from any earlier chapter (personalized).

All three schedules got the same number of reviews. There was an exam at the end of the semester and another after a 28-day winter break, with no access to the software in between.

On the post-break exam, personalized items scored 16.5% higher than current-chapter-only items and 10.0% higher than previous-chapter items. Judging by eye from the bars in Fig. 2a, these percentages are relative increases, not percentage points; the paper does not say, and this is my reading. Among students who took both exams, only 13.5% scored better on current-chapter-only items than on personalized items.

Three things change how this result should be read:

- **The end-of-chapter quizzes were highest for current-chapter-only review** (89.4% vs. 87.2% and 88.1%). The same data show massed review ahead on the immediate test and spaced review ahead on the delayed one.
- **Personalization cannot be separated from "reviews spread further apart."** The authors write: "We acknowledge that our design confounded personalization and the coarse temporal distribution of review (Fig. 1, Table 1)." The personalized schedule's average gap between reviews was 4.70 days; the previous-chapter schedule's was 1.69 days. So one cannot say personalization by itself produced the 10%.
- **It needed a lot:** timestamps for every answer from every student in the class, plus a server that kept rerunning the model; by the end of the semester one round of inference took half an hour, and the back end crashed at least three times. The review was scheduled by the teacher during class time, about 30 minutes a week and about a tenth of course time, so students did not have to decide whether to come back.

The paper calls the gap between current-chapter-only and previous-chapter review "small" and does not test it separately; the authors explain it by noting that current-chapter-only review also spanned at least 6 days.

## Spacing delivered to learners: online education for health professionals

Another approach is for the author to build spacing into the content and then actively deliver it to learners. The [2024 systematic review](https://doi.org/10.2196/57760) by Laura Martinengo and colleagues ([open-access published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11502984/)) covers spaced digital education for health professionals: 23 studies with 3,371 participants, mostly practicing health professionals, with the US the most common setting. Seventeen were spaced online education, 10 of them by email; in 15, each module was a case or short unit with multiple-choice questions, followed by the answer and an explanation.

- **Knowledge right after the intervention, against massed digital education:** 9 studies, pooled SMD = 0.32, rated moderate by GRADE. Of the nine, five have negative lower confidence limits and another is −0.00.
- **Against no intervention:** 3 studies, no detectable difference.
- **Knowledge retention:** only 2 studies with 207 people, pooled 0.38, rated low by GRADE; the one with a 3-month follow-up was not significant on its own, and the pooled value rests mainly on the one with a 2-year follow-up.

The review's main analysis uses scores **right after** the intervention, not retention. In addition, I saw in its table of study characteristics that among comparisons classed as "spaced vs. massed," some control groups simply continued the usual curriculum without receiving an extra set of content; and most interventions delivered "spacing plus questions" together, so the estimate is for the whole package, not spacing itself. The review does not discuss either point. One study recorded a negative experience: surgical faculty were dissatisfied with weekly emails of teaching tips, because the content was vague and generic and added to an already heavy daily load of email.

Kerfoot et al.'s 2007 experiment on spaced education for medical students exists, but I could not read a legally public full text, so I do not cite its results. The study labeled "Kerfoot 2007" in this review's forest plot is a different study by the same author, on urology residents, not that one.

## When readers decide for themselves

In every study above, someone else set the spacing. The [2020 study](https://doi.org/10.1038/s41539-020-0061-1) by Paulo Carvalho, Faria Sana, and Veronica Yan ([open-access published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7076029/)) looks at learners' own choices: it analyzes system logs from an introductory psychology course on Coursera, with no assignment of any kind.

The authors define "spacing" as the number of sessions a learner took to finish a unit, not how long the gap between sessions was. Within the same student, units read over more sessions had slightly higher quiz scores (standardized coefficient 0.10). This result has to be read with four things:

- **It is a correlation.** The authors themselves say they cannot rule out third variables such as motivation or life events.
- **Only the 747 completers are included**, 13% of the 5,615 who agreed to share their data; and there are logs only for the online textbook, none for video watching.
- **Most records were tested right after reading:** the median time from the last reading to starting the quiz was 26 minutes.
- **Once the number of practice activities completed in the unit enters the model, the number of sessions is no longer significant** (p = .070). This row appears only in the supplementary table; the main text does not mention it.

So what these data can show is that among completers, reading in more sessions has a small positive correlation with quiz scores, tied up with how much practice they did. They cannot show that readers who space on their own learn better.

## Where the sources disagree

**The same study, handled in opposite ways by two meta-analyses.** Mawson and Kang include Yazdani and Zebrowski's 2006 study with d = 3.11 (the largest effect in the analysis, with no sensitivity analysis removing it); Murray et al. exclude it because they could not extract means, standard deviations, or sample sizes. For Hopkins et al.'s 2016 study, Latimier et al. compute one comparison as g = 2.10, while Murray et al.'s forest plot gives 0.59 and 0.23 for the same study. I do not know why.

**Whether the effects of retrieval and spacing add up.** When Murray et al. cite Latimier et al., they write that "Latimier et al.’s (2021) previous meta-analysis suggested that the effect of spacing and testing is additive and is typically a large effect (g = 1.01, 95% CI [0.68, 1.34])"; Murray et al. read it as showing that the two add up. Latimier et al.'s own wording is that a schematic combining their numbers with others' "is consistent with the hypothesis that their effects are simply additive," but that their data "do not allow us to test directly"; and 1.01 is the uncorrected value, while their abstract reports the corrected 0.74.

**Whether spacing makes practice worse at the time.** Lyle et al.'s calculus course: spaced did worse on the first two questions. Bego et al.'s eight other courses: spaced did worse in only one, and after filtering, another went the opposite way. Lindsey et al.'s end-of-chapter quizzes: current-chapter-only review was highest. Greving and Richter: tested a few minutes after rereading, immediate rereading was better. These four studies measure "at the time" differently (the same quiz, the chapter quiz, a few minutes later), and Lyle et al.'s explanation is not "harder to recall," so they cannot be merged into the single claim that spacing makes things harder at the time.

**Whether the spacing effect in mathematics is large or small.** Mawson and Kang's results section says spacing "appears generally effective" in mathematics, their discussion says that effects from mathematics studies "tended to be smaller and more frequently non-significant," and their conclusion again emphasizes the benefit for mathematics and for secondary schools; their test of differences between subject areas was not significant. Murray et al. say the spacing effect in mathematics "may be smaller than in other domains," based on comparing numbers with other meta-analyses, without a test.

**Whether this STEM study counts as working or not.** Bego et al.'s abstract says they found significant positive effects in two courses, of which chemistry for health professionals was significant only after item filtering and calculus was previously published data; the authors' conclusion in the body is "unclear." Both are the authors' own statements, so a citation needs to say which analysis it refers to.

## What this means for people who write articles

The five points below are this site's judgments; each states its basis and its distance from the evidence.

1. **When you write about "spaced repetition," use classroom numbers and include the comparison condition.** How: instead of "spaced repetition has a large effect," write "a meta-analysis of real classrooms only found that distributed practice beat massed practice with equal time by about d = 0.54, with large differences between studies; when eight STEM courses at one university used the same procedure, the gain averaged only 1.5 percentage points, with no detectable difference." Basis: Latimier et al.'s lab baseline (1.01, 0.74 after correction), Mawson and Kang's classroom number (0.54), Murray et al.'s in-course number (0.24), and Bego et al.'s eight courses measure different settings. Distance: these are all still school classrooms, not people reading articles.

2. **In the next post of a series, open with one or two questions that ask readers to recall the previous post, with the answers hidden.** How: for example, open the week-three course guide with "First, recall last week: why does minimax assume the opponent always picks the move best for itself? Answer before expanding," with the answer in a collapsible block (the example is mine and untested). This is the cheapest "answer again after a gap" I can think of: readers are coming to read the next post anyway, with no account and no email. The basis is thin, and it is a cross-study comparison. Lyle et al. and Lindsey et al. compare spaced vs. massed answering of questions, Greving and Richter compare spaced vs. massed rereading, and only Franzoi et al. directly compare answering questions with rereading (both with a 1-day gap, comparing two classes). The comparison conditions, grade levels, and test delays all differ, so stitching them into "answering questions after a gap helps, rereading does not" is my inference. Evidence in the other direction exists too: Bego et al.'s eight courses also used questions and showed no detectable pooled difference; in Murray et al.'s mathematics analysis, retrieval vs. restudy is not robust; and for Lindsey et al.'s previous-chapter review against current-chapter-only review, the paper calls the difference small and does not test it separately. Answering before seeing the answer rests on the previous post's review of judgment accuracy. So this is a low-cost experiment, not an evidence-based practice; I found no study that tested it in articles, and there is no way to know whether readers reach the next post. Other ways of building review into articles are covered in the next post.

3. **Do not spend engineering effort fine-tuning a spacing schedule.** How: put the review questions in "the next post" and leave it there, without calculating which post should review which; the English speaking practice page's existing schedule does not need changing because of this post. Basis: Latimier et al. found no detectable difference between expanding and equal intervals; Mawson and Kang describe a fixed weekly gap as the most consistent from their figures, but without a test. Lindsey et al.'s personalized schedule beat a fixed previous-chapter review, but it used every answer from the whole class and a server that kept rerunning the model, and its effect cannot be separated from the longer gaps; this site has no such data. Distance: "no need to fine-tune" holds only for authors without answer data.

4. **Tell readers that "feels familiar now" is not the same as "remembered later," but do not promise that "feeling hard now means learning well."** How: when suggesting that readers come back in a few days, write "Rereading right after you finish makes it feel more familiar for now; a week later, one study found no sign of that difference." Basis: in Greving and Richter, immediate rereading was better a few minutes later and showed no detectable difference a week later; in Lindsey et al., current-chapter-only review was highest on end-of-chapter quizzes. The reason not to write "feeling hard is a good sign" is that in Bego et al.'s eight courses, only one showed worse performance during practice, and Lyle et al.'s explanation is not that retrieval became harder.

5. **Do not make "readers will come back to review on their own" a premise of the article.** How: write anything you want readers to do the next day as a step that stands on its own (for example, "Tomorrow before bed, without looking at the article, write down what these three terms mean"), not "come back and review this post later." Basis: none of the classroom studies in Mawson and Kang let learners choose; Carvalho et al.'s observational data are correlational and cover only the 13% who completed; Lindsey et al.'s review was scheduled during class time, and the interventions in Martinengo et al.'s review were actively delivered to learners. An article's author has neither: this site has no channel for notifying readers other than RSS, and no record of page views or return visits (the site records only how often glossary terms are looked up and the content of on-site chat), so there is no way to know whether readers come back. This is my inference.

## This site's practice, compared

| Current state on this site | What this post found | Assessment |
|---|---|---|
| The "distributed practice" section of [Learning How to Learn](/posts/learning/2026-08-04-learning-how-to-learn-en) cites a result retested outside the lab with large amounts of data | About 0.54 when only applied classroom studies are included; 0.24 inside mathematics courses; nothing detected in eight STEM courses | That section does not conflict with the data in this post, but it does not mention that the effect shrinks in classrooms or that rereading a week later showed no detectable advantage a week after that. I propose adding a sentence there linking to this post; that is the site owner's call, and the section should not be rewritten |
| The course-guide spec (`course-guide-contract.md`) has a self-check question per section and a cross-section question at the end | All of these happen while reading; the spec has cross-post bridge links for prerequisites, but no design for practicing again the next day or answering back in a later post | Not covered by the spec, so not a violation. Point 2 in the previous section, review questions, is a low-cost experiment; the evidence is not enough to write into the spec, and this post does not propose changing it |
| The English speaking practice page has a schedule adjusted by learners' self-ratings: the lowest rating comes back after 10 minutes, the middle one after 1 day, the highest after 3, 6, 12, or 24 days depending on consecutive count, capped at 30 days; progress is stored in the browser, with no reminders | A schedule adjusted by self-ratings is closer to the adaptive schedules Latimier et al. say they did not analyze, not a fixed expanding schedule; the effective classroom cases all had someone bringing learners back (class time or active delivery) | These studies have no data that can judge whether it is good or bad, so leave it unchanged. It is an example of "a schedule with no channel to bring people back," the same problem as point 5 |
| Series posts have previous/next navigation | I found no study testing how series navigation affects spacing | No basis for an assessment |

## Limits of this evidence

- **I found no study that tested readers of teaching articles.** Everything comes from school classrooms, course software, MOOCs, or continuing education for health professionals; applying it to a long web article is my inference.
- **Follow-up periods are short.** The longest in Mawson and Kang's studies is 42 days; Lindsey et al.'s second exam was 28 days after the end of the semester; Greving and Richter, and Franzoi et al., go only to a week. For "how much course knowledge remains after a year," the sources I found were only abstracts or unauthorized copies, so I did not use them.
- **The definitions of "spaced" vary**; see the table above. In both Lyle et al. and Bego et al., the last spaced practice was closer to the test, which the papers do not address.
- **Course-embedded mathematics studies also involve interleaving**, as do some mathematics studies in the classroom meta-analysis. The effects of the two cannot be separated.
- **Quality control in the two classroom meta-analyses is limited.** Mawson and Kang have no risk-of-bias assessment and only one extractor; in Murray et al., most screening and extraction were also done by one person, and several numbers are inconsistent within the paper (for example, the overall effect is 0.28 in the results and 0.26 in the discussion). Latimier et al.'s coding was done by one person.
- **Small samples.** Franzoi et al. have 25–27 students per comparison, comparing two classes; Greving and Richter have 26–45 per cell; Bego et al.'s research methods in psychology course had only 30 students, and the authors acknowledge limited power in most courses.
- **Not used because only an abstract or no legal full text was available:** Kerfoot et al.'s (2007) experiment on spaced education for medical students; a 2026 meta-analysis of spaced repetition in medical education; Lyle et al.'s (2020) cross-semester results (Lyle et al. 2022 mentions them in one sentence of its introduction, which this post does not use).
- **Secondhand citations:** Donoghue and Hattie's (2021) 0.85 is cited by Mawson and Kang; Cepeda et al.'s optimal gaps are reported by Greving and Richter. I did not read these original studies.
- **My inferences and observations:** applying the results to article readers; the "review questions in the next post" practice, and the cross-study comparison it rests on; "readers will not come back on their own" holding for this site's readers; Lindsey et al.'s percentages being relative increases (read from the figure); the last spaced practice being 4 weeks closer to the test in Lyle et al. and Bego et al. (from the schedule table); Franzoi et al.'s final test overlapping the fill-in questions (from the supplement); some "massed" control groups in Martinengo et al.'s review actually being the usual curriculum (from the table of study characteristics). Each is marked in the text.
- **Not found:** a randomized experiment in which readers choose whether to answer questions the next day; the effect of rereading a week later for adults reading technical articles; review questions across web articles.

## Appendix: study designs and numbers

The main text keeps one or two numbers per item; the rest is here.

**Latimier, Peyre, Ramus (2021)**, Educational Psychology Review 33(3), published version on the corresponding author's lab page (the first page notes a post-publication correction; I could not find what was corrected).

- Method: robust variance estimation meta-regression; search through September 2017; coding by the first author alone; cut points for categorical moderators set after seeing the data.
- Subset 1 (spaced vs. massed retrieval): 11 studies, 39 comparisons; g = 1.01 (SE 0.15, 95% CI [0.68, 1.34]), I² = 49%; Egger t = 4.41, p < .0001; after trim-and-fill added 10 effect sizes, g = 0.74 ([0.55, 0.91]), I² = 47%. 34 comparisons in the lab, 31 with paired-associate material; retention intervals within 10 minutes 23, 1 day or more 15, a week or more 5. None of seven moderators came close to significance (α = .10), and four of them had fewer than 4 degrees of freedom. Classroom studies were only Hopkins 2016 (g = 0.30 and 2.10) and Dobson 2016 (immediate −0.34, after 1 day 0.94, after 28 days 0.74).
- Subset 2 (expanding vs. equal): 16 studies, 54 comparisons; g = 0.034 (SE 0.06, [−0.10, 0.17]), p = 0.59 in the text and 0.62 in the table; I² = 0%; Egger not significant. 55% of effect sizes positive, 43% negative. With more than 4 exposures g = 0.2 ([−0.07, 0.47]), with 4 or fewer −0.04; moderator effect p = .09, which the authors call tentative. Retention interval had no moderating effect (β = 0.03).
- The abstract's "29 studies" does not match the studies listed in the tables (11 + 16 = 27, 23 unique).

**Mawson and Kang (2025)**, Behavioral Sciences 15(6), published version and supplementary material.

- Inclusion: primary through tertiary students; gaps of at least 1 day; comparison is massed practice with equal study time; in the classroom, with material related to the course; longest retention interval used. Search through June 2023; 25 papers in the review, 22 reports and 31 effect sizes in the analysis.
- Main analysis d = 0.54 ([0.31, 0.77]), I² = 92.13%, Q(30) = 230.33. Three sensitivity analyses: averaging non-independent effect sizes 0.63; excluding unequal or unreported retention intervals 0.51; both 0.57. Egger z = 2.719, p = .007.
- Subject area: Q(8) = 7.56, p = .478. Mathematics 0.46 (15 effect sizes), language 0.91 (5), reading −0.11 ([−0.42, 0.21], 2). The interval for history does not match the single study's numbers, and the paper does not explain it.
- Education level (from figures, no test): primary 12 effect sizes, 4 significant, 3 negative; secondary 14, 7 significant; university 4, 3 significant. Study gap (from figures): fixed 7 days 12, 8 significant; expanding 5, 1 significant.
- Single studies in the supplementary table: Greving and Richter 2019 is 0.27 ([−0.24, 0.78]); Lyle et al. 2022 is 0.34 ([0.13, 0.55]); Foot-Seymour and Wiseheart 2022 had 716 students, retention 0.21, and two transfer scores, −0.07 and −0.01, that were not analyzed.
- Limitations listed by the authors: high heterogeneity; effect sizes all recomputed; only qualitative interpretation of variables; interleaving mixed into some mathematics studies; no conclusions for special populations. There was also no risk-of-bias or certainty assessment.

**Murray, Horner, Göbel (2025)**, Educational Psychology Review 37, published version on a coauthor's website and the publisher's supplementary material.

- Preregistered (OSF), with deviations; 34 studies, 85 effect sizes (spacing 27 studies, 53; retrieval 7 studies, 32); Hedges' g; correlated and hierarchical effects model with robust variance estimation; within-subject correlations assumed to be r = .5 throughout. Two people jointly screened 10% of titles and abstracts (88.6% agreement); the rest by one person.
- Spaced vs. massed: overall g = 0.282 ([0.188, 0.376]); isolated learning 0.427 ([0.179, 0.675]), 0.499 or 0.368 after removing influential points, with the confidence interval still above zero, Egger not significant but the funnel plot looks asymmetric; course-embedded 0.24 ([0.155, 0.324]), Egger t = −2.4, p = .025, 0.27 after trim-and-fill added 6 studies. Difference between the two β = 0.188, p = .0952.
- Course-embedded: all in the US; 65% of effect sizes from universities; 46% of effect sizes not from peer-reviewed journals; 68% used expanding gaps; time from last practice to exam 2 days to 5 weeks.
- Retrieval vs. restudy: g = 0.184 ([−0.069, 0.436]), 7 studies, 32 effect sizes, 12 of them from one study; crossing zero no matter which study is removed.
- All moderator analyses were non-significant and moved to the supplement; most had corrected degrees of freedom below 4.
- Internal inconsistencies: overall effect 0.28 and 0.26; isolated-learning study count 10 and "nine"; retrieval study count 7 and "six studies with 20 effect sizes"; the number after removing Lyle 2022 looks like a typo.

**Greving and Richter (2019)**, Frontiers in Psychology 9, published version.

- Preregistered; 2 × 2 between-subjects (immediate vs. week-later rereading × short vs. one-week test delay); randomized block assignment. 191 seventh graders; 20 excluded for missing a session, another 26 for missing a test, leaving 145 for recall and comprehension (cells of 36, 45, 26, 38).
- Free recall: interaction p = .004 (one-tailed); short delay massed 3.86 vs. spaced 2.56 (p = .004); after a week 1.79 vs. 2.34 (p = .297); drop in the massed group p < .001, in the spaced group p = .666.
- Comprehension (probability correct): interaction p = .026 (one-tailed); short delay 0.47 vs. 0.35 (p = .031); after a week 0.26 vs. 0.30 (p = .455). Low prior knowledge (one standard deviation below the mean) on short-answer questions: spaced 0.10 vs. massed 0.18 (p = .036).
- Reading time: the spaced group read much more slowly the second time (58.75 vs. 21.23 per letter). In the discussion the authors report a decline in reading time on rereading of 74% for massed and 24% for spaced; recomputing from the model estimates, I get about 28% for spaced, and the paper does not say how it was calculated.
- Self-ratings: predicted learning lower for spaced (2.71 vs. 3.04, p = .008); focus higher for massed (3.49 vs. 3.23), opposite to the hypothesis; perceived difficulty not significant (p = .051).
- The short delay is 4 minutes in the abstract and 5 minutes in the body. The authors' forgetting figures of "50% for massed, 10% for spaced" come out to about 54% and 9% from recall, and about 45% and 14% from comprehension.

**Franzoi, Cembrani, Mulatti, Treccani (2025)**, Frontiers in Psychology 16, published version and supplementary material.

- Quasi-experiment in two fifth-grade classes at one Italian primary school (15 and 18 students), with 25–27 analyzed; four ancient-history texts of 590–660 words. Second study session within 30 minutes: rereading, or fill-in questions with answer checking, redone up to three rounds (all reached full accuracy). A 12–16 item short-answer test 7 days after the second session, 10 minutes, mostly literal questions, scored by one rater blind to condition.
- Phases 1 + 2 (classes switched, strategy and gap confounded): test + 4-day gap 67.0% vs. rereading + 1-day gap 48.6%, F(1, 25) = 41.42. Phase 3 (class vs. class): test 67.7% vs. rereading 41.3%, F(1, 24) = 8.2, η² = .254. Phase 4 (class vs. class, both tested): 1-day gap 44.6% vs. 4-day gap 45.9%, F < 1.
- "Rereading + long gap" was never run; how many times the rereading group actually read, and for how long, was not recorded.

**Lyle, Bego, Ralston, Immekus (2022)**, Educational Psychology Review 34, web version of the published article (PDF not obtained).

- Engineering calculus, fall 2020; 235 enrolled, 180 analyzed; hybrid course with recorded lectures. 24 learning objectives, each with 3 algorithmic variants (mostly fill-in); massed means all 3 in the first quiz after the objective was taught, spaced means 1 in each of three consecutive quizzes (two weeks apart). The 5 quizzes were unproctored; the 24-question test in the last class was proctored online. Quizzes and test together were 7% of the semester grade, with bonus credit for completion.
- Quizzes: spaced 0.78 vs. massed 0.81, F(1, 179) = 9.64; question 1 0.74 vs. 0.80 (g = 0.42), question 2 0.78 vs. 0.82 (g = 0.24), question 3 0.82 vs. 0.80 (p = .185).
- End-of-semester test: 0.77 vs. 0.71, t(179) = 4.64, g_av = 0.32; probability that a person scores higher on spaced than on massed objectives 63.5%.
- The authors convert the gap to "one-third to one-half of a letter grade" without stating how; it is a difference in objective-level accuracy, not the semester grade.
- The paper has no limitations section. Massed objectives' last practice was in weeks 3–7, spaced objectives' in weeks 7–11, and the test in week 15 (from the schedule table).

**Bego et al. (2024)**, International Journal of STEM Education 11, web and table pages of the published article (PDF not obtained).

- Eight courses in the same semester, 578 of 910 students analyzed; 24 learning objectives per course, 4 questions per objective; same design as Lyle et al. 2022; biweekly quizzes, unproctored, one attempt; feedback showed only the question, options, and right or wrong, with no correct answer after a wrong one; the final retention test had 1 question per objective, 30 or 34 days after the last quiz. Quizzes and test together were 5–10% of the semester grade.
- Practice quizzes: of the eight, only unity of life had spaced significantly worse (g = 0.35); after filtering, diversity of life had spaced significantly better.
- Final test (full data): g between −0.17 and 0.25 across the eight, none with p < .05. After filtering, chemistry for health professionals p = .011 (g = 0.24).
- Single-paper meta-analyses (percentage-point difference): eight courses, full 1.50 ([−0.18, 3.26]), I² = 87.7%; eight courses, filtered 2.00 ([−0.77, 4.76]); nine courses, full 2.06 ([0.16, 3.97]); nine courses, filtered 2.74 ([0.08, 5.40]).
- The authors' power analysis assumed g = 0.40, requiring 27 students; actual g in every course was within ±0.25. The text says 71 items were filtered out; the table sums to 73.

**Lindsey, Shroyer, Pashler, Mozer (2014)**, Psychological Science 25(3), published version and supplementary materials on an author's personal page.

- 179 eighth graders, 6 classes, one teacher; 221 Spanish vocabulary units across 10 chapters; flashcard software requiring exact spelling and accents. Three in-class practice sessions per chapter, 20–30 minutes each; students could practice more at home. About 8 reviews per item per student under each schedule; average gaps between reviews 0.12, 1.69, and 4.70 days.
- Two cumulative exams (end of semester, 28 days later), each covering half the items per chapter per condition, without feedback. End of semester: personalized 12.4% higher than current-chapter-only and 8.3% higher than previous-chapter; 28 days later, 16.5% and 10.0%. Forgetting over the break 18.1%, 17.1%, 15.7% (not defined, not tested). Main effect of schedule F(2, 328) = 52.3 and F(2, 340) = 55.1.
- The two main t values printed in the published version (1.01, 1.11) do not match the p values and d in the same sentences and look like printing errors; this post does not cite them.
- End-of-chapter quizzes: current-chapter-only 89.4%, previous-chapter 87.2%, personalized 88.1% (156 students). The effect was concentrated in chapters from early in the semester.
- Nearly 600,000 answers were logged over the semester; inference time grew from seconds to half an hour.

**Martinengo et al. (2024)**, Journal of Medical Internet Research 26, published version and supplementary files.

- Search through February 2023; randomized, cluster-randomized, and quasi-randomized trials; crossover designs and gaps under 1 day excluded; 23 studies (22 papers), 3,371 participants; 20 with practicing health professionals; risk of bias low 11, unclear 5, high 7. Main analysis used scores right after the intervention; no publication-bias or subgroup analyses.
- Knowledge, against massed: SMD 0.32 ([0.13, 0.51]), I² = 66%, 9 studies, 1,691 participants. Against no intervention: 0.66 ([−0.21, 1.54]), I² = 92%, 3 studies, 282 participants, GRADE very low.
- Knowledge retention: 0.38 ([0.10, 0.65]), I² = 0%, 2 studies, 207 participants (the 313 in the text is the number allocated); House 2017 at three months 0.46 ([−0.05, 0.98]), Kerfoot 2009 at two years 0.34 ([0.02, 0.67]).
- Behavior change against no intervention 0.63 (2 studies), against massed 0.74 (1 study). The abstract says most studies had unclear or high risk of bias (19, 83%), which does not match the 12 in the table.
- Gap lengths varied widely across studies, and the authors say no study explained its choice.

**Carvalho, Sana, Yan (2020)**, npj Science of Learning 5, published version and supplementary tables.

- Introductory psychology MOOC on Coursera (2013, 12 weeks); 5,615 agreed to share data, 747 completers analyzed. Logs only for the online textbook.
- "Spacing" = number of sessions to finish a unit, mean 4.08 (median 3); the paper does not say how a session was defined. Time from last reading to starting the quiz: mean 45.73 hours, median 26.12 minutes.
- Within the same student across units: sessions on quiz score β = 0.10 (p < .001), controlling for pretest, study time, and retention interval; sessions × retention interval not significant. Study time on quiz score β = −0.03 (p = .039), not mentioned in the text.
- With activities completed added: sessions β = 0.03 (p = .070), activities β = 0.26 (p < .001); the text reports only the interaction.
- The "ability" in "lower-ability learners benefited more" is the final exam of the same course, which the authors acknowledge is confounded; in the same supplementary table, pretest score has a negative relationship with sessions (β = −0.07), opposite in direction to the abstract's claim that higher-ability learners spaced more.

## References

Each was read from start to finish and has an extraction record; parts I could not read are noted in parentheses.

- [Latimier, Peyre & Ramus (2021), A Meta-Analytic Review of the Benefit of Spacing out Retrieval Practice Episodes on Retention](https://doi.org/10.1007/s10648-020-09572-8) ([published version on the corresponding author's lab page](http://www.lscp.net/persons/ramus/docs/EPR20.pdf); OSF data not read).
- [Mawson & Kang (2025), The Distributed Practice Effect on Classroom Learning: A Meta-Analytic Review of Applied Research](https://doi.org/10.3390/bs15060771) ([open-access published version from MDPI, full text on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12189222/), including supplementary material).
- [Murray, Horner & Göbel (2025), A Meta-analytic Review of the Effectiveness of Spacing and Retrieval Practice for Mathematics Learning](https://doi.org/10.1007/s10648-025-10035-1) ([published version on coauthor Horner's website](http://aidanhorner.org/papers/Murrayetal_EdPsychReview_2025.pdf) and the publisher's supplementary material; some schematic figures not viewed).
- [Greving & Richter (2019), Distributed Learning in the Classroom: Effects of Rereading Schedules Depend on Time of Test](https://doi.org/10.3389/fpsyg.2018.02517) (open-access published version from Frontiers; OSF data not read).
- [Franzoi, Cembrani, Mulatti & Treccani (2025), Retrieval practice enhances learning in real primary school settings, whether distributed or not](https://doi.org/10.3389/fpsyg.2025.1632206) ([open-access published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12372469/) and supplementary material; OSF data not read).
- [Lyle, Bego, Ralston & Immekus (2022), Spaced Retrieval Practice Imposes Desirable Difficulty in Calculus Learning](https://doi.org/10.1007/s10648-022-09677-2) (web and table pages of the open-access published version on Springer; PDF and figures not obtained).
- [Bego et al. (2024), Single-paper meta-analyses of the effects of spaced retrieval practice in nine introductory STEM courses: is the glass half full or half empty?](https://doi.org/10.1186/s40594-024-00468-5) (web and table pages of the open-access published version on SpringerOpen; PDF, figures, and supplementary material not obtained).
- [Lindsey, Shroyer, Pashler & Mozer (2014), Improving Students' Long-Term Knowledge Retention Through Personalized Review](https://doi.org/10.1177/0956797613504302) ([published version and supplementary materials on author Mozer's personal page](https://home.cs.colorado.edu/~mozer/Research/Selected%20Publications/reprints/LindseyShroyerPashlerMozer2014Published.pdf)).
- [Martinengo et al. (2024), Spaced Digital Education for Health Professionals: Systematic Review and Meta-Analysis](https://doi.org/10.2196/57760) ([open-access published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11502984/) and the publisher's supplementary files; search strategy and list of excluded studies not read).
- [Carvalho, Sana & Yan (2020), Self-regulated spacing in a massive open online course is related to better learning](https://doi.org/10.1038/s41539-020-0061-1) ([open-access published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7076029/) and supplementary tables).
- Posts on this site: [Learning How to Learn](/posts/learning/2026-08-04-learning-how-to-learn-en), [Do Readers Know Whether They Understood?](/posts/learning/2026-10-14-metacomprehension-in-teaching-articles-en).
