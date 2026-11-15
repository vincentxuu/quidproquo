# 抽取紀錄：del Rio-Chanona、Laurentsyeva、Wachs 2024，Large language models reduce public knowledge sharing on online Q&A platforms（PNAS Nexus 3(9): pgae400，doi 10.1093/pnasnexus/pgae400）

- 作者全名對過首頁與 PMC 作者資訊（L3、L147–157）：R. Maria del Rio-Chanona（UCL、Cambridge Bennett Institute、Complexity Science Hub Vienna）、Nadzeya Laurentsyeva（LMU Munich）、Johannes Wachs（Corvinus University of Budapest 等，通訊作者）。編輯 Matjaz Perc。
- 收稿 2024-04-16、接受 2024-08-27、線上 2024-09-11（L14、L21）。
- **版本**：刊出版，CC BY 4.0 開放取用（L17）。
- 原文檔：`.research/raw/learning-content/q5-social/delrio-chanona2024-so.txt`（243 行、73,852 字元），PMC11421660 的 XML 轉文字（PMC 的狀態列寫 `is-manuscript no is-preprint no`，L21）。來源網址 https://pmc.ncbi.nlm.nih.gov/articles/PMC11421660/
- 對表用的 PDF：`.research/raw/learning-content/q5-social/delrio-chanona2024-so.pdf`（13 頁，出版者排版版，頁側浮水印「Downloaded from academic.oup.com … by Institute of Economics Budapest user on 25 September 2024」）。2026-10-14 這次取得，網址 https://real.mtak.hu/205789/1/pgae400.pdf （匈牙利科學院 REAL 機構典藏；Unpaywall 列為 repository）。出版者 OUP 與 PMC 的 PDF 連結用 curl 只拿到 HTML 擋頁，所以改用典藏版；文章本身 CC BY，典藏放出版者 PDF 合乎授權。
- 讀取日期：2026-10-14
- 供 order 21 使用（清單 F，21#9）
- 補充資料（Tables S1–S8、Fig. S1）**沒有取得、沒有讀**；正文引到補充表的結果下面照正文轉述並標明。

## 研究設計

- **類型**：觀察資料的準實驗分析（差異中的差異 difference-in-differences）；另加程式語言層級的事件研究，與一份橫斷面調查的邏輯迴歸。不是對學習的研究，量的是**平台上的發文量**。
- **處理組**：Stack Overflow。**對照平台四個**（L34–36）：Mathematics Stack Exchange、MathOverflow（理由：當時免費版 ChatGPT 數學差）；俄語 Stack Overflow、中文的 Segmentfault（理由：ChatGPT 在俄、中官方不提供，雖然可用 VPN）。
- **資料**（L37–39、L128–134）：Stack Exchange 資料傾印（archive.org）至 2023 年 6 月初；Segmentfault 自行爬取。Stack Overflow 5,800 萬則、俄語版逾 90 萬、Math SE 350 萬、MathOverflow 30 萬、Segmentfault 約 30 萬。分析期間 2022 年 1 月至 2023 年 5 月底：ChatGPT 發布前 48 週、後 25 週（L42）。處理起點是 2022-11-27 那一週（L42）。
- **模型**（L40–43）：log(每週發文數) 對平台固定效果、週固定效果、Stack Overflow × 發布後的交乘；標準誤以月叢聚。另跑每週係數的廣義 DiD 檢查前期趨勢；加平台特定線性趨勢；延長期間到 2019 年起（後兩者結果在補充表 S3、S4）。
- **使用者經驗分層**（L38、L46、註 a）：以發文時的既有發文數分 New（0）、Inexperienced（1–10）、Experienced（11–100）、Expert（>100）。Segmentfault 沒有使用者資料，這個分析只用三個對照平台（Table 2 標題）。
- **品質代理指標**（L78–79）：發文後 5 週的得分（讚減倒讚），正分＝good、負分＝bad、零分＝neutral。
- **程式語言異質性**（L47–48、L104–107、L132–133）：前 1,000 個標籤中能對到 GitHub 語言的 69 個；每個標籤標準化週發文數，對線性趨勢、月份季節效果、發布後截距與斜率變化迴歸，HAC 標準誤。與 GHTorrent 2021 年 6 月的 GitHub 儲存庫數比較。
- **調查**（L39、L49–50、L76–77、L134）：2023 Stack Overflow Developer Survey（2023-05-08 至 05-19，89,184 份、185 國），「過去一年固定使用哪些 AI 工具」勾 ChatGPT 與否，對自述造訪／貢獻頻率做邏輯迴歸，加大量個人控制變項。作者明說橫斷面不能解讀為因果（L50）。

