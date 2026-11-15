# 抽取紀錄：Crossley、Heintz、Choi、Batchelor、Karimi、Malatinszky 2023，Behavior Research Methods 55, 491–507（A large-scaled corpus for assessing text readability）

合法公開來源：https://pmc.ncbi.nlm.nih.gov/articles/PMC10027808/ （PMC，2026-10-14 核對）。原文檔就是 Europe PMC 的全文 XML 轉出，來源本身合法，沒有重抓比對。

原文檔：`/Users/vincent/Work/study/quidproquo/.work/teaching-text-research/seq/crossley2023.txt`（共 530 行、81,450 位元組；PMC XML 轉出，每行很長）
讀取日期：2026-10-14

還原說明：表格以「 | 」分隔，Table 1–3 都完整。內文裡的文獻年份全部被轉檔吃掉（例如「(Flesch, )」），引用哪一年的版本在這個檔裡看不到。Fig. 1–4 只有圖說；**Fig. 2 是各公式與 CLEAR 分數的相關矩陣，個別公式的相關係數只在圖上**，正文只給了 CAREC 的 .580、「除 ARI 外都 > .500」與「23–34%」三個說法，其他公式各自的數字這個檔讀不到。Equation 1（Bradley–Terry 模型）也沒有轉出來（第 160–161 行）。

## 研究設計

- **研究類型**：語料庫建置論文，附兩個信度檢查研究。沒有實驗操弄，沒有量學生的閱讀理解。資料與程式公開，分析沒有預先註冊（第 442–444 行）。
- **目的**（第 25–32 行）：介紹開源的 CommonLit Ease of Readability（CLEAR）語料庫，供後續開發與測試可讀性公式。CommonLit 是非營利教育科技組織，與 Georgia State University 合作。
- **「可讀性」的定義與本研究的範圍**（第 34–38 行）：「Text readability can be defined as the ease with which a text can be read (i.e., processed) and understood in terms of the linguistic features found in that text」。「Text comprehension is also a function of a reader's reading proficiency and background knowledge of the text (McNamara et al., ). However, for the purpose of this study, we will focus only on text features.」

### Study 1：語料怎麼建

- **來源**（第 107–112 行）：CommonLit 的閱讀樣本資料庫、Project Gutenberg、Wikipedia 與數十個開放數位圖書館。人工從文本的開頭、中段、結尾選節錄，每份文本只取一段。
- **長度**：選取時設定 140–200 個英文字，起訖都在意念單位的邊界（第 108–109 行）。最後語料的實際統計（Table 1，第 172–176 行）：

| 變項 | 平均 | 標準差 | 最小 | 最大 |
|---|---|---|---|---|
| 字數 | 178.51 | 18.46 | 135 | 228 |
| 句數 | 9.57 | 4.64 | 2 | 41 |
| 段數 | 2.54 | 1.87 | 1 | 20 |

- **年代**：1791–2020 年；多數節錄落在 1875–1922 年（版權到期）與 2000–2020 年（第 109–111 行）。平均出版年 1937.89（SD 60.51）（第 165 行）。
- **文類**：依 PARCC 選文準則分 informational（非小說、歷史／社會科學、科學／技術、數位文本）與 literary（詩、戲劇、小說、多媒體文本）（第 113–115 行）。
- **篩選**（第 115–121 行）：初始約 7,600 篇；每段至少由兩位 CommonLit 教材開發人員判斷，兩個主要標準是「the likelihood of being used in a 3rd–12th grade classroom」與題材是否合適（用 MPAA 分級）；另以自動搜尋找創傷相關詞；單一作者最多 12 段。篩完剩 4,793 段，再做文字校訂與拼字現代化。
- **評分者**（第 123–125、140–153 行）：以電子郵件從 CommonLit 的教師名單招募約 1,800 位教師；1,198 位完成；刪去作答型態異常（左右某一側選超過 70%、連續 20 次以上左右交替）與太快（平均每題少於 10 秒或中位數少於 5 秒）的人，剩 **1,116 位**。每人酬勞是 50 美元的 Amazon 禮品卡。平均 40.87 歲（SD 10.23）；女性 970、男性 145、其他 1；771 位有研究所學歷；英語母語者 1,080 位、非母語 36 位。
- **評分作業**（第 126–137 行）：線上並排顯示兩段節錄，「ask participants to judge which of the two texts would be easier for a student to understand」；每人 100 對；配對與左右位置隨機；每 20 對強制休息至少一分鐘。
- **為什麼用兩兩比較**（第 128–130 行）：「collecting text comparisons is less resource intensive than collecting reading criteria through direct assessment (e.g., cloze tests, multiple choice tests, text summarizations…)」。
- **效標分數**（第 155–163 行）：用 Bradley–Terry 模型把 111,347 個比較轉成每段一個連續係數（約 −3.5 到 1.5），「The coefficients were not scaled to grade level.」刪去 52 段係數離群（原文寫「a coefficient with a standard deviation greater than 2.5」）與 17 段標準誤大於 0.65 的，最後 **4,724 段**。
- **最終語料**（第 165–169 行）：informative 2,304、literary 2,420；平均 Flesch–Kincaid 年級 9.51（SD 4.33）；取自中段 3,470、開頭 1,024、結尾 108、整篇 122；G 級 3,706、PG 928、PG-13 87、R 3。
- **每段被讀的次數**（第 146–147 行）：「each excerpt was read 46.47 times (SD = 6.63) and participants spent an average of 101.36 s per judgment」。
- **Study 1 的統計**（第 208–211 行）：折半信度、文類的 t 檢定、與出版年的 Pearson 相關。

