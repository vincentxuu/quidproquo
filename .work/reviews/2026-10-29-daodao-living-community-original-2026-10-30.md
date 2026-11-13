# 審稿紀錄：2026-10-29-daodao-living-community（中英兩版）

- 審稿日期：2026-10-30
- 範圍：`src/content/posts/product/2026-10-29-daodao-living-community.md`、`-en.md`
- 系列：島島阿學怎麼經營（order 1）

## post-verify

逐項回原始來源核對，結果如下。

| 主張 | 來源 | 結果 |
|---|---|---|
| McMillan & Chavis 1986 定義引文 | 文章所附 PDF | ✅ 以 `pdftotext` 讀原文，引文逐字相符（僅彎引號差異） |
| 社群感四元素：membership／influence／integration and fulfillment of needs／shared emotional connection | 同上 | ✅ 原文小節齊全 |
| 社區組織者例子（先問居民煩惱→開會→選幹部→規劃行動） | 同上 | ✅ 原文有對應段落 |
| Wenger-Trayner 定義「share a concern or a passion…」 | wenger-trayner.com 原文頁 | ✅ 逐字相符 |
| 「A website in itself is not a community of practice.」 | 同上 | ✅ 逐字相符，位於 The community 段 |
| 三要素 domain／community／practice 與 practice 的「shared repertoire」 | 同上 | ✅ |
| 作者與年份（Etienne & Beverly Wenger-Trayner, 2015） | 頁面署名 June 2015 | ✅ |
| van Mierlo 2014：63,990 人、578,349 篇、<25% 發過文、前 1% 佔 74.7% | JMIR／PMC3939180 全文 | ✅ 數字全部相符（74.7% 為 weighted average） |
| 「6 萬多名使用者**寫了** 57 萬多篇文章」 | 同上 | 🔧 原文只有 19.4% 發過文，改為「總共留下」，避免暗示 6 萬人都寫過 |
| Kraut & Fiore 2014：472,231 個新社團、三個月 57% 停止發文 | ACM 摘要（搜尋結果逐字引用） | ✅ |
| 三種容易死的社團：只有一位管理員／對所有成員都有連結／所有成員都由創辦人拉進來 | ACM 摘要片段「more likely to fail if they are the only group administrator, if they have ties to all group members…」 | 🟡 ACM PDF 回 403，未能讀全文；摘要片段與文章三點一致，保留 |
| 島島六個生態指標與定義 | `daodaoedu/daodao` `docs/product/prd/learning-ecosystem.md`（raw 讀取，L198–205） | ✅ 六項與定義相符；文件將第二項寫作「能量回流率」，文章簡稱「回流率」可接受 |
| 「資料都在既有的資料表裡」 | 同上 | 🔧 Buddy 存活率標註「火苗上線後」，尚未可量；補一句說明 |
| 「量流動、不量壓力」 | 同上 L205 | 🔧 原文為頓號，文章誤作逗號，已改 |
| 刻意不量的三項（連續打卡、學習時長、嚴格期限達成率） | 同上 L205 | ✅ |
| 開頭 500 人 LINE 群 vs 20 人讀書會 | 無外部來源 | 🟡 示例對照，文章未宣稱為實測數據，保留 |

其他檢查：`check:references` 0 error、`check:lang-parity` 0 issue、`check:tw` 0 blocking、`check:post-quality` 僅 1 個 tag 提示。

## post-review

- **結構**：場景對照 → 理論（社群感）→ 理論（共同實踐）→ 實證（參與不均）→ 實證（新社群死亡）→ 自家指標 → 檢查表 → 讀者問題。每一節只推進一步，沒有重複論證。
- **tldr**：直接給四個判準與兩個數字，沒有「不是 A 而是 B」的否定式對比，符合 writing guide。
- **表格**：三個表格都有明確工作（元素對照、指標定義、系列地圖在外篇），沒有為排版而排。
- **可執行性**：結尾四個問題＋`<details>` 判準可直接拿去用，與系列第 0 篇同構。
- **保留的 warning**：`tag metrics 沒有在標題或內文出現明顯對應詞`。中文內文用「指標」，tag 為英文主題詞，判斷不影響檢索，不改。
- **未處理**：文末「下一篇談…」指向 order 2，該篇尚未發布，屬系列進行中的正常狀態。

## post-polish

改動清單（zh 3 處、en 2 處）：

1. zh：「6 萬多名使用者寫了 57 萬多篇文章」→「總共留下」，修正與原研究的落差。
2. zh：指標表後補「Buddy 存活率要等火苗上線才量得出來，現在只有定義。」
3. zh：「量流動，不量壓力」→「量流動、不量壓力」，回到原文件寫法。
4. en：“Over 60,000 users wrote…” → “produced…”，對齊 zh 修正。
5. en：補 “Buddy survival has no data yet…only a definition.”，維持中英同義。

未改：開頭口語（「大概是這樣」）與「這代表兩件事」的清單語氣，符合本站 zh-TW 風格，不動。
