---
title: "NLP & LLM Interview Guide: From Tokenization to RLHF"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, nlp, llm, rlhf]
lang: en
type: deep-dive
description: "Breaking down the high-frequency NLP and LLM topics in AI Engineer interviews — tokenization, pretraining, fine-tuning, RLHF, prompting, and LLM evaluation."
tldr: "The dividing line in LLM interviews is whether you've actually used these things. High-frequency topics: BPE tokenization logic and multilingual challenges, pretraining objectives (CLM vs MLM), three levels of fine-tuning (full/LoRA/prompt tuning), RLHF workflow and failure modes, prompting as engineering practice, and the difficulty of LLM evaluation with current methods."
series:
  name: "AI Engineer Interview Prep"
  order: 4
---

NLP and LLM questions are where depth gaps become most visible in AI Engineer interviews. Interviewers won't ask "What is a Transformer?" — they assume you know. They'll ask: Have you fine-tuned a model with LoRA? What problems did you encounter? How do you evaluate LLM output quality? What can go wrong with RLHF's reward model?

This post covers six high-frequency topics, each approached from "how interviews ask about this" rather than textbook knowledge review.

## Tokenization: More Than Chopping Text

Common interview questions: "Explain how BPE works," "Why does the same model use more tokens for Chinese than English?"

**BPE (Byte Pair Encoding)** works by starting from characters and repeatedly merging the most frequent adjacent pairs until the vocabulary reaches a target size. WordPiece is similar but uses likelihood rather than frequency to determine merge order. SentencePiece operates at the raw byte level without depending on pre-tokenized spaces, making it more friendly to Chinese, Japanese, Korean, and other non-space-delimited languages.

Multilingual is the favorite follow-up topic. English text in GPT-4's tokenizer averages about 1 token per 4 characters; Chinese might need 2-3 tokens per character. This directly affects effective context window length and inference cost. In an interview, being able to say "This is because training data is predominantly English, so Chinese characters have lower merge levels in the BPE merge table" is sufficient.

## Pretraining: CLM vs MLM

Common interview questions: "What's the difference between GPT and BERT's pretraining objectives?" "What are scaling laws?"

**Causal Language Modeling (CLM)** is the GPT family approach — predict the next token, seeing only left context. **Masked Language Modeling (MLM)** is BERT's approach — randomly mask 15% of tokens and predict them using bidirectional context.

The key difference: CLM naturally suits generation tasks (training and inference are both left-to-right), while MLM naturally suits understanding tasks (it uses complete context). Current mainstream LLMs all use CLM because generation capability is the core value proposition.

**Scaling laws** (Kaplan et al., 2020; Chinchilla, 2022) tell us that model loss has predictable power-law relationships with parameter count, training data size, and compute. Chinchilla's conclusion is that prior models were generally undertrained — given a fixed compute budget, you should train a smaller model on more data rather than training a massive model with insufficient data. Mentioning this perspective in interviews signals you understand "bigger isn't always better."

## Fine-tuning: Three Levels of Tradeoffs

Common interview questions: "How would you decide between full fine-tuning and LoRA?" "When is prompt tuning sufficient?"

**Full fine-tuning** updates all parameters. Best results but highest cost — requires optimizer state for the full model size; a 7B model needs roughly 60GB+ GPU memory. Suitable when you have large amounts of high-quality labeled data and the target task diverges significantly from the pretraining distribution.

**LoRA (Low-Rank Adaptation)** freezes original weights and only trains inserted low-rank matrices. Trainable parameters are typically 0.1%-1% of the original model, dramatically reducing memory requirements. QLoRA goes further by quantizing frozen weights to 4-bit, enabling 7B model fine-tuning on a single 24GB GPU. LoRA is currently the most common approach — you should be able to explain rank selection (typically 8-64) and which layers get adapters (usually attention Q and V matrices).

**Prompt tuning** doesn't modify model parameters — it only learns a trainable soft prompt prefix. Extremely few parameters (thousands), but effectiveness depends on a sufficiently large model (typically 10B+ to be effective). Suitable for multi-tenant scenarios — each customer gets their own prompt embedding while sharing the base model.

The common follow-up: "After LoRA fine-tuning, how do you deploy for inference?" LoRA weights can be merged back into the original model (zero additional inference cost), or you can use adapter serving to serve multiple LoRA adapters on the same base model simultaneously.

## RLHF: Workflow, Alternatives, and Failure Modes

Common interview questions: "What are the three steps of RLHF?" "What is reward hacking?"

The standard RLHF workflow: (1) SFT — supervised fine-tune a base model on high-quality demonstration data; (2) Reward Model — collect human preference comparison data (answer A is better than B), train a scoring model; (3) PPO — use the reward model's scores as reward signal to do reinforcement learning on the SFT model.

**DPO (Direct Preference Optimization)** is a 2023 alternative that skips reward model training, directly optimizing the policy with preference data. DPO is simpler and more stable but sacrifices some flexibility — you can't dynamically adjust rewards during training like with RLHF.

**Reward hacking** is a must-know follow-up: the model learns to maximize the reward score without actually doing what you want. For example, if the reward model scores longer answers higher, the model starts generating verbose but imprecise responses. Solutions include KL penalty (constraining the model from diverging too far from SFT) and periodically updating the reward model.

## Prompting: Engineering Practice, Not Trick Showcase

Common interview questions: "How do you manage prompts in production?" "When is chain-of-thought effective and when isn't it?"

**Few-shot prompting** places example demonstrations in the prompt for the model to understand the task format. The key is example selection — examples semantically close to the test input work best (this is the value of dynamic few-shot selection).

