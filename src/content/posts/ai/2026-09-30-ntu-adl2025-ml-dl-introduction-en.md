---
title: "NTU ADL 2025 Lecture 1: What Machine Learning and Deep Learning Are"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, deep-learning, machine-learning, nlp]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 1
tldr: "The first self-study deck of ADL Fall 2025 describes machine learning as finding a function from data, and deep learning as a production line of simple functions where the machine learns what every station does. It uses speech and vision to contrast deep and shallow models, credits big data and GPUs for the post-2010 breakthroughs, and uses the universality theorem to ask why networks should be deep rather than fat. The most practical part comes last: the output domain decides the learning task, and the architecture should fit the properties of the input domain."
description: "A guide to the Introduction deck and videos 1.1–1.3 of NTU Yun-Nung Chen's ADL Fall 2025: learning as finding a function, the machine learning framework, deep learning as a production line, deep vs. shallow, big data and GPUs, the universality theorem, fat+shallow vs. thin+deep, and how to frame an NLP task as classification or sequence prediction."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction)

**Video status: Videos included.** [Source details](#course-video-sources)

This is post 1 of [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (NTU term 114-1, 2025/09/01–12/15) lists this lecture under "self-study / prerequisite." [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) p. 17 requires students to watch it before enrolling, as part of HW0.

**Sources**: the [Introduction deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Introduction.pdf) (46 pages) and three videos: [1.1 What is ML?](https://youtu.be/Nls5bHxW6i0) (16:45), [1.2 What is DL?](https://youtu.be/asuLb0lLmJY) (41:26), and [1.3 How to Apply?](https://youtu.be/oT4UQj_PXYo) (10:11). The deck was checked on 2026-09-30. The videos are in Mandarin, and page numbers below refer to the PDF.

There is no math in this lecture. It wants you to leave with two ideas: learning means finding a function, and you only know which model to pick after you write the task as "input domain → output domain."

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

Original videos: [ADL 1.1: What is ML? (YouTube)](https://www.youtube.com/watch?v=Nls5bHxW6i0)、[ADL 1.2: What is DL? (YouTube)](https://www.youtube.com/watch?v=asuLb0lLmJY)、[ADL 1.3: How to Apply? (YouTube)](https://www.youtube.com/watch?v=oT4UQj_PXYo)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Both transcripts (1.1 and 1.2) were read. 1.1: the sentiment-classification task that cannot be written as rules, learning as finding a function, training/testing, and the speech, image, advertising and game-playing applications. 1.2: the production-line analogy and end-to-end training, the shallow vs deep speech and image comparison, hidden layers and representations, the neuron and sigmoid, the roughly one-third error drop, big data and GPUs, and the fat vs thin parameter comparison. All match the corresponding sections. One thing the article did not say: both videos carry a YouTube upload date and description of 2024/09/04, so they are Fall 2024 recordings rather than a 2025 re-recording (the description also notes slides at adl.miulab.tw). The article makes no specific claims about the slide-21 timeline as spoken in the video, and 1.3 is not embedded and was not checked.

## When you can't write the rules, let the machine find the function

Page 5 opens with sentiment classification of product reviews. "I love this product!" is easy to handle with a rule: if the text contains "love" or "like," output positive. "It claims too much." works too: "too much" or "bad" means negative. But what about "It's a little expensive."? The Chinese examples, written in the style of Taiwanese forum comments, push the point further. "First wave of launches in Taiwan!" is an upvote, "The specs are pretty useless…" is a downvote, but what do you do with "I'll consider it once the guy downstairs buys one"?

The slide's conclusion: some tasks are too complex for us to know how to write a program. Page 6 reframes the problem. Instead of writing `program.py`, assume there is a function f that takes a review and outputs up or down, and **give the machine lots of data so it learns what f should be**. Page 7 lists other tasks that fit the same frame: speech recognition, image recognition, weather forecasting, customer prediction, and playing video games. Each one is f(input) = output.

Page 8's Machine Learning Framework breaks this into three terms:

- **Model**: a set of candidate functions (the hypothesis function set).
- **Training**: pick the best function f* from that set, given the observed training data.
- **Testing**: use the learned f* to predict inputs it has not seen.

In the next lecture these three terms become three questions: what is the model, what makes a function good, and how do we pick the best one.

## Deep learning: a production line where every station learns

Page 9 defines deep learning as a subfield of machine learning. Page 10 uses a production-line metaphor. A deep learning model chains many simple functions f1, f2, f3 into one very complex function. The key idea is **end-to-end training**: the machine learns what each station should do, instead of a person specifying it.

Page 11 redraws the production line as a neural network: input layer, several hidden layers, output layer. What the middle layers produce are called features or representations. The slide gives two definitions: representation learning tries to learn good features, and deep learning tries to learn multiple levels of representation plus an output.

### Deep vs. shallow: which stations a human builds

Pages 12–15 compare two fields:

- **Speech recognition**: the shallow pipeline is waveform → DFT → spectrogram → filter bank → log → DCT → MFCC → GMM. Most boxes are hand-crafted, and only the last one is learned from data. The deep model learns every station from data. The slide quotes Deng Li at Interspeech 2014, "Bye bye, MFCC," and notes the trade-off: less engineering labor, but the machine has to learn more.
- **Image recognition**: the shallow model is again hand-crafted features plus a classifier. In the deep model every layer is learned. Page 15 cites the visualizations from [Zeiler & Fergus (ECCV 2014)](https://arxiv.org/abs/1311.2901) to show what each layer learns.

Pages 16–17 sum up the difference (credited to Dr. Socher). In machine learning, people use domain knowledge to describe the data as features, and the algorithm optimizes the weights. In deep learning, even the representations are learned. The slide adds that deep learning usually refers to neural-network-based models.

Pages 19–20 introduce a single neuron: inputs times weights, plus a bias, passed through a sigmoid activation. Each neuron is a very simple function. Stack them into layers and you get a deep neural network f: R^N → R^M. The details are in [post 2](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en).

## Why the boom came after 2010

Page 21 gives a timeline: the perceptron in the 1960s; its limits shown in 1969; multi-layer perceptrons in the 1980s; backpropagation in 1986; the 1989 objection that "one hidden layer is good enough, why deep?"; RBM initialization in 2006; GPUs in 2009; breakthroughs in speech recognition (2010) and ImageNet (2012); AlphaGo in 2016; and ChatGPT in 2022.

Page 22 gives the speech numbers. On RT03S FSH, word error rate falls from 27.4% with traditional features to 18.5% with deep learning, a 33% relative reduction.

Page 23 asks why the breakthroughs cluster after 2010. Pages 24–28 answer with two things: **big data** and **GPUs**. Speed matters because more data means longer training, and training that takes too long is impractical. At inference time, users won't wait for a response. GPU compute is what lets these applications ship.

## Why deep, not fat

Page 29 starts with the intuition that deeper means more parameters. Page 30 immediately pushes back. The **universality theorem** says any continuous function f: R^N → R^M can be realized by a network with a single hidden layer (the slide links to [chapter 4 of Nielsen's book](http://neuralnetworksanddeeplearning.com/chap4.html)). If one layer is enough, why go deep instead of fat?

Pages 31–33 compare two networks with the same parameter count, one fat and shallow, the other thin and deep. Page 32 uses handwritten digit classification to show that **the deeper model reaches the same performance with fewer parameters**. Page 33 adds a sketch of how a shallow network may need far more nodes than a deep one to represent the same function.

Keep the two questions apart. The universality theorem answers "can it be represented at all," not "how many parameters does it take, and can we learn it." The slides' argument is about the second question.

## Framing a task as a learning problem

This is the topic of video 1.3 (pp. 34–41), and it is what the "Applied" in the course name means.

Page 35 writes the learning algorithm as f: X → Y, mapping an input domain X to an output domain Y:

- **Input domain**: a word, a word sequence, an audio signal, click logs.
- **Output domain**: a single label, sequence tags, a tree structure, a probability distribution.

Pages 36–37 use the output domain to separate two kinds of task:

| Task type | Examples in the deck |
|---|---|
| **Classification** | Sentiment analysis ("these specs are sincere!" → +), speech phoneme recognition, handwriting recognition |
| **Sequence prediction** | Part-of-speech tagging (a Chinese sentence tagged word by word as VV, PN, NR…), speech recognition, machine translation |

Page 37 concludes in one line: **the learning task is decided by the output domain.**

Page 38 turns to the input side. Inputs have properties such as continuity, temporal order, and uneven importance, and the architecture should match them. CNNs handle images with local connections, shared weights, and pooling; RNNs handle temporal information; Transformers handle interactions among multiple inputs. Page 39 joins both ends: network design should use the properties of both the input and output domains.

Pages 40–41 define "applied deep learning" as framing a task into a learning problem and designing or choosing the matching model. The three core factors are data, hardware (GPU computing), and the talent to design algorithms that make networks work for a specific problem.

**Something to try tonight**: pick an NLP task you know and write down its f: X → Y. Is X a word, a sentence, or a conversation? Is Y one label, one label per word, or another string of text? Once you can write Y, you know whether it is classification or sequence prediction. Once you can describe X, you know what the RNNs and Transformers in the coming lectures are each built to handle.

## Further reading

- [CMU 11-785 Lecture 1: Introduction](/posts/ai/2026-08-22-cmu-11785-01-introduction-en) and [Lecture 2: Neural Nets as Universal Approximators](/posts/ai/2026-08-22-cmu-11785-02-universal-approximators-en) spend more time on universality and why depth matters.
- The [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) covers the same NLP deep learning storyline in an English-taught course.
- The two textbooks on p. 45 of the deck: [Deep Learning](http://www.deeplearningbook.org) by Goodfellow, Bengio, and Courville, and Michael Nielsen's [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com).

Previous: [Reading NTU Yun-Nung Chen's Applied Deep Learning 2025 Fall: Course Map, A2 Rating, and How to Read It](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)
Next: [Neural Networks and Backpropagation](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Checked the video content against its transcript. Confirmed that 1.1 and 1.2 match the article, and noted that both are Fall 2024 recordings dated 2024/09/04.

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
