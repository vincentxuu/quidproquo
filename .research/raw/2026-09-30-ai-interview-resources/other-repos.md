# AgentB notes: AI/ML interview prep GitHub repos (cloned 2026-09-30)

Method: `git clone --depth 100`, then `git fetch --unshallow` for the two repos that were truncated (alirezadir, khangich), so all commit counts below are **full history**. Star counts are the 2026-09-28 figures supplied by the caller (not re-checked; the GitHub API was not used).
"Last 12 months" = `git log --since=2025-09-30`. Contributors = unique `%an` (author names; the same person can appear under two names).
External links (zsxq, rebrand.ly, mlengineer.io, masteringllm.com) **could not be fetched**: the agent proxy rejected them and Groundlane errored. Paywall status therefore comes from the repo text only.

---

## 1. llmgenai/LLMInterviewQuestions (1.9k)
- **Structure:** one `README.md` (273 lines) plus one image. 117 bolded question bullets + 2 "Case Study" bullets = 119 (`grep -cE '^- \*\*' README.md`), in 16 sections. Title says "100+".
- **Source:** claims "used by top companies like Google, NVIDIA, Meta…curated with insights from real-world scenarios" (README L3). There is no per-question provenance and no citations.
- **Freshness:** 13 commits, 2024-12-26 → 2025-02-12. Single author ("Mastering LLM"). 0 commits in the last 12 months. Full history (not shallow).
- **Coverage:** Prompting yes; RAG, chunking, embeddings and vector DB yes (strong); transformer internals partial (includes a "How to calculate size of KV cache" question); SFT/RLHF/DPO yes; eval partial (4 questions); deployment/inference partial (3 questions); agents partial (6 questions on ReAct, Plan-and-Execute, "OpenAI functions vs LangChain Agents"); classic ML no; coding/DSA no; behavioral no; LLM system design partial (case studies only). 2026 topics: no MCP, no harness, no reasoning-model or AI-assisted-coding content.
- **Answers:** **none in the repo.** README L9–11 and the last line send readers to masteringllm.com, a paid course, with the code `LLM50` for 50% off.
- **Commercial:** the whole repo is a paid-course funnel.
- **License:** no LICENSE file.
- **Red flags:** answers are behind a paywall. The question "Why does quantization not decrease the accuracy of LLM?" has a false premise. Agent questions are framed around the 2023–24 "OpenAI functions vs LangChain Agents" era.

## 2. KalyanKS-NLP/LLM-Interview-Questions-and-Answers-Hub (1.1k)
- **Structure:** README table of 115 questions (Q1–Q115; `grep -cE '^\| Q'`). Answers are in `Interview_QA/QA_x-y.md`, 3 questions per file, 39 files, about 14.9k words in total (roughly 100–130 words per answer).
- **Source:** single author. No citations. The only external links in the answer files point to the author's X, LinkedIn, ko-fi, Substack and other repos.
- **Freshness:** 17 commits, 2025-12-17 → 2026-02-09. The last commit is "Change book discount from 25% to 50%". Single author. Not shallow.
- **Coverage:** transformer fundamentals yes (Q1–35, including KV cache Q3 and Q5); inference/serving yes (Q36–73: continuous batching, speculative decoding, FlashAttention, diffusion LMs); prompting yes; fine-tuning, LoRA and alignment yes; pretraining partial. Agents: only Q87 (ReAct). RAG: only Q97–99 (it has a separate repo). Eval no. Classic ML, coding/DSA and behavioral no. 2026 topics: no MCP, harness or agent design; reasoning models are only touched via CoT.
- **Answer samples:**
  - Q3 (KV cache, `Interview_QA/QA_1-3.md`): correct but only two paragraphs, with no memory formula.
  - Q26 (`QA_25-27.md`): the question itself is flawed ("Explain why self-attention in the decoder is referred to as cross-attention"), and the answer goes along with the conflation of masked self-attention and cross-attention.
  - Duplicate question: Q11 and Q34 are identical ("How do Transformer models address the vanishing gradient problem?").
- **Commercial:** the README pushes a Gumroad book ("100+…questions…with in-depth explanations"), coupon LLMQA25 at 50%. Also a free AIxFunda Substack newsletter. Every answer file ends with a promo block for the llm-engineer-toolkit repo.
- **License:** Apache-2.0.
- **Red flags:** short, uniform-length answers [推論: could be LLM-assisted; not provable]. There is a duplicate question, a flawed-premise question, and the book is an upsell of the same content.

