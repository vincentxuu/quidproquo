# 審稿報告：order 12〈讀者程度不同，教學文章怎麼寫〉

- 受審檔：`src/content/posts/learning/2026-10-14-prior-knowledge-reader-level.md`（只有中文稿，跳過中英一致）
- 審稿時間：2026-10-14 14:31–14:39（CST）
- sha256 審前：`670c0af709c47b6b9285702281bfa926ca3c64d499423a332575db236fb68476`
- sha256 審後：`670c0af709c47b6b9285702281bfa926ca3c64d499423a332575db236fb68476`（相同，審稿期間沒有人改檔）
- 依據：`.work/reviews/REVIEW-BRIEF-research-posts.md`、`.research/2026-10-14-writing-brief.md`、`.research/2026-10-13-reading-list-order-12-13-15.md`、十一份抽取紀錄（simonsmeier2022、brod2021、tetzlaff2025、mcnamara2011-cohesion-fourth-grade、gorbunova2025-pretraining、kim2017-coding-tutorials、mullaney2015-staggered-release、google-tw-one-audience、mdn-writing-style-guide、wesenberg2026-sd-amount、scheiter2007-learner-control）、`_audit/` 的 provenance 與 group-02/05/07/10/12/13/14、第 1、2、3、4、5、8、9 篇現在的檔案、`.agents/skills/post/references/course-guide-contract.md`。

## 必須修

1. **第 21 行，第 2 篇的但書寫得比原篇滿。** 文章寫「先備知識沒有穩定地調節效果，和理論預測的方向不一致」。第 2 篇（`2026-10-13-diagrams-in-teaching-articles.md` 第 82 行）原句是「理論預測好的設計對新手幫助比較大，但各統合分析的方向不一致，合併之後不顯著」。「方向不一致」在第 2 篇指各統合分析彼此不一致，合併後不顯著；第 12 篇讀成「結果和理論方向相反」。不顯著不等於反向。改成「先備知識沒有穩定地調節效果：理論預測好的設計對新手幫助較大，但各份統合分析方向不一，合併之後沒有測到調節」。
2. **第 260 行，McNamara 等（1996）寫成「成人連貫度研究」，手上的來源說是青少年。** McNamara 2011 原文 L899–900：「This result replicates findings with adolescent readers' (McNamara et al., 1996) and adult readers (McNamara, 2001; McNamara & Kintsch, 1996)」。「成人樣本」是精讀清單掃描階段的暫定說法，不能當依據。改成「McNamara 等（1996）的青少年連貫度研究」，或拿掉樣本描述。連帶第 258 行「連貫度低的文字對成人熟手是否較好……原始研究我只讀得到摘要」：成人的原始研究（McNamara 2001；McNamara & Kintsch 1996）其實連摘要都沒有讀，只有 2011 那篇的一句轉述；建議一併改成「成人的研究我只看到 2011 那篇的一句轉述」。
3. **第 246 行，規格對照表把推論標成「有依據」。** 第 4 列「第 1 篇的做法：預設替新手寫」的依據強度寫「前半有依據」，來源欄寫「前半可以歸給 Tetzlaff 等人的實務含意」。但 Tetzlaff 的實務含意講的是「instructional assistance」，文章自己在第 109 行說「『文章鋪陳得多不多』是不是這種協助，是推論；第 1 篇已經這樣標了」，可以做的事第 3 條也說「把『協助』對應到文章裡多寫一句解釋、多一個中間步驟，是我的推論」。對照表這一格把同一個推論寫成「有依據」，和正文的標法不一致。改成「前半有作者的實務含意可對應，但『協助』等於『替新手寫的鋪陳』是推論；後半是本站的選擇」。第 123 行「其實可以直接歸給這句」同理，建議加「（前提是把協助對應到文章鋪陳，這一步是推論）」。
4. **第 205 行與第 147 行，兩處沒有來源的事實說法。**
   - 第 205 行：「最常被引的是 Scheiter 與 Gerjets 2007 年的回顧」。沒有任何引用次數的來源。這篇是 ⚠ 不得引用的紀錄（`scheiter2007-learner-control.md`），文章裡只能寫「這篇研究存在，我沒讀到合法公開的全文」。改成「談這個問題的一篇回顧是 Scheiter 與 Gerjets 2007 年的〈Learner Control in Hypermedia Environments〉，這篇研究存在，我沒有讀到……全文」。
   - 第 147 行標題：「一個常被當成反例的研究」。Gorbunova 2025 是去年的論文，沒有任何資料顯示它「常被」這樣引用；第 149 行正文的「很容易被當成」是合理的寫法，標題比正文滿。改成「一個看起來像反例的研究，回答不了這個問題」。

