# 抽取紀錄：Simonsmeier、Flaig、Deiglmayr、Schalk、Schneider 2022，Educational Psychologist 57(1), 31–54

**書目**：Bianca A. Simonsmeier、Maja Flaig、Anne Deiglmayr、Lennart Schalk、Michael Schneider。Domain-specific prior knowledge and learning: A meta-analysis。*Educational Psychologist* 57(1), 31–54。線上刊出 2021-07-23（出版者頁面 `Q1/simonsmeier2022.txt` 記載）；卷期年份為 2022。DOI 10.1080/00461520.2021.1939700。作者姓名與順序對過接受稿首頁（L10–11）與出版者頁面，五人一致。

**原文檔**：`.research/raw/learning-content/q1-learner/simonsmeier2021_am.txt`（2,441 行、133,838 字元、134,166 位元組），對應 `simonsmeier2021_am.pdf`（71 頁；頁碼印成 1–18 之後重新從 1 起算到 53）。
**版本**：作者接受稿（accepted manuscript），不是刊出版。檔頭自述「The final version published by the journal might differ in small details」（L5–6）。
**讀取日期**：2026-10-14
**供哪幾篇使用**：order 12（先備知識）#1。
**刊出版與補充資料**：都沒拿到。出版者頁面要登入或購買（存檔的 `simonsmeier2022.txt` 只有摘要與購買選項；OpenAlex 標成 gold OA，實際不是）；curl、Exa、Jina reader 都被擋，Wayback 快照不是正文。OpenAlex 列的另一個位置（PsychArchives hdl 20.500.12034/642）是 2018 年研討會投影片，不是論文。補充資料 SM1（納入研究清單）、SM2（調節變項清單）、SM3（公式）、SM4（Table S1 調節分析全表）都不在接受稿 PDF 裡。**所以調節變項的結果只讀到正文的文字敘述，Table S1 的逐列數字沒有讀到。** 這一篇主文讀完，補充表未讀。

## 研究設計

- **類型**：統合分析，未預先註冊（L495–496「This meta-analysis has not been pre-registered.」）。
- **檢索**（L429–451，Figure 2）：2018 年 5 月搜 PsycINFO 與 ERIC 的題名、摘要、關鍵字。PsycINFO 限量化實證研究、非疾患受試者、英文、同儕審查期刊；ERIC 限期刊文章。另做探索式搜尋（網路搜尋引擎、AERA 與 EARLI 郵寄名單、網路貼文徵求）。
- **PRISMA 流程（Figure 2，對過 PDF 第 18 頁圖）**：PsycINFO 4,778 + ERIC 6,802；去重 1,805；篩題名摘要 **9,775** 筆，排除 8,269；尋求全文 1,506，未取得 15；評估 1,491，排除 1,067（沒有標準化效果量 810、不是領域特定先備知識 151、依變項不相關 68、其他 25、只有一個測量點 12、與其他研究同資料 1）。其他管道：郵寄名單 71、引用搜尋 29；尋求 100，未取得 2；評估 98，排除 29。最後納入 **493 篇研究**。
- **納入標準**（L455–470，三條）：(1) 有測量或實驗操弄學習者領域特定先備知識的**量**；排除操弄「喚起」而非「量」的研究、比較熟悉與不熟悉教材的研究；只收客觀量化測量，排除自評、跨領域合成分數、晶體智力、能力、成就、後設認知知識。(2) 有學習後的知識或成就測量，或兩個測量點之間的知識增益；先備測驗與結果測驗領域不同的也收；跨領域成就（例如 GPA）也收；排除自評學習成果。(3) 有足以算出標準化效果量的資訊。
- **篩選與編碼一致性**：題名摘要 100 筆抽樣，絕對一致率 83%；全文篩選三位助理對主編碼者 82%、72%、79%；效果量與調節資訊 100 筆，92%、89%、90%（L478–483、L496–501）。
- **向作者索取資料**（L694–712）：寄出 1,192 封信；71 篇研究的作者提供未發表的效果量或資料，共 1,252 個效果量。
- **樣本**（L798–807）：493 篇研究、685 個獨立樣本、126,050 人、8,776 個效果量。出版年中位數 2012，最早 1965。47 國；北美 45%、歐洲 33%、亞洲 12%、中東 4%、澳紐 4%、非洲 1%、南美 1%。前後測間隔 0 到 3,780 天，**中位數 360 天**。樣本平均年齡 7.5 個月到 42.39 歲，整體平均 **11.32 歲**（SD 6.90）。
- **三種效果量**（L208–277）：
  - rP：先備知識與後測知識的相關。作者定義為「個別差異的穩定度」，不是學習的指標。
  - rAG：先備知識與絕對增益（後測 − 前測）的相關。
  - rNG：先備知識與標準化增益（(後測 − 前測) ÷ (量尺滿分 − 前測)，Hake 1998）的相關。
  - 各自的研究數（L809–833）：rP 476 篇、7,772 個效果量（範圍 −.565 到 .995）；rAG 50 篇、307 個（−.954 到 .623）；rNG 69 篇、697 個（−.943 到 .929）。
