---
title: "CMU's AI Degrees: The First U.S. AI Bachelor's Turned 'What Should AI Students Learn?' into Graduation Requirements"
date: 2026-08-21
category: learning
tags:
  - cmu
  - ai-course
  - cs-course
  - learning-path
  - self-study
lang: en
type: deep-dive
tldr: "Stanford has no AI degree; AI is a track inside CS. CMU launched the first U.S. B.S. in Artificial Intelligence in 2018, divided AI into four clusters, required one course from each, and made ethics a graduation requirement. At the master's level, MSAII sits not in CS but in the Language Technologies Institute; 84 of its 195 units cover an innovation process ending in a fundable capstone. Two official-page conflicts emerged during verification: whether the AI Core has two or three courses, and whether MSAII totals 192 or 195 units."
description: "A complete guide to Carnegie Mellon's AI degree system: the mathematical, CS, and AI foundations of BSAI; four required clusters; the AI minor and additional major; MSAII's 195-unit structure and capstone; the Machine Learning Department's separate M.S. route; and inconsistencies among official pages."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-cmu-ai-degree)

At most universities, "AI curriculum" means a group of electives inside computer science. Stanford, MIT, and Berkeley all follow that pattern: finish a CS degree and take several AI courses along the way.

**Carnegie Mellon does not.** In 2018 it launched the first independent U.S. bachelor's degree in AI. The diploma says Artificial Intelligence, not Computer Science.

The significance is not a better-sounding name. Once a university grants a degree, it must answer **what AI students should learn** in explicit graduation requirements. That document is more valuable than another AI learning-path blog post because an entire school negotiated it and must defend it to admissions bodies every year.

This article examines the bachelor's curriculum, the differences among the minor and additional major, the master's options, and two contradictions found across official pages.

## Bachelor's: The Four-Layer BSAI Structure

The [official CMU catalog](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/artificialintelligence) describes the program this way:

> The program and its curriculum focus on how complex inputs — such as vision, language and huge databases — can be used to make decisions or enhance human capabilities.

Graduation requirements break down as follows:

| Area | Courses |
|---|---:|
| Math and Statistics Core | 7 |
| Computer Science Core | 5 |
| Artificial Intelligence Core | 2 or 3 (see the discrepancy below) |
| **AI Cluster Electives** | **4 (one from each cluster)** |
| Ethics Elective | 1 |
| SCS Electives | 2 |
| Humanities and Arts | 7 (one must be cognitive science or cognitive psychology) |
| Science and Engineering | 4 |

### The CS Core Is a Complete Foundation, Not a Discounted One

These are the same five courses taken by CMU computer-science undergraduates:

```
15-122  Principles of Imperative Computation      12 units
15-150  Principles of Functional Programming      12 units
15-210  Parallel and Sequential Data Structures   12 units
15-213  Introduction to Computer Systems           12 units
15-251  Great Ideas in Theoretical Computer Science 12 units
```

This deserves emphasis. People often assume an AI degree substitutes AI classes for hard CS courses. The opposite is true: systems and theory remain intact. BSAI adds AI on top of a CS foundation; it does not replace that foundation.

### The Real Design Is in the Four Clusters

BSAI's most interesting rule requires four AI Cluster Electives, one from each cluster. Students cannot concentrate everything in a single direction.

| Cluster | Selected options |
|---|---|
| Decision Making and Robotics | 15-386 Neural Computation, 15-482 Autonomous Agents, 16-350 Planning Techniques for Robotics, 16-384 Robot Kinematics and Dynamics |
| Machine Learning | 10-403 Deep RL & Control, **10-414 Deep Learning Systems**, 10-417 Intermediate Deep Learning, 10-423 Generative AI, 10-425 Convex Optimization, 11-485 Intro to Deep Learning |
| Perception and Language | 11-411 NLP, 11-442 Search Engines, 11-492 Speech Technology for Conversational AI, 15-387 Computational Perception, 16-385 Computer Vision |
| Human-AI Interaction | 05-317 Design of AI Products, 05-318 Human AI Interaction, 05-391 Designing Human Centered Software |

