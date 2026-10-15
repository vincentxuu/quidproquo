---
title: "Should a Teaching Article Have a Comment Section? Evidence on Forum Participation, Reputation Systems, Study Groups, and Q&A Communities"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, social-learning, mooc, self-learning, course-guide, blog]
lang: en
description: "The evidence behind the claim that people who take part in forums and communities learn more: the grade gap between MOOC forum participants and non-participants, the self-selection explanations the authors list themselves, randomized experiments on forum design, the structure of forum interaction networks, case reports on live chat and study groups, a vendor's data on cohort-based courses, and posting on public Q&A communities after ChatGPT. It is set against this site's choice to have no comment section, only Ask AI and glossary pop-ups."
tldr: "MOOC learners who posted in the forum passed at much higher rates than those who did not (57% vs 8% in one course), but the authors themselves call this a correlation under self-selection. Randomly adding a reputation system made replies more numerous and faster, with no difference detected in grades; an instructor replying actively versus not at all showed no difference in completion or engagement. No study has tested what a blog comment section does for readers' learning."
series:
  name: "Writing Articles That Teach"
  order: 21
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-forums-comments-community-learning)

This is Part 21 of the series "Writing Articles That Teach," and the second post in its fifth section, "who you learn with, and who can't read this." [The previous post](/posts/learning/2026-10-14-learning-alone-vs-together-en) covered the evidence and conditions for learning together, and what a person reading an article alone is missing. This post steps back and looks at what is most often offered to fill that gap: comment sections, discussion forums, study groups, and communities such as Discord. It asks one question: **when people who take part in a community learn more, is it the community that makes them learn more, or are the people who would learn more anyway the ones who join?**

The trigger is the shape of this site. Article pages here have no comment section and no place where readers can see each other. Each article has an "Ask AI" sidebar that searches this site's articles first and falls back to a backup answer when it cannot find enough sources; the reader asks and a model answers. Technical terms in the text can be clicked for a glossary explanation at a beginner or advanced level. The writing spec for course guides (`course-guide-contract.md`) says nothing about reader interaction. While writing this series I kept running into one claim: in online courses, people who post in the forum get much better grades. If that is causal, this site is missing something important. If it is not, a comment section is just one more thing to maintain.

Much of the data here comes from MOOCs (massive open online courses on platforms such as Coursera and edX). [Part 19](/posts/learning/2026-10-14-why-readers-dont-finish-en) set out the limits on carrying MOOC numbers over to blog readers. This post keeps those limits and only adds the ones specific to forums. Whether readers answer the questions inside an article is covered in [Part 10](/posts/learning/2026-10-14-do-readers-answer-embedded-questions-en); how much evidence there is for ranking "interactive" above "constructive" work is covered in the ICAP section of [Part 8](/posts/learning/2026-10-14-active-learning-evidence-en).

**How the sources were chosen, and their biases.** I first scanned the literature, then picked sources to read closely. Each source had to measure "participation" and some outcome (grades, completion, posting, careers), and each category had to include at least one study whose authors said the result was a correlation, showed no detected difference, or could not be read causally. There are 13 references, and I read each one in full in the version I could obtain and kept an extraction record. The biases are clear: many observational studies and few randomized ones. Apart from one graduate course, one undergraduate software engineering course, one study group watching MOOC videos together in a flipped classroom, one analysis of a public Q&A platform, one vendor dataset, and one personal blog post, everything is MOOC data, and all of it is in English. **None of these studies measures a blog comment section or interaction among readers of teaching articles.**

## How far MOOC forum numbers carry

[Part 19](/posts/learning/2026-10-14-why-readers-dont-finish-en) listed six limits: the starting point (registering vs clicking in), the end point (passing vs reading to the end), what "coming back" means, external structure (deadlines, certificates), scale (a course vs one article), and the fact that intervention studies sample a small, engaged minority. Forums add two more:

1. **The forum is attached to a graded course.** Most questions in a MOOC forum are about homework and exams. An article has no homework, so readers have different reasons to comment.
2. **Forum readers are not everyone.** In the studies below, the people who post are under 5% of those with a grade or of registrants. More people read threads than post, but most studies have no data on reading.

What does carry is the direction: the gap between participants and non-participants is large, but much of it may come from who chooses to participate; randomly changing forum design moves posting, not grades. Applying this to this site's readers is my inference.

## The conclusions first

