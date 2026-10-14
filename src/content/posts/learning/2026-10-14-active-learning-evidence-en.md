---
title: "What the Evidence for Learning by Doing Measures: Classroom Meta-Analyses, ICAP, and the Doer Effect"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, active-learning, self-learning, course-guide, blog]
lang: en
description: "Two lines of evidence behind \"active learning beats lecture\" and \"doing practice beats reading\": the college-classroom meta-analyses and a methods critique of them, the problem of defining active learning, one classroom crossover experiment, the ICAP framework and a critical comment, and log-data studies of the doer effect in online courseware. Which parts carry over to one person reading an article, and which do not."
tldr: "College-classroom meta-analyses find about half a standard deviation, but they compare whole-course teaching formats, the active sections usually include group discussion and instructor responses, and most controls were not done or not reported. In online courseware, \"students who do more practice score higher on quizzes\" recurs across a dozen-plus courses, but all of it is observational. None of the studies read here compared one person reading an article with and without practice."
series:
  name: "Writing Articles That Teach"
  order: 8
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-active-learning-evidence)

This is part 8 of the series "Writing Articles That Teach," and the first post in its second section, "what to ask readers to do." The first section covered what goes on the page: [text](/posts/learning/2026-10-13-teaching-text-evidence-en), [diagrams](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en), [video](/posts/learning/2026-10-13-instructional-video-in-articles-en), and [laying out video and text](/posts/learning/2026-10-13-video-beside-text-layout-en). How to write the questions in an article and how to give the answers is covered in [the post on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en). This post steps one level upstream and asks: what did the research behind "active learning is better" and "learning by doing" actually measure, and can it justify asking readers to do something in an article?

The trigger was this site's course-guide spec. It requires a question at the end of every major section, with an answer or a criterion, so that readers can judge for themselves whether they understood. When I looked for a basis for that rule, two conclusions came to mind first. One: in college classrooms, sections with active learning score higher than pure lecture. The other: in online courseware, students who do the practice score higher than students who only read the text or watch the videos. I read the main studies on both lines from start to finish to see what they compared, what they controlled, and how far their authors say the results reach.

**How the sources were chosen, and their biases.** I scanned the literature first and then picked a list for close reading. On the classroom line: two meta-analyses of college classrooms (studies that pool the results of many studies into one estimate), a methods review of one of them, a review on definitions, and one classroom crossover experiment. Then the original ICAP framework paper and a critical comment on it, and four log-data studies of the doer effect, one of which did not detect the effect. The sources lean toward English-language literature, college students, and studies with obtainable full text. Every item in the references was read in full, with an extraction record. During the scan I saw several independent tests of ICAP (Wiggins et al. 2017, Henderson 2019, Vosniadou 2023); I did not obtain those files and do not cite their content.

## Conclusions first

