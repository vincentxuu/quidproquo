# 審稿報告：教學文章什麼時候該畫圖（2026-10-13）

審稿者：獨立審稿（未參與撰寫）。審稿時間 2026-10-13 23:19–23:34 CST。只審不改檔。

## 檔案雜湊（sha256）

| 檔案 | 審前 23:19 | 審後 23:33 |
|---|---|---|
| `src/content/posts/learning/2026-10-13-diagrams-in-teaching-articles.md` | `7b55725c49113f0b…6043160614` | 相同 |
| `src/content/posts/learning/2026-10-13-diagrams-in-teaching-articles-en.md` | `fbb3fee1d05e2d2a…e70621b34` | 相同 |
| `.research/2026-10-13-diagrams-in-teaching-articles.md` | `e6e513e3cbe426da…ae4e7050` | 相同 |
| `src/content/posts/tech/2026-08-27-harvard-cs50ai-w00-search.md`（對照用） | `b6f45d2d029858f2…a6e8072` | 相同 |

審稿期間沒有人改這四個檔。

## 必須修

行號中英兩版相同（兩檔都是 471 行、逐行對應），除非另外註明。

### 1. 「圖文怎麼搭，比有沒有圖更要緊」是推論，正文與 tldr 寫成結論（L9、L22、L71）

- L71 粗體句「圖文怎麼搭，比有沒有圖更要緊」，依據是 Noetel 轉引的鄰近 0.63 大於 Guo 的加圖 0.39。這兩個數字來自不同的研究集合與不同的對照條件（鄰近比的是「整合對分開」，兩邊都有圖；Guo 比的是「有圖對沒圖」），不能比大小。
- 研究筆記自己把這一條列在推論表：「[推論] 先處理圖文鄰近，再考慮多畫……兩個數字來自不同的研究集合與對照條件，不能直接相減」（`.research/…diagrams….md` 推論表第 2 列）。文章沒有把這個保留帶過來，也沒有標「我的推論」。
- tldr（L9）「把圖和對應的文字放在一起、讓讀者先預測再看圖，效果比多畫一張更確定」同樣是這個推論，而且「更確定」的一半依據是只讀到摘要、由 Noetel 轉引的數字，另一半是 2002 年以前的數票法（Hundhausen）。「更確定」說不上。
- 修法：L71 改成並列兩個數字並當場標「我的推論」與不能直接比較的理由；tldr 拿掉「更確定」。

### 2. 「只是觀看視覺化的學生……沒有顯著優勢」不是 Hundhausen 的結果（L159）

- L159 緊接在 Hundhausen 的引文後面，讀起來是該文的發現。作者標示讀過的章節（摘要、3、5.1.3–5.2.1、6）裡沒有這句話。5.1.4 寫的是：活動投入「相等」的 9 個實驗裡 6 個沒有顯著差異、投入「不相等」的 14 個裡 10 個顯著（`hundhausen2002.txt` 5.1.4 節，Figure 6 上方）；6.1 的結論是 "how students use AV technology, rather than what students see, appears to have the greatest impact"。
- 同篇 Table 2 還有反例：Byrne 等的一列寫 "Participants who viewed animation scored significantly higher on post-test than participants who did not view animation"。
- 這句話的實際出處是 Naps 等（2002）的假設一：「Several studies [1, 11, 40] have shown that mere passive viewing provides no significant improvement over no visualization, but these studies were based on small sample populations」（`naps2002.txt` 第 5.1 節假設 I）。原文帶著「樣本小」的保留。
- 修法：這句移到下一段 Naps 那裡，寫成 Naps 的說法並帶上小樣本的保留；Hundhausen 這段改寫成 5.1.4 的 6/9 與 10/14。

### 3. 「兩篇共同的地方是條件」沒有依據（L175）

- 這一句說 Höffler 與 Leutner（2007）和 Berney 與 Bétrancourt（2016）「共同的地方是條件」，接下來列的三個條件（系統控制步調、配旁白、沒有搭配文字）全部出自 Berney 的摘要（`berney2016.txt` 摘要）。
- Höffler 那篇作者只讀到摘要；`abstracts-only.md` 第二輪節錄裡它的調節結果是 representational d = 0.40、highly realistic d = 0.76、procedural-motor knowledge d = 1.06，和 Berney 的三個條件不是同一組。
- 這等於替一篇只讀摘要的來源下了它摘要裡沒有的結論。修法：刪掉「兩篇共同的地方是條件」，直接寫「Berney 與 Bétrancourt 發現……」。

### 4. 網站觀察表：Dive into Deep Learning 的「正文字數約 12,000」把四套框架的程式碼算進去（L305、L312；附帶 L310）

- 我重數 `src/sites/d2l-transformer.html`：去掉 script／style 後全部詞數 12,796；再去掉 93 個 `<pre>` 區塊剩 3,556（還含導覽列）。93 個程式碼區塊是 PyTorch／MXNet／JAX／TensorFlow 四個分頁的重複內容。
- 表頭寫的是「正文字數」。以散文計，D2L 這頁約 3,000 多字配 17 到 18 張圖，密度是每 200 字上下一張，和 Distill 同級，不是「圖少」的那一組。
- L312「課程筆記那幾頁（CS50、CS231n、Dive into Deep Learning）的圖都少」因此對 D2L 不成立。
- CS231n 我重數是 9,309（含 1 個程式碼區塊），和文章一致；其餘各列的圖數我重數相符（見「沒問題的項目」）。
- 中文版 D2L（L310）圖數我數到 17 個 `class="figure"`、19 個 `<img>`，文章寫 18；英文版同樣是 17／19。差一張，請作者說明 18 怎麼數的。

### 5. 英文版引用的實測數字是中文頁的，英文頁的三張圖尺寸不同（en L51–65、L259、L340、L348）

我用 repo 的 mermaid 11.17.2 加無畫面 Chromium（字型 PingFang TC、容器寬 326px）重渲染，23:26 量到：

| 圖 | 中文頁（文章寫的） | 英文頁（實際） |
|---|---|---|
| 示範用的圖 | 270 × 382，不必縮 | 254 × 382，不必縮 |
| 搜尋流程圖 | 556 × 770，約 9.4px | **630 × 810，約 8.3px** |
| 剪枝樹，由左往右 | 435 × 902，約 12px，手機高約 676px | **470 × 902，約 11.1px，手機高約 626px** |

