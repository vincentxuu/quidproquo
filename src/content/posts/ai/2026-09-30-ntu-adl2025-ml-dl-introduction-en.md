---
title: "What Machine Learning and Deep Learning Are | NTU Yun-Nung Chen Applied Deep Learning Lecture 1"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, deep-learning, machine-learning, nlp]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 1
tldr: "The first ADL lecture has no math and sets up two ideas. First, machine learning gives a machine many input-output pairs and lets it find the function that turns one into the other; deep learning chains many simple functions into a production line, supplies data only at the two ends, and lets the machine learn what every station does. Second, to solve a problem with deep learning, write down the input X and the output Y: the form of the output decides whether the task is classification or sequence prediction, and the properties of the input decide which network fits. Along the way it answers two questions: why the breakthrough waited until after 2010 (data and GPUs), and why networks go deep instead of fat."
description: "A guide to Lecture 1 of NTU Yun-Nung Chen's Applied Deep Learning, Fall 2025, built from the Introduction deck and the spoken content of videos 1.1–1.3: AI versus machine learning, why rules never cover every case, learning as finding a function, training and testing, the production line and end-to-end training, deep versus shallow, what a neuron computes, data and GPUs, why deep and not fat, and how to write a task as X to Y. Includes a worked neuron example and a self-check with answers."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 1 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (114-1, 2025/09/01–12/15) lists this lecture under "self-study / prerequisite" on the schedule, and page 17 of [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) requires students to finish it before enrolling, as part of HW0.

