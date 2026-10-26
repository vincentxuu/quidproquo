# 2026-10-07-work-standup-english — 系列整合範圍審稿

日期：2026-10-25。審查者：非本輪正文作者（integration reviewer）。
範圍：只核對既有中英檔的series metadata納入與既有正文結構；不冒稱重新完成全文事實查證、外部價格／研究更新或教學改寫。

## post-verify

- 本輪確認範圍：系列名稱zh「英文口說練習」／en「English Speaking Practice」，order 6，對齊unified-series.json與34篇總表。
- 逐檔和before快照比對：

| id | 日期 | lang | 正文SHA256（before=current） | 除series外metadata一致 |
|---|---|---|---|---|
| learning/2026-10-07-work-standup-english | 2026-10-07 | zh-TW | bd5300d5e7498aafcaecfb97cbdf2b9e06371c7badcb76fd42e0d737d08a3b9f | true |
| learning/2026-10-07-work-standup-english-en | 2026-10-07 | en | d6a39726522bb9a8eee2c1e63273242cc458cad8b80b97528238690b2f8417db | true |

- slug／檔名不變；正文逐位元組hash一致，date、lang、title、tags等非series欄位一致：通過。
- 舊文的研究、價格、工具功能、英語例句與安全相關外部主張，本輪未重新查網頁／論文；原文來源與限制保持原狀。metadata整合通過不等於這些主張已重新Confirmed。

## post-review

- 系列角色：工作基本情境，已完成、等待、卡點、求助與估時；字典支持句型，自編工作場景不稱真實原對話。
- 已逐篇讀中文與英文標題、開頭、H2和來源標籤，角色對應總表情境材料分組，均為同一系列。
- zh-TW：標題「用英文報告進度、說自己卡住、請同事幫忙：工作上的十句話」；H2 8節；文末外部來源連結18條；雙語互連有；series名稱與order核對通過。
- en：標題「Reporting Progress, Saying You're Stuck, and Asking for Help: Ten Sentences for Work」；H2 8節；文末外部來源連結18條；雙語互連有；series名稱與order核對通過。
- 內部文章連結存在性：兩語所有/posts目標檔存在。
- 機械驗證範圍：本報告執行本篇metadata／body hash／檔案連結比對與下列兩個只讀掃描；未跑full verify、外部連結HTTP或UI操作，不據此宣稱全站品質、全文教學或部署驗收。

## post-polish

- 正文未改；依post-polish預設僅標示，不擅改舊文。
- 中文register-scan exit=0；phrase-ledger exit=0。下方是實際輸出，命中是待人工判讀提示，不包裝成零問題。英文練習句、教材引文與精確技術名詞屬保護片段；來源／正文未因掃描刪改。
- 本次不進行全文潤稿；若掃描有長句、引述、數字密度或模板句型，視為既有稿件的後續潤稿線索，不能用metadata任務清除。

### register-scan 實際結果

```text
正文段落數：38

── 1. 長句（氣口）：兩個句號之間超過 60 字
  64 字｜Atlassian 介紹站立會議時列的三個�…
  66 字｜**walk someone through**：Cambridge 的定�…
  合計 2 句

── 2. 但書密度：含轉折詞的段落佔比
  0 / 38 段（0%）

── 3. 引述區塊（正文，不含語言導覽列）
6

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
  13:**reproduce**：Oxford 字典的 reproduce 只收「複製」這類意思，沒有軟體問題的用法。這個用法的依據來自 Mozilla 的錯誤回報指引，裡面寫 *steps to reproduce a bug*、*If you can't reproduce the problem*（Bug Writing Guidelines）。*locally* 指在自己的機器上，GitHub 文件的標題就是 *Checking out pull requests locally*（GitHub Docs）。這兩個是技術文件，支持的是術語，不是口語的常見程度。
  合計 1 次
  （品牌、API 欄位、官方 UI／計價單位可保留；開頭、建議、結論的一般敘述優先用自然中文）

```

### phrase-ledger 實際結果

```text
Phrase ledger scan: src/content/posts/learning/2026-10-07-work-standup-english.md

── 模板化轉折

── 台灣中文高風險用詞

── 標題中的壓縮分類語氣

```
