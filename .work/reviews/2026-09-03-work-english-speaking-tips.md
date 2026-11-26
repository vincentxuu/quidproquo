# 2026-09-03-work-english-speaking-tips — 系列整合範圍審稿

日期：2026-10-25。審查者：非本輪正文作者（integration reviewer）。
範圍：只核對既有中英檔的series metadata納入與既有正文結構；不冒稱重新完成全文事實查證、外部價格／研究更新或教學改寫。

## post-verify

- 本輪確認範圍：系列名稱zh「英文口說練習」／en「English Speaking Practice」，order 1，對齊unified-series.json與34篇總表。
- 逐檔和before快照比對：

| id | 日期 | lang | 正文SHA256（before=current） | 除series外metadata一致 |
|---|---|---|---|---|
| learning/2026-09-03-work-english-speaking-tips | 2026-09-03 | zh-TW | b81fa09543b6fd3e8df2cd59b1e17a2f638acb463188003f91a6c12181e46c58 | true |
| learning/2026-09-03-work-english-speaking-tips-en | 2026-09-03 | en | 23184245be2c2fe93723d1408497e0caadba7db3a2277698fd1892d4acfec990 | true |

- slug／檔名不變；正文逐位元組hash一致，date、lang、title、tags等非series欄位一致：通過。
- 舊文的研究、價格、工具功能、英語例句與安全相關外部主張，本輪未重新查網頁／論文；原文來源與限制保持原狀。metadata整合通過不等於這些主張已重新Confirmed。

## post-review

- 系列角色：方法總論，從工作開口卡點進到練法與日程，接order 2校準證據。既有開頭的固定週數與較強成效措辭仍是歷史正文；本次不重新背書，需全文更新時另處理。
- 已逐篇讀中文與英文標題、開頭、H2和來源標籤，角色對應總表方法／原音分組，均為同一系列。
- zh-TW：標題「上班族英文口說怎麼練：跟讀、情境模擬、AI App 與職場句型」；H2 7節；文末外部來源連結6條；雙語互連有；series名稱與order核對通過。
- en：標題「How to Practice Workplace English Speaking: Shadowing, Scenario Drills, AI Apps, and Meeting Phrases」；H2 7節；文末外部來源連結6條；雙語互連有；series名稱與order核對通過。
- 內部文章連結存在性：兩語所有/posts目標檔存在。
- 機械驗證範圍：本報告執行本篇metadata／body hash／檔案連結比對與下列兩個只讀掃描；未跑full verify、外部連結HTTP或UI操作，不據此宣稱全站品質、全文教學或部署驗收。

## post-polish

- 正文未改；依post-polish預設僅標示，不擅改舊文。
- 中文register-scan exit=0；phrase-ledger exit=0。下方是實際輸出，命中是待人工判讀提示，不包裝成零問題。英文練習句、教材引文與精確技術名詞屬保護片段；來源／正文未因掃描刪改。
- 本次不進行全文潤稿；若掃描有長句、引述、數字密度或模板句型，視為既有稿件的後續潤稿線索，不能用metadata任務清除。

### register-scan 實際結果

```text
正文段落數：52

── 1. 長句（氣口）：兩個句號之間超過 60 字
  78 字｜多數台灣上班族的英文能力分布很…
  69 字｜這篇整理了 6 篇來自 PTT、Preply、Vo…
  70 字｜這個方法的出處是台大外文系史嘉…
  63 字｜**今晚就能做的事**：選一個你下�…
  75 字｜**怎麼選？** 如果你只想裝一個 App…
  64 字｜AI 的優勢是不限次數、零社交壓力…
  72 字｜PTT 那位在美博士生直接說：「學�…
  合計 7 句

── 2. 但書密度：含轉折詞的段落佔比
  6 / 52 段（11%）

── 3. 引述區塊（正文，不含語言導覽列）
0
  0

── 4. 數字密度：單段 4 個以上數字

── 5. 研究者姓名當段落主詞
0
  0

── 6. 建議讀者做的事，有沒有配具體動作
  「怎麼做」段落數：0
  （人工核對：每個判 ✅／建議照做的項目都該有一段）

── 7. 模板化轉折句型（同篇反覆會有 AI 感）
  19:重點不是時段，而是**固定節奏**。選一個你能持續的時間就好，比硬擠出一個不穩定的長時段有效。
  合計 1 處

── 8. 一般英文術語密度（中文散文，人工判讀）
  合計 0 次
  （品牌、API 欄位、官方 UI／計價單位可保留；開頭、建議、結論的一般敘述優先用自然中文）

```

### phrase-ledger 實際結果

```text
Phrase ledger scan: src/content/posts/learning/2026-09-03-work-english-speaking-tips.md

── 模板化轉折
  19:重點不是時段，而是**固定節奏**。選一個你能持續的時間就好，比硬擠出一個不穩定的長時段有效。

── 台灣中文高風險用詞

── 標題中的壓縮分類語氣

```
