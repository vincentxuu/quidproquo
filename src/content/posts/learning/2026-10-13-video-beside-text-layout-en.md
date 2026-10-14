---
title: "When a Reader Wants the Video Mid-Article: Side by Side, Floating, or Scroll Back"
date: 2026-10-13
category: learning
type: deep-dive
tags: [learning-science, youtube, self-learning, blog, ux]
lang: en
description: "What should happen on screen when a reader of a teaching article clicks a time link into its video: the layouts and study results of four research interfaces (Papeos, LectureScape, Visual Transcripts, Video Digests), measurements of five learning sites, the split-attention evidence and a recent experiment that failed to replicate it, the ad-industry data on floating players, and how this site went from a floating corner player to a split view."
tldr: "Research interfaces share one move: keep the video and the matching text visible together, either beside the text or right at the passage being read. In the 16-person Papeos study, the condition with clips attached to passages had the lowest mean mental demand (the omnibus test across three conditions was significant). No experiment has compared layouts for a long written guide paired with a lecture recording, and no research I found says what to do on phones."
series:
  name: "Writing Articles That Teach"
  order: 6
draft: false
---

> 🌏 [中文版](/posts/learning/2026-10-13-video-beside-text-layout)

The [previous article](/posts/learning/2026-10-13-instructional-video-in-articles-en) covered where a video goes on the page and how to write the article around it. One of its conclusions was that every section should link to the matching time in the video. Doing that raised the next question at once: a reader is in section seven and clicks that section's time link. What should the screen do?

This article records how this site handled it, including an approach that was rejected on the spot, and the research I went back and read.

## The short version

| Situation | What to do | Basis |
|---|---|---|
| Wide screens (this site uses 1200px and up) | On a time-link click, the article keeps the left half and the video is fixed in the right half; the line the reader was on does not move | All four research interfaces keep the video and its matching text visible together; in the Papeos study the condition with clips linked to passages made it easier to orient within the video than separate windows did, led to more switching between the two formats, and had the lowest mean mental demand |
| Narrow screens and phones | Scroll to the player and offer a "back to where I was reading" button | No research source; this site's judgment. Of the sites measured, only TED keeps the player pinned in a narrow window, and the pinned area takes about a third of the screen |
| Videos that cannot be embedded | The time link opens YouTube at that second | There is no alternative |
| Any screen | Do not cover the text with a small player | Slides become unreadable when the video shrinks; the data on floating elements comes from ad placements and is weak evidence here |

On the strength of this table: no study has run an experiment comparing layouts for a long written guide paired with a lecture recording. The table carries results over from neighboring situations and adds what this site learned by trying.

## Where the problem came from

Most course guides on this site are one article paired with one recording, with the player at the top of the article; the Harvard CS50 AI series is like that. Each section opens with a time link such as "Recording 1:36:30–1:43:59".

The link used to be a plain YouTube URL that opened a new tab. I first changed it to drive the player on the page: click, the player seeks to that second, and the page scrolls to the top so the reader can see it. The user's reaction after trying it:

> It's a bit inconvenient. To watch the content I have to keep scrolling up?

The article is more than six hundred lines long. Scrolling from section seven to the top to watch, then finding section seven again, is something a reader does once and does not repeat.

### The first fix: a floating corner player, rejected on the spot

My first fix was the pattern common on news sites. If the player is off screen when the reader clicks a link, shrink it into a small window pinned to the bottom-right corner, at most 420px wide, with a close button.

The user blocked this change before it was applied, asking whether floating in the bottom-right corner made any sense. Thinking it over, I saw three problems:

- A small window covers body text and code, and on a phone it takes nearly half the screen.
- A lecture video is mostly slides, and at 420px wide the text on them cannot be read.
- The reader never asked for it to follow them, yet now has one more thing to dismiss by hand.

I then went to look for what the research says.

## How research interfaces lay it out

I read four research systems that put text together with a video the text can seek. Their layouts differ, but they share one thing: while the reader watches, the matching text is still in front of them.

These four are not the result of a systematic search. Video Digests was already read for the previous article; the other three came from the results of two search queries, filled in by following how they cite one another. The search results and the related-work sections of these papers also name similar systems such as NoteVideo, VideoDoc, Codemotion, ViDeX, DynamicSlide, SmartLearn and NoteIt, which I did not read. All four come from HCI conferences or journals, so practice in education research may not be covered.

