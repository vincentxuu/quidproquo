# 審稿報告：order 17〈把間隔複習做進教學文章〉

- 審稿者：獨立審稿（沒有參與撰寫）
- 審的檔：`src/content/posts/learning/2026-10-14-spaced-review-in-teaching-articles.md`（只有中文稿，依指派跳過中英一致）
- 審稿時間：2026-10-14 16:56–17:02（CST）
- sha256（審前，16:56）：`8c91ea6fce82434c9c4054d74765e2c7634366c38b31901de258f5bdf4faf120`
- sha256（審後，17:01）：`8c91ea6fce82434c9c4054d74765e2c7634366c38b31901de258f5bdf4faf120`（相同，審稿期間沒有人改檔）
- 對照用的站內檔（17:01）：`src/lib/english-speaking.ts` `66f639da…817f`；`src/components/EnglishSpeaking/EnglishSpeaking.tsx` `e16b3fe3…8d39`；第 16 篇 `33afc877…e618`
- 依據：任務書 `.work/reviews/REVIEW-BRIEF-research-posts.md`、寫稿說明 `.research/2026-10-14-writing-brief.md`；抽取紀錄 `articles-that-teach/` 下的 matuschak2019-ttft、matuschak-nd-working-notes、matuschak2020-timeful-texts、davis2018-halflife、davis2016-retrieval-planning、lindsey2014-personalized-review、settles2016-hlr、bernhardt2021-hn-execute-program、frappa2026-anki-systematic-review、kovacs2016-in-video-quizzes 的檔頭與 davis2018-retrieval-practice-moocs 的檔頭；`_audit/` group-01、03、05、08、09、10、13（這些來源全部判定通過）。英文引文直接回 `.research/raw/learning-content/q4-time/` 的原文檔比對。

## 必須修

### M1. 四則 Matuschak 筆記在作者網站上目前不是公開狀態（需要主線判斷）

`curl` 結果：文章引用的四則筆記回 **404**：

| 筆記 | 文章行 | 文章用來寫什麼 |
|---|---|---|
| `z2cKiAiZ8tAWiz4ZUoTaaBv` 2019 Quantum Country efficacy experiment | 287（參考資料）、附錄 263 | 「pp」單位的附註 |
| `zHMuXkWrGpDVQ6j82YNK2iD` In-essay prompts boost performance on first repetition | 32、93–97、195、211、239、247、263 | 78 對 122 人、5 對 7 題、7.3 對 7.6、42% 對 71%／68%、89% 對 91% |
| `z5UfUeuEkvxPdAvMcpVPPew` …less likely to recover…scheduled too late | 101、247、263 | 84%、56%（27 人）、86%、82% 等 |
| `zNGtyWTwns63fhzixGKZ1Bb` What's the big-picture impact… | 189、263、287 | 「讀者多半出於好奇」、106 位受訪者 |

查到的證據：

- 公開的筆記（如 `zqetsQERteJhyPitmRoaeE`、`zRxhtQqHvLpatPLB4BvzMRB`）回 200。網站的資料格式裡，已公開的筆記寫成 `[[id:::標題]]`，沒公開的只寫 `[[標題]]`，沒有 id。現在的 `zqetsQERteJhyPitmRoaeE`（Effects of the mnemonic medium on reader memory）裡，「What's the big-picture impact…」與「29%」那則都是沒有 id 的寫法；2019 efficacy experiment 那則已經不在這頁上。
- 存檔 `am-effects-of-mnemonic-medium-on-reader-memory.md` L23 也是用 slug 連到 big-picture 那則，不是用 id；4 則 404 筆記的存檔，檔頭都是標題重複一次，和 200 的那幾則（檔頭是「Andyʼs working notes」）格式不同，所以抓取管道看起來不一樣。
- Exa 的快取還有 `zHMuXk…` 的內容，`z5UfUe…` 回 CRAWL_NOT_FOUND。改用 slug 網址試，四則一樣都是 404。

