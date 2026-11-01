# 2026-10-07-interview-experience-english — 系列整合範圍審稿

日期：2026-10-25。審查者：非本輪正文作者（integration reviewer）。
範圍：只核對既有中英檔的series metadata納入與既有正文結構；不冒稱重新完成全文事實查證、外部價格／研究更新或教學改寫。

## post-verify

- 本輪確認範圍：系列名稱zh「英文口說練習」／en「English Speaking Practice」，order 9，對齊unified-series.json與34篇總表。
- 逐檔和before快照比對：

| id | 日期 | lang | 正文SHA256（before=current） | 除series外metadata一致 |
|---|---|---|---|---|
| learning/2026-10-07-interview-experience-english | 2026-10-07 | zh-TW | ffe1118f697d7ef9e85938d41e19018faf31f31791d6f9ad0f0d2f72f8005f6a | true |
| learning/2026-10-07-interview-experience-english-en | 2026-10-07 | en | ce31fcb00acfbc1dd21bb87e6becaa5a723aaf0a2e2596427c8a10fa56e7e88c | true |

- slug／檔名不變；正文逐位元組hash一致，date、lang、title、tags等非series欄位一致：通過。
- 舊文的研究、價格、工具功能、英語例句與安全相關外部主張，本輪未重新查網頁／論文；原文來源與限制保持原狀。metadata整合通過不等於這些主張已重新Confirmed。

## post-review

- 系列角色：面試基本材料，責任、專案、失敗與反問；開頭要求換成自己的經歷，Oxford句型來源與本人工作內容分開。
- 已逐篇讀中文與英文標題、開頭、H2和來源標籤，角色對應總表情境材料分組，均為同一系列。
- zh-TW：標題「用英文在面試講自己的經驗：自我介紹、專案、失敗與反問的十句話」；H2 10節；文末外部來源連結18條；雙語互連有；series名稱與order核對通過。
- en：標題「Talking About Your Experience in an English Interview: Ten Sentences for Introductions, Projects, Failures, and Questions」；H2 10節；文末外部來源連結18條；雙語互連有；series名稱與order核對通過。
- 內部文章連結存在性：兩語所有/posts目標檔存在。
- 機械驗證範圍：本報告執行本篇metadata／body hash／檔案連結比對與下列兩個只讀掃描；未跑full verify、外部連結HTTP或UI操作，不據此宣稱全站品質、全文教學或部署驗收。

## post-polish

- 正文未改；依post-polish預設僅標示，不擅改舊文。
- 中文register-scan exit=0；phrase-ledger exit=0。下方是實際輸出，命中是待人工判讀提示，不包裝成零問題。英文練習句、教材引文與精確技術名詞屬保護片段；來源／正文未因掃描刪改。
- 本次不進行全文潤稿；若掃描有長句、引述、數字密度或模板句型，視為既有稿件的後續潤稿線索，不能用metadata任務清除。

### register-scan 實際結果

```text
正文段落數：44

── 1. 長句（氣口）：兩個句號之間超過 60 字
  74 字｜Oxford 標它是正式用字，定義是讓�…
  64 字｜**disagree with + 人**：Oxford 的例句 *I…
  67 字｜**Since then + 現在完成式**：Oxford 說…
  99 字｜求職網站 The Muse 整理了可以問面�…
  合計 4 句

── 2. 但書密度：含轉折詞的段落佔比
  1 / 44 段（2%）

── 3. 引述區塊（正文，不含語言導覽列）
8

── 4. 數字密度：單段 4 個以上數字
  4 個｜這一組有情境層的依據。求職網站…

── 5. 研究者姓名當段落主詞
0
  0

── 6. 建議讀者做的事，有沒有配具體動作
  「怎麼做」段落數：0
  （人工核對：每個判 ✅／建議照做的項目都該有一段）

── 7. 模板化轉折句型（同篇反覆會有 AI 感）
  合計 0 處

── 8. 一般英文術語密度（中文散文，人工判讀）
  合計 0 次
  （品牌、API 欄位、官方 UI／計價單位可保留；開頭、建議、結論的一般敘述優先用自然中文）

```

### phrase-ledger 實際結果

```text
Phrase ledger scan: src/content/posts/learning/2026-10-07-interview-experience-english.md

── 模板化轉折

── 台灣中文高風險用詞

── 標題中的壓縮分類語氣

```


## 2026-10-25 最終提交檢查的正文整理

- staged process-leak gate identified the pre-existing research-to-do section. Moved its exact text to `.work/english-relationship-audit/legacy-verification-notes.md` and replaced it with a short reader-facing scope paragraph near the examples. This is a real content edit beyond the initial metadata/body-hash audit above.
- Preserved source limitations that affect use: caption/transcript reliability, mock versus actual interviews, regional scope, missing coverage and non-frequency claims where relevant. No pending expression was newly verified or promoted into the practice set.
- Added bilingual update notes; article identity/date/core teaching examples remain unchanged. The initial body hash above describes the earlier metadata-only stage, not this final body.


## 2026-10-25 待辦移出後的獨立範圍覆核

### post-verify（本輪僅驗編輯保真）

本次只讀檢查隔離出版目錄`/tmp/quidproquo-english-integrate`的中英文稿、原HEAD差異與`.work/english-relationship-audit/legacy-verification-notes.md`。本篇兩語原待辦章節均逐字完整保存於notes；未新增網頁查證、未回聽影音、未將未知用法判為已驗證。練句型而非整套面試結構、應換自己的經歷、無頻率證據仍在讀者正文；implement未找到軟體feature例句並採build的說明仍在正文。

### post-review（使用界線與雙語）

已對照本篇中英新範圍段及原有句旁／結尾限制，兩語的涵蓋範圍、來源限制與更新紀錄一致。除上述已註明的前篇描述修正外，扣除移出的待辦、新範圍段與更新紀錄，正文核心教學內容相同；20檔稽核結果見`.work/english-relationship-audit/legacy-cleanup-review-audit.log`。沒有以刪除待辦章節補上「已驗證」標籤，也沒有把原本未採用的說法加進例句或回想答案。此為讀者正文與工作待辦的分離，不是透過改檢查器放行。

本篇編輯保真與讀者界線覆核未發現阻擋問題。全站verify、staged gate、commit／push與部署由主線另驗，本覆核不代替最終提交後證據。

### post-polish（本輪新增段落）

新增範圍段為短句組成，未變成一個堆疊多層的長句；中英文含義對齊。重新跑中文register與phrase-ledger掃描：全篇既有長句4處、但書1 / 41 段（2%）、模板化轉折0處。完整輸出見`.work/english-relationship-audit/legacy-cleanup-register-review.log`；部分腳本以位元組截斷的預覽有顯示替代字元，只存在掃描log，非文章檔案損毀。長句與術語提示主要出在保留的來源例句／句型解說，沒有把既有全文掃描提示誤稱本輪新增問題。未擅改例句、引句或安全／來源邊界，未作母語者自然度或發音驗收。