- **效果量處理**（L714–749）：一律轉成 Pearson r；高低先備分組的研究先算 Cohen's d 再轉 r；只在原研究有報信度時才校正測量誤差；連續變項被二分的做校正；校正後超出 ±1 的做 winsorize。r+ 表示校正後的效果量。用 Cook's 值剔除離群值：rP 2 個、rAG 6 個、rNG 4 個。
- **統合方法**（L756–789）：隨機效果模型、robust variance estimation 處理同一研究多個效果量的相依（R 套件 robumeta）。每個調節變項各跑一個迴歸；自由度小於 4 的類別只報平均、不報信賴區間、不進顯著性檢定。
- **隨機對照試驗（RCT）的定義**（L812–819）：受試者隨機分到至少兩組，在學習**之前**操弄各組的先備知識量，之後所有人上同樣的學習階段。共 9 篇、45 個效果量，全部是 rP。原研究把操弄稱為 preteaching、pretraining、提供額外資訊、knowledge induction、先備知識教學。9 篇裡 2 篇以班級為單位隨機、7 篇以個人；只有 3 篇做了操弄檢核；操弄時間 5 到 180 分鐘。

## 結果（逐項）

### 主要結果（Table 2，原文檔 L866–1169；對過 `pdftotext -layout` 重抽的版面）

