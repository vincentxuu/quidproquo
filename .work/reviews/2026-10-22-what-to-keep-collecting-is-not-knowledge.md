# 審稿紀錄：收什麼：收集不等於知識庫（order 1）

- 中文：`src/content/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge.md`
- 英文：`src/content/posts/learning/2026-10-22-what-to-keep-collecting-is-not-knowledge-en.md`
- 審稿日期：2026-10-22；審稿者沒有參與寫作，只看定稿與研究材料。
- 證據來源：`.work/research/building-knowledge-bases/extractions/*.md`，需要時回 scratchpad `fulltext/`（finders-keepers.txt、kftf.txt、bruce2005w.txt、gtd-weekly.pdf）。非論文來源以 Exa `web_fetch_exa` 在 2026-10-22 重抓：zettelkasten.de Collector's Fallacy、Forte BASB overview；GTD 清單讀本機 PDF（`pdftotext`）。Groundlane 沒有用：任務書指定 Exa 做重抓。

## post-verify

### 🔵 Misframed（數字對，推論或條件錯）

1. **「三個都答『是』才收」與第 2 句的方向相反**（中 L64、L68、L80、L81、tldr；英 L64、L68、L80、L81、tldr）
   - 原句：「三個都答『是』才收」＋第 2 句「之後在別處找得回來嗎？」
   - 問題：第 2 句答「是」（找得回來）的意思是**不必存**。照字面套規則，找得回來的反而會被收；表格又寫官方文件「第 2 句否」、專案文章「三句都是」，兩處都跟問句的方向對不上。這不是來源問題，是判準本身的邏輯錯，讀者照做會做錯，排第一個修。
   - 建議改法：把第 2 句改成「只有這裡有嗎？」或「別處找不回來嗎？」，讓三句都是「是＝收」；tldr、表格、自我檢查、英文版（"Is this the only place I'd find it?"）一起改。
   - 依據：文章自己的規則句與表格。

2. **「追蹤 420 位使用者兩年」**（中 L17；英 L17 "followed 420 users … over two years"）
   - 依據：Van Kleek 2011 抽取紀錄「研究設計」：自願者是 2008/8–2010/8 兩年間陸續加入的，分析樣本的條件是「accumulated at least two weeks of tool use」。兩年是收資料的期間，不是每個人都被追蹤兩年。
   - 建議改法：「從 2008 到 2010 年收集了 420 位使用者、共 66,151 則筆記」；英文 "collected 66,151 notes from 420 users between 2008 and 2010"。

3. **「在這種工具裡，多數人選擇刪」**（中 L48；英 L48 "most people chose to delete"）
   - 依據：Van Kleek 2011 Figure 7：minimalists 201 人、packrats 165 人，分母 420，minimalists 佔 48%，沒有過半；而且四群加總 434 > 420（抽取紀錄「不一致處」第 4 點），人數本身就不乾淨。過半的是**筆記**：平均被刪機率 0.55，整體只留 33%。「筆記攤在側邊欄、刪一則只要一下」是作者的推論，論文沒有比較不同工具。
   - 建議改法：「List-it 的筆記多數最後被刪掉，平均只留下三分之一。人數最多的一群是寫完很快就刪的『極簡型』……這可能跟工具有關：筆記一直攤在側邊欄，刪一則只要一下。」

4. **「多存不會讓你多懂」**（中 L29；英 L29 "saving more does not make you understand more"）
   - 依據：Kalnikaite & Whittaker 2007 抽取紀錄：受試者是邊聽故事邊記筆記，量的是事後記得多少（OM accuracy），r=0.07。研究講的是「記筆記的量」和「記憶」，跟「存」或「懂」都不是同一件事。
   - 建議改法：「但方向很清楚：記得多，不會讓你記住更多。」英文 "taking more notes did not mean remembering more"。

5. **re-finding 的 76% 缺了條件，又被套到「知名網站首頁」**（中 L68；英 L68）
   - 依據：KFTF 抽取紀錄與 kftf.txt L223：只有 12 人；只測受試者自己評估「12 個月內再訪機率 ≥75%」的網站；有給提示；Table 2 只算提示有效的試次；而且「Home pages were excluded from the re-call test」。第一次就成功的方法裡，直接打網址佔 42%，可見多半是常去的網站。
   - 建議改法：在 76% 那句補條件：「他們請 12 位受試者，三到六個月後回頭找自己預期會再去的網站」。下一句改成「常去的網站、官方文件、維基百科條目，搜尋就找得回來」，「知名網站首頁」要刪，因為研究排除了首頁。

