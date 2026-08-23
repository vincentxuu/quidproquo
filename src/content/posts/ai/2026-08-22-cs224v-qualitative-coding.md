---
title: "Stanford CS224V 第 9 講：自動質性編碼為什麼需要 codebook、型別與人工覆核"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, qualitative-coding, event-extraction, structured-output]
lang: zh-TW
type: deep-dive
series:
  name: "Stanford CS224V 導讀"
  order: 10
tldr: "自動質性編碼先以 codebook 定義事件型別與 arguments，再把長文分類、結構化抽取和 entity linking 分開；受約束 JSON 能保格式，仍不能取代領域專家的覆核。"
description: "CS224V Document Set Analysis：質性編碼、ACLED codebook、abstractive event detection、Python/JSON schema、entity linking 與端到端限制。"
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224v-qualitative-coding-en)

本文依據[官方 Fall 2025 講義](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf)重建本講；下文的系統設計與講義所報結果，除非在主張處另連原論文，均歸屬這份歷史課程材料。

第九講討論一種常被低估的文件分析：研究者不是只問一題，而是依 codebook 持續標記大量文件裡的事件、角色、地點與關係。講義以疫情事件與 [ACLED 衝突事件方法](https://acleddata.com/methodology/)為主線，最後的結論很克制：自動質性編碼仍不足以跳過人工品質流程。

## Agenda：從人工方法到端到端抽取

講義先定義 qualitative coding 與 codebook，介紹疫情與 ACLED 案例，再檢討句子／span-based extraction。後半把 abstractive event extraction 拆成事件型別判定、argument extraction、受約束輸出、entity retrieval/filtering/assignment，最後做 task-specific 與 end-to-end 評估。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## Codebook 是 schema，也是判斷規則

Codebook 不只列欄位。它定義事件型別的邊界、每類事件有哪些 arguments、哪些案例該排除，以及標註者如何處理重疊事件。ACLED 類任務跨國家、語言與時間，新聞也常在一句以外才補足行動者或結果；只抓 trigger word 與附近 span 會漏掉抽象事件。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

因此第一步是 abstractive event-type detection：讀完整文件，依 codebook 排出適用事件類別。知道事件型別後，第二步才聚焦其 typed arguments，例如地點、參與者與時間。

## Qualitative coding 與一般 QA 的差別

QA 以問題為中心，從文件找一個答案；qualitative coding 以 codebook 為中心，對整個 corpus 一致套用類別與欄位。輸出不是一段回覆，而是能供研究者統計、比較與回看來源的 records。漏標與錯標會系統性改變後續分析，不只是讓單一使用者看到錯句。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

人工流程通常包含 codebook 設計、coder training、獨立標註、disagreement review 與規則修訂。自動化若只模仿最後一步「輸出 label」，會忽略類別其實由反覆協商形成。Lecture 以 ACLED 的 detailed codebook 與 review 品質說明，資料集本身是長期制度，不是一個 prompt template。

因此系統至少要版本化 codebook、保留 document/span provenance、記錄不確定與允許 review override。若模型更新後把舊文件用新規則重標，研究者還要知道兩批 rows 是否可直接比較。

## 疫情事件案例展示跨語言與前瞻需求

講義先用 social-media event detection 說明 coding 可以支援 epidemic preparedness。Tweets 或貼文包含症狀、預防、死亡與地點等訊號，研究問題不是只找關鍵字，而是抽象成 event ontology，觀察未來疫情可能出現的模式。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

跨語言使 keyword/rule 方法更脆弱。同一事件有地方用語、拼寫與隱喻；只有高資源語言有大量標註。Abstractive extraction 希望讀完整語意後產生統一 event representation，但 model knowledge 與 translation bias 也可能讓低資源語言更常被錯分。

Evaluation 應按語言、地區、event type 與時間分層。Random split 會讓同一事件敘事同時進 train/test，得到過度樂觀結果；時間切分更接近用過去事件預測未來。Lecture 後面的 ACLED dataset 也採 training 與 validation/test 分時期的概念。

## ACLED 為什麼是困難的 codebook

ACLED 涵蓋大量國家與政治暴力／抗議事件，包含多個 subevent types、actors、location、fatalities 與關係。新聞常同時描述多個事件，事件本身不一定有單一 trigger word。某段提到「抗議後警方使用暴力」，可能同時需要 protest 與 excessive-force records。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

Sentence/span extraction 傾向先找 `killed`、`protested` 之類 mention，再在附近抓 arguments。Lecture 指出 event time、victim、actor 或前因可能散在不同句；而 codebook category 取決於整篇主要事件與專家定義。Abstractive event detection 直接讀 full text，先決定有哪些 events，再建立 arguments。

Codebook 中相近類別需要 negative boundaries。只把二十五個描述放進 prompt，模型常會多選語意接近 categories。更好的 evaluation 不只算 micro average，也看 confusion pairs，並保存 model rationale 供 reviewer 判斷它引用了哪條 guideline。

## Problem 1：Abstractive Event Detection

第一個 task 把完整文章映射到排序 event types。Zero-shot prompt 提供類別說明，要求模型比較文章主軸、actors、actions 與 outcomes，再輸出相關類別。排序很重要，因為一篇可能含多事件，而 downstream review 能先看最可能者。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

這一步的 risk 是 codebook 長度。完整 guidelines 可能超過 context，縮寫又會丟掉 exceptions。可先 retrieval relevant type definitions，再讓 classifier 比較候選；但 retrieval miss 會形成新 recall bottleneck。兩階段 evaluation 要分 candidate recall 與 final classification。

模型的 chain-of-thought 不應被當成 correctness evidence。可要求簡短 guideline citation 或 supporting spans，讓 reviewer 看得到來源；正式 output 仍要是 stable event IDs，而不是自由文字類別名。

## Problem 2：Argument extraction 與 typed classes

知道 event type 後，只載入該類 arguments 與 guidelines，降低 context。Lecture 先展示一般 LLM prompt，再引入 Python class definitions：event type 是 class，arguments 是 typed fields，docstrings 放專家說明，nested structures 表達 participants 與 relations。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

Class definition 同時服務人與機器。開發者能 review schema，工具能轉成 JSON Schema，decoder 能限制合法結構。Required/optional、enum 與 nested type 讓缺欄或錯型別直接被 validator 找到。這比事後 regex 修 JSON 更可靠。

然而 schema-valid 不等於 factually valid。模型可能填錯 actor、把報導地點當事件地點，或將兩個 events 的 arguments 混在一列。每個 field 仍需 source span、document context 與 cross-field constraints；例如死亡數不能無來源地由其他段落推算。

## Constrained decoding 解決的是 syntax layer

講義列出 Python class → JSON Schema → context-free grammar → constrained generation 的路徑，並提到 SGLang、Outlines、guidance 類工具。Decoder 在每一步只允許能形成合法 JSON 的 tokens，消除括號、key 與型別錯誤，也能限制 enum。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

它不會判斷 codebook 是否選對，也不會查 entity 是否存在。這個 distinction 應在報告中分開：format validity 可以接近百分之百，semantic accuracy 仍可能低。把兩者合稱「structured output accuracy」會誤導。

Constrained schema 太嚴也可能隱藏 unknown。若每欄 required，模型被迫猜值；應為 unknown/not stated 設計明確表示，並讓 reviewer 看 missingness。資料分析中，誠實缺值比漂亮完整 row 更重要。

## Entity linking 是第三個獨立 pipeline

Argument extraction 得到 `government forces`、組織縮寫或地方 group 名，研究資料庫需要 canonical entity ID。候選可超過一萬，不能全部放 context；而許多 local actors 根本不在 Wikipedia/Wikidata，不能只靠公開 knowledge graph。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

Lecture 的三階段做法是 retrieval 把大量 entity 壓到候選集、filter 再縮小、assignment 把每個 argument 連到候選。每段有不同錯誤：retrieval 漏掉正確 entity、filter 丟錯、assignment 混淆同名。End-to-end linking score 之外要報 candidate recall。

新增 entity 也需治理。模型找不到不代表應自動建一個 canonical record；可能只是別名未登記。Human reviewer 應決定 alias merge 或 new entity，並把決策回寫 entity database。

## End-to-end 結果為何仍不夠

講義最後明說 automatic qualitative coding is not good enough。即使 individual event detection 或 argument extraction 有不錯分數，串接後 errors 相乘；long-tail types、跨語言、entity linking 與 codebook exceptions 會集中在最需要專業判斷的案例。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

適合的 deployment 是 human-in-the-loop triage：模型預填 records、標 uncertainty、把高信心簡單案例排前，專家 review/修正後才進正式 dataset。Automation 可減少重複閱讀，不能取消 codebook governance 與 quality review。

衡量效益時也不要只算速度。應看 reviewer 接受率、修改欄位、漏事件 audit、跨 coder consistency 與每個 validated record 的時間。模型讓人更快產出錯資料不是改善。

## 建立一個小型 AQC 實驗

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

選一個 domain 與五個 event types，為每類寫 definition、inclusion、exclusion、arguments、正例與 near-miss。二十份文件由兩位 reviewer 先獨立標註並解決 disagreement，形成 gold 與 codebook v1。

Pipeline 分三個 artifacts：ranked event types、typed arguments with spans、entity candidates/assignment。每層單獨評估，再做 end-to-end。低 confidence、類別衝突、缺 required evidence 一律送 review，不讓模型補齊。

修正 codebook 後保留 v1 結果並重跑同一 corpus，建立 migration notes。這能看出改善來自 model、prompt 或規則，也符合 qualitative research 對 audit trail 的要求。

## 程式型規格約束輸出，不保證內容正確

講義把 coding guidelines 寫成 Python class 與 typed fields，再轉成 JSON Schema 和 context-free grammar，讓 constrained decoding 只能產生合法結構。這能消除少欄位、錯型別與無法解析的 JSON，卻不能保證事件判斷、欄位值或跨事件關係正確。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

Entity linking 又是獨立問題。候選實體可能超過模型 context，也不一定存在 Wikidata。pipeline 先用向量檢索縮小候選，再過濾，最後把 argument 指派到領域資料庫中的 entity。每段都需要自己的 recall 與 accuracy 診斷。

## 為什麼仍要人工覆核

Qualitative coding 的價值來自一致應用 codebook，而不是產出很多 rows。類別邊界變動、新地區用語、來源偏差與複合事件都需要專家判斷。講義的端到端結果直接指出 automatic qualitative coding 尚未足夠；適合的角色是預填、排序與標記不確定案例。 ([講義來源](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf))

## 可以怎麼做

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

先拿二十份文件做小型 codebook，為每個事件型別各寫一個正例、近似但應排除的反例。模型輸出必須含來源句與 confidence，低信心或多類衝突直接送人工覆核。每次修 codebook 都重跑同一批案例。

## 材料缺口

> **本文建議：** 以下是依本講方法延伸的實作或檢核方式，不是投影片所報研究結果。

講義摘要仍在進行的研究與多份資料集，沒有公開完整標註手冊、review 流程或訓練／評估程式；本文不把研究 pipeline 寫成已可無人監督部署。

## 參考資料

- [Lecture 9: Document Set Analysis—Qualitative Coding](https://web.stanford.edu/class/cs224v/lectures/l-data-coding.pdf)
- [ACLED methodology](https://acleddata.com/methodology/)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [Lecture 8: Long-Document Analysis](https://web.stanford.edu/class/cs224v/lectures/l-longdoc-new.pdf)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
