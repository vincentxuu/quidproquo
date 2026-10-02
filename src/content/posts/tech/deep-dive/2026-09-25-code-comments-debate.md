---
title: "程式碼要不要寫註解：Clean Code、A Philosophy of Software Design 與 Redis 的三種答案"
date: 2026-09-25
type: deep-dive
category: tech
tags: [code-comments, clean-code, software-design, software-engineering, documentation, code-quality]
lang: zh-TW
tldr: "沒有「不寫註解」派，只有「預設不寫、例外才寫」（Uncle Bob）和「註解是設計的一部分」（Ousterhout、antirez）。兩人 2024–2025 的公開對談裡，雙方都同意 why 註解要寫、廢話註解不要寫；真正吵的是方法的介面註解、長名字能不能取代註解，以及該不該信任註解。實證研究的結論是看品質：同一批受試者，註解讓表現從下降 30% 到提升 34% 都有。"
description: "整理軟體工程裡的註解之爭：Robert Martin《Clean Code》的「註解是失敗」、John Ousterhout 的介面註解論、antirez 在 Redis 裡分出的九種註解，兩人公開對談的四個分歧點，實證研究的結果，以及 LLM 時代註解變成模型 context 之後的新變數。"
draft: false
glossary:
  - term: "self-documenting code"
    aliases: ["自我說明的程式碼", "自我描述程式碼"]
    definition: "主張透過好的命名、短函式與清楚的結構，讓程式碼本身就能說明它在做什麼，進而減少對註解的依賴。"
    context: "本文中「少註解派」的核心主張，代表人物是 Robert C. Martin。"
  - term: "interface comment"
    aliases: ["介面註解", "header comment", "函式註解"]
    definition: "寫在函式、類別或模組開頭，說明呼叫者需要知道的一切（參數限制、回傳值、副作用），讓人不必讀實作就能使用它。"
    context: "Ousterhout 認為沒有介面註解就做不到真正的抽象，這是他跟 Uncle Bob 分歧最大的地方。"
---

> 🌏 [English version](/posts/tech/deep-dive/2026-09-25-code-comments-debate-en)

「好的程式碼不需要註解」和「沒註解的程式碼沒人看得懂」，工程師大概都聽過這兩種說法。它們常被說成兩個流派，但把代表人物的原文找來讀，會發現沒有人主張完全不寫。真正的分歧是**預設值**：註解該是例外，還是設計的一部分？

