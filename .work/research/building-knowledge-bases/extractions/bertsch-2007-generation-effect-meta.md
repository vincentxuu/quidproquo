# Bertsch, Pesta, Wiscott & McDaniel 2007 — The generation effect: A meta-analytic review

read_status=read（全文 10 頁，期刊排版版，含 Table 1 全表、兩則註腳、參考文獻）

## 書目

- Bertsch, S., Pesta, B. J., Wiscott, R., & McDaniel, M. A. (2007). The generation effect: A meta-analytic review. *Memory & Cognition*, 35(2), 201–210. DOI 10.3758/BF03193441。
- 收稿 2002-11-18，修訂接受 2005-10-23（文末）。文獻檢索範圍 PsycINFO 1966–2005。
- 讀的檔案：McDaniel 個人網站的期刊 PDF `https://mcdaniel97.github.io/Publications/Bertsch%20et%20al.%202007.pdf`（`curl -L -A "Mozilla/5.0"` HTTP 200，140,770 bytes，10 頁）→ `pdftotext -layout` → `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/bertsch.txt`（644 行，72,270 bytes）。版面與頁碼 201–210 與期刊版一致。

## 設計

- 性質：統合分析，Hunter & Schmidt (1990) 心理計量取向，只校正抽樣誤差（「Our meta-analysis was only able to correct for sampling error」，p. 202）。
- 母群：生成效應實驗（受試者自己產生項目 vs 只讀現成項目，之後考記憶）。典型材料是配對聯想詞表（cold–hot vs cold–___）、句尾填空、乘法/加法、字謎（p. 201）。
- 納入：86 studies、445 個效應量、17,711 名受試者（部分效應量來自同一樣本，非獨立）（p. 202–203）。
- 排除：記憶測驗非 free recall／cued recall／recognition 者、雙語受試者、臨床樣本、圖片刺激、缺統計資訊、沒有對照條件者；多次測驗只取第一次（p. 203）。
- 效應量算法：讀與生成兩組比例分別累積，以「讀」組校正後標準差為分母（Glass's d）。作者也用差異分數算了一次，得到的 d 約是兩倍大，但選擇報告較保守的那種（p. 203）。
- 共 13 個統合分析：overall、adjusted（每個實驗只貢獻一個平均值）、11 個調節變項分組。
- 調節變項顯著性的判準：95% CI 不重疊即視為有效（p. 203）。沒有做正式的異質性檢定或出版偏誤分析。
- 11 個調節變項：測驗類型、意圖/偶發學習、受試者內/間設計、年齡、清單呈現（blocked/random）、刺激類型（數字/詞/非詞）、生成規則（11 種）、生成部分或整個目標、刺激數量、保留間隔、生成難度（p. 202）。

## 可引用結果（Table 1, p. 204–205；正文 p. 205–207）

1. **整體效果**：overall d = .40（95% CI .38–.42），讀 .471 vs 生成 .559 正確率，原始差 .088（約 9 個百分點）。adjusted d = .41（.39–.43），276 個效應、11,043 人。
   - 原句：「Calculations made with 17,711 subjects revealed that there was almost a one-half standard deviation advantage (.40) in memory performance when material was generated versus when it was just read (remembering that this is actually an underestimation of the population effect).」（p. 203/206）
   - 抽樣誤差只解釋 11% 變異，88–89% 留待調節變項（p. 206）。
2. **測驗類型**：recognition d = .46、cued recall .55、free recall .32（Table 1）。
3. **學習情境**：incidental（不知道之後會考）d = .65，intentional .32。原句：「Incidental learning conditions resulted in an effect size (.65) that was more than twice as large as the one obtained under intentional-learning conditions (.32).」（p. 206）
4. **設計**：within-subjects d = .50，between-subjects .28（p. 206）。另一處報告 free recall 的 between-subjects 平均生成效應只有 4%（d = .17）（p. 207）。
5. **材料**：numbers .87、words .41、nonwords .05（p. 206）。**字謎（anagram）為負效應** d = −.05（CI −.07 到 −.03），18 個效應、1,083 人：「the use of anagrams resulted in a negative generation effect (i.e., read conditions were more effective than generate conditions)」（p. 206）。
6. **生成規則**：calculation .92、sentence completion .60、rhyme .46、category .41、synonym .41、word fragment .37、letter rearrangement .37、association .32、antonym .28、anagram −.05。
7. **生成整個 vs 部分目標**：whole .55、part .32。
8. **刺激數量**：≤25 項 .60、26–50 項 .41、>50 項 .09（CI .07–.11）。
9. **保留間隔（延遲）**：immediate .41、<1 min .32、1 min–1 day .41、>1 day .64（CI .62–.66，但只有 30 個效應、971 人）。原句：「there is a general trend toward larger effect sizes with longer retention intervals」（p. 206）。
10. **難度**：easy .41、moderate .37、hard .46，彼此相近（hard 只有 17 效應、685 人）。作者據此說「effort」理論不足：「It is likely that "effort" as a construct may be a term that is too broad to be an effective explanation for the generation effect.」（p. 206）
11. **理論檢驗**：selective displaced rehearsal 不被支持（free recall 下 blocked 比 mixed 的讀與生成都更好，p. 207）；transfer-appropriate processing「remains unclear」（p. 207）。
12. 結論句：「Regardless of what the underlying cognitive mechanisms may be, the generation effect appears to be a real phenomenon that deserves further empirical study.」（p. 207）

