---
title: "2021 AI Conference Guide: Computer Vision"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, iccv, computer-vision, vision-transformer, "2021"]
lang: en
tldr: "2021 was the year Transformers decisively entered computer vision: Swin Transformer won the ICCV Best Paper award, DINO showed that a self-supervised ViT could learn object segmentation without labels, and NeRF grew from one paper into an entire subfield. CVPR and ICCV both moved fully online because of the pandemic, yet the work published that year shaped architectural choices across computer vision for years to come."
description: "A retrospective on the award-winning and influential work from CVPR and ICCV 2021, three defining technical trends—the rise of Vision Transformers, breakthroughs in self-supervised learning, and the NeRF boom—and the effects of fully virtual conferences on the research community."
draft: false
series:
  name: "AI 頂會導讀"
  order: 8
glossary:
  - term: "ViT"
    definition: "Vision Transformer, an architecture introduced by Google in 2020. It divides an image into fixed-size patches, treats them as tokens, and feeds them to a standard Transformer encoder, showing that image classification does not require convolutions."
    context: "Numerous ViT variants, including DeiT, Swin, and CvT, appeared at CVPR and ICCV in 2021, marking the Transformer’s full arrival in computer vision."
  - term: "NeRF"
    definition: "Neural Radiance Field, a neural representation that learns a continuous 3D scene and can render photorealistic images from arbitrary viewpoints. It won the ECCV 2020 Best Paper award."
    context: "More than 25 NeRF-related papers appeared at ICCV 2021, turning a single breakthrough into an entire subfield."
  - term: "self-supervised learning"
    definition: "Learning useful representations from the structure of the data itself, without human annotations. Common approaches include contrastive learning and masked prediction."
    context: "Self-supervised methods such as SimSiam, DINO, and MoCo v3 made major advances in 2021, narrowing the performance gap with supervised learning."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2021-cv)

Two major events reshaped computer vision in 2021. COVID-19 forced CVPR and ICCV, the field’s two most important conferences, to move fully online. At the same time, the Transformer crossed over from NLP into computer vision and began challenging CNNs after a decade of dominance. This article reviews the award-winning and most influential work from both conferences, along with three technical trends that defined the direction of computer vision in 2021.

## CVPR 2021

**Key figures:** 7,093 submissions, 1,661 accepted papers, and a 23.6% acceptance rate. The conference was held fully online from June 19–25, 2021, instead of at its originally planned venue in Nashville.

### Best Paper

**GIRAFFE: Representing Scenes as Compositional Generative Neural Feature Fields**  
Michael Niemeyer and Andreas Geiger (Max Planck Institute for Intelligent Systems / University of Tübingen)

GIRAFFE combined ideas from NeRF and GANs. It decomposed a scene into independently controllable objects, represented each object with a small neural feature field, and composed them into a controllable image. Its central contribution was not image quality alone, but object-level control in a 3D-aware generative model: objects could be moved, rotated, added, or removed independently. The paper opened the research direction later known as 3D-aware controllable generation.

### Best Student Paper

**Task Programming: Learning Data Efficient Behavior Representations**  
Jennifer J. Sun, Ann Kennedy, Eric Zhan, David J. Anderson, Yisong Yue, and Pietro Perona (Caltech / Northwestern University)

The paper learned animal-behavior representations from limited annotations through “task programming.” Researchers could define new behavior-classification tasks with simple programmatic descriptions instead of collecting large labeled datasets.

### Best Paper Honorable Mentions

- **Exploring Simple Siamese Representation Learning** (Xinlei Chen and Kaiming He, Facebook AI Research)—SimSiam showed that a simple Siamese network with stop-gradient could learn strong representations without negative samples, large batches, or a momentum encoder. Its impact on the self-supervised learning community was substantial because it reduced the method to its essentials and forced researchers to reconsider why contrastive learning worked at all.
- **Learning High Fidelity Depths of Dressed Humans by Watching Social Media Dance Videos** (Yasamin Jafarian and Hyun Soo Park, University of Minnesota)—The authors used large volumes of dance videos from social media as training data to learn the geometry, particularly depth, of clothed people. The data choice was ingenious: dance videos contain diverse poses, clothing, and body proportions at a scale that removes the need for manual annotation.

