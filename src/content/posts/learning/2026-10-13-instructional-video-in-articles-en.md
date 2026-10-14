---
title: "Pairing a Teaching Article with Video: Placement, Timestamp Links, Length, and Self-Checks"
date: 2026-10-13
category: learning
type: deep-dive
tags: [learning-science, youtube, retrieval-practice, self-learning, blog, ux]
lang: en
description: "Practices and evidence for embedding video in a teaching article: NN/g's observations on video placement, edX viewing-log analyses, Video Digests, experiments on prequestions and writing explanations during pauses, and how six course sites place their videos, with this site's 440 video-embedding articles as the case study."
tldr: "Put a video at the top if it covers the whole article, at the start of a section if it covers only that section; videos at the bottom often get skipped. Readers mostly rewatch specific segments, so every section should link to its timestamp and the intro should state the video's length. Prequestions and writing your own explanation after each segment have experimental support, but those experiments all used short material, a little over 20 minutes at most."
series:
  name: "Writing Articles That Teach"
  order: 5
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-13-instructional-video-in-articles)

This article answers two questions. When a teaching article comes with a video, where in the article should the video go? And how should the article be written so that readers find "article plus video" more useful than either one alone?

The questions came from this site's course guides. 440 Chinese-language articles here embed a YouTube video (the count covers every Chinese article on the site that embeds one, not only course series), and nearly all of them are lecture-by-lecture guides to open university courses: I read the transcript and the lecture notes, turn a one-to-two-hour lecture into one article, and attach the original recording. While tidying up, I noticed that the same kind of article put the video in three different places: at the top, at the very end, or one video under each section. So I went back to the research on placement, the logs of how students actually watch lecture recordings, and a handful of controlled learning experiments.

Here is my overall judgment after reading this material; no study directly measured how readers feel about "article plus video." I think readers find the pairing helpful when two things hold: they can get the content from the article without watching the whole video, and when they get stuck, they can jump straight to the matching part of the video. Placement, timestamp links, stating the length, and how self-checks are arranged all serve those two things.

## The short version: place the video by its role

