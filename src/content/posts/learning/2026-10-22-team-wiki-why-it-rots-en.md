---
title: "Why Team Wikis Rot, and Which Kinds of Documents to Write"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, wiki, documentation, diataxis]
lang: en
tldr: "Research on rotting team wikis keeps finding three things: gaps and outdated pages are complained about more often than wrong ones; the people who write have no time or have left; and managers want something different from the people who actually write. Not every wiki rots: wikis hold up better when the writers are also the readers, or when the documents solve a clear problem. Diátaxis sorts documents into four kinds (tutorials, how-to guides, reference and explanation), and two questions tell you which kind a document should be, so you can see which kind your team is missing."
description: "Building Knowledge Bases, order 6: three ways team wikis rot and the research behind them, which wikis hold up, why personal notes moved to a team aren't enough, the four Diátaxis document types and how to tell them apart, and an item-by-item diagnosis of a team wiki homepage."
series:
  name: "Building Knowledge Bases"
  order: 6
---

> 🌏 [中文版](/posts/learning/2026-10-22-team-wiki-why-it-rots)

A new colleague asks in the group chat, for the third time, how to request annual leave. The wiki does have a page, but it describes the process from two years ago, and the person who wrote it has left. Many teams will recognize this. In Stack Overflow's 2024 developer survey, seven in ten respondents said they know where to find answers, but fewer than half agreed they can find up-to-date information ([Stack Overflow 2024](https://survey.stackoverflow.co/2024/professional-developers)).

This is the first post in the team part of "Building Knowledge Bases", where the reader changes from yourself to your colleagues. As [order 0](/posts/learning/2026-10-22-knowledge-base-three-readers-en) said, the first post of each part assumes only that you've read the overview; having read the personal part (orders 1 to 5) helps but isn't required. This post covers why team wikis rot and which kinds of documents a team should write. How to arrange pages into layers is order 7, how to write the pages is order 8, and how to keep them maintained is order 9. By the end you'll be able to sort your team's existing documents into four kinds and see which kind is missing.

## Three ways wikis rot