| # | 結果 | 數字 | 條件 | 位置 | 原文 |
|---|---|---|---|---|---|
| 1 | 先備知識與後測知識的相關（穩定度） | rP+ = .531，95% CI [.509, .552]，j = 476 篇、k = 7,772，τ² = .112，I² = 94.16 | 全部可算 rP 的研究 | RQ1；Table 2 第 1 列 | L846–850「The average correlation was rP+ = .531 (95% CI [.509, .552], see Table 2).」 |
| 2 | rP 的 95% 預測區間 | −.067 到 .848 | 同上 | RQ1 | L850–851、L1175–1176「the 95% prediction interval … was very large and ranged from -.067 to .848 … the results of future studies of knowledge stability can be predicted only with low precision.」 |
| 3 | 先備知識與絕對增益的相關 | rAG+ = −.263，95% CI [−.370, −.149]，j = 50、k = 307，τ² = .224，I² = 98.05。顯著小於零 | 全部可算 rAG 的研究 | RQ5；Table 2 | L1263–1264「the correlation was rAG+ = -.263 (95% CI [-.370, -.149]). As indicated by the confidence interval, this correlation was statistically significantly different from zero.」 |
| 4 | 先備知識與標準化增益的相關 | rNG+ = −.059，95% CI [−.150, .034]，j = 69、k = 697，τ² = .120，I² = 96.94（內文寫 96.93）。**與零無顯著差異** | 全部可算 rNG 的研究 | RQ3；Table 2 | L1206–1208「Contrary to Hypothesis 3, the correlation between prior knowledge and normalized knowledge gains was not significantly different from zero. … (rNG+ = -.059, 95% CI [-.150, .034])」 |
| 5 | rNG 的 95% 預測區間 | [−.688, .621] | 同上 | RQ3 | L1212–1214「without additional information on moderators, the outcomes of future studies can hardly be predicted.」 |
| 6 | rNG 的分布 | 單峰、峰在零附近；偏態 −0.230、超額峰度 0.612；平均 −.059、中位數 .010；K–S 檢定仍顯著偏離常態（p = .002） | 697 個效果量 | RQ2；Figure 4（對過 PDF 圖） | L1190–1195 |
| 7 | 只取三種效果量都能算的 28 篇 | rP+ = .632 [.517, .724]；rAG+ = −.277 [−.452, −.081]；rNG+ = .001 [−.215, .217]；各 k = 238 | 同一批研究、同樣本、同測量 | Table 2 第 2 列 | L1271–1276「led to mean effect sizes of rNG+ = .001 for normalized knowledge gains and rAG+ = -.277 for absolute knowledge gains」 |
| 8 | rP 對 rNG 的差 | t(482) = 13.80，p < .000，d = 1.26；28 篇子集 t(26) = 5.74，d = 2.25 | 跨效果量類型比較 | RQ4 | L1222–1231 |
| 9 | rP 對 rAG 的差 | t(482) = 12.70，d = 1.16；28 篇子集 t(26) = 6.91，d = 2.71 | 同上 | RQ4 | 同上 |
| 10 | rP 與 rNG 在研究間的相關 | r = .216，p = .001（238 對，Fisher Z 轉換後） | 同研究同樣本的成對效果量 | RQ4；Figure 5a | L1238–1243 |
| 11 | rP 與 rAG 在研究間的相關 | r = −.051，p = .435 | 同上 | RQ4；Figure 5b | L1244–1245 |
| 12 | rAG 小於 rNG | t(89) = 2.74，p = .016，d = 0.58；28 篇子集 t(26) = 3.92，p = .016，d = 1.54 | 絕對增益對標準化增益 | RQ5 | L1270–1278「rAG+ is more distorted by ceiling effects than rNG+」 |
| 13 | RCT 的 rP | rP+ = .394，95% CI [.132, .605]，j = 9、k = 45，I² = 91.94（τ² 欄印成「293」，疑漏小數點） | 9 篇隨機實驗：實驗操弄先備知識量 → 後測知識 | RQ1；Table 2「Randomized controlled trial: Yes」 | L1177–1179「These studies found evidence for a causal effect of prior knowledge on posttest knowledge, as evidenced by the significant positive effect size of rP+ = .394.」 |
| 14 | 非 RCT 的 rP | rP+ = .533 [.512, .554]，j = 467、k = 7,727 | 其他設計 | Table 2 | — |
| 15 | RCT 與非 RCT 的差 | 不顯著，R² = .001，p = .269 | — | RQ1 | L1179–1182 |
| 16 | RCT 有沒有增益資料 | **沒有**。rAG、rNG 的研究裡沒有任何一篇是 RCT（Table 2 該列 j = 0、k = 0） | — | L831–832 | 「None of these studies was an RCT.」 |
| 17 | 控制智力前後的 rP | 前 .515 [.475, .553]、後 .479 [.433, .523]，j = 45、k = 1,898；下降不顯著（z = 0.219，p = .413） | 45 篇可算偏相關的研究 | RQ1；Table 2 | L1182–1186 |
| 18 | 出版偏誤 | 漏斗圖與 Egger 迴歸在六種情況都沒有顯示小效果量偏少；已發表與未發表效果量無顯著差異 | — | L834–842 | 「No evidence for a publication bias … was found in our database.」（Figure 3 的圖我沒有逐張看，數字見 SM4，未讀到） |
| 19 | rNG 的大小分布 | 37% 的效果量落在 −.10 到 .10 之間；只有 6% 小於 −.50 或大於 .50 | 697 個 rNG | Discussion | L1649–1652 |

