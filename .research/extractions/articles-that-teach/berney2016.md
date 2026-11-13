# 抽取紀錄：Berney 與 Bétrancourt 2016，Does animation enhance learning? A meta-analysis

- **書目**：Sandra Berney、Mireille Bétrancourt（對過首頁 L42–45 與 OpenAlex；`.txt` 把重音字母拆壞成「Be trancourt」）。Computers & Education 101, 150–167，2016。DOI 10.1016/j.compedu.2016.06.005。2015-07-14 投稿、2016-05-24 修訂、2016-06-20 接受（L51–55）。
- **原文檔**：`.research/raw/learning-content/q2-interactive/viz-berney2016.txt`（2,850 行、104,600 字元）；PDF `.work/learning-visualization-research/src/berney2016.pdf`（19 頁，第 1 頁是典藏封面，論文第 150 頁＝PDF 第 2 頁）。我另用不帶 `-layout` 的 `pdftotext` 重轉，結果與原 `.txt` 行數、字元數完全相同，行號直接用原檔。
- **來源**：日內瓦大學機構典藏 Archive ouverte UNIGE，https://archive-ouverte.unige.ch/unige:92234 ，封面註明「Published version／Public access」（L8–14）。
- **讀取日期**：2026-10-14
- **版本**：刊出版
- **供哪幾篇使用**：order 7（該不該做互動）#3；清單註明與 order 2（圖）共用。動筆前 `teaching-text/` 與 `articles-that-teach/` 都沒有這篇的紀錄，這份是第一份。
- **表格對照（重要）**：`.txt` 與 `pdftotext -layout` 兩種轉法都**把所有負號吃掉了**（例如 Table 3 的 Full 在文字檔是「0.120 [0.407; 0.166]」，版面上是「−0.120 [−0.407; 0.166]」）。所以 Fig. 1、Table 1、Table 2、Table 3、Table A1 全部直接看 PDF 版面（PDF 第 7、9、10、11、14、15、16 頁），下面的正負號都以版面為準。**任何人之後用這個 `.txt` 的數字都要回頭對 PDF**。

## 研究設計

