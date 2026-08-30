---
title: "2022 AI Conference Guide: Computer Vision"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, eccv, computer-vision, "2022", text-to-image, nerf, latent-diffusion]
lang: en
tldr: "2022 marked computer vision’s turn from recognition toward generation. Latent Diffusion Models appeared at CVPR and led to Stable Diffusion; NeRF research jumped from 25 papers in 2021 to more than 50 at CVPR alone; ConvNeXt mounted a compelling counterattack for CNNs; and ECCV in Tel Aviv set a record with 157 oral papers."
description: "A guide to award-winning and influential work from CVPR and ECCV 2022, three major trends—text-to-image moving from research to products, the explosive growth of NeRF, and the competition and convergence of CNNs and Transformers—and the review pressure created by rising submissions."
draft: false
series:
  name: "AI 頂會導讀"
  order: 12
glossary:
  - term: "Latent Diffusion Model (LDM)"
    definition: "A generative model that performs diffusion and denoising in a compressed latent space rather than raw pixel space, greatly reducing compute cost. It is the core architecture behind Stable Diffusion."
    context: "Published at CVPR 2022, it later became the foundation of Stable Diffusion."
  - term: "NeRF (Neural Radiance Field)"
    definition: "A continuous 3D representation that uses a neural network to learn a scene’s radiance field and synthesize new viewpoints from a small number of captured angles."
    context: "More than 50 related papers appeared at CVPR in 2022, turning one breakthrough into a complete subfield."
  - term: "ConvNeXt"
    definition: "A “modernized CNN” architecture from Facebook AI Research that incrementally redesigned ResNet using ideas associated with Transformers, showing that a pure CNN could reach ViT-level performance."
    context: "Published at CVPR 2022, it was the CNN camp’s direct response to the Vision Transformer wave."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2022-cv)

[The previous article on computer vision in 2021](/posts/ai/2026-08-24-ai-conference-2021-cv-en) covered the year Vision Transformers entered computer vision and NeRF took off. The changes in 2022 were even more dramatic. The largest shift was not in recognition but in generation: a Latent Diffusion Models paper published at CVPR became the architecture behind the globally popular Stable Diffusion only months later.

## CVPR 2022

**CVPR received 8,161 submissions and accepted 2,064 papers, an acceptance rate of 25.3%.** Held in New Orleans, it was the first fully in-person CVPR after COVID.

### Award-Winning Papers

**Best Paper Award**

- **Learning to Solve Hard Minimal Problems** — Petr Hruby, Timothy Duff, Anton Leykin, and Tomas Pajdla (Czech Technical University / Georgia Tech). The paper applied algebraic geometry to minimal problems, which are core computations in multi-view geometry and Structure from Motion. Its learned-solver framework automatically found more efficient solution paths than hand derivations. The award prompted discussion because the work used geometric methods rather than deep learning, making it unusual in a year dominated by Transformers.

**Best Paper Honorable Mention**

- **Dual-Shutter Optical Vibration Sensing** — Mark Sheinin, Dorian Chan, Matthew O'Toole, and Srinivasa Narasimhan (CMU). The method exploited differences between global and rolling shutters to sense high-frequency vibrations without specialized hardware. An ordinary camera could perform a task that traditionally required a laser vibrometer.

**Best Student Paper Award**

- **EPro-PnP: Generalized End-to-End Probabilistic Perspective-n-Points for Monocular Object Pose Estimation** — Hansheng Chen et al. (Tongji University / Alibaba DAMO Academy). EPro-PnP reframed the Perspective-n-Point problem as an end-to-end differentiable probabilistic framework. Monocular object-pose estimation could be trained directly with gradient descent instead of relying on non-differentiable post-processing such as RANSAC.

**Best Student Paper Honorable Mention**

- **Ref-NeRF: Structured View-Dependent Appearance for Neural Radiance Fields** — Dor Verbin, Peter Hedman, Ben Mildenhall, Todd Zickler, Jonathan Barron, and Pratul Srinivasan (Harvard / Google Research). Ref-NeRF improved NeRF rendering of reflective surfaces by replacing the original directional-vector model of view-dependent appearance with reflected radiance, greatly increasing realism on specular and glossy surfaces.

### Highly Influential Papers Beyond the Award Winners

**High-Resolution Image Synthesis with Latent Diffusion Models** — Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, and Björn Ommer (LMU Munich / Runway). This was the most influential computer vision paper of 2022 and later accumulated more than 4,800 citations. Its central idea was to move diffusion from pixel space into the latent space of a pretrained autoencoder, while using cross-attention to incorporate conditioning inputs such as text. The result greatly reduced compute cost relative to pixel-space diffusion without sacrificing quality. A few months later, Stability AI released Stable Diffusion on this architecture, turning text-to-image generation from a research tool into a consumer product.

