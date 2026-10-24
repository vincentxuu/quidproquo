# 審稿紀錄：資訊架構：團隊 wiki 要按部門分還是按任務分，以及怎麼驗證（order 7）

- 審稿對象：`src/content/posts/learning/2026-10-22-team-wiki-information-architecture.md`（中）、`-en.md`（英）。兩檔行號結構一致，下文「L」同時指中英同一行。
- 日期：2026-10-22
- 審稿人：獨立審稿（未參與寫作），一輪完成 post-verify／post-review／post-polish；未改文章。
- 證據來源（`.work/research/building-knowledge-bases/extractions/`）：`nng-intranet-ia.md`、`cozijn-2007-intranet-task-vs-org.md`、`resnick-sanchez-2004-org-scheme-labels.md`、`gitlab-handbook-structure.md`、`nng-card-sorting.md`、`tullis-wood-2004-card-sort-sample.md`、`nng-tree-testing.md`、`kuric-2025-tree-testing-variants.md`；疑義處回查 scratchpad `fulltext/cozijn2007.txt`（L47、L73、L154、L164、L172）。另對照 order 6、order 0（L64、L87）與規劃表 order 7 範圍卡（`.work/series-plans/building-knowledge-bases.md` L180–193）。
- 規則依據：`~/.claude/skills/post/references/writing-guide.md` 與任務指定重點。

統計：🔴 3／🟡 10／🟢 10

---

## post-verify

已核對且一致（無需修改）：
- NN/g 2014：按任務的結構比較撐得過改組（觀察）、「按任務」的定義是位置不取決於誰負責或誰寫、按部門方便維護——`nng-intranet-ia` L21–24。NN/g 2024：57 個內網、「Organizing information by department makes it difficult to find」——同檔 L15、L26。
- **Resnick 的方向沒有讀反**：文章寫「對錯誤和滿意度的影響主要出現在標籤差的時候，而且是按商品分的那組比較好」，與正文一致（`resnick-sanchez-2004` L44–45、L51、L66），沒有照抄容易誤讀的摘要。卡片分類 10 人多數依目標分組、實際使用任務式沒有比較快——同檔 L26、L55。
- **Cozijn 的學習效果沒有寫過頭**：「研究沒有直接比較兩組最後是否打平，作者自己也說不確定這個學習成本值不值得」符合 `cozijn-2007` L56、L62、L74。搜尋時間 24.04 vs 11.04 秒，「多出一倍以上」數字正確（L44）。
- GitLab：頂層按職能、3,304 頁（「三千多頁」）、"Adhering to this hierarchy is sometimes counter-intuitive."、只連結不複製、不做 FAQ／quick links、每頁頂端有搜尋——`gitlab-handbook-structure` L27–38。
- NN/g 卡片分類：30–50 張卡（經驗值）、開放式優先、驗證既有分類改用樹狀測試、質性至少 15 人、量化 30–50 人——`nng-card-sorting` L19–28；Tullis & Wood 結論 20–30 人、單一公司內網——`tullis-wood-2004` L15、L28、L39。
- NN/g 樹狀測試：正確答案只能是葉節點、first click 常能預測成功、Albert & Tullis 98 個測試中位數 62%、最好的基準是自己過去的資料——`nng-tree-testing` L20、L28、L33–34、L38。
- Kuric 2025：介面變體在難題上會改變結果——`kuric-2025` L52、L63。

### V1 🔴 「兩組的正確率沒有差別」：小樣本的不顯著被寫成相等，而且數字方向是任務組較差

- 位置：中／英 L25
- 原句（中）：「兩組的正確率沒有差別。」；英："The two groups didn't differ in accuracy."
- 依據：`cozijn-2007` L42：平均錯誤數組織式 1.60、任務式 2.33，F(1,17) < 1，不顯著；L84：「每組人數沒有報告（19 人分兩組，最多 10/9）；樣本很小，『沒有差異』的結果（正確率、滿意度）檢定力很低，不能當作『兩者等效』的證據。」
- 改法：
  - 中：「錯誤數兩組沒有顯著差異，但每組不到十人，這不代表兩種分法一樣準。」
  - 英："Errors didn't differ significantly between the groups, but with fewer than ten people per group, that doesn't show the two schemes are equally accurate."

