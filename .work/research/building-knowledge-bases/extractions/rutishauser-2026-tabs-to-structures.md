# Rutishauser & Fritz 2026 — From Tabs to Structures: Understanding and Supporting Web Page Management

read_status=fulltext（透過 Exa 取得的 ACM PDF 全文文字；表格與圖的版面有破損，見讀取紀錄）

## 書目

- 作者：Roy Adrian Rutishauser, Thomas Fritz（University of Zurich）
- 出處：Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems (CHI '26), April 13–17, 2026, Barcelona，共 18 頁。DOI 10.1145/3772318.3791979。授權 CC BY 4.0。經費來源：SNF Taskflow Grant 200021_207916。
- 讀的檔案：mcp__exa__web_fetch_exa 抓 https://dl.acm.org/doi/pdf/10.1145/3772318.3791979 → 原始輸出在 `/Users/vincent/.claude/projects/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/tool-results/mcp-exa-web_fetch_exa-1792641183090.txt`，用 fold 斷行後存為 `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/rutishauser.txt`。

## 研究設計

- 類型：多週混合方法田野實驗，用技術探針（technology probe）**Gstell** 進行。
  - Gstell 由兩部分組成：Shelf 是不分類的短期暫存；History 是可加標籤的群組，依最近使用時間排序（wear-based），可搜尋，可一鍵開關整組分頁。
- 流程：
  - 基線期平均 7.71（±2.55）個工作天，只監測不介入。
  - 接著 30 分鐘視訊教學，其中 10 分鐘操作教學，**沒有提供分組或暫存的指引**。
  - 介入期平均 15.14（±6.78）天，每天 16:00 做經驗取樣（ESM），收到 2,244 則關於開著的分頁、720 則關於暫存頁、299 則關於群組的回覆。
  - 前後問卷用 7 點 Likert 量表，改編自 Ma et al. 2023，前後比較用配對 t 檢定；再加 SUS 問卷與半結構訪談。
- 受試者：招募 31 人、完成 **29 人**（女 10、男 19），年齡 20–34 歲，平均 28.31（±3.92）。26 人在中歐、3 人在北美。
  - 職業：PhD 學生 8、碩士生 8、學士生 3、PM 3、軟體工程師 2、博士後 1、業務 1、行政助理 1、建築碩士生 1、建築師 1。
  - 瀏覽器：Chrome 20、Firefox 7、Edge 1、Opera 1。條件是不能用 Safari。
  - 瀏覽器比較只有 28 人的資料，因為 P29 的基線資料遺失。
- 比較對象：同一批人的基線期與介入期，也就是瀏覽器原生的分頁列，和瀏覽器內建書籤做質性比較。原文：「As there is no widespread use of an alternative solution as a baseline [67], we compare our probe with information spaces native to the browser.」**沒有平行對照組。**
- 量了什麼：開著的分頁數（Wilcoxon 檢定，個人層級用 Mann-Whitney U）、重訪率、vocabulary size、Gstell 的整理／開啟／關閉事件、Likert 自評、訪談主題。

## 可引用結果

1. **分頁會堆積成「短期記憶」，而且相當比例閒置**。見 §5.1。
   - 「During the baseline phase, participants had an average of 52.62 (±154.54) open tabs ... ranging from one participant with an average of just 1.55 open tabs all the way to another one with 825.67, resulting in a highly skewed distribution with a median of 11.48」
   - 「for participants with more than ten open tabs, a substantial share of tabs (37.88%) was not revisited throughout workdays and remained idle.」
   - 「All participants indicated in the pre study questionnaire that they occasionally had too many tabs open」
   - 開著分頁的理由（受試者人數）：short-term memory 22、multi-tasking 21、comparing 17、reminders 15、frequent access 8、background links 7。
2. **不關分頁是因為不確定以後用不用得到**。見 §5.1。這是 order 1「收集者心態」的直接證據。
   - 「Many participants (21) explicitly stated that they sometimes struggle to close browser tabs because they might need them later, leading some (15) to adopt routines such as end-of-day cleanups. Eight participants even associated closing tabs with negative feelings and fear of losing important information.」
   - P8：「I open something, and then I leave it open because I think that maybe I will need it, but then it stays open.」
   - P28：「A lot of tabs I actually keep open because I just don't know what else to do with them.」
3. **書籤很少用、很少維護，常變成傾倒場**。見 §5.1。
   - 「Ten participants explicitly mentioned that they "don't save most of them anywhere"(P16). Only seven participants stated in the interviews to actively structure their bookmarks with folders and sub-folders」
   - 「Twelve participants reported that they "rarely change"(P22) their bookmarking structures, leaving them prone to becoming outdated. Some users avoid structuring bookmarks altogether, treating them as a "dump"(P16), which makes re-finding pages "quite painful"(P29).」
   - 書籤的整體使用率則引自 Related Work §2.1 轉述的文獻：「accounting for only 2% of overall web navigation [20, 67]」。
4. **暫存區 Shelf 的去處：約四成刪掉、一成六轉成群組**。見 §5.2.2 與 Figure 4。這是 order 1「延後分類」的核心數據。
   - 「In total, 57% of all shelved web pages were revised, with 16.18% that were transitioned to a group and 40.82% that were considered irrelevant and subsequently removed.」
   - 「all but three participants (P25, P13, P7) re-examined the Shelf, with 16 stating to have done so regularly.」
   - 「About half (48.02%) of all web pages were directly grouped from open browser tabs.」用途在一開始就明確時，不需要經過暫存。
5. **存起來之後能安心關掉**。見 §5.2.1。
   - 「Over the course of the study, 88.43% of saved web pages were subsequently closed, and the majority of these (80.20%) were closed within 2 minutes of saving.」
   - 「it was significantly easier for participants to find a suitable location to save web pages with Gstell (t-test, t(28)=2.98, p<0.01, n=29, and a medium effect size of Cohen's d=0.63)」
   - P8：「Maybe I need it - let's keep it on the Shelf.」
6. **主題群組和任務群組的生命週期不同**。見 §5.2.2。
   - 群組依主題 49.43%、依任務或活動 31.03%。
   - 「42.86% of all topic groups were intended for reuse only after 30 days or more. In comparison, 69.57% of all task groups were intended for reuse on the same or next day after creation, and only 4.76% were meant for 30 days or later. Overall, task groups were accessed 301.73% more often than topic groups ... (t(63)=2.31, p<0.03, n=65)」
   - 存得越多的人，主題群組越多（r=0.67, p<0.001）；任務群組數與存檔數無關（r=0.01）。
   - P3：「I created one group with interesting articles, but this would be something that I would hopefully go back to at some point」
7. **自評找回變容易**。見 §5.2.3。
   - 「participants experienced significantly less difficulty finding web pages with Gstell (t(28)=2.60, p<0.02, n=29, Cohen's d=0.55)」
8. **分頁數整體沒有顯著下降**。見 §5.2.4 與 Table 3。
   - 「There was also a decrease by 58.59% across all participants in the actual number of open tabs from 52.62 (± 154.54) beforehand to 33.18 (± 70.55) with Gstell. However, this decrease was statistically not significant across all participants (Wilcoxon signed-rank test, W=173.0, p=0.51, n=28).」
   - 個人層級：「a statistically significant decrease in the number of open tabs for 13 of 28 participants」。Table 3 的星號也標出幾位分頁數顯著**增加**的人，例如 P8 增加 193.7%、P6 增加 128.7%。
   - 存得多不代表分頁少：「there was no significant overall correlation between the number of web pages saved and the relative tab change ( = −0.20, = 0.30)」。
   - 自評「太多分頁」的次數下降：t(28)=3.15, p<0.004, d=0.49。自評較專注：t(28)=2.51, p<0.02, d=0.41。
9. **囤積者兩極化，有人怕「又多一個要整理的地方」**。見 §6 Individual factors 與 §5.2.4。
   - 「Hesitant participants felt they needed to devise a "perfect" system for structuring their work contexts and feared cluttering yet another space to manage their web pages.」
   - P22：「It feels like I have a mess already of things that are open and I wouldn't know how to group them」
10. **設計主張：明確為不確定性與延後決策而設計**。見 §6。
    - 「Explicitly design for uncertainty and deferral of decisions on information relevance and structure.」
    - Related Work §2.1 轉述 Malone：「Malone recommended allowing users to defer classification and incorporating cues to indicate relevance.」
11. **使用量**。見 §4.3 與 §5.1。SUS 88.45；介入期平均每人存 28.93（±27.42）頁、建 4.59（±3.22）個群組；每小時切換分頁 63.66（±91.63）次；重訪率 64.18%。

## 作者自己列的限制（§7 Threats to Validity 與 §6）

- 田野實驗無法控制所有變項；3 人因為休假或出差，研究期被縮短或延長。
- 研究期太短：「Another limitation of the field experiment is its short duration.」需要縱貫研究。作者另提到自己內部使用了 8 個月以上，但那不是研究資料。
- 霍桑效應：「Knowing participants were being studied may have caused them to change their browsing behavior [72]. Daily experience sampling questionnaires may have further raised the awareness」。
- 外部效度：「Many participants in our study were professionals or students from the information technology sector, predominantly male (19 of 29), with an academic background, and between 20 and 34 years of age. ... the study results may not be generalizable to all knowledge workers.」
- 引言也自限：「a focused lens to explore early adoption patterns while acknowledging the scope of our findings within this professional subset」。
- 訪談的主題次數「not convey prevalence」，因為半結構訪談中每個人被問的題目不完全相同。

## 與摘要或常見轉述不一致的地方

- **摘要說設計概念「can alleviate the overload」，§1 說「reducing tab overload for many participants」**。但整體分頁數的下降不顯著（p=0.51）；13/28 人顯著下降，也有幾位顯著上升。「減少超載」的證據主要是**自評**（t(28)=3.15），客觀分頁數只在部分人身上下降。
- **數字錯誤**：§5.2.4 寫分頁數從 52.62 降到 33.18 是「a decrease by 58.59%」。實際計算是 (52.62−33.18)/52.62 ≈ **36.9%**。Table 3 的平均 Δ 欄是 **+5.4%**（每人變化百分比的平均，因為部分人增加）。58.59% 跟兩者都對不上，引用時不要用這個數字，改寫原始的兩個平均值。
- **Nardi 的書目**：本篇 ref [76] 寫「Nardi, Anderson, and Erickson. 1995. Filing and Finding Computer Files. Technical Report 118」，把 1995 年和 TR 混在一起。
- **SIS 的書目**：本篇 ref [30] 引的是 2016 年 SIGIR Forum 重刊版（49(2), 28–35），不是 2003 原版。
- 「Shelf 防止暫存區退化成垃圾場」的說法：證據是 57% 的暫存頁被重新處理過，但研究只有約兩週。作者自己說長期可持續性尚待驗證，而且有 6 人擔心舊群組越積越多後會看不到。

## 對本系列的定位

- order 1「收集不等於知識庫」：
  - 收集者心態：開分頁是因為「maybe I will need it」，37.88% 閒置，害怕關掉會失去資訊。
  - 收件匣與延後分類：Shelf 中 41% 被刪、16% 轉成群組，88% 存檔後隨即關分頁。
  - 什麼值得收：主題群組多半是「希望某天會回來看」，42.86% 預計 30 天以上才用；任務群組則是當天或隔天就用。
  - 這些是 2026 年的近期證據，可以補足 Nardi、Malone 等舊研究。
- 證據等級與限制：29 人、大多是 IT 背景或學生、約兩週、沒有平行對照、主要指標是自評。只能寫「初步證據」，作者本人也用這個措辭（「early evidence」「initial evidence」）。

## 讀取紀錄

- 取得全文的管道，依序嘗試：
  1. `curl -L -A "Mozilla/5.0"` 抓 dl.acm.org/doi/pdf/10.1145/3772318.3791979 → 失敗，回傳 Cloudflare 頁面「Just a moment...」（5,483 bytes HTML，不是 PDF）。
  2. curl 抓 https://doi.org/10.5167/uzh-434043（蘇黎世大學 ZORA）→ 失敗，回傳 bot 檢查頁「Making sure you're not a bot!」。
  3. mcp__exa__web_fetch_exa（maxCharacters 200000）抓 ACM PDF → **成功**，共 117,482 字元、374 行，結尾是參考文獻 [97]，確認完整。
  - Exa 成功後就沒有再試 jina、tavily、firecrawl；本 session 的 claude.ai firecrawl 連線本來就失敗。
- 全文檔：rutishauser.txt，884 行（fold -w 200 斷行後），117,992 字元。
- 依序讀過：第 1–230 行（標題到 §3 Approach 中段），第 231–460 行（§3 續、§4 方法、Table 1–2、§5.1、Table 3、Figure 2–3、§5.2.1 開頭），第 461–620 行（§5.2.1–§5.2.4、§6 前半），第 621–710 行（§6 後半、§7、§8、致謝、參考文獻 [1]–[25]），第 711–885 行（參考文獻 [25]–[97]）。合計涵蓋第 1–884 行全文。
- 已知破損：Table 3 的欄位在文字轉換後錯位。每列可辨識的格式是「B I Δ(%) 參與者ID | * Saves Shelved Groups」：ID 前面的三個數值與後面的星號和數值都屬於這個 ID（唯一例外是第一列「P29 - - - 27 30 1」）。例如 1.6/2.2/39.2 屬於 P14，825.7/369.5/−55.2 屬於 P12，與正文的 1.55 和 825.67 一致。另外兩項交叉核對也吻合：正文說降幅最大的是 P12、P3、P2，表上分別是 −55.2、−59.3、−57.4；正文說存得最多的是 P1–P4，表上分別是 114、60、102、53。平均列：M 52.6 33.2 5.4 28.9 14.5 4.6。Figure 2–4 只剩數字碎片，引用 Figure 4 時以正文的百分比為準。
