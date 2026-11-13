# 審稿報告：order 7〈教學文章要不要做可操作的圖〉

審稿者：rev-o07（獨立，未參與撰寫）。只審不改檔。

## 檔案指紋

| 檔案 | 審前（2026-10-14 12:19:54） | 審後（12:26:07） |
|---|---|---|
| `src/content/posts/learning/2026-10-14-interactive-figures-in-teaching-articles.md` | `de9428b5…7f256e` | `de9428b5…7f256e`（未變） |
| `src/content/posts/learning/2026-10-13-diagrams-in-teaching-articles.md`（第 2 篇） | `593405d7…7db2` | `1bf91f1f…4728`（**審稿期間有人改了**，見第 2 篇一節） |
| `src/content/posts/learning/2026-10-13-teaching-text-questions-feedback.md`（第 9 篇） | `04ef8bf7…a583` | 同左（未變） |
| 第 2 篇英文稿 | 未記 | `ecd2db6c…91bd`（12:24 讀到時已同步改了預測相關段落） |

行號以 order 7 文章（未變）為準；第 2 篇行號以 12:24 的版本為準。

## 審核範圍與方法

- 12 組來源全部回抽取紀錄核對：`hundhausen2002`、`kim2017-explaining-gap`、`mosca2021-interaction`、`conlen2019-active-reading`、`dangelo2014`、`berney2016`、`castro-alonso2019`、`ploetzner2021`、`hohman2020-interactive-articles`、`tse2016-malofiej`、`aisch2017-defense`、`distill2021-hiatus`、`patel2014-redblob-making-of`。前四份與 D'Angelo、Hohman、Tse、Aisch、Distill 整份讀完，其餘讀相關節。
- 12 份都沒有 ⚠ 標記；`_audit/` 裡全部是「通過」（group-01、02、03、04、06、07、10、11、14），`provenance.md` 補了 Kim、Castro-Alonso、Ericson 的合法來源。
- 回原文檔只做了一處：Red Blob Games A* 製作筆記的「重寫幾次」（`.research/raw/learning-content/q2-interactive/redblob-astar-making.txt` L123、L125）。Aisch 的新網址另外抓頁面確認標題與引文。
- 跑了 `node scripts/check-tw-terms.mjs`（0 命中）與 `node scripts/check-post-quality.mjs`（1 ERROR：英文版連結不存在，預期；1 WARN：tag `mobile`）。
- 站內連結 5 個都存在；外部連結 22 個用 curl 檢查。

## 必須修

1. **L164 Patel「寫到一半會把圖的程式重寫兩三次」與原文、附錄都不符。** 原文 A* 製作筆記 L123「I rewrote the diagram system.」、L125「I rewrote the diagram system again.」：那一篇重寫兩次，而且是那一篇的經過，不是慣常做法。附錄 L275 已寫對（「寫到後面重寫圖的系統兩次」）。抽取紀錄 `patel2014-redblob-making-of.md` 第 110 行的摘要句寫「兩三次」，但同檔 A10 逐步列的是兩次；以 A10 與原文為準。改成「做 A* 那篇時，寫到後面把圖的程式重寫了兩次」。

2. **L106、L261 把抽取者自己對出來的結果寫成既成事實。** 「上面的『14 個裡 10 個』把這兩個也算成支持」「認知建構論 14 個裡 10 個顯著（含 Byrne 那 2 個）」：`hundhausen2002.md` L78 明寫「原文沒有明說這一點，是我對出來的」。依證據規則要寫成「我照表 2 逐一對過」「原文沒有明說」。第 2 篇在審稿期間已經這樣改（第 2 篇 L157），兩篇寫法要一致。

3. **L196 對第 2 篇的描述已經過期。** 「第 2 篇把『先問再給圖』列為演算法視覺化實驗支持的做法」：12:22 起第 2 篇的 tldr、L22、L30、L167、L216、L354 都改成「讓學生動手這一大類有支持；單獨測『預測』的實驗結果不一致」。這句要改成描述現況，或改寫成不依賴第 2 篇舊文字的說法（例如「第 2 篇原本把……，已依本篇的精讀結果修正」，並看第 2 篇最後定稿再定）。另見下面「建議修」第 1 項：這一段放在「來源說法不同的地方」不合適。

