---
title: "Reading NTU ADL 2025 Fall: HW1 Chinese Extractive QA — Finding the Answer Span Among Four Paragraphs"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, bert, question-answering, huggingface]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 7
tldr: "HW1 in ADL Fall 2025 gives a question and four Chinese paragraphs. The model first picks the relevant paragraph (paragraph selection, framed as four-way multiple choice), then marks the answer's start and end inside it (span selection), scored by Exact Match. The spec slides point you straight at Hugging Face's run_swag_no_trainer.py and run_qa_no_trainer.py. The simple baseline uses bert-base-chinese, length 512, effective batch size 2, and learning rate 3e-5, and both stages together take under three hours on an 8GB RTX 3070. The Kaggle leaderboard closed 9/29, and code plus report were due 10/1 on NTU COOL. Outside readers cannot get the Kaggle data or grading, but the task design, baseline settings, and five report questions are all usable for practice."
description: "Guide 7 in the NTU Yun-Nung Chen Applied Deep Learning Fall 2025 series, based on the HW1 spec slides (NTU ADL 2025 Fall HW1) and the assignment video: task definition, Exact Match, adapting two Hugging Face examples, simple-baseline settings, allowed packages, submission format and execution environment, grading and the five report questions, the change log, and what outside readers can do."
draft: false
glossary:
  - term: "Exact Match"
    aliases: ["EM"]
    definition: "An extractive-QA metric: a prediction counts only if the answer string is identical to the gold answer; one character off is wrong."
    context: "The ADL 2025 Fall HW1 Kaggle leaderboard scores with EM."
  - term: "Paragraph Selection"
    definition: "HW1's first stage: treat each paragraph-question pair as a choice and have the model pick the paragraph that contains the answer."
    context: "The slides recommend adapting Hugging Face's multiple-choice example."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)

