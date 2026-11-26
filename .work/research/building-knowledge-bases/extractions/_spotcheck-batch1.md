# 抽取紀錄抽查：第一批（8 份）

- 抽查日期：2026-10-22
- 抽查者：獨立抽查員（沒參與精讀）
- 範圍：nardi、dumais、najork、rutishauser、bruce-jones-dumais、boardman-sasse、malone、whittaker-hirschberg 共 8 份。目錄裡其他檔案不在這次範圍。
- 只讀檔，沒有改動任何抽取紀錄。

## 抽樣方法

- 每份紀錄的「可引用結果」節，取所有列點行（`-` 開頭，含巢狀）中帶數字或引文（「」或 "）的行當候選。每份都先 `random.seed(42)`，再 `random.sample(候選, 3)`。
- 第一版篩選把「1. **標題**。見 §x」這類編號標題行也算進候選，抽到的是節號而不是數字或原文句（rutishauser L45、boardman L29、L62）。所以改成只取 `-` 列點行，重抽一次。下面用的是第二版結果，腳本在 scratchpad `spot/sample.py`。
- 核對方式：把全文檔的空白正規化後做逐字比對（`spot/find.py`）。雙欄 PDF 轉出的文字左右欄會並排在同一行，比對不到時就用 `sed` 看原始行，依欄位判讀。OCR 或斷行造成的「organi zation」「be- havior」「aver age」只是文字層的問題，不算不一致。

## 讀取紀錄總核對（`wc -l` / `wc -c` / `wc -m`）

| 全文檔 | 紀錄行數 | 實際 `wc -l` | 紀錄字元數 | 實際 `wc -c`（bytes） | 實際 `wc -m`（字元） | 已讀區段 | 缺口 |
|---|---|---|---|---|---|---|---|
| nardi.txt | 408 | 408 | 41,800 | 41,800 | 41,572 | 1–210、211–409 | 無 |
| sis.txt | 529 | 529 | 52,592 | 52,592 | 52,474 | 1–270、271–530 | 無 |
| najork.txt | 1,245 | 1,245 | 103,550 | 103,550 | 103,001 | 1–320、321–640、641–940、941–1245 | 無 |
| rutishauser.txt | 884 | 884 | 117,992 | 117,992 | 117,083 | 1–230、231–460、461–620、621–710、711–885 | 無 |
| kftf.txt | 1,224 | 1,224 | 58,081 | 58,081 | 58,062 | 1–420、421–840、841–1225 | 無 |
| boardman.txt | 511 | 511 | 59,300 | 59,300 | 58,899 | 1–260、261–512 | 無 |
| malone.txt | 531 | 531 | 41,326 | 41,326 | 41,320 | 1–270、271–532 | 無 |
| whittaker.txt | 1,695 | 1,695 | 90,062 | 90,062 | 89,472 | 1–450、451–900、901–1350、1351–1695 | 無 |

- 行數與 `wc -c` 八份都一致。各區段首尾相接，沒有缺口。有幾份區段終點比 `wc -l` 多 1 行（409、530、885、1225、512、532），原因是檔尾沒有換行字元（結尾是 `\f` 或文字），Read 會多顯示最後一行。所以多出的這 1 行是正確的，不是筆誤。
- 共同的小瑕疵（不影響判定）：八份寫的「字元數」其實是 `wc -c` 的 byte 數。檔案裡有非 ASCII 字元（彎引號、破折號等），真正的字元數（`wc -m`）比 byte 數少 6 到 909。多數紀錄有註明 `wc -c`，數字本身對得上指令，只是「字元」這個用詞不精確。建議以後寫成「bytes」。
- 「與摘要或常見轉述不一致的地方」：八份都有，而且都有實質內容（3 到 9 條）。

---

## 1. nardi-1995-filing-finding.md