- **類型**：統合分析，隨機效果模型（L63、L433–436）。
- **比較對象**：多媒體教材裡的動畫 vs 靜態圖（L57–63）。動畫採 Bétrancourt 與 Tversky 2000 的定義：一連串畫格，每一格是前一格的改變，順序由設計者或使用者決定（L86–88）。
- **只收哪種動畫**：只收「解說型」（expository）動畫，也就是幫學習者理解隨時間變化的動態系統如何運作的那種；吸引注意的動態提示、示範操作程序的動畫不在主要範圍（L139–147、納入標準 b）。只收電腦呈現的動畫，**影片排除**（納入標準 c；L912–913「excludes video-based studies」；Fig. 1 排除 13 篇 video-based）。
- **檢索**（L335–342）：以 Höffler 與 Leutner 2007 收的研究為起點，再系統檢索到 2013 年 12 月。資料庫：PsycInfo（1806–2013）、ERIC（1966–2013）、Francis（1984–2013）、MedLine（1950–2013）、Psyndex（1945–2013）。關鍵詞：animation、multimedia、multimedia animation、interactive animation、static graphic、multimedia learning、dynamic picture、static picture、dynamic visualization、computer animation、interactivity。收了公開可得、當時未出版的博士論文。
- **納入標準六條**（L344–349）：(a) 實證研究比較動畫與靜態圖；(b) 解說型、為教學設計的動畫；(c) 電腦呈現；(d) 英文、法文或德文；(e) 依變項是學習者的知識習得；(f) 有足夠資料算效果量（缺的會寫信向作者要）。**沒有要求隨機分派**，摘要只說「experimental studies」。
- **篩選流程**（Fig. 1，PDF 第 7 頁）：資料庫 276 筆＋其他來源 62 筆＋未出版 3 筆 → 去重後 295 筆 → 依摘要排除 204 筆 → 91 篇讀全文 → 排除 41 篇（缺統計資訊 13、影片 13、沒有靜態對動畫的比較 7、重複量數設計 8）→ **50 篇論文、61 個實驗**。
- **資料量**：61 個組間實驗、140 個成對比較、受試者合計 7,036 人（L451–453）。
- **受試者**：**原文沒有編碼年級、年齡或地區**，也沒有任何受試者層級的描述。作者明說不納入先備知識與空間能力，理由是原始研究量法太不一致（L209–212「For this reason they have not been integrated in our study.」）。
- **量了什麼**：各研究自編的知識習得測驗，作者列出 14 種（保留、推論、近遷移、遠遷移、選擇題、理解、解題、填空、畫圖、描述性學習、自由回憶、程序、偏好、配對；L388–395），再用 Bloom 修訂版分類重新編碼成知識向度（事實、概念、程序）× 認知歷程（記憶、理解、應用、分析）。**什麼時候量（立即或延宕）原文沒有編碼**。
- **調節變項**（L372–384）：教學領域（13 類）、步調控制（四級）、有無提示（箭頭、顏色、淡出）、視覺表徵的抽象程度（圖像式 iconic vs 抽象式 abstract）、伴隨說明的感官模式（書面文字、旁白、兩組不同、沒有文字、無資料）。
- **步調控制四級的定義**（L374–375）：「system-paced (the participant has no control over the pace of the display), light (play button only), regular (play and stop buttons), and full (paced level plus rewind, fastforward buttons and multiple viewings possible)」。量的只有播放控制；作者在前言把「advanced interactivity」定義為「the possibility to interact with the content displayed」（L228–229），但**沒有把這種內容層級的互動編成變項**。
- **效果量**（L411–431）：Hedges' g，小樣本校正，正值＝動畫較好。同一研究報多個成果時，**每個成果當成獨立估計**；作者承認這會讓標準誤偏小（L420–423「the standard error for the point estimate computed across the multiple outcomes will likely be erroneously small」）。
- **離群值**（L423–426）：4 個（ChanLin 2001 的 4.62、3.47、−1.91；Yang 等 2003 的 3.59），正值改成 2.03、負值改成 −1.08。
- **編碼信度**：隨機抽 10 篇（39 個比較）重編，ICC r = 0.875（L351–353）。
- **發表偏誤**：只算 fail-safe N（L440–441）；沒有漏斗圖，也沒有 Egger 檢定。軟體是 Comprehensive Meta Analysis。

## 結果（逐項）

對照條件一律是「動畫組 vs 靜態圖組」，正值＝動畫組較好；各列是不同比較子集，屬跨研究比較。表格裡的 ᵃ ＝ p < .05，Δ ＝ 邊緣顯著（p < .06）。行號是原 `.txt` 的行號，數字以 PDF 版面為準。

### 整體（3.1–3.2，L451–473）

| # | 結果 | 數字 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 整體效果 | g = 0.226，95% CI 0.12–0.33，p < 0.001，k = 140 個比較（61 個實驗、N = 7,036） | L465–468 | 「The overall Hedges’s g effect size showed a signiﬁcant value 0.226 (p = < 0.001, 95% conﬁdence interval (CI95) 0.12–0.33). According to Cohen’s rule of thumb (1988), the overall ES has a small magnitude.」 |
| 2 | 異質性 | Q = 643.18，df = 139，p < 0.001；I² = 78.38 | L468–469 | 「The overall test for homogeneity indicated heterogeneity across samples (Q = 643.18, df = 139, p < 0.001; I2 = 78.38).」 |
| 3 | **個別比較的方向** | 140 個比較裡，動畫顯著較好 43 個（30.7%）、靜態圖顯著較好 14 個（10%）、沒有顯著差異 83 個（59.3%） | L454–456 | 「animations were superior to static graphic displays in 43 comparisons (30.7%), whereas 14 (10%) were in favor of static illustrations, and 83 (59.3%) found no signiﬁcant difference between these two format presentations.」 |
| 4 | 無差異的 83 個裡 | 13 個（15.6%）依學習者的先備知識或空間能力而有不同型態 | L456–457 | 「Within the no-signiﬁcant results, 13 comparisons (15.6%) showing distinct patterns depending on learners’ individual abilities」 |
| 5 | fail-safe N | 2,999 | L470–472 | 「a publication bias may be excluded since the fail-safe N (Rosenthal, 1979) is 2999.」 |
| 6 | 作者自己的總評 | 效果顯著但小 | L473 | 「the animation effectiveness was established as signiﬁcant, but the effect is rather small.」 |

