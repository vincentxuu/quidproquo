---
title: "Supervised, Self-Supervised & Weakly Supervised Learning: From Comparing Pixels to Comparing Meaning"
date: 2026-08-16
category: ai
type: deep-dive
tags: [embedding, contrastive-learning, triplet-loss, self-supervised-learning, stanford-cs230]
lang: en
series:
  name: "Reading Stanford CS230"
  order: 2
tldr: "CS230's second lecture derives embeddings through three case studies: day/night classification teaches you to use humans as a proxy for choosing resolution, trigger-word detection teaches you to manufacture a million training examples in three hours, and face verification walks you through designing your first loss function. The final step — from supervised triplets to self-supervised pairs — is why modern models can consume billions of unlabeled images."
description: "A full read-through of Stanford CS230 (Autumn 2025) Lecture 2: model = architecture + parameters, the capacity/data-volume relationship, three case studies (day-night, trigger word, face verification), the derivation of triplet loss, SimCLR self-supervision, and multimodal shared spaces."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained)

> [The previous post](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) covered when prompting stops holding up. This one drops down a layer.

This post covers **[Lecture 2: Supervised, Self-Supervised, & Weakly Supervised Learning](https://www.youtube.com/watch?v=DNCn1BpCAUY)** (2025/09/30, Kian Katanforoosh, 1 hour 40 minutes. The syllabus title is "Key AI Concepts Through Case Studies").

This is the densest lecture in the series. Katanforoosh is CEO of Workera and a CS230 co-creator; he teaches half the in-person sessions. His framing up front: the in-person class doesn't repeat the academic content of the online videos, it brings **industry perspective and decision-making method**. So the whole lecture is three case studies, and at every step he asks the students what they'd do before giving an answer.

## Warm-up: pinning down what a "model" is

> "**Model = architecture + parameters.** Think of ChatGPT in the cloud as really just **two files**: one describing the architecture, one describing the parameters. You keep calling those two files and you get inference. It's obviously more complicated than that in practice, but that's the core."

The things you get to vary: input type, output type (classification/regression/generation), architecture, **loss function**, activation, optimizer, hyperparameters.

The loss function is the star of this lecture:

> "Designing a good loss function is an **art**. Strong deep learning researchers are very creative about this."

He uses YOLO as an example (**You Only Look Once**, not You Only Live Once): its loss function is hard to parse the first time, but there are reasons for every piece.

### Capacity: how much data you have decides how big a model you should use

- A shallow network + a million cat photos → it can't learn, not flexible enough
- **A billion-parameter transformer + a million cat photos → it won't learn what a cat is, it will memorize those million photos**

> "**The volume and diversity of your data determines the model capacity you need.**"

### What each layer is looking at

Take a three-layer network trained on faces and inspect it neuron by neuron:

- The **first layer** sees pixels → learns diagonal edges, vertical edges, horizontal edges
- The **middle layer** sees the first layer's output → learns eyes, noses, ears (with edges you can assemble circles)
- **Deeper** → larger facial structures, progressively closer to the task itself

That's encoding. And here's where the line gets drawn:

> **An encoding is any vector representation. It only becomes an embedding when the "distance" between those vectors means something.**

Two related terms: **feature engineering** is the old way (hand-build an eye detector and a mouth detector and combine them), **feature learning / end-to-end learning** is the current way (let the data speak). "You don't need to tell the network that eyes matter for recognizing faces. It'll figure that out."

### The number one mistake in projects

> "The **number one mistake we see in projects is people adding data and forgetting to adjust the labels.**"

Cat → cat/dog/giraffe means the output layer needs three neurons and the labels have to go from 0/1 to **one-hot**; if multiple animals can appear at once you need **multi-hot**. "This sounds silly, but in a lot of projects people swap the data, forget the labels, and then wonder why it doesn't work."

## Case study 1: day/night classification — it's all in the task definition

He deliberately sets up "pretend foundation models don't exist" to force the class to think from scratch.

The hard cases the students dig out: **indoor photos** (but there's a clock in frame), a clock only distinguishes 12 hours (you'd have to infer temperature from clothing), sunny vs. overcast, **northern Norway and Sweden** (where the clock won't save you either), and **dawn and dusk** (where you have to define "day" and "night" before you can label anything).

> "The problem looks simple and it can actually be very complex. And honestly, doing this really well is something **today's foundation models still can't do in some situations.**"

### Using humans as a proxy for choosing resolution

The most practically useful trick in this case study: print the images at different resolutions, hand them to friends, and ask whether they can tell day from night. Below some resolution, humans can't.

**The answer lands on 64×64×3.**

He stresses that **3**: color carries information here (blue sky), and stripping it makes it hard even for humans. But in Lecture 5 we'll see a famous reinforcement learning algorithm where researchers found that **removing color didn't hurt performance and made training much easier**.

> "In any AI project there will be moments where you need to validate an assumption, and **the best proxy you have is people.**"

### The resolution trade-off

| Too low | Too high |
|---|---|
| Not enough information (the clock might not even be in frame) | Expensive compute, slow training, **longer iteration cycles** |

Hardware constraints matter a lot, but he stresses the back-of-envelope math is about **how fast you can iterate, not final performance** — "if your model takes a year to train, you can't iterate."

> "Deep learning is an **engineering discipline**. You have to try things, or you have to know the hacks. **Why is Meta offering insane numbers for a handful of researchers? Because they actually know the hacks.**"

## Case study 2: trigger-word detection — data strategy

First, the product architecture: a voice assistant is **not one model, it's a cascade**, for power reasons:

1. An extremely light activity detector (is there sound at all)
2. The **trigger-word model** (Alexa / Hey Siri / OK Google)
3. Only then the heavier, slower, power-hungry understanding model

(An aside: Amazon argued for a long time about which word to use — **you want a word that doesn't come up in everyday conversation**, or the assistant wakes constantly. "'Activate' is actually a terrible choice, and Alexa isn't ideal either.")

### The data-distribution traps

The students found all of these, and every one has real consequences:

- **Accent**: the first version "didn't work for a single one of my German friends," so he went and recorded his two German roommates at the time
- **Age**: campus skews younger than Palo Alto, so the frequency distribution differs
- **Speaking rate**: barely matters to a human, "but **as numbers and frequencies the two are completely different**"
- **Gender**: different frequency distributions
- **Background noise**: you don't hear subways on the Stanford campus → **this model will very likely fail for a New Yorker who rides the subway daily**

### The labeling-scheme experiment, run on humans

This is the most elegantly designed segment of the lecture. He plays three **Italian-language** clips and has the students play the model:

- **Scheme one**: you're only told "the word appears in clips 1 and 3" → almost nobody gets it
- **Scheme two**: the **position** of the word is marked → someone gets it immediately (pomeriggio)

> "**Easier for you means easier for the model.**"

The key argument: scheme one is cheaper to label, but the model probably needs **a thousand times more data** to learn from it — and scheme two's labeling cost is **not a thousand times higher**. So the answer is obvious.

(He adds: this is also how you solve **cold start** — use the information-dense labeling scheme to get the model off the ground, then switch schemes for later data.)

### Extreme class imbalance

If a whole clip contains a single 1, "predict 0 everywhere" gets 99.9% accuracy and the gradient collapses toward all-zeros.

The fix is to **stretch** the 1-region so the positive/negative balance isn't as extreme. He's blunt about it: "**This is purely an engineering hack, there's no science behind it.**"

The architecture is an RNN whose last layer is **one sigmoid per timestep**, with per-timestep binary cross-entropy as the loss.

### A million training examples in three hours

Three databases:

1. **Positive words** (recorded in person)
2. **Negative words** (deactivate, kitchen, lion, dog… — deliberately including words that **sound close** to the positive)
3. **Background noise** — "essentially free online, just pull the audio track off a video platform"

The procedure: grab **freely licensed** data online (he makes a point of saying "understanding licensing models is itself a skill worth learning once and using for life: CC BY, CC BY-NC, MIT, Apache"), hire a few people to walk around campus with phones recording people saying "activate" and other words, cut the words out precisely, then write a Python script that inserts words **randomly and without overlap** into 10 seconds of background noise.

> **The whole point: the script knows where it put "activate," so it can label automatically.**

A thousand "activate"s × ten thousand other words × unlimited background noise, plus augmentation (pitch shift, speed up and down) → **over a million examples in under three hours.**

**But you cannot build your test set this way.** The test set has to be as realistic as possible and must be hand-labeled — though it's far smaller.

### Go ask the experts

> "What I learned then: **go find the experts, ask what they've tried, and learn from their failures.**"

He mentions a senior PhD student on the first floor of the Gates building who took one look at the architecture and knew it would fail, and knew why, from having done too many speech projects. "**That's what your TAs are for** — go ask 'am I doing this right, where should I go next week.'"

## Case study 3: face verification — designing your first loss function

The setup: the school wants face verification to replace swiping student IDs (dining halls, gym, pool).

The resolution is **412×412×3**, much higher than day/night classification, because you need to resolve things down to pupil color. "Airport fast-track uses much higher resolution than this — they're working at the **iris** level."

### Why you can't just compare pixels

- **Lighting**: the top-left pixels of two images can differ by nearly 255, but **that pixel doesn't matter at all** — "it penalizes you somewhere that has no bearing on the judgment"
- **Geometry**: shift a person three pixels to the right and a pixel-wise comparison is completely different (translation, rotation, scale invariance)
- **Everything else**: glasses, hats, hairstyles, beards, age — "and the person on the student ID is always younger than the person in front of you"

All four have one thing in common: **the surface changed but the meaning didn't. And pixel-wise comparison only sees the surface.**

### The fix: encoding plus a threshold

Both images go through the **same network**, each produces a 128-dimensional vector, you compute the distance (0.4), set a threshold (0.5), and decide.

The threshold sets the true-positive / false-positive / false-negative trade-off — "**the airport's threshold and the Stanford dining hall's threshold are obviously not the same.**"

A student asks what features actually live in those 128 dimensions, and the answer is honest:

> "**I can't tell you right now**, not without doing that research. The point of deep learning is that you design a loss function and force the parameters to learn features."

(This question gets addressed head-on in Lecture 10 — a whole lecture on opening the model up.)

### Triplet loss

He states the goal in plain language first: **different photos of the same person should have nearby vectors, photos of different people should have distant ones.**

The data comes in triplets: **anchor** (the reference), **positive** (same person), **negative** (different person). Minimize the anchor–positive distance and maximize the anchor–negative distance.

There's a live poll (A/B/C, results 47 : 23 : 3) where the trick is that the question says **minimize** — minimizing the negation of the anchor–negative distance is the same as maximizing it.

**Why the margin (written α in class) can't be dropped**: without it, "output 0 for everything" is a valid solution — all distances become 0, the loss is 0, and the model gets a perfect score having learned nothing.

The source is [FaceNet](https://arxiv.org/abs/1503.03832) (Schroff, Kalenichenko, Philbin, CVPR 2015). The paper hits 99.63% on LFW using 128 bytes per face.

> "Congratulations, **you've designed your first loss function.**"

Also: **negatives only exist at training time.** At test time only the camera image goes through the network and gets compared — there's no third image. "That's purely a training device."

### Verification → identification → clustering

| | Definition | Everyday example |
|---|---|---|
| **verification** | Given two images, same person or not | European border control: present your passport, then the camera compares |
| **identification** | Given one image, who are you | US Global Entry: present nothing, look at the camera, walk through |

**Identification** works by storing **vectors instead of images** in the database and running **k-nearest neighbors**. Store three vectors per person, and if the three nearest all point to the same person, confidence is higher; airports can afford 10-NN. For someone not in the database, the nearest vector's distance exceeds the threshold and they're stopped.

**Clustering**: your phone's photo app automatically grouping pictures of your mother is **k-means on top of the embedding**. The phone probably stores one "mother centroid," and a new photo goes into whichever centroid's folder it's closest to.

## Self-supervision: what if you have no labels at all

Triplets require knowing which two images are the same person. **And labeling is expensive.**

Katanforoosh throws this to the class and pushes hard. Someone suggests "let the network find images that are close to each other," and he blocks it:

> "But you **don't know** whether they're the same person. I hand you a **randomly initialized** network, you photograph me on Saturday and Sunday, and the vectors don't line up at all. **Where do you start?**"

Someone says "cluster first" — but clustering only works because of the encoder, and the encoder is the thing you're trying to train.

### The answer: manufacture your own supervision signal with augmentation

A photo of a dog rotated 90 degrees is still the same dog. The human brain uses rotation invariance plus semantic understanding. So design a loss that **forces those two images' vectors together**.

- Rotate, crop, translate, add noise — any deformed version pairs with the original
- Or mask the left half and the right half of the same face and tell the network "these two should be almost the same vector"

**No triplets needed.** This is contrastive learning, and the canonical work is [SimCLR](https://arxiv.org/abs/2002.05709) (Chen, Kornblith, Norouzi, Hinton, ICML 2020). The results make the case: train a linear classifier on top of SimCLR's representations and you get 76.5% ImageNet top-1, **matching a supervised ResNet-50**; fine-tune on just 1% of labels and you get 85.8% top-5.

> "**From FaceNet's supervised triplets in 2015 to self-supervised pairs — that's why modern models can train on 'billions of unlabeled images.'**"
>
> "It's simpler than people think, you just write a script and crawl. **The complicated part at the end is compute.**"

### Move this to text and it's next-token prediction

"The 'self' comes from **you not labeling it by hand**." The five sentence completions he runs live, each mapping to an emergent behavior:

| Sentence | Capability it forces |
|---|---|
| I poured myself a cup of ___ | The thing has to **fit in a cup** and be a **liquid** (plus a cultural split: which countries answer tea, which answer coffee) |
| The capital of France is ___ | **Encoding real-world facts** |
| She unlocked her phone using her ___ | Semantic grouping: these are all things **used to unlock** |
| The cat chased the ___ | **Probabilistic reasoning** |
| If it's raining I should bring an ___ | **Reasoning**: connecting a condition to a consequence |

> **Emergent behavior = unexpected capabilities that arise at scale from a simple training objective, never explicitly taught or labeled.**

Compare: face verification used to require deliberately constructing triplets and declaring "this is the face verification task." Now you crawl the web and run contrastive learning, and **you never defined face verification as a task at all — it just works.**

Same for other modalities: audio by **masking 20 timesteps** and reconstructing, video by **dropping frames**, biology by **masking a stretch of protein structure or DNA**. "The only limits are compute and scale."

## Weak supervision and multimodality

Connecting text and images requires paired data (image captions). But this **isn't supervised, it's weakly supervised**:

> "You're not labeling images with captions, you're **exploiting pairings that occur naturally in the world.**"

The natural pairings the class came up with are all usable: video and its audio track (a dog barking on screen plus the barking sound), films and subtitles, music and song titles, genotype and phenotype, medical images and radiology reports, game frames and keyboard input, facial expressions.

The paper cited in class is Meta's [ImageBind](https://arxiv.org/abs/2305.05665) (Girdhar et al., 2023). The demo: input the text "drums" and get drum sounds, plus the nearest images in the vector space; input a barking sound plus a beach photo and get "dog on a beach."

**One thing said in class needs correcting.** Katanforoosh says "most things connect to text, so text is usually the shared space you want" — **but the paper's conclusion is images, not text**. ImageBind binds six modalities (image, text, audio, depth, thermal, IMU), and the core finding is:

> You **don't need** all-pairs data across modalities. **Data paired with images alone is enough to bind them all.**

The paper is literally called Image**Bind**. This distinction has practical consequences: to attach a new modality to an existing vector space, what you go looking for is **its natural pairing with images**.

---

## Beyond the classroom: what this means for RAG

The six posts in the site's [RAG systems](/en/series/rag-systems) series all use embeddings, but none of them covers where embeddings come from. Pulling this lecture's thread together:

1. An embedding is not a byproduct of a model — **it is forced into existence by a specific loss function**
2. That loss defines what "close" means — FaceNet's close is "same person," SimCLR's close is "different deformations of the same image"
3. So **there is no universally good embedding**, only an embedding that's good for some particular definition of similarity

This bears directly on retrieval. When results are obviously semantically relevant but don't rank, the problem often isn't chunking or reranking — it's that **the embedding model was trained on a notion of "close" that differs from your query situation**. The site's [hybrid search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) post pulls BM25 back in to cover that blind spot, and this is the root of why.

The synthetic-data pipeline (**the script knows the answer, so it can label automatically**) holds up today too — people generating eval datasets with LLMs are using the same principle, and will hit the same trap: **you can synthesize the training set, the test set has to be real.**

## References

- [Lecture 2: Supervised, Self-Supervised, & Weakly Supervised Learning](https://www.youtube.com/watch?v=DNCn1BpCAUY) — 2025/09/30, Kian Katanforoosh. Source for the three case studies, the triplet loss derivation, and the five emergent-behavior completions
- [FaceNet: A Unified Embedding for Face Recognition and Clustering](https://arxiv.org/abs/1503.03832) — Schroff et al., CVPR 2015. Triplet loss and 128-dimensional face embeddings
- [A Simple Framework for Contrastive Learning of Visual Representations](https://arxiv.org/abs/2002.05709) — Chen et al., ICML 2020. SimCLR
- [ImageBind: One Embedding Space To Bind Them All](https://arxiv.org/abs/2305.05665) — Girdhar et al., 2023. Six-modality shared space, with images as the hub
- [CS230 Lecture 2 slides](https://cs230.stanford.edu/syllabus/fall_2025/2/lecture_2.pdf)