4. **L20「起因在第 2 篇的結尾」與站內現況不符。** 成本對照表在第 2 篇的「靜態圖、分格圖、動畫、互動圖」一節（L207–218），全文 475 行，後面還有「讓讀者自己畫」「手機與無障礙」等七節。改成「起因在第 2 篇的成本對照表」。

5. **Aisch 的連結失效（L152、L291）。** `https://www.vis4.net/blog/2017/03/in-defense-of-interactive-graphics/` 現在回 404。同一篇在 `https://www.vis4.net/blog/in-defense-of-interactive-graphics/`（200，標題〈In Defense of Interactive Graphics〉、日期 2017-03-31、引文「85% of readers didn't ignore the graphic, they just didn't click the button」都對得上）。兩處換成新網址；抽取紀錄檔頭的網址也該補一筆。舊網址在 Wayback 有 2023-12-14 的存檔，可以當備援。

## 建議修

1. **L196 這一段的位置與內容**：「第 2 篇把……」是本站對自己舊說法的更正，不是來源之間的衝突，建議移到「對照本站的做法」或系列內的更正說明。內容上補一項：Hansen 等人 Study VI 把 HalVis 的互動提問拿掉，結果沒有顯著差異（`hundhausen2002.md` L50、L99）。這是 Naps 分類裡「回應」（回答關於圖的問題）最接近的單獨操弄，和本站「先問再給圖」最對題，方向和 Jarc 一致。
2. **L80、L38、L202「兩份的名單大量重疊」沒有數字撐**。紀錄能證實的只有 Castro-Alonso 有 8 篇是從 Berney 等三份統合分析的參考文獻補來的（`castro-alonso2019.md` L19），其餘 37 篇和 Berney 重疊多少沒有人數過。建議寫成「有 8 篇是從 Berney 等三份統合分析的參考文獻補來的，兩份收錄的研究有重疊，我沒有逐篇對過重疊多少」，結論「不能當兩份獨立證據」照樣成立。
3. **L68「多數有老師帶」**：`dangelo2014.md` 第 4 點說原文有教學情境欄位但「結果裡沒有報告分布」。建議改成「報告沒有給教學情境的分布」或刪掉。
4. **L265 附錄「正文的討論段把降維那篇的 59% 寫成『約一半』，兩處分母不同」**：原文 7.1 那句也寫「who made it to the end」，分母相同，差在 59% 被寫成 roughly half。全體讀者的約 45% 才是另一個分母。改成「討論段把讀到文末者的 59% 寫成『約一半』」。
5. **L251 附錄「報告內部有十二處數字不一致」**：紀錄列 12 項，但第 11 項是用詞（把效果量叫 studies），第 12 項紀錄自己說「不算矛盾」。改成「十處數字對不起來，另有兩處用詞或單位要注意」。同段「未註明 24 份」緊接在評量者之後，讀起來像是「評量者未註明」（那個數字是 17）；改成「施測時間未註明 24 份」。
6. **L107、L239「24 個裡有 14 個來自兩份來源」**：是照 Table 2 數的（`hundhausen2002.md` L16 註明「是我照表數的」）。數表本身是事實，但照規則可以加「我照表 2 數的」。
7. **標題沒有結論**。現在是主題清單（「課堂模擬、加上互動的圖、讀者使用率與製作成本」）。writing-guide 要標題講對象與結論，可以考慮「教學文章要不要做可操作的圖：加上互動本身沒有測到效果，看的是讀者拿它做什麼」這一類。
8. **tldr「一位長期做互動教學的作者說一篇要一到五個月」少了「含學會演算法」**，結論表與正文都有帶，tldr 應一併帶上，否則讀起來像純製作工時。
9. **L86 `arXiv:2103.01701` 是純文字**，writing-guide L346 要求 arXiv ID 出現時要可點。前面已有連結，可以把括號裡的 ID 刪掉或也做成連結。
10. **L20「這正是 Red Blob Games 的 A* 入門那種可拖曳圖最常做的題材」**：「最常做」沒有來源。改成「也是 Red Blob Games 的 A* 入門這類可拖曳圖做的題材」。
11. **L211「自我檢查題放在圖或例子旁邊」與現行規格不同**：`course-guide-contract.md` L54 規定「每個主要小節結尾放一題」。這一列是提議改規格，表裡要標明「與現行規格不同」，否則讀者會以為本站已經這樣做。
12. **L118「先預測只在圖上有效」**：Kim 沒有直接檢定呈現方式與做法的交互作用（正文 L116 自己也寫了）。這裡改成「先預測只在圖的條件測到效果」，和 L116 一致。
13. **開頭 L22–30 的研究過程**：「我精讀了十二組來源」「每一份都從頭讀到尾並留有抽取紀錄」是過程描述；取樣偏誤那一段（L30）是必要的，前面的來源分類可以縮成一句。附錄 L251「上面的數字都對過 PDF 版面」同理。不影響事實，屬寫法。
14. **L132–133 降維那篇的兩列**：「點了按鈕才展開的其他演算法說明 全體約 45%」與「技術細節按鈕 中位數 0」在原文的用詞是同一組「algorithm details button(s)」（`conlen2019-active-reading.md` #16、#22），原文本身沒分清楚是一個按鈕還是三個切換鈕。兩列並列時讀者會以為是兩個不同元件、而且一個 45% 一個 0 互相矛盾。建議合成一列或加註「原文對這兩個按鈕的用詞不一致」。
15. **英文版連結**：`check-post-quality` 把它判成 ERROR，commit 時 `verify:staged` 會擋。英文版補上之前，這行要先拿掉或等英文稿一起進。