**Chain-of-thought (CoT)** has the model output its reasoning process before giving an answer. Significantly effective for math and multi-step logical reasoning tasks, but can actually reduce accuracy on simple classification tasks (adding unnecessary generation steps). Saying "I decide whether to use CoT based on task type" is better than "CoT is very effective."

**System prompt design** is an engineering problem in production: version control, A/B testing, and compatibility across model upgrades. Mentioning "We manage system prompts like code with version control and regression tests" earns bonus points.

## LLM Evaluation: The Hardest Part

Common interview questions: "Does low perplexity mean the model is good?" "How do you evaluate a chatbot's answer quality?"

**Perplexity** measures the model's ability to predict the next token. There can be a huge gap between perplexity and user-perceived quality — a model with very low perplexity might generate fluent but harmful content. Perplexity is suitable for comparing different checkpoints of the same architecture, not for cross-architecture comparison.

**Human evaluation** is the gold standard for quality assessment but expensive and slow. A common approach is A/B testing — showing humans two model responses and having them pick the better one. The challenge is that inter-annotator agreement is usually low, requiring multiple annotators and clear scoring criteria.

**LLM-as-judge** uses another strong model (like GPT-4) to score. Advantages: fast and cheap. Disadvantages: systematic biases — LLMs tend to prefer longer answers, well-formatted answers, and answers in their own style. Being able to mention these biases and mitigations (randomizing presentation order, consensus from multiple judge models) in an interview is excellent.

## Common Follow-ups

- "Transformer attention complexity is O(n²) — how can you reduce it?" — Mention Flash Attention (IO-aware exact attention implementation), sliding window attention (Mistral), and linear attention, with their respective tradeoffs.
- "How do you handle hallucination?" — No universal solution. Effective approaches include RAG (having the model answer based on retrieved documents), constrained generation (restricting output format), and citation verification (having the model output sources for verification).
- "If deploying an LLM, would you choose an API service or self-host?" — Depends on data privacy requirements, QPS, latency needs, and cost. You should be able to sketch a rough TCO comparison in an interview.

## Practice Question

### Question

"Your team has a 7B parameter base model and needs it to answer customer service questions. You have 10,000 labeled QA pairs. How would you approach fine-tuning?"

**Source**: Anthropic engineering interview　**Difficulty**: Advanced　**Round**: onsite ML deep dive

### Solution Framework

1. **Clarify the problem**: Ask the interviewer — what answer quality level is needed? Any GPU budget constraints (how many A100s)? Need to preserve the base model's general capabilities? What's the deployment environment (on-premise / cloud)?
2. **Build a framework**: Three levels of fine-tuning — full fine-tuning (all parameters), parameter-efficient (LoRA/QLoRA), prompt tuning. Choose based on resources and requirements.
3. **Go deep**: 10,000 QA pairs is moderate scale for fine-tuning. Full fine-tuning 7B requires at least 2× A100 (80GB) and risks overfitting. LoRA trains only 0.1-1% of parameters, needs just 1× A100, and preserves base model capabilities.
4. **Close**: Mention evaluation strategy — use a held-out set for automatic evaluation with ROUGE/BERTScore, then LLM-as-judge or human spot-checks for quality verification.

### Sample Answer (as you'd say it in an interview)

> **I'd use LoRA fine-tuning with rank 16-64, targeting the attention Q/K/V projection matrices.** Three reasons. First, full fine-tuning a 7B model requires about 56GB GPU memory (14GB parameters + 42GB optimizer states), needing at least 2× A100-80GB. LoRA only trains low-rank matrices, dropping memory to about 20GB — one A100 is sufficient. Second, 10,000 QA pairs isn't a lot; full fine-tuning 7B parameters easily overfits. LoRA's few trainable parameters (roughly 10M vs. 7B) provide natural regularization. Third, LoRA adapters can be deployed independently with the base model untouched, making it easy to add adapters for other tasks later.
>
> **Specific training approach.** Data format uses an instruction-following template (`<|system|> You are a customer service agent... <|user|> {question} <|assistant|> {answer}`). Split the 10,000 examples into 8,500 train / 1,000 validation / 500 test. Train for 3-5 epochs with learning rate 1e-4 to 2e-4 using cosine schedule. Early stop if validation loss plateaus by epoch 2.
>
> **If the interviewer asks "Would QLoRA work?"** — QLoRA quantizes the base model to 4-bit before adding LoRA, cutting memory by another half, running on consumer GPUs (24GB). The tradeoff is some precision loss from quantization, but for 7B models the loss is typically <1%. If GPU budget is tight, I'd use QLoRA.

### Self-Check Rubric

| Checkpoint | Mentioned? |
|-----------|-----------|
| Compared full fine-tuning vs LoRA resource requirements | |
| LoRA specifics (rank, target modules) | |
| Impact of 10K data size on fine-tuning strategy | |
| Training hyperparameters (LR, epochs, schedule) | |
| Overfitting risk and mitigation | |
| Bonus: mentioned QLoRA or adapter deployment strategy | |

## References

- [Sennrich et al. — Neural Machine Translation of Rare Words with Subword Units (2016)](https://aclanthology.org/P16-1162/) — The original BPE tokenization paper; core source for interview tokenization questions
- [Hu et al. — LoRA: Low-Rank Adaptation of Large Language Models (2021)](https://arxiv.org/abs/2106.09685) — The original LoRA paper explaining how low-rank decomposition dramatically reduces LLM fine-tuning cost
- [Rafailov et al. — Direct Preference Optimization (2023)](https://arxiv.org/abs/2305.18290) — DPO as an RLHF alternative; core reference for RLHF vs DPO comparison in interviews
- [Zheng et al. — Judging LLM-as-a-Judge (2023)](https://arxiv.org/abs/2306.05685) — Systematic analysis of LLM-as-judge evaluation including bias sources and mitigation strategies
