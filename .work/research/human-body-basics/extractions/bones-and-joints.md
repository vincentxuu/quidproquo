# 精讀紀錄：order 1 骨骼與關節

## 來源書目與取得管道
1. Miao T, Li X, Zhang W, Liu J, Xiao Y, Wang X. Effects of exercise on bone mineral density and bone turnover markers in adults: a systematic review and meta-analysis. Front Physiol 2025;16:1672997. doi:10.3389/fphys.2025.1672997。PMID 41584801、PMCID PMC12823962（Europe PMC 搜尋回傳值；EPMC pubYear 2025、firstPublicationDate 2026-01-08）。CC BY。取得：Europe PMC fullTextXML（Groundlane web_fetch，format=text，truncated:false，73,266 字元）。
2. Miao T, Li X, Zhang W, Yang F, Wang X. Effects of high-impact jumping versus resistance exercise on bone mineral content in children and adolescents: a systematic review and meta-analysis. PeerJ 2025;13:e19616. doi:10.7717/peerj.19616。PMID 40611942、PMCID PMC12225634。CC BY。取得：同上（54,154 字元，truncated:false）。
3. OpenStax Anatomy and Physiology 2e：6.3 Bone Structure、6.4 Bone Formation and Development、6.6 Exercise, Nutrition, Hormones, and Bone Tissue、9.1 Classification of Joints、9.4 Synovial Joints。取得：Groundlane web_fetch（format=text，truncated:false）。

## 讀了什麼／沒讀什麼
- 1、2：讀了摘要、方法（納入條件、風險偏差）、結果（含分組表）、討論與限制、結論。沒讀：補充材料、森林圖本身（只有圖說）、完整參考文獻。
- OpenStax：五節主文完整抓回，從學習目標到結尾。沒讀：圖、互動連結、章末題、6.5 骨折修復與 6.2 骨骼功能等其他節。
- 兩份統合分析都是同一團隊（Miao T、Li X、Zhang W、Wang X），同一基金（Shandong Social Science Planning 21DTYJ03）。不算獨立佐證。全文搜尋 "GRADE"、"certainty"：0 筆，兩份都沒有評證據確定性。

## 逐字引文（已用 python 對正規化後的全文比對：True）
| # | 來源 | 文章用途 | 原文 |
|---|---|---|---|
| A1 | Miao 2025 Front Physiol 討論 4.1 | 文中引用（zh/en 都用） | "the overall results of this study did not show a significant improvement in BMD from exercise in premenopausal women" |
| A2 | 同上 討論 | 轉述（作者推論） | "This suggests that exercise interventions during the young adult stage, when bone mass still has growth potential, may have a more positive effect on bone health" |
| A3 | 同上 限制 | 轉述 | "the number of studies included in some subgroups was small, which may have reduced statistical power"；"there was considerable heterogeneity in the specific parameters of exercise interventions" |
| A4 | 同上 背景 | 轉述（機制，作者引用他人） | "As a dynamic tissue, bone can adapt to mechanical loading through structural and functional modifications, including changes in bone mass, geometry, and strength" |
| C1 | Miao 2025 PeerJ 結論 | 文中引用（en 內短語） | "resistance exercise did not yield statistically significant improvements in BMC, possibly due to the limited number of studies and methodological limitations" |
| C2 | 同上 限制 | 轉述 | "There are eight studies on jumping, but only four studies on resistance exercise"；"the included studies comprise four non-randomized controlled trials" |

OpenStax 引文：**未程式比對**（這個環境沒有存下頁面文字檔供比對；文章只用改寫，沒有放 OpenStax 逐字引文）。

