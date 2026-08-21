---
title: "Stanford CS228: The Prerequisites Are One Sentence About Probability and Algorithms — But the Course Hasn't Run in Two Years"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs228, ai-course, stanford, probabilistic-graphical-models, bayesian-network, variational-inference]
lang: en
series:
  name: "Reading Stanford's Main-Line CS Courses"
  order: 10
tldr: "CS228's official prerequisite is a single line — 'basic probability theory and algorithm design and analysis' — with no named course. But ExploreCourses shows it was last offered in Winter 2024, and the next slot, Winter 2027, still has a blank instructor field. What a self-learner can actually get is cs228-notes: 16 chapters, complete, last touched in June 2025."
description: "A walkthrough of Stanford CS228: Probabilistic Graphical Models, written after reading the ExploreCourses entries, the course site frozen at Winter 2024, and every chapter of the public cs228-notes — the real entry bar, the rhythm of the five assignments, how complete and how maintained the notes are, and where CS236 fits."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs228-graphical-models)

[CS 228: Probabilistic Graphical Models: Principles and Techniques](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog) teaches something deeply out of fashion in 2026: how to squeeze a probability distribution too large to ever write down into a graph you can actually compute with. Bayesian networks, Markov random fields, variable elimination, belief propagation, sampling, variational inference, parameter and structure learning — ten weeks covering representation, inference, and learning.

Its position on Stanford's AI course map is odd. Everyone knows it exists; few people take it. The obstacle isn't the entry bar. Its official prerequisites name no course at all, while [CS 234](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) next door demands CS229 or equivalent — a full level higher. The real obstacle is that the course hasn't been offered in two years, and its website is frozen in the shape it had the last time it ran.

This post was written after opening four academic-year entries on ExploreCourses, the frozen course site, and every chapter of the public lecture notes. It covers what the hard rules say, how the five assignments are paced, how complete the notes really are, and how the course relates to CS236. It does **not** walk through the math chapter by chapter — that's the notes' job, and the notes are public. For where this course sits in the sequence, see the [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en).

## The hard facts

The prerequisite line is one sentence, copied verbatim from the [ExploreCourses entry for CS 228](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog):

> Prerequisites: basic probability theory and algorithm design and analysis.