## 建議修

1. 第 20 行：第 1 篇引的分段統合分析「高先備者在記憶測驗上受益反而較大，但只有 7 個比較」。第 1、2 篇的附錄都寫了「7 個比較裡 4 個出自同一篇」，第 2 篇另有「作者自己說這個變項的變異很有限」「遷移不受先備知識調節」。收齊但書時這兩條比「只有 7 個比較」更關鍵，建議補一句。
2. 第 23 行：第 5 篇的那條不是「要看讀者程度」的但書，而是建議；而且第 5 篇自己標了「把它用到導讀的先備段，是我的延伸」，Mayer 的依據只有 2 個動畫實驗。第 12 篇放進「但書」清單時沒帶這個標記。建議補「（第 5 篇標明這是延伸，依據是兩個動畫實驗）」，或把引言改成「出現過的但書與相關建議」。
3. 第 22 行：第 3 篇那條是「第 3 篇轉述 Muldner 回顧對 Mayer 1975、Bayman 與 Mayer 1988 的轉述」，第 3 篇說原文沒讀，回顧用語是「may exist only for」。第 12 篇寫「第 3 篇轉述的程式例題實驗裡」，轉引層數少了一層，hedge 也掉了。建議改成「第 3 篇轉述的一篇回顧說」。
4. 第 213 行（「書面教學下的馬太效應與給新手協助」）：推論有標明，邏輯也站得住，兩者一個是同一教學下的相關、一個是同研究內兩種設計的交互作用，並存沒有矛盾。但這段把 Simonsmeier 的 .22 寫成「一般的書面教材對先備多的人較有利」，比第 73–75 行自己帶的三個但書（探索性、沒有理論預測、逐列研究數與 CI 在沒讀到的補充資料）更滿；另外 Simonsmeier 的資料前後測間隔中位數 360 天、平均 11 歲，Tetzlaff 的實驗不限書面教材。建議在推論句前補「（.22 是探索性的跨研究調節結果）」，並讓「馬太效應」第一次出現在第 73 行時就交代是作者的用語（原文「a Matthew effect for written instruction」）。
5. 第 37、111、251 行：「用測驗量完、再把同一批受試者切成高低兩半」。Tetzlaff 的 Table 3 類別是「Measurement」（32 個）；切法是中位數切分的說法出自導言的概括句，各研究是否都切成兩半原文沒有逐一說。建議寫「切成高低兩組」，不寫「兩半」或「上半」。
6. 第 245 行，規格對照表第 2 列依據強度寫「實務上少見的做法」。依據只有 Kim 與 Ko 一份 2016 年、30 個英文程式教學、一人評分、表與正文不一致的快照；同一列又引 MDN 要求寫先備。建議改成「Kim 與 Ko 的樣本裡少見」。
7. 第 252 行：Wesenberg 那條寫「先備知識沒有調節效果」。依寫稿說明的規則，不顯著寫「沒有測到」；附錄第 286 行已寫對（「交互作用……不顯著」）。改成「沒有測到先備知識的調節」。
8. 第 133 行：「第 1 篇提過一個常被引用的同方向研究」。照抄第 1 篇第 159 行，但在第 12 篇的這個位置，「同方向」沒有指涉對象（第 1 篇是接在專長反轉後面）。建議寫「和專長反轉同方向」。「常被引用」同樣沒有來源，第 1 篇也有同樣的寫法，可一起拿掉。
9. 第 162 行：「14 個有考慮學習者的程度」。原文是「education status」，附錄第 278 行寫的「教育程度」才對得上；正文寫「學習者的程度」容易讀成程式程度，和下一條的「程式經驗」混在一起。
10. 第 205 行與第 261 行對 Scheiter 與 Gerjets 放了 DOI 連結。寫稿說明只禁止列入參考資料，沒有明禁正文連結；但連到付費頁對讀者沒有用處，也容易被讀成「有讀」。可以只留書目，不放連結（請主線依其他篇的慣例決定）。
11. tags 的 `blog`：`check-post-quality.mjs` 發出 WARN（標題與內文沒有明顯對應詞）。同系列其他篇有沒有用這個 tag 我沒有逐一比對，請主線確認是否保留。

