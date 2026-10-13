# 修改紀錄：ADL 2025 第 10 堂（依 rereview-lecture-10.md）

修改日期：2026-10-13。只改文章，未 commit。行號是複審報告的行號（zh、en 逐行對應）。

回來源查證的範圍：講義第 12、18、20、24、28 頁轉圖目視（110 dpi）；第 12 頁用 `pdfimages` 抽內嵌原圖；第 18、19 頁讀文字層；逐字稿 10.1 [21:50–22:29]、10.2 [08:00–10:44]、[16:01–16:29]、10.3 [01:00–01:16]、[12:01–12:17]。沒有查任何外部來源或論文。

## 已改

### R1 Telugu 數字（第 134 行）

- 依據：第 12 頁內嵌原圖最後兩列 Marathi 66.7%、Telugu 62.0%；第二到四列 Italian 84.1%、Afrikaans 84.1%、Spanish 84.0%。渲染頁面上 Telugu 那一列被標語蓋住。10.1 [22:14–22:25]「英文…85 左右 那最低的其實才 60 幾…差了 20 幾 percent」。85.5 − 62.0 = 23.5。報告屬實。
- zh 改前：英文是 85.5%，往下依序是義大利文、西班牙文等資料量大的語言，後段是資源少的語言，圖上看得到數字的最低一列 Marathi 是 66.7%（最後一列 Telugu 的數字被標語蓋住）。老師說最高和最低差了二十幾個百分點。
- zh 改後：英文是 85.5%，往下是義大利文、南非語、西班牙文等，後段是資源少的語言，最後兩列是 Marathi 66.7% 與 Telugu 62.0%。Telugu 那一列在頁面上被標語蓋住，62.0% 取自講義 PDF 內嵌的原圖。英文與 Telugu 相差 23.5 個百分點，老師說的是最低才六十幾、差了二十幾個百分點。
- en 改前：English is 85.5%, followed by languages with much data such as Italian and Spanish, with low-resource languages at the end; the lowest row with a visible number is Marathi at 66.7% (the number for the last row, Telugu, is covered by the callout). She says the highest and lowest differ by more than twenty percentage points.
- en 改後：English is 85.5%, followed by Italian, Afrikaans, Spanish and others, with low-resource languages at the end; the last two rows are Marathi at 66.7% and Telugu at 62.0%. The Telugu row is hidden behind the callout on the page, and 62.0% comes from the original image embedded in the deck's PDF. English and Telugu differ by 23.5 percentage points; she says the lowest is only sixty-something, a gap of twenty-odd points.

### R2 FactAlign 消融表（第 255 行）

- 依據：第 28 頁圖。表格第一列 86.51／79.59，與左側長條圖 Gemma-2B +FactAlign 的 F1@100 86.51、Precision 79.59 相同；「- Iterative Optimization」縮排一層，「- fKTO」再縮排一層；表格沒有標底座模型。10.3 [12:04–12:11]「不要 iterative 的 optimize 或是我們不要用這個…KTO…分數都會明顯的下降」。報告屬實。
- zh 改前：（表格沒有標明是哪個底座模型。）
- zh 改後：（表格沒有標明底座模型；第一列的兩個數字和左邊長條圖裡 Gemma-2B 加上 FactAlign 的數字相同。表格裡 fKTO 那一列比反覆最佳化那一列多縮排一層，講義沒有說明各列是分別拿掉一項，還是逐步累加拿掉；老師口述只說不做反覆最佳化或不用 fKTO，分數都會明顯下降。）
- en 改前：(The table does not say which base model it is for.)
- en 改後：(The table does not name its base model; the two numbers in its first row match Gemma-2B with FactAlign in the bar charts on the left. The fKTO row is indented one level deeper than the iterative-optimization row, and the deck does not say whether each row removes one component on its own or the removals accumulate; in class she only says that dropping iterative optimization or dropping fKTO both lower the scores clearly.)

### R3 第 24 頁的更正標記（第 214 行）

- 依據：第 24 頁圖。劃掉三處：「Electrical Engineering and」（下面沒有標字，留下 Computer Sciences）、「University of California, Berkeley」（下標 Carnegie Mellon University）、「Dan Klein」（下標 Alexander I. Rudnicky）。10.3 [01:06–01:08] 只提學校與 advisor。報告屬實。
- zh 改前：它把系所、畢業學校和指導教授都寫錯，投影片把錯的劃掉、在下面標上對的。
- zh 改後：它把畢業學校和指導教授寫錯，系所也多寫了一段；投影片把錯的劃掉，學校和指導教授下面標了對的。
- en 改前：the model gets her department, school, and advisor wrong, and the slide strikes out the errors and writes the correct ones beneath.
- en 改後：the model gets her school and advisor wrong and adds an extra part to her department; the slide strikes out the errors and writes the correct school and advisor beneath.

