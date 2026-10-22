# 審稿紀錄：團隊知識庫為什麼會爛掉，以及要寫哪幾種文件（order 6）

- 審稿對象：`src/content/posts/learning/2026-10-22-team-wiki-why-it-rots.md`（中）、`-en.md`（英）。兩檔行號結構一致，下文「L」同時指中英同一行。
- 日期：2026-10-22
- 審稿人：獨立審稿（未參與寫作），一輪完成 post-verify／post-review／post-polish；未改文章。
- 證據來源（`.work/research/building-knowledge-bases/extractions/`）：`aghajani-2019-doc-issues-unveiled.md`、`aghajani-2020-practitioners-perspective.md`、`galan-2023-turnover-knowledge-loss.md`、`diataxis-four-types.md`、`stackoverflow-2024-professional-knowledge.md`、`dora-2023-documentation.md`、`ahmeti-2024-adr-action-research.md`、`stocker-tochtermann-2011-enterprise-wikis.md`、`grudin-poole-2010-wikis-at-work.md`；疑義處回查 scratchpad `fulltext/dora2023.txt`、`fulltext/aghajani-2019.txt`。另對照 order 0（`2026-10-22-knowledge-base-three-readers.md`）與規劃表 `.work/series-plans/building-knowledge-bases.md` order 6 範圍卡（L163–177）。
- 規則依據：`~/.claude/skills/post/references/writing-guide.md` 與任務指定重點。

統計：🔴 2／🟡 7／🟢 9

---

## post-verify

已核對且一致（無需修改）：
- Stack Overflow 2024：70.3% 同意知道去哪找（「七成」）、48.8% 同意找得到最新資訊（「不到一半」）——`stackoverflow-2024-professional-knowledge.md` L33、L36、L96。文章沒有用頁面上有疑義的 61%（同檔 L92），正確。
- Aghajani 2019：有效 824 份、內容類不完整 268 > 過時 190 > 錯誤 72、可用性問題 50% 是可尋性、過時定義、「conceptually does not exist」——`aghajani-2019` L23、L37–43、L54–56；全文 `aghajani-2019.txt` L491。
- Aghajani 2020：146 人、ABB 佔 125、Clarity 88% 最高、新功能沒文件 69% 次之、流程類唯一過半的是沒時間寫 65%——`aghajani-2020` L21、L30、L35、L42、L78。
- Stocker & Tochtermann：Beta 行政區由已離職核心成員建立、離職後失效；技術區由 20 位技術人員自寫、持續更新——`stocker-tochtermann-2011` L38–41。與 order 0 L37 描述一致。
- Grudin & Poole：多數 wiki 很快被放棄、主管要 dashboard、截止前更少更新、主管貢獻較少、對齊主管期待的建議、成功案例（新團隊、時程緊、4 個月從零寫文件）——`grudin-poole-2010` L31–33、L62–65、L67–71。
- Ahmeti 2024：兩團隊、三個月、後測 89% 滿意（n=9）、存放位置與「該記什麼」指引是教訓、期間太短——`ahmeti-2024` L17–18、L35、L47–48、L61。
- Diátaxis：四種與 map 的問題句、compass 兩問、tutorial/how-to 最常混淆且分界不是難易、反對先建空結構、不處理正確性、原為軟體產品文件——`diataxis-four-types` L24–51、L64–66、L72、L20。
- DOI／連結：Aghajani 2020、Stocker、Galan Part I/II、Grudin、Ahmeti 與紀錄書目一致。

### V1 🔴 Galan 的行內連結指向 Part I，但引用的主張全在 Part II；且有兩處說過頭

