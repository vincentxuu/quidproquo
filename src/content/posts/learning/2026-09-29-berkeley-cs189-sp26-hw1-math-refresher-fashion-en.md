---
title: "CS189 Spring 2026 HW1 Guide: Linear Algebra / Calculus / Probability Warm-up + Fashion Coding"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, course-guide, homework, linear-algebra, probability]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 6
tldr: "CS189 Spring 2026 HW1 has three pieces: ten written math warm-ups (a linear system, limits of matrix powers via eigendecomposition, SVD, a matrix that flips an image, partial derivatives, a chain rule over a recursion, and four probability problems including Bayes for cancer screening), plus two public Modal notebooks on Fashion-MNIST. Part 1 drills pandas / Plotly / K-means / an MLP / matrix-based image augmentation / tensor puzzles; Part 2 does price regression, MAE / MSE / R², confusion matrices, and finally a secret test set whose images have been rotated. Due Feb 20; no official solutions."
description: "A guide to Berkeley CS189 Spring 2026 (Listgarten / Dimakis) Homework 1: what each written problem tests and which lecture has the tools; the structure of the two Modal notebooks (fashion_pt_1, fashion_pt_2) and the list of MANUAL questions; how to do it outside Berkeley and check yourself without the autograder. Based on the official files as of 2026-09-29; no solutions included."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw1-math-refresher-fashion)

