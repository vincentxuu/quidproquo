# CS224N Winter 2026 source manifest

查證日期：2026-08-22。Canonical offering 固定為 Winter 2026。

## Primary sources read

- [Official Winter 2026 course page](https://web.stanford.edu/class/cs224n/) — 完整讀取 schedule、材料連結、guest 講者與公開錄影限制；非 guest rows 未列講者，因此不以 deck credits 推定 lecturer。
- [Lecture 1 intro slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-intro.pdf) — 課程目標與 Lecture 1 agenda。
- [Lecture 1 history slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture01-history.pdf) — 四個 NLP 時代與歷史案例。
- [Lecture 2 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf) — word2vec、梯度、count-based vectors、evaluation。
- [Lecture 3 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture03-neuralnets.pdf) — neural nets、matrix calculus、backpropagation。
- [Lecture 4 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture04-rnnlm.pdf) — language modeling、RNN、gradient problems、machine translation。
- [Lecture 5 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture05-transformers.pdf) — recurrence-to-attention、self-attention、Transformer、limitations。
- [Lecture 6 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture06-final-project.pdf) — Transformer recap、project types、topic/data selection、assessment。
- [Lecture 7 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture07-pretraining.pdf) — subwords、decoder/encoder/encoder-decoder pretraining、in-context learning。
- [Lecture 8 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture08-posttraining.pdf) — instruction tuning、RLHF、reward modeling、DPO、feedback sources。
- [Lecture 9 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture09-peft.pdf) — prompting、pruning、LoRA、prompt tuning、adapters。
- [Lecture 10 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture10-rag-agents.pdf) — QA/RAG、planning、memory、tools、agent data/evaluation。
- [Lecture 11 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture11-evaluation.pdf) — benchmark lifecycle/design、metrics、LLM judges、contamination and Goodhart risks。
- [Lecture 12 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture12-reasoning-part1.pdf) — decoding、DeepSeek-R1、PPO/GRPO/DAPO、reasoning limitations。
- [Lecture 13 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture13-reasoning-part2.pdf) — speculative decoding、policy drift/distillation、long context、test-time scaling。
- [Lecture 14 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture14-guest-julie-tokenization-multilinguality.pdf) — tokenization choices、BPE、failure cases、multilinguality and fairness。
- Lecture 15 has no current public slide link. Read the official schedule entry and all five linked suggested readings; the article is a source-bounded reading map, not a reconstructed lecture.
- [Lecture 16 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture16-impact-on-humanity.pdf) — hallucination、AI-assisted creativity、workforce、value alignment。
- Lecture 17 has no public slides. The official schedule lists four suggested and seven optional readings, but the article only claims review of five cited sources: Visual Sketchpad, Chameleon, Transfusion, Mixture-of-Transformers, and Multimodal RewardBench. The remaining six are not described as read or summarized.
- Lecture 18 has no public slides, readings, or agenda. Only the official title, date, and speaker are treated as lecture facts; external Tinker/LoRA context is deliberately not used to reconstruct the session.
- [Lecture 19 slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture19-open-questions.pdf) — smart scaling、ProRL、Prismatic Synthesis、RL as pretraining、collaboration and open questions。

## Material gaps

- Winter 2026 recordings are Canvas-only and unavailable to non-enrolled readers.
- Articles therefore reconstruct only what the public slides and official reading lists establish; they do not claim the lecturer's spoken examples, timing, or classroom discussion.
- Older public recordings are different offerings and are not used to fill Winter 2026 gaps.
- Lecture 7 and 8 deck covers retain stale internal labels (“Lecture 6” and “Lecture 7”); the Winter 2026 schedule, dates, filenames, and sequence establish them as regular units 7 and 8.

## Regular-lecture count

The official schedule yields 19 instructional units. Tutorials, deadlines, the no-lecture row, and the final poster session are excluded. The exact manifest and continuous series-order mapping are recorded in `docs/content-plan-stanford-cs224n.md`.

## Completion audit

- Manifest regular units: 19
- zh-TW lecture articles: 19 (`series.order` 2–20)
- English lecture articles: 19 (`series.order` 2–20)
- L2/L3 slide-based units: 16
- Strict source-bounded gap units: Lecture 15, 17, 18
- Missing or duplicate manifest IDs: none

Status: **19/19 bilingual units accounted for**. This means every official unit has a paired article or explicit gap artifact; it does not claim unavailable recordings or slides were recovered.

## Depth revision log

- Batch A, Lectures 1–5: expanded into derivations, architecture/data trade-offs, failure analysis, and executable exercises.
- Evidence reused: Lecture 1–5 official Winter 2026 decks, official reading links already listed above, and public A1/A2/A3 artifacts described by the course overview.
- Excluded: Canvas recordings, classroom Q&A, and older-offering spoken content.
- Batch B, Lectures 6–10: expanded from the already-read final-project, pretraining, post-training, PEFT, and RAG/agent decks plus their official reading links. No new gated or older-offering material was used.
- Batch C, Lectures 11–14: expanded only from their already-read Winter 2026 decks and official reading lists.
- Lecture 15 editorial exception: 2,530-character zh-TW source-bounded artifact retained. No current slides/agenda exist, so the 6,000-character target does not apply; do not import the commented older-offering slide link or unrelated materials.
- Batch D: Lecture 16 and 19 expanded exclusively from their already-read current decks. Lecture 17 and 18 remain explicit exceptions: L17 maps only its five reviewed/cited sources and explicitly excludes the other six schedule-listed readings from summary claims; L18 preserves official date/title/speaker and unknowns.

## Clean-review provenance correction

- Verified all 38 opening provenance paragraphs contain an inline official schedule link; every available Winter 2026 deck is also linked inline.
- Removed named-speaker attribution from every non-guest lecture because the official schedule does not identify those lecturers. Retained only the four confirmed guest names for Lectures 14, 15, 17, and 18.
- Added first-substantive-mention links for the reviewed Lecture 15 and Lecture 17 papers/tools. Lecture 17 remains a five-source subset, not an eleven-paper review.

## Final depth evidence

- Depth-complete slide-backed lectures: 16/16 at >= 6,000 zh-TW characters.
- Material-limited exceptions: 3/3 (L15, L17, L18), each bilingual with matching skeleton/sources and explicit unknowns.
- Manifest coverage: 19/19 zh-TW + 19/19 English.
- Prohibited evidence used to meet depth: none.