## 沒問題的項目

- **數字逐項對過抽取紀錄，全部相符**：Simonsmeier 的 493 篇、685 樣本、126,050 人、.531／−.263／−.059、預測區間 −.688 到 .621、28 篇子集、RCT .394 與 .533、智力控制 .515→.479、書面教學 .219／−.194、R² .207 與 .138、錯誤知識 3% 與 −.472／.571、360 天、11.32 歲、47 國與各洲比例；Tetzlaff 的 60 個實驗、176 個效果量、5,924 人、0.505／−0.428／0.971 與 CI、I²、評量方式各類研究數、R² 50%／25.92%／8.47%／20.59%、38 個 STEM、小學 2 個研究；McNamara 的 65 人、304–471 字、多 96–171 字、.63 對 .67、.39 對 .30、t(26) = −3.88、.22 對 .19 p = .11、.77 對 .81 p = .14、92.97／113.06；Gorbunova 的 136 人、16 節點、14 詞條、α 0.44、26.5%／73.5%、4.79→3.64、−1.21／−1.13、p = 0.84、5.97／8.03；Kim 與 Ko 的 3／14／0／14／15、五類個數；Mullaney 與 Reich 的兩版日期、週數、註冊人數、30–40%／20% 以下、4–14%、5.6%／5.7%、3 天、12.8%／7.6%；Wesenberg 的 191／101 人、9.54%／7.67%。
- **英文引文五處都和原文檔逐字相同**（我直接 grep 原文檔，不只對抽取紀錄）：Simonsmeier 結論句（`simonsmeier2021_am.txt`）、Brod L17、Tetzlaff 第 702–705 行、Google 等式、MDN L63。原文用彎引號，文章用直引號，屬排版差異。
- **轉引都有標明**：Brod 轉述的 Bransford 與 Johnson、Castel 等、鯨魚例子，正文第 91 行與限制第 262 行都說原研究沒讀。
- **⚠ 紀錄的處理**：Scheiter 與 Gerjets 沒有引任何內容、沒有列入參考資料（第 4 條必須修的「最常被引」除外）。
- **Gorbunova 的處理**是全篇最好的一段：沒有對照組、兩次問卷問的對象不同、只有描述統計、作者自己說要和對照條件比，都照抽取紀錄寫到，沒有把摘要的因果語氣當成發現。
- **McNamara 2011 的處理**：反向效果限縮成一個指標、故事、相對高知識的四年級學童；說明文沒有測到差異；「只補連貫不夠」標成作者對不顯著結果的事後解讀。都和抽取紀錄的「與清單不合」一節一致。
- **Kim 與 Ko 的「沒有一個」**：正文、摘要、表三處不一致都並列，沒有選邊；作者稿是 2021 年更新版也交代了。
- **Mullaney 與 Reich**：推到系列文章標成「我的推論」；「一整包變動」、沒有學習測驗、作者稱附帶的發現都有帶。DOI 用的是紀錄核對過的 10.1145/2724660.2724663（清單上的 2728672 是錯的，文章沒有沿用）。
- **「來源說法不同的地方」**六組並列沒有選邊；Brod 那句「it suggests」的過頭讀法有交代全文立場。
- **和第 1 篇的分工**：第 12 篇明說「第 1 篇已經寫過主要結果，這裡補沒有展開的部分」，補的是協助與高先備的定義、評量方式的調節、不對稱的檢定狀況、作者實務意涵的範圍，與第 1 篇第 153–161 行沒有矛盾；第 1 篇說「熟手」，第 12 篇說明高先備多半是相對的，是補正不是衝突。重複的只有 0.51／−0.43 兩個數字，作為銜接可以接受。另外第 1 篇目前沒有連到第 12 篇的前向連結（規劃檔 order 1→12 要求加），不在本篇範圍，提給主線。
- **本站規格的描述**：第 26 行與對照表對 `course-guide-contract.md` 的轉述（範圍卡記讀者先備；總覽交代讀者定位、先備、閱讀路線、具體起點；未教過的先備給可到達的橋接連結）和契約第 23、29、34 行相符。第 9 篇對照表確實已列「橋接連結」那一列（第 9 篇第 180 行）；第 4 篇確實有「找不熟這個領域的人試讀」（第 4 篇第 234 行）。
- **可以做的事**六條，第 1、2、3、5、6 條都標了依據與性質，第 4 條標本站的選擇。
- **開頭的取樣偏誤**有交代（第 28 行：英文文獻、拿得到全文、沒有自學成人讀網頁長文）。
- **站內連結**六個全部存在。**外部連結**：MDN、Google、ERIC、PMC 兩個、uni-trier、Kim 與 Ko 作者稿、Wayback 工作論文、Springer 兩個 DOI、Elsevier DOI、Frontiers DOI、Nature DOI 都回 200；T&F 與兩個 ACM DOI 對 curl 回 403，但 doi.org 都 302 轉到正確的出版者頁（出版者擋機器人）。
- **用語**：`check-tw-terms.mjs` 0 blocking、0 to review；我讀全文沒有看到替換表的中國用語。標題與 tldr 講的是讀者與結論，不是作者查了多少。

