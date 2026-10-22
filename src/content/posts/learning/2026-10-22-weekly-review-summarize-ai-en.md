---
title: "Maintenance: Keeping Notes Alive Past Three Months, and What to Hand an LLM"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, note-taking, weekly-review, progressive-summarization, llm]
lang: en
tldr: "Schedule a 30-minute weekly review: empty the inbox, deal with finished projects, and pick one question from an MOC to think further about. Summarizing needs no schedule; add a layer only when you touch a note anyway. An LLM can find duplicates, suggest possibly related notes and flesh out key points you've written first; the sentence in your own words, deciding what matters and whether to delete are yours. In one 30-person study comparing three kinds of AI help, the group given complete AI notes learned the least and edited the least."
description: "Building Knowledge Bases, order 5: GTD's weekly review adapted for notes, how progressive summarization is meant to be used, deleting and demoting, research on AI summaries and automatic notes, splitting work between an LLM and yourself, privacy, a summary of the personal part, and what changes when a colleague is the reader."
series:
  name: "Building Knowledge Bases"
  order: 5
---

> 🌏 [中文版](/posts/learning/2026-10-22-weekly-review-summarize-ai)

The first month of organizing your notes usually goes well: the inbox gets cleared every week, things go into folders under the new scheme, links come with reasons. Three months later the inbox holds two hundred items again, and you can't remember when you last opened an MOC. The most common fate of a note system isn't breaking; it's being forgotten.

This is the last post in the personal part of Building Knowledge Bases. The first four covered what to keep, where to put it, how to link it and what tool to use; this one covers how to keep it alive three months from now, and the question people ask most these days: which of these chores can an LLM take over? By the end you'll be able to plan a 30-minute weekly review and decide which steps to hand to an LLM and which to keep for yourself.