## 作者請我特別看的三件事

### 一、第 2 篇把「先問再給圖」寫成有支持，是不是證據過強；哪幾行要回修

**判斷：作者說得對，原稿是證據過強。** 依據 `hundhausen2002.md`：

- 能單獨看出「預測」效果的只有 Jarc 等人一個實驗：可預測對不可預測，後測沒有顯著差異，只是預測組花的時間顯著較多（L54、L98）。
- Byrne 等人兩個顯著結果，原文明說「the individual effects of prediction and animation could not be disentangled statistically」（L62）。
- 和「先問」最接近的另一個操弄：Hansen Study VI 拿掉 HalVis 的互動提問，沒有顯著差異（L50、L99）。
- 71% 的「認知建構論」那一類，主要是自己設計輸入（Lawrence Ch.6、Ch.9）、HalVis 整套對文字或講課、Kann 的看動畫；而且對照組補上同等活動（Hansen III、Gurka）差距就消失（L102–103）。所以撐得住的是「讓學生做事」這一大類，不是「先問再給圖」這個做法，更不能說明這件事一定要靠圖。
- Kim 2017（第 2 篇沒有引）是資料圖表上「先預測」有效的直接實驗，但只預測的效果最小、文字條件無效、高熟悉度與低熟悉度都有不顯著的情況。可以引來說「先預測在某些條件下有效」，不能撐「演算法視覺化的實驗支持」。

**審稿期間（12:22 前後）第 2 篇已被改過**，tldr、L22、L30、L157（新增）、L163（Byrne 的例外改成 Kann）、L167、L216、L354 都已降調，中英兩版都改了。對照 12:24 的版本，還要回修的是：

| 第 2 篇行號 | 現況 | 建議 |
|---|---|---|
| L30、L216、L354、tldr | 「單獨測『預測』的兩個實驗」 | 計數不對。Jarc 一個加 Byrne 兩個是三個實驗，而且 Byrne 那兩個不算「單獨測」。改成「能把預測單獨分開的只有 Jarc 一個實驗，後測沒有差異；Byrne 等人的兩個實驗分不出是預測還是動畫的功勞」。L167 已經是這個意思，其他幾處要對齊 |
| L146 小標「讀者要動手才有用」 | 仍是強斷言 | 改成「讀者動手比較容易測到差異」之類；「才有用」把 Naps 的待驗證假設寫成結論 |
| L163 之後 | 沒提對照組補上活動、差距就消失 | 加一句 Hansen Study III 與 Gurka：只讀文字的組另外做練習時，和視覺化組沒有顯著差異。這一點直接影響「動手要不要靠圖」，order 7 已寫，第 2 篇應該一致 |
| L167 或 L216 | 沒提 Hansen Study VI | 加「拿掉互動提問的版本也沒有顯著差異」，這是和「先問」最對題的反向結果 |
| L30 建議欄「前面放一題『先猜下一步』」 | 依據降調了，建議沒跟著改 | 依 order 7 L211 的判斷，改成要讀者說出下一步與理由（Kim 的打字解釋在圖與文字都有效，只預測最弱） |
| L455 參考資料 | Hundhausen「讀了摘要、第 3 節開頭、5.1.3 到 5.2.1 節與第 6 節」 | 與新增的 L157「我照表 2 逐一對過」矛盾（表 2 在第 3 節）；而且 writing-guide 規定只讀部分的不能列。現在已有整份讀完的抽取紀錄，讀取範圍要改成全文 |

