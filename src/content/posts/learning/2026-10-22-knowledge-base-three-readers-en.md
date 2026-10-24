---
title: "Building a Knowledge Base: Four Questions for Personal Notes, Team Wikis and AI Knowledge Bases"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, personal-information-management, note-taking, wiki, rag]
lang: en
tldr: "Personal notes, a team wiki and a knowledge base for AI differ in who reads them: your future self, your colleagues, a model. All three have to answer what to keep, how to organize it, how it gets found and who maintains it. Research on personal collections finds that most 'finding' is re-finding things you have already seen; research on enterprise wikis finds that once the person who tidied or wrote the content leaves, it starts to decay."
description: "Overview of the Building Knowledge Bases series: personal notes, team wikis and AI knowledge bases told apart by their reader, the four questions they share, how they overlap, and where to start in the 20-post series."
series:
  name: "Building Knowledge Bases"
  order: 0
---

> 🌏 [中文版](/posts/learning/2026-10-22-knowledge-base-three-readers)

Three familiar scenes. You save a good article to Notion, need it three months later, search for a while, give up and Google it again. A new colleague asks the team chat "how do I request annual leave?" for the third time, because the wiki page describes the process from two years ago. Someone asks the company's AI assistant the same question, and it quotes that old page, confidently and wrongly.

