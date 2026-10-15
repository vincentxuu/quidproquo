---
title: "Why Most Online Self-Learners Don't Finish: Evidence on Completion Rates, First-Week Dropout, Returning, and Planning Prompts"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, motivation, self-learning, mooc, course-guide, blog]
lang: en
description: "Research on when online self-learners leave, whether they come back, and how much an author can change: the denominators behind MOOC completion rates, dropout at the start, how many people who say they will finish actually do, the share who return the next year, and experiments on planning prompts, scheduling, a commitment tool, a self-regulation interface, deadlines, and values writing, including what happened when they were scaled up. It also explains why these numbers cannot be read as a portrait of blog readers."
tldr: "In HarvardX and MITx courses, about half of registrants on average never entered the course; among those who did enter, only 3.13% passed in 2017–18. A prompt to write a study plan raised completion from 13.8% to 17.7% in three courses, but at 247 courses no difference in completion was detected. These are all MOOC numbers; this site's traffic statistics are aggregate, with no data on individual readers' behavior."
series:
  name: "Writing Articles That Teach"
  order: 19
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-why-readers-dont-finish)

This is part 19 of the "Writing Articles That Teach" series and the last part of its fourth section, "after some time has passed." The three parts before it covered [how much of the spacing effect survives in real courses](/posts/learning/2026-10-14-spaced-practice-in-real-courses-en), [works that build review into the article](/posts/learning/2026-10-14-spaced-review-in-teaching-articles-en), and [the order of a series](/posts/learning/2026-10-14-series-order-in-teaching-articles-en). All of them assume the reader is still there. This part examines that assumption: when do online self-learners leave, do they come back, and how much can an author change?

The question comes from the shape of this site. Its course guides are series of articles: the [Harvard CS50 AI guide](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) has ten parts, and a single part often runs past 40,000 characters (of Chinese text); this series is planned at 30 parts. Writing them raises three questions. How many people reach the last part? What brings back someone who left halfway? Should an article include paragraphs like "read one part a week" or "set aside reading time first"? The production site loads at least [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/data-metrics/), which Cloudflare injects at the edge and which is not in the site's code. According to Cloudflare's documentation, its metrics are aggregate page views, visits, and page load time, where a visit is a page view that came from a different website or a direct link (the referrer does not match the hostname); it does not collect visitors' personal data, and it does not yet support custom events. It cannot tell where an individual reader stopped or whether they read the next part, so I can't answer these for this site. I can only look at what was measured elsewhere.

[Part 10](/posts/learning/2026-10-14-do-readers-answer-embedded-questions-en), on whether readers answer the questions in an article, used the funnel numbers from the 247-course study. [Part 14](/posts/learning/2026-10-14-utility-interest-seductive-details-en), on explaining usefulness, quoted one section of the same study and left the full treatment to this part. [Part 15](/posts/learning/2026-10-14-metacomprehension-in-teaching-articles-en) covered how inaccurate readers' self-assessments are when it comes to understanding; this part runs into the "will I finish" side of it.

**How sources were chosen, and their biases.** I scanned the literature first, then picked sources to read closely. The criterion was that a study had to measure people actually staying or leaving, and every intervention needed at least one study with an opposite or null result. The one exception is a meta-analysis that measured test scores; it is included to contrast with the other sources. There are 12 references; for each I read the whole of the version I obtained and kept an extraction record. The biases are clear. Apart from that one meta-analysis, all the data come from MOOCs (massive open online courses such as those on Coursera and edX), mostly in English. Six of the 12 have Justin Reich or René Kizilcec as an author, and the three interventions scaled up in the 2020 study were originally tested by the same authors. **None of them measures readers of a blog or a public teaching article.**

## How much the MOOC numbers can be borrowed

Before carrying MOOC research over to a web article, the differences need to be stated. These six points are the boundaries to keep in mind throughout; each time I borrow something later, I flag it again.

1. **Different starting point.** A MOOC's denominator is people who clicked "register." A blog has no registration; the closest thing is clicking through. There are no data on whether opening an article or registering for a course signals stronger intent.
2. **Different end point.** "Completion" in a MOOC means earning a certificate or passing, which requires graded assignments and exams. An article has no assignments, and reaching the last paragraph is not the same as learning.
3. **Different definition of "coming back."** The cross-year retention used below measures "registering for another course on the same two universities' platform the next year," not rereading the same content.
4. **Different external structure.** MOOCs have start dates, deadlines, certificates, paid options, and sometimes credit. This site has none of them.
5. **Different scale.** The "start" of a MOOC is the first week or first unit; the "start" of an article is its first few paragraphs. Course-level dropout corresponds to the first part of a series, not the first paragraphs of one article.
6. **Intervention studies sample a small minority.** Studies testing prompts like "write a plan" sampled people who filled in an optional survey: about 3.4% of registrants in one study and about 8.8% in another (both percentages are my calculations from the reported counts). The authors of the second study say the results should not be extended to less engaged students.

What can be borrowed are directions: dropout concentrates at the start; most people who say they will finish don't; light-touch prompts get smaller effects, or none detected, when scaled up. The first two directions agree across several sources; the third rests on a single genuine scale-up study, run by the original authors. Applying any of them to this site's readers is my inference.

## The short version

