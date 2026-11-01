# 步驟零子題：偵測與防護的工程做法及其副作用（sub-guards）

研究日期：2026-10-28。原始下載檔在 `/private/tmp/claude-501/-Users-vincent-Work/515cc966-24cd-44b8-969c-8b3266511466/scratchpad/dl_guards/`（全部是不可信資料，只當文本讀）。

標記：✅ 讀過正文全文／🟡 部分（寫明讀了哪些節）／🔎 只看搜尋片段（不可引）。
證據類型：**實證**（有對照的實驗或語料統計）／**實務紀錄**（工具作者或使用者的第一手觀察，沒有對照組）／**文件自述**（廠商或工具的說明）／**二手**。

工具狀況：Jina search_arxiv 額度用完（"This key is out of quota"），改用 Exa、arXiv HTML／PDF 直抓、`gh api`、Wayback。Firecrawl 沒用到。

---

## 一、來源表

| # | 標題 | URL | 年 | 證據類型 | 讀取程度 | 管道 |
|---|---|---|---|---|---|---|
| S1 | Paech, Roush, Goldfeder, Shwartz-Ziv, *Antislop: A Comprehensive Framework…*（arXiv v2） | https://arxiv.org/html/2510.15061v2 | 2025 | 實證 | ✅ 全文（含附錄 A–M） | Exa 搜尋確認編號 → curl arXiv HTML |
| S1b | 同上，ICLR 2026 正式版（比 arXiv v2 多了附錄 L「Assessing Emergence of New Slop」、M、N） | https://proceedings.iclr.cc/paper_files/paper/2026/file/467746c8e15fbfca34dcf23be9ef9229-Paper-Conference.pdf | 2026 | 實證 | 🟡 讀了 §6.5、§7 Discussion、App B、L、M、N（v2 已有的部分沒重讀） | curl PDF → pdftotext |
| S2 | sam-paech/antislop-sampler README | https://github.com/sam-paech/antislop-sampler | 2024–26 | 文件自述 | ✅ | gh api |
| S3 | sam-paech/slop-forensics README | https://github.com/sam-paech/slop-forensics | 2025 | 文件自述 | ✅ | gh api |
| S4 | sam-paech/auto-antislop README | https://github.com/sam-paech/auto-antislop | 2025 | 文件自述 | 🟡 概述、Pipeline Flow、FTPO 段 | gh api |
| S5 | EQ-Bench About（Creative Writing v3、slop 指標、judge bias） | https://eqbench.com/about.html | 2026 | 文件自述 | ✅ | Exa fetch |
| S6 | Jang, Ye, Seo, *Can Large Language Models Truly Understand Prompts? A Case Study with Negated Prompts* | https://arxiv.org/abs/2209.12711 | 2022 | 實證 | ✅ | curl PDF → pdftotext |
| S7 | Castricato et al., *Suppressing Pink Elephants with Direct Principle Feedback* | https://arxiv.org/abs/2402.07896 | 2024 | 實證 | 🟡 讀了 §4.2 Baselines、Table 1 與結果段、§6 質性分析、§7 Limitations、附錄 Table 2 | curl arXiv HTML |
| S8 | Mann et al., *Don't Think of the White Bear: Ironic Negation in Transformer Models Under Cognitive Load* | https://arxiv.org/abs/2511.12381 | 2025 | 實證 | 🟡 讀了摘要、方法（load 與 surprisal 定義）、結果段、App B Limitations | curl arXiv HTML |
| S9 | Rana, *Semantic Gravity Wells: Why Negative Constraints Backfire* | https://arxiv.org/abs/2601.08070 | 2026 | 實證（單一模型） | ✅ | Exa 搜尋 → curl arXiv HTML |
| S10 | Freeburg, *The Last Fingerprint: How Markdown Training Shapes LLM Prose*（Exa 的 metadata 把作者標成 "S. Altman"，這是錯的，論文上的作者是 E. M. Freeburg，獨立研究者） | https://arxiv.org/abs/2603.27006 | 2026 | 實證（小樣本） | 🟡 讀了 §5 三個 Study、Table 1/2/3 文字、§6.5 Limitations | curl arXiv HTML |
| S11 | Geng & Trotta, *Human-LLM Coevolution: Evidence from Academic Writing*（ACL Findings 2025） | https://aclanthology.org/2025.findings-acl.657.pdf | 2025 | 實證（語料統計） | ✅ | curl PDF |
| S12 | Juzek & Ward, *Why Does ChatGPT "Delve" So Much?*（COLING 2025） | https://arxiv.org/abs/2412.11385 | 2024 | 實證 | 🟡 摘要、§6 線上實驗結果、§7 | curl PDF |
| S13 | Juzek & Ward, *Word Overuse and Alignment in LLMs: The Influence of LHF* | https://arxiv.org/abs/2508.01930 | 2025 | 實證 | 🟡 摘要、§3 材料、§5 Limitations | curl PDF |
| S14 | Anthropic, *Prompting best practices*（platform.claude.com） | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | 2026 | 文件自述 | 🟡 「Add context」「Control the format of responses」「frontend aesthetics」、Opus 4.5/4.6 aggressive language 段 | curl `.md` |
| S15 | Anthropic, *Prompting Claude Fable 5.1* | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1 | 2026 | 文件自述 | 🟡「Writing density」「Formatting in chat」 | curl `.md` |
| S16 | Edwards, *Forget AGI—Sam Altman celebrates ChatGPT finally following em dash formatting rules*（Ars Technica 2025-11-14） | https://arstechnica.com/ai/2025/11/forget-agi-sam-altman-celebrates-chatgpt-finally-following-em-dash-formatting-rules/ | 2025 | 二手報導＋非正式測試 | ✅ | Exa fetch |
| S17 | Wikipedia:Signs of AI writing（2026-10 版 wikitext） | https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing | 2026 | 實務紀錄（社群） | 🟡 導言、Caveats、Words to watch、Negative parallelisms 三小節、Differences between LLMs、Ineffective indicators、Overuse of em dashes、Lexical diversity/elegant variation | curl `action=raw` |
| S18 | Wikipedia:WikiProject AI Cleanup 與 /Guide and resources | https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup/Guide_and_resources | 2026 | 實務紀錄 | 🟡 Goals、Editing advice、Determining whether…、LLM detection software、Doing the cleanup、Presumptive removal | curl `action=raw` |
| S19 | tbhb/vale-ai-tells README | https://github.com/tbhb/vale-ai-tells | 2025–26 | 文件自述 | 🟡 Installation、Rules 表（grep 相關列）、What to write instead、Using with AI agents、Limitations | gh api |
| S19b | tbhb/vale-ai-tells CHANGELOG（v0.1.0 2025-12-02 → v1.37.0 2026-09-15，共 57 個 release） | 同上 /CHANGELOG.md | 2026 | 實務紀錄 | 🟡 只讀了 grep 出的條目（1.5.0、1.12.0、1.14.0、1.30.0 等） | gh api |
| S19c | tbhb/vale-ai-tells EXPERIMENTAL.md | 同上 | 2026 | 文件自述 | 🔎（只看 Exa highlight） | Exa |
| S20 | schubergphilis/mdd, *R15 — AI-tell detection, and how to evaluate a prose linter* | https://github.com/schubergphilis/mdd/blob/main/docs/research/R15-ai-tell-detection-and-prose-evaluation.md | 2026 | 實務紀錄（有數字） | ✅ | gh api |
| S21 | Vale 官方文件 existence／substitution | https://vale.sh/docs/checks/existence | — | 文件自述 | ✅（兩頁） | Exa fetch |
| S22 | proselint README 與 docs/philosophy.md、lintscore 文章 | https://github.com/amperser/proselint | 2014–26 | 文件自述 | ✅ philosophy＋lintscore；🟡 README | gh api |
| S23 | write-good README | https://github.com/btford/write-good | — | 文件自述 | 🟡 | gh api |
| S24 | alex readme | https://github.com/get-alex/alex | — | 文件自述 | 🟡 Why、FAQ | gh api |
| S25 | tropes.fyi 首頁／directory／tropes.md | https://tropes.fyi/tropes-md | 2026 | 文件自述 | 🟡 tropes.md 頭尾＋grep（49 條 "Avoid patterns like"）；directory 文字 grep | curl → html 轉文字 |
| S26 | Ossama Chaib, *tropes.fyi: Name and shame AI writing* | https://ossama.is/writing/tropes | 2026-02-20 | 作者主張 | ✅ | curl |
| S27 | Russell, Karpinska, Iyyer, *People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text*（ACL 2025） | https://arxiv.org/abs/2501.15654 | 2025 | 實證 | 🟡 §1、Exp 1–5、Table 1–2、Table 11 說明段 | curl arXiv HTML |
| S28 | Shaib, Chakrabarty, Garcia-Olano, Wallace, *Measuring AI "Slop" in Text*（v2） | https://arxiv.org/abs/2509.19163 | 2025/26 | 實證 | 🟡 §3 taxonomy、§4 agreement、§5.1、§6 LLM-as-judge（Table 7）、§7 Discussion | curl arXiv HTML |
| S29 | Chakrabarty, Laban, Wu, *Can AI writing be salvaged?…*（CHI 2025） | https://arxiv.org/abs/2409.14509 | 2025 | 實證 | 🟡 §6.1 偵測、§6.3 偏好排序、§8 Limitations | curl arXiv HTML＋Exa highlight |
| S30 | Chakrabarty, Laban, Wu, *AI-Slop to AI-Polish?…*（WQ benchmark） | https://arxiv.org/abs/2504.07532 | 2025 | 實證 | 🟡 摘要、實驗結果段（Table 2 文字）、人評段 | curl arXiv HTML |
| S31 | Graphite（Druck, Paredes, Smith）, *AI Tells* | https://graphite.io/five-percent/research/ai-tells | 2026-09-16 | 實證（業界報告，非同儕審查） | 🟡 Key Takeaways、Corrective framing 定義、Tells Appear and Disappear、Tells Are Not Necessarily Fading、Limitations | Exa 搜尋 → curl |
| S32 | Sukino, *Sukino's Guides and Tips for AI Roleplay*（"Unslop Your Roleplay with Phrase Banning"） | https://rentry.org/Sukino-Guides | 2024–26 | 實務紀錄 | 🟡 Phrase Banning 整節、"What You Include Is as Important as What You Omit" | Exa fetch（curl `/raw` 被導到別頁） |
| S33 | Sukino, *Banned Tokens.txt*（SillyTavern 用） | https://huggingface.co/Sukino/SillyTavern-Settings-and-Presets/blob/main/Banned%20Tokens.txt | 2025–26 | 實務紀錄 | 🟡（Exa highlight 給出大半份清單＋檔頭警告） | Exa |
| S34 | The Economist, *How to spot AI writing*（2026-07-30） | https://www.economist.com/culture/2026/07/30/how-to-spot-ai-writing | 2026 | 實證（據二手描述） | 🔎 只拿到導言（付費牆） | Exa fetch（只有 teaser）→ r.jina.ai（只有導覽列）→ Wayback 20260910 快照（605 字元空殼） |
| S35 | Dataconomy 轉述 Economist 研究 | https://dataconomy.com/2026/08/04/how-to-spot-ai-writing/ | 2026 | 二手 | 🔎 | Exa |
| S36 | Poynter, *AI learned how to write from humans. Now humans are trying not to sound like AI.* | https://www.poynter.org/reporting-editing/2026/ai-changing-human-writing-editors-em-dash/ | 2026-09-28 | 報導 | 🔎 | Exa |
| S37 | slop-gate（val.town）README | https://www.val.town/x/dcm31/slop-gate | 2026 | 實務紀錄 | 🔎 | Exa |
| S38 | byclaude.net, *Phrase Versus Move* | https://byclaude.net/phrase-versus-move | 2026-05-24 | 實務紀錄 | 🔎 | Exa |
| S39 | impactcrew/dont-be-a-sloperator | https://github.com/impactcrew/dont-be-a-sloperator | 2026 | 作者主張 | 🔎 | Exa |
| S40 | Pew Research Center 圖表：AI 偏好詞與標點 | https://www.pewresearch.org/chart/key-words-and-punctuation-favored-by-ai-has-spiked-since-the-release-of-chatgpt/ | 2026-08-20 | 實證（語料統計） | 🔎（表格數字來自 Exa highlight） | Exa |
| S41 | Vrabcová et al., *Negation: A Pink Elephant in the LLMs' Room?* | https://arxiv.org/abs/2503.22395 | 2025 | 實證（NLI 否定理解，不是指令遵循） | 🔎 | Exa |
| S42 | Engels & Tudose, *Prompting Models to Obfuscate Their CoT*（LessWrong） | https://www.greaterwrong.com/posts/GLMeDPbG32pEfzc89/prompting-models-to-obfuscate-their-cot-1 | 2025 | 實務紀錄 | 🔎 | Exa |