### 依學習成果（Table 2，原檔 L526–657；PDF 第 10 頁）

| # | 結果 | g（SE）［95% CI］，k | 顯著？ |
|---|---|---|---|
| 7 | 知識向度：組間 | QB = 2.535，df = 2，p = 0.28 | 不顯著 |
| 8 | 事實知識 | 0.336ᵃ（0.104）［0.132; 0.540］，k = 32 | 顯著 |
| 9 | 概念知識 | 0.162ᵃ（0.060）［0.045; 0.279］，k = 93 | 顯著 |
| 10 | 程序知識 | 0.387（0.273）［−0.148; 0.921］，k = 15 | **不顯著** |
| 11 | 認知歷程：組間 | QB = 1.454，df = 3，p = 0.69 | 不顯著 |
| 12 | 記憶 | 0.205Δ（0.106）［−0.004; 0.414］，k = 32 | 邊緣（正文 p = 0.054） |
| 13 | 理解 | 0.198ᵃ（0.081）［0.039; 0.358］，k = 77 | 顯著 |
| 14 | 應用 | 0.333ᵃ（0.089）［0.159; 0.508］，k = 28 | 顯著 |
| 15 | 分析 | 0.219（0.390）［−0.545; 0.984］，k = 3 | 不顯著 |
| 16 | 交叉：組間 | QB = 4.288，df = 7，p = 0.74 | 不顯著 |
| 17 | 記憶事實知識 | 0.392ᵃ（0.154）［0.091; 0.694］，k = 16 | 顯著 |
| 18 | 理解事實知識 | 0.280ᵃ（0.142）［0.001; 0.559］，k = 16 | 顯著 |
| 19 | 記憶概念知識 | 0.017（0.136）［−0.249; 0.284］，k = 16 | 不顯著 |
| 20 | 理解概念知識 | 0.179Δ（0.092）［−0.001; 0.359］，k = 52 | 邊緣（正文 p = 0.052） |
| 21 | 應用概念知識 | 0.232ᵃ（0.082）［0.072; 0.392］，k = 22 | 顯著 |
| 22 | 分析概念知識 | 0.219（0.390）［−0.545; 0.984］，k = 3 | 不顯著 |
| 23 | 理解程序知識 | 0.351（0.387）［−0.407; 1.109］，k = 9 | 不顯著 |
| 24 | 應用程序知識 | 0.444（0.406）［−0.352; 1.240］，k = 6 | 不顯著 |

作者對這張表的結論（L921–923）：「none of the differences between these subgroupings reached signiﬁcance, meaning that there was no evidence that the effect of animation varies by type of requested knowledge, cognitive process or crossed dimension.」這與 Höffler 與 Leutner 2007（程序動作知識效果顯著較大）不同，作者歸因於多收了 41 個實驗、排除影片研究、以及改用 Bloom 分類（L923–941）。

### 依教材特徵與領域（Table 3，原檔 L695–901；PDF 第 11 頁）

