# 已發佈五篇修改的獨立複審（2026-10-14）

審稿者沒有參與撰寫或修改。範圍：`git diff -- src/content/posts/learning/2026-10-13-*` 的全部改動（中英十檔，未提交），對照 `.work/reviews/2026-10-14-published-five-fix-log.md` 第一到七輪。依據：抽取紀錄（`articles-that-teach/`、`teaching-text/`）、`_audit/provenance.md` 第二批、`_audit/bisra-dissertation.md`；Hamaker 另查了 ERIC API 的摘要（EJ351754）。沒有改檔、沒有 commit。

審前審後 sha256（13:08，兩次相同，審稿期間沒有人改檔）：

| 檔 | sha256 前 16 碼 |
|---|---|
| diagrams-in-teaching-articles-en | 0cbae7dd43894021 |
| diagrams-in-teaching-articles | 5627180a0a1bceac |
| instructional-video-in-articles-en | cd98f131a6708529 |
| instructional-video-in-articles | c03286451377bcbd |
| teaching-text-evidence-en | 538357a74cf7380d |
| teaching-text-evidence | 60222c3339e373c0 |
| teaching-text-questions-feedback-en | 44ae5d944d8c9b20 |
| teaching-text-questions-feedback | 44e3ec22de5dee94 |
| video-beside-text-layout-en | 9e069e6969a99744 |
| video-beside-text-layout | 447c3127fe5f773f |

行號以中文檔為準；除特別註明，英文檔同一行。

---

## 必須修（5 項）

### 1. 提問篇 L107：還在用 Wittwer & Renkl 的結果，而且指向已刪的內容

- 原句：「第 1 篇引過一個相鄰的結果：例題旁的解釋如果要學習者自己要求才給，效果不顯著（只有 4 個比較，和預設顯示的差異也不顯著）。……照這兩個結果，我的做法是……」英文 L107「Part 1 cites a neighboring result: explanations beside a worked example had no significant effect when given only on learner demand (4 comparisons…)」。
- 問題：這是 Wittwer & Renkl 2010（⚠ 不得引用）的數字，第 1 篇已經整段刪掉（修改紀錄第六輪 3）。這句沒寫作者名字，所以全站 grep「Wittwer」沒抓到。現在它既引了不得引用的數字，又指向第 1 篇已經沒有的內容。
- 改法：刪掉這一句。下一句的「照這兩個結果」改成「照這個實驗的結果」，或說明這個做法只有術語實驗一項依據。

### 2. 提問篇 L165：還是舊的、錯誤的對照（必 3 沒有改到這一篇）

- 原句：「附答案的條件在重複題上分數最高，原作者不把它當成建議；在新題上，兩份來源都不支持附答案。」英文 L165「on new questions, neither source supports giving the answer」。
- 問題：第 1 篇 L184 已依 `sana2020.md:20–22` 改成：Sana 的期末考每一題都對應問過的事實，沒有考新題；在問過的內容上，兩份的方向相反。提問篇這句「細節在第 1 篇」，但結論和第 1 篇現在的寫法矛盾。
- 改法：照第 1 篇的結論改寫。例如：「在問過的內容上，統合分析的附回饋組分數最高，Sana 的附答案組較低，方向相反；在沒被問到的內容上，統合分析裡附回饋沒有幫助，Sana 沒有考這類題目。」

### 3. 提問篇 L161：引了 Hamaker 的內容

- 原句：「Hamaker 的回顧把考題分成相關與無關兩種，正好能補這個缺口，但我沒讀到合法公開的全文。」英文 L161 相同。
- 問題：「分成相關與無關兩種」出自不合規原文檔的內容（`hamaker1986.md:23`）。ERIC 摘要只寫「factual and higher order adjunct questions」和「13 design variables」，沒有提到相關／無關的分類。依證據規則，⚠ 來源只能寫「這篇研究存在」。
- 改法：改成「更早的 Hamaker 1986 回顧也處理過插入式問題，我沒讀到合法公開的全文」，或直接刪掉。

### 4. 證據篇 L72「合起來：解釋要寫，但不要只有作者在解釋……」：結論超出現在的來源

- 問題：Wittwer 的 d = 0.16 拿掉之後，「解釋要寫」只剩一個依據：Bisra 作者提醒，好處有一部分可由現成解釋提供（論文第 4 章）。同一節另一個來源是 IES，它說「有些研究裡，不帶逐步解釋的例題效果最好」（`ies2007.md`，原文第 1111–1119 行），方向正好相反。「合起來」這個寫法看起來像來源的結論，而且沒有標成推論；結論表這一列已經改成「未定」，正文卻沒有跟著降調。
- 「至少和多寫一段說明一樣有效」有 Bisra 的依據：對照組拿到現成解釋時，自我解釋仍勝 0.35。但這只有 6 個比較，要寫出來。
- 改法：拆成兩句。
  - 「現成解釋本身有沒有幫助，我讀得到的來源方向不一（IES 對 Bisra 作者的提醒）」
  - 「要讀者自己解釋這一側有支持；對照組拿到現成解釋時仍勝出，但只有 6 個比較」
  - 「在關鍵步驟停下來問為什麼」標成我的推論，並加進限制節的推論清單。英文 L72「Taken together: write the explanation…」同改。

### 5. 提問篇 L205：「−0.23（邊緣顯著）」說錯了邊緣顯著的對象

- 原句：「控制組拿到學習目標這類相關活動時，讀前題在沒被問到的內容上的相對效果是 −0.23（邊緣顯著）。」英文 L205「−0.23 (marginal)」。
- 依據：`king_shepard2025.md:95`。邊緣顯著的是「控制組類型」這個調節變項的整體檢定（F(2, 172) = 2.68，p = .07，三類 0.01／−0.23／0.29），不是 −0.23 這一格本身。內文原句寫「did not significantly differ」。
- 改法：「……相對效果是 −0.23；控制組類型這個調節變項整體只到 p = .07，作者在內文說沒有顯著差異。」

---

## 建議修

1. **提問篇 L54 的做法、L218 今晚第 1 項**：都要讀者用「解釋為什麼」「換個條件會怎樣」的題型。現在的證據是：結論表第二列降成「弱」，讀後題的題目層次「沒有結論」，而且 `pan_carpenter2023.md:134` 有反向證據。這兩處沒有標成推論。建議比照證據篇 L134 補「這是我的推論，而且有相反的證據」。
2. **「最常被引用」沒有出處**：提問篇 L44、L50、L225（中英）。建議改成「經典的」，或刪掉。
3. **證據篇 L125**：「Hamaker 1986 年回顧也處理過這個問題」。ERIC 摘要沒有提到沒被問到的內容。照規則嚴格讀，只能寫存在。建議改成「更早還有 Hamaker 1986 的回顧，我沒讀到合法公開的全文」。
4. **推論計數已經過時**：
   - 證據篇 L213 寫「六處」，沒有算到這幾處：L184 的 Sana／King-Shepard 推論（正文有標）、L190 的「在遷移上未必衝突」、L72 的「合起來」（見必須修 4）。
   - 提問篇 L236 寫「七處」，沒有算到 L48「出什麼題……最可能被記住」。