---

## 二、子問題 1：風格 linter 與檢查器

### 1.1 Vale（框架）＋社群 AI 規則包

- **怎麼運作（S21，文件自述）**：Vale 本身是規則引擎，規則以 YAML 宣告。最常用的 `existence` 規則把 token 清單編譯成正規表示式：「The most general extension point is existence. As its name implies, it looks for the "existence" of particular tokens.」`substitution` 規則則把「觀察到的字」對到「建議用字」（`swap: abundance: plenty`）。也就是說，Vale 系的 AI 規則包本質上是**詞串和正規表示式比對**，再加上一份**替換建議表**。
- **vale-ai-tells（S19，tbhb）**：README 說它「targets technical documentation」，作者聲明「not to disguise AI-generated content as human-written」。R15 的盤點：`ai-tells` 77 條規則全是 `level: error`，其中 74 條是 `existence`（S20）。README 的 Limitations 自承抓不到 sentence-length uniformity、paragraph-length、semantic analysis、elegant variation 等。experimental 包用 Tengo 腳本算句長變異係數，門檻 CV<0.30；EXPERIMENTAL.md 自己寫「thresholds come from research, validated against a small set of documents… need calibration against a larger corpus」（S19c，🔎）。
- **評估資料（唯一找到的第三方數字，S20，實務紀錄）**：mdd 專案用兩個 agent 對自家語料跑整包 77 條規則：
  - `docs/spec/`＋`docs/research/` 98,261 字，1,682 個警告（17.1／千字）；guide 10,515 字，69 個（6.6／千字）。
  - 「42 of the 77 rules never fired on any corpus.」
  - 「Precision over the four articles was about 4%: roughly 118 hits, roughly 5 worth acting on.」
  - 個別規則失敗：`FormalRegister`「107 hits, 92 of which are the word `implement` or `implementation`」；`VerbTricolon`「treats any word ending in *s* as a verb… Near-total false positive.」
  - 但同一份文件推翻了自己第一輪的評估方法：「There is no human-written control group in the corpus… Counting alerts against an AI-written baseline measures how much a corpus resembles itself.」並主張要改成人工偏好對照（原文 vs 最小改寫，盲評）。限制：單一專案、單一評審、評估由 agent 執行。
  - 正面發現：結構規則 `ContractionAvoidance` 抓到人工審稿沒看出的事，「One contraction in 6,473 words is not a style choice; it is the absence of one.」
