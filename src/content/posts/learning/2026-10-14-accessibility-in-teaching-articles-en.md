---
title: "Who Can't Read a Teaching Article: What WCAG Requires of Diagrams, Code, Formulas, and Video, Research on Screen-Reader Users, and the Evidence for UDL"
date: 2026-10-14
category: learning
type: deep-dive
tags: [learning-science, accessibility, self-learning, course-guide, blog]
lang: en
description: "What a technical teaching article has to do for accessibility: the WCAG 2.2 success criteria that apply to each part of a teaching article, how screen-reader users read web pages and charts, the difficulties blind developers have reading code, which level of content a chart description should cover, and test results for this site's mermaid diagrams, code, tables, formulas, and video. The second half looks at the evidence for UDL (Universal Design for Learning) and whether the designs of the studies I could read in full support its claims."
tldr: "In an online experiment, screen-reader users answered questions about online charts correctly 34% of the time, against 87% for the comparison group; when the chart came with a data table, the screen-reader group rose to 73%. Only 1 of this site's 192 mermaid diagrams in Chinese posts has an accessible title. The only UDL meta-analysis I could read in full pooled g = 3.56, but most of the studies it included had no control group."
series:
  name: "Writing Articles That Teach"
  order: 23
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-14-accessibility-in-teaching-articles)

This is Part 23 of the "Writing Articles That Teach" series and the fourth part of its fifth section, "who you learn with, and who can't read it." The earlier parts asked how much readers learn once they read. This one steps back: some readers can't read the article at all, or can read the words but not the structure of the diagrams and code.

The question comes from this site's course guides. They lean heavily on [mermaid](https://mermaid.js.org/) for flowcharts and trees, tables for comparisons, KaTeX for formulas, pasted code, and embedded YouTube lectures. [The part on diagrams](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en) dealt with diagrams being too small on phones and mentioned that mermaid can carry an accessible title. But when the series was planned, one thing was listed as not done: nobody had actually looked at what these diagrams turn into on the screen-reader side. This part does that, then goes back to two questions: what accessibility standards concretely require of a technical article, and how much evidence there is for UDL (Universal Design for Learning), which education circles often cite when talking about "serving every learner."

Captions and timestamp links for video are in [the part on video](/posts/learning/2026-10-13-instructional-video-in-articles-en), how to write the code itself is in [the part on code](/posts/learning/2026-10-14-code-in-teaching-articles-en), and how to handle terms and formulas is in [the part on notation](/posts/learning/2026-10-14-notation-jargon-terminology-en). Non-native readers, translation, and phones come in a later part.

**How the sources were chosen, and their biases.** The 12 sources fall into three kinds. The first is standards and guidance: W3C's WCAG 2.2, W3C's tutorial on complex images, and CAST's UDL guidelines site. The second is descriptive data: WebAIM's automated scan of one million home pages and its survey of screen-reader users. The third is research: an experiment on screen-reader users reading online charts, a ranking experiment on text descriptions of charts, two interview studies of blind software developers, a UDL meta-analysis, a UDL implementation study, and a paper on a tool that reads math expressions to visually impaired students. I read each one in full, in the version I could obtain, and kept an extraction record.

There are three biases. **None of them measures how much readers with disabilities learn from a teaching article**; the closest is accuracy when reading charts. The screen-reader users in these studies are mostly blind or have low vision; deaf readers and readers with cognitive or learning disabilities barely appear. On UDL, I could read only the proponents' side and one meta-analysis; I couldn't read the full text of the published critiques, which are named below.

## The short version

