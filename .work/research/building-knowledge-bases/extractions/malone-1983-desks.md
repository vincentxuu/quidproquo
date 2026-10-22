# Malone 1983 — How Do People Organize Their Desks? Implications for the Design of Office Information Systems

read_status=read（ACM 正式版 PDF 的文字層，經 Exa 取得；圖表只剩 OCR 殘字）

## 書目

- 作者：Thomas W. Malone（Xerox Palo Alto Research Center）
- 刊物：ACM Transactions on Office Information Systems, Vol. 1, No. 1, January 1983, pp. 99–112（期刊後來改名為 ACM Transactions on Information Systems，Crossref 上用新名）。收稿 January 1982，修訂並接受 August 1982。
- DOI：10.1145/357423.357430（Crossref 確認標題與頁碼 99–112）
- 讀的檔案：ACM PDF 經 Exa `web_fetch_exa` 取得文字 → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/malone.txt`
- 取得過程：
  1. `curl -L -A "Mozilla/5.0" https://dl.acm.org/doi/pdf/10.1145/357423.357430` → 回傳 Cloudflare「Just a moment...」挑戰頁（HTML），不是 PDF。失敗。
  2. Jina `search_web` → 「This key is out of quota」。失敗。
  3. Exa `web_search_exa` 找到 ACM PDF 的索引內容；Exa `web_fetch_exa` 取得 ACM PDF 全文文字層。成功。
  - 文字層含頁首頁尾（如「How Do People Organize Their Desks? • 101」「ACM Transactions on Office Information Systems, Vol. 1, No. 1, January 1983」），由此確認是 ACM 正式版。Figures 1、2（Michael 與 Kenneth 的辦公室平面圖）只剩 OCR 殘字，不影響本文論點。

## 研究設計

- 方法：探索性觀察訪談。每人約一小時，請受試者帶研究者「a tour of their office」，說明什麼資訊放在哪裡、為什麼放在那裡；這一段沒有結構化問題，只偶爾追問「Why is that there?」。全程錄音，並拍照記錄訪談中提到的位置。
  - 其中 6 人做「probe」找文件任務：由一位同事各挑幾份「好找」和「難找」的文件，請受試者找出來。作者說明「no attempt was made to have the probes be of equal difficulty」。
  - 最後所有人回答一組標準問題（附錄 6 題：自評整齊度 1–5、最大問題、有沒有待辦清單、有沒有行事曆、每週／月找不到東西幾次、忘記做事幾次）。
- 受試者：10 人——3 位秘書、3 位研究科學家、1 位技術經理、1 位行政經理、1 位採購專員、1 位醫師。除醫師在大型醫療診所外，都在同一個工業研究中心（作者在 Xerox PARC，文中沒有明說受試者在 PARC）。訪談日期在 1981 年 10 月（引文標 10/12/81–10/27/81）。
- 比較對象：沒有對照組。依自評整齊度分成「neat」6 人（自評 ≥4）與「messy」4 人（自評 ≤3.5）做描述比較；另比較例行性工作與非例行性工作。
- 量了什麼：幾乎都是質性描述；少數粗估比例（照片中的 pile 用途、找文件 probe 的描述維度）。

## 可引用結果

1. **桌面整理除了「找」，同樣重要的功能是「提醒」**。見 FUNCTIONS OF DESK ORGANIZATION（p. 106–107）。
   - 「But perhaps the most important insight from this study of desk organization was that, in addition to this finding function, an equally important function of most desk organizations is reminding.」
   - 找與提醒的區別在意圖：「The distinction between finding and reminding rests on intentionality. If you become aware of something you intended to find, then the finding function has been served. But if, in the course of doing one thing, you become aware of something else without intending to, you have been reminded of the second thing.」
