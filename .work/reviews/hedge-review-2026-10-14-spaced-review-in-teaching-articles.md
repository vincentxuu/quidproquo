# 獨立審稿：歸因但書修正（2026-10-14-spaced-review-in-teaching-articles，中英）

審稿依據：writing-guide「但書與歸因不堆疊」整節；寫稿者清單 `.work/reviews/hedge-fix-2026-10-14-spaced-review-in-teaching-articles.md`；`git diff`（開頭 Cloudflare 造訪定義那一處是更早的修正，不在本次範圍）；抽取紀錄 `.research/extractions/articles-that-teach/`（lindsey2014、settles2016、matuschak-nd-working-notes、matuschak2019-ttft）。

## 結論：不通過（2 項必須修，中英都要改）

檢查器全綠：
- `node scripts/check-process-leak.mjs <中> <英>` → exit 0，沒有輸出
- `node scripts/check-tw-terms.mjs <中>` → 0 blocking, 0 to review
- `node scripts/check-lang-parity.mjs` → OK，2810 對

標籤數量確實降下來了，也沒有換句話說繞過檢查器（第 4 點通過）。問題出在兩處：標籤刪掉或改寫之後，本站自己的判讀被說成來源的說法（紅線，第 1、2 點）。

## 必須修

### 1. L91（中、英）：刪掉「作者沒有提」以後，下一句的「另外」把重疊說成作者講的

- 現況（中）：「延後組前後兩個數字的信賴區間（作者給的是 91 ± 4% 與 87 ± 5%）互相重疊。**作者另外說**，延後組這段期間仍在複習其他卡…」
- 現況（英）：「…(given by the authors as 91 ± 4% and 87 ± 5%) overlap. **The authors also say** that the delayed group…」
- 問題：舊版寫明重疊是本站對照數字看出來的，作者沒有提。現在緊接著寫「作者另外說／The authors also say」，讀者會以為「信賴區間重疊」也是作者說的。這是紅線（第 1 點），也改變了來源歸屬（第 2 點）。
- 改法：拿掉「另外／also」就好，不用把標籤加回來。
  - 中：「…互相重疊。作者說，延後組這段期間仍在複習其他卡…」
  - 英：「…overlap. The authors say that the delayed group kept reviewing…」
  - 另一種寫法是把重疊那句移到作者那句後面，讓它單獨成句：「…幾乎一定拉高了他們最後的表現。延後組前後兩個數字的信賴區間（91 ± 4% 與 87 ± 5%）互相重疊。」

### 2. L167（中、英）新的節首句把歸屬說得比內容強，L41 結論表同步

- 現況（中）：「除了『證據本身還不夠』是我從上面各節的資料推的，其餘各類的原因都出自做的人自己」
- 現況（英）：「Except for "The evidence itself is not there yet," … every reason comes from the builders themselves」
- 問題（第 2、6 點）：舊句是「做的人自己的說法，**或**我從上面的資料推的」，範圍比較寬。新句說其餘五類**都**出自做的人，但核對內文與抽取紀錄後不成立：
  - **「需要帳號、寄信與排程系統」（L179）**：Matuschak 自列的障礙（`matuschak-nd-working-notes.md` L196，N1 L65–91「Challenges」）沒有「帳號、寄信、伺服器」這一條。Quantum Country 要建帳號、Lindsey 要伺服器，這些是事實；把它們當成沒有普及的原因，是本站的歸納。這一類只有最後一句「上手需要累積夠多的內容」是 Matuschak 寫的。
  - **「讀者覺得像作業」（L177 句尾）**：「Execute Program 的新使用者抱怨與 Hacker News 上的反對，是同一類反應」。HN 上的回覆者不是做的人，把兩者歸成同一類是本站做的。
  - **「讀者要養成固定回來的習慣」（L173）**：「資料上的對應是 Davis 的實驗」，這個對應也是本站做的。
- 這一處把節首立場句改得更精確了，卻因此改錯了來源歸屬。讀者會以為「需要帳號與排程系統」是做的人自己列的原因。
- 改法（只講一次，不逐條補標籤）：
  - 中：「下面是我把各來源的說法歸納成的六類。『需要帳號、寄信與排程系統』和『證據本身還不夠』主要是我從上面各節的資料推的；其餘各類引的是做的人自己的說法，各類之間的對應是我做的。沒有研究直接比較過採用與不採用的原因。」
  - 英：「Below, I group the sources' accounts into six categories. "It needs accounts, emails, and a scheduling system" and "The evidence itself is not there yet" are mainly my inferences from the sections above; the other categories quote the builders themselves, and the links between them are mine. No study has directly compared why people do or don't adopt this.」
  - 也可以退回舊版那種比較寬的說法（「做的人自己的說法，或我從上面的資料推的」），只要別再寫「都出自做的人」。
- 同時修 **L41 結論表**（舊句，不是這次改的，但 L167 一改，兩處就會互相矛盾）：中「做的人自己列的原因：…、需要帳號與排程系統｜沒有研究直接檢驗過；都是做的人的說法」，英「Reasons the builders themselves list: … and it needs accounts and a scheduling system｜… these are the builders' own accounts」。改法：把「需要帳號與排程系統」從「做的人自己列的」裡拿出來，例如中「做的人自己列的原因：讀者要養成回來的習慣、好題目難寫、讀者覺得像作業；另外還需要帳號與排程系統」，性質欄改成「沒有研究直接檢驗過；多為做的人的說法」。英文照改。