| Question | What I found | Nature of the evidence |
|---|---|---|
| How many finish | Median completion of 6.5% across 39 early MOOCs, denominator = registrants ([Jordan 2014](https://doi.org/10.19173/irrodl.v15i1.1651)); among people who entered HarvardX and MITx courses, the pass rate fell from 4.96% in 2013–14 to 3.13% in 2017–18 ([Reich & Ruipérez-Valiente 2019](https://doi.org/10.1126/science.aav7958)) | Descriptive statistics; "completion" means a certificate or a passing grade |
| When they leave | At the start. On average 52% of a course's registrants never entered it (Reich); in one programming MOOC, people who did work only in the first unit and never again were 17% in the fixed-schedule version and 50% in the self-paced version ([Ihantola et al. 2020](https://doi.org/10.1109/FIE44824.2020.9274023)) | Descriptive and observational |
| People who say they will finish | Among those who said before the course that they intended to complete, the pass rate ranged from 11.5% to 17.7% per year (Reich); students' own forecast of their chance of finishing averaged 83.5%, versus 16.7% actual ([Yeomans & Reich 2017](https://doi.org/10.1145/3027385.3027416)) | Descriptive |
| Do they come back | Share who registered for another course in the year after their first registration year: from 37.5% for the first cohort to about 10% for the fifth (Reich's supplementary table; the main text says 7%); I found no study of readers returning to the same article | Descriptive; "coming back" is not rereading |
| Prompts to write a study plan | Three courses, 2,053 people intending to earn a certificate: 13.8% → 17.7% (Yeomans); 247 courses: first-week activity rose, no difference in completion detected ([Kizilcec et al. 2020](https://doi.org/10.1073/pnas.1921417117)) | Randomized experiments; did not replicate at scale |
| Asking students to schedule when they'll watch | No difference detected in whether they watched the first video of weeks 1 and 2; later video count, grade, and certificate were slightly negative, all only at p < .10 ([Baker et al. 2016](https://doi.org/10.1177/2332858416674007)) | Randomized experiment, one course, 18,000 people |
| A tool to limit time on distracting websites | 657 volunteers recruited with a gift card: completion 10.7 percentage points higher; adding the 240 late joiners, none of the four outcomes was significant ([Patterson 2015 working paper](https://hdl.handle.net/1813/74637)) | Randomized experiment, one course |
| Fixed deadlines | People still working in the last unit: 45% in the fixed-schedule version, 13% self-paced; students chose their version, and the two versions had different progression rules (Ihantola) | Observational, not causal |
| Self-regulation interventions (meta-analysis) | Test scores d = 0.63, 0.38 after publication-bias correction; prompts or hints alone 0.24 ([Xu et al. 2022](https://doi.org/10.1080/0144929X.2022.2151935)) | Mostly small quasi-experiments; outcome is grades, not completion |
| Writing about how "this course connects to what I care about" | Across 247 courses, in courses with a global gap, completion for students from less-developed countries was 2.8 percentage points higher; in courses without a gap it was 1.6 lower (Kizilcec 2020) | Large randomized experiment; which courses have a gap could not be predicted in advance |

No row in this table measures article readers. The sections below give the conditions for each row.

## How many finish

### The denominator behind completion rates

MOOC completion is often described as "under 10%"; Yeomans and Reich's introduction says so, citing other research. That number first raises the question of the denominator.

Katy Jordan's [2014 analysis](https://doi.org/10.19173/irrodl.v15i1.1651) collected data from February to July 2013. Jordan gathered courses on Coursera, edX, and Udacity whose numbers had been made public and obtained completion rates (certificate earners divided by registrants) for 39 courses: from 0.9% to 36.1%, median 6.5%. These 39 courses started between fall 2011 and spring 2013 and had their numbers published by someone; they are only 14% of the list of finished courses at the time. The author listed "who chose to publish numbers" as a possible source of bias.

In the same data, about half of registrants became "active users" (each source defined this itself, for example logging in or watching at least one video), and that proportion was very stable across courses. With active users as the denominator, the median completion rate is 9.8%.

Justin Reich and José Ruipérez-Valiente's [2019 policy piece in *Science*](https://doi.org/10.1126/science.aav7958) uses a different denominator. The data cover every course MITx and HarvardX ran on edX from 2012 to May 2018: 565 course runs and 12.67 million registrations. The supplementary table computes completion among "people who entered the course," with completion meaning a passing grade:

| Year | All who entered | Said beforehand they intended to complete | Paid verified track |
|---|---|---|---|
| 2013–14 | 4.96% | 11.51% | 44.23% |
| 2015–16 | 4.13% | 16.44% | 49.73% |
| 2017–18 | 3.13% | 15.42% | 46.02% |

(All five years are in the appendix.) The main text says completion "has not budged in six years." The table has only five years, and the overall rate went down: highest at 5.91% in 2014–15, down to 3.13% in 2017–18. The paying group moved between 44% and 56%.

The supplement of Kizilcec et al.'s 2020 large-scale study yields a third denominator: 3.54 million registrations across 247 courses and about 99,000 people who passed, about 2.8% of registrants (my calculation).

These three numbers can't be compared side by side. Jordan's denominator is registrants; Reich's counts only people who entered the course, so Reich's rate should be higher, yet it is lower. The reasons may be the years, platforms, and mix of courses; neither paper has data to explain it.

### What "completion" measures

In all three, "completion" means a certificate or a passing grade. Jordan notes in the conclusion that learners can benefit from a course without doing the assessments, and that MOOC completion rates should not be compared with in-person courses. In Reich's data, four to five in ten paying learners each year still did not pass. So "finishing" in these studies means "turned in the graded work and passed," not "went through the content," and certainly not "learned it."

Borrowing for this site: an article has no passing line. All I can borrow is the direction that few people stay from start to finish, not any of the percentages.

## When they leave

### At the start

Six sources point to the same place: the start.

- **Never came in.** Three sources measure something similar with three definitions. In Reich's supplementary table, on average 52% of a course's registrants never entered the course content; that is the mean of 565 runs' individual proportions, and the median gives 49% (my calculation from the table's median). In Jordan's data, about half of registrants became "active users" (defined by each source, for example logging in or watching at least one video). Dan Davis and colleagues' [2018 experiment](https://doi.org/10.1145/3170358.3170383) in an edX geoscience course had 2,324 registrants, of whom 1,047 entered the course at least once (about 45%, my calculation). Reich's main text also cites other research saying attrition typically remains high in the first two weeks.
- **Gone after week one.** In Rachel Baker and colleagues' [2016 experiment](https://doi.org/10.1177/2332858416674007) in a science course on Coursera, among 18,043 people who registered at least two days before the start, 46.8% watched the first video of week 1, 32.2% watched the first video of week 2, and 8.9% eventually earned a certificate.
- **Quit after the first unit.** Petri Ihantola and colleagues' [2020 study](https://doi.org/10.1109/FIE44824.2020.9274023) looked at the University of Helsinki's introductory Java MOOC. The denominator is people who did at least one programming exercise. People who worked only in the first unit and never again were 17% in the fixed-schedule version and 50% in the self-paced version.
- **Every week, some people stay at the very front.** Tommy Mullaney and Reich's [2015 study](https://doi.org/10.1145/2724660.2724663) compared two runs of the same HarvardX humanities course; [part 12](/posts/learning/2026-10-14-prior-knowledge-reader-level-en) already covers its main findings. The point relevant here: in every week of the course, a group of people spent the most time on the first two chapters, and the authors write, "For many students, it is the only part of the course they see."

Jordan has one more result, about length. With registrants as the denominator, longer courses had lower completion (39 courses; course length explained about a quarter of the variance); with active users as the denominator, the relationship was not significant. The author's reading is that length may deter registrants from starting, but once people start, length matters less. Also, only one of the 39 courses ran longer than 15 weeks (CS50x, 24 weeks), and it also had the lowest completion rate (I saw this in the paper's table; the paper did not run an analysis without that course).

Borrowing for this site: dropout concentrating at the start is consistent across six sources, and I think it can be borrowed. "Fewer people read a long series" cannot: Jordan's result is not significant once the denominator changes, and the unit is course weeks, not number of articles or words.

### People who finish a whole week, then leave

Ihantola's data contain something the authors couldn't explain: among those who quit in the first week, 29 people (fixed schedule) and 74 (self-paced) had actually submitted every exercise in week one, and then never came back. The authors estimate about 5%; from their table I get 4.9% and 3.2%. The authors listed a few guesses, none backed by data.

The reminder here is that leaving doesn't necessarily mean being stuck. Article readers may also leave after reading the section they needed; the research doesn't distinguish the two kinds of leaving.

## Of those who say they'll finish, how many do

MOOC studies often ask learners before the course how far they intend to go. The result: most of those who say they will complete don't.

- In Reich's table, among those who said beforehand they intended to complete, the pass rate ranged from 11.5% to 17.7% per year.
- Michael Yeomans and Reich's [2017 study](https://doi.org/10.1145/3027385.3027416) asked the same question in three HarvardX courses. Among those who filled in the pre-course survey, 57% said they intended to earn a certificate, and 16% of them did. People in the analysis sample forecast their own chance of completing at 83.5% on average; the actual completion rate was 16.7%.
- Kizilcec, Pérez-Sanagustín, and Maldonado's [2017 study](https://doi.org/10.1016/j.compedu.2016.10.001) looked at six Spanish-language, self-paced Coursera courses from a Chilean university. Of 4,831 people who filled in the entry survey, 32% said they wanted a certificate, and 8.9% achieved it (the table header doesn't say whether the denominator counts only those who said they wanted one).

The 83.5% forecast against 16.7% actual is the other side of the problem in part 15, where readers' judgments of whether they understood were inaccurate: judgments of whether they'll finish are inaccurate too.

These numbers come with one condition: they all come only from people willing to fill in an optional survey, who are already more engaged than registrants in general. Yeomans and Reich write that most registrants did not attempt the pre-course survey, and most of those did not complete much else.

## Do they come back

### Across years: registering for another course

Reich and Ruipérez-Valiente group learners by "the year of their first registration" and look at how many registered for any HarvardX or MITx course the next year. The supplementary table:

| Year of first registration | Cohort size | Registered again the next year |
|---|---|---|
| 2012–13 | 192,255 | 37.5% |
| 2013–14 | 755,800 | 27.2% |
| 2014–15 | 630,992 | 23.1% |
| 2015–16 | 1,108,858 | 11.7% |
| 2016–17 | 531,213 | 10.0% |

The main text says second-year retention went "from 38% in the first cohort to 7% in the year 5 (2016-2017) cohort." In the same manuscript's supplementary table and figure, the 2016–17 cohort is 53,030 ÷ 531,213 ≈ 10%. The figure closest to 7% in the table is the 2013–14 cohort in 2017–18, 6.88%, which is fifth-year retention, not second-year. The main text may have misread crowded labels in the figure; I haven't read whether the published *Science* version also says 7%. "Each cohort lower than the one before" holds in the table, ending at 10%.

Borrowing for this site needs care. This "coming back" means "taking another course on the same two universities' platform"; people who took courses elsewhere count as lost, and it doesn't measure rereading the same course either. For articles, the closest question is "do readers come back to the same series after a while," and I found no study that measured it; this site's aggregate statistics cannot recognize the same reader either.

### Within a course: still there weeks later

The same trend shows up within courses, though each study measured it differently.

- **More people skip the pop-up review questions.** In Davis and colleagues' geoscience course (this article cites the LAK 2018 conference paper; the same experiment also has a [journal extension](https://doi.org/10.18608/jla.2018.53.3), which is the version [part 10](/posts/learning/2026-10-14-do-readers-answer-embedded-questions-en) cites), the treatment group got a question from earlier weeks before videos in weeks 2 through 6. Only 102 of the 523 people assigned ever interacted with these questions. Among those who eventually did not pass, the share of questions ignored rose from 47% in week 2 to 61% in week 6; among those who passed it stayed low. The full discussion of building review into content is in [part 17](/posts/learning/2026-10-14-spaced-review-in-teaching-articles-en).
- **Pacing flexibility mostly gets used.** Mullaney and Reich's result (even with sequential release, only 30% to 40% kept to the schedule) was already covered in [part 12](/posts/learning/2026-10-14-prior-knowledge-reader-level-en) and [part 18](/posts/learning/2026-10-14-series-order-in-teaching-articles-en), so I won't repeat it.
- **Self-paced learners spread their work over more days.** In Ihantola's two versions, looking only at the week people quit, the two versions did about the same amount of work; self-paced learners spread it over more days. Cumulatively, among people who quit in the same week, the self-paced version had actually done more exercises.

Together these point one way: MOOC learners follow their own pace and skip around, and the order and pace a course sets are mostly not followed. How to order a series is covered in [part 18](/posts/learning/2026-10-14-series-order-in-teaching-articles-en).

## How much the author can change

### Writing a study plan

This is the most studied and most often recommended approach: at the start, ask learners to write down when, where, and how they plan to study.

**The small original result.** In the pre-course surveys of three HarvardX courses, Yeomans and Reich randomly asked some people to write a concrete study plan. The analysis sample was 2,053 people who filled in the survey, said they intended to earn a certificate, were fluent in English, and registered in the first month; that is about 3.4% of the three courses' 60,778 registrants (my calculation). The control group got nothing extra. The share earning a certificate rose from 13.8% to 17.7% (p = .023), the preregistered primary outcome.

Three details about this result:

- The two studies (the first course, and the other two) each fell short of .05 on their own and only reached it combined. The paper's table prints stars with no legend; I worked this out from the coefficients and standard errors in the table.
- An enhanced prompt (stating at the top that planning helps, and showing students their plans back afterward) showed no detected difference from the simple single-question version.
- The higher the proportion of time words in a plan, the less likely completion (p = .015). The authors state this is not causal: people who write a lot about scheduling may already face other time pressures. This runs opposite to the common advice to have readers set when and where they'll read, and the authors also note it differs from earlier field experiments.

**After scaling up.** A [2020 *PNAS* study](https://doi.org/10.1073/pnas.1921417117) by nine authors including René Kizilcec, Reich, and Yeomans took this prompt and three other writing activities into 247 courses run by Harvard, MIT, and Stanford from September 2016 to May 2019, with a focal sample of 269,169 people, in four waves, each preregistered. The interventions again sat in the course-start survey, counting only people who got far enough into the survey to be randomized.

In the subgroup corresponding to the original study (intending to complete, fluent in English; the subgroup definition was adjusted across waves), the effect of long-term planning on completion was +0.19 percentage points in the first year (95% confidence interval −0.69 to 1.07) and −0.23 in the second; no difference was detected in either. Another planning format, MCII (writing the benefits of a goal, the obstacles, and "if…then…" plans), had worked earlier for students in individualist countries; scaled up it was +0.25 percentage points, no difference detected.

These activities weren't entirely without effect. Short-term plans (year 1), long-term plans (year 2), MCII, and social accountability ("write down who can keep you on track") all raised first-week activity on the platform; long-term plans in year 1 did not reach .05 in week 1. In week 2, long-term plans (both years) and social accountability still showed a difference. For completion, no difference was detected for any of them. The authors conclude:

> behavioral insights have more promise in encouraging one-time, short-lived actions than more continuous behaviors that require sustained effort and habit change.

The authors also withdrew their own earlier recommendation: having once recommended that online instructors adopt these interventions, they now conclude that research is first needed to predict in advance when the interventions will help. One more number worth remembering: in year 1, 14% of those who saw a planning prompt wrote nothing at all.

### Asking students to schedule time

Baker, Brent Evans, and Thomas Dee's experiment made "scheduling" narrower: two days before the course, an email asked students to click a link and pick the date and hour they would watch the first video of week 1, and to note it on their calendar; the same thing again in week 2. The control group got the same email, except it asked which browser they used. 18,043 people were randomly split in half.

Only 12.7% of the treatment group actually picked a time. Of those who did, 85% watched the first video, mostly on the day they had chosen. But across the whole treatment group, no difference was detected in whether people watched the first video of weeks 1 and 2; the three later outcomes, video count, grade, and certificate, were negative, all only at p < .10, with certificates 0.8 percentage points lower (control 9.3%). No subgroup showed a positive effect, including the most engaged group. The authors listed five possible explanations, tested none, and wrote "we are puzzled by the results."

### Limiting time on distracting sites

Richard Patterson's experiment differs from the two above: it provided a tool that works continuously. The course was Stanford's nine-week statistics MOOC from 2014. The paper exists as a 2015 working paper and a 2018 journal version that differ substantially; all numbers here follow the [working paper](https://hdl.handle.net/1813/74637).

Participants were 657 people recruited from registrants, given a $12 gift card, who had installed time-tracking software before the first assignment deadline; about 18% of those who registered before the start and entered the course. All four groups installed the same software that records computer use:

- **Commitment tool:** a daily limit on time spent on distracting sites, defaulting to the goal participants had entered in the pre-survey; an email every morning stating the current limit; distracting sites blocked once the limit was exceeded.
- **Reminder:** every half hour accumulated on distracting sites, a large pop-up showed how much time had been spent, with a link to the course.
- **Focus:** on the first visit to the course site each day, an option to block distracting sites for 15, 30, or 60 minutes.
- **Control:** time tracking and reports only.

Completion in the commitment group was 10.7 percentage points higher than control, with 0.91 more assignments submitted and grades 0.29 standard deviations higher, all significant at the 5% level; time on the course was 5.5 hours higher, at the 10% level. No effect was detected for the reminder and focus groups; the author says the estimates are imprecise and large effects can't be ruled out. The focus group differed in the first two or three weeks, and the difference then dissipated.

Two results in the same working paper's appendix tables need to be read together. First, adding the 240 people who joined in week 2 (897 total), none of the commitment tool's four outcomes was significant, and the sizes were about half (my comparison from the table). Second, the effects were concentrated among those predicted to do well anyway. Participants also did clearly better than non-participating students on every course outcome, for example completion of 28.9% versus 21.3%.

### Self-regulation interfaces and a meta-analysis

Shu-Yi Hsu and M. Shane Tutwiler's [2022 short paper](https://doi.org/10.1145/3491140.3528312) tested, with verified-track learners in two MicroMasters programs, a weekly reflection page: self-rate how much of last week's plan got done, set next week's goals, schedule tasks, set email reminders. The control group saw the same learning analytics and study tips but didn't fill anything in. Combining three waves, no difference was detected for those who passed; those who didn't pass scored about 1 percentage point higher, and the authors put the probability that this direction is positive at only 60%. It's a work-in-progress short paper with no numeric tables and no usage data, so I treat it only as supporting evidence.

The abstract of Zhihong Xu and colleagues' [2022 meta-analysis](https://doi.org/10.1080/0144929X.2022.2151935) says self-regulation interventions have a moderate effect. It pools 50 articles and 92 effect sizes: d = 0.63 for self-regulation interventions in online or blended settings on academic achievement. The same paper's publication-bias test was significant, and the authors' own correction lowered the estimate to 0.38; the 0.69 printed in the abstract comes from no analysis in the body.

This analysis doesn't measure the same thing as the MOOC studies above. Its outcome is test scores (82 of 92 used researcher-made tests), not completion or persistence; 71 of its studies are quasi-experiments, with a median sample of 68 (my calculation from its table), mostly small-class studies within one course. Its own subgroups actually point the same way as the MOOC studies: prompts or hints alone 0.24, metacognitive strategies alone 0.19; the large effects came from heavy interventions combining several strategies across several phases. These are comparisons across studies, not contrasts within one study.

### Correlation is not causation: goal setting

Kizilcec and colleagues' 2017 Chilean MOOC study is easy to read as evidence that "set goals first and you'll finish." It is an observational study with no intervention. People who rated themselves higher on goal setting at entry were slightly more likely to reach their own course goals, with correlations of 0.03 to 0.08; with all six strategies entered together, one standard deviation higher on goal setting meant 54% higher odds of reaching a certificate goal (baseline attainment 8.9%). The authors themselves point out in the discussion that scaffolding design needs causal evidence, citing two self-regulation interventions in MOOCs that had no positive effect.

### Fixed schedules and deadlines

Ihantola and colleagues compared two versions of the same Java MOOC. People still working on exercises in the last unit were 45% in the fixed-schedule version and 13% in the self-paced version; the biggest difference was in the first unit. The authors write in the abstract, "Our results support scheduling student activities in open online courses."

The comparison has four problems; the authors list the first, second, and fourth in their limitations:

- Students chose their version, and those who choose a strict schedule may already differ. The authors say random assignment would be needed to confirm.
- The two versions were graded differently.
- The self-paced version required finishing 90% of the previous unit's exercises before moving on; the fixed-schedule version had no such threshold and allowed joining midway. So "still working in unit seven" set a different bar in each version: the self-paced 13% had done nearly everything, while the fixed-schedule 45% only means they were still doing something at the end.
- The authors had no grades; "persistence" measures whether people touched that unit's exercises, not completion or learning.

So this paper can't support "deadlines triple completion." The firmer observation, which doesn't depend on comparing the two versions, is that dropout in both versions concentrated in the first unit.

Mullaney and Reich compared two runs with sequential versus all-at-once release; certificate rates were almost the same, but the runs differed in more than the release pattern; details are in [part 12](/posts/learning/2026-10-14-prior-knowledge-reader-level-en).

### This site

Every intervention above relies on something MOOCs have and this site doesn't: an entry survey, emails to learners, graded work on a platform, a start date. This site's articles have none of these channels. If I wanted to add a paragraph like "schedule your weekly reading time now," the closest evidence is Baker (scheduling) and Kizilcec 2020 (planning): one detected no effect and was slightly negative later (p < .10), the other worked at small scale but detected no difference in completion when scaled up. Both show only that there's no evidence supporting adding such paragraphs, not that adding them does harm. So I don't add such paragraphs; they're listed again under "What to do."

This site does actually have such paragraphs. The exercises in the [statistics series map](/posts/learning/2026-08-29-im-stat-series-map-next-steps-en) ask readers to "write a four-week study plan," which is exactly the kind of planning prompt Yeomans tested. The [CS231n overview](/posts/ai/2026-09-30-cs231n-course-overview-en) has a section, "A 10-week self-study plan," giving weekly progress that follows the official calendar. Of this site's 20 certification prep guides, 13 have a section on an N-week schedule and how it was derived; for example, [AWS MLA-C02](/posts/ai/2026-10-08-aws-mla-c02-prep-guide-en) lays out eight weeks at 6 to 8 hours a week, and there is also [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en), which lays out a study plan at 8 to 10 hours a week. The course-guide spec also lists a "self-study plan" as something an overview's subtitle can offer. The CS231n and prep-guide schedules are paces the author sets for the reader, closer to the weekly emails suggesting a pace in Mullaney and Reich's course, not asking readers to write their own plan or schedule. No study has directly compared an author-set pace with a reader-set one.

## Who feels this wasn't written for them

This section is about readers' identity and motivation. Could the examples, speakers, or welcome messages in content make some people feel "this isn't written for me" and leave? I haven't read the full text of any study that directly tests whether identity cues in the material itself (examples, people in images) affect who keeps reading, so this article doesn't cover it. Here I only trace one line of MOOC research that was scaled up.

The line starts with Kizilcec, Saltarelli, Reich, and Cohen's 2017 short paper in *Science*. The study exists, but I haven't read a legitimately public full text, so I don't cite its content.

The 2020 *PNAS* study scaled up one of its interventions: in the course-start survey, pick two or three values you care about and write how taking this course reflects them ("value relevance" writing). According to the 2020 paper's account, the earlier study raised completion for students from developing countries from 17% to 41% in two courses, and the effect the authors compared against was 24 percentage points, from a sample of 64; in the same earlier study, students from developed countries in one of the courses went from 32% to 23%.

Scaled up to 247 courses:

- Across all courses, no difference in completion was detected for students from less-developed countries (+0.14 and −0.04 percentage points in the two years).
- It worked only in courses with a "global gap" (where completion between the two groups in the control condition differed by a set amount), about +2.8 percentage points in both years. The authors say this is an order of magnitude smaller than the original study. In year 1 this condition was defined after the fact.
- In courses without a gap, completion for the same group fell by about 1.6 to 1.7 percentage points.
- Whether a course would have a global gap could not be predicted in advance. A model trained on 21 course features reached 54.3% accuracy against 50% for chance; among 79 courses that ran again, only 60.8% matched their previous run on whether a gap existed. A personalized policy using machine learning to choose who gets which intervention also didn't beat giving nothing by a detectable margin.

Reich's data look at the same issue from another side: growth and certificates were concentrated in wealthy countries. In 2017–18, for example, "very high human development" countries accounted for 55.58% of registrations and 68.7% of certificates.

Borrowing for this site: for a public article, the author doesn't know who's reading, or whether there's a "gap" among readers. The scale-up result on this line is that the same brief writing activity helped the target group in some settings, lowered the same group's completion in others, and which setting was which couldn't be told in advance. So I don't put brief values-writing activities like "how this course connects to what you care about" in an article; no study has tested this on article readers. As for "you belong here"–style social-belonging interventions, the 2020 paper didn't rerun them; their only data are in the 2017 paper, whose full text I couldn't read, so this article has no citable results on them.

## Where the sources disagree

The following results point in different directions, or look contradictory while measuring different things. I list them side by side without picking one.

**Do planning prompts work?** In Yeomans and Reich's three courses, completion was 13.8% versus 17.7%. Kizilcec and colleagues reran it in 2020 in the corresponding subgroup (its definition was adjusted across waves; see below): +0.19 and −0.23 percentage points, no difference detected. The authors overlap (Yeomans and Reich are both on the 2020 paper). The 2020 paper changed the subgroup definition between waves (from "intending to complete and fluent in English" to "fluent in English" to the whole sample), and its intervention wording and exclusion criteria also differed somewhat from the original. The 2020 paper also found planning prompts raised activity in the first week or two; the original study did not report this.

**Is a more specific "when and where" better?** The common advice is to make plans specific about time and place, and Yeomans and Reich say earlier field experiments support this. In their own data, the higher the proportion of time words in a plan, the less likely completion (correlation, not causation); the result that more concrete time words predicted lower completion only reached p = .086. The authors proposed a hypothesis reconciling the two, untested.

**Are self-regulation interventions moderately effective, or was no effect detected?** Xu and colleagues' meta-analysis gives d = 0.63 (0.38 after correction); Kizilcec 2020 and Hsu and Tutwiler detected almost no effect in MOOCs. The two sides differ in outcome (test scores versus completion), sample size (median 68 versus thousands to hundreds of thousands), and intervention (designs lasting 1 to 36 weeks within one course, versus a few minutes of writing at course start or one page a week), so calling them contradictory isn't accurate.

**Commitment-style tools: Patterson positive, Baker slightly negative.** The tools are entirely different. Patterson's was a daily cap on distracting time, plus daily email and blocking, with paid volunteers who had installed software; Baker's was picking one video-watching time before the course, with all early registrants and no screening. Patterson's result was also not significant once late joiners were added.

**Do deadlines help?** Ihantola's fixed-schedule version kept more people; when Mullaney and Reich changed the release pattern, certificate rates barely moved. Neither is randomized, and they compare different things: one is deadlines versus none, the other sequential versus all-at-once release.

**Do fewer people finish longer courses?** Same Jordan data: negative correlation with registrants as the denominator, not significant with active users.

**Does cross-year retention end at 7% or 10%?** Reich and Ruipérez-Valiente's main text says 7%; the same manuscript's supplementary table and figure say 10%.

**How big is the value-relevance effect?** The original study, as reported in the 2020 paper, went from 17% to 41%; scaled up by the same authors, about +2.8 percentage points in courses with a gap, and negative in courses without one.

## Checked against this site's practice

| This site's practice | Related evidence | Evidence-based, or this site's choice |
|---|---|---|
| Each part of this series opens with a "short version" table; course guides open with a TL;DR | Dropout concentrates at the start (Reich, Baker, Ihantola, Davis); Mullaney and Reich suggest having a course's first chapter summarize the whole course, untested ([part 18](/posts/learning/2026-10-14-series-order-in-teaching-articles-en) lists this too) | This site's choice. Consistent with the observations, but no study has tested whether putting conclusions first affects whether readers stay or learn |
| Course overviews must state who the reader is, what each module teaches, a reading route, and a concrete starting point (course-guide spec `course-guide-contract.md`) | Every week, a group spent the most time on the first two chapters (Mullaney) | This site's choice. The overview may be the only part many people read |
| Link to prerequisites not taught in the series | Readers follow their own pace and skip around (Mullaney, Ihantola) | The direction is supported; the "link" format itself hasn't been tested ([part 12](/posts/learning/2026-10-14-prior-knowledge-reader-level-en) and [part 18](/posts/learning/2026-10-14-series-order-in-teaching-articles-en) list this in their tables) |
| This series and single-lecture course guides have no "read one part a week" or "schedule your time" paragraphs; exceptions are the statistics series map asking readers to write a four-week study plan, and the weekly paces the author set in the CS231n overview and the prep guides | Scheduling: no effect detected, slightly negative later, p < .10 (Baker); planning: no difference in completion detected at scale (Kizilcec 2020) | No evidence supports adding them; not adding them is this site's choice. Both studies measured MOOC completion |
| No deadlines, certificates, or reminder emails | The fixed-schedule version kept more people, but students chose their version (Ihantola) | The evidence doesn't show they should be added, and this site couldn't add them anyway |
| Long series: this one has 30 parts, CS50 AI guide 10 | With registrants as the denominator, longer courses had lower completion; not significant after changing the denominator (Jordan) | Doesn't show series should be shorter; the unit was course weeks, not parts or words |
| Traffic statistics are aggregate | — | Cloudflare Web Analytics reports aggregate page views, visits, and load time and does not support custom events, so I don't know where this site's readers leave. Whether to add further logging is a separate decision |

## What to do

The five items below are my judgments; each lists the results it rests on.

1. **Put each article's most important point first, so people who read only the opening still take something away.** Basis: six sources found dropout concentrated at the start, and Mullaney and Reich saw a group each week spending the most time on the first two chapters. This borrows a direction and also crosses scales: the research measured a course's first week, and here it's applied to an article's first paragraphs. No study has tested the effect of putting conclusions first. How: state the article's answer within the first three paragraphs (this series uses a "short version" table) instead of saving it for the last section.
2. **The first part or overview of a series should stand on its own, and each part should be readable on its own.** [Part 18](/posts/learning/2026-10-14-series-order-in-teaching-articles-en) already covers both (put the series' key points in the overview; open each part by saying which earlier parts it uses, with links), also based on Mullaney and Reich. What this article adds is the layer where the scale matches: course-level dropout corresponds exactly to the first part of a series. The distinction to keep is between a link and a gate: saying at the start which parts you use and linking back is different from writing "read part 3 before this one." The first gives people who skip around a way back; the second shuts them out.
3. **Don't add paragraphs like "schedule your reading time first" or "write down your study plan."** Basis: Baker (no effect detected, slightly negative later), Kizilcec 2020 (no difference in completion detected at scale), Hsu and Tutwiler (almost no difference). In Xu and colleagues' meta-analysis, prompts alone had a positive but smaller effect (0.24), measured on grades, so it only shows these prompts have small effects; it isn't a basis for leaving them out. These are all results from MOOCs or courses. How: the statistics series map's "write a four-week study plan" could become "pick a path and write which part you'll read next, and why."
4. **Don't include brief values-writing activities like "how this course connects to what you care about."** Basis: when value-relevance writing was scaled up, it helped the target group in some courses, lowered the same group's completion in others, and which was which couldn't be predicted (Kizilcec 2020). For social-belonging interventions, there are no citable scaled-up results at hand.
5. **Don't judge an article by its read-to-the-end rate.** Basis: "completion" in the research means passing, not learning (Jordan, Reich); people who finish a whole week and then leave also exist (Ihantola). How: if scroll logging is ever added, record "reached the last paragraph" as reader behavior, not as evidence the article worked or didn't.

## Three things to do tonight

Pick one of your own series; about an hour:

1. Open the first part and read only the first three paragraphs. Ask: if a reader left right here, which conclusion of the series would they take away? If none, move that conclusion up.
2. Pick an article in the middle and search for "earlier," "previous part," and "part N." At each one, add one sentence restating the concept you need, and keep the link.
3. Search your own articles for "study plan," "each week," and "schedule." Where a paragraph asks readers to write their own plan or schedule time (such as question 3 in the statistics series map), change it to one small action they can do today; keep weekly paces you set as the author, but say they're suggestions, not gates.

## Limits of this evidence

- **No study measured readers of a blog or a public teaching article**, and this site's traffic statistics are aggregate, with no data on individual readers. All borrowing is inference; the boundaries are in "How much the MOOC numbers can be borrowed" at the start.
- **"Completion" means a certificate or passing**, "retention" means registering again on the same platform the next year, and "persistence" means whether someone touched that unit's exercises. None of these is "finished reading" or "learned it."
- **Intervention studies sample a small, engaged minority.** Yeomans and Reich about 3.4% of registrants; in Kizilcec 2020 about 8.8% reached randomization, and over 70% of the focal sample held a bachelor's degree, with mean age 32 to 35; Patterson's were paid volunteers who were already doing better.
- **The authors are concentrated.** Six of 12 references have Reich or Kizilcec as an author. The three interventions scaled up in 2020 were originally tested by the same authors; the scale-up results here are the authors' own reports.
- **The data are mainly HarvardX, MITx, and Stanford**, mostly English-language courses; Ihantola's is a Finnish programming course, Kizilcec 2017's are Chilean Spanish-language courses. Data from Chinese- and Japanese-language platforms aren't covered.
- **Observational studies aren't causal**: Ihantola (students chose their version), Mullaney and Reich (the two runs were a bundle of changes), Kizilcec 2017 (correlation), Jordan (a compilation of published numbers).
- **The literature on identity and belonging** (stereotype threat, belonging interventions for first-year college students, and so on) wasn't read for this article; only one scaled-up MOOC line is covered.
- **"Every week, some people stay at the front two chapters" is only a qualitative description**: Mullaney and Reich wrote "many students," with no count or proportion, and the authors call it an incidental finding. Where the body and the comparison table use it, treat it as a direction only.
- **My inferences**: that MOOC directions can be borrowed for article readers, including that article readers skip around as MOOC learners do; applying course-level dropout to an article's first paragraphs; that readers may leave after reading the section they needed, not necessarily because they're stuck; that the overview may be the only part many people read; the distinction between a link and a gate; not adding scheduling or planning paragraphs; not adding values-writing activities; that Reich's 7% may come from misreading figure labels; that inaccurate forecasts of finishing and part 15's inaccurate judgments of understanding are the same kind of problem, which is this site's connection; and the three things to do tonight. They are not flagged one by one in the text; they are collected here.
- **Numbers I calculated**: Kizilcec 2020's 2.8% and 8.8%, Yeomans's 3.4%, Davis's 45%, Ihantola's 4.9% and 3.2%, Xu's median sample size of 68, Reich's median of 49%, Patterson's "about half" after adding late joiners, and the two Yeomans studies each being non-significant (inferred from coefficients and standard errors). All are flagged where they appear.
- **Known to exist, but no legitimately public full text read**: Kizilcec, Saltarelli, Reich, and Cohen's (2017) study in *Science*. The 17% to 41%, n = 64, and 24 percentage points in the text are all as reported in the 2020 paper.

## Appendix: study designs and numbers

The main text keeps one or two numbers per item; the rest are here.

**Reich & Ruipérez-Valiente (2019)**, *Science* 363(6423), Policy Forum; read as the author's final manuscript and supplementary materials in MIT's repository. All MITx and HarvardX MOOCs on edX from 2012 to May 2018: 565 runs, 261 courses, 12.67 million registrations, 5.63 million learners; years run June to May. Descriptive statistics only, no tests. Supplementary Table S4 (course as the unit): proportion who entered the course, mean 48.02%, median 51.01%; viewed at least half the chapters, mean 25.59%; passed and earned a verified certificate, mean 5.03%, median 2.88%. New learners by first registration year: 192,255; 755,800; 630,992; 1,108,858; 531,213; 499,736 (the text says the first four years rose, but the third year in the table is below the second). Later-year retention, for example the 2012–13 cohort in years 3 to 6: 24.18%, 18.77%, 11.28%, 7.83%. Supplementary Table S3 completion (passing, denominator = those who entered; five years only): all 4.96%, 5.91%, 4.13%, 3.98%, 3.13%; intended to complete 11.51%, 17.74%, 16.44%, 16.13%, 15.42%; verified track 44.23%, 50.17%, 49.73%, 56.43%, 46.02%. The number saying they intended to complete fell from 209,000 (2015–16) to 42,000 (2017–18), and verified learners rose from 6,790 to between 46,000 and 52,000, so the composition changed, which the paper doesn't discuss. "Very high human development" countries' share of registrations was 59.28% in 2012–13 and 55.58% in 2017–18; of certificates, 61.98% and 68.7%. The authors' only limitation sentence is that other platforms might show different dynamics.

**Jordan (2014)**, *IRRODL* 15(1), published version. Starting from Class Central's list of finished courses (279), collected published figures for Coursera, edX, and Udacity; 91 courses with enrollment, 42 with completion figures. Enrollment 4,500 to 226,652, median 42,844. Completion (certificates ÷ registrants) for 39 courses: 0.9% to 36.1%, median 6.5%; the author also says 5% is typical. Active users ≈ 0.543 × registrants (R² = 0.96, n = 39). Completion with active users as denominator: 1.4% to 50.1%, median 9.8%. Completion on course length: ln(completion) = 2.648 − 0.100 × weeks, R² = 0.24, p = 0.002; not significant for start date, university ranking, or enrollment; with active users as the denominator, course length is not significant either. Each factor was run as a separate simple regression; no multiple regression. Limitations the author lists: 67.4% of eligible courses released no data, so publication may be biased; student-supplied figures rely on trust; no learner voice; certificate counts don't show who attempted and failed.

**Kizilcec, Reich, Yeomans, Dann, Brunskill, Lopez, Turkay, Williams, Tingley (2020)**, *PNAS* 117(26); read as the published version and the SI Appendix. 247 courses, focal sample 269,169, four waves, each preregistered; intent-to-treat analysis regardless of whether students actually wrote. Funnel: 3,546,206 registrations; 432,164 entered the survey; 312,221 reached randomization. Focal-sample completion by wave 15.2%, 13.4%, 13.8%, 12.0%; active in week 1: 43.1%, 33.3%, 35.3%, 35.8%. Five interventions: long-term plans, short-term plans (year 1 only), value relevance, MCII (year 2 only), social accountability (year 2 only). None of the four main hypotheses replicated: long-term plans +0.19 in year 1 (n = 26,586) and −0.23 in year 2 (n = 10,372); MCII +0.25 (n = 12,879); social accountability +0.89 (−0.22 to 1.99); value relevance across all courses +0.14 and −0.04 percentage points. Week-1 activity (log event counts): short-term plans β = 0.044 (year 1), long-term plans 0.106 (year 2), MCII 0.060, social accountability 0.079; in week 2, long-term plans 0.049 and 0.069 and social accountability 0.094 were still significant, MCII and short-term plans were not. Value relevance in courses with a global gap: students from less-developed countries +2.79 (95% CI 1.30 to 4.27, n = 5,974) and +2.74 (0.32 to 5.17, n = 2,712); in courses without a gap −1.62 and −1.71; not significant for students from more-developed countries. In exploratory analyses the same group also responded to both planning prompts in year 1 and MCII in year 2, but not to planning or social accountability in year 2. Gap-prediction accuracy 54.3% (44.1 to 64.4), chance 50.0%; the personalized policy's estimated completion 13.38% versus 12.81% with no intervention, not significantly different. Limitations the authors list: the sample is survey takers; subgroup definitions and activity content changed between waves; the global gap was determined after the fact.

**Yeomans & Reich (2017)**, LAK '17; read as the author's final manuscript in MIT's repository. Three HarvardX courses (Study 1 one course, Study 2 two), 60,778 registrants, 2,053 analyzed (293 and 1,760). Study 2 had simple and enhanced prompts. Primary outcome (preregistered): certificate 17.7% (15.6 to 19.8) versus 13.8% (11.3 to 16.3), χ²(1) = 5.2, p = .023; the authors express this as a 29% relative increase. Logistic coefficients: Study 1 only 0.609 (SE 0.353), Study 2 only 0.252 (0.139), combined 0.302 (0.130). Simple versus enhanced: certificate 16.8% versus 18.8%, p = .404. Exploratory: upgrading to paid during the course 3.6% versus 1.8% (p = .036); including those who paid at registration, total 6.7% versus 4.8% (p = .100; the "40%" in the abstract is this comparison); larger effect for people concurrently enrolled in a brick-and-mortar school (p = .043 after correcting across 13 tests). 87% wrote plans of more than two words; plan length did not significantly predict completion. Self-forecast completion averaged 83.5%, actual 16.7%. Time-word proportion β = −0.223, p = .015. The paper has no limitations section.

**Baker, Evans, Dee (2016)**, *AERA Open* 2(4), published version. One science MOOC on Coursera, first offered in 2013, eight weeks. 18,043 people: 9,022 treatment, 9,021 control. Treatment: opened any scheduling survey 15.9%, completed 12.7%; week 1, 12.5% opened and 10.1% chose a time; week 2, 6.5% opened and 4.9% chose. Intent-to-treat estimates (control mean): week-1 first video −0.010 (0.474), week-2 first video −0.003 (0.322), videos watched −0.733 (19.37), grade −0.642 (11.49), certificate −0.008 (0.093); the last three at p < .10, none reaching .05. Estimates for those who opened the survey: certificate −4.8 percentage points (p < .10); late registrants and .edu email holders were significantly negative on several outcomes, with no multiple-comparison correction for the subgroup analyses. Limitations the authors list: no demographic data, a single course, no way to see whether students read the email.

**Patterson (2015)**, Cornell Higher Education Research Institute working paper WP165. Stanford OpenEdX nine-week statistics MOOC, 2014; a certificate for 60% or more of total points. Main sample 657 (control 170, commitment 160, reminder 166, focus 161). 85% held at least a college degree; 28% were in the US. OLS with pre-survey controls. Commitment tool versus control: hours +5.491 (SE 3.085, 10% level), assignments +0.909 (0.403), grade +0.291 SD (0.148), completion +0.107 (0.0497), the last three at the 5% level. Reminder: hours −3.339, assignments +0.267, grade +0.011, completion +0.011, none significant. Focus: hours +0.848, assignments +0.577, grade +0.097, completion +0.014, none significant. Including late joiners (N = 897): commitment tool hours +3.940, assignments +0.529, grade +0.132, completion +0.049, none significant; reminder group hours −4.207, significantly negative at the 10% level. By predicted-performance quintile, the commitment tool's effect on assignments was significant in the top two quintiles (the fourth only at the 10% level) and on grades only in the top quintile. By the end of the course, the commitment group allowed itself nearly twice as much distracting time and hit its limit less than half as often as in week 1. Participants versus non-participants: hours 22.4 versus 15.8, completion 0.289 versus 0.213. The post-survey response rate was 52%, differing across groups.

**Kizilcec, Pérez-Sanagustín, Maldonado (2017)**, *Computers & Education* 104; read as the published version on the first author's website. Six Spanish-language, self-paced Coursera courses from the Pontificia Universidad Católica de Chile with all materials open at once, 2015; 4,831 people (6,709 surveys, 1,450 excluded because they couldn't be matched to course data). A 23-item self-report scale covering six strategies. Spearman correlations with goal attainment: goal setting 0.08, 0.05, 0.03; strategic planning 0.05, 0.05, 0.04; help seeking −0.05, −0.05, −0.03; elaboration 0.03 for all, not significant. Logistic regression: 1 SD higher goal setting, 54% higher odds of a certificate (p = 0.007); 1 SD higher help seeking, 27% lower odds (p = 0.002). Largest correlation with behavioral logs |r| = 0.097. Limitations the authors list: mostly Latin American learners; the scale was adapted and translated without separate validation; most strategies can't be observed on the platform.

**Hsu & Tutwiler (2022)**, L@S '22, Work in Progress, published version. ColumbiaX's two MicroMasters programs, four courses each, 2019–2020, about 2,650 verified learners (the paper gives three inconsistent counts). Three waves: wave 1 typed goals, optional use; wave 2 switched to checkboxes and required visiting the page before watching videos; wave 3 checkboxes, optional use, and included people deferred from wave 2. The only outcome is final grade, analyzed separately by pass/fail: passers about +2, +1, −2 percentage points across waves, no evidence combined; non-passers about 0, +2, 0, combined +1, with 60% of the posterior above 0. No numeric tables, interval values, or usage data.

**Ihantola, Fronza, Mikkonen, Noponen, Hellas (2020)**, IEEE FIE 2020; read as the author version in the University of Helsinki's repository. 2019 free introductory Java MOOC, seven units. Analysis sample: fixed schedule 3,546, self-paced 4,693 (616 who took both excluded). People still active by unit, fixed schedule 2,983, 2,708, 2,398, 2,056, 1,877, 1,770, 1,623; self-paced 4,653, 2,340, 1,481, 1,112, 937, 793, 634. Last unit 45% versus 13%, χ²(1) = 1055.3. Exit proportions with that week's active learners as the denominator (my calculation from the table): in weeks 2 to 6 the self-paced version was nearly double each week; only with everyone as the denominator do the two lines come close. In the discussion the authors say the two versions were "almost similar" after week one, which contradicts the conclusion. Cumulatively, self-paced learners who quit in the same week had done more exercises and worked on more days; looking only at the week they quit, the number of exercises didn't differ.

**Xu, Zhao, Zhang, Liew, Kogut (2022)**, *Behaviour & Information Technology* 42(16), published version. 2011 to March 2022, 50 articles, 92 effect sizes; 71 quasi-experimental, 21 randomized; 60 higher education, 23 secondary, 7 primary. Random-effects d = 0.63 (0.47 to 0.79), Q = 513.22; Egger test z = 6.85; trim-and-fill added 13 studies, giving 0.38. No significant difference between journal articles and dissertations (only 6 dissertations). Between-group differences not significant for learning setting; significant for strategy type, phase, scaffold type, and subject. Neither intervention duration nor weekly intensity predicted effect size. No study-quality assessment; multiple effect sizes from the same participants treated as independent; three effect sizes above d = 4 with no sensitivity analysis.

**Davis, Kizilcec, Hauff, Houben (2018)**, LAK '18; read as the ACM-formatted version on the first author's web page. edX geoscience course, May to July 2017, six weeks. 1,047 people (control 524, treatment 523). The control group also received weekly guidance on "effective study habits." Only 102 in the treatment group interacted with the pop-up questions. Intent-to-treat and instrumental-variable estimates for passing, nonzero grade, and continuous grade were all not significant. Median time to ignore a question 7 seconds; response rate 69% for multiple-choice, 41% for numeric. Only 20 people answered the test two weeks after the course. The same experiment's journal extension is JLA 5(3).

**Mullaney & Reich (2015)**, L@S '15; numbers read from the authors' public HarvardX working paper (2014). The course, how the two runs differed, and the on-track proportions are in [part 12](/posts/learning/2026-10-14-prior-knowledge-reader-level-en)'s appendix. Used here: every week a group spent the most time on the first two chapters; certificate rate (share of active learners) 5.6% with sequential release and 5.7% with all-at-once release, untested.

## References

I read the whole of the version I obtained for each and kept an extraction record; versions and parts I couldn't read are in parentheses.

- [Cloudflare Web Analytics docs: Data and metrics](https://developers.cloudflare.com/web-analytics/data-metrics/): read the About, High-level metrics, Dimensions, Data origin and collection, and FAQ pages (checked 2026-10-14), to describe what this site's aggregate traffic statistics measure and do not measure.
- [Reich & Ruipérez-Valiente (2019), The MOOC pivot](https://doi.org/10.1126/science.aav7958) (read as the [author's final manuscript in MIT's repository](https://hdl.handle.net/1721.1/136215), including supplementary materials; the published *Science* version was not read).
- [Jordan (2014), Initial Trends in Enrolment and Completion of Massive Open Online Courses](https://doi.org/10.19173/irrodl.v15i1.1651) (published version, open access; [ERIC full text](https://files.eric.ed.gov/fulltext/EJ1024344.pdf)).
- [Kizilcec, Reich, Yeomans et al. (2020), Scaling up behavioral science interventions in online education](https://doi.org/10.1073/pnas.1921417117) ([published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7334459/) and the SI Appendix; SI Tables S4 and S5 not checked against the layout).
- [Yeomans & Reich (2017), Planning Prompts Increase and Forecast Course Completion in Massive Open Online Courses](https://doi.org/10.1145/3027385.3027416) (read as the [author's final manuscript in MIT's repository](https://hdl.handle.net/1721.1/137973); the preregistration on OSF was not read).
- [Baker, Evans & Dee (2016), A Randomized Experiment Testing the Efficacy of a Scheduling Nudge in a Massive Open Online Course (MOOC)](https://doi.org/10.1177/2332858416674007) (published version, CC BY).
- [Patterson (2015), Can behavioral tools improve online student outcomes? Experimental evidence from a massive open online course (CHERI working paper WP165)](https://hdl.handle.net/1813/74637) (the working paper on Cornell eCommons; the 2018 journal version differs substantially, and all numbers here follow the working paper).
- [Kizilcec, Pérez-Sanagustín & Maldonado (2017), Self-regulated learning strategies predict learner behavior and goal attainment in Massive Open Online Courses](https://doi.org/10.1016/j.compedu.2016.10.001) (read as the [published version on the first author's website](https://rene.kizilcec.com/wp-content/uploads/2016/11/kizilcec2017srl.pdf); the online supplement with the full questionnaire was not read).
- [Hsu & Tutwiler (2022), How Much and for Whom? A Multi-Wave Study of the Impact of Self-Regulated Learning Scaffolds on MOOC Student Academic Performance](https://doi.org/10.1145/3491140.3528312) (ACM published version; values in the figures can't be read, so numbers are from the text).
- [Ihantola, Fronza, Mikkonen, Noponen & Hellas (2020), Deadlines and MOOCs: How Do Students Behave in MOOCs with and without Deadlines](https://doi.org/10.1109/FIE44824.2020.9274023) (read as the [author version in the University of Helsinki's repository](https://helda.helsinki.fi/handle/10138/322908)).
- [Xu, Zhao, Zhang, Liew & Kogut (2022), A meta-analysis of the efficacy of self-regulated learning interventions on academic achievement in online and blended environments in K-12 and higher education](https://doi.org/10.1080/0144929X.2022.2151935) (the publisher's open-access full text; the three figures were not viewed).
- [Davis, Kizilcec, Hauff & Houben (2018), The Half-Life of MOOC Knowledge: A Randomized Trial Evaluating Knowledge Retention and Retrieval Practice in MOOCs](https://doi.org/10.1145/3170358.3170383) (read as the [ACM-formatted version on the first author's web page](https://dan7davis.github.io/papers/LAK18_Half_Life.pdf); the same experiment also has a journal extension in the Journal of Learning Analytics, which is the version part 10 cites).
- [Mullaney & Reich (2015), Staggered Versus All-At-Once Content Release in Massive Open Online Courses: Evaluating a Natural Experiment](https://doi.org/10.1145/2724660.2724663) (numbers read from the authors' public [HarvardX working paper](https://web.archive.org/web/20150910061550id_/http://harvardx.harvard.edu/files/harvardx/files/ssrn-id2499729.pdf) (2014, the pre-submission author manuscript); the published version's tables were not compared).
- Articles on this site: [Writing a Teaching Article for Readers at Different Levels](/posts/learning/2026-10-14-prior-knowledge-reader-level-en), [How Much of the Spacing Effect Survives in Real Courses](/posts/learning/2026-10-14-spaced-practice-in-real-courses-en), [Building Spaced Review into Teaching Articles](/posts/learning/2026-10-14-spaced-review-in-teaching-articles-en), [How to Order a Series of Teaching Articles](/posts/learning/2026-10-14-series-order-in-teaching-articles-en), [the statistics series map](/posts/learning/2026-08-29-im-stat-series-map-next-steps-en), [the CS231n course overview](/posts/ai/2026-09-30-cs231n-course-overview-en), [Do Readers Answer the Questions in an Article](/posts/learning/2026-10-14-do-readers-answer-embedded-questions-en), [Should a Teaching Article Explain Why It Matters or Add Fun Facts?](/posts/learning/2026-10-14-utility-interest-seductive-details-en), [Do Readers Know Whether They Understood?](/posts/learning/2026-10-14-metacomprehension-in-teaching-articles-en), [Harvard CS50 AI Week 0](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en).