2. **提醒的證據：一半受試者主動提到；照片中約 67% 的 pile 是待辦**。見 Evidence for the Importance of Reminding（p. 107）。
   - 「Five of the ten respondents made explicit remarks about the importance of reminding in determining what information was on top of their desks」
   - 「If I don't put it here where I can visually see it, I won't do it. (M.P., 10/27/81)」
   - 「When I'm working on stuff, I always keep them out here so that I won't forget about them, 'cause if I put them away in the file where they'll be when I'm done then I forget. (D.R., 10/22/81)」
   - 「a rough analysis of the piles visible in the photographs suggests that of those for which uses could be determined from the interviews about 67 percent were piles of things to do, presumably placed there to serve as reminders.」（分母是「能從訪談判斷用途的 pile」，而且作者自稱 rough analysis。）
3. **堆著是為了延後分類決定**。見 Evidence for the Importance of Reminding 引文與 Evidence of Cognitive Difficulties in Classifying Information（p. 107–108）。
   - 「it's almost like leaving them out means that I don't have to characterize them. Leaving them out means I'm going to come across them again, and at the time that I come across them I'm going to decide what to do about them... Leaving them out means that I defer for now having to decide (S.W., 10/12/81)」
   - 「"Well, see the hardest problem for me organizationally is deciding what the categories are and what category something is in" (K.H., 10/16/81)」
4. **files 與 piles 的定義**。見 MAJOR UNITS OF DESK ORGANIZATION 與 Table I（p. 105–106）。
   - files：「files are units where the elements (e.g., individual folders) are explicitly titled and arranged in some systematic order (e.g., alphabetical or chronological).」
   - piles：「In piles, on the other hand, the individual elements (papers, folders, etc.) are not necessarily titled, and they are not, in general, arranged in any particular order.」「Since piles have no systematic order, however, their spatial location is often especially important in finding them.」
   - 設計含意：「much of the organization on people's desktops consists of untitled piles, but that most computer systems require any new document or group to be titled.」
5. **亂的辦公室比較常找不到、比較常漏事——但只是小樣本跡象**。見 Individual Differences（p. 104–105）。
   - 「Two of the four people with messy offices complained that "medium important" things sometimes "slipped through the cracks" in their office and did not get done. None of the people with neat offices made this complaint.」
   - probe：messy 3 人中有 2 人至少一份找不到；neat 3 人全部找到。
   - 「Even though these results are by no means conclusive, they give some support to the claim that people with messy offices do, indeed, have more problems finding information and remembering tasks than people with neat offices.」
6. **整理的投資不一定值得（維護成本）**。同節（p. 105）。
   - 「There is no indication in these results, however, that effort spent keeping an office neat is always worth it. For example, one of the people with a neat office said that he had spent over eight hours organizing the filing system in his desk drawer but that doing so had not been as valuable as he had expected.」
   - 整齊有社會壓力：「All of the people with messy offices made remarks that could be construed as joking or defensive about their offices」
7. **分類體系會過時**。見 IMPLICATIONS → Finding → Creating Classifications（p. 108）。
   - 「He estimated that about 15 percent of his categories were obsolete and 15 percent more new categories should be added.」（單一受試者的自我估計。）
8. **歸檔的維度常和找的時候想到的維度不同**。見 Retrieving Information（p. 109）。
   - 「about one-third of the descriptions co-workers gave of documents for interviewees to find involved more than one dimension」
   - 「Furthermore, for about two-thirds of all the retrieval probes, the documents were not filed under the dimension(s) used in the description. For example, a document described by title and author was actually filed under the project to which it pertained.」（原文 OCR 作「fried」，是「filed」的 OCR 錯字。）
9. **對電腦系統的提醒功能建議**。見 Reminding（p. 109–110）。
   - 「At the very least, computer-based information systems should not unintentionally be designed in a way that prevents their users from relying on the system for performing this reminding function of desk organization.」
   - 依優先度用頻率、大小、位置、顏色提示；優先度隨時間自動變化；依日期與事件觸發提醒。頻率式提醒比桌面 pile 好的理由：「When things to be done are piled up on a desk, old things are covered up by new ones. With a frequency-based reminding system, even low priority items are guaranteed to appear occasionally.」
   - 作者也說這些是推想：「To design such systems well will require a better understanding of the subtleties of human scheduling, procrastination, and forgetting than is afforded by this study.」
