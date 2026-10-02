---
title: "NTHU NLP Guide 9: One BERT That Scores and Classifies at Once — The Hugging Face Tutorial and HW3 Multi-Output Learning"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, bert, hugging-face, fine-tuning, homework, pytorch, nlp]
lang: en
series:
  name: "Reading NTHU Hung-Yu Kao Natural Language Processing"
  order: 9
tldr: "A guide to the Hugging Face BERT tutorial and HW3 in NTHU Prof. Hung-Yu Kao's NLP course (Fall 2025). The tutorial walks through binary IMDb sentiment classification: AutoTokenizer, the input_ids / token_type_ids / attention_mask fields, AutoModelForSequenceClassification, and Trainer. HW3 applies the same tools to SemEval 2014 Task 1: one bert-base-uncased with two heads, one regressing a 1–5 relatedness score and one classifying entailment into three classes. You add the two losses and write the training loop yourself, because Trainer is not allowed."
description: "A guide to huggingface_tutorial_bert.pdf, Reference/bert-huggingface.ipynb, and HW3 Multi-output learning from NTHU Prof. Hung-Yu Kao's Natural Language Processing course (Fall 2025): the IMDb classification pipeline, the three tokenizer output fields, AutoClasses per downstream task, Trainer and TrainingArguments; the SemEval 2014 Task 1 data in HW3, TODO1–6, combining two losses, Pearson and accuracy evaluation, grading and report questions, and a few traps in the starter notebook."
draft: false
glossary:
  - term: "multi-output learning"
    definition: "Each input carries several labels at once, and the model predicts all of them together. In multi-task learning, by contrast, each task usually has its own data."
    context: "Slide 2 of the HW3 handout opens with this distinction: every sentence pair in SemEval 2014 Task 1 has both a relatedness score and an entailment label."
  - term: "attention_mask"
    definition: "One of the tokenizer's output fields: 1 at real token positions and 0 at padding, telling the model to ignore the padded part."
    context: "Slide 29 of the tutorial shows it on the first example in the IMDb validation set."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3)