**Masked Autoencoders Are Scalable Vision Learners (MAE)** — Kaiming He, Xinlei Chen, Saining Xie, Yanghao Li, Piotr Dollár, and Ross Girshick (Meta AI / FAIR). MAE brought BERT-style masked pretraining from NLP into vision: it randomly hid 75% of image patches and trained the model to reconstruct them. The key design was an asymmetric encoder–decoder. The encoder processed only visible patches, while the decoder remained lightweight, making training more than three times faster. MAE quickly became a standard method for self-supervised vision pretraining and influenced a large body of work including VideoMAE, BEiT v2, and ViTDet.

**A ConvNet for the 2020s (ConvNeXt)** — Zhuang Liu, Hanzi Mao, Chao-Yuan Wu, Christoph Feichtenhofer, Trevor Darrell, and Saining Xie (Meta AI / UC Berkeley). Its argument was direct: progressively “modernize” ResNet with larger kernels, Layer Normalization, and redesigned stems and blocks, and a pure CNN can match Swin Transformer. ConvNeXt reached 87.8% top-1 accuracy on ImageNet and surpassed Swin on COCO detection and ADE20K semantic segmentation. This did not mean Transformers were poor architectures. It showed that many gains attributed to the ViT wave of 2021 came from improvements in training and architectural design, not exclusively from self-attention.

**MetaFormer Is Actually What You Need for Vision** — Weihao Yu et al. (National University of Singapore / Sea AI Lab). The authors deliberately weakened the token mixer by replacing self-attention with average pooling. Their experiment found that much of the Transformer’s performance advantage came from the broader MetaFormer architecture rather than self-attention itself. PoolFormer remained highly competitive with average pooling in place of attention, a counterintuitive result that challenged the “attention is all you need” narrative in vision.

**Grounded Language-Image Pre-Training (GLIP)** — Liunian Harold Li et al. (UCLA / Microsoft Research). GLIP unified object detection and phrase grounding in a shared pretraining framework. After pretraining on 27 million grounding examples, it performed zero-shot object detection and reached 49.8 AP without seeing any COCO images. The vision-language direction opened by CLIP in 2021 was already producing practical detection-level applications in 2022.

### The NeRF Explosion

CVPR 2022 marked the explosion in NeRF research volume. Georgia Tech professor Frank Dellaert counted **more than 50 NeRF-related papers** at the conference, compared with approximately 25 across CVPR and ICCV combined in 2021. Notable examples included:

- **Plenoxels: Radiance Fields without Neural Networks** — Alex Yu et al. (UC Berkeley). Plenoxels removed neural networks entirely and optimized spherical-harmonic coefficients directly on a 3D voxel grid. Its much faster rendering showed that NeRF’s core contribution was the framework of differentiable rendering plus a volumetric representation, not the MLP itself.
- **Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields** — Jonathan Barron et al. (Google Research). Mip-NeRF 360 extended Mip-NeRF to unbounded scenes, added anti-aliasing and a distortion-based regularizer, and became a new benchmark for outdoor NeRF scenes.
- **Direct Voxel Grid Optimization (DVGO)** — Cheng Sun et al. (National Taiwan University). Like Plenoxels, DVGO removed the MLP and optimized a voxel grid directly, but added a two-stage coarse-to-fine strategy. It reduced training time from several hours for the original NeRF to a little over ten minutes.
- **Block-NeRF** — Matthew Tancik et al. (Waymo / UC Berkeley). Block-NeRF extended NeRF to city scale by stitching together multiple Block-NeRFs into a 3D model of an entire neighborhood, reconstructing large parts of San Francisco from Waymo driving footage.

At the same time, NVIDIA’s **Instant Neural Graphics Primitives (Instant-NGP)** used multiresolution hash encoding to reduce NeRF training to seconds. Although published at SIGGRAPH 2022 rather than CVPR, it joined Plenoxels and DVGO in defining the 2022 theme of accelerated NeRF.

## ECCV 2022

**ECCV received 6,773 submissions, accepted 1,645 papers, or approximately 24.3%, and selected 157 oral papers, or 2.7%.** It was held in Tel Aviv, Israel. ECCV is the major even-year computer vision conference, alternating with ICCV in odd years. The 2022 edition had 276 Area Chairs and 4,719 reviewers.

### Award-Winning Papers

**Best Paper Award**

