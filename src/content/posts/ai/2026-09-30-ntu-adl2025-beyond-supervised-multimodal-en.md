---
title: "Reading NTU ADL 2025 Fall: Beyond Supervised Learning and Multimodality — Auto-Encoders, VAE, Dual Learning, Contrastive Learning, and CLIP"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, self-supervised-learning, representation-learning, vae, clip]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 17
tldr: "Big data is not big annotated data. The last ADL lecture asks how to learn good representations without labels, and answers: find the latent factors that control the data. An auto-encoder squeezes the input into a short code and reconstructs it. The denoising version adds noise or masks 15% of tokens first, which is exactly the idea behind BERT's masked LM. A VAE forces the code to follow a distribution, so you can sample from it to generate. Dual learning lets paired tasks, such as translation and back-translation or understanding and generation, act as feedback for each other. Self-supervised learning has two camps: self-prediction (hide part, guess it back) and contrastive learning (pull similar pairs together, push dissimilar ones apart). CLIP runs contrastive learning on 400 million image-text pairs, making zero-shot image classification possible, and DALL·E 2 uses CLIP's representations to generate images. Fall 2025 has only videos for this lecture, so the Fall 2024 slides fill in."
description: "Post 17 of the NTU Yun-Nung Chen Applied Deep Learning Fall 2025 series, based on videos 14.1–14.7 and the Fall 2024 deck 241127_BeyondSL.pdf (82 pages): latent factors, auto-encoders and denoising/masked AEs, VAEs and posterior collapse, dual learning (unsupervised and supervised), self-prediction and contrastive learning, SimCSE, CLIP, and DALL·E 2. Video 14.7 Multimodality has no matching pages in the 2024 deck and is listed by name only."
draft: false
glossary:
  - term: "Contrastive Learning"
    definition: "Representation learning that builds an embedding space where similar sample pairs sit close together and dissimilar pairs sit far apart; positive pairs often come from data augmentation or from different modalities."
    context: "Pages 60–70 of the ADL BeyondSL deck, split into inter-sample classification, feature clustering, and multiview coding."
  - term: "Dual Learning"
    definition: "Training with two tasks that invert each other, such as English-to-Chinese and Chinese-to-English translation or language understanding and generation, using how well one task's output is recovered by the other as the training signal."
    context: "Pages 44–55 of the ADL BeyondSL deck, including dual supervised and joint dual learning for NLU/NLG from Yun-Nung Chen's lab."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal)

**This post is based on the L14 videos in the playlist of [NTU Applied Deep Learning (ADL), Fall 2025 (114-1, 2025/09/01–12/15)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), with the Fall 2024 slides filling in.** It is post 17 of the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series and the last of the lecture posts. The previous sixteen almost always assumed labeled data, or at least a "next word" to predict. This one turns the question around: **how do you learn good representations without labels, and how does the language-model recipe extend to images?**

Official materials used:

- **Videos**: 14.1–14.7 in the [2025 Fall playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o). Every description reads "2025/12/01 Applied Deep Learning," and 14.1–14.3 also note "Slides credited from Hung-Yi Lee." The course page's 12/01 row says "Reasoning," with no slides and no video links.
- **Slides**: Fall 2025 did not publish slides for this lecture. This post uses the [Fall 2024 Beyond Supervised Learning deck (241127_BeyondSL.pdf, 82 pages)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf). **Every page number below refers to this 2024 deck.**

