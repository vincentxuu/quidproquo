---
title: "CS189 Spring 2026 Lec 14 & 16: MLE vs MAP, Bias-Variance, Entropy and KL, Plus a Midterm Self-Check"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, bias-variance, information-theory, exam-prep]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 9
tldr: "Lec 14 recasts ridge as MAP under least squares plus a Gaussian prior, breaks down bias-variance, and closes by using Chatbot Arena to show how to read a paper. Lec 16 builds entropy from compression, moves on to KL and cross-entropy, and lands back on the logistic regression loss. The 3/17 midterm and its official solutions are public in the past-exams folder, with 6 problems, 56 points, 110 minutes, and 6 problem-by-problem walkthrough videos, so you can sit it as a mock exam."
description: "Guide to Berkeley CS189 Spring 2026 Lectures 14 and 16: MLE and MAP, the Bayesian reading of ridge, the bias-variance trade-off, entropy, KL divergence and cross-entropy, and how to self-assess with the official sp26 midterm and solutions."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy)

**Video status: Videos included.** [Source details](#course-video-sources)

This guide follows the public materials of [CS189 Spring 2026](https://eecs189.org/sp26/) (Jennifer Listgarten / Alex Dimakis). The series starts at the [Berkeley CS189 overview](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en).

The [previous post](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers-en) was about how to minimize a loss. This one asks where those losses come from. Two things you have already seen come back from a new angle:

- **Ridge regression**: introduced as least squares plus `λ‖w‖²`. Lec 14 shows it is exactly the MAP estimate under a Gaussian prior on the weights.
- **The logistic regression loss**: introduced as maximum likelihood. Lec 16 recasts it as cross-entropy, a measure in bits of how far apart two distributions are.

The midterm (3/17) comes the week after these lectures, so the end of this post lays out a self-check using the official exam.

## Course video sources

The official Spring 2026 schedule and the official YouTube playlist (Spring 2026 Lectures, 25 videos) were checked live on 2026-10-10; the lecture recordings embedded here are listed there. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=Z1KuNG9HyiQ
title: Lecture 14 recording: MLE, MAP and Bias-Variance Trade-off
```

```youtube
url: https://www.youtube.com/watch?v=ArSadC8hY-Q
title: Lecture 16 recording: Entropy, Information, and Logistic Regression
```

Original videos: [Lecture 14 recording: MLE, MAP and Bias-Variance Trade-off](https://www.youtube.com/watch?v=Z1KuNG9HyiQ)、[Lecture 16 recording: Entropy, Information, and Logistic Regression](https://www.youtube.com/watch?v=ArSadC8hY-Q)

Course and recording entries:

- [Official course and recording entry](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Lectures — official YouTube playlist (25 videos)](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)

Checked: 2026-10-10.

Content check: verified against the video transcripts (2026-10-10; mostly spot samples and keyword searches, not word by word): the Lecture 14 video (Z1KuNG9HyiQ, about 69 minutes) contrasts MLE and MAP using coin-bias estimation, connects it to ridge and least squares, then covers bias-variance and tuning on a validation set, matching the first two sections of this post; the transcript has no Chatbot Arena, Bradley–Terry, or five-question paper-reading checklist, so that part appears only in lec14.pdf. The Lecture 16 video (ArSadC8hY-Q, about 70 minutes) is indeed Entropy, Information, and Logistic Regression: entropy through compression (about 73 bits for the 100-day rain data, the horse race), cross-entropy and KL, then the logistic regression loss; the MNIST and CIFAR-10 dataset figures are not mentioned in the transcript, and the video ends with midterm logistics. The midterm section and the problem walkthrough videos are outside this check. The transcripts do not name the speakers, so speaker attribution is not verified.

## Where the materials are

| Item | Official title / content | Materials | Assigned Bishop reading |
|---|---|---|---|
| Lec 14 (3/5) | MLE, MAP and Bias-Variance Trade-off | [Notes folder](https://drive.google.com/drive/folders/1dXJkBmG5eKAaODUFlZy-ngJwwr2ON0fx): `lec14.pdf` (58 pages); [recording](https://www.youtube.com/watch?v=Z1KuNG9HyiQ) | 2.6.1–2.6.2, 3.1.1, 4.1.2, 4.1.6, 4.3 (bias-variance), 5.4.3 |
| Lec 16 (3/12) | Entropy, Information and Logistic Regression | [Notes folder](https://drive.google.com/drive/folders/1_Lc-MtkVryhi1nhB_BRCKhkKuJFOVkz-): `lec16.pdf` (66 pages); [recording](https://www.youtube.com/watch?v=ArSadC8hY-Q) | 2.5.1 (entropy), 2.5.5 (KL), 5.3.1, 5.4.3–5.4.4 |
| Midterm (3/17, 7–9pm) | 6 problems + Honor Code, 56 points, 110 minutes | [Exam sp26-midterm.pdf](https://drive.google.com/file/d/1KZFOxAYg4RYP_xzf5-OnjqVvZQ82Quw5/view), [solutions sp26-midterm-sol.pdf](https://drive.google.com/file/d/1VCTJML71X_RZevsNpdsuy9IlFKl9QrxR/view), [walkthrough playlist](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-oUudIQgL4uTjsiR-UWBlI) (6 videos, Problems 1–6) | — |

Both midterm PDFs sit in the past-exams folder linked from the [Resources page](https://eecs189.org/sp26/resources/) (under `midterm/exams` and `midterm/solutions`). The same folder also has the Fall 2025 midterm and practice midterm. I opened all of these links without logging in on 2026-09-29. On this site's [A0–A3 scale](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en), this stretch is A3, with the bonus of a real exam that comes with solutions. What you can't get is the in-class Slido interaction and the midterm grade distribution.

## Lec 14: MLE, MAP, and ridge

The roadmap in `lec14.pdf` has five parts: least squares as maximum likelihood (a recap), choosing different noise models, prior beliefs, MLE vs MAP, and bias-variance.

**It starts with a coin.** The probability Y of heads is unknown, and you observe two outcomes x1 and x2. MLE looks only at the data. MAP first puts a prior on Y (the slides use a discrete prior and mention that a Beta prior also works), then multiplies by the likelihood using Bayes' rule. The difference: with little data, the prior pulls the estimate toward what you already believed.

**Then it moves to regression weights.** The same idea applies to w: put a Gaussian prior centered at 0 on it, with variance σ_w² controlling how strongly you expect small weights. The slides read this prior as a preference for simpler models. Taking the negative log of the posterior turns maximization into minimization, and after rearranging you get exactly the ridge objective. The slides conclude:

- For linear regression with Gaussian noise, least squares equals MLE.
- Add a Gaussian prior on w, and ridge equals MAP.

<details>
<summary>Where the regularization strength λ comes from</summary>

After taking the negative log, the data term is weighted by 1/σ² (the noise variance) and the prior term by 1/σ_w² (the prior variance on the weights). The slides multiply the whole expression by σ², so λ is the ratio of the two variances. More noise, or a stronger belief that weights should be small, means a larger λ.

</details>

## Lec 14: bias-variance

The slides first list what a model is supposed to do (fit the data, explain what we observe, generalize, predict the future, and so on), then use "Is this cat grumpy, or are we overfitting to human faces?" to introduce overfitting. Next they split the expected test error into three terms:

| Term | Definition in the slides | Associated with |
|---|---|---|
| Bias | The expected deviation between the predicted value and the true value; depends on the choice of function class | Underfitting |
| Noise | Randomness in the data-generating process itself: measurement variability, stochasticity, missing information | Beyond your control |
| Model variance | How much the prediction changes across different training datasets | Overfitting |

The key trick in the derivation is adding and subtracting a term: insert `h(x)` into the error expression, then use the independence of the noise ε and w to make the cross terms vanish. The slides include two quick quizzes, such as "what is E[t] equal to?" and "what is E[ε] equal to?", that you can use to check you're following.

Apply this to ridge. As λ grows, the weights shrink and the model becomes less flexible, so bias goes up, but the model is less sensitive to noise, so variance goes down. As λ approaches 0, the opposite happens. The slides sum it up in one line: regularization is a mechanism that trades variance for bias. The experiment follows Bishop's setup: N = 25 noisy observations, fit with M = 24 Gaussian basis functions plus a bias, repeated over many generated datasets. Training error rises monotonically with λ, test error is U-shaped, and λ is chosen by validation.

## End of Lec 14: Chatbot Arena and how to read a paper

This part appears only in `lec14.pdf`; it is not in the recording's transcript. The last part of the deck introduces [Chatbot Arena](https://arxiv.org/abs/2403.04132), a public platform where a user enters a prompt, two anonymous models answer side by side, the user votes for the better one, and many such battles are aggregated into a leaderboard. The slides tie it back to this lecture: leaderboard scores come from a Bradley–Terry model, which is essentially logistic regression (Y = which model won), and a model's Arena Score is its coefficient β.

Then comes a checklist of five questions for reading a paper:

1. What problem is this paper tackling?
2. What do prior works do, and where do they fall short?
3. What is the key insight? What does it do that prior works don't?
4. What are the inputs and outputs of the method?
5. What are its limitations?

The slides note that the first four can usually be found in the introduction. This section maps directly onto the [HW2 paper questions](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en), so read these pages before starting the homework.

## Lec 16: entropy through compression

`lec16.pdf` doesn't open with a formula. It opens with a compression problem. Suppose it rains in Seattle each day with probability 80%, independently, and you record 100 days. How much information does that sequence contain, and how far can you compress it?

- **Entropy:** Shannon's compression theorem says entropy is the ultimate limit of compression. In this example, 100 bits compress to about 73 bits. If it always rains, there is no information and you can compress to 0 bits. A fair coin has entropy of 1 bit per flip and can't be compressed at all.
- **Intuition:** pointing out one item among L takes log L bits. Random sequences almost always land in a set of "typical sequences", so you only need log(number of typical sequences) bits. The slides say this is essentially the law of large numbers (the Asymptotic Equipartition Property) and recommend Cover & Thomas, *Elements of Information Theory*, for details.
- **Exercise:** a horse race with 8 horses. A naive code needs 3 bits. The slides ask you to compute the entropy and check whether a given code reaches the Shannon limit.

## Lec 16: KL, cross-entropy, and back to logistic regression

The slides then reinterpret two quantities in terms of bits:

- **Cross-entropy:** the total number of bits needed to describe data whose true distribution is p when you use a compression scheme designed for q.
- **KL divergence:** the extra bits wasted compared with the optimal scheme.

So cross-entropy = entropy + KL. The slides put it in one line: you can't compress p using a scheme designed for q. They also preview that cross-entropy will be the loss used for both logistic regression and deep learning.

Back to logistic regression, the slides first stress that "logistic regression is not a regression; it's binary classification", and contrast it with generative models: assume x is Gaussian in each class with a shared covariance and you get LDA; with different covariances, QDA. A worked example then predicts whether a customer clicks a home insurance ad from two features, with parameters `w = [0.1, 1, 10]`. It computes the score, passes it through a sigmoid to get a click probability, writes the likelihood of the whole dataset, and shows that the log-likelihood is the negative cross-entropy.

For multiple classes, the sigmoid becomes a softmax, the weights become a matrix, probabilities are `softmax(Wx)`, and the loss is `−Σ yᵢ log pᵢ`. The slides use MNIST (60,000 handwritten digits) and CIFAR-10 (6,000 images per class, 50,000 for training and 10,000 for testing) as example datasets.

## Midterm: self-assessing with the official exam

The exam is 18 pages with 6 problems, and the 1-point Honor Code brings the total to 56. After reading the problems, here is how each maps back to the lectures:

| Problem (original title) | Points | What it tests | Review |
|---|---|---|---|
| A Linear Affair | 5 | Multiple-choice concepts on linear regression: linear in what, and what happens when n ≫ d or n ≪ d | Lec 7–10 |
| Smooth Operator | 7 | A smoothness regularizer penalizing differences between adjacent weights: write it as `‖Dw‖²`, find the closed form, examine the λ → ∞ limit | Lec 9–10 |
| Chill Gaussian Question | 11 | MLE and MAP (Gaussian prior) for the mean of a multivariate Gaussian, and how MAP behaves as n → ∞ | Lec 5–6, 14 |
| Ozan Risks It All for MoG | 11 | GMM log-likelihood, responsibilities rᵢₖ, and the reduction to k-means as σ² → 0 | Lec 4–7 |
| We Adopt a Sigma Grindset | 10 | Which of LDA / QDA / logistic regression is generative vs discriminative; with a shared covariance the log-odds reduce to a linear form, and how LDA relates to logistic regression; bias and variance of LDA / QDA when covariances differ | Lec 11–12, 14, 16 |
| On a Downward Spiral | 11 | A gradient and one update step computed by hand on three data points, properties of SGD gradients, what happens to the gradient when one feature is scaled by 100, and which model has no closed form | Lec 13, 15 |

I didn't find entropy, KL, momentum, or Adam in the problems; Lec 16 shows up mainly through the logistic regression problem. That describes this one exam, though, not the official exam scope.

A suggested self-check:

1. Print `sp26-midterm.pdf`, set a 110-minute timer, and finish it without notes.
2. Grade yourself against `sp26-midterm-sol.pdf` (25 pages), and use the table above to tag each lost point with a lecture.
3. Watch only the walkthrough videos for the problems you missed. Note the playlist order is Problem 1, 2, 3, 4, 6, 5, so Problem 5 is last.
4. For another round, the same folder has the Fall 2025 midterm and practice midterm, with solutions. A different set of instructors wrote those, which helps you check whether you've only learned one exam style.

## Matching Fall 2026 lectures

[Fall 2026](https://eecs189.org/fa26/) moves bias-variance earlier, to Lecture 7 "Bias-Variance Trade-off + Regularization", with Logistic Regression in Lectures 8–9. The midterm is on 10/20 (Week 9), preceded by a Midterm Review on 10/16. The Fall 2026 schedule has no lecture titled for entropy or KL.

## Further reading

- Probability background: [Stanford CS109 on the Beta distribution](/en/posts/learning/2026-08-22-stanford-cs109-lecture-14-beta-distribution-en), [information theory](/en/posts/learning/2026-08-22-stanford-cs109-lecture-18-information-theory-en), [maximum likelihood estimation](/en/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation-en), [logistic regression](/en/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression-en)
- Classic ML for comparison: [Stanford CS229 guide](/en/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

Previous: [Lec 13 & 15: convergence, momentum, Adam, SGD](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers-en). Next: [HW2 guide](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en).

## Things you can do tonight

1. Derive the ridge objective yourself from the negative log posterior, and write down which two variances λ is the ratio of.
2. Compute the entropy H(0.8) for the Seattle example and confirm that 100 days come to roughly 73 bits.
3. Pick an evening and sit the sp26 midterm under time, following the steps above.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Spring 2026 schedule and YouTube playlist were checked live and list the embedded lecture recordings, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. The Lec 14 and Lec 16 videos match their topics; Chatbot Arena and the paper-reading checklist are not in the Lec 14 recording, and the post now marks them as slides-only.

## References

- [CS189 Spring 2026 homepage and schedule](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Resources (entry point to past exams)](https://eecs189.org/sp26/resources/)
- [Lecture 14 Notes folder (lec14.pdf)](https://drive.google.com/drive/folders/1dXJkBmG5eKAaODUFlZy-ngJwwr2ON0fx)
- [Lecture 14 recording: MLE, MAP and Bias-Variance Trade-off](https://www.youtube.com/watch?v=Z1KuNG9HyiQ)
- [Lecture 16 Notes folder (lec16.pdf)](https://drive.google.com/drive/folders/1_Lc-MtkVryhi1nhB_BRCKhkKuJFOVkz-)
- [Lecture 16 recording: Entropy, Information, and Logistic Regression](https://www.youtube.com/watch?v=ArSadC8hY-Q)
- [CS189 Spring 2026 midterm (sp26-midterm.pdf)](https://drive.google.com/file/d/1KZFOxAYg4RYP_xzf5-OnjqVvZQ82Quw5/view)
- [CS189 Spring 2026 midterm solutions (sp26-midterm-sol.pdf)](https://drive.google.com/file/d/1VCTJML71X_RZevsNpdsuy9IlFKl9QrxR/view)
- [Midterm walkthrough playlist](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-oUudIQgL4uTjsiR-UWBlI)
- [Chiang et al., Chatbot Arena (arXiv:2403.04132)](https://arxiv.org/abs/2403.04132)
- [CS189 Fall 2026 schedule](https://eecs189.org/fa26/)