### V2 🟡 「熟悉組織的老員工」：原文沒有年資資料

- 位置：中／英 L25 末句（英 "all long-time employees who knew the organization"）；L93 同義重述
- 依據：全文 `cozijn2007.txt` L73 只寫受過高等教育、每天用電腦、熟悉寫包裝簡報；L47 寫研究刻意確認受試者 "very familiar with the organization chart"。沒有任何年資描述。
- 改法：中「這個實驗只有 20 人，都是熟悉公司組織圖的行銷部員工。」；英 "The experiment had only 20 participants, all marketing staff who knew the company's org chart well."

### V3 🟡 「搜尋時間多出一倍以上」容易被讀成「找東西要花兩倍時間」

- 位置：中／英 L25
- 原句（中）：「按任務分那組每個子任務的搜尋時間多出一倍以上」
- 依據：`cozijn-2007` L31–32、L44–50：「search time」只算子任務內第一次到最後一次點擊；每個子任務的總時間只多 27%，整份任務多 18%。
- 改法（二選一）：
  - 用總時間：中「按任務分那組每個子任務平均多花約四分之一的時間」；英 "the task group took about a quarter longer per subtask"。
  - 保留搜尋時間但定義：中「從第一次點擊到找到資料的搜尋時間，按任務分那組多出一倍以上」；英 "the task group's search time, from first click to finding the information, was more than double"。

### V4 🟡 Resnick：「分類方式對完成時間沒有影響」應寫成不顯著

- 位置：中／英 L27
- 原句（中）：「分類方式對完成時間沒有影響」；英 "The organizing scheme had no effect on completion time"
- 依據：`resnick-sanchez-2004` L21、L43：每格約 10 人，F(1,54) = 1.213, p = .276；任務式 256.4 秒、商品式 233.8 秒。
- 改法：中「分類方式對完成時間沒有顯著影響」；英 "The organizing scheme made no significant difference to completion time"。

### V5 🟡 「新人最常做的關鍵任務」是文章自己加的限定

- 位置：中／英 L64
- 原句（中）：「新人最常做的關鍵任務，NN/g 建議要到 90% 以上。」；英 "for the critical tasks new hires do most, NN/g recommends reaching over 90%."
- 依據：`nng-tree-testing` L34：「關鍵任務應 >90%（B L77）」，沒有限定新人。
- 改法：中「最關鍵的任務，NN/g 建議成功率要到 90% 以上。」；英 "for the most critical tasks, NN/g recommends a success rate above 90%."

### V6 🟢 卡片分類顯示的是分組方式，不是「說喜歡」

- 位置：中／英 L27 末句
- 原句（中）：「使用者說喜歡的分法，不一定是他們用起來最快的分法。」
- 依據：`resnick-sanchez-2004` L26：開放式卡片分類量的是 360 組配對怎麼分，不是偏好題。
- 改法：中「使用者自己分出來的分法，不一定是他們用起來最快的分法。」；英 "The way users group things themselves isn't necessarily the one they're fastest with."

### V7 🟢 GitLab 中英說法不一致，小標「付出代價」沒交代代價是什麼

- 位置：中 L29「GitLab 選了部門，並為它付出代價」／英 "GitLab chose function, and pays for it."
- 依據：`gitlab-handbook-structure` L32："organized by function and result"；段落內容寫的是「承認違反直覺」和補償手段。組織調整時頁面要跟著搬（同檔 L42）才是可以具體說出的代價。
- 改法：中「GitLab 選了職能，也承認這樣違反直覺」；英 "GitLab chose function, and admits it's counter-intuitive"。若要保留「代價」，段內補一句：中「組織調整時，頁面也得跟著搬家、更新連結。」英 "When the organization changes, pages have to move and links have to be updated."