### Best Student Paper Honorable Mentions

- **Less is More: ClipBERT for Video-and-Language Learning via Sparse Sampling** (Jie Lei et al., UNC Chapel Hill / Microsoft)—ClipBERT replaced dense frame extraction with sparse sampling for multimodal video-and-language learning, sharply reducing compute costs.
- **Binary TTC: A Temporal Geofence for Autonomous Navigation** (Abhishek Badki et al., NVIDIA / UC Santa Barbara)—The paper reduced time-to-contact estimation to a binary classification problem for determining safety boundaries in autonomous driving.
- **Real-Time High-Resolution Background Matting** (Shanchuan Lin et al., University of Washington)—Real-time, high-resolution background removal without a green screen.

### Important CVPR 2021 Papers Beyond the Award Winners

Several CVPR papers that did not receive awards ultimately accumulated far more citations and practical impact than most of the winners:

- **Swin Transformer: Hierarchical Vision Transformer using Shifted Windows** (Ze Liu et al., Microsoft Research Asia)—The paper was ultimately published at ICCV 2021 and won Best Paper there, but its arXiv preprint was already circulating widely in the community around CVPR 2021.
- **Neural Body: Implicit Neural Representations with Structured Latent Codes for Novel View Synthesis of Dynamic Humans** (Sida Peng et al., Zhejiang University)—The paper extended NeRF to dynamic humans by representing human poses with structured latent codes.

## ICCV 2021

**Key figures:** 6,236 submissions, 1,617 accepted papers, and a 25.9% acceptance rate. The conference was held fully online from October 11–17, 2021, instead of at its originally planned venue in Montreal.

### Marr Prize (Best Paper)

**Swin Transformer: Hierarchical Vision Transformer using Shifted Windows**  
Ze Liu, Yutong Lin, Yue Cao, Han Hu, Yixuan Wei, Zheng Zhang, Stephen Lin, and Baining Guo (Microsoft Research Asia)

If ViT in 2020 showed that Transformers *could* handle vision, Swin Transformer was the paper that showed why they *should*. It addressed two critical weaknesses of ViT:

1. **Computational complexity:** ViT’s global self-attention scales quadratically with image size. Swin confined attention to local windows, reducing complexity to linear scaling.
2. **Multi-scale features:** ViT produced tokens at a single resolution. Swin used a hierarchical architecture to generate multi-scale feature maps that could connect directly to downstream detection and segmentation heads such as FPN. This was the capability that had made ResNet a universal backbone in the CNN era, and Swin brought it to Transformers.

The core design was the “shifted window.” Windows in adjacent layers were offset by half a window, allowing information to flow across window boundaries and addressing the boundary problem created by fixed windows.

Swin Transformer has accumulated more than 28,000 citations, making it one of the most cited papers in computer vision history. It effectively ended the assumption that ViTs were useful only for classification and made the Transformer a general-purpose backbone for classification, detection, segmentation, and image generation.

### Best Student Paper

**Pixel-Perfect Structure-from-Motion with Featuremetric Refinement**  
Philipp Lindenberger, Paul-Edouard Sarlin, Viktor Larsson, and Marc Pollefeys (ETH Zürich)

The work integrated learned features into a traditional Structure-from-Motion pipeline. After feature matching, it added featuremetric refinement to localize keypoints with subpixel accuracy.

### Marr Prize Honorable Mentions

- **Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields** (Jonathan T. Barron et al., Google Research)—Mip-NeRF addressed aliasing when a NeRF scene is viewed at different distances. It replaced rays with cones for ray casting, a critical step toward turning NeRF from a toy demo into a practical method.
- **OpenGAN: Open-Set Recognition via Open Data Generation** (Shu Kong and Deva Ramanan, CMU)—OpenGAN generated synthetic data from “unknown classes” with a GAN to train an open-set classifier.
- **Viewing Graph Solvability via Cycle Consistency** (Federica Arrigoni et al., CIIRC / University of Udine)—A theoretical contribution in geometric vision that established complete conditions for determining whether a viewing graph is solvable.
- **Common Objects in 3D: Large-Scale Learning and Evaluation of Real-life 3D Category Reconstruction** (Jeremy Reizenstein et al., Facebook AI Research)—The CO3D dataset contained multi-view videos of approximately 19,000 real objects, filling a gap in large-scale, real-world data for 3D category reconstruction.