| Question | What I have read | Nature of the evidence |
|---|---|---|
| Do people who post in the forum do better? | By a lot. In one edX course, 78% of those who never visited the forum got a final grade of zero, versus 26% of those who did ([Coetzee et al. 2014](https://doi.org/10.1145/2531602.2531657)); in one statistics MOOC, 57% of posters passed versus 8% of non-posters ([Wise & Cui 2018](https://doi.org/10.1145/3170358.3170403)) | Observational; the authors of both say it cannot be read causally |
| What about among people who passed? | No difference in grades was detected between posters and non-posters; those who posted in course-content threads scored about 2 percentage points higher (Wise & Cui) | Observational |
| Post content and grades | Social presence in posts correlated with grades at ρ = 0.39, among the 748 people who posted only; no relationship with later career advancement was found, but only 15 advancers could be tested ([Mehta et al. 2025](https://doi.org/10.1145/3698205.3733930)) | Correlation |
| Peer assessment vs discussion | The group that did more peer assessment had higher project grades; participation pattern explained 3.3% of the variance in grades ([Ou & Joyner 2025](https://doi.org/10.1145/3698205.3733927)) | Post hoc grouping in an online graduate course |
| Randomly changing forum design | Adding voting and reputation points produced more and faster replies per question; no difference was detected in final grades or sense of community (Coetzee et al.) | Randomized experiment in one course |
| Other randomized experiments | Among the MOOC forum experiments in one review, only two measured grades or completion (a reputation system, instructor replies), and neither detected a difference; two others measured only posting, one positive and one negative (my tally from the tables in [the Davis et al. 2018 review](https://doi.org/10.1016/j.compedu.2018.05.019)) | The review's vote-count coding; I did not read the original studies |
| Writing down who will hold you accountable | In an experiment across 247 courses, no difference in completion was detected; activity was higher in the first two weeks ([Kizilcec et al. 2020](https://doi.org/10.1073/pnas.1921417117)) | Large randomized experiment |
| What a review says | 6 of 20 studies were experiments; the authors say causal evidence that social interaction improves learning is insufficient ([Loh et al. 2024](https://doi.org/10.3389/feduc.2024.1345205)) | Narrative review, no effect sizes |
| How information flows in a forum | Interaction splits into many small groups; in simulation, information spreads more slowly than in a random network; only posters are counted ([Gillani et al. 2014](https://doi.org/10.1038/srep06447)) | Network analysis and simulation; learning not measured |
| Switching to live chat with 24-hour TAs | Average posts per student went from 1–2 to 98 ([Bridson et al. 2022](https://doi.org/10.1145/3478431.3499385)) | Historical comparison; learning not measured |
| Study groups watching a course together | Satisfaction was high, and no difference was detected among three ways of watching ([Li et al. 2014](https://doi.org/10.1080/01587919.2014.917708)) | Exploratory study; no learning measure, no solo-watching group |
| Cohorts and per-lesson discussion | Cohort courses completed at 53.4%, self-paced at 41.9%; courses with discussion enabled at 50.9%, without at 37.3% ([Ruzuku 2026](https://ruzuku.com/learn/articles/cohort-vs-self-paced-completion-study)) | Vendor's own data; the vendor writes that it is not causal |
| Public Q&A after ChatGPT | Relative to comparison platforms, posting on Stack Overflow fell by about 15% on average over the six months after release ([del Rio-Chanona et al. 2024](https://doi.org/10.1093/pnasnexus/pgae400)) | Quasi-experiment; measures posting, not learning |

Put together: the correlation between participation and good outcomes is strong. Among randomized experiments, some moved posting (a reputation system) and some did not, or even reduced participation (instructor replies, a collectivist-framed prompt to post); none of those that measured grades or completion detected a difference. No row in the table measures article readers.

## People who participate do better: how big is the gap?

### People who visited the forum or posted

Derrick Coetzee, Armando Fox, Marti Hearst, and Björn Hartmann ran [their 2014 study](https://doi.org/10.1145/2531602.2531657) in a UC Berkeley software engineering course on edX. The core of the study is a randomized experiment (below), but first they compared people who did and did not visit the forum. Among those who never visited the forum but viewed at least some course content, 78% got a final grade of zero; among forum visitors, 26%. The authors write in the same passage:

> Note that because forum users were self-selected, both these results are solely correlational.

Alyssa Friend Wise and Yi Cui's [2018 study](https://doi.org/10.1145/3170358.3170403) used a medical statistics MOOC that Stanford ran in 2014, where the forum was an optional extra. Of the 11,664 people with a grade, 555 posted in the forum, under 5% (my calculation). 57% of posters passed; 8% of non-posters did.

This is the kind of number most often repeated on this topic. The next three sections explain why it cannot be read as *participating makes people learn more*.

### After changing the denominator and the comparison

**Removing people who never did anything.** Among Wise and Cui's graded learners, 71% scored 0.01 or below, meaning they did almost nothing. Removing them leaves 3,350 people, of whom 15% posted; 64% of posters passed versus 32% of non-posters. The abstract's "15% of course learners contributed to the forums" and "64% vs 32%" both refer only to these 3,350 people. The ratio of pass rates shrinks from about sevenfold to twofold (my calculation).

**Looking only at people who passed.** Among the 1,221 who passed, no difference in grades was detected between posters and non-posters. Broken down further, those who posted in course-content threads scored about 2 percentage points higher (0.869 vs 0.845); those who posted only in non-content threads (greetings, technical problems, course logistics) had no advantage. The number of content posts explained 3.2% of the variance in grades. The authors conclude:

> it is critical to note that this research does not document a strong relationship between MOOC discussion participation and course performance.

**Switching to an online graduate course.** Chaohua Ou and David Joyner's [2025 study](https://doi.org/10.1145/3698205.3733927) looked at a for-credit online graduate course (both authors are at Georgia Tech), with 1,451 students from 2020 to 2024. Participation counted for 15% of the grade and came in two kinds: peer assessment and online discussion. The authors split students into four groups after the fact, using the median of each score, and compared project grades (out of 300). The groups with high peer assessment (whatever their discussion level) averaged about 281–282, the discussion-only group 272, and the group low on both 261. The authors themselves say participation pattern explained 3.3% of the variance in grades, a small effect, and that other factors they did not analyze probably matter more.

The abstract says "peer assessment is strongly linked to improved performance," and the conclusion says peer assessment participation "enhances" learning performance. But the design is post hoc grouping with no random assignment, and the participation scores themselves were graded for quality (peer reviews filtered by an AI grader, each discussion post scored for quality), so the participation groups already mix in how well people performed.

**Looking at what people posted.** Shruti Mehta, Ryan Baker, and colleagues' [2025 study](https://doi.org/10.1145/3698205.3733930) used a 2013 MOOC on educational data mining. Of 55,180 registrants, only 748 posted (about 1.4%, my calculation). They used GPT-4o to code social presence in each post (greetings, thanks, addressing people by name, continuing a thread, and so on), after two human coders set a reference standard; human–machine agreement κ ranged from 0.70 to 0.89. Among these 748 people, total social presence correlated with final grade at ρ = 0.389, and use of course keywords at ρ = 0.305. No variables were controlled and nothing was manipulated.

The same paper also looked at career advancement after the course (narrowly defined: publishing at either of two conferences in the field after the course, or joining the field's society within two years). Neither social presence nor keywords was found to be related to career advancement. The authors point out how few people could be tested: "only 15 of those 168 career advancers had participated in the discussion forums." So the accurate version of this half is *no relationship was found in this course's data, but only 15 people could be tested*, not *the forum has nothing to do with careers*.

## Why it cannot be read as *participating makes people learn more*

### Alternative explanations the authors list

Coetzee et al. say the strong correlation between forum use and grades and retention "is difficult to interpret due to a range of possible confounding factors," and list three alternative explanations:

1. More serious students are more likely to hit hard problems that call for help, so they are more likely to go to the forum.
2. People who leave very early never get the chance to use the forum.
3. People without enough English or technical skill can neither use the forum nor do well in the course.

Wise and Cui's version is similar: taking part in discussion might make people learn more, or people who are already more capable and confident might be the ones who take part, or interest and engagement might drive both. Their reading of the pass-rate gap is:

> these contrasting findings suggest that the role of (undifferentiated) forum contribution may relate more to engagement, effort and persistence than directly to learning of course content.

In other words, *did they post* works more like a marker of *are they still here and still working*. A sevenfold gap in pass rates alongside almost no gap in grades among those who passed fits this reading.

### Few people participate, and posting is concentrated

- **Most people never visit the forum.** In Coetzee's course, about two-thirds of those who viewed course content never entered any forum. The authors conclude that improving outcomes overall requires interventions that reach these people.
- **Even fewer post.** Under 5% of Wise and Cui's graded learners; about 1.4% of Mehta et al.'s registrants.
- **Posting is concentrated in a few people.** In Coetzee's two experimental forums, the top 10 posters wrote 54% and 32% of all posts. The authors list as a limitation that they cannot separate these few people's influence from the overall effect.

So a comparison of participants and non-participants compares a small, self-selected group with everyone else.

### People who read but don't post are not counted

Wise and Cui's dataset has no records of reading, browsing, or likes, and the authors say so. Using another study's ratio of roughly two readers per writer, they estimate that "as many as 45%" took part in the forum in some way; that is an estimate, not a measurement. Nabeel Gillani and colleagues' [2014 study](https://doi.org/10.1038/srep06447) did have viewing data: in the first run of a Coursera business strategy course, more than 15,000 people viewed at least one thread and about 4,500 posted.

In every comparison above, these read-only people count as non-participants. Whether reading other people's discussion helps them has not been measured by any study I have. This matters most for this site: on an article with a comment section, most readers would also read the comments without commenting. That is my inference.

### What a review says

Hong Sen Loh and colleagues' [2024 systematic literature review](https://doi.org/10.3389/feduc.2024.1345205) collected 20 studies on interaction among MOOC learners and learning outcomes, with no restriction on design. The abstract reports "clear positive effects" across studies and, in the same sentence, calls for more experiments. The limitations section is more direct:

> while there is strong evidence that social interaction is related to a multitude of favourable learning outcomes, it is arguable that there is insufficient evidence to conclude that there is a causal effect of social interaction on learning outcomes.

Only 6 of the 20 studies were experiments; the rest were case studies, mixed methods, and correlational studies. The review computes no effect sizes and rates no study quality. Its statements about discussion forums and grades are inconsistent, as covered in "Where the sources disagree" below.

## What randomized studies found

### A reputation system: more and faster replies, grades unchanged

Coetzee et al. ran the experiment in the same edX course. When the 1,101 people who consented first entered the forum, they were randomly assigned by username to one of two separate forums. Both were Stack Overflow-style Q&A forums; the full version added up- and down-voting, reputation points earned from votes that unlocked privileges, and the asker choosing a best answer.

- **The forum's own metrics improved.** The full version averaged 3.5 replies per question, the basic version 2.4; median time to first reply was 59 minutes versus 2 hours 20 minutes; 15% of questions in the basic version got no reply, versus only one question in the full version.
- **But fewer people posted.** The full version had more posts overall but fewer people posting.
- **No difference in grades was detected.** Median final grades were 73 versus 71, among only the 89 versus 97 people who signed a broader consent that allowed linking forum activity to grades.
- **No difference in sense of community was detected.** The classroom community scale was 48.5 versus 49.8 (out of 80), with only about forty post-course survey responses per group.
- **Retention**: course retention could not be judged, because more than 85% of this subsample stayed to the end; measured instead as the last visit to the forum, no difference was detected.

The authors characterize the benefits overall as "concrete, yet limited." In the full version, 89% of students said raising their reputation score was "unimportant" or only "a little important"; the main reason they gave for answering was to help others.

This experiment compares a forum with a reputation system against one without; both groups had a forum. It cannot answer the causal effect of having a forum at all.

### Other forum and group experiments

Dan Davis and colleagues' [2018 review in *Computers & Education*](https://doi.org/10.1016/j.compedu.2018.05.019) (not the MOOC experiment cited in [Part 10](/posts/learning/2026-10-14-do-readers-answer-embedded-questions-en); the two papers share some authors) included only randomized controlled experiments: of 7,706 papers in 5 journals and 8 conferences from 2009 to 2017, 126 qualified. It uses vote counting, coding each result as significantly positive, non-significant, or significantly negative, and computes no effect sizes.

From its tables I pulled out the MOOC experiments related to forums and peers (what follows is the review's coding and summaries; I did not read any of the original studies):

- **Forums**: Coetzee 2014 (posting positive; grades and persistence non-significant); Tomkin and Charlevoix 2014, where an instructor replied actively in one forum and not in another, which the review summarizes as "The authors report no differences in either completion rate or course engagement between the two conditions."; Kizilcec et al. 2014, where a collectivist-framed prompt to post actually reduced forum participation; Lamb et al. 2015, positive for forum participation, not described in the text.
- **Groups and peers**: in Kulkarni et al. 2015's small-group video discussions, people in groups with more national diversity did better on the final exam (comparing levels of diversity, not group versus no group); Cambre et al. 2014, positive for test scores, not described in the text; Zheng et al. 2014, algorithmic grouping by preference, time zone, language, and so on, which compared with random grouping had no effect on engagement, persistence, or grades; Labarthe et al. 2016, a peer recommender system, positive for persistence, completion, and engagement.

Of the four forum experiments in MOOCs, only two measured grades or completion (Coetzee; Tomkin and Charlevoix), and neither detected a difference; the other two measured only posting, one positive (Lamb) and one negative (Kizilcec 2014). This is my tally from the tables; the review's authors do not summarize it this way. The tables also include one forum experiment in an ordinary classroom (Beheshitha et al. 2016), which detected no difference in forum participation; it is not part of the count above. The group and peer-matching experiments have several positive results, but each compares something different.

The review also names Cooperative Learning as one of the three most promising strategies (71% of results positive). That share comes mainly from lab studies and purpose-built systems; in the same review, studies in MOOC environments were only 42% positive overall, and studies with more than 500 participants were also 42%.

### Writing down who will hold you accountable

[Part 19](/posts/learning/2026-10-14-why-readers-dont-finish-en) covered Kizilcec et al.'s [2020 *PNAS* study](https://doi.org/10.1073/pnas.1921417117), which put several few-minute writing activities into the opening survey of 247 courses at Harvard, MIT, and Stanford. One of them is social: social accountability, in which learners write down who could hold them accountable, what they would tell them, and when.

In the preregistered target subgroup (students in non-individualist countries), completion changed by +0.89 percentage points, 95% confidence interval −0.22 to 1.99, so no difference was detected. It raised platform activity in the first week, and the difference was still there in the second week. This matches the direction of the reputation-system experiment: participation moved, and no difference in completion was detected.

This intervention is just writing a paragraph; no community is actually built. The sample is people who reached the later part of the survey, about 8.8% of registrants (my calculation from the counts in the paper).

## What actually happens in a forum

Gillani et al. drew each of the eight sub-forums from two runs of the same business strategy course as a network: two people who posted in the same thread are linked. They then used a statistical method to filter out links that might be coincidental.

- **The Study Groups sub-forum was mostly a check-in point.** In both runs, more than two-thirds of the links in this sub-forum were judged non-significant. An informal look at the content showed that most people posted an introduction early in the course and then moved the discussion to Facebook and other platforms.
- **Information gets trapped in small groups.** In spreading simulations on the derived networks, every sub-forum spread information more slowly than a random network with the same number of links per person. The authors sum up: "most information exchange, and by extension, any knowledge construction in the discussion forums occurs in small, short-lived groups."
- **The Cases and Final Project sub-forums were the least fragile.** More key people had to be removed from these two before the network fell apart. In the second run, 8% of the final grade was based on the upvotes a person's forum posts received, and the authors suggest this may have made the networks more stable, using only "may."

The study measured no learning outcome. *Slower spreading* is a simulation, not observed information flow. The authors compared modularity and spreading only by eye and deliberately reported no correlation coefficient because there were few sub-forums.

Loh et al.'s review reports another result: Kellogg et al. 2014 coded MOOC discussion with a five-phase model, and most interaction stayed in phase one (sharing observations, opinions, or examples), rarely going beyond phase three. I did not read the original study.

Wise and Cui's content coding points the same way: among posters who passed, no correlation was detected between the number of non-content posts and grades (only 1 of 6 non-content measures was significant); 5 of 6 content measures were significant, but the strongest was only r = .19.

## Forms beyond the forum

### Live chat with someone answering around the clock

Kathryn Bridson, Jeffrey Atkinson, and Scott Fleming's [2022 experience report](https://doi.org/10.1145/3478431.3499385) comes from an undergraduate software engineering course at the University of Memphis. In spring 2021, during pandemic remote teaching, they replaced the Piazza forum and in-person office hours with Discord and added two TAs working shifts so that someone could answer for most of the day. The first two authors were TAs for the course.

Compared with the previous three semesters of the same course (in person, using Piazza), average posts per student went from 1–2 to 98 (median 37), and the share of students who posted at least once went from about 40% to 90%. Posts clustered in the evening (19:00 to 5:00 accounted for 65%) and on Tuesday through Thursday (over 70%); the authors suggest the latter is linked to deadlines falling on those days. Students posted clearly more in the first half of the semester than in the second.

The report has no grades or learning outcomes. The comparison semesters differ at once in platform, TA staffing, and mode of teaching (in person vs remote), and the counting unit also differs (formal Q&A forum posts vs chat messages). The authors say they cannot separate the effect of Discord itself from having someone answer around the clock, and note that "after all, this was an experience report regarding a single course." Staffing cost is also a limitation they list: the TA hours needed far exceeded one TA's 20 hours a week.

### Study groups watching a course together

Nan Li, Pierre Dillenbourg, and colleagues' [2014 study](https://doi.org/10.1080/01587919.2014.917708) had 54 engineering students at EPFL in Lausanne, in groups of 4–5, meet once a week for five weeks to watch MOOC videos together and do the quizzes; each was paid 150 Swiss francs. It compared three ways of watching: one big screen with one controller, one big screen with a mouse for each person, and a tablet with headphones for each person.

- Self-rated discussion quality was high in every condition (about 4.0 to 4.2 on a 5-point scale), with no difference detected among the three.
- In the tablet condition, people whose viewing was more synchronized with the group rated discussion quality and equality of contribution higher. This was computed in only 3 groups.
- In interviews, participants said studying together was more motivating and more effective than studying alone. That is self-report; the authors state they did not measure learning outcomes and had no solo-watching control group: "we cannot conclude the relative value of group versus individual learning with MOOCs."

### Cohorts and per-lesson discussion

Abe Crystal, CEO of the online course platform Ruzuku, published an [analysis of the company's own data](https://ruzuku.com/learn/articles/cohort-vs-self-paced-completion-study) on its website in 2026, covering 27,156 courses and 1.31 million enrollments from 2012 to 2026, mostly small paid courses in coaching, continuing education for therapists, yoga, and similar fields.

- "Scheduled Cohort" courses that release content on a calendar completed at 53.4%; self-paced courses with everything open at once completed at 41.9%. The page states these are observed differences between course groups, "not evidence that deadlines or live sessions caused higher completion." The "Scheduled Cohort" label only means calendar-based release; whether there were live sessions or peer interaction was not classified.
- Courses with at least one per-lesson discussion enabled completed at 50.9% per enrollment; those without, 37.3%. The page immediately adds: "Enabled does not mean students actively participated."

The analysis reports no variance and no tests, its course and enrollment counts do not add up, the "2,000" in the title appears nowhere in the text, and the page ends with a sales pitch for the platform. It can serve only as an example of an industry observation that the vendor itself says is not causal.

## Public Q&A after ChatGPT

Everything above is a community inside a course. On the open web, the largest technical Q&A community is Stack Overflow. Maria del Rio-Chanona, Nadzeya Laurentsyeva, and Johannes Wachs's [2024 study](https://doi.org/10.1093/pnasnexus/pgae400) compared Stack Overflow with four platforms less affected by ChatGPT at the time (two math Q&A sites, the Russian-language Stack Overflow, and the Chinese site Segmentfault), using difference-in-differences to estimate the change after ChatGPT's release.

- Over the six months after release, posting on Stack Overflow fell by about 15% on average relative to the comparison platforms; by the end of April 2023 the weekly estimate had settled at about 25%. The abstract gives only the 25%. The authors think the comparison platforms may also have been affected, so they treat this as a lower bound.
- Questions alone fell by about 10%, only marginal at p < .1.
- No change in post quality, measured by votes, was detected.
- New users' posting fell only slightly; somewhat experienced users fell more, mainly in answers.

The study measures posting on a public platform, not anyone's learning. The point relevant to this site: what this site gives readers is an AI Q&A sidebar, not public Q&A among readers. What a reader asks in the sidebar is invisible to other readers; questions and answers in a comment section are visible to later readers. No study has tested how these two approaches differ for readers' learning; connecting the Stack Overflow trend to this choice is my inference.

## This site

This site has no comment section. The production site loads at least Cloudflare Web Analytics, whose traffic statistics are aggregate, with no data on individual readers' behavior; nothing on the site can show whether readers want to comment or would read comments.

Tech blogger Raymond Camden's [2024 short post](https://www.raymondcamden.com/2024/01/02/the-return-of-the-comments) is a first-person example, not a study. The blog has run for more than twenty years and once had many comments, but "eventually, folks simply stopped commenting," so the comment feature was removed. Webmentions came next, which "works ok, but doesn't really feel the same." From 2024 the blog switched to Giscus, which uses GitHub Discussions as comments, enabled only on new posts and requiring a GitHub account to comment. The post has no numbers and does not discuss learning.

## Where the sources disagree

The results below point in different directions, or look contradictory while measuring different things. I list them side by side without picking a side.

**How strong is the link between forum participation and grades?** Looking at everyone, Coetzee et al. and Wise and Cui find large gaps (zero grades 78% vs 26%; passing 57% vs 8%). Looking only at those who passed, Wise and Cui detect no difference in grades between posters and non-posters, and conclude that no strong relationship was documented. The difference lies in what is compared: the former mixes in whether people were still in the course, the latter compares only people who stayed.

**Two statements in the same review.** Loh et al. write in the results section that the link between discussion-board interaction and final grades is "unclear," citing Zhang et al. 2017 as finding no significant relationship; in the synthesis section they write that "consistent findings" show discussion forums lead to higher grades, listing Zhang 2017 as support. The abstract says "clear positive effects"; the limitations section says causal evidence is insufficient.

**Causal wording in abstracts versus the designs in the text.** Ou and Joyner's abstract says peer assessment is "strongly linked" and the conclusion says it "enhances," while the text uses post hoc grouping that explains 3.3% of the variance. Mehta et al.'s abstract says forum engagement "enhances academic achievement," while the text has only correlations. Bridson et al.'s abstract says the Discord approach "led to" a large increase in interaction, while the text is a historical comparison across semesters and modes of teaching.

**Did underrepresented groups post less?** Bridson et al.'s abstract says students from groups underrepresented in computer science interacted at a rate comparable to other students. The text rests on a non-significant result at p ≥ 0.2: the underrepresented group's average posts were about two-thirds of other students', and women's about 60% of men's (both ratios are my calculations), with large standard deviations and small numbers. So no difference was detected; that is not the same as posting the same amount. The authors add that Discord does not allow anonymity, which may suppress women's posting.

**How much did posting fall after ChatGPT?** del Rio-Chanona et al.'s six-month average is 15%; the 25% in the abstract is the weekly estimate at the end of the period. The authors report another study using synthetic control (Burtch et al. 2024) that found a drop of about 20% within 15 weeks, but that study found new users dropping sharply, while this one found experienced users dropping more; the authors say resolving this ambiguity is left for future work.

**Is collaborative learning the most promising strategy, or middling in MOOCs?** Davis et al.'s conclusion names Cooperative Learning as one of the three most promising strategies (71% positive). In the same review, MOOC-environment studies were 42% positive overall, and MOOC studies make up only a small part of this category.

## This site's practices, checked against the evidence

| This site's practice | Related evidence | Evidence-based, or this site's choice? |
|---|---|---|
| No comment section on article pages | Evidence that participants do better is all observational, and the authors call it a correlation under self-selection (Coetzee, Wise & Cui, Mehta, Ou & Joyner); randomly changing forum design moved posting, with no difference detected in grades or completion (Coetzee; experiments tallied from Davis) | This site's choice. The evidence supports neither *should add* nor *adding would hurt*; no study has tested a blog comment section |
| Each article has an Ask AI sidebar, drawing mainly on this site's articles, invisible to other readers | Posting on a public Q&A platform fell after ChatGPT (del Rio-Chanona); that measures posting, not learning | This site's choice. No study has compared AI Q&A with public Q&A among readers for learning |
| Technical terms open a glossary explanation at beginner or advanced level | Most people never visit the forum (about two-thirds in Coetzee); under 5% post (Wise & Cui); help placed in the article is something every reader can reach | This site's choice. The reach argument is my inference; which terms deserve a definition was discussed in [Part 4](/posts/learning/2026-10-14-notation-jargon-terminology-en), and no study answers it directly either |
| The author does not reply to readers under articles | An instructor replying actively in a forum versus not at all showed no difference in completion or engagement (Tomkin & Charlevoix, as summarized by Davis) | A single experiment known only secondhand; never tested on article readers |
| No cohorts, study groups, or Discord | Higher cohort completion is a vendor's observation that the vendor says is not causal (Ruzuku); the study-group study did not measure learning (Li); the Discord report did not measure learning (Bridson) | The evidence does not support adding them; the last two also need ongoing staffing |
| The course guide spec has no reader-interaction requirement | Same as above | This site's choice |

## What you can do

These are my judgments; each one names the results it rests on.

1. **Don't add a comment section or community because of numbers like *community participants score N times higher*.** Basis: such numbers all come from observational studies whose own authors call them correlations and list self-selection explanations (Coetzee, Wise & Cui); among those who passed in Wise and Cui, no difference in grades was detected between posters and non-posters; among randomized forum experiments, the two that measured grades or completion both detected no difference (Coetzee; Tomkin & Charlevoix, as summarized by Davis). These are MOOC results; applying them to articles is my inference. In practice: if you open a comment section, state the reason as *readers have a place to report errors and ask about what's missing*, not *interaction makes readers learn more*.
2. **Put the answers to where readers are most likely to get stuck in the body of the article, not in comments or a community.** Basis: about two-thirds of people in Coetzee's course never entered the forum, and the authors themselves recommend interventions that reach them; under 5% posted (Wise & Cui); forum information mostly stays trapped in short-lived small groups (Gillani). In practice: after finishing a section, write down the one question a reader is most likely to ask, and add a sentence answering it or a prerequisite link in that section.
3. **If you have comments or any channel for reader feedback, move the questions and answers back into the article.** Basis: thread viewers outnumbered posters more than threefold (Gillani), though *most readers read only the body* is my inference; a Q&A left in a thread is seen only by those who scroll there. In practice: when you answer a question, also edit the matching paragraph of the article and post only a link to that paragraph in the comment.
4. **Don't judge how well an article teaches by comment counts, posting volume, or community activity.** Basis: posting volume swings widely with platform design (Coetzee's reputation system; Bridson's Discord with 24-hour TAs), and in these studies it either came with no detectable difference in learning or learning was not measured; Ruzuku itself writes that enabling discussion does not mean anyone participated.
5. **When citing research linking community participation to learning, state the comparison and the denominator.** Basis: Wise and Cui's "64% vs 32%" covers only those scoring above 0.01, about 29% of graded learners (my calculation); Mehta et al.'s ρ = 0.39 covers only the 1.4% who posted (my calculation of the share); the abstracts of Ou & Joyner, Mehta et al., and Bridson et al. all use causal wording that the text cannot support.

## Three things you can do tonight

Pick a teaching article you have written, about an hour:

1. Imagine three readers who get stuck halfway, and write down one sentence each would ask. For each, add a sentence of answer or a link at the matching place in the body.
2. If you have a comment section, forum, or community, find questions that have been asked two or more times recently, write the answers back into the article, then post a link to that paragraph in the thread.
3. Search your articles, slides, or course pages for phrases like *community participants* or *forum users*. For any that include numbers, add which course it was, who the denominator is, and whether it is a correlation; delete any you cannot trace to a source.

## Limits of this evidence

- **None of these studies measures a blog comment section or interaction among readers of teaching articles**, and this site's traffic statistics are aggregate, with no data on individual readers' behavior. Every transfer is an inference; for the MOOC limits see [Part 19](/posts/learning/2026-10-14-why-readers-dont-finish-en) and the opening section.
- **There is little causal evidence.** Of the 13 sources, the only ones with random assignment that measured grades or completion are Coetzee (comparing reputation systems, not forum versus no forum) and Kizilcec 2020 (writing a paragraph, not building a community). For the other experiments in Davis, I read only the review's coding and summaries.
- **There is almost no data on people who read but don't post.** Wise & Cui, Gillani, and Mehta all look only at posts; whether reading others' discussion affects learning has not been directly tested by any study.
- **Samples and settings are concentrated.** Mostly MOOCs from 2013–2014; Ou & Joyner is a for-credit graduate course, Bridson a remote undergraduate course, Li 54 paid engineering students, Ruzuku small paid courses.
- ***Learning more* is measured in many ways**: passing, final grade, project grade, completion, career advancement, self-rated discussion quality. Several studies measured no learning at all (Gillani, Bridson, Li, del Rio-Chanona).
- **Authors' relationship to the data.** Bridson's first two authors were the TAs providing the help; the Ruzuku analysis was written by the platform's CEO; for the other interventions Kizilcec 2020 scaled up, the original studies were by the same group of authors, while the social accountability intervention used here had not been tested in online courses before.
- **My inferences**: that the direction of MOOC forum results carries over to article readers; that most readers read comments without commenting; the difference between AI Q&A and public Q&A for other readers; that help placed in the article reaches more people; that moving Q&A into the body lets more people see it; and the three things to do tonight. Each is flagged in the text or listed here.
- **Numbers I calculated or tallied myself**: Wise & Cui's under 5% and 29%; Bridson's about 67% more; Mehta's 1.4%; the tally that the two forum experiments in Davis's review that measured grades or completion both detected no difference; Wise & Cui's pass-rate ratio shrinking from about sevenfold to twofold; Bridson's two-thirds and 60%; Kizilcec 2020's 8.8%.
- **Secondhand citations**: Tomkin & Charlevoix 2014, Kizilcec et al. 2014, Lamb et al. 2015, Kulkarni et al. 2015, Cambre et al. 2014, Zheng et al. 2014, and Labarthe et al. 2016 as summarized by Davis et al.; Kellogg et al. 2014 and Zhang et al. 2017 as summarized by Loh et al.; Burtch et al. 2024 as reported by del Rio-Chanona et al. I read none of the originals.
- **Seen during scanning but not used**: research on debugging with Q&A sites, a qualitative study of MOOC study groups in Taiwan, and research on HarvardX and MITx learner backgrounds were listed only as alternates, not read closely, and are not cited.

## Appendix: design and numbers for each study

The main text keeps one or two numbers per item; the rest are here.

**Coetzee, Fox, Hearst, Hartmann (2014)**, CSCW '14, published version, released by the authors under CC BY 3.0. edX CS169.1x, started March 2013, seven weeks; 5,985 registered, 532 passed. 1,101 consented to the forum experiment (548 full, 553 basic; later tests use 546 and 555, with the difference unexplained). Correlational analysis: 1,572 forum users and 3,221 non-users; zero-grade share 78% vs 26% (Table 3 gives 88% vs 26%), median grade 22% vs 0%, Mann-Whitney p < .001; median retention 39 vs 19 days (of 42); differences on every homework and quiz except the last two homeworks, counting only those who submitted. Experiment: replies per question 3.5 vs 2.4 (Table 3 gives 2.3), p < .001; median time to first reply 59 minutes vs 2 hours 20 minutes, replied within an hour 50% vs 30%; users of the full version were less likely to post (p ≈ .036); top 10 posters wrote 54% vs 32%. Median final grade 73 vs 71 (89 vs 97 people, p > .4); course retention data insufficient; median last forum visit 24.5 vs 26.1 days (p > .2); Rovai community scale 48.5 vs 49.8 (43 vs 40 responses, p > .7); appeals for help 2.9% vs 7.3% (p ≈ .0002; the authors say these may be mere complaints); median forum usefulness 2.0 in both (0 to 4). Limitations the authors list: one course, one run, students familiar with forums; a few hyperactive users; 67% consented to participate, 20% to grade linkage, 8% answered the survey; correlation is not causation; the experimental forums were on another domain, and students might have communicated via the original forum or Facebook; only a Q&A-style forum was tested.

**Wise & Cui (2018)**, LAK '18, ACM published version. StatMed'14 on Stanford's Lagunita platform, 2014. 11,664 with grades, 565 forum accounts, 555 with both; passing threshold 0.6. All graded learners: posters passed 57%, non-posters 8%, χ²(1) = 1,332.20. After excluding the 8,314 (71%) scoring 0.01 or below, 3,350 remained, 492 (15%) of them posters: 64% vs 32%. Non-content threads only: 178 people, 57% passed; content threads only: 165, 60%; both: 149, 77%. Those who posted in both also posted more (median 4 threads vs 1), and the authors say diversity and quantity cannot be separated. Passers: 315 posters vs 906 non-posters, t(1,219) = 1.610, p = .107; content posters 0.869 vs others 0.845, p = .002. Number of content posts r = .188, final model R²adj = .032; network centrality measures added no explanatory power. Content classifier accuracy > .81. Limitations the authors list: one course, forum an optional supplement, no reading data, causality unclear, grade a black-box measure.

**Mehta, Srivastava, Liu, Vanacore, Baker (2025)**, L@S '25, read as the accepted manuscript on NSF PAR. Coursera's Big Data in Education, first run in 2013, 55,180 registered, 748 posted, 3,109 posts and comments. Two of the original study's social presence indicators were dropped. GPT-4o coding, human–machine κ 0.70 to 0.89 per indicator. Spearman correlations (N = 748): total social presence 0.389; continuing a thread 0.387, asking questions 0.339, complimenting and thanking 0.328, self-disclosure 0.286, expressing agreement 0.224, greetings 0.125; course keywords 0.305; all p < .001. 168 career advancers (153 + 35 = 188, overlap unexplained), 15 of whom posted. Ridge logistic regression controlling for post count: social presence β = 0.0002 (95% CI −0.0001 to 0.0006), p = .512; keywords p = .415. No limitations section; the discussion notes too few advancers and career factors outside the course.

**Ou & Joyner (2025)**, L@S '25, ACM published version. An online graduate project course, spring 2020 to fall 2024, 1,451 students, 73.3% male, mean age 31. Peer assessment score > 55.5 and discussion score > 12.0 counted as substantive participation: both, 370; peer assessment high, 358; discussion high, 350; both low, 373. Project grades (0 to 300): 282.21 (SD 17.27), 281.01 (29.98), 272.44 (52.42), 260.81 (68.35). F(3, 1447) = 16.63, p < .001, η² = .033. Games-Howell: high peer assessment vs both, no difference (p = .909); high peer assessment above discussion-only (p = .005); both also above discussion-only (p = .039); discussion-only above both low (p = .050). Post-course survey, 1,054 people: value of peer assessment 4.93, value of discussion 4.65 (7-point scale); β predicting perceived peer support 0.42 vs 0.26, with the difference between coefficients untested. No limitations section.

**Loh, Martins van Jaarsveld, Mesutoglu, Baars (2024)**, Frontiers in Education, published version, CC BY. Searched Scopus and ERIC in May 2023, 180 records, 20 included: 7 case studies, 4 mixed methods, 6 experiments, 3 correlational. 9 on discussion forums, 10 on groups, 2 one-to-one. Four outcome types: knowledge, social engagement, learning engagement, learner experience. No effect sizes, no quality rating; study selection by one researcher. Secondhand: one-to-one peer discussion raised quiz scores, but few of those invited actually talked (Zhang 2017); volunteer-led groups are hard to scale (Gamage 2021); Anderson 2020 detected no pre–post difference on most components, while interviews said groups helped. Internal inconsistencies: "unclear" and "consistent" in two places; Manli 2014 is not in the included list but is cited as an included study; Table 2's check marks do not match the n in the text.

**Gillani, Yasseri, Eynon, Hjorth (2014)**, Scientific Reports 4, published version, CC BY-NC-SA 4.0. Two runs of a Coursera business strategy course: spring 2013, nearly 90,000 registered, about 4,500 posters, over 15,000 thread viewers; fall 2013, over 77,000, about 3,300, 11,500. Eight sub-forums analyzed separately (overlap between sub-forums mostly under 3%). Share of links filtered out: technical feedback 89% in both runs, study groups 72% and 71%, cases 44% and 39%. The study groups sub-forum had the highest normalized modularity (4.21 and 5.92). SI contagion simulations (averaged over 400 runs) spread more slowly than degree-preserving random networks in every sub-forum. In the second run, 8% of the final grade was based on upvotes. Supplementary information not obtained.

**Li, Verma, Skevi, Zufferey, Blom, Dillenbourg (2014)**, Distance Education 35(2), read as the authors' final manuscript in EPFL's repository; the published version was not read. An earlier short version with a different title and different numbers exists and is not cited. Five weeks in spring 2013, 54 people (11 women), 12 groups; 9 groups from a numerical analysis course (French, first year), 3 from a digital signal processing course (English, master's). 4 groups per viewing condition, with no description of how they were assigned. Statistics used only the numerical analysis groups. Self-rated discussion quality: 4.12 overall, 4.17, 4.14, 4.03 by condition, with no test statistic reported. The shared-screen-plus-mouse-each condition spent more time on videos and paused more (p < .05, p < .005). In the tablet condition, synchronization with self-rated discussion quality β = 1.308 and with equality of contribution β = 1.438 (p < .05).

**del Rio-Chanona, Laurentsyeva, Wachs (2024)**, PNAS Nexus 3(9), published version, CC BY 4.0. January 2022 to the end of May 2023, 48 weeks before release and 25 after; difference-in-differences on log(weekly posts), standard errors clustered by month. All posts −0.163 (p < .05, about 15%); questions only −0.105 (p < .1, about 10%); weekdays only −0.151 (about 14%). By experience: new users −0.083, 1–10 posts −0.245, 11–100 posts −0.254, more than 100 posts −0.168. Languages with more GitHub repositories fell more (ρ = −0.45). In a developer survey, ChatGPT users were about 0.8 percentage points less likely to contribute weekly, which the authors call a modest magnitude. Extended to May 2024, weekly posts fell from 60,000 to 30,000, but the authors do not extend the difference-in-differences because the comparison platforms were later affected too. Supplementary data not read.

**Bridson, Atkinson, Fleming (2022)**, SIGCSE '22, ACM published version. Spring 2021, 52 students (14 women, 22 from groups underrepresented in computing). Seven weeks of individual skill assignments, then seven weeks of team projects. Comparisons: fall 2018 (52), spring 2019 (27), fall 2019 (35), in person with Piazza. Mean posts 98.2 (SD 150.3) vs 1.0, 2.0, 1.5, each comparison p < .0001; posted at least once 90% vs 38%, 41%, 37%. Students posted 5,105 messages in total, the top four 489 to 674 each; instructors 2,890. Underrepresented 75.7 vs 114.6, women 65.2 vs men 110.3, p ≥ 0.2. 19:00 to 5:00 accounted for 65%; Tuesday to Thursday over 70%. First half of the semester 3,195 messages, second half 1,910 (the paper says the first half was 40% greater; from its own numbers it is about 67% greater). University teaching evaluation item "had an opportunity to ask questions" 4.89/5 (36 people), with no earlier semesters to compare. No data on voice channels.

**Davis, Chen, Hauff, Houben (2018)**, Computers & Education 125, read as the published version in the TU Delft repository. Every paper in 5 journals and 8 conferences, 2009 to July 2017, screened against: scalable, randomized controlled, at least 10 participants, adults; 126 of 7,706 papers, 132,428 participants. Vote counting, no effect sizes or quality appraisal, registered on OSF. MOOC environments 42% positive, 56% non-significant; purpose-built systems 59% positive. Studies with more than 500 participants 42% positive, 10–100 participants 60% (p < .05). Experiments with money incentives 61% positive, without incentives 49%. Cooperative Learning: 17 papers, results 17 positive, 6 non-significant, 1 negative. Forum experiment samples: Kizilcec 2014a 11,429, Lamb 2015 4,777, Coetzee 2014 1,101, Tomkin & Charlevoix 2014 20,474; group experiments: Kulkarni 2015b 2,422, Cambre 2014 2,474, Zheng 2014 1,730, Labarthe 2016 8,673. No limitations section.

**Kizilcec, Reich, Yeomans et al. (2020)**, PNAS 117(26), published version and SI Appendix. For the design and other interventions, see the appendix of [Part 19](/posts/learning/2026-10-14-why-readers-dont-finish-en). Social accountability ran only in the second year (January 2018 to May 2019). Completion (students in non-individualist countries) +0.89 percentage points (−0.22 to 1.99), t = 1.58, p = .115. Platform activity (log event counts): week 1 β = 0.0788 (p = .006), week 2 0.0939 (p < .001).

**Crystal (2026), Ruzuku**, an article on the vendor's website, not peer reviewed, and the page gets updated. 27,156 courses and 1,316,272 enrollments, 2012 to 2026. Cohort: 337,700 enrollments, 53.4%; drip release: 213,519, 42.9%; all open at once: 702,497, 41.9% (the three sum to less than total enrollments). By cohort size: 1–10 people 51.5%, 11–25 65.2%, 26–50 62.0%, 51–100 56.8%, more than 100 "51.3% (48.3% for large)." With per-lesson discussion: 17,190 courses, 50.9%; without: 9,442, 37.3%. With quizzes or reflective assessments 59.1%, content only 42.4%. No variance or tests anywhere.

**Camden (2024)**, personal blog. No numbers; does not discuss learning.

## References

Each was read in full in the version I could obtain, with an extraction record; versions and unread parts are noted in parentheses.

- [Coetzee, Fox, Hearst & Hartmann (2014), Should Your MOOC Forum Use a Reputation System?](https://doi.org/10.1145/2531602.2531657) (ACM published version, released by the authors under CC BY 3.0).
- [Wise & Cui (2018), Unpacking the Relationship between Discussion Forum Participation and Learning in MOOCs: Content is Key](https://doi.org/10.1145/3170358.3170403) (published version, open access in the ACM Digital Library).
- [Mehta, Srivastava, Liu, Vanacore & Baker (2025), Do MOOC Conversations Matter? Investigating the Role of Social Presence and Course-Relevant Discussion in Career Advancement](https://doi.org/10.1145/3698205.3733930) (read as the [accepted manuscript on NSF PAR](https://par.nsf.gov/biblio/10648067); the published version is in the ACM Digital Library; the OSF digital appendix was not read).
- [Ou & Joyner (2025), Assess or Discuss: Comparing Peer Assessment and Online Discussion for Enhancing Learning at Scale](https://doi.org/10.1145/3698205.3733927) (published version, open access in the ACM Digital Library).
- [Loh, Martins van Jaarsveld, Mesutoglu & Baars (2024), Supporting social interactions to improve MOOC participants' learning outcomes: a literature review](https://doi.org/10.3389/feduc.2024.1345205) (published version, open access).
- [Gillani, Yasseri, Eynon & Hjorth (2014), Structural limitations of learning in a crowd: communication vulnerability and information diffusion in MOOCs](https://doi.org/10.1038/srep06447) ([published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5388276/); supplementary information not read).
- [Li, Verma, Skevi, Zufferey, Blom & Dillenbourg (2014), Watching MOOCs together: investigating co-located MOOC study groups](https://doi.org/10.1080/01587919.2014.917708) (read as the [authors' final manuscript in EPFL's repository](https://infoscience.epfl.ch/handle/20.500.14299/104042); the published version was not read).
- [del Rio-Chanona, Laurentsyeva & Wachs (2024), Large language models reduce public knowledge sharing on online Q&A platforms](https://doi.org/10.1093/pnasnexus/pgae400) ([published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11421660/), CC BY 4.0; supplementary data not read).
- [Bridson, Atkinson & Fleming (2022), Delivering Round-the-Clock Help to Software Engineering Students Using Discord: An Experience Report](https://doi.org/10.1145/3478431.3499385) (published version, open access in the ACM Digital Library).
- [Davis, Chen, Hauff & Houben (2018), Activating learning at scale: A review of innovations in online learning strategies](https://doi.org/10.1016/j.compedu.2018.05.019) (read as the [published version in the TU Delft repository](https://repository.tudelft.nl/file/File_a9cf537f-342d-4ac3-8ebe-33bb5897d41e); the original studies in the review were not read).
- [Kizilcec, Reich, Yeomans et al. (2020), Scaling up behavioral science interventions in online education](https://doi.org/10.1073/pnas.1921417117) ([published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7334459/) and SI Appendix).
- [Crystal (2026), What 2,000 Course Launches Tell Us About Cohort vs. Self-Paced Completion (Ruzuku)](https://ruzuku.com/learn/articles/cohort-vs-self-paced-completion-study) (vendor website article, accessed 2026-10-14; the CSV attached to the page was not downloaded).
- [Camden (2024), The Return of the Comment(s)](https://www.raymondcamden.com/2024/01/02/the-return-of-the-comments) (personal blog).
- Posts on this site: [What reading alone misses](/posts/learning/2026-10-14-learning-alone-vs-together-en), [Why most online self-learners don't finish](/posts/learning/2026-10-14-why-readers-dont-finish-en), [Do readers answer the questions in an article?](/posts/learning/2026-10-14-do-readers-answer-embedded-questions-en), [What the evidence for "learning by doing" measures](/posts/learning/2026-10-14-active-learning-evidence-en), [How to handle terminology, notation, and formulas in teaching articles](/posts/learning/2026-10-14-notation-jargon-terminology-en).
