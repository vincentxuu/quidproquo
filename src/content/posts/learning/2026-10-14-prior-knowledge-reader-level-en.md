---
title: "Writing a Teaching Article for Readers at Different Levels: Prior Knowledge, Expertise Reversal, Text Cohesion, and Prerequisite Notes"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, prior-knowledge, self-learning, course-guide, blog]
lang: en
description: "Research on prior knowledge and learning: whether people who know more also learn more, when prior knowledge helps, why the same instructional assistance has opposite effects for people at different levels, who benefits when text is made more cohesive, and how popular coding tutorials and writing style guides handle reader level, checked against this site's course-guide spec."
tldr: "People who know more beforehand still know more afterward (correlation .53), but the average correlation with how much they learn this time is close to zero, and individual studies range from strongly negative to strongly positive. High-assistance materials help learners with low prior knowledge (d = 0.51) and hurt those with high prior knowledge (d = −0.43); high and low are relative splits within each study. Stating prerequisites at the top is industry practice; whether readers can use it to decide if a post is for them has not been tested."
series:
  name: "Writing Articles That Teach"
  order: 12
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-prior-knowledge-reader-level)

This is part 12 of the series "Writing Articles That Teach," and the first post in its third section, "what readers bring with them." The first two sections covered what goes on the page and what to ask readers to do. Many of their conclusions carried the same caveat: it depends on the reader's level. This post first gathers those caveats, then turns to prior knowledge itself.

Caveats and related suggestions from earlier posts:

- [Part 1](/posts/learning/2026-10-13-teaching-text-evidence-en) cited a meta-analysis: high-assistance materials help learners with low prior knowledge and hurt those with high prior knowledge. The same post cited the U.S. Institute of Education Sciences practice guide, which says to use fewer worked examples as readers become more skilled. In the segmenting meta-analysis it cited, learners with high prior knowledge actually benefited more on retention tests, but that rests on only 7 comparisons, 4 of them from the same paper. The appendix of [part 2](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en) adds that the authors said variance on this variable was limited, and that transfer scores were not moderated by prior knowledge.
- In the review of text-and-picture meta-analyses cited in [part 2](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en), prior knowledge did not consistently moderate the effects. Theory predicts that good design helps novices more, but the individual meta-analyses pointed in different directions, and once pooled, no moderation was detected.
- [Part 3](/posts/learning/2026-10-14-code-in-teaching-articles-en) relayed a review's account (the review summarizes experiments from 1975 and 1988; part 3 did not read the originals): worked examples that spell out execution step by step helped learners with low prior knowledge on tracing problems, while learners with high prior knowledge showed no difference. The review's wording is that the benefit "may exist only for" low-prior-knowledge learners. Another study's authors guessed that an anomalous result in one group was a case of assistance that helps novices hurting more experienced learners.
- [Part 5](/posts/learning/2026-10-13-instructional-video-in-articles-en) used Mayer's pre-training principle to suggest that the prerequisite section of a course guide should first explain the terms that will keep coming up. This is a suggestion, not a caveat; part 5 itself labels it an extension, and Mayer's evidence was two animation experiments.
- In the online-courseware log analysis cited in [part 8](/posts/learning/2026-10-14-active-learning-evidence-en), when the outcome was the final exam, the prior-knowledge coefficient averaged two and a half times the coefficient for doing practice.

The trigger was this site's course-guide spec. It requires recording the reader's prerequisites on the scope card before writing, says a course overview must state who the reader is and what they need to know, and says prerequisites not taught earlier in the series must come with a link the reader can follow. Part 1, on the grounds that a public article cannot know who is reading, proposed a practice: write for novices by default, and put the scaffolding only novices need into skippable blocks. Behind the spec and that practice is an unanswered question. The author cannot see who is reading; the same explanation is too little for some and too much for others. What does research know about this, and what can an author actually do?

