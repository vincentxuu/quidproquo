---
title: "A Global Map of AI and CS Courses: Which Ones Can You Actually Study in Public?"
date: 2026-08-21
category: learning
tags: [ai-course, cs-course, learning-path, self-study, open-course]
lang: en
series:
  name: "Global AI and CS Course Maps"
  order: 0
type: guide
tldr: "This map audits AI and CS courses at Stanford, CMU, MIT, and UC Berkeley in 2025–2026 using four access labels: A0 for a visible catalog entry, A1 for a public syllabus, A2 for partial materials, and A3 for a self-study-ready package. A course site or YouTube playlist can exist without giving outsiders access to the current videos, assignments, or starter code."
description: "A 2025–2026 guide to AI and CS course access at Stanford, CMU, MIT, and UC Berkeley, distinguishing complete self-study courses from public syllabi, partial materials, historical videos, and gated LMS resources."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-global-ai-cs-course-map)

Search for Stanford CS229, Berkeley CS188, or MIT deep learning and you will quickly find course sites, YouTube videos, and community notes. The hard question comes next: **do those resources belong to the same semester? Do they still open without a university account? Does the assignment link include starter code and required assets, or only a prompt?**

This map starts with Stanford, Carnegie Mellon University (CMU), MIT, and UC Berkeley, covering **2025–2026**. A complete 2026 edition takes priority. If the new semester has only a schedule or keeps video inside an LMS while an official 2025 edition is materially more complete, the 2025 edition can be the main version. Every course guide names its semester; it will not quietly combine 2025 video with 2026 assignments.

This is not a university ranking. It answers two narrower questions: how each school organizes AI and CS, and how much of that structure an outsider can actually use.

## Public is not yes or no

“Public course” can refer to at least seven different things: a catalog description, syllabus, slides, assignment prompts, starter code, solutions, or recordings. Publishing one of them is enough for a search engine to surface the site. It is not enough to let someone complete the course.

This site uses four editorial labels. They are not university ratings; they limit what an article is allowed to promise.

| Label | What an outsider gets | What a guide may promise |
|---|---|---|
| A0: catalog visible | Title, units, description | Only the course's place in the map |
| A1: syllabus visible | Syllabus, weekly topics, readings | Scope analysis, not assignment experience |
| A2: materials partly open | Lectures, some assignments, or video | A topic-focused reading guide with explicit gaps |
| A3: self-study ready | Systematic materials, assignments, and required assets | A complete self-study path |

Video is not required for A3. Complete notes, assignments, starter files, and a clear sequence can be enough. The reverse also holds: a YouTube playlist without practice material does not automatically make a course self-study ready.

**Try this**: when you find an “open course,” do not press play yet. Spend five minutes locating its syllabus, first assignment, and starter code. Decide whether to invest dozens of hours only after all three checks.

## Tier one: courses you can follow end to end

