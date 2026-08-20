---
title: "ML Fundamentals Interview Guide: From Bias-Variance to Evaluation Metrics"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, machine-learning, fundamentals]
lang: en
type: deep-dive
description: "Breaking down the high-frequency ML fundamentals topics in AI Engineer interviews — bias-variance tradeoff, regularization, loss functions, optimization, and evaluation metrics."
tldr: "ML fundamentals interviews don't test formula memorization — they test whether you can explain concepts intuitively and hold up under follow-up questions. High-frequency topics: the practical meaning of bias-variance tradeoff, the selection logic for L1/L2 regularization, why cross-entropy beats MSE for classification, SGD vs. Adam tradeoffs, and how precision/recall priorities differ by scenario."
series:
  name: "AI Engineer Interview Prep"
  order: 2
---

## How ML Fundamentals Are Tested

ML fundamentals show up differently depending on the interview stage. Phone screens are usually rapid-fire: "Explain the bias-variance tradeoff," "What's the difference between L1 and L2 regularization," "How do you choose an evaluation metric." The interviewer gauges your depth within 30 seconds — people who can explain intuitively pass; those who need to recite formulas don't.

In onsite ML deep dives, these concepts aren't tested in isolation — they come up as follow-ups when discussing your projects. You mention using a random forest, and the interviewer asks "How did you handle overfitting?" You mention cross-entropy loss, and the follow-up is "Why not MSE?" Fundamentals aren't a standalone exam subject — they're the underlying language of every technical discussion.

This post covers the five highest-frequency fundamental topics, each with guidance on what constitutes a good interview answer.

## Bias-Variance Tradeoff

**Intuitive explanation**: Bias is the model's systematic error — the model is too simple and can't capture the data's true patterns no matter how much you train it. Variance is the model's instability — the model is too complex and overly sensitive to training noise, producing completely different predictions on a different data sample.

Here's how to explain it in an interview: "Imagine target practice. High bias means every shot lands left — your aiming technique is off. High variance means shots are scattered everywhere — sometimes you hit, sometimes you miss wildly. Ideally you want accurate and tight grouping, but in practice, reducing bias (using a more complex model) typically increases variance, and vice versa."

**Common follow-ups and answers**:

"How do you tell if a model has high bias or high variance?" — Look at the gap between training error and validation error. High training error + high validation error = high bias (underfitting). Low training error + high validation error = high variance (overfitting).

"How would you address high variance?" — Three approaches: more training data, reduced model complexity (fewer features, shallower trees), or regularization. For ensemble methods, bagging (like random forests) naturally reduces variance.

"Does the bias-variance tradeoff still hold in the deep learning era?" — Classical theory says variance must increase beyond a certain model complexity, but the double descent phenomenon shows that when model parameters far exceed training data size, test error actually decreases again. Be careful bringing this up in interviews — first confirm the interviewer is familiar with the concept, otherwise you risk discussing something the interviewer doesn't know.

## Regularization

Regularization's core idea is constraining the model's degrees of freedom to reduce overfitting. The most commonly tested topic is the difference between L1 and L2.

**L1 (Lasso)**: Adds the sum of absolute weights to the loss function. The effect is pushing unimportant weights all the way to zero — L1 provides built-in feature selection. In an interview, say "If I expect many features are noise, L1 can automatically filter them out."

**L2 (Ridge)**: Adds the sum of squared weights to the loss function. The effect is making all weights smaller but never exactly zero — L2 tends to keep all features while shrinking their influence. In an interview, say "If I believe most features contribute and I just don't want any single feature to dominate, I use L2."

**Elastic Net**: A mix of L1 and L2. Interviews usually don't go deep here, but if asked, say "When features are highly correlated, pure L1 randomly picks one from the group; Elastic Net tends to keep the whole group."