- **其他 Vale 包**：ammil-industries/vale-signs-of-ai-writing 的 README 自陳「False positives are possible… suggestion-level rules may flag legitimate writing styles」（🔎，無數字）；krishnasunkam/vale-ai-tells 說規則「scored each one against a labeled benchmark… A rule that raises false alarms on clean prose does not ship」（🔎，沒公開數字）。

### 1.2 proselint、write-good、alex（前 LLM 時代的散文 linter）

- **proselint（S22）**：設計目標是精確率。philosophy.md：「Better to be quiet and authoritative than loud and unreliable.」lintscore 定義為 `T (T/(F+T))^k`，例：k=2、偵測 100 個其中 10 個誤報，分數 72.9。**但同一份文件說：「Note that for lack of an open corpus, we are currently unable to keep track of the lintscore.」** → 精確率無公開資料（⚪，見缺口表）。
- **write-good（S23）**：README 第一行自稱「Naive linter for English prose」，檢查被動語態、weasel words、wordy 等，每項可關（`{ passive: false }`）。無評估資料。
- **alex（S24）**：針對不體貼／排他用語，FAQ：「alex isn't very smart. People are much better at this.」無評估資料。
- 這三者都**不是針對 AI 空話設計**，跟本系列的關係是「規則式 linter 的前例」：它們的作者自己就把精確率當主要風險。

### 1.3 tropes.fyi（Ossama Chaib）

- **形式（S25、S26，作者主張）**：一個目錄＋一份可直接塞進 system prompt 的 `tropes.md`（49 個 "Avoid patterns like" 條目；部落格寫時是 32 個）。每條是「名稱＋描述＋例句」，並標 `consistent`／`fading` 等狀態。另有 AI Vetter（「No LLM involved, pure regex and frequency analysis」）。
- **評估**：作者寫「We test against an eval suite of verified slop and verified human articles to prevent both false positives and false negatives」，但沒公開數字；`/vetter` 現在回 404（2026-10-28 實測）。→ ⚪。
- **作者自己預料到軍備競賽**：tropes.md 頁首「let's play cat and mouse!」；部落格「Sorry for helping them become invisible, I'd just rather not see it.」；directory 對 AI 詞彙寫「Although some words cycle out of fashion for the models, new ones get introduced e.g. load-bearing, gated, paradigm.」
- 注意：tropes.md 的寫法是**列出禁用例句**（"Avoid patterns like: 'It's not bold. It's backwards.'"），正是 S9 說最容易引發 priming 的形式（見 §三）。

### 1.4 EQ-Bench slop score 與 slop-forensics（Sam Paech）

- **slop-forensics（S3）**：對每個模型產生故事，計算詞／bigram／trigram 相對人類語料的過度使用，輸出「Slop Index: A combined measure indicating how heavily a model uses identified slop terms」，並用 PHYLIP 依 slop 指紋畫模型親緣樹。這是**描述型指紋工具**，沒有精確率概念。
- **EQ-Bench Creative Writing 的 Slop 欄位（S5）**：「It calculates a value representing how many words in the test model's output match words that are over-represented in typical language model writing.」它**不進總分**，只提供手動 slider 讓使用者自己決定懲罰強度。EQ-Bench 也坦白評審本身可能偏好 slop：「Slop Bias: It may be the case that judges favour certain kinds of slop… which get selected for when models are RL tuned using LLM judges… We don't control for this possible bias in any empirical way.」另一句跟 prompt 禁令有關：「Smut Bias… The judge tends to punish this severely, and instructing it not to is ineffective.」

### 1.5 Antislop Sampler 與論文（S1、S1b，已確認 arXiv 2510.15061，ICLR 2026 接受）

- **機制**：生成時掃描已輸出的 trace，命中禁詞或 regex 就回溯到該樣式的第一個 token，把它的機率乘上 `10^(-10s)`（s 為 ban strength 0–1），再用 min-p 重抽。「Unlike token banning, which triggers on the first token of a banned sequence and is prone to false positives, our sampler triggers only after the entire sequence appears」（§4）。s<1 是「soft-banning」：沒有合理替代時仍放行（附錄 A 的 tapestry 例子）。
- **主要數字（§6.2、Table 2，gemma-3-12b，n=1,000 outputs/condition）**：
  - Antislop Sampler：「achieves perfect suppression (100%) while actually improving writing quality above baseline」。
  - FTPO：「maintains quality within 1% of the baseline… while achieving 83-92% suppression」；Table 2：baseline writing qual 67.80 → FTPO 2k 68.93／4k 67.31／8k 67.49；ban% 92.39／90.15／83.40；diversity 101.05／97.68／95.09。
  - DPO：「drops 6-15 points in writing quality despite achieving only 80-82% suppression」；DPO 8k diversity 73.92、longform 26.9（baseline 51.3）。
  - Token banning（logit bias −100）：「quality falling to 28 (out of 100) at 8k patterns… severe repetition, spelling and grammar artifacting, and incoherence.」
  - 結構型樣式：「The Antislop Sampler is able to suppress 100% of "It's not X, it's Y" patterns」（§6.5；ICLR 版補充 qwen3-4b 原本 1.10 次／千字 → 0）。
  - 過度使用的程度：gemma-3-12b 的 "elara" 85,513×、"heart hammered ribs" 1,192×（Table 1）；「"It's not X, it's Y" to be 6.3× more prevalent than human writing in some models」。
  - 對照條件：品質用 GPT-5 依自訂 rubric 評分（附錄 H），longform 用 Sonnet-4 評。**沒有人類評分**。
