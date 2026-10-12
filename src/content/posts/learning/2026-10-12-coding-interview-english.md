---
title: "寫程式面試怎麼邊寫邊講：確認題目、講解法、說複雜度、自己測的十四句"
date: 2026-10-12
category: learning
type: guide
tags: [english-speaking, english, speaking, language-learning]
lang: zh-TW
description: "寫程式面試要一邊解題一邊用英文說明。這篇從 Google 的示範面試影片、Meta 的官方準備指南、大學就業輔導的面試指引與 Tech Interview Handbook 整理出十四句：聽完題目怎麼確認、怎麼講最簡單的解法與複雜度、怎麼比較兩種做法、寫完怎麼自己測。六句是來源原句，八句依來源的句子改寫。"
tldr: "聽完題目先說 So you're looking for…? 再問 Is the input array sorted?；先講 The simplest solution is just…，接著說 I think that would be quadratic；兩種做法用 I could do this with…, or…；寫完說 Let me go through some examples to make sure this is correct。卡住時怎麼開口要提示，來源只有建議，沒有示範句。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-10-12-coding-interview-english-en)

前三篇面試口說（[通用句型](/posts/learning/2026-10-07-interview-experience-english)、[我自己的故事](/posts/learning/2026-10-07-interview-agent-stories-english)、[教材教了什麼](/posts/learning/2026-10-08-interview-english-from-teaching-materials)）處理的都是行為面試：自我介紹、講專案、反問。工程師面試還有一大段是當場寫程式，這一段我一句都沒練過。

## 我當時想說什麼

寫程式面試不是安靜把題目解完。[Meta 的官方準備指南](https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/)把這件事列在第一條：

> Think out loud. We pay a lot of attention to the way you solve problems, which can be as important as having the right answer.

所以我要練的是四個時間點的話：

1. 聽完題目，確認我沒有理解錯
2. 動手之前，講我打算怎麼解、為什麼
3. 寫的時候，講我在做什麼
4. 寫完之後，自己測一次

用中文我都講得出來，換成英文就只剩下 *um* 和很長的沉默。

這次讀了四類來源的正文：