### 二、本站自我檢查答案收在 `<details>` 的判斷寫法（L213、L215）

**判斷：結論（保留摺疊、標成本站選擇）可以，但「和上一條方向相反」把衝突講大了，用 Conlen 的「約一半」來推也太直接。** 理由：

1. Conlen 的 45%／59% 是「不影響高層次重點」的補充內容（`conlen2019-active-reading.md` #15），讀者沒有被要求去點。自我檢查的答案前面有一道題，讀者有理由點開，兩件事的動機不同，數字不能直接搬。最多只能寫成我的推論，並說明情境不同。
2. Aisch 的規則本身就有例外：「don't make the user click or hover to see it (unless you really want to)」，括號連到的正是紐約時報的 You Draw It：先讓讀者畫出猜測，再揭曉資料（`aisch2017-defense.md` #4）。也就是說，「故意把答案藏起來，等讀者先想」在 Aisch 的框架裡是被允許的例外，不是違反規則。Tse 的第二條規則講的是「important for readers to see」的內容。
3. 真正和「重要內容不要藏」衝突的，是答案裡出現正文沒有講過的新說明。我抽看了一篇（CS229 第 2 講 L88–96），答案裡的「和輸入 x 是文字還是數字無關」在題目前的正文找不到同樣的話。這種情況不點開的人就讀不到。只看了一題，不能說普遍，但這是比「摺不摺」更具體、可檢查的規則。

建議改寫成：答案可以摺疊（Aisch 的例外就是這種設計）；但答案裡不能放正文沒有的新解釋，需要的話先寫回正文，答案只做對照。L215 的「摺疊外面留一句判準提示」有兩個疑慮：提示本身可能洩題，讓讀者少了先想的那一步；第 9 篇已把「判準」當成答案的替代品，放在摺疊外面等於不摺。若要保留這個做法，要寫明它是在兩個風險之間的取捨，而且讀者會不會點開答案是 order 10 的主題，這裡不宜先定案。L229（今晚第 1 件事）的「對照：第幾步開始兩者不同」同樣會先透露答案的方向。

表格那一列的性質欄「本站的選擇，沒有研究可以裁決」可以保留，依據欄改成「Conlen 的補充內容約一半沒人點開（情境不同）；Aisch 的規則把先想再揭曉列為例外」。

### 三、對第 9 篇說法的轉述（L215）

**判斷：轉述正確。** 對照第 9 篇（hash `04ef8bf7`，審稿期間未變）：

- 「答案要不要摺疊沒有找到直接的研究」：第 9 篇 L84「要不要把答案摺疊起來，我沒有找到直接的研究」，L207、L244 也列為未解。
- 「『先作答再看答案』也只是沒有直接證據的做法」：第 9 篇 L64「這個建議要降成沒有直接證據的個人做法」，指的是在題目上寫明「先寫下你的答案再往下看」。order 7 的轉述比原句略寬（第 9 篇講的是「要求讀者先寫下來」這個指示，不是「先作答」這件事的全部），可以改成「在題目上要求讀者先寫下答案，也只是沒有直接證據的做法」，更貼原意。不改也不算錯。

## 沒問題的項目