| Role of the video | Where it goes | Basis |
|---|---|---|
| The article was written from this video, one article per video | The intro, before the first section | [NN/g](https://www.nngroup.com/articles/instructional-video-guidelines/): videos at the top are the most discoverable, but readers expect them to cover the whole page |
| One article, several short videos, each matching a section | The start of each section | NN/g: a video about one section goes at the top of that section |
| Related supplementary material, not the video the article is based on | The end, with one sentence and an anchor link in the intro | My inference: at the top it would make readers assume it covers the whole article |

Beyond placement, three things are the easiest to do. Their support varies in strength, so each item names its main sources:

1. Label every section with its time range in the video, and make that label a link that jumps there. The basis is the Video Digests browsing experiment, NN/g's recommendation, and surveys showing students mostly rewatch specific segments.
2. State the video's length in the intro, along with how the video relates to the article (the article covers all of it, part of it, or the video is only supplementary). The only source is NN/g.
3. Move self-check questions to the end of each section, at least one per section, and have readers write their own answer before moving on. The basis is two sets of experiments that used short material.

The sections below explain where these recommendations come from. The last section of the main text covers what this evidence cannot tell you, followed by an appendix and the references.

## The situation on this site: how three placements came about

On 2026-10-13 I counted twice. The population is every Chinese article on the site that embeds a video, 440 in total and not limited to course series, classified by where its first player sits. The first count was in the morning, before any article had been changed along the lines of this piece. The second was that evening, after a few had been changed:

| Placement | Before (morning) | After (evening) | Representative series |
|---|---|---|---|
| The "Course video sources" block at the end | 380 | 373 | Most series, including CS231N, CS224R, CS221, MIT 6.5940 |
| The intro (before the first H2) | 20 | 20 | Stanford CS229 (18 articles) |
| One video under each H2 | 32 | 32 | NTU Hsuan-Tien Lin's Machine Learning Foundations and Techniques |
| Other sections | 8 | 15 | The 7 extra are Harvard CS50 AI, whose player moved to a "Lecture video and timeline" section right after the opening summary |

These articles were still being edited that day, so the numbers describe only those two moments.

The three placements coexist because the articles were written at different times. What follows describes the state before the writing rules were revised on 2026-10-13. On October 9, the writing guide gained a rule: embed the video where it is first mentioned. The next day, a batch job added video sources to the course articles, and the players went in at the end together with the "Course video sources" block. A day after that, a checker was added that requires this source block to come after the teaching content.

Each rule is reasonable on its own. Together they pinned the player to the end of most articles. The CS229 and Hsuan-Tien Lin series, rewritten from the recordings afterwards, followed the first rule, and that produced the other two placements.

Placement reflected the day an article was written. Nobody had ever decided that the original recording belongs at the end. Of the 380 articles at the end before the changes, 275 attach the lecture's own recording and 105 attach a previous year's or a related supplementary video, and both cases used the same position. That is why I went looking for outside evidence.

## Where the video goes: top of page, top of section, bottom of page

### NN/g's user research

In a [2020 article](https://www.nngroup.com/articles/instructional-video-guidelines/), Aurora Harley of Nielsen Norman Group describes a study in which 8 participants learned to do various things online while researchers watched how they used the instructional videos on each page. Tasks included telling ETFs from mutual funds, setting up a charcoal grill, folding a napkin, and orienting a map with a compass. Three findings concern placement.

Videos at the top of the page were the most discoverable and the most likely to be watched, but that position only suits a video that covers the whole page:

> When a video is presented at the top of the page, people assume that it is an alternative to reading the text and expect that all the written content on the page be addressed in the video (and vice versa).

A video specific to one section belongs at the top of that section, which tells readers it covers only that part.

Videos at the bottom of the page were often ignored. Some people never scrolled that far. Those who did either assumed a video placed so low was not very helpful, or had already read the text and saw no need to watch. The article adds that a video at the bottom is still better than no video, because readers who remain confused will come back for it. Videos in the right-hand column were likewise consistently overlooked; participants who noticed one later felt it had been hidden and placed to look like an ad.

### What a video platform reports

The video hosting company Wistia writes in a [2024 article](https://wistia.com/blog/how-to-increase-video-play-rate) that the farther down the page a video is, the lower its play rate, and that moving it to the top raises the rate. This is a vendor's rule of thumb. The article does not say what it is based on and gives no numbers, so it counts only as corroboration pointing the same way as NN/g. The same article notes that a supplemental video in a blog post will naturally get fewer plays, and that this is fine.

### How six course sites do it

I fetched one page from each of ten course sites and looked at where the video sits in the page structure (fetched 2026-10-13). This is a convenience sample of the course sites I could think of, with no systematic search. The table lists six of them. The four left out: the Khan Academy page came back with no content; and the pages from Google Machine Learning Crash Course, the CS231n course notes, and DeepLearning.AI's The Batch had no player in the fetched HTML, and I could not tell whether those pages have no video or load it on the client, so I did not count them.

| Site | Page examined | Video position |
|---|---|---|
| [Missing Semester](https://missing.csail.mit.edu/2020/shell-tools/) | Shell Tools and Scripting | The video is the first element under the title; all the notes follow |
| [MIT OCW](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-1-algorithms-and-computation/) | The video page for 6.006 Lecture 1 | A short description, the player, then the transcript and download links |
| [fast.ai](https://course.fast.ai/Lessons/lesson1.html) | Practical Deep Learning, Lesson 1 | One intro paragraph, then a "Video" section, then how to complete the lesson and resources |
| [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/4) | How do Transformers work? | Three short videos, each inside its own subsection |
| [3Blue1Brown](https://www.3blue1brown.com/lessons/neural-networks) | But what is a Neural Network? (text version) | Six short clips interleaved with the text of the sections. The full-length video appears only in the page's structured data, and I did not confirm in a browser how it is presented on the page |
| [CS50x](https://cs50.harvard.edu/x/notes/1/) | The Week 1 Notes page | No player on the notes page; the recording is on another page for the same week |

As far as I could measure, none of the six puts its main video at the end. The pages with one long video (Missing Semester, fast.ai, MIT OCW) put it at the top. Hugging Face's three short videos and 3Blue1Brown's short clips sit inside the matching sections, which lines up with NN/g's two recommendations. CS50 takes a different route and splits notes and video into two pages.

### Search and load speed

My judgment is that moving the video to the top is not enough, by itself, for Google to index a course guide's video as a video result. This is this article's reading of Google's definition; Google has not said anything about this kind of article specifically.

In a [December 2023 announcement](https://developers.google.com/search/blog/2023/12/video-is-the-main-content), Google says video search only shows pages where the video is the main content, and its example has three conditions: the video is above the fold, it is prominent, and the main purpose of the page is to watch that video. Position is one of the conditions Google itself lists. The same announcement lists "a blog post where the video is complementary to the text" as a page where the video is not the main content, and videos on such pages show up as not indexed in Search Console. Its [video search documentation](https://developers.google.com/search/docs/appearance/video) asks for a dedicated watch page per video. Moving a course guide's video to the top can meet the first two conditions, but the main purpose of the page is still to read the text.

Load speed is affected. [web.dev](https://web.dev/articles/embed-best-practices) notes that adding `loading="lazy"` to a YouTube iframe saves roughly 500 KB on the initial page load. This site's embeds already have that attribute, but lazy loading only applies while the iframe is far enough from the viewport, so a video moved to the top will load with the page. web.dev's other option is to show a static preview image and load the player only when the reader clicks.

## How readers actually use the video

Placement only decides whether readers see the video. To make the pairing useful, you first need to know what readers use the video for.

### Read first, watch when stuck

NN/g observed three behaviors: reading the text only, skimming the text and then watching, and watching right away. Even people who prefer text turn to the video when the content is unfamiliar, the process is long, or the text does not make sense. One participant put it this way:

> I like to read it first. When I got stuck on that one spot is when I went up to the video.

Hence NN/g's first guideline: present video as a supplement, never as the only way to get the information. Its [2014 article](https://www.nngroup.com/articles/video-usability/) gives the reason: video forces sequential access, and readers cannot scan it for the part they need the way they scan text.

### Students mostly rewatch specific segments

Arun Karnad at the London School of Economics reviewed research on lecture recordings in higher education in a [2013 literature review](https://researchonline.lse.ac.uk/id/eprint/50929/1/Karnad_Student_use_recorded_2013_author.pdf). One of its conclusions is that students tend to view specific sections of a recording to reinforce their understanding instead of watching the whole thing. The review cites a 2006 student survey by Soong and colleagues, in which the most common reason for using recordings was "I can watch selected parts of the lectures which I don't understand," at 34.5%.

The review also cites a finding from Leadbeater and colleagues (2013) that guide writers should keep in mind: among the heavy users who listened to entire lectures from start to finish, six out of seven were dyslexic or from a non-English-speaking background. For these readers the recording is a main channel for learning. Another of the review's conclusions points the same way: students with lower academic achievement use recordings more often and are more likely to watch a lecture in its entirety.

### Rewatching clusters at a few moments

Juho Kim and colleagues [analyzed in 2014](https://kgajos.seas.harvard.edu/papers/kim14video.pdf) second-by-second interaction logs for 862 videos in four edX courses. People who were rewatching dropped out partway far more often than first-time viewers. The authors read this as rewatchers having a specific goal: they watch the part they came for and leave.

They also sampled 80 videos and labeled where each interaction peak occurred. A peak is a moment where rewatching sessions or play events suddenly spike. The causes fell into five types: going back to the start of new material, returning to content they missed on screen, following along with a tutorial step, replaying a short segment, and listening again to a spoken explanation with no visual change. 61% of the peaks came with a visual transition before or after them, such as a slide switching to the instructor. The rest all belonged to the last type, which was also the largest of the five.

This has a direct implication for a text guide, and what follows is my inference. The moments readers go back for are exactly "the slide just changed and I didn't catch it" and "the stretch where the instructor explained it out loud." A guide written only from the transcript cannot see the screen, so it should say plainly where the video shows something the article does not reconstruct, and give the time, so readers know that spot is worth going back to.

### Long videos rarely get finished

Philip Guo and colleagues [used the same edX data in 2014](https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf) to measure watching time. However long the video, the median engagement time was at most 6 minutes, and students often made it less than halfway through videos longer than 9 minutes. Their advice to producers is to segment videos into chunks shorter than 6 minutes.

A guide writer cannot re-edit someone else's 80-minute classroom recording. What you can do is cut it up with timestamp links, which is where item 2 in the next section comes from.

## Making the guide useful: seven practices

### 1. The article has to stand on its own

The basis is NN/g's observation above: some readers simply do not watch videos, and some are somewhere they cannot play sound. The article should give the full content to someone who never presses play.

What to do: after writing, read the article from the top as if the player were not there. Every "as the video shows" or "the instructor draws a diagram here" needs a sentence saying what that diagram conveys.

### 2. Every section can jump to its place in the video

[Video Digests](http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf), presented at UIST in 2014 by Amy Pavel and colleagues, cuts a lecture video into chapters and sections, gives each section a short text summary, and plays the video from that point when the summary is clicked. They asked crowdworkers to browse a lecture video of about 15 minutes within a fixed time and then write a summary of its main points. With only 2 minutes, people using this format covered up to twice as many key topics as people using a standard player. With 8 minutes, the formats no longer differed significantly.

"One summary plus a timestamp link per section" is nearly the structure of a course guide, except that each section of the guide is longer. NN/g likewise recommends chapters or time markers on long videos so readers can watch only the part they need.

What to do: put the time range in the H2 or the first line of the section, and make it a link. Appending `&t=350s` to a YouTube URL starts playback at 5:50, for example `https://www.youtube.com/watch?v=cmNIMjPYdgM&t=350s`.

### 3. State the length up front, and how the video relates to the article

NN/g recommends showing a video's length before it plays, next to the title or above the video, and not only inside the player's progress bar. Readers use it to decide whether to press play. Combined with the expectation that a video at the top covers the whole page, this gives you the one sentence the intro needs.

What to do: write one line above the player, such as "The full recording runs about 78 minutes and this article covers all of it; if a section doesn't make sense, click the time link in its heading." When the video is only supplementary, write instead: "This is last year's recording and does not match this article exactly."

### 4. Ask questions before the video

In a [2017 experiment](https://664ef278-1723-43c6-bbe1-3bd4e65a87fe.filesusr.com/ugd/f4b9f1_ae7d99429920421594e4b037cfaa5f6a.pdf), Shana Carpenter and Alexander Toftness had undergraduates watch a short video on the history of Easter Island, split into three segments of a little over two minutes each. One group answered two questions about not-yet-seen content before each segment. The other group just watched. On a test right afterwards, the group that answered first scored 57% on average and the group that just watched scored 38%. The first group got almost every prequestion wrong beforehand, and they also remembered more of the content they had not been asked about.

Note that in the experiment each question came right before a short segment. The authors themselves point out that in a 90-minute class, the gap between a prequestion and the moment the content is covered may be long enough to weaken the effect. So putting the question at the start of each section is closer to the experiment's conditions than putting all of them in the intro of a 78-minute recording. That sentence is my inference.

What to do: turn at least one item in the intro's "after reading you should be able to do three things" into a concrete question, and put it at the start of the matching section. Using this site's [CS229 Lecture 2 guide](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en) as an example, "compute one step of gradient descent by hand" could become "Replace the 1/2 in front of the cost function with 25. Does the optimum change? Does gradient descent behave differently? Guess before you read on." I wrote this example myself and have not tested it.

### 5. Introduce the key terms first

The multimedia learning literature has a related principle called pre-training. Richard Mayer's [2021 review of design principles for instructional video](https://doi.org/10.1016/j.jarmac.2021.03.007) covers it; the review exists, but I could not find a full text made public by its author or publisher, so I do not cite its numbers or the experiments it cites.

There is also a meta-analysis that re-pools the studies Mayer authored, Cromley and Chen's [2025 analysis](https://doi.org/10.1016/j.edurev.2025.100730); the authors' manuscript is scheduled to become public in NSF PAR on 2026-11-01, and I have not read a legally available version, so I do not cite its numbers either.

So "introduce the key terms first" has no experimental support that I could read in a legal full text; it is my judgment that terms nobody has introduced will trip readers up while they watch.

What to do: in the prerequisites section, do not stop at "requires linear algebra." Take the three to five terms that will recur throughout the lecture, explain each in one sentence, and then begin.

### 6. After each segment, have readers do something themselves

In [two experiments in 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/), Karl Szpunar and colleagues had Harvard undergraduates watch a 21-minute statistics lecture recording split into four segments. One group answered a few questions on the segment they had just seen after every segment. The other group was tested only after the last one. On the fourth segment, the group tested every time answered 84% correctly and the other group 59%. The tested group also reported less mind wandering and took more notes.

The second experiment added a group that did not answer anything after each segment and just read the same questions together with their answers. The group tested every time did as well as in the first experiment. The group that only read the questions and answers came out close to the untested group on both mind wandering and the fourth segment, and on the final cumulative test the paper reports no difference between those two groups.

[Three experiments by Alyssa Lawson and Mayer in 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC7985227/) tested another kind of "doing something." Undergraduates studied a four-part animated lesson on greenhouse gases. After each part, the groups did different things: wrote their own explanation, read a provided explanation, or simply moved on. Two of the three experiments tested a week later, and in both of those the group that wrote its own explanation significantly outperformed the group that did nothing. The group that only read a provided explanation did not significantly outperform the do-nothing group either time.

Read side by side, the two papers point the same way: what works is producing the answer yourself, and reading a ready-made answer or explanation did not significantly beat doing nothing in either. This comparison is made by this article and is not a conclusion of either paper. It bears directly on course guides. When a self-check question is followed immediately by its answer, what the reader ends up doing may well be just "reading a provided explanation."

What to do: do not pile all the self-check questions at the end. Put one after each section and keep the integrative questions for the end. Collapsing the answer so readers write first and expand afterwards is something I derived from these two results. No study I read tested collapsing directly.

### 7. Segment long videos

Besides Guo's 6 minutes, there is a meta-analysis on segmenting: Günter Rey and colleagues' [2019 meta-analysis](https://maria-wirzberger.de/wp-content/uploads/2019/01/Rey2019_Article_AMeta-analysisOfTheSegmentingE.pdf) pools studies of multimedia instruction that was cut into small segments or paced by the learner (either one counted), with d = 0.32 on retention tests and 0.36 on transfer; segmented groups took longer to study, though that result shows significant publication bias. The materials were words with pictures or animation, not long videos cut shorter. Mayer's 2021 review also covers segmenting, but I could not read a legal full text. Cynthia Brame's [2016 guide to educational video](https://pmc.ncbi.nlm.nih.gov/articles/PMC5132380/), drawing on Guo and others, also recommends keeping each video to 6 minutes or less, and adds two more recommendations: provide guiding questions, and make the video part of a larger homework assignment.

What to do: for a course that already comes as several short videos (say four per lecture, a dozen minutes each), follow the second role and put one under each section. For a course with a single long recording, segment it with the timestamp links from item 2, and try to keep each section's time range to around ten minutes.

## Two articles from this site, side by side

**[CS229 Lecture 2](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en)** is the "article written from this recording" case, and it already does most of the seven:

- The video block is in the intro, before the first H2 (the position fits the first role).
- The video status line at the top says which year's recording and notes the article was written from, and that the transcript cannot show the slides or handwriting.
- The seven lecture H2s originally carried a time range in the heading, for example "The supervised learning setup (recording 05:50–10:40)."
- Near the end, a list of where the lecture differs from the notes covers the dataset, terminology, and the definition of SGD.

When I did this research, three things were missing. The time ranges were plain text and could not be clicked. The length was not stated up front: the last section was labeled up to 1:17:40, so readers had to work out for themselves that the recording runs close to 80 minutes. And the five self-check questions sat together at the end, each followed directly by its answer.

On 2026-10-13 I changed that article along the lines above. The time ranges moved to the first line of each section and link to the matching second of the recording, the intro states the running time, and six sections each end with one question whose answer is folded, leaving four pen-and-paper questions at the end. The link now shows the revised version. One thing cannot be changed: this year's CS229 recordings do not allow embedding on other sites, so the spot in the intro shows a notice pointing to YouTube, and the time links can only open YouTube at that second.

**[The CS231N video understanding article](/posts/ai/2026-09-30-cs231n-video-understanding-en)** is the "video is only supplementary" case. The official schedule does not list this year's recording and I found no public playlist for it, so the article attaches last year's lecture of the same title. The player is in the "Course video sources" block at the end, and the status line at the top says a related supplementary video is included and links to that block, so the position fits the third role. Its problem is the long transcript-verification record in front of the player (which terms appear in the transcript and which only in the slides). That is my fact-checking process. Readers need one sentence: this is last year's recording, and here are the topics it does not cover.

Of the 380 articles with the player at the end before the changes, 275 have a status line saying the lecture's own video is included. Those are the ones whose placement is actually wrong. By the evening of 2026-10-13 the figure was 268 of 373. The Hsuan-Tien Lin series is the second role: four official short videos per lecture, [each placed under its H2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en).

## Three things you can do tonight

If you also write teaching articles that come with video, pick one article and do the following. It takes about an hour:

1. Turn each section's time range into a link. Work out the starting second and append it to the video URL with the `&t=` parameter.
2. Add one line above the player with the length and how to use the video alongside the text.
3. Take three questions from the self-check at the end, move them to the end of their sections, and put some distance between each question and its answer.

Afterwards, look at your own site's numbers: play rate, scroll depth, how often the timestamp links get clicked. Outside research can only give you a direction. How your readers respond is something you have to measure. This site has not measured play rate yet. As of the evening of 2026-10-13, 8 articles have been changed along these lines. All 7 Harvard CS50 AI articles, Weeks 0 through 6, were rewritten from the captions as section-by-section walkthroughs (for example [Week 0](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en)): the running time is stated up front, each section has a time link and one self-check question with a folded answer, the player sits in a "Lecture video and timeline" section near the top, and Week 0 also gained three diagrams. CS229 Lecture 2 has all three changes. The other 432 of the 440 are as they were. These articles were still being edited that day, so the numbers describe that moment.

The follow-up, [When a Reader Wants the Video Mid-Article](/posts/learning/2026-10-13-video-beside-text-layout-en), takes up the next question: once a reader clicks a time link, how the video and the text should share the screen. The layout this site built afterwards (side by side on wide screens; on narrow screens, scroll to the player with a way back) is described there too.

## What this evidence cannot tell you

- **No study tested this exact situation.** A long text guide paired with an 80-minute classroom recording: none of the studies I read tested that combination. Every item above carries a result over from a neighboring situation.
- **The learning experiments used very short material.** Carpenter's video ran about 7 minutes in total. Szpunar's recording ran 21 minutes. Lawson and Mayer's lesson was four animated slides, which the groups that wrote nothing finished in three minutes. Carpenter, and Lawson and Mayer, say the results may not generalize to longer classroom learning. Carpenter also notes that in the one classroom study, the benefit of prequestions was no longer clear about a month later.
- **The gap between question and content differs.** Carpenter's questions came right before each segment of a little over two minutes. Practice 4 puts the question at the start of a section of a long recording, a longer gap than in the experiment, and the intro would be longer still.
- **The studies measure different things.** Guo and Kim measure interaction logs, the experiments measure test scores, and NN/g and the surveys in the LSE review measure what people say. Video Digests measures how many key topics a summary covers after time-limited browsing, not learning outcomes. Higher scores do not mean readers feel helped, and the reverse holds too.
- **The evidence on placement is thin.** NN/g is a qualitative study of 8 people doing tasks like folding napkins and setting up a grill, not reading university course material. Wistia gives no numbers and no basis. I looked at one page per course site, and I measured the HTML structure without viewing each page in a browser.
- **The sources were not chosen by a systematic search.** The studies are ones I found while searching and could read in full; the course sites are a convenience sample. The LSE document is a literature review report issued by the school, not a journal article.
- **Segmenting was not tested on page layout.** Rey and colleagues' meta-analysis used multimedia materials with words and pictures or animation, not plain text or web pages, and a study qualified with either segmentation or learner pacing. For pre-training I have no evidence I could read in a legal full text: I have not read legally available versions of Mayer's 2021 review or of Cromley and Chen's 2025 meta-analysis.
- **Time on task was not controlled.** In Lawson and Mayer, the explanation-writing groups spent about three times as long on the lesson as the no-activity groups (2.8, 3.1, and 3.5 times across the three experiments), which the authors list as a limitation.
- **The edX data comes from four science and engineering courses in Fall 2012**, with students from the first wave of MOOC users. Those videos average under 8 minutes and were recorded as short online-course clips, not one-to-two-hour classroom lectures. Guo also points out that watching time is a proxy and cannot tell whether a student is watching or just letting the video play.
- **Eight points are my own inference or judgment**: the two things that make the pairing feel helpful; leaving supplementary video at the end; flagging what the transcript cannot show; putting prequestions at the start of each section; introducing key terms first (no experimental support I could read); collapsing self-check answers; reading Szpunar alongside Lawson and Mayer; and a video moved to the top still not being enough for Google to treat it as the page's main content. Each is marked in the text.
- **What I did not read**: I read Szpunar et al. (2013) in full but not its supplementary material. The individual studies in the LSE review (Soong, Traphagan, Leadbeater, and others) are cited second-hand and I have not read the originals.
- **Known to exist, no legal full text read**: [Mayer (2021)](https://doi.org/10.1016/j.jarmac.2021.03.007), the review of design principles for instructional video. An earlier draft cited its effect sizes for segmenting, pre-training, and generative activity from a copy on a company website; the source check found no version made public by the author or publisher, so on 2026-10-14 all its numbers were removed and it was taken out of the references.

## Appendix: study designs and numbers

The main text keeps only the numbers needed to follow each conclusion. The rest is here.

**NN/g, Harley (2020).** 8 participants, qualitative usability study. Tasks included telling ETFs from mutual funds, setting up a charcoal grill, finding the documents for a child's passport, doing a goblet squat, replacing parts on an air purifier, folding a napkin, tying a babywearing wrap, and using a compass. The article also mentions that 26% of views on NN/g's own video channel are with subtitles.

**Guo, Kim & Rubin (2014)**, Learning at Scale. Four edX courses from Fall 2012 (MIT 6.00x, Harvard PH207x, Berkeley CS188.1x, MIT 3.091x), 862 videos, 127,839 students, about 6.9 million watching sessions. Only 1x-speed sessions are reported, which make up 76% of all sessions. The share of sessions followed by a problem attempt falls with video length: 56%, 48%, 43%, 41%, and 31% across the five length buckets. It is a retrospective analysis with no controlled experiment. The authors further recommend focusing on the first-watch experience for lecture videos and supporting rewatching and skimming for tutorials.

**Kim et al. (2014)**, Learning at Scale. The same four courses, 862 videos, mean length 7 minutes 46 seconds. Dropout rate was 78.6% for rewatchers and 48.6% for first-time viewers, and 61.3% for tutorial videos against 54.1% for lecture videos. Peaks come in two kinds, rewatching-session peaks and play-event peaks, and an average of 3.7 was detected per video. In the 80 sampled videos (61 lectures, 19 tutorials), the manually labeled causes were: beginning of new material 25%, returning to content 23%, tutorial step 7%, replaying a segment 6%, non-visual explanation 39%. The authors say the categorization is not conclusive.

**Karnad (2013)**, a literature review report from LSE, searched through Google Scholar, the British and Australian Education Indexes, and the LSE Library. Figures it cites: Soong et al. (2006) surveyed 1,160 students, with watching selected parts they did not understand at 34.51% and exam preparation at 21.46%; in Traphagan et al. (2009), 83% of students used recordings to make up for a missed class and 70% to review before an exam; Leadbeater et al. (2013) defined heavy users as students who listened to more than 5 hours of recordings per module. The executive summary adds that students with lower academic achievement access recordings more often and are more likely to watch a lecture in its entirety. The document is a report issued by the school, not a journal article.

**Pavel, Reed, Hartmann & Agrawala (2014)**, UIST. Four videos of 13.3 to 19.9 minutes (a Yale philosophy lecture, a Coursera lecture on prototyping, a Khan Academy overview of US history, and a talk by Hans Rosling). Four formats (manually authored digest, auto-generated digest, transcript-based player, timeline-based player) by three viewing times (2, 5, and 8 minutes), 4 people per cell, 192 summaries in total, scored against a list of key topics drawn up by two of the authors. At 2 minutes the manual digest scored 0.55 and the timeline player 0.28 (read from Figure 6 of the paper). The formats differed significantly at 2 and 5 minutes and not at 8 minutes (p = 0.080). The authors note that all four videos are accessible to a general audience and that they did not test highly technical lectures.

**Carpenter & Toftness (2017)**, Journal of Applied Research in Memory and Cognition. 85 undergraduates at Iowa State University, 43 in the prequestion group and 42 in the control group. The three segments ran 2:22, 2:33, and 2:15. The final test had 12 questions and was given right after viewing. Overall scores were 0.57 for the prequestion group and 0.38 for the control group (d = 1.00). On content that had not been prequestioned, the prequestion group scored 0.50, also above the control group (d = 0.54). The prequestion group answered only 5% of the prequestions correctly beforehand. The authors note that in a 90-minute class, the gap between a prequestion and the related content may weaken the effect.

**Rey, Beege, Nebel, Wirzberger, Schmitt & Schneider (2019)**, Educational Psychology Review 31. 56 investigations, 88 comparisons, multimedia materials. Retention d = 0.32 (67 effect sizes), transfer 0.36 (56). System-paced segmentation was significant on all four outcomes; learner-paced segmentation only on transfer. Segmented groups took longer to study (d = −0.92), a result with significant publication bias that the authors say to interpret with caution. Details are in the appendix of [part 1 of this series](/posts/learning/2026-10-13-teaching-text-evidence-en).

**Lawson & Mayer (2021)**, Educational Psychology Review. Three experiments with 126, 131, and 128 undergraduates in Southern California. The lesson was four animated slides with on-screen text about greenhouse gases, and the test was scored out of 36. Experiment 1 tested immediately and found no significant difference among the four groups overall. Experiment 2 tested a week later: writing an explanation 8.06, no activity 5.41 (p = 0.018), reading an explanation 4.47. Experiment 3 tested a week later: writing an explanation 9.13, rewriting a provided explanation 7.79, reading an explanation 6.81, no activity 4.90. The first two groups scored significantly higher than no activity, and the read-only group did not (p = 0.136). Time on the lesson for the explanation-writing group against the no-activity group was 9:24 against 3:24, 9:42 against 3:05, and 10:17 against 2:58 across the three experiments. The paper's abstract says the group that wrote an explanation using provided terms in Experiment 2 also significantly outperformed the no-activity group, but the post-hoc test in the body reports no significant difference (p = 0.167). I follow the body.

**Szpunar, Khan & Schacter (2013)**, PNAS. Participants were Harvard undergraduates, 80 across two experiments. The material was a 21-minute recording of an introductory statistics lecture, split into four segments of about 5.5 minutes each. After each segment everyone did 1 minute of arithmetic, then, depending on the group, a 2-minute quiz (6 questions) or 2 more minutes of arithmetic. A 24-question cumulative test came at the end. Experiment 1 had 32 students in two groups, tested after every segment or tested only after the fourth: slides with added notes 17% against 6%, and fourth-segment accuracy 84% against 59% (d = 1.03). Experiment 2 had 48 students in three groups, tested after every segment, restudying the questions with their answers after each segment, or not tested, with four random probes during the lecture asking whether their mind was wandering: mind wandering was reported on 19%, 39%, and 41% of probes; slides with added notes were 24%, 9%, and 7%; fourth-segment accuracy was 89%, 65%, and 70%. On the final cumulative test across both experiments the three groups scored 90%, 76%, and 68% overall, with no significant difference between the restudy and untested groups. The tested group reported lower anxiety about the final test and found the lecture less mentally taxing. I did not read the supplementary material.

**Brame (2016)**, CBE—Life Sciences Education. A practical guide for biology instructors. Its guiding-questions item cites a 2006 classroom study by Lawson and colleagues, in which the sections given eight guiding questions while watching scored higher on a later test.

## References

- [Harley (2020), Videos as Instructional Content: User Behaviors and UX Guidelines](https://www.nngroup.com/articles/instructional-video-guidelines/): video placement, showing length, time markers, and the three viewing behaviors. Read in full.
- [Schade (2014), Video Usability](https://www.nngroup.com/articles/video-usability/): video forces sequential access; do not rely solely on video. Read the relevant sections.
- [Lavigne (2024), Get More Views: 4 Key Ways to Increase Video Play Rate](https://wistia.com/blog/how-to-increase-video-play-rate): Wistia on video position and play rate. Read in full.
- [Guo, Kim & Rubin (2014), How Video Production Affects Student Engagement](https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf): the edX watching-time analysis and the 6-minute recommendation. Read the abstract, data and methods, the section on length, the lecture-versus-tutorial comparison, and the limitations.
- [Kim et al. (2014), Understanding In-Video Dropouts and Interaction Peaks in Online Lecture Videos](https://kgajos.seas.harvard.edu/papers/kim14video.pdf): dropout rates and the five causes of interaction peaks. Read the abstract and the three analyses.
- [Karnad (2013), Student use of recorded lectures](https://researchonline.lse.ac.uk/id/eprint/50929/1/Karnad_Student_use_recorded_2013_author.pdf): the LSE literature review. Read the executive summary, the method, and the sections on why and when students use recordings.
- [Pavel et al. (2014), Video Digests: A Browsable, Skimmable Format for Informational Lecture Videos](http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf): the chapter-and-summary format and the browsing experiment. Read the abstract, the input videos, the browsing experiment, and future work.
- [Carpenter & Toftness (2017), The Effect of Prequestions on Learning from Video Presentations](https://664ef278-1723-43c6-bbe1-3bd4e65a87fe.filesusr.com/ugd/f4b9f1_ae7d99429920421594e4b037cfaa5f6a.pdf): the prequestion experiment. Read in full.
- [Rey et al. (2019), A Meta-analysis of the Segmenting Effect](https://maria-wirzberger.de/wp-content/uploads/2019/01/Rey2019_Article_AMeta-analysisOfTheSegmentingE.pdf): the meta-analysis of segmenting. Read in full; the study-by-study Table 1 had misaligned columns and was not reconstructed row by row.
- [Lawson & Mayer (2021), Benefits of Writing an Explanation During Pauses in Multimedia Lessons](https://pmc.ncbi.nlm.nih.gov/articles/PMC7985227/): three experiments on writing explanations during pauses. Read the abstract, the methods and results of all three experiments, and the limitations.
- [Szpunar, Khan & Schacter (2013), Interpolated memory tests reduce mind wandering and improve learning of online lectures](https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/): two experiments interpolating tests between segments of a lecture recording. Read in full, excluding the supplementary material.
- [Brame (2016), Effective Educational Videos](https://pmc.ncbi.nlm.nih.gov/articles/PMC5132380/): practical recommendations for educational video. Read the recommendations table and the sections on student engagement and active learning.
- [Google Search Central (2023), Video mode now only shows pages where video is the main content](https://developers.google.com/search/blog/2023/12/video-is-the-main-content) and [Video SEO best practices](https://developers.google.com/search/docs/appearance/video): the definitions of main-content video and watch pages.
- [web.dev: Best practices for using third-party embeds](https://web.dev/articles/embed-best-practices): lazy-loading YouTube embeds and static facades.
- Pages from six course sites: [Missing Semester](https://missing.csail.mit.edu/2020/shell-tools/), [MIT OCW 6.006](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-1-algorithms-and-computation/), [fast.ai](https://course.fast.ai/Lessons/lesson1.html), [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/4), [3Blue1Brown](https://www.3blue1brown.com/lessons/neural-networks), [CS50x Notes](https://cs50.harvard.edu/x/notes/1/).
- Articles on this site: [CS229 Lecture 2 guide](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en), [CS231N video understanding](/posts/ai/2026-09-30-cs231n-video-understanding-en), [Hsuan-Tien Lin's Machine Learning Foundations, Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en).
