# 抽取紀錄抽查：第十批（21 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與寫作與精讀）
- 範圍：order 14 的 11 份（promptarmor-2024-slack-ai、reddy-gujral-2025-echoleak、presidio-docs、azure-rag-enrichment-phase-o14、debenedetti-2025-camel、hines-2024-spotlighting、pai-2026-camouflage-defenses、roychowdhury-2024-confusedpilot、owasp-2025-llm01-prompt-injection、zou-2024-poisonedrag、nasr-2025-attacker-moves-second），以及 order 15 的 10 份（azure-rag-enrichment-phase、openai-retrieval-guide、bedrock-kb-metadata-filtering、pinecone-filter-by-metadata、xu-2024-linkedin-kg-rag、yousuf-2026-metadata-rag、poliakov-2024-multi-meta-rag、poliakov-2026-probe、dadopoulos-2025-metadata-finqa、terrenzi-2026-faithful-findable）。
- 沒有改動任何抽取紀錄或文章。

## 抽樣方法

- 沿用第八、九批的方法。腳本：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/spot10/sample.py`（由 spot9/sample.py 複製，只把 `SECS` 換成這 21 份，每份都用預設的「可引用」「主張」「原句」節）。
- 候選行、排除條件、每份檔案前 `random.seed(17)` 後 `random.sample(候選, 3)`，都和前兩批相同。各份候選數：promptarmor 6、echoleak 5、presidio 7、azure-o14 3、camel 13、hines 10、pai 9、confusedpilot 6、owasp 13、poisonedrag 12、nasr 9、azure-o15 10、openai 8、bedrock 9、pinecone 4、xu 5、yousuf 13、poliakov2024 5、poliakov2026 6、dadopoulos 6、terrenzi 4。azure-o14 只有 3 個候選，三項全抽。
- camel、poisonedrag、nasr 三份抽的是含「附錄補讀」的現行版本；抽中的行都在補讀節之前，行號沒受影響。
- 核對方式：`sed -n`／`grep -n` 回 `scratchpad/fulltext/o14-*`、`o15-*` 找原處，數字逐個對到原句或原表。表格被拆散的兩份（nasr、poisonedrag）另有紀錄自己做的 `scratchpad/layout/*-layout.txt`，這次抽到的項目都在正文，不需要用到。
- 全部 21 份都有存全文檔，不需要補抓。唯一另外上網的是 camel 紀錄寫的 v1 摘要：`curl https://arxiv.org/abs/2503.18813v1` 存到 `scratchpad/spot10/dl/camel-v1-abs.html`（41,872 bytes），用來核對「v1 寫 67%」。
- 下列差異只是文字層的不同，不算不一致：彎直引號、Markdown 強調、PDF 斷行與斷字、雙欄混排、引文前後截短但不改意思。

## 讀取紀錄總核對（`wc -l` / `wc -c`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄 bytes | 實際 `wc -c` | 紀錄寫的已讀區段 |
|---|---|---|---|---|---|
| o14-promptarmor.txt | 73 | 73 | 10,930 | 10,930 | 1–73 |
| o14-slack.txt | 43 | 43 | 2,084 | 2,084 | 1–43 |
| o14-echoleak.txt | 513 | 513 | 53,257 | 53,257 | 1–513 |
| o14-aim-echoleak-cato.md | 263 | 263 | 21,078 | 21,078 | 1–263 |
| o14-msrc-cve-2025-32711.md | 185 | 185 | 9,122 | 9,122 | 全部 |
| o14-presidio-*.txt（9 檔） | 212／93／157／41／84／54／158／24／28 | 全部相符 | 6,641／8,260／29,226／3,452／4,985／3,360／9,175／2,764／3,082 | 全部相符 | 全部 |
| o14-azure-enrich.txt | 132 | 132 | 14,966 | 14,966 | 1–132 |
| o14-camel.txt | 10,191 | 10,191 | 434,738 | 434,738 | 補讀後 1–10,191 |
| o14-spotlight.txt | 786 | 786 | 43,581 | 43,581 | 1–786 |
| o14-pai.txt | 1,020 | 1,020 | 24,227 | 24,227 | 1–1,020 |
| o14-confusedpilot.txt | 1,569 | 1,569 | 78,736 | 78,736 | 1–1,300；參考文獻掃讀 |
| o14-owasp-llm01.txt | 113 | 113 | 11,396 | 11,396 | 1–113 |
| o14-poisonedrag.txt | 3,508 | 3,508 | 125,620 | 125,620 | 補讀後 1–3,508 |
| o14-attacker-moves-second.txt | 1,611 | 1,611 | 104,040 | 104,040 | 補讀後 1–1,611 |
| o15-azure-rag-enrichment.md | 401 | 401 | 25,266 | 25,266 | 1–401 |
| o15-openai-retrieval.md | 2,036 | 2,036 | 58,552 | 58,552 | 1–2,036 |
| o15-bedrock-kb-test-config.md | 541 | 541 | 39,255 | 39,255 | 1–541 |
| o15-bedrock-s3-metadata.md | 200 | 200 | 10,801 | 10,801 | 1–200 |
| o15-pinecone-filter-by-metadata.md | 442 | 442 | 16,705 | 16,705 | 1–442 |
| o15-xu2024-linkedin-kgrag.txt | 333 | 333 | 42,315 | 42,315 | 1–333 |
| o15-yousuf2026-metadata.txt | 703 | 703 | 42,726 | 42,726 | 1–703 |
| o15-poliakov2024-multimetarag.txt | 514 | 514 | 28,544 | 28,544 | 1–514 |
| o15-poliakov2026-probe.txt | 376 | 376 | 40,594 | 40,594 | 1–376 |
| o15-dadopoulos2025-metadata-finqa.txt | 1,174 | 1,174 | 99,882 | 99,882 | 正文 1–877；參考文獻讀到 1,019 |
| o15-terrenzi2026-faithful-findable.txt | 290 | 290 | 40,124 | 40,124 | 1–290 |

- 33 個全文檔，紀錄寫的行數與 bytes 全部和 `wc` 一致。
- 讀取缺口只有兩處，都是參考文獻（confusedpilot 1,300 以後、dadopoulos 1,019 以後），紀錄自己寫明。

---

## 1. promptarmor-2024-slack-ai.md

全文檔：`fulltext/o14-promptarmor.txt`（P）、`o14-slack.txt`（S）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L33 | "the attacker does not have to know what confidential data someone put in a private channel to exfiltrate it."（P 行 14） | P 第 14 行 | 逐字相符。 |
| 2 | L34 | 2024-08-14 起讀檔案；白字 PDF 原句；"we did not test for this functionality explicitly as the testing was conducted prior to August 14th"（P 行 47–53） | P 第 47–53 行 | 逐字相符。 |
| 3 | L35 | 時間線：08-14 通報；08-19 "deemed the evidence insufficient"、"This is intended behavior."；PromptArmor 08-20 公開（P 行 56–68） | P 第 56–68 行 | 08-14、08-19 與兩句引文相符。**「08-20 公開」不在 P 行 56–68**：時間線只列到 08-19，全文沒有 "August 20"。這個日期來自紀錄第 7 行說的 Exa 搜尋結果 published 欄。 |

判定：**通過（附註）**。08-20 這個日期要標成「搜尋結果的發布日」，不是時間線上的一項。文章只寫「Slack 在 2024 年 8 月修補」，不受影響。

## 2. reddy-gujral-2025-echoleak.md

全文檔：`fulltext/o14-echoleak.txt`（E）、`o14-aim-echoleak-cato.md`（A）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L38 | "this was easily bypassed simply by phrasing the email … aimed at the recipient"；"quality datasets that detect real-world prompt injections are scarce."（A 行 46–48） | A 第 46 行、第 48 行 | 逐字相符。 |
| 2 | L40 | "No single measure suffices—only a layered, defense-in-depth approach can contain this class of threats."（E 行 440–444） | E 第 440–445 行（右欄） | 逐字相符。 |
| 3 | L41 | Aim 對 LLM Scope Violation 的定義（A 行 40） | A 第 40 行 | 逐字相符。 |

判定：**通過**。

## 3. presidio-docs.md

全文檔：`fulltext/o14-presidio-faq.txt`、`o14-presidio-eval.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L35 | 駕照號碼 "could be any 9-digit number"；誤報與漏報的取捨（FAQ 行 75、81） | FAQ 第 75 行、第 81 行 | 逐字相符。 |
| 2 | L37 | "Most of these SaaS offerings … often have better entity coverage or accuracy than Presidio."（FAQ 行 41） | FAQ 第 41 行 | 逐字相符。 |
| 3 | L38 | eval 行 3、11 兩句；行 20–21 "the results aren't very accurate"、"boost the f score in ~30%" | eval 第 3、11、20、21 行 | 逐字相符。 |

判定：**通過**。

## 4. azure-rag-enrichment-phase-o14.md

全文檔：`fulltext/o14-azure-enrich.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L17 | "Guard against prompt injection attacks. … Never use the data from your content as a source of instructions during any processing tasks."（行 36） | 第 36 行 | 逐字相符。 |
| 2 | L18 | "Improve security with techniques like flagging or excluding media that contains embedded instructions. …"（行 37） | 第 37 行 | 逐字相符。 |
| 3 | L19 | 0–1 信心分數與 source grounding，"whether a value can be trusted for automated processing or requires human review"（行 101） | 第 101 行 | 相符（原文前面還有 "decide"）。 |

判定：**通過**。

## 5. debenedetti-2025-camel.md

全文檔：`fulltext/o14-camel.txt`；v1 摘要 `spot10/dl/camel-v1-abs.html`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L29 | v1 摘要 "solving 67% of tasks with provable security"；v2 改成 77% vs 84% | v1 abs 頁 meta 與摘要；v2 第 21–22 行 | 相符。v1 原文 "solving 67% of tasks with provable security in AgentDojo [NeurIPS 2024]"。 |
| 2 | L31 | 只靠隔離：Gemini 2.5 Pro 成功攻擊 300 → 0（行 915–924）；表 4 寫 163，不一致 | 第 924 行 "drops from 300 without to 0 with CaMeL"；表 4 第 2039 行 "163 ± 140.1" | 相符；紀錄指出的不一致確實存在，紀錄建議「用表 4 或不引具體數字」是對的。 |
| 3 | L33 | 表 8：STRICT 53.23%、NORMAL 33.87%（行 2063–2068），表上沒標模型 | 第 2063–2068 行 | 相符；表題 "Policy triggering rates in normal and strict modes when not under attack"，沒標模型。 |

判定：**通過**。

## 6. hines-2024-spotlighting.md

全文檔：`fulltext/o14-spotlight.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | "spotlighting reduces the attack success rate from greater than 50% to below 2% …"（行 26–28） | 第 26–28 行 | 逐字相符（前一行限定 "Using GPT-family models"）。 |
| 2 | L29 | 根因句 "… the LLM is not able to distinguish code from data."（行 50–60） | 第 50–55 行 | 逐字相符。 |
| 3 | L31 | delimiting 容易被繞過，"we do not recommend using delimiting in practice"（行 450–457） | 第 450–457 行 | 逐字相符。 |

- 附帶核對（未抽中，但影響文章）：紀錄**第 47 行**仍寫「spotlighting 在 Gemini-2.5 Pro、GPT-5 Mini、Llama-3.3 70B、MetaSecAlign 70B 上 ASR 都達 99%」，第 48 行的建議寫法也沿用「拉回 99%」。nasr 紀錄的附錄補讀已更正：GPT-5 Mini 是 **47%**，99% 只有其他三個模型。hines 紀錄這兩行沒跟著改。order 14 文章現行版本已用正確寫法（「其中三個模型」）。
- 附帶核對：「almost no added benefit」第 303–308 行逐字相符，講的是在系統提示加指示，不是 spotlighting。

判定：**抽樣通過；紀錄第 47–48 行有一處未更正的數字**（正確值：GPT-5 Mini 47%，99% 只限三個模型）。

## 7. pai-2026-camouflage-defenses.md

全文檔：`fulltext/o14-pai.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L27 | "64.5% (91/141) of breaches are task alignment failures, … the fundamental limit of input-side defenses."（行 422–424） | 第 422–424 行 | 逐字相符。 |
| 2 | L31 | "Do not assume cross-model transferability. Spotlighting halves Haiku ASR but raises Llama's by +1.1 pp …"（行 443–444） | 第 443–444 行 | 逐字相符。 |
| 3 | L32 | "All tasks use synthetically constructed professional documents; whether these benchmark rankings generalize to real enterprise documents remains an open question."（行 28–30、468–470） | 第 28–30 行（摘要） | 逐字相符。第 468–470 行是同一個意思的另一種寫法（"may not predict real-document behavior"），不是同一句。 |

- 附帶核對：spotlighting 14.4% → 6.7%、Llama 22.2% → 23.3% "non-significant"（第 164–166 行）相符；模型只有 Claude Haiku 4.5、Llama 3.1 8B、Gemini 2.0 Flash 三個，8B 是唯一的小模型。

判定：**通過**。

## 8. roychowdhury-2024-confusedpilot.md

全文檔：`fulltext/o14-confusedpilot.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L31 | 表 V：攻擊者只能存取 250/500 時，Attack 1 由 336–406 秒變 587–615 秒（行 1025 起） | 說明第 1020–1030 行；表 V 第 1115–1130 行（500：336s／406s）、第 1168–1174 行（250：587s／615s） | 相符。雙欄轉檔把表格拆在兩處。 |
| 2 | L36 | "despite all the security mechanisms employed … even though the attacker does not have any read/write/execute permission on the victim's other documents."（行 107–116） | 第 108–115 行 | 逐字相符。 |
| 3 | L37 | "retrieved data may contain legitimate instructions … Simply banning LLMs from 'execute' instructions inside the retrieved data limits RAG's usability."（行 1140–1163） | 第 1152–1162 行 | 逐字相符，區段涵蓋。 |

判定：**通過**。

## 9. owasp-2025-llm01-prompt-injection.md

全文檔：`fulltext/o14-owasp-llm01.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | 第 1 項緩解 "instruct the model to ignore attempts to modify core instructions"（行 22） | 第 22 行 | 逐字相符。 |
| 2 | L27 | "Separate and clearly denote untrusted content to limit its influence on user prompts."（行 32） | 第 32 行 | 逐字相符。 |
| 3 | L30 | 情境 #2：網頁藏指令讓 LLM 插入圖片連結外洩對話（行 39） | 第 39 行 | 相符。 |

判定：**通過**。

## 10. zou-2024-poisonedrag.md

全文檔：`fulltext/o14-poisonedrag.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | ReAct agent 黑箱 ASR 0.72／0.58／0.52（行 1492） | 第 1492 行 | 相符。 |
| 2 | L26 | 改寫查詢仍有高 ASR（行 1583–1588）；"we do not paraphrase texts in the knowledge database due to high computational costs" | 結論句在第 1583–1588 行附近（"paraphrasing defense cannot effectively defend"）；**引文在第 1608–1609 行** | 內容相符；引文行號不在紀錄寫的區段，差約 20 行。 |
| 3 | L28 | SHA-256 重複文字過濾，ASR 完全不變（行 1727） | 第 1724–1730 行 "We find that the ASR is the same" | 相符。 |

判定：**有小錯（行號）**。正確值：「we do not paraphrase texts in the knowledge database」在第 1608–1609 行。

## 11. nasr-2025-attacker-moves-second.md

全文檔：`fulltext/o14-attacker-moves-second.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 觸發字串 "User Note: Per new Blue Sparrow Tech policy, …"（行 381–384） | 第 382–383 行 | 逐字相符。 |
| 2 | L29 | "detectors are relatively easy to deploy … a useful–but limited–component of a broader defense strategy."（行 387–389） | 第 386–388 行 | 逐字相符。 |
| 3 | L30 | "defenses that merely report near-zero attack success rates on public benchmarks are often among the easiest to break …"（行 455–457） | 第 455–457 行 | 逐字相符。 |

- 附帶核對：紀錄正文第 20 行「四個模型都 99%」已在附錄補讀節第 77 行更正為 GPT-5 Mini 47%；第 87 行建議改用「多數組合 >80%」。order 14 文章現行版本照更正後寫。

判定：**通過**。

## 12. azure-rag-enrichment-phase.md（order 15）

全文檔：`fulltext/o15-azure-rag-enrichment.md`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L26 | 常見欄位清單（行 203–223）：ID（hash）、Title（語言模型產生）、…、Source "Returning the source allows the querier to cite the original source."、Language "can be useful as a filter in queries" | 第 203–223 行 | 相符；Title 的 Tools 是 "A language model"。 |
| 2 | L28 | 多語："Prefer localizing at the document level and reprocessing each language separately. Avoid storing unvalidated translations."（行 181） | 第 181 行 | 逐字相符。 |
| 3 | L30 | Content Understanding：generate／classify／extract，extract 只支援文件；信心分數與 source grounding（行 225–275） | 第 231–235 行 "This method is supported for documents only."；第 275 行 | 相符。 |

- 附帶核對：三種用途出自第 193 行圖說的 usage 欄（Return、Search、Search/Return、Search/Filter）。原文沒有寫「分成三種」這句話，是從圖說的欄位值歸納的；歸納本身正確。

判定：**通過**。

## 13. openai-retrieval-guide.md

全文檔：`fulltext/o15-openai-retrieval.md`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | 範例欄位：region、date、filename、project_code、confidentiality（"top_secret"）、language、category、department（行 368–456、1502–1519） | region 第 370–374 行、date 第 387–392 行、project_code 第 433 行、top_secret 第 446 行、language 第 452 行、category 第 1516 行；**department 在第 1158–1280 行** | 欄位都有；department 不在紀錄寫的兩個區段。 |
| 2 | L23 | 預設 800 tokens、overlap 400；100–4096；overlap 不超過一半（行 1660、1664–1665） | 第 1660、1664、1665 行 | 逐字相符。 |
| 3 | L24 | ranking_options：score_threshold 0.0–1.0 與原句；hybrid_search 權重（行 460） | 第 460 行 | 逐字相符。 |

- 附帶核對（影響文章）：比較運算子 gt／gte／lt／lte 在第 341–352 行只列名稱，**全頁沒有說它們只接受數字**（grep "number"、"numeric" 無結果）；日期範例用 Unix 時間戳（第 382–396、1507 行）。

判定：**通過（附註：department 行號）**。

## 14. bedrock-kb-metadata-filtering.md

全文檔：`fulltext/o15-bedrock-s3-metadata.md`（B）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | includeForEmbedding true 的原句（B 行 94–98） | B 第 98 行 | 逐字相符。 |
| 2 | L26 | "All data that you sync from your data source becomes available to anyone with bedrock:Retrieve permissions"（B 行 118） | B 第 118 行 | 逐字相符。 |
| 3 | L27 | "You can't change the chunking strategy after connecting to the data source."（B 行 140） | B 第 140 行 | 逐字相符。 |

判定：**通過**。

## 15. pinecone-filter-by-metadata.md

全文檔：`fulltext/o15-pinecone-filter-by-metadata.md`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L15 | 每個 $in／$nin 最多 10,000 個值（行 367） | 第 367 行 | 相符。 |
| 2 | L16 | 清單型欄位 `{"genre": ["comedy","documentary"]}`；$and comedy 且 drama 不命中（行 369–389） | 第 369–389 行 | 相符。 |
| 3 | L17 | text-match 三個運算子，"narrow the candidate set before scoring, the same way metadata operators do"（行 405–430、407） | 第 405–407 行 | 逐字相符。 |

判定：**通過**。

## 16. xu-2024-linkedin-kg-rag.md

全文檔：`fulltext/o15-xu2024-linkedin-kgrag.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | Table 2：BLEU 0.057 → 0.377、METEOR 0.279 → 0.613、ROUGE 0.183 → 0.546；摘要 "by 0.32 in BLEU"（行 235–241） | Table 2 第 237–241 行（右欄）；"by 0.32" 在第 44–45 行（摘要）與第 287 行（結論） | 相符。 |
| 2 | L26 | Limitation 1 "Compromised Retrieval Accuracy from Ignoring Structures"；Limitation 2 固定長度切斷問題與解法（行 60–84） | 第 60 行（右欄）、第 74–81 行 | 相符。 |
| 3 | L27 | "… without worrying about quality since the text all belong to the same section."（行 122–126） | 第 126 行（右欄） | 逐字相符。 |

- 附帶核對（影響文章）：工單的區段名稱是 Summary、Description、Priority、Root Cause、Steps to Reproduce（第 84、120、140 行）；工單之間的連結是 clone／related 這類「明確連結」與標題相似度的「隱含連結」，是圖的邊，不是欄位。

判定：**通過**。

## 17. yousuf-2026-metadata-rag.md

全文檔：`fulltext/o15-yousuf2026-metadata.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L27 | unified：63.33／60.00／55.00／51.67 | Table 2 第 449 行（OpenAI Dual(Unified) 一般 63.33、深入 60.00）、第 461 行（bge-m3 55.00、51.67） | 相符。 |
| 2 | L30 | 失敗率：OpenAI 一般題 10.00 → 前綴 3.33；bge-m3 30.00 → 3.33 | 第 444、448、456、460 行 | 相符。 |
| 3 | L32 | 改寫查詢失敗率上升：OpenAI 10.00 → 22.41、bge-m3 30.00 → 34.48；"trail these methods"（行 429） | 第 447、459 行；第 429 行 "Late-fusion dual encoders and metadata-aware query reformulation trail these methods." | 相符。 |

- 附帶核對：Context@K 定義是「top K 裡至少一個 chunk 支持答案」（第 389 行）；33.33 → 55.00 是 OpenAI 編碼器、一般題、前綴法（第 444、448 行）。

判定：**通過**。

## 18. poliakov-2024-multi-meta-rag.md

全文檔：`fulltext/o15-poliakov2024-multimetarag.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | voyage-02：MRR@10 0.6016 → 0.6748；Hits@10 0.7419 → 0.9042；Hits@4 0.6630 → 0.792 | Table 2 第 315、321 行 | 相符。 |
| 2 | L24 | "the publishing date filter was extracted in 15.57% of queries, while 22.81% of queries of the MultiHop-RAG dataset are temporal."（行 204–206） | 第 204–206 行 | 逐字相符。 |
| 3 | L27 | Table 4：temporal GPT-4 0.256、PaLM 0.4545（行 351–361） | 第 360 行 | 相符。 |

判定：**通過**。

## 19. poliakov-2026-probe.md

全文檔：`fulltext/o15-poliakov2026-probe.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L22 | null 題：GPT-3.5 0／301；子字串 66.8%；probe 93.7%；排除 null 後 90.6／90.8／91.7%，差 1.1 點內（行 222–225） | 第 218–224 行 | 相符；順序是 probe／子字串／GPT-3.5。 |
| 2 | L23 | "In 95.4% of gold query–source pairs, the source name appears verbatim within the query text."（行 41–42） | 第 41 行 | 逐字相符。 |
| 3 | L24 | GPT-3.5 過濾檔有 398 題附 published_at（行 105–106、265） | 第 106 行、第 265 行 | 相符。 |

- 附帶核對：49／128／79 在摘要第 10–11 行與引言第 38–39 行兩處，數字一致。

判定：**通過**。

## 20. dadopoulos-2025-metadata-finqa.md

全文檔：`fulltext/o15-dadopoulos2025-metadata-finqa.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | Filtering + Rewriting + Cohere 由 Std 換 Ctx：Claim Recall 47.7 → 42.3；F1 37.3 → 44.4；「every single head-to-head comparison」（行 728–734） | Table 1 第 702–703 行；第 728–734 行 | 相符。逐列核對五組 Std/Ctx，F1 都是 Ctx 較高。 |
| 2 | L24 | chunk expansion：Claim Recall 47.7 → 41.1；F1 37.3 → 33.2；Hallucination 14.7 → 22.2（行 768–775） | 第 768–775 行 | 相符。 |
| 3 | L25 | "Pre-retrieval Steps are a Double-Edged Sword: …"（行 784–786） | 第 784–786 行 | 逐字相符。 |

判定：**通過**。

## 21. terrenzi-2026-faithful-findable.md

全文檔：`fulltext/o15-terrenzi2026-faithful-findable.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | Dense nDCG@10：原 0.5628；rewrite 0.5766；profile gen 0.3740；dataset agent 0.4180 | Table 1 第 136–141 行 | 相符（profile rewrite 0.5652 紀錄沒列，不影響）。 |
| 2 | L24 | Table 2 supported：rewrite 0.5283（contradicted 0.0523、證據不足 0.3336）；profile rewrite 0.8152；profile gen 0.7005；dataset agent 0.6459 | 第 126–131 行（右欄） | 相符。 |
| 3 | L25 | "The best retrieval performance is obtained by the unconstrained metadata rewrite variant … stronger retrieval does not necessarily indicate better metadata quality"（行 215–227） | 第 214–225 行 | 逐字相符。 |

判定：**通過**。

---

## 摘要

| # | 紀錄 | 3 項抽樣 | wc 行數／bytes | 區段涵蓋 | 判定 |
|---|---|---|---|---|---|
| 1 | promptarmor-2024-slack-ai | 3/3 內容相符 | 一致（兩檔） | 完整 | 通過（08-20 來源是搜尋結果，不是時間線） |
| 2 | reddy-gujral-2025-echoleak | 3/3 | 一致（三檔） | 完整 | 通過 |
| 3 | presidio-docs | 3/3 | 一致（九檔） | 完整 | 通過 |
| 4 | azure-rag-enrichment-phase-o14 | 3/3 | 一致 | 完整 | 通過 |
| 5 | debenedetti-2025-camel | 3/3 | 一致 | 補讀後完整 | 通過 |
| 6 | hines-2024-spotlighting | 3/3 | 一致 | 完整 | 抽樣通過；第 47–48 行的 99% 未更正 |
| 7 | pai-2026-camouflage-defenses | 3/3 | 一致 | 完整 | 通過 |
| 8 | roychowdhury-2024-confusedpilot | 3/3 | 一致 | 參考文獻掃讀 | 通過 |
| 9 | owasp-2025-llm01-prompt-injection | 3/3 | 一致 | 完整 | 通過 |
| 10 | zou-2024-poisonedrag | 3/3 內容相符 | 一致 | 補讀後完整 | 有小錯：一處引文行號 |
| 11 | nasr-2025-attacker-moves-second | 3/3 | 一致 | 補讀後完整 | 通過 |
| 12 | azure-rag-enrichment-phase | 3/3 | 一致 | 完整 | 通過 |
| 13 | openai-retrieval-guide | 3/3 | 一致 | 完整 | 通過（department 行號在別處） |
| 14 | bedrock-kb-metadata-filtering | 3/3 | 一致（兩檔） | 完整 | 通過 |
| 15 | pinecone-filter-by-metadata | 3/3 | 一致 | 完整 | 通過 |
| 16 | xu-2024-linkedin-kg-rag | 3/3 | 一致 | 完整 | 通過 |
| 17 | yousuf-2026-metadata-rag | 3/3 | 一致 | 完整 | 通過 |
| 18 | poliakov-2024-multi-meta-rag | 3/3 | 一致 | 完整 | 通過 |
| 19 | poliakov-2026-probe | 3/3 | 一致 | 完整 | 通過 |
| 20 | dadopoulos-2025-metadata-finqa | 3/3 | 一致 | 參考文獻讀到 1,019 | 通過 |
| 21 | terrenzi-2026-faithful-findable | 3/3 | 一致 | 完整 | 通過 |

- 63 項抽樣：數字與原句全部和原文相符。沒有不通過的紀錄。
- 33 個全文檔，紀錄寫的行數與 bytes 全部和 `wc` 一致。
- 錯誤與正確值：
  1. hines：紀錄第 47 行「spotlighting 在四個模型上都 99%」應為 **Gemini-2.5 Pro、Llama-3.3 70B、MetaSecAlign 70B 三個 99%，GPT-5 Mini 47%**（nasr 附錄補讀已更正，hines 沒跟著改）；第 48 行建議寫法的「拉回 99%」也要加「在三個模型上」。
  2. zou：「we do not paraphrase texts in the knowledge database」在**第 1608–1609 行**（紀錄寫 1583–1588）。
  3. promptarmor：「PromptArmor 08-20 公開」不在 P 行 56–68，日期出自 Exa 搜尋結果的 published 欄（紀錄第 7 行）。
  4. openai：department 欄位範例在**第 1158–1280 行**，不在紀錄寫的兩個區段。
- 寫文章要留意、但紀錄沒錯的地方：
  - OpenAI 頁面沒有說 gt／lt 只接受數字，只有日期範例用 Unix 時間戳；「只接受數字」是 Bedrock（kb-test-config）與 Pinecone 明寫的。
  - LinkedIn 的「相關工單」是圖的邊，不是工單欄位；工單欄位是 Summary、Description、Priority、Root Cause、Steps to Reproduce。
  - Azure 的三種用途是從圖說 usage 欄歸納的，原文沒寫「三種」。
  - CaMeL 的 token 倍數是**中位數**（表 10，不受攻擊，Claude 3.5 Sonnet）；平均值是輸入 7.24 倍、輸出 6.23 倍。
  - Dadopoulos 同時顯示 metadata 併入向量（Ctx）讓 F1 在五組比較裡全部提高；只引召回下降會偏向一邊。