- **Mosca 等**：472 人、53% 對 57%、約兩千人五種互動、高空間能力 hover 約 60% 對 80%、43%／44%、70% 對 40% 與自選限制、靜態組借自實驗一、p = 0.05 與重算約 0.045 都標明是本站計算、四次交互作用檢定都不顯著、討論段前後矛盾，全部與紀錄相符。附錄的人數、底薪、性別比、各條件答對率逐項對過。
- **Kim 等**：約 370 人、九個條件、三分鐘後回憶 12 個值、四種做法在圖上都有效且彼此無差別、只預測最小、文字條件只有打字解釋有效、熟悉與陌生資料的結果、75.9% 定錨、沒有理解題、對照組重打無關文字，都相符。
- **Conlen 等**：85%、45%／59%、中位數 0、14%／2%、約 5%、23%／6%、手機 23–52%、三篇的作者關係、七萬兩千個工作階段標明是加總，都相符。
- **D'Angelo 等**：59 篇 128 個效果量、0.62、科學 0.67、數學 −0.15、探究不顯著、結構 0.88 對 0.42 只在科學顯著、對照組沒有編碼、5／76 超過兩週，都相符。
- **Berney 與 Bétrancourt**：0.226、四級控制的數字與「跨研究、不是操弄」的限定、只分析播放控制、抽象表徵與領域子群、p 用表的 0.03、完整控制 6 篇其中一篇占 4 個（標明是本站從附錄數的），都相符。
- **Castro-Alonso、Ploetzner**：數字、動態的定義、動畫明寫 non-interactive、作者未分析互動功能，都相符。
- **Hohman、Tse、Aisch、Distill、Patel 的其他部分**：前言兩句無引用對上文末的「limited empirical evaluation」、「anecdote」、四個月、Tse 三條規則與投影片無數字、Aisch 的數字來源與轉述路徑、Distill 50 小時是編輯協助時間、倦怠的是志願編輯、Patel 的 1 到 5 個月含學演算法、兩句引文，都相符。英文引文 4 處（Hohman、Aisch、Patel 兩處見 L173）逐字對過紀錄。
- **證據規則**：沒有引用 ⚠ 紀錄；Karich 2014、Landers 與 Reddock 2017 寫成「沒讀到合法公開的全文」、沒有引數字、沒有列進參考資料；不顯著都寫成「沒有測到差異」或「不顯著」；相關（Mosca 動手與否）沒有寫成因果；推論都有當場標明（第 2 點例外已列在必須修）。
- **結論與證據**：開頭交代取樣偏誤與最大的缺口；「來源說法不同的地方」並列不選邊；「證據的限制」涵蓋了主要限制，包括利害關係與跨研究比較。
- **本站現況**（12:24 查）：posts 底下沒有任何程式碼區塊外的 `<script>`、`<canvas>`、`<input>`、`<iframe>`、`<svg>`，「沒有找到任何一篇放了可操作的圖」成立；`<details>` 自我檢查與頁內播放影片時間連結（commit fc7e403f）都屬實；第 2 篇成本對照表「可操作的圖」那一列的文字引述正確。
- **連結**：站內 5 個都存在。外部 22 個：19 個 200；Wiley 與兩個 ACM DOI 直接 curl 回 403，不跟隨轉址時是 302 到出版者頁，屬於擋爬蟲，連結本身正常；Aisch 404 已列在必須修。
- **用語**：`check-tw-terms` 0 命中；人工掃替換表沒有發現問題。「支持」在本文都是「證據支持」的意思，不是 software support，不在替換範圍。

## 我沒做的事

- 沒有回原文檔逐項核對每個數字，以抽取紀錄與 `_audit/` 為準；只有 Red Blob「重寫幾次」與 Aisch 新網址回原件查了。
- 沒有讀第 2 篇全文與第 2 篇英文稿全文，只看了和預測、Hundhausen、Conlen、成本對照有關的段落；第 2 篇審稿期間仍在變動，上表以 12:24 的版本為準。
- 中英一致：依指派略過（order 7 只有中文稿）。
- 自我檢查答案裡「新說明不在正文」只抽了一題，沒有掃全站。
- 沒有跑 `pnpm verify`、`pnpm dev`、build，沒有 commit。

## 2026-10-14 複審

複審時間 12:42–12:44，三檔指紋前後相同。指紋：order 7 `39f90333…4ff4c0`；第 2 篇中文 `87a468c1…000047`；第 2 篇英文 `c4ea319f…7c37540`。

### 必須修

