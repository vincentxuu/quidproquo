# Lecture 3: Learning II: Linear Classification, Features, and Cross-Entropy

- Date: 2025-09-29
- Instructor: Percy Liang
- Official schedule title: Learning II
- Artifact: linear_classification
- Primary URL: https://stanford-cs221.github.io/autumn2025-lectures/?trace=linear_classification
- Material gap: The executable lecture is public; hidden tests and solutions for the sentiment assignment are not.

## Agenda evidence

- A classifier scores every label and predicts with an argmax. Because argmax is not a useful differentiable training objective, learning relies on a differentiable surrogate loss.
- Softmax converts logits into a distribution, and cross-entropy raises the probability assigned to the correct class. It coordinates multiclass competition but does not guarantee calibrated real-world probabilities.
- Sentiment classification makes feature design concrete: word, substring, and conjunction features determine the evidence visible to a linear boundary. Error analysis should return to features and data, not merely run more gradient steps.

## Writing boundary

Follow the executable artifact's order. Do not import Spring 2025 CSP material or unpublished assignment solutions. Distinguish course claims from editorial extensions.