- 中文頁的五個數字我全部重現（270×382、556×770、1042×350、435×902、324×350；字級 9.4、5、12；手機高 675），文章對中文頁的描述是對的。
- 英文版連到的是英文頁 `…w00-search-en`，卻沿用中文頁的數字。照文章自己的 435px／12px 規則，英文頁現在的剪枝樹（470px）已經低於 12px 下限，en L348「The current left-to-right version is readable」對英文頁不成立。
- 修法：英文版改用英文頁的數字，或在表格上方註明這些是中文頁的量測、英文頁標籤較長所以更寬。這也提醒「同層最多 3 個節點」取決於標籤長度，英文頁的門檻更緊。

### 6. Cleveland 與 McGill 的排序，中文版把「面積」和「體積、曲率」併成一級（zh L140），英文版沒有併（en L140）

- 原文六級：1 同軸位置；2 不同軸位置；3 長度、方向、角度；4 面積；5 體積、曲率；6 明暗、色彩飽和度（`cleveland-mcgill1984.txt` L703–709）。
- 英文版寫「then area, then volume and curvature」是對的。中文版「然後是面積、體積與曲率」讀起來是同一級。中英不一致，以英文版為準改中文。

### 7. 參考資料裡 2025 畫圖輔助統合分析沒有作者（L231、L433、L465）

- 作者是 **Detlev Leutner 與 Johanna Biele**（Leutner 第一作者），Educational Psychology Review 37 卷第 4 期，文章編號 93，2025-09-18 上線。
- 來源：Crossref `10.1007/s10648-025-10067-7` 的 author 欄（Leutner `sequence: first`、Biele `additional`）、OpenAlex 同一筆、doi.org 回傳的 BibTeX（`author={Leutner, Detlev and Biele, Johanna}`），三處一致。
- 作者存的原文檔 `integration-meta2025.md` 是 Jina reader 輸出，從 Introduction 開始，沒有作者區塊，所以從原文檔本身確認不了；Springer 頁面 curl 被擋。
- 修法：L231 內文改成「Leutner 與 Biele（2025）」，L433 附錄標題與 L465 參考資料補作者。

## 建議修

1. **L148「依『在比什麼』分成兩組」**：原文是四個理論陣營（Epistemic Fidelity 30%、Dual-coding 50%、Individual Differences 50%、Cognitive Constructivism 71%），附錄 L409 也寫四個。正文改成「四組裡樣本最多的兩組」之類，免得正文與附錄對不上。
2. **L221 概念圖對條列**：文章說 Schroeder 2018 的 0.43「把讀與畫合在一起算，兩篇的數字不能直接相減」。Table 1 確實合併（k = 13），但同一份作者稿的 Comparison Treatment 一節（Table 9）有分開的數字：「讀」概念圖對「讀或寫」條列 g = .43（p = .02），「畫」概念圖對大綱 g = .40；作者自己把它和 Nesbit 的 0.28 相比並說「considerably stronger」（`schroeder2018-conceptmap.txt` 約 36,500–38,700 字元處）。作者標示讀過的範圍沒有這一節，補讀後這段的保留可以寫得更準。
3. **L65「每多一個節點約寬 115px」**：以文章自己的兩個點算，（1042 − 324）÷ 6 = 約 120px；115 是 1042 ÷ 9。數字小差，建議寫「約 115 到 120px」或改一種算法。
4. **L187「四張依序編號的圖」**：原文只寫「a sequence of four pictures」（`ploetzner2021.md` Design 一節），我沒找到「編號」。
5. **L229 兩篇只讀摘要的畫圖研究**（Fiorella 與 Zhang 2018、Zhang 與 Fiorella 2021）：沒有引數字，也有標「只讀到摘要」，但摘要裡的定性結果仍被當成「方向和上面一致」的佐證。依 deep-research 2.5，只讀摘要的來源只能寫「存在」。結論本身靠的是 Fiorella 與 Mayer 全文和 Leutner 與 Biele 全文，拿掉這一段的結果描述不影響結論。
6. **L378 Guo 的 Trim and Fill**：文章寫「校正出版偏誤之後……降到 0.28」。原文的說法是 Egger 檢定不顯著、Trim and Fill「did not provide evidence that our results are sensitive to potential publication bias」，作者的結論是沒有出版偏誤（`guo2020.txt` L1167–1182）。數字對，但建議補一句作者自己的判讀。
7. **L294 R2D3「抓到的是空殼」**：`sites/r2d3-part1.html` 有約 1,500 個詞、3 張圖，不算空殼；比較準確的說法是「互動圖由 JavaScript 產生，HTML 裡數不到」。
8. **來源紀錄沒跟上第三輪**：`sources.md` 仍把 Schroeder 2018（概念圖）列在「只讀摘要」、Rey 2019 列在「讀不到」，沒有 Fiorella 與 Mayer 2016、Ploetzner 2021、Ainsworth 2011 的取得網址；Berney、Tversky 2002、Barbieri、Cooper、Trypke 的「讀了什麼」比文章寫的少。`abstracts-only.md` 也仍列 Schroeder 2018 為只讀摘要。`fiorella-mayer2016.pdf` 的來源網址整個工作目錄都查不到。請補進 `sources.md`。
9. **參考資料裡幾條讀得很少的來源**：Heer 與 Bostock（摘要與引言）、Shaffer（摘要與 4.4 片段）、Cooper（摘要與方法；結果只來自摘要）。writing-guide 允許「挑相關章節讀完並說明」，這幾條引用的內容也確實落在讀過的範圍，不算違規；但 Cooper 的結論句（L102）靠的是摘要，建議補讀結果一節或在 L445 寫明。
10. **Rey 2019 作者**：原文檔第一頁六位作者齊全（Rey、Beege、Nebel、Wirzberger、Schmitt、Schneider）。L427 寫「Rey、Beege、Nebel 等」沒有錯，要列全也有依據。
11. **研究筆記的待解問題可以關掉一條**：「`accTitle` 在 `securityLevel: 'strict'` 下是否輸出」我實測會輸出（SVG 裡有 `<title>` 與 `<desc>`）。

## 指派訊息要我判斷的四件事