| # | Video (2025) | Chinese subtitle (translated) | Length | Matching 2024 pages |
|---|---|---|---|---|
| 14.1 | [Beyond Supervised Learning](https://youtu.be/j5XknQ4MGw0) | Practical tricks when there are no labels | 21:19 | 2–11 |
| 14.2 | [Auto-Encoder](https://youtu.be/rQyhxK-fDyI) | Learning a good data representation | 14:40 | 12–30 |
| 14.3 | [Variational Auto-Encoder (VAE)](https://youtu.be/I3by1PGKBMM) | Controlling the feature distribution for generation | 20:25 | 31–43 |
| 14.4 | [Dual Learning](https://youtu.be/zDe-RNd38bQ) | Two symmetric tasks can help each other | 12:39 | 44–55 |
| 14.5 | [Self-Supervised Learning](https://youtu.be/5CJW10uSj80) | Self-prediction + contrastive learning | 20:52 | 56–70 |
| 14.6 | [CLIP & DALL·E 2](https://youtu.be/-UpU_dfq_IU) | From language to every modality | 13:24 | 71–80 |
| 14.7 | [Multimodality](https://youtu.be/Q0-8988uEiU) | Seeing, hearing, and speaking like a human | 19:52 | none found |

The "matching pages" column is my own topic match. Public information cannot confirm that the videos actually show these pages.

## Why unlabeled data helps (pages 2–11)

Page 2 opens with the premise: **big data is not big annotated data.** With labels you use supervised learning; with an environment that gives rewards, reinforcement learning; with neither, unsupervised learning. The deck then asks why unlabeled, even unrelated, data can help. The answer: **find the latent factors that control the observations.**

Pages 3–8 give three examples. Handwritten digits are made of strokes, and the strokes are latent factors. Documents have underlying topics. In a recommender system, users and items each carry invisible traits; the deck illustrates with anime character archetypes and drama genres.

Pages 9–11 add the vocabulary. A discriminative model computes P(Y|X); a generative model computes P(X) or P(X, Y). Variables are observed or latent, deterministic or random. A latent variable can be a continuous vector (auto-encoder, VAE), a discrete vector (topic model), or a structure (HMM, tree-structured model). This lecture follows the continuous-vector path.

## Auto-encoder: compress, then reconstruct (pages 12–30)

A 28×28 handwritten digit has 784 dimensions, but not every 784-dimensional image is a digit (page 14), so a shorter code should do. An **auto-encoder** pairs an encoder, which compresses the input into a short code, with a decoder, which reconstructs the input from that code. Training makes the reconstruction as close to the input as possible (page 15, minimizing ‖x − y‖²). The output of the middle "bottleneck" layer is the learned representation.

Several variations:

- **Denoising auto-encoder (page 16)**: add noise to the input, then ask for the clean original back. This makes the representation more robust.
- **Deep auto-encoder (pages 17–19)**: stack many layers, for example 784 → 1000 → 500 → 250 → 30 and back out symmetrically. Page 18 sets its reconstructions next to PCA's at 30 dimensions.
- **Applications (pages 20–24)**: retrieving similar images with 256-dimensional codes works better than comparing raw pixel distances. Text retrieval works the same way, compressing bag-of-words vectors into low-dimensional codes.
- **Masking is a kind of noise (page 25)**: randomly mask 15% of tokens and reconstruct them. The deck labels this masked LM right on the slide. **That is the pre-training objective of BERT from [post 6](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en).** Seen from here, BERT is a denoising auto-encoder.
- **Layer-wise pre-training (pages 26–29)**: the older practice of initializing weights one layer at a time with auto-encoders, then fine-tuning the whole network with backprop.
- **MADE (page 30)**: the masked auto-encoder of [Germain et al., 2015](https://arxiv.org/abs/1502.03509), which reconstructs in a given ordering to estimate a distribution. Dual learning uses it again later.

## VAE: make the code follow a distribution so you can generate (pages 31–43)

A plain auto-encoder's codes can land anywhere. Pick a random code, feed it to the decoder, and you may not get anything sensible (page 32). A **VAE (Variational Auto-Encoder)** constrains the code distribution: the latent variable is assumed to come from a Gaussian, and generation samples from that prior (pages 33–34). Page 34's one-line summary: the compact representation should follow a distribution.

Pages 37–39 split the VAE into two tasks. The decoder learns to generate data from the code; the encoder learns the distribution of the latent factors. The loss has two matching terms: a reconstruction loss, plus a KL regularizer that pulls the encoder's output toward the prior. That is why the deck also calls it a "regularized auto-encoder."

Pages 41–42 put AE and VAE side by side: image reconstructions, and the sentences produced when interpolating between two text embeddings. Page 43 is a practical warning about **posterior collapse**. The KL term is easier to learn, so the model may let the decoder do all the work and ignore the latent variable. Fixes include KL annealing (raising the KL weight gradually from small) and KL thresholding.

<details>
<summary>What the VAE loss computes (a condensed version of pages 35–40)</summary>

The goal is to maximize the marginal likelihood of one data point, p(x) = ∫ p(x|z) p(z) dz. That integral cannot be computed directly, so an encoder q(z|x) approximates the true posterior, and training maximizes a lower bound instead:

- First term: sample z from q(z|x) and measure how well the decoder p(x|z) reconstructs x. This is the reconstruction loss.
- Second term: the KL divergence between q(z|x) and the prior p(z), a standard Gaussian. This is the regularizer.

For the original derivation, see [Kingma & Welling, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114).

</details>

**Try this**: in PyTorch, train an AE and a VAE on MNIST, each with a 2-dimensional code. Plot the test-set codes as a scatter plot colored by digit. The VAE's points will cluster around the origin, while the AE's spread out more. Then sample a few codes from each and run them through the decoder. You will see the difference pages 32–33 describe.

## Dual learning: symmetric tasks help each other (pages 44–55)

Page 44 credits these slides to an ACML 2018 tutorial. Page 45 lists many paired tasks: English-to-Chinese and Chinese-to-English translation, speech recognition and speech synthesis, image captioning and text-to-image generation, language understanding and language generation, question answering and question generation. One is the primal task; the other is the dual.

- **Dual unsupervised learning (page 46)**: translate an English sentence into Chinese and back into English, then use how closely it comes back as a feedback signal for training, via RL or similar. No paired labels are needed.
- **Dual supervised learning (pages 49–50)**: proposed by [Xia et al., 2017](https://arxiv.org/abs/1707.00415) for machine translation. The two directions should in theory satisfy P(x|y)P(y) = P(y|x)P(x), so a duality penalty is added to each model's supervised loss to force both to respect that probabilistic constraint.
- **Applied to NLU/NLG (pages 51–54)**: Prof. Chen's lab used it for sentence ↔ semantic frame. For example, "McDonald's is a cheap restaurant nearby the station" parses into RESTAURANT, PRICE, and LOCATION fields, and the reverse writes the sentence back from the fields ([Su et al., ACL 2019](https://arxiv.org/abs/1905.06196)). The data is 50K restaurant-domain examples from E2E NLG; NLU is scored with F1 and NLG with BLEU and ROUGE.
- **Joint dual learning (pages 47–48)**: the same team's follow-up ([Su et al., ACL 2020](https://arxiv.org/abs/2004.14710)) chains NLU and NLG into one closed loop that aims to reconstruct the input perfectly. Feedback comes in two kinds: explicit (reconstruction likelihood, BLEU/ROUGE/F1) and implicit (a language model to estimate the sentence distribution, and the MADE model from earlier to estimate the semantic-frame distribution).

Page 55 contrasts dual learning with related ideas. Semi-supervised learning involves only one task. Co-training relies on different feature sets. Multi-task learning shares one representation. Transfer learning uses auxiliary tasks to boost a target task. Dual learning boosts several tasks together and at once, and needs only a closed loop, not a shared representation.

This section ties straight back to the task-oriented dialogue of [the previous post](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en): NLU is the dialogue system's LU module, and NLG is its last module.

## Self-supervised learning: self-prediction and contrastive learning (pages 56–70)

Page 56 credits these slides to a NeurIPS 2021 tutorial. Page 57's definition: **self-supervised learning builds supervised tasks out of unlabeled data.** The motivation is that labels are expensive and scarce, and a good representation transfers to many downstream tasks.

Page 58 splits it into two camps:

- **Self-prediction**: take one data sample, hide part of it, and predict the hidden part from the rest. This is "intra-sample" prediction. Page 59 borrows Yann LeCun's illustration: predict the future from the past, the past from the present, the top from the bottom, the occluded from the visible. Next-word prediction and BERT's masked words both belong here.
- **Contrastive learning**: take several samples and predict how they relate. This is "inter-sample" prediction.

The core idea of contrastive learning (page 61): learn an embedding space where similar pairs stay close and dissimilar pairs are pushed apart. The deck lists three families:

1. **Inter-sample classification (pages 62–64)**: given an anchor plus positive and negative candidates, identify the similar one. A positive can be a distorted version of the input, or the same target seen from another view. The loss goes from the triplet loss ([Schroff et al., 2015](https://arxiv.org/abs/1503.03832)) to the N-pair loss, which compares against several negatives at once.
2. **Feature clustering (page 65)**: cluster samples by their learned features and use the clusters as pseudo-labels.
3. **Multiview coding (page 66)**: apply the InfoNCE objective to different "views" of the same input. Views can come from data augmentation or from different modalities. The deck marks this as the mainstream approach.

Examples from NLP (pages 67–70): the unsupervised version of [SimCSE (Gao et al., 2021)](https://arxiv.org/abs/2104.08821) relies only on dropout noise, encoding the same sentence twice to form a positive pair; the supervised version then adjusts with labels. SpokenCSE (Chang & Chen, INTERSPEECH 2022) treats clean text and its speech-recognition-corrupted version as a positive pair, making language understanding more robust to recognition errors.

## CLIP and DALL·E 2: from language to images (pages 71–80)

Page 71 contrasts the two fields. Text has self-supervision (language modeling), large training data, and zero-shot transfer. Images rely mostly on supervised learning (ImageNet), with smaller datasets. The deck's idea: **connect vision tasks to language to get better transfer.**

**CLIP ([Radford et al., 2021](https://arxiv.org/abs/2103.00020), pages 72–75)**:

- It builds a new dataset, WebImageText, with 400 million (image, text) pairs collected from the internet.
- An image encoder and a text encoder train together. Within a batch, matched image-text pairs are pulled together and mismatched ones pushed apart. The deck marks the batch size as 32,768, so every pair has more than thirty thousand negatives. This is the multiview coding of the previous section, with the two "views" being two modalities.
- **Zero-shot image classification (page 74)**: write each of N class names as a sentence, encode it, and assign the image to whichever sentence its vector is closest to. New classes need no retraining.

**DALL·E 2 ([Ramesh et al., 2022](https://arxiv.org/abs/2204.06125), pages 76–80)** runs CLIP in reverse to generate images. The deck splits it into two components:

- **Prior**: given a caption, produce the matching CLIP image embedding. The deck lists an autoregressive prior and a diffusion prior.
- **Decoder**: generate an image from that embedding. The deck notes it uses GLIDE.

At inference: text → prior → CLIP image embedding → decoder → image. The deck does not explain how diffusion models work, and neither does this post; see Further reading.

**Try this**: take an open-source CLIP model from Hugging Face and ten photos from your phone. Write five class descriptions ("a photo of a cat," "a photo of food") and run zero-shot classification. Then rewrite the descriptions to be more specific or vaguer and watch the accuracy change. It makes page 74's point, that a class is just a sentence, concrete.

## 14.7 Multimodality: name only

The subtitle of 14.7 is "seeing, hearing, and speaking like a human," and it runs 19:52. The 2024 deck has no matching pages and Fall 2025 published no slides, so this is as far as the post can go. For a full treatment of multimodal LLMs, see CS224N and CS231n under Further reading.

## What this post can and cannot confirm

Confirmed: the seven videos' titles, Chinese subtitles, lengths, and descriptions (checked with YouTube oEmbed and yt-dlp); the titles and bullets of all 82 pages of the Fall 2024 BeyondSL deck; the arXiv titles of the papers cited above.

Not confirmed: whether the Fall 2025 videos use this 2024 deck, or how much it changed. Videos 14.1–14.3 credit their slides to Prof. Hung-yi Lee, so those three may use at least some different slides. The content of 14.7. I did not transcribe the videos. Result charts in the deck are described only by what they compare; check the original papers for numbers. The AE/VAE scatter-plot behavior in "Try this" is general experience, not deck content.

## Further reading

- [CS231n: Generative Models (VAE, GAN)](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en) and [CS231n: Generative Models (Diffusion)](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en): the VAE derivation and the diffusion models behind DALL·E 2.
- [CS231n: Self-Supervised Learning](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en) and [CS231n: Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language-en): contrastive learning and CLIP from the vision side.
- [MIT 6.S184 guide: Flow Matching and Diffusion Models](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en).
- [CS224N: Multimodality](/posts/ai/2026-08-22-cs224n-multimodality-en): fills the 14.7 gap.

The next post leaves the lectures for the side track: [TA Recitations: From PyTorch to LLM Deployment](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en).

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [Conversational AI and Tool Use](/posts/ai/2026-09-30-ntu-adl2025-conversational-ai-tool-use-en) | Next: [TA Recitations: From PyTorch to LLM Deployment](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en)

## References

- [NTU Applied Deep Learning Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o) (lectures in Mandarin)
- Videos: [14.1](https://youtu.be/j5XknQ4MGw0), [14.2 Auto-Encoder](https://youtu.be/rQyhxK-fDyI), [14.3 VAE](https://youtu.be/I3by1PGKBMM), [14.4 Dual Learning](https://youtu.be/zDe-RNd38bQ), [14.5 Self-Supervised Learning](https://youtu.be/5CJW10uSj80), [14.6 CLIP & DALL·E 2](https://youtu.be/-UpU_dfq_IU), [14.7 Multimodality](https://youtu.be/Q0-8988uEiU)
- [241127_BeyondSL.pdf (Beyond Supervised Learning, Fall 2024 deck)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/241127_BeyondSL.pdf)
- [ADL Fall 2024 course page](https://www.csie.ntu.edu.tw/~miulab/f113-adl/)
- [Auto-Encoding Variational Bayes (arXiv 1312.6114)](https://arxiv.org/abs/1312.6114)
- [MADE: Masked Autoencoder for Distribution Estimation (arXiv 1502.03509)](https://arxiv.org/abs/1502.03509)
- [Dual Supervised Learning (arXiv 1707.00415)](https://arxiv.org/abs/1707.00415)
- [Dual Supervised Learning for Natural Language Understanding and Generation (arXiv 1905.06196)](https://arxiv.org/abs/1905.06196)
- [Towards Unsupervised Language Understanding and Generation by Joint Dual Learning (arXiv 2004.14710)](https://arxiv.org/abs/2004.14710)
- [FaceNet (triplet loss, arXiv 1503.03832)](https://arxiv.org/abs/1503.03832)
- [SimCSE (arXiv 2104.08821)](https://arxiv.org/abs/2104.08821)
- [Learning Transferable Visual Models From Natural Language Supervision (CLIP, arXiv 2103.00020)](https://arxiv.org/abs/2103.00020)
- [Hierarchical Text-Conditional Image Generation with CLIP Latents (DALL·E 2, arXiv 2204.06125)](https://arxiv.org/abs/2204.06125)
