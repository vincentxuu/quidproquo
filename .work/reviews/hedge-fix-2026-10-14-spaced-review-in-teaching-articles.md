# 歸因但書修正：2026-10-14-spaced-review-in-teaching-articles（中英）

規則：writing-guide「但書與歸因不堆疊」。檢查器：`scripts/check-process-leak.mjs` HEDGE_PATTERNS。

## 計數

| 檔 | 修改前 | 修改後 |
|---|---|---|
| 中文 | 11（81、85、117、127、144、204×2、235、240、241、244） | 1（244 限制節的「我的推論與判斷」總表） |
| 英文 | 6（117、127、181、204、235、240） | 1（167 節首「my inference」） |

另外改了檢查器沒算到、但屬於同一類的標籤：中文 91「這是我對照數字看到的」、127「這是我的判讀」、167「或我從上面的資料推的」、181「這一點是我從上面各節的資料推的」；英文 81、85、91、144、167、241、244 的對應句。

修改後，正文裡標示作者判斷的地方：(1) Davis 檢定力（「依我看」）、(2)「為什麼沒有變成普遍做法」節首、(3)「可以做的事」節首（原本就有，沒動）、(4) 限制節的總表。

## 逐處修改（中文 → 英文同步）

1. **Quantum Country 195 人（L81）**：修法 1（刪掉，限制已經寫了）。
   - 中：「原文沒有寫總共多少人讀過、多少人建了帳號，所以這個數字換算不出比例。」→ 刪除。限制節「Quantum Country 的數字多數沒有分母。195 人…」已經寫過。
   - 英：「The essay does not say how many people read it or created accounts, so the number cannot be turned into a percentage.」→ 刪除。

2. **延後實驗的分組方式（L85）**：修法 1（刪掉，限制已經寫了）。
   - 中：「原文沒有寫怎麼決定誰在哪一組。」→ 刪除。限制節「延後實驗很小…沒有寫分組方式」與先看結論表都已經寫過。
   - 英：「The essay does not say how users were put into each group.」→ 刪除。

3. **信賴區間重疊（L91）**：修法 1（刪掉過程與歸因，重疊直接當算術事實寫）。
   - 中：「…互相重疊，這是我對照數字看到的，作者沒有提。」→「…互相重疊。」
   - 英：「…overlap; I noticed this by comparing the numbers, and the authors do not mention it.」→「…overlap.」

4. **Davis 2018 檢定力（L117）**：修法 3（改成作者主張的判斷語氣，留一個「我」，避免讀起來像 Davis 的結論）。
   - 中：「我的判斷是這個實驗的檢定力很低：」→「依我看，這個實驗的檢定力很低：」
   - 英：「My judgment is that this experiment had very low statistical power:」→「As I see it, this experiment had very low statistical power:」

5. **Lindsey 百分比是相對還是百分點（L127）**：修法 3＋併入限制節。
   - 中：「比集中複習的相對高 16.5%，比一般間隔的高 10.0%（原文沒有說明這是百分點還是相對比例，從圖上的長條看較像相對比例，這是我的判讀）。」→「比集中複習的高 16.5%，比一般間隔的高 10.0%（從圖上的長條看較像相對比例）。」「原文沒有說明」移到限制節（見第 12 處）。拿掉「相對」是因為括號已經交代是從圖上判讀，避免同一件事斷言兩次。
   - 英：「The paper does not say whether these are percentage points or relative differences; from the bars in the figure they look relative, which is my reading.」→「(from the bars in the figure, these look like relative differences)」接在 10.0% 那句後面。

6. **Duolingo 百分比（L144）**：併入限制節。
   - 中：「原文沒有說這些百分比是相對變化還是百分點。」→ 刪除，併進第 12 處。
   - 英：「The paper does not say whether these percentages are relative changes or percentage points.」→ 刪除，併進第 12 處。

7. **「為什麼沒有變成普遍做法」節首（L167）**：修法 3（立場在節首講一次，而且指明是哪一條）。
   - 中：「下面的原因都是做的人自己的說法，或我從上面的資料推的，沒有研究直接比較過採用與不採用的原因。」→「下面把各來源的說法歸納成六類。除了「證據本身還不夠」是我從上面各節的資料推的，其餘各類的原因都出自做的人自己；沒有研究直接比較過採用與不採用的原因。」
   - 英：「The reasons below are the builders' own accounts or my inferences from the data above; no study…」→「Below, the sources' accounts are grouped into six categories. Except for "The evidence itself is not there yet," which is my inference from the sections above, every reason comes from the builders themselves; no study…」

8. **「證據本身還不夠」句尾（L181）**：修法 1（節首已經講了）。
   - 中：「這一點是我從上面各節的資料推的。」→ 刪除。
   - 英：「This one is my inference from the sections above.」→ 刪除。

9. **對照本站表格「文末綜合題」（L204）**：修法 1（整節是作者對照本站，該列「性質」欄已經寫「本站的選擇」，限制節總表也有列）。
   - 中：「和正文在同一次閱讀裡作答，沒有隔一段時間，這是我的判斷」→「和正文在同一次閱讀裡作答，沒有隔一段時間」
   - 英：「…with no gap; this is my judgment」→「…with no gap」
   - 沒有另外加節首立場句；理由見「沒把握的地方」。

10. **限制節：搬到文章是推論（L235）**：移到同一節的總表（第 13 處）。
    - 中：「把 MOOC、語言 app、中學課堂的結果搬到文章，是我的推論。」→ 刪除，移進總表。
    - 英：「Carrying results from MOOCs, a language app, and a middle school classroom over to articles is my inference.」→ 刪除，移進總表。

11. **限制節：Davis 檢定力（L240）**：修法 1（正文第 4 處與總表已經標了）。
    - 中：「Davis 2018（沒有測到差異，檢定力低是我的判斷）」→「Davis 2018（沒有測到差異）」
    - 英：「Davis 2018 (no detectable difference; low statistical power is my judgment)」→「Davis 2018 (no detectable difference)」

12. **限制節：百分比定義（L241）**：集中寫一次，合併 Lindsey 與 Duolingo。
    - 中：「百分比是相對還是百分點，原文沒有說。」→「Lindsey 與 Duolingo 的百分比是相對變化還是百分點，兩篇原文都沒有說。」
    - 英：「The paper does not say whether its percentages are relative or percentage points.」→「Neither the Lindsey paper nor the Duolingo paper says whether its percentages are relative changes or percentage points.」

13. **限制節總表（L244）**：作者判斷的唯一總表。
    - 中：「**我的推論與判斷**：文末綜合題不算間隔；…今晚三件事。正文都當場標了。」→「**我的推論與判斷**：把 MOOC、語言 app、中學課堂的結果搬到文章；文末綜合題不算間隔；…今晚三件事。」（加上第 10 處移來的項目；刪掉「正文都當場標了」，因為現在不是每處都標了）
    - 英：同樣在開頭加「carrying results from MOOCs, a language app, and a middle school classroom over to articles;」，刪掉「Each is marked where it appears.」

## 沒有動的地方

- 「可以做的事」節首「下面每一條都是本站的判斷，依據寫在後面。」：本來就是節首立場句，照規則保留。
- 第 2 條「它是我能想到最便宜的…」：用「我」寫的主張，不是歸因標籤。
- Bernhardt「原文寫 wall-clock time，從上下文看指的是累計時數」、Matuschak「這一則筆記全是作者的推論」：前者是譯名與用語說明，後者在講來源本身的性質，都不是本站的歸因標籤。
- 附錄、參考資料：沒有動。
- 數字、引文、來源歸屬：沒有改。