**(1) 8 篇只讀摘要的來源。** 逐一確認：

| 來源 | 在參考資料？ | 數字怎麼出現 | 判定 |
|---|---|---|---|
| Schroeder 與 Cenkci 2018 | 否 | 0.63，L86「Noetel 轉引」、L395 列在 Noetel 條下 | 合規。Noetel 預印本確有 `g = 0.63 … k = 58; Schroeder & Cenkci, 2018` |
| Schneider 等 2018 | 否 | 0.43、0.25，L94 與 L395 都掛在 Noetel 下 | 合規，Noetel 原文相符 |
| Sundararajan 與 Adesope 2020 | 否 | 0.33、0.43、0.12，L100 與 L395 掛在 Noetel 下 | 合規，Noetel 原文相符 |
| Höffler 與 Leutner 2007 | 否 | d = 0.37「Berney 轉述」（L173、L417）；0.40／−0.05 掛在 Noetel 下（L395） | 數字合規；但 L175 對它下了摘要沒有的結論，見必須修 3 |
| Novick 與 Hurley 2001 | 否 | 沒有數字，明說不當依據 | 合規 |
| Fiorella 與 Zhang 2018 | 否 | 沒有數字，定性結果當佐證 | 見建議修 5 |
| Zhang 與 Fiorella 2021 | 否 | 沒有數字，定性結果當佐證 | 見建議修 5 |
| Cromley 等 2020 | 否 | 沒有數字；「用較多研究得到顯著整體效果」是 Leutner 與 Biele 限制一節的原話 | 合規 |

作者的說法大致成立，例外是必須修 3 與建議修 5。另外必須修 1 的比較也是建立在轉引數字上。

**(2) 本站實測與文章自己的 mermaid 圖。** 23:24 核對 `2026-08-27-harvard-cs50ai-w00-search.md`：仍是三張圖（L110 示範圖 6 節點、L128 流程圖 7 節點、L383 剪枝樹 `flowchart LR` 13 節點、虛線標「不必看」），與文章描述相符；流程圖上方的編號清單第 5 步確實寫「回到第 2 步」（L104）。尺寸我全數重現（見必須修 5 的表）。文章 L354–362 的 mermaid 圖語法正確，在 `securityLevel: 'strict'` 下渲染成功，5 個節點、324 × 350，`accTitle`／`accDescr` 都有輸出；英文版同樣通過。L326–334 的狀態表我手算一遍正確，先進先出版本確實從第 3 步分岔。問題只在英文版沿用中文頁數字（必須修 5）。

**(3) Fiorella 與 Mayer 2016 讀的是學校網站上的 PDF；Rey 2019 只確認前三位作者。** 都不構成問題。`fiorella-mayer2016.pdf` 是出版社排版的正式版（Educ Psychol Rev 28:717–741，DOI 10.1007/s10648-015-9348-9，約 10 萬字元），不是草稿，內容可信；文章連結用 DOI 而不連那份可能未授權的副本，處理得對。要補的是在 `sources.md` 記下那份 PDF 的網址。Rey 的六位作者原文檔都有。

**(4) 2025 畫圖輔助統合分析的作者。** Leutner 與 Biele，見必須修 7。原文檔沒有作者區塊，我是從 Crossref、OpenAlex、DOI BibTeX 三處確認的。

## 沒問題的項目

- **英文引文逐字相符**：Larkin 與 Simon「None of these points insure…」（原文是 insure，不是 ensure，文章照原文）；Hundhausen「how students use AV technology has a greater impact…」（摘要）；Tversky 等「multiple diagrams have an additional advantage…」；Tse「If you make a tooltip or rollover, assume no one will ever see it.」。
- **Guo 2020**：39 個研究、2,103 人（1,053／1,050）、g = 0.39、CI 0.26–0.51、Trim and Fill 0.28、個別 −0.23 到 1.24、圖片 0.37／圖像式圖解 0.63／流程圖 0.35／混用 0.14、是非 0.22／選擇 0.22／簡答 0.67／混合 0.60、21 個成人研究、9 個沒交代文字來源、6 個用課本，全部對得上。
- **Noetel 預印本**：29 篇、1,189 個研究、78,177 對 79,415 的不一致、g = 0.38（k = 808）、0.70 對 0.20、0.41 對 0.27、先備知識不調節、眼動研究的轉述、d > 1.0 的對照、只有 1 篇評估原始研究品質、只有 2 篇報告雙人篩選（Table 2 我逐列數過：Alemdag 2018、Berney 2016）、0.15／0.29／−0.04，全部對得上。訊號 k = 209 確是各原則中最大。
- **Cooper 2018**（92 人、19.0 歲、2 × 2 受試者內、四題、文字足以作答）、**Trypke 2023**（摘要的正負概括、表 4 兩個方向都有、兩條限制）、**Tversky 2011**（Heiser 與 Tversky 2006 的轉述，文章有標「她引用」）、**Heer 與 Bostock**、**Naps 2002**（六類、不是順序量表、後四類都含觀看、假設一）、**Shaffer 2010**（超過 500、超過四分之一是排序、18 個 3.5%、9 個）、**Sibia 2025**（288 選 90、缺少嚴謹評估）。
- **Berney 2016**（50 篇、61 個研究、7,036 人、140 組、0.226、43／14／83、0.309／0.336／0.883、16.4%、轉述 Höffler d = 0.37 為 medium）、**Tversky 2002**（心臟血流的例子、太快太複雜、離散步驟、兩個原則）、**Rey 2019**（56／88、0.32／0.36／0.23／−0.92、限制）、**Ploetzner 2021**（88 人、30／28／30、2.33／2.41／1.11／1.30、作者的推測、沒研究概念理解、空間能力無關；把 Höffler 與 Berney 都稱為 small 也屬實）。
- **Conlen 2019**（超過 5 萬、41%／59%／76%、手機 10%、86 秒與 85% 屬桌機、7,055／4,549、55,193、中位數 0）、**Hohman 2020**（rule-of-thumb 與「closer to building a website」兩段都在原文）、**Nesbit 與 Adesope 2006**（55／67／5,818、0.28／0.39／0.74／0.19、.2 標準差那句、投入的解釋）、**Schroeder 2018**（142、11,814、0.58、I² 87.5、0.72／0.43、Table 1 五個數字、fail-safe N 與 Egger、Caution 那句）、**Fiorella 與 Mayer 2016**（四個條件、Schwamborn d = 0.81、中位數 d = 0.4）、**Leutner 與 Biele 2025**（14／16／1,213、0.04／−0.10、p 值、整合調節項在控制後仍顯著、對 Cromley 的說明）、**Barbieri 2023**（8,033、43／55／181、0.48、自我解釋負向、descriptive rather than causal、2 個準實驗）。
- **WCAG 與 Apple**：1.4.10 的 320 CSS px 與註 2 的地圖、圖解、資料表格；Apple 各平台字級與 44／28pt；W3C 複雜圖片教學的三類讀者；rehype-mermaid 的 `dark` 選項與 Playwright；D2 的 dark theme 跟系統偏好。
- **網站觀察表其餘各列**：CS50 筆記 6 張、Illustrated Transformer 37 張都沒有 alt、Distill 21 個 figure、Red Blob 19 個 figure 與 21 個 canvas、3Blue1Brown 16 個 figure 與 6 段影片、CS231n 9 張、Missing Semester 1 張、Hello 演算法 24 張與約 4,346 個中文字、演算法筆記 28 張，我重數相符。
- **中英一致**：行數 471 對 471、標題 36 對 36、表格列 63 對 63、連結 113 對 113（網址集合相同）；數字逐一比對只有標點差異。例外是必須修 6。
- **站內連結** 5 個目標檔都存在（中英各自連到對應語言）。
- **外部連結**（23:27 用 curl 帶瀏覽器 UA）：59 個不重複網址裡 200 的有 47 個；403 的 10 個是 ScienceDirect 4 個與 w3.org 6 個，屬擋爬蟲（作者的 sources.md 也記了 w3.org 擋 curl）；hello-algo 兩次都回 429（限流）；GitHub 上 Tse 簡報那個第一次 429、重試 200。沒有 404。
- **用語**：`pnpm check:tw` 的腳本對中文檔回報 0 blocking、0 to review；我另外掃常見中國用語，沒有命中（「算法」都在「演算法」裡）。
- **門面**：標題與 tldr 講對象與結論，沒有工作量數字；開頭 L24 交代了取樣偏誤；衝突的來源（動畫兩篇、畫圖輔助兩篇、Tversky 的論述對 Ploetzner 的實驗）都並列未裁決；「證據的限制」涵蓋面足夠。

