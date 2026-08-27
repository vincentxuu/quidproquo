# Stanford CS109 Summer 2026 — source manifest

Verified: 2026-08-22

- Home: https://web.stanford.edu/class/cs109/
- Canonical schedule: https://web.stanford.edu/class/cs109/schedule.html
- Shared Spring-dated course reader (concept reference, not Summer-offering evidence): https://probabilitycoders.stanford.edu/spr26
- Worksheets index: https://web.stanford.edu/class/cs109/worksheets/
- Videos: Canvas only; not treated as read.

## Numbering evidence

The schedule contains numbered rows 1–28. The active navbar currently links 1–22, then 24–28: Lecture 23 is omitted. Its HTML also retains commented historical menus in which 27/28 point to other topics (`27-Diffusion`, `28-Future`) and another menu includes `27-Reinforcement3`. Therefore schedule rows—not navbar position or stale commented links—define this series. Current canonical tail is L23 Midterm 2 practice, L24 Diffusion, L25 Beyond Classification, L26 Applications / Practice, L27 Beyond CS109, L28 Review Session.

## Access pattern

- L1–14: Summer schedule plus worksheet/answer key and most LLM guides; public lecture pages/slides and the `/spr26` reader are shared, Spring-dated concept references rather than Summer-offering evidence (L3).
- L15–22: schedule, reader, worksheet/answer key and guides; linked slide PDFs commonly return 404 (L2).
- L23–28: schedule plus uneven pages/worksheets; L23 has no active navbar item, L24 is an unnamed guest, videos are gated (L1). Re-audit found no artifact set sufficient to raise these units to L2. Their generated prose was removed from `src/content/posts` and retained only under `blocked-drafts/` with blocker notes.

## Completion audit

- Fidelity-complete pairs: **22 / 28** (Lectures 1–22); publishable pairs remain **0 / 28** pending independent review.
- L1 blockers: Lecture 23–28; no publishable article.
- Lecture 1–5: rewritten against the Summer 2026 worksheet, answer key, and LLM guide; generic scaffold removed. Chinese bodies are 3,372–3,667 characters. The official artifacts are only 2–3 worksheet pages, so the plan records the short-material exception rather than padding them. They remain drafts until content review.
- Lecture 7: rewritten against worksheet/answer key P1–P7, the optional DNA challenge, and all six LLM-guide concepts. The worksheet and guide are two pages each, so the short-material exception applies. P4 is present in both official artifacts; its earlier apparent omission was a PDF page-boundary extraction artifact.
- Lecture 8: rewritten against worksheet/answer-key P1–P7, the optional memorylessness challenge, and all six LLM-guide concepts. P3 is a pset3 problem deliberately omitted from the official answer key; the article derives it from the public prompt without attributing the result to the key. The two-page worksheet/guide qualify for the short-material exception.
- Lecture 9: rewritten against the original two-page worksheet, answer key, and all six LLM-guide concepts. P1–P3 appear on page one and P4–P7 plus challenge on page two; there is no numbering gap. P5 and the challenge are pset items deliberately omitted from the public answer key and are derived only from their public prompts. The short-material exception applies.
- Lecture 10: rewritten against worksheet/answer-key P1–P6, the tired-baby challenge, and all six LLM-guide concepts. P6 and the challenge are pset4 items deliberately omitted from the public answer key. The challenge prior is `3/4`; extracted text displaying `34` is a fraction-layout artifact. The short-material exception applies.
- Lecture 11: rewritten against the complete two-page P1–P6 worksheet, due-date challenge, answer key, and all six LLM-guide concepts. P6 is a pset4 item deliberately omitted from the public answer key; its mutation-clock likelihood and posterior are derived only from the prompt. The short-material exception applies.
- Lecture 12: rewritten against formal P1–P6, the rare-evidence challenge, answer key, and all six LLM-guide concepts. The worksheet PDF also includes an unnumbered 1-D Tracking page absent from the answer key and guide; it is covered as an orphan supplemental artifact, not numbered as P7. P6 is a pset4 item deliberately omitted from the public key. The short-material exception applies.
- Lecture 13: rewritten against complete P1–P6, the Multinomial-to-Binomial challenge, answer key, and all six LLM-guide concepts. The guide's nominal third page contains only a carried-over closing line and page number, not an additional concept. The short-material exception applies.
- Lecture 14: rewritten against complete P1–P7, the two-Beta-facts challenge, answer key, and all six LLM-guide concepts. P6 and P7 are pset4 items deliberately omitted from the public key and are derived only from the worksheet/guide. The guide's third page only continues wrap-up text. The short-material exception applies.
- Lecture 15: first L2 fidelity rewrite, covering complete P1–P7, the sum-of-Betas challenge, answer key, and all six LLM-guide concepts. P7/challenge are pset5 items omitted from the public key and derived only from their prompts. Current slides are unavailable and video is gated; the article states this boundary. The short-material exception applies.
- Lecture 16: L2 fidelity rewrite covering complete three-page P1–P6, the Bayesian-vs-bootstrap challenge, answer key, and all six LLM-guide concepts. The artifacts have consistent numbering and no orphan page. Slides are unavailable and video is gated; the article states this boundary. The short-material exception applies.
- Lecture 17: L2 fidelity rewrite covering complete three-page P1–P7, the llama-flu challenge, answer key, and all six LLM-guide concepts. P4/challenge are pset5 code items omitted from the public key and derived only from prompt code. Slides are unavailable and video is gated. The short-material exception applies.
- Lecture 18: L2 fidelity rewrite covering formal P1–P5 and all six LLM-guide concepts. Worksheet/key contain no P6 or challenge, while the guide additionally covers entropy code, KL/cross-entropy, and distribution comparisons. P5 is a pset5 item omitted from the public key and derived only from its prompt. Slides are unavailable and video is gated. The short-material exception applies.
- Lecture 19: L2 fidelity rewrite covering the three-page P1–P6 worksheet, Negative-Binomial challenge, answer key, and all six LLM-guide concepts. P5/challenge are pset6 items omitted from the public key and derived only from their prompts. The guide's third page only continues Concept 6 and the wrap-up. Slides are unavailable and video is gated; the short-material exception applies.
- Lecture 20: L2 fidelity rewrite covering P1–P6, the Gaussian-prior MAP challenge, the four-page key, and all six guide concepts. Only P5 is omitted from the public key as a pset7 code problem; the challenge has a full public solution. Slides are unavailable and video is gated; the short-material exception applies.
- Lecture 21: L2 rewrite covering four-page P1–P8, Platt challenge, five-page key, and six guide concepts. Only P8 is omitted as pset7; challenge is public. Slides are unavailable and video is gated; the short-material exception applies.
- Lecture 22: L2 rewrite covering four-page P1–P7, the multi-class challenge, five-page complete key, and six guide concepts. No key solutions are omitted. Slides are unavailable and video is gated; the short-material exception applies.