### R4 四層防護表格輸出層（第 182 行）

- 依據：10.2 [08:20–08:39] 講輸入分類時插了一段「產生了 然後去判斷…是不是 toxic 的」，[08:50–09:03] 接著說「第二個的問題就是它就會比較慢…額外的一個 model…delay」；[09:53–10:11] 正式講 output level 時沒有再提代價。報告屬實。第三層（[09:07–09:51]）維持「老師沒有談」。
- zh 改前：老師沒有談（輸出列）
- zh 改後：老師沒有另外談
- en 改前：Not discussed in class（Output 列）
- en 改後：Not discussed separately in class

### R5 controllable text generation（第 184 行）

- 依據：第 18 頁文字層在「Safeguards at the output level」底下有「Generate-then-classify」「Controllable text generation」；`pdftoppm` 轉出的頁面只有四個色塊標題，子項目看不到。10.2 [10:12–10:23]「或者是你也可以直接讓模型在 generate 的過程中…控制它 不要 sample 到一些我們認為不好的字」，老師沒有說出這個詞。報告屬實。
- zh 改前：輸出這一層底下，講義另外列了 controllable text generation：在生成的過程中控制抽樣，不要抽到不好的字。
- zh 改後：講完輸出層，老師接著提了另一種做法：在生成的過程中控制抽樣，不要抽到不好的字（講義文字層把它列在輸出這一層底下，叫 controllable text generation；轉成頁面後這一行看不到）。
- en 改前：Under the output level the deck also lists controllable text generation: control sampling during generation so that bad words are not sampled.
- en 改後：After the output level she mentions one more option: control sampling during generation so that bad words are not sampled (the deck's text layer lists it under the output level as controllable text generation; the line is not visible on the rendered page).

### R6 AutoDAN 的分數（第 199 行）

- 依據：第 20 頁圖 Fitness Eval 欄是 -17.1、-12.3、-15.6。10.2 [16:08–16:19]「有拒絕啊 還是沒有拒絕 然後就會有一些 evaluation 的…結果」。報告屬實。
- zh：在「看它有沒有拒絕，當作分數。」後加「投影片的圖上，這個分數是一個數值（例如 −17.1、−12.3）。」
- en：在 "and use whether it refuses as the score." 後加 "On the slide's figure this score is a number (for example −17.1 and −12.3)."

### 第二節附帶意見：自我檢查第 7 題（第 376 行，可選）

- 依據：題目與第 241 行「兩個門檻要怎麼合併使用，講義沒有寫明」的保留對齊；6 ÷ 8 = 0.75 > 0.6 不變。
- zh 改前：Precision 是多少？以 0.6 為門檻，它算 factual 嗎？
- zh 改後：Precision 是多少？只看 precision、以 0.6 為門檻，它算 factual 嗎？
- en 改前：What is the precision? With a threshold of 0.6, does it count as factual?
- en 改後：What is the precision? Looking at precision only, with a threshold of 0.6, does it count as factual?

### 第三節附帶意見：中文版 jailbreaking 定義省略 ethical（第 188 行，只改 zh）

- 依據：第 19 頁文字層「bypass a model's safety alignment and ethical safeguards」。英文版本來就有 ethical。
- zh 改前：繞過模型的安全對齊與防護
- zh 改後：繞過模型的安全對齊與倫理防護
- frontmatter 的 glossary 定義沒有動（報告沒有提到）。

### 任務書第 3 點：英文版「常見的誤解」說明句（第 337 行，只改 en）

- en 改前：These are my own summary, not points listed one by one in the lecture.
- en 改後：This list is my own summary, not something the lecture enumerated point by point.

## 不改

| 項目 | 理由與依據 |
|---|---|
| R7 範圍卡不存在 | 流程面，不是文章內容。 |
| 第一次報告 S10（第 41 行與第 427 行部分重複） | 兩份報告都判定不是違規、不算未修；第 427 行是來源區固定的「內容核對」行，第 41 行是正文開頭的取得方式說明，位置與用途不同。屬版面與流程面的整理，沒有動。 |
| 沒有舊版可 diff、沒有查外部來源、期末專題一節未驗證 | 流程面；任務規定只以逐字稿與講義為依據，沒有新增來源外的事實。 |

## 其他檢查

- 中文版「優化」：0 處。全文另掃了常見中國用語，沒有需要改的（第 82、241 行的「算法」是「計算方式」的意思，不是 algorithm；第 75 行「通過的機率」是「通過篩選」）。
- `**詞（說明）**` 後面直接接中文字的寫法：0 處（現有的粗體括號後面都接標點）。
- 英文版第一次提到講者是第 58 行 "Professor Chen starts with…"，在所有 she 之前，沒有改。
- `check-course-titles.mjs`：Course title gate: 0 issue(s)
- `check-course-guide-layout.mjs`：Course source layout: 0 issue(s)