**1. Gaps and outdated pages come up more often than wrong ones.** Aghajani and colleagues collected 824 items discussing documentation problems from open-source mailing lists, issue trackers, Stack Overflow and similar places in 2019 ([Aghajani et al. 2019](https://emadpres.github.io/pdfs/icse2019.pdf)). Among the items about content, the most common problem was incompleteness, followed by being out of date; actual errors were a small share. The authors define "outdated" as documentation that was once correct, until the system changed and the documentation didn't. They also found that half of the usability problems were documentation that existed but couldn't be found; in their words, documentation nobody can find "conceptually does not exist".

Asking practitioners gives a somewhat different ranking. In 2020 the same group surveyed 146 practitioners, most from a single company, and the issue most often marked as important was unclear documentation, followed by new features having no documentation ([Aghajani et al. 2020](https://doi.org/10.1145/3377811.3380405)). Taken together, the problems raised most often aren't errors; they're content that was never written, never updated, can't be understood or can't be found.

**2. The writers have no time, or they've left.** In the Aghajani 2020 survey, the only documentation-process problem that a majority reported was having no time to write. [Order 0](/posts/learning/2026-10-22-knowledge-base-three-readers-en) mentioned the company studied by Stocker and Tochtermann: most of the administrative articles were written by one core member on others' behalf, and after that person left, that section slowly stopped working ([Stocker & Tochtermann 2011](https://doi.org/10.1007/978-3-642-19032-2_22)). Galan's 2023 review of 91 empirical studies on knowledge lost through employee turnover found that the organizations studied often had no preventive strategy and improvised after someone had left ([Galan 2023, Part II](https://doi.org/10.1108/TLO-09-2022-0108)). Writing things down suits knowledge that can be stated explicitly, provided it comes with guidance on how to use it; for more complex knowledge, the studies point to person-to-person approaches such as workshops and mentoring.

The Google-run DORA 2023 report saw a related pattern: where teams had formal processes for distributing work fairly, including documentation work, respondents rated their documentation quality significantly higher ([DORA 2023](https://dora.dev/research/2023/dora-report/2023-dora-accelerate-state-of-devops-report.pdf)). In other words, someone has to be responsible for writing; I'd suggest not relying on enthusiasm alone.

**3. Managers and writers want different things.** Grudin of Microsoft Research and Poole of Georgia Tech obtained usage data on thousands of enterprise wikis, and most had fallen out of use quickly ([Grudin & Poole 2010](https://doi.org/10.1145/1832772.1832780)). One cause they saw was mismatched expectations: managers wanted a project-status dashboard, while the people actually writing did so when they had time and felt it was worth it, and updated less, not more, near deadlines. Managers also contributed less content than developers and testers. The authors recommend bringing managers' expectations into a realistic range before introducing a wiki.

## Not every wiki rots

These three failure modes aren't inevitable. In the same company, Stocker and Tochtermann saw the technical section stay current: engineers wrote those articles and used them themselves. Grudin and Poole also saw successes, mostly in new teams with tight schedules and no established communication channels, such as a new team that had to produce a large body of documentation from scratch in four months. Ahmeti and colleagues introduced architecture decision records into two software teams for three months in 2024, and afterwards most members said they were satisfied; the keys were a set place to store them and clear guidance on what to record ([Ahmeti et al. 2024](https://doi.org/10.1007/978-3-031-70797-1_22)). The study was short, though, so it can't show whether the practice lasts.

What these cases share: the writers are also the readers, or the documents solve a problem everyone can feel.

## Why personal notes moved to a team aren't enough

Many of the practices from the personal part fall short once the readers are a team:

| Personal notes | Team wiki |
|---|---|
| "Leave: ask HR, form pinned in Slack" is enough | Has to say whom to ask, which channel, and until when it applies |
| You remember where you put things | Readers didn't take part in sorting, so they can only search or browse the table of contents |
| You decide when to tidy up | Someone has to be responsible, or nobody will update it |
| Written for yourself, keywords are fine | Written for people with different goals: some want to learn, some want to look something up, some want to follow steps |

That last row is where the four kinds of documents below come in.

## Which kinds of documents to write: Diátaxis

[Diátaxis](https://diataxis.fr/) is a documentation framework proposed by Daniele Procida that splits documentation into four kinds, each answering a different need:

| Type | What the reader is doing | Question it answers | Example |
|---|---|---|---|
| Tutorial | Learning | "Can you teach me to…?" | New hire's first week: build a first feature from scratch |
| How-to guide | Working, getting something done | "How do I…?" | How to deploy a service to production |
| Reference | Working, looking up a fact | "What is…?" | API specification, table of configuration parameters |
| Explanation | Wanting to understand | "Why…?" | Why we chose this database |

Two questions are enough to tell them apart: does the content tell the reader **how to do** something, or help them **know** something? Is the reader **studying**, or **working**? The author calls this the compass ([The compass](https://diataxis.fr/compass/)). He also points out that the most common confusion is mixing tutorials and how-to guides, and that the difference between them isn't basic versus advanced; it's whether the reader is learning or getting work done.

Two things to know when you use Diátaxis. First, the author explicitly argues against creating four empty sections up front; he recommends starting from your existing documents and improving one small piece at a time. Second, it only tells you which kind a document should be; it doesn't deal with whether the content is correct or current. Outdated pages need the maintenance practices in order 9. Also, it was designed for a software product's external documentation, so applying it to a team's internal documents is an extension.

Teams also keep one common kind of document that Diátaxis doesn't treat separately: **decision records**, which note why a decision was made at the time. They're closest to explanation, and order 8 covers how to write them.

## Example: a team wiki homepage, diagnosed item by item

Suppose your team wiki's homepage has these pages:

| Page | Which kind | Diagnosis |
|---|---|---|
| New hire environment setup | Tutorial and how-to mixed together | Split it: a version new hires learn from on day one, and a version experienced people follow when they get a new laptop |
| API docs | Reference | Confirm who updates it and when it was last updated |
| Deployment SOP | How-to guide | Good; check that the steps still match the current system |
| System architecture | Explanation | Add "why it was designed this way", not just a diagram |
| 2024 Q3 meeting notes | None of them | Move to an archive; rewrite the important decisions as decision records |
| FAQ | Mixed | Decide which kind each question is and move it to the matching page |

Looking at it this way, the team is short on two kinds: there is no standalone tutorial, so new hires have to work through the mixed setup page, and the only explanation is an architecture diagram that doesn't say why.

## Limits of the research

Most of the documentation research cited above comes from software development: both Aghajani papers look at open-source and software-company documentation. The Stack Overflow and DORA numbers are self-reported surveys, and Stack Overflow itself sells an internal knowledge-sharing product. Research on enterprise wikis is mostly interviews and case studies. Diátaxis is its author's framework; the evidence on its site is testimonials from adopters, not controlled studies.

## What you can do tonight

1. **List the ten most-opened pages on your team wiki.** If the tool shows view counts, sort by them; if not, ask three colleagues which pages they open most.
2. **Use the two questions on each page to decide which kind it is.** How to do, or to know? Studying, or working?
3. **Find the missing kind.** Whichever of the four is scarcest is where I'd start.
4. **Put an owner on every page.** Don't change the content yet; just write a name at the top. Order 9 covers how to make that name actually mean something.

## Self-check

**Q:** Should the "New hire environment setup" page be a tutorial or a how-to guide?

**How to judge:** It depends on whether the reader is learning or getting work done. A new hire in their first week is learning: they need to be walked step by step to a working environment and understand what each step does along the way, which is a tutorial. A colleague who already knows the setup and has a new laptop is working: they just want to follow the steps and get the environment installed, without explanations, which is a how-to guide. The same topic may need two documents; squeeze them into one and both kinds of reader will find it awkward.

## References

- [Stack Overflow Developer Survey 2024: Professional Developers](https://survey.stackoverflow.co/2024/professional-developers)
- [Aghajani et al. 2019, Software Documentation Issues Unveiled (ICSE 2019)](https://emadpres.github.io/pdfs/icse2019.pdf)
- [Aghajani et al. 2020, Software Documentation: The Practitioners' Perspective (ICSE 2020)](https://doi.org/10.1145/3377811.3380405)
- [Stocker & Tochtermann 2011, Enterprise Wikis: Types of Use, Benefits and Obstacles: A Multiple-Case Study (IC3K 2009, CCIS 128)](https://doi.org/10.1007/978-3-642-19032-2_22)
- [Galan 2023, Knowledge loss induced by organizational member turnover: a review of empirical literature (Part I) (The Learning Organization)](https://doi.org/10.1108/TLO-09-2022-0107)
- [Galan 2023, Knowledge loss induced by organizational member turnover (Part II) (The Learning Organization)](https://doi.org/10.1108/TLO-09-2022-0108)
- [DORA 2023, Accelerate State of DevOps Report](https://dora.dev/research/2023/dora-report/2023-dora-accelerate-state-of-devops-report.pdf)
- [Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010)](https://doi.org/10.1145/1832772.1832780)
- [Ahmeti et al. 2024, Architecture decision records in practice: an action research study (ECSA 2024)](https://doi.org/10.1007/978-3-031-70797-1_22)
- [Diátaxis](https://diataxis.fr/)
- [Diátaxis: The compass](https://diataxis.fr/compass/)