## 結果（逐項）

1. **Stack Overflow 原始週發文量**（L51、Fig. 1a）：2016 到 2022 年從約每週 11 萬則逐漸降到約 6 萬則（原文寫「roughly 7,000k posts less per week each year」，「k」看起來是筆誤，圖說寫「about 7,000 posts each year」，L44）；發布後 6 個月內從約 6 萬降到 4 萬。原文：「Compared to the pre-ChatGPT trend, this decrease represents more than 5 years worth of deceleration in just half a year.」
2. **DiD 平均效果（發布後 6 個月平均）**（Table 1，p.5 已對 PDF）：
   - 全部發文 −0.163（SE 0.0584），p < .05 → 原文換算 15%（L54「decreased posting activity on Stack Overflow by 15% ( 1 − e^−0.163 )」）
   - 只算問題 −0.105（SE 0.0597），**p < .1（只到邊緣）** → 原文寫 10%（L75）
   - 只算平日 −0.151（SE 0.0613），p < .05 → 14%
   - 三欄觀察數都是 370，R²-within 0.0458、0.0189、0.0294。
3. **「25%」的出處**（L73、Fig. 2，p.6 已對 PDF）：是每週係數圖讀出來的，不是表裡的估計值。原文：「By the end of April 2023, coinciding with a peak in traffic to ChatGPT, the estimated decrease in activity stabilizes at around 25%.」Fig. 2 圖說：「Eight weeks after its introduction, we observe a steady decline」。圖上發布後最後幾週的係數約在 −0.2 到 −0.3 之間（我從圖目測，不是原文數字）。另外，發布**前**的週係數多在 0 到 +0.2 之間，有幾週的 95% 信賴區間看起來不含 0（目測）；原文只說 Fig. 1b 顯示發布前走勢相近，並以補充表做穩健性檢查，正文沒有討論 Fig. 2 的前期係數。
4. **穩健性**（L75）：換結果變項轉換（S1、S2）、加平台趨勢（S3）、延長期間（S4）結果穩健；排除俄、中兩個對照平台結果也穩健（L116）。這些都在補充表，我沒讀。
5. **作者把 25% 解讀成下限**（L28、L45、L111）：「To the extent that ChatGPT also affected activity on the counterfactual platforms, our estimates will be downward biased in the magnitude of the effect.」這是推論，不是另外估出來的。
6. **調查**（L76–77；係數在補充表 S7，沒讀）：受訪者約 75% 曾在 Stack Overflow 貢獻、42% 每天造訪（高度投入的選樣）。ChatGPT 使用者較不常貢獻與造訪；「the average marginal effect of ChatGPT on the likelihood of contributing to Stack Overflow weekly or more is about 0.8 percentage points (or 2.7% lower probability)」，作者自己寫「The magnitude of the effect is not very high」。
7. **品質（投票）沒變**（L79、Fig. 3a，p.6 已對 PDF）：壞問題比例走勢平；好問題比例短暫小升、主要替代中性問題；回答的三類比例沒變。以投票數為結果變項的 DiD「we do not detect any effect of ChatGPT」（結果在 S5、Fig. S1，沒讀）。
8. **使用者經驗分層**（Table 2，p.7 已對 PDF）：
   - New −0.0833（SE 0.0376），p < .05
   - Inexperienced −0.245（SE 0.0529），p < .001
   - Experienced −0.254（SE 0.0424），p < .001
   - Expert −0.168（SE 0.0292），p < .001
   - 觀察數各 296；R²-within 0.0259、0.198、0.235、0.104。
   - 原文說法：新使用者「decreased only slightly」，Inexperienced 與 Experienced「a reduction of about 21%」幾乎相同（L82）。發布前每週發文量：New 約 9,500、Inexperienced 近 20,000、Experienced 約 17,500、Expert 約 16,000（註 g，L144）。經驗多的人減少的主要是**回答**（S8，沒讀；L82）。