**Dropout**: The most common regularization in deep learning. Randomly deactivates a fraction of neurons during training, forcing the network not to rely on any single neuron. Intuitive explanation: "It's like training many sub-networks simultaneously and averaging their predictions at inference — similar to ensemble effects." Common follow-up: how to choose dropout rate — classic approach is 0.5 for hidden layers, 0.2 for input layers, but in practice everything needs tuning.

## Loss Functions

When interviewers ask about loss functions, they usually don't want mathematical derivations — they want you to explain "why this loss for this scenario."

**Cross-Entropy vs MSE for classification**: This is the highest-frequency question. The core answer is about gradient behavior. MSE actually produces smaller gradients when predictions are far from correct (sigmoid saturation zone), causing slow early training. Cross-entropy produces large gradients on wrong predictions and small gradients on correct ones — perfectly matching desired learning behavior. In an interview: "Cross-entropy makes the model learn fast when making big mistakes; MSE makes it learn slowly when making big mistakes — so classification uses cross-entropy."

**Binary vs Categorical Cross-Entropy**: Binary for binary classification, categorical for multi-class. If asked about multi-label — apply binary cross-entropy independently to each label.

**Regression losses**: MSE is sensitive to outliers (squaring amplifies the effect), MAE is robust to outliers but not differentiable at zero. Huber loss is a hybrid: uses MSE behavior for small errors and MAE behavior for large errors. Mentioning Huber loss in an interview earns bonus points.

## Optimization

Interviews won't ask you to derive update formulas, but will ask "Why choose Adam over SGD?"

**SGD (Stochastic Gradient Descent)**: The most basic optimizer. Updates parameters using one mini-batch's gradient per step. The problem is learning rate is hard to tune — too large causes oscillation, too small converges slowly. And in loss landscapes with many saddle points and flat regions, it easily gets stuck.

**Momentum**: SGD with "inertia" — considers not just the current gradient but also past gradient directions. Accelerates in consistent directions and dampens oscillating directions. In an interview: "Imagine a ball rolling downhill — momentum accelerates it on slopes and prevents it from stopping at small bumps."

**Adam (Adaptive Moment Estimation)**: Combines momentum with per-parameter adaptive learning rates. Works out of the box for most problems without careful learning rate tuning. Currently the most common default choice.

**Interview tradeoff logic**: "I start with Adam in most cases because it's insensitive to hyperparameters and quickly produces a baseline. If pursuing maximum performance (e.g., ImageNet training), SGD + momentum + learning rate schedule typically converges to better generalization — but requires more tuning time."

## Evaluation Metrics

The real purpose of evaluation metric questions is seeing whether you can choose the right metric for the business scenario.

**Precision vs Recall**: Precision is "of everything you flagged positive, how many actually are." Recall is "of everything that actually is positive, how many did you catch." The interview's favorite scenario questions:

- "You're building spam detection — do you prioritize precision or recall?" — Precision. Marking a legitimate email as spam is costly (users might miss important messages); missing some spam is relatively low-cost.
- "You're building cancer screening — do you prioritize precision or recall?" — Recall. Missing an actual cancer case is far costlier than flagging a healthy person as suspicious (the latter just means one more confirmation test).

**F1 Score**: The harmonic mean of precision and recall. Used when both matter and data is imbalanced. But don't default to F1 in interviews — first ask about the business scenario, then decide.

**AUC-ROC**: Measures the model's ranking ability across all thresholds. AUC = 0.5 is random guessing, AUC = 1.0 is perfect classification. Advantage: doesn't depend on a specific threshold, good for comparing different models. But on extremely imbalanced datasets, AUC can be overly optimistic — AUC-PR (area under precision-recall curve) is more reliable in those cases.

## Common Pitfalls and Interview Tips

**Don't recite definitions — give intuition.** When asked "What is regularization?", don't answer "Adding a penalty term to the loss function." Say "Regularization deliberately constrains the model's expressiveness so it doesn't memorize training data noise, but instead learns genuine patterns."