5. **「兩邊在遷移上未必衝突」沒有標成推論**：證據篇 L190、影片篇 L166（中英）。這是抽取時審稿者的解讀（`cromley_chen2025.md:254`），而且 `:159` 說原文沒有講清楚 Table 3 的 pre-training 指單一原則還是整個大類。建議標「我的推論」，並補上這個不確定。
6. **影片篇 L227**：「這個數是抽取時推出來的」把研究流程寫進正文。建議改成「這是我從自由度推算的，原文沒有明說」。英文「inferred when extracting the paper」同改。
7. **證據篇小節標題**「例題旁邊的解釋，證據我讀不到」：節內有讀得到全文的 Bisra。建議改成「例題旁邊的解釋：直接比較的統合分析我讀不到」。
8. **證據篇 L212**「研究筆記裡記的是 Wittwer 與 Renkl 的兩篇」：研究筆記屬於研究過程。建議只寫「德語圈教學解釋的研究，目前沒有我讀得到合法全文的」。L215 與提問篇 L238 的「初稿依網路上的第三方轉存檔……2026-10-14 拿掉」比較像更新紀錄；要不要另立一節，由主線決定。
9. **提問篇 L161**「課堂裡學完之後的小考」：Yang 也收了講課前的小考（34 個效果量，0.186）。建議改成「多半是學完之後的小考」。
10. **提問篇規格表 L181**「每個主要小節結尾放一題」判定「有支持」：依據只剩 Yang，而 Yang 明文排除實驗室與線上課程。建議改成「間接支持」。
11. **圖表篇 L191、附錄 L433（Ploetzner）**：文章寫「看 2 分鐘……看完立刻作答」。實際程序是每種題目前各看一次 2 分鐘（`ploetzner2021.md:33`）。建議補「每種題目前各看一次」。
12. **證據篇英文附錄 Bisra**：「chapter 4 gives the same figure as 0.36」語意彆扭。建議改成「chapter 4 reports it as 0.36」。

---

## 確認沒問題

- **⚠ 來源**：
  - 十個檔裡 andymatuschak、gwern、swood34、ResearchGate 的連結都是 0 筆。
  - Hamaker 只剩「存在」的說明與 DOI（證據 L125、L215；提問 L44、L50、L181、L225、L238），例外是上面的必須修 3、建議修 3。
  - Wittwer 只在證據 L66、L212、L215，例外是必須修 1（提問 L107，沒寫作者名）。
  - 兩篇都已經不在參考資料與附錄裡。
- **Bisra**：每個數字都和 `bisra-dissertation.md` 的判定一致。「口說」已改成「選擇題與填空」（證據 L70、提問 L60）。0.41 已註明出自表 3、第 4 章寫成 0.36。p = .255 已寫成組間檢定。兩篇的參考資料都改列博士論文第 2 章。
- **Cromley & Chen 2025 的位置**（依指示這次沒動 ⚠，只列出）：
  - 證據篇：L190、L205（6.8 分鐘）、L208（Egger，沒寫名字）、L211、L253、L275。
  - 提問篇：L111、L119、L121、L167、L183、L229、L257、L280。
  - 影片篇：L166、L186、L227。
  - 以上中英同行。圖表篇 L235、L437 的是 Cromley 等 2020，另一篇研究；provenance 表把它列進去是 grep 誤抓。
  - 第一輪對 Cromley 新加的內容（收錄條件、92 篇、兩個信賴區間、0.53 的歸屬、約 446 個效果量）對過 `cromley_chen2025.md:16–17、73–78、86–89、156–159`，數字與區間的對應都正確。
- **回抽取紀錄核對的新句，都相符**：
  - 必 1–3 的改寫（`hundhausen2002.md:40–54、78、97–104`；`sana2020.md:21–22`）。
  - Kann、Hansen III／VI、Gurka、71% 的 10／14 與 8／14。
  - Janelli：399 人、p = .42、22.4／33.3／31.3／50.5%、d = 0.46、兩個保留。
  - St. Hilaire：0.54、0.04、兩條排除標準；「原因不明」出自 King-Shepard，`:124`。
  - Danielson：兩套數字、女性比例 p ≤ .10。
  - Tetzlaff：小學只有 2 個研究、人文與語言領域「especially weak」、d = 0.971。
  - Kaminski 72 人。
  - Yang：0.51、0.56、0.32，沒有兩兩檢定。
  - IES：條件與範圍。
  - Stanny 23 個網站與其餘類別、Uluçınar、Delgado、Wisniewski「約 61,000」。
  - Berney：表 3 數字、Kühl 6／14、前言與討論的定性不同。
  - Rey：納入條件、出版偏誤、Singh 4／7。
  - Hohman：轉述的對象。
  - Barbieri：作者順序、55 個研究裡 2 個準實驗。
- **降調**：
  - 證據篇：結論表「未定」，description 已改。
  - 提問篇：tldr、結論表兩列（「中到強」「弱」）、限制節「沒有我讀得到合法全文的綜整」都已降調。
  - 圖表篇：tldr、L22、L30、L146 標題、L167、L216、L354 對「預測」的說法一致，都是「只有一個實驗，沒有測到差異」。
  - 沒降到位的見必須修 4 與建議修 1。
- **中英一致**：逐段比過全部新增與改寫的句子，數字、限定條件、連結都對應。中英共有的問題已在上面各項一起註明。
- **系列編號**：
  - order：證據 1、圖表 2、影片 5、版面 6、提問 9。
  - 圖表 L20 寫「第 2 篇；第 5 篇…第 6 篇」，英文 part 2／5／6。提問寫「第 1 篇」，英文 part 1。這些都對。
  - 版面篇的「上一篇」指影片篇，order 5 接 6，是對的。
  - 證據篇與影片篇沒有寫成數字的篇次錯誤。
- **台灣用語**：
  - `check-tw-terms.mjs` 跑五個中文檔，都是 0 blocking、0 to review。
  - 人工掃新增句，只有「支持」（證據支持的意思）和「程序」（程序性測驗），都是正確用法，不屬於替換表裡軟體義的那兩項。
- **新外部連結**：summit.sfu.ca、rongjunyu.org、roderic.uv.es、Delgado／Janelli／St. Hilaire／Wittwer 的 DOI 都是 200。Hamaker（SAGE）與 Yang（APA）的 DOI 回 403，是出版社擋機器，DOI 本身正確。

## 沒做的事

- 沒有回原文 PDF 逐字重對。核對到抽取紀錄為止，只另外查了 Hamaker 的 ERIC 摘要。
- 沒有看渲染後的頁面，也沒有跑 verify 或建置。
- 修改紀錄第三節「沒有紀錄可對的來源」那批約 55 個來源不在這次範圍。

---

## 第二輪複審（2026-10-14）

