---
title: "NTHU NLP HW2: Arithmetic as a Language — PyTorch TA Session, a Two-Layer LSTM, and Teacher Forcing"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, homework, pytorch, rnn]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 5
tldr: "HW2 treats expressions like \"14*(43+20)=882\" as character sequences and asks a two-layer LSTM to generate the answer one character at a time after it sees \"=\". The training set has 2,369,250 rows and the eval set 263,250, with every number in 0–49. Six TODOs run from building a vocabulary and batching with loss only after \"=\" to a generator, teacher-forced training, and exact-match evaluation. The W4 PyTorch TA session is the toolbox for it."
description: "A guide to Assignment 2 of Hung-Yu Kao's Natural Language Processing course at NTHU (Fall 2025): the key parts of the W4 PyTorch TA session (tensors, nn.Module, autograd, Dataset/DataLoader, RNN data flow, teacher forcing), plus the HW2 Arithmetic dataset, starter code, TODO1–6, grading, and report questions."
draft: false
glossary:
  - term: "teacher forcing"
    definition: "When training a sequence generator, feed the ground-truth token as the next input at every step instead of the model's own previous prediction."
    context: "TODO5 in HW2 requires training the LSTM with teacher forcing."
  - term: "exact match"
    aliases: ["EM"]
    definition: "An answer counts as correct only if it matches the gold answer character for character; the score is the fraction correct."
    context: "TODO6 in HW2 scores the eval set with it, and requires generating each full answer with the generator."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic)