### 調節變項（正文敘述，L1279–1362；逐列數字在 Table S1，未讀到）

作者明寫調節分析是探索性的（L1280、L1577）。

| # | 結果 | 數字 | 位置 | 原文 |
|---|---|---|---|---|
| 20 | 整體判讀 | 除了「書面教學」以外，rNG+ 在所有知識類型、領域、國家等都接近零 | L1287–1293 | 「the correlation rNG+ between prior knowledge and knowledge gains was close to zero for all investigated knowledge types, content domains, countries, etc., except for written instruction.」 |
| 21 | 學習階段含書面教學 vs 不含 | 含：rNG+ = .219（顯著大於零）；不含：rNG+ = −.194（只是描述上小於零，不顯著）。調節效果顯著，R² = .207 | L1339–1344 | 「thus indicating a Matthew effect for written instruction, whereas the negative correlation was only descriptively smaller than zero.」 |
| 22 | 介入的認知要求高 vs 低 | 調節 rNG 顯著，R² = .138。描述上高要求 rNG > 0、低要求 rNG < 0，但**兩者各自都沒有顯著異於零**，只是彼此顯著不同。數值正文沒給 | L1330–1335 | 「However, both correlations barely missed the threshold for differing statistically significantly from zero, even though they differed statistically significantly from each other.」 |
| 23 | 認知要求對 rP | 高要求的穩定度顯著較高，R² = .073 | L1335–1336 | — |
| 24 | 認知要求怎麼編碼 | 只有當同一研究有兩個認知要求不同的實驗條件時才編（高／低） | Table 1，L594–603 | 「Whenever studies employed two different experimental conditions differing in their cognitive demands, we coded the demands of the intervention as higher or lower.」 |
| 25 | 先備與後測的相似度 | 調節 rP：知識類型、內容領域、功能脈絡、社會脈絡、模態的相似度有調節，物理與時間脈絡沒有；七個向度一起進迴歸 R² = .055。對 rNG 只能檢驗時間脈絡，無關 | L1300–1308 | — |
| 26 | 知識類型 | 調節 rP（R² = .025），不調節 rNG。陳述性知識的 rP 較低（.522） | L1309–1312 | — |
| 27 | 內容領域 | 調節 rP（R² = .040），不調節 rNG。rP 最低（< .50）：化學、地球科學、物理；最高（> .60）：「其他」、醫護、數學。大領域（STEM 等）無調節 | L1312–1316 | — |
| 28 | 年齡 | rP 與增益相關都與年齡無關 | L1318–1319 | — |
| 29 | 教育階段 | 調節 rP（R² = .044），不調節 rNG。最低（< .50）：托育、幼兒園、高等教育；最高（> .58）：繼續教育、混合、小學 | L1319–1323 | — |
| 30 | 教學方法 | 含小型建構活動、科技或回饋的介入，rP 顯著較高 | L1337–1339 | — |
| 31 | 國家 | 研究數超過 5 的國家裡香港穩定度最低（.398），加拿大、中國、台灣、德國、荷蘭、美國顯著較高（.407 到 .762） | L1345–1348 | — |
| 32 | 方法學特徵 | 已發表與未發表無差；rP（非 rNG）隨前後測題數增加、前後測用同一份測驗時較高（R² = .073）；群體差異或個別差異設計、作答格式、是否保留測驗、知識或成就、單一或多領域都無關 | L1350–1362 | — |
| 33 | 知識對成就的 rP | rP+ = .454（先備知識對學習後的**成就**） | Implications | L1881–1882 |

