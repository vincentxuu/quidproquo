---
title: "Learning Without Labels and Multimodality: How to Learn Good Representations When There Are No Annotations | NTU Yun-Nung Chen Applied Deep Learning Lecture 14"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, representation-learning, self-supervised-learning, multimodal]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 15
tldr: "A lot of data does not mean a lot of annotation. This lecture asks: with no annotations, how do you learn useful representations from data? The shared idea is to find the latent factors behind the observations. An auto-encoder compresses the input into a short code and reconstructs it. A VAE additionally requires the code to follow a Gaussian distribution, so it can generate by sampling from the distribution. Dual learning lets two tasks that run in opposite directions serve as each other's feedback. Self-supervised learning divides into self-prediction (hide a part and guess it back) and contrastive learning (pull similar ones together, push dissimilar ones apart). CLIP does contrastive learning on image-text pairs, so image classification needs no separate training; DALL·E 2 then uses its representations to generate images. The lecture ends with multimodal models: projecting images into the language model's space, and streaming interaction that listens while deciding when to speak."
description: "A guide to Lecture 14 of Yun-Nung Chen's NTU Applied Deep Learning, Fall 2025, based on the spoken content of videos 14.1–14.7 and the Fall 2024 Beyond Supervised Learning deck: latent factors, discriminative and generative, auto-encoders and denoising, deep auto-encoders and retrieval, the VAE objective and posterior collapse, three forms of dual learning, self-prediction, triplet loss, SimCSE, CLIP, DALL·E 2, LLaVA, any-to-any multimodal models, GPT-4o's streaming interaction, and three strategies for full-duplex. Includes two examples that can be worked by hand and a self-check."
draft: false
glossary:
  - term: "latent factor"
    aliases: ["latent variable"]
    definition: "A factor that cannot be observed but is assumed to exist and to control the data we see. Examples are the strokes behind handwritten digits and the topic behind a document."
    context: "Slides 2–11 of the ADL Beyond Supervised Learning deck; the shared starting point of the whole lecture."
  - term: "VAE"
    aliases: ["variational auto-encoder"]
    definition: "A kind of auto-encoder that additionally requires the code in the middle to follow a specified distribution (usually Gaussian), so new codes can be sampled from the distribution to generate data."
    context: "Slides 31–43 of the ADL Beyond Supervised Learning deck."
  - term: "contrastive learning"
    definition: "Given several samples, learn the relationships among them: similar samples are pulled together in the vector space and dissimilar ones are pushed apart."
    context: "Slides 60–70 of the ADL Beyond Supervised Learning deck; CLIP applies it between images and text."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 14 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en), and the last lecture, based on the videos for the 12/01 week of ADL Fall 2025 (114-1, 2025/09/01–12/15). Most earlier lectures assumed annotated data, or at least a "next token" to use as the target. This one answers two questions: **with only data and no annotations, what can be learned, and how? And how does the language-model approach extend to images and audio?**

Official materials:

- Videos 14.1–14.7, in the table below. None of the seven has captions, so this guide works from transcripts made from their audio. The lectures are in Mandarin.
- Fall 2025 did not publish slides for this lecture. This guide uses the [Fall 2024 Beyond Supervised Learning deck](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf) (82 slides) for reference, and **all slide numbers here refer to that 2024 deck**. The content of 14.7 is not in the 2024 deck, and for it this guide captured video frames to confirm the titles and citations on the slides.