### V8 🟢 「我的解讀」少了 GitLab 自己給的第二個理由

- 位置：中／英 L39
- 依據：`gitlab-handbook-structure` L36：不做 FAQ／quick links 的原因是 "very hard to keep up-to-date and are not compatible with organization per function and result"。
- 改法：中在「我的解讀是」之前補「GitLab 給的理由是這類頁面很難保持更新、也跟按職能組織的結構不合。」；英 "GitLab's stated reasons are that such pages are hard to keep up to date and don't fit an organization by function."

---

## post-review

已核對且一致（無需修改）：
- 與 order 6 的銜接：L19 回指 order 6；L35「這是 order 6 說的『誰來維護』問題」對得上 order 6 L27、L47。order 6 例子把 FAQ 拆到各頁（order 6 L80），和本篇 GitLab 不做 FAQ 的說法一致。
- 與 order 0 的承諾：order 0 L64 團隊段「怎麼整理＝資訊架構（7）」有兌現；order 0 L35 的「新人搜的是『請假』」和本篇 L45「『請假』比『假別管理辦法』好找」呼應得很好。
- 標題從範圍卡的「按讀者的任務組織」改成兩邊並陳，是證據導向的調整（Cozijn、Resnick 都不利任務式），不用改回去。
- 「研究的限制」有把 Resnick 的「任務」是購物目的、不是工作任務講清楚（`resnick-sanchez-2004` L72）。

### R1 🔴 把卡片分類寫成「分完之後的驗證」，和來源與本文自己的說法矛盾

- 位置：中／英 L8（tldr「分完用卡片分類找出讀者怎麼想」）、L19（「並用卡片分類和樹狀測試驗證它」）、L51（「分完之後，有兩種方法可以驗證：卡片分類讓你知道讀者怎麼想……」）
- 依據：
  - `nng-card-sorting` L27、L40、L62：卡片分類是生成法；要驗證既有分類，NN/g 建議改用樹狀測試；「『卡片分類可以驗證 IA』是誤用」。
  - `nng-tree-testing` L26–27：建議流程是卡片分類生出選項，再用樹狀測試決定骨架。
  - 本文 L56 自己也寫「要驗證現有的分類，NN/g 建議改用樹狀測試」，L58 寫卡片分類「不保證那樣分最好找」，和 L51 的框架互相矛盾。
  - 規劃表 order 7 範圍卡（L188）「並用卡片分類法驗證」也有同樣問題，建議一起改。
- 改法：
  - L51 中：「卡片分類和樹狀測試用在不同時間點：分之前（或改版之前）用卡片分類了解讀者怎麼分，分完之後用樹狀測試驗證讀者找不找得到。」英："Card sorting and tree testing belong at different points: before you organize (or reorganize), card sorting shows how readers group things; once you have a structure, tree testing checks whether readers can find things in it."
  - L19 中：「讀完你能替團隊 wiki 畫出兩層架構，用卡片分類找出讀者的分法，再用樹狀測試驗證。」英："By the end you'll be able to sketch a two-level structure for your team wiki, use card sorting to learn how readers group things, and check it with tree testing."
  - tldr 中：「動手分之前用卡片分類找出讀者怎麼想，分完用樹狀測試驗證找不找得到。」英："Before organizing, use card sorting to learn how readers think; afterwards, use tree testing to check whether they can find things."
  - 小標「驗證：卡片分類和樹狀測試」改成「卡片分類與樹狀測試」／"Card sorting and tree testing"。

### R2 🔴 例子裡「新人第一週」同時是部門內容頁和入口頁，和「內容只有一份」的結論衝突