推論（我的判斷，沒有確認）：這四則要不是曾經公開、後來被作者撤下，就是從快取抓到、作者原本就沒公開的筆記。這四則都沒有「不得分享」的標示，但主線的規則是「公開、未標不得引用者可用」，現在第一個條件不成立。文章自己也寫「Andy Matuschak 的公開工作筆記（2026-10-13 的版本）」（287），而讀者點這四個連結都會看到 404。

要主線決定：(a) 還是要用的話，至少把參考資料改成「2026-10-13 抓取時可讀，作者網站目前回 404」，四個連結也要處理；(b) 依尊重作者發布選擇的精神不用：拿掉 N4、N5 的數字。這樣「題目放在文章裡，還是事後另給一包」與「隔太久才回來」兩節、先看結論表第 3 列、「來源說法不同」第 1 組、可以做的事 #1 與今晚第 3 件事的依據，都要改成「沒有公開資料」。我傾向 (b)，或者先問使用者。N2（`zqets…`）、N7（`zRxht…`）、N6（`z4biJ…`）仍是公開的，54 天、80% 選樣、存活者疑問、證據強度自評都不受影響。

### M2. 「Feels like homework」被寫成讀者說的話（183）

文章：「讀者留言（作者自己標為軼事），有人說「Feels like homework」」。`am-lessons-non-technical-texts.md` L24 的「“Feels like homework” / “stressful”」是 Matuschak 自己下的分類標題，讀者的原話是 Emily 的「reminds me of school homework」（L25）。這屬於引文不符：要改成引讀者原句，或寫成「作者把這類留言歸為『像作業』」。另外「it felt strangely stressful」確實是讀者 Henry 的話（L28），但同一則留言還說了「I totally recognize that my retention of the core concepts is likely to increase」，最後又說「Definitely not a bad thing」。只引負面那半句會讓人讀成單純的反感，建議一起帶上（見 S5）。

### M3. Hacker News 的則數寫錯（293）

參考資料寫「含底下 44 則回覆」。抽取紀錄的說法是：這則留言加上底下的回覆共 44 則；Bernhardt 本人 4 則（含頂層），其他人 40 則。所以底下的回覆是 43 則。附錄 275 寫的「底下 40 則回覆來自約 30 個帳號」指的是其他人的回覆，兩處的口徑不一樣。改成「連同底下的回覆共 44 則」即可。

### M4. 把本站的做法寫成規格要求（18）

文章寫：「規格要求每個主要小節結尾放一題自我檢查，答案收在要點一下才展開的區塊裡」。`course-guide-contract.md` L55 只要求「附答案或判準」，整個 post skill 都沒有提到摺疊區塊（`<details>`）。摺疊是本站常見的做法（355 個文章檔用了 `<details>`），不是規格。建議改成「規格要求每節一題、附答案；本站實際多把答案收在摺疊區塊裡」。

## 建議修

