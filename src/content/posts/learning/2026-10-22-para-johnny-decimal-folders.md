---
title: "放哪裡：PARA、Johnny.Decimal，與到底要不要分資料夾"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, knowledge-management, personal-information-management, para, johnny-decimal]
lang: zh-TW
tldr: "自己建的檔案，研究一再發現人主要靠點資料夾找回，搜尋工具變好也沒改變；標籤用的人很少，用了也多半只貼一個。所以筆記值得分類，但每則有一個主要的家就好，結構別太深、資料夾別太滿。PARA 依「離手上的事多近」分四類，Johnny.Decimal 每層最多十個、用編號固定位置；兩者的數字都是作者的經驗，不是實驗結果。"
description: "知識庫怎麼建 order 2：資料夾和搜尋的研究在檔案與 email 上結論相反、標籤與 Notion 這類沒有資料夾的工具、資料夾要多淺多滿、PARA 與 Johnny.Decimal 怎麼分，以及同一批檔案在兩種方法下的樣子。"
series:
  name: "知識庫怎麼建"
  order: 2
---

> 🌏 [English version](/posts/learning/2026-10-22-para-johnny-decimal-folders-en)

筆記越存越多，遲早會遇到這個問題：要不要建資料夾？一派說分類是浪費時間，反正搜尋什麼都找得到；另一派說沒有分類的東西等於沒存。兩派都拿得出研究，因為研究看的東西不一樣。

研究之外，最常被推薦的兩套分法是 PARA 和 Johnny.Decimal。PARA 是 Tiago Forte 提出的，依「這東西離你手上的事多近」分成專案、領域、資源、封存四類；Johnny.Decimal 是 Johnny Noble 提出的，每層最多十個，每個東西都有一個像 `15.52` 這樣的固定編號。

這篇是「知識庫怎麼建」個人段的第二篇。[order 1](/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge) 談什麼值得收，這篇談收進來之後放哪裡。讀完你能判斷自己的資料該用資料夾、編號，還是靠搜尋，也知道現有的資料夾該不該重分、怎麼重分。

## 研究怎麼說：檔案和 email 結論相反