### Study 2：效標與公式

- **目的**（第 250–254 行）：「Our goal is to demonstrate that the human ratings of reading ease are partially a function of language features in the texts, thus providing reliability to the ratings.」也就是用公式來檢驗教師評分的信度，不是用教師評分來檢驗公式。
- **比較的七個現成公式**（第 256–275 行，用 ARTE 1.1 計算）：Flesch Reading Ease、Flesch–Kincaid Grade Level、Automated Readability Index（ARI）、SMOG、New Dale–Chall（以上五個是傳統公式）；CAREC（用 600 篇文本、800 多位群眾外包參與者的判斷建立，含詞彙、句法、銜接特徵）、CML2RI（Coh-Metrix L2 Readability Index）。
- **自建模型**（第 330–344 行）：從 SALAT 的 799 個 NLP 特徵開始；刪零值比例高於 20% 的 398 個，剩 401；刪共線（r > .699 取與效標相關較高者）與和效標相關不到 .099 的，共刪 294 個，剩 107；逐步選取、十折交叉驗證的線性模型；報告 RMSE、MAE、R²；相對重要性用 lmg。
- **註 1**（第 440–441 行）：「K-fold cross-validation without nested loops may lead to overfitted models that do not generalize outside of the dataset on which they are trained. However, since our interest is understanding links between the linguistic features and text readability and not generalizability, we did not use nested cross-validation.」

## 結果（逐項）

| # | 結果 | 數字 | 對照條件 | 節／表 | 行號 | 原文一句 |
|---|---|---|---|---|---|---|
| 1 | 折半信度：全資料分數對兩個半份 | r ≈ .85 | 兩半各 55,673 與 55,674 個比較，每段平均被讀 23 次 | Study 1 Results | 215–220 | 「The results show strong associations between the full model scores and the two splits (r = ~.85).」 |
| 2 | 折半信度：兩個半份彼此 | r = .63 | — | 同上 | 220 | 「The two splits also reported strong correlations with one another, although weaker than with the full model (r = .63).」 |
| 3 | 文類差異 | informational M = −1.27（SD 1.06）；literature M = −0.663（SD 0.914）；t(4723) = −20.95，p < .001，d = −0.43 | 兩種文類的 Bradley–Terry 係數（分數越高越容易） | 同上 | 224–226 | 「The t test supported the hypothesis… with a medium effect size (d = – 0.43…)」 |
| 4 | 與出版年的相關 | r(4715) = .206，p < .001；9 段找不到出版年 | — | 同上 | 229–230 | 「more recent passages were often rated as easier to read than older passages」 |
| 5 | 七個公式與 CLEAR 分數的相關：整體描述 | 「strong overlap」；最強是 CAREC，最弱是 ARI | CLEAR 分數（教師判斷） | Study 2 Results | 348–349 | 「The strongest correlations were reported for CAREC while the weakest correlations were reported for the Automated Readability Index.」 |
| 6 | 公式解釋的變異 | 約 23–34% | 同上 | Study 2 Results | 349–350 | 「While strong, the correlations indicate that the readability formulas only predict around 23–34% of the variance in the reading ease scores.」 |
| 7 | 討論段的同一件事 | r > .500（ARI 除外）；CAREC r = .580；23–34% 由 R² 而來 | 同上 | Study 2 Discussion | 402–404 | 「both traditional and newly developed readability formulas showed strong relationships (r > .500, Cohen, ) with the CLEAR scores (except for the ARI scores). The strongest correlations were reported with CAREC (r = .580), the most advanced readability formula we sampled. In total, the results indicate that existing readability formulas are predictive of the CLEAR scores, but only explain about 23–34% of the variance (as derived from R2 scores).」 |
| 8 | 半份資料與公式的相關 | 較低但中等，型態相同；數字原文沒有給 | — | Study 2 Results | 350–351 | 「Lower, but moderate correlations, were reported between the data splits and the readability formulas.」 |
| 9 | 公式之間高度共線 | Flesch Reading Ease、FKGL、ARI、New Dale–Chall | — | 同上 | 351–352 | 「many of the readability formulas were highly multicollinear」 |
| 10 | 自建線性模型 | 28 個變項；RMSE = .726、MAE = .575、r = .712、R² = .507；F(28, 4695) = 176.90，p < .001 | CLEAR 分數；同一份語料的十折交叉驗證 | Linear model of readability | 354–355 | 「The linear model reported RMSE = .726, MAE = .575, r = .712, R2 = .507」 |
| 11 | 最強的預測變項類別 | 與字詞解碼有關（常見、具體、較早學到、聯想較多的詞）；句法（名詞片語層次較複雜則較難）；與文學文本有關的詞（時空、社會關係、角色、目標）與正向情感詞；局部銜接 | — | 同上 | 355–361 | 「the strongest predictors of reading ease were related to ease of word decoding leading to greater readability」 |