How much of each I read also differs: for Papeos, the whole body and the appendix; for Visual Transcripts, every section except the algorithm; for LectureScape, the interface, study design, results and limitations; for Video Digests, only the layout description in the abstract and introduction is used here.

### Video Digests (2014): each chapter carries its own player

[Video Digests](http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf) by Amy Pavel and colleagues cuts a lecture video into chapters and sections. The paper describes the layout this way: each chapter consists of an embedded video player, a chapter title and a sequence of sections, and each section has a short text summary and a representative keyframe; clicking a section plays the video from that segment. The video travels with the chapter, so the reader never leaves the chapter they are in. Its browsing experiment is covered in the previous article and not repeated here.

### LectureScape (2014): player in the middle, clickable transcript in the right sidebar

[LectureScape](https://www.eecs.harvard.edu/~kgajos/papers/2014/kim-uist14-lecturescape.pdf) by Juho Kim and colleagues is a lecture video player. The paper describes the layout: the player in the main view, a timeline below the video, a word cloud above it, an interactive transcript in the right sidebar, and highlight frames along the bottom, with every widget collapsible.

Note that its experiment does not compare layouts. Twelve students currently enrolled in the introductory programming course each used LectureScape and a baseline interface for eight tasks. The baseline dropped the features based on other learners' viewing data but kept the interactive transcript, and was deliberately given the same layout and visual design; the paper says this emulates what edX or YouTube already offered. The results:

- On problem-search tasks LectureScape averaged 96 seconds and the baseline 106, a difference that was not significant (p = 0.8).
- Participants believed they were faster and more efficient with LectureScape (5.8 vs 4.8 and 6.1 vs 4.8 on a 7-point scale, p < 0.05).
- They also found it harder to use (ease of use 4.7 vs 6.3), and some said the screen was too complex.

So what this paper supports is that "video in the main view, transcript beside it" was the arrangement both researchers and platforms used at the time. It does not show that the arrangement was proven better by experiment. One more number worth keeping: on the baseline's problem-search tasks, 11 of 12 participants located the spot by clicking on transcript text.

### Visual Transcripts (2015): the lecture laid out as notes, played on click

[Visual Transcripts](https://dl.acm.org/doi/10.1145/2816795.2818123) by Hijung Valentina Shin and colleagues deals with blackboard-style lecture videos of the Khan Academy kind. The system cuts out each group of strokes the instructor writes and interleaves it with the speech from the same moment, producing a document read from top to bottom. The document can be read on its own or linked back to the video: click any figure or sentence and the video plays from there, with the matching figure and text highlighted during playback.

The user study had 9 participants and three college-level math lectures of 7 to 8 minutes, comparing three interfaces: a YouTube player with an interactive transcript, NoteVideo (which merges the whole blackboard into one image used for navigation), and Visual Transcripts.

- Given 3 minutes to write a summary, the share of main points covered was 0.83, 0.81 and 0.87, not a significant difference (p = 0.79).
- The search tasks came in three kinds. For finding text and finding a text-visual relationship, completion times did not differ significantly across the three interfaces (p = 0.676); for purely visual search NoteVideo was fastest. Taking the search tasks together, Visual Transcripts was significantly faster than the YouTube player with a transcript (p = 0.02) and not significantly different from NoteVideo (p = 0.12).
- Both interfaces show the same transcript text, yet participants rated it very differently: on a 7-point scale the transcript in Visual Transcripts scored 6.3 and the one beside the YouTube player 4.7. With the latter, participants mostly scrubbed the timeline instead.
- Asked which they preferred for learning, 7 of 9 chose Visual Transcripts, for reasons including "having the whole script and equations".

So on summaries the three could not be separated; on finding things, the version laid out as a document beat "a player plus one long transcript"; and preference also leaned clearly toward the interleaved document. The limitations the authors list are that only blackboard-style videos are handled, and that a static layout cannot recover references such as "here" that the instructor resolves by pointing with the cursor.

### Papeos (2023): video clips attached beside the matching passage

[Papeos](https://arxiv.org/abs/2308.15224) by Tae Soo Kim and colleagues pairs a research paper with the authors' talk video. It is the closest study I found to "long text plus one video".

**First they watched what readers do.** In a preliminary session, 4 researchers were given a paper and a video side by side and were free to consume them however they liked. All four watched the whole video first and only then started on the paper. They said they had wanted to jump to the paper midway, but the cost of cross-referencing between the two formats was too high.

The team then built a probe interface in which video segments were linked in advance to passages of the paper and color-coded, and had 14 researchers use it. Behavior now split two ways: 5 mainly read the paper and occasionally switched to the video, and 9 followed the video and paused now and then to dive into the paper. When the video moved to the next segment the paper scrolled automatically to the linked passage; 3 participants said this disrupted their reading and 6 said it made them lose their place.

The same participants then took the authors' side and designed how they would want the two combined. Seven of the 14 argued against replacing passages of the paper with video content, because a video is rarely a one-to-one representation of a paper and replacing would lose information. From this the team set five design goals, two of which bear directly on layout: let readers focus on either format and also switch whenever they need to; and avoid occluding or replacing content in one format with content from the other.

**The final interface.** Video segments become "video notes" placed to the right of the paper's pages, roughly aligned with the passage each one is linked to, with color bars marking the linked passages. Clicking a bar or a note turns the thumbnail into a player in place and enlarges it, showing the transcript for that segment. Each note plays only its own segment and stops at the end instead of running on into the next, so that a reader who has gone back to the paper is not disturbed. A reader who wants to watch continuously can turn on autoplay; the note then stays fixed at the same position in the viewport and the paper scrolls to the next linked passage.

**The comparison study.** Sixteen early-stage HCI researchers (12 first- to third-year PhD students and 4 Master's students) each read the system section of three systems papers, with 15 minutes per paper to read and write a summary at the same time, under three conditions: paper only, paper plus video (in separate tabs or windows), and Papeos.

| Measure | Paper only | Paper + video | Papeos | Test |
|---|---|---|---|---|
| Mental demand (NASA-TLX, 7-point) | 5.50 | 5.31 | 4.50 | p = 0.002 (omnibus test across the three conditions) |
| Comprehensiveness of the summary | Highest with Papeos, the other two similar | | | p = 0.043 |
| Number of details, coherence | No difference | | | p = 0.368, 0.250 |

For mental demand the paper reports only the test across all three conditions, not a pairwise comparison of Papeos against paper plus video. Temporal demand, effort, frustration and self-rated performance did not differ significantly across the three conditions. The interaction logs show that participants switched between formats significantly more often with Papeos than with paper plus video; in the latter condition most of them still watched the whole video first and spent the remaining time on the paper alone, just as in the preliminary session.

What this means for this site is my reading: putting the video somewhere else and leaving the reader to do the cross-referencing works about as well as having no video, and the two formats only get used in alternation once the video is tied to where the reader is. The study did not compare "video beside the text" with "video floating in a corner", so it cannot be used to rule out a floating player directly.

Limitations the authors list: the study used only systems papers from HCI, covered one section of each paper, and ran 90 minutes per session.

## How real learning sites lay it out

Most research systems never shipped. So I also opened several real pages that pair a video with a transcript or text in a browser and measured where the player and the text sit, what the player does on scroll, and what happens when a transcript line is clicked. Measurements were taken on 2026-10-13, one page per site, not logged in.

Why these: MIT OCW, Khan Academy, Coursera and edX are course platforms; YouTube is where this site's videos come from; TED's transcript page is "long text plus one video"; freeCodeCamp pairs a written question with a video. Frontend Masters course pages need a login and were not measured.

| Site (page measured) | 1440 × 900 | 390 × 844 | Player on scroll | Clicking a transcript line or time mark |
|---|---|---|---|---|
| [MIT OCW](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-1-algorithms-and-computation/) (6.006 Lecture 1 video page) | Player 804 × 452, centered, transcript in a tab directly below | Player 284 × 160, transcript below | Scrolls away with the page | With the video not yet playing, clicking a line does nothing; the script could not press play inside the embedded player, so behavior during playback was not measurable |
| [Khan Academy](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:solve-equations-inequalities/x2f8bb11595b61c86:linear-equations-variables-both-sides/v/why-we-do-the-same-thing-to-both-sides-multi-step-equations) (an algebra video) | Player 960 × 540 (with the lesson list on the left collapsed; 927 × 521 in the run where the list was open); the transcript is a tab below the video, and the transcript block is 250px tall and scrolls on its own | Player 390 × 219, transcript tab below | Scrolls away with the content | Clicking the line at 1:40 moves the video to 104 seconds and starts playback, and the page does not move; same at both widths |
| [YouTube](https://www.youtube.com/watch?v=WbzNRTTrX0g) (watch page for CS50 AI Week 0) | Player 996 × 560 on the left, transcript panel on the right, 396px wide | Player 390 × 240 at the top | Scrolls away with the page | The transcript panel stayed loading in the automated browser, not measurable; clicking the chapter time 00:54:29 in the description instead moved the video to 3,269 seconds and played, with the page staying at the top |
| [TED](https://www.ted.com/talks/sal_khan_let_s_use_video_to_reinvent_education/transcript) (the transcript page of one talk) | Player 776 × 437 on the left; the transcript is a right-hand column 536px wide that stays fixed on screen and scrolls on its own | Player 390 × 219 pinned below a 56px navigation bar; the transcript scrolls in a dismissible panel below it | Wide window: the player scrolls away with the left column while the transcript column stays; narrow window: the player stays pinned | Clicking a paragraph moves the video to 104 seconds; the page moved 56px in the wide window and not at all in the narrow one |
| [freeCodeCamp](https://www.freecodecamp.org/learn/machine-learning-with-python/tensorflow/introduction-machine-learning-fundamentals) (one video challenge) | Player 945 × 532 on top, question below, no transcript | Player 330 × 186 | Scrolls away with the page | No clickable time marks on the page |
| Coursera | Not measurable: the lecture URL redirects to the course landing page, and no player is shown without logging in | | | |
| edX | Not measurable: the course landing page has no course-video player, and course content needs a login | | | |

Three things show in the five pages that could be measured:

- The text always sits right next to the player, directly below or to the right. None of the pages shrinks the player into a corner on scroll.
- Khan Academy and TED put the transcript in a block that scrolls on its own. The reader scrolls the transcript while the player stays put, so nothing on the page has to move after a click. It is the same idea as a split view: let the half that grows long do the scrolling.
- In a narrow window only TED keeps the player pinned. The player alone takes about 26% of an 844px-tall screen; together with the navigation bar above it the pinned area is 275px, about 33%.

Limits of these measurements: one page per site; the narrow window is desktop Chrome resized to 390 × 844 with no mobile user agent or touch emulation, so for services that serve a separate mobile site or app (YouTube, for one) this is not what phone users actually see; not logged in; the screenshots and raw numbers are in this site's working directory and are not published.

## Does the distance between text and picture matter

Educational psychology has a related idea called split attention: when text and a picture that refer to each other are placed apart, the learner has to go back and forth to integrate them, and that work uses up capacity that could have gone to understanding the content. The matching design principle is spatial contiguity.

**A review of reviews supports the principle.** The [overview](https://doi.org/10.31234/osf.io/pynzr) by Noetel and colleagues, which pooled 29 systematic reviews (I read the preprint), ranks spatial and temporal contiguity among the principles with the largest benefits. It cites the 2018 meta-analysis by Schroeder and Cenkci: across 58 comparisons, placing related text and pictures close together led to better learning than placing them apart, with an effect of g = 0.63. That figure is as cited by Noetel; I could not obtain the full text of the original paper.

The same overview reports a moderator that bears directly on web pages. Design principles mattered more when the material was system-paced (g = 0.41, a lecture for example) than when it was learner-paced (g = 0.27, a website for example), and the difference was significant (p = 0.02). The authors' explanation is that learners who control the pace can more easily use their own strategies to manage load. Someone reading an article who can pause the video at will is in the second group, so the difference a layout makes may be smaller than in classroom studies. That last sentence is my inference.

**Recent experiments have not replicated it reliably.** In a 2024 [experiment](https://pure.tudelft.nl/ws/portalfiles/portal/213485394/Applied_Cognitive_Psychology_-_2024_-_Zhang_-_Does_presentation_size_of_instructional_materials_influence_the.pdf), Zhang, de Koning and Paas had 146 university students study a text-and-picture lesson on the nephron in four groups: text and picture separated or integrated, crossed with a large or small presentation size. On the retention test, the comprehension test and self-rated extraneous cognitive load there were no effects of format, size or their interaction, and the Bayesian analysis leaned toward "no difference". The authors note that their two earlier studies with the same material found the effect in one and not in the other, and say the conditions under which it appears still need to be worked out.

There is also an experiment comparing "toggling between a video and an application on one monitor" with "two monitors side by side" (Kueker and Moore, 2023, Journal of Computer Assisted Learning). I read only the abstract and could not obtain the full text, so I note only that the study exists; I do not report its results or rest anything on it.

Of the two pieces of evidence above that I did read, the experiment by Zhang and colleagues tests text with pictures, and Noetel's overview pools design principles across many kinds of multimedia material. Neither specifically tests an article paired with a lecture video.

## The data on floating players comes from advertising

I could not find anyone studying learning outcomes who had tested a floating player. What exists comes from the ad industry.

CafeMedia, an ad management company, writes in a [2021 article](https://cafemedia.com/best-practices-for-sticky-elements-in-ux-design/), based on data from thousands of its sites:

- On desktop, the floating video player sits farther from the content and is closed on fewer than 10% of pageviews.
- On mobile, on sites where sticky elements together take up more than 30% of the screen, the player gets closed substantially more often.
- Readers do not care whether a sticky element is an ad or regular content; if it gets in the way they close it just as often.
- On the phone size it uses as an example, a floating player without a title wrapper (272 × 153 px) takes 17% of the screen.

The 30% figure comes from the Coalition for Better Ads. Its [standards page](https://www.betterads.org/standards/) lists "Large Sticky Ads" among the mobile web ad experiences that fall below the threshold of consumer acceptability, and the [definition](https://www.betterads.org/mobile-large-sticky-ad/) is an ad that sticks to a side of the page, takes up more than 30% of the screen and stays there regardless of scrolling. The coalition says more than 150,000 consumers have taken part in its research to date.

The limits of this data are plain. CafeMedia sells ad inventory, measures whether the player was closed, and the videos playing are ads. Better Ads measures how much consumers dislike ad experiences. A teaching video the reader summoned by clicking a link is not the same thing as an ad that appeared on its own. I take only two reminders from it: anything fixed to the screen eats too much space on a phone very quickly, and the reader must always have a way to close it.

## What recent reviews say

**Clickable tables of contents and timelines mostly help, but the evidence is scattered.** The 2025 [review](https://link.springer.com/article/10.1007/s40593-025-00481-x) by Navarrete and colleagues covers 257 papers on video-based learning from 2016 to 2021 (I read the abstract, the methodology, the tool categories, the controlled-experiment sections and the limitations, not the whole paper). Of these, 57% present tools and 25% are controlled experiments. Many of the navigation tools take the form of a clickable table of contents, and others navigate by keywords or by visual elements. On effects, the review says that experiments using table-of-contents navigation or timelines with clickable points "generally" found a positive effect on learning outcomes, but that this was not always significant, or was tested in combination with other features. The authors say the settings differed too much across studies for a meta-analysis; another limitation is that only three computer-science databases were searched.

There is also a meta-analysis of interaction features in videos (Ploetzner, 2022, Interactive Learning Environments). I read only the abstract and could not obtain the full text, so I note only that the study exists and do not report its results.

My inference: time links are for letting readers find the place, which Navarrete's review supports; learning more still depends on the reader working out an answer, and the basis for that is the pause-and-explain experiments read for the [previous article](/posts/learning/2026-10-13-instructional-video-in-articles-en), with no new full-text evidence in this one.

## What this site does now

### Wide screens: split view

On this site 242 article files (121 in each language) embed two or more videos, 5 at most; the other 640 files with an embed have exactly one. The single-video case first.

The most direct idea was to put the player in the article page's existing sidebar. When I measured it the sidebar turned out to be only 340px wide, smaller than the floating window that had just been rejected, so I did not do that.

What happens now: when the window is 1200px wide or more and the reader clicks any time link, the page splits into two halves.

- The left half is the article, scrolling as usual; the sidebar table of contents is put away for the time being.
- The right half is the player, fixed and vertically centered.
- Above the player is a "Close split view ×" button that restores the normal layout.
- If the window is narrowed below 1200px the split view ends by itself.

Measured in a 1440 × 900 window, the text column goes from 752px to 688px and the player from 750 × 421 to 678 × 381, each shrinking by about a tenth. Before and after the click, the clicked line moved by 0.2 pixels on screen; on closing the split view, the paragraph in the middle of the screen moved by 0.1 pixels.

When an article embeds several videos, the code does this: whichever video's time link the reader clicks takes the fixed slot on the right, and any other player that is already playing is paused. No article on the site currently has time links for two of its videos, so I have only read the code for this switch and have not tested it in a browser.

This layout is closest to LectureScape (video and text each have their own area and both stay visible). It differs from Papeos in that the video stays in one place and does not appear beside each passage; a course guide mostly pairs one long recording with one article, and putting a player beside every section would mean changing how embedding works altogether.

### Narrow screens and phones: scroll there, with a way back

When the window is not wide enough the earlier behavior stays: scroll to the player. The difference is a "↩ Back to where I was reading" button at the bottom of the screen, which scrolls back to where the link was clicked and then removes itself. If the player is already on screen when the link is clicked, nothing scrolls.

This half has no research behind it. I considered keeping the player pinned at the top of the phone screen, which is what the TED transcript page measured above does: in a 390 × 844 window a full-width 16:9 player is 219px tall, and with the 56px navigation bar above it the area that never moves is 275px, about 33% of the screen, already over the 30% line from Better Ads. That line was drawn for ads; applying it to a video the reader summoned is my inference. TED puts the transcript in a panel the reader can dismiss, and the body of an article here cannot be dismissed, so I chose the more conservative option for now.

### Four things the implementation holds to

1. **The line the reader is on must not move when the layout switches.** A layout change alters the column width, the text reflows and the page height changes. The approach is to record where a reference element sits on screen before the switch, measure it again afterwards and scroll by the difference. Entering split view uses the clicked link as the reference; leaving it uses the paragraph in the middle of the left half.
2. **There has to be an obvious way to close it.** The button carries words, not just a cross.
3. **Do not cover the text.** Article and video each take half, with no overlap.
4. **Change styles only; do not move the iframe.** The [HTML Standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html) specifies that when an iframe is removed from a document the document inside it is destroyed, and a new one is created when it is inserted again. Moving the player into another container therefore reloads it and loses the playback position. So the fixed position is done with CSS `position: fixed` alone and the element stays where it is in the document.

Two more details. Holding Cmd or Ctrl while clicking a link still opens YouTube as the browser normally would. And if the player has never been scrolled into view, the first click can only reload it at that second and the reader presses play once; later clicks seek and play directly.

### Where none of this works: videos that cannot be embedded

Everything above assumes the video can play on the page. For this site's Stanford CS229 Spring 2026 series it cannot: checking the Lecture 2 video with yt-dlp, `playable_in_embed` is `False`, and on the live site the place where the player should be in Lectures 2 and 3 shows a message that the video cannot be embedded and should be watched on YouTube. Time links in those articles can only open YouTube at that second. I did not check the other lectures of the series one by one.

Checked the same way, all seven Harvard CS50 AI lecture videos allow embedding, and the measurements above were taken on Week 0 of that series.

## What this evidence cannot tell you

- **No study compares layouts for this situation directly.** For a long written guide paired with a lecture recording, whether the video should be fixed beside the text, appear inside the passage or float in a corner, I found no controlled experiment.
- **The four research interfaces compare "a new interface against an ordinary player".** The samples are 9, 12 and 16 people plus one crowdsourced study; LectureScape's two conditions share a layout; in Visual Transcripts only one comparison is significant (all search tasks together, against the ordinary player), while the summary task and the other comparisons are not. Nor were the four systems chosen by a systematic search.
- **Papeos used papers paired with the authors' conference talk videos.** The paper gives no video lengths and says only that such videos are constrained in length; its readers were graduate students, and the task was writing a summary in 15 minutes. Carrying it over to an 80-minute classroom recording is my extension.
- **The split-attention experiments test text with pictures**, and a recent experiment with a fairly large sample did not replicate the effect; the meta-analytic figure is as cited by Noetel, and I did not read the original paper. Where the meta-analytic conclusion and a single experiment disagree, I am not in a position to say which is right.
- **The floating-player data is from the ad industry** and measures close rates, not learning.
- **The phone approach has no research source.** Of the sites measured, only TED keeps the player pinned in a narrow window, and that was measured by narrowing a desktop browser.
- **Each real site was measured on one page only.** Coursera and edX could not be measured because they need a login, and YouTube's transcript panel never loaded in the automated browser.
- **Four inferences are mine**: that the Papeos result means "tie the video to where the reader is"; that readers who control the pace are less affected by layout; that the 30% line Better Ads drew for ads can be used to judge a video the reader summoned; and that time links are for finding the place while learning comes from answering. Each is marked where it appears.
- **Three papers whose full text I could not obtain**: Schroeder and Cenkci (2018), Kueker and Moore (2023), Ploetzner (2022). I tried the publisher pages, the open-access locations registered in OpenAlex, and Exa, and got only abstracts. For the first I use Noetel's citation of its figure; for the other two I state only that they exist, without results, and they are not in the reference list. Noetel et al. was read as a preprint, and Navarrete et al. was not read in full.
- **Switching between several videos was not tested**; I only read the code.
- **This site's measurements were taken in desktop Chrome only** (windows of 1440 × 900, 1199 × 900 and 390 × 844). How often readers actually click, and how long they watch, has not been measured.

## Appendix: study designs and numbers

**Pavel, Reed, Hartmann, Agrawala (2014)**, UIST. For the layout and the browsing experiment see the [appendix of the previous article](/posts/learning/2026-10-13-instructional-video-in-articles-en).

**Kim, Guo, Cai, Li, Gajos, Miller (2014)**, UIST, LectureScape. Twelve participants (5 male, mean age 25.6), all currently taking the introductory computer science course the videos belong to, 4 of them edX students. Sessions ran 75 minutes and paid 30 USD. Eight tasks: four visual search, two problem search, two summarization, with interface order and video assignment counterbalanced. On the baseline's problem-search tasks 10 used keyword search and 11 clicked the transcript; with LectureScape both dropped to 6, and 6 clicked interaction peaks on the timeline instead. Asked whether the interface had all the functions they expected, LectureScape scored 6.4 and the baseline 4.3. The authors say a single-session study cannot show the value of features such as personal bookmarks.

**Shin, Berthouzoz, Li, Durand (2015)**, ACM Transactions on Graphics 34(6). The system produced 20 Visual Transcripts, 10 from Khan Academy. Nine participants (2 female, 7 male, ages 20 to 35), familiar with the subject but new to the three videos, which run 8, 7.2 and 8 minutes. Detail points covered in the summarization task were 0.50, 0.56 and 0.58 (p = 0.62). On visual-only search NoteVideo was fastest because it shows all the visuals on one screen. All search tasks together: Visual Transcripts against the ordinary player Z = −2.1, p = 0.02; against NoteVideo Z = 1.2, p = 0.12. Error rates were 0.06 (Visual Transcripts), 0.07 (NoteVideo) and 0.15 (ordinary player), not a significant difference. Asked which they preferred for the summary task, 5 chose NoteVideo and 4 Visual Transcripts.

**Kim, Latzke, Bragg, Zhang, Chang (2023)**, UIST, Papeos. Formative study with 14 participants: 10 doctoral students, 2 Master's students, 1 postdoc and 1 undergraduate, most from HCI. Comparison study with 16 participants, 90 minutes per session, 45 USD; the three papers came in a fixed order with condition order counterbalanced; summaries were limited to 14 sentences with no copy-paste. Summaries were annotated blind by two authors who had not observed the sessions (Cohen's kappa of 0.712 for annotating details). Perceived task ease was affected by condition (p = 0.030); ease of navigating within the paper was affected by condition (p = 0.035); for orienting within the video, Papeos beat paper plus video (p = 0.034). Scrolling in the paper was similar for Papeos and paper only and lower for paper plus video (p = 0.003). In the co-design stage the 14 authors drew eight types of combination, one of which was an adjustable side-by-side view. The Papeos collected averaged 20.6 links each, with linked video segments averaging 24.3 seconds. There was also a field deployment: during the two weeks of CSCW 2022, 288 unique users, 12 Papeos in all, with an average session of 5.74 minutes.

**Noetel et al. (preprint; published in Review of Educational Research)**. It cites Schroeder and Cenkci (2018) for the spatial contiguity effect: g = 0.63, 95% CI 0.55–0.71, 58 comparisons. The abstract gives 29 reviews, 1,189 studies and 78,177 participants; the flow description in the body of the preprint says 79,415 participants. The two do not match, and I follow the abstract. Pacing as a moderator: system-paced g = 0.41 (95% CI 0.33–0.49), learner-paced g = 0.27 (0.19–0.35). Design principles mattered more for complex material (complex g = 0.70, simple g = 0.20).

**Zhang, de Koning, Paas (2024)**, Applied Cognitive Psychology 38. 146 university students (mean age 20.9, 88% non-native English speakers), 35 to 37 per group. The a priori power analysis called for 128. The material was shown on screen, 1700 × 1002 pixels in the large version and 1100 × 648 in the small one, with study time fixed at 12 minutes. The retention test had 10 matching questions and the comprehension test 24 multiple-choice questions. The authors say this did not replicate the effect they found in 2023 with the same material on paper, and cite Schroeder and Cenkci (2018) as finding larger effects in paper-based than in computer-based studies. The limitations they list include the change of medium from paper to screen, two sizes that may not have differed enough, and that with enough time learners may be able to manage the extra load themselves.

**Navarrete, Nehring, Schanze, Ewerth, Hoppe (2025)**, International Journal of Artificial Intelligence in Education. Followed PRISMA and searched SpringerLink, the ACM Digital Library and DBLP. About 80% of the controlled experiments used videos from STEM disciplines, and slide-based video was the most common production style.

## References

- [Kim, Latzke, Bragg, Zhang & Chang (2023), Papeos: Augmenting Research Papers with Talk Videos](https://arxiv.org/abs/2308.15224): read the whole body and the appendix of the arXiv version.
- [Kim, Guo, Cai, Li, Gajos & Miller (2014), Data-Driven Interaction Techniques for Improving Navigation of Educational Videos](https://www.eecs.harvard.edu/~kgajos/papers/2014/kim-uist14-lecturescape.pdf): read the interface, study design, results and limitations.
- [Shin, Berthouzoz, Li & Durand (2015), Visual Transcripts: Lecture Notes from Blackboard-Style Lecture Videos](https://dl.acm.org/doi/10.1145/2816795.2818123): read the abstract, introduction, related work, design principles, results, user evaluation, limitations and conclusion; for the algorithm in Section 4 I looked only at the start of each subsection.
- [Pavel, Reed, Hartmann & Agrawala (2014), Video Digests](http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf): the layout description comes from the abstract and introduction.
- [Noetel et al., Multimedia Design for Learning: An Overview of Reviews With Meta-Meta-Analysis (preprint)](https://doi.org/10.31234/osf.io/pynzr): read the abstract, method, contiguity and moderator sections, and limitations.
- [Zhang, de Koning & Paas (2024), Does presentation size of instructional materials influence the split-attention effect?](https://pure.tudelft.nl/ws/portalfiles/portal/213485394/Applied_Cognitive_Psychology_-_2024_-_Zhang_-_Does_presentation_size_of_instructional_materials_influence_the.pdf): read the abstract, method, results, discussion and limitations; of the introduction I read only excerpts.
- [Navarrete, Nehring, Schanze, Ewerth & Hoppe (2025), A Closer Look into Recent Video-based Learning Research](https://link.springer.com/article/10.1007/s40593-025-00481-x): read the abstract, methodology, navigation and interactive tools, controlled experiments, the summary of effects and limitations.
- [CafeMedia (2021), Best practices for sticky elements in UX design](https://cafemedia.com/best-practices-for-sticky-elements-in-ux-design/): read in full.
- [Coalition for Better Ads: Better Ads Standards](https://www.betterads.org/standards/) and the [definition of Large Sticky Ads](https://www.betterads.org/mobile-large-sticky-ad/).
- The five pages measured (2026-10-13, Chrome driven by Playwright): [MIT OCW 6.006 Lecture 1](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-1-algorithms-and-computation/), a [Khan Academy video page](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:solve-equations-inequalities/x2f8bb11595b61c86:linear-equations-variables-both-sides/v/why-we-do-the-same-thing-to-both-sides-multi-step-equations), a [YouTube watch page](https://www.youtube.com/watch?v=WbzNRTTrX0g), a [TED transcript page](https://www.ted.com/talks/sal_khan_let_s_use_video_to_reinvent_education/transcript), and a [freeCodeCamp video challenge](https://www.freecodecamp.org/learn/machine-learning-with-python/tensorflow/introduction-machine-learning-fundamentals).
- [HTML Standard: The iframe element](https://html.spec.whatwg.org/multipage/iframe-embed-object.html): the steps run when an iframe is inserted and removed.
- Articles on this site: [Pairing a Teaching Article with Video](/posts/learning/2026-10-13-instructional-video-in-articles-en), [Harvard CS50 AI Week 0 guide](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) (the page used for measurements), [Stanford CS229 Lecture 2 guide](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en) (an example of a video that cannot be embedded).