- 雇主的官方示範：Google 的 [Example Coding/Engineering Interview](https://www.youtube.com/watch?v=XKu_SEDAykw) 影片，兩位 Google 工程師實際演一場面試。我讀的是自動字幕，大約讀到程式寫完、開始驗證的地方
- 雇主的官方指南：Meta Careers 的軟體工程師面試準備頁
- 大學的就業輔導：Northeastern University 的 [Interview Type: Technical](https://careers.northeastern.edu/resources/interview-type-technical/)，這一頁直接給了可以照著說的句子
- 軟體面試的社群資源：Tech Interview Handbook 的 [Coding interview cheatsheet](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/)

```youtube
url: https://www.youtube.com/watch?v=XKu_SEDAykw
title: Life at Google：Example Coding/Engineering Interview（Google 工程師示範一場寫程式面試）
```

語言教材這次一個都沒有。BBC、British Council 的面試單元教的是自我介紹和行為題，沒有寫程式面試的內容。

## 在這個情境可以怎麼說

### 一、聽完題目，先確認

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 所以你要找的是兩個加起來等於 8 的數字？ | So you're looking for a pair of numbers that add up to eight? | 改寫 |
| 我可以假設這些數字放在一個陣列裡嗎？ | Can I assume that they're in an array? | 改寫 |
| 輸入會有負數嗎？ | Does the input include negative numbers? | 原句 |
| 輸入的陣列有排序過嗎？ | Is the input array sorted? | 原句 |
| 要優先考慮速度還是記憶體？ | Do I need to optimize for speed or memory? | 原句 |

前兩句出自 Google 的示範面試。應徵者聽完題目後說的是 *I guess what I'm trying to figure out is, you're looking for a pair of numbers that add up to eight*，我把開頭換成 *So*。接著問 *can I assume that they're like in memory, an array or something*，面試官回答時也用同一個字：*you can assume they'll always be integers*。[Cambridge 的 assume](https://dictionary.cambridge.org/us/dictionary/english/assume) 定義是「沒有證據就先當成真的」，例句 *Let's assume that they're coming*。

*Is the input array sorted?* 是 Tech Interview Handbook 的原句，用途寫得很清楚：決定要用二分搜尋還是線性搜尋。它也要求至少問兩到三個問題：

> Do not jump into coding right away. Coding questions tend to be vague and underspecified on purpose to allow the interviewer to gauge the candidate's attention to detail and carefulness. Ask at least 2-3 clarifying questions.

負數和「速度還是記憶體」兩句是 Northeastern University 那一頁的原句。同一段還有 *Is it always valid input?* 和 *Is this meant to scale to millions of users?*。

### 二、動手之前，講解法與取捨

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 最簡單的解法就是把每一組可能的配對都比過一遍。 | The simplest solution is just comparing every single possible pair. | 改寫 |
| 我想那樣會是平方時間。 | I think that would be quadratic. | 改寫 |
| 我可以用雜湊表來快速查找，或是先排序再用二分搜尋。 | I could do this with a hash table for fast lookups, or sort the data and use binary search. | 原句 |
| 我會先把陣列排序，再用兩個指標。 | I'd approach this by first sorting the array, then using two pointers. | 改寫 |
| 可以的話，我想用 Python。 | I prefer Python, if that's okay. | 改寫 |

Google 示範面試的應徵者沒有直接跳到最好的解法。應徵者先說 *the simplest solution of course is just comparing every single possible pair*，自己評價 *that's obviously not very efficient*，再說 *I think that that would be quadratic*。我的卡片拿掉 *of course* 和重複的 *that*。

這裡有一個我原本不知道的習慣：**這位應徵者講複雜度時幾乎不唸 O 記號**。整段用的是 *quadratic*、*linear*、*an n log n solution*、*a constant time lookup*。

比較兩種做法的那一句是 Northeastern University 的原句，後面接的是 *I think hash table is simpler here because…*。同一頁給了講步驟的句型 *I'd approach this by first [step 1], then [step 2]. I'd do this because…*，排序和兩個指標是我自己填的內容。

選語言那句，示範面試裡面試官問 *what coding language would you prefer to do this in*，應徵者答 *I prefer C++ if that's okay*。我換成 Python。

### 三、寫的時候

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 我只需要掃過一次，所以是線性的解法。 | I just need to scan it one time, so it's a linear solution. | 改寫 |
| 確切的語法我不記得，但我記得它是這樣運作的。 | I don't know the exact syntax, but I remember it works like this. | 原句 |

第一句是面試官追問「為什麼這樣比二分搜尋快」時的回答。字幕上的原話是 *in this case I just need to do that moving, scanning the one time, so it's linear solution*，是邊想邊講的句子，我整理成完整的一句。

第二句是 Northeastern University 的原句，放在「不要硬撐」那一段，後面接 *Let me think through the logic…*。示範面試裡真的發生了這種事：應徵者忘了 C++ 的 unordered set 要用哪個方法加元素，直接說 *I don't remember, I think it's add for an unordered set… it's either add or insert or something*，然後繼續寫。

### 四、寫完之後，自己測

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 我跑幾個例子，確認這樣是對的。 | Let me go through some examples to make sure this is correct. | 改寫 |
| 如果輸入是空的，會發生什麼事？ | If the input is empty, what happens? | 原句 |

示範面試的應徵者寫完後說 *I feel like I probably need to go through an example… to make sure that this is correct*，接著說 *let me go through some examples to make sure*。我把兩句合成一句。後來也自己檢查了空輸入：*what happens with an empty…*。

Tech Interview Handbook 把這一步寫成規定：

> Once you are done coding, do not announce that you are done. Interviewers expect you to start scanning for mistakes and adding test cases to improve on your code.

Meta 的指南也有同樣的要求：*Find and fix the bugs by yourself. Don't wait for the interviewer to find them for you.*

## 也可以這樣說嗎

| 英文 | 對誰／做什麼時用 | 是否仍是同一個意思 |
| --- | --- | --- |
| Do I need to optimize for speed or memory? | 問面試官在意時間還是空間 | 主要說法 |
| Is this meant to scale to millions of users? | 問資料規模 | 不同：問的是規模，不是取捨（Northeastern 的原句） |
| I could do this with a hash table…, or sort the data… | 並列兩種做法 | 主要說法 |
| I could do X, but Y might be faster because… | 已經偏向其中一種 | 不同：帶了傾向和理由（Northeastern 的句型） |
| I don't know the exact syntax, but I remember it works like this. | 忘了寫法、記得用途 | 主要說法 |
| I haven't worked with that library before, but I'd approach it by… | 完全沒用過 | 不同：承認沒用過，再講做法（Northeastern 的原句） |

## 換內容再說一次

先看中文，自己說一次，再看參考說法。

1. 所以你要找的是清單裡最長的單字？
   - *So you're looking for the longest word in the list?*
2. 我可以假設它們已經排序了嗎？
   - *Can I assume that they're sorted?*
3. 輸入會有重複的值嗎？
   - *Does the input include duplicates?*
4. 最簡單的解法就是把每一個可能的子字串都檢查一遍。
   - *The simplest solution is just checking every single possible substring.*
5. 我會先數每個字母出現幾次，再比較次數。
   - *I'd approach this by first counting each letter, then comparing the counts.*
6. 我需要先排序，所以是 n log n 的解法。
   - *I need to sort it first, so it's an n log n solution.*
7. 如果輸入只有一個元素，會發生什麼事？
   - *If the input has only one element, what happens?*

這七句都是我把來源句子的內容換掉，不是來源原句。

## 一段短對話

以下是自己寫的練習示例，不是真實面試，也不是來源影片裡的對話。

> A: I'll give you a list of numbers and a target. Tell me if any two of the numbers add up to the target.
>
> B: So you're looking for a pair of numbers that add up to the target?
>
> A: That's right.
>
> B: Is the input array sorted? And does the input include negative numbers?
>
> A: It's not sorted, and yes, there can be negative numbers.
>
> B: The simplest solution is just comparing every single possible pair. I think that would be quadratic.
>
> A: Can we do better?
>
> B: I could do this with a hash table for fast lookups, or sort the data and use binary search.
>
> A: Let's go with the hash table.
>
> B: Let me go through some examples to make sure this is correct.

最後一句是寫完程式之後說的。*Can we do better?* 是 Tech Interview Handbook 提到面試官常用來要求改進解法的一句。

## 不看英文，你會怎麼說

自評的標準是能不能把意思說出來，不是字有沒有完全一樣。

| 中文情境 | 參考說法 |
| --- | --- |
| 用自己的話確認題目 | So you're looking for a pair of numbers that add up to eight? |
| 確認一個假設 | Can I assume that they're in an array? |
| 問有沒有負數 | Does the input include negative numbers? |
| 問有沒有排序 | Is the input array sorted? |
| 問要優先考慮什麼 | Do I need to optimize for speed or memory? |
| 先講最簡單的解法 | The simplest solution is just comparing every single possible pair. |
| 說它的複雜度 | I think that would be quadratic. |
| 並列兩種做法 | I could do this with a hash table for fast lookups, or sort the data and use binary search. |
| 講步驟 | I'd approach this by first sorting the array, then using two pointers. |
| 選語言 | I prefer Python, if that's okay. |
| 說明為什麼比較快 | I just need to scan it one time, so it's a linear solution. |
| 忘了語法 | I don't know the exact syntax, but I remember it works like this. |
| 寫完先自己驗 | Let me go through some examples to make sure this is correct. |
| 檢查空輸入 | If the input is empty, what happens? |

## 仍待核對

- **卡住時怎麼開口要提示。** Meta 的指南寫 *If you are stuck, ask questions*，Tech Interview Handbook 提醒面試官開口多半是在給提示，但這幾個來源都沒有示範要怎麼問。這次沒有做成卡片。
- **O 記號怎麼唸。** 示範面試裡的工程師用 *quadratic*、*linear* 這些字帶過。需要唸出 O(n) 的時候怎麼唸，我沒有找到來源。
- **自動字幕的準確度。** Google 影片的引句來自自動字幕，沒有標點，個別的字可能辨識錯。我沒有逐句對照影片的聲音。
- **英美差異。** 三個來源是美國的公司與大學，Tech Interview Handbook 是個人作者的社群資源；沒有英國的來源，也沒有一個來源說明用法的地區差異。
- **真實面試的逐字稿。** interviewing.io 有公開的模擬面試逐字稿，我只讀到搜尋結果裡的片段，沒有讀整頁，所以這次沒有拿來當依據。
- **還沒做的部分。** 被追問時怎麼接、怎麼爭取思考時間，寫在[下一篇](/posts/learning/2026-10-12-interview-thinking-time-english)；系統設計面試寫在[再下一篇](/posts/learning/2026-10-12-system-design-interview-english)。

## 整體來說

十四句裡六句是來源原句，八句是把來源的句子整理或換掉內容。最值得先練的是「確認題目」那五句，因為每一題都會用到，而且它們是問句，說出口之後對方會接話，不需要自己撐住整段。

這次和前幾篇最大的不同，是來源裡有一場完整的示範面試。它讓我看到一件教材沒寫的事：示範的那位工程師講話並不流暢，句子常常講到一半就重來，也當場承認忘了語法，但每一步在想什麼都說出來了。要練的是把想法說出口，不是把每一句說得漂亮。

依據方面，這次沒有任何語言教材，也沒有母語者測試或頻率比較。句子能不能用，根據的是一場官方示範面試、一份大學指引和一份社群手冊。

## 參考資料

- [Life at Google: How to: Work at Google — Example Coding/Engineering Interview](https://www.youtube.com/watch?v=XKu_SEDAykw)：示範面試的實際對話；確認題目、最簡單的解法、複雜度的說法、寫完自己測
- [Meta Careers: Preparing for your software engineering interview at Meta](https://www.metacareers.com/blog/preparing-for-your-software-engineering-interview-at-meta/)：邊想邊講、自己找 bug、卡住就發問的要求
- [Northeastern University: Interview Type: Technical](https://careers.northeastern.edu/resources/interview-type-technical/)：確認輸入、比較兩種做法、講步驟、忘了語法、檢查空輸入的句子
- [Tech Interview Handbook: Coding interview cheatsheet](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/)：確認題目的問題、寫完先自己檢查的要求
- [Cambridge Dictionary: assume](https://dictionary.cambridge.org/us/dictionary/english/assume)：assume 的定義與例句