No course numbers, no machine learning background, no PyTorch. The [course site](https://cs228.stanford.edu/) adds two words — statistics and programming — plus a self-check:

> If you are able to comfortably complete homework 1 then you likely have all the relevant background knowledge.

The specs: three to four units, winter quarter only, taught by Stefano Ermon. The 2026-2027 academic year page on ExploreCourses shows the course scheduled for **Winter 2027**, with the instructor field and meeting times both still blank.

The gap in the middle is what deserves attention. On both earlier academic-year pages, the course status reads `Last offered: Winter 2024` — two straight years without an offering. **ExploreCourses gives no reason**, and the course site posts no announcement. There is a phenomenon here, not an explanation.

One more sideways appearance: the [MATH 151](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog) entry says CS majors may petition to use it in place of CS109, on the condition that they "expect to also take CS 228 or CS 229." The course is written into another course's substitution rule.

Auditing policy is not documented. The site lists only a contact for SCPD students (`scpdsupport@stanford.edu`) and says nothing about sitting in on campus.

## What it actually teaches: turning exponential into polynomial

Chapter one of the notes frames the whole course through spam classification, which is the fastest way in. To build a joint distribution over the presence or absence of `n` English words plus a spam label, you have to write down 2^(n+1) numbers. You can't store that, and you can't estimate it.

Then it does one thing: assume all words are conditionally independent given the label (the Naive Bayes assumption), and the distribution factors into a product of small terms, with the parameter count dropping to O(n). [The notes put it this way](https://ermongroup.github.io/cs228-notes/preliminaries/introduction/): probability is an inherently exponential-sized object, and the only way to manipulate one is to make simplifying assumptions about its structure.

The rest of the course systematizes that move. A graph is how you **write down** which independence assumptions you made — that's representation. The graph's properties determine which questions you can **afford to ask** — that's inference. And learning calls inference as a subroutine, over and over. The three lock together, which is also the table of contents.

The practical value of the framework is that it hands you a ruler: **given any probabilistic model, first ask what independence it assumes, then ask which queries that assumption moves from exponential to polynomial.** Transformers, diffusion, and HMMs all fit on that ruler — the notes do exactly this, as covered below.

## What state the public notes are actually in

What a self-learner can genuinely get is [cs228-notes](https://ermongroup.github.io/cs228-notes/), written by Volodymyr Kuleshov and Stefano Ermon, hosted on GitHub Pages under an MIT license with [public source](https://github.com/ermongroup/cs228-notes). It isn't an appendix to a slide deck; it's a text you can read start to finish on its own.

Sixteen chapters plus a further-reading list, aligned to the course's three blocks:

| Block | Chapters |
|---|---|
| Preliminaries | [Introduction](https://ermongroup.github.io/cs228-notes/preliminaries/introduction/), [Probability Review](https://ermongroup.github.io/cs228-notes/preliminaries/probabilityreview/), [Real-World Applications](https://ermongroup.github.io/cs228-notes/preliminaries/applications/) |
| Representation | [Bayesian networks](https://ermongroup.github.io/cs228-notes/representation/directed/), [Markov random fields](https://ermongroup.github.io/cs228-notes/representation/undirected/) |
| Inference | [Variable elimination](https://ermongroup.github.io/cs228-notes/inference/ve/), [Belief propagation](https://ermongroup.github.io/cs228-notes/inference/jt/), [MAP inference](https://ermongroup.github.io/cs228-notes/inference/map/), [Sampling](https://ermongroup.github.io/cs228-notes/inference/sampling/), [Variational inference](https://ermongroup.github.io/cs228-notes/inference/variational/) |
| Learning | [Directed](https://ermongroup.github.io/cs228-notes/learning/directed/), [Undirected](https://ermongroup.github.io/cs228-notes/learning/undirected/), [Latent variable](https://ermongroup.github.io/cs228-notes/learning/latent/), [Bayesian](https://ermongroup.github.io/cs228-notes/learning/bayesian/), [Structure](https://ermongroup.github.io/cs228-notes/learning/structure/) |
| Closing | [The variational autoencoder](https://ermongroup.github.io/cs228-notes/extras/vae/) |

The line on the front page — "The notes are still **under construction**" — deserves its own paragraph, because it misleads. The index marks four places *under construction*: the probability review, the applications chapter, the examples in Bayesian learning, and Bayesian structure learning inside the structure chapter. **After reading all four pages, most of those markers no longer match what's on them:**

- The probability review isn't just finished, it goes deeper than the course needs — it starts from σ-algebras and measure, and says explicitly that the material is adapted from the CS229 probability notes and the STATS310 lecture notes.
- The applications chapter is the longest in the whole set, covering images, language, audio, causal inference, error-correcting codes, computational biology, ecology, economics, and medical diagnosis.
- Bayesian learning marks "Examples (under construction)," but that page opens with two complete examples. One is why the MLE for a biased coin doesn't grow more confident as data accumulates; the other is a bag-of-words language model assigning zero probability to a whole sentence on hitting an unseen word. Conjugate priors, Beta, and Dirichlet follow, closing with Laplace smoothing as a special case of a Dirichlet prior.
- The only genuine gap is in the structure learning chapter. Score-based methods, Chow-Liu, AIC/BIC, the BD score, constraint-based methods, order search, and ILP are all there — but there is no standalone Bayesian structure learning section.

On maintenance, be blunt. The repo has over two thousand stars and hasn't been archived, but **the last push was in June 2025**, and that change was a single typo fix. Scroll back further and the substantive edits cluster in 2023 and early 2024. Several pull requests are still open; the oldest was filed six years ago (exact numbers in the appendix).

Rot is setting in, though people are patching it. Three places in the notes recommend "an interactive simulation built by a former CS228 student," all pointing at the same dead `pgmlearning.herokuapp.com`. Two of them have been repointed at Wayback Machine snapshots: d-separation and variable elimination. There's a commit in the repo from early 2024 literally named "Update variable elimination web app link with archived version." **Only the K3 algorithm simulation in the structure learning chapter still points at the original URL, which returns a 404.**

## Where the notes put Transformers and diffusion

"Is it still worth learning graphical models in 2026?" is the question readers actually have. Rather than invent an answer, look at how the material positions itself — and the course's two documents answer differently.

**The official course description doesn't address it at all.** The ExploreCourses entry lists applications as "speech recognition, biological modeling and discovery, medical diagnosis, message encoding, vision, and robot motion planning." The course site's version says machine learning, computer vision, natural language processing, and computational biology. Neither mentions deep learning, generative models, or LLMs.

**The notes do address it, and they explicitly absorb modern models into the graphical-model frame.** On diffusion, the applications chapter says "Diffusion models are a class of PGMs that build upon the directed Markov chain structure" — one class of graphical model built on directed Markov chain structure. On language models it's more direct:

> Many modern language models do not make strong independence assumptions and instead learn a fully connected PGM with a large quantity of data in order to avoid overfitting. Recent successes in commerical language products such as ChatGPT are based on the Transformer Architecture which is a fully connected graphical model.

(The misspelling of "commerical" is in the original and is reproduced here verbatim [sic].)

The stance is clear enough: Transformers aren't a replacement for graphical models, they're the extreme end of the spectrum where you make *no* independence assumptions — trading structural assumptions for data volume. That's the opposite end of chapter one's ruler.

And the closing chapter of the notes is [the variational autoencoder](https://ermongroup.github.io/cs228-notes/extras/vae/); the front page says the course "starts at the very basics and ends by explaining variational autoencoders from first principles." The VAE chapter takes EM, mean field, and sampling — the three approaches taught in class — tries each, explains why each fails, and only then introduces [Kingma and Welling's AEVB](https://arxiv.org/abs/1312.6114) and the reparameterization trick. It's the best stretch in the notes, because it shows the course's methodology deriving a modern result.

**Watch the timestamps, though.** The newest citations in these modernized passages stop at 2023 (ChatGPT, Child et al. 2021's Very Deep VAE), with nothing added since. So what the notes answer is "how modern generative models fit into the graphical-model frame, as of 2023" — not the 2026 version.

## What the assignments look like

The course site doesn't publish assignment content (it all lives on Ed), but it does publish the full schedule, and the schedule carries information. Five assignments, each described as having "both written and programming parts," each built around one application. Against the ten-week lecture schedule they land like this:

| Assignment | Window | Topics |
|---|---|---|
| HW1 | 1/9 – 1/23 | Probability theory, Bayesian networks |
| HW2 | 1/24 – 2/2 | Undirected models, learning Bayesian networks |
| HW3 | 2/1 – 2/13 | Exact inference, message passing |
| HW4 | 2/13 – 2/27 | MAP inference, structured prediction, sampling |
| HW5 | 2/27 – 3/12 | Parameter learning, Bayesian learning, structure learning |

**HW2 is the outlier: nine days, where the other four all get twelve or more.** It's also the only one whose successor opens before it closes — the HW2 and HW3 windows overlap outright on the schedule. The site doesn't say why.

Another readable signal is the extra section slots. The site lists five, all Friday afternoons, all marked "optional but encouraged," covering d-separation, variable elimination, junction trees, Metropolis-Hastings and Gibbs sampling, and EM, in that order. All five fall between weeks two and seven — the representation and inference stretch.

The rules are strict. Six late days total, at most two on any single assignment, with a 25% penalty per extra day beyond that; the site works through an example for you, where spending all four days on one assignment cuts that assignment in half. Looking at past solutions is banned: "It is an honor code violation to intentionally refer to a previous year's solutions, either official or written up by another student." Grading is 70% assignments and 30% final exam, with up to 3% extra credit — and one of the two ways to earn it is **submitting a PR to the course notes on GitHub**. Which means part of the public notes you're reading online were fed in by students chasing extra credit.

The final is a single three-hour exam. **There is no final project** — the opposite arrangement from CS236, taught by the same instructor, where the course project is 40% of the grade.

## What a self-learner actually gets

Item by item, with the gettable and ungettable kept apart:

- **The notes**: available. All 16 chapters public, MIT licensed, forkable. This is the point of the post and the course's biggest value to anyone outside Stanford.
- **The textbook**: not available for free. The assigned book is Koller and Friedman's *Probabilistic Graphical Models: Principles and Techniques* (MIT Press), which you buy. Of the six further readings on the site, only [MacKay's *Information Theory, Inference, and Learning Algorithms*](http://www.inference.org.uk/mackay/itila/book.html) is a free online copy posted by the author. Bishop, Murphy, and Darwiche all route through the Stanford library, closed from outside. **And the PDF link for Wainwright and Jordan's *Graphical Models, Exponential Families, and Variational Inference* now returns a 404** — that's the assigned companion reading for week nine.
- **Lecture slides**: not available. The syllabus on the site lists topics and textbook sections only, with no PDFs attached.
- **Recordings**: not available. The site's Lecture Videos link points to an external tool on `canvas.stanford.edu` that requires a login.
- **Assignments**: not available. All on Ed. The only public artifact is a [LaTeX answer template](https://cs.stanford.edu/~ermon/cs228/hwtemplate.tex).
- **Autograder**: not available; Gradescope needs a course invitation.
- **Past course sites**: not available. This course's site doesn't live under `web.stanford.edu/class/archive/` (that path 404s) — it's GitHub Pages, so there's exactly one version, the current one. For history you dig through git commits or the Wayback Machine.

So the self-study path is clear and narrow: **you get a complete text, and no assignments, no recordings, no grader.** The site's "if you can comfortably complete homework 1 you have the background" check doesn't work for anyone outside, because HW1 is one of the things you can't get.

While you're at it, be careful with secondhand descriptions of this course online. Even Ermon's own [Stanford homepage](https://cs.stanford.edu/~ermon/) is off — the teaching list stops at Winter 2022/2023, while both ExploreCourses and the course site record the Winter 2024 offering with him as instructor.

## How it relates to CS236: both are dormant

CS228 and [CS236: Deep Generative Models](https://deepgenerativemodels.github.io/) come from the same person. Many people assume CS228 is a prerequisite for CS236, and **the official pages don't support that**. CS236's stated prerequisite is "Basic knowledge about machine learning from at least one of CS 221, 228, 229 or 230." CS228 is one of four options, not a required stop.

What's more informative is where both courses stand now. On ExploreCourses, CS236's status is `Last offered: Autumn 2023`, and its course site still carries the title "CS236 - Fall 2023" — the same shape as CS228's site frozen at Winter 2023-24. Neither course is currently running; the difference is that the former is already scheduled for the coming winter while the latter has no slot on the most recent academic-year page. **No official page explains why**, so what's listed here is the state of two catalog entries, not a reason.

The division of labor is clean, though. CS228 teaches how to write independence assumptions into a graph and how to do inference and learning on it, ending at the VAE; CS236 starts at the VAE and fans out into GANs, normalizing flows, autoregressive, energy-based, and score-based models. So the last chapter of the notes is exactly the seam between the two. One practical difference: the CS236 site explicitly welcomes on-campus visitors ("we are very open to sitting-in guests if you are a member of the Stanford community"), and the CS228 site says nothing equivalent.

## How to start

One thing you can do tonight to find out whether you can get in at all.

Open [the Bayesian networks chapter](https://ermongroup.github.io/cs228-notes/representation/directed/), read as far as the d-separation section, then cover the page and answer the independence question for three three-variable structures yourself — `X → Z → Y`, `X ← Z → Y`, and `X → Z ← Y` — in both cases, Z observed and Z unobserved.

The third one (the v-structure, which the notes call explaining away) behaves the opposite way from the first two: **X and Y are independent when Z is unobserved, and become dependent once Z is observed.** The notes use wet grass — Z is "the grass is wet this morning," X is that it rained, Y is that the sprinkler ran. Knowing the grass is wet and that the sprinkler was off pushes the probability of rain to 1. Two causes with nothing to do with each other get tied together by observing their shared effect.

If you can explain that to yourself, you can follow every inference algorithm in the course, because d-separation is the foundation each of them stands on. If you can't, reread the chapter before moving on — it's the highest-return section in the notes, and, not coincidentally, the topic of the course's first extra section.

## Appendix: the numbers and how they were checked

- **Units and offerings**: 3–4 units, winter quarter only. The 2026-2027 academic year page on ExploreCourses shows CS 228 as Class # 25130, Session 2026-2027 Winter 1, In Person, with the instructor field and meeting times blank (read 2026-08-21). The 2024-2025 and 2025-2026 pages both show `Last offered: Winter 2024`.
- **Grade weights**: 70% assignments (five of them), 30% final exam, up to 3% extra credit. The two ways to earn extra credit are answering classmates' questions substantively on Ed, or submitting a GitHub PR to the course notes.
- **Late policy**: six late days total, at most two per assignment penalty-free, 25% per day beyond that. This is a lateness rule, not a resubmission rule — the site has no resubmission clause of any kind.
- **Final exam timing**: the Winter 2024 exam was March 21, 15:30–18:30, three hours. That's the version currently displayed. CS228 has no final project; for contrast, CS236's site weights three assignments at 15% each, a midterm at 15%, and the course project at 40%.
- **Notes repo numbers**: 2,009 stars, 476 forks, 7 open pull requests (read via the GitHub API on 2026-08-21). The repo was created 2017-01-10; last push 2025-06-24 (PR #227, a typo fix in the probability review). The oldest unmerged PR was filed 2020-03-16.
- **Under-construction markers in the notes**: the index marks four (Probability Review, Real-World Applications, the Examples in Bayesian learning, and Bayesian structure learning in Structure learning). All four pages were read individually; the first three have complete content, and the fourth genuinely has no corresponding section.
- **Dead links** (all tested 2026-08-21): the K3 interactive simulation in the structure learning chapter, `pgmlearning.herokuapp.com/k3LearningApp`, returns HTTP 404; the same-family links in the d-separation and variable elimination chapters have been repointed at Wayback snapshots and open fine. In the further-reading list on the course site, the Wainwright & Jordan PDF at `www.eecs.berkeley.edu/~wainwrig/Papers/WaiJor08_FTML.pdf` returns HTTP 404, and the usual `people.eecs.berkeley.edu` alternative path 404s as well; this post could not find a valid official mirror of that file.
- **Where the course site lives**: `cs228.stanford.edu` actually redirects to `ermongroup.github.io/cs228`, with the header marked Winter 2023-24. `web.stanford.edu/class/archive/cs/cs228/` returns 404 — this course has no past offerings in the Stanford archive.

**Not confirmed**: (1) why CS228 skipped two consecutive academic years, and why CS236 hasn't run since Autumn 2023 — no official page explains either, and this post lists only the status; (2) who will teach in Winter 2027, since the ExploreCourses instructor field is currently blank; (3) the actual problems and difficulty spread of the five assignments — the content is locked on Ed, and everything said here about the assignments comes from the public schedule and grading policy, not from the assignments themselves.

## References

- [ExploreCourses: CS 228 entry (2026-2027 academic year)](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog) — prerequisite text, units, the Winter 2027 slot and its blank instructor field
- [ExploreCourses: CS 228 entry (2025-2026 academic year)](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog&academicYear=20252026) — `Last offered: Winter 2024`; the same page also carries CS 236's `Last offered: Autumn 2023` and the MATH 151 substitution rule
- [ExploreCourses: CS 228 entry (2023-2024 academic year)](https://explorecourses.stanford.edu/search?q=CS+228&view=catalog&academicYear=20232024) — the Winter 2024 offering with Ermon listed
- [ExploreCourses: CS 234 entry](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) — used as a bar for comparison: CS234 requires CS229 or equivalent
- [CS 228 course site](https://cs228.stanford.edu/) — frozen at Winter 2023-24: prerequisites, grading, late policy, honor code, the ten-week schedule, the five extra sections
- [cs228-notes, the public lecture notes](https://ermongroup.github.io/cs228-notes/) — the 16-chapter table of contents, the authors, the under-construction statement
- [cs228-notes GitHub repo](https://github.com/ermongroup/cs228-notes) — stars, forks, unmerged PRs, commit history, MIT license
- [Notes: Introduction](https://ermongroup.github.io/cs228-notes/preliminaries/introduction/) — the exponential parameter count for spam and the Naive Bayes simplification
- [Notes: Real-World Applications](https://ermongroup.github.io/cs228-notes/preliminaries/applications/) — the passages placing diffusion and Transformers inside the graphical-model frame
- [Notes: Bayesian networks](https://ermongroup.github.io/cs228-notes/representation/directed/) — definitions of d-separation and the v-structure
- [Notes: Structure learning](https://ermongroup.github.io/cs228-notes/learning/structure/) — coverage of the chapter and the dead K3 simulation link
- [Notes: The variational autoencoder](https://ermongroup.github.io/cs228-notes/extras/vae/) — the closing chapter, deriving AEVB from methods taught in class
- [CS236: Deep Generative Models course site](https://deepgenerativemodels.github.io/) — frozen at Fall 2023; prerequisite text and auditing policy
- [Stefano Ermon's homepage](https://cs.stanford.edu/~ermon/) — a teaching list that stops at Winter 2022/2023, out of step with the catalog
- On this site: [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Stanford CS329A, in depth](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
