---
title: "How Far Should the Code in a Teaching Article Go: Subgoal Labels, Tracing, Parsons Problems, and Whether It Runs"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, course-guide, self-learning, python, blog]
lang: en
description: "What the research says about code in teaching articles: a review of programming worked examples, classroom and lab studies of subgoal labels, live coding versus prepared code, an explicit line-by-line tracing strategy, a multi-institution study of Parsons problems, and whether public notebooks, gists, and Stack Overflow snippets run as published. Compared clause by clause with the project-section spec of this site's CS50 AI guides."
tldr: "In a quasi-experiment in one intro course, sections whose worked examples labeled what each step was for did better on quizzes right after learning, with no significant difference on later exams. Live coding, and Parsons problems in place of writing code, showed no measured difference in learning. Public GitHub notebooks rerun in their saved order finished without error about a quarter of the time; no study has measured how code that does not run affects what readers learn."
series:
  name: "Writing Articles That Teach"
  order: 3
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-code-in-teaching-articles)

This is part 3 of the series "Writing Articles That Teach," and it is about the code inside an article. The earlier parts covered text ([examples and openings](/posts/learning/2026-10-13-teaching-text-evidence-en), [questions and feedback in the text](/posts/learning/2026-10-13-teaching-text-questions-feedback-en)) and [diagrams](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en). Formulas, notation, and jargon will come in a later part.

The trigger was this site's [seven weekly guides to Harvard CS50 AI](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en). On 2026-10-13, an independent review downloaded the officially distributed files and compared the code in each week's article against them; for some weeks the reviewer also plugged the code in and ran it. In several weeks, the old project reference implementations either did not run or did not match the interfaces in the official files. How each week was confirmed varied a lot (details in "This site's example"). After those fixes, the project sections were rewritten again because of the course's academic honesty policy: problem-solving approach, pseudocode, common mistakes, and how to check your work come first, and the full implementation is folded at the end. Both episodes left three questions. How far should the code in an article go? How much evidence is there for splitting code into steps, teaching readers to trace execution, and giving problems that ask readers to reorder lines of code? And has anyone measured what code that does not run does to readers?

**How the sources were chosen and read.** The 13 sources here were picked for close reading from one round of scanning. Each was read from start to finish, with an extraction record kept. They lean heavily in one direction: computing-education conference papers, introductory university programming courses (CS1), US schools, English. None of them studied people reading teaching articles on the web. The learning studies used students in classrooms or labs; the studies of whether code runs had no readers at all. I found only one quantitative meta-analysis of programming instruction (Scherer et al. 2020), and I could get only its abstract, so I do not cite its numbers. The backbone of this article is therefore a narrative literature review, which sorts studies into "significant" and "not significant" and pools no effect sizes.

## The conclusions first

| Practice | Evidence | Strength |
|---|---|---|
| Label each step of a worked example with what the step is for (subgoals) | A classroom quasi-experiment in one CS1 course: quizzes right after learning 48% vs 41%, no significant difference in the later exam average. Lab studies: the effect depends on how far the practice problem is from the example | Moderate; most studies come from one team |
| Give a program with a few lines missing and ask the reader to complete it | A review reports three studies by one team plus one other, all in the same direction, the earliest from 1990; in one, the completion group spent more time, and another reported no inferential statistics | Weak to moderate; all secondhand, I did not read the original studies |
| Write code live step by step, versus explaining prepared code | A quasi-experiment in one CS1 course: no measured difference in grades or programming process; more students in the live section asked the instructor to slow down | No measured difference; a classroom lecture, not an article |
| Teach readers to trace line by line and write variable values in a table | A 24-person experiment: on-the-spot tracing problems averaged 30.0 vs 24.6 (out of 36), a one-tailed test just past the threshold | Weak, small sample |
| Teach reading code first, then writing | A 37-person experiment: the difference in gains between groups was not significant, and pretests were already unequal | No measured difference |
| How tracing relates to writing code | One final exam, 38 students: loop tracing and code writing correlated at r = .63 | Correlation, not causation |
| Use Parsons problems (reordering lines of code) instead of writing practice | A five-school study: no difference on the posttest and none in practice time. Earlier single-school studies: faster, with similar learning | No measured difference in learning; studies disagree on whether it saves time |
| Add distractors (wrong lines mixed in) to Parsons problems | Another study in the same report: no difference in posttest score, fewer syntax errors, small effect | Weak |
| Does public code run as published | GitHub notebooks: 24% ran without error, 4% gave the same results; Python gists 24%; Stack Overflow Python snippets 26% | Descriptive data; effect on learning not measured |
| Do code names mentioned in documentation go out of date | A tool flagged at least one case in 29% of popular projects | Descriptive; the tool's accuracy was not reported |

"No measured difference" does not mean "no effect." Most of these studies used significance tests with small samples, and the review's own authors say that null results under that framework support no conclusion.

## What research exists on programming worked examples

Kasia Muldner, Jay Jennings, and Veronica Chiarelli's [2022 review](https://doi.org/10.1145/3560266) looks at only two kinds of example: "tracing examples," which show step by step how a program runs, and "code-generation examples," which present a written program. Their reason is that only these two have enough studies. Adding up their Table 1, I get about 87 included studies (the paper gives no total). It is a narrative review, with no pooled effect sizes and no quality ratings of the studies.

By the authors' synthesis, two practices were positive and consistent:

- **Subgoal labels**: split the program in an example into a few steps and label each with its purpose. The authors say this has multiple studies and has been replicated.
- **Completion examples**: give a partly written program and have the learner complete it. The authors report three papers from Jeroen van Merriënboer's team (1990, 1992, 2002) and one by Chang and colleagues, all in the same direction. In the 1990 study, the completion group spent more time per session; the 1992 study equalized time and the benefit remained; the Chang paper reported no inferential statistics.

No difference was measured for: instructor-modeled live examples versus static ones, narration by voice versus text, analogy-based examples, generic self-explanation prompts (only one study found), and individual features inside program visualization tools (animated versus static, adaptive versus fixed). That last item needs care. The authors say **the visualization tools themselves** beat traditional activities in most studies; what showed no difference were the features inside the tools, and those studies had only 14 to 22 participants.

On "annotate the example line by line," the review gives no clean answer. Only one study compared it directly: with annotations, middle-school students wrote more correct programs, but only when the example was similar to the problem, the type of annotation made no difference, and it measured performance on the task at hand. Another, single-group study found that students who looked at annotated examples more had **lower** grades.

One caution about reading this review: its abstract lists Parsons problems and visualization tools as areas with "established" work. That refers to the amount of research, not to the effect. The body concludes that Parsons problems save time and offer no learning advantage.

## Naming the steps: subgoal labels