## 需要人判斷的事項（指派訊息列的五點）

1. **開頭轉述第 1、2、3、5、8 篇的但書**：第 1、8 篇相符（第 1 篇的 IES 指引與分段統合分析、第 8 篇的「兩倍半」都對得上現在的檔）；第 2 篇寫得比原篇滿（必須修 1）；第 3 篇少了一層轉引（建議 3）；第 5 篇不是但書而且少了「延伸」標記（建議 2）；第 1 篇的分段那條少了「4 個出自同一篇」（建議 1）。
2. **書面教學的馬太效應與給新手協助可以並存**：推論有當場標明（第 213 行與限制第 259 行），邏輯站得住（相關與交互作用是不同問題，兩者不衝突，也不需要「調和」）。問題只在推論句把探索性的 .22 寫成一般性的「書面教材對先備多的人較有利」，見建議 4。
3. **規格對照表的劃分**：第 4 列的「前半有依據」要改（必須修 3）；第 2 列的「實務上少見」建議收窄（建議 6）；第 1、3 列劃分合理。
4. **和第 1 篇的分工**：沒有重複到需要刪、也沒有矛盾，見「沒問題的項目」。
5. **英文引文逐字**：五處全部逐字相同。

## 我沒做的事

- 沒有讀 Simonsmeier 的刊出版與補充資料、Tetzlaff 的補充資料與森林圖（作者也沒讀，文章已註明）。
- peDOCS 的 Tetzlaff 連結從我這裡整個站台連不上（`www.pedocs.de` 首頁也逾時），無法確認目前狀態；provenance.md 記載 2026-10-14 稍早核對過位元組相同。第 1 篇用的是同一個連結。
- McNamara 1996 的樣本只依 McNamara 2011 原文一句判斷為青少年，沒有另外查 1996 原文。
- 沒有逐篇比對同系列其他篇的 tags 慣例（建議 11）。
- 沒有跑 `pnpm dev`、整站建置，沒有改檔、沒有 commit。

