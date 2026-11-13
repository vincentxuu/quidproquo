# 抽取紀錄：Dasgupta 與 Hill 2017，Learning to Code in Localized Programming Languages

- **合法公開來源**：https://dl.acm.org/doi/10.1145/3051457.3051464（刊出版，2026-10-14 核對）；同一個檔也在共同作者 Benjamin Mako Hill 的個人網站 https://mako.cc/academic/dasgupta_hill-learning_code_localization-L@S2017.pdf 。ACM Digital Library 自 2026-01-01 起全面開放取用，文章頁標示 FREE ACCESS。兩處重新下載的 PDF 都與手上的 `dasgupta2017-localized.pdf` 位元組完全相同（892,591 位元組）。

- **書目**：Sayamindu Dasgupta（MIT Media Lab；University of Washington）、Benjamin Mako Hill（University of Washington）。Learning to Code in Localized Programming Languages. Proceedings of the Fourth (2017) ACM Conference on Learning @ Scale（L@S 2017），2017-04-20 至 21，Cambridge, MA，頁 33–39。DOI 10.1145/3051457.3051464。作者、會議、頁碼、DOI 對過 PDF 首頁。
- **版本**：刊出版（ACM 版面，版權屬作者）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/dasgupta2017-localized.txt`（910 行、37,039 字元）；PDF 同名 `.pdf`，7 頁（印刷頁碼 33–39）。
  - `.txt` 是雙欄版面轉出的，**左右欄的段落互相穿插**（例：L43–45 是右欄的句尾插在關鍵詞中間；L128–129、L252–265、L346–359、L592–608 都是右欄段落插在左欄段落之間），Table 2、Table 3 的數字被拆成一格一行、Table 3 還和 Figure 3 的座標刻度混在一起。
  - 所以這篇的**閱讀順序以 PDF 頁面為準**：用 Read 逐頁讀 PDF 第 1–6 頁的頁面影像（先左欄後右欄），再回 `.txt` 取行號。三張表全部對 PDF 版面。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 4 #12（清單註明與 order 24 重疊）
- 位置寫「p.印刷頁碼」加 `.txt` 行號。

## 研究設計

- **類型**：觀察性的縱貫資料分析（平台記錄檔），沒有隨機分派，沒有介入。
- **場域**：Scratch 線上社群（積木式程式語言，設計給 8–16 歲；編輯器、網站、積木上的字都由志工翻譯成多種語言）。同一份程式在不同介面語言下顯示成不同語言的積木（Figure 2，p.34）。
- **介面語言怎麼決定**（p.34，L174–184）：第一次造訪時依瀏覽器設定自動選；也可手動改；以 cookie 記住。約 88% 的使用者從頭到尾只用一種語言。
- **使用者為什麼會用非母語介面**（p.35，L267–281）：瀏覽器沒送語言偏好或技術問題，就落到英文，而且使用者可能不知道可以改；或者懂一點英文、跟著英文教材做所以選英文。這兩種是作者的說明，沒有資料區分各佔多少。
- **樣本**（p.36，L361–374）：自報國家為葡萄牙、義大利、巴西、德國、挪威，2015-05-15 到 2016-05-15 註冊，且在分析期間分享過**一個以上** de novo（非改編）專案的使用者，共 15,339 人；剔除 324 個用了既非當地語言也非英文的人，剩 **15,015 人**、**90,859 個專案**（2015-05-15 到 2016-07-08）。
  - 為什麼是這五國（p.35，L329–334、L252–265）：只取介面（網站、編輯器、積木）在資料期間起迄兩個時點平均翻譯完成度 ≥ 95% 的語言。
- **Table 1**（p.35；對過 PDF）：

| 國家 | 語言 | 平均翻譯完成度 % | 使用者數 | 用當地語言的比例 % | 專案數（有語言資料的） |
|---|---|---|---|---|---|
| 葡萄牙 | 葡萄牙文 | 98.9 | 2,630 | 90.2 | 13,178 |
| 義大利 | 義大利文 | 98.5 | 3,820 | 87.3 | 19,875 |
| 巴西 | 巴西葡萄牙文 | 96.5 | 4,353 | 88.0 | 26,170 |
| 德國 | 德文 | 95.8 | 2,666 | 75.2 | 14,339 |
| 挪威 | 挪威文（Bokmål） | 95.5 | 1,546 | 84.6 | 6,372 |

  使用者數加總 15,015，專案數加總 79,934（＝90,859 − 缺語言資料的 10,768 − 完全沒資料的 157，p.36，L443–455）。依表上比例加權，用當地語言介面的約佔 85.6%、用英文的約 14%（約 2,160 人）；這個合計是我算的，原文沒有給。
- **自變項 Localized?**（p.35，L283–296、L298–304）：使用者超過 50% 的 de novo 專案是用該國最多人說的語言建立的，就記 1；否則（英文）記 0。每個使用者一個值，不隨時間變。**使用者的母語沒有觀察到**，是用「自報國家 → Ethnologue 上該國最多人說的語言」代替（p.35，L305–314）。
- **依變項 Cumulative Block Repertoire**（p.34，L152–172）：每分享一個 de novo 專案，就把其中「這個使用者以前沒用過的積木**種類**」數加進去的累計值。作者稱之為「similar to a measure of demonstrated vocabulary」，並當作學習的指標。
- **控制變項**（p.35–36，L316–344）：累計積木總數、留言數、改編專案數、看別人程式內容的次數（See Inside）、在站天數、自報年齡。
- **Table 2**（p.36；對過 PDF）：每個使用者在最後一個專案時的摘要。

| 變項 | 範圍 | 平均 | 中位數 | 標準差 |
|---|---|---|---|---|
| Cumulative Block Repertoire | [0, 139] | 27 | 25 | 18 |
| De Novo Projects | [1, 744] | 6 | 3 | 12 |
| Remixed Projects | [0, 570] | 1 | 0 | 7 |
| Comments | [0, 2771] | 4 | 0 | 41 |
| Total Blocks | [0, 72461] | 487 | 138 | 1909 |
| Experience（天） | [0, 415] | 62 | 39 | 71 |
| User Age | [4, 89] | 19 | 15 | 12 |

  年齡是自報的；自報小於 4 歲或大於 90 歲的 2,389 個專案標為年齡缺失（p.36，L449–451）。
- **模型**（p.36，L477–481、L346–359、L425–462）：分析單位是專案，巢套在使用者內。混合效果 Poisson 迴歸（R 的 lme4），使用者隨機截距。因為 Localized? 在使用者內不變，不能用使用者固定效果。連續自變項除年齡外都取自然對數。M1 只有 Localized?、ln(De Novo Projects) 與兩者的交互作用；M2 加上全部控制變項。**關鍵係數是交互作用**（用在地化介面者的累計積木種類隨專案數成長得是否較快）。
- **穩健性檢查，都只有一句話、沒有數字**：負二項模型「the results are similar」（L355–357）；把門檻降到 90%、多納入法國與斯洛維尼亞，「The overall results remained similar in magnitude and sign」（L290–293）。

## 結果（逐項）

**Table 3**（p.37；對過 PDF。括號內是標準誤；表註只有一種星號「*p<0.01」）

| # | 參數 | M1 | M2 |
|---|---|---|---|
| 1 | Localized? | −0.109*（0.020） | **−0.056***（0.015） |
| 2 | ln De Novo Projects | 0.517*（0.003） | 0.012*（0.005） |
| 3 | **Localized? × ln De Novo Projects** | 0.091*（0.004） | **0.027***（0.004） |
| 4 | ln Remixed Projects | — | −0.033*（0.002） |
| 5 | ln See Insides | — | 0.020*（0.002） |
| 6 | ln Comments | — | −0.048*（0.002） |
| 7 | ln Total Blocks | — | 0.371*（0.002） |
| 8 | ln Experience | — | 0.052*（0.001） |
| 9 | User Age | — | −0.001*（0.0004） |
| 10 | Constant | 2.119*（0.019） | 1.045*（0.016） |
| 11 | Observations | 79,934 | 77,545 |
| 12 | Log Likelihood | −284,220.000 | −246,430.700 |

內文對應的句子與推導：

| # | 結果 | 數字 | 對照條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 13 | **起點較低**：在地化介面的主效果是負的 | M2：β = −0.056，SE = 0.015，p < 0.01 | 同國、用當地語言介面 vs 用英文介面；第一個專案 | p.36，L469–472 | 「The main effect of Localized? is negative (β = −0.056, SE = 0.015, p < 0.01). This suggests that, everything else equal, the first projects by users of the localized interface have a lower diversity of blocks.」 |
| 14 | **成長較快**：交互作用是正的、小 | M2：β = 0.027，SE = 0.004，p < 0.001 | 同上；每多一個對數單位的專案數 | p.37，L615–619 | 「Our estimates are small but positive (β = 0.027, SE = 0.004, p < 0.001).」 |
| 15 | 追平點 | 多 2 個對數單位的專案（−0.056 + 0.027 × ln n = 0 → ln n ≈ 2.07，n ≈ 8 個專案；換算是我做的） | 同上 | p.37，L619–624 | 「Although we estimate that users of non-localized interfaces begin with higher repertoires, our model predicts that users who have shared 2 log units more projects will have the same repertoire as otherwise identical users of non-localized interfaces and that this gap will widen as users share more.」 |
| 16 | **實際差多少（含起點差）** | 分享 16 個專案（資料的第 95 百分位）、控制變項取中位數的使用者：英文介面 37.1 種、在地化介面 37.9 種，差不到 1 種 | 同上 | p.37，L643–650 | 「would have a repertoire that would be 37.1 if they had used English but 37.9 if they had used a localized interface instead. Though the difference of less than 1 block is small, the negative main effect of Localized? masks some of the differences in the rate of change.」 |
| 17 | 把起點差設為零時 | 同一位使用者：37.1 對 40.1，差 3 種 | 同上，但人為把 Localized? 主效果設成 0 | p.37，L603–608；Figure 3 | 「To make it easier to interpret the effect of the interaction, we also set the main effect of Localized? to 0 so that both prototypical users start with identical repertoires. … 37.1 if they had used English but 40.1 if they had used a localized interface instead.」 |
| 18 | 加控制變項後效果縮小 | 交互作用 0.091 → 0.027；主效果 −0.109 → −0.056 | M1 vs M2 | p.37，L633–636 | 「the addition of the controls in M2 attenuate the size of our effect but does not alter the sign or substantive takeaway.」 |
| 19 | 改編專案與積木種類負相關 | β = −0.033 | 與作者 2016 年的研究方向相反 | p.37，L626–633 | 「Dasgupta et al. found a positive relationship between remixing activity and learning, and we estimate a negative association.」 |
| 20 | 作者自己對效果大小的評語 | — | — | p.38，L680–688 | 「Our estimated effect size is small and reflects a difference of only several blocks over the full trajectory of some of Scratch's most active users.」 |

- Figure 3（p.37）畫的是第 17 項那個「起點差設為零」的版本：兩條線從同一點出發，到 25 個專案以上才拉開到約 45 對 49（目測）。圖說有寫明主效果設為零。
- 把第 13、15 項與 Table 2 放在一起看（這是我的推論，原文沒有這樣寫）：追平點約在第 8 個專案，而使用者分享的 de novo 專案數中位數是 3、平均是 6。照 M2 的係數，多數使用者停在追平點之前，那時用在地化介面者的預測積木種類數仍略低於用英文介面者。

## 作者自己列的限制（LIMITATIONS 節，p.37–38，L652–750）

1. **是相關不是因果**：「although our results can be understood as evidence in support of the hypothesis that local language use can cause users to learn about new programming blocks more quickly, our results describe correlation, not causation.」可能有漏掉的變項，舉的例子是家境：較富裕的人英文通常較好，若他們較常用英文介面，學得快慢可能另有原因（L663–674）。
2. **社群內容以英文為主**：專案裡的提示、留言、說明多半是英文（作者說是「unscientific observations」）；若社群裡的學習靠英文能力，用英文的人反而佔便宜。「Ultimately, however, the implication of this is unknown.」（L698–707）
3. **母語是用國家推的**：假設每個國家的人都說同一種語言，「This is clearly not always true」。作者認為這比較可能造成低估（資料裡以英文為母語而用英文介面的人並不吃虧）（L719–730）。
4. **依變項量不到理解**：「our measure of block repertoire cannot detect whether a block is used correctly or if a user actually understands the function of the block.」引質性研究說有人靠嘗試錯誤用了某個積木卻不懂它（L743–750）。
5. 討論節補的：不知道能不能推到這批使用者與這五國以外（L766、L676–677）；效果小（第 20 項）；「establishing a causal effect remains a goal for future work」（L687–688）。

原文沒有說、但設計上明擺著的（我的觀察）：
- 只收分享過一個以上 de novo 專案的人，寫了一個就走的人不在內；作者在討論末段自己說在地化最重要的作用可能是讓本來不會來學的人來學，而這「not captured by our analysis」（L689–696）。
- 介面語言不是隨機的：落到英文介面的原因有一部分是瀏覽器設定或裝置問題（作者自己說的），這與家庭、學校的設備有關。
- 五種語言都是歐洲語系（含巴西葡萄牙文），沒有任何東亞語言；Scratch 是積木式、整個關鍵字都翻掉，和「英文關鍵字不翻、說明文字翻」的一般程式教材不是同一種情境。
- 依變項隨專案數必然增加，控制變項裡的累計積木總數（β = 0.371）與它高度相關。

## 與摘要說法不一致的地方

1. **摘要只講斜率，沒有講起點**。摘要：「novice users who code with their programming language keywords and environment localized … demonstrate new programming concepts at a faster rate than users from the same countries whose interface is in English.」內文同時報告用在地化介面的人**第一個專案的積木種類較少**（第 13 項），要分享約 8 個專案才追平（第 15 項）。把起點差算進去，第 95 百分位的活躍使用者也只多 0.8 種積木（第 16 項）。
2. **摘要沒有說效果小**；內文與討論各說了一次（「small but positive」「Our estimated effect size is small」）。前言末段有預告會討論「the relatively small size of our estimated effect」（L123–125）。
3. **摘要用「novice users」「youth」**。樣本沒有以新手或年齡篩選，篩的是註冊時間（一年內註冊）；自報年齡平均 19、中位數 15、範圍 4–89（Table 2）。
4. **摘要用「new programming concepts」**；量的是用過的積木種類數。作者在限制第 4 點自己說這量不到理解。
5. 摘要用「association」，沒有因果用語，這一點與內文一致；但前言陳述假設時寫「will learn programming concepts more rapidly」（L135–138），討論末段寫「we have presented evidence in support of the claim that young programmers learn more quickly using localized interfaces」（L693–694）。
6. 內文的小出入：
   - M1 的公式把第一項寫成「β1 ln Localized?」（對一個 0/1 變項取對數，p.36，L439）；M2 的公式沒有 ln。應是排版筆誤。
   - De Novo Projects 的主效果內文寫 β = 0.012、SE = 0.005、p < 0.001（L474–475）；照表上的數字 0.012 ÷ 0.005 = 2.4，對應的雙尾 p 約 0.016，達不到 p < 0.001，也達不到表註的 p < 0.01。可能是四捨五入後的數字，原文沒有說明。Localized? 主效果內文寫 p < 0.01，交互作用寫 p < 0.001，表上都只有一種星號。
   - 前言寫「controlling for differing levels of activity and socialization」，方法裡的控制還包括年齡與在站天數；無礙。

## 與清單「要撐的結論」不合的地方

清單的句子：「母語介面與關鍵字和學得較快有關（相關）」。

方向與「相關」這個限定都對，但照這句話寫會漏掉會改變讀者印象的三件事：

1. **「較快」之外還有「起點較低」**。同一個模型裡，用母語介面的人第一個專案用到的積木種類較少（−0.056），成長斜率較高（+0.027），兩者相抵之後，要到約第 8 個專案才追平，而使用者的專案數中位數是 3。照實的寫法是「用母語介面的人起步時用到的積木種類較少、之後增加得稍快，最活躍的使用者到頭來多不到一種積木」。
2. **效果很小，作者自己說的**：第 95 百分位的使用者 37.9 對 37.1。作者拿來說「3 種」的那個數字（40.1 對 37.1）是把起點差人為設為零的示意，不是模型的實際預測。
3. **「學」量的是累計用過的積木種類數**，作者自己說量不到用得對不對、懂不懂。寫成「學得較快」要加這個限定；較準的說法是「用到新積木種類的速度」。

另外兩個不能從這篇推出的延伸：
- 這篇比的是「整個介面與關鍵字都翻成母語」對「全英文」，沒有「中英並列」或「關鍵字保留英文、說明用母語」這類條件；清單在「不能寫的結論」已標「中英並列的術語對中文讀者有沒有幫助」沒有來源，這篇確實幫不上。
- 樣本是五個歐洲語言國家的 Scratch 使用者，沒有中文或日文使用者。

## 讀取紀錄

| 順序 | 位置 | 內容 |
|---|---|---|
| 1 | `.txt` L1–910（一次讀完） | 全文文字；發現雙欄段落穿插與表格拆行 |
| 2 | PDF 第 1 頁（p.33，Read 讀頁面影像） | 題名、作者、摘要、關鍵詞、Introduction 前半、Figure 1、註腳 1 |
| 3 | PDF 第 2 頁（p.34） | Figure 2、Introduction 後半（Scratch 的說明、介面語言機制、假設）、DATA AND MEASURES 開頭（依變項定義） |
| 4 | PDF 第 3 頁（p.35） | Table 1、自變項的建構、五國的選法、控制變項 |
| 5 | PDF 第 4 頁（p.36） | 資料集的篩選、Table 2、缺失資料、ANALYTIC PLAN、M1 與 M2 的公式、RESULTS 開頭 |
| 6 | PDF 第 5 頁（p.37） | Table 3、Figure 3、RESULTS 其餘、LIMITATIONS 開頭 |
| 7 | PDF 第 6 頁（p.38） | LIMITATIONS 其餘、DISCUSSION、致謝、參考文獻 1–4 |
| 8 | `.txt` L781–907（＝PDF 第 7 頁，p.39） | 參考文獻 5–22（掃過）；這一頁沒有另看頁面影像 |

對過 PDF 版面的表：Table 1（5 列 × 6 欄，並驗算加總）、Table 2（7 列 × 5 欄）、Table 3（12 列 × 2 個模型）。觀察數也驗算過：79,934 − 2,389 = 77,545，與 M2 相符。原文沒有附錄或補充資料。
