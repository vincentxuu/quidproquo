---
title: "From PyTorch and Hugging Face to LoRA, Quantization, and vLLM Deployment | NTU Yun-Nung Chen Applied Deep Learning Tutorial"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pytorch, hugging-face, lora, moe, quantization, vllm]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 16
tldr: "The ADL Fall 2025 course page schedules seven TA recitations across ten videos: Colab and PyTorch, ipdb debugging → the life of an NLP project → data formats for four NLP task types → LoRA and QLoRA → scaling laws, the LLaMA architecture, and MoE → quantization and evaluation → deployment with vLLM. The videos were recorded by the TA in 2023 and 2024 and reused in Fall 2025, so the Homework 1 and Homework 3 they mention are those years' assignments. The course page's five slide links all return 404; files with the same names open under the Fall 2024 path, and Deployment has a video only. This guide follows what the TA actually demonstrates and warns about in each session, with examples you can work by hand."
description: "A guide to the seven TA recitations of NTU Yun-Nung Chen's ADL Fall 2025 (114-1), written from the spoken content of ten recitation videos, five slide decks (same-name files on the f113 path), and two Colab notebooks: GPU setup in Colab and PyTorch tensor operations, finding a device mismatch with ipdb, the data-to-demo project loop and train/validation/test splits, Hugging Face Trainer and Gradio, BIO tagging and the run_ner, run_summarization, and run_qa scripts, LoRA parameter counts and QLoRA 4-bit quantization, training FLOPs estimates and Chinchilla, RMSNorm, RoPE, and the KV cache, MoE capacity factor and load-balancing loss, AWQ and GPTQ, MMLU, MT-Bench, and Chatbot Arena, and vLLM offline inference, tensor parallelism, and the OpenAI-compatible API. Includes hand-worked examples, common misreadings, and a self-check."
draft: false
glossary:
  - term: "QLoRA"
    definition: "Quantize the frozen pretrained weights to 4-bit for storage, then train LoRA's low-rank matrices on top. The goal is to shrink the memory taken by the pretrained weights themselves."
    context: "Page 18 of the LoRA recitation slides names LoRA's limit (the pretrained weights still take a lot of memory); pages 21–27 then cover QLoRA."
  - term: "MoE"
    aliases: ["Mixture of Experts"]
    definition: "Replace a Transformer's feed-forward layer with several 'experts' and let a router pick only a few experts per token. Total parameters are large, but each token uses only a small share of them."
    context: "Pages 18–33 of the LLM Basics & MoE slides: dense vs MoE, shared experts, token dropping, load balancing, expert-choice routing, and Mixture-of-Depths."
  - term: "AWQ"
    aliases: ["Activation-aware Weight Quantization"]
    definition: "A post-training quantization method that picks scaling factors to minimize the error in activations after quantization, not just in the weights. It needs a small calibration set."
    context: "Pages 12–15 of the Inference & Eval slides, marked 'Data Dependent'; the same deck also covers GPTQ."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)

