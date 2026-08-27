# Lecture 2: Learning I: From Computation Graphs to Linear Regression

- Date: 2025-09-24
- Instructor: Percy Liang
- Official schedule title: Learning I
- Artifact: backpropagation, linear_regression
- Primary URL: https://stanford-cs221.github.io/autumn2025-lectures/?trace=backpropagation
- Material gap: Both executable artifacts are public; unpublished classroom Q&A is not reconstructed.

## Agenda evidence

- The lecture first expresses an objective as tensor operations and propagates gradients backward through the computation graph. Backpropagation is not a neural-network-only trick; it is dynamic programming over repeated applications of the chain rule.
- Linear regression writes predictions as inner products and measures residuals with squared loss. The gradient determines the direction of each parameter update, while the learning rate controls step size.
- The real modeling choices extend beyond the optimizer. Features, loss, and representation jointly determine what the model can observe; exact gradients cannot recover information discarded by the representation.

## Writing boundary

Follow the executable artifact's order. Do not import Spring 2025 CSP material or unpublished assignment solutions. Distinguish course claims from editorial extensions.