One of the cleanest examples is [MIT 6.S191: Introduction to Deep Learning](https://introtodeeplearning.com/). Its official 2026 site publishes nine videos, slides, and three software labs. The [2025 archive](https://introtodeeplearning.com/2025/index.html) keeps ten videos and three labs. It is highly usable for self-study, with one important qualifier: this is an intensive bootcamp, not a semester-long deep learning course.

[Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/) is also close to fully public. Its site exposes slides, textbook chapters, discussion material, six Pacman projects, and lecture videos. Ed, official grades, and staff support remain for enrolled students, but outsiders can still follow the main learning path. The site's [CS188 Spring 2026 overview](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en) already maps all six projects and a suggested study order.

Stanford is not a collection of isolated recordings either. The [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en) orders the route from CS106A through CS336 by official prerequisites. [CS336 Spring 2026](https://cs336.stanford.edu/) publishes lecture material and five GitHub assignments, while Stanford Online carries official Spring 2025 recordings. Its constraint is compute rather than URLs: open materials do not make every assignment free to run.

Courses in this tier are the best candidates for single-course guides because an article can connect what to learn, what to build, and where to begin into one path that works.

## Tier two: current material with one missing piece

[Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/) publishes slides on post-training, RAG, reasoning, and agents, along with three assignments and a project brief. The missing piece is video. The semester's YouTube playlist exists, but anonymous access returns `UNPLAYABLE`, matching the course site's Berkeley-login notice. The material supports a reading guide; it does not support the claim that the current recordings are public. The [CS288 guide series](/posts/learning/2026-08-22-berkeley-cs288-overview-en) was written within exactly that boundary.

[Berkeley CS285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/) publishes slides for twenty-five lectures, five assignments, and GitHub starter code. Current recordings sit in bCourses. The official site also links older public recordings, so a defensible guide should analyze the 2026 material and place historical video in a separate alternative-resources box with the year shown. The [CS285 guide series](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en) follows that principle.

[MIT 6.7960 Fall 2025](https://deeplearning6-7960.github.io/) publishes a complete schedule, slides, readings, and PyTorch Colabs, while problem sets live in Gradescope and solutions in Canvas. This series labels it A2: enough for a deep reading of course design, not enough to promise the enrolled experience.

**Try this**: define the result you want before choosing an A2 course. Slides and readings may be sufficient for understanding a topic. Missing prompts, datasets, or graders are a stop signal if your goal is to complete every assignment.

## Tier three: a curriculum in transition, or a semester not yet released

CMU is the school where old course numbers are most misleading. The new [07-280 AI & ML I](https://www.cs.cmu.edu/~07280/) integrates search, machine learning, LLMs, and reinforcement learning, followed by 07-380 AI & ML II. Its official FAQ explains that the sequence replaces 15-281 and 10-315. Spring 2026 materials for 15-281 remain useful, but the retired course no longer represents CMU's current AI trunk. The [CMU AI/ML course map](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en) lays out a self-study route under the new curriculum, and the transition itself is covered in ["CMU's AI core redesign"](/posts/learning/2026-08-22-cmu-ai-core-redesign-en).

As of August 21, 2026, the Fall 2026 schedule for 07-280 is online, but most lecture material and assignment links have not been released. The honest move is to explain the transition in the CMU map and audit the course again after teaching starts—not race to publish a “complete guide” to an empty shell.

[11-785 Introduction to Deep Learning](https://deeplearning.cs.cmu.edu/S26/index.html) illustrates a different boundary. Both Spring 2026 and [Fall 2025](https://deeplearning.cs.cmu.edu/F25/index.html) link official YouTube recordings lecture by lecture, and slides are public. Assignments, however, span Autolab, Kaggle, and Piazza. Video access is confirmed; complete self-study still depends on auditing each starter asset.

A future or in-progress semester does not become the “latest public course” merely because its schedule exists. This series waits for the material to appear instead of replacing complete content with a newer year.

## How to read the four schools

| School | The map's central question | Best current public entry points |
|---|---|---|
| [Stanford](/posts/learning/2026-08-20-stanford-cs-course-map-en) | How do systems and mathematical foundations lead into research-level AI? | CS221, CS336 |
| [CMU](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en) | How does the new 07-280/07-380 sequence connect to ML, DL, NLP, and systems? | 10-301/601 and 11-785; recheck 07-280 after Fall 2026 material appears |
| [MIT](/posts/learning/2026-08-21-mit-ai-ml-course-map-en) | How do current numbers, semester sites, and historical OCW editions line up? | 6.S191; 6.7960 as an A2 material guide |
| [Berkeley](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en) | How do CS188 and CS189 branch into NLP, RL, and vision? | CS188; material-focused guides to CS288 and CS285 |

The series later added a fifth school: the [Harvard AI/ML course guide](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) checks which recordings CS50 AI actually reuses and how much of CS181 and CS182 is open.

A school map and a single-course guide make different promises. Even when every learning asset is locked in an LMS, current catalogs, program requirements, and schedules may still support a course map. That article can explain how to choose courses; it cannot promise that a reader can complete them without enrolling.

## Where CSDIY fits

[CSDIY](https://csdiy.wiki/) is useful for answering which edition a community has actually tried to study. It often preserves historical recordings, assignment experience, and supplementary resources that a university schedule will never mention.

It cannot by itself prove that a course still runs in 2026, that the current link allows anonymous access, or that a third-party video is official or openly licensed. Conversely, a course missing from CSDIY may still have enough official material for self-study.

The series therefore uses two evidence tracks: official sources establish current offerings and access; CSDIY adds historical versions and community experience. Neither replaces the other. How Berkeley CS188 and CMU 15-281 ended up sharing one set of Pacman projects can only be reconstructed from community records — that lineage gets its own article, ["The Pacman AI project lineage"](/posts/learning/2026-08-22-pacman-ai-project-lineage-en).

## Where this series stands

Four school maps are done: [Stanford](/posts/learning/2026-08-20-stanford-cs-course-map-en), [CMU](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en), [MIT](/posts/learning/2026-08-21-mit-ai-ml-course-map-en), and [Berkeley](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en), plus a Harvard edition. Single-course guides have started too:

- [Berkeley CS188 Spring 2026 overview](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en), with guides covering search, MDPs, Bayes nets, and machine learning
- [Berkeley CS285 Spring 2026 overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en), with guides from imitation learning and policy gradients through offline RL
- [Berkeley CS288 overview](/posts/learning/2026-08-22-berkeley-cs288-overview-en), from foundations and transformers to agents
- [CMU 10-301/601 overview](/posts/learning/2026-08-22-cmu-10301-overview-en), walking the whole course through nine assignments

Still unwritten: single-course guides for MIT 6.S191, CMU 11-785, and MIT 6.7960.

If you want one course to start tonight, run a small test: open MIT 6.S191's first lab or Berkeley CS188's first project and give yourself ninety minutes. If you can still state what the environment is missing and what you would do next, the course belongs on your learning plan. Saving a playlist is not a start.

## Update log

- 2026-08-26: The follow-up articles (four school maps, Harvard, and the CS188 / CS285 / CS288 / 10-301 guide series) are now live. Added inline links throughout, replaced "What comes next" with a current-state list, and restructured References into site articles versus official sources.

## References

### Site series articles

- [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- [CMU AI/ML course map](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en)
- [MIT AI/ML course map](/posts/learning/2026-08-21-mit-ai-ml-course-map-en)
- [Berkeley AI/ML course map](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en)
- [Harvard AI/ML course guide](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)
- [CMU's AI core redesign: from 15-281 + 10-315 to 07-280 + 07-380](/posts/learning/2026-08-22-cmu-ai-core-redesign-en)
- [The Pacman AI project lineage](/posts/learning/2026-08-22-pacman-ai-project-lineage-en)
- [Berkeley CS188 Spring 2026 overview](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en)
- [Berkeley CS285 Spring 2026 guide series overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)
- [Berkeley CS288 Spring 2026 guide series overview](/posts/learning/2026-08-22-berkeley-cs288-overview-en)
- [CMU 10-301/601 machine learning guide overview](/posts/learning/2026-08-22-cmu-10301-overview-en)

### Official course sites and external resources

- [Stanford CS336 Spring 2026](https://cs336.stanford.edu/)
- [CMU 07-280 AI & ML I](https://www.cs.cmu.edu/~07280/)
- [CMU 11-785 Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [MIT 6.S191 Introduction to Deep Learning](https://introtodeeplearning.com/)
- [MIT 6.S191 2025 archive](https://introtodeeplearning.com/2025/index.html)
- [MIT 6.7960 Deep Learning Fall 2025](https://deeplearning6-7960.github.io/)
- [Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [Berkeley CS285 Spring 2026](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [Berkeley CS288 Spring 2026](https://cal-cs288.github.io/sp26/)
- [CSDIY](https://csdiy.wiki/)
