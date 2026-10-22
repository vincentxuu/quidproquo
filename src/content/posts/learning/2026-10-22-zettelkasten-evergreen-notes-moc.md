---
title: "怎麼連：Zettelkasten、Evergreen notes 與 MOC"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, note-taking, zettelkasten, evergreen-notes]
lang: zh-TW
tldr: "讀完這篇，你能把一篇讀書摘要改寫成兩三則可以互相連結的筆記，並在筆記多起來時建一張地圖筆記（MOC）。做法歸成四個原則：一則筆記只講一個概念、依概念不依書寫、用自己的話寫、每條連結寫出為什麼連。這套做法源自 Luhmann 的卡片盒；研究支持「自己產生比只讀記得牢」，但我找不到可信的對照實驗測過 Zettelkasten 本身。"
description: "知識庫怎麼建 order 3：文獻筆記和永久筆記的差別、Luhmann 卡片盒原本怎麼運作、四個原則、structure note 與 MOC、從一篇論文到一張地圖的完整示範、研究能支持到哪裡，以及 Obsidian 反向連結和 AI 建議的連結算不算數。"
series:
  name: "知識庫怎麼建"
  order: 3
---

> 🌏 [English version](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc-en)

存了幾年的筆記，回頭看大多是摘要和劃線：這本書講了什麼、那篇文章的重點。它們找得到，但從來沒有幫你想出新東西。

[order 2](/posts/learning/2026-10-22-para-johnny-decimal-folders) 談的是筆記放在哪個資料夾，結尾留了一個問題：「小川山的岩場筆記」既是攀岩技術，又和明年的旅行計畫有關，資料夾只能讓它住一個地方。這篇談的就是另一半：筆記和筆記之間怎麼連起來。兩者可以並用：資料夾決定一則筆記住在哪，連結決定它和誰有關。用 PARA 的人，想法筆記可以放在 Resources；用 Johnny.Decimal 的人，可以開一個專門放想法筆記的 category。

小川山那則本身是參考資料，不必改寫成下面要講的永久筆記。它留在攀岩技術底下就好，再從旅行計畫的筆記連過去，寫一句「明年去之前要先讀，裡面有岩場的接近路線」。一則筆記住在一個地方，靠一條寫了理由的連結出現在另一個脈絡裡，這就是這篇要講的事。

讀完你能把一段讀書摘要改寫成兩三則可以互相連結的筆記，並在筆記多起來時建一張把它們串起來的地圖筆記。

## 先分清兩種筆記

這篇會用到兩個詞：

- **文獻筆記**：讀的時候記下來的，這本書或這篇文章說了什麼、出處在哪。它離不開原文，脫離了原文常常看不懂。
- **永久筆記**：從文獻筆記改寫出來的，一則只講一個你自己的主張，用你自己的話寫，脫離原文也讀得懂。

我自己的筆記，大多也停在第一種。這篇講的方法，都是在幫你把第一種變成第二種，再把第二種連起來。

## Luhmann 的卡片盒原本怎麼運作