### Table 3：預測 CLEAR 分數的線性模型（第 362–393 行；CW＝實詞、FW＝功能詞）

| 變項 | 工具 | 相對重要性 | 估計值 | SE | t | p |
|---|---|---|---|---|---|---|
| (Intercept) | | | −0.958 | 0.011 | −91.016 | < 0.001 |
| Word range: SUBTLEXus, CW logged | TAALES | 0.169 | 0.345 | 0.024 | 14.106 | < 0.001 |
| Attested constructions: COCA fiction, lemmas | TAASSC | 0.080 | 0.085 | 0.017 | 4.892 | < 0.001 |
| Word naming speed: standard deviation, CW | TAALES | 0.075 | −0.026 | 0.015 | −1.742 | < 0.100 |
| Word concreteness: Brysbaert, CW | TAALES | 0.072 | 0.042 | 0.018 | 2.384 | < 0.050 |
| Word age of exposure: LDA | TAALES | 0.071 | −0.050 | 0.015 | −3.335 | < 0.001 |
| Lexical decision accuracy | TAALES | 0.051 | 0.107 | 0.012 | 8.812 | < 0.001 |
| Positive words | SEANCE | 0.048 | 0.033 | 0.015 | 2.253 | < 0.050 |
| Nominal subject per clause | TAASSC | 0.040 | 0.034 | 0.013 | 2.685 | < 0.001 |
| Word imageability: MRC | TAALES | 0.036 | 0.122 | 0.021 | 5.909 | < 0.001 |
| Number of word types | TAALED | 0.033 | −0.117 | 0.012 | −9.726 | < 0.001 |
| Semantic variability: D | TAALES | 0.031 | −0.168 | 0.017 | −9.975 | < 0.001 |
| Word association strength: LSA average top 3 cosine | TAALES | 0.029 | 0.056 | 0.014 | 3.962 | < 0.001 |
| Argument overlap: Adjacent sentences | TAACO | 0.028 | 0.040 | 0.012 | 3.315 | < 0.001 |
| Attested constructions: COCA news | TAASSC | 0.027 | 0.026 | 0.015 | 1.766 | < 0.100 |
| Word range: SUBTLEXus, FW | TAALES | 0.024 | 0.051 | 0.013 | 4.084 | < 0.001 |
| Words related to social relations | SEANCE | 0.022 | 0.040 | 0.012 | 3.396 | < 0.001 |
| State words | SEANCE | 0.020 | 0.069 | 0.014 | 4.826 | < 0.001 |
| Collexeme ratio: COCA fiction | TAASSC | 0.019 | 0.027 | 0.013 | 2.183 | < 0.050 |
| Word association strength: USF, FW | TAALES | 0.018 | 0.031 | 0.012 | 2.676 | < 0.010 |
| Words related to goals | SEANCE | 0.018 | 0.044 | 0.011 | 3.841 | < 0.001 |
| Number of noun phrase dependents | TAALES | 0.015 | −0.025 | 0.011 | −2.255 | < 0.050 |
| Phonographic neighbors | TAALES | 0.014 | −0.036 | 0.014 | −2.664 | < 0.001 |
| Orthographic neighbors | TAALES | 0.013 | −0.024 | 0.014 | −1.769 | < 0.100 |
| Words related to space and time | SEANCE | 0.011 | 0.058 | 0.013 | 4.457 | < 0.001 |
| Temporal connectives | TAACO | 0.010 | 0.022 | 0.012 | 1.884 | < 0.100 |
| Words related to roles | SEANCE | 0.010 | 0.021 | 0.012 | 1.74 | < 0.100 |
| Collexeme ratio: COCA, types | TAASSC | 0.009 | 0.029 | 0.012 | 2.392 | < 0.050 |
| Words related to anticipation | SEANCE | 0.005 | 0.023 | 0.012 | 1.993 | < 0.050 |

