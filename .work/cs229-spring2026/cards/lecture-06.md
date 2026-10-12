# 範圍卡：CS229 Spring 2026 第 6 堂

- **課程／版本**：Stanford CS229 Machine Learning，Spring 2026（Stanford Online 公開錄影）
- **文章角色**：單堂概念導讀（zh-TW）
- **原課堂次／order**：第 6 堂（影片標題 Lecture 6: Dataset Split, ML Advice）；series.order = 6
- **文章**：`src/content/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization.md`
- **講者**：Chris Ré。本堂字幕沒有自我介紹；依據是第 5 堂字幕「next week you get Tengyu ... the week after that, you get me back」、第 1 堂 Tengyu Ma 說 Chris 從下一堂開始教、第 7 堂 Tengyu Ma 說「the lectures by Chris ... about linear models」，以及本堂「you get a well-deserved break from me next week」。
- **讀者先備**：線性迴歸正規方程式、期望值與變異數、特徵值分解、半正定矩陣。
- **主問題**：訓練集是抽樣來的，模型該多複雜、複雜度怎麼控制、用哪份資料決定？
- **讀完的能力**：
  1. 自己推出 MSE = σ² + 偏差² + 變異，說出兩次交叉項為零各用了什麼條件。
  2. 從 ridge 閉式解說明特徵值 λ→λ+ρ，以及小特徵值方向的變異如何下降。
  3. 解釋 n<d 時懲罰項為什麼挑出最小範數解。
  4. 說明為什麼超參數不能用訓練誤差挑；算 successive halving 的運算量。
- **完整例子**（皆本文自擬，已用 Python 驗算）：
  - 三個訓練點（x = −1, 0, 1）、h*(x)=x²、測試點 0.5：常數／直線／二次的偏差² 為 0.1736／0.1736／0，變異為 0.3333σ²／0.4583σ²／0.7188σ²；σ²=0.25 時二次最好（0.4297），σ²=1 時常數最好（1.5069）。40 萬次模擬吻合。
  - Ridge 2D：λ=(4, 0.01)、σ²=1、θ*=(1,1)、ρ=0.1：OLS 期望平方距離 100.25；ridge 偏差² 0.827＋變異 1.064＝1.891。模擬吻合。
  - 最小範數：x=(1,1)、y=2，ridge 解 2/(2+ρ)·(1,1)。
  - Successive halving 8 設定：24 單位、勝出者 7 單位、全跑 56 單位（43%）。
- **自我檢查**：五題，答案在文內（交叉項條件；x=0 測試點的三項：常數 0.778、二次 0.5；λ=1e-4、ρ=0.01 的變異 0.98 與收縮 0.0099；訓練誤差對 ρ 單調不減；16 設定 64 單位、勝出者 15 單位、27%）。
- **來源底本**：`txt/06-llnEgyyuYkQ.txt`（整份讀完）；`main_notes.txt` 第 8 章 pp.115–136、第 9 章 pp.137–145。未看板書與投影片畫面。
- **課堂沒講**：講義 8.3（union bound、Hoeffding、uniform convergence、VC 維度）、sample-wise 雙降、9.4 貝氏／MAP（明講跳過）、k 折交叉驗證的分析（預告了但沒時間）。
- **課堂多講**：ridge 閉式解與特徵值／零空間分析、ImageNet-V2 與適應性過度配適、successive halving。