- **作者列的限制**：
  - 吞吐量：「Antislop Sampler reduces throughput by 69-96% (banlist sizes 1k-8k)」。
  - 「We encourage future work to explore Antislop's performance in domains other than creative writing, human-rater replication of quality metrics…」
  - ICLR 版 §7 加了：「Detecting complex semantic patterns, such as metaphor overuse or narrative tropes—is fundamentally harder than matching n-grams. These high-level repetitions evade simple lexical filters.」
  - Llama-3.3-70B 比較敏感，只訓練 lm_head 後抑制率只剩 66%。
  - 附錄 K：「this method of identifying slop is domain-specific; the over-used patterns in creative writing will differ from professional writing」。
  - 倫理段：可能「unintended suppression of legitimate dialects, or minority styles」與「attempts to evade AI-text detection」。
- **跟 prompt 禁令的關係**：引言直接寫「Instructing the model to avoid a set of banned vocabulary has limited efficacy and may induce a backfire effect due to the "Pink elephant problem" (Castricato et al., 2024).」（這是作者主張，論文本身沒做 prompt 禁令的對照實驗。）
- **XTC／DRY 做不到（ICLR 版附錄 N，Table 8，gemma-3-27b，2,000 outputs）**：top-40 詞平均過度比 baseline 1439× / FTPO 394× / XTC 1267× / DRY 1442×；trigram 173× / 111× / 205× / 168×。「decoding-time tricks are not enough to fix model-wide over-representation」。

---

## 三、子問題 2：在 prompt 裡寫「不要用 X」有沒有效

### 2.1 實證研究

| 研究 | 設定 | 結果（原文＋數字） | 限制 |
|---|---|---|---|
| S6 Jang et al. 2022 | 9 個資料集，把指令改成否定版（"incorrect answer"、"inappropriate ending"），OPT 125M–175B、GPT-3、InstructGPT、T0 | 「all LM types perform worse on negated prompts as they scale」；原始＋否定平均約 50%，「the LMs could not find any distinction between the original and the negated prompts」；最佳方法與 13 歲人類差距「~31.3%」；fine-tune 有幫助但「results in degradation of the original task performance, resulting in a zero-sum game」 | 這是「把任務反過來做」，**不是「禁用某個字」**；2022 年的模型；作者對 inverse scaling 的解釋自稱 conjecture |
| S7 Castricato et al. 2024（Pink Elephant） | 對話中禁止談某實體（system prompt 指示），GPT-4 判定 | Table 1 提及率：OpenHermes-7B base 0.33 → 加禁令 0.36（Δ −0.03）；OpenHermes-13B 0.34 → 0.34；Llama-2-13B-Chat 0.33 → 0.25；GPT-4 0.33 → 0.13；DPF 訓練後 7B 0.17、13B 0.15。原文：「baseline OpenHermes models exhibit an equivalent or increased tendency to mention Pink Elephants following such directive prompts」 | GPT-4 當評審（與兩位作者一致率 98.5%、94.5%）；合成資料；作者列的限制是沒測整個類別或多實體的禁令 |
| S8 Mann et al. 2025（White Bear） | 9 個開源模型（GPT-2 Small 到 GPT-OSS-20B），「do not mention X」後插入干擾文字，量 log-prob | 「rebound consistently arises immediately after negation and intensifies with longer or semantic distractors, while repetition supports suppression」；GPT-OSS-20B「minimal or even negative rebound」 | 作者自列：「synthetic, templated prompts… reliance on log-probabilities rather than actual text generation… exclusively on English and single-token target concepts」；rebound 是相對「高負載基準」量的，不是相對無指令 |
| S9 Rana 2026（Semantic Gravity Wells） | Qwen2.5-7B-Instruct，2,500 個單字填空題，"Do not use the word '[X]'"，每題 16 次抽樣，共 40,000 次 | 違規率依基準機率 P0 呈 logistic：`p=σ(−2.40+2.27·P0)`，R²=0.78；P0∈[0,0.2) 違規 9.1%，P0∈[0.8,1.0] 46.3%（Table 1）；成功時禁令讓目標機率下降 22.8 個百分點，失敗時只下降 5.2；「In priming failure (87.5% of violations), the instruction's explicit mention of the forbidden word paradoxically activates rather than suppresses the target representation」 | 作者自列：「Single model」「Single-token focus」「Controlled task setting… Naturalistic settings (longer outputs, ambiguous constraints) may exhibit different patterns」；作者建議的替代寫法（「Category-level constraints」「Positive reframing」）**沒有實測**：「We leave systematic evaluation of alternative phrasings to future work」；獨立研究者、未經同儕審查 |
| S10 Freeburg 2026（Last Fingerprint） | 12 個模型、10 個主題的散文；A 無限制／B「No markdown…」／C B＋「Do not use em dashes.」 | Table 2（em dash／千字，A→B→C）：GPT-4.1 11.51→8.20→**3.86**；DeepSeek V3 8.66→4.75→**1.57**；Claude Opus 4.6 8.46→0.19→0.00；GPT-5.4 0.75→0.15→0.00。長文 5,000 字：「GPT-4.1 reaches 14.03 per 1,000 words unconstrained and retains 6.97 even under explicit em dash prohibition」。markdown 禁令則幾乎全面有效（「eliminates or nearly eliminates overt markdown features across all twelve models」） | 作者自列：base vs instruct 只比了 Llama；「Individual samples show high variance」；人類基準只 8 篇（0.33–17.12／千字，50 倍差距）；理論部分「difficult to test directly」；**沒量 em dash 被禁後改用什麼標點** |
| S11 Geng & Trotta 2025 | GPT-4o-mini 改寫 arXiv 摘要；P1「Revise the following sentences」 vs P2「Don't use the following words…: 'realm', 'pivotal', 'intricate', 'showcasing'. Revise…」 | 「Using prompt P2, aimed at suppressing them, reduces the frequency of such words, although it does not completely eliminate them.」（只有圖，內文無數字） | 短論文；作者自列只看詞頻、相關非因果 |
| S27 Russell et al. 2025（humanizer 實驗） | 把專家寫的「AI 特徵指南」塞進 o1-Pro 的生成 prompt，要它避開 | 專家多數決仍 100% 抓到（Table 2 "o1-Pro humanized" 欄：TPR 100、FPR 0）；但自動偵測器大跌：GPTZero 46.7%、Binoculars（Accuracy）6.67%、Fast-DetectGPT 23.3%；專家信心下降，「15.1% of annotations having a confidence of 1」 | 只用 o1-Pro；5 位專家；60 篇 |

### 2.2 廠商文件（文件自述）

- **Anthropic（S14）**原文，"Control the format of responses" 第一條：
  > 1. **Tell Claude what to do instead of what not to do**
  >    * Instead of: "Do not use markdown in your response"
  >    * Try: "Your response should be composed of smoothly flowing prose paragraphs."
  
  同一頁「Add context to improve performance」：「Less effective: NEVER use ellipses」→「More effective: Your response will be read aloud by a text-to-speech engine, so never use ellipses…」，「Claude can generalize from the explanation.」
  注意：同一頁自己的範例 `<avoid_excessive_markdown_and_bullet_points>` 仍含「DO NOT use ordered lists」「NEVER output a series of overly short bullet points」，也就是廠商並沒有完全不用否定句，而是**否定句搭正面描述與理由**。