6. **Rutishauser：「兩週後」「人才敢先把分頁關掉」**（中 L56；英 L56）
   - 依據：Rutishauser 2026 抽取紀錄：57% 是整個介入期（平均 15.14 天）的累計，不是兩週後測一次。「存進去的頁面 88.43% 隨後被關掉」是事實；但全體分頁數下降不顯著（p=0.51），也有人分頁數顯著增加。「才敢關分頁」的證據主要是自評。
   - 建議改法：「研究期間（平均約兩週），暫存區的網頁有 57% 被重新處理過……存進暫存區的網頁，九成左右隨後就被關掉。」把「才敢」改成「比較容易」，或直接刪掉。

7. **「也沒有研究告訴我們多普遍」**（中 L90；英 L90 "no study tells us how common it is"）
   - 依據：Bravo-Adasme 2026 抽取紀錄「不一致處」第 1 點：這篇回顧沒有盛行率數據，也沒有引用盛行率研究。能說的是「這篇回顧沒有」，不能說「沒有任何研究」。
   - 建議改法：「這篇回顧也沒有找到多普遍的數字。」

8. **Whittaker & Hirschberg 的 premature filing 被寫成已確立的發現**（中 L58；英 L58）
   - 依據：抽取紀錄第 10 點：F1 原文是「One possible reason is premature filing」，摘要是「Filers may engage in premature filing」。另外 F3 的存取比例差異，作者自己提了替代解釋：filers 的資料比較多，兩組實際翻閱的絕對量差不多（4.10 vs 4.28 箱）。
   - 建議改法：「作者的解釋是 premature filing……」。「比例比較低」那句後面補半句：「兩組實際翻閱的量其實差不多，只是歸檔型存得多。」

### 🟡 Unverifiable／概括超出來源

9. **「兩套做法沒有被拿來直接比較過」**（中 L72；英 L72 "have never been compared head to head"）：這是全稱否定句，來源找不到。研究筆記 L129 只記錄了「方法本身沒有嚴謹比較研究」。建議縮成「我找不到比較這兩種做法的研究」，或直接刪掉。
10. **數位囤積的三要素**（中 L90「不斷取得、持續累積，以及刪除時感到失落或焦慮」；英 "loss or distress"）：原文三要素是 acquisition、accumulation、difficulty discarding；difficulty discarding 才「related to the feeling of loss or distress」。中文把第三項寫成「感到失落或焦慮」，漏了「難以刪除」，而且 distress 不等於焦慮。建議改成「取得、累積、難以刪除（刪的時候會失落或痛苦）」，英文改成 "difficulty discarding, often with a sense of loss or distress"。
11. **「很多筆記是放在側邊欄、看到就提醒的待辦」**（中 L17；英 "to-dos"）：論文的類別是 memory triggers，佔 66%，不等於待辦（to-do 是另一個形式類別）。建議改成「很多筆記是放在側邊欄、看到就會想起某件事的提醒」。
12. **「MIT 的研究團隊」**（中 L17；英 L17）：第四作者 schraefel 在 Southampton。小問題，可以改成「MIT 等校的研究者」，不改也行。
13. **「方法書給的頻率大多是一週一次」**（中 L60；英 "Method books"）：三個來源分別是清單 PDF、部落格和網站文章，都不是書，而且 zettelkasten.de 給的不是一週。建議改成「方法作者給的頻率多半是一週一次」。
14. **「寫不出來，代表你還沒讀」**（中 L70；英 L70）：zettelkasten.de 沒這樣說，這句是作者自己的推論，而且說得太死，讀過但沒有想法也很常見。建議改成「寫不出來，通常代表你還沒真的讀進去」。
15. **「雷達判讀用的訊號偵測」**（中 L33；英 "the theory behind reading radar"）：Jones 2004 沒有提到雷達；他引 Peterson 1954，用的比喻是狼來了。說 TSD 源自雷達研究是一般常識，可以留，但這句不是 Jones 說的。低風險，不必改。

### 🟢 Confirmed