28 個變項裡有 5 個的 p 值欄寫的是「< 0.100」（未達 .05）。

### 原文內部對不攏的地方（照抄，不猜）

- 英語母語者：第 149–150 行寫 1,080 位母語者、36 位非母語者（約 96.8%）；第 151–152 行又寫「Most of the participants (over 99.9%) were self-reported native speakers of English」。
- 閱讀與寫作的信心與喜好：第 150–151 行是閱讀信心 5.59、寫作信心 5.08、閱讀喜好 4.62、寫作喜好 3.79，量尺 1–6；第 151–153 行又寫信心 5.06 與 5.54、喜好 4.59 與 3.80，其中喜好的量尺寫成 1–5。兩段像是同一件事的兩個版本。
- 招募人數：第 123、140 行「~ 1800」；致謝第 437–438 行「nearly 2000 teacher participants」。
- 摘要與結論寫「~ 5000 text excerpts」，內文的確切數字是 4,724。
- 第 162 行「a coefficient with a standard deviation greater than 2.5」字面意思不清楚（單一係數沒有標準差），照抄。

## 作者自己的解釋與保留

- **對傳統公式的批評（都在導言，是文獻回顧，不是本研究的結果）**：
  - 第 20–22 行：「Traditional readability formulas lack construct and theoretical validity because they are based on weak proxies of word decoding (i.e., characters or syllables per word) and syntactic complexity (i.e., number or words per sentence) and ignore many text features that are important components of reading models including text cohesion and semantics.」
  - 第 22–23 行：多數傳統公式用特定年齡的讀者、特定領域的小語料定出來。
  - 第 61–66 行：只靠統計相關、缺理論；忽略文本銜接、風格、詞彙與文法；當年的效標多是選擇題與克漏字，「two methods that may not measure text comprehension accurately」。
  - 第 67–71 行：「Above all, the generalizability of most traditional readability formulas is suspect」。Flesch Reading Ease 與 Dale–Chall 用 1920 年代寫給三到十二年級學生的 350 篇文本定出來。「Another example is the Flesch Kincaid Grade Level formula, which was developed from only 18 passages taken from Navy training manuals, and its readability criterion was collected from roughly 600 navel enlistees.」
  - 第 428–429 行再說一次：「The best example of this is Flesch–Kincaid Grade Level, which was developed using reading tests administered to adult sailors.」
- **對商業公式的批評**（第 23–24、76–80 行）：不公開、可能沒有嚴格檢驗信度、對學校太貴；演算法與資料庫無法複製或測試。
- **但作者也轉述：傳統特徵仍是強預測變項**（第 91–94 行）：「François and Miltsakaki () report that while classic linguistic found in traditional readability formulas are strong predictors of readability, they are not better predictors than more advanced NLP features… However, Francois and Miltsakaki reported the strongest performance for readability models that included both classic and advanced NLP features.」
- **作者怎麼解讀「23–34%」**：他們把公式與教師評分的相關稱為「strong」，並當成教師評分有信度的證據（第 397–398 行：「Strong associations would indicate that the text features that inform existing readability formulas are also predictive of the human ease of readability scores.」）；同時指出公式「only explain about 23–34% of the variance」，而且公式不告訴你是哪些語言特徵在影響評分（第 404–405 行）。原文沒有據此說傳統公式不該用，也沒有比較傳統公式與新式公式哪一類較好（只說最強的是 CAREC、最弱的是 ARI）。
- **折半相關不完美的解釋**（第 244–246 行）：「Correlations were not perfect, of course, which is to be expected especially considering that Bradley–Terry models are stronger when there are more judgments per items.」
- **對自己效標的保留**（第 429–432 行）：「We bypass these concerns, to a degree, by collecting judgments from schoolteachers about how difficult the excerpts would be for their students to read. This provides greater face validity for our readability criteria… However, caution is warranted in that human judgments of readability are subjective and likely contain error as well.」
- **作者認為教師判斷反映學生理解**（第 240–241 行）：「Our raters, all trained teachers, were also asked to judge text readability based on student understanding of the texts, helping to ensure that the judgments reflected student text comprehension.」這是作者的主張；研究裡沒有學生的理解資料。

