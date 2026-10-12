# coding-interview：寫程式面試口說的來源核對

核對日期：2026-10-12。文章：`src/content/posts/learning/2026-10-12-coding-interview-english.md`（與 `-en.md`）。

## 讀取工具

Groundlane 這個 session 沒有掛載（toolDegradation）。改用 Exa `web_search_exa`／`web_fetch_exa`，以及直接請求（curl 加瀏覽器 UA）把整頁存到暫存區後在本機擷取正文。

## 來源與讀取範圍

| 來源 | 類別 | 地區 | 讀取方式 | 讀到多少 |
| --- | --- | --- | --- | --- |
| [Life at Google: Example Coding/Engineering Interview](https://www.youtube.com/watch?v=XKu_SEDAykw) | 雇主的官方示範（實際對話） | 美 | Exa 抓影片自動字幕 | 前 14,000 字元，到第二個解法寫完、開始用例子驗證為止；**未讀到結尾**。自動字幕沒有標點、沒有標說話者，沒有對照聲音 |
| [Meta Careers: Preparing for your software engineering interview at Meta](https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/) | 雇主的官方指南 | 美 | Exa | 前 9,000 字元：技術初篩、寫程式面試整段、設計面試開頭；設計面試後半與行為面試**未讀** |
| [Northeastern University: Interview Type: Technical](https://careers.northeastern.edu/resources/interview-type-technical/) | 大學就業輔導 | 美 | curl，本機擷取 | 整頁正文（約 8,400 字元） |
| [Tech Interview Handbook: Coding interview cheatsheet](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/) | 軟體面試的社群資源（個人作者） | — | curl，本機擷取 | 整頁正文（約 12,500 字元） |
| [Tech Interview Handbook: Coding interview techniques](https://www.techinterviewhandbook.org/coding-interview-techniques/) | 同上 | — | Exa | 前 9,000 字元；有面試官的 *Can we do better*，沒有應徵者的示範句 |
| [Cambridge: assume](https://dictionary.cambridge.org/us/dictionary/english/assume)、[brute force](https://dictionary.cambridge.org/us/dictionary/english/brute-force)、[edge case](https://dictionary.cambridge.org/us/dictionary/english/edge-case) | 字典 | 英 | Exa | 各條目開頭的定義與例句 |

## 卡片對照

contextEvidenceType：direct＝來源的情境就是寫程式面試；adapted＝情境是自己套用的。這次所有來源的情境都是寫程式面試。

| 卡片 ID | 主答案 | 來源原句 | 表達 | 情境 | 未支持的部分 |
| --- | --- | --- | --- | --- | --- |
| interview-code-restate | So you're looking for a pair of numbers that add up to eight? | Google 字幕：*I guess what I'm trying to figure out is um you're looking for a pair of numbers that that add up to eight* | adapted | direct | 開頭的 So 是自己換的；字幕沒有標點，問句語氣是我判斷的 |
| interview-code-assume | Can I assume that they're in an array? | Google 字幕：*can I assume that they're like in memory um an array or something* | adapted | direct | — |
| interview-code-negatives | Does the input include negative numbers? | Northeastern：*“Does the input include negative numbers?”* | direct | direct | — |
| interview-code-sorted | Is the input array sorted? | TIH：*Is the input array sorted? (e.g. for deciding between binary / linear search)* | direct | direct | — |
| interview-code-optimize-for | Do I need to optimize for speed or memory? | Northeastern：*“Do I need to optimize for speed or memory?”* | direct | direct | 只有一份來源 |
| interview-code-simplest | The simplest solution is just comparing every single possible pair. | Google 字幕：*the simplest solution of course is just comparing every single possible pair* | adapted | direct | 拿掉 of course |
| interview-code-quadratic | I think that would be quadratic. | Google 字幕：*I think that that would be quadratic* | adapted | direct | 拿掉重複的 that |
| interview-code-tradeoff | I could do this with a hash table for fast lookups, or sort the data and use binary search. | Northeastern 原句，一字不差 | direct | direct | — |
| interview-code-approach | I'd approach this by first sorting the array, then using two pointers. | Northeastern 句型：*“I’d approach this by first [step 1], then [step 2]. I’d do this because…”* | adapted | direct | 步驟內容自填 |
| interview-code-language | I prefer Python, if that's okay. | Google 字幕：*I I prefer C++ if that's okay* | adapted | direct | 語言自換 |
| interview-code-linear | I just need to scan it one time, so it's a linear solution. | Google 字幕：*in this case I just need to do that moving scanning the one time so it's linear solution* | adapted | direct | 整理幅度最大的一句：拿掉 do that moving、補上 it 與冠詞 a |
| interview-code-syntax | I don't know the exact syntax, but I remember it works like this. | Northeastern 原句 | direct | direct | 只有一份來源 |
| interview-code-examples | Let me go through some examples to make sure this is correct. | Google 字幕：*I probably need to uh go through an example but anyway to make sure that this is correct* 與 *Let me let me go through through some examples to to make sure* | adapted | direct | 兩句合成一句 |
| interview-code-empty | If the input is empty, what happens? | Northeastern：*Test your code mentally as you write (“If the input is empty, what happens?”)* | direct | direct | 原文設定是在心裡測，不一定說出口 |

對話 `interview-coding` 是自寫的練習示例；面試官的 *Can we do better?* 出自 TIH（*your interviewer would most likely prompt you to optimize the solution by asking "Can we do better"*）。

## 仍待核對（沒有做成卡片）

- 卡住時要提示的說法：Meta、TIH 只有建議。
- O 記號的唸法：示範面試用 quadratic／linear／n log n 帶過。
- brute force、edge case 兩個詞：Cambridge 有收，但這次讀到的 Google 字幕段落裡應徵者沒有說這兩個詞，所以沒有做成主答案。
- interviewing.io 的模擬面試逐字稿：只讀到搜尋摘錄（**未讀整頁**），沒有當依據。
- 英美差異：沒有來源說明。

## 讀過後排除

搜尋結果裡有多個 2026 年發表、沒有署名或由工具廠商經營的「面試怎麼講」文章（coderslingo、geekblog、techscreen、phantomcodeai、interviewphantom、beyz、techinterview.org、dsa.handbook.academy）。它們列了大量句子，但屬於未署名的 SEO 文章，只當搜尋線索，沒有拿來當依據。