## 3. KalyanKS-NLP/RAG-Interview-Questions-and-Answers-Hub (645)
- **Structure:** 105 questions (README table), 37 answer files, about 13.5k words.
- **Freshness:** 7 commits, all on 2025-12-21 (initial upload, never updated). Single author.
- **Coverage:** RAG only, and deep within that scope. Topics: chunking, query transformation (HyDE, HyPE), hybrid search, ANN, embedding quantization, rerankers (Q61–73), IR metrics (MRR, MAP, NDCG), and RAGAS-style metrics (context precision/recall, faithfulness, response relevancy; Q74–105, about 30% of the repo). Q22 compares reasoning and non-reasoning LLMs for RAG. There is no agentic RAG, GraphRAG system design, MCP or serving content.
- **Answer samples:**
  - Q2 (RAG vs long context): reasonable but shallow; it lists 3 reasons and gives no numbers.
  - Q83 (Context Precision@10 for relevant chunks at positions 2, 4, 6, 8): the arithmetic is correct (0.5) under the RAGAS definition.
- **Commercial:** links to the sibling repos, ko-fi and the newsletter. The README has no book pitch (unlike the LLM hub).
- **License:** Apache-2.0.
- **Red flags:** the repo was uploaded in a single day with no updates. Metrics coverage is tied to RAGAS terminology without citing RAGAS.

