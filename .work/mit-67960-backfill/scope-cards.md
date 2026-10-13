# MIT 6.7960 (Fall 2024 OCW) 補堂範圍卡

建立：2026-10-13。課程版本：MIT 6.7960 Deep Learning, Fall 2024（MIT OCW）。
來源底本：OCW 官方逐字稿 PDF（無時間戳）與投影片 PDF，存於 `raw/`（`lecNN_transcript.pdf`、`lecNN_slides.pdf` 與轉出的文字檔）。未回聽原音。
系列：「MIT 6.7960 導讀」／"Reading MIT 6.7960"。讀者先備：本系列前面各堂、微積分與線性代數。

| 堂次 | 角色 | 檔名 slug | series.order | 主問題 | 讀完能做的事 | 完整例子 | 檢驗題 |
|---|---|---|---|---|---|---|---|
| Lec 02 How to Train a Neural Net（Beery） | 概念導讀＋手算 | `l02-how-to-train-a-neural-net` | 3 | `loss.backward()` 為什麼算得動 | 判斷地形難在哪；寫出線性層與 ReLU 的前向／反向／更新；對 DAG 手算梯度 | 投影片課末 2-2-1 tanh 網路一次更新（自行計算，與投影片答案對過） | 4 題，附答案 |
| Lec 06 Generalization Theory（Isola） | 概念導讀 | `l06-generalization-theory` | 11 | 參數多於資料為何仍泛化 | 分清近似／最佳化／泛化；說明參數數與 VC 維度為何失效；讀 double descent | 檔案櫃計數（30^10）、version space 1/6→1/4、VC 界 n=10（自擬） | 4 題 |
| Lec 19 Transfer Learning: Data（Beery） | 概念導讀 | `l19-transfer-learning-data` | 24 | 生成模型能給原資料沒有的什麼 | data++ 四種操作；判斷潛在方向資料的風險；手算一步 MAML | 一維兩任務 MAML vs 預訓練（自擬） | 4 題 |
| Lec 20 Scaling Laws（Isola） | 概念導讀＋計算 | `l20-scaling-laws` | 25 | 算力固定時模型與資料怎麼分 | 由指數算回報；Kaplan vs Chinchilla 分配；臨界批次 | 四個算例（自行計算） | 4 題 |
| Lec 21 Language Models（Andreas 客座） | 概念導讀 | `l21-language-models` | 26 | 下一詞預測器為何不微調就能做事 | 連鎖律算句機率；in-context 提示為何是假文件；CoT 的計算理由；三階段分工 | 機率表與 perplexity（自擬）、情感分類提示、Roger 網球題 | 4 題 |
| Lec 23 Metrized Deep Learning（Bernstein） | 概念導讀＋計算 | `l23-metrized-deep-learning` | 27 | 學習率為何隨寬度漂移、怎麼修 | 模組四屬性與 well-normed；手算組合範數；對偶映射 | RMS 誘導範數、兩層串接、不等質量、2×2 對偶映射（自行計算） | 4 題 |
| Lec 24 Inference Methods（Isola） | 概念導讀 | `l24-inference-methods` | 28 | 權重固定後還能怎麼變好 | 貪婪取樣反例；三種搜尋；TTT vs ICL；搜尋與學習的迴圈 | 兩詞機率表（自擬）、Best-of-N 機率 | 4 題 |

## 已知限制

- Lec 20：公開錄影 38 分 22 秒，逐字稿停在投影片第 17 頁附近（「Finding two, the--」）。後半只依投影片。
- Lec 22（AI for Musical Creativity，Anna Huang 客座）、Lec 25（Efficient Policy Optimization Techniques for LLMs，Kianté Brantley）：OCW 無錄影、無投影片，不寫導讀；原因寫在總覽篇。
- 各論文數字為課堂／投影片引用值，未逐一回原論文核對（各篇「內容核對」行有註明）。
- 來源衝突：Lec 06 計數實驗的「100 trillion」與 30^10 不符（正文已標）；Lec 24 深藍年份口誤（1994→1997）；Lec 24 ARC 口頭 62%、投影片 61.9%；Akyürek 論文 arXiv 後續版本改名。

## 審稿

獨立審稿報告：`review-l02-l06.md`、`review-l19-l20.md`、`review-l21.md`、`review-l23-l24.md`。