A subgoal label is a short line placed before a group of lines of code. It says what the step is for, not what the line does. The example in Lauren Margulieux and colleagues' paper is a problem about which branch an if statement takes, split into three labels: which statements go together, whether the if condition is true or false, and if true follow the true branch, if false do nothing or follow the else branch. Under each label comes the actual work for that step, and the answer at the end.

The labels were not headings the authors made up. They were found with an interview method called TAPS: an instructor who had taught intro programming for 24 years solved problems aloud, and an analyst kept asking about steps the instructor did so automatically that they could no longer explain them, until the analyst could solve a new problem using only the listed steps.

### Results in a real course

Margulieux, Briana Morrison, and Adrienne Decker's [2020 classroom study](https://doi.org/10.1186/s40594-020-00222-7) ran in a Java intro course at one US university. Two of five sections used labeled examples and three used the same examples without labels; the final analysis had 120 vs 145 students. Students chose their own sections, so assignment was not random. Labels appeared only the first time each new problem type came up, five of the fifteen weeks, and the examples were demonstrated by the instructor in class in a flipped course.

- On quizzes within a week of learning a new problem type, the two labeled sections averaged 48% and the control group 41%, an effect size of d = 0.44. The quizzes were online, each worth 0.44% of the course grade.
- On the average of the four exams in the term, 75% vs 72%, the difference was not significant. Total exam score, counting a missed exam as zero, was significant, because the labeled group missed fewer exams.
- Among students who took two exams or fewer, about 10% were in the labeled group and about 20% in the control group (I added these from the counts in the paper; it gives no combined figure and no test). From this the authors say labeled students were about half as likely to withdraw or fail, while noting that this was inferred from exam data, not from university withdrawal records.

The authors' reading is that students without labels catch up over time, but the process may be harder, and those who cannot keep going leave. That is speculation; the paper did not measure time or frustration. The authors also drew the scope themselves: labels are probably not useful for people who already know the procedure, or whose study habits already work. They listed two limitations: no random assignment, and the instructor of the two labeled sections was a member of the research team.

### Results in the lab: it depends on how far the practice is from the example

The same team ran three lab experiments, all teaching `while` loops in pseudocode, with three example formats: no labels, labels provided, or blanks where students write their own labels. Each example was followed by a practice problem of one of two kinds: same context with different numbers, or a different context solved in the same format. Morrison, Margulieux, and Decker's [2020 paper](https://doi.org/10.1080/08993408.2019.1707544) pooled the data from the three experiments, 220 people, and reanalyzed it.

Format and practice distance interacted:

- With labels provided, the group whose practice changed context scored highest (a pattern read from the figure and the post hoc comparisons; the pair "labels provided, changed context vs only changed numbers" was not tested directly in the pooled analysis). When practice only changed the numbers, provided labels and no labels came out almost the same (d = .10), and the labeled group spent about 20 more minutes.
- When students wrote their own labels, it was the reverse: the group whose practice only changed numbers scored higher.

Only two of the six pairwise comparisons were significant, so "these two groups are best" is the authors' grouping by pattern. The authors say that pairing provided labels with different-context practice runs against what cognitive load theory predicts, and they do not explain it. In the same data, a five-question tracing posttest, one Parsons problem, and self-reported cognitive load showed no group differences at all.

The pooled analysis is not an independent replication, because the data include experiments that had already been published. The study explicitly designed as a replication with data from another school is Morrison, Decker, and Margulieux's [2016 replication](https://doi.org/10.1145/2960310.2960330). The key comparison there (labels provided, changed context vs only changed numbers) went in the same direction, but with only 10 people it was not significant.

### Several steps removed from an article

Of these conditions, "labels provided" is closest to an author marking the purpose of each step for readers. One usable reminder I take from it: if you give labels, the practice that follows should change the context, not only the numbers. That is my inference.

Getting from these studies to an article crosses three gaps. The labels in the studies came from expert interviews; they were used in examples an instructor demonstrated in class or in lab materials, not in articles readers read on their own; and the outcomes were tests on the spot or within a week. No study has tested whether labels written as code comments or subheadings help in a web teaching article.

## Live coding versus explaining prepared code

Anshul Shah and colleagues' [2023 study](https://doi.org/10.1145/3568813.3600122) compared two sections of a Python intro course at UC San Diego taught by the same instructor, with 115 vs 110 consenting students who chose their own sections.

- Live-coding section: the instructor typed in an editor on the spot, talking through the thinking, adding code in small steps, using print to inspect variables, and sometimes running into errors on purpose to demonstrate debugging.
- Prepared-code section: the instructor showed slides of finished code and annotated them by hand, drawing memory diagrams and listing the values for each pass of a loop.

So the comparison group did not just have code read aloud to them. Both sections had the instructor's explanation; what differed was whether the code grew in front of them or arrived all at once.

There was no measured difference in assignments, worksheets, midterm, final, or course grade; the effect size for course grade was only 0.018. Measures of the programming process (whether students wrote in small increments, whether the same error recurred) also showed no difference. The live section had a higher share correct on a debugging problem, but not significantly. The authors' conclusion: live coding neither improved students' programming process nor hurt their grades.

The difference showed up in how students felt. In midterm open-ended responses, about 18% of the live section's answers asked the instructor to slow down, against 2% in the other section. On the anonymous end-of-term course evaluation, most students in both sections agreed that "lectures hold your attention," with agreement about 9 percentage points lower in the live section (I added up the response shares from the figure). The authors suggest the instructor was typing and talking at once, so students did not know whether to copy the code or the explanation, and they had no hand-drawn memory diagrams to copy. The authors also note that students said they "saw" the process of writing and debugging, but this did not turn into a measurable difference in behavior.

Muldner's review reports two other comparisons. Rubin's 2013 classroom study (146 people) found no difference on exams or course grades, with the live group doing better on the final project. Raj and colleagues' 2020 study found no difference; numerically, the static group gained more and the live group gained almost nothing, but not significantly, and the review's authors say the standard deviation of gains was large and power may have been lacking. I have not read either original.

All of these compare classroom lectures. The matching question for an article is whether to grow the code piece by piece with an explanation after each piece, or to give the complete program and then explain it section by section. No study has tested that directly.

## Tracing: letting readers see what the program does step by step

Tracing means stepping through a program line by line, recording each variable's value at each step, and finally saying what the program prints.

### A small experiment that taught a tracing strategy

Benjamin Xie, Greg Nelson, and Amy Ko's [2018 experiment](https://doi.org/10.1145/3159450.3159527) taught a set of tracing steps: read the problem, find the line where execution starts, then go line by line following the language's rules. For each function call, open a two-column "name / value" table on paper; when a variable changes, cross out the old value and write the new one; when the function ends, cross out the whole table. Teaching it took about 5 minutes, and the researcher walked through it again on the first problem.

