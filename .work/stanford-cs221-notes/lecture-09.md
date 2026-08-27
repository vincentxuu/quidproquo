# Lecture 9: MDPs III: Differentiating Expected Return Directly

- Date: 2025-10-20
- Instructor: Percy Liang
- Artifact: policy_gradient
- URL: https://stanford-cs221.github.io/autumn2025-lectures/?trace=policy_gradient
- Gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable.

## Agenda evidence

- Policy gradient parameterizes the action distribution directly instead of first constructing a complete value table.
- The log-derivative trick rewrites gradients blocked by sampled actions as a product of log policy and return.
- A baseline leaves the expected gradient unchanged while reducing variance; estimation noise is often the practical bottleneck.

## Boundary

Use only Autumn 2025 evidence. Keep course claims separate from editorial interpretation; do not reconstruct hidden tests or missing classroom discussion.