- **Anthropic（S15，Fable 5.1）**：寫作密度問題的建議是**定義反模式＋說明原因＋給正面替代**：「Mannered prose substitutes metaphor and flourish for direct statement. Instead of "a parameter worth varying," the mannered writer produces "a dial worth turning."… The fix is to say what you mean.」並說短版「Please remove all mannered prose.」「also tends to work」（沒附數據）。
- **OpenAI／GPT-5.1 em dash（S16，Ars Technica 2025-11-14）**：Altman 原文「Small-but-happy win: If you tell ChatGPT not to use em-dashes in your custom instructions, it finally does what it's supposed to do!」；Ars 的非正式測試「ChatGPT did appear to follow our request not to produce em dashes」，但「experiences with the feature continue to vary, at least when the request is not placed in custom instructions」。Ars 的解讀：「When you tell ChatGPT "don't use em dashes," you're not creating a hard rule… "less likely" isn't "impossible."」以及「there's no guarantee the issue will stay fixed」。文末一則使用者回報：在對話中要求不用 em dash 後，ChatGPT 回「Got it—I'll stick strictly to short hyphens from now on.」（回覆本身就含 em dash，而且宣布改用連字號。）

### 2.3 小結（給寫作者的判讀，非原文）

- 「不要用 X」**有效但不可靠**，效果取決於模型與 X 原本的機率：S9 是單一模型的機率定律，S10 顯示同一句禁令在 Claude Opus 4.6 降到 0、在 GPT-4.1 長文仍剩 6.97／千字。
- 2025 年後的前沿模型明顯比 2022–2024 年的開源模型聽話（S7 的 GPT-4、S10 的 Opus 4.6／GPT-5.4、S16 的 GPT-5.1），所以 Jang 2022 的 inverse scaling 不能直接套到今天的模型上（S41 Vrabcová 2025 在 NLI 否定上也發現「increasing the model size may improve the models' ability to handle negations」，🔎，且任務不同）。
- 「點名禁字會 prime 該字」有機制證據（S9 的 87.5%），但只在小模型、單字任務上量過。

---

## 四、子問題 3：禁令導致替代句式（核心反例）

> 結論先講：**沒有找到任何受控實驗是「禁了句式 A 之後，量測模型改用了哪些句式 B」**。現有證據分四層：(a) 字詞層級的受控測量（Antislop 附錄 L）；(b) 語料層級的相關證據（Graphite、Geng & Trotta、Wikipedia／Economist）；(c) 工具作者的第一手紀錄（vale-ai-tells changelog、slop-gate、Sukino、byclaude）；(d) 偵測實驗中的副產品觀察（Russell humanizer）。

### 4.1 字詞層級：Antislop ICLR 版附錄 L（實證，最強的一筆）

- 作者自己提出這個疑慮：「A natural concern with any suppression method is a "whack-a-mole" effect: once a set of over-represented patterns is pushed down, the model might simply substitute a different set of equally extreme over-used patterns.」
- 設定：gemma-3-27b vs FTPO 版，重新計算 top-40 過度使用詞，「without consulting the training banlist, so that any new slop introduced by FTPO can surface」。
- 結果：baseline top-5 是 elara 18,861×、logline 3,739×、worldbuilding 3,121×、grimdark 2,819×、unsettlingly 2,275×；FTPO 版 top-5 是 **elara 1,552×、unusualness 1,496×、lysandra 1,330×、outlandishness 1,169×、logline 1,028×**。
  - 作者描述：「Some new tokens appear in the top-5, but their ratios and counts are much smaller than the worst offenders in the baseline.」
  - 聚合：「The mean over-representation ratio for the top-40 words drops by 73% (from 1,439× to 394×)… top-40 trigrams drops by 36%.」
  - 抑制點的熵：1.34 → 1.93（隨機位置 0.59 → 0.89）。
- **判讀**：替代確實發生（"lysandra" 是 "elara" 的同類奇幻女名，"unusualness"／"outlandishness" 是新冒出的詞），只是強度低很多。作者把「沒有變成新的 Elara」歸功於 FTPO 把梯度分散到多個替代 token；**這只對 FTPO 訓練成立**，sampler 硬禁與 prompt 禁令沒有做同樣的測量。
- auto-antislop 設定檔的註解也承認替代存在，所以 pipeline 預設要跑第二輪：「Iteration 1: … Recomputes the slop strings/ngrams at the end & adds any new slop to the banlists」「Iteration 2+: Extra iterations catch slop that emerges after the initial set is banned」（S1 附錄 M／S4）。
- 結構樣式（"not X, but Y"）的 regex 禁令只量了「被禁樣式降到 0」，**沒量替代**。
- Antislop 引用的 Jon et al. 2023（負面詞彙約束的翻譯 benchmark）：「models can still slip around bans with small spelling changes or closely related word forms」（S1 §2 轉述，原論文未讀）。

### 4.2 語料層級：已知 tell 下降、未點名的 tell 留著或上升（實證，相關性）

- **Graphite 2026-09（S31）**：10,000 篇人類文章 vs 9 個模型各 10,000 篇同題文章。
  - 「Across the nine features measured per 1,000 words, the combined frequency falls by 41% to 86% from the earliest to the latest model in each family. This decline may reflect deliberate efforts by AI companies to remove these tells.」
  - 但：「Tells shift between model versions, but they do not go away… Only 45% of the tells found across the two models are shared.」「Between the two latest versions of each model family, 55% to 72% of tells are unique to one version.」
  - 替代句式最直接的一筆：頁首要點同時列「**Astra Uses Well-Known AI Tells 29% Less Often Than Human Writers**」與「**Astra Talks About What Things Aren't 12x as Often as Human Writers**」，其中「Corrective framing includes "rather than," "not just," "not simply," and "does not."」以及「GPT-6 Astra favors corrective phrasing like "rather than" and "not simply"」。Claude 方面：「Claude Makes "Less X, More Y" Comparisons 82x as Often as Human Writers」，「Claude Opus 5… uses the pattern "less like a _ and more like" about 105 times as often as human writers」，而「Across Claude versions, hype words become less common, while "less X, more Y" comparisons… become more common.」
  - em dash：「GPT and Gemini may have overcorrected for this well-known tell. Their latest versions use em dashes far less often than human writers.」標題：「Astra's Em-Dash Rate Is 88% Below the Pre-ChatGPT Human Rate」。
  - 限制（原文）：「We generate AI articles using a single, fixed prompt. A different prompt would likely change the writing and the tells we identify.」「AI articles were generated by newer models, so changes in writing style since 2022 may be misidentified as AI tells.」mannered-prose 分數由 Claude Opus 5 打分。**它沒有證明是「禁令」造成替代**，只顯示廠商壓掉知名 tell 之後，否定式對比換了外形還在。
