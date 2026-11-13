# 抽取紀錄：Lekshmi-Narayanan、Asher、Brusilovsky、Carvalho 2025，CSEDM'25 workshop

**書目**：Arun-Balajiee Lekshmi-Narayanan（University of Pittsburgh, Intelligent Systems Program；通訊作者）、Michael W. Asher（Carnegie Mellon University, HCII）、Peter Brusilovsky（University of Pittsburgh）、Paulo F. Carvalho（Carnegie Mellon University, HCII）。姓名與機構對 PDF 首頁核過。〈Can Motivated Students Do More Activities?〉。*CSEDM'25: 8th Educational Data Mining in Computer Science Education (CSEDM) Workshop*，2025 年 7 月 20 日，Palermo。CC BY 4.0。沒有 DOI；取得網址 https://par.nsf.gov/servlets/purl/10632298 。

**原文檔**：`.research/raw/learning-content/q3-activity/motivated_doer_nsfpar.pdf`（9 頁，第 8–9 頁是參考文獻）與 `motivated_doer_nsfpar.txt`（413 行、32,105 字元；`-layout` 轉檔，但原文是單欄，段落順序沒亂）。行號一律是 `.txt` 的行號。
**讀取日期**：2026-10-14
**版本**：workshop 論文的刊出版面（頁尾有 CSEDM'25 與 CC BY 標示），放在 NSF PAR。
**供哪幾篇使用**：order 8（8-d 的無效果結果）。

## 研究設計

- **類型**：既有紀錄檔的次級分析，多元線性迴歸；沒有隨機分派（L15–17、L213–215）。
- **受試者**：2018–2019 學年使用 CSAwesome 電子書（Runestone 平台）的 1,060 名學生；課程是給高中生的 AP 入門 Java MOOC（L16–17、L127–128）。沒有其他背景資料。
  - 有前測的 694 人（RQ2、RQ3 用）。
  - **前後測都有的只有 92 人**（RQ1 用）（L165–167、表 1）。
- **教材**：CSAwesome 約 16 個內容單元，另有模擬考單元；全書 96 頁、674 個活動、62 支影片（L120–122、表 1）。活動分兩類：程式類（Parsons problems、CodeLens、ActiveCode）與內容類（選擇題、簡答題）；影片是嵌在教材裡的 YouTube 連結（L128–136）。
- **量了什麼**：
  - 前測、後測：各取第一次作答；Cronbach's α 前測 0.87、後測 0.81（L168–171）。測驗內容、題數原文沒寫。
  - 資源使用：讀、看、做各自的次數與時間。時間由相鄰兩筆事件的時間戳相減得到（L162–165）。
  - 持續度（persistence）：學生從頭算起讀到、看到或做到的最遠一頁；平均 75.70 頁（SD 17.63）（L180–183）。
  - 投入度（course engagement）：到最遠那一頁為止，讀過的頁數／看過的影片／做過的活動，各除以到那一頁為止可完成的最大數（L184–190）。
  - 問卷：學 Java 的信心、將來走資工的意願（課程開頭的問卷，圖 2）。
- **分析**（L212–259）：全部 Z 分數化。
  - RQ1：後測 ~ 前測 + 讀、看、做（一個模型用時間、一個用次數）。
  - RQ2：持續度 ~ 信心 + 三種資源的完成百分比。
  - RQ3：課末的資工志向 ~ 開頭志向、信心、兩者交互作用。
- **比較對象**：沒有對照組；比的是同一迴歸裡三種資源的係數。

### 表 1 的描述統計（L227–253；對過 PDF 第 6 頁）

| 項目 | N | 平均 | SD |
|---|---|---|---|
| 學生總數 | 1,060 | | |
| 完成後測（RQ1） | 92 | | |
| 完成前測（RQ2、3） | 694 | | |
| 書的頁數／活動數／影片數 | 96／674／62 | | |
| 讀頁次數 | | 547.3 | 798.32 |
| 看影片次數 | | 27.11 | 15.98 |
| 做活動次數 | | 655.5 | 301.85 |
| 閱讀時間（小時） | | 220.85 | 242.45 |
| 影片時間（分鐘） | | 25.65 | 20.73 |
| 活動時間（小時） | | 11.1 | 6.80 |
| 持續度（頁） | | 75.70 | 17.63 |
| 學 Java 的信心 | | 1.35 | 17.63 |
| 資工志向（Pre） | | 1.02 | 1.05 |
| 資工志向（Pre，列名重複） | | 1.12 | 1.24 |