範圍：修改紀錄第八節（第五輪）列的 17 項。另外不靠作者名、改用內容找依賴 Hamaker 或 Wittwer & Renkl 的殘句。依主線決定，「初稿依第三方轉存檔……2026-10-14 拿掉」保留在限制節，這一輪不再列。沒有改檔、沒有 commit。

審時 sha256 前 16 碼。證據、提問、圖表、影片四篇的中英檔都變了；版面兩檔和第一輪相同：

| 檔 | sha256 前 16 碼 |
|---|---|
| diagrams-en | bb27702d9131796a |
| diagrams | a7e605c33566a1a1 |
| video-en | d67f8eee6fd156f9 |
| video | cdc862709c5a0cf9 |
| evidence-en | ac7d0d77b30350a2 |
| evidence | 44f84253fecd26d6 |
| questions-en | 16ddd3f771ac5a83 |
| questions | 04782e8176a90511 |
| layout-en | 9e069e6969a99744 |
| layout | 447c3127fe5f773f |

### 逐項結果：17 項都修好了，中英一致

必須修：

1. **提問 L107**：Wittwer 那句已刪，改成「依據只有上面這一個實驗」，折衷做法仍標推論。英文 L107 同。
2. **提問 L165**：已和第 1 篇 L184 一致：問過的內容方向相反，Sana 沒考沒被問到的內容。英文同。
3. **提問 L161**：相關／無關分類那句已刪；「多半是學完之後」也改了。英文同。
4. **證據 L72**：已拆成三層：來源方向不一、自我解釋只有 6 個比較、做法標成推論。推論也加進 L213 的清單。英文 L72 同。
5. **提問 L205**：已改成「−0.23；控制組類型這個調節變項整體只到 p = .07，內文說沒有顯著差異」，和 `king_shepard2025.md:95` 相符。英文同。

建議修：

1. 提問 L54 與 L216：已標推論，並寫明 Pan 與 Carpenter 的反向證據是讀前題、不是讀後題。
2. 「最常被引用」：L44、L225 改成「經典的」；L50 不再提 Hamaker。
3. 證據 L125：只剩「存在」。
4. 推論計數：兩篇都改成九處，清單內容和正文對得上。
5. 證據 L190、影片 L166：已標「我推論」，並補上 0.28 指單一原則還是整個大類，原文沒有說清楚。
6. 影片 L227：已改成我自己推算（另見下面第 3 點）。
7. 證據的小節標題已改。
8. 證據 L212 已改。
9. 提問 L161 已改。
10. 提問規格表 L181：已改成「間接支持」。
11. 圖表 L191、L433：已補「每種題目之前各看一次（每次 2 分鐘）」，和 `ploetzner2021.md:33` 相符。
12. 證據英文附錄已改成「reports it as 0.36」。

### 用內容找殘句

- 用 Hamaker 的內容詞搜五篇中英十檔：百分點、1960、不限時／限時、四成、5,000 字／五千字、12 個實驗、相關與無關的考題、高階、詳細回饋。
- 用 Wittwer 的內容詞搜同一批檔：要求才給、預設顯示、概念性知識、0.16、minimal、近遷移、遠遷移，以及英文的 on demand、by default、percentage point、time limit、unrelated、higher-order、detailed feedback。
- 命中的都和這兩篇無關：
  - 圖表的 mermaid 量尺寸、Delgado 的限時、King-Shepard 的字數。
  - 證據 L43 的「五千字的導讀」。
  - 無關內容（seductive details）。
  - Janelli 的回饋組。
  - Schroeder 與 Lawson 附錄的數字。
  - 證據 L184 的「可點選解釋」：出自 Bisra 論文第 4 章轉述的 Schworm 與 Renkl，`bisra-dissertation.md` 判定論文有，不是 Wittwer。
- 全站 `src/content` 搜 Hamaker、Wittwer、adjunct：本系列以外只有 CS146S 那篇的「adjunct lecturer」，和這兩篇無關。
- **沒有找到殘句。**

### 新引入的問題：沒有必須修，建議修 3 項

1. **證據 L72「Bisra 等人的作者則提醒」**：「Bisra 等人」本身就是作者，這個寫法重複。建議改成「Bisra 等人則提醒」。
2. **證據 L66、L68、L72 內容重複**：「IES 說不帶解釋最好」「只有 6 個比較」「好處有一部分可由現成解釋提供」在三段裡各出現兩次。建議 L66 只說「這篇存在，讀不到」，L72 保留結論。英文 L66–72 同。
3. **影片 L227 同一句說了兩次「從自由度推算」**：「從自由度推算大約只用了 446 個效果量……；這是我從自由度推算的」。建議改成「大約只用了 446 個效果量，不是全部 591 個；這是我從自由度推算的，原文沒有明說」。英文「judging from its degrees of freedom; I calculated that from the degrees of freedom」同改。

### 其他

- `check-tw-terms` 跑有變動的四個中文檔，都是 0 blocking、0 to review。
- 系列篇次說法與第一輪相同，沒有變動。

---

## 第三輪複審（2026-10-14，Cromley & Chen 2025 暫時拿掉數字）

範圍：commit 7e716e3e 之後證據、提問、影片三篇中英的改動（修改紀錄第九、十節）。核對依據：`articles-that-teach/sundararajan2018-seductive-details-dissertation.md`、`teaching-text/rey2019.md`。沒有改檔、沒有 commit。

審時 sha256 前 16 碼。圖表與版面四個檔和第二輪相同；證據、提問、影片六個檔有變動：

| 檔 | sha256 前 16 碼 |
|---|---|
| video-en | c2d2194845925979 |
| video | 12b525d2e0bcbc4e |
| evidence-en | 702a57bfb74dafb8 |
| evidence | 6177f288a15af4d2 |
| questions-en | 99a548b990a299c1 |
| questions | a469d404af78bee2 |

### Cromley 殘句：沒有

先用作者名搜。Cromley 只剩下面這些地方，每一處都只寫「存在、作者稿預定 2026-11-01 公開、不引數字」：

- 證據 L190、L214
- 提問 L111、L235
- 影片 L166、L227
- 以上中英同行。

再用內容搜，關鍵詞包括：0.70、1.00、6.8、7 分鐘、446、591、18 個原則、0.19、0.28、0.53、單一研究團隊、Mayer 掛名、Mayer 自己的研究、逐年、三十三年、未必衝突、差別見第 5 項、一半短於、personalization、0.37、92。命中的都是別的來源，例如：

- Carpenter 1.00、Lawson 的時間倍數
- Carpenter 影片約 7 分鐘
- Shaffer／Sibia 的計數
- Rey 附錄裡學習者控步調的 0.19
- Schroeder 與 Kucera 校正後的 0.28
- Yang、駁斥文字、St. Hilaire、Bullock 的數字

第 1 篇、影片篇、提問篇的附錄與參考資料都已經沒有 Cromley 條目，三篇也都已不再依賴它推論。

### 新句與數字核對