10. **pile 形成的四種力量，以及會自我挫敗**。見 CONCLUSIONS（p. 110–111）。
    - 四種力量：(1) 建立有標籤資料夾的機械困難；(2) 建立類別與決定歸類的認知困難；(3) 想被提醒待辦事項；(4) 想讓常用資訊隨手可得。
    - 「Paradoxically, these forces can be self-defeating. As more and more information is stored in loosely characterized piles, it becomes harder and harder to find things, and items that were placed to be visible as reminders become covered up and no longer serve that purpose.」
    - 「these systems should continue to provide two of the functions of conventional desks: easy storage of loosely classified information and convenient use of visible reminders.」
11. **電子 pile 需要配套，否則一樣亂**。見 Classifying Information → Deferred classification（p. 108）。
    - 「These "electronic piles" should make the use of computer-based systems more natural. But without features like the automatic classification and reminding as discussed below, it could lead to computerized desks that are just as messy as some of their wooden counterparts.」
12. **工作類型與整齊度的關係很弱**。見 Differences Based on Job Content（p. 105）。
    - 兩位例行性紙本流程的人（採購專員、兼採購的秘書）桌面都整齊；8 位非例行性工作者一半整齊一半亂。
    - 「Aside from the possible difference in neatness, however, there seemed to be no consistent relationships in this study between the ways people organized their desks and the kinds of jobs they had.」

## 作者自己列的限制

- A Methodological Note（p. 101）：「This study is not, and is not intended to be, a controlled experiment or a large sample survey. The goal of data gathering here is to obtain qualitative insights and compelling examples, not statistical proof of a priori conjectures.」
- 「Even though the ten people I interviewed did not constitute a large enough sample upon which to base any confident statistical generalizations」
- probe 文件難度沒有對等：「no attempt was made to have the probes be of equal difficulty」；probe 也只做了 6 人。
- 「Clearly, a larger sample of people would be necessary to make any confident generalizations about the relationships between job content and desk organization.」
- 「(This claim seems eminently worthy of testing with a larger sample.)」
- 腳註 2：Michael 對例行流程的描述「may gloss over the work that is actually performed in individual instances」（引 Suchman）。

## 與摘要或常見轉述不一致的地方

- **常見轉述「Malone 把人分成 filers 和 pilers」不精確**。Malone 的 files／piles 是「整理單位」（Table I），每間辦公室兩者都有；他對人的分組是「neat」和「messy」（依自評分數）。「filers vs pilers」作為人的類型，是後來 Whittaker & Hirschberg 2001 等人的用法；Whittaker & Hirschberg 自己寫「Malone (1983) identified two basic strategies for handling paper: filing and piling」，轉述時已經往「策略／人」推了一步。
- 常說 Malone 主張「工作類型決定整理方式」：Malone 只說例行工作者「may be more common」整齊，並明說其他方面「no consistent relationships」。Whittaker & Hirschberg 2001 把這段寫成「Malone speculated that paper-handling strategies are a response to job requirements」，比原文更強。
- 「67% 的 pile 是待辦」：原文分母是「能判斷用途的 pile」，又是照片粗估。
- 「15% 的類別過時」是單一受試者的自我估計，不是全體結果。
- 摘要說提醒是「A very important function」，內文說「an equally important function」，兩者一致；摘要沒有數字，沒有數字衝突。

## 讀取紀錄

- 全文檔：531 行（`wc -l`）、41,326 字元（`wc -c`）。
- 用 Read 依序讀：第 1–270 行（標題、摘要、Introduction、Interviews、Methodological Note、Two Examples、Individual Differences、Differences Based on Job Content、Major Units 開頭）→ 第 271–532 行（Table I、Functions of Desk Organization、Evidence、Implications（Finding／Reminding）、Conclusions、Appendix、Acknowledgments、References）。兩段合計涵蓋第 1–532 行，就是全文。
- 另外，第一次用 Exa 抓同一份 PDF 時，工具輸出也回傳了完整全文，內容與存檔版相同。
- 頁碼：文字層保留了部分頁首（101、107、110、111、112），上面的頁碼用這些頁首推算，誤差在 ±1 頁內。