**Sources**: the [Introduction deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Introduction.pdf) (46 pages) and three videos: [1.1 What is ML?](https://youtu.be/Nls5bHxW6i0) (16:45), [1.2 What is DL?](https://youtu.be/asuLb0lLmJY) (41:26), and [1.3 How to Apply?](https://youtu.be/oT4UQj_PXYo) (10:11). The videos are in Mandarin, and page numbers refer to the PDF. Examples marked "made up for this post" are not from the lecture.

This lecture has no mathematical derivation. After reading you should be able to do three things: say why a rule-based program cannot solve certain tasks; compute the output of one neuron; and, given a task, write down its input X and output Y and tell whether it is classification or sequence prediction.

## AI, machine learning, and deep learning are not the same thing

Professor Yun-Nung Chen first separates three words that are often used interchangeably.

- **AI**: using machines to imitate intelligent human behavior, such as recognizing a face, writing a poem, or generalizing from one case to others. The method is not specified.
- **Machine learning**: having the machine learn those behaviors from data. It is one way to build AI.
- **Deep learning**: one method within machine learning.

Her example is a customer-service bot on LINE. It uses a machine to imitate a service agent, so it is AI, but most such bots are not built with machine learning. If a chain of if-statements solves a task, writing the program is enough. That is still AI, only not machine-learning-based AI. Machine learning needs enough data to learn from, so the first question for any task is whether this method suits it.

## Why some tasks cannot be written as rules

The task on page 5 of the deck is deciding whether a product review is positive or negative.

The intuitive approach is a keyword list: output positive when "love" or "like" appears, and negative when "bad" appears. She then shows how this path breaks down:

1. "It's not bad" contains "bad" and is positive.
2. A fix: count the negative words, and treat an even count as two negatives making a positive.
3. "It's not good … so that is very bad" has two negative words and is still negative. The rule is wrong again.

Every added rule brings a new exception. The Chinese examples on the slide make the same point: 「台灣第一波上市！」 ("first launch wave in Taiwan!") is an upvote, 「規格好雞肋…」 ("the specs are pointless…") is a downvote, and what should 「樓下買了我才考慮」 ("I'll consider it after the next commenter buys it") be?

She names the cause. People find this task intuitive, yet we cannot say how our brains make the call. Asked why one sentence is negative, we can explain that sentence. Asked for the complete method of telling positive from negative, we have none. We picked it up gradually by reading many reviews.

## Learning is finding a function

Since the rules cannot be stated, take a different approach (page 6): treat the judgment as a function f that takes a review x and outputs positive or negative, f(x). We do not know how f computes. We only have many pairs of x and f(x).

She uses a small guessing game to show how data helps:

- Knowing only f(1) = 1, both f(x) = x and f(x) = x² fit.
- Add f(2) = 4, and f(x) = x is ruled out while x² remains.
- The more pairs given, the more candidates are eliminated, and the more likely the remaining formula is right.

That is what machine learning does: give the machine a large number of inputs and outputs, and let it find the computation that turns one into the other.

The same framing applies to many tasks (page 7 and video 1.1):

| Task | Input x | Output f(x) | Her remark |
|---|---|---|---|
| Speech recognition | Audio | Text | People must transcribe audio by hand first; she quotes an old line that before artificial intelligence comes a lot of manual labor (a Mandarin pun: 人工智慧 / 工人智慧) |
| Image recognition | Image | License plates, handwritten digits, and so on | Used early on in the US to read handwritten ZIP codes on envelopes and sort mail by area |
| Weather forecasting | Past weather | Later weather | Monday as input and Tuesday as output, then Tuesday and Wednesday, and so on, gives many examples |
| Advertising | User information and a product | Probability of buying | With a large budget, target everyone above 0.7; with a small one, only those above 0.9 |
| Playing games | Game screen | Joystick action | In Breakout, when the ball is about to fall, the paddle should move toward it |

Page 8 fixes the process in three terms:

- **Model**: a set of candidate functions.
- **Training**: use the training data to pick the best one, f*. In her words, "finding the function."
- **Testing** (also called inference): feed an unseen x into f* and get a prediction. In her words, "using the function."

The output is often called a label, meaning a person's annotation of that example.

## Deep learning: a production line where every station learns

Deep learning is still finding a function. The difference is the form of the function: many simple functions chained into one complex function (page 10). Her example: each function is only quadratic, and stacking three of them can represent higher-degree behavior.

Her analogy is a garment production line. Turning a piece of cloth into a garment is complex, but each station is simple: cut, fold, sew. The trouble is that training each station separately would require inputs and outputs for every station.

Deep learning uses **end-to-end training**: supply data only at the two ends of the line, the initial input and the final output, and say nothing about what each station should output. When the whole line is trained, each station learns what to do.

### Deep learning and neural networks are the same thing

She tells this story every year. Neural networks used to be an unremarkable method in machine learning, and the name carried a stigma. Later, researchers managed to stack more layers and train them, and results improved. Worried that a paper saying "neural network" would be rejected on sight, they renamed it deep learning. People read it as something new and then saw how well it worked. The two terms refer to the same family of models.

### Hidden layers and representations

Between a network's input and output are many layers, called hidden layers because only the two ends are visible. Each layer extracts what in the data helps the task; these are called features or representations. That is why deep learning is also called representation learning. She mentions that the conference ICLR is about exactly this (its full name is the International Conference on Learning Representations).

She gives an easy threshold to remember: **more than one hidden layer counts as deep**. A hundred layers is common now, but two already make a deep learning model. The threshold sits there for a reason: in the past, only one layer could be computed.

### Deep versus shallow is about which stations people design

Pages 12–15 contrast speech and vision:

- **Speech recognition.** The shallow pipeline turns the waveform into a spectrogram, applies filters, takes a log, and ends with the expert-defined feature MFCC, which goes into a machine learning model called a GMM. Every step before the GMM is designed by experts, and only the GMM learns from data. So a shallow model is still machine learning, with a lot of expert-designed preprocessing in front. The deep approach goes from the waveform straight to the output, and every station learns from data.
- **Image recognition.** The shallow approach starts with hand-designed processing such as edge detection and ends with a learned classifier. The deep approach starts from pixels; early layers learn to detect edges, and later ones respond to shapes and patterns.

The benefit is much less hands-on design work for experts, and the machine may pick up information the experts never thought of. She states the cost as well: **you do not know what it actually learned**. You can only analyze afterward and say it appears to have learned edges or circles, without being sure.

## What one neuron computes

Page 19 zooms in on a single circle in the network. It takes a weighted sum of the N numbers it receives, adds a constant called the bias, and passes the result through an activation function:

```text
z = w1·x1 + w2·x2 + … + wN·xN + b
y = σ(z) = 1 / (1 + e^(−z))        # sigmoid
```

The sigmoid squeezes any z into the range 0 to 1, and gives exactly 0.5 at z = 0. The mapping is curved, not a straight line, so it is non-linear. There are many activation functions, and the sigmoid is a common one. She explains why the output is squeezed: if some neurons output fractions and others output hundreds, the information passed along is badly unbalanced, the computation concentrates in a few neurons, and the rest contribute very little however they compute.

**Compute one by hand (made up for this post).** Suppose a neuron receives x = (1, 0, 1) with weights w = (2, −1, −3) and bias 0.5.

- z = 2×1 + (−1)×0 + (−3)×1 + 0.5 = −0.5
- y = 1 / (1 + e^0.5) = 1 / (1 + 1.6487) ≈ 0.378

The output 0.378 is the number this neuron passes to the next layer. Change the bias to 3.5, and z becomes 2.5 and y ≈ 0.924. The same input with different parameters gives a different output, and training is the search for good parameters.

Arrange many neurons in a layer and connect every neuron in one layer to every neuron in the next, and you have a fully connected network, the most basic kind (page 20). The whole network is a function f with an N-dimensional input and an M-dimensional output. If the task is recognizing the faces of 10 people, M is 10.

## Why the breakthrough waited until after 2010

The single-layer perceptron existed in the 1960s, and the multi-layer perceptron, with one hidden layer added between input and output, appeared in the 1980s (page 21). She stresses that these models are very close to what is used today. So why the wait of several decades?

First the breakthrough itself. The speech recognition numbers on page 22: on the RT03S FSH dataset, traditional features had a word error rate (WER) of 27.4% and deep learning had 18.5%, a 33% relative reduction; on another dataset, Hub5 SWB, it fell from 23.6% to 16.1%, a 32% relative reduction. She says the error rate had stayed above 20% for a long time.

The cause is two things becoming available in the same period:

- **Data.** Deep learning needs many pairs of x and y to train well. Around the 2010s mobile devices spread, data volume grew quickly, and the cloud made it easy to pool.
- **Compute.** She makes the point with a question: if ten thousand examples take a year to compute, you will not do it; at a week you will consider it; at a day you will try. A CPU can do the computation too, only more slowly. She relays an explanation she got from asking Bing: GPUs are good at computing many small units at once, which matches the structure of a neural network; using a GPU for other kinds of machine learning models does not make them better.

Her analogy is cooking: data is the ingredients, hardware is the kitchen equipment, and a good dish needs both.

Speed matters beyond training. As models grow, even using them (inference) takes time, and users will not wait. That is why one vendor offers both fast models and strong ones, chosen by use case.

## Why deep and not fat

More depth means more parameters and more complex functions. Yet page 30 has a theorem: any continuous function f: R^N → R^M can be represented by a network with a single hidden layer, provided that layer is wide enough. If one layer suffices, why make networks deep instead of fat?

Her answer has two steps.

**Experiment** (page 32). Compare a model with one hidden layer against one with three hidden layers on handwritten digit recognition. To reach the same performance, the model with one hidden layer needs more parameters.

**Intuition** (page 33). The figure in the deck sets one layer of width 2d against two layers of width d. She speaks of 2d as the parameter count while the figure labels it as the layer's width, and the slide's heading says the two networks have the same number of parameters. Added by this post: counting the connections of fully connected layers, the two parameter counts are not strictly equal, so the slide is an order-of-magnitude intuition. With everything in one layer, the complexity that can be represented is about O(2d). With two layers, data passes through the first and then the second, and it is about O(d²). Plugging in a number (my own): at d = 100, the scale is 200 on one side and 10,000 on the other.

My own summary: keep apart what the theorem and this argument each answer. The theorem answers "can it be represented," and the answer is yes. It does not answer "with how many parameters." The advantage of depth lies in the second question.

## How to write a task as a learning problem

This is the subject of video 1.3 and the meaning of "Applied" in the course name. Start by fixing X and Y (page 35; sensor data and natural language are her spoken additions):

- **Input X**: a word, a word sequence, audio, click logs, sensor data. She says anything you think helps the task can be an input.
- **Output Y**: a single label, a sequence of tags, a tree structure, a probability distribution, or a passage of natural language.

**The output decides the type of task** (pages 36–37):

| Type | Examples in the deck | What the output looks like |
|---|---|---|
| Classification | Sentiment analysis (「這規格有誠意！」, "these specs show real effort!" → positive), phoneme recognition, handwritten digits | One choice among a fixed set of classes. Handwritten digits are 1 of 10 |
| Sequence prediction | POS tagging (tagging each word of 「推薦我台大後門的餐廳」 as VV, PN, NR…), speech recognition, translation | A series of items predicted one at a time |

She says sequence prediction is closer to how today's language models generate.

**The input decides the architecture** (page 38):

- An image has no time axis; what matters is each pixel and its surroundings, so CNNs are used.
- Word order matters in text, and swapping two words changes the meaning, so RNNs were used. Stock prediction is the same: rising then falling means something different from falling then rising.
- A Transformer lets the model find what to attend to; it attends to order when order matters and to surroundings when surroundings matter.

Here she gives a practical reminder: **do not reach for the most popular large language model on every task**. She says a large model on a simple classification task is sometimes a waste of resources: it costs more, and a small model may already do very well. Let the large model generate data, train a small model on it, and deploy the small one, which is fast and cheap at inference.

Page 41 lists three factors for applied deep learning: data, hardware, and talent. She calls talent the most important. Many companies have data and hardware, and it takes people who know how to frame the problem and choose the model to avoid trying everything by brute force.

**A walkthrough (made up for this post).** Suppose customer emails must be routed automatically to three departments: refunds, shipping, and accounts.

- X is the text of an email, a sequence of words.
- Y is one of three departments, so this is classification, 1 of 3.
- The input is ordered text, so a model that handles sequences fits.
- This is simple classification. Following her reminder, have a large model label a few thousand old emails, then train a small classifier to deploy.

If the requirement changes to "write a reply to each email," Y becomes a passage of text, the task turns from classification into sequence prediction, and the choices above change with it.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"AI is machine learning."** A customer-service bot built from if-statements is AI and uses no machine learning.
- **"It takes a hundred layers to be deep learning."** Her threshold is more than one hidden layer.
- **"One layer can represent any function, so depth is unnecessary."** Being representable does not make it economical. For the same performance, the shallow model needs more parameters.
- **"The post-2010 breakthrough came from a brand-new model."** The models are close to those of decades earlier. What changed was the amount of data and the available compute.

## Self-check

The questions were written for this post.

**1. Apply the rule "output positive if 'good' appears, negative if 'bad' appears" to "not good" and "not bad." What are the results, and what does that show?**

"not good" is judged positive and "not bad" is judged negative, both wrong. Keywords alone miss negation, and the ways of writing negation cannot all be listed, which is why the task is learned from data.

**2. A neuron has input x = (2, 1), weights w = (1, −2), and bias 0. With a sigmoid, what is the output?**

z = 1×2 + (−2)×1 + 0 = 0, and σ(0) = 0.5.

**2b. For the same neuron, change the bias to 1. What is the output?**

z = 1, and σ(1) = 1 / (1 + e^(−1)) = 1 / (1 + 0.3679) ≈ 0.731.

**3. For "turn a meeting recording into a transcript," what are X and Y? Is it classification or sequence prediction?**

X is the audio signal and Y is a sequence of text. It is sequence prediction.

**3b. What about "decide whether an email is spam"?**

X is the text of the email, and Y is one of two classes, "yes" or "no." It is classification.

**4. Put 200 units in one layer, or split them into two layers of 100. By the estimate on page 33, what is the scale of the complexity of each?**

One layer is 2d, that is 200, and two layers is d², that is 10,000. This is the deck's rough estimate for intuition, not a rigorous theorem.

**5. You have ten thousand labeled reviews, need to classify sentiment, and face heavy traffic with real-time responses. Is calling the largest language model directly a good idea?**

First identify the task: the output is positive or negative, so this is simple classification. Her reminder in 1.3 is that a large model on such a task is sometimes wasteful and costly, while a small model is fast and cheap at inference. Following that, I would first train a small model on the ten thousand reviews, and ask a large model to generate more data only if it runs short.

**6. Why did the deep learning breakthrough come around the 2010s, and not when the models first appeared?**

The models themselves are close to those of decades earlier. Two things were missing: enough data, and enough compute (GPUs) to finish in a reasonable time. Both became available only around the 2010s.

Previous: [Course Overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)
Next: [Neural Networks and Backpropagation](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en)

## Further reading

- [CMU 11-785 Lecture 1: Introduction](/posts/ai/2026-08-22-cmu-11785-01-introduction-en) and [Lecture 2: Neural Nets as Universal Approximators](/posts/ai/2026-08-22-cmu-11785-02-universal-approximators-en) spend more time on universality and why depth matters.
- The [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) covers the same NLP deep learning storyline in an English-taught course.
- The two textbooks on p. 45 of the deck: [Deep Learning](http://www.deeplearningbook.org) by Goodfellow, Bengio, and Courville, and Michael Nielsen's [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com).

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=Nls5bHxW6i0
title: ADL 1.1: What is ML? (YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=asuLb0lLmJY
title: ADL 1.2: What is DL? (YouTube)
```

Original videos: [ADL 1.1: What is ML? (YouTube)](https://www.youtube.com/watch?v=Nls5bHxW6i0), [ADL 1.2: What is DL? (YouTube)](https://www.youtube.com/watch?v=asuLb0lLmJY), [ADL 1.3: How to Apply? (YouTube)](https://www.youtube.com/watch?v=oT4UQj_PXYo)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): all three videos (1.1, 1.2, 1.3) were worked from their captions. The caption file contains speech-recognition errors, so technical terms follow the deck. 1.1 and 1.2 carry an upload date and description of 2024/09/04, so they are Fall 2024 recordings, not a 2025 re-recording.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. Confirmed that 1.1 and 1.2 match the article, and noted that both are Fall 2024 recordings dated 2024/09/04.
- 2026-10-13: Moved the verification history out of the body and switched cross-references within the series from post order to lecture numbers.
- 2026-10-13: Rewrote the whole guide from the spoken content of the three videos, adding a worked neuron example, a task-framing walkthrough, common misreadings, and a self-check with answers.

## References

- [ADL Fall 2025 Introduction slides (250901_Introduction.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Introduction.pdf)
- [ADL 1.1: What is ML? (YouTube)](https://youtu.be/Nls5bHxW6i0) (in Mandarin)
- [ADL 1.2: What is DL? (YouTube)](https://youtu.be/asuLb0lLmJY) (in Mandarin)
- [ADL 1.3: How to Apply? (YouTube)](https://youtu.be/oT4UQj_PXYo) (in Mandarin)
- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [Course Logistics slides (HW0 requirement)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)
- [Zeiler & Fergus, Visualizing and Understanding Convolutional Networks (arXiv)](https://arxiv.org/abs/1311.2901)
- [Michael Nielsen, Neural Networks and Deep Learning, Chapter 4](http://neuralnetworksanddeeplearning.com/chap4.html)
- [Goodfellow, Bengio, Courville, Deep Learning](http://www.deeplearningbook.org)