9. **程式語言**（L104–107、Fig. 4）：69 個標籤多數為負，斜率變化從每週 −0.25 SD 到 +0.03 SD；Python、JavaScript 受影響最大；CUDA 增加但不顯著。與美國開發者薪資中位數無顯著關係（Fig. 4b）。GitHub 儲存庫數越多的語言下降越多，Pearson ρ = −0.45，P < 0.001（Fig. 4c）；以 commit 數做的 DiD 在 S6（沒讀）。
10. **後續走勢**（L108–110、Fig. 5）：延伸到 2024 年春，每週發文從 2022 年 5 月的 6 萬降到 2024 年 5 月的 3 萬，下降在 2023 年 5 月後持續但較慢。作者**刻意不延伸 DiD**，因為之後對照平台也開始用得到 LLM、LLM 數學也變強，對照組不再有效（L110）。
11. **與 Burtch 等 2024 的比較**（L114）：Burtch 等用合成控制法得到 15 週內約 20% 下降；但他們發現**新使用者**發文大降，本文發現的是有經驗的人下降較多，作者說「It would be valuable for future work to resolve this ambiguity」。

## 作者自己列的限制（L115–116）

- 品質只用投票部分評估；留下來的問題可能更難，作者沒有檢驗內容複雜度。
- 重複問題約占 3%（引 Correa & Sureka 2013），作者認為不影響主結果。
- 無法觀察俄、中使用者實際被擋到什麼程度（VPN）。
- 沒處理 ChatGPT 產生的內容被貼上 Stack Overflow；Stack Overflow 一週內就禁止 ChatGPT 生成的貼文；若有大量此類內容，估計會偏低。
- 調查有選樣偏誤，結果可能低估（L77）。

## 與摘要說法不一致的地方

- 摘要寫「Within 6 months of ChatGPT's release, activity on Stack Overflow decreased by 25%」：表裡的 6 個月平均效果是 15%（Table 1 第 1 欄）；25% 是從每週係數圖讀出的期末水準（L73）。正文 L28 兩個數字都有交代，但摘要只給 25%。
- 重要性聲明（Significance Statement，L22）寫「ChatGPT has led to a 25% drop」——因果措辭比正文的「relative to counterfactual platforms」強。
- 摘要寫「observe similar decreases in content creation by more and less experienced users alike」：Table 2 的新使用者只降約 8%（−0.0833），明顯小於其他三組（−0.168 到 −0.254）；正文自己也說新使用者「decreased only slightly」。摘要這句只對「Inexperienced 對 Experienced/Expert」成立，不含 New。
- 摘要「We find no significant change in post quality, measured by peer feedback」與正文一致，但正文多說了一句好問題比例有短暫小升（L79）。

## 與清單「要撐的結論」不合的地方

清單原句：「ChatGPT 發布後六個月 Stack Overflow 活動量相對下降 25%」。

- 數字有出處，但要改寫才準：**相對於四個對照平台**，發布後 6 個月的**平均**下降約 15%（log 係數 −0.163，p < .05）；到 2023 年 4 月底的**每週**估計穩定在約 25%（讀自 Fig. 2）。作者把 25% 當下限，理由是對照平台也可能受影響。
- 「只算問題」的下降（10%）只達 p < .1，不能說問題數顯著下降。
- 這篇量的是公開問答的**發文量**，不是學習、不是理解；對 order 21「留言區、論壇與社群」可撐的是「公開問答社群的貢獻在 LLM 出現後變少」，撐不了「讀者學得比較少」。
- 有經驗的使用者減少的主要是回答（S8，未讀補充表，只能照正文轉述）。

## 讀取紀錄

- `delrio-chanona2024-so.txt`：L1–120（檔頭、摘要、引言、資料與方法、結果、討論前半），L121–244（討論後半、Materials、註腳、作者資訊、資金、資料可得性、參考文獻掃過）。全檔首尾相接讀完。
- PDF 版面對照：p.5（Table 1）、p.6（Fig. 2、Fig. 3）、p.7（Table 2）。Table 1、2 每一格都與文字檔一致。Fig. 1、4、5 只讀圖說與正文敘述，沒看圖。
- 補充資料未取。