## 2026-10-14 複審

- 時間：14:52–14:58（CST）。sha256 複審前後都是 `97fb0f080549e645a4ca2903ce51bc1c457001399449635edbd339783d5b89e1`，複審期間沒有人改檔。
- `check-tw-terms.mjs`：0 blocking、0 to review；我讀全文也沒有看到替換表的用語。`check-post-quality.mjs` 只剩 tag `blog` 的 WARN（初審建議 11，留給主線決定）。

### 必須修

沒有。

### 建議修

1. 第 73 行，「馬太效應」後面的英文「a Matthew effect for written instruction」和原文 L1339–1344 逐字相同；但同一個括號裡接著寫「指起點高的人進步也多、差距擴大」，讀起來像作者的定義。原文只有這個詞，沒有給定義。建議把說明移出括號，或寫成「（原文 a Matthew effect for written instruction；馬太效應一般指……）」。
2. 第 111 行新加的括號說「作者在導言概括說這類研究常沿中位數切分」。原文導言 L135–137 是「created by measuring prior knowledge and splitting along the median」，沒有「常」。建議改成「作者在導言概括說這類研究是量測後沿中位數切分」。
3. 第 219 行（來源說法不同的地方）提到分段統合分析時，仍然只寫「只有 7 個比較」。開頭第 20 行已經補了「其中 4 個出自同一篇」，這裡可以一致。
4. 第 26 行「第 1 篇據此提了一個做法」：第 1 篇第 161 行的理由是「一篇公開的文章沒辦法知道誰在讀」，不是規格。這一句初審沒有提，不是這次改出來的。建議改成「第 1 篇提了一個做法」。

### 已確認修好

- **必須修 1**（第 21 行，第 2 篇）：新寫法「理論預測好的設計對新手幫助較大，但各份統合分析的方向不一，合併之後沒有測到調節」，對第 2 篇第 82 行的原句，相符。
- **必須修 2**（McNamara 1996）：第 260 行改成「依 McNamara 2011 的轉述，樣本是青少年」，第 258 行改成「成人的連貫度研究我只看到 McNamara 2011 那篇的一句轉述」，都和原文 L899–900 相符。
- **必須修 3**（對照表第 4 列）：依據強度改成「前半有作者的實務含意可對應，但『協助』等於『替新手寫的鋪陳』是推論；後半是本站的選擇」；第 123 行也補了「前提是把協助對應到文章的鋪陳，這一步是推論」。和第 109 行、可以做的事第 3 條的標法一致了。
- **必須修 4**：第 205 行的「最常被引」拿掉了，只說「這篇研究存在，我沒有讀到……全文」，沒有引任何內容，也沒有列進參考資料。第 147 行標題改成「一個看起來像反例的研究」。另外第 55 行 Simonsmeier 那一句也改成「先看第一種」，沒有留下無來源的說法。
- **建議 1**（第 20 行）：「其中 4 個出自同一篇」以及「作者說這個變項的變異很有限，遷移成績不受先備知識調節」，對第 1 篇附錄第 250 行與第 2 篇附錄第 431 行，相符。這段標成第 2 篇附錄的記載，出處沒有寫錯。
- **建議 2**（第 23 行，第 5 篇）：「這是建議，不是但書；第 5 篇自己標明這是延伸，Mayer 的依據是兩個動畫實驗」，對第 5 篇第 164、168 行，相符。引言也改成「但書與相關建議」。
- **建議 3**（第 22 行，第 3 篇）：補了「轉述的一篇回顧」「1975 與 1988 年的實驗」「第 3 篇沒有讀原文」「may exist only for」，對第 3 篇第 124 行，逐字相符。
- **建議 4**（第 213 行）：推論句改成「書面教材可能對先備多的人較有利（.22 是探索性的跨研究調節結果，資料以學童長時間的學習為主）」，並且仍然標了「這是我的推論」。第 73 行交代了馬太效應是作者的用語（見建議修 1）。
- **建議 5**：第 37、111、113、251 行都改成「高低兩組／切兩組」，「上半」拿掉了。
- **建議 6**：對照表第 2 列改成「在 Kim 與 Ko 的樣本裡少見」。
- **建議 7**：第 252 行改成「沒有測到先備知識的調節」。
- **建議 8**：第 133 行改成「在專長反轉之後提過一個和它同方向的研究」，「常被引用」也拿掉了。
- **建議 9**：第 162 行改成「教育程度（原文 education status）」。
- **建議 10**：Scheiter 的 DOI 連結保留，第 261 行註明「出版者頁面需付費」。這是可以接受的處理。
- 附錄與參考資料沒有被改動，數字仍然和抽取紀錄相符。站內連結六個都還在。