| # | 結果 | g（SE）［95% CI］，k | 顯著？ |
|---|---|---|---|
| 25 | **步調控制：組間** | QB = 8.921，df = 3，表列 p = 0.03（正文寫 p = 0.003，見「不一致」） | 顯著 |
| 26 | 系統控制步調（學習者不能控制） | 0.309ᵃ（0.067）［0.179; 0.440］，k = 96；正文 Z = 4.637，p < 0.001 | 顯著 |
| 27 | Light（只有播放鍵） | 0.129（0.133）［−0.132; 0.390］，k = 17 | **不顯著** |
| 28 | Regular（播放與停止） | 0.061（0.129）［−0.192; 0.314］，k = 15 | **不顯著** |
| 29 | Full（加上倒帶、快轉、可重看） | **−0.120**（0.146）［−0.407; 0.166］，k = 12 | **不顯著，點估計為負** |
| 30 | 提示：組間 | QB = 0.243，df = 2，p = 0.886 | 不顯著 |
| 31 | 有提示 | 0.204Δ（0.109）［−0.010; 0.417］，k = 53 | 邊緣 |
| 32 | 沒有提示 | 0.228ᵃ（0.065）［0.101; 0.356］，k = 68 | 顯著 |
| 33 | 提示：無資料 | 0.271ᵃ（0.093）［0.088; 0.454］，k = 19 | 顯著 |
| 34 | 表徵抽象程度：組間 | QB = 6.357，df = 2，p = 0.042 | 顯著 |
| 35 | 抽象式（分析圖、公式、符號、圖表、地圖） | 0.006（0.093）［−0.176; 0.188］，k = 26 | **不顯著，幾乎為零** |
| 36 | 圖像式（示意圖、寫實圖、照片級） | 0.245ᵃ（0.068）［0.112; 0.378］，k = 91 | 顯著 |
| 37 | 表徵：無資料 | 0.365ᵃ（0.131）［0.108; 0.623］，k = 23 | 顯著 |
| 38 | 說明的感官模式：組間 | QB = 22.740，df = 4，p < 0.0001 | 顯著 |
| 39 | 書面文字 | 0.105（0.080）［−0.051; 0.262］，k = 58 | **不顯著** |
| 40 | 旁白 | 0.320ᵃ（0.084）［0.171; 0.501］，k = 28 | 顯著 |
| 41 | 兩組模式不同 | 0.157（0.126）［−0.091; 0.405］，k = 30 | 不顯著 |
| 42 | 沒有任何文字說明 | 0.886ᵃ（0.224）［0.445; 1.322］，k = 14 | 顯著 |
| 43 | 模式：無資料 | −0.115（0.104）［−0.318; 0.089］，k = 10 | 不顯著 |
| 44 | 領域：組間 | QB = 32.245，df = 12，p = 0.001 | 顯著 |
| 45 | 航空 | −0.004（0.206）［−0.409; 0.400］，k = 4 | 不顯著 |
| 46 | 天文 | 0.269（0.157）［−0.038; 0.576］，k = 4 | 不顯著 |
| 47 | 生物 | 0.202ᵃ（0.062）［0.080; 0.323］，k = 33 | 顯著 |
| 48 | 化學 | 0.773ᵃ（0.259）［0.266; 1.281］，k = 8 | 顯著 |
| 49 | 地理 | 0.232（0.658）［−1.057; 1.521］，k = 2 | 不顯著 |
| 50 | 地質 | −0.102（0.336）［−0.761; 0.558］，k = 4 | 不顯著 |
| 51 | **資訊（informatics）** | 0.108（0.123）［−0.133; 0.349］，k = 13 | **不顯著** |
| 52 | **數學** | −0.067（0.180）［−0.420; 0.286］，k = 11 | **不顯著** |
| 53 | 機械 | −0.106（表列 SE 0.014）［−0.339; 0.127］，k = 22 | 不顯著 |
| 54 | 氣象 | 0.312（0.209）［−0.098; 0.722］，k = 9 | 不顯著 |
| 55 | 自然科學 | 1.260ᵃ（0.284）［0.703; 1.817］，k = 8 | 顯著 |
| 56 | 其他 | 0.134（0.270）［−0.394; 0.663］，k = 8 | 不顯著 |
| 57 | 物理 | 0.431（0.269）［−0.096; 0.958］，k = 14 | 不顯著 |