- 位置：中／英 L73（右樹入口頁「新人第一週」）與 L76（左樹人資底下的「新人第一週」）；L36 結論舉的入口頁例子也是「新人第一週」
- 依據：本文結論 L36「內容只有一份，入口可以有很多個」、L47「一頁一件事」；GitLab 的單一來源原則（`gitlab-handbook-structure` L37）。兩頁同名，搜尋會出現兩個「新人第一週」，讀者分不清哪一頁有內容；右邊入口頁也沒有連到左邊那頁。這正是任務要求檢查的「例子與結論是否一致」。
- 改法（擇一）：
  - A（建議）：左樹人資底下改成內容明確的頁，例如「新人報到流程」／"Onboarding paperwork"；右樹入口頁「新人第一週」加一條「→ 新人報到流程」。L69 頁面清單同步把「新人第一週」換成「新人報到流程」。
  - B：拿掉右樹的「新人第一週」入口頁，入口頁例子只留「我要出差」「我要請假」，L89 改成「右邊兩頁入口頁」。

### R3 🟡 「入口頁自動跟著對」說過頭；改組的成本沒有回應

- 位置：中／英 L89；結論 L31–37
- 原句（中）：「出差規定改了，只要改人資那一頁，入口頁自動跟著對。」
- 依據：
  - 內容改了，入口頁不用改，這成立；但新增頁面（例如新的差旅保險規定）、頁面搬家或刪除時，入口頁的連結仍要有人更新。GitLab 不做 quick links 的理由正是難以保持更新（`gitlab-handbook-structure` L36）；本文原則 1 也要求每頁都有負責人，入口頁卻沒寫誰負責。
  - L23 先引 NN/g「按任務撐得過改組」，結論選了部門當主結構，卻沒說改組時怎麼辦。GitLab 的搬家流程（更新連結、加轉址，`gitlab-handbook-structure` L42）是現成的回應。
- 改法：
  - L89 中：「出差規定改了，只要改人資那一頁，入口頁不用動。入口頁也要有負責人：新增、搬移或刪除頁面時，記得回來更新連結。」英："When the business trip policy changes, you only update the HR page; the entry page doesn't need to change. Entry pages still need an owner, though: when pages are added, moved or deleted, someone has to update the links."
  - 結論第 1 點後補一句，中：「代價是組織調整時，頁面要跟著搬家；搬的時候留轉址，入口頁就不會斷。」英："The cost is that pages have to move when the organization changes; leave redirects when you move them, and the entry pages won't break."

### R4 🟡 「部門」對單一團隊的 wiki 不適用，order 6 和 order 7 的範圍跳了一級

- 位置：中／英 L17、L35、L71–86
- 依據：系列是「團隊 wiki」，order 6 的例子是一個工程團隊的首頁（API 文件、部署 SOP，order 6 L73–80）；本篇例子變成全公司的人資、財務、行政、工程。只管一個團隊 wiki 的讀者會不知道「按部門分」對自己是什麼意思。
- 改法：在結論第 1 點後補一句，中：「如果你的 wiki 只屬於一個團隊，『部門』就換成負責的小組、系統或人。」英："If your wiki belongs to a single team, read 'department' as the sub-team, system or person responsible."

### R5 🟡 自我檢查的判準站不太住：只是重述正文，而且建議做法會產生第二份出差規定

- 位置：中／英 L104–106
- 原句（中）：「……各自寫成標題說得出決定內容的頁面，例如『2026 年起出差改用線上申請』，再放回對應的部門底下。」
- 依據：
  - 問題和答案幾乎就是 L46 那一條原則的重述，考的是記憶，不是應用。
  - 另開一頁「2026 年起出差改用線上申請」放在部門底下，會和「出差規定」頁並存，變成兩個地方都在講出差規定，跟本文 L36「內容只有一份」和 GitLab 的單一來源原則衝突。order 6 對同一情境的處理是「重要的決定改寫成決策紀錄」（order 6 L79），決策紀錄記的是為什麼，規定本身應該更新原頁。
  - 「讀者不會搜『Q3』」要限定讀者：開過會的人可能真的照時間找，找不到的是沒開過會的新人。