## 2026-10-14 英文稿

- 時間：15:21–15:30（CST）。sha256：中文 `6cfced6dd3b66943228e2634d3a18d4dcae6efd9ab42e19e3c94f8d6a6cc0efb`，英文 `e465d2912c91c5d36a8624d52aa7c03a7ccba9f13083abe4ed6a58d891c13b19`。
- 範圍：中文四項小修與第 6 條新加的第 4 篇連結；英文稿的中英一致、英文引號內文字是否逐字、英文自然度。

### 必須修

1. **英文第 91 行，引號裡不是 Brod 的原文。** 稿子寫 the meta-analysis finding of "a wide distribution centered on zero"。原文（`brod2021_PMC8377096.txt` L18）是「a wide distribution of effect sizes that centers around zero」。兩種改法擇一：改成原文的字，或拿掉引號。中文第 91 行的「分布很寬、中心在零」在中文語境裡是轉述，可以不動。
2. **英文第 153 行，兩組引號都不是問卷原文。** 稿子寫 the first rated "the burden caused by the design of the concept map," the second rated "the burden caused by the design of the problem-solving tasks"。補充資料的題目原文是例如「The design of the concept map was inconvenient.」與「The design of the tasks was inconvenient.」（見 `gorbunova2025-pretraining.md` 研究設計一節）。改成不加引號的轉述，例如 the first asked about the design of the concept map, the second about the design of the tasks；或者引題目原句。

### 建議修

1. 英文第 28 行引第 1 篇英文版那句："A public article cannot know who is reading," 第 1 篇英文版第 161 行的原句是以句號結尾的完整句。字是逐字的，只有句末的標點依美式慣例換成逗號、放進引號內，可以接受。若要嚴格逐字，可改成 on the grounds that "A public article cannot know who is reading", proposed ...，或者不加引號。
2. 英文第 30 行 One review on letting readers choose their own path I could not find in a legally public full text. 語序不自然。建議改成 I could not find a legally public full text of one review on letting readers choose their own path.
3. 英文第 37 行表格 The authors object to reading this as "prior knowledge does not matter"：引號裡是讀法，不是作者的字，容易被讀成直接引語。可以拿掉引號，或寫 as meaning that prior knowledge does not matter。第 65 行 "prior knowledge does not affect how much is learned" 同理。
4. 英文第 95 行 rated their comprehension higher：Brod 原文是「Comprehension ratings ... were strongly enhanced」，沒有說是受試者自評還是研究者評分。建議改成 had higher comprehension ratings。

### 已確認修好（中文四項小修與新連結）