- **On the Versatile Uses of Partial Distance Correlation in Deep Learning** — Xingjian Zhen, Zihang Meng, Rudrasis Chakraborty, and Vikas Singh (University of Wisconsin–Madison). The paper brought partial distance correlation from classical statistics into deep learning and applied it to feature disentanglement, domain transfer, causal inference, and other tasks. It won because it showed how one mathematical tool from classical statistics could address several apparently unrelated deep-learning problems. It proposed a general analytical framework rather than one new model.

**Best Paper Honorable Mentions**

- **Pose-NDF: Modelling Human Pose Manifolds with Neural Distance Fields** — Garvita Tiwari, Dimitrije Antic, Jan Eric Lenssen, Nikolaos Sarafianos, Tony Tung, and Gerard Pons-Moll (MPI for Informatics / Meta Reality Labs). Pose-NDF modeled the human-pose manifold with a Neural Distance Field. Plausible poses formed a zero level set in a high-dimensional space, and the NDF output the distance from any pose to the nearest plausible one. It supported tasks such as pose denoising and completion.

- **A Level Set Theory for Neural Implicit Evolution under Explicit Flows** — Ishit Mehta, Manmohan Chandraker, and Ravi Ramamoorthi (UC San Diego). The paper combined level-set methods with neural implicit representations, allowing implicit surfaces to deform physically under explicit flow fields.

### Highly Influential Papers

**ViTDet: Exploring Plain Vision Transformer Backbones for Object Detection** — Yanghao Li, Hanzi Mao, Ross Girshick, and Kaiming He (Meta AI / FAIR). Its result was counterintuitive: object detection did not require a hierarchical architecture such as Swin Transformer. A plain, non-hierarchical ViT with a simple feature pyramid and window attention, without shifting, reached 61.3 AP on COCO. Combined with MAE pretraining, ViTDet showed that “plain ViT plus masked pretraining” could compete with hierarchical designs on downstream detection and simplified the design of vision backbones.

**BEiT v2: Masked Image Modeling with Vector-Quantized Visual Tokenizers** — Zhiliang Peng et al. (Microsoft Research). Continuing BEiT’s masked-image-modeling direction, BEiT v2 replaced dependence on DALL-E’s codebook with a vector-quantized visual tokenizer and surpassed MAE on ImageNet fine-tuning. Together, MAE and BEiT v2 defined two main schools of self-supervised vision in 2022: reconstructing pixels and predicting discrete tokens.

**VideoMAE: Masked Autoencoders are Data-Efficient Learners for Self-Supervised Video Pre-Training** — Zhan Tong et al. (Nanjing University / Tencent). VideoMAE extended MAE’s masked pretraining to video. Temporal redundancy made very high masking ratios of 90–95% possible, and effective video representations required only limited training data. It was published at NeurIPS 2022, but together with ViTDet and BEiT v2 at ECCV it completed the expansion of the “MAE ecosystem” in 2022.

## Overall Observations on Computer Vision in 2022

### The Turn from Recognition to Generation

If 2021 was about Transformers replacing CNNs, 2022 was about generation overtaking recognition. Latent Diffusion Models appeared at CVPR; Stable Diffusion was open-sourced in August; DALL-E 2 became public in April; and Google published Imagen in May. All of these events occurred in the same year. Text-to-image generation ceased to be a demo inside a paper and became a product used by millions of people every day. The share of diffusion-model submissions at ECCV 2022 had already increased noticeably.

Notably, **most of the year’s most important generative-model papers were not published at CVPR or ECCV**. DALL-E 2 was an OpenAI technical report; Imagen appeared at an ICML 2022 workshop and on arXiv; DreamBooth was published at CVPR 2023; and Textual Inversion at ICLR 2023. They all appeared first as preprints and reached formal conference publication the following year. This reflected an accelerating trend: leading generative-model development had become faster than the conference review cycle, making preprints plus open-source releases more important than waiting for conference review.

### The CNN Counterattack and Convergence

ConvNeXt at CVPR 2022 was not the CNN’s final lament but a persuasive counterexample. Many gains attributed to Transformers came from modern training strategies and architectural principles, not solely from self-attention. MetaFormer went further: average pooling could replace attention and still work.

After 2022, the trend was no longer a binary choice between CNNs and Transformers but convergence. ConvNeXt v2, UniFormer, EfficientFormer, and related work began mixing local convolutions with global attention. That convergence became clearer in 2023–2024.

### NeRF Became an Independent Subfield

The more than 50 NeRF papers at CVPR 2022 marked NeRF’s transition from “an interesting paper” into a subfield with its own research community and branches. Those branches were already clear in 2022:

- **Acceleration:** Plenoxels, DVGO, and Instant-NGP aimed to reduce training from hours to minutes or even seconds.
- **Expansion:** Mip-NeRF 360 and Block-NeRF handled unbounded scenes and city scale.
- **Quality:** Ref-NeRF addressed rendering of particular materials, including reflective and transparent surfaces.
- **Applications:** Dynamic scenes, editable NeRFs, and generative NeRFs.