**Video status: Videos included.** [Source details](#course-video-sources)

This is post 5 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. The [previous post](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en) covered RNNs, LSTMs, and vanishing gradients. This one is hands-on: **show an LSTM a few million arithmetic expressions. Can it learn arithmetic?**

The post draws on two sets of material in the [IKMLab course repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing):

- **The W4 Tue TA session**: the 62-slide deck [pytorch_tutorial_NTHU_NLP.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/pytorch_tutorial_NTHU_NLP.pdf), with a recording titled "[Week 4 Tue.[助教課]](https://www.youtube.com/live/INIrdjLVMEU)" (助教課 means TA session; in Mandarin).
- **Assignment 2**: the [folder](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment2) holds the handout [NLP_HW2_arithmetic.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/NLP_HW2_arithmetic.pdf), the starter [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/main.ipynb), `arithmetic_train.csv`, and `arithmetic_eval.csv`. There is also a [walkthrough video](https://youtu.be/nFQCFaRs0kE) titled "Week 5 Thu. - Assignment 2"; the [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) lists HW2 in the W5 row.

Access level is **A3**: the handout, starter code, and full data are public. Solutions and grading scripts are on NTU COOL. Fall 2026 has not released HW2 yet, so everything here is the 2025 version.

## Course video sources

Video sources were checked against the official course page and rechecked live on 2026-10-10: lecture and video match, and the YouTube videos are public and embeddable. No timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=INIrdjLVMEU
title: Fall 2025 W4 Tue TA session recording
```

```youtube
url: https://www.youtube.com/watch?v=nFQCFaRs0kE
title: 2025 HW2 walkthrough video
```

Original videos: [Fall 2025 W4 Tue TA session recording](https://www.youtube.com/watch?v=INIrdjLVMEU)、[2025 HW2 walkthrough video](https://www.youtube.com/watch?v=nFQCFaRs0kE)

Course and recording entries:

- [Official course and recording entry](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): the whole Week 4 Tue. TA-session transcript was read. What the post says about it (Anaconda and installing PyTorch by CUDA version, the polynomial example introducing model/loss/optimizer, view vs reshape, nn.ModuleList vs a Python list, autograd dependency counting and the three ways to disable gradients, the training loop, Dataset/DataLoader and collate, the "I love AI" RNN data flow and teacher forcing vs generative training, and loading BERT with Hugging Face at the end) is all found in the captions; the 100x100 normalization timings (0.127 / 0.000088 s) and page numbers come from the slides, while the captions only say the matrix version is much faster. The HW2 walkthrough (nFQCFaRs0kE) has no captions on its YouTube page, so it could not be checked; the assignment details in the post rely on the PDF and starter code alone.

## The TA session: a toolbox for the assignment

The session starts with setup (Anaconda, conda commands, installing PyTorch for your CUDA version), then uses y = ax² + b to introduce the model, the loss, and the optimizer. Below are the parts that matter for HW2.

**Tensors.** Several slides cover creating and manipulating tensors, including the difference between `view` and `reshape`: `view` fails on non-contiguous tensors, while `reshape` copies them first. One slide normalizes a 100×100 tensor both ways: 0.127 seconds element by element, 0.000088 seconds as a matrix operation.

**nn.Module.** A model is a `torch.nn.Module` that must define `__init__` and `forward`. The slides stress putting submodules in `nn.ModuleList` rather than a plain Python list. `state_dict()`, `parameters()`, `train()`, and `eval()` all recurse into submodules, so layers stored in a list are never registered and never trained.

**Autograd.** A small example traces step by step how `backward()` walks the computation graph in reverse and uses dependency counts to order the work. Three ways to turn gradients off are listed: `requires_grad = False`, `with torch.no_grad():`, and `tensor.detach()`.

**The five-step training loop.** Slide 45 maps each step to one line:

```python
optimizer.zero_grad()                  # 1. clear gradients
output = model(**batch)                # 2. feed data to the model
loss = loss_fn(output, ground_truth)   # 3. compute loss
loss.backward()                        # 4. compute gradients
optimizer.step()                       # 5. update parameters
```

**Dataset and DataLoader.** `Dataset.__getitem__` returns one sample. The DataLoader groups a batch into a tuple and hands it to a collate function, which turns it into tensors. TODO3 in HW2 is exactly this.

**RNN data flow and teacher forcing.** Slides 54–57 use the sentence "I love AI !". One-hot vectors pass through an embedding layer into 768-dimensional vectors, then into the RNN. The slides then compare two ways to train:

- **Generative training**: each step feeds the model's own previous prediction. If the model guesses "eat" early, it ends up learning P(AI | I eat). The error carries forward and training becomes unstable.
- **Teacher forcing**: each step feeds the ground truth, so the model learns P(love | I), P(AI | I love), and so on. The slides conclude this is more stable.

The last few slides load BERT from Hugging Face, which belongs to [post 9](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en).

## HW2: what the task looks like

The handout states the idea up front: treat arithmetic expressions **as a language**, train a sequence generation model with RNNs or LSTMs, and reflect on how much the model really understands about arithmetic.

The dataset:

| Item | Details |
|---|---|
| Training set | 2,369,250 rows |
| Eval set | 263,250 rows |
| Question form | A (+/-/*) B (+/-/*) C = ?, every number in [0, 50) |
| Operators | +, -, *, parentheses |
| Format | Two CSV columns: `src` (e.g. `14*(43+20)=`) and `tgt` (e.g. `882`) |

I downloaded both CSVs and the row counts match the handout. The handout says each item has "2~3 numbers". In practice nearly every training row has three; only 6,784 have two. Answers can be negative too, as in the eval row `30-(48+13)=,-31`.

The model reads "1+1=" one character at a time, generates "2" after it sees "=", then emits `<eos>` and stops.

## Starter code and the six TODOs

`main.ipynb` already defines the model. `CharRNN` is an embedding layer, two `nn.LSTM` layers, and a two-layer fully connected head (ReLU in between) that outputs a probability for each character. The loss is cross entropy and the optimizer is Adam. You fill in:

| TODO | Task | Weight |
|---|---|---|
| 1 | Build the vocabulary: `char_to_id` and `id_to_char`, including `<pad>` and `<eos>` | 5% |
| 2 | Preprocess each expression into model input and output, ending with `<eos>` | 5% |
| 3 | Data batching: write the `Dataset` and DataLoader | 5% |
| 4 | Generation: write the generator, predicting one character at a time until `<eos>` | 10% |
| 5 | Training: teacher forcing, on GPU | 10% |
| 6 | Evaluation: generate full answers with the generator and compute exact match on the eval set | 10% |

The weights follow the summary table on slide 27, which totals 45%. The TODO2 heading on slide 19 says "10%", which disagrees with that table.

The handout and notebook flag several sticking points:

- **Compute loss only after "=".** For `1+2-3=0`, the notebook's target is `/ / / / / 0 <eos>`, where each "/" becomes `<pad>` and the loss ignores `<pad>`. The model does not need to predict the next character of the expression itself.
- **Take the last position when generating.** Feed the current sequence in full each time and use the last element of the output as the next-token prediction.
- **Evaluate with the generator.** The handout requires generating each complete answer and comparing it with the gold answer, not scoring teacher-forced outputs.
- **Gradient clipping is already in place.** The training loop calls `torch.nn.utils.clip_grad_value_` to clamp gradients to ±1, which ties back to the exploding gradients from the previous post.

The notebook's hyperparameter table lists batch size 64, embedding and hidden size 256, learning rate 0.001, and 10 epochs, but the code cell below it sets `epochs = 2`. The two disagree, so state in your report what you actually used.

## Grading and report questions

The total has three parts: code 45%, accuracy 10% (higher accuracy earns more; attach a screenshot at the end of the report), and the report 45%. The report questions are worth reading because they all probe whether the model understands arithmetic:

- List your training hyperparameters: learning rate, batch size, hidden size, epochs, and so on (5%)
- What happens to answer quality if you use an RNN or GRU instead of an LSTM, and why? (10%)
- What happens if training uses three-digit numbers but evaluation uses two-digit numbers? (10%)
- If 20% of the training answers are wrong, how does that affect the output? Give examples (10%)
- Why is gradient clipping needed during training? (5%)
- Anything else that strengthens the report (5%)

The handout asks for results as text rather than only images, to make grading easier. Submission rules match [HW1](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en): a `.py`, a `requirements.txt`, and a `.docx`, zipped and uploaded to NTU COOL within three weeks. Generative AI use must be disclosed, and plagiarism costs both students 100 points.

## Before you start

1. **Run the whole pipeline on a small slice first.** The training set has over two million rows. Take a few tens of thousands, confirm the loss drops and the generator stops, then scale up.
2. **Write the generator before training.** An untrained model can already run `model.generator('1+1=')`; it just outputs garbage. The starter generator defaults to `max_len=200`, so a model that never learned to emit `<eos>` runs to 200 characters on every question, and evaluating over two hundred thousand eval rows becomes very slow. Get the stopping condition right before you train.
3. **Print the wrong answers.** Exact match is a single number. Whether errors cluster in multiplication or addition, large numbers or negatives, is the material for any claim about whether the model understands arithmetic.
4. **Actually run the RNN/GRU question.** Swapping `nn.LSTM` for `nn.GRU` or `nn.RNN` in the starter code is a two-line change, and measured numbers make a stronger answer than reasoning alone.

## Further reading

- Previous in this series: [Seq2seq, LSTM, and Attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en)
- Next in this series: [Transformers and Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers-en)
- RNNs in an English-language course: [CMU 11-785: RNNs, part 1](/posts/ai/2026-08-22-cmu-11785-13-rnn-one-en), [CMU 11-785: RNNs, part 2](/posts/ai/2026-08-22-cmu-11785-14-rnn-two-en)
- Back to the [series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched against the official course page and YouTube: lecture and embedded videos agree and are publicly embeddable, so status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Everything stated about the W4 Tue. TA session is supported, so no change was needed; the HW2 walkthrough has no captions and could not be checked.

## References

- [pytorch_tutorial_NTHU_NLP.pdf (W4 TA session slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/pytorch_tutorial_NTHU_NLP.pdf)
- [Fall 2025 W4 Tue TA session recording](https://www.youtube.com/live/INIrdjLVMEU) (in Mandarin)
- [2025 HW2 handout NLP_HW2_arithmetic.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/NLP_HW2_arithmetic.pdf)
- [2025 HW2 starter main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/main.ipynb)
- [2025 HW2 folder (with arithmetic_train.csv and arithmetic_eval.csv)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment2)
- [2025 HW2 walkthrough video](https://youtu.be/nFQCFaRs0kE) (in Mandarin)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [PyTorch official site](https://pytorch.org/)
