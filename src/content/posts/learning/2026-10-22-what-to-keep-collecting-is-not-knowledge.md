---
title: "收什麼：收集不等於知識庫"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, personal-information-management, note-taking, collectors-fallacy]
lang: zh-TW
tldr: "決定一則資訊收不收，按順序問三句：說得出具體用途嗎、之後搜得回來嗎、寫得出一句自己的話嗎。說不出用途就不留；搜得回來的原文只留連結，搜不回來的存副本；寫得出那句話才進知識庫，寫不出就放進待讀清單。收件匣每週清空。背後的原因是：收不收有兩種錯，多收會把重要的東西淹沒，漏收之後要重找，只把門檻調鬆或調緊，只是把一種錯換成另一種。"
description: "知識庫怎麼建 order 1：收集者謬誤、把「要不要收」看成訊號偵測的兩種錯、收件匣與待讀清單，三步收錄判準與逐則示範，以及在 Readwise Reader、Obsidian、Notion 裡怎麼做。"
series:
  name: "知識庫怎麼建"
  order: 1
---

> 🌏 [English version](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge-en)

打開你的書籤、稍後閱讀清單，或 Notion 裡那個「待讀」資料庫。上一次從裡面拿東西出來用，是什麼時候？MIT 的研究團隊做過一個瀏覽器側邊欄筆記工具 List-it，分析 420 位使用者留下的 6 萬多則筆記，只有約五分之一曾經被搜尋找出來過（[Van Kleek et al. 2011](https://doi.org/10.1145/1978942.1979374)）。這個數字只算搜尋，不算在側邊欄直接看到的，所以不代表其他筆記都沒用；但它提醒我們，存進去的東西，多數不會被特地找回來。

這篇是「知識庫怎麼建」個人段的第一篇。[總覽](/posts/learning/2026-10-22-knowledge-base-three-readers)講過，知識庫要回答四個問題：收什麼、怎麼整理、怎麼找到、誰來維護。這篇只談第一個：怎麼分類留給 order 2，怎麼連結筆記留給 order 3，工具和長期維護在 order 4、5。讀完你會有一套三步判準，知道每則資訊該進知識庫、只留連結、放進待讀，還是刪掉，也會知道收件匣多久清一次。

## 存了不等於讀了

推廣 Zettelkasten 筆記法的網站 zettelkasten.de 在 2014 年替這個現象取了名字：[收集者謬誤（The Collector's Fallacy）](https://zettelkasten.de/posts/collectors-fallacy/)。作者的論點是，存下來的感覺本身就是一種獎勵，所以我們會一直存；但知道有某個東西，不等於懂這個東西：

> Why fallacy? Because 'to know about something' isn't the same as 'knowing something'.

他引用 Umberto Eco 在《如何撰寫論文》裡對影印的描述：學生影印了一疊文獻，就產生已經讀過的錯覺。書籤也一樣。這個說法有研究可以對照：AT&T 實驗室的 [Whittaker 和 Hirschberg](https://doi.org/10.1145/376929.376932) 趁一次辦公室搬遷清點員工的紙本檔案，發現其中 15% 從來沒讀過。

## 收不收，都可能犯錯

收了用不到的東西是一種錯，沒收到之後要用的是另一種錯。資訊科學家 [William Jones](https://firstmonday.org/ojs/index.php/fm/article/download/1123/1043?inline=1) 2004 年把這個決定類比成訊號偵測，也就是當年為了雷達判讀發展出來的理論：每次看到一則資訊，你都在判斷它是訊號還是雜訊。

| | 之後真的用到 | 之後用不到 |
|---|---|---|
| **收了** | 命中 | 多收：雜物變多，好東西更容易被蓋住 |
| **沒收** | 漏收：要花時間重找，或根本找不回來 | 正確略過 |

這個框架最有用的一點，是兩種錯互相牽制：

> The likelihood of a false positive is reduced only by increasing the likelihood of a miss, and vice versa.

把門檻調鬆或調緊，一種錯減少，另一種就增加。「什麼都存」是選擇多收，「盡量少存」是選擇漏收。要同時減少兩種錯，只能提高辨別能力：在收的那一刻更清楚這東西之後會怎麼用。下面的三步判準，就是在練這件事。

Jones 的同事 [Bruce](https://informationr.net/ir/10-3/paper232.html) 2005 年延伸這個框架，認為人通常往多收那邊偏：資訊在手上時，我們容易高估它；多收的代價（雜物增加、好資訊被蓋住）卻不容易察覺。這是理論推論，實際上因人而異。2019 年一份英國上班族問卷裡，不刪 email 的第一名理由是覺得「將來可能用得到」（[Neave et al. 2019](https://researchportal.northumbria.ac.uk/ws/portalfiles/portal/18627725/Neave.pdf)）；但 List-it 的使用者裡，人數最多的一群反而是寫完很快就刪的人。

所以與其相信「人一定會多收」，不如看看自己：翻一下過去一個月存的東西，數數存了幾則、回頭用了幾則。我的經驗法則是：用到的不到一成，你大概偏多收，下面第一步可以嚴格一點；常常想找某個東西卻發現當初沒存，你大概偏漏收，第二步可以多留一點副本。

## 收件匣：延後決定，但一定要回頭

收的那一刻常常判斷不了。常見的做法是延後：先丟進一個收件匣，之後再決定。

蘇黎世大學 2026 年的一項研究，給 29 位受試者（多半是學生和 IT 從業人員）一個瀏覽器擴充功能，讓他們把不確定之後用不用得到的網頁先丟進一個不分類的暫存區（[Rutishauser & Fritz 2026](https://doi.org/10.1145/3772318.3791979)）。在平均約兩週的研究期間裡，暫存區的網頁有 57% 被拿出來重新處理，大多是刪掉，少部分轉進正式的群組。另外 43% 在這段期間裡沒被處理。

延後的前提是一定會回頭。[Malone](https://doi.org/10.1145/357423.357430) 1983 年觀察辦公桌上的文件堆就看到，沒人清的堆會自己壞掉：堆得越多越難找，原本用來提醒的東西被新的蓋住。太早分類也可能有代價：Whittaker 和 Hirschberg 發現，桌上很少堆東西、習慣把文件歸檔的人，保留的紙本幾乎是堆放型的兩倍，過去一年翻閱過的比例卻比較低。作者提出的一個解釋是「過早歸檔」：在還不知道價值之前就歸檔，事後發現沒用，又因為花了力氣分類而捨不得丟。所以清收件匣時只做去留的決定，不急著分類。

清多快？方法書大多說一週一次。[GTD 每週回顧](https://gettingthingsdone.com/wp-content/uploads/2014/10/Weekly_Review_Checklist.pdf)的第二步是把收件匣清到零；[Tiago Forte](https://fortelabs.com/blog/basboverview/) 說他每週清一次，一次處理 10 到 20 則，只花幾分鐘；zettelkasten.de 的建議更短：收集一小時就停，處理完再收下一批。一週是這些作者的經驗，不是實驗比出來的，但可以當起點。

這裡要分清兩個地方。**收件匣**放「還沒決定」的東西，每週清空。**待讀清單**放「決定要讀、但還沒讀」的東西，它不必清空，但要有上限，例如超過兩週沒讀就刪。讀完之後，寫得出那句話就移進知識庫，寫不出就刪。兩個混在一起，收件匣永遠清不空。

## 三步判準

清收件匣時，每一則照順序問三句：第一步決定留不留，第二步決定原文怎麼留，第三步決定這則進知識庫還是待讀。也可以在存的當下就問；Forte 的做法是存的時候憑直覺，覺得有共鳴就先丟進收件匣，每週清的時候才判斷。

**第一步：說得出具體用途嗎？** 具體是指一個專案、一份手上的工作，或一個你正在想的問題。Forte 清收件匣時會依序問：這對哪個專案有用？對哪個長期負責的領域有用？屬於哪個感興趣的主題？三題都答不出才不收。這篇比 Forte 嚴格，只算前兩題：「這個主題很有趣」是好奇，不是用途，好奇的閱讀讀完就好。等你的知識庫已經養成每週清的習慣，再像 Forte 那樣放寬也不遲。**說不出用途，就不留。**

**第二步：之後搜得回來嗎？** Bruce、Jones 和 Dumais 請 12 位受試者在三到六個月後，回頭找自己預期會再去的網站。第一次就找到的情況裡，76% 用的方法根本不需要事先保存：直接打網址、用搜尋引擎、從別的網站連過去（[Bruce, Jones & Dumais 2004](https://informationr.net/ir/10-1/paper207.html)）。官方文件、維基百科條目這類穩定的頁面，**搜得回來，原文就只留連結**，不必另存一份。

但網頁會消失。Pew 研究中心 2024 年從 2013 到 2023 年每年各抽約 9 萬個網頁檢查：2013 年那一批，十年後有 38% 已經打不開，而且這是用最保守的標準算的（[Pew Research Center 2024](https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/)）。

連稍後閱讀服務本身也會消失。[Omnivore](https://github.com/omnivore-app/omnivore) 2024 年 10 月底宣布關閉雲端服務，使用者只有約一個月可以匯出；[Pocket](https://support.mozilla.org/en-US/kb/future-of-pocket) 2025 年 5 月宣布停止服務，匯出功能在 11 月關閉。個人部落格、社群貼文、活動頁、付費牆後面的文章，**搜不回來，就存一份摘要或副本**，不要只留連結。

**第三步：寫得出一句自己的話嗎？** 這是收集者謬誤給的處方：讀完、寫下自己的理解，才算進到知識庫。那句話可以是看法（「他們的平行化測試做法可以套用在我們的 e2e」），也可以是用法（「部署失敗時先跑這個指令看 log」）。會過時的東西，例如 API 用法、價格、規定，那句話裡寫上日期或版本。一項 25 人的小型研究發現，筆記抓到的重點越多，事後記得越多，筆記寫了多少則卻和記憶無關（[Kalnikaite & Whittaker 2007](http://www.elisevandenhoven.com/publications/lalanne-hci07wp.pdf)）。它測的不是「用自己的話寫」，但至少說明筆記多不等於有用；所以我建議與其多存，不如每則多寫一句。**寫得出來，進知識庫；寫不出來，代表還沒讀，放進待讀清單。**原文已經在第二步留了連結或副本，兩週後刪掉待讀項目，就是你判斷它不值得讀，不是不小心弄丟。

## 例子：一週的六則收藏，逐則判斷

| 這週存的 | 第一步：用途 | 第二步：搜得回來？ | 第三步：寫下的那句話 | 去處 |
|---|---|---|---|---|
| 金流服務的 webhook 官方文件 | 這週要串金流 | 是，官方文件：只留連結 | 「簽章驗證要用 v2 的 header，2026-10」 | 進知識庫（「金流串接」筆記裡一行加連結） |
| 同事分享的部落格文章〈我們怎麼把 CI 從 40 分鐘降到 8 分鐘〉 | 我們的 CI 也太慢 | 個人部落格，可能消失：存摘要 | 「測試平行化的做法可以套用在我們的 e2e，2026-10」 | 進知識庫 |
| 社群貼文：一個 git 指令技巧 | 每天開分支都用得到 | 很難再搜到：存下指令 | 「同時開兩個分支用 git worktree，不必 stash」 | 進知識庫 |
| 90 分鐘的研討會演講影片 | 跟團隊明年規劃有關 | 是，影片平台搜得到：留連結 | 還寫不出，沒看 | 待讀清單，兩週內沒看就刪 |
| 〈2026 十大 AI 工具〉清單文 | 說不出 | — | — | 刪 |
| 一篇講羅馬水道歷史的長文 | 純好奇 | — | — | 讀完就好，不收 |

六則裡進知識庫的是三則，各附一句自己的話，其中一則的原文只留連結；一則進待讀，兩則不收。

## 搜尋和 AI 這麼強，還需要篩嗎？

**「反正全文搜尋和 AI 問答都找得到，存多一點沒關係。」** 找得到和讀過是兩回事，收集者謬誤講的是後者。而且當你開始讓 AI 讀自己的筆記，收進來的雜訊會被拿去回答你。Deakin 大學的 [Barnett 等人](https://arxiv.org/abs/2401.05856)整理 RAG 系統的失敗點時，有一類是答案明明在模型拿到的內容裡，卻因為內容太雜或互相矛盾而沒被抽出來。過時的舊筆記和彼此矛盾的版本，很可能就是這種雜訊。AI 段會再談這件事。

**「AI 幫我寫的摘要，算不算那一句話？」** 不算。那句話的作用是逼你讀懂，AI 摘要跳過的正是這一步。有一項研究的方向和這個一致，雖然它測的不是筆記：[Melumad 和 Yun](https://doi.org/10.1093/pnasnexus/pgaf316) 2025 年做了七個實驗、超過一萬人，請受試者學一個主題後寫建議給朋友。用 ChatGPT 學的人，比自己用 Google 搜尋的人自評學得較淺，寫出的建議也較短、彼此較相似；就算兩組拿到的資訊完全相同、只改呈現方式，差異仍然存在。用 AI 整理筆記能做什麼、不能做什麼，留給 order 5。

## 在工具裡怎麼做

| 工具 | 收件匣放哪 | 待讀清單放哪 | 那句話寫在哪 | 不留的東西 |
|---|---|---|---|---|
| [Readwise Reader](https://docs.readwise.io/reader/guides/workflows/library-configuration) | 預設的 Triage 配置就是 Inbox → Later → Archive，新存的東西進 Inbox | Later | 劃線可同步到 Obsidian 或 Notion，在那邊的筆記裡寫；同步是單向追加，在一邊改了不會更新另一邊 | 刪除 |
| [Obsidian Web Clipper](https://obsidian.md/help/web-clipper) | 在模板設一個收件匣資料夾，剪下來的筆記都進那裡 | 另開一個「待讀」資料夾 | 筆記開頭；properties 可以加一個「用途」欄位 | 刪除筆記。剪下來的圖片預設只存原網址，要長期保存得另外下載 |
| [Notion Web Clipper](https://www.notion.com/help/web-clipper) | 存進一個「收件匣」資料庫，會自動帶 URL 欄位 | 同一個資料庫加「狀態」欄位，篩出「待讀」 | 剪完後在資料庫加「用途」「一句話」欄位；剪的當下不能加標籤 | 刪除頁面 |

不管用哪個工具，劃線和截圖也一樣套三步：劃了很多線不等於寫了那一句話。工具本身也可能消失，所以每季把知識庫匯出一次，存成自己能打開的格式。

## 研究的限制

這篇引用的研究，大多是 email、書籤和紙本檔案的研究，樣本常只有十幾到幾十人。它們談的是「收了之後找不找得到」，沒有人直接測過 Notion、Obsidian 裡的收錄判準。三步判準是根據這些研究整理出的做法，不是實驗驗證過的流程。另外，如果整理檔案讓你非常痛苦、怎麼都刪不下手，那可能是數位囤積，研究者對它的定義還沒有共識（[Bravo-Adasme et al. 2026](https://www.nature.com/articles/s41599-026-07263-3)），也不是換一套筆記方法能解決的。

## 今晚可以做的事

1. **只留一個收件匣，另開一個待讀清單。** 書籤、稍後閱讀、傳給自己的訊息，選一個當唯一入口。
2. **數一次自己的收藏。** 過去一個月存了幾則、用了幾則，決定第一步要嚴格還是寬鬆。
3. **在行事曆排每週 20 分鐘。** 照三步清空收件匣：每則決定進知識庫、只留連結、進待讀，或刪掉。
4. **每季匯出一次。** 不管用哪個工具。

## 自我檢查

**問：** 你請 AI 幫你把一篇 30 頁的論文摘要成五點，看起來很有用。這五點要直接存進知識庫嗎？

**判準：** 照三步走。第一步，說得出用途嗎？說不出就不留，摘要寫得再好也一樣。第二步，論文本身搜得回來嗎？通常搜得回來，所以原文只留連結。第三步才是關鍵：那五點是 AI 的話，不是你的。讀完摘要（必要時回去讀原文的相關段落），寫出一句你自己的話，例如「這篇的方法可以解決我們的 X，但樣本只有學生」，才進知識庫；寫不出來，就放進待讀清單。

## 參考資料

- [Van Kleek, Styke, schraefel & Karger 2011, Finders/Keepers: A Longitudinal Study of People Managing Information Scraps in a Micro-note Tool (CHI 2011)](https://doi.org/10.1145/1978942.1979374)
- [zettelkasten.de, The Collector's Fallacy (2014)](https://zettelkasten.de/posts/collectors-fallacy/)
- [Whittaker & Hirschberg 2001, The character, value, and management of personal paper archives (ACM TOCHI)](https://doi.org/10.1145/376929.376932)
- [Jones 2004, Finders, keepers? The present and future perfect in support of personal information management (First Monday 9(3))](https://firstmonday.org/ojs/index.php/fm/article/download/1123/1043?inline=1)
- [Bruce 2005, Personal, anticipated information need (Information Research 10(3))](https://informationr.net/ir/10-3/paper232.html)
- [Neave et al. 2019, Digital hoarding behaviours: Measurement and evaluation (Computers in Human Behavior)](https://researchportal.northumbria.ac.uk/ws/portalfiles/portal/18627725/Neave.pdf)
- [Rutishauser & Fritz 2026, From Tabs to Structures: Understanding and Supporting Web Page Management (CHI 2026)](https://doi.org/10.1145/3772318.3791979)
- [Malone 1983, How do people organize their desks? (ACM TOIS)](https://doi.org/10.1145/357423.357430)
- [GTD Weekly Review Checklist (David Allen Company)](https://gettingthingsdone.com/wp-content/uploads/2014/10/Weekly_Review_Checklist.pdf)
- [Tiago Forte, Building a Second Brain: The Definitive Introductory Guide](https://fortelabs.com/blog/basboverview/)
- [Bruce, Jones & Dumais 2004, Information behaviour that keeps found things found (Information Research 10(1))](https://informationr.net/ir/10-1/paper207.html)
- [Pew Research Center 2024, When Online Content Disappears](https://www.pewresearch.org/data-labs/2024/05/17/when-online-content-disappears/)
- [Omnivore（GitHub README：雲端服務於 2024 年 11 月停止）](https://github.com/omnivore-app/omnivore)
- [Mozilla Support, The future of Pocket](https://support.mozilla.org/en-US/kb/future-of-pocket)
- [Kalnikaite & Whittaker 2007, Does Taking Notes Help You Remember Better? Exploring How Note Taking Relates to Memory (MeMos 2007 workshop proceedings)](http://www.elisevandenhoven.com/publications/lalanne-hci07wp.pdf)
- [Barnett et al. 2024, Seven Failure Points When Engineering a Retrieval Augmented Generation System (arXiv:2401.05856)](https://arxiv.org/abs/2401.05856)
- [Melumad & Yun 2025, Experimental evidence of the effects of large language models versus web search on depth of learning (PNAS Nexus)](https://doi.org/10.1093/pnasnexus/pgaf316)
- [Readwise Reader 說明：Library configuration](https://docs.readwise.io/reader/guides/workflows/library-configuration)
- [Obsidian Help：Web Clipper](https://obsidian.md/help/web-clipper)
- [Notion Help：Save web pages with Notion Web Clipper](https://www.notion.com/help/web-clipper)
- [Bravo-Adasme et al. 2026, digital hoarding scoping review (Humanities and Social Sciences Communications)](https://www.nature.com/articles/s41599-026-07263-3)