First, one study. Van Kleek and colleagues at MIT followed 42 people using a sidebar note tool for 10 days in 2009: after a note was written, 75% were never edited again, and most of the edits that did happen came the same day ([Van Kleek et al. 2009](https://doi.org/10.1145/1518701.1518924)). Without deliberately coming back, notes mostly stay where they were the moment you wrote them.

## The weekly review, adapted for notes

[GTD's Weekly Review checklist](https://gettingthingsdone.com/wp-content/uploads/2014/10/Weekly_Review_Checklist.pdf) has three stages: Get Clear, Get Current and Get Creative. It was designed for tasks, but the three stages map neatly onto the earlier posts:

| Stage | Original GTD | Notes version | Covered in |
|---|---|---|---|
| Get Clear | Get the inbox to zero | Empty the inbox with the three-step test | [Order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge-en) |
| Get Current | Review the project list | From finished projects, pull out what's reusable and archive the rest; clean up the to-read list | [Order 2](/posts/learning/2026-10-22-para-johnny-decimal-folders-en) |
| Get Creative | Review the Someday/Maybe list | Open an MOC's "Not yet worked out" section and pick one question to think further about | [Order 3](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc-en) |

Order 1 suggested 20 minutes a week for clearing the inbox; this stretches that to 30, with the extra time for projects and new thinking. The weekly review is a method author's recommendation; I looked for empirical studies testing whether it works and found none.

## Progressive summarization: add a layer only when you touch a note

Tiago Forte's [progressive summarization](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/) is often mistaken for a chore to do on a schedule. It compresses a note layer by layer: layer 0 is the original source; layer 1 is the passages you bring into your note app; layer 2 bolds the best parts of those; layer 3 highlights the best of the bold; layer 4, for only a few notes, is a short summary at the top in your own words; and layer 5, for a tiny minority, is a remix into something of your own.

The key is when to add a layer. Forte says he doesn't summarize notes on any schedule or in any order, only when he's already looking at a note for some other reason, adding one layer as he goes ([Forte, Part II](https://fortelabs.com/blog/progressive-summarization-ii-examples-and-metaphors/)). Many notes will never be summarized, which in his view is what keeps your attention on the notes that are actually valuable. He also warns that the more you highlight, the harder it becomes to spot what matters at a glance ([Forte, Part III](https://fortelabs.com/blog/progressive-summarization-iii-guidelines-and-principles/)).

So progressive summarization doesn't belong in the weekly review. One more distinction: the bolding and highlighting in layers 1 to 3 are for finding things later; the sentence in your own words from order 1 is closer to layer 4. Highlighting alone doesn't count as writing that sentence.

## Deleting, archiving and demoting

Deleting things is hard. Forte suggests letting what you don't use sink out of sight rather than deciding item by item whether to delete it ([Forte, Part II](https://fortelabs.com/blog/progressive-summarization-ii-examples-and-metaphors/)). Research points in a similar direction. In a 2009 experiment by Bergman and colleagues, participants were given a "demote" option that moved unimportant files to a gray area at the bottom of a folder, instead of only keeping or deleting them. They demoted more than twice as many files as they deleted, and their folders ended up less cluttered ([Bergman et al. 2009](https://doi.org/10.1145/1518701.1518745)).

Here's how I'd split things:

- **Delete**: duplicates, things superseded by a newer version, things you can't name a use for.
- **Archive**: finished projects and areas you're no longer responsible for; as in order 2, move the whole folder into the archive.
- **Demote**: things you're not sure about. Move them to a "cold storage" folder or give them a `#cold` tag: not deleted, just out of sight.

## What an LLM can take over

The short version: hand an LLM the jobs where you still look at its output and decide what to accept; keep writing the sentence in your own words and judging what matters for yourself. The studies below measured how much people learned or whether they checked AI output; none tested note organizing directly, so the division of labor that follows is my suggestion based on them.

| Study | What it did | Result |
|---|---|---|
| [Chen et al. 2025](https://doi.org/10.1145/3757632) | 30 students watched lecture videos with three kinds of AI help: a transcript, a short summary every 15 seconds, or complete notes every minute or two | The short-summary group scored highest on a closed-book test and the complete-notes group lowest; participants edited 40% of short summaries but only 8% of complete notes. No condition without AI |
| [Melumad & Yun 2025](https://doi.org/10.1093/pnasnexus/pgaf316) | Seven experiments with over 10,000 people, learning a topic and then writing advice for a friend | People who learned with ChatGPT wrote shorter and more similar advice than those who searched themselves |
| [Etkin et al. 2025](https://doi.org/10.3389/feduc.2025.1506752) | 195 college-age participants read ACT passages with four AI tools | Grouped by independent admissions-test scores, stronger readers did worse when an AI summary replaced the passage, while a Socratic dialogue bot helped weaker readers |
| [Lee et al. 2025](https://doi.org/10.1145/3706598.3713778) | 319 people who use generative AI at work described 936 real examples | The more confident they were that the AI could do a task, the less they reported thinking critically about it; all self-report |
| [Huq et al. 2025](https://doi.org/10.1145/3708359.3712086) | 12 people used NoTeeline: they typed a few words per key point and the AI expanded them into full notes | They typed about half as much, and all wanted to keep using it; learning wasn't measured |

Two notes on this table. First, the Etkin paper's headline conclusion is that "AI helps weaker readers and hurts stronger ones", but it grouped participants by their score on the passage read without AI and then used that same score as the baseline. People who happened to score low on one passage tend to score higher on the next anyway, so that grouping produces a "helps the weak, hurts the strong" pattern by itself. That's my reading of the paper; the authors don't discuss it. So I cite only the two findings that held up when participants were grouped by independent test scores. Second, only Chen's study has data on preference: participants rated complete notes more highly than the transcript alone.

Here's how I'd split the work:

| Hand to an LLM | Keep for yourself |
|---|---|
| Listing each inbox item's possible uses or possible duplicate notes, so you can decide what to keep | The one sentence in your own words for each note (order 1) |
| Finding duplicate or near-duplicate notes | Deciding what matters and what can go |
| Suggesting possibly related notes | The reason for each link (order 3) |
| Expanding key points you've written into full sentences | Reading the original, not just the summary |
| Turning meeting recordings into transcripts | Checking that the AI's summaries and links are right |

What the left column has in common: you still look at the result and decide whether to accept it. The steps on the right are where learning happened in Chen's and Etkin's studies. No study has yet tested the items on the left; they're my suggestion.

**Think about privacy first.** Handing your whole note collection to a cloud LLM to find duplicates and suggest links means sending your notes to someone else's servers, which is a different thing from the "your data stays with you" idea in [order 4](/posts/learning/2026-10-22-obsidian-notion-tool-choice-en). If you keep a private journal or confidential work notes, give the LLM only specific folders, or use a model that runs on your own computer.

For approaches that hand much more of the organizing to an LLM, such as having a model compile a batch of material into a wiki, see [Three Modes of LLM Knowledge Bases](/posts/ai/2026-04-03-llm-knowledge-vault-en) and [the LLM knowledge management landscape](/posts/ai/2026-04-23-llm-knowledge-management-landscape-en).

## Example: a 30-minute weekly review

**Minutes 0–15: empty the inbox (Get Clear).** Using order 1's three-step test, decide for each item whether it goes into the knowledge base, gets kept as a link only, goes on the to-read list, or gets deleted. You can have an LLM first list each item's possible uses and any similar older notes; you go through them and decide. Don't let it write the sentence in your own words.

**Minutes 15–25: projects and the to-read list (Get Current).** Open the "Projects" folder. For projects that ended this week, pull out what you'll use again, move it to Resources or Areas, and archive the rest. Delete or demote anything on the to-read list that's gone unread for more than two weeks.

**Minutes 25–30: think about something new (Get Creative).** Open an MOC, look at its "Not yet worked out" section, pick one question, and write down what you think now, a sentence or two; carry on next week.

The timings are my suggestion; adjust them to how many notes you have. What matters is having all three parts: clearing, catching up and new thinking.

## The personal part at a glance

| What | When | Post |
|---|---|---|
| Keep: decide with the three-step test | When saving, or when clearing the inbox each week | Order 1 |
| Place: shallow folders, not too full | When dealing with projects each week | Order 2 |
| Link: give reasons; make an MOC when notes pile up | Whenever you write a permanent note | Order 3 |
| House: export once and check proprietary features | Quarterly | Order 4 |
| Maintain: weekly review; summarize only when you touch a note | Weekly, and whenever you open a note | Order 5 |

## When a colleague is the reader

[Order 0](/posts/learning/2026-10-22-knowledge-base-three-readers-en)'s example was a personal note: "Leave: ask HR, form pinned in Slack." For you, that's enough, because you remember which HR person and which channel. Move it to a team wiki, and when a new colleague reads it, "I know what this means" no longer holds: they don't know whom to ask or which channel, or whether this is last year's rule.

Once the reader changes from you to a colleague, all four questions from these five posts need answering again: what to keep, how to organize it, how others will find it, and who maintains it. That's the subject of the team part, starting with order 6, Why Team Knowledge Bases Rot, and Which Documents to Write (in progress).

## Limits of the research

The weekly review and progressive summarization are method authors' recommendations; I found no empirical studies testing them. The research on AI and notes consists mostly of single, short sessions: Chen's study used lectures of about ten minutes and Etkin's used single reading passages, both with immediate tests, no follow-up weeks later, and nothing like maintaining a knowledge base over time. Lee's study is entirely self-report.

## What you can do tonight

1. **Put 30 minutes a week in your calendar.** Call it "notes review" and follow the three parts above.
2. **Make a cold-storage area.** A folder or a tag for things you're not sure you want to delete.
3. **Check your AI tool.** If it generates summaries or notes automatically, next time you use it, rewrite at least one part in your own words.
4. **Decide which notes no cloud LLM gets to read.** Put them in a separate folder.

## Self-check

**Q:** What's the risk in letting an LLM tag every note automatically?

**How to judge:** There are two. First, the tags lose their meaning as your categories: as order 2 explained, people find their own things by remembering where they put them, and you won't remember tags you didn't choose, so you won't use them to search. Second, mistakes are hard to spot: Lee and colleagues found that the more confident people are in the AI, the less they report checking it themselves, and something as trivial-seeming as tags is the easiest thing to skip. A better approach is to have the LLM suggest tags that you review one by one before accepting, or, following order 2, to use tags only for status such as "to read" or "in progress" and leave categorizing to folders and links.

## References

- [Van Kleek, Bernstein, Panovich, Vargas, Karger & schraefel 2009, Note to self: examining personal information keeping in a lightweight note-taking tool (CHI 2009)](https://doi.org/10.1145/1518701.1518924)
- [GTD Weekly Review Checklist (David Allen Company)](https://gettingthingsdone.com/wp-content/uploads/2014/10/Weekly_Review_Checklist.pdf)
- [Tiago Forte, Progressive Summarization: A Practical Technique for Designing Discoverable Notes](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/)
- [Tiago Forte, Progressive Summarization II: Examples and Metaphors](https://fortelabs.com/blog/progressive-summarization-ii-examples-and-metaphors/)
- [Tiago Forte, Progressive Summarization III: Guidelines and Principles](https://fortelabs.com/blog/progressive-summarization-iii-guidelines-and-principles/)
- [Bergman, Tucker, Beyth-Marom, Cutrell & Whittaker 2009, It's not that important: demoting personal information of low subjective importance using GrayArea (CHI 2009)](https://doi.org/10.1145/1518701.1518745)
- [Chen et al. 2025, More AI Assistance Reduces Cognitive Engagement: Examining the AI Assistance Dilemma in AI-Supported Note-Taking (CSCW 2025)](https://doi.org/10.1145/3757632)
- [Melumad & Yun 2025, Experimental evidence of the effects of large language models versus web search on depth of learning (PNAS Nexus)](https://doi.org/10.1093/pnasnexus/pgaf316)
- [Etkin et al. 2025, Differential effects of GPT-based tools on comprehension of standardized passages (Frontiers in Education)](https://doi.org/10.3389/feduc.2025.1506752)
- [Lee et al. 2025, The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers (CHI 2025)](https://doi.org/10.1145/3706598.3713778)
- [Huq et al. 2025, NoTeeline: Supporting Real-Time, Personalized Notetaking with LLM-Enhanced Micronotes (IUI 2025)](https://doi.org/10.1145/3708359.3712086)
