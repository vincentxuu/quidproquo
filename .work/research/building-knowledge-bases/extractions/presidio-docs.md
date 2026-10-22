# 抽取紀錄：Presidio 官方文件（首頁、FAQ、支援實體、多語、評估、專案移轉）

read_status=full（下列 9 頁正文全讀；另以 GitHub API 列出 predefined_recognizers 目錄核對國別）

## 書目

- Presidio（原 Microsoft 開源專案，現由社群組織 Data Privacy Stack 治理，MIT 授權）。
- 網址：舊址 https://microsoft.github.io/presidio/ 現在是一頁 meta refresh 轉址（471 bytes，"This page has moved"），轉到 https://data-privacy-stack.github.io/presidio/ 。sources.jsonl 原列的是新網址，正確。
- 讀取日 2026-10-22。頁面無明確發布日期。
- 讀取方式：curl 取 HTML → 取 <article>（首頁取 <main>）→ pandoc plain → 刪空行。全文檔（scratchpad/fulltext/，完整路徑 /private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/）：

| 檔案 | 來源頁 | 行數 | bytes | 已讀 |
|---|---|---|---|---|
| o14-presidio-dps.txt | 首頁 | 212 | 6,641 | 1–212（1–163 是側欄目錄，正文 164–212） |
| o14-presidio-faq.txt | /faq/ | 93 | 8,260 | 1–93 |
| o14-presidio-supported_entities.txt | /supported_entities/ | 157 | 29,226 | 1–157 |
| o14-presidio-lang.txt | /analyzer/languages/ | 41 | 3,452 | 1–41 |
| o14-presidio-nlpcustom.txt | /analyzer/customizing_nlp_models/ | 84 | 4,985 | 1–84 |
| o14-presidio-spacy.txt | /analyzer/nlp_engines/spacy_stanza/ | 54 | 3,360 | 1–54 |
| o14-presidio-transformers.txt | /analyzer/nlp_engines/transformers/ | 158 | 9,175 | 1–158 |
| o14-presidio-eval.txt | /evaluation/ | 24 | 2,764 | 1–24 |
| o14-presidio-transition.txt | /project_transition/ | 28 | 3,082 | 1–28 |

- 另：`gh api repos/data-privacy-stack/presidio/git/trees/main?recursive=1` 列出 presidio-analyzer/presidio_analyzer/predefined_recognizers/country_specific/ 底下所有國別目錄。

## 性質

- 開源工具官方文件。沒有提供 Presidio 自身的準確率數字（評估頁只說 notebook 5 調整後 F 分數可提升約 30%）。

## 可引用原句

1. **不保證找全**（首頁 行 182–183；FAQ 行 29–30，兩處同文）："Presidio can help identify sensitive/PII data in un/structured text. However, because it is using automated detection mechanisms, there is no guarantee that Presidio will find all sensitive information. Consequently, additional systems and protections should be employed."
2. 偵測方法（首頁 行 177）："Predefined or custom PII recognizers leveraging Named Entity Recognition, regular expressions, rule based logic and checksum with relevant context in multiple languages."
3. 模組（首頁 行 189–192）：analyzer（偵測）、anonymizer（去識別：remove、redact、hash、encrypt 等，FAQ 行 51）、image redactor（OCR 後偵測）、structured（表格／半結構化）。
4. 誤報與漏報的取捨（FAQ 行 75、81）："A driver's license number, for example, could be any 9-digit number." ；"Every PII identification logic would have its errors, and there is a trade-off between false positives (falsely detected text) and false negatives (PII entities which are not detected)."
5. 降誤報的方法（FAQ 行 76–80）：調高 acceptance threshold、移除用不到的 recognizer、改 recognizer 邏輯、換第三方服務。
6. 與雲端服務比（FAQ 行 41）："Most of these SaaS offerings use dedicated ML models and other logic for PII detection and often have better entity coverage or accuracy than Presidio."
7. 評估（eval 行 3、11）："No de-identification system is perfect. It is important to evaluate the performance of a PII detection system for your specific use case." ；"In PII detection, recall is often more important than precision … we recommend to use the β=2 score"。eval 行 20–21：預設設定 "the results aren't very accurate"，調整後 "boost the f score in ~30%"。
8. 不是服務、沒 SLA（FAQ 行 28、39）："Presidio is a library or SDK rather than a service." ；"Presidio is not an official product of any company and comes with no warranty or SLA."
9. API 沒有內建驗證（FAQ 行 88）："Presidio API endpoints do not include built-in authentication by design … It is strongly recommended not to expose Presidio services directly to untrusted networks without an authentication layer in front of them."

## 支援的實體（supported_entities 行 5–145）

- Global（行 6–20）：CREDIT_CARD、CRYPTO（只有 Bitcoin）、DATE_TIME、EMAIL_ADDRESS、IBAN_CODE、IP_ADDRESS、MAC_ADDRESS、NRP、LOCATION、PERSON、PHONE_NUMBER、MEDICAL_LICENSE、URL。
- 國別：USA、UK、Spain、Italy、Poland、Singapore、Australia、India、Finland、Korea、Nigeria、Philippines、Canada、Sweden、South Africa、Thai、Turkey、Germany（行 21–133）；另有 Medical/Clinical（需 transformers，行 134–145）。
- **沒有台灣（身分證、統一編號、健保卡）也沒有中國的 recognizer**；GitHub 目錄核對結果相同。韓國、泰國有身分證號，台灣沒有。
- 偵測方法多是 "Pattern match, context and checksum"——規則式為主，名字、地點靠 NER 模型。

## 中文支援（lang 行 2–16；nlpcustom 行 77–79）

- "In its default configuration, it contains recognizers and models for English."（lang 行 2）
- 加新語言要換 NLP 引擎（spaCy／Stanza／transformers 的該語言模型）並調整 recognizer（lang 行 3–5、13）。
- 規則本身與語言無關，但提高信心分數用的 context words 有語言之分，要換成該語言的詞（lang 行 7、15）："Each recognizer can support one language."
- 文件範例只示範英文與西班牙文；**九頁中沒有任何一處提到中文**。也就是說中文要自己接中文 NER 模型、自己寫台灣身分證等規則，官方沒有現成支援，也沒有中文的準確率數字。

## 專案移轉（transition 行 3–23）

- "transitioning from a Microsoft-owned project to an independent, community-governed open source project under the new GitHub organization Data Privacy Stack"；Docker 映像改到 ghcr.io/data-privacy-stack，MCR 舊映像不再更新（行 21）。
- 文章寫「微軟的 Presidio」要改成「原由微軟開發、現由社群維護的 Presidio」。

## 沒寫的事

- 沒有官方準確率、召回率數字（只有評估工具與「約 30%」的調整幅度）。
- 沒有討論「嵌入向量／索引裡的個資」：Presidio 處理文字，不處理已經 embedding 的向量。
- 沒有談 prompt injection（不是它的範圍）。

## 與範圍卡說法的核對

- 「個資偵測與去識別（Presidio 為例，自動偵測不保證找全）」：正確，原句見首頁行 183／FAQ 行 30。
- 建議補：預設只有英文；沒有台灣身分證 recognizer；繁中語料要自行加中文 NER 與規則，並用自己的題庫量召回率（官方建議 recall 優先、用 F2）。

## 對 order 14 的用法

- 入庫第一道關卡「個資檢查」：analyzer 偵測 → anonymizer 遮蔽或替換 → 低信心或漏報風險高的文件轉人工；並說明「不保證找全，所以還要權限與輸出端掃描」。
- 「先量再信」：引 eval 行 3、11（每個情境都要評估；召回率比精確率重要）。