## 我沒做的事

- 沒有逐頁讀完每一份原文，是針對文章引用的每個數字與說法回原文找對應段落。
- 英文版附錄與參考資料（en L390–471）只做了數字與連結的機器比對加抽看，沒有逐句對照中文。
- 沒有起 dev server（任務書禁止），所以「390px 一般瀏覽器裡標籤約 8px／19px 高、桌機約 940px 高」這三個瀏覽器實測沒有重量；我的無畫面渲染得到的標籤高是 7.5px 與 18px，方向一致。
- 沒有重抓外部頁面核對內容是否改版，只看狀態碼。
- 沒有跑 zhtw-mcp。
- Leutner 與 Biele 的作者順序沒有從出版社頁面確認（被擋），只有三個書目資料庫。

## 作者修正（2026-10-13，第四輪）

修正後 sha256：

- `2026-10-13-diagrams-in-teaching-articles.md`：`335f5f5ab062a909e2d5c1c743caf7e6860e6a969ef9a468d61d5d03474ed36c`
- `2026-10-13-diagrams-in-teaching-articles-en.md`：`5800514a70c2729c7e09f3aff982e21174c333d50140ccd03f0234e2d4a12bc1`

兩檔各 473 行（英文頁數字那一段中英各多一段）。`pnpm verify` 全綠；離線渲染兩檔都是 7 張表、56 列、113 個連結、41 個粗體、無殘留 markdown；文章裡的 mermaid 圖中英各重新渲染，324 × 350。

### 必須修

1. **照做。**L71 粗體句改成「可能和有沒有圖一樣要緊」，寫出 0.63 與 0.39 不能直接比的兩個理由（一個比「放一起對分開放」、兩邊都有圖，一個比「有圖對沒圖」；研究集合不同），並標明「我的推論是先把既有的圖和文字對好，理由是便宜，不是 0.63 大於 0.39」。tldr 拿掉「更確定」，改成「各有研究支持、比多畫一張便宜，但沒有實驗直接比過」。開頭 L22 的結論句也改標為推論。
2. **部分照做，出處沒有改成 Naps。**理由：這句話在 Hundhausen 原文裡有，位置是第 6.3 節（存檔 `hundhausen2002.txt` 約 69,600 字元處）：「With few exceptions, we found that studies in which students merely viewed visualizations did not demonstrate significant learning advantages over students who used conventional learning materials.」審稿者說作者標示讀過的章節裡沒有，是因為只對了 6.1。我漏掉的是原文的「With few exceptions」。修正：文章現在寫明出處是第 6.3 節、帶上「除了少數例外」，補 5.1.4 的 6/9 與 10/14，補表 2 Byrne 等人看動畫組顯著較好的反例；Naps 那一段補上「支持的幾個研究樣本都小，所以列為待驗證的假設」。
3. **照做。**刪掉「兩篇共同的地方是條件」，三個條件只歸給 Berney 與 Bétrancourt。
4. **照做。**表頭改成「正文字數（不含程式碼區塊）」，各列用同一個口徑重數（取 article 或 main，去掉 script、style、svg、nav、header、footer、pre）：CS50 約 3,300、Distill 約 4,000、Red Blob 約 2,350、3Blue1Brown 約 4,650、Hugging Face 約 2,300、CS231n 約 9,100、D2L 約 1,900、Missing Semester 約 2,400、Josh Comeau 約 5,400；中文三站改成中文字數（Hello 演算法扣掉程式碼後約 1,200、演算法筆記約 2,500、D2L 中文版約 2,800）。密度跟著重算（Distill 每 190 字、Red Blob 每 120 字）。D2L 的圖數改成 5 張：18 個 `<img>` 是 1 個標誌、1 張架構圖、16 張輸出圖，而 16 張是 4 張輸出 × 4 個框架分頁（檔名 198／201／204／207 為同一張輸出的四個分頁）；審稿者數的 17 個 `class="figure"` 是不含標誌的同一批。結論句改成「CS50 與 CS231n 的圖少；D2L 扣掉程式碼後密度落在中間」。
5. **照做。**收到審稿後以當時的檔案重量（兩個第 0 週檔案在 git 都是已修改狀態）：中文頁 270 × 382、556 × 770、435 × 902，和先前相同；英文頁 254 × 382、630 × 810、470 × 902，和審稿者量到的相同；英文頁的剪枝樹改回由上往下也是 1042 × 350。英文版的表格、流程圖一節、剪枝樹一節與寬度規則都改用英文頁的數字：流程圖約 8.3px；由左往右的剪枝樹約 11px，寫明「低於本文自己的 12px 下限」，手機高約 626px。中英兩版各加一段交代另一個語言頁面的數字。「同層最多 3 個節點」補上「這是節點文字一兩個詞時的數字，標籤越長能並排的越少」。390px 瀏覽器實測的 8px／19px 在英文版標明是中文頁量的。
6. **照做。**中文版改成「然後是面積，再來是體積與曲率」。
7. **照做。**自己用 Crossref API 查 `10.1007/s10648-025-10067-7`：Detlev Leutner（first）、Johanna Biele（additional），37 卷 4 期，文章編號 93，2025-09-18。內文、附錄標題、參考資料都補上，附錄註明作者與卷期取自 Crossref。

