# 範圍卡：CS229 Spring 2026 第 13 堂

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影）
- **文章角色**：單堂概念導讀（zh-TW）
- **原課堂次與 order**：第 13 堂；`series.order: 13`
- **影片**：https://www.youtube.com/watch?v=lNTajqxxOn4 （標題寫 LLMs, Next-Word Prediction Loss，實際內容是講義第 16 章；沒有講 next-token loss）
- **講者**：判定 Tengyu Ma。字幕沒有自我介紹，依據是 17:23「which I owed some papers on this」與 47:02「I was involved in a startup which is doing some of these things with natural languages」
- **文章路徑**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search.md`

## 讀者先備

softmax 與交叉熵損失、向量內積與餘弦、上一堂的預訓練／linear probe／微調概念。

## 主問題

沒有標籤時，用什麼損失函數才能訓練出「相似的輸入向量相近」的 embedding？這組向量在 LLM 年代拿來做什麼？

## 讀完的能力

1. 寫出 SimCLR 損失並對一個小批次手算。
2. 用單調性與多分類兩種方式解釋損失為何拉高對角線、壓低非對角線。
3. 解釋退化解、假負例、難負例、批次抽法各自的角色。
4. 說明語意檢索的兩階段流程，以及 RAG 相對於微調的取捨。

## 完整例子（皆為本文自擬，已用程式驗算）

- B=3、二維單位向量（角度 0°/20°、90°/110°、200°/230°）：S 第 1 列 (0.940, −0.342, −0.643)，各列損失 0.394、0.549、0.455，總和 1.398。
- 退化解：每列 log 3 = 1.099，整批 3.296。
- 假負例：第 3 張換成貓（10°/30°），第 1 列 p11 = 0.453、損失 0.791、p13 = 0.421。
- 梯度：∂ℓ/∂S_ii = p_ii − 1、∂ℓ/∂S_ij = p_ij；第 1 列力道 0.326 = 0.187 + 0.139。
- 檢索：查詢 25°，文件 10°/100°/50°/250°，內積 0.966/0.259/0.906/−0.707，前二名是第 1、3 份。
- 溫度上界：p_ii ≤ e/(e+(B−1)/e)，B=3 為 0.787，B=128 為 0.055（損失 ≥ 2.90）。

## 自我檢查題與答案

1. 只有拉力的最佳解；B=4 退化解損失 → 4 log 4 ≈ 5.545。
2. 列 (2,0,0) 的損失 0.240；S_i2 降到 −5 後 0.128 → 遠的負配對再推遠沒用。
3. 「假負例一定把同類推開」錯在哪 → 機率小＋其他項平衡。
4. B→2B：前向傳播 2 倍、矩陣格數 4 倍，成本由前向傳播決定。
5. 權限與每週增刪：RAG 在檢索階段處理，微調做不到乾淨的權限與刪除。

## 來源底本

- 逐字稿 `.work/cs229-spring2026/txt/13-lNTajqxxOn4.txt`（整份讀完）
- 主講義第 16 章，pp.196–201（`main_notes.txt` 第 9046–9284 行）
- 未看板書畫面；未上網另做研究