表 1 另列「# Readers 72、# Watchers 30、# Doers 38、# Readers or Watchers or Both 47、# Doers or Watchers or Both 81、# Readers or Doers or Both 48、# Readers and Watchers and Doers 180」。這七個數加起來是 496，對不上 694 也對不上 1,060；原文沒說分母，這組類別變項在後面的結果表裡也沒有出現。

## 結果（逐項）

表 2、3、4 都對過 PDF 第 7 頁，數字與文字檔一致。

### RQ1：資源使用與後測（表 2，L280–292；N = 92，控制前測）

| # | 預測變項 | 估計值 | SE | t |
|---|---|---|---|---|
| 1 | 前測（時間模型） | 0.04 | 0.11 | 0.46 |
| 2 | 活動時間 | −0.08 | 0.11 | −0.63 |
| 3 | 影片時間 | 0.10 | 0.13 | 0.75 |
| 4 | 閱讀時間 | −0.04 | 0.11 | −0.40 |
| 5 | 前測（次數模型） | 0.07 | 0.10 | 0.71 |
| 6 | 活動次數 | −0.09 | 0.15 | −0.59 |
| 7 | 影片次數 | 0.27 | 0.16 | 1.67（邊緣） |
| 8 | 閱讀次數 | −0.27 | 0.11 | −2.38* |

- 原文（L264–268）：「When using activity, video, and page read times as predictors and post-test scores as the outcome while controlling for the pre-test as a covariate, we could not demonstrate the "Doer Effect". Similarly, we could not demonstrate the "Doer Effect" with the page, video, and activity counts as predictors of post-test scores. The coefficient for page counts had a small significant negative effect on the post-test scores when controlling for pre-test scores」。
- **做的係數兩個模型都是負的**（−0.08、−0.09），都不顯著。
- 前測也不能預測後測（0.04、0.07，不顯著），原文沒有討論這一點。
- 我自己從 SE 估的範圍：活動次數 −0.09 ± 2 × 0.15，約 −0.39 到 +0.21。N = 92 時這個區間很寬，結果只能說「沒測到」，不能說「證明沒有」。模型的 R²、自由度原文都沒報。

### RQ2：資源使用與持續度（表 3，L294–301）

| # | 預測變項 | 估計值 | SE | t |
|---|---|---|---|---|
| 9 | 學 Java 的信心 | −0.4 | 0.00 | −0.85 |
| 10 | 讀過的頁面百分比 | 0.08 | 0.04 | 2.07* |
| 11 | 看過的影片百分比 | 0.08 | 0.05 | 1.54 |
| 12 | 做過的活動百分比 | 0.19 | 0.05 | 3.73*** |

- 原文（L271–275）：「the relation between persistence and completing more of the available activities was 2.3 times stronger than the relation between persistence and completing more of the available reading pages, suggesting a "Doer Effect".」對表：0.19／0.08 = 2.4，原文寫 2.3（可能用未四捨五入的值）。
- 這個模型的 N 原文沒寫明（依方法段應是有前測的 694 人）。
- 結果變項（最遠頁數）與預測變項（到最遠頁為止的完成比例）是用同一個量定義的，原文沒有討論這層相依。

### RQ3：資工志向（表 4，L308–314）

| # | 預測變項 | 估計值 | SE | t |
|---|---|---|---|---|
| 13 | Career Interest（開頭志向） | −0.76 | 0.12 | −6.24*** |
| 14 | Confidence to Learn JAVA | 0.03 | 0.26 | −0.76 |
| 15 | Confidence × Career | −0.09 | 0.13 | 0.52 |

- 原文（L304–306）：「We found no relationship between the type of interaction the students had with the course and their final interest in pursuing a CS career or any interaction (see Table 4).」但表 4 裡**沒有任何資源使用或互動類型的變項**，這句話在表上找不到對應的數字。

### 討論段會被引用的句子

- L319–324：「Although the "Doer Effect" has been identified in many courses and datasets before, we failed to identify it in the current paper when predicting learning outcomes. There are multiple possible reasons for this. The number of students contributing data to our analyses is likely too small to identify the effect. Prior work has used larger sample sizes. It is also possible that the use of the text and the video was substantially different in the current sample than in previous studies. Regardless, the numeric direction of the data is consistent with prior doer effect results.」
- L326–328：「our second analysis revealed that students who do more activities also continue for longer than those who watch more videos or read more pages.」

## 作者自己列的限制

沒有獨立的限制節。討論段只給了兩個理由解釋 RQ1 沒結果（L320–323）：樣本太小；這批學生用文字與影片的方式可能與先前研究不同。另一句是 RQ3 的結論「although further research is needed」（L339）。