- S1（35，結論表）：「相對高 16.5%」寫得太肯定。正文 133 交代過「相對比例」是依圖判讀，表格這裡要加「（依圖判讀）」或拿掉「相對」。
- S2（36）：「數十萬到數百萬人」對不上來源。實驗一是「just under 1 million」，實驗二是 330 萬人，建議寫「將近 100 萬與 330 萬人」。
- S3（31）：「16 人對 25 人」放在「延後組…照常組…」那句後面，順序剛好相反，容易讀反。建議寫「延後組 25 人、照常組 16 人」。
- S4（101）：「作者說延後的影響不大」只寫了一半。原文是「Not an enormous effect, but it's probably real」，建議補上「但可能是真的」。
- S5（183）：Henry 的留言補上他也認為題目會幫助記住（見 M2）。
- S6（214）：「還說不出來」在同一輪練習裡是「這一輪最後再練一次」（`EnglishSpeaking.tsx` L394，`comesBack` 為真時），下一輪才是 10 分鐘後。其餘描述都和程式一致：`english-speaking.ts` L441–442 算出來是 3、6、12、24 天，上限 30 天；「有點卡」1 天；進度存在 localStorage（`EnglishSpeaking.tsx` L234、L409）。表格也標了「本站的設計」，沒有寫成研究結果。
- S7（215）：寫「沒有提醒讀者回來的機制」，第 16 篇 227 行寫的是「除了 RSS 之外沒有通知讀者的管道」，本站確實有 `src/pages/rss.xml.ts`。建議兩篇統一，例如改成「除了 RSS 沒有提醒讀者回來的機制」。
- S8（和第 16 篇重複的地方）：第 16 篇已經提過同樣的建議（第 16 篇 221「系列的後一篇開頭放兩三題」）；這篇的 #2（225）寫「一兩題」，也沒有提到第 16 篇。第 16 篇 #5（227）提醒「不要把讀者會自己回來當成前提」，這篇 #2 卻寫「讀者本來就要回來讀下一篇」。兩篇不算矛盾，但這篇應該連到第 16 篇（已發佈，`draft: false`），說明這是延續同一條建議，並補上「前提是讀者真的讀到下一篇」。16 行「前面的篇查了…」也可以直接連到第 16 篇。Lindsey 的數字與「相對增幅、依圖判讀」兩篇一致，沒有矛盾。
- S9（數字密度）：95 行與 101 行各塞了 6 到 8 個數字。101 行建議只留兩組對比（84%→56%、86%→82%），人數放到附錄；95 行的「第二次 7.3 對 7.6」可以留著，四分位距已經在附錄。如果 M1 決定拿掉 N4、N5，這兩段的問題就一起消失。
- S10（32）：結論表第 3 列把兩個比較併成一句：「難題／簡單題」來自跨年份那組，「第二次拉平」來自五天那組。建議拆開寫，或者加「（兩個不同比較）」。
- S11（189）：「讀者多半出於好奇」出自 N11 的一則連結標題（抽取紀錄標「僅標題」），而 N11 是 M1 的 404 筆記之一。
- S12：寫稿說明要求開頭放 `> 🌏 [English version]` 這一行（英文稿之後補），現在沒有。等英文稿出來時再加也可以。
- S13：`check-post-quality` 對 tag `blog` 給出警告（非阻擋），請確認這個 tag 是否合適。

## 沒問題的項目