### 建議修

1. **照做。**改成「依實驗背後的學習理論分成四組，下表是實驗數最多的兩組（另外兩組都是 50%，見附錄）」。
2. **照做，而且原本那句是錯的。**補讀 Comparison Treatment 一節：0.43 是「讀現成的概念圖」對「讀或寫條列」（p = .02），合併的是對照組那一邊，不是把讀與畫合併。正文改寫；附錄補上表 9 的各項（對讀文字 .29、k = 39；對大綱 .72 與對講課 1.09 只有 2 與 5 個效果量；畫概念圖對大綱 .40、對寫文字 .48）。作者的「considerably stronger」原文是接在「畫概念圖」那幾項後面，文章照這個範圍寫。
3. **照做。**改成「約 115 到 120px」。
4. **沒改，有依據。**原文 Materials 一節：「The four pictures were numbered according to the succession of frames they depict.」（`ploetzner2021.md`，`grep "numbered according"` 命中 1 處）。
5. **照做。**兩篇只讀摘要的畫圖研究改成只記存在與行內連結，刪掉結果描述。
6. **照做。**限制一節與附錄都改成先寫作者的判讀（Egger 不顯著、結果不受出版偏誤影響），再寫 Trim and Fill 補 7 個研究後 0.28 仍顯著。
7. **照做。**改成「R2D3 的互動圖由 JavaScript 產生，HTML 裡數不到」。
8. **照做。**`sources.md` 更正五列「讀了什麼」，移除過期的「只讀摘要／讀不到」列，新增「第二、三輪更新」一節（Schroeder、Rey、Fiorella 與 Mayer、Ploetzner、Ainsworth 的網址與存檔、Crossref、新增網站頁面、字數口徑、抓取鏈）。`fiorella-mayer2016.pdf` 的來源網址已記入。`abstracts-only.md` 把 Schroeder 2018 移出並補第二輪的說明。
9. **照做（Cooper）。**補讀結果與限制：圖解的勝算比 5.94；插圖對數學能力低一個標準差的學生有害；整體答對率 50%；限制是題目情境真實性不足。附錄與參考資料的「讀了什麼」同步。Heer 與 Bostock、Shaffer 沒有補讀，引用範圍仍落在已讀的部分。
10. **照做。**附錄列出六位作者。
11. **照做。**研究筆記的待解問題標為已解決，並加「第四輪更新」一節。

### 這一輪沒做的

- Heer 與 Bostock、Shaffer 沒有再多讀。
- 中文版超過 60 字的長句沒有再拆。
- 沒有起 dev server，沒有 commit。

## 複審（2026-10-14 03:03–03:08 CST，獨立審稿者）

只審不改檔。sha256 與作者回報一致，複審前後相同：中文 `335f5f5a…74ed36c`、英文 `5800514a…d4a12bc1`。兩檔各 473 行。對照用的第 0 週兩個檔與初審時不同（中文 `7db1c580…`、英文 `0ef2b8ea…`），所以尺寸我用現在的檔重量了一次。

### 先更正我初審的兩個判斷

作者沒照做的兩項，回原文檔看，都是作者對、我錯：

- **(a) 必須修 2 的出處。** Hundhausen 第 6.3 節確有這句：「With few exceptions, we found that studies in which students merely viewed visualizations did not demonstrate significant learning advantages over students who used conventional learning materials」（`hundhausen2002.txt` 約 69,600 字元處）。我初審只對了 5.1.4 與 6.1，漏了 6.3，「不是 Hundhausen 的結果」這個判斷是錯的。初審指出的另一半（少了保留、表 2 有反例）成立，作者已補上「除了少數例外」、6/9 與 10/14、Byrne 的反例，以及 Naps 的小樣本保留。現在的 L161–163 與原文相符。
- **(b) 建議修 4「依序編號」。** Ploetzner 的 Materials 一節確有「The four pictures were numbered according to the succession of frames they depict」。我初審只搜了 Design 一節。文章原本的寫法正確，不必改。

### 必須修（複審後剩 1 項，是改寫時新引入的）

**R1. L225「自己動手畫的效果在兩篇裡都比讀現成的大」對 Nesbit 與 Adesope（2006）不成立（中英同一行）。** 這句是這一輪改寫新加的。Schroeder 2018 確實是畫 0.72 大於讀 0.43。但 Nesbit 2006 的表 6 沒有「畫」與「讀」的整體比較，四個數字要看對照組：畫概念圖對聽課 0.74、對自己寫摘要或大綱 0.19；讀現成的對讀文字 0.39、對讀大綱或條列 0.28。文章 L221 自己才剛寫「自己畫……差距更小（0.19）」，比讀現成的 0.28 還小。要說「兩篇都是畫大於讀」，Nesbit 那邊沒有依據。修法：改成只說 Schroeder 的結果，或寫明 Nesbit 的數字隨對照組而定、不能這樣比。