- 位置：中／英 L27
- 原句（中）：「Galan 2023 年回顧了 91 篇……發現多數組織沒有事前的預防策略，都是人走了才臨時應付；寫成文件只適合能明確說出來的知識，而且要附上怎麼用的指引（[Galan 2023](https://doi.org/10.1108/TLO-09-2022-0107)）。」
- 原句（英）："Galan's 2023 review of 91 studies … found that most organizations have no preventive strategy and improvise after someone has gone; writing things down only works for knowledge that can be stated explicitly, and it needs guidance on how to use it ([Galan 2023](https://doi.org/10.1108/TLO-09-2022-0107))."
- 依據：
  - `galan-2023-turnover-knowledge-loss.md` L86：「『怎麼防止』『文件化有沒有用』全在 Part II。只讀 Part I 的轉述無法支持任何『寫文件能減少離職知識流失』的主張。」連結的 `-0107` 是 Part I（L8），這兩個主張出自 Part II（`-0108`，L9、L58–64）。
  - 「多數組織沒有」：原文是 "studied organizations are often reported to lack holistic and circumspect KLT prevention strategies … and instead act on an ad-hoc basis"（L59）——是「被研究的組織常被描述為」，不是「多數組織」。
  - 「只適合」：原文是 codification "suitable for the integration of explicit knowledge if complemented with proper guidelines"，另說複雜知識靠人際機制有證據（L63–64）；「只適合」比原文強。
- 改法：
  - 中：「Galan 2023 年回顧了 91 篇關於員工離職造成知識流失的實證研究，被研究的組織常常沒有事前的預防策略，人走了才臨時應付（[Galan 2023, Part II](https://doi.org/10.1108/TLO-09-2022-0108)）。寫成文件適合能明確說出來的知識，而且要附上怎麼用的指引；比較複雜的知識，研究看到的是靠工作坊、帶人這類人對人的方式。」
  - 英："Galan's 2023 review of 91 empirical studies on knowledge lost through employee turnover found that the organizations studied often had no preventive strategy and improvised after someone had left ([Galan 2023, Part II](https://doi.org/10.1108/TLO-09-2022-0108)). Writing things down suits knowledge that can be stated explicitly, provided it comes with guidance on how to use it; for more complex knowledge, the studies point to person-to-person approaches such as workshops and mentoring."
  - 「91 篇」可以保留 Part I 連結當第一次出處，但最後的行內連結必須指 Part II。

### V2 🟡 「比寫錯更常見」把「被討論的次數」寫成「發生率」

- 位置：中／英 L8（tldr）、L23（小標）
- 原句（中）：「缺漏和過時，比寫錯更常見。」；英："Gaps and outdated pages are more common than wrong ones."
- 依據：`aghajani-2019` L88：「數字不是『問題發生率』而是『被拿出來討論的次數』。被抱怨的才會出現在 issue／PR；沒人發現的過時文件不會被算到。」
- 改法：
  - 中（小標）：「缺漏和過時，比寫錯更常被提出來。」；tldr 同步改成「缺漏和過時比寫錯更常被抱怨」。
  - 英（heading）："Gaps and outdated pages come up more often than wrong ones."；tldr："gaps and outdated pages are complained about more often than wrong ones".

### V3 🟡 「兩篇加起來看，問題主要不是內容錯」對 2020 那篇不成立

- 位置：中／英 L25 末句
- 原句（中）：「兩篇加起來看，問題主要不是內容錯，而是沒寫、沒更新、寫得看不懂、找不到。」；英："Taken together, the two papers say the main problem isn't wrong content…"
- 依據：`aghajani-2020` L32：實務者把 Faulty tutorial 勾為重要的有 65%、Inappropriate installation instructions 63%、Erroneous code examples 59%，和可尋性 65%（L35）同一級。「錯誤不重要」只在 2019 的討論次數裡成立（`aghajani-2019` L37–40）。
- 改法：
  - 中：「兩篇加起來看，被提出最多的不是內容寫錯，而是沒寫、沒更新、看不懂、找不到。」
  - 英："Taken together, the problems raised most often aren't errors; they're content that was never written, never updated, can't be understood or can't be found."

### V4 🟡 DORA：「明顯較高」的強度與構念都要收斂；結論句和 Grudin 的發現有張力

- 位置：中／英 L29
- 原句（中）：「有正式流程分配文件工作的團隊，自評的文件品質明顯較高……換句話說，文件要有人負責寫，而這件事最好不是靠熱心。」；英："teams with a formal process for assigning documentation work rated their documentation quality markedly higher … that is better not left to goodwill."
- 依據：
  - `dora-2023-documentation` L47–49；全文 `dora2023.txt` L1504–1506："work distribution, including formal processes to distribute documentation work, significantly increase the quality of documentation"。構念是 work distribution（"Formal processes to help employees distribute tasks equitably within a team"），分配文件工作是其中一部分；"significantly" 是統計顯著，不是「差很多」。資料是同一份問卷的自評、橫斷面（L61、L73）。
  - `grudin-poole-2010` L48："wiki sustainability was strongly dependent on enthusiasts"——研究看到的現實是靠熱心者；所以「不要只靠熱心」比「最好不是靠熱心」貼近兩份證據。
- 改法：
  - 中：「Google 主持的 DORA 2023 年報告也看到一個相關的現象：團隊有正式流程公平分配工作（包括文件工作）時，受訪者自評的文件品質顯著較高。換句話說，文件要有人負責寫；Grudin 和 Poole 看到的 wiki 多半靠少數熱心的人撐著，我的建議是不要只靠熱心。」
  - 英："The Google-run DORA 2023 report saw a related pattern: where teams had formal processes for distributing work fairly, including documentation work, respondents rated their documentation quality significantly higher. In other words, someone has to be responsible for writing; the wikis Grudin and Poole saw were mostly kept alive by a few enthusiasts, and I'd suggest not relying on enthusiasm alone."
  - 注意：Grudin & Poole 在 L31 才第一次出現，若 L29 先提到，需把連結移到這裡或調整順序；也可以只寫「我的建議是不要只靠熱心」，不提 Grudin。

### V5 🟡 「沒有實證研究檢驗過它的效果」是無範圍的全稱否定

- 位置：中／英 L86 末句
- 原句（中）：「Diátaxis 是作者的架構，沒有實證研究檢驗過它的效果。」；英："Diátaxis is its author's framework, and no empirical study has tested its effects."
- 依據：規則「沒找到要寫範圍」。紀錄能支持的是：作者網站給的證據只有採用者推薦語與採用數，沒有對照研究（`diataxis-four-types` L19、L83）。
- 改法：
  - 中：「Diátaxis 是作者自己的架構，網站上提出的證據是採用者的推薦，不是對照研究。」
  - 英："Diátaxis is its author's framework; the evidence on its site is testimonials from adopters, not controlled studies."

### V6 🟢 Aghajani 2020「大家最在意」是勾選比例，且只有 78 人答這份問卷

- 位置：中／英 L25
- 原句（中）：「大家最在意的是文件寫得不清楚，其次是新功能沒有文件」；英："what they cared about most was unclear documentation"
- 依據：`aghajani-2020` L24、L77、L80：百分比是勾為 major issue 的比例，不是嚴重度；Survey-I 只有 78 人。
- 改法：中「最多人勾選為重要問題的是文件寫得不清楚，其次是新功能沒有文件」；英 "the issue most often marked as important was unclear documentation, followed by new features having no documentation"。

### V7 🟢 Grudin & Poole「研究了數千個」的說法可以更準

- 位置：中／英 L31
- 原句（中）：「研究了數千個企業 wiki，大多數很快就沒人用了」
- 依據：`grudin-poole-2010` L21、L33：數千個 wiki 是 MegaSoft 平台的使用資料，訪談與問卷涵蓋七家組織。
- 改法：中「取得了數千個企業 wiki 的使用資料，大多數很快就沒人用了」；英 "obtained usage data on thousands of enterprise wikis, and most had fallen out of use quickly"。

---

## post-review

已核對且一致（無需修改）：
- 開頭段補了團隊段總覽，只假設讀過 order 0，符合規劃表「斷崖處理 0→各段第一篇」與 order 0 L90。
- 承諾「讀完你能把團隊現有的文件分成四種，看出缺了哪一種」（L19）：有兩問羅盤（L63）、例子表（L73–80）、今晚步驟 2–3 兌現。
- 與 order 0 一致：Stocker 的轉述、四個問題表裡團隊段「收什麼＝要寫哪幾種文件（6）」（order 0 L63）。
- 與範圍卡的差異：範圍卡（plan L166）把「沒人用（Grudin 66%）」列為一種爛法、並列 SO「61%」數字；成稿改成「寫的人沒時間或走了」，並拿掉 61%。後者正好避開紀錄指出的頁面數字不一致（`stackoverflow` L92），屬於有證據的調整，不用改回去。
- 與 order 7 的銜接：L19「頁面怎麼分層留給 order 7」，order 7 L19 回指本篇，對得上。

### R1 🔴 「研究的限制」寫了查證過程，而且跟引用的數字無關

- 位置：中／英 L86
- 原句（中）：「而 Stack Overflow 頁面上的文字和圖表數字有些對不上，我只引了圖表本身。」；英："and some of the text on the Stack Overflow page doesn't match its charts; I cited only the charts."
- 依據：規則「正文不能寫查證過程」。另外，本文引的 70% 與 48.8% 在頁面文字和圖表上是一致的（`stackoverflow` L42、L96）；對不上的是本文沒用的 61%（L92）。這句對讀者沒有用。
- 改法：整句刪掉。若要保留一條對讀者有用的限制，換成發布者的利益關係（`stackoverflow` L12、L88）：
  - 中：「Stack Overflow 和 DORA 的數字都是自評問卷；Stack Overflow 本身也在賣企業內部知識庫產品。」
  - 英："The Stack Overflow and DORA numbers are self-reported surveys, and Stack Overflow itself sells an internal knowledge-sharing product."

### R2 🟡 例子的結論推不出來；今晚步驟 3 把作者推論寫成事實

- 位置：中／英 L82；L92
- 原句（中）：「這樣看下來，這個團隊最缺的是說明類文件：大家知道怎麼做，但新人不知道為什麼。」；「四種裡哪一種最少，就是新人最容易卡住的地方。」
- 原句（英）："Looking at it this way, what this team lacks most is explanation…"；"Whichever of the four is scarcest is where new hires get stuck most easily."
- 依據：表格（L73–80）裡「說明」至少有一頁（系統架構，只是缺「為什麼」），而「教學」一頁獨立的都沒有（只存在於混在一起的新人環境設定）。依步驟 3「哪一種最少」的判準，這個團隊最少的是教學，和 L82 的結論對不上。步驟 3 的因果主張沒有來源，規則要求作者建議用建議語氣。
- 改法：
  - L82 中：「這樣看下來，這個團隊缺兩種：沒有一份獨立的教學，新人只能啃混在一起的設定頁；說明類只有一張架構圖，沒寫為什麼。」英："Looking at it this way, the team is short on two kinds: there is no standalone tutorial, so new hires have to work through the mixed setup page, and the only explanation is an architecture diagram that doesn't say why."
  - L92 中：「**找出缺的那一種。** 四種裡哪一種最少，我會先從那裡補，通常也是新人最常卡住的地方。」英："**Find the missing kind.** Whichever of the four is scarcest is where I'd start; in my experience it's often where new hires get stuck."（若不想用個人經驗，就只留前半句。）

### R3 🟡 限制重複說明（疊加）

- 位置：中／英 L25 與 L86
- 原句：L25「多數來自同一家公司」；L86「2020 年的調查大多數受訪者來自同一家公司」。
- 依據：規則「限制說明不要疊加」。
- 改法：L86 拿掉這一子句，只留「多數來自軟體開發：Aghajani 那兩篇看的是軟體文件」。中：「上面引用的文件研究多數來自軟體開發：Aghajani 那兩篇看的是開源與軟體公司的文件。」英："Most of the documentation research cited above comes from software development: both Aghajani papers look at software documentation."

### R4 🟡 order 0 的「從哪段開始讀」還寫 order 6「撰寫中」且沒連結

- 位置：order 0 中 L87（英文版同位置）；不在本篇四檔內，但跟本篇同日發布
- 原句（中）：「order 6〈團隊知識庫為什麼會爛掉，以及要寫哪幾種文件〉（撰寫中）」
- 依據：任務要求檢查跨篇銜接；本篇發布後 order 0 的入口會變成死入口。
- 改法：中「order 6〈[團隊知識庫為什麼會爛掉，以及要寫哪幾種文件](/posts/learning/2026-10-22-team-wiki-why-it-rots)〉」；英版改成指向 `-en` 的連結並拿掉 "(in progress)"。

---

## post-polish

中國用語掃描：用常見替換表（信息、質量、用戶、默認、數據、文檔、項目、支持、優化、落地、調用、鏈接、軟件、程序、代碼、接口、網絡、服務器、數據庫、實現、渠道、反饋、獲取、基於、場景、模塊、登錄、點擊、菜單、導航、通過等）掃了中文檔，沒有命中。

### P1 🟢 開頭句不順

- 位置：中／英 L17
- 原句（中）：「這種事在很多團隊都很熟悉。」；英："Plenty of teams know this situation."
- 改法：中「很多團隊對這種事都不陌生。」；英 "Many teams will recognize this."

### P2 🟢 「記錄／紀錄」混用

- 位置：中 L79「2024 Q3 會議記錄」，同列與 L67 用「決策紀錄」
- 改法：名詞統一用「紀錄」：「2024 Q3 會議紀錄」（order 7 也要一起改，見該篇 P1）。

### P3 🟢 中文版留了沒翻譯的英文引文

- 位置：中 L23
- 原句：「原文說找不到的文件「conceptually does not exist」。」
- 改法：「原文的說法是，找不到的文件『概念上等於不存在』（conceptually does not exist）。」

### P4 🟢 Galan 那句太長

- 位置：中 L27（一句含回顧、兩個發現、兩個條件）
- 改法：依 V1 的改寫拆成兩句即可。

### P5 🟢 中英受訪者描述不對等

- 位置：中 L25「問寫程式的人自己」；英 "Asking practitioners"
- 依據：受訪者含架構師、測試、技術主管（`aghajani-2020` L22），「寫程式的人」太窄。
- 改法：中「改問實務工作者，排序又不太一樣。」

### P6 🟢 自我檢查的標籤和系列其他篇不一致

- 位置：英 L97、L99 "**Question:**"／"**Answer:**"；中 L99「判準」
- 依據：order 0 英文版用 "**Q:**"／"**How to judge:**"，中文用「問／判準」。
- 改法：英改成 "**Q:**" 與 "**How to judge:**"。

### P7 🟢 開頭一句放了兩個數字

- 位置：中／英 L17
- 依據：規則「每個主張最多一個數字」。這裡兩個數字是同一題組的對比，可以接受；如果要嚴守，改成「……但同意自己找得到最新資訊的不到一半」，把 70% 留在後面。

## 修正紀錄（2026-10-22）

- 採用：V1（改連 Part II、收斂說法、拆句）、V2、V3、V4（未提 Grudin，只留建議語氣）、V5、V6、V7、R1（刪查證句，改寫發布者利益）、R2（例子結論改為缺教學與說明；今晚步驟 3 改建議語氣，只留前半句）、R3、R4（order 0 中英入口表加連結）、P1、P2、P3、P5、P6。
- 不採用：P4（V1 已拆句）、P7（兩個數字是同題組對比，保留）。