全文檔：`fulltext/nardi.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 「We found no evidence that users are having serious trouble finding files on their personal computers.」 | nardi.txt 第 18–19 行左欄，Abstract | 逐字相符。紀錄寫「見 Abstract 與 FINDING INFORMATION 節」，正確。 |
| 2 | L33 | 四步驟（particular location → different location → Find → text search），原文「Often only step 1 was needed.」 | 第 150–154 行右欄，FINDING INFORMATION（標題在第 138 行） | 四步驟順序正確，引文逐字相符。原文第 3 步是「use the Find (or equivalent application) command」，紀錄省略了括號，屬於轉述，可接受。 |
| 3 | L57 | 「Archived information was most difficult to find. General memory loss was part of the problem; memory fades over time for files which are infrequently accessed.」 | 第 176–177 行（右欄底接下一段左欄），Location 小節 | 逐字相符，節名正確。 |

讀取紀錄：408 行與 41,800 bytes 一致，1–409 行全部涵蓋。不一致欄有 5 條。

**判定：通過**

## 2. dumais-2003-stuff-ive-seen.md

全文檔：`fulltext/sis.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L24 | 「Users' ratings of ease of finding were higher after SIS than before (F(1,43)=45.34, p<<0.001).」 | sis.txt 第 352–353 行右欄，Questionnaire Data 節（第 362 行起），Figure 5 旁 | 逐字相符，F 值與自由度都對。節名與 Figure 5 都正確。 |
| 2 | L27 | 「注意：這是 n≈45 的 Likert 自評，不是客觀找回成功率。」 | 第 363–364 行「Forty five people responded to both questionnaires.」，Figure 5 刻度是 Agree 5 到 Disagree 1 | n=45 正確，與 F(1,43) 的自由度一致。Likert 自評的說法也正確。 |
| 3 | L51 | 「Even people who regularly file email and documents, often misfile information, or create new folders with slightly different names. SIS searches make it easier to find these items which become buried in folder-based access.」 | 第 447–452 行左欄，User Comments 節 | 逐字相符，節名正確。 |

讀取紀錄：529 行與 52,592 bytes 一致，1–530 行全部涵蓋。不一致欄有 4 條（含 4 個子點）。

**判定：通過**

## 3. najork-2024-searching-personal-collections.md