- **證據 L190「分段的效果量」**：Rey 的記憶 0.32、遷移 0.36，「加權合併」，以及「切段或學習者控步調其中一項就算」，都和 `rey2019.md` 相符（第 12、16、27 行，結果 7、8）。先備訓練那一半拿掉後，沒有留下斷掉的句子。英文同。
- **證據限制節**：拿掉 6.8 分鐘；出版偏誤一條只留 Barbieri（Egger 顯著、trim-and-fill 校正）；推論清單改成八處，數目和列的項目對得上。英文同。
- **影片 L166、L186、L227**：Cromley 的數字、區間、92 篇、446 個效果量都拿掉了。Mayer 的 0.85 是「兩個實驗、同一篇、沒加權」，0.67 是「沒有依樣本數加權」，這兩個說法原本就在文中，出自 Mayer 2021，這次沒有新增數字。英文同。
- **提問篇 Sundararajan**：54 個比較、5,111 人、g = −0.43（−0.55 到 −0.31）、Egger 與等級相關都 p < .01，都和紀錄結果 1、52 相符。抽查 group-13 通過。典藏連結回 200。
- **降調**：
  - 對話式語氣：從「弱到中」降成「未定」，正文的「保留，不是結論」和結論表一致。
  - 有趣但無關的內容：從「中，來自單一研究團隊」改成「中；偏誤檢定顯著」。
  - 「來源說法不同」的時間調節那一條整條刪掉，因為它比的是 Ginns 摘要對 Cromley，刪掉是對的。
- **中英**：三篇逐段比過，數字、限定條件、連結都一致。
- **台灣用語**：`check-tw-terms` 跑三篇中文檔，都是 0 命中。

### 必須修（1 項）

1. **提問 L119–121 與附錄 L254（中英）：Sundararajan 只寫了 −0.43，漏了作者自己的敏感度分析與場域限定。**
   - 紀錄結果 54：g < −1 的 11 個研究裡，6 個有同一位共同作者；拿掉這 6 個之後，整體從 −0.43 變成 −0.28。作者說整體效果「may be slightly exaggerated」，大小「difficult to ascertain … conclusively」（L828–835）。紀錄「與清單不合」第 1 點明說：只寫 −0.43、不寫 −0.28，是取了作者結論的一半。
   - 紀錄結果 47：54 個比較裡 50 個在實驗室，教室裡的 4 個是 −0.15，沒有測到差異。
   - 紀錄結果 34：品質評為高的 17 個研究是 −0.24。
   - 文章現在只寫「偏誤檢定顯著，所以幅度可能偏高」。建議正文補 −0.28 與作者的說法。附錄補教室 4 個 −0.15（不顯著）、高品質 17 個 −0.24，以及「單一編碼者、沒有一致性係數」。結論表的強度可維持「中」，但證據欄要加「多數在實驗室」。

### 建議修（4 項）

1. **提問 L119 與附錄 L254「這份論文後來改寫成 Sundararajan 與 Adesope 2020 年的期刊論文」**：抽取紀錄只寫論文版「不是」期刊版，沒有確認兩者是改寫關係（`:6`、`:213`「期刊版 2020 是否收錄不知道」）。建議改成「同一主題另有 Sundararajan 與 Adesope 2020 的期刊論文，我只讀到摘要，數字可能不同」。英文「was later adapted into」同改。
2. **提問 L115「我沒有為了這項證據改口吻」**：對話式語氣現在沒有任何引了數字的證據，「這項證據」沒有可以指的對象。建議改成「對話式語氣目前沒有我讀得到全文的證據，所以我沒有改口吻」。英文「on the strength of this evidence」同改。
3. **影片 L166「這個數字另有一份可以對照的統合分析」**：緊接著就說不引它的數字，所以實際上沒有可以對照的東西。建議改成「另有一份重新合併 Mayer 掛名研究的統合分析……」。英文「There is a meta-analysis to compare it with」同改。
4. **跨篇數字**：圖表篇 L102 依 Noetel 轉引 Sundararajan 與 Adesope 2020 的 0.33（拿掉細節的效果），提問篇用論文版的 −0.43，兩者方向的寫法相反（拿掉對保留），大小也不同。提問篇已寫「數字可能不同」；可再補一句「圖表那篇轉引的期刊版數字是 0.33」，免得讀者以為兩篇矛盾。

### 沒做的事

- 沒有回 Sundararajan 論文 PDF 重對，以抽取紀錄與 group-13 抽查為準。
- 沒有看渲染後的頁面。

---

## 第四輪複審（2026-10-14，24 個沒有合法全文的來源、兩個連結、Sundararajan 敏感度分析）

範圍：修改紀錄第十一、十二節，對照 `.research/2026-10-14-reading-list-video-posts.md`。工作區相對 commit 7e716e3e 的改動裡，第三輪已審過的 Cromley 部分不重審。沒有改檔、沒有 commit。

審時 sha256 前 16 碼。版面兩檔沒變，其餘八個檔都變了：

| 檔 | sha256 前 16 碼 |
|---|---|
| diagrams-en | b4425d82e96f2264 |
| diagrams | 03fe9efad233cb74 |
| video-en | b134f94d2ea088fb |
| video | 1c71b51e51ce6ba0 |
| evidence-en | 1897a089de80366b |
| evidence | 3b519a85d016a9f2 |
| questions-en | 548e6a013ff4b556 |
| questions | 42101cac67c274d0 |

### 結論：沒有必須修

### 逐項核對

#### Sundararajan（提問 L115–121、L35、附錄 L254，中英）

下列數字都和 `sundararajan2018-seductive-details-dissertation.md` 一致：

- 敏感度分析：11 個效果低於 −1 的研究裡，6 個有同一位共同作者，拿掉後是 −0.28，原文沒有給信賴區間。作者說效果「may be slightly exaggerated」、大小難定（結果 54、L828–835）。
- 場域：實驗室 50 個 −0.46；教室 4 個 −0.15，95% CI −0.56 到 0.25（結果 47）。
- 品質評為高的 17 個是 −0.24，評分規則原文沒有交代（結果 34）。
- 單一編碼者。

「同一主題另有……期刊論文」已拿掉改寫關係的說法。0.33 與 −0.43 的正負號說明正確，站內連結也對。結論表改成「中；偏誤檢定顯著，大小難定」，證據欄加了「研究多數在實驗室」，降調到位。

#### 影片篇：Mayer 2021

- **第 5 項「先交代關鍵名詞」**：0.85、煞車實驗、活塞都拿掉了，只寫「存在」。L168 標成「我的判斷」，推論清單同步。段落順序是「原則存在 → Cromley 存在 → 所以是判斷 → 做法」，邏輯沒有斷。
- **第 7 項改用 Rey**：
  - 保留 0.32、遷移 0.36、納入條件擇一、學習時間較長但有出版偏誤，都和 `rey2019.md` 第 16、24 行及結果 7、8 相符。
  - 「語文配圖片或動畫」對應原文第 27–28 行的定義。
  - 附錄 L250：系統步調四項都顯著、學習者步調只有遷移顯著、−0.92，都和第 1 篇一致。