- **Geng & Trotta 2025（S11）**：「a marked drop in the frequency of several words previously identified as overused by ChatGPT, such as "delve", starting soon after they were pointed out in early 2024. The frequency of certain other words favored by ChatGPT, such as "significant", has instead kept increasing.」作者解釋為作者端篩選：「people are likely still using LLMs, but they may avoid some words that are typical of LLM output」。這是**人類端的替代／篩選**，不是模型被禁後的替代。
- **Wikipedia:Signs of AI writing（S17，社群觀察）**：
  - em dash 段（標題已改成「Overuse of em dashes (2022–September 2026)」）：「those same latest AI models of late (September 2026 and onward) have more and more often been found to be hard coded to not use em dashes at all. This, however, has the unintended side effect of making LLMs not once dare to use any sort of alternate puctuation, so the overall variety has dropped significantly in their output; commas and periods are more likely now than even human text,**{{cn|date=October 2026}}** and now that has become its own sign of AI writing.」→ **這句被標了「需要引用」，沒有出處，不可當事實引用**。
  - 與之部分矛盾的二手報導（S35，🔎）：Economist 2026-07 研究（55,940 句、120 萬字）說「only Claude used em dashes more often than human writers」「large language models used fewer commas, semicolons and parentheses than humans… overusing the word "and."」——也就是「標點變少」，不是「逗號句號變多」。Economist 原文拿不到（見缺口）。
  - 「Y rather than X」小節：「This pattern may also be reversed, a construction particularly common in recent LLM output.」（只陳述現象，沒說是禁令造成的。）
  - AI 詞彙的「年代表」：「Mid-2026 and on (GPT-6): challenge, clearer, dependable… (with much more period and comma usage and shorter sentences around a strict 8–20 word limit)」，出處是一篇 Intellectual Lead 的評測文章，來源品質低。
  - **前一代防護造成的 tell**（Lexical diversity/elegant variation 段）：「Older AI models may include a repetition penalty, meant to discourage it from reusing words too often」→ 產生同義詞輪替。Russell et al. 的專家也觀察到同樣現象：「humans repeatedly write the word says, while AI tries to use more descriptive synonyms like notes and explains」（S27）。這是「防重複機制 → 新特徵」的例子，可當類比。
- **Pew Research 2026-08（S40，🔎）**：Common Crawl 49 萬頁，em dash 每萬字 2023-01 5.79 → 2026-01 11.19；negative parallelism 0.87 → 2.36（2025-07 高峰 2.72）。是網路整體趨勢，不區分來源。

### 4.3 工具作者的第一手紀錄（實務紀錄，最具體但無對照）

- **vale-ai-tells changelog（S19b）**：有好幾條規則是**因為 agent 繞過舊規則才新增的**：
  - v1.14.0（2026-06-02）`SemicolonUsage`：「Catches the semicolon used as an em-dash substitute: the punchy, comma-free, clause-final continuation an agent reaches for after the em-dash gets flagged.」
  - v1.14.0 `ContrastiveNegation`：「Catches the telegraphic negation cadence agents reach for once "not X; it's Y" gets flagged: stacked "no setup, no config, no hassle" and the single clause-final fragment… Aggressive by design, so it also fires on a literal "coffee, no sugar"」。
  - v1.12.0（2026-05-28）`ServesAsDodge`：「Catch the colon-cheat copula-replacement — `The candidate mechanism: a hook on Bash that...` where AI has swapped `is` or `are` for a colon to dodge weak-verb or passive-voice lints.」
  - v1.30.0（2026-08-16）`FillerIntensifier`：「"any one of the checks," which is what "any single" turns into when a writer dodges the alert」。
  - README 規則表 `DoubleHyphen`：「A literal double hyphen, the ASCII stand-in AI types when it cannot produce an em dash.」
  - 而同一個 README 自己的「What to write instead」表寫的是：「em-dash → comma, period, or parentheses」。也就是**工具官方建議的替代，正好是之後被抓去另立規則的對象（semicolon、colon）之外的另一組**。
  - 規則數成長：v0.1.0（2025-12-02）到 v1.37.0（2026-09-15）共 57 個 release；R15 說「around two tagged releases a week since March 2026」。
- **slop-gate（S37，🔎）**：「you cleared two tells and introduced three — whack-a-mole, the actual failure mode of LLM self-revision」；Known limits：「This val's own announcement traded em-dashes for arrows between round 1 and round 2 and got a PASS; `arrow-density` and `x-not-y` exist because of that.」
- **Sukino（S32，SillyTavern 社群）**：
  - 對 prompt 禁令：「While you could try prompting them to stop, that's not reliable」。
  - 對字串禁令的替代：「don't ban `shiver` to combat `and sent shivers down her spine`… the AI has to start from `and sent`. What are the options from here? Shivers, shiver, shudders, shudder, a jolt, jolts, sparks, spark... The ways the AI can write slop with this are infinite. That's why you need to ban from the root」。
  - 禁令清單本身就是證據：同一個意象列了 8 個動詞 × 多種主詞的組合（"her eyes gleam/glint/glow/shin/sparkl/twinkl"…），以及 "couldn't help but"、"couldn't help but feel"、"help but feel a sense" 三層（S33）。
  - 檔頭警告：只能在支援「字串」禁令的後端用，「Other backends and online APIs can only ban individual tokens, not strings, so using this list will break the model and cause more harm than good.」
  - 關於點名的副作用：「Even saying `{{char}} isn't interested in sex` may not have the effect you expect. By mentioning the concept, even negatively, you introduce the word `sex` into the context」。
- **byclaude.net（S38，🔎）**：用禁語清單治「悲傷回應的套話」，每輪測試都冒出變體（"sit with it" 被禁後出現 "That is a lot to sit with"），「The variant-generation rate of the model is faster than the list's growth rate.」結論是改成類別層級的禁令加上正面指示。
- **dont-be-a-sloperator（S39，🔎）**：「ban "seamlessly" and AI switches to "effortlessly."」（無資料，作者主張）。

### 4.4 偵測實驗中的副產品（實證，觀察性）

- **Russell et al. 2025（S27）**，用專家指南做 prompt 式 humanizer 後：「while humanization increases variety in AI-generated names, often even including people relevant to the article who exist in real life, our experts found that humanized articles use titles for these people (e.g., Dr., Prof.) much more frequently than in human-written articles.」→ 避開一組 tell 的同時出現新 tell。
- **Engels & Tudose（S42，🔎）**：要模型在 CoT 中不寫某些字，模型會先寫出「I must avoid saying Aspirin」；「Models consistently failed because they restated the constraint: "I must not use the word 'plus'..."」。

### 4.5 有無「禁 not X but Y → 改用 rather than／Y, not X」的直接證據？

- **直接的受控證據：沒有**（⚪，見缺口）。
- **最接近的間接證據**：Graphite（GPT-6 Astra 知名 tell 低於人類 29%，但 corrective framing「rather than／not simply」是人類 12 倍；Claude 的 "less X, more Y" 82 倍）；vale-ai-tells 的 `ContrastiveNegation`（"not X; it's Y" 被抓之後改成「no setup, no config, no hassle」）；Wikipedia 把「Y rather than X」列為「particularly common in recent LLM output」。三者都沒有證明因果是禁令。

