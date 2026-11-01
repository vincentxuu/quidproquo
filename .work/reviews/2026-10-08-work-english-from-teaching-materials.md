# 2026-10-08-work-english-from-teaching-materials — 系列整合範圍審稿

日期：2026-10-25。審查者：非本輪正文作者（integration reviewer）。
範圍：只核對既有中英檔的series metadata納入與既有正文結構；不冒稱重新完成全文事實查證、外部價格／研究更新或教學改寫。

## post-verify

- 本輪確認範圍：系列名稱zh「英文口說練習」／en「English Speaking Practice」，order 7，對齊unified-series.json與34篇總表。
- 逐檔和before快照比對：

| id | 日期 | lang | 正文SHA256（before=current） | 除series外metadata一致 |
|---|---|---|---|---|
| learning/2026-10-08-work-english-from-teaching-materials | 2026-10-08 | zh-TW | 133e29ac14049b0884667264e0a9b317994fc9d69f32fd2abe6b53e206acec20 | true |
| learning/2026-10-08-work-english-from-teaching-materials-en | 2026-10-08 | en | b3d093aaaec47088dfec2d2693cbad0374ced4adc8def0c050b55bf8487dac93 | true |

- slug／檔名不變；正文逐位元組hash一致，date、lang、title、tags等非series欄位一致：通過。
- 舊文的研究、價格、工具功能、英語例句與安全相關外部主張，本輪未重新查網頁／論文；原文來源與限制保持原狀。metadata整合通過不等於這些主張已重新Confirmed。

## post-review

- 系列角色：工作協作進階，從報進度轉向澄清、異議與認錯；BBC、British Council與事故文件來源各有用途，不將樣本概括為所有職場教材。
- 已逐篇讀中文與英文標題、開頭、H2和來源標籤，角色對應總表情境材料分組，均為同一系列。
- zh-TW：標題「職場英文教材沒教站立會議：請人幫忙、確認理解、委婉不同意、認錯的十九句」；H2 9節；文末外部來源連結16條；雙語互連有；series名稱與order核對通過。
- en：標題「Workplace English Materials Don't Teach Stand-ups: Nineteen Sentences for Asking for Help, Checking Understanding, Disagreeing Politely, and Owning Mistakes」；H2 9節；文末外部來源連結16條；雙語互連有；series名稱與order核對通過。
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
  70 字｜站立會議那五句（正在查問題、昨…
  68 字｜- 用「不確定」代替「不同意」：B…
  78 字｜- 先承認再轉折：British Council 有 *I…
  65 字｜同一份文件要求參與者不確定時直…
  合計 4 句

── 2. 但書密度：含轉折詞的段落佔比
  3 / 44 段（6%）

── 3. 引述區塊（正文，不含語言導覽列）
7

── 4. 數字密度：單段 4 個以上數字

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
Phrase ledger scan: src/content/posts/learning/2026-10-08-work-english-from-teaching-materials.md

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

本次只讀檢查隔離出版目錄`/tmp/quidproquo-english-integrate`的中英文稿、原HEAD差異與`.work/english-relationship-audit/legacy-verification-notes.md`。本篇兩語原待辦章節均逐字完整保存於notes；未新增網頁查證、未回聽影音、未將未知用法判為已驗證。英國機構取樣與非英美比較仍在開頭／結尾；技術詞替換被明示為情境練習而非工程團隊逐字稿；站會另連既有篇。未把staging／PR／branch搭配宣稱為新查證的職場口語。

### post-review（使用界線與雙語）

已對照本篇中英新範圍段及原有句旁／結尾限制，兩語的涵蓋範圍、來源限制與更新紀錄一致。除上述已註明的前篇描述修正外，扣除移出的待辦、新範圍段與更新紀錄，正文核心教學內容相同；20檔稽核結果見`.work/english-relationship-audit/legacy-cleanup-review-audit.log`。沒有以刪除待辦章節補上「已驗證」標籤，也沒有把原本未採用的說法加進例句或回想答案。此為讀者正文與工作待辦的分離，不是透過改檢查器放行。

本篇編輯保真與讀者界線覆核未發現阻擋問題。全站verify、staged gate、commit／push與部署由主線另驗，本覆核不代替最終提交後證據。

### post-polish（本輪新增段落）

新增範圍段為短句組成，未變成一個堆疊多層的長句；中英文含義對齊。重新跑中文register與phrase-ledger掃描：全篇既有長句4處、但書3 / 40 段（7%）、模板化轉折0處。完整輸出見`.work/english-relationship-audit/legacy-cleanup-register-review.log`；部分腳本以位元組截斷的預覽有顯示替代字元，只存在掃描log，非文章檔案損毀。長句與術語提示主要出在保留的來源例句／句型解說，沒有把既有全文掃描提示誤稱本輪新增問題。未擅改例句、引句或安全／來源邊界，未作母語者自然度或發音驗收。