- **贊助者信件**：文章完全沒有用到。24 行與 253 行聲明不用；`.research/2026-10-13-learning-content-q4-time.md` L116 記載四封信的原文檔已經刪除。我逐一回查文章裡每個 Matuschak 的數字：TTFT 的 112、5 天／2 週／1 月／4 個月、54 天、6,000 天、95 分鐘、4 小時、195 人、8 張卡、25／16 人、91→87、89→96、40%；筆記的 90 分鐘、35–50%、80% 選樣、2019 上半年的排程、several hundred、106 人、25%；以及 N4、N5 的數字。全部都在 TTFT 或 15 則筆記的存檔裡找得到，沒有來路不明的數字。「29%」只提到存在，沒有引數字（253）。（公開與否的問題見 M1。）
- **54 天**：結論表（30）、正文（72–77）、限制（245）、來源說法不同（201）都同時寫了「只算做完的人／文內答 80% 以上的讀者」，以及作者自己提的存活者與選擇效應疑問，原句逐字相符。「demonstrated retention 不是保留測驗」也交代了（70）。
- **42% 對 70% 的降級**：97 與 195 都交代了跨年份比較、混了補做的複習、只有三張卡、沒有人數，也和同一實驗內的五天比較並列。文章沒有把這組數字寫成文內題目本身的效果。
- **英文引文逐字比對**（回原文檔 grep，跨行的另外看行）：survivorship、extraordinary level of commitment（TTFT L380–381）、informal experiment、But it's not large…、sketchy、Within Quantum Country…（N2 L21）、These are preliminary results…（L325–326）、At a minimum…（L394–395）、we don't quite mean those numbers literally（L308–309）、not yet widely adopted、adopting any new regular habit…、So people churn.、Such prompts might seem onerous…、One important barrier…、This is a common failure mode…（L804–806）、it felt strangely stressful、The initial mnemonic medium is implicitly authoritarian in premise、I think it's also important that the primer…、I don't think the MM performs very well here、You can't binge/cram…、Obviously I'm very biased here、who are you to judge how I learn ?、The causal analysis yields no evidence…、We acknowledge that our design confounded…、so we deployed it for all students.、improve Duolingo daily student engagement by 12%（L30–32 跨行）、these findings should not be interpreted as causal、modest but consistent improvements。除了 M2，全部相符。
- **不顯著的寫法**：Davis 2018、Davis 2016、Settles 實驗一、Wothe Step 2、Levy、Sun、Magro 一律寫「沒有測到差異」。41 行還特別說明「沒有測到差異」不等於「沒有效果」。123 行把檢定力低標成作者（本站）的判斷。
- **研究者代名詞**：全文沒有用性別代名詞指研究者（Matuschak、Bernhardt、Davis 等都用名字或「作者」）；「他們」只用來指讀者或使用者。
- **Davis 2018／2016、Lindsey、Settles、Bernhardt、Frappa、Kovacs** 的數字、條件與作者限制，逐條回抽取紀錄核對過，相符：523／102、ITT 與 LATE、34% 對 8%、67→49、65→42、22%／14.7% 的分母、179 人、16.5／10.0、89.4／87.2／88.1、30 分鐘／10%、半小時與當機三次、+0.3／−7.3／+12.0、第一天 5 課、8–18 天、11 個研究／1,135 人、5 個橫斷研究、d = 0.8、Step 2 252.5 對 247.0、74%／92 支影片。Lindsey 的兩個印錯的 t 值沒有引（249）。
- **推論都有標示**：91±4 與 87±5 重疊（89）、Lindsey 依圖判讀（133）、採用障礙的分類與「證據不足」（187）、可以做的事五條（221）、今晚三件事，都寫明是本站的判斷，252 行另外整理成清單。
- **取樣偏誤**：開頭附近（24）交代了兩個偏向（資料由做產品的人自己公布、有隨機分派的只有少數幾個），也聲明不用贊助者信件。
- **本站現況**：沒有分析工具（`src/layouts`、`components`、`pages` 都搜不到 analytics 或 tag 類的程式碼）、沒有讀者帳號（`login.astro` 只導向 `/admin`）、英文口說頁的排程（除了 S6 那一處）都和程式一致。對照表把本站做法與研究證據分欄寫，性質欄也標了「本站的選擇／設計」。
- **用語**：`check-tw-terms` 零命中；沒有看到替換表裡的中國用語。標題與 tldr 講的是對象與結論，沒有講作者查了多少。
- **站內連結**：第 9 篇、第 10 篇、`/english` 都存在，第 9、10 篇是 `draft: false`。
- **外部連結**（curl -L）：200 的有 numinous 兩篇、11 則 Matuschak 筆記、HN、Davis 兩份 PDF、Hauff 的作者稿、Mozer 的抽印本、Duolingo 研究頁、Springer 的兩個 DOI、JLA 的 DOI。ACM 與 SAGE 的 DOI 回 403、ACL 的 DOI 回 406，這是出版者擋 curl，DOI 本身沒有錯。404 的四則見 M1。

## 需要人判斷（指派訊息列的事項）

1. **2020–2021 年的兩則筆記（N4、N5）**：照主線原本的規則（公開、未標不得引用就可用），文章的用法沒有問題，降級也做得到位。但今天這兩則在作者網站上是 404，「公開」這個前提不成立，見 M1。我建議不用，或者先問使用者。贊助者信件確認沒有用到。
2. 54 天：寫法合格。
3. 42% 對 70%：降級合格。
4. 英文口說頁：描述正確，也標成本站做法；只差 S6 那一處細節。
5. 數字密度：95 行與 101 行偏密，見 S9。

## 我沒做的事

- 沒有重讀抽取紀錄背後的 PDF 版面；表格數字依抽查報告（group-05、09、13 等）通過的紀錄核對。
- 沒有確認那四則筆記是什麼時候、為什麼變成 404，也沒有查 Wayback（archive.org API 回 429）。
- 沒有讀 `am-log-qc-analysis.md`，也沒有讀被連到的其他 Matuschak 筆記。
- 沒有跑 `pnpm dev`／build，沒有看渲染後的頁面。
- 依指派跳過中英一致（沒有英文稿）。