**Acknowledge boundaries when probed.** If asked something you're uncertain about (like the mathematical explanation of double descent), saying "I know the intuitive explanation but I'm not sure about the rigorous mathematical proof" is far better than making something up.

**Support with real experience.** Every concept should ideally connect to "I encountered this in a previous project — we used X to handle Y." If you lack real experience with a concept, prepare a hypothetical scenario, but make it clear it's hypothetical.

**Read the interviewer's signals.** If the interviewer nods and moves on after your bias-variance answer, don't volunteer a deep dive into double descent. Only expand when they follow up. Interview time is limited — don't consume it where depth isn't needed.

## Practice Question

### Question

"You trained a classification model that achieves 98% accuracy on the training set but only 72% on the validation set. How would you diagnose and fix this?"

**Source**: Google MLE phone screen　**Difficulty**: Medium　**Round**: phone screen

### Solution Framework

1. **Clarify the problem**: Ask the interviewer — how large is the dataset? Is the class distribution balanced? What's the model architecture? Is any regularization being used?
2. **Build a framework**: This is a classic high variance (overfitting) problem — trains well but generalizes poorly. Use the bias-variance framework to decompose.
3. **Go deep**: List mitigation approaches — more data, regularization (L2/dropout), reduced model complexity, data augmentation, early stopping — and explain each one's tradeoff.
4. **Close**: Mention how you'd verify the fix works (learning curve analysis: plot training/validation loss vs. epoch), and how you'd monitor this in production.

### Sample Answer (as you'd say it in an interview)

> **First, identify the problem type.** Training at 98% but validation at 72%, a 26-point gap — this is classic overfitting. The model has memorized training data noise rather than learning generalizable patterns. I'd start by plotting learning curves: if training loss keeps decreasing but validation loss starts rising after a certain epoch, that confirms overfitting.
>
> **I'd attack from three angles.** First, the data side — increase training data or apply data augmentation to expose the model to more variation. Second, the model side — add L2 regularization (grid search weight decay between 1e-4 and 1e-2) or dropout (0.3-0.5); if the model is too deep, consider reducing layers. Third, the training side — use early stopping to halt training when validation loss starts rising. I'd try regularization first since it's lowest cost, then add data if that's not enough.
>
> **Finally, I'd verify the fix.** Re-plot learning curves and confirm the training-validation gap narrows to within 5%. Also check precision/recall distributions on validation — accuracy can be misleading with class imbalance, and if the positive/negative ratio is heavily skewed, I'd switch to monitoring AUC-PR.

### Self-Check Rubric

| Checkpoint | Mentioned? |
|-----------|-----------|
| Identified overfitting (high variance) rather than underfitting | |
| Learning curve diagnostic method | |
| At least three mitigation approaches (data/model/training) | |
| Specific parameters or methods for each approach | |
| Verification method after fixing | |
| Bonus: mentioned accuracy limitations with class imbalance | |

## References

- [Chip Huyen — ML Interviews Book](https://huyenchip.com/ml-interviews-book/) — Complete coverage of ML fundamentals interview topics; the bias-variance, regularization, and loss function frameworks in this post draw from this book
- [Stanford CS229 Lecture Notes](https://cs229.stanford.edu/lectures-spring2022/main_notes.pdf) — Andrew Ng's ML course notes covering regularization, optimization, and evaluation metrics with both mathematical derivations and intuitive explanations
- [An Overview of Gradient Descent Optimization Algorithms — Sebastian Ruder](https://arxiv.org/abs/1609.04747) — Systematic comparison of SGD, momentum, Adam and other optimizers; the optimization evolution logic in this post references this survey
- [Scikit-learn — Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html) — Official documentation for ML fundamentals interview evaluation metrics (precision, recall, F1, AUC) and their computation
- [The Elements of Statistical Learning](https://hastie.su.domains/ElemStatLearn/) — Classic textbook on bias-variance tradeoff and regularization; the theoretical foundation for deep ML fundamentals interview follow-ups