- Van Kleek：66,151 則、420 人、19% 曾被關鍵字搜尋找出（「only 13,131 (19%) were ever retrieved in using keyword search」）；minimalists 人數最多、packrats 第二。
- zettelkasten.de（2014-01-20，Christian）：引文 "Why fallacy? Because 'to know about something' isn't the same as 'knowing something'." 逐字相符；「To collect is a reward in itself」；Eco《How to Write a Thesis》講影印與錯覺；「kept isn't read」逐字相符；「do research for one hour and no second more. Process the collected material until the stack is empty」相符（原文是起步值，之後可調）。
- Whittaker & Hirschberg：AT&T Labs、搬遷、15% 沒讀過（分母是原始檔案）、78% 保留、36% 是公開資料副本、歸檔型保留 16.3 箱對堆放型 8.8 箱（約 1.85 倍，「幾乎兩倍」可以）、過去一年存取比例 31.3% vs 41.8%。（抽取紀錄讀的是作者草稿，正式版只核到 49% 這個數字。）
- Kalnikaite & Whittaker：25 人；品質與 OM 是 r=0.4；引文 "the sheer volume of notes is unrelated to OM" 逐字相符；OM 的解釋正確；「相關分析、樣本也小」的但書正確（抽取紀錄另外指出，n=25 時 p<0.01 有疑點，正文寫「中度正相關」已經夠保守）。
- Jones 2004：理論框架；false positive／miss 兩種錯的成本與 Table 2 相符；引文 "The likelihood of a false positive is reduced only by increasing the likelihood of a miss, and vice versa." 逐字相符，出自 Figure 2 說明；「只能提高辨別能力」符合 vision #2。
- Bruce 2005：理論文章；手上資訊會被高估、多收的代價不明顯、門檻設得太低、儲存變便宜門檻就降低（l.86–97）；「預期的資訊需求」決定收藏成效，見摘要 Conclusion（bruce2005w.txt L17–18）。
- Neave 2019：英國在職者，不刪 email 的第一名理由是 "may come in useful in the future"，兩組排序相同；英文版引號內逐字相符。
- Malone 1983：桌上的文件堆有提醒功能；「Paradoxically, these forces can be self-defeating」，堆多了難找，提醒也被新東西蓋住。
- Rutishauser & Fritz 2026：蘇黎世大學、29 人、不分類的 Shelf、57%（40.82% 刪掉、16.18% 轉成群組）；引文 "Maybe I need it - let's keep it on the Shelf."（P8）逐字相符。
- GTD Weekly Review：第二項就是 Get “IN” to Zero（Get Clear 底下第二項）。
- Forte BASB overview（2023-05-01，2023-11-23 更新）：PARA 三問的順序（project → area → resource → 否則封存或不存）相符；「about once a week … process 10-20 items in just a few minutes」相符；"Keep only what resonates"、「analysis is time-consuming and tiring」相符。
- Bruce, Jones & Dumais 2004：leaving 的定義；三到六個月；第一次就成功的方法裡有 76% 不需要事先保存（42+18+16）。條件見上面第 5 點。
- Bravo-Adasme 2026：沒有統一定義；極簡者、收藏者、問題型囤積者三者是連續光譜；作者另提的 traditional 型位在極簡者與收藏者之間，還沒經過實證，屬於非問題型；後果多是相關研究，因果不明。
- Elsweiler 2008：不歸檔的人在「何時寄」「為何寄」記得比較多；引文 "just because a person remembers more … the most effective strategy to use." 逐字相符；「資料夾替他們記住了」是作者原本就提出的另一種解釋。

### 歸因標籤

全篇有 5 處歸因或但書標籤：L29「這是方法作者的主張」、L29「這是相關分析、樣本也小」、L46「Jones 和 Bruce 的文章都是理論框架」、L60「一週這個頻率是作者的經驗」、L98「不是實驗驗證過的流程」。超過 3 處，建議把 L46、L60 併進 L98「研究還沒回答的事」那一節，正文只保留 L29 的兩處。

範圍聲明：本次只檢查了文中已提出的約 40 條宣告，未評估文章對主題的覆蓋是否完整。
下一步（未完成前不能 commit）：post-review、post-polish。（本檔下面兩節就是。）

## post-review

### 機械檢查