- 改法：
  - 判準中：「看讀者是誰。開過會的人也許記得是 Q3，但新人不知道有這場會，他會搜想知道的那件事，例如『出差規定改了什麼』，所以對新人不好找。比較好的做法是：會議紀錄照時間放在封存區；會議裡改了規定，就直接更新『出差規定』那一頁；要留下為什麼這樣決定，另寫一份決策紀錄（order 8），兩頁互相連結。」
  - 英："It depends on the reader. People who attended may remember it was Q3, but a new hire doesn't know the meeting happened; they'll search for what they want to know, such as 'what changed in the business trip policy', so for them it's hard to find. A better approach: keep meeting notes in an archive by date; if the meeting changed a policy, update the business trip policy page itself; if you want to record why, write a separate decision record (order 8) and link the two."
  - 可選：把題目換成考應用的，例如「出差的表單在財務、規定在人資，新人找不到，該把出差規定搬到財務嗎？」→ 不搬，做入口頁。

### R6 🟡 今晚步驟 4 的三人樹狀測試，要說清楚不能拿來算成功率

- 位置：中／英 L100，對照 L64
- 依據：L64 才給了 62% 中位數與 90% 目標；三個人的結果套這兩個數字沒有意義。NN/g 的說法是質性樹狀測試只要少數人、不適合算統計，量化比較每棵樹要 50 人以上（`nng-tree-testing` L25、L40、L58）。
- 改法：步驟 4 末尾補，中「三個人只能看出哪裡容易走錯，不能算成功率，也不要拿去跟 62% 比。」英："Three people can show you where people go wrong, but not a success rate, so don't compare it with the 62% figure."

### R7 🟡 限制疊加、範圍不清，還有一句查證過程

- 位置：中／英 L93（另見 L25、L57）
- 原句（中）：「……Cozijn 那篇 20 人，而且是熟悉組織的員工……我沒有找到 2020 年後直接比較這兩種分法的實驗。NN/g 的建議多半來自他們的實務研究和觀察，背後的完整報告要付費，我只讀了公開文章。卡片分類的人數研究也只有單一案例。」
- 依據：
  - 規則「限制說明不要疊加」：Cozijn 20 人在 L25 已寫；Tullis 單一案例在 L57 已寫。
  - 「卡片分類的人數研究也只有單一案例」不準：NN/g 2024 引了 Lantz et al. 2019，另有 Dougalis & Katsanos 2025（`tullis-wood-2004` L51、`nng-card-sorting` L15）。本文引用的人數依據才是單一案例。
  - 「我只讀了公開文章」是查證過程；對讀者有用的是「公開文章沒附對照數據」（`nng-intranet-ia` L60）。
  - 「我沒有找到」需要範圍（規則「沒找到要寫範圍」）。
- 改法：
  - 中：「按部門和按任務的直接比較很少，上面兩個實驗都很小，Resnick 那篇是購物網站，『任務』指的是購物目的，不是工作任務。2020 年後的英文研究裡，沒有看到直接比較這兩種分法的實驗。NN/g 的建議多半來自他們的觀察，公開文章沒有附對照數據。」
  - 英："Direct comparisons of department and task organization are rare, both experiments above were small, and Resnick's was a shopping site, where a 'task' means a shopping goal, not a work task. In English-language research since 2020, I haven't seen an experiment directly comparing the two schemes. NN/g's recommendations mostly come from their observations, and the public articles don't include comparison data."

### R8 🟡 Cozijn 的標籤混淆和本文論點直接相關，卻沒提