## 作者列的限制

這篇沒有獨立的 Limitations 節。散在各處的：

1. 效標是人的主觀判斷，可能有誤差（第 431–432 行）。
2. 自建模型沒有用巢狀交叉驗證，可能過度配適、無法推廣到訓練資料以外（註 1，第 440–441 行）。
3. 只處理文本特徵，不處理讀者的閱讀能力與背景知識（第 37–38 行）。
4. Bradley–Terry 係數沒有對應到年級（第 161–162 行）。
5. 分析沒有預先註冊（第 444 行）。
6. 兩兩比較比直接施測省資源，作者以此為選擇理由（第 129–130 行）；換句話說沒有做直接施測。原文沒有把這一點稱為限制。

## 與摘要不一致的地方

逐項對過，沒有矛盾。摘要只談語料庫本身與「reliability metrics for the human ratings」，完全沒有提 Study 2 的數字（公式解釋 23–34%、自建模型 50.7%）。摘要的「~ 5000」對內文的 4,724。

## 與現有文章稿不一致的地方

只有第 2 篇引用。行號是 2026-10-14 讀到的版本。

1. **第 32 行**（結論表）：「用可讀性分數把關｜公式只能解釋教師難度判斷的四分之一到三分之一｜不建議當門檻」
   → 「四分之一到三分之一」對應 23–34%（第 349–350、404 行），**數字相符**。「不建議當門檻」是稿子的判定，原文沒有這個建議；原文把這些相關稱為 strong，並用來支持教師評分的信度。建議在表裡或正文標明這是稿子的判斷。
2. **第 84 行**：「Flesch–Kincaid 這類公式用每句幾個字、每字幾個音節來估文章難度。」
   → **相符**（第 58–59、261–264 行；原文在一處寫 characters per word、另一處寫 syllables per word）。
3. **第 84 行**：「Scott Crossley 等人 2023 年的研究請一千多位教師兩兩比較約五千段課文的難度，再拿各種公式去預測。」
   → 1,116 位教師、4,724 段（第 144、163 行），**相符**。兩點補充：(a) 教師被問的是「哪一段對學生比較容易懂」，不是泛泛的難度；(b)「課文」不完全準確，節錄來自 CommonLit、Project Gutenberg、Wikipedia 與其他開放圖書館，篩選標準是「可能被用在三到十二年級課堂」（第 107、115–117 行）。**漏掉一個和稿子主題直接相關的事實：每段只有 140–200 字（平均 178.5 字、約 9.6 句）**（第 108、172–176 行）。稿子兩篇都在提醒「材料很短」，這份的材料是所有來源裡最短的，卻沒有寫。
4. **第 84 行**：「傳統公式和新式公式都有相關，但只解釋了 23% 到 34% 的變異。」
   → **相符**（第 402–404 行）。可補：除了 ARI，相關都在 .50 以上，最高是 CAREC 的 .58；作者稱之為 strong。稿子的語氣（「只」）和原文那一句的「only」一致，但原文的整體用途是拿它證明教師評分可信。
   → **漏掉效標本身的雜訊**：兩個半份資料算出的分數彼此相關只有 .63（第 220 行），作者也說人的判斷「subjective and likely contain error」（第 431–432 行）。也就是公式沒解釋到的 66–77% 裡，有一部分是教師評分自己的不穩定。原文沒有做信度校正，也沒有說比例；稿子只需照實補一句「效標本身的折半相關是 .63」。
5. **第 84 行**：「同一篇也提到 Flesch–Kincaid 當年是用 18 段海軍訓練手冊定出來的。」
   → **相符**（第 69–70 行）；原文還寫效標來自約 600 位海軍士兵。這是導言的文獻回顧。