| Question | What I found | Kind of evidence |
|---|---|---|
| What WCAG requires of a technical article | Diagrams need a text alternative (1.1.1, Level A); meaning can't rely on color alone (1.4.1, A); text contrast at least 4.5:1 (1.4.3, AA); prerecorded video needs captions (1.2.2, A); instructions can't rely only on position and color like "the red box on the right" (1.3.3, A); headings must describe the topic (2.4.6, AA); and more. A table by component follows below | Standard; W3C itself says meeting the highest level doesn't mean everyone can read the content |
| How screen-reader users find information | When looking for information on a long page, 71.6% say they first jump through the headings ([WebAIM survey](https://webaim.org/projects/screenreadersurvey10/); 1,511 people answered this question) | Self-report; volunteer sample, mostly proficient users |
| Can they read charts | Screen-reader group 34%, comparison group 87%; on charts with a data table, the screen-reader group reached 73%, but took the longest ([Sharif et al. 2021](https://doi.org/10.1145/3441852.3471202)) | Online experiment with 72 people; the charts were built by the authors |
| What a chart description should say | Blind readers ranked the statistical-and-relational and overall-trend levels as most useful, with no difference detected between the two; descriptions that only give the chart type and axes were mostly ranked least useful ([Lundgard and Satyanarayan 2021](https://arxiv.org/abs/2110.04406)) | Subjective ranking; comprehension was not measured |
| The structure of code | 22 of 28 blind developers mentioned trouble telling indentation apart; the screen reader reads indentation as a run of "space" ([Albusays et al. 2017](https://doi.org/10.1145/3132525.3132550)) | Interviews and observation; numbers are "how many mentioned it" |
| This site's mermaid diagrams | Only 1 of 192 diagrams in Chinese posts has an `accTitle`; for the rest, what the browser hands to assistive technology is a string of node labels with no arrows | Tested on this site (the browser's accessibility tree, not actual screen-reader speech) |
| How well UDL works | The meta-analysis I could read in full pooled g = 3.56; 10 of its 13 studies were single-group pre/post designs, and the estimate for the studies with a control group was 0.69, not distinguishable from 0 ([Almeqdad et al. 2023](https://doi.org/10.1080/2331186X.2023.2218191)) | One meta-analysis; I didn't read the critics' original papers |

## Who "can't read it"

WCAG (Web Content Accessibility Guidelines) is the web accessibility standard published by W3C. The current version is [2.2](https://www.w3.org/TR/WCAG22/), republished in December 2024. Its success criteria come in three levels, A, AA, and AAA, and the levels are cumulative: conforming to AA requires meeting every Level A criterion first.

Before asking who can't read an article, keep one sentence from WCAG itself in mind. Its introduction says that reaching the highest level, AAA, doesn't mean everyone can read the content:

> "even content that conforms at the highest level (AAA) will not be accessible to individuals with all types, degrees, or combinations of disability, particularly in the cognitive, language, and learning areas."

Another passage of the introduction says the criteria for cognitive, language, and learning disabilities are limited, because of a short timeline and difficulty reaching consensus on testability. W3C published a separate document, [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/), to fill that gap (I didn't read it). So "conforms to WCAG" can't be written as "everyone can read it."

W3C's [tutorial on complex images](https://www.w3.org/WAI/tutorials/images/complex/) draws the audience more widely. It says complex images are hard for many people to understand, especially people with low vision, learning disabilities, or limited subject-matter experience, and suggests making long descriptions available to everyone, for example by putting them in the main text. That last group is the main audience of a teaching article.

## What WCAG requires of a technical article

WCAG has no subset "for teaching content." I picked the criteria in this table by the components a teaching article usually has. Levels are as in the original. By WCAG's own account, the notes under the criteria are not requirements, so anything marked "note" below can't be stated as "WCAG requires."

| Part of the article | Relevant criteria (level) | What it asks for |
|---|---|---|
| Images, diagrams, charts | 1.1.1 Non-text Content (A) | A text alternative that serves the same purpose. The glossary's example is a chart described in the paragraph after it, so the alternative doesn't have to sit in an attribute of the image |
| Lines and markers in charts | 1.4.11 Non-text Contrast (AA) | Parts of graphics needed to understand the content need at least 3:1 against adjacent colors |
| Color-coded categories | 1.4.1 Use of Color (A) | Color can't be the only way information is conveyed |
| Instructions like "see the red box on the right" | 1.3.3 Sensory Characteristics (A) | Instructions can't rely only on shape, color, size, or position |
| Colors of text and code | 1.4.3 Contrast (Minimum) (AA) | At least 4.5:1 for normal text, 3:1 for large text |
| Headings, lists, tables | 1.3.1 Info and Relationships (A), 2.4.6 Headings and Labels (AA) | Structure must use real markup, not just look like it; headings that exist must describe the topic |
| Images of text | 1.4.5 Images of Text (AA) | Use real text when you can, not a picture of it |
| Zoom and narrow screens | 1.4.4 Resize Text (AA), 1.4.10 Reflow (AA) | Zooming to 200% loses no content; at a width of 320 CSS pixels, no scrolling in two directions. The criterion exempts content that needs a two-dimensional layout for meaning. The note gives diagrams, video, and data tables as examples **but not code blocks**, and the text doesn't say whether code is exempt |
| Prerecorded video | 1.2.2 Captions (A), 1.2.3 (A), 1.2.5 (AA) | Captions, including sound effects and speaker identification; AA also requires audio description |
| Passages in another language | 3.1.2 Language of Parts (AA) | Passages and phrases in another language must be marked; proper names, technical terms, and words that have become part of the surrounding language are exempt |
| Exercises and feedback | 3.3.4 (AA), 4.1.3 Status Messages (AA) | Pages that submit test responses must allow checking or reversal; messages like "correct!" must be announced without taking focus |
| Difficult text | 3.1.5 Reading Level (AAA) | When text goes beyond lower secondary level, provide supplemental content or a simpler version |

Two of these are easy to overstate. First, 3.1.5 is Level AAA, and WCAG itself doesn't recommend requiring AAA as a policy for whole sites. What it asks for is supplemental content provided separately, not that the main text be written at a lower secondary level. One of its examples of supplemental content is a paragraph summarizing the main results and recommendations of a research study. Second, the complex-images tutorial says a long description is "required," but that page describes itself as best-practice guidance and doesn't cite any success criterion. Writing "WCAG requires a long description for complex images" is wrong; WCAG itself goes only as far as 1.1.1's "text alternative that serves the equivalent purpose."

## How screen-reader users read a page

[WebAIM's tenth survey of screen-reader users](https://webaim.org/projects/screenreadersurvey10/) asked what people are most likely to do first when looking for information on a long page. Of the 1,511 who answered, 71.6% chose "Navigate through the headings on the page," and very few read from the top (the full breakdown is in the appendix).

The number leans toward proficient users: 78% of self-rated advanced users jump to headings first, against 47% of beginners, and more than half the respondents rated themselves advanced. This is a stated preference, not observed behavior; WebAIM itself says the sample was not controlled and may not represent all screen-reader users.

The same survey ranks the most problematic items, giving the order but no scores. The three that matter for writing are missing or improper alternative text on images (6th), missing or improper headings (8th), and complex data tables (10th).

The state of the web as a whole comes from a different source. [WebAIM Million 2026](https://webaim.org/projects/million/) ran an automated tool over the home pages of the top one million websites: 95.9% had detectable WCAG failures. The six most common categories account for 96% of all detected errors, and the most common, low-contrast text, appeared on 83.9% of home pages. This measures home pages of popular sites, not teaching articles, and automated tools catch only some problems, so it serves only as background.

A screen reader reads sequentially, one piece at a time. [Mealin and Murphy-Hill 2012](https://doi.org/10.1109/VLHCC.2012.6344485) interviewed 8 blind software developers. To explain why getting an overview of a codebase is hard, the authors note that screen readers work in a highly linear way, forcing users to read through the entire document. 7 of the 8 said they rely on API documentation for the overview. My inference for writers: a screen-reader user has to jump through headings to get what a sighted reader takes in at a glance, so the quality of the headings decides whether that reader can see the overview first.

## Charts: the main reason they can't be read is that no readable data is provided

The [2021 study by Ather Sharif and colleagues](https://doi.org/10.1145/3441852.3471202) has two parts.

In the first, 9 screen-reader users thought aloud while reading web pages with charts, picked from Google searches. On 33% of the 27 pages, the screen reader didn't detect the chart at all; when it did, it often announced only words like "graphic" or "object." Participants read charts by first looking for the overall trend, the maximum and minimum, and the axes, and only looked at individual data points if interested. One participant wanted a summary of the highest point, lowest point, average, and the direction of the trend.

The second was an online experiment: 36 screen-reader users and 36 comparison participants who don't use screen readers each looked at 3 charts and answered 9 four-option questions. The authors built the charts themselves, following WCAG 2.0 and the official accessibility recommendations of three charting libraries.

- Overall accuracy was 34% for the screen-reader group and 87% for the comparison group.
- Nearly all of the gap comes down to whether the chart provides the data. With Google Charts (which provides a data table by default), the screen-reader group answered 73% correctly; with D3, 17%; with ChartJS, 11%. The comparison group scored 86% to 89% on all three.
- The cost is time. The screen-reader group's average interaction time was 84.6 seconds, against 27.2 seconds for the comparison group; with Google Charts it was almost two minutes per chart, which the authors attribute to listening through the data table point by point.
- Question difficulty and the number of data points showed no detected difference in the screen-reader group's accuracy.

The authors recommend providing both: alternative text for the overview, and a data table for detail. A data table alone lacks the overview and makes readers hold a lot in memory.

### Which level a chart description should cover

[Alan Lundgard and Arvind Satyanarayan's 2021 paper](https://arxiv.org/abs/2110.04406) divides the content of chart descriptions into four levels:

1. Chart type, encodings, title, axis ranges, colors.
2. Statistical and relational: extremes, outliers, correlations, point-to-point comparisons.
3. Perceptual and cognitive: overall trends, patterns, exceptions.
4. Contextual and domain-specific: explanations, current events, social context.

They showed 15 charts to 30 blind readers and 90 sighted readers, each chart with four descriptions containing one level each, and asked readers to rank them by usefulness.

- Blind readers ranked levels 2 and 3 as most useful, with no difference detected between the two; levels 1 and 4 were ranked least useful.
- Level 1 is the only polarized level: most readers ranked it least useful, but blind readers also ranked it most useful 101 times. 40% of blind readers said the most useful description would combine several levels.
- 63% of blind readers stated firmly that descriptions should not contain the author's subjective interpretation. The original reads "descriptions should not contain an author's subjective interpretations, contextual information, or editorializing about the visualized data." Sighted readers, by contrast, preferred levels 3 and 4.

Three things to keep in mind. What was measured is a ranking of perceived usefulness, not how much readers understood afterwards. Each level had just one example passage assembled by the authors, so the level can't be separated from how well that passage was written. The abstract says the two groups' rankings "differ significantly," but the paper only runs tests within each group, with no test between groups; "the groups differ" means the two distributions look different, not a test result.

So "write levels 2 and 3" is a preference of blind readers. A more precise version is: don't stop at the chart type and axes; state the relationships between the numbers and the trend.

## Code and formulas

[The 2017 study by Khaled Albusays and colleagues](https://doi.org/10.1145/3132525.3132550) interviewed and remotely observed 28 totally blind developers, all men, each with at least 5 years of experience. The difficulties mentioned most were debugging (24 people), having to read line by line (23), indentation (22), and nested structures (20). The indentation problem is concrete: the screen reader reads three spaces as "space, space, space" rather than "three spaces." 5 people wrote their own scripts so the screen reader would announce the indentation level, and 4 switched to feeling it on a braille display.

This study is often summarized as "code structure is conveyed by indentation and color, which screen readers can't convey." The indentation half has data; the color half doesn't. Syntax highlighting is mentioned once in the introduction as a visual aid in IDEs, and the results contain no finding about color. Also, these developers were reading their own work code in an IDE, not a teaching article; carrying the indentation problem over to code blocks in articles is my inference.

On formulas there is even less. Of Mealin and Murphy-Hill's 8 interviewees, 2 said most math formulas on the web are images that a screen reader can't read. The same interviews asked about UML and similar diagrams. Only one of the 8 said outright that the UML diagrams he was given were inaccessible; two encountered them at work and avoided them; three never encountered them. One asked coworkers to describe a diagram's content aloud; another said the same information was usually in the documentation. One interviewee who led a team made its members explain diagrams in "simple English," on the grounds that diagrams of complicated systems carry so much information that some ambiguity of interpretation is always present.

For a tool that reads math expressions to visually impaired students, I read [Ali et al. 2024](https://doi.org/10.7717/peerj-cs.2599). It breaks an expression into terms, factors, constants, and variables, and lets the user step through them by voice with keyboard shortcuts. The paper says the tool improved learning, but there is no pretest or math test; the evidence is a self-made questionnaire, and its numbers are inconsistent across the paper. I treat it only as an example of "someone designed it this way," and don't cite its effectiveness numbers.

## Tests on this site

This section is what I measured on this site myself. Method: using the local build output, I opened three articles in Chromium ([CS50 AI week 0 guide](/posts/tech/2026-08-27-harvard-cs50ai-w00-search) (in Chinese), [the part on diagrams](/posts/learning/2026-10-13-diagrams-in-teaching-articles) (in Chinese), and [the validation lecture from Hsuan-Tien Lin's Machine Learning Foundations](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles) (in Chinese)), once in light mode and once in dark, read the browser's accessibility tree, ran axe-core 4.11's WCAG A/AA rules, and then shrank the window to 320 pixels wide. The accessibility tree is the data the browser hands to a screen reader, not what VoiceOver or NVDA actually speak; I didn't test actual speech.

### Mermaid diagrams

Across the site, 123 Chinese posts use mermaid, with 192 diagrams in total. Only 1 has an `accTitle`: the one the diagrams part uses as its own example.

The site renders mermaid into SVG in the browser. For a diagram without `accTitle`, the SVG is an unnamed "document," and its text is split into separate paragraphs. For the search flowchart in the CS50 AI week 0 guide, the accessibility tree reads, in order:

> <span lang="zh-TW">是、否、是、否、frontier 放進 initial state、frontier 是空的？、沒有解、拿出一個節點、是目標？、回傳解、加進 explored set 展開，把沒看過的鄰居放進 frontier</span>

(In English: yes, no, yes, no, put initial state in frontier, is frontier empty?, no solution, remove a node, is it the goal?, return the solution, add to explored set and expand, putting unseen neighbors into frontier.)

The branch labels "yes" and "no" come first, with no way to tell which decision they belong to, and the arrows are gone entirely. Someone who can't see the diagram gets a pile of words, not a process.

For the diagram that does have `accTitle` and `accDescr`, the SVG gets a name (<span lang="zh-TW">「Alpha-Beta 剪枝的中間分支」</span>, "the middle branch of alpha-beta pruning") and a description, but the node text inside is still split up the same way, and the edge label <span lang="zh-TW">「不必看」</span> ("no need to look") still comes first. So `accTitle` tells the reader what the diagram is and what it concludes; it doesn't make the diagram's structure readable. The structure still has to be written out in the description or the main text.

Also, a diagram inside a collapsed answer (`<details>`) is absent from the accessibility tree while collapsed and appears once it is opened. That is expected behavior.

### Code blocks

- **Comment contrast is too low.** The code theme is github-dark in both light and dark modes. The comment color #6a737d on the background #24292e has a contrast of 3.04:1, below the 4.5:1 that 1.4.3 requires. axe flagged 18 instances in the CS50 AI week 0 guide alone.
- **The keyboard can't scroll them.** At a window width of 320 pixels, all 21 code blocks in week 0 need horizontal scrolling. The keyboard can focus the outer `<pre>`, but the element that scrolls is the `<code>` inside it, so the arrow keys do nothing while focus sits on the `<pre>`. axe files this under 2.1.1 Keyboard. WCAG doesn't say whether code is exempt under 1.4.10, which allows two-direction scrolling; even if it is, keyboard users still need to be able to scroll.

### Tables

Header cells use real `<th>` elements. On narrow screens, tables are wrapped in a horizontally scrollable container, and this container can't receive keyboard focus either: at 320 pixels wide, 7 of week 0's 8 tables need scrolling, and 15 of the 17 in the Machine Learning Foundations article. The note to 1.4.10 gives data tables as an example of content that may scroll in two directions; not being able to scroll by keyboard is a separate problem.

### Formulas

The site's KaTeX outputs both the visible layout and MathML, with the visible version hidden from assistive technology. All 768 formulas in the Machine Learning Foundations article have MathML, so assistive technology gets the structure of the formula, not a picture. At 320 pixels wide, 17 of the 27 display formulas need horizontal scrolling. The note to 1.4.10 gives no example involving formulas, and WCAG doesn't say whether formulas count as content that requires "two-dimensional layout for usage or meaning."

### Video and other items

- The YouTube `<iframe>` has a title, which comes from the `title` field of the article's `youtube` block. The three issues axe flagged inside the player belong to YouTube's own player, which this site can't change.
- Captions: an embed block can take a `captions` field that asks the player to turn on captions in a given language by default. Across Chinese and English posts there are 1,312 embeds, and 80 set it. Whether a caption track exists depends on the uploader, not this site.
- Week 0 has 6 checkboxes (from Markdown task lists) with no labels; axe files these under 4.1.2.
- The page language is correctly set to `zh-TW`, but the English quotations and phrases in articles aren't marked with a language; 3.1.2 requires passages and phrases in another language to be marked, except proper names and technical terms.
- The site currently uses no Markdown image syntax at all, so the alternative-text problem shows up only in mermaid.
- The repo's axe tests cover only the admin console; article pages aren't tested.

## How much evidence there is for UDL

UDL is a framework for designing instruction promoted by CAST, a US nonprofit. Its [Guidelines version 3.0](https://udlguidelines.cast.org/), released in July 2024, have three principles (engagement, representation, and action and expression), nine guidelines, and 36 considerations. Considerations directly relevant to instructional text include "Clarify vocabulary, symbols, and language structures," "Support decoding of text, mathematical notation, and symbols," and "Highlight and explore patterns, critical features, big ideas, and relationships." The core claim of the representation page is that no single means of representation is optimal for every learner, so options should be provided.

### What CAST says about its evidence

CAST's [Research Evidence page](https://udlguidelines.cast.org/more/research-evidence/) has two often-quoted sentences:

- "UDL is based upon the most widely replicated finding in educational research: learners are highly variable."
- "The research basis for the general principles of UDL is grounded in modern neuroscience."

The second sentence covers only the three principles: CAST divides the learning brain into three networks, affective, recognition, and strategic, which map onto the three principles. The same page also says the guidelines themselves originally drew on cognitive and educational psychology, mostly quantitative research focused on K-12, and that 3.0 added disability studies and sociocultural perspectives. So "CAST says UDL is grounded in neuroscience" stretches the claim.

The home page says there is evidence UDL benefits all learners, but none of the four pages I read lists any outcome studies. The lists of individual studies are on each consideration's subpage, and I didn't read those. Causal claims such as the representation page's "Learning, and transfer of learning, occurs when multiple representations and perspectives are used" also come with no studies attached on the page.

### A meta-analysis I could read in full

[Qais Almeqdad and colleagues' 2023 meta-analysis](https://doi.org/10.1080/2331186X.2023.2218191) included 13 studies from 2015 to 2021 and pooled g = 3.56, a figure that mixes two kinds of design across all 13 studies. Ten of the 13 were single-group studies that used the pretest standard deviation as the denominator; their own pooled estimate is 4.42, which roughly means posttest scores were a little over four pretest standard deviations above pretest. Its own tables show where the number comes from:

- 10 of the 13 studies are single-group pre/post designs with no control group, where the effect size is "posttest minus pretest, divided by the pretest standard deviation."
- The pooled estimate for single-group studies is 4.42; for the studies with a control group it is 0.69, not distinguishable from 0.
- Individual effect sizes range from 0.33 to 13.18, with I² = 99.8%.
- 8 of the 13 studies were about teachers; in those studies the outcomes were mostly teachers' UDL knowledge or lesson plans, not students' learning (the second half is my reading of its list of studies; the authors didn't tabulate it).

The authors' explanation of why single-group studies came out larger is "This is perhaps due to the nature of such design, which minimises the standardised errors," and they still recommend adopting UDL. "The effect size is inflated by the study designs" is my reading of its tables, not something the authors concede.

### An implementation study

[Pu Guo and Zeyu Wang's 2025 study](https://doi.org/10.1038/s41598-025-30079-1) followed 87 institutions for two years and reports that student achievement at high-implementation institutions rose 37.4% above their own baseline. It has no control group that didn't implement UDL. The score used to sort institutions by implementation level itself includes student achievement, engagement, and belonging. The methods section lists hierarchical models and propensity score matching, but the results report no coefficients, confidence intervals, or group sizes. The study location isn't disclosed. Many citations in the introduction don't match the reference list, and the reference list contains entries unrelated to UDL (for example, wireless networks for federated learning, and aircraft safety) cited as sources for UDL. All of these are facts anyone can check in the paper; as of 2026-10-14, Crossref shows no correction or retraction for it. It isn't suitable as evidence that UDL works.

### Critiques and another meta-analysis that I only know exist

At least two critiques have been published: Boysen's [critical analysis](https://doi.org/10.1177/14782103241255428) of the research evidence behind CAST's guidelines, and [another paper](https://doi.org/10.1037/stl0000280) by the same author comparing learning styles and UDL. There is also King-Sears and colleagues' 2023 [meta-analysis of the achievement of learners receiving UDL instruction](https://doi.org/10.1016/j.tate.2022.103956), which is not a critique. These three papers exist; I couldn't read a legally available full text, so I don't report their conclusions or numbers. Several blog posts summarize them, but since I can't read what they summarize, I haven't used them in place of the originals.

So this section reads only one side: CAST's own account, a meta-analysis whose designs can't support its large effect size, and an implementation study without a control group. Neither "UDL works" nor "UDL doesn't work" is a conclusion this material can support. What can be said is that the supporting evidence I could read in full has study designs that can't support the effect sizes reported.

## Where the sources disagree

**Should chart descriptions include interpretation?** Most of Lundgard and Satyanarayan's blind readers didn't want the author's subjective interpretation, while sighted readers preferred levels 3 and 4; no test was run between the groups. W3C's complex-images tutorial, on the other hand, recommends that the main text actively summarize what the image is meant to show, with the example "The following graph shows that visitors were lost in the first quarter, but the numbers recovered in the second quarter." That is a level 3 trend, not level 4 interpretation. A reading under which the two don't conflict is: state the trend, not commentary. That reading is mine.

**Is the data table a fix or a burden?** In Sharif and colleagues' experiment, charts with data tables raised the screen-reader group's accuracy to 73%, against 11% with ChartJS and 17% with D3; participants in the same study also said listening through a table point by point was tedious, and the authors say tables lack an overview and add memory load. These are two sides of the same thing, and the authors recommend giving both the overview and the table.

**Is a long description "required"?** W3C's complex-images tutorial uses the word "required," while the WCAG text goes only as far as 1.1.1's "text alternative that serves the equivalent purpose," with no requirement to split it into short and long descriptions.

**How strong the evidence for UDL is.** CAST's home page says there is evidence UDL benefits all learners; Almeqdad and colleagues' pooled g = 3.56 points the same way, but its estimate for studies with a control group isn't distinguishable from 0. Guo and Wang cite Almeqdad and colleagues as confirming that UDL works, and elsewhere say it reported positive effects of gamification; Almeqdad and colleagues' paper doesn't discuss gamification.

## What you can do

Each item notes its basis; where no study tested it directly, it is my judgment.

1. **Give every mermaid diagram an `accTitle` and `accDescr`, with the description stating the conclusion and relationships, not reciting every node.** Basis: WCAG 1.1.1 (normative); the tests on this site (diagrams without it are reduced to scattered node labels); Lundgard's levels 2 and 3 (blind readers' preference). Example for the search flowchart: `accDescr: Start from the initial state. Each round, remove one node from the frontier; if it is the goal, return it, otherwise expand it and add unseen neighbors to the frontier. If the frontier is empty, there is no solution.`
2. **Put the diagram's conclusion in the sentence right before or after it.** Basis: W3C's complex-images tutorial (best practice, with an audience that includes readers new to the subject). That sentence also helps readers who can see the diagram; see the point on placing text near figures in [the part on diagrams](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en).
3. **When you include a data chart, give a one-sentence trend and a data table with it.** Basis: Sharif and colleagues' experiment and design recommendations. This site uses many tables and few data charts, so this is a rule for the future.
4. **For deeply nested code, state its structure in one sentence in the text**, for example "the outer loop runs over each row, with two levels of if inside." The basis is the indentation and nesting difficulties in Albusays and colleagues' study; carrying them over to articles is my inference, and no study has tested it.
5. **Keep using KaTeX for formulas; don't paste screenshots of formulas.** Basis: WCAG 1.4.5 and Mealin's two interviewees. This site already does this.
6. **Write headings as topics a reader can jump to.** Basis: the 71.6% in WebAIM's survey (self-report) and WCAG 2.4.6.
7. **Mark the language of quotations and non-technical phrases in another language.** In Markdown you can wrap them in `<span lang="en">…</span>` (or `<span lang="zh-TW">…</span>` for Chinese quoted in an English article, as this version does); terms and proper names aren't wrapped. Basis: WCAG 3.1.2.

Changes that would need the site's templates I only list here and haven't made: switch to a code theme whose comments reach 4.5:1 contrast; make the scrolling containers for tables and code keyboard-focusable; add labels to task-list checkboxes; add article pages to the axe tests.

### Against this site's writing spec

- The mermaid section of the writing guide requires that meaning not rely on color, using line styles, outer frames, and text instead. That matches WCAG 1.4.1, but the spec's reason is that every node on the site has the same color, not accessibility; the rule is the spec's own choice that happens to satisfy 1.4.1.
- The same section asks for short node labels and `flowchart TB`, because of phone width. That is about readability, not screen readers.
- The spec doesn't require `accTitle` or `accDescr`. The diagrams part recommended them, but they were never written into the spec, which is why only 1 of 192 diagrams has one. This is a gap in the spec.
- The `title` of a YouTube block is a required field, and the spec says it is the iframe's accessible name; the test confirms it is there.
- The course-guide spec says to transcribe a video yourself when it has no caption track, but that is for writing the article, not for giving readers captions; the article itself isn't a caption alternative for the video.

## Limits of this evidence

- **No study has measured how much readers with disabilities learn from a teaching article.** Sharif measured accuracy on chart questions; Lundgard measured perceived usefulness; the two developer studies are interviews. Applying them to writing articles is my inference.
- **Small samples, skewed toward certain people.** Sharif had 72 people, online and unsupervised; Lundgard's 30 blind readers were recruited through the authors' contacts and Twitter; Albusays's 28 were all men; Mealin's 8 were all men. WebAIM's survey is a volunteer sample, mostly proficient users.
- **A narrow range of disabilities.** The studies are almost entirely about blind or low-vision readers. These sources have no data on deaf readers, readers with cognitive or learning disabilities, or readers with motor disabilities; WCAG itself says its coverage of cognitive and learning disabilities is insufficient.
- **The tests on this site covered three articles and the browser's accessibility tree.** I didn't listen with an actual screen reader or have readers with disabilities read the articles. Automated tools like axe catch only some problems.
- **On UDL I read only one side.** I only know that three papers exist: Boysen's two critiques and King-Sears and colleagues' meta-analysis.
- **Six points are my inferences**: that screen-reader users get the overview from headings; that the indentation difficulty carries over to code blocks in articles; that stating the trend without commentary satisfies both Lundgard and W3C; that a one-sentence statement of nested code structure helps; that Almeqdad's large effect size comes from the study designs; and that `accTitle` doesn't make a diagram's structure readable (an observation of the accessibility tree; actual speech wasn't tested).
- **Known to exist, but no legally available full text read**: [Boysen (2024), critical analysis](https://doi.org/10.1177/14782103241255428); [Boysen (2024), learning styles and UDL](https://doi.org/10.1037/stl0000280); [King-Sears et al. (2023), meta-analysis of the achievement of learners receiving UDL instruction](https://doi.org/10.1016/j.tate.2022.103956).

## Appendix: study designs and numbers

**W3C, WCAG 2.2 (republished 2024-12-12).** 4 principles, 13 guidelines; 31 Level A, 24 Level AA, and 31 Level AAA success criteria (4.1.1 removed). Notes, examples, and appendices under the criteria are not normative. Conformance applies only to complete web pages, with no part of a page excluded; conformance claims are not required. An article that allows comments can make a statement of partial conformance. 2.5.8 Target Size (Minimum) (AA, new in 2.2) requires pointer targets of at least 24×24 CSS pixels, with inline links exempt. 1.4.8 (AAA) suggests lines of no more than 80 characters, 40 for CJK.

**W3C WAI, Images Tutorial: Complex Images (updated 2026-04-08).** Best-practice guidance, not normative. Complex images include graphs and charts, flowcharts, organizational charts, diagrams that the page text relies on readers understanding, and maps. It recommends a two-part text alternative: a short description that identifies the image and says where the long description is, and a long description that is a text version of the image's essential information. Four markup approaches: a link next to the image; stating the location of the long description in the alt text; wrapping the long description in `<figure>` and `<figcaption>`; and `aria-describedby`. The last treats the long description as one continuous paragraph, losing structure such as headings and tables, so it suits only text-only descriptions.

**WebAIM, Screen Reader User Survey #10 (updated 2024-02-22).** December 2023 to January 2024, 1,539 valid responses. The most problematic item is CAPTCHA. 88.8% find heading levels very or somewhat useful. North America 47.2%, Europe 30.7%, Asia 6.4%. 89.9% use a screen reader because of a disability; disability types: blind 76.6%, low vision 19.9%, deaf or hard of hearing 6.8%, cognitive or learning 5.2% (multiple answers allowed). Self-rated proficiency: advanced 58.3%, intermediate 36.0%, beginner 5.7%. First action on a long page: headings 1,082 (71.6%), find 205, read from the top 96, links 72, landmarks 56. 31.7% say they always or often use landmarks when present, but only 3.7% use them first. 91.3% use a screen reader on a mobile device. Improving web accessibility depends on better websites (85.9%) versus better assistive technology (14.1%).

**WebAIM, The WebAIM Million 2026 (updated 2026-03-30).** In February 2026, home pages of the top one million sites in the Tranco ranking were analyzed with WAVE on the rendered page. An average of 56.1 detected errors per page, 10.1% more than in 2025. Share of home pages with the six common failures: low-contrast text 83.9%, missing image alternative text 53.1%, missing form labels 51%, empty links 46.3%, empty buttons 30.6%, missing document language 13.5%. 41.8% of home pages skip heading levels. Only 19% of data tables have valid data table markup. WebAIM says the rate of full A/AA conformance was "certainly lower than 4.1%," and that automated detection catches only some problems.

**Sharif, Chintalapati, Wobbrock, Reinecke (2021)**, ASSETS '21. Study 1: 9 screen-reader users (mean age 50.2; 7 lost their sight gradually), think-aloud sessions over Zoom in August 2020, 3 web pages each, thematic analysis. Study 2: 36 in the screen-reader group and 36 in the comparison group (the comparison group's vision status isn't reported), online and unsupervised; 27 Kaggle datasets, three chart types, three libraries, three levels of complexity and three of difficulty. Accuracy 34% (109/324) vs 87% (283/324), χ²(1) = 67.22, p < .001; the abstract's "61.48% less accurately" is a relative difference, and the absolute gap is about 53 percentage points. Library × group interaction χ²(2) = 50.35, p < .001. Difficulty on accuracy χ²(2) = 0.35, p = .838; complexity p = .380; no difference detected for either. Time 84.6 s (SD 75.2) vs 27.2 s (SD 16.8), F(1,69) = 115.33, ηp² = 0.63; the two groups' timing was defined differently. Participants over 50 had about 12% longer interaction times. Limitations the authors list: only three libraries and two-dimensional data.

**Lundgard and Satyanarayan (2021)**, IEEE TVCG; I read the arXiv author version. Corpus: 50 charts; 120 Prolific participants wrote 582 descriptions, 2,147 sentences, distributed as level 1 9.1%, level 2 35.1%, level 3 42.9%, level 4 12.9% (participants were given level 1 prompt sentences). Ranking experiment: 15 charts, four single-level descriptions each, in random order and unlabeled; 30 blind readers ranked all 15 charts, 90 sighted readers ranked 5 each, so each chart was ranked by 30 people per group. Friedman tests p < 0.001 for both groups. Blind group: level 2 vs 3 p < 0.148, level 1 vs 4 p < 0.321, no difference detected for either; sighted group: level 3 vs 4 p < 0.059. All blind readers had encountered inaccessible charts, 53% in educational materials. "Providing textual descriptions of data visualizations is important to me": blind readers' mean 6.83 (7-point scale). Covers only English and common chart types; no separate limitations section.

**Albusays, Ludi, Huenerfauth (2017)**, ASSETS '17. 28 totally blind developers, aged 22–52, with 5–24 years of experience, 22 in the US; remote interviews of about an hour in 2016, plus demonstrations using their own and others' code. Number who mentioned each difficulty: debugging 24, line by line 23, indentation 22, nesting 20, backtracking 18, finding errors 14, scope 14, characters and brackets 10. 19 relied on print debugging; 26 relied on simple editors to write code; 16 used comments as bookmarks and deleted them before sharing. Inter-rater reliability 67%. The introduction says participants preferred IDEs; the results say all preferred simple editors, which is inconsistent.

**Mealin and Murphy-Hill (2012)**, VL/HCC; I read the published version from the authors' research group website. 8 legally blind male developers with 10–40 years of programming experience, 3 with no vision at all; recruited through a single mailing list, interviewed over Skype; the paper doesn't describe its analysis procedure. 7 mainly use JAWS; 4 use a braille display when reading code, and one said a screen reader makes "EF" and "EFF" sound the same. 7 regularly keep a scratch window open to note method or variable names; 5 copy a block of code into another window, edit it, and paste it back.

**Ali, Khusro, Alahmadi (2024)**, PeerJ Computer Science. Government institutes for the blind in three places in Khyber Pakhtunkhwa, Pakistan (Peshawar, Abbottabad, Swat); 15 teachers and 94 students in grades 6 to 10, purposive sampling, questionnaires after 15 days of use. Supports only linear and quadratic expressions. Compared with NVDA and Access8Math, but the comparison design isn't described. No pretest and no math test. The student questionnaire's Cronbach's α is given as 0.81 and then 0.91 in the same paragraph; the share finding it easy to use is given as 86.7% in one place and 91.43% in another. The ANOVA compares mean differences among the seven items of the same questionnaire, which says nothing about whether the tool works (my reading).

**CAST, UDL Guidelines 3.0 (released 2024-07-30).** I read the home page, Research Evidence, About the Guidelines 3.0 Update, and Representation. First released in 2008, with four revisions since. A side-by-side comparison of versions 2.2 and 3.0 isn't public and must be requested through a form. Themes of 3.0 include treating learners' multiple identities as part of variability, acknowledging systemic barriers, and shifting to learner-centered language.

**Almeqdad, Alodat, Alquraan, Mohaidat, Al-Makhzoomy (2023)**, Cogent Education 10. English and Arabic literature from 2015–2021, with pre/post designs among the inclusion criteria; 304 papers after full-text screening, narrowed to 13 with experimental designs. No study quality assessment. Locations: 8 in the US (the discussion says 9), 2 in Saudi Arabia. The text gives a total of 771 participants with a range of 7–254, but the largest study in its list has 143. Pooled g = 3.56 (95% CI 1.03–6.08), τ² = 20.17, Q = 343.8. Subgroup estimates (each tested against 0, with no test between subgroups): single-group 4.42 (p = .0016), two-group 0.69 (p = .78); students 5.63, teachers 2.76 (p = .053); intervention 4.59, training 2.78 (p = .10). The authors judged a gap in the funnel plot as publication bias and made no correction. Limitations the authors list: wide variation in age and region, possible publication bias, a sample too small for a definitive conclusion, and no analysis of intervention length.

**Guo and Wang (2025)**, Scientific Reports 15. 87 institutions, 2,473 students, and 342 teachers, mostly K-12, measured every 6 months, 5 times in all. Implementation in four levels: exemplary 18%, high 23%, moderate 31%, low 28%. Achievement gains over baseline: low 6.8%, moderate 18.2%, high 37.4% (the figure also shows exemplary at 45.5%). Students with disabilities gained 42.3% at high-implementation institutions and 12.1% at low. The paper has no tables, and every number is a point estimate. Limitations the authors list: self-selected institutions, partial reliance on self-report, 24 months may be too short to see long-term sustainability, and possible unmeasured confounders.

## References

I read each one in full, in the version I obtained, and kept an extraction record; versions and unread parts are noted in parentheses.

- [W3C (2024), Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) (W3C Recommendation, 2024-12-12 version).
- [W3C WAI, Images Tutorial: Complex Images](https://www.w3.org/WAI/tutorials/images/complex/) (web page updated 2026-04-08; the separate page with the example long description was not read).
- [WebAIM, The WebAIM Million: The 2026 report on the accessibility of the top 1,000,000 home pages](https://webaim.org/projects/million/) (web page updated 2026-03-30).
- [WebAIM, Screen Reader User Survey #10 Results](https://webaim.org/projects/screenreadersurvey10/) (web page updated 2024-02-22; the weighted scores for problematic items appear only in a chart and were not read).
- [Sharif, Chintalapati, Wobbrock & Reinecke (2021), Understanding Screen-Reader Users' Experiences with Online Data Visualizations](https://doi.org/10.1145/3441852.3471202) (read the [final version in ACM layout](https://wildlab.cs.washington.edu/Publications_files/Sharif_ASSETS2021.pdf) on co-author Reinecke's lab website).
- [Lundgard & Satyanarayan (2021), Accessible Visualization via Natural Language Descriptions: A Four-Level Model of Semantic Content](https://doi.org/10.1109/TVCG.2021.3114770) (read the [arXiv author version](https://arxiv.org/abs/2110.04406); the published corpus was not examined).
- [Albusays, Ludi & Huenerfauth (2017), Interviews and Observation of Blind Software Developers at Work to Understand Code Navigation Challenges](https://doi.org/10.1145/3132525.3132550) (read the final version in ACM layout from [RIT's faculty scholarship repository](https://www.rit.edu/academicaffairs/facultyscholarship/submit/download_file.php?id=37018); supplementary materials not read).
- [Mealin & Murphy-Hill (2012), An Exploratory Study of Blind Software Developers](https://doi.org/10.1109/VLHCC.2012.6344485) (the [published version](https://ciigar.csc.ncsu.edu/files/bib/Mealin2012-BlindDevelopers.pdf) on the authors' research group website; that address is currently unreachable, so I read the [Wayback copy from 2024-08-28](http://web.archive.org/web/20240828121853id_/https://ciigar.csc.ncsu.edu/files/bib/Mealin2012-BlindDevelopers.pdf)).
- [Ali, Khusro & Alahmadi (2024), Accessible interactive learning of mathematical expressions for school students with visual disabilities](https://doi.org/10.7717/peerj-cs.2599) ([published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11784810/); figures and supplementary materials not examined).
- [CAST (2024), Universal Design for Learning Guidelines version 3.0](https://udlguidelines.cast.org/): home page, [Research Evidence](https://udlguidelines.cast.org/more/research-evidence/), [About the Guidelines 3.0 Update](https://udlguidelines.cast.org/more/about-guidelines-3-0/), [Representation](https://udlguidelines.cast.org/representation/) (the research subpages for each consideration were not read).
- [Almeqdad, Alodat, Alquraan, Mohaidat & Al-Makhzoomy (2023), The effectiveness of universal design for learning: A systematic review of the literature and meta-analysis](https://doi.org/10.1080/2331186X.2023.2218191) (publisher's open-access version; tables from a conversion of the publisher's PDF).
- [Guo & Wang (2025), Implementation fidelity of universal design for learning and effects on student achievement engagement and belonging](https://doi.org/10.1038/s41598-025-30079-1) ([published version on PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12749016/); 4 of 16 figures examined).
- On this site: [When a teaching article needs a diagram](/posts/learning/2026-10-13-diagrams-in-teaching-articles-en), [Pairing a teaching article with video](/posts/learning/2026-10-13-instructional-video-in-articles-en), [How far to take code in a teaching article](/posts/learning/2026-10-14-code-in-teaching-articles-en), [Terms, symbols, and formulas in teaching articles](/posts/learning/2026-10-14-notation-jargon-terminology-en), [Harvard CS50 AI week 0 guide](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en), [Hsuan-Tien Lin's Machine Learning Foundations: validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en).