1. **order 7 L207 對第 2 篇的描述又過期了。** 「第 2 篇的成本對照表把『先問再給圖』列為最便宜的互動。讀完 Hundhausen 全文，這一列的依據要說得更窄」：第 2 篇 L216 現在已經寫成「讓學生動手這一大類有支持；能單獨分開『預測』的一個實驗沒有差異，拿掉互動提問的實驗也沒有差異」，和 order 7 這一段的內容一樣。照現在的寫法，讀者會以為第 2 篇還沒改。改成描述第 2 篇現在的說法（例如「第 2 篇成本對照表裡的『先問再給圖』，依據只撐得住『讓學生做事』這一大類，理由是……」），或者直接刪掉「要說得更窄」這種要求修改的語氣。
2. **第 2 篇 L22（中英同）和自己的 tldr、L30、L216、L354 不一致。** L22 還寫「『預測』這一步本身的直接證據不一致」（英文「is mixed」）。其他各處已經改成「能把預測單獨分開的只有一個實驗，沒有測到差異」。只有一個不顯著的實驗，不能叫「不一致」。改成「直接證據只有一個實驗，沒有測到差異」。

### 建議修

1. **order 7「至少 13 篇兩邊都收」（L70、L192）**：我用兩篇的表比對作者名與年份，結果相同，確實至少有 13 篇（Adesope 2013、Ayres 2009、Lin 2011、Mayer 2005、Mayer 2007、Münzer 2009、Paik 2013、Park 1992、Rieber 1990、Scheiter 2006、Thompson 1990、Wong 2009、Wu 2013；Castro-Alonso 的表 2 共 46 篇）。我的比對靠字串，跨行斷開的名字可能漏掉，所以「至少」是對的寫法。但這個數字沒有記在任何抽取紀錄裡，建議把清單補進 `castro-alonso2019.md`，以後才查得到。
2. **第 2 篇 L30**：「要讀者寫出理由是借自我解釋的研究」沒有寫是哪份研究，也沒有連到第 1 篇。另外，第 2 篇自己的 L243 寫了 Barbieri 等人 2023 年的結果：數學範例加上自我解釋提示，效果反而比較低（作者說只是描述性的）。兩處放在同一篇，應該在 L30 或限制裡交代一句，不然讀者會覺得前後矛盾。
3. **第 2 篇 L354**：「依據最直接的改法」接著又說「這一題的效果我不能保證」，兩句的語氣衝突。建議把「依據最直接的」改成「成本最低的」之類（英文「with the most direct basis」同改）。

### 已確認修好

- order 7 必須修 1–5 全部修好：Patel 改成「做 A* 那篇時，寫到後面把圖的程式重寫了兩次」（L154），和附錄 L267 一致；L96、L253 加上「我照表 2 逐一對過，原文沒有明說」；L20 改成「起因在第 2 篇的成本對照表」，也寫明在哪一節；Aisch 兩處都換成新網址；英文版那一行已拿掉，`check-post-quality` 從 ERROR 降到只剩 WARN（tag `mobile`），`check-tw-terms` 0 命中。
- order 7 建議修：1（Hansen VI 補進 L96 與 L207，而且移出「來源說法不同的地方」）、3（L58 改成「報告沒有給教學情境的分布」）、4（附錄改成「討論段把讀到文末者的 59% 寫成約一半」）、5（「十處數字對不起來，另有兩處用詞或計數單位」，以及「施測時間未註明的 24 份」）、6、8、10、11、12、14 都改好了。L186 改成「能把預測單獨分開來看的只有 Jarc 等人一個」，和第 2 篇一致。9（arXiv 純文字）沒改：正文 L76 已不見裸 ID，附錄與參考資料裡的 `arXiv:2103.01701v2` 是版本說明，前面都有連結，可以接受。13（開頭的研究過程描述）沒改，屬寫法，不追。
- **`<details>` 那一列**（L203、L205）照我的判斷改了：用 Aisch 的例外說明摺疊不衝突，規則改成「答案不放正文沒講過的新解釋」，提示洩題的問題交給 order 10。今晚第 1 件事也拿掉了先透露答案方向的「對照：第幾步開始兩者不同」。
- **第 2 篇（中英一致）**：tldr、L30、L146 小標、L157、L163（補 Hansen III／Gurka，「好處跟著投入走」標成我的解讀）、L167（Jarc 一個、Byrne 兩個分不開、補 Hansen VI，描述「一組拿掉了互動提問，各組之間沒有顯著差異」與抽取紀錄相符）、L216、L354、L455（改成讀了全文），都已改好，中英的數字與限定條件逐行一致（只差 L22 一處，見必須修 2）。兩篇對 Hundhausen 的描述（14 個裡 10 個、扣掉 Byrne 是 8 個、Jarc 一個、Hansen III／VI、Gurka）現在一致。

