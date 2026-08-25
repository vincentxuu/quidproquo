---
title: "CS221 Lecture 2：Learning I：從計算圖到線性迴歸"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 3
tldr: "Stanford CS221 Autumn 2025 第 2 講，從 Learning I：從計算圖到線性迴歸 建立可操作的 AI 問題表示與演算法直覺。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 2，依官方可執行講義整理核心 agenda、例子與限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-02-learning-backprop-regression-en)

這篇只依兩份可執行 artifact 整理：[`backpropagation.py`](https://stanford-cs221.github.io/autumn2025-lectures/?trace=backpropagation) 和 [`linear_regression.py`](https://stanford-cs221.github.io/autumn2025-lectures/?trace=linear_regression)。主線很集中：先用 tensor 與 `einsum` 熟悉「軸怎麼被保留或消去」，再把一個 scalar loss 拆成計算圖，最後把同一套微分與更新步驟接到線性迴歸。文章中的數值、名稱、形狀與演算法流程，都以這兩個檔案實際寫出的內容為準。

> 材料缺口：來源檔提供可執行講義與程式碼，但沒有公開課堂問答、完整口頭講解、額外實驗結果或作業解答。以下不替這些缺口補上看似合理的結論。

## 議程：從張量操作到學習迴圈

`backpropagation.py` 開頭先回顧 tensors，接著把這一講的重點列成三件事：用 tensor operations 組成 objective function、用 gradient 判斷怎麼改善 objective，以及用 computation graph 有效率地算 gradient。`linear_regression.py` 把這條技術線接到完整的 machine-learning pipeline：輸入與輸出、training data、predictor、hypothesis class、loss function 和 optimization algorithm。

這個順序有一個實際好處。若一開始就把「訓練模型」當成一個黑盒，權重、殘差與 loss 會混在一起；先把每一個運算變成節點，再談更新參數，就能清楚回答三個問題：現在的數值從哪裡來、它對目標的影響是什麼、下一步要改哪一個量。

## Warm-up：`einsum` 是軸的記帳法

來源先提醒 tensor 的 order，也就是軸的數量：order 0 是 scalar，order 1 是 vector，order 2 是 matrix。對矩陣而言，axis 0 對應 rows，axis 1 對應 columns。這裡的重點不是背術語，而是知道每個軸代表什麼。若 rows 是 data points、columns 是 features，就可以把軸命名成 `example` 與 `feature`，讓後面的式子不只靠位置猜意思。

程式用 `x = np.array([0, 1, 10])` 演示多種 `einsum`。`"i -> i"` 保留同一個軸，得到 identity；`"i ->"` 不保留輸出軸，因此把所有元素相加。`"i, i -> i"` 是逐元素相乘，`"i, i ->"` 則把相乘結果再加總，可視為 dot product。把輸入軸改成不同名字，`"i, j -> i j"` 就會生成 outer product。三個輸入也可以寫成 `"i, i, i -> i"` 的逐元素三次乘法，或 `"i, j, k -> i j k"` 的 triple outer product。

矩陣例子更能看出「保留哪些軸」的效果。對 `m` 寫 `"i j ->"` 是所有元素的總和；`"i j -> i"` 對 columns 的 `j` 加總，所以留下每一列；`"i j -> j"` 則留下每一欄。`"i j -> j i"` 交換軸，得到 transpose。矩陣向量乘法寫成 `"i j, j -> i"`：`j` 同時出現在矩陣與向量、卻沒有出現在輸出，因此對 `j` 加總，只留下 `i`。兩個矩陣的 `"i k, j k -> i j"` 與 `"k i, k j -> i j"` 也分別展示了和轉置相關的乘法。

來源給的通則是：輸入是一組帶有命名軸的 tensors，輸出軸是輸入軸的子集；對每一組軸索引，先把對應元素相乘，再把沒有留在輸出的索引加總到相應位置。換句話說，`einsum` 把加法與乘法，以及軸的 bookkeeping，放進同一個可讀的表示。這個 warm-up 並沒有聲稱所有運算都必須改寫成 `einsum`；它要建立的是形狀與縮約軸的直覺。

## Objective：把許多運算壓成一個 scalar

第一個動機例子直接使用線性迴歸的 tensor mechanics。`x` 是形狀 `n × d` 的矩陣，來源中的具體值是 `[[1, 2, 0], [0, -1, 1]]`；`y` 是長度為 `n` 的 targets，值為 `[0, 3]`；`w` 是長度為 `d` 的 weights，值為 `[1, 0, 1]`。先算 `predictions = x @ w`，得到每個 example 的 prediction；再算 `residuals = predictions - y`；對 residuals 逐元素平方得到 `losses`；最後 `np.sum(losses)` 得到 `total_loss`。

這串式子可以封裝成 `objective(w)`：輸入一個 weight vector，輸出一個 scalar `loss`。來源先用兩個 `w` 呼叫它，並把終極目標說成尋找能讓 `objective(w)` 最小的 `w`。這裡的 scalar 很重要：當目標是單一數字，才可以問「輸入的某一個元素改變一點時，這個數字改變多少」，也才能把所有局部影響組成同一個 gradient。

要區分兩件事。`objective` 是一個函數，描述參數如何產生評分；目前的 `w` 是一次呼叫時拿來評分的具體參數。程式先固定 `x` 和 `y`，只改 `w`，所以這個階段研究的是「如何調整參數以改善已定義的 objective」，不是在重新定義資料或預測任務。

## Local derivative：先用有限差分確認方向

對一維函數 `f(x) = x ** 2`，來源把 `x = 1` 改成 `x + dx`，其中 `dx = 1e-4`，再用 `(f(x + dx) - f(x)) / dx` 估計 `dy / dx`。當 `dx` 趨近於 0，這個比值就是 derivative；對這個例子也能解析地寫成 `df(x) = 2 * x`。幾何上，它是 `x` 位置切線的斜率。

有限差分在這裡扮演的是可操作的檢查：把輸入推一小步，觀察輸出改變，再比較解析導數。它不是來源宣稱的完整自動微分系統，也沒有在檔案中提供誤差隨 `dx` 變化的實驗。這是本篇需要保留的缺口：我們能說明程式如何估計一個局部變化，不能從這段程式推導數值穩定性或額外精度保證。

多變量版本把同一個問題拆成 partial derivatives。來源用 `f(x1, x2) = (x1 + x2) ** 2`，在 `(1, 2)` 計算對 `x1` 與 `x2` 的偏導，兩者都是 `2 * (x1 + x2) * 1`。因此，偏導量組成的向量指出哪個方向會讓 `f` 增加最快；取負方向則是下降最快的方向。這句話的適用對象是這裡的局部梯度描述，不能擴張成「任何訓練都一定找到全局最佳解」。

向量輸入時，來源用 `f(x) = np.sum(x) ** 2`。對每個維度各有一個 partial derivative，整個 gradient 與輸入形狀相同。解析式是 `2 * np.sum(x) * np.ones_like(x)`，所以輸入 `[1, 2]` 或 `[1, 3, 0, -1]` 都能用同一個函數計算。這一點是後面參數更新的接口：gradient 不是一個抽象方向名詞，而是一個和參數 tensor 對齊、可逐元素拿來更新的 tensor。

## Computation graph：每個節點保留 value 與 grad

手動對複雜函數逐項微分既繁瑣又容易出錯。來源把問題拆成基本運算，例如 addition、multiplication、`exp`、`log` 等，並指出 autodiff，特別是 reverse-mode automatic differentiation，可以先建立 explicit computation graph，再沿圖遞迴計算 partial derivatives。這裡的資料來源只在文字中提到 PyTorch、JAX 與 Werbos 1974 的連結；本文不替它們補版本、效能或 API 比較。

示範函數仍是 `f(x1, x2) = (x1 + x2) ** 2`。圖的 leaf nodes 是 `Input("x1", 2)` 與 `Input("x2", 3)`；`Add("sum", x1, x2)` 表示加法；`Squared("y", sum)` 表示平方。每個非 input node 都代表對 dependencies 做一個 primitive computation。`forward()` 計算 node 的 `value`，root node `y` 保存整個函數的結果。這一步只是在圖上往前算值，還沒有把影響傳回輸入。

接著要算 `dy/dx1`。程式先把 root 的 `y.grad` 設成與 `y.value` 同形狀的 ones，再把中間節點與 input 的 grad 初始化成 zeros，呼叫 `y.backward()` 與 `sum.backward()`。對平方節點，局部導數是 `2 * x.value`，所以它把收到的上游 gradient 乘上這個局部量後，累加到 `x.grad`。對加法節點，兩個輸入的局部導數都是 1，因此把同一份上游 gradient 分別累加給兩個 dependencies。

這裡的「累加」不可省略。計算圖可能有一個節點被多個後續運算使用；每條路徑都會送回一份對該節點的影響，節點的 `grad` 必須把它們加起來。來源的 `Node` 也把每個節點的 `name`、`dependencies`、`value`、`grad` 分開保存，並提供 `asdict()` 與 Graphviz 圖形表示，讓 forward 的數值和 backward 的導數可以被檢查。

## Chain rule 與 reverse-mode backprop

計算圖的核心數學是 chain rule。若輸出依賴中間值，中間值又依賴輸入，輸入對輸出的影響就等於沿路徑把局部導數相乘；有多條路徑時，再把路徑貢獻加總。`backward()` 的契約也很具體：呼叫它之前，這個 node 的 `grad` 必須已經算好，而且所有 `value` 必須存在；呼叫後，它更新 dependencies 的 partial derivatives。

來源把完整演算法分成兩個 traversal。第一個是從 inputs 到 root 的 topological order，依序呼叫 `forward()`。第二個是從 root 回到 inputs 的反向順序，依序呼叫 `backward()`。`topological_sort` 會遞迴收集 dependencies，確保一個 node 排在它依賴的 nodes 之後。`backpropagation(root)` 先取得這個順序，重新 forward，將所有 grad 設成 zeros，唯獨 root 設成 ones，最後 reverse traversal。

`Input.backward()` 不做事，因為它沒有 dependencies；`Add` 與 `Subtract` 分別把上游 grad 加到兩邊、或對第二邊取負；`Squared` 乘上 `2 * x.value`。矩陣 `Multiply` 則用 `x.grad += self.grad @ y.value.T` 與 `y.grad += x.value.T @ self.grad` 把矩陣乘法的局部導數傳回兩個輸入。這些類別不是一個涵蓋所有 tensor operators 的框架，而是來源為了展示流程實作的有限 primitive 集合。

同一套 `backpropagation` 隨後被套回線性迴歸式的圖：`x` 與 `w` 先進入 `Multiply` 得到 predictions，再減掉 `y` 得 residuals，平方成 losses，最後用一個 ones 矩陣聚合成 `total_loss`。這個例子把前面的標量 objective、局部導數、chain rule 與反向 traversal 串成一個可追蹤的端到端圖；它沒有因此自動包含參數更新，更新要在下一個 learning pipeline 中明確寫出。

## Linear regression：從任務到 hypothesis class

`linear_regression.py` 先用「讀書幾小時，考試得幾分」說明 prediction task：input 是讀書時數，output 是分數。predictor 是把 input 映射到 output 的函數，檔案先示範固定函數 `fixed_f(x) = 2 * x + 1`，再把它對一段輸入畫成曲線。問題是，這條固定規則從哪裡來？答案不是先選一個神奇公式，而是準備 training data，讓 learning algorithm 從資料產生 predictor。

來源的 training data 有三個 `Example1D`：`(1, 4)`、`(2, 6)`、`(4, 7)`。每個 example 是 input-output pair。接下來的三個設計問題是：哪些 predictors 可以選，也就是 hypothesis class；怎麼判斷 predictor 好不好，也就是 loss function；怎麼找到較好的參數，也就是 optimization algorithm。

對一維線性 predictor，參數是 `Parameters1D(weight, bias)`，函數是 `y = params.weight * x + params.bias`。例如 `weight=3, bias=1` 和 `weight=2, bias=0.2` 就是 hypothesis class 中的兩個不同 predictors。這個 class 可以理解成所有可能的 weight 與 bias 組合；選定一組參數，才得到一個具體 predictor。來源再把這個觀念連到 deep learning：hypothesis class 對應 model architecture，predictor 對應 model，而一般模型的 parameters 是一組 tensors。

## Squared loss：先定義「不好」

對一個 `Parameters1D` 和一個 example，`compute_loss` 先算 `residual = f(params, example.input) - example.output`，再回傳 `residual ** 2`。因此，預測與 target 的差距被平方；單一 example 的 loss 是 scalar。對整個 training data，`compute_train_loss` 逐一計算 losses，再用 `np.mean(losses)` 取平均。來源用兩組參數比較 training loss，並把較高的 training loss 判定為較差的 predictor。

這裡要精確區分 training loss 與泛化。程式只計算提供的 training data 上的平均平方損失；它沒有 validation set、test set、held-out evaluation，也沒有報告任何泛化結果。因此，從來源可以說某組參數在這三個 examples 上的 training loss 較低，不能說它對未見資料一定較準。線性 hypothesis class、feature 的選擇、平方損失和資料分布共同決定可學到什麼；若輸入只保留一個讀書時數，這個模型本身看不到其他可能影響分數的因素。

來源另外直接寫出單一 example 的解析 gradient。令 `r = weight * input + bias - output`，loss 是 `r ** 2`，對參數 `[weight, bias]` 的 gradient 是 `2 * r * [input, 1]`。`input` 出現在 weight 的導數中，1 出現在 bias 的導數中。這正是計算圖版本在更小的結構化參數表示上的結果：先有 residual，再經過平方，局部導數依 chain rule 相乘。

## Gradient descent：把 gradient 變成訓練

有了每個 example 的 gradient，`compute_gradient_train_loss` 先收集所有 `compute_grad_loss` 的結果，再沿 example 軸取平均。因此它和 `compute_train_loss` 的平均結構一致：前者平均 gradient，後者平均 loss。`optimization_algorithm` 從 `Parameters1D(weight=0, bias=1)` 開始，計算 training loss 與 gradient，設定 `learning_rate = 0.01`，再用

```text
weight = weight - learning_rate * grad[0]
bias   = bias   - learning_rate * grad[1]
```

更新參數。因為 gradient 指向讓函數上升最快的局部方向，取負號就是往下降方向走；更新後再計算新的 training loss，來源在這個示範中觀察到它變低。

`gradient_descent()` 把這個動作放進迴圈：先取 training data，初始化參數與 learning rate，重複十個 step；每一步都先算 train loss、再算 gradient、再建立新的 `Parameters1D`。這就是 training loop 的最小骨架：evaluate、differentiate、update，反覆進行。它並沒有在每一步保存 loss history、畫 convergence chart，或宣稱十步就是足夠的訓練；這些都是來源沒有提供的細節。

來源最後列出幾個限制與替代方向。learning rate 控制更新速度，涉及速度與穩定性的 trade-off；對 convex functions，來源寫的是 guaranteed to converge，而對 deep learning 則明確說不是如此。來源也列出 stochastic gradient descent 與 Adam，但沒有在這兩個檔案中實作或比較它們。因此不能把這篇的十步 full-batch 更新，誤寫成所有模型或所有資料都適用的訓練 recipe。

## 形狀、表示與界線

兩個 artifact 放在一起時，形狀檢查是最值得保留的習慣。`backpropagation.py` 的矩陣例子把 `x` 寫成兩個 examples、三個 features 的 `2 × 3` 矩陣，`w` 是 `3 × 1` 權重，因此 `x @ w` 是 `2 × 1` predictions；`y` 也是 `2 × 1`，可以逐元素相減。`linear_regression.py` 的 `Parameters1D` 則把只有一個 feature 的 weight 與 bias 存成兩個 scalar 欄位，gradient 用長度 2 的 NumPy array 表示。兩者不是互相矛盾的資料結構，而是同一種「參數形狀要和運算對得上」的不同展示。

還要分清楚三個層次。第一，forward pass 只是依圖或 predictor 算出值；第二，loss 把預測和 targets 的差距整理成可優化的 scalar；第三，backward 與 gradient descent 才把 loss 對參數的敏感度轉成更新。缺任何一層，都不能只靠名詞說自己完成了 learning。尤其是梯度精確不等於模型合理：hypothesis class 可能太窄，feature 可能漏掉訊息，training loss 也可能不能代表未見資料的表現。

本講交付的是可檢查的表示法：確認 `einsum` 軸與 scalar objective，用 finite difference 檢查局部變化，再以 graph、chain rule 與 reverse-mode 求 gradient，最後接上線性迴歸更新。更大模型與 optimizer 比較仍是材料缺口。

## 參考資料

- [Stanford CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [官方可執行講義：backpropagation](https://stanford-cs221.github.io/autumn2025-lectures/?trace=backpropagation)
- [官方可執行講義：linear_regression](https://stanford-cs221.github.io/autumn2025-lectures/?trace=linear_regression)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
