# 歸因但書修正：2026-10-14-forums-comments-community-learning（中英）

依據：writing-guide「但書與歸因不堆疊」；檢查器 `scripts/check-process-leak.mjs` 的 HEDGE_PATTERNS（上限 3）。

## 計數

| 檔案 | 修改前 | 修改後 |
|---|---|---|
| zh（`...learning.md`） | 12 | 3（「以下是我的判斷」一句被兩條 pattern 各算一次＝2，加上限制節「**我的推論**：」＝1） |
| en（`...learning-en.md`） | 6 | 0 |

修改後全篇「作者判斷」的標示句實際剩 3 處（中英對應）：

1. 「為什麼不能讀成…／讀而不發」節的「我預期…」（L111）
2. 「可以做的事」節首「以下是我的判斷／These are my judgments」（L245，未改）
3. 「這些證據的限制」節「我的推論／My inferences」清單（L269，未改，集中列出全部推論）

## 逐處修改（中英各 8 處，行號為修改前）

| # | 行 | 原句（zh） | 新句（zh） | 英文對應 | 修法 | 理由 |
|---|---|---|---|---|---|---|
| 1 | 33 | 「…動的是發文，不是成績。把它們套到本站讀者，是我的推論。」 | 「…動的是發文，不是成績。」 | 刪 "Applying this to this site's readers is my inference." | 1 刪 | 「能借的是方向」本身就是作者判斷語氣（節名也是「能借多少」）；「借用都是推論」已在限制節第一條與「我的推論」清單第一項集中寫一次。 |
| 2 | 111 | 「這和本站最相關：一篇有留言區的文章，多數讀者也只會讀留言，不會留言，這是我的推論。」 | 「這和本站最相關：我預期一篇有留言區的文章，多數讀者也只會讀留言，不會留言。」 | "…most readers would also read the comments without commenting. That is my inference." → "I expect that on an article with a comment section, most readers would…" | 3 作者主張 | 刪標籤後句子會像研究發現（接在 Gillani 的數字後面），所以改成「我」當主詞的主張，句尾不再補標籤。 |
| 3 | 208 | 「這兩種做法對讀者學習的差別，沒有研究測過；把 Stack Overflow 的趨勢連到這個選擇，是我的推論。」 | 「這兩種做法對讀者學習的差別，沒有研究測過。」 | 刪 "; connecting the Stack Overflow trend to this choice is my inference" | 1 刪 | 同段已寫「量的是發文量，不是學習」「差別沒有研究測過」，讀者不會把連結讀成研究結論；推論已列在限制節清單（AI 問答和公開問答的差別）。 |
| 4 | 238（表格） | 「本站的選擇。觸及率的論點是我的推論；該為哪些詞加定義…」 | 「本站的選擇。觸及率的論點沒有研究直接測過；該為哪些詞加定義…」 | "The reach argument is my inference;" → "No study has directly tested the reach argument;" | 2 縮回證據範圍 | 中間欄「放在文章裡的協助是每個讀者都碰得到的地方」是作者論點，必須保留區隔；改寫成證據狀態（沒有研究測過），不加歸因標籤，欄名「是依據，還是本站的選擇」已表明立場。 |
| 5 | 247 | 「這些是 MOOC 的結果，套到文章是我的推論。做法：…」 | 「這些是 MOOC 的結果。做法：…」 | "These are MOOC results; applying them to articles is my inference." → "These are MOOC results." | 3（節首立場涵蓋）＋2 | 節首「以下是我的判斷」已涵蓋本節每條；保留「這些是 MOOC 的結果」這個會影響解讀的事實，去掉重複的標籤。 |
| 6 | 249 | 「依據：看討論串的人數是發文人數的三倍以上（Gillani），但讀者大部分只讀正文是我的推論；問答留在討論串裡…」 | 「依據：看討論串的人數是發文人數的三倍以上（Gillani）；問答留在討論串裡…」 | 刪 ", though *most readers read only the body* is my inference" | 1 刪（節首立場涵蓋） | 「依據」只留來源結果；該前提不寫進「依據」以免讀成 Gillani 的結論。整條做法屬節首「以下是我的判斷」，推論已列在限制節清單（問答搬回正文能讓更多人看到）。 |
| 7 | 278（附錄） | 「（完整版 548、基本版 553，後面的檢定用 546 與 555，原文沒解釋差額）」 | 「（完整版 548、基本版 553，後面的檢定用 546 與 555）」 | 刪 ", with the difference unexplained" | 1 刪 | 兩組數字並列已讓讀者看到差額；「原文沒解釋」不影響解讀。數字未動。 |
| 8 | 282（附錄） | 「職涯進展者 168 人（153 + 35 = 188，原文沒說明重疊）」 | 「職涯進展者 168 人（153 + 35 = 188）」 | 刪 ", overlap unexplained" | 1 刪 | 算式已顯示與 168 不符；數字未動。 |

## 沒動的地方

- 「以下是我的判斷，每一條寫出依據是哪幾項結果。」（L245）：節首立場句，照規則保留一次。檢查器把它算 2 次（pattern 1「我的判斷」＋pattern 2「以下是我的判斷」），沒有為了少算一次而改字。
- 「**我的推論**：…正文都標了或在這裡列出。」（L269）：集中列出的地方，保留。修改後正文標示變少，但「或在這裡列出」仍成立，所以沒改這句。
- 「我算的」「我從表整理」「我從原文的人數算的」「兩個比值是我算的」：計算來源說明，檢查器沒算，照指示保留。
- L146「這是我從表整理的，回顧作者沒有這樣歸納。」：防止作者的計票讀成 Davis 回顧的結論，屬紅線所需的區隔，檢查器也沒算，保留。
- 「原研究我沒讀／原研究我沒有讀」（L44 表格、L141、L168）：轉引說明，檢查器沒算；與限制節「轉引」條有重複，但不在這次指定範圍，沒動。
- L20 的 diff 是工作區既有修改，不是這次改的。

## 驗證

- `node scripts/check-process-leak.mjs <zh> <en>`：通過（zh 3、en 0）。
- `node scripts/check-tw-terms.mjs <zh>`：0 blocking，0 to review。
- `node scripts/check-post-quality.mjs <zh> <en>`：無 blocking；zh 有一個既有 WARN（tag `blog` 對應詞），與本次修改無關。
- `node scripts/check-lang-parity.mjs`：OK。