原文對步調控制的兩句話：
- 結果段 L659–661：「The effect size when learning is system-paced, that is to say when learners had no control over the pace of the display, was statistically different from zero (g = 0.309, Z = 4.637, p < 0.001), and was associated with a medium effect size. The effect sizes of the three other pacing control modalities (light, regular and full) were not signiﬁcant.」
- 討論 L945–946：「An important but surprising ﬁnding of this meta-analysis is that the positive effect of animation over static graphics was found only for system-paced instructional material, or in other words when learners did not control the pace of the display.」作者接著說這很可能與認知風格、先備知識、學習目標、說明的模式有交互作用（L951–954），並在結論把控制程度列為未來研究方向（L1028–1029）。

原文沒有做步調四級之間的兩兩比較，只報了整體組間檢定。

### 我從附錄 Table A1 另外核對出來的事（PDF 第 14–16 頁；原文沒有這些統計，是我數的）

- **A1 的「Control presence」欄與 Table 3 的標籤對不上**。A1 這一欄的值是 None 96、Light 17、System-paced 15、Full 12（我用 `.txt` 欄位逐格計數，合計 140）；Table 3 是 System-paced 96、Light 17、Regular 15、Full 12。A1 沒有任何一格寫 Regular。從個數看，A1 的「None」應該對應 Table 3 的「System-paced」，A1 的「System-paced」（Hegarty 等 2003 三格、Höffler 2003 兩格、Nerdel 2003 四格、Schneider 2007 六格）應該對應 Table 3 的「Regular」。**這是我依個數推的，原文沒有說明**；要引步調結果的人應該知道附錄的標籤不能直接用。
- Full 那 12 個比較來自 6 篇：Baek 與 Layne 1988（0.357）、Catrambone 與 Seay 2002（−0.120、−0.049）、Nicholls 與 Merkel 1996（0.417）、Pane 等 1996（0.271、−0.083）、Schnotz 等 1999（0.892、−0.423）、Wang 等 2011（−0.460、−0.459、−0.233、−0.785）。Wang 等 2011 一篇就占 4 格而且全是負的。
- 「沒有任何文字說明」的 14 個比較裡，Kühl 等 2012 一篇占 6 格（1.236、2.019、2.108、1.265、1.419、1.883）。「自然科學」的 8 個比較是 Kühl 等 2012 那 6 格加 Lin 與 Atkinson 的 2 格（0.256、0.062）。也就是這兩個最大的子群效果（0.886 與 1.260）主要來自同一篇論文的六個成果。
- 資訊類 13 格裡有演算法動畫研究：Byrne、Catrambone、Stasko 1999 四格（0.335、−0.067、−0.313、0.107）與 Catrambone 與 Seay 2002 兩格（−0.120、−0.049）。
- Mayer 等 2005 的八格全是負的（−0.199 到 −0.955），Mayer 等 2007 四格是 −0.203、−0.123、0.310、0.700；兩篇的說明模式都編成「Different」。
- 各欄個數與 Table 3 的 k 都對得上：提示 Yes 53／No 68／無資料 19；表徵 Iconic 91／Abstract 26／無資料 23；模式 Written 58／Narration 28／Different 30／No textual info 14／無資料 10；13 個領域的個數也逐一相符。
- A1 裡 Kühl 等 2012 有一格 2.108，高於作者說的離群值上限 2.03，但沒有標成離群值。

## 作者自己列的限制（4.4，L1009–1024；另有散在方法與討論的）