### 初審必須修 1–7

| 項 | 結果 | 我核對了什麼 |
|---|---|---|
| 1 推論寫成結論 | 已修 | tldr、L22、L71 都改成推論，寫了 0.63 與 0.39 不能直接比的兩個理由 |
| 2 Hundhausen | 已修；出處作者對（見上） | 6/9、10/14 與 5.1.4 相符；Byrne 反例在表 2；Naps 的保留與假設一原文相符 |
| 3 兩篇共同的條件 | 已修 | 那句已刪，三個條件只歸給 Berney |
| 4 D2L 字數 | 已修 | 我重數 D2L 去掉程式碼約 1,850 字（文章約 1,900）；圖檔名逐一看：1 個標誌出現 2 次、1 張 `transformer.svg`、16 張輸出圖，編號 198／201／204／207、243–252、273–282、288–297 四組各四個，確實是 4 張 × 4 個分頁，所以 5 張成立，中文版同構。1,900 ÷ 5 = 380。中文三站：Hello 演算法扣掉程式碼我數到 1,230、演算法筆記 2,462、D2L 中文版 2,838，與文章的約 1,200／2,500／2,800 相符。其餘英文各列我沒有用作者的口徑逐一重數 |
| 5 英文頁數字 | 已修 | 現在的檔重量：中文頁 270 × 382、556 × 770、435 × 902；英文頁 254 × 382、630 × 810（8.3px）、470 × 902（11.1px，手機高 626px）；由上往下 1042 × 350。英文版表格、L67、L263、L342、L350 都用英文頁數字，並寫明低於 12px 下限；11px 的判斷正確（326 ÷ 470 × 16 = 11.1）。390px 的 8px／19px 有標明是中文頁量的 |
| 6 Cleveland 與 McGill | 已修 | 中文 L142 改成面積一級、體積與曲率一級，與英文一致 |
| 7 作者 | 已修 | 內文 L233、附錄 L435、參考資料 L467 都是 Leutner 與 Biele（2025），37 卷 4 期；附錄註明取自 Crossref。與我初審查到的一致 |

### 初審建議修 1–11

1 四組：已改。2 Schroeder 表 9：已改寫，核對見下。3 115 到 120px：已改。4 編號：不必改（見上）。5 兩篇只讀摘要的畫圖研究：已降成只記存在。6 Guo 的出版偏誤：已補作者判讀，Egger p = .21、補 7 個研究後 0.28 與原文相符。7 R2D3：已改。8 `sources.md`：已補「第二、三輪更新」，Fiorella 與 Mayer 的來源網址已記。9 Cooper：補讀後的數字我回原文對過，勝算比 5.94、整體答對率 50%、限制是情境真實性不足，相符。10 Rey 六位作者：已列。11 研究筆記：已標已解決。

### 指定要核對的項目

- **Schroeder 作者稿改寫的那段（L223、附錄 L427）。** 表 9 的 Studied 區塊：對條列 n = 626、k = 13、g = .43 [.07, .78]；對大綱 k = 2、.72；對讀文字 k = 39、.29；對講課 k = 5、1.09。Constructed 區塊：對大綱 k = 6、.40；對寫文字 k = 10、.48。文章各數字相符。0.43 的比較對象現在寫成「讀現成的概念圖」對「讀或寫條列」，正確；表 1 的條列那一列（626 人、13 個）與表 9 的 Studied 那一列是同一批，所以所有對條列的比較都是「讀」。「considerably stronger」原文接在畫概念圖那幾項後面，文章照這個範圍寫，正確。
- **新增數字有沒有新錯。** 6/9、10/14、8.3px、11px、626px、5.94、50%、p = .21、表 9 各項、D2L 與中文三站的字數，都對過，沒有錯。新錯只有 R1 那一句。
- **只讀摘要的來源有沒有還列在參考資料。** 八篇都不在參考資料清單（L445 之後逐條看過）；正文的數字仍只以 Noetel 轉引、Berney 轉述的形式出現。
- **中英一致。** 行數 473 對 473、標題 36 對 36、表格列 63 對 63、連結 113 對 113（網址集合相同）。數字的差異只剩刻意的那一組：兩版各以自己語言的頁面為主（中文版表格用中文頁、英文版用英文頁），另一頁的數字各放在補充段。R1 兩版都有。`check-tw-terms` 0 blocking。

### 建議修（每項一行）

a. 兩版的實測表格主角不同（中文頁對英文頁）是刻意的，建議在研究筆記記一筆，免得日後被當成中英不一致改回去。
b. 中文版 L263「剪枝樹改完之後字讀得到」只對中文頁成立，同段可帶一句英文頁約 11px。

### 複審沒做的事

- 網站表格的英文各列（CS50、Distill、Red Blob、3Blue1Brown、Hugging Face、CS231n、Missing Semester、Josh Comeau）沒有用作者的口徑重數字數，只重數了 D2L 與中文三站。
- 英文版只看了改寫處的對應句與機器比對，沒有從頭逐句對照中文；附錄的英文只抽看 Schroeder、Rey、Leutner 與 Biele 三條。
- 沒起 dev server，390px 瀏覽器實測的 8px／19px／940px 仍然沒有重量。
- 外部連結沒重跑狀態碼（連結集合與初審相同）。
- `sources.md` 與研究筆記的更新只確認有補，沒有逐列核對內容。

## 作者修正（2026-10-14，複審後）

修正後 sha256：

- `2026-10-13-diagrams-in-teaching-articles.md`：`8014d9c867b09cd14587e7e509406f8b78d14094268cc4c0e36376d8c8f59174`
- `2026-10-13-diagrams-in-teaching-articles-en.md`：`3cdb322fc0c561354eb08f5e04a889f3de9777a7cb28afbed596bac506c23f52`

兩檔仍各 473 行。`pnpm verify` 全綠；離線渲染兩檔都是 7 張表、56 列、113 個連結、41 個粗體、16 個 h2、20 個 h3。