**How the sources were chosen, and their bias.** I scanned the literature first, then picked ten sources to read in full. On the research side: one meta-analysis of prior knowledge and learning (a study that pools many studies' results into a combined estimate), a commentary responding to it, a meta-analysis of the expertise reversal effect, one experiment on text cohesion, and one single-group study of pre-training. On the practice side: a paper analyzing 30 online coding tutorials, a natural experiment on course pacing, and two writing guides, from Google and MDN. I could not find a legally public full text of one review on letting readers choose their own path. The bias: English-language literature and studies with accessible full texts; plenty of data on schoolchildren, none on self-taught adults reading long web articles. Every entry in the references was read from start to finish, with an extraction record.

## The short version

| Question | Evidence | How far it goes |
|---|---|---|
| Do people who know more beforehand know more afterward? | [Meta-analysis](https://doi.org/10.1080/00461520.2021.1939700): correlation between prior knowledge and post-learning knowledge .53; in nine randomized experiments, groups taught the prior knowledge first scored higher on the posttest | Strong. The authors say this correlation measures the stability of rank order; it would be high even if nobody learned anything |
| Do people who know more learn more this time? | Same source: average correlation with normalized gain −.06, not different from zero; individual studies range from strongly negative to strongly positive | No general answer. The authors object to reading this as meaning that prior knowledge does not matter |
| When does prior knowledge help? | A [commentary](https://doi.org/10.1038/s41539-021-00103-w): only when it is activated, relevant to the task, and congruent with the new content does it reliably help | An untested framework; the supporting examples are memory experiments |
| The same assistance for people at different levels | [Expertise reversal meta-analysis](https://www.pedocs.de/volltexte/2026/34113/pdf/Learn_and_Instr_2025_Tetzlaff_u.a._A_cornerstone_of_adaptivity.pdf): low prior knowledge d = 0.51, high prior knowledge d = −0.43 | Strong, but studies vary widely; "high prior knowledge" is usually the high-scoring group within the same sample, split by a test |
| Who benefits from more cohesive text? | A [fourth-grade experiment](https://files.eric.ed.gov/fulltext/EJ1070456.pdf): overall, the cohesive versions did better on multiple choice; high-knowledge children recalled more from the low-cohesion version of stories on cued recall; no difference at all on the science texts | Weak; does not extend to adults reading technical text |
| How do popular coding tutorials handle reader level? | [Analysis of 30 popular tutorials](https://faculty.washington.edu/ajko/papers/Kim2017CodingTutorialEvaluation.pdf): the text says none recommended where to start based on coding experience; the paper's own table has nearly half checked in its "Coding experiences" column | A 2016 snapshot, one rater, no learning outcomes measured |
| State prerequisites at the top | The [MDN writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide) requires it for tutorials; the [Google technical writing course](https://developers.google.com/tech-writing/one/audience) teaches defining the audience first | Industry practice; neither cites research |
| Can readers judge from a prerequisite note whether to read on? | No research found | — |

## Do people who know more learn more?

### Still ahead after learning

Bianca Simonsmeier and colleagues' [2022 meta-analysis](https://doi.org/10.1080/00461520.2021.1939700) (I read the [authors' accepted manuscript](https://www.uni-trier.de/fileadmin/fb1/prof/PSY/PAE/Team/Schneider/SimonsmeierEtAl_2021.pdf)) covers 493 studies and more than 120,000 people, and asks a question that sounds simple: do people who know more before learning also learn more?

They split the question into three correlation coefficients (ranging from −1 to 1, with 0 meaning no relationship), because each answers something different:

- The correlation between prior knowledge and post-learning knowledge.
- The correlation between prior knowledge and posttest minus pretest, called absolute gain.
- The correlation between prior knowledge and normalized gain. Normalized gain is the points gained divided by the room for improvement left at pretest. For example, from 60 at pretest to 80 at posttest is 20 points recovered out of 40 available, or 50%.

Start with the first. The average correlation between prior knowledge and post-learning knowledge is .53, which the authors define as the stability of individual differences: people ranked near the top before learning are mostly still near the top afterward. The authors stress that this is not evidence that prior knowledge helps learning, because even if nobody learned anything in between and the ranking stayed the same, this correlation would be just as high. They name earlier work that read it that way, including their own team's.

This column does have a set of causal evidence. In 9 randomized experiments, some participants received extra prior knowledge before learning (the original studies called it preteaching, pretraining, knowledge induction, and so on), and then everyone took the same lesson. The correlation between the manipulated prior knowledge and posttest knowledge was .39, and the groups that got the extra knowledge scored higher on the posttest; this figure did not differ significantly from the correlation in non-experimental studies. All 9 measured post-learning knowledge; none reported gains.

### How much is learned this time has no general answer

The average correlation between prior knowledge and normalized gain is −.06, with a confidence interval that crosses zero. The correlation with absolute gain is −.26, significantly negative; the authors attribute this to a ceiling: people who already score high at pretest have less room left on the scale.

An average near zero does not mean that prior knowledge has no effect on how much is learned. The authors say twice that it cannot be read this way: results vary widely across studies, and there is a 95% chance that the next study's result falls between −.69 and .62, anywhere from strongly negative to strongly positive. In their conclusion they write:

> statements about the effects of prior knowledge in general, such as "knowledge is power" or "prior knowledge has no effects," are inadequate.

In other words, neither generalization holds: not that knowledge is power, and not that prior knowledge has no effect.

The authors offer two explanations and say the data cannot test which is right. One is that the same prior knowledge works through positive and negative paths at once: it guides attention and helps interpret new information, but it can also interfere and cause negative transfer, and the two often cancel out. The other is a threshold: only a certain amount of prior knowledge is needed, most participants are already above it, and differences above the threshold are unrelated to learning. Their example is teaching fraction addition only to children who already understand whole numbers.

### The subgroup closest to writing articles

The authors ran a set of exploratory moderator analyses. The only normalized-gain correlation in the whole paper that was significantly different from zero was for learning that included written instruction: correlation .22, meaning people with more prior knowledge learned more from written materials. The authors called this a Matthew effect (original wording: "a Matthew effect for written instruction"; a Matthew effect generally refers to those who start ahead also gaining more, so the gap widens). Without written instruction the correlation was −.19, not detectably different from zero.

This is the result closest to writing articles, and it comes with three things attached. The authors say no theory they know of predicts it; the moderator analyses are exploratory and the moderators are confounded with each other; and the row-by-row study counts and confidence intervals are in supplementary material I did not get to read.

Another moderator was the cognitive demand of the instruction. It was coded only when a single study had two conditions differing in demand. Under higher demand, the correlation between prior knowledge and gain leaned positive; under lower demand it leaned negative. The two differed significantly from each other, but neither was significantly different from zero on its own. On this basis the authors say that how teachers design instruction can affect the gaps between their students.

The data has one feature the authors do not discuss, which I noticed while reading the methods: the median interval between pretest and posttest is 360 days, and the average sample age is 11. It is mostly a record of schoolchildren over a long stretch of schooling, not the before and after of reading one article.

## When prior knowledge helps

Garvin Brod's [2021 commentary](https://doi.org/10.1038/s41539-021-00103-w) responds to that meta-analysis (Brod is also one of the authors of the expertise reversal meta-analysis in the next section). The question it asks: why does the same prior knowledge sometimes help and sometimes get in the way? Brod proposes three determinants arranged in a hierarchy:

1. **Is it activated?** Knowledge that sits in memory but is not retrieved during learning has a negligible effect.
2. **Is it relevant to the task at hand?** Activated but irrelevant knowledge has no effect, or causes intrusions and biases.
3. **Is it congruent or incongruent with what is to be learned?** Activated, relevant, but incongruent knowledge will mostly hinder too.

The conclusion is "Only when it is activated, relevant, and congruent will prior knowledge reliably help." The same paragraph says there is no one-to-one mapping between these determinants and learning success. Seen through this framework, the meta-analysis finding of "a wide distribution of effect sizes that centers around zero" is less surprising. Brod also points out that the meta-analysis did not record whether prior knowledge was activated during learning or how congruent it was with the new content, so this explanation cannot be checked against that data.

The examples behind the three determinants are all memory experiments. Brod describes them in prose without numbers, and I read none of the originals:

- Activation: Bransford and Johnson (1972) had participants read a passage describing doing laundry. Those given the topic beforehand had higher comprehension ratings and recalled clearly more; those given it afterward, or not at all, did not.
- Irrelevance: football fans memorized a list of animal names, some of which were also team names; afterward they falsely recalled more team-animal names that had not appeared, making more errors than non-fans.
- Incongruence: new information incongruent with prior knowledge is usually remembered less well. The exception is highly incongruent information that strongly surprises the learner, which can be learned well. The larger the reorganization needed, the harder the learning; the author's example is the concept "whale." Learning "that whales can be found in the Arctic Ocean" just enriches existing knowledge, while learning "that whales are mammals" requires moving the whole concept from one branch of the classification tree to another.

Incongruent prior knowledge (what readers already believe that is wrong) gets its own post later in the series. The Simonsmeier meta-analysis also included studies that measured incorrect knowledge, but they make up only 3% of all effect sizes, and none has gain data.

Applying this framework to writing, my inference is: whether readers have the relevant knowledge is outside the author's control; whether it gets activated is something the author can nudge at the top, for example by first saying what problem the post solves, or pointing to where readers have seen something similar. This is inferred from a secondhand account of one memory experiment; nobody has tested it on teaching articles.

## The same assistance, opposite effects at different levels

Part 1 already covered the main results of this meta-analysis; this section fills in what part 1 did not expand on.

Leonard Tetzlaff and colleagues' [2025 meta-analysis](https://www.pedocs.de/volltexte/2026/34113/pdf/Learn_and_Instr_2025_Tetzlaff_u.a._A_cornerstone_of_adaptivity.pdf) covers 60 experiments. Each had at least two instructional designs differing in how much assistance they provide, with participants randomly assigned, and domain knowledge classified as high or low before instruction, either by a test or by group membership (such as grade level). Learners with low prior knowledge learned more from the high-assistance design (d = 0.51, about half a standard deviation higher on average); learners with high prior knowledge learned less from it (d = −0.43). The authors separately pooled the difference between the two effects within each study and got d = 0.97, judging the expertise reversal effect as a whole to be strong.

### What "assistance" and "high prior knowledge" mean

The analysis defines assistance broadly, as every kind of manipulation of the instruction or task intended to facilitate processing. The authors' examples are static versus animated diagrams, and graphics with or without annotations. How high and low assistance were coded is not stated, and the type of assistance was not used as a moderator. So whether how much scaffolding an article provides counts as this kind of assistance is an inference; part 1 already labeled it that way.

"High prior knowledge" needs even more care. In 32 of the 60 studies, participants were measured with a test and the same sample was then split into high and low groups (the authors' introduction summarizes such studies as measuring prior knowledge and splitting along the median, without describing each study's split). Others distinguished by grade level (for example, seventh versus tenth grade), by profession or field of study (the authors' example is hairdressing apprentices versus psychology students), by teaching some participants first to create a difference, or by self-assessment. In their limitations, the authors say this dichotomizing makes the results depend on how far apart the groups are: the gap between hairdressers at the end of vocational training and psychology students is far larger than the gap between two groups split from one sample by a short test.

Assessment type significantly moderated the effect for high-prior-knowledge learners. The disadvantage of high assistance for them was largest in studies that distinguished by grade level, and weakest in the most common measure-then-split studies and in intervention-induced studies; whether each of those latter two remained significantly different from zero is not reported.

### Asymmetry, and providing assistance when in doubt

The authors judge the effect to be asymmetric from the two averages: giving novices assistance helps more than removing redundant assistance helps experts. The difference in size between 0.51 and 0.43 was not tested separately. The authors also note that even in studies where low assistance was better for both groups, the gap between the two designs was usually larger for learners with low prior knowledge; they call this pattern an ordinal interaction, and warn in a footnote that which pattern holds applies only to the observed range of knowledge, and a crossover may appear as the range widens.

The practical implication the authors draw from the asymmetry, in their own words:

> the instructional implication is to rather provide assistance than to withhold it when in doubt.

When in doubt, providing assistance is better than withholding it. Part 1's "write for novices by default" can be mapped onto this sentence, on the condition that assistance is mapped onto an article's scaffolding, and that step is an inference.

The authors' own practical implications are about adapting to each learner's level, with repeated assessment as learning proceeds; they say this is no trivial task, and the approach they suggest is intelligent tutoring systems with student models, plus letting students choose assistance themselves. How to write one fixed text for readers at different levels is not discussed. Letting readers choose assistance is a neighbor of collapsible sections and skip-ahead signposts, but the authors give no evidence for it.

### Studies vary a lot

The heterogeneity measures for both average effects are close to 90%, and the first sentence of the authors' limitations says the size of the effect varies substantially across age groups and domains. Content domain moderated only the low-prior-knowledge effect: especially pronounced in law, business, and crafts, especially weak in humanities and language; 38 of the 60 studies were STEM. The authors also say these moderators are partly confounded, for example some domains and some assessment types cluster in particular educational levels. Primary school has only 2 studies, which the authors say is too few to draw conclusions.

## Who benefits from more cohesive text

After expertise reversal, part 1 mentioned a study pointing the same direction: McNamara and colleagues' 1996 experiment on text cohesion. I read only its abstract and do not cite its conclusions. What I have in full text is a 2011 experiment with fourth graders by the same first author.

Danielle McNamara, Yasuhiro Ozuru, and Randy Floyd's [2011 experiment](https://files.eric.ed.gov/fulltext/EJ1070456.pdf) had 65 fourth graders each read four short texts (originals 304 to 471 words; the high-cohesion rewrites were longer): two stories and two science expository texts, one low-cohesion and one high-cohesion of each kind. The high-cohesion versions used seven techniques: replacing pronouns with nouns, adding descriptive elaborations, adding connectives, changing words so adjacent sentences overlap, adding topic headings, adding topic sentences, and reordering sentences. The authors deliberately avoided adding much new explanatory information. The children did multiple-choice questions, cued recall, and free recall right after reading. "High and low knowledge" was a median split within these 65 children on a general academic knowledge test, not knowledge of the four texts' topics.

Results:

- **Overall**, the high-cohesion versions did better on multiple choice (67% versus 63% correct), with no difference on either recall measure.
- **Stories**: the high-cohesion versions did better on multiple choice. High-knowledge children reading the low-cohesion versions actually recalled more on cued recall (39% versus 30%), the result the authors call a reverse cohesion effect; the same children's difference on free recall was not significant, and their multiple-choice average was higher for the high-cohesion version, also not significant.
- **Science expository texts**: cohesion had no significant effect on any measure, for either knowledge group. Low-knowledge children recalled only about 6% of the science texts, close to the floor.

In the discussion the authors speculate that this kind of rewriting, which adds cohesion cues but no explanation, may not be enough for young readers, who need more background information. This is an after-the-fact reading of a result where no difference was detected; the study had no condition with added explanation to compare against.

So this experiment cannot support explaining less for experienced readers. The reverse effect appears only on stories, on one measure, among fourth graders with relatively higher knowledge; on expository text, the genre closest to technical articles, cohesion made no detectable difference for anyone.

## A study that looks like a counterexample, but cannot answer the question

The abstract of Anna Gorbunova and colleagues' [2025 study](https://doi.org/10.3389/fpsyg.2025.1628047) says: "Pre-training consistently reduced extraneous load across all learners, including those with higher prior knowledge, challenging the expected expertise reversal effect." That sentence is easy to take as a counterexample to expertise reversal.

The design cannot support it. All 136 graduate students received the same pre-training (a concept map plus a glossary); there was no control group without pre-training. The "reduction" compares two self-reports from the same people: the first asked about the design of the concept map (for example, "The design of the concept map was inconvenient."), the second about the design of the tasks ("The design of the tasks was inconvenient."), so the two questionnaires asked about different things. Learning outcomes were reported only as descriptive statistics. Expertise reversal compares learning outcomes with and without assistance, and this study has neither. The authors themselves write, at the end of their conclusion, that future studies should compare pre-training against a control condition.

## The author cannot see the reader: what tutorials and style guides do

The research side mostly concludes that instruction should adapt to the reader's level. A public article cannot adapt reader by reader; what the author can mainly do is make clear who the article is written for. This section looks at how practice handles it. None of the material below measures effects: one is a content analysis, one is an observation of course pacing, and two are writing guides.

### Popular coding tutorials: levels exist, but shallow

Ada Kim and Amy Ko's [2017 paper](https://faculty.washington.edu/ajko/papers/Kim2017CodingTutorialEvaluation.pdf) ([published version](https://doi.org/10.1145/3017680.3017728); I read the version on the author's website, updated in 2021, and did not check it word for word against the published version) took 30 online coding tutorials and checked each against teaching principles from *How People Learn*. The first principle is connecting to prior knowledge.

- Only 3 (Code.org, Lightbot, Scratch) indicated an appropriate age range.
- 14 considered learners' education status, which the authors call superficial: mostly a vague split into beginner, intermediate, and advanced.
- The text says: none of the tutorials recommended specific stages or modules based on learners' prior coding experience.

The last item has to be read together with two inconsistencies. The abstract says "few," not "None." The paper's summary table has a "Coding experiences" column, where I counted 14 tutorials checked; the authors do not explain that column's criterion or how it squares with the text's "None."

Other limits: only the first author rated, looking at at least one module per tutorial, not necessarily all of it; the sample was chosen in July 2016 from English-language Google searches plus site traffic rankings, with 3 tools common in classrooms added by hand; no learning outcomes were measured. The authors themselves say the tutorials might be effective despite not meeting the principles.

### Course pacing: readers use all the flexibility

Tommy Mullaney and Justin Reich's [2015 study](https://doi.org/10.1145/2724660.2724663) compared two runs of the same HarvardX humanities course: in the first, content was released sequentially; in the second, everything was available from the start (I read the authors' public [working paper version](https://web.archive.org/web/20150910061550id_/http://harvardx.harvard.edu/files/harvardx/files/ssrn-id2499729.pdf)). In the sequential run, only 30 to 40% of active students were roughly on schedule in most weeks; in the all-at-once run, it fell below 20%. The authors say that if anything can be said with confidence, it is that students will use whatever pacing flexibility the course offers.

Another finding the authors call incidental: in every week, a group of students spent most of their time in the first two chapters, and for many students, that was the only part they saw. The authors give no proportion for this group.

This is a study of course pacing, not of how to write a single article. The two runs also differed in more than release pattern (the authors call it "a bundle of changes"), and the outcomes were certificate rates and activity, with no learning test. I take it as a direction: readers of a series mostly will not read in order, so each post should state its own prerequisites and link back to earlier ones. This is my inference.

### Google's technical writing course: what readers need, minus what they have

The ["Audience" unit of Google's Technical Writing One](https://developers.google.com/tech-writing/one/audience) opens with an equation:

> good documentation = knowledge and skills your audience needs to do a task − your audience's current knowledge and skills

The unit's approach is to list the audience's roles first (software engineers, graduate students, non-technical roles, and so on), then write down what the audience needs to learn.

The page has three details useful for writing prerequisites:

- **Roles are not enough.** Knowledge within the same role diverges quickly, so you also have to consider how close readers are to the knowledge. Time counts too: almost every software engineer studied calculus, and it fades if they never use it at work.
- **The wider the audience, the more you should assume you must explain.** Unless you are writing only for experienced members of your team, you usually have to explain more than you expect.
- **The curse of knowledge**: experts easily forget that newcomers don't know what they know. The unit's exercise takes a paragraph introducing C and asks which words a physician who has never programmed would not understand; the answer lists 9.

The page cites no research and can only stand as an example of how an industry course teaches it. The unit itself says the formal approach involves surveys, user studies, and documentation testing, and that it uses a simpler approach because readers probably don't have that much time.

### MDN's writing style guide: say what is covered and what readers should already know

[MDN's writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide) asks that the introductory paragraph before the first heading summarize what the page covers, so readers can quickly tell whether it is relevant to them. For tutorials there is one more sentence:

> In a guide or tutorial, the introductory paragraph(s) should inform the reader about the topics that will be covered as well as the prerequisite knowledge the reader is expected to have, if any.

Three details: it applies to guides and tutorials, not to every page; prerequisites are "if any"; and it asks for them in the introductory paragraphs, not as a list. The same guide also says a page on an advanced topic need not cover basic concepts in as much detail as a general page.

That sentence is all the guide says about prerequisites, plus one other place saying each code example should be preceded by what additional knowledge might be needed to understand it. The latter sits in the "Write with SEO in mind" subsection, and the stated reason is that pages should not be too short, not learning effects. The guide offers no evidence of effects either.

### The research on reader-chosen paths, which I could not read

One review on letting readers choose which sections to read and in what order, and who benefits from that, is Katharina Scheiter and Peter Gerjets's 2007 "Learner Control in Hypermedia Environments" ([DOI](https://doi.org/10.1007/s10648-007-9046-3)). The study exists; I could not find a full text made public by the authors or the publisher.

## Where the sources disagree

The following results point in different directions, or seem to conflict but actually measure different things. I set them side by side without picking a winner.

**Does prior knowledge predict how much is learned?** In the Simonsmeier meta-analysis, the average correlation between prior knowledge and normalized gain is close to zero. In the Tetzlaff meta-analysis, prior knowledge decides the direction of the effect of assistance. They ask different questions: the first is how far prior knowledge and learning gains move together across all kinds of instruction; the second is the interaction between prior knowledge and instructional design. Simonsmeier's authors also use expertise reversal to explain how cognitive demand moderated stability.

**A Matthew effect under written instruction versus assistance for novices.** In Simonsmeier's exploratory analysis, among learning with written instruction, people with more prior knowledge learned more (normalized-gain correlation .22). In Tetzlaff's analysis, high-assistance materials helped learners with low prior knowledge learn more. The first is a cross-study correlation with no manipulation of materials; the second compares two designs within the same study. One way both could hold: written materials may favor those who know more (.22 is an exploratory cross-study moderator result, and the data is mostly long-term learning by schoolchildren), while high-assistance designs can narrow that gap. This is my inference; no study has compared them directly.

**Brod's plain-language reading of the meta-analysis.** The first paragraph of Brod's commentary says this means knowledge at the start does not actually determine how much a student learns from a given task. Simonsmeier's authors explicitly object to reading an average near zero as meaning that prior knowledge does not predict learning. Brod's sentence is prefaced with "it suggests," and later the commentary walks it back, saying the distribution is wide and there is no need to overturn the old claim that prior knowledge determines what a student will learn, so the commentary's overall position is consistent with the meta-analysis; quoting that one sentence alone overstates it.

**Which way text cohesion points.** In McNamara and colleagues' experiment, the high-cohesion versions did better on multiple choice overall; high-knowledge children reading stories recalled more from the low-cohesion version on cued recall, yet the same children's multiple-choice average was higher for the high-cohesion version (not significant). The abstract says high-knowledge children better understood the low-cohesion stories, turning one significant result out of three measures into a general statement.

**Does prior knowledge moderate design effects?** In the Tetzlaff meta-analysis, prior knowledge significantly moderated the effect of assistance. In the text-and-picture review cited in part 2, prior knowledge did not consistently moderate the effects of design principles. In the segmenting meta-analysis cited in part 1, learners with high prior knowledge actually benefited more on retention tests, contrary to that analysis's own hypothesis, with only 7 comparisons, 4 of them from the same paper. The three include different studies and manipulations; Tetzlaff only includes experiments that measured prior knowledge and compared two levels of assistance within the same study.

**Do popular coding tutorials route learners by experience?** Kim and Ko's abstract says "few," the text and discussion say "None," and the summary table's "Coding experiences" column has more than a dozen checks. The paper does not explain this.

## What you can do

Each item below states its basis; where no study tested it directly, I say it is an inference or a choice this site makes.

1. **In the first two or three sentences, say what problem the post solves, what readers need to know first, and what they will be able to do afterward.** Basis: the MDN guide's requirement (industry practice, no research cited); the laundry experiment Brod describes, where knowing the topic beforehand activated the relevant knowledge (a memory experiment; I did not read the original). Whether readers can use these sentences to decide whether to read on has not been tested.

2. **Write prerequisites as what readers need to be able to do, not just subject names.** For example, instead of "requires linear algebra," write "you should be able to multiply two matrices and know the shape of the result." Basis: Google's equation is framed around what the audience needs "to do a task," and the unit says roles are not enough and knowledge fades over time (industry practice). This points the same way as part 5's suggestion to first explain, in the prerequisite section, the terms that will keep coming up.

3. **When unsure whether readers know something, explain it.** Basis: the practical implication Tetzlaff and colleagues draw from the asymmetry (when in doubt, providing assistance is better than withholding it); the asymmetry comes from comparing two averages and was not tested separately. Mapping "assistance" onto one more sentence of explanation or one more intermediate step in an article is my inference.

4. **Give experienced readers a way out as a signpost, so they don't have to read to the end to find out they could skip.** For example, start a section that fills in basics with "If you already know NumPy broadcasting, skip to the next section," or put the basics in a collapsible section. This is a choice this site makes: Tetzlaff and colleagues mention letting learners choose assistance, but give no evidence; I found no research at all on the effect of collapsible sections or skip signposts in long web articles.

5. **Have every post in a series state its own prerequisites and link back to the post that taught them.** Basis: in Mullaney and Reich's course data, learners use all the flexibility and don't follow the recommended order (an observation of course pacing, not of single articles). Extending this to article series is my inference.

6. **After writing, have someone unfamiliar with the topic read the opening and the first section and circle words they don't understand.** Basis: the "curse of knowledge" exercise in Google's course (industry practice, no research). [Part 4](/posts/learning/2026-10-14-notation-jargon-terminology-en) also suggested a test read by someone unfamiliar with the field, from a different set of sources.

### Checked against this site's course-guide spec

| Spec item | What the sources say | Strength of basis |
|---|---|---|
| Record reader prerequisites on the scope card | Google's course teaches defining the audience by role and proximity; Tetzlaff and colleagues say to adapt to learners' domain knowledge | Industry practice; research supports adapting to level as a direction, but that presupposes assessing the reader, which an article cannot do |
| Course overviews state who the reader is, prerequisites, reading path, and a concrete starting point | Kim and Ko's text says no popular coding tutorial recommended a starting point by experience (the paper's table is inconsistent); MDN requires prerequisites at the top of tutorials | Rare in Kim and Ko's sample; effect untested; a choice this site makes |
| Prerequisites not taught earlier in the series get a link the reader can follow | Mullaney and Reich: learners don't follow the order; Tetzlaff: low-prior-knowledge learners benefit from assistance | Direction supported; the "link" form has not been tested (already listed in the comparison table of [part 9](/posts/learning/2026-10-13-teaching-text-questions-feedback-en)) |
| Part 1's practice: write for novices by default, put scaffolding in skippable blocks | The first half maps onto Tetzlaff and colleagues' practical implication; no research on the second half | The first half maps onto the authors' practical implication, but treating assistance as scaffolding written for novices is an inference; the second half is a choice this site makes |

## Limits of this evidence

- **No study looks at self-taught adults reading web tutorials.** Simonsmeier's data is mostly schoolchildren over long stretches of schooling; McNamara's is fourth graders reading texts of a few hundred words; the experiments Tetzlaff includes are not limited to one material type and include sports and vocational training.
- **"High prior knowledge" is mostly relative.** In 32 of Tetzlaff's 60 studies, the same sample was split into high and low groups by test score; McNamara used the median of a general academic knowledge test; Gorbunova's "high prior knowledge" means 6 or more correct on an easy 8-item test, over 70% of the sample.
- **Moderation by prior knowledge often goes undetected because almost nobody knows the material.** Wesenberg and colleagues' [2026 experiment](https://doi.org/10.1007/s11251-026-09781-8), which tested how the amount of interesting but irrelevant detail affects learning, detected no moderation by prior knowledge; the authors themselves say it may be a floor effect, with average prior knowledge in both samples below a tenth of the maximum score.
- **Averages from meta-analyses hide large variation.** The heterogeneity measures for Simonsmeier's three correlations are all between 94% and 98%; for Tetzlaff's two average effects, close to 90%.
- **The moderator analyses are all cross-study.** The authors say Simonsmeier's written-instruction and cognitive-demand moderators, and Tetzlaff's domain and assessment-type moderators, are confounded with each other; Simonsmeier's authors say their moderator analyses are exploratory.
- **I did not read Simonsmeier's supplementary material.** The row-by-row moderator figures, the list of included studies, and what each of the nine randomized experiments taught are all in the supplement. I read the authors' accepted manuscript, where the abstract, results, and implications give three different values for the main correlation (.534, .531, .525); this post uses the .531 from the results table.
- **Brod's framework has not been tested**, and the three examples supporting it are secondhand accounts I did not read in the original.
- **None of the practice sources measures effects.** The Google and MDN guides cite no research; Kim and Ko did not measure learning outcomes; Mullaney and Reich compare two runs of one humanities course, with no learning test.
- **Conclusions I cannot write**: whether readers can accurately judge from a prerequisite note whether a post is for them; the effect of collapsible explanations, skip signposts, and tiered entry points in long web articles; whether low-cohesion text works better for experienced adult readers; whether people with more prior knowledge learn new material faster. For the first two I found no research; for adult cohesion research I only have one sentence relayed in McNamara 2011; for the last, I could only read the abstract of the experimental study.
- **My inferences and this site's choices**: the author can nudge activation of relevant knowledge at the top; a Matthew effect under written instruction and assistance for novices can coexist; mapping assistance onto one more sentence of explanation or one more step; readers of a series don't read in order; the specific wording of items 2, 4, and 6 under what you can do; the two entries labeled "a choice this site makes" in the spec table. Each is marked in the text.
- **Read only in abstract, not listed in the references**: McNamara and colleagues (1996) on cohesion (per McNamara 2011's account, the sample was adolescents).
- **Known to exist, but no legally public full text found**: Scheiter and Gerjets (2007), the review on reader-chosen paths ([DOI](https://doi.org/10.1007/s10648-007-9046-3); the publisher's page is paywalled).
- **Secondhand**: Bransford and Johnson (1972), Castel and colleagues (2007), and the whale classification example as described by Brod; I read none of the originals.

## Appendix: designs and numbers for each study

The body keeps one or two numbers per item; the rest are here.

**Simonsmeier, Flaig, Deiglmayr, Schalk, Schneider (2022)**, Educational Psychologist 57(1); I read the authors' accepted manuscript. Not preregistered. PsycINFO and ERIC searched in May 2018, plus mailing lists and online calls; 1,192 emails sent, and authors of 71 studies provided unpublished data. 493 studies, 685 independent samples, 126,050 people, 8,776 effect sizes; 47 countries, North America 45%, Europe 33%, Asia 12%; median pretest–posttest interval 360 days; mean sample age 11.32 years. All converted to correlations and pooled with robust variance estimation. Prior and posttest knowledge: r = .531 (95% CI .509–.552), 476 studies, 7,772 effect sizes, I² = 94.16, prediction interval −.067 to .848. Prior knowledge and absolute gain: r = −.263 (−.370 to −.149), 50 studies, I² = 98.05. Prior knowledge and normalized gain: r = −.059 (−.150 to .034), 69 studies, I² = 96.94, prediction interval −.688 to .621; 37% of effect sizes within ±.10, 6% beyond ±.50. Subset of 28 studies where all three could be computed: .632, −.277, .001. Nine randomized experiments (2 randomized by class, 7 by individual; only 3 ran manipulation checks; manipulations lasted 5 to 180 minutes): r = .394 (.132–.605), not significantly different from the non-experimental .533; none of the studies with gain data was a randomized experiment. Controlling for intelligence, the prior–posttest correlation fell from .515 to .479, not significantly. Funnel plots and Egger tests showed no sign of publication bias. Moderator analyses (exploratory): learning with written instruction rNG = .219 (significant), without −.194 (not significant), R² = .207; moderation by cognitive demand R² = .138, with neither the high nor the low category significantly different from zero on its own. Incorrect knowledge accounts for only 3% of effect sizes: incorrect prior with correct posttest r = −.472, incorrect prior with incorrect posttest .571, none with gain data.

**Brod (2021)**, npj Science of Learning 6:24, published version; the journal labels it a Comment. Single author, responding to the Simonsmeier meta-analysis, then in press. No effect sizes, sample sizes, or statistics anywhere. Framework: three determinants (activation, relevance, congruence) arranged in a hierarchy; the author says "at least three," with no one-to-one mapping to learning success, covering only within-person factors, with the dichotomies as ends of continuous dimensions. Closing: assessing a learner's prior knowledge before teaching new content remains of utmost importance.

**Tetzlaff, Simonsmeier, Peters, Brod (2025)**, Learning and Instruction 98; I read the published version archived on peDOCS. PsycINFO and ERIC searched in December 2022, updated November 2024. 60 experiments, 176 effect sizes (88 each for high and low prior knowledge), 5,924 people, 1992 to 2024, sample sizes 17 to 357, median 73. Low prior knowledge d = 0.505 (0.260–0.750), I² = 90.87%; high prior knowledge d = −0.428 (−0.647 to −0.209), I² = 87.55%; difference between the two d = 0.971 (0.631–1.312), with no moderator analysis for this one. Egger tests not significant. Prior-knowledge assessment type: grade level 8 studies, profession or field of study 8, measurement 32, intervention-induced 7, self-evaluation 5; assessment type significantly moderated the high-prior-knowledge effect (R² = 50%), not the low-prior-knowledge effect. Educational level moderated both (R² 25.92% and 8.47%); content domain moderated only the low-prior-knowledge effect (R² = 20.59%). Primary school: 2 studies, 4 effect sizes. Limitations the authors list: cannot distinguish theoretical explanations; few degrees of freedom for some moderator levels; large heterogeneity implies uncoded study characteristics; both prior knowledge and assistance were dichotomized. Part 1's appendix has other figures from the same analysis.

**McNamara, Ozuru, Floyd (2011)**, International Electronic Journal of Elementary Education 4(1), published version. 65 fourth graders from four public elementary schools in one U.S. metropolitan district, signed up voluntarily by parents; screening tests showed them slightly above average. 2 × 2 within-subjects design (story/expository × low/high cohesion), with knowledge and decoding skill analyzed separately as between-subjects factors. The four original texts were 304 to 471 words, the high-cohesion versions 96 to 171 words longer; 5 minutes of silent reading per text, immediate tests only. Knowledge was a median split on the WJ III Academic Knowledge test (low group 92.97, high group 113.06, norm 100). Main effect of cohesion: multiple choice .63 versus .67, p < .05; both recall measures F < 1. On stories, multiple choice favored high cohesion (.69 versus .76); on expository texts, no difference (.57 versus .57). High-knowledge readers on stories, low versus high cohesion: cued recall .39 versus .30, t(26) = −3.88, p < .05; free recall .22 versus .19, p = .11; multiple choice .77 versus .81, p = .14. The three-way interaction was significant on both recall measures. Decoding skill had no significant interactions. Limitations the authors list: only decoding and world knowledge were measured; the sample was slightly above average with a restricted range. No effect sizes were reported, no correction for multiple comparisons, and several numbers in the tables and text do not match (for example, the low-knowledge group's multiple-choice mean).

**Gorbunova, Kapuza, Chen, Costley (2025)**, Frontiers in Psychology 16:1628047, published version. 136 second-year graduate students at a Russian university, tested in one 80-minute synchronous online class; all received the same pre-training (a 16-node concept map plus a 14-entry glossary, about 7 minutes), with no control group and no random assignment. Prior-knowledge test of 8 items, α = 0.44, split at 6 points into low prior knowledge 26.5% and high 73.5%. Extraneous load self-reports: 4.79 in the pre-training phase, 3.64 in the problem-solving phase (0–9 scale); down 1.21 for the low group and 1.13 for the high group, interaction p = 0.84. The extraneous-load items asked about the concept map's design the first time and the tasks' design the second time (supplementary material). Problem-solving scores: low 5.97, high 8.03 (out of 15), not tested. Limitations the authors list: the prior-knowledge test was too easy; only one pre-training format; well-structured problems; immediate outcomes only.

**Kim and Ko (2017)**, SIGCSE '17; I read the version on the author's website marked as updated in 2021. 30 tutorials: interactive tutorials 7, web references 10, MOOCs 4, educational games 7, creative platforms 2 (counts per category taken from the table's dividers). Selection: the first 10 pages of English-language Google results for two search terms, sites ranked within the top 100,000 by traffic on July 29, 2016, plus Scratch, Alice, and Lightbot added by hand. Four principles from *How People Learn* expanded into 24 dimensions, all but one judged yes/no; the criterion text was published for only one. The first author rated all of them, about 2 hours per tutorial, looking at at least one module each. Connecting to prior knowledge: age range indicated by 3; education status considered by 14; the text says 0 recommended specific stages or modules by coding experience, while I counted 14 checks in the table's "Coding experiences" column; later stages requiring earlier knowledge, 15 in the table by my count. The tutorials the authors recommend include Gidget, from the second author's lab. Limitations the authors list: the sample does not represent non-English tutorials; traffic does not reflect learning progress; tutorials change; binary judgments are coarse; a single rater; no learning outcomes measured.

**Mullaney and Reich (2015)**, L@S '15; figures from HarvardX Working Paper No. 7 (2014-09-22). HeroesX (the ancient Greek hero), edX. First run: March to August 2013, 20 weeks, released sequentially about two chapters a week, 43,563 registrants. Second run: September to December 2013, 13 weeks, released all at once, 22,975 registrants, plus 236 Harvard College students using the same materials. Active students loosely on schedule: 30% to 40% in most weeks in the first run, under 20% in the second; individual-level proportions were low in both (4% to 14% in the first run under the loose definition). Certification rate (of active students) 5.6% versus 5.7%; median days of activity 3 in both; forum participation 12.8% versus 7.6%; none of these comparisons was tested. Limitations the authors list: no random assignment; the runs differed by a bundle of changes; multiple-choice assessments; no pretest; a single course.

**Google, Technical Writing One: Audience**, a course unit web page, last updated 2025-03-28, CC BY 4.0. No named author, no research cited. Contents: principles, fictional examples, and two exercises with answers.

**MDN, Writing style guide**, the writing guidelines page for a community documentation site, last modified 2026-09-10. No research cited. The parts relevant to prior knowledge are the introductory-paragraph section (tutorial openings state the topics covered and the expected prerequisite knowledge), the target-audience section, and the code-example requirements within the SEO section.

**Wesenberg, Jansen, Krieglstein, Meusel, Schneider, Valtin, Rey (2026)**, Instructional Science 54, published version. Two online experiments (191 and 101 people) manipulating the share of interesting but irrelevant detail in a text. Average prior knowledge was only 9.54% and 7.67% of the maximum; the interaction between prior knowledge and the amount of detail was not significant for recall or transfer, which the authors say may be a floor effect. The main results belong to a later post on interest and interesting details.

## References

Every entry was read from start to finish with an extraction record; what I could not read is noted in parentheses.

- [Simonsmeier, Flaig, Deiglmayr, Schalk & Schneider (2022), Domain-specific prior knowledge and learning: A meta-analysis](https://doi.org/10.1080/00461520.2021.1939700) ([authors' accepted manuscript](https://www.uni-trier.de/fileadmin/fb1/prof/PSY/PAE/Team/Schneider/SimonsmeierEtAl_2021.pdf); published version and supplements SM1–SM4 not read).
- [Brod (2021), Toward an understanding of when prior knowledge helps or hinders learning](https://doi.org/10.1038/s41539-021-00103-w) ([PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8377096/); for Figure 1, only the caption was read).
- [Tetzlaff, Simonsmeier, Peters & Brod (2025), A cornerstone of adaptivity: A meta-analysis of the expertise reversal effect](https://www.pedocs.de/volltexte/2026/34113/pdf/Learn_and_Instr_2025_Tetzlaff_u.a._A_cornerstone_of_adaptivity.pdf) ([DOI](https://doi.org/10.1016/j.learninstruc.2025.102142); supplementary material and forest plot not read).
- [McNamara, Ozuru & Floyd (2011), Comprehension challenges in the fourth grade: The roles of text cohesion, text genre, and readers' prior knowledge](https://files.eric.ed.gov/fulltext/EJ1070456.pdf) (published version via ERIC).
- [Gorbunova, Kapuza, Chen & Costley (2025), Rethinking pre-training: cognitive load implications for learners with varying prior knowledge](https://doi.org/10.3389/fpsyg.2025.1628047) ([PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12367772/), including supplementary material).
- [Kim & Ko (2017), A Pedagogical Analysis of Online Coding Tutorials](https://faculty.washington.edu/ajko/papers/Kim2017CodingTutorialEvaluation.pdf) (the version on the author's website marked as updated in 2021; not checked word for word against the [ACM published version](https://doi.org/10.1145/3017680.3017728)).
- [Mullaney & Reich (2015), Staggered Versus All-At-Once Content Release in Massive Open Online Courses](https://doi.org/10.1145/2724660.2724663): figures from [HarvardX Working Paper No. 7 (2014)](https://web.archive.org/web/20150910061550id_/http://harvardx.harvard.edu/files/harvardx/files/ssrn-id2499729.pdf); the published version's tables were not checked one by one.
- [Google, Technical Writing One: Audience](https://developers.google.com/tech-writing/one/audience) (the video in the unit was not watched).
- [MDN Web Docs, Writing style guide](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide).
- [Wesenberg et al. (2026), The more, the worse? The influence of the seductive detail amount on learning](https://doi.org/10.1007/s11251-026-09781-8) (the figures were not read).
- Posts on this site: [Writing the Examples and Openings of a Teaching Article](/posts/learning/2026-10-13-teaching-text-evidence-en), [When a Teaching Article Should Use a Diagram](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en), [How Far Should the Code in a Teaching Article Go](/posts/learning/2026-10-14-code-in-teaching-articles-en), [Handling Terms, Symbols, and Formulas in a Teaching Article](/posts/learning/2026-10-14-notation-jargon-terminology-en), [Pairing a Teaching Article with Video](/posts/learning/2026-10-13-instructional-video-in-articles-en), [What the Evidence for Learning by Doing Measures](/posts/learning/2026-10-14-active-learning-evidence-en), [Writing Questions and Wording in a Teaching Article](/posts/learning/2026-10-13-teaching-text-questions-feedback-en).