這套做法的源頭是德國社會學家 Niklas Luhmann。依 Luhmann 檔案館的整理，他從 1952 年到 1997 年初累積了約 9 萬張卡片，幾乎全是手寫（[Niklas Luhmann-Archiv](https://niklas-luhmann-archiv.de/nachlass/zettelkasten)）。他在 1981 年的文章〈與卡片盒溝通〉裡說明了做法（[Luhmann, Communicating with Slip Boxes](https://luhmann.surge.sh/communicating-with-slip-boxes)），重點有四個：

**1. 固定位置，不依主題排序。** Luhmann 說最重要的決定，是不照主題和子主題排卡片，而是給每張卡一個固定的位置。每張卡一個號碼，寫上去就不再改。

**2. 分支可以長在任何地方。** 新想法不必加在最後。卡片 57/12 之後可以接 57/13；想接在 57/12 的某個詞上，就編 57/12a；再往內是 57/12a1。檔案館說，極端時號碼長到十幾碼，兩張原本相鄰的卡之間插了幾百張。

**3. 卡片之間寫連結，常常雙向都記。** 因為號碼固定，任何一張卡都可以寫上「見某號」。Luhmann 建議連結時，順手在被連的那張卡上也記一筆回連；檔案館也發現，遠距的連結常常有回連。他說有了連結，一張新卡放在哪裡就沒那麼要緊了。檔案館的抽樣估計，兩個盒子合計有四萬多條連結。

**4. 索引只記入口。** 他另外維護一份關鍵字索引，但每個關鍵字通常最多只列 4 個位置，因為從入口進去之後，可以沿著連結走到相關的卡片。

另外兩件事常被省略。第一，Luhmann 並非完全不分類：第一個盒子有 108 個主題區，第二個盒子有 11 個大區，只是區內不照嚴格的階層排。第二，這套系統要等很久才開始有用。Luhmann 說卡片盒要好幾年才會累積到臨界量，在那之前，它只是一個放進什麼就拿出什麼的容器。

## 四個原則

推廣者把 Luhmann 的做法改寫成數位版。[zettelkasten.de](https://zettelkasten.de/introduction/) 的入門文和 Andy Matuschak 的 [Evergreen notes](https://notes.andymatuschak.org/Evergreen_notes) 最常被引用，兩者大同小異。整理起來是四個原則：

**一則筆記只講一個概念。** Matuschak 稱為 [atomic](https://notes.andymatuschak.org/zNUaiGAXp21eorsER1Jm9yU)：只講一件事，但盡量把那件事講完整。重點不在短。太大，新想法來時你不會發現它該接在哪；太碎，連結也跟著碎。他自己也說沒有一刀切的標準，只有取捨。

**依概念寫，不依書或專案寫。** 讀一本書寫一則「這本書的筆記」，同一個概念會散在好幾本書的筆記裡，Matuschak 說這樣[不會累積](https://notes.andymatuschak.org/z2hQEhqWkdRLL9JUwfawZZx)。依概念寫，第二本書講到同一件事時，你會回到同一則筆記補充或修正。

**用自己的話寫。** zettelkasten.de 把這列為核心規則之一。直接貼原文是摘錄，是文獻筆記，不是永久筆記。

**每條連結寫出為什麼連。** 這是我最常跳過的一點。zettelkasten.de 稱之為連結脈絡（link context）：每條連結都要明說為什麼連。只放一個連結、不寫理由，幾個月後你自己也看不懂為什麼連。寫成「這和〈收件匣每週清空〉衝突，因為⋯⋯」，連結本身就成了一個想法。

Matuschak 還主張連結要多，而且[讓結構自己長出來](https://notes.andymatuschak.org/z8SU3r8xyZyvwRhyDdJasJ2)，不要一開始就先定好分類。這聽起來和下面要講的「用一張筆記把相關筆記排起來」相反，其實是先後的問題：先寫、先連，等某一群筆記多到看得出形狀，再替它們畫地圖。

## Structure note 與 MOC：替連結畫一張地圖

筆記連多了，需要有地方把一群相關筆記排起來。zettelkasten.de 叫它 structure note，也就是一則專門講其他筆記和它們之間關係的筆記，並認為某種程度的階層結構很有用。

Linking Your Thinking 的 Nick Milo 叫它 MOC（Map of Content），強調它不只是一份目錄，而是思考的工具（[LYT](https://blog.linkingyourthinking.com/notes/mocs-(defn))）。什麼時候建一張？Milo 沒有給數量門檻，給的是一種感覺：某個主題的筆記多到讓你開始不安、怕想法散掉，他稱為 Mental Squeeze Point。

他的建法分三步。先把相關筆記的連結全丟進一張新筆記（gather）。再重排、合併、拆開，在過程中寫出新的筆記（collide）。最後把這張地圖接到其他地圖，之後從這裡進入整個主題（navigate）。他提醒這三步不是線性的。

這個概念 Luhmann 就有。檔案館記錄了他的匯總卡，一張列了最多 25 個連結，zettelkasten.de 也把 structure note 追溯到這裡。數位工具讓它更容易做，但概念是同一個。

## 例子：從一篇論文到一張地圖

假設你讀了 order 2 引用的那篇資料夾研究（[Bergman 等人 2010](https://doi.org/10.1002/asi.21415)）。

**第一步：文獻筆記。** 讀的時候照常寫，記下這篇講了什麼、出處在哪：

```text
Bergman et al. 2010, JASIST
- 296 人在自己電腦上找最近用過的檔案，94% 找到，約 15 秒
- 2 到 6 層找檔時間差不多，7 層以上明顯變慢
- 作者建議：資料夾超過約 21 項（含子資料夾）再開一層，這是從係數推出來的經驗法則
- 限制：只測最近用過的檔案
```

**第二步：改寫成兩則永久筆記。** 每則只講一個概念，用自己的話，標題就是那個主張：

```text
# 資料夾樹別深到七層以上
找最近用過的檔案時，兩到六層的速度差不多，七層以上才明顯變慢。
所以不必為了「層數少」硬塞，但也別一路往下開。
我的筆記庫最深到六層，還在可接受的範圍，但值得檢查是不是都有在用。
限制：只測最近用過的檔案，很久沒開的舊檔不知道。
來源：Bergman et al. 2010
```

```text
# 自己放的檔案靠位置找，email 靠捲動和搜尋
自己建的檔案，多數人靠點資料夾找；搜尋工具變好也沒改變這件事。
email 不一樣：信量大，人整理信箱主要是為了管待辦，找信時多半直接捲動或搜尋。
來源：Bergman et al. 2008、Whittaker et al. 2011
```

第二則用了兩篇來源：依概念寫，就會把不同來源講到同一件事的地方收在一起。

**第三步：連到舊筆記，寫出理由。** 例如在第二則底下加：

```text
- 連到〈Johnny.Decimal 用編號固定位置〉：固定位置正好利用了
  「自己放的東西靠記得位置找」這一點。
- 連到〈過早歸檔〉：兩者都提醒我，整理常常是為了清空眼前，
  不是為了之後好找。
```

**第四步：等筆記多了，建一張 MOC。** 當你關於「怎麼整理個人知識庫」的筆記多到開始覺得亂，就建一張：

```text
# 個人知識庫怎麼整理 MOC
## 收什麼
- 收件匣每週清空
- 存了不等於讀了
## 放哪裡
- 資料夾樹別深到七層以上
- 自己放的檔案靠位置找，email 靠捲動和搜尋
- Johnny.Decimal 用編號固定位置
## 還沒想清楚的
- 標籤只標狀態，夠用嗎？
```

最後那一節「還沒想清楚的」很重要：MOC 除了整理已經有的，也是列出下一步要想什麼的地方。

## 研究支持到哪裡

**「用自己的話寫」有間接支持。** 記憶研究裡有一個穩定的現象叫生成效應：自己產生的答案，比只讀過的記得牢。Bertsch 等人 2007 年整合 86 篇研究，自己產生的平均多記住約 9 個百分點（[Bertsch et al. 2007](https://doi.org/10.3758/BF03193441)）；McCurdy 等人 2020 年整合 126 篇、校正出版偏誤後，效應仍然存在（[McCurdy et al. 2020](https://doi.org/10.3758/s13423-020-01762-3)）。它支持「自己動手產生比只讀好」這個方向。限制是，受試者在實驗室裡填一個詞、解一道題，不是寫筆記；材料沒有意義時效應接近零；用寫或打字產生的效應比用口說的小。所以它不能直接證明寫永久筆記有同樣的效果。直接研究做筆記的也沒有比較清楚：一項重做手寫筆記實驗的研究發現，「用自己的話記」和考試成績的關係並不穩定，作者也提醒那只是相關（[Urry et al. 2021](https://doi.org/10.1177/0956797620965541)）。

**連結的研究，有證據的是「標清楚連到哪裡」。** DeStefano 和 LeFevre 2007 年回顧超文本閱讀研究：連結數量的影響各研究不一致；加上橫向的語意連結，五篇裡有四篇讓讀者找資訊變慢；但標示了目的地內容的連結有幫助（[DeStefano & LeFevre 2007](https://doi.org/10.1016/j.chb.2005.08.012)）。Madrid 等人 2009 年比較每頁 3 個和 8 個連結，多出來的 5 個是隨機抽的，認知負荷和學習成績都沒有差別（[Madrid et al. 2009](https://doi.org/10.1016/j.chb.2008.06.005)）。這些研究的受試者都是在讀別人做好的超文本，而且只讀一次，不是經營自己的筆記庫。能帶走的是：讓連結說清楚它通往什麼，這和「寫出連結理由」的方向一致。

**Zettelkasten 本身，我找不到可信的對照實驗。** 我搜尋了 2024 到 2026 年的英文文獻，沒有找到拿 Zettelkasten、原子筆記或 MOC 和其他做法比較的可信實驗。有一篇 2023 年自稱比較 Zettelkasten 的研究，但兩組的條件差太多，表格數字也對不上，不能當證據。比較有沒有雙向連結功能的實驗，我只找到一篇 2009 年在書目資料庫做的，雙向連結只提高了受試者的自評信心，完成任務的時間沒有差別（[Alford & Mendes 2009](https://doi.org/10.1145/1557914.1557934)）。2025 年一項訪談 7 位用 Obsidian 的研究者的研究，受訪者日常主要靠資料夾、標籤和搜尋，幾乎沒有談到筆記之間的連結（[Ferreira et al. 2025](https://arxiv.org/abs/2509.20187)）。

## Obsidian 的反向連結、AI 建議的連結，算不算數？

**反向連結不等於寫了理由。** Obsidian、Notion 這類工具會自動列出「哪些筆記連到這裡」。這省掉了 Luhmann 手寫回連的工夫，但它只告訴你誰連過來，不告訴你為什麼。理由還是要寫在連結那一側。數位工具也不需要 Luhmann 那種手編號碼，工具本身就能連到任何一則筆記。

**AI 建議的連結，可以當線索，不要直接收下。** 有些工具會自動建議相關筆記。它們能幫你發現沒想到的關聯，但「為什麼相關」那一句如果是 AI 寫的，就和 [order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge) 說的 AI 摘要一樣，跳過了你自己想的那一步。用 AI 整理筆記能做什麼、不能做什麼，留給 order 5。

## 什麼時候不需要這些

Luhmann 檔案館的說法是，卡片盒首先可能是他的思考工具，累積到臨界量之後，才越來越像一台寫出書和論文的機器。zettelkasten.de 提到他出版了 50 本書和超過 600 篇文章，但也在註腳說，Luhmann 本來就是工作狂，產量不只是卡片盒的功勞。如果你的筆記主要是待辦、會議紀錄、參考資料，order 2 的資料夾加搜尋就夠了，不必把每則都改寫成永久筆記。

這套做法也很花時間，前幾年卡片盒只是容器，Luhmann 自己也這樣說。另一個常見的卡關是想寫得太完美：Matuschak 承認，寫筆記時如果一心想寫成可以發表的樣子，他常常一個字都寫不出來，所以他主張[預設寫給自己看](https://notes.andymatuschak.org/zXDPrYcxUSZbF5M8vM5Y1U9)。

所以建議從小處開始：不必改寫舊筆記，從今天起新寫的筆記，每條連結都寫一句理由；等某個主題的筆記多到覺得亂，再建第一張 MOC。

## 今晚可以做的事

1. **挑一則最近的讀書摘要。** 從裡面找出一個你同意或不同意的主張，改寫成一則標題就是主張的永久筆記。
2. **給它找一則舊筆記連過去。** 寫一句為什麼連：補充、衝突，還是舉例。
3. **檢查你的連結有沒有寫理由。** 隨便翻五則有連結的筆記，看幾個月前的自己有沒有交代為什麼連。
4. **找出筆記最多的主題，問自己亂不亂。** 已經覺得亂，就照 gather、collide 兩步建一張 MOC，最後加一節「還沒想清楚的」；還不亂，就先不用。

## 自我檢查

**問：** 把書裡一段話原封不動貼進一則筆記，再連到三則相關筆記，這算永久筆記嗎？

**判準：** 不算。永久筆記有兩個條件：用自己的話寫，以及脫離原文也讀得懂。原文段落兩個都不符合：它是作者的話，而且通常要看前後文才懂。連結再多也補不了這一點，何況沒寫理由的連結本身也不算想法。把那段話改寫成一句你自己的主張，例如「這段說的其實是⋯⋯，跟我之前認為的⋯⋯相反」，原文放在來源欄，這才是永久筆記。

## 參考資料

- [Niklas Luhmann-Archiv, Der Zettelkasten Niklas Luhmanns](https://niklas-luhmann-archiv.de/nachlass/zettelkasten)
- [Niklas Luhmann-Archiv, Inhaltsübersicht Zettelkasten](https://niklas-luhmann-archiv.de/bestand/zettelkasten/inhaltsuebersicht)
- [Niklas Luhmann, Communicating with Slip Boxes (English translation by Manfred Kuehn)](https://luhmann.surge.sh/communicating-with-slip-boxes)
- [zettelkasten.de, Introduction to the Zettelkasten Method](https://zettelkasten.de/introduction/)
- [Andy Matuschak, Evergreen notes](https://notes.andymatuschak.org/Evergreen_notes)
- [Andy Matuschak, Evergreen notes should be atomic](https://notes.andymatuschak.org/zNUaiGAXp21eorsER1Jm9yU)
- [Andy Matuschak, Evergreen notes should be concept-oriented](https://notes.andymatuschak.org/z2hQEhqWkdRLL9JUwfawZZx)
- [Andy Matuschak, Prefer associative ontologies to hierarchical taxonomies](https://notes.andymatuschak.org/z8SU3r8xyZyvwRhyDdJasJ2)
- [Andy Matuschak, Write notes for yourself by default, disregarding audience](https://notes.andymatuschak.org/zXDPrYcxUSZbF5M8vM5Y1U9)
- [Linking Your Thinking, MOCs (defn)](https://blog.linkingyourthinking.com/notes/mocs-(defn))
- [Bergman et al. 2008, Improved search engines and navigation preference in personal information management (ACM TOIS)](https://doi.org/10.1145/1402256.1402259)
- [Bergman et al. 2010, The effect of folder structure on personal file navigation (JASIST)](https://doi.org/10.1002/asi.21415)
- [Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011)](https://doi.org/10.1145/1978942.1979457)
- [Bertsch, Pesta, Wiscott & McDaniel 2007, The generation effect: A meta-analytic review (Memory & Cognition)](https://doi.org/10.3758/BF03193441)
- [McCurdy, Viechtbauer, Sklenar, Frankenstein & Leshikar 2020, Theories of the generation effect and the impact of generation constraint: A meta-analytic review (Psychonomic Bulletin & Review)](https://doi.org/10.3758/s13423-020-01762-3)
- [Urry et al. 2021, Don't Ditch the Laptop Just Yet (Psychological Science)](https://doi.org/10.1177/0956797620965541)
- [DeStefano & LeFevre 2007, Cognitive load in hypertext reading: A review (Computers in Human Behavior)](https://doi.org/10.1016/j.chb.2005.08.012)
- [Madrid, Van Oostendorp & Puerta Melguizo 2009, The effects of the number of links and navigation support on cognitive load and learning with hypertext (Computers in Human Behavior)](https://doi.org/10.1016/j.chb.2008.06.005)
- [Alford & Mendes 2009, Scholarly research process: Investigating the effects of link type and directionality (HT 2009)](https://doi.org/10.1145/1557914.1557934)
- [Ferreira et al. 2025, How People Manage Knowledge in their "Second Brains" (arXiv:2509.20187)](https://arxiv.org/abs/2509.20187)