### S2、S7 不採納的理由

- **S2（重疊沒有數字）部分採納，成立。** 原稿「大量重疊」換成「有重疊、至少 13 篇、我沒有數完」，數字我獨立對過（見建議修 1）。保留「不能當成兩份獨立的證據」這個結論，13／46 的重疊加上 8 篇直接從參考文獻補來，撐得住。
- **S7（標題沒有結論）不改，成立。** 作者的理由原文我沒有看到，以下是我自己判斷的。writing-guide 的標題規則要的是講對象，冒號後放文章實際涵蓋的名詞（L30 的範例「怎麼寫才不吃 context：入口、門檻、成本、來源」），結論放在 tldr。同系列五篇的標題也都是「問題：涵蓋的面向」這種格式。我原本的建議把任務書的「標題與 tldr 講對象與結論」讀成標題也要有結論，是我讀過頭了。現在的 tldr 已經有結論，可以撤回這一項。

## 2026-10-14 英文稿

審稿時間 13:13–13:15，前後指紋相同。指紋：中文 `7e8d5dcf…6ca3585`、英文 `db25b7f3…e266e81`。

### 中文 L209 與「至少 14 篇」

- **L209 已修好。** 現在描述的是第 2 篇成本對照表目前的依據欄（「讓學生動手這一大類有支持；能單獨分開『預測』的一個實驗沒有差異，拿掉互動提問的實驗也沒有差異」），再補 Hansen III 與 Gurka。和第 2 篇 L216 一致，不再讀成要求第 2 篇修改。第 2 篇 L22 的「不一致」也已拿掉（必須修 2 已解決）。
- **14 篇成立，我複審時報的 13 篇是錯的，更正如下。** 我改用兩份原文參考文獻裡標 `*` 的納入研究互相比對（Berney 解析到 45／50 篇，Castro-Alonso 解析到 43／46 篇），作者、年份、題名都對上的有 15 組。其中 Rieber 1990 是兩篇不同的論文：Berney 收的是 Rieber、Boyce 與 Assad 1990，Castro-Alonso 收的是 Rieber 1990 單一作者那篇，所以不算。扣掉之後是 14 篇，和 `castro-alonso2019.md` 附記列的 14 篇完全一致：Adesope 2013、Kalyuga 2008、Lewalter 2003、Lin 2011、Mayer 2005、Mayer 2007、Münzer 2009、Paik 2013、Park 1992、Rieber 1991、Scheiter 2006、Thompson 1990、Wong 2009、Wu 2013。我上一輪靠表格字串比對，誤收了 Ayres 2009（Berney 沒有收它，它只出現在 Berney 的正文與未加星號的參考文獻）與 Rieber 1990，又漏了 Kalyuga、Lewalter、Rieber 1991 這三篇單一作者的研究。因為有幾篇的參考文獻跨行、沒有解析到，「至少」的寫法正確。附記說它「不是逐篇比對兩份完整納入名單的結果」，現在可以補一句：已用兩份參考文獻裡標星號的研究交叉比對過。

### 必須修

1. **英文 L140 的引號內容不是原話。** "85% of The New York Times' readers ignore interactive graphics altogether" 用引號標成被轉述的說法，但 Aisch 文中引的原句是「85% of the Times' page visitors online simply ignore interactive infographics altogether」（`aisch2017-defense.md` #1）。英文稿用了引號，就要逐字照引，或者拿掉引號。中文版的「」是翻譯，不受影響。
2. **英文 L58 "instruction without simulation" 加了引號，但不是原話。** 報告原文是「non-simulation instruction」或「some other kind of instructional treatment」（`dangelo2014.md` L22）。改成其中一個。

### 建議修