### 正確與錯誤知識（Table 3，L1399–1518；對過版面）

| # | 測量組合 | j | k | rP+ | 95% CI | 位置 |
|---|---|---|---|---|---|---|
| 34 | 全部 | 453 | 7,602 | .515 | [.493, .538] | Table 3 |
| 35 | 正確先備 → 正確後測 | 450 | 7,315 | .533 | [.512, .553] | Table 3 |
| 36 | 正確先備 → 錯誤後測 | 20 | 160 | −.438 | [−.551, −.310] | Table 3 |
| 37 | 錯誤先備 → 正確後測 | 14 | 74 | −.472 | [−.552, −.385] | Table 3 |
| 38 | 錯誤先備 → 錯誤後測 | 12 | 53 | .571 | [.475, .653] | Table 3 |

- 正確性解釋的變異 R² = .235；取絕對值後四類仍有差（R² = .006，p = .041），同類預測同類的較高（L1380–1392）。
- 作者提醒（L1366–1370）：「of the 8,489 effect sizes in the meta-analysis, only 287 (i.e., 3%) were from studies in which incorrect knowledge was measured at pretest and/or at posttest, and none of these studies reported the correlation rNG or rAG」。錯誤知識的結果全是 rP，沒有增益資料。

## 作者自己的解釋與保留

1. **rP 高不等於先備知識幫助學習**（L209–220）：「if nobody learned anything between pretest and posttest, the learners' rank order would not change and the correlation rP would also be high and positive. … the correlation rP can be strong and positive even in cases where prior knowledge is completely unrelated to learning.」作者說把 rP 當成先備知識對學習重要的證據「is a misinterpretation」（L203–205），並點名包含自己團隊的研究（L338–342）。
2. **平均為零不能解讀成「先備知識不預測學習」**（L1632–1640）：「should not be misinterpreted as indicating that prior knowledge generally does not predict learning. This inference cannot be drawn, because the effect sizes varied strongly around their common mean. … The very broad prediction interval found in our study indicates that all is possible.」結論（L1926–1929）：「The prediction interval around the mean was so large that the mean value of zero could not be interpreted. Accordingly, statements about the effects of prior knowledge in general, such as "knowledge is power" or "prior knowledge has no effects," are inadequate.」
3. **兩個作者認為合理、但資料無法檢驗的解釋**（L1652–1655「The meta-analytic data do not allow for tests of which of these two explanations holds true.」）：
   - 多重中介假說（L1656–1678）：同一份先備知識同時經由正向路徑（引導注意、幫助編碼）與負向路徑（干擾、負遷移）作用，淨效果常互相抵消。
   - 知識門檻假說（L1694–1726）：只需要一定量的先備知識；多數受試者已在門檻之上，門檻以上的差異與學習無關。「one would teach fraction addition only to children who had passed the threshold of knowing about whole numbers」。推論：先備低於平均的人，先備知識與增益的相關應較強。**這是假說，沒有檢驗。**
