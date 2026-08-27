# Lecture 13: Bayesian Networks II: Gibbs Sampling and the Markov Blanket

- Date: 2025-11-03
- Instructor: Percy Liang
- Artifact: gibbs_sampling
- URL: https://stanford-cs221.github.io/autumn2025-lectures/?trace=gibbs_sampling
- Gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable.

## Agenda evidence

- Rejection sampling discards most samples when evidence is rare, and its cost worsens with evidence probability.
- Gibbs sampling fixes evidence and repeatedly resamples each unobserved variable from its conditional distribution.
- A node's Markov blanket limits each update to parents, children, and co-parents. Locality lowers per-step cost, but mixing time remains a limitation.

## Boundary

Use only Autumn 2025 evidence. Keep course claims separate from editorial interpretation; do not reconstruct hidden tests or missing classroom discussion.