## 4. wdndev/llm_interview_note (15.2k, Simplified Chinese)
- **Structure:** a docsify site (`index.html`, `_sidebar.md`) with 10 content chapters plus 98 (course notes from Tsinghua's LLM open course) and 99 (references). 96 `.md` files; chapter file counts are 01:13, 02:19, 03:2, 04:13, 05:10, 06:9, 07:7, 08:4, 09:4, 10:3, 98:8. `pdf_note/` holds 12 PDFs. There are about 890 numbered `##`/`###` headings, but that count mixes questions with section headings, so it is not a true question count. The repo is 283MB because of images.
- **Source:** README says "由本人参考网络资源整理" and "相关答案为自己撰写". `99.参考资料/` cites km1994/LLMs_interview_notes, WeChat and Zhihu articles. `08.检索增强rag/大模型agent技术/大模型agent技术.md` is a write-up of a Bilibili talk (L3–4 link the video and a WeChat article). There is no per-question provenance.
- **Freshness:** 85 commits, author dates 2023-11-08 → 2026-06-13. The last merge (commit date) is 2026-06-14. Recent commits are community typo, LaTeX and RLHF-note fixes (dongtaishi, AlkaidLu, Minting Gao). Five commits in the last 12 months; 11 author names. The core content structure dates from 2023–24.
- **Coverage:**
  - LLM fundamentals yes: attention, MHA/MQA/GQA with PyTorch code, RoPE, LayerNorm, MoE, LLaMA/ChatGLM.
  - Distributed training yes (strong: DP/PP/TP/SP, DeepSpeed).
  - SFT/PEFT yes; RLHF/PPO/DPO yes.
  - Inference yes: vLLM, TGI, TRT-LLM, FasterTransformer.
  - RAG partial (2 files); agents partial (1 file, no function calling or MCP — grep found no "tool" or "function call" matches).
  - Eval and hallucination partial; CoT and LangChain partial.
  - Classic ML, DSA coding, behavioral and LLM system design: no.
  - 2026 topics: no. The README only links out to a separate tiny-mcp repo.
- **Answer samples:**
  - `06.推理/1.推理/1.推理.md` Q1 ("why does VRAM grow and stay occupied during inference"): the answer never mentions the KV cache, the main cause. Q6 lists "gradient clipping" as a way to save memory, which is wrong. The text is generic and reads like a ChatGPT answer [推論].
  - `02.大语言模型架构/MHA_MQA_GQA/MHA_MQA_GQA.md`: correct and fairly deep, with formulas and code.
  - Overall quality is uneven.
- **Commercial:** a WeChat public-account QR code; no paywall.
- **License:** none.
- **Red flags:** the sidebar's "真实面试题" (`/ch1`) points to a path that does not exist in the repo. Some answers are outdated or wrong. The core content has been frozen since about 2024.

## 5. km1994/LLMs_interview_notes (2.6k, Simplified Chinese; "LLMs 千面郎君")
- **Structure:** one README of 1431 lines, organized into 31 chapters (`^## `). It holds 916 bullet lines of question outlines and 111 "点击查看答案" links. Every answer link (224 URLs) points to **articles.zsxq.com** (知识星球). The repo contains no answers itself.
- **Source:** "作者们根据个人面试和经验总结" (README L3). No citations.
- **Freshness:** 25 commits, 2023-09-16 → 2024-12-26. Contributors: KM/km1994/杨夕 (probably the same person or team). 0 commits in the last 12 months. Most commit messages are just "gx".
- **Coverage:** broad LLM coverage, including chapters on RAG (5.x, quite detailed: PDF parsing, chunking, RAG eval), agents (ch14), KV cache (ch29), inference acceleration, eval, RLHF, distributed training, VRAM, multimodal, NLP and o1 (ch31, which also covers test-time scaling). There is no classic ML depth, no DSA and no behavioral content. 2026 topics: reasoning models partial (o1-era only); no MCP, harness or AI coding.
- **Answers:** off-repo on zsxq. It **could not be verified** whether these are free or member-only (the fetch was blocked). [推論] zsxq is usually a paid-community platform. The README also pushes a WeChat group via a personal WeChat ID.
- **License:** Apache-2.0, though the repo contains only question outlines.
- **Red flags:** the repo is a question index whose answers live on a third-party platform (possible paywall or link rot). It has not been updated since 2024-12.

## 6. alirezadir/AIMLInterviews (formerly Machine-Learning-Interviews, 9.8k)
- **Structure:** 5 chapters plus resources (README table):
  1. `src/lc-coding.md` (DSA strategy; LeetCode target of about 350 problems).
  2. `src/MLC/ml-coding.md`: 38 runnable Python problems with solutions and pytest tests across `classic_ml`, `language_models` (kv_cache, top-k/top-p, BPE, attention), `genai` (LoRA, DPO loss, RAG retrieval) and `agentic_ai` (tool registry, bounded agent loop, retry with idempotency, sliding-window memory), plus 17 notebooks and a 931-line `pytorch-ml-coding.md`.
  3. `src/ml-fundamental.md` (286 lines): a topic outline plus about 40 sample questions **without answers**.
  4. `src/MLSD/`: a 9-step template, about 15 worked designs (ads ranking, video recommendation, search…; `mlsd-typeahead.md` is empty, 0 lines) and a "GenAI / LLM System Design (2026)" section.
  5. `src/behavioral/behavior.md` (23 lines, plus an xlsx worksheet).
  
  Also an `MCP/` npm package (`aimlinterviews-mcp`) that acts as an AI tutor, and CN and FA translations.
- **Source:** the author's own experience (README: offers from Meta, Google, Amazon, Apple and Roku in 2020, and Amazon and Apple in 2025). It cites external courses and articles. There is no per-question provenance, and the `company` column in the MLC tables is "—".
- **Freshness:** 167 commits in full history, 2021-01-30 → **2026-09-23**. 36 commits in the last 12 months, almost all by the author; 10 contributor names. Very active in 2026-06 to 2026-09 (renamed 2026-07-28).
- **Coverage:**
  - Classic ML yes; DL yes; LLM fundamentals yes (KV cache, GQA/MLA, RoPE, FlashAttention, MoE).
  - Post-training yes (SFT/DPO/SimPO/KTO/ORPO/GRPO/RLVR table).
  - RAG yes (in MLSD); agents yes (MLSD section plus 6 agentic coding problems); eval yes ("eval is the new system design", RAG triad, LLM-as-judge); inference yes.
  - LLM system design yes; DSA yes; behavioral partial.
  - 2026 topics: reasoning models and RLVR yes; coding-agent design yes (as an MLSD prompt); MCP only as the repo's own tutor tool, not as interview content. **AI-assisted coding rounds: not covered** — lc-coding.md still says "without relying heavily on an IDE". Harness engineering: no explicit coverage.
- **Answer samples:**
  - `src/MLC/problems/language_models/kv_cache.py`: a correct minimal cache with tests; at interview level.
  - The ML fundamentals LLM section (`ml-fundamental.md` L153–199): concise, accurate talking points, not full answers.
  - The fundamentals questions themselves have no answers.
- **Commercial:** the README top promotes 1:1 paid coaching and mock interviews at aimlinterviews.io. The behavioral chapter links tryexponent (paid). The content itself is free.
- **License:** MIT.
- **Red flags:** mild. There is an empty typeahead file, a coaching funnel, and "about 10% of LLM topics are bullets without answers" [推論 on the ratio]. Much of the agentic system-design depth sits in a separate repo (alirezadir/Agentic-AI-Systems, not examined).

## 7. khangich/machine-learning-interview (12.8k)
- **Structure:** README (211 lines, the study plan) plus `questions.md` (about 105 list lines: 9 "understand-level" questions in a table plus "List 99 ML questions", **without answers**), `appliedml.md` (350 lines of company ML use-case links, sourced from eugeneyan/applied-ml per its L2), `design.md`, `leetcode.md`, `faqs.md` and `sample/` (backprop.py and 2 notebooks). The 6 MLSD case studies in the README all link to `rebrand.ly/mldesign` (the paid course).
- **Source:** the author's experience (a 10-year SWE/MLE with offers from Google, LinkedIn and others). It is mostly a link list.
- **Freshness:** 323 commits in full history, 2020-08-10 → 2023-08-31. By year: 208 in 2020, 95 in 2021, 18 in 2022, 2 in 2023. 0 commits in the last 12 months. 7 author names (100/101 of the last 100 by Khang Pham).
- **Coverage:** classic ML, stats, DL basics yes; ML system design (recsys, ads, delivery ETA) yes; LeetCode and SQL yes; behavioral no. **No LLM content at all** (grep finds only GPT-3/BERT paper links). No 2026 topics.
- **Answers:** none for the question lists. Design solutions sit behind a paid course (educative, interviewquery, or $50 via PayPal/GitHub Sponsors per `course.md`).
- **Commercial:** heavy. Amazon books, educative course, mlengineer.io blog and mock interviews; 24 `rebrand.ly/mldesign` links.
- **License:** none.
- **Red flags:** effectively abandoned (2023). It links a pirated *Fluent Python* PDF (index-of.es) in the README Programming section. Link-shortener links could not be verified and are at risk of rot.

## 8. chiphuyen/ml-interviews-book (4.8k)
- **Structure:** a GitBook (`SUMMARY.md`, `contents/`, with the built `_book/` committed).
  - Part I (Ch 1–4): ML roles, the interview pipeline, behavioral and the interviewer mindset, compensation and negotiation, resources.
  - Part II (Ch 5–8): Math, CS, ML workflows, ML algorithms.
  - There are 321 difficulty-tagged sub-questions ([E]/[M]/[H]) across 17 files; README says "over 200". Some questions carry **Hint**s.
- **Source:** Chip Huyen's experience as a candidate and interviewer (NVIDIA, Snorkel), plus friends' and students' interviews. It cites resources per topic. There is no per-question provenance.
- **Freshness:** 148 commits, 2021-02-04 → 2025-03-21 (last: "Add book cover"). Substantive work ended 2023-10. By year: 44 in 2021, 19 in 2022, 84 in 2023 (mostly Reza Mahmoudi's Part I edits), 1 in 2025. 20 author names.
- **Coverage:** classic ML yes; math and stats yes; CS partial; DL partial (self-attention appears only as 4 questions in `contents/8.2.4-other.md`). The behavioral, process and negotiation content is unique and strong. No LLM, RAG, agents, eval-of-LLMs or serving content. ML system design only via links to other material. No 2026 topics.
- **Answers:** `contents/0-about-the-answers.md` says the draft has answers for "about 10%" of questions. **In the repo, `answers/chapter5-9.md` are all 0-byte files**, and no `<details>` or answer blocks were found; only hints are present. Readers are pointed to a Discord for answers.
- **Commercial:** none (free book).
- **License:** no LICENSE file; README ends "Copyright ©2021 Chip Huyen".
- **Red flags:** the answers were never delivered. It predates the LLM era and is still strong for the process/offer chapters.

---

## Couldn't verify
- Whether the zsxq answer pages (km1994) are paywalled or live.
- The live status of the rebrand.ly and mlengineer.io links (khangich).
- The masteringllm.com course price and content (llmgenai).
- The Gumroad book price (Kalyan).
- Star counts (taken from the caller).
- Whether Kalyan's answers are AI-generated (inference only).
- alirezadir's companion repo Agentic-AI-Systems (not cloned).