4. **作者排除的七個替代解釋**（L1728–1793）：檢定力不足、雙峰分布平均、出版偏誤、知識測量信度低、增益分數信度低、天花板效應（只影響絕對增益）、量到的先備知識不相關。
5. **認知要求的解讀**（L1617–1625、L1899–1913）：高要求的教學讓高先備者受益較多、走向馬太效應；低要求（背事實、照已知程序、練例行題）走向補償效應。「Overall, the way teachers design their instruction can influence the achievement gap between their students.」對 rP 的同方向結果，作者用 expertise reversal effect 解釋（L1589–1596）。注意 #22：兩個方向各自都沒有顯著異於零。
6. **書面教材的結果沒有理論解釋**（L1624–1625）：「We know of no theory predicting that prior knowledge is more predictive of success when learning with written materials.」
7. **調節效果不要過度解讀**（L1599–1603）：「These moderation effects should not be overinterpreted, as we know of no theory predicting them, the moderators were not systematically varied within studies, and between-study differences in these moderators might be confounded」。
8. **兩種增益分數都不理想**（L265–273、L1565–1567）：標準化增益可能掩蓋差異（0%→50% 與 80%→90% 的標準化增益同為 50%，但前者絕對學到的是後者五倍），也可能對低先備者不利。作者在討論裡以標準化增益為主（L1574–1575）。
9. **KiP 兩個版本**（L1823–1840）：版本一（先備知識預測學習後的知識與成就）「fully correct」；版本二（先備知識預測學習階段的增益）「only partly true」。
10. **導言列的機制是文獻回顧，不是本研究的結果**（L146–176）：正向路徑（文中說至少六條，實際列了五條：引導注意、幫助解讀與編碼、組塊、策略知識、評估來源可信度）；負向路徑五條（錯誤概念、選擇性注意與 Einstellung、自動化造成僵化、干擾、負遷移，例如整數知識妨礙學分數）。

## 作者自己列的限制

原文沒有 Limitations 節。散在各處的：

1. 沒有預先註冊（L495–496）。
2. 沒有系統性搜尋灰色文獻（L1748–1751「we were unable to conduct a systematic literature search for grey literature for pragmatic reasons」）。
3. 增益資料的研究少得多（rNG 69 篇、rAG 50 篇，對 rP 476 篇），而且沒有任何 RCT（L827–833、L1925、L1933–1935「there is a lack of randomized and controlled intervention studies on how experimentally induced differences in prior knowledge causally affect subsequent knowledge gains」）。
4. RCT 只有 9 篇，且只有 3 篇做操弄檢核（L817–819）；作者自己說「the small number of studies investigating these questions」（L1184）。
5. 錯誤知識的效果量只占 3%，且沒有增益資料（L1366–1370、L1607–1609）。
6. 調節變項是研究間比較、彼此混淆、探索性（L1599–1603）。
7. 異質性很高，預測區間很寬（I² 94–98）。
8. 只收英文、PsycINFO 限同儕審查期刊（納入條件，作者沒當限制討論）。
9. 資料與程式碼「available upon request」，沒有公開（L770–771）。

原文沒有討論的：前後測間隔中位數 360 天、樣本平均年齡 11 歲，代表大部分資料是學童的長期追蹤，不是「讀一段教材前後」；作者沒有把這一點列為對教學設計推論的限制。

## 與摘要說法不一致的地方

1. 摘要 rP+ = **.534**（L55；刊出版摘要也是 .534）；結果與 Table 2 是 **.531**（L846、L1524）；Implications 又寫 **.525**（L1802「The effect size of rP+ = .525 found in our meta-analysis is equivalent to a Cohen's d of 1.23」）。三個數字，原文沒有說明。Table 2 的 .531 有 CI 與 k，引用時用這個。
2. 摘要寫 rNG「was low」；內文的說法是與零無顯著差異、「virtually zero」（L1532）。
3. 摘要沒有提：絕對增益是顯著負相關（−.263）；RCT 的結果；書面教學與認知要求兩個調節效果。
4. 文內其他不一致：篩選筆數內文寫 9,875（L471），Figure 2 是 9,775（4,778 + 6,802 − 1,805 = 9,775，圖對）；rNG 的 I² 表 96.94、內文 96.93；錯誤知識那段的分母寫 8,489（L1367），全文其他地方是 8,776，Table 3 的 k 是 7,602；「Tables 1 and S1」（L1364）應指 Table 2；Table 2 RCT 列 τ² 印「293」。
5. 接受稿 `.txt` 的斷行把負號吃掉兩處（L56 摘要「rNG+ = .059」、L1192「The mean of the distribution (.059)」），對過 PDF 版面，兩處都是 **−.059**。引用時不要照 `.txt` 抄。

## 與清單「要撐的結論」不合的地方