6. **第 86 行**：「這份研究的效標是教師的判斷，文本是英文的中小學讀物。」
   → **相符**（三到十二年級；第 116、233 行）。
7. **第 86 行**：「我沒有找到『依公式改寫之後讀者理解有沒有變好』的綜整，也沒有讀到中文技術文章的對應研究。」
   → 這是稿子作者的搜尋結果，原文無從核對。原文確實沒有測改寫。
8. **第 86 行**：「合理的用法是拿公式抓出特別長的句子，不拿分數當過不過關的門檻。」
   → **原文沒有這個說法**，也沒有檢驗句長單獨的預測力（自建模型的 28 個變項裡沒有句長，最重要的是詞頻範圍等字詞層次的特徵，Table 3）。這是稿子的推論，沒有標，也不在第 216 行的推論清單裡。建議標成「我的判斷」，或改寫成原文支持的說法（例如：最能預測教師判斷的是用字是否常見、具體，而不是句子長短）。
9. **第 9 行 tldr 與第 36 行結論表**：「可讀性分數、Bloom 動詞表、Diátaxis 分類都沒有對照實驗支持。」
   → 審稿報告 M4 已指出：這份來源是相關研究，確立的是「公式解釋教師判斷的 23–34%」，不是「沒有對照實驗支持」。我讀完全文後同意 M4；原文完全沒有談以公式把關的實驗證據有或沒有。
10. **第 212 行**（限制）：「可讀性研究的效標是教師的判斷，不是讀者實測的理解成績；文本是英文的中小學讀物。」
    → **相符**（第 126–130 行）。
11. **第 233 行**（附錄）：「約 5,000 段三到十二年級的英文課文，1,116 位教師評比，每段平均被讀 45 次以上。」
    → 確切數字 4,724 段、46.47 次（第 146、163 行；「over 45 times」見第 241 行），**相符**。
12. **第 233 行**：「現有公式與教師評分的相關多在 0.50 以上，最高 0.58。」
    → **相符**（第 402–403 行）。
13. **第 233 行**：「作者自己建的 28 個變項模型解釋 50.7%。」
    → **相符**（R² = .507，第 355 行）。**漏掉註 1**：這個模型沒有用巢狀交叉驗證，作者自己說可能過度配適、不能推廣（第 440–441 行）。50.7% 和現成公式的 23–34% 不是同一個基準上的比較：現成公式是拿來直接套，自建模型是在同一份語料上配出來的。建議補「在同一份語料上配適，作者註明可能過度配適」。
14. **第 257 行**（參考資料）：「讀了導言、公式相關的結果與討論。」
    → 讀取範圍自述沒有包含 Study 1 的方法（每段 140–200 字、折半信度 .63）、註腳（過度配適）與結論段（人的判斷有誤差）。上面第 3、4、13 條漏掉的內容正好在這幾處。
15. **審稿報告**：把 Crossley 2023 列在「數字核對相符」（報告第 209 行），數字部分我同意；M4 我同意。報告沒有指出第 3 條（節錄長度）、第 4 條（效標的折半相關與作者的保留）、第 8 條（「抓長句」是沒標示的推論）、第 13 條（註 1）。

小計：需要改或補的 6 條（1、3、4、8、9、13）；相符 7 條（2、5、6、10、11、12，以及 7 無法核對但不矛盾）。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | 1–150 | 期刊資訊與授權、摘要、導言、Text readability、Traditional readability formula、NLP informed readability formulas、Current research、Study 1 方法（語料蒐集、評分者、評分者信度、最終參與者資料前半） |
| 2 | 150–339 | 評分者描述後半、Bradley–Terry 分數、最終語料、Table 1、Table 2、Study 1 統計與結果（折半、文類、年代）與討論、Study 2 導言、七個公式的說明、NLP 特徵工具（TAALES、TAALED、TAACO、TAASSC、SEANCE）、Study 2 統計分析前半 |
| 3 | 339–530 | 統計分析後半、Study 2 結果（與公式的相關、線性模型）、Table 3 全表、Study 2 討論、Conclusions、Acknowledgements、註 1、Open Practice Statement；第 447–530 行是書目，掃過 |

## 補記（2026-10-14，複審後整理）

原文檔最後一行沒有換行符號，`wc -l` 少算一行，實際 531 行。第 531 行是書目最後一筆的尾端（「frequency guide. Touchstone Applied Science Associates, Inc; 1995.」），讀取表原本只列到 530 行，這一行由文章作者補讀。