All three have the same cause: things were saved, but when they were needed they couldn't be found, or were found but couldn't be trusted. In 2004 the British researchers [Boardman and Sasse](https://doi.org/10.1145/985692.985766) interviewed 31 people about how they managed their files, email and bookmarks. One participant's words became the paper's title: "stuff goes into the computer and doesn't come out – it just builds up".

In this series, a "knowledge base" means a body of material plus the practices that let it be found and trusted when it is needed. The series has three parts, written for the three people above: someone organizing their own notes, someone responsible for a team wiki, and an engineer who needs an AI to read company documents. It is not written for people comparing vector database performance or tuning retrieval parameters; that is what [The RAG Techniques Compendium](/posts/ai/2026-03-14-rag-patterns-complete-guide-en) is for. This post is the overview: how the three kinds differ, the four questions they share, and where to start among the 20 posts.

## Three readers

The reader decides what shape a knowledge base takes. Take one piece of content, "how to request annual leave":

| | Reader | What the reader brings | How it usually breaks |
|---|---|---|---|
| Personal notes | Your future self | Remembers why it was saved and roughly where | Saved but not found, or forgotten entirely |
| Team wiki | Colleagues | Doesn't know your categories; can only search or browse | The author leaves and the content goes stale |
| AI knowledge base | A model | Sees only the text the system hands it | The answer isn't there, or it gets an old version, and answers anyway |

**Your future self** is the most forgiving reader. A note that says "Leave: ask HR, form pinned in Slack" is enough, because you remember the context. In 1983 [Malone](https://doi.org/10.1145/357423.357430) interviewed ten office workers about how they organized their desks. He found that desk piles did more than help people find things: they also reminded people of what still needed doing. Personal notes can be a little messy, as long as they still remind you.

**Colleagues** don't have your context. In the same study, Malone had a co-worker describe a document and then asked the desk's owner to find it. In about two-thirds of the cases, the document was filed under a different dimension from the one the co-worker used to describe it: the colleague named the title and author, say, but the document was filed by project. Filing "annual leave" under "HR / Benefits / Leave types" makes sense, but a new hire searches for "time off".

A team wiki also has a problem personal notes don't: authors leave. [Stocker and Tochtermann](https://doi.org/10.1007/978-3-642-19032-2_22) studied wikis at three Austrian companies. At one of them, the administrative staff wouldn't update the wiki themselves, so most of the administrative articles were written by a single core team member; after he left, they fell steadily out of date until most were useless. In the same wiki, the technical section, written and used by the technicians themselves, stayed current.

**A model** gets the least. It sees only the text the system puts in its prompt. It doesn't have your context, and unlike a new hire it won't notice that a page looks old. The most common setup is RAG (retrieval-augmented generation): documents are split into small chunks, and when a question comes in, the most relevant chunks are found and passed to the model. [Anthropic](https://www.anthropic.com/news/contextual-retrieval) gives an example: a line from a financial filing saying revenue grew 3% over the previous quarter no longer says which company or which quarter once it has been chunked out. Chunk out "Annual leave must be requested three days in advance" and the model can't tell whether it is the 2023 rule or this year's.

[Barnett and colleagues](https://arxiv.org/abs/2401.05856) at Deakin University catalogued failure points across three RAG projects. The first is that the answer isn't in the corpus at all, yet the system can be fooled into answering anyway. A person who can't find something in the wiki asks a colleague; a model that can't find it may simply produce an answer.

## The three readers overlap

These are not three separate worlds. Your Obsidian notes and your team's Notion may now be read by AI tools too, and a knowledge base built for AI is usually drawn from the same documents as the team wiki. So one document often has two or three readers at once: the page written for colleagues also has to make sense to a model, and personal notes handed to an AI have to survive being quoted out of context.

Letting a model read your documents doesn't always mean chunking and retrieval, either. The same 2024 Anthropic post points out that when a knowledge base is small enough to fit within what a model can read at once, you can simply put the whole thing in the prompt. That limit keeps changing as models do, so what matters is whether your material fits, not any fixed number. The AI part of the series starts from there.

## What separates a collection from a knowledge base

Personal information management (PIM) research breaks the activity into a few steps: deciding whether to keep something when you come across it (keeping), getting it back later (re-finding), and tidying or clearing out in between (maintenance). [Bruce, Jones and Dumais](https://informationr.net/ir/10-1/paper207.html), from the University of Washington and Microsoft Research, watched office workers save web pages. They saw many methods: bookmarks, emailing links to themselves, saving files, printing. They compared the methods on ten functions, such as whether they reminded people and how easy they were to maintain, but the ultimate test was the same: could the page be found again?

And most finding is re-finding something you have seen before. Reviewing research on searching personal collections, [Bendersky and colleagues](https://arxiv.org/abs/2412.12330) at Google DeepMind note that the typical retrieval task is re-finding known items. That differs from searching the web: you usually remember some cues, such as roughly who sent it or when, just not where it is.

So for a collection to become a knowledge base, at least two things need answers: how you will find each item later, and who keeps it trustworthy. Add "what to keep in the first place" at the start and "how to organize it" in the middle, and you have this series' four questions.

## Four questions

Whoever the reader is, four things need answers. Each of the three parts works through them once, a level deeper each time:

| Question | Personal (orders 1–5) | Team (orders 6–10) | AI (orders 11–19) |
|---|---|---|---|
| What to keep | Collector's fallacy, the inbox (1) | Which kinds of documents to write (6) | Test questions first, source inventory (11, 12) |
| How to organize it | Where things go, how they link (2, 3) | Information architecture, writing conventions (7, 8) | Parsing, security, metadata, chunking (13–16) |
| How it gets found | Search vs. navigation, tools (2, 4) | Search log analysis (10) | Retrieval and permission filtering (16, 17) |
| Who maintains it | Weekly review (5) | Owners, review dates, deletion (9) | Incremental sync, evaluation (18, 19) |

**What to keep** decides how hard the other three are. The personal part starts from "saved is not read"; the team part starts by deciding which kinds of documents to write; the AI part works backward, writing down the questions users will ask before deciding which documents to collect.

**How to organize it** is where research and how-to books disagree most. [Whittaker and colleagues](https://doi.org/10.1145/1978942.1979457) at IBM Research analyzed email re-finding by 345 users and concluded that "high filers were no more successful at finding messages than low filers". That doesn't mean organizing is useless: the same study found people organize their inboxes mainly to manage to-dos and avoid drowning, not to make things easier to find later.

**How it gets found:** individuals rely on memory cues, colleagues on navigation and search, models on retrieval and permission filters. Microsoft's [Stuff I've Seen](https://doi.org/10.1145/860435.860451) put the email, web pages and documents a person had seen into one index. Users reported finding things more easily; they often switched to sorting by date, and people's names turned up in many queries. Time and people are both useful cues for getting your own things back.

**Who maintains it** is the question most easily skipped. Boardman and Sasse's participants rarely tidied up; big clean-ups tended to happen at life changes such as starting a new job. Grudin, at Microsoft Research, and Poole, at Georgia Tech, [studied enterprise wikis](https://doi.org/10.1145/1832772.1832780) and describe one used by a 200-person team. The major contributor who kept its formatting tidy left, the project manager who took over was later reassigned, and although the wiki stayed busy, its content grew steadily messier. None of the people they interviewed mentioned pruning stale content as something they did. RAG systems likewise need ongoing calibration after launch: Barnett and colleagues conclude that a system's robustness is something it grows into in operation, not something you can design in from the start.

## What the how-to books and the research can each tell you

Most methods in this field come from authors who write books or teach courses, such as [Tiago Forte](https://fortelabs.com/blog/basboverview/)'s PARA and Building a Second Brain, or sites like [zettelkasten.de](https://zettelkasten.de/posts/collectors-fallacy/) that promote the Zettelkasten method. There is a logic to these practices, but I found no controlled studies comparing them with alternatives. Research has its own limits. Classic PIM studies usually have a dozen to a few dozen participants and mostly cover 2000s-era email and computer files; enterprise wiki research is mostly interviews and case studies; effectiveness numbers for RAG often come from vendors' own tests.

So every post keeps the two kinds of source apart and says so when they conflict. PARA, for instance, says to organize by actionability (projects, areas, resources, archives), while the email study above found that frequent filers were no better at finding things. But that was email, not a note-taking app, and whether one tells us anything about the other is a question for order 2.

## Where to start

| You are building | Start here | What this part covers |
|---|---|---|
| Your own notes | Order 1, [What to Keep: Collecting Is Not a Knowledge Base](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge-en) | What to keep, where to put it, how to link it, tools, maintenance (orders 1–5) |
| A team wiki | Order 6, [Why Team Wikis Rot, and Which Kinds of Documents to Write](/posts/learning/2026-10-22-team-wiki-why-it-rots-en) | Information architecture, writing conventions, ownership, search (orders 6–10) |
| A knowledge base for AI | Order 11, [What's Different When AI Reads Your Knowledge Base: Write the Test Questions First](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first-en) | Source inventory, parsing, security, metadata, chunking, permissions, updates, evaluation (orders 11–19) |

The series is being published in order, with the personal part first. The first post of each part assumes only this overview, so you can skip straight to the part you need. If you are building an AI assistant, read the team part too: what the model reads is mostly the documents in your team wiki, and if those are stale or unfindable, no amount of retrieval tuning will make up for it. For using an LLM to organize personal knowledge, see [Three Modes of LLM Knowledge Bases](/posts/ai/2026-04-03-llm-knowledge-vault-en).

## Self-check

**Q:** Does saving 300 web articles into Notion count as a knowledge base?

**How to judge:** Ask yourself two questions. Three months from now, when you need one of them, what cue will you use to find it? Who removes the outdated ones, and how often? If you can't answer either, it is still a collection. If you can answer only the first, it is a searchable collection that will slowly go stale; if only the second, it is a tidy collection in which you can't find anything. If you can answer both, it is starting to look like a knowledge base, and the rest of the series is about filling in those two answers.

## References

- [Boardman & Sasse 2004, "Stuff goes into the computer and doesn't come out": A cross-tool study of personal information management (CHI 2004)](https://doi.org/10.1145/985692.985766)
- [Malone 1983, How do people organize their desks? (ACM TOIS)](https://doi.org/10.1145/357423.357430)
- [Stocker & Tochtermann 2011, Enterprise Wikis: Types of Use, Benefits and Obstacles: A Multiple-Case Study (IC3K 2009, CCIS 128)](https://doi.org/10.1007/978-3-642-19032-2_22)
- [Anthropic 2024, Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [Barnett et al. 2024, Seven Failure Points When Engineering a Retrieval Augmented Generation System (CAIN 2024; arXiv:2401.05856)](https://arxiv.org/abs/2401.05856)
- [Bruce, Jones & Dumais 2004, Information behaviour that keeps found things found (Information Research 10(1))](https://informationr.net/ir/10-1/paper207.html)
- [Bendersky, Metzler, Najork & Wang, Searching Personal Collections, in Information Retrieval: Advanced Topics and Techniques (ACM Press, 2025); arXiv:2412.12330](https://arxiv.org/abs/2412.12330)
- [Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011)](https://doi.org/10.1145/1978942.1979457)
- [Dumais et al. 2003, Stuff I've Seen: A System for Personal Information Retrieval and Re-Use (SIGIR 2003)](https://doi.org/10.1145/860435.860451)
- [Grudin & Poole 2010, Wikis at Work: Success Factors and Challenges for Sustainability of Enterprise Wikis (WikiSym 2010)](https://doi.org/10.1145/1832772.1832780)
- [Tiago Forte, Building a Second Brain: The Definitive Introductory Guide](https://fortelabs.com/blog/basboverview/)
- [zettelkasten.de, The Collector's Fallacy](https://zettelkasten.de/posts/collectors-fallacy/)