**經費與利益關係**：NSF Grant 2418655、2418656（給 Brusilovsky 與 Carvalho）；資料來自 Runestone 的 Brad Miller 與 CMU DataShop（L349–352）。沒有利益衝突聲明。聲明沒有使用生成式 AI（L355–356）。共同作者 Carvalho 與 Asher 出自 CMU，Carvalho 是多篇 doer effect 論文的共同作者（參考文獻 2、3、6），所以這個無效果結果來自提出這個效果的同一個研究圈，不是外部批評者。

## 與摘要說法不一致的地方

1. 討論段說 RQ1「the numeric direction of the data is consistent with prior doer effect results」（L323–324）。表 2 裡做的係數是 −0.08 與 −0.09，方向是負的；doer effect 的定義是做的係數為正且大於讀與看。方向對得上的只有「讀的係數為負」這一項。這句話與自己的表不合。
2. 5.3 節內文寫「a positive relationship between higher baseline confidence in JAVA and post-test interest in following a CS career (β = −0.76, t = 0.12, p < .0001)」（L278–279）。三處對不上：說是正向但 β 是負的；−0.76 在表 4 是「Career Interest」那一列，不是信心；括號裡的 t = 0.12 在表 4 是 SE。
3. 表 4 的估計值與 t 值正負號不一致（0.03 配 t = −0.76；−0.09 配 t = 0.52）。
4. 表 3 的信心一列是估計值 −0.4、SE 0.00、t −0.85，三個數彼此不可能同時成立。
5. 表 1「Confidence to Learn JAVA」的 SD 17.63 與上面持續度的 SD 完全相同，平均才 1.35，應是誤植；「Career interest in CS (Pre)」出現兩列（第二列應是 Post）。
6. 表 1 閱讀時間平均 220.85 小時、活動時間平均 11.1 小時，兩者差二十倍；方法段寫的離群值處理是「replaced the bottom 5% of event durations with the 3rd quantile (75%) value」（L173–176），處理的是最短的事件而不是最長的，與它要解決的問題（開著瀏覽器離開）相反。閱讀時間這個變項不可靠。
7. 摘要最後一句「This effect does not appear to be limited to highly motivated students」（L19）的依據是 RQ3，而 RQ3 的表裡沒有資源使用變項（見上）。
8. 導言對前人研究的轉述有誤或不通：「Koedinger and colleagues [4, 5] showed that completing more reading causes students to do about 0.39 times more across 3 online courses」（L30–31）；2.1 節說 VitalSource 的研究「could confirm at scale the causal effects」（L104–105），而被引的 Van Campenhout 2023 自己寫模型不能證明因果。

摘要的主句「we failed to identify a doer effect in learning outcomes」與表 2 一致。

## 與清單「要撐的結論」不合的地方

清單寫這篇是 8-d 的無效果證據，並提醒「workshop 論文，證據等級要在精讀時判斷」。

- 「沒有找到 doer effect」這句話原文撐得住：摘要、5.1 節、討論段三處一致，表 2 的係數為負且不顯著。
- 但它**撐不起「doer effect 不存在」或「複製失敗」這麼重的說法**：學習成果那個分析只有 92 人（1,060 人裡前後測都有的 8.7%），係數的標準誤 0.11–0.15，連前測都預測不了後測。作者自己把原因歸給樣本太小。
- 清單沒寫的另一半：同一篇報告在「持續度」上找到做 > 讀（0.19 對 0.08），作者把它叫做 doer effect 的延伸。文章若只引「沒有效果」而不提這一半，是選擇性引用；但這一半的結果變項與預測變項互相定義，強度也有限。
- **證據等級判斷**：低。理由是 (a) workshop 論文；(b) 三張結果表裡兩張有內部矛盾的數字，內文有兩處與表不合；(c) 關鍵分析 N = 92；(d) 閱讀時間的前處理有問題。建議文章裡最多寫成一句「有一篇小樣本的 workshop 論文在高中 Java 電子書上沒有測到這個效果，作者自己認為是樣本太小」，不要當成與前面幾篇對等的反證。清單「找不到來源」段寫的「一致的相關，一篇沒有複製出來」可以保留，但要加上樣本數。

## 讀取紀錄

- `motivated_doer_nsfpar.txt` 一次讀完 L1–413（全檔）：L1–69 標題、摘要、導言、研究問題；L72–116 相關研究；L119–153 資料集、圖 1、圖 2 圖說；L156–259 量測與分析、表 1；L262–314 結果、表 2–4；L318–356 討論、致謝、AI 聲明；L359–413 參考文獻（掃過）。
- 對過 PDF 版面：表 1（第 6 頁）、表 2、3、4（第 7 頁）；PDF 第 1–7 頁以影像讀過，圖 1–3 也看過。第 8–9 頁（討論末段與參考文獻）只讀文字檔。