## 2026-10-14 複審

- 時間：17:14（CST）。文章 sha256 `639478acbea779ff6e2ebcce720c6c869273adf1beb040515637a2de0aecdda3`（複審前後相同）；第 16 篇 `a2eba708…4d38`。

### 四則撤下筆記的殘句

用 id、標題關鍵字與數字（z2cKi、zHMuXk、z5UfUe、zNGtyW、In-essay、too late、big-picture、sketchy、78／122 人、42%／71%／68%、7.3 對、84%、56%、106 位、好奇、2020-01、2021-04）搜全文：正文、表格、附錄、參考資料都沒有殘留，四個連結也都拿掉了。117 行與 257 行的 42% 是 Davis 2018 的數字，253 行的「several hundred」出自仍公開的 N2，兩者都不是殘留。

**殘留一處（必須修）**：frontmatter 的 `description`（第 8 行）還寫「文內題目對第一次複習的影響」。這是 N4 的內容，正文已經沒有這一段，要刪掉或改成「題目要不要嵌在正文」。

### 新寫的內容

- 93 行 TTFT：「it has worked out adequately」和原文檔 L779–780 逐字相符；「嵌在敘事裡是能處理抽象、概念性知識的原因」對應抽取紀錄 D6（L541–553），標成作者的主張、沒有資料，正確。
- 229 行 Davis 2018：「選擇題約七成、數值題約四成」對應紀錄 #21 的 69% 與 41%（Figure 12），附錄 257 行也有。題型和題目混在一起、作答多不等於學得多，這兩個限制都寫了。
- 175 行（原 M2）：讀者原句「reminds me of school homework」（L25）、「I totally recognize…from going through those prompts」「Definitely not a bad thing, albeit uncomfortable.」（L28），三句都逐字相符，「像作業、有壓力」也改成作者下的分類。原 M2 已修好。
- 237、243 行新增的限制與不用聲明：方向正確。

### 原報告各項

- M1：照主線決定處理，殘留只剩上面的 description。另外 **243 行寫「作者已從網站撤下」（必須修）**：我只確認到這四則筆記現在回 404、在網站資料裡是沒公開的寫法，查不到作者「撤下」它們（也可能從來就沒公開過）。建議改成「作者網站上目前打不開（404），這裡不用」。同一句把「2019 年的非正式實驗」列在不用的筆記裡，但正文 81–89 行仍引用長文裡的同一個實驗，建議加註「指那則筆記；長文的描述仍引用」，免得讀者以為兩者矛盾。
- M2、M3（283 行改成「連同底下的回覆共 44 則」）、M4（18 行改成「規格要求附答案或判準；實際多半收在摺疊區塊」）：都修好了。
- S1（35 行）、S2（36 行）、S3（31 行）、S6（204 行）、S7（205、213 行的 RSS）、S8（16、215 行連到第 16 篇，並寫明前提）、S9、S10、S11：都修好了。S4、S5 隨原來的段落一起刪除或改寫，不用再處理。S12（English version 那一行）還沒加，等英文稿出來再補。S13 的 `blog` 警告沒有變，屬於非阻擋。

### 和第 16 篇是否一致

第 16 篇第 225 行現在也寫「一兩題」，所以本篇 215 行說「題數也一樣」成立。兩篇都寫「除了 RSS 之外」沒有通知管道，Lindsey 的數字與「依圖判讀」一致，沒有矛盾。第 16 篇最後一句「把複習做進文章的其他做法，下一篇會談」對應本篇。

### 用語

`check-tw-terms` 零命中；新寫的段落沒有看到替換表裡的中國用語。

### 結論

剩兩項必須修：description 的 N4 殘句、243 行把 404 寫成「作者已從網站撤下」。另有一項建議：243 行的「2019 年的非正式實驗」加註，和正文引用的長文實驗分開。其餘都已修好。