---

## 五、子問題 4：審稿與 LLM-as-judge 抓空話

### 5.1 LLM 當審稿員抓 slop：表現差

- **Shaib et al.（S28）**，GPT-5、DeepSeek-V3、o3-mini 拿到跟人類標註員一樣的指南：
  - 二元判斷（Table 7a）：κ 分別 0.01、−0.01、0.03；precision/recall 0.38/0.12、0.25/0.08、0.42/0.08；模型判為 slop 的比例 0.08、0.03、0.07，人類 0.34。「Agreement with human annotators is low; κ values are ∼0… LLMs do a poor job at this task.」
  - span 抽取：內文說 GPT-5「precision of 0.08, recall of 0.12」、k=5 時「precision of 0.13, and recall of 0.19」；**但 Table 7b 印的是 k=0 0.14/0.11、k=5 0.13/0.10**，內文與表格不一致，引用時要註明。微調的 Qwen-7B 內文說 P 0.33／R 0.22／F1 0.26，表格寫 0.32／0.30，也不一致。
  - o3-mini 的理由偏重 Density，「under-representing issues with Coherence, Tone, Bias, Relevance, and Factuality」。
  - 人類之間也不一致：binary slop 標籤的 Cohen's κ −0.15、0.29、0.06（Gwet AC1 0.12、0.42、0.28）；span 層級 precision 0.80、0.65、0.68 則相當一致。也就是**人對「哪幾句有問題」意見接近，對「整篇算不算 slop」意見分歧**。
  - 結論原文：「Neither LLMs-as-judges nor linear models trained over these features are able to fully approximate human assessments of "slop"」。
- **Chakrabarty, Laban, Wu, CHI 2025（S29）**：LAMP 語料 1,057 段 LLM 文字由 18 位 MFA 作家編修。
  - 偵測：「The best General Precision (0.46) is achieved by Claude-3.5 Sonnet and GPT-4o with a 5-shot prompt, below the expert agreement level (0.57).」
  - 改寫：600 筆偏好標註，作家編修版 65% 被選為最佳（平均名次 1.5）；LLM 編修版（自動偵測或用作家標的 span）平均名次都是 1.99；原始 LLM 文字最差（2.51，60% 被排最後）。關鍵句：「Surprisingly, the condition that leveraged the oracle span from writers ranks almost identical to the condition with automatically detected spans. This provides evidence that detection of problematic spans is not the bottleneck in improving writing quality, and instead the rewriting module… is what dictates the overall performance」。
  - 限制：只有文學小說與創意非虛構，「potentially less applicable to other genres like technical writing, journalism, or scientific writing」。
- **Chakrabarty, Laban, Wu, WQ benchmark（S30）**：「all the LLMs used in zero-shot settings perform below or a few percentage points above a random baseline of 50%… LLMs used in LLM-as-a-judge settings tend to prefer AI-generation over human-writing」；Pangram 偵測器 65.0%；專門訓練的 WQRM（ModernBERT）74.3%；用 WQRM 從多個改寫中挑最好的，9 位作家人評「preferred by experts 66% overall」。
- **Russell et al.（S27）prompt 式偵測器**：把專家指南給 GPT-4o 判斷是否 AI，「Zero-shot + CoT + Guide」整體 TPR 78.0／FPR 10.7，但 humanized 欄只有 3.3；o1 加指南後 humanized 欄 0。對比：專家多數決 99.3／0。原文：「This simple prompting strategy is competitive with existing detectors on easier configurations but struggles to detect humanized articles.」

### 5.2 人工審稿 checklist：Wikipedia AI Cleanup 的做法

- **把特徵當線索，不當罪證**（S17 導言）：「this list is descriptive, not prescriptive… The patterns listed here are also only potential signs of a problem, not the problem itself… **Please do not merely treat these signs as the problems to be fixed; that could just make detection harder.**」
- **組合判斷**（S18）：「the co-occurrence of this with several other AI signs rapidly decreases the likelihood the content was human-written」；最可靠的是查證：「often the most reliable way to determine whether content is AI-generated is to check whether the sources support the text… It can be most efficient to prioritise checking sentences which contain AI signs.」
- **以人為單位清理**：「AI cleanup is typically done on a per-user basis… if someone uses LLMs once they're likely to use them habitually」；並有「Presumptive removal」流程，理由是「the asymmetry of effort between publishing LLM-generated content and cleaning it up」。
- **人類偵測力的研究**（S17 引用）：2025 年一份研究說人類「no better than random chance」；Russell 的專家（常用 LLM 寫作的人）TPR 92.7%、FPR 3.3%，非專家 TPR 56.7%、FPR 52.5%（S27 Table 1）。
- **無效指標清單**（S17 "Ineffective indicators"）：完美文法、混用語域、「bland/robotic」、華麗用字（「The correlation does not extend to all formal, academic, or "fancy"-sounding prose」）、單獨出現的轉折詞、沒有出處、奇怪的 wikitext。

---

## 六、子問題 5：反證與限制（誤報、過度矯正、規則越多越死板）

### 6.1 Linter 誤報

- vale-ai-tells 在真實語料上的精確率約 4%（S20）。
- `ContrastiveNegation` 作者自己說「it also fires on a literal "coffee, no sugar"; disable it for terse spec lists」（S19b）。
- slop-gate 把 "robust" 降級：「"robust" is a real word in a stats paper, and a gate that forces you to remove it is making the writing worse.」（S37，🔎）
- proselint 的整個設計前提就是「Existing tools for improving prose raise so many false alarms that their advice cannot be trusted」，但自己也沒有語料能追蹤精確率（S22）。
- Wikipedia：「Not all text featuring these indicators is AI-generated… Many elements of AI writing can be found in editorials, blogs, or fan fiction.」以及不熟 LLM 的人「Combination of casual and formal registers… may indicate youth… or neurodivergence」（S17）。

### 6.2 過度矯正（模型端）

- **廠商自己承認舊的反格式規則在新模型上變成過度壓制**（S15）：「Earlier models overused bullets and bold in chat, and many prompts carry anti-formatting rules written to reduce that. Claude Fable 5.1 tends toward the opposite… If your prompt contains anti-formatting language, remove it」；S14 也說同一段範例「on that model a block like this can suppress structure the content needs」。
- **語氣強度造成過度觸發**（S14）：「Claude Opus 4.5 and Claude Opus 4.6 are also more responsive to the system prompt than previous models… these models might now overtrigger. The fix is to soften any aggressive language. Where you might have said "CRITICAL: You MUST use this tool when...," you can use more normal prompting」。
- **em dash 壓過頭**：Graphite「GPT and Gemini may have overcorrected for this well-known tell」（S31）；Economist（二手）ChatGPT「now uses them less than any other model tested and less often than humans」（S35）。
- **硬禁的品質代價**：Antislop Table 2／Fig.3，token banning 在 8k 禁詞時寫作品質掉到 28/100；DPO 讓詞彙多樣性降到 74–92%（S1）。Antislop 附錄 A 也說明為什麼要 soft-ban：「Imposing a strict ban on words or phrases can cause problems with coherence when there are no viable alternatives.」
- **字串禁令的附帶傷害**（S32）：禁 "led with" 會連 "filled with" 一起禁；禁 "steeling h" 會讓 AI 寫不出自創派系名 "Steeling Hearts"。

