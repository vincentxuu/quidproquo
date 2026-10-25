# 查證與取得紀錄：aging-muscle-and-bone（order 17）

## 檔案

- `src/content/posts/learning/2026-10-25-aging-muscle-and-bone.md`／`-en.md`（draft: true）
- 精讀紀錄：`.work/research/human-body-basics/extractions/aging-muscle-and-bone.md`

## 來源與取得管道

| 來源 | 管道 | 結果 |
|---|---|---|
| Yan 2025（PMC12602684） | Groundlane `web_fetch` → Europe PMC `fullTextXML`，format=text，maxOutputChars=500000 | 全文，77,168 字元，`truncated:false` |
| Ran 2025（PMC12590801） | 同上 | 全文，73,244 字元 |
| Shur 2021（PMC8140403） | 同上，`extract=full` | 全文，55,524 字元 |
| Mohebbi 2023（PMC10282053） | 同上，`extract=full`（預設 `extract=article` 只回表格片段） | 全文，95,534 字元 |
| Lu 2026（PMID 42716561） | Europe PMC REST search（`EXT_ID:42716561 AND SRC:MED`，core） | 只有中繼資料與摘要；isOpenAccess=N、inEPMC=N、fullTextUrl 為「Subscription required」。**未嘗試**繞過付費牆的方式 |
| WHO 2020 | 沿用既有精讀紀錄 | 未重讀全文 |
| 書目核對 | Europe PMC `EXT_ID` OR 查詢（5 筆） | PMID、PMCID、DOI、期刊、年份皆與文章一致 |

未嘗試：Haynes 2020（成年肌力下降曲線，非 OA）；Sherrington 2019 Cochrane（跌倒，屬 order 12 範圍）；Swarnalatha、Tiedemann 等非 OA 來源；PubMed 篩選頁。

## 文章裡不在來源逐字內的說法（我的轉述或解讀）

1. 「敘事回顧……我讀到的內文沒有搜尋方法的說明」：我對 Shur 全文搜尋 search strategy、PubMed、Medline、literature search、narrative 等字樣皆無命中，所以只寫「我讀到的內文沒有說明」。「證據層級比統合分析低」是一般的證據層級常識，非來源陳述。
2. 「統計上顯著只表示不太像是巧合」：統計常識的白話，非來源逐字。
3. 「這些都是跨試驗的比較，不是同一批人被隨機分到不同次數」：子群分析與 meta-regression 的設計性質，是我的說明，不是 Yan／Ran 的原話。
4. 「我沒有逐項比對評級不同的原因」「兩篇可能納入同一批試驗，我沒有比對」：誠實揭露，非來源陳述。
5. Mohebbi 作者「沒有發現差異不等於證明沒有」：我的補充；來源只寫無顯著差異（p > .09）。
6. 「Shur 引用的小型橫斷式研究」：原文 40 位高水準資深運動員（40–81 歲）；「小型」是我描述人數。
7. 「日常活動比較有關連：步行速度、坐站測驗貼近走路、起身」：我的類比，不是來源陳述。
8. 「這篇的結果指標沒有（跌倒發生率與生活品質）」：依 Yan 的結果指標列表（握力、步速、ASMI、膝伸肌力、TUG、ASM、5STS、SPPB）與其「未來研究應納入」之語推得；Ran 的指標為握力、SMI、SPPB。
9. 文章把 Yan 的 TUG 與五次坐站稱為「起身繞行測驗」「五次坐站測驗」，是我的中文譯名（兩者在台灣的慣用譯名未查）。
10. 「Yan 自己的 24 項試驗中，只有 8 項偏差風險低」：來源 8 項低、12 項不明、4 項偏高。

## 刻意不寫的內容

- Yan／Ran 的劑量反應數字（MET-min／週、每週次數的結論、中等強度建議），以及 Ran 的 "twice weekly, moderate-intensity" 建議：老年篇不給目標數字、不給處方。
- 蛋白質、肌酸、乳清等營養內容（Ran 討論段有提到）：使用者要求不給補充劑建議。
- WHO 對老年人的具體週頻建議（"3 or more days"）：同樣屬目標數字，只放「高確定性」的證據陳述並請讀者看原文。
- OpenStax §10.6「肌少症不可逆」：與回顧衝突、依指示不沿用，也不拿來當對照。
- Lu 2026 的 OR、CrI、劑量（約 600 MET-min/週）等數字。
- Yan 的 Bayesian 劑量反應曲線細節、Ran 的 SPPB 敏感度分析。

## 未解決