## 數字出處（Miao 2025 Front Physiol）
- 22 RCT、1,051 人；納入 18–45 歲、至少 8 週；15 項為停經前女性；年齡約 19–43。
- 腰椎 12 項（15 組試驗）SMD 0.15 (−0.09, 0.38) P=0.23；股骨頸 SMD 0.06 (−0.11, 0.22)；全身 SMD 0.13 (−0.30, 0.55)。
- 年齡分組（Table 3–5）：腰椎 <30 歲 8 組 SMD 0.46 (0.16, 0.76)；>30 歲 7 組 −0.12 (−0.36, 0.13)。股骨頸 <30 歲 6 組 0.42 (0.13, 0.71)；>30 歲 −0.05 (−0.32, 0.23)。全身 <30 歲 4 組 0.24 (−0.23, 0.71) 不顯著。
- 運動種類：合併運動 股骨頸 SMD 0.49 (0.08, 0.90) 2 組；全身 0.52 (0.08, 0.97) 4 組；高衝擊、阻力在腰椎與股骨頸皆不顯著。
- 偏誤：2 項低風險、2 項高風險、其餘有疑慮；只有 2 項提供分派隱匿。
## 數字出處（Miao 2025 PeerJ）
- 12 項、940 人（運動 524、對照 416）；各研究平均年齡 7.3–16.8；8 項跳躍、4 項阻力；4 項非隨機（文中風險段列 Dowthwaite 2019、Gómez 2021、Thein-Nissenbaum 2023、Witzke & Snow 2000）。注意：討論段寫「八項跳躍中有一項非隨機、四項阻力中有一項隨機」，與風險段（4 項非隨機中，Witzke 為跳躍，其餘 3 為阻力）一致。
- 跳躍：腰椎 MD 0.86 (0.27–1.45)、股骨頸 MD 0.11 (0.04–0.18)；阻力：不顯著。結果用 DXA（文中「all utilized DXA」）。

## 作者列的限制
- Front Physiol：子群研究數少、統計檢定力不足；男性少、未做性別分組；運動參數（強度、頻率、種類）異質性大。
- PeerJ：研究數少、兩種運動研究數不平衡、4 項非隨機。

## 要小心的
1. 標題寫 "adults"，但骨密度分析是成年女性（文內明講）；男性只有 3 項（骨轉換指標）。文章只寫「成年女性」。
2. 年齡分組是事後以各研究平均年齡 30 切，每組 ≤8 組試驗；不是縱貫追蹤。我沒有查到分組是否事先註冊（只知道 PROSPERO CRD420251001516），所以文章不寫「事先／事後」，只寫「以平均年齡切」。
3. PeerJ 討論段寫 "high-impact jumping significantly outperformed resistance exercise"：這是跨子群的間接比較，文章刻意不採用，只寫各自對照組的結果。
4. 機制（流體剪應力、RANKL、myokine）都是作者引用他人文獻的背景，不是統合分析的結果。
5. 教科書 6.6 的概括句沒有列研究出處；"thicker bones" 是橫斷式比較。

## OpenStax 簡化、過時或與研究衝突之處
- 6.6「Any type of exercise ... resistance training has a greater effect than cardiovascular activities」：兩份統合分析不支持這麼簡單的排名（成年女性：阻力子群不顯著，合併運動才顯著；兒童：跳躍顯著、阻力不顯著）。文章寫成「教科書概括，未支持」。
- 6.6 "people who exercise regularly have thicker bones"：關聯，不是因果。
- 6.6 太空人每月流失 1–2% 骨量："is thought to be"，推測；文章未用。
- 9.4 把膝關節歸為樞紐關節：簡化（膝還能轉動）；表中沒寫膝。
- 9.4 骨關節炎「wear and tear」框架與 6.x 骨質疏鬆治療（bisphosphonates、calcitonin、estrogen）：超出範圍，未用。
- 6.4 "about 5 to 10 percent of the skeleton is remodeled annually"：教科書概數，無出處；文章標「教科書給了一個概數」。
- 生長板閉合「約 18–21 歲」：個體差異，文章只寫「長大以後」。

## 對本篇的影響
- 範圍縮成「構造（OpenStax）＋負荷與骨：兩份可免費讀的統合分析（成年女性、兒童青少年）＋空白」。
- 空白：中老年一般人、男性、攀岩者的骨量。Lu 2026 BMJ 讀不到全文（見 evidence.md）。