**Video status: Videos included.** [Source details](#course-video-sources)

**This guide covers HW1 of [NTU Yun-Nung Chen's Applied Deep Learning (ADL), Fall 2025 (114-1, 2025/09/01–12/15)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/).** It is part 7 of the [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) series. The previous post, [BERT and Its Family](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en), covered how BERT is pre-trained and fine-tuned with a classifier on top. This one applies it to a concrete task: **given a question and four Chinese paragraphs, which paragraph holds the answer, and from which character to which?**

Official materials used:

- Spec slides [NTU ADL 2025 Fall HW1](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing) (linked from the 9/08 row of the course page, marked "Last updated on 09/30")
- Assignment video [ADL 2025 Fall Homework 1](https://youtu.be/DVjBNRHUWc0) (about 24 minutes 50 seconds, uploaded 2025-09-09, description: BERT for Chinese Question Answering). The video is linked from the course page but is not in the 77-video Fall 2025 playlist.

**Access**: this is the only ADL Fall 2025 assignment with a fully public spec, and a main reason the series is rated **A2**. The spec, baseline settings, and report questions are visible. The data lives on Kaggle, though: the slide's Kaggle link is an invite link that this guide did not open, so it is unknown whether downloads or submissions still work. Code and reports go to NTU COOL, which requires an NTU account.

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=DVjBNRHUWc0
title: Video: ADL 2025 Fall Homework 1
```

Original videos: [Video: ADL 2025 Fall Homework 1](https://www.youtube.com/watch?v=DVjBNRHUWc0)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Transcript attempt (2026-10-10): the embedded HW1 briefing video (24:50, uploaded 2025-09-09, unlisted, description "BERT for Chinese Question Answering") has no obtainable transcript, so its content was not checked. The article already states that it did not transcribe the video and takes the assignment spec from the spec slides; the title, length, upload date and description match the article.

## The task: two-stage extractive QA

The slide example pairs one question with four paragraphs:

- Question: 在關西鎮以什麼方言為主？ ("What dialect is mainly spoken in Guanxi Township?")
- The four paragraphs cover Hsinchu County in general, types of development zones, Hsinchu's population and railways, and Taiwanese politics and the strait's historical name.
- Answer: 四縣腔客家話 (Sixian Hakka), found in the first paragraph.

The task has two steps:

1. **Paragraph selection**: decide which of the four paragraphs is relevant. The slide draws a Multiple Choice Model that takes the question and four paragraphs and outputs the correct one.
2. **Span selection**: find the answer's **start and end positions** inside that paragraph. The slide notes that the answer is always a span in the correct paragraph.

These are the two classic BERT fine-tuning patterns from the previous post: classification first, then start/end prediction over each token.

Scoring uses **Exact Match (EM)**: the predicted string must equal the answer exactly.

## The recommended route: adapt Hugging Face examples

Both slides say "highly recommended!!!"

**Paragraph selection**: treat each paragraph-question pair as a choice and have the model pick the right one. Adapt Hugging Face's multiple-choice example [run_swag_no_trainer.py](https://github.com/huggingface/transformers/blob/main/examples/pytorch/multiple-choice/run_swag_no_trainer.py). Once your data matches the format the script expects, it trains out of the box.

**Span selection**: adapt the extractive-QA example [run_qa_no_trainer.py](https://github.com/huggingface/transformers/blob/main/examples/pytorch/question-answering/run_qa_no_trainer.py), again by matching the data format.

The slides flag one trap: **use the start position to locate the answer, not a string search like `context.index("四縣腔客家話")`**. The answer text may appear more than once in the paragraph, and the first hit may not be the one that answers the question.

Two more tips:

- If `check_min_version("4.57.0.dev0")` in the example code blocks you, it is safe to comment it out (the allowed transformers version is 4.50.0).
- To save memory, use gradient accumulation rather than shrinking the batch. Effective batch size = batch_size × gradient_accumulation_steps; just reducing the batch size can hurt performance.

## Simple-baseline settings

The slides give reference settings for passing the Kaggle simple baseline:

| | Paragraph selection | Span selection |
|---|---|---|
| Pre-trained model | bert-base-chinese | bert-base-chinese |
| Max length | 512 | 512 |
| Batch size | 2 (1 per GPU × accumulation 2) | 2 (1 per GPU × accumulation 2) |
| Epochs | 1 | 1–3 |
| Learning rate | 3e-5 | 3e-5 |
| Running time | under 2 hours | under 1 hour |
| Hardware | RTX 3070, 8GB | RTX 3070, 8GB |

Two more hints: a public score of 0.78 has a high chance of passing the private strong baseline, and a longer max length (such as 512) usually performs better.

## Rules: what is and isn't allowed

**Allowed**:

- Train only on the provided data.
- Use publicly available pre-trained LMs.
- Allowed packages: Python 3.10 and the standard library, PyTorch 2.1.0, scikit-learn 1.5.1, nltk 3.9.1, tqdm, numpy, pandas, transformers 4.50.0, datasets 2.21.0, accelerate 0.34.2, evaluate, matplotlib, gdown, plus packages used in the sample code and dependencies of all of the above.

**Not allowed** (violations can mean zero or negative scores and school discipline):

- Cheating or plagiarism, including code from past ADL students on GitHub.
- Using test labels directly or indirectly.
- Models already trained on other QA or NLI datasets. The slides name `luhua/chinese_pretrain_mrc_macbert_large`, `uer/roberta-base-chinese-extractive-qa`, and `NchuNLP/Chinese-Question-Answering`, but the ban is not limited to those.
- Sharing models or predictions, publishing code before the deadline, or submitting to a previous year's ADL Kaggle page.

## Submission: Kaggle leaderboard plus NTU COOL

| Item | Deadline |
|---|---|
| Kaggle leaderboard | 9/29 (Mon) 23:59 |
| Code and report (NTU COOL) | 10/1 (Wed) 23:59 |

The HW1 slides say "No late submission." That differs from the general rule on page 9 of the [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) deck (25% off per day late); the assignment slides take precedence.

**Kaggle**: set your team name to your lower-case student ID.

**NTU COOL**: upload a zip of a folder named with your lower-case student ID, containing `README.md`, `run.sh`, `download.sh`, `report.pdf`, and all code used to train, predict, or plot report figures. Do not upload data or models.

- `download.sh`: downloads your models, tokenizers, and data (Dropbox with wget or Google Drive with gdown). At most 4GB, finishing within 1 hour; links must stay unchanged after the deadline and valid for at least 2 weeks; do nothing besides downloading.
- `run.sh`: takes three arguments, the paths to `context.json`, `test.json`, and the output `prediction.csv`, and must finish within 2 hours. TAs run `bash ./download.sh`, then `bash ./run.sh /path/to/context.json /path/to/test.json /path/to/pred/prediction.csv`.
- Execution environment: Ubuntu 20.04, 32GB RAM, RTX 2080 Ti with 11GB, 20GB free disk, Python 3.10, and **no network access** after `download.sh`.
- `README.md`: step-by-step training instructions; a missing or empty one costs 2 points.

Note the mismatch: the reference training GPU is an 8GB 3070, the grading machine an 11GB 2080 Ti with a 2-hour inference limit. Check both before reaching for a bigger model.

## Grading and the five report questions

**Model performance, 11%**:

- Kaggle simple baseline: public 2%, private 3%
- Kaggle strong baseline: public 2%, private 3%
- TAs reproduce your results without human intervention: 1%. If they still cannot after intervening, you get 0; reproduced results must match the baselines your final Kaggle submission passed.

**Report, 9% plus 2% bonus** (PDF):

| Question | Points | What to answer |
|---|---|---|
| Q1 Data processing | 2% | Explain your tokenizer's algorithm in your own words ("I called function X" does not count); how you convert character-level answer start/end to token positions; what rules turn start/end probabilities into a final answer |
| Q2 BERT and variants | 4% | Your model, its performance, loss, optimizer, learning rate, and batch size; then try another pre-trained LM (e.g. BERT → XLNet or BERT-wwm-ext) and compare architecture, pre-training loss, and so on |
| Q3 Curves | 1% | Loss and EM learning curves for the span-selection model, at least 5 points each |
| Q4 Pre-trained vs. not | 2% | Train a Transformer from scratch without pre-trained weights (either stage) and compare with BERT; shrink layers, hidden size, or heads if full size is too hard to train |
| Q5 Bonus | 2% | Replace the two-stage pipeline with one end-to-end model; the hint is to use models with larger context windows |

Q1 ties back to [part 5, Tokenization](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe-en), Q2 to [the BERT family](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en), and Q4 tests experimentally how much pre-training actually helps.

## Change log: what changed in the spec

The slides keep a full change log:

- 09/08: HW1 announced, Kaggle competition launched
- 09/09: allowed transformers version updated to 4.50.0
- 09/28: packages used in the sample code added to the allowed list
- 09/30: reproduction rules updated. You only need to upload a model that, via `download.sh` and `run.sh`, reproduces the same baselines your final Kaggle submission passed. If your final submission passed all simple baselines and the public strong baseline, a model that passes those is enough.

Questions go to the NTU COOL discussion board (encouraged in the slides) or the TA email with "[ADL2025 HW1]" at the start of the subject. Office hours: Fridays 15:00–16:00, CSIE Lab 524.

## What outside readers can do

Possible:

- Understand the task design and run both Hugging Face examples with the simple-baseline settings.
- Answer the five report questions, especially Q1 (tokenizer and span alignment) and Q4 (pre-trained vs. not), which need no Kaggle score.

Not possible or unknown:

- **Data**: only on Kaggle. This guide did not open the competition page, so it is unknown whether downloads still work. If you cannot get it, practice on any Chinese extractive-QA dataset in the same format, knowing the results are not comparable with the HW1 leaderboard.
- **Grading**: public/private leaderboards, baseline thresholds, TA reproduction, and report grading are for enrolled students only.

**Try this**: skip hyperparameter tuning at first. In `run_qa_no_trainer.py`, find an example where the answer text appears twice in the paragraph, print the character offsets your token start/end map back to, and confirm they point at the right occurrence. That is why the slides warn against `context.index`, and it is what Q1 asks you to explain.

## What this guide can and cannot confirm

Confirmed: all text and hyperlinks in the spec slides (checked via Google Slides text and pptx exports); the video's title, length, upload date, and description.

Not confirmed: the assignment video was not transcribed, so the TAs' spoken additions are not included. The Kaggle page, data-format details (the fields in `context.json` and `test.json`), and the exact simple/strong baseline thresholds do not appear in public materials. HW1's share of the final grade is not stated; Course Logistics only gives 60% for the three assignments combined.

Further reading: the full NLP project workflow (data, the Hugging Face text-classification Colab) is left to the series' final post on [TA recitations](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en). For contrast, the site's [CS224U HW2 open-domain QA guide](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy-en) takes the retrieval-plus-LLM route instead of BERT span extraction.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en) | Previous: [BERT and Its Family](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en) | Next: [Pre-training Families and Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Tried to check the HW1 briefing video against a transcript, but none is available, so the content was not checked; the article was left unchanged.

## References

- [NTU Yun-Nung Chen, Applied Deep Learning Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [HW1 spec slides: NTU ADL 2025 Fall HW1 (Google Slides)](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)
- [Video: ADL 2025 Fall Homework 1](https://youtu.be/DVjBNRHUWc0)
- [Hugging Face transformers example: run_swag_no_trainer.py (multiple choice)](https://github.com/huggingface/transformers/blob/main/examples/pytorch/multiple-choice/run_swag_no_trainer.py)
- [Hugging Face transformers example: run_qa_no_trainer.py (question answering)](https://github.com/huggingface/transformers/blob/main/examples/pytorch/question-answering/run_qa_no_trainer.py)
- [transformers 4.50.0 documentation](https://huggingface.co/docs/transformers/v4.50.0/en/index)
- [Hugging Face Model Hub: Chinese model search](https://huggingface.co/models?search=chinese)
- [250901_Course.pdf (Course Logistics, grading breakdown)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)
