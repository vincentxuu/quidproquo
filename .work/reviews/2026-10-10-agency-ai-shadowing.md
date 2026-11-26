# 2026-10-10-agency-ai-shadowing — 系列整合範圍審稿

日期：2026-10-25。審查者：非本輪正文作者（integration reviewer）。
範圍：只核對既有中英檔的series metadata納入與既有正文結構；不冒稱重新完成全文事實查證、外部價格／研究更新或教學改寫。

## post-verify

- 本輪確認範圍：系列名稱zh「英文口說練習」／en「English Speaking Practice」，order 3，對齊unified-series.json與34篇總表。
- 逐檔和before快照比對：

| id | 日期 | lang | 正文SHA256（before=current） | 除series外metadata一致 |
|---|---|---|---|---|
| learning/2026-10-10-agency-ai-shadowing | 2026-10-10 | zh-TW | 44443a79e21a9f9495674bca0bdde95ce49c47ec3de5d95a795fe8d8827c1c72 | true |
| learning/2026-10-10-agency-ai-shadowing-en | 2026-10-10 | en | b27deb7036bed9a520acadfdb750d69577fc37e0ff15dc703055e674ae6fec11 | true |

- slug／檔名不變；正文逐位元組hash一致，date、lang、title、tags等非series欄位一致：通過。
- 舊文的研究、價格、工具功能、英語例句與安全相關外部主張，本輪未重新查網頁／論文；原文來源與限制保持原狀。metadata整合通過不等於這些主張已重新Confirmed。

## post-review

- 系列角色：原音理解與運用示例。開頭、H2與來源保留原站字幕入口、頁內完整逐字稿缺口、改寫提示和自寫練習句的區別。
- 已逐篇讀中文與英文標題、開頭、H2和來源標籤，角色對應總表方法／原音分組，均為同一系列。
- zh-TW：標題「AI 幫你跨過技能門檻之後：讀懂 agency，也練習用英文說出自己的行動」；H2 10節；文末外部來源連結7條；雙語互連有；series名稱與order核對通過。
- en：標題「After AI lowers the skill barrier: understanding agency and practicing how to talk about taking action」；H2 10節；文末外部來源連結7條；雙語互連有；series名稱與order核對通過。
- 內部文章連結存在性：兩語所有/posts目標檔存在。
- 機械驗證範圍：本報告執行本篇metadata／body hash／檔案連結比對與下列兩個只讀掃描；未跑full verify、外部連結HTTP或UI操作，不據此宣稱全站品質、全文教學或部署驗收。

## post-polish

- 正文未改；依post-polish預設僅標示，不擅改舊文。
- 中文register-scan exit=0；phrase-ledger exit=0。下方是實際輸出，命中是待人工判讀提示，不包裝成零問題。英文練習句、教材引文與精確技術名詞屬保護片段；來源／正文未因掃描刪改。
- 本次不進行全文潤稿；若掃描有長句、引述、數字密度或模板句型，視為既有稿件的後續潤稿線索，不能用metadata任務清除。

### register-scan 實際結果

```text
正文段落數：46

── 1. 長句（氣口）：兩個句號之間超過 60 字
  61 字｜想一行一行看整段文字，請開啟各…
  83 字｜**English comprehension key:** Access to skil…
  78 字｜**English comprehension key:** Follow the dis…
  61 字｜**English comprehension key:** Hear the defin…
  合計 4 句

── 2. 但書密度：含轉折詞的段落佔比
  1 / 46 段（2%）

── 3. 引述區塊（正文，不含語言導覽列）
1

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
Phrase ledger scan: src/content/posts/learning/2026-10-10-agency-ai-shadowing.md

── 模板化轉折

── 台灣中文高風險用詞

── 標題中的壓縮分類語氣

```