Twenty-four students in a Java intro course were split into two groups, with the control group using their own methods. On six on-the-spot "what does this program print" problems, the strategy group averaged 30.0 and the control group 24.6 (out of 36), with a one-tailed test that just passed the significance threshold. Looking at the six problems one by one, only one was significant: the one with nested if/else that required keeping track of several variables. On the midterm a few days later, the strategy group averaged higher but not significantly; those grades were self-reported, and both groups got tutoring from the researchers at the end of the study.

The qualitative observations may be more useful than the scores. The six highest scorers in the control group already traced line by line and wrote intermediate values down, though not every time; none of the low scorers in the strategy group gave up partway. The strategy spells out what skilled people already do, but it cannot fill gaps in knowledge of the language: the errors of low scorers in both groups reflected incomplete knowledge of semantics. The authors themselves say replication is needed.

Note that the participants drew the tables **themselves**. Using this to support "attach a variable table the author has drawn" is extrapolation. [The article on diagrams](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en) recommends state tables for step-by-step execution of algorithms, based on a different body of evidence.

### Who benefits from seeing execution written out

Muldner's review reports experiments by Richard Mayer from 1975 and by Bayman and Mayer from 1988 (BASIC-era research; I have not read the originals). As the review reports them, examples that write out execution step by step, with or without a diagram of how the machine works, helped learners with low prior knowledge on tracing questions; learners with high prior knowledge showed no difference. On code-writing questions the direction differed: in one of Mayer's experiments, text-only examples did better, and in Bayman and Mayer's, high-prior-knowledge learners did better with brief examples. The review's wording is that the benefit "may exist only for" low-prior-knowledge students, and that the best format still needs research.

### Reading first, then writing

Nelson, Xie, and Ko's [2017 study](https://doi.org/10.1145/3105726.3106178) built a web system that teaches only reading code (PLTutor): learners do not write code, they step through JavaScript execution and fill in hidden values. Thirty-seven students just starting CS1 spent 4.33 hours in a one-day workshop with either this system or Codecademy.

The abstract says the PLTutor group's gains were 60% higher, but the difference was not significant. The groups' pretests were already unequal, with PLTutor starting lower, and posttests were nearly identical; the later midterm averages showed no difference either. So what this study supports is "no measured difference," and the "reading first" part was only those four-plus hours, after which both groups took the same writing-centered course.

### How tracing relates to writing code

Mike Lopez and colleagues' [2008 study](https://doi.org/10.1145/1404520.1404531) analyzed a final exam in a Java intro course, where 38 of 78 test-takers consented. Loop tracing questions correlated with code-writing questions at r = .63; simple tracing questions without loops correlated at only .30, which the authors judged not significant. The authors drew a path diagram as a hierarchy of skills from low to high, while stating that the arrows do not indicate causation, and they offered another explanation: the writing questions tested calling methods and the tracing questions tested loops, so the content did not overlap, and the correlation may reflect general reasoning ability. The study has a single point in time and did not measure whether teaching tracing first improves writing.

## Parsons problems and completion problems

A Parsons problem scrambles the lines of a correct program and asks the learner to put them back in order; distractors are wrong lines mixed in that should not be used. The appeal is that the reader does not have to start from a blank page.

### Earlier studies: faster, with similar learning

According to Muldner's review, earlier comparisons (Ericson 2017 and 2018, and Zhi 2019) agreed: the Parsons group finished faster than the code-writing group, with no posttest difference. Learning benefits showed up only when something was added. One study added self-explanation prompts to Parsons problems, and that group gained more. Two studies left blanks in Parsons problems for students to fill in: one did better only on programs similar to earlier ones, and the other scored slightly higher only on one complex exam question (the authors' word was "marginally"). The review's authors speculate that reordering alone may be too subtle and that extra scaffolding is needed. I have not read any of these originals.

### A multi-school study: not even time was saved

Barbara Ericson and colleagues' [2023 working group report](https://doi.org/10.1145/3623762.3633498) ran several studies with the same procedure but different materials at several schools. One used basic Python material and compared "practice by solving adaptive Parsons problems with distractors" with "practice by writing equivalent code." The paper says 369 students across five schools, but the five schools' counts add up to 376, and the self-efficacy subgroups add up to 401.

- On the posttest right after practice in the same session, both groups averaged just over a quarter of full marks (107/400 vs 111/400), with no difference.
- Practice time did not differ either; numerically the Parsons group took slightly longer. In the discussion the authors acknowledge this is "notably different" from earlier research and say more work is needed.
- In both groups, only about half the students attempted any posttest question.