1. 檢索不可能窮盡；某些調節變項的比較很少，統計檢定力低（L1012–1013）。
2. 學習成果的分類很難做：各研究的「保留」「理解」底下是各式各樣的依變項；有的測驗含圖、有的只有文字，Bloom 分類處理不了這個差別（L1014–1018）。
3. 很多研究對教材的描述很少，「16.4% provided no picture at all of the material used」；所以學習成果與視覺表徵這兩類的編碼「somehow debatable, or at least not optimally suited」（L1018–1021）。
4. 子群比較的檢定力通常很低，各子群的研究數不平均（L1022–1024）。
5. 方法段：同一研究的多個成果當成獨立估計，標準誤會偏小（L420–423）。
6. 討論 4.3：作者懷疑「教學領域」本身不是有效的調節變項，因為領域和教學目標、任務、抽象程度、知識類型分不開（L1005–1007「we may doubt that the instructional domain per se is cognitively valid as a moderating variable」）。
7. 討論 4.1.1：「it could not be excluded that confounding factors might have reduced the animation effect」（L940–941）。

原文**沒有**列為限制、是我讀到的：沒有要求隨機分派；沒有編碼受試者年級與測驗時間；發表偏誤只用 fail-safe N；步調控制等調節結果都是跨研究比較，不是同一研究內操弄控制權。

## 與摘要說法不一致的地方

- **旁白**：摘要與正文寫 g = 0.336（L66、L672），Table 3 寫 0.320。
- **沒有文字說明**：摘要與正文寫 g = 0.883（L67、L672），Table 3 寫 0.886。
- **感官模式的組間檢定**：正文 QB = 22.230（L671），Table 3 是 22.740。
- **步調控制的 p 值**：正文寫 p = 0.003（L491），Table 3 寫 0.03。我用 χ²(3) = 8.921 重算是 0.030，表是對的，正文應是筆誤。
- **沒有提示**：正文寫 g = 0.198、QB = 0.463（L662–663），Table 3 寫 0.228、QB = 0.243（χ²(2) = 0.243 對應 p = 0.886，與表列 p 相符，所以表內部一致）。0.198 剛好是 Table 2「理解」那一列的值。
- **機械類的標準誤**：Table 3 寫 0.014，但信賴區間［−0.339; 0.127］換算約 0.119，表列值應是誤植。
- **篩選人數**：正文 L349–351 寫「73 articles were selected … Thirteen articles were excluded … This reduced the number of articles to 50」（73 − 13 = 60，不是 50）；Fig. 1 是 91 篇全文、排除 41 篇、剩 50 篇。兩處對不上。
- **與 Höffler 與 Leutner 2007 的差**：註腳 1（L359–361）說移除 5 篇研究（列了 Blake 1977、Kaiser 等 1985、Michas 與 Berry 2000、Spangenberg 1973、Swezey 1991）；討論 L909–911 說排除 7 篇影片研究、12 個比較。
- **程序知識的比較數**：討論 L938 說本篇收了 16 個，Table 1、Table 2 是 15 個（9 + 6）。
- **學習測驗種類**：方法 L388 說 14 種，結果 L462–463 說「from 13 to 8」。
- **摘要的取捨**：摘要只挑了三個顯著的子群（系統控制步調、旁白、沒有文字），沒寫 59.3% 的比較沒有顯著差異、10% 靜態較好，也沒寫學習者能控制步調的三級都不顯著。摘要把 0.309、0.336 稱為「substantial」，正文稱 medium；整體的 0.226 正文稱 small。

## 與清單「要撐的結論」不合的地方

清單寫的是「同上的第二份統合（＝動態對靜態平均只多一點；沒有分析互動功能）；步調由誰控制的調節結果」。