### 6.3 過度矯正（人類端）

- Poynter（S36，🔎）報導 ACES 研討會：「flagxiety」；講者 Strunsky：「zapping em dashes out to preempt AI suspicions lowers a text's quality」，以及「If an em dash is the perfect punctuation for the point you're trying to make, I think it's more irresponsible to take that out and lose that meaning.」
- Ars（S16）：AI「killing」em dash，連帶傷到本來就愛用 em dash 的寫作者。

### 6.4 規則越多越死板

- **實證**：Antislop 的禁詞數量越多，token banning 越糟（2k 已不可用，8k 崩到 28 分），sampler 吞吐量損失從 1k 的 69% 到 8k 的 96%（S1）。
- **實務紀錄**：vale-ai-tells 九個月 57 個 release、77＋17＋13 條規則，其中多條是在補前一條被繞過的洞（S19b、S20）；byclaude「a phrase list that grew with every iteration and a model that kept finding the next variant」（S38，🔎）。
- **方法論批評**：R15 指出用 AI 寫的語料當基準來調規則，只會量到「how much a corpus resembles itself」（S20）。EQ-Bench 指出 LLM 評審本身可能偏好 slop，用 LLM 評審做 RL 會把 slop 選進來（S5）。
- **反方（禁令有效、副作用小）**：Antislop sampler 100% 抑制且品質不降（S1，限創作、LLM 評分）；FTPO 的替代詞強度比原本低 73%（S1b）；Claude Opus 4.6／GPT-5.4 在明確禁令下 em dash 歸零（S10）；Russell 的專家在 humanizer 下仍 100% 抓到（S27）——代表**表層禁令改變不了專家看的深層訊號**，這同時是「禁令沒用」與「偵測仍可行」的證據。

---

## 七、缺口與結案狀態

| 缺口 | 狀態 | 細節 |
|---|---|---|
| Antislop 論文編號與內容 | ✅ 已關閉 | arXiv 2510.15061（v1 2025-10-16、v2 2025-10-21），ICLR 2026 接受；v2 全文、ICLR 版附錄 L/M/N 已讀 |
| Jang et al. 2022 | ✅ 已關閉 | 全文已讀 |
| 2024–2026 否定指令遵循研究 | ✅ 已關閉 | S7、S8、S9、S10、S11 |
| Anthropic「告訴它要做什麼」原文 | ✅ 已關閉 | S14 原文已抄 |
| Ars Technica GPT-5.1 em dash | ✅ 已關閉 | S16 全文 |
| Antislop 對品質影響的數字 | ✅ 已關閉 | §6.2、Table 2、附錄 N |
| 禁令後的替代：字詞層級 | ✅ 已關閉 | S1b 附錄 L（lysandra 等） |
| 禁令後的替代：**句式層級的受控實驗**（例如禁 "not X but Y" 後量 "rather than" 是否上升） | ⚪ 確認無公開資料 | Exa「study measures what LLM writes instead after banned phrase list…」→ 只有部落格與工具 README；Exa「after banning em dashes AI models now overuse colons semicolons…」→ Graphite、Pew、Economist 轉述、Last Fingerprint，都沒有以禁令為自變數量替代句式；Antislop v2 與 ICLR 版（regex 結果只報被禁樣式歸零）；Last Fingerprint（只計 U+2014）；Jina search_arxiv 額度用完（"This key is out of quota"）無法再搜 arXiv |
| Wikipedia「2026-09 後硬編碼不用 em dash → 標點多樣性下降」的出處 | ⚪ 確認無出處 | wikitext 原句帶 `{{cn|date=October 2026}}`；搜尋只找到 Economist（二手轉述是「標點變少」，與 Wikipedia「逗號句號比人類多」說法不同）與 Graphite（說 GPT／Gemini「may have overcorrected」，沒談替代標點） |
| Economist 2026-07-30 原文 | ✉️ 只能訂閱或寫信 | Exa fetch：只有付費牆導言；r.jina.ai：只有導覽列；Wayback 20260910052809 快照：605 字元空殼。現有內容只能經 Dataconomy、Poynter、Wikipedia 二手引用 |
| proselint／write-good／alex 的精確率 | ⚪ 確認無公開資料 | proselint docs/philosophy.md 原文「for lack of an open corpus, we are currently unable to keep track of the lintscore」；write-good、alex README 無評估段（alex 自稱「isn't very smart」） |
| tropes.fyi AI Vetter 的評估數字 | ⚪ 確認無公開資料 | 作者部落格說有 eval suite 但無數字；https://tropes.fyi/vetter 與 /about 在 2026-10-28 回 404 |
| vale-ai-tells 的第三方精確率 | ✅ 已關閉（只有一份） | R15 約 4%（實務紀錄、單一專案）；作者端沒公布數字 |
| Juzek & Ward 的「delve 反彈」 | ✅ 已關閉 | 是讀者端反應，不是模型禁令後的替代：「participants preferred the abstracts without focal words」只出現在 delve 開頭的題目（p=0.023，係數 0.082）；2025 論文把「backlash」當前提，並因此濾掉含 21 個 AI 詞的變體 |
| 創作社群禁詞經驗 | ✅ 已關閉 | Sukino 指南與清單（S32、S33）；EQ-Bench slop 欄位（S5）；NovelAI 沒有找到專文（未深入搜） |
| LLM 審稿員抓空話／改寫 | ✅ 已關閉 | S28、S29、S30、S27 |

---

## 八、給寫作者的引用注意事項

1. 「Antislop 證明禁詞有效且不傷品質」只在**創作文體、LLM 評分**下成立；作者自己要求人類評分複驗。
2. 「禁令會反彈」的機制證據（S9 的 87.5% priming）是**單一 7B 模型、單字填空**；前沿模型在長文 em dash 禁令下可以做到 0（S10 的 Opus 4.6、GPT-5.4）。不要寫成「LLM 都做不到」。
3. 「禁了 em dash 就改用分號／冒號」目前**只有工具作者的紀錄**（vale-ai-tells changelog、slop-gate），沒有量化研究；Wikipedia 那句帶 citation needed。
4. 「禁了 not X but Y 就改用 rather than」**沒有直接證據**；Graphite 的 corrective framing 12 倍只是相關，而且 Graphite 是 SEO 公司的報告，用單一 prompt。
5. Shaib 論文內文與 Table 7b 的 span 數字不一致，引用時寫明出自哪裡。
6. Exa 把 *The Last Fingerprint* 的作者標成「S. Altman」，論文上的作者是 E. M. Freeburg。