- `pnpm verify`：只有 `check:series-plan` 是紅的，原因是缺本審稿紀錄（另外也缺 order 0 的紀錄 `.work/reviews/2026-10-22-knowledge-base-three-readers.md`，那是另一篇）。其餘項目都綠，包含 lang-parity、references。
- `pnpm check:tw`：0 blocking，0 to review。
- `pnpm check:links`：14 條連結。5 條 ACM DOI 回 403，這是 ACM 常見的擋機器人，需要人工確認；zettelkasten.de 回 TypeError，但 Exa 在同一天抓得到全文，判斷是腳本的連線問題，連結本身沒壞。
- 文章裡沒有 diagram 區塊，所以沒跑 diagram-preview。`pnpm astro check` 沒有跑，這篇純 Markdown，風險低。

### 🔴 必修

1. **判準方向錯誤**（同 post-verify 第 1 點）。這一條同時是教學問題：讀完後讀者能做的，本來應該是「用判準決定要不要收」，但規則本身會讓人收錯。
2. **第 1 句答不出來時，處理方式前後矛盾**（中 L66 vs L82；英同位置）
   - L66：「三個都答不出來，就封存或不存。」
   - L82 表格：「第 1 句答不出來：留在收件匣，週末再看；兩週沒動就刪。」
   - L64 的規則只說了「三個都是」和「前兩個是、第三個否」兩種情況，第 1 句否、第 2 句否該怎麼處理沒有交代。
   - 建議：在 L64 補一張完整的決策順序（例如：第 2 句否 → 不存；第 1 句否 → 收件匣，兩週沒動就刪；第 3 句否 → 收件匣），L66 的 Forte 那句改成「Forte 的做法是三個都答不出來就封存或不存，這裡放寬成先進收件匣」。
3. **inline 來源連結**（步驟 8.5）：下面這些句子有數字或研究結論，但該句沒有連結（連結只出現在第一次提到時）。
   - L46「保留了 78% 的紙本檔案」（Whittaker & Hirschberg）
   - L48「(Van Kleek et al. 2011)」是純文字括號，不是連結
   - L58「歸檔型保留的紙本幾乎是堆放型的兩倍」
   - L60「zettelkasten.de 的建議更短」
   - L66「Bruce 把這叫做『預期的資訊需求』」
   - L68「有 36% 是公開資料的副本」
   - L72「他建議存『resonates』的東西」（Forte）
   - 建議：每處在姓名或數字上補同一個連結，英文版同步。

### 🟡 建議修

4. **「找得回來就不存」缺反證**（L68、L106）：同一篇 Whittaker & Hirschberg 就記錄了人保留公開資料副本的理由，包括隨手可得、提醒、不信任線上來源；有受訪者說「not kept things because it was on line, and now, it's not on-line. And I'm in trouble」。Jones 2004 也把「information out there … could change or disappear」列為 keep nothing 的限制。建議在第 2 句後面補一句例外：會改版或消失的頁面（部落格文、特定版本的文件）要存自己的摘要或封存連結。
5. **Forte 的定位前後打架**（L66 vs L72）：第 1 句用的是 Forte 的 PARA 三問，L72 又說「Forte 本人的判準和這套相反」。其實 Forte 把兩件事分開：收的時候憑 resonates，每週處理收件匣時才問 PARA 三問。建議 L72 改成「Forte 在『收』這一步的判準更寬：……到每週整理時才問上面那三個問題」，這樣第 1 句和 L72 就接得上。
6. **例子的「4 到 6 則」算不出來**（L86）：確定會收的只有 4 則專案文章；社群貼文最多 3 則、好奇長文 2 則、技術文 5 則都還待定。4 到 6 是怎麼來的沒有交代。建議寫出假設，例如「4 則專案文章，加上社群貼文裡你真的有想法的一兩則」。
7. **第 3 句不通過的處理方式有三種說法**：L64 說進收件匣、L83 表格說「沒有就刪」、L103 說「不存，或標成『待看』」。建議統一成一種。
8. **主題歸屬（6.8）**：L92–96 Elsweiler「不整理的人記得比較多」講的是歸檔策略好不好，屬於 order 2「到底要不要分類」的範圍；規劃表 order 2 的對應來源也列了「Najork 轉述的 Elsweiler」當反證（order 1 列的是 Najork）。建議這節縮成一兩句當分界，加一句「歸檔到底有沒有用，order 2 再談」，細節留給 order 2，避免兩篇各寫一份、日後各自過期。L58 的 premature filing 跟收件匣有關，可以留。
9. **斷崖處理**（規劃表「0→各段第一篇：order 1 開頭用一段補上該段的總覽」）：L19 只提到 order 2、3，沒有交代個人段的 order 4（工具）和 order 5（維護）。建議補半句：「之後還有工具（order 4）與維護（order 5）」。
10. **圖表（9.3）**：「收進收件匣 → 每週清 → 進知識庫／刪掉／再留一週（兩週沒動就刪）」是一個有分支的流程，目前散在 L64、L82、L104 三處。建議在「判準」一節末畫一張 flow-diagram，同時把第 2 點的決策順序固定下來。訊號偵測的 2×2 用表格就夠了，不用改成圖。
11. **type: guide 的結構**：guide 預期有「常見錯誤」。L44 已經講了「什麼都存／盡量少存都只是換一種錯」，可以考慮在「今晚可以做的事」後面加兩三條常見失敗：收件匣變成第二個囤積處、一次清太多、只存不寫那一句。不加也可以。

