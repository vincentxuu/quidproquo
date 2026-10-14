---
title: "Do Readers Answer the Questions in an Article: Evidence on Response Rates, Skipping, Peeking at Answers, and Hints"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, retrieval-practice, self-learning, course-guide, blog]
lang: en
description: "Research on how many learners answer embedded questions and how many skip them or look at the answer first: in-video quizzes, pop-up review questions, optional summary tasks, interactive textbooks for credit, a self-study ebook for teachers, experiments where learners choose between testing and restudy, and a log analysis of homework copying. Also how much evidence there is for grading, question format, hints, and placement, and whether a hint outside a collapsed answer gives the answer away."
tldr: "Large-sample records of \"did anyone answer when the question appeared\" come only from MOOCs: for a question shown in the player when the video reaches its position, about 74% of people who started that video answered; for pop-up review questions, about 70% of multiple-choice and about 40% of type-a-number questions were attempted. Under random assignment, about half as many people did a task that required typing as did one that only required ticking a box. None of the studies I read measured readers of public articles, and this site has no data either."
series:
  name: "Writing Articles That Teach"
  order: 10
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-do-readers-answer-embedded-questions)

This is part 10 of the series "Writing Articles That Teach," in its second section, "what to ask readers to do." [Part 8](/posts/learning/2026-10-14-active-learning-evidence-en) looked at what the evidence for learning by doing measures, and [part 9](/posts/learning/2026-10-13-teaching-text-questions-feedback-en) covered how to write the questions in an article and how to give the answers. Both rest on an unstated assumption: that readers answer. This post goes back and checks that assumption.

The trigger was this site's course-guide spec. It requires a question at the end of every major section, with an answer or a criterion. In practice the question is labeled "Check yourself. Write your answer down before opening the fold," and the answer sits inside a `<details>` block that opens only when clicked. The format rests on three untested assumptions: readers stop to answer, they do not open the answer first, and when they answer they actually try. [Part 7](/posts/learning/2026-10-14-interactive-figures-in-teaching-articles-en), on interactivity, left one more question open: should there be a hint outside the collapsed block, and would that hint give the answer away? This post handles that too.

First, a gap. This site has no reading-behavior data at all. I checked on 2026-10-13: neither the site's code nor the published article pages load any analytics tool, so I do not know how many readers have opened an answer here. Every number below comes from some other setting.

**How these studies were chosen and read.** I did one scanning pass, then picked 12 studies from it and read each from start to finish. The criterion was whether the study measured how much learners actually did: answering, skipping, looking at the answer first, choosing to test or to restudy. The selection is clearly skewed: mostly MOOCs (large open online courses on Coursera and edX), college courses taken for credit, or online experiments with paid participants; English-language literature; and several studies written by the people who built the courseware or platform. **None of them measured readers of public articles or blogs.** Carrying these numbers over to a web course guide is my inference, and I flag it every time I do it.

## Conclusions first