3D Gaussian Splatting would seriously challenge NeRF after its appearance at the end of 2023. In 2022, however, NeRF remained the dominant approach to learned 3D representation.

### How 2022 Evolved from 2021

| Dimension | 2021 | 2022 |
|---|---|---|
| Main theme | Transformers entered computer vision (ViT, Swin, DeiT) | Generative models moved from research to products (LDM → Stable Diffusion) |
| Self-supervision | DINO, MoCo v3, SimSiam—methodological exploration | MAE, BEiT v2—convergence into two schools (pixel reconstruction vs. token prediction) |
| NeRF | ~25 papers across CVPR and ICCV, primarily improving the original | 50+ papers at CVPR alone, splitting into acceleration, expansion, quality, and application branches |
| CNN vs. Transformer | CNNs on defense as ViTs gained ground | ConvNeXt showed CNNs could compete, beginning a move toward convergence |
| Multimodality | CLIP opened the vision-language direction | GLIP extended vision-language learning into detection; text-to-image became the breakthrough application |

### Looking Back from 2026: Which 2022 Papers Had the Deepest Impact?

1. **Latent Diffusion Models**—the technical foundation of Stable Diffusion. It created the text-to-image industry and accumulated more citations than any other CVPR 2022 paper.
2. **MAE**—became the de facto standard for self-supervised vision pretraining and led to cross-modal extensions such as VideoMAE and AudioMAE.
3. **ConvNeXt**—ended the claim that “CNNs are dead.” ConvNeXt v2 remained competitive on multiple benchmarks.
4. **Instant-NGP** (SIGGRAPH 2022)—multiresolution hash encoding became a standard component of later 3D representations.
5. **ViTDet**—established the viability of “plain ViT plus MAE pretraining” for detection and influenced later work including SAM, the Segment Anything Model.

---

## References

- [CVPR 2022 Paper Awards (official)](https://cvpr2022.thecvf.com/cvpr-2022-paper-awards)
- [Computer Vision Awards—The Computer Vision Foundation](https://www.thecvf.com/?page_id=413)
- [ECCV 2022 Awards (official PDF)](https://eccv2022.ecva.net/files/2022/10/ECCV22-Awards.pdf)
- [High-Resolution Image Synthesis with Latent Diffusion Models—CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper.html)
- [Masked Autoencoders Are Scalable Vision Learners—CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/He_Masked_Autoencoders_Are_Scalable_Vision_Learners_CVPR_2022_paper.html)
- [A ConvNet for the 2020s—CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Liu_A_ConvNet_for_the_2020s_CVPR_2022_paper.html)
- [MetaFormer Is Actually What You Need for Vision—CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Yu_MetaFormer_Is_Actually_What_You_Need_for_Vision_CVPR_2022_paper.html)
- [GLIP: Grounded Language-Image Pre-Training—CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Li_Grounded_Language-Image_Pre-Training_CVPR_2022_paper.html)
- [ViTDet: Exploring Plain Vision Transformer Backbones for Object Detection—ECCV 2022 (Springer)](https://link.springer.com/chapter/10.1007/978-3-031-20077-9_17)
- [Mip-NeRF 360: Unbounded Anti-Aliased Neural Radiance Fields—CVPR 2022 Open Access](https://openaccess.thecvf.com/content/CVPR2022/html/Barron_Mip-NeRF_360_Unbounded_Anti-Aliased_Neural_Radiance_Fields_CVPR_2022_paper.html)
- [NeRF at CVPR 2022—Frank Dellaert (Georgia Tech; complete NeRF paper catalog)](https://dellaert.github.io/NeRF22/)
- [Instant Neural Graphics Primitives with a Multiresolution Hash Encoding—SIGGRAPH 2022](https://arxiv.org/abs/2201.05989)
- [CVPR 2022 Highlights: Frontier Research Trends—Microsoft Research](https://www.microsoft.com/en-us/research/lab/microsoft-research-asia/articles/cvpr-2022-highlights-frontier-research-trends-in-computer-vision/)
- [ECCV 2022 Highlights: Advancing the Foundations of Mixed Reality—Microsoft Research](https://www.microsoft.com/en-us/research/blog/eccv-2022-highlights-advancing-the-foundations-of-mixed-reality/)
- [Best Papers of Top Venues (GitHub, SarahRastegar)](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [Top Conference Best Papers (GitHub, FeijiangHan)](https://github.com/FeijiangHan/Top-Conference-Best-Papers)