### 🟢 可選

12. tags 可以加站內既有的 `knowledge-base`（6 篇在用），方便系列互相連結；目前 4 個 tag 合規。
13. 台灣讀者位置（6.65）：主題是全球性的，不必硬塞台灣案例。L102「傳給自己的訊息」可以具體寫成「LINE 傳給自己的訊息」，台灣讀者馬上認得出來。
14. 自我檢查只有一題，符合範圍卡。也可以加一題測「收件匣多久清」，這是「讀完後讀者能」的另一半，例如「收件匣累積到 80 則還沒清，該怎麼處理？」。

### 範圍卡對照

- 聚焦問題、邊界（收集者謬誤、訊號偵測兩種錯、收件匣與頻率）、例子（20 則連結）、自我檢查（十大 AI 工具清單文）都有兌現。不講的分類、連結、工具也都守住了，只有 Elsweiler 那段越界（第 8 點）。
- 「讀完後讀者能用判準決定要不要收」這一項，目前被第 1、2 點卡住，修好才算兌現。

## post-polish

掃描結果（中文）：長句 6 句；但書段落 25%（綠）；引述區塊 3（綠）；數字密度 2 段 ≥4（L17：5 個，L68：4 個）；模板化轉折 0；一般英文術語 0；phrase ledger 0 命中。

### 🟡 建議修

1. **開頭第一段數字太密**（L17，5 個數字）：420、兩年、66,151、19%、81%。讀者要拿來判斷的只有 19%。建議把 66,151 移到括號或刪掉，兩年按 post-verify 第 2 點改寫。
2. **長句**
   - L29「另一項小型研究找了 25 個人……Kalnikaite 和 Whittaker 發現筆記品質和事後記得多少有中度正相關，筆記的數量卻和記憶無關」（69 字）：在「中度正相關」後面斷句。
   - L66 第 1 句（82 字）：Forte 的三個追問改成短句條列，或拆成「先問專案。沒有的話，問長期負責的領域。再沒有，問感興趣的主題」。
   - L111 自我檢查（95 字）：三個追問各自成一句。
3. **姓名當主詞太多**：掃描只算到 2 處（它只看段首），逐句數約 12 處：Whittaker 和 Hirschberg ×4、Kalnikaite 和 Whittaker、Jones、Bruce ×2、Neave、Malone、Rutishauser 和 Fritz、Forte ×3、Elsweiler。超過閾值 6。建議把一般讀者不需要記的名字移進括號連結，例如 L46「有人在辦公室搬遷時清點紙本，員工在有機會大掃除的情況下，仍保留了 78%（[Whittaker & Hirschberg 2001](…)）」；Forte、Jones 這類後文還會再出現的名字留著。
4. **L56 中文正文夾整句英文引文**：「Maybe I need it - let's keep it on the Shelf.」建議改成「『也許用得到，先放上 Shelf 吧。』」，原文放在括號或連結裡。這句只是心態描述，原句的措辭不比轉述有力。
5. **L46 一段塞了兩件事**：前半講 Bruce 的理論，後半是兩個觀察。建議在「Jones 和 Bruce 的文章都是理論框架」處分段。
6. **「受試者描述的心態很典型」（中 L56）vs 「One participant put the mindset neatly」（英 L56）**：兩版的意思不同，中文說典型，英文說講得好。依抽取紀錄，有 21 人說過類似的話，用「很典型」有根據；建議英文改成 "a typical line"，或兩版都寫「一位受試者說」。
7. **H2「知道有這篇，不等於知道這篇」**：「這篇」容易被讀成本文。建議改成「知道有這篇文章，不等於讀過它」，或「存了，不等於知道」。
8. **L70「onboarding 文件」**：台灣職場常用這個詞，但中文已經有自然的說法，可以改成「新人到職文件」。

