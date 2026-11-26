# 獨立審稿：但書與歸因修正（2026-10-14-platform-experiments-rubrics-design-research）

審稿範圍：
- zh：`src/content/posts/learning/2026-10-14-platform-experiments-rubrics-design-research.md`
- en：`src/content/posts/learning/2026-10-14-platform-experiments-rubrics-design-research-en.md`
- 修改清單：`.work/reviews/hedge-fix-2026-10-14-platform-experiments-rubrics-design-research.md`（16 項＋刻意保留）
- 依據：`.agents/skills/post/references/writing-guide.md`「但書與歸因不堆疊」整節
- 核對抽取紀錄：`.research/extractions/articles-that-teach/` 的 prihar2022-trends、sales2023-auxiliary-data、yuan2015-oer-rubrics、lee2020-rubric-validity、tinoca2022-dbr-review

兩檔行號對齊（同一段落在 zh/en 同一行），以下行號兩檔通用。

## 結論：不通過（1 項必須修）

## 檢查器

| 指令 | 結果 |
|---|---|
| `node scripts/check-process-leak.mjs <zh> <en>` | exit 0；hedges zh 2（「我的推論」L282、「原文沒有寫」L280），en 1（"my judgment" L242） |
| `node scripts/check-tw-terms.mjs <zh>` | 0 blocking, 0 to review |
| `node scripts/check-lang-parity.mjs` | OK（2810 對，無 parity 問題） |

## 必須修

### M1　L230（zh/en）Tinoca 結論引文：刪掉「原文沒有說明」後，把「對應不清楚」寫成了「自相矛盾」

- 現句 zh：「迭代次數也一樣：Zheng 一輪佔 50%，Tinoca 一輪是 0 篇、未交代 40%。Tinoca 等的結論段**卻又寫**「It is also common to find studies reporting only one of the intervention cycles」。」
- 現句 en："Yet Tinoca et al.'s conclusion also says …"
- 問題（清單第 2、3 項）：
  - 引文說的是「只報告其中一輪」（抽取紀錄 L71：後半句是 "and missing a larger scope of the bigger research design"），不是「只做了一輪」。抽取紀錄 L87 的判斷是：只報告一輪的論文被歸進「未交代」的 65 篇，還是根本沒有這類論文，原文沒有說明，所以兩者「怎麼對應不清楚」。
  - 原句寫的是「怎麼對應，原文沒有說明」，立場是存疑。新句刪掉這半句、又加了「卻」，讀者會讀成 Tinoca 的表和結論互相矛盾。這樣改加強了結論，也拿掉了讀者解讀「一輪 0 篇」需要的資訊：那 0 篇可能是編碼造成的，不一定是實際數量。全文其他地方也沒有再交代這一點。
- 建議改法（縮回來源原意，不加歸因標籤）：
  - zh：「Tinoca 等的結論段寫的是「It is also common to find studies reporting only one of the intervention cycles」，指只報告計畫裡的其中一輪；這類論文在表上算進「未交代」還是另有歸類，表上看不出來。」
  - en: "Tinoca et al.'s conclusion says "It is also common to find studies reporting only one of the intervention cycles", meaning papers that report one cycle of a larger project; the table doesn't show whether those papers fall under *not stated* or somewhere else."
  - 或者把這句連同「Tinoca 一輪是 0 篇」的保留，移到限制節 L280 的 DBR 條。

## 逐項檢查（修改清單 #1–#16）

| # | 位置（行） | 判定 | 說明 |
|---|---|---|---|
| 1 | Prihar 末段（已刪） | ✅ | 理由移到 L277 限制節。抽取紀錄 L72 確認原文沒提「只看寫完的人」是事後子群。 |
| 2 | L103 Roschelle「也是證據最強的一份」 | ✅（建議 S1） | 句首「這是本篇唯一一份…」看得出是本站在比較，不會被讀成 Roschelle 等人自己的說法。但「最強」沒有限定比的是哪一面，見 S1。 |
| 3 | L129「把上面幾份放在一起看」 | ✅ | 綜合由本站做，L282「我的推論」清單列了「合起來看」三點。三點都能對回上文；「多半沒有複製」沒有比 Kizilcec「主要假說都沒有複製」說得重。 |
| 4 | L151 Yuan 與 Recker 表下 | ✅ | 原文 L308 把 "validity, reliability, or utility" 三者並列，Table 1 只分有沒有報告，「不區分」符合來源。讀者仍讀得出「有報告的 6 份測得好不好不知道」。 |
| 5 | L224 刪「這是我的讀法」 | ✅ | 前兩句都在回顧支持的範圍內；L282 清單也列了「不能說比較有效也不能說比較無效」。 |
| 6 | L230 Tinoca | ❌ M1 | 見上。 |
| 7 | L242 節首立場句 | ✅ | 涵蓋「對照本站」（含表的「判定」欄、L252 的效度檢查段）與「可以做的事」。「今晚可以做的三件事」不在涵蓋範圍內，但那一節只有行動、沒有歸給來源的主張，而且 L282 清單也列了它，可以接受。 |
| 8 | L250「最缺的不是人數，是結果量數」 | ✅ | 放在「判定」欄，又有 L242 涵蓋，不會被讀成 Chen 或 Sales 的結論。L282 清單也列了。 |
| 9 | L256「每一條都寫了依據；依據全部來自…不是單篇教學文章」 | ✅ | 「依據和教學文章隔一層」這個讀者需要的限制還在。L242 涵蓋了立場，不重複。 |
| 10 | L263 刪「（轉引，我沒讀原文）」 | ✅ | 同句仍寫「Yuan 與 Recker 轉引的研究」，L284 限制節「轉引」條也列了。en 是 "research cited by Yuan and Recker"，一致。 |
| 11 | L263「沒有研究直接測過它對教學文章有沒有用」 | ✅（建議 S2） | 強度和原句相同（原句後半就是這句）。但這是無限定範圍的全稱否定，見 S2。 |
| 12 | L273 限制節第一條刪推論句 | ✅ | 併進 L282。 |
| 13 | L277 子群理由 | ✅ | 括號裡寫的是事實（門檻不同→寫完的人數不同）。「後者作者自己提醒了」保留了「前者作者沒提」的對比，不會被讀成 Prihar 等自己的說法。 |
| 14 | L282「我的推論」清單 | ✅ | 集中寫一次，符合規則第 3 條。 |
| 15 | L288 刪「原文沒有說明重疊多少」 | ✅ | 前面已寫「同一實驗與學生會進到多個問題」，重疊多少讀者用不到。 |
| 16 | L290 刪「排除規則各丟掉幾對，原文沒寫」 | ✅ | 383→227 的總數還在，篩選的規模讀者看得到。抽取紀錄 L128 確認原文沒報。 |