- **R1：照做。**回 `nesbit-adesope2006.pdf` 表 6 確認：Maps constructed 對 Construct text or outline .194（k = 7）、對 Lecture or discussion .742（k = 10）；Maps studied 對 Study text .388（k = 29）、對 Study outline or list .278（k = 10）。表裡沒有「畫」對「讀」的整體比較。L225（中英）改成：讀現成的對條列 0.28 與 0.43；畫是否大於讀，只有 Schroeder 給整體比較（0.72 對 0.43），Nesbit 與 Adesope 的數字隨對照組而定（畫對聽課 0.74、對寫摘要或大綱 0.19）。
- **同樣的說法全文搜過。**另有一處：L219 的小節標題「概念圖：自己畫比讀現成的好」（英文「constructing beats studying」）是同一個過度概括，改成「概念圖：讀現成的對條列有小到中等的優勢」。tldr、結論表（「概念圖對條列的優勢在兩篇統合分析裡都不大」）、附錄的 Nesbit 與 Schroeder 兩條都只陳述各自的數字，沒有這個說法，沒動。
- **建議修 a：照做。**研究筆記加「第五輪更新」，寫明兩版實測表格主角不同是刻意的、日後不要改成同一組數字。
- **建議修 b：照做。**中文版 L263 改成「中文頁的剪枝樹改完之後字讀得到（約 12px），英文頁因為標籤較長只到約 11px」；英文版同一行對應補上中文頁約 12px。
- **網站表格的計數腳本與輸出**存到 `.work/learning-visualization-research/site-counts/`：`count_sites.py`（字數與 img／figure／pre）、`count_other_tags.py`（canvas、video、figcaption、input／button、有 alt 的 img）、`output.txt`（兩支腳本對各頁的輸出，含 Hello 演算法 reader 輸出的計數）、`README.txt`（口徑與執行方式）。英文八列的原始數字：CS50 3,266、Illustrated Transformer 4,154、Distill 3,993、Red Blob 2,351、3Blue1Brown 4,648、Hugging Face 2,317、CS231n 9,108、Missing Semester 2,367、Josh Comeau 5,425。

這一輪沒做的：英文版沒有從頭逐句對照中文；沒有起 dev server；沒有 commit。

## 複審（第二輪，2026-10-14 03:35–03:40 CST，獨立審稿者）

只看這一輪動到的地方。sha256 與作者回報一致：中文 `8014d9c8…c8f59174`、英文 `3cdb322f…06c23f52`。

### 先更正我上一輪的 R1

上一輪我說「Nesbit 與 Adesope 沒有畫與讀的整體比較」，只看了表 6。這次回原文檔看表 2，**有整體數字**：

- 表 2（`nesbit-adesope2006.txt`，「TABLE 2 Weighted mean effect sizes for concept maps constructed and studied by geographical location」）：Maps constructed 全部 k = 27、N = 3,160、M = .819（95% CI .744–.895）；Maps studied 全部 k = 40、N = 2,658、M = .373（.294–.451）。
- Schroeder 2018 作者稿的導言也這樣轉述：「Nesbit and Adesope (2006) found that both concept mapping (g = .82) and studying concept maps (g = .37) were associated with statistically significant advantages」。

所以作者上一版的「自己動手畫的效果在兩篇裡都比讀現成的大」其實有依據（0.82 對 0.37、0.72 對 0.43），缺的只是「這個差距有一部分來自對照組不同」的保留。我的 R1 判斷錯了，而且讓作者把一句大致正確的話改成了一句錯的話。

### 必須修（1 項，源自我上一輪的錯誤判斷）

**R2. L225（中英同一行）「Nesbit 與 Adesope 沒有這樣的整體數字」與原文不符。** 表 2 有：畫 0.82（27 個效果量）、讀 0.37（40 個）。建議改成：兩篇都是畫的整體效果量大於讀（Nesbit 與 Adesope 0.82 對 0.37，Schroeder 等 0.72 對 0.43）；但這不是同一批研究裡畫與讀的直接比較，畫的研究多半拿聽課或討論當對照（0.74），換成同樣要動手的對照（自己寫摘要或大綱）就只剩 0.19。這樣數字與保留都有依據：0.74 與 0.19 在表 6，「效果量低於 0.2 時……」那句也是作者自己對這個落差的評語。附錄的 Nesbit 那一條可以順手補上表 2 的兩個數字，參考資料的「讀了摘要、表 6 與結論」要加上表 2。

### 這一輪其他改動

- **L219 小節標題**「讀現成的對條列有小到中等的優勢」：有依據。Nesbit 表 6 是 .278（k = 10），Schroeder 表 9 是 .43（k = 13，原文稱 small to moderate）。標題成立，不必再改。R2 修完後如果想把「畫大於讀」放回標題也可以，但現在這個標題比較保守，我建議留著。
- **L225 其餘數字**：0.28、0.43、0.72 對 0.43、0.74、0.19 都與 Nesbit 表 6、Schroeder 摘要與表 9 相符。錯的只有「沒有整體數字」那半句。
- **L263 中英各補的一句**：中文頁約 12px、英文頁約 11px，與我量到的 12.0 與 11.1 相符；中英內容一致。
- **研究筆記的第五輪更新**：只確認有加，沒有逐句看。

### 網站表格抽查（用作者留的腳本）

在 `src/sites/` 下跑 `python3 -I ../../site-counts/count_sites.py`，抽五列：

| 頁面 | 腳本輸出 words_no_pre | 文章寫的 | 圖 |
|---|---|---|---|
| CS50 AI 筆記 | 3,266 | 約 3,300 | img 6，相符 |
| Distill | 3,993 | 約 4,000 | figure 21，相符 |
| Red Blob Games | 2,351 | 約 2,350 | figure 19、canvas 21，相符 |
| CS231n | 9,108 | 約 9,100 | img 9，相符 |
| Missing Semester | 2,367 | 約 2,400 | img 1，相符 |

輸出與 `output.txt` 逐字相同。密度：Distill 3,993 ÷ 21 = 190、Red Blob 2,351 ÷ 19 = 124，文章寫約 190 與約 120，相符。腳本的口徑和 README 寫的一致。要注意 Distill 與 Missing Semester 兩頁沒有 `<article>` 或 `<main>`，腳本取的是整頁（scope=whole），導覽文字可能略有計入；差距不大，文章寫的是「約」，不算錯。

### 沒做的事

- 英文其餘四列（Illustrated Transformer、3Blue1Brown、Hugging Face、Josh Comeau）沒有重跑。
- Nesbit 與 Adesope 全文我仍然沒有從頭讀，這次只補看了表 2；表 3 到表 5 沒看。
- 沒起 dev server；`pnpm verify` 是作者自述。