- **限制節**：改成「分段測的不是網頁版面」，並交代先備訓練沒有證據。「只知道存在」新增 Mayer 2021。
- **參考資料**：Mayer 換成 Rey。

#### 證據篇：「分段的效果量」整條刪除

刪得合理：Mayer 拿掉後已經沒有對照。全篇 grep「Mayer」，只剩「只知道存在」那一行裡 Cromley 的說明；「來源說法不同」的其他條目不受影響。

#### 圖表篇

- **Cleveland & McGill**：正文 L142 只寫存在。結論表 L35、L114 都標成「我的判斷」，L142 也寫明「讀完 Heer 與 Bostock 之前，下面的動作是我的判斷」。L144 的「不要用圓餅的角度、氣泡的面積……」因此是在判斷底下，降調到位。
- **Fiorella & Mayer**：L231 只寫存在。條件、Schwamborn 0.81、「先教怎麼畫」「底圖」都已清掉。小節標題「先畫再對照」仍由 Leutner 與 Biele 撐住（L235–237），邏輯沒有斷。
- 兩篇都已從附錄與參考資料移除，並加進 L387「只知道存在」。

#### 換連結

- **Tversky 等 2002**：Teachers College 教師頁，curl 回 200。清單第 29 行記錄這份檔和舊檔位元組相同。
- **Larkin & Simon 1987**：Wiley pdfdirect，curl 被 Cloudflare 擋（403），但用 Exa 抓得到正文（標題、作者、摘要），可以開。正文 L118 和參考資料 L448 都換了，中英一致。
- **舊連結殘留**：全站 grep archemedx、dsciclass、mechanism.ucsd、hci.stanford 的 Tversky 檔，都是 0 筆。
- **其他新 DOI**：Mayer 2021（Elsevier）與 Cleveland（T&F）回 403，是出版社擋機器；Fiorella & Mayer 的 DOI 回 200。

#### 轉引數字有沒有標明（依主線決定保留）

- **圖表篇 Noetel**：
  - L73 的 0.63 寫明「這篇回顧的各項數字都取自個別的統合分析，下一節逐項標明是誰轉引誰」。
  - L88、L96、L102 各寫「Noetel 轉引 X（原文我只讀到摘要）」。
  - 限制 L383 寫「三個原則的數字是轉引」。
  - L76–80 的 0.70／0.20、0.41／0.27 是 Noetel 自己的調節分析，不是轉引。
- **版面篇**：L146、L226、L245 都寫「Noetel 轉引 Schroeder 與 Cenkci」。
- **影片篇 Karnad**：L114「回顧轉引 Soong」、L116「回顧也轉引了 Leadbeater」；附錄 L244 寫「轉引的數字」，含 Traphagan 的 83%／70%；限制 L231 寫明 Soong、Traphagan、Leadbeater 都是轉引。
- **其他**：Brame、IES、Bisra 論文的轉引在先前幾輪都已確認有標。
- 結論：都有標成轉引。

### 用內容找殘句

搜過的詞：0.85、0.67、0.68、0.81、14 條、煞車、brake、活塞、Schwamborn、底圖、先教怎麼畫、位置最準、圓餅、飽和、「第 5 項」「第 7 項」「Mayer 的回顧」，以及 archemedx、dsciclass、mechanism.ucsd、hci.stanford。

命中的都和這幾篇不得引用的來源無關：

- 0.67 是 Guo、Bisra、Sana、King-Shepard、Visual Transcripts 的 p 值；0.68 是 Prinz-Weiß 等。
- 0.81 是 King-Shepard 的 CI 與 Visual Transcripts。
- 「圓餅」在 L144，已在判斷底下。
- 「Mayer 2021」只剩影片篇 L164、L186、L227、L232 的「存在」說明，與 Lawson 與 Mayer 2021（PMC）的合法引用。

沒有找到殘句。

### 中英

- 逐行比對影片 L164、166、168、186、227、230、232、250、268。
- 逐行比對圖表 L35、114、142、231、387、448、456。
- 逐行比對提問 L35、115–121、254。

數字、限定條件與連結都一致；站內連結中文版指向中文、英文版指向 `-en`。

### 台灣用語

`check-tw-terms` 跑四個有改動的中文檔：0 命中。

### 建議修（2 項）

1. **影片參考資料 L268**：「依系列第 1 篇的抽取紀錄」把研究流程寫進正文，參考資料其他條目寫的是讀了哪些部分。建議改成「讀了全文，細節見系列第 1 篇的附錄」，或照實寫讀了哪些節。英文「Based on the extraction record used for part 1 of this series」同改。
2. **圖表 L142 和參考資料 L450 的 Heer 與 Bostock**：
   - L142 現在明寫「在讀完 Heer 與 Bostock 的全文之前」，參考資料 L450 也寫「讀了摘要與引言」。這篇等於明說只讀了摘要，卻列在參考資料裡，和證據篇、提問篇開頭「列進參考資料的都從頭讀到尾」的規則不一致。
   - 這是既有狀態，不是這輪造成的；它在 38 篇待精讀名單裡，主線指示不動。
   - 列這一項是提醒：精讀之前，這一條實際上是「只讀摘要」。

### 不在這輪範圍、順帶看到的

- **圖表 L237「兩邊都同意的只有一點：對照自己的圖與提供的圖是有用的」**：「兩邊」之一是 Cromley 等 2020，正文說它只讀到摘要。說它「同意」這一點，是從摘要推出來的。建議等那篇精讀時一起確認。

---

## 第五輪複審（2026-10-14，依 38 份補精讀紀錄修正）

範圍：修改紀錄第十三到十六節（第十到十三輪），涵蓋已發佈五篇中英。依據是 `_audit/batch3-files.txt` 列的 38 份紀錄。沒有改檔、沒有 commit。

審時 sha256 前 16 碼：

| 檔 | sha256 前 16 碼 |
|---|---|
| diagrams-en | fb2c1ec769a8efc4 |
| diagrams | df5f2c218ff5b9f5 |
| video-en | c6f629b725f1d797 |
| video | 9e9db16ed5637fd5 |
| evidence-en | 0bf52bfc624a8721 |
| evidence | 2b6a3be968de04eb |
| questions-en | d713f50afd146bbc |
| questions | cadf8aec0d10ea04 |
| layout-en | ce218fc332e6db56 |
| layout | b96a22f46c089f9b |

### 抽查（每篇至少 5 處，回紀錄核對）

**第 1 篇（證據）**，以下都相符：
- L82 Alfieri：.50；對依序看同樣案例 .37；找相同點、之後給原則 1.18；這 29 個比較全出自 Schwartz & Bransford 1998 一篇的三個實驗（`alfieri2013` 結果 2、8、15）。
- L184 Richland 實驗 5：78%、90%、63%（結果 20）。
- L242 Carpenter 2018：課末 d = .33、沒被問到的 d = .07（不顯著）；一週後組內 p = .06（結果 4、5、8）。
- L242 Geller：BF01 = 7.20（結果 9）。
- L76 Fyfe：追溯到 Bruner 1966（結果 3）。
- L218 Trafton：轉述和原文一致（紀錄的核對表）。