### 英文版

9. L60 `"Get "IN" to Zero"`：引號裡又有直式雙引號，讀起來很卡。建議改成 `"Get 'IN' to Zero"` 或照原文用彎引號 `Get “IN” to Zero`。
10. L66 "which resource topic of interest?"：resource 和 topic 疊在一起。建議改成 "If none, which topic of interest does it belong to?"。
11. L44 "Loosening or tightening the threshold only reduces one error by increasing the other." 跟 L42 的引文幾乎重複。建議改成 "Move the threshold either way and you only trade one error for the other."，跟 tldr 的說法一致。
12. L90「loss or distress」與中文「失落或焦慮」對不上（見 post-verify 第 10 點），兩版要一起改。
13. 其餘段落讀起來自然，沒有翻譯腔。中英兩版的段落、數字、連結逐段對過，除了第 6、12 點，意思都一致。

### 保護片段

所有引號內的英文原句（Collector's Fallacy、Jones、Kalnikaite、Neave、Rutishauser、Elsweiler）都核對過是逐字引文，潤稿時不要動。

逐項看過，沒有其他問題。

## 修正紀錄（2026-10-22，寫作者依本審稿修改）

中英兩版同步。
- 🔴 第 2 句改成「只有這裡有嗎？」，三句都是「是＝收」；tldr、例子表、自我檢查、英文版一起改。
- 🔴 決策順序統一成一段「處理方式」：第 2 句否→只放連結；第 1 句否→刪；前兩句是、第 3 句寫不出→留收件匣，兩週後仍寫不出就刪。例子表與「今晚可以做的事」照此改寫，並寫明進知識庫的是 4 則專案文章加一兩則。
- 🔴 List-it 改「分析 420 位使用者留下的 6 萬多則筆記」，拿掉「追蹤兩年」；「多數人選擇刪」改成「人數最多的極簡型約占一半、所有筆記只留約三分之一」，刪掉側邊欄因果推論。
- 🔴 76% 補 12 人、預期會再去的網站、首頁不算；例子拿掉「知名網站首頁」。
- 🔴 Kalnikaite 結論改「筆記寫得多，不代表記得住」。
- 🔴 inline 連結：78%、36%、兩倍、Bruce、zettelkasten.de 一小時、Van Kleek 第二次出現都補上連結。
- Rutishauser 改「平均約兩週的研究期間裡」、結論改為研究者的設計建議，拿掉「人才敢關分頁」。
- 數位囤積：三要素改為取得、累積、難以刪除（伴隨失落或痛苦）；「沒有研究告訴我們多普遍」改「這篇回顧沒有找到盛行率數字」；焦慮改痛苦／distress。
- premature filing 改為「作者提出的解釋」。
- Forte 定位：改成「存的時候憑直覺（resonates）、每週清收件匣時才問三句」，與第 1 句一致，刪掉「判準相反」與「兩套做法沒被比較過」的全稱句。
- 補反證：Whittaker & Hirschberg 受訪者「因為在網路上而丟掉，現在網頁沒了」，並給「會消失的頁面存副本或摘要」的動作。
- Elsweiler 縮成分界句，轉給 order 2。
- 開頭補 order 4、5；第一段數字改成「6 萬多則」「約五分之一」降密度；H2 改「知道有一篇文章，不等於知道它在說什麼」；Shelf 英文引句移除；英文版巢狀引號與 resource topic 重疊改寫。
- 未採納：收件匣流程圖（文字決策段已足夠，下一輪可補）；研究者姓名當主詞的數量只部分降低。