### 清單第 1–7 項總評

1. **紅線（推論讀起來像來源結論）**：只有 M1 一處。其餘刪掉標籤的句子，都還有本站主詞（「本篇」「把上面幾份放在一起看」），或在 L242 立場句涵蓋的範圍內。
2. **數字、引文、歸屬、強度、新增內容**：數字與引文都沒改，也沒有新增主張。強度變了的只有 M1（加了「卻」）。L277 括號是從 #1 搬過來的，不算新增。
3. **刪掉的「原文沒有寫 X」會不會改變解讀**：#15、#16 不會。#1 已移到限制節。M1 會，而且全文沒有別處交代。
4. **換句話說繞過檢查器**：沒有發現逐句用同義標籤換掉原標籤的情形。正文還有一些「原文沒有分別給／沒有交代／正文沒有討論／沒有明說」（L50、57、191、288、304），內容是來源資料本身缺了什麼，不是替本站推論加的但書。修改清單也沒有把它們換成別的說法，所以不算繞過。其中幾處讀者用不太到，列在 S4。
5. **中英一致**：16 項 en 都同步修了，行號對齊，L242、L250、L256、L263、L277、L282 的措辭對得上。M1 兩版要一起改。
6. **節首立場句**：L242 涵蓋 L242–264；L256 只交代依據的範圍，不再重申立場，符合「整段只說一次」。
7. **檢查器**：三支都綠（見上）。

## 建議修

- S1　L103：「也是證據最強的一份」→「就學習成果而言，也是證據最強的一份」（en: "and, for learning outcomes, also the strongest evidence"），免得和 Kizilcec 那份事先登錄、26 萬人的 RCT 比起來說過頭；或把這個排序加進 L282「我的推論」清單。
- S2　L263：「沒有研究直接測過它對教學文章有沒有用」→「上面的來源都沒有測過它對教學文章有沒有用」，把全稱否定縮到讀過的來源，也不必加「我」標籤（en 同步）。
- S3　L119、L281、L288、L304 等處：「我算的」同一個數字標了兩次（例：Kizilcec 8.8% 在 L119 行內標一次、L281 清單又標一次；Zheng 重算在 L280、L281、L304 各一次）。建議 L119 的行內括號刪掉，只留 L281 清單和附錄。
- S4　L57「正文沒有討論這一項」、L288「正文沒有討論」、L304「編碼依據是全文還是摘要，原文沒有明說」：讀者用不到，可以刪（依規則第 1 條）；L50、L191、L288 的交互作用檢定那幾句會影響解讀，應保留。
- S5　L35 結論表與 L56：「只看寫完的人沒有測到差異」第一次出現時沒附「事後子群」的提醒，要到 L277 才看得到。可以在 L35「範圍與保留」欄補「寫完的人是事後子群」幾個字（en 同步）。屬於選配，不改也不違規。

## 必須修確認

**結論：通過**

- M1 Tinoca（zh/en L230）：「卻又寫」已拿掉，改成「結論段寫的是「It is also common to find studies reporting only one of the intervention cycles」，指只報告計畫裡的其中一輪；這類論文在表上算進「未交代」還是另有歸類，表上看不出來」，en 同義（"…the table does not show whether such papers were counted as "didn't say" or classified some other way"）。引文與抽取紀錄 L71 逐字相符；矛盾語氣已拿掉，「0 篇可能是編碼造成」的解讀空間回來了。中英一致。✅
- 沒有引入新錯。附帶一點（建議，不擋）：抽取紀錄 tinoca 第 36 行引原文 L178「40% … do not indicate the number of cycles … partly since they report only a part of the study developed or under development」，正文其實有部分交代：只報告研究一部分的論文，至少有一些算進了「未交代」。新句說「表上看不出來」，只講表，沒有說錯；想更精確的話可以補半句「正文說未交代的 40% 有一部分是因為只報告了研究的一部分」。抽取紀錄 L87「原文沒有說明」和 L36 也有出入，下次重用這份抽取紀錄時要留意。
- 檢查器（本輪，10 檔一起跑）：`node scripts/check-process-leak.mjs <10 檔>` → rc=0，無輸出；`node scripts/check-tw-terms.mjs <10 檔>` → 0 blocking, 0 to review。
