---
title: "CMU's AI Core Redesign: From 15-281 + 10-315 to 07-280 + 07-380"
date: 2026-08-22
category: learning
tags: [cmu, artificial-intelligence, machine-learning, course-guide]
lang: en
type: deep-dive
tldr: "In 2026, CMU recombined its separate general-AI and SCS machine-learning introductions into the 07-280 → 07-380 sequence. This is a redistribution of content and prerequisites, not a pair of simple course renames."
description: "A source-based guide to the schedule, content split, prerequisites, and transition rules in CMU's AI core redesign."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-cmu-ai-core-redesign)

CMU changed the structure of its undergraduate AI core in 2026. The old path separated **15-281 Artificial Intelligence** from **10-315 Introduction to Machine Learning for SCS**. The new path is **07-280 Artificial Intelligence and Machine Learning I → 07-380 Artificial Intelligence and Machine Learning II**. The official FAQ says that the two older courses will be retired. This is not a one-to-one renaming.

This article compares only published course roles, topics, prerequisites, and substitution rules. Because 07-380 first runs in Fall 2026, it does not judge that course's teaching quality, assignment difficulty, or actual workload.

## The timeline includes both first offerings and a transition section

The [07-280 course site](https://www.cs.cmu.edu/~07280/) identifies Spring 2026 as its first offering, while [07-380](https://www.cs.cmu.edu/~07380/) begins in Fall 2026. The older courses did not disappear simultaneously: [15-281 Spring 2026](https://www.cs.cmu.edu/~15281/) remained as a permission-only section for students who had completed the old 10-315 pairing and needed a transition path.

“15-281 is retired” therefore means that it has left the normal entry path, not that no Spring 2026 section existed. Its archive remains useful to independent learners, while the new sequence defines the current degree path.

## The courses were recombined and split again

The old boundary was straightforward. 15-281 covered broad AI topics such as search, games, constraint satisfaction, MDPs, reinforcement learning, Bayes nets, and HMMs. 10-315 supplied an ML introduction for SCS students.

The new [07-280 syllabus](https://www.cs.cmu.edu/~07280/) places search, supervised learning, neural networks, CNNs, language models, Transformers, and reinforcement learning in one foundation course. Implementations modeled on systems such as AlexNet, GPT-2, and AlphaZero connect those topics.

The published 07-380 scope then includes ML theory, game theory, probabilistic graphical models, planning, distributed deep learning, generative AI, RLHF, vision transformers, diffusion, and VAEs. Its first run is incomplete. The list establishes scope—not the final number of weeks devoted to each topic.

| Topic | Old core | Published new-core location |
|---|---|---|
| Search, adversarial search, CSPs | 15-281 | 07-280 |
| Supervised ML and optimization | 10-315 | 07-280 |
| CNNs, language models, Transformers | Split across ML and later courses | Common introduction in 07-280 |
| MDPs, RL, tree search | 15-281 | 07-280 |
| Bayes nets, HMMs, and PGMs | 15-281 already included Bayes nets and HMMs | Published PGM scope in 07-380 |
| Advanced ML theory and generative models | Not a shared core of 15-281 + 10-315 | Published 07-380 scope |

This table describes placement in published syllabi. It does not claim that old and new lectures or assignments map one-to-one.

## Prerequisites changed with the new boundary

07-280 requires programming, linear algebra, and concepts/discrete mathematics, together with calculus and probability conditions. 07-380 then builds on 07-280, Calculus II, and specified probability preparation. Those requirements show that the first new course carries both AI and ML foundations; they do not reveal an unpublished institutional motive.

The [07-280 FAQ comparison with 10-301](https://www.cs.cmu.edu/~07280/#faq) draws another firm boundary: 07-280 includes non-ML AI methods, while 10-301 focuses on ML and therefore reaches some additional ML topics. The arrival of the new core did not retire 10-301.

## Substitution is not symmetric

The easiest mistake is to read “both are introductory ML” as “they substitute freely.” The official table says:

- Both 07-280 and 10-301 can satisfy the introductory-ML prerequisite for certain later 10-xxx courses.
- 07-280 directly satisfies the prerequisite for 07-380 and the AI-major core requirement.
- 10-301 does not automatically grant either qualification. Students who already took 10-301 and therefore cannot take 07-280 must contact BSAI staff about an alternative path.

The substitution is asymmetric. Before choosing, write down the next course you want and check whether it asks for “intro ML” or explicitly for “07-280.” Course-title similarity is not enough.

## Independent study separates curricular currency from material completeness

The new courses best represent CMU's current organization of AI and ML, but older archives can be more stable. [15-281 Spring 2026](https://www.cs.cmu.edu/~15281/) retains notes, recitations, and Pacman-style programming assignments. Spring 2026 materials for 07-280 are usable, though the main site has moved to Fall 2026 and its historical URLs are less stable. 07-380 currently has a specification rather than a complete public course.

Choose tonight's entry by purpose: use 07-280 to follow the current BSAI structure, the 15-281 archive for traditional search and planning projects, or the continuing 10-301 course for a focused ML foundation. Track curricular version and material access as separate fields.

## References

- [CMU 07-280 AI & ML I](https://www.cs.cmu.edu/~07280/)
- [CMU 07-380 AI & ML II](https://www.cs.cmu.edu/~07380/)
- [CMU 15-281 Artificial Intelligence — Spring 2026](https://www.cs.cmu.edu/~15281/)
- [CMU BSAI Curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
- [CMU MLD Introductory ML Classes](https://ml.cmu.edu/academics/ml-intro-classes)