1. 「肌少症」中文與英文縮寫（TUG、5STS、SPPB、ASMI）：文章中文版對 TUG 與 SPPB 用英文縮寫並簡短說明，台灣臨床慣用譯名（例如「計時起走測試」「簡易體能量表」）我沒有查證，請主代理或後續審稿決定要不要統一。
2. Ran 與 Yan 是否納入同一批試驗：未比對。
3. Lu 2026 全文若日後可取得，應補查：單純阻力訓練的估計、各運動型態的完整區間、作者列的限制。
4. 骨的「老化機制」缺可讀來源（Lu 2026 非 OA）；反證搜尋仍缺（沒找到結論相反的肌少症或骨運動回顧，僅限我查的 Europe PMC 標題關鍵字搜尋，且大多沿用 scan/D-joints-aging.md 的候選，未另做新搜尋）。
5. 文章長度（約 4,800 字元，含參考資料；正文約 3,900）超過樣板（約 3,400–3,600）；因為涵蓋六個來源與各自的限制，我保留。如需縮短，可考慮刪掉「兩篇對證據品質的看法不同」中的頻率段。
6. 連結到 `2026-10-25-balance-and-fall-prevention`（order 12）：該檔在寫作時已存在，我沒有讀其內容；連結文字只寫標題，未承諾內容。

## 自動檢查結果（從 repo 根目錄執行）

check-tw-terms（0 blocking）、check-process-leak（無輸出、rc=0）、check-post-references（OK）、check-post-quality（OK）、check-lang-parity（OK）。

## 審稿後更正（2026-10-25）

依三份審稿報告（`review-reports/`）修改，中英同步：

- 標題、description、tldr 加入骨的降級（只讀停經後女性統合分析與 Lu 摘要、結果是骨密度不是骨折、老化的骨沒有可用來源）。
- 骨的段落內加骨質疏鬆／骨折史就醫提醒。原審稿建議寫「來源沒有分析這群人」，我回查 Mohebbi 發現它其實有骨狀態（osteopenia／osteoporosis vs 正常）子群，所以**不寫**那句，只寫「請先問醫師」。
- WHO 句加「65 歲以上」，並補「對一般老年人；有慢性病者 WHO 說缺直接證據」（出處：`who-2020-physical-activity-guidelines.md` 限制 1）；標明 Yan 為 60 歲以上。
- SPPB：改寫成兩篇不同（Yan 無顯著差異、3 項試驗；Ran SMD 0.56）；並在 Yan 第二句引文後註明原文自身不一致（結果段 SPPB 無顯著差異，結論句卻把它列入）。
- 試驗重疊：以兩篇全文比對作者與年份，Vasconcelos 2016、Rufino 2023 兩篇都出現（Yan 在不良事件段引用，Ran 列入分析）。文章寫「至少部分試驗重疊」，並註明未核對補充材料。
- Yan 的「≤26 週」移到限制節，寫成限制劑量反應結果的推廣，不再放在肌肉量那句後面像是解釋原因。
- Shur 不再稱「敘事回顧」，改「回顧論文」並保留「我讀到的內文沒有搜尋方法說明」。
- Lu：zh 區分「很可能」(probably) 與「也許」(may)。
- 刪掉每週 3 次 vs 2 次的整段（原審稿與我的未解決第 5 點都建議砍），連同相關限制；加入 bones-and-joints 連結與「飲食與補充問醫師或營養師」。
- 語感：L47 長句拆開；姓名當主詞改「第一篇／第二篇」；同段「作者說」合併；否定對比改正面；偏差風險、統合分析、確定性加白話；「合併分析」統一為「統合分析」；網路統合分析改稱統合分析。
- 長度：正文（不含參考資料）約 3,570 字元，含參考資料約 4,750；原約 4,810。因為補了必修內容，縮幅只有一點。

仍未解決：
1. TUG／5STS／SPPB 台灣譯名未查。
2. Lu 2026 全文未讀。
3. 動作 2 的 "Eligibility criteria" 確認為 Yan 方法段的小標題（已在全文檢索到 "Eligibility criteria"）。動作 1 的兩句引文確認都在摘要 Conclusion。
4. 未採用：「台灣讀者位置」（全球通用生理證據，不硬塞）；「帶長輩看醫師可問什麼」（超出範圍）；L114 結尾補判斷句（不加判斷以免過度承諾）。
5. 跨篇：order 12 的 tldr「60 歲以上」只對 Cochrane 成立，且該篇的 WHO 句也需註明 65 歲以上、列出 WHO 週頻數字的風險；規劃表 order 17 來源狀態建議補成「Yan、Ran、Shur、Mohebbi ✅；Lu 2026 非開放（只讀摘要）；缺反證」。請主代理處理。