This prohibition on a one-sided diet is the curriculum's strongest claim: **CMU does not consider deep learning alone sufficient knowledge of AI.** Students must encounter planning and robotics, perception and language, and human-AI interaction. The last cluster is especially unusual; HCI is absent from many AI curricula.

The publicly available **CMU 10-414 Deep Learning Systems** materials listed on [csdiy.wiki](https://csdiy.wiki/) belong to the Machine Learning cluster. Independent learners do not need to wait for a degree to start there.

### Ethics Is a Requirement, Not Extra Credit

Ethics has its own required slot. Combined with the humanities requirement for cognitive science or psychology, **this curriculum allocates more weight to people than most AI programs do**.

## The Minor and Additional Major: Entry Points Outside SCS

The [BSAI page](https://www.cs.cmu.edu/bs-in-artificial-intelligence/) says:

> CMU offers both a minor in artificial intelligence and an additional (double) major. Both programs are open to students from any primary major.

Both accept students from any primary major, but the [minor page](https://www.cs.cmu.edu/bs-in-artificial-intelligence/minor) adds an easily missed restriction:

> Note: The AI minor is not available to SCS students, nor is there an AI concentration.

**SCS students cannot earn the AI minor.** That is logical: they should follow concentrations in machine learning, robotics, language technology, or HCI rather than take a minor designed for other schools.

The minor contains six courses: three in the AI Core, two technical electives selected from different clusters, and one course on AI's social dimensions.

## Master's: The AI Degree Moves to a Different Institute

Does CMU offer an AI master's degree? **Yes, but not in the Computer Science Department.**

### MSAII: An Entrepreneurial Master's in the Language Technologies Institute

The [Master of Science in Artificial Intelligence and Innovation](https://www.lti.cs.cmu.edu/academics/masters-programs/msaii.html) is run by the Language Technologies Institute and succeeded the M.S. in Biotechnology, Innovation and Computing. Its official description is explicit:

> It combines a rigorous AI and machine learning curriculum with real-world team experience in identifying an AI market niche and developing a responsive product in cooperation with external stakeholders.

| Area | Units |
|---|---:|
| Core Curriculum (including a 36-unit Capstone) | 84 |
| Knowledge Requirements | 72 |
| Approved electives | ≥36 |
| LTI Practicum tied to the summer internship | 3 |

**The important point is that most of the 84-unit Core is not AI coursework; it is an innovation process.** The five-course sequence covers four stages: opportunity identification, opportunity development, business planning, and venture incubation. Teams investigate an AI domain, pitch professors and classmates, and carry a product proposal through three more semesters into the 11-699 Capstone Project.

> The purpose of the Core Curriculum is to prepare you to discover new AI applicants and develop them into a product suitable for further development, often leading to a startup enterprise.

The six real AI foundation courses sit in the 72-unit Knowledge Requirements, including 10-601 Machine Learning. Electives range across 11-747 Neural Networks for NLP, 11-777 Advanced Multimodal ML, 10-605 ML with Large Datasets, 15-780 Graduate Artificial Intelligence, and 16-824 Visual Learning and Recognition.

There is also a prerequisite: students must pass **15-513 Introduction to Computer Systems (6 units)**, usually remotely before term begins. It is a version of 15-213. Students who fail must retake it during the semester, and those six units **do not count toward graduation**.

For Fall 2027, applications open September 9, 2026; the early deadline is November 18 at 3 p.m. EST and the final deadline December 9. The fee is $80 early and $100 afterward.

### Another Route: The Machine Learning Department's M.S.

For a research-oriented rather than entrepreneurial path, the [Machine Learning Department](https://www.ml.cmu.edu/academics/) offers its own master's:

> The M.S. in Machine Learning is ideal for students preparing for a career in industry. This 16-month program is mostly coursework-based, with research being optional. It does not allow for a master's thesis.

It lasts sixteen months, is primarily coursework, and **does not permit a master's thesis**. An Advanced Study variant shares the same coursework and practicum requirements.

MLD's spectrum is wider than LTI's: an undergraduate ML minor, an ML concentration, a Statistics and Machine Learning additional major, and four joint PhDs alongside the ML PhD—Statistics and Machine Learning, Machine Learning and Public Policy, Neural Computation and Machine Learning, and Autonomous & Human Decision Making.

**Machine Learning and Public Policy deserves separate attention.** Along with BSAI's ethics requirement, it reveals an institutional tendency: CMU treats AI's social consequences as part of degree architecture, not an optional extra.

## Two Official Pages Contradict Each Other

I found two conflicts among CMU's own pages. I record both rather than silently correcting them into a plausible version.

**Conflict 1: Does the AI Core have two courses or three?**

- The [SCS BSAI curriculum page](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum) says "Artificial Intelligence Core (**3 Courses**)."
- The [university catalog](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/artificialintelligence) says "Artificial Intelligence Core (**2 courses**)," listing 07-280 Artificial Intelligence and Machine Learning I and 07-380 Artificial Intelligence and Machine Learning II.

The curriculum page offers a clue: "If you have already taken 10-301, please contact bsai@cs.cmu.edu about an alternate pathway to completing the AI core." This looks like an ongoing revision in which 07-280 and 07-380 replace an older path centered on 10-301. The pages appear frozen at different versions. Applicants should ask the department rather than infer from the catalog.

**Conflict 2: Is MSAII 192 or 195 units?**

The Curriculum section of `msaii.html` says:

> In total, you will complete **195** eligible units of study, including 84 units of Core Curriculum (including the 36-unit Capstone), 72 units of Knowledge Requirements, at least 36 units of approved Electives and the LTI Practicum (3 units...).

But the Preparation Prerequisite section on the same page says:

> ...the units will not count toward your **192** eligible units of study.

84 + 72 + 36 equals 192; adding the 3-unit Practicum yields 195. **The page appears to have added the Practicum and updated only one passage.** It will not decide whether a student graduates, but it is a useful warning: an official page is not necessarily an internally consistent page. When numbers conflict, first check for an unsynchronized revision, then ask the department.

## How It Differs from Stanford

This site also has a [guide to Stanford's CS curriculum](/posts/learning/2026-08-20-stanford-cs-course-map) (zh-TW only). The contrast is clear:

| | Stanford | CMU |
|---|---|---|
| AI degree | None; AI is a CS track | **Independent B.S. in Artificial Intelligence** |
| How the curriculum defines AI | Implicitly through prerequisites | **Four explicit clusters, one course required from each** |
| Ethics | Distributed across courses | **A separate required category** |
| Master's AI degree | No degree under that name | MSAII (LTI), M.S. in Machine Learning (MLD) |
| Public materials | Extensive: CS229, CS224n, CS336, and others | More scattered; public versions include 10-414, 11-785, and 10-708 |

**The practical conclusion for independent learners:** Stanford's materials are easier to obtain, but CMU's curriculum is a better map. If you are sequencing your own AI study, copy BSAI's requirement of one course from each cluster. It is an answer for which someone is institutionally accountable, not one blogger's preference.

## References

- [B.S. in Artificial Intelligence — CMU School of Computer Science](https://www.cs.cmu.edu/bs-in-artificial-intelligence/)
- [BSAI Curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
- [BSAI Minor](https://www.cs.cmu.edu/bs-in-artificial-intelligence/minor)
- [Artificial Intelligence Program — CMU Catalog](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/artificialintelligence)
- [School of Computer Science Courses](http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/courses)
- [Master of Science in Artificial Intelligence and Innovation](https://www.lti.cs.cmu.edu/academics/masters-programs/msaii.html)
- [CMU Machine Learning Department Academics](https://www.ml.cmu.edu/academics/)
- [csdiy.wiki computer-science self-study guide](https://csdiy.wiki/)
- [Stanford CS curriculum guide](/posts/learning/2026-08-20-stanford-cs-course-map)