**Video status: Videos included.** [Source details](#course-video-sources)

> **This guide is based on ADL Fall 2025 (114-1, 2025/09/01–12/15).** It is the TA recitations guide, the last one, in the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. The lecture posts only link to the recitations; the recitation content lives here.

The [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) splits each week into a Lecture column and a Recitation column. Lectures cover the ideas. Recitations cover how to actually get things running. Page 6 of the [Course Logistics slides](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) lists seven recitation topics: dev infra and tooling (Colab, GPU, PyTorch), the DL workflow, Hugging Face basics, LLM architecture, LLM evaluation, LLM training, and LLM inference.

This post answers one question: **the lectures teach the principles, so what hands-on skills do the recitations add?** The TA lays out the plan himself at the start of the first video: week one covers Colab, GPUs, and PyTorch; next comes a full pass through a deep learning project; then a few basic NLP tasks built with Hugging Face's Datasets and Transformers libraries; and the last four sessions cover large language model architecture, evaluation, training techniques, and faster inference.

**Sources**: the Recitation column of the course page, the ten recitation videos (none has captions, so this guide works from transcripts made from their audio), five slide PDFs (same-name files on the Fall 2024 path), and two TA Colab notebooks. Commands, code, and numbers follow the slide pages and the notebooks. Examples and calculations marked "made up for this post" are not from the recitations. The recitations are taught in Mandarin; the slides mix Mandarin and English.

After reading, you should be able to do six things:

1. Confirm in Colab that PyTorch can see the GPU, and use ipdb to track down errors such as "the model and the data are on different devices".
2. Say which of the training, validation, and test sets the model may look at and when each is used, and run one sentence-classification job with Hugging Face's `Trainer`.
3. Look at an NLP requirement, decide which of four task types it is, and describe what the data for that task should look like.
4. Work out how much LoRA cuts the trainable parameters, and explain what extra problem QLoRA solves.
5. Use hand-worked examples of the capacity factor and the load-balancing loss to explain why MoE routing is hard to train.
6. Work a 2-bit quantization error by hand, and name the three settings that most often bite when deploying with vLLM.

## The big picture

| Week | Recitation | Videos (length) | Slides | Lectures that week |
|---|---|---|---|---|
| 9/01 | Dev Infra & Tooling | [PyTorch](https://youtu.be/zuiACAhRUzA) (17:45), [Debugging](https://youtu.be/RYkEoCkJWeA) (11:46) | None; a [Colab](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT) instead | Sequence Modeling |
| 9/08 | NLP Lifecycle | [Step by Step](https://youtu.be/anK1_PK464k) (36:10) | [w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf) (46 pages) + [Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ) | Attention, Transformer, Tokenization, BERT; HW1 released |
| 9/15 | Underlying Logics of Projects | [Step by Step](https://youtu.be/255ZzsTTHoU) (24:00) | [w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf) (43 pages) | Pretraining & Prompt Learning |
| 9/22 | LLM LoRA Training | [LoRA](https://youtu.be/eGQMzbhokg0) (18:15) | [w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf) (30 pages) | Post-Training, LLM Adaptation; HW2 released |
| 10/13 | LLM Basics & MoE | [Basics](https://youtu.be/BBw-ki4_06o) (20:16), [Architecture](https://youtu.be/TzhCZOILzlI) (11:15), [MoE](https://youtu.be/AgZuF7lsu-8) (23:17) | [w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf) (33 pages) | RAG; HW3 released |
| 10/27 | LLM Inference & Evaluation | [Infer & Eval](https://youtu.be/mulWMLla-AM) (17:00) | [w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf) (37 pages) | NLG Decoding, NLG Evaluation |
| 11/03 | LLM Deployment | [Deployment](https://youtu.be/4JPJkLxW84w) (22:34) | None | Issues in Pre-Trained Models; final project announced |

Two notes on ordering:

- The week numbers in the file names (w2–w6) come from an older term. Fall 2025 puts LoRA (w5) on 9/22, ahead of LLM Basics & MoE (w4) on 10/13. This post follows the Fall 2025 course page.
- 9/29 and 10/06 were holidays (Teacher's Day and Mid-Autumn Festival), and 10/20 was the midterm break, so those weeks had no recitation. The schedule lists no recitations after 11/10.

## Before you start: the videos and slides come from older terms

This is the most important context for the whole track. Every one of the ten video descriptions says "Lectured by Yen-Ting Lin 林彥廷 @ NTU CSIE", and the recording dates fall into two batches:

- **Fall 2023**: PyTorch and Debugging (2023/09/07), NLP Lifecycle (2023/09/21), Underlying Logic (2023/10/05), LoRA (2023/11/16), Inference & Evaluation (2023/11/30)
- **Fall 2024**: LLM Basics, Architecture, MoE (2024/10/09), and Deployment (2024/12/04)

The slides match. The w2 cover says "ADL 2023 Fall - Recitation 2", the w4 cover says "Sep 30, 2024", and the w5 and w6 covers are dated November 16 and 30, 2023. Fall 2025 reused these materials without re-recording.

That has three practical consequences, and each can be heard in the videos:

1. **The homework in the videos is that year's homework.** The LoRA video opens by saying "Homework 3" is instruction tuning on a 7B model, and page 4 of the slides says "Homework 3 Instruction tuning". That is the 2023 HW3, not the Fall 2025 HW3 (RAG). The NLP Lifecycle video uses an earlier ADL assignment (intent classification; slide page 27 links to the 2021 HW1) that the TA says ran for two or three years. That is not the Fall 2025 HW1 (Chinese extractive QA) either.
2. **"This week" and "the last session" follow that year's order.** The Inference & Evaluation video opens by calling itself the last recitation. That was the 2023 schedule; Fall 2025 still has Deployment after it. The LoRA video says the Transformer model architecture was covered the week before, yet in the Fall 2025 order the architecture session comes three weeks later. The LLM Basics video, recorded in 2024, says a similar session ran the year before and sends viewers to last year's video for the unchanged parts.
3. **The library versions in the demos date from 2023–2024.** Expect to fix some API calls when you follow along. The sections below point out where.

## 1. Dev Infra & Tooling: Colab, tensors, and ipdb (9/01)

This session has no slides. The material is a 30-cell [Colab notebook](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT) titled "Recitation on Development Infrastructure and PyTorch Tutorial", in four parts: Google Colab basics, the GPU environment in Colab, an introduction to PyTorch, and Python debugging tools. The two videos are [PyTorch Tutorial](https://youtu.be/zuiACAhRUzA) and [PyTorch Debugging](https://youtu.be/RYkEoCkJWeA). The TA runs the notebook from top to bottom.

### Confirm you have a GPU first

Colab gives you a CPU by default. The TA's first step is to open the Runtime menu, click "Change runtime type", and pick Python 3 with a T4 GPU. He says the free T4 is enough for this session. Then he does three things in order:

1. **Mount Google Drive** (optional). You need it only if you want to save a model to your own Drive. Colab asks for permission, and after that listing `/content/drive/MyDrive/` shows your files.
2. **`!pip show torch`**. The leading exclamation mark sends the line to the command line instead of Python. The version shown in the video is 2.0.1, and the TA says anything above 2.0 meets most homework needs.
3. **`torch.cuda.is_available()` and `!nvidia-smi`**. The first confirms that PyTorch can see the GPU. The second lists the driver version, the CUDA version, the GPU model, and the GPU memory (about 15 GB on the T4 in the video).

The TA spends the most time on step 3. A machine that has a GPU PyTorch cannot see is a common situation, and the cause is usually a CUDA version mismatch: for example, the installed PyTorch was built against CUDA 11.8 while the machine has CUDA 12. When you train on your own machine, check this every time you set up an environment. If the GPU is not visible, reinstall PyTorch or change the CUDA version.

### PyTorch manages tensors and computes gradients for you

The TA's description of PyTorch is short: it manages operations on vectors and multi-dimensional arrays, and after a chain of matrix operations it computes the gradient (the first derivative) for you. Training a deep network needs derivatives, so this is the main tool. The syntax is close to NumPy.

The demo follows the notebook:

- **Creating 1D tensors**: `torch.arange(10)` gives 0 through 9; `torch.linspace(2.0, 3.0, steps=5)` walks from 2 to 3 in 5 evenly spaced values; `torch.rand` samples from a uniform distribution on 0 to 1 and `torch.randn` from a normal distribution; `torch.ones`, `torch.zeros`; building from a Python list; `clone()` to copy.
- **Whether operations are recorded**: PyTorch records the operations applied to a tensor so it can compute gradients later. Operations inside `with torch.no_grad():` are not recorded, so no gradient can come out of them. In exchange they run faster and use less memory. The TA says this is normally used at inference, since inference does no gradient descent. You can also set `dtype` and `requires_grad` when you create a tensor.
- **Multi-dimensional tensors**: `torch.zeros(3, 4)`, `torch.full((3, 4), 7)`, `torch.rand(3, 4)`; when you want a new tensor shaped like an existing one, use `zeros_like`, `ones_like`, or `full_like`.
- **Converting from NumPy**: data loaded by tools such as pandas often arrives as NumPy arrays, which you convert with `torch.tensor(ndarray)`. The TA warns that a NumPy array cannot be combined directly with a tensor because the two are incompatible underneath.
- **Shape operations**: `torch.cat` to concatenate, `view` to reshape, `transpose` and `permute` to swap axes, `unsqueeze` and `squeeze` to add or remove a dimension of length 1.

**Example (shown by the TA in the video).** Setup: `x` is a 3×4 tensor with 12 elements. `x.view(2, 6)` reshapes it to 2×6. If you are unsure what the first dimension should be, write `x.view(-1, 6)` and PyTorch fills in 2 from 12 ÷ 6. If you write `x.view(-1, 5)`, 12 divided by 5 leaves a remainder and you get an error. What it means: `-1` only says "work this out for me", and it cannot help when the element count does not fit.

`transpose` and `permute` are easy to confuse, so the TA uses a 2×3×4 tensor. `transpose(0, 1)` names the two axes to swap and gives 3×2×4. `permute(1, 0, 2)` spells out the whole new axis order and also gives 3×2×4. They do the same job with different syntax. With many axes, `permute` can move several at once and reads better.

The TA closes this part by explaining why it is worth running these basics. You can ask ChatGPT when you get stuck, but you need to know what PyTorch offers before you can pick the right keywords and judge whether the answer you get back is made up.

### Debugging with ipdb: a device mismatch

The second video starts by sorting errors, and the notebook has the same list. Paste syntax errors, code and message together, into ChatGPT. Use ipdb for runtime errors and tensor errors (wrong shapes, tensors on different devices). GPU errors such as out-of-memory wait for the next recitation. ipdb is a friendlier version of Python's built-in debugger pdb. Colab does not ship it, so run `!pip install ipdb` first.

The TA says three commands cover most use: `c` (continue, run until the next breakpoint), `n` (next, run the next line), and `q` (quit). Use `p` to print a variable. The notebook also lists `l` (list the source) and `s` (step into a function).

The notebook lists five ways to start it. The TA recommends the second and the fourth most:

| # | How | The TA's comment |
|---|---|---|
| 1 | `python -m ipdb your_script.py` | Stops at the first line and waits for a command |
| 2 | `python -m ipdb -c continue your_script.py` | Runs normally and stops only at a breakpoint or an error |
| 3 | `python -m ipdb your_script.py --your-arg value` | The script's own arguments go at the end as usual |
| 4 | `import ipdb` in the code, then `ipdb.set_trace()` on the line where you want to stop | Stops there so you can print the variables above |
| 5 | `with ipdb.launch_ipdb_on_exception(): main()` | Starts ipdb only when `main()` raises |

Next comes a complete training example. The data is synthetic: 1000 samples with 10 features each, and a label built as "3 times the feature sum, plus 2, plus some noise". The `DataLoader` draws 32 random samples at a time. The model `SimpleMLP` has two linear layers, the loss is mean squared error, the optimizer is Adam, and training runs for 10 epochs. The TA uses the code to read the training loop aloud: the model takes a batch and produces predictions, the loss compares them with the answers, the optimizer state is cleared, the loss is backpropagated, and the optimizer updates the parameters. You define only the forward pass; PyTorch handles the backward pass.

The code runs fast and the loss goes down. But the TA then prints the device the model's parameters sit on and finds it is the CPU, even though this runtime has a T4. So he copies the code and adds `model = model.to(device)`, where `device` is `cuda:0` (plain `cuda` is enough with one GPU; with several, the number after the colon picks one).

**Example (shown by the TA in the video).** Setup: run the training loop after moving the model to the GPU. Result: a RuntimeError saying Expected all tensors to be on the same device, with one on `cuda:0` and one on `cpu`. The reasoning goes like this:

1. Add `ipdb.set_trace()` just before the failing line and rerun. The program stops there.
2. Use `p` to print the shape of `batch_X`. The shape is fine.
3. Print the device of `batch_X`. It is the CPU.
4. Print the model's device. It is GPU 0. That is the problem: the model moved and the data did not.
5. Press `q` to leave (pressing `c` continues and raises the same error again).
6. Remove the breakpoint and call `.to(device)` on `batch_X` too. The TA adds that the label `batch_y` has to move as well.

After the fix, training converges normally. What it means: `.to(device)` has to be applied to the model, the inputs, and the labels. Miss one and you get this message.

The TA ends by explaining why he recommends the second way of starting ipdb. Before an error happens, you do not know where to print what. If you run with `python -m ipdb -c continue`, the program stops at the moment it fails, and you can inspect tensor shapes and devices on the spot without rerunning. Loading a model and its weights often takes thirty seconds to a minute, so every rerun costs time.

**Extra exercise (made up for this post).** The same notebook example hides a problem that raises no error. Setup: the model's last layer is `nn.Linear(5, 1)`, so the output has shape `(32, 1)`; the label `y` comes from `X.sum(dim=1)` and has shape `(32,)`. Reasoning: when `nn.MSELoss` gets two tensors of different shapes it broadcasts them first, and `(32, 1)` against `(32,)` expands to `(32, 32)`, which subtracts every label from every prediction. Result: the code runs, PyTorch prints only a warning, and the loss value is not the one you wanted. How to check: set a breakpoint before `loss = criterion(outputs, batch_y)`, run `p outputs.shape` and `p batch_y.shape`, then change the output to `outputs.squeeze(-1)`. What it means: a shape error does not always stop the program, so check both shape and device when debugging; the TA's demo also prints the shape first and the device second.

If you have never written PyTorch, do this session before or alongside [Lecture 2: neural networks and backpropagation](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en).

## 2. The life of an NLP project: data → model → demo (9/08)

[w2-ProjLife.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf) opens by naming two goals: the workflow from data through model development to a demo, and the common tools and libraries. The deck keeps returning to a three-box diagram: data → model → demo.

At the start of the [video](https://youtu.be/anK1_PK464k) the TA explains why the topic matters. Most people will not become researchers. They will be engineers working on projects, and most will run into a text problem. In industry you often have no data, no model, and no framework, and you build all of it yourself. He is clear about where the weight falls among the three boxes: success or failure is decided by the data at the front, and the value sits in the demo at the end. Without a demo or an API, nothing is live and nobody can use it, which in industry counts as not having done it. After the demo you repeat the loop: you see a problem in the model or the demo and go back to change the data or the training. He also notes that the course homework does not require a demo while the final project might, which is why he stresses it here.

### Data: collect, clean, label

**Collecting.** The slides list web crawling, customer data, writing it yourself, and GPT-4. The TA says crawling is the most common source and that being good at it is a real advantage. For GPT-4 the recipe is to prepare 10 to 100 good examples that cover your use case and ask it to paraphrase them. For a few dozen to a few hundred New Taiwan dollars you get thousands to tens of thousands of samples, which one person can afford. Page 9 of the slides cites two data augmentation papers, and the TA recommends the second (in-context data augmentation for intent detection) because it deals with classification.

**Cleaning.** The TA stresses that "clean" has no fixed definition. It depends on the final use. Take a batch of scam text messages: if you are building a scam detector, they are the data you want; if you are doing sentiment analysis on users, they are dirty data to remove.

**Labeling.** For yourself or a small team, the open-source labeling platform doccano works (slide page 11). The TA says it handles even complex span annotation, looks good, and can be hosted on your own machine. For scale in the millions he points to Scale AI and suggests studying how that company works if you want to go deep in this area.

### Model: sort the problem into one of four tasks first

The TA says only one thing has to be clear in this part: what format the input has and what format the output has. NLP people look at a problem and sort it into one of four shapes (slide pages 16–21):

| Task | Input | Output | Examples from the slides and video |
|---|---|---|---|
| Classify a whole sentence | One sentence | One class | Sentiment (positive, negative, neutral), spam detection, intent detection |
| Classify each word in a sentence | One sentence | One label per word; ten words give ten labels | Part of speech, named entities (people, places, times, or drug names in medicine) |
| Generate text | Text | Text | Dialogue, translation, summarization, fill in the blank |
| Extract an answer from text | A question plus a context | A span of the context | Context "The capital of France is Paris", question "What is the capital?", answer "Paris" |

The talk adds three details that are not on the slides:

- In word classification, words you do not care about still need a label. Give them a "none of the classes" label.
- A fill-in-the-blank slot can sit at the start or the middle of a sentence. The TA says this was the usual approach with BERT and RoBERTa before decoder models took over.
- The fourth task fits cases where the model must not use its own knowledge and may only answer from the text you provide. "What is the capital?" alone names no country, so the model cannot answer; with a context, the answer is confined to that context.

### Demo: FastAPI and Gradio

The TA uses [twllm.com](http://twllm.com), the lab's demo site for its Traditional Chinese model, to show what a demo is worth. If you publish only a model or a dataset, few people have a GPU to load it, and those who do may not bother. Give people a page they can click into and they will actually try it.

Two libraries do the job. FastAPI is the common choice for the backend API because it generates part of the documentation for you. Gradio is the frontend, and it needs only Python, no JavaScript. The TA also names Gradio's weakness: it is slow, so a real product needs something else, but it is fine for a demo.

### Splitting the data: who may look, and when

This is pages 31–38 of the slides and the part the TA covers most carefully. He uses an exam analogy: you do not want a model that aces the mock exam and then meets different subjects on the real one.

| Set | During training | Used for | Size |
|---|---|---|---|
| Training | May look | Learning | The most |
| Validation | May not look | Checking during training | About 10–30% |
| Test | Must never look | Checking after training | About 10–30% |

"May not look" for the validation set means the model cannot learn from it, but it can run inference on it. At 10% or 20% of the way through training you pull the model out and run the validation set, and since you have the answers you can mark it. The test set waits until training has fully finished, and its purpose is to estimate performance on outside data. The TA gives a pair of numbers: 80% on validation and only 60% on test means performance in production will be closer to 60%. Once the model has seen the test set, the logic of the whole procedure breaks and you have to go collect more data, which costs more effort.

The TA adds a remark that is not on the slides: training large language models often does not follow this framework. There is so much training data that each sample is seen only once, the validation set is too small, and a question can have many reasonable answers while the validation set holds only one, so it cannot reflect the model's performance well. He says this only matters when the model is very large.

### Hands-on: intent classification from the old Homework 1

The hands-on part uses data from an earlier ADL Homework 1 (slide page 27 links to `data/intent` in the 2021 ADL HW1 repository on GitHub). That homework had both a sentence-classification and a word-classification task, and this session does only the first. The data is customer-service utterances with the fields `text` and `intent`. An English sentence asking someone to book a flight, for example, belongs to the flight-booking class, and the TA says it is a bit like talking to Siri. Slide page 43 gives another example, "play a Hebe Tien song" mapped to "play music". The task is called intent detection.

The TA suggests uploading any dataset without sensitive content to Hugging Face. It versions the data with Git, so you do not have to remember where files live. Sensitive data can be set to private, also free of charge. After upload, the web page shows the fields, the row count, and the disk size, and lets you browse each split.

The companion [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ) (68 cells) is adapted from Hugging Face's "Fine-tuning a model on a text classification task" example. Here is the order the TA runs it in, with his reminders along the way:

1. **Confirm the runtime has a GPU.** On Colab you do not deal with NVIDIA driver and CUDA versions. On your own machine you install them yourself, which the TA says is still a bit of a chore, and he suggests managing the environment with conda.
2. **`!pip install "transformers[torch]" datasets`.** Transformers only defines model architectures, and you tell it to run on PyTorch underneath.
3. **`notebook_login()` and `!apt install git-lfs`.** Files vanish when Colab closes, so the model is pushed to Hugging Face for storage, which needs a token. Model files are large, and Git needs LFS to handle them.
4. **Check the Transformers version.** The notebook says at least 4.11.0; at recording time it was up to 4.33.
5. **`model_checkpoint = "distilbert-base-uncased"`, `batch_size = 16`.** A small distilled model keeps the demo fast. Batch size is how many samples the model processes in parallel, and it depends on GPU memory. The TA's advice is to fill the memory: if 16 uses half, go to 32, and search like a binary search.
6. **`load_dataset("yentinglin/ntu_adl_recitation")`.** Clicking "Use in dataset library" on the dataset page gives you this line to copy. The notebook then renames the `intent` column to `label` and encodes it as a class label. Printing the dataset shows three splits and their fields; the training set has 15,000 rows.
7. **Look at a few random rows.** Checking an account balance, redeeming points, freezing an account. The TA says this step is well worth doing, because many people who did this homework in the past did not actually know what the inputs and outputs looked like.
8. **Load the tokenizer: `AutoTokenizer.from_pretrained(model_checkpoint, use_fast=True)`.** The model consumes integers, each standing for a token. The TA compares it to Chinese radicals and input methods: some characters are a unit by themselves and some split into several pieces. The tokenizer must be the model's own, just as you cannot type into a Chinese interface with a Japanese input method.
9. **`dataset.map(preprocess_function, batched=True)`.** Applies preprocessing to every split in one go. With a lot of data it can take a minute or two.
10. **`AutoModelForSequenceClassification` plus `Trainer`.** The settings are a learning rate of 2e-5, 5 epochs, evaluation once per epoch, and best-model selection by accuracy, plus weight decay (which the TA explains as an L2 penalty).
11. **`trainer.train()`, `trainer.evaluate()`, `trainer.push_to_hub()`.**
12. **The Gradio demo in the last cell.**

The TA stops to explain four things.

**The first token is always 101.** Feed a sentence to the tokenizer and you get a list of integers. Replace the whole sentence and try again: the later numbers change, and the first one is still 101. The TA explains that most models add a special start token at the front, which marks where an input begins. The other output, `attention_mask`, makes more sense once you know the Transformer architecture. For now it is enough to know that text turns into a list of integers.

**The number of classes is part of the model's architecture.** A pretrained model does not know how many classes you want. You tell it when loading so its last layer has the right output dimension. The TA uses 77 classes as the example: if the client later asks for 76 or 78, the model has to be retrained, because the parameters of the output layer change entirely. Also, loading a model first downloads its files into a cache folder under your home directory. The TA warns that loading many different models can cause trouble (the transcript is unclear here, and all that comes through is that he mentions being unable to log in to the machine; presumably the cache fills the disk).

**Why not write your own training loop.** `Trainer` runs the forward and backward passes, finishes the number of epochs you asked for, and saves checkpoints. The TA says that apart from practice and learning, nobody rewrites a trainer now. One you write yourself runs on one GPU at best, and scaling to 8 or more involves too many engineering problems. When you need a change, change just that piece of the computation. He also reminds students that if a homework says to write your own loop you still have to, and that lifting `Trainer`'s code out wholesale usually does not work.

**Read the progress bar to tell whether the GPU is in use.** Once training starts, the bar shows 4690 steps in total. The TA says this is the number of parameter updates, not the number of samples, and shows how to read updates per second and the current epoch. The use of these numbers: if the time estimate suddenly becomes 24 hours, you are most likely not using the GPU at all. Much code raises no error when the GPU is unused and quietly computes on the CPU. So you need a feel for how many samples per second this project should handle, or you will wait for nothing.

**Example (made up for this post, with numbers from the video).** Setup: 15,000 training rows, batch size 16, 5 epochs. Reasoning: one epoch takes 15,000 ÷ 16 = 937.5 steps, and the final partial batch counts as a step, so 938 steps; 5 epochs make 938 × 5 = 4,690 steps. Result: this matches the 4690 on the progress bar in the video. What it means: you can work out the bar's denominator before you start. When your number and the screen disagree by a lot, the batch size or the row count is usually not what you thought you set.

After training, the `evaluate` score in the demo is low, and the TA says that is because he interrupted the run early and it trained too little. `push_to_hub` pushes the model, the tokenizer, and an auto-generated model card to a repository on Hugging Face. The "Use in Transformers" button on the model page offers two ways to load it. `pipeline` suits inference, since it wraps "text to tokens, model computation, output back to labels" into one pipeline. Loading the model directly suits further training or cases where you need control over details. The TA suggests pushing your homework models there too and writing your own model card, which is easier to manage than keeping them on the department workstation.

The Gradio demo is a few lines. First build a classifier with `pipeline`, giving the task (text classification here), the model name, and the device; `device=-1` means CPU and `device=0` means GPU 0. Then `gr.Interface` takes the function that handles the input, the input component (a text box), the output, and examples. The TA strongly recommends putting example sentences in a demo, because many visitors arrive with a blank mind and click whatever they see. He also explains that to serve for real you put this code in a separate Python script so the URL can be shared; inside Colab it is only a demonstration.

The notebook was written for older library versions, so a few things may need fixing today:

- `load_metric` from `datasets`; newer versions use the separate `evaluate` package.
- `evaluation_strategy` in `TrainingArguments`; newer versions call it `eval_strategy`.
- In `compute_metrics`, `predictions = predictions[:, 0]` is the original example's branch for a regression task (STS-B). For classification change it to `predictions = np.argmax(predictions, axis=1)` (remember `import numpy as np`). Otherwise what gets compared with the labels is the logit of class 0, the accuracy means nothing, and best-model selection by accuracy picks the wrong checkpoint. This item comes from this post reading the code; the TA does not mention it. This post did not run the whole notebook and only checked the calculation on simulated data: with 2,000 items, 77 classes, and a model that is in fact about ninety percent accurate, accuracy by argmax comes out at 0.925, and by `predictions[:, 0]` it is 0.
- The final Gradio cell is only a template: the `pipeline` task is written as `'ner'`, the model name is a placeholder, and `fn=...` is yours to fill in. Going by the video, the task here should be text classification. That line is also written as `pipeline(task='ner', '你的模型', device=0)`, a positional argument after a keyword argument, which Python rejects as a syntax error (compiling that line on its own gives "positional argument follows keyword argument"); pass the model name as `model='…'`.

The TA's summary: model architecture is not the point. The point is to get the data flow built, train a model once, make a demo, and then iterate quickly. There is not much room to improve the model, so doing the data well and presenting the result well is where effort pays off most. He says homework is probably the same.

## 3. The underlying logic of NLP projects: data prep for four task types (9/15)

The cover of [w3-UnderlyLogic.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf) reads "應用深度學習 - 實作三" (the English cover on page 2 says "ADL - Recitation 3"). Its goals are "how to prepare data, train, and predict for the four main tasks" and "using the Hugging Face ecosystem". In the [video](https://youtu.be/255ZzsTTHoU) the TA says any NLP project breaks down into these four tasks, or into a pipeline of several of them. Sentence classification was done last time, so this session covers the other three, each in the same order: what the data looks like, which ready-made script trains it, and how to build a demo. The tools for the three steps are Hugging Face's Datasets, Transformers, and Spaces.

| Task | Slide pages | Demo dataset | Training script and model |
|---|---|---|---|
| Classify a whole sentence | Review | Last session's intent data | Last session's Colab |
| Classify each word | 10–31 | CoNLL-2003 | `run_ner.py`, `bert-base-uncased` |
| Text generation (summarization) | 33–36 | CNN/DailyMail | `run_summarization.py`, `t5-small` |
| Extractive QA | 38–42 | SQuAD | `run_qa.py`, `bert-base-uncased` |

### Word classification: BIO tagging

The example on slide page 10 is a news sentence with four entity types marked: organization (WeWork), person (Adam Neumann), location, and monetary value. The task is called named entity recognition (NER). The TA says word classification is good for more than entities. It can find subjects, verbs, and objects, or decide which punctuation mark should follow which word.

He uses his own internship to show why the task is practical: first use word classification to pull out drug names and receptor names, then attach a sentence-classification model to decide the relation between two drugs or between a drug and a receptor. Stacking tasks gives you quite complex systems.

Data lives at [Hugging Face Datasets](https://huggingface.co/datasets); filter by the Token Classification task on the left. The TA picks CoNLL-2003, which defined a classic format (slide page 17):

- `tokens`: the sentence split into words, for example The, European, Commission, said.
- `ner_tags`: one integer per word. The first four in that sentence are 0, 3, 4, 0.

Slide page 18 gives the meaning of the integers:

| ID | Tag | Meaning |
|---|---|---|
| 0 | O | Not part of any entity |
| 1, 2 | B-PER, I-PER | Beginning of a person, inside a person |
| 3, 4 | B-ORG, I-ORG | Beginning of, inside an organization |
| 5, 6 | B-LOC, I-LOC | Beginning of, inside a location |
| 7, 8 | B-MISC, I-MISC | Beginning of, inside a miscellaneous entity |

Why does each entity type need both a B and an I tag? The TA goes back to Adam Neumann. The name has two words. If both were tagged "person", you could not tell one person from two. So the first word gets B-PER (beginning) and the second gets I-PER (inside). If the second were also B-PER, it would mean two different people. The next word that is not part of the name gets O. This scheme is called BIO tagging. The order of the IDs is arbitrary. What matters is the B versus I distinction, which decoding relies on to tell which words belong together.

**Example (slide pages 17–19).** Setup: the sentence starts with The European Commission said, tagged 0, 3, 4, 0. Reasoning: European is 3, which is B-ORG; Commission is 4, which is I-ORG and follows a B-ORG, so the two words form one organization; said goes back to 0. Later in the sentence, German and British are tagged 7 (B-MISC) with no I after them, so each is a one-word entity. What it means: read tags in sequence. A B starts an entity, and every consecutive I after it belongs to that entity.

**Example (made up for this post).** Setup: your project cares about three entity types: drug name, dose, and symptom. Question: how many classes does the classifier output need? Reasoning: the TA's rule is that n entity types need 2n + 1 classes, one B and one I for each type plus one O. Result: 2 × 3 + 1 = 7 classes. CoNLL-2003 has 4 entity types and therefore 9 classes, matching IDs 0 through 8 in the table above. What it means: deciding how many entity types to label also fixes the size of the model's output layer.

**How to train.** The TA says this task usually uses encoder models (BERT, or RNNs and LSTMs before it). The aim of the session is a strong baseline you can run right away; getting the best score still means reading papers and studying the data for clues. Go to the Hugging Face Transformers repository on GitHub and open `examples/pytorch/token-classification` (slide page 24), which contains a ready-to-run `run_ner.py`. The command on slide page 25 is:

```bash
python run_ner.py \
  --model_name_or_path bert-base-uncased \
  --dataset_name conll2003 \
  --output_dir /tmp/test-ner \
  --do_train \
  --do_eval
```

The dataset name can be copied with one click on the dataset page and pasted after `--dataset_name`. Details such as how long to train depend on the arguments the script exposes, and `python run_ner.py -h` prints all of them. The TA strongly recommends reading the whole argument list once. Every argument has a purpose, and one day you will need to tune one of them; if you already know it exists, you change an argument instead of implementing something yourself. His example is gradient accumulation, which is not easy to write by hand and is just a `gradient_accumulation_steps` argument in the script.

**How to build the demo.** Transformers' `pipeline` has a task called `ner`. It encodes the text, sends it through the model, merges the BIO tags the model outputs, and tells you directly which words form which entity. For the model name, use the ID you pushed to Hugging Face as taught last session, wrap it in `gr.Interface`, and finish with `demo.launch()`.

Hosting it yourself means dealing with network and firewall settings, so the TA introduces Hugging Face Spaces (slide pages 27–31). Click New Space in your profile menu, name it, choose Gradio as the SDK, create a new file on the Files tab, paste the script, and commit. It builds and goes live automatically. It can be public or private. GPUs are a paid option, and the TA says the free CPU is enough for a first test.

### Text generation: summarization

Summarization turns long text into short text. The TA picks CNN/DailyMail, whose fields are `article` (the source text) and `highlights` (the summary) (slide page 34); the TA adds aloud that there is also an `id`.

He gives a time-saving tip here. When you collect your own data to train a summarizer, name the columns exactly as this dataset does, `article` for the source and `highlights` for the summary, and the ready-made script will give you far fewer problems.

The command on slide page 36:

```bash
python examples/pytorch/summarization/run_summarization.py \
    --model_name_or_path t5-small \
    --do_train \
    --do_eval \
    --dataset_name cnn_dailymail \
    --dataset_config "3.0.0" \
    --source_prefix "summarize: " \
    --output_dir /tmp/tst-summarization \
    --per_device_train_batch_size=4 \
    --per_device_eval_batch_size=4 \
    --overwrite_output_dir \
    --predict_with_generate
```

The TA explains two of the arguments:

- `--source_prefix "summarize: "`: T5 was pretrained on many tasks at once, and putting this hint in front of the input helps bring out the summarization it learned.
- `--per_device_train_batch_size=4`: the device in `per_device` is one GPU. With 8 GPUs, the actual batch size is 8 × 4 = 32.

This demo uses an encoder-decoder architecture. The TA says that doing it with the causal language models popular today needs a different script, which Hugging Face also provides.

### Extractive QA: the answer comes with a start position

The TA introduces the motivation this way: models often make things up, and the extreme response is to allow them only to extract the answer from a given text. The classic dataset is Stanford's SQuAD, with the fields `context`, `question`, and `answers`.

Besides the answer `text`, `answers` contains `answer_start`. The example on slide page 40 is `"text": ["Saint Bernadette Soubirous"], "answer_start": [515]`, meaning the answer starts at character 515 of the context. No end position is given, because the start plus the answer length gives it.

Why is the answer text alone not enough? The TA uses a self-introduction as the example. The context is "Hello everyone, my name is Yen-Ting Lin. Yen-Ting Lin is a PhD student at NTU." The question is "Who is a PhD student at NTU?" The same name appears twice in the context, and the occurrence that answers this question is the second. With only the text, the program has to search for a match and may find several. With the start position there is no ambiguity.

The command on slide page 42:

```bash
python run_qa.py \
  --model_name_or_path bert-base-uncased \
  --dataset_name squad \
  --do_train \
  --do_eval \
  --per_device_train_batch_size 12 \
  --learning_rate 3e-5 \
  --num_train_epochs 2 \
  --max_seq_length 384 \
  --doc_stride 128 \
  --output_dir /tmp/debug_squad/
```

The TA singles out the two length arguments. `--max_seq_length 384` is the maximum length fed to the model at once, in tokens. When a context is longer, the script cuts it into several pieces with a sliding window. Neighboring pieces are not fully separate: `--doc_stride 128` sets how much two neighboring pieces overlap, and 0 means no overlap at all.

**Example (made up for this post, simplified).** Setup: a context of 600 tokens, a window of 384, and an overlap of 128 between neighboring windows. To keep the arithmetic simple, ignore the positions taken by the question and the special tokens. Reasoning: each window starts 384 − 128 = 256 tokens after the previous one. The first window covers tokens 0 to 383. The second starts at token 256 and reaches token 639, which is already past 600. Result: 2 pieces, with tokens 256 to 383 appearing in both. What it means: if the answer happens to sit around token 384, a split without overlap cuts it in half and neither piece contains the full answer. With overlap, at least one piece contains all of it.

This part is especially useful for Fall 2025 readers. The span selection in [HW1: Chinese extractive QA](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en) is exactly this task shape. Watch this session first, then read the HW1 spec.

The TA's closing remark: for each of the four tasks he has shown where to find the data format, which script trains it, and how to connect `pipeline` and Spaces for a demo, and every script can be cloned and run tonight. The next level is to feed one task's output into another task's input and build, step by step, the kind of system industry actually needs.

## 4. LLM LoRA Training: tuning a model that is too big (9/22)

[w5-LoRA.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf) draws LLM development as three stages, pretraining → instruction tuning → learning from feedback, and places LoRA/QLoRA at the instruction-tuning stage. This session is a live recording from 2023, and the TA opens by asking the students whether they have started that year's Homework 3. The whole session follows one thread: memory.

### First ask whether it will run

The TA says the biggest question in instruction tuning is whether it will run at all. Most people cannot get an A100 or H100. On consumer-grade cards you have to quantize, or change the optimizer and other settings.

Slide pages 5–6 introduce the Hugging Face Space "[Can you run it? LLM version](https://huggingface.co/spaces/Vokturz/can-it-run-llm)". Enter a model name and pick a GPU, and it works out how much memory and how many cards the model needs for inference, full training, and LoRA fine-tuning in float32, float16/bfloat16, int8, and int4. The screenshot in the slides shows Mistral 7B on a 24 GB A10. The TA says the tool saves you the arithmetic and is worth checking before you buy a card.

### Why low rank is enough

The motivation on slide page 7 comes from a paper on the intrinsic dimensionality of language models: the intrinsic dimension of a large language model is in fact low, which explains why a small amount of data can fine-tune it effectively.

The TA adds a caution that is not on the slides. The rank meant here is conceptual. It is not the rank you would get by taking some d×d weight matrix in the model and running row operations or an SVD on it. The idea it carries is that fine-tuning really needs to change only a few directions, so training a small set of parameters can be enough.

### LoRA itself

The TA first says where LoRA goes. Each Transformer layer has normalization, self-attention, and a feed-forward network, and LoRA is usually added only to self-attention. Self-attention has four projection matrices, W_q, W_k, W_v, and the output W_o, each projecting a vector to the same dimension.

Slide page 11 is a frame from an animation. The same input takes two paths. On the left are the original pretrained weights, untouched. On the right are two new small matrices, multiplied one after the other. The two results are added to give the output. Training updates only the right side.

The original weight W is d×d. LoRA adds two matrices, A (d×r) and B (r×d), with r much smaller than d. Slide page 12 says r is usually between 1 and 32.

**Example (the TA's numbers from the video; the arithmetic is completed here).** Setup: d = 512, r = 4. Reasoning: the original matrix has 512 × 512 = 262,144 parameters; LoRA's two matrices have 512 × 4 × 2 = 4,096 in total. Result: the trainable parameters are 4,096 ÷ 262,144 ≈ 1.56% of the original. What it means: that is the ratio for one matrix. In a real model LoRA sits on only a few matrices and every other parameter is frozen, which is why the TA says the program often prints that the trainable parameters are a tiny share of the original model. Seeing that line tells you the LoRA setup took effect.

Slide page 13 lists two benefits: less memory (no gradients for the pretrained weights) and plug-and-play LoRA weights. The TA says more about the second. LoRA weights are small, so loading and unloading them is quick, and you can attach several at once. He says the image-generation community uses this the most: one LoRA learns one drawing style, another learns a second style, and attaching both gives a blend.

### Which matrices, and what rank

Slide page 14 quotes Table 5 of the LoRA paper, comparing options at the same number of trainable parameters (18M):

| Matrices with LoRA | Rank | WikiSQL | MultiNLI |
|---|---|---|---|
| W_q only | 8 | 70.4 | 91.0 |
| W_v only | 8 | 73.0 | 91.0 |
| W_q and W_k | 4 | 71.4 | 91.3 |
| W_q and W_v | 4 | 73.7 | 91.3 |
| All four | 2 | 73.7 | 91.7 |

With the parameter count fixed, the more matrices you adapt, the lower the rank each can have. The TA's conclusion is that people now adapt at least W_q and W_v, with rank 4. Going higher (8, 64) brings smaller and smaller gains. He advises against 1 or 2, because at such a low rank the GPU is doing little more than vector products and its strength at matrix multiplication goes unused.

Slide page 16 quotes Table 4 of the LoRA paper, which compares LoRA on GPT-3 with full fine-tuning, BitFit, two prefix-style methods (PreEmbed and PreLayer), and adapters. The PEFT methods the TA names aloud are adapters, prefix tuning, prompt tuning, and tuning only the first few layers; the last two are not in the table on this page. The TA's view: the others may help in some cases, but LoRA is simpler and performs well enough, so just use LoRA.

### LoRA's limit, and floating-point formats

Slide page 18 states LoRA's limit: the pretrained weights themselves still take a lot of memory. The TA says training with LoRA alone still often runs out of memory, and the problem is not the two small matrices on the right but the big matrix on the left. It needs no gradients, yet it still has to be loaded for the computation. Models are routinely 13B, 34B, or 70B, and even inference is hard.

Before QLoRA, the TA covers floating-point formats (slide page 19, a figure from NVIDIA):

| Format | Bits for range | Bits for precision |
|---|---|---|
| FP32 | 8 | 23 |
| FP16 | 5 | 10 |
| BFLOAT16 | 8 | 7 |

His explanation: the forward pass needs precision and the backward pass needs range. FP16 has only 5 bits of range, so training with it often overflows or underflows, and the loss shows sudden spikes. He cites a 175-billion-parameter model from Meta whose training kept hitting such spikes, with FP16 as the cause. BFLOAT16 keeps the same 8 range bits as FP32 and gives up precision to pay for it, which is why the TA calls it the industry standard for training today.

Slide page 20 goes further down to two kinds of FP8: E4M3 (4 exponent bits, 3 mantissa bits) and E5M2. The TA says the one with more range bits is used for the backward pass and the one with more precision bits for the forward pass, and that scaling techniques are needed alongside.

### QLoRA

QLoRA stores the frozen pretrained weights on the left in 4 bits, in a format the paper defines called 4-bit NormalFloat. The two LoRA matrices on the right stay at normal precision (bfloat16, the TA says). The weights sit in memory as 4 bits, and when data actually flows in for computation they are restored to 16 bits, a step called dequantization.

Slide page 25 quotes the quantization formula from the paper, using FP32 to Int8 as the example. Find the largest absolute value in the tensor, divide 127 by it to get a scaling constant c, multiply every number by c, and round. To restore, divide by c. The TA's example: if the largest absolute value is 2000 (originally −2000), it is squeezed down to 127.

**Example (made up for this post).** Setup: the weights are [0.5, −1.0, 2.0], to be quantized to integers in the range −127 to 127. Reasoning: the largest absolute value is 2.0, so c = 127 ÷ 2.0 = 63.5. Multiplying by c gives [31.75, −63.5, 127], which rounds to [32, −64, 127]. Dividing by 63.5 restores about [0.504, −1.008, 2.0]. Result: the largest number comes back exactly and the others are off by less than 0.01. What it means: if a 200 slips into this group, c becomes 0.635, the first three numbers shrink to 0.3, −0.6, and 1.3, and they round to 0, −1, and 1. Almost all of their original differences are gone.

That is exactly the block-wise point the TA stresses. Quantization does not take one maximum over the whole tensor. It cuts the tensor into small blocks and finds a maximum for each. An extreme value then affects only its own block.

The paper has two more design choices, and the TA says a little about each:

- **Double quantization**: the scaling constants c are 32-bit, and many of them take space too, so c is quantized once more. Restoring therefore takes two steps.
- **Paged optimizer**: when memory runs short, the optimizer state is swapped out to CPU memory for a while. The TA's advice is to avoid it if you can, because it is very slow.

On results, slide page 27 quotes Table 3 of the QLoRA paper, where the three options score close together: of the six columns, full fine-tuning leads by about one point only on T5-780M and T5-11B, and LoRA is slightly ahead on the rest; LoRA and 4-bit QLoRA with double quantization are nearly level. The table's own caption says QLoRA replicates 16-bit LoRA and full fine-tuning. What the TA says aloud is that full fine-tuning is of course best, and that if you cannot do it you should go straight to QLoRA (the transcript hears "LoRA" here; QLoRA is read from the context).

**Example (made up for this post).** Setup: a 7B model (7 billion parameters). Reasoning: at 16 bits each parameter takes 2 bytes, so the weights alone need 7 billion × 2 = 14 GB; at 4 bits each takes 0.5 byte, which is 3.5 GB. Result: a factor of four. What it means: this counts only the weights. Training also holds activations, gradients, and optimizer state, so look up the real requirement with the tool above. But it shows why the memory problem LoRA cannot fix is fixed by quantizing the frozen weights.

### How to use it: one config file

The last three slide pages (28–30) show the practical route with the open-source tool [Axolotl](https://github.com/OpenAccess-AI-Collective/axolotl). The TA says the process needs almost no code: put the data in the required format, install the package, and write one config file. Page 30 shows its sample config `examples/llama-2/qlora.yml`, and these are the lines the TA points to:

```yaml
load_in_4bit: true
adapter: qlora
lora_r: 32
lora_alpha: 16
lora_dropout: 0.05
lora_target_modules:
```

`load_in_4bit` turns on 4-bit loading; `lora_r` is the rank discussed above; `lora_alpha` is the strength with which the LoRA path is added back; `lora_dropout` controls dropout; `lora_target_modules` names which of Q, K, and V get LoRA. Replace the `datasets` block with your own data; the tool supports several formats. The command that starts training is:

```bash
accelerate launch -m axolotl.cli.train examples/llama-2/qlora.yml
```

The TA adds that anyone who wants more control over the lower layers can still write the training code with Hugging Face's libraries.

On timing, this session shares a week with the LLM Adaptation lecture (7.5) and with the HW2 release. The Fall 2025 HW2 is titled "LLM Tuning and Prompt Tuning for Classical Chinese Translation". The spec is not public, but the Fall 2025 TAs say in the HW2 briefing video that the assignment fine-tunes a model with LoRA and QLoRA, which matches this session's topic. The recording is the 2023 version, and the data format and training script it mentions belong to that year's homework, so details may not match the current assignment. For the lecture-side theory of LoRA, see the second half of [Lecture 7](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en).

## 5. LLM basics, Transformer architecture, and MoE (10/13)

[w4-LLMBasicsMOE.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf) goes with three videos recorded in 2024 and has three parts.

### LLM Basics: how to measure scale and how to spend it

The [video](https://youtu.be/BBw-ki4_06o) covers slide pages 2–14. The TA first reviews the three stages of LLM development, and slide page 3 attaches a word to each: scale for pretraining, adaptation for instruction tuning, and alignment for learning from feedback. He describes the third stage like this: the model keeps generating, a scoring model (the reward model) keeps scoring, and training raises the probability of good responses and lowers that of bad ones, over and over. This session covers only scale, the first stage.

**What a scaling law is for in practice.** The figure on slide page 4 comes from the GPT-4 technical report. The horizontal axis is training compute, normalized so that GPT-4 is 1, with each tick to the left 100 times smaller. The vertical axis is performance on a set of code the model has never seen, where lower is better. The gray dots are small models using several orders of magnitude less compute. The TA says the point of the figure is this: training the gray dots is cheap, and if their trend predicts the most expensive point accurately, you can try out different data, hyperparameters, and architectures on small models, see which setup predicts the best outcome, and only then train the largest model with that setup.

Slide page 5 places the lab's Taiwan-LLM on the same figure. The TA says their own experience is that making the model bigger and the data larger, while not changing much else, improves performance a lot. The condition is that the added data keeps the same standard; poor data must not be poured in with it.

**Emergent abilities.** Slide page 6 defines them: an ability is emergent if it is not present in smaller models but is present in larger models. The TA describes it as quantity turning into a change in kind, where the quantity is training compute. Some tasks cannot be done at all below a certain compute threshold, and once the threshold is passed performance rises suddenly. He mentions that the researchers who ran the experiment first thought the results were too good and suspected a bug, and published only after repeated checks.

**Estimating compute.** Slide pages 8–9:

> Training FLOPs ≈ 6 × Model Size × Number of Tokens

The TA explains where the 6 comes from: for dense models such as Llama and Mistral, each parameter does about 6 operations per token processed. The slides plug in two sets of numbers:

- Taiwan-LLM: 6 × 70e9 × 500e9 ≈ 2e23
- GPT-4: about 2e25

So a 70-billion-parameter model that sees 500 billion tokens uses 6 × 7×10¹⁰ × 5×10¹¹ = 2.1×10²³ FLOPs, two orders of magnitude less than GPT-4. The TA says the GPT-4 figure is an outside estimate, and that such estimates usually care only about the order of magnitude, not the leading coefficient.

**The cost of frontier models.** Slide page 10 lines up compute and money: GPT-4 at about 2e25 and about 100 million US dollars (2023 Q1); the next generation at 2e26 and about 1 billion; the one after at 2e27 and about 10 billion. The last two rows carry question marks on the slide. The TA's reasoning is growth of 10 times a year: moving from text alone to images, audio, and video makes a tenfold increase in data easy, and progress in chips and algorithms is a matter of coefficients that cannot keep up with exponential growth. This was an estimate made in September 2024.

**Chinchilla's question: how to split a fixed budget.** Slide page 12 sets up the problem: given a fixed compute budget C, how should model size N and training tokens D be traded off to reach the lowest final pretraining loss?

The TA first answers a common question: do you not simply train once on all the data you collected? In practice, no. Sources differ in importance. Books are worth more than casual social media posts, so some data should be seen many times and some is not worth even one pass. LLM training blends the sources into a data mixture, and both the proportions and the total amount are adjustable.

The figure on slide page 13 is from the Llama 3 paper. In the left plot each curve is one fixed compute budget, and the horizontal axis is training tokens. Along one curve, a bigger model can see fewer tokens and falls on the left, while a smaller model can see more tokens and falls on the right. The curve is U-shaped, and its lowest point is the best split for that budget. Connecting the lowest points of all the curves gives the right plot: the relation between compute budget and the optimal token count. The TA points out that the right plot looks like a plain regression line, but each point on it came from sweeping a whole row of model sizes on the left.

**Does pretraining loss predict downstream performance?** Slide page 14 is also from the Llama 3 paper. The TA explains: look first at how these small models' loss on a benchmark relates to compute. The relation is quite linear, and using it to predict the largest model's result is accurate. Then check whether the loss converts into accuracy, and that works well too. He also warns that not every benchmark allows this. The benchmark has to be clean and uncontaminated by training data. Still, you can at least confirm the trend points the right way and make sure the final large model will beat the previous generation. The largest model can be trained only once, so you need confidence it will succeed before you start. Finding out halfway that it falls short wastes an enormous amount of money.

### Transformer Architecture: how LLaMA differs from the original Transformer

The [video](https://youtu.be/TzhCZOILzlI) covers slide pages 15–16. The slides hold a single list, RMS Normalization, Rotary Positional Encoding, KV-Cache, Group Query Attention, and SwiGLU, with a note pointing to last year's recitation video for details. This 11-minute video gives each of the five a short segment. The TA says many of these slides were taken from someone else's slides and recommends following the link on the slides to the original author's explanation. The "Transformer vs LLaMA" figure on page 10 of the LoRA slides credits Umar Jamil's pytorch-llama-notes.

The TA sets the tone first: from the earliest GPT to today's LLaMA the architecture differs very little. The changes are small improvements, one at a time, and most have no strong theory behind them. They were kept because experiments showed they worked.

| Change | Original Transformer | LLaMA | The TA's comment |
|---|---|---|---|
| Normalization | Layer norm, after the sublayer | RMSNorm, moved before the sublayer | See below |
| Positional encoding | Absolute, added to the input | Rotary (RoPE), applied to queries and keys | A relative-position idea expressed as rotation |
| Inference speedup | None | KV cache | Usually just a switch in code |
| Attention | Multi-head | Grouped-query | Between multi-head and multi-query |
| Activation | ReLU | SwiGLU | Smoother than ReLU and GELU; works in experiments |

**RMSNorm.** The TA reviews normalization with a 10×3 matrix: 10 samples with 3 features each. You can take the mean and standard deviation of each sample along the rows, or of each feature along the columns. Normalization keeps the distributions seen by successive layers from drifting too far apart, which steadies the gradients. Layer norm does two things: subtract the mean and divide by the standard deviation. The authors of RMSNorm argued that what really helps is rescaling the values, not recentering them at 0, so they dropped the mean subtraction, saved some computation, and got results just as good. The TA is frank that there is no good theoretical explanation for why, and that spending large amounts of compute to settle which normalization is better on a large model is not very feasible.

**RoPE.** Absolute positional encoding assigns a fixed vector to each position. Relative positional encoding cares about how many positions apart two tokens are. RoPE extends the relative idea by representing position as an angle of rotation. The TA says the derivation looks hard, but that is the whole concept. Its benefit is that position becomes a continuous quantity, so a model trained only up to some length has a chance of extending to longer inputs.

**KV cache.** When generating tokens 1, 2, 3, and 4, recomputing the whole attention matrix each time wastes work in two ways. The upper-right half of the matrix cannot be used anyway, because earlier tokens may not look at later ones. And the earlier rows come out the same every time. Only the bottom row is new. So the approach is to store the keys and values already computed, compute only the new token's, and append them. That is faster. The TA says he covers this so that when you see the KV cache switch in Hugging Face code you know what it does.

**Grouped-query attention.** In multi-head attention every head has its own query, key, and value. The other extreme is multi-query attention, where all heads share one set of keys and values, which saves memory but clearly hurts performance. Grouped-query sits in between: several queries share one set of keys and values.

**SwiGLU.** The TA gives it a few sentences: another, smoother curve beyond ReLU and GELU that works in experiments. Changing only the activation makes little difference, but everyone uses it now.

He ends by saying LLaMA is the mainstream architecture for open-weight models today, and many later models follow it exactly or with small changes. The reason is that the whole software ecosystem is built around it, and a different architecture gets much weaker support.

### MoE: replacing the feed-forward layer with several experts

The [video](https://youtu.be/AgZuF7lsu-8) covers slide pages 17–33, the largest part of this deck.

**Why total parameters and parameters actually used differ.** Slide page 18 lists five open-weight MoE models:

| Model | Org | Experts | Active params / total params |
|---|---|---|---|
| Mixtral 8x7B | Mistral | 8 | 13B / 56B |
| Grok-1 | X.AI | 8 | 86B / 314B |
| DBRX | Databricks | 16 | 36B / 132B |
| Arctic | Snowflake | 128 | 17B / 480B |
| DeepSeekMoE | DeepSeek | 162 (2 shared) | 21B / 236B |

The TA uses Mixtral 8x7B to explain the name: think of a 7B model with 8 clones, where each token passes through only 2 of them each time. The parameters a token actually touches (the active parameters) are therefore far fewer than the total, which is why the architecture is called sparse. He points out a pattern: everyone piles up total parameters while keeping the active parameters under 100B, because beyond that the generation speed falls short of what users expect.

**Where MoE goes.** Slide page 19 contrasts dense and MoE. Each dense layer is attention plus an MLP (the feed-forward layer). MoE usually changes only the MLP: copy one feed-forward network into many (people have done 8, 16, and 128) and put a gate, also called a router, in front to decide which ones this token goes to. Sending it to all of them would be no different from dense.

**Do not take the word "expert" literally.** The TA gives a clear personal view here: as of September 2024 he does not think these experts really specialize in different areas. His reasoning starts from the service provider's side. When users pour in at once, you want them spread across the experts, not all crowding into one, or that expert is swamped and you can serve fewer people. It is the same idea as load balancing in software engineering. Since the training goal is to spread tokens out, experts with distinct specialties do not grow naturally. He says opinions differ on this and counterexamples are welcome.

**Shared experts.** Slide page 20 cites DeepSeekMoE: besides the experts assigned by the router, add a few shared experts that every token passes through. The paper says shared experts can learn common knowledge. The TA relays the intuition: suppose the shared experts handle arithmetic and the others handle different languages, so an arithmetic problem in any language uses the shared experts plus one language expert. His own reading is different. Shared experts can be made large and enjoy a dense model's fast convergence and low risk, while the others are made small and used to pile up parameters. He calls it a high-low mix.

**Should attention be MoE too?** In principle yes, since any matrix multiplication can be split into several and summed. JetMoE, cited on slide page 21, does both. But the TA thinks it is not worth it, and slide page 22 makes the case with the parameter shapes of Llama 3.1 405B.

**Example (numbers from slide page 22; the arithmetic is this post's).** Setup: in one layer the MLP has three matrices, each 16,384 × 53,248; attention's q and o matrices are 16,384 × 16,384, and its k and v matrices are 1,024 × 16,384. Reasoning: the MLP has 3 × 16,384 × 53,248 ≈ 2.62 billion parameters. Attention has 2 × 16,384 × 16,384 + 2 × 1,024 × 16,384 ≈ 0.54 billion + 0.03 billion = 0.57 billion. Result: attention is only 0.57 ÷ (2.62 + 0.57) ≈ 18% of the layer. In the video the TA says roughly thirty percent (the transcript is not clear here); working from the shapes on the slide gives 18%, so the two numbers differ and the conclusion is the same. What it means: MoE exists to pile up parameters without raising the compute per token, and it makes training less stable. If you take that risk, take it where the parameters and the payoff are, which is the MLP. The slide's own conclusion is that MoE on attention brings little benefit.

**Token-choice routing.** Slide page 24. A token's representation x comes in and is first multiplied by a gating matrix W_g. The TA's numbers: with a model dimension of 1024 and 4 experts, W_g is 1024×4 and the product is 4 scores. Take the k experts with the highest scores, send the token to them, and sum the experts' outputs weighted by the scores. Multiplying by the scores matters, because it makes the router differentiable so it can train along with the rest. The TA says all current open-weight MoE models work this way, with only some variation in the loss.

The trouble with this approach is traffic jams. Tokens choose where to go, so a popular expert may have many tokens wanting it at once while an unpopular one sits idle. Each expert can handle only so many at a time, and tokens over the limit go unprocessed, which is called token dropping. The TA says people once tried sending the overflow tokens to their second or third choice, and the experiments then showed no gain; today's practice is to just let them drop.

The limit is set by the capacity factor. The formula on slide page 25 is:

> expert_capacity = num_tokens ÷ num_experts × capacity_factor

**Example (slide page 25, explained by the TA in the video).** Setup: a batch of 6 tokens and 3 experts. Reasoning: an even split is 6 ÷ 3 = 2 per expert. With a capacity factor of 1.0, each expert takes at most 2, so as soon as 3 tokens choose one expert the third is dropped. With a capacity factor of 1.5, the limit becomes 2 × 1.5 = 3. Result: for the same assignment, 1.0 drops one token and 1.5 processes them all. What it means: the factor cannot go below 1, or dropped tokens are guaranteed. It cannot grow without bound either, because every expert must reserve the matching memory. The TA notes that you will often meet this parameter when training MoE models; different frameworks name it differently, and the idea is the same.

**The load-balancing loss and its flaw.** To spread tokens out, training adds a load-balancing loss (slide page 26, citing Switch Transformers). For each expert, multiply "the fraction of tokens it actually received, f" by "the average probability the router gave it, P", and sum over experts. The design intent is that the more even the assignment, the lower the value.

**Example (slide page 27).** Setup: 3 tokens and 2 experts, each token going to its highest-probability expert.

On the left, all three tokens give the two experts probabilities 0.5 and 0.5. The slide's setup has expert 1 receive two tokens (f₁ = 2/3) and expert 2 receive one (f₂ = 1/3). P₁ = P₂ = 0.5. Loss = 2/3 × 0.5 + 1/3 × 0.5 = 0.5.

On the right, tokens 1 and 2 have probabilities 0.51 and 0.49, and token 3 has 0 and 1. The assignment is the same as on the left, f₁ = 2/3 and f₂ = 1/3. P₁ = (0.51 + 0.51 + 0) ÷ 3 = 0.34 and P₂ = (0.49 + 0.49 + 1) ÷ 3 = 0.66. Loss = 2/3 × 0.34 + 1/3 × 0.66 ≈ 0.447.

Result: the probability distribution on the right is plainly more extreme, yet its loss is lower than the perfectly uniform case on the left. What it means: this loss sometimes rewards extreme routing distributions. The TA says it is usually not a big problem, but large models train at enormous scale, and once the loss spikes training becomes unstable. That is why people dislike the load-balancing loss.

**Two problems with token choice, and two fixes.** Slide page 28 sums it up in two points, each with a fix:

| Problem | Fix |
|---|---|
| Unbalanced load, unstable balancing loss | Expert-choice routing |
| Every token uses the same compute | Mixture-of-Depths |

Expert choice reverses the direction: each expert picks a fixed number of tokens. The load is balanced by construction and needs no extra loss. A side effect is that some tokens get picked by many experts and some by none, which can be read as hard tokens receiving more compute.

The TA says the experimental gains are strong, yet no open-weight model has adopted it. Slide page 31 gives the reason: the router's input differs between training and inference. When experts pick tokens they look at the whole sequence. A language model generating token 5 sees only the previous 4 and itself, not what comes after. Token choice has no such problem, because each token's scores depend only on itself and what precedes it.

Mixture-of-Depths (slide page 33) is a simpler idea: add a binary classifier at each layer to decide whether this token is processed at this layer, and skip the layer if not. It is finer than the older early exit. Instead of dropping every layer from some point on, it decides layer by layer.

The TA explains why it has not been widely adopted either, and the reason is about deployment. The paper's figure of which layers get skipped shows one sequence. A service provider handles many users' requests in one batch, each request skips different layers, and in batched processing they still have to wait for one another. So the speedup is largest at batch size 1 and fades at the batch sizes real services use. He mentions a possible research direction in passing: make every request in a batch skip the same layers. But then the answer to a question would change with the other requests in its batch, which brings plenty of problems of its own.

## 6. LLM Inference & Evaluation: quantization and three kinds of evaluation (10/27)

The first half of [w6-LLMInferenceEval.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf) covers faster inference and the second half covers evaluation. The [video](https://youtu.be/mulWMLla-AM) is a live recording from 2023.

### Inference: pick the right framework first, then quantize

The outline page (page 2) lists five items: Quantization, AWQ, GPTQ, PagedAttention, and FlashAttention. The TA says at the outset that the last two have too many details for this session and asks people to look them up; the mainstream inference frameworks already implement them. So only quantization is actually developed.

Before quantization he gives a practical tip: for heavy inference workloads, use a dedicated inference framework such as vLLM or Hugging Face's TGI (Text Generation Inference). He says it is much faster than loading the model with Transformers and running it directly, and the gap is large even without quantization. For how to use vLLM, see section 7 of this post.

The motivation for quantization: training usually uses bfloat16, which is 16 bits, and that is still too big for consumer GPUs, so after training the model is squeezed to 8 bits, 4 bits, or lower. The TA separates two moments. QLoRA in the previous session quantizes during training. This session is about post-training quantization, where the model is compressed after training finishes. Slide page 5 splits the routes by hardware:

- GPU: AWQ, GPTQ
- CPU: GGUF / GGML

To find out whether a model already has a quantized version, the TA says to look up TheBloke on Hugging Face (slide page 4), an account that has uploaded quantized versions of a great many models.

### By hand: quantizing to 2 bits

Slide pages 6–11 use a small example to show how two approaches differ.

**Example (slide pages 6–11; the restoring step is added by this post).** Setup: the weight W is a diagonal matrix with 9, 4, and 1, the input is x = (1, 2, 3), and the original output is (9, 8, 3). Two bits can represent only four values: 0, 1, 2, and 3.

Approach one, round to nearest: replace each weight with the closest of the four values. 9 becomes 3, 4 becomes 3, and 1 stays 1. The quantized output is (3, 6, 3), a long way from (9, 8, 3). The TA notes that this approach looks only at W and has nothing to do with the input x.

Approach two, scale then quantize: multiply W by a factor of 0.33 first, giving 2.97, 1.32, and 0.33, then take the closest values, which are 3, 1, and 0. The quantized output is (3, 2, 0). That is a scaled result, so divide by 0.33 to restore it before comparing with the original output: about (9.09, 6.06, 0).

Result: approach one is off by (6, 2, 0), a sum of squares of 40. Approach two, after restoring, is off by about (0.09, 1.94, 3), a sum of squares of about 12.8. In the video the TA only says scaling first is slightly better and does not compute the error; the numbers above are this post's. What it means: scaling first, so the original value range lines up with the representable range, gives the smaller error by this post's numbers. But the smallest weight was squashed to 0 and its information is gone. The choice of factor directly affects the result, which is the problem the next method addresses.

The TA adds the intuition for the factor: it always lies between 0 and 1, because the original range is larger and you have to multiply by something below 1 to fit it in.

### AWQ and GPTQ: both need data

**AWQ** (slide pages 12–15) is an algorithm for choosing the factor: pick the one that minimizes the activation error. The activation error is the difference between "quantized weights times input" and "original weights times input". Slide page 13 plots the error as the factor runs from 0 to 1, and the TA says the 0.33 used above is already not far from the minimum.

The slides mark AWQ as Data Dependent. The objective contains the input x, so the chosen factors change with the data you feed it. If the data leans toward one kind of text, the quantized model is a little better on that kind.

**GPTQ** (slide pages 16–24) gets its name from post-training quantization placed after GPT. It works one layer at a time: start at the bottom layer and find quantized weights that minimize the difference between this layer's output and the original output (the reconstruction loss), then move up a layer. It also uses data, and because it goes layer by layer, with each layer's input coming from layers already quantized, the TA says it is more sensitive to the data than AWQ.

He then tells a case from practice. Many people quantize a model by copying the sample code, and the calibration data in samples is usually English. Someone quantized the lab's Traditional Chinese model that way and got poor results; switching to Chinese text for quantization made it much better. His advice: use text from whatever domain the model mainly serves as the calibration data, for example statutes for a legal model.

Both methods have ready-made tools (AutoAWQ, AutoGPTQ). The TA reminds listeners that running the quantization itself also needs a GPU.

### Evaluation: three families

The TA calls evaluation a thorny area: as soon as a good benchmark appears models catch up with it, so new ones keep having to come out. He thinks the best evaluation starts from knowing exactly how you will use the model and then collecting data for that use, since that is closest to the real setting.

Slide page 25 sorts evaluation into three families:

| Type | Examples in the slides | How it scores |
|---|---|---|
| Traditional benchmarks | MMLU, TruthfulQA | Multiple choice, accuracy |
| Model as judge | MT-Bench, AlpacaEval | A very strong model scores or compares |
| Human evaluation | Chatbot Arena | People compare two models blind, and Elo scores are computed |

**MMLU.** Multiple-choice questions across many subjects. Each has a stem and options A, B, C, and D, covering STEM, social science, humanities, and more, at levels from elementary school to graduate school. The TA says this is the score he looks at most when judging a model, because everyone reports it, and it is the one to watch when you care about breadth of knowledge.

**TruthfulQA.** Its questions are chosen to be ones many people also get wrong, such as conspiracy theories. The TA's example is asking who caused 9/11, to which an early GPT-3 answered with an unfounded conspiracy theory. The cause is that models learn from web text, and what most people say on the web is not necessarily right. The figure on slide page 29 shows something counterintuitive, and the TA points to GPT-3 at its left: from 350M to 175B, the larger the model, the lower the score. GPT-2 in the figure also falls, while GPT-Neo/J and UnifiedQA do not fall steadily. The TA says he read the questions one by one for a project and found them carefully chosen.

**MT-Bench.** A multi-turn benchmark. Each item has two questions written in advance by the benchmark authors: the first-turn question and the second-turn follow-up. The TA points out its limit: whatever the tested model says in the first turn, the follow-up is the same. Ideally the follow-up would relate to the first answer, but producing many questions as a standardized test forces this design. The math example in the slides gives a function and asks for f(2) in the first turn, then asks for its roots in the second. The two turns do not contradict each other.

Scoring uses a very strong model as the judge (GPT-4 or Claude 2 at recording time). The prompt to the judge has three parts (slide page 32): the judge instruction (you are an impartial judge, here is what to assess, give a score from 1 to 10), the user's original instruction, and the tested model's response. Running every domain produces a radar chart showing where a model is strong and where it is weak. The TA suggests that anyone building their own evaluation follow this pattern: one question plus one follow-up.

**AlpacaEval.** Much like MT-Bench, except that it compares pairs (slide page 34): for one instruction, the responses of two models go to the judge together, and the judge says which is better. One of the two is always the baseline model, which the TA says is an older model with weaker instruction following, so the reported number is each tested model's win rate against it.

**Chatbot Arena.** The user types a message and two anonymous models, left and right, each answer. Only after the user has judged which is better are the two models revealed. The TA compares it to video game rankings and chess: wins and losses between pairs add up to an Elo score. People still trust human evaluation more, so this leaderboard is cited often. He also notes that the way Elo is scored is somewhat unfavorable to newly added models.

The lectures that week cover NLG evaluation metrics (BLEU, ROUGE, perplexity, LLM-Eval); see [Lecture 9: NLG decoding and evaluation](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en). Taken together, one side asks whether a sentence is generated well and the other asks how capable the whole model is.

## 7. LLM Deployment: serving a model with vLLM (11/03)

This session has no slides, only the video [LLM Deployment](https://youtu.be/4JPJkLxW84w), recorded in 2024 and made up entirely of screen work. The TA uses [vLLM](https://github.com/vllm-project/vllm) to deploy the lab's Llama 3 based models in an 8B and a 70B version, on a machine with two H100s of 80 GB each.

### Installing, and estimating memory

The TA says vLLM is fairly easy to install: with a reasonably new NVIDIA card, create a new conda environment, bring CUDA up to 12.1, and install. The documentation also covers CUDA 11.8, but he recommends upgrading as the simpler path.

The first step is to check how many cards you have and how much memory each has (the TA does not name a command; `nvidia-smi` from session 1 does it). One 80 GB card is more than enough for the 8B model. The second card is there to demonstrate 70B.

**Example (numbers from the video; the arithmetic is this post's).** Setup: a 70B model has 70 billion parameters, and loaded as bfloat16 each takes 2 bytes. Reasoning: the weights alone need 70 billion × 2 bytes = 140 GB. One card has 80 GB and two have 160 GB. Result: one card cannot hold it and two can. By the same arithmetic, 8B needs 16 GB, leaving plenty of room on one card. What it means: before deploying, estimate "parameter count × bytes per parameter" once, and you know how many cards you need and whether to quantize.

### Offline inference: the three arguments worth changing

The TA says vLLM code is short and the hard part is understanding the arguments. When creating the model, he changes only three himself:

1. **`dtype`**. Newer cards support bfloat16, so the default is fine. On older cards that lack it, change it to float16 by hand. He calls this the first common pitfall.
2. **`enforce_eager`**. By default vLLM builds a CUDA graph to make inference more efficient, but the graph takes extra memory, so real usage is a little above your estimate. What the TA says is that passing false for this argument uses a little less memory at the cost of some speed. Added by this post: this is the opposite direction from vLLM's own description. The vLLM source ([`config/model.py`](https://github.com/vllm-project/vllm/blob/main/vllm/config/model.py), main branch, checked 2026-10-13) gives `enforce_eager` a default of False; setting it to True is what disables the CUDA graph and always runs in eager mode, and False uses CUDA graph and eager execution together for performance. So saving memory means setting it to True. The video never states which version it uses, so check the version you install.
3. **Quantization**. The TA's view is that wanting to tune other arguments usually means you are short on memory. Instead of tuning many small things to save a little, quantize the model, with FP8 or AWQ for example, which usually saves about half.

Next is the difference between offline and online. Offline means the prompts are all prepared in advance, whether there is one or a million. Research and data processing are mostly like this. Online means something like [twllm.com](http://twllm.com), where you do not know when users arrive or what they will type. Offline has higher overall throughput, because online requests may all arrive at once or not at all for a long while.

The steps for offline inference follow. `LLM`, `SamplingParams`, and `max_tokens` are this post's mapping to vLLM's spelling; what the transcript carries is "the LM class", "sampling parameters", and "max token", and the class names are not read out letter for letter.

1. Create the `LLM` object and name the model. The model can be local or a Hugging Face name. vLLM supports most common architectures.
2. Set `SamplingParams`. The TA says the second pitfall is here: **the default `max_tokens` is very small**, and you must raise it or generation gets cut off partway. What the TA says is that he recalls the default being 32 or 128 and is not sure himself. Added by this post: the vLLM source ([`sampling_params.py`](https://github.com/vllm-project/vllm/blob/main/vllm/sampling_params.py), main branch, checked 2026-10-13) gives a default of 16, smaller than he recalls. The video never states which version it uses, so check the version you install. You can also set temperature (higher means more random), top-p, top-k, and min-p.
3. Prepare the prompt. The TA uses the chat form, writing system, user, and assistant turns in order and ending on a user turn.
4. Run. Startup prints the arguments and the version, then loads the model. The 8B model comes in 4 files and takes about a minute to load.

Here the TA stresses that **the first time, you must run one or two prompts offline and check with your own eyes that the output is sensible**. If the tokenizer, the model, or the floating-point format is loaded wrong, performance drops a lot, and these mistakes do not always raise an error.

### Several cards: tensor parallel

70B does not fit on one card, so it has to be spread over two. The TA says tensor parallel is the usual choice for inference: split a matrix, for example the left half on the first GPU and the right half on the second. The split that matters most is the feed-forward layer's matrices. After the split each card computes its own part, and the cards send results to each other over a communication step to be merged.

The other option is pipeline parallel. The TA says it is usually for crossing nodes: all 8 cards of one machine are full and that is still not enough, so you move on to the next machine. Unless you are running something of the 405B class, you rarely need it.

For the user, the only thing to do is set the tensor parallel size to the number of GPUs: 1 for one card, 2 for two. In the video, downloading and loading 70B both take a long time, and the TA does not wait for it to finish.

### Online serving: an OpenAI-compatible API

Online serving has one more layer than offline. In front there has to be a web server that receives HTTP requests and reports which models are up, and behind it sits the LLM inference engine. vLLM includes both.

The TA says nearly everyone now adopts OpenAI's format: the client uses OpenAI's package as is and only changes the API base URL from OpenAI's server to your own address, which can be localhost or a public URL. That is what an OpenAI-compatible API means.

To start it, run `vllm serve` followed by the model name on the command line. Adding `--help` shows every argument, including the tensor parallel size and the API host and port.

For the demo he opens two terminals, one for the server and one for the client. Two things in it are worth noting:

- Before the server is ready, the client's request cannot connect. Wait until the server says it is running on a port.
- The first chat request returns a not found error. The server side only says the resource was not found, and the client's error message is more specific: there is no such model. The cause is that the model name in the sample command had not been changed. The TA's fix is to query the server for its list of models first and paste the correct name into the request.

Once corrected, the JSON that comes back has the same format as a call to OpenAI's API, so other programs can parse it directly. He then repeats the demo with the OpenAI package in Python, where the model name also has to be changed.

### What to watch in an online service

The TA says an online service is assessed at two ends: latency and throughput. He illustrates the trade-off with a contrast: serve 1,000 people at once with each getting 1 token per second, or serve only 10 people with each getting 50 tokens per second. You choose which end to favor by limiting the number of concurrent users.

While running, the server keeps printing a few numbers: the speed of processing input prompts (tokens per second), the generation speed, and how often the KV cache is hit. The TA says the more cache hits, the faster the inference, and with enough users this number tells you how the service is doing. In the demo he is the only user, so nothing shows. For how the KV cache works, see the architecture part of section 5 of this post.

Finally he suggests that anyone wanting to go deeper read the vLLM source directly, because the documentation sometimes lags behind. The sample used here is in the examples folder of the vLLM repository, and the code is only a few lines.

This session has no direct tie to a homework assignment. It is closer to the last mile you need for the final project and for real work.

## How recitations line up with homework

The course page does not say which recitation supports which assignment. The TA table only lists duties: two TAs for HW1/HW2, two for HW3, and two for the final project. The table below lines them up by week. It is a timing alignment, not an official mapping:

| Assignment | Release week | Recitations in or before that week | Public material |
|---|---|---|---|
| HW1 Chinese extractive QA | 9/08 | Dev Infra, NLP Lifecycle; the following week's Underlying Logic covers extractive QA data | Full spec |
| HW2 LLM tuning + prompt tuning (Classical Chinese translation) | 9/22 | LLM LoRA Training | Intro video only |
| HW3 Retriever & Reranker Training for RAG | 10/13 | LLM Basics & MoE | Intro video only |
| Final project (Jailbreaking Olympics) | 11/03 | LLM Deployment | Intro video only |

Checked against what is said in the videos, three things need care:

- "Homework 1" in the videos is intent classification and word classification, and "Homework 3" is instruction tuning. These are assignments from 2023 and earlier, with different topics from the Fall 2025 HW1 and HW3.
- Two places really do match Fall 2025 assignments in content: the extractive QA part of Underlying Logic for HW1, and the LoRA session for HW2.
- The recitation in the week HW3 is released covers scaling laws and MoE, which have no direct relation to RAG. What HW3 needs is in [Lecture 8: RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en).

## Access and gaps

The series as a whole is graded A2 (per the definition in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): materials partially open). On the recitation track alone, the videos and Colabs are complete, but the slides need a detour:

1. **All five slide links on the course page return 404.** The course page points to paths such as `f114-adl/doc/w2-ProjLife.pdf`. All returned 404 on 2026-09-30 and still did on 2026-10-13. This post cites the same-name files under the Fall 2024 path (`f113-adl/doc/`); all five open.
2. **Deployment has no slides**, only the video.
3. **Dev Infra has no slides**, only the Colab.
4. **The videos and slides are 2023–2024 versions**, so the homework numbers and contents they mention belong to those years.
5. **None of the ten videos has captions.** Most code in the slides is screenshots with no text layer, so read the images or watch the videos alongside.
6. **The LoRA and Inference & Evaluation videos are live recordings.** The TA puts questions to the room, and the students' answers were not recorded.

## How to use this post

- **Never written PyTorch**: run the Dev Infra Colab first, then read [Lecture 1](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en) and [Lecture 2](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop-en).
- **Getting ready for HW1**: after [Lecture 5](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en), watch NLP Lifecycle and Underlying Logic in that order, then move to [HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en).
- **Only want LLM engineering**: jump to the last four sessions. You can reorder them as Basics & MoE → LoRA → Inference & Eval → Deployment, which matches the older w4→w5→w6 file order. The LoRA video says the architecture was covered the week before, and that only connects in this order.

One thing to do tonight: open the [NLP Lifecycle Colab](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ), change `evaluation_strategy` to `eval_strategy`, replace `load_metric` with `evaluate.load`, change `predictions = predictions[:, 0]` in `compute_metrics` to take the argmax first (`predictions = np.argmax(predictions, axis=1)`), and run through `trainer.train()`. Once training starts, check that the progress bar's total is 4690, then look at the updates per second. If it finishes, your environment is ready for HW1. A caution: without the argmax change the run still finishes, but the accuracy printed each epoch cannot be trusted. This post checked the three edits against the libraries' source (2026-10-13, main branches): `TrainingArguments` in transformers now has only `eval_strategy` and no `evaluation_strategy`; datasets no longer exports `load_metric` (2.21.0 still did); and the argmax item was checked on simulated data. This post did not run the whole notebook end to end, and newer library versions may need other changes too.

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"If the machine has a GPU, PyTorch will use it."** Not automatically. Confirm `torch.cuda.is_available()` first, then call `.to(device)` on the model, the inputs, and the labels. Much code raises no error when the GPU goes unused and simply runs slower.
- **"The model may not look at the validation set, so it must not be touched during training."** The model cannot learn from it, but it can run inference on it and be marked. Checking the model partway through training is what it is for. The set that must never be touched is the test set.
- **"A project fails because the architecture is not good enough."** The TA holds the opposite view: there is little room to improve the model, success is decided by the data, and the value is in the demo. Get the whole loop running first, then iterate.
- **"LoRA makes the model smaller."** What shrinks is the number of parameters being trained. The original weights are still loaded in full, and running out of memory is solved by QLoRA quantizing the frozen weights to 4 bits.
- **"Each MoE expert specializes in one area."** The training goal is to spread tokens out and even the load, not to divide the labor. The TA thinks no real experts can be seen so far, and that is his personal view.
- **"The more parameters an MoE model has, the slower it runs."** Speed is set by how many parameters each token actually passes through. Total parameters can reach several hundred B while active parameters stay under 100B.
- **"Quantization only concerns the weights, so the sample calibration data will do."** Both AWQ and GPTQ depend on the input data. When the calibration data's language or domain does not match the real use, the quantized model gets worse.
- **"A bigger model scores higher on every benchmark."** TruthfulQA is a counterexample: in the figure on the slides, the GPT-3 family scores lower as the model gets larger. The TA's explanation is that models learn from web text, and what most people say on the web is not necessarily right.
- **"If vLLM runs without an error, it is right."** The TA says the default `max_tokens` is very small, so output is cut short unless you raise it, and a wrongly loaded tokenizer or floating-point format does not always raise an error. Run one or two prompts offline and read the output first.

## Self-check

The questions were written for this post, and every answer can be found above.

**1. `x` is a 3×4 tensor. What do `x.view(-1, 6)` and `x.view(-1, 5)` give?**

The first gives 2×6, since 12 ÷ 6 = 2. The second raises an error, since 12 is not divisible by 5.

**2. After `.to("cuda:0")` on the model, training fails with "Expected all tensors to be on the same device". How do you find the cause with ipdb, and what do you change?**

Put `ipdb.set_trace()` before the failing line, and once it stops, use `p` to print the device of the input batch and of the model. The input is on the CPU and the model is on the GPU. Call `.to(device)` on the inputs and the labels too.

**3. Validation gives 80% and test gives 60%. Which is production performance closer to, and why?**

Closer to 60%. The validation set is used again and again during training to pick the model, while the test set is outside data used for the first time after training ends, so it better represents unseen cases.

**4. With 8,000 training rows, batch size 32, and 3 epochs, what total should the progress bar show?**

One epoch is 8,000 ÷ 32 = 250 steps, and 3 epochs are 750 steps.

**5. Which of the four tasks is "mark the order numbers and dates in customer-service chats"? How many classes does BIO tagging need?**

Classifying each word in a sentence. Two entity types need 2 × 2 + 1 = 5 classes: B-ORDER, I-ORDER, B-DATE, I-DATE, and O.

**6. Why does a SQuAD answer carry `answer_start` in addition to the text?**

The same text may appear several times in the context, and only one occurrence answers this question. The starting character position removes the ambiguity. The end can be computed from the start plus the answer length.

**7. The weight matrix is 1024×1024 and LoRA's rank is 8. What fraction of the original are the trainable parameters?**

The original has 1,024 × 1,024 = 1,048,576. LoRA has 1,024 × 8 × 2 = 16,384. The ratio is 16,384 ÷ 1,048,576 = 1/64, about 1.56%.

**8. Why train in bfloat16 and not FP16?**

Both are 16 bits. FP16 has only 5 bits for range, so values overflow or underflow easily during backpropagation and the loss spikes. Bfloat16 keeps the same 8 range bits as FP32 and pays with lower precision.

**9. A batch has 8 tokens and 4 experts, and the capacity factor is 1.5. How many tokens can each expert take at most, and what happens to the rest?**

8 ÷ 4 × 1.5 = 3. Tokens over the limit are not processed by any expert at this layer, which is token dropping.

**10. Expert-choice routing fixes the load imbalance. Why has no open-weight model adopted it?**

Experts look at the whole sequence when picking tokens. A language model generating text sees only what comes before the current position, so the router's input differs between training and inference.

**11. The weights are 6 and 2, the input is (1, 1), and only 0, 1, 2, and 3 can be represented. Which has less error: rounding to nearest directly, or multiplying by 0.5 first and then quantizing?**

Direct: 6 becomes 3 and 2 stays 2, so the output is (3, 2), off from the original (6, 2) by (3, 0). Multiplying by 0.5 first gives 3 and 1, both exactly representable, so the output is (3, 1), and dividing by 0.5 restores (6, 2) with no error. Scaling first has less error.

**12. MT-Bench and AlpacaEval both use a model as the judge. How do they differ?**

MT-Bench looks at one model's response at a time, has the judge give a score from 1 to 10, and uses two-turn conversations. AlpacaEval puts the tested model's response next to that of a fixed baseline model and reports the win rate against the baseline.

**13. You have two 48 GB cards and want to deploy a 34B model in bfloat16. Does it fit, and what do you set in vLLM?**

The weights need 34 billion × 2 bytes = 68 GB. One 48 GB card cannot hold that. Two give 96 GB, which fits, though real usage runs above the estimate (the CUDA graph takes extra memory, for example). Set the tensor parallel size to 2. If space is still tight, the TA's advice is to quantize.

**14. Answers generated with vLLM stop after one short sentence every time. What is the most likely cause?**

`max_tokens` in `SamplingParams` was not raised. The TA says its default is very small.

## Further reading

- [CMU 11-868 LLM Systems guide](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en): takes the topics of the last four sessions (LoRA, quantization, MoE, serving) down to the systems level. See the units on [PEFT and LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora-en), [model quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en), [model parallelism and MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en), and [SGLang and vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en).
- [Stanford CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en): building a language model from scratch; its [attention variants and MoE](/posts/ai/2026-08-22-cs336-attention-moe-en) and [inference](/posts/ai/2026-08-22-cs336-inference-en) posts overlap with sessions 5 and 7.
- [CS224N: Tinker and LoRA](/posts/ai/2026-08-22-cs224n-tinker-lora-en): LoRA in practice from another course.

---

Previous: [Lecture 14: beyond supervised learning and multimodality](/posts/ai/2026-09-30-ntu-adl2025-beyond-supervised-multimodal-en)
Series overview: [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=zuiACAhRUzA
title: ADL TA Recitation: PyTorch Tutorial (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=RYkEoCkJWeA
title: ADL TA Recitation: PyTorch Debugging (YouTube, in Mandarin)
```

Original videos: [ADL TA Recitation: PyTorch Tutorial (YouTube, in Mandarin)](https://www.youtube.com/watch?v=zuiACAhRUzA), [ADL TA Recitation: PyTorch Debugging (YouTube, in Mandarin)](https://www.youtube.com/watch?v=RYkEoCkJWeA), [ADL TA Recitation: NLP Project Lifecycle (YouTube, in Mandarin)](https://www.youtube.com/watch?v=anK1_PK464k), [ADL TA Recitation: Underlying Logic of NLP Projects (YouTube, in Mandarin)](https://www.youtube.com/watch?v=255ZzsTTHoU), [ADL TA Recitation: LLM LoRA Training (YouTube, in Mandarin)](https://www.youtube.com/watch?v=eGQMzbhokg0), [ADL TA Recitation: LLM Basics (YouTube, in Mandarin)](https://www.youtube.com/watch?v=BBw-ki4_06o), [ADL TA Recitation: Transformer Architecture (YouTube, in Mandarin)](https://www.youtube.com/watch?v=TzhCZOILzlI), [ADL TA Recitation: Mixture-of-Experts (MoE) Architecture (YouTube, in Mandarin)](https://www.youtube.com/watch?v=AgZuF7lsu-8), [ADL TA Recitation: LLM Inference & Evaluation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=mulWMLla-AM), [ADL TA Recitation: LLM Deployment (YouTube, in Mandarin)](https://www.youtube.com/watch?v=4JPJkLxW84w)

The last two (LLM Inference & Evaluation and LLM Deployment) were added to this list on 2026-10-13, with the same links as the table in "The big picture"; these two were not separately checked against the official playlist this time.

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): none of the ten recitation videos has usable captions, so this guide was written from speech-recognition transcripts of their audio, which may mishear some proper nouns and numbers. Commands, code, and numbers follow the slide pages.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Tried to check the two PyTorch recitation videos against transcripts, but neither has one, so the content was not checked; recording date and lecturer were confirmed to match the article.
- 2026-10-13: Moved the verification history out of the body and switched cross-references within the series from post order to lecture numbers.
- 2026-10-13: Updated how the LoRA recitation relates to HW2, following the HW2 briefing video.
- 2026-10-13: Rewrote every session from the spoken content of the ten videos, and added examples, common misreadings, and a self-check with answers.
- 2026-10-13: Fixes from an independent review: separated what the slide tables show from what the TA says aloud (LoRA slide pages 13, 16, and 27, and the TruthfulQA figure), removed vLLM version numbers that had no source, added the reminder that the Colab's `compute_metrics` needs an argmax first, and listed two more videos in the video sources.
- 2026-10-13: Verified four points from outside the course sources and stated the basis: vLLM's `enforce_eager` and the `max_tokens` default (against the source), the `pipeline` syntax error and argmax in the Colab (compiled and checked on simulated data), and the two API renames (against the libraries' source).

## References

- [ADL Fall 2025 (114-1) course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — Recitation column and TA duty table
- [Course Logistics slides (250901_Course.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — page 6, recitation scope
- [TA Colab: Dev Infra & Tooling](https://colab.research.google.com/drive/1yoyDg3411OyddX5fPGomtGe3_0Kz77qT)
- [TA Colab: NLP Lifecycle (text classification fine-tuning)](https://colab.research.google.com/drive/1nATVYs9OkPG_MEs6D_RXw1W-DlUWbTHJ)
- [w2-ProjLife.pdf: the life of an NLP project (same-name file on the Fall 2024 path, in Mandarin)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w2-ProjLife.pdf)
- [w3-UnderlyLogic.pdf: the underlying logic of NLP projects (same-name file on the Fall 2024 path, in Mandarin)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w3-UnderlyLogic.pdf)
- [w4-LLMBasicsMOE.pdf: LLM Basics and MoE Architecture (same-name file on the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w4-LLMBasicsMOE.pdf)
- [w5-LoRA.pdf: LLM LoRA Training (same-name file on the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w5-LoRA.pdf)
- [w6-LLMInferenceEval.pdf: LLM Inference and Eval (same-name file on the Fall 2024 path)](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/w6-LLMInferenceEval.pdf)
- [ADL TA Recitation: PyTorch Tutorial (YouTube, in Mandarin)](https://youtu.be/zuiACAhRUzA)
- [ADL TA Recitation: PyTorch Debugging (YouTube, in Mandarin)](https://youtu.be/RYkEoCkJWeA)
- [ADL TA Recitation: NLP Project Lifecycle (YouTube, in Mandarin)](https://youtu.be/anK1_PK464k)
- [ADL TA Recitation: Underlying Logic of NLP Projects (YouTube, in Mandarin)](https://youtu.be/255ZzsTTHoU)
- [ADL TA Recitation: LLM LoRA Training (YouTube, in Mandarin)](https://youtu.be/eGQMzbhokg0)
- [ADL TA Recitation: LLM Basics (YouTube, in Mandarin)](https://youtu.be/BBw-ki4_06o)
- [ADL TA Recitation: Transformer Architecture (YouTube, in Mandarin)](https://youtu.be/TzhCZOILzlI)
- [ADL TA Recitation: Mixture-of-Experts (MoE) Architecture (YouTube, in Mandarin)](https://youtu.be/AgZuF7lsu-8)
- [ADL TA Recitation: LLM Inference & Evaluation (YouTube, in Mandarin)](https://youtu.be/mulWMLla-AM)
- [ADL TA Recitation: LLM Deployment (YouTube, in Mandarin)](https://youtu.be/4JPJkLxW84w)
- [vLLM (GitHub)](https://github.com/vllm-project/vllm)
- [Axolotl (GitHub)](https://github.com/OpenAccess-AI-Collective/axolotl) — the fine-tuning tool shown on pages 29–30 of the LoRA slides
- [Can you run it? LLM version (Hugging Face Space)](https://huggingface.co/spaces/Vokturz/can-it-run-llm) — page 6 of the LoRA slides
- [Hu et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Dettmers et al. (2023). QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314)