This guide follows [CS189 Spring 2026](https://eecs189.org/sp26/) (Jennifer Listgarten / Alex Dimakis). HW1 was posted in the week of Lec 3 (Jan 27) alongside Discussion 1, and it is due **Friday, Feb 20, 11:59 PM**, the day after the [Lec 7–10 linear regression block](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression-en) ends.

HW1 is titled "AGI, Everywhere, All at Once," but the content is practical. It checks two things:

1. Whether your linear algebra, calculus, and probability are strong enough for the course.
2. Whether you can take an image dataset from loading through exploration and training to debugging with pandas, Plotly, scikit-learn, and PyTorch tensors.

This post goes problem by problem: what each one tests and which lecture has the tools. **It does not include solutions.** HW1 has no public official solutions, and pasting answers would not help a self-learner anyway.

## Official materials and scope

The schedule lists three links under HW1:

- [Part 1: Written](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C): a Drive folder with `hw1.pdf` and the LaTeX template `hw1_student.tex`
- [Part 1: Coding](https://modal.com/notebooks/prabhune/main/nb-4Q9GuhQLDqA3cByymHQNML): the Modal notebook `fashion_pt_1`, titled "Homework 1.1"
- [Part 2: Coding](https://modal.com/notebooks/prabhune/main/nb-qmwHwOJWkhC3zn8msc2G2I): the Modal notebook `fashion_pt_2`, titled "Homework 1.2"

The [syllabus](https://eecs189.org/sp26/syllabus/) says every homework has two parts: Part 1 is a shorter Warmup and Part 2 is the Main Homework, released together with the same deadline. Homeworks have both public and hidden autograder tests. The public ones are sanity checks, such as confirming you entered a number and not a word; the hidden ones check correctness.

There are three Gradescope assignments: the written PDF goes to "HW1 Write-Up," and each notebook is zipped and submitted to "HW1.1 Coding" and "HW1.2 Coding."

**Access level**: the problem PDF, the LaTeX template, and both notebooks open without a login, so the problems themselves are A3 (see the [global AI/CS course map](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en)). You cannot get Gradescope, the hidden tests, official solutions, or Ed. Outside readers can work every problem but have to verify correctness themselves.

## Written part: ten math warm-ups

There are ten written problems worth 46 points in total according to the PDF, in three topics. You also have to copy out and sign an honor code statement first.

### Linear algebra (problems 1–4)

| # | Problem | What it tests | Where the tools are |
|---|---|---|---|
| 1 | System of equations (3 pts) | How many solutions a 3×3 linear system has, with reasoning | Rank and linear dependence, the same idea as "when is XᵀX invertible" in Lec 8 |
| 2 | Asymptotic powers of 2×2 matrices (6 pts) | lim Mⁿ for three 2×2 matrices | The hint is eigendecomposition M = PDP⁻¹, so Mⁿ = PDⁿP⁻¹; compare the eigenvalues' magnitudes with 1 |
| 3 | Singular Value Decomposition (4 pts) | Find the unit vector x that maximizes ‖Ax‖ | In the SVD, A maps each right singular vector to a left singular vector scaled by its singular value; which one gets stretched most? |
| 4 | Image Flipping (6 pts) | Flatten a 3×3 image to 1×9 and flip it vertically with a matrix T; then generalize to N×N and to horizontal flips | Permutation matrices. The PDF says this is a warm-up for coding problem 4 |

Problem 4 deserves extra time. Problem 4 of the Part 1 notebook is all about image augmentation with transformation matrices, and the written version lets you see exactly how a matrix moves pixels on a 3×3 example first.

### Calculus (problems 5–6)

- **Problem 5, Partial Derivatives (8 pts)**: first and second partial derivatives of four two-variable functions. Part (b) asks you to find the critical points and decide which gives a minimum, which needs the second-order condition, i.e. the Hessian.
- **Problem 6, Recursive expression and derivatives (6 pts)**: given zₙ = wₙ₋₁zₙ₋₁ + bₙ₋₁, compute dzₖ/dzₖ₋₁, dzₙ/dz₁, and dzₙ/db₁.

Problem 6 looks like algebra practice, but it is backpropagation in miniature: along a chain of computations, the derivative of the final output with respect to an early variable is the product of the local derivatives. The same structure returns as full backprop in Lec 17–18 and HW3.

### Probability (problems 7–10)

| # | Problem | What it tests |
|---|---|---|
| 7 | Conditioned uniform difference (3 pts) | X, Y i.i.d. Unif(−1, 1); find P(\|X − Y\| ≤ 0.5 \| XY > 0). The hint says to draw the 2D square and look at areas |
| 8 | Nearest-neighbor arc length (4 pts) | Drop 20 uniform points on the unit circle; find P(D > t) for the arc distance from X₁ to its nearest neighbor, and the expected arc length in degrees |
| 9 | Cancer screening (3 pts) | Sensitivity 90%, false-positive rate 3%, prevalence 0.1%; find the posterior probability of disease given a positive test |
| 10 | Follower Counts (3 pts) | 420 people seated randomly in a circle with distinct follower counts; find the expected number who have more followers than both neighbors |

Each has one key move. Problem 7 turns a conditional probability into a ratio of areas. Problem 8 translates "D > t" into "none of the other 19 points may fall inside a certain arc." Problem 9 is Bayes' theorem, covered in the probability review in [Lec 4](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm-en). Problem 10 is linearity of expectation with indicator variables.

Pause after you finish problem 9. When prevalence is very low, a positive result from a decent test can mean something quite different from what intuition says. This base-rate issue comes back in another form in [Lec 11–12](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic-en) on evaluating classifiers.

## Coding Part 1 (HW1.1): from DataFrames to tensor puzzles

The dataset is [Fashion-MNIST](https://github.com/zalandoresearch/fashion-mnist): 28×28 grayscale images of clothing in 10 classes, loaded with torchvision. The notebook lists five learning objectives: data manipulation with numpy and pandas, visualization with Plotly, organizing and analyzing datasets, understanding data exploration and preprocessing, and practice with torch tensor operations.

The notebook's own grading table totals 39 points. The structure:

| Section | Parts | Content |
|---|---|---|
| Problem 0 | 0a | Why hold the data in a `DataFrame` |
| Problem 1: pandas and Plotly | 1a–1d | Check class balance, `groupby()`, plot the label distribution, show examples per class |
| Problem 2: data structure via clustering | 2a–2c | Run K-means directly on pixels, evaluate the clusters, visualize them |
| Problem 3: training a classifier | 3a–3e | Train an MLP, write predictions back to the DataFrame, per-class accuracy, confusion matrix, prediction confidence |
| Problem 4: augmentation with transformation matrices | 4a–4j | Horizontal flip, shift, blur, rotation, the gaps rotation leaves and bilinear interpolation, composing transforms, then augmenting test images and evaluating the classifier |
| Problem 5: Tensor Puzzles | 5a–5e | Using only broadcasting, indexing, arithmetic, and comparisons, write sum, outer product, diag, triu, and vstack in one line (< 80 characters) |

Problem 2's K-means connects straight back to [Lec 4](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm-en). Problem 4 is the scaled-up version of written problem 4: still moving pixels with a matrix, but now rotated pixels no longer land on the grid, which is why bilinear interpolation comes in.

Problem 5's rules are strict: no `torch.sum`, `view`, `reshape`, or `unsqueeze`. It forces you to really understand broadcasting: two dimensions line up only when they are equal or one of them is 1. You will lean on this constantly when writing autograd and Transformers later.

To submit, download the notebook as `.ipynb` and zip it with the trained `classifier.joblib`.

## Coding Part 2 (HW1.2): regression, a secret test set, and distribution shift

Part 2 turns to modeling and debugging. Its objectives are to build and evaluate classifiers, debug and analyze model performance, and explore ways to improve accuracy. Its grading table also totals 39 points.

It starts by redoing the Part 1 MLP pipeline: `train_test_split`, `StandardScaler`, `MLPClassifier`, and train/test accuracy. Then come four sections:

1. **Problem 5: Regression analysis.** The task switches from classification to regression: predict each item's price from its image features. You join a price table onto the DataFrames, train a linear regression, compute MAE, MSE, and R², and finally compare the relative price error on misclassified versus correctly classified images. This ties directly into Lec 7–10.
2. **Problem 6: A new test set.** Load a "super secret" test set, predict with the original model, look at per-class accuracy and the confusion matrix, and inspect where the errors cluster. Accuracy drops sharply, because the test images have been rotated.
3. **Problem 7: Solution 1, a rotation-invariant classifier.** Augment the training data with random rotations and retrain, so the training distribution moves toward the test distribution.
4. **Problem 8: Solution 2, undo the rotations.** Train an `MLPRegressor` to predict each image's rotation angle, rotate the test images back to 0°, and feed them to the original classifier. It is an example of a regression model used as preprocessing.

The last part, **Problem 9**, is Test Time Augmentation: using only the original `MLPClassifier`, with no new models trained, apply several transforms to each test image and aggregate the predictions to reach at least 44% accuracy. The notebook warns that the autograder runs your function repeatedly, so a slow one will time out.

To submit, zip the notebook with four `.joblib` model files.

The whole of Part 2 is about something that happens constantly in practice: **the training and test distributions differ**. The three solutions stand for three ideas: change the training data, change the test data, or look more than once at inference time.

## MANUAL questions: the seven that go in the write-up

The final "Coding" section of the written PDF lists seven headings. Paste the figures or written answers for the notebook questions marked **MANUAL** under them:

| Source | Question | Title |
|---|---|---|
| HW1.1 | 1c | Visualizing Label Distribution |
| HW1.1 | 2c | Visualizing Clusters |
| HW1.1 | 4g | Matrix Multiply Questions |
| HW1.1 | 4j | Analysis of Augmentation Techniques |
| HW1.2 | 5c | MAE, MSE, and R-Squared |
| HW1.2 | 6d | Analysis of Class Accuracies and Confusion Matrix |
| HW1.2 | 8d | Comparing Data Augmentation and Rotation Correction |

The official files disagree in one place. The grading table at the top of HW1.2 also marks 6b, 7b, and 8a as "Manual," while marking 5c as not manual, which does not match the write-up template. As a self-learner, just answer all of them in your notes. If you are enrolled, follow the course announcements.

## Doing it from outside Berkeley

1. **Write the written part in the LaTeX template.** `hw1_student.tex` already lays out every problem, so filling it in gives you a PDF in the same format enrolled students submit.
2. **You do not have to run the notebooks on Modal.** They are standard Jupyter notebooks. The Modal setup steps include creating a volume named `cs189` mounted at `/mnt/cs189`, turning off AI code completion (the notebook says Modal's Tab completion gives incorrect outputs), and stopping the kernel when idle to save credits. You can also download the `.ipynb` and run it locally, but you will have to sort out data paths and package versions yourself.
3. **No hidden tests means writing your own checks.** For the written part, verify with NumPy: approximate the matrix-power limits with a large n, compare against `np.linalg.svd`, and write a Monte Carlo simulation for each probability problem. For the coding part, sanity-check the numbers: on a class-balanced dataset, per-class accuracies should not be wildly different.
4. **Follow the Tensor Puzzles rules.** Forbidden functions will still produce the right output, but then you have not practiced anything.

## What to do tonight

1. Open the [folder with hw1.pdf](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C) and do M₁ from problem 2, then check it with `np.linalg.matrix_power(M, 1000)`.
2. Before working problem 9, write down your gut guess; compare after you compute.
3. Open [fashion_pt_1](https://modal.com/notebooks/prabhune/main/nb-4Q9GuhQLDqA3cByymHQNML) and finish Problem 1 and Problem 5a, one for pandas and one for broadcasting.

## Fall 2026 and further reading

[Fall 2026](https://eecs189.org/fa26/) does not link its homework publicly on the course page, so HW1 cannot be compared yet.

On this site:

- Background for the probability problems: [Stanford CS109 Lecture 3: Bayes' theorem](/en/posts/learning/2026-08-22-stanford-cs109-lecture-03-bayes-theorem-en), [Lecture 5: random variables and expectation](/en/posts/learning/2026-08-22-stanford-cs109-lecture-05-random-variables-expectation-en)
- The regression derivations: [Lec 7–10: linear regression, the geometry of least squares, and regularization](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression-en)
- Series entry point: [CS189 overview](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en)

## Series navigation

- Previous: [Lec 7–10: linear regression, the geometry of least squares, and regularization](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression-en)
- Next: [Lec 11–12: classification, generative classifiers, logistic regression, and ROC](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic-en)

## References

- [CS189 Spring 2026 course page and schedule (HW1 links)](https://eecs189.org/sp26/)
- [CS189 Spring 2026 syllabus (homework parts, autograder policy)](https://eecs189.org/sp26/syllabus/)
- [HW1 Part 1 Written folder (hw1.pdf, hw1_student.tex)](https://drive.google.com/drive/folders/1gnC68dyq-QKJ5qFc-wKPJ4bCn1Q-YV8C)
- [HW1.1 Coding: fashion_pt_1 (Modal notebook)](https://modal.com/notebooks/prabhune/main/nb-4Q9GuhQLDqA3cByymHQNML)
- [HW1.2 Coding: fashion_pt_2 (Modal notebook)](https://modal.com/notebooks/prabhune/main/nb-qmwHwOJWkhC3zn8msc2G2I)
- [Fashion-MNIST dataset (Zalando Research)](https://github.com/zalandoresearch/fashion-mnist)
- [Xiao, Rasul, Vollgraf, Fashion-MNIST: a Novel Image Dataset for Benchmarking Machine Learning Algorithms (arXiv:1708.07747)](https://arxiv.org/abs/1708.07747)
- [CS189 Fall 2026 course page](https://eecs189.org/fa26/)