- 中文第 75 行：馬太效應的括號改成「原文 a Matthew effect for written instruction；馬太效應一般指……」，說明和作者的用語分開了。英文和原文（Simonsmeier 接受稿「thus indicating a Matthew effect for written instruction」）逐字相同。
- 中文第 113 行：「常」拿掉了，和原文導言相符。
- 中文第 22、221 行：兩處都寫成「其中 4 個出自同一篇」，前後一致。
- 中文第 28 行：改成「第 1 篇以『一篇公開的文章沒辦法知道誰在讀』為理由」，和第 1 篇中文第 161 行的原句逐字相同。
- 中文第 239 行新加的[第 4 篇](/posts/learning/2026-10-14-notation-jargon-terminology)連結檔案存在，第 4 篇第 234 行確實有試讀的建議。參考資料第 304 行的標題「教學文章裡的術語、符號與公式怎麼處理」和第 4 篇的 title 前半相符。英文版也有對應的連結與參考資料。
- `check-tw-terms.mjs`：0 blocking、0 to review。

### 中英一致與其他沒問題的項目

- 開頭但書、結論表、各節、來源說法不同的地方、可以做的事六條、規格對照表四列、限制、附錄、參考資料：逐段對過，內容、數字、連結、表格都一致。英文版的「依據強度」與推論標記，和中文定稿的標法相同。
- 英文引號內的其他文字都和原文逐字相同：Simonsmeier 結論句、Brod「Only when it is activated…」、Tetzlaff「the instructional implication…」、Google 等式、MDN「In a guide or tutorial…」、第 3 篇英文版的「may exist only for」、Gorbunova 摘要句（`pretraining2025_PMC12367772.txt`）、Kim 與 Ko 的「few」／「none」、Mullaney 的「a bundle of changes」、MDN 的「if any」與「Write with SEO in mind」、Brod 的「it suggests」。
- 站內英文連結八個（含中文版）都存在；所列篇名都和各篇英文版的 title 相符；系列名稱「Writing Articles That Teach」和其他英文篇一致。
- 英文整體自然，沒有逐字硬譯的段落。上面建議 2–4 是僅有的幾處。

## 2026-10-14 英文稿修正確認

- 時間：15:27–15:33（CST）。sha256：英文 `f34473c70d22127584f265c24c488362aa79d878280e35432bba5193278ec03b`；中文 `6cfced6d…0efb`，和上一輪相同。

### 必須修

沒有。

### 建議修

1. 英文第 54 行的 "posttest minus pretest" 是本文自己下的說明，不是引語。中文用「」是標詞，英文加雙引號容易被讀成引自原文。可以拿掉引號，或改用斜體。不影響正確性。

### 已確認

- **引號逐字**：全文 frontmatter 以外的英文引號，我逐一列出來核對過。凡是標成原文的，都和原文檔或抽取紀錄逐字相同：
  - Brod：第 91 行 "a wide distribution of effect sizes that centers around zero"（L18）、"Only when it is activated…"、第 97 行 "whale"／"that whales can be found in the Arctic Ocean"／"that whales are mammals"（L14）、第 272 行 "at least three"、第 217 行 "it suggests"。
  - Gorbunova：第 151 行的摘要句；第 153 行兩個問卷題 "The design of the concept map was inconvenient."、"The design of the tasks was inconvenient."（依抽取紀錄對補充資料的轉錄）。
  - Kim 與 Ko：摘要的 "few"（原文 few were tailored）；正文與討論的 "None"（None of the tutorials／None provide）；表頭 "Coding experiences"（依抽取紀錄，表是圖片）。
  - 其他：Simonsmeier 兩句、Tetzlaff、Google 的 "to do a task" 與等式、MDN 的 "if any"／"Write with SEO in mind"、第 3 篇的 "may exist only for"、Mullaney 的 "a bundle of changes"、Scheiter 題名。
  - 第 28 行引第 1 篇英文版那句，改成了不加引號的轉述，沒有問題。
  - 其餘引號（"assistance"、"link"、"High prior knowledge"、"a choice this site makes"、示範句等）都是標詞或本文自己的例句，沒有標成引文。
- **代名詞**：全文 he／his／him／she／her／himself／herself 零命中。Brod 一律以姓名、the author、it 指稱。
- **中英一致**：中文稿沒有變動。英文這輪的修改（第 85、91、95、97、153、167、223、231 行等）都是措辭與引號的調整，內容和數字仍然和中文對得上。