| L | Date | Canonical schedule topic | Page slug / evidence | Fidelity |
|---:|---|---|---|---|
| 1 | Jun 22 | What is Probability? | `1-Welcome` | L3 |
| 2 | Jun 23 | Conditional Probability | `2-ConditioningAndBayes` | L3 |
| 3 | Jun 24 | Bayes Theorem | `3-Independence` (navbar label differs) | L3 |
| 4 | Jun 25 | Counting and Combinatorics | `4-Counting` | L3 |
| 5 | Jun 29 | Random Variables and Expectation | `5-Binomial` (navbar label differs) | L3 |
| 6 | Jun 30 | Moments | `6-Moments` | L3 |
| 7 | Jul 1 | Poisson | `7-Poisson` | L3 |
| 8 | Jul 2 | Continuous Random Variables | `8-Continuous` | L3 |
| 9 | Jul 6 | Normal Distribution | `9-Gaussian` | L3 |
| 10 | Jul 7 | Probabilistic Models | `10-ProbabilisticModels` | L3 |
| 11 | Jul 8 | Inference | `11-Inference` | L3 |
| 12 | Jul 9 | General Inference | `12-GeneralInference` | L3 |
| 13 | Jul 14 | Multinomial | `13-Multinomial` | L3 |
| 14 | Jul 15 | Beta | `14-Beta` | L3 |
| 15 | Jul 16 | Central Limit Theorem | `15-CLT` | L2 |
| 16 | Jul 20 | Bootstrapping and P-Values | `16-Bootstrapping` | L2 |
| 17 | Jul 21 | Algorithm Analysis | `17-AlgorithmAnalysis` | L2 |
| 18 | Jul 22 | Information Theory | `18-InformationTheory` | L2 |
| 19 | Jul 23 | MLE | `19-MaximumLikelihoodEstimation` | L2 |
| 20 | Jul 28 | Logistic Regression | `20-LogisticRegression` | L2 |
| 21 | Jul 29 | Comparing Classifiers | `21-ComparingClassifiers` | L2 |
| 22 | Jul 30 | Deep Learning | `22-DeepLearning` | L2 |
| 23 | Aug 3 | Midterm 2 practice | schedule row; missing active navbar link | L1 |
| 24 | Aug 5 | Diffusion (guest lecture) | `24-Diffusion`; guest name not public | L1 |
| 25 | Aug 6 | Beyond Classification | `25-Reinforcement1` navbar title conflicts | L1 |
| 26 | Aug 10 | Applications / Practice | `26-MachineLearningReview` navbar title conflicts | L1 |
| 27 | Aug 11 | Beyond CS109 | `27-Future`; stale commented alternatives exist | L1 |
| 28 | Aug 12 | Review Session | `28-Final-Review`; stale commented alternatives exist | L1 |

Each `lecture-NN.md` records the exact writing scope and missing artifacts.