| Question | What I found | Nature of the evidence |
|---|---|---|
| When a question appears inside what the reader is watching, how many answer | Questions shown in the player when the video reaches their position: 74% of people who started that video submitted an answer ([Kovacs 2016](https://doi.org/10.1145/2876034.2876041)); not required, not graded, with a skip button | Log analysis of one course, no comparison group, no tests |
| Questions that pop up automatically and cover earlier weeks | When a question popped up, about 70% of multiple-choice and about 40% of type-a-number questions were attempted; only about one in five of those assigned ever touched one; no difference detected in grades ([Davis et al. 2018](https://doi.org/10.18608/jla.2018.53.3)) | Randomized experiment in one course, low compliance; low power is my judgment |
| Typing versus ticking a box | About half as many people wrote summaries as read them; writing, reading, and doing nothing: no difference detected in grades across the three groups ([van der Zee et al. 2018](https://doi.org/10.1145/3170358.3170382)) | Randomized experiment in one course |
| Graded or not | Two classes with no points: 53% completion; the levels with points: 88% to 94% ([Edgcomb & Vahid 2015](https://zybooks.com/wp-content/uploads/2016/06/How-Many-Points-Should-Be-Awarded-for-Interactive-Textbook-Reading-Assignments_.pdf)) | Cross-class comparison, no tests, authors affiliated with the platform |
| When the answer is one click away, how often learners try first | Averages of 81% to 87% across three types of school for questions attempted before viewing the answer, falling later in the term ([Yuen et al. 2016](https://peer.asee.org/will-students-earnestly-attempt-learning-questions-if-answers-are-viewable.pdf)) | One term of logs, for credit, authors affiliated with the platform |
| After a wrong answer | Most people answer again within seconds; few go back to the video (Kovacs 2016) | Same log analysis |
| When readers can choose | With only a test option and a see-it-again option, about 20% chose the test; with test-with-a-hint options added, 71% chose some form of test ([Vaughn & Kornell 2019](https://doi.org/10.1186/s41235-019-0187-y)) | Cross-experiment comparison of two different samples, word pairs |
| Does a hint make the question useless | When the answer cannot be guessed, no difference detected on the final test between hint and no hint; when the hint is strong enough to guess the answer, it did worse than a weak hint (same source) | Word pairs, test after 2 minutes |
| People who copy answers outright | The heaviest copiers scored 1.3 standard deviations lower on the final than the low-copying group; gains on a concept test were unrelated to how much they copied ([Palazzo et al. 2010](https://doi.org/10.1103/PhysRevSTPER.6.010104)) | Correlational; the authors say the data also support the reverse causal direction |
| Readers of public articles | No source at all | This site has no data either |

## How many people answer

The six sets of numbers below come from six settings. Their denominators all differ; the last subsection explains why they cannot be lined up side by side.

### Questions shown in the video player

Geza Kovacs's [2016 study](https://doi.org/10.1145/2876034.2876041) analyzed viewing logs from a machine learning course on Coursera (the October 2013 to January 2014 run). When the video reached certain points, the player showed a short auto-graded question. The video paused when this happened; the paper does not describe that directly, and it is inferred from one sentence about the logs. The questions were not required and not graded, and the screen had a "Skip" button. Half of the questions fell in the last tenth of a video.

Counting only the 92 videos with exactly one question, 74% of people who started a video submitted an answer, while only 66% watched to the end. The author's explanation is that many people left right after answering, and most questions sat near the end. Even among certificate earners, only 79% answered; the author notes that they too skip a few optional videos and questions.

When people dragged the progress bar forward, they crossed quiz positions less often than other points in the video; the author writes that users "tend not to" skip the quizzes. That means less often, not never: there were still more than ninety thousand forward drags across quizzes.

The paper reports descriptive proportions only, with no statistical tests and no measure of learning. Videos with questions had lower mid-video dropout, and the author says this does not establish causation: those videos may simply have had more engaging content, and an A/B test would be needed to confirm it.

### Pop-up review questions on earlier weeks

Dan Davis, René Kizilcec, and colleagues ran a [randomized experiment in 2018](https://doi.org/10.18608/jla.2018.53.3) in an edX geoscience course, with a preregistered analysis plan. In the treatment group, on lecture-video pages in weeks 2 to 6, a small window popped up over the video (the authors call it a qCard). Its question was drawn at random from earlier weeks' question bank, and an "x" in the top-right corner closed it. Answers were not graded. A wrong multiple-choice answer got a hint, not the correct answer. The control group had no pop-ups, but both groups got the same lesson on effective learning habits, which explained the benefits of self-testing and how to do it.

Counting by assignment, only 102 of the 523 people in the treatment group interacted with a qCard even once, about one in five. The denominator is "people who entered the course at least once," and in both groups about seven in ten people had a course grade of zero, so many may never have reached a page where a question would pop up. The authors do not report how many people in the treatment group actually saw a qCard.

Counted per pop-up, the numbers look different: about 70% of multiple-choice questions were attempted, against about 40% of questions that required typing a number. Questions were not randomly assigned to formats, so the difference may come from the questions themselves. People who chose to close the window did so after a median of 7 seconds. Below the video was a button for requesting another qCard; one person in the whole course used it.

On grades, comparing everyone as assigned (intent-to-treat), the two groups showed no detected difference in certification, in the share with a nonzero grade, or in continuous grade; a method that estimates the effect on actual users found none either. The authors' boxed summary reads:

> A causal analysis yields no evidence that encouraging retrieval practice raised learning, performance, or self-regulatory outcomes in this course.

In the discussion, the authors say that many people never engaged, which limits their ability to draw causal inferences. So this is "not detected," not "shown to be useless." Pass rates in both groups were only 7% to 8%, and about a hundred people actually touched a question, so I judge the power to be low; the authors do not discuss power. The roughly one hundred people who did engage passed at much higher rates, and the authors say outright that this is self-selection: it compares the whole control group with the most motivated people in the treatment group.

### A separate page after each video: half as many people do the typing task

Tim van der Zee and colleagues' [2018 study](https://doi.org/10.1145/3170358.3170382), in a Coursera course on terrorism and counterterrorism, randomly assigned 12,444 people to three groups: write a three-sentence summary after each video, read a ready-made summary after each video and tick a box to say so, or neither. The summary task came on a new page after the video, could be skipped by moving on, and gave no feedback.

Writing and reading drew very different numbers. The first video had 774 writers and 1,638 readers, and for every later video about twice as many people read as wrote (the ratio is my calculation from the per-video counts). The authors attribute this to writing taking more effort. The paper does not give how many people watched each video, so "what share of people who saw the prompt did it" cannot be computed. Using the number assigned as the denominator, about 19% wrote and about 40% read for the first video; the denominator includes people who never started the video, so these are lower bounds, and they are my calculation.

No difference was detected in scores on any of the three quizzes, comparing the people who took each quiz. Both summary tasks also left fewer people still around at the week 1 and week 2 quizzes than in the control group; by the final quiz the three groups did not differ. The authors' reading is that even tasks that are "relatively minor and completely optional" can affect dropout in unexpected ways; they suggest the tasks only made dropout happen earlier.

Be careful with this paper's abstract. It says "Both interventions seemed to help students to perform better", based on the correlation that, within a group, people who did more scored higher; in the discussion the authors concede this may be self-selection. The randomized three-group comparison showed no difference, and the abstract does not mention it.

### Interactive textbooks for credit: points and completion

Alex Edgcomb and Frank Vahid's [2015 report](https://zybooks.com/wp-content/uploads/2016/06/How-Many-Points-Should-Be-Awarded-for-Interactive-Textbook-Reading-Assignments_.pdf) compared 8 college classes using zyBooks interactive textbooks, 1,394 students in all. The book's short-answer questions showed the answer at one click, allowed unlimited attempts, and did not penalize looking. Each instructor decided how many points the reading assignments were worth; the researchers asked the instructors afterward with a survey.

The two classes that gave no points completed 53% of assigned questions on average; every level that gave points was around 90% (the 2-point level combines two classes), with the lowest and highest point levels showing similar completion. More points did not visibly mean more completion.

This is a cross-class comparison: most point levels had a single class, instructors, schools, and subjects all differed, there were no statistical tests, and the paper does not say what share of the course grade a "point" was. The authors themselves say many factors besides points matter, such as whether the course is in the students' major. The one programming class for non-computing majors had the lowest completion and earnestness (how often students tried a question before viewing the answer) of all the classes that gave points. Both authors are affiliated with zyBooks.

### Self-learners without credit

The closest thing to "one person reading alone" is Barbara Ericson and colleagues' [2015 study](https://doi.org/10.1145/2818314.2818335). Ten teachers with almost no programming experience read the first 8 chapters of the team's Python ebook at their own pace, for no credit; anyone who finished all four post-tests got a 50-dollar gift card.

Five of the 10 reached chapter 8, and the authors say the gift card "probably had a significant impact on completion rates." Two of those who finished skipped more than half of the interactive features in the later chapters but still answered the multiple-choice questions; among the five who completed all four post-tests, these two had the lowest scores on the last one. Across everyone who took a post-test, the amount of multiple-choice answering showed no visible relationship with post-test scores, a point the authors make themselves. The ebook is the authors' own work, and the paper says plainly that it tests their own design; the sample is 10 people, with no tests.

### A writing activity at the start of a course

René Kizilcec, Justin Reich, and colleagues' [2020 study](https://doi.org/10.1073/pnas.1921417117) asked no questions about content. In the entrance survey of 247 MOOCs, it randomly placed a few minutes of writing, such as a study plan or how the course connects to values the learner cares about. What it offers this post is the funnel: from the supplementary tables, only about 12% of registrants entered that opening survey (the share is my calculation); in the first year, among people in the focal sample who saw a planning prompt, 14% wrote nothing at all.

Its main result is that effects found earlier in a few courses did not replicate across 247: none of the four main hypotheses replicated, and what remained was small, showed up only in some courses, and in one case went the other way. Planning activities raised activity in the first week or two but not completion. The authors conclude that "adequately supporting diverse students will require more than a light-touch intervention."

### Why these numbers cannot be lined up

- **Different denominators**: people who started a given video, people who entered the course once, each time a question popped up, people assigned to a group, assigned questions, recruited volunteers.
- **Different definitions of "answering"**: submitting an answer, interacting once, submitting some text, eventually answering correctly, reaching a given chapter.
- **Different grading**: Kovacs and Davis were ungraded; van der Zee only says the tasks could be skipped and gave no feedback, without saying whether they counted toward a grade; Edgcomb and Yuen were for credit; Ericson had a gift card.
- **Nobody tested the effect of placement directly.** Put Kovacs's 74% next to Davis's "about one in five," and it is easy to read as "questions in the way get more answers than questions that pop up." But counted the same way (was the question attempted when it appeared), Davis's multiple-choice rate is about 70%, not far from 74%. The question content also differs: Kovacs asked about the video being watched, Davis about earlier weeks. No study compared different placements of the same questions.

## Answering, but in earnest?

### When the answer is one click away, most questions are tried first

Joshua Yuen, Edgcomb, and Vahid's [2016 study](https://peer.asee.org/will-students-earnestly-attempt-learning-questions-if-answers-are-viewable.pdf) used the same zyBooks short-answer questions and looked at 553 introductory C++ students at four schools (fall 2014). Credit came only for a correct answer; "Show answer" displayed the answer and explanation without credit, but pasting that answer back in carried no penalty. The authors define "earnestness" as the share of questions a student answered that they attempted at least once before viewing the answer.

The averages for the three types of school were 87%, 85%, and 81%. Earnestness fell later in the term at all three. The authors attribute the decline to tiredness rather than harder content, based on two indicators they defined themselves, without tests. For the few questions with especially low earnestness, the authors say on inspection that they were all badly written; students looked at the answer on such a question and then answered the next ones on their own.

Cite it with four conditions: the course was for credit and credit required a correct answer; only short-answer questions were analyzed; the denominator is the questions a student answered, so untouched questions are excluded; all three authors are affiliated with zyBooks, one as a co-founder. Numbers in the abstract such as 84% and 89% have no match in the body or tables, so I cite the three numbers from the body.

### After a wrong answer

In Kovacs's logs, 76% got the question right on the first try. For those who got it wrong first, the median gap from first to last attempt was only 13 seconds. Among those who were wrong first and right within 30 minutes, only 9.1% dragged the video before getting it right (nearly all of them backward). In the author's words, most people who answer incorrectly "simply answer again within the next 13 seconds, without referring to the rest of the video." Backward drags do cluster around the questions, but mostly before the first attempt: read the question, go back to look, then answer.

Ericson's ebook has one case: a teacher answered multiple-choice questions wrong 38 times and right 10 times, and changed an answer only once. The authors say most others kept answering until they got it right.

### People who copy answers outright

David Palazzo and colleagues' [2010 study](https://doi.org/10.1103/PhysRevSTPER.6.010104) looked at another way of "seeing the answer first": copying. The data are online homework logs from a large MIT mechanics course (fall 2003, 428 students), where homework was about 10% of the grade and the course was graded pass/no record. "Copying" is inferred from timing: a problem had several parts, and finishing all of them correctly about one minute after opening it was judged too fast to read and compute, so the authors classed it as copying.

About one in five students copied more than 30% of problems. The group that copied more than half (about 10% of students) scored 1.3 standard deviations lower on the final than the low-copying group. On the concept pretest at the start of term the groups showed no detected difference, and gains on the concept test by the end of term were unrelated to how much a student copied. The authors argue that copying caused the lower scores, but they also write, in parentheses, that the hypothesis that lower scores lead to later copying is supported by the data too.

Three more findings bear on this post:

- The strongest common factor among heavy copiers was starting close to the deadline; the top self-reported reasons were "Lack of time due to other classes" and "Problems were too difficult". The authors say ability is only a weak correlate.
- In 2005, about two-thirds of the professors showed students the "copying versus grades" graph and warned that copying put passing at risk. The copying rate did not drop significantly at that point.
- On ungraded practice problems before exams, students other than repetitive copiers completed about 60%, while repetitive copiers fell from nearly 50% to under 40% (the authors cite this from the same group's earlier analysis).

It cannot be used directly for "opening the answer." Copying here means getting answers from friends or another person's account and filling them in within a minute, not looking at a solution after trying, and not a show-answer button built into the material.

## When readers choose for themselves

### Test or look again: it depends on the options

Kalif Vaughn and Nate Kornell's [five online experiments from 2019](https://doi.org/10.1186/s41235-019-0187-y) had participants learn 60 word pairs (unrelated pairs in most experiments, such as cue idea and target seeker; weakly related pairs in experiment 4). Each pair appeared a second time in one of four forms: the cue only, where you type the target (pure test); the cue plus 2 letters of the target; plus 4 letters; or the whole pair again to copy (pure restudy). Experiment 1 let participants pick among all four; experiment 2 allowed only pure test or pure restudy; in experiments 3a, 3b, and 4 the researchers assigned the form at random with no choice. Whatever the form, the correct answer appeared after submitting.

- With only pure test and pure restudy (experiment 2, 39 people), people chose restudy about 80% of the time and test about 20%.
- With all four options (experiment 1, 36 people), they chose some form of test 71% of the time, mostly the 4-letter hint; pure test was only 2%.
- Even in experiment 1, with hints available, about four in ten said on the questionnaire that pure restudy helped them learn most.

The contrast of about 70% with hints and 20% without comes from two experiments with two different groups of people, and the authors ran no cross-experiment test. Their reading is that learners are not averse to testing:

> They do dislike and avoid something, but it is being wrong, not taking tests.

The authors also say the fear-of-being-wrong explanation was not measured directly; it is only consistent with the data.

### What learners think questions are for

Michelle Rivers's [2021 review](https://doi.org/10.1007/s10648-020-09578-2) covers learners' beliefs about practice testing and their choices. A few points relevant to answering:

- **Why people test themselves**: in a weighted average of 10 surveys, about half said their main reason was to find out how well they had learned the material, and about a quarter that they learn more than by rereading. The author's explanation (a guess) is that tests at school are mainly used for grading, so learners treat them as a checking tool.
- **When people choose to test**: learners tend to choose testing when they expect to answer correctly, for example when material seems easy, was studied recently, comes with feedback, or is late in learning. The author's word is "expect": it is about what learners anticipate, not what they can actually do.
- **Voluntary, ungraded practice questions**: summarizing six studies, the author says usually only a minority of students use them, and simply making questions available without incentives does not seem to be enough; telling students about the benefits and reminding them can raise use. The paper gives no numbers on this, and I did not read those six studies.
- **One right answer and done**: the author reports an experiment by Dunlosky and Rawson (2015) in which learners in control of their study stopped practicing each concept after one correct answer on average; reading instructions, being encouraged, and being offered money did not change this. This is secondhand; I did not read the original.

Davis's data have one exploratory result in the same direction: for material whose original course question had been answered correctly, 73% of later qCards were attempted; where the original question had not been answered, only 34%.

Learners' own impressions are not reliable either. Part 8 covered Deslauriers and colleagues' 2019 classroom experiment: the active class had students solve problems in small groups first, with the instructor circulating, before the solution was given; students rated that class lower right afterward than the lecture class (a four-item composite that includes whether they enjoyed the class), yet scored higher on the test. That was a classroom with classmates and an instructor, not someone reading an article alone. How accurately readers judge whether they have understood will get its own post later.

## Which design choices change answering

The table regroups the studies above by "things an author can change." The third column describes the nature of the evidence, not the size of the effect.

| Design choice | Evidence found | Nature |
|---|---|---|
| Grading | Two ungraded classes completed 53%, graded levels 88% to 94% (Edgcomb & Vahid); voluntary ungraded practice is usually used by a minority (Rivers's summary) | Cross-class comparison; not available to a public article |
| Typing versus clicking | About half as many wrote summaries as read them (van der Zee, randomized); multiple-choice about 70% attempted, type-a-number about 40% (Davis, questions not randomized) | Two MOOCs, same direction |
| Giving hints | With a hint option, far more people chose to test (Vaughn & Kornell, cross-experiment) | Word pairs |
| Question quality | Questions with especially low earnestness were all badly written (Yuen et al., the authors' post hoc inspection); confusing, overly hard, or drill-like questions get lower earnestness (Edgcomb & Vahid, citing their own unpublished analyses) | Post hoc observations by the platform's authors |
| Where the question goes | No direct comparison; the button for requesting another question was used by one person (Davis) | Missing |
| Asking about what was just read or about earlier material | No direct comparison; learners choose to test when they expect to answer correctly (Rivers) | Inference |
| Explaining why questions help | Rivers's summary: telling students the benefits and reminding them can raise voluntary practice; the two experiments she reports on teaching learners to repeat retrieval point in opposite directions. Analogies: showing students the copying-versus-grades graph did not significantly lower copying (Palazzo); light-touch planning and values writing did not replicate at scale (Kizilcec; that intervention did not explain the value of questions) | Mixed evidence |
| Do questions drive people away | Two optional summary tasks left fewer people in the first two weeks, with no difference by the end (van der Zee); groups with pretests had lower completion (Janelli & Lipnevich) | Two MOOCs; the latter cannot separate leaving from skipping |

A few notes:

**Grading.** Edgcomb and Vahid's ungraded classes averaged 53% completion; in Palazzo's course, students other than repetitive copiers completed about 60% of ungraded practice problems. The two numbers come from different courses and definitions, so all I can say is that they point the same way. A public article has no grade to give, so for writers this row is mainly a reminder: the numbers from credit-bearing settings were measured with grades pushing. Janelli and Lipnevich suggest that counting pretests toward the grade might raise participation but not necessarily reduce dropout; this is the authors' suggestion, untested.

**The cost of typing.** van der Zee is the only randomized study comparing different tasks in the same position, and its finding is that about half as many people do the task that requires typing. On learning outcomes, no difference was detected among the three groups. Davis's format difference points the same way, but the multiple-choice and numeric questions were different questions. Ericson's two least engaged readers also skipped almost everything else but kept answering the multiple-choice questions. Putting the three together, my inference is: the less effort answering takes, the more people answer; but no study showed that answering more means learning more, and in Ericson's data the amount of multiple-choice answering showed no visible relationship with post-test scores.

**Do questions drive people away?** van der Zee's effect was gone by the end, and the authors suggest dropout simply came earlier. Janelli and Lipnevich's study was already covered in [part 1](/posts/learning/2026-10-13-teaching-text-evidence-en): in the three pretest groups a unit counted as complete only if both pretest and posttest were submitted, while the no-pretest group only needed the posttest, so "leaving the course" and "skipping the pretest" cannot be separated.

## Does a hint outside the collapsed answer give it away?

The question part 7 left open: when a self-check answer sits in `<details>`, should there be a hint outside the fold, such as "Hint: think about the definition of entailment," and would that hint give the answer away?

**No study has tested this directly.** None of the studies I read put a collapsed answer in an article, let alone compared a hint outside the fold with none. The closest are Vaughn and Kornell's experiments 3a, 3b, and 4, which randomly assigned each word pair to one of the four forms and tested two minutes later:

- **When the answer cannot be guessed** (experiment 3a, 41 people; 3b, 63 people; unrelated word pairs, where each 4-letter hint fits at least five English words, so meaning cannot help): no difference was detected among pure test, 2-letter hints, and 4-letter hints, in both experiments; all three beat pure restudy.
- **When the answer can be guessed** (experiment 4, 36 people, weakly related pairs such as whip and punish): 4-letter hints did worse than 2-letter hints, effect size d = 0.54; neither hint condition showed a detected difference from pure test. The authors speculate that 4 letters let people guess the target without recalling it.
- The authors' advice is that hints are fine, but hints that make the answer guessable could impair learning and may need to be avoided; they also say this needs checking with real educational material.

The conditions are very different from an article: the material is word pairs, the correct answer appears after every attempt, and the final test is two minutes later. Yuen and colleagues' observation is loosely related: students who looked at the answer on a badly written question then answered the next ones on their own, which the authors read as a problem with the question, not unwillingness to answer.

Applying this to hints outside the fold, my judgment is:

1. **Hints are fine to include.** The "no detected harm" half comes from experiments 3a and 3b, where hints were randomly assigned, so it carries over. The "may get more people to answer" half comes from the cross-experiment comparison of experiments 1 and 2, where readers chose the hint themselves; a hint outside the fold on this site is shown to every reader, and the authors also say "we never tried forcing the use of hints," so that half is only a direction.
2. **A hint says where to look, not what the answer is.** It can point to which definition to use, which step to check, which two cases to compare; it does not state the answer's keywords, values, or the direction of the conclusion. This is more conservative than the research: in the experiments the hint was itself part of the answer (the first letters of the target), and 2-letter hints showed no detected harm; what the research supports is only that a hint should not let people guess the answer without recalling it. Pointing only to where to look is this site's choice.
3. **How to check**: cover the section's text and look only at the question and the hint. Can you answer? If so, the hint gives the answer away. This corresponds to experiment 4; but the idea that 4 letters let people guess without recalling is the authors' speculation, and the experiment did not measure whether participants recalled.
4. **Keep criteria for open questions inside the fold.** A criterion like "a good answer mentions X and Y," placed outside the fold, tells readers in advance what the answer must contain; I treat it as analogous to a 4-letter hint; no study has tested criteria.

All four points are my inferences, based on word-pair experiments, and none has been tested on articles.

## Where sources disagree

These results point in different directions, or seem to conflict while actually measuring different things. I list them side by side without picking a side.

**Do learners prefer rereading?** In the surveys Rivers summarizes, the share reporting rereading (62%) and the share reporting self-testing (57%) are close; the big gap is in "most used strategy": rereading 43%, self-testing 8%. In Vaughn and Kornell's experiments, most chose restudy when the only options were pure test and restudy, and most chose some form of test once hint options were added. Rivers reports Kornell and Son's 2009 experiment: on the first word list, as many chose restudy as chose test, and with experience more chose test. The three measure self-report, a one-time menu, and repeated choices, so "prefer rereading" depends on how you ask.

**Do learners keep practicing until they know it?** Rivers reports Dunlosky and Rawson's 2015 experiment: learners on average stopped after one correct answer, and reading instructions did not change this. She also reports Ariel and Karpicke's 2018 experiment: brief strategy instruction led learners to test themselves repeatedly more often and to score higher. Another study spanning four sessions (Janes et al. 2018) found that each concept was correctly recalled 4 to 7 times on average. I have not read any of the three originals.

**Do writing and reading summaries help?** van der Zee and colleagues' abstract says both interventions seemed to help; in the same paper's randomized comparison, no difference was detected among the three groups, and one subsection of the body contradicts itself between its opening and closing. The positive claim comes from the within-group correlation that people who did more scored higher.

**Do passing and non-passing learners differ in knowledge?** Davis and colleagues' boxed conclusion in the body says the two groups did not differ significantly in assessed knowledge; the test in the same section shows passing learners 6 percentage points more accurate, a significant difference. The abstract's claim that the two groups scored similarly on the post-test has no passing-versus-non-passing comparison in the body, and only 20 people filled in the post-test.

**The same experiment, reported with a different number.** Rivers's review reports experiment 1 of Vaughn and Kornell as 80% choosing some form of test; the original says 71%. This post uses the original 71%. When citing a number from a secondary review, it is worth checking it against the original.

## Checking this site's practice

This site's course-guide spec is in `course-guide-contract.md`; the comparison below uses the version in the working directory on 2026-10-14.

| What this site does now | What this post found | Nature |
|---|---|---|
| One question at the end of each major section, with an answer or criterion | No study compared whether placement changes response rates; Kovacs's 74% is a MOOC record of a different placement (a question in the video player) | This site's choice; the response rate among this site's readers is unknown |
| The question is labeled "Write your answer down before opening the fold" | No one has tested this wording's effect on answering; part 9 already downgraded "require writing it down first" to a practice without direct evidence; Vaughn and Kornell say learners avoid being wrong | This site's choice |
| The answer sits in `<details>` | With the answer one click away, students taking the course for credit still attempted most questions first (Yuen et al.); no study compared collapsed and uncollapsed answers | This site's choice; indirect evidence from a for-credit setting |
| Most questions can be answered with one value, one output, or a few words; about one in six explicitly asks for a reason (my count; see below the table) | About half as many people do a typing task as a tick-box task (van der Zee); type-a-number questions were attempted less than multiple choice (Davis) | For most questions the cost of answering is already low; for the few that ask for a reason there may be a trade-off with response rate, which is my inference |
| Ungraded, no login | Classes that gave no points had lower completion (Edgcomb & Vahid); voluntary ungraded practice is usually used by a minority (Rivers's summary) | Cannot change; I expect this site's response rate to be lower than in credit-bearing settings, which is an inference |
| No consistent hint format outside the fold | See the previous section | Following the four points there; this site's choice |
| No reading-behavior data | — | Knowing the response rate would first require an analytics tool, which is a separate decision for this site; and "opened the answer" is not the same as "answered" |

The question-type row is my own count. On 2026-10-14 I searched `src/content/posts/ai` and `src/content/posts/tech` for the Chinese label 「自我檢查｜先寫下答案，再展開」 and found 90 questions in 12 Chinese course guides. I read each one and sorted it by "what the answer must at least contain"; when a question had several parts, I counted the most demanding part:

- Compute a value, write a program's output, or the state at each step of an algorithm: 46 questions, for example "[Roll two dice. What is the probability that they sum to 12?](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en)"
- A judgment or classification (yes or no, which one, which category), or naming a few things, with no reason requested: 28 questions, for example "[Can you still conclude that it rained?](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en)"
- The question explicitly asks for a reason or explanation ("why," "what is the difference," "answer using the definition," "what problem do you run into," and the like): 16 questions.

I did the classification alone; borderline questions (for example "[can you conclude it is the best model for this problem?](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en)") might land in another category with a different reader, but that would not change the conclusion that most questions do not require writing a paragraph. (The English versions of these guides carry the same questions; I counted the Chinese originals.)

The last row needs one more sentence. Even with an analytics tool, what you can measure is whether `<details>` was opened. Yuen and colleagues' measure, attempting before viewing the answer, requires a platform that records both answering and viewing, and a Markdown article with a collapsed answer cannot record answering.

## What you can do

Each item notes its basis and its nature.

1. **For a question that asks for a reason, put an easy step in front of it.** Basis: van der Zee (randomized) and Davis (not randomized) both show fewer people doing tasks that require typing; part 9's evidence supports asking for explanations. Most of this site's questions are already short-answer, so this applies only to the roughly one in six that explicitly ask for a reason, and the trade-off is my inference. How: split the question into two steps, the first answerable in a word or two, the second asking why. For example, the [CS50 AI Week 0 guide](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) asks "Why does depth-limited Minimax have to come with an evaluation function? Why is `Utility` alone not enough?" It could first ask "When the search hits its depth limit and the game is not over, can `Utility` give a value? Yes or no," then "So what has to score that position instead?" (the rewrite is mine and has not been tested with readers). The first step is nearly the first half of the original answer, and that is deliberate: the split-off step is still a question the reader answers, and its job is to cut one hard step of reasoning into two easier ones, which is scaffolding. A hint outside the fold, by contrast, is text shown to the reader with nothing to answer, which is why the earlier section "Does a hint outside the collapsed answer give it away?" says it must not reveal the answer. The difference is whether the reader answers first. Some of this site's questions already have this shape, such as the Crossword question in the [wrap-up post](/posts/tech/2026-08-30-harvard-cs50ai-wrapup-en): "Should you use it? Why?"
2. **Hints point the way; they do not give the answer.** Basis: Vaughn and Kornell's experiments 3 and 4, word pairs. How: after writing a hint, cover the section's text and look only at the question and hint; if you can answer, rewrite the hint.
3. **Treat skipped questions as a problem with the question.** Basis: post hoc observations by Yuen and colleagues and by Edgcomb and Vahid, whose authors are affiliated with the platform, with no comparison group. How: ask someone who has not read the article to try it, then ask which questions they skipped and why; if the answer is "I couldn't tell what it was asking" or "too hard," rewrite the question instead of adding "please be sure to answer."
4. **The evidence on persuasive paragraphs is mixed.** Basis: the studies Rivers summarizes say telling students the benefits and reminding them can raise voluntary practice (I did not read the originals); the two experiments she reports on teaching learners to repeat retrieval point in opposite directions. Palazzo's copying graph and Kizilcec's planning and values writing are only analogies; neither explained the value of questions. How: if you want a reminder, make it one line next to the question, like this site's current "Write your answer down before opening the fold," rather than a whole paragraph; this is my choice, and no study has compared wordings.
5. **Do not treat response rates as learning.** Basis: Davis's actual users scored higher because of self-selection; in Ericson's data the amount of multiple-choice answering showed no visible relationship with post-test scores; van der Zee's finding that people who did more scored higher is correlational. How: if you add analytics later and see a question opened often, record it as "this question was opened often," not "this question works."

## Three things to do tonight

Pick an article of yours that has self-check questions; it takes about an hour:

1. For each question, cover the section's text and look only at the question and anything outside the fold. Where you can answer, rewrite the hint outside the fold so it only points the way.
2. Find the questions that explicitly ask "why," pick one, and split it into two steps: first a small question answerable with yes or no or a single word, then the why.
3. Ask someone who has not read it to try it and mark the questions they skip, then ask them why afterward.

## Limits of this evidence

- **None of the studies measured readers of public articles.** The closest are MOOCs and interactive textbooks used for credit; the closest to "one person reading alone," Ericson, had 10 teachers and a gift card. Carrying these numbers over to a web course guide is my inference.
- **This site has no data.** I do not know how many of this site's readers answer, or how many open the answer straight away.
- **Mostly log analyses or correlations.** The randomized studies are only Davis, van der Zee, Janelli and Lipnevich, and Kizilcec, four online-course studies, plus Vaughn and Kornell's experiments 3a, 3b, and 4 and Deslauriers's classroom experiment. Vaughn and Kornell's contrast of about 70% with hints and 20% without comes from experiments 1 and 2, which involve self-chosen forms and a cross-experiment comparison, with no random assignment. Kovacs, Edgcomb, Yuen, Ericson, and Palazzo are observational.
- **Almost every study covers one course, one run.** Edgcomb and Yuen are the same authors, term, and platform, so they are not two independent sources; neither says whether their classes overlap.
- **Authors and material.** Edgcomb's and Yuen's authors are affiliated with zyBooks; Palazzo's data come from Pearson's homework platform, and one author was at Pearson; Ericson evaluates the authors' own ebook; Kizilcec scaled up the authors' own earlier interventions; Janelli's first author worked at the museum that ran the course. This does not change what numbers they published, but several have no independent replication.
- **"Answering" and denominators differ across studies**; see "Why these numbers cannot be lined up."
- **Power.** Davis's pass rates were only 7% to 8%, with about a hundred actual users; I judge its power to be low (the authors do not discuss it), and "no difference detected" cannot be read as "shown to be useless." Only 20 people filled in Davis's post-test, and the two groups were sampled differently.
- **Vaughn and Kornell used word pairs**, a final test two minutes later, and feedback on every trial; the authors themselves say this needs checking with real educational material, and that people probably want to test themselves less when reading a novel than when learning vocabulary.
- **Palazzo's "copying" is inferred from timing**, with no calibration against known cases; groups were defined by copying over the whole term, while exams came at points during the term.
- **My inferences and calculations**: van der Zee's read-to-write ratio and shares of those assigned; Kizilcec's share entering the survey; "the less effort answering takes, the more people answer"; the four points on hints outside the fold; this site's response rate being lower than in credit-bearing settings; the classification of this site's 90 questions; the two rows marked as my inference in the comparison table; Davis's low power; using only a one-line reminder; the trade-offs and steps in "What you can do"; the three things to do tonight. Each is marked where it appears.
- **Secondhand**: the studies Rivers reports, namely Dunlosky and Rawson 2015, Ariel and Karpicke 2018, Kornell and Son 2009, and Janes et al. 2018, plus the six voluntary-practice studies she summarizes; and the completion rate on ungraded practice problems that Palazzo cites from the same group's earlier analysis. I did not read any of the originals.
- **Reading gaps**: I did not read Davis's OSF preregistration, and some figures only through their captions; I did not read van der Zee's OSF data; for Kovacs I looked at the figures' trends but did not read off values; I only skimmed Rivers's reference list.
- **Not found**: a direct comparison of question placement, any study of collapsed answers, any study of hints outside the fold, and large-sample usage data on interactive textbooks from someone other than the vendor. Ericson, Guzdial, and Morrison's 2015 ICER study of ebook usage exists, but I did not read the full text and do not cite it.

## Appendix: design and numbers for each study

The body keeps one or two numbers per item; the rest are here.

**Kovacs (2016)**, L@S 2016, pp. 31–40. Coursera Machine Learning, fourth run (2013-10 to 2014-01); 96,195 registered, 61,453 started at least one video, 42,437 answered at least one in-video quiz, 8,615 reached the certificate threshold. 113 videos, 109 quizzes, mean video length 621 seconds. For the 92 single-quiz videos: 74% of those who started answered, 66% watched to the end; certificate earners 79% and 72%. Forward drags across each quiz were 0.42 times baseline, backward 0.60 times; backward drags from a quiz were 55 times baseline. 76.0% right on the first try; for those wrong on the first try, the median time from first to last attempt was 13 seconds; 94.4% of those who attempted were right within 30 minutes; among those wrong first and right within 30 minutes, 9.1% dragged the video before getting it right. Among those who never got it right: 13.8% gave up after one wrong answer, 4.4% after two, and 81.8% used all three attempts and had the answer shown. Videos with quizzes were watched 79.1% per viewing on average, videos without 59.3% (not randomized; the author says this does not show causation). No statistical tests anywhere; the quiz counts per video, the completion rates (66% and 67.5%), and the totals in Tables 5 and 6 do not add up in a few places.

**Davis, Kizilcec, Hauff & Houben (2018)**, Journal of Learning Analytics 5(3). edX GeoscienceX (2017-05 to 07); the 1,047 people who entered the course at least once were randomized to control 524 and treatment 523; preregistered (OSF), but the analysis was changed because of the small sample and low compliance. qCards appeared on 49 video pages in weeks 2 to 6, drawn from 132 questions (112 multiple-choice, 20 numeric). 102 treatment participants interacted at least once. Intent-to-treat: certification logOR = −0.215, p = 0.357; nonzero grade p = 0.280; continuous grade p = 0.442. Instrumental-variable estimates: p = 0.371, 0.267, 0.374. Treatment compliers versus the whole control group: pass rate 34% versus 8%, which the authors call self-selection. Pass rates of the two groups 7% and 8%, median grade 0. Per qCard: multiple-choice attempted 69%, numeric 41% (p < 0.001); passing learners attempted 73%, non-passing 47%; median time to dismiss 7 seconds. Original question answered correctly, incorrectly, or not at all: qCard attempted 73%, 61%, 34%. Backward navigation after a qCard 8% to 10%, with no detected difference between compliers and non-compliers. Ten-question test two weeks after the course: control 6.2, treatment 6.6, N = 20, p = 0.66. Compliers were older (38 versus 32), more educated, and from countries with higher HDI.

**van der Zee et al. (2018)**, LAK '18, pp. 216–225. Study 1 compared two cohorts without randomization and is omitted. Study 2: 12,444 people randomized to control 4,169, read 4,125 (4,128 in the text), write 4,146. 11 videos of 5 to 15 minutes each. Per-video counts (read/write): first video 1,638/774, last video of week 2 712/322. Quiz scores across the three groups: week 1 p = 0.233, week 2 p = 0.055, final p = 0.749; group means are not reported. People remaining at the week 1 quiz: control 709, read 614, write 616 (pairwise p = 0.008, 0.007); week 2: 501, 439, 436 (p = 0.047, 0.032); final: 259, 230, 245 (not significant). Within-group correlations: number read or written with weekly quizzes ρ = 0.121 to 0.323; number written with the final not significant. The paper does not mention preregistration.

**Edgcomb & Vahid (2015)**, 2015 IEEE Frontiers in Education Conference, DOI 10.1109/FIE.2015.7344350; I read the author version on the zyBooks website. 26 classes at 23 universities screened down to 8 classes (fall 2014), 1,394 students. By level (completion / earnestness / product): 0 points, 2 classes, 250 students, 53%/92%/50%; 2 points (including 2.3), 2 classes, 491 students, 90%/86%/77%; 5 points, 1 class, 380 students, 93%/89%/83%; 10 points, 1 class, 69 students, 94%/95%/89%; 17 points, 1 class, 90 students, 88%/72%/64%; 20 points, 1 class, 114 students, 94%/86%/80%. Only short-answer questions were analyzed; completion means eventually submitting a correct answer. Ungraded classes had higher earnestness, but the denominator is completed questions, and the authors do not discuss that this may be a selection effect. The authors recommend 5 to 10 points.

**Yuen, Edgcomb & Vahid (2016)**, ASEE 2016 Annual Conference, DOI 10.18260/p.27205. 553 students (550 in the abstract): public research university 379, public teaching university 117, community college 57; introductory C++, fall 2014. Only short-answer questions, grouped into six groups by order of appearance (about 238 questions by my sum). Average earnestness: 87%, 85%, 81%; with only 4 schools, the authors ran no tests. Tiredness factor versus difficulty factor (defined by the authors): overall 9.6% versus 2.9%. The abstract's 84%, 89%, 73%, and 1% do not match the body's 87/85/81%, "over 85%", and "fewer than 2%"; the question-writing principles promised in the abstract do not appear in the body.

**Ericson, Moore, Morrison & Guzdial (2015)**, WiPSCE '15. Study 1 is a usability survey of 18 teachers and is omitted. Study 2: 10 teachers with two months or less of programming experience and pretest scores under 40%; 7 took at least one post-test, 5 took all four; 5 also reached chapter 8, but not the same five (one finished the post-tests having only completed chapter 6, another finished all eight chapters without taking a post-test; I did this cross-check). The 8 chapters held 15 Parsons problems and 40 multiple-choice questions. The last post-test had only 3 questions and 5 takers. Number of code edits ranged from 0 to 93. Time per chapter varied widely; among the four with time records for all eight chapters, the shortest total was about an hour and a half and the longest about ten hours (my sums). No statistical tests; the abstract's "Significantly" is not statistical significance.

**Vaughn & Kornell (2019)**, Cognitive Research: Principles and Implications 4:35. Most participants came from Amazon Mechanical Turk (5 dollars each); experiment 3b used college students (course credit). Experiment 1 choices: pure test 2%, 2 letters 9%, 4 letters 60%, pure restudy 29%; no one picked pure test on the questionnaire. Experiment 2: pure test about 20%, t(38) = 8.08, p < .001; on the questionnaire 87% thought restudy was more effective. Experiment 3a final test: among the three test forms p = .672, pure restudy worse than all three (d = 0.41 to 0.57); 3b replicated (p = .874; d = 0.45 to 0.61). Experiment 4: among the three test forms p = .028, 2 versus 4 letters p = .009, d = 0.54, 0 letters versus the other two p = .312; all three beat pure restudy. Accuracy when self-chosen was higher than when assigned (cross-experiment; the authors say to take it lightly). The paper does not mention preregistration.

**Rivers (2021)**, Educational Psychology Review 33:823–862. Narrative review: 18 studies from a PsycINFO search plus 93 more from snowballing; no effect sizes. Table 3 (10 surveys, 4,240 people), main reason for self-testing: to figure out how well I have learned 52% (40% to 68% across studies), learn more than rereading 26% (15% to 34%), more fun than rereading 8%, usually do not self-test or other 14%. Table 4 (16 surveys, 6,944 people), reported use: rereading 62% (most used 43%), practice problems 61% (8%), self-testing 57% (8%), repetition 48%, highlighting 42%, summarizing 39%, flashcards 34%, recopying notes 28%. For the same group of middle and high school students, free recall of strategies gave 50% using testing, a checklist 80% (Tullis & Maddox 2020, secondhand). The author's limitations: most studies compare against rereading, use Western college students and simple material in the lab, and the surveys rely on self-report.

**Palazzo, Lee, Warnakulasooriya & Pritchard (2010)**, Physical Review Special Topics – Physics Education Research 6, 010104. Four semesters of MIT mechanics and electromagnetism; detailed analysis only for fall 2003 (428 students). Copying groups: under 10% about 51%, 10% to 30% about 29%, 30% to 50% about 10%, over 50% about 10%. In the final-exam prediction equation, the copying coefficient is −0.47 (Z scores), r = 0.69; controlling for the pretest, about −2.3 standard deviations per 100% copying (from which the authors extrapolate a difference of about two standard deviations between copying everything and copying nothing; the observed group difference is 1.3). Concept-test gain versus copying r = −0.03. Reverse hypothesis: about 1.2 standard deviations of score corresponds to 100% copying. Attrition across two semesters: 20% for those copying over 30%, 5.9% for others. After the course reform, copying fell from about 11% to under 3%, with several changes at once, and the authors call their attribution a judgment. Actual copying exceeded self-report by about 50%.

**Deslauriers et al. (2019)**, PNAS 116(39). 149 students in Harvard introductory mechanics, individual-level randomized crossover, one class in each format, tested right after class. The active class was rated 0.56 standard deviations lower on self-assessed learning (four-item composite) and scored 0.46 standard deviations higher on a 12-question test. Design and limits are in part 8.

**Kizilcec et al. (2020)**, PNAS 117(26). 247 courses, focal sample 269,169 people, 2016-09 to 2019-05, each wave preregistered. Supplementary Table S1: 3,546,206 registered, 432,164 entered the survey, 312,221 reached randomization. None of the four main hypotheses replicated (for example, long-term planning for committed, English-fluent students: previously +3.9 percentage points, here +0.19 in year one, p = 0.670). Planning activities raised week-1 activity; the value-relevance activity raised completion for students from less developed countries by about 2.8 percentage points in courses with a global gap and lowered it by about 1.6 to 1.7 points in courses without one. The authors caution against extending the results to less engaged students or other educational settings.

**Janelli & Lipnevich (2021)**, Computers & Education 161. See part 1's appendix: among the 399 who submitted tests, no difference was detected in posttest scores across the four groups (p = .42); completion was 22.4%, 33.3%, and 31.3% in the three pretest groups and 50.5% in the control group.

## References

Each was read from start to finish, with an extraction record; parts I could not read are noted in parentheses.

- [Kovacs (2016), Effects of In-Video Quizzes on MOOC Lecture Viewing](https://doi.org/10.1145/2876034.2876041) (L@S 2016 published version, ACM layout).
- [Davis, Kizilcec, Hauff & Houben (2018), Scaling Effective Learning Strategies: Retrieval Practice and Long-Term Knowledge Retention in MOOCs](https://doi.org/10.18608/jla.2018.53.3) (published version, open access; OSF preregistration not read).
- [van der Zee et al. (2018), Evaluating Retrieval Practice in a MOOC: How writing and reading summaries of videos affects student learning](https://doi.org/10.1145/3170358.3170382) (published version, open access in the ACM Digital Library; OSF data not read).
- [Janelli & Lipnevich (2021), Effects of pre-tests and feedback on performance outcomes and persistence in Massive Open Online Courses](https://doi.org/10.1016/j.compedu.2020.104076) (read as the published PDF on co-author Lipnevich's personal website).
- [Yuen, Edgcomb & Vahid (2016), Will Students Earnestly Attempt Learning Questions if Answers are Viewable?](https://peer.asee.org/will-students-earnestly-attempt-learning-questions-if-answers-are-viewable.pdf) (conference published version on ASEE PEER, DOI 10.18260/p.27205).
- [Edgcomb & Vahid (2015), How Many Points Should Be Awarded for Interactive Textbook Reading Assignments?](https://zybooks.com/wp-content/uploads/2016/06/How-Many-Points-Should-Be-Awarded-for-Interactive-Textbook-Reading-Assignments_.pdf) (author version on the zyBooks website; IEEE published version DOI 10.1109/FIE.2015.7344350, not compared with this version).
- [Ericson, Moore, Morrison & Guzdial (2015), Usability and Usage of Interactive Features in an Online Ebook for CS Teachers](https://doi.org/10.1145/2818314.2818335) (published version, open access in the ACM Digital Library).
- [Vaughn & Kornell (2019), How to activate students' natural desire to test themselves](https://doi.org/10.1186/s41235-019-0187-y) (published version, CC BY; PDF layout not checked; tables and figures checked against the publisher's XML and image files).
- [Rivers (2021), Metacognition About Practice Testing: a Review of Learners' Beliefs, Monitoring, and Control of Test-Enhanced Learning](https://doi.org/10.1007/s10648-020-09578-2) (read as the published PDF linked from the [author's personal website](https://www.michellelrivers.com/research/publications); reference list only skimmed).
- [Palazzo, Lee, Warnakulasooriya & Pritchard (2010), Patterns, correlates, and reduction of homework copying](https://doi.org/10.1103/PhysRevSTPER.6.010104) (published version).
- [Deslauriers, McCarty, Miller, Callaghan & Kestin (2019), Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom](https://pmc.ncbi.nlm.nih.gov/articles/PMC6765278/) (published version and supplementary material).
- [Kizilcec, Reich, Yeomans et al. (2020), Scaling up behavioral science interventions in online education](https://pmc.ncbi.nlm.nih.gov/articles/PMC7334459/) (published version and supplementary material; supplementary Tables S4 and S5 not checked against the layout).
- Posts on this site: [What the Evidence for Learning by Doing Measures](/posts/learning/2026-10-14-active-learning-evidence-en), [Writing Questions and Wording in a Teaching Article](/posts/learning/2026-10-13-teaching-text-questions-feedback-en), [Should a Teaching Article Use Interactive Figures](/posts/learning/2026-10-14-interactive-figures-in-teaching-articles-en), [Writing the Examples and Openings of a Teaching Article](/posts/learning/2026-10-13-teaching-text-evidence-en).