**第 2 篇（圖表）**：
- 相符：
  - L142、L410 Heer：位置比長度準；角度與圓面積比位置差；面積比角度差；角度沒有比長度差（`heer2010` 結果 4、5）。
  - L108 Trypke：圖加旁白只有 4 個研究，新手可能受益、有先備者受拖累（`trypke2023:24、31`）。
  - L428 Schroeder：美加 0.25，51 個效果量。
  - L402 Cooper：價值態度低 1 個標準差時，圖解沒有測到效果（`cooper2018` 結果 4，p = .15）。
  - L136 Heiser：箭頭的相對差別。
- 不相符：L235 Leutner 與 L167 Byrne 1999，見必須修 1、2。

**第 5 篇（影片）**，以下都相符：
- L114 Soong：1,134 人；48.3%、13.8%、29.2%；附錄寫主要原因那一題 904 人單選（`soong2006` 結果 6、8）。
- L180 Lawson 實驗三：d = .51，p = .136（`lawson2021` 結果 18）。
- L222 Carpenter 2017：單元小考兩個實驗只有一個顯著（結果 9）。
- L110 Harley 的 sequential-access 理由（結果 9）。
- L158、L248 Carpenter 2017 的 90 分鐘：已標成推測。

**第 6 篇（版面）**，以下都相符：
- L86 Visual Transcripts：Z = −2.1，換算雙尾約 0.04、原文寫 0.02（`shin2015:51`）。
- L173 Navarrete：只根據 3 篇實驗，一篇不顯著、一篇合併測（結果 18）。
- L243 Papeos：24.3，表上沒有單位。
- L71 LectureScape：「emulate」只修飾保留的功能（`kim2014-lecturescape:66`）。
- L65 Video Digests：已標成推論。

**第 9 篇（提問）**，以下都相符：
- L161 Kandemir：51 篇、160 個效果量，g = 0.03；延遲至少一天 7 篇，g = −0.35，p = .09；納入條件是電腦輔助、直接比較、隨機或擬隨機分派（`kandemir2026` 結果 1、10，納入標準）。
- L131 Weissgerber：遷移的結論大致成立；回想只抽查、沒有重算（第 13–20 行）。

### 新列入參考資料的 11 篇

- **讀過全文**：每份紀錄都有首尾相接的讀取紀錄，涵蓋全文。
  - Alfieri（L1–3788）、Fyfe（L1–1729）、Trafton（L1–509）、Richland（L1–1546）、Carpenter 2018（L1–1052）。
  - Geller（XML 全文）、Heiser（L1–429）、Heer（L1–1173）、Soong（L1–280）、Kandemir（逐段）、Weissgerber（字元區間首尾相接）。
- **版本合法**，各自屬於：
  - 機構典藏作者稿：Fyfe。
  - 作者網站：Trafton。
  - 開放取用：Geller（PMC，CC BY）、Weissgerber（PMC）、Heiser（Wiley 免費）、Soong（ascilite 論文集）。
  - 作者實驗室放的版本：Heer。
  - 作者自存：Kandemir（HAL 第一作者存放）。
  - 作者網站上的刊出版：Alfieri、Richland、Carpenter 2018，主線已比照 rivers2021 判定可用。
  - 要留意：Richland 與 Carpenter 2018 是 APA 刊出版放在作者網站，紀錄檔頭記了 APA 自存政策只允許接受稿。這件事主線已拍板，這裡只提醒還有這個風險，不列為要修。
- **連結**：Trafton、Geller、Heer、Soong、Kandemir、HAL、Weissgerber 的 DOI 與 PMC 頁都回 200。Alfieri、Fyfe（T&F）、Richland、Carpenter 2018（APA）、Heiser、Cooper（Wiley）的 DOI 回 403，是出版社擋機器，DOI 本身正確。

### 必須修（3 項）

1. **圖表 L167（中英）：同一個研究被當成兩份證據。**
   - 同一段前面依 Hundhausen 寫「Byrne 等人的兩個實驗分不出是預測還是動畫的功勞」；後面又寫「Tversky 等人 2002 年的回顧另外轉述 Byrne、Catrambone 與 Stasko 1999 年的研究：看動畫的好處，和拿靜態圖做預測差不多」。
   - Hundhausen 的 Byrne 兩個實驗就是 Byrne、Catrambone、Stasko 1999（`hundhausen2002.md:16`「Byrne 等 1999 貢獻 2 個」；Naps 的參考文獻 [11] 與 Tversky 原文 L392 是同一篇）。
   - 「另外轉述」讓讀者以為是另一項研究，等於把同一份證據算了兩次；兩份二手來源對它的描述也不同（一個說分不開，一個說差不多）。
   - 建議改成：「Tversky 等人 2002 年的回顧也談到同一份 Byrne 等人 1999 的研究，描述成看動畫的好處和拿靜態圖做預測差不多；Hundhausen 則說兩者的效果分不開。原研究我沒讀。」
2. **圖表 L235（中英）：「而且只在理解上，遷移沒有」說錯了。**
   - `leutner2025:32`：遷移只有 7 個效果量，依 k ≥ 10 的經驗法則，調節分析只做了理解，遷移根本沒有分析這個調節變項。
   - 「遷移沒有」會被讀成「在遷移上測了，沒有效果」。
   - 建議改成：「而且只分析了理解；遷移的研究太少（7 個），沒有做這項分析」。英文「and only on comprehension, not transfer」同改。
3. **證據 L140（中文）：「他與同事」用代名詞指研究者。**
   - 原句是「研究以 Robert Lorch 為代表。他與同事 2013 年的兩個實驗……」，代名詞是從名字推的。
   - 英文版已經寫成「by Lorch and colleagues」。
   - 建議中文改成「Lorch 與同事」。五篇中英其餘地方掃過 he／his／him／she／her 與「他／她」（排除「其他」「他們」），沒有其他命中。

### 建議修（5 項）

1. **版面 L230 推論計數**：仍寫「四處」。L65 新標了「我的推論是：每章有自己的播放器，讀者不必離開正在讀的那一章」，沒有算進去。建議改成五處。英文同。
2. **影片 L180**：「Lawson 實驗三的讀解釋組效果量是 0.51，只是樣本小、沒有達到顯著」。「只是樣本小」是紀錄者對檢定力的推斷（`lawson2021:80`「n 約 32 的 Tukey 檢定力有限」），原文沒有這麼說。建議改成「效果量 0.51，p = .136；每組約 32 人，我推測檢定力不足」。
3. **提問 L131 Weissgerber**：寫「作者之一是被誤編研究的作者」。紀錄 `weissgerber2021:9` 是：被誤編的兩項研究都是作者自己的（Rummer 等 2016、Weissgerber 與 Reinhard 2017），作者在註 10 也自承。建議改成「被誤編的兩項研究是作者自己的」。英文同。
4. **證據 L82 Alfieri**：紀錄建議補的「隔天以後再測只剩 d = .22」（結果 10）沒有補。這和本站讀者隔幾天才回頭看的情境直接相關，可以放附錄或正文一句。
5. **參考資料裡還有沒讀完全文的條目**（既有狀態，不是這輪造成的）：
   - 圖表：Conlen 等 2019「讀了摘要與第 6 節」、Hohman 等 2020「讀了相關段落」。
   - 影片：Schade 2014「讀了相關章節」。
   - 這三條和「列進參考資料的都讀完全文」的規則不一致。它們不在 38 份名單裡，要嘛補精讀，要嘛移到「只讀部分」的說明。