清單原句：「先備知識多的人讀完知道得多（r = .53）；先備知識不預測這次學到多少（標準化增益 r = −.06，預測區間很寬）；絕對增益是負相關；九個隨機實驗顯示先教先備知識會提高後測。」

1. **「讀完知道得多（r = .53）」**：數字對（.531）。但「讀完」不對。這個相關的前後測間隔中位數是 360 天、樣本平均 11 歲，多數是縱貫追蹤與學校教學，不是讀一篇文字。作者把它定義為個別差異的穩定度，並明說就算沒有人學到任何東西它也會很高。要寫成「先備知識多的人，學習之後的知識排名仍然在前面」。
2. **「先備知識不預測這次學到多少」**：作者明確反對這個讀法（L1632–1634）。撐得住的寫法是：平均接近零（−.059，CI 跨零），但各研究從強負到強正都有（預測區間 −.688 到 .621），所以「一般而言有沒有幫助」答不出來。另外 37% 的效果量在 ±.10 內、6% 超過 ±.50。
3. **「絕對增益是負相關」**：對（−.263，顯著）。要補作者的解釋：受天花板效應扭曲，高先備者在量尺上的進步空間較小。
4. **「九個隨機實驗顯示先教先備知識會提高後測」**：方向對（rP+ = .394，CI .132–.605）。要補：(a) 這是後測知識，不是增益，沒有任何 RCT 有增益資料；(b) 只有 3 篇做操弄檢核；(c) 與非 RCT 無顯著差異；(d) 正文沒有逐篇描述這 9 篇教了什麼、學什麼，清單在 SM1，沒讀到，所以不能說是哪種教材。
5. **清單標的「反向／無效（對『知識越多學越多』而言）」**：成立，但要連同「也不支持『先備知識不重要』」一起寫，作者兩句都否定。
6. **清單沒列、但與本系列直接相關的一項**：學習階段含書面教學時 rNG+ = .219，顯著為正（先備多的人從書面教材學到較多）；不含時 −.194（不顯著）。這是全篇唯一 rNG 顯著異於零的類別。逐列的 j、k、CI 在 Table S1，沒讀到；作者自己說沒有理論預測這個結果，且調節分析是探索性的。引用時這三點都要帶。

## 讀取紀錄

| 順序 | 行號起訖（`.txt`） | 內容 |
|---|---|---|
| 1 | L1–450 | 檔頭、作者、摘要、導言（KiP、正負向中介、三種相關的區分、絕對與標準化增益、Figure 1 說明、五個研究問題）、方法開頭（檢索） |
| 2 | L450–949 | 納入標準、篩選、編碼、Table 1（調節變項定義全表）、索取未發表資料、效果量處理、離群值、統計方法、結果開頭（研究與效果量特徵、出版偏誤、RQ1）、Table 2 前半 |
| 3 | L949–1468 | Table 2 後半、RQ1 的 RCT 與智力、RQ2–RQ5、探索性調節分析四小節、正確與錯誤知識、討論開頭、Table 3 前半 |
| 4 | L1468–1907 | Table 3 後半、討論（主要發現、調節變項、為何多數研究裡是弱預測、兩個假說、七個替代解釋）、Implications 五小節 |
| 5 | L1907–2441 | Implications 結尾、結論（到 L1935）；L1941–2441 參考文獻（掃過） |
| 對表 | `pdftotext -layout` 重抽（scratch，3,388 行） | Table 2 全表、Table 3 全表逐格對過；摘要與 L1192 的負號對過 |
| 對圖 | PDF 第 13、18、32–34 頁 | Figure 1（六種型態）、Figure 2（PRISMA，數字逐格抄）、Figure 4（分布）、Figure 5（散布圖） |

沒讀到的：Figure 3（漏斗圖）沒有看圖本身；補充資料 SM1–SM4（含 Table S1）不在檔案裡，沒有取得。
