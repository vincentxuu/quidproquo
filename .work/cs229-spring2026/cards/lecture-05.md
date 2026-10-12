# 範圍卡：CS229 Spring 2026 第 5 堂

- **課程版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影）
- **原課堂次／order**：第 5 堂（Lecture 5: Gaussian Discriminant Analysis）；series.order = 5
- **文章**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis.md`
- **文章角色**：概念導讀（單堂）
- **講者**：Chris Ré（依據：15:26「next week you get Tengyu... the week after that, you get me back」；1:07:45 轉述 Efros 說「Chris, my girlfriend...」）

## 讀者先備

貝氏定理、最大概似估計（第 1–4 堂）、邏輯斯迴歸的 sigmoid、矩陣轉置／反矩陣／特徵值／行列式。

## 主問題

不直接學 p(y|x)，改成先替每個類別的 x 建模，分類器會長什麼樣？它跟邏輯斯迴歸是什麼關係？

## 讀完的能力

1. 手算 GDA 四組參數（φ、μ0、μ1、Σ）。
2. 寫出共用 Σ 時的線性決策邊界並解釋二次項為何消掉；說出 QDA 為何是二次。
3. 把 GDA 的事後機率化成 sigmoid，寫出 θ、θ0。
4. 說明「GDA ⇒ 邏輯斯形式，反之不然」與兩者的取捨。
5. 說明 Naive Bayes 的條件獨立假設如何把 2^d 降到 2d+1，並手算含 Laplace 平滑的事後機率。

## 完整例子（皆自擬，課堂無具體數字）

- GDA：貓 (1,2),(2,1),(2,3),(3,2)；大象 (5,5),(7,7)。φ=1/3，μ0=(2,2)，μ1=(6,6)，Σ=[[2/3,1/3],[1/3,2/3]]，Σ⁻¹=[[2,−1],[−1,2]]。x=(4.5,4)：距離平方 10.5／6.5，log 比值 1.307，p(y=1|x)=0.787。邊界 x1+x2≈8.17。x=(4,4) 得 1/3。
- Naive Bayes：4 垃圾／6 正常，五個詞計數 [3,4,0,0,1]／[1,1,4,3,3]，x=(1,0,1,0,0)。不平滑 p(x|垃圾)=0；平滑後 80/7776 與 960/32768，p(垃圾|x)≈0.190。
- 驗算腳本：scratchpad `l05.py`（numpy），結果與文中一致。

## 自我檢查題與答案

1. 分類 (5,3)：a=−0.693，p=1/3，貓；與 (4,4) 同在 x1+x2=8 上。
2. 兩類各四隻且其他參數不變：邊界 x1+x2=8（事前機率只平移邊界）。
3. μ1 推導用到 Σ⁻¹ 可逆；不可逆時 μ1 在零空間方向不可識別。
4. 共用 Σ 時 xᵀΣ⁻¹x 兩邊相消；不共用剩 xᵀ(Σ1⁻¹−Σ0⁻¹)x。
5. Poisson 型特徵選邏輯斯迴歸：多種生成假設導向邏輯斯形式，反之不然。

## 來源底本

- 逐字稿 `.work/cs229-spring2026/txt/05-zRdE8A4UZes.txt`（整份讀完；未看板書／投影片）
- 主講義 `main_notes.txt` 第 4 章 pp.35–48
- 舊文 `2026-08-22-...-chapter-04-generative-learning-algorithms.md`（僅參考頁碼）

## 課堂沒講或字幕不清而未寫入

- multinomial 事件模型：課堂未提。
- Laplace 平滑公式：課堂只口頭一句，公式取自講義。
- 「diagonal dominance」的判別法：字幕敘述不通，未寫入。
- 參數量「d choose 2 over 1」、2^d 的口頭數字（10^300、2^600、宇宙原子數）：字幕前後不一致，改用本文自算的 d(d+1)/2 與 2^10000≈10^3010。
- 文字擴散模型相關人名（字幕 Stefano／Volo／Aaron Lou）、Hebbian learning、energy models：只是岔題，未寫入。