**自己的檔案，多數人靠點資料夾找。** 以色列 Bar-Ilan 大學的 Ofer Bergman 和合作者研究這件事很多年。2010 年那篇請 296 個人在自己的電腦上找回最近用過的檔案，94% 找到，成功的平均只花約 15 秒（[Bergman et al. 2010](https://doi.org/10.1002/asi.21415)）。2008 年的研究問了七百多位 Windows 和 Mac 使用者，依他們自己的估計，點資料夾佔了一半以上的找回，搜尋最多只佔一成五（[Bergman et al. 2008](https://doi.org/10.1145/1402256.1402259)）。

搜尋工具變好，也沒有改變多少。同一篇研究追蹤裝了 Google Desktop 的 Windows 使用者：剛裝的頭幾週搜尋變多，七個月後整體又降回接近原本的水準，那時已經有超過三分之一的人把它移除了。作者的解釋是，人只在忘了東西放在哪時才搜尋，而這種情況最多約佔四分之一。

少數人確實主要靠搜尋。Bergman 和 Dvir 2024 年估計約 8% 的人是「超級搜尋者」，但他們搜尋不是因為搜尋比較好用，而是資料夾比較亂、點資料夾常常找不到（[Bergman & Dvir 2024](https://doi.org/10.1080/07370024.2024.2379838)）。作者認為這群人是例外，而他們的理由反而強化了規則。

**email 剛好相反。** [order 0](/posts/learning/2026-10-22-knowledge-base-three-readers) 提過，IBM 研究院的 Whittaker 等人發現勤於歸檔 email 的人沒有比較找得到信。他們的資料裡，找信動作有六成是直接捲動收件匣，點資料夾只佔一成多（[Whittaker et al. 2011](https://doi.org/10.1145/1978942.1979457)）。Bergman 和 Dvir 的受試者也一樣：自己估計找 email 有四成多靠搜尋，找檔案不到一成。

差別在哪？檔案是你自己建、自己命名、自己放的；email 是別人寄來的，量大，你沒有參與命名。筆記比較像檔案：你寫的、你放的，你多半記得放在哪。2025 年一項訪談 7 位用 Obsidian 的研究者的研究也看到，他們日常主要靠資料夾、標籤和搜尋（[Ferreira et al. 2025](https://arxiv.org/abs/2509.20187)）。所以我認為 email 的結論不能直接搬到筆記上，但筆記軟體本身還沒有同樣規模的研究。

## 資料夾要多淺、多滿

Bergman 2010 的資料也說明了資料夾該長什麼樣子。受試者要找的檔案，平均在 2.86 層深的地方。實際的找檔時間，放在桌面的最快，約 6 秒；第一層約 12 秒；2 到 6 層之間差不多，大約 16 到 19 秒；到了 7 層以上，才明顯變慢到 25 秒左右。

資料夾裡東西越多也越慢。作者用回歸算出，多一層的代價大約等於資料夾裡多 21 個項目（檔案加子資料夾），於是提出一個經驗法則：一個資料夾超過約 21 項，就值得再開一層。這是從係數推出來的建議，不是實驗比出來的最佳值。受試者的資料夾平均約 22 項，但中位數只有 15 項：一半的資料夾不到 15 項，平均是被少數很大的資料夾拉高的。所以要注意的，是那幾個特別滿的資料夾。

所以實際做法是：

- **別讓結構深到七層以上。** 兩三層、四五層差別不大，真正變慢的是很深的樹。
- **一個資料夾放到二十幾項，就考慮拆。** 找不到或要繞路的那些次，經過的資料夾平均也比較大。
- **搜尋當備援。** 忘了放哪時再搜。PARA 的作者 Forte 也這樣說：搜尋永遠是找回放錯東西的後備工具（[Forte 2017, Part 2](https://every.to/forte-labs/para-part-2-operations-manual-540234)）。

## 標籤，以及沒有資料夾的工具

既然一則筆記可能同時屬於兩個主題，為什麼不用標籤？研究的答案是：大家都覺得標籤是好主意，但實際上很少用。Bergman 團隊 2013 年的一篇論文裡有兩項研究，一項在 Gmail、一項在 Windows 7，受試者都同時可以用資料夾和標籤。同一團隊的另一篇論文整理了結果：Gmail 裡只有約三分之一的已分類信件用標籤式，而且用標籤的人九成多的信只貼一個標籤；Windows 7 那組在可以自由選擇的五週裡，23 人中只有 6 人貼過標籤。同一篇論文問了 168 位學生，77% 覺得多重分類是好主意（[Bergman et al. 2013](https://doi.org/10.1002/meet.14505001029)）。作者的解釋是，「這則在 X 資料夾」比「這則可以用 X、Y、Z 標籤找到」好記。

用標籤找，結果則有好有壞。Bergman 團隊在 Windows 7 那項研究裡做了控制好的找檔任務：受試者剛被要求用標籤兩週後，用標籤找顯著比較慢，找不到的次數也比較多，但後者只接近顯著（[Bergman et al. 2013, JASIST](https://doi.org/10.1002/asi.22906)）。Civan 等人 2008 年讓 10 個人分別用資料夾和標籤整理文章五天，之後找回的速度則沒有差別（[Civan et al. 2008](https://doi.org/10.1002/meet.2008.1450450214)）。差別在取捨：選一個資料夾比選幾個標籤費心；但標籤彼此重疊，忘了放哪時沒辦法一個一個翻完。作者的結論是兩者都要一點。

Notion 這類工具沒有傳統的資料夾。依 Notion 說明中心的說法（2026 年 10 月），它用頁面裡放頁面取代資料夾，再用資料庫的屬性和不同的檢視方式，讓同一則頁面出現在好幾種分類裡（[Notion Help](https://www.notion.com/help/create-a-subpage)）。Obsidian 則同時有資料夾、標籤和連結。

不管哪種工具，可以這樣用：**每則筆記有一個主要的家**，可能是資料夾，也可能是 Notion 的父頁面；**標籤只用來標跨主題的狀態**，例如「待讀」「進行中」，而不是拿來取代分類。至於「一則筆記同時跟兩個主題有關」這件事，比較好的解法是連結，這是 [order 3](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc) 的主題。

## PARA：依可行動性分四類

[PARA](https://fortelabs.com/blog/para/) 反對學校式的主題分類，例如「行銷」「心理學」「點子」。Forte 主張依可行動性分類，也就是這東西和你現在要完成的事多近。2017 年原版的定義最精確（[Forte 2017](https://every.to/praxis/the-para-method-a-universal-system-540221)）：

| 類別 | 定義 | 例子 |
|---|---|---|
| Projects 專案 | 有目標、有期限的一串任務 | 四月去日本攀岩、改版官網 |
| Areas 領域 | 要長期維持某個標準的責任範圍 | 健康、財務、團隊招募 |
| Resources 資源 | 持續感興趣的主題 | 攀岩技術、咖啡、日文 |
| Archives 封存 | 前三類裡已經不活躍的東西 | 去年的專案、離職前負責的領域 |

最容易搞混的是 Area 和 Resource。Forte 的分法是看「負責」還是「只是有興趣」：你要負責的放 Area，只是有興趣的放 Resource（[Forte 2017, Part 2](https://every.to/forte-labs/para-part-2-operations-manual-540234)）。

PARA 不是建好四個資料夾就結束。Forte 說它是動態的系統，東西會在四類之間流動，最常見的是專案結束後移進封存。他也不建議排固定時間重整整個結構，而是「隨機會而做」：已經在翻某個專案的筆記時，順手把放錯的移走。這和 order 1 說的每週清收件匣不衝突：清收件匣是把新東西歸位，Forte 反對的是排時間重整舊的結構。

**例子：「四月日本攀岩」的一生。** 出發前，它是一個 Project，裡面放機票、岩場資訊、裝備清單。回來之後，先花十分鐘把以後還會用到的東西挑出來，例如「小川山的岩場筆記」移到 Resources 的「攀岩」底下，「出國裝備清單」移到 Areas 的「旅行」。剩下的整個資料夾移進 Archives。

## Johnny.Decimal：每層最多十個，用編號固定位置

[Johnny.Decimal](https://johnnydecimal.com/10-19-concepts/11-core/11.01-introduction/) 的結構只有三層：

- **Area**：最多 10 個，編號 `10-19`、`20-29`⋯⋯
- **Category**：每個 area 最多 10 個，例如 `15 旅行`。
- **ID**：每個 category 最多 100 個，格式固定是兩位數、小數點、兩位數，例如 `15.52 四月日本攀岩`。

東西只放在 ID 裡，area 和 category 只是架子。作者說「每層不超過十個」是這套方法的核心，理由有三個：每層選項少，找的時候不會看錯地方；新增一個 category 應該要想一下，[作者的說法](https://johnnydecimal.com/documentation/philosophy)是「Creating a new category should be something that takes time.」；數字不會像字母排序那樣因為新增資料夾而跑位，久了就記得住位置。

另一個常被忽略的重點是索引。[作者說](https://johnnydecimal.com/documentation/the-jdex)：「The index is your Johnny.Decimal system.」東西散在檔案、email、雲端、筆記軟體，但用同一個 ID，再用一份索引記錄每個 ID 在哪。所以一個 category 可以放到近百個 ID 而不必拆（`.00` 到 `.09` 保留給收件匣、索引這類系統用途，一般內容從 `.11` 開始）：你是靠編號和索引找，不是一個一個點開瀏覽。如果你習慣瀏覽而不是查索引，上面「二十幾項就拆」的建議一樣適用。

作者也承認[有些情況塞不進去](https://johnnydecimal.com/documentation/expand-an-area-overview)：學生或老師的課程、學期超過十個，接案者的客戶和案子一多，十個的限制就不夠用。

## 同一批檔案，兩種樹

假設你有這些東西：order 1 說的收件匣、日本攀岩行程、出國裝備清單、年度健檢報告、報稅資料、攀岩技術筆記、咖啡沖煮筆記、去年的官網改版專案。

```text
PARA                              Johnny.Decimal
├── 0 收件匣                       00-09 系統
├── 1 Projects                    │   └── 00 系統
│   └── 四月日本攀岩               │       └── 00.01 收件匣
├── 2 Areas                       10-19 生活
│   ├── 健康（健檢報告）           │   ├── 11 健康
│   ├── 財務（報稅）               │   │   └── 11.11 年度健檢
│   └── 旅行（出國裝備清單）       │   ├── 12 財務
├── 3 Resources                   │   │   └── 12.11 報稅 2026
│   ├── 攀岩技術                  │   └── 15 旅行
│   └── 咖啡沖煮                  │       ├── 15.11 出國裝備清單
└── 4 Archives                    │       └── 15.52 四月日本攀岩
    └── 官網改版 2025             20-29 興趣
                                  │   ├── 21 攀岩
                                  │   │   └── 21.11 攀岩技術
                                  │   └── 22 咖啡
                                  │       └── 22.11 沖煮筆記
                                  30-39 工作
                                      └── 31 專案
                                          └── 31.14 官網改版 2025
```

PARA 依「現在和你多近」分，日本攀岩結束後會整個搬家；Johnny.Decimal 依「是什麼」分，日本攀岩永遠在 `15.52`，結束了也不動，只是不再打開。PARA 適合專案來來去去、想讓手上的事一眼看到的人；Johnny.Decimal 適合東西種類穩定、希望位置永遠不變的人。兩者都只有三、四層。

## 怎麼選

| 你的情況 | 建議 |
|---|---|
| 筆記很少，或幾乎都靠搜尋也找得到 | 先不分類，收件匣加搜尋就好 |
| 手上的專案一直在換 | PARA |
| 東西種類穩定，想要固定位置、跨工具共用同一個編號 | Johnny.Decimal |
| 用 Notion | 父頁面當主要的家，資料庫的屬性當標籤，兩套方法都能套 |
| 已經有一棵很深、很亂的樹 | 見下面「今晚可以做的事」的 B |

兩位作者的數字都沒有引用研究。Forte 說 PARA 的層級不要超過四層，自己也承認「不管這是不是真正的極限，它是個有用的限制」（[Forte 2017](https://every.to/praxis/the-para-method-a-universal-system-540221)）；Johnny.Decimal 每層十個的理由也是設計上的考量。研究能支持的只有方向：別太深，別太滿。

## 研究的限制

Bergman 團隊的研究看的是電腦檔案，多半是 2000 年代後期收集的 Windows 和 Mac 資料，受試者有大學生和職員，也有年長的 Mac 使用者社團成員，而且只測最近用過的檔案，很久沒開的舊檔沒測。個人差異的研究則發現，人格和空間能力幾乎預測不了一個人怎麼整理檔案，作業系統的影響反而比較大（[Dinneen & Frissen 2020](https://doi.org/10.1145/3334480.3382944)）。筆記軟體裡的資料夾、標籤和連結，目前沒有同樣規模的研究。

## 今晚可以做的事

如果筆記還很少，只建一個收件匣就好，等東西多了再分類。已經有一棵樹的，先看你屬於哪一種：

**A. 樹還不亂，想用 PARA。** 直接照新規則調整：

1. 建一個收件匣和一個「專案」資料夾，手上有期限的事各開一個子資料夾。
2. 找出超過二十幾項的資料夾，拆成兩三個子資料夾，或把不再用的移進封存。
3. 結構深到七層以上的，把中間沒在用的層級合併掉。

**A′. 樹還不亂，想用 Johnny.Decimal。**

1. 先寫下不超過十個 area，每個 area 底下不超過十個 category。
2. 開一份索引筆記，每建一個 ID 就先在索引記一行。
3. 現有資料夾一個一個改名成 ID，用到時再改，不必一次全改。

**B. 樹已經很深、很亂，不管選哪套。** 不要一次重整。[Forte 的建議](https://fortelabs.com/blog/basboverview/)是：

1. 把現有的東西整包移進一個標了今天日期的封存資料夾。
2. 從今天起，新東西照新規則放。
3. 舊的東西用到時，再搬到新位置。

## 自我檢查

**問：**「Python」這個資料夾，在 PARA 裡該放 Area 還是 Resource？

**判準：** 看你對它有沒有要維持的標準。如果你是工程師，團隊的 Python 程式碼規範、版本升級、你負責的套件都要持續維護，它是 Area。如果你只是有興趣、偶爾讀讀文章，它是 Resource。同一個主題，對不同人可以落在不同類，這正是 PARA 依可行動性而不是依主題分類的意思。

那「小川山的岩場筆記」呢？它既是攀岩技術（Resource），也和明年的旅行計畫（Project）有關。資料夾只能讓它住一個地方，這時就需要[下一篇](/posts/learning/2026-10-22-zettelkasten-evergreen-notes-moc)談的連結。

## 參考資料

- [Bergman, Beyth-Marom, Nachmias, Gradovitch & Whittaker 2008, Improved search engines and navigation preference in personal information management (ACM TOIS)](https://doi.org/10.1145/1402256.1402259)
- [Bergman, Whittaker, Sanderson, Nachmias & Ramamoorthy 2010, The effect of folder structure on personal file navigation (JASIST)](https://doi.org/10.1002/asi.21415)
- [Bergman & Dvir 2024, File hyper-searching explained (Human–Computer Interaction)](https://doi.org/10.1080/07370024.2024.2379838)
- [Bergman, Gradovitch, Bar-Ilan & Beyth-Marom 2013, Folder versus tag preference in personal information management (JASIST)](https://doi.org/10.1002/asi.22906)（依作者接受稿）
- [Bergman et al. 2013, Tagging personal information: A contrast between attitudes and behavior (ASIS&T 2013)](https://doi.org/10.1002/meet.14505001029)
- [Civan, Jones, Klasnja & Bruce 2008, Better to organize personal information by folders or by tags?: The devil is in the details (ASIS&T 2008)](https://doi.org/10.1002/meet.2008.1450450214)
- [Whittaker et al. 2011, Am I wasting my time organizing email? A study of email refinding (CHI 2011)](https://doi.org/10.1145/1978942.1979457)
- [Ferreira et al. 2025, How People Manage Knowledge in their "Second Brains" (arXiv:2509.20187)](https://arxiv.org/abs/2509.20187)
- [Notion Help: Create a subpage](https://www.notion.com/help/create-a-subpage)
- [Notion Help: Intro to databases](https://www.notion.com/help/intro-to-databases)
- [Tiago Forte, The PARA Method](https://fortelabs.com/blog/para/)
- [Tiago Forte 2017, The PARA Method: A Universal System for Organizing Digital Information](https://every.to/praxis/the-para-method-a-universal-system-540221)
- [Tiago Forte 2017, PARA Part 2: Operations Manual](https://every.to/forte-labs/para-part-2-operations-manual-540234)
- [Tiago Forte, Building a Second Brain: The Definitive Introductory Guide](https://fortelabs.com/blog/basboverview/)
- [Johnny.Decimal: Introduction](https://johnnydecimal.com/10-19-concepts/11-core/11.01-introduction/)
- [Johnny.Decimal: Philosophy](https://johnnydecimal.com/documentation/philosophy)
- [Johnny.Decimal: The JDex](https://johnnydecimal.com/documentation/the-jdex)
- [Johnny.Decimal: Expand an area](https://johnnydecimal.com/documentation/expand-an-area-overview)
- [Dinneen & Frissen 2020, Mac users do it differently: the role of operating system and individual differences in file management (CHI EA 2020)](https://doi.org/10.1145/3334480.3382944)