- 位置：中／英 L25（以及 L27「標籤的影響比分類方式大」、例子 L77、L82 的「我要出差」「我要請假」）
- 依據：`cozijn-2007` L27、L83：組織式連結是名詞片語、任務式是動詞片語，結構和標籤措辭一起變；L34、L61、L79：第 6 題因為任務式標籤誤導受試者而被剔除，作者說任務式的標籤「requires special attention」。這兩點正好支持下一段「標籤比分類方式重要」，也提醒例子裡的入口頁標籤要小心。
- 改法：L25 末尾補一句，中：「另外，兩版的連結文字也不一樣（部門版是名詞、任務版是動詞），有一題還因為任務版的標籤誤導受試者而被剔除；作者自己也說，按任務分的標籤要特別花心思。」英："The two versions also differed in link wording (noun phrases for departments, verb phrases for tasks), and one subtask was dropped because the task version's labels misled participants; the authors themselves note that task-based labels need special care."

### R9 🟢 例子的入口頁標籤和本文自己的命名原則不一致

- 位置：中 L77、L82「我要出差」「我要請假」vs L36「出差」「請假」；英 "Going on a business trip"／"Taking leave" vs "Business trips"
- 依據：本文 L45「寫讀者會搜的字」；NN/g 2014 說按任務的標籤不需要用「I need to…」句型，硬套會讓關鍵字落到後面（`nng-intranet-ia` L25、L68）。
- 改法：樹裡改成「出差」「請假」（英 "Business trips"、"Taking leave"），和 L36 一致。

---

## post-polish

中國用語掃描：用常見替換表（信息、質量、用戶、默認、數據、文檔、項目、支持、優化、鏈接、軟件、程序、接口、網絡、數據庫、實現、渠道、反饋、獲取、基於、場景、模塊、登錄、點擊、菜單、導航、通過等）掃了中文檔，沒有命中。

### P1 🟢 「記錄／紀錄」與 order 6 不一致

- 位置：中 L46、L104、L106「會議記錄」
- 改法：統一成「會議紀錄」（order 6 已用「決策紀錄」）。

### P2 🟢 「質化」改成台灣學界較常用的「質性」

- 位置：中 L57「質化研究至少 15 人」
- 改法：「質性研究至少 15 人」。

### P3 🟢 兩段長句

- 位置：中 L25（「按任務分那組在做了幾題之後越來越快，但研究沒有直接比較……」）、L27（「結果標籤品質對完成時間……而且是按商品分的那組比較好」）
- 改法：L27 拆成三句，中：「結果標籤品質對完成時間、錯誤次數和滿意度都有明顯影響。分類方式對完成時間沒有顯著影響。它對錯誤和滿意度的影響主要出現在標籤差的時候，而且是按商品分的那組比較好。」L25 依 V1、V3、R8 改寫時順便拆句。

### P4 🟢 一條項目塞了好幾個數字

- 位置：中／英 L57（15、30–50、20–30）、L64（98、62%、90%）
- 依據：規則「每個主張最多一個數字」。
- 改法：L57 拆成兩條（「NN/g 的建議」、「原始研究」）；L64 拆成「基準」（62%）和「目標」（90%）兩條。

### P5 🟢 「第一下」偏口語

- 位置：中 L63、L100「第一下點哪裡」
- 改法：可改「第一次點擊點到哪裡」；保留口語也可以，但全篇要一致。

### P6 🟢 自我檢查的標籤和系列其他篇不一致

- 位置：英 L104、L106 "**Question:**"／"**Answer:**"
- 依據：order 0 英文版用 "**Q:**"／"**How to judge:**"。
- 改法：英改成 "**Q:**" 與 "**How to judge:**"。

## 修正紀錄（2026-10-22）

- 全部採用：V1–V8、R1（tldr、導言、小標與段首改為「分之前卡片分類、分完樹狀測試」；規劃表 order 7 範圍卡同步改）、R2（方案 A：左樹改「新人報到流程」，入口頁加連結）、R3、R4、R5、R6、R7、R8（Cozijn 標籤混淆另起一段）、R9、P1–P6（P5 統一為「第一次點擊」）。
- V3 採第二案：保留搜尋時間並寫出定義。
