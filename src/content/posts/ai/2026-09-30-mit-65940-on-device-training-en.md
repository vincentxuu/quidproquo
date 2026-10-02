---
title: "MIT 6.5940 L21 On-Device Training: Gradients Leak Data, and Activations Are the Memory Killer"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, on-device-ai, transfer-learning, privacy]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 23
tldr: "There are two reasons to train on the device: the model has to adapt to each user's new data, and that data should not leave the device. Lecture 21 first shows that sharing only gradients is not safe either: Deep Leakage from Gradients recovers the original images and sentences from them. Then it tackles memory. Training costs more than inference because activations must be stored, not because of the parameters. TinyTL fine-tunes only biases plus a lightweight residual and saves 6.5x memory; SparseBP updates only the important layers and channels; QAS lets real int8 training match fp32; and PockEngine does autodiff at compile time, bringing training memory on a 256KB MCU down to 141KB."
description: "A guide to Lecture 21 of MIT 6.5940 Fall 2024, On-Device Training and Transfer Learning: federated learning and FedAvg, the Deep Leakage from Gradients attack and its defenses, the training memory bottleneck, TinyTL (bias-only plus lite residual), sparse back-propagation and contribution analysis, quantization-aware scaling (QAS), and PockEngine's compile-time autodiff and cross-platform speedups."
draft: false
glossary:
  - term: "Deep Leakage from Gradients"
    aliases: ["DLG"]
    definition: "The attacker has only the model and a gradient shared during training. Start from a random dummy input and label, compute their gradient, use the distance between the two gradients as the loss, and update the dummy data instead of the weights. Once the gradients match, the dummy data has become the original training data."
    context: "MIT 6.5940 Lecture 21 slides, pages 19–26; from Zhu et al., NeurIPS 2019."
  - term: "TinyTL"
    aliases: ["Tiny Transfer Learning"]
    definition: "An on-device transfer learning method: freeze the weights and update only the biases (bias gradients need no stored activations), then add lite residual modules with low resolution and no inverted bottleneck to restore capacity, saving up to 6.5x training memory without losing accuracy."
    context: "MIT 6.5940 Lecture 21 slides, pages 41–52; from Cai et al., NeurIPS 2020."
  - term: "quantization-aware scaling"
    aliases: ["QAS"]
    definition: "When training with real int8 tensors, the ratio between weight and gradient scales drifts away from fp32, which hurts convergence. QAS rescales gradients according to the quantization scale so the ratio returns to fp32 levels, with no extra memory."
    context: "MIT 6.5940 Lecture 21 slides, pages 74–82; from Lin et al., NeurIPS 2022."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-on-device-training)