- **「平均只多一點」撐得住**：g = 0.226，作者自己說「significant, but the effect is rather small」。要連著寫的條件：只收電腦呈現的解說型動畫、排除影片、收到 2013 年底、英法德文、含未出版博士論文、I² = 78%；而且 140 個比較裡只有 30.7% 顯著偏向動畫。
- **「第二份統合」要小心算成兩份獨立證據**。Castro-Alonso 等 2019 的納入研究有一部分就是從本篇的參考文獻補來的（該篇 L364–367），兩篇的名單大量重疊（兩邊都有的例如 Adesope 與 Nesbit 2013、Mayer 等 2005 與 2007、Kalyuga 2008、Lewalter 2003、Lin 與 Atkinson 2011、Münzer 等 2009、Paik 與 Schraw 2013、Park 與 Gittelman 1992、Rieber 1991、Scheiter 等 2006、Thompson 與 Riding 1990、Wong 等 2009、Wu 與 Chiang 2013）。兩篇的整體效果都是 0.23，這不是獨立複製。兩篇的定義也不同：本篇排除影片、只收解說型；Castro-Alonso 收影片與操作程序任務，還把依序出現的靜態圖算成動態。
- **「沒有分析互動功能」對這一篇要改寫**。這一篇分析了學習者能不能控制播放（四級），沒有分析學習者能不能操弄內容。比較準確的說法是「只分析了播放控制，沒有分析操弄內容的互動」。
- **「步調由誰控制的調節結果」有，但要照實寫它是什麼**：
  - 它量的是「動畫相對於靜態圖的優勢」在不同控制程度的研究子集裡有多大，不是「有控制權 vs 沒控制權」哪個學得好。原文沒有任何一個數字是直接比較控制權的。
  - 結果是：學習者不能控制步調時動畫優勢 g = 0.309（k = 96，顯著）；能控制的三級是 0.129（k = 17）、0.061（k = 15）、−0.120（k = 12），都不顯著；組間 QB(3) = 8.921、p = 0.03。原文沒做兩兩比較。
  - 不能寫成「讓讀者控制步調會學得比較差」。能寫的是「在讀者可以自己控制播放的研究裡，看不到動畫勝過靜態圖」。原文沒有交代這些研究的靜態圖組是否也自訂步調。
  - 引用時 p 值用表的 0.03，不要用正文的 0.003；也不要引附錄 A1 的控制欄標籤（與 Table 3 對不上）。
- 清單沒提、但與這個系列直接相關的三個結果：(a) 抽象式表徵（圖表、公式、符號）的動畫優勢是 0.006、不顯著，圖像式才有 0.245；(b) 資訊類 0.108、數學 −0.067，都不顯著；(c) 搭配書面文字時動畫優勢 0.105、不顯著，搭配旁白 0.320、完全不配文字 0.886（後者多半來自一篇論文的六個成果）。本站的文章是「書面文字＋抽象圖＋資訊與數學內容」，三個條件在這篇裡都落在不顯著的那一邊；不過這些都是跨研究的子群比較，作者自己說檢定力低、領域這個變項可能無效。

## 讀取紀錄

依序讀過原檔全部 2,850 行，區間首尾相接：

| 區間 | 內容 |
|---|---|
| L1–700 | 典藏封面、首頁與摘要、第 1 節前言（1.1 動畫的教學功能、1.2 調節因素、1.3 目的與研究問題）、第 2 節方法（2.1 檢索、2.2 納入標準、2.3 編碼變項、2.4 效果量與 2.4.1 後續檢定）、第 3 節結果（3.1、3.2、3.3.1、3.3.2）、Table 1、Table 2、第 4 節討論開頭、Table 3 表頭 |
| L700–1119 | Table 3 其餘、4.1、4.1.1、4.2、4.3、4.4 限制、第 5 節結論、附錄 Table A1 第一頁的研究名單 |
| L1120–2019 | Table A1 第一、二頁各欄（g、領域、控制、模式、提示、是否收於 Höffler 與 Leutner、知識向度、認知歷程、表徵） |
| L2020–2850 | Table A1 第二頁剩餘欄、第三頁全部與表註、參考文獻（掃過，用來核對納入研究）|

對過 PDF 版面的圖表：Fig. 1（PDF 第 7 頁）、Table 1（第 9 頁）、Table 2（第 10 頁）、Table 3（第 11 頁）、Table A1 三頁（第 14、15、16 頁）。另看了 PDF 第 8、13 頁的正文版面（方法 2.4 與討論 4.3–第 5 節）。Hedges' g 的公式在 `.txt` 與 PDF 上都排得不完整（L416–418），沒有照抄。