### Other Important ICCV 2021 Papers

- **DINO: Emerging Properties in Self-Supervised Vision Transformers** (Mathilde Caron et al., Facebook AI Research / Inria / Sorbonne University)—A self-supervised ViT learned object segmentation automatically in its attention maps without any segmentation labels. This emergent property was one of the most surprising findings of 2021. Its successor, DINOv2 in 2023, became one of the most important pretrained backbones in computer vision.
- **An Empirical Study of Training Self-Supervised Vision Transformers (MoCo v3)** (Xinlei Chen, Saining Xie, and Kaiming He, Facebook AI Research)—A systematic study of training instability in self-supervised ViTs. It found that batch size, learning rate, and freezing the patch-projection layer all had critical effects on stability.
- **BARF: Bundle-Adjusting Neural Radiance Fields** (Cheng-Hung Chen Lin et al., UC Berkeley)—BARF jointly optimized the scene representation and camera poses, removing NeRF’s requirement for precise camera poses as input.

## Three Through Lines in Computer Vision in 2021

### Trend 1: Vision Transformers Moved from Experiment to Mainstream Architecture

Google’s ViT, published at the end of 2020, showed that a pure Transformer could classify images. It still had two limitations: it required enormous pretraining data in the form of JFT-300M and worked only for classification. Both limits fell in 2021:

- **DeiT (Data-efficient Image Transformers)** (Hugo Touvron et al., Facebook AI Research, ICML 2021)—A distillation token allowed ViT to reach competitive results when trained only on ImageNet-1K, overturning the assumption that ViT required JFT-300M.
- **Swin Transformer** (ICCV 2021 Best Paper)—Enabled ViTs to perform dense prediction tasks such as detection and segmentation instead of serving only as classifiers.
- **CvT: Introducing Convolutions to Vision Transformers** (Haiping Wu et al., McGill / Microsoft, ICCV 2021)—Embedded convolutions into the Transformer to combine the strengths of both architectures.
- **CrossViT: Cross-Attention Multi-Scale Vision Transformer** (Chun-Fu Chen et al., MIT-IBM Watson AI Lab, ICCV 2021)—A multi-scale, dual-branch ViT.

By the end of 2021, “Transformer or CNN?” had changed from an experimental question into a real architectural decision. Swin Transformer offered a backbone as general-purpose as ResNet, and subsequent papers began reporting results with both CNN and Transformer backbones by default.

### Trend 2: Self-Supervised Learning Broke Through—Strong Features Without Labels

Progress in self-supervised learning in 2021 followed two main paths:

**Simplifying contrastive learning:**

- SimSiam (CVPR 2021 Honorable Mention) reduced the method to its essentials: no negative samples, no large batches, and no momentum encoder.
- MoCo v3 (ICCV 2021) systematically addressed instability in self-supervised ViT training.

**Breakthroughs in self-distillation:**

- DINO (ICCV 2021) found that the attention maps of a self-supervised ViT automatically formed object-segmentation masks. This emergent property did not appear in supervised ViTs or CNNs. It suggested that self-supervised learning was not merely a cheaper approximation of supervised learning, but could learn features that supervision did not.

By the end of 2021, self-supervised methods were within 1–2% of supervised learning on ImageNet linear probing. More importantly, DINO’s emergent property suggested that a self-supervised ViT might be a better general-purpose backbone than its supervised counterpart. DINOv2 in 2023 and MAE—Kaiming He’s CVPR 2022 oral paper—later provided further evidence for this direction.

### Trend 3: NeRF Grew from One Paper into an Entire Subfield

NeRF (Neural Radiance Fields) made a spectacular debut as an ECCV 2020 Best Paper. By 2021, more than 25 NeRF-related papers appeared at ICCV alone. Frank Dellaert of Georgia Tech cataloged them in his blog post, “NeRF at ICCV 2021.” These papers extended NeRF in every direction:

- **Quality and efficiency:** Mip-NeRF, an Honorable Mention, addressed aliasing in multi-scale rendering; FastNeRF increased rendering speed to 200 FPS.
- **Dynamic scenes:** Multiple papers extended NeRF to video and dynamic humans, including Neural Body at CVPR 2021 and Dynamic View Synthesis at ICCV 2021.
- **Removing pose dependence:** BARF and related work began eliminating NeRF’s requirement for precise camera poses.
- **Editability:** GIRAFFE, the CVPR 2021 Best Paper, and several ICCV papers made NeRF scenes editable and controllable.
- **SLAM integration:** iMAP at ICCV 2021 integrated a NeRF-style implicit representation into a real-time SLAM system.

The NeRF boom of 2021 foreshadowed a paradigm shift in 3D vision from traditional geometric methods toward neural implicit representations. In 2023, 3D Gaussian Splatting became the next milestone in that line of work.

## The Pandemic’s Effect on the Community

CVPR 2021 and ICCV 2021 were both held fully online. It was CVPR’s second consecutive virtual edition and ICCV’s first. Virtual conferences lowered barriers to participation by eliminating the need for visas, flights, and accommodation. The community nevertheless widely identified informal academic exchange as the greatest loss: spontaneous hallway discussions, face-to-face questions at poster sessions, and collaboration opportunities over dinner. Major conferences began returning to in-person formats in 2022, and the experience of those two virtual years became an important reference point in later discussions of hybrid conferences.

## Overall

Three keywords summarize the top computer vision conferences of 2021: **Transformer, self-supervised learning, and NeRF**. Swin Transformer gave Transformers a credible path to replacing ResNet as a general-purpose backbone. DINO revealed properties of self-supervised learning that supervised methods did not exhibit. NeRF expanded from a single paper into an entire subfield. None of these trends ended in 2021. Each defined a major direction in computer vision for the following several years, until diffusion models and 3D Gaussian Splatting brought the next paradigm shift in 2023–2024.

---

## References

- [CVPR 2021 Paper Awards (official page)](https://cvpr2021.thecvf.com/node/329)
- [ICCV 2021 Paper Awards (official page)](https://iccv2021.thecvf.com/iccv-2021-paper-awards)
- [CVPR 2021 Home—fully virtual conference announcement](https://cvpr2021.thecvf.com)
- [ICCV 2021 Home—fully virtual conference announcement](https://iccv2021.thecvf.com/home)
- [Computer Vision Foundation—Computer Vision Awards](https://www.thecvf.com/?page_id=413)
- [Niemeyer & Geiger (2021), "GIRAFFE: Representing Scenes as Compositional Generative Neural Feature Fields," CVPR 2021](https://arxiv.org/abs/2011.12100)
- [Liu et al. (2021), "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows," ICCV 2021](https://arxiv.org/abs/2103.14030)
- [Caron et al. (2021), "Emerging Properties in Self-Supervised Vision Transformers (DINO)," ICCV 2021](https://arxiv.org/abs/2104.14294)
- [Chen & He (2021), "Exploring Simple Siamese Representation Learning (SimSiam)," CVPR 2021](https://arxiv.org/abs/2011.10566)
- [Barron et al. (2021), "Mip-NeRF: A Multiscale Representation for Anti-Aliasing Neural Radiance Fields," ICCV 2021](https://arxiv.org/abs/2103.13415)
- [Chen, Xie & He (2021), "An Empirical Study of Training Self-Supervised Vision Transformers (MoCo v3)," ICCV 2021](https://arxiv.org/abs/2104.02057)
- [Touvron et al. (2021), "Training data-efficient image transformers & distillation through attention (DeiT)," ICML 2021](https://arxiv.org/abs/2012.12877)
- [Frank Dellaert, "NeRF at ICCV 2021" (complete catalog of NeRF-related papers)](https://dellaert.github.io/NeRF21)
- [He, Chen & Girshick (2021), "Masked Autoencoders Are Scalable Vision Learners (MAE)," arXiv 2021 (published at CVPR 2022)](https://arxiv.org/abs/2111.06377)
- [Paper Digest—Most Influential ICCV Papers](https://www.paperdigest.org/2025/09/most-influential-iccv-papers-2025-09-version)
- [SarahRastegar/Best-Papers-Top-Venues (GitHub compilation of best papers by year)](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