> **Version note**: This post is based on Lecture 21 (2024-11-19) of [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). The main materials are [Lec21-On-Device-Training-And-Transfer-Learning.pdf](https://www.dropbox.com/scl/fi/35992g5bz2sa1hxo3dmn6/Lec21-On-Device-Training-And-Transfer-Learning.pdf?rlkey=yqym2zffstfrdsui371lkvael&st=sqmt0oro&dl=0) (102 pages) and the [lecture recording](https://www.youtube.com/watch?v=1YuD_5UQxsA). Page numbers refer to PDF pages. Facts were checked against the official materials on 2026-09-30. Access level **A3**: slides and video are public, as is the DLG code the slides cite; this lecture has no lab.
>
> **Fall 2026 comparison**: The [F26 schedule](https://hanlab.mit.edu/courses/2026-fall-65940) keeps a lecture with the same title on November 24. As of 2026-09-30, its slides and video are empty links.

**Series position**: Previous [Lectures 19–20: Distributed Training](/posts/ai/2026-09-30-mit-65940-distributed-training-en) | Next [Lectures 22–23: Course Summary and Quantum Machine Learning](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

[Lectures 19–20](/posts/ai/2026-09-30-mit-65940-distributed-training-en) were about training on thousands of GPUs in a data center. Lecture 21 reverses direction: training on a phone, a Jetson, or even a microcontroller with only 256KB of SRAM.

Pages 2–3 give two reasons. **Customization**: sensors keep collecting new data, and the model needs to adapt. **Privacy**: sensitive data such as code or enterprise data should not go to the cloud. The Lecture Plan on page 4 has six items: gradient leakage, the training memory bottleneck, TinyTL, SparseBP, QAS, and PockEngine. The first is about privacy; the other five are about memory.

## Sharing only gradients is not safe either

Pages 6–11 introduce FedAvg from [federated learning](https://arxiv.org/abs/1602.05629): each device trains on local data for N steps, sends its updated model to a server to be averaged, and receives the average back. The slides stress that important private data never leaves the device.

Pages 12–18 then ask whether gradients themselves are safe. Earlier work showed that gradients alone reveal whether a given record was in the batch (membership inference) or whether a sample with some property was (property inference). Can you go further and recover the raw data?

[Deep Leakage from Gradients (Zhu et al., NeurIPS 2019)](https://arxiv.org/abs/1906.08935) on pages 19–20 says yes. Normal training fixes the data and updates the weights. DLG flips it, fixing the weights and updating the data:

1. Generate a random dummy image and a dummy label.
2. Run the dummy data through the model and compute its gradient.
3. Use the distance between the dummy gradient and the real gradient as the loss, and run gradient descent on the dummy data.
4. Once the gradients match, the dummy data is the original training data.

Pages 21–23 show the results. Images are recovered at batch sizes 1 and 8. The BERT example is the most striking: at iteration 0 it is gibberish, and by iteration 30 it has almost exactly recovered the original sentence, "Registration, volunteer applications, and student travel application open the first week of September. Child care will be available."

What about defenses? Page 24 shows that Gaussian or Laplacian noise only stops the attack once it is large enough to hurt accuracy noticeably. Page 25's answer comes from [Lecture 20's DGC](/posts/ai/2026-09-30-mit-65940-distributed-training-en): pruning 99% of the gradient keeps ResNet-50 at 76.15% top-1 (0.19% above the unpruned 75.96%) and blocks the attack. DGC's local accumulation further obscures the gradients, adding more protection. Page 26's conclusion: **sharing gradients is as dangerous as sharing the original data**. The PyTorch implementation of DLG is about 20 lines, and the code is at [mit-han-lab/dlg](https://github.com/mit-han-lab/dlg).

## Why training needs more memory than inference

Pages 28–31 lay out the hardware gap:

| | Cloud AI | Mobile AI | Tiny AI |
|---|---|---|---|
| Memory (holds activations) | 141GB | 4GB | 320kB |
| Storage (holds weights) | ~TB/PB | 256GB | 1MB |

Tiny AI has 13,000x less memory than Mobile AI and 1,000,000x less than Cloud AI. Page 31 concludes that both weights and activations have to shrink.

Page 32 measures it on MobileNetV2: inference (batch 1) takes 20MB, training (batch 8) takes 452MB, which does not fit in a Raspberry Pi 1's 256MB of DRAM, let alone a 2MB MCU.

Page 33 explains why. Backpropagation needs each layer's input activation to compute that layer's weight gradient, so every layer's output from the forward pass has to be kept. Inference can drop a layer's output once it is used; training cannot. Activations also grow linearly with batch size.

Pages 34–35 make a counterintuitive point: the bottleneck in CNN training is activations, not parameters. ResNet-50's activations are 6.9x larger than its parameters. MobileNetV2-1.4 has 4.3x fewer parameters than ResNet-50, but only 1.1x fewer activations. [Lecture 10 on MCUNet](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en) made the same point for inference: fewer parameters does not mean fewer activations.

## TinyTL: tune only the biases, then add a little capacity

Pages 36–39 compare common transfer learning setups (on the Cars dataset):

- **Full**: tune the whole network. Best accuracy, highest cost.
- **Last**: tune only the classifier head. Cheap, but limited capacity and a large accuracy drop.
- **BN+Last**: tune the BN layers and the head. Trainable parameters drop 12x, **but memory drops only 1.8x**, and accuracy still falls.

Parameter efficiency is not memory efficiency, for the reason in the previous section.

[TinyTL (Cai et al., NeurIPS 2020)](https://arxiv.org/abs/2007.11622) on pages 41–42 works from the backpropagation equations. A weight's gradient needs the input activation; a bias's gradient needs only the gradient coming down from the layer above. So **freezing the weights and tuning only the biases** removes the need to store activations and saves 12x memory. The cost, on page 43, is a 16.3% accuracy loss.

Pages 44–48 restore capacity with lite residual modules, designed to keep activations small: half the resolution and no inverted bottleneck. Page 47 works out that with 1/6 the channels, 1/2 the resolution, and 2/3 the depth, activations are about 4% of the original. Page 48's result: 11.6% higher accuracy than bias-only for only 5MB of extra memory.

Page 50 compares three datasets: TinyTL saves up to 6.5x memory without losing accuracy. Page 52 goes further. TinyTL supports batch-size-1 training with group normalization, and combined with lite residual it brings training memory down to 16MB, small enough for a typical L3 cache. Training inside the cache uses far less energy than training in DRAM.

## SparseBP: not every layer is worth updating

Pages 54–57 line up the strategies. Full backpropagation stores every activation. Updating only the last layer is cheap but loses a lot of accuracy. Bias-only needs no stored activations and can propagate all the way to the first layer, but still trails full training. The title of page 57 notes in passing that LoRA is a special case of bias-only.

Sparse back-propagation on pages 58–61 rests on three observations:

- Some layers matter less than others.
- Some channels matter less than others.
- There is no need to backpropagate into the earliest layers.

Page 61 works an example: updating only a quarter of the channels cuts both stored activations and backward FLOPs by 4x.

Which layers to update? Page 63 gives the principle: early layers have large activations, later layers have large weights, and the middle layers are small on both counts. So later layers get bias-only updates (which depend only on activations), and weights are updated only in the middle layers. Page 64's contribution analysis fine-tunes one layer at a time and uses the accuracy gain as that layer's contribution. Different models prefer different layers; BERT prefers the QKV projection and the first FFN layer. Page 65 then uses evolutionary search to find the overall update scheme.

Pages 66–67 report the results: SparseBP matches full backpropagation on BERT, DistilBERT, MCUNet, MobileNetV2, and ResNet-50, with 4.5 to 7.5x less extra memory.

Page 69 applies it to an LLM, fine-tuning Llama2-7B on the Alpaca dataset on a Jetson Orin:

| Framework | Method | Iteration latency | GPU memory | Alpaca-Eval win rate | MT-Bench |
|---|---|---|---|---|---|
| PyTorch | full fine-tuning | 7.7s | 45.1GB | 44.1% | 6.1 |
| PyTorch | LoRA (rank 8) | 7.3s | 30.9GB | 43.1% | 5.1 |
| PockEngine | full fine-tuning | 1.8s | 43.1GB | 43.7% | 6.1 |
| PockEngine | Sparse | 0.9s | 31.2GB | 43.1% | 5.7 |

The slide's conclusion: Sparse BP matches LoRA's accuracy, comes close to full fine-tuning, and cuts iteration time from 1.8 to 0.9 seconds.

## QAS: why real int8 training fails to converge

Pages 74–76 distinguish two kinds of quantized training. The QAT from [Lecture 6](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en) is fake quantization: most intermediate tensors stay in fp32, so **it saves no training memory**. Real quantization keeps weights and activations in int8, which does save memory, but there is no BatchNorm and the graph mixes int8, int32, and fp32, which makes training hard. Page 77 measures it: real int8 training with SGD drops average accuracy across 10 datasets from 86.0% to 75.4%.

Page 78 finds the cause: in int8 training, the ratio of weight norm to gradient norm (‖W‖/‖G‖) for each tensor no longer matches fp32. QAS on pages 79–80 rescales gradients by the quantization scale, pulling the ratio back to fp32 levels. The comparison on page 82:

| Training method | Top-1 |
|---|---|
| FP32 SGD | 86.0 |
| Int8 SGD | 75.4 |
| Int8 LARS | 64.8 |
| Int8 Adam (3x extra memory) | 84.5 |
| Int8 QAS | 86.9 |

Adam also recovers most of the accuracy, but it needs 3x extra memory, which a device cannot afford.

## PockEngine: turning algorithmic savings into real savings

Page 83 pulls the lecture together: how training memory comes down step by step on an MCU with only 256KB of SRAM.

| Approach | Training memory |
|---|---|
| TensorFlow (cloud) | 652MB |
| PyTorch (cloud) | 303MB |
| MNN (edge) | 41.5MB |
| PockEngine | 5.7MB (7.3×) |
| + QAS | 2.9MB (2.0×) |
| + sparse layer/tensor update | 355KB (8.8×) |
| + operator reordering | 141KB (2.4×) |

That is 2300x overall, inside the 256KB limit. The figure comes from [On-Device Training Under 256KB Memory (Lin et al., NeurIPS 2022)](https://arxiv.org/abs/2206.15472).

Page 86 asks how algorithmic savings become real savings. The answer is algorithm-system co-design, in the form of [PockEngine (Zhu et al., MICRO 2023)](https://arxiv.org/abs/2310.17752).

Pages 89–90 contrast two approaches. Conventional training frameworks prioritize flexibility and run autodiff at runtime, which rules out many graph optimizations. PockEngine moves autodiff to **compile time**, minimizing runtime overhead and opening up room for graph optimization. Page 93 lists those optimizations: sparse layer/tensor update, operator reordering and in-place update, constant folding, and dead-code elimination. Page 95 says code generation emits code only for the operators actually used, producing a lightweight, portable binary.

Pages 94–100 show results across platforms:

- On MCUs, 21 to 23x faster than TensorFlow Lite (MobileNetV2, ProxylessNAS, MCUNet).
- On Jetson Nano and Orin, 2 to 4x faster. The slides attribute this to compilation: Python is slow on low-frequency CPUs.
- On Raspberry Pi 4B+, 13 to 21x faster. Existing frameworks are mostly optimized for inference, and training on ARM CPUs is barely optimized at all.
- On Apple M1/M2, it compiles the training graph to Metal, sidestepping PyTorch's and TensorFlow's compatibility problems on M1.
- It integrates Qualcomm's SNPE for DSPs and [TinyEngine](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) for MCUs, letting frameworks that only did inference support training.

## What you can do after this lecture

- **Tonight**: clone [mit-han-lab/dlg](https://github.com/mit-han-lab/dlg), run the attack on one CIFAR image, and watch the dummy image turn into the original step by step. Then prune 99% of the gradient and run it again to compare with page 25's defense.
- In PyTorch, set `requires_grad_(False)` on every weight of a pretrained CNN, leave only the biases trainable, and compare peak memory with full fine-tuning using `torch.cuda.max_memory_allocated()`.
- For a full treatment of LoRA and other PEFT methods, see [Lecture 14 on LLM post-training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en); for another course's angle, see [CMU 11-868 on PEFT and LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora-en).

## Further reading

- The same memory limits on the inference side: [Lecture 10 on MCUNet and tinyML](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en), [Lecture 11 on TinyEngine and parallel computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en)
- Quantization basics: [Lecture 6 on PTQ and QAT](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en)

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — Lecture 21 date, slides, and video links
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 21 scheduled for November 24; materials not yet released
- [Lec21-On-Device-Training-And-Transfer-Learning.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/35992g5bz2sa1hxo3dmn6/Lec21-On-Device-Training-And-Transfer-Learning.pdf?rlkey=yqym2zffstfrdsui371lkvael&st=sqmt0oro&dl=0) — source of every page number and figure in this post
- [EfficientML.ai Lecture 21 - On-device Training (YouTube)](https://www.youtube.com/watch?v=1YuD_5UQxsA)
- [McMahan et al., Communication-Efficient Learning of Deep Networks from Decentralized Data](https://arxiv.org/abs/1602.05629) — FedAvg
- [Zhu et al., Deep Leakage from Gradients (NeurIPS 2019)](https://arxiv.org/abs/1906.08935)
- [mit-han-lab/dlg (GitHub)](https://github.com/mit-han-lab/dlg)
- [Lin et al., Deep Gradient Compression (ICLR 2018)](https://arxiv.org/abs/1712.01887)
- [Cai et al., TinyTL: Reduce Activations, Not Trainable Parameters for Efficient On-Device Learning (NeurIPS 2020)](https://arxiv.org/abs/2007.11622)
- [Mudrakarta et al., K for the Price of 1 (ICLR 2019)](https://arxiv.org/abs/1810.10703) — the BN+Last baseline
- [Lin et al., On-Device Training Under 256KB Memory (NeurIPS 2022)](https://arxiv.org/abs/2206.15472) — SparseBP, QAS
- [Zhu et al., PockEngine: Sparse and Efficient Fine-tuning in a Pocket (MICRO 2023)](https://arxiv.org/abs/2310.17752)
