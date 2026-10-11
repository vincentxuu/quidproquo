---
title: "Reading MIT 6.S184: Flow Matching and Diffusion Through ODEs and SDEs"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 0
tldr: "MIT 6.S184 is a short IAP (January Independent Activities Period) course: five lectures (Lecture 3 is split into two recordings, 3-A and 3-B), three labs, and an 84-page set of lecture notes the course calls its backbone. Notes, slides, all six recordings, lab notebooks, and official solutions are public, so it grades A3, enough to self-study. Two gaps remain: lab submission goes through Gradescope inside Canvas, which only enrolled MIT students can use, and Lecture 5 on discrete diffusion has no lab."
description: "Series overview for MIT 6.S184 Generative AI with Stochastic Differential Equations (IAP 2026): what the course covers, how public it is and what is missing, prerequisites, the seven-section map of the notes, a table matching each lecture to notes sections, slides, recordings, and labs, a self-study route, the t=0 noise / t=1 data convention, and the CC BY-NC-SA license."
draft: false
glossary:
  - term: "IAP"
    aliases: ["Independent Activities Period"]
    definition: "MIT's January term, when short courses run for a few weeks."
    context: "6.S184 is an IAP course, which is why it has only five lectures."
  - term: "flow matching"
    definition: "A training method that regresses a neural-network vector field so that an ODE flows from a noise distribution to the data distribution."
    context: "The subject of Section 3 of the notes and the spine of this series."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Version note**: This series is based on the **IAP 2026** offering of [MIT 6.S184](https://diffusion.csail.mit.edu/). The site also keeps a [2025 page](https://diffusion.csail.mit.edu/2025/index.html) with different videos; this series does not mix the two. Every fact was checked against official materials on 2026-09-30: the [course site](https://diffusion.csail.mit.edu/2026/index.html), the [lecture notes PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) (84 pages), five slide decks, six recordings, and the [`2026` branch of the labs repo](https://github.com/eje24/iap-diffusion-labs/tree/2026). Access grade: **A3, enough to self-study**.

**Series position**: start of series | Next: [L1: Generation Is Sampling, and ODEs and SDEs Are the Machine](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en)

Image and video generators such as Stable Diffusion 3 and Meta Movie Gen are mostly built on diffusion models or flow matching. Tutorials tend to pick one extreme: code only, or a wall of stochastic differential equations. [MIT 6.S184](https://diffusion.csail.mit.edu/) takes the middle road. It teaches just enough ODE and SDE math, then turns that math step by step into a working latent diffusion model.

This post is the entry point and contains no derivations. By the end you will know what the course teaches, where each material lives, what is missing, and what order to read things in.

## Course video sources
This article covers multiple lectures; choose recordings by topic and lecture from the official index. Rechecked against the live official 2026 course page on 2026-10-10: the Recording column lists YouTube recordings for Lectures 1, 2, 3-A, 3-B, 4 and 5; the three labs have no dedicated recording. Per-lecture videos are embedded in each lecture article.

Course and recording entries:

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

Checked: 2026-10-10.

## What the course is

The formal title on the course site is **6.S184: Generative AI with Stochastic Differential Equations**; the page header reads Flow Matching and Diffusion Models. The [labs repo README](https://github.com/eje24/iap-diffusion-labs/tree/2026) uses the cross-listed number 6.S184/6.S975 and says the labs are "as taught at MIT over IAP 2026."

The site's description is explicit about the goal. Lectures teach the core math needed to understand diffusion models, including stochastic differential equations and the Fokker–Planck equation, and explain each model component step by step. Labs accompany each lecture. By the end, students will have built a latent diffusion model from scratch.

Who does what (Instructors and Acknowledgements sections of the site):

- Lectures: [Peter Holderrieth](https://www.peterholderrieth.com/)
- Labs: Ron Shprints, Ezra Erives
- Advisor and sponsor: [Tommi Jaakkola](https://people.csail.mit.edu/tommi/)

The notes are by Peter Holderrieth and Ezra Erives; the site's citation entry points to [arXiv 2506.02070](https://arxiv.org/abs/2506.02070).

**Prerequisites**: the site lists linear algebra, multivariate calculus, and basic probability, plus familiarity with Python and some PyTorch experience. Notes §1.2 adds that the subject is technical and recommends some mathematical maturity, especially in probability; Appendix A is a probability refresher for that reason. If your probability is rusty, the site's [Stanford CS109 guide](/posts/learning/2026-08-21-stanford-cs109-probability-en) is a place to start.

## Access: A3, with two gaps

Using the grades from the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), 6.S184 is **A3, enough to self-study**:

| Material | Status |
|---|---|
| Lecture notes | Fully public, 84 pages (§1–7 plus Appendices A–E). The site calls them the backbone of the course and self-contained |
| Slides | All five decks public (3-A and 3-B share one) |
| Recordings | All six on YouTube |
| Labs | Three notebooks public |
| Official solutions | Public, under `solutions/` in the labs repo |

Two gaps are worth stating up front:

1. **No graded feedback.** The site's submission flow is "export the notebook to PDF and submit to Gradescope via Canvas," which only enrolled MIT students can use. Outside readers can only check their work against the official solutions.
2. **Lecture 5 has no lab.** The three labs cover L1, L2–L3, and L3–L4. Notes §1.2 also marks §7 (discrete diffusion) as Optional.

The site also has no formal schedule and no exams. Slide filenames carry dates (20260120, 20260122, 20260123, 20260128, 20260130), but those are filenames, not a published calendar. The Logistics slide in Lecture 1 says that passing requires coming to lecture and doing the labs ("necessary to pass").

## The seven-section map of the notes

Notes §1.2 summarizes each section in a sentence, and that summary is the skeleton of this series:

| Notes section | Question it answers |
|---|---|
| §1 Generative Modeling as Sampling | What does "generate an image of a dog" mean precisely? Sampling from a probability distribution |
| §2 Flow and Diffusion Models | What is the machine that generates? Simulating ODEs and SDEs |
| §3 Flow Matching | How do you train that machine? A simple, scalable algorithm |
| §4 Score Matching | What score functions are and how to learn them; they unlock SDE sampling and guidance |
| §5 Guidance | How to make generation follow a prompt: classifier-free guidance |
| §6 Latent Spaces, Neural Network Architectures | How large image/video generators are built: architectures, latent space, case studies |
| §7 (Optional) Discrete Diffusion Models | How to carry the same principles over to discrete data like language |

The appendices are A probability refresher, B a proof of the Fokker–Planck equation, C existence and uniqueness of continuous-time Markov chains, D additional perspectives on VAEs, and E a guide to the diffusion literature.

## Materials table

One row per lecture. Page numbers come from the notes' table of contents.

| Lecture | Topic | Notes | Slides | Recording | Lab | This series |
|---|---|---|---|---|---|---|
| 1 | Flow and Diffusion Models | §1.3, §2 (pp.4–13) | [Slides 1](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf) | [L1](https://www.youtube.com/watch?v=9eJQQVrUUoI) | Lab 1 | [L1](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en), [Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en) |
| 2 | Flow Matching | §3 (pp.14–24) | [Slides 2](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf) | [L2](https://www.youtube.com/watch?v=PNkMKWW8Khw) | Lab 2 | [L2](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) |
| 3-A | Score Functions and Score Matching | §4 (pp.25–33) | [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) | [L3A](https://www.youtube.com/watch?v=ngC3QnYSVNM) | Lab 2 | [L3A](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en), [Lab 2](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en) |
| 3-B | Classifier-free Guidance | §5 (pp.34–40) | [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) | [L3B](https://www.youtube.com/watch?v=8oWZ1bHwyRI) | Lab 3 Part 2 | [L3B](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en) |
| 4 | Latent Spaces and Neural Network Architectures | §6 (pp.41–53) | [Slides 4](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf) | [L4](https://www.youtube.com/watch?v=g0MB1CCBmsI) | Lab 3 | [L4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en), [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en) |
| 5 | Discrete Diffusion Models | §7 (pp.54–65, Optional) | [Slides 5](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf) | [L5](https://www.youtube.com/watch?v=d0kmyEJN2hI) | None | [L5](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion-en) |

The labs' names on the site are Lab 1 Working with ODEs and SDEs, Lab 2 Flow Matching and Score Matching, and Lab 3 Diffusion Transformer and VAEs. The site links to Colab and Google Drive; this series uses the [notebooks on GitHub](https://github.com/eje24/iap-diffusion-labs/tree/2026) because the solutions live in the same repo.

## A self-study route

The site and Remark 1 in the notes split the roles this way: the notes are self-contained, the recordings walk you through each section, and the labs have you write the code. That suggests a rhythm per lecture:

1. **Read the notes section first.** Skip formulas you can't follow yet; make sure you understand each Key Idea, each Theorem statement, and each Algorithm box.
2. **Then watch the recording.** It is the spoken version of the notes and good for intuition.
3. **Do the lab.** Per the site, download the `.ipynb` from GitHub, open it in Jupyter or Colab, and complete every question.
4. **Check against the official solutions.** Open `solutions/lab_*_complete.ipynb` and compare question by question. For outside readers, this is the only feedback there is.

This series follows the dependency order of the notes: L1 → Lab 1 → L2 → L3A → Lab 2 → L3B → L4 → Lab 3 → L5. Lab 2 comes after L3A because it asks for a conditional score; Lab 3 comes after L4 because it uses both CFG and DiT/VAE.

**Something you can do tonight**: open the [notes PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf), read §1 (pp.3–6, the four Key Ideas), then make sure your environment can run PyTorch for the [Lab 1 notebook](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_one.ipynb).

## One convention to remember: t=0 is noise, t=1 is data

The notes use one time direction throughout: **t=0 is the initial distribution `p_init` (usually the standard Gaussian `N(0, I_d)`), and t=1 is the data distribution `p_data`**. Generating means simulating from t=0 to t=1.

Much of the diffusion literature runs the other way. Appendix E of the notes flags it: a popular convention puts `p_data` at t=0, the opposite of the notes. When you read DDPM-style papers, or this site's [CMU 11-785 L23 diffusion guide](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en), check the time direction before comparing formulas.

## License

The course site footer says **CC BY-NC-SA**. This series only summarizes and guides; formulas and algorithm numbers point back to the original notes.

## Series contents

1. [L1: Generation Is Sampling, and ODEs and SDEs Are the Machine](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en)
2. [Lab 1: Simulating ODEs and SDEs](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en)
3. [L2: Flow Matching, Learning the Marginal Vector Field from Conditional Paths](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en)
4. [L3A: Score Functions, SDE Sampling, and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en)
5. [Lab 2: Writing Flow Matching and Score Matching by Hand](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en)
6. [L3B: Guidance and Classifier-Free Guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en)
7. [L4: U-Nets, DiTs, and Latent Space](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en)
8. [Lab 3: From DiT and VAE to Latent Diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en)
9. [L5: Discrete Diffusion, Generating Language with CTMCs](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion-en)

## Further reading

- Where the course sits on the map: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), [MIT AI/ML course map](/posts/learning/2026-08-21-mit-ai-ml-course-map-en)
- Intro to generative models: [MIT 6.S191 L4: Generative Modeling](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling-en)
- The DDPM view (opposite time direction): [CMU 11-785 L23: Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en)
- Discrete diffusion language models: [CME295: Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en)
- Deep learning overall: [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official entry: per-lecture recordings are listed there and embedded in each lecture article; the status stays “Official entry or recording index only.”

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — description, five lecture topics, slides and recordings, three labs, submission flow, staff, prerequisites, CC BY-NC-SA
- [MIT 6.S184 course site (2025)](https://diffusion.csail.mit.edu/2025/index.html) — not used in this series; mentioned only to note it exists
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF, 2026)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §1.1 Remark 1, §1.2 course structure, table-of-contents page numbers, Appendix E time convention
- [arXiv 2506.02070](https://arxiv.org/abs/2506.02070) — arXiv version of the notes
- [Slides 1](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf), [Slides 2](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf), [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf), [Slides 4](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf), [Slides 5](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf)
- Recordings: [L1](https://www.youtube.com/watch?v=9eJQQVrUUoI), [L2](https://www.youtube.com/watch?v=PNkMKWW8Khw), [L3A](https://www.youtube.com/watch?v=ngC3QnYSVNM), [L3B](https://www.youtube.com/watch?v=8oWZ1bHwyRI), [L4](https://www.youtube.com/watch?v=g0MB1CCBmsI), [L5](https://www.youtube.com/watch?v=d0kmyEJN2hI)
- [eje24/iap-diffusion-labs (branch 2026)](https://github.com/eje24/iap-diffusion-labs/tree/2026) — lab notebooks, official solutions, README changelog