## 作者列的限制

- 只校正抽樣誤差；測量誤差無法校正，所以母群平均被低估、母群變異被高估（p. 202）。
- 同一樣本貢獻多個效應量，可能低估抽樣誤差變異（p. 202）。
- 「some of our conclusions are based on moderator classes with relatively low n sizes」（p. 207），例如 older adults 只有 18 個效應、>1 day 30 個、hard 17 個。
- 難度是作者主觀判定，且和生成任務類型、處理深度混淆（p. 206）。
- 註 1：差異分數算法與分組算法在測驗類型、生成規則兩個調節變項上排序不同（差異分數算法下 recognition > cued > free；分組算法下 cued > recognition > free）（p. 210）。
- 註 2：沒編碼 whole-list／intertarget processing，無法完整檢驗多因子理論（p. 210）。

## 與摘要或常見轉述不一致處

- **常見轉述「自己產生的東西記得比較牢，所以用自己的話寫筆記」**：本研究的材料全是實驗室刺激：445 個效應中 362 個是詞（81%）、47 個非詞、36 個數字（Table 1 Stimulus Type），句子層級的只有 sentence completion 46 個效應（填句尾一個字），沒有任何「寫筆記」「改寫段落」「建立連結」的研究。把 d = .40 套到原子筆記或 Zettelkasten 是外推。
- **延遲越長效果越大**：只是「general trend」，而且非單調（<1 min .32 低於 immediate .41），>1 day 那組只有 30 個效應。不能寫成「生成效應會隨時間變大」的定論。
- **整體 d = .40 是保守值**：差異分數算法得到的 d 約兩倍（p. 203），作者選了較小的那個；原始正確率差距只有約 9 個百分點。轉述「近半個標準差」時，要知道實際只是正確率 47% → 56%。
- **刺激數量 >50 時 d = .09**：長清單下效應幾乎消失。這點摘要沒提，但對「大量筆記」情境比 d = .40 更相關。
- **非詞 .05、字謎 −.05**：生成不是總是有效，材料沒有意義時效應接近零或反轉。
- **Table 1 的小錯**：Letter Rearrangement d = .37 但 CI 寫 .49–.53（p. 205），CI 與點估計不一致，應是排版錯誤；引用此規則時只引 d。
- 摘要說「86 studies」，正文也是 86 studies／445 measures；但 adjusted analysis 只有 276 個效應、11,043 人，差異來自缺資訊的研究只進部分分析（p. 203）。

## 對 order 3 的意義

- 可支持的說法：在實驗室的詞與數字材料上，自己產生（而非只讀）答案，平均記憶優勢約 0.4 SD；不知道要考、清單短、生成整個目標時更大。
- 不能直接支持：「寫永久筆記／用自己的話改寫／在筆記之間建立連結」會帶來同等好處。需另找文本層級的生成研究（例如 McCurdy 2020 擴大納入、或 "text generation benefits learning" 類統合分析）。

## 讀取紀錄

- 1–62 行：p. 201 摘要、引言、典型範式。
- 63–208 行：p. 202–203 方法（心理計量取向、調節變項定義、文獻檢索、排除標準、公式、CI 判準）、結果開頭。
- 209–355 行：p. 204–205 Table 1 全表（overall、adjusted、11 個調節變項）。
- 356–416 行：p. 206 調節變項討論、難度、理論檢驗（effort）。
- 417–482 行：p. 207 selective rehearsal、TAP、測量問題、結論、作者註、參考文獻開頭。
- 483–631 行：p. 208–209 參考文獻（逐條掃過，標 * 為納入研究）。
- 632–645 行：p. 210 註 1、註 2、收稿日期。