這篇整理三份一手材料：[Robert C. Martin（Uncle Bob）](https://en.wikipedia.org/wiki/Robert_C._Martin)的《[Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)》、[John Ousterhout](https://web.stanford.edu/~ouster/) 的《[A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)》（以下簡稱 APOSD），以及 Redis 作者 [antirez 的註解分類文](https://antirez.com/news/124)。其中最有價值的是 Ousterhout 和 Martin 在 2024 年 9 月到 2025 年 2 月之間的[公開對談紀錄](https://github.com/johnousterhout/aposd-vs-clean-code)，兩人在同一份文件裡逐段交鋒，分歧點一目了然。

## 少註解派：Uncle Bob 與 self-documenting code

《Clean Code》第四章講註解。Ousterhout 在對談裡引了第 54 頁這段（Martin 回應時沒有否認引文）：

> The proper use of comments is to compensate for our failure to express ourselves in code. ... Comments are always failures.

Martin 的邏輯是：註解存在，是因為程式語言或寫程式的人沒能把意圖表達出來。如果有完美的程式語言，就不需要註解。所以他的做法是把註解「搬進程式碼」：用 `isLeastRelevantMultipleOfLargerPrimeFactor` 這種長名字取代「短名字加一段說明」。

他給的理由有兩個。第一，他不相信註解會被維護，程式改了、註解沒改，就變成錯誤資訊。第二，他不相信註解會被讀，很多 IDE 把註解塗成淡灰色，名字卻很難忽略。他自己把 IDE 的註解顏色設成亮紅色。

Martin 也強調，那一章開頭寫的是「Nothing can be quite so helpful as a well placed comment」。他說自己反對的是**多餘的**註解，而寫那章是為了矯正 1970–80 年代留下的習慣：當年寫組合語言和 FORTRAN 不寫註解真的看不懂，於是「寫註解」被當成無條件的好事。

## 多註解派：Ousterhout 的介面註解與 antirez 的九種註解

Ousterhout 給了兩個需要註解的理由。

**第一是抽象。** 一個方法要能「不讀程式碼就會用」，就需要一段介面註解說明呼叫者該知道的事。他拿 Martin 舉的 `addSongToLibrary(String title, String[] authors, int durationInSeconds)` 反駁：作者名字要照什麼格式？陣列順序有沒有意義？標題重複時是覆蓋還是並存？資料存在記憶體還是磁碟？簽名一個都回答不了。

**第二是非顯而易見的資訊。** 他用《Clean Code》裡的 `PrimeGenerator` 當例子：演算法從質數的平方開始標記倍數，這讓效能差好幾個數量級，但程式碼完全看不出原因。他說修課學生 30 分鐘內通常想不通，有註解的話幾分鐘就懂。

antirez 走得更遠。他從 Redis 原始碼歸納出九種註解：

| 類型 | 用途 | antirez 評價 |
|---|---|---|
| Function | 函式介面說明，讀完就能把實作當黑盒子 | 好 |
| Design | 檔案開頭說明演算法選擇與捨棄的方案 | 好 |
| Why | 程式碼在做什麼很清楚，但為什麼要這樣做不清楚 | 好 |
| Teacher | 教背後的領域知識（數學、資料結構） | 好 |
| Checklist | 「改這裡要記得也改那裡」 | 好 |
| Guide | 把程式碼分段、帶讀節奏 | 好（他自認最主觀） |
| Trivial | 讀註解跟讀程式碼一樣費力 | 壞 |
| Debt | TODO、FIXME、XXX | 盡量避免 |
| Backup | 註解掉的舊程式碼 | 壞 |

最有爭議的是 guide comment。像 `/* Free the query buffer */` 這種註解，確實沒有提供程式碼以外的資訊，正是《Clean Code》會叫你刪掉的那種。antirez 承認這一類最主觀，但他的論點是：註解的目的除了補資訊，還有**降低讀者需要記在腦中的東西**。他在 Lua stack API 的每一行後面標註當下 stack 的狀態，讀者就不用自己在腦中模擬。

## 中間路線：code 說 how，comment 說 why

Stack Overflow 共同創辦人 Jeff Atwood 2006 年寫的 [Code Tells You How, Comments Tell You Why](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/)，大概是業界最常被引用的折衷版本：先把程式碼改到盡量不需要註解，改不動了再寫；程式碼能說明「怎麼做」，只有註解能說明「為什麼」。

他引了 Jef Raskin 舉的例子：一段說明「為什麼選 Boyer-Moore 而不是二分搜尋」的註解，程式碼再乾淨也寫不出這種資訊。

## 真正吵的四件事

把對談從頭讀到尾，雙方**同意**的東西其實不少：why 註解要寫、公開 API 要有文件、`array_len++; /* 長度加一 */` 這種廢話不要寫、不要留註解掉的舊程式碼。分歧集中在四點：

**1. 團隊內部的方法要不要寫介面註解。** Martin 認為公開 API 或跨團隊的介面需要，但團隊內部熟悉系統，好的方法名和參數名通常就夠了。Ousterhout 認為這要求每個人把整個系統記在腦中，而他自己幾週前寫的程式碼就會忘。

**2. 長名字能不能取代註解。** Martin 偏好長名字，規則是作用範圍越小、名字越長。Ousterhout 覺得這種名字又長又難讀，而且名字寫不出 `primes[n]` 這種精確資訊。在同一個例子上，Martin 最後也承認有時註解比名字精確。

**3. 該不該信任註解。** 這是全篇分歧最大的一段。Martin 說他把每個註解都當成「潛在的錯誤資訊」，要回去對照程式碼。Ousterhout 的回應是：不信任介面註解，就得遞迴讀完每個被呼叫的方法，成本非常高。他估計缺註解的成本是錯誤註解的 10 到 100 倍，但這是他的個人經驗，不是量測數據。

**4. 讀者該花多少力氣。** Martin 用一張 ASCII 圖解釋質數演算法，說讀者「盯一陣子就會恍然大悟」。Ousterhout 的回應很直接：先受苦再頓悟適合希臘悲劇，不適合讀程式碼。他認為讀者的每個疑問都應該在程式碼或註解裡直接得到答案。

第四點其實是整場爭論的根：兩人對「好程式碼」的定義不同。Martin 要的是精簡、讀者願意花點力氣；Ousterhout 要的是**顯而易見**，讀者匆匆看過，第一個猜測就是對的。

## 實證研究怎麼說

有對照實驗，但結論比兩派都保守。

[Nielebock 等人 2018 年發表在 Empirical Software Engineering 的實驗](https://link.springer.com/article/10.1007/s10664-018-9664-z)找了 277 位受試者（多數是專業開發者）做小型程式任務。結論是：對小任務來說，註解的實際幫助比過去研究和受試者自己以為的小；受試者也認為好的命名比註解更有用，但同時強調某些情況一定需要註解。這比較接近 Martin 的立場，不過研究範圍限定在**小任務**。

[2026 年一篇眼動追蹤研究](https://link.springer.com/article/10.1007/s10664-025-10721-2)讓 20 名資工學生讀 12 段有註解和無註解的 Java 程式碼。註解對表現的影響依片段差異很大，從下降 30% 到提升 34% 都有。受試者普遍**覺得**註解有幫助，但這種感覺不一定反映在答對率和作答時間上。多數人先讀程式碼、再看註解。受試者是學生、片段也短，推到大型專案要保守。

兩篇合起來的訊息是：「越多越好」和「最好不寫」都站不住，效果取決於註解寫了什麼、放在哪種程式碼上。這也讓兩邊都有話說：Martin 可以說壞註解真的會拖慢人，Ousterhout 可以說好註解真的有用。

## LLM 時代多了一個讀者

以前註解的讀者只有人，現在 coding agent 也會讀。[一篇 2026 年 9 月、被 EMNLP 2026 Findings 接受的論文](https://arxiv.org/abs/2609.09242)測了註解對 LLM 寫程式的影響，結果跟人類研究的方向一致：註解多寡本身不影響通過率，重要的是內容對不對。把強模型「正確解法」的註解餵給弱模型，通過率平均提升 17.2%；換成其他題目的註解，通過率反而下降。

我的推論（論文沒有直接測這個）：當 agent 會把註解當成指示來讀，過期的註解不再只是浪費人類時間，而是可能讓 agent 照著錯的描述改程式碼。這同時強化了兩邊的論點：Martin 擔心註解過期是對的，Ousterhout 說介面和意圖一定要寫下來也是對的，因為 agent 沒辦法走過去問原作者。

## 實際上可以怎麼做

把兩派的共識和實證合起來，可以歸納成幾條動作：

- **寫之前先試著改程式碼。** 想寫「這段在算什麼」之前，先試試抽一個函式、換一個名字。改完還需要解釋，再寫。
- **why 一定寫。** 看起來可以更簡單、你卻刻意沒這樣寫的地方，寫一行說明原因。Redis `expire.c` 裡「為什麼 DB 計數器要在迴圈開頭加一」就是典型例子。
- **公開介面寫介面註解**，重點寫簽名表達不了的東西：前置條件、副作用、邊界情況。
- **改程式碼時順手看上面的註解。** code review 時把「註解還對不對」當成檢查項目，這比爭論要不要寫更實際。
- **TODO 定期清。** antirez 的建議是定期 grep，能修就修，修不了就搬到檔案開頭的 design comment。
- **不要留註解掉的程式碼**，有 git 就夠了。

guide comment 要不要寫，就交給團隊自己決定，這是連 antirez 都承認的主觀題。

## 參考資料

- [A Philosophy of Software Design vs Clean Code（Ousterhout × Martin 對談紀錄）](https://github.com/johnousterhout/aposd-vs-clean-code)
- [Writing system software: code comments — antirez](https://antirez.com/news/124)
- [Code Tells You How, Comments Tell You Why — Jeff Atwood, Coding Horror（2006）](https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/)
- [A Philosophy of Software Design — John Ousterhout](https://web.stanford.edu/~ouster/cgi-bin/aposd.php)
- [Clean Code: A Handbook of Agile Software Craftsmanship — Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Nielebock et al. (2018). Commenting source code: is it worth it for small programming tasks? Empirical Software Engineering](https://link.springer.com/article/10.1007/s10664-018-9664-z)
- [The Effect of Comments on Program Comprehension: An Eye-tracking Study. Empirical Software Engineering (2026)](https://link.springer.com/article/10.1007/s10664-025-10721-2)
- [Talking to Itself While Coding: What Makes Comments Help Code Generation? arXiv:2609.09242](https://arxiv.org/abs/2609.09242)
