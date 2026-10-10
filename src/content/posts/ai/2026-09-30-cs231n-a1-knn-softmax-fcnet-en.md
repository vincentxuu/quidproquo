---
title: "CS231N Assignment 1 Guide: kNN, Softmax, Two-Layer and Fully Connected Networks"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, stanford, ai-course, computer-vision, homework, numpy, neural-networks]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 5
tldr: "CS231N Assignment 1 is worth 12% of the grade and was due April 16, 2026. All five Colab notebooks are hand-written numpy on CIFAR-10. Q1 kNN asks for distance computations with two loops, one loop, and no loops. Q2 Softmax goes from naive to vectorized to SGD. Q3 assembles affine, ReLU, and softmax into a two-layer network. Q4 switches to HOG and color-histogram features. Q5 generalizes to any depth and implements Momentum, RMSProp, and Adam. The 65 KB starter code is public; the Gradescope grading isn't. This post covers structure and goals only, not solutions."
description: "A guide to Stanford CS231N (Spring 2026) Assignment 1: which functions each of the five notebooks (knn, softmax, two_layer_net, features, FullyConnectedNets) asks you to implement, where they live in the cs231n/ package, the accuracy targets and inline questions stated in the notebooks, Colab and Google Drive setup, submission, late days, and the Honor Code. No solutions."
draft: false
glossary:
  - term: "CIFAR-10"
    definition: "A dataset of small 32×32 color images in 10 classes. All five notebooks in CS231N Assignment 1 use it."
    context: "The starter code's get_datasets.sh downloads cifar-10-python.tar.gz from a University of Toronto URL."
    links:
      - label: "CIFAR-10 dataset"
        url: "https://www.cs.toronto.edu/~kriz/cifar.html"
  - term: "gradient check"
    aliases: ["gradcheck"]
    definition: "Estimating a gradient with numerical differences and comparing it to your analytic gradient to confirm the backward pass is correct."
    context: "The softmax, two_layer_net, and FullyConnectedNets notebooks in Assignment 1 all include gradient-check cells; the helpers are in cs231n/gradient_check.py."
  - term: "HOG"
    aliases: ["Histogram of Oriented Gradients"]
    definition: "A hand-designed image feature: split the image into small cells and histogram the edge orientations in each."
    context: "Assignment 1 Q4 replaces raw pixels with HOG plus an HSV color histogram and looks at how accuracy changes."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-a1-knn-softmax-fcnet)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Version note**: Based on the [CS231N](https://cs231n.stanford.edu/) Spring 2026 [Assignment 1 page](https://cs231n.github.io/assignments2026/assignment1/) and the [assignment1.zip starter code](https://cs231n.github.io/assignments/2026/assignment1.zip) (65 KB, 29 entries). All facts were checked by downloading and opening the official files on 2026-09-30. Access level **A3** (defined in the [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): the questions, starter code, built-in checks, and dataset download script are all public, enough to self-study. What you can't get is Gradescope grading, TA office hours, and the Ed forum.

**Series**: Previous [L4: Neural Networks and Backpropagation](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en) | Next [L5: Image Classification with CNNs](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

[L2](/posts/ai/2026-09-30-cs231n-image-classification-linear-en) through [L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en) covered three things: the data-driven classification pipeline, optimizing with gradients, and computing gradients with backprop. Assignment 1 has you write all three by hand in numpy.

The [assignments page](https://cs231n.stanford.edu/assignments.html) describes it as "Image Classification, kNN, Softmax, Fully-Connected Neural Network, Fully-Connected Nets", worth 12% of the grade. On the [2026 schedule](https://cs231n.stanford.edu/schedule.html) it goes out on the day of L2 (April 2) and is due on the day of L6 (April 16). The assignment page gives the deadline as Thursday, April 16, 2026 at 11:59pm Pacific Time.

This post covers each question's goals, which files you touch, and the checkpoints and inline questions the notebooks spell out. **It gives no solutions.** The [Honor Code on the assignments page](https://cs231n.stanford.edu/assignments.html) says it plainly: solutions from past offerings have been posted online, the course knows, and it expects all submitted work to be the student's own.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding. Rechecked live on 2026-10-10: the official Spring 2026 schedule lists no recording links, no public Spring 2026 playlist was found, and the Spring 2025 playlist has no single lecture matching this article’s scope. Checked: 2026-10-10.

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## Goals on the assignment page

The page frames the assignment as practice "putting together a simple image classification pipeline based on the k-Nearest Neighbor or the SVM/Softmax classifier". Its nine goals fall into four groups:

- **Pipeline**: understand the train/predict stages, the train/val/test split, and tuning hyperparameters on validation data.
- **Engineering**: write efficient vectorized numpy code.
- **Models**: implement and apply kNN, Softmax, a two-layer network, and a fully connected network, and understand their differences and tradeoffs.
- **Representations**: see how much higher-level representations (color histograms, HOG) improve on raw pixels.

## What the starter code looks like

Unzipping gives an `assignment1/` folder:

| Path | Contents |
|---|---|
| `knn.ipynb`, `softmax.ipynb`, `two_layer_net.ipynb`, `features.ipynb`, `FullyConnectedNets.ipynb` | The Q1–Q5 notebooks |
| `collect_submission.ipynb` | Packages your submission |
| `cs231n/classifiers/` | `k_nearest_neighbor.py`, `softmax.py`, `linear_classifier.py`, `fc_net.py` |
| `cs231n/layers.py`, `layer_utils.py` | Forward/backward for each layer |
| `cs231n/optim.py` | Update rules |
| `cs231n/solver.py` | The `Solver` class that runs training |
| `cs231n/gradient_check.py` | Numerical gradient helpers |
| `cs231n/features.py` | Color histogram and HOG features |
| `cs231n/datasets/get_datasets.sh` | Downloads CIFAR-10 and `imagenet_val_25.npz` |

Most of the work is filling in TODO blocks in the `.py` files; the notebooks call, check, and plot. One thing that can confuse you: `layers.py` also contains function stubs for batchnorm, dropout, and convolution, but `FullyConnectedNets.ipynb` says not to worry about dropout or batch/layer normalization yet. Those come in the next assignment.

## Q1: kNN (`knn.ipynb`)

**Goal**: build a complete kNN classifier and pick k with cross-validation.

The functions you write are all in `cs231n/classifiers/k_nearest_neighbor.py`:

- `compute_distances_two_loops`, `compute_distances_one_loop`, `compute_distances_no_loops`: three ways to compute the same distance matrix. The notebook checks that all three agree and prints how long each takes.
- `predict_labels`: find the k nearest neighbors in the distance matrix and vote on the label.

The notebook sets up cross-validation with 5 folds and k chosen from `[1, 3, 5, 8, 10, 12, 15, 20, 50, 100]`. Its stated checkpoints: with k = 1 you should see about 27% accuracy, and with the cross-validated k you should get above 28% on the test data.

There are three inline questions: what causes the distinctly bright rows and columns in the distance matrix; which pixel preprocessing steps leave an L1-distance nearest-neighbor classifier's performance unchanged; and a set of true/false statements about kNN (whether the decision boundary is linear, how 1-NN and 5-NN compare on training and test error, how classification time scales with training set size).

**What it trains**: vectorization. Going from two loops to none is the assignment's first push to rewrite "one at a time" as matrix operations. The notebook itself notes you might not see a speedup going from two loops to one; the no-loop version is the point.

## Q2: Softmax (`softmax.ipynb`)

**Goal**: implement the softmax loss and its gradient, train a linear classifier with SGD, and tune hyperparameters on the validation set.

Where you write code:

- `cs231n/classifiers/softmax.py`: `softmax_loss_naive` (with loops) and `softmax_loss_vectorized`.
- `cs231n/classifiers/linear_classifier.py`: `train` (the SGD loop) and `predict`.
- A hyperparameter search in the notebook over regularization strength and learning rate on the validation set.

The notebook uses `grad_check_sparse` for gradient checking and finally visualizes the learned weights for each class.

There are four inline questions: why the initial loss should be close to −log(0.1); why an SVM loss gradient check might occasionally mismatch in one dimension; what the visualized Softmax weights look like and why; and a true/false question on whether adding a new datapoint could change the softmax loss but leave the SVM loss unchanged.

**What it trains**: [L2](/posts/ai/2026-09-30-cs231n-image-classification-linear-en)'s softmax loss plus [L3](/posts/ai/2026-09-30-cs231n-regularization-optimization-en)'s "train with analytic gradients, check with numerical ones".

## Q3: Two-layer neural network (`two_layer_net.ipynb`)

The notebook is titled "Fully-Connected Neural Nets" and walks you through modular layers in order:

1. In `cs231n/layers.py`: `affine_forward`/`affine_backward`, `relu_forward`/`relu_backward`, and `softmax_loss`, each with a numerical gradient check.
2. The "sandwich" layers `affine_relu_forward`/`affine_relu_backward` in `cs231n/layer_utils.py` (provided; the notebook checks them).
3. `TwoLayerNet` in `cs231n/classifiers/fc_net.py`: `__init__` and `loss`.
4. Read `cs231n/solver.py`, then use a `Solver` to train a `TwoLayerNet` to about 36% validation accuracy.
5. Debug: look at the loss curve and a visualization of the first-layer weights to diagnose what's wrong.
6. Tune hyperparameters (hidden size, learning rate, number of epochs, regularization strength) to get above 48% on both validation and test. The notebook says its best network gets over 52% on validation.

Two inline questions: which activation functions suffer from near-zero gradient flow and what inputs cause it; and which steps can shrink a large gap between training and test accuracy.

**What it trains**: [L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en)'s forward/backward API. Each forward returns an output and a cache; each backward takes the upstream gradient and the cache and returns gradients for every input.

## Q4: Image features (`features.ipynb`)

**Goal**: see how accuracy changes when you swap raw pixels for hand-designed features.

The feature functions `color_histogram_hsv` and `hog_feature` in `cs231n/features.py` are **already written**. The work is in the notebook:

1. Extract HOG and HSV color-histogram features for every image.
2. Train a Softmax classifier on the features, tune its hyperparameters, and look at what it gets wrong.
3. Train Q3's `TwoLayerNet` on the features. The notebook says this should beat every previous approach, easily clearing 55% on the test set, with its best model at about 60%.

One inline question: describe the misclassifications and whether they make sense.

**What it trains**: this sets up L5. Hand-designed features beat raw pixels, but a person designed them. [L5](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en) lets the network learn its own.

## Q5: Fully connected networks (`FullyConnectedNets.ipynb`)

**Goal**: generalize the two-layer network to any depth and implement L3's optimizers.

1. `FullyConnectedNet` in `cs231n/classifiers/fc_net.py`: a network with any number of hidden layers, starting with an initial loss and gradient check.
2. **Overfit a small dataset**: first a three-layer network, then a five-layer one (100 units in every hidden layer), tuning the learning rate and weight initialization scale to reach 100% training accuracy on 50 images within 20 epochs.
3. `sgd_momentum`, `rmsprop`, and `adam` in `cs231n/optim.py`. The notebook checks them against precomputed expected values, then plots loss and accuracy curves for the update rules side by side.
4. Train the best `FullyConnectedNet` you can, with at least 50% on validation and test. The notebook says careful tuning can get above 55%, but that part isn't required and earns no extra credit.

Two inline questions: which of the three- and five-layer networks is more sensitive to initialization scale and why; and why AdaGrad's updates become very small, and whether Adam has the same problem.

**What it trains**: overfitting 50 images is a debugging habit. If the model can't memorize a tiny dataset, the bug is in your code, not the data. The update-rule section maps directly onto the code on [L3](/posts/ai/2026-09-30-cs231n-regularization-optimization-en)'s slides.

## Environment and submission

**Colab and Drive**: the assignment page embeds a Colab walkthrough video. Every notebook starts by mounting Google Drive and asks you to set `FOLDERNAME` to where you put the unzipped folder in Drive, then runs `get_datasets.sh` to download CIFAR-10. The page adds two reminders: save periodically so a Colab VM disconnect doesn't lose your work, and to support in-session file editing, change "Runtime version" from "Latest" to "2025.07" before running anything in a new notebook.

**Submission**: after all five notebooks are done, run `collect_submission.ipynb` in Colab. It zips your `.py` and `.ipynb` files into `a1_code_submission.zip` and converts all notebooks into a single `a1_inline_submission.pdf`; upload both to Gradescope. The page insists that submitted notebooks must have been run with their outputs visible.

**Late days**: per the [course home page](https://cs231n.stanford.edu/), every student gets 4 free late days for the quarter, at most 2 per assignment, and after those run out each extra late day costs 25%.

**Generative AI**: the [assignments page](https://cs231n.stanford.edu/assignments.html) treats generative AI like any other collaborator. Each student must write down solutions independently, and using generative AI tools to substantially complete sections of the assignments violates the Honor Code.

## How to self-study it

Outside Stanford you don't get Gradescope, so treat the notebooks' own checkpoints as the grading rubric:

1. Download [assignment1.zip](https://cs231n.github.io/assignments/2026/assignment1.zip), put it in your Google Drive, and set the runtime version as the page describes.
2. Work Q1 → Q5 in order. The layers you write in Q3 get reused in Q4 and Q5; if Q3 is wrong, everything after it breaks.
3. For each question, make sure every numerical gradient check shows a small relative error before chasing accuracy.
4. The accuracy targets are the notebooks' numbers: kNN above 28%, two-layer network above 48%, features plus two-layer network above 55%, fully connected network at least 50%.
5. Write out the inline answers, then check them against the [L2](/posts/ai/2026-09-30-cs231n-image-classification-linear-en)–[L4](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en) slides. That's the only self-grading you have.

For a warm-up, the Backprop Colab covered in the [L4 post](/posts/ai/2026-09-30-cs231n-neural-networks-backprop-en) ends with a fill-in-the-blanks exercise pitched just below Q3.

One thing you can do tonight: download the starter code, open `cs231n/classifiers/k_nearest_neighbor.py`, read only the docstring of `compute_distances_no_loops`, write out the three terms of ‖x − y‖² on paper, and figure out which one a single matrix multiply can compute.

## Further reading

- The course as a whole, access gaps, and a 10-week self-study plan: [Reading Stanford CS231N (series overview)](/posts/ai/2026-09-30-cs231n-course-overview-en)
- The same ideas from another angle: [CMU 11-785 Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en), [CMU 11-785 Lecture 8: Optimizers and Regularization](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Rechecked official sources; there is still no public recording matching this article, and a check date was added.

## References

- [CS231N Assignment 1 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment1/) — deadline, Colab setup, goals, Q1–Q5, submission
- [assignment1.zip starter code](https://cs231n.github.io/assignments/2026/assignment1.zip) — notebook contents, where the functions to implement live, accuracy checkpoints, inline questions
- [CS231N assignments page](https://cs231n.stanford.edu/assignments.html) — A1 weight of 12%, Honor Code, generative AI policy
- [CS231N course home (Spring 2026)](https://cs231n.stanford.edu/) — late policy, grading
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html) — the lectures when A1 goes out and is due
- [CIFAR-10 dataset](https://www.cs.toronto.edu/~kriz/cifar.html) — the dataset the assignment uses
- [CS231N Backpropagation Review Colab](https://colab.research.google.com/github/cs231n/cs231n.github.io/blob/master/backprop.ipynb) — a warm-up before Q3
- [CS231N notes: Image Classification](https://cs231n.github.io/classification/) — kNN and cross-validation
- [CS231N notes: Linear Classification](https://cs231n.github.io/linear-classify/) — the Softmax classifier