### 降調、推測標示、數字密度

- **降調**：Navarrete 的「大致有正面效果」補了只根據 3 篇；Visual Transcripts 唯一顯著的一項標了要保留地看；Noetel 複雜對簡單補了只有 4 個合併效果量；Trypke 拆開摘要與正文的說法；Leutner 補了探索性、6 個研究、p = 0.048。這些都降到撐得住，Leutner 的遷移那半句除外（必須修 2）。
- **推測標示**：Carpenter 2017 的 90 分鐘、Kim 2014 的「可能」、Larkin 的「有時候」、Video Digests 的「不必離開那一章」、Noetel 的「文章裡的圖正是這一種」，都標成推測或推論。
- **數字密度**：正文最密的是圖表 L235（Leutner 加 Cromley 2020，一段約 230 字、帶 2 個數字與 4 個限定）和影片 L114（Soong 三個百分比）。都還讀得下去，可以不動。新增的細節多半放在附錄，這點做得對。

### 中英一致

- 五組中英檔逐行比數字。不一致的都是寫法差異：英文句尾的句點、中文用「實驗五」英文用「Experiment 5」、690 萬對 6.9 million、15 萬對 150,000。
- 圖表 L57–67、L344、L352 的尺寸本來就分中英頁各自量（中文頁 270 × 382、英文頁 254 × 382 等），文中也講明了，不是錯。
- 抽查新改的句子：證據 L82、L184、L242；圖表 L108、L136、L142、L235；影片 L114、L180、L222；版面 L65、L86、L173；提問 L131、L161。這些句子的意思、限定條件、連結中英都對應。
- 站內連結：中文版連中文頁，英文版連 `-en`。

### 台灣用語

`check-tw-terms` 跑五個中文檔：0 命中（修改紀錄記載；這輪抽了證據、圖表兩檔重跑，結果相同）。

### 沒做的事

- 沒有回原文 PDF 重對，以 38 份紀錄為準。
- 沒有逐句核對全部 36 組修改與 13 項可補，是每篇抽 5 到 7 處。
- 沒有看渲染後的頁面。

---

## 第五輪修正確認（2026-10-14）

核對修改紀錄第十七節（第十四輪）。審時 sha256 前 16 碼依序為：diagrams-en dad0e162caa2266b、diagrams 4e863a52fe3ea39d、video-en 70d05a0669e3cee8、video 5f1ae8505a0afacf、evidence-en 0073afe9b7dd1e65、evidence 598971eda1a36433、questions-en 60c894c6e156e113、questions 11dd368d6372e91a、layout-en 88c9a93b2a7c19f8、layout 46e2293e00b3bb22。

**結論：3 項必須修、5 項建議修都已修好，中英一致，沒有新錯。**

### 必須修

1. **圖表 L167（Byrne）**：改成「Tversky 等人 2002 年的回顧也談到同一份研究（Byrne、Catrambone 與 Stasko 1999）」，並寫明兩份二手來源說法不同、原研究沒讀，不再當成另一份證據。英文「discusses the same study」對應。
2. **圖表 L235（Leutner）**：改成「只分析了理解；遷移的研究太少（7 個效果量），沒有做這項分析」，和 `leutner2025:32` 相符。英文對應。
3. **證據 L140**：已改成「Lorch 與同事」。

### 建議修

1. **版面推論清單**：改成「五處」，第一項是 Video Digests。英文「Five inferences」對應。
2. **影片 L180**：改成「效果量 0.51，p = .136；每組約 32 人，我推測是檢定力不足」，推測已標明。英文對應。
3. **提問 L131**：改成「被誤編的兩項研究是作者自己的」，和 `weissgerber2021:9` 相符。英文「whose authors wrote both of the miscoded studies」意思相同。
4. **證據 L82（Alfieri）**：補了「隔天以後才測的研究，效果只剩 d = .22」，和結果 10「隔日 .22」相符。英文對應。
5. **參考資料**：
   - Conlen 與 Hohman 改成「讀了全文」，各附了沒讀到的部分（補充材料與原始紀錄；JavaScript 產生的表 1）；文中引的數字我沒有逐一重對，依修改紀錄的核對。
   - Schade 2014 已從影片篇參考資料移除，全站 grep「Schade」「video-usability」都是 0 筆。L110 改成只引 Harley 本文（sequential-access），中英一致。

### 其他檢查

- `check-tw-terms` 跑五個中文檔：0 命中。
- 改動到的段落裡沒有新的研究者代名詞。

---

## 「本站沒有分析工具」更正的複審（2026-10-14）

範圍：修改紀錄第十八節（第十五輪），涉及八篇（`2026-10-14-` 開頭）：do-readers-answer-embedded-questions、spaced-review-in-teaching-articles、why-readers-dont-finish、spaced-practice-in-real-courses、series-order-in-teaching-articles、misconceptions-in-teaching-articles、projects-struggle-scaffolding，加上 forums-comments-community-learning（沒有英文版）。沒有改檔、沒有 commit。

審時 sha256 前 16 碼：

| 檔 | 中文 | 英文 |
|---|---|---|
| do-readers | cba9aec8c1d0229d | 54239b06f9a6af8c |
| spaced-review | 91d3b82cb5875d97 | 2270ea36db712174 |
| why-readers | b9f290970c259478 | 4271b2eb980911f5 |
| spaced-practice | 6e75cbe7b4512c0e | 580db208ddf99b75 |
| series-order | b918deea3cc58bfa | d6eebf54ebacba3d |
| misconceptions | 6e8fee04582fe005 | ed970a4dcf043048 |
| projects | 2f64157c7e3598d9 | 9e203fc492a8c1fb |
| forums | 0dd26f3554ab4c2e | 沒有英文版 |

### (1) 和 Cloudflare 官方文件對照

2026-10-14 用 Exa 讀了 About、High-level metrics、Data origin and collection、FAQ 四頁，FAQ 另外用 curl 抓了 `index.md` 確認原文。

- **量什麼：一致。**
  - High-level metrics 頁寫的是 Visits、Page views、Page load time、Core Web Vitals。
  - Visits 的定義是「A page view that originated from a different website or direct link. Cloudflare checks where the HTTP referer does not match the hostname. One visit can consist of multiple page views.」
  - 文章寫的「頁面瀏覽、造訪、來源網站、裝置與頁面載入效能」，以及「造訪依來源網站和本站不同來算」，都和原文相符。