> **This guide is based on the public Fall 2025 (114-1) materials of [Prof. Hung-Yu Kao's Natural Language Processing course at NTHU](https://github.com/IKMLab/NTHU_Natural_Language_Processing).** It is part 9 of the [Reading NTHU Hung-Yu Kao Natural Language Processing](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en) series. The previous part is [ELMo, BERT, T5, BART, GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family-en).

The previous part covered how the BERT family is pretrained. This one is hands-on: take off-the-shelf BERT weights and attach them to your own task. Four sets of official materials are involved:

- Tutorial slides [huggingface_tutorial_bert.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_bert.pdf) (43 pages, cover dated 2024/10/22)
- The matching notebook [bert-huggingface.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/bert-huggingface.ipynb)
- The assignment handout [NLP_HW3_Multi_output_learning.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/NLP_HW3_Multi_output_learning.pdf) (24 pages) and starter code [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/main.ipynb)
- Recordings: the tutorial [VErSpYgZGiw](https://www.youtube.com/watch?v=VErSpYgZGiw) and the HW3 walkthrough [Fe1roWMVdUI](https://www.youtube.com/watch?v=Fe1roWMVdUI)

## Recordings and weeks: sorting out what goes where

The [2025 schedule](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) lists the tutorial slides and recording under W7 and HW3 under W8. The reality is a little messier:

| Recording | YouTube title and page info | Content |
|---|---|---|
| [VErSpYgZGiw](https://www.youtube.com/watch?v=VErSpYgZGiw) | "Week 8 Tue. [助教課]" (TA session), no [Fall 2025] tag, uploaded 2024-10-21, about 89 minutes, description reads "Hugging Face BERT講解" | The TA session recorded in 2024 |
| [W7 Thu. 4qDUML9TeHM](https://www.youtube.com/live/4qDUML9TeHM) | "[Fall 2025] … Week 7 Thu.", about 56 minutes | I grabbed frames at minutes 5, 25, and 50; all three show this tutorial deck (pages 2, 16, 30) |
| [Fe1roWMVdUI](https://www.youtube.com/watch?v=Fe1roWMVdUI) | "[Fall 2025] … Week 8 Thu. - Assignment 3", about 15 minutes | HW3 walkthrough |

At the end of [W7 Tue.](https://www.youtube.com/live/NtPrXea8qSE), the professor says the TA sessions will be played from pre-recorded video "because the content hasn't changed," with TAs online to answer questions. That matches the 2024 cover date and the 2024 upload date. So for the tutorial, either VErSpYgZGiw or W7 Thu. will do. I did not check minute by minute whether all of W7 Thu. is the same recording.

## The tutorial: IMDb classification end to end

The slide outline has three parts: an introduction to Hugging Face, BERT, and the Hugging Face Trainer. The notebook says it is meant for students who already know Python, numpy, pandas, scikit-learn, and PyTorch, and links IKMLab's own primers for anyone who doesn't (in Mandarin).

### Pinned versions

Slide 7 and the first notebook cell pin `torch==2.4.0`, `transformers==4.37.0`, `datasets==3.0.1`, `accelerate==0.21.0`, and `scikit-learn==1.5.2`. That is a 2024 stack. On today's Colab, pinning these versions saves you from renamed APIs. Note that HW3 needs a different `datasets` version, covered below.

### Data: two routes

Slide 12 splits the workflow into three steps (get data → train → evaluate), each with a "native PyTorch" option and a "Hugging Face tool" option. For getting data, the tutorial shows both:

1. Download Stanford's `aclImdb_v1.tar.gz` with `wget`, read the files from the `pos` / `neg` folders and label them, then hold out 20% for validation with scikit-learn's `train_test_split` (seed 42).
2. Call `datasets.load_dataset("imdb")` and split with `.train_test_split(test_size=0.2, seed=42)` (slide 31).

The second route is much less code, provided your task's data is already on Hugging Face Datasets.

### The three fields the tokenizer returns

Slides 19–29 deserve the slowest read in the deck. `AutoTokenizer.from_pretrained("bert-base-uncased")` picks the right tokenizer class from the model name. Uncased means case is ignored (english and English are the same word).

The slides print a few numbers directly: `model_max_length` is 512, and the IDs for `[CLS]`, `[SEP]`, and `[PAD]` are 101, 102, and 0.

Calling `tokenizer(texts, truncation=True, padding=True)` returns a `BatchEncoding` with three fields:

| Field | Content | What the slides say |
|---|---|---|
| `input_ids` | Each subword's ID in the vocabulary, with 101 and 102 added at the ends and 0s padded after | Slide 27 |
| `token_type_ids` | 0 for the first sentence, 1 for the second | IMDb is a single-sentence task, so it's all 0s (slide 28) |
| `attention_mask` | 1 for real tokens, 0 for padding | Tells the model not to attend to padded regions (slide 29) |

IMDb has no use for `token_type_ids`. HW3 does: its input is a premise and a hypothesis.

### Models: same BERT, different heads

Slides 34–35 map downstream tasks to AutoClasses:

| Task | Class |
|---|---|
| Sentence classification (IMDb) | `AutoModelForSequenceClassification`, `num_labels=2` |
| Semantic similarity regression (STS-B) | Same class, `num_labels=1` |
| Extractive QA (SQuAD) | `AutoModelForQuestionAnswering` |
| Sequence labeling (CoNLL-2003 NER) | `AutoModelForTokenClassification` |

Slides 36–37, titled "What happens for down-stream tasks?", link to two passages of [`modeling_bert.py`](https://github.com/huggingface/transformers/blob/v4.45.2/src/transformers/models/bert/modeling_bert.py#L1651-L1665) in transformers v4.45.2. I read both:

- The first (L1651–1665) is the `BertForSequenceClassification` constructor: the BERT body, a dropout, and one `nn.Linear(hidden_size, num_labels)`. A "classification model" is just BERT's pooled output followed by one linear layer.
- The second (L1715–1734) picks the loss. With `num_labels == 1` it treats the task as regression and uses `MSELoss`. With `num_labels > 1` and integer labels it treats it as single-label classification and uses `CrossEntropyLoss`.

Both passages set up HW3. There you write this structure yourself, with two heads, and pick one loss per task type.

The notebook cell loads the model with `num_labels=3`, but IMDb is binary and `compute_metrics` uses `average='binary'`. Use 2, as the slides do.

### Trainer

Slides 38–43 show `TrainingArguments` plus `Trainer`. Set epochs, learning rate, batch size, warmup, and evaluation and checkpoint frequency, then `trainer.train()` starts training and `trainer.predict(test_dataset)` predicts without updating weights. Slide 39 puts a native PyTorch training loop next to the single line `trainer.train()` to show what Trainer saves you.

## HW3: one model, two answers

### The task

Slide 2 of the [HW3 handout](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/NLP_HW3_Multi_output_learning.pdf) separates two terms that often get mixed up. Multi-output learning means one dataset with several labels. Multi-task learning means different datasets, each with its own labels. HW3 is the former.

The dataset is [SemEval 2014 Task 1](https://aclanthology.org/S14-2001/). Each example has a premise, a hypothesis, and two answers:

| Sub-task | Field | Type |
|---|---|---|
| 1 | `relatedness_score` | Regression, 1–5 |
| 2 | `entailment_judgement` | Three-way classification: 0 NEUTRAL, 1 ENTAILMENT, 2 CONTRADICTION |

The splits are 4,500 training, 500 validation, and 4,927 test examples (slide 5).

### Six TODOs

| TODO | What you do | Points |
|---|---|---|
| 1 | Write `collate_fn` and three DataLoaders; each batch returns the tokenizer output, the regression labels, and the classification labels | 5% |
| 2 | Build the model. **You must use `bert-base-uncased`**, or you lose these 5% | 5% |
| 3 | Define the optimizer (Adam or AdamW recommended) and **two** losses | 5% |
| 4 | Write the training loop yourself. **Hugging Face Trainer is not allowed.** The total loss aggregates the sub-task losses | 5% |
| 5 | Evaluate on validation: Pearson correlation for relatedness, accuracy for entailment | 10% |
| 6 | Load the checkpoint with the best validation score and report test Pearson and accuracy | 10% |

Slide 10 sketches a suggested architecture: the sentence pair goes through BERT, then splits into two linear layers, `Linear_1` for relatedness and `Linear_2` for entailment. A comment in the starter code adds that you may add linear layers, activations, and similar components, but **no other pretrained language model**.

Slide 11 only hints at the loss: "observe the type of each sub-task; use different loss functions for different types of tasks." A regression loss for the regression head, a classification loss for the classification head, combined into one number to backpropagate. How to combine them (plain sum, weights, whether to handle the two losses' different scales) is the part the assignment leaves to you.

### Grading and the report

Code is 40% (table above), test performance 10%, and the report 50%. The test baseline is Pearson 0.8 and accuracy 0.8 on the test set, worth 4%, with more points for higher scores. The report must end with a screenshot of the test log.

Report questions (slide 17):

- Train RoBERTa-base on the same data, compare it with BERT-base, and discuss how their differences affect performance (15%)
- Train and evaluate GPT-2, and discuss the differences between BERT and GPT-2 (15%)
- Compare the multi-output model with separate BERT models per sub-task: does multi-output help, and why? (5%)
- Error analysis: why does the model get some examples wrong, and how did you improve it? (10%)
- Anything else that strengthens the report (5%)

Submission rules: download the code from Colab as a `.py`, include `requirements.txt`, write the report in `.docx`, zip everything as `NLP_HW3_school_studentID.zip`, and upload to NTU COOL within three weeks. Wrong file names or a missing Python version cost 5 points each. **Modifying the code template, except for data loading, costs 5 points.** Submissions highly similar to another student's cost both students 100 points. Any use of generative AI must be declared in both code comments and the report.

## A few traps in the starter notebook

What I noticed reading [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/main.ipynb):

- **`datasets` version**: slide 8 stresses that you need `datasets==2.21.0` to download `sem_eval_2014_task_1` from Hugging Face, and the code passes `trust_remote_code=True`. The tutorial notebook pins 3.0.1, so don't share one environment between the two.
- **Metric library**: slide 13 says the sample code uses `torchmetrics`, but the starter code actually imports `evaluate` with `load("pearsonr")` and `load("accuracy")`. Go with the code.
- **Variable name**: the validation loop initializes `best_score = 0.0` but checks `if pearson_corr + accuracy > best:`. Run as-is, it raises `NameError`, so unify the names. Create the `./saved_models/` directory first, too.
- **Full-width punctuation**: the starter code converts Chinese full-width punctuation to half-width, with a comment explaining that BERT's tokenizer would otherwise turn it into `[UNK]`.

## Try it

- Run the Hugging Face Datasets version of the tutorial notebook, print one `input_ids`, and decode it back with `tokenizer.decode` to see where 101, 102, and 0 land.
- For HW3, first train with only the classification head, then with only the regression head, and note both numbers. Then train both heads together. That comparison is report question three.
- Before summing the two losses, print each one to see its magnitude. If they differ a lot, try weighting and watch which of Pearson or accuracy moves first.

**Further reading**: [CS224N: pretraining, subwords, and in-context learning](/posts/ai/2026-08-22-cs224n-pretraining-en) explains why BERT transfers; [CS224U contextual representations II: model families](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families-en) compares BERT, RoBERTa, and others, useful background for report question one.

## Gaps in the materials

- Solutions, grading scripts, and grade distributions live on NTU COOL, out of reach for outside readers.
- For the HW3 walkthrough video Fe1roWMVdUI, I confirmed only the title and length and did not watch it through. Everything about the assignment here comes from the handout PDF and starter code.
- Slides 30, 33, 40, and 41 show code as screenshots; this guide follows the matching notebook code.
- This tutorial is the 2024 version, and the Fall 2026 counterpart isn't public yet. Under the grading in the [global course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), Fall 2025 is A3 (enough for self-study); the gaps are solutions and grading.

**Series navigation**: previous, [ELMo, BERT, T5, BART, GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family-en) | next, [Decoding strategies and NLG evaluation](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en) | [Series overview](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

## References

- [IKMLab/NTHU_Natural_Language_Processing (course GitHub repo)](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 schedule README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [huggingface_tutorial_bert.pdf (Hugging Face tutorial slides)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_bert.pdf)
- [Reference/bert-huggingface.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/bert-huggingface.ipynb) (notes in Mandarin)
- [2025 assignment index](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [NLP_HW3_Multi_output_learning.pdf (HW3 handout)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/NLP_HW3_Multi_output_learning.pdf)
- [Assignment3/main.ipynb (HW3 starter code)](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/main.ipynb)
- [Recording: Hugging Face BERT TA session (Week 8 Tue. [助教課])](https://www.youtube.com/watch?v=VErSpYgZGiw) (in Mandarin)
- [Recording: [Fall 2025] Week 7 Thu.](https://www.youtube.com/live/4qDUML9TeHM) (in Mandarin)
- [Recording: [Fall 2025] Week 8 Thu. - Assignment 3](https://www.youtube.com/watch?v=Fe1roWMVdUI) (in Mandarin)
- [Devlin et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://aclanthology.org/N19-1423/)
- [Marelli et al. (2014). SemEval-2014 Task 1](https://aclanthology.org/S14-2001/)
- [Hugging Face dataset: sem_eval_2014_task_1](https://huggingface.co/datasets/SemEvalWorkshop/sem_eval_2014_task_1)
- [Hugging Face model: google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased)
- [Hugging Face Transformers docs: Trainer](https://huggingface.co/docs/transformers/main_classes/trainer)