| Video | Topic | Length | 2024 deck slides |
|---|---|---|---|
| [14.1](https://youtu.be/j5XknQ4MGw0) | Beyond Supervised Learning | 21:19 | 2–11 |
| [14.2](https://youtu.be/rQyhxK-fDyI) | Auto-Encoder | 14:40 | 12–30 |
| [14.3](https://youtu.be/I3by1PGKBMM) | Variational Auto-Encoder | 20:25 | 31–43 |
| [14.4](https://youtu.be/zDe-RNd38bQ) | Dual Learning | 12:39 | 44–55 |
| [14.5](https://youtu.be/5CJW10uSj80) | Self-Supervised Learning | 20:52 | 56–70 |
| [14.6](https://youtu.be/-UpU_dfq_IU) | CLIP & DALL·E 2 | 13:24 | 71–80 |
| [14.7](https://youtu.be/Q0-8988uEiU) | Multimodality | 19:52 | None |

Examples marked "made up for this post" are not from the lecture.

After reading you should be able to do five things: explain in terms of latent factors why unannotated data is useful; say how an auto-encoder and a VAE differ and why a VAE can generate; explain what kind of tasks dual learning needs and where the feedback comes from; tell self-prediction from contrastive learning and compute a triplet loss; and explain how CLIP classifies images without separate training.

## Why data without annotations is still useful

Professor Chen opens by saying that many of this lecture's methods have existed for a long time and some now look less practical, but the concepts are simple and often still work when applied to new techniques.

The first line on slide 2 is Big data ≠ Big annotated data. Machine learning divides into three kinds by what is at hand: with annotations, supervised learning; with an environment that can give a reward, reinforcement learning; with neither, unsupervised learning. The same slide asks: why can data that has no annotations, and is not even directly related to the task, help? The answer is: find the latent factors that control the observations.

The data that can be seen is called the observation, and what lies behind it, unseen but assumed to exist, is called a latent factor. She gives four examples:

- **Handwritten digits** (slide 3). The same 4 is written differently by each person, and the rotation angle differs too. Rotate the image a little and every pixel value changes, yet you still recognize it as a 4. The unit people understand is not the pixel but the meaning behind it, such as "the digit 4, rotated about 10 degrees."
- **Documents** (slide 4). A document has a topic behind it: finance, sports, entertainment. Topic models are a very early method that needs no annotations; feed in a large number of documents and it separates out topics and the words common to each topic.
- **Recommender systems** (slides 5–6). The system can see which videos you watched, for how long, and whether you pressed like, and what it wants to learn is which kind you like. The deck uses anime characters as the example: some people like Goku and Luffy, and some like two other characters. Her own reading is that the first kind is the simple hot-blooded type and the second is the tsundere type. Knowing the attributes of a new video (mystery, Korean drama, reality show), the system can recommend it to the right people even if no one has watched it.
- **Strokes** (slides 7–8). Handwritten characters are made of strokes. A 28×28 image has 784 pixels; if it is instead represented by "which strokes were used," for example strokes 1, 3, and 5, the vector is [1 0 1 0 1 0 ……], which is much shorter. She stresses that shorter does not mean weaker representational power, and that it may present the semantics better: different ways of writing a 7 would naturally come out as similar combinations of strokes.

### A few terms

Slides 9–11 sort out the vocabulary used later:

- **Discriminative**: compute P(Y|X); given an input, judge which class it is. This requires annotations.
- **Generative**: compute P(X) or P(X, Y), describing the distribution of the data itself. With only a pile of handwritten digit images and no knowledge of which digit each is, this is the kind that can be done.
- **Deterministic and random**: the same input gives the same output every time, or gives different results according to a probability distribution.
- A latent variable model is written p(x, z; θ): x is the observation, z is the latent factor, and θ is the model parameters.

Classified by the form of z: continuous vectors (auto-encoder, VAE), discrete vectors (topic model), and structured (the HMM used in speech recognition, tree-structured models). This lecture covers the first kind.

## Auto-encoder: compress, then reconstruct

### The basic idea

Slides 13–15. The encoder compresses the input x into a shorter code (z), the decoder reconstructs the code into y, and the two are trained together with the goal of making y as close to x as possible:

z = σ(Wx + b), y = σ(W′z + b′), minimizing (x − y)²

Why can it be compressed? Her explanation: not every 28×28 image is a reasonable digit, so not all 784 dimensions are needed. The layer in the middle is called the bottleneck layer; its dimension is smaller, and only what really carries information can squeeze through. She says this is the same concept as compression in information theory: finding a shorter representation while losing the least information.

### Adding noise: denoising auto-encoder

Slide 16. With some noise added to the image, a person can still see that it is a 9. To have the model do the same, noise is first added artificially to the clean image, and after encoding and decoding the result is required to be close to the original image **without noise**. The representation learned this way is more robust.

Slide 25 connects this idea to language models: BERT randomly masks 15% of the tokens and asks for them to be reconstructed, which is a kind of denoising auto-encoder. She says the concept here has been carried on into today's pre-trained models.

### Stacking deeper

Slides 17–19 (Hinton and Salakhutdinov 2006). Two ways of compressing 784 dimensions to 30 are compared: with only one layer (equivalent to PCA), the reconstructed digits are blurry; with a deep auto-encoder of 784-1000-500-250-30 that then unfolds symmetrically, the reconstruction is much clearer. With the code compressed to 2 dimensions and plotted, the deep model separates the different digits further apart. She adds that deeper is not always better, and that it also depends on the amount of data.

Layer-wise pre-training on slides 26–29 is an early technique for training deep networks: train one layer at a time, fix it once trained, then train the next layer, and finally fine-tune the whole thing together. She says that there is now enough data, random initialization usually trains fine, and this technique is not much needed anymore.

### Retrieval with the code

Slides 20–22 (Krizhevsky et al. 2011). Take a photo of a face and look for similar images. Computing distance directly on pixels mostly retrieves things with a similar color distribution and unrelated content. Compressing the 32×32 image into a 256-dimensional code with an 8192-4096-2048-1024-512-256 auto-encoder and then searching, the results are at least all faces. She says that people cannot say clearly what each dimension of this space stands for either, but after projection onto it, distance is more meaningful.

Slides 23–24 are the text version. The traditional approach represents both documents and queries as bag-of-words, looking only at whether words appear and not at semantics; text with the same meaning and different wording is not found. Using an auto-encoder to compress a 2000-dimensional bag-of-words into 2 dimensions, documents about the same thing end up close together.

MADE (Germain et al. 2015) on slide 30 is a variant of the auto-encoder: masks are added to the network's connections so that the outputs form a conditional order such as "first x₂, then x₃, then x₁," which is used to estimate a distribution. Dual learning uses it later.

## VAE: making the code follow a distribution

### Why an auto-encoder's decoder cannot be used to generate

14.3 starts from a question. After an auto-encoder is trained, what we use is really only the encoder; the decoder is there only so that training has a reconstruction target. But the decoder's function is "given a code, produce an image or a document," which sounds useful. Can we pick any code and ask it to generate?

No. An auto-encoder places no constraint on the distribution of the code, and decoding an arbitrarily chosen code usually does not give something reasonable (slide 32: How can we set a latent code for generation?).

### The core idea

The VAE's approach is to constrain the distribution of the code (slides 33–34): require z to follow a Gaussian distribution N(μ, σ). A new z can then be sampled from this distribution and handed to the decoder to produce data.

The actual network works like this (slide 37): the encoder does not output z directly; it outputs the mean μ and σ of this Gaussian distribution (the deck writes N(μ, σ) and the lecturer speaks of the mean and the variance; by the usual convention σ is the standard deviation and σ² the variance); z is obtained by sampling from this distribution; the decoder produces y from z.

The objective has two terms (slide 39):

E_{z∼q(z|x)}[ log p(x | z) ] − KL( q(z | x) ‖ p(z) )

The first term is how close the reconstruction is, and the second requires the distribution q(z|x) given by the encoder to be close to the distribution p(z) we specify. That is why the deck says a VAE is a regularized auto-encoder.

Slide 40 compares the two: an auto-encoder is not a generative model, because new data cannot be sampled from it and the likelihood of the data cannot be computed.

She cautions that a VAE is unstable to train, because of the sampling step in the middle: each time the same data point goes in, the z that is drawn may be different.

### The interpolation example

Slide 42 compares the two with sentences. Take the codes of two sentences, interpolate between them, and decode:

- **Auto-encoder**: from "i went to the store to buy some groceries" to "horses are my favorite animal," "horses are to buy any groceries" appears in between. It looks like a sentence but has no meaning.
- **VAE**: from "i want to talk to you" to "she didn't want to be with him," what lies in between is sentences such as "i don't want to be with you." Every one is a reasonable sentence.

Slide 41 shows image reconstruction results, and she says the VAE may be a little better, though the difference is not very obvious; the more important use of a VAE is that the decoder can be used to generate.

### A training technique: posterior collapse

Slide 43. When the two terms of the objective are trained together, the loss does go down, but what goes down is mainly the KL term, because it is easier to learn: it only has to make the distribution match the target, with no need to reconstruct seriously. The result is that the model relies only on the decoder and ignores z, which is called posterior collapse.

Two approaches:

- **KL annealing**: the KL term is multiplied by a weight that starts very small, forcing the model to learn reconstruction first, and the weight is then raised gradually.
- **KL thresholding**: once the KL falls below a certain threshold it is no longer pushed down; the deck's formula is Σ max[λ, KL(q(zᵢ|x) ‖ p(zᵢ))].

## Dual learning: two opposite tasks helping each other

### Dual tasks

Slide 45. Two tasks, one x → y and the other y → x, have a dual relationship. The deck lists several pairs:

| Field | f : x → y | g : y → x |
|---|---|---|
| Machine translation | English to Chinese | Chinese to English |
| Speech | Speech recognition | Speech synthesis |
| Image understanding | Image captioning | Image generation |
| Language understanding | Language understanding | Language generation |
| Question answering | Answering questions | Generating questions |

### No paired data: dual unsupervised learning

Slide 46. There are many English sentences and many Chinese sentences at hand, but they are not aligned. Let an English sentence x first be translated into Chinese, y = f(x), and then back into English, x′ = g(y); how similar x′ is to x is the feedback signal. She says this is a reinforcement learning concept: go over and come back, get a reward, and use it to make both functions better. Similar means close in meaning, not identical word for word.

### Going around the loop in both directions: joint dual learning

Slides 47–48 (Su et al. 2020). The example is language understanding and generation: the sentence "at the riverside there is a pub called the blue spice" corresponds to the semantic representation area[riverside], eatType[pub], name[blue spice]. Both cycles must hold: g(f(x)) ≡ x, and f(g(y)) ≡ y. When each side has data that simply is not paired, training can be done this way.

### With paired data: dual supervised learning

Slides 49–51 (Xia et al. 2017, originally proposed for machine translation; slide 51 applies it to language understanding and generation and cites Su et al. 2019). With paired data, x → y can already be trained directly. But the two directions should be consistent in probability:

P(x) P(y | x; θ_{x→y}) = P(y) P(x | y; θ_{y→x})

So on top of each side's original loss, a duality loss term is added, requiring the gap between the two sides to be as small as possible:

l_duality = ( log P̂(x) + log P(y | x; θ_{x→y}) − log P̂(y) − log P(x | y; θ_{y→x}) )²

This requires estimating P(x) and P(y). When x is natural language, P(x) is estimated with a language model; when y is semantic labels, it can be estimated with the MADE described earlier.

Slides 52–54 are the results (E2E NLG data, 50,000 examples in the restaurant domain). Her reading: with duality added, the generation side improves and the understanding side stays about the same; once the distribution of one side is estimated better (with MADE), both sides improve.

### How it differs from other approaches

The comparison on slide 55:

| Other approaches | Dual learning |
|---|---|
| Ordinary unsupervised / semi-supervised learning: only one task, with no feedback signal | Several tasks, with feedback generated automatically |
| Co-training: one task, with different feature sets complementing each other | Several tasks, with no assumption about feature sets |
| Multi-task learning: several tasks sharing a representation | No need to share a representation, only to form a closed loop |
| Transfer learning: auxiliary tasks help a target task | No primary and secondary; all tasks help each other |

## Self-supervised learning: self-prediction and contrastive learning

The definition on slide 57: self-supervised learning **constructs** supervised tasks out of unannotated data. She contrasts it with the AE and VAE above: those have no explicit prediction target, while here a target is constructed and training then follows the supervised way. Today's pre-training belongs to this category.

Slide 58 divides it into two kinds:

- **Self-prediction**: within **one** sample, hide a part and predict it from the other parts (intra-sample). A language model predicting what follows from what came before and BERT predicting masked tokens both belong here. Slide 59 lists several ways to hide: predict the future from the past, predict the top half from the bottom half, predict the occluded from the visible.
- **Contrastive learning**: given **several** samples, predict the relationships among them (inter-sample).

She says everyone is already familiar with self-prediction, so this part mainly covers contrastive learning.

### The goal of contrastive learning

Slide 61: learn a vector space where similar samples are close and dissimilar ones are far apart. She says it is often used to adjust embeddings.

Without annotations, who is similar to whom has to be constructed (slide 62):

1. The original input and a distorted version of it (for example with noise added).
2. Different views of the same object.

**Triplet loss** (slide 63, Schroff et al. 2015) is the most classic approach. An anchor x, a positive x⁺, and a negative x⁻:

L = max( 0, ‖f(x) − f(x⁺)‖² − ‖f(x) − f(x⁻)‖² + ε )

**Example (made up for this post).** Setup: ε = 1. Currently the squared distance between the anchor and the positive is 1.0, and between the anchor and the negative is 1.5.

- Reasoning: 1.0 − 1.5 + 1 = 0.5, which is greater than 0, so the loss is 0.5.
- For comparison: if the negative has already been pushed to a squared distance of 2.5, then 1.0 − 2.5 + 1 = −0.5, and after taking the max the loss is 0.
- Result and meaning: the loss does not require the negative to be infinitely far, only farther than the positive by more than ε. Once this margin is reached, this set of samples no longer produces a gradient.

**N-pair loss** (slide 64, Sohn 2016) generalizes one negative to many. She says negatives are easy to obtain: know who is similar to me, and draw the rest at random from a large amount of data.

Two other ways to construct positives and negatives:

- **Feature clustering** (slide 65): cluster first, treat the same cluster as positives and different clusters as negatives, which amounts to first assigning a pseudo label.
- **Multiview coding** (slide 66): use data augmentation to produce different versions of the same input, for example converting an image to grayscale, scaling it up or down, or rotating it. The deck says this is the mainstream approach to contrastive learning. Different views can also come from different modalities: an image of "running very fast," a sentence of text saying "running very fast," and a clip of audio saying "running very fast" should have vectors that are close.

### SimCSE: constructing positives with dropout

Slides 67–68 (Gao et al. 2021). The aim is to improve sentence vectors on top of BERT. The unsupervised version is very simple: pass the same sentence through the model twice, with dropout dropping different nodes each time, to get two slightly different vectors, and these two are the positives; the vectors of the other sentences in the same batch are the negatives. She stresses that it uses no new data at all, relies only on dropout, and clearly improves every sentence-similarity benchmark.

With annotations, pulling together what should be close and pushing apart what should be far works even better. Her spoken example is "pull sentences of the same class together and push different classes apart"; the labels in the figure on slide 68 are entailment and contradiction between sentences.

SpokenCSE (Chang and Chen 2022) on slides 69–70 applies the same idea to speech recognition output: pull sentences with recognition errors close to the original clean sentences. Then when recognition goes wrong, the vector is still close to the correct sentence, and the semantic judgment downstream is unaffected.

She ends with a newer example (not in the 2024 deck): what is commonly used now is embeddings produced by language models, and doing contrastive learning on top of them still helps. The scenario is a customer service center that wants to discover newly appearing types of inquiries automatically. Adjusting the vectors with contrastive learning first and then clustering works better than handing all the content to a language model and asking it to find new topics. The resulting clusters can then be given to a language model to name.

## CLIP and DALL·E 2

### Why connect images to language

Slide 71. Text can be learned in a self-supervised way, the amount of data is large, and it has zero-shot transfer ability. Images in the past mostly relied on supervised learning; ImageNet has collected many images, and the amount still does not compare with text. So the idea is to connect image tasks to language and borrow language's transfer ability.

### How CLIP is trained

Slides 72–73 (Radford et al. 2021). CLIP is Contrastive Language-Image Pretraining. The data is 400 million pairs of images and text collected from the web. She points out that although it is called pretraining, it does use labels to some extent: the pairing of image and text is the label, only not for any specific task. She explains why images on the web all come with text: an image without a description is hard to find, so authors write one.

There is one text encoder and one image encoder. A batch of data is arranged as a matrix, and similarity is computed between the i-th image Iᵢ and the j-th text Tⱼ. On the diagonal are the matched image-text pairs, to be pulled together; all other cells are to be pushed apart. The batch size marked in the deck is 32,768.

**Example (made up for this post).** Setup: a batch of 32,768 image-text pairs.

- Reasoning: the matrix has 32,768 × 32,768 ≈ 1.07 billion cells. For each image there is only 1 positive and there are 32,767 negatives.
- Result and meaning: she says a larger batch trains better, because there are more targets to push away at once. This number shows what scale "more" means: every image is picking out its own text among more than thirty thousand texts.

### Classifying without separate training

Slide 74. The training data has no "image classification" annotations at all, yet classification can be done like this: write each candidate class as a sentence, for example a photo of a dog and a photo of a cat, and compute the text vector of each; compute the image vector of the image to be classified; whichever sentence is most similar to the image is the answer.

The table on slide 75 compares a ResNet101 trained with supervision on ImageNet and zero-shot CLIP:

| Dataset | ResNet101 | CLIP (zero-shot) |
|---|---|---|
| ImageNet | 76.2 | 76.2 |
| ImageNetV2 | 64.3 | 70.1 |
| ImageNet-R | 37.7 | 88.9 |
| ObjectNet | 32.6 | 72.3 |
| ImageNet Sketch | 25.2 | 60.2 |
| ImageNet-A | 2.7 | 77.1 |

On ImageNet itself the two are tied. Pointing at the banana example, she says: switch to hand-drawn bananas (ImageNet Sketch) and the model trained with supervision is left with only 25%, because its training data has no hand-drawn versions; CLIP still has 60%. This shows that its transfer ability is better.

### DALL·E 2: generating images in the other direction

Slides 76–80 (Ramesh et al. 2022). The input is text y, and the goal is to produce a matching image x. It uses CLIP's vectors and has two steps:

1. **Prior**: P(zᵢ | y). From the text vector, produce the corresponding CLIP image vector.
2. **Decoder**: P(x | zᵢ, y). Produce the image from the image vector.

Together this is P(x | y) = P(x | zᵢ, y) P(zᵢ | y). She does not go into the image generation part, saying only that the decoder can use a diffusion model. In the example on slide 80, the text is "a small kitchen with a low ceiling"; the generated images do not have the sloped roof of the original image, but the ceilings are all on the low side and the kitchens all have a sink.

## Multimodal language models

The content of 14.7 is not in the 2024 deck, and the paper names and years below come from the slides in the video frames.

### LLaVA: projecting images into the language space

LLaVA (Liu et al. 2023). One line on the slide says: use the text-only GPT-4 to generate instruction tuning data, and use it to train a vision-language model.

The architecture: an already trained image encoder encodes the image, which passes through a projection matrix W into a vector space the language model can read, and is then handed to the language model together with the text instruction. In her words, language is treated as the hub, images are projected into the language space, and the language model then makes the judgment.

This makes use of the common sense the language model already has. The slide's example is a photo of someone ironing clothes on the back of a taxi; asked what is unusual about the image, it can answer.

### Any modality in, any modality out

The slides that follow immediately (Wu et al. 2023) generalize the same idea: images, audio, and video each have an encoder, each followed by a projection into the language model; the output side also has a projection for each, connected to the corresponding generative model. In training, the input side learns the projections from data such as "images paired with image captions, audio paired with audio captions (which she glosses as the speech recognition output), video paired with video captions."

### Streaming interaction

The slide title is GPT-4o: Streaming Multimodal Interaction (2024). Two architectures are compared first:

- **Pipelined**: audio goes through speech recognition first, the text goes into the language model, and the answer goes through speech synthesis. She says this already works quite well and is often no worse.
- **End-to-end**: one model understands the different modalities directly. The benefits are that speech recognition errors are not passed downstream and there is less latency.

The difficulty of streaming is that there is no Enter key. In ordinary use of a language model, you finish typing and press Enter, and only then does the model start processing. In streaming, the model has to judge at every point in time: should it listen or reply now? Her description: while you are still talking it has to listen quietly; when you stop, it has to judge that it is its turn to speak; while it is speaking its ears still have to be open, because you may interrupt it and say "wait, you misunderstood." She says this is not something that can be achieved by modifying the original model a little.

### Three strategies for full-duplex

The next two slides cite a paper by Wang et al. 2025 (which she describes as recently published by Google), listing three strategies:

- **(a) Perpetual speaking**: the model produces output in every time chunk.
- **(b) Model-as-a-server**: one model is dedicated to listening and judging whether it is time to speak; once it judges that it is, it hands over to another model responsible for generation. She says this is closer to the original language model: take an existing language model, train one more model that judges when to take over, and a certain degree of full-duplex can be achieved.
- **(c) Standalone state prediction**: everything is trained into the same model, which judges for itself that it should not speak, that it is time to speak, and that it has finished speaking. She says this is ideally the most human-like, and also harder to train.

She does not say which one is best. The same paper also sorts out the stages of training: large-scale pre-training first, then fine-tuning on dialogue; learn understanding first, then learn generation. In her words, if understanding is not learned well, generation is also hard to train well.

### Her summary

Many of today's multimodal models treat the language model as the hub and connect the other modalities to it. By now, most of the models released by the leading companies are already end-to-end versions. She thinks language still takes the largest share, because language data is the most plentiful and the language model's own ability is the best.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"Without annotations there is no way to train."** You can reconstruct the input itself, hide a part and guess it back, have tasks in opposite directions check each other, or construct positives and negatives. Every method in this lecture answers where the annotation comes from.
- **"Once an auto-encoder is trained, its decoder can be used to generate."** It places no constraint on the distribution of the code, and an arbitrarily chosen code usually reconstructs into something unreasonable. The VAE is what adds this constraint.
- **"If both VAE loss terms go down together, it has learned well."** The KL term is easier to bring down, and the model may attend only to it and not reconstruct seriously. That is why its weight is kept low at first.
- **"Dual learning is just multi-task learning."** Multi-task relies on a shared representation; dual learning needs no sharing and relies on the two tasks running in opposite directions and being able to form a loop.
- **"Contrastive learning needs someone to label who is similar to whom."** SimCSE constructs positives with dropout alone and uses the other sentences in the same batch as negatives.
- **"CLIP uses no annotations at all."** She specifically points out that its annotation is the pairing between images and text, only not aimed at a particular task.
- **"A multimodal model is speech recognition plus a language model plus speech synthesis."** That is the pipelined approach. An end-to-end model handles several modalities directly, and streaming interaction also has to decide at every point in time whether to listen or speak.

## Self-check

The questions were written for this post, and every answer can be found above.

**1. How many dimensions does a 28×28 handwritten digit image take when represented by pixels? What is the benefit of representing it by strokes instead?**

784 dimensions. The stroke representation is much shorter, and different ways of writing the same digit use similar combinations of strokes, which is closer to the semantics.

**2. What are the input and the reconstruction target of a denoising auto-encoder? How is BERT related to it?**

The input is data with noise added, and the target is to reconstruct the original data without noise. BERT masking 15% of the tokens and reconstructing them is the same idea.

**3. Why is an auto-encoder not a generative model? What does a VAE change?**

An auto-encoder does not constrain the distribution of the code, so reasonable new codes cannot be sampled. A VAE requires the code to follow a Gaussian distribution, the encoder outputs the mean μ and σ of the distribution, and afterwards a code can be sampled from the distribution and handed to the decoder.

**4. Which two terms make up the VAE objective? What is posterior collapse, and how is it handled?**

The reconstruction term and the KL term. The KL term is easier to learn, and the model may bring down only that term while ignoring z and not reconstructing seriously. It is handled with KL annealing (raising the weight gradually from small) or KL thresholding.

**5. You have many English sentences and many Chinese sentences, but they are not aligned. Where does the training signal in dual learning come from?**

Translate the English into Chinese and back into English; how close the back-translated sentence is to the original sentence is the feedback.

**6. What does the extra term in dual supervised learning require?**

The probabilities of the two directions must be consistent: P(x)P(y|x) should equal P(y)P(x|y). The squared gap between the two sides after taking logs is the duality loss.

**7. In a triplet loss, ε = 0.5, the squared distance between the anchor and the positive is 0.8, and between the anchor and the negative is 1.0. What is the loss?**

0.8 − 1.0 + 0.5 = 0.3, which is above 0, so after taking the max the loss is 0.3.

**8. How does the unsupervised version of SimCSE get positives and negatives?**

The same sentence is passed through the model twice with different dropout, and the two vectors are positives for each other. The other sentences in the same batch are negatives.

**9. CLIP was not trained on image classification data. How does it classify images?**

Write each class as a sentence "a photo of a ……," compute the text vector of each sentence, compare similarity with the image vector of the picture, and take the class with the highest similarity.

**10. Of the three full-duplex strategies, which one can reuse an existing language model? What does it add?**

Model-as-a-server. It adds a model responsible for listening and judging when to speak, which hands over to the generation model once it judges that it is time to speak.

## Further reading

- [Lecture 5 in this series: Tokenization and BERT](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en), for the details of masked LM
- [Lecture 8 in this series: RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en), for the contrastive loss of the dense retriever and the bi-encoder
- [Lecture 7 in this series: Post-Training and Efficient Tuning](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en), for where instruction tuning data comes from

Previous lecture: [Lecture 13, Dialogue Systems and Tool Use](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en) | Next: [TA recitations](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en)

## Course video sources

These videos were checked on 2026-10-10 against the official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=j5XknQ4MGw0
title: ADL 14.1: Beyond Supervised Learning
```

```youtube
url: https://www.youtube.com/watch?v=I3by1PGKBMM
title: ADL 14.3: Variational Auto-Encoder (VAE)
```

```youtube
url: https://www.youtube.com/watch?v=5CJW10uSj80
title: ADL 14.5: Self-Supervised Learning
```

```youtube
url: https://www.youtube.com/watch?v=Q0-8988uEiU
title: ADL 14.7: Multimodality
```

Original videos: [14.1 Beyond Supervised Learning](https://www.youtube.com/watch?v=j5XknQ4MGw0), [14.2 Auto-Encoder](https://www.youtube.com/watch?v=rQyhxK-fDyI), [14.3 Variational Auto-Encoder (VAE)](https://www.youtube.com/watch?v=I3by1PGKBMM), [14.4 Dual Learning](https://www.youtube.com/watch?v=zDe-RNd38bQ), [14.5 Self-Supervised Learning](https://www.youtube.com/watch?v=5CJW10uSj80), [14.6 CLIP & DALL·E 2](https://www.youtube.com/watch?v=-UpU_dfq_IU), [14.7 Multimodality](https://www.youtube.com/watch?v=Q0-8988uEiU)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): 14.1–14.7 have no captions, so this guide was written from speech-recognition transcripts of their audio, which may mishear some proper nouns and numbers. Formulas, numbers, and example sentences follow the pages of the Fall 2024 deck; paper names and citations for 14.7 were additionally checked against the slides visible in video frames.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-13: Rewritten from the spoken content of the seven videos. Added the content of 14.7 (previously listed by name only), and added two examples, common misreadings, and a self-check with answers.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Beyond Supervised Learning deck (Fall 2024, 241127_BeyondSL.pdf)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf) — the source of the slide numbers here
- [Gao et al., SimCSE: Simple Contrastive Learning of Sentence Embeddings](https://arxiv.org/abs/2104.08821)
- [Radford et al., Learning Transferable Visual Models From Natural Language Supervision (CLIP)](https://arxiv.org/abs/2103.00020)
- [Ramesh et al., Hierarchical Text-Conditional Image Generation with CLIP Latents (DALL·E 2)](https://arxiv.org/abs/2204.06125)
- [Liu et al., Visual Instruction Tuning (LLaVA)](https://arxiv.org/abs/2304.08485)