全文檔：`fulltext/najork.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L19 | 「Users are typically aware of most, if not all, of the items that exist in the collection. Thus, the typical retrieval task is refinding known items, as opposed to finding as-of-yet unknown documents that satisfy an information need.」 | najork.txt 第 28–30 行，章首列點（14.1 之前） | 逐字相符。紀錄寫「見章首列點」，正確。 |
| 2 | L22 | 14.7：「the dominant search task for personal collections is known-item search」 | 第 364–365 行，14.7 Refinding Using Search（標題在第 362 行） | 逐字相符，節號正確。原句前面是「As mentioned in Section 14.6」，表示 14.6 已經講過這個論點，但這句話本身確實在 14.7。 |
| 3 | L51 | 「participation in the study caused introspection, resulting in two of the eight participants changing their filing behavior, both starting to separate working files from archival files.」 | 第 138–139 行（「be- havior」斷字），14.1 Organizing Digital Assets（第 61–141 行） | 逐字相符，節號正確。同段前面寫「31 participants」，可以確認紀錄在不一致欄說的「31 人與 8 人前後不一致」是真的。 |

讀取紀錄：1,245 行與 103,550 bytes 一致，1–1245 行全部涵蓋。不一致欄有 6 條以上。

**判定：通過**

## 4. rutishauser-2026-tabs-to-structures.md

全文檔：`fulltext/rutishauser.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L29 | 「During the baseline phase, participants had an average of 52.62 (±154.54) open tabs ... 1.55 ... 825.67 ... median of 11.48」 | rutishauser.txt 第 333–334 行，§5.1 Web Browsing Behavior Overall（第 330 行） | 52.62、±154.54、1.55、825.67、11.48 都一致。省略號前後逐字相符（原文「aver age」是 Exa 文字層的空格）。節號正確。 |
| 2 | L32 | 開分頁的理由（受試者人數）：short-term memory 22、multi-tasking 21、comparing 17、reminders 15、frequent access 8、background links 7 | 第 420–421 行，§5.1 | 六個數字都一致。原文寫「comparing results (17)」「opening links in the background (7)」，紀錄是縮寫。原文沒有明說括號數字是受試者人數，不過放在 n=29 的脈絡下解讀成人數是合理的。 |
| 3 | L55 | 「participants experienced significantly less difficulty finding web pages with Gstell (t(28)=2.60, p<0.02, n=29, Cohen's d=0.55)」 | 第 517–518 行，§5.2.3 Changing Relevance and Multiplexing（第 515 行） | 逐字相符，統計值都對，節號正確。 |

讀取紀錄：884 行與 117,992 bytes 一致，1–885 行全部涵蓋。取得管道寫了 curl 兩次失敗、Exa 成功。不一致欄有 5 條。

**判定：通過**

## 5. bruce-jones-dumais-2004-kftf.md

全文檔：`fulltext/kftf.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L23 | 「This choice can be seen as an instance of a signal detection task (Jones, 2004), ... Should this information be included in my personal information collection?」 | kftf.txt 第 40 行，Introduction 下的「Keeping (leaving) and re-finding information」小節 | 逐字相符（含破折號）。紀錄寫「全文檔第 40 行」，正確。全文搜尋「signal detection」只出現這一次，所以紀錄說「全文只有這一句」也正確。 |
| 2 | L27 | 「It is very important to note that the personal information collection also includes information sources and channels that have been left.」 | 第 40 行，同一小節 | 逐字相符，「同一小節」正確。 |
| 3 | L49 | 「The most common, regularly used method for keeping information was to make a Bookmark or Favourite but the second most common method was to do nothing」 | 第 679 行，Conclusion 節（標題在第 659 行） | 逐字相符，引文截在原文冒號前。這一條的總標題寫「見 Survey 節、Tables 3–6 與 Conclusion」，有包含 Conclusion，所以出處正確。 |

讀取紀錄：1,224 行與 58,081 bytes 一致，1–1225 行全部涵蓋。不一致欄有 5 條。（這份沒有「對本系列的定位」節，不是這次的檢查項目。）

**判定：通過**

## 6. boardman-sasse-2004-stuff-goes-in.md

全文檔：`fulltext/boardman.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L25 | 資料夾數平均：檔案 60.4、email 32.3、書籤 17.4。平均深度 2.3、1.4、1.1 | boardman.txt 第 150–158 行右欄，Table 1（Phase 1 participants [n=31]） | 六個數字都一致，分母 n=31 正確。紀錄的條目標題也寫了「最後一列 n=8」，跟表中的「([n=8] Phase 2 participants)」一致。 |
| 2 | L33 | 「Nevertheless, participants continued to save bookmarks, even though many were never used.」 | 第 303–304 行左欄，Retrieval 節（第 277 行起） | 逐字相符，節名正確。 |
| 3 | L45 | 「although older items may be accessed erratically, they can be highly valued by people」，以及作者說這和「archived information is not useful」不一致 | 第 4 頁右欄頂（第 251 行起）的第 257–259 行，是 Retrieval 節左欄的接續，後面接著 Cross-tool Profiling（第 270 行） | 兩段引文都逐字相符。原文是「This finding is not consistent with previous claims that archived information is not useful to people [4].」，紀錄的轉述正確。紀錄寫「Retrieval 末段」，依頁面分欄判讀，正確。 |

讀取紀錄：511 行與 59,300 bytes 一致，1–512 行全部涵蓋。不一致欄有 5 條。

**判定：通過**

## 7. malone-1983-desks.md

全文檔：`fulltext/malone.txt`

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L28 | 「But perhaps the most important insight from this study of desk organization was that, in addition to this finding function, an equally important function of most desk organizations is reminding.」 | malone.txt 第 307 行，FUNCTIONS OF DESK ORGANIZATION。第 309 行是頁首「107」，所以這句在 p.106 底 | 逐字相符（OCR 寫成「organi zation」）。紀錄寫「p. 106–107」，正確。 |
| 2 | L32 | 「If I don't put it here where I can visually see it, I won't do it. (M.P., 10/27/81)」 | 第 317 行，Evidence for the Importance of Reminding（第 314 行），p.107 | 逐字相符，節名與頁碼正確。前一句「Five of the ten respondents...」在第 315 行，也一致。 |
| 3 | L56 | 「When things to be done are piled up on a desk, old things are covered up by new ones. With a frequency-based reminding system, even low priority items are guaranteed to appear occasionally.」 | 第 443–445 行，Reminding 小節（第 422 行），在 IMPLICATIONS 節下。第 428 行是頁首「110」 | 逐字相符。Reminding 從 p.109 開始，這句在 p.110，紀錄寫「p. 109–110」，正確。 |

讀取紀錄：531 行與 41,326 bytes 一致，1–532 行全部涵蓋。不一致欄有 5 條。

**判定：通過**

## 8. whittaker-hirschberg-2001-paper-archives.md

全文檔：`fulltext/whittaker.txt`（作者草稿版）

| # | 紀錄位置 | 抽中項目 | 原文位置 | 核對結果 |
|---|---|---|---|---|
| 1 | L36 | Conclusions：「given the opportunity to discard their data, they did not do so, keeping 78% of their paper data.」 | whittaker.txt 第 1202–1204 行，4. CONCLUSIONS（第 1142 行起） | 逐字相符，78% 正確，節名正確。 |
| 2 | L45 | 「Overall people threw away 22% of their data」 | 第 314 行，3.1.1 Characteristics of discarded information（第 312 行） | 逐字相符，節號正確。Conclusions 第 1152 行也寫 22%，跟紀錄在不一致欄說的「3.1.1 與 Conclusions 都寫 22%」一致。 |
| 3 | L89 | 「users experience common difficulties with: (a) determining the value of incoming information, (b) deciding whether and how to categorise that data, and (c) in electing whether to keep incoming information available in their immediate workspace or file it away for later access.」 | 第 1242–1246 行，CONCLUSIONS | 逐字相符（文字層把「inf ormation」「late r」拆開）。節名正確。 |

讀取紀錄：1,695 行與 90,062 bytes 一致，1–1695 行全部涵蓋。紀錄也交代了第 1611–1695 行不是論文本體。不一致欄有 9 條以上。

**判定：通過**

---

## 摘要

| 紀錄 | 3 項核對 | 讀取紀錄 | 不一致欄 | 判定 |
|---|---|---|---|---|
| nardi-1995 | 3/3 相符 | 一致、無缺口 | 有（5 條） | 通過 |
| dumais-2003 | 3/3 相符 | 一致、無缺口 | 有（4 條） | 通過 |
| najork-2024 | 3/3 相符 | 一致、無缺口 | 有 | 通過 |
| rutishauser-2026 | 3/3 相符 | 一致、無缺口 | 有（5 條） | 通過 |
| bruce-jones-dumais-2004 | 3/3 相符 | 一致、無缺口 | 有（5 條） | 通過 |
| boardman-sasse-2004 | 3/3 相符 | 一致、無缺口 | 有（5 條） | 通過 |
| malone-1983 | 3/3 相符 | 一致、無缺口 | 有（5 條） | 通過 |
| whittaker-hirschberg-2001 | 3/3 相符 | 一致、無缺口 | 有 | 通過 |

共通備註（不影響判定）：

1. 「字元數」其實是 `wc -c` 的 byte 數。數字跟指令對得上，但用詞不精確，建議改寫成 bytes。
2. bruce-jones-dumais、boardman-sasse、malone 這三份沒有「對本系列的定位」節，跟其他五份格式不同。
3. 這批的「讀取紀錄」各節在 bruce、boardman、malone 三份裡都只出現一次，沒有重複。抽查時看到重複，是因為我的 awk 印法造成的，不是檔案本身的問題。