1. **英文 L62 "the same simulation with some enhancement"、"the original simulation" 與 L205 "let the reader think first, then reveal"**：這幾處都是轉述，卻用了引號，英文讀者會以為是原文。拿掉引號，或改成斜體或改寫的說法。L205 那一句中文版的「」也一樣，讀起來像 Aisch 的原話。Aisch 的原話是「unless you really want to」，L207 可以加上引號直接引。
2. **英文 L157 "usually from a team"**：原文是「many interactive articles are created by a collective team」，中文版寫「多半」已經略強，英文用 "usually" 更強了。改成 "often"。
3. **英文 L130 "Mobile readers stayed 23% to 52% as long as desktop readers"**：比的是停留時間的中位數，改成 "Mobile readers' median time on page was 23% to 52% of desktop readers'"。
4. **英文 L255 "the extraction suspects a transcription error"**：英文讀者不知道 extraction 指什麼。改成 "probably a typo in the table (my guess)"。中文版的「抽取時推測」同理，可以改成「我推測是誤植」。
5. **英文 L142 Tse 的三條規則**：其中兩條和原文只差幾個字，可以直接逐字引用（「If you make the reader click or do anything other than scroll, something spectacular has to happen.」「If you make a tooltip or rollover, assume no one will ever see it.」），比轉述更好。不改也不算錯。

### 已確認沒問題

- **結構與數字**：中英各 288 行，標題層級逐行對齊；逐行比對數字，只差在英文多了「K–12」裡的 12，以及附錄 Mosca 那一行的 χ² 自由度寫法，沒有實質差異。tldr、結論表、各節的限定條件（跨研究比較、自選、作者判為不顯著、本站計算、推論標示）中英一致。
- **英文引文逐字對過抽取紀錄**：Hohman 結尾兩句、Aisch 的「the 85% of readers didn't ignore the graphic, they just didn't click the button」與「15% of readers isn't nobody」、Patel 的「It can take 1 to 5 months to make a tutorial.」與「Great! Now I have an interactive diagram. But this isn't an explanation.」、Hundhausen 的「appears」與「a qualified 'yes'」、Tse 的「Most visuals are static」與「We still do interactives, but the bar is now VERY high」、Mosca 的「significantly detract」、Red Blob 的「a medium sized project」都相符（Aisch 原文是彎引號，這裡用直引號可以接受）。
- **連結**：站內連結都指向 -en 版，6 個檔案都存在；L16 連回中文版；中文稿 L16 已加上英文版連結。`check-post-quality` 對英文稿沒有問題；系列名 "Writing Articles That Teach" 和其他五篇英文稿一致。
- **英文自然度**：整體通順，語氣和第 2 篇英文稿一致。上面列的是引號與用詞強度，不是文法問題。

## 2026-10-14 英文稿修正確認

確認時間 13:34。指紋：中文 `d02038a4…60f0d`、英文 `6c9f45ee…9547a`。

**結論：上一輪英文稿的 2 項必須修與 5 項建議修都已修好，沒有發現新問題。**

- **英文稿裡所有加引號的原文，逐一對過抽取紀錄，都和原句逐字相同。**
  - Aisch：「85% of the Times' page visitors online simply ignore interactive infographics altogether」、「unless you really want to」、「15% of readers isn't nobody.」、「the 85% of readers didn't ignore the graphic, they just didn't click the button.」。
  - D'Angelo：「non-simulation instruction」。
  - Tse：三條規則全文（「If you make the reader click or do anything other than scroll, something spectacular has to happen.」「If you make a tooltip or rollover, assume no one will ever see it.」「When deciding whether to make something interactive, remember that getting it to work on all platforms is expensive.」），以及「Most visuals are static」、「We still do interactives, but the bar is now VERY high.」、「2016 edition」。
  - Mosca：「significantly detract」、「significantly higher」。
  - 其他：Conlen 的「algorithm details button」、「roughly half」；Hohman 的「have been shown」與結尾兩句；Hundhausen 的「appears」、「a qualified 'yes'」；Patel 的兩句；Red Blob 的「a medium sized project」。
- **其餘加引號的都不是引用來源**，而是文章自己的標題、節名、題目範例、假設句或術語（例如 "dynamic"、"domain"、"predict only"），沒有被當成引用來源。L62 與 L205 原本把轉述加了引號，這次已經拿掉。
- **建議修**：L157 改成「many interactive articles are made by a team」，中文同步改成「很多互動文章是一個團隊做的」；L130 改成比較停留時間的中位數；L255 改成「my guess is a typo in the table」，中文改成「我推測是表格誤植」。都已確認。
- **中英一致**：兩版各 288 行，標題層級逐行對齊；逐行比對數字，只差在英文的「K–12」與附錄 χ² 自由度的寫法，和上一輪相同，沒有實質差異。中文 L142 Tse 的規則仍是中文翻譯，沒有改成英文直引，屬於翻譯，不算不一致。