## 2026-10-14 第三輪：中文修正確認與英文稿

- 時間：17:35（CST）。sha256：中文稿 `936b0f45ab8d642f0abddfe3c197cda4fdda570bf5481caf685b0cc53de6118d`；英文稿 `d1ee639c91bb28cfa10e94176afea27bc276e338e449e484bcfb4dc4cb782044`。

### 中文稿兩項必須修

- description 已經拿掉「文內題目對第一次複習的影響」，修好了。
- 245 行改成「作者網站上目前打不開（404）」，也註明不用的只是談 2019 年實驗的那則筆記，長文對同一個實驗的描述仍然引用。修好了，建議那一項也一起處理了。開頭也補上了 English version 那一行。

### 英文稿

**必須修**：沒有。

**建議修**
- E1（177 行）：`One reader said the questions "reminds me of school homework."` 主詞是複數，引號裡的動詞卻是單數，讀起來像文法錯。原文是「the orbit thing on the recent @meaningness essay reminds me of school homework」，建議整句照引，或改成 `One reader wrote that the prompts in one essay remind them of school homework`（引號拿掉）。
- E2（99 行）：`the four statements the note would like to be able to make` 的主詞不自然，「想說的四句話」是作者想說的。建議改成 `the four claims Matuschak would like to be able to make`（原文是 "The story I'd like to be able to tell"）。不需要代名詞。
- E3（285 行）：`44 comments including the replies below it` 可能被讀成「底下有 44 則」。建議改成 `the comment plus the replies below it, 44 in all`。
- E4（206 行）：`"said it smoothly"`、`"a bit stuck"`、`"can't say it yet"` 用了引號，但這是自己翻譯的介面按鈕，介面本身是中文（「說得順」「有點卡」「還說不出來」）。建議加一句「labels translated from the Chinese interface」，免得讀者以為這是介面上的原文。
- E5（265 行，作者問的那句）：`User experiment 1 (…) found overall activity +0.3, new lessons +0.3, and practice −7.3 (only the last p < 0.001)` 和中文「任何活動 +0.3、新課 +0.3、練習 −7.3（只有最後一項 p < 0.001）」的意思一樣。原文表頭是「Any」，正文用 overall activity 也一致；括號說明了前兩項不顯著，所以「found」沒有把它們寫成有效果。只是括號少了動詞，建議寫成 `(only the last had p < 0.001)`。

### 沒問題的項目

- **中英一致**：逐段對過中英兩版，章節、表格列數、對照表、五條建議與今晚三件事都對得上。下面這些數字兩邊一致：54 天、95／90 分鐘、195、25／16 人、91→87、89→96、523／102、34% 對 8%、67→49、65→42、22%／14.7%、179 人、16.5／10.0、89.4／87.2／88.1、+0.3／−7.3／+12.0、將近 100 萬與 330 萬、5 課、8–18 天、11 個研究／1,135 人、69%／41%（今晚第 3 件事寫約 70%、約 40%），以及附錄全部數字。12.9 million 對應中文的 1,290 萬。不用的資料那一段兩版同步。
- **英文引文逐字比對**：除了 E1 的主詞問題（引文本身逐字相符），其餘都和原文檔逐字相同，包含 ’ 與 ' 的差別：TTFT 與 Timeful 用彎引號，HN 與 TTFT 的「it's deadly」是直引號。新增的「it has worked out adequately」（TTFT L779–780）、「Definitely not a bad thing, albeit uncomfortable.」「I totally recognize…from going through those prompts」（N8 L28）也都相符。
- **代名詞**：研究者都用名字或「the authors」「the note」；HN 留言者用 they；沒有用性別代名詞。
- **連結**：中文版、第 9、10、16 篇的 -en 檔都存在，第 10、16 篇的英文稿是 `draft: false`；外部連結和中文稿相同（已在第一輪查過，四則 404 筆記已移除）。
- **英文自然度**：整體流暢，沒有中式句構或翻譯腔的模板句；除了 E1、E2，沒有別的需要改。