## 逐項檢查結果（清單 13 處＋其他）

| # | 位置 | 結果 | 說明 |
|---|---|---|---|
| 1 | L81 195 人沒有分母 | 通過 | L237 限制節「沒有交代總共多少人讀過或建了帳號」與附錄「沒有分母」都有交代（第 3 點） |
| 2 | L85 分組方式 | 通過 | L33 結論表與 L238 限制節都有 |
| 3 | L91 信賴區間重疊 | **不通過** | 見必須修 1 |
| 4 | L117 Davis「依我看」 | 通過 | 修法 3，主詞清楚，不會讀成 Davis 的結論；作者自己的歸因（樣本小、遵從率低）仍寫在前一句 |
| 5 | L127 Lindsey 百分比 | 通過 | 拿掉「相對」讓說法變弱，沒有變強；括號用判斷語氣（「較像」）。抽取紀錄 L36 支持「依圖看是相對增幅」，也說過可以「直接不換算」。「原文沒有說」移到 L241 |
| 6 | L144 Duolingo 百分比 | 通過 | 併進 L241。抽取紀錄 settles2016 L105、L117 也確認原文沒有說 |
| 7 | L167 節首 | **不通過** | 見必須修 2 |
| 8 | L181 句尾 | 通過，但要等必須修 2 改完才成立 | 節首交代過了 |
| 9 | L204 表格 | 通過 | 「和正文在同一次閱讀裡作答，沒有隔一段時間」講的是本站自己的做法，不會被讀成某個來源的結論；L244 總表也有列 |
| 10 | L235 搬到文章是推論 | 通過 | 移到 L244 總表。限制節仍然看得出所有資料都來自別的情境（另見 L24「下面的資料全部來自別的情境」） |
| 11 | L240 Davis 檢定力 | 通過 | L117 與 L244 都有 |
| 12 | L241 百分比定義合併 | 通過 | 和兩份抽取紀錄一致，沒有改變結論強度 |
| 13 | L244 總表 | 通過 | 刪掉「正文都當場標了」是對的，因為現在正文不再逐處標 |
| — | 數字、引文 | 通過 | diff 裡沒有任何數字或引文被改（第 2 點） |
| — | 繞過檢查器 | 通過 | 正文剩下的判斷語氣只有 L117「依我看」、L127 括號、L167、L213 節首，沒有逐句換說法（第 4 點） |
| — | 中英一致 | 通過 | 13 處中英同步；必須修 1、2 的問題中英都有，要一起改（第 5 點） |
| — | L213「可以做的事」節首 | 通過 | 涵蓋 1–5 條（第 6 點） |

## 建議修（不擋）

- L37 結論表寫「依圖判讀**是**相對比例」，L127 寫「**較像**相對比例」，把握程度不一致，建議都用「較像」（英文 L37「read from the figure as a relative difference」同理）。
- L204 這一列的中間欄標題是「相關的證據」，但內容是本站做法的描述。可以改成指回 L58（「讀到那裡當場答…不算間隔複習」），讓這一列有依據可對。
- L244 總表可以補一項「把帳號、寄信與排程系統列為採用障礙」，和必須修 2 的改法對齊。
- Duolingo 段（L141–142）沒有報基準回訪率與各組人數（settles2016 抽取紀錄 L105）。這是原本就有的缺漏，不是這次造成的；要補的話放 L240 或 L241 寫一句就好。

## 必須修確認

**結論：通過**

- 必須修 1（zh/en L91）：「另外／also」已拿掉，現在是「…互相重疊。作者說，延後組這段期間仍在複習其他卡…」／"…overlap. The authors say that the delayed group…"。重疊不會再被讀成作者說的。數字（91 ± 4%、87 ± 5%）沒有動。✅
- 必須修 2（zh/en L167）：已改成建議寫法：「需要帳號、寄信與排程系統」和「證據本身還不夠」主要是我從上面各節的資料推的；其餘各類引的是做的人自己的說法，各類之間的對應是我做的。英文同義（"…are mainly my inference…, and the mapping between categories is mine"）。不再寫「都出自做的人」。✅
- L41 結論表連動：zh「做的人自己列的原因：讀者要養成回來的習慣、好題目難寫、讀者覺得像作業；另外需要帳號與排程系統｜沒有研究直接檢驗過；多為做的人的說法」，en 同步（"…; it also needs accounts and a scheduling system｜…mostly the builders' own accounts"）。和 L167 不再矛盾。✅
- L244 總表也補了「把各來源的採用障礙歸納成六類」，和 L167 對齊（採用了建議修第 3 點）。
- 沒有引入新錯；L167 en 的 "my inference" 讓 hedge 計數加 1，檢查器仍然 rc=0。
- 檢查器（本輪，10 檔一起跑）：`node scripts/check-process-leak.mjs <10 檔>` → rc=0，無輸出；`node scripts/check-tw-terms.mjs <10 檔>` → 0 blocking, 0 to review。