Another study used material on Python classes and compared Parsons problems with and without distractors (both groups did Parsons problems). Posttest scores did not differ; the distractor group made fewer syntax errors when writing code on the posttest, with small effect sizes (Cliff's δ = −0.18 and −0.28), and the paper does not explain how syntax errors were counted.

The report's abstract does not mention these null results; it says the studies "provide evidence" for Parsons problems and distractors. If you want to cite it as evidence, cite the results and discussion sections, not the abstract.

One detail from the report's think-aloud sessions is worth knowing for anyone who writes: among 12 adult learners in an online Spanish-language JavaScript course in Chile (aged 24 to 55, without a STEM background), not one noticed that the earlier Parsons problems and the later writing problems were the same problems, including those who finished everything and rated themselves highly.

### How to use them in an article

A drag-and-drop Parsons problem on a web page is an interactive component that needs code and upkeep; whether interactivity is worth it comes in a later part. The text-only alternative is to list the scrambled lines and ask readers to write down the order before expanding the answer, which nobody has tested. My judgment from the evidence above is that it works as one variation of practice; there is no basis yet for calling it a more efficient route than writing code.

## Does the posted code run

These studies have no readers; they measure the code itself.

- **Jupyter notebooks**: João Felipe Pimentel and colleagues ([2019](https://doi.org/10.1109/MSR.2019.00077)) collected about 1.16 million deduplicated notebooks from GitHub and reran 863,878 Python notebooks with an unambiguous execution order. Run in the execution order saved in each notebook, 24.11% finished without error (the denominator includes about 75,000 notebooks that never ran because their dependencies failed to install), and only 4.03% finished with the same results as their saved outputs. The most common failure was a missing package, followed by undefined variables and missing files. The authors call it surprising that notebooks that declared dependencies were more likely to fail for a missing package; the authors say declarations are often incomplete, and they acknowledge that the undeclared group ran in an environment with the full Anaconda distribution installed.
- **GitHub gists**: Eric Horton and Chris Parnin ([2018](https://doi.org/10.1109/ICSME.2018.00031)) put 10,259 single-file Python gists with at least one star into a Python 2.7 environment with no third-party packages: 24.4% ran to completion and 52.4% failed on import. Installing a package with the same name as each import still left most of them broken. The ones that remained broken went to 24 developers familiar with environment setup, who reported spending 20 minutes to 2 hours on each, and the most common reason was that the package name differed from the import name.
- **Stack Overflow**: Di Yang and colleagues ([2016](https://arxiv.org/abs/1605.04464)) took accepted answers from a 2014 data dump: 76% of Python snippets parsed and 26% ran as is. But "snippets" included single words mentioned inline, and 64% of a sample of runnable snippets were single words. Python snippets that failed to run mostly had undefined names, because a snippet is only part of a larger program. The authors themselves say a snippet that does not parse can be more useful than one that runs.
- **Names in documentation**: Wen Siang Tan and colleagues ([2023](https://doi.org/10.1007/s10664-023-10397-6)) used an automated tool on the READMEs and wikis of the 1,000 most-starred GitHub projects, and 28.9% of projects had at least one name flagged as "still mentioned in the documentation, no longer found in the source code." The tool's accuracy was not reported; of the 8 projects that responded to the issues the authors opened, 4 said they were false positives. The tool did not check the contents of code blocks.

The two kinds of failure should be kept apart. Fragment-style code (Stack Overflow) fails mainly because it depends on variables defined earlier; standalone program files (gists) fail mainly because the environment lacks packages. My inference is that teaching articles contain both: code split into pieces across the body is like the former, and a full project implementation is like the latter.

None of these four studies measured readers. **Whether code that does not run makes readers learn less has not been tested directly by any study.** All that can be said is that the share of public code that runs as published is not high, and failures mostly come from the environment and missing context, not from program logic.

## This site's example: old project code in the CS50 AI guides

In the 2026-10-13 review round, the reviewer downloaded the official distribution code and compared the code in each week's article against it; for some weeks the reviewer also plugged the code in and ran it. The problems the reports record in the old versions were confirmed in very different ways from week to week:

| Week | Problem in the old version | How the reviewer confirmed it |
|---|---|---|
| [Week 0](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) | The posted `Node` had an extra field, `QueueFrontier` did not inherit, an import was missing; with the official `util.py` it throws `TypeError` | Compared with the official source; in a later round broke it on purpose and reproduced the same error message |
| [Week 1](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en) | Knights Puzzle 3 inferred nobody's identity; Minesweeper's `add_knowledge` never terminated | Ran the old version against the official files |
| Week 2 | Heredity's heading said sampling, which does not match the official approach; the reviewer judged the old iterative PageRank code correct | Read the git diff; ran the iterative version, output matched the spec page |
| Week 3 | The old Crossword used an interface that is not the official one | Checked the previous git version; no run recorded |
| Week 4 | The old draft had Nim's win/lose rule backwards | Only one line saying it was fixed |
| Week 5 | Nothing recorded | — |
| [Week 6](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en) | Parser had a class and an algorithm not in the official files; Questions had a dead download URL and a run command with an extra argument the official code does not accept | Checked against the official files; requested the URL |

What was broken was this site's old reference implementations and project descriptions; the official distribution code was not broken. The official materials have problems of their own, of a different kind. For example, the official `requirements.txt` for week 6 does not pin versions, and installing from it on the day of the review failed at import.

I sorted the series' 25 "must fix" items into categories while compiling them (the reports themselves did not categorize them). Five were code or commands that break when followed, or descriptions that do not match the official files. Six were run results that could not be reproduced, or a single run written up as a fixed result. One example of the latter: a result an article reported appeared only once in 7 runs by the reviewer.

These review reports have no reader data either. "Readers learned the wrong thing from the old code" is an inference the reports never measured.

## This site's writing specs, clause by clause

Two specs on this site govern code: the "hands-on teaching" clause of the shared course guide spec, `course-guide-contract.md`, and the spec for this round's rewrite of the CS50 AI project sections (kept in the working directory, not under version control). The table below goes clause by clause, using the versions in the working directory on 2026-10-14; the clauses about text are covered in [the article on questions and feedback](/posts/learning/2026-10-13-teaching-text-questions-feedback-en).

| Spec | This site's reason | What the research can say |
|---|---|---|
| Outside the folded block, project sections contain no implementation that could be submitted as is; they give the approach and pseudocode instead | The course's [academic honesty policy](https://cs50.harvard.edu/ai/honesty/) forbids looking at others' solutions before submitting and allows discussing with pseudocode | This is an integrity choice. No study has tested "approach and pseudocode first, full code folded." The closest are completion examples and Parsons problems; the former had positive results, the latter showed no measured learning difference |
| Pseudocode must not be detailed enough to translate line by line into Python | In the project-section review, five of seven weeks were flagged for pseudocode that amounted to a line-by-line translation; the week 0 review, for example, said that one could "type it out as Python without having to think about anything" (my translation) | This site's judgment. A neighboring result: when practice repeats the example's steps exactly, provided labels did no better than none, and the authors guessed that students did not explain to themselves. Extending that to how fine-grained pseudocode is, is my inference |
| "Common mistakes" describe the symptom, the cause, and how to notice it, without posting fixed code | Errors found by actually running the code are the most valuable part of the section | This site's choice. Research on erroneous examples is mixed, and no study has tested this format |
| "How to check": example input and output from the spec, small cases worked by hand, and run results stating which run and how many runs | By my categorization, 6 of the must-fix items were run results that could not be reproduced or a single run written up as fixed | This site's own review record supports it; there is no direct research evidence |
| Code posted in an article must have been run against the official files | The review's method; most problems in the old versions were caught this way | About a quarter of public code runs as published; from this I infer "if you do not run it, you do not know." No research on the effect on learning |
| Hands-on teaching must state the required environment, runnable steps, expected results, and how to diagnose errors | A teaching function in the shared spec | Gist and notebook failures mostly come from environments and packages, which supports stating the environment; whether stating it raises the success rate has not been tested |

## Where the sources differ

The results below point in different directions, or look contradictory but measure different things. I set them side by side without choosing.

**Do Parsons problems save time?** The three single-school studies Muldner reports all found the Parsons group faster. In Ericson and colleagues' five-school study, practice time did not differ, and on the first posttest question the Parsons-practice group was significantly slower. Ericson and colleagues' own abstract still says Parsons problems are "typically easier and faster to solve than writing code from scratch, but with equivalent learning gains"; that summarizes earlier literature, not their new data.

**Provided labels or self-written labels?** Morrison and colleagues' 2020 pooled analysis: which is better depends on how far the practice is from the example, and without feedback the two do not differ overall. The same team's 2016 analysis of second-year students: provided labels gave the best code writing, and when those students wrote their own labels, they did worse than the other two groups on the Parsons problem, which the authors guess is expertise reversal (help that benefits novices hurts more experienced learners). Muldner reports Margulieux and Catrambone's experiment: guided self-written labels were best, but only when either hints or feedback was given, not both.

**Do provided labels help on Parsons problems?** An earlier paper from the same team said the provided-labels group did better on Parsons problems. The 2020 pooled analysis did not find this, and the authors state they would no longer draw that conclusion. Muldner's review still lists the earlier paper as a significant result.

**Does asking readers to predict first help?** [The article on diagrams](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en) cites Hundhausen and colleagues' 2002 meta-study: among algorithm visualization experiments, the broad category in which students act (designing their own input, predicting the next step, writing code) more often showed significant differences. But for experiments that manipulated "predict first" on its own, that article found one paper by Jarc and colleagues (no significant posttest difference for the prediction group) and two experiments in one paper by Byrne and colleagues (significant, but the authors say the effects of prediction and animation could not be separated). The two experiments by Banerjee and colleagues that Muldner reports (78 and 231 people) are two more data points that manipulated prediction alone: the group that predicted output first showed no posttest difference in either, only higher engagement observed in class. Taken together, the experiments I have read that manipulated "predict first" on its own come to three papers and five experiments: three with no posttest difference, and two, from the same paper, confounded with animation. The two articles do not actually contradict each other; they differ in the scope of "acting." Hundhausen's broad category includes designing input and writing code, while the levels of interaction Muldner compiles compare only watching, predicting, and stepping through it yourself. Muldner's overall view is that several studies showed no significant difference between "just watching" and more active conditions. All of these are secondhand or compiled, and the studies differ in era, tools, and tests.

**Annotated examples.** Muldner's synthesis says "example annotations and subgoals significantly improved learning." In its own body, annotations rest on one study, where the effect appeared only when the example resembled the problem, annotation type made no difference, and the measure was performance on the task at hand; another, single-group study found that the more students looked at annotated examples, the lower their grades.

**Where a diagram of execution helps.** Muldner's synthesis says model-based tracing examples "improves learning"; its figure limits this to tracing questions. On code-writing questions, one of Mayer's experiments favored text-only examples, and in Bayman and Mayer's, high-prior-knowledge learners did better with brief examples.

**How long outdated names in documentation stay.** Tan and colleagues write in their introduction that "These references were typically outdated for years before they were noticed and fixed by project maintainers," and the conclusion says the same. The only source for "years" in the paper is that references **not yet fixed** had been outdated for 4.7 years on average. Of those **already fixed**, about half were still unfixed a month after going out of date. The first is a stock; the second is how long the fixed ones survived.

**Why snippets do not run.** Horton and Parnin say Yang and colleagues did not investigate the reasons; Yang and colleagues in fact report error-message statistics. The two studies' main causes differ (import failures versus undefined names) because one studied standalone program files and the other fragments in answers, so they cannot be merged into a single cause.

## Three things to do tonight

Pick a teaching article you have written that contains code:

1. **Set up a clean environment and run every piece of code in the article's order.** Install only the packages the article names. Wherever something does not run, either add the earlier piece it depends on, or state in the text which piece it follows and which file and version it depends on. If a result involves randomness, say how many runs it came from. The basis is the descriptive data above and this site's review records, not learning research.
2. **Split the main piece of code into three to five steps and put a comment before each saying what the step is for.** Not what the line does. Follow it with a practice problem in a different context, not only with different numbers. The basis is the subgoal research, but those studies used examples in classrooms and labs; writing the labels as comments is my extrapolation.
3. **After a piece of code with a loop, ask "what does this program print," attach a blank variable table for readers to fill in, and fold the answer.** The basis is Xie and colleagues' tracing strategy, where the point is that readers fill in the table line by line themselves; whether reading a table the author drew works as well has not been tested. The opening "don't run it yet, guess what it prints" is itself a predict-first question, and the experiments that tested "predict the output first" on its own mostly found no difference (see "Where the sources differ").

Here is what items 2 and 3 look like together, using a breadth-first search. The code and question are my own, run once on Python 3.15.0, and untested for their effect on learning:

```python
graph = {"A": ["B"], "B": ["C", "D"], "C": ["E"], "D": ["F"], "E": [], "F": []}
start, goal = "A", "E"

# Step 1: set up two lists, nodes still to check and nodes already checked
frontier = [start]
explored = set()

while frontier:
    # Step 2: choose the next node to check and see whether we have reached the goal
    node = frontier.pop(0)
    print("took", node, "| frontier left", frontier)
    if node == goal:
        break
    # Step 3: queue every node this one leads to that has not been queued yet, at the back
    explored.add(node)
    for neighbor in graph[node]:
        if neighbor not in explored and neighbor not in frontier:
            frontier.append(neighbor)
```

Don't run it yet. How many lines does it print? What is the fourth line? Fill in this table as you read:

| Round | `node` taken | `frontier` after adding neighbors | `explored` |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

<details>
<summary>Answer</summary>

It prints five lines; the fourth is `took D | frontier left ['E']`.

| Round | `node` taken | `frontier` after adding neighbors | `explored` |
|---|---|---|---|
| 1 | A | `['B']` | A |
| 2 | B | `['C', 'D']` | A, B |
| 3 | C | `['D', 'E']` | A, B, C |
| 4 | D | `['E', 'F']` | A, B, C, D |
| 5 | E (the goal, stop) | `['F']` when printed | unchanged |

Practice in a new context: keep the same three steps, but find the fewest degrees of friendship between two people in a friendship graph. What extra do you need to record?

Criterion: when a node is queued, record how many levels it is from the start (one more than the level of the node it was queued from); when the goal is taken, its level is the answer. Alternatively, record which node each node was queued from, and count back from the goal once you reach it. Recording only "visited or not" cannot give you the number of levels.

</details>

## Limits of this evidence

- **No study looked at people reading web teaching articles.** The learning studies used college students in classrooms and labs, mostly in intro programming courses; the studies of whether code runs had no readers. Carrying the results over to a long guide is my inference.
- **Small samples, mostly significance tests.** The tracing-strategy experiment had 24 people, the reading-first experiment 37, the correlational study 38, and the key comparison in the independent subgoal replication only 10. Muldner and colleagues themselves say null results under this framework support no conclusion and recommend reporting Bayes factors; in the whole review, only one study had Bayesian evidence supporting the null.
- **Most subgoal studies come from one team.** The pooled analysis includes already published experiments, so it is not an independent replication. The classroom study did not randomize, and the labeled sections were taught by a member of the research team.
- **Most tests were on the spot or within a week.** Morrison and colleagues' experiments and Ericson and colleagues' studies tested in the same session, with no delayed test.
- **Statistics in several papers do not add up.** Recomputing Morrison and colleagues' 2020 p values from the printed F values and degrees of freedom does not reproduce them, so the body cites only effect sizes. Margulieux and colleagues' t values do not match their degrees of freedom, so the body cites only means, standard deviations, and d. Ericson and colleagues give three inconsistent counts for one study. Shah and colleagues report p < 0.001 for the two course-evaluation items; recovering counts from the response shares in the figure and rerunning a trend test during extraction gave about .06 and .04. The paper gives no test statistic or scoring method, and I am not sure how the authors computed it, so the body cites only the shares from the figure.
- **Many results are secondhand.** The studies by Rubin, Raj, Mayer, Bayman and Mayer, van Merriënboer's team, Chang, Banerjee, Fabic, Weinman, Hosseini, Ichinco, Margulieux and Catrambone, Zhi, Kumar, Al-Barakati and Al-Aama, and Ericson 2017 and 2018 were all read through Muldner's review or Morrison and colleagues' papers; I have not read the originals.
- **The descriptive studies date.** The Stack Overflow data are from 2014, the gist runs were mostly on Python 2.7, and the notebook collection runs to 2018. These rates cannot describe code today.
- **Read only as abstracts, not listed in the references**: Scherer et al. (2020), the meta-analysis of programming instruction, and Selvaraj et al. (2021), the review of live coding. Harrington and Cheng (2018) propose that "in advanced courses, the order of tracing and writing reverses"; I could not get the full text.
- **Not found**: the effect of code that does not run on learning; subgoals written as comments or subheadings in an article; building up code step by step versus giving it all at once in an article; reading a tracing table the author drew; whether typing out code by hand helps (I have only one short correlational paper, which cannot support a conclusion).
- **My inferences**: that labels should be followed by practice in a different context; extending subgoal research to code comments; that text-only Parsons problems work as one variation of practice; that code in teaching articles splits into fragments and standalone files; extending a neighboring result to how fine-grained pseudocode is; using descriptive data to support "if you do not run it, you do not know" and "state the environment"; and the three things to do tonight. Each is marked in the text.

## Appendix: study designs and numbers

The body keeps one or two numbers per item; the rest are here.

**Muldner, Jennings, Chiarelli (2022)**, ACM Transactions on Computing Education 23(1). Narrative review with a two-stage search (six conferences and journals searched separately, then five databases limited to 2000 onward), plus snowballing. Included counts in Table 1 sum to 87 (my sum); Appendix A lists 86 unique citations. Inclusion: human participants, evaluation of example activities related to learning programming; survey studies relying only on self-reported learning were excluded. Items reported in the body: Rubin (N = 146), exams, assignments, and course grade not significant, live group better on the final project; Raj et al., static group descriptively better, not significant; Kumar (N = 730), self-explanation prompts added in a tutoring system, gains not significant, used voluntarily outside class without supervision or grading; Ichinco et al. (middle-school students, N = 80), annotations helped only when example and problem were similar; Hosseini et al. (N = 109), looking at annotated examples negatively associated with grades, single group; Banerjee et al., two experiments (N = 78, 231), prediction group not significant on the posttest; Al-Barakati and Al-Aama (N = 91), passive watching, stepping through yourself, and no tool, total scores not significant across the three groups; visualization-feature studies had 16, 22, 14, and 18 participants; of 9 tool studies found in the review, 6 showed benefits, with three caveats from the authors: mostly computer science students, unsurprising that tools win if the traditional activity did not explicitly teach tracing and sketching, and people are not compilers. Parsons problems: two by Ericson et al. (N = 135, 126), faster, posttest not significant; Zhi et al., six semesters of about 50 per semester, faster, comparable learning; Fabic et al. (N = 70), self-explanation prompts gave significantly higher normalized gain; Weinman et al. (N = 43), Parsons problems with blanks better only on programs similar to earlier ones.

**Margulieux, Morrison, Decker (2020)**, International Journal of STEM Education 7:19, published version. Fall 2018, a Java intro course at a Midwestern US university, five sections; 307 enrolled, 265 analyzed (120 subgoal, 145 control); 34% had no programming experience. Quizzes: mean 48% (SD 14%) vs 41% (SD 16%), d = 0.44, p = .001; total quiz score counting misses as zero d = 0.42; quizzes completed 3.9 vs 3.4. Only 97 people had scores on all five quizzes; the group × quiz interaction was not significant, from which the authors say the effect was the same across the term, but no quiz-by-quiz group comparison is reported. Exams: mean 75% (SD 15%) vs 72% (SD 18%), d = 0.20, p = .24; total counting misses as zero (out of 200) 140.3 vs 128.2, d = 0.26, p = .04; exams taken 3.7 vs 3.5, p = .045. Took all four exams but averaged below 70%: 30 (25%) vs 64 (44%), no test. Plain-language explanations of solutions were scored on the five SOLO levels. The paper says the subgoal group's distribution was better on three of the four questions and that the nested-loop question "did not follow the same trend as the other quizzes, and the responses were overall worse"; by my calculation from Table 5, the control group's distribution was better on that question, which the paper does not say. That question was also the only one that did not reach inter-rater reliability. The paper's t values do not match its degrees of freedom (an independent-samples t test with N = 265 has 263), so I do not cite them.

**Morrison, Margulieux, Decker (2020)**, Computer Science Education 30(2); I read the author accepted manuscript in the Georgia State University repository, whose page numbers may differ from the published version. Experiments from three universities pooled, 220 people; a 3 (no labels, labels provided, self-written) × 2 (practice changes only numbers, changes context) between-subjects design, teaching `while` loops in pseudocode, tested in the same session. Four code-writing problems out of 44, overall mean 26.58; interaction F(2, 188) = 5.23. Post hoc comparisons (two of six significant): with only numbers changed, provided vs self-written labels, self-written higher (d = .44); with context changed, no labels vs provided labels, provided higher (d = .59); with only numbers changed, provided vs no labels d = .10. Time with only numbers changed: no labels 52 minutes, provided 72, self-written 71. Time and performance correlated r = 0.43 overall, with within-group correlations varying in strength; from this the authors say the benefit is not just more time on task, but they did not control for time as a covariate. No effects on the Parsons problem, the five-question tracing posttest, or cognitive load; the authors decided after the fact that the tracing posttest measured nothing useful and excluded it from their conclusions. Recomputing from the printed F and degrees of freedom during extraction gives about .006 for the interaction (printed .028), with other mismatches too; distance has only two levels, yet the paper prints F(2, 188) throughout.

**Morrison, Decker, Margulieux (2016)**, ICER '16, published layout (NSF PAR). 100 people at a Northeastern US university across three courses; intro students had already studied loops for about two weeks. The replication analysis included only the 27 who got 2 or fewer pretest questions right: interaction F(2, 21) = 5.19, p = .015; with labels provided, only numbers changed M = 18.4, context changed M = 31.2, t(8) = −1.50, p = .17, d = 0.95. Second-year course, about 49 people (inferred from the F degrees of freedom; the paper gives no count): provided labels gave better code writing, interaction not significant; the self-written-labels group did worse on the Parsons problem. A separate analysis compared students who had or had not taken a computing course in high school (cross-sectional, not following the same people): in the intro course, those who had scored higher on code writing; in the second-year course, the two were similar; on the Parsons problem, those who had taken one were still better in the second-year course.

**Shah et al. (2023)**, ICER '23, published version, CC BY. UC San Diego CS1, fall 2022, two sections with the same instructor, two 80-minute lectures a week; the authors say code examples took about half of lecture time; the last two weeks were canceled because of a TA strike. Grades (live vs static, out of 100): assignments 93.4 vs 93.5, worksheets 89.7 vs 88.7, midterm 82.5 vs 81.6, final 78.8 vs 79.4, course grade 89.1 vs 88.9, effect sizes −0.031 to 0.069. Final coding challenge correct 64.6% vs 57.3% (p = 0.284); debugging challenge correct 25.9% vs 14.1% (p = 0.063, 81 vs 78 attempting); compilations until correct on the debugging problem p = 0.046 before correction, not significant after Holm-Bonferroni. Open-ended "slow down" 18.09% vs 2.06% (94 and 97 responses), no inferential test. Course evaluation (my sums from the figure's shares): agree or strongly agree on attention 78.3% vs 87.6%, on note-taking 59.3% vs 74.8%. Limitations listed by the authors: no random assignment, possible selection bias in evaluations, many learning activities outside lecture, a single CS1 course, and only one form evaluated (the instructor coding live in class).

**Xie, Nelson, Ko (2018)**, SIGCSE '18. The file ACM currently serves is identical to the one on the author's page, with a 2021 update noted in the footer. Participants had taken 0 or 1 CS courses; only 3 were CS majors. Stratified random assignment, incomplete because of cancellations; afterward, programming self-efficacy significantly favored the control group. On-the-spot total: strategy group M = 30.00 (SD 4.91, n = 13), control M = 24.55 (SD 9.16, n = 11), one-tailed Welch t, p = 0.049, d = 0.72; only problem 4 was significant (p = 0.021), with 11 of 13 in the strategy group scoring full marks on it. Midterm (self-reported, 8 each) 91.5 vs 84.5, one-tailed p = 0.083; the authors say the midterm gap came mainly from the code-writing questions. On-the-spot total and midterm correlated r = 0.91. The abstract says the strategy took 5 to 10 minutes to teach; in the body, 5 to 10 minutes is the time spent introducing think-aloud, and teaching the strategy took about 5 minutes.

**Nelson, Xie, Ko (2017)**, ICER '17. Of 988 students, 200 responded, 90 were eligible, and 41 showed up; after the testing system lost some data, 37 were analyzed (PLTutor 18, Codecademy 19). The test was the 27-question SCS1, with about 4.3 hours between pretest and posttest. Pretest Codecademy 8.26, PLTutor 6.61; posttest 10.68 vs 10.5; gains 2.42 vs 3.89, d = .398, Wilcoxon p < .41, t test p < .24. Midterm 76.11 vs 77.28; the paper says only that it was not significant. Limitations listed by the authors: retesting may have inflated posttests, different instructors for the two groups, the PLTutor group's instructor left the room for 45 minutes, and the research prototype had usability problems.

**Lopez, Whalley, Robbins, Lister (2008)**, ICER '08; I read the author manuscript in the UTS repository. Final exam of a first-semester Java course at one institution (the paper does not name it); 78 took the exam and 38 consented (consenters averaged 62%, the class 58%). Item scores were first transformed with a Rasch model, then the general ability represented by one essay question was partialled out, so the correlations are between processed variables. Loop tracing and writing r = .63, p < .0001; non-loop tracing and writing r = .30, p = .03, judged not significant by the authors (an earlier paragraph uses a .01 threshold); explaining code and writing r = .56. Loop tracing and explaining together accounted for 46% of the variance in writing. The exam's Parsons problem averaged 83%, and the authors say it may have been too easy.

**Ericson et al. (2023)**, ITiCSE Working Group Reports, published version, 51 pages. Parsons versus code writing (p3pt): 168, 39, 10, 7, and 152 students at five schools; the paper says 369 in total (the sum is 376), and the subgroups by self-efficacy and by prior knowledge each add up to 401. Posttest 107/400 vs 111/400, Mann-Whitney U = 20648.0, p = 0.60, with no standard deviations or effect sizes. Practice time 1783 vs 1600 seconds, p = 0.58. On the first posttest question the Parsons-practice group was slower (566 vs 292 seconds, p = 0.017). Attempts before a correct answer: not significant overall; the low-self-efficacy subgroup's Parsons group took significantly more. Distractors versus none (class-exp): 361 people at five schools; posttest 67% vs 62% on the five-question version (p = 0.56), 76% vs 69% on the four-question version (p = 0.45); posttest syntax errors 18 vs 23 (p = 0.03, δ = −0.18) and 13 vs 19 (p = 0.003, δ = −0.28). In low-self-efficacy and low-prior-knowledge subgroups, practicing with distractors went with more students finishing the posttest; these subgroups were split after the fact, with no correction for multiple comparisons. A separate single-group study (swapping two variables): more than 80% could write the swap after three Parsons problems, with no control group and no reported count. Four studies were designed but have no reported results.

**Pimentel, Murta, Braganholo, Freire (2019)**, MSR 2019; I read the author manuscript on the author's personal page. Repositories created on GitHub between 2013-01 and 2018-04, 1,159,166 notebooks after deduplication, 93% of them Python. 863,878 rerun: a conda environment for each, declared dependencies installed, the full Anaconda distribution for undeclared ones, running only cells that had been executed, in the saved execution-count order, with a 5-minute limit each. 75,059 never ran because dependencies failed to install, and still count in the denominator. Finished without error: 208,323 (24.11%), of which 173,487 gave different results, leaving 4.03%; the paper does not say how "same results" was compared. Failure causes: missing package 29.23%, undefined variable 14.53% (which the authors say may be caused by running in execution-count order), missing file 12.59%. Missing-package rate with declared dependencies 45.18%, without 31.24%. 30.93% of notebooks had no explanatory text at all. The authors propose eight practices (pin package versions, use relative paths, rerun from the top before committing, and so on) but did not test whether following them raises the success rate.

**Horton and Parnin (2018)**, ICSME 2018; I read the arXiv preprint. 10,259 gists with at least one star and a single file, 92 lines on average. Under Python 2.7.13, 2,501 (24.4%) succeeded, 5,379 (52.4%) failed on import, and syntax, name, and other parse failures totaled 17.1%; under Python 3.6.5 only 1,445 succeeded, mainly because of 3,907 syntax errors (Python 2 syntax). After installing packages named after the imports, 2,488 of the 5,379 import failures no longer failed on import, and 1,294 actually ran to completion. 24 developers received 240 gists that remained broken and returned 218; for 78 of these, even they could not produce a working setup; among the 194 with a reported reason, 70 had a package name different from the import name. The authors say the runnable share may be overestimated: a gist that only defines functions without calling them counts as a success once the definitions load.

**Yang, Hussain, Lopes (2016)**, MSR '16; I read the arXiv preprint. The aim was to assess whether snippets could feed automatic code generation tools, not teaching quality. Only accepted answers; each `<code>` tag counts as one snippet. Parsable: Java 3.89%, C# 16.00%, JavaScript 65.88%, Python 76.22%; Java and C# were only compiled (1.00%, 0.12%), and only JavaScript and Python were actually run (20.00%, 25.61%). In a sample of 50 runnable Python snippets, 16% answered the question and 64% were single words; after removing single words, 21 answered the question (the paper says 44%, the count gives 42%); after also removing single lines, 66%. "Name not defined" made up about 83% of Python runtime errors (read from a pie chart).

**Tan, Wagner, Treude (2023)**, Empirical Software Engineering 29 (published online in 2023), published version, CC BY, from the Monash repository. "Outdated" means a name that was in the source when the documentation was last updated, is not found now, and is still in the documentation, matched as an exact string; only READMEs and wikis were scanned, and triple-backtick code blocks were not extracted. Of the 1,000 most-starred projects, 991 completed analysis: 28.9% (265/918, a denominator that excludes projects with no matchable names) had at least one flagged reference, 3.9% counted by reference; for the 2,277 projects in Google's organization, 5.4% and 2.7%. References still outdated had been outdated for 4.7 years on average (only the mean is given); of references fixed in the history, 55% were still unfixed a month later. About half of fixes came from the source code reappearing, and the authors say part of that came from mass deleting and restoring source files. The paper does not report how many of the 50 manually labeled names were true positives.

**This site's review records** (2026-10-13 to 14, eight reports in `.work/reviews/`; not external research, not listed in the references). Each of the seven weekly guides went through four or more rounds, with confirmation rounds for some weeks; the four cross-week articles went through three. 25 must-fix items, categorized during extraction (the reports themselves did not categorize them): writing what the source did not say as the speaker's words 7, run results not reproducible or a single run written up as fixed 6, code or commands that break or do not match the official files 5, and the remaining 7 spread across five categories. The "once in 7 runs" in the body comes from the week 0 project-section review. In no round did anyone open a browser to look at the rendered page, and no one ran check50.

## References

Each item was read from start to finish, with an extraction record kept; the version read is noted in parentheses.

- [Muldner, Jennings & Chiarelli (2022), A Review of Worked Examples in Programming Activities](https://doi.org/10.1145/3560266) (ACM published version).
- [Margulieux, Morrison & Decker (2020), Reducing withdrawal and failure rates in introductory programming with subgoal labeled worked examples](https://doi.org/10.1186/s40594-020-00222-7) (published version, CC BY).
- [Morrison, Margulieux & Decker (2020), The curious case of loops](https://doi.org/10.1080/08993408.2019.1707544) (read: the [author accepted manuscript in the Georgia State University repository](https://hdl.handle.net/20.500.14694/10139)).
- [Morrison, Decker & Margulieux (2016), Learning Loops: A Replication Study Illuminates Impact of HS Courses](https://doi.org/10.1145/2960310.2960330) (read: the [published layout on NSF PAR](https://par.nsf.gov/servlets/purl/10301529)).
- [Ericson et al. (2023), Multi-Institutional Multi-National Studies of Parsons Problems](https://doi.org/10.1145/3623762.3633498) (ACM published version; the supplementary materials site was not read).
- [Shah et al. (2023), An Empirical Evaluation of Live Coding in CS1](https://doi.org/10.1145/3568813.3600122) (ACM published version, CC BY; the link to the coding challenge prompts was not opened).
- [Xie, Nelson & Ko (2018), An Explicit Strategy to Scaffold Novice Program Tracing](https://doi.org/10.1145/3159450.3159527) (the file ACM currently serves, identical to the [file on the author's page](https://faculty.washington.edu/ajko/papers/Xie2018TracingStrategies.pdf), with a 2021 update noted in the footer).
- [Nelson, Xie & Ko (2017), Comprehension First: Evaluating a Novel Pedagogy and Tutoring System for Program Tracing in CS1](https://doi.org/10.1145/3105726.3106178) (the file ACM currently serves, identical to the [file on the author's page](https://faculty.washington.edu/ajko/papers/Nelson2017PLTutor.pdf)).
- [Lopez, Whalley, Robbins & Lister (2008), Relationships between reading, tracing and writing skills in introductory programming](https://doi.org/10.1145/1404520.1404531) (read: the [author manuscript in the UTS repository](https://opus.lib.uts.edu.au/bitstream/10453/10806/1/2008001530.pdf)).
- [Pimentel, Murta, Braganholo & Freire (2019), A Large-scale Study about Quality and Reproducibility of Jupyter Notebooks](https://doi.org/10.1109/MSR.2019.00077) (read: the [author manuscript on the author's personal page](https://leomurta.github.io/papers/pimentel2019a.pdf); the Zenodo data were not downloaded).
- [Horton & Parnin (2018), Gistable: Evaluating the Executability of Python Code Snippets on GitHub](https://doi.org/10.1109/ICSME.2018.00031) (read: the [arXiv preprint](https://arxiv.org/abs/1808.04919)).
- [Yang, Hussain & Lopes (2016), From Query to Usable Code: An Analysis of Stack Overflow Code Snippets](https://doi.org/10.1145/2901739.2901767) (read: the [arXiv preprint](https://arxiv.org/abs/1605.04464)).
- [Tan, Wagner & Treude (2023), Detecting outdated code element references in software repository documentation](https://doi.org/10.1007/s10664-023-10397-6) (published version, CC BY, from the [Monash University repository](https://researchmgt.monash.edu/ws/files/571668171/559717602_oa.pdf); the Zenodo appendix was not read).
- [CS50 AI academic honesty policy](https://cs50.harvard.edu/ai/honesty/) (the basis for this site's project-section rewrite).
- Articles on this site: [Writing the Examples and Openings of a Teaching Article](/posts/learning/2026-10-13-teaching-text-evidence-en), [Writing Questions and Wording in a Teaching Article](/posts/learning/2026-10-13-teaching-text-questions-feedback-en), [When a Teaching Article Should Use a Diagram](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en), [Harvard CS50 AI Course Overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en), [Week 0](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en), [Week 1](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en), [Week 6](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en).