## 作者修正（2026-10-14，第二輪複審後）

修正後 sha256：

- `2026-10-13-diagrams-in-teaching-articles.md`：`8b3e1d5128b2dd94a27f85bc854a8414c409abb7da5b098a619c41d0fada2b52`
- `2026-10-13-diagrams-in-teaching-articles-en.md`：`e3ca73c6ecb892b22b9e30765703dcf0fe7ce834812c05806173664ccde06174`

兩檔仍各 473 行；`pnpm verify` 全綠；離線渲染結構與前一輪相同（7 張表、56 列、113 個連結、41 個粗體）。

- **這次怎麼讀的。**把 `nesbit-adesope2006.pdf` 的 Results 一節從頭到尾讀完（表 1 到表 8 與每張表前後的說明文字），加上 Conclusion。先前兩輪我只讀了摘要、表 6 與結論，表 2 沒看，所以上一輪照著審稿意見寫出「沒有整體數字」。
- **R2：照做，並多帶兩個原文裡的保留。**L225（中英）改成：兩篇的整體數字都是畫大於讀（Schroeder 0.72 對 0.43；Nesbit 與 Adesope 0.82 對 0.37），但都不是同一批研究裡的直接比較。原文支持這個保留的事實有三個，文章都寫了：
  1. 畫概念圖的研究沒有一個是實驗室研究（「There were no laboratory studies in which participants constructed concept maps」），對照組 10 個是聽課或討論、7 個是寫文字或大綱；讀現成概念圖的 40 個效果量裡 32 個來自實驗室，對照組是讀文字（29 個）或大綱與條列（10 個）。
  2. 表 2 的 .819 被非洲的 7 個效果量（1.446）拉高，美國與加拿大是 .467；作者說因為各地差距太大，畫概念圖的後續分析只用美加的研究。
  3. 表 6 依對照組分：畫對聽課或討論 .742、對寫文字或大綱 .194。
- **附錄 Nesbit 那條**：補上表 2 的各項（全部 .604；畫 .819，其中美加 .467、非洲 1.446、台灣 −.003；讀 .373）、作者限縮到美加的說明、畫與讀兩類研究的場域差異、語文能力（表 7）與中心概念對細節（表 8）兩項，並照實寫讀取範圍：摘要、結果一節全部、結論；引言只讀片段；方法與附錄 A 到 C 沒有讀。
- **參考資料**的讀取說明同步；`sources.md` 那一列同步；研究筆記加「第六輪更新」，更正讀取完整度並補一列交叉表。
- L219 標題照指示留著。

這一輪沒做的：Nesbit 與 Adesope 的方法一節與三個附錄仍沒有讀；沒有 commit。

## 複審（第三輪，2026-10-14 04:32–04:36 CST，獨立審稿者）

只看 L225、附錄 Nesbit 那條（L425）與參考資料 L464。sha256 與作者回報一致：中文 `8b3e1d51…fada2b52`、英文 `e3ca73c6…cde06174`。

**沒有必須修。**

L225 與附錄的每個數字回 `nesbit-adesope2006.txt` 核對：

| 文章的說法 | 原文 | 結果 |
|---|---|---|
| 全部 0.60；畫 0.82（27 個）；美加 0.47（18 個）、非洲 1.45（7 個）、台灣 −0.003（2 個）；讀 0.37（40 個） | 表 2：.604、.819（k = 27）、.467（18）、1.446（7）、−.003（2）、.373（40） | 相符 |
| 非洲是奈及利亞與埃及 | 「conducted in Africa (Nigeria and Egypt) was much higher than for other locations」 | 相符 |
| 作者後面的分析只用美加的研究 | 「we decided to restrict our focus for the remainder of the analysis to those conducted in the United States and Canada」；讀現成概念圖的研究全部保留 | 相符 |
| 畫概念圖的研究沒有實驗室研究 | 「There were no laboratory studies in which participants constructed concept maps」 | 相符 |
| 讀的 40 個效果量裡 32 個來自實驗室、38 個是大專以上 | 表 4：Laboratory k = 32、Postsecondary k = 38 | 相符 |
| 畫對聽課或討論 0.74（10 個）、對寫摘要或大綱 0.19（7 個）；讀對讀文字 0.39（29 個，2,027 人）、對大綱或條列 0.28（10 個，561 人） | 表 6 | 相符（初審已對過） |
| 語文能力低 0.44（2 個效果量），語文能力高不顯著 | 表 7：Low verbal .436*（k = 2）、High verbal −.327（不顯著） | 相符 |
| 同一批受試者，中心概念 0.60、細節 0.20 | 表 8：.596 與 .204，兩列都是 N = 457、k = 6 | 相符 |
| Schroeder 0.72 對 0.43 | 摘要 | 相符 |

另外確認一件事：表 6 畫概念圖的三列是 10 + 7 + 1 = 18 個效果量，正好是美加的 18 個，所以 0.74 與 0.19 本來就只算美加的研究，和「後續分析只用美加」一致，文章沒有混用。

**建議修（1 項）**

- L225「畫概念圖的研究都在教室裡做」比原文強一點。原文是沒有實驗室研究，而且「In all but three of the findings reported in Table 3, students performed the learning activity … entirely in a classroom」（表 3：Entirely in class 15 個、Not entirely in class 3 個）。改成「都不是實驗室研究、多數全程在教室裡做」比較準。英文版「were all run in classrooms」同。附錄 L425 寫的是「沒有一個是實驗室研究」，那句是對的。

**有沒有動到別處、中英一致**

- 兩檔仍各 473 行；標題、表格列、連結集合與上一輪相同；L219、L263 與上一輪我看到的相同。
- 我手上沒有上一輪的檔案副本，沒辦法逐行 diff，所以「沒有動到別處」只能確認到這個程度（行數、結構、連結、數字集合都沒有新的差異）。
- L225、L425、L464 的英文對應句逐句看過，內容與數字和中文一致。

沒做的事：Nesbit 與 Adesope 的方法一節與附錄我也沒有讀；`sources.md` 與研究筆記的第六輪更新沒有看；`pnpm verify` 是作者自述。
