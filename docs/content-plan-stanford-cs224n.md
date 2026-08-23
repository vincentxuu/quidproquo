# Stanford CS224N Winter 2026 逐講內容計畫

- Target offering: Winter 2026
- Official course site: <https://web.stanford.edu/class/cs224n/>
- Unit: regular lecture / scheduled instructional meeting
- Material fidelity: L2（19 個正規單元都有課表；多數有公開投影片與閱讀，錄影限修課者）
- Existing overview: `src/content/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning{,-en}.md`
- Series: `Stanford CS224N 導讀`; existing overview is order 1, lectures use continuous orders 2–20.

## Editorial contract

每篇只對應 manifest 中一個正規單元，寫明 Winter 2026、官方 lecture 編號、日期、課表可確認的講者資訊、公開材料與缺口。非 guest 單元一律標為 course staff／官方課表未列講者，不把 deck credit 推定為當日講者。正文依投影片 agenda 展開，不以 2019 或 Spring 2024 錄影補寫 2026 講者沒有公開的內容。中英文配對必須有相同的 `series.order`、章節骨架與來源集合。

## Official manifest

| Lecture | Date | Official unit | Speaker | Public artifact | Series order |
|---:|---|---|---|---|---:|
| 1 | 2026-01-06 | History of NLP | course staff; official schedule does not name lecturer | intro + history slides | 2 |
| 2 | 2026-01-08 | Word Vectors | course staff; official schedule does not name lecturer | slides + notes/readings | 3 |
| 3 | 2026-01-13 | Backpropagation and Neural Network Basics | course staff; official schedule does not name lecturer | slides + notes/readings | 4 |
| 4 | 2026-01-15 | Language Models and RNNs | course staff; official schedule does not name lecturer | slides + notes/readings | 5 |
| 5 | 2026-01-20 | Transformers | course staff; official schedule does not name lecturer | slides + notes/readings | 6 |
| 6 | 2026-01-22 | Final Projects: Custom and Default; Practical Tips | course staff | slides | 7 |
| 7 | 2026-01-27 | Pretraining (Scaling, Systems, Data) | course staff | slides/readings | 8 |
| 8 | 2026-01-29 | Post-training (RLHF, SFT, DPO) | course staff | slides/readings | 9 |
| 9 | 2026-02-03 | Efficient Adaptation (Prompting + PEFT) | course staff | slides/readings | 10 |
| 10 | 2026-02-05 | Agents, Tool Use, and RAG | course staff | slides/readings | 11 |
| 11 | 2026-02-10 | Benchmarking and Evaluation | course staff | slides/readings | 12 |
| 12 | 2026-02-12 | Reasoning 1 | course staff | slides/readings | 13 |
| 13 | 2026-02-17 | Reasoning 2 | course staff | slides/readings | 14 |
| 14 | 2026-02-19 | Tokenization and Multilinguality | Julie Kallini | slides/readings | 15 |
| 15 | 2026-02-24 | Interpretability | Been Kim | readings; slide link absent on public page | 16 |
| 16 | 2026-02-26 | Social and Broader Impacts of NLP (Risks) | course staff | slides | 17 |
| 17 | 2026-03-03 | Multimodality | Luke Zettlemoyer | readings; no public slide link | 18 |
| 18 | 2026-03-05 | Tinker and LoRA Without Regret | John Schulman | title only; no public artifact linked | 19 |
| 19 | 2026-03-10 | Open Questions in NLP 2026 | course staff | slides | 20 |

Friday Python/PyTorch/Hugging Face tutorials、2026-03-12 No Lecture、作業截止與 poster session 不算 regular lectures。Lecture 15、17、18 必須依公開缺口降格處理，不得靠別學期影片推測。

## Batch 1

Lecture 1–5，各一組 zh-TW/en，共 10 個內容檔。統一日期 2026-08-22，category `ai`，series orders 2–6。

## Completion audit (2026-08-22)

| Evidence | Expected | Actual | Result |
|---|---:|---:|---|
| Official regular units | 19 | 19 manifest rows | complete |
| zh-TW lecture posts | 19 | orders 2–20 | complete |
| English lecture posts | 19 | orders 2–20 | complete |
| Bilingual order mapping | 19 pairs | 19 identical orders | complete |
| Missing-material disclosure | Lectures 15, 17, 18 | explicit in both languages and SOURCES | complete |

Completion is **19/19 accounted units**, not a claim of uniform material depth. Lecture 15 and 17 are official-reading maps because current slides are absent; Lecture 18 is a minimal source-bound record because the official page publishes only its date, title, and speaker. Tutorials, no-lecture rows, deadlines, and poster events remain excluded.

### Editorial depth revision evidence

- Revision batch A (Lectures 1–5): zh-TW files expanded past the 6,000-character editorial target using only already-read Winter 2026 slides, official readings, and public Assignments 1–3.
- English pairs preserve matching conceptual skeletons, exercises, material-gap statements, and source sets; they are not padded to mirror Chinese character counts.
- Revision batch B (Lectures 6–10): zh-TW files expanded past 6,000 characters with project methodology, objective-level explanations, systems decomposition, failure taxonomies, and reproducible exercises; English headings and references mirror each pair.
- Revision batch C (Lectures 11–14): zh-TW files expanded past 6,000 characters with evaluation protocols, reasoning/inference algorithms, and multilingual tokenizer audits; English headings and references mirror each pair.
- Documented exception — Lecture 15: remains below 6,000 characters because Winter 2026 publishes no slides or agenda. It stays a source-bounded map of the five official readings; padding from older offerings or unrelated external material is prohibited.
- Revision batch D: Lecture 16 and 19 expanded past 6,000 characters from their Winter 2026 decks. Lecture 17 and 18 remain documented exceptions because neither publishes a current deck or agenda; Lecture 17 is limited to the five public sources actually read and cited (the other six schedule-listed readings are not claimed as read), and Lecture 18 to date/title/speaker facts.

### Provenance correction audit

- All 38 openings now link the official Winter 2026 schedule inline; slide-backed articles also link their current-quarter deck inline.
- Non-guest lectures 1–13, 16, and 19 use “course staff / official schedule does not name the lecturer.” Only schedule-confirmed guests Julie Kallini, Been Kim, Luke Zettlemoyer, and John Schulman retain names.
- Major external papers/tools are linked at first substantive mention; Lecture 15 links all five reviewed readings, while Lecture 17 explicitly narrows its claims to the five reviewed sources in its reference list.

### 19/19 depth audit

| Depth status | Lectures | Count |
|---|---|---:|
| zh-TW >= 6,000 characters, slide-backed | 1–14, 16, 19 | 16 |
| documented source-bounded exception | 15, 17, 18 | 3 |
| bilingual skeleton/reference parity | 1–19 | 19 |

All 19 regular units now satisfy either the editorial depth target or a material-fidelity exception. An exception is not permission to pad: it forbids importing older-offering recordings/slides or unrelated external content as Winter 2026 lecture material.