- **自訂事件：一致。** FAQ 原文是「Does Web Analytics support custom events? Not yet, but we may add support for this in the future.」，文章寫「還不支援自訂事件」。
- **「不收集個人資料」：有原文。** About 頁寫「Cloudflare Web Analytics does not collect or use your visitors' personal data.」
- **「不追蹤個別讀者」：原文有限定，文章拿掉了。** 見必須修 1。
- **「不用 cookie」：** 我讀的四頁也沒有這句。文章沒有寫，處理正確。

### 必須修（1 項）

1. **「不追蹤個別讀者」把原文的限定拿掉了（中英都要改）。**
   - 位置：
     - do-readers L22 中英
     - spaced-review L24 中英
     - why-readers L20、L274 中英
     - 修改紀錄第十八節也照抄
   - 原文出自 Data origin and collection 頁：「Cloudflare does not track individual end users **across our customers' Internet properties**.」它說的是不跨網站追蹤同一個人，不是單一網站內「沒有辨識個別讀者的功能」。英文版寫「it does not track individual visitors」，意思變了。
   - 文章真正要的結論是「量不到同一位讀者有沒有作答、有沒有回來」，有更直接的依據：
     - 指標只有匯總的瀏覽、造訪、載入時間。
     - 造訪是依 referer 判定的。
     - 不支援自訂事件。
     - About 頁說不收集個人資料。
   - 建議改成：「依 Cloudflare 的文件，它只提供匯總的頁面瀏覽、造訪、來源網站、裝置與載入效能，不收集訪客的個人資料，也還不支援自訂事件，所以認不出同一位讀者、量不到……」。「不追蹤個別讀者」要嘛刪掉，要嘛照原文補上「跨網站」的限定。

### (2) 殘留的錯誤說法：沒有

- 搜尋範圍：系列全部中英檔（`2026-10-13-*`、`2026-10-14-*`）。
- 搜尋詞：沒有分析、沒有裝／沒裝／未裝、裝了分析、分析工具、沒有任何閱讀、沒有閱讀行為、沒有任何資料、沒有讀者…資料、沒有…瀏覽紀錄、沒有…流量、no analytics、analytics tool、install…analytics、no reading／traffic／visitor／reader data、tracking。
- 命中的都是正確的說法：
  - do-readers L22 的更正說明本身。
  - forums L210「沒有任何資料能說明讀者想不想留言」：匯總統計量不到，仍成立。
  - code-in-teaching-articles L193、misconceptions L178：指的是審稿報告沒有讀者資料。
  - 圖表 L318：沒有「它們」（別的網站）的流量資料。
  - 其餘是研究本身的描述，例如 Wise 與 Cui 的資料集、notation 篇的「沒有讀者資料」、why-readers 英文 L30。
- 沒有找到殘留的「本站沒有分析工具」或「沒有任何閱讀資料」。

### (3) 結論換了依據後還站不站得住

站得住。原本的結論是：不知道讀者會不會作答、展開答案、讀到哪裡、隔多久回來。現在改依「只有匯總統計、造訪依 referer、沒有自訂事件」，這些仍然量不到。

- do-readers L235、L255，why-readers L274、L284：原本寫「要先裝分析工具」，改成「另外加事件或捲動紀錄」，邏輯正確。
- spaced-review L24「認不出同一位讀者」是從造訪的定義推出來的，推得合理。

建議修 2 項：

1. **「只有匯總流量統計」和 spaced-practice L231 的說法不完全一致。** spaced-practice 自己寫「站上另外只記名詞解釋的查詢次數與站內聊天的內容」，其他幾篇卻說「本站只有匯總流量統計」。建議把其他幾篇統一成「閱讀行為只有匯總流量統計」，或在一處交代另外兩種紀錄、說明它們也量不到作答與回訪。我沒有回後台或資料庫核對那兩種紀錄是否存在。
2. **網站另一套統計沒有提到。** FAQ 寫「Existing Cloudflare customers can access analytics collected from our edge on the Analytics tab」。正式站走 Cloudflare 代理，所以很可能還有邊緣流量統計，那一套也是匯總的。我沒有看後台，不能確定。如果要寫「只有」，建議主線看一眼後台；不看的話，可改寫成「依我知道的，只有匯總統計」。

### (4) 中英一致

逐行比過下列改動處，意思、限定與連結都對應：

- do-readers L9、L22、L39、L235、L245、L255、L268、L313
- spaced-review L24、L207、L235、L277
- why-readers L9、L20、L135、L274、L284、L296、L339
- spaced-practice L231
- series-order L216
- misconceptions L26
- projects L195、L259

中英共有的問題只有必須修 1。forums 沒有英文版。

### 其他

- `check-tw-terms` 跑八個中文檔：0 命中。
- 參考資料新增的 Cloudflare 文件連結（`/web-analytics/data-metrics/`）可以開，各頁內容如上。

---

## 分析工具措辭與 Kizilcec 子群的確認（2026-10-14）

核對修改紀錄第十九節（第十六輪）。

**結論：都修好了，中英一致，沒有殘留。** 只有一處措辭建議可選擇處理。

- **Cloudflare 的四點依據**：do-readers L22、spaced-review L24、why-readers L20 與 L274 的中英都改成四點，每一點都有原文依據：
  - 匯總的瀏覽、造訪與載入時間：High-level metrics 頁。
  - 造訪看來源網址判定：Visits 的定義。
  - 不收集訪客個人資料：About 頁。
  - 還不支援自訂事件：FAQ 寫「Not yet」。
  - 「不追蹤個別讀者」與 track individual 在全系列已經 0 筆。spaced-review 的「這些指標認不出同一位讀者」是從上述定義推出來的，合理。
- **「至少載入了」與「流量統計是匯總的」**：8 篇中英都已改（英文用 loads at least、traffic statistics are aggregate）。全系列 grep「只有匯總」「only aggregate」「has only」都是 0 筆。
- **可選的措辭建議（spaced-practice L231，中英）**：「瀏覽只有 Cloudflare 的匯總統計」（英文 page views are only in Cloudflare's aggregate statistics）仍帶「只有」。語意是「瀏覽資料是匯總的」，和其他篇的「至少載入了」不衝突。修改紀錄說刻意保留，可以接受；想完全統一的話，可改成「瀏覽資料是 Cloudflare 的匯總統計」。
- **Kizilcec 子群（why-readers L163、L248 中英）**：已改成「對應的子群（……各波的子群定義有調整）」，英文是 corresponding subgroup／definition adjusted across waves。這和 `kizilcec2020-scaling-interventions.md:121` 的紀錄一致：SI 寫子群逐波從「有決心且英語流利」改到「英語流利」，再到整個焦點樣本。L248 同段後文的說法也一致。
- **台灣用語**：`check-tw-terms` 跑八個中文檔，都是 0 命中。