| Claim | Evidence | Does it carry over to one person reading an article? |
|---|---|---|
| College sections with active learning score higher | STEM [meta-analysis](https://doi.org/10.1073/pnas.1319030111) g = 0.47; humanities and social sciences [meta-analysis](https://doi.org/10.1007/s10734-022-00977-8) 0.49 | Not directly: they compare whole-course teaching formats, and the active sections usually include group discussion and instructor responses |
| These studies are tightly controlled | [Methods review](https://doi.org/10.1007/s10648-023-09826-1): of 260 articles, about one in ten used random assignment, and over 90% did not check that teaching ran as planned; a large share is "not reported," not "known to be flawed" | — |
| What "active learning" means | [Review by seven discipline teams](https://par.nsf.gov/servlets/purl/10282580): no shared definition; often used as an umbrella for "anything other than lecture" | — |
| The active group learned more but felt it learned less | One [classroom crossover experiment](https://pmc.ncbi.nlm.nih.gov/articles/PMC6765278/): test 0.46 SD higher, self-rating 0.56 lower; one class each, tested right after class | Only the direction transfers: the active condition was small groups solving first while the instructor circulated |
| Interactive > Constructive > Active > Passive (ICAP) | The proposers call it a hypothesis; the support comes from studies selected and reclassified after the fact; a [critical comment](https://doi.org/10.1038/s41539-023-00197-4) says the ordering has not been systematically tested | The categories are usable; static questions in the article itself reach at most "constructive" by definition (my inference) |
| In online courseware, students who do more practice score higher (doer effect) | Log-data studies across a dozen-plus courses agree in direction; all observational; with the final exam as outcome the association shrinks and prior knowledge matters more; one small-sample study did not detect it | Closest setting, but no random assignment, and the outcome is mostly quizzes from the same system |
| How much more one person learns from an article with practice than without | None of the studies read here compared this; the closest experiments are in [the post on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en), using short texts in the lab | — |

## Classroom meta-analyses: what the half standard deviation compares

### Freeman et al. (2014)

Scott Freeman and colleagues' [2014 meta-analysis](https://doi.org/10.1073/pnas.1319030111) covers undergraduate STEM and psychology courses and compares sections with "at least some active learning" against traditional lecture. Pooling 158 comparisons of exam scores, the active-learning sections averaged 0.47 SD higher, "just under half a SD" in the authors' words. Failure rates are a separate dataset: 21.8% in active-learning sections and 33.8% in lecture sections.

"Active learning" here is a consensus definition: the authors asked 338 audience members to write a definition and coded the results. It engages students in learning through activities or discussion in class, as opposed to passively listening to an expert; it emphasizes higher-order thinking and often involves group work. The included practices vary widely: occasional group problem-solving, in-class worksheets, clickers (students press a key to answer the instructor's question, often paired with peer discussion), problem-based learning, and studio or workshop course designs. The active component took 10% to 100% of class time. The authors state plainly that they estimate the average effect of "any active learning type and intensity" against lecture.

So 0.47 answers the question "if a whole course is taught a different way, how far apart are the midterm and final exam averages." It does not say which practice works. The authors' comparison by type of practice detected no difference between groups; the confidence intervals for problem-based learning, quizzes that replace lecture time, case studies, and interactive demonstrations all cross zero, and the authors say the coding behind that table is imprecise.

The authors checked whether study quality changes the conclusion. The 16 comparisons with random assignment or crossover designs produced effect sizes indistinguishable from three kinds of quasi-experimental design, and the authors conclude the result is robust to variation in methodological rigor. The funnel plot for exam scores is asymmetric (a possible sign of publication bias); after imputing the possibly missing studies, the estimate is still 0.47.

The authors also wrote two caveats that affect inference. First, the instructors who used active learning did so voluntarily: "It is an open question whether student performance would increase as much if all faculty were required to implement active learning approaches." Second, they call these studies "first-generation" research and argue that future work should stop using traditional lecture as the control and compare different active-learning practices instead.

The kind of assessment also changes the number. Studies measured with concept inventories (standardized item sets that target conceptual understanding) show effects about twice as large as studies using instructor-written exams (I computed this from its supplementary table; both figures are in the appendix).

### Beyond STEM: Kozanitis and Nenciovici (2022)

Anastassis Kozanitis and Lucian Nenciovici's [2022 meta-analysis](https://doi.org/10.1007/s10734-022-00977-8) describes itself as the humanities and social sciences counterpart to Freeman. Pooling 104 papers and 111 effect sizes, it finds g = 0.489, almost the same as Freeman.

Close numbers do not confirm each other. This analysis reuses the same design, and a looser one: its inclusion criteria do not require random assignment, it does not code study quality, three quarters of its effect sizes are posttest-only, and it defines active learning as "any teaching method that gets students to do something." The sample is also lopsided: 66 of the 111 effect sizes are flipped classrooms and clickers; the subjects are mostly psychology, languages, education, and economics and business, with 1 effect size in philosophy, 3 in history, and 3 in law. "Social science and language courses" is the more accurate description.

The reporting has problems too: the list of included studies is not published, several numbers in the tables do not add up, and there is no limitations section. In the body I cite only the overall effect size, plus two subgroup results (course level and class size) that are compared with Freeman under "Where sources disagree"; the other subgroup figures are in the appendix.

## Controls and definitions: two critiques of these studies

### Martella et al. (2023), a methods review

Amedee Marchand Martella and colleagues' [2023 methods review](https://doi.org/10.1007/s10648-023-09826-1) coded the 176 articles in Freeman's set, plus a random sample of 84 newer articles from 2015 to 2022, against 12 internal-validity controls: whether assignment was random, whether the groups started out equivalent, attrition, whether the same instructor taught both, whether both groups spent the same time, whether anyone checked that teaching ran as planned, and so on.

The most-quoted result is that no article met all 12 controls. That comes with a condition: the zero depends on the "implementation fidelity" control (checking whether teaching actually ran as planned), which over 90% of the articles did not do. Leave that control out and count "partial" and "not reported" leniently, and 5 of the 260 articles qualify.

A second condition: much of the "incomplete controls" is "not reported." On whether the groups started out equivalent, two thirds of the articles reported no direct measure; on whether both groups spent the same time, more than 60% said nothing. The share explicitly coded as a problem is much smaller.

The review computes no effect sizes and does not test whether weaker controls go with larger effects. Its conclusion is phrased as a possibility: without controls for confounds, "it is possible that the results obtained in these articles are not reflecting the true effect of active learning interventions." The authors also give the other side: the number of articles showing that active learning works, across practices and dosages, is overwhelming, and the evidence "seems clear"; the question is whether this literature is good enough to attribute the results to the teaching method. So what this review supports is "less confidence in the causal attribution," not "the half standard deviation is not credible."

The figure I find most useful in this review is a different one: **45% of the articles did not describe at all what the comparison (lecture) group did in class, against 8% for the experimental group.** "Lecture" is described even less often than "active learning." In their discussion the authors point out that under Freeman's definition, an active-learning course could spend up to 90% of class time on lecture, and a lecture course could spend just under 10% on activities.

The authors recommend dropping the "active versus lecture" dichotomy and studying strategies that engage students cognitively (they name self-explanation and retrieval practice), along with how lecture combines with activities. They cite Mayer (2004): treating being behaviorally active as being cognitively active is a fallacy. (I did not read Mayer; this is Martella and colleagues' citation.)

### Lombardi et al. (2021): no shared definition of active learning

Doug Lombardi, Thomas Shipley, and seven discipline teams (astronomy, biology, chemistry, engineering, geography, geoscience, physics) [reviewed the definition problem in 2021](https://par.nsf.gov/servlets/purl/10282580). It is a narrative review with no search strategy and no effect sizes.

Its stance first, because it is easy to misread. This paper is **not** against the effectiveness of active learning. The authors call Freeman's meta-analysis "widely cited," say it provided a "solid evidentiary basis," and say continuous lecture "almost certainly" produces worse outcomes than more active instruction. What they criticize is the term: as shorthand for "something other than lecture" it is useful in teaching practice, but it does little to advance research on learning, because the things labeled with it belong to different categories: psychological constructs, pedagogies, strategies, and design principles.

The claim "active learning is defined as not-lecture" holds only in part here. Of the six discipline definitions, only physics is purely exclusionary (instruction that is not passive lecture, not recipe labs, not algorithmic problem-solving); most of the others define it positively through "engagement" or "knowledge construction." The biology team reports its own earlier survey: of 148 biology education papers, more than half gave no definition and only listed strategy examples, and 30% did not define the term at all. That supports "most papers give no definition."

Two points matter for writing:

- The authors say learners who look passive may still be learning, for example while listening attentively or thinking while reading.
- Reading "active" literally as requiring movement or overt behavior can become a barrier for students with disabilities.

## A better-controlled experiment: Deslauriers et al. (2019)

Most studies in the meta-analyses compare different years or different sections. Louis Deslauriers and colleagues' [2019 experiment](https://pmc.ncbi.nlm.nih.gov/articles/PMC6765278/) used an individual-level randomized crossover design within one course, a rare randomized experiment in this literature.

The design: an introductory mechanics course at Harvard, 149 students, two consecutive classes in week 12 of the semester. Students were randomly split into two groups; in the first class one group got the active version and the other the passive version, and in the second class they switched, so everyone had each version once. Slides, handouts, and the complete worked solutions were identical in both versions. In the passive version the instructor explained fluently and solved the examples; in the active version students tried the problems first in small groups while the instructor walked around asking questions and helping, and after each attempt the instructor gave the same complete solution. Right after class, students filled in a questionnaire and then took a 12-item multiple-choice test.

Results: the active version scored 0.46 SD higher on the test, and students rated it 0.56 SD lower.

Conditions to read alongside:

- **The active version changed three things at once**: trying first, working in small groups, and an instructor circulating to help. The authors describe the crucial difference as "whether students were told directly how to solve each problem or were asked to try to solve the problems themselves in small groups before being given the solution," but the group work and instructor interaction also existed only in the active version. Even in the active version, about half the time was the instructor giving short explanations after each activity.
- **The self-rating is a composite of four items**: whether students enjoyed the class, felt they learned a great deal, found the instructor effective, and wished all their physics classes were taught this way. Only one item asks directly how much they learned; the authors say using that item alone gives "virtually identical" results, without printing the numbers.
- **One class each, tested immediately**, with no delayed test; one school, one subject, two instructors.
- The authors attribute the gap to the greater cognitive effort active learning requires and to students taking the fluency of a lecture as learning. The paper's Significance statement says "We show that this negative correlation is caused in part by the increased cognitive effort," but the body does not measure cognitive effort; the support is interviews with 17 students and a regression predicting one questionnaire item from another. The body's own wording is "some evidence suggesting."
- Be careful with "negative correlation" as well: the paper reports that the two conditions' means move in opposite directions, not a correlation between self-rating and score across students. It cannot be written as "the more students felt they learned, the less they learned."

For writers, only the direction transfers: people who try first and then see the solution may feel, in the moment, that they learned less. The active condition had classmates and an instructor present; there was no solitary-reading condition. How accurately readers judge their own learning gets its own post later in the series.

## ICAP: visible actions are not the processing in the head

### Four modes

Michelene Chi and Ruth Wylie's [2014 ICAP framework](https://education.asu.edu/sites/g/files/litvpz656/files/lcl/chiwylie2014icap_2.pdf) divides learner engagement into four modes, based on **what the learner overtly does**:

| Mode | Definition | Examples in an article (as classified in the original) |
|---|---|---|
| Passive | Oriented toward the material, receiving information, with no other overt action | Reading a passage, watching a video |
| Active | Some overt action or manipulation that focuses attention | Highlighting, choosing one option, copying solution steps, repeating |
| Constructive | Producing something beyond what the material gives | Explaining in one's own words, drawing a diagram from the text, asking questions, making predictions |
| Interactive | Dialogue in which both partners' contributions are mainly constructive, with frequent enough turns | Explaining together with a partner (the partner can also be a computer agent) |

The most direct use of this table for writers is to separate "making the reader move" from "making the reader produce something." In the original, selecting a multiple-choice option counts as active, and a self-explanation that only copies also counts as active; only producing something the text did not say counts as constructive. Interactive in the original means only dialogue in which both sides are constructing. My inference: the static questions and answers in the article itself have no dialogue partner and do not meet this definition, so with those questions alone, the ceiling is constructive by definition. Reaching interactive requires a dialogue partner, which the original allows to be a computer agent. The code for this site's article pages includes an AI chat sidebar that carries the article's context; I did not check whether it is enabled on the live site or whether both sides are constructing when readers use it, so this post does not count it.

### The ordering is a hypothesis, and the supporting evidence is selected

The authors' hypothesis is that learning outcomes rank interactive > constructive > active > passive, and they state that the hypothesis is "conceptually derived." They also claim it has been validated, with four kinds of evidence: one study from their own lab with all four modes, two studies with three modes, pairwise comparisons for three activities (note-taking, concept mapping, self-explanation), and classroom studies.

Having read the full paper, here is what to know about that evidence:

- No search procedure and no effect sizes. Most studies were assigned to a mode by the authors after the fact; the original studies did not use this classification.
- Most pairwise comparisons are constructive versus passive. In the self-explanation table, the constructive-versus-active cell reads "No known studies." For interactive beating constructive, the three activities together offer five studies, one of which found no learning difference and one of which reports only problem-solving process measures.
- The only study with all four modes (Menekse et al. 2013) is the authors' own, and its constructive and interactive groups did not read the passage but interpreted a diagram instead, so the material changed too. The original only says the modes differ by "around 8% to 10%," with no sample size or test.
- No difference within the same mode is also counted as support, and the paper lists no study in which a lower mode beat a higher one.

The authors acknowledge several things themselves: overt behavior is only a proxy, and students listening to a lecture may be processing deeply without showing it; an activity designed to be constructive may be carried out as active (asked to write a summary, students may just delete and copy); the knowledge-change processes tied to each mode are hypothetical, and the authors have not run studies to verify them; and the predictions may fail when assessments are shallow, when the material is arbitrary rules with no rationale to reason through, or when students lack the relevant background.

### A critical comment: Thurn et al. (2023)

Christian Thurn and colleagues' [2023 comment](https://doi.org/10.1038/s41539-023-00197-4) questions two core assumptions of ICAP. It is a four-page comment, and the authors say it is not a systematic review.

- **Can overt behavior stand for cognitive engagement?** They argue it is unreliable. Their basis is a general conclusion from research on teaching quality (the covert features of learning activities determine their effectiveness), plus two hypothetical examples: watching a video with an observation assignment is passive on the surface but may be constructive cognitively; listening to a teacher explain why a worked example matters looks passive, but students "may indeed learn better." Neither example cites an experiment that directly compares *the same overt behavior with different covert processing*; the second cites two papers on relevance instructions and expansive framing.
- **The ordering:** They say that, to the best of their knowledge, no one has systematically evaluated it. They give three counterexamples: in the Menekse study the difference between interactive and constructive was not significant (this is Thurn's account; I did not read Menekse); one study's outcome was engagement, not learning; and in sixth-grade algebra studies co-authored by one of the comment's authors, direct instruction beat carefully designed self-learning materials (those studies were not ICAP studies; the comment's authors assigned the modes afterward).
- **Recommendation:** Teachers should not choose activities by ICAP but should use formative assessment to see students' thinking. The authors concede this puts a heavier load on teachers.

The two papers do not disagree that overt behavior is not covert processing; Chi and Wylie concede that themselves. They disagree about whether the proxy is good enough: Chi and Wylie think it works in the classroom and that teachers can apply it; Thurn and colleagues think it does not, and that it might distract teachers. Both sides make their case the same way, by selecting studies.

## The doer effect: log data from online courseware

This line is closer to "one person working through material" than the classroom studies: students read the text, watch videos, and do practice embedded next to the text on their own on the web, and the system logs every action.

### The 2015 starting point

Kenneth Koedinger and colleagues' [2015 study](https://pact.cs.cmu.edu/pubs/koedinger,%20Kim,%20Jia,%20McLaughlin,%20Bier%202015.pdf) analyzed a psychology MOOC. [The post on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en) already covers it: one more SD of practice went with weekly quiz totals 0.44 SD higher, more than six times the association for watching more video or reading more pages; the quiz items came from the practice materials' item bank; and on the instructor's own final exam, students high only on practice reached excellent scores about as often as students high only on video, with a clear gain only when both were high. Here I follow how the next three papers handled "students who do practice were more conscientious to begin with."

### 2016: can it be called causal?

Koedinger and colleagues' [2016 study](https://doi.org/10.1145/2883851.2883957) used data from the same MOOC to separate "practice works" from "conscientious students do more of everything." The logic: if it were only a student trait, practice done in other units should predict this unit's quiz as well as practice done in this unit.

The results cut both ways:

- With all practice outside the unit pooled, practice in the unit and practice outside it had almost the same coefficient on the unit quiz. By the criterion the authors set in their own introduction, that is what the "student trait" explanation predicts; the abstract does not mention it.
- Splitting outside practice into "before" and "after," practice within the unit was largest, before was next, and after was smallest. The authors read the larger "before" coefficient as consistent with prerequisite relations between units. But practice "after" was still significant, meaning practice done after the quiz also predicted that quiz, and the authors concede this suggests a general trait such as a "conscientious doer/learner." Differences among the three coefficients were not tested.

The authors conclude that the effect "cannot be explained solely by some global student trait," and they also state that other third variables (such as particular interest in one unit) remain possible and that experiments are warranted. So this paper rules out the explanation that a global trait is the *only* factor; it does not rule out motivation.

Where "doing is six times as effective as reading" comes from in this paper: the authors ran 10 regressions across four other college courses plus the MOOC, and the ratio of the doing coefficient to the reading coefficient ranged from 2.2 to infinity (one reading coefficient was negative), with a median of 6. It is the median of ten ratios, not a pooled estimate, and it has no interval.

### 2023: seven courses, eighteen thousand students

Rachel Van Campenhout and colleagues' [2023 study](https://doi.org/10.1145/3576050.3576103) repeated the analysis on seven courses and 18,546 students at one online university. The doing coefficient was positive and significant in all seven courses and all five analyses.

Two of its results deserve more attention than "the replication succeeded":

- **With the final exam as the outcome**, the reading coefficient was negative in all fourteen models and significantly negative in eleven; the prior-knowledge (pretest) coefficient was on average two and a half times the doing coefficient. In these courses the unit tests were scored in the system but, like the practice, did not count toward the course grade; the final exam was the only graded assessment. With the unit tests from the same system as the outcome, the doing coefficient was much larger. The authors explain this with content alignment: the practice and unit tests come from the same courseware, while the pretest and final exam were written by a different team.
- **In what the authors call the "causal model"** (practice within the unit versus outside it), the doing-to-reading ratio was 1.3 to 6.2, the smallest of the five analyses; in the largest course, statistics (45% of all students), the coefficient for practice outside the unit was slightly larger than for practice within it. The authors say on the spot that this model "does not demonstrate causality conclusively," and the limitations section says it cannot prove causality; yet the abstract and introduction describe earlier research as having shown causality, and another section of the discussion says "because doing practice causes learning."

### 2025: a study that did not detect it

Arun-Balajiee Lekshmi-Narayanan and colleagues' [2025 workshop paper](https://par.nsf.gov/servlets/purl/10632298) analyzed an online e-book for high school AP Java. Of 1,060 students, only 92 had both pretest and posttest. Controlling for the pretest, the doing coefficient was negative and no difference was detected; the authors write that they "failed to identify a doer effect in learning outcomes" and attribute this themselves to the small sample. On a different outcome, how far students got in the book, the same paper found a stronger association for doing than for reading.

The evidence here is weak: the key analysis has only 92 students and the pretest does not even predict the posttest; two of the three results tables contain numbers that contradict each other, and the text disagrees with the tables in two places. All it can support is "not detected in one small sample"; it is not a counter-finding on a par with the papers above.

### Authors and the courseware

The four authors of the 2016 paper are all at Carnegie Mellon (the 2015 paper includes the same four), and the courseware studied is the same university's Open Learning Initiative (OLI); the 2016 paper has no conflict-of-interest statement. The four authors of the 2023 paper are all listed under VitalSource Technologies, and the paper has no conflict-of-interest section. (Both are LAK conference papers; I did not check whether papers at this conference usually include such a section.) Co-authors of the 2025 paper also wrote earlier doer-effect papers, so that non-detection comes from the same research circle, not from outside critics. These are facts stated on the papers; I do not infer motives from them. What can be checked is the method, and the methodological problems are described above.

### What this line measures

Putting the four papers together: "doing" is how many practice items a student started and "reading" is how many times a page was opened; most analyses measure counts, not time spent or what students thought; students chose how much to do; and the outcome is usually quizzes in the same system. What is established is that "students who do more practice score higher on the quizzes in the same system," an association that recurs across a dozen-plus courses. Whether doing the practice causes it, the authors themselves say still needs experiments. In addition, Van Campenhout and colleagues say of their courseware's practice that "Most questions are low level Bloom's questions that target recognition and recall." So at least in those seven courses, "doing practice" mostly means recognition and recall items, not items that ask the learner to produce something new.

## Does it carry over to one person reading an article?

Set each line of evidence next to "one person reading a web article":

- **The classroom meta-analyses** compare whole courses taught differently, and the active sections often include group discussion and instructor responses. An article has no classmates and no instructor, so those components do not carry over.
- **The Deslauriers experiment** is the same: the active condition was group problem-solving with an instructor circulating.
- **ICAP's** categories can be borrowed to check what a question asks readers to produce; the evidence for the ordering is thin, and direct comparisons of constructive against active are especially scarce.
- **The doer effect** has the closest setting: online courseware, questions embedded next to the text, immediate feedback after answering. But it is observational, the students were enrolled in courses or registered for a MOOC, and the outcomes are mostly quizzes from the same system.
- **Experiments comparing the same text with and without questions** are in [the post on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en): questions inserted after reading mainly help the content they ask about, and the materials are mostly short texts in the lab. I found no controlled experiment on long web articles.

So "active learning beats lecture by half a standard deviation" cannot be translated into "adding practice to an article adds half a standard deviation of learning." None of the studies read here compared one person reading an article with and without practice.

## Where sources disagree

The following results point in different directions, or look contradictory but measure different things. I set them side by side without picking a side.

**Is Freeman's result robust to study quality?** Freeman and colleagues compared effect sizes across random and three quasi-experimental designs, detected no difference, and called the result robust. Martella and colleagues counted controls study by study, found most not done or not reported, and concluded that confidence in the causal attribution should be lowered. They answer different questions: one compares effect sizes, the other counts controls, and Martella computed no effect sizes. Also, Martella and colleagues write twice in their results that Freeman "reported they excluded articles that did not have student equivalence," and repeat it once in their discussion. Freeman's own criterion was to exclude studies where the lecture section was significantly worse on prior-ability measures, and Freeman's own quality breakdown includes 39 comparisons with "no data on student equivalence." Martella's discussion also says Freeman excluded articles without instructor equivalence, but in Freeman, whether the same instructor taught both groups is a coded grouping variable, with 59 comparisons having no instructor data or different instructors; equivalence of exams is what Freeman actually required (I arrived at this comparison by reading the two extraction records side by side).

**Is active learning defined as not-lecture?** Martella and colleagues say the term has nothing in common beyond "the reduction or elimination of lecture" and that defining something by what it is not causes problems. Among Lombardi and colleagues' six discipline definitions, only physics is purely exclusionary; Freeman's consensus definition contains a contrast ("as opposed to passively listening") but also positive content (activities or discussion, higher-order thinking, group work).

**Is the ICAP ordering empirically supported?** Chi and Wylie say the hypothesis "has been validated through a number of classroom and laboratory studies." Thurn and colleagues call the empirical basis "not convincing." Thurn and colleagues also say Chi and Wylie "explicitly state" that their review is selective and only cites supporting research; having read Chi and Wylie in full, I did not find a sentence that says so. The review does in fact have no search procedure, and on that point the two sides do not conflict.

**What the Menekse (2013) study looked like.** Chi and Wylie describe one study with all four modes, where the passive group read a passage. Thurn and colleagues describe two studies: the first with 42 engineering students, where the interactive–constructive difference was not significant; the second with 120 students, where the passive group had to read the text aloud. I did not read Menekse and cannot tell which description is right.

**Has the doer effect been shown to be causal?** Koedinger et al. 2016 (introduction and discussion) and Van Campenhout et al. 2023 (methods and limitations) both state that causality was not proven. Van Campenhout and colleagues' abstract and introduction say "Research on the doer effect has shown it to be causal to learning," citing that same 2016 paper; Lekshmi-Narayanan and colleagues' related-work section also says earlier research confirmed causality at scale.

**Is the 2023 replication consistent with 2016?** Van Campenhout and colleagues call their results "entirely consistent." But in their final-exam models every reading coefficient was negative, while in Koedinger 2016's final-grade models every reading coefficient was positive; and the distal outcomes differ (final exam score versus a five-level course grade).

**Course level.** In Kozanitis and Nenciovici's humanities and social sciences data, upper-level courses showed larger effects than introductory ones; in Freeman's STEM data, no difference was detected. On class size the two agree, with larger effects in smaller classes, although Kozanitis and Nenciovici's discussion describes this as inconsistent with Freeman.

## What you can do

These are this site's judgments, each with its basis. "Basis" means which results led me here, not that research directly tested the practice.

1. **Don't use "active learning is better" as the reason for a question, and don't write sentences like "research shows learning by doing works better."** Basis: the classroom meta-analyses compare whole-course teaching formats with an instructor and classmates; none of the studies read here compared an article with and without questions. If you cite it, state the comparison and the setting.
2. **When writing a question, first ask what the reader has to produce.** Ask readers to write something the text did not say (why, what changes under a different condition, an example of their own), not just to pick an option, expand a block, or write a sentence from the text again. Basis: ICAP's categories (selecting and copying are active; producing new content is constructive). Direct evidence that constructive beats active is scarce, so this is mainly this site's choice.
3. **Put a question right after the content it tests.** Basis: the courseware in the doer-effect studies is designed this way, with practice embedded next to the text; but that is observational and no other placement was compared, so this is the site continuing its current spec, not a new basis. Whether the answer should follow the question immediately, come later, or be collapsed is not answered by this post's sources; [the post on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en) covers it and concludes that research has no answer yet and the spec should not prescribe it. In the doer-effect courseware, immediate feedback after answering is part of the courseware's design, not a variable that was compared.
4. **Add practice after the explanation; don't replace the explanation with it.** Basis: on Koedinger 2015's final exam, only students high on both practice and video (results with reading were similar) did clearly better; on Van Campenhout 2023's final exam, prior knowledge mattered far more than doing; in Deslauriers' active condition, about half the time was still the instructor explaining; Lombardi and colleagues say learners who look passive may still be learning.
5. **Don't judge whether an article works by whether readers find it smooth.** Basis: in the Deslauriers experiment, the class in which students learned more got lower self-ratings. That is one experiment, one class each, tested immediately; a later post covers what the signals available to readers and writers each measure.

## Checking this site's course-guide spec

This site's course-guide spec is in `course-guide-contract.md`. The full clause-by-clause check is in [the post on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en); here I look only at clauses related to the learning-by-doing evidence, using the version in the working directory on 2026-10-14.

| What the spec says now | What this post's sources say | Verdict |
|---|---|---|
| "Self-checks need an answer or a criterion, not just 'think about it'" | This clause requires the writer to give an answer or criterion. This post's sources do not address answers directly; ICAP adds only an adjacent angle: if a question only asks readers to think, which kind of processing they do cannot be seen (Thurn and colleagues add that output does not necessarily reflect the learning process either) | [Part 9](/posts/learning/2026-10-13-teaching-text-questions-feedback-en) rates it "supported" based on the feedback meta-analysis; this post's sources neither change that verdict nor add support |
| Concept guides include "an explanation question or variation problem the reader can judge" | Constructive under ICAP; the meta-analysis on prompting readers to explain is in [part 1](/posts/learning/2026-10-13-teaching-text-evidence-en) (g = 0.55) | Supported, but the support comes from part 1's sources, not from this post's classroom studies |
| "One question at the end of each main section, with an answer or criterion" | Doer effect: practice embedded next to the text is associated with quiz scores, observational; experiments on questions in text are in part 9 | This post's sources provide only correlational evidence |
| The spec's "design basis" does not cite classroom meta-analyses like Freeman | Those studies compare whole-course teaching formats | Recommend continuing not to cite them; if cited, state the comparison |

As of 2026-10-14, the spec has not changed because of this post.

## Three things to do tonight

Pick a teaching article you have written; about an hour:

1. Mark every place where the article asks the reader to "do" something and tag each with an ICAP category: only picking an option, opening a collapsed block, or writing out a sentence from the text again gets "A" (active); writing something the text did not say (a prediction, a question, an explanation in their own words) gets "C" (constructive). If the whole article is "A," take the most important spot and change it so the reader writes down a prediction before reading on, for example (an example I wrote): "If each step used the whole dataset instead of a small batch, would the direction of each step become steadier or noisier? Write down your guess first."
2. Find the most important complete example in the article and, before the solution, add a line like "Work through the second step yourself, then read on."
3. Search the article for sentences like "research shows active learning…" or "learning by doing works better"; if you find any, add the comparison and the setting, or delete them.

## Limits of this evidence

- **No study directly tested one person reading a web article.** The studies read here are set in college classrooms and online courseware used in for-credit courses. Carrying any result over to a web guide is my inference.
- **The classroom meta-analyses are mostly US colleges and STEM.** Freeman's search ends in 2010; the humanities and social sciences one has reporting-quality concerns and does not publish its list of included studies.
- **Most classroom studies did not use random assignment**, and many controls are not reported (Martella et al.). Martella and colleagues computed no effect sizes, so no one has measured how much the missing controls affect the effect sizes.
- **The Deslauriers experiment** has one school, one course, two instructors, one class each, and an immediate test; the active condition changed three things at once.
- **ICAP's evidence is studies selected and reclassified after the fact**, and the critical comment also argues from selected studies. I did not obtain independent tests of the ordering, and I did not read Menekse (2013).
- **The doer effect is all observational**; most analyses count actions rather than time or thinking, the practice is mostly low-level recognition and recall items (by Van Campenhout and colleagues' own account), and the outcomes are mostly quizzes from the same system; the seven 2023 courses all come from one online university; the 2025 paper has a small sample and contradictory numbers in its tables. The authors' relation to the courseware is described in the body.
- **My inferences and judgments**: static questions in the article itself reach at most constructive under ICAP's definition; borrowing the direction of Deslauriers for reading; the five items under "What you can do"; the verdicts in the spec table. Each is marked in the body.
- **Secondhand citations**: Mayer (2004) on behaviorally active versus cognitively active (cited by Martella et al.), the survey of definitions in biology education papers (reported by Lombardi et al. from Driessen et al. 2020), Menekse (2013) and Ziegler et al. (2018) (described by Chi and Wylie and by Thurn et al.). I read none of these originals.
- **Not read**: the tests of ICAP by Wiggins et al. 2017, Henderson 2019, and Vosniadou 2023; Theobald et al. 2020, a meta-analysis on active learning and achievement gaps (further from this post's question).
- **Gaps in reading**: for Freeman's study-level supplementary table I only made counts and did not read it row by row; I did not obtain Martella's online supplement, and its two tables were not checked against the PDF layout; I did not see Kozanitis's funnel plot.

## Appendix: design and numbers for each study

**Freeman, Eddy, McDonough, Smith, Okoroafor, Jordt, Wenderoth (2014)**, PNAS 111. Read the main text and the supplement. Search through 2010-01-01, 642 candidate papers; two datasets: 158 independent comparisons of exam scores and 67 independent comparisons of failure rates (the abstract's "225 studies" is the sum of the two, counted in comparisons, not papers). Inclusion criteria included weekly class time differing by no more than 30 minutes and identical or equivalent exams. Exam scores g = 0.47 (Z = 9.781); failure rate odds ratio 1.95 (equivalent to a risk ratio of 1.5), active 21.8%, lecture 33.8%. The failure-rate data include no randomized designs. By assessment: concept inventories 0.883 (22), instructor-written exams 0.441 (109), a significant difference. By class size (grouped from a histogram after coding): ≤ 50 students 0.635, 51–110 students 0.409, > 110 students 0.314. No difference detected between majors and non-majors or between introductory and upper-level courses. No difference detected across disciplines; the intervals for computer science (8) and geology (2) cross zero. Quality groups: randomized or crossover designs, 16 comparisons, 0.514 (0.322–0.706); three quasi-experimental groups 0.467, 0.534, 0.362; across the four groups Q = 2.097, p = 0.553. By type of practice (supplement only): Q = 11.173, p = 0.131; worksheets 90 comparisons 0.364, problem-based learning 9 comparisons 0.156 (−0.215–0.526). The exam-score funnel plot is asymmetric (Egger one-tailed p = 0.00032); after trim and fill 0.47 (0.37–0.56); after removing 12 outliers 0.45. I counted from its study-level supplementary table: 22 of the 158 comparisons have negative effect sizes. Limitations the authors list: 0.47 may be an underestimate (more withdrawals from lecture sections), the instructors were volunteers, intensity and type of practice could not be evaluated, the failure-rate data lack randomized designs, the cluster correction borrows the intraclass correlation from K–12.

**Kozanitis and Nenciovici (online 2022, volume 2023)**, Higher Education 86. Search covers 2000 to 2019; 104 papers, 111 effect sizes, 15,896 students. g = 0.489 (0.414–0.564); heterogeneity 64.5%: the paper labels it τ², and I computed from Q and the degrees of freedom that it is I². Posttest only 83, pretest and posttest 28. Practices: flipped 36, clickers 30; grouping by practice p = 0.296, no difference detected. Upper-level 0.803, introductory 0.425 (30 did not report level). Egger one-tailed p = 0.007, Kendall one-tailed p < 0.001; after trim and fill 0.476. Problems in the tables: the history row has g = −0.085 but an interval of −0.216 to 0.997; the k values of the four assessment-type rows sum to 140; the Z value and the confidence interval do not match. No limitations section.

**Martella, Martella, Yatcilla, Newson, Shannon, Voorhis (2023)**, Educational Psychology Review 35. Freeman set: 176 articles; 2015–2022: 260 eligible articles, simple random sample of 84 (the new set adds health sciences and excludes psychology). The unit of analysis is the article. Figures below are "Freeman set / new set / combined": random assignment 10.2% / 8.3% / 9.6%, quasi-experimental 88.1% (all three); direct measures showing equivalence 23.3% / 31.0% / 25.8%, not reported 72.7% / 54.8% / 66.9%; no implementation fidelity check for the experimental group 92.6% / 94.0% / 93.1%; no operational definition at all for the control group 47.7% / 40.5% / 45.4%, for the experimental group 10.2% / 3.6% / 8.1%; whether both groups' time was equal not reported 57.4% / 73.8% / 62.7%, explicitly unequal 11.2% (combined). Meeting 11 or more controls: zero articles under strict counting; 5 articles (1.9%) under lenient counting; half or fewer met 62.7% (combined). Active group statistically significantly better 32.7%, lecture group statistically significantly better 0.4%, no inferential statistics 16.9% (combined). Coding agreement 92.5% and 93.0%; disagreements resolved with the primary rater's code. Limitations the authors list: the coding unit is the article, 2010–2014 falls in neither set, only a third of the new set was coded, other researchers might code differently. Some numbers in the paper are inconsistent (for example, the share where the lecture group did better is 4.0% in the results and 3.4% in the discussion). Interest statement: none. The first and second authors had previously published critiques of this literature and cite themselves in several places (an observation from the extraction, not listed as a limitation in the paper).

**Lombardi, Shipley, and seven discipline teams (2021)**, Psychological Science in the Public Interest 22. Narrative review with no methods section; each discipline team wrote a white paper, and the two lead authors synthesized them. The table of discipline definitions has only six rows (geography is missing). The survey reported by the biology team: 148 papers from three biology education journals, 2016–2018; 53% listed only strategy examples, 30% gave no definition. The authors propose a working definition centered on student agency and an ecosystem framework, and say the framework is not a theoretical proposal.

**Deslauriers, McCarty, Miller, Callaghan, Kestin (2019)**, PNAS 116. Read the main text and the supplement. 157 enrolled, 149 participated, over spring and fall semesters. No difference detected between the randomized groups on the pretest, the attitude survey, or the average of the first two midterms. Main results (standardized coefficients, controlling for topic, semester, instructor, pretests, midterms, gender): test +0.46 (robust SE 0.10), self-rating −0.56 (0.13), both p < 0.001. Manipulation check (the item on being mainly a listener while the instructor presented): passive 3.9, active 2.9. Of 17 interviewees, 15 found the active class "disjointed and lacking in flow." Predicting the "learned a great deal" item from the item on the instructor's effectiveness: coefficient 0.51, and with that item included the teaching mode was no longer significant. The following semester, in a course taught the same way, a 20-minute briefing was given; at the end of the semester over 65% self-reported that their feelings about active learning improved, with no comparison group. Interest statement: none.

**Chi and Wylie (2014)**, Educational Psychologist 49. Theory paper plus a narrative review, with no search procedure and no effect sizes. The four modes are defined by overt behavior. Pairwise comparison tables: three for note-taking, concept mapping, and self-explanation, plus one table of classroom studies; in all three activity tables *interactive versus active* reads "No known studies." For the four-mode study (Menekse et al. 2013), the paper gives only "around 8% to 10%"; eyeballing the figure, posttests are about 55%, 62%, 73%, 82% (no numbers are printed on the figure). Funding: Institute of Education Sciences.

**Thurn, Edelsbrunner, Berkowitz, Deiglmayr, Schalk (2023)**, npj Science of Learning 8. Comment, 4 pages, no tables, figures, or new data; 34 references. The interest statement reads "The authors declare competing interests." with no details; it may be missing a "no," but I cannot confirm.

**Koedinger, Kim, Jia, McLaughlin, Bier (2015)**, Learning at Scale. Numbers are in [the appendix of the post on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en). One addition: in the extreme-group analysis, the share with excellent final exam performance was 16% for high practice only, 15% for high video only, and 31% for both high.

**Koedinger, McLaughlin, Jia, Bier (2016)**, LAK '16. Same MOOC; regressions use the 939 students registered for the interactive courseware, 11 unit quizzes. Within unit versus outside unit (unit quiz Z score): doing 0.195 vs 0.196, reading 0.015 (p = 0.094) vs −0.006, watching 0.036 vs −0.002. Before / within / after (units 2–10): doing 0.143 / 0.181 / 0.078, all three significant; reading none significant; watching 0.054 / 0.025 / 0.033. Four UMUC courses plus the MOOC, 10 regressions, doing-to-reading ratio 2.2 to infinity, median 6; with the course grade as outcome, the adjusted R² for both the information systems and MOOC models is 0.08. Table 5 gives no standard errors or p values. Acknowledgments: funding from NSF and Google; no conflict-of-interest statement.

**Van Campenhout, Jerome, Dittel, Johnson (2023)**, LAK '23. Seven competency-based courses at one online university, 18,546 students, about 15.2 million events; statistics 8,397 students. Unit tests were scored in the system but did not count toward the course grade; the final exam was the only graded assessment, could be retaken, and only the first attempt was used. Final-exam models: reading coefficients negative in all 14, significant in 11; the pretest-to-doing coefficient ratio averages 2.5. Unit-test models, doing-to-reading ratio: 5.7 to 16.3 without pretest, 5.0 to 11.8 with pretest. "Causal model" doing-to-reading ratio 1.3 to 6.2; statistics within-unit doing 0.1007, outside-unit doing 0.1027. The tables give no standard errors, confidence intervals, or R², and the number of students per course in the causal model is not reported. Limitations the authors list: one institution, competency-based courses; the model does not prove causality; other third variables remain possible. No conflict-of-interest or funding statement.

**Lekshmi-Narayanan, Asher, Brusilovsky, Carvalho (2025)**, CSEDM'25 workshop. 1,060 students, 694 with a pretest, 92 with both pretest and posttest. Posttest models (controlling for the pretest): activity time −0.08 (SE 0.11), activity count −0.09 (SE 0.15), both not significant; page-read count −0.27 (significant); the pretest itself is not significant either. How far students got: share of activities done 0.19, share of pages read 0.08. The tables contain contradictions (for example, one row with an estimate of −0.4, a standard error of 0.00, and t of −0.85); mean reading time is 220 hours, a sign of preprocessing problems. Funding: NSF.

## References

Each item was read in full with an extraction record; parts I could not read are noted in parentheses.

- [Freeman et al. (2014), Active learning increases student performance in science, engineering, and mathematics](https://doi.org/10.1073/pnas.1319030111) (published version, [full text and supplement on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4060654/); study-level Table S4 only counted, not read row by row).
- [Kozanitis & Nenciovici (2022), Effect of active learning versus traditional lecturing on the learning achievement of college students in humanities and social sciences: a meta-analysis](https://doi.org/10.1007/s10734-022-00977-8) (published version, CC BY; funnel plot not seen).
- [Martella et al. (2023), How Rigorous is Active Learning Research in STEM Education?](https://doi.org/10.1007/s10648-023-09826-1) (published version, CC BY; online supplement not obtained).
- [Lombardi, Shipley et al. (2021), The Curious Construct of Active Learning](https://doi.org/10.1177/1529100620973974) (published version, [full text in the NSF public access repository](https://par.nsf.gov/servlets/purl/10282580); the second half of the reference list only skimmed).
- [Deslauriers, McCarty, Miller, Callaghan & Kestin (2019), Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom](https://doi.org/10.1073/pnas.1821936116) (published version, [full text and supplement on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6765278/)).
- [Chi & Wylie (2014), The ICAP Framework: Linking Cognitive Engagement to Active Learning Outcomes](https://doi.org/10.1080/00461520.2014.965823) (published version, [full text posted by the authors' college](https://education.asu.edu/sites/g/files/litvpz656/files/lcl/chiwylie2014icap_2.pdf)).
- [Thurn, Edelsbrunner, Berkowitz, Deiglmayr & Schalk (2023), Questioning central assumptions of the ICAP framework](https://doi.org/10.1038/s41539-023-00197-4) (published version, CC BY).
- [Koedinger, Kim, Jia, McLaughlin & Bier (2015), Learning is Not a Spectator Sport](https://pact.cs.cmu.edu/pubs/koedinger,%20Kim,%20Jia,%20McLaughlin,%20Bier%202015.pdf) (DOI 10.1145/2724660.2724681; numbers on the figures could not be read).
- [Koedinger, McLaughlin, Jia & Bier (2016), Is the Doer Effect a Causal Relationship?](https://doi.org/10.1145/2883851.2883957) (published version, open access in the ACM Digital Library).
- [Van Campenhout, Jerome, Dittel & Johnson (2023), The Doer Effect at Scale](https://doi.org/10.1145/3576050.3576103) (published version, open access in the ACM Digital Library).
- [Lekshmi-Narayanan, Asher, Brusilovsky & Carvalho (2025), Can Motivated Students Do More Activities?](https://par.nsf.gov/servlets/purl/10632298) (published workshop paper, NSF public access repository; no DOI).
- Posts on this site: [Writing the examples and openings of a teaching article](/posts/learning/2026-10-13-teaching-text-evidence-en), [When a teaching article should use a diagram](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en), [Pairing a teaching article with video](/posts/learning/2026-10-13-instructional-video-in-articles-en), [When a reader wants the video mid-article](/posts/learning/2026-10-13-video-beside-text-layout-en), [Writing questions and wording in a teaching article](/posts/learning/2026-10-13-teaching-text-questions-feedback-en).
